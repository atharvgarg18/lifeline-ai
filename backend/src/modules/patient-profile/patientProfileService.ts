/**
 * Patient Profile Service
 * Business logic for patient profile, dashboard, medical history, QR code, analytics
 */

import QRCode from 'qrcode';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { patientProfileRepository } from './patientProfileRepository';
import { IPatientProfile } from './models/PatientProfile.model';
import { AppError } from '../../utils/AppError';
import { ENV } from '../../config/env';
import {
  PatientDashboard,
  PatientAnalytics,
  QRCodeResponse,
  QRCodePayload,
} from '@shared/types';
import { QR_CODE_EXPIRY_HOURS, PATIENT_ANALYTICS_RANGE_MONTHS } from '@shared/constants';



// Lazy import models to avoid circular deps — resolved at runtime
import '../emergency-sos/models/EmergencySos.model';
import '../appointments/models/Appointment.model';

const getEmergencyModel = () => mongoose.model('EmergencySOS');
const getAppointmentModel = () => mongoose.model('Appointment');

export class PatientProfileService {

  // ─────────────────────────────────────────────────────────────────
  // Profile CRUD
  // ─────────────────────────────────────────────────────────────────

  /**
   * Create or update patient profile
   */
  async upsertProfile(userId: string, data: Partial<IPatientProfile>): Promise<IPatientProfile> {
    // Calculate profile completion
    const completionFields = [
      'bloodGroup', 'allergies', 'chronicDiseases',
      'medications', 'emergencyContacts',
    ];
    const filled = completionFields.filter((f) => {
      const val = (data as any)[f];
      return Array.isArray(val) ? val.length > 0 : Boolean(val);
    });
    const profileCompleted = filled.length >= 4;

    return patientProfileRepository.upsert(userId, { ...data, profileCompleted });
  }

  /**
   * Get profile by userId
   */
  async getProfile(userId: string): Promise<IPatientProfile> {
    const profile = await patientProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient profile not found');
    }
    return profile;
  }

  // ─────────────────────────────────────────────────────────────────
  // Dashboard (P1)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get aggregated patient dashboard data
   */
  async getDashboard(userId: string): Promise<PatientDashboard> {
    const profile = await patientProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient profile not found. Please complete your profile first.');
    }

    const EmergencyModel = getEmergencyModel();
    const AppointmentModel = getAppointmentModel();

    const patientObjId = new mongoose.Types.ObjectId(userId);

    // Run all DB queries in parallel for performance
    const [activeEmergency, recentEmergencies, totalEmergencies, upcomingAppointments, totalAppointments] =
      await Promise.all([
        // Active emergency (only one can be active at a time)
        EmergencyModel.findOne({
          patientId: patientObjId,
          status: { $in: ['INITIATED', 'DISPATCHED', 'IN_TRANSIT', 'HOSPITAL_NOTIFIED', 'ARRIVED', 'ADMITTED', 'IN_TREATMENT'] },
        })
          .select('_id status emergencyType createdAt')
          .sort({ createdAt: -1 })
          .lean()
          .exec(),

        // 3 most recent completed/cancelled emergencies
        EmergencyModel.find({
          patientId: patientObjId,
          status: { $in: ['COMPLETED', 'CANCELLED', 'DISCHARGED'] },
        })
          .select('_id status emergencyType severityScore createdAt')
          .sort({ createdAt: -1 })
          .limit(3)
          .lean()
          .exec(),

        // Total emergency count
        EmergencyModel.countDocuments({ patientId: patientObjId }),

        // Next 2 upcoming appointments
        AppointmentModel.find({
          patientId: patientObjId,
          status: { $in: ['SCHEDULED', 'CONFIRMED'] },
          scheduledAt: { $gte: new Date() },
        })
          .select('_id type scheduledAt specialization status')
          .sort({ scheduledAt: 1 })
          .limit(2)
          .lean()
          .exec(),

        // Total appointment count
        AppointmentModel.countDocuments({ patientId: patientObjId }),
      ]);

    // Last visit: most recent completed appointment or emergency
    const lastEmergency = await EmergencyModel.findOne({ patientId: patientObjId, status: 'COMPLETED' })
      .select('completedAt')
      .sort({ completedAt: -1 })
      .lean()
      .exec();

    // Profile completion percent
    const completionChecks = [
      Boolean(profile.bloodGroup && profile.bloodGroup !== 'UNKNOWN'),
      profile.allergies.length > 0,
      profile.chronicDiseases.length > 0,
      profile.medications.length > 0,
      profile.emergencyContacts.length > 0,
      Boolean(profile.insuranceDetails?.policyNumber),
    ];
    const profileCompletionPercent = Math.round(
      (completionChecks.filter(Boolean).length / completionChecks.length) * 100
    );

    return {
      profile: {
        name: `${(profile as any).firstName || ''} ${(profile as any).lastName || ''}`.trim() || 'Patient',
        bloodGroup: profile.bloodGroup,
        healthIdNumber: profile.healthIdNumber,
        profileCompleted: profile.profileCompleted,
      },
      activeEmergency: activeEmergency
        ? {
            id: (activeEmergency as any)._id.toString(),
            status: (activeEmergency as any).status,
            emergencyType: (activeEmergency as any).emergencyType,
            createdAt: (activeEmergency as any).createdAt?.toISOString(),
          }
        : null,
      recentEmergencies: (recentEmergencies as any[]).map((e) => ({
        _id: e._id.toString(),
        status: e.status,
        emergencyType: e.emergencyType,
        severityScore: e.severityScore,
        createdAt: e.createdAt?.toISOString(),
      })),
      upcomingAppointments: (upcomingAppointments as any[]).map((a) => ({
        _id: a._id.toString(),
        type: a.type,
        scheduledAt: a.scheduledAt?.toISOString(),
        specialization: a.specialization,
        status: a.status,
      })),
      stats: {
        totalEmergencies,
        totalAppointments,
        lastVisitDate: (lastEmergency as any)?.completedAt?.toISOString(),
        profileCompletionPercent,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // Medical History (P2/P3)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get paginated medical history (emergencies + appointments + prescriptions)
   */
  async getMedicalHistory(
    userId: string,
    options: { page: number; limit: number; type?: string }
  ) {
    const { page, limit, type } = options;
    const skip = (page - 1) * limit;
    const patientObjId = new mongoose.Types.ObjectId(userId);

    const EmergencyModel = getEmergencyModel();
    const AppointmentModel = getAppointmentModel();

    const results: any[] = [];
    let total = 0;

    if (!type || type === 'EMERGENCY') {
      const [emergencies, count] = await Promise.all([
        EmergencyModel.find({ patientId: patientObjId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        EmergencyModel.countDocuments({ patientId: patientObjId }),
      ]);
      results.push(
        ...emergencies.map((e: any) => ({ ...e, recordType: 'EMERGENCY' }))
      );
      total += count;
    }

    if (!type || type === 'APPOINTMENT') {
      const [appointments, count] = await Promise.all([
        AppointmentModel.find({ patientId: patientObjId, status: 'COMPLETED' })
          .sort({ scheduledAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        AppointmentModel.countDocuments({ patientId: patientObjId, status: 'COMPLETED' }),
      ]);
      results.push(
        ...appointments.map((a: any) => ({ ...a, recordType: 'APPOINTMENT' }))
      );
      total += count;
    }

    if (!type || type === 'PRESCRIPTION') {
      const profile = await patientProfileRepository.findByUserId(userId);
      const prescriptions = profile?.prescriptions || [];
      const paged = prescriptions.slice(skip, skip + limit);
      results.push(
        ...paged.map((p) => ({ ...p, recordType: 'PRESCRIPTION' }))
      );
      total += prescriptions.length;
    }

    // Sort merged results by date descending
    results.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.scheduledAt || a.prescribedAt).getTime();
      const dateB = new Date(b.createdAt || b.scheduledAt || b.prescribedAt).getTime();
      return dateB - dateA;
    });

    return {
      records: results.slice(0, limit),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // QR Code (P4)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Generate unique patient QR code (JWT-signed, 24h expiry)
   */
  async generateQrCode(userId: string): Promise<QRCodeResponse> {
    const profile = await patientProfileRepository.findByUserId(userId);
    if (!profile) {
      throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient profile not found');
    }

    const expirySeconds = QR_CODE_EXPIRY_HOURS * 60 * 60;
    const expiresAt = new Date(Date.now() + expirySeconds * 1000);

    // Check if existing QR is still valid (< 24h old)
    if (profile.qrCodeToken && profile.qrCodeGeneratedAt) {
      const age = Date.now() - profile.qrCodeGeneratedAt.getTime();
      if (age < expirySeconds * 1000) {
        try {
          jwt.verify(profile.qrCodeToken, ENV.QR_SECRET);
          // Still valid — return existing QR
          const qrPng = await QRCode.toDataURL(profile.qrCodeToken, {
            errorCorrectionLevel: 'H',
            width: 300,
          });
          return {
            qrCodeBase64: qrPng,
            expiresAt: expiresAt.toISOString(),
            healthIdNumber: profile.healthIdNumber,
            generatedAt: profile.qrCodeGeneratedAt.toISOString(),
          };
        } catch {
          // Token expired or invalid — regenerate below
        }
      }
    }

    // Build QR payload
    const payload: Omit<QRCodePayload, 'iat'> = {
      patientId: userId,
      healthIdNumber: profile.healthIdNumber,
      name: `${(profile as any).firstName || ''} ${(profile as any).lastName || ''}`.trim(),
      bloodGroup: profile.bloodGroup,
      allergies: profile.allergies,
      emergencyContacts: profile.emergencyContacts,
      exp: Math.floor(expiresAt.getTime() / 1000),
    };

    // Sign JWT with QR secret
    const token = jwt.sign(payload, ENV.QR_SECRET, { expiresIn: `${QR_CODE_EXPIRY_HOURS}h` });

    // Save token to DB
    await patientProfileRepository.saveQrToken(userId, token);

    // Generate QR PNG as base64 data URL
    const qrPng = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'H', // High error correction (scannable even if partially damaged)
      width: 300,
      margin: 2,
    });

    return {
      qrCodeBase64: qrPng,
      expiresAt: expiresAt.toISOString(),
      healthIdNumber: profile.healthIdNumber,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Verify QR code token and return patient profile (for hospital scanners)
   */
  async verifyQrCode(token: string): Promise<{ patient: IPatientProfile; payload: QRCodePayload }> {
    let payload: QRCodePayload;
    try {
      payload = jwt.verify(token, ENV.QR_SECRET) as QRCodePayload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('QR_CODE_EXPIRED', 401, 'QR code has expired. Patient must regenerate it.');
      }
      throw new AppError('INVALID_QR_CODE', 400, 'Invalid QR code');
    }

    const profile = await patientProfileRepository.findByUserId(payload.patientId);
    if (!profile) {
      throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient not found');
    }

    return { patient: profile, payload };
  }

  // ─────────────────────────────────────────────────────────────────
  // Analytics (P5)
  // ─────────────────────────────────────────────────────────────────

  /**
   * Get personal health analytics for patient
   */
  async getAnalytics(userId: string, rangeMonths?: number): Promise<PatientAnalytics> {
    const months = rangeMonths || PATIENT_ANALYTICS_RANGE_MONTHS;
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const patientObjId = new mongoose.Types.ObjectId(userId);
    const EmergencyModel = getEmergencyModel();
    const AppointmentModel = getAppointmentModel();

    const [profile, emergencies, appointments] = await Promise.all([
      patientProfileRepository.findByUserId(userId),
      EmergencyModel.find({
        patientId: patientObjId,
        createdAt: { $gte: since },
      })
        .select('status emergencyType severityScore createdAt completedAt')
        .lean()
        .exec(),
      AppointmentModel.find({
        patientId: patientObjId,
        createdAt: { $gte: since },
      })
        .select('status specialization scheduledAt')
        .lean()
        .exec(),
    ]);

    // Emergency analytics
    const byType: Record<string, number> = {};
    let totalSeverity = 0;
    let totalResponseTime = 0;
    let responseCount = 0;

    // By month aggregation
    const byMonthMap: Record<string, number> = {};
    (emergencies as any[]).forEach((e) => {
      byType[e.emergencyType] = (byType[e.emergencyType] || 0) + 1;
      if (e.severityScore) totalSeverity += e.severityScore;

      if (e.completedAt && e.createdAt) {
        const responseMin = (new Date(e.completedAt).getTime() - new Date(e.createdAt).getTime()) / 60000;
        totalResponseTime += responseMin;
        responseCount++;
      }

      const monthKey = new Date(e.createdAt).toISOString().substring(0, 7);
      byMonthMap[monthKey] = (byMonthMap[monthKey] || 0) + 1;
    });

    const byMonth = Object.entries(byMonthMap)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Appointment analytics
    const apptCompleted = (appointments as any[]).filter((a) => a.status === 'COMPLETED').length;
    const apptUpcoming = (appointments as any[]).filter((a) => ['SCHEDULED', 'CONFIRMED'].includes(a.status)).length;
    const apptCancelled = (appointments as any[]).filter((a) => a.status === 'CANCELLED').length;

    // Most visited specialization
    const specCount: Record<string, number> = {};
    (appointments as any[]).forEach((a) => {
      if (a.specialization) specCount[a.specialization] = (specCount[a.specialization] || 0) + 1;
    });
    const mostVisitedSpecialization = Object.entries(specCount).sort((a, b) => b[1] - a[1])[0]?.[0];

    // Last checkup (most recent completed appointment)
    const lastAppt = (appointments as any[])
      .filter((a) => a.status === 'COMPLETED')
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0];

    return {
      emergencyHistory: {
        total: emergencies.length,
        byType,
        byMonth,
        avgSeverityScore:
          emergencies.length > 0
            ? Math.round((totalSeverity / emergencies.length) * 10) / 10
            : 0,
        avgResponseTime:
          responseCount > 0
            ? Math.round((totalResponseTime / responseCount) * 10) / 10
            : 0,
      },
      appointments: {
        total: appointments.length,
        completed: apptCompleted,
        upcoming: apptUpcoming,
        cancelled: apptCancelled,
        mostVisitedSpecialization,
      },
      healthTrend: {
        lastCheckupDate: lastAppt?.scheduledAt?.toISOString?.(),
        chronicDiseaseCount: profile?.chronicDiseases?.length || 0,
        activeMedicationsCount: profile?.medications?.length || 0,
        allergyCount: profile?.allergies?.length || 0,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // Prescriptions & Emergency Contacts (helpers)
  // ─────────────────────────────────────────────────────────────────

  async getPrescriptions(userId: string) {
    const profile = await patientProfileRepository.findByUserId(userId);
    if (!profile) throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient profile not found');
    return profile.prescriptions;
  }

  async getEmergencyContacts(userId: string) {
    const profile = await patientProfileRepository.findByUserId(userId);
    if (!profile) throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient profile not found');
    return profile.emergencyContacts;
  }

  async addEmergencyContact(
    userId: string,
    contact: IPatientProfile['emergencyContacts'][0]
  ) {
    const profile = await patientProfileRepository.upsertEmergencyContact(userId, contact);
    if (!profile) throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient profile not found');
    return profile.emergencyContacts;
  }

  async removeEmergencyContact(userId: string, phoneNumber: string) {
    const profile = await patientProfileRepository.removeEmergencyContact(userId, phoneNumber);
    if (!profile) throw new AppError('PATIENT_NOT_FOUND', 404, 'Patient profile not found');
    return profile.emergencyContacts;
  }
}

export const patientProfileService = new PatientProfileService();

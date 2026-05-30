/**
 * Appointment Service
 * Business logic: doctor recommendation, booking, video calls
 */

import axios from 'axios';
import mongoose from 'mongoose';
import { appointmentRepository } from './appointmentRepository';
import { IAppointment } from './models/Appointment.model';
import { AppError } from '../../utils/AppError';
import { ENV } from '../../config/env';
import { DoctorRecommendation, VideoCallSession } from '@shared/types';
import {
  RECOMMENDATION_WEIGHTS,
  APPOINTMENT_DURATION_MINUTES,
  VIDEO_CALL_EXPIRY_HOURS,
} from '@shared/constants';


// Lazy model access to avoid circular dependency
const getDoctorModel = () => mongoose.model('Doctor');


// ─────────────────────────────────────────────────────────────────────────────
// Doctor Recommendation Engine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate distance between two coordinates (Haversine formula), returns km
 */
function haversineKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Normalise a value to [0, 1] based on min/max
 */
function normalise(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export class AppointmentService {

  // ─────────────────────────────────────────────────────────────────
  // AP1: Doctor Recommendation
  // ─────────────────────────────────────────────────────────────────

  /**
   * Recommend doctors personalised to the patient using weighted scoring
   */
  async recommendDoctors(
    patientId: string,
    options: {
      specialization?: string;
      latitude?: number;
      longitude?: number;
      limit?: number;
    }
  ): Promise<DoctorRecommendation[]> {
    const { specialization, latitude, longitude, limit = 5 } = options;
    const DoctorModel = getDoctorModel();

    // Build doctor query

    const doctorQuery: any = {
      availabilityStatus: { $ne: 'OFF_DUTY' },
    };
    if (specialization) doctorQuery.specialization = specialization;

    const doctors = await DoctorModel.find(doctorQuery)
      .populate('userId', 'profile email phoneNumber')
      .populate({
        path: 'hospitalAffiliations',
        select: 'name location',
        model: 'Hospital',
      })
      .lean()
      .exec();

    if (doctors.length === 0) return [];

    // ── Score each doctor ──────────────────────────────────────────

    // Pre-compute ranges for normalisation
    const ratings = doctors.map((d: any) => d.rating || 3);
    const responseTimes = doctors.map((d: any) => d.responseTime || 600);
    const minRating = Math.min(...ratings);
    const maxRating = Math.max(...ratings);
    const minRT = Math.min(...responseTimes);
    const maxRT = Math.max(...responseTimes);

    const scoredDoctors = await Promise.all(
      doctors.map(async (doctor: any) => {
        // Rating score
        const ratingScore = normalise(doctor.rating || 3, minRating, maxRating);

        // Proximity score (inverse distance — closer = higher score)
        let proximityScore = 0.5; // default if no location
        let distanceKm = 0;
        if (latitude !== undefined && longitude !== undefined) {
          const hospital = doctor.hospitalAffiliations?.[0];
          if (hospital?.location?.coordinates) {
            const [hLon, hLat] = hospital.location.coordinates;
            distanceKm = haversineKm(latitude, longitude, hLat, hLon);
            // Invert: 0km → 1.0, 50km → ~0.0
            proximityScore = Math.max(0, 1 - distanceKm / 50);
          }
        }

        // Speed score (lower response time = higher score)
        const rt = doctor.responseTime || 600;
        const speedScore = 1 - normalise(rt, minRT, maxRT);

        // Availability score
        const availabilityScore = doctor.availabilityStatus === 'AVAILABLE' ? 1 : 0.3;

        // Familiarity score
        const familiar = await appointmentRepository.hasPreviousAppointment(
          patientId,
          doctor._id.toString()
        );
        const familiarityScore = familiar ? 1 : 0;

        // Weighted total
        const totalScore =
          ratingScore * RECOMMENDATION_WEIGHTS.RATING +
          proximityScore * RECOMMENDATION_WEIGHTS.PROXIMITY +
          speedScore * RECOMMENDATION_WEIGHTS.SPEED +
          availabilityScore * RECOMMENDATION_WEIGHTS.AVAILABILITY +
          familiarityScore * RECOMMENDATION_WEIGHTS.FAMILIARITY;

        // Build reason string
        const reasons: string[] = [];
        if (ratingScore > 0.8) reasons.push('highly rated');
        if (distanceKm < 5) reasons.push('close proximity');
        if (doctor.availabilityStatus === 'AVAILABLE') reasons.push('available now');
        if (familiar) reasons.push('has treated you before');
        if (speedScore > 0.8) reasons.push('fast response time');

        const hospital = doctor.hospitalAffiliations?.[0];
        const user = doctor.userId as any;

        return {
          doctorId: doctor._id.toString(),
          name: user?.profile
            ? `Dr. ${user.profile.firstName} ${user.profile.lastName}`
            : 'Doctor',
          specialization: doctor.specialization,
          rating: doctor.rating || 3,
          distance: Math.round(distanceKm * 10) / 10,
          availableSlots: doctor.currentAssignmentCount < doctor.maxConcurrentAssignments
            ? doctor.maxConcurrentAssignments - doctor.currentAssignmentCount
            : 0,
          nextAvailable: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // simplified
          recommendationScore: Math.round(totalScore * 100) / 100,
          recommendationReason:
            reasons.length > 0 ? reasons.join(', ') : 'Good match for your needs',
          hospital: {
            name: hospital?.name || 'Independent',
            address: hospital?.location?.address || '',
          },
          responseTime: Math.round(rt / 60), // seconds → minutes
          totalConsultations: doctor.totalConsultations || 0,
        } as DoctorRecommendation;
      })
    );

    // Sort by score descending, return top N
    return scoredDoctors
      .sort((a: DoctorRecommendation, b: DoctorRecommendation) => b.recommendationScore - a.recommendationScore)
      .slice(0, limit);

  }

  // ─────────────────────────────────────────────────────────────────
  // AP2: Book Appointment
  // ─────────────────────────────────────────────────────────────────

  async bookAppointment(
    patientId: string,
    data: {
      doctorId: string;
      type: IAppointment['type'];
      scheduledAt: string;
      reason: string;
      specialization: string;
      hospitalId?: string;
      recommendationScore?: number;
      recommendationReason?: string;
    }
  ): Promise<IAppointment> {
    const DoctorModel = getDoctorModel();

    // Validate doctor exists
    const doctor = await DoctorModel.findById(data.doctorId).lean().exec();
    if (!doctor) throw new AppError('DOCTOR_NOT_FOUND', 404, 'Doctor not found');

    const scheduledAt = new Date(data.scheduledAt);
    if (isNaN(scheduledAt.getTime())) {
      throw new AppError('VALIDATION_ERROR', 400, 'Invalid scheduledAt date format');
    }

    if (scheduledAt < new Date()) {
      throw new AppError('VALIDATION_ERROR', 400, 'Appointment must be scheduled in the future');
    }

    // Check for scheduling conflict
    const hasConflict = await appointmentRepository.hasConflict(
      data.doctorId,
      scheduledAt,
      APPOINTMENT_DURATION_MINUTES
    );
    if (hasConflict) {
      throw new AppError(
        'APPOINTMENT_CONFLICT',
        409,
        'Doctor already has an appointment at this time. Please choose another slot.'
      );
    }

    // Create appointment
    const appointment = await appointmentRepository.create({
      patientId: new mongoose.Types.ObjectId(patientId),
      doctorId: new mongoose.Types.ObjectId(data.doctorId),
      ...(data.hospitalId && { hospitalId: new mongoose.Types.ObjectId(data.hospitalId) }),
      type: data.type,
      status: 'SCHEDULED',
      scheduledAt,
      durationMinutes: APPOINTMENT_DURATION_MINUTES,
      reason: data.reason,
      specialization: data.specialization,
      recommendationScore: data.recommendationScore,
      recommendationReason: data.recommendationReason,
    } as Partial<IAppointment>);

    return appointment;
  }

  // ─────────────────────────────────────────────────────────────────
  // AP3: Video Call
  // ─────────────────────────────────────────────────────────────────

  /**
   * Start or retrieve a video call session for an appointment
   */
  async startVideoCall(
    appointmentId: string,
    requesterId: string
  ): Promise<VideoCallSession> {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('APPOINTMENT_NOT_FOUND', 404, 'Appointment not found');
    }

    // Verify requester is patient or doctor for this appointment
    const isPatient = appointment.patientId.toString() === requesterId;
    const isDoctor = appointment.doctorId.toString() === requesterId;
    if (!isPatient && !isDoctor) {
      throw new AppError('FORBIDDEN', 403, 'Not authorized for this appointment');
    }

    if (appointment.type !== 'VIDEO_CALL') {
      throw new AppError('INVALID_APPOINTMENT_TYPE', 400, 'This appointment is not a video call');
    }

    // If video call already started, return existing session
    if (appointment.videoCallRoomId && appointment.videoCallExpiresAt) {
      if (appointment.videoCallExpiresAt > new Date()) {
        return {
          appointmentId,
          videoCallUrl: appointment.videoCallUrl!,
          patientToken: appointment.videoCallToken!,
          doctorToken: appointment.doctorVideoToken!,
          roomId: appointment.videoCallRoomId,
          expiresAt: appointment.videoCallExpiresAt.toISOString(),
          provider: appointment.videoCallProvider || 'jitsi',
        };
      }
    }

    // Try Daily.co first, fall back to Jitsi
    const videoData = ENV.DAILY_API_KEY
      ? await this.createDailyRoom(appointmentId)
      : this.createJitsiRoom(appointmentId);

    const expiresAt = new Date(Date.now() + VIDEO_CALL_EXPIRY_HOURS * 60 * 60 * 1000);

    // Persist to DB
    await appointmentRepository.updateVideoCall(appointmentId, {
      videoCallRoomId: videoData.roomId,
      videoCallUrl: videoData.url,
      videoCallToken: videoData.patientToken,
      doctorVideoToken: videoData.doctorToken,
      videoCallExpiresAt: expiresAt,
      videoCallProvider: videoData.provider,
    });

    return {
      appointmentId,
      videoCallUrl: videoData.url,
      patientToken: videoData.patientToken,
      doctorToken: videoData.doctorToken,
      roomId: videoData.roomId,
      expiresAt: expiresAt.toISOString(),
      provider: videoData.provider,
    };
  }

  /**
   * Create a Daily.co meeting room via REST API
   */
  private async createDailyRoom(appointmentId: string) {
    const roomName = `lifeline-${appointmentId}`;
    const expiresAt = Math.floor(Date.now() / 1000) + VIDEO_CALL_EXPIRY_HOURS * 3600;

    const { data: room } = await axios.post(
      `${ENV.DAILY_API_URL}/rooms`,
      {
        name: roomName,
        properties: {
          exp: expiresAt,
          enable_chat: true,
          enable_screenshare: false,
          start_video_off: false,
          start_audio_off: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.DAILY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Generate participant tokens
    const [patientToken, doctorToken] = await Promise.all([
      this.createDailyToken(roomName, 'patient', expiresAt),
      this.createDailyToken(roomName, 'doctor', expiresAt),
    ]);

    return {
      roomId: room.name,
      url: room.url,
      patientToken,
      doctorToken,
      provider: 'daily' as const,
    };
  }

  private async createDailyToken(roomName: string, role: string, exp: number): Promise<string> {
    const { data } = await axios.post(
      `${ENV.DAILY_API_URL}/meeting-tokens`,
      {
        properties: {
          room_name: roomName,
          exp,
          user_name: role === 'doctor' ? 'Doctor' : 'Patient',
          is_owner: role === 'doctor', // Doctor is room owner (can control recording etc.)
        },
      },
      {
        headers: { Authorization: `Bearer ${ENV.DAILY_API_KEY}` },
      }
    );
    return data.token;
  }

  /**
   * Create Jitsi Meet room (no API needed — just a URL)
   */
  private createJitsiRoom(appointmentId: string) {
    const roomName = `LifeLine-${appointmentId}`;
    const url = `https://meet.jit.si/${roomName}`;

    return {
      roomId: roomName,
      url,
      patientToken: '', // Jitsi public rooms don't use tokens
      doctorToken: '',
      provider: 'jitsi' as const,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // AP4: Get My Appointments
  // ─────────────────────────────────────────────────────────────────

  async getMyAppointments(
    patientId: string,
    options: { status?: string; page: number; limit: number }
  ) {
    return appointmentRepository.findByPatient(patientId, options);
  }

  async getAppointmentById(appointmentId: string): Promise<IAppointment> {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('APPOINTMENT_NOT_FOUND', 404, 'Appointment not found');
    }
    return appointment;
  }

  async cancelAppointment(appointmentId: string, requesterId: string): Promise<IAppointment> {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      throw new AppError('APPOINTMENT_NOT_FOUND', 404, 'Appointment not found');
    }

    const isPatient = appointment.patientId.toString() === requesterId;
    const isDoctor = appointment.doctorId.toString() === requesterId;
    if (!isPatient && !isDoctor) {
      throw new AppError('FORBIDDEN', 403, 'Not authorized for this appointment');
    }

    if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) {
      throw new AppError('APPOINTMENT_CANNOT_CANCEL', 409, `Cannot cancel an appointment with status: ${appointment.status}`);
    }

    const updated = await appointmentRepository.updateStatus(appointmentId, 'CANCELLED');
    return updated!;
  }
}

export const appointmentService = new AppointmentService();

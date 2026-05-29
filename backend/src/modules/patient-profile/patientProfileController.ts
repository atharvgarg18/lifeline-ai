/**
 * Patient Profile Controller
 * HTTP request handlers for all patient profile endpoints
 */

import type { Request, Response, NextFunction } from 'express';
import { patientProfileService } from './patientProfileService';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/response';
import { AppError } from '../../utils/AppError';

export class PatientProfileController {

  /**
   * POST /api/v1/patient/profile
   * Create or update patient profile
   */
  async upsertProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await patientProfileService.upsertProfile(userId, req.body);
      sendCreated(res, {
        patientId: profile._id,
        healthIdNumber: profile.healthIdNumber,
        profileCompleted: profile.profileCompleted,
        updatedAt: profile.updatedAt,
      }, 'Profile saved successfully');
    } catch (err) { next(err); }
  }

  /**
   * GET /api/v1/patient/profile
   * Get own patient profile
   */
  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const profile = await patientProfileService.getProfile(userId);
      sendSuccess(res, { data: profile });
    } catch (err) { next(err); }
  }

  /**
   * GET /api/v1/patient/profile/:patientId
   * Get patient profile by ID (for doctors/hospital admins)
   */
  async getProfileById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { patientId } = req.params;
      const profile = await patientProfileService.getProfile(patientId);
      sendSuccess(res, { data: profile });
    } catch (err) { next(err); }
  }

  /**
   * GET /api/v1/patient/dashboard
   * Aggregated dashboard data — P1
   */
  async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dashboard = await patientProfileService.getDashboard(userId);
      sendSuccess(res, { data: dashboard });
    } catch (err) { next(err); }
  }

  /**
   * GET /api/v1/patient/medical-history
   * Paginated medical history — P2/P3
   * Query: ?page=1&limit=20&type=EMERGENCY|APPOINTMENT|PRESCRIPTION
   */
  async getMedicalHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, parseInt(req.query.limit as string) || 20);
      const type = req.query.type as string | undefined;

      const result = await patientProfileService.getMedicalHistory(userId, { page, limit, type });

      sendPaginated(res, {
        data: result.records,
        page,
        limit,
        total: result.pagination.total,
      });
    } catch (err) { next(err); }
  }

  /**
   * GET /api/v1/patient/qr-code
   * Generate/get patient QR code — P4
   */
  async getQrCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const qrData = await patientProfileService.generateQrCode(userId);
      sendSuccess(res, { data: qrData });
    } catch (err) { next(err); }
  }

  /**
   * POST /api/v1/patient/qr-verify
   * Verify a scanned QR code token (for hospital scanners)
   * Body: { token: string }
   */
  async verifyQrCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      if (!token) throw new AppError('VALIDATION_ERROR', 400, 'QR token is required');

      const { patient, payload } = await patientProfileService.verifyQrCode(token);

      sendSuccess(res, {
        data: {
          patientId: payload.patientId,
          healthIdNumber: payload.healthIdNumber,
          name: payload.name,
          bloodGroup: payload.bloodGroup,
          allergies: payload.allergies,
          emergencyContacts: payload.emergencyContacts,
          chronicDiseases: patient.chronicDiseases,
          medications: patient.medications,
          insuranceDetails: patient.insuranceDetails,
        },
        message: 'QR code verified successfully',
      });
    } catch (err) { next(err); }
  }

  /**
   * GET /api/v1/patient/analytics
   * Personal health analytics — P5
   * Query: ?range=6 (months, default 12)
   */
  async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const rangeMonths = parseInt(req.query.range as string) || 12;
      const analytics = await patientProfileService.getAnalytics(userId, rangeMonths);
      sendSuccess(res, { data: analytics });
    } catch (err) { next(err); }
  }

  /**
   * GET /api/v1/patient/prescriptions
   */
  async getPrescriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const prescriptions = await patientProfileService.getPrescriptions(userId);
      sendSuccess(res, { data: prescriptions });
    } catch (err) { next(err); }
  }

  /**
   * GET /api/v1/patient/emergency-contacts
   */
  async getEmergencyContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const contacts = await patientProfileService.getEmergencyContacts(userId);
      sendSuccess(res, { data: contacts });
    } catch (err) { next(err); }
  }

  /**
   * POST /api/v1/patient/emergency-contacts
   */
  async addEmergencyContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const contacts = await patientProfileService.addEmergencyContact(userId, req.body);
      sendSuccess(res, { data: contacts, message: 'Emergency contact added' });
    } catch (err) { next(err); }
  }

  /**
   * DELETE /api/v1/patient/emergency-contacts/:phone
   */
  async removeEmergencyContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { phone } = req.params;
      const contacts = await patientProfileService.removeEmergencyContact(userId, decodeURIComponent(phone));
      sendSuccess(res, { data: contacts, message: 'Emergency contact removed' });
    } catch (err) { next(err); }
  }
}

export const patientProfileController = new PatientProfileController();

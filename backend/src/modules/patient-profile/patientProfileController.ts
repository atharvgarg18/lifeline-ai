import { Request, Response, NextFunction } from 'express';
import { QRService } from '../hms/services/qrService';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/AppError';
import { patientProfileRepository } from './patientProfileRepository';
import { UserModel } from '../auth/User.model';

/**
 * Patient Profile Controllers
 */
export class PatientProfileController {
  /**
   * Generate QR code for authenticated patient
   * POST /api/v1/patient-profile/qr/generate
   * Requires: Authentication
   */
  static async generateQR(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get authenticated user ID from JWT
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('UNAUTHORIZED', 401, 'Authentication required');
      }

      // Get user details
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new AppError('USER_NOT_FOUND', 404, 'User not found');
      }

      // Get patient profile
      const profile = await patientProfileRepository.findByUserId(userId);
      if (!profile) {
        throw new AppError('PROFILE_NOT_FOUND', 404, 'Patient profile not found');
      }

      // Generate QR code with user ID (not patient ID)
      const qrCode = await QRService.generateQRCode(
        userId, 
        profile.healthIdNumber,
        user.name,
        user.email,
        user.phone
      );

      res.status(201).json(
        successResponse({
          qrCodeId: qrCode.qrCodeId,
          qrData: qrCode.qrData,
          expiresAt: qrCode.expiresAt,
          generatedAt: new Date(),
          status: 'ACTIVE',
          patientInfo: {
            userId: userId,
            healthIdNumber: profile.healthIdNumber,
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
        }, 'QR code generated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active QR code for authenticated patient
   * GET /api/v1/patient-profile/qr/active
   * Requires: Authentication
   */
  static async getActiveQR(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get authenticated user ID from JWT
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('UNAUTHORIZED', 401, 'Authentication required');
      }

      // Get user details
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new AppError('USER_NOT_FOUND', 404, 'User not found');
      }

      // Get patient profile
      const profile = await patientProfileRepository.findByUserId(userId);
      if (!profile) {
        throw new AppError('PROFILE_NOT_FOUND', 404, 'Patient profile not found');
      }

      // Get active QR code
      const qrCode = await QRService.getActiveQRCode(userId);

      if (!qrCode) {
        res.json(
          successResponse(null, 'No active QR code found')
        );
        return;
      }

      res.json(
        successResponse({
          qrCodeId: qrCode.qrCodeId,
          qrData: qrCode.qrData,
          expiresAt: qrCode.expiresAt,
          generatedAt: qrCode.generatedAt,
          status: qrCode.status,
          patientInfo: {
            userId: userId,
            healthIdNumber: profile.healthIdNumber,
            name: user.name,
            email: user.email,
            phone: user.phone,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get authenticated patient profile
   * GET /api/v1/patient-profile/me
   * Requires: Authentication
   */
  static async getMyProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Get authenticated user ID from JWT
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('UNAUTHORIZED', 401, 'Authentication required');
      }

      // Get user details
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new AppError('USER_NOT_FOUND', 404, 'User not found');
      }

      // Get patient profile
      const profile = await patientProfileRepository.findByUserId(userId);
      if (!profile) {
        throw new AppError('PROFILE_NOT_FOUND', 404, 'Patient profile not found');
      }

      res.json(
        successResponse({
          userId: user._id,
          healthIdNumber: profile.healthIdNumber,
          name: user.name,
          email: user.email,
          phone: user.phone,
          bloodGroup: profile.bloodGroup,
          allergies: profile.allergies || [],
          chronicDiseases: profile.chronicDiseases || [],
          medications: profile.medications || [],
          emergencyContacts: profile.emergencyContacts || [],
          profileCompleted: profile.profileCompleted,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

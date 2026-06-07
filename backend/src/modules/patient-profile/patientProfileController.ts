import { Request, Response, NextFunction } from 'express';
import { QRService } from '../hms/services/qrService';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/AppError';

/**
 * Patient Profile Controllers
 */
export class PatientProfileController {
  /**
   * Generate QR code for patient
   * POST /api/v1/patient-profile/patients/:patientId/qr/generate
   */
  static async generateQR(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        throw new AppError('MISSING_PATIENT_ID', 400, 'Patient ID is required');
      }

      // Generate QR code with unique identifier
      const qrCode = await QRService.generateQRCode(patientId);

      res.status(201).json(
        successResponse({
          qrCodeId: qrCode.qrCodeId,
          qrData: qrCode.qrData,
          expiresAt: qrCode.expiresAt,
          generatedAt: new Date(),
          status: 'ACTIVE',
        }, 'QR code generated successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get active QR code for patient
   * GET /api/v1/patient-profile/patients/:patientId/qr/active
   */
  static async getActiveQR(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;

      if (!patientId) {
        throw new AppError('MISSING_PATIENT_ID', 400, 'Patient ID is required');
      }

      // Get active QR code
      const qrCode = await QRService.getActiveQRCode(patientId);

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
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get patient profile
   * GET /api/v1/patient-profile/patients/:patientId
   */
  static async getPatientProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { patientId } = req.params;

      // TODO: Implement actual patient profile fetch
      // For now, return mock data
      res.json(
        successResponse({
          patientId,
          name: 'Mock Patient',
          age: 35,
          gender: 'MALE',
          bloodGroup: 'O+',
          phone: '+91-9876543210',
          email: 'patient@example.com',
          allergies: ['Penicillin'],
          chronicDiseases: ['Hypertension'],
          emergencyContacts: [
            {
              name: 'John Doe',
              relationship: 'Spouse',
              phone: '+91-9876543211',
            },
          ],
        })
      );
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { QRService } from '../services/qrService';
import { AdmissionService } from '../services/admissionService';
import { BedService } from '../services/bedService';
import { EmergencyDispatchService } from '../services/emergencyDispatchService';
import { successResponse } from '../../../utils/response';
import { AppError } from '../../../utils/AppError';

/**
 * HMS Controllers
 */
export class HMSController {
  /**
   * Scan and validate QR code
   * POST /api/v1/hms/qr/scan
   */
  static async scanQRCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { qrData, hospitalId } = req.body;

      if (!qrData || !hospitalId) {
        throw new AppError('QR data and hospital ID are required', 400);
      }

      // Validate QR code
      const validation = await QRService.validateQRCode(qrData);

      if (!validation.valid) {
        res.status(400).json({
          success: false,
          message: validation.reason,
          expired: validation.expired,
        });
        return;
      }

      // Get patient data (assume we have patient service)
      // const patient = await PatientService.getPatient(validation.patientId!);

      // Mock patient data for now
      const patient = {
        patientId: validation.patientId,
        name: 'Mock Patient',
        age: 35,
        gender: 'MALE',
        bloodGroup: 'O+',
        allergies: ['Penicillin'],
        chronicDiseases: ['Hypertension'],
        emergencyContacts: [],
        medicalHistory: [],
      };

      res.json(
        successResponse({
          qrValid: true,
          canAdmit: true,
          qrCodeId: validation.qrCodeId,
          patient,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Quick admit patient (one-click admission)
   * POST /api/v1/hms/admission/quick-admit
   */
  static async quickAdmit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        patientId,
        hospitalId,
        admissionType,
        bedType,
        symptoms,
        vitals,
        qrCodeId,
      } = req.body;

      // Validate required fields
      if (!patientId || !hospitalId || !admissionType || !bedType || !symptoms) {
        throw new AppError('Missing required fields', 400);
      }

      // Get user ID from auth middleware
      const admittedBy = (req as any).user?.userId || 'admin';

      // Create admission
      const admission = await AdmissionService.quickAdmit({
        patientId,
        hospitalId,
        admittedBy,
        admissionType,
        bedType,
        symptoms,
        vitals,
        qrCodeId,
      });

      res.status(201).json(
        successResponse(admission, 'Patient admitted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get pending emergency requests for hospital
   * GET /api/v1/hms/emergency/pending
   */
  static async getPendingEmergencies(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { hospitalId } = req.query;

      if (!hospitalId) {
        throw new AppError('Hospital ID is required', 400);
      }

      // Get requests where hospital is in current batch and status is PENDING
      const EmergencyRequest = require('../models/EmergencyRequest.model').EmergencyRequest;
      
      const requests = await EmergencyRequest.find({
        status: 'PENDING',
        'notificationBatches.hospitals.hospitalId': hospitalId,
      }).sort({ createdAt: -1 });

      // Filter only current batch for this hospital
      const filteredRequests = requests.map((req: any) => {
        const currentBatch = req.notificationBatches[req.currentBatch - 1];
        const hospitalInBatch = currentBatch?.hospitals.find(
          (h: any) => h.hospitalId === hospitalId
        );

        if (!hospitalInBatch) return null;

        return {
          requestId: req.requestId,
          emergencyId: req.emergencyId,
          patientId: req.patientId,
          symptoms: req.symptoms,
          severity: req.severity,
          requiredBedType: req.requiredBedType,
          distance: hospitalInBatch.distance,
          eta: hospitalInBatch.eta,
          score: hospitalInBatch.score,
          batchNumber: currentBatch.batchNumber,
          timeoutAt: currentBatch.timeout,
          createdAt: req.createdAt,
        };
      }).filter(Boolean);

      res.json(
        successResponse({
          requests: filteredRequests,
          count: filteredRequests.length,
        })
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Accept emergency request
   * POST /api/v1/hms/emergency/accept
   */
  static async acceptEmergency(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { requestId, hospitalId, bedId } = req.body;

      if (!requestId || !hospitalId || !bedId) {
        throw new AppError('Missing required fields', 400);
      }

      const result = await EmergencyDispatchService.acceptEmergency(
        requestId,
        hospitalId,
        bedId
      );

      res.json(
        successResponse(result, 'Emergency accepted successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject emergency request
   * POST /api/v1/hms/emergency/reject
   */
  static async rejectEmergency(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { requestId, hospitalId, reason } = req.body;

      if (!requestId || !hospitalId) {
        throw new AppError('Request ID and Hospital ID are required', 400);
      }

      await EmergencyDispatchService.rejectEmergency(
        requestId,
        hospitalId,
        reason || 'No reason provided'
      );

      res.json(
        successResponse(null, 'Emergency rejected')
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get hospital beds
   * GET /api/v1/hms/beds
   */
  static async getBeds(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { hospitalId, status, bedType, ward, floor } = req.query;

      if (!hospitalId) {
        throw new AppError('Hospital ID is required', 400);
      }

      const beds = await BedService.getHospitalBeds(hospitalId as string, {
        status: status as string,
        bedType: bedType as string,
        ward: ward as string,
        floor: floor ? parseInt(floor as string) : undefined,
      });

      res.json(successResponse({ beds, count: beds.length }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get bed availability summary
   * GET /api/v1/hms/beds/availability
   */
  static async getBedAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { hospitalId } = req.query;

      if (!hospitalId) {
        throw new AppError('Hospital ID is required', 400);
      }

      const availability = await BedService.getBedAvailability(hospitalId as string);

      res.json(successResponse(availability));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Allocate bed
   * POST /api/v1/hms/beds/allocate
   */
  static async allocateBed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bedId, patientId, admissionId } = req.body;

      if (!bedId || !patientId || !admissionId) {
        throw new AppError('Missing required fields', 400);
      }

      const bed = await BedService.allocateBed(bedId, patientId, admissionId);

      res.json(successResponse(bed, 'Bed allocated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Release bed
   * POST /api/v1/hms/beds/release
   */
  static async releaseBed(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { bedId } = req.body;

      if (!bedId) {
        throw new AppError('Bed ID is required', 400);
      }

      const bed = await BedService.releaseBed(bedId);

      res.json(successResponse(bed, 'Bed released successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get hospital admissions
   * GET /api/v1/hms/admissions
   */
  static async getAdmissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { hospitalId, status, admissionType, fromDate, toDate } = req.query;

      if (!hospitalId) {
        throw new AppError('Hospital ID is required', 400);
      }

      const admissions = await AdmissionService.getHospitalAdmissions(
        hospitalId as string,
        {
          status: status as string,
          admissionType: admissionType as any,
          fromDate: fromDate ? new Date(fromDate as string) : undefined,
          toDate: toDate ? new Date(toDate as string) : undefined,
        }
      );

      res.json(successResponse({ admissions, count: admissions.length }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get admission details
   * GET /api/v1/hms/admissions/:admissionId
   */
  static async getAdmission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { admissionId } = req.params;

      const admission = await AdmissionService.getAdmission(admissionId);

      if (!admission) {
        throw new AppError('Admission not found', 404);
      }

      res.json(successResponse(admission));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update patient vitals
   * POST /api/v1/hms/admissions/:admissionId/vitals
   */
  static async updateVitals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { admissionId } = req.params;
      const vitals = req.body;

      const admission = await AdmissionService.updateVitals(admissionId, vitals);

      res.json(successResponse(admission, 'Vitals updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Discharge patient
   * POST /api/v1/hms/admissions/:admissionId/discharge
   */
  static async dischargePatient(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { admissionId } = req.params;
      const dischargeSummary = req.body;

      // Get user ID from auth
      dischargeSummary.dischargedBy = (req as any).user?.userId || 'admin';

      const admission = await AdmissionService.dischargePatient(
        admissionId,
        dischargeSummary
      );

      res.json(successResponse(admission, 'Patient discharged successfully'));
    } catch (error) {
      next(error);
    }
  }
}

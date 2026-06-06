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
        throw new AppError('MISSING_REQUIRED_FIELDS', 400, 'QR data and hospital ID are required');
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
        throw new AppError('MISSING_REQUIRED_FIELDS', 400, 'Missing required fields');
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
        throw new AppError('MISSING_HOSPITAL_ID', 400, 'Hospital ID is required');
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
        throw new AppError('MISSING_REQUIRED_FIELDS', 400, 'Missing required fields');
      }

      // Use EmergencySOS model instead of EmergencyRequest
      const { EmergencySosModel } = await import('../../emergency-sos/models/EmergencySos.model');
      const { Bed } = await import('../models/Bed.model');
      const { Hospital } = await import('../models/Hospital.model');
      
      // Find emergency
      const emergency = await EmergencySosModel.findById(requestId);
      
      if (!emergency) {
        throw new AppError('EMERGENCY_NOT_FOUND', 404, 'Emergency not found');
      }

      if (emergency.status !== 'INITIATED' && emergency.status !== 'DISPATCHED') {
        throw new AppError('EMERGENCY_NOT_PENDING', 400, 'Emergency is no longer pending');
      }

      // Verify bed availability
      const bed = await Bed.findOne({
        bedId,
        hospitalId,
        status: 'AVAILABLE',
      });

      if (!bed) {
        throw new AppError('BED_NOT_AVAILABLE', 400, 'Selected bed is not available');
      }

      // Get hospital details
      const hospital = await Hospital.findOne({ hospitalId });

      if (!hospital) {
        throw new AppError('HOSPITAL_NOT_FOUND', 404, 'Hospital not found');
      }

      // Update emergency status
      emergency.status = 'HOSPITAL_NOTIFIED';
      emergency.assignedHospitalId = hospitalId;
      emergency.assignedAmbulanceId = undefined; // TODO: Assign ambulance
      
      // Add timeline entry
      emergency.timeline.push({
        status: 'HOSPITAL_NOTIFIED',
        timestamp: new Date().toISOString(),
        note: `Accepted by ${hospital.name}, Bed ${bed.bedNumber} allocated`,
      });

      await emergency.save();

      // Allocate bed
      bed.status = 'OCCUPIED';
      bed.currentPatient = {
        patientId: emergency.patientId,
        admissionId: requestId, // Using emergency ID as admission ID for now
        admittedAt: new Date(),
      };
      await bed.save();

      // Emit WebSocket event to patient
      const io = (global as any).io;
      if (io) {
        io.to(`emergency:${requestId}`).emit('emergency:accepted', {
          emergencyId: requestId,
          hospitalId,
          hospitalName: hospital.name,
          bedId,
          bedNumber: bed.bedNumber,
          ward: bed.ward,
          floor: bed.floor,
          eta: 30, // minutes
        });
      }

      // Emit to other hospitals that request was accepted
      const hospitalIds = ['HOSP-001', 'HOSP-002', 'HOSP-003', 'HOSP-004', 'HOSP-005'];
      hospitalIds.forEach((hId) => {
        if (hId !== hospitalId && io) {
          io.to(`hospital:${hId}`).emit('emergency:accepted_by_other', {
            requestId,
            hospitalId,
            hospitalName: hospital.name,
          });
        }
      });

      res.json(
        successResponse({
          emergencyId: requestId,
          hospitalId,
          bedId,
          bedNumber: bed.bedNumber,
          status: 'ACCEPTED',
        }, 'Emergency accepted successfully')
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
        throw new AppError('MISSING_REQUIRED_FIELDS', 400, 'Request ID and Hospital ID are required');
      }

      // Use EmergencySOS model
      const { EmergencySosModel } = await import('../../emergency-sos/models/EmergencySos.model');
      
      // Find emergency
      const emergency = await EmergencySosModel.findById(requestId);
      
      if (!emergency) {
        throw new AppError('EMERGENCY_NOT_FOUND', 404, 'Emergency not found');
      }

      if (emergency.status !== 'INITIATED' && emergency.status !== 'DISPATCHED') {
        throw new AppError('EMERGENCY_NOT_PENDING', 400, 'Emergency is no longer pending');
      }

      // Add timeline entry
      emergency.timeline.push({
        status: emergency.status, // Keep current status
        timestamp: new Date().toISOString(),
        note: `Rejected by ${hospitalId}: ${reason || 'No reason provided'}`,
      });

      await emergency.save();

      // TODO: If all hospitals reject, escalate or try next batch

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
        throw new AppError('MISSING_HOSPITAL_ID', 400, 'Hospital ID is required');
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
        throw new AppError('MISSING_HOSPITAL_ID', 400, 'Hospital ID is required');
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
        throw new AppError('MISSING_REQUIRED_FIELDS', 400, 'Missing required fields');
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
        throw new AppError('MISSING_BED_ID', 400, 'Bed ID is required');
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
        throw new AppError('MISSING_HOSPITAL_ID', 400, 'Hospital ID is required');
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
        throw new AppError('ADMISSION_NOT_FOUND', 404, 'Admission not found');
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

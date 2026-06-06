import { Hospital, IHospital } from '../models/Hospital.model';
import { EmergencyRequest } from '../models/EmergencyRequest.model';
import { Bed } from '../models/Bed.model';
import { AppError } from '../../../utils/AppError';
import { calculateDistance } from '../../../utils/geolocation';

const BATCH_SIZE = 5;
const BATCH_TIMEOUT_MS = 120000; // 2 minutes

interface EmergencyDetails {
  emergencyId: string;
  patientId: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  symptoms: string[];
  severity: number;
  requiredBedType: string;
  requiredSpecialization?: string;
}

interface HospitalScore {
  hospital: IHospital;
  score: number;
  distance: number;
  eta: number;
  availableBeds: number;
}

export class EmergencyDispatchService {
  /**
   * Initiate emergency dispatch to hospitals
   */
  static async dispatchEmergency(emergencyDetails: EmergencyDetails): Promise<string> {
    // Create emergency request
    const requestId = `EMR-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    const emergencyRequest = await EmergencyRequest.create({
      requestId,
      emergencyId: emergencyDetails.emergencyId,
      patientId: emergencyDetails.patientId,
      location: emergencyDetails.location,
      symptoms: emergencyDetails.symptoms,
      severity: emergencyDetails.severity,
      requiredBedType: emergencyDetails.requiredBedType,
      requiredSpecialization: emergencyDetails.requiredSpecialization,
      status: 'PENDING',
      notificationBatches: [],
      currentBatch: 0,
    });

    // Score and rank hospitals
    const scoredHospitals = await this.scoreHospitals(emergencyDetails);

    if (scoredHospitals.length === 0) {
      throw new AppError('NO_HOSPITALS_AVAILABLE', 404, 'No hospitals available for emergency');
    }

    // Send first batch
    await this.sendBatch(requestId, scoredHospitals, 1);

    // Schedule automatic batch progression (handled by background job)
    // In production, use Bull queue or similar
    this.scheduleBatchProgression(requestId, scoredHospitals);

    return requestId;
  }

  /**
   * Score and rank hospitals based on multiple factors
   */
  private static async scoreHospitals(
    emergencyDetails: EmergencyDetails
  ): Promise<HospitalScore[]> {
    // Find active hospitals with required bed type
    const hospitals = await Hospital.find({
      status: 'ACTIVE',
    });

    const hospitalScores: HospitalScore[] = [];

    for (const hospital of hospitals) {
      // Check bed availability
      const availableBeds = await Bed.countDocuments({
        hospitalId: hospital.hospitalId,
        bedType: emergencyDetails.requiredBedType,
        status: 'AVAILABLE',
      });

      if (availableBeds === 0) {
        continue; // Skip hospitals with no available beds
      }

      // Calculate distance
      const distance = calculateDistance(
        emergencyDetails.location.coordinates,
        hospital.location.coordinates
      );

      // Calculate ETA (assuming 40 km/h average speed for ambulance)
      const eta = Math.ceil((distance / 40) * 60); // minutes

      // Calculate score
      const score = this.calculateHospitalScore(
        hospital,
        distance,
        availableBeds,
        emergencyDetails
      );

      hospitalScores.push({
        hospital,
        score,
        distance,
        eta,
        availableBeds,
      });
    }

    // Sort by score (highest first)
    return hospitalScores.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate hospital score based on multiple factors
   */
  private static calculateHospitalScore(
    hospital: IHospital,
    distance: number,
    availableBeds: number,
    emergencyDetails: EmergencyDetails
  ): number {
    let score = 100;

    // Distance factor (closer = higher score)
    // Max penalty: 50 points for distance > 50km
    const distancePenalty = Math.min(distance * 1, 50);
    score -= distancePenalty;

    // Bed availability bonus
    score += Math.min(availableBeds * 2, 20); // Max 20 points

    // Specialization match
    if (
      emergencyDetails.requiredSpecialization &&
      hospital.specializations.includes(emergencyDetails.requiredSpecialization)
    ) {
      score += 30;
    }

    // Severity-based facility requirements
    if (emergencyDetails.severity >= 8) {
      // Critical cases - prioritize ICU capability
      if (hospital.facilities.icuBeds > 0) {
        score += 20;
      }
    }

    // Hospital rating
    score += hospital.rating * 5; // Max 25 points

    // Emergency capacity check
    const currentEmergencyLoad = 0; // TODO: Calculate from active admissions
    if (currentEmergencyLoad < hospital.settings.maxEmergencyCapacity) {
      score += 10;
    } else {
      score -= 30; // Heavy penalty for overloaded hospitals
    }

    return Math.max(score, 0);
  }

  /**
   * Send notification batch to hospitals
   */
  private static async sendBatch(
    requestId: string,
    scoredHospitals: HospitalScore[],
    batchNumber: number
  ): Promise<void> {
    const startIndex = (batchNumber - 1) * BATCH_SIZE;
    const batch = scoredHospitals.slice(startIndex, startIndex + BATCH_SIZE);

    if (batch.length === 0) {
      // No more hospitals
      await EmergencyRequest.updateOne(
        { requestId },
        { status: 'TIMEOUT' }
      );
      return;
    }

    const hospitals = batch.map((item) => ({
      hospitalId: item.hospital.hospitalId,
      hospitalName: item.hospital.name,
      score: item.score,
      distance: item.distance,
      eta: item.eta,
      notifiedAt: new Date(),
      response: 'NO_RESPONSE' as const,
    }));

    const batchTimeout = new Date(Date.now() + BATCH_TIMEOUT_MS);

    await EmergencyRequest.updateOne(
      { requestId },
      {
        $push: {
          notificationBatches: {
            batchNumber,
            hospitals,
            sentAt: new Date(),
            timeout: batchTimeout,
          },
        },
        currentBatch: batchNumber,
        'metadata.totalHospitalsNotified': hospitals.length,
        'metadata.totalBatches': batchNumber,
      }
    );

    // Emit socket events to hospitals (handled by socket service)
    // This will be integrated with Socket.io
    const io = (global as any).io;
    if (io) {
      hospitals.forEach((hospital) => {
        io.to(`hospital:${hospital.hospitalId}`).emit('emergency:new', {
          requestId,
          batchNumber,
          timeout: batchTimeout,
        });
      });
    }
  }

  /**
   * Schedule automatic batch progression
   */
  private static scheduleBatchProgression(
    requestId: string,
    scoredHospitals: HospitalScore[]
  ): void {
    let currentBatch = 1;
    const maxBatches = Math.ceil(scoredHospitals.length / BATCH_SIZE);

    const checkAndProgress = async () => {
      const request = await EmergencyRequest.findOne({ requestId });

      if (!request || request.status !== 'PENDING') {
        return; // Request already accepted or cancelled
      }

      const currentBatchData = request.notificationBatches[currentBatch - 1];
      const now = new Date();

      if (currentBatchData && now >= currentBatchData.timeout) {
        // Batch timeout - send next batch
        currentBatch++;

        if (currentBatch <= maxBatches) {
          await this.sendBatch(requestId, scoredHospitals, currentBatch);
          setTimeout(checkAndProgress, BATCH_TIMEOUT_MS);
        } else {
          // No more batches
          await EmergencyRequest.updateOne(
            { requestId },
            { status: 'TIMEOUT' }
          );
        }
      }
    };

    setTimeout(checkAndProgress, BATCH_TIMEOUT_MS);
  }

  /**
   * Handle hospital acceptance
   */
  static async acceptEmergency(
    requestId: string,
    hospitalId: string,
    bedId: string
  ): Promise<{
    success: boolean;
    admission?: any;
  }> {
    const request = await EmergencyRequest.findOne({ requestId });

    if (!request) {
      throw new AppError('EMERGENCY_NOT_FOUND', 404, 'Emergency request not found');
    }

    if (request.status !== 'PENDING') {
      throw new AppError('EMERGENCY_NOT_PENDING', 400, 'Emergency request is no longer pending');
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

    // Mark as accepted
    const acceptedAt = new Date();
    await EmergencyRequest.updateOne(
      { requestId },
      {
        status: 'ACCEPTED',
        acceptedBy: {
          hospitalId,
          hospitalName: hospital.name,
          acceptedAt,
          allocatedBed: bedId,
          allocatedBedDetails: {
            bedNumber: bed.bedNumber,
            ward: bed.ward,
            floor: bed.floor,
          },
          estimatedArrivalTime: new Date(Date.now() + 30 * 60 * 1000), // 30 min estimate
        },
        'metadata.timeToAcceptance': acceptedAt.getTime() - request.createdAt.getTime(),
      }
    );

    // Update batch response
    await EmergencyRequest.updateOne(
      {
        requestId,
        'notificationBatches.hospitals.hospitalId': hospitalId,
      },
      {
        $set: {
          'notificationBatches.$[].hospitals.$[hospital].response': 'ACCEPTED',
          'notificationBatches.$[].hospitals.$[hospital].respondedAt': acceptedAt,
        },
      },
      {
        arrayFilters: [{ 'hospital.hospitalId': hospitalId }],
      }
    );

    // Reserve bed
    await Bed.updateOne(
      { bedId },
      {
        status: 'RESERVED',
      }
    );

    // Notify other hospitals
    const io = (global as any).io;
    if (io) {
      io.emit('emergency:accepted_by_other', {
        requestId,
        hospitalId,
        hospitalName: hospital.name,
      });
    }

    // Notify patient and ambulance
    if (io) {
      io.to(`emergency:${request.emergencyId}`).emit('emergency:accepted', {
        hospital: {
          hospitalId: hospital.hospitalId,
          name: hospital.name,
          location: hospital.location,
          contact: hospital.contact,
        },
        bed: {
          bedId: bed.bedId,
          bedNumber: bed.bedNumber,
          ward: bed.ward,
        },
      });
    }

    return {
      success: true,
      admission: {
        bedId,
        hospital: hospital.name,
      },
    };
  }

  /**
   * Handle hospital rejection
   */
  static async rejectEmergency(
    requestId: string,
    hospitalId: string,
    reason: string
  ): Promise<void> {
    await EmergencyRequest.updateOne(
      {
        requestId,
        'notificationBatches.hospitals.hospitalId': hospitalId,
      },
      {
        $set: {
          'notificationBatches.$[].hospitals.$[hospital].response': 'REJECTED',
          'notificationBatches.$[].hospitals.$[hospital].respondedAt': new Date(),
          'notificationBatches.$[].hospitals.$[hospital].rejectionReason': reason,
        },
      },
      {
        arrayFilters: [{ 'hospital.hospitalId': hospitalId }],
      }
    );
  }
}

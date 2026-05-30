/**
 * Emergency SOS Service
 * Business logic for emergency SOS operations
 * Coordinates: Repository calls + external services
 * TODO: Connect real ambulance dispatch & notification services in Sprint 2
 */

import { emergencySosRepository } from './emergencySosRepository';
import type { EmergencySOS, TriggerSOSRequest, TimelineEntry } from '@shared/types';
import { EMERGENCY_STATUS } from '@shared/constants';
import { AppError } from '../../utils/AppError';

// TODO: Replace with real implementations in Sprint 2
const ambulanceDispatchService = {
  dispatchNearestAmbulance: async (_emergency: EmergencySOS): Promise<void> => { /* stub */ },
  cancelDispatch: async (_ambulanceId: string): Promise<void> => { /* stub */ },
};
const notificationService = {
  notifyEmergency: async (_emergency: EmergencySOS): Promise<void> => { /* stub */ },
};

export class EmergencySosService {
  /**
   * Trigger a new emergency SOS
   */
  public async triggerSOS(userId: string, payload: TriggerSOSRequest): Promise<EmergencySOS> {
    // Check for duplicate emergency (within last 5 minutes)
    const recentEmergency = await emergencySosRepository.findRecentByUserId(userId, 5 * 60 * 1000);
    if (recentEmergency && recentEmergency.status !== EMERGENCY_STATUS.CANCELLED) {
      throw new AppError(
        'DUPLICATE_EMERGENCY',
        409,
        'Recent emergency already active for this user'
      );
    }

    // Create emergency record matching the EmergencySOS interface
    const emergency: Omit<EmergencySOS, '_id'> = {
      patientId: userId,
      emergencyType: payload.emergencyType,
      location: payload.location,
      description: payload.description,
      severityScore: 7.5,
      priority: 'HIGH',
      status: EMERGENCY_STATUS.INITIATED as EmergencySOS['status'],
      assignedAmbulanceId: undefined,
      assignedHospitalId: undefined,
      assignedDoctorId: undefined,
      familyNotificationSent: false,
      timeline: [
        {
          status: EMERGENCY_STATUS.INITIATED as EmergencySOS['status'],
          timestamp: new Date().toISOString(),
          note: 'Emergency SOS initiated',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save to database
    const savedEmergency = await emergencySosRepository.create(emergency as EmergencySOS);

    // Trigger ambulance dispatch asynchronously (fire-and-forget)
    ambulanceDispatchService.dispatchNearestAmbulance(savedEmergency).catch((error) => {
      console.warn('Failed to dispatch ambulance:', error);
    });

    // Send notifications (fire-and-forget)
    notificationService.notifyEmergency(savedEmergency).catch((error) => {
      console.warn('Failed to send notifications:', error);
    });

    return savedEmergency;
  }

  /**
   * Get emergency by ID
   */
  public async getEmergency(emergencyId: string): Promise<EmergencySOS | null> {
    return emergencySosRepository.findById(emergencyId);
  }

  /**
   * Update emergency status
   */
  public async updateStatus(emergencyId: string, status: EmergencySOS['status']): Promise<EmergencySOS> {
    const emergency = await emergencySosRepository.findById(emergencyId);
    if (!emergency) {
      throw new AppError('EMERGENCY_NOT_FOUND', 404, 'Emergency not found');
    }

    emergency.status = status;
    emergency.updatedAt = new Date().toISOString();

    const updated = await emergencySosRepository.update(emergencyId, emergency);
    await this.addTimeline(emergencyId, status, `Status updated to ${status}`);

    return updated;
  }

  /**
   * Cancel emergency
   */
  public async cancelEmergency(emergencyId: string): Promise<{ success: boolean }> {
    const emergency = await emergencySosRepository.findById(emergencyId);
    if (!emergency) {
      throw new AppError('EMERGENCY_NOT_FOUND', 404, 'Emergency not found');
    }

    await this.updateStatus(emergencyId, EMERGENCY_STATUS.CANCELLED as EmergencySOS['status']);

    // Notify ambulance if assigned
    if (emergency.assignedAmbulanceId) {
      ambulanceDispatchService.cancelDispatch(emergency.assignedAmbulanceId).catch((error) => {
        console.warn('Failed to cancel ambulance dispatch:', error);
      });
    }

    return { success: true };
  }

  /**
   * Get emergency timeline
   */
  public async getTimeline(emergencyId: string): Promise<TimelineEntry[]> {
    const emergency = await emergencySosRepository.findById(emergencyId);
    if (!emergency) {
      throw new AppError('EMERGENCY_NOT_FOUND', 404, 'Emergency not found');
    }
    return emergency.timeline || [];
  }

  /**
   * Add timeline entry
   */
  private async addTimeline(
    emergencyId: string,
    status: EmergencySOS['status'],
    note: string
  ): Promise<void> {
    const entry: TimelineEntry = {
      status,
      timestamp: new Date().toISOString(),
      note,
    };
    await emergencySosRepository.addTimeline(emergencyId, entry);
  }
}

export const emergencySosService = new EmergencySosService();

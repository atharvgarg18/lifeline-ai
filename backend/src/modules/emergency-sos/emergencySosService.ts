/**
 * Emergency SOS Service
 * Business logic for emergency SOS operations
 * Coordinates: Repository calls + external services
 */

import { emergencySosRepository } from './emergencySosRepository';
import { locationService } from '@services/locationService';
import { notificationService } from '@services/notificationService';
import { ambulanceDispatchService } from '@services/ambulanceDispatchService';
import type { EmergencySOS, TriggerSOSRequest, TimelineEntry } from '../../../shared/types';
import { EMERGENCY_STATUS } from '../../../shared/constants';
import { AppError } from '@utils/errorHandler';

export class EmergencySosService {
  /**
   * Trigger a new emergency SOS
   */
  public async triggerSOS(userId: string, payload: TriggerSOSRequest): Promise<EmergencySOS> {
    // Validate user exists
    const user = await this.validateUser(userId);
    if (!user) {
      throw new AppError('PATIENT_NOT_FOUND', 'Patient not found', 404);
    }

    // Check for duplicate emergency (duplicate check within last 5 minutes)
    const recentEmergency = await emergencySosRepository.findRecentByUserId(userId, 5 * 60 * 1000);
    if (recentEmergency && recentEmergency.status !== EMERGENCY_STATUS.CANCELLED) {
      throw new AppError(
        'DUPLICATE_EMERGENCY',
        'Recent emergency already active for this user',
        409
      );
    }

    // Create emergency record
    const emergency: EmergencySOS = {
      id: '',
      patientId: userId,
      emergencyType: payload.emergencyType,
      location: payload.location,
      latitude: payload.latitude,
      longitude: payload.longitude,
      description: payload.description,
      severityScore: payload.severityScore || 7.5,
      status: EMERGENCY_STATUS.INITIATED,
      assignedAmbulanceId: null,
      assignedHospitalId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      timeline: [
        {
          status: EMERGENCY_STATUS.INITIATED,
          timestamp: new Date(),
          description: 'Emergency SOS initiated',
        },
      ],
    };

    // Save to database
    const savedEmergency = await emergencySosRepository.create(emergency);

    // Add to timeline
    await this.addTimeline(savedEmergency.id, EMERGENCY_STATUS.INITIATED, 'Emergency triggered');

    // Trigger ambulance dispatch asynchronously
    try {
      await ambulanceDispatchService.dispatchNearestAmbulance(savedEmergency);
    } catch (error) {
      console.warn('Failed to dispatch ambulance:', error);
      // Don't fail the SOS trigger if dispatch fails
    }

    // Send notifications to nearby resources
    try {
      await notificationService.notifyEmergency(savedEmergency);
    } catch (error) {
      console.warn('Failed to send notifications:', error);
    }

    return savedEmergency;
  }

  /**
   * Get emergency by ID
   */
  public async getEmergency(emergencyId: string): Promise<EmergencySOS | null> {
    return await emergencySosRepository.findById(emergencyId);
  }

  /**
   * Update emergency status
   */
  public async updateStatus(emergencyId: string, status: string): Promise<EmergencySOS> {
    const emergency = await emergencySosRepository.findById(emergencyId);
    if (!emergency) {
      throw new AppError('EMERGENCY_NOT_FOUND', 'Emergency not found', 404);
    }

    emergency.status = status;
    emergency.updatedAt = new Date();

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
      throw new AppError('EMERGENCY_NOT_FOUND', 'Emergency not found', 404);
    }

    await this.updateStatus(emergencyId, EMERGENCY_STATUS.CANCELLED);

    // Notify ambulance if assigned
    if (emergency.assignedAmbulanceId) {
      try {
        await ambulanceDispatchService.cancelDispatch(emergency.assignedAmbulanceId);
      } catch (error) {
        console.warn('Failed to cancel ambulance dispatch:', error);
      }
    }

    return { success: true };
  }

  /**
   * Get emergency timeline
   */
  public async getTimeline(emergencyId: string): Promise<TimelineEntry[]> {
    const emergency = await emergencySosRepository.findById(emergencyId);
    if (!emergency) {
      throw new AppError('EMERGENCY_NOT_FOUND', 'Emergency not found', 404);
    }

    return emergency.timeline || [];
  }

  /**
   * Add timeline entry
   */
  private async addTimeline(emergencyId: string, status: string, description: string): Promise<void> {
    const timeline: TimelineEntry = {
      status,
      timestamp: new Date(),
      description,
    };

    await emergencySosRepository.addTimeline(emergencyId, timeline);
  }

  /**
   * Validate user exists (placeholder - implement with actual user service)
   */
  private async validateUser(userId: string): Promise<boolean> {
    // TODO: Implement with actual user service
    return true;
  }
}

export const emergencySosService = new EmergencySosService();

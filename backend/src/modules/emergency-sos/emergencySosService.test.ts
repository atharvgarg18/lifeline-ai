/**
 * Emergency SOS Service Unit Tests
 * Tests business logic without database
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { emergencySosService } from '../emergencySosService';
import type { TriggerSOSRequest } from '../../../../shared/types';
import { EMERGENCY_STATUS } from '../../../../shared/constants';

describe('EmergencySosService', () => {
  const mockUserId = 'user-123';
  const mockSOSRequest: TriggerSOSRequest = {
    emergencyType: 'MEDICAL',
    location: 'Market Street, Delhi',
    latitude: 28.7041,
    longitude: 77.1025,
    description: 'Severe chest pain',
    severityScore: 8.5,
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('triggerSOS', () => {
    it('should create a new emergency SOS successfully', async () => {
      const result = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);

      expect(result).toBeDefined();
      expect(result.patientId).toBe(mockUserId);
      expect(result.emergencyType).toBe('MEDICAL');
      expect(result.status).toBe(EMERGENCY_STATUS.INITIATED);
      expect(result.severityScore).toBe(8.5);
    });

    it('should include location coordinates', async () => {
      const result = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);

      expect(result.latitude).toBe(28.7041);
      expect(result.longitude).toBe(77.1025);
    });

    it('should initialize timeline with INITIATED status', async () => {
      const result = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);

      expect(result.timeline).toBeDefined();
      expect(result.timeline.length).toBeGreaterThan(0);
      expect(result.timeline[0].status).toBe(EMERGENCY_STATUS.INITIATED);
    });

    it('should handle missing optional fields', async () => {
      const minimalRequest: TriggerSOSRequest = {
        emergencyType: 'ACCIDENT',
        location: 'Location',
        latitude: 0,
        longitude: 0,
      };

      const result = await emergencySosService.triggerSOS(mockUserId, minimalRequest);

      expect(result).toBeDefined();
      expect(result.description).toBeUndefined();
    });

    it('should throw error if user not found', async () => {
      await expect(
        emergencySosService.triggerSOS('invalid-user', mockSOSRequest)
      ).rejects.toThrow();
    });
  });

  describe('getEmergency', () => {
    it('should retrieve emergency by ID', async () => {
      // First create
      const created = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);

      // Then retrieve
      const retrieved = await emergencySosService.getEmergency(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
    });

    it('should return null for non-existent emergency', async () => {
      const result = await emergencySosService.getEmergency('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('updateStatus', () => {
    it('should update emergency status', async () => {
      const created = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);

      const updated = await emergencySosService.updateStatus(
        created.id,
        EMERGENCY_STATUS.DISPATCHED
      );

      expect(updated.status).toBe(EMERGENCY_STATUS.DISPATCHED);
    });

    it('should add entry to timeline on status update', async () => {
      const created = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);
      const initialTimelineLength = created.timeline?.length || 0;

      await emergencySosService.updateStatus(created.id, EMERGENCY_STATUS.DISPATCHED);

      const updated = await emergencySosService.getEmergency(created.id);
      expect(updated?.timeline?.length).toBeGreaterThan(initialTimelineLength);
    });

    it('should throw error for non-existent emergency', async () => {
      await expect(
        emergencySosService.updateStatus('non-existent', EMERGENCY_STATUS.DISPATCHED)
      ).rejects.toThrow();
    });
  });

  describe('cancelEmergency', () => {
    it('should cancel emergency successfully', async () => {
      const created = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);

      const result = await emergencySosService.cancelEmergency(created.id);

      expect(result.success).toBe(true);
    });

    it('should set status to CANCELLED', async () => {
      const created = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);

      await emergencySosService.cancelEmergency(created.id);

      const updated = await emergencySosService.getEmergency(created.id);
      expect(updated?.status).toBe(EMERGENCY_STATUS.CANCELLED);
    });

    it('should throw error for non-existent emergency', async () => {
      await expect(
        emergencySosService.cancelEmergency('non-existent')
      ).rejects.toThrow();
    });
  });

  describe('getTimeline', () => {
    it('should return emergency timeline', async () => {
      const created = await emergencySosService.triggerSOS(mockUserId, mockSOSRequest);

      const timeline = await emergencySosService.getTimeline(created.id);

      expect(Array.isArray(timeline)).toBe(true);
      expect(timeline.length).toBeGreaterThan(0);
    });

    it('should throw error for non-existent emergency', async () => {
      await expect(
        emergencySosService.getTimeline('non-existent')
      ).rejects.toThrow();
    });
  });
});

/**
 * Emergency Service
 * Handles SOS triggering and emergency management
 */

import { geolocationService, Coordinates } from './geolocation.service';

export interface TriggerSOSPayload {
  emergencyType: 'ACCIDENT' | 'MEDICAL' | 'OTHER';
  location: string;
  latitude: number;
  longitude: number;
  description?: string;
  symptoms?: string[];
  severityScore?: number;
  medicalHistory?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface EmergencySOS {
  _id: string;
  patientId: string;
  emergencyType: string;
  location: string;
  description?: string;
  severityScore: number;
  priority: string;
  status: string;
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  assignedDoctorId?: string;
  familyNotificationSent: boolean;
  timeline: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Symptom severity mapping
const SYMPTOM_SEVERITY_MAP: Record<string, number> = {
  'Unconscious / unresponsive': 10,
  'Severe chest pain': 9,
  'Heavy bleeding': 9,
  'Stroke symptoms': 9,
  'Severe allergic reaction': 8,
  'Major accident / trauma': 8,
  'Shortness of breath': 7,
  'High fever with seizures': 7,
};

class EmergencyService {
  private readonly API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

  /**
   * Calculate severity score based on selected symptom
   */
  public calculateSeverity(symptom: string): number {
    return SYMPTOM_SEVERITY_MAP[symptom] || 7; // Default to 7 if unknown
  }

  /**
   * Get current location and trigger SOS
   */
  public async triggerSOSWithLocation(
    symptom: string,
    description?: string
  ): Promise<{ success: boolean; emergency?: EmergencySOS; error?: string }> {
    try {
      // Get current location
      const coords = await geolocationService.getCurrentPosition();
      
      // Get address from coordinates
      const locationAddress = await geolocationService.getAddressFromCoords(coords);
      
      // Calculate severity
      const severityScore = this.calculateSeverity(symptom);
      
      // Prepare payload
      const payload: TriggerSOSPayload = {
        emergencyType: 'MEDICAL',
        location: locationAddress,
        latitude: coords.latitude,
        longitude: coords.longitude,
        description: description || symptom,
        symptoms: [symptom],
        severityScore,
      };
      
      // Trigger SOS
      return await this.triggerSOS(payload);
    } catch (error: any) {
      console.error('Failed to trigger SOS with location:', error);
      return {
        success: false,
        error: error.message || 'Failed to get location or trigger SOS',
      };
    }
  }

  /**
   * Trigger SOS with manual payload
   */
  public async triggerSOS(
    payload: TriggerSOSPayload
  ): Promise<{ success: boolean; emergency?: EmergencySOS; error?: string }> {
    try {
      console.log('🚨 Triggering SOS:', payload);
      
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please login first.');
      }

      const response = await fetch(`${this.API_BASE}/emergency/sos/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to trigger SOS');
      }

      console.log('✅ SOS triggered successfully:', data.data);

      return {
        success: true,
        emergency: data.data,
      };
    } catch (error: any) {
      console.error('❌ SOS trigger failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to trigger SOS',
      };
    }
  }

  /**
   * Get emergency status by ID
   */
  public async getEmergencyStatus(
    emergencyId: string
  ): Promise<{ success: boolean; emergency?: EmergencySOS; error?: string }> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${this.API_BASE}/emergency/${emergencyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to get emergency status');
      }

      return {
        success: true,
        emergency: data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Cancel emergency
   */
  public async cancelEmergency(
    emergencyId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const token = this.getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${this.API_BASE}/emergency/${emergencyId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to cancel emergency');
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get emergency timeline
   */
  public async getTimeline(emergencyId: string): Promise<any[]> {
    try {
      const token = this.getAuthToken();
      if (!token) return [];

      const response = await fetch(`${this.API_BASE}/emergency/${emergencyId}/timeline`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Failed to get timeline:', error);
      return [];
    }
  }

  /**
   * Get auth token from localStorage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('ll_token');
  }
}

export const emergencyService = new EmergencyService();

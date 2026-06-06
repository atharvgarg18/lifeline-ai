/**
 * Emergency SOS Service
 * Business logic for emergency SOS operations
 * Coordinates: Repository calls + external services
 */

import { emergencySosRepository } from './emergencySosRepository';
import type { EmergencySOS, TriggerSOSRequest, TimelineEntry } from '@shared/types';
import { EMERGENCY_STATUS } from '@shared/constants';
import { AppError } from '../../utils/AppError';
import { Hospital } from '../hms/models/Hospital.model';
import { Bed } from '../hms/models/Bed.model';

interface HospitalScore {
  hospitalId: string;
  hospital: any;
  score: number;
  distance: number;
  availableBeds: number;
  specializations: string[];
}

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

    // Create emergency record
    const emergency: Omit<EmergencySOS, '_id'> = {
      patientId: userId,
      emergencyType: payload.emergencyType,
      location: {
        latitude: payload.latitude,
        longitude: payload.longitude,
        address: payload.location, // The address string
      } as any,
      description: payload.description,
      severityScore: payload.severityScore || 7.5,
      priority: payload.severityScore && payload.severityScore >= 8 ? 'CRITICAL' : 'HIGH',
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

    console.log('✅ Emergency saved with ID:', savedEmergency._id);

    // Find and notify hospitals (wait for this to complete)
    await this.dispatchToHospitals(savedEmergency, payload.latitude, payload.longitude);

    return savedEmergency;
  }

  /**
   * Find top 5 hospitals and notify them
   */
  private async dispatchToHospitals(
    emergency: EmergencySOS,
    latitude: number,
    longitude: number
  ): Promise<void> {
    try {
      console.log('🏥 Finding optimal hospitals for emergency:', emergency._id);

      // Find top 5 hospitals using scoring algorithm
      const topHospitals = await this.findTop5Hospitals(latitude, longitude, emergency);

      if (topHospitals.length === 0) {
        console.warn('❌ No suitable hospitals found for emergency');
        return;
      }

      console.log(`✅ Found ${topHospitals.length} hospitals. Notifying...`);

      // Log hospitals for debugging
      topHospitals.forEach((hs, index) => {
        console.log(`  ${index + 1}. ${hs.hospital.name}`);
        console.log(`     Score: ${hs.score.toFixed(2)}`);
        console.log(`     Distance: ${hs.distance.toFixed(2)} km`);
        console.log(`     Available Beds: ${hs.availableBeds}`);
        console.log(`     Specializations: ${hs.specializations.join(', ')}`);
      });

      // Get Socket.io instance from global
      const io = (global as any).io;
      
      if (io) {
        // Emit emergency notification to each hospital
        topHospitals.forEach((hs) => {
          const hospitalRoom = `hospital:${hs.hospitalId}`;
          
          // Determine required bed type based on severity
          let requiredBedType = 'GENERAL';
          if (emergency.severityScore >= 9) {
            requiredBedType = 'ICU';
          } else if (emergency.severityScore >= 7) {
            requiredBedType = 'EMERGENCY';
          }
          
          const emergencyData = {
            requestId: emergency._id?.toString() || '',
            emergencyId: emergency._id?.toString() || '',
            patientId: emergency.patientId,
            emergencyType: emergency.emergencyType,
            location: typeof emergency.location === 'string' 
              ? emergency.location 
              : emergency.location?.address || 'Unknown location',
            description: emergency.description,
            symptoms: emergency.description ? [emergency.description] : ['Emergency'],
            severity: emergency.severityScore,
            requiredBedType,
            priority: emergency.priority,
            status: emergency.status,
            distance: hs.distance,
            eta: Math.ceil(hs.distance * 3), // Rough estimate: 3 min per km
            score: hs.score,
            availableBeds: hs.availableBeds,
            batchNumber: 1,
            timeout: new Date(Date.now() + 120000), // 2 minutes
            timeoutAt: new Date(Date.now() + 120000), // 2 minutes
            createdAt: emergency.createdAt,
          };

          io.to(hospitalRoom).emit('emergency:new', emergencyData);
          console.log(`📡 Emitted emergency:new to ${hospitalRoom}`);
        });

        console.log(`✅ WebSocket notifications sent to ${topHospitals.length} hospitals`);
      } else {
        console.warn('⚠️ Socket.io not initialized - hospitals not notified via WebSocket');
      }

      // Add timeline entry
      await this.addTimeline(
        emergency._id!.toString(),
        EMERGENCY_STATUS.DISPATCHED as EmergencySOS['status'],
        `Notified ${topHospitals.length} hospitals`
      );
    } catch (error) {
      console.error('Error in dispatchToHospitals:', error);
      throw error; // Propagate error since we're now awaiting this
    }
  }

  /**
   * Find top 5 hospitals based on scoring algorithm
   * If less than 10 hospitals, return all active hospitals (simplified for small dataset)
   */
  private async findTop5Hospitals(
    patientLat: number,
    patientLon: number,
    emergency: EmergencySOS
  ): Promise<HospitalScore[]> {
    try {
      // Find all active hospitals
      const hospitals = await Hospital.find({
        status: 'ACTIVE',
      }).lean();

      console.log(`📍 Found ${hospitals.length} active hospitals`);

      if (hospitals.length === 0) {
        return [];
      }

      // If less than 10 hospitals, notify all (simplified for small datasets)
      if (hospitals.length <= 10) {
        console.log('📢 Small hospital count - notifying all hospitals');
        
        const allHospitals: HospitalScore[] = [];

        for (const hospital of hospitals) {
          try {
            // Calculate distance
            const distance = this.calculateDistance(
              patientLat,
              patientLon,
              hospital.location.coordinates[1], // latitude
              hospital.location.coordinates[0]  // longitude
            );

            // Count available beds (optional - don't filter by this)
            const availableBeds = await Bed.countDocuments({
              hospitalId: hospital.hospitalId,
              status: 'AVAILABLE',
            });

            // Calculate basic score (distance-based)
            let score = 100 - (distance * 0.5);
            score += (hospital.rating || 4) * 5;
            score += Math.min(availableBeds * 2, 20);

            allHospitals.push({
              hospitalId: hospital.hospitalId,
              hospital,
              score,
              distance,
              availableBeds,
              specializations: hospital.specializations || [],
            });
          } catch (err) {
            console.error(`Error processing hospital ${hospital.hospitalId}:`, err);
          }
        }

        // Sort by distance (closest first)
        allHospitals.sort((a, b) => a.distance - b.distance);
        
        console.log(`✅ Returning all ${allHospitals.length} hospitals`);
        return allHospitals;
      }

      // For larger datasets, use original scoring algorithm
      const scoredHospitals: HospitalScore[] = [];

      for (const hospital of hospitals) {
        try {
          // Calculate distance
          const distance = this.calculateDistance(
            patientLat,
            patientLon,
            hospital.location.coordinates[1], // latitude
            hospital.location.coordinates[0]  // longitude
          );

          // Skip hospitals too far away (> 50km)
          if (distance > 50) continue;

          // Count available beds
          const availableBeds = await Bed.countDocuments({
            hospitalId: hospital.hospitalId,
            status: 'AVAILABLE',
            bedType: emergency.severityScore >= 8 ? { $in: ['ICU', 'EMERGENCY'] } : { $ne: 'MAINTENANCE' },
          });

          // Skip hospitals with no available beds
          if (availableBeds === 0) continue;

          // Calculate score
          let score = 100; // Base score

          // Distance penalty: closer = better (0.5 points per km)
          score -= distance * 0.5;

          // Bed availability bonus
          score += Math.min(availableBeds * 5, 30); // Max 30 bonus points

          // Emergency bed bonus for severe cases
          if (emergency.severityScore >= 8 && hospital.facilities.emergencyBeds > 0) {
            score += 20;
          }

          // ICU availability bonus for critical cases
          if (emergency.severityScore >= 9 && hospital.facilities.icuBeds > 0) {
            score += 25;
          }

          // Ambulance availability bonus
          if (hospital.facilities.hasAmbulance) {
            score += 15;
          }

          // Hospital rating bonus
          score += (hospital.rating || 4) * 5;

          // 24x7 emergency service bonus
          if (hospital.operatingHours?.emergency24x7) {
            score += 10;
          }

          scoredHospitals.push({
            hospitalId: hospital.hospitalId,
            hospital,
            score,
            distance,
            availableBeds,
            specializations: hospital.specializations || [],
          });
        } catch (err) {
          console.error(`Error scoring hospital ${hospital.hospitalId}:`, err);
        }
      }

      // Sort by score (highest first) and return top 5
      scoredHospitals.sort((a, b) => b.score - a.score);
      const top5 = scoredHospitals.slice(0, 5);

      console.log(`✅ Scored ${scoredHospitals.length} hospitals, returning top ${top5.length}`);

      return top5;
    } catch (error) {
      console.error('Error in findTop5Hospitals:', error);
      return [];
    }
  }

  /**
   * Calculate distance between two points using Haversine formula (in kilometers)
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get active emergency for user
   */
  public async getActiveEmergency(userId: string): Promise<EmergencySOS | null> {
    // Find recent emergency (within 24 hours) that's not completed or cancelled
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const emergency = await emergencySosRepository.findOne({
      patientId: userId,
      createdAt: { $gte: oneDayAgo },
      status: { 
        $nin: ['COMPLETED', 'CANCELLED', 'DISCHARGED'] 
      }
    });

    return emergency;
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

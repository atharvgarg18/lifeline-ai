/**
 * Emergency SOS Repository
 * Database operations for emergency SOS
 * Abstracts MongoDB operations
 */

import type { EmergencySOS, TimelineEntry } from '@shared/types';
import { EmergencySosModel } from './models/EmergencySos.model';

// Placeholder - In real implementation, this would use mongoose
interface IEmergencySosRepository {
  create(emergency: EmergencySOS): Promise<EmergencySOS>;
  findById(id: string): Promise<EmergencySOS | null>;
  update(id: string, emergency: EmergencySOS): Promise<EmergencySOS>;
  findRecentByUserId(userId: string, timeWindowMs: number): Promise<EmergencySOS | null>;
  addTimeline(emergencyId: string, entry: TimelineEntry): Promise<void>;
  findByStatus(status: string, limit?: number): Promise<EmergencySOS[]>;
  findByLocation(latitude: number, longitude: number, radiusKm: number): Promise<EmergencySOS[]>;
}

export class EmergencySosRepository implements IEmergencySosRepository {
  /**
   * Create new emergency
   */
  public async create(emergency: EmergencySOS): Promise<EmergencySOS> {
    const doc = new EmergencySosModel(emergency);
    const saved = await doc.save();
    return saved.toObject() as EmergencySOS;
  }

  /**
   * Find emergency by ID
   */
  public async findById(id: string): Promise<EmergencySOS | null> {
    const doc = await EmergencySosModel.findById(id);
    return doc ? (doc.toObject() as EmergencySOS) : null;
  }

  /**
   * Find one emergency by query
   */
  public async findOne(query: any): Promise<EmergencySOS | null> {
    const doc = await EmergencySosModel.findOne(query).sort({ createdAt: -1 });
    return doc ? (doc.toObject() as EmergencySOS) : null;
  }

  /**
   * Update emergency
   */
  public async update(id: string, emergency: EmergencySOS): Promise<EmergencySOS> {
    const doc = await EmergencySosModel.findByIdAndUpdate(id, emergency, { new: true });
    if (!doc) {
      throw new Error(`Emergency with ID ${id} not found`);
    }
    return doc.toObject() as EmergencySOS;
  }

  /**
   * Find recent emergency for user (duplicate check)
   */
  public async findRecentByUserId(userId: string, timeWindowMs: number): Promise<EmergencySOS | null> {
    const since = new Date(Date.now() - timeWindowMs);
    const doc = await EmergencySosModel.findOne({
      patientId: userId,
      createdAt: { $gte: since }
    }).sort({ createdAt: -1 });
    return doc ? (doc.toObject() as EmergencySOS) : null;
  }

  /**
   * Add entry to timeline
   */
  public async addTimeline(emergencyId: string, entry: TimelineEntry): Promise<void> {
    await EmergencySosModel.findByIdAndUpdate(
      emergencyId,
      { $push: { timeline: entry } }
    );
  }

  /**
   * Find emergencies by status
   */
  public async findByStatus(status: string, limit = 100): Promise<EmergencySOS[]> {
    const docs = await EmergencySosModel.find({ status }).limit(limit);
    return docs.map(doc => doc.toObject() as EmergencySOS);
  }

  /**
   * Find emergencies by location (geospatial query)
   */
  public async findByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<EmergencySOS[]> {
    // TODO: Implement geospatial queries
    // This requires the location field to have a geospatial index
    return [];
  }
}

export const emergencySosRepository = new EmergencySosRepository();

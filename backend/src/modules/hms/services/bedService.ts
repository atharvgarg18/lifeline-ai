import { Bed, IBed } from '../models/Bed.model';
import { AppError } from '../../../utils/AppError';

export class BedService {
  /**
   * Get all beds for a hospital
   */
  static async getHospitalBeds(
    hospitalId: string,
    filters?: {
      status?: string;
      bedType?: string;
      ward?: string;
      floor?: number;
    }
  ): Promise<IBed[]> {
    const query: any = { hospitalId };

    if (filters?.status) query.status = filters.status;
    if (filters?.bedType) query.bedType = filters.bedType;
    if (filters?.ward) query.ward = filters.ward;
    if (filters?.floor !== undefined) query.floor = filters.floor;

    return await Bed.find(query).sort({ floor: 1, ward: 1, bedNumber: 1 });
  }

  /**
   * Get bed availability summary
   */
  static async getBedAvailability(hospitalId: string): Promise<{
    total: number;
    available: number;
    occupied: number;
    maintenance: number;
    reserved: number;
    byType: Record<string, { total: number; available: number }>;
  }> {
    const beds = await Bed.find({ hospitalId });

    const summary = {
      total: beds.length,
      available: 0,
      occupied: 0,
      maintenance: 0,
      reserved: 0,
      byType: {} as Record<string, { total: number; available: number }>,
    };

    beds.forEach((bed) => {
      // Count by status
      switch (bed.status) {
        case 'AVAILABLE':
          summary.available++;
          break;
        case 'OCCUPIED':
          summary.occupied++;
          break;
        case 'MAINTENANCE':
          summary.maintenance++;
          break;
        case 'RESERVED':
          summary.reserved++;
          break;
      }

      // Count by type
      if (!summary.byType[bed.bedType]) {
        summary.byType[bed.bedType] = { total: 0, available: 0 };
      }
      summary.byType[bed.bedType].total++;
      if (bed.status === 'AVAILABLE') {
        summary.byType[bed.bedType].available++;
      }
    });

    return summary;
  }

  /**
   * Allocate bed to patient
   */
  static async allocateBed(
    bedId: string,
    patientId: string,
    admissionId: string
  ): Promise<IBed> {
    const bed = await Bed.findOne({ bedId, status: 'AVAILABLE' });

    if (!bed) {
      throw new AppError('BED_NOT_AVAILABLE', 400, 'Bed is not available');
    }

    bed.status = 'OCCUPIED';
    bed.currentPatient = {
      patientId,
      admissionId,
      admittedAt: new Date(),
    };
    bed.lastOccupiedAt = new Date();

    await bed.save();
    return bed;
  }

  /**
   * Release bed (discharge patient)
   */
  static async releaseBed(bedId: string): Promise<IBed> {
    const bed = await Bed.findOne({ bedId });

    if (!bed) {
      throw new AppError('BED_NOT_FOUND', 404, 'Bed not found');
    }

    bed.status = 'CLEANING';
    bed.currentPatient = undefined;

    await bed.save();
    return bed;
  }

  /**
   * Mark bed as available after cleaning
   */
  static async markBedAvailable(bedId: string): Promise<IBed> {
    const bed = await Bed.findOne({ bedId });

    if (!bed) {
      throw new AppError('BED_NOT_FOUND', 404, 'Bed not found');
    }

    bed.status = 'AVAILABLE';
    bed.lastCleanedAt = new Date();

    await bed.save();
    return bed;
  }

  /**
   * Reserve bed for emergency
   */
  static async reserveBed(bedId: string): Promise<IBed> {
    const bed = await Bed.findOne({ bedId, status: 'AVAILABLE' });

    if (!bed) {
      throw new AppError('BED_NOT_AVAILABLE', 400, 'Bed is not available');
    }

    bed.status = 'RESERVED';
    await bed.save();
    return bed;
  }

  /**
   * Transfer patient to different bed
   */
  static async transferBed(
    currentBedId: string,
    newBedId: string,
    patientId: string,
    admissionId: string
  ): Promise<{ oldBed: IBed; newBed: IBed }> {
    // Release old bed
    const oldBed = await this.releaseBed(currentBedId);

    // Allocate new bed
    const newBed = await this.allocateBed(newBedId, patientId, admissionId);

    return { oldBed, newBed };
  }

  /**
   * Schedule bed maintenance
   */
  static async scheduleMaintenance(
    bedId: string,
    reason: string,
    scheduledAt: Date
  ): Promise<IBed> {
    const bed = await Bed.findOne({ bedId });

    if (!bed) {
      throw new AppError('BED_NOT_FOUND', 404, 'Bed not found');
    }

    if (bed.status === 'OCCUPIED') {
      throw new AppError('BED_OCCUPIED', 400, 'Cannot schedule maintenance for occupied bed');
    }

    bed.status = 'MAINTENANCE';
    bed.maintenanceSchedule = {
      scheduledAt,
      reason,
    };

    await bed.save();
    return bed;
  }

  /**
   * Complete bed maintenance
   */
  static async completeMaintenance(bedId: string): Promise<IBed> {
    const bed = await Bed.findOne({ bedId });

    if (!bed) {
      throw new AppError('BED_NOT_FOUND', 404, 'Bed not found');
    }

    if (bed.maintenanceSchedule) {
      bed.maintenanceSchedule.completedAt = new Date();
    }
    bed.status = 'CLEANING';

    await bed.save();
    return bed;
  }

  /**
   * Create new bed
   */
  static async createBed(bedData: {
    hospitalId: string;
    bedNumber: string;
    ward: string;
    bedType: string;
    floor: number;
    room: string;
    features?: string[];
    pricePerDay: number;
  }): Promise<IBed> {
    const bedId = `BED-${bedData.hospitalId}-${Date.now()}`;

    const bed = await Bed.create({
      ...bedData,
      bedId,
      status: 'AVAILABLE',
    });

    return bed;
  }

  /**
   * Bulk create beds
   */
  static async bulkCreateBeds(
    hospitalId: string,
    bedConfigs: Array<{
      ward: string;
      bedType: string;
      floor: number;
      room: string;
      count: number;
      features?: string[];
      pricePerDay: number;
    }>
  ): Promise<number> {
    let totalCreated = 0;

    for (const config of bedConfigs) {
      for (let i = 1; i <= config.count; i++) {
        const bedNumber = `${config.ward}-${config.room}-${i}`;
        await this.createBed({
          hospitalId,
          bedNumber,
          ward: config.ward,
          bedType: config.bedType,
          floor: config.floor,
          room: config.room,
          features: config.features,
          pricePerDay: config.pricePerDay,
        });
        totalCreated++;
      }
    }

    return totalCreated;
  }

  /**
   * Get bed details
   */
  static async getBedDetails(bedId: string): Promise<IBed | null> {
    return await Bed.findOne({ bedId });
  }

  /**
   * Update bed details
   */
  static async updateBed(
    bedId: string,
    updates: Partial<IBed>
  ): Promise<IBed> {
    const bed = await Bed.findOneAndUpdate(
      { bedId },
      { $set: updates },
      { new: true }
    );

    if (!bed) {
      throw new AppError('BED_NOT_FOUND', 404, 'Bed not found');
    }

    return bed;
  }

  /**
   * Delete bed
   */
  static async deleteBed(bedId: string): Promise<void> {
    const bed = await Bed.findOne({ bedId });

    if (!bed) {
      throw new AppError('BED_NOT_FOUND', 404, 'Bed not found');
    }

    if (bed.status === 'OCCUPIED') {
      throw new AppError('BED_OCCUPIED', 400, 'Cannot delete occupied bed');
    }

    await Bed.deleteOne({ bedId });
  }
}

/**
 * Seed script to populate beds for testing
 * Run with: npx ts-node src/modules/hms/scripts/seedBeds.ts
 */

import mongoose from 'mongoose';
import { Bed } from '../models/Bed.model';
import { connectDatabase } from '../../../config/database';

const HOSPITAL_ID = 'HOSP-001';

const bedConfigs = [
  // ICU Beds
  {
    ward: 'ICU',
    bedType: 'ICU',
    floor: 3,
    rooms: ['ICU-1', 'ICU-2', 'ICU-3'],
    bedsPerRoom: 2,
    features: ['Ventilator', 'Cardiac Monitor', 'IV Pump'],
    pricePerDay: 5000,
  },
  // General Ward
  {
    ward: 'GENERAL',
    bedType: 'GENERAL',
    floor: 2,
    rooms: ['G-101', 'G-102', 'G-103', 'G-104'],
    bedsPerRoom: 4,
    features: ['AC', 'TV'],
    pricePerDay: 1500,
  },
  // Private Rooms
  {
    ward: 'PRIVATE',
    bedType: 'PRIVATE',
    floor: 4,
    rooms: ['P-401', 'P-402', 'P-403'],
    bedsPerRoom: 1,
    features: ['AC', 'TV', 'Attached Bathroom', 'Sofa'],
    pricePerDay: 3000,
  },
  // Emergency
  {
    ward: 'EMERGENCY',
    bedType: 'EMERGENCY',
    floor: 1,
    rooms: ['ER-1', 'ER-2'],
    bedsPerRoom: 4,
    features: ['Oxygen', 'Monitor'],
    pricePerDay: 2000,
  },
];

async function seedBeds() {
  try {
    await connectDatabase();
    console.log('🔗 Connected to database');

    // Clear existing beds for this hospital
    const deleteResult = await Bed.deleteMany({ hospitalId: HOSPITAL_ID });
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing beds`);

    let totalCreated = 0;

    for (const config of bedConfigs) {
      for (const room of config.rooms) {
        for (let i = 1; i <= config.bedsPerRoom; i++) {
          const bedNumber = `${room}-${i}`;
          const bedId = `BED-${HOSPITAL_ID}-${config.ward}-${room}-${i}`;

          await Bed.create({
            bedId,
            hospitalId: HOSPITAL_ID,
            bedNumber,
            ward: config.ward,
            bedType: config.bedType,
            floor: config.floor,
            room,
            status: 'AVAILABLE',
            features: config.features,
            pricePerDay: config.pricePerDay,
          });

          totalCreated++;
        }
      }
    }

    console.log(`✅ Created ${totalCreated} beds for hospital ${HOSPITAL_ID}`);

    // Show summary
    const summary = await Bed.aggregate([
      { $match: { hospitalId: HOSPITAL_ID } },
      { $group: { _id: '$bedType', count: { $sum: 1 } } },
    ]);

    console.log('\n📊 Bed Summary:');
    summary.forEach((item) => {
      console.log(`   ${item._id}: ${item.count} beds`);
    });

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedBeds();

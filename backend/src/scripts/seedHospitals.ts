/**
 * Seed Demo Hospitals for HMS Testing
 * Run with: npm run db:seed:hospitals
 */

import mongoose from 'mongoose';
import { ENV } from '../config/env';
import { Hospital } from '../modules/hms/models/Hospital.model';
import { Bed } from '../modules/hms/models/Bed.model';

const demoHospitals = [
  {
    hospitalId: 'HOSP-001',
    name: 'Apollo Hospital',
    address: {
      street: '21, Greams Lane',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600006',
      country: 'India',
    },
    location: {
      type: 'Point',
      coordinates: [80.2472, 13.0569], // [longitude, latitude]
    },
    contact: {
      phone: '+91-44-28296000',
      email: 'info@apollohospitals.com',
      emergencyPhone: '+91-44-28296444',
    },
    facilities: {
      totalBeds: 40,
      icuBeds: 8,
      nicuBeds: 0,
      emergencyBeds: 7,
      generalBeds: 25,
      hasBloodBank: true,
      hasOT: true,
      hasLab: true,
      hasPharmacy: true,
      hasAmbulance: true,
    },
    specializations: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Emergency'],
    rating: 4.8,
    status: 'ACTIVE',
  },
  {
    hospitalId: 'HOSP-002',
    name: 'Fortis Hospital',
    address: {
      street: 'Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      country: 'India',
    },
    location: {
      type: 'Point',
      coordinates: [77.3679, 28.6139],
    },
    contact: {
      phone: '+91-120-6200000',
      email: 'info@fortishealthcare.com',
      emergencyPhone: '+91-120-6200666',
    },
    facilities: {
      totalBeds: 35,
      icuBeds: 7,
      nicuBeds: 0,
      emergencyBeds: 6,
      generalBeds: 22,
      hasBloodBank: true,
      hasOT: true,
      hasLab: true,
      hasPharmacy: true,
      hasAmbulance: true,
    },
    specializations: ['Cardiology', 'Neurology', 'Emergency', 'Pediatrics', 'General Surgery'],
    rating: 4.6,
    status: 'ACTIVE',
  },
  {
    hospitalId: 'HOSP-003',
    name: 'Max Super Specialty Hospital',
    address: {
      street: '1, Press Enclave Road, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      country: 'India',
    },
    location: {
      type: 'Point',
      coordinates: [77.2167, 28.5244],
    },
    contact: {
      phone: '+91-11-26515050',
      email: 'info@maxhealthcare.com',
      emergencyPhone: '+91-11-26515666',
    },
    facilities: {
      totalBeds: 45,
      icuBeds: 9,
      nicuBeds: 0,
      emergencyBeds: 8,
      generalBeds: 28,
      hasBloodBank: true,
      hasOT: true,
      hasLab: true,
      hasPharmacy: true,
      hasAmbulance: true,
    },
    specializations: ['Cardiology', 'Oncology', 'Orthopedics', 'Emergency', 'Gastroenterology'],
    rating: 4.7,
    status: 'ACTIVE',
  },
  {
    hospitalId: 'HOSP-004',
    name: 'Manipal Hospital',
    address: {
      street: '98, HAL Airport Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560017',
      country: 'India',
    },
    location: {
      type: 'Point',
      coordinates: [77.6486, 12.9577],
    },
    contact: {
      phone: '+91-80-25023456',
      email: 'info@manipalhospitals.com',
      emergencyPhone: '+91-80-25023999',
    },
    facilities: {
      totalBeds: 38,
      icuBeds: 8,
      nicuBeds: 0,
      emergencyBeds: 7,
      generalBeds: 23,
      hasBloodBank: true,
      hasOT: true,
      hasLab: true,
      hasPharmacy: true,
      hasAmbulance: true,
    },
    specializations: ['Neurology', 'Orthopedics', 'Emergency', 'Urology', 'Nephrology'],
    rating: 4.5,
    status: 'ACTIVE',
  },
  {
    hospitalId: 'HOSP-005',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    address: {
      street: 'Achutrao Patwardhan Marg, Four Bungalows',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400053',
      country: 'India',
    },
    location: {
      type: 'Point',
      coordinates: [72.8263, 19.1319],
    },
    contact: {
      phone: '+91-22-30999999',
      email: 'info@kokilabenhospital.com',
      emergencyPhone: '+91-22-30991000',
    },
    facilities: {
      totalBeds: 50,
      icuBeds: 10,
      nicuBeds: 0,
      emergencyBeds: 9,
      generalBeds: 31,
      hasBloodBank: true,
      hasOT: true,
      hasLab: true,
      hasPharmacy: true,
      hasAmbulance: true,
    },
    specializations: ['Cardiology', 'Neurology', 'Oncology', 'Emergency', 'Critical Care'],
    rating: 4.9,
    status: 'ACTIVE',
  },
];

const bedTypes = [
  { type: 'ICU', count: 8 },
  { type: 'GENERAL', count: 15 },
  { type: 'DELUXE', count: 10 },
  { type: 'EMERGENCY', count: 7 },
];

async function seedHospitals() {
  try {
    console.log('🌱 Starting hospital seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing hospitals and beds...');
    await Hospital.deleteMany({});
    await Bed.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Create a dummy admin user ObjectId (you can replace with actual user ID)
    const dummyAdminId = new mongoose.Types.ObjectId();

    // Seed hospitals
    console.log('🏥 Creating hospitals...');
    for (const hospitalData of demoHospitals) {
      const hospital = await Hospital.create({
        ...hospitalData,
        adminUser: dummyAdminId, // Add required adminUser field
      });
      console.log(`  ✓ Created: ${hospital.name} (${hospital.hospitalId})`);

      // Create beds for each hospital
      let bedNumber = 1;
      for (const bedType of bedTypes) {
        for (let i = 0; i < bedType.count; i++) {
          const bedId = `${hospital.hospitalId}-BED-${String(bedNumber).padStart(3, '0')}`;
          
          await Bed.create({
            bedId,
            hospitalId: hospital.hospitalId,
            bedNumber: `${bedType.type}-${bedNumber}`,
            bedType: bedType.type as any,
            floor: Math.ceil(bedNumber / 10),
            ward: `Ward ${String.fromCharCode(65 + Math.floor((bedNumber - 1) / 5))}`, // Ward A, B, C, etc.
            room: `R${String(bedNumber).padStart(3, '0')}`,
            status: i < Math.floor(bedType.count * 0.6) ? 'AVAILABLE' : 'OCCUPIED',
            features: bedType.type === 'ICU' 
              ? ['Oxygen', 'Ventilator', 'Monitor', 'Suction']
              : bedType.type === 'EMERGENCY'
              ? ['Oxygen', 'Monitor', 'Defibrillator']
              : ['Basic'],
            pricePerDay: bedType.type === 'ICU' ? 5000 : bedType.type === 'DELUXE' ? 2000 : 1000,
          });

          bedNumber++;
        }
      }

      console.log(`  ✓ Created ${bedTypes.reduce((sum, b) => sum + b.count, 0)} beds\n`);
    }

    console.log('✅ Hospital seeding completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Hospitals created: ${demoHospitals.length}`);
    console.log(`  - Total beds created: ${demoHospitals.length * bedTypes.reduce((sum, b) => sum + b.count, 0)}`);
    console.log(`  - Bed types: ${bedTypes.map(b => `${b.type} (${b.count})`).join(', ')}\n`);

    // Display hospital list
    console.log('🏥 Created Hospitals:');
    for (const hospitalData of demoHospitals) {
      console.log(`  ${hospitalData.hospitalId}: ${hospitalData.name} - ${hospitalData.address.city}, ${hospitalData.address.state}`);
      console.log(`    📍 Location: [${hospitalData.location.coordinates[0]}, ${hospitalData.location.coordinates[1]}]`);
      console.log(`    ⭐ Rating: ${hospitalData.rating}`);
      console.log(`    🛏️  Beds: ${hospitalData.facilities.totalBeds} total`);
      console.log(`    🏥 Specializations: ${hospitalData.specializations.join(', ')}\n`);
    }

  } catch (error) {
    console.error('❌ Error seeding hospitals:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeder
seedHospitals();

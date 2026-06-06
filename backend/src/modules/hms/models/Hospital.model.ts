import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
  hospitalId: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    emergencyPhone: string;
    website?: string;
  };
  facilities: {
    totalBeds: number;
    icuBeds: number;
    nicuBeds: number;
    emergencyBeds: number;
    generalBeds: number;
    hasBloodBank: boolean;
    hasOT: boolean;
    hasLab: boolean;
    hasPharmacy: boolean;
    hasAmbulance: boolean;
  };
  specializations: string[];
  settings: {
    enabledModules: string[];
    offlineMode: boolean;
    autoAcceptEmergency: boolean;
    maxEmergencyCapacity: number;
  };
  operatingHours: {
    emergency24x7: boolean;
    opdHours?: {
      start: string;
      end: string;
    };
  };
  rating: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  adminUser: mongoose.Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

const HospitalSchema = new Schema<IHospital>(
  {
    hospitalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      emergencyPhone: { type: String, required: true },
      website: { type: String },
    },
    facilities: {
      totalBeds: { type: Number, required: true, default: 0 },
      icuBeds: { type: Number, default: 0 },
      nicuBeds: { type: Number, default: 0 },
      emergencyBeds: { type: Number, default: 0 },
      generalBeds: { type: Number, default: 0 },
      hasBloodBank: { type: Boolean, default: false },
      hasOT: { type: Boolean, default: false },
      hasLab: { type: Boolean, default: false },
      hasPharmacy: { type: Boolean, default: false },
      hasAmbulance: { type: Boolean, default: false },
    },
    specializations: {
      type: [String],
      default: [],
    },
    settings: {
      enabledModules: {
        type: [String],
        default: ['EMERGENCY', 'BED_MANAGEMENT', 'PATIENT_MANAGEMENT'],
      },
      offlineMode: { type: Boolean, default: false },
      autoAcceptEmergency: { type: Boolean, default: false },
      maxEmergencyCapacity: { type: Number, default: 10 },
    },
    operatingHours: {
      emergency24x7: { type: Boolean, default: true },
      opdHours: {
        start: { type: String },
        end: { type: String },
      },
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'MAINTENANCE'],
      default: 'ACTIVE',
    },
    adminUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for location-based queries
HospitalSchema.index({ location: '2dsphere' });

// Index for quick lookups
HospitalSchema.index({ status: 1, 'facilities.emergencyBeds': 1 });

// Virtual for available beds count
HospitalSchema.virtual('availableBeds', {
  ref: 'Bed',
  localField: 'hospitalId',
  foreignField: 'hospitalId',
  count: true,
  match: { status: 'AVAILABLE' },
});

export const Hospital = mongoose.model<IHospital>('Hospital', HospitalSchema);

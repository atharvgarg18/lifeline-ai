import mongoose, { Schema, Document } from 'mongoose';

export interface IBed extends Document {
  bedId: string;
  hospitalId: string;
  bedNumber: string;
  ward: string;
  bedType: 'GENERAL' | 'ICU' | 'NICU' | 'EMERGENCY' | 'DELUXE' | 'SEMI_DELUXE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'RESERVED' | 'CLEANING';
  currentPatient?: {
    patientId: string;
    admissionId: string;
    admittedAt: Date;
  };
  floor: number;
  room: string;
  features: string[];
  pricePerDay: number;
  lastOccupiedAt?: Date;
  lastCleanedAt?: Date;
  maintenanceSchedule?: {
    scheduledAt: Date;
    reason: string;
    completedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BedSchema = new Schema<IBed>(
  {
    bedId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    hospitalId: {
      type: String,
      required: true,
      index: true,
    },
    bedNumber: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    bedType: {
      type: String,
      enum: ['GENERAL', 'ICU', 'NICU', 'EMERGENCY', 'DELUXE', 'SEMI_DELUXE'],
      required: true,
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED', 'CLEANING'],
      default: 'AVAILABLE',
    },
    currentPatient: {
      patientId: { type: String },
      admissionId: { type: String },
      admittedAt: { type: Date },
    },
    floor: {
      type: Number,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      default: [],
    },
    pricePerDay: {
      type: Number,
      required: true,
      default: 0,
    },
    lastOccupiedAt: {
      type: Date,
    },
    lastCleanedAt: {
      type: Date,
    },
    maintenanceSchedule: {
      scheduledAt: { type: Date },
      reason: { type: String },
      completedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
BedSchema.index({ hospitalId: 1, status: 1, bedType: 1 });
BedSchema.index({ hospitalId: 1, bedNumber: 1 }, { unique: true });

// Pre-save hook to validate bed occupancy
BedSchema.pre('save', function (next) {
  if (this.status === 'OCCUPIED' && !this.currentPatient) {
    return next(new Error('Occupied bed must have a current patient'));
  }
  if (this.status !== 'OCCUPIED' && this.currentPatient) {
    this.currentPatient = undefined;
  }
  next();
});

export const Bed = mongoose.model<IBed>('Bed', BedSchema);

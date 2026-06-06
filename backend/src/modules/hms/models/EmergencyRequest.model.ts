import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyRequest extends Document {
  requestId: string;
  emergencyId: string; // Link to EmergencySos
  patientId: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  symptoms: string[];
  severity: number;
  requiredBedType: string;
  requiredSpecialization?: string;
  
  // Batch notification system
  notificationBatches: {
    batchNumber: number;
    hospitals: {
      hospitalId: string;
      hospitalName: string;
      score: number;
      distance: number;
      eta: number;
      notifiedAt: Date;
      respondedAt?: Date;
      response?: 'ACCEPTED' | 'REJECTED' | 'NO_RESPONSE';
      rejectionReason?: string;
    }[];
    sentAt: Date;
    timeout: Date;
  }[];
  
  currentBatch: number;
  
  acceptedBy?: {
    hospitalId: string;
    hospitalName: string;
    acceptedAt: Date;
    allocatedBed: string;
    allocatedBedDetails?: {
      bedNumber: string;
      ward: string;
      floor: number;
    };
    allocatedDoctor?: string;
    allocatedNurse?: string;
    estimatedArrivalTime: Date;
  };
  
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'TIMEOUT' | 'CANCELLED';
  
  metadata: {
    totalHospitalsNotified: number;
    totalBatches: number;
    timeToAcceptance?: number; // milliseconds
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyRequestSchema = new Schema<IEmergencyRequest>(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    emergencyId: {
      type: String,
      required: true,
      index: true,
    },
    patientId: {
      type: String,
      required: true,
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
    symptoms: {
      type: [String],
      required: true,
    },
    severity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    requiredBedType: {
      type: String,
      required: true,
    },
    requiredSpecialization: {
      type: String,
    },
    notificationBatches: [
      {
        batchNumber: { type: Number, required: true },
        hospitals: [
          {
            hospitalId: { type: String, required: true },
            hospitalName: { type: String, required: true },
            score: { type: Number, required: true },
            distance: { type: Number, required: true },
            eta: { type: Number, required: true },
            notifiedAt: { type: Date, default: Date.now },
            respondedAt: { type: Date },
            response: {
              type: String,
              enum: ['ACCEPTED', 'REJECTED', 'NO_RESPONSE'],
            },
            rejectionReason: { type: String },
          },
        ],
        sentAt: { type: Date, default: Date.now },
        timeout: { type: Date, required: true },
      },
    ],
    currentBatch: {
      type: Number,
      default: 0,
    },
    acceptedBy: {
      hospitalId: { type: String },
      hospitalName: { type: String },
      acceptedAt: { type: Date },
      allocatedBed: { type: String },
      allocatedBedDetails: {
        bedNumber: { type: String },
        ward: { type: String },
        floor: { type: Number },
      },
      allocatedDoctor: { type: String },
      allocatedNurse: { type: String },
      estimatedArrivalTime: { type: Date },
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'TIMEOUT', 'CANCELLED'],
      default: 'PENDING',
    },
    metadata: {
      totalHospitalsNotified: { type: Number, default: 0 },
      totalBatches: { type: Number, default: 0 },
      timeToAcceptance: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index
EmergencyRequestSchema.index({ location: '2dsphere' });

// Index for active requests
EmergencyRequestSchema.index({ status: 1, createdAt: -1 });

export const EmergencyRequest = mongoose.model<IEmergencyRequest>(
  'EmergencyRequest',
  EmergencyRequestSchema
);

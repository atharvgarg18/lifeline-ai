/**
 * PatientProfile Mongoose Model
 * Collection: patients
 * Schema based on docs/DATABASE_SCHEMA.md — Collection #2
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPatientProfile extends Document {
  userId: mongoose.Types.ObjectId;
  healthIdNumber: string;
  bloodGroup: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'UNKNOWN';
  allergies: string[];
  chronicDiseases: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    startDate?: Date;
    endDate?: Date;
  }[];
  pastSurgeries: {
    name: string;
    date: Date;
    hospital: string;
    surgeon?: string;
    notes?: string;
  }[];
  emergencyContacts: {
    name: string;
    relation: string;
    phoneNumber: string;
    email?: string;
  }[];
  insuranceDetails?: {
    providerName: string;
    policyNumber: string;
    groupNumber?: string;
    coverageAmount: number;
    expiryDate: Date;
  };
  prescriptions: {
    prescriptionId?: mongoose.Types.ObjectId;
    medicationName: string;
    dosage: string;
    frequency: string;
    prescribedBy: string;
    prescribedAt: Date;
    duration?: string;
    notes?: string;
  }[];
  // QR Code
  qrCodeToken?: string;
  qrCodeGeneratedAt?: Date;
  // Profile meta
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicationSchema = new Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    startDate: Date,
    endDate: Date,
  },
  { _id: false }
);

const SurgerySchema = new Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    hospital: { type: String, required: true },
    surgeon: String,
    notes: String,
  },
  { _id: false }
);

const EmergencyContactSchema = new Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: String,
  },
  { _id: false }
);

const InsuranceSchema = new Schema(
  {
    providerName: String,
    policyNumber: String,
    groupNumber: String,
    coverageAmount: Number,
    expiryDate: Date,
  },
  { _id: false }
);

const PrescriptionSchema = new Schema(
  {
    prescriptionId: { type: Schema.Types.ObjectId, ref: 'Prescriptions' },
    medicationName: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    prescribedBy: { type: String, required: true },
    prescribedAt: { type: Date, required: true },
    duration: String,
    notes: String,
  },
  { _id: false }
);

const PatientProfileSchema = new Schema<IPatientProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    healthIdNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'UNKNOWN'],
      default: 'UNKNOWN',
    },
    allergies: [{ type: String }],
    chronicDiseases: [{ type: String }],
    medications: [MedicationSchema],
    pastSurgeries: [SurgerySchema],
    emergencyContacts: [EmergencyContactSchema],
    insuranceDetails: InsuranceSchema,
    prescriptions: [PrescriptionSchema],
    qrCodeToken: String,
    qrCodeGeneratedAt: Date,
    profileCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'patients',
  }
);

// Indexes
PatientProfileSchema.index({ userId: 1 }, { unique: true });
PatientProfileSchema.index({ healthIdNumber: 1 });
PatientProfileSchema.index({ createdAt: -1 });

// Generate Health ID Number before first save
PatientProfileSchema.pre('save', function (next) {
  if (!this.healthIdNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.healthIdNumber = `LL-${timestamp}-${random}`;
  }
  next();
});

export const PatientProfileModel: Model<IPatientProfile> = mongoose.model<IPatientProfile>(
  'PatientProfile',
  PatientProfileSchema
);

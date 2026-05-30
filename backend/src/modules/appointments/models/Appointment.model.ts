/**
 * Appointment Mongoose Model
 * New collection — not in original DB schema
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  hospitalId?: mongoose.Types.ObjectId;
  type: 'IN_PERSON' | 'VIDEO_CALL' | 'PHONE';
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  scheduledAt: Date;
  durationMinutes: number;
  reason: string;
  specialization: string;
  // Video call
  videoCallRoomId?: string;
  videoCallUrl?: string;
  videoCallToken?: string;
  doctorVideoToken?: string;
  videoCallExpiresAt?: Date;
  videoCallProvider?: 'daily' | 'jitsi';
  // Recommendation
  recommendationScore?: number;
  recommendationReason?: string;
  // Notes
  doctorNotes?: string;
  prescriptionId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
      index: true,
    },
    hospitalId: {
      type: Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    type: {
      type: String,
      enum: ['IN_PERSON', 'VIDEO_CALL', 'PHONE'],
      required: true,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
      default: 'SCHEDULED',
    },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, default: 30 },
    reason: { type: String, required: true },
    specialization: { type: String, required: true },
    // Video call
    videoCallRoomId: String,
    videoCallUrl: String,
    videoCallToken: String,
    doctorVideoToken: String,
    videoCallExpiresAt: Date,
    videoCallProvider: { type: String, enum: ['daily', 'jitsi'] },
    // Recommendation
    recommendationScore: Number,
    recommendationReason: String,
    // Notes
    doctorNotes: String,
    prescriptionId: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
    collection: 'appointments',
  }
);

// Indexes
AppointmentSchema.index({ patientId: 1, scheduledAt: -1 });
AppointmentSchema.index({ doctorId: 1, scheduledAt: -1 });
AppointmentSchema.index({ status: 1, scheduledAt: 1 });
AppointmentSchema.index({ scheduledAt: 1 });

export const AppointmentModel: Model<IAppointment> = mongoose.model<IAppointment>(
  'Appointment',
  AppointmentSchema
);

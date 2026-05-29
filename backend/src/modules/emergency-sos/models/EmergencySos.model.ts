import mongoose, { Schema, Document, Model } from 'mongoose';
import type { EmergencySOS, TimelineEntry } from '@shared/types';

export interface IEmergencySOS extends Omit<EmergencySOS, '_id' | 'createdAt' | 'updatedAt'>, Document {
  _id: mongoose.Types.ObjectId;
}

const TimelineEntrySchema = new Schema<TimelineEntry>({
  status: { type: String, required: true },
  timestamp: { type: String, required: true },
  note: { type: String },
});

const EmergencySosSchema = new Schema<IEmergencySOS>(
  {
    patientId: { type: String, required: true, index: true },
    emergencyType: { type: String, required: true, enum: ['ACCIDENT', 'MEDICAL', 'OTHER'] },
    status: {
      type: String,
      required: true,
      enum: [
        'INITIATED',
        'DISPATCHED',
        'IN_TRANSIT',
        'HOSPITAL_NOTIFIED',
        'ARRIVED',
        'ADMITTED',
        'IN_TREATMENT',
        'DISCHARGED',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'INITIATED',
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    description: { type: String, required: true },
    severityScore: { type: Number, required: true, default: 5 },
    priority: { type: String, required: true, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'HIGH' },
    assignedAmbulanceId: { type: String },
    assignedHospitalId: { type: String },
    assignedDoctorId: { type: String },
    triageDataId: { type: String },
    estimatedArrivalTime: { type: Number },
    actualArrivalTime: { type: Number },
    timeline: { type: [TimelineEntrySchema], default: [] },
    familyNotificationSent: { type: Boolean, default: false },
    completedAt: { type: String },
    cancelledAt: { type: String },
    cancelledReason: { type: String },
  },
  {
    timestamps: true,
  }
);

// We need to use "EmergencySOS" as the model name since the service calls `mongoose.model('EmergencySOS')`
export const EmergencySosModel: Model<IEmergencySOS> = mongoose.model<IEmergencySOS>('EmergencySOS', EmergencySosSchema);

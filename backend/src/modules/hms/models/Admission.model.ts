import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmission extends Document {
  admissionId: string;
  patientId: string;
  hospitalId: string;
  bedId: string;
  admissionType: 'OPD' | 'IPD' | 'EMERGENCY';
  admittedAt: Date;
  dischargedAt?: Date;
  status: 'ADMITTED' | 'DISCHARGED' | 'TRANSFERRED' | 'ABSCONDED';
  admittedBy: string; // Hospital admin userId
  assignedDoctor?: string;
  assignedNurse?: string;
  
  // Medical details
  chiefComplaint: string;
  diagnosis: string;
  symptoms: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenLevel: number;
    respiratoryRate: number;
    recordedAt: Date;
  }[];
  
  // Treatment
  prescriptions: {
    prescriptionId: string;
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: number; // days
    prescribedBy: string;
    prescribedAt: Date;
    notes?: string;
  }[];
  
  labTests: {
    testId: string;
    testName: string;
    orderedBy: string;
    orderedAt: Date;
    completedAt?: Date;
    result?: string;
    reportUrl?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  }[];
  
  // Billing
  billing: {
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    charges: {
      type: string; // ROOM, MEDICINE, LAB, CONSULTATION, PROCEDURE
      description: string;
      amount: number;
      quantity: number;
      date: Date;
    }[];
    payments: {
      paymentId: string;
      amount: number;
      paymentMode: string; // CASH, CARD, UPI, INSURANCE
      transactionId?: string;
      paidAt: Date;
    }[];
    invoiceUrl?: string;
  };
  
  // Discharge
  dischargeSummary?: {
    finalDiagnosis: string;
    treatmentGiven: string;
    dischargeAdvice: string;
    followUpDate?: Date;
    dischargedBy: string;
    dischargedAt: Date;
    dischargeType: 'NORMAL' | 'LAMA' | 'ABSCONDED' | 'REFERRED' | 'EXPIRED';
  };
  
  // Emergency specific
  emergencyDetails?: {
    emergencyId: string; // Link to EmergencySos
    requestId: string; // Link to EmergencyRequest
    arrivedByAmbulance: boolean;
    ambulanceId?: string;
    triagePriority: number;
    triageCategory: string;
  };
  
  notes: {
    note: string;
    addedBy: string;
    addedAt: Date;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema = new Schema<IAdmission>(
  {
    admissionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    hospitalId: {
      type: String,
      required: true,
      index: true,
    },
    bedId: {
      type: String,
      required: true,
    },
    admissionType: {
      type: String,
      enum: ['OPD', 'IPD', 'EMERGENCY'],
      required: true,
    },
    admittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dischargedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['ADMITTED', 'DISCHARGED', 'TRANSFERRED', 'ABSCONDED'],
      default: 'ADMITTED',
    },
    admittedBy: {
      type: String,
      required: true,
    },
    assignedDoctor: {
      type: String,
    },
    assignedNurse: {
      type: String,
    },
    chiefComplaint: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    vitals: [
      {
        bloodPressure: { type: String },
        heartRate: { type: Number },
        temperature: { type: Number },
        oxygenLevel: { type: Number },
        respiratoryRate: { type: Number },
        recordedAt: { type: Date, default: Date.now },
      },
    ],
    prescriptions: [
      {
        prescriptionId: { type: String, required: true },
        medicineId: { type: String },
        medicineName: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: Number, required: true },
        prescribedBy: { type: String, required: true },
        prescribedAt: { type: Date, default: Date.now },
        notes: { type: String },
      },
    ],
    labTests: [
      {
        testId: { type: String, required: true },
        testName: { type: String, required: true },
        orderedBy: { type: String, required: true },
        orderedAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
        result: { type: String },
        reportUrl: { type: String },
        status: {
          type: String,
          enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
          default: 'PENDING',
        },
      },
    ],
    billing: {
      totalAmount: { type: Number, default: 0 },
      paidAmount: { type: Number, default: 0 },
      pendingAmount: { type: Number, default: 0 },
      charges: [
        {
          type: { type: String, required: true },
          description: { type: String, required: true },
          amount: { type: Number, required: true },
          quantity: { type: Number, default: 1 },
          date: { type: Date, default: Date.now },
        },
      ],
      payments: [
        {
          paymentId: { type: String, required: true },
          amount: { type: Number, required: true },
          paymentMode: { type: String, required: true },
          transactionId: { type: String },
          paidAt: { type: Date, default: Date.now },
        },
      ],
      invoiceUrl: { type: String },
    },
    dischargeSummary: {
      finalDiagnosis: { type: String },
      treatmentGiven: { type: String },
      dischargeAdvice: { type: String },
      followUpDate: { type: Date },
      dischargedBy: { type: String },
      dischargedAt: { type: Date },
      dischargeType: {
        type: String,
        enum: ['NORMAL', 'LAMA', 'ABSCONDED', 'REFERRED', 'EXPIRED'],
      },
    },
    emergencyDetails: {
      emergencyId: { type: String },
      requestId: { type: String },
      arrivedByAmbulance: { type: Boolean },
      ambulanceId: { type: String },
      triagePriority: { type: Number },
      triageCategory: { type: String },
    },
    notes: [
      {
        note: { type: String, required: true },
        addedBy: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
AdmissionSchema.index({ hospitalId: 1, status: 1 });
AdmissionSchema.index({ patientId: 1, admittedAt: -1 });
AdmissionSchema.index({ 'emergencyDetails.emergencyId': 1 });

// Pre-save hook to calculate billing
AdmissionSchema.pre('save', function (next) {
  if (this.billing && this.billing.charges) {
    this.billing.totalAmount = this.billing.charges.reduce(
      (sum, charge) => sum + charge.amount * charge.quantity,
      0
    );
    this.billing.pendingAmount =
      this.billing.totalAmount - (this.billing.paidAmount || 0);
  }
  next();
});

export const Admission = mongoose.model<IAdmission>('Admission', AdmissionSchema);

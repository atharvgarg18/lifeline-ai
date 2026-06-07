import mongoose, { Schema, Document } from 'mongoose';

export interface IQRCode extends Document {
  qrCodeId: string;
  patientId: string;
  qrData: string; // Encrypted QR string
  signature: string; // HMAC signature
  generatedAt: Date;
  expiresAt: Date; // 24 hours from generation
  scannedBy: {
    hospitalId: string;
    hospitalName: string;
    scannedAt: Date;
    admitted: boolean;
    admissionId?: string;
  }[];
  status: 'ACTIVE' | 'EXPIRED' | 'USED' | 'REVOKED';
  version: number; // For QR code format versioning
  createdAt: Date;
  updatedAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>(
  {
    qrCodeId: {
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
    qrData: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    generatedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    scannedBy: [
      {
        hospitalId: { type: String, required: true },
        hospitalName: { type: String, required: true },
        scannedAt: { type: Date, default: Date.now },
        admitted: { type: Boolean, default: false },
        admissionId: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ['ACTIVE', 'EXPIRED', 'USED', 'REVOKED'],
      default: 'ACTIVE',
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for active QR codes
QRCodeSchema.index({ patientId: 1, status: 1 });
QRCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save hook to check expiry
QRCodeSchema.pre('save', function (next) {
  if (this.expiresAt < new Date() && this.status === 'ACTIVE') {
    this.status = 'EXPIRED';
  }
  next();
});

export const QRCode = mongoose.model<IQRCode>('QRCode', QRCodeSchema);

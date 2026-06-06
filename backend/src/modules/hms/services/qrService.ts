import crypto from 'crypto';
import { QRCode, IQRCode } from '../models/QRCode.model';
import { AppError } from '../../../utils/AppError';

const QR_SECRET = process.env.QR_SECRET_KEY || 'lifeline-qr-secret-key-2026';
const QR_EXPIRY_HOURS = 24;

export class QRService {
  /**
   * Generate QR code for patient
   */
  static async generateQRCode(
    userId: string,
    healthIdNumber: string,
    name: string,
    email: string,
    phone: string
  ): Promise<{
    qrCodeId: string;
    qrData: string;
    expiresAt: Date;
  }> {
    const qrCodeId = `QR-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const expiresAt = new Date(Date.now() + QR_EXPIRY_HOURS * 60 * 60 * 1000);

    // Create payload
    const payload = {
      qrCodeId,
      userId,
      healthIdNumber,
      name,
      email,
      phone,
      timestamp,
      version: 1,
    };

    // Generate signature
    const signature = this.generateSignature(payload);

    // Encode QR data (Base64)
    const qrData = Buffer.from(
      JSON.stringify({
        ...payload,
        signature,
      })
    ).toString('base64');

    // Save to database
    await QRCode.create({
      qrCodeId,
      patientId: userId, // Store userId as patientId for compatibility
      qrData,
      signature,
      generatedAt: new Date(),
      expiresAt,
      status: 'ACTIVE',
      version: 1,
    });

    return {
      qrCodeId,
      qrData,
      expiresAt,
    };
  }

  /**
   * Validate and decode QR code
   */
  static async validateQRCode(qrData: string): Promise<{
    valid: boolean;
    userId?: string;
    healthIdNumber?: string;
    name?: string;
    email?: string;
    phone?: string;
    qrCodeId?: string;
    expired?: boolean;
    reason?: string;
  }> {
    try {
      // Decode QR data
      const decoded = JSON.parse(Buffer.from(qrData, 'base64').toString('utf-8'));
      const { qrCodeId, userId, healthIdNumber, name, email, phone, timestamp, signature, version } = decoded;

      // Verify signature
      const isSignatureValid = this.verifySignature(
        { qrCodeId, userId, healthIdNumber, name, email, phone, timestamp, version },
        signature
      );

      if (!isSignatureValid) {
        return {
          valid: false,
          reason: 'Invalid QR code signature',
        };
      }

      // Check in database
      const qrCode = await QRCode.findOne({ qrCodeId });

      if (!qrCode) {
        return {
          valid: false,
          reason: 'QR code not found in database',
        };
      }

      // Check expiry
      if (qrCode.expiresAt < new Date() || qrCode.status === 'EXPIRED') {
        await QRCode.updateOne({ qrCodeId }, { status: 'EXPIRED' });
        return {
          valid: false,
          expired: true,
          reason: 'QR code has expired',
        };
      }

      // Check if revoked
      if (qrCode.status === 'REVOKED') {
        return {
          valid: false,
          reason: 'QR code has been revoked',
        };
      }

      // Check if already used
      if (qrCode.status === 'USED') {
        return {
          valid: false,
          reason: 'QR code has already been used',
        };
      }

      return {
        valid: true,
        userId,
        healthIdNumber,
        name,
        email,
        phone,
        qrCodeId: qrCode.qrCodeId,
      };
    } catch (error: any) {
      return {
        valid: false,
        reason: 'Invalid QR code format',
      };
    }
  }

  /**
   * Record QR code scan
   */
  static async recordScan(
    qrCodeId: string,
    hospitalId: string,
    hospitalName: string,
    admitted: boolean = false,
    admissionId?: string
  ): Promise<void> {
    await QRCode.findOneAndUpdate(
      { qrCodeId },
      {
        $push: {
          scannedBy: {
            hospitalId,
            hospitalName,
            scannedAt: new Date(),
            admitted,
            admissionId,
          },
        },
        ...(admitted && { status: 'USED' }),
      }
    );
  }

  /**
   * Revoke QR code
   */
  static async revokeQRCode(qrCodeId: string): Promise<void> {
    await QRCode.updateOne({ qrCodeId }, { status: 'REVOKED' });
  }

  /**
   * Get patient's active QR code
   */
  static async getActiveQRCode(userId: string): Promise<IQRCode | null> {
    return await QRCode.findOne({
      patientId: userId, // patientId field stores userId
      status: 'ACTIVE',
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
  }

  /**
   * Clean up expired QR codes (run as cron job)
   */
  static async cleanupExpiredQRCodes(): Promise<number> {
    const result = await QRCode.updateMany(
      {
        expiresAt: { $lt: new Date() },
        status: 'ACTIVE',
      },
      {
        status: 'EXPIRED',
      }
    );

    return result.modifiedCount;
  }

  /**
   * Generate HMAC signature
   */
  private static generateSignature(payload: any): string {
    const data = JSON.stringify(payload);
    return crypto.createHmac('sha256', QR_SECRET).update(data).digest('hex');
  }

  /**
   * Verify HMAC signature
   */
  private static verifySignature(payload: any, signature: string): boolean {
    const expectedSignature = this.generateSignature(payload);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }
}

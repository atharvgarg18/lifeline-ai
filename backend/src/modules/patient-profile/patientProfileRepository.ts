/**
 * Patient Profile Repository
 * All MongoDB operations for the patient-profile module
 */

import mongoose from 'mongoose';
import { PatientProfileModel, IPatientProfile } from './models/PatientProfile.model';

export class PatientProfileRepository {
  /**
   * Create a new patient profile
   */
  async create(userId: string, data: Partial<IPatientProfile>): Promise<IPatientProfile> {
    const profile = new PatientProfileModel({
      ...data,
      userId: new mongoose.Types.ObjectId(userId),
    });
    return profile.save();
  }

  /**
   * Find profile by userId
   */
  async findByUserId(userId: string): Promise<IPatientProfile | null> {
    return PatientProfileModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    }).exec();
  }

  /**
   * Find profile by healthIdNumber (for QR scan)
   */
  async findByHealthId(healthIdNumber: string): Promise<IPatientProfile | null> {
    return PatientProfileModel.findOne({ healthIdNumber }).exec();
  }

  /**
   * Find profile by _id
   */
  async findById(profileId: string): Promise<IPatientProfile | null> {
    return PatientProfileModel.findById(profileId).exec();
  }

  /**
   * Update profile fields (partial update)
   */
  async update(userId: string, data: Partial<IPatientProfile>): Promise<IPatientProfile | null> {
    return PatientProfileModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: data },
      { new: true, runValidators: true }
    ).exec();
  }

  /**
   * Upsert — create if not exists, update if exists
   */
  async upsert(userId: string, data: Partial<IPatientProfile>): Promise<IPatientProfile> {
    const result = await PatientProfileModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { ...data, userId: new mongoose.Types.ObjectId(userId) } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).exec();
    return result!;
  }

  /**
   * Store QR code token
   */
  async saveQrToken(userId: string, token: string): Promise<void> {
    await PatientProfileModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $set: { qrCodeToken: token, qrCodeGeneratedAt: new Date() } }
    ).exec();
  }

  /**
   * Add a prescription to the patient's embedded array
   */
  async addPrescription(
    userId: string,
    prescription: IPatientProfile['prescriptions'][0]
  ): Promise<IPatientProfile | null> {
    return PatientProfileModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $push: { prescriptions: prescription } },
      { new: true }
    ).exec();
  }

  /**
   * Add or update emergency contact
   */
  async upsertEmergencyContact(
    userId: string,
    contact: IPatientProfile['emergencyContacts'][0]
  ): Promise<IPatientProfile | null> {
    return PatientProfileModel.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        'emergencyContacts.phoneNumber': contact.phoneNumber,
      },
      { $set: { 'emergencyContacts.$': contact } },
      { new: true }
    ).exec().then(async (result) => {
      // If no existing contact with that phone number, push new one
      if (!result) {
        return PatientProfileModel.findOneAndUpdate(
          { userId: new mongoose.Types.ObjectId(userId) },
          { $push: { emergencyContacts: contact } },
          { new: true }
        ).exec();
      }
      return result;
    });
  }

  /**
   * Remove emergency contact by phone number
   */
  async removeEmergencyContact(userId: string, phoneNumber: string): Promise<IPatientProfile | null> {
    return PatientProfileModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) },
      { $pull: { emergencyContacts: { phoneNumber } } },
      { new: true }
    ).exec();
  }
}

export const patientProfileRepository = new PatientProfileRepository();

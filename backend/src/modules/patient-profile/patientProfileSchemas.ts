/**
 * Patient Profile Validation Schemas (Joi)
 */

import Joi from 'joi';

const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

const medicationSchema = Joi.object({
  name: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});

const surgerySchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().iso().required(),
  hospital: Joi.string().required(),
  surgeon: Joi.string(),
  notes: Joi.string().max(500),
});

const emergencyContactSchema = Joi.object({
  name: Joi.string().required(),
  relation: Joi.string().required(),
  phoneNumber: Joi.string().pattern(phoneRegex).required(),
  email: Joi.string().email(),
});

const insuranceSchema = Joi.object({
  providerName: Joi.string().required(),
  policyNumber: Joi.string().required(),
  groupNumber: Joi.string(),
  coverageAmount: Joi.number().min(0),
  expiryDate: Joi.date().iso(),
});

export const patientProfileSchemas = {
  upsertProfile: Joi.object({
    bloodGroup: Joi.string().valid('O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'UNKNOWN'),
    allergies: Joi.array().items(Joi.string()),
    chronicDiseases: Joi.array().items(Joi.string()),
    medications: Joi.array().items(medicationSchema),
    pastSurgeries: Joi.array().items(surgerySchema),
    emergencyContacts: Joi.array().items(emergencyContactSchema),
    insuranceDetails: insuranceSchema,
  }),

  getProfileById: Joi.object({
    patientId: Joi.string().pattern(mongoIdRegex).required(),
  }),

  verifyQrCode: Joi.object({
    token: Joi.string().required(),
  }),

  addEmergencyContact: emergencyContactSchema.required(),

  removeEmergencyContact: Joi.object({
    phone: Joi.string().required(),
  }),

  getAnalytics: Joi.object({
    range: Joi.number().min(1).max(60), // months
  }),

  getMedicalHistory: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
    type: Joi.string().valid('EMERGENCY', 'APPOINTMENT', 'PRESCRIPTION'),
  }),
};

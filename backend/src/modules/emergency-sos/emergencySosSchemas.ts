/**
 * Emergency SOS Validation Schemas
 * Request body validation using Joi
 */

import Joi from 'joi';

export const emergencySosSchemas = {
  triggerSOS: Joi.object({
    emergencyType: Joi.string().valid('ACCIDENT', 'MEDICAL', 'OTHER').required(),
    location: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    description: Joi.string().max(500),
    severityScore: Joi.number().min(1).max(10),
    symptoms: Joi.array().items(Joi.string()),
    medicalHistory: Joi.string(),
    contactName: Joi.string(),
    contactPhone: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),
  }).required(),

  getEmergency: Joi.object({
    emergencyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),

  updateStatus: Joi.object({
    status: Joi.string()
      .valid(
        'INITIATED',
        'DISPATCHED',
        'IN_TRANSIT',
        'HOSPITAL_NOTIFIED',
        'ARRIVED',
        'ADMITTED',
        'IN_TREATMENT',
        'DISCHARGED',
        'COMPLETED',
        'CANCELLED'
      )
      .required(),
    notes: Joi.string().max(500),
  }).required(),

  cancelEmergency: Joi.object({
    emergencyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),

  getTimeline: Joi.object({
    emergencyId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  }),
};

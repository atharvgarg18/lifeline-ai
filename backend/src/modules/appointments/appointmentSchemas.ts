/**
 * Appointment Validation Schemas
 */

import Joi from 'joi';

const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const appointmentSchemas = {
  recommendDoctor: Joi.object({
    specialization: Joi.string(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    limit: Joi.number().min(1).max(20),
  }),

  bookAppointment: Joi.object({
    doctorId: Joi.string().pattern(mongoIdRegex).required(),
    type: Joi.string().valid('IN_PERSON', 'VIDEO_CALL', 'PHONE').required(),
    scheduledAt: Joi.string().isoDate().required(),
    reason: Joi.string().min(5).max(500).required(),
    specialization: Joi.string().required(),
    hospitalId: Joi.string().pattern(mongoIdRegex),
    recommendationScore: Joi.number().min(0).max(1),
    recommendationReason: Joi.string().max(300),
  }).required(),

  getAppointmentId: Joi.object({
    appointmentId: Joi.string().pattern(mongoIdRegex).required(),
  }),

  getMyAppointments: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
    status: Joi.string().valid('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'),
  }),
};

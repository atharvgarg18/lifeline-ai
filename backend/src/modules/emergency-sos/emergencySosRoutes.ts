/**
 * Emergency SOS Routes
 * Defines all endpoints for emergency SOS operations
 */

import { Router } from 'express';
import { emergencySosController } from './emergencySosController';
import { validateRequest } from '@middleware/validation';
import { authenticate } from '@middleware/auth';
import { emergencySosSchemas } from './emergencySosSchemas';

const router = Router();

/**
 * All routes require authentication
 */
router.use(authenticate);

/**
 * POST /api/v1/emergency/sos/trigger
 * Trigger new emergency SOS
 * Body: { emergencyType, location, latitude, longitude, description?, severityScore? }
 */
router.post(
  '/sos/trigger',
  validateRequest(emergencySosSchemas.triggerSOS),
  emergencySosController.triggerSOS.bind(emergencySosController)
);

/**
 * GET /api/v1/emergency/:emergencyId
 * Get emergency details
 */
router.get(
  '/:emergencyId',
  validateRequest(emergencySosSchemas.getEmergency, 'params'),
  emergencySosController.getEmergency.bind(emergencySosController)
);

/**
 * POST /api/v1/emergency/:emergencyId/status
 * Update emergency status
 */
router.post(
  '/:emergencyId/status',
  validateRequest(emergencySosSchemas.updateStatus),
  emergencySosController.updateEmergencyStatus.bind(emergencySosController)
);

/**
 * POST /api/v1/emergency/:emergencyId/cancel
 * Cancel emergency
 */
router.post(
  '/:emergencyId/cancel',
  validateRequest(emergencySosSchemas.cancelEmergency, 'params'),
  emergencySosController.cancelEmergency.bind(emergencySosController)
);

/**
 * GET /api/v1/emergency/:emergencyId/timeline
 * Get emergency timeline
 */
router.get(
  '/:emergencyId/timeline',
  validateRequest(emergencySosSchemas.getTimeline, 'params'),
  emergencySosController.getEmergencyTimeline.bind(emergencySosController)
);

export const emergencySosRoutes = router;

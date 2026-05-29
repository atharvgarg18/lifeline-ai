/**
 * Appointment Routes
 * All endpoints under /api/v1/appointments
 */

import { Router } from 'express';
import { appointmentController } from './appointmentController';
import { validateRequest } from '../../middleware/validation';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';
import { appointmentSchemas } from './appointmentSchemas';

const router = Router();

router.use(authenticate);

/** GET /api/v1/appointments/recommend-doctor */
router.get(
  '/recommend-doctor',
  authorize('PATIENT'),
  validateRequest(appointmentSchemas.recommendDoctor, 'query'),
  appointmentController.recommendDoctor.bind(appointmentController)
);

/** GET /api/v1/appointments/my */
router.get(
  '/my',
  authorize('PATIENT'),
  validateRequest(appointmentSchemas.getMyAppointments, 'query'),
  appointmentController.getMyAppointments.bind(appointmentController)
);

/** POST /api/v1/appointments/book */
router.post(
  '/book',
  authorize('PATIENT'),
  validateRequest(appointmentSchemas.bookAppointment),
  appointmentController.bookAppointment.bind(appointmentController)
);

/** GET /api/v1/appointments/:appointmentId */
router.get(
  '/:appointmentId',
  authorize('PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN'),
  validateRequest(appointmentSchemas.getAppointmentId, 'params'),
  appointmentController.getAppointment.bind(appointmentController)
);

/** POST /api/v1/appointments/:appointmentId/start-video-call */
router.post(
  '/:appointmentId/start-video-call',
  authorize('PATIENT', 'DOCTOR'),
  validateRequest(appointmentSchemas.getAppointmentId, 'params'),
  appointmentController.startVideoCall.bind(appointmentController)
);

/** PUT /api/v1/appointments/:appointmentId/cancel */
router.put(
  '/:appointmentId/cancel',
  authorize('PATIENT', 'DOCTOR'),
  validateRequest(appointmentSchemas.getAppointmentId, 'params'),
  appointmentController.cancelAppointment.bind(appointmentController)
);

export const appointmentRoutes = router;

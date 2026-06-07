import { Router } from 'express';
import { PatientProfileController } from './patientProfileController';

const router = Router();

/**
 * Patient Profile Routes
 * Base path: /api/v1/patient-profile
 */

// QR Code routes
router.post(
  '/patients/:patientId/qr/generate',
  PatientProfileController.generateQR
);

router.get(
  '/patients/:patientId/qr/active',
  PatientProfileController.getActiveQR
);

// Patient profile routes
router.get(
  '/patients/:patientId',
  PatientProfileController.getPatientProfile
);

export default router;

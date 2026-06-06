import { Router } from 'express';
import { PatientProfileController } from './patientProfileController';
import { authenticate } from '../../middleware/auth';

const router = Router();

/**
 * Patient Profile Routes
 * Base path: /api/v1/patient-profile
 * All routes require authentication
 */

// QR Code routes (authenticated user's own QR)
router.post(
  '/qr/generate',
  authenticate,
  PatientProfileController.generateQR
);

router.get(
  '/qr/active',
  authenticate,
  PatientProfileController.getActiveQR
);

// Get authenticated patient's profile
router.get(
  '/me',
  authenticate,
  PatientProfileController.getMyProfile
);

export default router;

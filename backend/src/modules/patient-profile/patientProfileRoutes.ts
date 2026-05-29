/**
 * Patient Profile Routes
 * All endpoints under /api/v1/patient
 */

import { Router } from 'express';
import { patientProfileController } from './patientProfileController';
import { validateRequest } from '../../middleware/validation';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/rbac';

import { patientProfileSchemas } from './patientProfileSchemas';

const router = Router();

// ── All routes require authentication ────────────────────────────
router.use(authenticate);

// ── Profile ──────────────────────────────────────────────────────

/** POST /api/v1/patient/profile — Create/update own profile */
router.post(
  '/profile',
  authorize('PATIENT'),
  validateRequest(patientProfileSchemas.upsertProfile),
  patientProfileController.upsertProfile.bind(patientProfileController)
);

/** GET /api/v1/patient/profile — Get own profile */
router.get(
  '/profile',
  authorize('PATIENT'),
  patientProfileController.getProfile.bind(patientProfileController)
);

/** GET /api/v1/patient/profile/:patientId — Get specific profile (doctors/admins) */
router.get(
  '/profile/:patientId',
  authorize('DOCTOR', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN'),
  validateRequest(patientProfileSchemas.getProfileById, 'params'),
  patientProfileController.getProfileById.bind(patientProfileController)
);

// ── Dashboard ─────────────────────────────────────────────────────

/** GET /api/v1/patient/dashboard */
router.get(
  '/dashboard',
  authorize('PATIENT'),
  patientProfileController.getDashboard.bind(patientProfileController)
);

// ── Medical History ───────────────────────────────────────────────

/** GET /api/v1/patient/medical-history */
router.get(
  '/medical-history',
  authorize('PATIENT'),
  validateRequest(patientProfileSchemas.getMedicalHistory, 'query'),
  patientProfileController.getMedicalHistory.bind(patientProfileController)
);

// ── QR Code ───────────────────────────────────────────────────────

/** GET /api/v1/patient/qr-code — Generate QR for own profile */
router.get(
  '/qr-code',
  authorize('PATIENT'),
  patientProfileController.getQrCode.bind(patientProfileController)
);

/** POST /api/v1/patient/qr-verify — Scan & verify a QR token (hospital use) */
router.post(
  '/qr-verify',
  authorize('DOCTOR', 'HOSPITAL_ADMIN', 'SYSTEM_ADMIN'),
  validateRequest(patientProfileSchemas.verifyQrCode),
  patientProfileController.verifyQrCode.bind(patientProfileController)
);

// ── Analytics ─────────────────────────────────────────────────────

/** GET /api/v1/patient/analytics */
router.get(
  '/analytics',
  authorize('PATIENT'),
  validateRequest(patientProfileSchemas.getAnalytics, 'query'),
  patientProfileController.getAnalytics.bind(patientProfileController)
);

// ── Prescriptions ─────────────────────────────────────────────────

/** GET /api/v1/patient/prescriptions */
router.get(
  '/prescriptions',
  authorize('PATIENT'),
  patientProfileController.getPrescriptions.bind(patientProfileController)
);

// ── Emergency Contacts ─────────────────────────────────────────────

/** GET /api/v1/patient/emergency-contacts */
router.get(
  '/emergency-contacts',
  authorize('PATIENT'),
  patientProfileController.getEmergencyContacts.bind(patientProfileController)
);

/** POST /api/v1/patient/emergency-contacts */
router.post(
  '/emergency-contacts',
  authorize('PATIENT'),
  validateRequest(patientProfileSchemas.addEmergencyContact),
  patientProfileController.addEmergencyContact.bind(patientProfileController)
);

/** DELETE /api/v1/patient/emergency-contacts/:phone */
router.delete(
  '/emergency-contacts/:phone',
  authorize('PATIENT'),
  validateRequest(patientProfileSchemas.removeEmergencyContact, 'params'),
  patientProfileController.removeEmergencyContact.bind(patientProfileController)
);

export const patientProfileRoutes = router;

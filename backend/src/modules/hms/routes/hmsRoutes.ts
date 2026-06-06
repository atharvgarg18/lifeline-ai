import { Router } from 'express';
import { HMSController } from '../controllers/hmsController';
// import { authenticate } from '../../../middleware/auth';
// import { authorizeRoles } from '../../../middleware/rbac';

const router = Router();

/**
 * HMS Routes
 * Base path: /api/v1/hms
 */

// QR Code Scanning
router.post('/qr/scan', HMSController.scanQRCode);

// Admissions
router.post('/admission/quick-admit', HMSController.quickAdmit);
router.get('/admissions', HMSController.getAdmissions);
router.get('/admissions/:admissionId', HMSController.getAdmission);
router.post('/admissions/:admissionId/vitals', HMSController.updateVitals);
router.post('/admissions/:admissionId/discharge', HMSController.dischargePatient);

// Emergency Management
router.get('/emergency/pending', HMSController.getPendingEmergencies);
router.post('/emergency/accept', HMSController.acceptEmergency);
router.post('/emergency/reject', HMSController.rejectEmergency);

// Bed Management
router.get('/beds', HMSController.getBeds);
router.get('/beds/availability', HMSController.getBedAvailability);
router.post('/beds/allocate', HMSController.allocateBed);
router.post('/beds/release', HMSController.releaseBed);

// Seed data (for testing/development)
router.post('/seed/beds', HMSController.seedBeds);

export default router;

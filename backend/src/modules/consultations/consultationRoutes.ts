import { Router } from 'express'
import { consultationController } from './consultationController'
import { authenticate } from '../../middleware/auth'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Create consultation (patient)
router.post('/create', consultationController.createConsultation.bind(consultationController))

// Get consultation by ID
router.get('/:consultationId', consultationController.getConsultation.bind(consultationController))

// Get waiting consultations for hospital
router.get('/hospital/:hospitalId/waiting', consultationController.getWaitingConsultations.bind(consultationController))

// Doctor joins consultation
router.post('/:consultationId/join', consultationController.joinConsultation.bind(consultationController))

// Start consultation
router.post('/:consultationId/start', consultationController.startConsultation.bind(consultationController))

// End consultation
router.post('/:consultationId/end', consultationController.endConsultation.bind(consultationController))

// Send message
router.post('/:consultationId/message', consultationController.sendMessage.bind(consultationController))

export default router

import { Request, Response } from 'express'
import Consultation from './models/Consultation.model'
import { v4 as uuidv4 } from 'uuid'

export class ConsultationController {
  // Create consultation (patient)
  async createConsultation(req: Request, res: Response) {
    try {
      const { patientId, patientName, hospitalId, type = 'CHAT' } = req.body

      if (!patientId || !patientName || !hospitalId) {
        return res.status(400).json({
          success: false,
          message: 'Patient ID, name, and hospital ID are required',
        })
      }

      if (!['VIDEO', 'CHAT'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Type must be VIDEO or CHAT',
        })
      }

      const consultationId = `CONSULT-${Date.now()}`
      const roomId = uuidv4()

      const consultation = await Consultation.create({
        consultationId,
        roomId,
        patientId,
        patientName,
        hospitalId,
        type,
        status: 'WAITING',
        messages: [],
      })

      // Emit Socket.io event for real-time updates
      const io = (global as any).io
      if (io) {
        io.to(`hospital:${hospitalId}`).emit('consultation:new', {
          consultationId: consultation.consultationId,
          patientName: consultation.patientName,
          type: consultation.type,
        })
      }

      return res.status(201).json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('Create consultation error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to create consultation',
      })
    }
  }

  // Get consultation by ID
  async getConsultation(req: Request, res: Response) {
    try {
      const { consultationId } = req.params

      const consultation = await Consultation.findOne({ consultationId })

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found',
        })
      }

      return res.json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('Get consultation error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to get consultation',
      })
    }
  }

  // Get waiting consultations for hospital
  async getWaitingConsultations(req: Request, res: Response) {
    try {
      const { hospitalId } = req.params

      const consultations = await Consultation.find({
        hospitalId,
        status: { $in: ['WAITING', 'ACTIVE'] },
      }).sort({ createdAt: -1 })

      return res.json({
        success: true,
        data: { consultations },
      })
    } catch (error) {
      console.error('Get waiting consultations error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to get consultations',
      })
    }
  }

  // Doctor joins consultation
  async joinConsultation(req: Request, res: Response) {
    try {
      const { consultationId } = req.params
      const { doctorId, doctorName } = req.body

      if (!doctorId || !doctorName) {
        return res.status(400).json({
          success: false,
          message: 'Doctor ID and name are required',
        })
      }

      const consultation = await Consultation.findOneAndUpdate(
        { consultationId, status: 'WAITING' },
        {
          doctorId,
          doctorName,
        },
        { new: true }
      )

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found or already active',
        })
      }

      return res.json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('Join consultation error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to join consultation',
      })
    }
  }

  // Start consultation (mark as active)
  async startConsultation(req: Request, res: Response) {
    try {
      const { consultationId } = req.params

      const consultation = await Consultation.findOneAndUpdate(
        { consultationId },
        {
          status: 'ACTIVE',
          startedAt: new Date(),
        },
        { new: true }
      )

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found',
        })
      }

      return res.json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('Start consultation error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to start consultation',
      })
    }
  }

  // End consultation
  async endConsultation(req: Request, res: Response) {
    try {
      const { consultationId } = req.params

      const consultation = await Consultation.findOne({ consultationId })

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found',
        })
      }

      const endTime = new Date()
      const duration = consultation.startedAt
        ? Math.floor((endTime.getTime() - consultation.startedAt.getTime()) / 60000)
        : 0

      consultation.status = 'COMPLETED'
      consultation.endedAt = endTime
      consultation.duration = duration

      await consultation.save()

      // Emit Socket.io event
      const io = (global as any).io
      if (io) {
        io.to(consultation.roomId).emit('consultation:ended', {
          consultationId: consultation.consultationId,
          duration,
        })
      }

      return res.json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('End consultation error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to end consultation',
      })
    }
  }

  // Send message
  async sendMessage(req: Request, res: Response) {
    try {
      const { consultationId } = req.params
      const { senderId, senderName, senderRole, message } = req.body

      if (!senderId || !senderName || !senderRole || !message) {
        return res.status(400).json({
          success: false,
          message: 'All message fields are required',
        })
      }

      const consultation = await Consultation.findOne({ consultationId })

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found',
        })
      }

      const newMessage = {
        senderId,
        senderName,
        senderRole,
        message: message.trim(),
        timestamp: new Date(),
      }

      consultation.messages.push(newMessage)
      await consultation.save()

      // Emit Socket.io event
      const io = (global as any).io
      if (io) {
        io.to(consultation.roomId).emit('consultation:message', newMessage)
      }

      return res.json({
        success: true,
        data: newMessage,
      })
    } catch (error) {
      console.error('Send message error:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to send message',
      })
    }
  }
}

export const consultationController = new ConsultationController()

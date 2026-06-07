import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage {
  senderId: string
  senderName: string
  senderRole: 'PATIENT' | 'DOCTOR'
  message: string
  timestamp: Date
}

export interface IConsultation extends Document {
  consultationId: string
  roomId: string
  
  // Participants
  patientId: string
  patientName: string
  doctorId?: string
  doctorName?: string
  hospitalId: string
  
  // Type & Status
  type: 'VIDEO' | 'CHAT'
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  
  // Video-specific (only for VIDEO type)
  patientPeerId?: string
  doctorPeerId?: string
  
  // Timestamps
  createdAt: Date
  startedAt?: Date
  endedAt?: Date
  duration?: number
  
  // Messages
  messages: IMessage[]
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['PATIENT', 'DOCTOR'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
})

const ConsultationSchema = new Schema<IConsultation>(
  {
    consultationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    doctorId: {
      type: String,
      index: true,
    },
    doctorName: String,
    hospitalId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['VIDEO', 'CHAT'],
      required: true,
      default: 'CHAT',
    },
    status: {
      type: String,
      enum: ['WAITING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'WAITING',
      index: true,
    },
    patientPeerId: String,
    doctorPeerId: String,
    startedAt: Date,
    endedAt: Date,
    duration: Number,
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
ConsultationSchema.index({ status: 1, hospitalId: 1 })
ConsultationSchema.index({ status: 1, patientId: 1 })
ConsultationSchema.index({ status: 1, doctorId: 1 })
ConsultationSchema.index({ createdAt: -1 })

export default mongoose.model<IConsultation>('Consultation', ConsultationSchema)

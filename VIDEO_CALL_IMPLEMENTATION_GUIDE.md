# Video Conferencing Implementation Guide

## Quick Start: PeerJS Implementation (Recommended for MVP)

**Timeline**: 1-2 days  
**Cost**: $0  
**Complexity**: Easy

---

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Patient App    │         │   Backend API    │         │   HMS App       │
│  (Frontend)     │◄───────►│  (Signaling)     │◄───────►│   (Frontend)    │
└────────┬────────┘         └──────────────────┘         └────────┬────────┘
         │                                                         │
         │                  WebRTC P2P Connection                  │
         └─────────────────────────────────────────────────────────┘
                          (Direct Audio/Video)
```

**Flow**:
1. Patient requests consultation from Patient App
2. Backend creates consultation record and generates unique room ID
3. Doctor receives notification in HMS
4. Both connect to PeerJS using room ID
5. Direct P2P video/audio connection established
6. Backend tracks session (start time, end time, participants)

---

## Installation

### 1. Install PeerJS in both frontend and HMS

```bash
# In main frontend (d:\hc101)
npm install peerjs

# In HMS (d:\hc101\hms)
cd hms
npm install peerjs
```

---

## Backend Implementation

### 1. Add Consultation Schema

**File**: `backend/src/modules/consultations/models/Consultation.model.ts`

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IConsultation extends Document {
  consultationId: string
  patientId: string
  doctorId: string
  hospitalId: string
  roomId: string
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  type: 'VIDEO' | 'AUDIO' | 'CHAT'
  startTime?: Date
  endTime?: Date
  duration?: number // in minutes
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    consultationId: {
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
    doctorId: {
      type: String,
      required: true,
      index: true,
    },
    hospitalId: {
      type: String,
      required: true,
      index: true,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'SCHEDULED',
    },
    type: {
      type: String,
      enum: ['VIDEO', 'AUDIO', 'CHAT'],
      default: 'VIDEO',
    },
    startTime: Date,
    endTime: Date,
    duration: Number,
    notes: String,
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IConsultation>('Consultation', ConsultationSchema)
```

### 2. Create Consultation Controller

**File**: `backend/src/modules/consultations/consultationController.ts`

```typescript
import { Request, Response } from 'express'
import Consultation from './models/Consultation.model'
import { v4 as uuidv4 } from 'uuid'

export class ConsultationController {
  // Create consultation
  async createConsultation(req: Request, res: Response) {
    try {
      const { patientId, doctorId, hospitalId, type = 'VIDEO' } = req.body

      const consultationId = `CONSULT-${Date.now()}`
      const roomId = uuidv4() // Unique room ID for PeerJS

      const consultation = await Consultation.create({
        consultationId,
        patientId,
        doctorId,
        hospitalId,
        roomId,
        type,
        status: 'SCHEDULED',
      })

      res.status(201).json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('Create consultation error:', error)
      res.status(500).json({
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

      res.json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('Get consultation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get consultation',
      })
    }
  }

  // Start consultation
  async startConsultation(req: Request, res: Response) {
    try {
      const { consultationId } = req.params

      const consultation = await Consultation.findOneAndUpdate(
        { consultationId },
        {
          status: 'ACTIVE',
          startTime: new Date(),
        },
        { new: true }
      )

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found',
        })
      }

      res.json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('Start consultation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to start consultation',
      })
    }
  }

  // End consultation
  async endConsultation(req: Request, res: Response) {
    try {
      const { consultationId } = req.params
      const { notes } = req.body

      const consultation = await Consultation.findOne({ consultationId })

      if (!consultation) {
        return res.status(404).json({
          success: false,
          message: 'Consultation not found',
        })
      }

      const endTime = new Date()
      const duration = consultation.startTime
        ? Math.floor((endTime.getTime() - consultation.startTime.getTime()) / 60000)
        : 0

      consultation.status = 'COMPLETED'
      consultation.endTime = endTime
      consultation.duration = duration
      if (notes) consultation.notes = notes

      await consultation.save()

      res.json({
        success: true,
        data: consultation,
      })
    } catch (error) {
      console.error('End consultation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to end consultation',
      })
    }
  }

  // Get consultations for patient
  async getPatientConsultations(req: Request, res: Response) {
    try {
      const { patientId } = req.params
      const { status } = req.query

      const filter: any = { patientId }
      if (status) filter.status = status

      const consultations = await Consultation.find(filter).sort({ createdAt: -1 })

      res.json({
        success: true,
        data: { consultations },
      })
    } catch (error) {
      console.error('Get patient consultations error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get consultations',
      })
    }
  }

  // Get consultations for doctor
  async getDoctorConsultations(req: Request, res: Response) {
    try {
      const { doctorId } = req.params
      const { status } = req.query

      const filter: any = { doctorId }
      if (status) filter.status = status

      const consultations = await Consultation.find(filter).sort({ createdAt: -1 })

      res.json({
        success: true,
        data: { consultations },
      })
    } catch (error) {
      console.error('Get doctor consultations error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get consultations',
      })
    }
  }
}

export const consultationController = new ConsultationController()
```

### 3. Create Routes

**File**: `backend/src/modules/consultations/consultationRoutes.ts`

```typescript
import { Router } from 'express'
import { consultationController } from './consultationController'
import { authenticate } from '../../middleware/auth'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.post('/create', consultationController.createConsultation.bind(consultationController))
router.get('/:consultationId', consultationController.getConsultation.bind(consultationController))
router.post('/:consultationId/start', consultationController.startConsultation.bind(consultationController))
router.post('/:consultationId/end', consultationController.endConsultation.bind(consultationController))
router.get('/patient/:patientId', consultationController.getPatientConsultations.bind(consultationController))
router.get('/doctor/:doctorId', consultationController.getDoctorConsultations.bind(consultationController))

export default router
```

### 4. Register Routes

**File**: `backend/src/index.ts`

```typescript
// Add this import
import consultationRoutes from './modules/consultations/consultationRoutes'

// Add this route registration
app.use('/api/v1/consultations', consultationRoutes)
```

---

## Frontend Implementation (Patient App)

### 1. Create Video Call Hook

**File**: `hooks/useVideoCall.ts`

```typescript
import { useEffect, useRef, useState } from 'react'
import Peer, { MediaConnection } from 'peerjs'

export function useVideoCall(roomId: string, userName: string) {
  const [peer, setPeer] = useState<Peer | null>(null)
  const [myPeerId, setMyPeerId] = useState<string>('')
  const [remotePeerId, setRemotePeerId] = useState<string>('')
  const [call, setCall] = useState<MediaConnection | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  // Initialize PeerJS
  useEffect(() => {
    const peerInstance = new Peer({
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    })

    peerInstance.on('open', (id) => {
      setMyPeerId(id)
      console.log('My peer ID:', id)
    })

    peerInstance.on('call', (incomingCall) => {
      console.log('Receiving call from:', incomingCall.peer)

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream)
          incomingCall.answer(stream)
          setCall(incomingCall)

          incomingCall.on('stream', (remoteMediaStream) => {
            console.log('Received remote stream')
            setRemoteStream(remoteMediaStream)
            setIsConnected(true)
            setRemotePeerId(incomingCall.peer)
          })

          incomingCall.on('close', () => {
            console.log('Call closed')
            setIsConnected(false)
            setRemoteStream(null)
          })
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error)
        })
    })

    setPeer(peerInstance)

    return () => {
      peerInstance.destroy()
    }
  }, [])

  // Call a peer
  const callPeer = async (peerIdToCall: string) => {
    if (!peer) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setLocalStream(stream)

      const outgoingCall = peer.call(peerIdToCall, stream)
      setCall(outgoingCall)

      outgoingCall.on('stream', (remoteMediaStream) => {
        console.log('Received remote stream')
        setRemoteStream(remoteMediaStream)
        setIsConnected(true)
        setRemotePeerId(peerIdToCall)
      })

      outgoingCall.on('close', () => {
        console.log('Call closed')
        setIsConnected(false)
        setRemoteStream(null)
      })
    } catch (error) {
      console.error('Error calling peer:', error)
    }
  }

  // Toggle audio
  const toggleAudio = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsAudioEnabled(!isAudioEnabled)
    }
  }

  // Toggle video
  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  // End call
  const endCall = () => {
    if (call) {
      call.close()
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    setLocalStream(null)
    setRemoteStream(null)
    setIsConnected(false)
    setCall(null)
  }

  return {
    myPeerId,
    remotePeerId,
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    isConnected,
    callPeer,
    toggleAudio,
    toggleVideo,
    endCall,
  }
}
```

### 2. Create Video Call Component

**File**: `components/consultation/VideoCallRoom.tsx`

```typescript
'use client'

import { useEffect, useRef } from 'react'
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react'
import { useVideoCall } from '@/hooks/useVideoCall'

interface VideoCallRoomProps {
  consultationId: string
  roomId: string
  userName: string
  remotePeerId?: string
  onEndCall: () => void
}

export function VideoCallRoom({
  consultationId,
  roomId,
  userName,
  remotePeerId,
  onEndCall,
}: VideoCallRoomProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const {
    myPeerId,
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    isConnected,
    callPeer,
    toggleAudio,
    toggleVideo,
    endCall,
  } = useVideoCall(roomId, userName)

  // Set local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  // Set remote video stream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  // Auto-call if remote peer ID is provided
  useEffect(() => {
    if (remotePeerId && myPeerId && !isConnected) {
      setTimeout(() => callPeer(remotePeerId), 1000)
    }
  }, [remotePeerId, myPeerId])

  const handleEndCall = () => {
    endCall()
    onEndCall()
  }

  return (
    <div className="relative h-screen bg-gray-900">
      {/* Remote Video (Main) */}
      <div className="absolute inset-0">
        {remoteStream ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Waiting for doctor to join...</p>
              <p className="text-sm text-gray-400 mt-2">Room ID: {roomId}</p>
              <p className="text-xs text-gray-500 mt-1">Your Peer ID: {myPeerId}</p>
            </div>
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      {localStream && (
        <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-xl border-2 border-gray-700">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
          />
          <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
            You
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-gray-800/90 px-6 py-4 rounded-full shadow-2xl">
          {/* Microphone Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-colors ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* Video Toggle */}
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-colors ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Connection Status */}
        <div className="text-center mt-4">
          {isConnected ? (
            <div className="flex items-center justify-center text-green-400 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              Connected
            </div>
          ) : (
            <div className="flex items-center justify-center text-yellow-400 text-sm">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse" />
              Connecting...
            </div>
          )}
        </div>
      </div>

      {/* Styles for mirroring local video */}
      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  )
}
```

### 3. Create Video Call Page

**File**: `app/consultation/[id]/page.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { VideoCallRoom } from '@/components/consultation/VideoCallRoom'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ConsultationPage() {
  const params = useParams()
  const router = useRouter()
  const consultationId = params.id as string

  const [consultation, setConsultation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConsultation()
  }, [consultationId])

  const loadConsultation = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ll_token')}`,
          },
        }
      )

      if (response.data.success) {
        setConsultation(response.data.data)

        // Mark consultation as started
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}/start`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('ll_token')}`,
            },
          }
        )
      }
    } catch (error) {
      console.error('Load consultation error:', error)
      toast.error('Failed to load consultation')
    } finally {
      setLoading(false)
    }
  }

  const handleEndCall = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ll_token')}`,
          },
        }
      )

      toast.success('Consultation ended')
      router.push('/patient/dashboard')
    } catch (error) {
      console.error('End consultation error:', error)
      toast.error('Failed to end consultation')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading consultation...</p>
        </div>
      </div>
    )
  }

  if (!consultation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Consultation not found</p>
        </div>
      </div>
    )
  }

  const userName = localStorage.getItem('ll_user')
    ? JSON.parse(localStorage.getItem('ll_user')!).name
    : 'Patient'

  return (
    <VideoCallRoom
      consultationId={consultationId}
      roomId={consultation.roomId}
      userName={userName}
      onEndCall={handleEndCall}
    />
  )
}
```

---

## HMS Implementation

Similar implementation but with doctor-side UI. Would you like me to create the complete HMS side as well?

---

## Next Steps

1. **Install PeerJS**: `npm install peerjs` in both apps
2. **Add backend models and routes** (consultation management)
3. **Create frontend video call components**
4. **Test locally** with two browser windows
5. **Deploy and test** on production

Would you like me to:
1. ✅ Create all the files for you?
2. Create a simpler Socket.io + WebRTC custom solution?
3. Show Jitsi integration instead?
4. Create a comparison demo?

Let me know which approach you'd prefer!

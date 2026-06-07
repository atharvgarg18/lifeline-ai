import { useEffect, useState, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import Peer, { MediaConnection } from 'peerjs'

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'

interface Message {
  senderId: string
  senderName: string
  senderRole: 'PATIENT' | 'DOCTOR'
  message: string
  timestamp: Date
}

interface UseConsultationProps {
  consultationId: string
  roomId: string
  userId: string
  userName: string
  userRole: 'PATIENT' | 'DOCTOR'
  type: 'VIDEO' | 'CHAT'
}

export function useConsultation({
  consultationId,
  roomId,
  userId,
  userName,
  userRole,
  type,
}: UseConsultationProps) {
  // Socket.io
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [otherUserJoined, setOtherUserJoined] = useState(false)
  const [otherUserName, setOtherUserName] = useState('')
  
  // Chat
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  
  // Video (for VIDEO type)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [myPeerId, setMyPeerId] = useState('')
  const [remotePeerId, setRemotePeerId] = useState('')
  const [call, setCall] = useState<MediaConnection | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Initialize Socket.io
  useEffect(() => {
    const socketInstance = io(API_URL, {
      transports: ['websocket', 'polling'],
    })

    socketInstance.on('connect', () => {
      console.log('✅ Socket connected')
      setIsConnected(true)
      
      // Join consultation room
      socketInstance.emit('consultation:join', {
        roomId,
        userId,
        userName,
        userRole,
      })
    })

    socketInstance.on('consultation:joined', () => {
      console.log('✅ Joined consultation room:', roomId)
      
      // Share peer ID again when consultation room is joined (for VIDEO type)
      if (type === 'VIDEO' && myPeerId) {
        console.log('📤 Re-sharing peer ID after room join:', myPeerId)
        socketInstance.emit('video:peer-id', { roomId, peerId: myPeerId, userRole })
      }
    })

    socketInstance.on('consultation:user-joined', (data) => {
      console.log('👤 Other user joined:', data)
      setOtherUserJoined(true)
      setOtherUserName(data.userName)
    })

    socketInstance.on('consultation:user-left', (data) => {
      console.log('👋 Other user left:', data)
      setOtherUserJoined(false)
    })

    socketInstance.on('consultation:message', (message: Message) => {
      console.log('📩 Message received:', message)
      setMessages((prev) => [...prev, message])
    })

    socketInstance.on('consultation:typing', (data) => {
      setIsTyping(data.isTyping)
    })

    socketInstance.on('video:peer-id', (data) => {
      console.log('🎥 Received peer ID:', data.peerId)
      setRemotePeerId(data.peerId)
    })

    socketInstance.on('consultation:ended', () => {
      console.log('🔚 Consultation ended')
    })

    socketInstance.on('disconnect', () => {
      console.log('❌ Socket disconnected')
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.emit('consultation:leave', { roomId, userId, userName })
      socketInstance.disconnect()
    }
  }, [roomId, userId, userName, userRole])

  // Initialize PeerJS (for VIDEO type only)
  useEffect(() => {
    if (type !== 'VIDEO') return

    const peerInstance = new Peer({
      config: {
        iceServers: [
          // STUN servers (free, basic NAT traversal)
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun3.l.google.com:19302' },
          
          // TURN servers (free public relay - OpenRelay by Metered)
          // These enable video calls through firewalls and NATs in production
          {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
          {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
          {
            urls: 'turn:openrelay.metered.ca:443?transport=tcp',
            username: 'openrelayproject',
            credential: 'openrelayproject',
          },
        ],
      },
    })

    peerInstance.on('open', (id) => {
      console.log('🎥 My Peer ID:', id)
      setMyPeerId(id)
      
      // Share peer ID via Socket.io ONLY if socket is connected
      if (socket && socket.connected) {
        console.log('📤 Sharing peer ID:', id)
        socket.emit('video:peer-id', { roomId, peerId: id, userRole })
      } else {
        console.warn('⚠️ Socket not connected, will share peer ID when connected')
      }
    })

    peerInstance.on('call', (incomingCall) => {
      console.log('📞 Receiving call')
      
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setLocalStream(stream)
          incomingCall.answer(stream)
          setCall(incomingCall)

          incomingCall.on('stream', (remoteMediaStream) => {
            console.log('📺 Received remote stream')
            setRemoteStream(remoteMediaStream)
          })
        })
        .catch((error) => {
          console.error('Error accessing media:', error)
          alert('Could not access camera/microphone. Please check permissions.')
        })
    })

    peerInstance.on('error', (error) => {
      console.error('🚨 PeerJS Error:', error)
    })

    setPeer(peerInstance)

    return () => {
      peerInstance.destroy()
    }
  }, [type, socket, roomId, userRole])

  // Auto-call when remote peer ID is available
  useEffect(() => {
    if (type !== 'VIDEO' || !peer || !remotePeerId || !myPeerId || call) return

    console.log('📞 Calling peer:', remotePeerId)
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream)
        const outgoingCall = peer.call(remotePeerId, stream)
        setCall(outgoingCall)

        outgoingCall.on('stream', (remoteMediaStream) => {
          console.log('📺 Received remote stream')
          setRemoteStream(remoteMediaStream)
        })
      })
      .catch((error) => {
        console.error('Error accessing media:', error)
      })
  }, [type, peer, remotePeerId, myPeerId, call])

  // Send message
  const sendMessage = useCallback((messageText: string) => {
    if (!socket || !messageText.trim()) return

    const message: Message = {
      senderId: userId,
      senderName: userName,
      senderRole: userRole,
      message: messageText.trim(),
      timestamp: new Date(),
    }

    // Add to local state immediately
    setMessages((prev) => [...prev, message])
    
    // Send via Socket.io
    socket.emit('consultation:message', { roomId, message })
    
    // Also save to database
    // This will be handled by the API call from the component
  }, [socket, roomId, userId, userName, userRole])

  // Send typing indicator
  const sendTypingIndicator = useCallback((typing: boolean) => {
    if (!socket) return

    socket.emit('consultation:typing', {
      roomId,
      userName,
      isTyping: typing,
    })
  }, [socket, roomId, userName])

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsAudioEnabled(!isAudioEnabled)
    }
  }, [localStream, isAudioEnabled])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsVideoEnabled(!isVideoEnabled)
    }
  }, [localStream, isVideoEnabled])

  // End call
  const endCall = useCallback(() => {
    if (call) {
      call.close()
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    setLocalStream(null)
    setRemoteStream(null)
    setCall(null)
  }, [call, localStream])

  return {
    // Connection
    isConnected,
    otherUserJoined,
    otherUserName,
    
    // Chat
    messages,
    isTyping,
    sendMessage,
    sendTypingIndicator,
    
    // Video (for VIDEO type)
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    endCall,
  }
}

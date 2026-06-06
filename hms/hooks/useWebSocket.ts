import { useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useEmergencyStore } from '@/store/emergencyStore'
import toast from 'react-hot-toast'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { addRequest, removeRequest } = useEmergencyStore()

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return
    }

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server')
      
      // Join hospital room
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      socket.emit('hospital:join', hospitalId)
      
      toast.success('Connected to server')
    })

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server')
      toast.error('Disconnected from server')
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error)
      toast.error('Failed to connect to server')
    })

    // Emergency events
    socket.on('emergency:new', (data) => {
      console.log('🚨 New emergency request:', data)
      
      // Add to store
      addRequest(data)
      
      // Show toast notification
      const message = `New Emergency! Severity ${data.severity}/10, Distance ${data.distance?.toFixed(1) || 'N/A'} km`
      toast.success(message, {
        duration: 10000,
        icon: '🚨',
        style: {
          background: '#dc2626',
          color: '#fff',
          fontWeight: 'bold',
        },
      })

      // Play notification sound (if available)
      try {
        const audio = new Audio('/sounds/emergency-alert.mp3')
        audio.play().catch(console.error)
      } catch (error) {
        console.error('Failed to play sound:', error)
      }
    })

    socket.on('emergency:accepted_by_other', (data) => {
      console.log('ℹ️ Emergency accepted by another hospital:', data)
      
      // Remove from store
      removeRequest(data.requestId)
      
      toast.success(`Emergency accepted by ${data.hospitalName}`)
    })

    socket.on('emergency:next_batch', (data) => {
      console.log('📢 Next batch notification:', data)
      toast(`Moving to batch ${data.batchNumber}`, { icon: '📢' })
    })

    // Bed update events (optional)
    socket.on('bed:update', (data) => {
      console.log('🛏️ Bed status updated:', data)
    })

  }, [addRequest, removeRequest])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data)
    } else {
      console.warn('Socket not connected')
    }
  }, [])

  return { connect, disconnect, emit, socket: socketRef.current }
}

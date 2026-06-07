'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Phone, PhoneOff, X } from 'lucide-react'
import { useConsultation } from '@/hooks/useConsultation'
import { ChatPanel } from './ChatPanel'
import { VideoPanel } from './VideoPanel'

interface ConsultationRoomProps {
  consultationId: string
  roomId: string
  userId: string
  userName: string
  userRole: 'PATIENT' | 'DOCTOR'
  type: 'VIDEO' | 'CHAT'
  onEnd: () => void
}

export function ConsultationRoom({
  consultationId,
  roomId,
  userId,
  userName,
  userRole,
  type,
  onEnd,
}: ConsultationRoomProps) {
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(type === 'CHAT') // Always open for CHAT type
  const [isEnding, setIsEnding] = useState(false)

  const {
    isConnected,
    otherUserJoined,
    otherUserName,
    messages,
    isTyping,
    sendMessage,
    sendTypingIndicator,
    localStream,
    remoteStream,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    endCall,
  } = useConsultation({
    consultationId,
    roomId,
    userId,
    userName,
    userRole,
    type,
  })

  // Save message to database
  const handleSendMessage = async (message: string) => {
    // Only save to database - Socket.io will broadcast it
    // Don't call sendMessage() here to avoid duplicates
    try {
      const token = userRole === 'PATIENT' 
        ? localStorage.getItem('ll_token')
        : localStorage.getItem('hms_token')

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          senderId: userId,
          senderName: userName,
          senderRole: userRole,
          message,
        }),
      })
    } catch (error) {
      console.error('Failed to save message:', error)
    }
  }

  // End consultation
  const handleEndConsultation = async () => {
    if (isEnding) return
    
    setIsEnding(true)

    try {
      // End video call if active
      if (type === 'VIDEO') {
        endCall()
      }

      // Call API to end consultation
      const token = userRole === 'PATIENT' 
        ? localStorage.getItem('ll_token')
        : localStorage.getItem('hms_token')

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })

      // Call the onEnd callback
      onEnd()
    } catch (error) {
      console.error('Failed to end consultation:', error)
      setIsEnding(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {type === 'VIDEO' ? 'Video Consultation' : 'Chat Consultation'}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {otherUserJoined ? `Connected with ${otherUserName}` : 'Waiting for other party...'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {type === 'VIDEO' && (
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isChatOpen ? 'Hide Chat' : 'Show Chat'}</span>
              </button>
            )}
            
            <button
              onClick={handleEndConsultation}
              disabled={isEnding}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <PhoneOff className="w-4 h-4" />
              <span>{isEnding ? 'Ending...' : 'End Consultation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Panel (for VIDEO type) OR Chat Panel (for CHAT type) */}
        {type === 'VIDEO' ? (
          <>
            {/* Video */}
            <div className={`${isChatOpen ? 'flex-1' : 'w-full'} transition-all`}>
              <VideoPanel
                localStream={localStream}
                remoteStream={remoteStream}
                isAudioEnabled={isAudioEnabled}
                isVideoEnabled={isVideoEnabled}
                userName={userName}
                otherUserName={otherUserName}
                otherUserJoined={otherUserJoined}
                onToggleAudio={toggleAudio}
                onToggleVideo={toggleVideo}
              />
            </div>

            {/* Chat Sidebar */}
            {isChatOpen && (
              <div className="w-96 border-l border-gray-200">
                <ChatPanel
                  messages={messages}
                  currentUserId={userId}
                  isTyping={isTyping}
                  onSendMessage={handleSendMessage}
                  onTyping={sendTypingIndicator}
                  onClose={() => setIsChatOpen(false)}
                  isOverlay={false}
                />
              </div>
            )}
          </>
        ) : (
          // CHAT type - full screen chat
          <div className="flex-1 max-w-4xl mx-auto w-full">
            <ChatPanel
              messages={messages}
              currentUserId={userId}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onTyping={sendTypingIndicator}
              isOverlay={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}

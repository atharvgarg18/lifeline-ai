'use client'

import { useRef, useEffect } from 'react'
import { Mic, MicOff, Video, VideoOff, User } from 'lucide-react'

interface VideoPanelProps {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  isAudioEnabled: boolean
  isVideoEnabled: boolean
  userName: string
  otherUserName: string
  otherUserJoined: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
}

export function VideoPanel({
  localStream,
  remoteStream,
  isAudioEnabled,
  isVideoEnabled,
  userName,
  otherUserName,
  otherUserJoined,
  onToggleAudio,
  onToggleVideo,
}: VideoPanelProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

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

  return (
    <div className="relative w-full h-full bg-gray-900">
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
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-lg mb-2">
                {otherUserJoined ? 'Connecting video...' : 'Waiting for other party...'}
              </p>
              {otherUserName && (
                <p className="text-sm text-gray-400">{otherUserName}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Local Video (Picture-in-Picture) */}
      {localStream && (
        <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600 z-10">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover mirror"
          />
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
            You
          </div>
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      )}

      {/* Video Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4 bg-gray-800/90 backdrop-blur-sm px-6 py-3 rounded-full">
          <button
            onClick={onToggleAudio}
            disabled={!localStream}
            className={`p-3 rounded-full transition-all ${
              isAudioEnabled
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50`}
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            {isAudioEnabled ? (
              <Mic className="w-5 h-5 text-white" />
            ) : (
              <MicOff className="w-5 h-5 text-white" />
            )}
          </button>

          <button
            onClick={onToggleVideo}
            disabled={!localStream}
            className={`p-3 rounded-full transition-all ${
              isVideoEnabled
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-red-600 hover:bg-red-700'
            } disabled:opacity-50`}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            {isVideoEnabled ? (
              <Video className="w-5 h-5 text-white" />
            ) : (
              <VideoOff className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {localStream && (
          <div className="flex items-center justify-center space-x-3 mt-2 text-xs text-gray-300">
            <span className={isAudioEnabled ? 'text-green-400' : 'text-red-400'}>
              {isAudioEnabled ? '🎤 Audio on' : '🎤 Audio off'}
            </span>
            <span className="text-gray-600">•</span>
            <span className={isVideoEnabled ? 'text-green-400' : 'text-red-400'}>
              {isVideoEnabled ? '📹 Video on' : '📹 Video off'}
            </span>
          </div>
        )}
      </div>

      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </div>
  )
}

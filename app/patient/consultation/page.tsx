'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react'

const HOSPITAL_ID = 'HOSP-001'

export default function RequestConsultationPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<'VIDEO' | 'CHAT'>('VIDEO')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleStartConsultation = async () => {
    setIsCreating(true)
    setError('')

    try {
      // Get user info from localStorage
      const token = localStorage.getItem('ll_token')
      const userStr = localStorage.getItem('ll_user')

      if (!token || !userStr) {
        setError('Please log in to start a consultation')
        setIsCreating(false)
        return
      }

      const user = JSON.parse(userStr)
      const patientId = user.id
      const patientName = user.name

      // Create consultation
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consultations/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          patientId,
          patientName,
          hospitalId: HOSPITAL_ID,
          type: selectedType,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create consultation')
      }

      // Redirect to consultation room
      router.push(`/consultation/${data.data.consultationId}`)
    } catch (err: any) {
      console.error('Create consultation error:', err)
      setError(err.message || 'Failed to create consultation. Please try again.')
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Request Consultation
            </h1>
            <p className="text-gray-600 mb-8">
              Choose your consultation type and connect with a doctor
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Consultation Type Selection */}
            <div className="space-y-4 mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Consultation Type
              </label>

              {/* VIDEO Option */}
              <button
                onClick={() => setSelectedType('VIDEO')}
                disabled={isCreating}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedType === 'VIDEO'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg ${
                      selectedType === 'VIDEO' ? 'bg-primary-600' : 'bg-gray-100'
                    }`}
                  >
                    <Video
                      className={`w-6 h-6 ${
                        selectedType === 'VIDEO' ? 'text-white' : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Video Consultation
                    </h3>
                    <p className="text-sm text-gray-600">
                      Face-to-face video call with audio and text chat support
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedType === 'VIDEO'
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedType === 'VIDEO' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </button>

              {/* CHAT Option */}
              <button
                onClick={() => setSelectedType('CHAT')}
                disabled={isCreating}
                className={`w-full p-6 rounded-xl border-2 transition-all ${
                  selectedType === 'CHAT'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg ${
                      selectedType === 'CHAT' ? 'bg-primary-600' : 'bg-gray-100'
                    }`}
                  >
                    <MessageCircle
                      className={`w-6 h-6 ${
                        selectedType === 'CHAT' ? 'text-white' : 'text-gray-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Chat Only
                    </h3>
                    <p className="text-sm text-gray-600">
                      Text-based messaging consultation
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedType === 'CHAT'
                        ? 'border-primary-600 bg-primary-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedType === 'CHAT' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Hospital Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Hospital</p>
              <p className="font-semibold text-gray-900">City General Hospital</p>
              <p className="text-xs text-gray-500 mt-1">ID: {HOSPITAL_ID}</p>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartConsultation}
              disabled={isCreating}
              className="w-full px-6 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Consultation...</span>
                </>
              ) : (
                <>
                  {selectedType === 'VIDEO' ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                  <span>Start {selectedType === 'VIDEO' ? 'Video' : 'Chat'} Consultation</span>
                </>
              )}
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 text-center mt-4">
              A doctor will join your consultation shortly. Please wait in the consultation room.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

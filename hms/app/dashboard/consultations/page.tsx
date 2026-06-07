'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, MessageCircle, Loader2, Clock, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const HOSPITAL_ID = 'HOSP-001'

interface Consultation {
  consultationId: string
  roomId: string
  patientId: string
  patientName: string
  doctorId?: string
  doctorName?: string
  hospitalId: string
  type: 'VIDEO' | 'CHAT'
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
}

export default function ConsultationsListPage() {
  const router = useRouter()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const loadConsultations = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    
    setError('')

    try {
      let token = localStorage.getItem('hms_token')
      
      // HMS doesn't have authentication yet, use temporary token
      if (!token) {
        token = 'hms_temp_token'
        localStorage.setItem('hms_token', token)
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/consultations/hospital/${HOSPITAL_ID}/waiting`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load consultations')
      }

      setConsultations(data.data.consultations || [])
    } catch (err: any) {
      console.error('Load consultations error:', err)
      setError(err.message || 'Failed to load consultations')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadConsultations()

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadConsultations(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleJoinConsultation = async (consultation: Consultation) => {
    try {
      let token = localStorage.getItem('hms_token')
      
      // HMS doesn't have authentication yet, use temporary token
      if (!token) {
        token = 'hms_temp_token'
        localStorage.setItem('hms_token', token)
      }

      const userStr = localStorage.getItem('hms_user')
      let doctorId = 'DOC-001'
      let doctorName = 'Dr. Smith'
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          doctorId = user.id || 'DOC-001'
          doctorName = user.name || 'Dr. Smith'
        } catch (e) {
          // Use defaults if parsing fails
        }
      }

      // Join consultation
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultation.consultationId}/join`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId,
            doctorName,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to join consultation')
      }

      // Navigate to consultation room
      router.push(`/dashboard/consultations/${consultation.consultationId}`)
    } catch (err: any) {
      console.error('Join consultation error:', err)
      alert(err.message || 'Failed to join consultation')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading consultations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultations</h1>
            <p className="text-gray-600 mt-1">Waiting and active patient consultations</p>
          </div>
          
          <button
            onClick={() => loadConsultations(true)}
            disabled={refreshing}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Consultations List */}
        {consultations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Waiting Consultations
            </h3>
            <p className="text-gray-600">
              New consultation requests will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Waiting Consultations */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Waiting Consultations ({consultations.filter(c => c.status === 'WAITING').length})
              </h2>
              <div className="space-y-3">
                {consultations
                  .filter(c => c.status === 'WAITING')
                  .map((consultation) => (
                    <div
                      key={consultation.consultationId}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Icon */}
                          <div
                            className={`p-3 rounded-lg ${
                              consultation.type === 'VIDEO'
                                ? 'bg-blue-100'
                                : 'bg-purple-100'
                            }`}
                          >
                            {consultation.type === 'VIDEO' ? (
                              <Video className="w-6 h-6 text-blue-600" />
                            ) : (
                              <MessageCircle className="w-6 h-6 text-purple-600" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {consultation.patientName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatDistanceToNow(new Date(consultation.createdAt), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  consultation.type === 'VIDEO'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {consultation.type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              ID: {consultation.consultationId}
                            </p>
                          </div>
                        </div>

                        {/* Join Button */}
                        <button
                          onClick={() => handleJoinConsultation(consultation)}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center space-x-2"
                        >
                          {consultation.type === 'VIDEO' ? (
                            <>
                              <Video className="w-4 h-4" />
                              <span>Join Call</span>
                            </>
                          ) : (
                            <>
                              <MessageCircle className="w-4 h-4" />
                              <span>Join Chat</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Active Consultations */}
            {consultations.filter(c => c.status === 'ACTIVE').length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-8">
                  Active Consultations ({consultations.filter(c => c.status === 'ACTIVE').length})
                </h2>
                <div className="space-y-3">
                  {consultations
                    .filter(c => c.status === 'ACTIVE')
                    .map((consultation) => (
                      <div
                        key={consultation.consultationId}
                        className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div className="p-3 rounded-lg bg-green-100">
                              {consultation.type === 'VIDEO' ? (
                                <Video className="w-6 h-6 text-green-600" />
                              ) : (
                                <MessageCircle className="w-6 h-6 text-green-600" />
                              )}
                            </div>

                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {consultation.patientName}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-medium">
                                  ACTIVE
                                </span>
                                {consultation.doctorName && (
                                  <span>with {consultation.doctorName}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              router.push(`/dashboard/consultations/${consultation.consultationId}`)
                            }
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                          >
                            Rejoin
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

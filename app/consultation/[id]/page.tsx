'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ConsultationRoom } from '@/components/consultation/ConsultationRoom'

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
}

export default function ConsultationPage() {
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string

  const [consultation, setConsultation] = useState<Consultation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT')

  useEffect(() => {
    const loadConsultation = async () => {
      try {
        // Get user info from localStorage
        const token = localStorage.getItem('ll_token')
        const userStr = localStorage.getItem('ll_user')

        if (!token || !userStr) {
          setError('Please log in to view this consultation')
          setLoading(false)
          return
        }

        const user = JSON.parse(userStr)
        const patientId = user.id
        const patientName = user.name

        setUserId(patientId)
        setUserName(patientName)
        setUserRole('PATIENT')

        // Fetch consultation details
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/consultations/${consultationId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to load consultation')
        }

        setConsultation(data.data)
        setLoading(false)
      } catch (err: any) {
        console.error('Load consultation error:', err)
        setError(err.message || 'Failed to load consultation')
        setLoading(false)
      }
    }

    loadConsultation()
  }, [consultationId])

  const handleEndConsultation = () => {
    // Redirect back to dashboard
    router.push('/patient/dashboard')
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading consultation...</p>
        </div>
      </div>
    )
  }

  if (error || !consultation) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Consultation not found'}</p>
            <button
              onClick={() => router.push('/patient/dashboard')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ConsultationRoom
      consultationId={consultation.consultationId}
      roomId={consultation.roomId}
      userId={userId}
      userName={userName}
      userRole={userRole}
      type={consultation.type}
      onEnd={handleEndConsultation}
    />
  )
}

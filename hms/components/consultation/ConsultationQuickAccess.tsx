'use client'

import { useRouter } from 'next/navigation'
import { Video, Users, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
const HOSPITAL_ID = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'

export function ConsultationQuickAccess() {
  const router = useRouter()
  const [waitingCount, setWaitingCount] = useState(0)

  useEffect(() => {
    loadWaitingCount()
    const interval = setInterval(loadWaitingCount, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadWaitingCount = async () => {
    try {
      const token = localStorage.getItem('hms_token')
      if (!token) return

      const response = await axios.get(
        `${API_URL}/consultations/hospital/${HOSPITAL_ID}/waiting`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setWaitingCount(response.data.data.consultations.length)
      }
    } catch (error) {
      // Silent fail
    }
  }

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Video className="w-6 h-6" />
            <h3 className="text-xl font-bold">Video Consultations</h3>
          </div>
          
          <p className="text-primary-100 text-sm mb-4">
            Join waiting consultations and connect with patients
          </p>
          
          <div className="flex items-center space-x-4 text-sm mb-6">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {waitingCount} patient{waitingCount !== 1 ? 's' : ''} waiting
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Real-time updates
            </span>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/consultations')}
            className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-md"
          >
            View Consultations
            {waitingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {waitingCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="hidden md:block ml-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center relative">
            <Video className="w-12 h-12" />
            {waitingCount > 0 && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-sm font-bold animate-pulse">
                {waitingCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

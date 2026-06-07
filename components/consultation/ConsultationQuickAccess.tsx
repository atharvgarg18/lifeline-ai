'use client'

import { useRouter } from 'next/navigation'
import { Video, Calendar, Clock } from 'lucide-react'

export function ConsultationQuickAccess() {
  const router = useRouter()

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Video className="w-6 h-6" />
            <h3 className="text-xl font-bold">Video Consultation</h3>
          </div>
          
          <p className="text-primary-100 text-sm mb-4">
            Connect with doctors instantly through secure HD video calls
          </p>
          
          <div className="flex items-center space-x-4 text-sm mb-6">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Available 24/7
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              No appointment needed
            </span>
          </div>
          
          <button
            onClick={() => router.push('/patient/consultation')}
            className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-md"
          >
            Start Consultation Now
          </button>
        </div>
        
        <div className="hidden md:block ml-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <Video className="w-12 h-12" />
          </div>
        </div>
      </div>
    </div>
  )
}

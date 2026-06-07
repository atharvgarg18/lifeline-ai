'use client'

import { useEffect, useState } from 'react'
import { useEmergencyStore } from '@/store/emergencyStore'
import { hmsApi } from '@/services/hmsApi'
import { formatDistanceToNow } from 'date-fns'
import { Clock, MapPin, AlertCircle, Activity, Check, X, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmergencyPage() {
  const { pendingRequests, removeRequest } = useEmergencyStore()
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [availableBeds, setAvailableBeds] = useState<any[]>([])
  const [selectedBed, setSelectedBed] = useState<string>('')
  const [accepting, setAccepting] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    loadPendingEmergencies()
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      loadPendingEmergencies()
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const loadPendingEmergencies = async () => {
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      const response = await hmsApi.getPendingEmergencies(hospitalId)
      
      // Populate the store with the fetched emergencies
      if (response.success && response.data.requests) {
        // Clear existing requests first
        useEmergencyStore.getState().clearRequests()
        
        // Add all fetched requests to the store
        response.data.requests.forEach((request: any) => {
          useEmergencyStore.getState().addRequest(request)
        })
        
        console.log('Loaded', response.data.requests.length, 'emergency requests')
      }
    } catch (error) {
      console.error('Failed to load emergencies:', error)
      toast.error('Failed to load emergency requests')
    }
  }

  const loadAvailableBeds = async (bedType: string) => {
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      const result = await hmsApi.getBeds(hospitalId, {
        status: 'AVAILABLE',
        bedType,
      })
      setAvailableBeds(result.data.beds)
    } catch (error) {
      console.error('Failed to load beds:', error)
      toast.error('Failed to load available beds')
    }
  }

  const handleSelectRequest = (request: any) => {
    setSelectedRequest(request)
    loadAvailableBeds(request.requiredBedType)
    setSelectedBed('')
  }

  const handleAccept = async () => {
    if (!selectedRequest || !selectedBed) {
      toast.error('Please select a bed')
      return
    }

    setAccepting(true)
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      await hmsApi.acceptEmergency(
        selectedRequest.requestId,
        hospitalId,
        selectedBed
      )

      toast.success('Emergency accepted successfully!')
      
      // Remove from store
      removeRequest(selectedRequest.requestId)
      
      setSelectedRequest(null)
      setSelectedBed('')
    } catch (error) {
      console.error('Failed to accept emergency:', error)
      toast.error('Failed to accept emergency')
    } finally {
      setAccepting(false)
    }
  }

  const handleReject = async () => {
    if (!selectedRequest) return

    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setRejecting(true)
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      await hmsApi.rejectEmergency(
        selectedRequest.requestId,
        hospitalId,
        rejectReason
      )

      toast.success('Emergency rejected')
      
      // Remove from store
      removeRequest(selectedRequest.requestId)
      
      setSelectedRequest(null)
      setRejectReason('')
    } catch (error) {
      console.error('Failed to reject emergency:', error)
      toast.error('Failed to reject emergency')
    } finally {
      setRejecting(false)
    }
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return 'text-danger-600 bg-danger-100'
    if (severity >= 5) return 'text-warning-600 bg-warning-100'
    return 'text-primary-600 bg-primary-100'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emergency Requests List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pending Emergencies
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {pendingRequests.length} request
                    {pendingRequests.length !== 1 ? 's' : ''} waiting
                  </p>
                </div>
                <button
                  onClick={loadPendingEmergencies}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {pendingRequests.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">No pending emergency requests</p>
                </div>
              ) : (
                pendingRequests.map((request) => (
                  <button
                    key={request.requestId}
                    onClick={() => handleSelectRequest(request)}
                    className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                      selectedRequest?.requestId === request.requestId
                        ? 'bg-primary-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                          request.severity
                        )}`}
                      >
                        <Activity className="w-3 h-3 mr-1" />
                        Severity {request.severity}/10
                      </span>
                      <span className="text-xs text-gray-500">
                        Batch {request.batchNumber}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {request.requiredBedType} Required
                    </p>

                    <div className="flex items-center text-xs text-gray-600 space-x-3">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {request.distance.toFixed(1)} km
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {request.eta} min
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      {formatDistanceToNow(new Date(request.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Emergency Details */}
        <div className="lg:col-span-2">
          {!selectedRequest ? (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                Select an emergency request to view details
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Request Details */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Emergency Request
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Request ID: {selectedRequest.requestId}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                      selectedRequest.severity
                    )}`}
                  >
                    Severity {selectedRequest.severity}/10
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Distance
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedRequest.distance.toFixed(1)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      ETA
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedRequest.eta} minutes
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Required Bed
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedRequest.requiredBedType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase">
                      Your Score
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedRequest.score.toFixed(1)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                    Symptoms
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.symptoms.map((symptom: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-warning-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-warning-900">
                        Time Remaining
                      </p>
                      <p className="text-sm text-warning-700 mt-1">
                        This request will expire in{' '}
                        {formatDistanceToNow(new Date(selectedRequest.timeoutAt))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bed Selection */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Bed
                </h4>

                {availableBeds.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No available {selectedRequest.requiredBedType} beds
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {availableBeds.map((bed) => (
                      <button
                        key={bed.bedId}
                        onClick={() => setSelectedBed(bed.bedId)}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          selectedBed === bed.bedId
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">
                            {bed.bedNumber}
                          </p>
                          {selectedBed === bed.bedId && (
                            <Check className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {bed.ward} | Floor {bed.floor}
                        </p>
                        {bed.features && bed.features.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {bed.features.join(', ')}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex space-x-4">
                  <button
                    onClick={handleAccept}
                    disabled={!selectedBed || accepting}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-success-600 text-white font-medium rounded-lg hover:bg-success-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-5 h-5" />
                    <span>{accepting ? 'Accepting...' : 'Accept Emergency'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const reason = prompt('Reason for rejection:')
                      if (reason) {
                        setRejectReason(reason)
                        handleReject()
                      }
                    }}
                    disabled={rejecting}
                    className="px-6 py-3 bg-danger-600 text-white font-medium rounded-lg hover:bg-danger-700 transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

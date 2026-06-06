'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

export default function PatientQRPage() {
  const [qrData, setQrData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [patientId, setPatientId] = useState<string>('')

  useEffect(() => {
    // Get patient ID from auth/session
    const mockPatientId = 'PAT-001' // Replace with actual auth
    setPatientId(mockPatientId)
    
    // Check for existing valid QR
    loadExistingQR(mockPatientId)
  }, [])

  const loadExistingQR = async (patientId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/patient-profile/patients/${patientId}/qr/active`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setQrData(data.data)
        } else {
          // No active QR, generate new one
          generateNewQR(patientId)
        }
      } else {
        generateNewQR(patientId)
      }
    } catch (error) {
      console.error('Failed to load QR:', error)
      generateNewQR(patientId)
    }
  }

  const generateNewQR = async (patientId: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/patient-profile/patients/${patientId}/qr/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to generate QR code')
      }

      const data = await response.json()
      
      if (data.success) {
        setQrData(data.data)
        toast.success('QR code generated successfully')
      } else {
        throw new Error(data.message || 'Failed to generate QR')
      }
    } catch (error: any) {
      console.error('QR generation error:', error)
      toast.error(error.message || 'Failed to generate QR code')
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshQR = () => {
    if (patientId) {
      generateNewQR(patientId)
    }
  }

  const handleDownloadQR = () => {
    if (!qrData) return

    const svg = document.getElementById('patient-qr-code')
    if (!svg) return

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    // Create download link
    const link = document.createElement('a')
    link.href = url
    link.download = `patient-qr-${patientId}.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('QR code downloaded')
  }

  const isExpiringSoon = () => {
    if (!qrData?.expiresAt) return false
    const expiryTime = new Date(qrData.expiresAt).getTime()
    const now = Date.now()
    const hoursRemaining = (expiryTime - now) / (1000 * 60 * 60)
    return hoursRemaining < 6 // Less than 6 hours
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Medical QR Code
          </h1>
          <p className="text-gray-600">
            Show this QR code at any hospital for instant admission
          </p>
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner"></div>
            </div>
          ) : qrData ? (
            <>
              {/* Status Banner */}
              {qrData.status === 'ACTIVE' && !isExpiringSoon() && (
                <div className="bg-success-50 border-b border-success-200 px-6 py-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success-600 mr-2" />
                    <span className="text-sm font-medium text-success-900">
                      QR Code Active & Valid
                    </span>
                  </div>
                </div>
              )}

              {isExpiringSoon() && (
                <div className="bg-warning-50 border-b border-warning-200 px-6 py-3">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-warning-600 mr-2" />
                    <span className="text-sm font-medium text-warning-900">
                      QR Code expiring soon - Consider generating a new one
                    </span>
                  </div>
                </div>
              )}

              {/* QR Code Display */}
              <div className="p-8">
                <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <QRCodeSVG
                    id="patient-qr-code"
                    value={qrData.qrData}
                    size={280}
                    level="H"
                    includeMargin
                  />
                </div>

                {/* QR Info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      QR Code ID
                    </span>
                    <span className="text-sm font-mono font-bold text-gray-900">
                      {qrData.qrCodeId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Patient ID
                    </span>
                    <span className="text-sm font-mono font-bold text-gray-900">
                      {patientId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Generated
                    </span>
                    <span className="text-sm text-gray-900">
                      {formatDistanceToNow(new Date(qrData.generatedAt || Date.now()), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <span className="text-sm font-medium text-gray-600">
                      Expires
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isExpiringSoon()
                          ? 'text-warning-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {formatDistanceToNow(new Date(qrData.expiresAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleDownloadQR}
                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download QR</span>
                  </button>

                  <button
                    onClick={handleRefreshQR}
                    disabled={loading}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">No active QR code found</p>
              <button
                onClick={handleRefreshQR}
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Generate QR Code
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3">
            How to use your QR code:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Show this QR code to hospital staff during admission</li>
            <li>Staff will scan it to instantly access your medical records</li>
            <li>Your allergies, chronic diseases, and emergency contacts will be visible</li>
            <li>Speeds up the admission process significantly</li>
            <li>QR code is valid for 24 hours from generation</li>
            <li>Generate a new one if it expires</li>
          </ol>
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-gray-600 mr-2 mt-0.5" />
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Security Notice:</p>
              <p>
                This QR code is uniquely encrypted with HMAC-SHA256 signature
                and can only be scanned by authorized LifeLine hospitals. Each
                code is valid for 24 hours and can only be used once for admission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

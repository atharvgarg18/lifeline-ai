'use client'

import { useEffect, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, RefreshCw, AlertCircle, CheckCircle, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface PatientInfo {
  userId: string
  healthIdNumber: string
  name: string
  email: string
  phone: string
}

interface QRData {
  qrCodeId: string
  qrData: string
  expiresAt: string
  generatedAt: string
  status: string
  patientInfo: PatientInfo
}

export default function PatientQRPage() {
  const [qrData, setQrData] = useState<QRData | null>(null)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadQR()
  }, [])

  const checkAuthAndLoadQR = async () => {
    const token = localStorage.getItem('ll_token')
    
    if (!token) {
      toast.error('Please login to generate QR code')
      router.push('/login')
      return
    }

    setIsAuthenticated(true)
    setChecking(false)
    
    // Try to load existing active QR
    await loadExistingQR(token)
  }

  const loadExistingQR = async (token: string) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
      
      const response = await fetch(
        `${API_URL}/patient-profile/qr/active`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('ll_token')
          localStorage.removeItem('ll_user')
          toast.error('Session expired. Please login again')
          router.push('/login')
          return
        }
        throw new Error('Failed to load QR code')
      }

      const data = await response.json()
      
      if (data.success && data.data) {
        setQrData(data.data)
      } else {
        // No active QR, generate new one
        await generateNewQR(token)
      }
    } catch (error: any) {
      console.error('Failed to load QR:', error)
      // If no existing QR, generate new one
      await generateNewQR(token)
    }
  }

  const generateNewQR = async (token?: string) => {
    const authToken = token || localStorage.getItem('ll_token')
    
    if (!authToken) {
      toast.error('Please login to generate QR code')
      router.push('/login')
      return
    }

    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
      
      const response = await fetch(
        `${API_URL}/patient-profile/qr/generate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('ll_token')
          localStorage.removeItem('ll_user')
          toast.error('Session expired. Please login again')
          router.push('/login')
          return
        }
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to generate QR code')
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
    generateNewQR()
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
    link.download = `lifeline-qr-${qrData.patientInfo.healthIdNumber}.svg`
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

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
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
              <div className="text-center">
                <div className="spinner mb-4"></div>
                <p className="text-gray-600">Generating your QR code...</p>
              </div>
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

              {/* Patient Info Banner */}
              <div className="bg-primary-50 border-b border-primary-200 px-6 py-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{qrData.patientInfo.name}</h3>
                    <p className="text-sm text-gray-600">Health ID: {qrData.patientInfo.healthIdNumber}</p>
                  </div>
                </div>
              </div>

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
                      Patient Name
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {qrData.patientInfo.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      Health ID
                    </span>
                    <span className="text-sm font-mono font-bold text-gray-900">
                      {qrData.patientInfo.healthIdNumber}
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
                disabled={loading}
                className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
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
                and contains your actual patient information. It can only be scanned 
                by authorized LifeLine hospitals. Each code is valid for 24 hours and 
                can only be used once for admission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

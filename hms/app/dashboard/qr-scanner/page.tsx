'use client'

import { useState, useEffect, useRef } from 'react'
import { useQRScanner } from '@/hooks/useQRScanner'
import { hmsApi } from '@/services/hmsApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Camera, User, AlertCircle, CheckCircle, X, FlashlightOff, Flashlight, SwitchCamera } from 'lucide-react'

export default function QRScannerPage() {
  const [patientData, setPatientData] = useState<any>(null)
  const [shouldShowScanner, setShouldShowScanner] = useState(false)
  const scannerInitializedRef = useRef(false)
  const router = useRouter()

  const {
    isScanning,
    hasPermission,
    error: scanError,
    startScanning,
    stopScanning,
    resetError,
    toggleTorch,
    switchCamera,
    isTorchOn,
    cameras,
  } = useQRScanner(
    'qr-reader',
    async (result) => {
      // QR code scanned successfully
      console.log('QR Code scanned:', result.decodedText)

      // Stop scanner immediately
      await stopScanning()

      // Show loading toast
      const loadingToast = toast.loading('Validating QR code...')

      try {
        const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
        const response = await hmsApi.scanQRCode(result.decodedText, hospitalId)

        toast.dismiss(loadingToast)

        if (response.data?.success && response.data?.data?.qrValid) {
          setPatientData({
            ...response.data.data.patient,
            qrCodeId: response.data.data.qrCodeId,
          })
          setShouldShowScanner(false)
          toast.success('✓ Patient verified successfully', {
            duration: 3000,
            icon: '✓',
          })
        } else {
          toast.error(response.data?.message || 'Invalid or expired QR code')
          setTimeout(() => handleStartScanning(), 2000)
        }
      } catch (error: any) {
        toast.dismiss(loadingToast)
        console.error('QR validation failed:', error)
        toast.error('Failed to validate QR code')
        setTimeout(() => handleStartScanning(), 2000)
      }
    },
    (error) => {
      console.error('Scanner error:', error)
    }
  )

  const handleStartScanning = () => {
    resetError()
    setPatientData(null)
    setShouldShowScanner(true)
  }

  // Auto-start scanner when element is rendered
  useEffect(() => {
    if (shouldShowScanner && !scannerInitializedRef.current && !isScanning) {
      scannerInitializedRef.current = true
      // Give React time to render the qr-reader div
      setTimeout(() => {
        console.log('🎥 Starting scanner...')
        startScanning()
      }, 200)
    }
    
    if (!shouldShowScanner) {
      scannerInitializedRef.current = false
    }
  }, [shouldShowScanner, isScanning, startScanning])

  const handleStopScanning = async () => {
    await stopScanning()
    setShouldShowScanner(false)
  }

  const handleQuickAdmit = async () => {
    if (!patientData) return

    const loadingToast = toast.loading('Processing admission...')

    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      
      // Call quick admit API
      const response = await hmsApi.quickAdmit({
        patientId: patientData.userId, // Use userId (actual user ID from auth)
        qrCodeId: patientData.qrCodeId,
        hospitalId: hospitalId,
        admissionType: 'Emergency',
        bedType: 'General',
        symptoms: ['Emergency admission via QR scan'],
      })

      toast.dismiss(loadingToast)

      if (response.success) {
        toast.success('✓ Patient admitted successfully', {
          duration: 4000,
          icon: '✓',
        })
        
        // Navigate to admissions list
        setTimeout(() => {
          router.push('/dashboard/admissions')
        }, 1500)
      } else {
        toast.error(response.message || 'Failed to admit patient')
      }
    } catch (error: any) {
      toast.dismiss(loadingToast)
      console.error('Admission failed:', error)
      toast.error(error.response?.data?.message || 'Failed to admit patient')
    }
  }

  return (
    <div className="w-full mx-auto space-y-4 sm:space-y-6 px-2 sm:px-4 max-w-4xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">QR Code Scanner</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Scan patient QR code for instant admission
            </p>
          </div>
          {!isScanning && !patientData && (
            <button
              onClick={handleStartScanning}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto"
            >
              <Camera className="w-5 h-5" />
              <span>Start Scanner</span>
            </button>
          )}
        </div>
      </div>

      {/* Permission Denied */}
      {hasPermission === false && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-danger-600 mr-3 mt-1" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-danger-900 mb-2">
                Camera Access Required
              </h3>
              <p className="text-sm text-danger-700 mb-4">
                To scan QR codes, please allow camera access in your browser settings.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-900 mb-2">For Mobile Devices:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Tap the lock/info icon in your browser's address bar</li>
                  <li>Find "Camera" permissions</li>
                  <li>Select "Allow"</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-danger-600 text-white font-medium rounded-lg hover:bg-danger-700 transition-colors text-sm"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanner Error */}
      {scanError && !patientData && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-warning-600 mr-2" />
              <p className="text-sm text-warning-800">{scanError}</p>
            </div>
            <button
              onClick={handleStartScanning}
              className="text-sm font-medium text-warning-900 hover:text-warning-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Scanner */}
      {shouldShowScanner && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-3 sm:p-6">
          <div className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="w-full relative">
              <div id="qr-reader" className="rounded-lg overflow-hidden min-h-[250px] sm:min-h-[350px]"></div>
              
              {/* Scanner Controls */}
              {isScanning && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-10">
                  {/* Torch/Flashlight Toggle */}
                  <button
                    onClick={toggleTorch}
                    className="p-4 sm:p-3 bg-black bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-all shadow-lg touch-manipulation active:scale-95"
                    title={isTorchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
                  >
                    {isTorchOn ? (
                      <Flashlight className="w-6 h-6 sm:w-5 sm:h-5" />
                    ) : (
                      <FlashlightOff className="w-6 h-6 sm:w-5 sm:h-5" />
                    )}
                  </button>

                  {/* Camera Switch */}
                  {cameras.length > 1 && (
                    <button
                      onClick={switchCamera}
                      className="p-4 sm:p-3 bg-black bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-all shadow-lg touch-manipulation active:scale-95"
                      title="Switch camera"
                    >
                      <SwitchCamera className="w-6 h-6 sm:w-5 sm:h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-center text-sm text-gray-600 space-y-2 px-2">
              <p className="font-medium text-base sm:text-sm">📷 Position QR code within the frame</p>
              <p className="text-xs">Scanner will automatically detect and verify the code</p>
              {cameras.length > 0 && (
                <p className="text-xs text-gray-500">
                  {cameras.length} camera(s) available
                </p>
              )}
            </div>

            <button
              onClick={handleStopScanning}
              className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors touch-manipulation active:scale-95"
            >
              <X className="w-4 h-4" />
              <span>Stop Scanner</span>
            </button>
          </div>
        </div>
      )}

      {/* Patient Information */}
      {patientData && (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Success banner */}
          <div className="bg-success-50 border-b border-success-200 p-3 sm:p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success-600 mr-2 sm:mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-success-900">
                  QR Code Verified Successfully
                </p>
                <p className="text-xs text-success-700 mt-1">
                  Patient information loaded and ready for admission
                </p>
              </div>
            </div>
          </div>

          {/* Patient details */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {patientData.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  Health ID: {patientData.healthIdNumber || 'N/A'}
                </p>
              </div>
            </div>

            {/* Patient details grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Age</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {patientData.age} years
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Gender</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {patientData.gender}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Blood Group
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {patientData.bloodGroup}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                <p className="text-sm font-medium text-gray-900 mt-1 truncate">
                  {patientData.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Allergies */}
            {patientData.allergies && patientData.allergies.length > 0 && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-danger-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-danger-900">
                      Allergies
                    </p>
                    <p className="text-sm text-danger-700 mt-1">
                      {patientData.allergies.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Chronic Diseases */}
            {patientData.chronicDiseases &&
              patientData.chronicDiseases.length > 0 && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-warning-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-warning-900">
                        Chronic Diseases
                      </p>
                      <p className="text-sm text-warning-700 mt-1">
                        {patientData.chronicDiseases.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Emergency Contacts */}
            {patientData.emergencyContacts &&
              patientData.emergencyContacts.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Emergency Contacts
                  </p>
                  <div className="space-y-2">
                    {patientData.emergencyContacts.map((contact: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg space-y-1 sm:space-y-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {contact.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {contact.relationship}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {contact.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleQuickAdmit}
                className="flex-1 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors touch-manipulation active:scale-95"
              >
                Quick Admit Patient
              </button>
              <button
                onClick={() => {
                  setPatientData(null)
                  handleStartScanning()
                }}
                className="sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors touch-manipulation active:scale-95"
              >
                Scan Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isScanning && !patientData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3">
            Mobile QR Scanner Instructions:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Tap "Start Scanner" button above</li>
            <li>Allow camera access when prompted by your browser</li>
            <li>Hold phone steady and position QR code in center of frame</li>
            <li>Keep QR code well-lit and at arms length for best results</li>
            <li>Scanner will automatically detect and verify the code</li>
            <li>Use flashlight button if needed in low light</li>
            <li>Switch camera button to toggle between front/rear cameras</li>
          </ol>
        </div>
      )}
    </div>
  )
}

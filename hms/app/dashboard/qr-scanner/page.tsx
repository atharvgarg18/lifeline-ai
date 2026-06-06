'use client'

import { useState } from 'react'
import { useQRScanner } from '@/hooks/useQRScanner'
import { hmsApi } from '@/services/hmsApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Camera, User, AlertCircle, CheckCircle, X, FlashlightOff, Flashlight, SwitchCamera } from 'lucide-react'

export default function QRScannerPage() {
  const [patientData, setPatientData] = useState<any>(null)
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

        if (response.success && response.data.qrValid) {
          setPatientData({
            ...response.data.patient,
            qrCodeId: response.data.qrCodeId,
          })
          toast.success('✓ Patient verified successfully', {
            duration: 3000,
            icon: '✓',
          })
        } else {
          toast.error('Invalid or expired QR code')
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

  const handleQuickAdmit = () => {
    if (!patientData) return
    const params = new URLSearchParams({
      patientId: patientData.patientId,
      qrCodeId: patientData.qrCodeId,
    })
    router.push(`/dashboard/admissions/quick-admit?${params}`)
  }

  const handleStartScanning = () => {
    resetError()
    setPatientData(null)
    startScanning()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">QR Code Scanner</h2>
            <p className="text-sm text-gray-600 mt-1">
              Scan patient QR code for instant admission
            </p>
          </div>
          {!isScanning && !patientData && (
            <button
              onClick={handleStartScanning}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
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
      {isScanning && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-lg relative">
              <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
              
              {/* Scanner Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-10">
                {/* Torch/Flashlight Toggle */}
                <button
                  onClick={toggleTorch}
                  className="p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all shadow-lg"
                  title={isTorchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
                >
                  {isTorchOn ? (
                    <Flashlight className="w-5 h-5" />
                  ) : (
                    <FlashlightOff className="w-5 h-5" />
                  )}
                </button>

                {/* Camera Switch */}
                {cameras.length > 1 && (
                  <button
                    onClick={switchCamera}
                    className="p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-all shadow-lg"
                    title="Switch camera"
                  >
                    <SwitchCamera className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p className="font-medium">📷 Position QR code within the frame</p>
              <p className="text-xs">Scanner will automatically detect and verify the code</p>
              <p className="text-xs text-gray-500">
                {cameras.length} camera(s) available
              </p>
            </div>

            <button
              onClick={stopScanning}
              className="flex items-center space-x-2 px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
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
          <div className="bg-success-50 border-b border-success-200 p-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-success-600 mr-3" />
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
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {patientData.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Patient ID: {patientData.patientId}
                </p>
              </div>
            </div>

            {/* Patient details grid */}
            <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {patientData.phone || 'N/A'}
                </p>
              </div>
            </div>

            {/* Allergies */}
            {patientData.allergies && patientData.allergies.length > 0 && (
              <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-danger-600 mr-2 mt-0.5" />
                  <div>
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
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-warning-600 mr-2 mt-0.5" />
                    <div>
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
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
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
            <div className="flex space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleQuickAdmit}
                className="flex-1 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Quick Admit Patient
              </button>
              <button
                onClick={() => {
                  setPatientData(null)
                  handleStartScanning()
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
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

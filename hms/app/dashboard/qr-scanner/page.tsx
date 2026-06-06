'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode'
import { hmsApi } from '@/services/hmsApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Camera, User, AlertCircle, CheckCircle, X } from 'lucide-react'

export default function QRScannerPage() {
  const [scanning, setScanning] = useState(false)
  const [patientData, setPatientData] = useState<any>(null)
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt')
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check camera permission on mount
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        setCameraPermission(result.state as any)
      })
    }
  }, [])

  useEffect(() => {
    if (scanning && !scannerRef.current) {
      try {
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            rememberLastUsedCamera: true,
            supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
            defaultZoomValueIfSupported: 2,
          },
          /* verbose= */ false
        )

        scanner.render(onScanSuccess, onScanError)
        scannerRef.current = scanner
      } catch (error) {
        console.error('Failed to initialize scanner:', error)
        toast.error('Failed to initialize camera scanner')
        setScanning(false)
      }
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear().catch(console.error)
        } catch (e) {
          console.error('Error clearing scanner:', e)
        }
        scannerRef.current = null
      }
    }
  }, [scanning])

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code scanned:', decodedText)

    // Stop scanner immediately to prevent multiple scans
    if (scannerRef.current) {
      try {
        await scannerRef.current.clear()
      } catch (e) {
        console.error('Error clearing scanner:', e)
      }
      scannerRef.current = null
    }
    setScanning(false)

    // Show loading toast
    const loadingToast = toast.loading('Validating QR code...')

    // Validate QR code with backend
    try {
      const hospitalId = process.env.NEXT_PUBLIC_HOSPITAL_ID || 'HOSP-001'
      const result = await hmsApi.scanQRCode(decodedText, hospitalId)

      toast.dismiss(loadingToast)

      if (result.success && result.data.qrValid) {
        setPatientData({
          ...result.data.patient,
          qrCodeId: result.data.qrCodeId,
        })
        toast.success('✓ Patient QR code verified successfully', { duration: 3000 })
      } else {
        toast.error('Invalid or expired QR code')
        // Allow scanning again after error
        setTimeout(() => startScanning(), 2000)
      }
    } catch (error: any) {
      toast.dismiss(loadingToast)
      console.error('QR validation failed:', error)
      toast.error(error.message || 'Failed to validate QR code')
      // Allow scanning again after error
      setTimeout(() => startScanning(), 2000)
    }
  }

  const onScanError = (error: any) => {
    // Silently ignore scan errors (happens frequently during scanning)
    // Only log to console for debugging
    if (error && !error.includes('NotFoundException')) {
      console.debug('Scan error:', error)
    }
  }

  const startScanning = async () => {
    // Request camera permission first
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Close the stream immediately, just checking permission
      stream.getTracks().forEach(track => track.stop())
      
      setCameraPermission('granted')
      setScanning(true)
      setPatientData(null)
    } catch (error: any) {
      console.error('Camera permission denied:', error)
      setCameraPermission('denied')
      toast.error('Camera access denied. Please allow camera access in your browser settings.')
    }
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear().catch(console.error)
      } catch (e) {
        console.error('Error clearing scanner:', e)
      }
      scannerRef.current = null
    }
    setScanning(false)
  }

  const handleQuickAdmit = () => {
    if (!patientData) return

    // Navigate to quick admit with patient data
    const params = new URLSearchParams({
      patientId: patientData.patientId,
      qrCodeId: patientData.qrCodeId,
    })
    router.push(`/dashboard/admissions/quick-admit?${params}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">QR Code Scanner</h2>
            <p className="text-sm text-gray-600 mt-1">
              Scan patient QR code for quick admission
            </p>
          </div>
          {!scanning && !patientData && (
            <button
              onClick={startScanning}
              className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
              <span>Start Scanner</span>
            </button>
          )}
        </div>
      </div>

      {/* Scanner */}
      {scanning && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full max-w-lg">
              <div id="qr-reader" className="rounded-lg overflow-hidden"></div>
            </div>
            
            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>📷 Position QR code within the frame</p>
              <p className="text-xs">Scanner will automatically detect and verify the QR code</p>
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

      {/* Camera Permission Denied */}
      {cameraPermission === 'denied' && !scanning && !patientData && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-danger-600 mr-3 mt-1" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-danger-900 mb-2">
                Camera Access Denied
              </h3>
              <p className="text-sm text-danger-700 mb-4">
                To scan QR codes, you need to allow camera access in your browser settings.
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-danger-700 mb-4">
                <li>Click the camera icon in your browser's address bar</li>
                <li>Select "Always allow" for camera access</li>
                <li>Refresh this page</li>
              </ol>
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
                  startScanning()
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
      {!scanning && !patientData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-900 mb-3">
            How to use QR Scanner:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Click "Start Scanner" button above</li>
            <li>Allow camera access when prompted</li>
            <li>Position patient's QR code in front of the camera</li>
            <li>Wait for automatic scan and verification</li>
            <li>Review patient information</li>
            <li>Click "Quick Admit" to start admission process</li>
          </ol>
        </div>
      )}
    </div>
  )
}

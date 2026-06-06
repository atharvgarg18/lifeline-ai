/**
 * QR Scanner Hook
 * Production-grade mobile-optimized QR code scanning
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeScanType, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export interface QRScannerConfig {
  fps?: number;
  qrbox?: number | { width: number; height: number };
  aspectRatio?: number;
  disableFlip?: boolean;
  videoConstraints?: MediaTrackConstraints;
  formatsToSupport?: Html5QrcodeSupportedFormats[];
}

export interface QRScanResult {
  decodedText: string;
  result: any;
}

export interface QRScanError {
  message: string;
  name: string;
}

interface UseQRScannerReturn {
  isScanning: boolean;
  hasPermission: boolean | null;
  error: string | null;
  lastScan: QRScanResult | null;
  startScanning: () => Promise<void>;
  stopScanning: () => Promise<void>;
  resetError: () => void;
  switchCamera: () => Promise<void>;
  toggleTorch: () => Promise<void>;
  isTorchOn: boolean;
  cameras: MediaDeviceInfo[];
  currentCamera: string | null;
}

export function useQRScanner(
  elementId: string,
  onScan: (result: QRScanResult) => void,
  onError?: (error: QRScanError) => void,
  config?: QRScannerConfig
): UseQRScannerReturn {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<QRScanResult | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string | null>(null);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);

  // Mobile-optimized default configuration
  const defaultConfig: QRScannerConfig = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0,
    disableFlip: false,
    videoConstraints: {
      facingMode: { ideal: 'environment' }, // Rear camera for mobile
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    },
    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
  };

  const finalConfig = { ...defaultConfig, ...config };

  /**
   * Get available cameras
   */
  const getCameras = useCallback(async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      setCameras(devices);
      
      // Prefer rear camera on mobile
      const rearCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
      );
      
      if (rearCamera) {
        setCurrentCamera(rearCamera.id);
      } else if (devices.length > 0) {
        setCurrentCamera(devices[0].id);
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      setError('Could not access cameras');
    }
  }, []);

  /**
   * Request camera permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: finalConfig.videoConstraints,
      });
      
      // Store video track for torch control
      videoTrackRef.current = stream.getVideoTracks()[0];
      
      // Stop the test stream
      stream.getTracks().forEach((track) => track.stop());
      
      setHasPermission(true);
      return true;
    } catch (err: any) {
      console.error('Camera permission denied:', err);
      setHasPermission(false);
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser settings.'
          : 'Could not access camera. Please check your device settings.'
      );
      return false;
    }
  }, [finalConfig.videoConstraints]);

  /**
   * Start scanning
   */
  const startScanning = useCallback(async () => {
    if (isScanning) return;

    setError(null);

    // Request permission first
    const permitted = await requestPermission();
    if (!permitted) return;

    // Get cameras
    await getCameras();

    try {
      // Initialize scanner
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(elementId);
      }

      const scanner = scannerRef.current;

      // Success callback
      const qrCodeSuccessCallback = (decodedText: string, result: any) => {
        const scanResult: QRScanResult = { decodedText, result };
        setLastScan(scanResult);
        onScan(scanResult);
      };

      // Error callback (silently handle scanning errors)
      const qrCodeErrorCallback = (errorMessage: string) => {
        // Don't spam error messages - these are normal during scanning
        if (
          !errorMessage.includes('NotFoundException') &&
          !errorMessage.includes('No MultiFormat Readers')
        ) {
          console.debug('QR Scan error:', errorMessage);
        }
      };

      // Start scanning with camera
      await scanner.start(
        currentCamera || { facingMode: 'environment' },
        {
          fps: finalConfig.fps || 10,
          qrbox: finalConfig.qrbox,
          aspectRatio: finalConfig.aspectRatio,
          disableFlip: finalConfig.disableFlip,
          videoConstraints: finalConfig.videoConstraints,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          formatsToSupport: finalConfig.formatsToSupport,
        } as any,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setError(err.message || 'Failed to start camera');
      
      if (onError) {
        onError({ message: err.message, name: err.name });
      }
    }
  }, [
    isScanning,
    requestPermission,
    getCameras,
    elementId,
    currentCamera,
    finalConfig,
    onScan,
    onError,
  ]);

  /**
   * Stop scanning
   */
  const stopScanning = useCallback(async () => {
    if (!isScanning || !scannerRef.current) return;

    try {
      await scannerRef.current.stop();
      setIsScanning(false);
      setIsTorchOn(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  }, [isScanning]);

  /**
   * Switch between available cameras
   */
  const switchCamera = useCallback(async () => {
    if (cameras.length <= 1) return;

    await stopScanning();

    const nextIndex = (currentCameraIndex + 1) % cameras.length;
    setCurrentCameraIndex(nextIndex);
    setCurrentCamera(cameras[nextIndex].id);

    // Restart with new camera
    setTimeout(() => startScanning(), 500);
  }, [cameras, currentCameraIndex, stopScanning, startScanning]);

  /**
   * Toggle torch/flashlight (if supported)
   */
  const toggleTorch = useCallback(async () => {
    if (!videoTrackRef.current) return;

    const track = videoTrackRef.current;
    const capabilities = track.getCapabilities() as any;

    if (!capabilities.torch) {
      setError('Torch not supported on this device');
      return;
    }

    try {
      await track.applyConstraints({
        advanced: [{ torch: !isTorchOn } as any],
      });
      setIsTorchOn(!isTorchOn);
    } catch (err) {
      console.error('Error toggling torch:', err);
      setError('Could not toggle torch');
    }
  }, [isTorchOn]);

  /**
   * Reset error state
   */
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch((err) => console.error('Cleanup error:', err));
      }
      if (videoTrackRef.current) {
        videoTrackRef.current.stop();
      }
    };
  }, []);

  return {
    isScanning,
    hasPermission,
    error,
    lastScan,
    startScanning,
    stopScanning,
    resetError,
    switchCamera,
    toggleTorch,
    isTorchOn,
    cameras,
    currentCamera,
  };
}

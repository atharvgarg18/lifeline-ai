import axios, { AxiosInstance } from 'axios'
import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

class HMSApi {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('hms_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // Don't show toast for every error - let components handle errors
        // Only log to console for debugging
        console.error('API Error:', error.response?.data?.message || error.message)
        return Promise.reject(error)
      }
    )
  }

  // QR Code APIs
  async scanQRCode(qrData: string, hospitalId: string) {
    return this.api.post('/hms/qr/scan', { qrData, hospitalId })
  }

  // Admission APIs
  async quickAdmit(data: {
    patientId: string
    hospitalId: string
    admissionType: string
    bedType: string
    symptoms: string[]
    vitals?: any
    qrCodeId?: string
  }) {
    return this.api.post('/hms/admission/quick-admit', data)
  }

  async getAdmissions(hospitalId: string, filters?: any) {
    return this.api.get('/hms/admissions', {
      params: { hospitalId, ...filters },
    })
  }

  async getAdmission(admissionId: string) {
    return this.api.get(`/hms/admissions/${admissionId}`)
  }

  async updateVitals(admissionId: string, vitals: any) {
    return this.api.post(`/hms/admissions/${admissionId}/vitals`, vitals)
  }

  async dischargePatient(admissionId: string, dischargeSummary: any) {
    return this.api.post(`/hms/admissions/${admissionId}/discharge`, dischargeSummary)
  }

  // Emergency APIs
  async getPendingEmergencies(hospitalId: string) {
    return this.api.get('/hms/emergency/pending', { params: { hospitalId } })
  }

  async acceptEmergency(requestId: string, hospitalId: string, bedId: string) {
    return this.api.post('/hms/emergency/accept', {
      requestId,
      hospitalId,
      bedId,
    })
  }

  async rejectEmergency(requestId: string, hospitalId: string, reason: string) {
    return this.api.post('/hms/emergency/reject', {
      requestId,
      hospitalId,
      reason,
    })
  }

  // Bed APIs
  async getBeds(hospitalId: string, filters?: any) {
    return this.api.get('/hms/beds', {
      params: { hospitalId, ...filters },
    })
  }

  async getBedAvailability(hospitalId: string) {
    return this.api.get('/hms/beds/availability', { params: { hospitalId } })
  }

  async allocateBed(bedId: string, patientId: string, admissionId: string) {
    return this.api.post('/hms/beds/allocate', {
      bedId,
      patientId,
      admissionId,
    })
  }

  async releaseBed(bedId: string) {
    return this.api.post('/hms/beds/release', { bedId })
  }
}

export const hmsApi = new HMSApi()

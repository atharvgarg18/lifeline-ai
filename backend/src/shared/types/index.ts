/**
 * Backend-local copy of shared types.
 * SOURCE OF TRUTH is d:\hc101\shared\types\index.ts
 * Keep in sync when adding new shared types.
 *
 * WHY: TypeScript rootDir constraint prevents re-exporting from outside backend/.
 * This shim duplicates only what the backend modules need.
 */

// ── User & Auth ───────────────────────────────────────────────────────────────
export type UserType = 'PATIENT' | 'DOCTOR' | 'AMBULANCE_DRIVER' | 'HOSPITAL_ADMIN' | 'SYSTEM_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
export type Language = 'HINDI' | 'ENGLISH' | 'TAMIL' | 'TELUGU' | 'KANNADA' | 'MARATHI';

export interface User {
  _id: string;
  email: string;
  phoneNumber: string;
  userType: UserType;
  profile: {
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    dateOfBirth?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    language: Language;
  };
  status: UserStatus;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

// ── Patient ───────────────────────────────────────────────────────────────────
export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'UNKNOWN';

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
}

export interface Surgery {
  name: string;
  date: string;
  hospital: string;
  surgeon?: string;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phoneNumber: string;
  email?: string;
}

export interface InsuranceDetails {
  providerName: string;
  policyNumber: string;
  groupNumber?: string;
  coverageAmount: number;
  expiryDate: string;
}

// ── Location ──────────────────────────────────────────────────────────────────
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Location extends Coordinates {
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

// ── Emergency SOS ─────────────────────────────────────────────────────────────
export type EmergencyType = 'ACCIDENT' | 'MEDICAL' | 'OTHER';
export type EmergencyStatus =
  | 'INITIATED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'HOSPITAL_NOTIFIED'
  | 'ARRIVED'
  | 'ADMITTED'
  | 'IN_TREATMENT'
  | 'DISCHARGED'
  | 'COMPLETED'
  | 'CANCELLED';
export type EmergencyPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EmergencySOS {
  _id: string;
  patientId: string;
  emergencyType: EmergencyType;
  status: EmergencyStatus;
  location: Location;
  description: string;
  severityScore: number;
  priority: EmergencyPriority;
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  assignedDoctorId?: string;
  triageDataId?: string;
  estimatedArrivalTime?: number;
  actualArrivalTime?: number;
  timeline: TimelineEntry[];
  familyNotificationSent: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledReason?: string;
}

export interface TimelineEntry {
  status: EmergencyStatus;
  timestamp: string;
  note?: string;
}

export interface TriggerSOSRequest {
  patientId: string;
  emergencyType: EmergencyType;
  location: Location;
  description: string;
  contactMethod?: 'PHONE' | 'SMS' | 'WHATSAPP';
}

// ── Ambulance ─────────────────────────────────────────────────────────────────
export type AmbulanceStatus = 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'OFF_DUTY';

// ── Hospital ──────────────────────────────────────────────────────────────────
export type HospitalType = 'PRIVATE' | 'GOVERNMENT' | 'NGO';
export type OverloadStatus = 'AVAILABLE' | 'MEDIUM_LOAD' | 'OVERLOADED';

// ── Doctor ────────────────────────────────────────────────────────────────────
export interface Doctor {
  _id: string;
  userId: string;
  licenseNumber: string;
  specialization: string;
  qualifications: string[];
  hospitalAffiliations: string[];
  availabilityStatus: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  currentAssignmentCount: number;
  maxConcurrentAssignments: number;
  rating: number;
  totalConsultations: number;
  averageConsultationTime: number;
  responseTime: number;
  createdAt: string;
  updatedAt: string;
}

// ── Appointments ──────────────────────────────────────────────────────────────
export type AppointmentType = 'IN_PERSON' | 'VIDEO_CALL' | 'PHONE';
export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export interface Appointment {
  _id: string;
  patientId: string;
  doctorId: string;
  hospitalId?: string;
  type: AppointmentType;
  status: AppointmentStatus;
  scheduledAt: string;
  durationMinutes: number;
  reason: string;
  specialization: string;
  videoCallRoomId?: string;
  videoCallUrl?: string;
  videoCallToken?: string;
  doctorVideoToken?: string;
  videoCallExpiresAt?: string;
  recommendationScore?: number;
  recommendationReason?: string;
  doctorNotes?: string;
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorRecommendation {
  doctorId: string;
  name: string;
  specialization: string;
  rating: number;
  distance: number;
  availableSlots: number;
  nextAvailable: string;
  recommendationScore: number;
  recommendationReason: string;
  hospital: {
    name: string;
    address: string;
  };
  responseTime: number;
  totalConsultations: number;
}

export interface VideoCallSession {
  appointmentId: string;
  videoCallUrl: string;
  patientToken: string;
  doctorToken: string;
  roomId: string;
  expiresAt: string;
  provider: 'daily' | 'jitsi';
}

// ── Patient Dashboard & Analytics ─────────────────────────────────────────────
export interface PatientDashboard {
  profile: {
    name: string;
    bloodGroup: string;
    healthIdNumber: string;
    profileCompleted: boolean;
    age?: number;
  };
  activeEmergency: {
    id: string;
    status: string;
    emergencyType: string;
    createdAt: string;
  } | null;
  recentEmergencies: Pick<EmergencySOS, '_id' | 'status' | 'emergencyType' | 'severityScore' | 'createdAt'>[];
  upcomingAppointments: Pick<Appointment, '_id' | 'type' | 'scheduledAt' | 'specialization' | 'status'>[];
  stats: {
    totalEmergencies: number;
    totalAppointments: number;
    lastVisitDate?: string;
    profileCompletionPercent: number;
  };
}

export interface PatientAnalytics {
  emergencyHistory: {
    total: number;
    byType: Record<string, number>;
    byMonth: { month: string; count: number }[];
    avgSeverityScore: number;
    avgResponseTime: number;
  };
  appointments: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
    mostVisitedSpecialization?: string;
  };
  healthTrend: {
    lastCheckupDate?: string;
    chronicDiseaseCount: number;
    activeMedicationsCount: number;
    allergyCount: number;
  };
}

export interface QRCodeResponse {
  qrCodeBase64: string;
  expiresAt: string;
  healthIdNumber: string;
  generatedAt: string;
}

export interface QRCodePayload {
  patientId: string;
  healthIdNumber: string;
  name: string;
  bloodGroup: string;
  allergies: string[];
  emergencyContacts: EmergencyContact[];
  exp: number;
  iat: number;
}

// ── API Responses ─────────────────────────────────────────────────────────────
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

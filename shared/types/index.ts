// Shared TypeScript types for LifeLine AI
// Used across Frontend, Backend, and shared utilities

// ============================================
// User & Authentication Types
// ============================================

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

// ============================================
// Patient Types
// ============================================

export type BloodGroup = 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'UNKNOWN';

export interface PatientProfile {
  _id: string;
  userId: string;
  healthIdNumber: string;
  bloodGroup: BloodGroup;
  allergies: string[];
  chronicDiseases: string[];
  medications: Medication[];
  pastSurgeries: Surgery[];
  emergencyContacts: EmergencyContact[];
  insuranceDetails?: InsuranceDetails;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

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

// ============================================
// Location Types
// ============================================

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

// ============================================
// Emergency SOS Types
// ============================================

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
  severityScore: number; // 1-10
  priority: EmergencyPriority;
  assignedAmbulanceId?: string;
  assignedHospitalId?: string;
  assignedDoctorId?: string;
  triageDataId?: string;
  estimatedArrivalTime?: number; // minutes
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

// ============================================
// Ambulance Types
// ============================================

export type AmbulanceStatus = 'AVAILABLE' | 'IN_SERVICE' | 'MAINTENANCE' | 'OFF_DUTY';
export type VehicleType = 'BLS' | 'ALS' | 'ADVANCED';

export interface Ambulance {
  _id: string;
  registrationNumber: string;
  driverId: string;
  status: AmbulanceStatus;
  vehicleType: VehicleType;
  location: Location;
  equipment: string[];
  hospitalBaseId: string;
  capacity: {
    stretchers: number;
    patients: number;
  };
  currentEmergencyId?: string;
  rating: number; // 1-5
  totalTrips: number;
  insurance?: {
    provider: string;
    expiryDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AmbulanceLocation {
  _id: string;
  ambulanceId: string;
  location: Location;
  speed: number; // km/h
  heading: number; // 0-360 degrees
  accuracy: number; // meters
  timestamp: string;
}

export interface AmbulanceAssignment {
  _id: string;
  ambulanceId: string;
  emergencyId: string;
  status: 'ASSIGNED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'CANCELLED';
  priority: EmergencyPriority;
  estimatedArrivalTime: number;
  actualArrivalTime?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ============================================
// Hospital Types
// ============================================

export type HospitalType = 'PRIVATE' | 'GOVERNMENT' | 'NGO';
export type OverloadStatus = 'AVAILABLE' | 'MEDIUM_LOAD' | 'OVERLOADED';

export interface Hospital {
  _id: string;
  name: string;
  registrationNumber: string;
  location: Location;
  phoneNumber: string;
  email: string;
  website?: string;
  type: HospitalType;
  rating: number;
  beds: {
    general: BedInfo;
    icu: BedInfo;
    highDependency: BedInfo;
  };
  specializations: string[];
  operatingHours: {
    openTime: string;
    closeTime: string;
    emergency24x7: boolean;
  };
  averageWaitTime: number; // minutes
  overloadStatus: OverloadStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BedInfo {
  total: number;
  occupied: number;
  available: number;
}

export interface HospitalStatus {
  hospitalId: string;
  status: 'OPERATIONAL' | 'OVERLOADED' | 'DISASTER';
  bedsStatus: {
    general: BedInfo;
    icu: BedInfo;
    highDependency: BedInfo;
  };
  currentPatients: number;
  avgWaitTime: number;
  staffAvailable: {
    doctors: number;
    nurses: number;
  };
  overloadPrediction?: {
    willBeOverloaded: boolean;
    predictedAt: string;
  };
  lastUpdated: string;
}

// ============================================
// AI Triage Types
// ============================================

export interface Symptom {
  symptom: string;
  severity: number; // 1-10
  duration: number; // minutes
  onset: 'SUDDEN' | 'GRADUAL';
}

export interface Vitals {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
}

export interface TriageRequest {
  patientId: string;
  symptoms: Symptom[];
  vitals: Vitals;
  medicalHistory?: {
    chronicDiseases: string[];
    medications: string[];
  };
}

export interface DiagnosticHypothesis {
  condition: string;
  probability: number; // 0-1
  recommendedSpecialization: string;
}

export interface TriageResult {
  _id: string;
  emergencyId: string;
  patientId: string;
  symptoms: Symptom[];
  vitals: Vitals;
  severityScore: number; // 1-10
  priority: EmergencyPriority;
  diagnosticHypothesis: DiagnosticHypothesis[];
  recommendedDoctorSpecialization: string;
  recommendedBedType: 'GENERAL' | 'ICU' | 'HIGH_DEPENDENCY';
  firstAidSuggestions: string[];
  confidence: number; // 0-1
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Doctor Types
// ============================================

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
  averageConsultationTime: number; // minutes
  responseTime: number; // seconds
  createdAt: string;
  updatedAt: string;
}

export interface DoctorAssignment {
  _id: string;
  doctorId: string;
  patientId: string;
  emergencyId?: string;
  status: 'ASSIGNED' | 'ACTIVE' | 'COMPLETED' | 'TRANSFERRED';
  assignmentReason: string;
  estimatedConsultationTime: number;
  actualConsultationTime?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ============================================
// Complaint Types
// ============================================

export type ComplaintType = 'AMBULANCE_DELAY' | 'HOSPITAL_ISSUE' | 'STAFF_UNAVAILABLE' | 'MEDICINE_SHORTAGE' | 'OTHER';
export type ComplaintStatus = 'REGISTERED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
export type ComplaintSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Complaint {
  _id: string;
  ticketNumber: string;
  complaintType: ComplaintType;
  status: ComplaintStatus;
  priority: ComplaintSeverity;
  emergencyId?: string;
  filledBy: string;
  description: string;
  relatedEntity?: {
    type: 'AMBULANCE' | 'HOSPITAL' | 'STAFF' | 'OTHER';
    id: string;
  };
  attachments: string[];
  aiCategory: string;
  aiSimilarComplaints: string[];
  reviewedBy?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// ============================================
// Route Optimization Types
// ============================================

export interface RouteSegment {
  instruction: string;
  distance: number; // km
  duration: number; // minutes
}

export interface RouteOptimizationRequest {
  origin: Coordinates;
  destination: Coordinates;
  preferences?: {
    avoidTollRoads?: boolean;
    trafficAware?: boolean;
    emergency?: boolean;
  };
}

export interface OptimizedRoute {
  distance: number; // km
  duration: number; // minutes
  durationNoTraffic: number;
  coordinates: [number, number][]; // waypoints
  instructions: RouteSegment[];
  trafficInfo: {
    hasTraffic: boolean;
    severity: 'LOW' | 'MODERATE' | 'HIGH';
    affectedSegments: {
      segment: string;
      delay: number; // minutes
    }[];
  };
  greenCorridor?: {
    available: boolean;
    estTimeWithCorridor: number;
    estimatedDelay: number;
  };
}

// ============================================
// Notification Types
// ============================================

export type NotificationType = 
  | 'EMERGENCY_ALERT'
  | 'AMBULANCE_ARRIVAL'
  | 'HOSPITAL_ADMISSION'
  | 'FAMILY_ALERT'
  | 'COMPLAINT_UPDATE';
export type NotificationChannel = 'PUSH' | 'SMS' | 'EMAIL' | 'WHATSAPP';
export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED' | 'DELIVERED' | 'READ';

export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, any>;
  channels: NotificationChannel[];
  status: NotificationStatus;
  sentAt?: string;
  readAt?: string;
  createdAt: string;
}

// ============================================
// Analytics Types
// ============================================

export interface EmergencyMetrics {
  active: number;
  completed: number;
  avgResponseTime: number; // minutes
  avgTransitTime: number;
}

export interface AmbulanceMetrics {
  total: number;
  available: number;
  inService: number;
  utilization: number; // percentage
}

export interface HospitalMetrics {
  avgOccupancy: number;
  overloaded: number;
  availableBeds: number;
}

export interface DashboardOverview {
  timestamp: string;
  emergencies: EmergencyMetrics;
  ambulances: AmbulanceMetrics;
  hospitals: HospitalMetrics;
  complaints: {
    totalOpen: number;
    avgResolutionTime: number; // hours
    topIssues: string[];
  };
  geography: {
    accidentHotspots: {
      location: string;
      count: number;
    }[];
    responseSlowest: {
      area: string;
      avgTime: number;
    }[];
  };
}

// ============================================
// API Response Types
// ============================================

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
    details?: Record<string, any>;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ============================================
// Pagination Types
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// WebSocket Event Types
// ============================================

export type EmergencyEventType =
  | 'emergency:created'
  | 'emergency:severity_updated'
  | 'emergency:ambulance_assigned'
  | 'emergency:hospital_assigned'
  | 'emergency:doctor_assigned'
  | 'emergency:status_updated'
  | 'emergency:completed'
  | 'emergency:cancelled'
  | 'ambulance:location_updated'
  | 'ambulance:eta_updated'
  | 'hospital:bed_updated'
  | 'hospital:overload_alert'
  | 'notification:family_alert'
  | 'notification:doctor_alert'
  | 'notification:admin_alert';

export interface WebSocketEvent<T> {
  type: EmergencyEventType;
  data: T;
  timestamp: string;
}

// ============================================
// Error Types
// ============================================

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ============================================
// Export all types
// ============================================

export default {
  // Types are automatically exported above
};

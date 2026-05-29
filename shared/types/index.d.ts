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
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface GeoPoint {
    type: 'Point';
    coordinates: [number, number];
}
export interface Location extends Coordinates {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
}
export type EmergencyType = 'ACCIDENT' | 'MEDICAL' | 'OTHER';
export type EmergencyStatus = 'INITIATED' | 'DISPATCHED' | 'IN_TRANSIT' | 'HOSPITAL_NOTIFIED' | 'ARRIVED' | 'ADMITTED' | 'IN_TREATMENT' | 'DISCHARGED' | 'COMPLETED' | 'CANCELLED';
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
    rating: number;
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
    speed: number;
    heading: number;
    accuracy: number;
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
    averageWaitTime: number;
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
export interface Symptom {
    symptom: string;
    severity: number;
    duration: number;
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
    probability: number;
    recommendedSpecialization: string;
}
export interface TriageResult {
    _id: string;
    emergencyId: string;
    patientId: string;
    symptoms: Symptom[];
    vitals: Vitals;
    severityScore: number;
    priority: EmergencyPriority;
    diagnosticHypothesis: DiagnosticHypothesis[];
    recommendedDoctorSpecialization: string;
    recommendedBedType: 'GENERAL' | 'ICU' | 'HIGH_DEPENDENCY';
    firstAidSuggestions: string[];
    confidence: number;
    createdAt: string;
    updatedAt: string;
}
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
export interface RouteSegment {
    instruction: string;
    distance: number;
    duration: number;
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
    distance: number;
    duration: number;
    durationNoTraffic: number;
    coordinates: [number, number][];
    instructions: RouteSegment[];
    trafficInfo: {
        hasTraffic: boolean;
        severity: 'LOW' | 'MODERATE' | 'HIGH';
        affectedSegments: {
            segment: string;
            delay: number;
        }[];
    };
    greenCorridor?: {
        available: boolean;
        estTimeWithCorridor: number;
        estimatedDelay: number;
    };
}
export type NotificationType = 'EMERGENCY_ALERT' | 'AMBULANCE_ARRIVAL' | 'HOSPITAL_ADMISSION' | 'FAMILY_ALERT' | 'COMPLAINT_UPDATE';
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
export interface EmergencyMetrics {
    active: number;
    completed: number;
    avgResponseTime: number;
    avgTransitTime: number;
}
export interface AmbulanceMetrics {
    total: number;
    available: number;
    inService: number;
    utilization: number;
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
        avgResolutionTime: number;
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
export type EmergencyEventType = 'emergency:created' | 'emergency:severity_updated' | 'emergency:ambulance_assigned' | 'emergency:hospital_assigned' | 'emergency:doctor_assigned' | 'emergency:status_updated' | 'emergency:completed' | 'emergency:cancelled' | 'ambulance:location_updated' | 'ambulance:eta_updated' | 'hospital:bed_updated' | 'hospital:overload_alert' | 'notification:family_alert' | 'notification:doctor_alert' | 'notification:admin_alert';
export interface WebSocketEvent<T> {
    type: EmergencyEventType;
    data: T;
    timestamp: string;
}
export declare class AppError extends Error {
    code: string;
    statusCode: number;
    details?: Record<string, any> | undefined;
    constructor(code: string, statusCode: number, message: string, details?: Record<string, any> | undefined);
}
export type AppointmentType = 'IN_PERSON' | 'VIDEO_CALL' | 'PHONE';
export type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
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
export interface AppointmentSlot {
    startTime: string;
    endTime: string;
    available: boolean;
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
        byMonth: {
            month: string;
            count: number;
        }[];
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
declare const _default: {};
export default _default;
//# sourceMappingURL=index.d.ts.map
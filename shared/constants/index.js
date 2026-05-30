"use strict";
// Shared constants for LifeLine AI
// Use these constants across all services for consistency
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATIENT_ANALYTICS_RANGE_MONTHS = exports.QR_CODE_EXPIRY_HOURS = exports.VIDEO_CALL_EXPIRY_HOURS = exports.VIDEO_CALL_PROVIDERS = exports.RECOMMENDATION_WEIGHTS = exports.APPOINTMENT_DURATION_MINUTES = exports.APPOINTMENT_TYPES = exports.APPOINTMENT_STATUS = exports.MESSAGES = exports.REGEX_PATTERNS = exports.FEATURES = exports.PAGINATION = exports.DATABASE = exports.LOCATION_CONSTANTS = exports.TIME_CONSTANTS = exports.NOTIFICATION_CHANNELS = exports.NOTIFICATION_TYPES = exports.COMPLAINT_SEVERITY = exports.COMPLAINT_STATUS = exports.COMPLAINT_TYPES = exports.ONSET_TYPES = exports.SYMPTOM_SEVERITY = exports.VITAL_RANGES = exports.BLOOD_GROUPS = exports.HOSPITAL_SPECIALIZATIONS = exports.OCCUPANCY_THRESHOLDS = exports.BED_TYPES = exports.OVERLOAD_STATUS = exports.HOSPITAL_TYPES = exports.AMBULANCE_SEARCH_RADIUS = exports.VEHICLE_TYPES = exports.AMBULANCE_STATUS = exports.SEVERITY_THRESHOLDS = exports.EMERGENCY_PRIORITY = exports.EMERGENCY_STATUS = exports.EMERGENCY_TYPES = exports.ROLE_PERMISSIONS = exports.LANGUAGES = exports.USER_STATUS = exports.USER_TYPES = exports.ERROR_CODES = exports.HTTP_STATUS = exports.API_BASE_PATH = exports.API_VERSION = void 0;
// ============================================
// API Constants
// ============================================
exports.API_VERSION = 'v1';
exports.API_BASE_PATH = `/api/${exports.API_VERSION}`;
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    RATE_LIMITED: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};
// ============================================
// Error Codes
// ============================================
exports.ERROR_CODES = {
    // Validation Errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_EMAIL: 'INVALID_EMAIL',
    INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
    INVALID_LOCATION: 'INVALID_LOCATION',
    // Authentication Errors
    UNAUTHORIZED: 'UNAUTHORIZED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    // Authorization Errors
    FORBIDDEN: 'FORBIDDEN',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
    // Resource Not Found
    PATIENT_NOT_FOUND: 'PATIENT_NOT_FOUND',
    AMBULANCE_NOT_FOUND: 'AMBULANCE_NOT_FOUND',
    HOSPITAL_NOT_FOUND: 'HOSPITAL_NOT_FOUND',
    DOCTOR_NOT_FOUND: 'DOCTOR_NOT_FOUND',
    EMERGENCY_NOT_FOUND: 'EMERGENCY_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    // Conflict Errors
    AMBULANCE_NOT_AVAILABLE: 'AMBULANCE_NOT_AVAILABLE',
    DUPLICATE_EMERGENCY: 'DUPLICATE_EMERGENCY',
    BED_NOT_AVAILABLE: 'BED_NOT_AVAILABLE',
    DOCTOR_NOT_AVAILABLE: 'DOCTOR_NOT_AVAILABLE',
    // Service Errors
    AMBULANCE_UNAVAILABLE: 'AMBULANCE_UNAVAILABLE',
    NO_AVAILABLE_BEDS: 'NO_AVAILABLE_BEDS',
    AI_SERVICE_ERROR: 'AI_SERVICE_ERROR',
    MAPS_API_ERROR: 'MAPS_API_ERROR',
    SMS_SERVICE_ERROR: 'SMS_SERVICE_ERROR',
    // Location Errors
    LOCATION_OUT_OF_SERVICE_AREA: 'LOCATION_OUT_OF_SERVICE_AREA',
    INVALID_SPECIALIZATION: 'INVALID_SPECIALIZATION',
    // Rate Limiting
    RATE_LIMITED: 'RATE_LIMITED',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
    // Server Errors
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    DATABASE_ERROR: 'DATABASE_ERROR',
};
// ============================================
// User Types & Roles
// ============================================
exports.USER_TYPES = {
    PATIENT: 'PATIENT',
    DOCTOR: 'DOCTOR',
    AMBULANCE_DRIVER: 'AMBULANCE_DRIVER',
    HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
    SYSTEM_ADMIN: 'SYSTEM_ADMIN',
};
exports.USER_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    SUSPENDED: 'SUSPENDED',
    DELETED: 'DELETED',
};
exports.LANGUAGES = {
    HINDI: 'HINDI',
    ENGLISH: 'ENGLISH',
    TAMIL: 'TAMIL',
    TELUGU: 'TELUGU',
    KANNADA: 'KANNADA',
    MARATHI: 'MARATHI',
};
exports.ROLE_PERMISSIONS = {
    PATIENT: ['view_own_profile', 'trigger_sos', 'file_complaint', 'view_emergency_status'],
    DOCTOR: ['view_assigned_patients', 'update_patient_status', 'access_patient_records'],
    AMBULANCE_DRIVER: ['view_assignment', 'update_location', 'update_status'],
    HOSPITAL_ADMIN: ['manage_beds', 'assign_staff', 'manage_patients', 'view_analytics'],
    SYSTEM_ADMIN: ['manage_all_resources', 'manage_users', 'view_all_analytics', 'system_configuration'],
};
// ============================================
// Emergency Constants
// ============================================
exports.EMERGENCY_TYPES = {
    ACCIDENT: 'ACCIDENT',
    MEDICAL: 'MEDICAL',
    OTHER: 'OTHER',
};
exports.EMERGENCY_STATUS = {
    INITIATED: 'INITIATED',
    DISPATCHED: 'DISPATCHED',
    IN_TRANSIT: 'IN_TRANSIT',
    HOSPITAL_NOTIFIED: 'HOSPITAL_NOTIFIED',
    ARRIVED: 'ARRIVED',
    ADMITTED: 'ADMITTED',
    IN_TREATMENT: 'IN_TREATMENT',
    DISCHARGED: 'DISCHARGED',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
};
exports.EMERGENCY_PRIORITY = {
    CRITICAL: 'CRITICAL',
    HIGH: 'HIGH',
    MEDIUM: 'MEDIUM',
    LOW: 'LOW',
};
// Severity Score Thresholds
exports.SEVERITY_THRESHOLDS = {
    CRITICAL: 8.0, // 8.0 - 10.0
    HIGH: 6.0, // 6.0 - 7.9
    MEDIUM: 4.0, // 4.0 - 5.9
    LOW: 1.0, // 1.0 - 3.9
};
// ============================================
// Ambulance Constants
// ============================================
exports.AMBULANCE_STATUS = {
    AVAILABLE: 'AVAILABLE',
    IN_SERVICE: 'IN_SERVICE',
    MAINTENANCE: 'MAINTENANCE',
    OFF_DUTY: 'OFF_DUTY',
};
exports.VEHICLE_TYPES = {
    BLS: 'BLS', // Basic Life Support
    ALS: 'ALS', // Advanced Life Support
    ADVANCED: 'ADVANCED', // Advanced + ICU
};
exports.AMBULANCE_SEARCH_RADIUS = {
    URBAN: 5000, // 5 km in cities
    SEMI_URBAN: 10000, // 10 km
    RURAL: 20000, // 20 km
};
// ============================================
// Hospital Constants
// ============================================
exports.HOSPITAL_TYPES = {
    PRIVATE: 'PRIVATE',
    GOVERNMENT: 'GOVERNMENT',
    NGO: 'NGO',
};
exports.OVERLOAD_STATUS = {
    AVAILABLE: 'AVAILABLE',
    MEDIUM_LOAD: 'MEDIUM_LOAD',
    OVERLOADED: 'OVERLOADED',
};
exports.BED_TYPES = {
    GENERAL: 'GENERAL',
    ICU: 'ICU',
    HIGH_DEPENDENCY: 'HIGH_DEPENDENCY',
};
exports.OCCUPANCY_THRESHOLDS = {
    AVAILABLE: 0.70, // < 70% = Available
    MEDIUM_LOAD: 0.85, // 70-85% = Medium Load
    OVERLOADED: 0.85, // > 85% = Overloaded
};
exports.HOSPITAL_SPECIALIZATIONS = [
    'Emergency',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'General Surgery',
    'Trauma Center',
    'Pediatrics',
    'Gynecology',
    'Psychiatry',
    'Oncology',
    'Infectious Disease',
    'ICU',
];
// ============================================
// Medical Constants
// ============================================
exports.BLOOD_GROUPS = [
    'O+',
    'O-',
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'UNKNOWN',
];
exports.VITAL_RANGES = {
    HEART_RATE: { min: 60, max: 100, critical_low: 40, critical_high: 140 },
    BLOOD_PRESSURE_SYSTOLIC: { min: 90, max: 120, critical_low: 60, critical_high: 180 },
    BLOOD_PRESSURE_DIASTOLIC: { min: 60, max: 80, critical_low: 40, critical_high: 120 },
    TEMPERATURE: { min: 36.1, max: 37.5, critical_low: 35, critical_high: 40 },
    RESPIRATORY_RATE: { min: 12, max: 20, critical_low: 8, critical_high: 30 },
    OXYGEN_SATURATION: { min: 95, max: 100, critical_low: 85, critical_high: 100 },
};
// ============================================
// Triage Constants
// ============================================
exports.SYMPTOM_SEVERITY = {
    MINIMAL: 1,
    MILD: 2,
    MODERATE: 4,
    SEVERE: 7,
    CRITICAL: 9,
};
exports.ONSET_TYPES = ['SUDDEN', 'GRADUAL'];
// ============================================
// Complaint Constants
// ============================================
exports.COMPLAINT_TYPES = {
    AMBULANCE_DELAY: 'AMBULANCE_DELAY',
    HOSPITAL_ISSUE: 'HOSPITAL_ISSUE',
    STAFF_UNAVAILABLE: 'STAFF_UNAVAILABLE',
    MEDICINE_SHORTAGE: 'MEDICINE_SHORTAGE',
    OTHER: 'OTHER',
};
exports.COMPLAINT_STATUS = {
    REGISTERED: 'REGISTERED',
    UNDER_REVIEW: 'UNDER_REVIEW',
    RESOLVED: 'RESOLVED',
    REJECTED: 'REJECTED',
};
exports.COMPLAINT_SEVERITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
};
// ============================================
// Notification Constants
// ============================================
exports.NOTIFICATION_TYPES = {
    EMERGENCY_ALERT: 'EMERGENCY_ALERT',
    AMBULANCE_ARRIVAL: 'AMBULANCE_ARRIVAL',
    HOSPITAL_ADMISSION: 'HOSPITAL_ADMISSION',
    FAMILY_ALERT: 'FAMILY_ALERT',
    COMPLAINT_UPDATE: 'COMPLAINT_UPDATE',
};
exports.NOTIFICATION_CHANNELS = {
    PUSH: 'PUSH',
    SMS: 'SMS',
    EMAIL: 'EMAIL',
    WHATSAPP: 'WHATSAPP',
};
// ============================================
// Time Constants
// ============================================
exports.TIME_CONSTANTS = {
    // JWT
    JWT_EXPIRY: 3600, // 1 hour in seconds
    JWT_REFRESH_EXPIRY: 604800, // 7 days in seconds
    // Cache TTL
    CACHE_TTL_SHORT: 300, // 5 minutes
    CACHE_TTL_MEDIUM: 1800, // 30 minutes
    CACHE_TTL_LONG: 3600, // 1 hour
    CACHE_TTL_DAY: 86400, // 1 day
    // Rate Limiting
    RATE_LIMIT_WINDOW: 900000, // 15 minutes in milliseconds
    RATE_LIMIT_MAX_REQUESTS: 100,
    RATE_LIMIT_MAX_CRITICAL: 10,
    // Timeouts
    API_TIMEOUT: 5000, // 5 seconds
    AI_SERVICE_TIMEOUT: 10000, // 10 seconds
    MAPS_API_TIMEOUT: 5000, // 5 seconds
    // SLA
    AMBULANCE_RESPONSE_SLA: 5, // 5 minutes (minutes)
    DOCTOR_ASSIGNMENT_SLA: 10, // 10 minutes
    HOSPITAL_ADMISSION_SLA: 30, // 30 minutes
};
// ============================================
// Distance & Location Constants
// ============================================
exports.LOCATION_CONSTANTS = {
    EARTH_RADIUS_KM: 6371,
    EARTH_RADIUS_MILES: 3959,
    SERVICE_AREA_RADIUS_KM: 50, // Service area: 50km radius
};
// ============================================
// Database Constants
// ============================================
exports.DATABASE = {
    MONGO_BULK_SIZE: 1000,
    MONGO_TIMEOUT: 5000,
    INDEX_NAMES: {
        EMERGENCY_STATUS: 'emergency_status_created_idx',
        EMERGENCY_LOCATION: 'emergency_location_2dsphere',
        AMBULANCE_LOCATION: 'ambulance_location_2dsphere',
        USER_EMAIL: 'user_email_unique_idx',
    },
};
// ============================================
// Pagination Constants
// ============================================
exports.PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1,
};
// ============================================
// Feature Flags
// ============================================
exports.FEATURES = {
    ACCIDENT_DETECTION: true,
    BLOOD_NETWORK: true,
    OFFLINE_MODE: false,
    VOICE_ASSISTANT: true,
    PHARMACY_SUPPORT: true,
    FAKE_EMERGENCY_DETECTION: true,
    COMPLAINT_ANALYTICS: true,
    HOTSPOT_DETECTION: true,
};
// ============================================
// Regex Patterns
// ============================================
exports.REGEX_PATTERNS = {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    PINCODE: /^[0-9]{6}$/,
    BLOOD_PRESSURE: /^\d{2,3}\/\d{2,3}$/,
    COORDINATES: /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/,
};
// ============================================
// Message Templates
// ============================================
exports.MESSAGES = {
    EMERGENCY_INITIATED: 'Your emergency has been reported. Help is on the way.',
    AMBULANCE_ASSIGNED: 'Ambulance assigned. ETA: {eta} minutes',
    HOSPITAL_NOTIFIED: 'Hospital has been notified. Prepare for admission.',
    AMBULANCE_ARRIVED: 'Ambulance has arrived. Please be ready.',
    HOSPITAL_ADMITTED: 'Patient admitted to {hospitalName}. Doctor: {doctorName}',
};
// ============================================
// Export all constants
// ============================================
exports.APPOINTMENT_STATUS = {
    SCHEDULED: 'SCHEDULED',
    CONFIRMED: 'CONFIRMED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    NO_SHOW: 'NO_SHOW',
};
exports.APPOINTMENT_TYPES = {
    IN_PERSON: 'IN_PERSON',
    VIDEO_CALL: 'VIDEO_CALL',
    PHONE: 'PHONE',
};
exports.APPOINTMENT_DURATION_MINUTES = 30; // Default appointment duration
// Doctor recommendation scoring weights (must sum to 1.0)
exports.RECOMMENDATION_WEIGHTS = {
    RATING: 0.30, // Doctor quality
    PROXIMITY: 0.25, // Distance from patient
    SPEED: 0.20, // Average response time
    AVAILABILITY: 0.15, // Currently available
    FAMILIARITY: 0.10, // Has treated patient before
};
exports.VIDEO_CALL_PROVIDERS = {
    DAILY: 'daily',
    JITSI: 'jitsi',
};
exports.VIDEO_CALL_EXPIRY_HOURS = 2; // Room expires 2h after appointment
exports.QR_CODE_EXPIRY_HOURS = 24;
exports.PATIENT_ANALYTICS_RANGE_MONTHS = 12; // Default: last 12 months
// ============================================
// Export all constants
// ============================================
exports.default = {
    API_VERSION: exports.API_VERSION,
    API_BASE_PATH: exports.API_BASE_PATH,
    HTTP_STATUS: exports.HTTP_STATUS,
    ERROR_CODES: exports.ERROR_CODES,
    USER_TYPES: exports.USER_TYPES,
    EMERGENCY_STATUS: exports.EMERGENCY_STATUS,
    AMBULANCE_STATUS: exports.AMBULANCE_STATUS,
    APPOINTMENT_STATUS: exports.APPOINTMENT_STATUS,
    APPOINTMENT_TYPES: exports.APPOINTMENT_TYPES,
    RECOMMENDATION_WEIGHTS: exports.RECOMMENDATION_WEIGHTS,
    // ... other exports
};
//# sourceMappingURL=index.js.map
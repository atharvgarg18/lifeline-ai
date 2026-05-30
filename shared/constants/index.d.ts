export declare const API_VERSION = "v1";
export declare const API_BASE_PATH = "/api/v1";
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly ACCEPTED: 202;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly RATE_LIMITED: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INVALID_EMAIL: "INVALID_EMAIL";
    readonly INVALID_PHONE_NUMBER: "INVALID_PHONE_NUMBER";
    readonly INVALID_LOCATION: "INVALID_LOCATION";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly INVALID_TOKEN: "INVALID_TOKEN";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS";
    readonly PATIENT_NOT_FOUND: "PATIENT_NOT_FOUND";
    readonly AMBULANCE_NOT_FOUND: "AMBULANCE_NOT_FOUND";
    readonly HOSPITAL_NOT_FOUND: "HOSPITAL_NOT_FOUND";
    readonly DOCTOR_NOT_FOUND: "DOCTOR_NOT_FOUND";
    readonly EMERGENCY_NOT_FOUND: "EMERGENCY_NOT_FOUND";
    readonly USER_NOT_FOUND: "USER_NOT_FOUND";
    readonly AMBULANCE_NOT_AVAILABLE: "AMBULANCE_NOT_AVAILABLE";
    readonly DUPLICATE_EMERGENCY: "DUPLICATE_EMERGENCY";
    readonly BED_NOT_AVAILABLE: "BED_NOT_AVAILABLE";
    readonly DOCTOR_NOT_AVAILABLE: "DOCTOR_NOT_AVAILABLE";
    readonly AMBULANCE_UNAVAILABLE: "AMBULANCE_UNAVAILABLE";
    readonly NO_AVAILABLE_BEDS: "NO_AVAILABLE_BEDS";
    readonly AI_SERVICE_ERROR: "AI_SERVICE_ERROR";
    readonly MAPS_API_ERROR: "MAPS_API_ERROR";
    readonly SMS_SERVICE_ERROR: "SMS_SERVICE_ERROR";
    readonly LOCATION_OUT_OF_SERVICE_AREA: "LOCATION_OUT_OF_SERVICE_AREA";
    readonly INVALID_SPECIALIZATION: "INVALID_SPECIALIZATION";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS";
    readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
    readonly DATABASE_ERROR: "DATABASE_ERROR";
};
export declare const USER_TYPES: {
    readonly PATIENT: "PATIENT";
    readonly DOCTOR: "DOCTOR";
    readonly AMBULANCE_DRIVER: "AMBULANCE_DRIVER";
    readonly HOSPITAL_ADMIN: "HOSPITAL_ADMIN";
    readonly SYSTEM_ADMIN: "SYSTEM_ADMIN";
};
export declare const USER_STATUS: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly SUSPENDED: "SUSPENDED";
    readonly DELETED: "DELETED";
};
export declare const LANGUAGES: {
    readonly HINDI: "HINDI";
    readonly ENGLISH: "ENGLISH";
    readonly TAMIL: "TAMIL";
    readonly TELUGU: "TELUGU";
    readonly KANNADA: "KANNADA";
    readonly MARATHI: "MARATHI";
};
export declare const ROLE_PERMISSIONS: {
    readonly PATIENT: readonly ["view_own_profile", "trigger_sos", "file_complaint", "view_emergency_status"];
    readonly DOCTOR: readonly ["view_assigned_patients", "update_patient_status", "access_patient_records"];
    readonly AMBULANCE_DRIVER: readonly ["view_assignment", "update_location", "update_status"];
    readonly HOSPITAL_ADMIN: readonly ["manage_beds", "assign_staff", "manage_patients", "view_analytics"];
    readonly SYSTEM_ADMIN: readonly ["manage_all_resources", "manage_users", "view_all_analytics", "system_configuration"];
};
export declare const EMERGENCY_TYPES: {
    readonly ACCIDENT: "ACCIDENT";
    readonly MEDICAL: "MEDICAL";
    readonly OTHER: "OTHER";
};
export declare const EMERGENCY_STATUS: {
    readonly INITIATED: "INITIATED";
    readonly DISPATCHED: "DISPATCHED";
    readonly IN_TRANSIT: "IN_TRANSIT";
    readonly HOSPITAL_NOTIFIED: "HOSPITAL_NOTIFIED";
    readonly ARRIVED: "ARRIVED";
    readonly ADMITTED: "ADMITTED";
    readonly IN_TREATMENT: "IN_TREATMENT";
    readonly DISCHARGED: "DISCHARGED";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
};
export declare const EMERGENCY_PRIORITY: {
    readonly CRITICAL: "CRITICAL";
    readonly HIGH: "HIGH";
    readonly MEDIUM: "MEDIUM";
    readonly LOW: "LOW";
};
export declare const SEVERITY_THRESHOLDS: {
    readonly CRITICAL: 8;
    readonly HIGH: 6;
    readonly MEDIUM: 4;
    readonly LOW: 1;
};
export declare const AMBULANCE_STATUS: {
    readonly AVAILABLE: "AVAILABLE";
    readonly IN_SERVICE: "IN_SERVICE";
    readonly MAINTENANCE: "MAINTENANCE";
    readonly OFF_DUTY: "OFF_DUTY";
};
export declare const VEHICLE_TYPES: {
    readonly BLS: "BLS";
    readonly ALS: "ALS";
    readonly ADVANCED: "ADVANCED";
};
export declare const AMBULANCE_SEARCH_RADIUS: {
    readonly URBAN: 5000;
    readonly SEMI_URBAN: 10000;
    readonly RURAL: 20000;
};
export declare const HOSPITAL_TYPES: {
    readonly PRIVATE: "PRIVATE";
    readonly GOVERNMENT: "GOVERNMENT";
    readonly NGO: "NGO";
};
export declare const OVERLOAD_STATUS: {
    readonly AVAILABLE: "AVAILABLE";
    readonly MEDIUM_LOAD: "MEDIUM_LOAD";
    readonly OVERLOADED: "OVERLOADED";
};
export declare const BED_TYPES: {
    readonly GENERAL: "GENERAL";
    readonly ICU: "ICU";
    readonly HIGH_DEPENDENCY: "HIGH_DEPENDENCY";
};
export declare const OCCUPANCY_THRESHOLDS: {
    readonly AVAILABLE: 0.7;
    readonly MEDIUM_LOAD: 0.85;
    readonly OVERLOADED: 0.85;
};
export declare const HOSPITAL_SPECIALIZATIONS: readonly ["Emergency", "Cardiology", "Neurology", "Orthopedics", "General Surgery", "Trauma Center", "Pediatrics", "Gynecology", "Psychiatry", "Oncology", "Infectious Disease", "ICU"];
export declare const BLOOD_GROUPS: readonly ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "UNKNOWN"];
export declare const VITAL_RANGES: {
    readonly HEART_RATE: {
        readonly min: 60;
        readonly max: 100;
        readonly critical_low: 40;
        readonly critical_high: 140;
    };
    readonly BLOOD_PRESSURE_SYSTOLIC: {
        readonly min: 90;
        readonly max: 120;
        readonly critical_low: 60;
        readonly critical_high: 180;
    };
    readonly BLOOD_PRESSURE_DIASTOLIC: {
        readonly min: 60;
        readonly max: 80;
        readonly critical_low: 40;
        readonly critical_high: 120;
    };
    readonly TEMPERATURE: {
        readonly min: 36.1;
        readonly max: 37.5;
        readonly critical_low: 35;
        readonly critical_high: 40;
    };
    readonly RESPIRATORY_RATE: {
        readonly min: 12;
        readonly max: 20;
        readonly critical_low: 8;
        readonly critical_high: 30;
    };
    readonly OXYGEN_SATURATION: {
        readonly min: 95;
        readonly max: 100;
        readonly critical_low: 85;
        readonly critical_high: 100;
    };
};
export declare const SYMPTOM_SEVERITY: {
    readonly MINIMAL: 1;
    readonly MILD: 2;
    readonly MODERATE: 4;
    readonly SEVERE: 7;
    readonly CRITICAL: 9;
};
export declare const ONSET_TYPES: readonly ["SUDDEN", "GRADUAL"];
export declare const COMPLAINT_TYPES: {
    readonly AMBULANCE_DELAY: "AMBULANCE_DELAY";
    readonly HOSPITAL_ISSUE: "HOSPITAL_ISSUE";
    readonly STAFF_UNAVAILABLE: "STAFF_UNAVAILABLE";
    readonly MEDICINE_SHORTAGE: "MEDICINE_SHORTAGE";
    readonly OTHER: "OTHER";
};
export declare const COMPLAINT_STATUS: {
    readonly REGISTERED: "REGISTERED";
    readonly UNDER_REVIEW: "UNDER_REVIEW";
    readonly RESOLVED: "RESOLVED";
    readonly REJECTED: "REJECTED";
};
export declare const COMPLAINT_SEVERITY: {
    readonly LOW: "LOW";
    readonly MEDIUM: "MEDIUM";
    readonly HIGH: "HIGH";
};
export declare const NOTIFICATION_TYPES: {
    readonly EMERGENCY_ALERT: "EMERGENCY_ALERT";
    readonly AMBULANCE_ARRIVAL: "AMBULANCE_ARRIVAL";
    readonly HOSPITAL_ADMISSION: "HOSPITAL_ADMISSION";
    readonly FAMILY_ALERT: "FAMILY_ALERT";
    readonly COMPLAINT_UPDATE: "COMPLAINT_UPDATE";
};
export declare const NOTIFICATION_CHANNELS: {
    readonly PUSH: "PUSH";
    readonly SMS: "SMS";
    readonly EMAIL: "EMAIL";
    readonly WHATSAPP: "WHATSAPP";
};
export declare const TIME_CONSTANTS: {
    readonly JWT_EXPIRY: 3600;
    readonly JWT_REFRESH_EXPIRY: 604800;
    readonly CACHE_TTL_SHORT: 300;
    readonly CACHE_TTL_MEDIUM: 1800;
    readonly CACHE_TTL_LONG: 3600;
    readonly CACHE_TTL_DAY: 86400;
    readonly RATE_LIMIT_WINDOW: 900000;
    readonly RATE_LIMIT_MAX_REQUESTS: 100;
    readonly RATE_LIMIT_MAX_CRITICAL: 10;
    readonly API_TIMEOUT: 5000;
    readonly AI_SERVICE_TIMEOUT: 10000;
    readonly MAPS_API_TIMEOUT: 5000;
    readonly AMBULANCE_RESPONSE_SLA: 5;
    readonly DOCTOR_ASSIGNMENT_SLA: 10;
    readonly HOSPITAL_ADMISSION_SLA: 30;
};
export declare const LOCATION_CONSTANTS: {
    readonly EARTH_RADIUS_KM: 6371;
    readonly EARTH_RADIUS_MILES: 3959;
    readonly SERVICE_AREA_RADIUS_KM: 50;
};
export declare const DATABASE: {
    readonly MONGO_BULK_SIZE: 1000;
    readonly MONGO_TIMEOUT: 5000;
    readonly INDEX_NAMES: {
        readonly EMERGENCY_STATUS: "emergency_status_created_idx";
        readonly EMERGENCY_LOCATION: "emergency_location_2dsphere";
        readonly AMBULANCE_LOCATION: "ambulance_location_2dsphere";
        readonly USER_EMAIL: "user_email_unique_idx";
    };
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 20;
    readonly MAX_LIMIT: 100;
    readonly MIN_LIMIT: 1;
};
export declare const FEATURES: {
    readonly ACCIDENT_DETECTION: true;
    readonly BLOOD_NETWORK: true;
    readonly OFFLINE_MODE: false;
    readonly VOICE_ASSISTANT: true;
    readonly PHARMACY_SUPPORT: true;
    readonly FAKE_EMERGENCY_DETECTION: true;
    readonly COMPLAINT_ANALYTICS: true;
    readonly HOTSPOT_DETECTION: true;
};
export declare const REGEX_PATTERNS: {
    readonly EMAIL: RegExp;
    readonly PHONE: RegExp;
    readonly PINCODE: RegExp;
    readonly BLOOD_PRESSURE: RegExp;
    readonly COORDINATES: RegExp;
};
export declare const MESSAGES: {
    readonly EMERGENCY_INITIATED: "Your emergency has been reported. Help is on the way.";
    readonly AMBULANCE_ASSIGNED: "Ambulance assigned. ETA: {eta} minutes";
    readonly HOSPITAL_NOTIFIED: "Hospital has been notified. Prepare for admission.";
    readonly AMBULANCE_ARRIVED: "Ambulance has arrived. Please be ready.";
    readonly HOSPITAL_ADMITTED: "Patient admitted to {hospitalName}. Doctor: {doctorName}";
};
export declare const APPOINTMENT_STATUS: {
    readonly SCHEDULED: "SCHEDULED";
    readonly CONFIRMED: "CONFIRMED";
    readonly IN_PROGRESS: "IN_PROGRESS";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly NO_SHOW: "NO_SHOW";
};
export declare const APPOINTMENT_TYPES: {
    readonly IN_PERSON: "IN_PERSON";
    readonly VIDEO_CALL: "VIDEO_CALL";
    readonly PHONE: "PHONE";
};
export declare const APPOINTMENT_DURATION_MINUTES = 30;
export declare const RECOMMENDATION_WEIGHTS: {
    readonly RATING: 0.3;
    readonly PROXIMITY: 0.25;
    readonly SPEED: 0.2;
    readonly AVAILABILITY: 0.15;
    readonly FAMILIARITY: 0.1;
};
export declare const VIDEO_CALL_PROVIDERS: {
    readonly DAILY: "daily";
    readonly JITSI: "jitsi";
};
export declare const VIDEO_CALL_EXPIRY_HOURS = 2;
export declare const QR_CODE_EXPIRY_HOURS = 24;
export declare const PATIENT_ANALYTICS_RANGE_MONTHS = 12;
declare const _default: {
    API_VERSION: string;
    API_BASE_PATH: string;
    HTTP_STATUS: {
        readonly OK: 200;
        readonly CREATED: 201;
        readonly ACCEPTED: 202;
        readonly BAD_REQUEST: 400;
        readonly UNAUTHORIZED: 401;
        readonly FORBIDDEN: 403;
        readonly NOT_FOUND: 404;
        readonly CONFLICT: 409;
        readonly UNPROCESSABLE_ENTITY: 422;
        readonly RATE_LIMITED: 429;
        readonly INTERNAL_SERVER_ERROR: 500;
        readonly SERVICE_UNAVAILABLE: 503;
    };
    ERROR_CODES: {
        readonly VALIDATION_ERROR: "VALIDATION_ERROR";
        readonly INVALID_EMAIL: "INVALID_EMAIL";
        readonly INVALID_PHONE_NUMBER: "INVALID_PHONE_NUMBER";
        readonly INVALID_LOCATION: "INVALID_LOCATION";
        readonly UNAUTHORIZED: "UNAUTHORIZED";
        readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
        readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
        readonly INVALID_TOKEN: "INVALID_TOKEN";
        readonly FORBIDDEN: "FORBIDDEN";
        readonly INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS";
        readonly PATIENT_NOT_FOUND: "PATIENT_NOT_FOUND";
        readonly AMBULANCE_NOT_FOUND: "AMBULANCE_NOT_FOUND";
        readonly HOSPITAL_NOT_FOUND: "HOSPITAL_NOT_FOUND";
        readonly DOCTOR_NOT_FOUND: "DOCTOR_NOT_FOUND";
        readonly EMERGENCY_NOT_FOUND: "EMERGENCY_NOT_FOUND";
        readonly USER_NOT_FOUND: "USER_NOT_FOUND";
        readonly AMBULANCE_NOT_AVAILABLE: "AMBULANCE_NOT_AVAILABLE";
        readonly DUPLICATE_EMERGENCY: "DUPLICATE_EMERGENCY";
        readonly BED_NOT_AVAILABLE: "BED_NOT_AVAILABLE";
        readonly DOCTOR_NOT_AVAILABLE: "DOCTOR_NOT_AVAILABLE";
        readonly AMBULANCE_UNAVAILABLE: "AMBULANCE_UNAVAILABLE";
        readonly NO_AVAILABLE_BEDS: "NO_AVAILABLE_BEDS";
        readonly AI_SERVICE_ERROR: "AI_SERVICE_ERROR";
        readonly MAPS_API_ERROR: "MAPS_API_ERROR";
        readonly SMS_SERVICE_ERROR: "SMS_SERVICE_ERROR";
        readonly LOCATION_OUT_OF_SERVICE_AREA: "LOCATION_OUT_OF_SERVICE_AREA";
        readonly INVALID_SPECIALIZATION: "INVALID_SPECIALIZATION";
        readonly RATE_LIMITED: "RATE_LIMITED";
        readonly TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS";
        readonly INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR";
        readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
        readonly DATABASE_ERROR: "DATABASE_ERROR";
    };
    USER_TYPES: {
        readonly PATIENT: "PATIENT";
        readonly DOCTOR: "DOCTOR";
        readonly AMBULANCE_DRIVER: "AMBULANCE_DRIVER";
        readonly HOSPITAL_ADMIN: "HOSPITAL_ADMIN";
        readonly SYSTEM_ADMIN: "SYSTEM_ADMIN";
    };
    EMERGENCY_STATUS: {
        readonly INITIATED: "INITIATED";
        readonly DISPATCHED: "DISPATCHED";
        readonly IN_TRANSIT: "IN_TRANSIT";
        readonly HOSPITAL_NOTIFIED: "HOSPITAL_NOTIFIED";
        readonly ARRIVED: "ARRIVED";
        readonly ADMITTED: "ADMITTED";
        readonly IN_TREATMENT: "IN_TREATMENT";
        readonly DISCHARGED: "DISCHARGED";
        readonly COMPLETED: "COMPLETED";
        readonly CANCELLED: "CANCELLED";
    };
    AMBULANCE_STATUS: {
        readonly AVAILABLE: "AVAILABLE";
        readonly IN_SERVICE: "IN_SERVICE";
        readonly MAINTENANCE: "MAINTENANCE";
        readonly OFF_DUTY: "OFF_DUTY";
    };
    APPOINTMENT_STATUS: {
        readonly SCHEDULED: "SCHEDULED";
        readonly CONFIRMED: "CONFIRMED";
        readonly IN_PROGRESS: "IN_PROGRESS";
        readonly COMPLETED: "COMPLETED";
        readonly CANCELLED: "CANCELLED";
        readonly NO_SHOW: "NO_SHOW";
    };
    APPOINTMENT_TYPES: {
        readonly IN_PERSON: "IN_PERSON";
        readonly VIDEO_CALL: "VIDEO_CALL";
        readonly PHONE: "PHONE";
    };
    RECOMMENDATION_WEIGHTS: {
        readonly RATING: 0.3;
        readonly PROXIMITY: 0.25;
        readonly SPEED: 0.2;
        readonly AVAILABILITY: 0.15;
        readonly FAMILIARITY: 0.1;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map
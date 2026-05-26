# API Specification - LifeLine AI v1.0

## Authentication

All authenticated endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

Token obtained via `/api/v1/auth/login` or `/api/v1/auth/register`

---

## Base URL

```
Development:  http://localhost:3000/api/v1
Staging:      https://staging-api.lifeline.ai/api/v1
Production:   https://api.lifeline.ai/api/v1
```

---

## Standard Response Format

### Success Response (200)
```json
{
  "success": true,
  "data": { /* actual data */ },
  "meta": {
    "timestamp": "2024-05-27T10:30:00Z",
    "version": "1.0"
  }
}
```

### Error Response (400+)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "statusCode": 400,
    "details": { /* optional context */ }
  }
}
```

---

## Core Endpoints

### 1. Authentication Module

#### POST /auth/register
Register new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "phoneNumber": "+919876543210",
  "userType": "PATIENT|DOCTOR|AMBULANCE_DRIVER|HOSPITAL_ADMIN",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-123",
    "email": "user@example.com",
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

---

#### POST /auth/login
Login user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-123",
    "userType": "PATIENT",
    "accessToken": "jwt-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 3600
  }
}
```

---

#### POST /auth/refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "jwt-refresh-token"
}
```

**Response (200):** New access token

---

#### POST /auth/logout
Logout user

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 2. Emergency SOS Module

#### POST /emergency/sos/trigger
**Auth Required**: ✅ (Patient)
Trigger emergency SOS

**Request:**
```json
{
  "patientId": "uuid-123",
  "emergencyType": "ACCIDENT|MEDICAL|OTHER",
  "location": {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "address": "Delhi, India"
  },
  "description": "Car accident, 2 injured",
  "contactMethod": "PHONE|SMS|WHATSAPP"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "emergencyId": "emergency-uuid",
    "status": "INITIATED",
    "priority": "HIGH",
    "severityScore": 8.5,
    "assignedAmbulanceId": "ambulance-123",
    "estimatedArrivalTime": 4, // minutes
    "assignedHospitalId": "hospital-456",
    "createdAt": "2024-05-27T10:30:00Z"
  }
}
```

**Error Cases:**
- `PATIENT_NOT_FOUND` (404): User doesn't have patient profile
- `INVALID_LOCATION` (400): Location data invalid
- `AMBULANCE_UNAVAILABLE` (503): No ambulances available
- `RATE_LIMITED` (429): User triggered SOS too recently

---

#### GET /emergency/:emergencyId
**Auth Required**: ✅ (Patient, Hospital, Ambulance)
Get emergency details

**Response (200):**
```json
{
  "success": true,
  "data": {
    "emergencyId": "emergency-uuid",
    "patientId": "patient-123",
    "status": "IN_TRANSIT|HOSPITAL_NOTIFIED|ARRIVED|COMPLETED",
    "severityScore": 8.5,
    "priority": "CRITICAL|HIGH|MEDIUM|LOW",
    "location": {
      "latitude": 28.7041,
      "longitude": 77.1025,
      "address": "Delhi"
    },
    "ambulance": {
      "id": "ambulance-123",
      "driverId": "driver-456",
      "currentLocation": { "lat": 28.705, "lng": 77.105 },
      "estimatedArrivalTime": 3,
      "status": "EN_ROUTE"
    },
    "hospital": {
      "id": "hospital-789",
      "name": "Max Healthcare Delhi",
      "distance": 5.2, // km
      "bedsAvailable": 12,
      "estimatedReachTime": 7
    },
    "assignedDoctor": {
      "id": "doctor-321",
      "name": "Dr. Rajesh Kumar",
      "specialization": "Emergency Medicine"
    },
    "timeline": [
      {
        "status": "INITIATED",
        "timestamp": "2024-05-27T10:30:00Z"
      }
    ]
  }
}
```

---

#### POST /emergency/:emergencyId/cancel
**Auth Required**: ✅ (Patient)
Cancel emergency

**Response (200):**
```json
{
  "success": true,
  "data": {
    "emergencyId": "emergency-uuid",
    "status": "CANCELLED",
    "cancelledAt": "2024-05-27T10:35:00Z",
    "reason": "False alarm"
  }
}
```

---

#### POST /emergency/:emergencyId/update-status
**Auth Required**: ✅ (Hospital, Ambulance)
Update emergency status

**Request:**
```json
{
  "status": "ARRIVED|ADMITTED|IN_TREATMENT|DISCHARGED|COMPLETED",
  "notes": "Patient admitted to ICU"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "emergencyId": "emergency-uuid",
    "status": "ADMITTED",
    "updatedAt": "2024-05-27T10:40:00Z"
  }
}
```

---

### 3. Patient Profile Module

#### POST /patient/profile
**Auth Required**: ✅ (Patient)
Create/update patient profile

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "bloodGroup": "O+",
  "allergies": ["Penicillin", "Dairy"],
  "chronicDiseases": ["Diabetes", "Hypertension"],
  "medications": [
    {
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "Twice daily"
    }
  ],
  "pastSurgeries": [
    {
      "name": "Appendectomy",
      "date": "2015-03-20",
      "hospital": "Apollo Hospital"
    }
  ],
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "relation": "Spouse",
      "phoneNumber": "+919876543211"
    }
  ]
}
```

**Response (201/200):**
```json
{
  "success": true,
  "data": {
    "patientId": "patient-123",
    "healthIdNumber": "HEALTH_ID_123", // Digital emergency health ID
    "profileCompleted": true,
    "lastUpdated": "2024-05-27T10:30:00Z"
  }
}
```

---

#### GET /patient/profile/:patientId
**Auth Required**: ✅ (Patient, Doctor if emergency)
Get patient health profile

**Response (200):**
Full patient profile (as in POST request)

---

### 4. Ambulance Module

#### GET /ambulance/nearest
**Auth Required**: ✅
Find nearest available ambulances

**Query Params:**
```
?latitude=28.7041&longitude=77.1025&radius=5000 (meters)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ambulances": [
      {
        "id": "ambulance-123",
        "driverId": "driver-456",
        "driverName": "Amit Singh",
        "currentLocation": {
          "latitude": 28.705,
          "longitude": 77.105,
          "address": "Delhi Main Road"
        },
        "distance": 2.3, // km
        "estimatedArrivalTime": 4, // minutes
        "status": "AVAILABLE",
        "equipment": ["Oxygen", "ECG", "Defibrillator"],
        "rating": 4.8,
        "phoneNumber": "+919876543210"
      }
    ],
    "totalFound": 1
  }
}
```

---

#### POST /ambulance/:ambulanceId/assign
**Auth Required**: ✅ (Admin, Emergency System)
Assign ambulance to emergency

**Request:**
```json
{
  "emergencyId": "emergency-uuid",
  "priority": "CRITICAL|HIGH|MEDIUM|LOW"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assignmentId": "assignment-uuid",
    "ambulanceId": "ambulance-123",
    "emergencyId": "emergency-uuid",
    "status": "ASSIGNED",
    "estimatedArrivalTime": 4,
    "assignedAt": "2024-05-27T10:30:00Z"
  }
}
```

**Error Cases:**
- `AMBULANCE_NOT_AVAILABLE` (409): Ambulance already in service
- `AMBULANCE_NOT_FOUND` (404): Invalid ambulance ID

---

#### POST /ambulance/:ambulanceId/location
**Auth Required**: ✅ (Ambulance Driver)
Update ambulance location (called every ~30 seconds)

**Request:**
```json
{
  "latitude": 28.7041,
  "longitude": 77.1025,
  "speed": 45, // km/h
  "heading": 270, // degrees (0-360)
  "accuracy": 5 // meters
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "locationId": "location-uuid",
    "ambulanceId": "ambulance-123",
    "timestamp": "2024-05-27T10:30:05Z"
  }
}
```

---

#### GET /ambulance/:ambulanceId/tracking
**Auth Required**: ✅
Get ambulance real-time tracking info

**Response (200):**
```json
{
  "success": true,
  "data": {
    "ambulanceId": "ambulance-123",
    "currentLocation": { "lat": 28.7041, "lng": 77.1025 },
    "route": {
      "origin": { "lat": 28.705, "lng": 77.105 },
      "destination": { "lat": 28.704, "lng": 77.102 },
      "totalDistance": 5.2, // km
      "remainingDistance": 2.1,
      "estimatedArrivalTime": 3, // minutes
      "waypoints": [/* array of coords */]
    },
    "status": "EN_ROUTE",
    "driverInfo": {
      "name": "Amit Singh",
      "phone": "+919876543210",
      "rating": 4.8
    }
  }
}
```

---

### 5. Hospital Module

#### GET /hospital/nearby
**Auth Required**: ✅
Find nearby hospitals

**Query Params:**
```
?latitude=28.7041&longitude=77.1025&radius=10000 (meters)&specialization=Emergency
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hospitals": [
      {
        "id": "hospital-123",
        "name": "Max Healthcare Delhi",
        "address": "2-B, New Delhi 110024",
        "location": { "latitude": 28.7041, "longitude": 77.1025 },
        "distance": 5.2, // km
        "estimatedReachTime": 7, // minutes
        "rating": 4.7,
        "emergencyDepartment": {
          "available": true,
          "bedsTotal": 20,
          "bedsAvailable": 5,
          "occupancyRate": 75
        },
        "icuBeds": {
          "total": 10,
          "available": 2,
          "occupancyRate": 80
        },
        "specializations": ["Emergency", "Cardiology", "Neurology"],
        "phoneNumber": "+91-11-4141-2525",
        "overloadStatus": "AVAILABLE|MEDIUM_LOAD|OVERLOADED"
      }
    ],
    "totalFound": 3
  }
}
```

---

#### POST /hospital/:hospitalId/admit-patient
**Auth Required**: ✅ (Hospital Admin)
Admit patient from emergency

**Request:**
```json
{
  "emergencyId": "emergency-uuid",
  "patientId": "patient-123",
  "bedType": "GENERAL|ICU|HIGH_DEPENDENCY",
  "assignedDoctor": "doctor-456",
  "admissionNotes": "Critical head injury"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "admissionId": "admission-uuid",
    "bedNumber": "ICU-104",
    "admittedAt": "2024-05-27T10:40:00Z",
    "estimatedStay": 7 // days
  }
}
```

---

#### GET /hospital/:hospitalId/status
**Auth Required**: ✅
Get hospital real-time status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "hospitalId": "hospital-123",
    "name": "Max Healthcare",
    "status": "OPERATIONAL|OVERLOADED|DISASTER",
    "bedsStatus": {
      "general": { "total": 50, "available": 12, "occupied": 38 },
      "icu": { "total": 20, "available": 2, "occupied": 18 },
      "highDependency": { "total": 15, "available": 7, "occupied": 8 }
    },
    "currentPatients": 58,
    "avgWaitTime": 25, // minutes
    "staffAvailable": {
      "doctors": 12,
      "nurses": 25
    },
    "overloadPrediction": {
      "willBeOverloaded": false,
      "predictedAt": "2024-05-27T11:30:00Z"
    },
    "lastUpdated": "2024-05-27T10:30:00Z"
  }
}
```

---

### 6. AI Triage Module

#### POST /ai/triage/analyze
**Auth Required**: ✅
Analyze symptoms and predict emergency severity

**Request:**
```json
{
  "patientId": "patient-123",
  "symptoms": [
    {
      "symptom": "Chest pain",
      "severity": 1, // 1-10
      "duration": 30, // minutes
      "onset": "SUDDEN|GRADUAL"
    },
    {
      "symptom": "Shortness of breath",
      "severity": 7,
      "duration": 15,
      "onset": "SUDDEN"
    }
  ],
  "medicalHistory": {
    "chronicDiseases": ["Hypertension"],
    "medications": ["Lisinopril"]
  },
  "vitals": {
    "heartRate": 120,
    "bloodPressure": "160/100",
    "temperature": 37.2,
    "respiratoryRate": 28
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "triageId": "triage-uuid",
    "severityScore": 9.2, // 1-10
    "priority": "CRITICAL",
    "diagnosticHypothesis": [
      {
        "condition": "Acute Coronary Syndrome",
        "probability": 0.85,
        "recommendedSpecialization": "Cardiology"
      },
      {
        "condition": "Anxiety Attack",
        "probability": 0.10,
        "recommendedSpecialization": "Psychiatry"
      }
    ],
    "recommendedDoctorSpecialization": "Cardiology",
    "recommendedBedType": "ICU",
    "firstAidSuggestions": [
      "Give aspirin (if not allergic)",
      "Position in semi-upright position",
      "Monitor vitals every 5 minutes"
    ],
    "disclaimer": "This is AI-assisted support, not a diagnosis. Consult medical professionals.",
    "generatedAt": "2024-05-27T10:30:00Z"
  }
}
```

---

#### GET /ai/triage/:triageId
**Auth Required**: ✅
Get triage analysis results

**Response (200):** Same as POST response

---

### 7. Doctor Assignment Module

#### POST /doctor/assignment
**Auth Required**: ✅ (Hospital Admin)
Assign doctor to emergency/patient

**Request:**
```json
{
  "emergencyId": "emergency-uuid",
  "doctorId": "doctor-123",
  "patientId": "patient-456",
  "specialization": "Cardiology"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "assignmentId": "assignment-uuid",
    "doctorId": "doctor-123",
    "doctorName": "Dr. Rajesh Kumar",
    "patientId": "patient-456",
    "status": "ASSIGNED",
    "assignedAt": "2024-05-27T10:30:00Z",
    "estimatedConsultationTime": 15 // minutes
  }
}
```

---

#### GET /doctor/:doctorId/assignments
**Auth Required**: ✅ (Doctor)
Get doctor's current assignments

**Response (200):**
```json
{
  "success": true,
  "data": {
    "doctorId": "doctor-123",
    "name": "Dr. Rajesh Kumar",
    "specialization": "Cardiology",
    "assignments": [
      {
        "assignmentId": "assignment-uuid",
        "patientId": "patient-456",
        "emergencyId": "emergency-uuid",
        "patientName": "John Doe",
        "status": "ACTIVE|COMPLETED",
        "assignedAt": "2024-05-27T10:30:00Z",
        "triageData": { /* AI triage results */ }
      }
    ],
    "totalActive": 3,
    "totalCompleted": 12
  }
}
```

---

### 8. Complaint Module

#### POST /complaint/create
**Auth Required**: ✅
File a complaint

**Request:**
```json
{
  "complaintType": "AMBULANCE_DELAY|HOSPITAL_ISSUE|STAFF_UNAVAILABLE|MEDICINE_SHORTAGE|OTHER",
  "emergencyId": "emergency-uuid",
  "description": "Ambulance took 20 minutes to arrive",
  "relatedEntity": {
    "type": "AMBULANCE|HOSPITAL|STAFF",
    "id": "ambulance-123"
  },
  "attachments": ["image_url_1", "image_url_2"],
  "severity": "LOW|MEDIUM|HIGH"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "complaintId": "complaint-uuid",
    "status": "REGISTERED",
    "ticketNumber": "TICKET-2024-00123",
    "createdAt": "2024-05-27T10:30:00Z",
    "resolvedBy": "2024-05-27T18:00:00Z" // Estimated
  }
}
```

---

#### GET /complaint/:complaintId
**Auth Required**: ✅
Get complaint status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "complaintId": "complaint-uuid",
    "ticketNumber": "TICKET-2024-00123",
    "status": "REGISTERED|UNDER_REVIEW|RESOLVED|REJECTED",
    "description": "Ambulance took 20 minutes",
    "createdAt": "2024-05-27T10:30:00Z",
    "resolvedAt": "2024-05-27T15:45:00Z",
    "resolution": "Disciplinary action initiated",
    "aiCategory": "SERVICE_DELAY",
    "severity": "HIGH"
  }
}
```

---

### 9. Analytics/Dashboard Module

#### GET /admin/dashboard/overview
**Auth Required**: ✅ (Admin only)
Get dashboard overview

**Response (200):**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-05-27T10:30:00Z",
    "emergencies": {
      "active": 12,
      "completed": 245,
      "avgResponseTime": 5.2, // minutes
      "avgTransitTime": 8.5
    },
    "ambulances": {
      "total": 45,
      "available": 23,
      "inService": 22,
      "utilization": 49
    },
    "hospitals": {
      "avgOccupancy": 68,
      "overloaded": 2,
      "availableBeds": 89
    },
    "complaints": {
      "totalOpen": 8,
      "avgResolutionTime": 2.3, // hours
      "topIssues": ["Ambulance Delay", "Staff Unavailable"]
    },
    "geography": {
      "accidentHotspots": [
        { "location": "Delhi-Gurgaon Highway", "count": 18 }
      ],
      "responseSlowest": [
        { "area": "Outer Delhi", "avgTime": 9.2 }
      ]
    }
  }
}
```

---

#### GET /admin/analytics/complaints
**Auth Required**: ✅ (Admin)
Get complaint analytics

**Query Params:**
```
?startDate=2024-05-01&endDate=2024-05-27&category=AMBULANCE_DELAY&hospitalId=hospital-123
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalComplaints": 245,
    "byCategory": {
      "AMBULANCE_DELAY": 89,
      "HOSPITAL_ISSUE": 67,
      "STAFF_UNAVAILABLE": 45,
      "OTHER": 44
    },
    "byHospital": [
      {
        "hospitalId": "hospital-123",
        "name": "Max Healthcare",
        "totalComplaints": 56,
        "resolutionRate": 87,
        "avgResolutionTime": 2.1
      }
    ],
    "trends": {
      "dailyComplaints": [
        { "date": "2024-05-27", "count": 8 }
      ]
    }
  }
}
```

---

#### GET /admin/analytics/response-times
**Auth Required**: ✅ (Admin)
Get response time analytics

**Response (200):**
```json
{
  "success": true,
  "data": {
    "averageResponseTime": 5.2, // minutes
    "percentiles": {
      "p50": 4.1,
      "p75": 6.5,
      "p90": 8.2,
      "p99": 12.1
    },
    "byArea": [
      {
        "area": "Delhi Central",
        "avgResponseTime": 4.5
      }
    ],
    "byHospital": [
      {
        "hospitalId": "hospital-123",
        "name": "Max Healthcare",
        "avgResponseTime": 6.1
      }
    ]
  }
}
```

---

### 10. Notification Module

#### POST /notification/send
**Auth Required**: ✅ (System)
Send notifications to users

**Request:**
```json
{
  "recipients": ["user-123", "user-456"],
  "type": "EMERGENCY_ALERT|AMBULANCE_ARRIVAL|HOSPITAL_ADMISSION|FAMILY_ALERT|COMPLAINT_UPDATE",
  "title": "Ambulance Arriving",
  "body": "Your ambulance is 3 minutes away",
  "data": {
    "emergencyId": "emergency-uuid",
    "ambulanceId": "ambulance-123"
  },
  "channels": ["PUSH|SMS|EMAIL|WHATSAPP"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "notificationId": "notification-uuid",
    "sentTo": 2,
    "failed": 0,
    "sentAt": "2024-05-27T10:30:00Z"
  }
}
```

---

### 11. Route Optimization Module

#### POST /route/optimize
**Auth Required**: ✅
Get optimized route for ambulance

**Request:**
```json
{
  "origin": {
    "latitude": 28.7041,
    "longitude": 77.1025
  },
  "destination": {
    "latitude": 28.5355,
    "longitude": 77.3910
  },
  "preferences": {
    "avoidTollRoads": false,
    "trafficAware": true,
    "emergency": true // Optimizes for speed, not cost
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "route": {
      "distance": 26.5, // km
      "duration": 22, // minutes (with traffic)
      "durationNoTraffic": 18, // minutes
      "coordinates": [/* array of waypoints */],
      "instructions": [
        {
          "instruction": "Turn right on Delhi Main Road",
          "distance": 1.2
        }
      ]
    },
    "trafficInfo": {
      "hasTraffic": true,
      "severity": "MODERATE",
      "affectedSegments": [
        {
          "segment": "Delhi Main Road",
          "delay": 4 // minutes
        }
      ]
    },
    "greenCorridor": {
      "available": true,
      "estTimeWithCorridor": 18, // minutes (optimized)
      "estimatedDelay": 0
    }
  }
}
```

---

### 12. Multilingual Support

#### POST /translate
**Auth Required**: ✅
Translate text to patient's language

**Request:**
```json
{
  "text": "The ambulance is arriving in 5 minutes",
  "targetLanguage": "HINDI|ENGLISH|TAMIL|TELUGU|KANNADA|MARATHI|etc"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "originalText": "The ambulance is arriving in 5 minutes",
    "translatedText": "एम्बुलेंस 5 मिनट में आ रहा है",
    "targetLanguage": "HINDI",
    "confidence": 0.98
  }
}
```

---

## WebSocket Events

### Connection
```javascript
// Client connects to namespace
socket = io(`/emergency/${emergencyId}`, {
  auth: { token: 'jwt-token' }
});

socket.on('connect', () => {
  console.log('Connected to emergency room');
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
```

### Emergency Events

```javascript
// Emergency status update
socket.on('emergency:status_updated', (data) => {
  {
    emergencyId: 'emergency-uuid',
    status: 'IN_TRANSIT',
    updatedAt: '2024-05-27T10:30:00Z'
  }
});

// Ambulance assigned
socket.on('emergency:ambulance_assigned', (data) => {
  {
    ambulanceId: 'ambulance-123',
    driverName: 'Amit Singh',
    estimatedArrivalTime: 4
  }
});

// Hospital assigned
socket.on('emergency:hospital_assigned', (data) => {
  {
    hospitalId: 'hospital-123',
    hospitalName: 'Max Healthcare',
    estimatedReachTime: 7
  }
});

// Ambulance location update (every 10 seconds)
socket.on('ambulance:location_updated', (data) => {
  {
    ambulanceId: 'ambulance-123',
    location: { latitude: 28.7041, longitude: 77.1025 },
    speed: 45,
    estimatedArrivalTime: 3
  }
});

// Doctor assigned
socket.on('emergency:doctor_assigned', (data) => {
  {
    doctorId: 'doctor-456',
    doctorName: 'Dr. Rajesh Kumar',
    specialization: 'Cardiology'
  }
});

// Completion
socket.on('emergency:completed', (data) => {
  {
    emergencyId: 'emergency-uuid',
    completedAt: '2024-05-27T11:00:00Z',
    totalTime: 30 // minutes
  }
});
```

---

## Rate Limiting

```
Default: 100 requests/minute per user
Critical endpoints: 10 requests/minute
- POST /emergency/sos/trigger
- POST /ambulance/location

Backoff: Exponential (2^n seconds)
```

---

## Pagination

```
GET /list?page=1&limit=20&sort=-createdAt

Response includes:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "pages": 13
  }
}
```

---

## Error Codes

Common error codes:

```
VALIDATION_ERROR (400)
UNAUTHORIZED (401)
FORBIDDEN (403)
NOT_FOUND (404)
CONFLICT (409)
RATE_LIMITED (429)
INTERNAL_SERVER_ERROR (500)
SERVICE_UNAVAILABLE (503)

Custom codes:
AMBULANCE_NOT_FOUND
HOSPITAL_NOT_FOUND
PATIENT_NOT_FOUND
INVALID_LOCATION
AMBULANCE_UNAVAILABLE
NO_AVAILABLE_BEDS
AI_SERVICE_ERROR
INVALID_SPECIALIZATION
LOCATION_OUT_OF_SERVICE_AREA
```

---

## Documentation Standards

- All endpoints tested with Postman collection
- OpenAPI/Swagger specification available
- Rate limiting documented per endpoint
- Authentication requirements clear
- Example responses with real-world data
- Error cases with handling suggestions

---

**Last Updated**: May 27, 2026
**Version**: 1.0.0

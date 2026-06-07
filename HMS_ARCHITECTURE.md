# Hospital Management System (HMS) - Architecture Document

**Project**: LifeLine AI - Hospital Management System  
**Version**: 1.0.0  
**Date**: June 4, 2026  
**Status**: Development Phase

---

## 🎯 Overview

Comprehensive Hospital Management System integrated with LifeLine AI emergency platform for end-to-end hospital operations management.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Patient Mobile App                        │
│  (QR Code Generation + Emergency SOS)                       │
└─────────────┬───────────────────────────┬───────────────────┘
              │                           │
              │ QR Code Scan              │ Emergency SOS
              │                           │
              ↓                           ↓
┌─────────────────────────────┐  ┌──────────────────────────┐
│      HMS Web Application    │  │  Emergency Dispatch      │
│   (Hospital Admin Portal)   │  │  (Batch Notification)    │
└─────────────┬───────────────┘  └──────────┬───────────────┘
              │                              │
              └──────────┬───────────────────┘
                         ↓
              ┌──────────────────────┐
              │   Shared Backend     │
              │  (Express + MongoDB) │
              │  + Real-time Socket  │
              └──────────┬───────────┘
                         │
              ┌──────────┴───────────┐
              │                      │
              ↓                      ↓
       ┌────────────┐         ┌────────────┐
       │  MongoDB   │         │   Redis    │
       │  Database  │         │   Cache    │
       └────────────┘         └────────────┘
```

---

## 📱 Key Features

### 1. QR Code System
- **Unique patient identifier** per QR code
- **Encrypted QR data**: patientId + timestamp + signature
- **One-click admission**: Scan → View full profile → Admit → Allocate bed
- **Real-time validation**: Check QR authenticity against backend
- **No duplicate codes**: Each patient has unique, time-bound QR

### 2. Emergency SOS Integration
- **Batch notification system**: Top 5 hospitals at a time
- **Score-based ranking**: Distance + Bed availability + Specialization match
- **First-accept wins**: First hospital to accept gets the patient
- **Cascade to next batch**: If none accept in 2 minutes → next 5 hospitals
- **Real-time ambulance routing**: Updates route when hospital accepts
- **Auto-resource allocation**: Bed, doctor, nurse assigned on acceptance

### 3. Complete HMS Modules

#### Patient Management
- Registration (OPD, IPD, Emergency)
- Medical records & history
- Discharge summary
- Patient tracking

#### Bed Management
- Real-time bed availability (General, ICU, NICU, Emergency)
- Instant bed allocation
- Bed transfer
- Occupancy dashboard

#### Doctor/Staff Management
- Doctor profiles (specialization, availability)
- Duty roster
- Workload tracking

#### Pharmacy
- Medicine inventory
- Prescription management
- Stock alerts

#### Laboratory
- Test booking
- Report generation
- Sample tracking

#### Blood Bank
- Blood inventory by type
- Donation tracking
- Request management
- Expiry alerts

#### Billing
- Service charges
- Medicine charges
- Room charges
- Invoice generation
- Payment modes

#### OT Management
- Surgery scheduling
- Pre-op/post-op tracking

---

## 🔐 Security & Authentication

### QR Code Security
```
QR Code Format:
{
  "patientId": "uuid",
  "timestamp": "ISO8601",
  "signature": "HMAC-SHA256(patientId + timestamp + secret)"
}

Validation:
1. Decode QR
2. Check timestamp (valid for 24 hours)
3. Verify signature
4. Fetch patient data from backend
```

### Hospital Authentication
- JWT-based authentication
- Role: HOSPITAL_ADMIN (Phase 1)
- Future roles: DOCTOR, NURSE, RECEPTIONIST, etc.

---

## 📊 Database Schema Extensions

### New Collections

#### 1. Hospital
```javascript
{
  _id: ObjectId,
  hospitalId: String (unique),
  name: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  contact: {
    phone: String,
    email: String,
    emergencyPhone: String
  },
  facilities: {
    totalBeds: Number,
    icuBeds: Number,
    nicuBeds: Number,
    emergencyBeds: Number,
    hasBloodBank: Boolean,
    hasOT: Boolean,
    hasLab: Boolean,
    hasPharmacy: Boolean
  },
  specializations: [String], // ["Cardiology", "Neurology", ...]
  settings: {
    enabledModules: [String], // Customizable modules
    offlineMode: Boolean,
    autoAcceptEmergency: Boolean
  },
  rating: Number,
  status: String, // ACTIVE, INACTIVE
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Bed
```javascript
{
  _id: ObjectId,
  bedId: String (unique),
  hospitalId: String,
  bedNumber: String,
  ward: String,
  bedType: String, // GENERAL, ICU, NICU, EMERGENCY
  status: String, // AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
  currentPatient: {
    patientId: String,
    admissionId: String,
    admittedAt: Date
  },
  floor: Number,
  features: [String], // ["Ventilator", "Oxygen", "Monitor"]
  pricePerDay: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. Admission
```javascript
{
  _id: ObjectId,
  admissionId: String (unique),
  patientId: String,
  hospitalId: String,
  bedId: String,
  admissionType: String, // OPD, IPD, EMERGENCY
  admittedAt: Date,
  dischargedAt: Date,
  status: String, // ADMITTED, DISCHARGED, TRANSFERRED
  admittedBy: String, // Hospital admin userId
  assignedDoctor: String,
  assignedNurse: String,
  diagnosis: String,
  symptoms: [String],
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    oxygenLevel: Number,
    recordedAt: Date
  },
  prescriptions: [PrescriptionSchema],
  labTests: [LabTestSchema],
  billing: {
    totalAmount: Number,
    paidAmount: Number,
    pendingAmount: Number,
    paymentMode: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. EmergencyRequest
```javascript
{
  _id: ObjectId,
  requestId: String (unique),
  emergencyId: String, // Link to emergency SOS
  patientId: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  symptoms: [String],
  severity: Number,
  requiredBedType: String, // ICU, GENERAL, etc.
  requiredSpecialization: String,
  
  // Batch notification system
  notificationBatches: [
    {
      batchNumber: Number,
      hospitals: [
        {
          hospitalId: String,
          score: Number, // Ranking score
          distance: Number,
          notifiedAt: Date,
          respondedAt: Date,
          response: String // ACCEPTED, REJECTED, NO_RESPONSE
        }
      ],
      sentAt: Date,
      timeout: Date // 2 minutes from sentAt
    }
  ],
  
  acceptedBy: {
    hospitalId: String,
    acceptedAt: Date,
    allocatedBed: String,
    allocatedDoctor: String,
    allocatedNurse: String
  },
  
  status: String, // PENDING, ACCEPTED, REJECTED, TIMEOUT
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. QRCode
```javascript
{
  _id: ObjectId,
  qrCodeId: String (unique),
  patientId: String,
  qrData: String, // Encrypted QR string
  signature: String, // HMAC signature
  generatedAt: Date,
  expiresAt: Date, // 24 hours from generation
  scannedBy: [
    {
      hospitalId: String,
      scannedAt: Date,
      admitted: Boolean
    }
  ],
  status: String, // ACTIVE, EXPIRED, USED
  createdAt: Date
}
```

---

## 🔄 Real-Time Communication

### WebSocket Events

#### Hospital → Server
```javascript
// Accept emergency request
socket.emit('emergency:accept', {
  requestId: String,
  hospitalId: String,
  allocatedBed: String
});

// Reject emergency request
socket.emit('emergency:reject', {
  requestId: String,
  hospitalId: String,
  reason: String
});

// Update bed availability
socket.emit('bed:update', {
  hospitalId: String,
  bedId: String,
  status: String
});
```

#### Server → Hospital
```javascript
// New emergency request (batch)
socket.on('emergency:new', {
  requestId: String,
  patient: {...},
  severity: Number,
  symptoms: [...],
  requiredBedType: String,
  distance: Number,
  eta: Number,
  batchNumber: Number,
  timeout: Date
});

// Emergency accepted by another hospital
socket.on('emergency:accepted_by_other', {
  requestId: String,
  hospitalId: String
});

// Batch timeout, new batch incoming
socket.on('emergency:next_batch', {
  requestId: String,
  batchNumber: Number
});
```

#### Server → Patient App
```javascript
// Hospital accepted emergency
socket.on('emergency:accepted', {
  hospital: {...},
  eta: Number,
  ambulance: {...},
  allocatedBed: {...}
});

// Update ambulance route
socket.on('ambulance:route_update', {
  newDestination: {...},
  newEta: Number
});
```

---

## 🚀 API Endpoints

### HMS Application Endpoints

#### QR Code Scanning
```
POST /api/v1/hms/qr/scan
Headers: Authorization: Bearer {hospitalToken}
Body: {
  qrData: String,
  hospitalId: String
}

Response:
{
  success: true,
  patient: {
    patientId: String,
    name: String,
    age: Number,
    gender: String,
    bloodGroup: String,
    allergies: [String],
    chronicDiseases: [String],
    emergencyContacts: [...],
    medicalHistory: [...]
  },
  qrValid: true,
  canAdmit: true
}
```

#### One-Click Admission
```
POST /api/v1/hms/admission/quick-admit
Headers: Authorization: Bearer {hospitalToken}
Body: {
  patientId: String,
  hospitalId: String,
  admissionType: String, // "EMERGENCY", "OPD", "IPD"
  bedType: String, // "GENERAL", "ICU", "NICU"
  symptoms: [String],
  vitals: {...}
}

Response:
{
  success: true,
  admission: {
    admissionId: String,
    patientId: String,
    allocatedBed: {...},
    assignedDoctor: {...},
    status: "ADMITTED"
  }
}
```

#### Emergency Request Management
```
GET /api/v1/hms/emergency/pending
Headers: Authorization: Bearer {hospitalToken}
Query: ?hospitalId=xxx

Response:
{
  success: true,
  requests: [
    {
      requestId: String,
      patient: {...},
      severity: Number,
      distance: Number,
      eta: Number,
      batchNumber: Number,
      timeoutAt: Date
    }
  ]
}

POST /api/v1/hms/emergency/accept
Body: {
  requestId: String,
  hospitalId: String,
  bedId: String
}

POST /api/v1/hms/emergency/reject
Body: {
  requestId: String,
  hospitalId: String,
  reason: String
}
```

#### Bed Management
```
GET /api/v1/hms/beds
Query: ?hospitalId=xxx&status=AVAILABLE&bedType=ICU

POST /api/v1/hms/beds/allocate
Body: {
  bedId: String,
  patientId: String,
  admissionId: String
}

POST /api/v1/hms/beds/release
Body: {
  bedId: String,
  admissionId: String
}
```

---

## 🎨 HMS Frontend Structure

```
hms/                              # Separate HMS application
├── app/
│   ├── layout.tsx                # HMS root layout
│   ├── page.tsx                  # HMS dashboard
│   ├── login/
│   │   └── page.tsx              # Hospital login
│   │
│   ├── (dashboard)/              # Authenticated routes
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── overview/             # Hospital overview
│   │   │   └── page.tsx
│   │   │
│   │   ├── emergency/            # Emergency requests
│   │   │   ├── page.tsx          # Pending requests
│   │   │   └── [requestId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── qr-scanner/           # QR code scanner
│   │   │   └── page.tsx
│   │   │
│   │   ├── admissions/           # Patient admissions
│   │   │   ├── page.tsx
│   │   │   └── [admissionId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── beds/                 # Bed management
│   │   │   ├── page.tsx
│   │   │   └── allocation/
│   │   │       └── page.tsx
│   │   │
│   │   ├── patients/             # Patient records
│   │   │   ├── page.tsx
│   │   │   └── [patientId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── pharmacy/             # Pharmacy module
│   │   ├── laboratory/           # Lab module
│   │   ├── blood-bank/           # Blood bank
│   │   ├── billing/              # Billing
│   │   └── settings/             # Hospital settings
│   │       └── page.tsx
│   │
│   └── offline/                  # Offline mode pages
│       └── page.tsx
│
├── components/
│   ├── hms/
│   │   ├── QRScanner.tsx         # QR code scanner component
│   │   ├── EmergencyRequestCard.tsx
│   │   ├── PatientQuickView.tsx
│   │   ├── BedGrid.tsx           # Visual bed layout
│   │   ├── QuickAdmitModal.tsx
│   │   ├── BedAllocationModal.tsx
│   │   └── [other components]
│   │
│   └── common/
│       └── [shared components]
│
├── hooks/
│   ├── useQRScanner.ts
│   ├── useEmergencyRequests.ts
│   ├── useBeds.ts
│   ├── useAdmission.ts
│   └── useHMSWebSocket.ts        # HMS-specific socket
│
├── services/
│   ├── hmsApi.ts                 # HMS API client
│   ├── qrService.ts
│   ├── emergencyService.ts
│   ├── bedService.ts
│   └── admissionService.ts
│
└── package.json
```

---

## 🔧 Technical Implementation

### Batch Notification Algorithm

```javascript
// Pseudo-code for emergency dispatch
async function dispatchEmergency(emergencyRequest) {
  const { patientLocation, symptoms, requiredBedType } = emergencyRequest;
  
  // 1. Score all hospitals
  const hospitals = await Hospital.find({ status: 'ACTIVE' });
  const scoredHospitals = hospitals.map(hospital => ({
    ...hospital,
    score: calculateScore(hospital, patientLocation, requiredBedType)
  }));
  
  // 2. Sort by score (highest first)
  scoredHospitals.sort((a, b) => b.score - a.score);
  
  // 3. Send in batches of 5
  const BATCH_SIZE = 5;
  const BATCH_TIMEOUT = 120000; // 2 minutes
  
  for (let i = 0; i < scoredHospitals.length; i += BATCH_SIZE) {
    const batch = scoredHospitals.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    
    // Send notification to batch
    batch.forEach(hospital => {
      io.to(hospital.hospitalId).emit('emergency:new', {
        requestId: emergencyRequest.requestId,
        patient: emergencyRequest.patient,
        batchNumber,
        timeout: new Date(Date.now() + BATCH_TIMEOUT)
      });
    });
    
    // Wait for acceptance or timeout
    const accepted = await waitForAcceptance(emergencyRequest.requestId, BATCH_TIMEOUT);
    
    if (accepted) {
      // Allocate resources and notify
      await allocateResources(emergencyRequest, accepted.hospitalId);
      break;
    }
    
    // Continue to next batch if no acceptance
  }
}

function calculateScore(hospital, patientLocation, requiredBedType) {
  let score = 100;
  
  // Distance (closer = higher score)
  const distance = calculateDistance(hospital.location, patientLocation);
  score -= distance * 0.5; // Penalty for distance
  
  // Bed availability
  const bedAvailable = checkBedAvailability(hospital, requiredBedType);
  if (!bedAvailable) return 0; // Disqualify if no bed
  
  score += 20; // Bonus for having bed
  
  // Specialization match
  if (hospital.specializations.includes(requiredSpecialization)) {
    score += 30;
  }
  
  // Hospital rating
  score += hospital.rating * 5;
  
  return score;
}
```

---

## 📦 Phase-wise Implementation

### Phase 1 (Current) ✅
- QR code scanning system
- Emergency SOS batch notification
- Patient quick admission
- Bed management
- Real-time updates

### Phase 2 (Next)
- Doctor/Staff management
- Pharmacy module
- Laboratory module
- Blood bank module

### Phase 3 (Final)
- Billing system
- OT management
- Complete integration
- Analytics & reporting

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Existing Express.js backend (shared)
- **Database**: MongoDB (shared with main app)
- **Real-time**: Socket.io
- **QR Code**: qrcode library (generation), html5-qrcode (scanning)
- **Offline**: Service Workers + IndexedDB
- **Deployment**: Docker (separate container for HMS)

---

**Status**: Ready for Development - Phase 1  
**Next Steps**: Implement backend models and API endpoints

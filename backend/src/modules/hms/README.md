# Hospital Management System (HMS) Module

## Overview
Complete Hospital Management System integrated with LifeLine AI emergency platform.

## Features

### Phase 1 (Current) ✅
- **QR Code Scanning**: Scan patient QR codes for instant admission
- **Emergency SOS Integration**: Batch notification system for emergency dispatch
- **Bed Management**: Real-time bed tracking and allocation
- **Patient Admission**: One-click admission with automatic resource allocation
- **Real-time Updates**: WebSocket integration for live updates

### Phase 2 (Upcoming)
- Doctor/Staff Management
- Pharmacy Module
- Laboratory Module
- Blood Bank Module

### Phase 3 (Future)
- Billing System
- OT Management
- Complete Integration
- Analytics & Reporting

## API Endpoints

### QR Code Management
```
POST /api/v1/hms/qr/scan
- Scan and validate patient QR code
- Returns patient information for quick admission

Body: {
  "qrData": "base64_encoded_qr_data",
  "hospitalId": "HOSP-001"
}
```

### Admissions
```
POST /api/v1/hms/admission/quick-admit
- One-click patient admission
- Automatically allocates bed

POST /api/v1/hms/admissions/:admissionId/vitals
- Update patient vitals

POST /api/v1/hms/admissions/:admissionId/discharge
- Discharge patient

GET /api/v1/hms/admissions
- Get all admissions for hospital

GET /api/v1/hms/admissions/:admissionId
- Get specific admission details
```

### Emergency Management
```
GET /api/v1/hms/emergency/pending
- Get pending emergency requests for hospital
- Only shows requests in current batch

POST /api/v1/hms/emergency/accept
- Accept emergency request
- Automatically allocates resources

POST /api/v1/hms/emergency/reject
- Reject emergency request with reason
```

### Bed Management
```
GET /api/v1/hms/beds
- Get all beds for hospital
- Filter by status, type, ward, floor

GET /api/v1/hms/beds/availability
- Get bed availability summary

POST /api/v1/hms/beds/allocate
- Allocate bed to patient

POST /api/v1/hms/beds/release
- Release bed (after discharge)
```

## Models

### Hospital
- Hospital information and facilities
- Location and contact details
- Settings and customizable modules

### Bed
- Bed information (number, type, ward, floor)
- Status tracking (AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED)
- Patient assignment

### Admission
- Complete admission record
- Patient medical details
- Vitals tracking
- Prescriptions and lab tests
- Billing information
- Discharge summary

### EmergencyRequest
- Emergency dispatch tracking
- Batch notification system
- Hospital responses
- Acceptance tracking

### QRCode
- QR code generation and validation
- Signature verification
- Scan history
- Expiry management

## Services

### QRService
- Generate patient QR codes
- Validate QR codes with signature
- Record scans
- Manage QR expiry

### BedService
- Get hospital beds
- Bed availability tracking
- Allocate/release beds
- Bed maintenance scheduling

### AdmissionService
- Quick admit patients
- Update vitals
- Add prescriptions
- Order lab tests
- Discharge patients
- Billing management

### EmergencyDispatchService
- Score and rank hospitals
- Batch notification system
- Handle accept/reject
- Real-time updates

## WebSocket Events

### Server → Hospital
```javascript
// New emergency request
socket.on('emergency:new', {
  requestId: String,
  patient: {...},
  severity: Number,
  symptoms: [...],
  batchNumber: Number,
  timeout: Date
});

// Emergency accepted by another hospital
socket.on('emergency:accepted_by_other', {
  requestId: String,
  hospitalId: String
});
```

### Hospital → Server
```javascript
// Accept emergency
socket.emit('emergency:accept', {
  requestId: String,
  hospitalId: String,
  bedId: String
});

// Reject emergency
socket.emit('emergency:reject', {
  requestId: String,
  hospitalId: String,
  reason: String
});
```

## Usage Examples

### 1. Scan QR and Quick Admit
```javascript
// Step 1: Scan QR code
const scanResult = await fetch('/api/v1/hms/qr/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    qrData: scannedQRData,
    hospitalId: 'HOSP-001'
  })
});

const { patient, qrCodeId } = await scanResult.json();

// Step 2: Quick admit
const admission = await fetch('/api/v1/hms/admission/quick-admit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    patientId: patient.patientId,
    hospitalId: 'HOSP-001',
    admissionType: 'EMERGENCY',
    bedType: 'ICU',
    symptoms: ['Chest pain', 'Shortness of breath'],
    vitals: {
      bloodPressure: '160/100',
      heartRate: 120,
      temperature: 37.2,
      oxygenLevel: 92,
      respiratoryRate: 28
    },
    qrCodeId
  })
});
```

### 2. Handle Emergency Request
```javascript
// Get pending emergencies
const emergencies = await fetch(
  '/api/v1/hms/emergency/pending?hospitalId=HOSP-001'
);

// Accept emergency
const acceptance = await fetch('/api/v1/hms/emergency/accept', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    requestId: 'EMR-xxx',
    hospitalId: 'HOSP-001',
    bedId: 'BED-ICU-001'
  })
});
```

### 3. Bed Management
```javascript
// Get available ICU beds
const beds = await fetch(
  '/api/v1/hms/beds?hospitalId=HOSP-001&status=AVAILABLE&bedType=ICU'
);

// Get bed availability summary
const availability = await fetch(
  '/api/v1/hms/beds/availability?hospitalId=HOSP-001'
);
```

## Security

### QR Code Security
- HMAC-SHA256 signature verification
- Time-bound validity (24 hours)
- Scan history tracking
- One-time use for admissions

### Authentication
- JWT-based authentication
- Role-based access control (HOSPITAL_ADMIN for Phase 1)
- Hospital-specific data isolation

## Testing

```bash
# Run HMS module tests
npm test -- --testPathPattern=hms

# Test QR service
npm test -- qrService.test.ts

# Test emergency dispatch
npm test -- emergencyDispatchService.test.ts
```

## Database Indexes

Optimized queries with indexes:
- Geospatial index on hospital locations
- Bed availability by hospital and type
- Emergency requests by status and creation time
- QR codes by patient and status
- Admissions by hospital and date

## Next Steps

1. ✅ Phase 1: Complete (QR + Emergency + Beds + Admissions)
2. Phase 2: Doctor/Staff, Pharmacy, Lab, Blood Bank
3. Phase 3: Billing, OT, Complete Integration

## Related Documentation
- [HMS Architecture](../../../../HMS_ARCHITECTURE.md)
- [API Specification](../../../../docs/API_SPECIFICATION.md)
- [Main README](../../../../README.md)

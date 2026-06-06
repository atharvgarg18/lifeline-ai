# HMS Integration Guide

**Quick guide to integrate HMS with the existing LifeLine AI backend**

---

## Step 1: Register HMS Routes

Edit `backend/src/index.ts`:

```typescript
import hmsRoutes from './modules/hms/routes/hmsRoutes';

// ... existing imports

// Register HMS routes
app.use('/api/v1/hms', hmsRoutes);
```

---

## Step 2: Update Patient App QR Generation

In `backend/src/modules/patient-profile/patientProfileController.ts`:

```typescript
import { QRService } from '../hms/services/qrService';

// Add new endpoint to generate patient QR
export const generatePatientQR = async (req, res) => {
  const { patientId } = req.params;
  
  const qrCode = await QRService.generateQRCode(patientId);
  
  res.json({
    success: true,
    qrCode: {
      qrCodeId: qrCode.qrCodeId,
      qrData: qrCode.qrData,
      expiresAt: qrCode.expiresAt
    }
  });
};
```

Add route:
```typescript
router.get('/patients/:patientId/qr', generatePatientQR);
```

---

## Step 3: Update Emergency SOS to Trigger HMS Dispatch

In `backend/src/modules/emergency-sos/emergencySosService.ts`:

```typescript
import { EmergencyDispatchService } from '../hms/services/emergencyDispatchService';

// After creating emergency SOS
const requestId = await EmergencyDispatchService.dispatchEmergency({
  emergencyId: emergency.emergencyId,
  patientId: emergency.patientId,
  location: emergency.location,
  symptoms: emergency.description.split(','),
  severity: emergency.severity || 8,
  requiredBedType: determineRequiredBedType(emergency),
  requiredSpecialization: determineRequiredSpecialization(emergency)
});

// Store requestId in emergency record
emergency.hmsRequestId = requestId;
await emergency.save();
```

---

## Step 4: WebSocket Integration

Edit `backend/src/index.ts` to add Socket.io:

```typescript
import { Server as SocketServer } from 'socket.io';
import http from 'http';

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Make io globally accessible
(global as any).io = io;

// HMS Socket handlers
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Hospital joins room
  socket.on('hospital:join', (hospitalId) => {
    socket.join(`hospital:${hospitalId}`);
    console.log(`Hospital ${hospitalId} joined`);
  });

  // Patient/Emergency joins room
  socket.on('emergency:join', (emergencyId) => {
    socket.join(`emergency:${emergencyId}`);
    console.log(`Emergency ${emergencyId} joined`);
  });

  // Handle emergency acceptance from hospital
  socket.on('emergency:accept', async (data) => {
    const { requestId, hospitalId, bedId } = data;
    
    try {
      const result = await EmergencyDispatchService.acceptEmergency(
        requestId,
        hospitalId,
        bedId
      );
      
      socket.emit('emergency:accept:success', result);
    } catch (error) {
      socket.emit('emergency:accept:error', { message: error.message });
    }
  });

  // Handle emergency rejection
  socket.on('emergency:reject', async (data) => {
    const { requestId, hospitalId, reason } = data;
    
    try {
      await EmergencyDispatchService.rejectEmergency(
        requestId,
        hospitalId,
        reason
      );
      
      socket.emit('emergency:reject:success');
    } catch (error) {
      socket.emit('emergency:reject:error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Step 5: Environment Variables

Add to `backend/.env.local`:

```bash
# HMS Configuration
QR_SECRET_KEY=your-secret-key-for-qr-signature-generation
HMS_BATCH_SIZE=5
HMS_BATCH_TIMEOUT=120000  # 2 minutes in milliseconds

# WebSocket
SOCKET_CORS_ORIGIN=http://localhost:3001,http://localhost:3002
```

---

## Step 6: Create Hospital Seed Data

Create `backend/src/database/seeds/hospitals.ts`:

```typescript
import { Hospital } from '../../modules/hms/models/Hospital.model';
import { Bed } from '../../modules/hms/models/Bed.model';
import { BedService } from '../../modules/hms/services/bedService';

export async function seedHospitals() {
  // Clear existing
  await Hospital.deleteMany({});
  await Bed.deleteMany({});

  // Create sample hospitals
  const hospitals = [
    {
      hospitalId: 'HOSP-001',
      name: 'Apollo Hospital',
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139] // Delhi
      },
      address: {
        street: 'Sarita Vihar',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110076',
        country: 'India'
      },
      contact: {
        phone: '+91-11-26925858',
        email: 'contact@apollo.com',
        emergencyPhone: '+91-11-26925858'
      },
      facilities: {
        totalBeds: 200,
        icuBeds: 40,
        nicuBeds: 20,
        emergencyBeds: 30,
        generalBeds: 110,
        hasBloodBank: true,
        hasOT: true,
        hasLab: true,
        hasPharmacy: true,
        hasAmbulance: true
      },
      specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine'],
      rating: 4.5,
      status: 'ACTIVE'
    },
    {
      hospitalId: 'HOSP-002',
      name: 'Max Hospital',
      location: {
        type: 'Point',
        coordinates: [77.1904, 28.5355] // Saket
      },
      address: {
        street: 'Saket',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110017',
        country: 'India'
      },
      contact: {
        phone: '+91-11-26515050',
        email: 'contact@maxhospital.com',
        emergencyPhone: '+91-11-26515050'
      },
      facilities: {
        totalBeds: 150,
        icuBeds: 30,
        nicuBeds: 15,
        emergencyBeds: 25,
        generalBeds: 80,
        hasBloodBank: true,
        hasOT: true,
        hasLab: true,
        hasPharmacy: true,
        hasAmbulance: true
      },
      specializations: ['Cardiology', 'Oncology', 'Neurosurgery'],
      rating: 4.3,
      status: 'ACTIVE'
    }
  ];

  for (const hospitalData of hospitals) {
    // You need to get a real admin user ID
    const hospital = await Hospital.create({
      ...hospitalData,
      adminUser: 'some-admin-user-id' // Replace with real user
    });

    // Create beds for hospital
    await BedService.bulkCreateBeds(hospital.hospitalId, [
      { ward: 'ICU', bedType: 'ICU', floor: 2, room: '201', count: 10, pricePerDay: 5000, features: ['Ventilator', 'Monitor'] },
      { ward: 'Emergency', bedType: 'EMERGENCY', floor: 1, room: '101', count: 10, pricePerDay: 3000, features: ['Oxygen'] },
      { ward: 'General', bedType: 'GENERAL', floor: 3, room: '301', count: 20, pricePerDay: 1500, features: [] }
    ]);
  }

  console.log('✅ Hospitals and beds seeded successfully');
}
```

Run seed:
```bash
cd backend
npm run db:seed
```

---

## Step 7: Test the Integration

### Test 1: Generate Patient QR
```bash
curl -X GET http://localhost:3000/api/v1/patient-profile/patients/PAT-001/qr \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test 2: Scan QR Code in HMS
```bash
curl -X POST http://localhost:3000/api/v1/hms/qr/scan \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "BASE64_QR_DATA_HERE",
    "hospitalId": "HOSP-001"
  }'
```

### Test 3: Quick Admit Patient
```bash
curl -X POST http://localhost:3000/api/v1/hms/admission/quick-admit \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PAT-001",
    "hospitalId": "HOSP-001",
    "admissionType": "EMERGENCY",
    "bedType": "ICU",
    "symptoms": ["Chest pain", "Shortness of breath"],
    "vitals": {
      "bloodPressure": "160/100",
      "heartRate": 120,
      "temperature": 37.2,
      "oxygenLevel": 92,
      "respiratoryRate": 28
    }
  }'
```

### Test 4: Get Bed Availability
```bash
curl -X GET "http://localhost:3000/api/v1/hms/beds/availability?hospitalId=HOSP-001"
```

---

## Step 8: Frontend HMS App Structure

Create `hms/` directory at root:

```
hms/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # HMS Dashboard
│   ├── login/
│   │   └── page.tsx
│   ├── qr-scanner/
│   │   └── page.tsx          # QR Scanner Page
│   ├── emergency/
│   │   └── page.tsx          # Emergency Requests
│   ├── admissions/
│   │   └── page.tsx          # Admissions List
│   └── beds/
│       └── page.tsx          # Bed Management
├── components/
│   ├── QRScanner.tsx
│   ├── EmergencyRequestCard.tsx
│   ├── BedGrid.tsx
│   ├── QuickAdmitModal.tsx
│   └── PatientInfo.tsx
├── hooks/
│   ├── useQRScanner.ts
│   ├── useEmergency.ts
│   └── useWebSocket.ts
├── services/
│   └── hmsApi.ts
├── package.json
└── next.config.js
```

---

## Step 9: HMS Frontend Package.json

Create `hms/package.json`:

```json
{
  "name": "lifeline-hms",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.8.3",
    "html5-qrcode": "^2.3.8",
    "axios": "^1.6.0",
    "date-fns": "^2.30.0"
  }
}
```

---

## Step 10: Test WebSocket Events

Create test client:

```javascript
// test-socket.js
const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected to server');
  
  // Join as hospital
  socket.emit('hospital:join', 'HOSP-001');
  
  // Listen for emergency requests
  socket.on('emergency:new', (data) => {
    console.log('🚨 New emergency:', data);
  });
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});
```

Run:
```bash
node test-socket.js
```

---

## Checklist

- [ ] HMS routes registered in main app
- [ ] Patient QR generation endpoint added
- [ ] Emergency SOS triggers HMS dispatch
- [ ] WebSocket server configured
- [ ] Socket.io events implemented
- [ ] Environment variables added
- [ ] Hospital seed data created
- [ ] Beds seeded for hospitals
- [ ] API endpoints tested
- [ ] HMS frontend app scaffolded
- [ ] Frontend dependencies installed
- [ ] WebSocket client tested

---

## Quick Start Commands

```bash
# 1. Backend
cd backend
npm install socket.io
npm run db:seed  # Seed hospitals and beds
npm run dev      # Start backend on port 3000

# 2. Main Frontend (Patient App)
cd ../
npm run dev      # Start on port 3001

# 3. HMS Frontend
cd hms
npm install
npm run dev      # Start on port 3002
```

---

## URLs After Setup

- **Backend API**: http://localhost:3000
- **Patient App**: http://localhost:3001
- **HMS App**: http://localhost:3002
- **API Docs**: http://localhost:3000/api/v1/hms (all endpoints)

---

**Status**: Ready for Integration ✅  
**Next**: Build HMS Frontend Components

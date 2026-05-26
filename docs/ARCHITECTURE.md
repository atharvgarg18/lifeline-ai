# System Architecture - LifeLine AI

## Table of Contents
1. [System Overview](#system-overview)
2. [Architectural Patterns](#architectural-patterns)
3. [Module Design](#module-design)
4. [Data Flow](#data-flow)
5. [Security Architecture](#security-architecture)
6. [Scalability & Performance](#scalability--performance)
7. [Error Handling Strategy](#error-handling-strategy)
8. [Real-time Communication](#real-time-communication)

---

## System Overview

### Microservices Architecture

LifeLine AI uses a **modular monolith pattern** at the start, with clear module boundaries to transition to microservices if needed.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend Layer                              │
│  (Next.js 14 + React 18 + Tailwind CSS + Mapbox)              │
├─────────────────────────────────────────────────────────────────┤
│                     API Gateway Layer                           │
│           (Express Middleware + CORS + Rate Limiting)          │
├──────────────┬───────────────┬───────────────┬──────────────────┤
│  Module 1:   │   Module 2:   │   Module 3:   │   Module N:      │
│  Emergency   │   Ambulance   │   Hospital    │   (Complaint,    │
│  SOS         │   Dispatch    │   Finder      │    Analytics)    │
├──────────────┴───────────────┴───────────────┴──────────────────┤
│                     Service Layer                               │
│  (Business logic, validations, external API calls)             │
├──────────────┬───────────────┬───────────────┬──────────────────┤
│   Database   │     Cache     │   AI Service  │   External APIs  │
│   (MongoDB)  │   (Redis)     │   (Python)    │  (Maps, SMS)    │
└──────────────┴───────────────┴───────────────┴──────────────────┘
```

---

## Architectural Patterns

### 1. Module-Based Organization

Each feature is organized as a **module** with clear boundaries:

```
backend/src/modules/emergency-sos/
├── controllers/
│   └── emergencySosController.ts
├── services/
│   └── emergencySosService.ts
├── models/
│   └── EmergencySOS.ts
├── routes/
│   └── emergencySosRoutes.ts
├── schemas/
│   └── emergencySosSchema.ts
├── utils/
│   └── emergencySosUtils.ts
├── tests/
│   ├── unit/
│   └── integration/
└── README.md  (Module documentation)
```

**Benefits:**
- Teams can work independently
- Easily testable
- Clear dependencies
- Can be extracted to microservice later

### 2. Service Layer Pattern

```
Controller → Service → Repository → Database
   (Input)   (Logic)   (Data)     (Persist)
```

**Example:**

```typescript
// Controller: Handle HTTP request
async triggerSOS(req, res) {
  const result = await this.sosService.triggerEmergency(req.body);
  res.json(result);
}

// Service: Business logic
async triggerEmergency(data) {
  1. Validate patient data
  2. Determine severity (call AI)
  3. Find nearest ambulance
  4. Create emergency record
  5. Send notifications
}

// Repository: Database operations
async createEmergency(data) {
  return EmergencySOS.create(data);
}
```

### 3. Event-Driven Architecture

For real-time features, use **pub-sub pattern**:

```
Event Published          Event Consumed
         ↓                      ↓
SOS Triggered → Event Bus → Ambulance Assignment
                          → Hospital Notification
                          → Family Alert
                          → Dashboard Update
```

### 4. Dependency Injection

Use **dependency injection** for loose coupling:

```typescript
class EmergencySosService {
  constructor(
    private sosRepository: EmergencySosRepository,
    private aiService: AIService,
    private notificationService: NotificationService,
    private ambulanceService: AmbulanceService
  ) {}
  
  async triggerEmergency(data) {
    // Use injected dependencies
    const severity = await this.aiService.predictSeverity(data);
    const ambulance = await this.ambulanceService.findNearest(data.location);
    // ...
  }
}
```

---

## Module Design

### Critical Modules & Dependencies

```
Emergency SOS (Core)
├── Dependencies: Location Service, AI Triage, Notifications
└── Triggers: Ambulance Dispatch, Hospital Notification, Family Alert

Ambulance Network
├── Dependencies: Location Service, Route Optimizer, Hospital Finder
└── Triggers: Live Tracking, Hospital Assignment, ETA Updates

Route Optimizer
├── Dependencies: Maps API, Traffic API, AI Service
└── Triggers: Green Corridor, Signal Control

Hospital Recommendation
├── Dependencies: Hospital Database, Availability Service
└── Triggers: Doctor Assignment, Bed Allocation

Patient Health Profile
├── Dependencies: None (foundational)
└── Used by: Emergency SOS, AI Triage, Doctor Assignment

AI Triage
├── Dependencies: Patient Profile, Symptom History
└── Triggers: Doctor Specialization, Nurse Assignment

Notifications System
├── Dependencies: None (utility)
└── Used by: All modules needing to notify users

Dashboard/Analytics
├── Dependencies: All other modules (read-only)
└── Displays: Real-time data, historical analytics
```

---

## Data Flow

### Critical Flow 1: Emergency SOS Activation

```
1. User triggers SOS
   ↓
2. Capture: Location, Patient ID, Emergency Type
   ↓
3. Validate patient exists & location
   ↓
4. Create EmergencySOS record (status: INITIATED)
   ↓
5. Parallel (async):
   ├→ AI Triage: Analyze symptoms/medical history
   ├→ Location Service: Get precise coordinates
   ├→ Hospital Finder: Get nearest hospitals
   ├→ Ambulance Dispatch: Find nearest ambulances
   └→ Notification Service: Alert family
   ↓
6. Determine best hospital & ambulance
   ↓
7. Update EmergencySOS (status: DISPATCHED)
   ↓
8. Publish real-time updates (WebSocket)
   ↓
9. Monitor: Ambulance arrival, Hospital readiness
   ↓
10. Complete when patient reaches hospital
```

### Critical Flow 2: Real-Time Ambulance Tracking

```
Ambulance GPS → Backend API → Redis Cache → WebSocket
                                              ↓
                                    Frontend Updates Map
                                    (Every 10 seconds)
```

**No polling**! Use WebSocket for efficiency.

### Critical Flow 3: Hospital Overload Detection

```
Daily (every 6 hours):
  1. Aggregate current patients in each hospital
  2. Calculate bed occupancy rate
  3. Check available ICU beds
  4. AI predicts overcrowding (next 2 hours)
  5. If >80% capacity: Mark as OVERLOADED
  6. Reroute new emergencies to other hospitals
  7. Alert hospital admin
```

---

## Security Architecture

### Authentication Flow

```
User Login
    ↓
JWT Token Generated (access + refresh)
    ↓
Store in HttpOnly Cookie (Frontend)
    ↓
Send on every request (auto via cookie)
    ↓
Backend validates JWT
    ↓
Extract user role (PATIENT, DOCTOR, AMBULANCE_DRIVER, ADMIN)
    ↓
Check endpoint authorization
    ↓
200 OK / 401 Unauthorized
```

### Role-Based Access Control (RBAC)

```
PATIENT
  ├─ /api/sos/trigger (own)
  ├─ /api/profile (own)
  ├─ /api/emergency/track (own active)
  └─ /api/complaints/create

DOCTOR
  ├─ /api/patients (assigned)
  ├─ /api/triage/results (assigned)
  └─ /api/patient/update-status

AMBULANCE_DRIVER
  ├─ /api/assignments (current)
  └─ /api/location/update

HOSPITAL_ADMIN
  ├─ /api/hospital/status (own)
  ├─ /api/beds/availability
  └─ /api/staff/assign

SYSTEM_ADMIN
  ├─ /api/admin/* (all)
  └─ /api/analytics/* (all)
```

### Data Security

| Data Type | Storage | Encryption | Access |
|-----------|---------|-----------|---------|
| Medical Records | MongoDB | At rest (TDE) | RBAC + audit log |
| Patient Location | Redis | In transit (HTTPS) | Active emergencies only |
| Phone Numbers | MongoDB | Hashed + salted | SMS service only |
| Emergency Contacts | MongoDB | Encrypted field | Patient + family |
| Payment Info | Stripe | PCI-DSS compliant | Never stored locally |

---

## Scalability & Performance

### Database Indexing Strategy

```javascript
// Indexes for critical queries

// Emergency SOS queries
db.emergencysos.createIndex({ status: 1, createdAt: -1 })
db.emergencysos.createIndex({ patientId: 1, createdAt: -1 })
db.emergencysos.createIndex({ location: "2dsphere" }) // Geo-spatial

// Ambulance tracking
db.ambulances.createIndex({ location: "2dsphere" })
db.ambulances.createIndex({ status: 1 })

// Hospital bed availability
db.hospitals.createIndex({ bedAvailability: 1, location: "2dsphere" })

// Complaints analytics
db.complaints.createIndex({ status: 1, hospitalId: 1, createdAt: -1 })
```

### Caching Strategy (Redis)

```
Key Format: module:entity:id:property

Examples:
- ambulance:location:{ambulanceId} → {lat, lng} (TTL: 1 min)
- emergency:status:{emergencyId} → {status} (TTL: 5 min)
- hospital:beds:{hospitalId} → {available, occupied} (TTL: 2 min)
- user:session:{userId} → {token, permissions} (TTL: 24h)
- route:cached:{from}:{to} → {routes} (TTL: 6h)
```

### Async Processing (Job Queue)

```
High-latency operations go into queue:

- Email/SMS notifications → Queue → Worker processes
- Complaint categorization (AI) → Queue → AI service
- Analytics aggregation → Queue → Background job (daily)
- Report generation → Queue → Worker email results

Uses: BullMQ (Redis-based job queue)
```

### Load Balancing

```
                    User Requests
                          ↓
                    ┌─────────────┐
                    │ Load Balancer│
                    │  (Nginx)     │
                    └──────┬──────┘
                           │
                ┌──────────┼──────────┐
                ↓          ↓          ↓
            Backend-1  Backend-2  Backend-N
            (Replica)  (Replica)  (Replica)
                │          │          │
                └──────────┼──────────┘
                           ↓
                    ┌──────────────┐
                    │  MongoDB +   │
                    │   Redis      │
                    │ (Shared)     │
                    └──────────────┘
```

---

## Error Handling Strategy

### Standardized Error Response

```typescript
// All errors return this format
{
  success: false,
  error: {
    code: "AMBULANCE_NOT_FOUND", // Unique code
    message: "No ambulance available in 5km radius",
    statusCode: 404,
    details: {
      location: [28.7041, 77.1025],
      radius: 5000, // meters
      timestamp: "2024-05-27T10:30:00Z"
    }
  }
}
```

### Error Categories & Handling

```
1. Validation Errors (400)
   - Invalid input format
   - Missing required fields
   - Business rule violations
   Recovery: Return error to client for retry

2. Authentication Errors (401)
   - Invalid token
   - Expired session
   Recovery: Redirect to login

3. Authorization Errors (403)
   - User doesn't have permission
   Recovery: Return permission denied error

4. Not Found Errors (404)
   - Resource doesn't exist
   Recovery: Return not found error

5. Conflict Errors (409)
   - Ambulance already assigned
   - Duplicate emergency
   Recovery: Return conflict & suggestion

6. Rate Limit Errors (429)
   - Too many requests
   Recovery: Implement exponential backoff

7. Server Errors (500+)
   - Database connection lost
   - External API failure
   - Unexpected exception
   Recovery:
     ├─ Log with stack trace
     ├─ Alert on-call engineer (Sentry)
     ├─ Return generic error to client
     └─ Implement fallback if available

8. Critical Errors (Emergency SOS fails)
   - If main flow fails: Use fallback SMS dispatch
   - Escalate immediately to admin
```

### Retry Strategy

```
Operation                 Max Retries   Backoff
─────────────────────────────────────────────
Maps API calls           3             exponential
SMS notifications        5             exponential
Database queries         2             immediate
External API calls       3             exponential
Ambulance assignment     1             none (critical)
Hospital queries         2             immediate
```

---

## Real-time Communication

### WebSocket Architecture

```
┌─────────────────────────────────────┐
│      Socket.io Namespaces          │
├─────────────────────────────────────┤
│ /emergency/:emergencyId             │ (Patient, Ambulance, Hospital, Family)
│ /ambulance/:ambulanceId             │ (Ambulance location updates)
│ /hospital/:hospitalId               │ (Hospital admin dashboard)
│ /admin/dashboard                    │ (System admin - all events)
└─────────────────────────────────────┘
```

### Event Types

```
Emergency Events:
- emergency:created
- emergency:severity_updated
- emergency:ambulance_assigned
- emergency:hospital_assigned
- emergency:doctor_assigned
- emergency:status_updated
- emergency:completed
- emergency:cancelled

Location Events:
- ambulance:location_updated (every 10 sec)
- ambulance:eta_updated (every 30 sec)

Hospital Events:
- hospital:bed_updated
- hospital:overload_alert
- hospital:admission_complete

Notification Events:
- notification:family_alert
- notification:doctor_alert
- notification:admin_alert
```

### Broadcasting Strategy

```
Specific Emergency Update:
  Server → io.to(`emergency:${emergencyId}`).emit('status_updated', data)
  Reaches: Patient, Ambulance Driver, Hospital Staff, Family

Ambulance Location Update:
  Driver's phone → REST API POST /location/update
  → Server updates DB + Redis cache
  → Emit to specific emergency room
  → Client map updates (smooth animation)

Dashboard Statistics:
  Every 5 minutes: Aggregate data from cache
  → Emit to /admin/dashboard namespace
  → All connected admins receive update
```

---

## API Versioning

```
Current: /api/v1/
Future:  /api/v2/

Strategy:
- Backward compatible changes: No version bump
- Breaking changes: New major version
- Deprecate old version 6 months before removal
- Header support: Accept: application/vnd.lifeline.v1+json
```

---

## Deployment Architecture

### Development Environment

```
docker-compose (local):
  ├─ Backend (Node.js)
  ├─ Frontend (Next.js)
  ├─ MongoDB (local)
  ├─ Redis (local)
  └─ AI Services (Python)
```

### Staging Environment

```
AWS/GCP Cloud:
  ├─ Backend (Kubernetes/AppEngine)
  ├─ Frontend (Vercel/Cloud Storage)
  ├─ MongoDB Atlas (managed)
  ├─ Redis (Memorystore)
  ├─ AI Services (Cloud Run)
  └─ CI/CD: GitHub Actions
```

### Production Environment

```
AWS/GCP Cloud (Multi-region):
  ├─ Load Balancer (Global)
  ├─ Backend (K8s cluster, auto-scaling)
  ├─ Frontend (CDN + edge caching)
  ├─ MongoDB (Replica set, multi-region)
  ├─ Redis (Cluster mode)
  ├─ AI Services (Auto-scaling containers)
  └─ Backup: Automated daily
```

---

## Monitoring & Observability

### Key Metrics

```
Backend:
  - Request latency (p50, p95, p99)
  - Error rate by endpoint
  - Database query time
  - Cache hit ratio
  - Queue depth (jobs pending)

Real-time:
  - Active WebSocket connections
  - Message latency
  - Broadcasting efficiency

AI Services:
  - Model inference time
  - Triage accuracy
  - Translation latency

Business:
  - Average emergency response time
  - Hospital utilization rate
  - Fake emergency detection rate
  - Complaint volume & categories
```

### Alerting Thresholds

```
🔴 Critical (Immediate page):
  - Emergency SOS endpoint down
  - Ambulance dispatch failing
  - >10% error rate in critical endpoints
  - Database connection lost
  - Redis cache down

🟠 Warning (24h fix):
  - p99 latency > 2s
  - Cache hit ratio < 70%
  - Queue depth > 1000
  - AI service latency > 3s

🟡 Info (Log only):
  - Unusual traffic patterns
  - Disk usage > 80%
  - Memory usage > 85%
```

---

## Next Steps

1. **Week 1**: Database schema finalization
2. **Week 2-3**: Core module development (SOS, Ambulance, Hospital)
3. **Week 4**: AI service integration
4. **Week 5**: Testing & integration
5. **Week 6**: Performance optimization
6. **Week 7**: Security audit & deployment

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for data modeling details.
See [API_SPECIFICATION.md](API_SPECIFICATION.md) for API contracts.

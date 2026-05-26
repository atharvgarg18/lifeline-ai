# Emergency SOS Module

Emergency SOS module for triggering and managing emergency incidents in the LifeLine platform.

## Structure

```
emergency-sos/
├── index.ts                      # Module exports
├── emergencySosController.ts    # HTTP request handlers
├── emergencySosService.ts       # Business logic
├── emergencySosRepository.ts    # Database operations
├── emergencySosRoutes.ts        # API routes
├── emergencySosSchemas.ts       # Request validation
├── emergencySosService.test.ts  # Unit tests
└── README.md                     # This file
```

## Design Pattern

### Architecture: Controller → Service → Repository

```
Request → Controller → Service → Repository → Database
         (Routing)   (Logic)  (Persistence)
```

### Responsibilities

**Controller** (`emergencySosController.ts`)
- Handles HTTP requests/responses
- Validates authentication
- Calls service methods
- Formats responses

**Service** (`emergencySosService.ts`)
- Implements business logic
- Coordinates multiple repositories
- Calls external services (Ambulance dispatch, Notifications)
- Handles transactions

**Repository** (`emergencySosRepository.ts`)
- Database CRUD operations
- Query building
- Data persistence
- Implements database-specific logic

**Routes** (`emergencySosRoutes.ts`)
- Defines REST endpoints
- Associates endpoints with controllers
- Adds middleware (auth, validation)

**Schemas** (`emergencySosSchemas.ts`)
- Validates request payloads
- Defines allowed fields
- Ensures data type safety

## API Endpoints

### Trigger Emergency SOS
```
POST /api/v1/emergency/sos/trigger
Content-Type: application/json

{
  "emergencyType": "MEDICAL",
  "location": "Market Street, Delhi",
  "latitude": 28.7041,
  "longitude": 77.1025,
  "description": "Severe chest pain",
  "severityScore": 8.5,
  "symptoms": ["chest pain", "shortness of breath"],
  "contactName": "John Doe",
  "contactPhone": "+91-9876543210"
}

Response: 201 Created
{
  "success": true,
  "data": {
    "id": "emergency-id",
    "patientId": "patient-id",
    "emergencyType": "MEDICAL",
    "status": "INITIATED",
    "severityScore": 8.5,
    ...
  }
}
```

### Get Emergency Details
```
GET /api/v1/emergency/:emergencyId

Response: 200 OK
{
  "success": true,
  "data": { ... emergency details ... }
}
```

### Update Emergency Status
```
POST /api/v1/emergency/:emergencyId/status
Content-Type: application/json

{
  "status": "DISPATCHED",
  "notes": "Ambulance dispatched"
}

Response: 200 OK
{
  "success": true,
  "data": { ... updated emergency ... }
}
```

### Cancel Emergency
```
POST /api/v1/emergency/:emergencyId/cancel

Response: 200 OK
{
  "success": true,
  "data": { "success": true }
}
```

### Get Emergency Timeline
```
GET /api/v1/emergency/:emergencyId/timeline

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "status": "INITIATED",
      "timestamp": "2024-05-27T10:00:00Z",
      "description": "Emergency triggered"
    },
    ...
  ]
}
```

## Key Features

### 1. Duplicate Check
- Prevents multiple emergencies within 5 minutes for same user
- Checks status to allow cancelled emergencies

### 2. Timeline Tracking
- Automatically records status changes
- Timestamps all transitions
- Maintains audit trail

### 3. Service Coordination
- Triggers ambulance dispatch asynchronously
- Sends notifications to nearby resources
- Handles external service failures gracefully

### 4. Validation
- Ensures location coordinates are valid
- Validates severity score (1-10)
- Checks emergency type is valid

## Testing

Run tests:
```bash
npm test -- emergencySosService.test.ts
```

Run with coverage:
```bash
npm test -- emergencySosService.test.ts --coverage
```

Test structure:
- Unit tests for service logic
- Mock external services (ambulance dispatch, notifications)
- Test error scenarios
- Test timeline generation

## Integration Points

### External Services Called
- **Location Service**: Validates and processes coordinates
- **Ambulance Dispatch Service**: Finds and assigns nearest ambulance
- **Notification Service**: Alerts nearby resources

### Other Modules Used
- Patient Profile: User validation
- Hospital Finder: Hospital assignment logic
- AI Triage: Severity score analysis

## Status Values

```
INITIATED          → User triggered SOS
DISPATCHED         → Ambulance dispatched
IN_TRANSIT         → Ambulance on the way
HOSPITAL_NOTIFIED  → Hospital prepared
ARRIVED            → Ambulance arrived at scene
ADMITTED           → Patient admitted to hospital
IN_TREATMENT       → Patient under treatment
DISCHARGED         → Patient discharged
COMPLETED          → Emergency resolved
CANCELLED          → Emergency cancelled
```

## Error Handling

Common errors:
- `PATIENT_NOT_FOUND` (404): User not found
- `DUPLICATE_EMERGENCY` (409): Recent emergency already active
- `EMERGENCY_NOT_FOUND` (404): Emergency not found
- `UNAUTHORIZED` (401): Authentication required

## Database Schema

See [DATABASE_SCHEMA.md](../../docs/DATABASE_SCHEMA.md#emergencySOS) for EmergencySOS collection schema.

## Dependencies

- `express`: Web framework
- `joi`: Validation
- `mongoose`: Database (in real implementation)

## Logging

All operations are logged:
```
[INFO] Emergency SOS triggered for patient: patient-id
[INFO] Ambulance dispatched: ambulance-id
[WARN] Failed to send notifications: error message
[ERROR] Failed to create emergency: error message
```

## Performance Considerations

- Location queries use geospatial indexes (2dsphere)
- Ambulance dispatch runs asynchronously to avoid blocking
- Caching on frequently accessed emergencies
- TTL index on timeline entries (auto-cleanup after 1 year)

## Future Enhancements

- Real-time WebSocket updates for status changes
- SMS/Push notifications for family members
- Predictive ambulance routing based on traffic
- AI-based severity re-evaluation during transport
- Voice call support for voice-based emergency trigger

## Related Documentation

- [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) - System architecture
- [API_SPECIFICATION.md](../../docs/API_SPECIFICATION.md) - Complete API spec
- [DATABASE_SCHEMA.md](../../docs/DATABASE_SCHEMA.md) - Data models
- [DEVELOPMENT_GUIDE.md](../../docs/DEVELOPMENT_GUIDE.md) - Development standards

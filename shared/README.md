# Shared Code & Types - LifeLine AI

Common code, types, and utilities shared across all services (Backend, Frontend, AI Services).

---

## Directory Structure

```
shared/
├── types/
│   └── index.ts           # All TypeScript type definitions
├── constants/
│   └── index.ts           # All shared constants
├── utils/
│   ├── validators.ts      # Input validation functions
│   ├── formatters.ts      # Data formatting utilities
│   ├── errorHandler.ts    # Error handling utilities
│   └── logger.ts          # Logging utilities
└── README.md
```

---

## Modules

### 1. Types (`types/index.ts`)

Centralized TypeScript type definitions used across all services:

- **User Types**: User, UserType, UserStatus
- **Patient Types**: PatientProfile, Medication, Surgery, etc.
- **Emergency Types**: EmergencySOS, TriggerSOSRequest, etc.
- **Ambulance Types**: Ambulance, AmbulanceLocation, AmbulanceAssignment
- **Hospital Types**: Hospital, HospitalStatus, BedInfo
- **Medical Types**: Vitals, Symptom, Triage result
- **API Response Types**: ApiSuccessResponse, ApiErrorResponse
- **WebSocket Types**: EmergencyEventType, WebSocketEvent
- **And 20+ more domain types...**

**Usage:**

```typescript
// Backend
import type { EmergencySOS, Ambulance } from '../../shared/types';

// Frontend
import type { User, PatientProfile } from '@/shared/types';

// AI Services
from shared.types import TriageResult, DiagnosticHypothesis  # (if Python support)
```

### 2. Constants (`constants/index.ts`)

Centralized constants used across all services:

#### User & Authentication
- `USER_TYPES`: PATIENT, DOCTOR, AMBULANCE_DRIVER, HOSPITAL_ADMIN, SYSTEM_ADMIN
- `USER_STATUS`: ACTIVE, INACTIVE, SUSPENDED, DELETED
- `LANGUAGES`: HINDI, ENGLISH, TAMIL, TELUGU, KANNADA, MARATHI
- `ROLE_PERMISSIONS`: Permissions per user type

#### Emergency
- `EMERGENCY_TYPES`: ACCIDENT, MEDICAL, OTHER
- `EMERGENCY_STATUS`: INITIATED, DISPATCHED, IN_TRANSIT, ...
- `EMERGENCY_PRIORITY`: CRITICAL, HIGH, MEDIUM, LOW
- `SEVERITY_THRESHOLDS`: Score ranges for each priority

#### Medical
- `BLOOD_GROUPS`: O+, O-, A+, A-, B+, B-, AB+, AB-, UNKNOWN
- `VITAL_RANGES`: Min/max/critical values for each vital sign
- `HOSPITAL_SPECIALIZATIONS`: List of all medical specializations
- `BED_TYPES`: GENERAL, ICU, HIGH_DEPENDENCY

#### API & Errors
- `HTTP_STATUS`: 200, 201, 400, 401, 403, 404, 429, 500, 503
- `ERROR_CODES`: All possible error codes with unique identifiers
- `API_VERSION`: Current API version

#### Time & Performance
- `TIME_CONSTANTS`: JWT expiry, cache TTLs, timeouts, SLAs
- `PAGINATION`: Default/max limits

#### Features
- `FEATURES`: Feature flags for experimental/optional features

**Usage:**

```typescript
// Backend
import { EMERGENCY_STATUS, SEVERITY_THRESHOLDS } from '../../shared/constants';

if (severity >= SEVERITY_THRESHOLDS.CRITICAL) {
  status = EMERGENCY_STATUS.CRITICAL;
}

// Frontend
import { USER_TYPES, EMERGENCY_PRIORITY } from '@/shared/constants';

// Avoid magic strings
if (userType === USER_TYPES.DOCTOR) { ... }

// AI Services
from shared.constants import VITAL_RANGES, SYMPTOM_SEVERITY
```

### 3. Validators (`utils/validators.ts`)

Validation functions for common data types:

```typescript
// Validate email format
validateEmail(email: string): boolean

// Validate phone number
validatePhoneNumber(phone: string): boolean

// Validate coordinates
validateCoordinates(lat: number, lng: number): boolean

// Validate blood pressure format
validateBloodPressure(bp: string): boolean

// Validate pincode
validatePincode(pincode: string): boolean
```

### 4. Formatters (`utils/formatters.ts`)

Data formatting utilities:

```typescript
// Format distance
formatDistance(meters: number): string  // "5.2 km"

// Format time
formatTime(seconds: number): string     // "5m 30s"

// Format phone number
formatPhoneNumber(phone: string): string // "+91-98765-43210"

// Format currency
formatCurrency(amount: number): string  // "$1,234.56"

// Format date/time
formatDateTime(date: Date): string
```

### 5. Error Handler (`utils/errorHandler.ts`)

Standardized error handling:

```typescript
class AppError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, any>;
}

// Create custom errors
class PatientNotFoundError extends AppError { ... }
class AmbulanceUnavailableError extends AppError { ... }

// Usage in backend
catch (error) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: { ... } });
  }
}

// Usage in frontend
catch (error) {
  if (error instanceof AppError) {
    showErrorToast(error.message);
  }
}
```

### 6. Logger (`utils/logger.ts`)

Centralized logging:

```typescript
logger.info('Message', { key: value });
logger.warn('Warning', { key: value });
logger.error('Error', { key: value });
logger.debug('Debug info', { key: value });
```

---

## Usage Guidelines

### Importing Types

**Backend:**
```typescript
import type { EmergencySOS, Ambulance, User } from '../../shared/types';
```

**Frontend:**
```typescript
import type { EmergencySOS, Ambulance } from '@/shared/types';
```

### Importing Constants

**Backend:**
```typescript
import { EMERGENCY_STATUS, SEVERITY_THRESHOLDS } from '../../shared/constants';

const emergencyStatus = EMERGENCY_STATUS.INITIATED;
```

**Frontend:**
```typescript
import { USER_TYPES, EMERGENCY_PRIORITY } from '@/shared/constants';

const isDoctor = userType === USER_TYPES.DOCTOR;
```

### Adding New Types

1. Edit `shared/types/index.ts`
2. Add your type definition
3. Export it (already exported at top level)
4. Update import in your service

### Adding New Constants

1. Edit `shared/constants/index.ts`
2. Add constant in appropriate section
3. Use throughout project

### Adding New Validators

1. Edit `shared/utils/validators.ts`
2. Implement validation function
3. Export it
4. Use in form inputs or API endpoints

---

## Best Practices

1. **Never duplicate types** - Add to shared/types instead
2. **Use constants** - Never use magic strings or numbers
3. **Consistent naming** - Use CONSTANT_NAME_CASE
4. **Type safety** - Always import types, not just interfaces
5. **Keep it simple** - Avoid circular dependencies
6. **Document types** - Add JSDoc comments for complex types

---

## Examples

### Complete Flow Example

```typescript
// 1. Import shared types and constants
import type { EmergencySOS } from '@/shared/types';
import { EMERGENCY_STATUS, SEVERITY_THRESHOLDS } from '@/shared/constants';

// 2. Use in function signature
function updateEmergency(emergency: EmergencySOS): void {
  // 3. Use constants for comparison
  if (emergency.severityScore >= SEVERITY_THRESHOLDS.CRITICAL) {
    // 4. Use constants for status assignment
    emergency.status = EMERGENCY_STATUS.IN_TRANSIT;
  }
}

// 5. Type-safe error handling
import { AppError } from '@/shared/utils/errorHandler';
import type { ApiErrorResponse } from '@/shared/types';

try {
  // operation
} catch (error) {
  if (error instanceof AppError) {
    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      }
    };
  }
}
```

---

## Maintenance

### Regular Tasks

- **Monthly**: Review unused types/constants
- **Quarterly**: Update shared types based on new features
- **As needed**: Add new types when creating new entities
- **Documentation**: Keep examples updated

---

## File Organization

Maintain organization by category:
- **User management types** stay together
- **Emergency-related types** are grouped
- **Hospital/bed types** are grouped
- **API types** are grouped

This makes it easier to find and maintain related code.

---

## Related Documentation

- [Architecture](../docs/ARCHITECTURE.md) - Overall system design
- [API Specification](../docs/API_SPECIFICATION.md) - API contracts
- [Database Schema](../docs/DATABASE_SCHEMA.md) - Data models

---

**Last Updated**: May 27, 2026

# Backend - LifeLine AI

Node.js/Express.js REST API server for emergency healthcare coordination.

---

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

---

## Directory Structure

```
backend/
├── src/
│   ├── modules/                    # Feature modules (independent)
│   │   ├── emergency-sos/
│   │   │   ├── controllers/
│   │   │   │   └── emergencySosController.ts
│   │   │   ├── services/
│   │   │   │   └── emergencySosService.ts
│   │   │   ├── models/
│   │   │   │   └── EmergencySOS.ts
│   │   │   ├── routes/
│   │   │   │   └── emergencySosRoutes.ts
│   │   │   ├── schemas/
│   │   │   │   └── emergencySosSchema.ts
│   │   │   ├── utils/
│   │   │   │   └── emergencySosUtils.ts
│   │   │   ├── tests/
│   │   │   │   ├── unit/
│   │   │   │   └── integration/
│   │   │   └── README.md
│   │   │
│   │   ├── ambulance-dispatch/     # Similar structure
│   │   ├── hospital-finder/
│   │   ├── patient-profile/
│   │   ├── ai-triage/
│   │   ├── doctor-assignment/
│   │   ├── complaints/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   └── [other-modules]/
│   │
│   ├── services/                   # Cross-module services
│   │   ├── authService.ts
│   │   ├── locationService.ts
│   │   ├── notificationService.ts
│   │   ├── aiService.ts
│   │   └── externalApiService.ts
│   │
│   ├── middleware/                 # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   ├── rateLimiter.ts
│   │   ├── validation.ts
│   │   └── cors.ts
│   │
│   ├── models/                     # Mongoose models (if shared)
│   │   └── [models].ts
│   │
│   ├── utils/                      # Utility functions
│   │   ├── logger.ts
│   │   ├── cache.ts
│   │   ├── validators.ts
│   │   ├── errors.ts
│   │   └── constants.ts
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── env.ts
│   │   └── routes.ts
│   │
│   ├── types/                      # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── express.ts
│   │   └── [domain-types].ts
│   │
│   ├── jobs/                       # Background job processors
│   │   ├── complaintAnalysis.ts
│   │   ├── analyticsAggregation.ts
│   │   └── notificationProcessor.ts
│   │
│   ├── app.ts                      # Express app setup
│   └── server.ts                   # Entry point
│
├── tests/                          # Integration & E2E tests
│   ├── e2e/
│   │   ├── emergency-sos.test.ts
│   │   └── [feature].test.ts
│   └── fixtures/
│
├── .env.example                    # Environment template
├── .env.local.example              # Local development template
├── package.json
├── tsconfig.json
├── jest.config.js
├── docker-compose.yml              # Local development
├── Dockerfile
└── README.md
```

---

## Module Development Pattern

### Example: Emergency SOS Module Structure

Each module follows a standard pattern for consistency:

#### 1. Controller (`controllers/emergencySosController.ts`)

```typescript
import { Request, Response } from 'express';
import { EmergencySosService } from '../services/emergencySosService';

export class EmergencySosController {
  constructor(private sosService: EmergencySosService) {}

  async triggerSOS(req: Request, res: Response) {
    const { patientId, emergencyType, location, description } = req.body;
    const result = await this.sosService.triggerEmergency({
      patientId,
      emergencyType,
      location,
      description,
      userId: req.user.id
    });
    res.status(201).json({ success: true, data: result });
  }

  async getEmergency(req: Request, res: Response) {
    const { emergencyId } = req.params;
    const result = await this.sosService.getEmergency(emergencyId);
    res.json({ success: true, data: result });
  }
}
```

#### 2. Service (`services/emergencySosService.ts`)

```typescript
import { EmergencySOS } from '../models/EmergencySOS';
import { AIService } from '../../services/aiService';
import { AmbulanceService } from '../ambulance-dispatch/services/ambulanceService';

export class EmergencySosService {
  constructor(
    private aiService: AIService,
    private ambulanceService: AmbulanceService,
    private notificationService: NotificationService
  ) {}

  async triggerEmergency(data: TriggerEmergencyDto) {
    // 1. Validate patient exists
    const patient = await this.getPatient(data.patientId);
    
    // 2. Create emergency record
    const emergency = await EmergencySOS.create({
      patientId: data.patientId,
      emergencyType: data.emergencyType,
      location: data.location,
      status: 'INITIATED'
    });

    // 3. Parallel operations
    const [severity, nearestAmbulance] = await Promise.all([
      this.aiService.predictSeverity(patient),
      this.ambulanceService.findNearest(data.location)
    ]);

    // 4. Update emergency with predictions
    emergency.severityScore = severity.score;
    emergency.priority = severity.priority;

    // 5. Assign ambulance
    if (nearestAmbulance) {
      await this.ambulanceService.assignAmbulance(
        emergency._id,
        nearestAmbulance._id
      );
    }

    // 6. Send notifications
    await this.notificationService.notify(data.patientId, {
      type: 'EMERGENCY_INITIATED',
      data: { emergencyId: emergency._id }
    });

    return emergency;
  }
}
```

#### 3. Routes (`routes/emergencySosRoutes.ts`)

```typescript
import { Router } from 'express';
import { auth, validate } from '../../middleware';
import { EmergencySosController } from '../controllers';
import { emergencySosSchema } from '../schemas';

const router = Router();
const controller = new EmergencySosController(sosService);

router.post(
  '/sos/trigger',
  auth.required,
  validate(emergencySosSchema.triggerSOS),
  (req, res) => controller.triggerSOS(req, res)
);

router.get(
  '/:emergencyId',
  auth.required,
  (req, res) => controller.getEmergency(req, res)
);

export default router;
```

#### 4. Tests (`tests/unit/emergencySosService.test.ts`)

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { EmergencySosService } from '../../services/emergencySosService';

describe('EmergencySosService', () => {
  let service: EmergencySosService;

  beforeEach(() => {
    // Setup mocks
    service = new EmergencySosService(
      mockAIService,
      mockAmbulanceService,
      mockNotificationService
    );
  });

  it('should trigger emergency successfully', async () => {
    const result = await service.triggerEmergency({
      patientId: 'patient-123',
      emergencyType: 'MEDICAL',
      location: { latitude: 28.7041, longitude: 77.1025 },
      description: 'Chest pain'
    });

    expect(result).toHaveProperty('_id');
    expect(result.status).toBe('INITIATED');
  });

  it('should fail if patient not found', async () => {
    await expect(
      service.triggerEmergency({
        patientId: 'invalid-id',
        emergencyType: 'MEDICAL',
        location: { latitude: 28.7041, longitude: 77.1025 },
        description: 'Chest pain'
      })
    ).rejects.toThrow('PATIENT_NOT_FOUND');
  });
});
```

---

## Environment Variables (.env)

```bash
# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/lifeline-dev
MONGODB_TEST_URI=mongodb://localhost:27017/lifeline-test

# Cache
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRY=3600
JWT_REFRESH_EXPIRY=604800

# External APIs
GOOGLE_MAPS_API_KEY=your-key
GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token

# Services
AI_SERVICE_URL=http://localhost:8000
AI_SERVICE_API_KEY=your-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs

# Rate Limiting
RATE_LIMIT_WINDOW=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Job Queue
JOB_QUEUE_HOST=localhost
JOB_QUEUE_PORT=6379
```

---

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- emergency-sos

# Linting
npm run lint
npm run lint:fix

# Database migrations
npm run db:migrate
npm run db:seed
npm run db:reset

# Database dumps
npm run db:dump
npm run db:restore

# Type checking
npm run type-check

# Start with Docker
docker-compose up --build

# SSH into Docker
docker-compose exec backend bash
```

---

## Code Standards

### Naming Conventions

```typescript
// Files: camelCase
emergencySosService.ts
ambulanceController.ts

// Classes: PascalCase
class EmergencySosService {}
class AmbulanceController {}

// Functions: camelCase
async triggerEmergency() {}
function calculateDistance() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;

// Interfaces: PascalCase with I prefix (optional)
interface EmergencyData {}
interface ITriageResult {}
```

### Import Organization

```typescript
// 1. External libraries
import express, { Request, Response } from 'express';
import axios from 'axios';

// 2. Internal services
import { EmergencySosService } from '../services';
import { AIService } from '../../services';

// 3. Models
import { EmergencySOS } from '../models';

// 4. Utils
import { logger } from '../../utils';
import { errors } from '../../utils';

// 5. Types
import type { EmergencyData } from '../../types';
```

### Error Handling

```typescript
// Define custom errors
class EmergencyError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: Record<string, any>
  ) {
    super(message);
  }
}

// Throw with context
throw new EmergencyError(
  'AMBULANCE_NOT_FOUND',
  'No ambulance available in 5km radius',
  404,
  { location, radius: 5000 }
);

// Catch and respond
catch (error) {
  if (error instanceof EmergencyError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
        details: error.details
      }
    });
  }
  // Handle other errors
}
```

### Logging

```typescript
import { logger } from '../../utils';

logger.info('Emergency triggered', { emergencyId, patientId });
logger.warn('Ambulance delay', { ambulanceId, delayMinutes });
logger.error('Failed to find hospital', { error, location });
logger.debug('Route optimization', { origin, destination, options });
```

---

## Testing Strategy

### Unit Tests
- Test individual functions
- Mock external dependencies
- Test error cases
- Coverage: >80%

### Integration Tests
- Test API endpoints
- Real database (test instance)
- WebSocket events
- Coverage: >70%

### E2E Tests
- Full flow testing
- Real services
- Performance testing
- Coverage: Critical paths only

---

## Deployment

See [docs/DEPLOYMENT_GUIDE.md](../../docs/DEPLOYMENT_GUIDE.md)

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check MongoDB is running
mongosh
# Or via Docker
docker-compose up -d mongodb
```

### TypeScript Compilation Error
```bash
npm run type-check
```

---

## Performance Tips

1. **Always index frequently queried fields** - See DATABASE_SCHEMA.md
2. **Use pagination** for list endpoints
3. **Cache expensive operations** in Redis
4. **Use async/await** - never block the event loop
5. **Compress responses** with gzip middleware
6. **Monitor slow queries** - >100ms is concerning

---

## Related Documentation

- [API Specification](../../docs/API_SPECIFICATION.md)
- [Database Schema](../../docs/DATABASE_SCHEMA.md)
- [Architecture](../../docs/ARCHITECTURE.md)
- [Development Guide](../../docs/DEVELOPMENT_GUIDE.md)

---

**Last Updated**: May 27, 2026

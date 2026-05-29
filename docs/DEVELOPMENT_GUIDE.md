# Development Guide - LifeLine AI

Complete guide for setting up, developing, and deploying LifeLine AI.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Code Standards](#code-standards)
4. [Git Workflow](#git-workflow)
5. [Testing Strategy](#testing-strategy)
6. [Common Development Tasks](#common-development-tasks)

---

## Prerequisites

### Required Software
- **Node.js** v18+ (LTS)
- **Python** 3.10+
- **Docker** & **Docker Compose**
- **Git**
- **MongoDB** (via Docker)
- **Redis** (via Docker)
- **Visual Studio Code** (recommended)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Python
- MongoDB
- Thunder Client (API testing)
- GitLens

### System Requirements
- **RAM**: 8GB minimum (4GB per service)
- **Disk**: 20GB free space
- **Bandwidth**: 50MB/s (for dependency downloads)

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd lifeline-ai
```

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install
npm run build

# Frontend
cd ../frontend
npm install

# AI Services
cd ../ai-services
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Go back to root
cd ..
```

### 3. Setup Environment Files

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local

# AI Services
cp ai-services/.env.example ai-services/.env

# DevOps
cp devops/.env.example devops/.env
```

Edit each `.env` file with your local configuration:

**backend/.env:**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://mongo:27017/lifeline-dev
REDIS_URL=redis://redis:6379
JWT_SECRET=dev-secret-change-in-prod
GOOGLE_MAPS_API_KEY=<your-key>
GEMINI_API_KEY=<your-key>
```

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

**ai-services/.env:**
```env
PORT=8000
MONGODB_URI=mongodb://mongo:27017/lifeline-ai
GEMINI_API_KEY=<your-key>
```

### 4. Start Docker Services

```bash
cd devops
docker-compose up -d

# Wait for services to be ready
docker-compose logs -f
# Look for "listening on" messages

# Verify services
docker-compose ps
```

Expected output:
```
NAME          STATUS
mongo         Up (healthy)
redis         Up (healthy)
backend       Up
frontend      Up
ai-services   Up
```

### 5. Run Database Migrations

```bash
cd backend
npm run db:migrate
npm run db:seed
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Expected: "Server running on http://localhost:3000"
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Expected: "Ready in X seconds"
```

**Terminal 3 - AI Services:**
```bash
cd ai-services
source venv/bin/activate
python app.py
# Expected: "Running on http://0.0.0.0:8000"
```

### 7. Verify Setup

```bash
# Check backend
curl http://localhost:3000/api/v1/health

# Check frontend
curl http://localhost:3001

# Check AI services
curl http://localhost:8000/health
```

---

## Code Standards

### Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| **Files** | camelCase | `emergencySosService.ts` |
| **Directories** | kebab-case | `emergency-sos/` |
| **Classes** | PascalCase | `EmergencySosService` |
| **Functions** | camelCase | `triggerEmergency()` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| **Variables** | camelCase | `emergencyId` |
| **Private members** | _camelCase | `_internalMethod()` |
| **Type defs** | PascalCase | `EmergencyData` |

### File Organization

**Backend TypeScript:**
```typescript
// 1. External imports
import express from 'express';
import { injectable } from 'inversify';

// 2. Internal imports
import { EmergencySOS } from '../models';
import { AIService } from '../../services';

// 3. Types
import type { Emergency } from '../../types';

// 4. Constants
const CACHE_TTL = 300;

// 5. Class/Function definition
@injectable()
export class EmergencySosService {
  // Implementation
}
```

**Frontend React:**
```typescript
'use client';

// 1. React/Next
import React, { useState } from 'react';
import Link from 'next/link';

// 2. UI components
import { Button, Card } from '@/components/common';

// 3. Custom hooks
import { useEmergency } from '@/hooks';

// 4. Services
import { emergencyService } from '@/services';

// 5. Types
import type { Emergency } from '@/types';

// 6. Styles
import styles from './page.module.css';

// 7. Component
export default function Page() {
  // Implementation
}
```

**Python:**
```python
# 1. Standard library
import json
from typing import Dict, List

# 2. Third-party
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# 3. Local
from .models import TriageModel
from ..utils import validators

# 4. Constants
MAX_RETRIES = 3

# 5. Class/Function
class TriageAnalyzer:
    """Emergency triage analyzer using ML."""
    pass
```

### Comments & Documentation

**Required Comments:**
- Public classes: JSDoc/docstring
- Public methods: Parameter & return documentation
- Complex logic: Inline explanation
- Workarounds: Reason for approach

```typescript
/**
 * Analyzes emergency severity based on symptoms and vitals.
 * 
 * @param patientData - Patient information including symptoms, vitals
 * @returns Severity score (1-10) and priority level
 * @throws {PatientNotFoundError} If patient doesn't exist
 * 
 * @example
 * const result = await analyzer.analyzeEmergency(patientData);
 * console.log(result.severity); // 8.5
 */
async analyzeEmergency(patientData: PatientData): Promise<SeverityResult> {
  // Implementation
}
```

### Error Handling

**Custom Error Classes:**
```typescript
// backend/src/utils/errors.ts

export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PatientNotFoundError extends AppError {
  constructor(patientId: string) {
    super(
      'PATIENT_NOT_FOUND',
      404,
      `Patient ${patientId} not found`,
      { patientId }
    );
  }
}

// Usage
throw new PatientNotFoundError('patient-123');

// Catch
catch (error) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      }
    });
  }
}
```

---

## Git Workflow

### Branch Naming

```
feature/  - New feature
  feature/sos-trigger
  feature/hospital-finder

bugfix/   - Bug fix
  bugfix/ambulance-delay
  bugfix/notification-not-sending

refactor/ - Code refactoring
  refactor/triage-module

docs/     - Documentation
  docs/api-guide

hotfix/   - Production hotfix
  hotfix/security-patch
```

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore, perf

**Example:**
```
feat(emergency-sos): implement automatic ambulance dispatch

- Added AI-based ambulance selection
- Integrated with location service
- Implemented retry logic for dispatch failures

Closes #123
```

### Pull Request Process

1. Create feature branch from `develop`
2. Make commits with clear messages
3. Push to your fork
4. Create PR with description
5. Code review (minimum 2 approvals)
6. All tests must pass
7. Merge to `develop`
8. Delete feature branch

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Changes
- Change 1
- Change 2

## Testing
Tested on:
- [ ] Development
- [ ] Staging (if applicable)

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

---

## Testing Strategy

### Test Levels

1. **Unit Tests** (70% coverage)
   - Single function/method
   - Mocked dependencies
   - Fast execution

2. **Integration Tests** (20% coverage)
   - Multiple components
   - Real database (test instance)
   - WebSocket events

3. **E2E Tests** (10% coverage)
   - Full user flows
   - Real services
   - Critical paths only

### Running Tests

```bash
# Backend tests
cd backend
npm run test              # All tests
npm run test -- emergency-sos  # Specific module
npm run test:coverage     # With coverage report
npm run test:watch       # Watch mode

# Frontend tests
cd frontend
npm run test              # All tests
npm run test:coverage     # With coverage

# AI Services tests
cd ai-services
pytest                    # All tests
pytest tests/unit/       # Specific directory
pytest --cov=src        # With coverage
```

### Test File Structure

```
tests/
├── unit/
│   ├── emergencySosService.test.ts
│   └── triageAnalyzer.test.py
├── integration/
│   ├── emergency-sos-flow.test.ts
│   └── ambulance-dispatch.test.ts
├── e2e/
│   └── critical-flows.test.ts
└── fixtures/
    ├── mock-patients.ts
    └── mock-hospitals.ts
```

### Example Tests

**TypeScript Unit Test:**
```typescript
describe('EmergencySosService', () => {
  let service: EmergencySosService;
  let mockAIService: jest.Mocked<AIService>;

  beforeEach(() => {
    mockAIService = createMockAIService();
    service = new EmergencySosService(mockAIService);
  });

  it('should trigger emergency with correct severity', async () => {
    const result = await service.triggerEmergency({
      patientId: 'p-123',
      emergencyType: 'MEDICAL',
      location: { latitude: 28.7, longitude: 77.1 }
    });

    expect(result).toHaveProperty('_id');
    expect(result.status).toBe('INITIATED');
    expect(mockAIService.predictSeverity).toHaveBeenCalled();
  });
});
```

**Python Unit Test:**
```python
def test_analyze_emergency_critical():
    analyzer = TriageAnalyzer()
    
    patient_data = {
        'symptoms': [{'name': 'chest_pain', 'severity': 9}],
        'vitals': {'heart_rate': 140}
    }
    
    result = analyzer.analyze_emergency(patient_data)
    
    assert result['severity_score'] > 8
    assert result['priority'] == 'CRITICAL'
```

---

## Common Development Tasks

### Adding New Endpoint

1. **Create model** (if new entity)
   ```bash
   backend/src/models/YourEntity.ts
   ```

2. **Create schema**
   ```bash
   backend/src/modules/your-module/schemas/yourSchema.ts
   ```

3. **Create service**
   ```bash
   backend/src/modules/your-module/services/yourService.ts
   ```

4. **Create controller**
   ```bash
   backend/src/modules/your-module/controllers/yourController.ts
   ```

5. **Create routes**
   ```bash
   backend/src/modules/your-module/routes/yourRoutes.ts
   ```

6. **Add to app.ts**
   ```typescript
   app.use('/api/v1/your-endpoint', yourRoutes);
   ```

7. **Add tests**
   ```bash
   backend/tests/unit/your-module.test.ts
   ```

### Running Database Migration

```bash
cd backend

# Create migration
npm run db:migrate:create -- your-migration-name

# Edit generated file in migrations/

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:rollback
```

### Debugging

**Backend (Node.js):**
```bash
# Enable debug logs
DEBUG=lifeline:* npm run dev

# VS Code Debugger
# Add breakpoint in VS Code, then:
npm run debug

# Attach debugger to http://localhost:9229
```

**Frontend:**
```bash
# VS Code: Use React DevTools extension
# Browser: F12 → Console/Debugger
```

**Python:**
```bash
# Add breakpoint
import pdb; pdb.set_trace()

# Or use VS Code Python debugger
```

### Database Operations

```bash
# Reset database (development only!)
npm run db:reset

# Seed sample data
npm run db:seed

# Backup database
npm run db:backup

# Access MongoDB shell
docker-compose exec mongo mongosh
```

### Performance Profiling

**Backend:**
```bash
# Enable profiler
NODE_DEBUG_NATIVE=async_hooks npm run dev

# Use clinic.js
npm install -g clinic
clinic doctor -- node app.js
```

**Frontend:**
```bash
# React Profiler in DevTools
# Or build analysis:
npm run analyze
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

### MongoDB Connection Error

```bash
# Check if running
docker-compose ps

# Restart
docker-compose restart mongo

# Check logs
docker-compose logs mongo
```

### Module Not Found

```bash
# Clear cache
rm -rf node_modules/.cache
npm install

# For Python
pip install -r requirements.txt --force-reinstall
```

### TypeScript Errors

```bash
npm run type-check
```

### Test Failures

```bash
# Clear Jest cache
npm run test -- --clearCache

# Run in debug mode
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

---

## Code Review Checklist

Before submitting PR, verify:

- [ ] Code follows naming conventions
- [ ] Comments for complex logic
- [ ] Tests added (>80% coverage)
- [ ] No console.logs or debugger statements
- [ ] Lint passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build passes (`npm run build`)
- [ ] Commit messages follow convention
- [ ] No hardcoded credentials
- [ ] Documentation updated (if needed)

---

## Performance Guidelines

**Backend:**
- API response time: <200ms (p95)
- Database query time: <50ms
- Cache hit rate: >70%

**Frontend:**
- Page load: <3s (first contentful paint)
- Time to interactive: <5s
- Lighthouse score: >90

**AI Services:**
- Model inference: <500ms
- Translation API: <1s
- Route optimization: <2s

---

## Security Checklist

- [ ] No hardcoded secrets
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF tokens (if needed)
- [ ] Rate limiting enabled
- [ ] Sensitive data encrypted
- [ ] HTTPS enabled in production
- [ ] Security headers set
- [ ] Dependency vulnerabilities checked

```bash
npm audit
npm audit fix
```

---

## Documentation

**Update these when needed:**
- README.md - Overview & quick start
- ARCHITECTURE.md - System design
- API_SPECIFICATION.md - API details
- DATABASE_SCHEMA.md - Data model
- Code comments - Implementation details

---

**Last Updated**: May 27, 2026

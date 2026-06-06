<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 26ed257ad8110c55e193d224dc55b330708f118c
# 🚑 LifeLine AI - Emergency Healthcare Coordination Platform

## Project Overview

LifeLine AI is an AI-powered emergency healthcare coordination platform designed to reduce critical response time and improve healthcare accessibility through intelligent emergency response systems.

**Version:** 1.0.0  
**Status:** In Development  
**Last Updated:** May 27, 2026

---

## 🎯 Quick Navigation

- **Architecture:** See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **API Documentation:** See [docs/API_SPECIFICATION.md](docs/API_SPECIFICATION.md)
- **Database Design:** See [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)
- **Development Guide:** See [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)
- **Backend Setup:** See [backend/README.md](backend/README.md)
- **Frontend Setup:** See [frontend/README.md](frontend/README.md)
- **AI Services:** See [ai-services/README.md](ai-services/README.md)

---

## 📁 Project Structure

```
lifeline-ai/
├── docs/                          # Documentation & architecture
│   ├── ARCHITECTURE.md           # System architecture & design patterns
│   ├── API_SPECIFICATION.md      # REST API & WebSocket specs
│   ├── DATABASE_SCHEMA.md        # MongoDB schema definitions
│   ├── DEVELOPMENT_GUIDE.md      # Development standards & setup
│   ├── DEPLOYMENT_GUIDE.md       # Deployment & DevOps
│   └── DECISION_LOG.md           # Architecture decisions
│
├── backend/                       # Node.js/Express backend
│   ├── src/
│   │   ├── modules/              # Feature modules (modular structure)
│   │   ├── services/             # Business logic & external integrations
│   │   ├── middleware/           # Express middleware
│   │   ├── routes/               # API routes
│   │   ├── models/               # MongoDB models
│   │   ├── controllers/          # Request handlers
│   │   ├── utils/                # Helper functions
│   │   └── config/               # Configuration
│   ├── tests/                    # Jest unit & integration tests
│   ├── .env.example              # Environment template
│   ├── package.json
│   └── README.md
│
├── frontend/                      # Next.js frontend
│   ├── app/                      # Next.js app router
│   ├── components/               # React components
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API client services
│   ├── utils/                    # Frontend utilities
│   ├── styles/                   # Tailwind & CSS modules
│   ├── public/                   # Static assets
│   ├── .env.example              # Environment template
│   ├── package.json
│   └── README.md
│
├── ai-services/                  # AI & ML services
│   ├── src/
│   │   ├── modules/
│   │   │   ├── triage/          # Emergency triage AI
│   │   │   ├── route-optimizer/ # AI route optimization
│   │   │   ├── symptom-analyzer/# Symptom analysis AI
│   │   │   ├── translator/      # Language translation
│   │   │   └── analytics/       # AI analytics
│   │   └── utils/
│   ├── tests/
│   ├── requirements.txt
│   └── README.md
│
├── shared/                        # Shared code & types
│   ├── types/                    # TypeScript type definitions
│   ├── constants/                # Shared constants
│   ├── utils/                    # Shared utilities
│   └── README.md
│
├── devops/                        # Infrastructure & deployment
│   ├── docker/
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.frontend
│   │   └── Dockerfile.ai-services
│   ├── kubernetes/              # K8s manifests (if needed)
│   ├── docker-compose.yml       # Local development setup
│   ├── .env.example
│   └── README.md
│
└── docs-external/               # User-facing documentation
    ├── API_GUIDES/
    ├── DEPLOYMENT_GUIDES/
    └── TROUBLESHOOTING.md

```

---

## 🏗️ System Architecture

### High-Level Components

```
┌─────────────────┐
│   Mobile/Web    │ (Next.js Frontend)
│   Client Apps   │
└────────┬────────┘
         │ HTTPS + WebSocket
         ↓
┌─────────────────────────────────────┐
│    API Gateway & Load Balancer      │
│  (Nginx/Vercel Edge Functions)      │
└────────┬────────────────────────────┘
         │
┌────────┴──────────────────────────────────────────┐
│                Backend Services                    │
│  (Node.js/Express microservices via modules)       │
├───────────────────────────────────────────────────┤
│ • Emergency SOS              • Hospital Network   │
│ • Ambulance Dispatch         • AI Triage Engine   │
│ • Location & Tracking        • Route Optimization │
│ • Patient Management         • Complaint System   │
│ • Notifications              • Analytics          │
└────────┬──────────────────────────────────────────┘
         │
    ┌────┴────┬──────────────┬──────────────┐
    │          │              │              │
    ↓          ↓              ↓              ↓
┌────────┐ ┌───────┐ ┌─────────┐ ┌──────────┐
│MongoDB │ │Redis  │ │AI Svc   │ │Ext APIs  │
│Database│ │Cache  │ │(Python) │ │(Maps,   │
└────────┘ └───────┘ └─────────┘ │SMS, etc)│
                                  └──────────┘
```

---

## 🔧 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Mapbox | Web/Mobile UI |
| **Backend** | Node.js, Express.js, TypeScript | API server, business logic |
| **Database** | MongoDB Atlas | Primary data store |
| **Cache** | Redis | Session, real-time data |
| **AI/ML** | Python, Gemini/OpenAI APIs | Triage, routing, translation |
| **Deployment** | Docker, Docker Compose, AWS/GCP | Containerization & hosting |
| **Real-time** | Socket.io, WebSockets | Live tracking, notifications |
| **Authentication** | JWT, Supabase Auth | User security |
| **Monitoring** | Sentry, CloudWatch | Error tracking & observability |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- Docker & Docker Compose
- MongoDB connection string
- Redis instance
- API keys (Gemini, Google Maps, SMS provider)

### Quick Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd lifeline-ai

# 2. Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp devops/.env.example devops/.env

# 3. Start development environment
cd devops
docker-compose up -d

# 4. Install dependencies
cd ../backend && npm install
cd ../frontend && npm install
cd ../ai-services && pip install -r requirements.txt

# 5. Run migrations & seeds
cd ../backend && npm run db:migrate

# 6. Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - AI Services
cd ai-services && python app.py
```

For detailed setup, see [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)

---

## 📊 Core Modules (22 Features)

| Module | Backend | Frontend | AI Service | Status |
|--------|---------|----------|-----------|---------|
| 1. Emergency SOS | ✅ | ✅ | - | Design Phase |
| 2. Ambulance Network | ✅ | ✅ | ✅ | Design Phase |
| 3. Route Optimization | ✅ | ✅ | ✅ | Design Phase |
| 4. Hospital Recommendation | ✅ | ✅ | ✅ | Design Phase |
| 5. Patient Health Profile | ✅ | ✅ | - | Design Phase |
| 6. AI Triage | ✅ | ✅ | ✅ | Design Phase |
| 7. Doctor/Nurse Assignment | ✅ | ✅ | ✅ | Design Phase |
| 8. Multilingual Support | ✅ | ✅ | ✅ | Design Phase |
| 9. Offline/Low Internet | ✅ | ✅ | - | Design Phase |
| 10. Voice Assistant | ✅ | ✅ | ✅ | Design Phase |
| 11. Symptom Assistance | ✅ | ✅ | ✅ | Design Phase |
| 12. Accident Detection | ✅ | ✅ | - | Design Phase |
| 13. Blood Availability | ✅ | ✅ | - | Design Phase |
| 14. Family Alerts | ✅ | ✅ | - | Design Phase |
| 15. Pharmacy Support | ✅ | ✅ | - | Design Phase |
| 16. Complaint System | ✅ | ✅ | - | Design Phase |
| 17. Complaint Analytics | ✅ | ✅ | ✅ | Design Phase |
| 18. Command Dashboard | ✅ | ✅ | - | Design Phase |
| 19. Traffic Integration | ✅ | ✅ | ✅ | Design Phase |
| 20. Hospital Overload Prediction | ✅ | ✅ | ✅ | Design Phase |
| 21. Accident Hotspot Detection | ✅ | ✅ | ✅ | Design Phase |
| 22. Fake Emergency Detection | ✅ | ✅ | ✅ | Design Phase |

---

## 🛡️ Key Design Principles

1. **Modularity**: Each feature is independently deployable
2. **Scalability**: Horizontal scaling ready with async processing
3. **Reliability**: Error handling, retry logic, fallbacks
4. **Security**: JWT auth, role-based access, data encryption
5. **Performance**: Caching, CDN, database indexing
6. **Accessibility**: Multi-language, voice support, low-bandwidth mode
7. **Testability**: Unit, integration, E2E tests
8. **Documentation**: Self-documenting code with Swagger/OpenAPI

---

## 📈 Team Responsibilities

### Backend Team
- Implement REST APIs
- Database schema & migrations
- Business logic & validations
- Integration with external services
- Real-time WebSocket events

### Frontend Team
- UI/UX components with Tailwind
- State management (Redux/Context)
- API client integration
- Mobile responsiveness
- Accessibility features

### AI/ML Team
- Triage system development
- Route optimization algorithms
- Symptom analysis models
- Language translation
- Predictive analytics

### DevOps Team
- Docker containerization
- CI/CD pipelines
- Infrastructure setup
- Monitoring & logging
- Database backups

---

## 🔐 Security Checklist

- [ ] Environment variables never committed
- [ ] JWT token validation on all endpoints
- [ ] Role-based access control (RBAC)
- [ ] SQL injection prevention (Mongoose)
- [ ] Rate limiting on sensitive endpoints
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Database encryption at rest
- [ ] Sensitive data logging prevention

---

## 📞 Support & Issues

- **Documentation**: See [docs/](docs/)
- **Architecture Decisions**: See [docs/DECISION_LOG.md](docs/DECISION_LOG.md)
- **Bug Reports**: GitHub Issues
- **Architecture Questions**: See ARCHITECTURE.md

---

## 📝 License

Proprietary - Do not share without permission

---

**Status**: 🟡 Architecture & Setup Phase
<<<<<<< HEAD
=======
# Frontend - LifeLine AI

Next.js 14 + React 18 web application for emergency healthcare coordination.

---

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API endpoint

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
npm start
```

Open [http://localhost:3001](http://localhost:3001) to view the app.

---

## Directory Structure

```
frontend/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   ├── (auth)/                     # Auth pages group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │
│   ├── (dashboard)/                # Authenticated routes group
│   │   ├── layout.tsx              # Dashboard layout
│   │   ├── home/
│   │   │   └── page.tsx
│   │   ├── emergency/
│   │   │   ├── page.tsx
│   │   │   └── [emergencyId]/
│   │   ├── profile/
│   │   ├── complaints/
│   │   ├── history/
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── analytics/
│   │       └── management/
│   │
│   └── api/                        # API routes (if needed)
│       └── [routes].ts
│
├── components/                     # React components
│   ├── common/                     # Reusable components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   ├── Toast.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── [other-common].tsx
│   │
│   ├── emergency/                  # Feature-specific components
│   │   ├── SOSButton.tsx
│   │   ├── EmergencyForm.tsx
│   │   ├── EmergencyTracking.tsx
│   │   ├── AmbulanceMap.tsx
│   │   └── EmergencyTimeline.tsx
│   │
│   ├── ambulance/
│   │   ├── AmbulanceList.tsx
│   │   ├── AmbulanceCard.tsx
│   │   └── AmbulanceMap.tsx
│   │
│   ├── hospital/
│   │   ├── HospitalFinder.tsx
│   │   ├── HospitalCard.tsx
│   │   ├── BedAvailability.tsx
│   │   └── HospitalMap.tsx
│   │
│   ├── patient/
│   │   ├── ProfileForm.tsx
│   │   ├── HealthSummary.tsx
│   │   └── MedicalHistory.tsx
│   │
│   ├── ai/
│   │   ├── SymptomAnalyzer.tsx
│   │   ├── TriageResults.tsx
│   │   └── FirstAidGuide.tsx
│   │
│   ├── admin/
│   │   ├── DashboardOverview.tsx
│   │   ├── Analytics.tsx
│   │   ├── ComplaintsList.tsx
│   │   ├── ResponseTimeChart.tsx
│   │   └── HotspotMap.tsx
│   │
│   └── [other-feature-components]/
│
├── hooks/                          # Custom React hooks
│   ├── useAuth.ts                  # Authentication
│   ├── useEmergency.ts             # Emergency management
│   ├── useLocation.ts              # Geolocation
│   ├── useWebSocket.ts             # WebSocket connection
│   ├── useNotification.ts           # Toast notifications
│   └── [custom-hooks].ts
│
├── services/                       # API client services
│   ├── api.ts                      # Axios instance
│   ├── authService.ts
│   ├── emergencyService.ts
│   ├── ambulanceService.ts
│   ├── hospitalService.ts
│   ├── patientService.ts
│   ├── aiService.ts
│   └── [services].ts
│
├── store/                          # State management (Redux/Context)
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── emergencySlice.ts
│   │   ├── locationSlice.ts
│   │   └── [other-slices].ts
│   └── store.ts
│
├── utils/                          # Utility functions
│   ├── validators.ts
│   ├── formatters.ts
│   ├── locationUtils.ts
│   ├── errorHandler.ts
│   └── constants.ts
│
├── styles/                         # Styles
│   ├── globals.css                 # Tailwind imports
│   ├── variables.css               # CSS variables
│   ├── [feature].module.css        # Component-specific
│   └── theme.config.js             # Tailwind config
│
├── public/                         # Static assets
│   ├── images/
│   ├── icons/
│   └── manifest.json
│
├── tests/                          # Tests
│   ├── unit/
│   │   ├── components/
│   │   └── utils/
│   ├── integration/
│   │   └── pages/
│   └── fixtures/
│
├── types/                          # TypeScript types
│   ├── index.ts
│   ├── api.ts
│   ├── domain.ts
│   └── [types].ts
│
├── .env.example                    # Environment template
├── .env.local.example              # Local development template
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind CSS
├── tsconfig.json
├── jest.config.js
├── package.json
└── README.md
```

---

## Key Features & Components

### Emergency SOS Flow
```
┌──────────────────┐
│  SOS Button      │ (Always visible, floating button)
└────────┬─────────┘
         ↓
┌──────────────────────────────────┐
│  Confirm Emergency Dialog        │
│  - Type (Accident/Medical/Other) │
│  - Auto location capture         │
└────────┬─────────────────────────┘
         ↓
┌──────────────────────────────────┐
│  Emergency Initiated             │
│  - Show ambulance ETA            │
│  - Show hospital info            │
│  - Live tracking map             │
│  - Family alerts sent            │
└──────────────────────────────────┘
```

### Real-Time Tracking
- Uses WebSocket for live updates
- Auto-update ambulance location every 10s
- Smooth map animations
- ETA countdown

### Admin Dashboard
- Real-time overview
- Live ambulance tracking
- Hospital status
- Complaint analytics
- Hotspot visualization

---

## Environment Variables (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Maps Configuration
NEXT_PUBLIC_MAPBOX_TOKEN=your-token
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key

# Features
NEXT_PUBLIC_OFFLINE_MODE=false
NEXT_PUBLIC_VOICE_ENABLED=true
NEXT_PUBLIC_MULTI_LANGUAGE=true

# Analytics
NEXT_PUBLIC_SENTRY_DSN=your-sentry-key

# Environment
NEXT_ENV=development
```

---

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Production server
npm start

# Run tests
npm run test

# Test with coverage
npm run test:coverage

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format

# Build analysis
npm run analyze
```

---

## Component Development Standards

### React Component Structure

```typescript
// components/emergency/SOSButton.tsx
'use client'; // If using client-side features

import React, { useState } from 'react';
import { useEmergency } from '@/hooks';
import { Button } from '@/components/common';

interface SOSButtonProps {
  disabled?: boolean;
  onSuccess?: () => void;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  disabled = false,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { triggerEmergency } = useEmergency();

  const handleSOS = async () => {
    try {
      setIsLoading(true);
      const result = await triggerEmergency();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to trigger SOS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSOS}
      disabled={disabled || isLoading}
      variant="danger"
      size="lg"
      className="rounded-full shadow-lg"
    >
      {isLoading ? 'Triggering...' : 'SOS'}
    </Button>
  );
};
```

### Custom Hook Example

```typescript
// hooks/useEmergency.ts
import { useCallback, useEffect, useState } from 'react';
import { emergencyService } from '@/services';
import { useDispatch, useSelector } from 'react-redux';
import { setEmergency, updateEmergency } from '@/store/slices/emergencySlice';

export const useEmergency = () => {
  const dispatch = useDispatch();
  const emergency = useSelector((state) => state.emergency);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerEmergency = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await emergencyService.triggerSOS(data);
      dispatch(setEmergency(result));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const trackEmergency = useCallback((emergencyId: string) => {
    // WebSocket subscription
    return emergencyService.subscribeToTracking(emergencyId, (update) => {
      dispatch(updateEmergency(update));
    });
  }, [dispatch]);

  return { emergency, triggerEmergency, trackEmergency, loading, error };
};
```

### API Service Pattern

```typescript
// services/emergencyService.ts
import { api } from './api';
import type { Emergency, TriggerSOSRequest } from '@/types';

export const emergencyService = {
  triggerSOS(data: TriggerSOSRequest) {
    return api.post<Emergency>('/emergency/sos/trigger', data);
  },

  getEmergency(emergencyId: string) {
    return api.get<Emergency>(`/emergency/${emergencyId}`);
  },

  cancelEmergency(emergencyId: string) {
    return api.post(`/emergency/${emergencyId}/cancel`);
  },

  subscribeToTracking(emergencyId: string, callback: (update: any) => void) {
    // WebSocket subscription
  }
};
```

---

## Styling with Tailwind CSS

### Button Variants

```tsx
// Common button styles
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button size="sm" size="md" size="lg">Sizes</Button>
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>
```

---

## Performance Optimization

### Code Splitting
- Automatic with Next.js
- Route-based splitting
- Component lazy loading

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/hospital.jpg"
  alt="Hospital"
  width={800}
  height={600}
  priority={false}
/>
```

### Caching Strategy
- Use SWR for data fetching
- Implement Redis cache on API
- Browser cache headers

---

## Testing

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { SOSButton } from '@/components/emergency/SOSButton';

describe('SOSButton', () => {
  it('should render button', () => {
    render(<SOSButton />);
    expect(screen.getByText('SOS')).toBeInTheDocument();
  });

  it('should trigger emergency on click', async () => {
    const onSuccess = jest.fn();
    render(<SOSButton onSuccess={onSuccess} />);
    const button = screen.getByText('SOS');
    fireEvent.click(button);
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

---

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast >4.5:1
- Alt text for images
- Focus management

---

## Deployment

See [docs/DEPLOYMENT_GUIDE.md](../../docs/DEPLOYMENT_GUIDE.md)

---

## Troubleshooting

### Port Already in Use
```bash
# Change port
npm run dev -- -p 3001
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### TypeScript Errors
```bash
npm run type-check
```

---

## Related Documentation

- [API Specification](../../docs/API_SPECIFICATION.md)
- [Architecture](../../docs/ARCHITECTURE.md)
- [Development Guide](../../docs/DEVELOPMENT_GUIDE.md)

---

**Last Updated**: May 27, 2026
>>>>>>> 69ade68eba5255c0c3a586f3eb390fdba4144aa2
=======
>>>>>>> 26ed257ad8110c55e193d224dc55b330708f118c

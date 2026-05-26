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

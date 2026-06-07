# LifeLine HMS - Frontend Application

Hospital Management System frontend built with Next.js 14.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

Application will be available at: http://localhost:3002

---

## 📁 Project Structure

```
hms/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home (redirects to dashboard)
│   ├── globals.css          # Global styles
│   ├── dashboard/
│   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   ├── page.tsx         # Dashboard overview
│   │   ├── qr-scanner/      # QR Scanner page
│   │   ├── emergency/       # Emergency requests page
│   │   ├── beds/            # Bed management page
│   │   ├── admissions/      # Admissions page
│   │   └── settings/        # Settings page
│   │
├── components/              # React components
│   ├── common/             # Reusable components
│   ├── qr/                 # QR scanner components
│   ├── emergency/          # Emergency-related components
│   ├── beds/               # Bed management components
│   └── admissions/         # Admission components
│
├── hooks/                   # Custom React hooks
│   ├── useWebSocket.ts     # WebSocket connection hook
│   ├── useQRScanner.ts     # QR scanner hook
│   └── useBeds.ts          # Bed management hook
│
├── services/                # API services
│   └── hmsApi.ts           # HMS API client
│
├── store/                   # Zustand stores
│   └── emergencyStore.ts   # Emergency state management
│
├── types/                   # TypeScript types
│   └── index.ts
│
├── utils/                   # Utility functions
│   └── helpers.ts
│
├── public/                  # Static assets
│   └── sounds/             # Notification sounds
│
├── .env.local              # Environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

---

## 🎨 Features Implemented

### 1. Dashboard Layout ✅
- Sidebar navigation with active state
- Top bar with notifications
- Emergency alert badges
- Real-time connection status
- Responsive design

### 2. Dashboard Overview ✅
- Stat cards (Total Beds, Available Beds, Admissions, Emergencies)
- Recent admissions list
- Bed occupancy chart
- Pending emergency alerts

### 3. WebSocket Integration ✅
- Auto-connect on mount
- Real-time emergency notifications
- Toast notifications with custom styling
- Emergency alert sound (placeholder)
- Hospital room joining

### 4. State Management ✅
- Zustand store for emergency requests
- Add/remove/clear emergency requests
- Centralized state for real-time updates

### 5. API Client ✅
- Axios-based API client
- Request/response interceptors
- Auto token handling
- Error handling with toasts
- All HMS endpoints covered

---

## 🔌 API Integration

All APIs are configured in `services/hmsApi.ts`:

- **QR Code**: `scanQRCode()`
- **Admissions**: `quickAdmit()`, `getAdmissions()`, `updateVitals()`, `dischargePatient()`
- **Emergency**: `getPendingEmergencies()`, `acceptEmergency()`, `rejectEmergency()`
- **Beds**: `getBeds()`, `getBedAvailability()`, `allocateBed()`, `releaseBed()`

---

## 🔄 WebSocket Events

### Listening to:
- `emergency:new` - New emergency request
- `emergency:accepted_by_other` - Another hospital accepted
- `emergency:next_batch` - Next batch notification
- `bed:update` - Bed status updates

### Emitting:
- `hospital:join` - Join hospital room on connect
- `emergency:join` - Join emergency room

---

## 🎯 Next Pages to Build

### Priority 1:
1. **QR Scanner Page** (`/dashboard/qr-scanner`)
2. **Emergency Requests Page** (`/dashboard/emergency`)
3. **Bed Management Page** (`/dashboard/beds`)
4. **Admissions Page** (`/dashboard/admissions`)

### Priority 2:
5. **Quick Admit Modal** (component)
6. **Emergency Request Card** (component)
7. **Bed Grid Component** (visual bed layout)
8. **Patient Info Card** (component)

---

## 📦 Dependencies

### Core:
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

### State & Data:
- **Zustand**: State management
- **Axios**: HTTP client
- **Socket.io Client**: WebSocket connection

### UI & UX:
- **React Hot Toast**: Toast notifications
- **Lucide React**: Icons
- **date-fns**: Date formatting
- **html5-qrcode**: QR code scanning

### Forms:
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **@hookform/resolvers**: Form validation

### Charts:
- **Recharts**: Data visualization

---

## 🔧 Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
NODE_ENV=development
```

---

## 🎨 Styling

### Tailwind Color Palette:
- **Primary**: Blue (#0ea5e9)
- **Success**: Green (#22c55e)
- **Danger**: Red (#ef4444)
- **Warning**: Orange (#f59e0b)

### Custom Animations:
- Spinner (loading)
- Emergency alert pulse
- Pulse slow

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Development server (port 3002)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build

# Start production server
npm start
```

---

## 🧪 Testing Strategy

### Unit Tests (To be added):
- Component tests
- Hook tests
- Utility function tests

### Integration Tests:
- API integration tests
- WebSocket integration tests
- User flow tests

### E2E Tests:
- QR scanning flow
- Emergency acceptance flow
- Admission flow

---

## 📱 Responsive Design

- **Mobile**: Sidebar collapses to hamburger menu
- **Tablet**: Optimized grid layouts
- **Desktop**: Full sidebar navigation

---

## 🔐 Security

- JWT token stored in localStorage
- Automatic token injection in API requests
- HTTPS recommended for production
- CORS configured for API

---

## 🐛 Debugging

### WebSocket Issues:
1. Check SOCKET_URL in .env.local
2. Verify backend WebSocket server is running
3. Check browser console for connection logs

### API Issues:
1. Check API_URL in .env.local
2. Verify backend server is running on port 3000
3. Check network tab for request/response

---

## 📈 Performance Optimization

- Next.js automatic code splitting
- Image optimization with Next.js Image component
- Lazy loading for heavy components
- WebSocket connection pooling

---

## 🔜 Roadmap

### Phase 1 (Current):
- ✅ Dashboard layout
- ✅ Dashboard overview
- ✅ WebSocket integration
- ✅ API client
- ✅ State management

### Phase 1 (Remaining):
- QR Scanner page
- Emergency Requests page
- Bed Management page
- Admissions page

### Phase 2:
- Doctor management
- Pharmacy module
- Lab module
- Blood bank

### Phase 3:
- Billing system
- Reports & analytics
- Mobile app

---

## 📞 Support

For issues or questions, check:
1. Backend API documentation: `backend/src/modules/hms/README.md`
2. HMS Architecture: `HMS_ARCHITECTURE.md`
3. Integration Guide: `HMS_INTEGRATION_GUIDE.md`

---

**Status**: Phase 1 - Core Layout & Dashboard ✅  
**Next**: Build QR Scanner, Emergency, and Bed Management pages

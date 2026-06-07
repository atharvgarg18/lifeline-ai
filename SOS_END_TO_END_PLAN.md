# 🚨 SOS End-to-End Integration Plan

## Current System Analysis

### ✅ What's Already Built:

#### Backend (Complete):
- ✅ **API Endpoint**: `POST /api/v1/emergency/sos/trigger`
- ✅ **Required Data**:
  ```typescript
  {
    emergencyType: 'ACCIDENT' | 'MEDICAL' | 'OTHER',
    location: string,           // Address text
    latitude: number,           // Required!
    longitude: number,          // Required!
    description?: string,
    severityScore?: number,
    symptoms?: string[],
    medicalHistory?: string,
    contactName?: string,
    contactPhone?: string
  }
  ```
- ✅ **Response**: Creates EmergencySOS record
- ✅ **Features**:
  - Duplicate prevention (5 minutes)
  - Timeline tracking
  - Status management
  - Ambulance dispatch (stub - needs real implementation)

#### HMS (Complete):
- ✅ **Emergency Requests Page**: `/hms/app/dashboard/emergency/page.tsx`
- ✅ **WebSocket Integration**: Real-time updates
- ✅ **Emergency Store**: Zustand store for state management
- ✅ **Features**:
  - Shows pending requests with badge count
  - Accept/Reject workflow
  - Bed assignment
  - Doctor assignment
  - Timeline display

#### Frontend (Partially Built):
- ✅ **Emergency Page**: `app/emergency/page.tsx`
- ✅ **SOSQuickRequest Component**: Basic UI exists
- ❌ **Missing**: Real API integration
- ❌ **Missing**: Real-time location tracking
- ❌ **Missing**: Nearest hospital detection

---

## 🎯 What Needs to Be Done

### 1. **Patient App - SOS Trigger**

**Current State:**
- Component exists with UI
- Uses hardcoded data (demo only)
- No real API calls
- Manual location input

**Needs:**
- ✅ Integrate with `geolocationService` for automatic location
- ✅ Call backend API `/api/v1/emergency/sos/trigger`
- ✅ Show loading/success/error states
- ✅ Real-time tracking status
- ✅ Find nearest hospitals using OpenStreetMap
- ✅ Display estimated ambulance arrival time

---

### 2. **Hospital Selection Logic**

**Question:** How should we select which hospital receives the SOS?

**Options:**

**Option A: Auto-Select Nearest Hospital (Recommended)**
- Use OpenStreetMap to find nearest hospitals
- Auto-assign to closest available hospital
- Send to backend with `assignedHospitalId`

**Option B: Broadcast to All Nearby Hospitals**
- Send SOS to backend without hospital assignment
- Backend broadcasts to all hospitals in radius
- First hospital to accept gets the patient

**Option C: User Chooses Hospital**
- Show list of nearby hospitals
- User selects preferred hospital
- Send with selected `assignedHospitalId`

**My Recommendation:** **Option A** - Auto-select nearest hospital for speed in emergencies.

---

### 3. **Ambulance Dispatch**

**Current State:**
- Service exists but stubbed out
- `ambulanceDispatchService.dispatchNearestAmbulance()` does nothing

**Question:** What should ambulance dispatch do?

**Options:**

**Option A: Find Real Ambulances (OpenStreetMap)**
- Query OpenStreetMap for ambulance stations
- Calculate distances
- Log which station to dispatch from
- Store in database

**Option B: Dummy Data**
- Just log "Ambulance dispatched"
- Store fake ambulance ID
- Show in UI but don't actually dispatch

**Option C: External API Integration**
- Integrate with real ambulance service API
- Requires external service setup

**My Recommendation:** **Option A** - Find real ambulance stations using OpenStreetMap.

---

### 4. **WebSocket Notifications**

**Current State:**
- HMS has WebSocket client implemented
- Backend has WebSocket server (likely in main server file)

**Question:** How should HMS be notified?

**Option A: WebSocket (Real-time)**
- Backend emits event when SOS created
- HMS listens and updates UI instantly
- Requires WebSocket connection

**Option B: Polling**
- HMS polls API every few seconds
- Simpler but less efficient

**My Recommendation:** **Option A** - Use existing WebSocket infrastructure.

---

### 5. **Location Permissions**

**Question:** What if user denies location permission?

**Options:**

**Option A: Block SOS (Strict)**
- Can't trigger SOS without location
- Show error message
- Force user to enable

**Option B: Allow Manual Entry (Fallback)**
- If GPS denied, show address input
- User types location
- Use Nominatim to geocode address → lat/lng

**My Recommendation:** **Option A** - Location is critical for emergencies.

---

### 6. **Severity Score Calculation**

**Current:** Backend accepts optional `severityScore` (1-10)

**Question:** How should we calculate severity?

**Options:**

**Option A: Based on Symptoms**
```typescript
const severityMap = {
  'Unconscious / unresponsive': 10,
  'Severe chest pain': 9,
  'Heavy bleeding': 9,
  'Stroke symptoms': 9,
  'Severe allergic reaction': 8,
  'Shortness of breath': 7,
  'High fever with seizures': 7,
  'Major accident / trauma': 8,
}
```

**Option B: User-Selected**
- Let user rate their emergency (1-10)
- Subjective but simple

**Option C: Always High (9-10)**
- All SOS requests are severe
- Simplest approach

**My Recommendation:** **Option A** - Map symptoms to severity scores.

---

## 📝 Implementation Plan

### Phase 1: Patient App SOS Integration (High Priority)

**Files to Update:**
1. `components/emergency/SOSQuickRequest.tsx`
   - Integrate geolocation service
   - Add API call to trigger SOS
   - Show loading states
   - Display nearest hospital
   - Show estimated ambulance ETA

2. Create new service: `services/emergency.service.ts`
   - `triggerSOS(payload)` - Call backend API
   - `getEmergencyStatus(id)` - Poll for updates
   - `cancelEmergency(id)` - Cancel if needed

**Features:**
- ✅ Auto-detect GPS location
- ✅ Find nearest hospital from OpenStreetMap
- ✅ Calculate severity from symptoms
- ✅ Call backend API
- ✅ Show real-time status updates
- ✅ Display ambulance ETA

---

### Phase 2: Nearest Hospital Detection

**Files to Update:**
1. Update `services/places.service.ts`
   - Add `findNearestHospital(coords)` method
   - Return closest hospital with distance

2. Display in UI:
   - "Dispatching to: [Hospital Name]"
   - "Distance: [X] km away"
   - "ETA: [Y] minutes"

---

### Phase 3: Ambulance Station Detection (Optional)

**Files to Update:**
1. `backend/src/modules/emergency-sos/emergencySosService.ts`
   - Replace stub `ambulanceDispatchService`
   - Query OpenStreetMap for ambulance stations
   - Store nearest ambulance station ID

---

### Phase 4: WebSocket Real-Time Updates

**Files to Update:**
1. `backend/src/modules/emergency-sos/emergencySosService.ts`
   - Emit WebSocket event when SOS created
   - Format: `emergency:new` with emergency data

2. HMS already listens - verify it receives events

---

## ❓ Questions for You

Before I start implementing, please confirm:

### 1. **Hospital Selection:**
   - [ ] **A)** Auto-select nearest hospital (recommended)
   - [ ] **B)** Broadcast to all hospitals
   - [ ] **C)** User chooses hospital

### 2. **Ambulance Dispatch:**
   - [ ] **A)** Find real ambulance stations via OpenStreetMap
   - [ ] **B)** Use dummy data for now
   - [ ] **C)** We'll integrate real API later

### 3. **Location Permission:**
   - [ ] **A)** Block SOS if location denied (strict)
   - [ ] **B)** Allow manual address input as fallback

### 4. **Severity Score:**
   - [ ] **A)** Auto-calculate from symptoms
   - [ ] **B)** User-selected (1-10)
   - [ ] **C)** Always high (9-10)

### 5. **Hospital Assignment Field:**
   - Do you want to send `assignedHospitalId` to backend?
   - Or let backend handle hospital assignment?

### 6. **Testing:**
   - Do you have demo hospital accounts in the database?
   - Should I create seed data for testing?

---

## 🎯 My Recommended Approach

If you want me to proceed without answers, I'll use these defaults:

1. **Hospital Selection:** Auto-select nearest (Option A)
2. **Ambulance:** Find via OpenStreetMap (Option A)
3. **Location:** Block if denied (Option A - strict for safety)
4. **Severity:** Auto-calculate from symptoms (Option A)
5. **Hospital ID:** Auto-detect and send to backend
6. **Testing:** Use existing MongoDB hospitals

**Implementation Time:** ~30-45 minutes

---

## 🚀 After Implementation, You'll Have:

✅ Click "Request SOS" button  
✅ GPS auto-detects location  
✅ Finds nearest hospital (OpenStreetMap)  
✅ Finds nearest ambulance station  
✅ Sends to backend API  
✅ HMS receives real-time notification  
✅ Shows estimated arrival time  
✅ Full end-to-end working system!  

---

**Ready to proceed? Just say "yes" or answer the questions above!** 🎯

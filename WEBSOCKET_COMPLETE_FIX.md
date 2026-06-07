# 🔧 WebSocket Complete Fix

## ✅ What I Fixed

### 1. Backend Data Structure
Updated `backend/src/modules/emergency-sos/emergencySosService.ts` to send HMS-compatible data:

```typescript
const emergencyData = {
  requestId: emergency._id.toString(),
  emergencyId: emergency._id.toString(), // ✅ Added
  patientId: emergency.patientId,
  symptoms: [emergency.description], // ✅ Added array
  severity: emergency.severityScore,
  requiredBedType: 'ICU' | 'EMERGENCY' | 'GENERAL', // ✅ Added
  distance: hs.distance,
  eta: Math.ceil(hs.distance * 3),
  score: hs.score, // ✅ Added
  batchNumber: 1,
  timeoutAt: new Date(Date.now() + 120000), // ✅ Added
  createdAt: emergency.createdAt,
};
```

---

## 🧪 Testing Steps

### Step 1: Restart Backend
```bash
# Stop backend (Ctrl+C)
cd backend
npm run dev
```

**Wait for:**
```
✅ Socket.io initialized
✅ MongoDB connected
🚀 Backend running on port 3000
```

---

### Step 2: Check HMS Console

**Open HMS:** `http://localhost:3002/dashboard/emergency`

**Open Browser DevTools (F12) → Console tab**

**You MUST see:**
```
✅ Connected to WebSocket server
🏥 Hospital HOSP-001 joined room
```

**If you DON'T see these messages:**
- HMS WebSocket is not connecting
- Check HMS .env.local has NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
- Refresh HMS page (F5)
- Check backend is actually running

---

### Step 3: Trigger SOS

**With HMS console still open:**
1. Open Patient App: `http://localhost:3001/emergency`
2. Allow location
3. Select "Unconscious / unresponsive"
4. Click "Request SOS"

**Watch HMS console - should IMMEDIATELY show:**
```
🚨 New emergency request: {
  requestId: "6a24075f99d6ac4bdb5b603e",
  emergencyId: "6a24075f99d6ac4bdb5b603e",
  severity: 10,
  requiredBedType: "ICU",
  ...
}
```

**Watch HMS page - should show:**
- 🚨 Red toast notification: "New Emergency! Severity 10/10, Distance 516.4 km"
- Badge on sidebar: "Emergency Requests" shows "1"
- Emergency card in the list

---

## 🔍 Debugging

### Check 1: HMS WebSocket Connection

**In HMS browser console, run:**
```javascript
// Check if socket.io library loaded
console.log(typeof window.io);
// Should show: "function"

// Check environment variable
console.log(process.env.NEXT_PUBLIC_SOCKET_URL);
// Should show: "http://localhost:3000"

// Check hospital ID
console.log(process.env.NEXT_PUBLIC_HOSPITAL_ID);
// Should show: "HOSP-001"
```

---

### Check 2: Backend Socket.io

**In backend console, you should see:**
```
🔌 Client connected: [socket_id]
🏥 Hospital HOSP-001 joined room
```

**If you DON'T see "Client connected":**
- HMS is not connecting to backend
- Check CORS settings
- Check HMS is actually running

---

### Check 3: Event Emission

**After triggering SOS, backend should log:**
```
📡 Emitted emergency:new to hospital:HOSP-005
📡 Emitted emergency:new to hospital:HOSP-003
📡 Emitted emergency:new to hospital:HOSP-002
📡 Emitted emergency:new to hospital:HOSP-004
📡 Emitted emergency:new to hospital:HOSP-001 ← This one for our HMS
✅ WebSocket notifications sent to 5 hospitals
```

**If you see this but HMS doesn't receive:**
- Data structure mismatch (fixed now)
- Room name mismatch
- HMS not listening to correct event

---

## 🐛 Common Issues

### Issue 1: HMS Not Connecting

**Symptoms:**
- No "Connected to WebSocket server" in HMS console
- Backend doesn't show "Client connected"

**Fixes:**
1. Check HMS is running on port 3002
2. Check backend CORS includes port 3002
3. Refresh HMS page (F5)
4. Check HMS .env.local:
   ```
   NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
   NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
   ```

---

### Issue 2: Connected But No Events

**Symptoms:**
- "Connected to WebSocket server" ✅
- "Hospital HOSP-001 joined room" ✅
- Backend shows "Emitted emergency:new" ✅
- BUT HMS doesn't show emergency ❌

**Fixes:**
1. Check data structure (fixed in this update)
2. Check HMS emergency store
3. Check toast notifications aren't being blocked

---

### Issue 3: Wrong Hospital ID

**Symptoms:**
- Backend emits to hospital:HOSP-001
- But HMS uses different ID

**Fix:**
- Check HMS .env.local has `NEXT_PUBLIC_HOSPITAL_ID=HOSP-001`
- Must match one of the seeded hospitals (HOSP-001 to HOSP-005)

---

## 🎯 Expected Full Flow

### 1. Patient App:
```
User clicks "Request SOS"
  ↓
Frontend calls API
  ↓
Shows: "Emergency request sent!"
```

### 2. Backend:
```
✅ Emergency saved with ID: 6a24075f...
🏥 Finding optimal hospitals
📍 Found 5 active hospitals
📡 Emitted emergency:new to hospital:HOSP-001
📡 Emitted emergency:new to hospital:HOSP-002
📡 Emitted emergency:new to hospital:HOSP-003
📡 Emitted emergency:new to hospital:HOSP-004
📡 Emitted emergency:new to hospital:HOSP-005
✅ WebSocket notifications sent to 5 hospitals
```

### 3. HMS Console:
```
🚨 New emergency request: {
  requestId: "6a24075f...",
  severity: 10,
  requiredBedType: "ICU",
  distance: 516.4,
  eta: 1549
}
```

### 4. HMS UI:
```
[Toast] 🚨 New Emergency! Severity 10/10, Distance 516.4 km
[Sidebar Badge] Emergency Requests: 1
[Dashboard] Emergency card appears with Accept/Reject buttons
```

---

## ✅ Files Modified

1. `backend/src/modules/emergency-sos/emergencySosService.ts`
   - ✅ Added missing fields to WebSocket event data
   - ✅ Calculates `requiredBedType` based on severity
   - ✅ Includes `score`, `emergencyId`, `symptoms`, `timeoutAt`

---

## 📝 Next Steps

1. **Restart backend** (critical!)
2. **Open HMS browser console** (F12 → Console)
3. **Check for connection messages**
4. **Share screenshot of HMS console**
5. **Trigger SOS and watch both consoles**

---

**Please share HMS browser console logs so I can see exactly what's happening! 🔍**

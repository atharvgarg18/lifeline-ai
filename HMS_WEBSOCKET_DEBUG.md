# 🔍 HMS WebSocket Debug Guide

## Current Status:
- ✅ Backend emitting WebSocket events
- ❌ HMS not receiving events

---

## Debug Steps:

### 1. Check HMS Browser Console

**Open HMS in browser:** `http://localhost:3002/dashboard/emergency`

**Press F12 to open DevTools → Console tab**

**Look for:**
```
✅ Connected to WebSocket server
🏥 Hospital HOSP-001 joined room
```

**If you see:**
- ✅ Both messages → WebSocket connected, HMS joined room
- ❌ Connection error → Backend not running or CORS issue
- ❌ No messages → WebSocket not initializing

---

### 2. Check Network Tab (WebSocket)

**In DevTools:**
1. Go to **Network** tab
2. Filter by **WS** (WebSocket)
3. Look for connection to `localhost:3000`

**Check:**
- Connection status: `101 Switching Protocols` (good)
- Messages tab: Should show `2` (connection handshake)
- If you see `emergency:new` messages after triggering SOS

---

### 3. Trigger Test SOS

**With HMS console open:**
1. Go to Patient App: `http://localhost:3001/emergency`
2. Trigger SOS
3. **Immediately check HMS console**

**You should see:**
```
🚨 New emergency request: {requestId: "...", severity: 9, ...}
```

---

## Common Issues:

### Issue 1: No WebSocket Connection
**Symptom:** No console logs at all

**Fix:**
- Check HMS is on port 3002
- Check backend is running on port 3000
- Refresh HMS page (F5)

---

### Issue 2: Connected but No Events
**Symptom:** "Connected to WebSocket server" but no "New emergency request"

**Possible causes:**
1. Hospital not joining room correctly
2. Event data mismatch
3. Room name mismatch

**Debug:**
```javascript
// In HMS browser console, type:
console.log(localStorage.getItem('NEXT_PUBLIC_HOSPITAL_ID'))
// Should show: HOSP-001
```

---

### Issue 3: CORS Error
**Symptom:** "Connection error" in console

**Fix:** Check backend CORS allows port 3002:
```typescript
// backend/src/index.ts should have:
cors: {
  origin: [
    'http://localhost:3002', // ← This line
  ]
}
```

---

## Manual Test:

**In HMS browser console, paste this:**
```javascript
const socket = window.io('http://localhost:3000', {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('✅ Manual test: Connected!');
  socket.emit('hospital:join', 'HOSP-001');
});

socket.on('hospital:joined', (data) => {
  console.log('✅ Manual test: Joined room!', data);
});

socket.on('emergency:new', (data) => {
  console.log('🚨 Manual test: Emergency received!', data);
});
```

**Then trigger SOS from patient app.**

**If this works but HMS doesn't, the issue is in HMS code.**

---

## What to Share:

Please share screenshot or copy-paste of:
1. HMS browser console (F12 → Console)
2. Backend console output
3. Network tab → WS filter

This will help me identify the exact issue!

---

## Quick Fix Applied:

I've updated the backend to send the correct data structure that HMS expects:
- ✅ Added `emergencyId`
- ✅ Added `symptoms` array
- ✅ Added `requiredBedType` (ICU/EMERGENCY/GENERAL based on severity)
- ✅ Added `score` from hospital scoring
- ✅ Added `timeoutAt` timestamp

**Restart backend to apply this fix!**

---

**Next: Please share HMS browser console logs! 🔍**

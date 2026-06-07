# 🧪 Test HMS WebSocket NOW

## Changes Applied:
- ✅ Backend sends correct data structure
- ✅ HMS WebSocket hook improved with better logging
- ✅ Added `hospital:joined` listener
- ✅ Allow polling fallback (WebSocket + polling)

---

## 🔄 Restart HMS

**IMPORTANT: HMS auto-reloads, but if not, refresh the page!**

**In HMS browser (F12 → Console), you should NOW see:**
```
🔌 Connecting to: http://localhost:3000
🏥 Hospital ID: HOSP-001
✅ Connected to WebSocket server
🔑 Socket ID: [some_id]
📡 Joining hospital room: HOSP-001
✅ Hospital joined room successfully: {hospitalId: "HOSP-001", success: true}
```

---

## 🚨 Trigger SOS Again

1. **Patient App:** `http://localhost:3001/emergency`
2. Select: "Unconscious / unresponsive" (Severity 10)
3. Click: "Request SOS"

---

## 👀 Watch HMS Console

**Should see:**
```
🚨 New emergency request: {
  requestId: "...",
  emergencyId: "...",
  severity: 10,
  requiredBedType: "ICU",
  distance: 516.4,
  eta: 1549,
  score: -113.70,
  symptoms: ["Emergency: Unconscious / unresponsive"],
  ...
}
```

---

## 👀 Watch Backend Console

**Should see:**
```
🔌 Client connected: [socket_id]
🏥 Hospital HOSP-001 joined room
✅ Emergency saved with ID: ...
📡 Emitted emergency:new to hospital:HOSP-001
```

---

## ✅ Success Indicators

### HMS UI:
- 🚨 Red toast: "New Emergency! Severity 10/10, Distance 516.4 km"
- Badge on sidebar "Emergency Requests": Shows "1"
- Emergency card appears in the list
- Can see patient details
- Accept/Reject buttons active

---

## 🐛 If Still Not Working

### Check Backend Console:
Does it show "🏥 Hospital HOSP-001 joined room"?
- **YES:** HMS connected and joined → Issue is with event data
- **NO:** HMS not joining → Check HMS console logs

### Check HMS Console:
Does it show "📡 Joining hospital room: HOSP-001"?
- **YES:** HMS is sending join request → Check backend received it
- **NO:** HMS not executing join → Refresh HMS page

### Check HMS Network Tab:
1. F12 → Network tab
2. Filter: WS (WebSocket)
3. Click on the WebSocket connection
4. Go to "Messages" tab
5. Look for:
   ```
   42["hospital:join","HOSP-001"]
   ```
   This is the join request

---

## 🎯 Manual Test in HMS Console

**Paste this in HMS browser console:**
```javascript
// Get the socket instance
const testSocket = window.io('http://localhost:3000', {
  transports: ['websocket', 'polling']
});

testSocket.on('connect', () => {
  console.log('🧪 TEST: Connected!');
  testSocket.emit('hospital:join', 'HOSP-001');
});

testSocket.on('hospital:joined', (data) => {
  console.log('🧪 TEST: Joined room!', data);
});

testSocket.on('emergency:new', (data) => {
  console.log('🧪 TEST: Emergency received!', data);
  alert('Emergency received! Check console for details.');
});
```

**Then trigger SOS from patient app.**

**If this works, the issue is that the HMS React component isn't properly using the WebSocket hook.**

---

**Check HMS console NOW and share what you see! 🔍**

# 🚀 SOS System - Quick Start Guide

## ⚡ Start in 3 Steps:

### 1️⃣ Restart Backend (CRITICAL!)
```bash
# Stop current backend (Ctrl+C if running)
cd backend
npm run dev
```

**Wait for:**
```
✅ Socket.io initialized
✅ Connected to MongoDB
🚀 LifeLine AI Backend
   HTTP        : http://localhost:3000
```

---

### 2️⃣ Open HMS Dashboard
```bash
cd hms
npm run dev
```

**Open:** `http://localhost:3002/dashboard/emergency`

**Check browser console for:**
```
✅ Connected to WebSocket server
🏥 Hospital HOSP-001 joined room
```

---

### 3️⃣ Trigger SOS from Patient App
**Open:** `http://localhost:3001/emergency`

1. ✅ Allow location permission
2. ✅ Wait for location to be detected
3. ✅ Select: "Severe chest pain"
4. ✅ Click: "Request SOS"

---

## 👀 What to Watch:

### Backend Console:
```
✅ Emergency saved with ID: 66abc...
📍 Found 5 active hospitals
📡 Emitted emergency:new to hospital:HOSP-001
📡 Emitted emergency:new to hospital:HOSP-002
📡 Emitted emergency:new to hospital:HOSP-003
📡 Emitted emergency:new to hospital:HOSP-004
📡 Emitted emergency:new to hospital:HOSP-005
✅ WebSocket notifications sent to 5 hospitals
```

### HMS Dashboard:
- 🚨 Toast: "New Emergency! Severity 9/10..."
- Emergency card appears
- Can click Accept/Reject

### Patient App:
- ✅ "Emergency request sent!"
- Shows Emergency ID, Status, Priority, Severity

---

## ❌ If Something Goes Wrong:

### HMS Not Receiving Emergency:

**Check HMS browser console:**
- Missing "Connected to WebSocket server"? → Backend not running
- Missing "Hospital HOSP-001 joined room"? → Check .env.local

**Check Backend console:**
- Missing "Client connected"? → HMS not connecting
- Missing "Emitted emergency:new"? → Check global.io setup

### Location Not Detected:

**Click lock icon in address bar → Location → Allow**

---

## 🎯 Expected Result:

Patient App → Backend → **WebSocket** → HMS (in 2 seconds!)

**All systems GO! 🚀**

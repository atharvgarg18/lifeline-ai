# HMS - Complete Startup Guide

**Get the entire HMS system running in 5 minutes**

---

## ✅ Prerequisites

- Node.js 18+ installed
- MongoDB running
- Git repository cloned

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Backend Setup (2 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start backend server
npm run dev
```

Backend will run on: **http://localhost:3000**

### Step 2: Frontend (Patient App) - Optional

```bash
# In new terminal
cd hc101  # or root directory
npm run dev
```

Patient app will run on: **http://localhost:3001**

### Step 3: HMS Frontend (2 minutes)

```bash
# In new terminal
cd hms

# 1. Install dependencies
npm install

# 2. Start HMS application
npm run dev
```

HMS will run on: **http://localhost:3002**

### Step 4: Verify (1 minute)

Open browser and test:
- **Backend API**: http://localhost:3000/api/v1
- **Patient App**: http://localhost:3001
- **HMS App**: http://localhost:3002

---

## 🧪 Quick Test

### Test 1: Backend Health
```bash
curl http://localhost:3000/api/v1/health
```

### Test 2: Bed Availability
```bash
curl "http://localhost:3000/api/v1/hms/beds/availability?hospitalId=HOSP-001"
```

### Test 3: HMS Dashboard
Open: http://localhost:3002/dashboard

---

## 🗂️ Project Structure

```
hc101/
├── backend/              # Express API (port 3000)
│   └── npm run dev
│
├── app/                  # Patient App (port 3001)
│   └── npm run dev       # (from root)
│
└── hms/                  # HMS App (port 3002)
    └── npm run dev
```

---

## 🔧 Environment Variables

### Backend (.env.local)
```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lifeline-ai
QR_SECRET_KEY=your-secret-key
```

### HMS (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

---

## 📊 Default Credentials

**Hospital**: HOSP-001 (Apollo Hospital)  
**Admin**: Configure in backend (Phase 2)

---

## 🎯 Available Features

### HMS Application:
✅ Dashboard Overview  
✅ QR Code Scanner (with camera)  
✅ Emergency Requests (real-time)  
✅ Bed Management  
✅ Admissions List  
✅ Settings  

### Backend APIs:
✅ QR Validation  
✅ Quick Admission  
✅ Emergency Dispatch  
✅ Bed Management  
✅ 13 API Endpoints  

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or change port in backend
PORT=3001 npm run dev
```

### MongoDB Not Running
```bash
# Start MongoDB
mongod --dbpath /path/to/data
```

### Cannot Access Camera (QR Scanner)
- Use HTTPS (for production)
- Or allow camera in browser settings
- Works on localhost without HTTPS

### WebSocket Not Connecting
1. Verify backend is running on port 3000
2. Check SOCKET_URL in HMS .env.local
3. Check browser console for errors

---

## 📝 Next Steps

1. **Seed Data**: Create hospitals and beds
   ```bash
   cd backend
   npm run db:seed
   ```

2. **Test QR Scanner**: 
   - Navigate to http://localhost:3002/dashboard/qr-scanner
   - Click "Start Scanner"
   - Allow camera access

3. **Test Emergency Flow**:
   - Trigger emergency from patient app
   - View in HMS emergency page
   - Accept emergency with bed selection

4. **Test Bed Management**:
   - Navigate to Beds page
   - Filter by type/status
   - View bed grid

---

## 🔗 Useful URLs

| Service | URL | Port |
|---------|-----|------|
| Backend API | http://localhost:3000/api/v1 | 3000 |
| Patient App | http://localhost:3001 | 3001 |
| HMS App | http://localhost:3002 | 3002 |
| HMS Dashboard | http://localhost:3002/dashboard | 3002 |
| QR Scanner | http://localhost:3002/dashboard/qr-scanner | 3002 |
| Emergency | http://localhost:3002/dashboard/emergency | 3002 |
| Beds | http://localhost:3002/dashboard/beds | 3002 |

---

## 📚 Documentation Reference

1. **HMS_ARCHITECTURE.md** - System design
2. **HMS_IMPLEMENTATION_STATUS.md** - Backend details
3. **HMS_INTEGRATION_GUIDE.md** - Integration steps
4. **HMS_SUMMARY.md** - Complete overview
5. **HMS_FRONTEND_COMPLETE.md** - Frontend details
6. **HMS_STARTUP_GUIDE.md** - This file
7. **hms/README.md** - Frontend docs
8. **backend/src/modules/hms/README.md** - Backend docs

---

## 🎉 You're Ready!

Your HMS system is now running with:
- ✅ Backend API on port 3000
- ✅ Patient App on port 3001
- ✅ HMS App on port 3002
- ✅ WebSocket for real-time updates
- ✅ MongoDB database
- ✅ All features functional

**Start using HMS at**: http://localhost:3002

---

## 💡 Tips

- Keep all 3 terminals open (backend, patient app, HMS)
- Use browser dev tools to debug
- Check console for WebSocket messages
- Monitor backend logs for API calls
- Use MongoDB Compass to view database

---

**Happy Hospital Managing! 🏥**

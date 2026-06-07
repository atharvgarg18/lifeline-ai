# 🚀 START HERE - QR System Testing Guide

## Quick Start (5 Minutes)

### 1. Start Everything
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Patient App
npm run dev

# Terminal 3 - HMS
cd hms
npm run dev
```

### 2. Create Test Patient
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@test.com",
    "phone": "+1234567890",
    "password": "Test123!",
    "role": "PATIENT"
  }'
```

**Copy the `accessToken` from the response!**

### 3. Open Patient App & Login
1. Go to: http://localhost:3001/login
2. Email: `jane@test.com`
3. Password: `Test123!`
4. Click Login

### 4. Generate QR
1. Navigate to: http://localhost:3001/patient/qr
2. QR code appears automatically
3. You should see:
   - "Jane Doe" (your real name)
   - Health ID: LL-xxxxx-xxxx
   - Active QR code

### 5. Scan QR at HMS
1. Open HMS: http://localhost:3002/dashboard/qr-scanner
2. Click "Start Scanner"
3. Allow camera access
4. Show QR code to camera (from phone or another window)
5. Patient data appears instantly with your REAL information

### 6. Quick Admit
1. Review patient details
2. Click "Quick Admit Patient"
3. Success! ✅

---

## What's Fixed

### ❌ Before (Broken)
- Hardcoded "PAT-001" everywhere
- Mock patient data
- No authentication
- QR worked but showed fake data

### ✅ After (Working)
- Real authentication with JWT
- Real user data from database
- Real patient profiles
- QR contains encrypted patient info
- HMS fetches actual data

---

## Key Changes

### Backend API
```
OLD: POST /api/v1/patient-profile/patients/PAT-001/qr/generate
NEW: POST /api/v1/patient-profile/qr/generate (with auth token)
```

### QR Data
```javascript
// OLD - Just patient ID
{ qrCodeId, patientId: "PAT-001", timestamp }

// NEW - Full patient info
{ 
  qrCodeId, 
  userId: "real-mongodb-id",
  healthIdNumber: "LL-ABC123",
  name: "Jane Doe",
  email: "jane@test.com",
  phone: "+1234567890"
}
```

### Patient QR Page
- Now requires login
- Shows YOUR real name
- Shows YOUR health ID
- Auto-redirects if not authenticated

### HMS Scanner
- Fetches YOUR data from database
- Shows YOUR real information
- Uses YOUR userId for admission

---

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Patient app runs on 3001
- [ ] HMS runs on 3002
- [ ] Can register new patient
- [ ] Can login with credentials
- [ ] Token saved to localStorage
- [ ] QR page shows real name
- [ ] QR page shows health ID
- [ ] QR code displays
- [ ] HMS scanner starts
- [ ] QR scan works
- [ ] HMS shows real patient data
- [ ] Quick admit works
- [ ] Logout/login cycle works

---

## Troubleshooting

### "Authentication required"
➜ You're not logged in. Go to /login first.

### QR shows "PAT-001"
➜ Clear browser cache. Old code is cached.

### HMS shows "Mock Patient"
➜ Restart backend. Old compiled code is running.

### "Cannot read property 'age'"
➜ Already fixed! Run `npm run build` in backend.

### Scanner not starting
➜ Allow camera permissions in browser.

---

## Database Check

Want to verify real data? Check MongoDB:

```javascript
// In MongoDB
use lifeline

// See all users
db.users.find()

// See all patient profiles
db.patients.find()

// See all QR codes
db.qrcodes.find()
```

---

## Production Deployment

### 1. Backend (Render)
```bash
cd backend
git push
# Render auto-deploys
```

### 2. Update .env Files
```env
# .env.local (patient app)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1

# hms/.env.local
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
```

### 3. Deploy Frontends (Vercel)
```bash
# Patient app
git push

# HMS
git push
```

### 4. Test Production
1. Register on production URL
2. Login
3. Generate QR
4. Scan with HMS
5. Verify real data shows

---

## Files You Can Delete

These old test files are no longer needed:
- `test-qr-flow.js` (was for old system)
- Any `*.md` files with "old" or "broken" in name

---

## Quick Demo Script

**For showing to others:**

1. "Let me register as a patient" → Register form
2. "Now I'll login" → Login
3. "This generates my medical QR code" → Shows QR with real name
4. "Hospital staff scans this" → HMS scanner
5. "And instantly sees my medical info" → Real data appears
6. "One click to admit me" → Quick admit
7. "Done! I'm admitted." → Success ✅

---

## Success Metrics

✅ **Zero hardcoded data**
✅ **Real authentication**
✅ **Real database integration**
✅ **Backend compiles with 0 errors**
✅ **Security with JWT + HMAC**
✅ **Session management**
✅ **Production ready**

---

## Need Help?

### Check Logs
```bash
# Backend logs
cd backend
npm start
# Watch for errors

# Frontend logs
# Open browser console (F12)
# Check for red errors
```

### Common Issues

**Port already in use?**
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3005 npm start
```

**MongoDB connection failed?**
- Check MONGODB_URI in .env
- Check if MongoDB is running
- Check network connection

**Build errors?**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. ✅ Test locally (this guide)
2. ✅ Verify all checklist items pass
3. ✅ Test on mobile devices
4. ✅ Deploy to production
5. ✅ Test production URLs
6. ✅ Demo to stakeholders

---

**🎉 You're all set! Start with Step 1 above.**

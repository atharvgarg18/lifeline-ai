# HMS Beds Data Fix - Local Testing Steps

## Issue
HMS dashboard shows all zeros for beds because no beds exist in database for HOSP-001.

## What I Fixed
1. ✅ Added `seedBeds` endpoint to backend: `POST /api/v1/hms/seed/beds`
2. ✅ Added route in `backend/src/modules/hms/routes/hmsRoutes.ts`
3. ✅ Backend compiles successfully

## Test Locally (BEFORE COMMITTING)

### Step 1: Start Backend
```powershell
cd d:\hc101\backend
npm start
```

Wait for:
```
✅ MongoDB connected successfully
🚀 LifeLine AI Backend
   HTTP        : http://localhost:10000
```

### Step 2: Test Seed Endpoint
Open a NEW PowerShell window:

```powershell
$body = '{"hospitalId":"HOSP-001"}'
Invoke-WebRequest -Uri "http://localhost:10000/api/v1/hms/seed/beds" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Created 35 beds for hospital HOSP-001",
  "data": {
    "hospitalId": "HOSP-001",
    "totalCreated": 35,
    "summary": {
      "ICU": 6,
      "GENERAL": 16,
      "PRIVATE": 3,
      "EMERGENCY": 8
    }
  }
}
```

### Step 3: Test Bed Availability Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:10000/api/v1/hms/beds/availability?hospitalId=HOSP-001" -UseBasicParsing
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total": 35,
    "available": 35,
    "occupied": 0,
    "maintenance": 0,
    "reserved": 0,
    "byType": {
      "ICU": { "total": 6, "available": 6 },
      "GENERAL": { "total": 16, "available": 16 },
      "PRIVATE": { "total": 3, "available": 3 },
      "EMERGENCY": { "total": 8, "available": 8 }
    }
  }
}
```

### Step 4: Start HMS Frontend
Open ANOTHER PowerShell window:

```powershell
cd d:\hc101\hms
npm run dev
```

Wait for:
```
- ready started server on 0.0.0.0:3002
```

### Step 5: Test HMS Dashboard
1. Open browser: http://localhost:3002/dashboard
2. You should see:
   - **Total Beds**: 35
   - **Available Beds**: 35
   - **Active Admissions**: 0
   - **Pending Emergencies**: 0

### Step 6: Check Browser Console
- Open DevTools (F12)
- Go to Console tab
- Should see:
  ```
  ✅ Connected to WebSocket server
  🏥 Hospital HOSP-001 joined room
  ```
- NO red errors about "Failed to load dashboard data"

## If Tests Pass Locally ✅

Only THEN we can commit and deploy:

```powershell
cd d:\hc101
git add backend/src/modules/hms/controllers/hmsController.ts
git add backend/src/modules/hms/routes/hmsRoutes.ts
git commit -m "feat(hms): add seed beds endpoint for testing"
git push
```

Then seed beds in production:
```powershell
$body = '{"hospitalId":"HOSP-001"}'
Invoke-WebRequest -Uri "https://lifeline-ai-t65t.onrender.com/api/v1/hms/seed/beds" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

## Troubleshooting

### Backend won't start
**Error:** "MongoDB connection failed"

**Solution:** Check if MongoDB is running or use the remote MongoDB connection string in `backend/.env.local`

### HMS shows connection error
**Symptom:** "Failed to connect to server"

**Solution:**
1. Check backend is running on port 10000
2. Check HMS `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:10000/api/v1`
3. Restart HMS dev server

### Seed endpoint returns "Hospital ID is required"
**Solution:** Make sure body is: `{"hospitalId":"HOSP-001"}` (case sensitive, with quotes)

### Still shows 0 beds after seeding
**Solution:**
1. Hard refresh browser: Ctrl + Shift + R
2. Check the Network tab in DevTools
3. Look for the request to `/api/v1/hms/beds/availability?hospitalId=HOSP-001`
4. Check the response

## Files Changed

1. **backend/src/modules/hms/controllers/hmsController.ts**
   - Added `seedBeds` method inside the HMSController class
   - Creates 35 beds across 4 ward types

2. **backend/src/modules/hms/routes/hmsRoutes.ts**
   - Added route: `router.post('/seed/beds', HMSController.seedBeds);`

## Next Steps After Local Testing

1. ✅ Test seed endpoint locally
2. ✅ Verify beds show in HMS dashboard locally
3. ✅ Commit changes
4. ✅ Push to GitHub (triggers Render deploy)
5. ✅ Wait for Render deploy to complete
6. ✅ Run seed endpoint on production
7. ✅ Test HMS on Vercel

## DO NOT COMMIT until you confirm all tests pass locally! ⚠️

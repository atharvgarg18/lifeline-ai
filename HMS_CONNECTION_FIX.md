# HMS Connection Fix

## Issue
HMS dashboard showing "Failed to connect to server" errors.

## Root Cause
Dashboard was trying to access API response data incorrectly. The API returns:
```json
{
  "success": true,
  "data": {
    "total": 40,
    "available": 23,
    ...
  }
}
```

But the dashboard was trying to access `bedData.total` instead of `bedData.data.total`.

## Fixes Applied

### 1. Fixed Dashboard API Response Handling
**File:** `hms/app/dashboard/page.tsx`

**Changes:**
- Extract `data` property from API responses correctly
- Added null-safe access with optional chaining (`?.`)
- Added proper error state management
- Added retry button on connection failure
- Better loading state with message
- Error UI with helpful information

### 2. Hospital Seeding Script Fixed
**File:** `backend/src/scripts/seedHospitals.ts`

**Fixes:**
- Changed imports from `HospitalModel` to `Hospital`
- Changed imports from `BedModel` to `Bed`
- Fixed hospital data structure to match schema
- Added required `adminUser` field
- Fixed bed type from `type` to `bedType`
- Fixed bed schema to match model interface

## How to Fix Your HMS

### Step 1: Restart HMS Frontend
```bash
# Stop HMS if running (Ctrl+C in terminal)
# Then restart:
cd hms
npm run dev
```

### Step 2: Seed Hospital Data (if not already done)
```bash
cd backend
npm run db:seed:hospitals
```

Wait for the output showing hospitals created.

### Step 3: Verify Backend is Running
```bash
# Test backend health
curl http://localhost:3000/api/v1/health

# Test HMS bed availability endpoint
curl "http://localhost:3000/api/v1/hms/beds/availability?hospitalId=HOSP-001"
```

### Step 4: Clear Browser Cache
Sometimes the browser caches API errors. Try:
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Or open in incognito/private window
3. Check browser console (F12) for error messages

## Expected Behavior After Fix

### Dashboard Should Show:
- ✅ Total Beds: 40
- ✅ Available Beds: 23 (or similar number)
- ✅ Occupied Beds: 17 (or similar number)  
- ✅ Active Admissions: 0 (initially)
- ✅ Pending Emergencies: 0 (initially)

### If Connection Fails:
- ❌ Shows error UI with message
- 🔄 "Retry Connection" button appears
- 💡 Helpful message about backend URL

## Troubleshooting

### Still Seeing Connection Errors?

**1. Check if backend is running:**
```bash
netstat -ano | findstr ":3000"
```
Should show a LISTENING process on port 3000.

**2. Check if HMS is running:**
```bash
netstat -ano | findstr ":3002"
```
Should show a LISTENING process on port 3002.

**3. Test backend directly:**
Open browser and go to:
```
http://localhost:3000/api/v1/health
```
Should show: `{"success":true,"data":{...}}`

**4. Check CORS:**
Backend should allow requests from `http://localhost:3002`.
This is already configured in `backend/src/index.ts`:
```typescript
const allowedOrigins = new Set([
  ENV.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002', // HMS
]);
```

**5. Check HMS environment variables:**
File: `hms/.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

**6. Check browser console:**
Press F12, go to Console tab, look for:
- Network errors (CORS, connection refused)
- JavaScript errors
- Failed API calls

**7. Check Network tab:**
Press F12, go to Network tab:
- Look for failed requests (red)
- Check if requests are being made to correct URL
- Check response status codes

## API Endpoints Being Called

Dashboard makes these API calls on load:

1. **Bed Availability:**
   ```
   GET /api/v1/hms/beds/availability?hospitalId=HOSP-001
   ```

2. **Admissions:**
   ```
   GET /api/v1/hms/admissions?hospitalId=HOSP-001&status=ADMITTED
   ```

3. **Pending Emergencies:**
   ```
   GET /api/v1/hms/emergency/pending?hospitalId=HOSP-001
   ```

All should return: `{"success": true, "data": {...}}`

## Quick Test Commands

```bash
# Test bed availability
curl "http://localhost:3000/api/v1/hms/beds/availability?hospitalId=HOSP-001"

# Test admissions endpoint
curl "http://localhost:3000/api/v1/hms/admissions?hospitalId=HOSP-001"

# Test emergency endpoint
curl "http://localhost:3000/api/v1/hms/emergency/pending?hospitalId=HOSP-001"
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 3002 in use | Kill process: `Stop-Process -Id <PID> -Force` |
| CORS error | Check allowedOrigins in backend |
| 404 Not Found | Check route is registered in backend/src/index.ts |
| Network Error | Check backend is running on port 3000 |
| Empty data | Run hospital seeding script |
| Stale cache | Hard refresh or incognito mode |

## Success Indicators

✅ Backend console shows no errors
✅ HMS loads without red error messages  
✅ Dashboard shows bed statistics (non-zero numbers)
✅ No CORS errors in browser console
✅ Network tab shows successful 200 responses
✅ Can navigate to other pages (QR Scanner, Beds, etc.)

## Next Steps After Fix

Once dashboard loads successfully:

1. **Test QR Scanner:**
   - Go to: http://localhost:3002/dashboard/qr-scanner
   - Click "Start Scanner"
   - Allow camera access

2. **Test Bed Management:**
   - Go to: http://localhost:3002/dashboard/beds
   - Should see bed grid with 40 beds

3. **Test Emergency System:**
   - Go to: http://localhost:3002/dashboard/emergency
   - Should show "No pending requests" message

---

**Last Updated:** June 6, 2026 23:00  
**Status:** FIXED - Restart HMS to apply changes

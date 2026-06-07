# Emergency SOS End-to-End Testing Guide

## Status: Ready for Testing

The emergency requests fix has been implemented in HMS. This guide will help you verify the complete emergency SOS flow works end-to-end in production.

---

## What Was Fixed

### HMS Emergency Page (`hms/app/dashboard/emergency/page.tsx`)

**Previous Issue**: Emergency requests were not populating in the UI because:
- API was called but results were never added to the zustand store
- Store remained empty even though backend returned data

**Implemented Fix**:
1. **Store Population**: `loadPendingEmergencies()` now properly populates the store:
   ```typescript
   // Clears existing requests
   useEmergencyStore.getState().clearRequests()
   
   // Adds each fetched request to the store
   response.data.requests.forEach((request: any) => {
     useEmergencyStore.getState().addRequest(request)
   })
   ```

2. **Auto-Refresh**: Requests reload every 10 seconds automatically

3. **Manual Refresh**: Added refresh button (RefreshCw icon) in the UI header

4. **Error Handling**: Shows toast notification if loading fails

---

## End-to-End Testing Steps

### Step 1: Verify Environment Variables (Production HMS)

Deployed HMS on Vercel must have these variables set:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

**How to verify**:
1. Go to Vercel Dashboard → Your HMS Project → Settings → Environment Variables
2. Confirm both variables are set
3. If you changed them, redeploy HMS

---

### Step 2: Test Emergency SOS Creation (Main App)

You need to create emergency SOS requests that the HMS can receive.

**Option A: Use Main App UI** (http://localhost:3001/emergency or deployed version)

1. Login as a patient in the main app
2. Go to Emergency/SOS page
3. Fill out emergency form:
   - Select symptoms
   - Enter severity
   - Provide location
   - Add medical history/notes
4. Submit SOS request

**Option B: Use API Directly** (For testing without UI)

```bash
# Create a test emergency SOS request
curl -X POST https://your-backend.onrender.com/api/v1/emergency-sos/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PATIENT_TOKEN" \
  -d '{
    "symptoms": ["chest pain", "shortness of breath"],
    "severity": 9,
    "latitude": 28.6139,
    "longitude": 77.2090,
    "description": "Severe chest pain, difficulty breathing",
    "medicalHistory": "Hypertension, previous heart condition",
    "contactName": "Emergency Contact",
    "contactPhone": "+91-9999999999"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "emergencyId": "SOS-xxx",
    "status": "ACTIVE",
    "dispatchedTo": ["HOSP-001", "HOSP-002", ...],
    "message": "Emergency dispatched to 3 hospitals"
  }
}
```

---

### Step 3: Verify Backend Dispatch

The backend should automatically dispatch the emergency to nearby hospitals (including HOSP-001).

**Check Backend Logs** (Render Dashboard):
```
Emergency SOS-xxx dispatched to hospitals: HOSP-001, HOSP-002
Created 3 emergency requests
Broadcasting to hospitals via WebSocket
```

**Verify Database** (if you have MongoDB access):
```javascript
// Check emergency SOS record
db.emergencysos.find({ emergencyId: "SOS-xxx" })

// Check emergency requests sent to hospitals
db.emergencyrequests.find({ emergencyId: "SOS-xxx" })
```

Expected: You should see 1 EmergencySos record and multiple EmergencyRequest records (one per hospital).

---

### Step 4: Verify HMS Receives Requests

Open deployed HMS: https://your-hms.vercel.app/dashboard/emergency

**What You Should See**:

1. **Pending Emergencies Panel** (left side):
   - Shows count of pending requests
   - Lists each emergency with:
     - Severity badge (color-coded)
     - Required bed type
     - Distance and ETA
     - Batch number
     - Time ago

2. **Auto-Update Behavior**:
   - Page automatically refreshes every 10 seconds
   - New emergencies appear without manual refresh
   - Can also click refresh button to force update

3. **Browser Console** (F12 → Console):
   ```
   Loaded X emergency requests
   ```

**If No Requests Show Up**:
- Check browser console for errors
- Click the manual refresh button
- Verify `NEXT_PUBLIC_HOSPITAL_ID` matches your test hospital
- Check Network tab to see if API call succeeds

---

### Step 5: Test Accept/Reject Flow

Once emergency requests appear:

**Test Accept**:
1. Click on an emergency request
2. Right panel shows details:
   - Request ID, severity, symptoms
   - Distance, ETA, required bed type
   - Timeout countdown
3. Available beds load automatically
4. Select a bed from the grid
5. Click "Accept Emergency"
6. Should show success toast
7. Request disappears from list

**Test Reject**:
1. Click on an emergency request
2. Click reject button (X icon)
3. Enter rejection reason in prompt
4. Should show "Emergency rejected" toast
5. Request disappears from list

---

### Step 6: Verify WebSocket (Real-Time Updates)

The HMS should also receive real-time updates via WebSocket.

**Test WebSocket**:
1. Open HMS emergency page in one browser tab
2. Create a new SOS request from main app in another tab
3. **Expected**: New emergency should appear in HMS within seconds (no refresh needed)

**Check WebSocket Connection**:

Browser Console:
```javascript
// The HMS WebSocket should connect on page load
WebSocket connection established
Connected to room: hospital:HOSP-001
```

**If WebSocket Not Working**:
- API polling will still work (10-second refresh)
- Check if backend WebSocket endpoint is accessible
- Verify hospital ID matches

---

## Testing Checklist

- [ ] Environment variables set in Vercel HMS
- [ ] Created test emergency SOS request (main app or API)
- [ ] Backend logs show dispatch to HOSP-001
- [ ] HMS emergency page loads without errors
- [ ] Emergency requests appear in left panel
- [ ] Auto-refresh works (10 seconds)
- [ ] Manual refresh button works
- [ ] Can select request and see details
- [ ] Available beds load for selected request
- [ ] Can accept emergency (allocates bed)
- [ ] Can reject emergency (with reason)
- [ ] WebSocket real-time updates work
- [ ] Request disappears after accept/reject

---

## Common Issues and Solutions

### Issue 1: No Emergency Requests Showing

**Possible Causes**:
1. No emergency SOS created yet
2. Wrong `NEXT_PUBLIC_HOSPITAL_ID` (not matching test hospital)
3. Backend not dispatching to your hospital (too far away)

**Solutions**:
- Create test emergency with location near hospital
- Verify hospital ID in Vercel matches database
- Check backend logs to see which hospitals got the request
- Use browser Network tab to inspect API response

---

### Issue 2: "Failed to load emergency requests" Toast

**Possible Causes**:
1. Backend API URL incorrect
2. Backend not running
3. CORS issue
4. Authentication issue

**Solutions**:
- Verify `NEXT_PUBLIC_API_URL` in Vercel
- Check backend health: `GET https://your-backend.onrender.com/api/v1/health`
- Check browser console for detailed error
- Verify HMS token in localStorage: `hms_token`

---

### Issue 3: Requests Show But Can't Accept

**Possible Causes**:
1. No available beds of required type
2. Bed allocation API failing
3. Race condition (another hospital accepted first)

**Solutions**:
- Check bed availability: HMS dashboard → Beds
- Seed more beds if needed: `POST /api/v1/hms/seed/beds`
- Check backend logs for allocation errors
- Try with different bed type

---

### Issue 4: WebSocket Not Connecting

**Possible Causes**:
1. Backend WebSocket endpoint not accessible
2. Render free tier limitations
3. Firewall/proxy blocking WebSocket

**Solutions**:
- HTTP polling will still work as fallback
- Check backend supports WebSocket upgrade
- Use browser DevTools → Network → WS tab to debug
- May need to upgrade Render plan for WebSocket support

---

## Debugging Commands

### Check if backend is running:
```bash
curl https://your-backend.onrender.com/api/v1/health
```

### Get pending emergencies for your hospital:
```bash
curl "https://your-backend.onrender.com/api/v1/hms/emergency/pending?hospitalId=HOSP-001" \
  -H "Authorization: Bearer YOUR_HMS_TOKEN"
```

### Check bed availability:
```bash
curl "https://your-backend.onrender.com/api/v1/hms/beds/availability?hospitalId=HOSP-001" \
  -H "Authorization: Bearer YOUR_HMS_TOKEN"
```

### Create test emergency (replace token and backend URL):
```bash
curl -X POST https://your-backend.onrender.com/api/v1/emergency-sos/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{
    "symptoms": ["fever", "cough"],
    "severity": 7,
    "latitude": 28.6139,
    "longitude": 77.2090,
    "description": "High fever and persistent cough"
  }'
```

---

## Next Steps After Testing

Once you verify the emergency SOS flow works end-to-end:

1. **Document any issues found** during testing
2. **Create real hospital data** in production database
3. **Test with real locations** (use actual GPS coordinates)
4. **Performance test** with multiple simultaneous SOS requests
5. **Mobile testing** (emergency SOS should work on mobile devices)

---

## Production Readiness Checklist

- [ ] Emergency dispatch algorithm tested with various locations
- [ ] Bed allocation handles race conditions correctly
- [ ] Timeout mechanism works (requests expire after window)
- [ ] Batch prioritization working (hospitals ranked by score)
- [ ] WebSocket reconnection handling
- [ ] Error notifications user-friendly
- [ ] Loading states appropriate
- [ ] Mobile responsive
- [ ] Performance acceptable with 10+ simultaneous emergencies

---

## Support

If you encounter issues during testing:

1. Check browser console for errors
2. Check backend logs in Render dashboard
3. Verify all environment variables are set
4. Test API endpoints directly with curl
5. Confirm database has required data (hospitals, beds, patients)

The emergency SOS system is now fully implemented and ready for end-to-end testing!

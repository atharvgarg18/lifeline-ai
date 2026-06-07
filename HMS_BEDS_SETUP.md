# HMS Beds Setup Guide

## Problem
Your HMS dashboard shows 0 beds because no beds exist in the database for hospital HOSP-001.

## Solution
I've added a seed endpoint to create test beds. Here's how to use it:

### Method 1: Using PowerShell (Windows)

```powershell
$body = '{"hospitalId":"HOSP-001"}'
Invoke-WebRequest -Uri "https://lifeline-ai-t65t.onrender.com/api/v1/hms/seed/beds" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

### Method 2: Using cURL (if you have it)

```bash
curl -X POST https://lifeline-ai-t65t.onrender.com/api/v1/hms/seed/beds \
  -H "Content-Type: application/json" \
  -d '{"hospitalId":"HOSP-001"}'
```

### Method 3: Using Postman or Thunder Client

- URL: `POST https://lifeline-ai-t65t.onrender.com/api/v1/hms/seed/beds`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "hospitalId": "HOSP-001"
  }
  ```

## What This Creates

The seed endpoint will create 35 beds across different wards:

| Ward Type | Floor | Rooms | Beds Per Room | Total Beds | Features | Price/Day |
|-----------|-------|-------|---------------|------------|----------|-----------|
| **ICU** | 3 | 3 (ICU-1, ICU-2, ICU-3) | 2 | 6 | Ventilator, Cardiac Monitor, IV Pump | ₹5,000 |
| **General** | 2 | 4 (G-101 to G-104) | 4 | 16 | AC, TV | ₹1,500 |
| **Private** | 4 | 3 (P-401 to P-403) | 1 | 3 | AC, TV, Attached Bathroom, Sofa | ₹3,000 |
| **Emergency** | 1 | 2 (ER-1, ER-2) | 4 | 8 | Oxygen, Monitor | ₹2,000 |
| **TOTAL** | - | 12 | - | **35** | - | - |

## Expected Response

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

## After Running

1. Refresh your HMS dashboard: https://lifeline-hms.vercel.app/dashboard
2. You should now see:
   - **Total Beds**: 35
   - **Available Beds**: 35
   - **Occupied Beds**: 0
   - **Active Admissions**: 0

## Troubleshooting

### Issue: Backend sleeping (Render free tier)
**Symptom:** Request times out or takes 30+ seconds

**Solution:** Wake it up first by visiting the health endpoint:
```powershell
Invoke-WebRequest -Uri "https://lifeline-ai-t65t.onrender.com/api/v1/health" -UseBasicParsing
```
Then wait 30 seconds and try the seed endpoint again.

### Issue: "Hospital ID is required" error
**Solution:** Make sure you're sending the hospitalId in the request body:
```json
{
  "hospitalId": "HOSP-001"
}
```

### Issue: Still shows 0 beds after seeding
**Solution:** 
1. Hard refresh the HMS dashboard: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
2. Open DevTools (F12) → Network tab → try to load dashboard again
3. Check if the request to `/api/v1/hms/beds/availability?hospitalId=HOSP-001` returns the correct data
4. If it shows old data, clear browser cache and try again

## For Other Hospitals

If you want to seed beds for a different hospital, just change the hospitalId:

```powershell
$body = '{"hospitalId":"HOSP-002"}'
Invoke-WebRequest -Uri "https://lifeline-ai-t65t.onrender.com/api/v1/hms/seed/beds" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

## Notes

- Running the seed endpoint **again** will delete all existing beds for that hospital and recreate them
- This is a development/testing endpoint - in production, you'd add beds through the HMS admin interface
- All beds are created with status "AVAILABLE" by default

## Next Steps

After seeding:
1. ✅ HMS dashboard should show bed stats
2. ✅ Bed Management page should list all beds
3. ✅ Emergency requests can now be accepted (beds available)
4. ✅ QR scanner can admit patients to specific beds

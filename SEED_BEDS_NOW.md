# Seed Beds in Production

## ✅ Changes Pushed
- Added seed beds endpoint to backend
- Backend is deploying on Render now

## Wait for Deployment
Check Render dashboard: https://dashboard.render.com/

Wait for the deploy to complete (shows ✅ "Live")

## Run This Command to Seed Beds

```powershell
$body = '{"hospitalId":"HOSP-001"}'
Invoke-WebRequest -Uri "https://lifeline-ai-t65t.onrender.com/api/v1/hms/seed/beds" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
```

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

## After Seeding

1. Open HMS: https://lifeline-hms.vercel.app/dashboard
2. Hard refresh: Ctrl + Shift + R
3. You should see:
   - Total Beds: 35
   - Available Beds: 35
   - Occupied Beds: 0

## If Backend is Sleeping (Render Free Tier)

Wake it up first:
```powershell
Invoke-WebRequest -Uri "https://lifeline-ai-t65t.onrender.com/api/v1/health" -UseBasicParsing
```

Wait 30 seconds, then run the seed command.

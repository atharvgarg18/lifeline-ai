# HMS Production Setup Guide

## Problem
The deployed HMS on Vercel is not showing emergency SOS requests because it's not connected to the production backend where the emergency data exists.

## Root Cause
The HMS is currently configured with local API URLs (`http://localhost:3000`) which don't work in production.

## Solution

### Step 1: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables for **Production** environment:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
NODE_ENV=production
```

**Replace `your-backend-url.onrender.com` with your actual backend URL!**

### Step 2: Redeploy HMS

After adding environment variables, trigger a new deployment:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **⋯ (three dots)** → **Redeploy**
4. Check "Use existing Build Cache" (optional for faster deploy)
5. Click **Redeploy**

**Option B: Via Git Push**
```bash
cd hms
git add .
git commit -m "Update production environment config"
git push
```

### Step 3: Verify Connection

1. Open your deployed HMS URL
2. Open browser DevTools (F12) → **Console** tab
3. Check the network requests to ensure they're going to the production backend
4. Navigate to **Emergency Requests** page
5. Verify that emergency SOS requests are showing

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Production backend API base URL | `https://backend.onrender.com/api/v1` |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket server URL for real-time updates | `https://backend.onrender.com` |
| `NEXT_PUBLIC_HOSPITAL_ID` | Your hospital's unique ID | `HOSP-001` |
| `NODE_ENV` | Environment mode | `production` |

## Local vs Production Configuration

### Local (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

### Production (Vercel Environment Variables)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

## Testing the Setup

### 1. Test API Connection
Open browser console on deployed HMS and run:
```javascript
fetch(process.env.NEXT_PUBLIC_API_URL + '/health')
  .then(r => r.json())
  .then(console.log)
```

### 2. Test Emergency Requests
1. Create an emergency SOS from the main app
2. Check the HMS Emergency Requests page
3. Verify the request appears in real-time

### 3. Test WebSocket Connection
Open browser console and check for WebSocket connection:
```
WebSocket connection to 'wss://your-backend.onrender.com' established
```

## Common Issues

### Issue 1: Emergency Requests Not Showing
**Cause**: HMS is still using localhost API  
**Fix**: Verify environment variables are set in Vercel and redeploy

### Issue 2: CORS Errors
**Cause**: Backend not configured to allow requests from HMS domain  
**Fix**: Add HMS Vercel URL to backend CORS whitelist in `backend/src/index.ts`:
```typescript
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3002',
  'https://your-hms.vercel.app',  // Add this
  'https://your-main-app.vercel.app'
];
```

### Issue 3: WebSocket Not Connecting
**Cause**: WebSocket URL not configured or backend not supporting WSS  
**Fix**: Ensure `NEXT_PUBLIC_SOCKET_URL` is set and backend supports WebSocket connections

## Vercel Environment Variable Setup (Screenshots)

1. **Navigate to Settings**
   - Project Dashboard → Settings → Environment Variables

2. **Add Variables**
   - Click "Add New"
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend.onrender.com/api/v1`
   - Environment: Select "Production"
   - Click "Save"

3. **Repeat for all variables**

4. **Redeploy**
   - Deployments → Latest → Redeploy

## Files Created

1. `hms/.env.production` - Production environment template
2. `HMS_PRODUCTION_SETUP.md` - This guide

## Next Steps

1. ✅ Set environment variables in Vercel
2. ✅ Redeploy HMS
3. ✅ Verify API connection
4. ✅ Test emergency requests display
5. ✅ Test WebSocket real-time updates

## Status Checklist

- [ ] Environment variables set in Vercel
- [ ] HMS redeployed
- [ ] API connection verified
- [ ] Emergency requests showing
- [ ] WebSocket connection working
- [ ] Backend CORS configured
- [ ] Hospital ID matches database

## Important Notes

- **All `NEXT_PUBLIC_*` variables** are exposed to the browser (client-side)
- **Do NOT** store sensitive secrets in `NEXT_PUBLIC_*` variables
- Changes to environment variables **require a redeploy** to take effect
- Use **different hospital IDs** for different HMS deployments if testing multiple hospitals

## Support

If emergency requests still don't show after following these steps:
1. Check browser console for errors
2. Check backend logs for API requests
3. Verify emergency SOS data exists in production database
4. Ensure WebSocket is properly configured on backend

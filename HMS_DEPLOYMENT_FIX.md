# HMS Deployment Error - Quick Fix

## 🚨 Problem

HMS is deployed but showing:
- "Failed to load consultations"
- 401 Unauthorized errors
- Network/CORS errors

## 🔍 Root Cause

HMS environment variables on Vercel are not set correctly. HMS is trying to connect to:
- `https://your-backend.onrender.com` (placeholder URL)

## ✅ Solution: Set Environment Variables on Vercel

### Step 1: Go to HMS Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your HMS project
3. Click on it
4. Go to **Settings** → **Environment Variables**

### Step 2: Add These Environment Variables

Add the following variables for **Production** environment:

```
NEXT_PUBLIC_API_URL=https://lifeline-hms.onrender.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://lifeline-hms.onrender.com
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

**Replace `lifeline-hms.onrender.com` with your actual backend URL!**

### Step 3: Redeploy HMS

After adding environment variables:

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. OR: Just push a new commit to trigger redeployment

---

## 🔧 Backend: Ensure HMS Bypass is Enabled

### Step 1: Check Backend Environment Variables

Go to your backend deployment (Render/Railway/Heroku) and verify:

```
ALLOW_HMS_BYPASS=true
JWT_EXPIRY=24h
```

### Step 2: Restart Backend

After setting variables, restart the backend service.

---

## 🧪 Test After Fixing

### Test 1: HMS Loads Without Error

1. Go to HMS URL: `https://your-hms.vercel.app`
2. Navigate to `/dashboard/consultations`
3. Should see: "No Waiting Consultations" (not "Failed to load")

### Test 2: Check Browser Console

1. Open browser console (F12)
2. Should see API calls to your correct backend URL
3. Should NOT see 401 errors

### Test 3: Create Test Consultation

1. Go to patient app
2. Log in
3. Create a consultation
4. Go back to HMS
5. Should see the consultation in the list

---

## 📊 Environment Variables Reference

### HMS (Vercel)

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.com/api/v1` | Your backend API URL |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-backend.com` | Same backend, no /api/v1 |
| `NEXT_PUBLIC_HOSPITAL_ID` | `HOSP-001` | Hospital ID |

### Backend (Render/Railway)

| Variable | Value | Notes |
|----------|-------|-------|
| `ALLOW_HMS_BYPASS` | `true` | Enable HMS temp token |
| `JWT_EXPIRY` | `24h` | Prevent token expired errors |
| `MONGODB_URI` | Your MongoDB URI | Already set |
| `JWT_SECRET` | Your secret | Already set |

### Patient App (Vercel)

| Variable | Value | Notes |
|----------|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.com/api/v1` | Same backend as HMS |
| `NEXT_PUBLIC_SOCKET_URL` | `https://your-backend.com` | For Socket.io |

---

## 🔍 How to Find Your Backend URL

### If Using Render:
1. Go to https://dashboard.render.com
2. Find your backend service
3. Copy the URL (looks like: `https://your-service.onrender.com`)

### If Using Railway:
1. Go to https://railway.app/dashboard
2. Find your backend project
3. Go to Settings → Domains
4. Copy the URL (looks like: `https://your-service.railway.app`)

### If Using Heroku:
1. Go to https://dashboard.heroku.com
2. Find your app
3. Copy the URL (looks like: `https://your-app.herokuapp.com`)

---

## 🚨 Common Mistakes

### ❌ Wrong: Using localhost in production
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### ✅ Right: Using actual backend URL
```
NEXT_PUBLIC_API_URL=https://lifeline-backend.onrender.com/api/v1
```

---

### ❌ Wrong: Forgetting /api/v1 in API_URL
```
NEXT_PUBLIC_API_URL=https://lifeline-backend.onrender.com
```

### ✅ Right: Including /api/v1 in API_URL
```
NEXT_PUBLIC_API_URL=https://lifeline-backend.onrender.com/api/v1
```

---

### ❌ Wrong: Including /api/v1 in SOCKET_URL
```
NEXT_PUBLIC_SOCKET_URL=https://lifeline-backend.onrender.com/api/v1
```

### ✅ Right: No /api/v1 in SOCKET_URL
```
NEXT_PUBLIC_SOCKET_URL=https://lifeline-backend.onrender.com
```

---

## 📝 Quick Checklist

- [ ] Found actual backend URL (not placeholder)
- [ ] Set `NEXT_PUBLIC_API_URL` in HMS Vercel settings
- [ ] Set `NEXT_PUBLIC_SOCKET_URL` in HMS Vercel settings
- [ ] Set `NEXT_PUBLIC_HOSPITAL_ID=HOSP-001` in HMS Vercel settings
- [ ] Set `ALLOW_HMS_BYPASS=true` in backend settings
- [ ] Set `JWT_EXPIRY=24h` in backend settings
- [ ] Redeployed HMS after setting variables
- [ ] Restarted backend after setting variables
- [ ] Tested HMS loads without "Failed to load" error
- [ ] Verified API calls go to correct URL (browser console)
- [ ] No 401 errors in console

---

## 🎯 Expected Result After Fix

### HMS Dashboard (Consultations Page)

**Before Fix:**
```
❌ Failed to load consultations
❌ 401 Unauthorized errors in console
```

**After Fix:**
```
✅ No Waiting Consultations
   New consultation requests will appear here
✅ No errors in console
✅ API calls to: https://your-backend.com/api/v1/...
```

---

## 🆘 Still Not Working?

### Check 1: Backend is Running
```bash
curl https://your-backend.com/api/v1/health
```
Should return:
```json
{"success": true, "data": {"status": "healthy"}}
```

### Check 2: HMS Bypass is Working
```bash
curl -H "Authorization: Bearer hms_temp_token" \
  https://your-backend.com/api/v1/consultations/hospital/HOSP-001/waiting
```
Should NOT return 401.

### Check 3: Environment Variables Applied
1. Vercel: Go to Deployments → Latest → View Function Logs
2. Should see correct API URL in logs
3. If still showing old URL, redeploy

---

## 📚 Related Documentation

- `DEPLOY_NOW.md` - Complete deployment guide
- `CONSULTATION_DEPLOYMENT_GUIDE.md` - Detailed consultation setup
- `SIMPLE_DEPLOYMENT_GUIDE.md` - 3-step deployment

---

**Fix these environment variables and your HMS will work!** 🚀


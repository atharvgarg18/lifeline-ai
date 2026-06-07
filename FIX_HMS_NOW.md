# 🚨 Fix HMS Deployment - 5 Minutes

## Problem
HMS showing "Failed to load consultations" with 401 errors.

## Cause
Environment variables not set in Vercel.

---

## ✅ Fix (5 Steps)

### Step 1: Find Your Backend URL (1 min)

Go to your backend deployment and copy the URL:

- **Render**: https://dashboard.render.com → Your Service → Copy URL
- **Railway**: https://railway.app → Project → Settings → Copy Domain
- **Heroku**: https://dashboard.heroku.com → App → Copy URL

**Example**: `https://lifeline-backend.onrender.com`

---

### Step 2: Go to HMS Vercel Settings (1 min)

1. Open https://vercel.com/dashboard
2. Click your **HMS project** (not patient app!)
3. Click **Settings** tab
4. Click **Environment Variables** in left sidebar

---

### Step 3: Add 3 Environment Variables (2 min)

Click **Add New** and add these **3 variables**:

#### Variable 1:
```
Name: NEXT_PUBLIC_API_URL
Value: https://YOUR-BACKEND-URL/api/v1
Environment: Production
```

#### Variable 2:
```
Name: NEXT_PUBLIC_SOCKET_URL  
Value: https://YOUR-BACKEND-URL
Environment: Production
```

#### Variable 3:
```
Name: NEXT_PUBLIC_HOSPITAL_ID
Value: HOSP-001
Environment: Production
```

**Replace `YOUR-BACKEND-URL` with your actual backend URL from Step 1!**

**Important**: 
- Variable 1 has `/api/v1` at the end
- Variable 2 does NOT have `/api/v1`

---

### Step 4: Check Backend Environment (1 min)

Go to your backend deployment and verify these exist:

```
ALLOW_HMS_BYPASS=true
JWT_EXPIRY=24h
```

If missing, add them and restart backend.

---

### Step 5: Redeploy HMS (1 min)

Back in Vercel:

1. Go to **Deployments** tab
2. Find latest deployment
3. Click three dots (...) → **Redeploy**

**OR** just push a commit:
```bash
git commit --allow-empty -m "Trigger HMS redeploy"
git push origin master
```

---

## ✅ Test (30 seconds)

1. Go to your HMS URL: `https://your-hms.vercel.app`
2. Go to `/dashboard/consultations`
3. Should see: **"No Waiting Consultations"** (not "Failed to load")
4. Open console (F12) - should be NO 401 errors

---

## 📋 Quick Copy-Paste Template

Replace `YOUR-BACKEND-URL` with your actual URL:

```
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL/api/v1
NEXT_PUBLIC_SOCKET_URL=https://YOUR-BACKEND-URL
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

**Example with actual URL:**
```
NEXT_PUBLIC_API_URL=https://lifeline-api.onrender.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://lifeline-api.onrender.com
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

---

## 🎯 That's It!

After redeployment:
- ✅ HMS loads consultations without errors
- ✅ No 401 errors in console  
- ✅ Ready to test consultations

**Total time: 5 minutes**


# Consultation System - Troubleshooting Guide

## 🔴 Current Issue: "Failed to create consultation"

Based on the error screenshot, the consultation creation is failing. Let's diagnose step by step.

---

## 🔍 Step-by-Step Diagnosis

### Step 1: Check Backend is Running

Open a browser and go to:
```
http://localhost:3000/api/v1/health
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-...",
    "version": "1.0.0",
    "environment": "development"
  }
}
```

**If it doesn't work:**
- ❌ Backend is not running
- ✅ **Fix**: Open terminal and run:
  ```bash
  cd backend
  npm run dev
  ```

---

### Step 2: Check MongoDB Connection

Look at the backend terminal. You should see:
```
✅ MongoDB connected: lifeline_ai
```

**If you see connection error:**
- ❌ MongoDB is not running
- ✅ **Fix Option 1** (If MongoDB is installed):
  - Windows: Start MongoDB service
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`

- ✅ **Fix Option 2** (Skip MongoDB for now):
  1. Open `backend/.env.local`
  2. Add: `SKIP_DB=true`
  3. Restart backend

---

### Step 3: Check Patient Token

Open browser DevTools (F12) → Console → Type:
```javascript
localStorage.getItem('ll_token')
localStorage.getItem('ll_user')
```

**Expected:**
- `ll_token`: Should show a long string (JWT token)
- `ll_user`: Should show JSON with user data

**If null or undefined:**
- ❌ Patient is not logged in
- ✅ **Fix**: 
  1. Go to http://localhost:3001/login
  2. Log in with your credentials
  3. Then try creating consultation again

---

### Step 4: Check API URL

Open browser DevTools → Console → Type:
```javascript
process.env.NEXT_PUBLIC_API_URL
```

**Expected:**
```
http://localhost:3000/api/v1
```

**If undefined:**
- ❌ Environment variable not set
- ✅ **Fix**:
  1. Check `.env.local` file exists in root
  2. Should contain: `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`
  3. Restart frontend: Stop (Ctrl+C) and run `npm run dev` again

---

### Step 5: Test API Directly

Open terminal and run:
```bash
curl -X POST http://localhost:3000/api/v1/consultations/create ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN_HERE" ^
  -d "{\"patientId\":\"TEST123\",\"patientName\":\"Test Patient\",\"hospitalId\":\"HOSP-001\",\"type\":\"VIDEO\"}"
```

Replace `YOUR_TOKEN_HERE` with your actual token from Step 3.

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "consultationId": "CONSULT-1234567890",
    "roomId": "...",
    "patientId": "TEST123",
    ...
  }
}
```

**If you get 401 Unauthorized:**
- ❌ Token is invalid or expired
- ✅ **Fix**: Log out and log in again

**If you get 500 Internal Server Error:**
- ❌ Backend has an error (probably MongoDB)
- ✅ **Fix**: Check backend console for error details

---

### Step 6: Check Network Tab

1. Open DevTools → Network tab
2. Try creating consultation
3. Look for the POST request to `/api/v1/consultations/create`
4. Click on it and check:
   - **Status**: Should be 201 (Created)
   - **Response**: Should have `success: true`

**Common Issues:**

#### Status 401 (Unauthorized)
**Problem**: Token is missing or invalid
**Fix**: 
1. Check `ll_token` in localStorage
2. If missing, log in again
3. If present but still 401, token might be expired - log in again

#### Status 400 (Bad Request)
**Problem**: Missing required fields
**Fix**: Check the error message in Response tab

#### Status 404 (Not Found)
**Problem**: Route doesn't exist or backend not running
**Fix**: 
1. Ensure backend is running
2. Check `/api/v1/health` endpoint works
3. Restart backend if needed

#### Status 500 (Internal Server Error)
**Problem**: Backend error (likely MongoDB)
**Fix**: Check backend console for error details

---

## 🛠️ Quick Fixes

### Fix 1: Restart Everything
```bash
# Terminal 1: Stop backend (Ctrl+C), then:
cd backend
npm run dev

# Terminal 2: Stop frontend (Ctrl+C), then:
npm run dev

# Terminal 3: Stop HMS (Ctrl+C), then:
cd hms
npm run dev
```

### Fix 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the reload button
3. Click "Empty Cache and Hard Reload"
4. Or press Ctrl+Shift+R

### Fix 3: Check All Services
```bash
# Check backend
curl http://localhost:3000/api/v1/health

# Check frontend
# Browser: http://localhost:3001

# Check HMS
# Browser: http://localhost:3002
```

### Fix 4: Temporary Skip MongoDB
If MongoDB is causing issues, you can temporarily skip it:

1. Edit `backend/.env.local`:
   ```
   SKIP_DB=true
   ```

2. Restart backend

**Note**: Consultations won't be saved, but the flow will work for testing.

---

## 🔧 Common Error Messages

### "Failed to create consultation"
**Causes:**
1. Backend not running
2. MongoDB not connected
3. Invalid token
4. Missing environment variables

**Debug:**
1. Check backend terminal for errors
2. Check browser Network tab
3. Check browser Console tab

### "Please log in to start a consultation"
**Causes:**
1. No `ll_token` in localStorage
2. No `ll_user` in localStorage

**Fix:**
1. Go to login page
2. Log in with credentials
3. Try again

### "Network Error" or "Failed to fetch"
**Causes:**
1. Backend not running
2. Wrong API URL
3. CORS issue

**Fix:**
1. Start backend: `cd backend && npm run dev`
2. Check `.env.local` has correct API URL
3. Check backend CORS settings

---

## 📋 Checklist Before Testing

- [ ] Backend running (`http://localhost:3000/api/v1/health` works)
- [ ] MongoDB connected (or SKIP_DB=true)
- [ ] Frontend running (`http://localhost:3001`)
- [ ] HMS running (`http://localhost:3002`)
- [ ] Patient logged in (has `ll_token` in localStorage)
- [ ] `.env.local` file exists with API URL
- [ ] Browser cache cleared (Ctrl+Shift+R)

---

## 🎯 Most Likely Causes

Based on the error "Failed to create consultation", the most likely causes are:

1. **Backend not running** (90% probability)
   - Fix: `cd backend && npm run dev`

2. **MongoDB not connected** (5% probability)
   - Fix: Add `SKIP_DB=true` to `backend/.env.local`

3. **Invalid/missing token** (3% probability)
   - Fix: Log out and log in again

4. **Wrong API URL** (2% probability)
   - Fix: Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1`

---

## 📞 Next Steps

1. **Follow Step 1-6** above in order
2. **Note which step fails** 
3. **Apply the fix** for that step
4. **Try creating consultation again**

If still not working after all steps, please share:
- Backend terminal output
- Browser Console errors
- Browser Network tab (failed request details)

---

## 🚀 Expected Working Flow

```
1. Backend running ✅
   ↓
2. MongoDB connected ✅
   ↓
3. Frontend running ✅
   ↓
4. Patient logged in ✅
   ↓
5. Click "Start Consultation" ✅
   ↓
6. API call to backend ✅
   ↓
7. Consultation created in MongoDB ✅
   ↓
8. Redirect to consultation room ✅
   ↓
9. Socket.io connects ✅
   ↓
10. Waiting for doctor ✅
```

**Any step fails = error "Failed to create consultation"**

---

**Start with Step 1** and work your way through!

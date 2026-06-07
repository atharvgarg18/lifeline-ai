# 🚨 Fix HMS 401 Error - Backend Environment Variable Missing

## Problem

HMS showing:
```
❌ Failed to load consultations
❌ 401 Unauthorized
❌ Error: 127.977xfyfy7n5dm4jfc.js:1
```

## Root Cause

**The backend environment variable `ALLOW_HMS_BYPASS` is NOT set to `true`**

This causes the backend to reject `hms_temp_token`, resulting in 401 errors.

---

## ✅ Fix (3 Steps - 5 Minutes)

### Step 1: Go to Backend Deployment Settings

#### If Using Render:
1. Go to https://dashboard.render.com
2. Click your backend service
3. Go to **Environment** tab
4. Click **Add Environment Variable**

#### If Using Railway:
1. Go to https://railway.app/dashboard
2. Click your backend project
3. Go to **Variables** tab
4. Click **+ New Variable**

#### If Using Heroku:
1. Go to https://dashboard.heroku.com
2. Click your app
3. Go to **Settings** tab
4. Click **Reveal Config Vars**

---

### Step 2: Add Environment Variable

Add this EXACT variable:

```
Name:  ALLOW_HMS_BYPASS
Value: true
```

**IMPORTANT:** 
- Name must be EXACTLY `ALLOW_HMS_BYPASS` (case-sensitive)
- Value must be exactly `true` (lowercase)
- No quotes, no spaces

Also add this while you're there (prevents token expired errors):

```
Name:  JWT_EXPIRY
Value: 24h
```

---

### Step 3: Restart Backend

After adding variables:

- **Render:** Service will auto-restart
- **Railway:** Click **Restart** or redeploy
- **Heroku:** Click **More** → **Restart all dynos**

Wait 1-2 minutes for restart to complete.

---

## 🧪 Test the Fix

### Option 1: Use Test Page

1. Open `test-hms-auth.html` in your browser
2. Enter your backend URL (e.g., `https://your-backend.onrender.com`)
3. Click "Test HMS Temp Token"
4. Should see ✅ "HMS Bypass Working!"

### Option 2: Browser Console

1. Go to your deployed HMS: `https://your-hms.vercel.app`
2. Open browser console (F12)
3. Run this:

```javascript
fetch('https://your-backend-url.com/api/v1/consultations/hospital/HOSP-001/waiting', {
  headers: { 'Authorization': 'Bearer hms_temp_token' }
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.log('❌ Error:', e))
```

Replace `your-backend-url.com` with your actual backend URL.

**Success:** Returns consultations data (even if empty array)  
**Failure:** Returns 401 error

---

## 🔍 Why This Happens

### Backend Code (from `backend/src/middleware/auth.ts`):

```typescript
const allowHMSBypass = process.env.ALLOW_HMS_BYPASS === 'true' || ENV.IS_DEV;

if (allowHMSBypass && token === 'hms_temp_token') {
  req.user = {
    id: 'HMS-TEMP-USER',
    email: 'hms@hospital.com',
    role: 'DOCTOR',
    // ...
  };
  next();
  return;
}
```

**Without `ALLOW_HMS_BYPASS=true`:**
- `allowHMSBypass` is `false` in production
- `hms_temp_token` is not accepted
- Returns 401 Unauthorized

**With `ALLOW_HMS_BYPASS=true`:**
- `allowHMSBypass` is `true`
- `hms_temp_token` is accepted  
- HMS can access consultation routes

---

## 📊 Before vs After

### Before (ALLOW_HMS_BYPASS not set):

**HMS Console:**
```
❌ 401 (Unauthorized)
❌ Failed to load consultations
❌ Error: Authentication token has expired
```

**Backend logs:**
```
ALLOW_HMS_BYPASS: undefined
allowHMSBypass: false
Token 'hms_temp_token' rejected
```

### After (ALLOW_HMS_BYPASS=true):

**HMS Console:**
```
✅ 200 (OK)
✅ Consultations loaded
✅ No errors
```

**Backend logs:**
```
ALLOW_HMS_BYPASS: true
allowHMSBypass: true
Token 'hms_temp_token' accepted
```

---

## 🎯 Complete Backend Environment Variables

Here's what your backend should have:

### Required (Already Set):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
```

### Add These Now:
```
ALLOW_HMS_BYPASS=true
JWT_EXPIRY=24h
```

### Optional (Nice to Have):
```
FRONTEND_URL=https://your-patient-app.vercel.app
```

---

## 🚨 Common Mistakes

### ❌ Wrong Values:

```
ALLOW_HMS_BYPASS=True    # ❌ Capital T
ALLOW_HMS_BYPASS="true"  # ❌ Has quotes
ALLOW_HMS_BYPASS=1       # ❌ Not a boolean string
ALLOW_HMS_BYPASS= true   # ❌ Has space
```

### ✅ Correct Value:

```
ALLOW_HMS_BYPASS=true    # ✅ Exactly this
```

---

## 🔐 Security Note

**Q: Is HMS bypass secure?**

**For Hackathon/Demo:** ✅ Yes, perfectly fine
- Gets HMS working immediately
- No setup needed
- Perfect for demo

**For Production Later:** You can disable it:
1. Set `ALLOW_HMS_BYPASS=false`
2. Implement HMS login page
3. Register HMS users with `DOCTOR` role
4. HMS users log in with real JWT tokens

---

## ✅ Success Checklist

After fixing:

- [ ] Added `ALLOW_HMS_BYPASS=true` to backend
- [ ] Added `JWT_EXPIRY=24h` to backend
- [ ] Restarted backend service
- [ ] Waited 1-2 minutes for restart
- [ ] Tested with `test-hms-auth.html` → Shows "✅ HMS Bypass Working!"
- [ ] Went to HMS `/dashboard/consultations` → Shows "No Waiting Consultations" (not "Failed to load")
- [ ] Browser console shows no 401 errors
- [ ] API calls show 200 OK responses

---

## 🆘 Still Not Working?

### Check 1: Variable Name is Exact
```bash
# Should be EXACTLY this (case-sensitive):
ALLOW_HMS_BYPASS

# NOT these:
allow_hms_bypass     # ❌ lowercase
ALLOW_HMS_BYPA SS    # ❌ space
AllowHMSBypass       # ❌ camelCase
```

### Check 2: Value is Exact
```bash
# Should be EXACTLY:
true

# NOT:
True    # ❌
TRUE    # ❌
"true"  # ❌
yes     # ❌
1       # ❌
```

### Check 3: Backend Restarted
After adding variables, you MUST restart the backend. New variables don't apply until restart.

### Check 4: Backend Logs
Check backend logs for:
```
[STARTUP] ALLOW_HMS_BYPASS: true
```

If you see `undefined` or `false`, the variable isn't set correctly.

---

## 📚 Related Files

- `test-hms-auth.html` - Test HMS authentication
- `backend/src/middleware/auth.ts` - Authentication code
- `backend/src/config/env.ts` - Environment variable configuration
- `SIMPLE_DEPLOYMENT_GUIDE.md` - Deployment instructions

---

**After setting `ALLOW_HMS_BYPASS=true`, HMS will work immediately!** 🚀


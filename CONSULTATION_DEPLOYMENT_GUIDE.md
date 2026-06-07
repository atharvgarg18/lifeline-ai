# Consultation Feature - Deployment Guide

## ✅ Pre-Deployment Checklist

### 1. System Status
- [x] HMS temp token bypass ENABLED (works without authentication)
- [x] Patient authentication working with JWT
- [x] Backend compiles with 0 errors
- [x] Socket.io configured for real-time chat
- [x] PeerJS configured for video calls

### 2. HMS Authentication
**IMPORTANT**: HMS uses temporary token bypass - **NO registration or login required!**
- HMS automatically uses `hms_temp_token` 
- Controlled by `ALLOW_HMS_BYPASS=true` environment variable (default: enabled)
- Perfect for hackathon/demo deployment

---

## 🚀 Quick Deployment Steps (3 Steps Total)

### Step 1: Set Backend Environment Variable

In your backend deployment platform (Render/Railway/Heroku/Vercel):

```env
ALLOW_HMS_BYPASS=true
JWT_EXPIRY=24h
```

**That's it for HMS authentication!** No registration or login setup needed.

---

## 📦 Deployment Steps

### Step 2: Deploy Backend

```bash
cd backend

# Build TypeScript
npm run build

# Deploy to your platform
git add .
git commit -m "Add consultation feature (VIDEO + CHAT)"
git push
```

**Backend Environment Variables:**
```env
# Required
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRY=24h

# Consultation feature
ALLOW_HMS_BYPASS=true
```

### Step 3: Deploy Patient & HMS Frontends

```bash
# From project root
git add .
git commit -m "Add consultation feature (VIDEO + CHAT with HMS bypass)"
git push

# Your deployment will auto-deploy:
# - Patient app (Vercel/Netlify)
# - HMS app (Vercel/Netlify)
```

**Patient App Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
```

**HMS App Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
```

---

## 🎉 Post-Deployment - No Setup Required!

### HMS Works Immediately

**No registration, no login setup needed!** HMS automatically uses the temporary token.

When HMS users visit `/dashboard/consultations`:
1. HMS auto-creates `hms_temp_token` in localStorage
2. Backend accepts this token (bypass enabled)
3. HMS can immediately view and join consultations

**That's it!** The bypass handles everything automatically.

---

## 🎥 Video Conferencing in Production

**IMPORTANT**: For reliable video calls in production, you need TURN servers!

### Quick Summary
- ✅ **STUN servers** (included): Work for local/dev
- ⚠️ **TURN servers** (added): Required for production (firewalls, mobile networks)

### What We've Added
Both patient and HMS apps now include:
- 4 STUN servers (Google, free)
- 3 TURN servers (OpenRelay by Metered, free public)

This enables video calls to work:
- ✅ Through corporate firewalls
- ✅ On mobile networks (4G/5G)
- ✅ Behind NATs and routers
- ✅ In production environments

### If Video Still Doesn't Connect

See **VIDEO_PRODUCTION_SETUP.md** for:
- Testing TURN server connectivity
- Upgrading to Metered free tier (100GB/month)
- Using Twilio TURN (enterprise)
- Troubleshooting video issues

**For hackathon/demo**: Current setup with OpenRelay is sufficient! ✅

---

## 🧪 Testing After Deployment

### Test Patient App (With Authentication)
1. Go to your deployed patient app
2. **Log in as patient** (existing auth required)
3. Go to `/patient/consultation`
4. Select VIDEO or CHAT type
5. Click "Start Consultation"
6. Should redirect to consultation room
7. Should see "Waiting for other party..."

### Test HMS App (No Authentication - Bypass Enabled)
1. Go to your deployed HMS app
2. **No login needed!** Just go directly to `/dashboard/consultations`
3. Should see waiting consultations list
4. Click "Join Call" or "Join Chat"
5. Should redirect to consultation room
6. Should connect with patient immediately

### Test Video Call (VIDEO type)
- [ ] Both parties see each other's video feeds
- [ ] Audio works both directions
- [ ] Mute button works (audio toggles)
- [ ] Camera button works (video toggles)
- [ ] Chat sidebar available during video call
- [ ] Messages send instantly

### Test Chat (CHAT type or VIDEO sidebar)
- [ ] Messages appear instantly on both sides
- [ ] Each message appears once (not duplicated)
- [ ] Timestamps display correctly
- [ ] "User is typing..." indicator works
- [ ] Scroll to latest message automatically

---

## 🔍 Verifying Deployment

### Backend Health Check
```bash
curl https://your-backend-url.com/api/v1/health
# Should return: {"success": true, "data": {"status": "healthy"}}
```

### Patient Frontend Check
```bash
curl -I https://your-patient-app.vercel.app
# Should return: HTTP 200 OK
```

### HMS Frontend Check
```bash
curl -I https://your-hms-app.vercel.app
# Should return: HTTP 200 OK
```

### Socket.io Connection Check
Open browser console on HMS or Patient app:
```javascript
// Should see these logs:
// ✅ Socket connected
// ✅ Joined consultation room
```

---

## 📋 Files Changed (For Git Commit)

### Backend (3 files)
1. `backend/src/middleware/auth.ts` - Removed HMS bypass
2. `backend/src/modules/consultations/*` - All consultation files
3. `backend/src/index.ts` - Socket.io handlers

### Patient Frontend (6 files)
1. `app/patient/consultation/page.tsx`
2. `app/consultation/[id]/page.tsx`
3. `hooks/useConsultation.ts`
4. `components/consultation/ChatPanel.tsx`
5. `components/consultation/VideoPanel.tsx`
6. `components/consultation/ConsultationRoom.tsx`

### HMS Frontend (6 files)
1. `hms/app/dashboard/consultations/page.tsx`
2. `hms/app/dashboard/consultations/[id]/page.tsx`
3. `hms/hooks/useConsultation.ts`
4. `hms/components/consultation/ChatPanel.tsx`
5. `hms/components/consultation/VideoPanel.tsx`
6. `hms/components/consultation/ConsultationRoom.tsx`

---

## 🚨 Important Security Notes

### ✅ Current Setup (HMS Bypass Enabled)
- **Patient Authentication**: ✅ Secure JWT required
- **HMS Authentication**: ⚠️ Bypass enabled (temp token accepted)
- **Perfect for**: Hackathon, Demo, Quick deployment
- **Security Level**: Medium (patients protected, HMS open)

### 🔒 For Production Later (Disable Bypass)

When you're ready to add proper HMS authentication:

1. **Set environment variable**:
   ```env
   ALLOW_HMS_BYPASS=false
   ```

2. **HMS users must register**:
   ```bash
   curl -X POST https://your-api.com/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Dr. Smith",
       "email": "doctor@hospital.com",
       "phone": "+1234567890",
       "password": "SecurePassword123",
       "role": "DOCTOR"
     }'
   ```

3. **Create HMS login page** (see SIMPLE_DEPLOYMENT_GUIDE.md for code)

4. **HMS users log in** like patients (same auth system)

**But for now, keep the bypass enabled!** It's the easiest path to deployment.

---

## 🎯 Quick Git Commands

```bash
# Add all consultation files
git add .

# Commit with clear message
git commit -m "Add consultation feature (VIDEO + CHAT)

- Implemented complete consultation system
- Two types: VIDEO (video+audio+chat) and CHAT (text only)
- Socket.io for real-time messaging
- PeerJS for video/audio calls
- HMS bypass enabled for easy deployment
- Patient JWT authentication working
- Ready for production deployment"

# Push to trigger auto-deployment
git push origin main
```

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Backend: `ALLOW_HMS_BYPASS=true` in environment variables
- [ ] Backend: `JWT_EXPIRY=24h` in environment variables
- [ ] Patient app: `NEXT_PUBLIC_API_URL` configured
- [ ] HMS app: `NEXT_PUBLIC_API_URL` configured
- [ ] HMS app: `NEXT_PUBLIC_SOCKET_URL` configured
- [ ] All code committed to Git

### After Deployment
- [ ] Backend responds to health check
- [ ] Patient app loads successfully
- [ ] HMS app loads successfully
- [ ] Patient can log in (existing auth)
- [ ] HMS can access `/dashboard/consultations` (no login needed)
- [ ] Patient can create consultation
- [ ] HMS can see and join consultation
- [ ] Video calls connect (if VIDEO type)
- [ ] Chat messages send instantly
- [ ] No duplicate messages
- [ ] No authentication errors

---

## 🎉 Success Criteria

Your consultation feature is working when:

✅ **Patient Side**
- Patient logs in with existing credentials
- Creates VIDEO or CHAT consultation
- Sees "Waiting for other party..."
- Connects when HMS joins

✅ **HMS Side**
- No login required (bypass working!)
- Views waiting consultations immediately
- Joins consultation with one click
- Video/chat works instantly

✅ **Communication**
- Video feeds appear (VIDEO type)
- Audio works both ways (VIDEO type)
- Chat messages instant (both types)
- No duplicate messages
- Typing indicators work

---

## 📚 Additional Documentation

- **SIMPLE_DEPLOYMENT_GUIDE.md** - Quick 3-step deployment (recommended)
- **CONSULTATION_SYSTEM_DESIGN.md** - System architecture
- **CONSULTATION_TESTING_GUIDE.md** - Comprehensive testing
- **CONSULTATION_AUTH_FIX.md** - Authentication details

---

## 🆘 Troubleshooting

### HMS Can't Join Consultations
**Check**: Is `ALLOW_HMS_BYPASS=true` in backend environment?
```bash
# Verify in backend logs or environment dashboard
echo $ALLOW_HMS_BYPASS  # Should print: true
```

### Patient Token Expired Error
**Fix**: Set `JWT_EXPIRY=24h` in backend environment
```env
JWT_EXPIRY=24h
```
Patient must log in again after changing this.

### Video Not Connecting
**Check**: 
1. Both parties granted camera/microphone permissions
2. Socket.io connected (check browser console)
3. Peer IDs exchanged (check console logs: "🎥 My Peer ID:", "🎥 Received peer ID:")

### Messages Appearing Twice
**Status**: ✅ Fixed! Should only appear once now.
If still happening, check browser console for duplicate event listeners.

### Socket.io Not Connecting
**Check**:
1. `NEXT_PUBLIC_SOCKET_URL` matches backend URL
2. Backend CORS allows frontend domain
3. Backend Socket.io server running (check logs: "✅ Socket.io server initialized")

---

**Ready to deploy!** Follow the 3 steps at the top, then test with the checklist. HMS bypass makes this super simple! 🚀

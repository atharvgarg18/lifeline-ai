# Consultation System - Testing Guide

## 🧪 Quick Testing Steps

### Prerequisites
1. ✅ All dependencies installed (peerjs, socket.io-client, date-fns)
2. ✅ Backend compiled successfully (0 errors)
3. ✅ MongoDB running
4. ✅ Environment variables set

---

## 🚀 Start All Services

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
Wait for: `🚀 LifeLine AI Backend` and `✅ Socket.io initialized`

### Terminal 2: Patient App
```bash
npm run dev
```
Wait for: `Ready on http://localhost:3001`

### Terminal 3: HMS App
```bash
cd hms
npm run dev
```
Wait for: `Ready on http://localhost:3002`

---

## 🧪 Test Scenario 1: CHAT Consultation (Simpler - Test First!)

### Step 1: Create Consultation (Patient Side)
1. Open browser: `http://localhost:3001`
2. **Login as patient** (if not logged in)
3. Navigate to: `http://localhost:3001/patient/consultation`
4. **Select**: "Chat Only" option
5. **Click**: "Start Chat Consultation"
6. You should be redirected to `/consultation/CONSULT-[timestamp]`
7. **Wait** for "Waiting for other party..." message

**Expected**:
- ✅ Page loads without errors
- ✅ Console shows: "✅ Socket connected"
- ✅ Console shows: "✅ Joined consultation room: [roomId]"
- ✅ Connection indicator shows green dot

### Step 2: Join Consultation (Doctor Side)
1. Open NEW BROWSER TAB: `http://localhost:3002`
2. **Login to HMS** (if not logged in)
3. Navigate to: `http://localhost:3002/dashboard/consultations`
4. You should see **1 waiting consultation** with patient name
5. **Click**: "Join Chat" button
6. You should be redirected to consultation room

**Expected**:
- ✅ Doctor sees the waiting consultation in the list
- ✅ Type shows "CHAT" badge
- ✅ Timestamp shows "X minutes ago"
- ✅ Clicking "Join Chat" redirects to room

### Step 3: Test Chat Functionality
**In Patient Tab**:
1. You should see: "Connected with Dr. Smith" (or doctor name)
2. **Type** a message: "Hello doctor, I have a headache"
3. **Press** Enter or click Send
4. Message appears on your side (blue bubble on right)

**In Doctor Tab**:
1. Message appears instantly (gray bubble on left)
2. Shows patient name above message
3. **Type reply**: "I can help you with that"
4. **Press** Enter
5. Message appears on doctor side (blue bubble on right)

**Back in Patient Tab**:
1. Doctor's message appears instantly
2. Shows doctor name above message

**Expected**:
- ✅ Messages appear in real-time (< 1 second)
- ✅ Timestamps show "just now"
- ✅ Own messages on right (blue), other's on left (gray)
- ✅ No errors in console

### Step 4: Test Typing Indicator (Optional)
**In Patient Tab**:
1. Start typing (don't send yet)
2. **Watch Doctor Tab**: Should show typing indicator (3 bouncing dots)
3. Stop typing for 2 seconds
4. Typing indicator should disappear

**In Doctor Tab**:
1. Start typing
2. **Watch Patient Tab**: Should show typing indicator
3. Stop typing
4. Indicator disappears

### Step 5: End Consultation
**Either Tab**:
1. **Click**: "End Consultation" button
2. Should show "Ending..."
3. **Redirects**:
   - Patient → `/patient/dashboard`
   - Doctor → `/dashboard/consultations`

**Expected**:
- ✅ Consultation ends for both parties
- ✅ Both users redirected
- ✅ No errors in console

---

## 🧪 Test Scenario 2: VIDEO Consultation (After CHAT works!)

### Step 1: Create Video Consultation (Patient Side)
1. Navigate to: `http://localhost:3001/patient/consultation`
2. **Select**: "Video Consultation" option (should be default)
3. **Click**: "Start Video Consultation"
4. **Browser will ask**: Camera and microphone permission
5. **Click**: Allow
6. You should see your local video in small PiP window

**Expected**:
- ✅ Browser asks for permissions
- ✅ Local video shows (you can see yourself)
- ✅ Console shows: "🎥 My Peer ID: [some-id]"
- ✅ Waiting for other party

### Step 2: Join Video Call (Doctor Side)
1. Go to HMS consultations: `http://localhost:3002/dashboard/consultations`
2. Should see **1 waiting consultation** (VIDEO type)
3. **Click**: "Join Call"
4. **Browser asks**: Camera/mic permission
5. **Click**: Allow

**Expected**:
- ✅ Doctor's local video appears
- ✅ Console shows: "🎥 My Peer ID: [some-id]"
- ✅ Console shows: "📞 Calling peer: [other-id]"

### Step 3: Test Video Connection
**Wait 2-5 seconds for connection**

**In Patient Tab**:
1. Main screen should show **doctor's video** (full screen)
2. Small window (top-right) shows **your video**
3. Bottom controls show: Mute, Camera, End buttons
4. Status shows: "Connected with Dr. Smith"

**In Doctor Tab**:
1. Main screen shows **patient's video**
2. Small window shows **your video**
3. Controls visible

**Expected**:
- ✅ Both can see each other's video
- ✅ Video is smooth (not laggy)
- ✅ Console shows: "📺 Received remote stream"
- ✅ Audio works (ask each other "can you hear me?")

### Step 4: Test Video Controls
**Click Mute Button**:
- ✅ Icon changes to MicOff
- ✅ Status shows "🎤 Audio off"
- ✅ Other party can't hear you

**Click Camera Button**:
- ✅ Icon changes to VideoOff
- ✅ Your video turns black (for you)
- ✅ Other party sees black screen with VideoOff icon
- ✅ Status shows "📹 Video off"

**Click again to turn back on**

### Step 5: Test Chat in Video Call
**In Patient Tab**:
1. **Click**: "Show Chat" button (top-right)
2. Chat sidebar appears (right side)
3. **Type** a message: "Can you see my screen?"
4. **Send** it

**In Doctor Tab**:
1. If chat not open, **click** "Show Chat"
2. Message appears instantly
3. **Reply**: "Yes, I can see you clearly"

**Expected**:
- ✅ Chat works alongside video
- ✅ Video continues playing while chatting
- ✅ Can hide/show chat without affecting video

### Step 6: End Video Call
**Either Side**:
1. **Click**: "End Consultation"
2. Video streams stop
3. Camera light turns off
4. Both redirected

**Expected**:
- ✅ Video properly stops
- ✅ Camera/mic released (light turns off)
- ✅ Clean redirect
- ✅ No lingering connections

---

## 🐛 Troubleshooting

### Issue: "Socket disconnected"
**Cause**: Backend not running or CORS issue
**Fix**:
1. Check backend is running: `http://localhost:3000/api/v1/health`
2. Check backend console for CORS errors
3. Verify `FRONTEND_URL` in backend `.env.local`

### Issue: "Not authorized" or 401 errors
**Cause**: No auth token in localStorage
**Fix**:
1. Open browser DevTools → Application → Local Storage
2. Check for:
   - Patient: `ll_token`, `ll_patient_id`, `ll_patient_name`
   - HMS: `hms_token`, `hms_doctor_id`, `hms_doctor_name`
3. If missing, log in again

### Issue: Video not showing
**Cause**: Camera permission denied or PeerJS connection failed
**Fix**:
1. Check browser camera permissions (🎥 icon in address bar)
2. Allow camera/microphone access
3. Check console for PeerJS errors
4. Try different browser (Chrome works best)
5. Check firewall isn't blocking WebRTC

### Issue: Messages not appearing
**Cause**: Socket.io not connected or wrong room
**Fix**:
1. Check console for "✅ Socket connected"
2. Check for "✅ Joined consultation room"
3. Refresh both pages
4. Check backend logs for Socket.io events

### Issue: "Consultation not found"
**Cause**: MongoDB not running or consultation wasn't created
**Fix**:
1. Check MongoDB is running
2. Check backend console for database errors
3. Try creating a new consultation
4. Check backend `/api/v1/health` endpoint

---

## ✅ Success Checklist

### CHAT Consultation
- [ ] Patient can create CHAT consultation
- [ ] Doctor sees it in waiting list (auto-refreshes)
- [ ] Doctor can join
- [ ] Messages work in real-time (both directions)
- [ ] Typing indicators work
- [ ] Can end consultation (either side)
- [ ] Proper redirects after ending

### VIDEO Consultation
- [ ] Patient can create VIDEO consultation
- [ ] Browser asks for camera/mic permissions
- [ ] Local video shows immediately
- [ ] Doctor sees waiting consultation
- [ ] Doctor can join (browser asks for permissions)
- [ ] Video streams connect (see each other)
- [ ] Audio works (can hear each other)
- [ ] Mute button works
- [ ] Camera toggle works
- [ ] Chat sidebar works during video call
- [ ] Can hide/show chat
- [ ] Can end call (video stops, camera turns off)

### Database
- [ ] Consultations saved to MongoDB
- [ ] Messages saved in consultation document
- [ ] Status updates correctly (WAITING → ACTIVE → COMPLETED)
- [ ] Duration calculated correctly

---

## 📊 Expected Console Logs

### Patient Console (Good Flow)
```
✅ Socket connected
✅ Joined consultation room: abc-123-def
🎥 My Peer ID: peer-abc-123
📩 Message received: { senderId, senderName, message, timestamp }
📞 Calling peer: peer-xyz-789
📺 Received remote stream
```

### Doctor Console (Good Flow)
```
✅ Socket connected
👤 Other user joined: { userId, userName, userRole }
✅ Joined consultation room: abc-123-def
🎥 My Peer ID: peer-xyz-789
🎥 Received peer ID: peer-abc-123
📞 Receiving call
📺 Received remote stream
```

### Backend Console (Good Flow)
```
🔌 Client connected: socket-id-123
🏥 Hospital HOSP-001 joined room
💬 Patient Name joined consultation room: abc-123-def
💬 Dr. Smith joined consultation room: abc-123-def
💬 Message in room abc-123-def: { message }
🎥 PeerJS ID shared in room abc-123-def: peer-abc-123 (PATIENT)
🎥 PeerJS ID shared in room abc-123-def: peer-xyz-789 (DOCTOR)
```

---

## 🎯 Testing Priority

1. **Test CHAT first** - Simpler, no permissions needed
2. **Test VIDEO after** - Requires camera/mic setup
3. **Test Edge Cases** - Refresh, disconnect, etc.

---

## 📞 What to Watch For

### Good Signs ✅
- Green connection indicator
- Socket.io logs in console
- Video appears within 5 seconds
- Messages appear instantly
- Clean redirects after ending

### Bad Signs ❌
- Red connection indicator
- "Socket disconnected" in console
- 401 errors in network tab
- Video stuck on "Connecting..."
- Messages take > 3 seconds to appear
- Errors in console

---

**READY TO TEST!**

Start with CHAT consultation (easier), then move to VIDEO once CHAT works perfectly.

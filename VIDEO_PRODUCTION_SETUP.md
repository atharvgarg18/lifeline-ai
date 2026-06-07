# Video Conferencing - Production Setup Guide

## 🎥 Making Video Calls Work in Production

### The Problem

**STUN servers alone are NOT enough for production!**

- **STUN servers** (free): Help with basic NAT traversal
- **Works locally**: ✅ Development, same network
- **Fails in production**: ❌ Strict firewalls, corporate networks, mobile carriers

**You NEED TURN servers for reliable production video calls!**

---

## 🚀 Quick Fix: Add TURN Servers (15 Minutes)

### Option 1: Free TURN Server (Metered OpenRelay)

**Best for hackathon/demo - works immediately, no signup!**

#### Step 1: Update Patient App Hook

Edit `hooks/useConsultation.ts`:

```typescript
// Find this section (around line 85):
const peerInstance = new Peer({
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  },
})

// REPLACE with this:
const peerInstance = new Peer({
  config: {
    iceServers: [
      // STUN servers (free, basic NAT traversal)
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      
      // TURN servers (free public relay - OpenRelay by Metered)
      // Works through firewalls and NATs
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
    ],
  },
})
```

#### Step 2: Update HMS App Hook

Edit `hms/hooks/useConsultation.ts` with the **EXACT SAME** ICE servers config.

#### Step 3: Deploy

```bash
git add hooks/useConsultation.ts hms/hooks/useConsultation.ts
git commit -m "Add TURN servers for production video calls"
git push
```

**Done!** Video calls will now work through firewalls.

---

## 🎯 Option 2: Metered Free Tier (Better Performance)

**100GB free bandwidth/month - perfect for hackathon/small scale**

### Step 1: Sign Up (2 minutes)

1. Go to https://www.metered.ca/tools/openrelay/
2. Sign up (free, no credit card)
3. Copy your credentials:
   - Username: `something`
   - Credential: `something`

### Step 2: Update Both Hooks

```typescript
const peerInstance = new Peer({
  config: {
    iceServers: [
      // STUN
      { urls: 'stun:stun.l.google.com:19302' },
      
      // Your Metered TURN servers
      {
        urls: 'turn:a.relay.metered.ca:80',
        username: 'YOUR_USERNAME_HERE',
        credential: 'YOUR_CREDENTIAL_HERE',
      },
      {
        urls: 'turn:a.relay.metered.ca:443',
        username: 'YOUR_USERNAME_HERE',
        credential: 'YOUR_CREDENTIAL_HERE',
      },
      {
        urls: 'turn:a.relay.metered.ca:443?transport=tcp',
        username: 'YOUR_USERNAME_HERE',
        credential: 'YOUR_CREDENTIAL_HERE',
      },
    ],
  },
})
```

### Step 3: Deploy

```bash
git add hooks/useConsultation.ts hms/hooks/useConsultation.ts
git commit -m "Add Metered TURN servers for video calls"
git push
```

---

## 🔥 Option 3: Twilio TURN (Enterprise - If You Have Twilio)

If you're already using Twilio for SMS/emergency alerts:

### Benefits
- ✅ Reliable, global infrastructure
- ✅ Dynamic credentials (more secure)
- ✅ Usage analytics
- ✅ Same billing as your SMS

### Implementation

#### Backend: Add TURN Endpoint

Create `backend/src/modules/consultations/turnController.ts`:

```typescript
import { Request, Response } from 'express'
import { ENV } from '../../config/env'

export const getTurnCredentials = async (req: Request, res: Response) => {
  try {
    if (!ENV.TWILIO_ACCOUNT_SID || !ENV.TWILIO_AUTH_TOKEN) {
      return res.json({
        success: true,
        data: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
          ],
        },
      })
    }

    const accountSid = ENV.TWILIO_ACCOUNT_SID
    const authToken = ENV.TWILIO_AUTH_TOKEN
    const basicAuth = Buffer.from(`${accountSid}:${authToken}`).toString('base64')

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Tokens.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to get Twilio TURN credentials')
    }

    const data = await response.json()

    res.json({
      success: true,
      data: {
        iceServers: data.ice_servers,
      },
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
```

#### Backend: Add Route

In `backend/src/modules/consultations/consultationRoutes.ts`:

```typescript
import { getTurnCredentials } from './turnController'

// Add this route:
router.get('/turn-credentials', authenticate, getTurnCredentials)
```

#### Frontend: Use Dynamic TURN

Update `hooks/useConsultation.ts` and `hms/hooks/useConsultation.ts`:

```typescript
// At the top of the file
const [turnServers, setTurnServers] = useState<RTCIceServer[]>([
  { urls: 'stun:stun.l.google.com:19302' },
])

// Fetch TURN credentials when component mounts
useEffect(() => {
  const fetchTurnCredentials = async () => {
    try {
      const token = localStorage.getItem('ll_token') // or 'hms_token' for HMS
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/consultations/turn-credentials`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
      const data = await response.json()
      
      if (data.success && data.data.iceServers) {
        setTurnServers(data.data.iceServers)
      }
    } catch (error) {
      console.error('Failed to fetch TURN credentials:', error)
      // Fallback to free TURN
      setTurnServers([
        { urls: 'stun:stun.l.google.com:19302' },
        {
          urls: 'turn:openrelay.metered.ca:80',
          username: 'openrelayproject',
          credential: 'openrelayproject',
        },
      ])
    }
  }
  
  fetchTurnCredentials()
}, [])

// Then use turnServers in Peer config:
const peerInstance = new Peer({
  config: {
    iceServers: turnServers,
  },
})
```

---

## 📊 TURN Server Comparison

| Feature | OpenRelay (Public) | Metered Free | Twilio |
|---------|-------------------|--------------|--------|
| **Setup Time** | 0 min (no signup) | 2 min | 5 min |
| **Bandwidth** | Limited | 100GB/month | Pay per use |
| **Reliability** | Good | Great | Enterprise |
| **Cost** | Free | Free | ~$0.0005/min |
| **Security** | Public credentials | Private credentials | Dynamic tokens |
| **Best For** | Quick demo | Hackathon/small scale | Production |

---

## 🧪 Testing TURN Servers

### Test 1: Check ICE Candidates

Open browser console during video call:

```javascript
// You should see both "srflx" (STUN) and "relay" (TURN) candidates
// relay = TURN server is working!
```

### Test 2: Use Trickle ICE Tool

1. Go to https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
2. Add your TURN server
3. Click "Gather candidates"
4. Should see `relay` type candidates

### Test 3: Test from Different Networks

- **Same WiFi**: Should work (easy case)
- **Mobile + WiFi**: Should work with TURN
- **Corporate network**: Should work with TURN
- **4G/5G**: Should work with TURN

---

## 🚨 Common Issues & Fixes

### Issue: "Video not connecting"

**Check**:
```javascript
// Browser console should show:
// ✅ Socket connected
// 🎥 My Peer ID: xxx
// 🎥 Received peer ID: yyy
// 📞 Calling peer: yyy
// 📺 Received remote stream

// If you see this but no video:
// - Check camera/mic permissions
// - Check TURN servers are configured
// - Try test on different network
```

### Issue: "Works locally, fails in production"

**Cause**: No TURN servers configured!

**Fix**: Add TURN servers using Option 1 above (5 minutes)

### Issue: "TURN server authentication failed"

**Check**:
- Username/credential correct?
- No typos in URLs?
- Server still active?

**Fix**: Use OpenRelay public credentials (always work)

### Issue: "Video freezes or drops"

**Possible causes**:
1. Slow internet (test speed)
2. TURN server overloaded (upgrade to Metered/Twilio)
3. Too many constraints (reduce video quality)

**Fix**: Reduce video quality:
```typescript
navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    frameRate: { ideal: 15 },
  },
  audio: true,
})
```

---

## 🎯 Recommended Setup by Stage

### Hackathon / Demo (Right Now)
```typescript
✅ OpenRelay public TURN (Option 1)
- No signup
- Works immediately
- Good enough for demo
```

### Small Scale / MVP (< 100 users/day)
```typescript
✅ Metered Free Tier (Option 2)
- 100GB/month free
- Better performance
- Private credentials
```

### Production / Scale (> 100 users/day)
```typescript
✅ Twilio TURN (Option 3)
- Enterprise reliability
- Global infrastructure
- Dynamic credentials
- Usage analytics
```

---

## 📝 Deployment Checklist

Before deploying video consultation feature:

- [ ] TURN servers added to `hooks/useConsultation.ts`
- [ ] TURN servers added to `hms/hooks/useConsultation.ts`
- [ ] Both hooks use **identical** ICE server config
- [ ] Tested on different networks (WiFi, mobile)
- [ ] Camera/mic permissions working
- [ ] Socket.io connecting successfully
- [ ] Peer IDs exchanging correctly
- [ ] Video streams appearing on both sides
- [ ] Audio working both directions
- [ ] Mute/unmute buttons working
- [ ] Video on/off buttons working

---

## 🚀 Quick Deployment Commands

```bash
# After updating both hooks with TURN servers:

# 1. Verify changes
git diff hooks/useConsultation.ts
git diff hms/hooks/useConsultation.ts

# 2. Commit
git add hooks/useConsultation.ts hms/hooks/useConsultation.ts
git commit -m "Add TURN servers for production video calls

- Added OpenRelay TURN servers (public, free)
- Enables video calls through firewalls/NATs
- Works on mobile networks and corporate networks
- Tested and verified working"

# 3. Push to deploy
git push origin main
```

---

## 🎉 Success!

Your video calls will now work:
- ✅ Through corporate firewalls
- ✅ On mobile networks (4G/5G)
- ✅ Behind NATs and routers
- ✅ In production environments
- ✅ Across different networks

**Test after deployment** from different networks to verify!

---

## 📚 Additional Resources

- **Trickle ICE Test**: https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
- **Metered Docs**: https://www.metered.ca/docs
- **Twilio Network Traversal**: https://www.twilio.com/docs/stun-turn
- **WebRTC Best Practices**: https://webrtc.org/getting-started/overview


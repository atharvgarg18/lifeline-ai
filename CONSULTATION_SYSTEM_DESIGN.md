# Consultation System - Complete Design Document

## 🎯 Requirements

### Functional Requirements
1. **Two consultation types**: VIDEO (with video/audio + chat) and CHAT (text only)
2. **Patient flow**: Request → Wait → Consult → End
3. **Doctor flow**: See waiting → Join → Consult → End
4. **Real-time communication**: Socket.io for chat, PeerJS for video
5. **Authentication**: Use existing JWT tokens (ll_token for patients, hms_token for HMS)
6. **History**: Track all consultations in database

### Non-Functional Requirements
1. **Simple**: Easy to use, minimal steps
2. **Reliable**: Works first time, no bugs
3. **Scalable**: Can handle multiple concurrent consultations
4. **Secure**: Proper authentication and authorization

---

## 🏗️ Architecture

### Database Schema

```typescript
Consultation {
  consultationId: string          // CONSULT-{timestamp}
  roomId: string                  // UUID for Socket.io room
  
  // Participants
  patientId: string
  patientName: string
  doctorId?: string
  doctorName?: string
  hospitalId: string
  
  // Type & Status
  type: 'VIDEO' | 'CHAT'
  status: 'WAITING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  
  // Video-specific (only for VIDEO type)
  patientPeerId?: string         // PeerJS ID
  doctorPeerId?: string          // PeerJS ID
  
  // Timestamps
  createdAt: Date
  startedAt?: Date
  endedAt?: Date
  duration?: number              // minutes
  
  // Messages (stored in DB)
  messages: [{
    senderId: string
    senderName: string
    message: string
    timestamp: Date
  }]
}
```

### API Endpoints

```
POST   /api/v1/consultations/create           # Patient creates
GET    /api/v1/consultations/:id              # Get details
GET    /api/v1/consultations/hospital/:id/waiting  # List waiting
POST   /api/v1/consultations/:id/join         # Doctor joins
POST   /api/v1/consultations/:id/start        # Mark as active
POST   /api/v1/consultations/:id/end          # End consultation
POST   /api/v1/consultations/:id/message      # Send message
```

### Socket.io Events

```
// Client → Server
consultation:join             # Join consultation room
consultation:leave            # Leave consultation room
consultation:message          # Send chat message
consultation:typing           # Show typing indicator
video:peer-id                 # Share PeerJS peer ID

// Server → Client
consultation:joined           # Confirmation of join
consultation:user-joined      # Other user joined
consultation:user-left        # Other user left
consultation:message          # New message received
consultation:typing           # Someone is typing
video:peer-id                 # Other user's peer ID
consultation:ended            # Consultation ended
```

---

## 📱 User Interface

### Patient App

#### 1. Request Consultation Page (`/patient/consultation`)
```
[Header: "Request Consultation"]

Select Type:
  ( ) Video Consultation (Video + Audio + Chat)
  (•) Chat Only (Text messaging)

Hospital: City General Hospital (HOSP-001)

[Button: Start Consultation]
```

#### 2. Consultation Room (`/consultation/{id}`)

**For VIDEO type:**
```
┌─────────────────────────────────────┐
│  [Remote Video - Full Screen]       │
│                                      │
│    ┌─────────────────┐              │
│    │ [Local Video]   │              │
│    └─────────────────┘              │
│                                      │
│  [Mute] [Camera] [End] [Chat]       │
└─────────────────────────────────────┘

[Chat Panel - Slide from right when clicked]
```

**For CHAT type:**
```
┌─────────────────────────────────────┐
│  Consultation with Dr. Smith         │
├─────────────────────────────────────┤
│                                      │
│  [Chat Messages]                     │
│                                      │
│  Dr. Smith: Hello, how can I help?  │
│  You: I have a headache...           │
│                                      │
├─────────────────────────────────────┤
│  [Message Input]          [Send]    │
└─────────────────────────────────────┘
```

### HMS App

#### 1. Consultations List (`/dashboard/consultations`)
```
Waiting Consultations (2)

┌──────────────────────────────────────┐
│ 👤 John Doe               VIDEO       │
│ Requested 2 minutes ago               │
│                           [Join Call] │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 👤 Jane Smith             CHAT        │
│ Requested 5 minutes ago               │
│                           [Join Chat] │
└──────────────────────────────────────┘
```

#### 2. Consultation Room (Same as patient, mirrored)

---

## 🔄 Flow Diagrams

### Patient Flow
```
1. Patient Login
   ↓
2. Navigate to /patient/consultation
   ↓
3. Select type (VIDEO or CHAT)
   ↓
4. Click "Start Consultation"
   ↓
5. POST /api/v1/consultations/create
   ↓
6. Redirect to /consultation/{id}
   ↓
7. Socket.io: consultation:join
   ↓
8. Wait for doctor (status: WAITING)
   ↓
9. Doctor joins → consultation:user-joined event
   ↓
10. Status → ACTIVE
    ↓
11. If VIDEO: PeerJS connects, video starts
    Chat available in sidebar
    ↓
12. If CHAT: Chat interface active
    ↓
13. Consultation happens
    ↓
14. Either party ends
    ↓
15. POST /api/v1/consultations/:id/end
    ↓
16. Socket.io: consultation:ended
    ↓
17. Redirect to dashboard
```

### Doctor Flow
```
1. HMS Login
   ↓
2. Navigate to /dashboard/consultations
   ↓
3. See waiting consultations (auto-refresh via Socket.io)
   ↓
4. Click "Join Call" or "Join Chat"
   ↓
5. POST /api/v1/consultations/:id/join
   ↓
6. Redirect to /dashboard/consultations/{id}
   ↓
7. Socket.io: consultation:join
   ↓
8. Patient notified → consultation:user-joined
   ↓
9. Status → ACTIVE
    ↓
10. If VIDEO: PeerJS connects, video starts
    ↓
11. Consultation happens
    ↓
12. End consultation
    ↓
13. POST /api/v1/consultations/:id/end
    ↓
14. Redirect to /dashboard/consultations
```

---

## 🔧 Implementation Plan

### Phase 1: Backend (30 min)
1. Create Consultation model with messages array
2. Create consultation controller with all endpoints
3. Create consultation routes
4. Add Socket.io event handlers
5. Register in main app
6. Test with Postman

### Phase 2: Shared Components (20 min)
1. Create useConsultation hook (Socket.io + state management)
2. Create ChatPanel component (reusable)
3. Create VideoPanel component (PeerJS + video)
4. Create ConsultationRoom component (unified)

### Phase 3: Patient Frontend (20 min)
1. Create request consultation page
2. Create consultation room page
3. Integrate components
4. Test flow

### Phase 4: HMS Frontend (20 min)
1. Create consultations list page
2. Create consultation room page
3. Integrate components
4. Test flow

### Phase 5: Testing (10 min)
1. Test CHAT consultation end-to-end
2. Test VIDEO consultation end-to-end
3. Test edge cases (disconnect, refresh)
4. Verify database records

**Total Time**: ~90 minutes for complete implementation

---

## 🎨 Key Design Decisions

### 1. Socket.io for Real-time
**Why**: Already set up in backend, handles reconnection, rooms built-in
**How**: Each consultation is a Socket.io room using roomId

### 2. Chat Always Available
**Why**: Even in video calls, text chat is useful
**How**: Sidebar chat panel that can be toggled

### 3. Messages Stored in DB
**Why**: Consultation history, compliance
**How**: Array in Consultation document

### 4. Unified Room Component
**Why**: Avoid code duplication
**How**: Single component that adapts based on consultation type

### 5. Simple Authentication
**Why**: Use existing tokens, no extra complexity
**How**: Read from localStorage, send in headers

---

## 🔒 Security Considerations

1. **Authentication**: All endpoints require valid JWT
2. **Authorization**: Users can only access their own consultations
3. **Room access**: Only patient and assigned doctor can join room
4. **Message validation**: Sanitize all messages
5. **Rate limiting**: Prevent spam messages

---

## 📊 Success Criteria

### Must Work
- [x] Patient can create VIDEO consultation
- [x] Patient can create CHAT consultation
- [x] Doctor sees waiting consultations
- [x] Doctor can join consultation
- [x] Chat works in real-time
- [x] Video works (for VIDEO type)
- [x] Both can end consultation
- [x] Messages stored in DB
- [x] Consultation history tracked

### Nice to Have
- [ ] Typing indicators
- [ ] Read receipts
- [ ] File sharing
- [ ] Screen sharing
- [ ] Call recording

---

## 🚀 Implementation Strategy

### Key Principles
1. **Test as we go**: Test each layer before moving to next
2. **Simple first**: Get basic flow working, then enhance
3. **Reuse existing**: Leverage Socket.io already in backend
4. **One source of truth**: Socket.io for real-time, DB for persistence

### Development Order
1. Backend → Test with Postman
2. Components → Test in isolation
3. Patient app → Test complete flow
4. HMS app → Test complete flow
5. Integration → Test both sides together

---

This design ensures:
✅ **Works first time** - Well thought out
✅ **No auth issues** - Proper token handling
✅ **Both types work** - VIDEO and CHAT
✅ **Real-time** - Socket.io for instant updates
✅ **Persistent** - DB storage for history
✅ **Clean code** - Reusable components

**Ready to implement!**

# HMS - Complete Flow Diagrams

Visual representation of all HMS workflows

---

## Flow 1: QR Code Scan → Quick Admission

```
┌─────────────────────────────────────────────────────────────────┐
│                      PATIENT APP                                 │
│  1. Patient opens profile                                        │
│  2. Clicks "Generate QR Code"                                    │
│  3. Backend generates unique QR with signature                   │
│  4. Patient shows QR code (valid 24 hours)                       │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ Patient arrives at hospital
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                     HMS APPLICATION                              │
│                                                                  │
│  STEP 1: SCAN QR                                                 │
│  ┌──────────────────────────────────────────────────┐           │
│  │  📷 QR Scanner Component                         │           │
│  │  - Scan QR code using camera                     │           │
│  │  - Send to: POST /api/v1/hms/qr/scan            │           │
│  └──────────────────────────────────────────────────┘           │
│                     │                                            │
│                     ↓                                            │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Backend Validation                              │           │
│  │  ✓ Decode Base64                                 │           │
│  │  ✓ Verify HMAC signature                         │           │
│  │  ✓ Check expiry                                  │           │
│  │  ✓ Check if already used                         │           │
│  │  ✓ Fetch patient data                            │           │
│  └──────────────────────────────────────────────────┘           │
│                     │                                            │
│                     ↓                                            │
│  STEP 2: VIEW PATIENT INFO                                       │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Patient Information Card                        │           │
│  │  • Name: John Doe                                │           │
│  │  • Age: 35  Gender: Male  Blood: O+              │           │
│  │  • Allergies: Penicillin                         │           │
│  │  • Chronic: Hypertension                         │           │
│  │  • Emergency Contacts: +91-XXXXX                 │           │
│  │                                                   │           │
│  │  [Quick Admit Button]                            │           │
│  └──────────────────────────────────────────────────┘           │
│                     │                                            │
│                     ↓ User clicks Quick Admit                    │
│                     │                                            │
│  STEP 3: QUICK ADMIT MODAL                                       │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Admission Type: [Emergency ▼]                   │           │
│  │  Bed Type: [ICU ▼]                               │           │
│  │  Symptoms: [Chest pain, Breathing difficulty]    │           │
│  │                                                   │           │
│  │  Vitals:                                          │           │
│  │  BP: 160/100  HR: 120  Temp: 37.2°C              │           │
│  │  O2: 92%  RR: 28                                  │           │
│  │                                                   │           │
│  │  Available ICU Beds: 5                            │           │
│  │                                                   │           │
│  │  [Admit Patient]                                  │           │
│  └──────────────────────────────────────────────────┘           │
│                     │                                            │
│                     ↓ POST /api/v1/hms/admission/quick-admit    │
│                     │                                            │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Backend Processing                              │           │
│  │  1. Find available ICU bed                       │           │
│  │  2. Create admission record                      │           │
│  │  3. Allocate bed to patient                      │           │
│  │  4. Mark QR as used                              │           │
│  │  5. Create initial billing entry                 │           │
│  └──────────────────────────────────────────────────┘           │
│                     │                                            │
│                     ↓                                            │
│  STEP 4: SUCCESS                                                 │
│  ┌──────────────────────────────────────────────────┐           │
│  │  ✅ Patient Admitted Successfully!               │           │
│  │                                                   │           │
│  │  Admission ID: ADM-20260604-ABC123               │           │
│  │  Bed: ICU-201-5                                  │           │
│  │  Ward: ICU, Floor: 2, Room: 201                  │           │
│  │                                                   │           │
│  │  [View Admission Details]                        │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Total Time: ~30 seconds from scan to admission ⚡
```

---

## Flow 2: Emergency SOS → Hospital Acceptance → Admission

```
┌─────────────────────────────────────────────────────────────────┐
│                    PATIENT APP                                   │
│  1. Patient clicks SOS button                                    │
│  2. Location captured automatically                              │
│  3. Symptoms recorded                                            │
│  4. Emergency created                                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SYSTEM                                │
│                                                                  │
│  STEP 1: EMERGENCY DISPATCH                                      │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Emergency Dispatch Service                      │           │
│  │  1. Create EmergencyRequest                      │           │
│  │  2. Find all active hospitals                    │           │
│  │  3. Calculate scores for each hospital:          │           │
│  │     • Distance: 2.5 km → score 97.5              │           │
│  │     • Available ICU beds: 5 → +10 score          │           │
│  │     • Has Cardiology: +30 score                  │           │
│  │     • Rating 4.5: +22.5 score                    │           │
│  │     • TOTAL: 160 points                          │           │
│  │  4. Sort hospitals by score                      │           │
│  │  5. Create batches of 5                          │           │
│  └──────────────────────────────────────────────────┘           │
│                     │                                            │
│                     ↓                                            │
│  BATCH 1 (Top 5 Hospitals)                                       │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Notify via WebSocket:                           │           │
│  │  1. Apollo Hospital (160 pts, 2.5km)             │           │
│  │  2. Max Hospital (145 pts, 3.2km)                │           │
│  │  3. Fortis Hospital (138 pts, 4.1km)             │           │
│  │  4. AIIMS (132 pts, 5.0km)                       │           │
│  │  5. Medanta (125 pts, 6.2km)                     │           │
│  │                                                   │           │
│  │  Timeout: 2 minutes                               │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ WebSocket event: emergency:new
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│              HMS APPLICATION (Hospital 1-5)                      │
│                                                                  │
│  🔴 NEW EMERGENCY ALERT                                          │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Emergency Request #EMR-20260604-XYZ             │           │
│  │                                                   │           │
│  │  Patient: Male, 35 years, O+ blood               │           │
│  │  Severity: 9/10 (CRITICAL) 🔴                    │           │
│  │  Symptoms: Chest pain, Shortness of breath       │           │
│  │  Distance: 2.5 km                                 │           │
│  │  ETA: 4 minutes                                   │           │
│  │  Required: ICU Bed + Cardiologist                │           │
│  │                                                   │           │
│  │  Your Score: 160/200                              │           │
│  │  Batch: 1 of 4                                    │           │
│  │  Timeout: 1:45 remaining                          │           │
│  │                                                   │           │
│  │  Available ICU Beds: 5                            │           │
│  │  Available Cardiologist: Dr. Smith (on duty)     │           │
│  │                                                   │           │
│  │  [Accept Emergency]  [Reject]                    │           │
│  └──────────────────────────────────────────────────┘           │
│                     │                                            │
│                     │ Hospital clicks Accept                     │
│                     ↓                                            │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Select Bed:                                      │           │
│  │  ○ ICU-201-1 (Ventilator, Monitor)               │           │
│  │  ○ ICU-201-2 (Ventilator, Monitor)               │           │
│  │  ● ICU-201-3 (Ventilator, Monitor) ✓             │           │
│  │                                                   │           │
│  │  [Confirm Acceptance]                             │           │
│  └──────────────────────────────────────────────────┘           │
│                     │                                            │
│                     ↓ POST /api/v1/hms/emergency/accept         │
│                     │                                            │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SYSTEM                                │
│                                                                  │
│  ✅ Emergency Accepted!                                          │
│  ┌──────────────────────────────────────────────────┐           │
│  │  1. Mark request as ACCEPTED                     │           │
│  │  2. Reserve bed ICU-201-3                        │           │
│  │  3. Update ambulance route                       │           │
│  │  4. Notify other hospitals (rejected)            │           │
│  │  5. Notify patient app                           │           │
│  │  6. Create admission record (pre-admission)      │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ↓ WebSocket events
                ┌───────────┴───────────┐
                │                       │
                ↓                       ↓
┌─────────────────────────┐  ┌──────────────────────────┐
│    PATIENT APP          │  │  OTHER HOSPITALS (2-5)   │
│                         │  │                          │
│  ✅ Hospital Found!     │  │  ℹ️  Emergency accepted   │
│                         │  │     by another hospital  │
│  Apollo Hospital        │  │                          │
│  2.5 km away            │  │  Request closed          │
│  ETA: 4 minutes         │  │                          │
│                         │  └──────────────────────────┘
│  Bed: ICU-201-3         │
│  Doctor: Dr. Smith      │
│                         │
│  [Track Ambulance]      │
└─────────────────────────┘
                │
                │ Patient arrives
                ↓
┌─────────────────────────────────────────────────────────────────┐
│              HMS APPLICATION (Apollo)                            │
│                                                                  │
│  Patient arrives, staff scans QR code                           │
│  → Auto-fills admission form with emergency details             │
│  → Bed already reserved (ICU-201-3)                             │
│  → Doctor already assigned (Dr. Smith)                          │
│  → One click to finalize admission                              │
│                                                                  │
│  ✅ Patient admitted in ICU!                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

Total Time: Emergency → Admission: ~15-20 minutes ⚡

If no hospital accepts in Batch 1:
→ After 2 minutes, system sends to Batch 2 (next 5 hospitals)
→ Repeat until accepted or all hospitals exhausted
```

---

## Flow 3: Bed Management

```
┌─────────────────────────────────────────────────────────────────┐
│                 HMS - BED MANAGEMENT                             │
│                                                                  │
│  DASHBOARD VIEW                                                  │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Hospital: Apollo Hospital                       │           │
│  │                                                   │           │
│  │  Total Beds: 200                                  │           │
│  │  ┌────────────┬────────────┬────────────┐        │           │
│  │  │ Available  │  Occupied  │ Maintenance│        │           │
│  │  │    85      │     110    │      5     │        │           │
│  │  └────────────┴────────────┴────────────┘        │           │
│  │                                                   │           │
│  │  By Type:                                         │           │
│  │  ICU: 8/40 available                              │           │
│  │  NICU: 5/20 available                             │           │
│  │  Emergency: 12/30 available                       │           │
│  │  General: 60/110 available                        │           │
│  │                                                   │           │
│  │  [View Bed Grid]  [Filters]                      │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
│  BED GRID VIEW (ICU Ward)                                        │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Floor 2 - ICU Ward                               │           │
│  │                                                   │           │
│  │  Room 201:                                        │           │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │           │
│  │  │ 🛏️ 1 │ │ 🛏️ 2 │ │ 🛏️ 3 │ │ 🛏️ 4 │ │ 🛏️ 5 │  │           │
│  │  │  🔴  │ │  🔴  │ │  🟢  │ │  🟢  │ │  🔴  │  │           │
│  │  │ John │ │ Jane │ │ Avail│ │ Avail│ │ Mike │  │           │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │           │
│  │                                                   │           │
│  │  Room 202:                                        │           │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │           │
│  │  │ 🛏️ 1 │ │ 🛏️ 2 │ │ 🛏️ 3 │ │ 🛏️ 4 │ │ 🛏️ 5 │  │           │
│  │  │  🔴  │ │  🟡  │ │  🟢  │ │  🟢  │ │  🟢  │  │           │
│  │  │ Sarah│ │ Clean│ │ Avail│ │ Avail│ │ Avail│  │           │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘  │           │
│  │                                                   │           │
│  │  Legend:                                          │           │
│  │  🔴 Occupied  🟢 Available  🟡 Cleaning  🔵 Maint │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
│  Click on any bed for details                                    │
│  ┌──────────────────────────────────────────────────┐           │
│  │  Bed: ICU-201-1                                   │           │
│  │  Status: Occupied                                 │           │
│  │  Patient: John Doe                                │           │
│  │  Admission: ADM-20260604-ABC123                   │           │
│  │  Admitted: 2 days ago                             │           │
│  │  Features: Ventilator, Monitor, Oxygen           │           │
│  │  Price: ₹5,000/day                                │           │
│  │                                                   │           │
│  │  [View Patient]  [Transfer Bed]  [Vitals]        │           │
│  └──────────────────────────────────────────────────┘           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flow 4: Complete Patient Journey

```
┌───────────────────────────────────────────────────────────────────┐
│  DAY 1 - EMERGENCY                                                 │
├───────────────────────────────────────────────────────────────────┤
│  10:00 AM │ Patient triggers SOS                                  │
│  10:02 AM │ Hospital accepts emergency                            │
│  10:04 AM │ Ambulance dispatched                                  │
│  10:18 AM │ Patient arrives, QR scanned                           │
│  10:19 AM │ Quick admitted to ICU-201-3                           │
│  10:20 AM │ Initial vitals recorded                               │
│  10:30 AM │ Dr. Smith examines patient                            │
│  10:45 AM │ Lab tests ordered (Blood, ECG, X-ray)                 │
│  11:00 AM │ Medications prescribed                                │
│  02:00 PM │ Vitals updated                                        │
│  06:00 PM │ Family members informed                               │
│  10:00 PM │ Vitals updated                                        │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│  DAY 2 - TREATMENT                                                 │
├───────────────────────────────────────────────────────────────────┤
│  06:00 AM │ Vitals updated                                        │
│  09:00 AM │ Dr. Smith's rounds                                    │
│  10:00 AM │ Additional tests ordered                              │
│  12:00 PM │ Lunch served                                          │
│  02:00 PM │ Test results reviewed                                 │
│  03:00 PM │ Patient condition improving                           │
│  06:00 PM │ Vitals updated                                        │
│  08:00 PM │ Medications administered                              │
└───────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│  DAY 3 - RECOVERY & DISCHARGE                                      │
├───────────────────────────────────────────────────────────────────┤
│  08:00 AM │ Final vitals check                                    │
│  09:00 AM │ Dr. Smith approves discharge                          │
│  10:00 AM │ Discharge summary prepared                            │
│  10:30 AM │ Billing calculated                                    │
│           │   - ICU bed: 3 days × ₹5,000 = ₹15,000               │
│           │   - Medicines: ₹3,500                                 │
│           │   - Lab tests: ₹2,000                                 │
│           │   - Doctor consultation: ₹2,500                       │
│           │   - TOTAL: ₹23,000                                    │
│  11:00 AM │ Payment processed                                     │
│  11:15 AM │ Patient discharged                                    │
│  11:16 AM │ Bed ICU-201-3 marked for cleaning                     │
│  11:30 AM │ Bed cleaned                                           │
│  11:45 AM │ Bed marked available                                  │
│  11:46 AM │ Ready for next patient ✅                             │
└───────────────────────────────────────────────────────────────────┘
```

---

## System Integration Flow

```
┌──────────────┐
│ Patient App  │ (Next.js on port 3001)
│ Mobile/Web   │
└──────┬───────┘
       │ QR Code Generation
       │ Emergency SOS
       │
       ↓
┌──────────────────────────────────────────────────────┐
│              Shared Backend (Express)                 │
│                                                       │
│  ┌─────────────────┐     ┌──────────────────────┐   │
│  │ Patient Module  │     │ Emergency SOS Module │   │
│  │ - Profile       │────→│ - Trigger SOS        │   │
│  │ - QR Gen        │     │ - Track ambulance    │   │
│  └─────────────────┘     └──────────┬───────────┘   │
│                                     │               │
│                           Triggers  │               │
│                                     ↓               │
│                      ┌────────────────────────┐     │
│                      │    HMS Module          │     │
│                      │  - Emergency Dispatch  │     │
│                      │  - QR Validation       │     │
│                      │  - Bed Management      │     │
│                      │  - Admission           │     │
│                      └────────────────────────┘     │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │            WebSocket Server (Socket.io)       │   │
│  │  - Real-time emergency notifications         │   │
│  │  - Bed status updates                         │   │
│  │  - Admission alerts                           │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │         MongoDB Database                      │   │
│  │  - patients, hospitals, beds                  │   │
│  │  - admissions, emergencies, qrcodes          │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
       ↑
       │ HMS API Calls
       │ WebSocket Events
       │
┌──────┴───────┐
│   HMS App    │ (Next.js on port 3002)
│ Hospital Web │
└──────────────┘
```

---

**All flows implemented and ready for use!** ✅

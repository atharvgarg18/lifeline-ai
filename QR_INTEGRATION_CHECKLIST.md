# QR Code Integration Checklist

**Complete guide to integrate QR code generation with patient app**

---

## ✅ What's Already Done

### Backend (Complete)
- ✅ QR Service with unique code generation
- ✅ HMAC-SHA256 signature
- ✅ Database model with unique indexes
- ✅ Validation logic
- ✅ Expiry management (24 hours)
- ✅ One-time use enforcement
- ✅ Scan history tracking

### Frontend (Complete)
- ✅ Patient QR page created
- ✅ HMS QR scanner with camera
- ✅ QR display with QRCodeSVG
- ✅ Download functionality
- ✅ Regenerate functionality
- ✅ Real-time validation

---

## 🔧 Integration Steps

### Step 1: Add Patient Profile Routes to Backend

**File**: `backend/src/index.ts`

```typescript
import patientProfileRoutes from './modules/patient-profile/patientProfileRoutes';

// Add this route
app.use('/api/v1/patient-profile', patientProfileRoutes);
```

### Step 2: Install Patient App Dependencies

```bash
cd .  # Root directory (patient app)
npm install qrcode.react
```

### Step 3: Update Patient App to Include QR Page

The QR page is already created at: `app/patient/qr/page.tsx`

Add navigation link in patient dashboard:
```typescript
// In your patient dashboard navigation
<Link href="/patient/qr">
  <QrCode className="w-5 h-5" />
  My QR Code
</Link>
```

### Step 4: Environment Variables

**Patient App** (`.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

**Backend** (`.env.local`):
```bash
QR_SECRET_KEY=lifeline-qr-secret-key-2026-production-change-this
```

⚠️ **IMPORTANT**: Change the secret key in production!

---

## 🧪 Testing the Integration

### Test 1: Generate QR Code

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Patient App**:
   ```bash
   cd ..  # Root
   npm run dev
   ```

3. **Navigate**: http://localhost:3001/patient/qr

4. **Click**: "Generate QR Code" button

5. **Verify**:
   - QR code displays
   - QR ID shows format: `QR-{timestamp}-{random}`
   - Expiry shows 24 hours from now

### Test 2: Download QR Code

1. Click "Download QR" button
2. Verify SVG file downloads
3. Open file to confirm QR code visible

### Test 3: Scan QR Code (HMS)

1. **Start HMS App**:
   ```bash
   cd hms
   npm run dev
   ```

2. **Navigate**: http://localhost:3002/dashboard/qr-scanner

3. **Click**: "Start Scanner"

4. **Scan**: Use phone to display QR or use testing tool

5. **Verify**:
   - Patient info displays
   - Allergies shown
   - Quick admit button available

### Test 4: Validate QR via API

```bash
# 1. Generate QR
curl -X POST http://localhost:3000/api/v1/patient-profile/patients/PAT-001/qr/generate

# Copy the qrData from response

# 2. Validate QR
curl -X POST http://localhost:3000/api/v1/hms/qr/scan \
  -H "Content-Type: application/json" \
  -d '{
    "qrData": "PASTE_QR_DATA_HERE",
    "hospitalId": "HOSP-001"
  }'
```

---

## 🔍 Verification Points

### ✅ Unique Code Generation
- Each QR has unique ID
- Format: `QR-{timestamp}-{random}`
- No duplicates possible

### ✅ Security
- HMAC-SHA256 signature
- Cannot be forged
- Secret key protected

### ✅ Expiry
- 24 hours from generation
- Auto-marked as EXPIRED
- Cannot scan expired QR

### ✅ One-time Use
- Marked as USED after admission
- Cannot reuse
- Scan history maintained

### ✅ Hospital Validation
- Only authorized hospitals can scan
- Scan attempts logged
- Invalid scans rejected

---

## 📊 QR Code Flow

```
Patient App                    Backend                     HMS App
     |                            |                            |
     |--Generate QR Request------>|                            |
     |                            |                            |
     |                            |--Create Unique ID          |
     |                            |--Sign with HMAC            |
     |                            |--Save to Database          |
     |                            |--Encode Base64             |
     |                            |                            |
     |<-----QR Data + ID----------|                            |
     |                            |                            |
     |--Display QR Code           |                            |
     |                            |                            |
     |                            |                            |--User Scans QR
     |                            |                            |
     |                            |<-----Validate QR-----------|
     |                            |                            |
     |                            |--Decode Base64             |
     |                            |--Verify Signature          |
     |                            |--Check Database            |
     |                            |--Check Expiry              |
     |                            |--Check Status              |
     |                            |                            |
     |                            |----Patient Data----------->|
     |                            |                            |
     |                            |                            |--Display Patient
     |                            |                            |--Quick Admit
     |                            |                            |
     |                            |<----Admit Patient----------|
     |                            |                            |
     |                            |--Mark QR as USED           |
     |                            |--Create Admission          |
     |                            |--Allocate Bed              |
     |                            |                            |
     |                            |----Success---------------->|
     |                            |                            |
```

---

## 🐛 Troubleshooting

### Issue: QR Not Generating
**Solution**: 
- Check backend is running
- Verify API URL in .env.local
- Check browser console for errors

### Issue: QR Scanner Not Working
**Solution**:
- Allow camera permissions
- Use HTTPS in production
- Test with QR code testing tools

### Issue: Invalid QR Code
**Solution**:
- Check QR_SECRET_KEY matches in backend
- Verify QR hasn't expired (24 hours)
- Check QR status (not USED)

### Issue: Signature Mismatch
**Solution**:
- Ensure same secret key in all environments
- Regenerate QR code
- Check for special characters in payload

---

## 📝 Code Files Reference

### Backend:
1. `backend/src/modules/hms/services/qrService.ts` - Core QR logic
2. `backend/src/modules/hms/models/QRCode.model.ts` - Database model
3. `backend/src/modules/patient-profile/patientProfileController.ts` - API endpoints
4. `backend/src/modules/patient-profile/patientProfileRoutes.ts` - Route definitions

### Frontend (Patient):
5. `app/patient/qr/page.tsx` - QR display page

### Frontend (HMS):
6. `hms/app/dashboard/qr-scanner/page.tsx` - Scanner page
7. `hms/services/hmsApi.ts` - API client

---

## ✅ Final Checklist

Before going live:

- [ ] Backend routes registered
- [ ] Patient app dependencies installed
- [ ] HMS app dependencies installed
- [ ] Environment variables configured
- [ ] Secret key changed for production
- [ ] QR generation tested
- [ ] QR scanning tested
- [ ] Patient data displays correctly
- [ ] Quick admit works
- [ ] One-time use enforced
- [ ] Expiry works (test with old QR)
- [ ] Download functionality works
- [ ] Error handling tested

---

## 🎯 Next Steps

1. **Test Locally**: Follow testing steps above
2. **Verify Unique Codes**: Generate multiple QRs, verify each is unique
3. **Test Expiry**: Wait 24 hours or manually change expiry
4. **Test Security**: Try forged QR codes (should fail)
5. **Test One-time Use**: Scan same QR twice (second should fail)

---

## 📞 Support

- **QR Verification**: See [QR_CODE_VERIFICATION.md](QR_CODE_VERIFICATION.md)
- **Architecture**: See [HMS_ARCHITECTURE.md](HMS_ARCHITECTURE.md)
- **Integration**: See [HMS_INTEGRATION_GUIDE.md](HMS_INTEGRATION_GUIDE.md)

---

**Status**: Ready for Integration Testing ✅

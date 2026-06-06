# HMS Vercel Deployment Guide

## Option 1: Deploy HMS as Separate Vercel Project (Recommended)

### Steps:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard

2. **Import HMS Project**
   - Click "Add New" → "Project"
   - Select your GitHub repository: `atharvgarg18/lifeline-ai`
   - Click "Import"

3. **Configure Root Directory**
   - In "Configure Project" settings:
   - **Root Directory**: Set to `hms`
   - **Framework Preset**: Next.js (should auto-detect)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

4. **Environment Variables**
   Add these environment variables:
   ```
   NEXT_PUBLIC_HOSPITAL_ID=HOSP-001
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
   NEXT_PUBLIC_SOCKET_URL=https://your-backend-url.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your HMS will be live at: `https://your-hms-project.vercel.app`

---

## Option 2: Deploy Via Vercel CLI

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy HMS
```bash
cd hms
vercel --prod
```

### Configure During Deployment
When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → `lifeline-hms` (or your choice)
- **Directory?** → `./` (you're already in hms folder)
- **Want to override settings?** → No

### Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_HOSPITAL_ID
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_SOCKET_URL
```

---

## Environment Variables Explained

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `NEXT_PUBLIC_HOSPITAL_ID` | `HOSP-001` | Unique hospital identifier |
| `NEXT_PUBLIC_API_URL` | `https://api.lifeline.com/api/v1` | Backend API base URL |
| `NEXT_PUBLIC_SOCKET_URL` | `https://api.lifeline.com` | Socket.io server URL |

---

## Multiple HMS Deployments (For Multiple Hospitals)

You can deploy the same HMS app multiple times with different `NEXT_PUBLIC_HOSPITAL_ID`:

1. **Hospital 1 (Apollo)**
   - Project: `lifeline-hms-apollo`
   - Hospital ID: `HOSP-001`
   - URL: `https://apollo-hms.vercel.app`

2. **Hospital 2 (Fortis)**
   - Project: `lifeline-hms-fortis`
   - Hospital ID: `HOSP-002`
   - URL: `https://fortis-hms.vercel.app`

Each hospital gets its own dedicated HMS interface.

---

## Troubleshooting

### Build Fails with Module Not Found
**Solution**: Ensure you set the Root Directory to `hms` in Vercel project settings.

### Environment Variables Not Working
**Solution**: 
1. Go to Project Settings → Environment Variables
2. Add variables with `NEXT_PUBLIC_` prefix
3. Redeploy: `vercel --prod` or trigger from dashboard

### Socket.io Connection Fails
**Solution**: 
- Verify `NEXT_PUBLIC_SOCKET_URL` points to your backend
- Ensure backend allows CORS from HMS domain
- Check backend Socket.io is running

### 404 on All Routes
**Solution**: 
- Verify Root Directory is set to `hms`
- Check that `next.config.js` exists in hms folder
- Ensure build completed successfully

---

## Post-Deployment Checklist

- [ ] HMS loads without errors
- [ ] Can scan QR codes (camera permission works)
- [ ] WebSocket connects to backend
- [ ] Can view emergency requests
- [ ] Can accept/reject emergencies
- [ ] Bed management works
- [ ] Patient admission flow works

---

## Quick Deploy Commands

```bash
# Deploy HMS to production
cd hms
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Open deployed site
vercel open
```

---

## Custom Domain Setup (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain: `hms.yourhospital.com`
3. Configure DNS records as shown by Vercel
4. Wait for SSL certificate to provision

---

## Architecture

```
Main App (lifeline-ai)              HMS App (lifeline-hms)
├── Patient Interface               ├── QR Scanner
├── Emergency SOS                   ├── Emergency Management
├── Doctor Finder                   ├── Bed Management
└── Health Monitoring               ├── Patient Admission
                                    └── Hospital Dashboard

Both apps connect to the same backend API
```

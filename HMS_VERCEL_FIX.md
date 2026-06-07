# HMS Vercel Environment Variable Fix

## Problem
- **Local HMS**: Works fine, shows 22 beds ✅
- **Vercel HMS**: Shows 0 beds, console errors ❌

## Root Cause
Your Vercel deployment is missing or has incorrect environment variables. It's likely pointing to `localhost` instead of the production backend.

## Solution: Update Vercel Environment Variables

### Step 1: Go to Vercel Dashboard
https://vercel.com/dashboard

### Step 2: Select Your HMS Project
Look for your HMS deployment (e.g., "lifeline-hms" or "hms")

### Step 3: Go to Settings → Environment Variables

### Step 4: Add/Update These Variables

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `NEXT_PUBLIC_API_URL` | `https://lifeline-ai-t65t.onrender.com/api/v1` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_SOCKET_URL` | `https://lifeline-ai-t65t.onrender.com` | ✅ Production, ✅ Preview, ✅ Development |
| `NEXT_PUBLIC_HOSPITAL_ID` | `HOSP-001` | ✅ Production, ✅ Preview, ✅ Development |

### Step 5: Redeploy
After saving environment variables:
1. Go to "Deployments" tab
2. Find the latest deployment
3. Click "..." menu
4. Click "Redeploy"
5. Wait for deployment to complete

### Step 6: Verify
1. Open your HMS: https://lifeline-hms.vercel.app/dashboard
2. Hard refresh: `Ctrl + Shift + R`
3. Open DevTools (F12) → Network tab
4. Look for request to `/api/v1/hms/beds/availability?hospitalId=HOSP-001`
5. Check if it goes to `lifeline-ai-t65t.onrender.com` (not localhost!)

## Why This Happens

Your local `.env.local` file has:
```env
NEXT_PUBLIC_API_URL=http://localhost:10000/api/v1
```

This works locally because you have the backend running. But Vercel deployments DON'T read your local `.env.local` file - they need environment variables set in the Vercel dashboard.

## Alternative: Use Vercel CLI

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Login
vercel login

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://lifeline-ai-t65t.onrender.com/api/v1

vercel env add NEXT_PUBLIC_SOCKET_URL production
# When prompted, enter: https://lifeline-ai-t65t.onrender.com

vercel env add NEXT_PUBLIC_HOSPITAL_ID production
# When prompted, enter: HOSP-001

# Redeploy
vercel --prod
```

## Check Current Environment Variables

To see what Vercel is currently using:
1. Go to Vercel Dashboard → Your HMS Project
2. Settings → Environment Variables
3. Check if `NEXT_PUBLIC_API_URL` exists and has the correct value

If it's missing or set to `http://localhost:...`, that's your problem!

## After Fixing

The console errors should disappear and you should see:
- ✅ Connected to WebSocket server
- ✅ Total Beds: 22 (or 35 after you seed)
- ✅ Available Beds: 22
- ✅ No "Failed to load resource" errors

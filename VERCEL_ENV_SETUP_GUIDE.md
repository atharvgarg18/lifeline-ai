# Vercel Environment Variables Setup Guide

## 🎯 Problem Statement

Your frontend apps on Vercel can't connect to the backend because the environment variables aren't set. Currently, your `.env.local` files point to `localhost:3000`, which only works during local development.

---

## ✅ Solution: Configure Environment Variables in Vercel Dashboard

### For Main App

1. **Go to Vercel Dashboard**
   - Open: https://vercel.com/dashboard
   - Select your main LifeLine AI project

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the sidebar

3. **Add These Variables:**

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | `https://lifeline-ai-t65t.onrender.com/api/v1` | Production, Preview, Development |
   | `NEXT_PUBLIC_SOCKET_URL` | `https://lifeline-ai-t65t.onrender.com` | Production, Preview, Development |
   | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | `AIzaSyBjQLNLafo9N9NR-5ILfN3YZ5RqWa_di3Q` | Production, Preview, Development |
   | `NEXT_PUBLIC_OFFLINE_MODE` | `false` | Production, Preview, Development |
   | `NEXT_PUBLIC_VOICE_ENABLED` | `true` | Production, Preview, Development |
   | `NEXT_PUBLIC_MULTI_LANGUAGE` | `true` | Production, Preview, Development |

4. **Save and Redeploy**
   - Click "Save" for each variable
   - Go to "Deployments" tab
   - Click "..." menu on the latest deployment
   - Click "Redeploy"

---

### For HMS App

1. **Go to Vercel Dashboard**
   - Select your HMS project (if separate)

2. **Navigate to Settings → Environment Variables**

3. **Add These Variables:**

   | Variable Name | Value | Environment |
   |--------------|-------|-------------|
   | `NEXT_PUBLIC_API_URL` | `https://lifeline-ai-t65t.onrender.com/api/v1` | Production, Preview, Development |
   | `NEXT_PUBLIC_SOCKET_URL` | `https://lifeline-ai-t65t.onrender.com` | Production, Preview, Development |
   | `NEXT_PUBLIC_HOSPITAL_ID` | `HOSP-001` | Production, Preview, Development |

4. **Save and Redeploy**

---

## 🔧 Alternative: Use Vercel CLI

If you prefer command line:

```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Login
vercel login

# Set environment variables for main app
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://lifeline-ai-t65t.onrender.com/api/v1

vercel env add NEXT_PUBLIC_SOCKET_URL production
# When prompted, enter: https://lifeline-ai-t65t.onrender.com

# Redeploy
vercel --prod
```

---

## 📝 What These Variables Do

### `NEXT_PUBLIC_API_URL`
- **Purpose:** Tells your frontend where the backend API is
- **Local value:** `http://localhost:3000/api/v1` (for development)
- **Production value:** `https://lifeline-ai-t65t.onrender.com/api/v1`
- **Used in:** `lib/api.ts` to create axios instance

### `NEXT_PUBLIC_SOCKET_URL`
- **Purpose:** Tells your frontend where to connect WebSocket for real-time features
- **Local value:** `http://localhost:3000`
- **Production value:** `https://lifeline-ai-t65t.onrender.com`
- **Used in:** Emergency tracking, hospital dashboard updates

### `NEXT_PUBLIC_HOSPITAL_ID`
- **Purpose:** Identifies which hospital this HMS instance belongs to
- **Value:** `HOSP-001` (or your actual hospital ID)
- **Used in:** HMS app to filter and display relevant data

---

## ✅ Verification Steps

After setting environment variables and redeploying:

### 1. Check Build Logs
- Go to Vercel Dashboard → Deployments
- Click on the latest deployment
- Look for "Building..." section
- Should see your environment variables are set (Vercel hides values in logs)

### 2. Test API Connection
- Open your deployed app: `https://your-app.vercel.app`
- Open browser DevTools (F12)
- Go to Network tab
- Try to login or load dashboard
- Check if requests are going to `lifeline-ai-t65t.onrender.com` (not localhost)

### 3. Test Login
- Go to login page
- Use the test credentials:
  - Email: `testuser@lifeline.com`
  - Password: `Test123!`
- Should successfully login and redirect to dashboard

---

## 🐛 Troubleshooting

### Issue: Still connecting to localhost after redeploy
**Solution:** 
- Hard refresh the page: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
- Clear browser cache
- Try incognito/private window

### Issue: CORS errors in console
**Solution:**
- Your backend already allows Vercel domains (`.vercel.app`)
- Make sure you're using HTTPS, not HTTP
- Check if backend is awake (Render free tier sleeps after inactivity)

### Issue: 404 errors on API calls
**Solution:**
- Verify the environment variable includes `/api/v1` at the end
- Check the value in Vercel dashboard (Settings → Environment Variables)
- Redeploy after fixing

### Issue: "Network Error" or timeout
**Solution:**
- Wake up backend by visiting: https://lifeline-ai-t65t.onrender.com/api/v1/health
- Render free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up

---

## 📸 Screenshot Guide

### Step 1: Find Environment Variables
![Vercel Dashboard → Settings → Environment Variables]

### Step 2: Add Variable
- Click "Add New" button
- Enter variable name (e.g., `NEXT_PUBLIC_API_URL`)
- Enter value (e.g., `https://lifeline-ai-t65t.onrender.com/api/v1`)
- Select environments: ✅ Production, ✅ Preview, ✅ Development
- Click "Save"

### Step 3: Redeploy
- Go to "Deployments" tab
- Find latest deployment
- Click "..." menu
- Click "Redeploy"
- Wait for deployment to complete

---

## 🎯 Quick Checklist

Before you start:
- [ ] Backend is running: https://lifeline-ai-t65t.onrender.com/api/v1/health
- [ ] You have access to Vercel dashboard
- [ ] You know which project is main app and which is HMS

Setting up Main App:
- [ ] Added `NEXT_PUBLIC_API_URL`
- [ ] Added `NEXT_PUBLIC_SOCKET_URL`
- [ ] Added `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- [ ] Saved all variables
- [ ] Redeployed the app
- [ ] Waited for deployment to complete
- [ ] Tested login with `testuser@lifeline.com` / `Test123!`

Setting up HMS App:
- [ ] Added `NEXT_PUBLIC_API_URL`
- [ ] Added `NEXT_PUBLIC_SOCKET_URL`
- [ ] Added `NEXT_PUBLIC_HOSPITAL_ID`
- [ ] Saved all variables
- [ ] Redeployed the app
- [ ] Waited for deployment to complete
- [ ] Tested HMS dashboard

---

## 💡 Pro Tips

1. **Use Preview and Development too:** When adding variables, select all three environments so they work in preview deployments and local dev with `vercel dev`

2. **Don't commit `.env.local` to git:** These files are in `.gitignore` and should stay local-only

3. **Document your variables:** Keep a secure note of what variables each app needs

4. **Test locally first:** Use `vercel dev` to test with Vercel's environment variables locally

5. **Monitor backend:** Render free tier sleeps, so first request may be slow. Consider upgrading to paid tier for production.

---

## 🔗 Useful Links

- Vercel Environment Variables Docs: https://vercel.com/docs/concepts/projects/environment-variables
- Your Backend Health Check: https://lifeline-ai-t65t.onrender.com/api/v1/health
- Your Backend Dashboard: https://dashboard.render.com/
- Test User Credentials: `testuser@lifeline.com` / `Test123!`

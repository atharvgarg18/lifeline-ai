# Token Expired - Quick Fix Guide

## 🔴 Issue: "Authentication token has expired"

Your JWT token has expired. By default, tokens expire after **1 hour**.

---

## ✅ Immediate Fix (Takes 30 seconds)

### Step 1: Log Out and Log In Again

1. Go to: **http://localhost:3001/login**
2. Click "Log Out" (if there's a logout button)
3. Log in again with your credentials
4. Try creating a consultation again

**This will give you a fresh token that lasts 1 hour.**

---

## 🔧 Permanent Fix: Extend Token Duration

If you don't want tokens to expire so quickly during development, extend the expiry time:

### Option 1: Update Backend .env.local (Recommended for Development)

1. Open `backend/.env.local`
2. Add or update this line:
   ```
   JWT_EXPIRY=24h
   ```
   (This makes tokens last 24 hours)

3. Restart backend:
   ```bash
   cd backend
   # Stop with Ctrl+C, then:
   npm run dev
   ```

4. Log out and log in again to get a new 24-hour token

### Option 2: Make Tokens Last Even Longer

You can use other time formats:
- `JWT_EXPIRY=1h` - 1 hour (default)
- `JWT_EXPIRY=24h` - 24 hours (good for dev)
- `JWT_EXPIRY=7d` - 7 days
- `JWT_EXPIRY=30d` - 30 days

---

## 🎯 Quick Commands

### For Windows (PowerShell):
```powershell
# Add to backend/.env.local
cd backend
echo "JWT_EXPIRY=24h" >> .env.local

# Restart backend
# Press Ctrl+C to stop, then:
npm run dev
```

### Then in Browser:
1. Go to http://localhost:3001/login
2. Log out (or clear localStorage)
3. Log in again
4. Try creating consultation

---

## 🔍 How to Check Token Expiry

Open browser console (F12) and run:
```javascript
const token = localStorage.getItem('ll_token');
if (token) {
  const parts = token.split('.');
  const payload = JSON.parse(atob(parts[1]));
  const expiryDate = new Date(payload.exp * 1000);
  const now = new Date();
  
  console.log('Token expires at:', expiryDate);
  console.log('Current time:', now);
  console.log('Expired?', expiryDate < now ? 'YES' : 'NO');
  console.log('Time remaining:', Math.floor((expiryDate - now) / 60000), 'minutes');
} else {
  console.log('No token found');
}
```

---

## 📋 Complete Fix Steps

1. **Update backend/.env.local**:
   ```
   JWT_EXPIRY=24h
   ```

2. **Restart backend** (Ctrl+C then `npm run dev`)

3. **Clear old token** in browser:
   - Open DevTools (F12)
   - Go to Console tab
   - Run:
     ```javascript
     localStorage.clear()
     ```

4. **Log in again** at http://localhost:3001/login

5. **Try creating consultation** - should work now!

---

## ⚠️ Important Notes

### Why Tokens Expire
- **Security**: Expired tokens can't be used by attackers
- **Session management**: Forces re-authentication periodically

### Production vs Development
- **Development**: Longer expiry is OK (24h or more)
- **Production**: Keep shorter for security (1-4 hours)

### Current Default
- **Access Token**: 1 hour
- **Refresh Token**: 7 days

---

## 🐛 Other Token Issues

### "Invalid authentication token"
**Cause**: Token is malformed or corrupted
**Fix**: Clear localStorage and log in again

### "Authentication token required"
**Cause**: No token in request
**Fix**: Make sure you're logged in

### Token keeps expiring too fast
**Cause**: Backend env not updated or backend not restarted
**Fix**: 
1. Verify `JWT_EXPIRY=24h` is in `backend/.env.local`
2. Restart backend completely
3. Clear browser cache (Ctrl+Shift+R)

---

## ✅ Expected Behavior After Fix

1. **Log in** → Get new token
2. **Token lasts 24 hours** (or whatever you set)
3. **Can create consultations** without auth errors
4. **Don't need to log in again** for 24 hours

---

## 🚀 Quick Test

After applying the fix:

```javascript
// In browser console:
localStorage.getItem('ll_token') // Should show a long string
localStorage.getItem('ll_user')  // Should show user data

// Try creating a consultation
// Should work without "token expired" error
```

---

## 📞 Summary

**Problem**: Token expired (lasted only 1 hour)
**Quick Fix**: Log out and log in again
**Permanent Fix**: Set `JWT_EXPIRY=24h` in `backend/.env.local` and restart backend

**After fix**: Tokens last 24 hours, no more frequent login required during development!

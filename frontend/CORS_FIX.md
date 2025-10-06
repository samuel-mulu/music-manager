# 🔧 CORS Error Fix for Vercel Deployment

## 🚨 Problem Identified

Your Vercel-deployed frontend is trying to connect to `http://localhost:5000` instead of your production backend at `https://music-manager-1.onrender.com`, causing CORS errors.

## 🔍 Root Cause

The environment variable `REACT_APP_BACKEND_URL` is not being properly loaded during the Vercel build process.

## ✅ Solutions Applied

### 1. Fixed Environment Configuration

**File:** `src/config/env.ts`

```typescript
// Before (incorrect)
export const API_URL = config.VITE_API_URL; // Wrong for Create React App

// After (correct)
export const API_URL = config.API_URL; // Correct for Create React App
```

### 2. Enhanced Vercel Configuration

**File:** `vercel.json`

```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "env": {
    "REACT_APP_BACKEND_URL": "https://music-manager-1.onrender.com"
  }
}
```

**File:** `package.json`

```json
{
  "scripts": {
    "vercel-build": "REACT_APP_BACKEND_URL=https://music-manager-1.onrender.com npm run build:production"
  }
}
```

### 3. Added Debug Logging

**File:** `src/config/env.ts`

```typescript
// Debug logging for production
if (process.env.NODE_ENV === "production") {
  console.log("🔗 API URL configured:", API_URL);
  console.log("🌍 Environment:", process.env.NODE_ENV);
  console.log("🔧 REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL);
}
```

## 🚀 Deployment Steps

### Option 1: Redeploy via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click "Redeploy" on the latest deployment
3. Or trigger a new deployment by pushing to your main branch

### Option 2: Redeploy via CLI

```bash
cd frontend
vercel --prod
```

### Option 3: Manual Environment Variable Setup

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add: `REACT_APP_BACKEND_URL` = `https://music-manager-1.onrender.com`
3. Redeploy

## 🔍 Verification Steps

After redeployment, check the browser console for:

```javascript
🔗 API URL configured: https://music-manager-1.onrender.com
🌍 Environment: production
🔧 REACT_APP_BACKEND_URL: https://music-manager-1.onrender.com
```

## 🛠️ Alternative Solutions (if above doesn't work)

### Solution 1: Force Environment Variable in Build

Update `package.json`:

```json
{
  "scripts": {
    "vercel-build": "REACT_APP_BACKEND_URL=https://music-manager-1.onrender.com npm run build:production"
  }
}
```

### Solution 2: Hardcode for Production (Temporary)

In `src/config/env.ts`:

```typescript
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://music-manager-1.onrender.com"
    : process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
```

### Solution 3: Use Runtime Configuration

Create a `public/config.js` file:

```javascript
window.REACT_APP_BACKEND_URL = "https://music-manager-1.onrender.com";
```

Then load it in `public/index.html`:

```html
<script src="%PUBLIC_URL%/config.js"></script>
```

## 🎯 Expected Result

After fixing, your frontend should:

- ✅ Connect to `https://music-manager-1.onrender.com`
- ✅ Load songs successfully
- ✅ Show real-time updates via Socket.IO
- ✅ Display statistics correctly

## 🆘 If Still Not Working

1. **Check Vercel Build Logs:**

   - Go to Vercel Dashboard → Functions → View Logs
   - Look for environment variable loading

2. **Check Browser Network Tab:**

   - Verify API calls are going to the correct URL
   - Check for any remaining CORS errors

3. **Verify Backend CORS:**

   - Ensure your Render backend has the Vercel domain in CORS settings
   - Test backend directly: `https://music-manager-1.onrender.com/health`

4. **Contact Support:**
   - If issues persist, check Vercel's documentation on environment variables
   - Or use the hardcode solution as a temporary fix

---

**🎵 The fix should resolve the CORS errors and connect your frontend to the production backend!**

# STORYNEX — Deployment Guide

**Target Hosting:** Netlify (Frontend) + Firebase Cloud Functions (Backend)

---

## 1. Frontend Deployment (Netlify)

### Step 1: Netlify Build Settings
- **Base directory:** `/`
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### Step 2: Redirects for Single-Page Application (SPA)
Create `public/_redirects`:
```text
/*    /index.html   200
```

### Step 3: Environment Variables
Configure in the Netlify Dashboard under **Site Settings > Environment Variables**:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

---

## 2. Firebase Firestore Rules Deployment
To deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

Verify that access to `/users/{uid}/*` is denied for unauthenticated requests and queries where `request.auth.uid != uid`.

---

## 3. Production Readiness Verification
1. `npm run build` compiles with zero TypeScript errors.
2. Firestore rules reject unauthenticated access.
3. No server secrets (such as service account keys) are bundled into client assets.
4. Gemini API responses fail gracefully with actionable setup notices when no key is set.

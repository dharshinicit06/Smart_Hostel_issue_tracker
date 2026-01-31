# Security & Deployment Notes

## ⚠️ IMPORTANT: API Keys and Confidential Details

### 1. **GEMINI_API_KEY** (Critical)
   - **Location**: Used in `vite.config.ts` for build configuration
   - **Purpose**: Google Generative AI API for the "Suggest Priority" feature
   - **Status**: ❌ NOT CURRENTLY STORED (Empty default)
   - **Action Required**: 
     - Create `.env.local` file in the root directory
     - Add: `GEMINI_API_KEY=your_actual_api_key_here`
     - **NEVER** commit this file to git (it's in `.gitignore`)
     - When deploying, configure API key in your deployment environment (Vercel, Netlify, etc.)

### 2. **User Passwords** (Currently Unencrypted)
   - **Location**: Stored in browser's localStorage via `apiService.ts`
   - **Issue**: Passwords are stored in plain text
   - **⚠️ Security Risk**: This is a demo application - NOT suitable for production
   - **Recommendation for Production**:
     - Implement backend authentication with proper password hashing (bcrypt)
     - Use JWT tokens instead of storing passwords in localStorage
     - Move user authentication to a secure backend server
     - Never store passwords on the client-side

### 3. **LocalStorage Data** (Client-side)
   - **What's stored**:
     - User profiles and authentication data
     - Issues and announcements
     - Lost & Found items
   - **Security Level**: Low (anyone with browser access can inspect)
   - **Recommendation**: 
     - This is fine for a demo/prototype
     - For production, move to a secure database with proper access controls

### 4. **Environment Variables Checklist**

   **Required for Development:**
   ```
   GEMINI_API_KEY=your_google_genai_api_key
   ```

   **For Production Deployment:**
   - Set `GEMINI_API_KEY` in your deployment platform's environment variables
   - Common platforms support:
     - **Vercel**: Settings → Environment Variables
     - **Netlify**: Site settings → Build & deploy → Environment
     - **GitHub Pages**: Not suitable for API keys (static hosting)

### 5. **What's NOT Exposed**
   ✅ No database credentials
   ✅ No AWS/cloud provider keys
   ✅ No third-party service secrets
   ✅ No payment gateway keys

### 6. **Deployment Recommendations**

   **Option 1: Static Hosting (GitHub Pages, Netlify Static)**
   - Safe to deploy - no sensitive data exposed
   - Gemini API key will be embedded in code during build
   - Anyone inspecting the code can see the API key
   - Solution: Use Netlify/Vercel Functions as a backend proxy

   **Option 2: Full Backend (Recommended)**
   - Deploy Node.js/Express backend separately
   - Move authentication to backend
   - Backend handles Gemini API calls
   - Frontend communicates with backend via REST/GraphQL
   - Proper database setup with user management

   **Option 3: Vercel/Netlify with Functions**
   - Deploy frontend
   - Use serverless functions for backend API calls
   - Store GEMINI_API_KEY in platform's environment variables
   - This way the key is never exposed to the client

### 7. **Current Implementation Issues for Production**

   ⚠️ **Critical Issues:**
   1. No password encryption (plain text in localStorage)
   2. All data stored client-side (no persistence)
   3. No user session management
   4. No rate limiting or API security
   5. No data validation on backend

   ✅ **To Fix Before Production:**
   1. Implement proper backend authentication
   2. Use bcrypt for password hashing
   3. Implement JWT or session-based auth
   4. Move Gemini API calls to backend
   5. Add database (MongoDB, PostgreSQL, etc.)
   6. Implement proper error handling and validation

### 8. **Files to Be Careful With**
   - `.env.local` - Contains API keys (NEVER commit)
   - `localStorage` data - Can be inspected in browser DevTools
   - `vite.config.ts` - Contains API key reference

### 9. **Before You Deploy**

   Checklist:
   - [ ] Create `.env.local` file
   - [ ] Add `GEMINI_API_KEY` to `.env.local`
   - [ ] Verify `.env.local` is in `.gitignore`
   - [ ] Test API key works locally
   - [ ] For production deployment, configure API key in your hosting platform
   - [ ] Review `.gitignore` to ensure secrets are excluded
   - [ ] Do NOT hardcode API keys in source files

### 10. **Getting Your Google Gemini API Key**

   1. Go to https://ai.google.dev/
   2. Click "Get API Key"
   3. Create new project or select existing
   4. Copy the API key
   5. Add to `.env.local`:
      ```
      GEMINI_API_KEY=your_key_here
      ```

---

## Summary

✅ **Safe to Deploy**: Current code structure is safe from accidental secret leaks
⚠️ **Not Production Ready**: Needs backend implementation for security
🔐 **Main Action**: Set up `GEMINI_API_KEY` before deployment

# PRODUCTION DEPLOYMENT GUIDE - FURNIQO API

## ⚠️ CRITICAL: Read This First

Your Vercel frontend (`https://the-furniqo.vercel.app`) needs to connect to your Render backend (`https://furniqo-2cos.onrender.com`). This guide walks you through the final steps to make this work seamlessly.

---

## Current Status

✅ **Code Changes Complete:**
- Backend CORS configuration fixed
- Frontend API response parsing standardized
- Environment variable system implemented
- All components updated for new response formats

⏳ **Pending: Deployment**
- Push code to GitHub
- Set environment variables on Render
- Verify deployment on Vercel
- Test end-to-end connectivity

---

## Deployment Roadmap (30 minutes)

### Phase 1: Backend Deployment (10 minutes)

**Step 1: Push backend changes to GitHub**
```bash
cd d:/furniture-web
git status
# You should see changes in backend/server.js

git add backend/
git commit -m "fix: CORS OPTIONS handler and response format standardization"
git push origin main  # or your branch name
```

**Step 2: Configure Render environment variable**
1. Open https://dashboard.render.com
2. Select your Furniqo API service (the one deployed from your GitHub repo)
3. Click **"Environment"** in the left sidebar
4. Click **"Add Environment Variable"**
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** `https://the-furniqo.vercel.app`
5. Click **"Save"** (Render will auto-redeploy)
6. Wait 2-3 minutes for deployment to complete

**Verify backend deployment:**
```bash
curl -i https://furniqo-2cos.onrender.com/api/v1/health
# Should return 200 OK with JSON
```

### Phase 2: Frontend Deployment (10 minutes)

**Step 3: Commit frontend changes**
```bash
git add frontend/
git commit -m "fix: API response parsing and environment-based URL configuration"
git push origin main
```

Vercel will automatically:
- Detect the push
- Run `npm run build` 
- Load `frontend/.env` at build time
- Deploy new version
- Takes 2-3 minutes

**Step 4: Verify frontend deployment**
```bash
# Method 1: Check Vercel dashboard
# Go to https://vercel.com → Your Project → Deployments
# Should see new deployment with green checkmark

# Method 2: Check in browser
curl -i https://the-furniqo.vercel.app
# Should return 200 OK
```

### Phase 3: End-to-End Testing (10 minutes)

**Step 5: Verify everything works together**

1. **Open the website**
   - Go to https://the-furniqo.vercel.app
   - Open DevTools: Press **F12**
   - Go to **Console** tab
   - Refresh page: Press **Ctrl+R** (or Cmd+R)

2. **Look for success indicators**
   ```
   ✅ Health check successful: { success: true, status: 'OK', ... }
   🔍 Health check URL: https://furniqo-2cos.onrender.com/api/v1/health
   ✅ Hero slides API response: { success: true, slides: [...] }
   ✅ Found slides in response.slides
   ✅ Loaded 5 active slides from API
   ```

3. **Verify visual content**
   - Hero section shows actual slide images (not placeholder text)
   - Testimonials section displays actual customer reviews
   - Categories show actual product categories
   - No CSS/layout errors

4. **Check Network tab**
   - Press **Ctrl+Shift+I** or **F12**
   - Go to **Network** tab
   - Refresh page
   - Look for requests to `furniqo-2cos.onrender.com`
   - All should show status 200 or 204 (not 404 or 403)

---

## Verification Checklist

Use this checklist to confirm everything works:

### Backend Verification
- [ ] `curl -i https://furniqo-2cos.onrender.com/api/v1/health` returns 200
- [ ] ALLOWED_ORIGINS environment variable is set on Render
- [ ] Render deployment completed successfully
- [ ] No errors in Render logs (check Service → Logs)

### Frontend Verification
- [ ] Frontend `.env` file is in git (not .gitignored)
- [ ] Frontend deploys successfully on Vercel
- [ ] Browser console shows ✅ logs when visiting site
- [ ] No 403 Forbidden or CORS errors in console
- [ ] No 404 errors for API requests

### Content Verification
- [ ] Hero section displays images from API
- [ ] Testimonials section shows customer reviews
- [ ] Categories section displays product categories
- [ ] Products page loads data from API
- [ ] All images load without CSP errors
- [ ] No layout shifts or missing sections

---

## Troubleshooting

### Problem: "OPTIONS /api/v1/health returns 404"
**Root cause:** CORS preflight failing
**Solution:**
1. Verify `app.options('/api/v1/*', cors(...))` is in `backend/server.js`
2. Ensure it comes BEFORE route definitions
3. Redeploy backend: Push changes and wait for Render deployment

### Problem: "Hero section shows mock data instead of API data"
**Root cause:** API request failing silently
**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for error messages
3. Check Network tab for failed requests
4. Verify `ALLOWED_ORIGINS` is set on Render
5. Verify frontend `.env` has correct `VITE_API_URL`

### Problem: "CORS errors in console: 'Access to XMLHttpRequest has been blocked'"
**Root cause:** Origin not in ALLOWED_ORIGINS
**Solution:**
1. Render dashboard → Service → Environment
2. Check `ALLOWED_ORIGINS` value
3. Should be: `https://the-furniqo.vercel.app`
4. Or for testing: `*`
5. Click Save and wait for redeploy

### Problem: "Images not loading from API"
**Root cause:** Content Security Policy blocking cross-origin images
**Solution:**
1. Check backend `server.js` helmet CSP config
2. Ensure `imgSrc: ["'self'", 'data:', 'https:']` allows all HTTPS images
3. Redeploy backend

### Problem: "Vercel still showing old data"
**Root cause:** Cache or old build
**Solution:**
1. Verify `.env` file is committed to git
2. Trigger redeploy on Vercel:
   - Dashboard → Deployments → Click latest → "Redeploy"
3. Or push a dummy commit: `git commit --allow-empty -m "trigger rebuild"`

---

## Quick Commands Reference

```bash
# Check backend health
curl -i https://furniqo-2cos.onrender.com/api/v1/health

# Test OPTIONS preflight
curl -i -X OPTIONS https://furniqo-2cos.onrender.com/api/v1/health \
  -H "Origin: https://the-furniqo.vercel.app"

# Check frontend deployment
curl -i https://the-furniqo.vercel.app

# Check if environment variable is set (needs SSH access)
ssh into render service and echo $ALLOWED_ORIGINS
# OR check Render dashboard → Environment
```

---

## After Deployment

### Monitor for Issues (24 hours)
- [ ] Check Render logs periodically (Service → Logs)
- [ ] Check Vercel logs (Project → Deployments → Click deployment → Logs)
- [ ] Verify 200 status codes for all API requests
- [ ] Ensure no 5xx errors from backend

### Update Documentation
- [ ] Update team on new API URL if applicable
- [ ] Document any custom environment variables
- [ ] Create runbook for common issues

### Security Check
- [ ] Verify ALLOWED_ORIGINS is set to specific domain (not `*` in production)
- [ ] Check no sensitive data in logs
- [ ] Verify CORS headers are minimal (only needed permissions)

---

## Production Environment

### Current Setup
- **Frontend:** Vercel (https://the-furniqo.vercel.app)
- **Backend:** Render (https://furniqo-2cos.onrender.com)
- **Database:** SQLite (on Render)

### Environment Variables

**Render (Backend)**
```
ALLOWED_ORIGINS=https://the-furniqo.vercel.app
```

**Vercel (Frontend)**
Auto-loaded from `frontend/.env`:
```
VITE_API_URL=https://furniqo-2cos.onrender.com/api/v1
```

### URLs to Monitor
```
Production Frontend:  https://the-furniqo.vercel.app
Production Backend:   https://furniqo-2cos.onrender.com
API Health:          https://furniqo-2cos.onrender.com/api/v1/health
```

---

## Support & Next Steps

### If Deployment Succeeds ✅
- Celebrate! 🎉
- Share the site with stakeholders
- Collect feedback on user experience
- Monitor logs for any issues

### If Issues Occur ❌
1. Check the troubleshooting section above
2. Review browser console logs (F12)
3. Check Render service logs
4. Verify environment variables are set
5. Run curl tests from troubleshooting section
6. Check that both frontend `.env` and Render env var are correct

### For Future Changes
- **To change backend URL:** Update `frontend/.env` and push to git
- **To change ALLOWED_ORIGINS:** Update Render environment variable
- **To add new API endpoints:** Ensure they return `{ success, [dataKey]: [...] }` format

---

## Final Checklist Before Going Live

- [ ] Backend code pushed to GitHub
- [ ] ALLOWED_ORIGINS set on Render (https://the-furniqo.vercel.app)
- [ ] Render deployment completed (green checkmark)
- [ ] Frontend .env committed to git
- [ ] Frontend deployed on Vercel (green checkmark)
- [ ] Browser shows ✅ logs for API calls
- [ ] Hero/testimonials/categories display API data
- [ ] No CORS errors in console
- [ ] All Network requests return 200/204 status
- [ ] Images load correctly
- [ ] Responsive design works on mobile
- [ ] Links and buttons functional

---

## Need Help?

Refer to:
1. `DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
2. `API_INTEGRATION_CHANGES.md` - Summary of code changes
3. Browser DevTools Console - Shows ✅/❌ for each API call
4. Render Dashboard Logs - Backend error messages
5. Vercel Dashboard Logs - Frontend build and deploy errors

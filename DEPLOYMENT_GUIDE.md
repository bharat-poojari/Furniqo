# Furniqo API Deployment & Configuration Guide

## Overview
This guide ensures your Furniqo frontend (deployed on Vercel) properly connects to the backend (deployed on Render) with bulletproof API handling, proper CORS configuration, and environment-based URL switching.

---

## Architecture

### Response Format Standardization
All API responses are now standardized to return:

**Success Format:**
```json
{
  "success": true,
  "slides": [...],     // or "testimonials", "categories", "products", "faqs", etc.
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Error Format:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### Frontend Response Handling
All data-fetching methods in `apiWrapper.js` now return a consistent structure:
```javascript
// Always returns this format:
{
  success: boolean,
  slides: Array,        // or "testimonials", "categories", "products", "faqs"
  [other fields]: value
}
```

---

## Environment Configuration

### Frontend (.env file at `frontend/.env`)
```env
# API Base URL - Change this to switch backends without code changes
VITE_API_URL=https://furniqo-2cos.onrender.com/api/v1

# Or for local development:
# VITE_API_URL=http://localhost:5000/api/v1

# Or for production staging:
# VITE_API_URL=https://your-staging-backend.com/api/v1
```

**IMPORTANT:** This file must be committed to git. Vercel will load it at build time.

### Backend (Render Environment Variables)
1. Go to **Render Dashboard** → Your Service → **Environment**
2. Set the following variable:

```
ALLOWED_ORIGINS=https://the-furniqo.vercel.app
```

Alternatively, for testing across multiple origins:
```
ALLOWED_ORIGINS=https://the-furniqo.vercel.app,https://staging.vercel.app,http://localhost:3000
```

Or for maximum testing flexibility:
```
ALLOWED_ORIGINS=*
```

---

## CORS & Preflight Request Handling

### Backend Changes Applied
The backend now includes:

1. **Explicit OPTIONS handler** for all `/api/v1/*` routes
2. **Wildcard CORS support** when `ALLOWED_ORIGINS=*`
3. **Standard preflight response** with `optionsSuccessStatus: 204`

### How It Works
When your frontend makes an API call to a different origin, the browser first sends an OPTIONS request to check permissions:

```
OPTIONS /api/v1/hero-slides HTTP/1.1
Origin: https://the-furniqo.vercel.app
Access-Control-Request-Method: GET
```

Backend responds with:
```
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://the-furniqo.vercel.app
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH
```

Then the actual GET/POST request proceeds.

---

## Deployment Checklist

### ✅ Backend (Render)

1. **Ensure latest code is pushed to your git repository**
   ```bash
   git add backend/
   git commit -m "fix: CORS and response format standardization"
   git push
   ```

2. **Set environment variable on Render**
   - Dashboard → Service → Environment
   - Add `ALLOWED_ORIGINS=https://the-furniqo.vercel.app`
   - Or for testing: `ALLOWED_ORIGINS=*`

3. **Trigger redeploy** (Render auto-deploys on git push, or manually in dashboard)

4. **Verify backend is running**
   ```bash
   curl -i https://furniqo-2cos.onrender.com/api/v1/health
   ```
   Should return 200 with JSON response.

### ✅ Frontend (Vercel)

1. **Ensure `.env` file is in git** (not `.gitignore`)
   ```bash
   git add frontend/.env
   git commit -m "config: VITE_API_URL for production backend"
   git push
   ```

2. **Optional: Add env variable in Vercel Dashboard** (for sensitive values)
   - Project Settings → Environment Variables
   - This is optional since `.env` is already in git

3. **Trigger redeploy** (Vercel auto-deploys on git push)
   ```bash
   git push  # Vercel auto-detects and builds
   ```

4. **Verify frontend is deployed**
   - Visit https://the-furniqo.vercel.app
   - Check browser console for API debug logs (🔍, ✅, ❌ icons)

---

## Testing & Troubleshooting

### Test 1: Health Check
```bash
# Should return 204 for OPTIONS and 200 for GET
curl -i -X OPTIONS 'https://furniqo-2cos.onrender.com/api/v1/health' \
  -H 'Origin: https://the-furniqo.vercel.app' \
  -H 'Access-Control-Request-Method: GET'

# Should return 200 with JSON
curl -i 'https://furniqo-2cos.onrender.com/api/v1/health'
```

**Expected Response:**
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "status": "OK",
  "message": "Furniqo API is running",
  "version": "2.0.0"
}
```

### Test 2: Hero Slides Endpoint
```bash
curl -i -X GET 'https://furniqo-2cos.onrender.com/api/v1/hero-slides' \
  -H 'Origin: https://the-furniqo.vercel.app'
```

**Expected Response:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://the-furniqo.vercel.app

{
  "success": true,
  "slides": [
    { "id": 1, "title": "...", "image": "...", "is_active": 1, ... },
    ...
  ]
}
```

### Test 3: Frontend Console Logs
1. Open https://the-furniqo.vercel.app in browser
2. Press F12 to open DevTools → Console
3. Look for debug logs starting with:
   - 🔍 (health check URL)
   - ✅ (successful API call)
   - ❌ (failed API call)
   - 📦 (using fallback data)

### Common Issues & Fixes

#### Issue: OPTIONS returns 404
- **Cause**: CORS middleware not configured or not running before routes
- **Fix**: Ensure `app.options('/api/v1/*', cors(...))` is called BEFORE route definitions in `server.js`

#### Issue: No Content-Type header in response
- **Cause**: Missing `headers: { 'Content-Type': 'application/json' }`
- **Fix**: Ensure Express.json() middleware is enabled: `app.use(express.json())`

#### Issue: ALLOWED_ORIGINS env var not recognized
- **Cause**: Environment variable not set on Render
- **Fix**: 
  1. Go to Render Dashboard
  2. Navigate to Service → Environment
  3. Click "Add Environment Variable"
  4. Key: `ALLOWED_ORIGINS`, Value: `https://the-furniqo.vercel.app`
  5. Click "Save"

#### Issue: Data still not displaying despite 200 response
- **Cause**: Response format mismatch or CSP blocking images
- **Fix**: 
  1. Check browser console for logs showing response format
  2. Verify `apiWrapper.getHeroSlides()` returns `{ success: true, slides: [...] }`
  3. Check CSP headers in response (helmet.js might be too restrictive)

---

## API Response Format By Endpoint

All endpoints return one of these formats:

### Hero Slides
```javascript
{
  success: true,
  slides: [
    {
      id: number,
      title: string,
      subtitle: string,
      image: string,  // URL to image
      cta_text: string,
      cta_link: string,
      text_color: string,
      sort_order: number,
      is_active: number  // 0 or 1
    }
  ]
}
```

### Testimonials
```javascript
{
  success: true,
  testimonials: [
    {
      id: number,
      name: string,
      title: string,
      image: string,
      testimonial: string,
      rating: number,
      is_featured: number
    }
  ]
}
```

### Categories
```javascript
{
  success: true,
  categories: [
    {
      id: number,
      name: string,
      description: string,
      icon: string,
      featured: boolean
    }
  ]
}
```

### Products
```javascript
{
  success: true,
  products: [
    {
      id: number,
      name: string,
      description: string,
      price: number,
      image: string,
      category: string,
      // ... other fields
    }
  ],
  total: number,
  page: number,
  totalPages: number
}
```

### FAQs
```javascript
{
  success: true,
  faqs: [
    {
      id: number,
      question: string,
      answer: string,
      category: string,
      sort_order: number
    }
  ]
}
```

---

## Frontend Component Updates

Components have been updated to handle the standardized response format:

### Hero.jsx
- Checks for `response.slides` (primary format from apiWrapper)
- Falls back to mock data if API unavailable
- Logs all data fetching stages

### Categories.jsx
- Checks for `response.categories`
- Includes error handling and loading states

### Testimonials.jsx
- Checks for `response.testimonials`
- Uses mock data fallback

---

## Production Readiness Checklist

- [ ] `.env` file committed to git with `VITE_API_URL` set to production backend
- [ ] Backend ALLOWED_ORIGINS env var set to frontend URL
- [ ] Render backend redeployed with updated CORS middleware
- [ ] Vercel frontend redeployed (triggers auto-build)
- [ ] Browser DevTools show ✅ icons for all API calls
- [ ] Hero slides display from API (not mock data)
- [ ] Images load properly (no CSP blocking)
- [ ] No CORS errors in console
- [ ] Health check endpoint returns 200
- [ ] OPTIONS preflight requests return 204

---

## Quick Command Reference

### Local Development
```bash
# Frontend
cd frontend
VITE_API_URL=http://localhost:5000/api/v1 npm run dev

# Backend  
cd backend
ALLOWED_ORIGINS=http://localhost:3000 npm start
```

### Production Deployment
```bash
# Push code
git add .
git commit -m "production: api standardization"
git push

# Set Render env var via CLI (optional)
# Or use Render dashboard to set ALLOWED_ORIGINS
```

---

## Support

For issues:
1. Check browser console (F12 → Console tab)
2. Check Render logs (Service → Logs)
3. Run curl tests from above
4. Verify environment variables are set correctly

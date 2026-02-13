# Render + GitHub Pages Deployment Guide

## Overview

Deploy your Bible Study app using:
- **Backend** → Render.com (free tier, PostgreSQL included)
- **Frontend** → GitHub Pages (free, fast CDN)

---

## Part 1: Deploy Backend to Render (15 minutes)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render to access your repositories

### Step 2: Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: `biblestudy-db`
   - **Database**: `biblestudy`
   - **User**: `biblestudy`
   - **Region**: Oregon (or closest to you)
   - **Plan**: Free
3. Click "Create Database"
4. Wait for database to be created (~1 minute)
5. **Copy the Internal Database URL** (you'll need this)

### Step 3: Deploy Backend Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `shershunm/BibleStudy`
3. Configure:
   - **Name**: `biblestudy-backend`
   - **Region**: Oregon (same as database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `node server.js`
   - **Plan**: Free

4. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"
   
   ```
   NODE_ENV = production
   DATABASE_URL = [paste your PostgreSQL Internal Database URL]
   ```

5. Click "Create Web Service"
6. Wait for deployment (~3-5 minutes)

### Step 4: Seed the Database

1. Once deployed, go to your backend service
2. Click "Shell" tab (terminal icon)
3. Run these commands one by one:

   ```bash
   # Seed Bible data
   node prisma/seed.js
   ```
   
   Wait for completion, then:
   
   ```bash
   # Seed Strong's Dictionary
   node prisma/seed-strongs.js
   ```
   
   Wait for completion, then:
   
   ```bash
   # Seed Map data
   node prisma/seed-map-data.js
   ```

4. Verify seeding completed successfully in the logs

### Step 5: Test Backend

1. Copy your backend URL (e.g., `https://biblestudy-backend.onrender.com`)
2. Test in browser: `https://your-backend.onrender.com/api/bible/versions`
3. You should see JSON with Bible versions

**✅ Backend is now live!**

---

## Part 2: Deploy Frontend to GitHub Pages (10 minutes)

### Step 6: Update Frontend Configuration

1. **Update `.env.production` file**:
   ```bash
   VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   VITE_API_URL=https://your-backend.onrender.com
   ```
   
   Replace `your_mapbox_token_here` with your actual Mapbox token
   Replace `your-backend.onrender.com` with your actual Render backend URL

### Step 7: Install Dependencies

```bash
cd frontend
npm install
```

This will install the `gh-pages` package needed for deployment.

### Step 8: Build and Deploy

```bash
# Build the production version
npm run build

# Deploy to GitHub Pages
npm run deploy
```

The deploy script will:
- Build your app
- Create a `gh-pages` branch
- Push the built files to GitHub

### Step 9: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/shershunm/BibleStudy`
2. Click "Settings"
3. Scroll to "Pages" in the left sidebar
4. Under "Source", select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
5. Click "Save"
6. Wait 1-2 minutes for deployment

### Step 10: Access Your App

Your app will be live at:
```
https://shershunm.github.io/BibleStudy/
```

---

## Part 3: Testing (10 minutes)

### Test All Features

Visit your deployed app and test:

- [ ] **User Registration/Login**
  - Create account
  - Log in
  
- [ ] **Bible Reading**
  - Navigate to a book/chapter
  - Verify verses load
  - Switch languages (EN/UA)

- [ ] **Maps**
  - Click "Maps" in sidebar
  - Verify map loads with markers
  - Search for "Jerusalem"
  - Test journey visualization

- [ ] **Strong's Dictionary**
  - Click a Strong's number
  - Verify definition appears

- [ ] **Notes**
  - Add a verse note
  - Create a sermon note
  - Verify notes save

---

## Troubleshooting

### Frontend Can't Connect to Backend

**Symptoms**: API errors, no data loading

**Fix**:
1. Verify `VITE_API_URL` in `.env.production` is correct
2. Rebuild and redeploy:
   ```bash
   npm run build
   npm run deploy
   ```

### CORS Errors

**Symptoms**: "CORS policy" errors in browser console

**Fix**: Update `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://shershunm.github.io',
  credentials: true
}));
```

Then redeploy backend on Render (it auto-deploys on git push).

### Maps Not Loading

**Symptoms**: Blank map

**Fix**:
1. Verify Mapbox token in `.env.production`
2. Check browser console for errors
3. Rebuild and redeploy

### Backend Sleeping (Free Tier)

**Symptoms**: Slow first load (15-30 seconds)

**Explanation**: Render free tier spins down after 15 minutes of inactivity. First request wakes it up.

**Solutions**:
- Upgrade to paid plan ($7/month, no sleep)
- Use a ping service to keep it awake
- Accept the delay (normal for free tier)

---

## Updating Your App

### Update Frontend

```bash
cd frontend
# Make your changes
npm run build
npm run deploy
```

### Update Backend

```bash
# Make your changes
git add .
git commit -m "your changes"
git push origin main
```

Render auto-deploys on push to main branch.

---

## Cost Breakdown

### Free Tier
- **Render Backend**: Free (750 hours/month)
- **Render PostgreSQL**: Free
- **GitHub Pages**: Free unlimited
- **Total**: $0/month

### Limitations
- Backend spins down after 15 min inactivity
- 750 hours/month backend runtime
- PostgreSQL: 1GB storage, 97 connections

---

## Custom Domain (Optional)

### For GitHub Pages

1. Go to repo Settings → Pages
2. Add custom domain (e.g., `biblestudy.com`)
3. Add CNAME record in your DNS:
   ```
   CNAME @ shershunm.github.io
   ```

### For Render Backend

1. Go to backend service → Settings
2. Add custom domain (e.g., `api.biblestudy.com`)
3. Add CNAME record in your DNS:
   ```
   CNAME api your-backend.onrender.com
   ```

---

## Summary

**Your app is now deployed!**

- ✅ Backend: `https://your-backend.onrender.com`
- ✅ Frontend: `https://shershunm.github.io/BibleStudy/`
- ✅ Database: PostgreSQL on Render
- ✅ HTTPS: Automatic on both platforms
- ✅ Cost: $0/month

**Next Steps:**
1. Test all features thoroughly
2. Share your app URL
3. Consider custom domain
4. Monitor usage in Render dashboard

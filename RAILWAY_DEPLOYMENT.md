# Railway Deployment Guide - Full Stack

## Quick Start (5 Minutes)

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### 2. Deploy Backend

1. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `shershunm/BibleStudy`

2. **Configure Backend Service**
   - Railway will detect the monorepo
   - Set **Root Directory**: `backend`
   - Railway will auto-detect Node.js

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically creates `DATABASE_URL` variable

4. **Set Environment Variables**
   - Go to backend service → Variables
   - Add:
     ```
     NODE_ENV=production
     PORT=5000
     ```
   - `DATABASE_URL` is automatically set by Railway

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)

6. **Seed Database**
   - Go to backend service → Settings → Deploy
   - Run one-off command:
     ```bash
     npm run seed:all
     ```

### 3. Deploy Frontend

1. **Add Frontend Service**
   - In the same project, click "New" → "GitHub Repo"
   - Select the same repository
   - Set **Root Directory**: `frontend`

2. **Set Environment Variables**
   - Go to frontend service → Variables
   - Add:
     ```
     VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
     VITE_API_URL=https://your-backend-url.railway.app
     ```
   - Replace `your_mapbox_token_here` with your actual Mapbox token
   - Replace `your-backend-url` with your actual backend URL from step 2

3. **Deploy**
   - Click "Deploy"
   - Wait for build (~2-3 minutes)

### 4. Access Your App

- Frontend: `https://your-frontend.railway.app`
- Backend API: `https://your-backend.railway.app/api`

---

## Detailed Configuration

### Backend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Auto-set by Railway | PostgreSQL connection string |
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `5000` | Server port (Railway auto-assigns) |

### Frontend Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_MAPBOX_ACCESS_TOKEN` | Your Mapbox token | Map functionality |
| `VITE_API_URL` | Backend Railway URL | API endpoint |

---

## Database Migrations

Railway automatically runs migrations on deploy via the `build` script in `package.json`:

```json
"build": "npx prisma generate && npx prisma migrate deploy"
```

### Manual Migration (if needed)

1. Go to backend service → Settings
2. Click "Deploy" tab
3. Run command:
   ```bash
   npx prisma migrate deploy
   ```

---

## Seeding the Database

After first deployment, seed the database with Bible data:

1. Go to backend service → Settings → Deploy
2. Run one-off commands in order:
   ```bash
   node prisma/seed.js
   node prisma/seed-strongs.js
   node prisma/seed-map-data.js
   ```

Or use the combined script:
```bash
npm run seed:all
```

---

## Custom Domain (Optional)

### Frontend Domain

1. Go to frontend service → Settings → Domains
2. Click "Generate Domain" for free `.railway.app` subdomain
3. Or click "Custom Domain" to add your own:
   - Enter your domain (e.g., `biblestudy.com`)
   - Add CNAME record to your DNS:
     ```
     CNAME @ your-app.railway.app
     ```

### Backend Domain

1. Go to backend service → Settings → Domains
2. Generate domain (e.g., `api.biblestudy.com`)
3. Update frontend `VITE_API_URL` to new domain

---

## Monitoring & Logs

### View Logs

1. Go to service → Deployments
2. Click on active deployment
3. View real-time logs

### Metrics

- CPU usage
- Memory usage
- Network traffic
- Request count

Available in service → Metrics tab

---

## Troubleshooting

### Build Fails

**Check logs for errors:**
- Missing dependencies? Run `npm install` locally first
- Prisma errors? Ensure schema is valid
- Environment variables missing? Add them in Railway dashboard

### Database Connection Errors

**Verify:**
- PostgreSQL service is running
- `DATABASE_URL` is set correctly
- Database is seeded

**Fix:**
```bash
# In Railway backend service terminal
npx prisma migrate deploy
npm run seed:all
```

### Frontend Can't Connect to Backend

**Check:**
- `VITE_API_URL` points to correct backend URL
- Backend is deployed and running
- CORS is configured in `server.js`

**Fix:**
1. Get backend URL from Railway dashboard
2. Update frontend environment variable
3. Redeploy frontend

### Maps Not Loading

**Verify:**
- `VITE_MAPBOX_ACCESS_TOKEN` is set
- Token is valid and has quota
- Token is public (starts with `pk.`)

---

## Automatic Deployments

Railway automatically deploys when you push to GitHub:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push origin main
   ```
3. Railway detects push and auto-deploys

### Disable Auto-Deploy (Optional)

1. Go to service → Settings → Deploy
2. Toggle "Auto Deploy" off
3. Deploy manually when ready

---

## Cost Estimation

### Free Tier ($5/month credit)

- **Backend**: ~$2-3/month
- **Frontend**: ~$1-2/month  
- **PostgreSQL**: Free
- **Total**: ~$3-5/month (within free tier)

### Paid Plans

If you exceed free tier:
- **Hobby**: $5/month per service
- **Pro**: $20/month per service

---

## Alternative: Render

If Railway doesn't work, try **Render**:

1. Go to [render.com](https://render.com)
2. Create "Web Service" for backend
3. Create "Static Site" for frontend
4. Add PostgreSQL database (free)
5. Configure environment variables
6. Deploy

Similar process, slightly different UI.

---

## Backup Strategy

### Database Backups

Railway automatically backs up PostgreSQL:
- Point-in-time recovery
- 7-day retention (free tier)
- 30-day retention (paid)

### Manual Backup

```bash
# Export database
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Verify maps load correctly
3. ✅ Test user registration/login
4. ✅ Check Bible data is seeded
5. ✅ Test Strong's dictionary
6. ✅ Verify note-taking works
7. ✅ Configure custom domain (optional)
8. ✅ Set up monitoring alerts (optional)

---

## Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Project Issues**: https://github.com/shershunm/BibleStudy/issues

---

**Your app is now live and accessible worldwide! 🎉**

# Deployment Guide

This guide covers deploying the Foundational Bible Study application to various platforms.

## Table of Contents
- [Vercel (Recommended)](#vercel-recommended)
- [Netlify](#netlify)
- [GitHub Pages](#github-pages)
- [Traditional Server](#traditional-server)
- [Docker](#docker)

---

## Vercel (Recommended)

Vercel offers the easiest deployment for the frontend with automatic builds and HTTPS.

### Frontend Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel dashboard**
   - Go to your project settings
   - Add `VITE_MAPBOX_ACCESS_TOKEN`

### Backend Deployment

For the backend, use Vercel Serverless Functions or deploy to a separate service like Railway, Render, or Heroku.

**Option 1: Vercel Serverless (Requires refactoring)**
- Convert Express routes to serverless functions
- Use Vercel Postgres or external database

**Option 2: Railway (Recommended for backend)**
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select the `backend` directory
4. Add environment variables
5. Deploy

---

## Netlify

### Frontend Deployment

1. **Build configuration** (netlify.toml already included)

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   cd frontend
   npm run build
   netlify deploy --prod
   ```

3. **Or connect GitHub repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/dist`
   - Add environment variables in Netlify dashboard

### Backend
Deploy backend separately using Railway, Render, or Heroku (same as Vercel option).

---

## GitHub Pages

GitHub Pages only supports static sites, so you'll need to:
1. Deploy frontend to GitHub Pages
2. Deploy backend to a separate service

### Frontend to GitHub Pages

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     base: '/BibleStudy/', // Your repo name
     // ... rest of config
   })
   ```

2. **Build and deploy**
   ```bash
   cd frontend
   npm run build
   
   # Deploy dist folder to gh-pages branch
   npx gh-pages -d dist
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Save

4. **Update API URLs**
   - Change all `http://localhost:5000` to your backend URL
   - Or use environment variables

### Backend
Deploy to Railway, Render, or Heroku.

---

## Traditional Server (VPS/Dedicated)

For deploying to your own server (Ubuntu/Debian):

### Prerequisites
- Ubuntu 20.04+ or Debian 11+
- Node.js 18+
- Nginx
- PM2 (process manager)

### Setup

1. **Install dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx
   sudo npm install -g pm2
   ```

2. **Clone and setup**
   ```bash
   git clone https://github.com/YOUR_USERNAME/BibleStudy.git
   cd BibleStudy
   
   # Backend
   cd backend
   npm install
   npx prisma db push
   node prisma/seed.js
   node prisma/seed-strongs.js
   node prisma/seed-map-data.js
   
   # Frontend
   cd ../frontend
   npm install
   npm run build
   ```

3. **Start backend with PM2**
   ```bash
   cd backend
   pm2 start server.js --name bible-study-api
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/biblestudy
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       # Frontend
       location / {
           root /path/to/BibleStudy/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/biblestudy /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Docker

### Docker Compose Setup

1. **Create docker-compose.yml** (already included in project)

2. **Build and run**
   ```bash
   docker-compose up -d
   ```

3. **Access application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Individual Docker Images

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 5000
CMD ["node", "server.js"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Environment Variables

### Production Frontend (.env.production)
```bash
VITE_MAPBOX_ACCESS_TOKEN=your_production_mapbox_token
VITE_API_URL=https://your-backend-url.com
```

### Production Backend (.env.production)
```bash
DATABASE_URL="file:./production.db"
# Or use PostgreSQL for production:
# DATABASE_URL="postgresql://user:password@host:5432/dbname"
PORT=5000
NODE_ENV=production
```

---

## Database Considerations

### SQLite (Development)
- Good for: Development, small deployments
- Limitations: Single file, not suitable for high traffic

### PostgreSQL (Production Recommended)
1. **Update schema.prisma**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Migrate database**
   ```bash
   npx prisma migrate dev
   ```

3. **Use managed PostgreSQL**
   - Vercel Postgres
   - Railway Postgres
   - Supabase
   - AWS RDS

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database seeded with Bible data
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured for production domain
- [ ] Error logging set up
- [ ] Backup strategy in place
- [ ] Monitoring configured (optional)
- [ ] Custom domain configured (if applicable)

---

## Troubleshooting

### Frontend not connecting to backend
- Check CORS settings in `server.js`
- Verify API URL in frontend environment variables
- Check browser console for errors

### Maps not loading
- Verify Mapbox token is set correctly
- Check token has sufficient quota
- Verify token is public (starts with `pk.`)

### Database errors
- Ensure database is seeded
- Check Prisma schema matches database
- Run `npx prisma generate` after schema changes

---

## Support

For deployment issues, please:
1. Check the [Issues](https://github.com/YOUR_USERNAME/BibleStudy/issues) page
2. Open a new issue with deployment logs
3. Contact the maintainers

---

**Happy Deploying! 🚀**

# SQ Agriculture Website - Progress Tracker

## Last Updated: 2026-05-10

---

## ✅ COMPLETED

### Phase 1: Database Migration (SQLite → MySQL via XAMPP) ✓
1. **XAMPP MySQL setup** - Created `sq_agriculture` database
2. **Prisma schema** - Changed provider from `sqlite` to `mysql`
3. **Environment** - Updated `DATABASE_URL` to `mysql://root:@localhost:3306/sq_agriculture`
4. **JWT secrets** - Generated cryptographically secure random secrets
5. **Schema push** - All tables created in MySQL successfully
6. **Database seed** - All products, users, categories, blog posts, leads seeded

### Phase 2: Production Builds ✓
1. **NestJS API** - Built to `apps/api/dist/` (production mode)
2. **Next.js Frontend** - Built to `apps/web/.next/` (all 50+ pages)

### Phase 3: Startup Scripts ✓
1. **`start-production.ps1`** - Starts XAMPP MySQL + API (3001) + Web (3000)
2. **`stop-production.ps1`** - Stops API + Web servers
3. **`start-production.bat`** - Double-click wrapper
4. **`stop-production.bat`** - Double-click wrapper

### Phase 4: Production Config ✓
1. **Secure JWT secrets** - No more hardcoded dev secrets
2. **Production .env** - Updated with secure values
3. **Image assets** - All product images in place

---

## 📍 CURRENT STATUS: ✅ Production-Ready (Local)

The website is ready to run locally in production mode using XAMPP MySQL.

### How to Run
```
Double-click: start-production.bat
OR
PowerShell: .\start-production.ps1

Access at: http://localhost:3000
Admin at:  http://localhost:3000/admin
API Docs:  http://localhost:3001/api/docs
```

### Credentials
- **Admin:** admin@sqagriculture.com / admin123
- **Manager:** manager@sqagriculture.com / manager123

---

## 🚀 NEXT STEPS

### Option A: Deploy Backend to Railway (Public API)
1. Push code to GitHub
2. Go to https://railway.app → New Project → Deploy from GitHub
3. Add PostgreSQL plugin
4. Set env vars (see `apps/api/.env` for reference)
5. Deploy & note the Railway URL
6. Set `NEXT_PUBLIC_API_URL` in Vercel to the Railway URL

### Option B: Deploy to VPS (Full Control)
1. Install Node.js 18+ and MySQL on VPS
2. Copy project files
3. Configure MySQL database and user
4. Run `npm install` and `npm run build`
5. Set up PM2 or systemd to keep servers running
6. Configure Nginx as reverse proxy (see `DEPLOYMENT.md`)

---

## 📁 Project Locations

- **Local Code**: `E:\sq agriculture website\sq-agriculture`
- **Materials Folder**: `E:\sq agriculture website\Materials` (product images)
- **GitHub**: https://github.com/PavelNahiyan/sq-agriculture
- **Vercel**: https://sq-agriculture.vercel.app (Frontend only - needs API backend)

---

## 📋 Project Details

### Database
- **Engine:** MySQL 8+ (via XAMPP MariaDB)
- **Name:** `sq_agriculture`
- **Host:** localhost:3306
- **User:** root (no password for local)

### Architecture
```
sq-agriculture/
├── apps/
│   ├── web/          # Next.js 14 → localhost:3000
│   └── api/          # NestJS       → localhost:3001
├── start-production.bat    ← Double-click to start
├── stop-production.bat     ← Double-click to stop
├── start-production.ps1
└── stop-production.ps1
```

## Deployments

| Service | URL | Status |
|---------|-----|--------|
| Railway API | `https://sq-agricultureapi-production.up.railway.app` | ✅ Running |
| Vercel Frontend | `https://sq-agriculture.vercel.app` | ✅ Deployed |
| Custom Domain | `https://sqagriculture.com` | ⚠️ DNS not configured (needs A record → 76.76.21.21) |
| Database | Railway PostgreSQL | ✅ Seeded |

## Railway Env Vars Set

- `NODE_ENV=production`, `CORS_ORIGIN`, `FRONTEND_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Vercel Env Vars Set

- `NEXT_PUBLIC_API_URL=https://sq-agricultureapi-production.up.railway.app`
- `NEXT_PUBLIC_APP_URL=https://sq-agriculture.vercel.app`

## Cloudinary Integration

- `cloudinary.provider.ts` — NestJS provider wrapping Cloudinary SDK
- `uploads.service.ts` — uploadSingle/Multiple/FromUrl methods
- `uploads.controller.ts` — POST endpoints for file uploads
- `next.config.js` — added `res.cloudinary.com` to remote patterns

## Remaining

1. Add A record `sqagriculture.com → 76.76.21.21` at Namecheap
2. Delete `@sq-agriculture/web` from Railway dashboard (FAILED, unnecessary)
3. Verify Railway deploys new code from GitHub push (currently QUEUED)
4. Test Cloudinary upload endpoints after Railway deploys
```
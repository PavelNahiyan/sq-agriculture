# Step-by-Step Railway Deployment Guide

## Step 1: Fix Railway Config (Done)
The config has been pushed to GitHub. It fixes the npm ci error.

## Step 2: Redeploy on Railway

1. Go to [railway.app](https://railway.app)
2. Open your project
3. Go to **Deployments** tab
4. Click **Redeploy** on the latest deployment
5. Wait for it to complete (may take 3-5 minutes)

## Step 3: Get Your Railway URL

After deployment completes:
1. Click on the deployed service
2. Look for **Domains** section on the right
3. Copy the URL (e.g., `https://sq-agriculture-api-xxxx.up.railway.app`)

## Step 4: Add Railway Environment Variables

In Railway dashboard, go to your service **Variables** tab and add:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@postgres.railway.internal:5432/railway
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=production
CORS_ORIGIN=https://sq-agriculture-web.vercel.app
FRONTEND_URL=https://sq-agriculture-web.vercel.app
```

> **Important**: Get the DATABASE_URL from your Railway PostgreSQL plugin!

## Step 5: Update Vercel

Once you have the Railway URL, I can update Vercel. Just provide me the Railway URL and I'll run:

```
vercel env add NEXT_PUBLIC_API_URL production <YOUR_RAILWAY_URL>
```

---

## Troubleshooting

### "npm ci" error - FIXED ✓
The railway.json now uses `npm install` instead of `npm ci`

### Database not connecting
- Make sure PostgreSQL plugin is added to Railway
- Make sure DATABASE_URL is set correctly

### Need help?
Share what error you're seeing and I'll guide you through.
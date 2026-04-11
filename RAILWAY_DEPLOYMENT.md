# Railway Deployment - Environment Variables Reference

# ===========================================
# NESTJS BACKEND (Railway)
# ===========================================

# Database - Get this from Railway PostgreSQL plugin
DATABASE_URL=postgresql://postgres:password@railway-host:5432/sq_agriculture

# JWT Secrets - Generate secure strings (use: openssl rand -base64 32)
JWT_SECRET=your-64-character-random-string-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-64-character-random-string-here
JWT_REFRESH_EXPIRES_IN=30d
JWT_RESET_SECRET=your-random-password-reset-secret
JWT_VERIFY_SECRET=your-random-email-verify-secret

# URLs - Replace with your actual URLs after deployment
FRONTEND_URL=https://sq-agriculture-web.vercel.app
API_URL=https://your-railway-api-url.up.railway.app
NODE_ENV=production

# SMTP (optional - for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=SQ Agriculture <noreply@sqagriculture.com>

# CORS - Update to your Vercel frontend URL
CORS_ORIGIN=https://sq-agriculture-web.vercel.app

# ===========================================
# NEXTJS FRONTEND (Vercel)
# ===========================================

# Update this to your Railway API URL after deployment
NEXT_PUBLIC_API_URL=https://your-railway-api-url.up.railway.app
NEXT_PUBLIC_APP_URL=https://sq-agriculture-web.vercel.app
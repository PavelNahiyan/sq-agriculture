# Local Development Guide

## Quick Start

### Option 1: Using Batch File (Recommended)
```bash
# Navigate to the web folder
cd sq-agriculture/apps/web

# Run the batch file (double-click in File Explorer or run from terminal)
start-server.bat
```

### Option 2: Manual Commands
```bash
cd sq-agriculture/apps/web
npm run build
npm run start
```

## Access

| Service | URL |
|---------|-----|
| **Website** | http://localhost:3000 |
| **Admin Panel** | http://localhost:3000/admin |
| **Login** | admin@sq-agriculture.com / admin123 |

## Troubleshooting

### If port 3000 is in use
```bash
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### If images not loading
- All image paths have been verified and fixed
- If you see 404 for images, check the file exists in `public/uploads/`

### To restart fresh
```bash
# Clear Next.js cache and rebuild
rmdir /s /q .next
npm run build
npm run start
```

## Notes

- Server runs on **http://localhost:3000**
- Keep the terminal window open to keep server running
- Admin panel requires login credentials above
- No database required (uses static data)
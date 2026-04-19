@echo off
title SQ Agriculture Local Server
cd /d "%~dp0"
echo Starting SQ Agriculture Website...
echo.
echo URL: http://localhost:3000
echo Admin: http://localhost:3000/admin  
echo.
echo To stop: Press Ctrl+C or close this window
echo.
npm run start
pause
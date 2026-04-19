@echo off
echo ============================================
echo   SQ Agriculture Website - Local Server
echo ============================================
echo.
echo Starting build...
cd /d "%~dp0"

echo.
echo [1/2] Building the project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo BUILD FAILED!
    pause
    exit /b 1
)

echo.
echo [2/2] Starting server...
echo.
echo Website: http://localhost:3000
echo Admin:   http://localhost:3000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run start
@echo off
echo ============================================
echo   Video Conferencing System - Quick Start
echo ============================================
echo.

echo Starting Backend...
start cmd /k "cd /d d:\hc101\backend && echo Backend starting... && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting Patient Frontend...
start cmd /k "cd /d d:\hc101 && echo Patient Frontend starting... && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting HMS...
start cmd /k "cd /d d:\hc101\hms && echo HMS starting... && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo   All services are starting!
echo ============================================
echo.
echo   Wait ~30 seconds for all services to be ready
echo.
echo   Then open:
echo   - Patient: http://localhost:3001/patient/consultation
echo   - HMS:     http://localhost:3002/dashboard/consultations
echo.
echo   Press any key to open browser windows...
pause >nul

echo.
echo Opening browser windows...
timeout /t 2 /nobreak >nul

start http://localhost:3001/patient/consultation
timeout /t 1 /nobreak >nul
start http://localhost:3002/dashboard/consultations

echo.
echo ============================================
echo   Browser windows opened!
echo ============================================
echo.
echo   Follow the testing guide:
echo   1. Patient: Start consultation
echo   2. HMS: Join call
echo   3. Verify video connection
echo.
echo   Press any key to exit...
pause >nul

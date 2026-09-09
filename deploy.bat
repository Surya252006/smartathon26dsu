@echo off
title Smartathon'26 - Firebase Hosting Deployment
color 0A
echo ======================================================================
echo    SMARTATHON'26: AI SCHOLARSHIP ELIGIBILITY MATCHER
echo    Deploying to Firebase Project: tnscheme-ai-dsu-oneyes
echo ======================================================================
echo.
echo [1/3] Verifying / Logging in to Firebase CLI...
call firebase login
if %errorlevel% neq 0 (
    echo [ERROR] Firebase login was not completed. Please try again.
    pause
    exit /b %errorlevel%
)
echo.
echo [2/3] Building latest frontend production bundle...
cd frontend
call npm run build
cd ..
echo.
echo [3/3] Deploying production bundle to Firebase Hosting...
call firebase deploy --only hosting --project tnscheme-ai-dsu-oneyes
echo.
echo ======================================================================
echo    LIVE URL: https://tnscheme-ai-dsu-oneyes.web.app
echo    SUCCESSFULLY DEPLOYED TO FIREBASE!
echo ======================================================================
echo.
pause

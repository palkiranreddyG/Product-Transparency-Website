@echo off
echo ========================================
echo   ClearChoice Insight Setup Script
echo ========================================
echo.

echo [1/4] Creating environment files...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✅ Backend .env created - Please edit with your database credentials
) else (
    echo ✅ Backend .env already exists
)

if not exist "frontend\.env" (
    copy "frontend\env.example" "frontend\.env"
    echo ✅ Frontend .env created
) else (
    echo ✅ Frontend .env already exists
)

echo.
echo [2/4] Environment files ready!
echo.
echo 🔧 NEXT STEPS:
echo 1. Edit backend\.env with your Neon.tech database credentials
echo 2. Run the database schema from backend\schema.sql in Neon.tech console
echo 3. Run start-dev.bat to start all services
echo.
echo 📚 For detailed setup, see SETUP.md
echo.
pause


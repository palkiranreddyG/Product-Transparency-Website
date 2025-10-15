@echo off
echo Starting ClearChoice Insight Development Environment...
echo.

echo Starting AI Service (Port 8000)...
start "AI Service" cmd /k "cd ai-service && python main.py"

timeout /t 3 /nobreak > nul

echo Starting Backend API (Port 3001)...
start "Backend API" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend (Port 8080)...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting up...
echo - AI Service: http://localhost:8000
echo - Backend API: http://localhost:3001
echo - Frontend: http://localhost:8080
echo.
echo Press any key to exit...
pause > nul


#!/bin/bash

echo "Starting ClearChoice Insight Development Environment..."
echo

# Function to start service in background
start_service() {
    local name=$1
    local dir=$2
    local cmd=$3
    local port=$4
    
    echo "Starting $name (Port $port)..."
    cd $dir
    $cmd &
    cd ..
    sleep 2
}

# Start AI Service
start_service "AI Service" "ai-service" "python main.py" "8000"

# Start Backend
start_service "Backend API" "backend" "npm run dev" "3001"

# Start Frontend
start_service "Frontend" "frontend" "npm run dev" "8080"

echo
echo "All services are starting up..."
echo "- AI Service: http://localhost:8000"
echo "- Backend API: http://localhost:3001" 
echo "- Frontend: http://localhost:8080"
echo
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait


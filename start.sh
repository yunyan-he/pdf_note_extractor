#!/bin/bash

# Function to kill processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

echo "Starting PDF Note Extractor..."

# Check if venv exists
if [ -d "backend/venv" ]; then
    source backend/venv/bin/activate
else
    echo "Warning: backend/venv not found. Assuming Python environment is set up."
fi

# Start Backend
echo "Starting Backend..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for servers to initialize (adjust time as needed)
echo "Waiting for servers to start..."
sleep 5

# Open Browser (macOS)
echo "Opening Browser..."
open http://localhost:5173

echo "App is running! Press Ctrl+C to stop."

# Keep script running to maintain background processes
wait

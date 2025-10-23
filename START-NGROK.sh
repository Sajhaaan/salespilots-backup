#!/bin/bash

echo "🚀 Starting Instagram DM Auto-Reply System"
echo "=========================================="
echo ""

# Kill any existing ngrok processes
pkill -f "ngrok http" 2>/dev/null

# Start ngrok
echo "Starting ngrok tunnel on port 3000..."
echo ""
./ngrok http 3000 --log=stdout


#!/bin/bash
# VocalLab AI Setup Script
# Automated setup for development environment

set -e

echo "🎵 VocalLab AI - Setup Script"
echo "=============================="

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install Node.js v16+"
    exit 1
fi
echo "  Node $(node --version)"

# Check npm
echo "✓ Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm not found. Please install npm v7+"
    exit 1
fi
echo "  npm $(npm --version)"

# Check FFmpeg
echo "✓ Checking FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠ FFmpeg not found. Please install FFmpeg"
    echo "  macOS: brew install ffmpeg"
    echo "  Ubuntu: sudo apt-get install ffmpeg"
    echo "  Windows: choco install ffmpeg"
else
    echo "  FFmpeg installed"
fi

# Check MongoDB
echo "✓ Checking MongoDB..."
if ! command -v mongosh &> /dev/null; then
    echo "⚠ MongoDB not found. Please install MongoDB"
    echo "  Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
else
    echo "  MongoDB installed"
fi

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd server
if [ -f ".env" ]; then
    echo "  .env already exists, skipping"
else
    cp .env.example .env
    echo "  Created .env (please update with your configuration)"
fi

echo "  Installing dependencies..."
npm install
echo "  ✓ Backend setup complete"

# Setup Frontend
echo ""
echo "⚛️  Setting up Frontend..."
cd ../client
if [ -f ".env" ]; then
    echo "  .env already exists, skipping"
else
    cp .env.example .env
    echo "  Created .env"
fi

echo "  Installing dependencies..."
npm install
echo "  ✓ Frontend setup complete"

cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update configuration in server/.env and client/.env"
echo "  2. Start MongoDB service"
echo "  3. Run: npm run dev (from server directory)"
echo "  4. Run: npm start (from client directory)"
echo ""
echo "📚 Documentation: https://github.com/ibujohn00-ops/Vocal-preset-engine"
echo ""

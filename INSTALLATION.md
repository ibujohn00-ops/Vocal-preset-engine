# VocalLab AI - Installation Guide

## Prerequisites

### System Requirements
- **Node.js**: v16.0 or higher
- **npm**: v7.0 or higher
- **MongoDB**: v4.4 or higher (local or cloud)
- **FFmpeg**: v4.2 or higher
- **Git**: Latest version

### Supported Operating Systems
- macOS (Intel/Apple Silicon)
- Linux (Ubuntu, Debian, CentOS)
- Windows 10/11

## Step 1: Install FFmpeg

FFmpeg is required for audio processing.

### macOS
```bash
# Using Homebrew
brew install ffmpeg

# Verify installation
ffmpeg -version
```

### Ubuntu/Debian
```bash
# Update package manager
sudo apt-get update

# Install FFmpeg
sudo apt-get install ffmpeg

# Verify installation
ffmpeg -version
```

### CentOS/RHEL
```bash
# Using yum (enable EPEL first)
sudo yum install epel-release
sudo yum install ffmpeg

# Verify installation
ffmpeg -version
```

### Windows
**Option 1: Using Chocolatey**
```bash
choco install ffmpeg
```

**Option 2: Manual Installation**
1. Download from https://ffmpeg.org/download.html
2. Extract to `C:\ffmpeg`
3. Add to PATH: `C:\ffmpeg\bin`
4. Verify: Open PowerShell and run `ffmpeg -version`

## Step 2: Install MongoDB

### Option A: Local MongoDB

**macOS**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Windows**
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Run the installer
3. Follow the setup wizard
4. MongoDB will start as a service

### Option B: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## Step 3: Clone Repository

```bash
git clone https://github.com/ibujohn00-ops/Vocal-preset-engine.git
cd Vocal-preset-engine
```

## Step 4: Setup Backend

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### .env Configuration

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/vocallab

# Authentication
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=104857600  # 100MB in bytes
UPLOAD_DIR=./uploads
PROCESSED_DIR=./processed

# Email (optional, for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# AI Settings
AI_PROCESSING_TIMEOUT=300000  # 5 minutes
```

### Start Backend

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
```

Expect output:
```
[INFO] Server running on http://localhost:5000
[INFO] MongoDB connected to mongodb://localhost:27017/vocallab
```

## Step 5: Setup Frontend

```bash
cd ../client

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env if needed
nano .env
```

### Frontend .env

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Start Frontend

```bash
# Development mode
npm start

# Production build
npm run build
```

Frontend will open at http://localhost:3000

## Step 6: Verify Installation

### Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-05T12:00:00Z"
}
```

### Check Database Connection

```bash
mongosh mongodb://localhost:27017/vocallab
```

Run commands:
```javascript
db.admin.ping()  // Should return { ok: 1 }
db.users.countDocuments()  // Should return 0
```

### Test API Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```

## Step 7: Docker Setup (Optional)

### Using Docker Compose

```bash
# From project root
docker-compose up -d

# Check services
docker-compose ps

# View logs
docker-compose logs -f server
```

### Docker Compose File

See `docker-compose.yml` for pre-configured services:
- MongoDB (27017)
- Backend (5000)
- Frontend (3000)

## Troubleshooting

### FFmpeg Not Found

```bash
# Verify FFmpeg is in PATH
which ffmpeg  # macOS/Linux
where ffmpeg  # Windows

# If not found, add to PATH manually
export PATH=$PATH:/usr/local/bin  # macOS/Linux
# For Windows: System Properties > Environment Variables
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh  # Try to connect

# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process or change port in .env
```

### Dependencies Installation Issues

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Ensure `FRONTEND_URL` in server `.env` matches actual frontend URL.

## Next Steps

1. Create a user account via the UI
2. Upload sample vocal audio
3. Upload or select a preset
4. Process audio in Standard or Remix mode
5. Download your processed audio

## Support

For issues, check:
- Backend logs in terminal
- Browser console (F12)
- MongoDB compass for database issues
- FFmpeg installation: `ffmpeg -version`

## Performance Optimization

### For Production

1. Use MongoDB Atlas instead of local instance
2. Enable JWT refresh tokens
3. Implement rate limiting
4. Use nginx as reverse proxy
5. Enable gzip compression
6. Optimize frontend build
7. Use CDN for static assets
8. Configure HTTPS/SSL

### Environment Settings

```env
NODE_ENV=production
JWT_EXPIRE=1h
MAX_FILE_SIZE=52428800  # 50MB
AI_PROCESSING_TIMEOUT=600000  # 10 minutes
```

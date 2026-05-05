# VocalLab AI

> Professional vocal mixing and mastering powered by AI

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4%2B-green.svg)](https://www.mongodb.com/)

## 🎵 Overview

VocalLab AI is a full-stack web application that provides professional vocal audio processing with AI-powered preset optimization. Upload your vocals, select a preset, and let our system automatically mix and master your audio.

## ✨ Features

- 🔐 **User Authentication** - Secure registration and login with JWT
- 📤 **Audio Upload** - Support for WAV, MP3, FLAC, OGG formats
- 🎛️ **Professional Effects**
  - Pitch Correction
  - Parametric EQ
  - Compression
  - Reverb
  - Limiter
- 🤖 **AI-Powered Remix** - Intelligent preset modification based on audio analysis
- 💾 **Preset Management** - Save, share, and organize custom presets
- 🎧 **Audio Player** - Before/after comparison with playback controls
- 📊 **Processing Status** - Real-time progress tracking
- 🎨 **Dark Theme UI** - Modern, mobile-responsive interface

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB 4.4+
- FFmpeg 4.2+

### Automated Setup

```bash
bash setup.sh
```

### Manual Setup

#### Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

#### Frontend
```bash
cd client
npm install
npm start
```

Application will open at http://localhost:3000

## 📁 Project Structure

```
VocalLab-AI/
├── server/              # Express backend
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── controllers/ # Business logic
│   │   ├── services/   # Audio processing & AI
│   │   ├── models/     # MongoDB schemas
│   │   └── middleware/ # Auth & errors
│   └── package.json
├── client/              # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API integration
│   │   └── store/     # State management
│   └── package.json
├── samples/             # Sample presets
├── docker-compose.yml   # Docker configuration
├── INSTALLATION.md      # Setup guide
├── API.md              # API documentation
└── README.md           # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Audio Processing
- `POST /api/upload/audio` - Upload audio
- `POST /process/standard` - Process with preset
- `POST /process/remix` - AI-powered processing
- `GET /process/status/:jobId` - Check progress

### Presets
- `GET /api/presets` - List presets
- `POST /api/presets` - Create preset
- `PUT /api/presets/:id` - Update preset
- `DELETE /api/presets/:id` - Delete preset
- `POST /api/presets/:id/share` - Share preset

### Download
- `GET /api/download/:jobId` - Download audio
- `GET /api/download/:jobId/preset` - Download preset

See [API.md](./API.md) for detailed documentation.

## 📦 Docker Setup

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🛠️ Development

### Building

```bash
# Backend
cd server
npm run build

# Frontend
cd client
npm run build
```

### Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

### Linting

```bash
# Backend
cd server
npm run lint

# Frontend
cd client
npm run lint
```

## 📚 Documentation

- [Installation Guide](./INSTALLATION.md) - Detailed setup instructions
- [Deployment Guide](./DEPLOYMENT.md) - Production deployment
- [API Documentation](./API.md) - Complete API reference
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Changelog](./CHANGELOG.md) - Version history

## 🎨 Preset Examples

Three sample presets are included:

1. **Bright Vocal** - Clear, crisp vocals with presence peak
2. **Warm Vocal** - Smooth vocals with rich low-mids
3. **Aggressive Vocal** - Punchy vocals with aggressive compression

View presets in `samples/presets/`

## 🤖 AI Features

The remix mode includes:

- **Pitch Analysis** - Detect vocal pitch characteristics
- **Loudness Detection** - Measure LUFS and adjust limiting
- **Tone Classification** - Identify bright/warm/neutral tone
- **Dynamic Analysis** - Detect dynamic range and adjust compression
- **Smart Optimization** - Modify preset values based on analysis

*Note: Currently uses mock AI implementation. Integrate real ML models for production.*

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting (100 req/15min)
- Input validation
- File upload validation
- Owner verification on resources

## 📊 Performance

- MongoDB indexing on frequently queried fields
- Gzip compression enabled
- CDN-ready static file structure
- Async audio processing with job queue
- FFmpeg streaming for large files

## 🐛 Known Issues

None at this time. Please report bugs via GitHub issues.

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

## 👤 Author

**ibujohn00-ops**

- GitHub: [@ibujohn00-ops](https://github.com/ibujohn00-ops)

## 🙏 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 🔗 Links

- [GitHub Repository](https://github.com/ibujohn00-ops/Vocal-preset-engine)
- [Issues](https://github.com/ibujohn00-ops/Vocal-preset-engine/issues)
- [Discussions](https://github.com/ibujohn00-ops/Vocal-preset-engine/discussions)

## 🚀 Roadmap

See [CHANGELOG.md](./CHANGELOG.md) for planned features.

---

**Made with ❤️ by ibujohn00-ops**

# VocalLab AI

A full-stack AI-powered web application for vocal audio processing with intelligent preset mixing and mastering.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Audio Upload**: Support for WAV and MP3 formats
- **Preset System**: JSON-based vocal processing chains
- **Audio Processing**: Real-time audio mixing and mastering
- **AI-Powered Remix**: Intelligent preset modification based on vocal analysis
- **Audio Player**: Before/after comparison
- **Download & Share**: Export processed audio and presets

## Core Features

### Authentication
- User registration and login
- JWT-based session management
- Secure password hashing

### Audio Upload
- WAV/MP3 file upload with validation
- File size limits (max 100MB)
- Metadata extraction

### Preset System
Each preset defines a vocal processing chain:
- **Pitch Correction**: Auto-tune and pitch shifting
- **EQ**: Equalization settings (gain, frequency, Q)
- **Compression**: Dynamic range compression
- **Reverb**: Spacious effects
- **Limiter**: Peak limiting for safety

### Processing Modes

#### Standard Mode
Applies the uploaded preset exactly as configured.

#### Remix Mode (AI-Powered)
1. Analyzes vocal audio characteristics
2. Modifies preset settings dynamically
3. Applies updated preset
4. Returns both audio and modified preset

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Dark theme** with mobile responsiveness
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** + **Express**
- **MongoDB** for data storage
- **JWT** for authentication
- **Multer** for file uploads
- **FFmpeg** for audio processing
- **fluent-ffmpeg** wrapper

### Audio Processing
- **FFmpeg**: EQ, compression, limiting
- **Pitch Correction**: Algorithm-based approximation
- **Python Microservice** (optional): Advanced DSP

### Database
- **MongoDB**: Users, presets, processing history

## Project Structure

```
VocalLab-AI/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── AudioUpload.tsx
│   │   │   ├── PresetUpload.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── ProcessingStatus.tsx
│   │   │   └── PresetManager.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Editor.tsx
│   │   │   └── Presets.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
├── server/                          # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── upload.ts
│   │   │   ├── process.ts
│   │   │   ├── presets.ts
│   │   │   └── download.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── uploadController.ts
│   │   │   ├── processController.ts
│   │   │   └── presetController.ts
│   │   ├── services/
│   │   │   ├── audioProcessor.ts
│   │   │   ├── aiPresetModifier.ts
│   │   │   ├── userService.ts
│   │   │   └── presetService.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Preset.ts
│   │   │   └── ProcessingJob.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── samples/                         # Sample presets
│   └── presets/
│       ├── bright-vocal.json
│       ├── warm-vocal.json
│       └── aggressive-vocal.json
├── docker-compose.yml               # Docker setup
├── .env.example                     # Environment template
└── INSTALLATION.md                  # Setup guide
```

## API Routes

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Upload
- `POST /api/upload/audio` - Upload vocal audio
- `POST /api/upload/preset` - Upload preset JSON

### Processing
- `POST /api/process/standard` - Process with standard preset
- `POST /api/process/remix` - Process with AI remix mode
- `GET /api/process/status/:jobId` - Check processing status

### Presets
- `GET /api/presets` - List user presets
- `GET /api/presets/:id` - Get preset details
- `POST /api/presets` - Save new preset
- `PUT /api/presets/:id` - Update preset
- `DELETE /api/presets/:id` - Delete preset
- `POST /api/presets/:id/share` - Generate share link

### Download
- `GET /api/download/:jobId` - Download processed audio
- `GET /api/download/:jobId/preset` - Download used preset

## Installation & Setup

See [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions.

### Quick Start

1. **Prerequisites**
   ```bash
   node --version  # v16+
   npm --version   # v7+
   FFmpeg installed
   MongoDB running
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/ibujohn00-ops/Vocal-preset-engine.git
   cd Vocal-preset-engine
   ```

3. **Setup Backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm start
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Sample Presets

See `samples/presets/` for example preset configurations.

## Environment Variables

Create `.env` file in server directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vocallab
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
MAX_FILE_SIZE=104857600
NODE_ENV=development
```

## License

MIT

## Author

ibujohn00-ops

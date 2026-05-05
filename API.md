# VocalLab AI - API Documentation

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}

Response 201:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response 200:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}

Response 200:
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "profilePicture": null
  }
}
```

## Upload Endpoints

### Upload Audio
```http
POST /api/upload/audio
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
Field: audio
File: vocal.wav

Response 200:
{
  "message": "Audio uploaded successfully",
  "audio": {
    "filename": "audio-1234567890.wav",
    "path": "./uploads/audio-1234567890.wav",
    "size": 5242880,
    "mimeType": "audio/wav",
    "uploadedAt": "2026-05-05T12:00:00Z"
  }
}
```

### Upload Preset
```http
POST /api/upload/preset
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
Field: preset
File: bright-vocal.json

Response 200:
{
  "message": "Preset uploaded successfully",
  "preset": {
    "filename": "preset-1234567890.json",
    "path": "./uploads/preset-1234567890.json",
    "name": "Bright Vocal",
    "effects": ["pitchCorrection", "eq", "compression", "reverb", "limiter"],
    "uploadedAt": "2026-05-05T12:00:00Z"
  }
}
```

## Processing Endpoints

### Process Standard (No AI)
```http
POST /api/process/standard
Authorization: Bearer {token}
Content-Type: application/json

{
  "audioPath": "./uploads/audio-1234567890.wav",
  "presetId": "507f1f77bcf86cd799439011",
  "presetData": {
    "name": "Bright Vocal",
    "effects": {
      "pitchCorrection": { "enabled": true, "amount": 100 },
      "eq": { "enabled": true, "bands": [...] },
      "compression": { "enabled": true, "threshold": -18, "ratio": 4 },
      "reverb": { "enabled": true, "roomSize": 0.35 },
      "limiter": { "enabled": true, "threshold": -3 }
    }
  }
}

Response 202:
{
  "message": "Processing started",
  "jobId": "507f1f77bcf86cd799439012",
  "status": "pending",
  "mode": "standard"
}
```

### Process Remix (AI-Powered)
```http
POST /api/process/remix
Authorization: Bearer {token}
Content-Type: application/json

{
  "audioPath": "./uploads/audio-1234567890.wav",
  "presetId": "507f1f77bcf86cd799439011",
  "presetData": { ... }
}

Response 202:
{
  "message": "Remix processing started",
  "jobId": "507f1f77bcf86cd799439012",
  "status": "pending",
  "mode": "remix"
}
```

### Get Processing Status
```http
GET /api/process/status/{jobId}
Authorization: Bearer {token}

Response 200:
{
  "jobId": "507f1f77bcf86cd799439012",
  "status": "processing",
  "progress": 45,
  "mode": "standard",
  "error": null,
  "completedAt": null
}
```

## Preset Endpoints

### List Presets
```http
GET /api/presets
Authorization: Bearer {token}

Response 200:
{
  "presets": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439010",
      "name": "Bright Vocal",
      "description": "Clear, crisp vocals with presence peak",
      "publicPreset": false,
      "effects": { ... },
      "tags": ["vocal", "bright"],
      "createdAt": "2026-05-05T12:00:00Z",
      "updatedAt": "2026-05-05T12:00:00Z"
    }
  ],
  "total": 1
}
```

### Save Preset
```http
POST /api/presets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Custom Preset",
  "description": "My own vocal preset",
  "effects": { ... },
  "tags": ["vocal", "custom"],
  "publicPreset": false
}

Response 201:
{
  "message": "Preset saved successfully",
  "preset": { ... }
}
```

### Share Preset
```http
POST /api/presets/{presetId}/share
Authorization: Bearer {token}

Response 200:
{
  "message": "Preset share link generated",
  "shareToken": "abc123def456",
  "shareUrl": "http://localhost:3000/presets/shared/abc123def456"
}
```

## Download Endpoints

### Download Processed Audio
```http
GET /api/download/{jobId}
Authorization: Bearer {token}

Response 200:
Binary audio file (wav)
Headers:
  Content-Type: audio/wav
  Content-Disposition: attachment; filename="vocallab-processed-{jobId}.wav"
```

### Download Preset JSON
```http
GET /api/download/{jobId}/preset
Authorization: Bearer {token}

Response 200:
JSON preset file
Headers:
  Content-Type: application/json
  Content-Disposition: attachment; filename="vocallab-preset-{jobId}.json"
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "message": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You do not have access to this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "The requested resource does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

All API endpoints are rate-limited to:
- **100 requests per 15 minutes** per IP

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620067200
```

## Authentication

All protected endpoints require:
```
Authorization: Bearer {JWT_TOKEN}
```

Token expires in: **7 days** (configurable)

/**
 * Upload Routes
 * Handles audio and preset file uploads
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import {
  uploadAudio,
  uploadPreset,
} from '../controllers/uploadController';

const router = Router();

// Create upload directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'), // 100MB default
  },
  fileFilter: (req, file, cb) => {
    // Validate file types based on route
    const audioFormats = /\.(wav|mp3|flac|ogg)$/i;
    const jsonFormat = /\.json$/i;

    if (req.path.includes('audio') && !audioFormats.test(file.originalname)) {
      cb(new Error('Invalid audio format. Only WAV, MP3, FLAC, and OGG are supported.'));
    } else if (req.path.includes('preset') && !jsonFormat.test(file.originalname)) {
      cb(new Error('Invalid preset format. Only JSON files are supported.'));
    } else {
      cb(null, true);
    }
  },
});

/**
 * POST /api/upload/audio
 * Upload vocal audio file
 */
router.post(
  '/audio',
  authenticateToken,
  upload.single('audio'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        error: 'No file provided',
        message: 'Please upload an audio file',
      });
      return;
    }

    await uploadAudio(req, res);
  })
);

/**
 * POST /api/upload/preset
 * Upload vocal preset JSON file
 */
router.post(
  '/preset',
  authenticateToken,
  upload.single('preset'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a preset file',
      });
      return;
    }

    await uploadPreset(req, res);
  })
);

export default router;

/**
 * Download Routes
 * Handles downloading processed audio and presets
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import {
  downloadAudio,
  downloadPreset,
} from '../controllers/downloadController';

const router = Router();

/**
 * GET /api/download/:jobId
 * Download processed audio file
 */
router.get(
  '/:jobId',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await downloadAudio(req, res);
  })
);

/**
 * GET /api/download/:jobId/preset
 * Download preset used in processing
 */
router.get(
  '/:jobId/preset',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await downloadPreset(req, res);
  })
);

export default router;

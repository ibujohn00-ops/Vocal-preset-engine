/**
 * Audio Processing Routes
 * Handles standard and remix mode audio processing
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import {
  processStandard,
  processRemix,
  getProcessingStatus,
} from '../controllers/processController';

const router = Router();

/**
 * POST /api/process/standard
 * Process audio with standard preset (no AI modification)
 */
router.post(
  '/standard',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await processStandard(req, res);
  })
);

/**
 * POST /api/process/remix
 * Process audio with AI-powered remix mode
 * Analyzes vocal and modifies preset dynamically
 */
router.post(
  '/remix',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await processRemix(req, res);
  })
);

/**
 * GET /api/process/status/:jobId
 * Get processing status and progress
 */
router.get(
  '/status/:jobId',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await getProcessingStatus(req, res);
  })
);

export default router;

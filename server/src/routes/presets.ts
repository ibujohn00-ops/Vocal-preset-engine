/**
 * Preset Management Routes
 * Handles saving, loading, and sharing presets
 */

import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticateToken } from '../middleware/auth';
import {
  listPresets,
  getPreset,
  savePreset,
  updatePreset,
  deletePreset,
  sharePreset,
} from '../controllers/presetController';

const router = Router();

/**
 * GET /api/presets
 * List all presets for current user
 */
router.get(
  '/',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await listPresets(req, res);
  })
);

/**
 * GET /api/presets/:id
 * Get a specific preset by ID
 */
router.get(
  '/:id',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await getPreset(req, res);
  })
);

/**
 * POST /api/presets
 * Save a new preset
 */
router.post(
  '/',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await savePreset(req, res);
  })
);

/**
 * PUT /api/presets/:id
 * Update an existing preset
 */
router.put(
  '/:id',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await updatePreset(req, res);
  })
);

/**
 * DELETE /api/presets/:id
 * Delete a preset
 */
router.delete(
  '/:id',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await deletePreset(req, res);
  })
);

/**
 * POST /api/presets/:id/share
 * Generate shareable link for preset
 */
router.post(
  '/:id/share',
  authenticateToken,
  asyncHandler(async (req: Request, res: Response) => {
    await sharePreset(req, res);
  })
);

export default router;

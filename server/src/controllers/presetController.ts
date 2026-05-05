/**
 * Preset Controller
 * Handles preset management operations
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Preset from '../models/Preset';

/**
 * List all presets for current user
 */
export const listPresets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User context required',
      });
      return;
    }

    const presets = await Preset.find({ userId: req.user.id }).lean();

    res.status(200).json({
      presets,
      total: presets.length,
    });
  } catch (error) {
    console.error('[ERROR] List presets failed:', error);
    res.status(500).json({
      error: 'Failed to list presets',
      message: 'Error retrieving presets',
    });
  }
};

/**
 * Get a specific preset
 */
export const getPreset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User context required',
      });
      return;
    }

    const { id } = req.params;
    const preset = await Preset.findById(id);

    if (!preset) {
      res.status(404).json({
        error: 'Preset not found',
        message: 'The preset does not exist',
      });
      return;
    }

    // Check ownership or public access
    if (
      preset.userId.toString() !== req.user.id &&
      !preset.publicPreset
    ) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this preset',
      });
      return;
    }

    res.status(200).json({ preset });
  } catch (error) {
    console.error('[ERROR] Get preset failed:', error);
    res.status(500).json({
      error: 'Failed to retrieve preset',
      message: 'Error fetching preset',
    });
  }
};

/**
 * Save a new preset
 */
export const savePreset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User context required',
      });
      return;
    }

    const { name, description, effects, tags, publicPreset } = req.body;

    if (!name || !effects) {
      res.status(400).json({
        error: 'Missing parameters',
        message: 'name and effects are required',
      });
      return;
    }

    const preset = new Preset({
      userId: req.user.id,
      name,
      description: description || '',
      effects,
      tags: tags || [],
      publicPreset: publicPreset || false,
    });

    await preset.save();

    res.status(201).json({
      message: 'Preset saved successfully',
      preset,
    });
  } catch (error) {
    console.error('[ERROR] Save preset failed:', error);
    res.status(500).json({
      error: 'Failed to save preset',
      message: 'Error saving preset',
    });
  }
};

/**
 * Update a preset
 */
export const updatePreset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User context required',
      });
      return;
    }

    const { id } = req.params;
    const { name, description, effects, tags, publicPreset } = req.body;

    const preset = await Preset.findById(id);
    if (!preset) {
      res.status(404).json({
        error: 'Preset not found',
        message: 'The preset does not exist',
      });
      return;
    }

    // Check ownership
    if (preset.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this preset',
      });
      return;
    }

    // Update fields
    if (name) preset.name = name;
    if (description !== undefined) preset.description = description;
    if (effects) preset.effects = effects;
    if (tags) preset.tags = tags;
    if (publicPreset !== undefined) preset.publicPreset = publicPreset;

    await preset.save();

    res.status(200).json({
      message: 'Preset updated successfully',
      preset,
    });
  } catch (error) {
    console.error('[ERROR] Update preset failed:', error);
    res.status(500).json({
      error: 'Failed to update preset',
      message: 'Error updating preset',
    });
  }
};

/**
 * Delete a preset
 */
export const deletePreset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User context required',
      });
      return;
    }

    const { id } = req.params;
    const preset = await Preset.findById(id);

    if (!preset) {
      res.status(404).json({
        error: 'Preset not found',
        message: 'The preset does not exist',
      });
      return;
    }

    // Check ownership
    if (preset.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this preset',
      });
      return;
    }

    await Preset.deleteOne({ _id: id });

    res.status(200).json({
      message: 'Preset deleted successfully',
    });
  } catch (error) {
    console.error('[ERROR] Delete preset failed:', error);
    res.status(500).json({
      error: 'Failed to delete preset',
      message: 'Error deleting preset',
    });
  }
};

/**
 * Share a preset (generate share link)
 */
export const sharePreset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User context required',
      });
      return;
    }

    const { id } = req.params;
    const preset = await Preset.findById(id);

    if (!preset) {
      res.status(404).json({
        error: 'Preset not found',
        message: 'The preset does not exist',
      });
      return;
    }

    // Check ownership
    if (preset.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to share this preset',
      });
      return;
    }

    // Generate share token if not exists
    if (!preset.shareToken) {
      preset.shareToken = uuidv4();
      preset.publicPreset = true;
      await preset.save();
    }

    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/presets/shared/${preset.shareToken}`;

    res.status(200).json({
      message: 'Preset share link generated',
      shareToken: preset.shareToken,
      shareUrl,
    });
  } catch (error) {
    console.error('[ERROR] Share preset failed:', error);
    res.status(500).json({
      error: 'Failed to share preset',
      message: 'Error generating share link',
    });
  }
};

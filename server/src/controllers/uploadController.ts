/**
 * Upload Controller
 * Handles audio and preset file uploads
 */

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

/**
 * Upload audio file
 */
export const uploadAudio = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: 'No file provided',
        message: 'Please upload an audio file',
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User context required',
      });
      return;
    }

    const { filename, path: filePath, size, mimetype } = req.file;

    res.status(200).json({
      message: 'Audio uploaded successfully',
      audio: {
        filename,
        path: filePath,
        size,
        mimeType: mimetype,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[ERROR] Audio upload failed:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload audio file',
    });
  }
};

/**
 * Upload preset file
 */
export const uploadPreset = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: 'No file provided',
        message: 'Please upload a preset file',
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User context required',
      });
      return;
    }

    // Read and parse JSON
    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    let presetData;

    try {
      presetData = JSON.parse(fileContent);
    } catch (parseError) {
      // Delete invalid file
      fs.unlinkSync(req.file.path);
      res.status(400).json({
        error: 'Invalid JSON',
        message: 'Preset file must be valid JSON',
      });
      return;
    }

    // Validate preset structure
    if (!presetData.name || !presetData.effects) {
      fs.unlinkSync(req.file.path);
      res.status(400).json({
        error: 'Invalid preset format',
        message: 'Preset must have "name" and "effects" properties',
      });
      return;
    }

    res.status(200).json({
      message: 'Preset uploaded successfully',
      preset: {
        filename: req.file.filename,
        path: req.file.path,
        name: presetData.name,
        effects: Object.keys(presetData.effects),
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[ERROR] Preset upload failed:', error);
    res.status(500).json({
      error: 'Upload failed',
      message: 'Failed to upload preset file',
    });
  }
};

/**
 * Download Controller
 * Handles downloading processed audio and presets
 */

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import ProcessingJob from '../models/ProcessingJob';

/**
 * Download processed audio
 */
export const downloadAudio = async (
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

    const { jobId } = req.params;
    const job = await ProcessingJob.findById(jobId);

    if (!job) {
      res.status(404).json({
        error: 'Job not found',
        message: 'The processing job does not exist',
      });
      return;
    }

    // Check ownership
    if (job.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this file',
      });
      return;
    }

    // Check if processing is completed
    if (job.status !== 'completed') {
      res.status(400).json({
        error: 'Not ready',
        message: `Processing is still ${job.status}. Please try again later.`,
      });
      return;
    }

    // Check if file exists
    if (!job.outputFilePath || !fs.existsSync(job.outputFilePath)) {
      res.status(404).json({
        error: 'File not found',
        message: 'The processed audio file is not available',
      });
      return;
    }

    // Send file
    const fileName = `vocallab-processed-${job._id}.wav`;
    res.download(job.outputFilePath, fileName, (error) => {
      if (error) {
        console.error('[ERROR] Download failed:', error);
      }
    });
  } catch (error) {
    console.error('[ERROR] Download audio failed:', error);
    res.status(500).json({
      error: 'Download failed',
      message: 'Failed to download audio file',
    });
  }
};

/**
 * Download preset used in processing
 */
export const downloadPreset = async (
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

    const { jobId } = req.params;
    const job = await ProcessingJob.findById(jobId);

    if (!job) {
      res.status(404).json({
        error: 'Job not found',
        message: 'The processing job does not exist',
      });
      return;
    }

    // Check ownership
    if (job.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this file',
      });
      return;
    }

    // Get preset (either used or original)
    const preset = job.usedPreset || job.presetData;

    if (!preset) {
      res.status(404).json({
        error: 'Preset not found',
        message: 'No preset associated with this job',
      });
      return;
    }

    // Send JSON file
    const fileName = `vocallab-preset-${job._id}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(JSON.stringify(preset, null, 2));
  } catch (error) {
    console.error('[ERROR] Download preset failed:', error);
    res.status(500).json({
      error: 'Download failed',
      message: 'Failed to download preset file',
    });
  }
};

/**
 * Process Controller
 * Handles audio processing in standard and remix modes
 */

import { Request, Response } from 'express';
import ProcessingJob from '../models/ProcessingJob';
import { processAudio } from '../services/audioProcessor';
import { modifyPreset } from '../services/aiPresetModifier';

/**
 * Process audio with standard preset (no AI modification)
 */
export const processStandard = async (
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

    const { audioPath, presetId, presetData } = req.body;

    if (!audioPath || !presetData) {
      res.status(400).json({
        error: 'Missing parameters',
        message: 'audioPath and presetData are required',
      });
      return;
    }

    // Create processing job
    const job = new ProcessingJob({
      userId: req.user.id,
      audioFilePath: audioPath,
      presetId: presetId || null,
      presetData,
      mode: 'standard',
      status: 'pending',
    });

    await job.save();

    // Start processing asynchronously
    processAudio(job._id.toString(), audioPath, presetData, 'standard')
      .then(() => {
        console.log(`[INFO] Processing completed for job ${job._id}`);
      })
      .catch((error) => {
        console.error(`[ERROR] Processing failed for job ${job._id}:`, error);
      });

    res.status(202).json({
      message: 'Processing started',
      jobId: job._id,
      status: 'pending',
      mode: 'standard',
    });
  } catch (error) {
    console.error('[ERROR] Standard processing failed:', error);
    res.status(500).json({
      error: 'Processing failed',
      message: 'Failed to start audio processing',
    });
  }
};

/**
 * Process audio with remix mode (AI-powered preset modification)
 */
export const processRemix = async (
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

    const { audioPath, presetId, presetData } = req.body;

    if (!audioPath || !presetData) {
      res.status(400).json({
        error: 'Missing parameters',
        message: 'audioPath and presetData are required',
      });
      return;
    }

    // Create processing job
    const job = new ProcessingJob({
      userId: req.user.id,
      audioFilePath: audioPath,
      presetId: presetId || null,
      presetData,
      mode: 'remix',
      status: 'pending',
    });

    await job.save();

    // Start processing asynchronously
    (async () => {
      try {
        // Modify preset based on audio analysis
        const modifiedPreset = await modifyPreset(audioPath, presetData);
        await job.updateOne({
          usedPreset: modifiedPreset,
          analysisData: (modifiedPreset as any).analysisData,
        });

        // Process with modified preset
        await processAudio(job._id.toString(), audioPath, modifiedPreset, 'remix');
      } catch (error) {
        console.error(`[ERROR] Remix processing failed for job ${job._id}:`, error);
        await job.updateOne({
          status: 'failed',
          error: (error as Error).message,
        });
      }
    })();

    res.status(202).json({
      message: 'Remix processing started',
      jobId: job._id,
      status: 'pending',
      mode: 'remix',
    });
  } catch (error) {
    console.error('[ERROR] Remix processing failed:', error);
    res.status(500).json({
      error: 'Processing failed',
      message: 'Failed to start remix processing',
    });
  }
};

/**
 * Get processing status
 */
export const getProcessingStatus = async (
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

    // Verify ownership
    if (job.userId.toString() !== req.user.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to this job',
      });
      return;
    }

    res.status(200).json({
      jobId: job._id,
      status: job.status,
      progress: job.progress,
      mode: job.mode,
      error: job.error || null,
      completedAt: job.completedAt || null,
    });
  } catch (error) {
    console.error('[ERROR] Get status failed:', error);
    res.status(500).json({
      error: 'Failed to retrieve status',
      message: 'Error fetching processing status',
    });
  }
};

/**
 * Audio Processing Service
 * Handles FFmpeg-based audio processing with vocal presets
 */

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import ProcessingJob from '../models/ProcessingJob';

/**
 * Process audio with preset effects
 * @param jobId - Processing job ID
 * @param audioPath - Path to input audio file
 * @param preset - Preset configuration
 * @param mode - Processing mode (standard or remix)
 */
export const processAudio = async (
  jobId: string,
  audioPath: string,
  preset: any,
  mode: 'standard' | 'remix'
): Promise<void> => {
  const outputDir = process.env.PROCESSED_DIR || './processed';
  const outputPath = path.join(outputDir, `${jobId}-processed.wav`);

  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Update job status to processing
    await ProcessingJob.findByIdAndUpdate(jobId, {
      status: 'processing',
      startedAt: new Date(),
      progress: 10,
    });

    console.log(`[INFO] Starting ${mode} audio processing for job ${jobId}`);

    // Build FFmpeg command with preset effects
    let command = ffmpeg(audioPath);

    // Apply effects in order
    let filterComplex = '';
    let filterCount = 0;

    // EQ (using highpass, lowpass, and parametric EQ)
    if (preset.effects?.eq?.enabled) {
      console.log('[INFO] Applying EQ...');
      const eqFilter = buildEQFilter(preset.effects.eq);
      if (eqFilter) {
        filterComplex += eqFilter;
        filterCount++;
      }
    }

    // Compression
    if (preset.effects?.compression?.enabled) {
      console.log('[INFO] Applying compression...');
      const compFilter = buildCompressionFilter(preset.effects.compression);
      if (compFilter) {
        filterComplex += (filterCount > 0 ? ',' : '') + compFilter;
        filterCount++;
      }
    }

    // Reverb
    if (preset.effects?.reverb?.enabled) {
      console.log('[INFO] Applying reverb...');
      const reverbFilter = buildReverbFilter(preset.effects.reverb);
      if (reverbFilter) {
        filterComplex += (filterCount > 0 ? ',' : '') + reverbFilter;
        filterCount++;
      }
    }

    // Limiter
    if (preset.effects?.limiter?.enabled) {
      console.log('[INFO] Applying limiter...');
      const limiterFilter = buildLimiterFilter(preset.effects.limiter);
      if (limiterFilter) {
        filterComplex += (filterCount > 0 ? ',' : '') + limiterFilter;
        filterCount++;
      }
    }

    // Apply audio filters if any
    if (filterComplex) {
      command = command.audioFilter(filterComplex);
    }

    // Set output options
    command
      .audioCodec('pcm_s16le')
      .audioChannels(2)
      .audioFrequency(44100)
      .toFormat('wav')
      .output(outputPath);

    // Track progress
    command.on('progress', async (progress: any) => {
      const percent = Math.round(progress.percent || 0);
      if (percent > 0 && percent <= 100) {
        await ProcessingJob.findByIdAndUpdate(jobId, {
          progress: 10 + Math.round((percent / 100) * 80),
        }).catch((error) => {
          console.error('[ERROR] Failed to update progress:', error);
        });
      }
    });

    // Handle completion
    command.on('end', async () => {
      console.log(`[INFO] Audio processing completed for job ${jobId}`);

      // Update job with completion status
      await ProcessingJob.findByIdAndUpdate(jobId, {
        status: 'completed',
        progress: 100,
        outputFilePath: outputPath,
        completedAt: new Date(),
        usedPreset: mode === 'remix' ? preset : undefined,
      }).catch((error) => {
        console.error('[ERROR] Failed to update job completion:', error);
      });
    });

    // Handle errors
    command.on('error', async (error: Error) => {
      console.error(`[ERROR] Audio processing failed for job ${jobId}:`, error);

      // Clean up partial output file
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }

      // Update job with error status
      await ProcessingJob.findByIdAndUpdate(jobId, {
        status: 'failed',
        error: error.message,
      }).catch((error) => {
        console.error('[ERROR] Failed to update job error:', error);
      });
    });

    // Start processing
    command.run();
  } catch (error) {
    console.error(`[ERROR] Failed to start processing for job ${jobId}:`, error);

    await ProcessingJob.findByIdAndUpdate(jobId, {
      status: 'failed',
      error: (error as Error).message,
    }).catch((dbError) => {
      console.error('[ERROR] Failed to update job error:', dbError);
    });
  }
};

/**
 * Build EQ filter string
 */
function buildEQFilter(eqConfig: any): string {
  if (!eqConfig || !eqConfig.bands || eqConfig.bands.length === 0) {
    return '';
  }

  // Build parametric EQ filter
  return eqConfig.bands
    .map((band: any, index: number) => {
      const freq = band.frequency || 1000;
      const gain = band.gain || 0;
      const q = band.q || 1;
      return `equalizer=f=${freq}:g=${gain}:w_type=h:width_type=q:width=${q}`;
    })
    .join(',');
}

/**
 * Build compression filter string
 */
function buildCompressionFilter(compConfig: any): string {
  const threshold = compConfig.threshold || -20;
  const ratio = compConfig.ratio || 4;
  const attack = (compConfig.attack || 5) / 1000; // Convert to seconds
  const release = (compConfig.release || 50) / 1000; // Convert to seconds

  return `compand=attacks=${attack}:decays=${release}:points=-80/-80|-${Math.abs(threshold)}/-${Math.abs(threshold) / ratio}|0/0:soft-knee=0.01`;
}

/**
 * Build reverb filter string
 */
function buildReverbFilter(reverbConfig: any): string {
  // FFmpeg's areverse isn't exactly reverb, using aecho as approximation
  const roomSize = reverbConfig.roomSize || 0.5;
  const damping = reverbConfig.damping || 0.5;
  const wetLevel = reverbConfig.wetLevel || 0.3;

  // aecho: delay, decay
  const delay = Math.round(roomSize * 100);
  const decay = wetLevel;

  return `aecho=0.8=0.9:${(delay / 1000).toFixed(2)}=0.5:${decay.toFixed(2)}=0.5`;
}

/**
 * Build limiter filter string
 */
function buildLimiterFilter(limiterConfig: any): string {
  const threshold = limiterConfig.threshold || -6;
  const release = (limiterConfig.release || 100) / 1000; // Convert to seconds

  return `alimiter=l=${Math.abs(threshold)}:a=0.005:d=${release}:s=dB`;
}

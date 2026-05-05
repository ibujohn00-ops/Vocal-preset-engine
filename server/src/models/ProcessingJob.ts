/**
 * Processing Job Model
 * Tracks audio processing jobs and their status
 */

import mongoose, { Document, Schema } from 'mongoose';

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ProcessingMode = 'standard' | 'remix';

export interface IProcessingJob extends Document {
  userId: string;
  audioFilePath: string;
  presetId?: string;
  presetData: any;
  mode: ProcessingMode;
  status: ProcessingStatus;
  progress: number;
  outputFilePath?: string;
  usedPreset?: any; // Preset actually used (may differ from original in remix mode)
  analysisData?: {
    pitch?: number;
    loudness?: number;
    tone?: string;
  };
  error?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const processingJobSchema = new Schema<IProcessingJob>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audioFilePath: {
      type: String,
      required: true,
    },
    presetId: {
      type: Schema.Types.ObjectId,
      ref: 'Preset',
      default: null,
    },
    presetData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    mode: {
      type: String,
      enum: ['standard', 'remix'],
      default: 'standard',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    outputFilePath: {
      type: String,
      default: null,
    },
    usedPreset: {
      type: Schema.Types.Mixed,
      default: null,
    },
    analysisData: {
      pitch: Number,
      loudness: Number,
      tone: String,
    },
    error: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ProcessingJob = mongoose.model<IProcessingJob>(
  'ProcessingJob',
  processingJobSchema
);

export default ProcessingJob;

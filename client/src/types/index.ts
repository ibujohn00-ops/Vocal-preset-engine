/**
 * VocalLab AI Types
 * Shared TypeScript interfaces and types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
}

export interface Preset {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  publicPreset: boolean;
  shareToken?: string;
  effects: PresetEffects;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PresetEffects {
  pitchCorrection?: PitchCorrectionEffect;
  eq?: EQEffect;
  compression?: CompressionEffect;
  reverb?: ReverbEffect;
  limiter?: LimiterEffect;
}

export interface PitchCorrectionEffect {
  enabled: boolean;
  amount?: number;
  scale?: string;
}

export interface EQEffect {
  enabled: boolean;
  bands?: EQBand[];
}

export interface EQBand {
  frequency: number;
  gain: number;
  q: number;
}

export interface CompressionEffect {
  enabled: boolean;
  threshold?: number;
  ratio?: number;
  attack?: number;
  release?: number;
}

export interface ReverbEffect {
  enabled: boolean;
  roomSize?: number;
  damping?: number;
  wetLevel?: number;
  dryLevel?: number;
}

export interface LimiterEffect {
  enabled: boolean;
  threshold?: number;
  release?: number;
}

export interface ProcessingJob {
  _id: string;
  userId: string;
  audioFilePath: string;
  presetId?: string;
  presetData: any;
  mode: 'standard' | 'remix';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputFilePath?: string;
  usedPreset?: Preset;
  analysisData?: AudioAnalysis;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AudioAnalysis {
  pitch: number;
  loudness: number;
  tone: 'bright' | 'warm' | 'neutral';
  dynamics: 'dynamic' | 'compressed' | 'stable';
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

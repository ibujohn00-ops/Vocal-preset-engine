/**
 * Preset Model
 * Defines preset schema for vocal processing chains
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IPresetEffect {
  enabled: boolean;
  [key: string]: any;
}

export interface IPreset extends Document {
  userId: string;
  name: string;
  description?: string;
  publicPreset: boolean;
  shareToken?: string;
  effects: {
    pitchCorrection?: IPresetEffect & {
      amount?: number;
      scale?: string;
    };
    eq?: IPresetEffect & {
      bands?: Array<{
        frequency: number;
        gain: number;
        q: number;
      }>;
    };
    compression?: IPresetEffect & {
      threshold?: number;
      ratio?: number;
      attack?: number;
      release?: number;
    };
    reverb?: IPresetEffect & {
      roomSize?: number;
      damping?: number;
      wetLevel?: number;
      dryLevel?: number;
    };
    limiter?: IPresetEffect & {
      threshold?: number;
      release?: number;
    };
  };
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const presetSchema = new Schema<IPreset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    publicPreset: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      default: null,
    },
    effects: {
      pitchCorrection: {
        enabled: { type: Boolean, default: true },
        amount: { type: Number, default: 100, min: 0, max: 100 },
        scale: { type: String, default: 'equal' },
      },
      eq: {
        enabled: { type: Boolean, default: true },
        bands: [
          {
            frequency: Number,
            gain: Number,
            q: Number,
          },
        ],
      },
      compression: {
        enabled: { type: Boolean, default: true },
        threshold: { type: Number, default: -20 },
        ratio: { type: Number, default: 4 },
        attack: { type: Number, default: 5 },
        release: { type: Number, default: 50 },
      },
      reverb: {
        enabled: { type: Boolean, default: true },
        roomSize: { type: Number, default: 0.5, min: 0, max: 1 },
        damping: { type: Number, default: 0.5, min: 0, max: 1 },
        wetLevel: { type: Number, default: 0.3, min: 0, max: 1 },
        dryLevel: { type: Number, default: 1, min: 0, max: 1 },
      },
      limiter: {
        enabled: { type: Boolean, default: true },
        threshold: { type: Number, default: -6 },
        release: { type: Number, default: 100 },
      },
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

const Preset = mongoose.model<IPreset>('Preset', presetSchema);

export default Preset;

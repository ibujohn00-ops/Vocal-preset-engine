/**
 * Analytics Model
 * Tracks user activity and system events
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  userId: string;
  eventType: string;
  eventData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const analyticsSchema = new Schema<IAnalytics>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'login',
        'logout',
        'upload_audio',
        'upload_preset',
        'process_standard',
        'process_remix',
        'download_audio',
        'create_preset',
        'delete_preset',
        'share_preset',
      ],
    },
    eventData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// TTL index for automatic deletion after 90 days
analyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);

export default Analytics;

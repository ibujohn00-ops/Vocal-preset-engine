/**
 * Analytics Service
 * Tracks user activity and system metrics
 */

import Analytics from '../models/Analytics';

export interface AnalyticsEvent {
  userId: string;
  eventType: string;
  eventData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log analytics event
 */
export const logEvent = async (event: AnalyticsEvent): Promise<void> => {
  try {
    const analyticsRecord = new Analytics({
      userId: event.userId,
      eventType: event.eventType,
      eventData: event.eventData || {},
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      timestamp: new Date(),
    });

    await analyticsRecord.save();
  } catch (error) {
    console.error('[ERROR] Failed to log analytics event:', error);
  }
};

/**
 * Get user statistics
 */
export const getUserStats = async (userId: string): Promise<any> => {
  try {
    const stats = await Analytics.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);

    return stats;
  } catch (error) {
    console.error('[ERROR] Failed to get user stats:', error);
    return [];
  }
};

/**
 * Get system statistics
 */
export const getSystemStats = async (): Promise<any> => {
  try {
    const stats = await Analytics.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          uniqueUserCount: { $size: '$uniqueUsers' },
        },
      },
    ]);

    return stats;
  } catch (error) {
    console.error('[ERROR] Failed to get system stats:', error);
    return [];
  }
};

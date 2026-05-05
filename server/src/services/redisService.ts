/**
 * Redis Cache Service
 * Handles caching and session management
 */

import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

client.on('error', (err) => {
  console.error('[ERROR] Redis error:', err);
});

client.on('connect', () => {
  console.log('[INFO] Redis connected');
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const delAsync = promisify(client.del).bind(client);
const expireAsync = promisify(client.expire).bind(client);

/**
 * Set cache value
 */
export const setCache = async (
  key: string,
  value: any,
  ttl: number = 3600
): Promise<void> => {
  try {
    await setAsync(key, JSON.stringify(value));
    if (ttl) {
      await expireAsync(key, ttl);
    }
  } catch (error) {
    console.error('[ERROR] Cache set failed:', error);
  }
};

/**
 * Get cache value
 */
export const getCache = async (key: string): Promise<any> => {
  try {
    const value = await getAsync(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('[ERROR] Cache get failed:', error);
    return null;
  }
};

/**
 * Delete cache value
 */
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await delAsync(key);
  } catch (error) {
    console.error('[ERROR] Cache delete failed:', error);
  }
};

/**
 * Clear all cache
 */
export const clearCache = async (): Promise<void> => {
  try {
    const flushAsync = promisify(client.flushdb).bind(client);
    await flushAsync();
  } catch (error) {
    console.error('[ERROR] Cache clear failed:', error);
  }
};

export default client;

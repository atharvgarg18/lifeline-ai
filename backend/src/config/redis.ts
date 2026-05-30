/**
 * Redis Connection
 * Manages Redis client for caching, sessions, and job queues
 */

import { createClient, RedisClientType } from 'redis';

const REDIS_URL = process.env.REDIS_URL || 'redis://:redis123@localhost:6379';

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<RedisClientType> => {
  redisClient = createClient({
    url: REDIS_URL,
    socket: {
      reconnectStrategy: false, // don't auto-reconnect — fail fast in dev
    },
  }) as RedisClientType;

  redisClient.on('error', (err) => {
    // Suppress spam — only log once
    if (!redisClient.isOpen) return;
    console.error('❌ Redis error:', err.message);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  try {
    await redisClient.connect();
  } catch (err: any) {
    console.warn('⚠️  Redis unavailable — running without cache (dev mode):', err.message);
  }
  return redisClient;
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit();
    console.log('🔌 Redis disconnected gracefully');
  }
};

// Cache helpers
export const cacheSet = async (key: string, value: unknown, ttlSeconds = 300): Promise<void> => {
  const client = getRedisClient();
  await client.setEx(key, ttlSeconds, JSON.stringify(value));
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  const client = getRedisClient();
  const data = await client.get(key);
  return data ? (JSON.parse(data) as T) : null;
};

export const cacheDel = async (key: string): Promise<void> => {
  const client = getRedisClient();
  await client.del(key);
};

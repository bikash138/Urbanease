import Redis from "ioredis";
import { env } from "../config";
import { logger } from "./logger";

export const redis = new Redis(env.REDIS_URL || "redis://valkey:6379", {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
});

export async function connectRedis(): Promise<void> {
  try {
    await redis.ping();
    logger.info("Redis connected successfully");
  } catch (error) {
    logger.error({ err: error }, "Failed to connect to Redis");
    process.exit(1);
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    await redis.quit();
    logger.info("Redis disconnected");
  } catch (error) {
    logger.error({ err: error }, "Error while disconnecting Redis");
  }
}

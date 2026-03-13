import Redis from "ioredis";
import { env } from "../config";

export const redis = new Redis(env.REDIS_URL || "redis://valkey:6379", {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  },
});

export async function connectRedis(): Promise<void> {
  try {
    await redis.ping();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Failed to connect to Redis", error);
    process.exit(1);
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    await redis.quit();
    console.log("Redis disconnected");
  } catch (error) {
    console.error("Error while disconnecting Redis", error);
  }
}

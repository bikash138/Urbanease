import { redis } from "./redis";

export const CacheTTL = {
  CATEGORIES: 900,
  CATEGORY: 900,
  SERVICES: 900,
  PROVIDER: 600, 
  SLOTS: 120,
} as const;

export async function getOrSet<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
  options?: { skipCacheWhen?: (data: T) => boolean },
): Promise<T> {
  let cached: string | null = null;
  try {
    cached = await redis.get(key);
  } catch {
    // Redis is down, fallback to fetcher()
  }

  if (cached) {
    return JSON.parse(cached) as T;
  }

  const data = await fetcher();

  // If skipCacheWhen returns true, means repository havent returned any data
  const shouldSkip =
    options?.skipCacheWhen && options.skipCacheWhen(data);
  if (!shouldSkip) {
    try {
      await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
    } catch {
      // Ignore set errors
    }
  }

  return data;
}

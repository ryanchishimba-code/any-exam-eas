import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const limiterCache = new Map<string, Ratelimit>();

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    redisClient = null;
    return null;
  }
  redisClient = new Redis({ url, token });
  return redisClient;
}

export function isDistributedRateLimitEnabled(): boolean {
  return getRedis() !== null;
}

export async function checkDistributedRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number } | null> {
  const redis = getRedis();
  if (!redis) return null;

  const cacheKey = `${limit}:${windowMs}`;
  let limiter = limiterCache.get(cacheKey);
  if (!limiter) {
    const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
      prefix: "aee:rl",
      analytics: false,
    });
    limiterCache.set(cacheKey, limiter);
  }

  const { success, reset } = await limiter.limit(key);
  if (success) return { ok: true };
  return {
    ok: false,
    retryAfterSec: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
  };
}

import { Ratelimit } from "@upstash/ratelimit";
import { getUpstashRedis } from "@/lib/upstash-redis";

const limiterCache = new Map<string, Ratelimit>();

export function isDistributedRateLimitEnabled(): boolean {
  return getUpstashRedis() !== null;
}

export async function checkDistributedRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ ok: true } | { ok: false; retryAfterSec: number } | null> {
  const redis = getUpstashRedis();
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

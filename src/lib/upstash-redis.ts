import { Redis } from "@upstash/redis";

const CACHE_PREFIX = "aee:cache:";

let redisClient: Redis | null | undefined;

/** Resolve REST credentials (Vercel integration may use KV_* or UPSTASH_* names). */
function resolveUpstashRestCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL?.trim() ||
    process.env.KV_REST_API_URL?.trim() ||
    process.env.KV_URL?.trim();
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN?.trim() ||
    process.env.KV_REST_API_TOKEN?.trim() ||
    process.env.KV_REST_API_READ_ONLY_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

/** Shared Upstash client for rate limits + cross-instance cache. */
export function getUpstashRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const creds = resolveUpstashRestCredentials();
  if (!creds) {
    redisClient = null;
    return null;
  }
  redisClient = new Redis({ url: creds.url, token: creds.token });
  return redisClient;
}

export function isUpstashRedisEnabled(): boolean {
  return getUpstashRedis() !== null;
}

function reviveDates(key: string, value: unknown): unknown {
  if (!value || typeof value !== "object") return value;

  if (key.includes("user-access") || key.includes("subscription-status")) {
    const access = value as { subscription?: { trialEndsAt?: unknown } };
    const raw = access.subscription?.trialEndsAt;
    if (typeof raw === "string") {
      return {
        ...access,
        subscription: {
          ...access.subscription,
          trialEndsAt: new Date(raw),
        },
      };
    }
  }

  if (key.includes("exam-preference")) {
    const pref = value as { lastStudiedAt?: unknown };
    if (typeof pref.lastStudiedAt === "string") {
      return { ...pref, lastStudiedAt: new Date(pref.lastStudiedAt) };
    }
  }

  return value;
}

export async function redisCacheGet<T>(key: string): Promise<T | null> {
  const redis = getUpstashRedis();
  if (!redis) return null;
  try {
    const raw = await redis.get<string>(`${CACHE_PREFIX}${key}`);
    if (raw == null) return null;
    const parsed = JSON.parse(raw) as T;
    return reviveDates(key, parsed) as T;
  } catch {
    return null;
  }
}

export async function redisCacheSet<T>(key: string, value: T, ttlMs: number): Promise<void> {
  const redis = getUpstashRedis();
  if (!redis) return;
  const ttlSec = Math.max(1, Math.ceil(ttlMs / 1000));
  try {
    await redis.set(`${CACHE_PREFIX}${key}`, JSON.stringify(value), { ex: ttlSec });
  } catch {
    /* non-blocking — local L1 cache still serves this instance */
  }
}

export async function redisCacheDelete(key: string): Promise<void> {
  const redis = getUpstashRedis();
  if (!redis) return;
  try {
    await redis.del(`${CACHE_PREFIX}${key}`);
  } catch {
    /* ignore */
  }
}

/**
 * Two-tier cache: in-process L1 + optional Upstash Redis L2 for cross-instance hits.
 * Hot paths (user access, subscription status, exam preference) use cacheGetOrSetDeduped.
 */
import {
  redisCacheDelete,
  redisCacheGet,
  redisCacheSet,
  isUpstashRedisEnabled,
} from "@/lib/upstash-redis";

export { isUpstashRedisEnabled };

type Entry<T> = { expiresAt: number; value: T };

const store = new Map<string, Entry<unknown>>();

const MAX_ENTRIES = 500;

function prune(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
  if (store.size <= MAX_ENTRIES) return;
  const sorted = [...store.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt);
  for (let i = 0; i < sorted.length - MAX_ENTRIES; i++) {
    store.delete(sorted[i][0]);
  }
}

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  prune();
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function cacheDelete(key: string): void {
  store.delete(key);
  void redisCacheDelete(key);
}

/** Delete all entries whose key starts with `prefix` (L1 only — use targeted deletes for Redis). */
export function cacheDeleteMatching(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key);
      void redisCacheDelete(key);
    }
  }
}

export async function cacheGetOrSet<T>(
  key: string,
  ttlMs: number,
  factory: () => Promise<T>
): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit != null) return hit;

  const remoteHit = await redisCacheGet<T>(key);
  if (remoteHit != null) {
    cacheSet(key, remoteHit, ttlMs);
    return remoteHit;
  }

  const value = await factory();
  cacheSet(key, value, ttlMs);
  await redisCacheSet(key, value, ttlMs);
  return value;
}

/** Coalesce concurrent cache misses for the same key (prevents duplicate DB work). */
const inflight = new Map<string, Promise<unknown>>();

export async function cacheGetOrSetDeduped<T>(
  key: string,
  ttlMs: number,
  factory: () => Promise<T>
): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit != null) return hit;

  const remoteHit = await redisCacheGet<T>(key);
  if (remoteHit != null) {
    cacheSet(key, remoteHit, ttlMs);
    return remoteHit;
  }

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const promise = factory()
    .then(async (value) => {
      cacheSet(key, value, ttlMs);
      await redisCacheSet(key, value, ttlMs);
      inflight.delete(key);
      return value;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });

  inflight.set(key, promise);
  return promise;
}

export function cacheHas(key: string): boolean {
  return cacheGet(key) != null;
}

export function cacheKey(parts: (string | number | undefined | null)[]): string {
  return parts.filter((p) => p != null && p !== "").join(":");
}

/** Default TTLs tuned for cost vs freshness at scale */
export const CACHE_TTL = {
  researchBrief: 60 * 60 * 1000, // 1h — Tavily + synthesis
  subjectCatalog: 30 * 60 * 1000, // 30m — topic counts change infrequently post-sync
  learningDashboard: 30 * 1000, // 30s per user
  examPreference: 60 * 1000, // 60s per user
  userAccess: 60 * 1000, // 60s per user — dedupes requirePremiumPage + nav
  referenceBrief: 2 * 60 * 60 * 1000, // 2h — AI + OER synthesis per user/exam
  subscriptionStatus: 60 * 1000, // 60s per user — dedupes nav + home fetches
  questionBankSlice: 10 * 60 * 1000, // 10m
} as const;

export function invalidateSubscriptionStatusCache(userId: string): void {
  cacheDelete(cacheKey(["subscription-status", userId]));
  cacheDelete(cacheKey(["user-access", userId]));
}

export function invalidateExamPreferenceCache(userId: string): void {
  cacheDelete(cacheKey(["exam-preference", userId]));
}

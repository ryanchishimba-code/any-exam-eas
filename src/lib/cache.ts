/**
 * Two-tier cache: in-process L1 + optional Upstash Redis L2 for cross-instance hits.
 * Hot paths (user access, subscription status, exam preference) use cacheGetOrSetDeduped.
 * Pass `staleTtlMs` to serve expired entries when the DB is temporarily unavailable.
 */
import {
  redisCacheDelete,
  redisCacheGet,
  redisCacheSet,
  isUpstashRedisEnabled,
} from "@/lib/upstash-redis";
import { isTransientDbError } from "@/lib/db-resilience";

export { isUpstashRedisEnabled };

type Entry<T> = { expiresAt: number; staleUntil: number; value: T };

const store = new Map<string, Entry<unknown>>();

const MAX_ENTRIES = 500;

export type CacheResilienceOptions = {
  /** Keep serving expired entries for this long on transient DB errors. */
  staleTtlMs?: number;
};

function prune(): void {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.staleUntil <= now) store.delete(key);
  }
  if (store.size <= MAX_ENTRIES) return;
  const sorted = [...store.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt);
  for (let i = 0; i < sorted.length - MAX_ENTRIES; i++) {
    store.delete(sorted[i][0]);
  }
}

function cacheGetEntry<T>(key: string): { value: T; fresh: boolean } | null {
  const entry = store.get(key);
  if (!entry) return null;
  const now = Date.now();
  if (now > entry.staleUntil) {
    store.delete(key);
    return null;
  }
  return { value: entry.value as T, fresh: now <= entry.expiresAt };
}

export function cacheGet<T>(key: string): T | null {
  const hit = cacheGetEntry<T>(key);
  return hit?.fresh ? hit.value : null;
}

export function cacheSet<T>(
  key: string,
  value: T,
  ttlMs: number,
  staleTtlMs = 0
): void {
  prune();
  const now = Date.now();
  store.set(key, {
    value,
    expiresAt: now + ttlMs,
    staleUntil: now + ttlMs + staleTtlMs,
  });
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

async function readThroughCache<T>(
  key: string,
  ttlMs: number,
  factory: () => Promise<T>,
  options?: CacheResilienceOptions
): Promise<T> {
  const staleTtlMs = options?.staleTtlMs ?? 0;
  const l1 = cacheGetEntry<T>(key);
  if (l1?.fresh) return l1.value;

  const remoteHit = await redisCacheGet<T>(key);
  if (remoteHit != null) {
    cacheSet(key, remoteHit, ttlMs, staleTtlMs);
    return remoteHit;
  }

  try {
    const value = await factory();
    cacheSet(key, value, ttlMs, staleTtlMs);
    const redisTtl = staleTtlMs > 0 ? ttlMs + staleTtlMs : ttlMs;
    await redisCacheSet(key, value, redisTtl);
    return value;
  } catch (error) {
    if (staleTtlMs > 0 && l1 && isTransientDbError(error)) {
      console.warn(`[cache:stale] serving stale L1 entry for ${key}`);
      return l1.value;
    }
    throw error;
  }
}

export async function cacheGetOrSet<T>(
  key: string,
  ttlMs: number,
  factory: () => Promise<T>,
  options?: CacheResilienceOptions
): Promise<T> {
  return readThroughCache(key, ttlMs, factory, options);
}

/** Coalesce concurrent cache misses for the same key (prevents duplicate DB work). */
const inflight = new Map<string, Promise<unknown>>();

export async function cacheGetOrSetDeduped<T>(
  key: string,
  ttlMs: number,
  factory: () => Promise<T>,
  options?: CacheResilienceOptions
): Promise<T> {
  const staleTtlMs = options?.staleTtlMs ?? 0;
  const l1 = cacheGetEntry<T>(key);
  if (l1?.fresh) return l1.value;

  const remoteHit = await redisCacheGet<T>(key);
  if (remoteHit != null) {
    cacheSet(key, remoteHit, ttlMs, staleTtlMs);
    return remoteHit;
  }

  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;

  const promise = readThroughCache(key, ttlMs, factory, options)
    .then((value) => {
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

/** Stale windows for resilient cache reads when Neon is briefly unavailable. */
export const CACHE_STALE = {
  subjectCatalog: 2 * 60 * 60 * 1000, // 2h
  learningDashboard: 5 * 60 * 1000, // 5m
  userAccess: 10 * 60 * 1000, // 10m
  examPreference: 10 * 60 * 1000, // 10m
  examCatalog: 60 * 60 * 1000, // 1h
} as const;

export function invalidateSubscriptionStatusCache(userId: string): void {
  cacheDelete(cacheKey(["subscription-status", userId]));
  cacheDelete(cacheKey(["user-access", userId]));
}

export function invalidateExamPreferenceCache(userId: string): void {
  cacheDelete(cacheKey(["exam-preference", userId]));
  invalidateLearningDashboardCache(userId);
}

/** Drop per-user dashboard / weak-topic caches when the selected exam changes. */
export function invalidateLearningDashboardCache(userId: string): void {
  const dashboardPrefix = cacheKey(["student-dashboard", userId]);
  cacheDeleteMatching(`${dashboardPrefix}:`);
  cacheDeleteMatching(`${cacheKey(["weak-topics", userId])}:`);
  cacheDeleteMatching(`${cacheKey(["library-hub-stats", userId])}:`);
}

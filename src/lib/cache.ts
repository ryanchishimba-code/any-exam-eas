/**
 * In-process TTL cache for serverless-friendly hot paths.
 * At 3k MAU on Vercel, pair with Neon + short TTLs; upgrade to Redis/Upstash for cross-instance cache.
 */

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

export async function cacheGetOrSet<T>(
  key: string,
  ttlMs: number,
  factory: () => Promise<T>
): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit != null) return hit;
  const value = await factory();
  cacheSet(key, value, ttlMs);
  return value;
}

export function cacheKey(parts: (string | number | undefined | null)[]): string {
  return parts.filter((p) => p != null && p !== "").join(":");
}

/** Default TTLs tuned for cost vs freshness at ~3k MAU */
export const CACHE_TTL = {
  researchBrief: 60 * 60 * 1000, // 1h — Tavily + synthesis
  subjectCatalog: 5 * 60 * 1000, // 5m
  learningDashboard: 30 * 1000, // 30s per user
  questionBankSlice: 10 * 60 * 1000, // 10m
} as const;

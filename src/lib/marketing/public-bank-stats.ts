/**
 * Origin reader for `/api/marketing/bank-counts`.
 *
 * Marketing pages and this route both read `getIsrBankStatsBundle()` (the Next
 * data cache). A separate Upstash value used to outlive a failed recompute and
 * keep serving an older total with `degraded: false`. Redis is now only a
 * last-good fallback, capped at 30 minutes, and that fallback is marked
 * degraded. The key is v2 so a value stored by the previous layer is ignored.
 */
import { cacheDelete } from "@/lib/cache";
import { redisCacheGet, redisCacheSet } from "@/lib/upstash-redis";
import { getIsrBankStatsBundle } from "@/lib/marketing/public-question-count";
import type { BankStatsBundle, BankStatsCacheOptions } from "@/lib/marketing/question-bank-counts";

export const PUBLIC_BANK_STATS_CACHE_KEY = "public-bank-stats-v2";

/** Last-good Redis fallback. Older than this, the API returns the failed read. */
export const PUBLIC_BANK_STATS_STALE_MAX_MS = 30 * 60 * 1000;

type StoredBankStats = {
  bundle: BankStatsBundle;
  storedAt: number;
};

function isDegraded(bundle: BankStatsBundle): boolean {
  return Boolean(bundle.inventory?.degraded || bundle.snapshot?.degraded);
}

function isStoredBankStats(value: unknown): value is StoredBankStats {
  if (!value || typeof value !== "object") return false;
  const stored = value as StoredBankStats;
  return (
    typeof stored.storedAt === "number" &&
    Number.isFinite(stored.storedAt) &&
    !!stored.bundle?.snapshot &&
    !!stored.bundle?.inventory
  );
}

function markStale(bundle: BankStatsBundle, staleAgeMs: number): BankStatsBundle {
  return {
    ...bundle,
    staleAgeMs,
    snapshot: { ...bundle.snapshot, degraded: true },
    inventory: { ...bundle.inventory, degraded: true },
  };
}

async function rememberFresh(bundle: BankStatsBundle, storedAt = Date.now()): Promise<void> {
  const stored: StoredBankStats = { bundle, storedAt };
  await redisCacheSet(PUBLIC_BANK_STATS_CACHE_KEY, stored, PUBLIC_BANK_STATS_STALE_MAX_MS);
}

async function readStored(): Promise<StoredBankStats | null> {
  const value = await redisCacheGet<unknown>(PUBLIC_BANK_STATS_CACHE_KEY);
  return isStoredBankStats(value) ? value : null;
}

/**
 * Same snapshot the marketing pages render.
 * `options` is ignored: the shared loader always skips `connection()`.
 * A failed recompute logs the real error. A Redis fallback younger than
 * 30 minutes is returned with `degraded: true` and `staleAgeMs`.
 */
export async function getPublicBankStatsBundle(
  _options?: BankStatsCacheOptions
): Promise<BankStatsBundle> {
  let fresh: BankStatsBundle | null = null;
  let failure: unknown = null;
  try {
    fresh = await getIsrBankStatsBundle();
  } catch (error) {
    failure = error;
  }

  if (fresh && !isDegraded(fresh)) {
    await rememberFresh(fresh);
    return fresh;
  }

  const reason = failure ?? new Error("bank counts degraded");
  console.error("[bank-counts] recompute failed:", reason);

  const stored = await readStored();
  const ageMs = stored ? Math.max(0, Date.now() - stored.storedAt) : null;
  if (stored && ageMs != null && ageMs <= PUBLIC_BANK_STATS_STALE_MAX_MS) {
    console.error(
      `[bank-counts] serving stale snapshot ageMs=${ageMs} storedAt=${new Date(stored.storedAt).toISOString()}`
    );
    return markStale(stored.bundle, ageMs);
  }

  if (fresh) return fresh;
  throw reason;
}

/** Test hook. Drops the shared public value. */
export function resetPublicBankStatsCache(): void {
  cacheDelete(PUBLIC_BANK_STATS_CACHE_KEY);
}

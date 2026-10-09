/**
 * Logged-out bank-counts cache.
 *
 * Marketing pages fetch `/api/marketing/bank-counts` on every view. The counts
 * themselves still come from `getCachedBankStatsBundle()` (same stamp, same
 * SQL). This layer only changes how often that work runs: one shared value
 * for 10 minutes, one in-flight recompute per isolate, and the previous good
 * value when the recompute fails.
 */
import { cacheDelete, cacheGetOrSetDeduped } from "@/lib/cache";
import { DbUnavailableError } from "@/lib/db-resilience";
import { PUBLIC_BANK_COUNTS_CACHE_SECONDS } from "@/lib/inventory/active-inventory-cache";
import {
  getCachedBankStatsBundle,
  type BankStatsBundle,
} from "@/lib/marketing/question-bank-counts";

export const PUBLIC_BANK_STATS_CACHE_KEY = "public-bank-stats-v1";

const FRESH_MS = PUBLIC_BANK_COUNTS_CACHE_SECONDS * 1000;

class DegradedBankStatsError extends DbUnavailableError {
  readonly bundle: BankStatsBundle;

  constructor(bundle: BankStatsBundle) {
    super("bank counts degraded");
    this.name = "DegradedBankStatsError";
    this.bundle = bundle;
  }
}

function isDegraded(bundle: BankStatsBundle): boolean {
  return bundle.inventory.degraded || bundle.snapshot.degraded;
}

async function loadFreshPublicBankStats(): Promise<BankStatsBundle> {
  const bundle = await getCachedBankStatsBundle();
  if (isDegraded(bundle)) throw new DegradedBankStatsError(bundle);
  return bundle;
}

export async function getPublicBankStatsBundle(): Promise<BankStatsBundle> {
  try {
    return await cacheGetOrSetDeduped(
      PUBLIC_BANK_STATS_CACHE_KEY,
      FRESH_MS,
      loadFreshPublicBankStats,
      { staleTtlMs: FRESH_MS }
    );
  } catch (error) {
    if (error instanceof DegradedBankStatsError) return error.bundle;
    throw error;
  }
}

/** Test hook. Drops the shared public value. */
export function resetPublicBankStatsCache(): void {
  cacheDelete(PUBLIC_BANK_STATS_CACHE_KEY);
}

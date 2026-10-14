import type { BankStatsBundle } from "@/lib/marketing/question-bank-counts";

/**
 * Last successful question-count snapshot on this isolate.
 * ISR revalidation returns this instead of throwing when a read fails, so
 * Next can store the response and the page leaves the STALE retry loop.
 */
let lastGood: BankStatsBundle | null = null;

export function rememberLastGoodBankStats(bundle: BankStatsBundle): void {
  if (bundle.inventory.degraded || bundle.snapshot.degraded) return;
  if ((bundle.snapshot.totals?.served ?? 0) <= 0) return;
  lastGood = bundle;
}

export function readLastGoodBankStats(): BankStatsBundle | null {
  return lastGood;
}

export function resetLastGoodBankStats(): void {
  lastGood = null;
}

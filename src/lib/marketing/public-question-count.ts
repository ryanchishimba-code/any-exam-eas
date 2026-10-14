/**
 * One public question-count read for server pages.
 *
 * The body uses the same snapshot as `/api/marketing/bank-counts`
 * (`getCachedBankStatsBundle`). Document heads use a floor of that total so a
 * title cannot claim more questions than the page.
 *
 * This path is `unstable_cache` only. It must not call the Upstash REST
 * client: that fetch is `cache: "no-store"` and turns an ISR page dynamic
 * during revalidation. The bank-counts API reads this same function.
 * A failed count read returns the last good counts and is cached, so
 * revalidation finishes instead of leaving the page STALE.
 */
import { unstable_cache } from "next/cache";
import { formatRoundedDownQuestionCount } from "@/lib/counts";
import { emptyActiveInventory } from "@/lib/inventory/active-questions";
import {
  ACTIVE_INVENTORY_CACHE_TAG,
  ACTIVE_INVENTORY_STAMP_TTL_SECONDS,
} from "@/lib/inventory/active-inventory-cache";
import {
  readLastGoodBankStats,
  rememberLastGoodBankStats,
} from "@/lib/marketing/last-good-bank-stats";
import {
  buildLandingBankCountsDisplay,
  emptyQuestionBankCountsSnapshot,
  getCachedBankStatsBundle,
  type BankStatsBundle,
  type BankStatsCacheOptions,
  type LandingBankCountsDisplay,
} from "@/lib/marketing/question-bank-counts";

export type PublicQuestionCounts = {
  bundle: BankStatsBundle;
  display: LandingBankCountsDisplay;
  /** Exact live total for visible copy and JSON-LD. Empty when the lookup failed. */
  exactLabel: string;
  /** Floor for titles, descriptions, and social cards. Empty when the lookup failed. */
  staticLabel: string;
};

/**
 * Floor of a live scored-item total for static head copy.
 * Delegates to `formatRoundedDownQuestionCount` (nearest hundred, never up).
 * Zero and a failed lookup return an empty string so the head omits a number.
 */
export function staticQuestionCountLabel(total: number): string {
  if (!Number.isFinite(total) || total <= 0) return "";
  return formatRoundedDownQuestionCount(total);
}

function degradedIsrBundle(): BankStatsBundle {
  return {
    inventory: emptyActiveInventory(true),
    snapshot: emptyQuestionBankCountsSnapshot(true),
  };
}

async function loadIsrBankStats(): Promise<BankStatsBundle> {
  try {
    const bundle = await getCachedBankStatsBundle({ dynamic: false });
    if (!bundle.inventory.degraded && !bundle.snapshot.degraded) {
      rememberLastGoodBankStats(bundle);
      return bundle;
    }
    const last = readLastGoodBankStats();
    if (last) {
      console.error("[marketing] question-count lookup failed; serving last good counts");
      return last;
    }
    console.error(
      "[marketing] question-count lookup failed; caching the degraded read so ISR does not retry"
    );
    return bundle;
  } catch (error) {
    const last = readLastGoodBankStats();
    if (last) {
      console.error("[marketing] question-count lookup failed; serving last good counts", error);
      return last;
    }
    console.error("[marketing] question-count lookup failed:", error);
    return degradedIsrBundle();
  }
}

/**
 * Next data cache for statically rendered pages. Revalidate matches the
 * marketing ISR window. A failed lookup returns the last good counts, or a
 * degraded bundle, and that result is stored. Throwing here is not cached,
 * so every revalidation would query again and the page would stay STALE.
 */
const readIsrBankStats = unstable_cache(loadIsrBankStats, ["public-bank-stats-isr-v2"], {
  revalidate: ACTIVE_INVENTORY_STAMP_TTL_SECONDS,
  tags: [ACTIVE_INVENTORY_CACHE_TAG],
});

export async function getIsrBankStatsBundle(): Promise<BankStatsBundle> {
  return readIsrBankStats();
}

/**
 * `options` is accepted so ISR pages can pass `{ dynamic: false }`.
 * The read always uses the static data cache and never Redis.
 */
export async function loadPublicQuestionCounts(
  options?: BankStatsCacheOptions
): Promise<PublicQuestionCounts> {
  void options;
  const bundle = await getIsrBankStatsBundle();
  const display = buildLandingBankCountsDisplay(bundle.snapshot);
  const live = !display.degraded && display.totalServed > 0;
  return {
    bundle,
    display,
    exactLabel: live ? display.totalLabel : "",
    staticLabel: live ? staticQuestionCountLabel(display.totalServed) : "",
  };
}

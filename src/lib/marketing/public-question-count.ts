/**
 * One public question-count read for server pages.
 *
 * The body uses the exact live total from `getPublicBankStatsBundle()` — the
 * same function `/api/marketing/bank-counts` calls. Document heads cannot
 * safely repeat that exact total: a title cached ahead of the body would
 * contradict it. Heads use `staticQuestionCountLabel`, a floor of the same
 * total, so the head is never higher than the number on the page.
 */
import { formatRoundedDownQuestionCount } from "@/lib/counts";
import {
  buildLandingBankCountsDisplay,
  type BankStatsBundle,
  type BankStatsCacheOptions,
  type LandingBankCountsDisplay,
} from "@/lib/marketing/question-bank-counts";
import { getPublicBankStatsBundle } from "@/lib/marketing/public-bank-stats";

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

export async function loadPublicQuestionCounts(
  options?: BankStatsCacheOptions
): Promise<PublicQuestionCounts> {
  const bundle = await getPublicBankStatsBundle(options);
  const display = buildLandingBankCountsDisplay(bundle.snapshot);
  const live = !display.degraded && display.totalServed > 0;
  return {
    bundle,
    display,
    exactLabel: live ? display.totalLabel : "",
    staticLabel: live ? staticQuestionCountLabel(display.totalServed) : "",
  };
}

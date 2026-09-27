import { formatMonthlyPrice } from "@/lib/site";

/**
 * Plain price line near homepage pricing. Names no competitors.
 * Source ranges captured 2026-09-27: Kaplan $99–$399 course list, Archer $79–$399.
 * The public sentence uses the $79 to $399 span and does not name those brands.
 */
export function formatNclexPrepPriceComparison(
  monthly: string = formatMonthlyPrice("pro")
): string {
  return `Other NCLEX prep we checked lists at $79 to $399 (public prices, Sep 27, 2026). AnyExamEasy is ${monthly} a month, cancel anytime.`;
}

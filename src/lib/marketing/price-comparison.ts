import { formatMonthlyPrice } from "@/lib/site";

/**
 * Plain price line near homepage pricing. Names no competitors.
 * Source ranges captured 2026-09-27: Kaplan $99–$399 course list, Archer $79–$399.
 * The public sentence uses $99 to $400+ and does not name those brands.
 */
export function formatNclexPrepPriceComparison(
  monthly: string = formatMonthlyPrice("pro")
): string {
  return `Most NCLEX prep courses cost $99 to $400+ up front. AnyExamEasy is ${monthly} a month, cancel anytime.`;
}

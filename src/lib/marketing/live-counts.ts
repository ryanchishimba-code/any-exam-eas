import type { ExamRouteSlug } from "@/lib/routes";
import { formatExactServeReadyCount } from "@/lib/marketing/bank-stats";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

/** Live serve-ready stat for nav / footer exam links. */
export function examNavStatLabel(
  slug: ExamRouteSlug,
  bankCounts?: LandingBankCountsDisplay | null
): string {
  const live = bankCounts?.exams.find((row) => row.slug === slug);
  if (live?.countLabel && live.countLabel !== "—") {
    return `${live.countLabel} questions`;
  }
  return "Board-style questions";
}

export function totalQuestionsLabel(
  bankCounts?: LandingBankCountsDisplay | null
): string {
  if (bankCounts?.totalLabel && bankCounts.totalLabel !== "—") {
    return bankCounts.totalLabel;
  }
  return "";
}

export function totalQuestionsDetail(
  bankCounts?: LandingBankCountsDisplay | null
): string {
  if (bankCounts?.totalQuestionsLabel) {
    return bankCounts.totalQuestionsLabel;
  }
  return "";
}

export function formatLiveTotalForCopy(
  bankCounts?: LandingBankCountsDisplay | null
): string {
  const n = bankCounts?.totalServed;
  if (n && n > 0) return formatExactServeReadyCount(n);
  return "";
}

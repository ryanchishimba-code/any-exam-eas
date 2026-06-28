import type { ExamRouteSlug } from "@/lib/routes";
import {
  FALLBACK_QUESTION_COUNTS,
  formatExactServeReadyCount,
} from "@/lib/marketing/bank-stats";
import type { LandingBankCountsDisplay } from "@/lib/marketing/question-bank-counts";

const SLUG_TO_FIELD: Record<ExamRouteSlug, keyof typeof FALLBACK_QUESTION_COUNTS | null> = {
  nclex: "nursing",
  usmle: "usmle",
  naplex: "pharmacy",
  pance: null,
  "aanp-fnp": "aanpFnp",
  "npte-pt": "nptePt",
};

/** Live serve-ready stat for nav / footer exam links. */
export function examNavStatLabel(
  slug: ExamRouteSlug,
  bankCounts?: LandingBankCountsDisplay | null
): string {
  const live = bankCounts?.exams.find((row) => row.slug === slug);
  if (live?.countLabel && live.countLabel !== "—") {
    return `${live.countLabel} items`;
  }
  const fallbackKey = SLUG_TO_FIELD[slug];
  if (fallbackKey && fallbackKey !== null) {
    return `${FALLBACK_QUESTION_COUNTS[fallbackKey]} items`;
  }
  if (slug === "pance") return "300Q blueprint";
  return "Board-style items";
}

export function totalQuestionsLabel(
  bankCounts?: LandingBankCountsDisplay | null
): string {
  if (bankCounts?.totalLabel && bankCounts.totalLabel !== "—") {
    return bankCounts.totalLabel;
  }
  return FALLBACK_QUESTION_COUNTS.total;
}

export function totalQuestionsDetail(
  bankCounts?: LandingBankCountsDisplay | null
): string {
  if (bankCounts?.totalQuestionsLabel) {
    return bankCounts.totalQuestionsLabel;
  }
  return `${FALLBACK_QUESTION_COUNTS.total} serve-ready questions`;
}

export function formatLiveTotalForCopy(
  bankCounts?: LandingBankCountsDisplay | null
): string {
  const n = bankCounts?.totalServed;
  if (n && n > 0) return formatExactServeReadyCount(n);
  return FALLBACK_QUESTION_COUNTS.total;
}

import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatMonthlyPrice } from "@/lib/site";
import { getExamSeoConfig, type ExamSeoKey } from "@/lib/seo/exam-config";

/** Visible final band heading (matches primary CTA tone). */
export const BOARD_LANDING_FINAL_HEADING = "Start free trial.";

/** SEO title for board hubs — truthful trial, fits 60-char budget for every board label. */
export function boardLandingMetaTitle(boardLabel: string): string {
  const price = formatMonthlyPrice("pro");
  return `${boardLabel} Practice Questions + ${TRIAL_DAYS}-Day Free Trial | ${price}/mo`;
}

/** Breadcrumb / kicker board name on `/nclex`, `/npte-pt`, etc. */
export function boardLandingBreadcrumbName(examKey: ExamSeoKey): string {
  switch (examKey) {
    case "nclex":
      return "NCLEX-RN";
    case "npte-pt":
      return "NPTE-PT";
    default:
      return getExamSeoConfig(examKey).shortName;
  }
}

/** H1 count line noun (e.g. "NCLEX-RN questions"). */
export function boardLandingQuestionNoun(examKey: ExamSeoKey): string {
  return `${boardLandingBreadcrumbName(examKey)} questions`;
}

/** SEO H1 — board keyword + “Practice Questions”. */
export function boardLandingH1(boardLabel: string): string {
  return `${boardLabel} Practice Questions`;
}

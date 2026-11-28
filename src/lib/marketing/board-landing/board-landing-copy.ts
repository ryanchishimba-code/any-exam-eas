import { getExamSeoConfig, type ExamSeoKey } from "@/lib/seo/exam-config";

/** Visible final band heading (matches primary CTA tone). */
export const BOARD_LANDING_FINAL_HEADING = "Start free trial.";

/**
 * Document title for each board hub. The visible H1 stays in
 * boardHeroMarketingCopy and is not this string.
 */
const BOARD_META_TITLES: Record<string, string> = {
  "NCLEX-RN": "NCLEX-RN Practice Questions with Rationales | AnyExamEasy",
  NAPLEX: "NAPLEX Practice Questions & Calculations | AnyExamEasy",
  USMLE: "USMLE Step 1, 2 CK & 3 Practice Questions | AnyExamEasy",
  PANCE: "PANCE Practice Questions & Question Bank | AnyExamEasy",
  "AANP FNP": "AANP FNP Practice Questions & Exam Prep | AnyExamEasy",
  "NPTE-PT": "NPTE-PT Practice Questions with Explanations | AnyExamEasy",
};

/** SEO title for board hubs. Includes the brand once. No price. */
export function boardLandingMetaTitle(boardLabel: string): string {
  return BOARD_META_TITLES[boardLabel] ?? `${boardLabel} Practice Questions | AnyExamEasy`;
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

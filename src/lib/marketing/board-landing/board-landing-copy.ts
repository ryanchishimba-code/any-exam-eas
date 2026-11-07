import { boardHeroMarketingCopy } from "@/lib/marketing/board-landing/board-hero-marketing";
import type { BoardSlug } from "@/lib/marketing/board-landing/board-theme";
import { getExamSeoConfig, type ExamSeoKey } from "@/lib/seo/exam-config";

/** Visible final band heading (matches primary CTA tone). */
export const BOARD_LANDING_FINAL_HEADING = "Start free trial.";

const META_TITLE_SLUG: Record<string, BoardSlug> = {
  "NCLEX-RN": "nclex",
  NAPLEX: "naplex",
  USMLE: "usmle",
  PANCE: "pance",
  "AANP FNP": "aanp-fnp",
  "NPTE-PT": "npte-pt",
};

/** SEO title for board hubs. Same words as the page H1, with no price. */
export function boardLandingMetaTitle(boardLabel: string): string {
  const slug = META_TITLE_SLUG[boardLabel];
  if (!slug) return `${boardLabel} Practice Questions`;
  return boardHeroMarketingCopy(slug).headline;
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

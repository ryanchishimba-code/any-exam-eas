import { LANDING_HERO_EXAMS } from "@/lib/landing/content";

/**
 * Same words as the rationale control. The mark appears when the item
 * stores citations. This line does not say every item has one.
 */
export const HOME_GUIDELINE_LINE = "Guideline-checked explanations with sources";

export type HomeCompareRow = {
  id: string;
  feature: string;
  /** Board names under the subscription row. Empty for the other rows. */
  detail: string;
  /** Short, neutral wording. No competitor name. */
  typical: string;
};

const BOARD_NAMES = LANDING_HERO_EXAMS.map((exam) => exam.label).join(", ");

/**
 * Six distinguishing rows. Question totals stay off this table because the
 * proof strip already shows the live count.
 * NGN is named when the same snapshot has published case studies.
 */
export function homeCompareRows(ngnCaseStudies: boolean): HomeCompareRow[] {
  const boards = LANDING_HERO_EXAMS.length;
  return [
    {
      id: "boards",
      feature: `${boards} boards in one subscription`,
      detail: BOARD_NAMES,
      typical: "Often one exam per subscription",
    },
    {
      id: "sources",
      feature: HOME_GUIDELINE_LINE,
      detail: "",
      typical: "Not always shown",
    },
    {
      id: "ngn",
      feature: ngnCaseStudies
        ? "NGN case studies and NCLEX exam mode"
        : "NCLEX exam mode",
      detail: "",
      typical: "Varies",
    },
    {
      id: "videos",
      feature: "Quick Bites lessons with quizzes",
      detail: "",
      typical: "Often a separate purchase",
    },
    {
      id: "readiness",
      feature: "Readiness score",
      detail: "",
      typical: "Varies",
    },
    {
      id: "qotd",
      feature: "Free Question of the Day",
      detail: "",
      typical: "Varies",
    },
  ];
}

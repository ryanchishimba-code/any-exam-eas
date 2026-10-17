import { LANDING_HERO_EXAMS } from "@/lib/landing/content";

/** Fair contrast. No competitor, price, or absolute claim. */
export const HOME_COMPARE_OTHER = "Often extra or not included";

/**
 * Same words as the rationale control. The mark appears when the item
 * stores citations. This line does not say every item has one.
 */
export const HOME_GUIDELINE_LINE = "Guideline-checked explanations with sources";

export type HomeCompareItem = {
  id: string;
  text: string;
};

const FEATURES: readonly HomeCompareItem[] = [
  { id: "exam-mode", text: "NCLEX exam mode" },
  { id: "sources", text: HOME_GUIDELINE_LINE },
  { id: "videos", text: "Quick Bites videos" },
  { id: "readiness", text: "Practice readiness" },
  { id: "qotd", text: "Question of the Day" },
];

/**
 * Board names come from the homepage exam list.
 * A count is appended when the live bank display has one.
 * NGN is included when the same snapshot has published case studies.
 */
export function homeCompareItems(
  exams: readonly { slug: string; countLabel: string }[],
  ngnCaseStudies: boolean
): HomeCompareItem[] {
  const counts = new Map(exams.map((exam) => [exam.slug, exam.countLabel.trim()]));
  const boards: HomeCompareItem[] = LANDING_HERO_EXAMS.map((exam) => {
    const count = counts.get(exam.slug) ?? "";
    const noun = count === "1" ? "question" : "questions";
    return {
      id: exam.slug,
      text: count ? `${exam.label} · ${count} ${noun}` : exam.label,
    };
  });
  const ngn: HomeCompareItem[] = ngnCaseStudies
    ? [{ id: "ngn", text: "NGN case studies" }]
    : [];
  return [...boards, ...ngn, ...FEATURES];
}

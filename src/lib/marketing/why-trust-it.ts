import { NGN_DEMO_QUESTIONS } from "@/lib/demo/ngn-samples";
import { EXAM_CATALOG } from "@/lib/edtech/exams";
import type { BoardInventoryPresentation, FormatCounts } from "@/lib/inventory/active-questions";
import { isFormatOffered } from "@/lib/study/offered-formats";
import type { LandingSuccessStory } from "@/lib/landing/content";
import { getExamSeoConfig, type ExamSeoKey } from "@/lib/seo/exam-config";

/**
 * Facts for the board-landing "Why trust it" block.
 *
 * Counts come from the same `BoardInventoryPresentation` the page already
 * built (`presentBoardInventory` → active-question inventory). The sample
 * rationale is copied from `NGN_DEMO_QUESTIONS`, the public NCLEX sample.
 * Nothing here invents pass rates, headcount, or reviewer names.
 */

export const TRUST_PASS_PATH = [
  "Study guide",
  "Qbank",
  "Review incorrect",
  "Readiness Proof",
  "Full exam",
] as const;

export const TRUST_PASS_PATH_COPY =
  "Read the study guide, practice in the Qbank, and send misses to Review incorrect. Readiness Proof on the dashboard is the practice check before a Full exam.";

/** Honest framing. A practice band is not a licensure result. */
export const TRUST_READINESS_LINE = "Practice readiness, not a licensure prediction.";

export type CitedSample = {
  /** Board the sample item actually belongs to. */
  boardLabel: string;
  rationale: string;
  citation: string;
};

/**
 * One real sample rationale plus the citation stored on that item.
 * NCLEX uses the public NGN demo (the same bow-tie the hero plays).
 * Other boards' landing samples do not store a citation, so this returns
 * null instead of borrowing the NCLEX source.
 */
export function citedSampleForBoard(
  examKey: ExamSeoKey,
  formats?: FormatCounts | null
): CitedSample | null {
  if (examKey !== "nclex") return null;
  if (!isFormatOffered("ngn", formats)) return null;
  const item = NGN_DEMO_QUESTIONS[0];
  const citation = item?.references?.[0]?.trim();
  const rationale = item?.explanation?.trim();
  if (!item || !citation || !rationale) return null;
  return {
    boardLabel: "NCLEX",
    rationale,
    citation,
  };
}

/** "{Board} 5,598 MCQ · 492 NGN · 153 cases" from the page's format line. */
export function trustInventoryLine(
  shortName: string,
  formatLine: string | null | undefined
): string | null {
  const format = formatLine?.trim();
  const name = shortName.trim();
  if (!format || !name) return null;
  return `${name} ${format}`;
}

export function trustInventoryForPresentation(
  examKey: ExamSeoKey,
  inventory: BoardInventoryPresentation | null | undefined
): { line: string | null; definition: string | null; live: boolean } {
  if (!inventory) return { line: null, definition: null, live: false };
  const shortName = getExamSeoConfig(examKey).shortName;
  const live = inventory.countSource === "active-inventory" && Boolean(inventory.formatLine);
  return {
    line: live ? trustInventoryLine(shortName, inventory.formatLine) : null,
    definition: inventory.definition,
    live,
  };
}

/** Approved testimonials whose exam field matches this board. Never invents rows. */
export function testimonialsForBoard(
  stories: LandingSuccessStory[] | null | undefined,
  examKey: ExamSeoKey
): LandingSuccessStory[] {
  if (!stories?.length) return [];
  const catalog = EXAM_CATALOG[examKey];
  const needles = [examKey, catalog.shortName, catalog.name]
    .map((value) => value.toLowerCase())
    .filter((value) => value.length >= 3);
  return stories.filter((story) => {
    const exam = story.exam?.trim().toLowerCase() ?? "";
    const quote = story.quote?.trim() ?? "";
    const name = story.name?.trim() ?? "";
    if (!exam || !quote || !name) return false;
    return needles.some((needle) => exam.includes(needle) || needle.includes(exam));
  });
}

export {
  pricingHeadlineFromContext,
  pricingHeadlineFromField,
  pricingHeadlineFromPath,
  pricingPrepHeadline,
} from "@/lib/marketing/pricing-headline";

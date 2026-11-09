import {
  COUNT_BOARD_SLUGS,
  siteQuestionCounts,
  type BoardQuestionUnits,
  type CountBoardSlug,
  type SiteQuestionCounts,
} from "@/lib/counts";
import type { QuestionBankCountsSnapshot } from "@/lib/marketing/question-bank-counts";

export type HomeProofFact = {
  id: "questions" | "ngn";
  text: string;
};

/** Homepage proof line. No sitewide number and no clinician-review claim. */
export const HOME_QUESTION_PROOF = "Thousands of board-level questions.";

function completeBoards(
  snapshot: QuestionBankCountsSnapshot
): Record<CountBoardSlug, BoardQuestionUnits> | null {
  if (snapshot.degraded || !snapshot.boards) return null;
  const boards = {} as Record<CountBoardSlug, BoardQuestionUnits>;
  for (const slug of COUNT_BOARD_SLUGS) {
    const units = snapshot.boards[slug];
    if (!units) return null;
    boards[slug] = units;
  }
  return boards;
}

/** Live scored-item totals. Null when the bank lookup failed or is incomplete. */
export function siteCountsFromSnapshot(
  snapshot: QuestionBankCountsSnapshot | null | undefined
): SiteQuestionCounts | null {
  if (!snapshot) return null;
  const boards = completeBoards(snapshot);
  if (!boards) return null;
  const site = siteQuestionCounts(boards);
  if (site.totalQuestions <= 0) return null;
  return site;
}

/**
 * Proof strip under the homepage hero.
 * Every number comes from `siteQuestionCounts` in counts.ts.
 * The price is not included here — the homepage shows it once, in the pricing card.
 * The question line is qualitative. The NGN line is omitted when that fact is not in the snapshot.
 */
export function buildHomeProofFacts(site: SiteQuestionCounts | null): HomeProofFact[] {
  if (!site) return [];

  const facts: HomeProofFact[] = [
    {
      id: "questions",
      text: HOME_QUESTION_PROOF,
    },
  ];

  if (site.boards.nclex.caseStudies > 0) {
    facts.push({
      id: "ngn",
      text: "Next Generation NCLEX case studies included",
    });
  }

  return facts;
}

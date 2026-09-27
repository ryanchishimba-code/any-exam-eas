import {
  COUNT_BOARD_SLUGS,
  formatExactQuestionCount,
  siteQuestionCounts,
  type BoardQuestionUnits,
  type CountBoardSlug,
  type SiteQuestionCounts,
} from "@/lib/counts";
import { CLINICAL_REVIEWERS } from "@/lib/marketing/company";
import type { QuestionBankCountsSnapshot } from "@/lib/marketing/question-bank-counts";
import { nclexContentReviewLedBy } from "@/lib/marketing/legal-copy";
import { formatMonthlyPrice } from "@/lib/site";

export type HomeProofFact = {
  id: "questions" | "reviewer" | "ngn" | "price";
  text: string;
};

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
 * Omits the question total and the NGN line when that fact is not in the snapshot.
 */
export function buildHomeProofFacts(site: SiteQuestionCounts | null): HomeProofFact[] {
  const facts: HomeProofFact[] = [];
  const reviewer = CLINICAL_REVIEWERS.find((person) => person.id === "nursing");

  if (site) {
    facts.push({
      id: "questions",
      text: `${formatExactQuestionCount(site.totalQuestions)} practice questions`,
    });
  }

  if (reviewer) {
    facts.push({
      id: "reviewer",
      text: nclexContentReviewLedBy(reviewer.displayName),
    });
  }

  if (site && site.boards.nclex.caseStudies > 0) {
    facts.push({
      id: "ngn",
      text: "NGN case studies included",
    });
  }

  facts.push({
    id: "price",
    text: `${formatMonthlyPrice("pro")}/mo covers all six boards`,
  });

  return facts;
}

import type { CatSessionState } from "@/lib/questions/cat-engine";

type IndexedAnswer = {
  questionIndex: number;
};

/**
 * Items the student was actually given.
 * Snapshots are the served set (a CAT pool of 150 is not 150 administered items).
 * The answer log span cannot be smaller than the highest saved index.
 */
export function administeredQuestionCount(input: {
  snapshotCount?: number | null;
  answers?: IndexedAnswer[] | null;
  plannedCount?: number | null;
}): number {
  let maxIndex = -1;
  for (const answer of input.answers ?? []) {
    if (typeof answer.questionIndex !== "number" || !Number.isFinite(answer.questionIndex)) {
      continue;
    }
    maxIndex = Math.max(maxIndex, Math.floor(answer.questionIndex));
  }
  const fromLog = maxIndex + 1;
  const fromSnapshots = Math.max(0, Math.floor(input.snapshotCount ?? 0) || 0);
  const delivered = Math.max(fromLog, fromSnapshots);
  if (delivered > 0) return delivered;
  return Math.max(0, Math.floor(input.plannedCount ?? 0) || 0);
}

type ScoredAnswer = {
  questionIndex: number;
  selected?: string | null;
};

/**
 * Fixed forms keep the delivered length so blanks stay in the score.
 * A practice CAT that has already drawn the next item must not count that
 * blank in "9 / 33" when 32 selections were saved.
 */
export function practiceResultsTotals(input: {
  delivered: number;
  answers?: ScoredAnswer[] | null;
  cat?: boolean;
}): { denominator: number; delivered: number; answered: number; unanswered: number } {
  const delivered = Math.max(0, Math.floor(input.delivered) || 0);
  const answeredIndexes = new Set<number>();
  for (const answer of input.answers ?? []) {
    if (typeof answer.questionIndex !== "number" || !Number.isFinite(answer.questionIndex)) {
      continue;
    }
    if (typeof answer.selected === "string" && answer.selected.trim()) {
      answeredIndexes.add(Math.floor(answer.questionIndex));
    }
  }
  const answered = answeredIndexes.size;
  void input.cat;
  return {
    delivered,
    answered,
    unanswered: Math.max(0, delivered - answered),
    /** Headline score and pass bands: correct ÷ attempted (not the full form length). */
    denominator: answered,
  };
}

/** Secondary results line under the headline percent. */
export function practiceResultsProgressLine(
  correct: number,
  totals: Pick<ReturnType<typeof practiceResultsTotals>, "delivered" | "answered">
): string {
  const hits = Math.max(0, Math.floor(correct) || 0);
  const answered = Math.max(0, totals.answered);
  const delivered = Math.max(answered, totals.delivered);
  return `Answered ${answered} of ${delivered} · ${hits} correct`;
}

/** Percent correct over attempted items (non-blank selections). */
export function practiceScorePercent(correct: number, administered: number): number {
  const total = Math.max(0, Math.floor(administered) || 0);
  if (total <= 0) return 0;
  const hits = Math.max(0, Math.floor(correct) || 0);
  return Math.round((hits / total) * 100);
}

export function isNaturalCatStop(
  reason: CatSessionState["stopReason"] | string | null | undefined
): boolean {
  return reason === "confidence" || reason === "maximum" || reason === "minimum";
}

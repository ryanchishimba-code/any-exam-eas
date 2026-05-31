/** Spaced repetition grades (SM-2 inspired, capped within quarterly cycle). */

export type ReviewGrade = 0 | 1 | 2 | 3;

export const GRADE_LABELS: Record<ReviewGrade, string> = {
  0: "Again",
  1: "Hard",
  2: "Good",
  3: "Easy",
};

export type SpacedRepetitionState = {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  lapseCount: number;
  mastered: boolean;
  nextReviewAt: Date;
};

export type SpacedRepetitionInput = SpacedRepetitionState & {
  grade: ReviewGrade;
  reviewedAt?: Date;
};

const MIN_EASE = 1.3;
const MASTERED_INTERVAL_DAYS = 21;

export function initialSpacedRepetitionState(now: Date = new Date()): SpacedRepetitionState {
  return {
    repetitions: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    lapseCount: 0,
    mastered: false,
    nextReviewAt: now,
  };
}

export function applySpacedRepetition(input: SpacedRepetitionInput): SpacedRepetitionState {
  const now = input.reviewedAt ?? new Date();
  let { repetitions, easeFactor, intervalDays, lapseCount, mastered } = input;
  const grade = input.grade;

  if (grade === 0) {
    repetitions = 0;
    intervalDays = 0;
    lapseCount += 1;
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.2);
    mastered = false;
    return {
      repetitions,
      easeFactor,
      intervalDays,
      lapseCount,
      mastered,
      nextReviewAt: new Date(now.getTime() + 10 * 60 * 1000),
    };
  }

  repetitions += 1;

  if (grade === 1) {
    easeFactor = Math.max(MIN_EASE, easeFactor - 0.15);
    intervalDays = repetitions === 1 ? 1 : Math.max(1, intervalDays * 1.2);
  } else if (grade === 2) {
    intervalDays =
      repetitions === 1 ? 1 : repetitions === 2 ? 3 : Math.max(1, Math.round(intervalDays * easeFactor));
  } else {
    easeFactor += 0.1;
    intervalDays =
      repetitions === 1 ? 2 : repetitions === 2 ? 5 : Math.max(2, Math.round(intervalDays * easeFactor * 1.3));
  }

  mastered = intervalDays >= MASTERED_INTERVAL_DAYS && repetitions >= 3 && grade >= 2;

  const nextReviewAt = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    repetitions,
    easeFactor,
    intervalDays,
    lapseCount,
    mastered,
    nextReviewAt,
  };
}

export function isDue(nextReviewAt: Date, now: Date = new Date()): boolean {
  return nextReviewAt.getTime() <= now.getTime();
}

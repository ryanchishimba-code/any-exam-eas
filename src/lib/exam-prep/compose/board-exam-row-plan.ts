/**
 * Map a composed set onto existing preset-exam rows.
 * Published forms use exam numbers 1..N so they stay inside the launcher cap.
 * Rows that are not part of the new set are paused (active = false). Their
 * question links stay in place until an owner restores the archive.
 */

export const BOARD_COMPOSER_PIPELINE = "board-exam-composer-v1";

export type ExistingExamRow = {
  examNumber: number;
  active: boolean;
};

export type ExamRowWritePlan = {
  /** Existing rows whose membership will be replaced. Includes inactive rows we reactivate. */
  replace: number[];
  /** Exam numbers that do not exist yet. */
  create: number[];
  /** Active rows left out of the published set. Links are kept. */
  pause: number[];
};

export function planBoardExamRows(input: {
  existing: readonly ExistingExamRow[];
  composedCount: number;
  maxExamNumber?: number;
  /** Keep these exam numbers, in order, instead of compacting to 1..N. */
  publishNumbers?: readonly number[];
  /**
   * Exam numbers owned by another scope (other USMLE steps). New rows skip
   * them. They are not paused.
   */
  reservedNumbers?: readonly number[];
}): ExamRowWritePlan {
  const maxExamNumber = input.maxExamNumber ?? 100;
  if (input.composedCount < 0) {
    throw new Error("composedCount must be zero or greater.");
  }
  if (input.composedCount === 0) {
    return { replace: [], create: [], pause: [] };
  }
  if (input.composedCount > maxExamNumber) {
    throw new Error(
      `Cannot publish ${input.composedCount} exams. The launcher only opens exam numbers 1–${maxExamNumber}.`
    );
  }
  const existingNumbers = new Set(input.existing.map((row) => row.examNumber));
  const published: number[] = [];
  if (input.publishNumbers) {
    for (const examNumber of input.publishNumbers) {
      if (published.length >= input.composedCount) break;
      if (examNumber < 1 || examNumber > maxExamNumber) {
        throw new Error(`Exam number ${examNumber} is outside 1–${maxExamNumber}.`);
      }
      published.push(examNumber);
    }
    const reserved = new Set(input.reservedNumbers ?? []);
    let next =
      Math.max(
        0,
        ...input.existing.map((row) => row.examNumber),
        ...published,
        ...(input.reservedNumbers ?? [])
      ) + 1;
    while (published.length < input.composedCount) {
      if (next > maxExamNumber) {
        throw new Error(
          `Cannot publish ${input.composedCount} exams. The launcher only opens exam numbers 1–${maxExamNumber}.`
        );
      }
      if (!published.includes(next) && !reserved.has(next)) published.push(next);
      next += 1;
    }
  } else {
    for (let examNumber = 1; examNumber <= input.composedCount; examNumber++) {
      published.push(examNumber);
    }
  }
  const publishedSet = new Set(published);
  return {
    replace: published.filter((examNumber) => existingNumbers.has(examNumber)),
    create: published.filter((examNumber) => !existingNumbers.has(examNumber)),
    pause: input.existing
      .filter((row) => row.active && !publishedSet.has(row.examNumber))
      .map((row) => row.examNumber)
      .sort((a, b) => a - b),
  };
}

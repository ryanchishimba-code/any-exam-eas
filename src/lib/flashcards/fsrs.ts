/** Lightweight FSRS-inspired scheduler for flashcard intervals. */

export type ReviewGrade = 1 | 2 | 3 | 4 | 5;

export type CardSchedule = {
  interval: number;
  easeFactor: number;
  repetitions: number;
  dueDate: Date;
};

export function scheduleReview(
  prev: CardSchedule,
  grade: ReviewGrade,
  now = new Date()
): CardSchedule {
  let { interval, easeFactor, repetitions } = prev;

  if (grade < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) interval = 1;
    else if (repetitions === 2) interval = 3;
    else interval = Math.round(interval * easeFactor);
  }

  const delta = grade - 3;
  easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02) + delta * 0.02);

  const dueDate = new Date(now);
  dueDate.setUTCDate(dueDate.getUTCDate() + Math.max(1, interval));

  return { interval, easeFactor, repetitions, dueDate };
}

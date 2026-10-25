import {
  ANSWER_BURST_PER_MINUTE,
  FAST_ANSWER_MS,
} from "./config";

export type AttemptTimingRow = {
  createdAt: Date;
  durationMs: number | null;
};

export type IntegrityFlags = {
  totalAnswers: number;
  fastAnswersUnder5s: number;
  fastAnswerPercent: number;
  answerBurstsOver30PerMinute: number;
  heartbeatsIgnoredTooFast: number;
  examsEndedEarly: number;
};

export function computeFastAnswerStats(attempts: AttemptTimingRow[]): {
  totalAnswers: number;
  fastAnswersUnder5s: number;
  fastAnswerPercent: number;
} {
  const totalAnswers = attempts.length;
  const fastAnswersUnder5s = attempts.filter(
    (row) => row.durationMs == null || row.durationMs < FAST_ANSWER_MS
  ).length;
  const fastAnswerPercent =
    totalAnswers > 0 ? Math.round((fastAnswersUnder5s / totalAnswers) * 100) : 0;
  return { totalAnswers, fastAnswersUnder5s, fastAnswerPercent };
}

export function countAnswerBurstsOverLimit(
  attempts: { createdAt: Date }[],
  limitPerMinute: number = ANSWER_BURST_PER_MINUTE
): number {
  if (attempts.length === 0) return 0;
  const buckets = new Map<number, number>();
  for (const row of attempts) {
    const minute = Math.floor(row.createdAt.getTime() / 60_000);
    buckets.set(minute, (buckets.get(minute) ?? 0) + 1);
  }
  let bursts = 0;
  for (const count of buckets.values()) {
    if (count > limitPerMinute) bursts += 1;
  }
  return bursts;
}

export function buildIntegrityFlags(input: {
  attempts: AttemptTimingRow[];
  heartbeatsIgnoredTooFast: number;
  examsEndedEarly: number;
}): IntegrityFlags {
  const fast = computeFastAnswerStats(input.attempts);
  return {
    ...fast,
    answerBurstsOver30PerMinute: countAnswerBurstsOverLimit(input.attempts),
    heartbeatsIgnoredTooFast: input.heartbeatsIgnoredTooFast,
    examsEndedEarly: input.examsEndedEarly,
  };
}

import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

/** NCLEX exam mode locks an answered item once the student has moved past it. */
export function nclexExamMode(analysis: unknown): boolean {
  if (!analysis || typeof analysis !== "object") return false;
  const config = (analysis as { sessionConfig?: { nclexExamMode?: unknown } }).sessionConfig;
  return config?.nclexExamMode === true;
}

export function readLockedThrough(analysis: unknown): number {
  if (!analysis || typeof analysis !== "object") return 0;
  const raw = (analysis as { examLock?: { lockedThrough?: unknown } }).examLock?.lockedThrough;
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw <= 0) return 0;
  return Math.floor(raw);
}

/**
 * The lock only moves forward.
 * Saving item i locks every earlier index. An explicit Next sends i + 1 and locks i.
 */
export function raisedLockedThrough(
  current: number,
  reachedIndex: number | null,
  requested: number | null
): number {
  let next = current;
  if (reachedIndex != null && Number.isFinite(reachedIndex) && reachedIndex > next) {
    next = Math.floor(reachedIndex);
  }
  if (requested != null && Number.isFinite(requested) && requested > next) {
    next = Math.floor(requested);
  }
  return next;
}

export function answerSelectionLocked(input: {
  examMode: boolean;
  lockedThrough: number;
  existingSelected?: string;
  incomingIndex: number;
  incomingSelected: string;
}): boolean {
  if (!input.examMode) return false;
  if (!Number.isFinite(input.incomingIndex) || input.incomingIndex >= input.lockedThrough) {
    return false;
  }
  const previous = input.existingSelected?.trim() ?? "";
  if (!previous) return false;
  return previous !== input.incomingSelected.trim();
}

export function analysisWithLock(analysis: unknown, lockedThrough: number): Record<string, unknown> {
  const base =
    analysis && typeof analysis === "object" && !Array.isArray(analysis)
      ? { ...(analysis as Record<string, unknown>) }
      : {};
  return { ...base, examLock: { lockedThrough } };
}

export function existingAnswerAt(
  answers: unknown,
  questionIndex: number
): ExamAnswerRecord | undefined {
  if (!Array.isArray(answers)) return undefined;
  return (answers as ExamAnswerRecord[]).find((row) => row?.questionIndex === questionIndex);
}

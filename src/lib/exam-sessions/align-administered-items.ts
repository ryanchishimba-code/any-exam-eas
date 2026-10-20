import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

/** Canonical bank/catalog id for the item at this index in the sitting. */
export function administeredQuestionIdAtIndex(
  questionIndex: number | null | undefined,
  questionId: string | null | undefined,
  prefetchedQuestionIds?: readonly string[] | null
): string | null {
  if (questionIndex != null && Number.isFinite(questionIndex)) {
    const fromPrefetch = prefetchedQuestionIds?.[questionIndex]?.trim();
    if (fromPrefetch) return fromPrefetch;
  }
  const direct = questionId?.trim();
  return direct || null;
}

export function alignAnswersToPrefetched(
  answers: ExamAnswerRecord[],
  prefetchedQuestionIds?: readonly string[] | null
): ExamAnswerRecord[] {
  if (!prefetchedQuestionIds?.length) return answers;
  return answers.map((answer) => {
    const canonical = administeredQuestionIdAtIndex(
      answer.questionIndex,
      answer.questionId,
      prefetchedQuestionIds
    );
    return canonical && canonical !== answer.questionId
      ? { ...answer, questionId: canonical }
      : answer;
  });
}

export function alignSnapshotIdsToPrefetched(
  snapshots: unknown[],
  prefetchedQuestionIds?: readonly string[] | null
): unknown[] {
  if (!prefetchedQuestionIds?.length || !snapshots.length) return snapshots;
  return snapshots.map((row, index) => {
    const canonical = prefetchedQuestionIds[index]?.trim();
    if (!canonical || !row || typeof row !== "object") return row;
    const snap = row as Record<string, unknown>;
    if (snap.id === canonical) return row;
    return { ...snap, id: canonical };
  });
}

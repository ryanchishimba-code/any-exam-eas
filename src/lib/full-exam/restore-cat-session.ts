import { initCatSession, updateCatSession, type CatDifficulty, type CatSessionState } from "@/lib/questions/cat-engine";
import { isAnswerCorrect } from "@/lib/questions/prepare";
import type { StudyQuestion } from "@/lib/questions/types";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { deserializeExamSelection } from "@/lib/full-exam/answer-serialize";

export type CatRestoreResult = {
  questions: StudyQuestion[];
  catState: CatSessionState;
  committed: number;
  index: number;
  serverCorrect: Record<number, boolean>;
};

function hasStoredSelection(selected: string | undefined): boolean {
  return Boolean(selected?.trim());
}

/**
 * Rebuild served CAT items and engine state after reload from persisted answers.
 */
export function restoreCatSessionFromAnswers(params: {
  pool: StudyQuestion[];
  records: ExamAnswerRecord[];
  bandForQuestion: (q: StudyQuestion) => CatDifficulty;
}): CatRestoreResult | null {
  const { pool, records, bandForQuestion } = params;
  const sorted = [...records]
    .filter((r) => r.questionId && hasStoredSelection(r.selected))
    .sort((a, b) => a.questionIndex - b.questionIndex);
  if (sorted.length === 0) return null;

  const poolById = new Map(pool.map((q) => [q.bankItemId ?? q.id, q]));
  const served: StudyQuestion[] = [];
  for (const row of sorted) {
    const q = poolById.get(row.questionId!.trim());
    if (!q) break;
    served.push(q);
  }
  if (served.length === 0) return null;

  let state = initCatSession();
  let committed = 0;
  const serverCorrect: Record<number, boolean> = {};

  for (let i = 0; i < served.length; i++) {
    const row = sorted[i];
    const q = served[i];
    const selected = deserializeExamSelection(row.selected);
    const correct =
      row.correct === true
        ? true
        : row.correct === false
          ? false
          : isAnswerCorrect(q, selected);
    serverCorrect[i] = correct;
    state = updateCatSession(state, correct, bandForQuestion(q));
    committed = i + 1;
  }

  return {
    questions: served,
    catState: state,
    committed,
    index: Math.max(0, served.length - 1),
    serverCorrect,
  };
}

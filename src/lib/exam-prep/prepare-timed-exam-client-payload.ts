/**
 * Map pre-assembled bank rows to the client payload used by full-exam sessions.
 */
import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import {
  assessExamSessionQuality,
  mapApiQuestionsToStudy,
} from "@/lib/questions/finalize-exam-session";
import { studyQuestionsToExamQuestions } from "@/lib/questions/prepare";
import type { RawQuestionInput, StudyQuestion } from "@/lib/questions/types";

const MIXED_SUBJECT_ID = "__mixed__";

export type TimedExamClientPayload = {
  questions: ExamQuestion[];
  bankItemIds: string[];
  prepared: StudyQuestion[];
};

export function preparedTimedExamItemsForClient(
  fieldId: string,
  field: string,
  items: BankItem[],
  limit: number
): TimedExamClientPayload {
  const selected = items.slice(0, limit);
  const rawForMap = selected.map((item, i) =>
    bankItemToSessionRaw(fieldId, field, item.subjectId ?? MIXED_SUBJECT_ID, item, i)
  );
  const rawInputs: RawQuestionInput[] = rawForMap.map((q, i) => ({
    ...q,
    field,
    subjectId: selected[i]?.subjectId ?? MIXED_SUBJECT_ID,
    bankItemId: selected[i]?.id ?? undefined,
    difficultyLabel:
      q.difficultyLabel ??
      (selected[i]?.difficulty != null
        ? selected[i]!.difficulty! <= 2
          ? "Easy"
          : selected[i]!.difficulty! >= 4
            ? "Hard"
            : "Medium"
        : undefined),
  }));

  const prepared = mapApiQuestionsToStudy(rawInputs, { shuffleOptions: false });
  const quality = assessExamSessionQuality(prepared, limit);
  if (quality.returned !== limit) {
    throw new Error(
      `Not enough ${fieldId} questions available (${quality.returned}/${limit}). Try a shorter exam length.`
    );
  }

  return {
    prepared,
    bankItemIds: prepared.map((p) => p.bankItemId).filter(Boolean) as string[],
    questions: studyQuestionsToExamQuestions(prepared),
  };
}

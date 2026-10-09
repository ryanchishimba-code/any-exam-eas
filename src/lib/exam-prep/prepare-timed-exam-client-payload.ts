/**
 * Map pre-assembled bank rows to the client payload used by full-exam sessions.
 */
import type { ExamQuestion } from "@/lib/ai";
import type { BankItem } from "@/lib/question-bank";
import { ngnQuestionKey, parseNgnQuestionKey } from "@/lib/assessment/question-key";
import { openStudentRef, sealStudentRef } from "@/lib/assessment/student-item-ref";
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

/** Catalog slot ids stay on the server. The browser gets a per-delivery seal. */
export function sealCatalogQuestionKey(key: string): string {
  const parsed = parseNgnQuestionKey(key);
  if (!parsed || openStudentRef(parsed.id)) return key;
  return ngnQuestionKey(sealStudentRef(parsed), parsed.version);
}

/**
 * Hide catalog slot ids and case ids before the exam payload is built.
 * caseTitle stays until the study serializer strips it from the vignette.
 */
export function hideCatalogIdsForStudent(items: readonly BankItem[]): BankItem[] {
  const caseSeals = new Map<string, string>();
  return items.map((item) => {
    const payload = { ...(item.ngnPayload ?? {}) };
    const setId = typeof payload.setId === "string" ? payload.setId.trim() : "";
    if (setId && !openStudentRef(setId)) {
      let sealed = caseSeals.get(setId);
      if (!sealed) {
        sealed = sealStudentRef({ id: setId, version: 1 });
        caseSeals.set(setId, sealed);
      }
      payload.setId = sealed;
    }
    const id = item.id ? sealCatalogQuestionKey(item.id) : item.id;
    return { ...item, id, ngnPayload: payload };
  });
}

export function preparedTimedExamItemsForClient(
  fieldId: string,
  field: string,
  items: BankItem[],
  limit: number,
  opts?: { shuffleSeed?: number }
): TimedExamClientPayload {
  const selected = hideCatalogIdsForStudent(items.slice(0, limit));
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

  const prepared = mapApiQuestionsToStudy(rawInputs, {
    shuffleOptions: true,
    shuffleSeed: opts?.shuffleSeed,
  });
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

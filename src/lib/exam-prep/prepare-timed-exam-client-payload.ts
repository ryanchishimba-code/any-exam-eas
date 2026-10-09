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
  /** Opaque ids for the browser. Catalog slot ids are sealed. */
  bankItemIds: string[];
  /** Ids stored on the exam session so a refresh can reload the same rows. */
  canonicalBankItemIds: string[];
  prepared: StudyQuestion[];
};

/** Catalog slot ids stay on the server. The browser gets a per-delivery seal. */
export function sealCatalogQuestionKey(key: string): string {
  const parsed = parseNgnQuestionKey(key);
  if (!parsed || openStudentRef(parsed.id)) return key;
  return ngnQuestionKey(sealStudentRef(parsed), parsed.version);
}

type LayoutCarrier = {
  ngnPayload?: Record<string, unknown> | null;
  chartData?: Record<string, unknown> | null;
};

function sealSetId(
  payload: Record<string, unknown> | null | undefined,
  seals: Map<string, string>
): Record<string, unknown> | undefined {
  if (!payload) return undefined;
  const setId = typeof payload.setId === "string" ? payload.setId.trim() : "";
  if (!setId || openStudentRef(setId)) return payload;
  let sealed = seals.get(setId);
  if (!sealed) {
    sealed = sealStudentRef({ id: setId, version: 1 });
    seals.set(setId, sealed);
  }
  return { ...payload, setId: sealed };
}

/** Seal catalog item ids and case ids after option order is already fixed. */
export function sealStudentFacingIds<T extends LayoutCarrier>(
  questions: T[],
  bankItemIds: Array<string | null | undefined>
): { questions: T[]; bankItemIds: string[] } {
  const seals = new Map<string, string>();
  return {
    questions: questions.map((question) => ({
      ...question,
      ngnPayload: sealSetId(question.ngnPayload, seals),
      chartData: sealSetId(question.chartData, seals),
    })),
    bankItemIds: bankItemIds.filter((id): id is string => Boolean(id)).map(sealCatalogQuestionKey),
  };
}

export function preparedTimedExamItemsForClient(
  fieldId: string,
  field: string,
  items: BankItem[],
  limit: number,
  opts?: { shuffleSeed?: number }
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

  const canonicalBankItemIds = prepared.map((item) => item.bankItemId).filter(Boolean) as string[];
  const sealed = sealStudentFacingIds(studyQuestionsToExamQuestions(prepared), canonicalBankItemIds);

  return {
    prepared,
    canonicalBankItemIds,
    bankItemIds: sealed.bankItemIds,
    questions: sealed.questions,
  };
}

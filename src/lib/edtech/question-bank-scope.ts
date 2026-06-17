import { NextResponse } from "next/server";
import { getFieldMeta } from "@/lib/fields";
import { EXAM_CATALOG, examSlugFromFieldId } from "@/lib/edtech/exams";
import { getUserExamPreference, setUserExamPreference } from "@/lib/edtech/exam-preference";
import {
  isExamFieldId,
  isPracticeFieldId,
  normalizeFieldId,
} from "@/lib/subjects/field-ids";
import { isUsmleFieldId, resolveUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import type { ExamSlug } from "@/types/edtech";

export function fieldIdForExamSlug(examSlug: ExamSlug): string {
  return EXAM_CATALOG[examSlug].fieldId;
}

export function examSlugForFieldId(fieldId: string): ExamSlug | null {
  return examSlugFromFieldId(fieldId);
}

/** Resolve API `field` query values (labels, aliases, ids) to a canonical exam field id. */
export function resolveQuestionBankFieldId(field: string): string {
  const meta = getFieldMeta(field);
  return normalizeFieldId(meta?.id ?? field);
}

/** True when a study field id belongs to the user's selected exam. */
export function fieldMatchesExamSlug(fieldId: string, examSlug: ExamSlug): boolean {
  const normalized = normalizeFieldId(fieldId);
  if (examSlug === "usmle") return isUsmleFieldId(normalized);
  return fieldIdForExamSlug(examSlug) === normalized;
}

/** Align dashboard exam preference with an explicit field the user is practicing. */
export async function syncExamPreferenceForField(
  userId: string,
  field: string
): Promise<ExamSlug | null> {
  const normalizedFieldId = resolveQuestionBankFieldId(field);
  const examSlug = examSlugForFieldId(normalizedFieldId);
  if (!examSlug || !isPracticeFieldId(normalizedFieldId)) return null;
  await setUserExamPreference(userId, examSlug);
  return examSlug;
}

export type QuestionBankFieldAccess =
  | { ok: true; examSlug: ExamSlug; fieldId: string }
  | { ok: false; response: NextResponse };

/** Allow question requests for board exams; auto-switch preference to match the requested field. */
export async function enforceQuestionBankFieldAccess(
  userId: string,
  field: string
): Promise<QuestionBankFieldAccess> {
  const pref = await getUserExamPreference(userId);
  if (!pref) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Select an exam before practicing.", code: "NO_EXAM_PREFERENCE" },
        { status: 403 }
      ),
    };
  }

  const fieldId = resolveQuestionBankFieldId(field);
  const targetSlug = examSlugForFieldId(fieldId);

  if (!targetSlug || !isPracticeFieldId(fieldId)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "That exam is not available for practice.",
          code: "UNKNOWN_EXAM_FIELD",
          fieldId,
        },
        { status: 400 }
      ),
    };
  }

  if (!fieldMatchesExamSlug(fieldId, pref.examSlug)) {
    await setUserExamPreference(userId, targetSlug);
  }

  return { ok: true, examSlug: targetSlug, fieldId };
}

/** Resolve roadmap / analytics field for a USMLE slug + optional step query. */
export function resolveUsmleRoadmapFieldId(stepParam?: string | null): string {
  if (stepParam) {
    const resolved = resolveUsmleFieldId(stepParam);
    if (resolved) return resolved;
  }
  return fieldIdForExamSlug("usmle");
}

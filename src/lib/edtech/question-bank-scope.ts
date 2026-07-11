import { NextResponse } from "next/server";
import { getFieldMeta } from "@/lib/fields";
import {
  examSlugForFieldId,
  fieldIdForExamSlug,
} from "@/lib/edtech/exam-field-ids";
import { getUserExamPreference, setUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import {
  defaultUsmleFieldId,
  isUsmleFieldId,
  resolveUsmleFieldId,
  type UsmleFieldId,
} from "@/lib/exam-prep/usmle/steps";
import {
  isExamFieldId,
  isPracticeFieldId,
  normalizeFieldId,
} from "@/lib/subjects/field-ids";
import type { ExamSlug } from "@/types/edtech";

export {
  examSlugForFieldId,
  fieldIdForExamSlug,
  fieldMatchesExamSlug,
} from "@/lib/edtech/exam-field-ids";

/** Resolve API `field` query values (labels, aliases, ids) to a canonical exam field id. */
export function resolveQuestionBankFieldId(field: string): string {
  const meta = getFieldMeta(field);
  return normalizeFieldId(meta?.id ?? field);
}

/** Canonical bank field for the user's current exam selection (USMLE step-aware). */
export function canonicalPracticeFieldId(
  examSlug: ExamSlug,
  usmleFieldId?: string | null
): string {
  if (examSlug === "usmle") {
    return usmleFieldId && isUsmleFieldId(usmleFieldId) ? usmleFieldId : defaultUsmleFieldId();
  }
  return fieldIdForExamSlug(examSlug);
}

export async function resolveUserUsmleFieldId(userId: string): Promise<UsmleFieldId> {
  const meta = await getUserEdtechMetadata(userId);
  if (meta.usmleFieldId && isUsmleFieldId(meta.usmleFieldId)) {
    return meta.usmleFieldId;
  }
  return defaultUsmleFieldId();
}

export async function resolveCanonicalPracticeFieldId(
  userId: string,
  examSlug: ExamSlug
): Promise<string> {
  if (examSlug === "usmle") {
    return resolveUserUsmleFieldId(userId);
  }
  return fieldIdForExamSlug(examSlug);
}

export type ExamSlugAccess =
  | { ok: true; examSlug: ExamSlug }
  | { ok: false; response: NextResponse };

/** Reject API calls whose path/body exam slug differs from the saved preference. */
export async function enforceUserExamSlugAccess(
  userId: string,
  examSlug: ExamSlug
): Promise<ExamSlugAccess> {
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
  if (pref.examSlug !== examSlug) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "That exam does not match your selected exam.",
          code: "EXAM_MISMATCH",
          expectedExamSlug: pref.examSlug,
        },
        { status: 403 }
      ),
    };
  }
  return { ok: true, examSlug: pref.examSlug };
}

/** @deprecated Do not switch exam preference from URL field params — redirect to the user's selected exam instead. */
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

/** Allow question requests for board exams; reject fields outside the user's selected exam. */
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
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "That field does not match your selected exam.",
          code: "EXAM_FIELD_MISMATCH",
          expectedExamSlug: pref.examSlug,
        },
        { status: 403 }
      ),
    };
  }

  const canonicalFieldId = await resolveCanonicalPracticeFieldId(userId, pref.examSlug);
  if (fieldId !== canonicalFieldId) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            pref.examSlug === "usmle"
              ? "That USMLE step does not match your selected step."
              : "That field does not match your selected exam.",
          code: pref.examSlug === "usmle" ? "USMLE_STEP_MISMATCH" : "EXAM_FIELD_MISMATCH",
          expectedExamSlug: pref.examSlug,
          expectedFieldId: canonicalFieldId,
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, examSlug: pref.examSlug, fieldId: canonicalFieldId };
}

/** Resolve roadmap / analytics field for a USMLE slug + optional step query. */
export function resolveUsmleRoadmapFieldId(stepParam?: string | null): string {
  if (stepParam) {
    const resolved = resolveUsmleFieldId(stepParam);
    if (resolved) return resolved;
  }
  return fieldIdForExamSlug("usmle");
}

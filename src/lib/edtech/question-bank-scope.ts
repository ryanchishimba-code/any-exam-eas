import { NextResponse } from "next/server";
import { EXAM_CATALOG, examSlugFromFieldId } from "@/lib/edtech/exams";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import type { ExamSlug } from "@/types/edtech";

export function fieldIdForExamSlug(examSlug: ExamSlug): string {
  return EXAM_CATALOG[examSlug].fieldId;
}

export function examSlugForFieldId(fieldId: string): ExamSlug | null {
  return examSlugFromFieldId(fieldId);
}

/** True when a study field id belongs to the user's selected exam. */
export function fieldMatchesExamSlug(fieldId: string, examSlug: ExamSlug): boolean {
  return fieldIdForExamSlug(examSlug) === fieldId;
}

export type QuestionBankFieldAccess =
  | { ok: true; examSlug: ExamSlug }
  | { ok: false; response: NextResponse };

/** Reject API calls that request questions from an exam other than the user's preference. */
export async function enforceQuestionBankFieldAccess(
  userId: string,
  fieldId: string
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

  if (!fieldMatchesExamSlug(fieldId, pref.examSlug)) {
    const exam = EXAM_CATALOG[pref.examSlug];
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: `Questions are scoped to ${exam.shortName}. Switch exams from your dashboard to practice another board.`,
          code: "EXAM_FIELD_MISMATCH",
          examSlug: pref.examSlug,
          expectedFieldId: fieldIdForExamSlug(pref.examSlug),
        },
        { status: 403 }
      ),
    };
  }

  return { ok: true, examSlug: pref.examSlug };
}

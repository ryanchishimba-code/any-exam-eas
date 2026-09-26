import { NextResponse } from "next/server";
import { requirePremiumApi } from "@/lib/api-access";
import { respondDbUnavailable } from "@/lib/api-db-error";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
import {
  getTimedExamQuestionCount,
  parseNclexTimedVariant,
} from "@/lib/exam/exam-lengths";
import { listPresetFormSessions } from "@/lib/exam-sessions/service";
import {
  nextUnstartedExamNumber,
  practiceExamBoardLabel,
  practiceExamLengthNote,
  presetFormId,
  studentPracticeExamTitle,
  summarizePresetFormUses,
  type PresetFormProgressStatus,
} from "@/lib/exam-prep/preset-form-progress";
import { listActivePresetForms } from "@/lib/exam-prep/stored-preset-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Active composed practice forms for the signed-in student, with status.
 * An empty list means the timed screen hides the section.
 */
export async function GET(req: Request) {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const url = new URL(req.url);
  const requested = url.searchParams.get("field");
  const fieldId = requested ? resolveQuestionBankFieldId(requested) : null;
  if (!fieldId) {
    return NextResponse.json({ error: "Unknown exam." }, { status: 400 });
  }
  const examSlug = examSlugFromFieldId(fieldId);
  if (!examSlug) {
    return NextResponse.json({ forms: [] });
  }

  const nclexLength = parseNclexTimedVariant(url.searchParams.get("nclexLength"));
  const fullSimulationCount = getTimedExamQuestionCount(fieldId, { nclexLength });
  const boardLabel = practiceExamBoardLabel(examSlug, fieldId);

  try {
    const [forms, sessions] = await Promise.all([
      listActivePresetForms(examSlug, fieldId),
      listPresetFormSessions(premium.userId, examSlug),
    ]);
    const uses = summarizePresetFormUses(sessions);
    const listed = forms.map((form, index) => {
      const use = uses.get(presetFormId(examSlug, form.examNumber));
      const status: PresetFormProgressStatus = use?.status ?? "not_started";
      return {
        examNumber: form.examNumber,
        title: studentPracticeExamTitle(boardLabel, index + 1),
        questionCount: form.questionCount,
        lengthNote: practiceExamLengthNote(form.questionCount, fullSimulationCount),
        status,
        score: status === "completed" ? use?.score ?? null : null,
        sessionId: status === "in_progress" ? use?.sessionId ?? null : null,
      };
    });
    const nextExamNumber = nextUnstartedExamNumber(listed);
    return NextResponse.json({
      fullSimulationCount,
      forms: listed.map((form) => ({
        ...form,
        highlighted: nextExamNumber != null && form.examNumber === nextExamNumber,
      })),
    });
  } catch (error) {
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    throw error;
  }
}

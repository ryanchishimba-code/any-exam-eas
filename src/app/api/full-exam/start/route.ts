import { NextResponse } from "next/server";
import { createExamSession } from "@/lib/exam-sessions/service";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference, touchExamStudied } from "@/lib/edtech/exam-preference";
import { buildSessionConfig, fullExamSessionHref } from "@/lib/full-exam/config";
import { loadPresetExamItems } from "@/lib/exam-prep/load-preset-exam";
import { clampPresetExamNumber } from "@/lib/exam-prep/preset-exam-config";
import { resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
import { isUsmleFieldId, usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";
import { requirePremiumApi } from "@/lib/api-access";
import type { FullExamLengthPreset } from "@/types/full-exam";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const body = await req.json().catch(() => ({}));
  const examSlug = String(body.examSlug ?? "");
  if (!isExamSlug(examSlug)) {
    return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
  }

  const preset = (["50", "100", "full"].includes(body.lengthPreset)
    ? body.lengthPreset
    : "full") as FullExamLengthPreset;
  const timed = body.timed !== false;
  const nclexLength =
    body.nclexLength === "maximum" ? ("maximum" as const) : ("minimum" as const);
  const presetExamNumber = Number.isFinite(Number(body.presetExamNumber))
    ? clampPresetExamNumber(Number(body.presetExamNumber))
    : undefined;
  const focusAreas = Array.isArray(body.focusAreas)
    ? body.focusAreas.map(String).filter(Boolean)
    : Array.isArray(body.focus_areas)
      ? body.focus_areas.map(String).filter(Boolean)
      : undefined;

  try {
    const pref = await getUserExamPreference(premium.userId);
    if (!pref) {
      return NextResponse.json({ error: "Select an exam before starting." }, { status: 403 });
    }
    if (pref.examSlug !== examSlug) {
      return NextResponse.json(
        { error: "That exam does not match your selected exam.", code: "EXAM_MISMATCH" },
        { status: 403 }
      );
    }
    await touchExamStudied(premium.userId);

    let presetQuestionCount: number | undefined;
    let sessionFieldId = EXAM_CATALOG[examSlug].fieldId;
    let sessionTitle = `${EXAM_CATALOG[examSlug].shortName} Full Simulation`;

    const requestedField = body.fieldId ? resolveQuestionBankFieldId(String(body.fieldId)) : null;
    if (examSlug === "usmle" && requestedField && isUsmleFieldId(requestedField)) {
      sessionFieldId = requestedField;
      const step = usmleStepDefinition(requestedField);
      presetQuestionCount = step?.simulatedQuestionCount;
      sessionTitle = `${step?.name ?? "USMLE"} Full Simulation`;
    }

    if (presetExamNumber) {
      const loaded = await loadPresetExamItems(examSlug, presetExamNumber);
      if (!loaded) {
        return NextResponse.json(
          {
            error: `${EXAM_CATALOG[examSlug].shortName} Practice Exam ${presetExamNumber} is not available. Run db:seed-validated-full-exams first.`,
            code: "PRESET_EXAM_UNAVAILABLE",
          },
          { status: 503 }
        );
      }
      presetQuestionCount = loaded.questionCount;
      if (loaded.fieldId) sessionFieldId = loaded.fieldId;
      sessionTitle = loaded.title;
    }

    const config = buildSessionConfig(examSlug, preset, timed, {
      nclexLength: examSlug === "nclex" ? nclexLength : undefined,
      presetExamNumber,
      presetQuestionCount,
      focusAreas,
    });

    const { checkMockExamStart } = await import("@/lib/study/usage-limits");
    const usageCheck = await checkMockExamStart({
      userId: premium.userId,
      access: premium.access,
      questionCount: config.questionCount,
      presetExam: Boolean(presetExamNumber),
      lengthPreset: preset,
    });
    if (!usageCheck.ok) return usageCheck.response;

    const sessionId = await createExamSession(premium.userId, examSlug, {
      questionCount: usageCheck.allowedCount,
      timeLimitSec: config.timed ? config.timeLimitSec : null,
      fieldId: sessionFieldId,
      title: sessionTitle,
      sessionConfig: config,
    });

    return NextResponse.json({
      sessionId,
      redirectUrl: fullExamSessionHref(examSlug, sessionId),
      config,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not start exam";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

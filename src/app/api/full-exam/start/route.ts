import { NextResponse } from "next/server";
import { createExamSession } from "@/lib/exam-sessions/service";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { setUserExamPreference } from "@/lib/edtech/exam-preference";
import { buildSessionConfig, fullExamSessionHref } from "@/lib/full-exam/config";
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
  const presetExamNumber =
    examSlug === "nclex" && Number.isFinite(Number(body.presetExamNumber))
      ? Math.max(1, Math.min(10, Number(body.presetExamNumber)))
      : undefined;

  try {
    await setUserExamPreference(premium.userId, examSlug);

    const config = buildSessionConfig(examSlug, preset, timed, {
      nclexLength: examSlug === "nclex" ? nclexLength : undefined,
      presetExamNumber,
    });
    const exam = EXAM_CATALOG[examSlug];

    const sessionTitle = presetExamNumber
      ? `${exam.shortName} Practice Exam ${presetExamNumber}`
      : `${exam.shortName} Full Simulation`;
    const sessionId = await createExamSession(premium.userId, examSlug, {
      questionCount: config.questionCount,
      timeLimitSec: config.timed ? config.timeLimitSec : null,
      fieldId: exam.fieldId,
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

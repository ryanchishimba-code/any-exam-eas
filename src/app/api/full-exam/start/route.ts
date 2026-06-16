import { NextResponse } from "next/server";
import { createExamSession } from "@/lib/exam-sessions/service";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
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

  try {
    const config = buildSessionConfig(examSlug, preset, timed, {
      nclexLength: examSlug === "nclex" ? nclexLength : undefined,
    });
    const exam = EXAM_CATALOG[examSlug];

    const sessionId = await createExamSession(premium.userId, examSlug, {
      questionCount: config.questionCount,
      timeLimitSec: config.timed ? config.timeLimitSec : null,
      fieldId: exam.fieldId,
      title: `${exam.shortName} Full Simulation`,
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

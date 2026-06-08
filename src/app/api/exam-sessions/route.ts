import { NextResponse } from "next/server";
import { createExamSession } from "@/lib/exam-sessions/service";
import type { ExamSlug } from "@/lib/exams/catalog";
import { getExamHub } from "@/lib/exams/catalog";
import { getExamQuestionCountBySlug } from "@/lib/exam/exam-lengths";
import { buildSessionConfig, fullExamSessionHref } from "@/lib/full-exam/config";
import { isExamSlug } from "@/lib/edtech/exams";
import { requirePremiumApi } from "@/lib/api-access";

export const runtime = "nodejs";

const SLUGS = new Set(["nclex", "usmle", "naplex", "mpje", "top500"]);

export async function POST(req: Request) {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const body = await req.json().catch(() => ({}));
  const examType = String(body.examType ?? "") as ExamSlug;
  if (!SLUGS.has(examType) || !getExamHub(examType)) {
    return NextResponse.json({ error: "Invalid exam type" }, { status: 400 });
  }

  try {
    if (isExamSlug(examType)) {
      const sessionConfig = buildSessionConfig(examType, "full", true);
      const id = await createExamSession(premium.userId, examType, {
        questionCount: sessionConfig.questionCount,
        timeLimitSec: sessionConfig.timeLimitSec,
        title: body.title ?? `${examType.toUpperCase()} full exam`,
        sessionConfig,
      });
      return NextResponse.json({
        sessionId: id,
        redirectUrl: fullExamSessionHref(examType, id),
      });
    }

    const defaultCount = getExamQuestionCountBySlug(examType);
    const questionCount = Number(body.questionCount) || defaultCount;
    const timeLimitSec = Number(body.timeLimitSec) || 3600;
    const id = await createExamSession(premium.userId, examType, {
      questionCount,
      timeLimitSec,
      title: body.title ?? `${examType.toUpperCase()} timed exam`,
    });

    return NextResponse.json({
      sessionId: id,
      redirectUrl: `/exam/${examType}/${id}`,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not start exam session";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

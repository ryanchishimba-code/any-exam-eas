import { NextResponse } from "next/server";
import { createExamSession } from "@/lib/exam-sessions/service";
import type { ExamSlug } from "@/lib/exams/catalog";
import { getExamHub } from "@/lib/exams/catalog";
import { getExamQuestionCountBySlug } from "@/lib/exam/exam-lengths";
import { buildSessionConfig, fullExamSessionHref } from "@/lib/full-exam/config";
import { parseRequestedLengthPreset } from "@/lib/exam/session-count";
import { isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { requirePremiumApi } from "@/lib/api-access";

export const runtime = "nodejs";

const SLUGS = new Set(["nclex", "usmle", "naplex", "pance", "aanp-fnp", "npte-pt", "top500"]);

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
      const pref = await getUserExamPreference(premium.userId);
      if (!pref) {
        return NextResponse.json({ error: "Select an exam before starting." }, { status: 403 });
      }
      if (pref.examSlug !== examType) {
        return NextResponse.json(
          { error: "That exam does not match your selected exam.", code: "EXAM_MISMATCH" },
          { status: 403 }
        );
      }

      const lengthPreset = parseRequestedLengthPreset(body.lengthPreset);
      const nclexLength =
        body.nclexLength === "maximum" ? ("maximum" as const) : ("minimum" as const);
      const sessionConfig = buildSessionConfig(examType, lengthPreset, true, {
        nclexLength: examType === "nclex" ? nclexLength : undefined,
        fieldId: body.fieldId ? String(body.fieldId) : undefined,
      });
      const { checkMockExamStart } = await import("@/lib/study/usage-limits");
      const usageCheck = await checkMockExamStart({
        userId: premium.userId,
        access: premium.access,
        questionCount: sessionConfig.questionCount,
        lengthPreset,
      });
      if (!usageCheck.ok) return usageCheck.response;

      if (usageCheck.allowedCount !== sessionConfig.questionCount) {
        return NextResponse.json(
          {
            error: `Your plan allows ${usageCheck.allowedCount} questions per session. Choose ${usageCheck.allowedCount} or fewer, or upgrade for larger sessions.`,
            code: "SESSION_SIZE_CAPPED",
            allowedCount: usageCheck.allowedCount,
          },
          { status: 403 }
        );
      }

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

    const { checkMockExamStart } = await import("@/lib/study/usage-limits");
    const usageCheck = await checkMockExamStart({
      userId: premium.userId,
      access: premium.access,
      questionCount,
    });
    if (!usageCheck.ok) return usageCheck.response;

    const id = await createExamSession(premium.userId, examType, {
      questionCount: usageCheck.allowedCount,
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

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildMpjePracticeExam,
  toPublicExamQuestions,
} from "@/lib/mpje/build-practice-exam";
import {
  createMpjeExamSession,
  deleteMpjeExamSession,
  getMpjeExamSession,
} from "@/lib/mpje/exam-session-cache";
import {
  MPJE_PRACTICE_EXAM_PASSING_PERCENT,
  MPJE_PRACTICE_EXAM_QUESTION_COUNT,
  MPJE_PRACTICE_EXAM_TIME_SECONDS,
} from "@/lib/mpje/practice-exam-config";
import { gradeMpjePracticeExam } from "@/lib/mpje/practice-exam-scoring";
import { getMpjeState } from "@/lib/mpje/config";
import { parseMpjeStateParam } from "@/lib/mpje/validators";
import { enforceRateLimit } from "@/lib/api-rate-limit";

export const runtime = "nodejs";

const submitSchema = z.object({
  examId: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selected: z.string().nullable(),
    })
  ),
  timeSpentSec: z.number().int().min(0).optional(),
  endedEarly: z.boolean().optional(),
});

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "mpje-practice-exam-get", 8, 60_000);
  if (limited) return limited;

  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const { searchParams } = new URL(req.url);
  const stateCode = parseMpjeStateParam(
    searchParams.get("state"),
    searchParams.get("mpjeState")
  );

  try {
    const questions = await buildMpjePracticeExam(stateCode);
    const examId = createMpjeExamSession(premium.userId, stateCode ?? "", questions);
    const state = stateCode ? getMpjeState(stateCode) : undefined;

    return NextResponse.json({
      examId,
      stateCode: stateCode ?? null,
      stateName: state?.name ?? (stateCode ? stateCode : "Federal"),
      title: state
        ? `${state.name} MPJE Practice Exam`
        : "Federal MPJE Practice Exam",
      questionCount: MPJE_PRACTICE_EXAM_QUESTION_COUNT,
      timeLimitSeconds: MPJE_PRACTICE_EXAM_TIME_SECONDS,
      passingPercent: MPJE_PRACTICE_EXAM_PASSING_PERCENT,
      questions: toPublicExamQuestions(questions),
      meta: {
        stateSpecific: questions.filter((q) => q.stateCode === stateCode).length,
        federal: questions.filter((q) => !q.stateCode).length,
        note:
          "Real MPJE includes 100 scored + 20 unscored pretest items. This simulator scores all 120 for practice.",
      },
    });
  } catch (e) {
    console.error("[mpje/practice-exam] GET failed:", e);
    return NextResponse.json(
      { error: "Could not build practice exam. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "mpje-practice-exam-submit", 12, 60_000);
  if (limited) return limited;

  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  try {
    const body = submitSchema.parse(await req.json());
    const session = getMpjeExamSession(body.examId, premium.userId);

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Exam session expired or not found. Start a new practice exam.",
        },
        { status: 410 }
      );
    }

    const result = gradeMpjePracticeExam(session.questions, body.answers);
    deleteMpjeExamSession(body.examId);

    const state = getMpjeState(session.stateCode);

    return NextResponse.json({
      ...result,
      stateCode: session.stateCode,
      stateName: state?.name ?? session.stateCode,
      timeSpentSec: body.timeSpentSec ?? null,
      endedEarly: body.endedEarly ?? false,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0]?.message ?? "Invalid submission." }, { status: 400 });
    }
    console.error("[mpje/practice-exam] POST failed:", e);
    return NextResponse.json({ error: "Could not grade exam." }, { status: 500 });
  }
}

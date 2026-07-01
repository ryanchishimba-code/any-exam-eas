import { NextResponse } from "next/server";
import {
  appendExamAnswer,
  completeExamSession,
  getExamSession,
} from "@/lib/exam-sessions/service";
import { calculateExamScorePercent } from "@/lib/exam-sessions/scoring";
import { requirePremiumApi } from "@/lib/api-access";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const { id } = await params;
  const body = await req.json();

  if (body.complete) {
    const session = await getExamSession(id, premium.userId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const stored = (Array.isArray(session.answers)
      ? session.answers
      : []) as ExamAnswerRecord[];
    const totalQuestions = session.questionCount || stored.length;
    const score = calculateExamScorePercent(stored, totalQuestions);

    await completeExamSession(id, premium.userId, {
      score,
      weakAreas: body.weakAreas ?? [],
      analysis: body.analysis,
      endedEarly: Boolean(body.endedEarly),
    });
    return NextResponse.json({ ok: true, score });
  }

  const answers = await appendExamAnswer(id, premium.userId, {
    questionIndex: Number(body.questionIndex),
    questionId: body.questionId,
    selected: String(body.selected ?? ""),
    correct: Boolean(body.correct),
    flagged: Boolean(body.flagged),
    eliminated: Array.isArray(body.eliminated) ? body.eliminated : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
    topicCategory: typeof body.topicCategory === "string" ? body.topicCategory : undefined,
    answeredAt: new Date().toISOString(),
  });

  if (!answers) {
    return NextResponse.json({ error: "Session not found or already completed" }, { status: 404 });
  }

  return NextResponse.json({ answers });
  } catch (error) {
    const { respondDbUnavailable } = await import("@/lib/api-db-error");
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    throw error;
  }
}

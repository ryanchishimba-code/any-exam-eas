import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { appendExamAnswer, completeExamSession } from "@/lib/exam-sessions/service";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.complete) {
    await completeExamSession(id, session.user.id, {
      score: Number(body.score) || 0,
      weakAreas: body.weakAreas ?? [],
      analysis: body.analysis,
      endedEarly: Boolean(body.endedEarly),
    });
    return NextResponse.json({ ok: true });
  }

  const answers = await appendExamAnswer(id, session.user.id, {
    questionIndex: Number(body.questionIndex),
    questionId: body.questionId,
    selected: String(body.selected ?? ""),
    correct: Boolean(body.correct),
    flagged: Boolean(body.flagged),
    answeredAt: new Date().toISOString(),
  });

  return NextResponse.json({ answers });
}

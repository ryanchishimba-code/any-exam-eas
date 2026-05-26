import { NextResponse } from "next/server";
import { z } from "zod";
import { recordQuestionAttempt } from "@/lib/questions/analytics-server";
import type { StudyQuestion } from "@/lib/questions/types";

export const runtime = "nodejs";

const bodySchema = z.object({
  question: z.object({
    id: z.string(),
    sourceIndex: z.number(),
    type: z.string(),
    stem: z.string(),
    options: z.array(z.string()),
    correctAnswers: z.array(z.string()),
    explanation: z.string(),
    bankItemId: z.string().optional(),
    field: z.string().optional(),
    subjectId: z.string().optional(),
  }),
  correct: z.boolean(),
  confidence: z.number().int().min(1).max(5).optional(),
  durationMs: z.number().int().min(0).optional(),
  selectedAnswer: z.string().optional(),
  sessionId: z.string().optional(),
});

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  try {
    const body = bodySchema.parse(await req.json());
    await recordQuestionAttempt({
      userId: premium.userId,
      question: body.question as StudyQuestion,
      correct: body.correct,
      confidence: body.confidence,
      durationMs: body.durationMs,
      selectedAnswer: body.selectedAnswer,
      sessionId: body.sessionId,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid attempt payload." }, { status: 400 });
  }
}

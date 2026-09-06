import { NextResponse } from "next/server";
import { z } from "zod";
import { processLearningAttempt } from "@/lib/learning/engine";
import { getFieldMeta } from "@/lib/fields";
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
    tags: z.array(z.string()).optional(),
    difficulty: z.string().optional(),
    highYield: z.boolean().optional(),
    explanationDetail: z
      .object({
        summary: z.string(),
        whyCorrect: z.string(),
        whyIncorrect: z.record(z.string()).optional(),
        keyTakeaways: z.array(z.string()).optional(),
        pearls: z.array(z.string()).optional(),
        relatedConcepts: z.array(z.string()).optional(),
        difficultyLabel: z.string().optional(),
      })
      .optional(),
  }),
  correct: z.boolean(),
  confidence: z.number().int().min(1).max(5).optional(),
  durationMs: z.number().int().min(0).optional(),
  selectedAnswer: z.string().optional(),
  sessionId: z.string().optional(),
  studyMode: z.string().optional(),
});

export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const body = bodySchema.parse(await req.json());
    const question = body.question as StudyQuestion;
    const fieldLabel = question.field ?? "Medicine";
    const meta = getFieldMeta(fieldLabel);
    const fieldId = meta?.id ?? fieldLabel.toLowerCase().replace(/\s+/g, "-");

    const result = await processLearningAttempt({
      userId: premium.userId,
      question,
      correct: body.correct,
      confidence: body.confidence,
      durationMs: body.durationMs,
      selectedAnswer: body.selectedAnswer,
      sessionId: body.sessionId,
      fieldId,
      studyMode: body.studyMode,
    });

    return NextResponse.json({
      ok: true,
      insight: result.insight,
      remediation: result.remediation,
      attemptId: result.attemptId,
    });
  } catch {
    return NextResponse.json({ error: "Invalid attempt payload." }, { status: 400 });
  }
}

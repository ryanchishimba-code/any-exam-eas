import { NextResponse } from "next/server";
import { z } from "zod";
import { processLearningAttempt } from "@/lib/learning/engine";
import { invalidateStudentReadCaches } from "@/lib/learning/invalidate-read-caches";
import { resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
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
  practiceFormat: z.enum(["ngn", "case"]).optional(),
});

export async function POST(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const body = bodySchema.parse(await req.json());
    const question = body.question as StudyQuestion;
    const fieldLabel = question.field ?? "Medicine";
    const fieldId = resolveQuestionBankFieldId(fieldLabel);

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
      practiceFormat: body.practiceFormat,
    });

    if (!result.persisted) {
      console.error("[session-persist] attempt API acknowledged a write that did not persist", {
        userId: premium.userId,
        sessionId: body.sessionId,
        questionKey: question.bankItemId ?? question.id,
      });
      return NextResponse.json(
        { ok: false, persisted: false, error: "Could not save this attempt." },
        { status: 503 }
      );
    }

    if (!result.alreadySaved) {
      await invalidateStudentReadCaches(premium.userId, fieldId);
    }

    return NextResponse.json({
      ok: true,
      persisted: true,
      alreadySaved: result.alreadySaved === true,
      insight: result.insight,
      remediation: result.remediation,
      attemptId: result.attemptId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[session-persist] attempt payload rejected", error.flatten());
      return NextResponse.json(
        { ok: false, persisted: false, error: "Invalid attempt payload." },
        { status: 400 }
      );
    }
    console.error("[session-persist] attempt API failed", error);
    return NextResponse.json(
      { ok: false, persisted: false, error: "Could not save this attempt." },
      { status: 500 }
    );
  }
}

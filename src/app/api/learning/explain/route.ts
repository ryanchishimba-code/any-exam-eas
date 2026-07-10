import { NextResponse } from "next/server";
import { z } from "zod";
import { aiLogicEngine } from "@/lib/core/ai-logic";
import { isAiTutorFieldId, resolveAiTutorFieldId } from "@/lib/learning/ai-tutor-fields";

export const runtime = "nodejs";
export const maxDuration = 45;

const bodySchema = z.object({
  fieldId: z.string().min(1),
  questionId: z.string().min(1),
  stem: z.string().min(1).max(12_000),
  options: z.array(z.string()).min(2).max(12),
  correctAnswers: z.array(z.string()).min(1).max(8),
  selectedAnswers: z.array(z.string()).max(8).optional(),
  explanation: z.string().max(8_000).optional(),
  tags: z.array(z.string()).max(12).optional(),
});

export async function POST(req: Request) {
  const { requireProFeatureApi } = await import("@/lib/api-access");
  const auth = await requireProFeatureApi("ai_tutor");
  if (!auth.ok) return auth.response;

  const { enforceUserRateLimit } = await import("@/lib/api-rate-limit");
  const limited = await enforceUserRateLimit(auth.userId, "learning-explain", 30, 60_000);
  if (limited) return limited;

  try {
    const body = bodySchema.parse(await req.json());
    const fieldId = resolveAiTutorFieldId(body.fieldId);

    if (!fieldId || !isAiTutorFieldId(fieldId)) {
      return NextResponse.json(
        { error: "AI Tutor is available for NCLEX, NAPLEX, and USMLE only." },
        { status: 400 }
      );
    }

    const { explanation, source } = await aiLogicEngine.generateQuestionExplanation({
      stem: body.stem,
      options: body.options,
      correctAnswers: body.correctAnswers,
      selectedAnswers: body.selectedAnswers,
      explanation: body.explanation,
      tags: body.tags,
      field: fieldId,
    });

    return NextResponse.json({
      explanation,
      source,
      questionId: body.questionId,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.errors[0]?.message ?? "Invalid body" }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "AI Tutor failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

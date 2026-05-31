import { NextResponse } from "next/server";
import { z } from "zod";
import { getFieldSubject, getSubjectsForField } from "@/lib/field-subjects";
import { getFieldMeta } from "@/lib/fields";
import { fetchQuestionBankItems } from "@/lib/question-bank-db";
import {
  selectAdaptiveQuestions,
  topicPerformanceFromWeakness,
  type DifficultyLevel,
  type TopicPerformance,
} from "@/lib/learning/adaptive-session";
import { buildTopicWeakness } from "@/lib/learning/weakness";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import type { ExamQuestion } from "@/lib/ai";

export const runtime = "nodejs";

const bodySchema = z.object({
  field: z.string().min(1),
  subjectId: z.string().optional(),
  count: z.number().int().min(1).max(50).default(15),
  currentDifficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  topicPerformance: z
    .array(
      z.object({
        topic: z.string(),
        attempts: z.number().int().min(0),
        accuracy: z.number().min(0).max(1),
      })
    )
    .optional(),
  excludeQuestionKeys: z.array(z.string()).optional(),
  weakFocusRatio: z.number().min(0.2).max(0.9).optional(),
});

function toApiQuestion(prepared: ReturnType<typeof examQuestionToStudy>): ExamQuestion {
  const ngnType = prepared.ngnFormat ?? prepared.type;
  const typeMap: Record<string, ExamQuestion["type"]> = {
    bow_tie: "bow_tie",
    matrix: "matrix",
    highlight: "highlight",
    unfolding_case: "unfolding_case",
    select_all: "select_all",
    ordered_response: "ordered_response",
    true_false: "true_false",
    short_answer: "short_answer",
  };
  const type = typeMap[ngnType] ?? typeMap[prepared.type] ?? "multiple_choice";

  return {
    id: prepared.sourceIndex,
    type,
    ngnFormat: prepared.ngnFormat,
    vignette: prepared.vignette,
    question: prepared.stem,
    options: prepared.options,
    correctAnswer:
      prepared.type === "select_all" ||
      prepared.type === "bow_tie" ||
      prepared.type === "matrix" ||
      prepared.type === "highlight" ||
      prepared.type === "ordered_response"
        ? prepared.correctAnswers.join(",")
        : (prepared.correctAnswers[0] ?? ""),
    explanation: prepared.explanation,
    clinicalReasoning: prepared.clinicalReasoning,
    solutionSteps: prepared.solutionSteps,
    tags: prepared.tags,
    highYield: prepared.highYield,
    chartData: prepared.chartData,
    caseStep: prepared.caseStep,
  };
}

export async function POST(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  try {
    const body = bodySchema.parse(await req.json());
    const meta = getFieldMeta(body.field);
    const fieldId = meta?.id ?? body.field.toLowerCase().replace(/\s+/g, "-");

    let topicPerformance: TopicPerformance[] = body.topicPerformance ?? [];

    if (topicPerformance.length === 0) {
      const weakness = await buildTopicWeakness(premium.userId, fieldId);
      topicPerformance = topicPerformanceFromWeakness(weakness);
    }

    const subjectIds = body.subjectId
      ? [body.subjectId]
      : getSubjectsForField(body.field).map((s) => s.id);

    if (subjectIds.length === 0) {
      return NextResponse.json({ error: "No subjects for this field." }, { status: 400 });
    }

    const pool: ReturnType<typeof examQuestionToStudy>[] = [];
    for (const subjectId of subjectIds) {
      const subject = getFieldSubject(body.field, subjectId);
      if (!subject) continue;

      const items = await fetchQuestionBankItems({ fieldId, subjectId });
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        pool.push(
          examQuestionToStudy(
            {
              id: i + 1,
              type: "multiple_choice",
              question: item.question,
              options: [...item.options],
              correctAnswer: item.correctAnswer,
              explanation: item.explanation,
              solutionSteps: item.solutionSteps,
              tags: item.tags,
              highYield: true,
              field: body.field,
              subjectId,
              bankItemId: item.id,
            },
            pool.length
          )
        );
      }
    }

    if (pool.length === 0) {
      return NextResponse.json(
        { error: "No questions in bank for this field/subject." },
        { status: 404 }
      );
    }

    const excludeKeys = new Set(body.excludeQuestionKeys ?? []);
    const result = selectAdaptiveQuestions({
      questions: pool,
      topicPerformance,
      currentDifficulty: body.currentDifficulty as DifficultyLevel,
      count: body.count,
      excludeKeys,
      weakFocusRatio: body.weakFocusRatio,
    });

    const questions = result.questions.map(toApiQuestion);

    return NextResponse.json({
      field: body.field,
      fieldId,
      subjectId: body.subjectId ?? null,
      questions,
      bankItemIds: result.questions.map((q) => q.bankItemId).filter(Boolean),
      adaptive: {
        recommendedDifficulty: result.recommendedDifficulty,
        previousDifficulty: result.previousDifficulty,
        overallAccuracy: result.overallAccuracy,
        topicAllocation: result.topicAllocation,
        rationale: result.rationale,
        topicPerformance,
      },
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: "Invalid adaptive session request." }, { status: 400 });
  }
}

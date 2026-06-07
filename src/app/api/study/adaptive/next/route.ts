import { NextResponse } from "next/server";
import { z } from "zod";
import { getFieldSubject } from "@/lib/field-subjects";
import { getFieldMeta } from "@/lib/fields";
import {
  ADAPTIVE_QUESTION_POOL_PER_SUBJECT,
  sampleQuestionBankItems,
} from "@/lib/question-bank-db";
import { runAdaptiveSelection } from "@/lib/core/prisma-adapter";
import {
  topicPerformanceFromWeakness,
  type DifficultyLevel,
  type TopicPerformance,
} from "@/lib/learning/adaptive-session";
import { computeOverallAccuracy } from "@/lib/learning/adaptive-session";
import { buildTopicWeakness } from "@/lib/learning/weakness";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import type { ExamQuestion } from "@/lib/ai";
import {
  getMpjeState,
  isMpjeField,
  resolveMpjeGenerationOptions,
} from "@/lib/mpje/config";
import { prepareMpjeBankItems } from "@/lib/mpje/prepare-items";
import { parseMpjeStateParam } from "@/lib/mpje/validators";
import { bankItemToRawQuestion } from "@/lib/exam-prep/ngn-bank-bridge";
import { bankItemToNaplexRaw } from "@/lib/exam-prep/naplex-bank-bridge";
import { bankItemToUsmleRaw, isUsmleField } from "@/lib/exam-prep/usmle-bank-bridge";

export const runtime = "nodejs";

const bodySchema = z.object({
  field: z.string().min(1),
  subjectId: z.string().min(1),
  count: z.number().int().min(1).max(300).default(15),
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
  studyMode: z.enum(["adaptive", "weak_area", "practice", "timed", "mock"]).optional(),
  mpjeVariant: z.enum(["uniform", "state"]).optional(),
  mpjeState: z.string().max(8).optional(),
  state: z.string().max(2).optional(),
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

function bankItemToExamQuestion(
  fieldId: string,
  field: string,
  subjectId: string,
  item: Awaited<ReturnType<typeof sampleQuestionBankItems>>[number],
  index: number
) {
  if (fieldId === "nursing") {
    return bankItemToRawQuestion(item, index, { field, subjectId });
  }
  if (fieldId === "pharmacy") {
    return bankItemToNaplexRaw(item, index, { field, subjectId });
  }
  if (isUsmleField(fieldId)) {
    return bankItemToUsmleRaw(item, index, { field, subjectId });
  }
  return {
    id: index + 1,
    type: "multiple_choice" as const,
    question: item.question,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps,
    tags: item.tags,
    highYield: true,
    field,
    subjectId,
    bankItemId: item.id,
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
    const subjectId = body.subjectId;

    let topicPerformance: TopicPerformance[] = body.topicPerformance ?? [];

    if (topicPerformance.length === 0) {
      const weakness = await buildTopicWeakness(premium.userId, fieldId);
      topicPerformance = topicPerformanceFromWeakness(weakness);
    }

    const subject = getFieldSubject(body.field, subjectId);
    if (!subject) {
      return NextResponse.json({ error: "Unknown subject for this field." }, { status: 400 });
    }

    const mpjeStateCode = isMpjeField(fieldId)
      ? parseMpjeStateParam(body.state, body.mpjeState)
      : undefined;

    const mpjeOptions = isMpjeField(fieldId)
      ? resolveMpjeGenerationOptions({
          variant: body.mpjeVariant ?? "state",
          stateCode: mpjeStateCode,
        })
      : null;

    const poolSize = Math.min(
      ADAPTIVE_QUESTION_POOL_PER_SUBJECT,
      Math.max(body.count * 5, 40)
    );

    let items = await sampleQuestionBankItems({
      fieldId,
      subjectId,
      count: poolSize,
      poolMultiplier: 2,
      stateCode: mpjeStateCode,
    });

    if (mpjeOptions && items.length > 0) {
      const mpjeLabel =
        mpjeOptions.variant === "state" && mpjeOptions.stateCode
          ? `${getMpjeState(mpjeOptions.stateCode)?.name ?? mpjeOptions.stateCode} MPJE`
          : "Uniform MPJE";
      items = prepareMpjeBankItems(items, mpjeOptions, mpjeLabel);
    }

    const pool: ReturnType<typeof examQuestionToStudy>[] = items.map((item, i) =>
      examQuestionToStudy(bankItemToExamQuestion(fieldId, body.field, subjectId, item, i), i)
    );

    if (pool.length === 0) {
      return NextResponse.json(
        {
          error: isMpjeField(fieldId)
            ? "MPJE questions are still loading. Try again in a moment or pick a specific topic."
            : "No questions in bank for this field/subject.",
          code: "EMPTY_BANK",
        },
        { status: 404 }
      );
    }

    const excludeKeys = new Set(body.excludeQuestionKeys ?? []);
    const studyMode =
      body.studyMode ?? (body.weakFocusRatio && body.weakFocusRatio > 0.7 ? "weak_area" : "adaptive");

    const { result, orderedQuestions, reasoningByQuestionId } = await runAdaptiveSelection({
      userId: premium.userId,
      fieldId,
      questions: pool,
      count: body.count,
      studyMode,
      targetDifficulty: body.currentDifficulty as DifficultyLevel,
      excludeKeys,
    });

    const questions = orderedQuestions.map(toApiQuestion);
    const selectionReasoning = result.selections.map((s) => ({
      questionKey: s.questionKey,
      reasoning: s.reasoning,
      score: s.totalScore,
      factors: s.factors.map((f) => ({
        factor: f.factor,
        score: f.score,
        detail: f.detail,
      })),
    }));

    return NextResponse.json({
      field: body.field,
      fieldId,
      subjectId,
      questions,
      bankItemIds: orderedQuestions.map((q) => q.bankItemId).filter(Boolean),
      reasoningByQuestionId,
      adaptive: {
        recommendedDifficulty: result.recommendedDifficulty,
        previousDifficulty: body.currentDifficulty,
        overallAccuracy: computeOverallAccuracy(topicPerformance),
        rationale: result.sessionRationale,
        selectionReasoning,
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

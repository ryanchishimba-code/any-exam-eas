import { NextResponse } from "next/server";
import { z } from "zod";
import { getFieldSubject } from "@/lib/field-subjects";
import { getFieldMeta } from "@/lib/fields";
import { gatherTopicBankSessionPool } from "@/lib/exam-prep/topic-bank-practice";
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
  assertExamSessionReady,
  assessExamSessionQuality,
} from "@/lib/questions/finalize-exam-session";
import {
  bankItemToSessionRaw,
} from "@/lib/exam-prep/prepare-bank-session";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  taskCategory: z.string().optional(),
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
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const body = bodySchema.parse(await req.json());
    const { resolveQuestionBankFieldId, enforceQuestionBankFieldAccess } = await import(
      "@/lib/edtech/question-bank-scope"
    );
    const fieldId = resolveQuestionBankFieldId(body.field);

    const access = await enforceQuestionBankFieldAccess(premium.userId, body.field);
    if (!access.ok) return access.response;

    const {
      checkStudyQuestionUsage,
      recordStudyQuestionsServed,
    } = await import("@/lib/study/usage-limits");
    const usageCheck = await checkStudyQuestionUsage({
      userId: premium.userId,
      access: premium.access,
      requestedCount: body.count,
      adaptive: true,
    });
    if (!usageCheck.ok) return usageCheck.response;
    const sessionCount = usageCheck.allowedCount;

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

    let items = await gatherTopicBankSessionPool({
      fieldId,
      subjectId,
      sessionLimit: sessionCount,
      taskCategory: body.taskCategory,
    });

    if (items.length < sessionCount) {
      return NextResponse.json(
        {
          error: `Not enough ${fieldId} questions available for this topic (${items.length}/${sessionCount}). Try fewer questions or another topic.`,
          code: "SESSION_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    const pool: ReturnType<typeof examQuestionToStudy>[] = items.map((item, i) =>
      examQuestionToStudy(
        bankItemToSessionRaw(fieldId, body.field, subjectId, item, i),
        i
      )
    );

    if (pool.length === 0) {
      return NextResponse.json(
        {
          error: "No board-ready questions in bank for this field/subject.",
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
      count: sessionCount,
      studyMode,
      targetDifficulty: body.currentDifficulty as DifficultyLevel,
      excludeKeys,
    });

    const quality = assessExamSessionQuality(orderedQuestions, sessionCount);
    assertExamSessionReady(quality, fieldId);

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

    await recordStudyQuestionsServed(
      premium.userId,
      questions.length,
      "adaptive",
      usageCheck.plan
    );

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
    if (e instanceof Error && e.message.includes("board-ready")) {
      return NextResponse.json({ error: e.message, code: "SESSION_UNAVAILABLE" }, { status: 503 });
    }
    if (e instanceof Error && e.message.includes("distractor")) {
      return NextResponse.json({ error: e.message, code: "SESSION_UNAVAILABLE" }, { status: 503 });
    }
    if (e instanceof Error && e.message.includes("diverse")) {
      return NextResponse.json({ error: e.message, code: "SESSION_UNAVAILABLE" }, { status: 503 });
    }
    if (e instanceof Error && e.message.includes("balanced")) {
      return NextResponse.json({ error: e.message, code: "SESSION_UNAVAILABLE" }, { status: 503 });
    }
    if (e instanceof Error && e.message.includes("Not enough")) {
      return NextResponse.json({ error: e.message, code: "SESSION_UNAVAILABLE" }, { status: 503 });
    }
    const { respondDbUnavailable } = await import("@/lib/api-db-error");
    const dbResponse = respondDbUnavailable(e);
    if (dbResponse) return dbResponse;
    return NextResponse.json({ error: "Invalid adaptive session request." }, { status: 400 });
  }
}

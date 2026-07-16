import { NextResponse } from "next/server";
import { z } from "zod";
import type { ExamQuestion } from "@/lib/ai";
import { loadBankItemsByIds } from "@/lib/full-exam/load-bank-items-by-ids";
import { loadStillIncorrectBankItemIds } from "@/lib/learning/review-incorrect";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import {
  assertExamSessionReady,
  assessExamSessionQuality,
} from "@/lib/questions/finalize-exam-session";
import { resolveQuestionBankSessionCount } from "@/lib/study/question-bank-setup";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  field: z.string().min(1),
  subjectId: z.string().optional(),
  count: z.number().int().min(1).max(100).default(25),
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
    const requestedCount = resolveQuestionBankSessionCount(body.count);
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
      requestedCount,
      adaptive: false,
    });
    if (!usageCheck.ok) return usageCheck.response;

    const sessionCount = resolveQuestionBankSessionCount(
      Math.min(requestedCount, usageCheck.allowedCount)
    );

    const subjectId =
      body.subjectId && body.subjectId !== MIXED_SUBJECT_ID ? body.subjectId : null;

    const incorrectIds = await loadStillIncorrectBankItemIds({
      userId: premium.userId,
      fieldId,
      subjectId,
      limit: Math.max(sessionCount * 3, 75),
    });

    if (incorrectIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "No previously missed questions to review yet. Practice a standard or adaptive set first, then come back.",
          code: "NO_INCORRECT_ITEMS",
          availableIncorrect: 0,
        },
        { status: 404 }
      );
    }

    if (incorrectIds.length < sessionCount) {
      return NextResponse.json(
        {
          error: `Only ${incorrectIds.length} still-incorrect item${incorrectIds.length === 1 ? "" : "s"} available. Choose ${incorrectIds.length < 25 ? "a smaller session after more practice" : "25"} or keep practicing.`,
          code: "INCORRECT_POOL_TOO_SMALL",
          availableIncorrect: incorrectIds.length,
          requested: sessionCount,
        },
        { status: 400 }
      );
    }

    const pickIds = incorrectIds.slice(0, sessionCount);
    const items = await loadBankItemsByIds(fieldId, pickIds);
    if (items.length < sessionCount) {
      return NextResponse.json(
        {
          error: "Some missed items are no longer in the serve bank. Practice more, then retry.",
          code: "INCORRECT_ITEMS_UNAVAILABLE",
          availableIncorrect: items.length,
        },
        { status: 503 }
      );
    }

    const effectiveSubject = subjectId ?? MIXED_SUBJECT_ID;
    const prepared = items.map((item, i) =>
      examQuestionToStudy(
        bankItemToSessionRaw(fieldId, body.field, item.subjectId ?? effectiveSubject, item, i),
        i
      )
    );

    const quality = assessExamSessionQuality(prepared, sessionCount);
    assertExamSessionReady(quality, fieldId);

    const questions = prepared.map(toApiQuestion);
    await recordStudyQuestionsServed(
      premium.userId,
      questions.length,
      "practice",
      usageCheck.plan
    );

    return NextResponse.json({
      field: body.field,
      fieldId,
      subjectId: effectiveSubject,
      mode: "review_incorrect",
      availableIncorrect: incorrectIds.length,
      questions,
      bankItemIds: prepared.map((q) => q.bankItemId).filter(Boolean),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    console.error("[review-incorrect]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not build review session." },
      { status: 500 }
    );
  }
}

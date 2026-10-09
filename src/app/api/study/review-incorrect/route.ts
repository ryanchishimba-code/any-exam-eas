import { NextResponse } from "next/server";
import { z } from "zod";
import type { ExamQuestion } from "@/lib/ai";
import { loadBankItemsByIds } from "@/lib/full-exam/load-bank-items-by-ids";
import { loadStillIncorrectBankItemIds } from "@/lib/learning/review-incorrect";
import { missedIdsForExamSession } from "@/lib/learning/remediation-loop";
import { getExamSession } from "@/lib/exam-sessions/service";
import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { bankItemToSessionRaw } from "@/lib/exam-prep/prepare-bank-session";
import { examQuestionToStudy } from "@/lib/questions/prepare";
import { studentFacingTags, studentLayoutPayload } from "@/lib/questions/student-payload";
import { joinStoredCorrectAnswer, reviewQueueKind } from "@/lib/questions/multi-answer";
import { resolveQuestionBankSessionCount } from "@/lib/study/question-bank-setup";
import { MIXED_SUBJECT_ID } from "@/lib/edtech/practice-links-core";
import { isServableToStudents } from "@/lib/exam-prep/student-eligibility";

export const runtime = "nodejs";
export const maxDuration = 60;

const bodySchema = z.object({
  field: z.string().min(1),
  subjectId: z.string().optional(),
  count: z.number().int().min(1).max(100).default(25),
  preflight: z.boolean().optional(),
  examSessionId: z.string().min(1).max(80).optional(),
});

function reviewQueueResponse(
  body: Record<string, unknown>,
  openQueueTotal: number,
  status = 200
) {
  const total = Math.max(0, Math.floor(openQueueTotal));
  return NextResponse.json(
    { ...body, openQueueTotal: total, availableIncorrect: total },
    { status, headers: { "X-Review-Open-Total": String(total) } }
  );
}

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
    correctAnswer: joinStoredCorrectAnswer(prepared.type, prepared.correctAnswers),
    ngnPayload: studentLayoutPayload(prepared.ngnPayload),
    explanation: prepared.explanation,
    clinicalReasoning: prepared.clinicalReasoning,
    solutionSteps: prepared.solutionSteps,
    references: prepared.references,
    expertRationale: prepared.expertRationale,
    tags: studentFacingTags(prepared.tags),
    highYield: prepared.highYield,
    chartData: studentLayoutPayload(prepared.chartData),
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

    const subjectId =
      body.subjectId && body.subjectId !== MIXED_SUBJECT_ID ? body.subjectId : null;

    let incorrectIds: string[];
    if (body.examSessionId) {
      const examSession = await getExamSession(body.examSessionId, premium.userId);
      if (!examSession) {
        return NextResponse.json({ error: "Exam session not found." }, { status: 404 });
      }
      const analysis = (examSession.analysis ?? {}) as { prefetchedQuestionIds?: string[] };
      const answers = Array.isArray(examSession.answers)
        ? (examSession.answers as ExamAnswerRecord[])
        : [];
      incorrectIds = missedIdsForExamSession(answers, analysis.prefetchedQuestionIds);
    } else {
      incorrectIds = await loadStillIncorrectBankItemIds({
        userId: premium.userId,
        fieldId,
        subjectId,
        limit: 300,
      });
    }

    if (body.preflight || incorrectIds.length === 0) {
      return reviewQueueResponse(
        {
          field: body.field,
          fieldId,
          subjectId: subjectId ?? MIXED_SUBJECT_ID,
          mode: "review_incorrect",
          questions: [],
          bankItemIds: [],
          code: incorrectIds.length === 0 ? "NO_INCORRECT_ITEMS" : "OK",
        },
        incorrectIds.length
      );
    }

    const {
      checkStudyQuestionUsage,
      recordStudyQuestionsServed,
    } = await import("@/lib/study/usage-limits");
    const scopedToExam = Boolean(body.examSessionId);
    const serveCount = scopedToExam
      ? Math.min(incorrectIds.length, 100)
      : Math.min(requestedCount, incorrectIds.length);
    const usageCheck = await checkStudyQuestionUsage({
      userId: premium.userId,
      access: premium.access,
      requestedCount: serveCount,
      adaptive: false,
    });
    if (!usageCheck.ok) return usageCheck.response;

    const sessionCount = scopedToExam
      ? serveCount
      : Math.min(
          resolveQuestionBankSessionCount(Math.min(requestedCount, usageCheck.allowedCount)),
          incorrectIds.length
        );

    const pickIds = incorrectIds.slice(0, sessionCount);
    const queueKind = reviewQueueKind(pickIds);
    if (queueKind === "mixed") {
      const { loadPublishedClinicalBank } = await import("@/lib/assessment/serve-db");
      const { publishedCatalogToBankItems } = await import("@/lib/full-exam/catalog-exam-items");
      const clinical = await loadPublishedClinicalBank(fieldId);
      const catalogItems = publishedCatalogToBankItems(clinical.catalog);
      const bankItems = await loadBankItemsByIds(
        fieldId,
        pickIds.filter((id) => !id.startsWith("ngn:"))
      );
      const byId = new Map(
        [...catalogItems, ...bankItems].map((item) => [item.id?.trim() ?? "", item] as const)
      );
      const ordered = pickIds
        .flatMap((id) => {
          const item = byId.get(id);
          return item ? [item] : [];
        })
        .filter(isServableToStudents);
      if (ordered.length === 0) {
        return reviewQueueResponse(
          {
            error: "Those missed items are no longer in the bank. Practice more, then retry.",
            code: "INCORRECT_ITEMS_UNAVAILABLE",
          },
          incorrectIds.length,
          503
        );
      }
      const effectiveSubject = subjectId ?? MIXED_SUBJECT_ID;
      const prepared = ordered.map((item, i) =>
        examQuestionToStudy(
          bankItemToSessionRaw(fieldId, body.field, item.subjectId ?? effectiveSubject, item, i),
          i,
          { shuffleOptions: true, shuffleSeed: 0x161 }
        )
      );
      const questions = prepared.map(toApiQuestion);
      await recordStudyQuestionsServed(premium.userId, questions.length, "bank", usageCheck.plan);
      return reviewQueueResponse(
        {
          field: body.field,
          fieldId,
          subjectId: effectiveSubject,
          mode: "review_incorrect",
          questions,
          bankItemIds: ordered.map((item) => item.id).filter(Boolean),
        },
        incorrectIds.length
      );
    }
    if (queueKind === "clinical") {
      const ngnKeys = pickIds.filter((id) => id.startsWith("ngn:"));
      const { loadPublishedClinicalBank } = await import("@/lib/assessment/serve-db");
      const { studentFacingUnit } = await import("@/lib/assessment/serve");
      const bank = await loadPublishedClinicalBank(fieldId);
      const wanted = new Set(ngnKeys);
      const units = [
        ...bank.catalog.cases.filter((unit) =>
          unit.items.some((item) => wanted.has(`ngn:${item.id}:v${item.version}`))
        ),
        ...bank.catalog.standalones.filter((unit) =>
          wanted.has(`ngn:${unit.item.id}:v${unit.item.version}`)
        ),
      ]
        .filter((unit) => {
          if (!subjectId) return true;
          return unit.subjectId === subjectId;
        })
        .map((unit) => studentFacingUnit(unit));
      if (units.length === 0) {
        return reviewQueueResponse(
          {
            error: "Those missed items are no longer in the bank. Practice more, then retry.",
            code: "INCORRECT_ITEMS_UNAVAILABLE",
          },
          incorrectIds.length,
          503
        );
      }
      const scored = units.reduce(
        (sum, unit) => sum + (unit.kind === "case" ? unit.items.length : 1),
        0
      );
      const scoredUsage = await checkStudyQuestionUsage({
        userId: premium.userId,
        access: premium.access,
        requestedCount: scored,
        adaptive: false,
      });
      if (!scoredUsage.ok) return scoredUsage.response;
      await recordStudyQuestionsServed(premium.userId, scored, "bank", scoredUsage.plan);
      const practiceFormat = units.some((unit) => unit.kind === "case") ? "case" : "ngn";
      return reviewQueueResponse(
        {
          field: body.field,
          fieldId,
          subjectId: subjectId ?? MIXED_SUBJECT_ID,
          mode: "review_incorrect",
          questions: [],
          bankItemIds: ngnKeys,
          practiceFormat,
          clinicalSession: {
            practiceFormat,
            field: body.field,
            fieldId,
            subjectId: subjectId ?? MIXED_SUBJECT_ID,
            sourcesById: bank.sourcesById,
            caseReferences: bank.caseReferences,
            units,
          },
        },
        incorrectIds.length
      );
    }
    const items = await loadBankItemsByIds(fieldId, pickIds.filter((id) => !id.startsWith("ngn:")));
    if (items.length === 0) {
      return reviewQueueResponse(
        {
          error: "Those missed items are no longer in the bank. Practice more, then retry.",
          code: "INCORRECT_ITEMS_UNAVAILABLE",
        },
        incorrectIds.length,
        503
      );
    }

    const effectiveSubject = subjectId ?? MIXED_SUBJECT_ID;
    const prepared = items.map((item, i) =>
      examQuestionToStudy(
        bankItemToSessionRaw(fieldId, body.field, item.subjectId ?? effectiveSubject, item, i),
        i
      )
    );

    const questions = prepared.map(toApiQuestion);
    await recordStudyQuestionsServed(
      premium.userId,
      questions.length,
      "bank",
      usageCheck.plan
    );

    return reviewQueueResponse(
      {
        field: body.field,
        fieldId,
        subjectId: effectiveSubject,
        mode: "review_incorrect",
        questions,
        bankItemIds: prepared.map((q) => q.bankItemId).filter(Boolean),
      },
      incorrectIds.length
    );
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

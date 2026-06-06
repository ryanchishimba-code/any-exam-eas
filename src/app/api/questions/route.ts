import { NextResponse } from "next/server";
import { getFieldMeta } from "@/lib/fields";
import { getFieldSubject } from "@/lib/field-subjects";
import {
  countActiveQuestions,
  sampleQuestionBankItems,
  sampleQuestionBankItemsForField,
} from "@/lib/question-bank-db";
import { MIN_QUESTIONS_PER_SUBJECT } from "@/lib/bulk-question-generator";
import {
  getLastQuestionBankSync,
  getSubjectQuestionCount,
} from "@/lib/sync-question-bank";
import {
  parseNclexTimedVariant,
  resolveTimedExamLimit,
} from "@/lib/exam/exam-lengths";
import { clampQuestionBankCount } from "@/lib/exam/modes";
import { prepareQuestionsForSession } from "@/lib/questions/prepare";
import type { ExamQuestion } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";
import {
  getMpjeState,
  isMpjeField,
  resolveMpjeGenerationOptions,
} from "@/lib/mpje/config";
import { prepareMpjeBankItems } from "@/lib/mpje/prepare-items";
import { countMpjeQuestionsForState } from "@/lib/mpje/sample-bank";
import { parseMpjeStateParam } from "@/lib/mpje/validators";

const MIXED_SUBJECT_ID = "__mixed__";
const MAX_BANK_LIMIT = 100;
const MAX_TIMED_LIMIT = 300;

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;
  const userId = premium.userId;

  const { searchParams } = new URL(req.url);
  const field = searchParams.get("field");
  const subjectId = searchParams.get("subjectId");
  const mode = searchParams.get("mode");
  const timedExam = mode === "timed";
  const questionBank = mode === "bank";

  if (!field) {
    return NextResponse.json({ error: "Query param field is required" }, { status: 400 });
  }

  if (questionBank && searchParams.get("scope") === "field") {
    return NextResponse.json(
      { error: "Question bank requires a topic — use subjectId, not mixed scope" },
      { status: 400 }
    );
  }

  const meta = getFieldMeta(field);
  const fieldId = meta?.id ?? field.toLowerCase().replace(/\s+/g, "-");

  const nclexLength = parseNclexTimedVariant(searchParams.get("nclexLength"));
  const mixed =
    timedExam ||
    searchParams.get("scope") === "field" ||
    subjectId === MIXED_SUBJECT_ID ||
    searchParams.get("mixed") === "1";

  const maxLimit = timedExam ? MAX_TIMED_LIMIT : MAX_BANK_LIMIT;
  const requestedLimit = Number(searchParams.get("limit"));
  const defaultLimit = timedExam
    ? resolveTimedExamLimit(field, undefined, nclexLength)
    : 25;
  const resolvedLimit = timedExam
    ? resolveTimedExamLimit(
        field,
        Number.isFinite(requestedLimit) ? requestedLimit : undefined,
        nclexLength
      )
    : clampQuestionBankCount(
        Number.isFinite(requestedLimit) ? requestedLimit : defaultLimit
      );
  const limit = Math.min(resolvedLimit, maxLimit);

  if (!mixed) {
    if (!subjectId) {
      return NextResponse.json(
        { error: "Query param subjectId is required for topic-specific practice" },
        { status: 400 }
      );
    }

    const subject = getFieldSubject(field, subjectId);
    if (!subject) {
      return NextResponse.json({ error: "Invalid subject for this field" }, { status: 400 });
    }
  }

  const mpjeStateCode = isMpjeField(fieldId)
    ? parseMpjeStateParam(
        searchParams.get("state"),
        searchParams.get("mpjeState")
      )
    : undefined;

  let items = mixed
    ? await sampleQuestionBankItemsForField({
        fieldId,
        count: limit,
        stateCode: mpjeStateCode,
      })
    : await sampleQuestionBankItems({
        fieldId,
        subjectId: subjectId!,
        count: limit,
        stateCode: mpjeStateCode,
      });

  const resolvedSubjectId = mixed ? MIXED_SUBJECT_ID : subjectId!;

  if (items.length === 0) {
    return NextResponse.json(
      {
        error: isMpjeField(fieldId)
          ? mpjeStateCode
            ? `No MPJE questions yet for ${mpjeStateCode}. Federal items may still be syncing — try again shortly.`
            : "No MPJE questions are available for this topic yet. Try another topic or contact support."
          : "No questions available for this selection.",
        code: "EMPTY_BANK",
        fieldId,
        subjectId: resolvedSubjectId,
        stateCode: mpjeStateCode ?? null,
      },
      { status: 404 }
    );
  }

  const mpjeOptions = isMpjeField(fieldId)
    ? resolveMpjeGenerationOptions({
        variant: searchParams.get("mpjeVariant") ?? "state",
        stateCode: mpjeStateCode,
      })
    : null;

  const subjectLabel = mixed
    ? "Assorted topics"
    : getFieldSubject(field, subjectId!)!.label;

  if (mpjeOptions && items.length > 0) {
    const mpjeLabel =
      mpjeOptions.variant === "state" && mpjeOptions.stateCode
        ? `${getMpjeState(mpjeOptions.stateCode)?.name ?? mpjeOptions.stateCode} MPJE`
        : "Uniform MPJE";
    items = prepareMpjeBankItems(items, mpjeOptions, mpjeLabel);
  }

  const raw: ExamQuestion[] = items.map((item, i) => ({
    id: i + 1,
    type: "multiple_choice" as const,
    question: item.question,
    options: [...item.options],
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    solutionSteps: item.solutionSteps,
    tags: item.tags,
    highYield: true,
  }));

  const prepared = prepareQuestionsForSession(
    raw.map((q, i) => ({
      ...q,
      field,
      subjectId: items[i]?.subjectId ?? resolvedSubjectId,
      bankItemId: items[i]?.id ?? undefined,
    })),
    { shuffleOrder: true }
  );

  const questions: ExamQuestion[] = prepared.map((p, i) => ({
    id: i + 1,
    type: p.type === "true_false" ? "true_false" : "multiple_choice",
    question: p.stem,
    options: p.options,
    correctAnswer: p.correctAnswers[0] ?? "",
    explanation: p.explanation,
    solutionSteps: p.solutionSteps,
    tags: p.tags,
    highYield: p.highYield,
  }));

  const [totalActive, subjectTotal, lastSync, mpjeCounts] = await Promise.all([
    countActiveQuestions(fieldId),
    mixed ? countActiveQuestions(fieldId) : getSubjectQuestionCount(fieldId, subjectId!),
    getLastQuestionBankSync(),
    mpjeStateCode
      ? countMpjeQuestionsForState(
          mpjeStateCode,
          mixed ? undefined : subjectId!
        )
      : Promise.resolve(null),
  ]);

  trackEvent({
    userId,
    eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
    category: "education",
    metadata: {
      field,
      fieldId,
      subjectId: resolvedSubjectId,
      mixed,
      timedExam,
      nclexLength: timedExam ? nclexLength : undefined,
      mpjeVariant: mpjeOptions?.variant,
      mpjeState: mpjeOptions?.stateCode,
      requestedLimit: limit,
      returned: questions.length,
    },
    req,
  });

  return NextResponse.json({
    field,
    fieldId,
    subjectId: resolvedSubjectId,
    subjectLabel,
    mixed,
    timedExam,
    questions,
    bankItemIds: prepared.map((p) => p.bankItemId).filter(Boolean),
    meta: {
      returned: questions.length,
      requested: limit,
      availableForSubject: subjectTotal,
      minimumPerSubject: MIN_QUESTIONS_PER_SUBJECT,
      meetsMinimum: mixed ? totalActive > 0 : subjectTotal >= MIN_QUESTIONS_PER_SUBJECT,
      totalActiveInField: totalActive,
      lastSyncedAt: lastSync?.finishedAt ?? null,
      lastSyncStatus: lastSync?.status ?? null,
      ...(mpjeStateCode && mpjeCounts
        ? {
            stateCode: mpjeStateCode,
            stateSpecificAvailable: mpjeCounts.stateSpecific,
            federalAvailable: mpjeCounts.federal,
            usedFederalFallback: mpjeCounts.stateSpecific === 0 && questions.length > 0,
          }
        : {}),
    },
  });
}

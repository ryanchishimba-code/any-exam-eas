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
    ? parseMpjeStateParam(searchParams.get("state"), searchParams.get("mpjeState"))
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

  const { bankItemToExamQuestion, bankItemToRawQuestion } = await import(
    "@/lib/exam-prep/ngn-bank-bridge"
  );
  const { bankItemToNaplexRaw } = await import("@/lib/exam-prep/naplex-bank-bridge");
  const { bankItemToUsmleRaw, isUsmleField } = await import(
    "@/lib/exam-prep/usmle-bank-bridge"
  );

  const raw: ExamQuestion[] = items.map((item, i) => {
    if (fieldId === "nursing") {
      return bankItemToRawQuestion(item, i, {
        field: fieldId,
        subjectId: item.subjectId ?? resolvedSubjectId,
      });
    }
    if (fieldId === "pharmacy") {
      return bankItemToNaplexRaw(item, i, {
        field: fieldId,
        subjectId: item.subjectId ?? resolvedSubjectId,
      });
    }
    if (isUsmleField(fieldId)) {
      return bankItemToUsmleRaw(item, i, {
        field: fieldId,
        subjectId: item.subjectId ?? resolvedSubjectId,
      });
    }
    if (isMpjeField(fieldId)) {
      const mpjeType =
        item.itemType === "select_all"
          ? "select_all"
          : item.itemType === "k_type"
            ? "multiple_choice"
            : "multiple_choice";
      return {
        id: i + 1,
        type: mpjeType,
        question: item.question,
        options: [...item.options],
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        solutionSteps: item.solutionSteps,
        tags: item.tags,
        highYield: true,
        vignette: item.scenario ?? item.vignette,
        ngnFormat: item.itemType === "k_type" ? "k_type" : undefined,
        ngnPayload: item.ngnPayload,
        field,
        subjectId: item.subjectId ?? resolvedSubjectId,
        bankItemId: item.id,
      };
    }
    return bankItemToExamQuestion(item, i, {
      field,
      subjectId: item.subjectId ?? resolvedSubjectId,
    });
  });

  const prepared = prepareQuestionsForSession(
    raw.map((q, i) => ({
      ...q,
      field,
      subjectId: items[i]?.subjectId ?? resolvedSubjectId,
      bankItemId: items[i]?.id ?? undefined,
    })),
    { shuffleOrder: true }
  );

  const questions: ExamQuestion[] = prepared.map((p, i) => {
    const src = raw[i];
    const ngnTypes = new Set([
      "bow_tie",
      "matrix",
      "highlight",
      "select_all",
      "ordered_response",
      "unfolding_case",
      "short_answer",
      "drag_drop",
      "calculation",
      "fill_blank",
    ]);
    const preserveType = src?.type && ngnTypes.has(src.type);
    const isSelectAll = src?.type === "select_all" || p.type === "select_all";
    return {
      id: i + 1,
      type: preserveType
        ? (src!.type as ExamQuestion["type"])
        : p.type === "true_false"
          ? "true_false"
          : isSelectAll
            ? "select_all"
            : p.type === "bow_tie" ||
                p.type === "matrix" ||
                p.type === "highlight" ||
                p.type === "ordered_response" ||
                p.type === "unfolding_case" ||
                p.type === "short_answer" ||
                p.type === "drag_drop" ||
                p.type === "calculation" ||
                p.type === "fill_blank"
              ? (p.type as ExamQuestion["type"])
              : "multiple_choice",
      question: p.stem,
      options: p.options,
      correctAnswer: isSelectAll
        ? (src?.correctAnswer ?? p.correctAnswers.join(","))
        : p.type === "matrix" || p.type === "bow_tie" || p.type === "ordered_response"
          ? (src?.correctAnswer ?? p.correctAnswers.join(","))
          : (p.correctAnswers[0] ?? src?.correctAnswer ?? ""),
      explanation: p.explanation,
      solutionSteps: p.solutionSteps,
      tags: p.tags,
      highYield: p.highYield,
      vignette: src?.vignette ?? p.vignette,
      ngnFormat: src?.ngnFormat ?? p.ngnFormat,
      ngnPayload: src?.ngnPayload ?? p.ngnPayload,
      chartData: src?.chartData ?? p.chartData,
      caseStep: src?.caseStep ?? p.caseStep,
    };
  });

  const includeMeta = searchParams.get("meta") !== "0";

  const totalActive = includeMeta ? await countActiveQuestions(fieldId) : 0;
  const subjectTotal = includeMeta
    ? mixed
      ? totalActive
      : await getSubjectQuestionCount(fieldId, subjectId!)
    : 0;
  const lastSync = includeMeta ? await getLastQuestionBankSync() : null;
  const mpjeCounts =
    includeMeta && mpjeStateCode
      ? await countMpjeQuestionsForState(mpjeStateCode, mixed ? undefined : subjectId!)
      : null;

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
    ...(includeMeta
      ? {
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
        }
      : {}),
  });
}

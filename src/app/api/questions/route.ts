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
import {
  prepareQuestionsForSession,
  studyQuestionsToExamQuestions,
} from "@/lib/questions/prepare";
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

  const { enforceQuestionBankFieldAccess } = await import("@/lib/edtech/question-bank-scope");
  const access = await enforceQuestionBankFieldAccess(userId, fieldId);
  if (!access.ok) return access.response;

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

  const { isUsmleField } = await import("@/lib/exam-prep/usmle-bank-bridge");
  const usmleField = isUsmleField(fieldId);
  const { resolveExamBankSampleCount, finalizeExamSessionQuestions, assertExamSessionReady } =
    await import("@/lib/questions/finalize-exam-session");
  const sampleCount = resolveExamBankSampleCount(fieldId, limit, timedExam);

  let items: Awaited<ReturnType<typeof sampleQuestionBankItemsForField>>;

  if (mixed && timedExam) {
    const { gatherTimedExamBankItems } = await import("@/lib/questions/timed-exam-sampling");

    if (fieldId === "nursing") {
      const { nclexItemPassesTimedExamGate } = await import("@/lib/exam-prep/nclex-serve-gate");
      items = await gatherTimedExamBankItems({
        fieldId,
        limit,
        filterFn: nclexItemPassesTimedExamGate,
        initialSampleCount: sampleCount,
      });
    } else if (fieldId === "pharmacy") {
      const { naplexItemPassesTimedExamGate, prepareNaplexBankItem } = await import(
        "@/lib/exam-prep/naplex-serve-gate"
      );
      items = (
        await gatherTimedExamBankItems({
          fieldId,
          limit,
          filterFn: naplexItemPassesTimedExamGate,
          initialSampleCount: sampleCount,
        })
      ).map(prepareNaplexBankItem);
    } else if (usmleField) {
      const { usmleBankItemIsServeReady } = await import("@/lib/exam-prep/usmle-clinical-gate");
      items = await gatherTimedExamBankItems({
        fieldId,
        limit,
        filterFn: (item) => usmleBankItemIsServeReady(item, fieldId),
        initialSampleCount: sampleCount,
      });
    } else if (isMpjeField(fieldId)) {
      const { mpjeItemPassesTimedExamGate } = await import("@/lib/exam-prep/mpje-serve-gate");
      items = await gatherTimedExamBankItems({
        fieldId,
        limit,
        stateCode: mpjeStateCode,
        filterFn: mpjeItemPassesTimedExamGate,
        initialSampleCount: sampleCount,
      });
    } else {
      items = await sampleQuestionBankItemsForField({
        fieldId,
        count: sampleCount,
        stateCode: mpjeStateCode,
      });
    }
  } else if (mixed) {
    items = await sampleQuestionBankItemsForField({
      fieldId,
      count: sampleCount,
      stateCode: mpjeStateCode,
    });
  } else {
    items = await sampleQuestionBankItems({
      fieldId,
      subjectId: subjectId!,
      count: sampleCount,
      stateCode: mpjeStateCode,
    });
  }

  if (usmleField && items.length > 0 && !(mixed && timedExam)) {
    const { prepareUsmleItemsForSession } = await import("@/lib/exam-prep/usmle-clinical-gate");
    items = prepareUsmleItemsForSession({ items, fieldId, field, limit });
  }

  if (fieldId === "pharmacy" && items.length > 0 && !(mixed && timedExam)) {
    const { prepareNaplexItemsForSession } = await import("@/lib/exam-prep/naplex-serve-gate");
    items = prepareNaplexItemsForSession({ items, fieldId, field, limit });
  }

  if (fieldId === "nursing" && items.length > 0 && !(mixed && timedExam)) {
    const { prepareNclexItemsForSession } = await import("@/lib/exam-prep/nclex-serve-gate");
    items = prepareNclexItemsForSession({ items, field, limit });
  }

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
    const { prepareMpjeItemsForSession } = await import("@/lib/exam-prep/mpje-serve-gate");
    if (!(mixed && timedExam)) {
      items = prepareMpjeItemsForSession({ items, limit });
    }
  }

  const { bankItemToExamQuestion, bankItemToRawQuestion } = await import(
    "@/lib/exam-prep/ngn-bank-bridge"
  );
  const { bankItemToNaplexRaw } = await import("@/lib/exam-prep/naplex-bank-bridge");
  const { bankItemToUsmleRaw } = await import("@/lib/exam-prep/usmle-bank-bridge");

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
            ? "k_type"
            : "multiple_choice";
      return {
        id: i + 1,
        type: mpjeType as ExamQuestion["type"],
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

  const rawInputs = raw.map((q, i) => ({
    ...q,
    field,
    subjectId: items[i]?.subjectId ?? resolvedSubjectId,
    bankItemId: items[i]?.id ?? undefined,
    difficultyLabel:
      q.difficultyLabel ??
      (items[i]?.difficulty != null
        ? items[i]!.difficulty! <= 2
          ? "Easy"
          : items[i]!.difficulty! >= 4
            ? "Hard"
            : "Medium"
        : undefined),
  }));

  let prepared;
  let sessionQuality;

  if (timedExam) {
    try {
      const finalized = finalizeExamSessionQuestions(rawInputs, limit);
      prepared = finalized.prepared;
      sessionQuality = finalized.quality;
      assertExamSessionReady(sessionQuality, fieldId);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not build full exam session";
      return NextResponse.json({ error: message, code: "EXAM_SESSION_UNAVAILABLE" }, { status: 503 });
    }
  } else {
    prepared = prepareQuestionsForSession(rawInputs, { shuffleOrder: true }).slice(0, limit);
  }

  const questions: ExamQuestion[] = studyQuestionsToExamQuestions(prepared);

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
    requested: limit,
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

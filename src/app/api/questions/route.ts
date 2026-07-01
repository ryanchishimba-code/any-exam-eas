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
import { studyQuestionsToExamQuestions } from "@/lib/questions/prepare";
import type { ExamQuestion } from "@/lib/ai";
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";
import { fieldSupportsBlueprintTimedExam } from "@/lib/exam-prep/compose/compose-timed-exam-session";
import type { BankItem } from "@/lib/question-bank";

const MIXED_SUBJECT_ID = "__mixed__";
const MAX_BANK_LIMIT = 100;
const MAX_TIMED_LIMIT = 300;

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: Request) {
  try {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;
  const userId = premium.userId;
  const userAccess = premium.access;

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
  const { resolveQuestionBankFieldId, enforceQuestionBankFieldAccess } = await import(
    "@/lib/edtech/question-bank-scope"
  );
  const fieldId = resolveQuestionBankFieldId(field);
  const access = await enforceQuestionBankFieldAccess(userId, field);
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
  let limit = Math.min(resolvedLimit, maxLimit);

  const focusAreasParam = searchParams.get("focusAreas") ?? searchParams.get("focus_areas");
  const focusAreas = focusAreasParam
    ? focusAreasParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const {
    checkStudyQuestionUsage,
    recordStudyQuestionsServed,
  } = await import("@/lib/study/usage-limits");
  const usageCheck = await checkStudyQuestionUsage({
    userId,
    access: userAccess,
    requestedCount: limit,
    timedExam,
    fullLengthMock: timedExam && limit >= 50,
  });
  if (!usageCheck.ok) return usageCheck.response;
  limit = usageCheck.allowedCount;

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

  const { bankItemToSessionRaw, prepareBankItemsForSession } = await import(
    "@/lib/exam-prep/prepare-bank-session"
  );
  const {
    resolveExamBankSampleCount,
    finalizeExamSessionQuestions,
    assertExamSessionReady,
  } = await import("@/lib/questions/finalize-exam-session");
  const sampleCount = resolveExamBankSampleCount(fieldId, limit, timedExam);

  let items: BankItem[];

  if (mixed && timedExam) {
    const { assembleTimedExamSessionItems } = await import(
      "@/lib/exam-prep/compose/assemble-timed-exam-session"
    );
    const assembled = await assembleTimedExamSessionItems({
      fieldId,
      field,
      limit,
      focusAreas,
      sampleCount,
    });

    if (!assembled) {
      if (fieldSupportsBlueprintTimedExam(fieldId)) {
        return NextResponse.json(
          {
            error: `Could not compose a ${limit}-question exam aligned to the board blueprint. Try again shortly.`,
            code: "EXAM_SESSION_UNAVAILABLE",
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        {
          error: "No questions available for this selection.",
          code: "EMPTY_BANK",
          fieldId,
          subjectId: MIXED_SUBJECT_ID,
        },
        { status: 404 }
      );
    }

    items = assembled.items;
  } else if (mixed) {
    items = await sampleQuestionBankItemsForField({
      fieldId,
      count: sampleCount,
    });
  } else {
    items = await sampleQuestionBankItems({
      fieldId,
      subjectId: subjectId!,
      count: sampleCount,
    });
  }

  if (items.length > 0 && !(mixed && timedExam)) {
    items = prepareBankItemsForSession({
      fieldId,
      field,
      items,
      limit,
      poolLimit: items.length,
    });
  }

  const resolvedSubjectId = mixed ? MIXED_SUBJECT_ID : subjectId!;

  if (items.length === 0) {
    return NextResponse.json(
      {
        error: "No questions available for this selection.",
        code: "EMPTY_BANK",
        fieldId,
        subjectId: resolvedSubjectId,
      },
      { status: 404 }
    );
  }

  const subjectLabel = mixed
    ? "Assorted topics"
    : getFieldSubject(field, subjectId!)!.label;

  const raw: ExamQuestion[] = items.map((item, i) =>
    bankItemToSessionRaw(fieldId, field, item.subjectId ?? resolvedSubjectId, item, i)
  );

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

  try {
    const finalized = finalizeExamSessionQuestions(rawInputs, limit, { fieldId });
    prepared = finalized.prepared;
    sessionQuality = finalized.quality;
    assertExamSessionReady(sessionQuality, fieldId);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Could not build exam session at the requested length";
    return NextResponse.json(
      {
        error: message,
        code: timedExam ? "EXAM_SESSION_UNAVAILABLE" : "SESSION_UNAVAILABLE",
      },
      { status: 503 }
    );
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
      requestedLimit: limit,
      returned: questions.length,
    },
    req,
  });

  await recordStudyQuestionsServed(
    userId,
    questions.length,
    timedExam ? "timed" : "bank",
    usageCheck.plan
  );

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
          },
        }
      : {}),
  });
  } catch (error) {
    const { respondDbUnavailable } = await import("@/lib/api-db-error");
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[api/questions]", error);
    return NextResponse.json(
      { error: "internal_error", message: "Something went wrong loading questions." },
      { status: 500 }
    );
  }
}

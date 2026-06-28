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

const MIXED_SUBJECT_ID = "__mixed__";
const MAX_BANK_LIMIT = 100;
const MAX_TIMED_LIMIT = 300;

export async function GET(req: Request) {
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

  const presetExamNumberRaw = searchParams.get("presetExamNumber");
  const presetExamNumber =
    (fieldId === "nursing" || fieldId.startsWith("usmle") || fieldId === "npte-pt") &&
    presetExamNumberRaw &&
    Number.isFinite(Number(presetExamNumberRaw))
      ? Math.max(1, Math.min(10, Number(presetExamNumberRaw)))
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
    presetExam: Boolean(presetExamNumber && timedExam),
    fullLengthMock: timedExam && limit >= 50 && !presetExamNumber,
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

  let items: Awaited<ReturnType<typeof sampleQuestionBankItemsForField>>;

  if (presetExamNumber && fieldId === "nursing" && timedExam) {
    const { loadNclexPresetExamItems } = await import("@/lib/exam-prep/nclex/load-preset-exam");
    const preset = await loadNclexPresetExamItems(presetExamNumber);
    if (!preset) {
      return NextResponse.json(
        {
          error: `NCLEX Practice Exam ${presetExamNumber} is not available. Run db:seed-nclex-full-exams first.`,
          code: "PRESET_EXAM_UNAVAILABLE",
        },
        { status: 404 }
      );
    }
    items = preset.items;
  } else if (presetExamNumber && fieldId.startsWith("usmle") && timedExam) {
    const { loadUsmlePresetExamItems } = await import("@/lib/exam-prep/usmle/load-preset-exam");
    const preset = await loadUsmlePresetExamItems(presetExamNumber);
    if (!preset) {
      return NextResponse.json(
        {
          error: `USMLE Practice Exam ${presetExamNumber} is not available yet. Generation may still be in progress.`,
          code: "PRESET_EXAM_UNAVAILABLE",
        },
        { status: 404 }
      );
    }
    items = preset.items;
  } else if (presetExamNumber && fieldId === "npte-pt" && timedExam) {
    const { loadNptePtPresetExamItems } = await import(
      "@/lib/exam-prep/npte-pt/load-preset-exam"
    );
    const preset = await loadNptePtPresetExamItems(presetExamNumber);
    if (!preset) {
      return NextResponse.json(
        {
          error: `NPTE-PT Practice Exam ${presetExamNumber} is not available. Run db:seed-npte-pt-full-exams first.`,
          code: "PRESET_EXAM_UNAVAILABLE",
        },
        { status: 404 }
      );
    }
    items = preset.items;
  } else if (mixed && timedExam) {
    const { gatherTimedExamBankItems } = await import("@/lib/questions/timed-exam-sampling");
    const { timedExamGatePairForField } = await import("@/lib/exam-prep/exam-fill-gates");
    const gates = timedExamGatePairForField(fieldId);

    if (fieldId === "pharmacy") {
      const { prepareNaplexBankItem } = await import("@/lib/exam-prep/naplex-serve-gate");
      items = (
        await gatherTimedExamBankItems({
          fieldId,
          limit,
          filterFn: gates.strict,
          relaxedFilterFn: gates.relaxed,
          initialSampleCount: sampleCount,
        })
      ).map(prepareNaplexBankItem);
    } else {
      items = await gatherTimedExamBankItems({
        fieldId,
        limit,
        filterFn: gates.strict,
        relaxedFilterFn: gates.relaxed,
        initialSampleCount: sampleCount,
      });
    }
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
  } else if (items.length > 0 && mixed && timedExam && !presetExamNumber) {
    items = items.slice(0, limit);
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
    const finalized = finalizeExamSessionQuestions(rawInputs, limit);
    prepared = finalized.prepared;
    sessionQuality = finalized.quality;
    if (!presetExamNumber) {
      assertExamSessionReady(sessionQuality, fieldId);
    } else if (prepared.length !== limit) {
      throw new Error(`Preset exam returned ${prepared.length}/${limit} questions`);
    }
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
}

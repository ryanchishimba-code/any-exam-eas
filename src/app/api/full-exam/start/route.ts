import { NextResponse } from "next/server";
import { createExamInstance } from "@/lib/full-exam/exam-instance";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference, touchExamStudied } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { buildSessionConfig, fullExamSessionHref } from "@/lib/full-exam/config";
import { resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
import { isUsmleFieldId, usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";
import {
  parseRequestedLengthPreset,
  syncSessionConfigQuestionCount,
} from "@/lib/exam/session-count";
import { requirePremiumApi } from "@/lib/api-access";
import { respondDbUnavailable } from "@/lib/api-db-error";
import { assembleTimedExamSessionItems } from "@/lib/exam-prep/compose/assemble-timed-exam-session";
import { preparedTimedExamItemsForClient } from "@/lib/exam-prep/prepare-timed-exam-client-payload";
import { resolveExamBankSampleCount } from "@/lib/questions/finalize-exam-session";
import { recordStudyQuestionsServed } from "@/lib/study/usage-limits";
import {
  isFullExamLaunchMode,
  type FullExamLaunchMode,
} from "@/lib/full-exam/launch-modes";
import { resolveSmartExamSelection } from "@/lib/full-exam/smart-exam-selection";
import { loadBankItemsByIds } from "@/lib/full-exam/load-bank-items-by-ids";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: Request) {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const body = await req.json().catch(() => ({}));
  const examSlug = String(body.examSlug ?? "");
  if (!isExamSlug(examSlug)) {
    return NextResponse.json({ error: "Invalid exam" }, { status: 400 });
  }

  const launchMode: FullExamLaunchMode = isFullExamLaunchMode(body.launchMode)
    ? body.launchMode
    : "new_exam";

  const preset = parseRequestedLengthPreset(body.lengthPreset);
  const timed = body.timed !== false;
  const nclexLength =
    body.nclexLength === "maximum" ? ("maximum" as const) : ("minimum" as const);
  const nclexCat = body.nclexCat === true || body.nclexCat === "1";
  const focusAreasRaw = Array.isArray(body.focusAreas)
    ? body.focusAreas.map(String).filter(Boolean)
    : Array.isArray(body.focus_areas)
      ? body.focus_areas.map(String).filter(Boolean)
      : undefined;

  try {
    const pref = await getUserExamPreference(premium.userId);
    if (!pref) {
      return NextResponse.json({ error: "Select an exam before starting." }, { status: 403 });
    }
    if (pref.examSlug !== examSlug) {
      return NextResponse.json(
        { error: "That exam does not match your selected exam.", code: "EXAM_MISMATCH" },
        { status: 403 }
      );
    }

    let sessionFieldId = EXAM_CATALOG[examSlug].fieldId;
    let sessionTitle = `${EXAM_CATALOG[examSlug].shortName} Full Simulation`;

    const requestedField = body.fieldId ? resolveQuestionBankFieldId(String(body.fieldId)) : null;
    if (examSlug === "usmle") {
      const meta = await getUserEdtechMetadata(premium.userId);
      const resolvedField =
        requestedField && isUsmleFieldId(requestedField)
          ? requestedField
          : meta.usmleFieldId && isUsmleFieldId(meta.usmleFieldId)
            ? meta.usmleFieldId
            : sessionFieldId;
      sessionFieldId = resolvedField;
      const step = usmleStepDefinition(resolvedField);
      sessionTitle = `${step?.name ?? "USMLE"} Full Simulation`;
    } else if (requestedField) {
      sessionFieldId = requestedField;
    }

    const smart = await resolveSmartExamSelection({
      userId: premium.userId,
      examSlug,
      fieldId: sessionFieldId,
      launchMode,
      focusAreas: focusAreasRaw,
    });

    if (smart.resumeSessionId) {
      return NextResponse.json({
        sessionId: smart.resumeSessionId,
        redirectUrl: fullExamSessionHref(examSlug, smart.resumeSessionId),
        resumed: true,
        launchMode,
      });
    }

    const focusAreas = smart.focusAreas.length ? smart.focusAreas : focusAreasRaw;

    const config = buildSessionConfig(examSlug, preset, timed, {
      nclexLength: examSlug === "nclex" ? nclexLength : undefined,
      focusAreas,
      nclexCat: examSlug === "nclex" ? nclexCat : undefined,
      fieldId: sessionFieldId,
    });

    const { checkMockExamStart } = await import("@/lib/study/usage-limits");
    const usageCheck = await checkMockExamStart({
      userId: premium.userId,
      access: premium.access,
      questionCount: config.questionCount,
      lengthPreset: preset,
    });
    if (!usageCheck.ok) return usageCheck.response;

    const limit = usageCheck.allowedCount;
    if (limit !== config.questionCount) {
      return NextResponse.json(
        {
          error: `Your plan allows ${limit} questions per session. Choose ${limit} or fewer, or upgrade for larger sessions.`,
          code: "SESSION_SIZE_CAPPED",
          allowedCount: limit,
        },
        { status: 403 }
      );
    }

    let clientPayload;
    let assembleSource: string | undefined;
    let excludeSeenApplied = false;

    if (smart.retakeQuestionIds?.length) {
      const items = await loadBankItemsByIds(sessionFieldId, smart.retakeQuestionIds);
      if (items.length < Math.min(limit, smart.retakeQuestionIds.length)) {
        return NextResponse.json(
          {
            error: "Could not reload your last exam. Start a new exam instead.",
            code: "RETAKE_UNAVAILABLE",
          },
          { status: 503 }
        );
      }
      const retakeLimit = Math.min(limit, items.length);
      clientPayload = preparedTimedExamItemsForClient(
        sessionFieldId,
        sessionFieldId,
        items,
        retakeLimit
      );
      assembleSource = "retake";
    } else {
      const sampleCount = resolveExamBankSampleCount(sessionFieldId, limit, true);
      const assembled = await assembleTimedExamSessionItems({
        fieldId: sessionFieldId,
        field: sessionFieldId,
        limit,
        focusAreas,
        sampleCount,
        excludeQuestionIds: smart.excludeQuestionIds,
      });

      if (!assembled || assembled.items.length < limit) {
        return NextResponse.json(
          {
            error: `Could not compose a ${limit}-question exam aligned to the board blueprint. Try again shortly.`,
            code: "EXAM_SESSION_UNAVAILABLE",
          },
          { status: 503 }
        );
      }

      clientPayload = preparedTimedExamItemsForClient(
        sessionFieldId,
        sessionFieldId,
        assembled.items,
        limit
      );
      assembleSource = assembled.source;
      excludeSeenApplied = Boolean(assembled.excludeSeenApplied);
    }

    const sessionConfig = syncSessionConfigQuestionCount(
      config,
      examSlug,
      clientPayload.questions.length
    );

    const titleSuffix =
      launchMode === "focus_weak"
        ? " · Weak Areas"
        : launchMode === "retake_last"
          ? " · Retake"
          : launchMode === "continue_learning"
            ? " · Continue"
            : "";

    const sessionId = await createExamInstance(premium.userId, examSlug, {
      questionCount: clientPayload.questions.length,
      timeLimitSec: sessionConfig.timed ? sessionConfig.timeLimitSec : null,
      fieldId: sessionFieldId,
      title: `${sessionTitle}${titleSuffix}`,
      sessionConfig,
      prefetchedQuestionIds: clientPayload.bankItemIds,
      assembleSource,
      launchMode,
      focusAreas,
      excludeSeenApplied,
      retakeOfSessionId: smart.retakeOfSessionId ?? undefined,
    });

    void touchExamStudied(premium.userId);
    void recordStudyQuestionsServed(
      premium.userId,
      clientPayload.questions.length,
      "exam_session",
      usageCheck.plan
    );

    return NextResponse.json({
      sessionId,
      redirectUrl: fullExamSessionHref(examSlug, sessionId),
      config: sessionConfig,
      questions: clientPayload.questions,
      bankItemIds: clientPayload.bankItemIds,
      requested: clientPayload.questions.length,
      launchMode,
    });
  } catch (e) {
    const dbResponse = respondDbUnavailable(e);
    if (dbResponse) return dbResponse;
    const message = e instanceof Error ? e.message : "Could not start exam";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

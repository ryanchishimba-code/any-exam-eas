import { NextResponse } from "next/server";
import { createExamInstance } from "@/lib/full-exam/exam-instance";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import { getUserExamPreference, touchExamStudied } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import {
  buildSessionConfig,
  computeTimeLimitSec,
  fullExamSessionHref,
  resolveStartLengthPreset,
} from "@/lib/full-exam/config";
import { resolveQuestionBankFieldId } from "@/lib/edtech/question-bank-scope";
import { isUsmleFieldId, usmleStepDefinition } from "@/lib/exam-prep/usmle/steps";
import { syncSessionConfigQuestionCount } from "@/lib/exam/session-count";
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
import { loadFullExamSessionQuestionsPayload } from "@/lib/full-exam/load-session-questions";
import { presetFormId, studentPracticeExamTitle } from "@/lib/exam-prep/preset-form-progress";
import {
  serveNamedPresetForm,
  serveNextUnusedPresetForm,
} from "@/lib/exam-prep/serve-preset-form";
import type { ExactPresetForm } from "@/lib/exam-prep/stored-preset-form";
import type { FullExamSessionConfig } from "@/types/full-exam";

function parsePresetExamNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 100) return null;
  return parsed;
}

function fixedFormSessionConfig(
  config: FullExamSessionConfig,
  examSlug: ExamSlug,
  fieldId: string,
  questionCount: number,
  timed: boolean
): FullExamSessionConfig {
  return {
    ...config,
    questionCount,
    timeLimitSec: timed ? computeTimeLimitSec(examSlug, questionCount, true, fieldId) : 0,
    adaptive: false,
    nclexCat: false,
  };
}

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
    } else if (requestedField) {
      sessionFieldId = requestedField;
    }

    const requestedCount = Number(body.questionCount);
    const preset = resolveStartLengthPreset({
      examSlug,
      fieldId: sessionFieldId,
      lengthPreset: typeof body.lengthPreset === "string" ? body.lengthPreset : null,
      questionCount: Number.isFinite(requestedCount) ? requestedCount : null,
    });

    if (examSlug === "usmle") {
      const step = usmleStepDefinition(sessionFieldId);
      sessionTitle =
        preset === "100"
          ? `${step?.shortName ?? "USMLE"} Self-Assessment`
          : preset === "50"
            ? `${step?.shortName ?? "USMLE"} Timed Sprint`
            : `${step?.name ?? "USMLE"} Full Simulation`;
    }

    const smart = await resolveSmartExamSelection({
      userId: premium.userId,
      examSlug,
      fieldId: sessionFieldId,
      launchMode,
      focusAreas: focusAreasRaw,
    });

    if (smart.resumeSessionId) {
      // Prefetch questions into the start response so Continue Learning paints instantly.
      const loaded = await loadFullExamSessionQuestionsPayload(
        premium.userId,
        smart.resumeSessionId
      );
      return NextResponse.json({
        sessionId: smart.resumeSessionId,
        redirectUrl: fullExamSessionHref(examSlug, smart.resumeSessionId),
        resumed: true,
        launchMode,
        ...(loaded.ok
          ? {
              questions: loaded.payload.questions,
              bankItemIds: loaded.payload.bankItemIds,
            }
          : {}),
      });
    }

    const focusAreas = smart.focusAreas.length ? smart.focusAreas : focusAreasRaw;

    const presetRequested = body.presetExamNumber != null && body.presetExamNumber !== "";
    const explicitPreset = presetRequested ? parsePresetExamNumber(body.presetExamNumber) : null;
    if (presetRequested && explicitPreset == null) {
      return NextResponse.json({ error: "Unknown practice exam." }, { status: 400 });
    }

    let namedForm: ExactPresetForm | null = null;
    if (explicitPreset != null) {
      const named = await serveNamedPresetForm({
        userId: premium.userId,
        examSlug,
        fieldId: sessionFieldId,
        examNumber: explicitPreset,
      });
      if (!named) {
        return NextResponse.json(
          { error: "That practice exam is not available.", code: "PRESET_FORM_UNAVAILABLE" },
          { status: 404 }
        );
      }
      if (named.kind === "resume") {
        const loaded = await loadFullExamSessionQuestionsPayload(premium.userId, named.sessionId);
        return NextResponse.json({
          sessionId: named.sessionId,
          redirectUrl: fullExamSessionHref(examSlug, named.sessionId),
          resumed: true,
          launchMode,
          ...(loaded.ok
            ? { questions: loaded.payload.questions, bankItemIds: loaded.payload.bankItemIds }
            : {}),
        });
      }
      namedForm = named.form;
    }

    const config = buildSessionConfig(examSlug, preset, timed, {
      nclexLength: examSlug === "nclex" ? nclexLength : undefined,
      focusAreas,
      nclexCat: examSlug === "nclex" ? nclexCat : undefined,
      fieldId: sessionFieldId,
    });

    let exactForm = namedForm;
    if (
      !exactForm &&
      launchMode === "new_exam" &&
      !focusAreasRaw?.length
    ) {
      exactForm = await serveNextUnusedPresetForm({
        userId: premium.userId,
        examSlug,
        fieldId: sessionFieldId,
        simulationLength: config.questionCount,
      });
    }

    let sessionConfig = exactForm
      ? fixedFormSessionConfig(config, examSlug, sessionFieldId, exactForm.questionCount, timed)
      : config;

    const { checkMockExamStart } = await import("@/lib/study/usage-limits");
    const usageCheck = await checkMockExamStart({
      userId: premium.userId,
      access: premium.access,
      questionCount: sessionConfig.questionCount,
      lengthPreset: preset,
    });
    if (!usageCheck.ok) return usageCheck.response;

    const limit = usageCheck.allowedCount;
    if (limit !== sessionConfig.questionCount) {
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

    if (exactForm) {
      try {
        clientPayload = preparedTimedExamItemsForClient(
          sessionFieldId,
          sessionFieldId,
          exactForm.items,
          exactForm.questionCount
        );
        assembleSource = "preset";
      } catch (error) {
        if (explicitPreset != null) throw error;
        exactForm = null;
        sessionConfig = config;
      }
    }
    if (!clientPayload && smart.retakeQuestionIds?.length) {
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
    } else if (!clientPayload) {
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

    const servedCount = Math.min(clientPayload.questions.length, sessionConfig.questionCount);
    const servedQuestions = clientPayload.questions.slice(0, servedCount);
    const servedBankItemIds = clientPayload.bankItemIds.slice(0, servedCount);
    const storedConfig = syncSessionConfigQuestionCount(
      sessionConfig,
      examSlug,
      servedQuestions.length,
      sessionFieldId
    );

    const titleSuffix =
      launchMode === "focus_weak"
        ? " · Weak Areas"
        : launchMode === "retake_last"
          ? " · Retake"
          : launchMode === "continue_learning"
            ? " · Continue"
            : "";
    const boardLabel =
      examSlug === "usmle"
        ? usmleStepDefinition(sessionFieldId)?.shortName ?? EXAM_CATALOG.usmle.shortName
        : EXAM_CATALOG[examSlug].shortName;
    const title =
      exactForm && explicitPreset != null
        ? studentPracticeExamTitle(exactForm.title, exactForm.examNumber, boardLabel)
        : `${sessionTitle}${titleSuffix}`;

    const sessionId = await createExamInstance(premium.userId, examSlug, {
      questionCount: servedQuestions.length,
      timeLimitSec: storedConfig.timed ? storedConfig.timeLimitSec : null,
      fieldId: sessionFieldId,
      title,
      sessionConfig: storedConfig,
      prefetchedQuestionIds: servedBankItemIds,
      assembleSource,
      launchMode,
      focusAreas,
      excludeSeenApplied,
      retakeOfSessionId: smart.retakeOfSessionId ?? undefined,
      ...(exactForm
        ? {
            presetFormId: presetFormId(examSlug, exactForm.examNumber),
            presetExamNumber: exactForm.examNumber,
          }
        : {}),
    });

    void touchExamStudied(premium.userId);
    void recordStudyQuestionsServed(
      premium.userId,
      servedQuestions.length,
      "exam_session",
      usageCheck.plan
    );

    return NextResponse.json({
      sessionId,
      redirectUrl: fullExamSessionHref(examSlug, sessionId),
      config: storedConfig,
      questions: servedQuestions,
      bankItemIds: servedBankItemIds,
      requested: servedQuestions.length,
      launchMode,
    });
  } catch (e) {
    const dbResponse = respondDbUnavailable(e);
    if (dbResponse) return dbResponse;
    const message = e instanceof Error ? e.message : "Could not start exam";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

import { NextResponse } from "next/server";
import { presentClinicalUnits, takeSessionUnits } from "@/lib/assessment/serve";
import {
  caseAttemptStamps,
  clinicalPoolCount,
  loadPublishedClinicalBank,
  scoredItemCount,
} from "@/lib/assessment/serve-db";
import type { ClinicalSessionPayload } from "@/lib/assessment/clinical-session";
import type { UserAccess } from "@/lib/access-control";
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

export async function tryClinicalSessionResponse(params: {
  field: string;
  fieldId: string;
  subjectId: string;
  format: "ngn" | "case";
  limit: number;
  userId: string;
  access: UserAccess;
  req: Request;
}): Promise<NextResponse | null> {
  const bank = await loadPublishedClinicalBank(params.fieldId);
  const available = clinicalPoolCount(bank.catalog, params.format, params.subjectId);
  if (available === 0) return null;
  if (available < params.limit) {
    return NextResponse.json(
      {
        error: "Choose a shorter set. Published items are served in full cases or as individual items.",
        code: "SESSION_UNAVAILABLE",
        practiceFormat: params.format,
      },
      { status: 400 }
    );
  }

  let caseLastAttemptedAt: Map<string, number> | null = null;
  if (params.format === "case") {
    try {
      caseLastAttemptedAt = await caseAttemptStamps(params.userId, bank.catalog);
    } catch (error) {
      console.warn(
        "[clinical-session] case attempt history unavailable",
        error instanceof Error ? error.message : error
      );
    }
  }

  const selected = takeSessionUnits({
    catalog: bank.catalog,
    format: params.format,
    subjectId: params.subjectId,
    limit: params.limit,
    seed: `${params.userId}:${params.format}:${params.subjectId}:${crypto.randomUUID()}`,
    caseLastAttemptedAt,
  });
  if (selected.length !== params.limit) return null;
  const presented = presentClinicalUnits(selected, bank.caseReferences);
  const units = presented.units;

  const scored = scoredItemCount(units);
  const { checkStudyQuestionUsage, recordStudyQuestionsServed } = await import("@/lib/study/usage-limits");
  const usage = await checkStudyQuestionUsage({
    userId: params.userId,
    access: params.access,
    requestedCount: scored,
  });
  if (!usage.ok) return usage.response;

  const payload: ClinicalSessionPayload = {
    practiceFormat: params.format,
    field: params.field,
    fieldId: params.fieldId,
    subjectId: params.subjectId,
    sourcesById: bank.sourcesById,
    caseReferences: presented.caseReferences,
    units,
  };

  trackEvent({
    userId: params.userId,
    eventType: EVENT_TYPES.QUESTION_BANK_FETCH,
    category: "education",
    metadata: {
      field: params.field,
      fieldId: params.fieldId,
      subjectId: params.subjectId,
      requestedLimit: params.limit,
      returned: units.length,
      scoredItems: scored,
      practiceFormat: params.format,
      clinical: true,
    },
    req: params.req,
  });

  await recordStudyQuestionsServed(params.userId, scored, "bank", usage.plan);

  return NextResponse.json({
    field: params.field,
    fieldId: params.fieldId,
    subjectId: params.subjectId,
    mixed: params.subjectId === "__mixed__",
    timedExam: false,
    questions: [],
    requested: params.limit,
    practiceFormat: params.format,
    clinicalSession: payload,
    bankItemIds: [],
  });
}

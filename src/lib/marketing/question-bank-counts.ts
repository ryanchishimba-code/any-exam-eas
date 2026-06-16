import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { EXAM_FIELD_IDS, type ExamFieldId } from "@/lib/subjects/field-ids";
import {
  TOTAL_QUESTION_BANK_TARGET,
  formatMarketingQuestionCount,
  targetQuestionCountForField,
} from "./bank-stats";

const REVALIDATE_SECONDS = 3600;

export type FieldQuestionBankCounts = {
  fieldId: ExamFieldId;
  total: number;
  active: number;
  served: number;
};

export type QuestionBankCountsSnapshot = {
  fields: Record<ExamFieldId, FieldQuestionBankCounts>;
  totals: { total: number; active: number; served: number };
  updatedAt: string;
  degraded: boolean;
};

export type LandingExamCountDisplay = {
  label: string;
  /** Compact marketing label, e.g. 24K+ */
  countLabel: string;
  /** Hero display, e.g. 24,532 questions or 24K+ questions */
  questionsLabel: string;
  color: string;
};

export type LandingBankCountsDisplay = {
  totalLabel: string;
  totalQuestionsLabel: string;
  exams: LandingExamCountDisplay[];
  degraded: boolean;
};

/** Homepage exam strip order — matches LANDING_HERO_EXAMS labels. */
const LANDING_EXAM_COUNT_FIELDS: {
  fieldId: ExamFieldId;
  label: string;
  color: string;
}[] = [
  { fieldId: "usmle-step-2", label: "USMLE", color: EXAM_ACCENTS.usmle },
  { fieldId: "nursing", label: "NCLEX", color: EXAM_ACCENTS.nclex },
  { fieldId: "pharmacy", label: "NAPLEX", color: EXAM_ACCENTS.naplex },
  { fieldId: "pance", label: "PANCE", color: EXAM_ACCENTS.pance },
  { fieldId: "aanp-fnp", label: "AANP FNP", color: EXAM_ACCENTS.aanpFnp },
  { fieldId: "npte-pt", label: "NPTE-PT", color: EXAM_ACCENTS.nptePt },
];

function emptyFieldCounts(fieldId: ExamFieldId): FieldQuestionBankCounts {
  return { fieldId, total: 0, active: 0, served: 0 };
}

function buildEmptySnapshot(degraded: boolean): QuestionBankCountsSnapshot {
  const fields = Object.fromEntries(
    EXAM_FIELD_IDS.map((fieldId) => [fieldId, emptyFieldCounts(fieldId)])
  ) as Record<ExamFieldId, FieldQuestionBankCounts>;

  return {
    fields,
    totals: { total: 0, active: 0, served: 0 },
    updatedAt: new Date().toISOString(),
    degraded,
  };
}

async function fetchQuestionBankCountsFromDb(): Promise<QuestionBankCountsSnapshot> {
  const [totalRows, activeRows, servedRows] = await Promise.all([
    prisma.questionBankItem.groupBy({
      by: ["fieldId"],
      _count: { _all: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["fieldId"],
      where: { active: true },
      _count: { _all: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["fieldId"],
      where: { active: true, qaPassed: true },
      _count: { _all: true },
    }),
  ]);

  const totalByField = new Map(totalRows.map((r) => [r.fieldId, r._count._all]));
  const activeByField = new Map(activeRows.map((r) => [r.fieldId, r._count._all]));
  const servedByField = new Map(servedRows.map((r) => [r.fieldId, r._count._all]));

  const fields = Object.fromEntries(
    EXAM_FIELD_IDS.map((fieldId) => [
      fieldId,
      {
        fieldId,
        total: totalByField.get(fieldId) ?? 0,
        active: activeByField.get(fieldId) ?? 0,
        served: servedByField.get(fieldId) ?? 0,
      },
    ])
  ) as Record<ExamFieldId, FieldQuestionBankCounts>;

  const totals = EXAM_FIELD_IDS.reduce(
    (acc, fieldId) => ({
      total: acc.total + fields[fieldId].total,
      active: acc.active + fields[fieldId].active,
      served: acc.served + fields[fieldId].served,
    }),
    { total: 0, active: 0, served: 0 }
  );

  return {
    fields,
    totals,
    updatedAt: new Date().toISOString(),
    degraded: false,
  };
}

const getCachedQuestionBankCounts = unstable_cache(
  fetchQuestionBankCountsFromDb,
  ["marketing-question-bank-counts"],
  { revalidate: REVALIDATE_SECONDS }
);

/** Live question bank counts grouped by exam field — cached for landing pages. */
export async function getQuestionBankCounts(): Promise<QuestionBankCountsSnapshot> {
  try {
    return await getCachedQuestionBankCounts();
  } catch (error) {
    console.error("[marketing/question-bank-counts] lookup failed:", error);
    return buildEmptySnapshot(true);
  }
}

export function displayQuestionCountForField(
  fieldId: ExamFieldId,
  snapshot: QuestionBankCountsSnapshot
): string {
  const served = snapshot.fields[fieldId]?.served ?? 0;
  if (served > 0) return formatMarketingQuestionCount(served);
  return formatMarketingQuestionCount(targetQuestionCountForField(fieldId));
}

export function displayTotalQuestionCount(snapshot: QuestionBankCountsSnapshot): string {
  const served = snapshot.totals.served;
  if (served > 0) return formatMarketingQuestionCount(served);
  return formatMarketingQuestionCount(TOTAL_QUESTION_BANK_TARGET);
}

function formatHeroQuestionsLabel(count: number, compactFallback: string): string {
  if (count > 0) return `${count.toLocaleString("en-US")} questions`;
  return `${compactFallback} questions`;
}

export function displayQuestionCountDetailForField(
  fieldId: ExamFieldId,
  snapshot: QuestionBankCountsSnapshot
): string {
  const served = snapshot.fields[fieldId]?.served ?? 0;
  const compact = displayQuestionCountForField(fieldId, snapshot);
  return formatHeroQuestionsLabel(served, compact);
}

export function displayTotalQuestionsDetail(snapshot: QuestionBankCountsSnapshot): string {
  const served = snapshot.totals.served;
  const compact = displayTotalQuestionCount(snapshot);
  return formatHeroQuestionsLabel(served, compact);
}

export function buildLandingBankCountsDisplay(
  snapshot: QuestionBankCountsSnapshot
): LandingBankCountsDisplay {
  return {
    totalLabel: displayTotalQuestionCount(snapshot),
    totalQuestionsLabel: displayTotalQuestionsDetail(snapshot),
    exams: LANDING_EXAM_COUNT_FIELDS.map(({ fieldId, label, color }) => ({
      label,
      color,
      countLabel: displayQuestionCountForField(fieldId, snapshot),
      questionsLabel: displayQuestionCountDetailForField(fieldId, snapshot),
    })),
    degraded: snapshot.degraded,
  };
}

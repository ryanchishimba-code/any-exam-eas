import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { EXAM_FIELD_IDS, type ExamFieldId } from "@/lib/subjects/field-ids";
import { USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";
import {
  formatExactServeReadyCount,
  formatExactServeReadyQuestions,
  publishedQuestionCountForField,
} from "./bank-stats";

const DB_RETRY_ATTEMPTS = 2;

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
  /** Stable exam id matching LANDING_EXAMS ids (usmle, nclex, …) for reliable mapping. */
  slug: string;
  label: string;
  /** Exact serve-ready count, e.g. 6,380 */
  countLabel: string;
  /** Hero display, e.g. 6,380 serve-ready questions */
  questionsLabel: string;
  /** Raw serve-ready count from DB (0 when degraded / unknown). */
  served: number;
  color: string;
};

export type LandingBankCountsDisplay = {
  totalLabel: string;
  totalQuestionsLabel: string;
  /** Sum of serve-ready rows across the six board exams. */
  totalServed: number;
  exams: LandingExamCountDisplay[];
  degraded: boolean;
};

/** Homepage exam strip order — matches LANDING_HERO_EXAMS labels. */
const LANDING_EXAM_COUNT_FIELDS: {
  slug: string;
  fieldId: ExamFieldId;
  label: string;
  color: string;
}[] = [
  { slug: "usmle", fieldId: "usmle-step-2", label: "USMLE (Step 1·2·3)", color: EXAM_ACCENTS.usmle },
  { slug: "nclex", fieldId: "nursing", label: "NCLEX", color: EXAM_ACCENTS.nclex },
  { slug: "naplex", fieldId: "pharmacy", label: "NAPLEX", color: EXAM_ACCENTS.naplex },
  { slug: "pance", fieldId: "pance", label: "PANCE", color: EXAM_ACCENTS.pance },
  { slug: "aanp-fnp", fieldId: "aanp-fnp", label: "AANP FNP", color: EXAM_ACCENTS.aanpFnp },
  { slug: "npte-pt", fieldId: "npte-pt", label: "NPTE-PT", color: EXAM_ACCENTS.nptePt },
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

  const sumRows = (rows: typeof totalRows) =>
    rows.reduce((acc, row) => acc + row._count._all, 0);

  const usmleTotals = USMLE_FIELD_IDS.reduce(
    (acc, stepId) => ({
      total: acc.total + (totalByField.get(stepId) ?? 0),
      active: acc.active + (activeByField.get(stepId) ?? 0),
      served: acc.served + (servedByField.get(stepId) ?? 0),
    }),
    { total: 0, active: 0, served: 0 }
  );

  const fields = Object.fromEntries(
    EXAM_FIELD_IDS.map((fieldId) => {
      if (fieldId === "usmle-step-2") {
        return [
          fieldId,
          {
            fieldId,
            total: usmleTotals.total,
            active: usmleTotals.active,
            served: usmleTotals.served,
          },
        ];
      }
      return [
        fieldId,
        {
          fieldId,
          total: totalByField.get(fieldId) ?? 0,
          active: activeByField.get(fieldId) ?? 0,
          served: servedByField.get(fieldId) ?? 0,
        },
      ];
    })
  ) as Record<ExamFieldId, FieldQuestionBankCounts>;

  const totals = {
    total: sumRows(totalRows),
    active: sumRows(activeRows),
    served: sumRows(servedRows),
  };

  return {
    fields,
    totals,
    updatedAt: new Date().toISOString(),
    degraded: false,
  };
}

async function fetchQuestionBankCountsWithRetry(): Promise<QuestionBankCountsSnapshot> {
  let lastError: unknown;
  for (let attempt = 0; attempt < DB_RETRY_ATTEMPTS; attempt++) {
    try {
      return await fetchQuestionBankCountsFromDb();
    } catch (error) {
      lastError = error;
      if (attempt + 1 < DB_RETRY_ATTEMPTS) {
        await new Promise((r) => setTimeout(r, 250 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

/** Live question bank counts grouped by exam field — always fetched at request time. */
export async function getQuestionBankCounts(): Promise<QuestionBankCountsSnapshot> {
  noStore();
  try {
    return await fetchQuestionBankCountsWithRetry();
  } catch (error) {
    console.error("[marketing/question-bank-counts] lookup failed:", error);
    return buildEmptySnapshot(true);
  }
}

/**
 * Sum of qaPassed active rows for the six homepage board exams.
 * USMLE is aggregated on `usmle-step-2` in the snapshot.
 */
export function landingServedTotal(snapshot: QuestionBankCountsSnapshot): number {
  return EXAM_FIELD_IDS.reduce(
    (sum, fieldId) => sum + (snapshot.fields[fieldId]?.served ?? 0),
    0
  );
}

function servedCountForField(
  fieldId: ExamFieldId,
  snapshot?: QuestionBankCountsSnapshot
): number {
  if (!snapshot || snapshot.degraded) return 0;
  return snapshot.fields[fieldId]?.served ?? 0;
}

/**
 * User-facing counts reflect the live qaPassed serve bank when the DB lookup
 * succeeds; otherwise fall back to conservative published floor figures.
 */
export function displayQuestionCountForField(
  fieldId: ExamFieldId,
  snapshot?: QuestionBankCountsSnapshot
): string {
  const served = servedCountForField(fieldId, snapshot);
  if (served > 0) return formatExactServeReadyCount(served);
  return formatExactServeReadyCount(publishedQuestionCountForField(fieldId));
}

export function displayTotalQuestionCount(
  snapshot?: QuestionBankCountsSnapshot
): string {
  if (snapshot && !snapshot.degraded) {
    const total = landingServedTotal(snapshot);
    if (total > 0) return formatExactServeReadyCount(total);
  }
  return formatExactServeReadyCount(
    EXAM_FIELD_IDS.reduce((sum, fieldId) => sum + publishedQuestionCountForField(fieldId), 0)
  );
}

export function displayQuestionCountDetailForField(
  fieldId: ExamFieldId,
  snapshot?: QuestionBankCountsSnapshot
): string {
  const served = servedCountForField(fieldId, snapshot);
  if (served > 0) return formatExactServeReadyQuestions(served);
  return formatExactServeReadyQuestions(publishedQuestionCountForField(fieldId));
}

export function displayTotalQuestionsDetail(
  snapshot?: QuestionBankCountsSnapshot
): string {
  if (snapshot && !snapshot.degraded) {
    const total = landingServedTotal(snapshot);
    if (total > 0) return formatExactServeReadyQuestions(total);
  }
  const fallback = EXAM_FIELD_IDS.reduce(
    (sum, fieldId) => sum + publishedQuestionCountForField(fieldId),
    0
  );
  return formatExactServeReadyQuestions(fallback);
}

/** Social proof band on the landing compare section — uses live totals when available. */
export function buildLandingSocialProofStats(
  bankCounts: LandingBankCountsDisplay
): Array<{ value: string; label: string; detail: string }> {
  return [
    {
      value: bankCounts.totalLabel,
      label: "Serve-ready questions",
      detail: bankCounts.degraded
        ? "QA-gated vignettes across six licensing exams"
        : `${bankCounts.totalQuestionsLabel} in the live bank`,
    },
    {
      value: "6",
      label: "Board exams",
      detail: "One subscription — no per-exam stacking",
    },
    {
      value: "Pro",
      label: "One plan",
      detail: "Everything for all 6 boards",
    },
    {
      value: "Roadmap",
      label: "Per-exam study plan",
      detail: "Blueprint-aligned — integrated, not QBank-only",
    },
  ];
}

export function buildLandingBankCountsDisplay(
  snapshot: QuestionBankCountsSnapshot
): LandingBankCountsDisplay {
  const totalServed =
    snapshot.degraded ? 0 : landingServedTotal(snapshot);

  return {
    totalLabel: displayTotalQuestionCount(snapshot),
    totalQuestionsLabel: displayTotalQuestionsDetail(snapshot),
    totalServed,
    exams: LANDING_EXAM_COUNT_FIELDS.map(({ slug, fieldId, label, color }) => ({
      slug,
      label,
      color,
      served: servedCountForField(fieldId, snapshot),
      countLabel: displayQuestionCountForField(fieldId, snapshot),
      questionsLabel: displayQuestionCountDetailForField(fieldId, snapshot),
    })),
    degraded: snapshot.degraded,
  };
}

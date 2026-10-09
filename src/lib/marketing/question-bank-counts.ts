import { unstable_cache, unstable_noStore as noStore } from "next/cache";
import { connection } from "next/server";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { sqlQuery } from "@/lib/db";
import { prisma } from "@/lib/prisma";
import { EXAM_ACCENTS } from "@/lib/landing/tokens";
import { EXAM_FIELD_IDS, type ExamFieldId } from "@/lib/subjects/field-ids";
import { USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";
import {
  ACTIVE_INVENTORY_CACHE_KEY,
  ACTIVE_INVENTORY_CACHE_TAG,
  ACTIVE_INVENTORY_CACHE_TTL_SECONDS,
  ACTIVE_INVENTORY_STAMP_CACHE_KEY,
  ACTIVE_INVENTORY_STAMP_TTL_SECONDS,
} from "@/lib/inventory/active-inventory-cache";
import { readActiveInventoryStampKey } from "@/lib/inventory/active-inventory-stamp";
import {
  fetchActiveInventoryFromDb,
  type ActiveQuestionInventory,
} from "@/lib/inventory/active-questions";
import type { ExamRouteSlug } from "@/lib/routes";
import {
  boardQuestionUnits,
  COUNT_BOARD_SLUGS,
  formatBoardQuestionSentence,
  formatExactQuestionCount,
  formatRoundedDownQuestionCount,
  loadClinicalExtrasByBoard,
  scoredQuestionCount,
  siteQuestionCounts,
  type BoardQuestionUnits,
  type ClinicalQuestionExtra,
  type CountBoardSlug,
} from "@/lib/counts";
import { formatExactServeReadyQuestions } from "./bank-stats";

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
  /** Scored-item units. Absent on older fixtures; display then uses `served`. */
  boards?: Partial<Record<CountBoardSlug, BoardQuestionUnits>>;
  updatedAt: string;
  degraded: boolean;
};

export type LandingExamCountDisplay = {
  /** Stable exam id matching LANDING_EXAMS ids (usmle, nclex, …) for reliable mapping. */
  slug: string;
  label: string;
  /** Exact scored-item count, e.g. 5,495. Empty when the live lookup failed. */
  countLabel: string;
  /** Hero display. Includes case-study items when this board has a separate NGN catalog. */
  questionsLabel: string;
  /** Full scored-item sentence, e.g. "5,495 questions, including …". */
  sentence: string;
  /** Floored to the nearest hundred. Never rounds up. */
  roundedDown: string;
  /** Raw scored-item count from DB (0 when degraded / unknown). */
  served: number;
  color: string;
};

export type LandingBankCountsDisplay = {
  totalLabel: string;
  totalQuestionsLabel: string;
  /** Honest site sentence, including case-study items when any board has them. */
  sentence: string;
  /** Floored site total. Empty when the live lookup failed. */
  roundedDown: string;
  /** Sum of scored items across the six board exams. */
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
    sqlQuery(
      `
      SELECT "fieldId", COUNT(*)::int AS count
      FROM "QuestionBankItem"
      WHERE active = true
        AND "qaPassed" = true
        AND NOT ("fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3')
        ${studentEligibleAndSql()}
      GROUP BY "fieldId"
      `,
      []
    ) as Promise<Array<{ fieldId: string; count: number }>>,
  ]);

  const totalByField = new Map(totalRows.map((r) => [r.fieldId, r._count._all]));
  const activeByField = new Map(activeRows.map((r) => [r.fieldId, r._count._all]));
  const servedByField = new Map(servedRows.map((r) => [r.fieldId, Number(r.count)]));

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
    served: servedRows.reduce((acc, row) => acc + Number(row.count), 0),
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

export type BankStatsBundle = {
  snapshot: QuestionBankCountsSnapshot;
  inventory: ActiveQuestionInventory;
};

/**
 * Prefer the active-question inventory so marketing totals match the Qbank.
 * The older grouped count remains only when that inventory lookup is degraded.
 */
async function loadBankStatsBundle(): Promise<BankStatsBundle> {
  const inventory = await fetchActiveInventoryFromDb();
  if (!inventory.degraded) {
    let clinical: Partial<Record<CountBoardSlug, ClinicalQuestionExtra>> = {};
    try {
      clinical = await loadClinicalExtrasByBoard();
    } catch (error) {
      console.error("[marketing/question-bank-counts] clinical catalog failed:", error);
      return { inventory, snapshot: buildEmptySnapshot(true) };
    }
    return { inventory, snapshot: snapshotFromActiveInventory(inventory, clinical) };
  }
  try {
    return { inventory, snapshot: await fetchQuestionBankCountsWithRetry() };
  } catch (error) {
    console.error("[marketing/question-bank-counts] lookup failed:", error);
    return { inventory, snapshot: buildEmptySnapshot(true) };
  }
}

/** Live question bank counts grouped by exam field — always fetched at request time. */
export async function getQuestionBankCounts(): Promise<QuestionBankCountsSnapshot> {
  noStore();
  return (await loadBankStatsBundle()).snapshot;
}

const DEGRADED_INVENTORY_ERROR = "active inventory lookup degraded";
const STAMP_UNAVAILABLE = "active inventory stamp unavailable";

export type BankStatsCacheOptions = {
  /**
   * When false, skip `connection()` so an ISR route can stay static.
   * Dynamic callers keep the default and still share the stamp cache.
   */
  dynamic?: boolean;
};

/**
 * Opt the caller into dynamic rendering without skipping `unstable_cache`.
 * Outside a request (unit tests, scripts) this is a no-op.
 */
async function renderInventoryOnEachRequest(): Promise<void> {
  try {
    await connection();
  } catch {
    /* no request scope */
  }
}

/**
 * One published stamp for every count surface. A failed lookup is not cached.
 * Concurrent callers on this isolate share one stamp read.
 */
let stampInflight: Promise<string | null> | null = null;

async function readPublishedInventoryStampKey(): Promise<string | null> {
  try {
    return await unstable_cache(
      async () => {
        const key = await readActiveInventoryStampKey();
        if (!key) throw new Error(STAMP_UNAVAILABLE);
        return key;
      },
      [...ACTIVE_INVENTORY_STAMP_CACHE_KEY],
      {
        revalidate: ACTIVE_INVENTORY_STAMP_TTL_SECONDS,
        tags: [ACTIVE_INVENTORY_CACHE_TAG],
      }
    )();
  } catch (error) {
    if (!(error instanceof Error) || error.message !== STAMP_UNAVAILABLE) {
      console.error("[inventory] stamp cache failed; reading the stamp directly:", error);
    }
    return null;
  }
}

export async function getPublishedInventoryStampKey(): Promise<string | null> {
  if (stampInflight) return stampInflight;
  const pending = readPublishedInventoryStampKey().finally(() => {
    if (stampInflight === pending) stampInflight = null;
  });
  stampInflight = pending;
  return pending;
}

/** Concurrent direct reads share one group-by. */
let directStatsInflight: Promise<BankStatsBundle> | null = null;

function loadBankStatsDirect(): Promise<BankStatsBundle> {
  if (directStatsInflight) return directStatsInflight;
  const pending = loadBankStatsBundle().finally(() => {
    if (directStatsInflight === pending) directStatsInflight = null;
  });
  directStatsInflight = pending;
  return pending;
}

async function loadFreshBankStatsBundle(): Promise<BankStatsBundle> {
  const bundle = await loadBankStatsBundle();
  if (bundle.inventory.degraded || bundle.snapshot.degraded) {
    throw new Error(DEGRADED_INVENTORY_ERROR);
  }
  return bundle;
}

function isDegradedInventoryError(error: unknown): boolean {
  return error instanceof Error && error.message === DEGRADED_INVENTORY_ERROR;
}

/**
 * Cached inventory + marketing snapshot.
 *
 * Callers share a 5-minute published stamp, then load the heavy snapshot
 * under that stamp. A purge of `question-bank-counts` drops both immediately.
 * If the purge is skipped, the stamp expires within 5 minutes and the next
 * read rebuilds. A failed stamp lookup is not cached.
 */
export async function getCachedBankStatsBundle(
  options?: BankStatsCacheOptions
): Promise<BankStatsBundle> {
  if (options?.dynamic !== false) {
    await renderInventoryOnEachRequest();
  }

  const stampKey = await getPublishedInventoryStampKey();
  if (!stampKey) return loadBankStatsDirect();

  try {
    return await unstable_cache(loadFreshBankStatsBundle, [...ACTIVE_INVENTORY_CACHE_KEY, stampKey], {
      revalidate: ACTIVE_INVENTORY_CACHE_TTL_SECONDS,
      tags: [ACTIVE_INVENTORY_CACHE_TAG],
    })();
  } catch (error) {
    if (!isDegradedInventoryError(error)) {
      console.error("[inventory] cached snapshot failed; reading the bank directly:", error);
    }
    return loadBankStatsDirect();
  }
}

/** Cached counts for marketing pages. The shared stamp, not the hour TTL, drops a retired total. */
export async function getCachedQuestionBankCounts(
  options?: BankStatsCacheOptions
): Promise<QuestionBankCountsSnapshot> {
  return (await getCachedBankStatsBundle(options)).snapshot;
}

/** Same cached bundle the marketing hubs and the Qbank topic totals are built from. */
export async function getCachedActiveInventory(
  options?: BankStatsCacheOptions
): Promise<ActiveQuestionInventory> {
  return (await getCachedBankStatsBundle(options)).inventory;
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

/**
 * Marketing field → board. USMLE's public total is all three steps, stored on
 * the `usmle-step-2` snapshot slot so the six-board sum stays one row per exam.
 * The Qbank reads per-step totals from the inventory, not this slot.
 */
const MARKETING_FIELD_BOARD: Record<ExamFieldId, ExamRouteSlug> = {
  nursing: "nclex",
  "usmle-step-2": "usmle",
  pharmacy: "naplex",
  pance: "pance",
  "aanp-fnp": "aanp-fnp",
  "npte-pt": "npte-pt",
};

export function snapshotFromActiveInventory(
  inventory: ActiveQuestionInventory,
  clinical: Partial<Record<CountBoardSlug, ClinicalQuestionExtra>> = {}
): QuestionBankCountsSnapshot {
  const boards = Object.fromEntries(
    (Object.keys(MARKETING_FIELD_BOARD) as ExamFieldId[]).map((fieldId) => {
      const slug = MARKETING_FIELD_BOARD[fieldId];
      const board = inventory.boards[slug];
      return [
        slug,
        boardQuestionUnits({
          slug,
          bankItems: inventory.degraded ? 0 : (board?.active ?? 0),
          formats: board?.formats,
          clinical: clinical[slug],
        }),
      ];
    })
  ) as Record<CountBoardSlug, BoardQuestionUnits>;

  const fields = Object.fromEntries(
    EXAM_FIELD_IDS.map((fieldId) => {
      const units = boards[MARKETING_FIELD_BOARD[fieldId]];
      const served = inventory.degraded || !units ? 0 : scoredQuestionCount(units);
      return [fieldId, { fieldId, total: served, active: served, served }];
    })
  ) as Record<ExamFieldId, FieldQuestionBankCounts>;

  const snapshot: QuestionBankCountsSnapshot = {
    fields,
    boards,
    totals: { total: 0, active: 0, served: 0 },
    updatedAt: inventory.updatedAt,
    degraded: inventory.degraded,
  };
  const served = inventory.degraded ? 0 : landingServedTotal(snapshot);
  snapshot.totals = { total: served, active: served, served };
  return snapshot;
}

function servedCountForField(
  fieldId: ExamFieldId,
  snapshot?: QuestionBankCountsSnapshot
): number {
  if (!snapshot || snapshot.degraded) return 0;
  return snapshot.fields[fieldId]?.served ?? 0;
}

/**
 * User-facing counts are the live scored-item total.
 * A failed lookup returns an empty string so the page omits the number.
 */
export function displayQuestionCountForField(
  fieldId: ExamFieldId,
  snapshot?: QuestionBankCountsSnapshot
): string {
  const served = servedCountForField(fieldId, snapshot);
  if (served > 0) return formatExactQuestionCount(served);
  return "";
}

export function displayTotalQuestionCount(
  snapshot?: QuestionBankCountsSnapshot
): string {
  if (snapshot && !snapshot.degraded) {
    const total = landingServedTotal(snapshot);
    if (total > 0) return formatExactQuestionCount(total);
  }
  return "";
}

export function displayQuestionCountDetailForField(
  fieldId: ExamFieldId,
  snapshot?: QuestionBankCountsSnapshot
): string {
  const served = servedCountForField(fieldId, snapshot);
  if (served > 0) return formatExactServeReadyQuestions(served);
  return "";
}

function completeBoardUnits(
  snapshot: QuestionBankCountsSnapshot
): Record<CountBoardSlug, BoardQuestionUnits> | null {
  if (!snapshot.boards) return null;
  const boards = {} as Record<CountBoardSlug, BoardQuestionUnits>;
  for (const slug of COUNT_BOARD_SLUGS) {
    const units = snapshot.boards[slug];
    if (!units) return null;
    boards[slug] = units;
  }
  return boards;
}

export function displayTotalQuestionsDetail(
  snapshot?: QuestionBankCountsSnapshot
): string {
  if (!snapshot || snapshot.degraded) return "";
  const boards = completeBoardUnits(snapshot);
  if (boards) {
    const site = siteQuestionCounts(boards);
    if (site.totalQuestions > 0) return site.sentence;
  }
  const total = landingServedTotal(snapshot);
  if (total > 0) return formatExactServeReadyQuestions(total);
  return "";
}

/** Social proof band on the landing compare section — uses live totals when available. */
export function buildLandingSocialProofStats(
  bankCounts: LandingBankCountsDisplay
): Array<{ value: string; label: string; detail: string }> {
  return [
    {
      value: bankCounts.totalLabel,
      label: "Active questions",
      detail: bankCounts.degraded
        ? "Live bank count is unavailable, so this page does not show a number"
        : "One scored item each — the same count as the Qbank",
    },
    {
      value: "6",
      label: "Board exams",
      detail: "One subscription across six boards",
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

  const boards = completeBoardUnits(snapshot);
  const site = boards && !snapshot.degraded ? siteQuestionCounts(boards) : null;

  return {
    totalLabel: displayTotalQuestionCount(snapshot),
    totalQuestionsLabel: displayTotalQuestionsDetail(snapshot),
    sentence: site?.sentence ?? displayTotalQuestionsDetail(snapshot),
    roundedDown: site ? site.roundedDown : "",
    totalServed,
    exams: LANDING_EXAM_COUNT_FIELDS.map(({ slug, fieldId, label, color }) => {
      const units = snapshot.boards?.[slug as CountBoardSlug];
      const served = servedCountForField(fieldId, snapshot);
      const sentence = units && served > 0 ? formatBoardQuestionSentence(units) : "";
      return {
        slug,
        label,
        color,
        served,
        countLabel: displayQuestionCountForField(fieldId, snapshot),
        questionsLabel: sentence || displayQuestionCountDetailForField(fieldId, snapshot),
        sentence,
        roundedDown: served > 0 ? formatRoundedDownQuestionCount(served) : "",
      };
    }),
    degraded: snapshot.degraded,
  };
}

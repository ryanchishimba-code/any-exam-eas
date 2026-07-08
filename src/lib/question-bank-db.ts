import type { BankItem } from "@/lib/question-bank";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { prisma } from "@/lib/prisma";
import { isMpjeField } from "@/lib/mpje/config";
import {
  sampleMpjeFederalOnlyItems,
  sampleMpjeQuestionBankItems,
} from "@/lib/mpje/sample-bank";
import {
  curatedSampleTarget,
  curatedUsmleWhereClause,
  isUsmleFieldId,
} from "@/lib/question-bank/usmle-curated";
import {
  curatedNaplexWhereClause,
  curatedSampleTarget as naplexCuratedSampleTarget,
  isPharmacyFieldId,
} from "@/lib/question-bank/naplex-curated";
import {
  curatedNclexWhereClause,
  curatedSampleTarget as nclexCuratedSampleTarget,
  isNursingFieldId,
} from "@/lib/question-bank/nclex-curated";
import {
  curatedPanceWhereClause,
  curatedSampleTarget as panceCuratedSampleTarget,
} from "@/lib/question-bank/pance-curated";
import {
  curatedAanpFnpWhereClause,
  curatedSampleTarget as aanpFnpCuratedSampleTarget,
} from "@/lib/question-bank/aanp-fnp-curated";
import {
  curatedNptePtWhereClause,
  curatedSampleTarget as nptePtCuratedSampleTarget,
} from "@/lib/question-bank/npte-pt-curated";
import { sampleQuestionBankRows } from "@/lib/question-bank/random-sample";
/** Max rows read per sample query (keeps Neon queries bounded). */
export const QUESTION_BANK_SAMPLE_MAX_PULL = 500;

/** Default pool size per subject for adaptive selection. */
export const ADAPTIVE_QUESTION_POOL_PER_SUBJECT = 80;

const FIELD_TOTAL_CACHE_MS = 30_000;
const CURATED_TOTAL_CACHE_MS = 60_000;
const fieldTotalCache = new Map<string, { total: number; at: number }>();
const curatedTotalCache = new Map<string, { total: number; at: number }>();

async function getCachedCuratedTotal(
  cacheKey: string,
  where: ReturnType<typeof activeFieldWhere> & Record<string, unknown>
): Promise<number> {
  const hit = curatedTotalCache.get(cacheKey);
  if (hit && Date.now() - hit.at < CURATED_TOTAL_CACHE_MS) return hit.total;
  const total = await prisma.questionBankItem.count({ where });
  curatedTotalCache.set(cacheKey, { total, at: Date.now() });
  return total;
}

async function getCachedActiveFieldTotal(fieldId: string): Promise<number> {
  const hit = fieldTotalCache.get(fieldId);
  if (hit && Date.now() - hit.at < FIELD_TOTAL_CACHE_MS) return hit.total;
  const total = await prisma.questionBankItem.count({
    where: activeFieldWhere(fieldId),
  });
  fieldTotalCache.set(fieldId, { total, at: Date.now() });
  return total;
}

function curatedFieldSampleTarget(want: number, curatedAvailable: number): number {
  if (curatedAvailable <= 0) return 0;
  return Math.min(curatedAvailable, want);
}

async function sampleCuratedFieldItems(params: {
  fieldId: string;
  want: number;
  curatedWhere: ReturnType<typeof activeFieldWhere> & Record<string, unknown>;
  total: number;
  curatedPullMultiplier?: number;
  generalPullMultiplier?: number;
}): Promise<BankItem[]> {
  const {
    fieldId,
    want,
    curatedWhere,
    total,
    curatedPullMultiplier = 3,
    generalPullMultiplier = 2,
  } = params;

  const curatedTotal = await getCachedCuratedTotal(`${fieldId}:curated`, curatedWhere);
  const curatedWant = curatedFieldSampleTarget(want, curatedTotal);
  let collected: BankItem[] = [];

  if (curatedWant > 0) {
    const pull = Math.min(
      QUESTION_BANK_SAMPLE_MAX_PULL,
      Math.max(curatedWant * curatedPullMultiplier, curatedWant + 24)
    );
    const rows = await sampleQuestionBankRows({ where: curatedWhere, pull, total: curatedTotal });
    collected = dedupeSamplePool(shuffleBankItems(rows.map(rowToBankItem))).slice(
      0,
      curatedWant
    );
  }

  const remaining = want - collected.length;
  if (remaining > 0) {
    const pullTarget = Math.min(
      QUESTION_BANK_SAMPLE_MAX_PULL,
      Math.max(remaining * generalPullMultiplier, remaining + 24)
    );
    const rows = await sampleQuestionBankRows({ where: activeFieldWhere(fieldId), pull: pullTarget, total });
    collected = dedupeSamplePool([
      ...collected,
      ...shuffleBankItems(rows.map(rowToBankItem)),
    ]).slice(0, want);
  }

  return shuffleBankItems(collected).slice(0, want);
}

const PANCE_FIELD_ID = "pance";
const AANP_FNP_FIELD_ID = "aanp-fnp";
const NPTE_PT_FIELD_ID = "npte-pt";

function isPanceFieldId(fieldId: string): boolean {
  return fieldId === PANCE_FIELD_ID;
}

function isAanpFnpFieldId(fieldId: string): boolean {
  return fieldId === AANP_FNP_FIELD_ID;
}

function isNptePtFieldId(fieldId: string): boolean {
  return fieldId === NPTE_PT_FIELD_ID;
}

function rowToBankItem(row: {
  id: string;
  subjectId: string;
  stateCode?: string | null;
  difficulty?: number | null;
  topicCategory?: string | null;
  blueprintDomain?: string | null;
  itemType?: string | null;
  scenario?: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  solutionSteps: string | null;
  tags: string | null;
  references?: unknown;
  source?: string | null;
  taskCategory?: string | null;
  blueprintTopic?: string | null;
  reviewStatus?: string | null;
  generationVersion?: string | null;
  generationMeta?: unknown;
}): BankItem {
  return enrichBankItemFromRow(row);
}

export function shuffleBankItems<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One item per normalized stem (first occurrence wins). */
export function dedupeBankItemsByStem(items: BankItem[]): BankItem[] {
  const seen = new Map<string, BankItem>();
  for (const item of items) {
    const key = item.question.trim().toLowerCase();
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}

/** Stable dedupe key — prefer bank row id (NGN sets often share a generic stem). */
export function bankItemDedupeKey(item: BankItem): string {
  return (
    item.id?.trim() ||
    `${item.subjectId ?? ""}:${item.question.trim().toLowerCase()}`
  );
}

/** One row per bank id — used when sampling sessions (NGN items often share a stem). */
export function dedupeBankItemsById(items: BankItem[]): BankItem[] {
  const seen = new Map<string, BankItem>();
  for (const item of items) {
    const key = bankItemDedupeKey(item);
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}

function dedupeSamplePool(items: BankItem[]): BankItem[] {
  return dedupeBankItemsById(items);
}

/**
 * Step-separation guard. Step 3 items can share the `usmle-step-2` field (legacy
 * full-exam inserter), so the Step 2 CK bank must exclude `stepLevel="step3"`.
 * Expressed via `AND` (not `OR`/`NOT`) so it never collides when merged with the
 * curated USMLE where-clause, and null-safe so untagged Step 2 rows still serve.
 */
function usmleStepSeparationWhere(fieldId: string) {
  if (fieldId === "usmle-step-2") {
    return { AND: [{ OR: [{ stepLevel: null }, { stepLevel: { not: "step3" } }] }] };
  }
  return {};
}

function activeSubjectWhere(
  fieldId: string,
  subjectId: string,
  taskCategory?: string | null,
  blueprintTopics?: string[]
) {
  return {
    fieldId,
    subjectId,
    active: true as const,
    qaPassed: true as const,
    ...(taskCategory?.trim() ? { taskCategory: taskCategory.trim() } : {}),
    ...(blueprintTopics?.length ? { blueprintTopic: { in: blueprintTopics } } : {}),
    ...usmleStepSeparationWhere(fieldId),
  };
}

function activeFieldWhere(fieldId: string, taskCategory?: string | null) {
  return {
    fieldId,
    active: true as const,
    qaPassed: true as const,
    ...(taskCategory?.trim() ? { taskCategory: taskCategory.trim() } : {}),
    ...usmleStepSeparationWhere(fieldId),
  };
}

/** No in-memory fallback — only qaPassed DB rows are served. */
function staticSeedFallback(
  _fieldId: string,
  _subjectId: string,
  _count: number,
  _stateCode?: string
): BankItem[] {
  return [];
}

/** Seed only when a bank is empty — never on every sample/count request. */
async function ensureBankAvailable(fieldId: string, subjectId?: string): Promise<void> {
  // Never seed or generate on read paths — cron sync-question-bank owns top-ups.
  // Inline writes during GET/POST sampling caused multi-second timeouts on cold Neon.
  void fieldId;
  void subjectId;
}

/**
 * Random sample from a subject bank (deduped by stem).
 * Uses a random DB window + shuffle instead of always returning the first N rows.
 */
export async function sampleQuestionBankItems(params: {
  fieldId: string;
  subjectId: string;
  count: number;
  /** MPJE: two-letter state code — prioritizes state + federal pool. */
  stateCode?: string;
  /** Extra rows to pull before dedupe (default 2× count, min count + 20). */
  poolMultiplier?: number;
  /** PANCE: optional NCCPA task-area filter. */
  taskCategory?: string | null;
  /** NCLEX: restrict to granular 2026 blueprint topic slugs. */
  blueprintTopics?: string[];
}): Promise<BankItem[]> {
  await ensureBankAvailable(params.fieldId, params.subjectId);

  if (params.subjectId === "__mixed__" && params.taskCategory && isPanceFieldId(params.fieldId)) {
    return sampleQuestionBankItemsForField({
      fieldId: params.fieldId,
      count: params.count,
      taskCategory: params.taskCategory,
    });
  }

  if (isMpjeField(params.fieldId)) {
    if (params.stateCode) {
      const { items } = await sampleMpjeQuestionBankItems({
        subjectId: params.subjectId,
        stateCode: params.stateCode,
        count: params.count,
      });
      if (items.length > 0) return items;
      return staticSeedFallback(
        params.fieldId,
        params.subjectId,
        params.count,
        params.stateCode
      );
    }
    const { items } = await sampleMpjeFederalOnlyItems({
      subjectId: params.subjectId,
      count: params.count,
    });
    if (items.length > 0) return items;
    return staticSeedFallback(params.fieldId, params.subjectId, params.count);
  }

  const want = Math.max(1, params.count);
  const where = activeSubjectWhere(
    params.fieldId,
    params.subjectId,
    params.taskCategory,
    params.blueprintTopics
  );
  const total = await prisma.questionBankItem.count({ where });

  if (total === 0 && params.taskCategory && isPanceFieldId(params.fieldId)) {
    return samplePanceSubjectItems(
      params.fieldId,
      params.subjectId,
      want,
      activeSubjectWhere(params.fieldId, params.subjectId),
      await prisma.questionBankItem.count({
        where: activeSubjectWhere(params.fieldId, params.subjectId),
      }),
      null
    );
  }

  if (total === 0) {
    return staticSeedFallback(params.fieldId, params.subjectId, want);
  }

  if (isUsmleFieldId(params.fieldId)) {
    return sampleUsmleSubjectItems(params.fieldId, params.subjectId, want, where, total);
  }

  if (isPharmacyFieldId(params.fieldId)) {
    return sampleNaplexSubjectItems(params.fieldId, params.subjectId, want, where, total);
  }

  if (isNursingFieldId(params.fieldId)) {
    return sampleNclexSubjectItems(params.fieldId, params.subjectId, want, where, total);
  }

  if (isPanceFieldId(params.fieldId)) {
    return samplePanceSubjectItems(
      params.fieldId,
      params.subjectId,
      want,
      where,
      total,
      params.taskCategory ?? null
    );
  }

  if (isAanpFnpFieldId(params.fieldId)) {
    return sampleAanpFnpSubjectItems(params.fieldId, params.subjectId, want, where, total);
  }

  if (isNptePtFieldId(params.fieldId)) {
    return sampleNptePtSubjectItems(params.fieldId, params.subjectId, want, where, total);
  }

  return sampleSubjectItemsRandom(want, where, total, params.poolMultiplier);
}

async function sampleCuratedSubjectRows(
  curatedWhere: ReturnType<typeof activeSubjectWhere>,
  curatedTotal: number,
  curatedWant: number
): Promise<BankItem[]> {
  if (curatedWant <= 0 || curatedTotal <= 0) return [];
  const pull = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(curatedWant * 4, curatedWant + 20)
  );
  const rows = await sampleQuestionBankRows({
    where: curatedWhere,
    pull,
    total: curatedTotal,
  });
  return dedupeSamplePool(shuffleBankItems(rows.map(rowToBankItem))).slice(0, curatedWant);
}

async function samplePanceSubjectItems(
  fieldId: string,
  subjectId: string,
  want: number,
  baseWhere: ReturnType<typeof activeSubjectWhere>,
  total: number,
  taskCategory: string | null
): Promise<BankItem[]> {
  const curatedWhere = { ...baseWhere, ...curatedPanceWhereClause() };
  const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
  const curatedWant = panceCuratedSampleTarget(want, curatedTotal);

  let collected: BankItem[] = [];

  if (curatedWant > 0) {
    collected = await sampleCuratedSubjectRows(curatedWhere, curatedTotal, curatedWant);
  }

  const remaining = want - collected.length;
  if (remaining > 0) {
    const general = await sampleSubjectItemsRandom(remaining, baseWhere, total, 2);
    collected = dedupeSamplePool([...collected, ...general]);
  }

  if (collected.length < want && taskCategory) {
    const unfilteredWhere = activeSubjectWhere(fieldId, subjectId);
    const fallbackTotal = await prisma.questionBankItem.count({ where: unfilteredWhere });
    if (fallbackTotal > 0) {
      const fallback = await sampleSubjectItemsRandom(
        want - collected.length,
        unfilteredWhere,
        fallbackTotal,
        2
      );
      collected = dedupeSamplePool([...collected, ...fallback]);
    }
  }

  if (collected.length === 0) {
    return staticSeedFallback(fieldId, subjectId, want);
  }

  return shuffleBankItems(collected).slice(0, want);
}

async function sampleAanpFnpSubjectItems(
  fieldId: string,
  subjectId: string,
  want: number,
  baseWhere: ReturnType<typeof activeSubjectWhere>,
  total: number
): Promise<BankItem[]> {
  const curatedWhere = { ...baseWhere, ...curatedAanpFnpWhereClause() };
  const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
  const curatedWant = aanpFnpCuratedSampleTarget(want, curatedTotal);

  let collected: BankItem[] = [];

  if (curatedWant > 0) {
    collected = await sampleCuratedSubjectRows(curatedWhere, curatedTotal, curatedWant);
  }

  const remaining = want - collected.length;
  if (remaining > 0) {
    const general = await sampleSubjectItemsRandom(remaining, baseWhere, total, 2);
    collected = dedupeSamplePool([...collected, ...general]);
  }

  if (collected.length === 0) {
    return staticSeedFallback(fieldId, subjectId, want);
  }

  return shuffleBankItems(collected).slice(0, want);
}

async function sampleNptePtSubjectItems(
  fieldId: string,
  subjectId: string,
  want: number,
  baseWhere: ReturnType<typeof activeSubjectWhere>,
  total: number
): Promise<BankItem[]> {
  const curatedWhere = { ...baseWhere, ...curatedNptePtWhereClause() };
  const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
  const curatedWant = nptePtCuratedSampleTarget(want, curatedTotal);

  let collected: BankItem[] = [];

  if (curatedWant > 0) {
    collected = await sampleCuratedSubjectRows(curatedWhere, curatedTotal, curatedWant);
  }

  const remaining = want - collected.length;
  if (remaining > 0) {
    const general = await sampleSubjectItemsRandom(remaining, baseWhere, total, 2);
    collected = dedupeSamplePool([...collected, ...general]);
  }

  if (collected.length === 0) {
    return staticSeedFallback(fieldId, subjectId, want);
  }

  return shuffleBankItems(collected).slice(0, want);
}

async function sampleNaplexSubjectItems(
  fieldId: string,
  subjectId: string,
  want: number,
  baseWhere: ReturnType<typeof activeSubjectWhere>,
  total: number
): Promise<BankItem[]> {
  const curatedWhere = { ...baseWhere, ...curatedNaplexWhereClause() };
  const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
  const curatedWant = naplexCuratedSampleTarget(want, curatedTotal);

  let collected: BankItem[] = [];

  if (curatedWant > 0) {
    collected = await sampleCuratedSubjectRows(curatedWhere, curatedTotal, curatedWant);
  }

  const remaining = want - collected.length;
  if (remaining > 0) {
    const general = await sampleSubjectItemsRandom(remaining, baseWhere, total, 2);
    collected = dedupeSamplePool([...collected, ...general]);
  }

  if (collected.length === 0) {
    return staticSeedFallback(fieldId, subjectId, want);
  }

  return shuffleBankItems(collected).slice(0, want);
}

async function sampleNclexSubjectItems(
  fieldId: string,
  subjectId: string,
  want: number,
  baseWhere: ReturnType<typeof activeSubjectWhere>,
  total: number
): Promise<BankItem[]> {
  const curatedWhere = { ...baseWhere, ...curatedNclexWhereClause() };
  const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
  const curatedWant = nclexCuratedSampleTarget(want, curatedTotal);

  let collected: BankItem[] = [];

  if (curatedWant > 0) {
    const pull = Math.min(
      QUESTION_BANK_SAMPLE_MAX_PULL,
      Math.max(curatedWant * 4, curatedWant + 20)
    );
    const curatedRows = await sampleQuestionBankRows({
      where: curatedWhere,
      pull,
      total: curatedTotal,
    });
    collected = dedupeSamplePool(shuffleBankItems(curatedRows.map(rowToBankItem))).slice(
      0,
      curatedWant
    );
  }

  const remaining = want - collected.length;
  if (remaining > 0) {
    const general = await sampleSubjectItemsRandom(remaining, baseWhere, total, 4);
    collected = dedupeSamplePool([...collected, ...general]);
  }

  if (collected.length === 0) {
    return staticSeedFallback(fieldId, subjectId, want);
  }

  return shuffleBankItems(collected).slice(0, want);
}

async function sampleSubjectItemsRandom(
  want: number,
  where: ReturnType<typeof activeSubjectWhere>,
  total: number,
  poolMultiplier?: number
): Promise<BankItem[]> {
  const multiplier = poolMultiplier ?? 2;
  const pullTarget = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(want * multiplier, want + 20)
  );

  if (total <= want) {
    const rows = await prisma.questionBankItem.findMany({ where });
    return dedupeSamplePool(shuffleBankItems(rows.map(rowToBankItem))).slice(0, want);
  }

  const rows = await sampleQuestionBankRows({ where, pull: pullTarget, total });
  return shuffleBankItems(dedupeSamplePool(rows.map(rowToBankItem))).slice(0, want);
}

async function sampleUsmleSubjectItems(
  fieldId: string,
  subjectId: string,
  want: number,
  baseWhere: ReturnType<typeof activeSubjectWhere>,
  total: number
): Promise<BankItem[]> {
  const curatedWhere = { ...baseWhere, ...curatedUsmleWhereClause() };
  const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
  const curatedWant = curatedSampleTarget(want, curatedTotal);

  let collected: BankItem[] = [];

  if (curatedWant > 0) {
    collected = await sampleCuratedSubjectRows(curatedWhere, curatedTotal, curatedWant);
  }

  const remaining = want - collected.length;
  if (remaining > 0) {
    const general = await sampleSubjectItemsRandom(remaining, baseWhere, total, 2);
    collected = dedupeSamplePool([...collected, ...general]);
  }

  if (collected.length === 0) {
    return staticSeedFallback(fieldId, subjectId, want);
  }

  return shuffleBankItems(collected).slice(0, want);
}

/** Load entire subject bank (use sparingly — prefer sampleQuestionBankItems). */
export async function fetchQuestionBankItems(params: {
  fieldId: string;
  subjectId: string;
}): Promise<BankItem[]> {
  await ensureBankAvailable(params.fieldId, params.subjectId);

  const rows = await prisma.questionBankItem.findMany({
    where: activeSubjectWhere(params.fieldId, params.subjectId),
  });

  return rows.map(rowToBankItem);
}

export async function countActiveQuestions(fieldId?: string) {
  return prisma.questionBankItem.count({
    where: {
      active: true,
      qaPassed: true,
      ...(fieldId ? { fieldId, ...usmleStepSeparationWhere(fieldId) } : {}),
    },
  });
}

/**
 * Count of serve-ready questions for a single (field, subject).
 *
 * Uses the EXACT same `where` as the serve path (`activeSubjectWhere`), so this
 * count can never disagree with what topic-filtered practice actually draws
 * from. This is the trust-critical contract: displayed topic count === pool the
 * filter serves. (Tested in question-bank-db.subject-counts.test.ts.)
 */
export async function countActiveSubjectQuestions(
  fieldId: string,
  subjectId: string
): Promise<number> {
  return prisma.questionBankItem.count({
    where: activeSubjectWhere(fieldId, subjectId),
  });
}

/**
 * Serve-ready question counts for every subject in a field, in one query.
 *
 * Groups by `subjectId` using the field-level serve filter (`activeFieldWhere`),
 * which is `activeSubjectWhere` minus the subject predicate — so each per-subject
 * total here equals `countActiveSubjectQuestions(fieldId, subjectId)` by
 * construction. Returns a plain map keyed by `subjectId`.
 */
export async function getSubjectServedCounts(
  fieldId: string
): Promise<Record<string, number>> {
  const rows = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: activeFieldWhere(fieldId),
    _count: { _all: true },
  });

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.subjectId] = row._count._all;
  }
  return counts;
}

/** Resilient wrapper for topic picker / API — retries via global Prisma extension. */
export async function getSubjectServedCountsWithRetry(
  fieldId: string
): Promise<Record<string, number>> {
  return getSubjectServedCounts(fieldId);
}

/**
 * Random sample across all subjects in a field (for timed exam simulations).
 */
export async function sampleQuestionBankItemsForField(params: {
  fieldId: string;
  count: number;
  stateCode?: string;
  /** Skip seed/count probe on repeat pulls within the same request. */
  skipEnsure?: boolean;
  /** PANCE: optional NCCPA task-area filter. */
  taskCategory?: string | null;
}): Promise<BankItem[]> {
  if (!params.skipEnsure) {
    await ensureBankAvailable(params.fieldId);
  }

  if (isMpjeField(params.fieldId)) {
    if (params.stateCode) {
      const { items } = await sampleMpjeQuestionBankItems({
        stateCode: params.stateCode,
        count: params.count,
      });
      if (items.length > 0) return items;
    } else {
      const { items } = await sampleMpjeFederalOnlyItems({ count: params.count });
      if (items.length > 0) return items;
    }
  }

  const want = Math.max(1, params.count);
  const where = activeFieldWhere(params.fieldId, params.taskCategory);
  const total = params.skipEnsure
    ? (fieldTotalCache.get(params.fieldId)?.total ??
      (await getCachedActiveFieldTotal(params.fieldId)))
    : await getCachedActiveFieldTotal(params.fieldId);

  if (total === 0) {
    return [];
  }

  if (isNursingFieldId(params.fieldId)) {
    return sampleCuratedFieldItems({
      fieldId: params.fieldId,
      want,
      curatedWhere: { ...where, ...curatedNclexWhereClause() },
      total,
      curatedPullMultiplier: 2.5,
      generalPullMultiplier: 2,
    });
  }

  if (isUsmleFieldId(params.fieldId)) {
    return sampleCuratedFieldItems({
      fieldId: params.fieldId,
      want,
      curatedWhere: { ...where, ...curatedUsmleWhereClause() },
      total,
      curatedPullMultiplier: 2.5,
      generalPullMultiplier: 2,
    });
  }

  if (isPharmacyFieldId(params.fieldId)) {
    return sampleCuratedFieldItems({
      fieldId: params.fieldId,
      want,
      curatedWhere: { ...where, ...curatedNaplexWhereClause() },
      total,
      curatedPullMultiplier: 2.5,
      generalPullMultiplier: 2,
    });
  }

  if (isPanceFieldId(params.fieldId)) {
    return sampleCuratedFieldItems({
      fieldId: params.fieldId,
      want,
      curatedWhere: { ...where, ...curatedPanceWhereClause() },
      total,
      curatedPullMultiplier: 3,
      generalPullMultiplier: 2,
    });
  }

  if (isAanpFnpFieldId(params.fieldId)) {
    return sampleCuratedFieldItems({
      fieldId: params.fieldId,
      want,
      curatedWhere: { ...where, ...curatedAanpFnpWhereClause() },
      total,
      curatedPullMultiplier: 2.5,
      generalPullMultiplier: 2,
    });
  }

  if (isNptePtFieldId(params.fieldId)) {
    return sampleCuratedFieldItems({
      fieldId: params.fieldId,
      want,
      curatedWhere: { ...where, ...curatedNptePtWhereClause() },
      total,
      curatedPullMultiplier: 3,
      generalPullMultiplier: 2,
    });
  }

  const pullTarget = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(want * 2, want + 40)
  );

  if (total <= want) {
    const rows = await prisma.questionBankItem.findMany({ where });
    return dedupeSamplePool(shuffleBankItems(rows.map(rowToBankItem))).slice(0, want);
  }

  const rows = await sampleQuestionBankRows({ where, pull: pullTarget, total });
  return shuffleBankItems(dedupeSamplePool(rows.map(rowToBankItem))).slice(0, want);
}

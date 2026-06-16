import type { BankItem } from "@/lib/question-bank";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { prisma } from "@/lib/prisma";
import {
  ensureStaticSeedsForField,
  ensureSubjectHasQuestions,
} from "@/lib/ensure-field-seeds";
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

const PANCE_FIELD_ID = "pance";

function isPanceFieldId(fieldId: string): boolean {
  return fieldId === PANCE_FIELD_ID;
}
/** Max rows read per sample query (keeps Neon queries bounded). */
export const QUESTION_BANK_SAMPLE_MAX_PULL = 500;

/** Default pool size per subject for adaptive selection. */
export const ADAPTIVE_QUESTION_POOL_PER_SUBJECT = 80;

const MIN_SUBJECT_ROWS_BEFORE_SEED = 5;

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

function activeSubjectWhere(fieldId: string, subjectId: string) {
  return { fieldId, subjectId, active: true as const, qaPassed: true as const };
}

function activeFieldWhere(fieldId: string) {
  return { fieldId, active: true as const, qaPassed: true as const };
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
  if (subjectId) {
    const count = await prisma.questionBankItem.count({
      where: { fieldId, subjectId, active: true, qaPassed: true },
    });
    if (count >= MIN_SUBJECT_ROWS_BEFORE_SEED) return;
    await ensureSubjectHasQuestions(fieldId, subjectId);
    return;
  }

  const count = await prisma.questionBankItem.count({
    where: { fieldId, active: true, qaPassed: true },
  });
  if (count > 0) return;
  await ensureStaticSeedsForField(fieldId);
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
}): Promise<BankItem[]> {
  await ensureBankAvailable(params.fieldId, params.subjectId);

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
  const where = activeSubjectWhere(params.fieldId, params.subjectId);
  const total = await prisma.questionBankItem.count({ where });

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
    return samplePanceSubjectItems(params.fieldId, params.subjectId, want, where, total);
  }

  return sampleSubjectItemsRandom(want, where, total, params.poolMultiplier);
}

async function samplePanceSubjectItems(
  fieldId: string,
  subjectId: string,
  want: number,
  baseWhere: ReturnType<typeof activeSubjectWhere>,
  total: number
): Promise<BankItem[]> {
  const curatedWhere = { ...baseWhere, ...curatedPanceWhereClause() };
  const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
  const curatedWant = panceCuratedSampleTarget(want, curatedTotal);

  let collected: BankItem[] = [];

  if (curatedWant > 0) {
    const curatedRows = await prisma.questionBankItem.findMany({
      where: curatedWhere,
      take: Math.min(curatedTotal, Math.max(curatedWant * 3, curatedWant + 10)),
      skip:
        curatedTotal > curatedWant
          ? Math.floor(Math.random() * Math.max(0, curatedTotal - curatedWant))
          : 0,
      orderBy: { id: "asc" },
    });
    collected = dedupeSamplePool(shuffleBankItems(curatedRows.map(rowToBankItem))).slice(
      0,
      curatedWant
    );
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
    const curatedRows = await prisma.questionBankItem.findMany({
      where: curatedWhere,
      take: Math.min(curatedTotal, Math.max(curatedWant * 3, curatedWant + 10)),
      skip:
        curatedTotal > curatedWant
          ? Math.floor(Math.random() * Math.max(0, curatedTotal - curatedWant))
          : 0,
      orderBy: { id: "asc" },
    });
    collected = dedupeSamplePool(shuffleBankItems(curatedRows.map(rowToBankItem))).slice(
      0,
      curatedWant
    );
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
    const curatedRows = await prisma.questionBankItem.findMany({
      where: curatedWhere,
      take: Math.min(curatedTotal, Math.max(curatedWant * 4, curatedWant + 20)),
      skip:
        curatedTotal > curatedWant
          ? Math.floor(Math.random() * Math.max(0, curatedTotal - curatedWant))
          : 0,
      orderBy: { id: "asc" },
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

  let collected: BankItem[] = [];
  let attempts = 0;

  while (collected.length < want && attempts < 4) {
    const pull = Math.min(pullTarget, total);
    const skip = total > pull ? Math.floor(Math.random() * (total - pull)) : 0;
    const rows = await prisma.questionBankItem.findMany({
      where,
      skip,
      take: pull,
      orderBy: { id: "asc" },
    });
    collected = dedupeSamplePool([
      ...collected,
      ...shuffleBankItems(rows.map(rowToBankItem)),
    ]);
    attempts++;
  }

  return shuffleBankItems(collected).slice(0, want);
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
    const curatedRows = await prisma.questionBankItem.findMany({
      where: curatedWhere,
      take: Math.min(curatedTotal, Math.max(curatedWant * 3, curatedWant + 10)),
      skip:
        curatedTotal > curatedWant
          ? Math.floor(Math.random() * Math.max(0, curatedTotal - curatedWant))
          : 0,
      orderBy: { id: "asc" },
    });
    collected = dedupeSamplePool(shuffleBankItems(curatedRows.map(rowToBankItem))).slice(
      0,
      curatedWant
    );
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
      ...(fieldId ? { fieldId } : {}),
    },
  });
}

/**
 * Random sample across all subjects in a field (for timed exam simulations).
 */
export async function sampleQuestionBankItemsForField(params: {
  fieldId: string;
  count: number;
  stateCode?: string;
}): Promise<BankItem[]> {
  await ensureBankAvailable(params.fieldId);

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
  const where = activeFieldWhere(params.fieldId);
  const total = await prisma.questionBankItem.count({ where });

  if (total === 0) {
    return [];
  }

  if (isNursingFieldId(params.fieldId)) {
    const curatedWhere = { ...where, ...curatedNclexWhereClause() };
    const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
    const curatedWant = nclexCuratedSampleTarget(want, curatedTotal);
    let collected: BankItem[] = [];

    if (curatedWant > 0) {
      const pull = Math.min(
        QUESTION_BANK_SAMPLE_MAX_PULL,
        Math.max(curatedWant * 4, curatedWant + 40)
      );
      const skip =
        curatedTotal > pull ? Math.floor(Math.random() * Math.max(0, curatedTotal - pull)) : 0;
      const rows = await prisma.questionBankItem.findMany({
        where: curatedWhere,
        skip,
        take: pull,
        orderBy: { id: "asc" },
      });
      collected = dedupeSamplePool(shuffleBankItems(rows.map(rowToBankItem))).slice(
        0,
        curatedWant
      );
    }

    const remaining = want - collected.length;
    if (remaining > 0) {
      const pullTarget = Math.min(
        QUESTION_BANK_SAMPLE_MAX_PULL,
        Math.max(remaining * 4, remaining + 40)
      );
      const skip = total > pullTarget ? Math.floor(Math.random() * (total - pullTarget)) : 0;
      const rows = await prisma.questionBankItem.findMany({
        where,
        skip,
        take: pullTarget,
        orderBy: { id: "asc" },
      });
      collected = dedupeSamplePool([
        ...collected,
        ...shuffleBankItems(rows.map(rowToBankItem)),
      ]).slice(0, want);
    }

    return shuffleBankItems(collected).slice(0, want);
  }

  if (isPanceFieldId(params.fieldId)) {
    const curatedWhere = { ...where, ...curatedPanceWhereClause() };
    const curatedTotal = await prisma.questionBankItem.count({ where: curatedWhere });
    const curatedWant = panceCuratedSampleTarget(want, curatedTotal);
    let collected: BankItem[] = [];

    if (curatedWant > 0) {
      const pull = Math.min(
        QUESTION_BANK_SAMPLE_MAX_PULL,
        Math.max(curatedWant * 3, curatedWant + 30)
      );
      const skip =
        curatedTotal > pull ? Math.floor(Math.random() * Math.max(0, curatedTotal - pull)) : 0;
      const rows = await prisma.questionBankItem.findMany({
        where: curatedWhere,
        skip,
        take: pull,
        orderBy: { id: "asc" },
      });
      collected = dedupeSamplePool(shuffleBankItems(rows.map(rowToBankItem))).slice(
        0,
        curatedWant
      );
    }

    const remaining = want - collected.length;
    if (remaining > 0) {
      const pullTarget = Math.min(
        QUESTION_BANK_SAMPLE_MAX_PULL,
        Math.max(remaining * 2, remaining + 30)
      );
      const skip = total > pullTarget ? Math.floor(Math.random() * (total - pullTarget)) : 0;
      const rows = await prisma.questionBankItem.findMany({
        where,
        skip,
        take: pullTarget,
        orderBy: { id: "asc" },
      });
      collected = dedupeSamplePool([
        ...collected,
        ...shuffleBankItems(rows.map(rowToBankItem)),
      ]).slice(0, want);
    }

    return shuffleBankItems(collected).slice(0, want);
  }

  const pullTarget = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(want * 2, want + 40)
  );

  if (total <= want) {
    const rows = await prisma.questionBankItem.findMany({ where });
    return dedupeSamplePool(shuffleBankItems(rows.map(rowToBankItem))).slice(0, want);
  }

  let collected: BankItem[] = [];
  let attempts = 0;

  while (collected.length < want && attempts < 5) {
    const pull = Math.min(pullTarget, total);
    const skip = total > pull ? Math.floor(Math.random() * (total - pull)) : 0;
    const rows = await prisma.questionBankItem.findMany({
      where,
      skip,
      take: pull,
      orderBy: { id: "asc" },
    });
    collected = dedupeSamplePool([
      ...collected,
      ...shuffleBankItems(rows.map(rowToBankItem)),
    ]);
    attempts++;
  }

  return shuffleBankItems(collected).slice(0, want);
}

import type { BankItem } from "./question-bank";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { prisma } from "@/lib/prisma";
import {
  ensureStaticSeedsForField,
  ensureSubjectHasQuestions,
} from "@/lib/ensure-field-seeds";
import { getHealthBankItems } from "@/lib/health-sciences-question-bank";
import { isMpjeField } from "@/lib/mpje/config";
import {
  sampleMpjeFederalOnlyItems,
  sampleMpjeQuestionBankItems,
} from "@/lib/mpje/sample-bank";
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

function activeSubjectWhere(fieldId: string, subjectId: string) {
  return { fieldId, subjectId, active: true as const, qaPassed: true as const };
}

function activeFieldWhere(fieldId: string) {
  return { fieldId, active: true as const, qaPassed: true as const };
}

/** In-memory fallback when DB is empty (e.g. before first sync on Vercel). */
function staticSeedFallback(
  fieldId: string,
  subjectId: string,
  count: number,
  stateCode?: string
): BankItem[] {
  let items = getHealthBankItems(fieldId, subjectId);
  if (isMpjeField(fieldId)) {
    if (stateCode) {
      const stateItems = items.filter((i) => i.stateCode === stateCode);
      const federalItems = items.filter((i) => !i.stateCode);
      items = [...stateItems, ...federalItems];
    } else {
      items = items.filter((i) => !i.stateCode);
    }
  }
  if (items.length === 0) return [];
  return dedupeBankItemsByStem(shuffleBankItems(items)).slice(0, count);
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
  const multiplier = params.poolMultiplier ?? 2;
  const pullTarget = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(want * multiplier, want + 20)
  );

  const where = activeSubjectWhere(params.fieldId, params.subjectId);
  const total = await prisma.questionBankItem.count({ where });

  if (total === 0) {
    return staticSeedFallback(params.fieldId, params.subjectId, want);
  }

  if (total <= want) {
    const rows = await prisma.questionBankItem.findMany({ where });
    return dedupeBankItemsByStem(shuffleBankItems(rows.map(rowToBankItem))).slice(0, want);
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
    collected = dedupeBankItemsByStem([
      ...collected,
      ...shuffleBankItems(rows.map(rowToBankItem)),
    ]);
    attempts++;
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
    const subjects = (
      await import("@/lib/subjects/registry")
    ).getSubjectsForFieldId(params.fieldId);
    const pooled: BankItem[] = [];
    for (const subject of subjects) {
      pooled.push(...staticSeedFallback(params.fieldId, subject.id, Math.ceil(want / subjects.length) + 2));
    }
    return dedupeBankItemsByStem(shuffleBankItems(pooled)).slice(0, want);
  }

  const pullTarget = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(want * 2, want + 40)
  );

  if (total <= want) {
    const rows = await prisma.questionBankItem.findMany({ where });
    return dedupeBankItemsByStem(shuffleBankItems(rows.map(rowToBankItem))).slice(0, want);
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
    collected = dedupeBankItemsByStem([
      ...collected,
      ...shuffleBankItems(rows.map(rowToBankItem)),
    ]);
    attempts++;
  }

  return shuffleBankItems(collected).slice(0, want);
}

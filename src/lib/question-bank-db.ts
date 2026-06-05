import type { BankItem } from "./question-bank";
import { prisma } from "@/lib/prisma";
import { ensureQuestionBankSeeded } from "@/lib/sync-question-bank";

/** Max rows read per sample query (keeps Neon queries bounded). */
export const QUESTION_BANK_SAMPLE_MAX_PULL = 500;

/** Default pool size per subject for adaptive selection. */
export const ADAPTIVE_QUESTION_POOL_PER_SUBJECT = 300;

function rowToBankItem(row: {
  id: string;
  subjectId: string;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  solutionSteps: string | null;
  tags: string | null;
}): BankItem {
  const options = JSON.parse(row.options) as string[];
  return {
    id: row.id,
    subjectId: row.subjectId,
    question: row.question,
    options: options as [string, string, string, string],
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    solutionSteps: row.solutionSteps
      ? (JSON.parse(row.solutionSteps) as string[])
      : undefined,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : undefined,
  };
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
  return { fieldId, subjectId, active: true as const };
}

/**
 * Random sample from a subject bank (deduped by stem).
 * Uses a random DB window + shuffle instead of always returning the first N rows.
 */
export async function sampleQuestionBankItems(params: {
  fieldId: string;
  subjectId: string;
  count: number;
  /** Extra rows to pull before dedupe (default 2× count, min count + 20). */
  poolMultiplier?: number;
}): Promise<BankItem[]> {
  await ensureQuestionBankSeeded();

  const want = Math.max(1, params.count);
  const multiplier = params.poolMultiplier ?? 2;
  const pullTarget = Math.min(
    QUESTION_BANK_SAMPLE_MAX_PULL,
    Math.max(want * multiplier, want + 20)
  );

  const where = activeSubjectWhere(params.fieldId, params.subjectId);
  const total = await prisma.questionBankItem.count({ where });

  if (total === 0) return [];

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
  await ensureQuestionBankSeeded();

  const rows = await prisma.questionBankItem.findMany({
    where: activeSubjectWhere(params.fieldId, params.subjectId),
  });

  return rows.map(rowToBankItem);
}

export async function countActiveQuestions(fieldId?: string) {
  await ensureQuestionBankSeeded();
  return prisma.questionBankItem.count({
    where: {
      active: true,
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
}): Promise<BankItem[]> {
  await ensureQuestionBankSeeded();

  const want = Math.max(1, params.count);
  const where = { fieldId: params.fieldId, active: true as const };
  const total = await prisma.questionBankItem.count({ where });

  if (total === 0) return [];

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

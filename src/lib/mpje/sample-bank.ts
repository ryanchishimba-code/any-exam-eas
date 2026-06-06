import type { BankItem } from "@/lib/question-bank";
import { prisma } from "@/lib/prisma";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import { selectDiverseMpjeItems } from "@/lib/mpje/sample-diversity";
import {
  mpjeFederalOnlyWhere,
  mpjeStateOnlyWhere,
  mpjeStateOrFederalWhere,
} from "./sample-query";

const SAMPLE_MAX_PULL = 500;

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dedupeByStem(items: BankItem[]): BankItem[] {
  const seen = new Map<string, BankItem>();
  for (const item of items) {
    const key = `${item.scenario?.trim().toLowerCase() ?? ""}::${item.question.trim().toLowerCase()}`;
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}

export type MpjeSampleMeta = {
  stateCode: string;
  stateSpecificCount: number;
  federalCount: number;
  stateSpecificAvailable: number;
  federalAvailable: number;
  usedFederalFallback: boolean;
};

const ROW_SELECT = {
  id: true,
  subjectId: true,
  stateCode: true,
  question: true,
  options: true,
  correctAnswer: true,
  explanation: true,
  solutionSteps: true,
  tags: true,
  itemType: true,
  scenario: true,
  difficulty: true,
  topicCategory: true,
  blueprintDomain: true,
  references: true,
} as const;

/**
 * Sample MPJE questions prioritizing state-specific items, then federal/uniform.
 */
export async function sampleMpjeQuestionBankItems(params: {
  subjectId?: string;
  stateCode: string;
  count: number;
}): Promise<{ items: BankItem[]; meta: MpjeSampleMeta }> {
  const want = Math.max(1, params.count);
  const fieldId = "mpje";
  const { subjectId, stateCode } = params;

  const [stateAvail, federalAvail] = await Promise.all([
    prisma.questionBankItem.count({
      where: mpjeStateOnlyWhere(fieldId, subjectId, stateCode),
    }),
    prisma.questionBankItem.count({
      where: mpjeFederalOnlyWhere(fieldId, subjectId),
    }),
  ]);

  const stateTarget = Math.min(
    stateAvail,
    Math.max(Math.ceil(want * 0.6), stateAvail > 0 ? 1 : 0)
  );
  const federalTarget = Math.min(federalAvail, want - stateTarget);

  const pullCap = SAMPLE_MAX_PULL;

  const [stateRows, federalRows] = await Promise.all([
    stateTarget > 0
      ? prisma.questionBankItem.findMany({
          where: mpjeStateOnlyWhere(fieldId, subjectId, stateCode),
          take: Math.min(pullCap, Math.max(stateTarget * 3, stateTarget + 10)),
          select: ROW_SELECT,
        })
      : Promise.resolve([]),
    federalTarget > 0
      ? prisma.questionBankItem.findMany({
          where: mpjeFederalOnlyWhere(fieldId, subjectId),
          take: Math.min(pullCap, Math.max(federalTarget * 3, federalTarget + 10)),
          select: ROW_SELECT,
        })
      : Promise.resolve([]),
  ]);

  let pool = dedupeByStem([
    ...shuffle(stateRows.map(enrichBankItemFromRow)),
    ...shuffle(federalRows.map(enrichBankItemFromRow)),
  ]);

  if (pool.length < want) {
    const extra = await prisma.questionBankItem.findMany({
      where: mpjeStateOrFederalWhere(fieldId, subjectId, stateCode),
      take: pullCap,
      select: ROW_SELECT,
    });
    pool = dedupeByStem([...pool, ...shuffle(extra.map(enrichBankItemFromRow))]);
  }

  const items = selectDiverseMpjeItems(pool, want);
  const stateSpecificCount = items.filter((i) => i.stateCode === stateCode).length;
  const federalCount = items.filter((i) => !i.stateCode).length;

  return {
    items,
    meta: {
      stateCode,
      stateSpecificCount,
      federalCount,
      stateSpecificAvailable: stateAvail,
      federalAvailable: federalAvail,
      usedFederalFallback: stateAvail === 0 && federalCount > 0,
    },
  };
}

/** Federal / uniform items only (null state_code) — used when no state is selected. */
export async function sampleMpjeFederalOnlyItems(params: {
  subjectId?: string;
  count: number;
}): Promise<{ items: BankItem[]; federalAvailable: number }> {
  const want = Math.max(1, params.count);
  const fieldId = "mpje";
  const { subjectId } = params;

  const federalAvail = await prisma.questionBankItem.count({
    where: mpjeFederalOnlyWhere(fieldId, subjectId),
  });

  const rows = await prisma.questionBankItem.findMany({
    where: mpjeFederalOnlyWhere(fieldId, subjectId),
    take: Math.min(SAMPLE_MAX_PULL, Math.max(want * 3, want + 20)),
    select: ROW_SELECT,
  });

  const pool = dedupeByStem(shuffle(rows.map(enrichBankItemFromRow)));
  const items = selectDiverseMpjeItems(pool, want);

  return { items, federalAvailable: federalAvail };
}

export async function countMpjeQuestionsForState(
  stateCode: string,
  subjectId?: string
): Promise<{ stateSpecific: number; federal: number; total: number }> {
  const fieldId = "mpje";
  const [stateSpecific, federal] = await Promise.all([
    prisma.questionBankItem.count({
      where: mpjeStateOnlyWhere(fieldId, subjectId, stateCode),
    }),
    prisma.questionBankItem.count({
      where: mpjeFederalOnlyWhere(fieldId, subjectId),
    }),
  ]);
  return { stateSpecific, federal, total: stateSpecific + federal };
}

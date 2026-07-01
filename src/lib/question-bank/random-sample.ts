import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type BankRow = Parameters<
  typeof import("@/lib/mpje/parse-bank-options").enrichBankItemFromRow
>[0];

/**
 * Pick a random row start using a lightweight id-only OFFSET scan.
 * Avoids OFFSET over full question payloads (options + explanation).
 */
export async function pickRandomStartId(
  where: Prisma.QuestionBankItemWhereInput,
  total?: number
): Promise<string | null> {
  const count = total ?? (await prisma.questionBankItem.count({ where }));
  if (count <= 0) return null;
  const offset = count > 1 ? Math.floor(Math.random() * count) : 0;
  const row = await prisma.questionBankItem.findFirst({
    where,
    select: { id: true },
    orderBy: { id: "asc" },
    skip: offset,
  });
  return row?.id ?? null;
}

/** Contiguous id-window sample — two indexed range scans instead of large OFFSET on wide rows. */
export async function sampleQuestionBankRows(params: {
  where: Prisma.QuestionBankItemWhereInput;
  pull: number;
  total?: number;
}): Promise<BankRow[]> {
  const { where, pull } = params;
  const total = params.total ?? (await prisma.questionBankItem.count({ where }));
  if (total <= 0) return [];
  if (total <= pull) {
    return prisma.questionBankItem.findMany({ where, orderBy: { id: "asc" } });
  }

  const startId = await pickRandomStartId(where, total);
  if (!startId) return [];

  const primary = await prisma.questionBankItem.findMany({
    where: { AND: [where, { id: { gte: startId } }] },
    take: pull,
    orderBy: { id: "asc" },
  });

  if (primary.length >= pull) return primary;

  const wrap = await prisma.questionBankItem.findMany({
    where: { AND: [where, { id: { lt: startId } }] },
    take: pull - primary.length,
    orderBy: { id: "asc" },
  });

  return [...primary, ...wrap];
}

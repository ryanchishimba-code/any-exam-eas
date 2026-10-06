import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type BankRow = Parameters<
  typeof import("@/lib/mpje/parse-bank-options").enrichBankItemFromRow
>[0];

/** OFFSET scans beyond this row count risk Neon statement timeouts on large banks. */
const LARGE_POOL_THRESHOLD = 1500;
const MAX_OFFSET_SCAN = 400;

/** Pseudo-random CUID between bounds for indexed `id >= probe` seeks. */
function randomIdBetween(minId: string, maxId: string): string {
  const len = Math.max(minId.length, maxId.length);
  let out = "";
  for (let i = 0; i < len; i++) {
    const a = minId.charCodeAt(i) ?? 0;
    const b = maxId.charCodeAt(i) ?? 0;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    out += String.fromCharCode(lo + Math.floor(Math.random() * Math.max(1, hi - lo + 1)));
  }
  return out;
}

/**
 * Pick a random row start without scanning millions of rows via OFFSET.
 * Small pools use OFFSET; large pools use indexed id probes on (fieldId, active, qaPassed, id).
 */
export async function pickRandomStartId(
  where: Prisma.QuestionBankItemWhereInput,
  total?: number
): Promise<string | null> {
  const count = total ?? (await prisma.questionBankItem.count({ where }));
  if (count <= 0) return null;

  if (count === 1) {
    const row = await prisma.questionBankItem.findFirst({
      where,
      select: { id: true },
    });
    return row?.id ?? null;
  }

  if (count <= LARGE_POOL_THRESHOLD) {
    const offset = Math.floor(Math.random() * count);
    const row = await prisma.questionBankItem.findFirst({
      where,
      select: { id: true },
      orderBy: { id: "asc" },
      skip: offset,
    });
    return row?.id ?? null;
  }

  const minRow = await prisma.questionBankItem.findFirst({
    where,
    select: { id: true },
    orderBy: { id: "asc" },
  });
  const maxRow = await prisma.questionBankItem.findFirst({
    where,
    select: { id: true },
    orderBy: { id: "desc" },
  });
  const minId = minRow?.id;
  const maxId = maxRow?.id;
  if (!minId) return null;
  if (!maxId || minId === maxId) return minId;

  for (let attempt = 0; attempt < 5; attempt++) {
    const probe = randomIdBetween(minId, maxId);
    const hit = await prisma.questionBankItem.findFirst({
      where: { AND: [where, { id: { gte: probe } }] },
      select: { id: true },
      orderBy: { id: "asc" },
    });
    if (hit?.id) return hit.id;
  }

  const cappedOffset = Math.floor(Math.random() * Math.min(count, MAX_OFFSET_SCAN));
  const fallback = await prisma.questionBankItem.findFirst({
    where,
    select: { id: true },
    orderBy: { id: "asc" },
    skip: cappedOffset,
  });
  return fallback?.id ?? minId;
}

const SCATTER_WINDOWS = 8;

async function rowsFromId(
  where: Prisma.QuestionBankItemWhereInput,
  startId: string,
  take: number
): Promise<BankRow[]> {
  const primary = await prisma.questionBankItem.findMany({
    where: { AND: [where, { id: { gte: startId } }] },
    take,
    orderBy: { id: "asc" },
  });
  if (primary.length >= take) return primary;
  const wrap = await prisma.questionBankItem.findMany({
    where: { AND: [where, { id: { lt: startId } }] },
    take: take - primary.length,
    orderBy: { id: "asc" },
  });
  return [...primary, ...wrap];
}

async function scatterStartIds(
  where: Prisma.QuestionBankItemWhereInput,
  total: number,
  windows: number
): Promise<string[]> {
  if (total <= LARGE_POOL_THRESHOLD) {
    const starts: string[] = [];
    for (let i = 0; i < windows; i++) {
      const id = await pickRandomStartId(where, total);
      if (id) starts.push(id);
    }
    return starts;
  }

  const minRow = await prisma.questionBankItem.findFirst({
    where,
    select: { id: true },
    orderBy: { id: "asc" },
  });
  const maxRow = await prisma.questionBankItem.findFirst({
    where,
    select: { id: true },
    orderBy: { id: "desc" },
  });
  const minId = minRow?.id;
  const maxId = maxRow?.id;
  if (!minId) return [];
  if (!maxId || minId === maxId) return [minId];

  const starts: string[] = [];
  for (let attempt = 0; attempt < windows; attempt++) {
    const probe = randomIdBetween(minId, maxId);
    const hit = await prisma.questionBankItem.findFirst({
      where: { AND: [where, { id: { gte: probe } }] },
      select: { id: true },
      orderBy: { id: "asc" },
    });
    if (hit?.id) starts.push(hit.id);
  }
  return starts.length > 0 ? starts : [minId];
}

/**
 * Random rows from the whole eligible bank. Several short id probes are
 * merged so one generator batch (consecutive ids) cannot fill the pool.
 */
export async function sampleQuestionBankRows(params: {
  where: Prisma.QuestionBankItemWhereInput;
  pull: number;
  total?: number;
}): Promise<BankRow[]> {
  const { where, pull } = params;
  const total = params.total ?? (await prisma.questionBankItem.count({ where }));
  if (total <= 0) return [];
  if (total <= pull) {
    return prisma.questionBankItem.findMany({ where, orderBy: { id: "asc" }, take: pull });
  }

  const windows = Math.min(SCATTER_WINDOWS, Math.max(2, Math.ceil(pull / 40)));
  const perWindow = Math.max(1, Math.ceil(pull / windows));
  const starts = await scatterStartIds(where, total, windows);
  const seen = new Set<string>();
  const out: BankRow[] = [];
  const take = (rows: BankRow[]) => {
    for (const row of rows) {
      if (out.length >= pull) return;
      if (!row.id || seen.has(row.id)) continue;
      seen.add(row.id);
      out.push(row);
    }
  };

  for (const startId of starts) {
    if (out.length >= pull) break;
    take(await rowsFromId(where, startId, perWindow));
  }

  if (out.length < pull && starts[0]) {
    take(await rowsFromId(where, starts[0], pull));
  }

  return out.slice(0, pull);
}

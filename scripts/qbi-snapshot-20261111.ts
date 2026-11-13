/**
 * Copy a named set of QuestionBankItem rows into qbi_<name>_20261111_backup.
 *
 * Dry-run creates the table inside a transaction and rolls it back.
 * --apply commits the table. QuestionBankItem is not updated.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

class DryRunRollback extends Error {
  constructor() {
    super("dry-run rollback");
    this.name = "DryRunRollback";
  }
}

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`unexpected column: ${name}`);
  return `"${name}"`;
}

export function assertBackupName(name: string): string {
  if (!/^qbi_[a-z0-9_]+_20261111_backup$/.test(name)) {
    throw new Error(`backup table name is not in the approved form: ${name}`);
  }
  return name;
}

export function assertIds(ids: readonly string[]): string[] {
  if (ids.length === 0) throw new Error("no ids to snapshot");
  if (new Set(ids).size !== ids.length) throw new Error("id list has duplicates");
  for (const id of ids) {
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`unexpected id: ${id}`);
  }
  return [...ids];
}

export async function questionBankColumns(): Promise<string[]> {
  const columns = (await prisma.$queryRawUnsafe(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
     ORDER BY ordinal_position`
  )) as Array<{ column_name: string }>;
  const names = columns.map((column) => column.column_name);
  if (!names.includes("id") || !names.includes("manual_correction")) {
    throw new Error("QuestionBankItem is missing id or manual_correction");
  }
  return names;
}

export async function snapshotQuestionRows(input: {
  backup: string;
  ids: readonly string[];
  apply: boolean;
}): Promise<{ rows: number; columns: string[] }> {
  const backup = assertBackupName(input.backup);
  const ids = assertIds(input.ids);
  const names = await questionBankColumns();
  const colSql = names.map(quoteIdent).join(", ");
  const idList = ids.map((id) => `'${id}'`).join(", ");
  const existing = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${backup}')::text AS reg,
            (SELECT COUNT(*)::int FROM "QuestionBankItem" WHERE id IN (${idList})) AS live_rows`
  )) as Array<{ reg: string | null; live_rows: number }>;
  if (existing[0]?.reg) throw new Error(`${backup} already exists`);
  if (existing[0]?.live_rows !== ids.length) {
    throw new Error(`${backup}: ${existing[0]?.live_rows ?? 0} of ${ids.length} ids exist`);
  }

  const write = async (tx: PrismaClient) => {
    await tx.$executeRawUnsafe(`CREATE TABLE ${backup} (LIKE "QuestionBankItem" INCLUDING ALL)`);
    const inserted = (await tx.$queryRawUnsafe(`
      WITH ins AS (
        INSERT INTO ${backup} (${colSql})
        SELECT ${colSql}
        FROM "QuestionBankItem"
        WHERE id IN (${idList})
        RETURNING id
      )
      SELECT COUNT(*)::int AS n FROM ins
    `)) as Array<{ n: number }>;
    if (inserted[0]?.n !== ids.length) {
      throw new Error(`${backup} inserted ${inserted[0]?.n ?? 0}, expected ${ids.length}`);
    }
  };

  if (!input.apply) {
    try {
      await prisma.$transaction(async (tx) => {
        await write(tx as unknown as PrismaClient);
        throw new DryRunRollback();
      });
    } catch (error) {
      if (!(error instanceof DryRunRollback)) throw error;
    }
    return { rows: ids.length, columns: names };
  }

  await prisma.$transaction(async (tx) => {
    await write(tx as unknown as PrismaClient);
  });
  const check = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS n FROM ${backup}`
  )) as Array<{ n: number }>;
  if (check[0]?.n !== ids.length) throw new Error(`${backup} committed ${check[0]?.n} rows`);
  return { rows: ids.length, columns: names };
}

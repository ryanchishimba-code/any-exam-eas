#!/usr/bin/env node
/**
 * Restore the QuestionBankItem rows snapshotted in
 * qbi_naplex_fix2_20261025_backup before the second 2026-10-25 NAPLEX fix list.
 *
 * Dry run is the default. It writes nothing.
 *
 *   npx tsx scripts/restore-naplex-fix2-20261025.ts
 *   npx tsx scripts/restore-naplex-fix2-20261025.ts --apply
 *
 * --apply copies every column except id from the backup table back onto
 * QuestionBankItem. It does not DELETE rows and it does not drop the backup.
 * The git copy of the same snapshot is
 * scripts/data/naplex-fix2-20261025/backup.csv.
 *
 * Do not run scripts/06-rollback-DO-NOT-RUN.sql.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_fix2_20261025_backup";
const EXPECTED = 339;
const prisma = new PrismaClient();

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`Unexpected column: ${name}`);
  return `"${name}"`;
}

async function columnNames(table: string): Promise<string[]> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = $1
     ORDER BY ordinal_position`,
    table
  )) as Array<{ column_name: string }>;
  return rows.map((row) => row.column_name);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const backup = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  if (!backup[0]?.reg) throw new Error(`${BACKUP} does not exist`);

  const liveColumns = await columnNames("QuestionBankItem");
  const backupColumns = await columnNames(BACKUP);
  if (liveColumns.join(",") !== backupColumns.join(",")) {
    throw new Error(`${BACKUP} columns do not match QuestionBankItem`);
  }
  const columns = liveColumns.filter((name) => name !== "id");
  const differs = columns
    .map((name) => `q.${quoteIdent(name)} IS DISTINCT FROM b.${quoteIdent(name)}`)
    .join(" OR ");

  const counts = (await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM ${BACKUP}) AS n,
      (SELECT COUNT(*)::int FROM "QuestionBankItem" q JOIN ${BACKUP} b ON b.id = q.id) AS present,
      (SELECT COUNT(*)::int FROM "QuestionBankItem" q JOIN ${BACKUP} b ON b.id = q.id WHERE ${differs}) AS differ
  `)) as Array<{ n: number; present: number; differ: number }>;
  if (counts[0]?.n !== EXPECTED) throw new Error(`${BACKUP} has ${counts[0]?.n ?? 0} rows, expected ${EXPECTED}`);

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup rows: ${counts[0]?.n}`);
  console.log(`matching live ids: ${counts[0]?.present}`);
  console.log(`rows that differ from the backup: ${counts[0]?.differ}`);
  console.log("Restore copies every QuestionBankItem column except id. It does not delete rows.");
  if (counts[0]?.present !== EXPECTED) {
    console.log("Stopped. Not every backup id is still in QuestionBankItem.");
    process.exitCode = 1;
    return;
  }
  if (!apply) {
    console.log("No rows written.");
    return;
  }

  const assignmentsSql = Prisma.join(
    columns.map((name) => Prisma.raw(`${quoteIdent(name)} = b.${quoteIdent(name)}`)),
    ", "
  );
  const updated = await prisma.$executeRaw`
    UPDATE "QuestionBankItem" AS q
    SET ${assignmentsSql}
    FROM ${Prisma.raw(BACKUP)} AS b
    WHERE q.id = b.id
  `;
  if (updated !== EXPECTED) throw new Error(`Expected to restore ${EXPECTED} rows, updated ${updated}`);
  const after = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS differ
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
    WHERE ${differs}
  `)) as Array<{ differ: number }>;
  if (after[0]?.differ !== 0) throw new Error(`${after[0]?.differ} rows still differ from the backup`);
  console.log(`Restored ${EXPECTED} rows from ${BACKUP}.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

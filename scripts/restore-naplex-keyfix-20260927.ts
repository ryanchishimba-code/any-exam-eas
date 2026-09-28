#!/usr/bin/env node
/**
 * Restore the 278 QuestionBankItem rows snapshotted for the 2026-09-27 NAPLEX keyfix.
 *
 * The typo id is already one of the 70 proposed rows, so the snapshot is 278
 * unique ids (70 changes + 208 hides), not 279.
 *
 * Dry run (default) reports how many of those rows differ from
 * qbi_naplex_keyfix_backup_20260927. It writes nothing and does not touch the
 * NCLEX backup tables.
 *
 *   npx tsx scripts/restore-naplex-keyfix-20260927.ts
 *   npx tsx scripts/restore-naplex-keyfix-20260927.ts --apply
 *
 * Un-hiding the 208 items is a code change: remove the entries whose auditRef
 * is naplex-keyfix-hide-2026-09-27 from KEY_WRONG_PENDING_RN_REVIEW.
 * This script does not edit that list and does not drop the backup table.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const BACKUP = "qbi_naplex_keyfix_backup_20260927";
const EXPECTED = 278;
const prisma = new PrismaClient();

function quoteIdent(name: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) throw new Error(`Unexpected column: ${name}`);
  return `"${name}"`;
}

async function columnNames(): Promise<string[]> {
  const rows = (await prisma.$queryRawUnsafe(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'QuestionBankItem'
    ORDER BY ordinal_position
  `)) as Array<{ column_name: string }>;
  return rows.map((row) => row.column_name).filter((name) => name !== "id");
}

async function main() {
  const apply = process.argv.includes("--apply");
  const backup = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  if (!backup[0]?.reg) throw new Error(`${BACKUP} does not exist`);

  const counts = (await prisma.$queryRawUnsafe(`
    SELECT
      (SELECT COUNT(*)::int FROM ${BACKUP}) AS n,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2
  `)) as Array<{ n: number; b1: number; b2: number }>;
  if (counts[0]?.n !== EXPECTED) throw new Error(`${BACKUP} has ${counts[0]?.n ?? 0} rows, expected ${EXPECTED}`);
  if (counts[0]?.b1 !== 125 || counts[0]?.b2 !== 105) {
    throw new Error("NCLEX backup row counts are not 125 and 105");
  }

  const columns = await columnNames();
  const differs = columns
    .map((name) => `q.${quoteIdent(name)} IS DISTINCT FROM b.${quoteIdent(name)}`)
    .join(" OR ");
  const changed = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
    WHERE ${differs}
  `)) as Array<{ n: number }>;
  const present = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
  `)) as Array<{ n: number }>;

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup rows: ${counts[0]?.n}`);
  console.log(`matching live ids: ${present[0]?.n}`);
  console.log(`rows that differ from the backup: ${changed[0]?.n}`);
  console.log(`NCLEX backup rows left untouched: ${counts[0]?.b1} and ${counts[0]?.b2}`);
  const assignments = columns
    .map((name) => `${quoteIdent(name)} = b.${quoteIdent(name)}`)
    .join(",\n  ");
  console.log(`SQL that restores all ${EXPECTED} rows:`);
  console.log(`UPDATE "QuestionBankItem" AS q
SET
  ${assignments}
FROM ${BACKUP} AS b
WHERE q.id = b.id;`);

  if (present[0]?.n !== EXPECTED) {
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
    SELECT
      (SELECT COUNT(*)::int FROM "QuestionBankItem" q JOIN ${BACKUP} b ON b.id = q.id WHERE ${differs}) AS differ,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927) AS b1,
      (SELECT COUNT(*)::int FROM qbi_keyfix_backup_20260927_b2) AS b2
  `)) as Array<{ differ: number; b1: number; b2: number }>;
  if (after[0]?.differ !== 0) throw new Error(`${after[0]?.differ} rows still differ from the backup`);
  if (after[0]?.b1 !== 125 || after[0]?.b2 !== 105) throw new Error("NCLEX backup row count changed");
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

#!/usr/bin/env node
/**
 * Restore the 125 QuestionBankItem rows snapshotted on 2026-09-27.
 *
 * Dry run (default) reports how many of those rows differ from
 * qbi_keyfix_backup_20260927. It writes nothing.
 *
 *   npx tsx scripts/restore-nclex-keyfix-20260927.ts
 *   npx tsx scripts/restore-nclex-keyfix-20260927.ts --apply
 *
 * Un-hiding the 24 broken items is a code change: remove the entries whose
 * auditRef is nclex-keyfix-hide-2026-09-27 from KEY_WRONG_PENDING_RN_REVIEW.
 * This script does not edit that list and does not drop the backup table.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const BACKUP = "qbi_keyfix_backup_20260927";
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

  const count = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS n FROM ${BACKUP}`
  )) as Array<{ n: number }>;
  if (count[0]?.n !== 125) throw new Error(`${BACKUP} has ${count[0]?.n ?? 0} rows, expected 125`);

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
  console.log(`backup rows: ${count[0]?.n}`);
  console.log(`matching live ids: ${present[0]?.n}`);
  console.log(`rows that differ from the backup: ${changed[0]?.n}`);
  const assignments = columns
    .map((name) => `${quoteIdent(name)} = b.${quoteIdent(name)}`)
    .join(",\n  ");
  console.log("SQL that restores all 125 rows:");
  console.log(`UPDATE "QuestionBankItem" AS q
SET
  ${assignments}
FROM ${BACKUP} AS b
WHERE q.id = b.id;`);

  if (present[0]?.n !== 125) {
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
  if (updated !== 125) throw new Error(`Expected to restore 125 rows, updated ${updated}`);
  const after = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
    WHERE ${differs}
  `)) as Array<{ n: number }>;
  if (after[0]?.n !== 0) throw new Error(`${after[0]?.n} rows still differ from the backup`);
  console.log("Restored 125 rows from qbi_keyfix_backup_20260927.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

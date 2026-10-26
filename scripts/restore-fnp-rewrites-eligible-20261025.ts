#!/usr/bin/env node
/**
 * Restore the 74 QuestionBankItem rows snapshotted before the 2026-10-25
 * eligible FNP rewrite apply.
 *
 * The snapshot is qbi_fnp_rewrites_eligible_20261025_backup. It holds the
 * pre-image of every row the apply rewrote, inactivated, or clustered.
 * 1514/1526/1535/1542/1557/1568/1569 and 1538/1549/1566/1571 were not written
 * and are not in this backup. 184, 220/485/487/543, 249/309/673, and
 * 1516/1528/1543/1551/1553/1572 were applied later; restore those with
 * scripts/restore-fnp-rewrites-r20-20261025.ts.
 *
 * Dry run (default) reports how many live rows differ from the backup.
 * It writes nothing.
 *
 *   npx tsx scripts/restore-fnp-rewrites-eligible-20261025.ts
 *   npx tsx scripts/restore-fnp-rewrites-eligible-20261025.ts --apply
 *
 * --apply copies every backed-up column back onto the live rows. It does
 * not delete any row. The backup table is left in place.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const BACKUP = "qbi_fnp_rewrites_eligible_20261025_backup";
const EXPECTED = 74;
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
  if (count[0]?.n !== EXPECTED) {
    throw new Error(`${BACKUP} has ${count[0]?.n ?? 0} rows, expected ${EXPECTED}`);
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
  console.log(`backup rows: ${count[0]?.n}`);
  console.log(`matching live ids: ${present[0]?.n}`);
  console.log(`rows that differ from the backup: ${changed[0]?.n}`);

  const assignments = columns
    .map((name) => `${quoteIdent(name)} = b.${quoteIdent(name)}`)
    .join(",\n  ");
  console.log("SQL that restores the snapshotted rows:");
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
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
    WHERE ${differs}
  `)) as Array<{ n: number }>;
  if (after[0]?.n !== 0) throw new Error(`${after[0]?.n} rows still differ from the backup`);
  console.log(`Restored ${EXPECTED} rows from ${BACKUP}. The backup table was left in place.`);
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgresql://[redacted]"));
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

#!/usr/bin/env node
/**
 * Restore the 28 QuestionBankItem rows snapshotted on 2026-10-25 before the
 * NCLEX loose-ends apply, and hide the row that apply inserted.
 *
 * Dry run (default) reports how many of those rows differ from
 * qbi_nclex_loose_20261025_backup. It writes nothing.
 *
 *   npx tsx scripts/restore-nclex-loose-20261025.ts
 *   npx tsx scripts/restore-nclex-loose-20261025.ts --apply
 *
 * --apply copies every backed-up column back onto the live rows. It does not
 * delete the inserted angioedema item; it sets that row to active=false.
 * The backup table is left in place.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const BACKUP = "qbi_nclex_loose_20261025_backup";
const EXPECTED = 28;
const INSERTED_CONTENT_HASH = "2b73502a9e586a588ddbaf5928bfca630eff42328f148070b7d46fdda2dcfbf5";
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
  const inserted = await prisma.$queryRaw<Array<{ id: string; active: boolean }>>`
    SELECT id, active
    FROM "QuestionBankItem"
    WHERE "contentHash" = ${INSERTED_CONTENT_HASH}
      AND "fieldId" = 'nursing'
      AND id NOT IN (SELECT id FROM ${Prisma.raw(BACKUP)})
  `;

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup rows: ${count[0]?.n}`);
  console.log(`matching live ids: ${present[0]?.n}`);
  console.log(`rows that differ from the backup: ${changed[0]?.n}`);
  console.log(`inserted rows with the loose-ends content hash: ${inserted.length}`);
  for (const row of inserted) console.log(`insert ${row.id} active=${row.active}`);

  const assignments = columns
    .map((name) => `${quoteIdent(name)} = b.${quoteIdent(name)}`)
    .join(",\n  ");
  console.log("SQL that restores the 28 snapshotted rows:");
  console.log(`UPDATE "QuestionBankItem" AS q
SET
  ${assignments}
FROM ${BACKUP} AS b
WHERE q.id = b.id;`);
  console.log(
    `SQL that hides the inserted row: UPDATE "QuestionBankItem" SET active = false, "updatedAt" = NOW() WHERE "contentHash" = '${INSERTED_CONTENT_HASH}' AND "fieldId" = 'nursing' AND id NOT IN (SELECT id FROM ${BACKUP});`
  );

  if (present[0]?.n !== EXPECTED) {
    console.log("Stopped. Not every backup id is still in QuestionBankItem.");
    process.exitCode = 1;
    return;
  }
  if (inserted.length > 1) {
    throw new Error("more than one inserted row matches the loose-ends content hash");
  }
  if (!apply) {
    console.log("No rows written.");
    return;
  }
  if (inserted.length !== 1) {
    throw new Error("inserted row was not found; refusing to apply a partial undo");
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

  const hidden = await prisma.$executeRaw`
    UPDATE "QuestionBankItem"
    SET active = false, "updatedAt" = NOW()
    WHERE "contentHash" = ${INSERTED_CONTENT_HASH}
      AND "fieldId" = 'nursing'
      AND id NOT IN (SELECT id FROM ${Prisma.raw(BACKUP)})
  `;
  if (hidden !== 1) throw new Error(`Expected to hide 1 inserted row, updated ${hidden}`);

  const after = (await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS n
    FROM "QuestionBankItem" q
    JOIN ${BACKUP} b ON b.id = q.id
    WHERE ${differs}
  `)) as Array<{ n: number }>;
  if (after[0]?.n !== 0) throw new Error(`${after[0]?.n} rows still differ from the backup`);
  const stillActive = await prisma.$queryRaw<Array<{ active: boolean }>>`
    SELECT active
    FROM "QuestionBankItem"
    WHERE id = ${inserted[0]?.id ?? ""}
  `;
  if (stillActive[0]?.active !== false) throw new Error("inserted row is still active");
  console.log(`Restored ${EXPECTED} rows from ${BACKUP} and set the inserted row active=false.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

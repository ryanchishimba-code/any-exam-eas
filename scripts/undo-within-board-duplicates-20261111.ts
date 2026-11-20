#!/usr/bin/env node
/**
 * Restore active=true on the 11 rows hidden on 2026-11-11.
 *
 *   npx tsx scripts/undo-within-board-duplicates-20261111.ts
 *   npx tsx scripts/undo-within-board-duplicates-20261111.ts --apply
 *
 * Reads qbi_within_board_dups_20261111_backup. Does not drop that table
 * and does not update any other QuestionBankItem row.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { prisma } from "./qbi-snapshot-20261111";

const BACKUP = "qbi_within_board_dups_20261111_backup";
const EXPECTED = 11;

async function main() {
  const apply = process.argv.includes("--apply");
  const reg = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  if (!reg[0]?.reg) throw new Error(`${BACKUP} does not exist`);
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT id, "fieldId", active FROM ${BACKUP} ORDER BY id`
  )) as Array<{ id: string; fieldId: string; active: boolean }>;
  if (rows.length !== EXPECTED) throw new Error(`${BACKUP} has ${rows.length} rows, expected ${EXPECTED}`);
  for (const row of rows) {
    if (!/^[a-z0-9-]+$/.test(row.id)) throw new Error(`unexpected id: ${row.id}`);
    if (row.active !== true) throw new Error(`${row.id} was not active in the backup`);
  }
  const idList = rows.map((row) => `'${row.id}'`).join(", ");
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`restore active=true for ${rows.length} ids from ${BACKUP}`);
  if (!apply) {
    console.log("No row updated. The backup table is left in place.");
    return;
  }
  const updated = await prisma.$executeRawUnsafe(
    `UPDATE "QuestionBankItem" AS q
     SET active = b.active, "updatedAt" = NOW()
     FROM ${BACKUP} AS b
     WHERE q.id = b.id
       AND q.id IN (${idList})
       AND q."fieldId" = b."fieldId"`
  );
  if (updated !== EXPECTED) throw new Error(`restored ${updated} rows, expected ${EXPECTED}`);
  console.log(`Restored ${updated} rows. ${BACKUP} was not dropped.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

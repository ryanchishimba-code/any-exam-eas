#!/usr/bin/env node
/**
 * Undo the 2026-11-11 PANCE content writes.
 *
 *   npx tsx scripts/undo-pance-content-20261111.ts
 *   npx tsx scripts/undo-pance-content-20261111.ts --apply
 *
 * Copies options, explanation, references, manual_correction, and active
 * from qbi_pance_content_20261111_backup onto those two ids only.
 * Does not drop the backup table.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { prisma } from "./qbi-snapshot-20261111";

const BACKUP = "qbi_pance_content_20261111_backup";
const IDS = ["89a3ce02-18c0-498b-b3c4-3d4eb5d86ba2", "cmvxd2zua0000l308gmnj7fwd"];

async function main() {
  const apply = process.argv.includes("--apply");
  const reg = (await prisma.$queryRawUnsafe(
    `SELECT to_regclass('public.${BACKUP}')::text AS reg`
  )) as Array<{ reg: string | null }>;
  if (!reg[0]?.reg) throw new Error(`${BACKUP} does not exist`);
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT id, "fieldId" FROM ${BACKUP} ORDER BY id`
  )) as Array<{ id: string; fieldId: string }>;
  if (rows.length !== 2) throw new Error(`${BACKUP} has ${rows.length} rows, expected 2`);
  const got = new Set(rows.map((row) => row.id));
  for (const id of IDS) {
    if (!got.has(id)) throw new Error(`${BACKUP} is missing ${id}`);
  }
  if (rows.some((row) => row.fieldId !== "pance")) throw new Error("backup contains a non-pance row");
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`restore options, explanation, references, manual_correction, and active for ${IDS.join(", ")}`);
  if (!apply) {
    console.log("No row updated. The backup table is left in place.");
    return;
  }
  const updated = await prisma.$executeRawUnsafe(
    `UPDATE "QuestionBankItem" AS q
     SET options = b.options,
         explanation = b.explanation,
         "references" = b."references",
         manual_correction = b.manual_correction,
         active = b.active,
         "updatedAt" = NOW()
     FROM ${BACKUP} AS b
     WHERE q.id = b.id
       AND q."fieldId" = 'pance'
       AND q.id IN ('${IDS[0]}', '${IDS[1]}')`
  );
  if (updated !== 2) throw new Error(`restored ${updated} rows, expected 2`);
  console.log(`Restored 2 rows. ${BACKUP} was not dropped.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

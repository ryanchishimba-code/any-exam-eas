#!/usr/bin/env node
/**
 * Read-only served counts for the eight inventory fields.
 * Same gate as countActiveQuestions: active, qaPassed, Step 2 guard,
 * and STUDENT_ELIGIBLE_SQL (which already drops code-level hidden ids).
 *
 *   npx tsx scripts/report-served-counts-20261111.ts
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { STUDENT_ELIGIBLE_SQL } from "../src/lib/exam-prep/student-eligibility-sql";
import { USMLE_STEP2_SERVE_SQL } from "../src/lib/exam-prep/usmle/step2-serve-sql";
import { INVENTORY_FIELD_IDS } from "../src/lib/inventory/active-questions";

const prisma = new PrismaClient();

async function main() {
  const list = INVENTORY_FIELD_IDS.map((fieldId) => `'${fieldId}'`).join(", ");
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT "fieldId", COUNT(*)::int AS served
     FROM "QuestionBankItem"
     WHERE active = true
       AND "qaPassed" = true
       AND "fieldId" IN (${list})
       ${USMLE_STEP2_SERVE_SQL}
       AND ${STUDENT_ELIGIBLE_SQL}
     GROUP BY 1
     ORDER BY 1`
  )) as Array<{ fieldId: string; served: number }>;
  const byField = new Map(rows.map((row) => [row.fieldId, row.served]));
  let total = 0;
  for (const fieldId of INVENTORY_FIELD_IDS) {
    const served = byField.get(fieldId) ?? 0;
    total += served;
    console.log(`${fieldId}\t${served}`);
  }
  console.log(`total\t${total}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

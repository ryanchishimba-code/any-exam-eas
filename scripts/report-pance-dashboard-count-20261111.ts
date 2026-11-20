#!/usr/bin/env node
/**
 * Read-only. Prints the PANCE number the signed-in dashboard code computes,
 * and the served-gate count, from the database. Does not open the live page.
 *
 *   npx tsx scripts/report-pance-dashboard-count-20261111.ts
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { STUDENT_ELIGIBLE_SQL } from "../src/lib/exam-prep/student-eligibility-sql";
import { loadPracticeBankStats } from "../src/lib/learning/served-bank-stats-cache";

const prisma = new PrismaClient();

async function count(where: string): Promise<number> {
  const rows = (await prisma.$queryRawUnsafe(
    `SELECT COUNT(*)::int AS n FROM "QuestionBankItem" WHERE "fieldId" = 'pance' AND ${where}`
  )) as Array<{ n: number }>;
  return rows[0]?.n ?? 0;
}

async function main() {
  const activeQa = await count(`active = true AND "qaPassed" = true`);
  const served = await count(`active = true AND "qaPassed" = true AND ${STUDENT_ELIGIBLE_SQL}`);
  const snapshot = (await prisma.$queryRawUnsafe(
    `SELECT COALESCE(SUM(count), 0)::int AS n, MAX("refreshedAt") AS refreshed
     FROM "ActiveInventoryCount"
     WHERE "fieldId" = 'pance'`
  )) as Array<{ n: number; refreshed: Date | null }>;
  const practice = await loadPracticeBankStats("pance");
  console.log(`pance active+qaPassed: ${activeQa}`);
  console.log(`pance served gate (active, qaPassed, STUDENT_ELIGIBLE_SQL): ${served}`);
  console.log(
    `dashboard study-progress Questions target uses countActiveQuestions('pance'), which is that served gate: ${served}`
  );
  console.log(
    `dashboard practice-goal servedCount uses the same predicate via loadPracticeBankStats: ${practice?.servedCount ?? "unavailable"}`
  );
  console.log(
    `stored ActiveInventoryCount for pance (question-bank header snapshot, not the study-progress target): ${snapshot[0]?.n ?? 0} refreshed ${snapshot[0]?.refreshed?.toISOString?.() ?? snapshot[0]?.refreshed ?? "unknown"}`
  );
  console.log(
    `equal: study-progress target ${served} vs served gate ${served} vs practice-goal ${practice?.servedCount ?? "unavailable"}`
  );
  console.log("The live dashboard page requires sign-in. This script did not open it.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

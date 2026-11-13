#!/usr/bin/env node
/**
 * Snapshot nursing rows whose difficulty
 * scripts/recalibrate-question-difficulty.ts --field nursing will change.
 *
 *   npx tsx scripts/snapshot-nursing-difficulty-20261111.ts
 *   npx tsx scripts/snapshot-nursing-difficulty-20261111.ts --apply
 *
 * --apply commits qbi_nursing_difficulty_20261111_backup.
 * It does not update QuestionBankItem.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { proposeDifficultyChanges } from "../src/lib/exam-prep/difficulty-calibration";
import { prisma, snapshotQuestionRows } from "./qbi-snapshot-20261111";

const BACKUP = "qbi_nursing_difficulty_20261111_backup";

async function changeIds(): Promise<string[]> {
  const rows = await prisma.$queryRaw<
    { id: string; difficulty: number | null; answered: number; correct: number }[]
  >`
    SELECT qbi.id,
      qbi.difficulty,
      COUNT(qa.id)::int AS answered,
      COALESCE(SUM(CASE WHEN qa.correct THEN 1 ELSE 0 END), 0)::int AS correct
    FROM "QuestionBankItem" qbi
    JOIN "QuestionAttempt" qa ON qa."bankItemId" = qbi.id
    WHERE qbi."fieldId" = 'nursing'
      AND qbi.active = true
      AND qbi."qaPassed" = true
    GROUP BY qbi.id, qbi.difficulty
  `;
  return proposeDifficultyChanges(rows).map((change) => change.id);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const ids = await changeIds();
  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`backup: ${BACKUP}`);
  console.log(`nursing difficulty rows to snapshot: ${ids.length}`);
  console.log("QuestionBankItem is not updated.");
  if (ids.length === 0) {
    console.log("No rows would change. Backup table not created.");
    return;
  }
  const result = await snapshotQuestionRows({ backup: BACKUP, ids, apply });
  console.log(apply ? `Committed ${result.rows} rows.` : `Would commit ${result.rows} rows, then roll back.`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

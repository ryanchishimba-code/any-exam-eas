#!/usr/bin/env node
/**
 * Read-only CLI report: per-question attempts, % correct, and avg time
 * for the judgment10 pilot batch (QuestionAttempt.bankItemId).
 *
 *   npx tsx scripts/report-judgment10-performance.ts
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { loadJudgmentPilotPerformance } from "../src/lib/judgment-pilot/performance-stats";

async function main() {
  const report = await loadJudgmentPilotPerformance();
  console.log(`\nJudgment pilot performance — ${report.batchId}`);
  console.log(`Generated: ${report.generatedAt}\n`);

  if (report.items.length === 0) {
    console.log("No pilot items found in QuestionBankItem (check batch tag / apply script).");
    return;
  }

  const header = [
    "Pilot ID",
    "Field",
    "Type",
    "Attempts",
    "Students",
    "% Correct",
    "Avg ms",
  ];
  console.log(header.join("\t"));

  for (const row of report.items) {
    console.log(
      [
        row.pilotItemId,
        row.fieldId,
        row.itemType,
        row.attempts,
        row.uniqueStudents,
        row.pctCorrect == null ? "—" : `${row.pctCorrect}%`,
        row.avgDurationMs == null ? "—" : row.avgDurationMs,
      ].join("\t")
    );
  }

  console.log("\nTotals:");
  console.log(
    `  attempts: ${report.totals.attempts}, students: ${report.totals.uniqueStudents}, % correct: ${
      report.totals.pctCorrect == null ? "—" : `${report.totals.pctCorrect}%`
    }`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

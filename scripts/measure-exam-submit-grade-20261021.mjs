#!/usr/bin/env node
/**
 * Times server-side grading for a 280-answer submit payload (no HTTP).
 *
 *   npx tsx scripts/measure-exam-submit-grade-20261021.mjs
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

const TARGET = 280;

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const { gradeExamAnswerRecordsWithDetails } = await import(
    "../src/lib/exam-sessions/grade-stored-answer.ts"
  );

  const rows = await prisma.questionBankItem.findMany({
    where: { active: true, qaPassed: true, fieldId: "usmle-step-1" },
    select: { id: true, correctAnswer: true },
    take: TARGET,
  });
  if (rows.length < TARGET) {
    console.error(`Need ${TARGET} items, found ${rows.length}`);
    process.exit(1);
  }

  const records = rows.map((row, i) => ({
    questionIndex: i,
    questionId: row.id,
    selected: row.correctAnswer?.split("|||")[0]?.trim() || "A",
    correct: false,
    answeredAt: new Date().toISOString(),
  }));

  const { loadStoredStudyQuestion } = await import(
    "../src/lib/questions/reveal-stored-item.ts"
  );

  const legacyStart = performance.now();
  for (const row of records) {
    await loadStoredStudyQuestion(row.questionId);
  }
  const legacyLoadMs = Math.round(performance.now() - legacyStart);

  const start = performance.now();
  const { graded } = await gradeExamAnswerRecordsWithDetails(records);
  const batchedGradeMs = Math.round(performance.now() - start);

  console.log(
    JSON.stringify(
      {
        itemCount: graded.length,
        legacySequentialLoadMs: legacyLoadMs,
        legacySequentialLoadSec: (legacyLoadMs / 1000).toFixed(2),
        legacyGradePlusOverlayEstimateMs: legacyLoadMs * 2,
        batchedGradeMs,
        batchedGradeSec: (batchedGradeMs / 1000).toFixed(2),
        targetSec: 10,
        underTarget: batchedGradeMs < 10_000,
        note:
          "Client previously also issued ~N sequential PATCH autosaves at submit; removed in this PR.",
      },
      null,
      2
    )
  );

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

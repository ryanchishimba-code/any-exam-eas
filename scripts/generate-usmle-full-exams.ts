#!/usr/bin/env node
/**
 * Generate USMLE full-length block-style practice exams (default: 10 × 75–85 questions).
 * Alternates Step 1 and Step 2 CK per exam number. Outputs JSON artifacts and optionally inserts into DB.
 *
 * Usage:
 *   npm run db:generate-usmle-full-exams
 *   npm run db:generate-usmle-full-exams -- --exams 1 --count 80 --dry-run
 *   npm run db:generate-usmle-full-exams -- --insert
 *
 * Requires OPENAI_API_KEY. DATABASE_URL only needed with --insert.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

import {
  generateUsmleFullExamSet,
  serializeExamForImport,
  insertUsmleFullExam,
} from "../src/lib/exam-prep/usmle";

function parseArgs() {
  const args = process.argv.slice(2);
  let exams = 10;
  let count: number | undefined;
  let dryRun = false;
  let insert = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exams" && args[i + 1]) exams = parseInt(args[++i]!, 10);
    else if (args[i] === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--insert") insert = true;
  }

  return { exams, count, dryRun, insert };
}

async function main() {
  const { exams, count, dryRun, insert } = parseArgs();
  const ARTIFACTS = path.join(process.cwd(), "artifacts");
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  const countLabel = count ? `${count}` : "75–85 (varied per exam)";
  console.log(`Generating ${exams} USMLE full-length exams (${countLabel} questions each)…`);

  const batchId = `usmle-full-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  let totalInserted = 0;
  let totalSkipped = 0;

  const result = await generateUsmleFullExamSet({
    examCount: exams,
    questionCountPerExam: count,
    batchId,
    onExamComplete: async (exam) => {
      const exportData = serializeExamForImport(exam);
      const examPath = path.join(
        ARTIFACTS,
        `usmle-full-exam-${exam.examNumber}-${batchId}.json`
      );
      fs.writeFileSync(examPath, JSON.stringify(exportData, null, 2));
      console.log(
        `  ✓ Exam ${exam.examNumber} (${exam.stepLevel}): ${exam.qaReport.accepted}/${exam.questionCount} passed QA → ${examPath}`
      );

      if (insert && !dryRun) {
        const { ensureDatabaseUrlEnv } = await import("./resolve-database-url.mjs");
        ensureDatabaseUrlEnv();
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        try {
          const insertResult = await insertUsmleFullExam(prisma, exam);
          totalInserted += insertResult.created;
          totalSkipped += insertResult.skipped;
          console.log(
            `    DB: +${insertResult.created} inserted, ${insertResult.linked} linked (${insertResult.skipped} skipped dupes)`
          );
        } finally {
          await prisma.$disconnect();
        }
      }
    },
  });

  const manifestPath = path.join(ARTIFACTS, `usmle-full-exams-${result.batchId}.json`);
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        batchId: result.batchId,
        examCount: exams,
        questionCountPerExam: count ?? "75-85-varied",
        totalAccepted: result.totalAccepted,
        totalRejected: result.totalRejected,
        exams: result.exams.map((e) => ({
          examNumber: e.examNumber,
          title: e.title,
          stepLevel: e.stepLevel,
          accepted: e.qaReport.accepted,
          rejected: e.qaReport.rejected,
          allPassed: e.qaReport.allPassed,
          blueprintSummary: e.blueprintSummary,
          formatSummary: e.formatSummary,
          taskSummary: e.taskSummary,
        })),
        generatedAt: new Date().toISOString(),
        inserted: insert && !dryRun ? { created: totalInserted, skipped: totalSkipped } : null,
      },
      null,
      2
    )
  );

  console.log(`\n=== Complete ===`);
  console.log(`Batch: ${result.batchId}`);
  console.log(`Accepted: ${result.totalAccepted} | Rejected: ${result.totalRejected}`);
  console.log(`Manifest: ${manifestPath}`);

  if (insert && !dryRun) {
    console.log(`DB inserted: ${totalInserted} (${totalSkipped} skipped dupes)`);
    console.log(`Next: npm run db:qa-gate-usmle-best`);
  } else if (dryRun) {
    console.log(`Dry run — JSON artifacts only, no DB insert.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

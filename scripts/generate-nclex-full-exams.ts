#!/usr/bin/env node
/**
 * Generate NCLEX-RN full-length practice exams (default: 10 × 80 questions).
 * Outputs database-ready JSON to artifacts/ and optionally inserts into DB.
 *
 * Usage:
 *   npm run db:generate-nclex-full-exams
 *   npm run db:generate-nclex-full-exams -- --exams 1 --count 80 --dry-run
 *   npm run db:generate-nclex-full-exams -- --insert
 *
 * Requires OPENAI_API_KEY. DATABASE_URL only needed with --insert.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

import {
  generateNclexFullExamSet,
  serializeExamForImport,
  insertNclexFullExamItems,
} from "../src/lib/exam-prep/nclex";

function parseArgs() {
  const args = process.argv.slice(2);
  let exams = 10;
  let count = 80;
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

  console.log(`Generating ${exams} NCLEX-RN full-length exams (${count} questions each)…`);

  const batchId = `nclex-full-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  let totalInserted = 0;
  let totalSkipped = 0;

  const result = await generateNclexFullExamSet({
    examCount: exams,
    questionCountPerExam: count,
    batchId,
    onExamComplete: async (exam) => {
      const exportData = serializeExamForImport(exam);
      const examPath = path.join(
        ARTIFACTS,
        `nclex-full-exam-${exam.examNumber}-${batchId}.json`
      );
      fs.writeFileSync(examPath, JSON.stringify(exportData, null, 2));
      console.log(
        `  ✓ Exam ${exam.examNumber}: ${exam.qaReport.accepted}/${exam.questionCount} passed QA → ${examPath}`
      );

      if (insert && !dryRun) {
        const { ensureDatabaseUrlEnv } = await import("./resolve-database-url.mjs");
        ensureDatabaseUrlEnv();
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        try {
          const insertResult = await insertNclexFullExamItems(prisma, exam, { batchId });
          totalInserted += insertResult.created;
          totalSkipped += insertResult.skipped;
          console.log(
            `    DB: exam ${insertResult.examId} — +${insertResult.created} items, ${insertResult.linked} linked (${insertResult.skipped} skipped dupes)`
          );
        } finally {
          await prisma.$disconnect();
        }
      }
    },
  });


  const manifestPath = path.join(ARTIFACTS, `nclex-full-exams-${result.batchId}.json`);
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        batchId: result.batchId,
        examCount: exams,
        questionCountPerExam: count,
        totalAccepted: result.totalAccepted,
        totalRejected: result.totalRejected,
        exams: result.exams.map((e) => ({
          examNumber: e.examNumber,
          title: e.title,
          accepted: e.qaReport.accepted,
          rejected: e.qaReport.rejected,
          allPassed: e.qaReport.allPassed,
          blueprintSummary: e.blueprintSummary,
          caseStudyGroups: e.caseStudyGroups,
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
    console.log(`DB inserted: ${totalInserted} (${totalSkipped} skipped)`);
    console.log(`Next: npm run db:qa-gate-nclex-best`);
  } else if (dryRun) {
    console.log(`Dry run — JSON artifacts only, no DB insert.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Compose 10 NCLEX-RN full-length practice exams from QA-passed bank items.
 * Output: artifacts/nclex-full-exam-{n}-{batch}.json (database-import ready)
 *
 * Usage:
 *   npm run db:compose-nclex-full-exams
 *   npm run db:compose-nclex-full-exams -- --exams 10 --count 80
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import {
  composeNclexFullExamSet,
  serializeExamForImport,
} from "../src/lib/exam-prep/nclex/compose-full-exams";

function parseArgs() {
  const args = process.argv.slice(2);
  let exams = 10;
  let count = 80;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exams" && args[i + 1]) exams = parseInt(args[++i]!, 10);
    else if (args[i] === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
  }
  return { exams, count };
}

async function main() {
  const { exams, count } = parseArgs();
  const ARTIFACTS = path.join(process.cwd(), "artifacts");
  fs.mkdirSync(ARTIFACTS, { recursive: true });

  const batchId = `nclex-compose-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;

  console.log(`Composing ${exams} NCLEX-RN exams (${count} questions each) from QA-passed bank…`);

  const composed = await composeNclexFullExamSet({
    examCount: exams,
    questionCountPerExam: count,
  });

  for (const exam of composed) {
    const exportData = serializeExamForImport(exam);
    const examPath = path.join(ARTIFACTS, `nclex-full-exam-${exam.examNumber}-${batchId}.json`);
    fs.writeFileSync(examPath, JSON.stringify(exportData, null, 2));
    console.log(
      `  ✓ Exam ${exam.examNumber}: ${exam.qaReport.accepted}/${exam.questionCount} items → ${examPath}`
    );
  }

  const manifestPath = path.join(ARTIFACTS, `nclex-full-exams-${batchId}.json`);
  fs.writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        batchId,
        source: "qa-passed-bank-compose",
        examCount: exams,
        questionCountPerExam: count,
        totalQuestions: composed.reduce((n, e) => n + e.qaReport.accepted, 0),
        exams: composed.map((e) => ({
          examNumber: e.examNumber,
          title: e.title,
          accepted: e.qaReport.accepted,
          allPassed: e.qaReport.allPassed,
          blueprintSummary: e.blueprintSummary,
          actualSubjectMix: e.actualSubjectMix,
          caseStudyGroups: e.caseStudyGroups,
        })),
        generatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log(`\nManifest: ${manifestPath}`);
  console.log(`Total: ${composed.reduce((n, e) => n + e.qaReport.accepted, 0)} questions across ${exams} exams`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

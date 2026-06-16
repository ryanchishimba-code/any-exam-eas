#!/usr/bin/env node
/**
 * Compose and seed 10 NCLEX-RN full-length practice exams into the database.
 *
 * Usage:
 *   npm run db:seed-nclex-full-exams
 *   npm run db:seed-nclex-full-exams -- --exams 10 --count 80
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  composeNclexFullExamSet,
  insertNclexFullExamItems,
} from "../src/lib/exam-prep/nclex";

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
  const batchId = `nclex-compose-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  const prisma = new PrismaClient();

  try {
    console.log(`Composing and seeding ${exams} NCLEX exams (${count} questions each)…`);

    const composed = await composeNclexFullExamSet({
      examCount: exams,
      questionCountPerExam: count,
    });

    for (const exam of composed) {
      const result = await insertNclexFullExamItems(prisma, exam, { batchId });
      console.log(
        `  ✓ Exam ${exam.examNumber}: linked ${result.linked}/${exam.questionCount}${result.missing ? ` (${result.missing} missing ids)` : ""} → ${result.examId}`
      );
    }

    console.log(`\nDone. Batch: ${batchId}`);
    console.log(`Users can launch preset exams at /full-exam/nclex`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

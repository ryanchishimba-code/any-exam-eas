#!/usr/bin/env node
/**
 * Compose and seed NPTE-PT full-length practice exams into the database.
 *
 * Usage:
 *   npm run db:seed-npte-pt-full-exams
 *   npm run db:seed-npte-pt-full-exams -- --exams 5 --count 80
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  composeNptePtFullExamSet,
  insertNptePtFullExamItems,
} from "../src/lib/exam-prep/npte-pt";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { assessNptePtBankItem } from "../src/lib/exam-prep/npte-pt/quality-gate";

function parseArgs() {
  const args = process.argv.slice(2);
  let exams = 4;
  let count = 80;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--exams" && args[i + 1]) exams = parseInt(args[++i]!, 10);
    else if (args[i] === "--count" && args[i + 1]) count = parseInt(args[++i]!, 10);
  }
  return { exams, count };
}

async function backfillNptePtQaPassed(prisma: PrismaClient): Promise<number> {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "npte-pt", active: true, qaPassed: false },
    select: {
      id: true,
      source: true,
      subjectId: true,
      topicCategory: true,
      scenario: true,
      question: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      difficulty: true,
      taskCategory: true,
      blueprintTopic: true,
      blueprintDomain: true,
      tags: true,
      references: true,
      generationMeta: true,
    },
  });

  let updated = 0;
  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    item.id = row.id;
    item.source = row.source ?? undefined;
    const qc = assessNptePtBankItem(item, { source: row.source });
    const qaPassed = qc.serveReady && qc.reviewStatus === "approved";
    if (!qaPassed) continue;
    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: { qaPassed: true, reviewStatus: qc.reviewStatus },
    });
    updated++;
  }
  return updated;
}

async function main() {
  const { exams, count } = parseArgs();
  const batchId = `npte-pt-compose-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;
  const prisma = new PrismaClient();

  try {
    const backfilled = await backfillNptePtQaPassed(prisma);
    if (backfilled > 0) {
      console.log(`Backfilled qaPassed on ${backfilled} NPTE-PT bank items.`);
    }

    console.log(`Composing and seeding ${exams} NPTE-PT exams (${count} questions each)…`);

    const composed = await composeNptePtFullExamSet({
      examCount: exams,
      questionCountPerExam: count,
    });

    for (const exam of composed) {
      const result = await insertNptePtFullExamItems(prisma, exam, { batchId });
      console.log(
        `  ✓ Exam ${exam.examNumber}: linked ${result.linked}/${exam.questionCount}${result.missing ? ` (${result.missing} missing ids)` : ""} → ${result.examId}`
      );
    }

    console.log(`\nDone. Batch: ${batchId}`);
    console.log(`Users can launch preset exams at /full-exam/npte-pt`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

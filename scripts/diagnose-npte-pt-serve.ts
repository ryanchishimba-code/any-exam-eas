#!/usr/bin/env node
/**
 * Diagnose the NPTE-PT served-count gap: total / active / qaPassed counts vs how
 * many active rows actually pass the runtime serve gate (nptePtBankItemIsServeReady).
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { nptePtBankItemIsServeReady } from "../src/lib/exam-prep/npte-pt/clinical-gate";

const prisma = new PrismaClient();

async function main() {
  const fieldId = "npte-pt";
  const [total, active, qaPassed, activeQaPassed] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId } }),
    prisma.questionBankItem.count({ where: { fieldId, active: true } }),
    prisma.questionBankItem.count({ where: { fieldId, qaPassed: true } }),
    prisma.questionBankItem.count({ where: { fieldId, active: true, qaPassed: true } }),
  ]);

  console.log("NPTE-PT counts:");
  console.log(`  total:               ${total}`);
  console.log(`  active:              ${active}`);
  console.log(`  qaPassed:            ${qaPassed}`);
  console.log(`  active & qaPassed:   ${activeQaPassed}  <-- marketing "served" count`);

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true },
    select: {
      id: true,
      subjectId: true,
      difficulty: true,
      topicCategory: true,
      blueprintDomain: true,
      itemType: true,
      scenario: true,
      question: true,
      options: true,
      correctAnswer: true,
      explanation: true,
      solutionSteps: true,
      tags: true,
      references: true,
      source: true,
      taskCategory: true,
      blueprintTopic: true,
      reviewStatus: true,
      generationVersion: true,
      generationMeta: true,
      qaPassed: true,
    },
  });

  let serveReady = 0;
  let qaPassedButNotServeReady = 0;
  let serveReadyButNotQaPassed = 0;
  const sourceBreakdown: Record<string, { total: number; serveReady: number }> = {};

  for (const row of rows) {
    const item = enrichBankItemFromRow(row as never);
    const ready = nptePtBankItemIsServeReady(item, row.source);
    const src = row.source ?? "null";
    sourceBreakdown[src] ??= { total: 0, serveReady: 0 };
    sourceBreakdown[src].total++;
    if (ready) {
      serveReady++;
      sourceBreakdown[src].serveReady++;
    }
    if (row.qaPassed && !ready) qaPassedButNotServeReady++;
    if (!row.qaPassed && ready) serveReadyButNotQaPassed++;
  }

  console.log(`\nRuntime serve gate over ${rows.length} active rows:`);
  console.log(`  serve-ready:                 ${serveReady}`);
  console.log(`  qaPassed but NOT serveReady: ${qaPassedButNotServeReady}`);
  console.log(`  serveReady but NOT qaPassed: ${serveReadyButNotQaPassed}`);
  console.log(`\nBy source:`);
  for (const [src, s] of Object.entries(sourceBreakdown)) {
    console.log(`  ${src}: ${s.serveReady}/${s.total} serve-ready`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

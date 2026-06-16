#!/usr/bin/env node
/**
 * Audit PANCE bank blueprint alignment, task distribution, and review status.
 *
 * Usage:
 *   npm run db:audit-pance
 *   npm run db:audit-pance:json
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  assessBlueprintAlignment,
  computePanceContentQuotas,
  computePanceTaskQuotas,
  mergePanceQuotaWithCounts,
  PANCE_TARGET_TOTAL,
} from "../src/lib/exam-prep/pance";
import { panceSeedProgressByCategory } from "../src/lib/edtech/seeds/pance-seed-registry";

const prisma = new PrismaClient();

function parseArgs() {
  return { json: process.argv.includes("--json") };
}

async function main() {
  const { json } = parseArgs();

  const total = await prisma.questionBankItem.count({
    where: { fieldId: "pance", active: true },
  });
  const qaPassed = await prisma.questionBankItem.count({
    where: { fieldId: "pance", active: true, qaPassed: true },
  });

  const bySubject = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: "pance", active: true },
    _count: { id: true },
  });
  const countsByCategory: Record<string, number> = {};
  for (const row of bySubject) {
    countsByCategory[row.subjectId] = row._count.id;
  }

  const byTask = await prisma.questionBankItem.groupBy({
    by: ["taskCategory"],
    where: { fieldId: "pance", active: true, taskCategory: { not: null } },
    _count: { id: true },
  });

  const byReview = await prisma.questionBankItem.groupBy({
    by: ["reviewStatus"],
    where: { fieldId: "pance", active: true },
    _count: { id: true },
  });

  const quota = mergePanceQuotaWithCounts(countsByCategory, PANCE_TARGET_TOTAL);
  const alignment = assessBlueprintAlignment(countsByCategory, total || PANCE_TARGET_TOTAL);
  const seedProgress = panceSeedProgressByCategory();

  const report = {
    total,
    qaPassed,
    target: PANCE_TARGET_TOTAL,
    pctComplete: Math.round((total / PANCE_TARGET_TOTAL) * 100),
    contentQuotas: quota,
    taskQuotas: computePanceTaskQuotas(PANCE_TARGET_TOTAL),
    taskCounts: Object.fromEntries(
      byTask.map((r) => [r.taskCategory ?? "unset", r._count.id])
    ),
    reviewCounts: Object.fromEntries(
      byReview.map((r) => [r.reviewStatus ?? "unset", r._count.id])
    ),
    blueprintAlignment: alignment,
    seedProgress,
    auditedAt: new Date().toISOString(),
  };

  if (json) {
    const outPath = path.join(process.cwd(), "artifacts/pance-audit.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(`PANCE Bank Audit — ${total}/${PANCE_TARGET_TOTAL} (${report.pctComplete}%)`);
  console.log(`QA passed: ${qaPassed}`);
  console.log("\nContent categories (NCCPA 2025):");
  for (const q of quota) {
    console.log(
      `  ${q.label}: ${q.currentCount ?? 0}/${q.targetCount} (${Math.round(q.weight * 100)}%)`
    );
  }
  console.log("\nTask categories:");
  for (const t of computePanceTaskQuotas(PANCE_TARGET_TOTAL)) {
    const actual = report.taskCounts[t.taskCategory] ?? 0;
    console.log(`  ${t.label}: ${actual}/${t.targetCount}`);
  }
  console.log("\nReview status:");
  for (const [status, count] of Object.entries(report.reviewCounts)) {
    console.log(`  ${status}: ${count}`);
  }
  console.log(
    `\nBlueprint alignment: ${alignment.aligned ? "OK" : "NEEDS REBALANCING"}`
  );
  console.log("\nSeed progress (target 250/category):");
  for (const [cat, prog] of Object.entries(seedProgress)) {
    console.log(`  ${cat}: ${prog.count}/${prog.target} (${prog.pct}%)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

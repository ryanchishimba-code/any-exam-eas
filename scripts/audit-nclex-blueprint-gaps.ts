#!/usr/bin/env node
/**
 * Audit NCLEX bank vs Client Needs blueprint (best-tier counts).
 *
 * Usage:
 *   npm run db:audit-nclex-blueprint
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  mergeNclexQuotaWithCounts,
  resolveNclexClientNeedsCategory,
} from "../src/lib/exam-prep/nclex/blueprint-quota";
import { NCLEX_BEST_TARGET_TOTAL } from "../src/lib/exam-prep/nclex/types";

const prisma = new PrismaClient();

async function main() {
  const target = NCLEX_BEST_TARGET_TOTAL;
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  const counts: Record<string, number> = {};
  const best = rows.length;

  for (const row of rows) {
    const cat = resolveNclexClientNeedsCategory(row.subjectId);
    counts[cat] = (counts[cat] ?? 0) + 1;
  }

  const quotas = mergeNclexQuotaWithCounts(counts, target);
  const totalDeficit = quotas.reduce((s, q) => s + (q.deficit ?? 0), 0);

  const activeTotal = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true },
  });

  const report = {
    generatedAt: new Date().toISOString(),
    target,
    activeTotal,
    bestTierTotal: best,
    totalDeficit,
    quotas: quotas.map((q) => ({
      categoryId: q.categoryId,
      label: q.label,
      weight: q.weight,
      targetCount: q.targetCount,
      currentCount: q.currentCount ?? 0,
      deficit: q.deficit ?? 0,
    })),
  };

  const dir = path.join(process.cwd(), "artifacts");
  mkdirSync(dir, { recursive: true });
  const jsonPath = path.join(dir, "nclex-blueprint-gap-report.json");
  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  console.log(`\nNCLEX blueprint gap (best-tier, target ${target})\n`);
  console.log(`Active: ${activeTotal} | Best-tier (qaPassed): ${best} | Deficit: ${totalDeficit}\n`);
  for (const q of report.quotas) {
    const status = q.deficit > 0 ? `need ${q.deficit}` : "OK";
    console.log(`  ${q.label}: ${q.currentCount}/${q.targetCount} — ${status}`);
  }
  console.log(`\nJSON: ${jsonPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

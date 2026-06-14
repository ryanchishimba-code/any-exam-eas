#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { assessNclexItemQuality } from "../src/lib/exam-prep/nclex-quality-gate";

const prisma = new PrismaClient();
const TARGET = 80;
const BATCH = 500;

async function main() {
  const total = await prisma.questionBankItem.count({ where: { fieldId: "nursing", active: true } });
  const qaPassed = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  console.log(`\nNCLEX best-rate report — ${total} active items\n`);

  let lastId: string | undefined;
  let processed = 0;
  let best = 0;
  let reject = 0;
  const blockers: Record<string, number> = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "nursing", active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      const verdict = assessNclexItemQuality(enrichBankItemFromRow(row), { source: row.source });
      if (verdict.tier === "best") best++;
      else reject++;
      for (const code of verdict.issues) blockers[code] = (blockers[code] ?? 0) + 1;
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 5000 === 0 || processed === total) console.log(`  … ${processed}/${total}`);
  }

  const bestRate = total ? (best / total) * 100 : 0;
  const outPath = path.join(process.cwd(), "artifacts", "nclex-best-rate-report.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify({ total, best, bestRatePercent: bestRate, topBlockers: blockers }, null, 2));

  console.log(`\nBest tier: ${best} / ${total} (${bestRate.toFixed(1)}%)`);
  console.log(`DB qaPassed: ${qaPassed} (stale if >> best tier)`);
  console.log(bestRate >= TARGET ? "\n✓ 80% target met." : "\n⚠ Below 80%");
  console.log(`Report: ${outPath}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

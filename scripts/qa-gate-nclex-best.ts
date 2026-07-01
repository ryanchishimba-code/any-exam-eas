#!/usr/bin/env node
import { PrismaClient } from "@prisma/client";
import { nclexItemPassesBestExamGate } from "../src/lib/exam-prep/nclex-serve-gate";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { applyQaPassedBatch } from "./qa-gate-batch-utils";

const prisma = new PrismaClient();
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");
const TARGET = 80;

async function main() {
  const where = { fieldId: "nursing", active: true };
  const total = await prisma.questionBankItem.count({ where });
  console.log(`\nNCLEX best QA gate — ${total} active nursing items${dryRun ? " [dry-run]" : ""}\n`);

  let lastId: string | undefined;
  let processed = 0;
  let best = 0;
  let reject = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { ...where, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    const updates: Array<{ id: string; qaPassed: boolean }> = [];

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const pass = nclexItemPassesBestExamGate(item);
      if (pass) best++;
      else reject++;
      updates.push({ id: row.id, qaPassed: pass });
    }

    if (!dryRun) {
      await applyQaPassedBatch(prisma, updates, dryRun);
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === total) {
      console.log(`  … ${processed}/${total} (best ${best}, reject ${reject})`);
    }
  }

  const rate = processed ? (best / processed) * 100 : 0;
  console.log(`\nBest (serve): ${best} (${rate.toFixed(1)}%)`);
  console.log(`Rejected: ${reject}`);
  console.log(rate >= TARGET ? `\n✓ ≥${TARGET}% target met.` : `\n⚠ Below ${TARGET}%`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());

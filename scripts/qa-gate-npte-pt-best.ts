#!/usr/bin/env node
/**
 * Strict QA gate for NPTE-PT bank — only best-tier items get qaPassed.
 *
 * Usage:
 *   npm run db:qa-gate-npte-pt-best
 *   npm run db:qa-gate-npte-pt-best:dry
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { isNptePtBestQuality } from "../src/lib/exam-prep/npte-pt/quality-gate";
import { applyQaPassedBatch } from "./qa-gate-batch-utils";

const prisma = new PrismaClient();
const FIELD = "npte-pt";
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const total = await prisma.questionBankItem.count({ where: { fieldId: FIELD, active: true } });
  console.log(`\nNPTE-PT best QA gate — ${total} active items${dryRun ? " [dry-run]" : ""}\n`);

  let lastId: string | undefined;
  let processed = 0;
  let passed = 0;
  let failed = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: FIELD, active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;
    lastId = rows[rows.length - 1]!.id;

    const updates: Array<{ id: string; qaPassed: boolean }> = [];

    for (const row of rows) {
      processed++;
      const item = enrichBankItemFromRow(row);
      const best = isNptePtBestQuality(item);

      if (best) passed++;
      else failed++;

      updates.push({ id: row.id, qaPassed: best });
    }

    if (!dryRun) {
      await applyQaPassedBatch(prisma, updates, dryRun);
    }
  }

  console.log(
    `NPTE-PT QA gate: ${processed} audited — ${passed} pass, ${failed} fail${dryRun ? " (dry run)" : ""}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

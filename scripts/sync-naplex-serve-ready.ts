#!/usr/bin/env node
/**
 * Sync NAPLEX bank for production serve: qaPassed ↔ best-tier pool only.
 *
 * Usage:
 *   npm run db:sync-naplex-serve-ready
 *   npm run db:sync-naplex-serve-ready -- --dry-run
 *   npm run db:sync-naplex-serve-ready -- --retire-non-best
 *   npm run db:sync-naplex-serve-ready -- --retire-non-best --retire-only
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { getSubjectsForFieldId } from "../src/lib/subjects/registry";
import { applyQaPassedBatch } from "./qa-gate-batch-utils";

const prisma = new PrismaClient();
const FIELD = "pharmacy";
const BATCH = 400;
const RETIRE_CHUNK = 500;
const dryRun = process.argv.includes("--dry-run");
const retireNonBest = process.argv.includes("--retire-non-best");
const retireOnly = process.argv.includes("--retire-only");

async function retireIds(ids: string[]) {
  for (let i = 0; i < ids.length; i += RETIRE_CHUNK) {
    const chunk = ids.slice(i, i + RETIRE_CHUNK);
    if (dryRun) continue;
    await prisma.questionBankItem.updateMany({
      where: { id: { in: chunk } },
      data: { active: false, qaPassed: false },
    });
  }
}

async function main() {
  const mode = retireOnly ? "retire non-best" : "best-tier sync";
  console.log(`\nNAPLEX ${mode}${dryRun ? " [dry-run]" : ""}\n`);

  if (!dryRun) {
    await prisma.questionBankItem.updateMany({
      where: { fieldId: FIELD, active: false },
      data: { qaPassed: false },
    });
  }

  const validSubjects = new Set(getSubjectsForFieldId(FIELD).map((s) => s.id));
  let lastId: string | undefined;
  let processed = 0;
  let best = 0;
  let retired = 0;
  const qaUpdates: Array<{ id: string; qaPassed: boolean }> = [];
  const retireIdsList: string[] = [];

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: FIELD, active: true, ...(lastId ? { id: { gt: lastId } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;
    lastId = rows[rows.length - 1]!.id;

    for (const row of rows) {
      processed++;
      const item = enrichBankItemFromRow(row);
      const shouldServe = isNaplexBestQuality(item, { source: row.source });
      if (shouldServe) best++;
      else if (retireNonBest) retireIdsList.push(row.id);
      qaUpdates.push({ id: row.id, qaPassed: shouldServe });
    }

    if (!dryRun && qaUpdates.length >= BATCH) {
      await applyQaPassedBatch(prisma, qaUpdates.splice(0, qaUpdates.length), dryRun);
    }

    if (processed % 2000 === 0) console.log(`  … ${processed} scanned (${best} best-tier)`);
  }

  if (!dryRun && qaUpdates.length > 0) {
    await applyQaPassedBatch(prisma, qaUpdates, dryRun);
  }

  if (retireNonBest && retireIdsList.length > 0) {
    await retireIds(retireIdsList);
    retired = retireIdsList.length;
  }

  const active = await prisma.questionBankItem.count({
    where: { fieldId: FIELD, active: true },
  });
  const served = await prisma.questionBankItem.count({
    where: { fieldId: FIELD, active: true, qaPassed: true },
  });

  const orphanServed = await prisma.questionBankItem.groupBy({
    by: ["subjectId"],
    where: { fieldId: FIELD, active: true, qaPassed: true },
    _count: { id: true },
  });
  const orphans = orphanServed.filter((r) => !validSubjects.has(r.subjectId));

  console.log(`\n  ${FIELD}: ${served} serve-ready / ${active} active`);
  if (retired) console.log(`  retired (below best tier): ${retired}`);
  if (!retireOnly && processed) {
    console.log(`  scanned: ${processed} (${((best / processed) * 100).toFixed(1)}% best-tier)`);
  }
  if (orphans.length) {
    console.log(
      `  ⚠ orphan subjectIds still served: ${orphans.map((r) => `${r.subjectId}(${r._count.id})`).join(", ")}`
    );
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

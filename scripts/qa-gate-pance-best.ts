#!/usr/bin/env node
/**
 * Strict QA gate for PANCE bank — only best-tier items get qaPassed.
 *
 * Usage:
 *   npm run db:qa-gate-pance-best
 *   npm run db:qa-gate-pance-best:dry
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { assessPanceBankItem, isPanceBestQuality } from "../src/lib/exam-prep/pance/quality-gate";

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  let dryRun = false;
  let limit = 0;
  let onlyPending = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--only-pending") onlyPending = true;
    else if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i]!, 10);
  }
  return { dryRun, limit, onlyPending };
}

async function main() {
  const { dryRun, limit, onlyPending } = parseArgs();

  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: "pance",
      active: true,
      ...(onlyPending ? { qaPassed: false } : {}),
    },
    orderBy: { updatedAt: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  let passed = 0;
  let failed = 0;
  let updated = 0;

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    const qc = assessPanceBankItem(item, { fieldId: "pance", source: row.source });
    const best = isPanceBestQuality(item);

    if (best) passed++;
    else failed++;

    const shouldPass = best;
    if (row.qaPassed !== shouldPass || row.reviewStatus !== qc.reviewStatus) {
      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            qaPassed: shouldPass,
            qaAuditedAt: new Date(),
            reviewStatus: qc.reviewStatus,
            lastReviewedAt: new Date(),
            difficulty: row.difficulty ?? qc.difficultyRating,
            generationMeta: {
              ...(typeof row.generationMeta === "object" && row.generationMeta
                ? (row.generationMeta as Record<string, unknown>)
                : {}),
              qcScore: qc.qcScore,
              qcFlags: qc.flags,
              gatedAt: new Date().toISOString(),
            },
          },
        });
      }
      updated++;
    }
  }

  console.log(
    `PANCE QA gate: ${rows.length} audited — ${passed} pass, ${failed} fail, ${updated} updated${dryRun ? " (dry run)" : ""}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

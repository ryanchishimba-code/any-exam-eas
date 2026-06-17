#!/usr/bin/env node
/**
 * Strict NAPLEX QA gate — only best-tier items get qaPassed=true.
 *
 * Usage:
 *   npm run db:qa-gate-naplex-best
 *   npm run db:qa-gate-naplex-best -- --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
} from "../src/lib/exam-prep/naplex-quality-gate";
import { applyQaPassedBatch } from "./qa-gate-batch-utils";

const prisma = new PrismaClient();
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const total = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true },
  });

  console.log(
    `\nNAPLEX best-only QA gate — ${total} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let lastId: string | undefined;
  let processed = 0;
  let best = 0;
  let acceptable = 0;
  let rejected = 0;
  const rejectCodes: Record<string, number> = {};

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "pharmacy",
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });

    if (rows.length === 0) break;

    const updates: Array<{ id: string; qaPassed: boolean }> = [];

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const verdict = assessNaplexItemQuality(item, { source: row.source });
      const pass = isNaplexBestQuality(item, { source: row.source });

      if (verdict.tier === "best") best++;
      else if (verdict.tier === "acceptable") acceptable++;
      else rejected++;

      for (const code of verdict.issues) {
        rejectCodes[code] = (rejectCodes[code] ?? 0) + 1;
      }

      updates.push({ id: row.id, qaPassed: pass });
    }

    if (!dryRun) {
      await applyQaPassedBatch(prisma, updates, dryRun);
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === total) {
      console.log(`  … ${processed}/${total} (best ${best}, acceptable ${acceptable}, reject ${rejected})`);
    }
  }

  console.log(`\n── Best-only gate complete ──`);
  console.log(`Processed:    ${processed}`);
  console.log(`Best tier:    ${best} (will serve)`);
  console.log(`Acceptable:   ${acceptable} (polished but not served)`);
  console.log(`Rejected:     ${rejected}`);
  console.log(`\nTop reject reasons:`);
  for (const [code, count] of Object.entries(rejectCodes).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
    console.log(`  ${code}: ${count}`);
  }

  if (!dryRun) {
    const served = await prisma.questionBankItem.count({
      where: { fieldId: "pharmacy", active: true, qaPassed: true },
    });
    console.log(`\nStudents will see: ${served} best-tier NAPLEX items`);
  } else {
    console.log(`\nDry-run — no database updates written.`);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

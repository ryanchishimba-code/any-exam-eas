#!/usr/bin/env node
/**
 * Generate NCLEX items into under-target Client Needs categories (best-tier gap fill).
 *
 * Usage:
 *   npm run db:rebalance-nclex
 *   npm run db:rebalance-nclex -- --exams-per-batch 1 --max-batches 5
 *   npm run db:rebalance-nclex -- --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  mergeNclexQuotaWithCounts,
  planNclexGapFillExamSlots,
  resolveNclexClientNeedsCategory,
} from "../src/lib/exam-prep/nclex/blueprint-quota";
import {
  generateNclexFullExam,
  insertNclexFullExamItems,
} from "../src/lib/exam-prep/nclex";
import { NCLEX_BEST_TARGET_TOTAL } from "../src/lib/exam-prep/nclex/types";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const LOG = path.join(ARTIFACTS, "nclex-rebalance-run.log");

function parseArgs() {
  const args = process.argv.slice(2);
  let target = NCLEX_BEST_TARGET_TOTAL;
  let examsPerBatch = 1;
  let countPerExam = 80;
  let maxBatches = 10;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--exams-per-batch" && args[i + 1]) examsPerBatch = parseInt(args[++i]!, 10);
    else if (a === "--count" && args[i + 1]) countPerExam = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--dry-run") dryRun = true;
  }

  return { target, examsPerBatch, countPerExam, maxBatches, dryRun };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

async function bestTierCountsByCategory() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, qaPassed: true },
    select: { subjectId: true },
  });

  const counts: Record<string, number> = {};
  for (const row of rows) {
    const cat = resolveNclexClientNeedsCategory(row.subjectId);
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return counts;
}

async function main() {
  const { target, examsPerBatch, countPerExam, maxBatches, dryRun } = parseArgs();

  if (!dryRun && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  log(
    `NCLEX blueprint rebalance — best-tier target ${target}, ${examsPerBatch} exam(s) × ${countPerExam}, max ${maxBatches}${dryRun ? " [dry-run]" : ""}`
  );

  let batches = 0;
  let examCounter = 9000;

  while (batches < maxBatches) {
    const counts = await bestTierCountsByCategory();
    const quotas = mergeNclexQuotaWithCounts(counts, target);
    const under = quotas.filter((q) => (q.deficit ?? 0) > 0);
    const totalDeficit = under.reduce((s, q) => s + (q.deficit ?? 0), 0);

    log(`Best-tier deficit: ${totalDeficit} across ${under.length} categories`);
    for (const q of under) {
      log(`  ${q.label}: ${q.currentCount ?? 0}/${q.targetCount} (need ${q.deficit})`);
    }

    if (totalDeficit === 0) {
      log("All Client Needs at or above best-tier target. Done.");
      break;
    }

    if (dryRun) {
      log(`Dry run — would generate ${examsPerBatch} gap-fill exam(s).`);
      break;
    }

    const focusCategoryIds = under
      .sort((a, b) => (b.deficit ?? 0) - (a.deficit ?? 0))
      .map((q) => q.categoryId);

    const deficitByCategory = Object.fromEntries(
      under.map((q) => [q.categoryId, q.deficit ?? 0])
    );

    const batchId = `nclex-gap-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;

    for (let e = 0; e < examsPerBatch; e++) {
      examCounter++;
      const slots = planNclexGapFillExamSlots({
        examNumber: examCounter,
        questionCount: countPerExam,
        focusCategoryIds,
        deficitByCategory,
      });

      log(
        `▶ Generate gap-fill exam ${examCounter} → proportional across ${focusCategoryIds.length} deficit areas`
      );
      try {
        const exam = await generateNclexFullExam({
          examNumber: examCounter,
          questionCount: countPerExam,
          batchId,
          slots,
        });

        const inserted = await insertNclexFullExamItems(prisma, exam);
        log(
          `  Exam ${examCounter}: ${exam.qaReport.accepted}/${countPerExam} QA ok — +${inserted.created} items`
        );
      } catch (err) {
        log(
          `  Exam ${examCounter} failed: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    log("▶ Best-tier QA gate");
    const { spawn } = await import("node:child_process");
    await new Promise<void>((resolve) => {
      const child = spawn(
        process.execPath,
        ["node_modules/tsx/dist/cli.mjs", "scripts/qa-gate-nclex-best.ts"],
        { cwd: process.cwd(), stdio: "inherit", env: process.env }
      );
      child.on("close", () => resolve());
    });

    batches++;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

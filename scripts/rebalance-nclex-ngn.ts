#!/usr/bin/env node
/**
 * Generate NCLEX NGN-format items until serve-ready format targets are met.
 *
 * Targets (src/lib/exam-prep/nclex/types.ts NCLEX_NGN_SERVE_TARGETS):
 *   SATA, bow-tie, matrix, ordered response, highlight, case-study groups
 *
 * Usage:
 *   npm run db:rebalance-nclex-ngn
 *   npm run db:rebalance-nclex-ngn:dry
 *   npm run db:rebalance-nclex-ngn -- --max-batches 15
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  nclexNgnDeficits,
  planNclexNgnGapFillExamSlots,
} from "../src/lib/exam-prep/nclex/blueprint-quota";
import { NCLEX_NGN_SERVE_TARGETS } from "../src/lib/exam-prep/nclex/types";
import {
  generateNclexFullExam,
  insertNclexFullExamItems,
} from "../src/lib/exam-prep/nclex";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const LOG = path.join(ARTIFACTS, "nclex-ngn-rebalance-run.log");

function parseArgs() {
  const args = process.argv.slice(2);
  let examsPerBatch = 1;
  let countPerExam = 80;
  let maxBatches = 20;
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--exams-per-batch" && args[i + 1]) examsPerBatch = parseInt(args[++i]!, 10);
    else if (a === "--count" && args[i + 1]) countPerExam = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--dry-run") dryRun = true;
  }

  return { examsPerBatch, countPerExam, maxBatches, dryRun };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

async function ngnCounts() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true, qaPassed: true },
    select: { itemType: true, generationMeta: true },
  });

  const counts: Record<string, number> = {};
  for (const row of rows) {
    let type = row.itemType?.trim() || "vignette";
    const meta =
      typeof row.generationMeta === "object" && row.generationMeta
        ? (row.generationMeta as Record<string, unknown>)
        : {};
    if (meta.caseGroupId || type === "case_study" || type === "unfolding_case") {
      type = "case_study";
    }
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return counts;
}

async function main() {
  const { examsPerBatch, countPerExam, maxBatches, dryRun } = parseArgs();

  if (!dryRun && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  log(
    `NCLEX NGN gap fill — ${examsPerBatch} exam(s) × ${countPerExam}, max ${maxBatches}${dryRun ? " [dry-run]" : ""}`
  );

  let batches = 0;
  let examCounter = 9200;

  while (batches < maxBatches) {
    const counts = await ngnCounts();
    const deficits = nclexNgnDeficits(counts, NCLEX_NGN_SERVE_TARGETS);
    const totalDeficit = deficits.reduce((s, d) => s + d.deficit, 0);

    log(`NGN format deficit: ${totalDeficit} across ${deficits.length} types`);
    for (const d of deficits) {
      log(`  ${d.itemType}: ${d.current}/${d.target} (need ${d.deficit})`);
    }

    if (totalDeficit === 0) {
      log("All NGN format targets met. Done.");
      break;
    }

    if (dryRun) {
      log(`Dry run — would generate ${examsPerBatch} NGN-heavy exam(s).`);
      break;
    }

    const batchId = `nclex-ngn-${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`;

    for (let e = 0; e < examsPerBatch; e++) {
      examCounter++;
      const slots = planNclexNgnGapFillExamSlots({
        examNumber: examCounter,
        questionCount: countPerExam,
      });

      log(`▶ Generate NGN exam ${examCounter}: ${countPerExam} slots (18 case-study + stand-alone NGN)`);
      try {
        const exam = await generateNclexFullExam({
          examNumber: examCounter,
          questionCount: countPerExam,
          batchId,
          slots,
        });

        const inserted = await insertNclexFullExamItems(prisma, exam);
        const issueHist = new Map<string, number>();
        for (const raw of exam.qaReport.issues ?? []) {
          const key = String(raw).replace(/^slot-\d+:/, "").split(",")[0] || "unknown";
          issueHist.set(key, (issueHist.get(key) ?? 0) + 1);
        }
        const topIssues = [...issueHist.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([k, n]) => `${k}:${n}`)
          .join(" · ");
        log(
          `  Exam ${examCounter}: ${exam.qaReport.accepted}/${countPerExam} QA ok — +${inserted.created} items`
        );
        if (topIssues) log(`  Reject top: ${topIssues}`);
      } catch (err) {
        log(`  Exam ${examCounter} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Soft serve QA — do NOT run best-tier gate here; it rejects authentic NGN formats
    // (bowtie/matrix/case) that lack MCQ distractor rationales.
    log("▶ NGN-preserving serve QA gate");
    const { spawn } = await import("node:child_process");
    await new Promise<void>((resolve) => {
      const child = spawn(
        process.execPath,
        ["node_modules/tsx/dist/cli.mjs", "scripts/qa-gate-nclex-ngn-serve.ts"],
        { cwd: process.cwd(), stdio: "inherit", env: process.env }
      );
      child.on("close", () => resolve());
    });

    batches++;
  }

  log(`Finished after ${batches} batch(es).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

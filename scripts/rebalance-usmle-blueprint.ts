#!/usr/bin/env node
/**
 * Fill USMLE blueprint deficits with focused AI generation.
 *
 * Usage:
 *   npm run db:rebalance-usmle -- --field usmle-step-3 --categories biostatistics,ethics,pharm-advertising,ccs
 *   npm run db:rebalance-usmle -- --field usmle-step-2 --subjects pediatrics
 *   npm run db:rebalance-usmle -- --field usmle-step-1 --subjects physiology,anatomy
 *   npm run db:rebalance-usmle -- --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  generateUsmleFullExam,
  insertUsmleFullExam,
} from "../src/lib/exam-prep/usmle";
import {
  mergeUsmleQuotaWithCounts,
  USMLE_STEP3_FORMAT_CATEGORY_IDS,
} from "../src/lib/exam-prep/usmle/blueprint-quota";
import {
  blueprintForUsmleField,
  resolveUsmleBlueprintCategory,
} from "../src/lib/exam-prep/usmle/blueprint-resolver";
import type { UsmleStepLevel } from "../src/lib/exam-prep/usmle/types";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const LOG = path.join(ARTIFACTS, "usmle-rebalance-run.log");

const FIELD_TO_STEP: Record<string, UsmleStepLevel> = {
  "usmle-step-1": "step1",
  "usmle-step-2": "step2",
  "usmle-step-3": "step3",
};

function parseArgs() {
  const args = process.argv.slice(2);
  let field = "usmle-step-3";
  let examsPerBatch = 1;
  let countPerExam = 60;
  let maxBatches = 15;
  let metric: "active" | "qaPassed" = "active";
  let dryRun = false;
  let categories: string[] = [];
  let subjects: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--field" && args[i + 1]) field = args[++i]!;
    else if (a === "--exams-per-batch" && args[i + 1]) examsPerBatch = parseInt(args[++i]!, 10);
    else if (a === "--count" && args[i + 1]) countPerExam = parseInt(args[++i]!, 10);
    else if (a === "--max-batches" && args[i + 1]) maxBatches = parseInt(args[++i]!, 10);
    else if (a === "--metric" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "active" || m === "qaPassed") metric = m;
    } else if (a === "--categories" && args[i + 1]) {
      categories = args[++i]!.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (a === "--subjects" && args[i + 1]) {
      subjects = args[++i]!.split(",").map((s) => s.trim()).filter(Boolean);
    } else if (a === "--step3-formats") {
      categories = [...USMLE_STEP3_FORMAT_CATEGORY_IDS];
      field = "usmle-step-3";
    } else if (a === "--dry-run") dryRun = true;
  }

  return { field, examsPerBatch, countPerExam, maxBatches, metric, dryRun, categories, subjects };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

async function categoryCounts(fieldId: string, metric: "active" | "qaPassed") {
  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId,
      active: true,
      ...(metric === "qaPassed" ? { qaPassed: true } : {}),
    },
    select: {
      subjectId: true,
      itemType: true,
      blueprintDomain: true,
      blueprintTopic: true,
    },
  });

  const counts: Record<string, number> = {};
  for (const row of rows) {
    const category = resolveUsmleBlueprintCategory(fieldId, row);
    if (category) counts[category] = (counts[category] ?? 0) + 1;
  }
  return { counts, total: rows.length };
}

async function main() {
  const { field, examsPerBatch, countPerExam, maxBatches, metric, dryRun, categories, subjects } =
    parseArgs();

  const stepLevel = FIELD_TO_STEP[field];
  if (!stepLevel) {
    console.error(`Unknown field: ${field}`);
    process.exit(1);
  }

  const blueprint = blueprintForUsmleField(field);
  if (!blueprint) {
    console.error(`No blueprint for ${field}`);
    process.exit(1);
  }

  if (!dryRun && !process.env.OPENAI_API_KEY?.trim()) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  const categoryMode = categories.length > 0;
  const subjectMode = subjects.length > 0;
  const focusRotation = categoryMode ? categories : subjectMode ? subjects : [];

  if (focusRotation.length === 0) {
    console.error("Pass --categories or --subjects (or --step3-formats).");
    process.exit(1);
  }

  log(
    `USMLE rebalance — ${field} (${metric}), ${examsPerBatch} exam(s) × ${countPerExam}, max ${maxBatches}${dryRun ? " [dry-run]" : ""} [focus: ${focusRotation.join(", ")}]`
  );

  let batches = 0;
  let examCounter = 9100 + (stepLevel === "step1" ? 0 : stepLevel === "step2" ? 100 : 200);
  let lastInserted = 0;

  while (batches < maxBatches) {
    const { counts, total } = await categoryCounts(field, metric);
    const quotas = mergeUsmleQuotaWithCounts(blueprint, counts, total);
    const under = quotas.filter((q) => focusRotation.includes(q.categoryId) && (q.deficit ?? 0) > 0);
    const totalDeficit = under.reduce((s, q) => s + (q.deficit ?? 0), 0);

    log(`Deficit in focus areas: ${totalDeficit} across ${under.length} categories`);
    for (const q of under) {
      log(`  ${q.label}: ${q.currentCount ?? 0}/${q.targetCount} (need ${q.deficit})`);
    }

    if (totalDeficit === 0) {
      log("Focus areas at or above target. Done.");
      break;
    }

    if (dryRun) {
      log(`Dry run — would generate ${examsPerBatch} focused exam(s).`);
      break;
    }

    const batchId = `usmle-gap-${field}-${Date.now()}`;

    for (let e = 0; e < examsPerBatch; e++) {
      const focusKey = focusRotation[(batches * examsPerBatch + e) % focusRotation.length]!;
      examCounter++;

      const genParams = {
        examNumber: examCounter,
        questionCount: countPerExam,
        batchId,
        stepLevel,
        ...(categoryMode ? { focusCategoryId: focusKey } : { focusSubjectId: focusKey }),
      };

      log(
        `▶ Generate exam ${examCounter}: ${countPerExam} slots — ${categoryMode ? "category" : "subject"} ${focusKey}`
      );

      try {
        const exam = await generateUsmleFullExam(genParams);
        const inserted = await insertUsmleFullExam(prisma, exam);
        log(
          `  Exam ${examCounter}: ${exam.qaReport.accepted}/${countPerExam} QA ok — +${inserted.created} items (${inserted.skipped} dupes)`
        );
        lastInserted += inserted.created;
      } catch (err) {
        log(`  Exam ${examCounter} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    if (lastInserted === 0 && batches >= 2) {
      log("Stopping: no inserts in recent batches.");
      break;
    }

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

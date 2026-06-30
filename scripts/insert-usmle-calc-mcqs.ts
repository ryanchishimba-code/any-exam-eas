#!/usr/bin/env node
/**
 * Insert / upsert USMLE calculation MCQs across Step 1, Step 2 CK, and Step 3.
 *
 * Usage:
 *   npm run db:insert-usmle-calc-mcqs
 *   npm run db:insert-usmle-calc-mcqs -- --dry-run
 *   npm run db:insert-usmle-calc-mcqs -- --step step1 --target 80
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { buildUsmleCalcPool } from "../src/lib/exam-prep/usmle-calc-mcq-all";
import { isUsmleCalculationItem, USMLE_CALC_TAG } from "../src/lib/exam-prep/usmle-calc-mcq-helpers";
import type { UsmleStepLevel } from "../src/lib/exam-prep/usmle/types";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import type { EnrichedBankItem } from "../src/lib/exam-prep/seed-helpers";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

const STEP_FIELD: Record<UsmleStepLevel, string> = {
  step1: "usmle-step-1",
  step2: "usmle-step-2",
  step3: "usmle-step-3",
};

function parseArgs() {
  let step: UsmleStepLevel | "all" = "all";
  let target = 60;
  const idxStep = process.argv.indexOf("--step");
  if (idxStep >= 0 && process.argv[idxStep + 1]) {
    const s = process.argv[idxStep + 1]!;
    if (s === "step1" || s === "step2" || s === "step3" || s === "all") step = s;
  }
  const idxTarget = process.argv.indexOf("--target");
  if (idxTarget >= 0 && process.argv[idxTarget + 1]) {
    target = parseInt(process.argv[idxTarget + 1]!, 10);
  }
  return { step, target };
}

function itemStepLevel(item: EnrichedBankItem): UsmleStepLevel {
  const fromPayload = item.ngnPayload?.stepLevel;
  if (fromPayload === "step1" || fromPayload === "step2" || fromPayload === "step3") {
    return fromPayload;
  }
  return "step2";
}

async function countCalcs(fieldId: string): Promise<number> {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true, qaPassed: true },
    select: { tags: true, question: true, scenario: true },
  });
  return rows.filter((r) => isUsmleCalculationItem(r)).length;
}

async function upsertItem(item: EnrichedBankItem): Promise<"created" | "updated" | "skipped"> {
  const step = itemStepLevel(item);
  const fieldId = STEP_FIELD[step];
  if (!usmleBankItemIsServeReady(item, fieldId)) return "skipped";

  const subjectId = item.subjectId ?? "internal-medicine";
  const hash = bankItemContentHash(fieldId, subjectId, item);

  const existing = await prisma.questionBankItem.findUnique({
    where: { contentHash: hash },
    select: { id: true, qaPassed: true },
  });

  if (existing) {
    if (!existing.qaPassed && !dryRun) {
      await prisma.questionBankItem.update({
        where: { id: existing.id },
        data: { qaPassed: true, active: true, qaAuditedAt: new Date(), updatedAt: new Date() },
      });
      return "updated";
    }
    return "skipped";
  }

  if (dryRun) return "created";

  await prisma.questionBankItem.create({
    data: {
      fieldId,
      subjectId,
      scenario: item.vignette ?? null,
      difficulty: item.difficulty ?? 3,
      topicCategory: item.topicCategory ?? subjectId,
      blueprintDomain: item.blueprintDomain ?? null,
      itemType: item.itemType ?? "mcq",
      stepLevel: step,
      question: item.question,
      options: serializeBankOptions(item),
      correctAnswer: item.correctAnswer,
      explanation: item.explanation,
      solutionSteps: item.solutionSteps?.length ? JSON.stringify(item.solutionSteps) : null,
      tags: item.tags ? JSON.stringify(item.tags) : JSON.stringify([USMLE_CALC_TAG]),
      references: item.references?.length ? item.references : undefined,
      source: "seed",
      contentHash: hash,
      active: true,
      qaPassed: true,
      qaAuditedAt: new Date(),
    },
  });
  return "created";
}

async function main() {
  const { step, target } = parseArgs();
  const steps: UsmleStepLevel[] =
    step === "all" ? ["step1", "step2", "step3"] : [step as UsmleStepLevel];

  const pool = buildUsmleCalcPool(200);
  const report: Record<string, unknown> = {
    generatedAt: new Date().toISOString(),
    dryRun,
    targetPerStep: target,
    steps: {} as Record<string, unknown>,
  };

  console.log(`\nUSMLE calculation MCQ insert${dryRun ? " [dry-run]" : ""}\n`);

  for (const s of steps) {
    const fieldId = STEP_FIELD[s];
    const before = await countCalcs(fieldId);
    const deficit = Math.max(0, target - before);
    const candidates = pool.filter((i) => itemStepLevel(i) === s);

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const item of candidates) {
      if (created + updated >= deficit && deficit > 0) break;
      const result = await upsertItem(item);
      if (result === "created") created++;
      else if (result === "updated") updated++;
      else skipped++;
    }

    const after = dryRun ? before + created : await countCalcs(fieldId);
    console.log(`── ${fieldId} ──`);
    console.log(`  Before: ${before} | Target: ${target} | After: ${after}`);
    console.log(`  Created: ${created} | Updated: ${updated} | Skipped: ${skipped}\n`);

    (report.steps as Record<string, unknown>)[fieldId] = {
      before,
      after,
      target,
      created,
      updated,
      skipped,
    };
  }

  const dir = path.join(process.cwd(), "artifacts");
  mkdirSync(dir, { recursive: true });
  const out = path.join(dir, "usmle-calc-insert-report.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`Report: ${out}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

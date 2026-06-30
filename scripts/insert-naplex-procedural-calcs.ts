#!/usr/bin/env node
/**
 * Insert QA-gated procedural NAPLEX calculation items until blueprint target is met.
 *
 * Usage:
 *   npx tsx scripts/insert-naplex-procedural-calcs.ts
 *   npx tsx scripts/insert-naplex-procedural-calcs.ts --dry-run
 *   npx tsx scripts/insert-naplex-procedural-calcs.ts --target 1596
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { generateNaplexProceduralCalcs } from "../src/lib/exam-prep/naplex-calc-procedural";
import { NAPLEX_CALC_CASES_V3 } from "../src/lib/exam-prep/naplex-calc-cases-v3";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { prepareNaplexBankItem } from "../src/lib/exam-prep/naplex-serve-gate";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import type { EnrichedBankItem } from "../src/lib/exam-prep/seed-helpers";

const CALC_STEM =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|quantity|total|amount|number|daily dose|infusion rate))\b/i;

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

function parseTarget(): number {
  const idx = process.argv.indexOf("--target");
  if (idx >= 0 && process.argv[idx + 1]) return parseInt(process.argv[idx + 1]!, 10);
  return Math.round(8869 * 0.18);
}

async function countTrueCalcBest() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true, itemType: "constructed_response", qaPassed: true },
  });
  let count = 0;
  for (const row of rows) {
    const item = prepareNaplexBankItem({
      subjectId: row.subjectId,
      question: row.question,
      options: [],
      correctAnswer: row.correctAnswer,
      explanation: row.explanation ?? "",
      itemType: "constructed_response",
      vignette: row.scenario ?? undefined,
    });
    const stem = row.question.includes("\n\n") ? row.question.split("\n\n").pop()! : row.question;
    if (CALC_STEM.test(stem)) count++;
  }
  return count;
}

async function upsertItem(item: EnrichedBankItem): Promise<"created" | "updated" | "skipped"> {
  const prepared = prepareNaplexBankItem(item);
  if (!isNaplexBestQuality(prepared, { source: "seed" })) return "skipped";

  const subjectId = prepared.subjectId ?? "compounding-calculations";
  const hash = bankItemContentHash("pharmacy", subjectId, prepared);

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
      fieldId: "pharmacy",
      subjectId,
      scenario: prepared.vignette ?? null,
      difficulty: prepared.difficulty ?? 3,
      topicCategory: prepared.topicCategory ?? subjectId,
      blueprintDomain: prepared.blueprintDomain ?? "naplex-2026-medication-dispensing",
      itemType: "constructed_response",
      question: prepared.question,
      options: serializeBankOptions(prepared),
      correctAnswer: prepared.correctAnswer,
      explanation: prepared.explanation,
      solutionSteps: prepared.solutionSteps?.length
        ? JSON.stringify(prepared.solutionSteps)
        : null,
      tags: prepared.tags ? JSON.stringify(prepared.tags) : null,
      references: prepared.references?.length ? prepared.references : undefined,
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
  const target = parseTarget();
  const before = await countTrueCalcBest();
  const deficit = Math.max(0, target - before);

  console.log(`\nNAPLEX procedural calc insert${dryRun ? " [dry-run]" : ""}`);
  console.log(`Target best true calcs: ${target}`);
  console.log(`Current:                ${before}`);
  console.log(`Deficit:                ${deficit}\n`);

  const pool = [...NAPLEX_CALC_CASES_V3, ...generateNaplexProceduralCalcs(2500)];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of pool) {
    if (created + before >= target) break;
    const result = await upsertItem(item);
    if (result === "created") created++;
    else if (result === "updated") updated++;
    else skipped++;
  }

  const after = dryRun ? before + created : await countTrueCalcBest();

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    target,
    before,
    after,
    created,
    updated,
    skipped,
    poolSize: pool.length,
  };

  const out = path.join(process.cwd(), "artifacts/naplex-procedural-calc-insert.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log(`Created: ${created} | Updated: ${updated} | Skipped: ${skipped}`);
  console.log(`True calc best after: ${after} / ${target}`);
  console.log(`Report: ${out}\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

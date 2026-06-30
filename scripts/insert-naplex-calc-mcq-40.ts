#!/usr/bin/env node
/**
 * Insert open-source NAPLEX calculation MCQ batch into the bank.
 *
 * Usage:
 *   npm run db:insert-naplex-calc-mcq-40
 *   npm run db:insert-naplex-calc-mcq-40 -- --dry-run
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { NAPLEX_CALC_MCQ_OPEN_SOURCE_40 } from "../src/lib/exam-prep/naplex-calc-mcq-open-source-40";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { prepareNaplexBankItem } from "../src/lib/exam-prep/naplex-serve-gate";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function main() {
  console.log(`\nInsert ${NAPLEX_CALC_MCQ_OPEN_SOURCE_40.length} open-source calc MCQs${dryRun ? " [dry-run]" : ""}\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;
  const failedItems: Array<{ stem: string; reason: string }> = [];

  for (const raw of NAPLEX_CALC_MCQ_OPEN_SOURCE_40) {
    const item = prepareNaplexBankItem(raw);
    if (!isNaplexBestQuality(item, { source: "seed" })) {
      failed++;
      failedItems.push({
        stem: item.question.slice(0, 80),
        reason: "did not pass best-tier QA gate",
      });
      continue;
    }

    const subjectId = item.subjectId ?? "compounding-calculations";
    const hash = bankItemContentHash("pharmacy", subjectId, item);
    const existing = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    if (!dryRun) {
      await prisma.questionBankItem.create({
        data: {
          fieldId: "pharmacy",
          subjectId,
          scenario: item.vignette ?? null,
          difficulty: item.difficulty ?? 3,
          topicCategory: item.topicCategory ?? subjectId,
          blueprintDomain: item.blueprintDomain ?? "naplex-2026-medication-dispensing",
          itemType: item.itemType ?? "vignette",
          question: item.question,
          options: serializeBankOptions(item),
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          tags: item.tags ? JSON.stringify(item.tags) : null,
          references: item.references?.length ? item.references : undefined,
          source: "seed",
          contentHash: hash,
          active: true,
          qaPassed: true,
          qaAuditedAt: new Date(),
        },
      });
    }
    created++;
  }

  const report = { generatedAt: new Date().toISOString(), dryRun, created, skipped, failed, failedItems };
  const out = path.join(process.cwd(), "artifacts/naplex-calc-mcq-40-insert.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log(`Created: ${created} | Skipped (duplicate): ${skipped} | Failed QA: ${failed}`);
  if (failedItems.length) {
    console.log("QA failures:");
    for (const f of failedItems) console.log(`  - ${f.stem}: ${f.reason}`);
  }
  console.log(`Report: ${out}\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

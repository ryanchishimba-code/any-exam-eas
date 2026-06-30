#!/usr/bin/env node
/**
 * Insert / upsert NAPLEX calculation MCQ batches (open-source 40 + TPN + oncology + compounding).
 *
 * Usage:
 *   npm run db:insert-naplex-calc-mcqs
 *   npm run db:insert-naplex-calc-mcqs -- --dry-run
 *   npm run db:insert-naplex-calc-mcqs -- --batch tpn
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import {
  NAPLEX_CALC_MCQ_ALL,
  NAPLEX_CALC_MCQ_BOARD_VIGNETTES_10,
  NAPLEX_CALC_MCQ_COMPOUNDING,
  NAPLEX_CALC_MCQ_ONCOLOGY,
  NAPLEX_CALC_MCQ_OPEN_SOURCE_40,
  NAPLEX_CALC_MCQ_TPN,
} from "../src/lib/exam-prep/naplex-calc-mcq-all";
import type { EnrichedBankItem } from "../src/lib/exam-prep/seed-helpers";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { prepareNaplexBankItem } from "../src/lib/exam-prep/naplex-serve-gate";
import { serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const batchArg = process.argv.find((a) => a.startsWith("--batch="))?.split("=")[1];

function resolveBatch(): EnrichedBankItem[] {
  switch (batchArg) {
    case "40":
      return NAPLEX_CALC_MCQ_OPEN_SOURCE_40;
    case "tpn":
      return NAPLEX_CALC_MCQ_TPN;
    case "oncology":
      return NAPLEX_CALC_MCQ_ONCOLOGY;
    case "compounding":
      return NAPLEX_CALC_MCQ_COMPOUNDING;
    case "board":
      return NAPLEX_CALC_MCQ_BOARD_VIGNETTES_10;
    default:
      return NAPLEX_CALC_MCQ_ALL;
  }
}

async function main() {
  const items = resolveBatch();
  console.log(
    `\nUpsert ${items.length} calc MCQs${batchArg ? ` [batch=${batchArg}]` : ""}${dryRun ? " [dry-run]" : ""}\n`
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const failedItems: Array<{ stem: string; reason: string }> = [];

  for (const raw of items) {
    const item = prepareNaplexBankItem(raw);
    if (!isNaplexBestQuality(item, { source: "seed" })) {
      failed++;
      failedItems.push({
        stem: String(item.question).slice(0, 80),
        reason: "did not pass best-tier QA gate",
      });
      continue;
    }

    const subjectId = item.subjectId ?? "compounding-calculations";
    const hash = bankItemContentHash("pharmacy", subjectId, item);
    const existing = await prisma.questionBankItem.findUnique({
      where: { contentHash: hash },
      select: { id: true, solutionSteps: true },
    });

    const solutionStepsJson = item.solutionSteps?.length
      ? JSON.stringify(item.solutionSteps)
      : null;

    if (existing) {
      const needsUpdate =
        solutionStepsJson &&
        existing.solutionSteps !== solutionStepsJson;
      if (needsUpdate && !dryRun) {
        await prisma.questionBankItem.update({
          where: { id: existing.id },
          data: {
            solutionSteps: solutionStepsJson,
            explanation: item.explanation,
            qaPassed: true,
            qaAuditedAt: new Date(),
          },
        });
        updated++;
      } else {
        skipped++;
      }
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
          solutionSteps: solutionStepsJson,
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

  const report = {
    generatedAt: new Date().toISOString(),
    batch: batchArg ?? "all",
    dryRun,
    total: items.length,
    created,
    updated,
    skipped,
    failed,
    failedItems,
  };
  const out = path.join(process.cwd(), "artifacts/naplex-calc-mcq-insert.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(report, null, 2));

  console.log(`Created: ${created} | Updated: ${updated} | Skipped: ${skipped} | Failed QA: ${failed}`);
  if (failedItems.length) {
    console.log("QA failures:");
    for (const f of failedItems) console.log(`  - ${f.stem}: ${f.reason}`);
  }
  console.log(`Report: ${out}\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

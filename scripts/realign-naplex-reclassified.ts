#!/usr/bin/env node
/**
 * Fast second-pass: fix answers on previously reclassified mislabeled CR items.
 *
 * Usage:
 *   npx tsx scripts/realign-naplex-reclassified.ts
 *   npx tsx scripts/realign-naplex-reclassified.ts --dry-run
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import {
  alignNaplexBankItemAnswers,
  correctAnswerMatchesOption,
  recoverMisclassifiedMcqAnswer,
} from "../src/lib/exam-prep/naplex-answer-align";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const reportPath = path.join(process.cwd(), "artifacts/naplex-calculation-fix-report.json");

async function main() {
  if (!existsSync(reportPath)) {
    console.error(`Missing ${reportPath} — run db:fix-naplex-calculations first.`);
    process.exit(1);
  }

  const prior = JSON.parse(readFileSync(reportPath, "utf8")) as {
    details?: { reclassified?: Array<{ id: string }> };
  };
  const ids = prior.details?.reclassified?.map((row) => row.id) ?? [];

  console.log(`\nRe-aligning ${ids.length} reclassified MCQ(s)${dryRun ? " [dry-run]" : ""}\n`);

  let realigned = 0;
  let deactivated = 0;
  let unchanged = 0;
  const details: Array<{ id: string; action: string; from?: string; to?: string }> = [];

  for (const id of ids) {
    const row = await prisma.questionBankItem.findUnique({ where: { id } });
    if (!row) continue;
    if (!row.active) {
      unchanged++;
      continue;
    }

    let item = enrichBankItemFromRow(row);
    const before = item.correctAnswer;
    const recovered = recoverMisclassifiedMcqAnswer(item);
    if (recovered && recovered !== item.correctAnswer) {
      item = { ...item, correctAnswer: recovered };
    }
    const aligned = alignNaplexBankItemAnswers(item);
    item = aligned.item;

    const scorable = correctAnswerMatchesOption(item.options, item.correctAnswer, item.itemType);
    const qaPassed = scorable && isNaplexBestQuality(item, { source: row.source });

    if (!scorable || !qaPassed) {
      deactivated++;
      details.push({ id, action: "deactivated", from: before.slice(0, 60) });
      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id },
          data: { active: false, qaPassed: false, qaAuditedAt: new Date(), updatedAt: new Date() },
        });
      }
      console.log(`  ✗ deactivate ${id}`);
      continue;
    }

    if (item.correctAnswer === before && !aligned.changed) {
      unchanged++;
      continue;
    }

    realigned++;
    details.push({
      id,
      action: "realigned",
      from: before.slice(0, 60),
      to: item.correctAnswer.slice(0, 60),
    });
    console.log(`  ✓ ${id}`);
    console.log(`    ${before.slice(0, 50)} → ${item.correctAnswer.slice(0, 50)}`);

    if (!dryRun) {
      await prisma.questionBankItem.update({
        where: { id },
        data: {
          correctAnswer: item.correctAnswer,
          options: serializeBankOptions(item),
          qaPassed: true,
          qaAuditedAt: new Date(),
          contentHash: bankItemContentHash("pharmacy", item.subjectId, item),
          updatedAt: new Date(),
        },
      });
    }
  }

  const outPath = path.join(process.cwd(), "artifacts/naplex-realign-report.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(
    outPath,
    JSON.stringify(
      { generatedAt: new Date().toISOString(), dryRun, realigned, deactivated, unchanged, details },
      null,
      2
    ),
    "utf8"
  );

  console.log(`\n── Re-align complete ──`);
  console.log(`Realigned:   ${realigned}`);
  console.log(`Deactivated: ${deactivated}`);
  console.log(`Unchanged:   ${unchanged}`);
  console.log(`Report: ${outPath}\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

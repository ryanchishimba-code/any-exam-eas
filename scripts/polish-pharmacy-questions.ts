#!/usr/bin/env node
/**
 * Polish NAPLEX (pharmacy field) questions in the database.
 *
 * Usage:
 *   npx tsx scripts/polish-pharmacy-questions.ts --dry-run
 *   npx tsx scripts/polish-pharmacy-questions.ts
 *   npx tsx scripts/polish-pharmacy-questions.ts --limit 100
 */
import { PrismaClient } from "@prisma/client";
import { questionContentHash } from "../src/lib/sync-question-bank";
import {
  needsNaplexPolish,
  polishNaplexBankItem,
  scoreNaplexBankItem,
} from "../src/lib/engine/polish/naplex-polish";
import { getFieldSubject } from "../src/lib/field-subjects";
import type { BankItem } from "../src/lib/question-bank";

const prisma = new PrismaClient();

const dryRun = process.argv.includes("--dry-run");
const all = process.argv.includes("--all");
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg >= 0 ? Number.parseInt(process.argv[limitArg + 1] ?? "0", 10) : 0;

function rowToItem(row: {
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  subjectId: string;
  tags: string | null;
}): BankItem {
  return {
    subjectId: row.subjectId,
    question: row.question,
    options: JSON.parse(row.options) as [string, string, string, string],
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    tags: row.tags ? (JSON.parse(row.tags) as string[]) : undefined,
  };
}

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { createdAt: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  console.log(`\nNAPLEX polish — ${rows.length} active pharmacy items\n`);

  let scanned = 0;
  let candidates = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let avgBefore = 0;
  let avgAfter = 0;

  for (const row of rows) {
    scanned++;
    const item = rowToItem(row);
    const before = scoreNaplexBankItem(item);
    avgBefore += before;

    if (!all && !needsNaplexPolish(item)) {
      avgAfter += before;
      skipped++;
      continue;
    }

    candidates++;
    const subject = getFieldSubject("pharmacy", row.subjectId);
    const label = subject?.label ?? row.subjectId;

    try {
      const result = polishNaplexBankItem(item, row.subjectId, label);
      avgAfter += result.qualityAfter;

      if (!result.changed) {
        skipped++;
        continue;
      }

      const newHash = questionContentHash("pharmacy", row.subjectId, result.item.question);
      const hashCollision = await prisma.questionBankItem.findFirst({
        where: { contentHash: newHash, NOT: { id: row.id } },
      });

      if (hashCollision) {
        console.warn(`  skip id=${row.id} — hash collision with ${hashCollision.id}`);
        skipped++;
        continue;
      }

      if (dryRun) {
        console.log(
          `  [dry-run] ${row.subjectId} q=${row.id.slice(0, 8)}… score ${result.qualityBefore.toFixed(2)} → ${result.qualityAfter.toFixed(2)}`
        );
        updated++;
        continue;
      }

      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          question: result.item.question,
          options: JSON.stringify(result.item.options),
          correctAnswer: result.item.correctAnswer,
          explanation: result.item.explanation,
          tags: result.item.tags ? JSON.stringify(result.item.tags) : row.tags,
          contentHash: newHash,
          source: "polished",
        },
      });
      updated++;
    } catch (e) {
      errors++;
      console.error(`  error id=${row.id}:`, e instanceof Error ? e.message : e);
    }
  }

  avgBefore = scanned ? avgBefore / scanned : 0;
  avgAfter = scanned ? avgAfter / scanned : 0;

  console.log(`\nScanned:     ${scanned}`);
  console.log(`Candidates:  ${candidates}`);
  console.log(`${dryRun ? "Would update" : "Updated"}:   ${updated}`);
  console.log(`Skipped:     ${skipped}`);
  console.log(`Errors:      ${errors}`);
  console.log(`Avg quality: ${avgBefore.toFixed(3)} → ${avgAfter.toFixed(3)}`);
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

#!/usr/bin/env node
/**
 * Polish USMLE (Step 1, Step 2 CK & Step 3) questions in the database.
 *
 * Usage:
 *   npx tsx scripts/polish-usmle-questions.ts --dry-run
 *   npx tsx scripts/polish-usmle-questions.ts --field usmle-step-1
 *   npx tsx scripts/polish-usmle-questions.ts --limit 100
 */
import { PrismaClient } from "@prisma/client";
import { questionContentHash } from "../src/lib/sync-question-bank";
import {
  needsUsmlePolish,
  polishUsmleBankItem,
  scoreUsmleBankItem,
} from "../src/lib/engine/polish/usmle-polish";
import { getFieldSubject } from "../src/lib/field-subjects";
import type { BankItem } from "../src/lib/question-bank";

const prisma = new PrismaClient();

const dryRun = process.argv.includes("--dry-run");
const all = process.argv.includes("--all");
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg >= 0 ? Number.parseInt(process.argv[limitArg + 1] ?? "0", 10) : 0;
const fieldArg = process.argv.indexOf("--field");
const fieldFilter =
  fieldArg >= 0 ? process.argv[fieldArg + 1] : undefined;

const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

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

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

async function polishField(fieldId: string) {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true },
    orderBy: { createdAt: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  console.log(`\nUSMLE polish — ${rows.length} active ${fieldId} items\n`);

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
    const before = scoreUsmleBankItem(item, fieldId);
    avgBefore += before;

    if (!all && !needsUsmlePolish(item, fieldId)) {
      avgAfter += before;
      skipped++;
      continue;
    }

    candidates++;
    const subject = getFieldSubject(fieldId, row.subjectId);
    const label = subject?.label ?? row.subjectId;

    try {
      let result = polishUsmleBankItem(
        item,
        fieldId,
        row.subjectId,
        label,
        seedFromId(row.id)
      );
      let finalItem = result.item;

      for (let attempt = 0; attempt < 8; attempt++) {
        if (!result.changed) break;

        const newHash = questionContentHash(fieldId, row.subjectId, finalItem.question);
        const hashCollision = await prisma.questionBankItem.findFirst({
          where: { contentHash: newHash, NOT: { id: row.id } },
        });

        if (!hashCollision) break;

        result = polishUsmleBankItem(
          item,
          fieldId,
          row.subjectId,
          label,
          seedFromId(row.id) + attempt * 7919 + scanned
        );
        finalItem = result.item;
      }

      avgAfter += result.qualityAfter;

      if (!result.changed) {
        skipped++;
        continue;
      }

      const finalHash = questionContentHash(fieldId, row.subjectId, finalItem.question);
      const stillCollides = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });

      if (stillCollides) {
        console.warn(`  skip id=${row.id} — hash collision with ${stillCollides.id}`);
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
          question: finalItem.question,
          options: JSON.stringify(finalItem.options),
          correctAnswer: finalItem.correctAnswer,
          explanation: finalItem.explanation,
          tags: finalItem.tags ? JSON.stringify(finalItem.tags) : row.tags,
          contentHash: finalHash,
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

  console.log(`\n[${fieldId}] Scanned:     ${scanned}`);
  console.log(`[${fieldId}] Candidates:  ${candidates}`);
  console.log(`[${fieldId}] ${dryRun ? "Would update" : "Updated"}:   ${updated}`);
  console.log(`[${fieldId}] Skipped:     ${skipped}`);
  console.log(`[${fieldId}] Errors:      ${errors}`);
  console.log(`[${fieldId}] Avg quality: ${avgBefore.toFixed(3)} → ${avgAfter.toFixed(3)}`);
}

async function main() {
  if (fieldFilter && !USMLE_FIELDS.includes(fieldFilter as (typeof USMLE_FIELDS)[number])) {
    console.error(
      `Unknown --field "${fieldFilter}". Expected one of: ${USMLE_FIELDS.join(", ")}`
    );
    process.exit(1);
  }

  const fields = fieldFilter ? [fieldFilter] : [...USMLE_FIELDS];

  for (const fieldId of fields) {
    await polishField(fieldId);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

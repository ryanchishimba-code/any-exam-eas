#!/usr/bin/env node
/**
 * Polish NCLEX (nursing field) questions in the database.
 *
 * Usage:
 *   npx tsx scripts/polish-nursing-questions.ts --dry-run
 *   npx tsx scripts/polish-nursing-questions.ts
 *   npx tsx scripts/polish-nursing-questions.ts --fix-prioritization
 *   npx tsx scripts/polish-nursing-questions.ts --all
 */
import { PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import {
  isWeakPrioritizationBankItem,
  needsNclexPolish,
  polishNclexBankItem,
  scoreNclexBankItem,
} from "../src/lib/engine/polish/nclex-polish";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";

const prisma = new PrismaClient();

const dryRun = process.argv.includes("--dry-run");
const all = process.argv.includes("--all");
const fixPrioritization = process.argv.includes("--fix-prioritization");
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg >= 0 ? Number.parseInt(process.argv[limitArg + 1] ?? "0", 10) : 0;

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true },
    orderBy: { createdAt: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  console.log(
    `\nNCLEX polish — ${rows.length} active nursing items${fixPrioritization ? " (weak prioritization only)" : ""}\n`
  );

  let scanned = 0;
  let candidates = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let avgBefore = 0;
  let avgAfter = 0;
  let collisions = 0;

  for (const row of rows) {
    scanned++;
    const item = enrichBankItemFromRow(row);
    const before = scoreNclexBankItem(item);
    avgBefore += before;

    if (fixPrioritization) {
      if (!isWeakPrioritizationBankItem(item)) {
        avgAfter += before;
        skipped++;
        continue;
      }
    } else if (!all && !needsNclexPolish(item)) {
      avgAfter += before;
      skipped++;
      continue;
    }

    candidates++;
    const subject = getFieldSubject("nursing", row.subjectId);
    const label = subject?.label ?? row.subjectId;

    try {
      let result = polishNclexBankItem(item, row.subjectId, label, seedFromId(row.id));
      let finalItem = result.item;

      for (let attempt = 0; attempt < 8; attempt++) {
        if (!result.changed) break;

        const newHash = bankItemContentHash("nursing", row.subjectId, finalItem);
        const hashCollision = await prisma.questionBankItem.findFirst({
          where: { contentHash: newHash, NOT: { id: row.id } },
        });

        if (!hashCollision) break;

        result = polishNclexBankItem(
          item,
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

      const finalHash = bankItemContentHash("nursing", row.subjectId, finalItem);
      const stillCollides = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });

      if (stillCollides) {
        collisions++;
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
          scenario: finalItem.vignette ?? finalItem.scenario ?? null,
          question: finalItem.question,
          options: serializeBankOptions(finalItem),
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

  console.log(`\nScanned:     ${scanned}`);
  console.log(`Candidates:  ${candidates}`);
  console.log(`${dryRun ? "Would update" : "Updated"}:   ${updated}`);
  console.log(`Skipped:     ${skipped}`);
  console.log(`Hash collisions: ${collisions}`);
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

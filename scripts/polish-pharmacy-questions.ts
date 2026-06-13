#!/usr/bin/env node
/**
 * Polish NAPLEX (pharmacy field) questions in the database.
 *
 * Usage:
 *   npm run db:polish-pharmacy           # polish items needing work
 *   npm run db:polish-pharmacy:all      # attempt polish on every row
 *   npm run db:polish-pharmacy:dry      # preview changes
 */
import { PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import {
  needsNaplexPolish,
  polishNaplexBankItem,
  scoreNaplexBankItem,
} from "../src/lib/engine/polish/naplex-polish";
import { getFieldSubject } from "../src/lib/field-subjects";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";

const prisma = new PrismaClient();

const dryRun = process.argv.includes("--dry-run");
const all = process.argv.includes("--all");
const limitArg = process.argv.indexOf("--limit");
const limit = limitArg >= 0 ? Number.parseInt(process.argv[limitArg + 1] ?? "0", 10) : 0;

const BATCH_SIZE = 40;
const PROGRESS_EVERY = 500;

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type RowUpdate = {
  id: string;
  data: {
    scenario: string | null;
    question: string;
    options: string;
    correctAnswer: string;
    explanation: string;
    tags: string | null;
    contentHash: string;
    qaPassed: boolean;
    qaAuditedAt: Date;
    source: string;
  };
};

async function flushUpdates(pending: RowUpdate[]) {
  if (pending.length === 0) return;
  const now = new Date();
  await prisma.$transaction(
    pending.map((u) =>
      prisma.questionBankItem.update({
        where: { id: u.id },
        data: { ...u.data, qaAuditedAt: now },
      })
    )
  );
  pending.length = 0;
}

async function main() {
  const totalCount = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true },
  });

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { id: "asc" },
    ...(limit > 0 ? { take: limit } : {}),
  });

  console.log(
    `\nNAPLEX polish — ${rows.length}/${totalCount} active pharmacy items${dryRun ? " [dry-run]" : ""}${all ? " [all]" : ""}\n`
  );

  let scanned = 0;
  let candidates = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  let collisions = 0;
  let avgBefore = 0;
  let avgAfter = 0;

  const pending: RowUpdate[] = [];

  for (const row of rows) {
    scanned++;
    const item = enrichBankItemFromRow(row);
    const before = scoreNaplexBankItem(item);
    avgBefore += before;

    if (!all && !needsNaplexPolish(item)) {
      avgAfter += before;
      skipped++;
      if (scanned % PROGRESS_EVERY === 0) {
        console.log(`  … ${scanned}/${rows.length} scanned, ${updated} updated`);
      }
      continue;
    }

    candidates++;
    const subject = getFieldSubject("pharmacy", row.subjectId);
    const label = subject?.label ?? row.subjectId;

    try {
      let result = polishNaplexBankItem(item, row.subjectId, label, seedFromId(row.id));
      let finalItem = result.item;

      for (let attempt = 0; attempt < 8; attempt++) {
        if (!result.changed) break;

        const newHash = bankItemContentHash("pharmacy", row.subjectId, finalItem);
        const hashCollision = await prisma.questionBankItem.findFirst({
          where: { contentHash: newHash, NOT: { id: row.id } },
        });

        if (!hashCollision) break;

        result = polishNaplexBankItem(
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

      const finalHash = bankItemContentHash("pharmacy", row.subjectId, finalItem);
      const stillCollides = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });

      if (stillCollides) {
        collisions++;
        skipped++;
        continue;
      }

      const qaOk = isNaplexBestQuality(finalItem, { source: "polished" });

      if (dryRun) {
        console.log(
          `  [dry-run] ${row.subjectId} q=${row.id.slice(0, 8)}… score ${result.qualityBefore.toFixed(2)} → ${result.qualityAfter.toFixed(2)} qa=${qaOk}`
        );
        updated++;
        continue;
      }

      pending.push({
        id: row.id,
        data: {
          scenario: finalItem.vignette ?? finalItem.scenario ?? null,
          question: finalItem.question,
          options: serializeBankOptions(finalItem),
          correctAnswer: finalItem.correctAnswer,
          explanation: finalItem.explanation,
          tags: finalItem.tags ? JSON.stringify(finalItem.tags) : row.tags,
          contentHash: finalHash,
          qaPassed: qaOk,
          qaAuditedAt: new Date(),
          source: "polished",
        },
      });
      updated++;

      if (pending.length >= BATCH_SIZE) {
        await flushUpdates(pending);
      }
    } catch (e) {
      errors++;
      console.error(`  error id=${row.id}:`, e instanceof Error ? e.message : e);
    }

    if (scanned % PROGRESS_EVERY === 0) {
      console.log(`  … ${scanned}/${rows.length} scanned, ${updated} updated, ${candidates} candidates`);
    }
  }

  await flushUpdates(pending);

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

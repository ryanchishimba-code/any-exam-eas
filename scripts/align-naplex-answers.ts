#!/usr/bin/env node
/**
 * Align NAPLEX correctAnswer fields with options and explanation text, then re-run QA gate.
 *
 * Usage:
 *   npm run db:align-naplex-answers
 *   npm run db:align-naplex-answers -- --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { alignNaplexBankItemAnswers } from "../src/lib/exam-prep/naplex-answer-align";
import { normalizeNaplexBankItemFields } from "../src/lib/exam-prep/naplex-bank-normalize";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const BATCH = 400;
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const total = await prisma.questionBankItem.count({
    where: { fieldId: "pharmacy", active: true },
  });

  console.log(
    `\nNAPLEX answer alignment — ${total} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let lastId: string | undefined;
  let processed = 0;
  let aligned = 0;
  let stillMismatch = 0;
  let qaPassedAfter = 0;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "pharmacy",
        active: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });

    if (rows.length === 0) break;

    const updates: Array<{
      id: string;
      data: {
        question: string;
        scenario: string | null;
        options: string;
        correctAnswer: string;
        contentHash: string;
        qaPassed: boolean;
        qaAuditedAt: Date;
      };
    }> = [];

    for (const row of rows) {
      const base = enrichBankItemFromRow(row);
      const normalized = normalizeNaplexBankItemFields(base);
      const beforeAudit = auditBankItem(normalized, "pharmacy");
      const hadMismatch = beforeAudit.issues.some(
        (i) => i.code === "correct_not_in_options" || i.code === "explanation_correct_mismatch"
      );

      const { item: alignedItem, changed } = alignNaplexBankItemAnswers(normalized);
      const finalItem = changed ? alignedItem : normalized;

      if (changed) aligned++;

      const afterAudit = auditBankItem(finalItem, "pharmacy");
      if (
        afterAudit.issues.some(
          (i) => i.code === "correct_not_in_options" || i.code === "explanation_correct_mismatch"
        )
      ) {
        stillMismatch++;
      }

      const pass = isNaplexBestQuality(finalItem, { source: row.source });
      if (pass) qaPassedAfter++;

      if (changed || hadMismatch) {
        updates.push({
          id: row.id,
          data: {
            question: finalItem.question,
            scenario: finalItem.vignette ?? finalItem.scenario ?? null,
            options: serializeBankOptions(finalItem),
            correctAnswer: finalItem.correctAnswer,
            contentHash: bankItemContentHash(finalItem),
            qaPassed: pass,
            qaAuditedAt: new Date(),
          },
        });
      }
    }

    if (!dryRun && updates.length > 0) {
      await prisma.$transaction(
        updates.map((u) =>
          prisma.questionBankItem.update({
            where: { id: u.id },
            data: u.data,
          })
        )
      );
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === total) {
      console.log(`  … ${processed}/${total} aligned ${aligned}, mismatch ${stillMismatch}`);
    }
  }

  console.log(`\n── Alignment complete ──`);
  console.log(`Processed:        ${processed}`);
  console.log(`Rows updated:     ${dryRun ? "(dry-run)" : aligned}`);
  console.log(`Still mismatched: ${stillMismatch}`);
  console.log(`Best-tier pass:   ${qaPassedAfter}`);

  if (!dryRun) {
    const served = await prisma.questionBankItem.count({
      where: { fieldId: "pharmacy", active: true, qaPassed: true },
    });
    console.log(`Students will see: ${served} NAPLEX items`);
  }
  console.log("");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

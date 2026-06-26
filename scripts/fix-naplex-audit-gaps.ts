#!/usr/bin/env node
/**
 * Fix NAPLEX audit gaps: legacy foundation MCQs and missing clinical context.
 *
 * Usage:
 *   npm run db:fix-naplex-audit-gaps
 *   npm run db:fix-naplex-audit-gaps -- --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { auditNaplexBankItem } from "../src/lib/exam-prep/naplex-bank-audit";
import {
  fixNaplexAuditGaps,
  itemStillHasAuditGap,
} from "../src/lib/exam-prep/naplex-audit-gap-fixes";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { id: "asc" },
  });

  console.log(
    `\nNAPLEX audit gap repair — ${rows.length} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let updated = 0;
  let stillGapped = 0;
  const remaining: Array<{ id: string; codes: string[] }> = [];

  for (const row of rows) {
    const before = enrichBankItemFromRow(row);
    const beforeGap = itemStillHasAuditGap(before);
    if (!beforeGap) continue;

    const { item: fixed, changed } = fixNaplexAuditGaps(before, row.id);
    if (!changed) {
      if (beforeGap) {
        stillGapped++;
        remaining.push({
          id: row.id,
          codes: auditNaplexBankItem(before).issues.map((i) => i.code),
        });
      }
      continue;
    }

    const afterGap = itemStillHasAuditGap(fixed);
    const qaPassed = isNaplexBestQuality(fixed, { source: row.source });

    if (!dryRun) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          scenario: fixed.vignette ?? fixed.scenario ?? null,
          question: fixed.question,
          options: serializeBankOptions(fixed),
          correctAnswer: fixed.correctAnswer,
          explanation: fixed.explanation,
          contentHash: bankItemContentHash("pharmacy", fixed.subjectId, fixed),
          qaPassed,
          qaAuditedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    updated++;
    if (afterGap) {
      stillGapped++;
      remaining.push({
        id: row.id,
        codes: auditNaplexBankItem(fixed).issues.map((i) => i.code),
      });
    }
  }

  console.log(`Updated:              ${updated}`);
  console.log(`Still gapped:         ${stillGapped}`);
  if (remaining.length > 0) {
    console.log(`Remaining samples:`);
    for (const r of remaining.slice(0, 10)) {
      console.log(`  ${r.id}: ${r.codes.join(", ")}`);
    }
  }
  console.log("");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

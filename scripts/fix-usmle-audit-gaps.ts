#!/usr/bin/env node
/**
 * Fix USMLE structural + editorial audit gaps for Step 1/2 (and optionally Step 3).
 *
 * Usage:
 *   npm run db:fix-usmle-audit-gaps
 *   npm run db:fix-usmle-audit-gaps -- --field usmle-step-1
 *   npm run db:fix-usmle-audit-gaps -- --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { fixUsmleAuditGaps } from "../src/lib/exam-prep/usmle-audit-gap-fixes";
import { fixUsmleEditorialGaps } from "../src/lib/exam-prep/usmle-editorial-gap-fixes";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

function parseFieldArg(): string | undefined {
  const idx = process.argv.indexOf("--field");
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

function applyGapFixes(item: ReturnType<typeof enrichBankItemFromRow>) {
  let next = item;
  let changed = false;
  for (const fix of [fixUsmleAuditGaps, fixUsmleEditorialGaps]) {
    const result = fix(next);
    if (result.changed) {
      next = result.item;
      changed = true;
    }
  }
  return { item: next, changed };
}

async function main() {
  const fieldFilter = parseFieldArg();
  const fieldIds = fieldFilter ? [fieldFilter] : [...USMLE_FIELDS];

  console.log(`\nUSMLE audit gap repair${dryRun ? " [dry-run]" : ""}\n`);

  let updated = 0;
  let bankStillFailing = 0;
  let editorialStillFailing = 0;
  let hashSkipped = 0;

  for (const fieldId of fieldIds) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true },
      orderBy: { id: "asc" },
    });

    for (const row of rows) {
      const before = enrichBankItemFromRow(row);
      const beforeBankOk = auditBankItem(before, fieldId).ok;
      const beforeEditorialReady = auditUsmleQaEditor(before, {
        fieldId,
        source: row.source,
        itemId: row.id,
      }).examReady;
      if (beforeBankOk && beforeEditorialReady) continue;

      const { item: fixed, changed } = applyGapFixes(before);
      if (!changed) {
        if (!beforeBankOk) bankStillFailing++;
        if (!beforeEditorialReady) editorialStillFailing++;
        continue;
      }

      const afterBankOk = auditBankItem(fixed, fieldId).ok;
      const afterEditorialReady = auditUsmleQaEditor(fixed, {
        fieldId,
        source: row.source,
        itemId: row.id,
      }).examReady;

      const newHash = bankItemContentHash(fieldId, fixed.subjectId, fixed);
      const duplicate = await prisma.questionBankItem.findFirst({
        where: { contentHash: newHash, NOT: { id: row.id } },
        select: { id: true },
      });

      if (duplicate) {
        hashSkipped++;
        if (!afterBankOk) bankStillFailing++;
        if (!afterEditorialReady) editorialStillFailing++;
        continue;
      }

      if (!dryRun) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            scenario: fixed.vignette ?? fixed.scenario ?? null,
            question: fixed.question,
            explanation: fixed.explanation,
            options: serializeBankOptions(fixed),
            contentHash: newHash,
            qaPassed: afterBankOk,
            qaAuditedAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      updated++;
      if (!afterBankOk) bankStillFailing++;
      if (!afterEditorialReady) editorialStillFailing++;
    }
  }

  console.log(`Updated items:                  ${updated}`);
  console.log(`Skipped (contentHash):          ${hashSkipped}`);
  console.log(`Still failing bank audit:       ${bankStillFailing}`);
  console.log(`Still not exam-ready (QA):      ${editorialStillFailing}`);
  console.log("");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

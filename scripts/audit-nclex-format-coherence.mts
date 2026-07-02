#!/usr/bin/env node
/**
 * Audit NCLEX items for clinical vignette ↔ option mismatches.
 *
 * Usage:
 *   npm run db:audit-nclex-format
 *   npm run db:audit-nclex-format -- --json
 */
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  fixNclexClinicalFormatCoherence,
  itemHasNclexClinicalFormatIssue,
  prepareNclexBankItem,
} from "../src/lib/exam-prep/nclex-format-coherence";

const prisma = new PrismaClient();
const jsonOut = process.argv.includes("--json");

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true },
    orderBy: { id: "asc" },
  });

  const flagged: Array<{ id: string; subjectId: string | null; repairable: boolean }> = [];
  let repairableAtServe = 0;

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    if (!itemHasNclexClinicalFormatIssue(item)) continue;

    const fix = fixNclexClinicalFormatCoherence(item);
    const prepared = prepareNclexBankItem(item);
    const resolvedAtServe = !itemHasNclexClinicalFormatIssue(prepared);
    if (resolvedAtServe) repairableAtServe++;

    flagged.push({
      id: row.id,
      subjectId: row.subjectId,
      repairable: fix.changed && !itemHasNclexClinicalFormatIssue(fix.item),
    });
  }

  if (jsonOut) {
    console.log(JSON.stringify({ total: rows.length, flagged: flagged.length, repairableAtServe, items: flagged }, null, 2));
    return;
  }

  console.log("\nNCLEX clinical format-coherence audit");
  console.log(`Active items:     ${rows.length}`);
  console.log(`Flagged:          ${flagged.length}`);
  console.log(`Repairable serve: ${repairableAtServe}`);

  if (flagged.length > 0) {
    console.log("\nSample flagged IDs:");
    for (const f of flagged.slice(0, 20)) {
      console.log(`  ${f.id} (${f.subjectId ?? "?"}) repairable=${f.repairable}`);
    }
  } else {
    console.log("\n✓ No clinical vignette ↔ option mismatches found.");
  }
  console.log("");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

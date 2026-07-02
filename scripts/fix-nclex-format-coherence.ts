#!/usr/bin/env node
/**
 * Fix NCLEX clinical vignettes paired with unrelated answer options.
 *
 * Usage:
 *   npm run db:fix-nclex-format
 *   npm run db:fix-nclex-format:dry
 */
import { PrismaClient } from "@prisma/client";
import { auditNclexBankItem } from "../src/lib/exam-prep/nclex-bank-audit";
import {
  fixNclexClinicalFormatCoherence,
  itemHasNclexClinicalFormatIssue,
} from "../src/lib/exam-prep/nclex-format-coherence";
import { isNclexBestQuality } from "../src/lib/exam-prep/nclex-quality-gate";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

import { buildMedSurgPrioritizationMcq } from "../src/lib/exam-prep/naplex-format-coherence";
import type { BankItem } from "../src/lib/question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function persistRepair(
  row: { id: string; source: string | null; subjectId: string },
  repaired: BankItem
): Promise<"updated" | "retired-duplicate"> {
  const contentHash = bankItemContentHash("nursing", repaired.subjectId, repaired);
  const duplicate = await prisma.questionBankItem.findFirst({
    where: { contentHash, active: true, NOT: { id: row.id } },
    select: { id: true },
  });

  if (duplicate) {
    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: { active: false, qaPassed: false, qaAuditedAt: new Date(), updatedAt: new Date() },
    });
    return "retired-duplicate";
  }

  const qaPassed = isNclexBestQuality(repaired, { source: row.source });
  await prisma.questionBankItem.update({
    where: { id: row.id },
    data: {
      scenario: repaired.vignette ?? repaired.scenario ?? null,
      question: repaired.question,
      options: serializeBankOptions(repaired),
      correctAnswer: repaired.correctAnswer,
      explanation: repaired.explanation,
      itemType: repaired.itemType ?? "vignette",
      contentHash,
      qaPassed,
      qaAuditedAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return "updated";
}

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "nursing", active: true },
    orderBy: { id: "asc" },
  });

  const flagged = rows.filter((row) => itemHasNclexClinicalFormatIssue(enrichBankItemFromRow(row)));
  const phantomPrioritization = rows.filter((row) => {
    const item = enrichBankItemFromRow(row);
    const audit = auditNclexBankItem(item);
    return audit.issues.some((i) => i.code === "phantom_client_in_options");
  });

  console.log(
    `\nNCLEX clinical format coherence — ${flagged.length} flagged, ${phantomPrioritization.length} phantom prioritization of ${rows.length} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let fixed = 0;
  let unresolved = 0;

  for (const row of flagged) {
    const before = enrichBankItemFromRow(row);
    const { item: repaired, changed, note } = fixNclexClinicalFormatCoherence(before);

    if (!changed) {
      unresolved++;
      console.log(`  ✗ ${row.id} — no auto-fix`);
      continue;
    }

    const stillFlagged = itemHasNclexClinicalFormatIssue(repaired);
    const audit = auditNclexBankItem(repaired);

    console.log(`  ✓ ${row.id}`);
    console.log(`    ${note ?? "format repaired"}`);
    console.log(`    audit: ${audit.ok ? "pass" : audit.issues.map((i) => i.code).join(", ")}`);

    if (stillFlagged) unresolved++;
    else fixed++;

    if (!dryRun) {
      const outcome = await persistRepair(row, repaired);
      if (outcome === "retired-duplicate") console.log(`    retired duplicate → canonical row already in bank`);
    }
  }

  let phantomFixed = 0;
  let phantomRetired = 0;
  for (const row of phantomPrioritization) {
    const before = enrichBankItemFromRow(row);
    const repaired = buildMedSurgPrioritizationMcq(before);
    const audit = auditNclexBankItem(repaired);
    console.log(`  ✓ ${row.id} (phantom prioritization)`);
    console.log(`    rewrote vignette + options → canonical med-surg assignment`);
    console.log(`    audit: ${audit.ok ? "pass" : audit.issues.map((i) => i.code).join(", ")}`);
    if (!dryRun) {
      const outcome = await persistRepair(row, repaired);
      if (outcome === "retired-duplicate") {
        phantomRetired++;
        console.log(`    retired duplicate → canonical row already in bank`);
      } else if (audit.ok) phantomFixed++;
    } else if (audit.ok) phantomFixed++;
  }

  console.log(`\n── NCLEX format coherence complete ──`);
  console.log(`Format fixed:    ${fixed}`);
  console.log(`Phantom fixed:   ${phantomFixed}`);
  console.log(`Phantom retired: ${phantomRetired}`);
  console.log(`Unresolved:      ${unresolved}\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

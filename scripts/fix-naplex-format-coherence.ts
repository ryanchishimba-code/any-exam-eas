#!/usr/bin/env node
/**
 * Fix NAPLEX stem/format/answer alignment defects (unscorable items).
 *
 * Targets:
 *   - constructed_response with MCQ lead-in and non-numeric answer
 *   - MCQ with no matching correct option
 *   - conflicting lead-ins / numeric UI mismatch
 *
 * Usage:
 *   npm run db:fix-naplex-format
 *   npm run db:fix-naplex-format:dry
 */
import { PrismaClient } from "@prisma/client";
import { auditNaplexBankItem } from "../src/lib/exam-prep/naplex-bank-audit";
import {
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
  itemHasFormatCoherenceIssue,
} from "../src/lib/exam-prep/naplex-format-coherence";
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

  const flagged = rows.filter((row) => itemHasFormatCoherenceIssue(enrichBankItemFromRow(row)));

  console.log(
    `\nNAPLEX format coherence — ${flagged.length} flagged of ${rows.length} active item(s)${dryRun ? " [dry-run]" : ""}\n`
  );

  let fixed = 0;
  let unresolved = 0;
  const remaining: Array<{ id: string; codes: string[] }> = [];

  for (const row of flagged) {
    const before = enrichBankItemFromRow(row);
    const beforeCodes = detectNaplexFormatIssues(before).map((i) => i.code);
    const { item: repaired, changed, note } = fixNaplexFormatCoherence(before);

    if (!changed) {
      unresolved++;
      remaining.push({ id: row.id, codes: beforeCodes });
      console.log(`  ✗ ${row.id} — no auto-fix (${beforeCodes.join(", ")})`);
      continue;
    }

    const afterCodes = detectNaplexFormatIssues(repaired).map((i) => i.code);
    const audit = auditNaplexBankItem(repaired);
    const qaPassed = isNaplexBestQuality(repaired, { source: row.source });

    console.log(`  ✓ ${row.id}`);
    console.log(`    ${note ?? "format repaired"}`);
    console.log(`    audit: ${audit.ok ? "pass" : audit.issues.map((i) => i.code).join(", ")}`);

    if (afterCodes.length > 0) {
      unresolved++;
      remaining.push({ id: row.id, codes: afterCodes });
    } else {
      fixed++;
    }

    if (!dryRun) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          scenario: repaired.vignette ?? repaired.scenario ?? null,
          question: repaired.question,
          options: serializeBankOptions(repaired),
          correctAnswer: repaired.correctAnswer,
          explanation: repaired.explanation,
          itemType: repaired.itemType ?? "mcq",
          contentHash: bankItemContentHash("pharmacy", repaired.subjectId, repaired),
          qaPassed,
          qaAuditedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  console.log(`\n── Format coherence complete ──`);
  console.log(`Fixed:       ${fixed}`);
  console.log(`Unresolved:  ${unresolved}`);
  if (remaining.length > 0) {
    console.log(`Remaining samples:`);
    for (const r of remaining.slice(0, 12)) {
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

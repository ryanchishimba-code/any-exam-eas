#!/usr/bin/env node
/**
 * Audit and repair pharmacy items with clinical/counseling MCQ stems and numeric-only options.
 *
 * Usage:
 *   npm run db:fix-naplex-clinical-numeric-mismatch
 *   npm run db:fix-naplex-clinical-numeric-mismatch:dry
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { resolveNaplexStem, resolveNaplexVignette } from "../src/lib/exam-prep/naplex-bank-audit";
import {
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
} from "../src/lib/exam-prep/naplex-format-coherence";
import { hasClinicalNumericMismatch } from "../src/lib/exam-prep/naplex-clinical-numeric-repair";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");
const auditOnly = process.argv.includes("--audit-only");

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { id: "asc" },
  });

  const flagged = rows.filter((row) => hasClinicalNumericMismatch(enrichBankItemFromRow(row)));

  console.log(
    `\nNAPLEX clinical/numeric mismatch — ${flagged.length} flagged of ${rows.length} active${dryRun ? " [dry-run]" : ""}\n`
  );

  let repaired = 0;
  let deactivated = 0;
  const remaining: Array<{ id: string; vignette: string; stem: string; note?: string }> = [];

  for (const row of flagged) {
    const before = enrichBankItemFromRow(row);
    const { item: fixed, changed, note } = fixNaplexFormatCoherence(before);
    const afterIssues = detectNaplexFormatIssues(fixed);

    if (changed && afterIssues.length === 0) {
      repaired++;
      console.log(`  ✓ ${row.id} — ${note ?? "repaired"}`);
      if (!dryRun && !auditOnly) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: {
            scenario: fixed.vignette ?? fixed.scenario ?? null,
            question: fixed.question,
            options: serializeBankOptions(fixed),
            correctAnswer: fixed.correctAnswer,
            explanation: fixed.explanation,
            itemType: fixed.itemType ?? "vignette",
            contentHash: bankItemContentHash("pharmacy", fixed.subjectId, fixed),
            qaPassed: isNaplexBestQuality(fixed, { source: row.source }),
            qaAuditedAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
      continue;
    }

    deactivated++;
    remaining.push({
      id: row.id,
      vignette: resolveNaplexVignette(before).slice(0, 120),
      stem: resolveNaplexStem(before).slice(0, 80),
      note: afterIssues.map((i) => i.code).join(", ") || "unresolved",
    });
    console.log(`  ✗ ${row.id} — deactivate (${afterIssues.map((i) => i.code).join(", ") || "unresolved"})`);
    if (!dryRun && !auditOnly) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          active: false,
          qaPassed: false,
          qaAuditedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  const artifactDir = path.join(process.cwd(), "artifacts");
  mkdirSync(artifactDir, { recursive: true });
  writeFileSync(
    path.join(artifactDir, "naplex-clinical-numeric-repair.json"),
    JSON.stringify({ repaired, deactivated, remaining }, null, 2)
  );

  console.log(`\nDone — repaired ${repaired}, deactivated ${deactivated}, remaining ${remaining.length}\n`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

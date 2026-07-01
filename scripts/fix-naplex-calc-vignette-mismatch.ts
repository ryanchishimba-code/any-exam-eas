#!/usr/bin/env node
/**
 * Audit and repair pharmacy items with generic calc stems on non-calculation vignettes.
 *
 * Usage:
 *   npm run db:audit-naplex-calc-vignette-mismatch
 *   npm run db:fix-naplex-calc-vignette-mismatch
 *   npm run db:fix-naplex-calc-vignette-mismatch:dry
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { resolveNaplexStem, resolveNaplexVignette } from "../src/lib/exam-prep/naplex-bank-audit";
import {
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
  orphanGenericCalcStemIssue,
} from "../src/lib/exam-prep/naplex-format-coherence";
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

  const flagged = rows.filter((row) => orphanGenericCalcStemIssue(enrichBankItemFromRow(row)));

  console.log(
    `\nNAPLEX calc/vignette mismatch — ${flagged.length} flagged of ${rows.length} active${dryRun ? " [dry-run]" : ""}\n`
  );

  let repaired = 0;
  let deactivated = 0;
  const remaining: Array<{ id: string; vignette: string; stem: string }> = [];

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
    });
    console.log(`  ✗ ${row.id} — deactivate (unresolved)`);
    if (!dryRun && !auditOnly) {
      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: { active: false, qaPassed: false, reviewStatus: "rejected", qaAuditedAt: new Date(), updatedAt: new Date() },
      });
    }
  }

  const out = path.join(process.cwd(), "artifacts/naplex-calc-vignette-mismatch-fix.json");
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(
    out,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        dryRun,
        flagged: flagged.length,
        repaired,
        deactivated,
        remaining,
      },
      null,
      2
    )
  );

  console.log(`\nRepaired: ${repaired} | Deactivated: ${deactivated} | Remaining: ${remaining.length}`);
  console.log(`Report: ${out}\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

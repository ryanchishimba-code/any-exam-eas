#!/usr/bin/env node
/**
 * Restore NAPLEX bank items whose options were grafted from the wrong drug template
 * (e.g. Allopurinol counseling options on a warfarin SATA vignette).
 *
 * Usage:
 *   npm run db:fix-naplex-stem-coherence
 *   npm run db:fix-naplex-stem-coherence -- --dry-run
 */
import { PrismaClient } from "@prisma/client";
import { auditNaplexBankItem } from "../src/lib/exam-prep/naplex-bank-audit";
import { isNaplexBestQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import {
  findPharmacySeedByVignette,
  naplexStemOptionDrugMismatch,
} from "../src/lib/exam-prep/naplex-stem-coherence";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";

const prisma = new PrismaClient();
const dryRun = process.argv.includes("--dry-run");

async function main() {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { id: "asc" },
  });

  const corrupted = rows.filter((row) => {
    const item = enrichBankItemFromRow(row);
    return Boolean(naplexStemOptionDrugMismatch(item));
  });

  console.log(
    `\nNAPLEX stem/option coherence — ${corrupted.length} corrupted item(s) of ${rows.length}${dryRun ? " [dry-run]" : ""}\n`
  );

  let fixed = 0;
  let unresolved = 0;

  for (const row of corrupted) {
    const item = enrichBankItemFromRow(row);
    const drug = naplexStemOptionDrugMismatch(item)!;
    const seed = findPharmacySeedByVignette(item);

    if (!seed) {
      unresolved++;
      console.log(`  ✗ ${row.id} — no seed match for vignette (orphan drug: ${drug})`);
      continue;
    }

    const restored = {
      ...item,
      subjectId: seed.subjectId ?? item.subjectId,
      vignette: seed.vignette ?? seed.scenario,
      scenario: seed.vignette ?? seed.scenario,
      question: seed.question,
      options: seed.options,
      correctAnswer: seed.correctAnswer,
      explanation: seed.explanation,
      itemType: seed.itemType ?? item.itemType,
      blueprintDomain: seed.blueprintDomain ?? row.blueprintDomain,
      tags: seed.tags ?? item.tags,
      references: seed.references ?? item.references,
      ngnPayload: seed.ngnPayload ?? item.ngnPayload,
    };

    const audit = auditNaplexBankItem(restored);
    const qaPassed = isNaplexBestQuality(restored, { source: row.source });

    console.log(`  ✓ ${row.id}`);
    console.log(`    vignette: ${(restored.vignette ?? "").slice(0, 90)}…`);
    console.log(`    stem:     ${restored.question.slice(0, 90)}`);
    console.log(`    was:      Counsel on ${drug} template graft`);
    console.log(`    audit:    ${audit.ok ? "pass" : audit.issues.map((i) => i.code).join(", ")}`);

    if (!dryRun) {
      const newHash = bankItemContentHash("pharmacy", restored.subjectId, restored);
      const duplicate = await prisma.questionBankItem.findFirst({
        where: { contentHash: newHash, NOT: { id: row.id } },
        select: { id: true },
      });

      if (duplicate) {
        await prisma.$transaction([
          prisma.questionBankItem.update({
            where: { id: row.id },
            data: { active: false, qaPassed: false, qaAuditedAt: new Date(), updatedAt: new Date() },
          }),
          ...(row.id === "cmq339tco00421yius06ftq81"
            ? [
                prisma.questionReport.updateMany({
                  where: { bankItemId: row.id, status: "open" },
                  data: {
                    status: "applied",
                    bankItemId: duplicate.id,
                    appliedAt: new Date(),
                    issueSummary:
                      "Retired corrupted duplicate — canonical SATA warfarin/INR item already in bank.",
                  },
                }),
              ]
            : []),
        ]);
        console.log(`    retired duplicate → canonical row ${duplicate.id}`);
      } else {
        await prisma.$transaction([
          prisma.questionBankItem.update({
            where: { id: row.id },
            data: {
              subjectId: restored.subjectId,
              scenario: restored.vignette ?? restored.scenario ?? null,
              question: restored.question,
              options: serializeBankOptions(restored),
              correctAnswer: restored.correctAnswer,
              explanation: restored.explanation,
              itemType: restored.itemType ?? "mcq",
              blueprintDomain: restored.blueprintDomain ?? null,
              tags: JSON.stringify(restored.tags ?? []),
              references: restored.references ?? undefined,
              contentHash: newHash,
              qaPassed,
              qaAuditedAt: new Date(),
              updatedAt: new Date(),
            },
          }),
          ...(row.id === "cmq339tco00421yius06ftq81"
            ? [
                prisma.questionReport.updateMany({
                  where: { bankItemId: row.id, status: "open" },
                  data: {
                    status: "applied",
                    appliedAt: new Date(),
                    issueSummary:
                      "Restored SATA warfarin/INR item from canonical seed — removed Allopurinol template graft.",
                  },
                }),
              ]
            : []),
        ]);
      }
    }

    fixed++;
  }

  console.log(`\n── Coherence restore complete ──`);
  console.log(`Fixed:       ${fixed}`);
  console.log(`Unresolved:  ${unresolved}`);
  console.log("");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

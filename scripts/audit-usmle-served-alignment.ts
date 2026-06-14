#!/usr/bin/env node
/**
 * Audit currently served USMLE items for answer/stem alignment failures.
 *
 * Usage:
 *   npm run db:audit-usmle-served
 *   npm run db:audit-usmle-served -- --field usmle-step-2
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { usmleBankItemIsServeReady, splitUsmleBankItem } from "../src/lib/exam-prep/usmle-clinical-gate";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";

const prisma = new PrismaClient();
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
const BATCH = 400;

const ALIGNMENT_CODES = new Set([
  "correct_not_in_options",
  "weak_correct",
  "orphan_stem",
  "thin_vignette",
  "missing_vignette",
  "duplicate_options",
  "criteria_only_in_explanation",
  "duplicate_vignette",
  "weak_distractors",
  "vignette_validation",
]);

function parseFieldArg(): string | undefined {
  const idx = process.argv.indexOf("--field");
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

async function auditField(fieldId: (typeof USMLE_FIELDS)[number]) {
  const active = await prisma.questionBankItem.count({
    where: { fieldId, active: true },
  });
  const served = await prisma.questionBankItem.count({
    where: { fieldId, active: true, qaPassed: true },
  });

  console.log(`\n── ${fieldId} ──`);
  console.log(`Active: ${active} | Served (qaPassed): ${served}`);

  let lastId: string | undefined;
  let processed = 0;
  let servedNotReady = 0;
  let servedAlignment = 0;
  const issueCounts: Record<string, number> = {};
  const samples: Array<{
    id: string;
    subjectId: string;
    codes: string[];
    vignette: string;
    stem: string;
    correctAnswer: string;
    overallScore: number;
  }> = [];

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId,
        active: true,
        qaPassed: true,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take: BATCH,
    });
    if (rows.length === 0) break;

    for (const row of rows) {
      const item = enrichBankItemFromRow(row);
      const report = auditUsmleQaEditor(item, {
        fieldId,
        source: row.source ?? "bulk",
        itemId: row.id,
        difficulty: row.difficulty ?? null,
      });

      if (!report.examReady || !usmleBankItemIsServeReady(item, fieldId)) servedNotReady++;

      const alignmentIssues = report.issues.filter((i) => ALIGNMENT_CODES.has(i.code));
      if (alignmentIssues.length > 0) {
        servedAlignment++;
        for (const issue of alignmentIssues) {
          issueCounts[issue.code] = (issueCounts[issue.code] ?? 0) + 1;
        }
        if (samples.length < 15) {
          const { vignette, stem } = splitUsmleBankItem(item);
          samples.push({
            id: row.id,
            subjectId: row.subjectId,
            codes: alignmentIssues.map((i) => i.code),
            vignette: (vignette ?? "").slice(0, 180),
            stem: stem.slice(0, 120),
            correctAnswer: item.correctAnswer.slice(0, 100),
            overallScore: report.overallScore,
          });
        }
      }
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === served) {
      console.log(`  … ${processed}/${served}`);
    }
  }

  return {
    fieldId,
    active,
    served,
    servedNotReady,
    servedWithAlignmentIssues: servedAlignment,
    alignmentRatePercent: served ? ((served - servedAlignment) / served) * 100 : 0,
    alignmentIssueCounts: issueCounts,
    samples,
  };
}

async function main() {
  const fieldFilter = parseFieldArg();
  if (fieldFilter && !USMLE_FIELDS.includes(fieldFilter as (typeof USMLE_FIELDS)[number])) {
    console.error(`Unknown --field "${fieldFilter}". Expected: ${USMLE_FIELDS.join(", ")}`);
    process.exit(1);
  }

  const fields = fieldFilter ? [fieldFilter as (typeof USMLE_FIELDS)[number]] : [...USMLE_FIELDS];
  console.log("\nUSMLE served-item alignment audit");

  const byField = [];
  for (const fieldId of fields) {
    byField.push(await auditField(fieldId));
  }

  const totals = byField.reduce(
    (acc, f) => ({
      served: acc.served + f.served,
      stale: acc.stale + f.servedNotReady,
      alignment: acc.alignment + f.servedWithAlignmentIssues,
    }),
    { served: 0, stale: 0, alignment: 0 }
  );

  const report = {
    generatedAt: new Date().toISOString(),
    byField,
    totals,
  };

  const outPath = path.join(process.cwd(), "artifacts", "usmle-served-alignment-audit.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`\n── Totals ──`);
  console.log(`Served:              ${totals.served}`);
  console.log(`Stale / not ready:   ${totals.stale}`);
  console.log(`Alignment issues:    ${totals.alignment}`);
  console.log(`\nReport: ${outPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

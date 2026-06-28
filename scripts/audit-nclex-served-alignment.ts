#!/usr/bin/env node
/**
 * Audit currently served NCLEX items for answer/stem alignment failures.
 *
 * Usage:
 *   npm run db:audit-nclex-served
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  assertScriptDbConnection,
  disconnectScriptPrisma,
  getScriptPrisma,
} from "./lib/script-db.ts";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  auditNclexBankItem,
  nclexHasServeBlockIssues,
  resolveNclexStem,
  resolveNclexVignette,
} from "../src/lib/exam-prep/nclex-bank-audit";
import {
  assessNclexItemQuality,
  isNclexServeQuality,
} from "../src/lib/exam-prep/nclex-quality-gate";

const prisma = getScriptPrisma();
const BATCH = 400;

const ALIGNMENT_CODES = new Set([
  "correct_not_in_options",
  "stem_option_category_mismatch",
  "phantom_client_in_options",
  "clinical_medication_vignette_mismatch",
  "generic_delegation_correct",
  "stable_unstable_mismatch",
  "stem_vignette_template_mismatch",
  "infection_template_clinical_mismatch",
  "infection_stem_without_context",
  "priority_delegation_mismatch",
  "delegation_prioritization_mismatch",
  "pediatric_age_mismatch",
  "malformed_finding_option",
  "orphan_deictic_stem",
]);

async function main() {
  const active = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true },
  });
  const served = await prisma.questionBankItem.count({
    where: { fieldId: "nursing", active: true, qaPassed: true },
  });

  console.log(`\nNCLEX served-item alignment audit`);
  console.log(`Active: ${active} | Currently served (qaPassed): ${served}\n`);

  let lastId: string | undefined;
  let processed = 0;
  let servedNotBest = 0;
  let servedBlock = 0;
  let servedAlignment = 0;
  const issueCounts: Record<string, number> = {};
  const samples: Array<{
    id: string;
    subjectId: string;
    codes: string[];
    vignette: string;
    stem: string;
    correctAnswer: string;
  }> = [];

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: {
        fieldId: "nursing",
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
      const audit = auditNclexBankItem(item);
      const verdict = assessNclexItemQuality(item, { source: row.source });

      if (!isNclexServeQuality(item, { source: row.source })) servedNotBest++;
      if (nclexHasServeBlockIssues(item)) servedBlock++;

      const alignmentIssues = audit.issues.filter((i) => ALIGNMENT_CODES.has(i.code));
      if (alignmentIssues.length > 0) {
        servedAlignment++;
        for (const issue of alignmentIssues) {
          issueCounts[issue.code] = (issueCounts[issue.code] ?? 0) + 1;
        }
        if (samples.length < 20) {
          samples.push({
            id: row.id,
            subjectId: row.subjectId,
            codes: alignmentIssues.map((i) => i.code),
            vignette: resolveNclexVignette(item).slice(0, 180),
            stem: resolveNclexStem(item).slice(0, 120),
            correctAnswer: item.correctAnswer.slice(0, 100),
          });
        }
      }

      for (const code of verdict.issues) {
        issueCounts[`qa_${code}`] = (issueCounts[`qa_${code}`] ?? 0) + 1;
      }
    }

    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;
    if (processed % 2000 === 0 || processed === served) {
      console.log(`  … ${processed}/${served}`);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    active,
    served,
    servedNotBest,
    servedBlock,
    servedWithAlignmentIssues: servedAlignment,
    alignmentRatePercent: served ? ((served - servedAlignment) / served) * 100 : 0,
    alignmentIssueCounts: Object.fromEntries(
      Object.entries(issueCounts)
        .filter(([k]) => !k.startsWith("qa_"))
        .sort((a, b) => b[1] - a[1])
    ),
    qaBlockers: Object.fromEntries(
      Object.entries(issueCounts)
        .filter(([k]) => k.startsWith("qa_"))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([k, v]) => [k.replace(/^qa_/, ""), v])
    ),
    samples,
  };

  const outPath = path.join(process.cwd(), "artifacts", "nclex-served-alignment-audit.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log(`\n── Results ──`);
  console.log(`Served items:                    ${served}`);
  console.log(`Below best tier (stale qaPassed): ${servedNotBest}`);
  console.log(`Hard serve-block issues:         ${servedBlock}`);
  console.log(`Answer/stem alignment issues:    ${servedAlignment} (${(100 - report.alignmentRatePercent).toFixed(1)}% bad)`);
  console.log(`\nTop alignment failures among served items:`);
  for (const [code, count] of Object.entries(report.alignmentIssueCounts).slice(0, 10)) {
    console.log(`  ${code}: ${count}`);
  }
  console.log(`\nReport: ${outPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectScriptPrisma());

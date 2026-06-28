#!/usr/bin/env node
/**
 * Scan all NAPLEX sources for constructed_response / MCQ format mismatches.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-naplex-format-coherence.mts
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-naplex-format-coherence.mts --json
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import type { BankItem } from "../src/lib/question-bank";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import {
  detectNaplexFormatIssues,
  fixNaplexFormatCoherence,
  itemHasFormatCoherenceIssue,
} from "../src/lib/exam-prep/naplex-format-coherence";
import { resolveNaplexStem } from "../src/lib/exam-prep/naplex-bank-audit";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { prepareNaplexBankItem } from "../src/lib/exam-prep/naplex-serve-gate";
import { NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 } from "../src/lib/edtech/seeds/naplex-physician-educator-batch-01";
import { NAPLEX_QUALITY_V2 } from "../src/lib/exam-prep/naplex-quality-v2";
import { NAPLEX_CALC_CASES_V3 } from "../src/lib/exam-prep/naplex-calc-cases-v3";

type Finding = {
  source: string;
  id: string;
  itemType: string;
  stem: string;
  correctAnswer: string;
  optionCount: number;
  codes: string[];
  autoFixable: boolean;
  fixedItemType?: string;
  note?: string;
};

const jsonOut = process.argv.includes("--json");

function summarizeItem(source: string, id: string, item: BankItem): Finding | null {
    const codes = [
      ...detectNaplexFormatIssues(item).map((i) => i.code),
      ...auditBankItem(item, "pharmacy")
        .issues.filter(
          (i) =>
            i.code === "constructed_response_not_numeric" ||
            i.code === "naplex_stem_format_mismatch" ||
            i.code === "naplex_conflicting_lead_ins" ||
            i.code === "naplex_mcq_missing_correct_option" ||
            i.code === "degenerate_correct_answer"
        )
        .map((i) => i.code),
    ];
    // Hybrid: constructed_response slot + MCQ options + counseling/action stem
    if (
      (item.itemType ?? "mcq") === "constructed_response" &&
      item.options.filter((o) => o.trim().length > 2).length >= 4 &&
      /\b(?:which (?:counseling|finding|action|medication|intervention|recommendation)|most appropriate|best (?:choice|next))\b/i.test(
        resolveNaplexStem(item)
      ) &&
      !codes.includes("naplex_stem_format_mismatch")
    ) {
      codes.push("naplex_stem_format_mismatch");
    }
  const unique = [...new Set(codes)];
  if (unique.length === 0) return null;

  const fix = fixNaplexFormatCoherence(item);
  const afterCodes = detectNaplexFormatIssues(fix.item).map((i) => i.code);

  return {
    source,
    id,
    itemType: item.itemType ?? "mcq",
    stem: resolveNaplexStem(item).slice(0, 120),
    correctAnswer: item.correctAnswer.slice(0, 80),
    optionCount: item.options.length,
    codes: unique,
    autoFixable: fix.changed && afterCodes.length === 0,
    fixedItemType: fix.changed ? fix.item.itemType : undefined,
    note: fix.note,
  };
}

function loadArtifactItems(): Array<{ source: string; id: string; item: BankItem }> {
  const dir = path.join(process.cwd(), "artifacts");
  const out: Array<{ source: string; id: string; item: BankItem }> = [];
  let files: string[] = [];
  try {
    files = readdirSync(dir).filter(
      (f) => f.startsWith("naplex-full-exam-1-") && f.endsWith(".json")
    );
  } catch {
    return out;
  }

  for (const file of files) {
    try {
      const raw = JSON.parse(readFileSync(path.join(dir, file), "utf8")) as {
        questions?: BankItem[];
      };
      if (!Array.isArray(raw.questions)) continue;
      raw.questions.forEach((q, i) => {
        out.push({
          source: `artifact:${file}`,
          id: `sort-${q.sortOrder ?? i}`,
          item: q as BankItem,
        });
      });
    } catch {
      // skip corrupt artifact
    }
  }
  return out;
}

function loadSeedItems(): Array<{ source: string; id: string; item: BankItem }> {
  const batches: Array<{ label: string; items: BankItem[] }> = [
    { label: "seed:physician-educator-01", items: NAPLEX_PHYSICIAN_EDUCATOR_BATCH_01 as BankItem[] },
    { label: "seed:quality-v2", items: NAPLEX_QUALITY_V2 as BankItem[] },
    { label: "seed:calc-v3", items: NAPLEX_CALC_CASES_V3 as BankItem[] },
  ];
  const out: Array<{ source: string; id: string; item: BankItem }> = [];
  for (const batch of batches) {
    batch.items.forEach((item, i) => {
      out.push({ source: batch.label, id: `idx-${i}`, item });
    });
  }
  return out;
}

async function loadDbItems(): Promise<Array<{ source: string; id: string; item: BankItem }>> {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId: "pharmacy", active: true },
      select: {
        id: true,
        subjectId: true,
        scenario: true,
        question: true,
        options: true,
        correctAnswer: true,
        explanation: true,
        itemType: true,
        source: true,
        tags: true,
      },
    });
    return rows.map((row) => ({
      source: "db:active",
      id: row.id,
      item: enrichBankItemFromRow(row),
    }));
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const findings: Finding[] = [];
  const stillBrokenAfterPrepare: Finding[] = [];

  const pools = [
    ...(await loadDbItems()),
    ...loadSeedItems(),
    ...loadArtifactItems(),
  ];

  // Dedupe artifacts by content hash-ish key
  const seen = new Set<string>();

  for (const { source, id, item } of pools) {
    const key = `${item.question}|${item.correctAnswer}|${item.itemType}`;
    if (source.startsWith("artifact:") && seen.has(key)) continue;
    seen.add(key);

    const finding = summarizeItem(source, id, item);
    if (finding) findings.push(finding);

    const prepared = prepareNaplexBankItem(item);
    const postPrepare = summarizeItem(source, id, prepared);
    if (postPrepare) stillBrokenAfterPrepare.push(postPrepare);
  }

  const byCode: Record<string, number> = {};
  for (const f of findings) {
    for (const c of f.codes) byCode[c] = (byCode[c] ?? 0) + 1;
  }

  const report = {
    scanned: pools.length,
    flaggedBeforeFix: findings.length,
    autoFixable: findings.filter((f) => f.autoFixable).length,
    stillBrokenAfterPrepare: stillBrokenAfterPrepare.length,
    byCode,
    samples: findings.slice(0, 30),
    unresolvedAfterPrepare: stillBrokenAfterPrepare.slice(0, 20),
  };

  if (jsonOut) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log("\nNAPLEX format-coherence audit");
  console.log("─────────────────────────────");
  console.log(`Scanned:                    ${report.scanned}`);
  console.log(`Flagged (raw):              ${report.flaggedBeforeFix}`);
  console.log(`Auto-fixable:               ${report.autoFixable}`);
  console.log(`Still broken after prepare: ${report.stillBrokenAfterPrepare}`);
  console.log("\nBy issue code:");
  for (const [code, count] of Object.entries(byCode).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${code}: ${count}`);
  }

  if (findings.length > 0) {
    console.log("\nSample flagged items (raw):");
    for (const f of findings.slice(0, 15)) {
      console.log(`  [${f.source}] ${f.id}`);
      console.log(`    type=${f.itemType} options=${f.optionCount} answer="${f.correctAnswer}"`);
      console.log(`    stem: ${f.stem}…`);
      console.log(`    codes: ${f.codes.join(", ")}${f.autoFixable ? " (auto-fixable)" : ""}`);
    }
  }

  if (stillBrokenAfterPrepare.length > 0) {
    console.log("\n⚠ Unresolved after prepareNaplexBankItem():");
    for (const f of stillBrokenAfterPrepare.slice(0, 10)) {
      console.log(`  [${f.source}] ${f.id}: ${f.codes.join(", ")}`);
    }
  } else if (findings.length > 0) {
    console.log("\n✓ All flagged items are repaired at serve time by prepareNaplexBankItem().");
  } else {
    console.log("\n✓ No format-coherence issues found.");
  }
  console.log("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

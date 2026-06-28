#!/usr/bin/env npx tsx
/**
 * Audit serve-ready banks for vignette/stem repetition and simulate session diversity.
 *
 * Usage: npx tsx scripts/audit-session-repetition.ts [--json]
 */
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import type { BankItem } from "../src/lib/question-bank";
import {
  clinicalCaseKey,
  dedupeItemsByClinicalCase,
  selectDiverseSessionBankItems,
} from "../src/lib/exam-prep/diverse-session-selection";
import { nclexBankItemIsServeReady } from "../src/lib/exam-prep/nclex-serve-gate";
import { naplexBankItemIsServeReady, prepareNaplexBankItem } from "../src/lib/exam-prep/naplex-serve-gate";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { nptePtBankItemIsServeReady } from "../src/lib/exam-prep/npte-pt/clinical-gate";
import { selectSpreadBankItems } from "../src/lib/questions/spread-session-order";
import { hasAdjacentSimilarSpread, spreadGroupKeyFromBankItem } from "../src/lib/questions/spread-session-order";

const prisma = new PrismaClient();

type FieldAudit = {
  fieldId: string;
  serveReady: number;
  uniqueClinicalCases: number;
  duplicateCaseRows: number;
  duplicateCaseRate: number;
  uniqueStems: number;
  duplicateStemRows: number;
  topDuplicateCases: { key: string; count: number }[];
  sessionSim: {
    sessionSize: number;
    legacyAdjacentSimilar: number;
    diverseAdjacentSimilar: number;
    legacyDomainCount: number;
    diverseDomainCount: number;
  };
};

const FIELDS: {
  fieldId: string;
  filter: (item: BankItem, source: string | null) => boolean;
}[] = [
  {
    fieldId: "nursing",
    filter: (item, source) => nclexBankItemIsServeReady(item, { source }),
  },
  {
    fieldId: "pharmacy",
    filter: (item, source) => {
      const prepared = prepareNaplexBankItem(item);
      return naplexBankItemIsServeReady(prepared, { source: source ?? prepared.source ?? null });
    },
  },
  {
    fieldId: "usmle-step-1",
    filter: (item, source) => usmleBankItemIsServeReady(item, "usmle-step-1"),
  },
  {
    fieldId: "usmle-step-2",
    filter: (item, source) => usmleBankItemIsServeReady(item, "usmle-step-2"),
  },
  {
    fieldId: "usmle-step-3",
    filter: (item) => usmleBankItemIsServeReady(item, "usmle-step-3"),
  },
  {
    fieldId: "pance",
    filter: (item) => usmleBankItemIsServeReady(item, "pance"),
  },
  {
    fieldId: "aanp-fnp",
    filter: (item) => usmleBankItemIsServeReady(item, "aanp-fnp"),
  },
  {
    fieldId: "npte-pt",
    filter: (item, source) => nptePtBankItemIsServeReady(item, source),
  },
];

async function loadServeReady(fieldId: string, filter: (item: BankItem, source: string | null) => boolean) {
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true, qaPassed: true },
  });
  return rows
    .map((row) => enrichBankItemFromRow(row))
    .filter((item) => filter(item, item.source ?? null));
}

function auditField(fieldId: string, items: BankItem[]): FieldAudit {
  const caseCounts = new Map<string, number>();
  const stemCounts = new Map<string, number>();

  for (const item of items) {
    const caseKey = clinicalCaseKey(item);
    caseCounts.set(caseKey, (caseCounts.get(caseKey) ?? 0) + 1);
    const stem = item.question.trim().toLowerCase();
    stemCounts.set(stem, (stemCounts.get(stem) ?? 0) + 1);
  }

  const uniqueClinicalCases = caseCounts.size;
  const duplicateCaseRows = items.length - uniqueClinicalCases;
  const uniqueStems = stemCounts.size;
  const duplicateStemRows = items.length - uniqueStems;

  const topDuplicateCases = [...caseCounts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => ({ key: key.slice(0, 80), count }));

  const sessionSize = fieldId === "nursing" ? 25 : fieldId === "pharmacy" ? 25 : 20;
  const pool = items.length >= sessionSize * 2 ? items : items;
  const legacy = selectSpreadBankItems(pool, sessionSize);
  const diverse = selectDiverseSessionBankItems(pool, sessionSize, { seed: 42 });

  const legacyDomains = new Set(legacy.map((i) => i.subjectId ?? i.blueprintDomain ?? "?"));
  const diverseDomains = new Set(diverse.map((i) => i.subjectId ?? i.blueprintDomain ?? "?"));

  return {
    fieldId,
    serveReady: items.length,
    uniqueClinicalCases,
    duplicateCaseRows,
    duplicateCaseRate: items.length ? duplicateCaseRows / items.length : 0,
    uniqueStems,
    duplicateStemRows,
    topDuplicateCases,
    sessionSim: {
      sessionSize,
      legacyAdjacentSimilar: hasAdjacentSimilarSpread(legacy, spreadGroupKeyFromBankItem)
        ? 1
        : 0,
      diverseAdjacentSimilar: hasAdjacentSimilarSpread(diverse, spreadGroupKeyFromBankItem)
        ? 1
        : 0,
      legacyDomainCount: legacyDomains.size,
      diverseDomainCount: diverseDomains.size,
    },
  };
}

async function main() {
  const json = process.argv.includes("--json");
  const reports: FieldAudit[] = [];

  for (const { fieldId, filter } of FIELDS) {
    const items = await loadServeReady(fieldId, filter);
    const deduped = dedupeItemsByClinicalCase(items);
    reports.push(auditField(fieldId, items));
    if (!json) {
      const r = reports[reports.length - 1]!;
      console.log(`\n=== ${fieldId} ===`);
      console.log(`  serve-ready: ${r.serveReady}`);
      console.log(`  unique clinical cases: ${r.uniqueClinicalCases} (${(r.duplicateCaseRate * 100).toFixed(1)}% duplicate rows)`);
      console.log(`  unique stems: ${r.uniqueStems}`);
      console.log(`  after case-dedupe pool: ${deduped.length}`);
      console.log(`  session sim (${r.sessionSim.sessionSize}): legacy adjacent-similar=${r.sessionSim.legacyAdjacentSimilar} diverse=${r.sessionSim.diverseAdjacentSimilar}`);
      console.log(`  domain mix: legacy ${r.sessionSim.legacyDomainCount} → diverse ${r.sessionSim.diverseDomainCount}`);
      if (r.topDuplicateCases.length) {
        console.log("  top duplicate cases:");
        for (const row of r.topDuplicateCases) {
          console.log(`    ×${row.count} ${row.key}`);
        }
      }
    }
  }

  if (json) {
    console.log(JSON.stringify({ auditedAt: new Date().toISOString(), fields: reports }, null, 2));
  } else {
    const { mkdirSync, writeFileSync } = await import("node:fs");
    const path = await import("node:path");
    mkdirSync(path.join(process.cwd(), "artifacts"), { recursive: true });
    writeFileSync(
      path.join(process.cwd(), "artifacts/session-repetition-audit.json"),
      JSON.stringify({ auditedAt: new Date().toISOString(), fields: reports }, null, 2)
    );
    console.log("\nWrote artifacts/session-repetition-audit.json");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

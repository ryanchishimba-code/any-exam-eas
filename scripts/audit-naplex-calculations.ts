#!/usr/bin/env node
/**
 * Audit all calculation-style NAPLEX bank items.
 *
 * Usage:
 *   npm run db:audit-naplex-calculations
 *   npm run db:audit-naplex-calculations -- --csv artifacts/naplex-calculations.csv
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  auditNaplexBankItem,
  resolveNaplexStem,
  resolveNaplexVignette,
} from "../src/lib/exam-prep/naplex-bank-audit";
import { detectNaplexFormatIssues } from "../src/lib/exam-prep/naplex-format-coherence";
import { assessNaplexItemQuality } from "../src/lib/exam-prep/naplex-quality-gate";
import {
  naplexBankItemIsServeReady,
  prepareNaplexBankItem,
} from "../src/lib/exam-prep/naplex-serve-gate";

const CALC_LEAD_IN =
  /\b(?:calculate|how many|how much|at what rate|round to|what is the (?:rate|dose|volume|concentration|quantity|total|amount|number|daily dose|infusion rate))\b/i;

function isCalcItem(
  item: ReturnType<typeof enrichBankItemFromRow>,
  row: { itemType: string; subjectId: string; tags: string | null }
): boolean {
  const stem = resolveNaplexStem(item);
  const tags = (row.tags ?? item.tags?.join(",") ?? "").toLowerCase();
  return (
    row.itemType === "constructed_response" ||
    item.itemType === "constructed_response" ||
    row.subjectId === "compounding-calculations" ||
    tags.includes("calculation") ||
    tags.includes("case-calculation") ||
    CALC_LEAD_IN.test(stem)
  );
}

function csvEscape(value: string): string {
  const v = value.replace(/\r?\n/g, " ").trim();
  if (/[",]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function parseArgs() {
  const args = process.argv.slice(2);
  let csv: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--csv" && args[i + 1]) csv = args[++i];
  }
  return { csv };
}

async function main() {
  const { csv } = parseArgs();
  const prisma = new PrismaClient();

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: "pharmacy", active: true },
    orderBy: { id: "asc" },
  });

  type CalcRow = {
    id: string;
    subjectId: string;
    itemType: string;
    qaPassed: boolean;
    tier: string;
    serveReady: boolean;
    auditOk: boolean;
    issues: string[];
    vignette: string;
    stem: string;
    answer: string;
    options: string[];
    explanation: string;
    tags: string;
  };

  const calcs: CalcRow[] = [];

  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    if (!isCalcItem(item, row)) continue;

    const audit = auditNaplexBankItem(item);
    const formatIssues = detectNaplexFormatIssues(item);
    const quality = assessNaplexItemQuality(item, { source: row.source });
    const prepared = prepareNaplexBankItem(item);
    const serveReady = naplexBankItemIsServeReady(prepared, { source: row.source });

    calcs.push({
      id: row.id,
      subjectId: row.subjectId,
      itemType: row.itemType,
      qaPassed: row.qaPassed,
      tier: quality.tier,
      serveReady,
      auditOk: audit.ok,
      issues: [...audit.issues, ...formatIssues].map((i) => i.code),
      vignette: resolveNaplexVignette(item),
      stem: resolveNaplexStem(item),
      answer: item.correctAnswer,
      options: item.options,
      explanation: item.explanation ?? "",
      tags: row.tags ?? "",
    });
  }

  const byType: Record<string, number> = {};
  const bySubject: Record<string, number> = {};
  const byTier = { best: 0, acceptable: 0, reject: 0 };
  const issueCounts: Record<string, number> = {};
  let auditPass = 0;
  let serveReadyCount = 0;
  let qaPassedCount = 0;

  for (const c of calcs) {
    byType[c.itemType] = (byType[c.itemType] ?? 0) + 1;
    bySubject[c.subjectId] = (bySubject[c.subjectId] ?? 0) + 1;
    byTier[c.tier as keyof typeof byTier]++;
    if (c.auditOk) auditPass++;
    if (c.serveReady) serveReadyCount++;
    if (c.qaPassed) qaPassedCount++;
    for (const code of c.issues) {
      issueCounts[code] = (issueCounts[code] ?? 0) + 1;
    }
  }

  const flagged = calcs.filter((c) => !c.auditOk || !c.serveReady || c.tier !== "best");

  const report = {
    generatedAt: new Date().toISOString(),
    totalActivePharmacy: rows.length,
    totalCalcItems: calcs.length,
    calcPct: rows.length ? (calcs.length / rows.length) * 100 : 0,
    byItemType: byType,
    bySubject,
    byTier,
    auditPass,
    serveReady: serveReadyCount,
    qaPassed: qaPassedCount,
    flaggedCount: flagged.length,
    topIssues: Object.fromEntries(
      Object.entries(issueCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
    ),
    flagged: flagged.map((c) => ({
      id: c.id,
      subjectId: c.subjectId,
      itemType: c.itemType,
      tier: c.tier,
      serveReady: c.serveReady,
      qaPassed: c.qaPassed,
      issues: c.issues,
      stem: c.stem.slice(0, 160),
      answer: c.answer.slice(0, 60),
    })),
    passing: calcs
      .filter((c) => c.auditOk && c.serveReady && c.tier === "best")
      .map((c) => ({
        id: c.id,
        subjectId: c.subjectId,
        itemType: c.itemType,
        stem: c.stem.slice(0, 160),
        answer: c.answer.slice(0, 60),
      })),
  };

  const artifactDir = path.join(process.cwd(), "artifacts");
  mkdirSync(artifactDir, { recursive: true });
  const reportPath = path.join(artifactDir, "naplex-calculations-audit.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");

  if (csv) {
    const csvPath = path.resolve(csv);
    mkdirSync(path.dirname(csvPath), { recursive: true });
    const header =
      "id,subject_id,item_type,qa_passed,tier,serve_ready,audit_ok,issues,vignette,stem,answer,options";
    const lines = [header];
    for (const c of calcs) {
      lines.push(
        [
          csvEscape(c.id),
          csvEscape(c.subjectId),
          csvEscape(c.itemType),
          c.qaPassed ? "true" : "false",
          csvEscape(c.tier),
          c.serveReady ? "true" : "false",
          c.auditOk ? "true" : "false",
          csvEscape(c.issues.join(";")),
          csvEscape(c.vignette.slice(0, 400)),
          csvEscape(c.stem.slice(0, 200)),
          csvEscape(c.answer),
          csvEscape(c.options.join(" | ")),
        ].join(",")
      );
    }
    writeFileSync(csvPath, lines.join("\n"), "utf8");
    console.log(`Wrote ${calcs.length} calculation item(s) → ${csvPath}`);
  }

  console.log(`\n── NAPLEX calculation review ──`);
  console.log(`Active pharmacy bank:  ${rows.length}`);
  console.log(`Calculation items:     ${calcs.length} (${report.calcPct.toFixed(1)}%)`);
  console.log(`Audit pass:            ${auditPass}`);
  console.log(`Serve-ready:           ${serveReadyCount}`);
  console.log(`QA passed (DB flag):     ${qaPassedCount}`);
  console.log(`Flagged (needs work):  ${flagged.length}`);
  console.log(`\nBy item type:`);
  for (const [t, n] of Object.entries(byType).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${t}: ${n}`);
  }
  console.log(`\nBy subject:`);
  for (const [s, n] of Object.entries(bySubject).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${s}: ${n}`);
  }
  console.log(`\nBy quality tier:`);
  console.log(`  best: ${byTier.best}, acceptable: ${byTier.acceptable}, reject: ${byTier.reject}`);
  console.log(`\nTop issues:`);
  for (const [code, count] of Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)) {
    console.log(`  ${code}: ${count}`);
  }
  console.log(`\nReport: ${reportPath}\n`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

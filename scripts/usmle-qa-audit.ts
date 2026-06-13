#!/usr/bin/env node
/**
 * Automated USMLE editorial QA — scores every active USMLE bank item and writes CSV.
 *
 * Usage:
 *   npm run db:audit-usmle
 *   npm run db:audit-usmle -- --field usmle-step-2
 *   npm run db:audit-usmle -- --limit 500 --min-score 8
 */
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  auditUsmleQaEditor,
  csvEscape,
  summarizeUsmleQaBatch,
  type UsmleQaReport,
} from "../src/lib/exam-prep/usmle-qa-editor";

const prisma = new PrismaClient();
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
const BATCH = 400;

function parseArgs() {
  const args = process.argv.slice(2);
  let field: string | undefined;
  let limit = 0;
  let minScore = 0;
  let outDir = path.join(process.cwd(), "artifacts");
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i];
    else if (args[i] === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--min-score" && args[i + 1]) minScore = Number.parseFloat(args[++i]!);
    else if (args[i] === "--out" && args[i + 1]) outDir = args[++i]!;
  }
  return { field, limit, minScore, outDir };
}

function reportToCsvRow(r: UsmleQaReport): string {
  const topIssues = r.issues
    .slice(0, 5)
    .map((i) => `${i.code}:${i.severity}`)
    .join("|");
  return [
    r.itemId ?? "",
    r.fieldId,
    r.subjectId,
    r.source,
    r.overallScore,
    r.scores.vignetteQuality,
    r.scores.highYieldValue,
    r.scores.distractors,
    r.scores.correctAnswerExplanation,
    r.scores.integrationThinking,
    r.scores.overallPolish,
    r.scores.platformFit,
    r.polishScore.toFixed(3),
    r.examReady ? "yes" : "no",
    r.difficultySuggestion,
    topIssues,
    r.recommendations.join(" "),
    r.tagsSuggestion,
    r.testedConcepts,
  ]
    .map(csvEscape)
    .join(",");
}

function writeSummaryMarkdown(
  summary: ReturnType<typeof summarizeUsmleQaBatch>,
  outPath: string,
  failingSample: UsmleQaReport[]
) {
  const lines = [
    "# USMLE QA Audit Summary",
    "",
    `Generated: ${new Date().toISOString()}`,
    "",
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Items audited | ${summary.total} |`,
    `| Average overall score | ${summary.averageOverall}/10 |`,
    `| Exam-ready (≥8, no errors) | ${summary.examReadyCount} (${(summary.examReadyRate * 100).toFixed(1)}%) |`,
    `| Platform readiness | ${summary.readinessScore}/10 |`,
    "",
    "## Average by dimension",
    "",
    ...Object.entries(summary.averageByDimension).map(([k, v]) => `- **${k}**: ${v}/10`),
    "",
    "## By field",
    "",
    ...Object.entries(summary.byField).map(
      ([f, s]) => `- **${f}**: avg ${s.avg}/10, ${s.ready}/${s.total} exam-ready`
    ),
    "",
    "## By source",
    "",
    ...Object.entries(summary.bySource).map(
      ([s, st]) => `- **${s}**: avg ${st.avg}/10 (${st.total} items)`
    ),
    "",
    "## Top issue codes",
    "",
    ...summary.topIssueCodes.map(({ code, count }) => `- \`${code}\`: ${count}`),
    "",
    "## Lowest-scoring sample (priority rewrites)",
    "",
    ...failingSample.slice(0, 10).map(
      (r) =>
        `- \`${r.itemId}\` (${r.fieldId}/${r.subjectId}) — **${r.overallScore}/10** — ${r.issues
          .slice(0, 2)
          .map((i) => i.code)
          .join(", ")}`
    ),
  ];
  fs.writeFileSync(outPath, lines.join("\n"));
}

async function main() {
  const { field, limit, minScore, outDir } = parseArgs();
  const fieldIds = field ? [field] : [...USMLE_FIELDS];

  fs.mkdirSync(outDir, { recursive: true });
  const csvPath = path.join(outDir, "usmle-qa-report.csv");
  const summaryPath = path.join(outDir, "usmle-qa-summary.md");
  const failingPath = path.join(outDir, "usmle-qa-failing.csv");

  const header = [
    "itemId",
    "fieldId",
    "subjectId",
    "source",
    "overallScore",
    "vignetteQuality",
    "highYieldValue",
    "distractors",
    "correctAnswerExplanation",
    "integrationThinking",
    "overallPolish",
    "platformFit",
    "polishScore",
    "examReady",
    "difficultySuggestion",
    "topIssues",
    "recommendations",
    "tagsSuggestion",
    "testedConcepts",
  ].join(",");

  fs.writeFileSync(csvPath, `${header}\n`);
  fs.writeFileSync(failingPath, `${header}\n`);

  const allReports: UsmleQaReport[] = [];
  let processed = 0;

  for (const fieldId of fieldIds) {
    let lastId: string | undefined;
    while (true) {
      const remaining = limit > 0 ? limit - processed : undefined;
      if (remaining !== undefined && remaining <= 0) break;

      const rows = await prisma.questionBankItem.findMany({
        where: {
          fieldId,
          active: true,
          ...(lastId ? { id: { gt: lastId } } : {}),
        },
        orderBy: { id: "asc" },
        take: remaining !== undefined ? Math.min(BATCH, remaining) : BATCH,
      });

      if (rows.length === 0) break;

      const csvLines: string[] = [];
      const failLines: string[] = [];

      for (const row of rows) {
        const item = enrichBankItemFromRow(row);
        const report = auditUsmleQaEditor(item, {
          fieldId: row.fieldId,
          source: row.source,
          itemId: row.id,
          difficulty: row.difficulty,
        });
        allReports.push(report);

        if (report.overallScore >= minScore) {
          csvLines.push(reportToCsvRow(report));
        }
        if (!report.examReady) {
          failLines.push(reportToCsvRow(report));
        }
      }

      fs.appendFileSync(csvPath, `${csvLines.join("\n")}${csvLines.length ? "\n" : ""}`);
      fs.appendFileSync(failingPath, `${failLines.join("\n")}${failLines.length ? "\n" : ""}`);

      processed += rows.length;
      lastId = rows[rows.length - 1]!.id;
      console.log(`  … ${processed} ${fieldId} item(s) scored`);
      if (rows.length < BATCH) break;
    }
    if (limit > 0 && processed >= limit) break;
  }

  const summary = summarizeUsmleQaBatch(allReports);
  const failing = [...allReports].sort((a, b) => a.overallScore - b.overallScore);
  writeSummaryMarkdown(summary, summaryPath, failing);

  console.log(`\n── USMLE QA audit complete ──`);
  console.log(`Items:        ${summary.total}`);
  console.log(`Avg score:    ${summary.averageOverall}/10`);
  console.log(`Exam-ready:   ${summary.examReadyCount} (${(summary.examReadyRate * 100).toFixed(1)}%)`);
  console.log(`Readiness:    ${summary.readinessScore}/10`);
  console.log(`\nCSV:          ${csvPath}`);
  console.log(`Failing CSV:  ${failingPath}`);
  console.log(`Summary:      ${summaryPath}`);
  console.log(`\nTop issues:`);
  for (const { code, count } of summary.topIssueCodes.slice(0, 8)) {
    console.log(`  ${code}: ${count}`);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

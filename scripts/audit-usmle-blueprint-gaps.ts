#!/usr/bin/env node
/**
 * Audit USMLE Step 1 / 2 / 3 served bank vs content-outline blueprint weights.
 *
 * Usage:
 *   npm run db:audit-usmle-blueprint
 *   npm run db:audit-usmle-blueprint -- --field usmle-step-2
 *   npm run db:audit-usmle-blueprint -- --metric active
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { mergeUsmleQuotaWithCounts } from "../src/lib/exam-prep/usmle/blueprint-quota";
import {
  blueprintForUsmleField,
  resolveUsmleBlueprintCategory,
} from "../src/lib/exam-prep/usmle/blueprint-resolver";

const prisma = new PrismaClient();
const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

function parseArgs() {
  const args = process.argv.slice(2);
  let field: string | undefined;
  let metric: "qaPassed" | "active" = "qaPassed";

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--field" && args[i + 1]) field = args[++i];
    else if (a === "--metric" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "active" || m === "qaPassed") metric = m;
    }
  }
  return { field, metric };
}

function buildMarkdown(
  report: Awaited<ReturnType<typeof auditField>>
): string {
  const lines = [
    "# USMLE Blueprint Gap Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Metric: **${report.metric}**`,
    "",
    `- **Field:** ${report.fieldId}`,
    `- **Blueprint:** ${report.sourceNote}`,
    `- **Active items:** ${report.activeTotal}`,
    `- **Counted (${report.metric}):** ${report.counted}`,
    `- **Unmapped:** ${report.unmapped}`,
    `- **Total deficit:** ${report.totalDeficit}`,
    "",
    "| Category | Weight | Target | Current | Deficit | Surplus |",
    "|----------|--------|--------|---------|---------|---------|",
  ];

  for (const q of report.quotas) {
    lines.push(
      `| ${q.label} | ${(q.weight * 100).toFixed(1)}% | ${q.targetCount} | ${q.currentCount ?? 0} | ${q.deficit ?? 0} | ${q.surplus ?? 0} |`
    );
  }

  if (report.step3ItemTypes) {
    lines.push("", "## Step 3 item types", "", "| Type | Count |", "|------|-------|");
    for (const [type, count] of Object.entries(report.step3ItemTypes)) {
      lines.push(`| ${type} | ${count} |`);
    }
  }

  return lines.join("\n");
}

async function auditField(
  fieldId: (typeof USMLE_FIELDS)[number],
  metric: "qaPassed" | "active"
) {
  const blueprint = blueprintForUsmleField(fieldId);
  if (!blueprint) throw new Error(`No blueprint for ${fieldId}`);

  const where = {
    fieldId,
    active: true,
    ...(metric === "qaPassed" ? { qaPassed: true } : {}),
  };

  const [activeTotal, rows] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId, active: true } }),
    prisma.questionBankItem.findMany({
      where,
      select: {
        subjectId: true,
        itemType: true,
        blueprintDomain: true,
        blueprintTopic: true,
      },
    }),
  ]);

  const counts: Record<string, number> = {};
  let unmapped = 0;
  const itemTypeCounts: Record<string, number> = {};

  for (const row of rows) {
    const category = resolveUsmleBlueprintCategory(fieldId, row);
    if (category) {
      counts[category] = (counts[category] ?? 0) + 1;
    } else {
      unmapped++;
    }
    if (fieldId === "usmle-step-3") {
      const t = row.itemType?.trim() || "mcq";
      itemTypeCounts[t] = (itemTypeCounts[t] ?? 0) + 1;
    }
  }

  const counted = rows.length;
  const quotas = mergeUsmleQuotaWithCounts(blueprint, counts, counted);
  const totalDeficit = quotas.reduce((s, q) => s + (q.deficit ?? 0), 0);

  return {
    generatedAt: new Date().toISOString(),
    fieldId,
    metric,
    sourceNote: blueprint.sourceNote ?? blueprint.examName,
    activeTotal,
    counted,
    unmapped,
    totalDeficit,
    quotas,
    step3ItemTypes: fieldId === "usmle-step-3" ? itemTypeCounts : undefined,
  };
}

async function main() {
  const { field, metric } = parseArgs();
  const fields = field ? [field as (typeof USMLE_FIELDS)[number]] : [...USMLE_FIELDS];

  const reports = [];
  for (const f of fields) {
    if (!USMLE_FIELDS.includes(f)) {
      console.error(`Unknown field: ${f}`);
      process.exit(1);
    }
    const report = await auditField(f, metric);
    reports.push(report);

    console.log(`\n── ${f} (${metric}, n=${report.counted}) ──`);
    console.log(`Blueprint: ${report.sourceNote}`);
    console.log(`Unmapped: ${report.unmapped} | Total deficit: ${report.totalDeficit}\n`);
    for (const q of report.quotas) {
      const pct = report.counted
        ? (((q.currentCount ?? 0) / report.counted) * 100).toFixed(1)
        : "0.0";
      const status =
        (q.deficit ?? 0) > 0
          ? `need ${q.deficit}`
          : (q.surplus ?? 0) > 0
            ? `+${q.surplus} surplus`
            : "OK";
      console.log(
        `  ${q.label}: ${q.currentCount}/${q.targetCount} (${pct}% vs ${(q.weight * 100).toFixed(1)}% target) — ${status}`
      );
    }
    if (report.step3ItemTypes) {
      console.log("\n  Step 3 item types:");
      for (const [type, count] of Object.entries(report.step3ItemTypes).sort(
        (a, b) => b[1] - a[1]
      )) {
        console.log(`    ${type}: ${count}`);
      }
    }
  }

  const dir = path.join(process.cwd(), "artifacts");
  mkdirSync(dir, { recursive: true });

  const jsonPath = path.join(dir, "usmle-blueprint-gap-report.json");
  writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), metric, reports }, null, 2));

  const mdPath = path.join(dir, "usmle-blueprint-gap-report.md");
  writeFileSync(mdPath, reports.map(buildMarkdown).join("\n\n---\n\n"));

  console.log(`\nJSON: ${jsonPath}`);
  console.log(`Markdown: ${mdPath}\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

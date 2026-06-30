#!/usr/bin/env node
/**
 * Audit NAPLEX bank vs NABP 2026 blueprint area targets.
 *
 * Usage:
 *   npm run db:audit-naplex-blueprint
 *   npm run db:audit-naplex-blueprint -- --target 6500 --json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  computeNaplexBlueprintQuotas,
  mergeNaplexQuotaWithCounts,
  NAPLEX_2026_BLUEPRINT,
} from "../src/lib/exam-prep/naplex/blueprint-quota";
import { NAPLEX_TARGET_TOTAL } from "../src/lib/exam-prep/naplex/types";

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  let target = NAPLEX_TARGET_TOTAL;
  let json = false;
  let metric: "active" | "qaPassed" = "active";

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--target" && args[i + 1]) target = parseInt(args[++i]!, 10);
    else if (a === "--json") json = true;
    else if (a === "--metric" && args[i + 1]) {
      const m = args[++i]!;
      if (m === "active" || m === "qaPassed") metric = m;
    }
  }
  return { target, json, metric };
}

async function countByBlueprintArea(metric: "active" | "qaPassed") {
  const rows = await prisma.questionBankItem.groupBy({
    by: ["blueprintDomain"],
    where: {
      fieldId: "pharmacy",
      active: true,
      ...(metric === "qaPassed" ? { qaPassed: true } : {}),
    },
    _count: { id: true },
  });

  const counts: Record<string, number> = {};
  let unmapped = 0;

  for (const row of rows) {
    const key = row.blueprintDomain?.trim() || "(unmapped)";
    if (key === "(unmapped)") unmapped += row._count.id;
    else counts[key] = (counts[key] ?? 0) + row._count.id;
  }

  return { counts, unmapped };
}

function buildMarkdown(
  target: number,
  metric: string,
  totalActive: number,
  quotas: ReturnType<typeof mergeNaplexQuotaWithCounts>,
  unmapped: number
) {
  const totalDeficit = quotas.reduce((s, q) => s + (q.deficit ?? 0), 0);
  const lines = [
    `# NAPLEX Blueprint Gap Report`,
    ``,
    `- **Target bank size:** ${target}`,
    `- **Metric:** ${metric}`,
    `- **Active items counted:** ${totalActive}`,
    `- **Unmapped blueprintDomain:** ${unmapped}`,
    `- **Total blueprint deficit:** ${totalDeficit}`,
    `- **Source:** ${NAPLEX_2026_BLUEPRINT.sourceNote}`,
    ``,
    `| Blueprint area | Weight | Target | Current | Deficit |`,
    `|----------------|--------|--------|---------|---------|`,
  ];

  for (const q of quotas) {
    lines.push(
      `| ${q.label} | ${(q.weight * 100).toFixed(1)}% | ${q.targetCount} | ${q.currentCount ?? 0} | ${q.deficit ?? 0} |`
    );
  }

  return lines.join("\n");
}

async function main() {
  const { target, json, metric } = parseArgs();

  const [totalActive, totalQaPassed, { counts, unmapped }] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: "pharmacy", active: true } }),
    prisma.questionBankItem.count({
      where: { fieldId: "pharmacy", active: true, qaPassed: true },
    }),
    countByBlueprintArea(metric),
  ]);

  const quotas = mergeNaplexQuotaWithCounts(counts, target);
  const totalDeficit = quotas.reduce((s, q) => s + (q.deficit ?? 0), 0);
  const counted = metric === "qaPassed" ? totalQaPassed : totalActive;

  const report = {
    generatedAt: new Date().toISOString(),
    target,
    metric,
    totalActive,
    totalQaPassed,
    countedForMetric: counted,
    unmappedBlueprintDomain: unmapped,
    totalDeficit,
    quotas: computeNaplexBlueprintQuotas(target).map((q) => {
      const merged = quotas.find((m) => m.blueprintArea === q.blueprintArea)!;
      return {
        blueprintArea: q.blueprintArea,
        label: q.label,
        weight: q.weight,
        targetCount: q.targetCount,
        currentCount: merged.currentCount ?? 0,
        deficit: merged.deficit ?? 0,
      };
    }),
  };

  const artifacts = path.join(process.cwd(), "artifacts");
  mkdirSync(artifacts, { recursive: true });
  const jsonPath = path.join(artifacts, "naplex-blueprint-gap-report.json");
  const mdPath = path.join(artifacts, "naplex-blueprint-gap-summary.md");

  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(mdPath, buildMarkdown(target, metric, counted, quotas, unmapped));

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\nNAPLEX blueprint gap audit (${metric}, target ${target})\n`);
    console.log(`Active: ${totalActive} | qaPassed: ${totalQaPassed} | unmapped: ${unmapped}`);
    console.log(`Total deficit: ${totalDeficit}\n`);
    for (const q of report.quotas) {
      const status = q.deficit > 0 ? `need ${q.deficit}` : "OK";
      console.log(
        `  ${q.label}: ${q.currentCount}/${q.targetCount} (${(q.weight * 100).toFixed(1)}%) — ${status}`
      );
    }
    console.log(`\nJSON: ${jsonPath}`);
    console.log(`Summary: ${mdPath}\n`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

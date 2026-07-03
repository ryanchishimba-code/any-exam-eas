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
import { aggregateNaplex2026BlueprintCounts } from "../src/lib/exam-prep/naplex/legacy-blueprint-map";
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
    by: ["blueprintDomain", "subjectId", "itemType"],
    where: {
      fieldId: "pharmacy",
      active: true,
      ...(metric === "qaPassed" ? { qaPassed: true } : {}),
    },
    _count: { id: true },
  });

  const rawCounts: Record<string, number> = {};
  let unmapped = 0;

  for (const row of rows) {
    const key = row.blueprintDomain?.trim() || "(unmapped)";
    if (key === "(unmapped)") unmapped += row._count.id;
    else rawCounts[key] = (rawCounts[key] ?? 0) + row._count.id;
  }

  const normalizedCounts = aggregateNaplex2026BlueprintCounts(
    rows.map((row) => ({
      blueprintDomain: row.blueprintDomain,
      subjectId: row.subjectId,
      itemType: row.itemType,
      count: row._count.id,
    }))
  );

  const normalizedRecord = Object.fromEntries(
    Object.entries(normalizedCounts).map(([k, v]) => [k, v])
  ) as Record<string, number>;

  return { counts: rawCounts, normalizedCounts: normalizedRecord, unmapped };
}

function buildMarkdown(
  target: number,
  metric: string,
  totalActive: number,
  quotasRaw: ReturnType<typeof mergeNaplexQuotaWithCounts>,
  quotasNormalized: ReturnType<typeof mergeNaplexQuotaWithCounts>,
  unmapped: number
) {
  const totalDeficit = quotasNormalized.reduce((s, q) => s + (q.deficit ?? 0), 0);
  const lines = [
    `# NAPLEX Blueprint Gap Report`,
    ``,
    `- **Target bank size:** ${target}`,
    `- **Metric:** ${metric}`,
    `- **Active items counted:** ${totalActive}`,
    `- **Unmapped blueprintDomain (raw):** ${unmapped}`,
    `- **Total blueprint deficit (2026 normalized):** ${totalDeficit}`,
    `- **Source:** ${NAPLEX_2026_BLUEPRINT.sourceNote}`,
    ``,
    `## 2026 blueprint (legacy domains mapped)`,
    ``,
    `| Blueprint area | Weight | Target | Current | Deficit |`,
    `|----------------|--------|--------|---------|---------|`,
  ];

  for (const q of quotasNormalized) {
    lines.push(
      `| ${q.label} | ${(q.weight * 100).toFixed(1)}% | ${q.targetCount} | ${q.currentCount ?? 0} | ${q.deficit ?? 0} |`
    );
  }

  lines.push("", "## Raw blueprintDomain keys (unmapped legacy slugs)", "");
  for (const q of quotasRaw.filter((r) => (r.currentCount ?? 0) > 0)) {
    lines.push(`- ${q.blueprintArea}: ${q.currentCount}`);
  }

  return lines.join("\n");
}

async function main() {
  const { target, json, metric } = parseArgs();

  const [totalActive, totalQaPassed, { counts, normalizedCounts, unmapped }] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: "pharmacy", active: true } }),
    prisma.questionBankItem.count({
      where: { fieldId: "pharmacy", active: true, qaPassed: true },
    }),
    countByBlueprintArea(metric),
  ]);

  const quotasRaw = mergeNaplexQuotaWithCounts(counts, target);
  const quotasNormalized = mergeNaplexQuotaWithCounts(normalizedCounts, target);
  const totalDeficit = quotasNormalized.reduce((s, q) => s + (q.deficit ?? 0), 0);
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
    rawDomainCounts: counts,
    normalized2026Counts: normalizedCounts,
    quotasNormalized: computeNaplexBlueprintQuotas(target).map((q) => {
      const merged = quotasNormalized.find((m) => m.blueprintArea === q.blueprintArea)!;
      return {
        blueprintArea: q.blueprintArea,
        label: q.label,
        weight: q.weight,
        targetCount: q.targetCount,
        currentCount: merged.currentCount ?? 0,
        deficit: merged.deficit ?? 0,
      };
    }),
    quotasRaw: computeNaplexBlueprintQuotas(target).map((q) => {
      const merged = quotasRaw.find((m) => m.blueprintArea === q.blueprintArea)!;
      return {
        blueprintArea: q.blueprintArea,
        currentCount: merged.currentCount ?? 0,
      };
    }),
  };

  const artifacts = path.join(process.cwd(), "artifacts");
  mkdirSync(artifacts, { recursive: true });
  const jsonPath = path.join(artifacts, "naplex-blueprint-gap-report.json");
  const mdPath = path.join(artifacts, "naplex-blueprint-gap-summary.md");

  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(mdPath, buildMarkdown(target, metric, counted, quotasRaw, quotasNormalized, unmapped));

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\nNAPLEX blueprint gap audit (${metric}, target ${target})\n`);
    console.log(`Active: ${totalActive} | qaPassed: ${totalQaPassed} | unmapped raw: ${unmapped}`);
    console.log(`Total deficit (2026 normalized): ${totalDeficit}\n`);
    for (const q of report.quotasNormalized) {
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

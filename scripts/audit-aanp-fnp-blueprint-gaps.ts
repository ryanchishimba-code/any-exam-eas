#!/usr/bin/env node
/**
 * Audit AANP FNP bank vs 2026 blueprint — domains, age groups, clinical systems, topics.
 *
 * Usage:
 *   npm run db:audit-aanp-fnp-blueprint
 *   npm run db:audit-aanp-fnp-blueprint -- --target 6000 --json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  assessAanpFnpBlueprintAlignment,
  mergeAanpFnpAgeGroupQuotaWithCounts,
  mergeAanpFnpClinicalSystemQuotaWithCounts,
  mergeAanpFnpDomainQuotaWithCounts,
  mergeAanpFnpTopicQuotaWithCounts,
} from "../src/lib/exam-prep/aanp-fnp/blueprint-quota";
import { AANP_FNP_BLUEPRINT_SOURCE, AANP_FNP_TARGET_TOTAL } from "../src/lib/exam-prep/aanp-fnp/types";

const prisma = new PrismaClient();

function parseArgs() {
  const args = process.argv.slice(2);
  let target = AANP_FNP_TARGET_TOTAL;
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

function groupCounts(
  rows: Array<{ key: string | null; count: number }>
): { counts: Record<string, number>; unmapped: number } {
  const counts: Record<string, number> = {};
  let unmapped = 0;
  for (const row of rows) {
    const key = row.key?.trim() || "(unmapped)";
    if (key === "(unmapped)") unmapped += row.count;
    else counts[key] = (counts[key] ?? 0) + row.count;
  }
  return { counts, unmapped };
}

function buildMarkdown(report: {
  target: number;
  metric: string;
  counted: number;
  totalDeficit: number;
  domainQuotas: ReturnType<typeof mergeAanpFnpDomainQuotaWithCounts>;
  systemQuotas: ReturnType<typeof mergeAanpFnpClinicalSystemQuotaWithCounts>;
  topicDeficits: Array<{ topicSlug: string; label: string; deficit: number }>;
  unmapped: { domain: number; ageGroup: number; system: number; topic: number };
}) {
  const lines = [
    `# AANP FNP Blueprint Gap Report`,
    ``,
    `- **Target bank size:** ${report.target}`,
    `- **Metric:** ${report.metric}`,
    `- **Items counted:** ${report.counted}`,
    `- **Total deficit (domains):** ${report.totalDeficit}`,
    `- **Source:** ${AANP_FNP_BLUEPRINT_SOURCE}`,
    ``,
    `## Cognitive domains`,
    ``,
    `| Domain | Weight | Target | Current | Deficit |`,
    `|--------|--------|--------|---------|---------|`,
  ];

  for (const q of report.domainQuotas) {
    lines.push(
      `| ${q.label} | ${(q.weight * 100).toFixed(1)}% | ${q.targetCount} | ${q.currentCount ?? 0} | ${q.deficit ?? 0} |`
    );
  }

  lines.push(``, `## Clinical systems`, ``, `| System | Weight | Target | Current | Deficit |`, `|--------|--------|--------|---------|---------|`);
  for (const q of report.systemQuotas) {
    lines.push(
      `| ${q.label} | ${(q.weight * 100).toFixed(1)}% | ${q.targetCount} | ${q.currentCount ?? 0} | ${q.deficit ?? 0} |`
    );
  }

  if (report.topicDeficits.length > 0) {
    lines.push(``, `## Top topic deficits`, ``);
    for (const t of report.topicDeficits.slice(0, 20)) {
      lines.push(`- **${t.label}** (\`${t.topicSlug}\`): need ${t.deficit}`);
    }
  }

  lines.push(
    ``,
    `## Unmapped metadata`,
    `- blueprintDomain: ${report.unmapped.domain}`,
    `- patientAgeGroup: ${report.unmapped.ageGroup}`,
    `- subjectId (system): ${report.unmapped.system}`,
    `- blueprintTopic: ${report.unmapped.topic}`
  );

  return lines.join("\n");
}

async function main() {
  const { target, json, metric } = parseArgs();
  const whereBase = {
    fieldId: "aanp-fnp" as const,
    active: true,
    ...(metric === "qaPassed" ? { qaPassed: true } : {}),
  };

  const [totalActive, totalQaPassed, byDomain, byAge, bySubject, byTopic] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: "aanp-fnp", active: true } }),
    prisma.questionBankItem.count({ where: { fieldId: "aanp-fnp", active: true, qaPassed: true } }),
    prisma.questionBankItem.groupBy({
      by: ["blueprintDomain"],
      where: whereBase,
      _count: { id: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["patientAgeGroup"],
      where: whereBase,
      _count: { id: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["subjectId"],
      where: whereBase,
      _count: { id: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["blueprintTopic"],
      where: whereBase,
      _count: { id: true },
    }),
  ]);

  const domainGrouped = groupCounts(
    byDomain.map((r) => ({ key: r.blueprintDomain, count: r._count.id }))
  );
  const ageGrouped = groupCounts(
    byAge.map((r) => ({ key: r.patientAgeGroup, count: r._count.id }))
  );
  const systemGrouped = groupCounts(
    bySubject.map((r) => ({ key: r.subjectId, count: r._count.id }))
  );
  const topicGrouped = groupCounts(
    byTopic.map((r) => ({ key: r.blueprintTopic, count: r._count.id }))
  );

  const counted = metric === "qaPassed" ? totalQaPassed : totalActive;
  const domainQuotas = mergeAanpFnpDomainQuotaWithCounts(domainGrouped.counts, target);
  const ageQuotas = mergeAanpFnpAgeGroupQuotaWithCounts(ageGrouped.counts, target);
  const systemQuotas = mergeAanpFnpClinicalSystemQuotaWithCounts(systemGrouped.counts, target);
  const topicQuotas = mergeAanpFnpTopicQuotaWithCounts(topicGrouped.counts, target);
  const alignment = assessAanpFnpBlueprintAlignment(domainGrouped.counts, counted || target);
  const totalDeficit = domainQuotas.reduce((s, q) => s + (q.deficit ?? 0), 0);
  const topicDeficits = topicQuotas
    .filter((t) => (t.deficit ?? 0) > 0)
    .sort((a, b) => (b.deficit ?? 0) - (a.deficit ?? 0));

  const report = {
    generatedAt: new Date().toISOString(),
    target,
    metric,
    totalActive,
    totalQaPassed,
    countedForMetric: counted,
    totalDeficit,
    blueprintAlignment: alignment,
    unmapped: {
      domain: domainGrouped.unmapped,
      ageGroup: ageGrouped.unmapped,
      system: systemGrouped.unmapped,
      topic: topicGrouped.unmapped,
    },
    domainQuotas,
    ageGroupQuotas: ageQuotas,
    clinicalSystemQuotas: systemQuotas,
    topicDeficits: topicDeficits.slice(0, 50).map((t) => ({
      topicSlug: t.topicSlug,
      label: t.label,
      clinicalSystem: t.clinicalSystem,
      targetCount: t.targetCount,
      currentCount: t.currentCount ?? 0,
      deficit: t.deficit ?? 0,
    })),
  };

  const artifacts = path.join(process.cwd(), "artifacts");
  mkdirSync(artifacts, { recursive: true });
  const jsonPath = path.join(artifacts, "aanp-fnp-blueprint-gap-report.json");
  const mdPath = path.join(artifacts, "aanp-fnp-blueprint-gap-summary.md");

  writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  writeFileSync(
    mdPath,
    buildMarkdown({
      target,
      metric,
      counted,
      totalDeficit,
      domainQuotas,
      systemQuotas,
      topicDeficits,
      unmapped: report.unmapped,
    })
  );

  if (json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\nAANP FNP blueprint gap audit (${metric}, target ${target})\n`);
    console.log(`Active: ${totalActive} | qaPassed: ${totalQaPassed}`);
    console.log(`Domain deficit: ${totalDeficit} | Aligned: ${alignment.aligned ? "yes" : "no"}\n`);
    console.log("Domains:");
    for (const q of domainQuotas) {
      const status = (q.deficit ?? 0) > 0 ? `need ${q.deficit}` : "OK";
      console.log(`  ${q.label}: ${q.currentCount ?? 0}/${q.targetCount} — ${status}`);
    }
    console.log("\nClinical systems:");
    for (const q of systemQuotas) {
      const status = (q.deficit ?? 0) > 0 ? `need ${q.deficit}` : "OK";
      console.log(`  ${q.label}: ${q.currentCount ?? 0}/${q.targetCount} — ${status}`);
    }
    if (topicDeficits.length > 0) {
      console.log("\nTop topic deficits:");
      for (const t of topicDeficits.slice(0, 10)) {
        console.log(`  ${t.label}: need ${t.deficit}`);
      }
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

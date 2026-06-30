import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CurationCluster, CurationReport } from "./types";

export function writeCurationReport(report: CurationReport, root = process.cwd()): string {
  const dir = join(root, "artifacts");
  mkdirSync(dir, { recursive: true });

  const jsonPath = join(dir, "nclex-curation-report.json");
  const mdPath = join(dir, "nclex-curation-summary.md");

  writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const md = buildMarkdownSummary(report);
  writeFileSync(mdPath, md);

  return jsonPath;
}

function buildMarkdownSummary(report: CurationReport): string {
  const lines: string[] = [
    `# NCLEX Question Bank Curation Report`,
    ``,
    `- **Run ID:** ${report.runId}`,
    `- **Completed:** ${report.completedAt}`,
    `- **Input questions:** ${report.inputCount}`,
    `- **Embedded:** ${report.embeddedCount}`,
    `- **Clusters:** ${report.clusterCount} (${report.duplicateClusters} with 2+ members)`,
    `- **Target bank size:** ${report.targetCount}`,
    `- **Recommended keep:** ${report.recommendedKeep}`,
    `- **Flagged for review:** ${report.recommendedReview}`,
    `- **Recommended drop:** ${report.recommendedDrop}`,
    `- **Applied to DB:** ${report.applied ? "yes" : "no (dry run)"}`,
    ``,
    `## Category balance (NCLEX-RN Test Plan)`,
    ``,
    `| Category | Target % | Target # | Before | After | Δ |`,
    `|----------|----------|----------|--------|-------|---|`,
  ];

  for (const row of report.categoryBalance) {
    lines.push(
      `| ${row.label} | ${(row.targetWeight * 100).toFixed(0)}% | ${row.targetCount} | ${row.beforeCount} | ${row.afterCount} | ${row.delta >= 0 ? "+" : ""}${row.delta} |`
    );
  }

  if (report.topDuplicateTopics.length > 0) {
    lines.push(``, `## Top duplicate-heavy topics`, ``);
    for (const t of report.topDuplicateTopics) {
      lines.push(`- **${t.topic}** — ${t.clusterCount} clusters, ${t.removedCount} questions removed`);
    }
  }

  if (report.sampleClusters.length > 0) {
    lines.push(``, `## Sample duplicate clusters`, ``);
    for (const cluster of report.sampleClusters.slice(0, 8)) {
      lines.push(
        `### ${cluster.clusterId} (${cluster.memberIds.length} items, avg sim ${cluster.avgSimilarity.toFixed(3)})`,
        `- **Keep:** ${cluster.recommendedKeepIds.join(", ") || "none"}`,
        `- **Drop:** ${cluster.droppedIds.length} items`,
        ``
      );
    }
  }

  return lines.join("\n");
}

export function summarizeDuplicateTopics(
  clusters: CurationCluster[]
): Array<{ topic: string; clusterCount: number; removedCount: number }> {
  const counts = new Map<string, { clusters: number; removed: number }>();
  for (const c of clusters) {
    if (c.memberIds.length < 2) continue;
    const topic = c.clusterId;
    const entry = counts.get(topic) ?? { clusters: 0, removed: 0 };
    entry.clusters++;
    entry.removed += c.droppedIds.length;
    counts.set(topic, entry);
  }
  return [...counts.entries()]
    .map(([topic, v]) => ({ topic, clusterCount: v.clusters, removedCount: v.removed }))
    .sort((a, b) => b.removedCount - a.removedCount)
    .slice(0, 15);
}

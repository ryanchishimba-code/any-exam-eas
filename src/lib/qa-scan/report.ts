import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { QaScanItemResult, QaScanReport, QaScanSummary } from "./types";

function countByKey(items: string[]): Array<{ code: string; count: number }> {
  const map = new Map<string, number>();
  for (const key of items) {
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count);
}

function countLlmIssues(items: string[]): Array<{ issue: string; count: number }> {
  const map = new Map<string, number>();
  for (const key of items) {
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count);
}

export function buildQaScanSummary(
  partial: Omit<QaScanSummary, "topIssueCodes" | "topLlmIssues">,
  items: QaScanItemResult[]
): QaScanSummary {
  const heuristicCodes = items.flatMap((i) => i.heuristicIssues.map((h) => h.code));
  const llmIssues = items.flatMap((i) => i.llm?.issues ?? []);

  const withLlm = items.filter((i) => i.llm);
  const avg = (fn: (s: NonNullable<QaScanItemResult["llm"]>["scores"]) => number) => {
    if (withLlm.length === 0) return undefined;
    const sum = withLlm.reduce((acc, i) => acc + fn(i.llm!.scores), 0);
    return Math.round((sum / withLlm.length) * 10) / 10;
  };

  return {
    ...partial,
    topIssueCodes: countByKey(heuristicCodes).slice(0, 20),
    topLlmIssues: countLlmIssues(llmIssues).slice(0, 20),
    averageScores:
      withLlm.length > 0
        ? {
            logicClarity: avg((s) => s.logicClarity),
            answerValidity: avg((s) => s.answerValidity),
            boardQuality: avg((s) => s.boardQuality),
            distractorQuality: avg((s) => s.distractorQuality),
            rationaleQuality: avg((s) => s.rationaleQuality),
            overall: Math.round(
              (withLlm.reduce((acc, i) => acc + i.llm!.overallScore, 0) / withLlm.length) * 10
            ) / 10,
          }
        : undefined,
  };
}

export function writeQaScanReport(report: QaScanReport, outDir: string): { jsonPath: string; mdPath: string } {
  mkdirSync(outDir, { recursive: true });
  const stamp = report.summary.generatedAt.replace(/[:.]/g, "-");
  const slug = report.summary.exam;
  const jsonPath = path.join(outDir, `qa-scan-${slug}-${stamp}.json`);
  const mdPath = path.join(outDir, `qa-scan-${slug}-${stamp}.md`);

  writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");
  writeFileSync(mdPath, renderMarkdownSummary(report), "utf8");

  return { jsonPath, mdPath };
}

function renderMarkdownSummary(report: QaScanReport): string {
  const s = report.summary;
  const failing = report.items.filter((i) => !i.pass).slice(0, 40);

  const lines = [
    `# QA Scan — ${s.exam.toUpperCase()}`,
    "",
    `Generated: ${s.generatedAt}`,
    "",
    "## Summary",
    "",
    "| Metric | Value |",
    "|--------|------:|",
    `| Mode | ${s.mode} |`,
    `| Provider | ${s.provider ?? "—"} |`,
    `| Model | ${s.model ?? "—"} |`,
    `| Queried (serve-ready) | ${s.totalQueried} |`,
    `| Evaluated | ${s.totalEvaluated} |`,
    `| Pass | ${s.pass} |`,
    `| Fail | ${s.fail} |`,
    `| Review | ${s.review} |`,
    `| Heuristic fail | ${s.heuristicFail} |`,
    `| LLM evaluated | ${s.llmEvaluated} |`,
    "",
  ];

  if (s.averageScores) {
    lines.push("## Average LLM scores", "");
    for (const [k, v] of Object.entries(s.averageScores)) {
      if (v != null) lines.push(`- **${k}**: ${v}/10`);
    }
    lines.push("");
  }

  if (s.topIssueCodes.length > 0) {
    lines.push("## Top heuristic issue codes", "");
    for (const row of s.topIssueCodes.slice(0, 15)) {
      lines.push(`- \`${row.code}\`: ${row.count}`);
    }
    lines.push("");
  }

  if (s.topLlmIssues.length > 0) {
    lines.push("## Top LLM issues", "");
    for (const row of s.topLlmIssues.slice(0, 15)) {
      lines.push(`- ${row.issue} (${row.count})`);
    }
    lines.push("");
  }

  if (failing.length > 0) {
    lines.push("## Sample failing items", "");
    for (const item of failing) {
      lines.push(`### ${item.id} (${item.fieldId}/${item.subjectId})`);
      lines.push(`- Verdict: **${item.verdict}**`);
      if (item.heuristicIssues.length) {
        lines.push(`- Heuristic: ${item.heuristicIssues.map((h) => h.code).join(", ")}`);
      }
      if (item.llm) {
        lines.push(`- LLM overall: ${item.llm.overallScore}/10`);
        if (item.llm.issues.length) lines.push(`- Issues: ${item.llm.issues.join("; ")}`);
        if (item.llm.suggestedFixes.length) {
          lines.push(`- Fixes: ${item.llm.suggestedFixes.join("; ")}`);
        }
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

export function writeFailingCsv(items: QaScanItemResult[], outPath: string): void {
  const failing = items.filter((i) => !i.pass);
  const header = [
    "id",
    "fieldId",
    "subjectId",
    "itemType",
    "verdict",
    "heuristicOk",
    "overallScore",
    "heuristicIssues",
    "llmIssues",
    "suggestedFixes",
  ].join(",");

  const rows = failing.map((item) =>
    [
      item.id,
      item.fieldId,
      item.subjectId,
      item.itemType,
      item.verdict,
      item.heuristicOk ? "yes" : "no",
      item.llm?.overallScore ?? "",
      csvEscape(item.heuristicIssues.map((h) => h.code).join("|")),
      csvEscape((item.llm?.issues ?? []).join("|")),
      csvEscape((item.llm?.suggestedFixes ?? []).join("|")),
    ].join(",")
  );

  mkdirSync(path.dirname(outPath), { recursive: true });
  writeFileSync(outPath, [header, ...rows].join("\n"), "utf8");
}

function csvEscape(value: string): string {
  const v = value.replace(/\r?\n/g, " ").trim();
  if (/[",]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

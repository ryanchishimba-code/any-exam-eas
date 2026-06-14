#!/usr/bin/env node
/**
 * Audit all MPJE seed items by topic against the A+ quality gate.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-mpje-seeds-by-topic.ts
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-mpje-seeds-by-topic.ts --json
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { collectSeedQuestionRows } from "../src/lib/question-bank-seed";
import {
  assessMpjeItemQuality,
  isMpjeBestQuality,
  resolveMpjeStem,
  resolveMpjeVignette,
} from "../src/lib/exam-prep/mpje-quality-gate";
import type { BankItem } from "../src/lib/question-bank";

const jsonOut = process.argv.includes("--json");

type ItemReport = {
  subjectId: string;
  source: string;
  score: number;
  tier: string;
  vignette: string;
  stem: string;
  correctAnswer: string;
  bestQuality: boolean;
  issues: string[];
};

type TopicReport = {
  subjectId: string;
  total: number;
  best: number;
  acceptable: number;
  reject: number;
  topIssues: Record<string, number>;
  samples: ItemReport[];
};

function seedSource(item: BankItem): string {
  const tags = item.tags ?? [];
  if (tags.includes("physician-educator-batch-01")) return "physician-educator";
  if (tags.includes("state-substantive")) return "state-substantive";
  if (tags.includes("physician-educator")) return "physician-educator";
  if (tags.includes("v2") || tags.includes("oklahoma")) return "quality-seeds";
  if (tags.includes("curated")) return "state-substantive";
  return "federal-bank";
}

function main() {
  const rows = collectSeedQuestionRows().filter((r) => r.fieldId === "mpje");
  const byTopic: Record<string, TopicReport> = {};
  const allItems: ItemReport[] = [];

  for (const row of rows) {
    const subjectId = row.subjectId;
    const item = row.item;
    const source = seedSource(item);
    const verdict = assessMpjeItemQuality(item, { source: "seed" });

    const report: ItemReport = {
      subjectId,
      source,
      score: verdict.score,
      tier: verdict.tier,
      vignette: resolveMpjeVignette(item).slice(0, 200),
      stem: resolveMpjeStem(item).slice(0, 200),
      correctAnswer: item.correctAnswer.slice(0, 160),
      bestQuality: isMpjeBestQuality(item, { source: "seed" }),
      issues: verdict.issues,
    };

    allItems.push(report);

    if (!byTopic[subjectId]) {
      byTopic[subjectId] = {
        subjectId,
        total: 0,
        best: 0,
        acceptable: 0,
        reject: 0,
        topIssues: {},
        samples: [],
      };
    }

    const bucket = byTopic[subjectId]!;
    bucket.total++;
    if (verdict.tier === "best") bucket.best++;
    else if (verdict.tier === "acceptable") bucket.acceptable++;
    else bucket.reject++;

    for (const code of verdict.issues) {
      bucket.topIssues[code] = (bucket.topIssues[code] ?? 0) + 1;
    }
    if (verdict.tier === "reject" && bucket.samples.length < 5) {
      bucket.samples.push(report);
    }
  }

  const topics = Object.values(byTopic).sort((a, b) => a.subjectId.localeCompare(b.subjectId));
  const total = allItems.length;
  const best = allItems.filter((i) => i.tier === "best").length;
  const acceptable = allItems.filter((i) => i.tier === "acceptable").length;
  const reject = allItems.filter((i) => i.tier === "reject").length;

  console.log(`\nMPJE seed audit (A+ gate) — ${total} active bank item(s)\n`);
  console.log(
    `${"Topic".padEnd(28)} ${"Total".padStart(5)} ${"Best".padStart(5)} ${"OK".padStart(5)} ${"Reject".padStart(6)}`
  );
  console.log("-".repeat(55));

  for (const t of topics) {
    console.log(
      `${t.subjectId.padEnd(28)} ${String(t.total).padStart(5)} ${String(t.best).padStart(5)} ${String(t.acceptable).padStart(5)} ${String(t.reject).padStart(6)}`
    );
    if (t.reject > 0) {
      const codes = Object.entries(t.topIssues)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([c, n]) => `${c}(${n})`)
        .join(", ");
      console.log(`  issues: ${codes}`);
    }
  }

  console.log(
    `\nOverall: ${best} best (serve), ${acceptable} rewrite queue, ${reject} archived from bank`
  );
  console.log(`Pass rate (best only): ${total ? ((best / total) * 100).toFixed(1) : 0}%\n`);

  const outPath = path.join(process.cwd(), "artifacts", "mpje-seed-audit-by-topic.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    total,
    best,
    acceptable,
    reject,
    bestRatePercent: total ? (best / total) * 100 : 0,
    topics,
    failures: allItems.filter((i) => i.tier !== "best"),
  };
  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`Report: ${outPath}\n`);

  if (jsonOut) {
    console.log(JSON.stringify(payload, null, 2));
  }
}

main();

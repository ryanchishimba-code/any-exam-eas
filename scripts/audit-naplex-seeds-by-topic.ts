#!/usr/bin/env node
/**
 * Audit all hand-authored NAPLEX seed items by topic (subjectId).
 * Simulates polish, runs editorial + best-tier QA gates, prints per-topic report.
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-naplex-seeds-by-topic.ts
 *   bash scripts/run-with-node.sh npx tsx scripts/audit-naplex-seeds-by-topic.ts --json
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { collectHighYieldSeedRows } from "../src/lib/exam-prep/high-yield-index";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import {
  auditNaplexBankItem,
  resolveNaplexStem,
  resolveNaplexVignette,
} from "../src/lib/exam-prep/naplex-bank-audit";
import {
  assessNaplexItemQuality,
  isNaplexBestQuality,
} from "../src/lib/exam-prep/naplex-quality-gate";
import { polishNaplexBankItem } from "../src/lib/engine/polish/naplex-polish";
import type { BankItem } from "../src/lib/question-bank";

const jsonOut = process.argv.includes("--json");

type ItemReport = {
  subjectId: string;
  source: string;
  vignette: string;
  stem: string;
  correctAnswer: string;
  polishChanged: boolean;
  polishStem: string;
  qualityTier: string;
  qualityScore: number;
  bestQuality: boolean;
  auditOk: boolean;
  issues: string[];
};

type TopicReport = {
  subjectId: string;
  total: number;
  pass: number;
  best: number;
  fail: number;
  polishCorruptions: number;
  topIssues: Record<string, number>;
  samples: ItemReport[];
};

function seedSource(item: BankItem): string {
  const tags = item.tags ?? [];
  if (tags.includes("v2")) return "naplex-quality-v2";
  if (tags.includes("physician-educator")) return "physician-educator";
  if (tags.includes("v3")) return "naplex-v3";
  if (tags.includes("calc")) return "naplex-calc";
  return tags[0] ?? "seed";
}

function main() {
  const rows = collectHighYieldSeedRows().filter((r) => r.fieldId === "pharmacy");
  const byTopic: Record<string, TopicReport> = {};
  const allItems: ItemReport[] = [];

  for (const row of rows) {
    const subjectId = row.subjectId;
    const bankItem = row.item as BankItem;
    const source = seedSource(bankItem);

    const polished = polishNaplexBankItem(bankItem, subjectId, subjectId, row.item.question.length);
    const item = polished.item;

    const shared = auditBankItem(item, "pharmacy");
    const naplex = auditNaplexBankItem(item);
    const verdict = assessNaplexItemQuality(item, { source: "seed" });
    const blockingIssues = [
      ...shared.issues.filter((i) => i.severity === "error").map((i) => i.code),
      ...naplex.issues.filter((i) => i.severity === "error").map((i) => i.code),
      ...verdict.issues,
    ];

    const report: ItemReport = {
      subjectId,
      source,
      vignette: resolveNaplexVignette(item).slice(0, 200),
      stem: resolveNaplexStem(item),
      correctAnswer: item.correctAnswer.slice(0, 160),
      polishChanged: polished.changed,
      polishStem: resolveNaplexStem(item),
      qualityTier: verdict.tier,
      qualityScore: verdict.score,
      bestQuality: isNaplexBestQuality(item, { source: "seed" }),
      auditOk: blockingIssues.length === 0,
      issues: [...new Set(blockingIssues)],
    };

    allItems.push(report);

    if (!byTopic[subjectId]) {
      byTopic[subjectId] = {
        subjectId,
        total: 0,
        pass: 0,
        best: 0,
        fail: 0,
        polishCorruptions: 0,
        topIssues: {},
        samples: [],
      };
    }

    const bucket = byTopic[subjectId]!;
    bucket.total++;
    if (report.auditOk) bucket.pass++;
    else bucket.fail++;
    if (report.bestQuality) bucket.best++;
    if (report.polishChanged && report.issues.length > 0) bucket.polishCorruptions++;
    for (const code of report.issues) {
      bucket.topIssues[code] = (bucket.topIssues[code] ?? 0) + 1;
    }
    if (!report.auditOk && bucket.samples.length < 5) {
      bucket.samples.push(report);
    }
  }

  const topics = Object.values(byTopic).sort((a, b) => a.subjectId.localeCompare(b.subjectId));
  const total = allItems.length;
  const pass = allItems.filter((i) => i.auditOk).length;
  const best = allItems.filter((i) => i.bestQuality).length;

  console.log(`\nNAPLEX seed audit by topic — ${total} items\n`);
  console.log(
    `${"Topic".padEnd(28)} ${"Total".padStart(5)} ${"Pass".padStart(5)} ${"Best".padStart(5)} ${"Fail".padStart(5)} ${"Polish⚠".padStart(8)}`
  );
  console.log("-".repeat(62));

  for (const t of topics) {
    console.log(
      `${t.subjectId.padEnd(28)} ${String(t.total).padStart(5)} ${String(t.pass).padStart(5)} ${String(t.best).padStart(5)} ${String(t.fail).padStart(5)} ${String(t.polishCorruptions).padStart(8)}`
    );
    if (t.fail > 0) {
      const codes = Object.entries(t.topIssues)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([c, n]) => `${c}(${n})`)
        .join(", ");
      console.log(`  blockers: ${codes}`);
      for (const s of t.samples.slice(0, 2)) {
        console.log(`  • [${s.source}] ${s.stem.slice(0, 80)}…`);
        console.log(`    issues: ${s.issues.join(", ") || "none"}`);
      }
    }
  }

  console.log(`\nOverall: ${pass}/${total} pass (${((pass / total) * 100).toFixed(1)}%), ${best} best-tier\n`);

  const outPath = path.join(process.cwd(), "artifacts", "naplex-seed-audit-by-topic.json");
  mkdirSync(path.dirname(outPath), { recursive: true });
  const payload = {
    generatedAt: new Date().toISOString(),
    total,
    pass,
    best,
    passRatePercent: total ? (pass / total) * 100 : 0,
    topics,
    failures: allItems.filter((i) => !i.auditOk),
  };
  writeFileSync(outPath, JSON.stringify(payload, null, 2));
  console.log(`Report: ${outPath}\n`);

  if (jsonOut) {
    console.log(JSON.stringify(payload, null, 2));
  }

  if (pass < total) {
    process.exit(1);
  }
}

main();

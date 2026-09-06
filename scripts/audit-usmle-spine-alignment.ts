#!/usr/bin/env node
/**
 * Audit USMLE serve-ready bank vs official organ-system spine weights.
 *
 *   npx tsx scripts/audit-usmle-spine-alignment.ts
 *   npx tsx scripts/audit-usmle-spine-alignment.ts --field usmle-step-2 --write
 *
 * Writes docs/audits/usmle-bank-audit-YYYY-MM-DD.md when --write is passed.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  USMLE_ORGAN_SYSTEMS,
  organSystemWeightsForStep,
  type UsmleOrganSystemId,
} from "../src/lib/exam-prep/usmle/official-content-model";
import { resolveOrganSystemId } from "../src/lib/exam-prep/usmle/content-spine";
import { isValidUsmle2026BlueprintTopic } from "../src/lib/exam-prep/usmle/infer-blueprint-topic";

const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;

function stepFromField(fieldId: string): "step1" | "step2" | "step3" {
  if (fieldId === "usmle-step-1") return "step1";
  if (fieldId === "usmle-step-3") return "step3";
  return "step2";
}

function parseArgs() {
  const args = process.argv.slice(2);
  let field: string | undefined;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i];
  }
  return { field, write: args.includes("--write") };
}

type FieldReport = {
  fieldId: string;
  step: "step1" | "step2" | "step3";
  serveReady: number;
  withTopic: number;
  withSpineDomain: number;
  orphanTopic: number;
  nullTopic: number;
  bySystem: Record<string, number>;
  weightDrift: Array<{
    systemId: string;
    actualPct: number;
    targetPct: number;
    deltaPts: number;
  }>;
};

async function auditField(prisma: PrismaClient, fieldId: string): Promise<FieldReport> {
  const step = stepFromField(fieldId);
  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId, active: true, qaPassed: true },
    select: {
      blueprintTopic: true,
      blueprintDomain: true,
      subjectId: true,
    },
  });

  const bySystem: Record<string, number> = {};
  for (const s of USMLE_ORGAN_SYSTEMS) bySystem[s.id] = 0;
  bySystem.unknown = 0;

  let withTopic = 0;
  let withSpineDomain = 0;
  let orphanTopic = 0;
  let nullTopic = 0;

  for (const row of rows) {
    const topic = row.blueprintTopic?.trim() || null;
    if (!topic) {
      nullTopic += 1;
    } else {
      withTopic += 1;
      if (!isValidUsmle2026BlueprintTopic(topic, step)) orphanTopic += 1;
    }

    const system =
      resolveOrganSystemId(row.blueprintDomain, topic, row.subjectId) ?? "unknown";
    if (system !== "unknown") withSpineDomain += 1;
    bySystem[system] = (bySystem[system] ?? 0) + 1;
  }

  const total = rows.length || 1;
  const targets = organSystemWeightsForStep(step);
  const weightDrift = USMLE_ORGAN_SYSTEMS.map((s) => {
    const actualPct = ((bySystem[s.id] ?? 0) / total) * 100;
    const targetPct = targets[s.id]! * 100;
    return {
      systemId: s.id,
      actualPct: Math.round(actualPct * 10) / 10,
      targetPct: Math.round(targetPct * 10) / 10,
      deltaPts: Math.round((actualPct - targetPct) * 10) / 10,
    };
  }).sort((a, b) => Math.abs(b.deltaPts) - Math.abs(a.deltaPts));

  return {
    fieldId,
    step,
    serveReady: rows.length,
    withTopic,
    withSpineDomain,
    orphanTopic,
    nullTopic,
    bySystem,
    weightDrift,
  };
}

function renderMarkdown(reports: FieldReport[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    `# USMLE bank spine audit — ${today}`,
    "",
    "Compares serve-ready (`active` + `qaPassed`) items to the official organ-system spine.",
    "Practice readiness is in-app only — not a board pass predictor.",
    "",
    "## Success criteria",
    "",
    "- ≥95% serve-ready items have a resolvable spine `blueprintDomain`",
    "- ≥95% have a valid 2026 `blueprintTopic`",
    "- Per-system weight within ~±3 pts of official midpoints (or documented oversample)",
    "",
  ];

  for (const r of reports) {
    const topicPct = r.serveReady ? Math.round((r.withTopic / r.serveReady) * 1000) / 10 : 0;
    const spinePct = r.serveReady
      ? Math.round((r.withSpineDomain / r.serveReady) * 1000) / 10
      : 0;
    lines.push(`## ${r.fieldId}`, "");
    lines.push(`- Serve-ready: **${r.serveReady}**`);
    lines.push(`- With blueprintTopic: **${r.withTopic}** (${topicPct}%)`);
    lines.push(`- Resolvable spine domain: **${r.withSpineDomain}** (${spinePct}%)`);
    lines.push(`- Null topic: ${r.nullTopic} | Orphan/legacy topic: ${r.orphanTopic}`);
    lines.push("", "| System | Count | Actual % | Target % | Δ pts |", "|---|---:|---:|---:|---:|");
    for (const d of r.weightDrift) {
      const count = r.bySystem[d.systemId] ?? 0;
      lines.push(
        `| ${d.systemId} | ${count} | ${d.actualPct} | ${d.targetPct} | ${d.deltaPts} |`
      );
    }
    lines.push("", `Unknown / unmapped: ${r.bySystem.unknown ?? 0}`, "");
  }

  lines.push(
    "## Remap commands",
    "",
    "```bash",
    "npx tsx scripts/reseed-usmle-blueprint-topics.ts --apply",
    "npx tsx scripts/rebalance-usmle-blueprint.ts  # if present",
    "npx tsx scripts/audit-usmle-spine-alignment.ts --write",
    "```",
    ""
  );
  return lines.join("\n");
}

async function main() {
  const { field, write } = parseArgs();
  const prisma = new PrismaClient();
  const fields = field ? [field] : [...USMLE_FIELDS];
  const reports: FieldReport[] = [];

  try {
    for (const fieldId of fields) {
      console.log(`Auditing ${fieldId}…`);
      const report = await auditField(prisma, fieldId);
      reports.push(report);
      console.log(
        `  serve=${report.serveReady} topic=${report.withTopic} spine=${report.withSpineDomain} orphan=${report.orphanTopic}`
      );
    }

    const md = renderMarkdown(reports);
    if (write) {
      const dir = path.join(process.cwd(), "docs", "audits");
      mkdirSync(dir, { recursive: true });
      const out = path.join(dir, `usmle-bank-audit-${new Date().toISOString().slice(0, 10)}.md`);
      writeFileSync(out, md, "utf8");
      console.log(`\nWrote ${out}`);
    } else {
      console.log("\n" + md);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

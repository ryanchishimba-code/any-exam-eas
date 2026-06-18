#!/usr/bin/env node
/**
 * Quality-first question bank rebuild — retire legacy bulk, keep curated seeds,
 * then refill through ingest + QA gates only.
 *
 * Does NOT drop users, subscriptions, or other tables — only QuestionBankItem.
 *
 * Usage:
 *   npm run db:rebuild-bank:dry
 *   npm run db:rebuild-bank -- --field usmle-step-2 --mode field-reset
 *   npm run db:rebuild-bank -- --retire-only --mode soft
 *
 * Modes:
 *   soft        — deactivate qaPassed=false bulk/generated/polished (default)
 *   field-reset — deactivate ALL items in field except physician-educator / ai-curated-v1 that pass gate
 *
 * After retire, run field-specific fill (printed at end).
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "rebuild-question-bank.log");

const BOARD_FIELDS = [
  "nursing",
  "pharmacy",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "pance",
  "aanp-fnp",
  "npte-pt",
];

const BULK_SOURCES = ["generated", "bulk", "polished", "curated"];

function parseArgs() {
  const args = process.argv.slice(2);
  let field;
  let mode = "soft";
  let dryRun = false;
  let retireOnly = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) field = args[++i];
    else if (args[i] === "--mode" && args[i + 1]) {
      const m = args[++i];
      if (m === "soft" || m === "field-reset") mode = m;
    } else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--retire-only") retireOnly = true;
  }

  return { field, mode, dryRun, retireOnly };
}

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  mkdirSync(join(ROOT, "artifacts"), { recursive: true });
  appendFileSync(LOG, line + "\n");
}

async function fieldStats(fieldId) {
  const [active, qaPassed, bulkFailing] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId, active: true } }),
    prisma.questionBankItem.count({ where: { fieldId, active: true, qaPassed: true } }),
    prisma.questionBankItem.count({
      where: {
        fieldId,
        active: true,
        qaPassed: false,
        source: { in: BULK_SOURCES },
      },
    }),
  ]);
  return { active, qaPassed, bulkFailing };
}

function isProtectedCurated(tags, source, qaPassed) {
  if (qaPassed) return true;
  const tagStr = tags ?? "";
  if (tagStr.includes("physician-educator")) return true;
  if (tagStr.includes("ai-curated-v1") && source === "ai-curated") return false;
  if (source === "seed" && tagStr.includes("clinical-vignette")) return true;
  return false;
}

async function retireField(fieldId, mode, dryRun) {
  const before = await fieldStats(fieldId);
  log(`\n── ${fieldId} (${mode}) ──`);
  log(`  Before: ${before.qaPassed}/${before.active} serve-ready`);

  if (mode === "soft") {
    if (dryRun) {
      log(`  [dry-run] Would retire ~${before.bulkFailing} bulk/generated/polished with qaPassed=false`);
      return before.bulkFailing;
    }
    const result = await prisma.questionBankItem.updateMany({
      where: {
        fieldId,
        active: true,
        qaPassed: false,
        source: { in: BULK_SOURCES },
      },
      data: { active: false, qaAuditedAt: new Date() },
    });
    log(`  Retired ${result.count} bulk failing rows`);
    return result.count;
  }

  // field-reset: scan and retire non-protected
  let retired = 0;
  let cursor;
  const BATCH = 500;

  while (true) {
    const rows = await prisma.questionBankItem.findMany({
      where: { fieldId, active: true, ...(cursor ? { id: { gt: cursor } } : {}) },
      orderBy: { id: "asc" },
      take: BATCH,
      select: { id: true, tags: true, source: true, qaPassed: true },
    });
    if (!rows.length) break;

    const toRetire = rows
      .filter((r) => !isProtectedCurated(r.tags, r.source, r.qaPassed))
      .map((r) => r.id);

    if (!dryRun && toRetire.length) {
      await prisma.questionBankItem.updateMany({
        where: { id: { in: toRetire } },
        data: { active: false, qaAuditedAt: new Date() },
      });
    }
    retired += toRetire.length;
    cursor = rows[rows.length - 1].id;
  }

  const after = dryRun ? before : await fieldStats(fieldId);
  log(
    dryRun
      ? `  [dry-run] Would field-reset retire ~${retired} rows (keep physician-educator + qaPassed)`
      : `  Field-reset retired ${retired} rows → ${after.qaPassed}/${after.active} serve-ready`
  );
  return retired;
}

function fillCommands(fieldId) {
  switch (fieldId) {
    case "nursing":
      return [
        "npm run db:sync-questions",
        "npm run db:curate-nclex:failures  # repeat until queue empty",
        "npm run db:qa-gate-nclex-best",
      ];
    case "pharmacy":
      return ["npm run db:polish-pharmacy:all", "npm run db:qa-gate-naplex-best"];
    case "usmle-step-1":
    case "usmle-step-2":
    case "usmle-step-3":
      return [
        "npm run db:sync-usmle-curated",
        `npm run db:curate-usmle:ai:${fieldId.replace("usmle-", "")}`,
        `npm run db:qa-gate-usmle-best -- --field ${fieldId}`,
      ];
    case "pance":
      return [
        "npm run db:generate-pance-to-target -- --metric qaPassed",
        "npm run db:qa-gate-pance-best",
      ];
    case "aanp-fnp":
      return [
        "npm run db:generate-aanp-fnp-to-target -- --metric qaPassed",
        "npm run db:qa-gate -- --field aanp-fnp",
      ];
    case "npte-pt":
      return [
        "npm run db:generate-npte-pt-to-target -- --metric qaPassed",
        "npm run db:qa-gate -- --field npte-pt",
      ];
    default:
      return [`npm run db:qa-gate -- --field ${fieldId}`];
  }
}

async function main() {
  const { field, mode, dryRun, retireOnly } = parseArgs();
  const fields = field ? [field] : [...BOARD_FIELDS];

  writeFileSync(
    LOG,
    `=== Rebuild question bank ${new Date().toISOString()} mode=${mode} dry=${dryRun} ===\n`
  );

  log("Quality-first rebuild — retires legacy bulk; refill must pass ingest + QA gates.");
  log("Tip: create a Neon branch or DB backup before field-reset on production.\n");

  log("Current snapshot:");
  for (const f of fields) {
    const s = await fieldStats(f);
    log(`  ${f}: ${s.qaPassed}/${s.active} served (${s.bulkFailing} bulk failing)`);
  }

  let totalRetired = 0;
  for (const f of fields) {
    totalRetired += await retireField(f, mode, dryRun);
  }

  log(`\nTotal ${dryRun ? "would retire" : "retired"}: ${totalRetired}`);

  if (!retireOnly && !dryRun) {
    log("\nRe-sync curated seeds:");
    try {
      execFileSync(process.execPath, ["node_modules/tsx/dist/cli.mjs", "scripts/sync-usmle-curated-seeds.ts"], {
        cwd: ROOT,
        stdio: "inherit",
      });
    } catch {
      log("  (sync-usmle-curated skipped or failed — run manually if needed)");
    }
  }

  log("\n── Refill playbook (qaPassed metric — no compromise) ──");
  for (const f of fields) {
    log(`\n${f}:`);
    for (const cmd of fillCommands(f)) log(`  ${cmd}`);
  }
  log("\nVerify: npm run db:audit-bank-quality");
  log(dryRun ? "\n[dry-run] No database changes written." : "\nRebuild retire phase complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

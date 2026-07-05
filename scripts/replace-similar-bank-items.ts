#!/usr/bin/env node
/**
 * Replace near-duplicate bank items 1:1 with fresh, quality-gated questions.
 *
 * Phase 1 — clinical/template dedupe (vignette + stem + choices)
 * Phase 2 — semantic dedupe via pgvector clusters (NCLEX only today)
 * Phase 3 — AI gap-fill generation to restore bank counts
 * Phase 4 — QA gate + serve-ready sync
 *
 * Usage:
 *   npm run db:replace-similar:nclex:dry
 *   npm run db:replace-similar:nclex
 *   npm run db:replace-similar -- --exam all --dry-run
 *   npm run db:replace-similar -- --exam nclex,naplex --min-cluster-size 2 --apply
 */
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import {
  applyRetirements,
  ensureNclexEmbeddingsAndClusters,
  planSemanticDedupe,
} from "../src/lib/bank-curation/replace-similar-items";

const prisma = new PrismaClient();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const REPORT = path.join(ARTIFACTS, "replace-similar-bank-items.json");
const LOG = path.join(ARTIFACTS, "replace-similar-run.log");

type ExamKey =
  | "nclex"
  | "naplex"
  | "pance"
  | "usmle-step-1"
  | "usmle-step-2"
  | "usmle-step-3"
  | "aanp-fnp"
  | "npte-pt";

type ExamConfig = {
  key: ExamKey;
  fieldId: string;
  label: string;
  semantic: boolean;
  trimField: string;
  stemCap?: number;
  rebalanceScript: string;
  buildBackfillArgs: (needed: number) => string[];
  qaScript?: string;
  syncScript?: string;
  countMetric: "qaPassed" | "active";
};

const EXAM_ORDER: ExamKey[] = [
  "nclex",
  "naplex",
  "pance",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "aanp-fnp",
  "npte-pt",
];

const EXAMS: Record<ExamKey, ExamConfig> = {
  nclex: {
    key: "nclex",
    fieldId: "nursing",
    label: "NCLEX",
    semantic: true,
    trimField: "nursing",
    stemCap: 80,
    rebalanceScript: "scripts/rebalance-nclex-blueprint.ts",
    buildBackfillArgs: (needed) => [
      "--max-batches",
      String(Math.min(25, Math.max(1, Math.ceil(needed / 35)))),
      "--exams-per-batch",
      "1",
    ],
    qaScript: "scripts/qa-gate-nclex-best.ts",
    syncScript: "scripts/sync-nclex-serve-ready.ts",
    countMetric: "qaPassed",
  },
  naplex: {
    key: "naplex",
    fieldId: "pharmacy",
    label: "NAPLEX",
    semantic: false,
    trimField: "pharmacy",
    stemCap: 60,
    rebalanceScript: "scripts/rebalance-naplex-blueprint.ts",
    buildBackfillArgs: (needed) => [
      "--max-batches",
      String(Math.min(25, Math.max(1, Math.ceil(needed / 50)))),
      "--exams-per-batch",
      "1",
    ],
    qaScript: "scripts/qa-gate-naplex-best.ts",
    syncScript: "scripts/sync-naplex-serve-ready.ts",
    countMetric: "active",
  },
  pance: {
    key: "pance",
    fieldId: "pance",
    label: "PANCE",
    semantic: false,
    trimField: "pance",
    rebalanceScript: "scripts/rebalance-pance-blueprint.ts",
    buildBackfillArgs: (needed) => [
      "--max-batches",
      String(Math.min(25, Math.max(1, Math.ceil(needed / 200)))),
      "--batch-size",
      "400",
    ],
    qaScript: "scripts/qa-gate-pance-best.ts",
    countMetric: "active",
  },
  "usmle-step-1": {
    key: "usmle-step-1",
    fieldId: "usmle-step-1",
    label: "USMLE Step 1",
    semantic: false,
    trimField: "usmle-step-1",
    stemCap: 40,
    rebalanceScript: "scripts/rebalance-usmle-blueprint.ts",
    buildBackfillArgs: (needed) => [
      "--field",
      "usmle-step-1",
      "--max-batches",
      String(Math.min(25, Math.max(1, Math.ceil(needed / 50)))),
    ],
    countMetric: "active",
  },
  "usmle-step-2": {
    key: "usmle-step-2",
    fieldId: "usmle-step-2",
    label: "USMLE Step 2 CK",
    semantic: false,
    trimField: "usmle-step-2",
    stemCap: 40,
    rebalanceScript: "scripts/rebalance-usmle-blueprint.ts",
    buildBackfillArgs: (needed) => [
      "--field",
      "usmle-step-2",
      "--max-batches",
      String(Math.min(25, Math.max(1, Math.ceil(needed / 50)))),
    ],
    countMetric: "active",
  },
  "usmle-step-3": {
    key: "usmle-step-3",
    fieldId: "usmle-step-3",
    label: "USMLE Step 3",
    semantic: false,
    trimField: "usmle-step-3",
    stemCap: 40,
    rebalanceScript: "scripts/rebalance-usmle-blueprint.ts",
    buildBackfillArgs: (needed) => [
      "--field",
      "usmle-step-3",
      "--max-batches",
      String(Math.min(25, Math.max(1, Math.ceil(needed / 50)))),
    ],
    countMetric: "active",
  },
  "aanp-fnp": {
    key: "aanp-fnp",
    fieldId: "aanp-fnp",
    label: "AANP FNP",
    semantic: false,
    trimField: "aanp-fnp",
    stemCap: 50,
    rebalanceScript: "scripts/rebalance-aanp-fnp-blueprint.ts",
    buildBackfillArgs: (needed) => [
      "--max-batches",
      String(Math.min(25, Math.max(1, Math.ceil(needed / 200)))),
    ],
    countMetric: "active",
  },
  "npte-pt": {
    key: "npte-pt",
    fieldId: "npte-pt",
    label: "NPTE-PT",
    semantic: false,
    trimField: "npte-pt",
    rebalanceScript: "scripts/generate-npte-pt-to-target.ts",
    buildBackfillArgs: (needed) => [
      "--max-batches",
      String(Math.min(25, Math.max(1, Math.ceil(needed / 150)))),
      "--batch-size",
      "200",
    ],
    qaScript: "scripts/qa-gate-npte-pt-best.ts",
    countMetric: "active",
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  let exams: ExamKey[] = ["nclex"];
  let dryRun = true;
  let minClusterSize = 2;
  let skipClinical = false;
  let skipSemantic = false;
  let skipGenerate = false;

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--apply") dryRun = false;
    else if (a === "--dry-run") dryRun = true;
    else if (a === "--exam" && args[i + 1]) {
      const raw = args[++i]!;
      exams =
        raw === "all"
          ? [...EXAM_ORDER]
          : raw.split(",").map((s) => s.trim() as ExamKey).filter((k) => EXAMS[k]);
    } else if (a === "--min-cluster-size" && args[i + 1]) {
      minClusterSize = parseInt(args[++i]!, 10);
    } else if (a === "--skip-clinical") skipClinical = true;
    else if (a === "--skip-semantic") skipSemantic = true;
    else if (a === "--skip-generate") skipGenerate = true;
  }

  return { exams, dryRun, minClusterSize, skipClinical, skipSemantic, skipGenerate };
}

function log(line: string) {
  fs.mkdirSync(ARTIFACTS, { recursive: true });
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  fs.appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

function runScript(script: string, scriptArgs: string[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["node_modules/tsx/dist/cli.mjs", script, ...scriptArgs],
      {
        cwd: process.cwd(),
        stdio: "inherit",
        env: { ...process.env, OPENAI_GENERATION_ONLY: "1" },
      }
    );
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 1));
  });
}

async function getFieldCounts(fieldId: string, metric: "qaPassed" | "active") {
  const where =
    metric === "qaPassed"
      ? { fieldId, active: true, qaPassed: true }
      : { fieldId, active: true };
  const [active, qaPassed] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId, active: true } }),
    prisma.questionBankItem.count({ where: { fieldId, active: true, qaPassed: true } }),
  ]);
  return { active, qaPassed, primary: metric === "qaPassed" ? qaPassed : active };
}

async function runClinicalDedupe(
  config: ExamConfig,
  dryRun: boolean
): Promise<number> {
  const trimArgs = [
    "--fields",
    config.trimField,
    "--duplicates-only",
    ...(config.stemCap != null ? [`--stem-cap-${config.trimField}`, String(config.stemCap)] : []),
    ...(dryRun ? ["--dry-run"] : []),
  ];

  log(`  ▶ Clinical/template dedupe (${config.label})`);
  const code = await runScript("scripts/trim-duplicate-clinical-cases.ts", trimArgs);
  if (code !== 0) throw new Error(`Clinical dedupe failed for ${config.label} (exit ${code})`);

  try {
    const report = JSON.parse(
      fs.readFileSync(path.join(ARTIFACTS, "trim-duplicate-clinical-cases.json"), "utf8")
    ) as { reports?: Array<{ fieldId: string; retired?: number }> };
    const row = report.reports?.find((r) => r.fieldId === config.fieldId);
    return row?.retired ?? 0;
  } catch {
    return 0;
  }
}

async function runSemanticDedupe(
  config: ExamConfig,
  minClusterSize: number,
  dryRun: boolean
): Promise<number> {
  if (!config.semantic) return 0;

  log(`  ▶ Semantic cluster dedupe (${config.label}, min size ${minClusterSize})`);
  if (!dryRun) {
    await ensureNclexEmbeddingsAndClusters(prisma);
  } else {
    const { countMissingEmbeddings } = await import("../src/lib/bank-curation/pgvector-store");
    const missing = await countMissingEmbeddings(prisma);
    if (missing > 0) {
      log(`  (dry-run) ${missing} items need embeddings before semantic dedupe can apply`);
    }
  }

  const plan = await planSemanticDedupe(prisma, {
    fieldId: config.fieldId,
    minClusterSize,
  });

  log(
    `  semantic clusters ≥${minClusterSize}: ${plan.clustersAffected}, would retire ${plan.retireIds.length}`
  );
  for (const c of plan.clusters.slice(0, 8)) {
    log(`    ${c.clusterId}: ${c.size} items → retire ${c.retiredCount}`);
  }

  if (!dryRun && plan.retireIds.length > 0) {
    await applyRetirements(prisma, plan.retireIds, false);
    log(`  retired ${plan.retireIds.length} semantic duplicates`);
  }

  return plan.retireIds.length;
}

async function runBackfill(config: ExamConfig, needed: number, dryRun: boolean) {
  if (needed <= 0) {
    log(`  no backfill needed for ${config.label}`);
    return;
  }

  const args = config.buildBackfillArgs(needed);
  log(`  ▶ Generate ~${needed} replacement(s) — ${config.rebalanceScript} ${args.join(" ")}`);

  if (dryRun) {
    log(`  (dry-run) would run ${config.rebalanceScript}`);
    return;
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    log("  ⚠ OPENAI_API_KEY missing — skipping generation");
    return;
  }

  const code = await runScript(config.rebalanceScript, args);
  if (code !== 0) log(`  ⚠ rebalance exited ${code}`);

  if (config.qaScript) {
    log(`  ▶ QA gate (${config.label})`);
    await runScript(config.qaScript);
  }

  if (config.syncScript) {
    log(`  ▶ Sync serve-ready (${config.label})`);
    await runScript(config.syncScript, ["--retire-non-best"]);
  }
}

async function processExam(
  config: ExamConfig,
  opts: {
    dryRun: boolean;
    minClusterSize: number;
    skipClinical: boolean;
    skipSemantic: boolean;
    skipGenerate: boolean;
  }
) {
  log(`\n══ ${config.label} (${config.fieldId}) ══`);
  const baseline = await getFieldCounts(config.fieldId, config.countMetric);
  log(`  baseline: ${baseline.primary} ${config.countMetric} (${baseline.active} active, ${baseline.qaPassed} qaPassed)`);

  let clinicalRetired = 0;
  let semanticRetired = 0;

  if (!opts.skipClinical) {
    clinicalRetired = await runClinicalDedupe(config, opts.dryRun);
    log(`  clinical dedupe retired: ${clinicalRetired}`);
  }

  if (!opts.skipSemantic) {
    semanticRetired = await runSemanticDedupe(config, opts.minClusterSize, opts.dryRun);
  }

  const afterDedupe = await getFieldCounts(config.fieldId, config.countMetric);
  const deficit = Math.max(0, baseline.primary - afterDedupe.primary);
  const totalRetiredEstimate = clinicalRetired + semanticRetired;

  log(
    `  after dedupe: ${afterDedupe.primary} ${config.countMetric} (deficit ${deficit}, ~${totalRetiredEstimate} retired)`
  );

  const replaceCount = opts.dryRun ? totalRetiredEstimate : deficit;
  if (!opts.skipGenerate) {
    await runBackfill(config, replaceCount, opts.dryRun);
  }

  const final = await getFieldCounts(config.fieldId, config.countMetric);
  log(
    `  final: ${final.primary} ${config.countMetric} (${final.active} active) — restored ${Math.max(0, final.primary - afterDedupe.primary)} via generation`
  );

  return {
    exam: config.key,
    label: config.label,
    fieldId: config.fieldId,
    dryRun: opts.dryRun,
    baseline,
    afterDedupe,
    final,
    clinicalRetired,
    semanticRetired,
    replaceTarget: replaceCount,
  };
}

async function main() {
  const { exams, dryRun, minClusterSize, skipClinical, skipSemantic, skipGenerate } =
    parseArgs();

  fs.mkdirSync(ARTIFACTS, { recursive: true });
  fs.writeFileSync(LOG, `=== replace similar bank items ${new Date().toISOString()} ===\n`);

  log(
    `Replace similar questions 1:1 — exams=${exams.join(",")} minCluster=${minClusterSize}${dryRun ? " [dry-run]" : " [apply]"}`
  );

  const results = [];
  for (const key of exams) {
    const config = EXAMS[key];
    if (!config) continue;
    results.push(
      await processExam(config, {
        dryRun,
        minClusterSize,
        skipClinical,
        skipSemantic,
        skipGenerate,
      })
    );
  }

  fs.writeFileSync(
    REPORT,
    JSON.stringify({ generatedAt: new Date().toISOString(), dryRun, results }, null, 2)
  );
  log(`\nReport: ${REPORT}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

#!/usr/bin/env node
/**
 * Elevate USMLE Step 3 toward A− / A on the tough NBME/UWorld bar.
 *
 * Focus:
 *  1) Format categories — biostats, ethics, pharm-ads/abstracts, CCS
 *  2) Quarantine thin / serve-unsafe format items
 *  3) Rebalance step3-formats generation (existing pipeline)
 *  4) Structured rationale enrichment (UWorld teachability)
 *
 * Usage:
 *   bash scripts/run-with-node.sh npx tsx scripts/elevate-usmle-step3-a-quality.mts --audit-only
 *   bash scripts/run-with-node.sh npx tsx scripts/elevate-usmle-step3-a-quality.mts --wave 1
 *   bash scripts/run-with-node.sh npx tsx scripts/elevate-usmle-step3-a-quality.mts --wave 1 --skip-generate
 *
 * Env: DATABASE_URL + OPENAI_API_KEY via scripts/load-env.ts (never hardcode).
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, requireOpenAiKey } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow, serializeBankOptions } from "../src/lib/mpje/parse-bank-options";
import { generateStructuredRationale, rationaleInputFromBankItem } from "../src/lib/engine/rationale";
import { usmleBankItemIsServeReady } from "../src/lib/exam-prep/usmle-clinical-gate";
import { USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES } from "../src/lib/exam-prep/usmle/steps";

const prisma = new PrismaClient();
const FIELD = "usmle-step-3";
const OUT_DIR = path.join(process.cwd(), "tmp");
const ARTIFACTS = path.join(process.cwd(), "artifacts");

const FORMAT_TYPES = [
  "biostats",
  "ethics",
  "abstract",
  "drug_ad",
  "ccs_prompt",
  "sequential",
] as const;

const CCS_TYPES = new Set(["ccs_prompt", "sequential"]);

/** Thin CCS / CCS-like stems without decision-framework language. */
const CCS_FRAMEWORK_RE =
  /\b(order|orders|workup|monitor|monitoring|disposition|discharge|admit|escalate|next step|initial|follow[- ]?up|ccs)\b/i;

type GapReport = {
  checkedAt: string;
  fieldId: string;
  active: number;
  serve: number;
  bySubject: Record<string, number>;
  byType: Record<string, number>;
  enrichedRationales: number;
  enrichedPct: number;
  gapScores: {
    biostats: number;
    ethics: number;
    abstract: number;
    drug_ad: number;
    ccs_prompt: number;
    sequential: number;
    formatPool: number;
    ccsPool: number;
  };
  targets: {
    biostats: number;
    ethics: number;
    abstract: number;
    drug_ad: number;
    ccs_prompt: number;
    enrichedPct: number;
    formatPool: number;
  };
  flags: string[];
};

function parseArgs() {
  const args = process.argv.slice(2);
  let wave = 1;
  let auditOnly = false;
  let skipGenerate = false;
  let skipEnrich = false;
  let skipFix = false;
  let skipRate = false;
  let enrichLimit = 150;
  let maxBatches = 1;
  let countPerExam = 60;
  let fillDeficits = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--wave" && args[i + 1]) wave = Number(args[++i]);
    else if (args[i] === "--audit-only") auditOnly = true;
    else if (args[i] === "--skip-generate") skipGenerate = true;
    else if (args[i] === "--skip-enrich") skipEnrich = true;
    else if (args[i] === "--skip-fix") skipFix = true;
    else if (args[i] === "--skip-rate") skipRate = true;
    else if (args[i] === "--enrich-limit" && args[i + 1]) enrichLimit = Number(args[++i]);
    else if (args[i] === "--max-batches" && args[i + 1]) maxBatches = Number(args[++i]);
    else if (args[i] === "--count" && args[i + 1]) countPerExam = Number(args[++i]);
    else if (args[i] === "--fill-deficits") fillDeficits = true;
  }
  return {
    wave,
    auditOnly,
    skipGenerate,
    skipEnrich,
    skipFix,
    skipRate,
    enrichLimit,
    maxBatches,
    countPerExam,
    fillDeficits,
  };
}

async function audit(): Promise<GapReport> {
  const [active, serve, subjects, types, enrichedRows] = await Promise.all([
    prisma.questionBankItem.count({ where: { fieldId: FIELD, active: true } }),
    prisma.questionBankItem.count({ where: { fieldId: FIELD, active: true, qaPassed: true } }),
    prisma.questionBankItem.groupBy({
      by: ["subjectId"],
      where: { fieldId: FIELD, active: true, qaPassed: true },
      _count: { _all: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["itemType"],
      where: { fieldId: FIELD, active: true, qaPassed: true },
      _count: { _all: true },
    }),
    prisma.$queryRaw<Array<{ n: number }>>`
      SELECT COUNT(*)::int AS n FROM "QuestionBankItem"
      WHERE "fieldId" = ${FIELD} AND active AND "qaPassed"
        AND ("generationMeta"::text LIKE '%rationaleEnrichedAt%'
          OR "generationMeta"::text LIKE '%expertRationale%')
    `,
  ]);

  const bySubject = Object.fromEntries(
    subjects
      .sort((a, b) => b._count._all - a._count._all)
      .map((g) => [g.subjectId ?? "null", g._count._all])
  );
  const byType = Object.fromEntries(types.map((g) => [g.itemType ?? "null", g._count._all]));

  const biostats = byType.biostats ?? 0;
  const ethics = byType.ethics ?? 0;
  const abstract = byType.abstract ?? 0;
  const drugAd = byType.drug_ad ?? 0;
  const ccsPrompt = byType.ccs_prompt ?? 0;
  const sequential = byType.sequential ?? 0;
  const formatPool = biostats + ethics + abstract + drugAd + ccsPrompt + sequential;
  const ccsPool = ccsPrompt + sequential;
  const enriched = enrichedRows[0]?.n ?? 0;
  const enrichedPct = serve ? Math.round((enriched / serve) * 1000) / 10 : 0;

  const targets = {
    biostats: 200,
    ethics: 150,
    abstract: 80,
    drug_ad: 80,
    ccs_prompt: 120,
    enrichedPct: 15,
    formatPool: 600,
  };

  const flags = [
    biostats < 80 ? "critical_biostats_underbuild" : null,
    ethics < 60 ? "ethics_thin" : null,
    abstract < 40 ? "abstract_thin" : null,
    drugAd < 40 ? "drug_ad_thin" : null,
    ccsPrompt < 50 ? "ccs_prompt_thin" : null,
    ccsPool < 100 ? "ccs_pool_thin" : null,
    formatPool < 400 ? "format_pool_underbuild" : null,
    enrichedPct < 10 ? "rationale_teachability_low" : null,
  ].filter(Boolean) as string[];

  const report: GapReport = {
    checkedAt: new Date().toISOString(),
    fieldId: FIELD,
    active,
    serve,
    bySubject,
    byType,
    enrichedRationales: enriched,
    enrichedPct,
    gapScores: {
      biostats,
      ethics,
      abstract,
      drug_ad: drugAd,
      ccs_prompt: ccsPrompt,
      sequential,
      formatPool,
      ccsPool,
    },
    targets,
    flags,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const out = path.join(OUT_DIR, "usmle-step3-a-quality-gap.json");
  writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(`\nGap audit → ${out}`);
  console.log(JSON.stringify(report.gapScores, null, 2));
  console.log("Flags:", report.flags.join(", ") || "none");
  return report;
}

async function quarantineBrokenFormatItems(): Promise<number> {
  console.log("\nQuarantine serve-unsafe / thin CCS-format Step 3 items…");
  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: FIELD,
      active: true,
      OR: [
        { itemType: { in: [...USMLE_STEP3_NON_VIGNETTE_ITEM_TYPES] } },
        { itemType: "sequential" },
      ],
    },
    take: 600,
    orderBy: { updatedAt: "asc" },
  });

  let quarantined = 0;
  for (const row of rows) {
    const item = enrichBankItemFromRow(row);
    const serveOk = usmleBankItemIsServeReady(item, FIELD);
    const stem = `${row.scenario ?? ""}\n${row.question}\n${row.explanation ?? ""}`;
    const itemType = row.itemType ?? item.itemType ?? "mcq";

    const thinCcs =
      CCS_TYPES.has(itemType) &&
      !CCS_FRAMEWORK_RE.test(stem) &&
      (stem.replace(/\s+/g, " ").trim().length < 180 || !serveOk);

    const badFormat =
      FORMAT_TYPES.includes(itemType as (typeof FORMAT_TYPES)[number]) &&
      !serveOk &&
      ((item.options?.length ?? 0) < 4 ||
        !item.correctAnswer?.trim() ||
        (item.explanation?.trim().length ?? 0) < 40);

    if (!thinCcs && !badFormat) continue;

    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        active: false,
        qaPassed: false,
        reviewStatus: "usmle_step3_format_quarantine",
        updatedAt: new Date(),
      },
    });
    quarantined++;
  }

  console.log(`Quarantined ${quarantined} items`);
  return quarantined;
}

function runNpmScript(script: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(
      "bash",
      ["scripts/run-with-node.sh", "npx", "tsx", script, ...args],
      { cwd: process.cwd(), stdio: "inherit", env: process.env }
    );
    child.on("close", (code) => resolve(code ?? 1));
  });
}

async function runFixPass(): Promise<{ fixCode: number; polishCode: number; qaFailingCode: number | null }> {
  console.log("\nRunning USMLE audit gap fixers + polish…");
  const fixCode = await runNpmScript("scripts/fix-usmle-audit-gaps.ts", ["--field", FIELD]);
  const polishCode = await runNpmScript("scripts/polish-usmle-questions.ts", ["--field", FIELD]);

  let qaFailingCode: number | null = null;
  const failingCsv = path.join(ARTIFACTS, "usmle-qa-failing.csv");
  if (existsSync(failingCsv)) {
    qaFailingCode = await runNpmScript("scripts/polish-usmle-qa-failing.ts", [
      "--field",
      FIELD,
      "--limit",
      "200",
    ]);
  } else {
    console.log(`Skip polish-usmle-qa-failing (CSV missing: ${failingCsv})`);
  }

  return { fixCode, polishCode, qaFailingCode };
}

async function runGeneratePass(opts: {
  maxBatches: number;
  countPerExam: number;
  fillDeficits: boolean;
  wave: number;
}): Promise<number> {
  const args = [
    "--field",
    FIELD,
    "--step3-formats",
    "--max-batches",
    String(Math.max(1, opts.maxBatches)),
    "--count",
    String(Math.max(20, Math.min(80, opts.countPerExam))),
    "--metric",
    "qaPassed",
  ];
  // Later waves can also fill category deficits.
  if (opts.fillDeficits || opts.wave >= 2) {
    // step3-formats already sets categories; fill-deficits is an alternate mode in rebalance.
    // Keep formats focus for wave 1; wave 2+ may pass --fill-deficits alone via flag.
  }
  console.log(`\nGenerating Step 3 format stock via rebalance (${args.join(" ")})…`);
  const code = await runNpmScript("scripts/rebalance-usmle-blueprint.ts", args);
  if (opts.fillDeficits) {
    console.log("\nAlso filling Step 3 blueprint deficits…");
    await runNpmScript("scripts/rebalance-usmle-blueprint.ts", [
      "--field",
      FIELD,
      "--fill-deficits",
      "--max-batches",
      String(Math.max(1, opts.maxBatches)),
      "--count",
      String(Math.max(20, Math.min(80, opts.countPerExam))),
      "--metric",
      "qaPassed",
    ]);
  }
  return code;
}

async function enrichSlice(limit: number) {
  console.log(`\nEnrich rationales on Step 3 serve-ready items (limit ${limit})…`);
  requireOpenAiKey();

  const formatPriority = [...FORMAT_TYPES];
  const rows = await prisma.questionBankItem.findMany({
    where: {
      fieldId: FIELD,
      active: true,
      qaPassed: true,
      OR: [
        { itemType: { in: formatPriority } },
        { tags: { contains: "usmle-step3-elevate" } },
        { reviewStatus: "usmle_step3_a_elevate" },
      ],
    },
    orderBy: { updatedAt: "asc" },
    take: limit * 3,
  });

  let enriched = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of rows) {
    if (enriched >= limit) break;
    const meta =
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : {};
    if (meta.rationaleEnrichedAt && meta.elevateRationaleV2) {
      skipped++;
      continue;
    }

    const item = enrichBankItemFromRow(row);
    const gen = await generateStructuredRationale(rationaleInputFromBankItem(item, FIELD));
    if (!gen?.quality.ok) {
      failed++;
      continue;
    }

    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        explanation: gen.assembled.explanation,
        options: serializeBankOptions({
          ...item,
          distractorRationale: gen.assembled.distractorRationale,
          clinicalReasoning: gen.assembled.clinicalReasoning,
          keyTakeaways: gen.assembled.keyTakeaways,
        }),
        generationMeta: {
          ...meta,
          structuredRationale: gen.structured,
          rationaleEnrichedAt: new Date().toISOString(),
          elevateRationaleV2: true,
          rationaleModel: gen.model,
          rationaleQualityScore: gen.quality.score,
          pipeline: "elevate-usmle-step3-a-quality",
        },
        reviewStatus: row.reviewStatus || "usmle_step3_a_elevate",
        updatedAt: new Date(),
      },
    });
    enriched++;
    if (enriched % 10 === 0) console.log(`  … enriched ${enriched}`);
  }

  console.log(`Enrich done: ${enriched} ok, ${failed} failed, ${skipped} skipped`);
  return { enriched, failed, skipped };
}

async function runToughRate(sample = 32): Promise<number> {
  console.log(`\nTough NBME/UWorld-bar rating for ${FIELD}…`);
  requireOpenAiKey();
  return runNpmScript("scripts/rate-usmle-nbme-tough.mts", [
    "--field",
    FIELD,
    "--sample",
    String(sample),
  ]);
}

async function main() {
  const opts = parseArgs();
  mkdirSync(ARTIFACTS, { recursive: true });
  console.log(`\nUSMLE Step 3 A−/A elevation · wave ${opts.wave}\n`);

  const gap = await audit();
  if (opts.auditOnly) {
    await prisma.$disconnect();
    return;
  }

  requireOpenAiKey();

  let quarantined = 0;
  let fixStats: { fixCode: number; polishCode: number; qaFailingCode: number | null } | null =
    null;
  if (!opts.skipFix) {
    quarantined = await quarantineBrokenFormatItems();
    fixStats = await runFixPass();
  }

  let generateCode: number | null = null;
  if (!opts.skipGenerate) {
    generateCode = await runGeneratePass({
      maxBatches: opts.maxBatches,
      countPerExam: opts.countPerExam,
      fillDeficits: opts.fillDeficits,
      wave: opts.wave,
    });
  }

  let enrichStats = { enriched: 0, failed: 0, skipped: 0 };
  if (!opts.skipEnrich) {
    enrichStats = await enrichSlice(opts.enrichLimit);
  }

  let rateCode: number | null = null;
  if (!opts.skipRate) {
    rateCode = await runToughRate(32);
  }

  const after = await audit();
  const summary = {
    wave: opts.wave,
    fieldId: FIELD,
    completedAt: new Date().toISOString(),
    quarantined,
    fix: fixStats,
    generateCode,
    enrich: enrichStats,
    rateCode,
    before: gap.gapScores,
    after: after.gapScores,
    flagsBefore: gap.flags,
    flagsAfter: after.flags,
    enrichedPctBefore: gap.enrichedPct,
    enrichedPctAfter: after.enrichedPct,
  };
  const summaryPath = path.join(ARTIFACTS, `usmle-step3-a-elevate-wave${opts.wave}.json`);
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log(`\nWave summary → ${summaryPath}`);
  console.log(JSON.stringify(summary, null, 2));
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

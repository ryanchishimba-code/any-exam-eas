#!/usr/bin/env node
/**
 * Serve-ready QA scan — heuristic gates + optional LLM board review.
 *
 * Usage:
 *   npm run qa:scan -- --exam=naplex
 *   npm run qa:scan -- --exam=nclex --limit=500 --llm
 *   npm run qa:scan -- --exam=all --heuristics-only
 *   npm run qa:scan -- --exam=usmle --llm --llm-limit=200 --apply
 *   npm run qa:scan -- --exam=naplex --llm --resume
 *
 * Env:
 *   DATABASE_URL          Neon Postgres (required)
 *   OPENAI_API_KEY        for --provider=openai (default)
 *   ANTHROPIC_API_KEY     for --provider=anthropic
 *   QA_SCAN_OPENAI_MODEL  default gpt-4o-mini
 *   OPENAI_ALLOWED_PURPOSES include curation when generation-only mode is on
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { loadEnvFiles } from "./load-env";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { resolveFieldIds } from "../src/lib/qa-scan/exam-config";
import { runHeuristicPrefilter } from "../src/lib/qa-scan/heuristic-prefilter";
import { serializeBankRowForQa } from "../src/lib/qa-scan/serialize-item";
import { evaluateItemsInLlmBatches } from "../src/lib/qa-scan/llm-provider";
import {
  buildQaScanSummary,
  writeFailingCsv,
  writeQaScanReport,
} from "../src/lib/qa-scan/report";
import {
  checkpointFilePath,
  loadCheckpoint,
  mergeCheckpointResults,
  processedIdSet,
  saveCheckpoint,
} from "../src/lib/qa-scan/checkpoint";
import type {
  QaScanExamSlug,
  QaScanItemResult,
  QaScanProvider,
  QaScanReport,
} from "../src/lib/qa-scan/types";

loadEnvFiles();

const prisma = new PrismaClient();
const DB_BATCH = 200;

type CliOptions = {
  exam: QaScanExamSlug;
  field?: string;
  limit: number;
  llm: boolean;
  heuristicsOnly: boolean;
  llmLimit: number;
  llmBatchSize: number;
  llmConcurrency: number;
  llmOnHeuristicPassOnly: boolean;
  provider: QaScanProvider;
  model?: string;
  sampleRate: number;
  dryRun: boolean;
  apply: boolean;
  failAction: "none" | "flag" | "deactivate";
  resume: boolean;
  outDir: string;
};

function parseExamArg(): QaScanExamSlug {
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--exam=")) {
      const v = arg.slice("--exam=".length).toLowerCase();
      if (
        v === "naplex" ||
        v === "nclex" ||
        v === "usmle" ||
        v === "pance" ||
        v === "aanp-fnp" ||
        v === "npte-pt" ||
        v === "all"
      ) {
        return v;
      }
    }
  }
  return "all";
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  let field: string | undefined;
  let limit = 0;
  let llmLimit = 0;
  let llmBatchSize = 8;
  let llmConcurrency = 3;
  let sampleRate = 1;
  let model: string | undefined;
  let provider: QaScanProvider = "openai";
  let failAction: CliOptions["failAction"] = "none";

  let llm = false;
  let heuristicsOnly = false;
  let llmOnHeuristicPassOnly = true;
  let dryRun = false;
  let apply = false;
  let resume = false;
  let outDir = path.join(process.cwd(), "artifacts");

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]!;
    if (arg.startsWith("--exam=")) continue;
    else if (arg === "--exam" && args[i + 1]) {
      /* legacy */
    } else if (arg === "--field" && args[i + 1]) field = args[++i];
    else if (arg.startsWith("--field=")) field = arg.slice("--field=".length);
    else if (arg === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
    else if (arg.startsWith("--limit=")) limit = Number.parseInt(arg.slice("--limit=".length), 10);
    else if (arg === "--llm") llm = true;
    else if (arg === "--heuristics-only") heuristicsOnly = true;
    else if (arg === "--llm-all") llmOnHeuristicPassOnly = false;
    else if (arg === "--llm-limit" && args[i + 1]) llmLimit = Number.parseInt(args[++i]!, 10);
    else if (arg.startsWith("--llm-limit=")) llmLimit = Number.parseInt(arg.slice("--llm-limit=".length), 10);
    else if (arg === "--llm-batch-size" && args[i + 1]) {
      llmBatchSize = Number.parseInt(args[++i]!, 10);
    } else if (arg.startsWith("--llm-batch-size=")) {
      llmBatchSize = Number.parseInt(arg.slice("--llm-batch-size=".length), 10);
    } else if (arg === "--llm-concurrency" && args[i + 1]) {
      llmConcurrency = Number.parseInt(args[++i]!, 10);
    } else if (arg.startsWith("--llm-concurrency=")) {
      llmConcurrency = Number.parseInt(arg.slice("--llm-concurrency=".length), 10);
    } else if (arg === "--sample-rate" && args[i + 1]) {
      sampleRate = Number.parseFloat(args[++i]!);
    } else if (arg.startsWith("--sample-rate=")) {
      sampleRate = Number.parseFloat(arg.slice("--sample-rate=".length));
    } else if (arg === "--provider" && args[i + 1]) {
      provider = args[++i] === "anthropic" ? "anthropic" : "openai";
    } else if (arg.startsWith("--provider=")) {
      provider = arg.slice("--provider=".length) === "anthropic" ? "anthropic" : "openai";
    } else if (arg === "--model" && args[i + 1]) model = args[++i];
    else if (arg.startsWith("--model=")) model = arg.slice("--model=".length);
    else if (arg === "--dry-run") dryRun = true;
    else if (arg === "--apply") apply = true;
    else if (arg === "--resume") resume = true;
    else if (arg === "--fail-action" && args[i + 1]) {
      const v = args[++i]!;
      if (v === "flag" || v === "deactivate") failAction = v;
    } else if (arg.startsWith("--fail-action=")) {
      const v = arg.slice("--fail-action=".length);
      if (v === "flag" || v === "deactivate") failAction = v;
    } else if (arg === "--out" && args[i + 1]) outDir = args[++i]!;
    else if (arg.startsWith("--out=")) outDir = arg.slice("--out=".length);
  }

  if (heuristicsOnly) llm = false;

  return {
    exam: parseExamArg(),
    field,
    limit,
    llm,
    heuristicsOnly,
    llmLimit,
    llmBatchSize,
    llmConcurrency,
    llmOnHeuristicPassOnly,
    provider,
    model,
    sampleRate: Math.max(0.01, Math.min(1, sampleRate)),
    dryRun,
    apply,
    failAction: apply ? failAction || "flag" : "none",
    resume,
    outDir,
  };
}

function shouldSample(id: string, rate: number): boolean {
  if (rate >= 1) return true;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return (hash % 10_000) / 10_000 < rate;
}

async function applyDbUpdates(
  results: QaScanItemResult[],
  failAction: "flag" | "deactivate",
  dryRun: boolean
): Promise<number> {
  const failing = results.filter((r) => !r.pass);
  if (failing.length === 0 || dryRun) return 0;

  const now = new Date();
  let updated = 0;

  for (const item of failing) {
      const existing = await prisma.questionBankItem.findUnique({
        where: { id: item.id },
        select: { generationMeta: true },
      });
      const prior =
        existing?.generationMeta && typeof existing.generationMeta === "object"
          ? (existing.generationMeta as Record<string, unknown>)
          : {};

      const llmMeta = item.llm
        ? {
            ...prior,
            qaScan: {
              at: now.toISOString(),
              verdict: item.verdict,
              overallScore: item.llm.overallScore,
              issues: item.llm.issues,
              suggestedFixes: item.llm.suggestedFixes,
            },
          }
        : {
            ...prior,
            qaScan: {
              at: now.toISOString(),
              verdict: item.verdict,
              issues: item.heuristicIssues.map((h) => h.code),
            },
          };

    if (failAction === "deactivate") {
      await prisma.questionBankItem.update({
        where: { id: item.id },
        data: {
          active: false,
          qaPassed: false,
          reviewStatus: "rejected",
          qaAuditedAt: now,
          generationMeta: llmMeta,
        },
      });
    } else {
      await prisma.questionBankItem.update({
        where: { id: item.id },
        data: {
          reviewStatus: "flagged",
          qaAuditedAt: now,
          generationMeta: llmMeta,
        },
      });
    }
    updated++;
  }

  return updated;
}

async function main() {
  const opts = parseArgs();
  const fieldIds = opts.field ? [opts.field] : resolveFieldIds(opts.exam);
  const checkpointPath = checkpointFilePath(opts.outDir, opts.exam);
  const checkpoint = opts.resume ? loadCheckpoint(checkpointPath) : null;
  const skipIds = processedIdSet(checkpoint);

  const where = {
    active: true,
    qaPassed: true,
    fieldId: fieldIds.length === 1 ? fieldIds[0] : { in: fieldIds },
  };

  const totalQueried = await prisma.questionBankItem.count({ where });
  console.log(
    `\nQA scan — ${opts.exam} | ${totalQueried.toLocaleString()} serve-ready item(s)` +
      `${opts.llm ? " | LLM on" : " | heuristics only"}` +
      `${opts.dryRun ? " [dry-run]" : ""}\n`
  );

  let lastId: string | undefined;
  let processed = 0;
  let llmCallsUsed = 0;
  const allResults: QaScanItemResult[] = checkpoint ? [...checkpoint.itemResults] : [];
  let provider: QaScanProvider | undefined;
  let model: string | undefined;

  const startedAt = checkpoint?.startedAt ?? new Date().toISOString();

  while (true) {
    if (opts.limit > 0 && processed >= opts.limit) break;

    const take = Math.min(DB_BATCH, opts.limit > 0 ? opts.limit - processed : DB_BATCH);
    const rows = await prisma.questionBankItem.findMany({
      where: {
        ...where,
        ...(lastId ? { id: { gt: lastId } } : {}),
      },
      orderBy: { id: "asc" },
      take,
    });

    if (rows.length === 0) break;

    const batchResults: QaScanItemResult[] = [];
    const llmCandidates: ReturnType<typeof serializeBankRowForQa>[] = [];
    const llmCandidateMeta = new Map<string, QaScanItemResult>();

    for (const row of rows) {
      if (skipIds.has(row.id)) continue;
      if (!shouldSample(row.id, opts.sampleRate)) {
        batchResults.push({
          id: row.id,
          fieldId: row.fieldId,
          subjectId: row.subjectId,
          itemType: row.itemType,
          source: row.source,
          verdict: "skipped",
          pass: true,
          heuristicOk: true,
          heuristicIssues: [],
          skippedLlmReason: "sample_rate",
        });
        continue;
      }

      const item = enrichBankItemFromRow(row);
      const heuristic = runHeuristicPrefilter(item, row.fieldId, row.source);
      const serialized = serializeBankRowForQa(row, item);

      const base: QaScanItemResult = {
        id: row.id,
        fieldId: row.fieldId,
        subjectId: row.subjectId,
        itemType: row.itemType,
        source: row.source,
        verdict: heuristic.ok ? "pass" : "fail",
        pass: heuristic.ok,
        heuristicOk: heuristic.ok,
        heuristicIssues: heuristic.issues,
      };

      if (!heuristic.ok) {
        batchResults.push(base);
        continue;
      }

      if (opts.llm) {
        if (opts.llmOnHeuristicPassOnly || heuristic.ok) {
          if (opts.llmLimit === 0 || llmCallsUsed < opts.llmLimit) {
            llmCandidates.push(serialized);
            llmCandidateMeta.set(row.id, base);
          } else {
            batchResults.push({
              ...base,
              verdict: "skipped",
              pass: true,
              skippedLlmReason: "llm_limit",
            });
          }
        } else {
          batchResults.push(base);
        }
      } else {
        batchResults.push(base);
      }
    }

    if (opts.llm && llmCandidates.length > 0) {
      const byField = new Map<string, typeof llmCandidates>();
      for (const s of llmCandidates) {
        const list = byField.get(s.fieldId) ?? [];
        list.push(s);
        byField.set(s.fieldId, list);
      }

      for (const [fieldId, items] of byField) {
        const llmResult = await evaluateItemsInLlmBatches({
          fieldId,
          items,
          provider: opts.provider,
          model: opts.model,
          llmBatchSize: opts.llmBatchSize,
          concurrency: opts.llmConcurrency,
          onBatchDone: (done, total) => {
            if (total > 3) process.stdout.write(`  LLM batch ${done}/${total}\r`);
          },
        });

        provider = llmResult.provider;
        model = llmResult.model;
        if (llmResult.rawError) {
          console.warn(`\nLLM warning: ${llmResult.rawError}`);
        }

        llmCallsUsed += items.length;

        for (const evalRow of llmResult.evaluations) {
          const base = llmCandidateMeta.get(evalRow.itemId);
          if (!base) continue;
          llmCandidateMeta.delete(evalRow.itemId);
          batchResults.push({
            ...base,
            verdict: evalRow.verdict,
            pass: evalRow.pass && base.heuristicOk,
            llm: evalRow,
          });
        }

        for (const item of items) {
          const base = llmCandidateMeta.get(item.id);
          if (!base) continue;
          llmCandidateMeta.delete(item.id);
          batchResults.push({
            ...base,
            verdict: "review",
            pass: false,
            skippedLlmReason: "llm_missing_evaluation",
          });
        }
      }
    }

    allResults.push(...batchResults);
    processed += rows.length;
    lastId = rows[rows.length - 1]!.id;

    if (!opts.dryRun && (processed % 1000 === 0 || rows.length < DB_BATCH)) {
      saveCheckpoint(checkpointPath, {
        startedAt,
        updatedAt: new Date().toISOString(),
        processedIds: allResults.map((r) => r.id),
        itemResults: allResults,
      });
    }

    if (processed % 2000 === 0 || rows.length < DB_BATCH) {
      const fail = allResults.filter((r) => !r.pass).length;
      console.log(`  … ${processed.toLocaleString()} processed | ${fail} failing so far`);
    }
  }

  const merged = mergeCheckpointResults(checkpoint?.itemResults ?? [], allResults);

  const pass = merged.filter((r) => r.pass).length;
  const fail = merged.filter((r) => !r.pass).length;
  const review = merged.filter((r) => r.verdict === "review").length;
  const skipped = merged.filter((r) => r.verdict === "skipped").length;
  const heuristicFail = merged.filter((r) => !r.heuristicOk).length;
  const llmEvaluated = merged.filter((r) => r.llm).length;

  const summary = buildQaScanSummary(
    {
      generatedAt: new Date().toISOString(),
      exam: opts.exam,
      fieldIds,
      mode: opts.heuristicsOnly ? "heuristics-only" : opts.llm ? "heuristics+llm" : "heuristics-only",
      provider,
      model,
      totalQueried,
      totalEvaluated: merged.length,
      heuristicFail,
      llmEvaluated,
      pass,
      fail,
      review,
      skipped,
    },
    merged
  );

  const report: QaScanReport = { summary, items: merged };
  const { jsonPath, mdPath } = writeQaScanReport(report, opts.outDir);
  const csvPath = path.join(opts.outDir, `qa-scan-${opts.exam}-failing.csv`);
  writeFailingCsv(merged, csvPath);

  if (opts.apply && opts.failAction !== "none") {
    const n = await applyDbUpdates(merged, opts.failAction, opts.dryRun);
    console.log(`\nDB updates: ${n} item(s) ${opts.failAction === "deactivate" ? "deactivated" : "flagged"}`);
  }

  if (!opts.dryRun) {
    saveCheckpoint(checkpointPath, {
      startedAt,
      updatedAt: new Date().toISOString(),
      processedIds: merged.map((r) => r.id),
      itemResults: merged,
    });
  }

  console.log(`\n── QA scan complete ──`);
  console.log(`Pass: ${pass} | Fail: ${fail} | Review: ${review} | Skipped: ${skipped}`);
  console.log(`Heuristic fail: ${heuristicFail} | LLM evaluated: ${llmEvaluated}`);
  console.log(`\nJSON: ${jsonPath}`);
  console.log(`Markdown: ${mdPath}`);
  console.log(`Failing CSV: ${csvPath}`);

  if (fail > 0) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

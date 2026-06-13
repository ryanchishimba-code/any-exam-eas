#!/usr/bin/env node
/**
 * Smart AI curation for USMLE bank items — heuristic QA → rule polish → Self-RAG repair.
 *
 * Usage:
 *   npm run db:curate-usmle:ai:all          # rewrite entire failing bank (resumable)
 *   npm run db:curate-usmle:ai -- --limit 50 --max-score 6.5
 *   npm run db:curate-usmle:ai -- --from-db --all --resume
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { auditBankItem } from "../src/lib/exam-prep/bank-audit";
import { auditUsmleQaEditor } from "../src/lib/exam-prep/usmle-qa-editor";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import { splitUsmleBankItem } from "../src/lib/exam-prep/usmle-clinical-gate";
import type { UsmleCurationResult } from "../src/lib/engine/curation";
import type { UsmleQaReport } from "../src/lib/exam-prep/usmle-qa-editor";

const prisma = new PrismaClient();

const USMLE_FIELDS = ["usmle-step-1", "usmle-step-2", "usmle-step-3"] as const;
const CHECKPOINT_PATH = path.join(process.cwd(), "artifacts/usmle-curate-checkpoint.json");
const LOG_PATH = path.join(process.cwd(), "artifacts/usmle-curate-run.log");

type Checkpoint = {
  startedAt: string;
  updatedAt: string;
  processed: string[];
  counts: Record<string, number>;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let csv = path.join(process.cwd(), "artifacts/usmle-qa-failing.csv");
  let limit = 50;
  let maxScore = 10;
  let minAccept = 8;
  let dryRun = false;
  let offline = false;
  let all = false;
  let fromDb = false;
  let resume = false;
  let fresh = false;
  let noRag = false;
  let field: string | undefined;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--csv" && args[i + 1]) csv = args[++i]!;
    else if (args[i] === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
    else if (args[i] === "--max-score" && args[i + 1]) maxScore = Number.parseFloat(args[++i]!);
    else if (args[i] === "--min-accept" && args[i + 1]) minAccept = Number.parseFloat(args[++i]!);
    else if (args[i] === "--field" && args[i + 1]) field = args[++i]!;
    else if (args[i] === "--dry-run") dryRun = true;
    else if (args[i] === "--offline") offline = true;
    else if (args[i] === "--all") all = true;
    else if (args[i] === "--from-db") fromDb = true;
    else if (args[i] === "--resume") resume = true;
    else if (args[i] === "--fresh") fresh = true;
    else if (args[i] === "--no-rag") noRag = true;
  }
  return { csv, limit, maxScore, minAccept, dryRun, offline, all, fromDb, resume, fresh, noRag, field };
}

function logLine(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
  fs.appendFileSync(LOG_PATH, line + "\n");
}

function loadCheckpoint(): Checkpoint | null {
  if (!fs.existsSync(CHECKPOINT_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(CHECKPOINT_PATH, "utf8")) as Checkpoint;
  } catch {
    return null;
  }
}

function saveCheckpoint(checkpoint: Checkpoint) {
  fs.mkdirSync(path.dirname(CHECKPOINT_PATH), { recursive: true });
  checkpoint.updatedAt = new Date().toISOString();
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(checkpoint, null, 2));
}

function parseCsvIds(csvPath: string, maxScore: number, limit: number): string[] {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV not found: ${csvPath}. Run npm run db:audit-usmle first.`);
  }
  const lines = fs.readFileSync(csvPath, "utf8").trim().split("\n");
  const rows = lines
    .slice(1)
    .map((line) => {
      const m = line.match(/^([^,]+),([^,]+),([^,]+),([^,]+),([0-9.]+),/);
      if (!m) return null;
      const [, itemId, , , , scoreStr] = m;
      return { itemId: itemId!, overallScore: Number.parseFloat(scoreStr!) };
    })
    .filter((r): r is { itemId: string; overallScore: number } => r !== null)
    .filter((r) => r.overallScore <= maxScore);

  rows.sort((a, b) => a.overallScore - b.overallScore);
  const capped = limit >= rows.length ? rows : rows.slice(0, limit);
  return capped.map((r) => r.itemId);
}

async function idsFromDb(field?: string): Promise<string[]> {
  const rows = await prisma.questionBankItem.findMany({
    where: {
      active: true,
      qaPassed: false,
      fieldId: field ? field : { in: [...USMLE_FIELDS] },
    },
    select: { id: true },
    orderBy: { updatedAt: "asc" },
  });
  return rows.map((r) => r.id);
}

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rateLimitDelayMs(message: string): number | null {
  if (message.includes("requests per day")) return 30 * 60 * 1000;
  const m = message.match(/try again in ([0-9]+)s/i);
  if (m) return (Number.parseInt(m[1]!, 10) + 2) * 1000;
  if (message.includes("429") || message.includes("rate limit")) return 8000;
  return null;
}

function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function hashForRow(
  fieldId: string,
  subjectId: string,
  item: UsmleCurationResult["item"]
): string {
  return bankItemContentHash(fieldId, subjectId, item);
}

function shouldPersist(
  before: UsmleQaReport,
  result: UsmleCurationResult,
  bankOk: boolean
): boolean {
  if (result.action === "accepted") return false;
  const { vignette } = splitUsmleBankItem(result.item);
  if (!vignette || vignette.length < 40) return false;
  if (!result.item.options.includes(result.item.correctAnswer)) return false;
  if (!bankOk) return false;
  if (result.after.examReady) return true;
  return result.after.overallScore >= before.overallScore + 0.5;
}

async function resolveHashCollision(
  row: { id: string; fieldId: string; subjectId: string },
  item: import("../src/lib/question-bank").BankItem,
  result: UsmleCurationResult,
  curate: typeof import("../src/lib/engine/curation").curateUsmleBankItem,
  opts: {
    minAccept: number;
    offline: boolean;
    noRag: boolean;
    aiFirst: boolean;
    isUsmleCurationEnabled: () => boolean;
  }
): Promise<UsmleCurationResult> {
  let current = result;
  let hash = hashForRow(row.fieldId, row.subjectId, current.item);
  let collision = await prisma.questionBankItem.findFirst({
    where: { contentHash: hash, NOT: { id: row.id } },
  });
  if (!collision) return current;

  const maxAttempts = opts.isUsmleCurationEnabled() && !opts.offline ? 3 : 6;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    current = await curate(item, {
      fieldId: row.fieldId,
      itemId: row.id,
      minAcceptScore: opts.minAccept,
      offline: opts.offline,
      useRag: !opts.noRag,
      aiOnly: opts.isUsmleCurationEnabled() && !opts.offline,
      aiFirst: opts.aiFirst,
      seed: seedFromId(row.id) + attempt * 7919,
      maxAiAttempts: 3,
    });
    hash = hashForRow(row.fieldId, row.subjectId, current.item);
    collision = await prisma.questionBankItem.findFirst({
      where: { contentHash: hash, NOT: { id: row.id } },
    });
    if (!collision) return current;
  }
  return current;
}

async function main() {
  const { curateUsmleBankItem, isUsmleCurationEnabled } = await import(
    "../src/lib/engine/curation"
  );

  const { csv, limit, maxScore, minAccept, dryRun, offline, all, fromDb, resume, fresh, noRag, field } =
    parseArgs();

  if (fresh && fs.existsSync(CHECKPOINT_PATH)) {
    fs.unlinkSync(CHECKPOINT_PATH);
    logLine("Fresh run — checkpoint cleared");
  }

  const effectiveLimit = all ? Number.MAX_SAFE_INTEGER : limit;
  let ids = fromDb
    ? await idsFromDb(field)
    : parseCsvIds(csv, maxScore, effectiveLimit);

  if (all && !fromDb) {
    ids = parseCsvIds(csv, maxScore, Number.MAX_SAFE_INTEGER);
  }

  const prior = resume ? loadCheckpoint() : null;
  const done = new Set(prior?.processed ?? []);
  if (done.size > 0) {
    ids = ids.filter((id) => !done.has(id));
    logLine(`Resuming — ${done.size} already processed, ${ids.length} remaining`);
  }

  const checkpoint: Checkpoint = prior ?? {
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    processed: [...done],
    counts: {
      accepted: 0,
      rule_polished: 0,
      ai_curated: 0,
      rejected: 0,
      skipped: 0,
      errors: 0,
      updated: 0,
    },
  };

  logLine(`USMLE AI curation — ${ids.length} item(s) queued`);
  logLine(
    `  source: ${fromDb ? "db(qaPassed=false)" : csv}  max-score: ${maxScore}  min-accept: ${minAccept}`
  );
  const aiEnabled = isUsmleCurationEnabled() && !offline;
  logLine(
    `  dry-run: ${dryRun}  offline: ${offline}  no-rag: ${noRag}  AI: ${aiEnabled}  ai-first: ${aiEnabled}`
  );
  if (!aiEnabled && !offline) {
    logLine(
      "  WARNING: OPENAI_API_KEY not set — running rule-polish only. Add key to .env.local for AI rewrites."
    );
  }

  let qaBeforeSum = 0;
  let qaAfterSum = 0;
  let measured = 0;
  let processedThisRun = 0;

  for (const id of ids) {
    processedThisRun++;
    const row = await prisma.questionBankItem.findUnique({ where: { id } });
    if (!row || !row.active) {
      checkpoint.counts.skipped = (checkpoint.counts.skipped ?? 0) + 1;
      checkpoint.processed.push(id);
      continue;
    }
    if (field && row.fieldId !== field) {
      checkpoint.counts.skipped = (checkpoint.counts.skipped ?? 0) + 1;
      checkpoint.processed.push(id);
      continue;
    }
    if (!USMLE_FIELDS.includes(row.fieldId as (typeof USMLE_FIELDS)[number])) {
      checkpoint.counts.skipped = (checkpoint.counts.skipped ?? 0) + 1;
      checkpoint.processed.push(id);
      continue;
    }

    const item = enrichBankItemFromRow(row);
    const beforeQa = auditUsmleQaEditor(item, {
      fieldId: row.fieldId,
      source: row.source,
      itemId: row.id,
      difficulty: row.difficulty,
    });
    qaBeforeSum += beforeQa.overallScore;

    try {
      let result: UsmleCurationResult = await curateUsmleBankItem(item, {
        fieldId: row.fieldId,
        itemId: row.id,
        source: row.source,
        difficulty: row.difficulty,
        minAcceptScore: minAccept,
        offline,
        useRag: !noRag,
        aiFirst: aiEnabled,
        maxAiAttempts: 1,
        seed: seedFromId(row.id),
      });

      qaAfterSum += result.after.overallScore;
      measured++;

      const bankOk = auditBankItem(result.item, row.fieldId).ok;
      let qaPassed = result.after.examReady && bankOk;

      if (result.action === "accepted") {
        checkpoint.counts.accepted = (checkpoint.counts.accepted ?? 0) + 1;
        checkpoint.processed.push(id);
        if (processedThisRun % 50 === 0) saveCheckpoint(checkpoint);
        continue;
      }

      if (!shouldPersist(beforeQa, result, bankOk)) {
        checkpoint.counts.rejected = (checkpoint.counts.rejected ?? 0) + 1;
        checkpoint.processed.push(id);
        continue;
      }

      checkpoint.counts[result.action] = (checkpoint.counts[result.action] ?? 0) + 1;

      let finalHash = hashForRow(row.fieldId, row.subjectId, result.item);
      let collision = await prisma.questionBankItem.findFirst({
        where: { contentHash: finalHash, NOT: { id: row.id } },
      });

      if (collision) {
        logLine(`  hash collision on ${id.slice(0, 10)}… — AI retry for unique vignette`);
        result = await resolveHashCollision(
          { id: row.id, fieldId: row.fieldId, subjectId: row.subjectId },
          item,
          result,
          curateUsmleBankItem,
          { minAccept, offline, noRag, aiFirst: aiEnabled, isUsmleCurationEnabled }
        );
        finalHash = hashForRow(row.fieldId, row.subjectId, result.item);
        collision = await prisma.questionBankItem.findFirst({
          where: { contentHash: finalHash, NOT: { id: row.id } },
        });
        bankOk = auditBankItem(result.item, row.fieldId).ok;
        qaPassed = result.after.examReady && bankOk;
        if (!shouldPersist(beforeQa, result, bankOk)) {
          checkpoint.counts.rejected = (checkpoint.counts.rejected ?? 0) + 1;
          checkpoint.processed.push(id);
          continue;
        }
      }

      if (collision) {
        logLine(`  skip ${id.slice(0, 10)}… — hash collision after AI retry`);
        checkpoint.counts.skipped = (checkpoint.counts.skipped ?? 0) + 1;
        continue;
      }

      if (dryRun) {
        if (processedThisRun <= 5 || processedThisRun % 100 === 0) {
          logLine(
            `  [dry-run] ${row.fieldId}/${row.subjectId} ${id.slice(0, 10)}… ${result.action} QA ${beforeQa.overallScore.toFixed(1)} → ${result.after.overallScore.toFixed(1)}`
          );
        }
        checkpoint.processed.push(id);
        continue;
      }

      const tags = [...new Set([...(result.item.tags ?? []), "ai-curated-v1"])];

      await prisma.questionBankItem.update({
        where: { id: row.id },
        data: {
          question: result.item.question,
          scenario: result.item.vignette ?? result.item.scenario ?? row.scenario,
          options: JSON.stringify(result.item.options),
          correctAnswer: result.item.correctAnswer,
          explanation: result.item.explanation,
          tags: JSON.stringify(tags),
          contentHash: finalHash,
          source: result.action === "ai_curated" ? "ai-curated" : "polished",
          itemType: "vignette",
          qaPassed,
          qaAuditedAt: new Date(),
        },
      });

      checkpoint.counts.updated = (checkpoint.counts.updated ?? 0) + 1;

      if (processedThisRun % 25 === 0 || result.action === "ai_curated") {
        logLine(
          `  [${processedThisRun}/${ids.length}] ${result.action} ${id.slice(0, 10)}… QA ${beforeQa.overallScore.toFixed(1)} → ${result.after.overallScore.toFixed(1)}  qaPassed=${qaPassed}`
        );
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      const delay = rateLimitDelayMs(message);
      if (delay && aiEnabled) {
        logLine(`  rate limit — sleeping ${Math.round(delay / 1000)}s`);
        await sleepMs(delay);
        processedThisRun--;
        continue;
      }
      checkpoint.counts.errors = (checkpoint.counts.errors ?? 0) + 1;
      logLine(`  error ${id}: ${message}`);
    }

    if (aiEnabled) await sleepMs(7000);

    checkpoint.processed.push(id);
    if (processedThisRun % 10 === 0) saveCheckpoint(checkpoint);
  }

  saveCheckpoint(checkpoint);

  logLine(`── USMLE AI curation complete ──`);
  logLine(`Queued this run: ${ids.length}`);
  logLine(`Accepted:      ${checkpoint.counts.accepted ?? 0}`);
  logLine(`Rule polished: ${checkpoint.counts.rule_polished ?? 0}`);
  logLine(`AI curated:    ${checkpoint.counts.ai_curated ?? 0}`);
  logLine(`Rejected:      ${checkpoint.counts.rejected ?? 0}`);
  logLine(`Updated:       ${checkpoint.counts.updated ?? 0}`);
  logLine(`Skipped:       ${checkpoint.counts.skipped ?? 0}`);
  logLine(`Errors:        ${checkpoint.counts.errors ?? 0}`);
  if (measured > 0) {
    logLine(`Avg QA:        ${(qaBeforeSum / measured).toFixed(2)} → ${(qaAfterSum / measured).toFixed(2)}`);
  }
}

main()
  .catch((e) => {
    logLine(`FATAL: ${e instanceof Error ? e.message : String(e)}`);
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

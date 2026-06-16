#!/usr/bin/env node
/**
 * Run gap-fill batches until AANP FNP bank reaches target (default 6000).
 *
 *   npm run db:aanp-fnp-fill-to-target
 *   npm run db:aanp-fnp-fill-to-target:turbo
 */
import {
  appendFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  existsSync,
} from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const ARTIFACTS = join(ROOT, "artifacts");
const LOG = join(ARTIFACTS, "aanp-fnp-fill-to-target.log");
const LOCK = join(ARTIFACTS, "aanp-fnp-fill.lock");
const AUDIT_JSON = join(ARTIFACTS, "aanp-fnp-audit.json");
const DOMAINS = ["assess", "diagnose", "plan", "evaluate"];

mkdirSync(ARTIFACTS, { recursive: true });

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const TARGET = parseInt(arg("--target", "6000"), 10);
const BATCH_SIZE = parseInt(arg("--batch-size", process.argv.includes("--turbo") ? "800" : "500"), 10);
const PARALLEL_DOMAINS = parseInt(arg("--parallel-domains", process.argv.includes("--turbo") ? "4" : "1"), 10);
const TURBO = process.argv.includes("--turbo");
const MAX_BATCHES = parseInt(arg("--max-batches", "999"), 10);

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}`;
  appendFileSync(LOG, msg + "\n");
  process.stdout.write(`${msg}\n`);
}

function acquireLock() {
  if (existsSync(LOCK)) {
    const existing = readFileSync(LOCK, "utf8").trim();
    log(`Another fill run may be active (lock pid ${existing}). Remove artifacts/aanp-fnp-fill.lock if stale.`);
    process.exit(1);
  }
  writeFileSync(LOCK, String(process.pid));
}

function releaseLock() {
  try {
    if (existsSync(LOCK)) unlinkSync(LOCK);
  } catch {
    /* ignore */
  }
}

function turboEnv() {
  return {
    ...process.env,
    ...(TURBO
      ? {
          AANP_FNP_TURBO: "1",
          AANP_FNP_CONCURRENCY: process.env.AANP_FNP_CONCURRENCY ?? "20",
          AANP_FNP_CHUNK_SIZE: process.env.AANP_FNP_CHUNK_SIZE ?? "20",
        }
      : {}),
  };
}

function runStep(label, bin, args) {
  return new Promise((resolve, reject) => {
    log(`▶ START: ${label}`);
    const child = spawn(bin, args, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: turboEnv(),
    });
    child.stdout.on("data", (c) => process.stdout.write(String(c)));
    child.stderr.on("data", (c) => process.stderr.write(String(c)));
    child.on("close", (code) => {
      if (code === 0) {
        log(`✓ DONE: ${label}`);
        resolve();
      } else {
        reject(new Error(`${label} exited ${code}`));
      }
    });
  });
}

function readAudit() {
  return JSON.parse(readFileSync(AUDIT_JSON, "utf8"));
}

function pickDomain(report) {
  let best = report.domainQuotas[0]?.domain ?? "assess";
  let bestDeficit = -1;
  for (const q of report.domainQuotas) {
    const deficit = q.deficit ?? 0;
    if (deficit > bestDeficit) {
      bestDeficit = deficit;
      best = q.domain;
    }
  }
  return best;
}

async function refreshAudit() {
  await runStep("Blueprint audit", process.execPath, [
    "node_modules/tsx/dist/cli.mjs",
    "scripts/audit-aanp-fnp-bank.ts",
    "--json",
  ]);
  return readAudit();
}

async function runGenerateBatch(batchNum, count, domain) {
  await runStep(`Generate batch ${batchNum} (${domain}, ${count} slots)`, process.execPath, [
    "node_modules/tsx/dist/cli.mjs",
    "scripts/generate-aanp-fnp-batch.ts",
    "--count",
    String(count),
    "--domain",
    domain,
  ]);
}

async function runParallelDomainBatch(batchNum, totalCount) {
  const perDomain = Math.max(50, Math.ceil(totalCount / DOMAINS.length));
  log(`Parallel wave ${batchNum}: ${perDomain} slots × ${DOMAINS.length} domains`);
  await Promise.all(DOMAINS.map((domain) => runGenerateBatch(`${batchNum}-${domain}`, perDomain, domain)));
}

writeFileSync(
  LOG,
  `=== AANP FNP fill-to-target ${new Date().toISOString()}${TURBO ? " [TURBO]" : ""} ===\n`
);

(async () => {
  acquireLock();
  process.on("exit", releaseLock);
  process.on("SIGINT", () => {
    releaseLock();
    process.exit(130);
  });

  if (TURBO) {
    log(
      `Turbo mode: concurrency=${turboEnv().AANP_FNP_CONCURRENCY}, chunk=${turboEnv().AANP_FNP_CHUNK_SIZE}, parallel-domains=${PARALLEL_DOMAINS}, ai-repair=off`
    );
  }

  let report = await refreshAudit();
  log(`Starting: ${report.total}/${TARGET} (${report.pctComplete}%)`);

  let batch = 0;
  while (report.total < TARGET && batch < MAX_BATCHES) {
    batch++;
    const remaining = TARGET - report.total;
    const count = Math.min(BATCH_SIZE, Math.max(50, remaining));

    try {
      if (PARALLEL_DOMAINS >= 4) {
        await runParallelDomainBatch(batch, count);
      } else {
        const domain = pickDomain(report);
        log(`Batch ${batch}: ${count} slots → domain "${domain}" (bank ${report.total}/${TARGET})`);
        await runGenerateBatch(batch, count, domain);
      }
    } catch (err) {
      log(`Batch ${batch} failed: ${err.message} — retrying after pause…`);
      await new Promise((r) => setTimeout(r, 5000));
    }

    report = await refreshAudit();
    log(`After batch ${batch}: ${report.total}/${TARGET} (${report.pctComplete}%) — ${report.qaPassed} QA-passed`);
    for (const q of report.domainQuotas) {
      log(`  ${q.domain}: ${q.currentCount ?? 0}/${q.targetCount} (deficit ${q.deficit ?? 0})`);
    }
  }

  if (report.total >= TARGET) {
    log(`✓ AANP FNP fill-to-target complete: ${report.total}/${TARGET}`);
  } else {
    log(`Stopped: ${report.total}/${TARGET} — re-run to continue.`);
  }

  releaseLock();
})().catch((err) => {
  log(`✗ FAILED: ${err.message}`);
  releaseLock();
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Full board quality pipeline — editorial AI curation, rationale enrichment,
 * serve sync, QA gates, and user-ready verification across all exams.
 *
 *   npm run db:board-quality-pipeline
 *   npm run db:board-quality-pipeline -- --field pance
 *   npm run db:board-quality-pipeline:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "board-quality-pipeline.log");
const dryRun = process.argv.includes("--dry-run");
const skipCurate = process.argv.includes("--skip-curate");
const skipEnrich = process.argv.includes("--skip-enrich");
const skipSync = process.argv.includes("--skip-sync");
const skipVerify = process.argv.includes("--skip-verify");

function fieldArg() {
  const idx = process.argv.indexOf("--field");
  if (idx >= 0 && process.argv[idx + 1]) {
    return ["--field", process.argv[idx + 1]];
  }
  return ["--field", "all"];
}

function excludeFieldArgs() {
  const out = [];
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === "--exclude-field" && process.argv[i + 1]) {
      out.push("--exclude-field", process.argv[i + 1]);
    }
  }
  return out;
}

mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];
const dry = dryRun ? ["--dry-run"] : [];
const field = fieldArg();
const exclude = excludeFieldArgs();

const steps = [];

if (!skipCurate) {
  steps.push([
    "Editorial AI curation",
    tsx(
      "scripts/curate-board-questions.ts",
      ...field,
      ...exclude,
      "--editorial",
      "--force-ai",
      "--limit",
      dryRun ? "20" : "500",
      ...dry
    ),
  ]);
  steps.push([
    "Failing items AI curation",
    tsx(
      "scripts/curate-board-questions.ts",
      ...field,
      ...exclude,
      "--failing",
      "--force-ai",
      "--limit",
      dryRun ? "10" : "200",
      ...dry
    ),
  ]);
}

if (!skipEnrich) {
  steps.push([
    "Expert / structured rationale enrichment",
    tsx(
      "scripts/enrich-board-expert-rationales.ts",
      ...field,
      ...exclude,
      "--serve-only",
      "--limit",
      dryRun ? "10" : "200",
      ...dry
    ),
  ]);
}

if (!skipSync) {
  steps.push([
    "Serve-ready sync",
    tsx("scripts/sync-board-serve-ready.ts", ...field, ...dry),
  ]);
  steps.push(["NCLEX best gate", tsx("scripts/qa-gate-nclex-best.ts", ...dry)]);
  steps.push(["NAPLEX best gate", tsx("scripts/qa-gate-naplex-best.ts", ...dry)]);
  steps.push(["USMLE Step 1 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-1", ...dry)]);
  steps.push(["USMLE Step 2 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-2", ...dry)]);
  steps.push(["USMLE Step 3 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-3", ...dry)]);
  steps.push(["PANCE best gate", tsx("scripts/qa-gate-pance-best.ts", ...dry)]);
  steps.push(["AANP FNP best gate", tsx("scripts/qa-gate-aanp-fnp-best.ts", ...dry)]);
  steps.push(["NPTE-PT best gate", tsx("scripts/qa-gate-npte-pt-best.ts", ...dry)]);
}

if (!skipVerify) {
  steps.push([
    "User-ready verification",
    tsx("scripts/verify-board-user-ready.ts", ...field),
  ]);
}

steps.push(["Quality snapshot", tsx("scripts/audit-bank-quality-summary.ts")]);

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== Board quality pipeline ${new Date().toISOString()}${dryRun ? " (dry-run)" : ""} ===\n`
);

let failed = 0;
for (const [label, [bin, args]] of steps) {
  log(`▶ START: ${label}`);
  try {
    execFileSync(bin, args, { stdio: "inherit", cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
    log(`✓ DONE: ${label}`);
  } catch (e) {
    failed++;
    log(`✗ FAILED: ${label} — ${e instanceof Error ? e.message : String(e)}`);
  }
}

log(
  failed === 0
    ? "=== Board quality pipeline complete ==="
    : `=== Pipeline finished with ${failed} failed step(s) ===`
);
process.exit(failed > 0 ? 1 : 0);

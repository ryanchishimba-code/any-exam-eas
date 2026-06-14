#!/usr/bin/env node
/**
 * NCLEX-only full upgrade: polish entire bank → prioritization fix → best gate → audit.
 * Safe to run under nohup; logs to artifacts/nclex-best-pipeline.log
 *
 *   npm run db:nclex-best-full
 *   npm run db:nclex-best-full:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "nclex-best-pipeline.log");
const dryRun = process.argv.includes("--dry-run");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [
  process.execPath,
  ["node_modules/tsx/dist/cli.mjs", script, ...args],
];

const dry = dryRun ? ["--dry-run"] : [];

const steps = [
  ["1/4 NCLEX elevate (all rows)", tsx("scripts/elevate-nclex-bank.ts", ...dry)],
  [
    "2/4 NCLEX prioritization fix",
    tsx("scripts/polish-nursing-questions.ts", "--fix-prioritization", ...dry),
  ],
  ["3/4 NCLEX best gate", tsx("scripts/qa-gate-nclex-best.ts", ...dry)],
  ["4/4 NCLEX best-rate report", tsx("scripts/report-nclex-best-rate.ts")],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== NCLEX best pipeline started ${new Date().toISOString()}${dryRun ? " (dry-run)" : ""} ===\n`
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
    ? "=== NCLEX best pipeline complete (all steps OK) ==="
    : `=== NCLEX best pipeline finished with ${failed} failed step(s) ===`
);
process.exit(failed > 0 ? 1 : 0);

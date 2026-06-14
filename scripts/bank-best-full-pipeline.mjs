#!/usr/bin/env node
/**
 * Full-bank upgrade: polish every field → strict best gates → audit summary.
 * Safe to run under nohup; logs to artifacts/bank-best-pipeline.log
 *
 *   npm run db:bank-best-full
 *   npm run db:bank-best-full:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "bank-best-pipeline.log");
const dryRun = process.argv.includes("--dry-run");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [
  process.execPath,
  ["node_modules/tsx/dist/cli.mjs", script, ...args],
];

const dry = dryRun ? ["--dry-run"] : [];

const steps = [
  ["1/10 NCLEX elevate (all)", tsx("scripts/elevate-nclex-bank.ts", ...dry)],
  ["2/10 NCLEX prioritization fix", tsx("scripts/polish-nursing-questions.ts", "--fix-prioritization", ...dry)],
  ["3/10 NCLEX best gate", tsx("scripts/qa-gate-nclex-best.ts", ...dry)],
  ["4/10 USMLE Step 1 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-1", ...dry)],
  ["5/10 USMLE Step 2 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-2", ...dry)],
  ["6/10 USMLE Step 3 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-3", ...dry)],
  ["7/10 USMLE best gate", tsx("scripts/qa-gate-usmle-best.ts", ...dry)],
  ["8/10 NAPLEX polish", tsx("scripts/polish-pharmacy-questions.ts", ...dry)],
  ["9/10 NAPLEX best gate", tsx("scripts/qa-gate-naplex-best.ts", ...dry)],
  ["10/10 NCLEX best-rate report", tsx("scripts/report-nclex-best-rate.ts")],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== Bank best pipeline started ${new Date().toISOString()}${dryRun ? " (dry-run)" : ""} ===\n`
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
    ? "=== Bank best pipeline complete (all steps OK) ==="
    : `=== Bank best pipeline finished with ${failed} failed step(s) ===`
);
process.exit(failed > 0 ? 1 : 0);

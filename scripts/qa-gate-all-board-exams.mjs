#!/usr/bin/env node
/**
 * Re-audit all board exam banks with strict serve gates and log results.
 * Safe under nohup — writes to artifacts/bank-quality-gate.log
 *
 *   npm run db:qa-gate-all-board
 *   npm run db:qa-gate-all-board:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "bank-quality-gate.log");
const dryRun = process.argv.includes("--dry-run");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];
const dry = dryRun ? ["--dry-run"] : [];

const steps = [
  ["NCLEX best gate", tsx("scripts/qa-gate-nclex-best.ts", ...dry)],
  ["USMLE Step 1 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-1", ...dry)],
  ["USMLE Step 2 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-2", ...dry)],
  ["USMLE Step 3 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-3", ...dry)],
  ["NAPLEX best gate", tsx("scripts/qa-gate-naplex-best.ts", ...dry)],
  ["PANCE best gate", tsx("scripts/qa-gate-pance-best.ts", ...dry)],
  ["AANP FNP best gate", tsx("scripts/qa-gate-aanp-fnp-best.ts", ...dry)],
  ["NPTE-PT best gate", tsx("scripts/qa-gate-npte-pt-best.ts", ...dry)],
  ["Quality snapshot", tsx("scripts/audit-bank-quality-summary.ts")],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== Board quality gate pipeline ${new Date().toISOString()}${dryRun ? " (dry-run)" : ""} ===\n`
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
    ? "=== Board quality gate pipeline complete ==="
    : `=== Pipeline finished with ${failed} failed step(s) ===`
);
process.exit(failed > 0 ? 1 : 0);

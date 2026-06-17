#!/usr/bin/env node
/**
 * Rule-based polish on weak banks, then re-apply strict serve gates.
 * No LLM — safe to run locally; logs to artifacts/bank-quality-recover.log
 *
 *   npm run db:recover-bank-quality
 *   npm run db:recover-bank-quality:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "bank-quality-recover.log");
const dryRun = process.argv.includes("--dry-run");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];
const dry = dryRun ? ["--dry-run"] : [];

const steps = [
  ["NCLEX elevate (all)", tsx("scripts/elevate-nclex-bank.ts", ...dry)],
  ["NCLEX prioritization fix", tsx("scripts/polish-nursing-questions.ts", "--fix-prioritization", ...dry)],
  ["USMLE Step 2 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-2", ...dry)],
  ["USMLE Step 3 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-3", ...dry)],
  ["NCLEX best gate", tsx("scripts/qa-gate-nclex-best.ts", ...dry)],
  ["USMLE Step 2 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-2", ...dry)],
  ["USMLE Step 3 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-3", ...dry)],
  ["Quality snapshot", tsx("scripts/audit-bank-quality-summary.ts")],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== Bank quality recovery ${new Date().toISOString()}${dryRun ? " (dry-run)" : ""} ===\n`
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

log(failed === 0 ? "=== Recovery complete ===" : `=== Recovery finished with ${failed} failed step(s) ===`);
process.exit(failed > 0 ? 1 : 0);

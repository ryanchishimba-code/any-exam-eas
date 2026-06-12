#!/usr/bin/env node
/**
 * Polish nursing + all USMLE steps, then QA-gate those fields.
 * Resumable logging — safe to run under nohup.
 *
 *   node scripts/qa-physician-pipeline.mjs
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "qa-physician-pipeline.log");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];

const steps = [
  ["NCLEX polish", tsx("scripts/polish-nursing-questions.ts")],
  ["USMLE Step 1 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-1")],
  ["USMLE Step 2 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-2")],
  ["USMLE Step 3 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-3")],
  ["QA gate — nursing", tsx("scripts/qa-gate-question-bank.ts", "--field", "nursing")],
  ["QA gate — usmle-step-1", tsx("scripts/qa-gate-question-bank.ts", "--field", "usmle-step-1")],
  ["QA gate — usmle-step-2", tsx("scripts/qa-gate-question-bank.ts", "--field", "usmle-step-2")],
  ["QA gate — usmle-step-3", tsx("scripts/qa-gate-question-bank.ts", "--field", "usmle-step-3")],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(LOG, `=== QA physician pipeline started ${new Date().toISOString()} ===\n`);

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

log(failed === 0 ? "=== Pipeline complete (all steps OK) ===" : `=== Pipeline finished with ${failed} failed step(s) ===`);
process.exit(failed > 0 ? 1 : 0);

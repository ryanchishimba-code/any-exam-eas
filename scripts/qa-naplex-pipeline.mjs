#!/usr/bin/env node
/**
 * Polish NAPLEX (pharmacy) then QA-gate the field.
 *   npm run db:qa-naplex
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "qa-naplex-pipeline.log");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];

const steps = [
  ["NAPLEX polish", tsx("scripts/polish-pharmacy-questions.ts")],
  ["QA gate — pharmacy", tsx("scripts/qa-gate-question-bank.ts", "--field", "pharmacy")],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(LOG, `=== NAPLEX pipeline started ${new Date().toISOString()} ===\n`);

let failed = 0;
for (const [label, [bin, args]] of steps) {
  log(`▶ START: ${label}`);
  try {
    const out = execFileSync(bin, args, {
      cwd: ROOT,
      maxBuffer: 64 * 1024 * 1024,
      encoding: "utf8",
    });
    if (out) {
      appendFileSync(LOG, out);
      process.stdout.write(out);
    }
    log(`✓ DONE: ${label}`);
  } catch (e) {
    failed++;
    log(`✗ FAILED: ${label} — ${e instanceof Error ? e.message : String(e)}`);
  }
}

log(failed === 0 ? "=== NAPLEX pipeline complete ===" : `=== NAPLEX pipeline finished with ${failed} failed step(s) ===`);
process.exit(failed > 0 ? 1 : 0);

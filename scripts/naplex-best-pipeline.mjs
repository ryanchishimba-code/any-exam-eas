#!/usr/bin/env node
/**
 * Polish NAPLEX bank + apply strict "best only" QA gate.
 *
 *   npm run db:naplex-best
 *   npm run db:naplex-best:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "naplex-best-pipeline.log");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const dryRun = process.argv.includes("--dry-run");

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];

const steps = [
  [
    dryRun ? "NAPLEX polish (dry-run)" : "NAPLEX polish",
    tsx("scripts/polish-pharmacy-questions.ts", ...(dryRun ? ["--dry-run", "--limit", "100"] : [])),
  ],
  [
    dryRun ? "Best-only QA gate (dry-run)" : "Best-only QA gate",
    tsx("scripts/qa-gate-naplex-best.ts", ...(dryRun ? ["--dry-run"] : [])),
  ],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== NAPLEX best-only pipeline ${new Date().toISOString()}${dryRun ? " [dry-run]" : ""} ===\n`
);

function runStep(label, bin, args) {
  return new Promise((resolve, reject) => {
    log(`▶ START: ${label}`);
    const child = spawn(bin, args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], env: process.env });
    let stdout = "";
    child.stdout.on("data", (c) => {
      const t = String(c);
      stdout += t;
      process.stdout.write(t);
    });
    child.stderr.on("data", (c) => process.stderr.write(String(c)));
    child.on("close", (code) => {
      if (stdout) appendFileSync(LOG, stdout);
      if (code === 0) {
        log(`✓ DONE: ${label}`);
        resolve();
      } else {
        reject(new Error(`${label} exited ${code}`));
      }
    });
  });
}

async function main() {
  let failed = 0;
  for (const [label, [bin, args]] of steps) {
    try {
      await runStep(label, bin, args);
    } catch (e) {
      failed++;
      log(`✗ FAILED: ${label} — ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  log(failed === 0 ? "=== Best-only pipeline complete ===" : `=== Finished with ${failed} failure(s) ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

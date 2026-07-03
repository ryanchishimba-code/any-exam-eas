#!/usr/bin/env node
/**
 * Full best-only NAPLEX pipeline: polish → AI elevate → strict QA gate.
 *
 *   npm run db:naplex-best:full
 *   npm run db:naplex-best:full:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { loadEnvFiles } from "./resolve-database-url.mjs";

loadEnvFiles();

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "naplex-best-pipeline.log");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const dryRun = process.argv.includes("--dry-run");
const aiLimitArg = process.argv.indexOf("--ai-limit");
const aiLimit = aiLimitArg >= 0 ? process.argv[aiLimitArg + 1] : "200";

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];

const steps = [
  [
    dryRun ? "Polish (dry-run)" : "Polish",
    tsx("scripts/polish-pharmacy-questions.ts", ...(dryRun ? ["--dry-run", "--limit", "50"] : [])),
  ],
  [
    dryRun ? "AI elevate (dry-run)" : "AI elevate",
    tsx(
      "scripts/curate-naplex-best-ai.ts",
      ...(dryRun ? ["--dry-run", "--limit", "10"] : ["--limit", aiLimit])
    ),
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
  `=== NAPLEX best-full pipeline ${new Date().toISOString()}${dryRun ? " [dry-run]" : ""} ===\n`
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
  if (!dryRun && !process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY required for db:naplex-best:full (AI elevation step).");
    process.exit(1);
  }

  let failed = 0;
  for (const [label, [bin, args]] of steps) {
    try {
      await runStep(label, bin, args);
    } catch (e) {
      failed++;
      log(`✗ FAILED: ${label} — ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  log(failed === 0 ? "=== Best-full pipeline complete ===" : `=== Finished with ${failed} failure(s) ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

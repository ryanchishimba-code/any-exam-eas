#!/usr/bin/env node
/**
 * Smart NAPLEX pipeline — polish full bank + QA gate.
 *
 *   npm run db:qa-naplex              # push entire pharmacy bank through engine
 *   npm run db:qa-naplex:dry          # dry-run preview
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync, spawn } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "qa-naplex-pipeline.log");
const AUDIT_JSON = join(ROOT, "artifacts", "naplex-audit-report.json");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");

const tsx = (script, ...scriptArgs) => [
  process.execPath,
  ["node_modules/tsx/dist/cli.mjs", script, ...scriptArgs],
];

const qaArgs = dryRun ? ["--dry-run"] : [];

const steps = [
  ["NAPLEX polish", tsx("scripts/polish-pharmacy-questions.ts", ...(dryRun ? ["--dry-run", "--limit", "100"] : []))],
  [
    dryRun ? "Best-only QA gate (dry-run)" : "Best-only QA gate",
    tsx("scripts/qa-gate-naplex-best.ts", ...qaArgs),
  ],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== NAPLEX smart pipeline started ${new Date().toISOString()}${dryRun ? " [dry-run]" : ""} ===\n`
);

function runStep(label, bin, scriptArgs) {
  return new Promise((resolve, reject) => {
    log(`▶ START: ${label}`);
    const child = spawn(bin, scriptArgs, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      const text = String(chunk);
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (chunk) => {
      const text = String(chunk);
      stderr += text;
      process.stderr.write(text);
    });

    child.on("close", (code) => {
      if (stdout) appendFileSync(LOG, stdout);
      if (stderr) appendFileSync(LOG, stderr);

      if (label.startsWith("NAPLEX audit") && stdout.trim()) {
        try {
          writeFileSync(AUDIT_JSON, stdout.trim());
        } catch {
          /* audit output may be mixed with logs on failure */
        }
      }

      if (code === 0) {
        log(`✓ DONE: ${label}`);
        resolve(undefined);
      } else {
        reject(new Error(`${label} exited with code ${code}`));
      }
    });
  });
}

async function main() {
  let failed = 0;

  for (const [label, [bin, scriptArgs]] of steps) {
    try {
      await runStep(label, bin, scriptArgs);
    } catch (e) {
      failed++;
      log(`✗ FAILED: ${label} — ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  log(
    failed === 0
      ? `=== NAPLEX smart pipeline complete${dryRun ? " (dry-run)" : ""} ===`
      : `=== NAPLEX smart pipeline finished with ${failed} failed step(s) ===`
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

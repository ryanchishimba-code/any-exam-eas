#!/usr/bin/env node
/**
 * Full PANCE question bank pipeline: sync seeds → audit → generate batch → QA gate.
 *
 *   npm run db:pance-pipeline
 *   npm run db:pance-pipeline:dry
 *   npm run db:pance-pipeline -- --count 500 --skip-generate
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "pance-pipeline.log");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const dryRun = process.argv.includes("--dry-run");
const skipGenerate = process.argv.includes("--skip-generate");
const countArg = process.argv.find((a, i) => process.argv[i - 1] === "--count");
const count = countArg ?? "500";

const tsx = (script: string, ...args: string[]) =>
  [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]] as const;

const steps: [string, readonly [string, string[]]][] = [
  [
    dryRun ? "Sync PANCE seeds (dry-run via audit only)" : "Sync question bank (seeds)",
    dryRun
      ? tsx("scripts/audit-pance-bank.ts")
      : ([process.execPath, ["scripts/sync-question-bank.mjs"]] as const),
  ],
  ["Blueprint audit", tsx("scripts/audit-pance-bank.ts", "--json")],
];

if (!skipGenerate) {
  steps.push([
    dryRun ? `Generate batch (dry-run, ${count})` : `Generate batch (${count})`,
    tsx(
      "scripts/generate-pance-batch.ts",
      "--count",
      count,
      ...(dryRun ? ["--dry-run"] : [])
    ),
  ]);
}

steps.push([
  dryRun ? "QA gate (dry-run)" : "QA gate (best tier)",
  tsx("scripts/qa-gate-pance-best.ts", ...(dryRun ? ["--dry-run"] : [])),
]);

function log(line: string) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== PANCE pipeline ${new Date().toISOString()}${dryRun ? " [dry-run]" : ""} ===\n`
);

function runStep(label: string, bin: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
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
      await runStep(label, bin, [...args]);
    } catch (e) {
      failed++;
      log(`✗ FAILED: ${label} — ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  log(failed === 0 ? "=== PANCE pipeline complete ===" : `=== Finished with ${failed} failure(s) ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

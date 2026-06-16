#!/usr/bin/env node
/**
 * Hybrid AANP FNP bank pipeline: seeds → variants → gap-fill → QA gate.
 *
 *   npm run db:aanp-fnp-hybrid
 *   npm run db:aanp-fnp-hybrid -- --skip-variants --gap-fill 200
 *   npm run db:aanp-fnp-hybrid:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "aanp-fnp-hybrid-pipeline.log");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const dryRun = process.argv.includes("--dry-run");
const skipVariants = process.argv.includes("--skip-variants");
const skipGapFill = process.argv.includes("--skip-gap-fill");
const skipSeeds = process.argv.includes("--skip-seeds");

const variantsArg = process.argv.find((a, i) => process.argv[i - 1] === "--variants-per-seed");
const variantsPerSeed = variantsArg ?? "4";

const gapFillArg = process.argv.find((a, i) => process.argv[i - 1] === "--gap-fill");
const gapFillCount = gapFillArg ?? "500";

const tsx = (script: string, ...args: string[]) =>
  [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]] as const;

const steps: [string, readonly [string, string[]]][] = [];

if (!skipSeeds) {
  steps.push([
    dryRun ? "Verify seeds (audit)" : "Force-upsert curated seeds",
    dryRun
      ? tsx("scripts/audit-aanp-fnp-bank.ts")
      : tsx("scripts/force-upsert-aanp-fnp-seeds.ts"),
  ]);
}

steps.push(["Blueprint audit", tsx("scripts/audit-aanp-fnp-bank.ts", "--json")]);

if (!skipVariants) {
  steps.push([
    dryRun
      ? `Variant expansion (dry-run, ${variantsPerSeed}/seed)`
      : `Variant expansion (${variantsPerSeed}/seed)`,
    tsx(
      "scripts/generate-aanp-fnp-variants.ts",
      "--variants-per-seed",
      variantsPerSeed,
      ...(dryRun ? ["--dry-run"] : [])
    ),
  ]);
}

if (!skipGapFill) {
  steps.push([
    dryRun ? `Gap-fill generation (dry-run, ${gapFillCount})` : `Gap-fill generation (${gapFillCount})`,
    tsx(
      "scripts/generate-aanp-fnp-batch.ts",
      "--count",
      gapFillCount,
      ...(dryRun ? ["--dry-run"] : [])
    ),
  ]);
}

steps.push([
  dryRun ? "QA gate (dry-run)" : "QA gate (aanp-fnp field)",
  tsx("scripts/qa-gate-question-bank.ts", "--field", "aanp-fnp", ...(dryRun ? ["--dry-run"] : [])),
]);

function log(line: string) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== AANP FNP hybrid pipeline ${new Date().toISOString()}${dryRun ? " [dry-run]" : ""} ===\n`
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

(async () => {
  for (const [label, [bin, args]] of steps) {
    await runStep(label, bin, args);
  }
  log("✓ AANP FNP hybrid pipeline complete");
})().catch((err) => {
  log(`✗ FAILED: ${err.message}`);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Dedupe bank pipeline: trim duplicate cases → sync serve gates → backfill generation.
 *
 *   npm run db:dedupe-bank-pipeline:dry
 *   npm run db:dedupe-bank-pipeline
 *   npm run db:dedupe-bank-pipeline -- --fields nursing,pance --skip-generate
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "dedupe-bank-pipeline.log");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const dryRun = process.argv.includes("--dry-run");
const skipGenerate = process.argv.includes("--skip-generate");
const fieldsArg = process.argv.find((_, i) => process.argv[i - 1] === "--fields");
const fields = fieldsArg ?? "nursing,pance,pharmacy,usmle-step-2,aanp-fnp";

function log(line: string) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

function run(label: string, script: string, args: string[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    log(`▶ ${label}`);
    const child = spawn(
      process.execPath,
      ["node_modules/tsx/dist/cli.mjs", script, ...args],
      { cwd: ROOT, stdio: "inherit", env: process.env }
    );
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) log(`✓ ${label}`);
      resolve(code ?? 1);
    });
  });
}

async function main() {
  writeFileSync(LOG, `=== dedupe bank pipeline ${new Date().toISOString()}${dryRun ? " [dry-run]" : ""} ===\n`);

  const trimArgs = [
    "--fields",
    fields,
    "--stem-cap-nursing",
    "80",
    "--stem-cap-pharmacy",
    "60",
    "--stem-cap-usmle-step-2",
    "40",
    "--stem-cap-aanp-fnp",
    "50",
    ...(dryRun ? ["--dry-run"] : []),
  ];

  let code = await run("Trim duplicate clinical cases", "scripts/trim-duplicate-clinical-cases.ts", trimArgs);
  if (code !== 0) process.exit(code);

  if (dryRun) {
    log("Dry-run complete — no sync or generation.");
    return;
  }

  if (fields.includes("nursing")) {
    code = await run("Sync NCLEX serve-ready", "scripts/sync-nclex-serve-ready.ts", ["--retire-non-best"]);
    if (code !== 0) process.exit(code);
  }

  if (fields.includes("pharmacy")) {
    code = await run("Sync NAPLEX serve-ready", "scripts/sync-naplex-serve-ready.ts", ["--retire-non-best"]);
    if (code !== 0) process.exit(code);
  }

  if (skipGenerate) {
    log("Skipping generation (--skip-generate).");
    return;
  }

  if (fields.includes("nursing")) {
    if (!process.env.OPENAI_API_KEY?.trim()) {
      log("⚠ OPENAI_API_KEY missing — skipping NCLEX backfill.");
    } else {
      code = await run("NCLEX backfill to target", "scripts/generate-nclex-to-target.ts", [
        "--max-batches",
        "3",
      ]);
      if (code !== 0) log(`⚠ NCLEX backfill exited ${code} — continuing.`);
    }
  }

  if (fields.includes("pance")) {
    if (!process.env.OPENAI_API_KEY?.trim()) {
      log("⚠ OPENAI_API_KEY missing — skipping PANCE backfill.");
    } else {
      code = await run("PANCE generation batch", "scripts/generate-pance-batch.ts", ["--count", "800"]);
      if (code !== 0) log(`⚠ PANCE generate exited ${code} — continuing.`);
      code = await run("PANCE QA gate", "scripts/qa-gate-pance-best.ts");
      if (code !== 0) log(`⚠ PANCE QA gate exited ${code}.`);
    }
  }

  code = await run("Session repetition audit", "scripts/audit-session-repetition.ts");
  if (code !== 0) log(`⚠ Audit exited ${code}.`);

  log("Pipeline complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

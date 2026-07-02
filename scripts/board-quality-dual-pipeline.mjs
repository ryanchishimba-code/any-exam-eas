#!/usr/bin/env node
/**
 * Unified dual pipeline — NCLEX deep pass first, then cross-exam board quality
 * without overlapping NCLEX editorial/rationale work.
 *
 * Phase 1 (NCLEX-only):
 *   - Full editorial AI curation (curate-nclex-questions --editorial --force-ai)
 *   - Expert rationale enrichment up to 5k serve-ready items
 *
 * Phase 2 (all other exams + shared finalize):
 *   - board-quality-pipeline with --exclude-field nursing
 *
 * Usage:
 *   npm run db:board-quality-dual
 *   npm run db:board-quality-dual:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "board-quality-dual-pipeline.log");
const RUN_LOG = join(ROOT, "artifacts", "board-quality-dual-run.log");
const dryRun = process.argv.includes("--dry-run");

mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];
const dry = dryRun ? ["--dry-run"] : [];

const steps = [
  [
    "NCLEX editorial AI curation (full queue)",
    tsx(
      "scripts/curate-nclex-questions.ts",
      "--editorial",
      "--force-ai",
      ...(dryRun ? ["--dry-run", "--limit", "20"] : [])
    ),
  ],
  [
    "NCLEX expert rationale enrichment (serve-ready, up to 5000)",
    tsx(
      "scripts/enrich-nclex-expert-rationales.ts",
      "--serve-only",
      "--limit",
      dryRun ? "10" : "5000",
      ...dry
    ),
  ],
  [
    "Cross-exam board quality pipeline (excluding NCLEX curate/enrich)",
    [process.execPath, ["scripts/board-quality-pipeline.mjs", "--exclude-field", "nursing", ...dry]],
  ],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  appendFileSync(RUN_LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== Board quality dual pipeline ${new Date().toISOString()}${dryRun ? " (dry-run)" : ""} ===\n`
);
writeFileSync(
  RUN_LOG,
  `=== Board quality dual pipeline ${new Date().toISOString()}${dryRun ? " (dry-run)" : ""} ===\n`
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
    ? "=== Board quality dual pipeline complete ==="
    : `=== Dual pipeline finished with ${failed} failed step(s) ===`
);
process.exit(failed > 0 ? 1 : 0);

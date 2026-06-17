#!/usr/bin/env node
/**
 * Industry-grade AI curation pipeline — Self-RAG USMLE + NCLEX rewrites,
 * then strict serve gates. Resumable; logs to artifacts/curate-board-ai.log
 *
 *   npm run db:curate-board-ai
 *   npm run db:curate-board-ai:dry
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "curate-board-ai.log");
const dryRun = process.argv.includes("--dry-run");
mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];
const dry = dryRun ? ["--dry-run"] : [];

const steps = [
  [
    "USMLE Step 2 AI curation (qaPassed=false, Self-RAG)",
    tsx(
      "scripts/curate-usmle-ai.ts",
      "--from-db",
      "--all",
      "--field",
      "usmle-step-2",
      "--resume",
      "--min-accept",
      "8",
      ...dry
    ),
  ],
  [
    "USMLE Step 2 serve gate",
    tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-2", ...dry),
  ],
  [
    "USMLE Step 3 AI curation (qaPassed=false, Self-RAG)",
    tsx(
      "scripts/curate-usmle-ai.ts",
      "--from-db",
      "--all",
      "--field",
      "usmle-step-3",
      "--resume",
      "--min-accept",
      "7.5",
      ...dry
    ),
  ],
  [
    "USMLE Step 3 serve gate",
    tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-3", ...dry),
  ],
  [
    "NCLEX AI curation (qaPassed=false, force-ai)",
    tsx("scripts/curate-nclex-questions.ts", "--failing", "--force-ai", "--all", ...dry),
  ],
  ["NCLEX best gate", tsx("scripts/qa-gate-nclex-best.ts", ...dry)],
  ["Quality snapshot", tsx("scripts/audit-bank-quality-summary.ts")],
];

function log(line) {
  const msg = `[${new Date().toISOString()}] ${line}\n`;
  appendFileSync(LOG, msg);
  process.stdout.write(msg);
}

writeFileSync(
  LOG,
  `=== Board AI curation pipeline ${new Date().toISOString()}${dryRun ? " (dry-run)" : ""} ===\n`
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
    ? "=== Board AI curation pipeline complete ==="
    : `=== Pipeline finished with ${failed} failed step(s) ===`
);
process.exit(failed > 0 ? 1 : 0);

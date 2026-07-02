#!/usr/bin/env node
/**
 * Industry-grade AI curation pipeline — editorial rewrites + serve gates across all board exams.
 * Resumable; logs to artifacts/curate-board-ai.log
 *
 *   npm run db:curate-board-ai
 *   npm run db:curate-board-ai:dry
 *   npm run db:curate-board-ai -- --field pance
 */
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const LOG = join(ROOT, "artifacts", "curate-board-ai.log");
const dryRun = process.argv.includes("--dry-run");

function fieldArg() {
  const idx = process.argv.indexOf("--field");
  if (idx >= 0 && process.argv[idx + 1]) {
    return ["--field", process.argv[idx + 1]];
  }
  return ["--field", "all"];
}

mkdirSync(join(ROOT, "artifacts"), { recursive: true });

const tsx = (script, ...args) => [process.execPath, ["node_modules/tsx/dist/cli.mjs", script, ...args]];
const dry = dryRun ? ["--dry-run"] : [];
const field = fieldArg();

const steps = [
  [
    "Board editorial AI curation",
    tsx(
      "scripts/curate-board-questions.ts",
      ...field,
      "--editorial",
      "--force-ai",
      "--limit",
      dryRun ? "20" : "500",
      ...dry
    ),
  ],
  [
    "Board failing items AI curation",
    tsx(
      "scripts/curate-board-questions.ts",
      ...field,
      "--failing",
      "--force-ai",
      "--limit",
      dryRun ? "10" : "300",
      ...dry
    ),
  ],
  [
    "Board rationale enrichment",
    tsx(
      "scripts/enrich-board-expert-rationales.ts",
      ...field,
      "--serve-only",
      "--limit",
      dryRun ? "10" : "200",
      ...dry
    ),
  ],
  ["Board serve-ready sync", tsx("scripts/sync-board-serve-ready.ts", ...field, ...dry)],
  ["NCLEX best gate", tsx("scripts/qa-gate-nclex-best.ts", ...dry)],
  ["NAPLEX best gate", tsx("scripts/qa-gate-naplex-best.ts", ...dry)],
  ["USMLE Step 1 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-1", ...dry)],
  ["USMLE Step 2 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-2", ...dry)],
  ["USMLE Step 3 serve gate", tsx("scripts/qa-gate-usmle-best.ts", "--field", "usmle-step-3", ...dry)],
  ["PANCE best gate", tsx("scripts/qa-gate-pance-best.ts", ...dry)],
  ["AANP FNP best gate", tsx("scripts/qa-gate-aanp-fnp-best.ts", ...dry)],
  ["NPTE-PT best gate", tsx("scripts/qa-gate-npte-pt-best.ts", ...dry)],
  ["User-ready verification", tsx("scripts/verify-board-user-ready.ts", ...field)],
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

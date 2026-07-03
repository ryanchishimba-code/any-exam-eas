#!/usr/bin/env node
/**
 * USMLE comprehensive review — all three steps: audit, align, gate.
 *
 * Usage:
 *   npm run db:usmle-comprehensive-review
 *   npm run db:usmle-comprehensive-review:apply
 *
 * With --apply:
 *   sync serve-ready → fix audit gaps → polish all → qa gate (best tier)
 *
 * AI elevation (requires OPENAI_API_KEY in .env.local):
 *   npm run db:curate-usmle:ai:step1:strict
 *   npm run db:curate-usmle:ai:step2
 *   npm run db:curate-usmle:ai:step3:strict
 *   npm run db:raise-usmle-exam-ready:step3   # biostats/ethics/CCS formats
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const apply = process.argv.includes("--apply");
const node = path.join(root, "scripts/run-with-node.sh");

function run(label: string, cmd: string, args: string[]) {
  console.log(`\n▶ ${label}\n`);
  const res = spawnSync("bash", [node, cmd, ...args], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  if (res.status !== 0) {
    console.error(`\n✗ ${label} failed (exit ${res.status})\n`);
    process.exit(res.status ?? 1);
  }
}

console.log(`\nUSMLE comprehensive review (Steps 1–3)${apply ? " [APPLY]" : " [dry-run]"}\n`);

run("Editorial QA audit", "npx", ["tsx", "scripts/usmle-qa-audit.ts"]);
run("Blueprint gap audit (all steps)", "npx", ["tsx", "scripts/audit-usmle-blueprint-gaps.ts"]);
run("Served alignment audit", "npx", ["tsx", "scripts/audit-usmle-served-alignment.ts"]);
run("QA gate preview (all steps)", "npx", ["tsx", "scripts/qa-gate-usmle-best.ts", "--dry-run"]);

if (apply) {
  run("Classify step levels", "npx", ["tsx", "scripts/classify-usmle-step-level.ts"]);
  run("Fix audit gaps", "npm", ["run", "db:fix-usmle-audit-gaps"]);
  run("Sync serve-ready flags", "npm", ["run", "db:sync-usmle-serve-ready"]);
  run("Polish all steps", "npm", ["run", "db:polish-usmle:all"]);
  run("Best-tier QA gate", "npx", ["tsx", "scripts/qa-gate-usmle-best.ts"]);
  console.log("\n✓ Apply pass complete. Recommended AI follow-up:");
  console.log("  npm run db:curate-usmle:ai:step2           # clinical vignettes");
  console.log("  npm run db:raise-usmle-exam-ready:step3    # biostats/ethics/CCS");
  console.log("  npm run db:polish-usmle:qa-failing         # rewrite lowest scores\n");
} else {
  run("Classify step levels (preview)", "npx", [
    "tsx",
    "scripts/classify-usmle-step-level.ts",
    "--dry-run",
  ]);
  run("Fix audit gaps (preview)", "npm", ["run", "db:fix-usmle-audit-gaps:dry"]);
  console.log("\nDry-run complete. Re-run with --apply to write fixes.");
  console.log("Set OPENAI_API_KEY for AI curation and Step 3 format generation.\n");
}

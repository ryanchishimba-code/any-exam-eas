#!/usr/bin/env node
/**
 * NAPLEX comprehensive review orchestrator — audit, migrate, repair, gate.
 *
 * Usage:
 *   npm run db:naplex-comprehensive-review
 *   npm run db:naplex-comprehensive-review -- --apply
 *
 * With --apply, runs blueprint migration + fix-naplex-unscorable + qa gate.
 * Without --apply, dry-run diagnostics only (safe for CI).
 *
 * AI elevation (requires OPENAI_API_KEY in .env.local):
 *   npm run db:naplex-best:full
 *   npm run db:rebalance-naplex
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

console.log(`\nNAPLEX comprehensive review${apply ? " [APPLY]" : " [dry-run]"}\n`);

run("Blueprint gap audit (qaPassed)", "npx", [
  "tsx",
  "scripts/audit-naplex-blueprint-gaps.ts",
  "--metric",
  "qaPassed",
]);

run("Content audit", "npx", ["tsx", "scripts/audit-naplex-questions.ts"]);

run("A+ tier review", "npx", ["tsx", "scripts/review-naplex-bank.ts", "--dry-run"]);

if (apply) {
  run("Blueprint domain migration", "npx", [
    "tsx",
    "scripts/migrate-naplex-blueprint-domains.ts",
  ]);
  run("Repair unscorable items", "npm", ["run", "db:fix-naplex-unscorable"]);
  run("Best-tier QA gate", "npx", ["tsx", "scripts/qa-gate-naplex-best.ts"]);
  console.log("\n✓ Apply pass complete. Consider next:");
  console.log("  npm run db:naplex-best:full        # OpenAI polish + elevate");
  console.log("  npm run db:rebalance-naplex          # Fill pharmacotherapy deficit");
  console.log("  npm run db:enrich-naplex-guidelines  # 2026 guideline refs\n");
} else {
  run("Blueprint migration preview", "npx", [
    "tsx",
    "scripts/migrate-naplex-blueprint-domains.ts",
    "--dry-run",
  ]);
  run("QA gate preview", "npx", ["tsx", "scripts/qa-gate-naplex-best.ts", "--dry-run"]);
  console.log("\nDry-run complete. Re-run with --apply to write fixes.");
  console.log("Set OPENAI_API_KEY for AI elevation and pharmacotherapy generation.\n");
}

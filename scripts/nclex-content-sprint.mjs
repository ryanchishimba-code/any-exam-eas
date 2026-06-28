#!/usr/bin/env node
/**
 * NCLEX content sprint — promote to 5K serve-ready, enrich, sync, audit.
 *
 * Usage:
 *   npm run db:nclex-sprint
 *   npm run db:nclex-sprint -- --dry-run
 */
import { spawnSync } from "node:child_process";

const dryRun = process.argv.includes("--dry-run");
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

function run(label, script, extraArgs = []) {
  console.log(`\n▶ ${label}`);
  const args = ["run", script, ...(dryRun ? ["--", "--dry-run"] : []), ...extraArgs];
  const result = spawnSync(npmCmd, args, { stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    console.error(`\n✗ ${label} failed (exit ${result.status})`);
    process.exit(result.status ?? 1);
  }
}

console.log("NCLEX content sprint — promote 5K → enrich → sync → audit\n");

run("Promote NCLEX to 5K serve-ready", "db:promote-nclex-5k");
if (!dryRun) {
  run("Enrich NCLEX rationales (rule-based guidelines)", "db:enrich-nclex-guidelines");
}
run("Sync NCLEX serve-ready flags", "db:sync-nclex-serve-ready");
run("NCLEX best-tier QA gate", "db:qa-gate-nclex-best");
run("Audit NCLEX served alignment", "db:audit-nclex-served");
run("Report NCLEX serve rate", "db:report-nclex-serve-rate");

console.log("\n✓ NCLEX sprint complete. Review artifacts/nclex-promote-5k-report.json");

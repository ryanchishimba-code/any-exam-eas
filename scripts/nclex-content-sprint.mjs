#!/usr/bin/env node
/**
 * NCLEX content sprint — sync serve-ready flags, enrich rationales, QA gate, audit.
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

console.log("NCLEX content sprint — sync → enrich → QA → audit\n");

run("Sync NCLEX serve-ready", "db:sync-nclex-serve-ready");
if (!dryRun) {
  run("Enrich NCLEX rationales (batch)", "db:enrich-nclex-guidelines");
}
run("NCLEX best-tier QA gate", "db:qa-gate-nclex-best");
run("Audit NCLEX served alignment", "db:audit-nclex-served");
run("Report NCLEX best rate", "db:report-nclex-best-rate");

console.log("\n✓ NCLEX sprint complete. Review artifacts/nclex-served-alignment-audit.json");

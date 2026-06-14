#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { join } from "node:path";

const ROOT = process.cwd();
const NODE = join(ROOT, ".tools/node-v22.14.0-darwin-arm64/bin/node");
const tsx = (script, ...args) => [NODE, ["node_modules/tsx/dist/cli.mjs", script, ...args]];
const dry = process.argv.includes("--dry-run") ? ["--dry-run"] : [];
const skipCurate = process.argv.includes("--skip-curate");

const steps = [
  ["elevate", tsx("scripts/elevate-nclex-bank.ts", ...dry)],
  ["prioritization", tsx("scripts/polish-nursing-questions.ts", "--fix-prioritization", ...dry)],
  ["gate", tsx("scripts/qa-gate-nclex-best.ts", ...dry)],
];
if (!skipCurate) {
  steps.push(["curate", tsx("scripts/curate-nclex-questions.ts", "--failing", "--force-ai", "--limit", "2000", ...dry)]);
  steps.push(["gate2", tsx("scripts/qa-gate-nclex-best.ts", ...dry)]);
}
steps.push(["report", tsx("scripts/report-nclex-best-rate.ts")]);

for (const [label, [bin, args]] of steps) {
  console.log(`\n▶ ${label}`);
  execFileSync(bin, args, { stdio: "inherit", cwd: ROOT, maxBuffer: 64 * 1024 * 1024 });
}

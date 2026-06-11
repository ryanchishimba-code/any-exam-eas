#!/usr/bin/env node
/**
 * Polish all fields then run QA gate (serve only passing items).
 *   npm run db:qa-full
 */
import { execFileSync } from "node:child_process";

// Invoke tsx via the current node binary so the pipeline works even when
// npm/npx are not on PATH (e.g. agent shells using a bundled node).
const tsx = (script, ...args) => [
  process.execPath,
  ["node_modules/tsx/dist/cli.mjs", script, ...args],
];

const steps = [
  ["NCLEX polish", tsx("scripts/polish-nursing-questions.ts")],
  ["NCLEX prioritization fix", tsx("scripts/polish-nursing-questions.ts", "--fix-prioritization")],
  ["USMLE Step 2 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-2")],
  ["USMLE Step 1 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-1")],
  ["USMLE Step 3 polish", tsx("scripts/polish-usmle-questions.ts", "--field", "usmle-step-3")],
  ["NAPLEX polish", tsx("scripts/polish-pharmacy-questions.ts")],
  ["QA gate (all fields)", tsx("scripts/qa-gate-question-bank.ts")],
];

for (const [label, [bin, args]] of steps) {
  console.log(`\n${"═".repeat(60)}\n▶ ${label}\n${"═".repeat(60)}\n`);
  execFileSync(bin, args, { stdio: "inherit", cwd: process.cwd() });
}

console.log("\n✓ Full QA pipeline complete.\n");

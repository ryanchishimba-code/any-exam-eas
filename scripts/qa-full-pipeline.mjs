#!/usr/bin/env node
/**
 * Polish all fields then run QA gate (serve only passing items).
 *   npm run db:qa-full
 */
import { execSync } from "node:child_process";

const steps = [
  ["NCLEX polish", "npx tsx scripts/polish-nursing-questions.ts"],
  ["NCLEX prioritization fix", "npx tsx scripts/polish-nursing-questions.ts --fix-prioritization"],
  ["USMLE Step 2 polish", "npx tsx scripts/polish-usmle-questions.ts --field usmle-step-2"],
  ["USMLE Step 1 polish", "npx tsx scripts/polish-usmle-questions.ts --field usmle-step-1"],
  ["USMLE Step 3 polish", "npx tsx scripts/polish-usmle-questions.ts --field usmle-step-3"],
  ["NAPLEX polish", "npx tsx scripts/polish-pharmacy-questions.ts"],
  ["QA gate (all fields)", "npx tsx scripts/qa-gate-question-bank.ts"],
];

for (const [label, cmd] of steps) {
  console.log(`\n${"═".repeat(60)}\n▶ ${label}\n${"═".repeat(60)}\n`);
  execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
}

console.log("\n✓ Full QA pipeline complete.\n");

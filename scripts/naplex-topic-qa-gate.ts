#!/usr/bin/env node
/** Standalone NAPLEX topic/registry/practice alignment QA — no Prisma. */
import { runNaplexTopicQaGate } from "../src/lib/exam-prep/naplex/topic-qa-gate.ts";

console.log("\nNAPLEX topic integration gate (registry, practice filters, calc routing)\n");
const { passed, issues } = runNaplexTopicQaGate();

if (passed) {
  console.log("  ✓ All NAPLEX topic integration checks passed\n");
  process.exit(0);
}

console.error(`  ✗ ${issues.length} NAPLEX topic integration issue(s):\n`);
for (const issue of issues) {
  console.error(`    [${issue.code}] ${issue.message}`);
}
console.error("");
process.exit(1);

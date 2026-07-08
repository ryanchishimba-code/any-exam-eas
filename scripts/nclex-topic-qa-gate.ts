#!/usr/bin/env node
/** Standalone NCLEX topic/registry/practice alignment QA — no Prisma. */
import { runNclexTopicQaGate } from "../src/lib/exam-prep/nclex/topic-qa-gate.ts";

console.log("\nNCLEX topic integration gate (registry, practice filters, learning path)\n");
const { passed, issues } = runNclexTopicQaGate();

if (passed) {
  console.log("  ✓ All NCLEX topic integration checks passed\n");
  process.exit(0);
}

console.error(`  ✗ ${issues.length} NCLEX topic integration issue(s):\n`);
for (const issue of issues) {
  console.error(`    [${issue.code}] ${issue.message}`);
}
console.error("");
process.exit(1);

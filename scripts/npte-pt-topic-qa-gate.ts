#!/usr/bin/env node
/** Standalone NPTE-PT topic/registry QA — no Prisma. */
import { runNptePtTopicQaGate } from "../src/lib/exam-prep/npte-pt/topic-qa-gate";

console.log("\nNPTE-PT topic integration gate\n");
const { passed, issues } = runNptePtTopicQaGate();
if (passed) {
  console.log("  ✓ All topic integration checks passed\n");
  process.exit(0);
}
console.error(`  ✗ ${issues.length} topic integration issue(s):\n`);
for (const issue of issues) console.error(`    [${issue.code}] ${issue.message}`);
process.exit(1);

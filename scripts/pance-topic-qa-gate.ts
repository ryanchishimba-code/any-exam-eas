#!/usr/bin/env node
/** Standalone PANCE topic/registry QA — no Prisma. */
import { runPanceTopicQaGate } from "../src/lib/exam-prep/pance/topic-qa-gate";

console.log("\nPANCE topic integration gate\n");
const { passed, issues } = runPanceTopicQaGate();
if (passed) {
  console.log("  ✓ All topic integration checks passed\n");
  process.exit(0);
}
console.error(`  ✗ ${issues.length} topic integration issue(s):\n`);
for (const issue of issues) console.error(`    [${issue.code}] ${issue.message}`);
process.exit(1);

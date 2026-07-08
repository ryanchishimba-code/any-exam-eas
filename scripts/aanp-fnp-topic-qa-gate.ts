#!/usr/bin/env node
/** Standalone AANP FNP topic/registry QA — no Prisma. */
import { runAanpFnpTopicQaGate } from "../src/lib/exam-prep/aanp-fnp/topic-qa-gate";

console.log("\nAANP FNP topic integration gate\n");
const { passed, issues } = runAanpFnpTopicQaGate();
if (passed) {
  console.log("  ✓ All topic integration checks passed\n");
  process.exit(0);
}
console.error(`  ✗ ${issues.length} topic integration issue(s):\n`);
for (const issue of issues) console.error(`    [${issue.code}] ${issue.message}`);
process.exit(1);

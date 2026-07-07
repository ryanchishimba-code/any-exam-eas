#!/usr/bin/env node
/** Standalone USMLE topic/registry/content QA — no Prisma or bank imports. */
import { runUsmleTopicQaGate } from "../src/lib/exam-prep/usmle/topic-qa-gate";

console.log("\nUSMLE topic integration gate (registry, content, roadmap links)\n");
const { passed, issues } = runUsmleTopicQaGate();

if (passed) {
  console.log("  ✓ All topic integration checks passed\n");
  process.exit(0);
}

console.error(`  ✗ ${issues.length} topic integration issue(s):\n`);
for (const issue of issues) {
  console.error(`    [${issue.code}] ${issue.message}`);
}
console.error("");
process.exit(1);

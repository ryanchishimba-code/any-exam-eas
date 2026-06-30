#!/usr/bin/env node
/**
 * Verify NCLEX (and other boards) timed sessions hit exact requested counts.
 *
 * Usage:
 *   npm run db:verify-nclex-count
 *   npm run db:verify-nclex-count -- --limit 100
 *   npm run db:verify-nclex-count -- --field nursing --limit 85
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { gatherTimedExamBankItems } from "../src/lib/questions/timed-exam-sampling";
import { timedExamGatePairForField } from "../src/lib/exam-prep/exam-fill-gates";
import {
  finalizeExamSessionQuestions,
  assertExamSessionReady,
  resolveExamBankSampleCount,
} from "../src/lib/questions/finalize-exam-session";
import { bankItemToSessionRaw } from "../src/lib/exam-prep/prepare-bank-session";
import { resolveTimedExamLimit } from "../src/lib/exam/exam-lengths";

function parseArgs() {
  const args = process.argv.slice(2);
  let fieldId = "nursing";
  let limit = 100;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--field" && args[i + 1]) fieldId = args[++i]!;
    else if (args[i] === "--limit" && args[i + 1]) limit = Number.parseInt(args[++i]!, 10);
  }
  return { fieldId, limit };
}

async function main() {
  const { fieldId, limit } = parseArgs();
  const resolved = resolveTimedExamLimit(fieldId, limit);
  const target = resolved;

  console.log(`\nVerify timed session: ${fieldId} × ${target} questions\n`);

  const sampleCount = resolveExamBankSampleCount(fieldId, target, true);
  const gates = timedExamGatePairForField(fieldId);

  const items = await gatherTimedExamBankItems({
    fieldId,
    limit: target,
    filterFn: gates.strict,
    relaxedFilterFn: gates.relaxed,
    initialSampleCount: sampleCount,
  });

  console.log(`  gathered pool: ${items.length} (sample pull ${sampleCount})`);

  const raw = items.map((item, i) =>
    bankItemToSessionRaw(fieldId, fieldId, item.subjectId ?? "mixed", item, i)
  );

  const { prepared, quality } = finalizeExamSessionQuestions(raw, target, { fieldId });
  console.log(`  finalized:     ${prepared.length}/${target}`);
  console.log(`  issues:        ${quality.issues.join(", ") || "none"}`);

  assertExamSessionReady(quality, fieldId);
  console.log("\n✓ Session ready at exact requested count.\n");
}

main().catch((err) => {
  console.error("\n✗", err instanceof Error ? err.message : err);
  process.exit(1);
});

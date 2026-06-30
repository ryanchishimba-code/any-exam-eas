#!/usr/bin/env node
/**
 * Compose a sample NCLEX full exam and report similarity / concept duplication.
 *
 *   npx tsx scripts/audit-nclex-similarity-sample.ts
 *   npx tsx scripts/audit-nclex-similarity-sample.ts --count 80
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { composePracticeExamProgressive } from "../src/lib/exam-prep/compose/compose-practice-exam";
import { composeValidatedExam } from "../src/lib/exam-prep/exam-qa-engine";
import {
  auditExamSimilarity,
  auditBlockingExamSimilarityFast,
  primaryTestedConceptKey,
  resolveExamUniquenessPolicy,
} from "../src/lib/exam-prep/exam-similarity";
import { gatherTimedExamBankItems } from "../src/lib/questions/timed-exam-sampling";
import { timedExamGatePairForField } from "../src/lib/exam-prep/exam-fill-gates";
import { resolveExamBankSampleCount } from "../src/lib/questions/finalize-exam-session";
import { dedupeItemsByClinicalCase } from "../src/lib/exam-prep/diverse-session-selection";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import type { BankItem } from "../src/lib/question-bank";

function parseArgs() {
  const args = process.argv.slice(2);
  let count = 80;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--count" && args[i + 1]) count = Number.parseInt(args[++i]!, 10);
  }
  return { count };
}

function summarizeSimilarity(items: BankItem[], requested: number, label: string) {
  const policy = resolveExamUniquenessPolicy(requested, items);
  const all = auditExamSimilarity(items);
  const blocking = auditBlockingExamSimilarityFast(items, policy);

  const byCode: Record<string, number> = {};
  for (const issue of all) byCode[issue.code] = (byCode[issue.code] ?? 0) + 1;

  const concepts: Record<string, number> = {};
  for (const item of items) {
    const k = primaryTestedConceptKey(item);
    concepts[k] = (concepts[k] ?? 0) + 1;
  }
  const overCap = Object.entries(concepts)
    .filter(([, n]) => n > policy.maxPerConcept)
    .sort((a, b) => b[1] - a[1]);

  console.log(`\n── ${label} ──`);
  console.log(`  Questions: ${items.length}/${requested}`);
  console.log(`  maxPerConcept cap: ${policy.maxPerConcept}`);
  console.log(`  All similarity pairs: ${all.length}`, byCode);
  console.log(`  Blocking violations: ${blocking.length}`);

  if (overCap.length) {
    console.log(`  Concepts over cap (${policy.maxPerConcept}):`);
    for (const [k, n] of overCap.slice(0, 8)) {
      console.log(`    ${k}: ${n}`);
    }
  }

  if (blocking[0]) {
    console.log("  Sample blocking issues:");
    for (const b of blocking.slice(0, 5)) {
      console.log(`    [${b.code}] ${b.message}`);
    }
  }
}

async function loadItemsByIds(prisma: PrismaClient, ids: string[]): Promise<BankItem[]> {
  const rows = await prisma.questionBankItem.findMany({ where: { id: { in: ids } } });
  const byId = new Map(rows.map((r) => [r.id, enrichBankItemFromRow(r)]));
  return ids.map((id) => byId.get(id)).filter(Boolean) as BankItem[];
}

async function main() {
  const { count } = parseArgs();
  const prisma = new PrismaClient();

  console.log(`\nNCLEX sample full exam — ${count} questions\n`);

  const progressive = await composePracticeExamProgressive("nclex", {
    numQuestions: count,
    outputFormat: "ids_only",
    seed: 42,
  });

  if (progressive) {
    const items = await loadItemsByIds(
      prisma,
      progressive.exam.questions.map((q) => q.questionId)
    );
    summarizeSimilarity(items, count, `Blueprint compose (tier: ${progressive.tier.id})`);
    console.log(`  Similarity flags in header: ${progressive.exam.similarityFlags.length}`);
    if (progressive.exam.similarityFlags[0]) {
      console.log(`  First flag: ${progressive.exam.similarityFlags[0]}`);
    }
  } else {
    console.log("Blueprint compose: FAILED (all tiers exhausted)");
  }

  const gates = timedExamGatePairForField("nursing");
  const sample = resolveExamBankSampleCount("nursing", count, true);
  const gathered = await gatherTimedExamBankItems({
    fieldId: "nursing",
    limit: count,
    filterFn: gates.strict,
    relaxedFilterFn: gates.relaxed,
    initialSampleCount: sample,
  });
  summarizeSimilarity(gathered.slice(0, count), count, "Timed API gather (first N)");
  console.log(
    `  Unique clinical cases in gather pool: ${dedupeItemsByClinicalCase(gathered).length}/${gathered.length}`
  );

  console.log("\n── Validated exam engine (with self-heal) ──");
  const validated = await composeValidatedExam({ examSlug: "nclex", numQuestions: count, seed: 42 });
  console.log(`  Status: ${validated.status}`);
  console.log(`  Returned: ${validated.returned}/${validated.requested}`);
  if (validated.finalCheck.similarityIssues.length) {
    const codes: Record<string, number> = {};
    for (const i of validated.finalCheck.similarityIssues) {
      codes[i.code] = (codes[i.code] ?? 0) + 1;
    }
    console.log("  Final similarity issues:", codes);
    console.log("  Top messages:");
    for (const m of validated.finalCheck.similarityIssues.slice(0, 5)) {
      console.log(`    - ${m.message}`);
    }
  }
  if (validated.finalCheck.blueprintShortfalls.length) {
    console.log("  Blueprint shortfalls:", validated.finalCheck.blueprintShortfalls.join("; "));
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

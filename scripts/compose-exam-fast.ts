#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

import { PrismaClient } from "@prisma/client";
import { enrichBankItemFromRow } from "../src/lib/mpje/parse-bank-options";
import {
  candidateViolatesExamRules,
  auditBlockingExamSimilarityFast,
  resolveExamUniquenessPolicy,
} from "../src/lib/exam-prep/exam-similarity";
import { dedupeItemsByClinicalCase } from "../src/lib/exam-prep/diverse-session-selection";
import { renderValidatedExamSql } from "../src/lib/exam-prep/exam-qa-engine";
import { resolveExamComposeConfig } from "../src/lib/exam-prep/compose/exam-compose-config";
import { bankItemMeetsStructuralBar } from "../src/lib/exam-prep/exam-qa-serve-bar";
import { shuffleBankItems } from "../src/lib/question-bank-db";

const SLUG = process.argv.includes("--exam")
  ? process.argv[process.argv.indexOf("--exam") + 1]!
  : "aanp-fnp";
const COUNT = process.argv.includes("--count")
  ? parseInt(process.argv[process.argv.indexOf("--count") + 1]!, 10)
  : 135;

function greedyPick(
  pool: ReturnType<typeof dedupeItemsByClinicalCase>,
  count: number,
  policy: ReturnType<typeof resolveExamUniquenessPolicy>
) {
  const shuffled = shuffleBankItems(pool);
  const selected: (typeof pool)[number][] = [];
  for (const item of shuffled) {
    if (selected.length >= count) break;
    if (candidateViolatesExamRules(item, selected, policy)) continue;
    selected.push(item);
  }
  return selected.slice(0, count);
}

async function main() {
  const config = resolveExamComposeConfig(SLUG);
  if (!config) throw new Error(`Unknown slug: ${SLUG}`);

  const prisma = new PrismaClient();
  const t0 = Date.now();

  const rows = await prisma.questionBankItem.findMany({
    where: { fieldId: config.fieldId, active: true, qaPassed: true },
    take: Math.min(2500, COUNT * 12),
    orderBy: { updatedAt: "desc" },
  });

  const pool = rows
    .map((row) => enrichBankItemFromRow(row))
    .filter(bankItemMeetsStructuralBar);
  const deduped = dedupeItemsByClinicalCase(pool);

  console.log(`Pool: ${pool.length} (${deduped.length} unique cases) in ${Date.now() - t0}ms`);
  if (deduped.length < COUNT) throw new Error(`Insufficient bank: ${deduped.length}/${COUNT}`);

  const policy = resolveExamUniquenessPolicy(COUNT, deduped);
  console.log(
    `Uniqueness policy: maxPerConcept=${policy.maxPerConcept}, optionOverlap=${policy.optionOverlapThreshold}`
  );

  let selected: ReturnType<typeof dedupeItemsByClinicalCase> = [];
  let blocking: ReturnType<typeof auditBlockingExamSimilarityFast> = [];
  const fixes: { code: string; message: string; action: string }[] = [];

  for (let attempt = 0; attempt < 12; attempt++) {
    selected = greedyPick(deduped, COUNT, policy);
    blocking = auditBlockingExamSimilarityFast(selected, policy);
    if (selected.length === COUNT && blocking.length === 0) break;
  }

  if (selected.length < COUNT) {
    fixes.push({
      code: "count_short",
      message: `Greedy pick returned ${selected.length}/${COUNT} after 24 shuffles.`,
      action: "expand_pool",
    });
  }

  const status = selected.length === COUNT && blocking.length === 0 ? "PASSED" : "FAILED";

  const questions = selected.map((item, i) => ({
    position: i + 1,
    questionId: item.id!,
    domainId: item.blueprintDomain ?? item.subjectId ?? "general",
    domainLabel: item.blueprintDomain ?? item.subjectId ?? "General",
    subdomain: item.blueprintTopic ?? item.topicCategory,
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer,
    explanation: item.explanation,
    vignette: item.scenario ?? item.vignette,
  }));

  const sql = renderValidatedExamSql({
    examSlug: SLUG,
    examName: config.examName,
    examNumber: 1,
    questionCount: COUNT,
    questionIds: questions.map((q) => q.questionId),
    status,
    fixes,
  });

  const base = path.join(process.cwd(), "artifacts", `${SLUG}-${COUNT}-validated`);
  fs.mkdirSync(path.dirname(base), { recursive: true });
  fs.writeFileSync(
    `${base}.json`,
    JSON.stringify({ status, count: questions.length, questions, blocking }, null, 2)
  );
  fs.writeFileSync(`${base}.sql`, sql);
  fs.writeFileSync(
    `${base}.md`,
    `# ${config.examName} — ${COUNT} Questions\n\n**Status:** ${status} Final Check\n**Questions:** ${questions.length}/${COUNT}\n`
  );

  console.log(`\nStatus: ${status} Final Check`);
  console.log(`${config.examName}: ${questions.length}/${COUNT}`);
  console.log(`Blocking: ${blocking.length}`);
  console.log(`Artifacts: artifacts/${SLUG}-${COUNT}-validated.{json,sql,md}`);
  console.log(`Total: ${Date.now() - t0}ms`);

  await prisma.$disconnect();
  if (status === "FAILED") process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

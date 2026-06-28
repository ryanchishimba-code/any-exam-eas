#!/usr/bin/env npx tsx
import fs from "node:fs";
import path from "node:path";
import { loadEnvFiles } from "./load-env";

loadEnvFiles();

import { composeForConfig } from "../src/lib/exam-prep/compose/compose-practice-exam";
import { resolveExamComposeConfig } from "../src/lib/exam-prep/compose/exam-compose-config";
import {
  auditBlockingExamSimilarity,
  auditExamSimilarity,
} from "../src/lib/exam-prep/exam-similarity";
import { renderValidatedExamSql } from "../src/lib/exam-prep/exam-qa-engine";

const COUNT = 135;
const SLUG = "aanp-fnp";

async function main() {
  const config = resolveExamComposeConfig(SLUG);
  if (!config) throw new Error("Unknown exam slug");

  console.log(`Composing ${COUNT}-question ${config.examName}…`);
  const exam = await composeForConfig(config, {
    numQuestions: COUNT,
    outputFormat: "full_exam_study",
    seed: 135_009,
  });

  const bankItems = exam.questions.map((q) => ({
    id: q.questionId,
    subjectId: q.domainId,
    question: q.question ?? "",
    options: q.options ?? [],
    correctAnswer: q.correctAnswer ?? "",
    explanation: q.explanation ?? "",
    blueprintDomain: q.domainId,
    blueprintTopic: q.subdomain,
  }));

  const blocking = auditBlockingExamSimilarity(bankItems, COUNT);
  const warnings = auditExamSimilarity(bankItems).filter(
    (i) => !blocking.some((b) => b.indexA === i.indexA && b.indexB === i.indexB && b.code === i.code)
  );

  const status =
    exam.questions.length === COUNT && blocking.length === 0 ? "PASSED" : "FAILED";

  const fixes =
    exam.questions.length !== COUNT
      ? [{ code: "count", message: `Got ${exam.questions.length}/${COUNT}`, action: "recompose" }]
      : blocking.map((b) => ({
          code: b.code,
          message: b.message,
          action: "replace_similar",
        }));

  const sql = renderValidatedExamSql({
    examSlug: SLUG,
    examName: config.examName,
    examNumber: 1,
    questionCount: COUNT,
    questionIds: exam.questions.map((q) => q.questionId),
    status,
    fixes: fixes.map((f) => ({ ...f, action: f.action })),
  });

  const outDir = path.join(process.cwd(), "artifacts");
  fs.mkdirSync(outDir, { recursive: true });

  const jsonPath = path.join(outDir, "aanp-fnp-135-validated.json");
  const sqlPath = path.join(outDir, "aanp-fnp-135-validated.sql");
  const mdPath = path.join(outDir, "aanp-fnp-135-validated.md");

  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        status,
        exam: exam.header,
        questionCount: exam.questions.length,
        blockingIssues: blocking,
        warnings: warnings.slice(0, 20),
        selectionSummary: exam.selectionSummary,
        questions: exam.questions,
      },
      null,
      2
    )
  );
  fs.writeFileSync(sqlPath, sql);

  const md = [
    `# ${config.examName} — ${COUNT} Questions`,
    ``,
    `**Status:** ${status} Final Check`,
    `**Returned:** ${exam.questions.length}/${COUNT}`,
    ``,
    blocking.length
      ? `## Blocking issues\n${blocking.map((b) => `- ${b.message}`).join("\n")}`
      : `## Blocking issues\nNone`,
    ``,
    warnings.length
      ? `## Warnings (non-blocking)\n${warnings.slice(0, 10).map((w) => `- ${w.message}`).join("\n")}`
      : "",
    ``,
    `Full exam JSON: \`artifacts/aanp-fnp-135-validated.json\``,
    `SQL manifest: \`artifacts/aanp-fnp-135-validated.sql\``,
  ].join("\n");
  fs.writeFileSync(mdPath, md);

  console.log(`\nStatus: ${status} Final Check`);
  console.log(`Questions: ${exam.questions.length}/${COUNT}`);
  console.log(`Blocking issues: ${blocking.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(`JSON → ${jsonPath}`);
  console.log(`SQL  → ${sqlPath}`);
  console.log(`MD   → ${mdPath}`);

  if (status === "FAILED") process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

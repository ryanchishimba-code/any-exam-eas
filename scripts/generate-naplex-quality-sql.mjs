#!/usr/bin/env node
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function escapeSql(s) {
  return String(s).replace(/'/g, "''");
}

function contentHash(fieldId, subjectId, question) {
  return createHash("sha256")
    .update(`${fieldId}|${subjectId}|${question.trim()}`)
    .digest("hex")
    .slice(0, 32);
}

function serializeOptions(item) {
  if (item.ngnPayload) {
    return JSON.stringify({ ...item.ngnPayload, options: item.options });
  }
  return JSON.stringify(item.options);
}

async function main() {
  const { register } = await import("tsx/esm/api");
  register();
  const { NAPLEX_QUALITY_V2 } = await import(
    path.join(root, "src/lib/exam-prep/naplex-quality-v2.ts")
  );
  const { NAPLEX_CALC_CASES_V3 } = await import(
    path.join(root, "src/lib/exam-prep/naplex-calc-cases-v3.ts")
  );
  const { NAPLEX_AREA3_V3 } = await import(
    path.join(root, "src/lib/exam-prep/naplex-area3-v3.ts")
  );

  const allItems = [...NAPLEX_QUALITY_V2, ...NAPLEX_CALC_CASES_V3, ...NAPLEX_AREA3_V3];

  const lines = [
    `-- NAPLEX 2025 seeds (${allItems.length} items: v2 + calc v3 + area3 v3)`,
    "-- Regenerate: npx tsx scripts/generate-naplex-quality-sql.mjs",
    "",
  ];

  for (const item of allItems) {
    const fieldId = "pharmacy";
    const subjectId = item.subjectId ?? "pharmacology";
    const hash = contentHash(fieldId, subjectId, item.question);
    const vignette = item.vignette ? `'${escapeSql(item.vignette)}'` : "NULL";

    lines.push(`INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "solutionSteps", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'pharmacy',
  '${escapeSql(subjectId)}',
  ${item.difficulty ?? "NULL"},
  '${escapeSql(item.topicCategory ?? subjectId)}',
  '${escapeSql(item.blueprintDomain ?? "naplex-area3-treatment-planning")}',
  '${escapeSql(item.itemType ?? "mcq")}',
  ${vignette},
  '${escapeSql(item.question)}',
  '${escapeSql(serializeOptions(item))}',
  '${escapeSql(item.correctAnswer)}',
  '${escapeSql(item.explanation)}',
  ${item.solutionSteps ? `'${escapeSql(JSON.stringify(item.solutionSteps))}'` : "NULL"},
  ${item.tags ? `'${escapeSql(JSON.stringify(item.tags))}'` : "NULL"},
  ${item.references ? `'${escapeSql(JSON.stringify(item.references))}'::jsonb` : "NULL"},
  'seed',
  '${hash}',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "solutionSteps" = EXCLUDED."solutionSteps",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;`);
    lines.push("");
  }

  const out = path.join(
    root,
    "prisma/migrations/20250611000000_naplex_quality_v2/seed_inserts.sql"
  );
  writeFileSync(out, lines.join("\n"));
  console.log(`Wrote ${allItems.length} inserts → ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

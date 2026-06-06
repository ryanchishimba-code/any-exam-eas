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
  const { NGN_NURSING_QUALITY_V2 } = await import(
    path.join(root, "src/lib/exam-prep/ngn-nursing-quality-v2.ts")
  );

  const lines = [
    "-- NCLEX-NGN quality v2 seeds (40 items)",
    "-- Regenerate: node scripts/generate-ngn-quality-sql.mjs",
    "",
  ];

  for (const item of NGN_NURSING_QUALITY_V2) {
    const fieldId = "nursing";
    const subjectId = item.subjectId ?? "physiological-adaptation";
    const hash = contentHash(fieldId, subjectId, item.question);
    const vignette = item.vignette ? `'${escapeSql(item.vignette)}'` : "NULL";

    lines.push(`INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  '${escapeSql(subjectId)}',
  ${item.difficulty ?? "NULL"},
  '${escapeSql(item.topicCategory ?? subjectId)}',
  '${escapeSql(item.blueprintDomain ?? "nclex-physiological")}',
  '${escapeSql(item.itemType ?? "mcq")}',
  ${vignette},
  '${escapeSql(item.question)}',
  '${escapeSql(serializeOptions(item))}',
  '${escapeSql(item.correctAnswer)}',
  '${escapeSql(item.explanation)}',
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
  "active" = true;`);
    lines.push("");
  }

  const out = path.join(
    root,
    "prisma/migrations/20250610000000_nclex_ngn_quality_v2/seed_inserts.sql"
  );
  writeFileSync(out, lines.join("\n"));
  console.error(`Wrote ${NGN_NURSING_QUALITY_V2.length} inserts to ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Generates SQL INSERT statements for MPJE_QUALITY_SEEDS.
 * Run: node scripts/generate-mpje-quality-sql.mjs > prisma/migrations/20250609000000_mpje_quality_v2/seed_inserts.sql
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Dynamic import of compiled seeds — use tsx for TS
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

  const { MPJE_QUALITY_SEEDS } = await import(
    path.join(root, "src/lib/mpje/quality-seeds.ts")
  );

  const lines = [
    "-- Auto-generated MPJE quality v2 seeds (50 items)",
    "-- Regenerate: node scripts/generate-mpje-quality-sql.mjs",
    "",
  ];

  for (const item of MPJE_QUALITY_SEEDS) {
    const fieldId = "mpje";
    const subjectId = item.subjectId ?? "uniform-mpje";
    const hash = contentHash(fieldId, subjectId, item.question);
    const opts = escapeSql(serializeOptions(item));
    const refs = item.references ? escapeSql(JSON.stringify(item.references)) : null;
    const tags = item.tags ? escapeSql(JSON.stringify(item.tags)) : null;
    const scenario = item.scenario ? `'${escapeSql(item.scenario)}'` : "NULL";

    lines.push(`INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "stateCode", "difficulty", "topicCategory",
  "blueprintDomain", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'mpje',
  '${escapeSql(subjectId)}',
  ${item.stateCode ? `'${item.stateCode}'` : "NULL"},
  ${item.difficulty ?? "NULL"},
  '${escapeSql(item.topicCategory ?? subjectId)}',
  '${escapeSql(item.blueprintDomain ?? (item.stateCode ? "mpje-jurisprudence" : "umpje-uniform"))}',
  '${escapeSql(item.itemType ?? "mcq")}',
  ${scenario},
  '${escapeSql(item.question)}',
  '${opts}',
  '${escapeSql(item.correctAnswer)}',
  '${escapeSql(item.explanation)}',
  ${tags ? `'${tags}'` : "NULL"},
  ${refs ? `'${refs}'::jsonb` : "NULL"},
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
  "tags" = EXCLUDED."tags",
  "references" = EXCLUDED."references",
  "active" = true;`);
    lines.push("");
  }

  const out = path.join(
    root,
    "prisma/migrations/20250609000000_mpje_quality_v2/seed_inserts.sql"
  );
  writeFileSync(out, lines.join("\n"));
  console.error(`Wrote ${MPJE_QUALITY_SEEDS.length} inserts to ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

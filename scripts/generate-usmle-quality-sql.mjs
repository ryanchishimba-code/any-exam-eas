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

function usmleFieldForItem(item) {
  const step = item.ngnPayload?.stepLevel;
  if (step === "step3") return "usmle-step-3";
  if (step === "step2") return "usmle-step-2";
  return "usmle-step-1";
}

async function main() {
  const { register } = await import("tsx/esm/api");
  register();
  const { USMLE_QUALITY_V2 } = await import(
    path.join(root, "src/lib/exam-prep/usmle-quality-v2.ts")
  );
  const { USMLE_STEP3_V3 } = await import(
    path.join(root, "src/lib/exam-prep/usmle-step3-v3.ts")
  );

  const USMLE_ALL = [...USMLE_QUALITY_V2, ...USMLE_STEP3_V3];

  const lines = [
    `-- USMLE 2025–2026 quality seeds (${USMLE_ALL.length} items: v2 + step3 v3)`,
    "-- Regenerate: npx tsx scripts/generate-usmle-quality-sql.mjs",
    "",
  ];

  for (const item of USMLE_ALL) {
    const fieldId = usmleFieldForItem(item);
    const subjectId = item.subjectId ?? "pathology";
    const hash = contentHash(fieldId, subjectId, item.question);
    const vignette = item.vignette ? `'${escapeSql(item.vignette)}'` : "NULL";
    const stepLevel = item.ngnPayload?.stepLevel
      ? `'${escapeSql(String(item.ngnPayload.stepLevel))}'`
      : "NULL";

    lines.push(`INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  '${escapeSql(fieldId)}',
  '${escapeSql(subjectId)}',
  ${item.difficulty ?? "NULL"},
  '${escapeSql(item.topicCategory ?? subjectId)}',
  '${escapeSql(item.blueprintDomain ?? "usmle-clinical-reasoning")}',
  '${escapeSql(item.itemType ?? "mcq")}',
  ${stepLevel},
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
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;`);
    lines.push("");
  }

  const out = path.join(
    root,
    "prisma/migrations/20250612000000_usmle_quality_v2/seed_inserts.sql"
  );
  writeFileSync(out, lines.join("\n"));
  console.log(`Wrote ${USMLE_ALL.length} inserts → ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

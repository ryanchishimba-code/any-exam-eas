#!/usr/bin/env node
/**
 * Validates the PANCE 200 pack and writes a rollback-only SQL dry run plus a scoped undo.
 * Does not connect to a database.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dir = path.join(root, "content/pance-200-20261108");
const VERSION = "pance-200-20261108-v1";
const AREAS = [
  "cardiovascular",
  "dermatologic",
  "endocrine",
  "eent",
  "gastrointestinal",
  "genitourinary",
  "hematologic",
  "infectious-diseases",
  "musculoskeletal",
  "neurologic",
  "psychiatry",
  "pulmonary",
  "renal",
  "reproductive",
  "professional-practice",
];
const TASKS = new Set([
  "history-physical",
  "diagnosis",
  "labs",
  "prevention",
  "intervention",
  "pharmacotherapy",
  "foundational",
  "professional",
]);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function sql(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

const items = JSON.parse(readFileSync(path.join(dir, "items.json"), "utf8"));
if (items.length !== 200) fail(`expected 200 items, got ${items.length}`);

const seenQ = new Set();
const hashes = new Set();
const byArea = {};
const byDiff = {};
let hard = 0;

for (const [index, item] of items.entries()) {
  const n = index + 1;
  if (item.fieldId !== "pance") fail(`#${n} fieldId`);
  if (!AREAS.includes(item.subjectId)) fail(`#${n} subject ${item.subjectId}`);
  if (!TASKS.has(item.taskCategory)) fail(`#${n} task ${item.taskCategory}`);
  if (![1, 2, 3, 4, 5].includes(item.difficulty)) fail(`#${n} difficulty`);
  if (item.active !== false || item.qaPassed !== false) fail(`#${n} must be inactive and not qaPassed`);
  if (item.generationVersion !== VERSION) fail(`#${n} generationVersion`);
  if (!item.scenario || item.scenario.length < 80) fail(`#${n} scenario too short`);
  if (!item.question || !item.explanation) fail(`#${n} missing stem or explanation`);
  const options = item.options;
  if (!Array.isArray(options) || options.length < 4 || options.length > 6) fail(`#${n} options`);
  if (new Set(options).size !== options.length) fail(`#${n} duplicate options`);
  if (!options.includes(item.correctAnswer)) fail(`#${n} key not in options`);
  if (!Array.isArray(item.references) || item.references.length < 1) fail(`#${n} citation`);
  for (const ref of item.references) {
    if (!/^https:\/\//.test(ref.url)) fail(`#${n} citation url`);
    if (!ref.label || !/\b20(1[5-9]|2[0-6])\b/.test(ref.label)) fail(`#${n} citation year in label`);
  }
  const q = `${item.scenario.trim()} ${item.question.trim()}`.toLowerCase();
  if (seenQ.has(q)) fail(`#${n} duplicate vignette`);
  seenQ.add(q);
  const hash = createHash("sha256")
    .update(`pance|${item.subjectId}|${item.scenario.trim()}|${item.question.trim()}`)
    .digest("hex");
  if (hashes.has(hash)) fail(`#${n} hash collision`);
  hashes.add(hash);
  item.contentHash = hash;
  byArea[item.subjectId] = (byArea[item.subjectId] || 0) + 1;
  byDiff[item.difficulty] = (byDiff[item.difficulty] || 0) + 1;
  if (item.difficulty >= 4) hard += 1;
  if (item.explanation.length < 180) fail(`#${n} explanation too thin`);
  if (!/incorrect|not |rather|instead|unlike/i.test(item.explanation)) fail(`#${n} explanation does not address distractors`);
}

if (hard < 120) fail(`difficulty 4-5 is ${hard}, need at least 120`);
for (const area of ["dermatologic", "genitourinary", "renal"]) {
  if ((byArea[area] || 0) < 20) fail(`${area} has ${byArea[area] || 0}, need at least 20`);
}

const inserts = items.map((item) => {
  const options = JSON.stringify({
    options: item.options,
    blueprintSystem: item.subjectId,
    taskCategory: item.taskCategory,
    blueprintTopic: item.blueprintTopic,
    kind: "vignette",
  });
  return `INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "taskCategory", "blueprintTopic", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash",
  "generationVersion", "reviewStatus", "active", "qaPassed", "manual_correction",
  "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'pance',
  ${sql(item.subjectId)},
  ${item.difficulty},
  ${sql(item.subjectId)},
  ${sql(item.subjectId)},
  ${sql(item.taskCategory)},
  ${sql(item.blueprintTopic)},
  'vignette',
  ${sql(item.scenario)},
  ${sql(item.question)},
  ${sql(options)},
  ${sql(item.correctAnswer)},
  ${sql(item.explanation)},
  ${sql(JSON.stringify(["pance", "PANCE-2025", item.subjectId, VERSION]))},
  ${sql(JSON.stringify(item.references))}::jsonb,
  'generated',
  ${sql(item.contentHash)},
  ${sql(VERSION)},
  'pending',
  false,
  false,
  true,
  NOW(),
  NOW()
);`;
});

const dry = [
  "-- Rollback-only dry run. Always ends in ROLLBACK. Do not remove the ROLLBACK.",
  "-- Hidden insert: active = false AND qaPassed = false, so the serving gate cannot show these rows.",
  "BEGIN;",
  ...inserts,
  "ROLLBACK;",
  "",
].join("\n");
if (!dry.trimEnd().endsWith("ROLLBACK;")) fail("dry run must end in ROLLBACK");
if (/\nCOMMIT;/.test(dry)) fail("dry run must not commit");

const undo = `-- Narrow undo for this batch only. Does not touch any other PANCE row.
-- Safe to review. Do not run until Ryan approves a write.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'pance'
  AND "generationVersion" = '${VERSION}'
  AND active = false
  AND "qaPassed" = false
  AND source = 'generated';
`;

const backup = `-- Read-only backup of rows this batch would own. Run before any future write.
COPY (
  SELECT "id", "contentHash", "subjectId", "question", active, "qaPassed"
  FROM "QuestionBankItem"
  WHERE "fieldId" = 'pance'
    AND "generationVersion" = '${VERSION}'
) TO STDOUT WITH CSV HEADER;
`;

writeFileSync(path.join(dir, "insert.rollback-only.sql"), dry);
writeFileSync(path.join(dir, "undo.sql"), undo);
writeFileSync(path.join(dir, "backup.sql"), backup);
writeFileSync(
  path.join(dir, "summary.json"),
  JSON.stringify({ count: 200, hard, byArea, byDiff, version: VERSION }, null, 2)
);
console.log(JSON.stringify({ count: 200, hard, byArea, byDiff }));

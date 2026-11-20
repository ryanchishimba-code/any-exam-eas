#!/usr/bin/env node
/** Validates the hidden NCLEX-RN 300 pack and writes rollback-only SQL. Does not connect to a database. */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dir = path.join(root, "content/nclex-300-20261108");
const VERSION = "nclex-300-20261108-v1";
const AREAS = [
  "management-of-care",
  "safety-infection",
  "health-promotion",
  "psychosocial",
  "basic-care-comfort",
  "pharmacology-nursing",
  "reduction-risk",
  "physiological-adaptation",
];
const NGN = new Set(["case_study", "ngn_bowtie", "ngn_matrix", "ordered_response", "select_all"]);

function fail(message) {
  console.error(message);
  process.exit(1);
}
function sql(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

const items = JSON.parse(readFileSync(path.join(dir, "items.json"), "utf8"));
if (items.length !== 300) fail(`expected 300 items, got ${items.length}`);

const seen = new Set();
const hashes = new Set();
const byArea = {};
const byDiff = {};
const byType = {};
const cases = {};
let hard = 0;
let ngn = 0;

for (const [index, item] of items.entries()) {
  const n = index + 1;
  if (!AREAS.includes(item.subjectId)) fail(`#${n} subject ${item.subjectId}`);
  if (![1, 2, 3, 4, 5].includes(item.difficulty)) fail(`#${n} difficulty`);
  if (item.active !== false || item.qaPassed !== false) fail(`#${n} must stay hidden`);
  if (item.generationVersion !== VERSION) fail(`#${n} version`);
  if (!item.scenario || item.scenario.length < 80) fail(`#${n} scenario`);
  if (!item.question || !item.explanation) fail(`#${n} stem`);
  if (item.explanation.toLowerCase().includes("why other options are incorrect")) {
    fail(`#${n} bow-tie defect phrase`);
  }
  if (!/incorrect/i.test(item.explanation)) fail(`#${n} explanation does not address incorrect choices`);
  if (item.explanation.length < 160) fail(`#${n} explanation thin`);
  if (!Array.isArray(item.references) || item.references.length < 1) fail(`#${n} citation`);
  for (const ref of item.references) {
    if (!/^https:\/\//.test(ref.url)) fail(`#${n} url`);
    if (!/\b20(1[5-9]|2[0-6])\b/.test(ref.label)) fail(`#${n} citation year`);
  }
  const q = `${item.scenario}\n${item.question}`.trim().toLowerCase();
  if (seen.has(q)) fail(`#${n} duplicate vignette`);
  seen.add(q);
  const hash = createHash("sha256")
    .update(`nursing|${item.subjectId}|${item.scenario.trim()}|${item.question.trim()}`)
    .digest("hex");
  if (hashes.has(hash)) fail(`#${n} hash`);
  hashes.add(hash);
  item.contentHash = hash;
  byArea[item.subjectId] = (byArea[item.subjectId] || 0) + 1;
  byDiff[item.difficulty] = (byDiff[item.difficulty] || 0) + 1;
  byType[item.itemType] = (byType[item.itemType] || 0) + 1;
  if (item.difficulty >= 4) hard += 1;
  if (NGN.has(item.itemType)) ngn += 1;

  if (item.itemType === "select_all") {
    const keys = item.correctAnswer.split("|||").map((s) => s.trim()).filter(Boolean);
    if (keys.length < 2) fail(`#${n} select-all needs two keys`);
    for (const key of keys) if (!item.options.includes(key)) fail(`#${n} select-all key missing`);
  }
  if (item.itemType === "ngn_bowtie") {
    const [action, ...monitors] = item.correctAnswer.split(",").map((s) => s.trim());
    if (!item.actions?.includes(action) || monitors.length !== 2) fail(`#${n} bow-tie key`);
    for (const monitor of monitors) if (!item.monitors?.includes(monitor)) fail(`#${n} bow-tie monitor`);
    if (item.condition === item.question || item.condition === item.scenario) fail(`#${n} bow-tie condition`);
  }
  if (item.itemType === "ngn_matrix") {
    const cells = item.correctAnswer.split(",").map((s) => s.trim());
    if (cells.length !== item.rows.length) fail(`#${n} matrix cells`);
    for (const cell of cells) {
      const [row, col] = cell.split("|||");
      if (!item.rows.includes(row) || !item.columns.includes(col)) fail(`#${n} matrix cell ${cell}`);
    }
  }
  if (item.itemType === "ordered_response") {
    if (item.correctAnswer === item.options.join(",")) fail(`#${n} ordered key matches display`);
    const keys = item.correctAnswer.split(",").map((s) => s.trim());
    if (keys.length < 3) fail(`#${n} ordered key`);
    for (const key of keys) if (!item.options.includes(key)) fail(`#${n} ordered option`);
  }
  if (item.itemType === "case_study") {
    if (!item.caseGroupId || !item.caseStep) fail(`#${n} case id`);
    cases[item.caseGroupId] = (cases[item.caseGroupId] || 0) + 1;
    if (!item.options.includes(item.correctAnswer)) fail(`#${n} case key`);
  }
  if (item.itemType === "vignette" && !item.options.includes(item.correctAnswer)) fail(`#${n} key`);
}

if (hard < 180) fail(`difficulty 4-5 is ${hard}, need a majority of at least 180`);
if (ngn < 70) fail(`NGN count ${ngn}`);
for (const [id, count] of Object.entries(cases)) {
  if (count !== 6) fail(`case ${id} has ${count}`);
}
for (const area of ["management-of-care", "safety-infection", "basic-care-comfort"]) {
  if ((byArea[area] || 0) < 40) fail(`${area} too thin`);
}

const inserts = items.map((item) => {
  const envelope = {
    options: item.options,
    clientNeedsCategory: item.clientNeedsCategory,
    blueprintTopic: item.blueprintTopic,
    kind: item.kind || (item.itemType === "vignette" ? "mcq" : item.itemType),
  };
  if (item.itemType === "ngn_bowtie") {
    Object.assign(envelope, {
      kind: "bow_tie",
      condition: item.condition,
      actions: item.actions,
      monitors: item.monitors,
      actionPickCount: 1,
      monitorPickCount: 2,
    });
  }
  if (item.itemType === "ngn_matrix") {
    Object.assign(envelope, {
      kind: "matrix",
      rows: item.rows,
      columns: item.columns,
      rowHeader: "Finding",
    });
  }
  if (item.itemType === "case_study") {
    Object.assign(envelope, {
      kind: "mcq",
      caseGroupId: item.caseGroupId,
      caseStep: item.caseStep,
    });
  }
  if (item.itemType === "ordered_response") envelope.kind = "ordered_response";
  return `INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "blueprintTopic", "clientNeeds", "itemType", "scenario", "question", "options",
  "correctAnswer", "explanation", "tags", "references", "source", "contentHash",
  "generationVersion", "reviewStatus", "active", "qaPassed", "manual_correction",
  "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  ${sql(item.subjectId)},
  ${item.difficulty},
  ${sql(item.subjectId)},
  ${sql(item.subjectId)},
  ${sql(item.blueprintTopic)},
  ${sql(item.clientNeeds)},
  ${sql(item.itemType)},
  ${sql(item.scenario)},
  ${sql(item.question)},
  ${sql(JSON.stringify(envelope))},
  ${sql(item.correctAnswer)},
  ${sql(item.explanation)},
  ${sql(JSON.stringify(["nclex", "NCLEX-RN-2026", item.subjectId, VERSION]))},
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
  "-- Hidden insert: active = false AND qaPassed = false.",
  "BEGIN;",
  ...inserts,
  "ROLLBACK;",
  "",
].join("\n");
if (!dry.trimEnd().endsWith("ROLLBACK;") || /\nCOMMIT;/.test(dry)) fail("dry run shape");

const undo = `-- Narrow undo for this batch only, hidden or later made live.
-- Does not touch any other nursing row.
DELETE FROM "QuestionBankItem"
WHERE "fieldId" = 'nursing'
  AND "generationVersion" = '${VERSION}'
  AND source = 'generated';
`;
const backup = `-- Read-only backup of rows this batch would own. Run before any future write.
COPY (
  SELECT "id", "contentHash", "subjectId", "itemType", "question", active, "qaPassed"
  FROM "QuestionBankItem"
  WHERE "fieldId" = 'nursing'
    AND "generationVersion" = '${VERSION}'
) TO STDOUT WITH CSV HEADER;
`;

writeFileSync(path.join(dir, "insert.rollback-only.sql"), dry);
writeFileSync(path.join(dir, "undo.sql"), undo);
writeFileSync(path.join(dir, "backup.sql"), backup);
writeFileSync(path.join(dir, "summary.json"), JSON.stringify({ count: 300, hard, ngn, byArea, byDiff, byType, version: VERSION }, null, 2));
console.log(JSON.stringify({ count: 300, hard, ngn, byArea, byDiff, byType }));

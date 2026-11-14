/**
 * Build staged USMLE audit-240 artifacts. Does not connect to the database.
 * Reads the local audit export and the checked drafts, then writes:
 *   scripts/stage-usmle-audit240-20261114.sql
 *   scripts/apply-usmle-audit240-20261114.sql
 *   scripts/undo-usmle-audit240-20261114.sql
 *   reports/usmle-audit240-20261114-dryrun.csv
 *   reports/usmle-audit240-20261114-sources.csv
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const live = JSON.parse(readFileSync("/tmp/audit240_items.json", "utf8"));
const brief = JSON.parse(readFileSync("/tmp/audit240_brief.json", "utf8"));
const rewrites = JSON.parse(readFileSync("/tmp/usmle-packets/agent-rewrites.json", "utf8"));
const tagRaw = readFileSync("/tmp/usmle-packets/out-tagrate.json", "utf8");
const tagrate = JSON.parse(tagRaw.slice(tagRaw.indexOf("["), tagRaw.lastIndexOf("]") + 1));
const reader = JSON.parse(readFileSync("/tmp/usmle-packets/reader-diff.json", "utf8"));

const byLive = Object.fromEntries(live.map((row) => [row.id, row]));
const byRewrite = Object.fromEntries(rewrites.map((row) => [row.id, row]));
const byTag = Object.fromEntries(tagrate.map((row) => [row.id, row]));
const byBrief = Object.fromEntries(brief.map((row) => [row.id, row]));

const HIDE = new Set([
  "cmrvm5zrm0024jw04sbmd2efy",
  "cmrrvb5me00031yl8l5tii6p9",
  "cmr9b2enc01au1ywyqmxwu15x",
  "cmru96r8x004q1y0sx6ptfv5t",
  "cmr9buzdm01kf1ywy82opxsb5",
  "cmr4f6dh701pu1yky397pr5qx",
]);

function hashOf(fieldId, subjectId, scenario, question) {
  return createHash("sha256")
    .update(
      `${fieldId}|${subjectId}|${(scenario || "").trim().toLowerCase()}|${question.trim().toLowerCase()}`
    )
    .digest("hex");
}

function mergeOptions(raw, nextOptions, topic, domain) {
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    payload = { options: [] };
  }
  if (Array.isArray(payload)) payload = { options: payload };
  payload.options = nextOptions;
  delete payload.distractorRationale;
  delete payload.clinicalReasoning;
  delete payload.keyTakeaways;
  if (topic) payload.blueprintTopic = topic;
  if (domain) payload.blueprintSystem = domain;
  return JSON.stringify(payload);
}

function dollar(body, tag) {
  let marker = tag;
  while (body.includes(`$${marker}$`)) marker += "x";
  return `$${marker}$${body}$${marker}$`;
}

function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

const staged = [];
const problems = [];

for (const row of brief) {
  const current = byLive[row.id];
  if (!current) {
    problems.push(`${row.id} missing from export`);
    continue;
  }
  const types = [...row.types];
  const drafted =
    reader[row.id] ??
    byRewrite[row.id]?.difficulty ??
    byTag[row.id]?.difficulty ??
    current.difficulty;
  let difficulty = current.difficulty;
  if (reader[row.id] != null) difficulty = reader[row.id];
  else if (current.difficulty == null) difficulty = drafted;
  if (
    current.difficulty != null &&
    difficulty != null &&
    Number(difficulty) > Number(current.difficulty)
  ) {
    difficulty = current.difficulty;
  }

  if (HIDE.has(row.id)) {
    staged.push({
      id: row.id,
      fixTypes: types,
      scenario: current.scenario,
      question: current.question,
      options: current.options,
      correctAnswer: current.correctAnswer,
      explanation: current.explanation,
      difficulty: current.difficulty,
      blueprintDomain: current.blueprintDomain,
      blueprintTopic: current.blueprintTopic,
      references: current.references,
      contentHash: current.contentHash,
      active: false,
      sourceUrl: "",
      sourceLabel: "",
      sourceQuote: "",
      step: current.stepLevel || current.fieldId,
    });
    continue;
  }

  const rewrite = byRewrite[row.id];
  if (types.includes("rewrite")) {
    if (!rewrite) {
      problems.push(`${row.id} rewrite missing`);
      continue;
    }
    if (!rewrite.options.includes(rewrite.correctAnswer)) {
      problems.push(`${row.id} key not in options`);
      continue;
    }
    const refs = [
      {
        label: rewrite.sourceLabel,
        url: rewrite.sourceUrl,
      },
    ];
    staged.push({
      id: row.id,
      fixTypes: types,
      scenario: rewrite.scenario,
      question: rewrite.question,
      options: mergeOptions(
        current.options,
        rewrite.options,
        rewrite.blueprintTopic,
        rewrite.blueprintDomain
      ),
      correctAnswer: rewrite.correctAnswer,
      explanation: rewrite.explanation,
      difficulty,
      blueprintDomain: rewrite.blueprintDomain,
      blueprintTopic: rewrite.blueprintTopic,
      references: refs,
      contentHash: hashOf(
        current.fieldId,
        current.subjectId,
        rewrite.scenario,
        rewrite.question
      ),
      active: true,
      sourceUrl: rewrite.sourceUrl,
      sourceLabel: rewrite.sourceLabel,
      sourceQuote: rewrite.sourceQuote,
      step: current.stepLevel || current.fieldId,
    });
    continue;
  }

  const tag = byTag[row.id];
  staged.push({
    id: row.id,
    fixTypes: types,
    scenario: current.scenario,
    question: current.question,
    options: current.options,
    correctAnswer: current.correctAnswer,
    explanation: current.explanation,
    difficulty,
    blueprintDomain: tag?.blueprintDomain ?? current.blueprintDomain,
    blueprintTopic: tag?.blueprintTopic ?? current.blueprintTopic,
    references: current.references,
    contentHash: current.contentHash,
    active: true,
    sourceUrl: "",
    sourceLabel: "",
    sourceQuote: "",
    step: current.stepLevel || current.fieldId,
  });
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
if (staged.length !== 236) {
  console.error(`expected 236 staged rows, got ${staged.length}`);
  process.exit(1);
}

const hashes = new Map();
for (const row of staged) {
  if (hashes.has(row.contentHash) && hashes.get(row.contentHash) !== row.id) {
    console.error(`hash collision ${row.id} ${hashes.get(row.contentHash)}`);
    process.exit(1);
  }
  hashes.set(row.contentHash, row.id);
}

const ids = staged.map((row) => row.id);
const idList = ids.map((id) => `    '${id}'`).join(",\n");
const expected = staged.length;

function generationMetaSql() {
  return `CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END`;
}

const stageInserts = staged
  .map((row, index) => {
    const refs =
      row.references == null
        ? "NULL"
        : `${dollar(JSON.stringify(row.references), `ref${index}`)}::jsonb`;
    return `INSERT INTO qbi_usmle_audit240_20261114_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, source_url, source_label,
  source_quote, content_hash, active, "references"
) VALUES (
  ${dollar(row.id, `id${index}`)},
  ${dollar(row.fixTypes.join("|"), `fx${index}`)},
  ${row.scenario == null ? "NULL" : dollar(row.scenario, `sc${index}`)},
  ${dollar(row.question, `qu${index}`)},
  ${dollar(row.options, `op${index}`)},
  ${dollar(row.correctAnswer, `ky${index}`)},
  ${dollar(row.explanation, `ex${index}`)},
  ${row.difficulty == null ? "NULL" : Number(row.difficulty)},
  ${row.blueprintDomain == null ? "NULL" : dollar(row.blueprintDomain, `dm${index}`)},
  ${row.blueprintTopic == null ? "NULL" : dollar(row.blueprintTopic, `tp${index}`)},
  ${row.sourceUrl ? dollar(row.sourceUrl, `su${index}`) : "NULL"},
  ${row.sourceLabel ? dollar(row.sourceLabel, `sl${index}`) : "NULL"},
  ${row.sourceQuote ? dollar(row.sourceQuote, `sq${index}`) : "NULL"},
  ${dollar(row.contentHash, `ch${index}`)},
  ${row.active ? "true" : "false"},
  ${refs}
);`;
  })
  .join("\n");

const stageSql = `-- Stage the USMLE 240-item audit. Creates a backup of the current rows and a
-- staging table of the proposed values. Does not update "QuestionBankItem".
-- ${expected} served items.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/stage-usmle-audit240-20261114.sql
BEGIN;
-- Safe to re-run only before apply. Re-running after apply would replace the
-- undo snapshot with the already-updated rows.
DROP TABLE IF EXISTS qbi_usmle_audit240_20261114_stage;
DROP TABLE IF EXISTS qbi_usmle_audit240_20261114_backup;
CREATE TABLE qbi_usmle_audit240_20261114_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
${idList}
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup) <> ${expected} THEN
    RAISE EXCEPTION 'backup row count %, expected ${expected}',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup);
  END IF;
END
$check$;
CREATE TABLE qbi_usmle_audit240_20261114_stage (
  id text PRIMARY KEY,
  fix_types text NOT NULL,
  scenario text,
  question text NOT NULL,
  options text NOT NULL,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  difficulty smallint,
  blueprint_domain text,
  blueprint_topic text,
  source_url text,
  source_label text,
  source_quote text,
  content_hash text NOT NULL,
  active boolean NOT NULL,
  "references" jsonb
);
${stageInserts}
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_stage) <> ${expected} THEN
    RAISE EXCEPTION 'stage row count %, expected ${expected}',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_stage);
  END IF;
END
$check$;
COMMIT;
`;

const applySql = `-- Apply the staged USMLE 240-item audit to live "QuestionBankItem" rows.
-- Run scripts/stage-usmle-audit240-20261114.sql first.
-- Refuses to write if a live row no longer matches the backup snapshot.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/apply-usmle-audit240-20261114.sql
-- Undo:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-audit240-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_audit240_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_audit240_20261114_backup is missing';
  END IF;
  IF to_regclass('public.qbi_usmle_audit240_20261114_stage') IS NULL THEN
    RAISE EXCEPTION 'staging table qbi_usmle_audit240_20261114_stage is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup) <> ${expected} THEN
    RAISE EXCEPTION 'backup row count %, expected ${expected}',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup);
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_stage) <> ${expected} THEN
    RAISE EXCEPTION 'stage row count %, expected ${expected}',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_stage);
  END IF;
  IF EXISTS (
    SELECT 1
    FROM qbi_usmle_audit240_20261114_backup AS b
    JOIN "QuestionBankItem" AS q ON q.id = b.id
    WHERE q."contentHash" IS DISTINCT FROM b."contentHash"
  ) THEN
    RAISE EXCEPTION 'a live row changed after the backup snapshot; apply aborted';
  END IF;
END
$check$;
DO $apply$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET
    scenario = s.scenario,
    question = s.question,
    options = s.options,
    "correctAnswer" = s.correct_answer,
    explanation = s.explanation,
    difficulty = s.difficulty,
    "blueprintDomain" = s.blueprint_domain,
    "blueprintTopic" = s.blueprint_topic,
    "references" = s."references",
    "contentHash" = s.content_hash,
    active = s.active,
    manual_correction = true,
    "generationMeta" = ${generationMetaSql().replaceAll('"generationMeta"', 'q."generationMeta"')},
    "updatedAt" = NOW()
  FROM qbi_usmle_audit240_20261114_stage AS s
  WHERE q.id = s.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> ${expected} THEN
    RAISE EXCEPTION 'apply updated % rows, expected ${expected}', n;
  END IF;
END
$apply$;
COMMIT;
`;

const undoSql = `-- Undo the USMLE 240-item audit. Restores ${expected} rows from
-- qbi_usmle_audit240_20261114_backup.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-audit240-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_audit240_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_usmle_audit240_20261114_backup is missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup) <> ${expected} THEN
    RAISE EXCEPTION 'backup row count %, expected ${expected}',
      (SELECT COUNT(*) FROM qbi_usmle_audit240_20261114_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET
    scenario = b.scenario,
    question = b.question,
    options = b.options,
    "correctAnswer" = b."correctAnswer",
    explanation = b.explanation,
    difficulty = b.difficulty,
    "blueprintDomain" = b."blueprintDomain",
    "blueprintTopic" = b."blueprintTopic",
    "references" = b."references",
    "contentHash" = b."contentHash",
    active = b.active,
    manual_correction = b.manual_correction,
    "generationMeta" = b."generationMeta",
    "updatedAt" = b."updatedAt"
  FROM qbi_usmle_audit240_20261114_backup AS b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> ${expected} THEN
    RAISE EXCEPTION 'undo updated % rows, expected ${expected}', n;
  END IF;
END
$restore$;
COMMIT;
`;

const header = [
  "id",
  "step",
  "fix_types",
  "difficulty_before",
  "difficulty_after",
  "domain_before",
  "domain_after",
  "topic_before",
  "topic_after",
  "active_after",
  "correct_answer_before",
  "correct_answer_after",
  "source_url",
].join(",");
const dryLines = [header];
const sourceLines = ["id,source_url,source_label,source_quote"];
const counts = {};
for (const row of staged) {
  for (const type of row.fixTypes) counts[type] = (counts[type] || 0) + 1;
  const current = byLive[row.id];
  dryLines.push(
    [
      row.id,
      row.step,
      row.fixTypes.join("|"),
      current.difficulty ?? "",
      row.difficulty ?? "",
      current.blueprintDomain ?? "",
      row.blueprintDomain ?? "",
      current.blueprintTopic ?? "",
      row.blueprintTopic ?? "",
      row.active,
      current.correctAnswer,
      row.correctAnswer,
      row.sourceUrl,
    ]
      .map(csvEscape)
      .join(",")
  );
  if (row.sourceUrl) {
    sourceLines.push(
      [row.id, row.sourceUrl, row.sourceLabel, row.sourceQuote].map(csvEscape).join(",")
    );
  }
}

writeFileSync("/agent/repos/any-exam-eas/scripts/stage-usmle-audit240-20261114.sql", stageSql);
writeFileSync("/agent/repos/any-exam-eas/scripts/apply-usmle-audit240-20261114.sql", applySql);
writeFileSync("/agent/repos/any-exam-eas/scripts/undo-usmle-audit240-20261114.sql", undoSql);
writeFileSync(
  "/agent/repos/any-exam-eas/reports/usmle-audit240-20261114-dryrun.csv",
  `${dryLines.join("\n")}\n`
);
writeFileSync(
  "/agent/repos/any-exam-eas/reports/usmle-audit240-20261114-sources.csv",
  `${sourceLines.join("\n")}\n`
);

const rewritten = staged.filter((row) => row.fixTypes.includes("rewrite"));
const lowered = staged.filter((row) => {
  const before = byLive[row.id].difficulty;
  return before != null && row.difficulty != null && row.difficulty < before;
});
console.log(
  JSON.stringify(
    {
      staged: staged.length,
      counts,
      rewritesWithSource: rewritten.filter((row) => row.sourceUrl).length,
      difficultyLowered: lowered.length,
      hidden: staged.filter((row) => !row.active).length,
    },
    null,
    2
  )
);

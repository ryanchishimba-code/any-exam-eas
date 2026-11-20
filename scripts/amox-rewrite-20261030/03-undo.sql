-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- NAPLEX item cmsg08i5x00021yiylzrl0zhf. Ryan approved the amoxicillin rewrite at 9:13 PM CT on 2026-10-30.
-- Changes the vignette, lead-in, options, key, rationale, citations, and difficulty.
-- Sets qaPassed = true, active = true, and manual_correction = true.
-- contentHash is sha256(fieldId|subjectId|lower(trim(scenario))|lower(trim(question))),
-- the same formula as bankItemContentHash in src/lib/sync-question-bank-guard.ts.
-- Does not edit application code. Does not drop the backup table.
-- Restore the pre-rewrite row from qbi_amox_rewrite_20261030_backup.
-- Does not drop the backup table and does not delete QuestionBankItem rows.
-- Aborts unless the backup has 1 row and the restore matches 1 row.
-- Run only to undo the 2026-10-30 amoxicillin rewrite:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/amox-rewrite-20261030/03-undo.sql

BEGIN;
DO $do$
DECLARE
  n int;
BEGIN
  IF to_regclass('public.qbi_amox_rewrite_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_amox_rewrite_20261030_backup does not exist';
  END IF;
  IF (SELECT count(*) FROM qbi_amox_rewrite_20261030_backup) <> 1
     OR (SELECT count(*) FROM qbi_amox_rewrite_20261030_backup WHERE id = 'cmsg08i5x00021yiylzrl0zhf' AND "fieldId" = 'pharmacy') <> 1 THEN
    RAISE EXCEPTION 'backup is not exactly the 1 pharmacy row';
  END IF;

  UPDATE "QuestionBankItem" AS q
  SET
    "fieldId" = b."fieldId",
    "subjectId" = b."subjectId",
    "question" = b."question",
    "options" = b."options",
    "correctAnswer" = b."correctAnswer",
    "explanation" = b."explanation",
    "solutionSteps" = b."solutionSteps",
    "tags" = b."tags",
    "source" = b."source",
    "contentHash" = b."contentHash",
    "active" = b."active",
    "createdAt" = b."createdAt",
    "updatedAt" = b."updatedAt",
    "stateCode" = b."stateCode",
    "difficulty" = b."difficulty",
    "topicCategory" = b."topicCategory",
    "blueprintDomain" = b."blueprintDomain",
    "itemType" = b."itemType",
    "references" = b."references",
    "scenario" = b."scenario",
    "stepLevel" = b."stepLevel",
    "qaPassed" = b."qaPassed",
    "qaAuditedAt" = b."qaAuditedAt",
    "taskCategory" = b."taskCategory",
    "blueprintTopic" = b."blueprintTopic",
    "generationVersion" = b."generationVersion",
    "reviewStatus" = b."reviewStatus",
    "lastReviewedAt" = b."lastReviewedAt",
    "generationMeta" = b."generationMeta",
    "patientAgeGroup" = b."patientAgeGroup",
    "embedding" = b."embedding",
    "quality_score" = b."quality_score",
    "cluster_id" = b."cluster_id",
    "keep_recommendation" = b."keep_recommendation",
    "review_flag" = b."review_flag",
    "curation_meta" = b."curation_meta",
    "clientNeeds" = b."clientNeeds",
    "cjmmFunction" = b."cjmmFunction",
    "manual_correction" = b."manual_correction"
  FROM qbi_amox_rewrite_20261030_backup AS b
  WHERE q.id = b.id
    AND q.id = 'cmsg08i5x00021yiylzrl0zhf'
    AND b."fieldId" = 'pharmacy';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'matched row count %, expected 1', n;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM "QuestionBankItem" AS q
    JOIN qbi_amox_rewrite_20261030_backup AS b ON b.id = q.id
    WHERE q."contentHash" IS DISTINCT FROM b."contentHash"
       OR q.question IS DISTINCT FROM b.question
       OR q.scenario IS DISTINCT FROM b.scenario
       OR q.options IS DISTINCT FROM b.options
       OR q."correctAnswer" IS DISTINCT FROM b."correctAnswer"
       OR q.explanation IS DISTINCT FROM b.explanation
       OR q."references" IS DISTINCT FROM b."references"
       OR q.difficulty IS DISTINCT FROM b.difficulty
       OR q.active IS DISTINCT FROM b.active
       OR q."qaPassed" IS DISTINCT FROM b."qaPassed"
       OR q.manual_correction IS DISTINCT FROM b.manual_correction
       OR q."generationMeta" IS DISTINCT FROM b."generationMeta"
  ) THEN
    RAISE EXCEPTION 'undo left the amoxicillin row different from the backup';
  END IF;
  RAISE NOTICE 'amox undo row count %', n;
END
$do$;
COMMIT;

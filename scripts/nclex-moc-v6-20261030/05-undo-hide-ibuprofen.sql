-- 05-undo-hide-ibuprofen.sql
-- NCLEX Management of Care pilot v6, built 2026-10-30. Prepared only. Not RN-reviewed.
-- This file COMMITs when nclex.moc_v6_apply is set to 1.
-- Do not set that until a licensed RN has reviewed the package.
-- Target table: "QuestionBankItem". Field: nursing.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql. This package has no such file.
-- Backup tables: qbi_nclex_moc_v6_insert_20261030, qbi_nclex_item5_v6_rewrite_20261030, qbi_nclex_item5_ibu_hide_20261030, qbi_nclex_moc_v6_activate_20261030.

BEGIN;
DO $guard$
BEGIN
  IF current_setting('nclex.moc_v6_apply', true) IS DISTINCT FROM '1' THEN
    RAISE EXCEPTION '05-undo-hide-ibuprofen.sql: refusing to apply. Held until RN review. After that review, SET nclex.moc_v6_apply = ''1'' and run this file in one session.';
  END IF;
END
$guard$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_item5_ibu_hide_20261030') IS NULL THEN
    RAISE EXCEPTION 'hide undo requires qbi_nclex_item5_ibu_hide_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_ibu_hide_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'undo hide backup: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
  "fieldId" = b."fieldId",
  "subjectId" = b."subjectId",
  "stateCode" = b."stateCode",
  "difficulty" = b."difficulty",
  "topicCategory" = b."topicCategory",
  "blueprintDomain" = b."blueprintDomain",
  "taskCategory" = b."taskCategory",
  "blueprintTopic" = b."blueprintTopic",
  "clientNeeds" = b."clientNeeds",
  "cjmmFunction" = b."cjmmFunction",
  "generationVersion" = b."generationVersion",
  "reviewStatus" = b."reviewStatus",
  "lastReviewedAt" = b."lastReviewedAt",
  "generationMeta" = b."generationMeta",
  "itemType" = b."itemType",
  "stepLevel" = b."stepLevel",
  "patientAgeGroup" = b."patientAgeGroup",
  "scenario" = b."scenario",
  "question" = b."question",
  "options" = b."options",
  "correctAnswer" = b."correctAnswer",
  "explanation" = b."explanation",
  "solutionSteps" = b."solutionSteps",
  "tags" = b."tags",
  "references" = b."references",
  "source" = b."source",
  "contentHash" = b."contentHash",
  "active" = b."active",
  "manual_correction" = b."manual_correction",
  "qaPassed" = b."qaPassed",
  "qaAuditedAt" = b."qaAuditedAt",
  "embedding" = b."embedding",
  "quality_score" = b."quality_score",
  "cluster_id" = b."cluster_id",
  "keep_recommendation" = b."keep_recommendation",
  "review_flag" = b."review_flag",
  "curation_meta" = b."curation_meta",
  "createdAt" = b."createdAt",
  "updatedAt" = b."updatedAt"
  FROM qbi_nclex_item5_ibu_hide_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'undo ibuprofen hide expected 1 row, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN qbi_nclex_item5_ibu_hide_20261030 b ON b.id = q.id
WHERE q.active = b.active
  AND q."qaPassed" = b."qaPassed"
  AND q."contentHash" = b."contentHash"
  AND q."correctAnswer" = b."correctAnswer"
  AND q.manual_correction = b.manual_correction)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'ibuprofen restored: expected 1, found %', n;
  END IF;
END
$check$;


COMMIT;

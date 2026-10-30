-- 04-undo-insert.sql
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
    RAISE EXCEPTION '04-undo-insert.sql: refusing to apply. Held until RN review. After that review, SET nclex.moc_v6_apply = ''1'' and run this file in one session.';
  END IF;
END
$guard$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_v6_insert_20261030') IS NULL OR to_regclass('public.qbi_nclex_item5_v6_rewrite_20261030') IS NULL THEN
    RAISE EXCEPTION 'insert undo requires qbi_nclex_moc_v6_insert_20261030 and qbi_nclex_item5_v6_rewrite_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_insert_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'undo insert backup: expected 60, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_v6_rewrite_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 6 THEN
    RAISE EXCEPTION 'undo rewrite backup: expected 6, found %', n;
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
  FROM qbi_nclex_item5_v6_rewrite_20261030 b
  WHERE q.id = b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 6 THEN
    RAISE EXCEPTION 'undo rewrites expected 6 rows, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN qbi_nclex_item5_v6_rewrite_20261030 b ON b.id = q.id
WHERE q."contentHash" = b."contentHash"
  AND q."subjectId" = b."subjectId"
  AND q.question = b.question
  AND q.scenario IS NOT DISTINCT FROM b.scenario
  AND q."correctAnswer" = b."correctAnswer"
  AND q.active = b.active
  AND q."qaPassed" = b."qaPassed")::integer INTO n;
  IF n IS DISTINCT FROM 6 THEN
    RAISE EXCEPTION 'rewrites restored: expected 6, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  DELETE FROM "QuestionBankItem" q
  USING qbi_nclex_moc_v6_insert_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = false
    AND q."qaPassed" = false
    AND q.active IS NOT DISTINCT FROM b.active
    AND q."qaPassed" IS NOT DISTINCT FROM b."qaPassed";
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 60 THEN
    RAISE EXCEPTION 'undo pilot insert expected to delete 60 held rows, found %. Undo activation first if the pilot was published.', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE id IN (SELECT id FROM qbi_nclex_moc_v6_insert_20261030))::integer INTO n;
  IF n IS DISTINCT FROM 0 THEN
    RAISE EXCEPTION 'pilot rows removed: expected 0, found %', n;
  END IF;
END
$check$;


COMMIT;

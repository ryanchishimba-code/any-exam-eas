-- Restore every column except id from public.qbi_naplex_p1_20261030_backup.
-- Undo later packages first when a row is in more than one backup: p4, p3, p2, p1.
-- This script does not drop the backup table.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '15min';
SET LOCAL lock_timeout = '120s';
DO $undo$
DECLARE n int;
BEGIN
  IF current_database() <> 'anyexameasy' THEN
    RAISE EXCEPTION 'p1 undo abort: connected to %', current_database();
  END IF;
  IF to_regclass('public.qbi_naplex_p1_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'p1 undo abort: public.qbi_naplex_p1_20261030_backup is missing';
  END IF;
  SELECT count(*) INTO n FROM public.qbi_naplex_p1_20261030_backup;
  IF n <> 25 THEN
    RAISE EXCEPTION 'p1 undo abort: backup rows % <> 25', n;
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.qbi_naplex_p1_20261030_backup WHERE "fieldId" IS DISTINCT FROM 'pharmacy'
  ) THEN
    RAISE EXCEPTION 'p1 undo abort: backup has a non-pharmacy row';
  END IF;

  UPDATE "QuestionBankItem" q
  SET "fieldId" = b."fieldId",
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
  FROM public.qbi_naplex_p1_20261030_backup b
  WHERE q.id = b.id;

  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 25 THEN
    RAISE EXCEPTION 'p1 undo abort: restored % rows, expected 25', n;
  END IF;
END
$undo$;
COMMIT;
SELECT 'p1 undo' AS step, count(*) AS restored
FROM public.qbi_naplex_p1_20261030_backup;

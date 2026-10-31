-- Restore the 4 rows from qbi_rescore_rewrites4_20261030_backup.
-- Project lively-silence-56893462, database anyexameasy.
-- Copies every column except id. Does not drop the backup table.

DO $guard$
BEGIN
  IF to_regclass('public.qbi_rescore_rewrites4_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_rescore_rewrites4_20261030_backup is missing';
  END IF;
  IF (SELECT count(*) FROM qbi_rescore_rewrites4_20261030_backup) <> 4 THEN
    RAISE EXCEPTION 'backup table does not hold 4 rows';
  END IF;
  IF (
    SELECT count(*)
    FROM qbi_rescore_rewrites4_20261030_backup
    WHERE id IN ('cmr7h3bb700271yx3ujnp5ov1', 'cmr770g4d00ua1ywuerwp5c23', 'cmshj9yog002g1yorbkxdjnpd', 'cmr4bs38g00151ycjtidtao40')
  ) <> 4 THEN
    RAISE EXCEPTION 'backup ids are not the approved 4';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM qbi_rescore_rewrites4_20261030_backup AS b
    JOIN "QuestionBankItem" AS q
      ON q."contentHash" = b."contentHash"
     AND q.id <> b.id
  ) THEN
    RAISE EXCEPTION 'restoring a contentHash would collide with another row';
  END IF;
END
$guard$;

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
FROM qbi_rescore_rewrites4_20261030_backup AS b
WHERE q.id = b.id
  AND q.id IN ('cmr7h3bb700271yx3ujnp5ov1', 'cmr770g4d00ua1ywuerwp5c23', 'cmshj9yog002g1yorbkxdjnpd', 'cmr4bs38g00151ycjtidtao40');

DO $guard$
BEGIN
  IF (
    SELECT count(*)
    FROM "QuestionBankItem" AS q
    JOIN qbi_rescore_rewrites4_20261030_backup AS b ON b.id = q.id
    WHERE q.id IN ('cmr7h3bb700271yx3ujnp5ov1', 'cmr770g4d00ua1ywuerwp5c23', 'cmshj9yog002g1yorbkxdjnpd', 'cmr4bs38g00151ycjtidtao40')
      AND q."contentHash" = b."contentHash"
      AND q.question = b.question
      AND q."correctAnswer" = b."correctAnswer"
      AND q.active = b.active
      AND q."qaPassed" = b."qaPassed"
      AND q.scenario IS NOT DISTINCT FROM b.scenario
      AND q.options = b.options
      AND q.explanation = b.explanation
      AND q."references" IS NOT DISTINCT FROM b."references"
      AND q.difficulty IS NOT DISTINCT FROM b.difficulty
      AND q."generationMeta" IS NOT DISTINCT FROM b."generationMeta"
      AND q.manual_correction = b.manual_correction
  ) <> 4 THEN
    RAISE EXCEPTION 'undo verification failed';
  END IF;
END
$guard$;

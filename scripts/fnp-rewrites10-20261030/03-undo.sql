-- Restore the 10 FNP rows from qbi_fnp_rewrites10_20261030_backup.
-- Project lively-silence-56893462, database anyexameasy.
-- Copies every column except id. Does not DROP the backup table.

DO $$
DECLARE
  n integer;
  fnp integer;
BEGIN
  IF to_regclass('public.qbi_fnp_rewrites10_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_fnp_rewrites10_20261030_backup is missing';
  END IF;
  SELECT COUNT(*)::int,
         COUNT(*) FILTER (WHERE "fieldId" = 'aanp-fnp')::int
    INTO n, fnp
  FROM qbi_fnp_rewrites10_20261030_backup;
  IF n <> 10 OR fnp <> 10 THEN
    RAISE EXCEPTION 'backup expected exactly 10 FNP rows, found % (% FNP)', n, fnp;
  END IF;
END $$;

UPDATE "QuestionBankItem" AS q
SET
  "fieldId" = b."fieldId",
  "subjectId" = b."subjectId",
  question = b.question,
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  "solutionSteps" = b."solutionSteps",
  tags = b.tags,
  source = b.source,
  "contentHash" = b."contentHash",
  active = b.active,
  "createdAt" = b."createdAt",
  "updatedAt" = b."updatedAt",
  "stateCode" = b."stateCode",
  difficulty = b.difficulty,
  "topicCategory" = b."topicCategory",
  "blueprintDomain" = b."blueprintDomain",
  "itemType" = b."itemType",
  references = b.references,
  scenario = b.scenario,
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
  embedding = b.embedding,
  quality_score = b.quality_score,
  cluster_id = b.cluster_id,
  keep_recommendation = b.keep_recommendation,
  review_flag = b.review_flag,
  curation_meta = b.curation_meta,
  "clientNeeds" = b."clientNeeds",
  "cjmmFunction" = b."cjmmFunction",
  manual_correction = b.manual_correction
FROM qbi_fnp_rewrites10_20261030_backup AS b
WHERE q.id = b.id
  AND q."fieldId" = 'aanp-fnp'
  AND b."fieldId" = 'aanp-fnp';

DO $$
DECLARE
  n integer;
BEGIN
  SELECT COUNT(*)::int INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_fnp_rewrites10_20261030_backup b ON b.id = q.id
  WHERE q.question = b.question
    AND q."correctAnswer" = b."correctAnswer"
    AND q.explanation = b.explanation
    AND q.options = b.options
    AND q.scenario IS NOT DISTINCT FROM b.scenario
    AND q."references" IS NOT DISTINCT FROM b."references"
    AND q.difficulty IS NOT DISTINCT FROM b.difficulty
    AND q.active IS NOT DISTINCT FROM b.active
    AND q."qaPassed" IS NOT DISTINCT FROM b."qaPassed"
    AND q."itemType" = b."itemType"
    AND q.manual_correction IS NOT DISTINCT FROM b.manual_correction;
  IF n <> 10 THEN
    RAISE EXCEPTION 'undo restored % of 10 rows', n;
  END IF;
END $$;

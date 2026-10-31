-- Restore the 13 rows from qbi_nclex_fixes13_20261030_backup.
-- Copies every column except id. Does not drop the backup table.
DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_fixes13_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table is missing';
  END IF;
  IF (SELECT count(*) FROM qbi_nclex_fixes13_20261030_backup) <> 13 THEN
    RAISE EXCEPTION 'backup table does not hold 13 rows';
  END IF;
  IF (
    SELECT count(*)
    FROM qbi_nclex_fixes13_20261030_backup
    WHERE id IN ('cmrmu08cb00fx1y3jc9rsnelz', 'cmroe7xjf00061ybznd77tf3j', 'cmr8ufrug009r1y0yy7zwc3fz', 'cmr74f8qx004b1ywujjp4k4ak', 'cmra5zpf600231ylwahnk5q4e', 'cmr7e70og002j1y9txjux05cj', 'cmqwues7900001y1sda6lynv6', 'cmr7gipdt00b41y59f9fm1kfb', 'cmr0xdqyg00071ybsvb4sqisw', 'cmrlxlbxn00041yci85r3kb95', 'cmqx0b7wx000h1y1klag1mky3', 'cmr0ufrka00251y7owlq2oh3d', 'cmr0pfqyf004q1yhdgfkg2m1u')
  ) <> 13 THEN
    RAISE EXCEPTION 'backup ids are not the approved 13';
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
FROM qbi_nclex_fixes13_20261030_backup AS b
WHERE q.id = b.id
  AND q.id IN ('cmrmu08cb00fx1y3jc9rsnelz', 'cmroe7xjf00061ybznd77tf3j', 'cmr8ufrug009r1y0yy7zwc3fz', 'cmr74f8qx004b1ywujjp4k4ak', 'cmra5zpf600231ylwahnk5q4e', 'cmr7e70og002j1y9txjux05cj', 'cmqwues7900001y1sda6lynv6', 'cmr7gipdt00b41y59f9fm1kfb', 'cmr0xdqyg00071ybsvb4sqisw', 'cmrlxlbxn00041yci85r3kb95', 'cmqx0b7wx000h1y1klag1mky3', 'cmr0ufrka00251y7owlq2oh3d', 'cmr0pfqyf004q1yhdgfkg2m1u')
  AND b."fieldId" = 'nursing';

DO $guard$
BEGIN
  IF (
    SELECT count(*)
    FROM "QuestionBankItem" AS q
    JOIN qbi_nclex_fixes13_20261030_backup AS b ON b.id = q.id
    WHERE q.id IN ('cmrmu08cb00fx1y3jc9rsnelz', 'cmroe7xjf00061ybznd77tf3j', 'cmr8ufrug009r1y0yy7zwc3fz', 'cmr74f8qx004b1ywujjp4k4ak', 'cmra5zpf600231ylwahnk5q4e', 'cmr7e70og002j1y9txjux05cj', 'cmqwues7900001y1sda6lynv6', 'cmr7gipdt00b41y59f9fm1kfb', 'cmr0xdqyg00071ybsvb4sqisw', 'cmrlxlbxn00041yci85r3kb95', 'cmqx0b7wx000h1y1klag1mky3', 'cmr0ufrka00251y7owlq2oh3d', 'cmr0pfqyf004q1yhdgfkg2m1u')
      AND q."contentHash" = b."contentHash"
      AND q.question = b.question
      AND q."correctAnswer" = b."correctAnswer"
      AND q.active = b.active
      AND q."qaPassed" = b."qaPassed"
      AND q.scenario IS NOT DISTINCT FROM b.scenario
      AND q.options = b.options
      AND q.explanation = b.explanation
  ) <> 13 THEN
    RAISE EXCEPTION 'undo verification failed';
  END IF;
END
$guard$;

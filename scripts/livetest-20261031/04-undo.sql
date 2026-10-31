-- AnyExamEasy live-test batch, 2026-10-31. Ryan approved.
-- Project lively-silence-56893462, branch br-super-frog-apuqj2ol, database anyexameasy.
-- Table QuestionBankItem. Backup table qbi_livetest_20261031_backup.
-- Restore the 57 backed-up rows. Does not drop qbi_livetest_20261031_backup.
-- Run only to reverse 03-apply.sql.
\set ON_ERROR_STOP on
BEGIN;
DO $guard$
BEGIN
  IF to_regclass('public.qbi_livetest_20261031_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table is missing';
  END IF;
  IF (SELECT count(*) FROM qbi_livetest_20261031_backup) <> 57 THEN
    RAISE EXCEPTION 'backup table does not hold 57 rows';
  END IF;
  IF (SELECT count(*) FROM qbi_livetest_20261031_backup WHERE id IN ('cmqgdhy9i000r1yr83kaqdiry', 'cmvojjlf6003rr6jsdhpk1vsj', 'cmvoj524a005dcpjs68czfw05', 'cmvojjmta004jr6js87tweu0a', 'cmqgdhw0r00051yr8ap2l03oh', 'cmqgdhyu6000x1yr8ihh5gojy', 'cmvojjnlw004zr6js19gyfevn', 'cmvoj4y430033cpjsfiucah1n', 'cmvojjn7m004rr6jsau991q20', 'cmr1bhc7u001w1yrm8x555dz2', 'cfbl6ltxuhfjshqtzu4dpxvsp', 'cmr1bh93800131yrmbvpwooyu', 'cmr1d6mdo00091ydf0iphrjx8', 'cmr1d6pkz000q1ydfzvtu4ov0', 'clb0aayuped51hvmqx2oqiz4k', 'cmr1d6o6u000j1ydfsqfgktmi', 'cmpnjmgq00pau1ymxrslc23w3', 'cmr1d85ib00841ydftjeqahp2', 'cmr4gtg6l000hib041slzjpaq', 'cmr1bh58l000h1yrmu2fwj93q', 'cmr1bhdca00281yrm82ttrs4u', 'cmvnxagq60003jsv9rgtnk2ok', 'cmr1d6s4400121ydfh2r6ym2b', 'cmrlfocxi00111yol1pzdgd5p', 'cmrlfmnsh000j1yol7pm4qtgi', 'cmqvkly9c00151ywrvfp8qvl3', 'cmrlepwry00041y7z4h4efspk', 'cmqvkc3fv001k1ym3q7tck9k7', 'cmqgt76ks001f1y3qc9qfckk0', 'cmqvl75r2000x1yr0108e444p', 'cmqvja7ad000f1yxkbl9ye3me', 'cmrlfniy5000r1yoliqyinvbf', 'cmqgt78nl00201y3q7un0kg62', 'cmqvlh318000q1y74ogtsuzi6', 'cmqvjac35001t1yxkz9lair5a', 'cmrlfocui00101yol639muz01', 'cmrlflg1a00001yoln7ppitk3', 'cmrlfm33c000c1yol3s268ecu', 'cmqvjaa9y001a1yxk57qa8hqz', 'cmqvjablt001o1yxk5helihk2', 'cmqgs047g000s1yi4y6zud24q', 'cmqgryjm7000e1yi4el1tph1o', 'cmqgs7lx200211yi4kbh8kbmw', 'cmqgmcqup00081ywqb139igc4', 'cmqgrwjrz00051yi4pppg3ag4', 'cmtwey4oc000u1y2nqwhna1ez', 'cmtwey57200101y2nnjgj6zij', 'cmqgmjnpo000h1ywqsoivj4oi', 'cmtwf3zta000p1yfsk84jgb3j', 'cmqgsaii9002i1yi4uk5mn2yd', 'cmqgrwji100041yi4rl4f7ef0', 'cmqgnohd0001n1ywq9892y58l', 'cmqgmpm1u000c1y8q6ayncaz2', 'cmqgrx0kr00071yi4y9r0foui', 'cmqgs9gtw002b1yi4ftnt7g5i', 'cmqgdxps800081y26lvxlma1t', 'cmvnxagpu0001jsv90u57yw7a')) <> 57 THEN
    RAISE EXCEPTION 'backup ids are not the approved 57';
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
FROM qbi_livetest_20261031_backup AS b
WHERE q.id = b.id
  AND q.id IN ('cmqgdhy9i000r1yr83kaqdiry', 'cmvojjlf6003rr6jsdhpk1vsj', 'cmvoj524a005dcpjs68czfw05', 'cmvojjmta004jr6js87tweu0a', 'cmqgdhw0r00051yr8ap2l03oh', 'cmqgdhyu6000x1yr8ihh5gojy', 'cmvojjnlw004zr6js19gyfevn', 'cmvoj4y430033cpjsfiucah1n', 'cmvojjn7m004rr6jsau991q20', 'cmr1bhc7u001w1yrm8x555dz2', 'cfbl6ltxuhfjshqtzu4dpxvsp', 'cmr1bh93800131yrmbvpwooyu', 'cmr1d6mdo00091ydf0iphrjx8', 'cmr1d6pkz000q1ydfzvtu4ov0', 'clb0aayuped51hvmqx2oqiz4k', 'cmr1d6o6u000j1ydfsqfgktmi', 'cmpnjmgq00pau1ymxrslc23w3', 'cmr1d85ib00841ydftjeqahp2', 'cmr4gtg6l000hib041slzjpaq', 'cmr1bh58l000h1yrmu2fwj93q', 'cmr1bhdca00281yrm82ttrs4u', 'cmvnxagq60003jsv9rgtnk2ok', 'cmr1d6s4400121ydfh2r6ym2b', 'cmrlfocxi00111yol1pzdgd5p', 'cmrlfmnsh000j1yol7pm4qtgi', 'cmqvkly9c00151ywrvfp8qvl3', 'cmrlepwry00041y7z4h4efspk', 'cmqvkc3fv001k1ym3q7tck9k7', 'cmqgt76ks001f1y3qc9qfckk0', 'cmqvl75r2000x1yr0108e444p', 'cmqvja7ad000f1yxkbl9ye3me', 'cmrlfniy5000r1yoliqyinvbf', 'cmqgt78nl00201y3q7un0kg62', 'cmqvlh318000q1y74ogtsuzi6', 'cmqvjac35001t1yxkz9lair5a', 'cmrlfocui00101yol639muz01', 'cmrlflg1a00001yoln7ppitk3', 'cmrlfm33c000c1yol3s268ecu', 'cmqvjaa9y001a1yxk57qa8hqz', 'cmqvjablt001o1yxk5helihk2', 'cmqgs047g000s1yi4y6zud24q', 'cmqgryjm7000e1yi4el1tph1o', 'cmqgs7lx200211yi4kbh8kbmw', 'cmqgmcqup00081ywqb139igc4', 'cmqgrwjrz00051yi4pppg3ag4', 'cmtwey4oc000u1y2nqwhna1ez', 'cmtwey57200101y2nnjgj6zij', 'cmqgmjnpo000h1ywqsoivj4oi', 'cmtwf3zta000p1yfsk84jgb3j', 'cmqgsaii9002i1yi4uk5mn2yd', 'cmqgrwji100041yi4rl4f7ef0', 'cmqgnohd0001n1ywq9892y58l', 'cmqgmpm1u000c1y8q6ayncaz2', 'cmqgrx0kr00071yi4y9r0foui', 'cmqgs9gtw002b1yi4ftnt7g5i', 'cmqgdxps800081y26lvxlma1t', 'cmvnxagpu0001jsv90u57yw7a');

DO $guard$
BEGIN
  IF (
    SELECT count(*)
    FROM "QuestionBankItem" AS q
    JOIN qbi_livetest_20261031_backup AS b ON b.id = q.id
    WHERE q."contentHash" = b."contentHash"
      AND q.question = b.question
      AND q."correctAnswer" = b."correctAnswer"
      AND q.active = b.active
      AND q."qaPassed" = b."qaPassed"
      AND q.scenario IS NOT DISTINCT FROM b.scenario
      AND q.options = b.options
      AND q.explanation = b.explanation
      AND q.manual_correction = b.manual_correction
      AND q."updatedAt" = b."updatedAt"
  ) <> 57 THEN
    RAISE EXCEPTION 'undo verification failed';
  END IF;
END
$guard$;
COMMIT;

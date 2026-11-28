-- Rewrite hidden item s2n202611210318 so the oxygen options are parallel.
-- Does not publish the row. Run before golive-usmle-s2-new-20261121-batch04.sql.
BEGIN;
DO $fix$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem"
  WHERE id = 's2n202611210318'
    AND source = 's2-new-20261121-hidden'
    AND active = false
    AND "qaPassed" = false
    AND "stepLevel" = 'step2'
    AND "fieldId" = 'usmle-step-2'
    AND scenario LIKE '%who works as a student%';
  IF n <> 1 THEN
    RAISE EXCEPTION 'expected 1 hidden 0318 row still using the occupation stem, found %', n;
  END IF;

  DROP TABLE IF EXISTS qbi_usmle_s2_0318_20261128_backup;
  CREATE TABLE qbi_usmle_s2_0318_20261128_backup AS
  SELECT * FROM "QuestionBankItem" WHERE id = 's2n202611210318';

  UPDATE "QuestionBankItem"
  SET scenario = 'An 8-year-old boy is in the emergency department. He is having an asthma exacerbation. Oxygen saturation is 90% on air. Temperature is 37.1°C, pulse is 124/min, respirations are 32/min, and blood pressure is 100/64 mm Hg. He has intercostal retractions. He weighs 26 kg.',
      options = '{"options":["Give no oxygen and accept 88% to 90%","Start oxygen and target 99% to 100%","Start oxygen and target 92% to 95%","Give no oxygen and recheck in 1 hour","Start oxygen and target 94% to 98%"],"kind":"vignette","stepLevel":"step2","blueprintSystem":"respiratory-renal","blueprintTopic":"asthma-child-oxygen-target","taskCategory":"clinical-intervention"}',
      "correctAnswer" = 'Start oxygen and target 92% to 95%',
      explanation = 'GINA 2026 starts supplemental oxygen when saturation is below 92% and, in children 6 to 11 years, targets 92% to 95%, with an upper limit of 95%. Saturation is 90% on air, so oxygen is started and the target is 92% to 95%. "Give no oxygen and accept 88% to 90%" is not the best choice because 90% is below 92%, so oxygen is started, and 88% to 90% is below the target. "Start oxygen and target 99% to 100%" is not the best choice because 99% to 100% is above the upper limit of 95%. "Give no oxygen and recheck in 1 hour" is not the best choice because saturation below 92% is a reason to start oxygen now. "Start oxygen and target 94% to 98%" is not the best choice because the target is 92% to 95%, with an upper limit of 95%.',
      "contentHash" = '39e4a0b674ce8732c5ce6579ab2d295382fe6b51f67d41caf2a861f3b25b5ede',
      "updatedAt" = NOW()
  WHERE id = 's2n202611210318'
    AND source = 's2-new-20261121-hidden'
    AND active = false
    AND "qaPassed" = false
    AND "stepLevel" = 'step2'
    AND "fieldId" = 'usmle-step-2';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION '0318 update changed % rows', n;
  END IF;
END
$fix$;
COMMIT;

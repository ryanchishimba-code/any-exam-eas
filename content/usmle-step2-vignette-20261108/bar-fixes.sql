-- Draft only. Do not run until Ryan asks.
-- Hides six duplicate live items and corrects the vaccine item.
-- No rows are deleted.
BEGIN;

UPDATE "QuestionBankItem"
SET active = false,
    "updatedAt" = NOW()
WHERE "fieldId" = 'usmle-step-2'
  AND "id" IN (
    'cmtpx3dxn00ao1y6h49x7oy89',
    'cmtpwsnwu00431y6h82whxsuc',
    'cmtpw0obr002s1ylcvah3jo4h',
    'cmrpwg52l00bd1ylu6nvz4zi9',
    'cmr85sw8h000m1yr9jlj3palw',
    'cmr89ve8n01421yr9tb819ogb'
  );

UPDATE "QuestionBankItem"
SET scenario = 'A 12-month-old girl is brought for her scheduled well-child visit and is due for MMR and varicella vaccines. Since yesterday she has had a clear runny nose and a temperature of 38.2°C (100.8°F). She is playful, consolable, and taking her usual bottles. The examination shows clear rhinorrhea, a normal lung examination, and no rash or respiratory distress. Her mother asks whether the vaccines should wait.',
    question = 'Which of the following is the most appropriate action regarding her scheduled vaccines?',
    "correctAnswer" = 'Administer all scheduled vaccines today',
    explanation = 'A mild acute illness, with or without fever, is not a reason to delay MMR or varicella. She is playful, feeding, and has only clear rhinorrhea and a temperature of 38.2°C, so the vaccines should be given today. Deferring until the illness resolves treats a precaution for moderate or severe illness as if it applied to a mild cold, and it leaves her unprotected. A permanent contraindication is for a true problem such as a severe allergic reaction or severe immunodeficiency, not a one-day viral illness. Giving acetaminophen first is not required. Routine prophylactic antipyretics before vaccination are not recommended, and they are not what makes the visit safe.',
    "updatedAt" = NOW()
WHERE "id" = 'cmr89lvz4010g1yr9a7yxx5ux'
  AND "fieldId" = 'usmle-step-2';

COMMIT;

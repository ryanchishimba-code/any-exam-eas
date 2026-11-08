-- Undo for bar-fixes.sql, only after that file is applied.
-- Turns the six duplicates back on. Restores the vaccine item to the deferral version that is live now.
-- Does not delete rows.
UPDATE "QuestionBankItem"
SET active = true,
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
SET scenario = 'A 12-month-old girl is brought to the clinic for her scheduled well-child visit, at which she is due for MMR and varicella vaccines. For the past 2 days she has been fussy, feeding less and febrile. Temperature is 38.9 C (102 F), and she has a blanching maculopapular rash on the trunk. She is irritable but consolable.',
    question = 'Which of the following is the most appropriate action regarding her scheduled vaccines?',
    "correctAnswer" = 'Defer the vaccines until the acute illness resolves',
    explanation = 'Correct answer: B. Defer the vaccines until the acute illness resolves. A 2-day febrile illness with a temperature of 38.9 C, rash, reduced feeding and irritability is a moderate acute illness, which is a precaution for all vaccines: vaccination is generally deferred until the child improves, to avoid confusing vaccine reactions with the illness. Why the other options are wrong: A. Moderate or severe acute illness is a precaution; vaccines are usually postponed until the child improves. C. Acute illness is temporary and never a permanent contraindication; MMR should be given once she recovers. D. Giving acetaminophen does not change the precaution, and routine prophylactic antipyretics are not recommended at vaccination.',
    "updatedAt" = NOW()
WHERE "id" = 'cmr89lvz4010g1yr9a7yxx5ux'
  AND "fieldId" = 'usmle-step-2';

-- Undo the 2026-11-09 USMLE Step B hide and keeper-rationale rewrite.
-- Restores active and explanation from qbi_usmle_step_b_20261109 only.
-- USMLE fields only. Does not delete rows and does not touch other boards.
-- Snapshot before the change: snap-dark-snow-apzld90z (usmle-step-b-20261109-before).
UPDATE "QuestionBankItem" AS q
SET
  active = b.active,
  explanation = b.explanation,
  "updatedAt" = NOW()
FROM qbi_usmle_step_b_20261109 AS b
WHERE q.id = b.id
  AND q."fieldId" = b."fieldId"
  AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3')
  AND b.id NOT IN (
    'cmrpw18po002u1yh5h6rwsu2t',
    'cmr4pz6c600sz1y1ejeogz6u0'
  );

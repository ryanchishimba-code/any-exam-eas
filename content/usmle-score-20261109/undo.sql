-- Scoped undo for the 2026-11-09 approved USMLE fixes.
-- Restores the eight rows from qbi_usmle_approved_fixes_20261109.
-- Snapshot: snap-raspy-paper-ap9dbxhe (usmle-approved-fixes-20261109-before).
-- Does not delete rows.
BEGIN;
UPDATE "QuestionBankItem" AS q
SET active = b.active,
    options = b.options,
    explanation = b.explanation,
    "correctAnswer" = b."correctAnswer",
    "updatedAt" = NOW()
FROM qbi_usmle_approved_fixes_20261109 AS b
WHERE q.id = b.id
  AND q.id IN (
    'cmrpwivf6006h1yrtobyo55ub',
    'cmr88v6e000h91yw27dp8uvml',
    'cmrpw7bz400511yh597q5l80f',
    'cmr88v5wo00h31yw29d17arct',
    'cmr996ja400r11ywyk6bm3agd',
    'cmr8ji6l302n11ylolnopwsao',
    'cmr8ny4ue00zz1ygimo4ccllh',
    'cmr8ccjzg00lc1ylo69pwy1oo'
  );
COMMIT;

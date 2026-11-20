-- Scoped undo for the 3,261 unapproved USMLE rows hidden on 2026-11-09.
-- Restores active=true only for ids in qbi_usmle_unapproved_burst_20261109.
-- Snapshot: snap-aged-moon-aprapcz0 (usmle-unapproved-burst-20261109-before).
-- Does not delete rows. Does not touch other boards.
BEGIN;
UPDATE "QuestionBankItem" AS q
SET active = true,
    "updatedAt" = NOW()
FROM qbi_usmle_unapproved_burst_20261109 AS b
WHERE q.id = b.id
  AND q.source = 'generated'
  AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3')
  AND q."createdAt" >= TIMESTAMPTZ '2026-11-09 05:00:00+00'
  AND q."createdAt" < TIMESTAMPTZ '2026-11-09 05:01:00+00';
COMMIT;

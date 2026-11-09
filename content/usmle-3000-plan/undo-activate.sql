-- Returns the 60 USMLE pilot rows to inactive after they were turned on.
-- Snapshot before activation: snap-hidden-sound-apoza6np (usmle-pilot-60-activate-before).
-- Backup of the pre-activation rows: qbi_usmle_pilot_60_activate_before_20261109.
-- Does not change stems, options, keys, or rationales.
UPDATE "QuestionBankItem" AS q
SET
  active = false,
  "qaPassed" = false,
  "updatedAt" = NOW()
FROM qbi_usmle_pilot_60_activate_before_20261109 AS b
WHERE q.id = b.id
  AND q.source = 'pilot-draft'
  AND b.source = 'pilot-draft'
  AND b.active = false
  AND b."qaPassed" = false
  AND q."fieldId" = b."fieldId"
  AND q."fieldId" IN ('usmle-step-1', 'usmle-step-2', 'usmle-step-3');

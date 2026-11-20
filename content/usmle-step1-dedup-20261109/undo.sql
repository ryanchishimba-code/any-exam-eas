-- Restores the 1,031 confirmed Step 1 extra copies hidden on 2026-11-09.
-- Backup table: qbi_usmle_step1_duphide_20261109
-- Snapshot before the hide: snap-empty-resonance-ap1ab1rh
-- Does not delete rows. Does not change the 39 kept representatives.
UPDATE "QuestionBankItem" AS q
SET active = b.active,
    "updatedAt" = b."updatedAt"
FROM qbi_usmle_step1_duphide_20261109 AS b
WHERE q.id = b.id;

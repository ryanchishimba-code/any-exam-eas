-- Restores the 2,905 confirmed Step 3 extra copies hidden on 2026-11-08.
-- Backup table: qbi_usmle_step3_duphide_20261108
-- Snapshot before the hide: snap-aged-rice-apbsl1tk
-- Does not delete rows. Does not change the four held pairs or any non-clone.
UPDATE "QuestionBankItem" AS q
SET active = b.active,
    "updatedAt" = b."updatedAt"
FROM qbi_usmle_step3_duphide_20261108 AS b
WHERE q.id = b.id;

-- Batch 7. Two open-access PMC sentences that state the key. Backup qbi_usmle_refs_s12b7_20261114_backup.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12b7-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s12b7_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr869hpp003a1yr9qs9ojy9m',
    'cmr8aypey00w21yw2l851ah2p'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b7_20261114_backup) <> 2 THEN
    RAISE EXCEPTION 'backup row count %, expected 2', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b7_20261114_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $b7j0$[{"label": "PMC10068763. One way to reduce colonization and transmission of S. pneumoniae is to administer pneumococcal conjugate vaccines (PCVs).", "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10068763/"}]$b7j0$::jsonb
WHERE id = 'cmr869hpp003a1yr9qs9ojy9m'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b7j1$[{"label": "PMC9220334. However, the underlying mechanism of its actions is not entirely clear, because its antidepressant or anxiolytic effects are believed to presumably be associated with the increased serotonin levels in extracellular milieu due to inhibition of serotonin reuptake into the cell interior and possibly with an interaction with certain receptors to which serotonin can bind [ 3 , 5 , 14 , 15 ].", "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9220334/"}]$b7j1$::jsonb
WHERE id = 'cmr8aypey00w21yw2l851ah2p'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
DO $verify$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem" q
    JOIN qbi_usmle_refs_s12b7_20261114_backup b ON b.id = q.id
    WHERE q."references" IS NOT DISTINCT FROM b."references"
  ) THEN
    RAISE EXCEPTION 'at least one row was not updated';
  END IF;
END
$verify$;
COMMIT;

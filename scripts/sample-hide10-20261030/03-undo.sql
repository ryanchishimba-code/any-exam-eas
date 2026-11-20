-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 10 confirmed sample items. Ryan approved at 9:13 PM CT on 2026-10-30.
-- Sets active = false. Question text, options, keys, and rationales are not changed.
-- The cleared item cmr0ssxq4002a1yfni9317cpj is not updated.
-- Aborts unless the matched row count is exactly 10.
-- Restore active from qbi_sample_hide10_20261030_backup for the 10 ids.
-- Does not drop the backup table and does not delete QuestionBankItem rows.
-- Aborts unless the backup has 10 rows and the restore matches 10 rows.
-- Run only to undo the 2026-10-30 sample hide:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/sample-hide10-20261030/03-undo.sql

BEGIN;
DO $do$
DECLARE
  n int;
  ids text[] := ARRAY[
  'cmr84dejz009k1yzbhdule3hz',
  'cmr844c7900491yzb8zkat4k4',
  'cmqgwasng000w1yk0laky7wk0',
  'cmr844bhi00401yzb9bbk1ein',
  'cmqvnyzu5001n1yfgsoiuihup',
  'cmr85p3vz002s1yz6hhbrtuts',
  'cmsfjghmy001k1ymsdipg8syy',
  'cmtwf1m08006q1y2noia7k533',
  'cmtwf7io4006c1yfswvmjy89j',
  'cmpnjm1r90nm51ymxbf97v0t7'
  ];
BEGIN
  IF to_regclass('public.qbi_sample_hide10_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_sample_hide10_20261030_backup does not exist';
  END IF;
  IF (SELECT count(*) FROM qbi_sample_hide10_20261030_backup) <> 10
     OR (SELECT count(DISTINCT id) FROM qbi_sample_hide10_20261030_backup) <> 10 THEN
    RAISE EXCEPTION 'backup row count is not 10';
  END IF;
  IF EXISTS (
    SELECT expected.id FROM unnest(ids) AS expected(id)
    EXCEPT
    SELECT id FROM qbi_sample_hide10_20261030_backup
  ) OR EXISTS (
    SELECT id FROM qbi_sample_hide10_20261030_backup
    EXCEPT
    SELECT expected.id FROM unnest(ids) AS expected(id)
  ) THEN
    RAISE EXCEPTION 'backup ids do not match the hide list';
  END IF;
  IF EXISTS (SELECT 1 FROM qbi_sample_hide10_20261030_backup WHERE id = 'cmr0ssxq4002a1yfni9317cpj') THEN
    RAISE EXCEPTION 'backup contains the cleared id';
  END IF;

  UPDATE "QuestionBankItem" AS q
  SET active = backup.active
  FROM qbi_sample_hide10_20261030_backup AS backup
  WHERE q.id = backup.id
    AND q."fieldId" = backup."fieldId"
    AND q.id = ANY (ids);
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 10 THEN
    RAISE EXCEPTION 'matched row count %, expected 10', n;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM "QuestionBankItem" AS q
    JOIN qbi_sample_hide10_20261030_backup AS backup ON backup.id = q.id
    WHERE q.active IS DISTINCT FROM backup.active
  ) THEN
    RAISE EXCEPTION 'undo left active different from the backup';
  END IF;
  RAISE NOTICE 'hide10 undo row count %', n;
END
$do$;
COMMIT;

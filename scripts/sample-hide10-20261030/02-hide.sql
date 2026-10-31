-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 10 confirmed sample items. Ryan approved at 9:13 PM CT on 2026-10-30.
-- Sets active = false. Question text, options, keys, and rationales are not changed.
-- The cleared item cmr0ssxq4002a1yfni9317cpj is not updated.
-- Aborts unless the matched row count is exactly 10.
-- Set active = false on exactly the 10 backed-up ids.
-- Aborts unless the backup table has 10 rows and the update matches 10 rows.
-- Run inside a transaction; this file does not COMMIT.

DO $do$
DECLARE
  n int;
  cleared_before boolean;
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
  SELECT active INTO cleared_before
  FROM "QuestionBankItem"
  WHERE id = 'cmr0ssxq4002a1yfni9317cpj';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'cleared id cmr0ssxq4002a1yfni9317cpj is missing';
  END IF;
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
  IF EXISTS (
    SELECT 1
    FROM qbi_sample_hide10_20261030_backup AS backup
    JOIN (VALUES
  ('cmr84dejz009k1yzbhdule3hz', 'aanp-fnp'),
  ('cmr844c7900491yzb8zkat4k4', 'aanp-fnp'),
  ('cmqgwasng000w1yk0laky7wk0', 'aanp-fnp'),
  ('cmr844bhi00401yzb9bbk1ein', 'aanp-fnp'),
  ('cmqvnyzu5001n1yfgsoiuihup', 'pharmacy'),
  ('cmr85p3vz002s1yz6hhbrtuts', 'aanp-fnp'),
  ('cmsfjghmy001k1ymsdipg8syy', 'pharmacy'),
  ('cmtwf1m08006q1y2noia7k533', 'aanp-fnp'),
  ('cmtwf7io4006c1yfswvmjy89j', 'aanp-fnp'),
  ('cmpnjm1r90nm51ymxbf97v0t7', 'nursing')
    ) AS expected(id, field_id) ON expected.id = backup.id
    WHERE backup."fieldId" IS DISTINCT FROM expected.field_id
  ) OR (
    SELECT count(*)
    FROM qbi_sample_hide10_20261030_backup AS backup
    JOIN (VALUES
  ('cmr84dejz009k1yzbhdule3hz', 'aanp-fnp'),
  ('cmr844c7900491yzb8zkat4k4', 'aanp-fnp'),
  ('cmqgwasng000w1yk0laky7wk0', 'aanp-fnp'),
  ('cmr844bhi00401yzb9bbk1ein', 'aanp-fnp'),
  ('cmqvnyzu5001n1yfgsoiuihup', 'pharmacy'),
  ('cmr85p3vz002s1yz6hhbrtuts', 'aanp-fnp'),
  ('cmsfjghmy001k1ymsdipg8syy', 'pharmacy'),
  ('cmtwf1m08006q1y2noia7k533', 'aanp-fnp'),
  ('cmtwf7io4006c1yfswvmjy89j', 'aanp-fnp'),
  ('cmpnjm1r90nm51ymxbf97v0t7', 'nursing')
    ) AS expected(id, field_id) ON expected.id = backup.id AND expected.field_id = backup."fieldId"
  ) <> 10 THEN
    RAISE EXCEPTION 'backup field ids do not match the confirmed boards';
  END IF;

  UPDATE "QuestionBankItem" AS q
  SET active = false
  WHERE q.id = ANY (ids)
    AND q.id <> 'cmr0ssxq4002a1yfni9317cpj'
    AND EXISTS (
      SELECT 1
      FROM qbi_sample_hide10_20261030_backup AS backup
      WHERE backup.id = q.id AND backup."fieldId" = q."fieldId"
    );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 10 THEN
    RAISE EXCEPTION 'matched row count %, expected 10', n;
  END IF;
  IF (SELECT count(*) FROM "QuestionBankItem" WHERE id = ANY (ids) AND active = false) <> 10 THEN
    RAISE EXCEPTION 'not all 10 hide ids are inactive';
  END IF;
  IF (
    SELECT active FROM "QuestionBankItem" WHERE id = 'cmr0ssxq4002a1yfni9317cpj'
  ) IS DISTINCT FROM cleared_before THEN
    RAISE EXCEPTION 'cleared id active flag changed';
  END IF;
  RAISE NOTICE 'hide10 apply row count %', n;
END
$do$;

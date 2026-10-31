-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 10 confirmed sample items. Ryan approved at 9:13 PM CT on 2026-10-30.
-- Sets active = false. Question text, options, keys, and rationales are not changed.
-- The cleared item cmr0ssxq4002a1yfni9317cpj is not updated.
-- Aborts unless the matched row count is exactly 10.
-- Snapshot every column of the 10 rows into qbi_sample_hide10_20261030_backup.
-- Refuses to replace an existing backup.
-- Run inside a transaction; this file does not COMMIT.
-- Undo: scripts/sample-hide10-20261030/03-undo.sql

DO $do$
BEGIN
  IF to_regclass('public.qbi_sample_hide10_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_sample_hide10_20261030_backup already exists';
  END IF;
  IF (
    SELECT count(*)
    FROM (VALUES
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
    ) AS expected(id, field_id)
    JOIN "QuestionBankItem" AS q ON q.id = expected.id AND q."fieldId" = expected.field_id
  ) <> 10 THEN
    RAISE EXCEPTION 'expected exactly 10 rows on the confirmed field ids';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem" WHERE id = 'cmr0ssxq4002a1yfni9317cpj'
  ) AND EXISTS (
    SELECT 1
    FROM (VALUES
      ('cmr84dejz009k1yzbhdule3hz'),
      ('cmr844c7900491yzb8zkat4k4'),
      ('cmqgwasng000w1yk0laky7wk0'),
      ('cmr844bhi00401yzb9bbk1ein'),
      ('cmqvnyzu5001n1yfgsoiuihup'),
      ('cmr85p3vz002s1yz6hhbrtuts'),
      ('cmsfjghmy001k1ymsdipg8syy'),
      ('cmtwf1m08006q1y2noia7k533'),
      ('cmtwf7io4006c1yfswvmjy89j'),
      ('cmpnjm1r90nm51ymxbf97v0t7')
    ) AS hide(id)
    WHERE hide.id = 'cmr0ssxq4002a1yfni9317cpj'
  ) THEN
    RAISE EXCEPTION 'cleared id is in the hide list';
  END IF;
END
$do$;

CREATE TABLE qbi_sample_hide10_20261030_backup AS
SELECT q.*
FROM "QuestionBankItem" AS q
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
) AS expected(id, field_id)
  ON q.id = expected.id AND q."fieldId" = expected.field_id;

DO $do$
DECLARE
  n int;
BEGIN
  SELECT count(*)::int INTO n FROM qbi_sample_hide10_20261030_backup;
  IF n <> 10 OR (SELECT count(DISTINCT id) FROM qbi_sample_hide10_20261030_backup) <> 10 THEN
    RAISE EXCEPTION 'backup row count %, expected 10', n;
  END IF;
  IF EXISTS (
    SELECT expected.id
    FROM (VALUES
      ('cmr84dejz009k1yzbhdule3hz'),
      ('cmr844c7900491yzb8zkat4k4'),
      ('cmqgwasng000w1yk0laky7wk0'),
      ('cmr844bhi00401yzb9bbk1ein'),
      ('cmqvnyzu5001n1yfgsoiuihup'),
      ('cmr85p3vz002s1yz6hhbrtuts'),
      ('cmsfjghmy001k1ymsdipg8syy'),
      ('cmtwf1m08006q1y2noia7k533'),
      ('cmtwf7io4006c1yfswvmjy89j'),
      ('cmpnjm1r90nm51ymxbf97v0t7')
    ) AS expected(id)
    EXCEPT
    SELECT id FROM qbi_sample_hide10_20261030_backup
  ) THEN
    RAISE EXCEPTION 'backup is missing a hide id';
  END IF;
  IF EXISTS (SELECT 1 FROM qbi_sample_hide10_20261030_backup WHERE id = 'cmr0ssxq4002a1yfni9317cpj') THEN
    RAISE EXCEPTION 'backup contains the cleared id';
  END IF;
  RAISE NOTICE 'hide10 backup row count %', n;
END
$do$;

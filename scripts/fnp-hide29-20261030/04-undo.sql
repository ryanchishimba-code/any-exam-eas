-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 29 AANP FNP questions whose answer keys contradict guidelines (K1-K5 safe hides).
-- Approved by Ryan. Question text, options, keys, and rationales are not changed.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql.
-- Restore active from qbi_fnp_hide29_20261030_backup for the 29 FNP ids.
-- Does not drop the backup table and does not delete QuestionBankItem rows.
-- Aborts unless the backup has 29 rows and the restore matches 29 rows.
-- Run only to undo the 2026-10-30 hide:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/fnp-hide29-20261030/04-undo.sql

BEGIN;
DO $do$
DECLARE
  n int;
  ids text[] := ARRAY[
  'cmr834kwj005j1ykz4jipob7b',
  'cmr83lukg005o1yq592x4ud8f',
  'cmr85aqgf005g1y9iotruijyi',
  'cmr85rzqw003w1yz6kyle1lqu',
  'cmr85tufe005n1yz6vgzpjjqk',
  'cmtwf05nl003r1y2n03ep1bf0',
  'cmqgsppgz002b1ydhlv0tdgex',
  'cmqgtgenc001r1y51zo64qe1b',
  'cmqgtpdu5000i1yfh1pggni9k',
  'cmqgtpqkt000f1yfio51ihfj4',
  'cmqgu0jqh00001y4qej6lvzp5',
  'cmqgu0uw8000m1y4owh21o6y3',
  'cmqxayqaz00001y7rc7elrvst',
  'cmr82mwm8006l1yfv2x62hvnk',
  'cmr840a53001b1yzby6oxsrrq',
  'cmr84qup900421y5t5a4wpk7o',
  'cmr84xtjw008q1y5tl1a794mm',
  'cmr85186j00bb1y5tug2jw0ei',
  'cmr85e49d007k1y9if1of7dp3',
  'cmr85jhhg00ba1y9icth7djaz',
  'cmr85xeay007q1yz69cggdkhg',
  'cmtwf1iql005u1y2nnxdf34fj',
  'cmtwf7h0f005u1yfsm599iv03',
  'cmtwfdh7p004u1yso8nmjxgh3',
  'cmtwflonj007f1y1oyrusar7e',
  'cmtwf3y5p00071yfsqi1joihf',
  'cmtwf7jw8006o1yfs60lw78pc',
  'cmtwf8v5n008e1yfsh3hyis6j',
  'cmtwfflu4008s1ysojdiau7ya'
  ];
BEGIN

  IF to_regclass('public.qbi_fnp_hide29_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_fnp_hide29_20261030_backup does not exist';
  END IF;
  IF cardinality(ids) <> 29 OR (SELECT COUNT(DISTINCT id) FROM unnest(ids) AS u(id)) <> 29 THEN
    RAISE EXCEPTION 'hide id list is not 29 distinct ids';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_fnp_hide29_20261030_backup) <> 29
     OR (SELECT COUNT(DISTINCT id) FROM qbi_fnp_hide29_20261030_backup) <> 29 THEN
    RAISE EXCEPTION 'backup row count is not 29';
  END IF;
  IF EXISTS (
    SELECT expected.id FROM unnest(ids) AS expected(id)
    EXCEPT
    SELECT id FROM qbi_fnp_hide29_20261030_backup
  ) OR EXISTS (
    SELECT id FROM qbi_fnp_hide29_20261030_backup
    EXCEPT
    SELECT expected.id FROM unnest(ids) AS expected(id)
  ) THEN
    RAISE EXCEPTION 'backup ids do not match the hide list';
  END IF;

  UPDATE "QuestionBankItem" AS q
  SET active = backup.active
  FROM qbi_fnp_hide29_20261030_backup AS backup
  WHERE q.id = backup.id
    AND q."fieldId" = 'aanp-fnp';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 29 THEN
    RAISE EXCEPTION 'matched row count %, expected 29', n;
  END IF;
  IF EXISTS (
    SELECT 1
    FROM "QuestionBankItem" AS q
    JOIN qbi_fnp_hide29_20261030_backup AS backup ON backup.id = q.id
    WHERE q.active IS DISTINCT FROM backup.active
  ) THEN
    RAISE EXCEPTION 'undo left active different from the backup';
  END IF;
END
$do$;
COMMIT;

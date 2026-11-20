-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 29 AANP FNP questions whose answer keys contradict guidelines (K1-K5 safe hides).
-- Approved by Ryan. Question text, options, keys, and rationales are not changed.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql.
-- Snapshot the 29 rows into qbi_fnp_hide29_20261030_backup.
-- Names every QuestionBankItem column. Does not use SELECT *.
-- Aborts unless the matched row count is exactly 29.
-- Does not set active. Run inside a transaction; this file does not COMMIT.
-- Undo: scripts/fnp-hide29-20261030/04-undo.sql

DO $do$
DECLARE
  cols text;
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
  IF to_regclass('public.qbi_fnp_hide29_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_fnp_hide29_20261030_backup already exists';
  END IF;
  IF cardinality(ids) <> 29 OR (SELECT COUNT(DISTINCT id) FROM unnest(ids) AS u(id)) <> 29 THEN
    RAISE EXCEPTION 'hide id list is not 29 distinct ids';
  END IF;
  EXECUTE 'CREATE TABLE qbi_fnp_hide29_20261030_backup (LIKE "QuestionBankItem" INCLUDING ALL)';
  SELECT string_agg(format('%I', column_name), ', ' ORDER BY ordinal_position)
    INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'QuestionBankItem';
  IF cols IS NULL OR cols = '' THEN
    RAISE EXCEPTION 'QuestionBankItem has no columns';
  END IF;
  EXECUTE format(
    'WITH ins AS (
       INSERT INTO qbi_fnp_hide29_20261030_backup (%s)
       SELECT %s FROM "QuestionBankItem"
       WHERE id = ANY ($1) AND "fieldId" = ''aanp-fnp''
       RETURNING id
     )
     SELECT COUNT(*)::int FROM ins',
    cols,
    cols
  ) INTO n USING ids;
  IF n <> 29 THEN
    RAISE EXCEPTION 'matched row count %, expected 29', n;
  END IF;
  IF (SELECT COUNT(*) FROM qbi_fnp_hide29_20261030_backup) <> 29
     OR (SELECT COUNT(DISTINCT id) FROM qbi_fnp_hide29_20261030_backup) <> 29 THEN
    RAISE EXCEPTION 'backup row count is not 29';
  END IF;
  IF EXISTS (
    SELECT 1 FROM unnest(ids) AS expected(id)
    WHERE NOT EXISTS (
      SELECT 1 FROM qbi_fnp_hide29_20261030_backup AS backup WHERE backup.id = expected.id
    )
  ) THEN
    RAISE EXCEPTION 'backup is missing a hide id';
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_fnp_hide29_20261030_backup
    WHERE "fieldId" <> 'aanp-fnp' OR active IS NOT TRUE OR "qaPassed" IS NOT TRUE
  ) THEN
    RAISE EXCEPTION 'backup row is not an active qaPassed FNP item';
  END IF;
END
$do$;

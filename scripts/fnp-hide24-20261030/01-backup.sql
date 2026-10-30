-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 24 confirmed AANP FNP questions. Approved by Ryan at 6:28 PM CT on 2026-10-30.
-- Question text, options, keys, and rationales are not changed.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql.
-- Snapshot the 24 rows into qbi_fnp_hide24_20261030_backup.
-- Names every QuestionBankItem column. Does not use SELECT *.
-- Aborts unless the matched row count is exactly 24.
-- Does not set active. Run inside a transaction; this file does not COMMIT.
-- Undo: scripts/fnp-hide24-20261030/03-undo.sql

DO $do$
DECLARE
  cols text;
  n int;
  ids text[] := ARRAY[
  'cmr85zl1f008p1yz6isj7fca1',
  'cmr83pfrr00831yq5uhgdm098',
  'cmr85919j003i1y9i2h2sbn5c',
  'cmr8592q600401y9i33n9n2yp',
  'cmqgsxbgg00551ydhd8uoavmk',
  'cmr82p33h007p1yfv50wmzyve',
  'cmr83w7gc00b41yq5xlzqp3ge',
  'cmr84mw8g001y1y5truqimadu',
  'cmr85hxgf00af1y9ibg4i0jnl',
  'cmtwf06th00441y2n4lwkhlfo',
  'cmtwfcdse003x1ysoaaf5lg6t',
  'cmtwfmhig008a1y1ouy39s0jb',
  'cmtwfmhf300891y1owxq55rm2',
  'cmr85cdjg006r1y9ifmswzdbh',
  'cmr85g0uq008v1y9i3w23sirn',
  'cmqgv3ic2000p1ycck36vbjc7',
  'cmr85myyb001d1yz6dfiayest',
  'cmtwf1kdj006a1y2n672ib7lr',
  'cmtwfjgz1003q1y1on88ywq01',
  'cmr82gqxk002u1yfvu5bjsavt',
  'cmr8592ey003w1y9itrnc7o2c',
  'cmr85zmfy00931yz66gz1vb9t',
  'cmtwffkie008d1yso2bngnjn3',
  'cmtwf4n29001r1yfsdk20ac4w'
  ];
BEGIN
  IF to_regclass('public.qbi_fnp_hide24_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_fnp_hide24_20261030_backup already exists';
  END IF;
  IF cardinality(ids) <> 24 OR (SELECT COUNT(DISTINCT id) FROM unnest(ids) AS u(id)) <> 24 THEN
    RAISE EXCEPTION 'hide id list is not 24 distinct ids';
  END IF;
  EXECUTE 'CREATE TABLE qbi_fnp_hide24_20261030_backup (LIKE "QuestionBankItem" INCLUDING ALL)';
  SELECT string_agg(format('%I', column_name), ', ' ORDER BY ordinal_position)
    INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'QuestionBankItem';
  IF cols IS NULL OR cols = '' THEN
    RAISE EXCEPTION 'QuestionBankItem has no columns';
  END IF;
  EXECUTE format(
    'WITH ins AS (
       INSERT INTO qbi_fnp_hide24_20261030_backup (%s)
       SELECT %s FROM "QuestionBankItem"
       WHERE id = ANY ($1) AND "fieldId" = ''aanp-fnp''
       RETURNING id
     )
     SELECT COUNT(*)::int FROM ins',
    cols,
    cols
  ) INTO n USING ids;
  IF n <> 24 THEN
    RAISE EXCEPTION 'matched row count %, expected 24', n;
  END IF;
  IF (SELECT COUNT(*) FROM qbi_fnp_hide24_20261030_backup) <> 24
     OR (SELECT COUNT(DISTINCT id) FROM qbi_fnp_hide24_20261030_backup) <> 24 THEN
    RAISE EXCEPTION 'backup row count is not 24';
  END IF;
  IF EXISTS (
    SELECT 1 FROM unnest(ids) AS expected(id)
    WHERE NOT EXISTS (
      SELECT 1 FROM qbi_fnp_hide24_20261030_backup AS backup WHERE backup.id = expected.id
    )
  ) THEN
    RAISE EXCEPTION 'backup is missing a hide id';
  END IF;
END
$do$;

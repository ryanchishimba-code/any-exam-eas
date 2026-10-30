-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 24 confirmed AANP FNP questions. Approved by Ryan at 6:28 PM CT on 2026-10-30.
-- Question text, options, keys, and rationales are not changed.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql.
-- Set active = false on exactly the 24 backed-up FNP ids.
-- Aborts unless the backup table has 24 rows and the update matches 24 rows.
-- Run inside a transaction; this file does not COMMIT.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/fnp-hide24-20261030/03-undo.sql

DO $do$
DECLARE
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
  IF to_regclass('public.qbi_fnp_hide24_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_fnp_hide24_20261030_backup does not exist';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_fnp_hide24_20261030_backup) <> 24
     OR (SELECT COUNT(DISTINCT id) FROM qbi_fnp_hide24_20261030_backup) <> 24 THEN
    RAISE EXCEPTION 'backup row count is not 24';
  END IF;
  IF EXISTS (
    SELECT expected.id FROM unnest(ids) AS expected(id)
    EXCEPT
    SELECT id FROM qbi_fnp_hide24_20261030_backup
  ) OR EXISTS (
    SELECT id FROM qbi_fnp_hide24_20261030_backup
    EXCEPT
    SELECT expected.id FROM unnest(ids) AS expected(id)
  ) THEN
    RAISE EXCEPTION 'backup ids do not match the hide list';
  END IF;
  UPDATE "QuestionBankItem" AS q
  SET active = false
  WHERE q.id = ANY (ids)
    AND q."fieldId" = 'aanp-fnp'
    AND EXISTS (
      SELECT 1 FROM qbi_fnp_hide24_20261030_backup AS backup WHERE backup.id = q.id
    );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 24 THEN
    RAISE EXCEPTION 'matched row count %, expected 24', n;
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (ids) AND active = false) <> 24 THEN
    RAISE EXCEPTION 'not all 24 hide ids are inactive';
  END IF;
END
$do$;

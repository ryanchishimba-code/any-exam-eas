-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 11 confirmed questions: 8 AANP FNP (fieldId aanp-fnp) and 3 NAPLEX (fieldId pharmacy).
-- Approved by Ryan at 8:50 PM CT on 2026-10-30.
-- Exam Expert rows marked OK are excluded:
--   cmr0h23kq005f1ygw86dlpa5i, cmr0a3sso001w1y7dzl3b5pki
-- Question text, options, keys, and rationales are not changed.
-- Snapshot the 11 rows into qbi_served_hide11_20261030_backup.
-- Names every QuestionBankItem column. Does not use SELECT *.
-- Aborts unless the matched row count is exactly 11 (8 FNP, 3 pharmacy).
-- Does not set active. Run inside a transaction; this file does not COMMIT.
-- Undo: scripts/served-hide11-20261030/03-undo.sql

DO $do$
DECLARE
  cols text;
  n int;
  fnp_ids text[] := ARRAY[
  'cmr85hxm200ah1y9i69c144hv',
  'cmr85l87w000l1yz6oy093eg5',
  'cmr854yyf001b1y9i9knazova',
  'cmr84opz2002y1y5t1jksww72',
  'cmqgvhytz00271yss8f82v3mu',
  'cmqgv0qmu00041ycf0kytg4al',
  'cmqgtxv2y002x1yfipnvg9x9u',
  'cmtwf051s003k1y2nzwttzvmu'
  ];
  pharmacy_ids text[] := ARRAY[
  'cmshk0kr5003m1yspm2m8jq8x',
  'cmsg08i5x00021yiylzrl0zhf',
  'cmr7xtfq300101yikvx9cvr81'
  ];
  ok_ids text[] := ARRAY[
  'cmr0h23kq005f1ygw86dlpa5i',
  'cmr0a3sso001w1y7dzl3b5pki'
  ];
BEGIN
  IF to_regclass('public.qbi_served_hide11_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_served_hide11_20261030_backup already exists';
  END IF;
  IF cardinality(fnp_ids) <> 8
     OR (SELECT COUNT(DISTINCT id) FROM unnest(fnp_ids) AS u(id)) <> 8 THEN
    RAISE EXCEPTION 'FNP id list is not 8 distinct ids';
  END IF;
  IF cardinality(pharmacy_ids) <> 3
     OR (SELECT COUNT(DISTINCT id) FROM unnest(pharmacy_ids) AS u(id)) <> 3 THEN
    RAISE EXCEPTION 'pharmacy id list is not 3 distinct ids';
  END IF;
  IF EXISTS (
    SELECT id FROM unnest(fnp_ids) AS fnp(id)
    INTERSECT
    SELECT id FROM unnest(pharmacy_ids) AS pharmacy(id)
  ) OR EXISTS (
    SELECT id FROM unnest(fnp_ids || pharmacy_ids) AS hide(id)
    INTERSECT
    SELECT id FROM unnest(ok_ids) AS ok(id)
  ) THEN
    RAISE EXCEPTION 'hide id list overlaps or includes an OK row';
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (fnp_ids) AND "fieldId" = 'aanp-fnp') <> 8 THEN
    RAISE EXCEPTION 'FNP match count is not 8';
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (pharmacy_ids) AND "fieldId" = 'pharmacy') <> 3 THEN
    RAISE EXCEPTION 'pharmacy match count is not 3';
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (fnp_ids || pharmacy_ids)) <> 11 THEN
    RAISE EXCEPTION 'matched row count is not 11';
  END IF;
  EXECUTE 'CREATE TABLE qbi_served_hide11_20261030_backup (LIKE "QuestionBankItem" INCLUDING ALL)';
  SELECT string_agg(format('%I', column_name), ', ' ORDER BY ordinal_position)
    INTO cols
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'QuestionBankItem';
  IF cols IS NULL OR cols = '' THEN
    RAISE EXCEPTION 'QuestionBankItem has no columns';
  END IF;
  EXECUTE format(
    'WITH ins AS (
       INSERT INTO qbi_served_hide11_20261030_backup (%s)
       SELECT %s FROM "QuestionBankItem"
       WHERE (id = ANY ($1) AND "fieldId" = ''aanp-fnp'')
          OR (id = ANY ($2) AND "fieldId" = ''pharmacy'')
       RETURNING id
     )
     SELECT COUNT(*)::int FROM ins',
    cols,
    cols
  ) INTO n USING fnp_ids, pharmacy_ids;
  IF n <> 11 THEN
    RAISE EXCEPTION 'matched row count %, expected 11', n;
  END IF;
  IF (SELECT COUNT(*) FROM qbi_served_hide11_20261030_backup) <> 11
     OR (SELECT COUNT(DISTINCT id) FROM qbi_served_hide11_20261030_backup) <> 11 THEN
    RAISE EXCEPTION 'backup row count is not 11';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_served_hide11_20261030_backup WHERE "fieldId" = 'aanp-fnp') <> 8 THEN
    RAISE EXCEPTION 'backup FNP count is not 8';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_served_hide11_20261030_backup WHERE "fieldId" = 'pharmacy') <> 3 THEN
    RAISE EXCEPTION 'backup pharmacy count is not 3';
  END IF;
  IF EXISTS (
    SELECT id FROM unnest(fnp_ids || pharmacy_ids) AS expected(id)
    EXCEPT
    SELECT id FROM qbi_served_hide11_20261030_backup
  ) OR EXISTS (
    SELECT id FROM qbi_served_hide11_20261030_backup
    EXCEPT
    SELECT id FROM unnest(fnp_ids || pharmacy_ids) AS expected(id)
  ) THEN
    RAISE EXCEPTION 'backup ids do not match the hide list';
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_served_hide11_20261030_backup
    WHERE (id = ANY (fnp_ids) AND "fieldId" <> 'aanp-fnp')
       OR (id = ANY (pharmacy_ids) AND "fieldId" <> 'pharmacy')
       OR id = ANY (ok_ids)
  ) THEN
    RAISE EXCEPTION 'backup field does not match the confirmed board';
  END IF;
END
$do$;

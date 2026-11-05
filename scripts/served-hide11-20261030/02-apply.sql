-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- 11 confirmed questions: 8 AANP FNP (fieldId aanp-fnp) and 3 NAPLEX (fieldId pharmacy).
-- Approved by Ryan at 8:50 PM CT on 2026-10-30.
-- Exam Expert rows marked OK are excluded:
--   cmr0h23kq005f1ygw86dlpa5i, cmr0a3sso001w1y7dzl3b5pki
-- Question text, options, keys, and rationales are not changed.
-- Set active = false on exactly the 11 backed-up ids.
-- Aborts unless the backup table has 11 rows (8 FNP, 3 pharmacy) and the update matches 11 rows.
-- Run inside a transaction; this file does not COMMIT.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/served-hide11-20261030/03-undo.sql

DO $do$
DECLARE
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
  IF to_regclass('public.qbi_served_hide11_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_served_hide11_20261030_backup does not exist';
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
  IF (SELECT COUNT(*) FROM qbi_served_hide11_20261030_backup) <> 11
     OR (SELECT COUNT(DISTINCT id) FROM qbi_served_hide11_20261030_backup) <> 11 THEN
    RAISE EXCEPTION 'backup row count is not 11';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_served_hide11_20261030_backup WHERE "fieldId" = 'aanp-fnp') <> 8
     OR (SELECT COUNT(*) FROM qbi_served_hide11_20261030_backup WHERE "fieldId" = 'pharmacy') <> 3 THEN
    RAISE EXCEPTION 'backup is not 8 FNP and 3 pharmacy';
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
    WHERE id = ANY (ok_ids)
  ) THEN
    RAISE EXCEPTION 'backup includes an OK row';
  END IF;
  UPDATE "QuestionBankItem" AS q
  SET active = false
  WHERE (
      (q.id = ANY (fnp_ids) AND q."fieldId" = 'aanp-fnp')
      OR (q.id = ANY (pharmacy_ids) AND q."fieldId" = 'pharmacy')
    )
    AND EXISTS (
      SELECT 1 FROM qbi_served_hide11_20261030_backup AS backup WHERE backup.id = q.id
    );
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 11 THEN
    RAISE EXCEPTION 'matched row count %, expected 11', n;
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem"
      WHERE id = ANY (fnp_ids) AND "fieldId" = 'aanp-fnp' AND active = false) <> 8 THEN
    RAISE EXCEPTION 'not all 8 FNP hide ids are inactive';
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem"
      WHERE id = ANY (pharmacy_ids) AND "fieldId" = 'pharmacy' AND active = false) <> 3 THEN
    RAISE EXCEPTION 'not all 3 pharmacy hide ids are inactive';
  END IF;
  IF (SELECT COUNT(*) FROM "QuestionBankItem" WHERE id = ANY (fnp_ids || pharmacy_ids) AND active = false) <> 11 THEN
    RAISE EXCEPTION 'not all 11 hide ids are inactive';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM "QuestionBankItem" AS q
    JOIN qbi_served_hide11_20261030_backup AS backup ON backup.id = q.id
    WHERE q.question IS DISTINCT FROM backup.question
       OR q.options IS DISTINCT FROM backup.options
       OR q."correctAnswer" IS DISTINCT FROM backup."correctAnswer"
       OR q.explanation IS DISTINCT FROM backup.explanation
       OR q."fieldId" IS DISTINCT FROM backup."fieldId"
  ) THEN
    RAISE EXCEPTION 'hide changed a column other than active';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem"
    WHERE id = ANY (ok_ids)
      AND id = ANY (fnp_ids || pharmacy_ids)
  ) THEN
    RAISE EXCEPTION 'an OK row was in the hide update';
  END IF;
END
$do$;

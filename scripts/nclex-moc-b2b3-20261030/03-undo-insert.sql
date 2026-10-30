-- 03-undo-insert.sql
-- NCLEX Management of Care batches 2 and 3, built 2026-10-30. Prepared only. Not RN-reviewed.
-- This file COMMITs when nclex.moc_b2b3_apply is set to 1.
-- Do not set that until a licensed RN has reviewed the package.
-- Target table: "QuestionBankItem". Field: nursing. Subject: management-of-care.
-- 140 new rows (batch 2 v7: 70, batch 3 v4: 70). Inserted inactive. No rewrites. No hides.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql. This package has no such file.
-- Backup tables: qbi_nclex_moc_b2b3_insert_20261030, qbi_nclex_moc_b2b3_activate_20261030.

BEGIN;
DO $guard$
BEGIN
  IF current_setting('nclex.moc_b2b3_apply', true) IS DISTINCT FROM '1' THEN
    RAISE EXCEPTION '03-undo-insert.sql: refusing to apply. Held until RN review. After that review, SET nclex.moc_b2b3_apply = ''1'' and run this file in one session.';
  END IF;
END
$guard$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_b2b3_insert_20261030') IS NULL THEN
    RAISE EXCEPTION 'insert undo requires qbi_nclex_moc_b2b3_insert_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_b2b3_insert_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 140 THEN
    RAISE EXCEPTION 'undo insert backup: expected 140, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  DELETE FROM "QuestionBankItem" q
  USING qbi_nclex_moc_b2b3_insert_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = false
    AND q."qaPassed" = false
    AND q.active IS NOT DISTINCT FROM b.active
    AND q."qaPassed" IS NOT DISTINCT FROM b."qaPassed";
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 140 THEN
    RAISE EXCEPTION 'undo insert expected to delete 140 held rows, found %. Undo activation first if the rows were published.', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE id IN (SELECT id FROM qbi_nclex_moc_b2b3_insert_20261030))::integer INTO n;
  IF n IS DISTINCT FROM 0 THEN
    RAISE EXCEPTION 'inserted rows removed: expected 0, found %', n;
  END IF;
END
$check$;


COMMIT;

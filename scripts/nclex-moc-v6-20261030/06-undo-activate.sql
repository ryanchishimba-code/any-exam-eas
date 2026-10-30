-- 06-undo-activate.sql
-- NCLEX Management of Care pilot v6, built 2026-10-30. Prepared only. Not RN-reviewed.
-- This file COMMITs when nclex.moc_v6_apply is set to 1.
-- Do not set that until a licensed RN has reviewed the package.
-- Target table: "QuestionBankItem". Field: nursing.
-- Do not run scripts/06-rollback-DO-NOT-RUN.sql. This package has no such file.
-- Backup tables: qbi_nclex_moc_v6_insert_20261030, qbi_nclex_item5_v6_rewrite_20261030, qbi_nclex_item5_ibu_hide_20261030, qbi_nclex_moc_v6_activate_20261030.

BEGIN;
DO $guard$
BEGIN
  IF current_setting('nclex.moc_v6_apply', true) IS DISTINCT FROM '1' THEN
    RAISE EXCEPTION '06-undo-activate.sql: refusing to apply. Held until RN review. After that review, SET nclex.moc_v6_apply = ''1'' and run this file in one session.';
  END IF;
END
$guard$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_moc_v6_activate_20261030') IS NULL THEN
    RAISE EXCEPTION 'activation undo requires qbi_nclex_moc_v6_activate_20261030';
  END IF;
END
$guard$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_moc_v6_activate_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'undo activate backup: expected 60, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET
    active = b.active,
    "qaPassed" = b."qaPassed",
    "reviewStatus" = b."reviewStatus",
    "lastReviewedAt" = b."lastReviewedAt",
    "qaAuditedAt" = b."qaAuditedAt",
    "updatedAt" = b."updatedAt"
  FROM qbi_nclex_moc_v6_activate_20261030 b
  WHERE q.id = b.id
    AND q."contentHash" = b."contentHash"
    AND q.active = true
    AND q."qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 60 THEN
    RAISE EXCEPTION 'undo activation expected 60 rows, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem" q
JOIN qbi_nclex_moc_v6_activate_20261030 b ON b.id = q.id
WHERE q.active = b.active
  AND q."qaPassed" = b."qaPassed"
  AND q."reviewStatus" IS NOT DISTINCT FROM b."reviewStatus")::integer INTO n;
  IF n IS DISTINCT FROM 60 THEN
    RAISE EXCEPTION 'activation flags restored: expected 60, found %', n;
  END IF;
END
$check$;


COMMIT;

-- 02-hide-ibuprofen.sql
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
    RAISE EXCEPTION '02-hide-ibuprofen.sql: refusing to apply. Held until RN review. After that review, SET nclex.moc_v6_apply = ''1'' and run this file in one session.';
  END IF;
END
$guard$;

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_item5_ibu_hide_20261030') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_item5_ibu_hide_20261030 already exists; refusing to run again';
  END IF;
END
$guard$;

-- Snapshot the ibuprofen row before hiding it.
CREATE TABLE qbi_nclex_item5_ibu_hide_20261030 AS
SELECT * FROM "QuestionBankItem"
WHERE id = $nclexmocv6$cmr8p5czr00a11y5nwf6lu2yu$nclexmocv6$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_ibu_hide_20261030)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'ibuprofen backup: expected 1, found %', n;
  END IF;
END
$check$;

DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM qbi_nclex_item5_ibu_hide_20261030
WHERE "contentHash" = $nclexmocv6$50e1760f03c15a4605b16c631fbc8f08cdad4b44c141ea73f71f57d0cb6fc6ba$nclexmocv6$
  AND "subjectId" = $nclexmocv6$pharmacology-nursing$nclexmocv6$
  AND "correctAnswer" = $nclexmocv6$Assess for signs of gastrointestinal bleeding.$nclexmocv6$
  AND active = true
  AND "qaPassed" = true)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'ibuprofen pre-image: expected 1, found %', n;
  END IF;
END
$check$;

DO $do$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" SET
    active = false,
    manual_correction = true,
    "updatedAt" = CURRENT_TIMESTAMP,
    "generationMeta" = COALESCE("generationMeta", '{}'::jsonb) || $nclexmocv6${"manualCorrection":true,"nclexItem5IbuprofenHide":true,"hideBatch":"nclex-item5-v6-20261030"}$nclexmocv6$::jsonb,
    curation_meta = COALESCE(curation_meta, '{}'::jsonb) || $nclexmocv6${"metadataBy":"nclex-item5-ibuprofen-hide","hidden":true}$nclexmocv6$::jsonb
  WHERE id = $nclexmocv6$cmr8p5czr00a11y5nwf6lu2yu$nclexmocv6$
    AND "contentHash" = $nclexmocv6$50e1760f03c15a4605b16c631fbc8f08cdad4b44c141ea73f71f57d0cb6fc6ba$nclexmocv6$
    AND "subjectId" = $nclexmocv6$pharmacology-nursing$nclexmocv6$
    AND "correctAnswer" = $nclexmocv6$Assess for signs of gastrointestinal bleeding.$nclexmocv6$
    AND active = true
    AND "qaPassed" = true;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'ibuprofen hide expected 1 row, found %', n;
  END IF;
END
$do$;
DO $check$
DECLARE n integer;
BEGIN
  SELECT (SELECT count(*) FROM "QuestionBankItem"
WHERE id = $nclexmocv6$cmr8p5czr00a11y5nwf6lu2yu$nclexmocv6$ AND active = false AND "qaPassed" = true
  AND "contentHash" = $nclexmocv6$50e1760f03c15a4605b16c631fbc8f08cdad4b44c141ea73f71f57d0cb6fc6ba$nclexmocv6$)::integer INTO n;
  IF n IS DISTINCT FROM 1 THEN
    RAISE EXCEPTION 'ibuprofen hidden: expected 1, found %', n;
  END IF;
END
$check$;


COMMIT;

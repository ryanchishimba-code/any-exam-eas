-- Target: Neon project lively-silence-56893462, database anyexameasy, branch main (br-super-frog-apuqj2ol).
-- NAPLEX item cmsg08i5x00021yiylzrl0zhf. Ryan approved the amoxicillin rewrite at 9:13 PM CT on 2026-10-30.
-- Changes the vignette, lead-in, options, key, rationale, citations, and difficulty.
-- Sets qaPassed = true, active = true, and manual_correction = true.
-- contentHash is sha256(fieldId|subjectId|lower(trim(scenario))|lower(trim(question))),
-- the same formula as bankItemContentHash in src/lib/sync-question-bank-guard.ts.
-- Does not edit application code. Does not drop the backup table.
-- Snapshot the one pharmacy row into qbi_amox_rewrite_20261030_backup.
-- Aborts unless that row exists and the snapshot is exactly 1 row.
-- Refuses to run until qbi_served_hide11_20261030_backup exists, and refuses to replace an existing backup.
-- Run inside a transaction; this file does not COMMIT.
-- Undo: scripts/amox-rewrite-20261030/03-undo.sql

DO $do$
BEGIN
  IF to_regclass('public.qbi_served_hide11_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_served_hide11_20261030_backup does not exist yet';
  END IF;
  IF to_regclass('public.qbi_amox_rewrite_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_amox_rewrite_20261030_backup already exists';
  END IF;
  IF (
    SELECT count(*)
    FROM "QuestionBankItem"
    WHERE id = 'cmsg08i5x00021yiylzrl0zhf' AND "fieldId" = 'pharmacy'
  ) <> 1 THEN
    RAISE EXCEPTION 'expected exactly 1 pharmacy row for cmsg08i5x00021yiylzrl0zhf';
  END IF;
END
$do$;

CREATE TABLE qbi_amox_rewrite_20261030_backup AS
SELECT *
FROM "QuestionBankItem"
WHERE id = 'cmsg08i5x00021yiylzrl0zhf'
  AND "fieldId" = 'pharmacy';

DO $do$
DECLARE
  n int;
BEGIN
  SELECT count(*)::int INTO n FROM qbi_amox_rewrite_20261030_backup;
  IF n <> 1 THEN
    RAISE EXCEPTION 'backup row count %, expected 1', n;
  END IF;
  IF (SELECT count(*) FROM qbi_amox_rewrite_20261030_backup WHERE id = 'cmsg08i5x00021yiylzrl0zhf' AND "fieldId" = 'pharmacy') <> 1 THEN
    RAISE EXCEPTION 'backup row is not the pharmacy amoxicillin item';
  END IF;
  RAISE NOTICE 'amox backup row count %', n;
END
$do$;

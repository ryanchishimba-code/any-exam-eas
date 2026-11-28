-- Undo the fourth 2026-11-14 USMLE Step 3 citation batch (113 rows).
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3d-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s3d_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s3d_20261114_backup) <> 113 THEN
    RAISE EXCEPTION 'backup count %, expected 113', (SELECT COUNT(*) FROM qbi_usmle_refs_s3d_20261114_backup);
  END IF;
END $check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET "references"=b."references"
  FROM qbi_usmle_refs_s3d_20261114_backup b
  WHERE q.id=b.id AND q."fieldId"='usmle-step-3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 113 THEN RAISE EXCEPTION 'undo updated %, expected 113', n; END IF;
END $restore$;
COMMIT;

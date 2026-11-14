-- Undo citation batch s3h (51 rows).
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3h-20261114.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s3h_20261114_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s3h_20261114_backup) <> 51 THEN
    RAISE EXCEPTION 'backup count %, expected 51', (SELECT COUNT(*) FROM qbi_usmle_refs_s3h_20261114_backup);
  END IF;
END $check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" q SET "references"=b."references"
  FROM qbi_usmle_refs_s3h_20261114_backup b
  WHERE q.id=b.id AND q."fieldId"='usmle-step-3';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 51 THEN RAISE EXCEPTION 'undo updated %, expected 51', n; END IF;
END $restore$;
COMMIT;

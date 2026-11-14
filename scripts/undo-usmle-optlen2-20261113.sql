-- Undo the 2026-11-13 option-length gloss trim.
-- Restores 4 rows from qbi_usmle_optlen2_20261113_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-optlen2-20261113.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_optlen2_20261113_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_optlen2_20261113_backup) <> 4 THEN
    RAISE EXCEPTION 'backup row count %, expected 4', (SELECT COUNT(*) FROM qbi_usmle_optlen2_20261113_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET options=b.options, "correctAnswer"=b."correctAnswer", explanation=b.explanation,
      manual_correction=b.manual_correction, "generationMeta"=b."generationMeta", "updatedAt"=b."updatedAt"
  FROM qbi_usmle_optlen2_20261113_backup AS b WHERE q.id=b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 4 THEN RAISE EXCEPTION 'undo updated % rows, expected 4', n; END IF;
END
$restore$;
COMMIT;

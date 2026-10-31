-- Restore active on the 15 NCLEX rows from qbi_nclex_hide15_20261030_backup.
-- Writes only "QuestionBankItem".active. Does not drop or delete anything.

BEGIN;

DO $do$
DECLARE
  restored integer;
  unchanged integer;
BEGIN
  IF to_regclass('public.qbi_nclex_hide15_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'abort: qbi_nclex_hide15_20261030_backup does not exist';
  END IF;

  IF (SELECT COUNT(*) FROM qbi_nclex_hide15_20261030_backup) <> 15
    OR EXISTS (
      SELECT 1 FROM qbi_nclex_hide15_20261030_backup WHERE "fieldId" IS DISTINCT FROM 'nursing'
    )
    OR (
      SELECT COUNT(*)
      FROM "QuestionBankItem" q
      JOIN qbi_nclex_hide15_20261030_backup b ON b.id = q.id
      WHERE q."fieldId" = 'nursing'
    ) <> 15
  THEN
    RAISE EXCEPTION 'abort: backup is not exactly 15 NCLEX rows still present in QuestionBankItem';
  END IF;

  UPDATE "QuestionBankItem" q
  SET active = b.active
  FROM qbi_nclex_hide15_20261030_backup b
  WHERE q.id = b.id
    AND q."fieldId" = 'nursing';

  GET DIAGNOSTICS restored = ROW_COUNT;
  IF restored <> 15 THEN
    RAISE EXCEPTION 'abort: restored % rows, expected 15', restored;
  END IF;

  SELECT COUNT(*) INTO unchanged
  FROM "QuestionBankItem" q
  JOIN qbi_nclex_hide15_20261030_backup b ON b.id = q.id
  WHERE q.active IS NOT DISTINCT FROM b.active
    AND (to_jsonb(q) - 'active') IS NOT DISTINCT FROM (to_jsonb(b) - 'active');

  IF unchanged <> 15 THEN
    RAISE EXCEPTION 'abort: undo changed a column other than active (% rows intact)', unchanged;
  END IF;
END
$do$;

COMMIT;

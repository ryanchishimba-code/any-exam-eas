-- Restore the 194 FNP rows from qbi_fnp_content_20261111_backup.
-- Project lively-silence-56893462, database anyexameasy.
-- Restores only the columns this change writes. Does not DROP the backup table.

DO $$
DECLARE
  n integer;
  fnp integer;
BEGIN
  IF to_regclass('public.qbi_fnp_content_20261111_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table qbi_fnp_content_20261111_backup is missing';
  END IF;
  SELECT COUNT(*)::int,
         COUNT(*) FILTER (WHERE "fieldId" = 'aanp-fnp')::int
    INTO n, fnp
  FROM qbi_fnp_content_20261111_backup;
  IF n <> 194 OR fnp <> 194 THEN
    RAISE EXCEPTION 'backup expected exactly 194 FNP rows, found % (% FNP)', n, fnp;
  END IF;
END $$;

UPDATE "QuestionBankItem" AS q
SET
  options = b.options,
  "correctAnswer" = b."correctAnswer",
  explanation = b.explanation,
  "references" = b."references",
  active = b.active,
  manual_correction = b.manual_correction,
  "updatedAt" = b."updatedAt"
FROM qbi_fnp_content_20261111_backup AS b
WHERE q.id = b.id
  AND q."fieldId" = 'aanp-fnp'
  AND b."fieldId" = 'aanp-fnp';

DO $$
DECLARE
  n integer;
BEGIN
  SELECT COUNT(*)::int INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_fnp_content_20261111_backup b ON b.id = q.id
  WHERE q.options = b.options
    AND q."correctAnswer" = b."correctAnswer"
    AND q.explanation = b.explanation
    AND q."references" IS NOT DISTINCT FROM b."references"
    AND q.active IS NOT DISTINCT FROM b.active
    AND q.manual_correction IS NOT DISTINCT FROM b.manual_correction;
  IF n <> 194 THEN
    RAISE EXCEPTION 'undo restored % of 194 rows', n;
  END IF;
END $$;

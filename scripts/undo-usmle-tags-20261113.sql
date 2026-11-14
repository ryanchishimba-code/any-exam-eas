-- Undo the 2026-11-13 USMLE tag hygiene pass.
-- Restores 1012 rows from qbi_usmle_tags_20261113_backup.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-tags-20261113.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_tags_20261113_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_tags_20261113_backup) <> 1012 THEN
    RAISE EXCEPTION 'backup row count %, expected 1012', (SELECT COUNT(*) FROM qbi_usmle_tags_20261113_backup);
  END IF;
END
$check$;
DO $restore$
DECLARE n integer;
BEGIN
  UPDATE "QuestionBankItem" AS q
  SET "subjectId"=b."subjectId", "blueprintDomain"=b."blueprintDomain",
      "blueprintTopic"=b."blueprintTopic", difficulty=b.difficulty,
      manual_correction=b.manual_correction, "generationMeta"=b."generationMeta",
      "updatedAt"=b."updatedAt"
  FROM qbi_usmle_tags_20261113_backup AS b
  WHERE q.id=b.id;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1012 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 1012', n;
  END IF;
END
$restore$;
COMMIT;

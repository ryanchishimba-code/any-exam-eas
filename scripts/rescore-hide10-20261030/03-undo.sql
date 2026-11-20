-- Restore active (and updatedAt) for the 10 rescore hides from
-- qbi_rescore_hide10_20261030_backup. Does not drop the backup.
-- Aborts unless the backup is exactly 7 pharmacy (NAPLEX) and 3 nursing (NCLEX)
-- and exactly those 10 rows are updated.
--
-- Run after 02-apply.sql: \i 03-undo.sql

DO $undo$
DECLARE
  backup_rows int;
  pharmacy int;
  nursing int;
  restored int;
BEGIN
  IF to_regclass('public.qbi_rescore_hide10_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_rescore_hide10_20261030_backup is missing';
  END IF;

  CREATE TEMP TABLE rescore_hide10_expected_undo (
    id text PRIMARY KEY,
    field_id text NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO rescore_hide10_expected_undo (id, field_id) VALUES
    ('cmr4bs38g00151ycjtidtao40', 'pharmacy'),
    ('cmshj9yog002g1yorbkxdjnpd', 'pharmacy'),
    ('cmqwa0yg2001k1y2329bmxlxl', 'pharmacy'),
    ('cmr4k7qe0003x1yrnlg62lpks', 'pharmacy'),
    ('cmr4itbyk003y1y7uuffj33xc', 'pharmacy'),
    ('cmr076v7v000y1yyz30espdt8', 'pharmacy'),
    ('cmqvzckv1001d1yttz4l9y6nu', 'pharmacy'),
    ('cmr7fturd00601y59rwyt4cma', 'nursing'),
    ('cmr7h3bb700271yx3ujnp5ov1', 'nursing'),
    ('cmr770g4d00ua1ywuerwp5c23', 'nursing');

  IF (SELECT COUNT(*) FROM rescore_hide10_expected_undo) <> 10 THEN
    RAISE EXCEPTION 'expected id list is not 10 rows';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM rescore_hide10_expected_undo
    WHERE id IN ('cmr7zcej000141y1wghnj7f0k', 'cmqgu8ro6002s1y4q1rxo6759')
  ) THEN
    RAISE EXCEPTION 'an OK row is in the undo set';
  END IF;

  SELECT COUNT(*) INTO backup_rows FROM qbi_rescore_hide10_20261030_backup;
  SELECT
    COUNT(*) FILTER (WHERE b."fieldId" = 'pharmacy'),
    COUNT(*) FILTER (WHERE b."fieldId" = 'nursing')
  INTO pharmacy, nursing
  FROM qbi_rescore_hide10_20261030_backup b
  JOIN rescore_hide10_expected_undo e ON e.id = b.id AND e.field_id = b."fieldId";

  IF backup_rows <> 10 OR pharmacy <> 7 OR nursing <> 3 THEN
    RAISE EXCEPTION 'backup board check failed: rows %, pharmacy %, nursing %', backup_rows, pharmacy, nursing;
  END IF;

  UPDATE "QuestionBankItem" q
  SET active = b.active,
      "updatedAt" = b."updatedAt"
  FROM qbi_rescore_hide10_20261030_backup b
  JOIN rescore_hide10_expected_undo e ON e.id = b.id AND e.field_id = b."fieldId"
  WHERE q.id = b.id
    AND q."fieldId" = b."fieldId";

  GET DIAGNOSTICS restored = ROW_COUNT;
  IF restored <> 10 THEN
    RAISE EXCEPTION 'undo updated % rows, expected 10', restored;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "QuestionBankItem" q
    JOIN qbi_rescore_hide10_20261030_backup b ON b.id = q.id
    JOIN rescore_hide10_expected_undo e ON e.id = q.id AND e.field_id = q."fieldId"
    WHERE q.active IS DISTINCT FROM b.active
  ) THEN
    RAISE EXCEPTION 'undo did not restore active from the backup';
  END IF;

  RAISE NOTICE 'restored active on % rows from backup', restored;
END
$undo$;

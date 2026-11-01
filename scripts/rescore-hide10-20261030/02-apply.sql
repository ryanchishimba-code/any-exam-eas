-- Hide the 10 Exam Expert CONFIRMED rescore items by setting active = false.
-- Ryan approved this hide at 8:24 PM CT on 2026-10-30.
-- Touches those ids only. Does not change stems, options, keys, rationales, qaPassed, or curation_meta.
-- Requires qbi_rescore_hide10_20261030_backup from 01-backup.sql.
-- Aborts unless the live rows and the backup are exactly 7 pharmacy (NAPLEX) and 3 nursing (NCLEX).
-- Also sets updatedAt so the hide is visible to later reads. 03-undo.sql restores both columns.
--
-- Dry run: BEGIN; \i 01-backup.sql; \i 02-apply.sql; ROLLBACK;
-- Apply:   BEGIN; \i 01-backup.sql; \i 02-apply.sql; COMMIT;

DO $apply$
DECLARE
  found int;
  matched int;
  pharmacy int;
  nursing int;
  backup_rows int;
  updated int;
BEGIN
  IF to_regclass('public.qbi_rescore_hide10_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'qbi_rescore_hide10_20261030_backup is missing; run 01-backup.sql first';
  END IF;

  CREATE TEMP TABLE rescore_hide10_expected_apply (
    id text PRIMARY KEY,
    field_id text NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO rescore_hide10_expected_apply (id, field_id) VALUES
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

  IF (SELECT COUNT(*) FROM rescore_hide10_expected_apply) <> 10 THEN
    RAISE EXCEPTION 'expected id list is not 10 rows';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM rescore_hide10_expected_apply
    WHERE id IN ('cmr7zcej000141y1wghnj7f0k', 'cmqgu8ro6002s1y4q1rxo6759')
  ) THEN
    RAISE EXCEPTION 'an OK row is in the hide set';
  END IF;

  SELECT
    COUNT(*) FILTER (WHERE q.id IS NOT NULL),
    COUNT(*) FILTER (WHERE q."fieldId" = e.field_id),
    COUNT(*) FILTER (WHERE e.field_id = 'pharmacy' AND q."fieldId" = e.field_id),
    COUNT(*) FILTER (WHERE e.field_id = 'nursing' AND q."fieldId" = e.field_id)
  INTO found, matched, pharmacy, nursing
  FROM rescore_hide10_expected_apply e
  LEFT JOIN "QuestionBankItem" q ON q.id = e.id;

  IF found <> 10 OR matched <> 10 OR pharmacy <> 7 OR nursing <> 3 THEN
    RAISE EXCEPTION
      'board check failed: found %, matched %, pharmacy %, nursing % (expected 10, 10, 7, 3)',
      found, matched, pharmacy, nursing;
  END IF;

  SELECT COUNT(*) INTO backup_rows FROM qbi_rescore_hide10_20261030_backup;
  SELECT
    COUNT(*) FILTER (WHERE b."fieldId" = 'pharmacy'),
    COUNT(*) FILTER (WHERE b."fieldId" = 'nursing')
  INTO pharmacy, nursing
  FROM qbi_rescore_hide10_20261030_backup b
  JOIN rescore_hide10_expected_apply e ON e.id = b.id AND e.field_id = b."fieldId";

  IF backup_rows <> 10 OR pharmacy <> 7 OR nursing <> 3 THEN
    RAISE EXCEPTION 'backup board check failed: rows %, pharmacy %, nursing %', backup_rows, pharmacy, nursing;
  END IF;

  UPDATE "QuestionBankItem" q
  SET active = false,
      "updatedAt" = NOW()
  FROM rescore_hide10_expected_apply e
  WHERE q.id = e.id
    AND q."fieldId" = e.field_id;

  GET DIAGNOSTICS updated = ROW_COUNT;
  IF updated <> 10 THEN
    RAISE EXCEPTION 'apply updated % rows, expected 10', updated;
  END IF;

  IF (
    SELECT COUNT(*)
    FROM "QuestionBankItem" q
    JOIN rescore_hide10_expected_apply e ON e.id = q.id AND e.field_id = q."fieldId"
    WHERE q.active = false
  ) <> 10 THEN
    RAISE EXCEPTION 'apply left a confirmed row active';
  END IF;

  RAISE NOTICE 'set active=false on % rows', updated;
END
$apply$;

-- Backup the 10 Exam Expert CONFIRMED rescore hides.
-- Ryan approved this hide at 8:24 PM CT on 2026-10-30.
-- OK rows are not included: cmr7zcej000141y1wghnj7f0k (NAPLEX), cmqgu8ro6002s1y4q1rxo6759 (FNP).
-- Copies every QuestionBankItem column, including embedding, into
-- qbi_rescore_hide10_20261030_backup. Does not update live rows and does not drop anything.
-- Aborts unless those ids are exactly 7 pharmacy (NAPLEX) and 3 nursing (NCLEX).
--
-- Dry run: BEGIN; \i 01-backup.sql; \i 02-apply.sql; ROLLBACK;
-- Apply:   BEGIN; \i 01-backup.sql; \i 02-apply.sql; COMMIT;
-- Undo:    \i 03-undo.sql

DO $backup$
DECLARE
  cols text;
  found int;
  matched int;
  pharmacy int;
  nursing int;
  backed int;
  column_count int;
BEGIN
  IF to_regclass('public.qbi_rescore_hide10_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_rescore_hide10_20261030_backup already exists; refusing to replace it';
  END IF;

  CREATE TEMP TABLE rescore_hide10_expected_backup (
    id text PRIMARY KEY,
    field_id text NOT NULL
  ) ON COMMIT DROP;

  INSERT INTO rescore_hide10_expected_backup (id, field_id) VALUES
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

  IF (SELECT COUNT(*) FROM rescore_hide10_expected_backup) <> 10 THEN
    RAISE EXCEPTION 'expected id list is not 10 rows';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM rescore_hide10_expected_backup
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
  FROM rescore_hide10_expected_backup e
  LEFT JOIN "QuestionBankItem" q ON q.id = e.id;

  IF found <> 10 OR matched <> 10 OR pharmacy <> 7 OR nursing <> 3 THEN
    RAISE EXCEPTION
      'board check failed: found %, matched %, pharmacy %, nursing % (expected 10, 10, 7, 3)',
      found, matched, pharmacy, nursing;
  END IF;

  SELECT
    string_agg(format('%I', column_name), ', ' ORDER BY ordinal_position),
    COUNT(*)
  INTO cols, column_count
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'QuestionBankItem';

  IF column_count < 40
     OR cols IS NULL
     OR position('embedding' IN cols) = 0
     OR position('manual_correction' IN cols) = 0
     OR position('curation_meta' IN cols) = 0 THEN
    RAISE EXCEPTION 'QuestionBankItem column list is incomplete (% columns)', column_count;
  END IF;

  EXECUTE format(
    $q$
      CREATE TABLE qbi_rescore_hide10_20261030_backup AS
      SELECT %s
      FROM "QuestionBankItem"
      WHERE id IN (SELECT id FROM rescore_hide10_expected_backup)
        AND (
          ("fieldId" = 'pharmacy' AND id IN (
            'cmr4bs38g00151ycjtidtao40',
            'cmshj9yog002g1yorbkxdjnpd',
            'cmqwa0yg2001k1y2329bmxlxl',
            'cmr4k7qe0003x1yrnlg62lpks',
            'cmr4itbyk003y1y7uuffj33xc',
            'cmr076v7v000y1yyz30espdt8',
            'cmqvzckv1001d1yttz4l9y6nu'
          ))
          OR ("fieldId" = 'nursing' AND id IN (
            'cmr7fturd00601y59rwyt4cma',
            'cmr7h3bb700271yx3ujnp5ov1',
            'cmr770g4d00ua1ywuerwp5c23'
          ))
        )
    $q$,
    cols
  );

  EXECUTE 'ALTER TABLE qbi_rescore_hide10_20261030_backup ADD PRIMARY KEY (id)';

  SELECT COUNT(*) INTO backed FROM qbi_rescore_hide10_20261030_backup;
  SELECT
    COUNT(*) FILTER (WHERE "fieldId" = 'pharmacy'),
    COUNT(*) FILTER (WHERE "fieldId" = 'nursing')
  INTO pharmacy, nursing
  FROM qbi_rescore_hide10_20261030_backup;

  IF backed <> 10 OR pharmacy <> 7 OR nursing <> 3 THEN
    RAISE EXCEPTION 'backup row check failed: rows %, pharmacy %, nursing %', backed, pharmacy, nursing;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM qbi_rescore_hide10_20261030_backup b
    JOIN "QuestionBankItem" q ON q.id = b.id
    WHERE q."contentHash" IS DISTINCT FROM b."contentHash"
       OR q."fieldId" IS DISTINCT FROM b."fieldId"
       OR q.active IS DISTINCT FROM b.active
       OR q.question IS DISTINCT FROM b.question
       OR q."correctAnswer" IS DISTINCT FROM b."correctAnswer"
  ) THEN
    RAISE EXCEPTION 'backup does not match the live rows';
  END IF;

  RAISE NOTICE 'backed up % rows (pharmacy %, nursing %)', backed, pharmacy, nursing;
END
$backup$;

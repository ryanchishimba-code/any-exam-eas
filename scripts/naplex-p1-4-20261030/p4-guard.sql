-- Abort unless the backup has exactly 54 rows and every live row is pharmacy/NAPLEX.
DO $guard$
DECLARE
  n int;
  bad int;
  live int;
BEGIN
  IF current_database() <> 'anyexameasy' THEN
    RAISE EXCEPTION 'p4 abort: connected to %', current_database();
  END IF;
  IF to_regclass('public.qbi_naplex_p4_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'p4 abort: public.qbi_naplex_p4_20261030_backup is missing';
  END IF;
  SELECT count(*) INTO n FROM public.qbi_naplex_p4_20261030_backup;
  IF n <> 54 THEN
    RAISE EXCEPTION 'p4 abort: backup rows % <> 54', n;
  END IF;
  SELECT count(*) INTO bad
  FROM public.qbi_naplex_p4_20261030_backup
  WHERE "fieldId" IS DISTINCT FROM 'pharmacy';
  IF bad <> 0 THEN
    RAISE EXCEPTION 'p4 abort: % backup rows are not pharmacy/NAPLEX', bad;
  END IF;
  SELECT count(*) INTO live
  FROM public.qbi_naplex_p4_20261030_backup b
  JOIN "QuestionBankItem" q ON q.id = b.id AND q."fieldId" = 'pharmacy';
  IF live <> 54 THEN
    RAISE EXCEPTION 'p4 abort: % of 54 live rows are pharmacy/NAPLEX', live;
  END IF;
END
$guard$;

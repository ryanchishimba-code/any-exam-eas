-- Post-apply counts. Raises (and, inside the apply transaction, aborts) unless they match.
DO $assert$
DECLARE n int;
BEGIN
  IF (SELECT count(*) FROM public.qbi_naplex_p1_20261030_backup) <> 25 THEN
    RAISE EXCEPTION 'p1 verify backup count drifted';
  END IF;
  SELECT count(*) INTO n
  FROM public.qbi_naplex_p1_20261030_backup b
  JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q."fieldId" IS DISTINCT FROM 'pharmacy';
  IF n <> 0 THEN
    RAISE EXCEPTION 'p1 verify % rows are not pharmacy/NAPLEX', n;
  END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p1_20261030_backup b ON b.id = q.id
  WHERE q."fieldId" = 'pharmacy'
    AND q.curation_meta #>> '{naplexSprint,pkg}' = 'P1';
  IF n <> 25 THEN RAISE EXCEPTION 'P1 verify naplexSprint % <> 25', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p1_20261030_backup b ON b.id = q.id
  WHERE q.explanation IS DISTINCT FROM b.explanation;
  IF n <> 21 THEN RAISE EXCEPTION 'P1 verify explanation changes % <> 21', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p1_20261030_backup b ON b.id = q.id
  WHERE q.active IS DISTINCT FROM b.active AND q.active = false;
  IF n <> 2 THEN RAISE EXCEPTION 'P1 verify hides % <> 2', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p1_20261030_backup b ON b.id = q.id
  WHERE q."subjectId" IS DISTINCT FROM b."subjectId";
  IF n <> 2 THEN RAISE EXCEPTION 'P1 verify subject tags % <> 2', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p1_20261030_backup b ON b.id = q.id
  WHERE q.difficulty IS DISTINCT FROM b.difficulty
     OR q."qaPassed" IS DISTINCT FROM b."qaPassed"
     OR q."blueprintDomain" IS DISTINCT FROM b."blueprintDomain";
  IF n <> 0 THEN RAISE EXCEPTION 'P1 verify unexpected column changes %', n; END IF;

END
$assert$;

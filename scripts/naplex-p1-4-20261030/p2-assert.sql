-- Post-apply counts. Raises (and, inside the apply transaction, aborts) unless they match.
DO $assert$
DECLARE n int;
BEGIN
  IF (SELECT count(*) FROM public.qbi_naplex_p2_20261030_backup) <> 1440 THEN
    RAISE EXCEPTION 'p2 verify backup count drifted';
  END IF;
  SELECT count(*) INTO n
  FROM public.qbi_naplex_p2_20261030_backup b
  JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q."fieldId" IS DISTINCT FROM 'pharmacy';
  IF n <> 0 THEN
    RAISE EXCEPTION 'p2 verify % rows are not pharmacy/NAPLEX', n;
  END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p2_20261030_backup b ON b.id = q.id
  WHERE q.explanation IS DISTINCT FROM b.explanation
    AND q.curation_meta #>> '{naplexSprint,pkg}' = 'P2';
  IF n <> 1373 THEN RAISE EXCEPTION 'P2 verify boilerplate % <> 1373', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p2_20261030_backup b ON b.id = q.id
  WHERE q."references" IS DISTINCT FROM b."references";
  IF n <> 109 THEN RAISE EXCEPTION 'P2 verify NABP labels % <> 109', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p2_20261030_backup b ON b.id = q.id
  WHERE q.explanation IS DISTINCT FROM b.explanation
     OR q."references" IS DISTINCT FROM b."references";
  IF n <> 1440 THEN RAISE EXCEPTION 'P2 verify touched rows % <> 1440', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p2_20261030_backup b ON b.id = q.id
  WHERE q.question IS DISTINCT FROM b.question
     OR q.options IS DISTINCT FROM b.options
     OR q."correctAnswer" IS DISTINCT FROM b."correctAnswer"
     OR q.active IS DISTINCT FROM b.active
     OR q."subjectId" IS DISTINCT FROM b."subjectId"
     OR q.difficulty IS DISTINCT FROM b.difficulty
     OR q."blueprintDomain" IS DISTINCT FROM b."blueprintDomain";
  IF n <> 0 THEN RAISE EXCEPTION 'P2 verify unexpected column changes %', n; END IF;

END
$assert$;

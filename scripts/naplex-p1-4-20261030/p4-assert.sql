-- Post-apply counts. Raises (and, inside the apply transaction, aborts) unless they match.
DO $assert$
DECLARE n int;
BEGIN
  IF (SELECT count(*) FROM public.qbi_naplex_p4_20261030_backup) <> 54 THEN
    RAISE EXCEPTION 'p4 verify backup count drifted';
  END IF;
  SELECT count(*) INTO n
  FROM public.qbi_naplex_p4_20261030_backup b
  JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q."fieldId" IS DISTINCT FROM 'pharmacy';
  IF n <> 0 THEN
    RAISE EXCEPTION 'p4 verify % rows are not pharmacy/NAPLEX', n;
  END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p4_20261030_backup b ON b.id = q.id
  WHERE q.difficulty IS DISTINCT FROM b.difficulty;
  IF n <> 17 THEN RAISE EXCEPTION 'P4 verify difficulty % <> 17', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p4_20261030_backup b ON b.id = q.id
  WHERE q.active IS DISTINCT FROM b.active AND q.active = false;
  IF n <> 37 THEN RAISE EXCEPTION 'P4 verify DOAC retirements % <> 37', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p4_20261030_backup b ON b.id = q.id
  WHERE q.difficulty IS DISTINCT FROM b.difficulty
     OR q.active IS DISTINCT FROM b.active;
  IF n <> 54 THEN RAISE EXCEPTION 'P4 verify touched rows % <> 54', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p4_20261030_backup b ON b.id = q.id
  WHERE q.question IS DISTINCT FROM b.question
     OR q.options IS DISTINCT FROM b.options
     OR q."correctAnswer" IS DISTINCT FROM b."correctAnswer"
     OR q.explanation IS DISTINCT FROM b.explanation
     OR q."references" IS DISTINCT FROM b."references"
     OR q."subjectId" IS DISTINCT FROM b."subjectId"
     OR q."blueprintDomain" IS DISTINCT FROM b."blueprintDomain"
     OR q."qaPassed" IS DISTINCT FROM b."qaPassed";
  IF n <> 0 THEN RAISE EXCEPTION 'P4 verify unexpected column changes %', n; END IF;

END
$assert$;

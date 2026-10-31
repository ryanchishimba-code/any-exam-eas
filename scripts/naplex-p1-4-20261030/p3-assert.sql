-- Post-apply counts. Raises (and, inside the apply transaction, aborts) unless they match.
DO $assert$
DECLARE n int;
BEGIN
  IF (SELECT count(*) FROM public.qbi_naplex_p3_20261030_backup) <> 13137 THEN
    RAISE EXCEPTION 'p3 verify backup count drifted';
  END IF;
  SELECT count(*) INTO n
  FROM public.qbi_naplex_p3_20261030_backup b
  JOIN "QuestionBankItem" q ON q.id = b.id
  WHERE q."fieldId" IS DISTINCT FROM 'pharmacy';
  IF n <> 0 THEN
    RAISE EXCEPTION 'p3 verify % rows are not pharmacy/NAPLEX', n;
  END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p3_20261030_backup b ON b.id = q.id
  WHERE q.curation_meta #>> '{nabp2025,domain}' IS NOT NULL
    AND q.curation_meta #>> '{nabp2025,code}' IS NOT NULL;
  IF n <> 13137 THEN RAISE EXCEPTION 'P3 verify nabp2025 % <> 13137', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p3_20261030_backup b ON b.id = q.id
  WHERE q."subjectId" IS DISTINCT FROM b."subjectId";
  IF n <> 507 THEN RAISE EXCEPTION 'P3 verify subject changes % <> 507', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p3_20261030_backup b ON b.id = q.id
  WHERE q."subjectId" IS DISTINCT FROM b."subjectId"
    AND q."subjectId" = 'compounding-calculations';
  IF n <> 507 THEN RAISE EXCEPTION 'P3 verify calc retag % <> 507', n; END IF;

  SELECT count(*) INTO n
  FROM "QuestionBankItem" q
  JOIN public.qbi_naplex_p3_20261030_backup b ON b.id = q.id
  WHERE q.question IS DISTINCT FROM b.question
     OR q.options IS DISTINCT FROM b.options
     OR q."correctAnswer" IS DISTINCT FROM b."correctAnswer"
     OR q.explanation IS DISTINCT FROM b.explanation
     OR q."references" IS DISTINCT FROM b."references"
     OR q.active IS DISTINCT FROM b.active
     OR q.difficulty IS DISTINCT FROM b.difficulty
     OR q."blueprintDomain" IS DISTINCT FROM b."blueprintDomain"
     OR q."qaPassed" IS DISTINCT FROM b."qaPassed";
  IF n <> 0 THEN RAISE EXCEPTION 'P3 verify unexpected column changes %', n; END IF;

END
$assert$;

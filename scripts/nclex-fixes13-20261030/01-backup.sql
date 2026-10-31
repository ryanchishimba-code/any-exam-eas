-- NCLEX content rewrite, 2026-10-30. Ryan approved. 13 QuestionBankItem ids only.
-- Citation URLs from items.json source go in "references" (label + url).
-- The source column stays ai-curated/polished so the curated serve pool still includes the row.
-- Select-all correctAnswer is the keyed option texts joined with |||, in option order.
-- Single-best correctAnswer is the option text. itemType vignette / kind mcq matches other NCLEX MCQs.
-- contentHash is sha256(fieldId|subjectId|scenario|stem), lowercased and trimmed, same as the seed sync.
-- manual_correction is set so a later seed match cannot overwrite the rewrite.
-- Stale distractorRationale, clinicalReasoning, keyTakeaways, and expert/visual rationale are removed
-- because they still teach the previous key.

DO $guard$
BEGIN
  IF to_regclass('public.qbi_nclex_fixes13_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'backup table qbi_nclex_fixes13_20261030_backup already exists';
  END IF;
  IF (SELECT count(*) FROM "QuestionBankItem" WHERE id IN ('cmrmu08cb00fx1y3jc9rsnelz', 'cmroe7xjf00061ybznd77tf3j', 'cmr8ufrug009r1y0yy7zwc3fz', 'cmr74f8qx004b1ywujjp4k4ak', 'cmra5zpf600231ylwahnk5q4e', 'cmr7e70og002j1y9txjux05cj', 'cmqwues7900001y1sda6lynv6', 'cmr7gipdt00b41y59f9fm1kfb', 'cmr0xdqyg00071ybsvb4sqisw', 'cmrlxlbxn00041yci85r3kb95', 'cmqx0b7wx000h1y1klag1mky3', 'cmr0ufrka00251y7owlq2oh3d', 'cmr0pfqyf004q1yhdgfkg2m1u')) <> 13 THEN
    RAISE EXCEPTION 'expected exactly 13 QuestionBankItem rows';
  END IF;
  IF (
    SELECT count(*)
    FROM "QuestionBankItem"
    WHERE id IN ('cmrmu08cb00fx1y3jc9rsnelz', 'cmroe7xjf00061ybznd77tf3j', 'cmr8ufrug009r1y0yy7zwc3fz', 'cmr74f8qx004b1ywujjp4k4ak', 'cmra5zpf600231ylwahnk5q4e', 'cmr7e70og002j1y9txjux05cj', 'cmqwues7900001y1sda6lynv6', 'cmr7gipdt00b41y59f9fm1kfb', 'cmr0xdqyg00071ybsvb4sqisw', 'cmrlxlbxn00041yci85r3kb95', 'cmqx0b7wx000h1y1klag1mky3', 'cmr0ufrka00251y7owlq2oh3d', 'cmr0pfqyf004q1yhdgfkg2m1u')
      AND "fieldId" IS DISTINCT FROM 'nursing'
  ) <> 0 THEN
    RAISE EXCEPTION 'a target row is not fieldId nursing';
  END IF;
END
$guard$;

CREATE TABLE qbi_nclex_fixes13_20261030_backup AS
SELECT *
FROM "QuestionBankItem"
WHERE id IN ('cmrmu08cb00fx1y3jc9rsnelz', 'cmroe7xjf00061ybznd77tf3j', 'cmr8ufrug009r1y0yy7zwc3fz', 'cmr74f8qx004b1ywujjp4k4ak', 'cmra5zpf600231ylwahnk5q4e', 'cmr7e70og002j1y9txjux05cj', 'cmqwues7900001y1sda6lynv6', 'cmr7gipdt00b41y59f9fm1kfb', 'cmr0xdqyg00071ybsvb4sqisw', 'cmrlxlbxn00041yci85r3kb95', 'cmqx0b7wx000h1y1klag1mky3', 'cmr0ufrka00251y7owlq2oh3d', 'cmr0pfqyf004q1yhdgfkg2m1u')
  AND "fieldId" = 'nursing';

DO $guard$
BEGIN
  IF (SELECT count(*) FROM qbi_nclex_fixes13_20261030_backup) <> 13 THEN
    RAISE EXCEPTION 'backup did not capture 13 rows';
  END IF;
  IF (
    SELECT count(*)
    FROM qbi_nclex_fixes13_20261030_backup
    WHERE "fieldId" IS DISTINCT FROM 'nursing'
  ) <> 0 THEN
    RAISE EXCEPTION 'backup contains a non-nursing row';
  END IF;
END
$guard$;

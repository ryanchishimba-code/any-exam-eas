-- Set active = false on the 15 NCLEX rows in qbi_nclex_hide15_20261030_backup.
-- Writes only "QuestionBankItem".active. Stems, options, keys, and explanations stay as they are.
-- Aborts unless the backup holds exactly these 15 NCLEX rows.

BEGIN;

DO $do$
DECLARE
  updated integer;
  unchanged integer;
BEGIN
  IF to_regclass('public.qbi_nclex_hide15_20261030_backup') IS NULL THEN
    RAISE EXCEPTION 'abort: qbi_nclex_hide15_20261030_backup does not exist';
  END IF;

  IF (
    SELECT COUNT(*) FROM (
      SELECT id FROM qbi_nclex_hide15_20261030_backup
      EXCEPT
      SELECT id FROM (
        VALUES
          ('cmqwues7900001y1sda6lynv6'),
          ('cmqwvzk8l00001y06wrt9m3gv'),
          ('cmqx0b7wx000h1y1klag1mky3'),
          ('cmr0pfqyf004q1yhdgfkg2m1u'),
          ('cmr0ufrka00251y7owlq2oh3d'),
          ('cmr0xdqyg00071ybsvb4sqisw'),
          ('cmr74f8qx004b1ywujjp4k4ak'),
          ('cmr7e70og002j1y9txjux05cj'),
          ('cmr7gipdt00b41y59f9fm1kfb'),
          ('cmr8ufrug009r1y0yy7zwc3fz'),
          ('cmra5zpf600231ylwahnk5q4e'),
          ('cmrlxlbxn00041yci85r3kb95'),
          ('cmrm1rwtv003n1ygas98stgni'),
          ('cmrmu08cb00fx1y3jc9rsnelz'),
          ('cmroe7xjf00061ybznd77tf3j')
      ) AS want(id)
    ) AS extra
  ) <> 0
  OR (
    SELECT COUNT(*) FROM (
      SELECT id FROM (
        VALUES
          ('cmqwues7900001y1sda6lynv6'),
          ('cmqwvzk8l00001y06wrt9m3gv'),
          ('cmqx0b7wx000h1y1klag1mky3'),
          ('cmr0pfqyf004q1yhdgfkg2m1u'),
          ('cmr0ufrka00251y7owlq2oh3d'),
          ('cmr0xdqyg00071ybsvb4sqisw'),
          ('cmr74f8qx004b1ywujjp4k4ak'),
          ('cmr7e70og002j1y9txjux05cj'),
          ('cmr7gipdt00b41y59f9fm1kfb'),
          ('cmr8ufrug009r1y0yy7zwc3fz'),
          ('cmra5zpf600231ylwahnk5q4e'),
          ('cmrlxlbxn00041yci85r3kb95'),
          ('cmrm1rwtv003n1ygas98stgni'),
          ('cmrmu08cb00fx1y3jc9rsnelz'),
          ('cmroe7xjf00061ybznd77tf3j')
      ) AS want(id)
      EXCEPT
      SELECT id FROM qbi_nclex_hide15_20261030_backup
    ) AS missing
  ) <> 0
  OR (SELECT COUNT(*) FROM qbi_nclex_hide15_20261030_backup) <> 15
  OR EXISTS (
    SELECT 1 FROM qbi_nclex_hide15_20261030_backup WHERE "fieldId" IS DISTINCT FROM 'nursing'
  )
  OR (
    SELECT COUNT(*)
    FROM "QuestionBankItem" q
    JOIN qbi_nclex_hide15_20261030_backup b ON b.id = q.id
    WHERE q."fieldId" = 'nursing'
  ) <> 15
  THEN
    RAISE EXCEPTION 'abort: backup is not exactly the 15 NCLEX rows';
  END IF;

  UPDATE "QuestionBankItem" q
  SET active = false
  FROM qbi_nclex_hide15_20261030_backup b
  WHERE q.id = b.id
    AND q."fieldId" = 'nursing';

  GET DIAGNOSTICS updated = ROW_COUNT;
  IF updated <> 15 THEN
    RAISE EXCEPTION 'abort: updated % rows, expected 15', updated;
  END IF;

  SELECT COUNT(*) INTO unchanged
  FROM "QuestionBankItem" q
  JOIN qbi_nclex_hide15_20261030_backup b ON b.id = q.id
  WHERE q.active = false
    AND (to_jsonb(q) - 'active') IS NOT DISTINCT FROM (to_jsonb(b) - 'active');

  IF unchanged <> 15 THEN
    RAISE EXCEPTION 'abort: a column other than active changed (% rows intact)', unchanged;
  END IF;
END
$do$;

COMMIT;

-- Backup the 15 NCLEX rows approved for hiding on 2026-10-30.
-- Target: production QuestionBankItem (Neon project lively-silence-56893462, database anyexameasy).
-- Creates qbi_nclex_hide15_20261030_backup with the full rows.
-- Does not update, delete, or drop any QuestionBankItem row.
-- Aborts unless exactly these 15 ids exist and every one is NCLEX (fieldId = nursing).

BEGIN;

DO $do$
DECLARE
  listed integer;
  matched integer;
  nclex integer;
BEGIN
  IF to_regclass('public.qbi_nclex_hide15_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_nclex_hide15_20261030_backup already exists';
  END IF;

  SELECT COUNT(*) INTO listed
  FROM (
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
  ) AS want(id);

  SELECT COUNT(*) INTO matched
  FROM "QuestionBankItem"
  WHERE id IN (
    'cmqwues7900001y1sda6lynv6',
    'cmqwvzk8l00001y06wrt9m3gv',
    'cmqx0b7wx000h1y1klag1mky3',
    'cmr0pfqyf004q1yhdgfkg2m1u',
    'cmr0ufrka00251y7owlq2oh3d',
    'cmr0xdqyg00071ybsvb4sqisw',
    'cmr74f8qx004b1ywujjp4k4ak',
    'cmr7e70og002j1y9txjux05cj',
    'cmr7gipdt00b41y59f9fm1kfb',
    'cmr8ufrug009r1y0yy7zwc3fz',
    'cmra5zpf600231ylwahnk5q4e',
    'cmrlxlbxn00041yci85r3kb95',
    'cmrm1rwtv003n1ygas98stgni',
    'cmrmu08cb00fx1y3jc9rsnelz',
    'cmroe7xjf00061ybznd77tf3j'
  );

  SELECT COUNT(*) INTO nclex
  FROM "QuestionBankItem"
  WHERE "fieldId" = 'nursing'
    AND id IN (
      'cmqwues7900001y1sda6lynv6',
      'cmqwvzk8l00001y06wrt9m3gv',
      'cmqx0b7wx000h1y1klag1mky3',
      'cmr0pfqyf004q1yhdgfkg2m1u',
      'cmr0ufrka00251y7owlq2oh3d',
      'cmr0xdqyg00071ybsvb4sqisw',
      'cmr74f8qx004b1ywujjp4k4ak',
      'cmr7e70og002j1y9txjux05cj',
      'cmr7gipdt00b41y59f9fm1kfb',
      'cmr8ufrug009r1y0yy7zwc3fz',
      'cmra5zpf600231ylwahnk5q4e',
      'cmrlxlbxn00041yci85r3kb95',
      'cmrm1rwtv003n1ygas98stgni',
      'cmrmu08cb00fx1y3jc9rsnelz',
      'cmroe7xjf00061ybznd77tf3j'
    );

  IF listed <> 15 OR matched <> 15 OR nclex <> 15 THEN
    RAISE EXCEPTION 'abort: listed %, matched %, nclex % (need 15, 15, and 15)', listed, matched, nclex;
  END IF;
END
$do$;

CREATE TABLE qbi_nclex_hide15_20261030_backup AS
SELECT *
FROM "QuestionBankItem"
WHERE "fieldId" = 'nursing'
  AND id IN (
    'cmqwues7900001y1sda6lynv6',
    'cmqwvzk8l00001y06wrt9m3gv',
    'cmqx0b7wx000h1y1klag1mky3',
    'cmr0pfqyf004q1yhdgfkg2m1u',
    'cmr0ufrka00251y7owlq2oh3d',
    'cmr0xdqyg00071ybsvb4sqisw',
    'cmr74f8qx004b1ywujjp4k4ak',
    'cmr7e70og002j1y9txjux05cj',
    'cmr7gipdt00b41y59f9fm1kfb',
    'cmr8ufrug009r1y0yy7zwc3fz',
    'cmra5zpf600231ylwahnk5q4e',
    'cmrlxlbxn00041yci85r3kb95',
    'cmrm1rwtv003n1ygas98stgni',
    'cmrmu08cb00fx1y3jc9rsnelz',
    'cmroe7xjf00061ybznd77tf3j'
  );

DO $do$
DECLARE
  backed integer;
BEGIN
  SELECT COUNT(*) INTO backed FROM qbi_nclex_hide15_20261030_backup;
  IF backed <> 15 THEN
    RAISE EXCEPTION 'abort: backup has % rows', backed;
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_nclex_hide15_20261030_backup WHERE "fieldId" IS DISTINCT FROM 'nursing'
  ) THEN
    RAISE EXCEPTION 'abort: backup contains a non-NCLEX row';
  END IF;
END
$do$;

COMMIT;

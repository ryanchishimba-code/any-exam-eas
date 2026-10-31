-- Full-row backup of the 10 FNP items before the 2026-10-30 rewrite.
-- Project lively-silence-56893462, database anyexameasy.
-- Refuses to replace an existing backup. Does not DROP anything.
-- Aborts unless the snapshot is exactly 10 rows and all are aanp-fnp.

DO $$
BEGIN
  IF to_regclass('public.qbi_fnp_rewrites10_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_fnp_rewrites10_20261030_backup already exists; refusing to replace it';
  END IF;
END $$;

CREATE TABLE qbi_fnp_rewrites10_20261030_backup AS
SELECT *
FROM "QuestionBankItem"
WHERE id IN (
    'cmr839bsm008b1ykzrdj3yiih',
    'cmqgumyzl00081y0v4d75sy6p',
    'cmr83geig00281yq5v7fydsc4',
    'cmqgv0tpo000t1ycfxf4k8dya',
    'cmr82v9yq00as1yfvisc0ss9h',
    'cmqgu6htm00241y4rgrcxtunv',
    'cmr83jzri00481yq5cq364vgg',
    'cmr84xt5y008m1y5topmfkoq3',
    'cmtwfmjs9008y1y1ozasi8gai',
    'cmtweyvdh001r1y2nm7xpqfky'
);

DO $$
DECLARE
  n integer;
  fnp integer;
BEGIN
  SELECT COUNT(*)::int,
         COUNT(*) FILTER (WHERE "fieldId" = 'aanp-fnp')::int
    INTO n, fnp
  FROM qbi_fnp_rewrites10_20261030_backup;
  IF n <> 10 OR fnp <> 10 THEN
    RAISE EXCEPTION 'backup expected exactly 10 FNP rows, found % (% FNP)', n, fnp;
  END IF;
END $$;

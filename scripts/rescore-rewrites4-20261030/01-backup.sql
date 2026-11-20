-- Full-row backup of 4 rescore rewrites before the 2026-10-30 apply.
-- Ryan approved 8:36 PM CT. Project lively-silence-56893462, database anyexameasy.
-- Refuses to replace an existing backup. Does not DROP anything.
-- Aborts unless the snapshot is exactly these 4 rows.

DO $guard$
BEGIN
  IF to_regclass('public.qbi_rescore_rewrites4_20261030_backup') IS NOT NULL THEN
    RAISE EXCEPTION 'qbi_rescore_rewrites4_20261030_backup already exists; refusing to replace it';
  END IF;
  IF (SELECT count(*) FROM "QuestionBankItem" WHERE id IN ('cmr7h3bb700271yx3ujnp5ov1', 'cmr770g4d00ua1ywuerwp5c23', 'cmshj9yog002g1yorbkxdjnpd', 'cmr4bs38g00151ycjtidtao40')) <> 4 THEN
    RAISE EXCEPTION 'expected exactly 4 QuestionBankItem rows';
  END IF;
END
$guard$;

CREATE TABLE qbi_rescore_rewrites4_20261030_backup AS
SELECT *
FROM "QuestionBankItem"
WHERE id IN ('cmr7h3bb700271yx3ujnp5ov1', 'cmr770g4d00ua1ywuerwp5c23', 'cmshj9yog002g1yorbkxdjnpd', 'cmr4bs38g00151ycjtidtao40');

DO $guard$
BEGIN
  IF (SELECT count(*) FROM qbi_rescore_rewrites4_20261030_backup) <> 4 THEN
    RAISE EXCEPTION 'backup expected exactly 4 rows';
  END IF;
  IF (
    SELECT count(*)
    FROM qbi_rescore_rewrites4_20261030_backup
    WHERE id IN ('cmr7h3bb700271yx3ujnp5ov1', 'cmr770g4d00ua1ywuerwp5c23', 'cmshj9yog002g1yorbkxdjnpd', 'cmr4bs38g00151ycjtidtao40')
  ) <> 4 THEN
    RAISE EXCEPTION 'backup ids are not the approved 4';
  END IF;
END
$guard$;

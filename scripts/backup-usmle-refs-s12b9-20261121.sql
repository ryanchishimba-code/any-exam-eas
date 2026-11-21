-- Backup of QuestionBankItem rows before batch s12b9. Does not change those rows.
BEGIN;
CREATE TABLE qbi_usmle_refs_s12b9_20261121_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'b1x329fa184ac810b95976a2c11',
    'b1xe07ca0323d3bce455a44a7e7',
    'b7x0b161a942f7f785c788f8715',
    'cmqxc0uvr00111yma3j8chtgk',
    'cmqxcjv2m00421ymaun0fx2te',
    'cmr4moaud00a61y1elu0an3rb',
    'cmr4ouqcj00m81y1efneq6bj1',
    'cmr4outo500nd1y1en7y5lb9d',
    'cmr4pz7nf00tc1y1eg59h9kzk',
    'cmr88g5ne00dh1yw2n6usq6ea',
    'cmr8bfzmh00zd1yw2aihzlmmx',
    'cmrtffjjt000g1yx2dj7x4rvc',
    'cmrtfrrdd000y1yx2krp6eg52',
    'cmrtqg0eo000n1yx324tyofvc'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b9_20261121_backup) <> 14 THEN
    RAISE EXCEPTION 'backup row count %, expected 14', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b9_20261121_backup);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_refs_s12b9_20261121_backup
    WHERE "fieldId" NOT IN ('usmle-step-1','usmle-step-2')
  ) THEN
    RAISE EXCEPTION 'backup includes a row outside Step 1 and Step 2';
  END IF;
END
$check$;
COMMIT;

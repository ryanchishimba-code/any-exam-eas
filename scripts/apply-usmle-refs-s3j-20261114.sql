-- Citation batch s3j, 2026-11-14.
-- Diagnostic mammography for a palpable mass at age 30 or older, screening start at 40,
-- symptomatic hyponatremia, symptomatic pleural effusion, and primary hypothyroidism.
-- Backup qbi_usmle_refs_s3j_20261114_backup (23 rows). Only references are updated.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3j-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3j_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr8m9edf00km1ygiwronuvvb',
    'cmru8hvps009y1yd6s1q62xt0',
    'cmru3gej400bf1y7wg8a4g65f',
    'cmr8db8h500tz1ylovik4kpi9',
    'cmr8cn9a000nh1ylootexq7kj',
    'cmr8dymbz01411ylotbqlm8w1',
    'cmr8h1gj301xl1ylov04ws80k',
    'cmr97yzec00aj1ywy97l9b3j6',
    'cmr8ei04q01ak1ylo9com7v8t',
    'cmru8hyp400as1yd6my99dfwk',
    'cmr8dymug01461ylon0qjnmx2',
    'cmru3n4o600dp1y7wyedaqru9',
    'cmru3uetx00hp1y7w98gfaowh',
    'cmr8e605g01871ylolmns8jf9',
    'cmr8hrt47023z1ylos9see5t3',
    'cmr8ji7v902nh1yloxtl5564o',
    'cmr4gkacy028x1ykyojt5zwyh',
    'cmr8lqh3j00d71ygiuyqqv7pi',
    'cmr8ncpgn00ty1ygivqwrlme8',
    'cmr97hzog003r1ywy5hj3oiep',
    'cmr8q41y301jc1ygiehbfcc2m',
    'cmru3n4yc00ds1y7wk9i0k3pe',
    'cmruyj6ks00311y2yijc4bcb5'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3j_20261114_backup;
  IF n <> 23 THEN RAISE EXCEPTION 'backup %, expected 23', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3j_0$[{"label": "Merck Manual Professional. Pleural effusion. Symptomatic effusions require thoracentesis. Fluid analysis is often needed to determine the cause.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3j_0$::jsonb
WHERE id = 'cmr8m9edf00km1ygiwronuvvb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_1$[{"label": "Merck Manual Professional. Pleural effusion. Symptomatic effusions require thoracentesis. Fluid analysis is often needed to determine the cause.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3j_1$::jsonb
WHERE id = 'cmru8hvps009y1yd6s1q62xt0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_2$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3j_2$::jsonb
WHERE id = 'cmru3gej400bf1y7wg8a4g65f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_3$[{"label": "NICE NG145. A TSH above the reference range is followed by a free-T4 measurement. Offer levothyroxine as first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3j_3$::jsonb
WHERE id = 'cmr8db8h500tz1ylovik4kpi9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_4$[{"label": "ACR Appropriateness Criteria, Palpable Breast Masses. Diagnostic mammography is usually appropriate for a palpable breast mass at age 30 or older. Under 30, ultrasound is usually appropriate and diagnostic mammography is usually not.", "url": "https://acsearch.acr.org/docs/69495/Narrative/"}]$s3j_4$::jsonb
WHERE id = 'cmr8cn9a000nh1ylootexq7kj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_5$[{"label": "Merck Manual Professional. Pleural effusion. Symptomatic effusions require thoracentesis. Fluid analysis is often needed to determine the cause.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3j_5$::jsonb
WHERE id = 'cmr8dymbz01411ylotbqlm8w1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_6$[{"label": "ACR Appropriateness Criteria, Palpable Breast Masses. Diagnostic mammography is usually appropriate for a palpable breast mass at age 30 or older. Under 30, ultrasound is usually appropriate and diagnostic mammography is usually not.", "url": "https://acsearch.acr.org/docs/69495/Narrative/"}]$s3j_6$::jsonb
WHERE id = 'cmr8h1gj301xl1ylov04ws80k' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_7$[{"label": "Merck Manual Professional. Pleural effusion. Symptomatic effusions require thoracentesis. Fluid analysis is often needed to determine the cause.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3j_7$::jsonb
WHERE id = 'cmr97yzec00aj1ywy97l9b3j6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_8$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3j_8$::jsonb
WHERE id = 'cmr8ei04q01ak1ylo9com7v8t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_9$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3j_9$::jsonb
WHERE id = 'cmru8hyp400as1yd6my99dfwk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_10$[{"label": "Merck Manual Professional. Pleural effusion. Symptomatic effusions require thoracentesis. Fluid analysis is often needed to determine the cause.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3j_10$::jsonb
WHERE id = 'cmr8dymug01461ylon0qjnmx2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_11$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3j_11$::jsonb
WHERE id = 'cmru3n4o600dp1y7wyedaqru9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_12$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3j_12$::jsonb
WHERE id = 'cmru3uetx00hp1y7w98gfaowh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_13$[{"label": "Merck Manual Professional. Pleural effusion. Symptomatic effusions require thoracentesis. Fluid analysis is often needed to determine the cause.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3j_13$::jsonb
WHERE id = 'cmr8e605g01871ylolmns8jf9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_14$[{"label": "NICE NG145. A TSH above the reference range is followed by a free-T4 measurement. Offer levothyroxine as first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3j_14$::jsonb
WHERE id = 'cmr8hrt47023z1ylos9see5t3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_15$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3j_15$::jsonb
WHERE id = 'cmr8ji7v902nh1yloxtl5564o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_16$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3j_16$::jsonb
WHERE id = 'cmr4gkacy028x1ykyojt5zwyh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_17$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3j_17$::jsonb
WHERE id = 'cmr8lqh3j00d71ygiuyqqv7pi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_18$[{"label": "NICE NG145. A TSH above the reference range is followed by a free-T4 measurement. Offer levothyroxine as first-line treatment for primary hypothyroidism.", "url": "https://www.nice.org.uk/guidance/ng145/chapter/Recommendations"}]$s3j_18$::jsonb
WHERE id = 'cmr8ncpgn00ty1ygivqwrlme8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_19$[{"label": "Merck Manual Professional. Pleural effusion. Symptomatic effusions require thoracentesis. Fluid analysis is often needed to determine the cause.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3j_19$::jsonb
WHERE id = 'cmr97hzog003r1ywy5hj3oiep' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_20$[{"label": "Merck Manual Professional. Pleural effusion. Symptomatic effusions require thoracentesis. Fluid analysis is often needed to determine the cause.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3j_20$::jsonb
WHERE id = 'cmr8q41y301jc1ygiehbfcc2m' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_21$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3j_21$::jsonb
WHERE id = 'cmru3n4yc00ds1y7wk9i0k3pe' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3j_22$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3j_22$::jsonb
WHERE id = 'cmruyj6ks00311y2yijc4bcb5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3j_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 23 THEN RAISE EXCEPTION 'cited %, expected 23', n; END IF;
END $cited$;
COMMIT;

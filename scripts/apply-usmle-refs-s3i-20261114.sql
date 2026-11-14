-- Citation batch s3i for served USMLE Step 3 items, 2026-11-14.
-- Hypothyroidism, iron deficiency, symptomatic hyponatremia, and step-1 ACE inhibitor sentences.
-- Backup qbi_usmle_refs_s3i_20261114_backup (18 rows). Only references are updated.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3i-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3i_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmrvwrwgs002j1ye87t8oq943',
    'cmruymc10004u1y2y7u8st6k7',
    'cmruihpf6002y1ycegy3q82hv',
    'cmrwa0afm000k1ynh7ittc63t',
    'cmr9bbrib01dl1ywyvcn1tunw',
    'cmr8ise3s02dy1ylo1zwwd08f',
    'cmruyivho002z1y2yaeezyz7z',
    'cmruigmej002c1yceljx4ijgy',
    'cmr4eelcv01f81yky0jk13e6l',
    'cmr8dymy801471ylob0in1hx5',
    'cmr8fz7fk01n61ylorn92lugq',
    'cmrwa0aj0000l1ynhu4yfcnkx',
    'cmruyigzo002m1y2yd6uanyzi',
    'cmrw9zvdu00091ynhd3z764ms',
    'cmr4cnsgi00nu1yky9wggetxa',
    'cmrvwvb9d004m1ye8xzoyon97',
    'cmrvwvaw4004i1ye8gluqey4g',
    'cmrwa3gg2002p1ynhiigh9m38'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3i_20261114_backup;
  IF n <> 18 THEN RAISE EXCEPTION 'backup %, expected 18', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3i_0$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_0$::jsonb
WHERE id = 'cmrvwrwgs002j1ye87t8oq943' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_1$[{"label": "Merck Manual Professional. Deep venous thrombosis. Diagnosis is by history, examination, and testing, typically with duplex ultrasound.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/peripheral-venous-disorders/deep-venous-thrombosis-dvt"}]$s3i_1$::jsonb
WHERE id = 'cmruymc10004u1y2y7u8st6k7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_2$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_2$::jsonb
WHERE id = 'cmruihpf6002y1ycegy3q82hv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_3$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_3$::jsonb
WHERE id = 'cmrwa0afm000k1ynh7ittc63t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_4$[{"label": "Merck Manual Professional. Deep venous thrombosis. Diagnosis is by history, examination, and testing, typically with duplex ultrasound.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/peripheral-venous-disorders/deep-venous-thrombosis-dvt"}]$s3i_4$::jsonb
WHERE id = 'cmr9bbrib01dl1ywyvcn1tunw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_5$[{"label": "NICE NG136. Offer an ACE inhibitor or an ARB to adults starting step 1 antihypertensive treatment who have type 2 diabetes, or who are aged under 55 and are not of Black African or African-Caribbean family origin.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3i_5$::jsonb
WHERE id = 'cmr8ise3s02dy1ylo1zwwd08f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_6$[{"label": "Merck Manual Professional. Deep venous thrombosis. Diagnosis is by history, examination, and testing, typically with duplex ultrasound.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/peripheral-venous-disorders/deep-venous-thrombosis-dvt"}]$s3i_6$::jsonb
WHERE id = 'cmruyivho002z1y2yaeezyz7z' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_7$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_7$::jsonb
WHERE id = 'cmruigmej002c1yceljx4ijgy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_8$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3i_8$::jsonb
WHERE id = 'cmr4eelcv01f81yky0jk13e6l' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_9$[{"label": "NICE NG136. Offer an ACE inhibitor or an ARB to adults starting step 1 antihypertensive treatment who have type 2 diabetes, or who are aged under 55 and are not of Black African or African-Caribbean family origin.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3i_9$::jsonb
WHERE id = 'cmr8dymy801471ylob0in1hx5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_10$[{"label": "NICE NG136. Offer an ACE inhibitor or an ARB to adults starting step 1 antihypertensive treatment who have type 2 diabetes, or who are aged under 55 and are not of Black African or African-Caribbean family origin.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3i_10$::jsonb
WHERE id = 'cmr8fz7fk01n61ylorn92lugq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_11$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3i_11$::jsonb
WHERE id = 'cmrwa0aj0000l1ynhu4yfcnkx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_12$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_12$::jsonb
WHERE id = 'cmruyigzo002m1y2yd6uanyzi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_13$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_13$::jsonb
WHERE id = 'cmrw9zvdu00091ynhd3z764ms' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_14$[{"label": "Merck Manual Professional. Hyponatremia. In severe, rapid-onset, or highly symptomatic hyponatremia, give partial rapid correction with hypertonic 3% saline.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyponatremia"}]$s3i_14$::jsonb
WHERE id = 'cmr4cnsgi00nu1yky9wggetxa' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_15$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_15$::jsonb
WHERE id = 'cmrvwvb9d004m1ye8xzoyon97' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_16$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_16$::jsonb
WHERE id = 'cmrvwvaw4004i1ye8gluqey4g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3i_17$[{"label": "Merck Manual Professional. Ectopic pregnancy. If the pregnancy test is positive or the findings suggest ectopic pregnancy, measure quantitative beta-hCG and do pelvic ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/ectopic-pregnancy"}]$s3i_17$::jsonb
WHERE id = 'cmrwa3gg2002p1ynhiigh9m38' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3i_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 18 THEN RAISE EXCEPTION 'cited %, expected 18', n; END IF;
END $cited$;
COMMIT;

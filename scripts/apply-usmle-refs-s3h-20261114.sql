-- Citation batch s3h for served USMLE Step 3 items, 2026-11-14.
-- SAH imaging, intravenous dextrose, and USPSTF screening sentences.
-- Backup qbi_usmle_refs_s3h_20261114_backup (51 rows). Only references are updated.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3h-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3h_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr8m9dtu00kk1ygiwcnnf24g',
    'cmr97z2yg00bj1ywym64agf5o',
    'cmrvwxgti005l1ye896lkvztj',
    'cmrwa460200321ynht600587m',
    'cmr8bxxuq00do1ylo9r451m19',
    'cmrvwqj0s001w1ye83htrsjrb',
    'cmrwa351c002j1ynh7wkli1mp',
    'cmr4dqv83015p1ykyucfr70tu',
    'cmrvwu6pr003x1ye847ljqz3p',
    'cmruifyyw001r1ycehv9pqnmg',
    'cmrvwvb63004l1ye8p7gr6ywb',
    'cmrvwuwbw00491ye8cvjz3d6o',
    'cmrwa0yj900121ynhncum2ucm',
    'cmr97i0zo00441ywy1rlzonfu',
    'cmr8lqh0o00d61ygijhkxxfdr',
    'cmr9863xk00er1ywyz91mvu5k',
    'cmr97z0gb00at1ywyahl7si2i',
    'cmr8lqjgd00ds1ygixdnsiqgs',
    'cmr97qfuh007g1ywymf2ybise',
    'cmruii0wq00381yce9wj2q7y9',
    'cmruyk82x003u1y2ya73vhed3',
    'cmruykjv8003v1y2yoxo52me6',
    'cmruigmb6002b1yce28oiu4em',
    'cmrvwwzga005d1ye8lbv4lcq5',
    'cmrwa2le300201ynhdnbzfgz0',
    'cmrwa1ymi001k1ynhirep8gc8',
    'cmr8lqg7h00cw1ygiiailfp78',
    'cmru3n3l800dd1y7wbh31g09h',
    'cmr8dqavv010j1ylo2zrof4dm',
    'cmr8jia8r02oa1yloi101liyv',
    'cmr4gc0ec02631ykyqkmqh4on',
    'cmr8dykpr013l1yloewiwb87x',
    'cmr4bnwtj00aq1yky41uf8jr2',
    'cmr4enjuy01ii1ykymn9elzd6',
    'cmr8atv8t000m1ylof5u9yfvj',
    'cmr8bhhda00721ylozle0gg7a',
    'cmr8i09cx026i1yloewxor346',
    'cmr98do1900i61ywyo6pen8n7',
    'cmr98vps800of1ywy6vta9vue',
    'cmr99igw300tv1ywygfercb5t',
    'cmr99rh2e00y11ywyux1aaym0',
    'cmr99rgcf00xs1ywyk3ips9qt',
    'cmr9c9nr501qx1ywyq4m5fb58',
    'cmru9cx1200731y0s8d5yiv0o',
    'cmruylnpe004d1y2y2uggrlge',
    'cmruihp1q002u1ycei8xmk8vm',
    'cmrvwsngg002x1ye82n0phgw7',
    'cmrvwrwm8002l1ye80uzc9ls7',
    'cmrvwq3w2001l1ye8o9wy0ltw',
    'cmrvwu6zz00401ye80d9h98vy',
    'cmrvwtufr003p1ye8thkuh72n'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3h_20261114_backup;
  IF n <> 51 THEN RAISE EXCEPTION 'backup %, expected 51', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3h_0$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_0$::jsonb
WHERE id = 'cmr8m9dtu00kk1ygiwcnnf24g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_1$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_1$::jsonb
WHERE id = 'cmr97z2yg00bj1ywym64agf5o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_2$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_2$::jsonb
WHERE id = 'cmrvwxgti005l1ye896lkvztj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_3$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_3$::jsonb
WHERE id = 'cmrwa460200321ynht600587m' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_4$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_4$::jsonb
WHERE id = 'cmr8bxxuq00do1ylo9r451m19' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_5$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_5$::jsonb
WHERE id = 'cmrvwqj0s001w1ye83htrsjrb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_6$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_6$::jsonb
WHERE id = 'cmrwa351c002j1ynh7wkli1mp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_7$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_7$::jsonb
WHERE id = 'cmr4dqv83015p1ykyucfr70tu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_8$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_8$::jsonb
WHERE id = 'cmrvwu6pr003x1ye847ljqz3p' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_9$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_9$::jsonb
WHERE id = 'cmruifyyw001r1ycehv9pqnmg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_10$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_10$::jsonb
WHERE id = 'cmrvwvb63004l1ye8p7gr6ywb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_11$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_11$::jsonb
WHERE id = 'cmrvwuwbw00491ye8cvjz3d6o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_12$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_12$::jsonb
WHERE id = 'cmrwa0yj900121ynhncum2ucm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_13$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_13$::jsonb
WHERE id = 'cmr97i0zo00441ywy1rlzonfu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_14$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_14$::jsonb
WHERE id = 'cmr8lqh0o00d61ygijhkxxfdr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_15$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_15$::jsonb
WHERE id = 'cmr9863xk00er1ywyz91mvu5k' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_16$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_16$::jsonb
WHERE id = 'cmr97z0gb00at1ywyahl7si2i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_17$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_17$::jsonb
WHERE id = 'cmr8lqjgd00ds1ygixdnsiqgs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_18$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_18$::jsonb
WHERE id = 'cmr97qfuh007g1ywymf2ybise' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_19$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_19$::jsonb
WHERE id = 'cmruii0wq00381yce9wj2q7y9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_20$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_20$::jsonb
WHERE id = 'cmruyk82x003u1y2ya73vhed3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_21$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_21$::jsonb
WHERE id = 'cmruykjv8003v1y2yoxo52me6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_22$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_22$::jsonb
WHERE id = 'cmruigmb6002b1yce28oiu4em' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_23$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_23$::jsonb
WHERE id = 'cmrvwwzga005d1ye8lbv4lcq5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_24$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_24$::jsonb
WHERE id = 'cmrwa2le300201ynhdnbzfgz0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_25$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_25$::jsonb
WHERE id = 'cmrwa1ymi001k1ynhirep8gc8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_26$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_26$::jsonb
WHERE id = 'cmr8lqg7h00cw1ygiiailfp78' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_27$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_27$::jsonb
WHERE id = 'cmru3n3l800dd1y7wbh31g09h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_28$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_28$::jsonb
WHERE id = 'cmr8dqavv010j1ylo2zrof4dm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_29$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_29$::jsonb
WHERE id = 'cmr8jia8r02oa1yloi101liyv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_30$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_30$::jsonb
WHERE id = 'cmr4gc0ec02631ykyqkmqh4on' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_31$[{"label": "USPSTF. Screen all adults aged 45 to 75 years for colorectal cancer. Colonoscopy every 10 years is one of the recommended tests.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$s3h_31$::jsonb
WHERE id = 'cmr8dykpr013l1yloewiwb87x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_32$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_32$::jsonb
WHERE id = 'cmr4bnwtj00aq1yky41uf8jr2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_33$[{"label": "USPSTF. Screen all adults aged 45 to 75 years for colorectal cancer. Colonoscopy every 10 years is one of the recommended tests.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$s3h_33$::jsonb
WHERE id = 'cmr4enjuy01ii1ykymn9elzd6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_34$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_34$::jsonb
WHERE id = 'cmr8atv8t000m1ylof5u9yfvj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_35$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_35$::jsonb
WHERE id = 'cmr8bhhda00721ylozle0gg7a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_36$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_36$::jsonb
WHERE id = 'cmr8i09cx026i1yloewxor346' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_37$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_37$::jsonb
WHERE id = 'cmr98do1900i61ywyo6pen8n7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_38$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_38$::jsonb
WHERE id = 'cmr98vps800of1ywy6vta9vue' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_39$[{"label": "USPSTF. Screen all adults aged 45 to 75 years for colorectal cancer. Colonoscopy every 10 years is one of the recommended tests.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$s3h_39$::jsonb
WHERE id = 'cmr99igw300tv1ywygfercb5t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_40$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_40$::jsonb
WHERE id = 'cmr99rh2e00y11ywyux1aaym0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_41$[{"label": "USPSTF. The task force recommends biennial screening mammography for women aged 40 to 74 years.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$s3h_41$::jsonb
WHERE id = 'cmr99rgcf00xs1ywyk3ips9qt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_42$[{"label": "USPSTF. Screen all adults aged 45 to 75 years for colorectal cancer. Colonoscopy every 10 years is one of the recommended tests.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$s3h_42$::jsonb
WHERE id = 'cmr9c9nr501qx1ywyq4m5fb58' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_43$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_43$::jsonb
WHERE id = 'cmru9cx1200731y0s8d5yiv0o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_44$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_44$::jsonb
WHERE id = 'cmruylnpe004d1y2y2uggrlge' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_45$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_45$::jsonb
WHERE id = 'cmruihp1q002u1ycei8xmk8vm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_46$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_46$::jsonb
WHERE id = 'cmrvwsngg002x1ye82n0phgw7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_47$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_47$::jsonb
WHERE id = 'cmrvwrwm8002l1ye80uzc9ls7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_48$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_48$::jsonb
WHERE id = 'cmrvwq3w2001l1ye8o9wy0ltw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_49$[{"label": "Merck Manual Professional. Hypoglycemia. Hospitalized adults and adolescents can be treated with 50% dextrose, 50 to 100 mL as an intravenous bolus, until symptoms resolve.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3h_49$::jsonb
WHERE id = 'cmrvwu6zz00401ye80d9h98vy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3h_50$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis usually starts with noncontrast CT, performed within 6 hours of symptom onset, when sensitivity is very high.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage-sah"}]$s3h_50$::jsonb
WHERE id = 'cmrvwtufr003p1ye8thkuh72n' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3h_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 51 THEN RAISE EXCEPTION 'cited %, expected 51', n; END IF;
END $cited$;
COMMIT;

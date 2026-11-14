-- Per-item Merck Professional citations, batch s3l, 2026-11-14 (85 rows).
-- Each URL is the Merck topic matched to that item's key. The quoted sentence was read from the page.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3l-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3l_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr8gra0t01ux1ylo0lzutemw',
    'cmr8isdxn02dw1ylooa5dbjhm',
    'cmr8l1m0900701ygi7fi43r6j',
    'cmtpxgr73006x1ymumpz0cdyv',
    'cmr8bah6g003s1yloue2tj9qh',
    'cmr8d1vou00ql1ylooxkkkqfs',
    'cmr8d1vwb00qn1ylo56u1i549',
    'cmqxf0oy2001n1yf1010vwnou',
    'cmr4dz95f018k1yky0itua7ws',
    'cmr8fz9dt01nu1yloxxq93x8y',
    'cmr8gr83h01uj1ylo20g5q4vo',
    'cmr8ie7f002ae1yloo2tqhc6l',
    'cmr8ie88b02am1yloeyh5xrdc',
    'cmr8l1k0w006g1ygixmd5njoi',
    'cmr8pgwul01do1ygi8dvzjda2',
    'cmr8qv0zk01qr1ygiezfl4gbu',
    'cmr996km000rh1ywyj0pednog',
    'cmr9a128801101ywyn5mkb54g',
    'cmru857y2004m1yd69k9zuliz',
    'cmr8gr40n01tm1ylok4iy8bf4',
    'cmr8ie9ed02ay1ylonssnc0k5',
    'cmr8mlwcf00nv1ygitr6bbt4y',
    'cmr8p264c019j1ygi1jf6mr8b',
    'cmr9aemdz013t1ywy0h3ntnvj',
    'cmr9aemgz013u1ywypnp84gph',
    'cmr9b2d9e01ad1ywyqv0c3msm',
    'cmru96opz00451y0s3f8i5nta',
    'cmr4c4vyr00i81yky4f2n3d98',
    'cmr8dbb0900uo1yloi1fbw66f',
    'cmr8gr7cq01ub1yloz9804hv7',
    'cmr8ie8ti02as1ylo86d76rqg',
    'cmr8isfgr02ef1ylo5mpyntzw',
    'cmr8mltd500mu1ygisbclf2j9',
    'cmr8p2756019w1ygib15a5d31',
    'cmr996ieu00qr1ywympw45mm9',
    'cmr996k6b00rc1ywykxd3wzmb',
    'cmr996l3o00rn1ywyvo4ix7vg',
    'cmr9aen2b01411ywy0bddk2di',
    'cmr9aeq6n01531ywylxbmqxr5',
    'cmr9b2ehk01as1ywyzblf7we8',
    'cmqxdzzdj00dd1yma8pzjn0s7',
    'cmqxeg9md00gy1ymawr5fut0r',
    'cmr4c4rxo00h51ykyctf1hfu7',
    'cmr4fdh3v01rq1yky9wcpgvkv',
    'cmr4g0wa8022u1ykymfc586cg',
    'cmr8bxwjm00db1yloco50wmpr',
    'cmr8db6bm00te1yloxmzbdp6m',
    'cmr8fz7lh01n81ylolk8zc15x',
    'cmr8ncnj600te1ygibwhkqd6f',
    'cmr8ncp9n00tw1ygif6ymncsd',
    'cmr99iiu100uf1ywyubetoief',
    'cmr9b2glp01bi1ywy36hsfie5',
    'cmru3n4e000dm1y7wn6xcqzuq',
    'cmru8v3za000p1y0sqoaqc1wz',
    'cmru9iwjn00b91y0sqdr095tk',
    'cmruyhd7w00241y2ypbxo161s',
    'cmrvwnvpo000v1ye8sa6psdo9',
    'cmtpxgqys006u1ymumxooba1v',
    'cmqxeg7yx00gh1yma69m36ktb',
    'cmr8atxav00161ylorv5vufzm',
    'cmr8c3lx100gy1ylomfxxlpc1',
    'cmr8dymfk01421ylo1v8eixsj',
    'cmr8ehyrc01a31ylo36evysu1',
    'cmr8fhho101kq1yloebvtiz80',
    'cmr8fhjdh01l71ylo071wmhug',
    'cmr8isece02e11yloaltkw2zd',
    'cmr8ji81d02nj1ylosiix28k7',
    'cmr8m99od00jg1ygi1akq293x',
    'cmr8ny4r200zy1ygi9d34cx99',
    'cmr8p256z01981yginmajc8d6',
    'cmr8q442y01k31ygib2tfec4v',
    'cmr97i0w600431ywydlhjr8wc',
    'cmr97qdhm006s1ywyy97o2kdb',
    'cmr99ijlu00un1ywyobdrdva4',
    'cmr99rgtu00xy1ywywdyodrb4',
    'cmr9bnxs801h61ywy9jvep9wx',
    'cmr9buzpf01kj1ywyvr1rtk7w',
    'cmru8v3qg000m1y0scfpxm8vb',
    'cmru96qna004l1y0suu6nxcst',
    'cmruidtre000v1ycetjj9axsx',
    'cmruiepqy00191ycem647krpn',
    'cmruif6fy001d1ycewcdbmle7',
    'cmrwa0kmm000t1ynhscs5ylka',
    'cmtpx6e5f000v1ymuj7vipaqy',
    'cmtpx8qga002j1ymuix72usyu'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3l_20261114_backup;
  IF n <> 85 THEN RAISE EXCEPTION 'backup %, expected 85', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3l_0$[{"label": "Merck Manual Professional. substance or medication induced psychotic disorder. Substance- or medication-induced psychotic disorder is characterized by hallucinations and/or delusions due to the direct effects of a substance or withdrawal from a substance in the absence of delirium .", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/schizophrenia-and-related-disorders/substance-or-medication-induced-psychotic-disorder"}]$s3l_0$::jsonb
WHERE id = 'cmr8gra0t01ux1ylo0lzutemw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_1$[{"label": "Merck Manual Professional. substance or medication induced psychotic disorder. Substance- or medication-induced psychotic disorder is characterized by hallucinations and/or delusions due to the direct effects of a substance or withdrawal from a substance in the absence of delirium .", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/schizophrenia-and-related-disorders/substance-or-medication-induced-psychotic-disorder"}]$s3l_1$::jsonb
WHERE id = 'cmr8isdxn02dw1ylooa5dbjhm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_2$[{"label": "Merck Manual Professional. substance or medication induced psychotic disorder. Substance- or medication-induced psychotic disorder is characterized by hallucinations and/or delusions due to the direct effects of a substance or withdrawal from a substance in the absence of delirium .", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/schizophrenia-and-related-disorders/substance-or-medication-induced-psychotic-disorder"}]$s3l_2$::jsonb
WHERE id = 'cmr8l1m0900701ygi7fi43r6j' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_3$[{"label": "Merck Manual Professional. substance or medication induced psychotic disorder. Substance- or medication-induced psychotic disorder is characterized by hallucinations and/or delusions due to the direct effects of a substance or withdrawal from a substance in the absence of delirium .", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/schizophrenia-and-related-disorders/substance-or-medication-induced-psychotic-disorder"}]$s3l_3$::jsonb
WHERE id = 'cmtpxgr73006x1ymumpz0cdyv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_4$[{"label": "Merck Manual Professional. iron deficiency anemia. Iron deficiency is the most common cause of anemia and usually results from blood loss; malabsorption, such as occurs in celiac disease, is a much less common cause.", "url": "https://www.merckmanuals.com/professional/hematology/anemias-caused-by-deficient-erythropoiesis/iron-deficiency-anemia"}]$s3l_4$::jsonb
WHERE id = 'cmr8bah6g003s1yloue2tj9qh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_5$[{"label": "Merck Manual Professional. iron deficiency anemia. Iron deficiency is the most common cause of anemia and usually results from blood loss; malabsorption, such as occurs in celiac disease, is a much less common cause.", "url": "https://www.merckmanuals.com/professional/hematology/anemias-caused-by-deficient-erythropoiesis/iron-deficiency-anemia"}]$s3l_5$::jsonb
WHERE id = 'cmr8d1vou00ql1ylooxkkkqfs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_6$[{"label": "Merck Manual Professional. iron deficiency anemia. Iron deficiency is the most common cause of anemia and usually results from blood loss; malabsorption, such as occurs in celiac disease, is a much less common cause.", "url": "https://www.merckmanuals.com/professional/hematology/anemias-caused-by-deficient-erythropoiesis/iron-deficiency-anemia"}]$s3l_6$::jsonb
WHERE id = 'cmr8d1vwb00qn1ylo56u1i549' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_7$[{"label": "Merck Manual Professional. placental abruption abruptio placentae. Placental abruption (abruptio placentae) is premature separation of the placenta from the uterus, usually after 20 weeks gestation.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/placental-abruption-abruptio-placentae"}]$s3l_7$::jsonb
WHERE id = 'cmqxf0oy2001n1yf1010vwnou' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_8$[{"label": "Merck Manual Professional. delirium. Delirium is an acute, transient, usually reversible, fluctuating disturbance in attention, cognition, and consciousness level.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/delirium-and-dementia/delirium"}]$s3l_8$::jsonb
WHERE id = 'cmr4dz95f018k1yky0itua7ws' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_9$[{"label": "Merck Manual Professional. delirium. Delirium is an acute, transient, usually reversible, fluctuating disturbance in attention, cognition, and consciousness level.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/delirium-and-dementia/delirium"}]$s3l_9$::jsonb
WHERE id = 'cmr8fz9dt01nu1yloxxq93x8y' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_10$[{"label": "Merck Manual Professional. delirium. Delirium is an acute, transient, usually reversible, fluctuating disturbance in attention, cognition, and consciousness level.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/delirium-and-dementia/delirium"}]$s3l_10$::jsonb
WHERE id = 'cmr8gr83h01uj1ylo20g5q4vo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_11$[{"label": "Merck Manual Professional. placental abruption abruptio placentae. Placental abruption (abruptio placentae) is premature separation of the placenta from the uterus, usually after 20 weeks gestation.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/placental-abruption-abruptio-placentae"}]$s3l_11$::jsonb
WHERE id = 'cmr8ie7f002ae1yloo2tqhc6l' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_12$[{"label": "Merck Manual Professional. placental abruption abruptio placentae. Placental abruption (abruptio placentae) is premature separation of the placenta from the uterus, usually after 20 weeks gestation.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/placental-abruption-abruptio-placentae"}]$s3l_12$::jsonb
WHERE id = 'cmr8ie88b02am1yloeyh5xrdc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_13$[{"label": "Merck Manual Professional. hyperthyroidism. Hyperthyroidism is characterized by hypermetabolism and elevated serum levels of free thyroid hormones.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hyperthyroidism"}]$s3l_13$::jsonb
WHERE id = 'cmr8l1k0w006g1ygixmd5njoi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_14$[{"label": "Merck Manual Professional. asthma. Asthma is a disease characterized by diffuse airway inflammation caused by a variety of triggering stimuli resulting in partially or completely reversible bronchoconstriction.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$s3l_14$::jsonb
WHERE id = 'cmr8pgwul01do1ygi8dvzjda2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_15$[{"label": "Merck Manual Professional. placental abruption abruptio placentae. Placental abruption (abruptio placentae) is premature separation of the placenta from the uterus, usually after 20 weeks gestation.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/placental-abruption-abruptio-placentae"}]$s3l_15$::jsonb
WHERE id = 'cmr8qv0zk01qr1ygiezfl4gbu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_16$[{"label": "Merck Manual Professional. hyperthyroidism. Hyperthyroidism is characterized by hypermetabolism and elevated serum levels of free thyroid hormones.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/thyroid-disorders/hyperthyroidism"}]$s3l_16$::jsonb
WHERE id = 'cmr996km000rh1ywyj0pednog' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_17$[{"label": "Merck Manual Professional. placental abruption abruptio placentae. Placental abruption (abruptio placentae) is premature separation of the placenta from the uterus, usually after 20 weeks gestation.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/placental-abruption-abruptio-placentae"}]$s3l_17$::jsonb
WHERE id = 'cmr9a128801101ywyn5mkb54g' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_18$[{"label": "Merck Manual Professional. delirium. Delirium is an acute, transient, usually reversible, fluctuating disturbance in attention, cognition, and consciousness level.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/delirium-and-dementia/delirium"}]$s3l_18$::jsonb
WHERE id = 'cmru857y2004m1yd69k9zuliz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_19$[{"label": "Merck Manual Professional. depressive disorders. The presence of perinatal depression is associated with the subsequent diagnosis of major depressive disorder and bipolar disorder ( 17 ).", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/mood-disorders/depressive-disorders"}]$s3l_19$::jsonb
WHERE id = 'cmr8gr40n01tm1ylok4iy8bf4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_20$[{"label": "Merck Manual Professional. postpartum hemorrhage. Postpartum hemorrhage is blood loss of > 1000 mL or blood loss accompanied by symptoms or signs of hypovolemia within 24 hours after childbirth.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/postpartum-hemorrhage"}]$s3l_20$::jsonb
WHERE id = 'cmr8ie9ed02ay1ylonssnc0k5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_21$[{"label": "Merck Manual Professional. postpartum hemorrhage. Postpartum hemorrhage is blood loss of > 1000 mL or blood loss accompanied by symptoms or signs of hypovolemia within 24 hours after childbirth.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/postpartum-hemorrhage"}]$s3l_21$::jsonb
WHERE id = 'cmr8mlwcf00nv1ygitr6bbt4y' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_22$[{"label": "Merck Manual Professional. depressive disorders. The presence of perinatal depression is associated with the subsequent diagnosis of major depressive disorder and bipolar disorder ( 17 ).", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/mood-disorders/depressive-disorders"}]$s3l_22$::jsonb
WHERE id = 'cmr8p264c019j1ygi1jf6mr8b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_23$[{"label": "Merck Manual Professional. depressive disorders. The presence of perinatal depression is associated with the subsequent diagnosis of major depressive disorder and bipolar disorder ( 17 ).", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/mood-disorders/depressive-disorders"}]$s3l_23$::jsonb
WHERE id = 'cmr9aemdz013t1ywy0h3ntnvj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_24$[{"label": "Merck Manual Professional. depressive disorders. The presence of perinatal depression is associated with the subsequent diagnosis of major depressive disorder and bipolar disorder ( 17 ).", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/mood-disorders/depressive-disorders"}]$s3l_24$::jsonb
WHERE id = 'cmr9aemgz013u1ywypnp84gph' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_25$[{"label": "Merck Manual Professional. postpartum hemorrhage. Postpartum hemorrhage is blood loss of > 1000 mL or blood loss accompanied by symptoms or signs of hypovolemia within 24 hours after childbirth.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/postpartum-hemorrhage"}]$s3l_25$::jsonb
WHERE id = 'cmr9b2d9e01ad1ywyqv0c3msm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_26$[{"label": "Merck Manual Professional. postpartum hemorrhage. Postpartum hemorrhage is blood loss of > 1000 mL or blood loss accompanied by symptoms or signs of hypovolemia within 24 hours after childbirth.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/intrapartum-complications/postpartum-hemorrhage"}]$s3l_26$::jsonb
WHERE id = 'cmru96opz00451y0s3f8i5nta' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_27$[{"label": "Merck Manual Professional. ischemic stroke. Ischemic stroke is sudden neurologic deficits that result from focal cerebral ischemia associated with permanent brain infarction (eg, positive results on diffusion-weighted MRI).", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$s3l_27$::jsonb
WHERE id = 'cmr4c4vyr00i81yky4f2n3d98' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_28$[{"label": "Merck Manual Professional. ischemic stroke. Ischemic stroke is sudden neurologic deficits that result from focal cerebral ischemia associated with permanent brain infarction (eg, positive results on diffusion-weighted MRI).", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$s3l_28$::jsonb
WHERE id = 'cmr8dbb0900uo1yloi1fbw66f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_29$[{"label": "Merck Manual Professional. panic attacks and panic disorder. Panic disorder is the occurrence of repeated panic attacks typically accompanied by fears about future attacks or changes in behavior to avoid situations that might predispose to attacks.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/panic-attacks-and-panic-disorder"}]$s3l_29$::jsonb
WHERE id = 'cmr8gr7cq01ub1yloz9804hv7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_30$[{"label": "Merck Manual Professional. management of normal labor. In 1996, the World Health Organization (WHO) defined normal birth as follows ( 1 ): The birth is spontaneous in onset and low risk at the start of labor and remains so throughout labor and delivery.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/labor-and-delivery/management-of-normal-labor"}]$s3l_30$::jsonb
WHERE id = 'cmr8ie8ti02as1ylo86d76rqg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_31$[{"label": "Merck Manual Professional. serotonin syndrome. Serotonin syndrome is a potentially life-threatening condition resulting from increased central nervous system serotonergic activity that is usually medication related.", "url": "https://www.merckmanuals.com/professional/injuries-poisoning/heat-illness/serotonin-syndrome"}]$s3l_31$::jsonb
WHERE id = 'cmr8isfgr02ef1ylo5mpyntzw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_32$[{"label": "Merck Manual Professional. management of normal labor. In 1996, the World Health Organization (WHO) defined normal birth as follows ( 1 ): The birth is spontaneous in onset and low risk at the start of labor and remains so throughout labor and delivery.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/labor-and-delivery/management-of-normal-labor"}]$s3l_32$::jsonb
WHERE id = 'cmr8mltd500mu1ygisbclf2j9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_33$[{"label": "Merck Manual Professional. adjustment disorders. Note that medications such as selective serotonin reuptake inhibitors have a stronger evidence base if the diagnosis is ultimately an anxiety or depressive disorder rather than an adjustment disorder.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/adjustment-disorders"}]$s3l_33$::jsonb
WHERE id = 'cmr8p2756019w1ygib15a5d31' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_34$[{"label": "Merck Manual Professional. adjustment disorders. Note that medications such as selective serotonin reuptake inhibitors have a stronger evidence base if the diagnosis is ultimately an anxiety or depressive disorder rather than an adjustment disorder.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/adjustment-disorders"}]$s3l_34$::jsonb
WHERE id = 'cmr996ieu00qr1ywympw45mm9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_35$[{"label": "Merck Manual Professional. panic attacks and panic disorder. Panic disorder is the occurrence of repeated panic attacks typically accompanied by fears about future attacks or changes in behavior to avoid situations that might predispose to attacks.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/panic-attacks-and-panic-disorder"}]$s3l_35$::jsonb
WHERE id = 'cmr996k6b00rc1ywykxd3wzmb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_36$[{"label": "Merck Manual Professional. serotonin syndrome. Serotonin syndrome is a potentially life-threatening condition resulting from increased central nervous system serotonergic activity that is usually medication related.", "url": "https://www.merckmanuals.com/professional/injuries-poisoning/heat-illness/serotonin-syndrome"}]$s3l_36$::jsonb
WHERE id = 'cmr996l3o00rn1ywyvo4ix7vg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_37$[{"label": "Merck Manual Professional. panic attacks and panic disorder. Panic disorder is the occurrence of repeated panic attacks typically accompanied by fears about future attacks or changes in behavior to avoid situations that might predispose to attacks.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/panic-attacks-and-panic-disorder"}]$s3l_37$::jsonb
WHERE id = 'cmr9aen2b01411ywy0bddk2di' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_38$[{"label": "Merck Manual Professional. adjustment disorders. Note that medications such as selective serotonin reuptake inhibitors have a stronger evidence base if the diagnosis is ultimately an anxiety or depressive disorder rather than an adjustment disorder.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/adjustment-disorders"}]$s3l_38$::jsonb
WHERE id = 'cmr9aeq6n01531ywylxbmqxr5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_39$[{"label": "Merck Manual Professional. management of normal labor. In 1996, the World Health Organization (WHO) defined normal birth as follows ( 1 ): The birth is spontaneous in onset and low risk at the start of labor and remains so throughout labor and delivery.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/labor-and-delivery/management-of-normal-labor"}]$s3l_39$::jsonb
WHERE id = 'cmr9b2ehk01as1ywyzblf7we8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_40$[{"label": "Merck Manual Professional. pulmonary edema. Cardiogenic pulmonary edema is acute alveolar flooding caused by pulmonary venous hypertension secondary to severe left ventricular failure.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/pulmonary-edema"}]$s3l_40$::jsonb
WHERE id = 'cmqxdzzdj00dd1yma8pzjn0s7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_41$[{"label": "Merck Manual Professional. pulmonary edema. Cardiogenic pulmonary edema is acute alveolar flooding caused by pulmonary venous hypertension secondary to severe left ventricular failure.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/pulmonary-edema"}]$s3l_41$::jsonb
WHERE id = 'cmqxeg9md00gy1ymawr5fut0r' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_42$[{"label": "Merck Manual Professional. diabetic nephropathy. Diabetic nephropathy is glomerular sclerosis and fibrosis caused by the metabolic and hemodynamic changes of diabetes mellitus.", "url": "https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/diabetic-nephropathy"}]$s3l_42$::jsonb
WHERE id = 'cmr4c4rxo00h51ykyctf1hfu7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_43$[{"label": "Merck Manual Professional. vascular cognitive impairment and dementia. Vascular cognitive impairment and dementia is acute or chronic cognitive deterioration due to diffuse or focal cerebral infarction that is most often related to cerebrovascular disease.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/delirium-and-dementia/vascular-cognitive-impairment-and-dementia"}]$s3l_43$::jsonb
WHERE id = 'cmr4fdh3v01rq1yky9wcpgvkv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_44$[{"label": "Merck Manual Professional. cushing syndrome. Cushing syndrome is a constellation of clinical manifestations caused by chronic high blood levels of cortisol or related glucocorticoids.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/adrenal-disorders/cushing-syndrome"}]$s3l_44$::jsonb
WHERE id = 'cmr4g0wa8022u1ykymfc586cg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_45$[{"label": "Merck Manual Professional. acute heart failure. Acute heart failure is classified phenotypically and further risk-stratified based on the overall severity of illness, alteration in perfusion (\"warm\" versus \"cold\"), the presence of congestion (\"dry\" versus \"wet\"), and other details of clinical presentation ( 2 , 3 ).", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure"}]$s3l_45$::jsonb
WHERE id = 'cmr8bxwjm00db1yloco50wmpr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_46$[{"label": "Merck Manual Professional. panic attacks and panic disorder. A panic attack is the sudden onset of a discrete, brief period of intense discomfort, anxiety, or fear accompanied by somatic and/or cognitive symptoms.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/panic-attacks-and-panic-disorder"}]$s3l_46$::jsonb
WHERE id = 'cmr8db6bm00te1yloxmzbdp6m' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_47$[{"label": "Merck Manual Professional. overview of viral respiratory infections. doi:10.1016/j.cmi.2017.11.018 Treatment of Viral Respiratory Infections Supportive care Sometimes inhaled bronchodilators or glucocorticoids Sometimes antiviral medications The treatment of viral respiratory infections is usually supportive (eg, rest; hydration; gargling; symptomatic relief of pain, fever, and congestion).", "url": "https://www.merckmanuals.com/professional/infectious-diseases/respiratory-viruses/overview-of-viral-respiratory-infections"}]$s3l_47$::jsonb
WHERE id = 'cmr8fz7lh01n81ylolk8zc15x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_48$[{"label": "Merck Manual Professional. diabetic nephropathy. Diabetic nephropathy is glomerular sclerosis and fibrosis caused by the metabolic and hemodynamic changes of diabetes mellitus.", "url": "https://www.merckmanuals.com/professional/nephrology/glomerular-disorders/diabetic-nephropathy"}]$s3l_48$::jsonb
WHERE id = 'cmr8ncnj600te1ygibwhkqd6f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_49$[{"label": "Merck Manual Professional. acute heart failure. Acute heart failure is classified phenotypically and further risk-stratified based on the overall severity of illness, alteration in perfusion (\"warm\" versus \"cold\"), the presence of congestion (\"dry\" versus \"wet\"), and other details of clinical presentation ( 2 , 3 ).", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure"}]$s3l_49$::jsonb
WHERE id = 'cmr8ncp9n00tw1ygif6ymncsd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_50$[{"label": "Merck Manual Professional. thoracentesis. Indications for Thoracentesis Diagnostic thoracentesis: Diagnosis of cause of pleural effusion that is new or of uncertain etiology Diagnostic thoracentesis is usually not needed when the etiology of the pleural fluid is apparent (eg, viral pleuritis, typical heart failure).", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/diagnostic-and-therapeutic-pulmonary-procedures/thoracentesis"}]$s3l_50$::jsonb
WHERE id = 'cmr99iiu100uf1ywyubetoief' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_51$[{"label": "Merck Manual Professional. preeclampsia and eclampsia. Preeclampsia is new onset or worsening of existing hypertension with proteinuria after 20 weeks gestation.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/preeclampsia-and-eclampsia"}]$s3l_51$::jsonb
WHERE id = 'cmr9b2glp01bi1ywy36hsfie5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_52$[{"label": "Merck Manual Professional. overview of viral respiratory infections. doi:10.1016/j.cmi.2017.11.018 Treatment of Viral Respiratory Infections Supportive care Sometimes inhaled bronchodilators or glucocorticoids Sometimes antiviral medications The treatment of viral respiratory infections is usually supportive (eg, rest; hydration; gargling; symptomatic relief of pain, fever, and congestion).", "url": "https://www.merckmanuals.com/professional/infectious-diseases/respiratory-viruses/overview-of-viral-respiratory-infections"}]$s3l_52$::jsonb
WHERE id = 'cmru3n4e000dm1y7wn6xcqzuq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_53$[{"label": "Merck Manual Professional. measles. The herd immunity threshold (the proportion of a population with immunity to an infectious disease through innate immunity, vaccination, or previous infection that is required to prevent transmission of the disease) for measles in the United States is estimated to be 92 to 95% ( 6–8 ).", "url": "https://www.merckmanuals.com/professional/pediatrics/viral-exanthems-in-infants-and-children/measles"}]$s3l_53$::jsonb
WHERE id = 'cmru8v3za000p1y0sqoaqc1wz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_54$[{"label": "Merck Manual Professional. thoracentesis. Indications for Thoracentesis Diagnostic thoracentesis: Diagnosis of cause of pleural effusion that is new or of uncertain etiology Diagnostic thoracentesis is usually not needed when the etiology of the pleural fluid is apparent (eg, viral pleuritis, typical heart failure).", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/diagnostic-and-therapeutic-pulmonary-procedures/thoracentesis"}]$s3l_54$::jsonb
WHERE id = 'cmru9iwjn00b91y0sqdr095tk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_55$[{"label": "Merck Manual Professional. hypoglycemia. In patients with diabetes who take insulin or antihyperglycemic treatment, hypoglycemia is common and is defined as a glucose level of ≤ 70 mg/dL.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3l_55$::jsonb
WHERE id = 'cmruyhd7w00241y2ypbxo161s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_56$[{"label": "Merck Manual Professional. hypoglycemia. In patients with diabetes who take insulin or antihyperglycemic treatment, hypoglycemia is common and is defined as a glucose level of ≤ 70 mg/dL.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/hypoglycemia"}]$s3l_56$::jsonb
WHERE id = 'cmrvwnvpo000v1ye8sa6psdo9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_57$[{"label": "Merck Manual Professional. panic attacks and panic disorder. A panic attack is the sudden onset of a discrete, brief period of intense discomfort, anxiety, or fear accompanied by somatic and/or cognitive symptoms.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/anxiety-and-trauma-and-stressor-related-disorders/panic-attacks-and-panic-disorder"}]$s3l_57$::jsonb
WHERE id = 'cmtpxgqys006u1ymumxooba1v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_58$[{"label": "Merck Manual Professional. hepatitis b chronic. (See also Causes of Hepatitis , Overview of Chronic Hepatitis , and Acute Hepatitis B .) Hepatitis lasting > 6 months is generally defined as chronic hepatitis, although this duration is arbitrary.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/hepatitis/hepatitis-b-chronic"}]$s3l_58$::jsonb
WHERE id = 'cmqxeg7yx00gh1yma69m36ktb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_59$[{"label": "Merck Manual Professional. spinal subdural or epidural hematoma. Diagnosis of Spinal Subdural or Epidural Hematoma MRI Hematoma is suspected in patients with symptoms and signs of acute, nontraumatic spinal cord compression or sudden, unexplained lower extremity paresis, particularly if a possible cause (eg, trauma, bleeding diathesis) is present.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/spinal-cord-disorders/spinal-subdural-or-epidural-hematoma"}]$s3l_59$::jsonb
WHERE id = 'cmr8atxav00161ylorv5vufzm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_60$[{"label": "Merck Manual Professional. stable angina. Stable angina is angina that is typically precipitated by exertion or psychologic stress and relieved by rest or sublingual nitroglycerin .", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/stable-angina"}]$s3l_60$::jsonb
WHERE id = 'cmr8c3lx100gy1ylomfxxlpc1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_61$[{"label": "Merck Manual Professional. catheter associated urinary tract infections. A catheter-associated urinary tract infection (CAUTI) is a urinary tract infection (UTI) in which the positive culture was taken when an indwelling urinary catheter had been in place for > 2 consecutive days while the catheter is in place or within 1 day after it is removed.", "url": "https://www.merckmanuals.com/professional/infectious-diseases/urinary-tract-infections/catheter-associated-urinary-tract-infections"}]$s3l_61$::jsonb
WHERE id = 'cmr8dymfk01421ylo1v8eixsj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_62$[{"label": "Merck Manual Professional. idiopathic intracranial hypertension. Idiopathic intracranial hypertension causes increased intracranial pressure without a mass lesion or hydrocephalus, probably by obstructing venous drainage; cerebrospinal fluid (CSF) composition is normal.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/headache/idiopathic-intracranial-hypertension"}]$s3l_62$::jsonb
WHERE id = 'cmr8ehyrc01a31ylo36evysu1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_63$[{"label": "Merck Manual Professional. influenza vaccine. (See also CDC: Different Types of Flu Vaccines .) Indications for Influenza Vaccine Annual influenza vaccination is indicated for the prevention of infection caused by the influenza virus.", "url": "https://www.merckmanuals.com/professional/infectious-diseases/immunization/influenza-vaccine"}]$s3l_63$::jsonb
WHERE id = 'cmr8fhho101kq1yloebvtiz80' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_64$[{"label": "Merck Manual Professional. appendicitis. Appendicitis is acute inflammation of the vermiform appendix, typically resulting in abdominal pain, anorexia, and abdominal tenderness.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/acute-abdomen-and-surgical-gastroenterology/appendicitis"}]$s3l_64$::jsonb
WHERE id = 'cmr8fhjdh01l71ylo071wmhug' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_65$[{"label": "Merck Manual Professional. metabolic dysfunction associated steatotic liver disease masld. Metabolic dysfunction–associated steatotic liver disease (MASLD, previously known as fatty liver or nonalcoholic fatty liver disease [NAFLD]) is defined as the presence of hepatic steatosis in individuals with at least one metabolic risk factor (eg, obesity, dyslipidemia) and minimal or no alcohol consumption and was previou...", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/approach-to-the-patient-with-liver-disease/metabolic-dysfunction-associated-steatotic-liver-disease-masld"}]$s3l_65$::jsonb
WHERE id = 'cmr8isece02e11yloaltkw2zd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_66$[{"label": "Merck Manual Professional. alzheimer disease. Alzheimer disease causes progressive cognitive deterioration and is characterized by beta-amyloid deposits and neurofibrillary tangles in the cerebral cortex and subcortical gray matter.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/delirium-and-dementia/alzheimer-disease"}]$s3l_66$::jsonb
WHERE id = 'cmr8ji81d02nj1ylosiix28k7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_67$[{"label": "Merck Manual Professional. pheochromocytoma. A pheochromocytoma is a catecholamine-secreting tumor of chromaffin cells typically located in the adrenals.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/adrenal-disorders/pheochromocytoma"}]$s3l_67$::jsonb
WHERE id = 'cmr8m99od00jg1ygi1akq293x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_68$[{"label": "Merck Manual Professional. pulmonary edema. Cardiogenic pulmonary edema is acute alveolar flooding caused by pulmonary venous hypertension secondary to severe left ventricular failure.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/pulmonary-edema"}]$s3l_68$::jsonb
WHERE id = 'cmr8ny4r200zy1ygi9d34cx99' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_69$[{"label": "Merck Manual Professional. schizophrenia. Schizophrenia is characterized by psychosis (loss of contact with reality); symptoms include hallucinations (false perceptions), delusions (false beliefs), disorganized speech and motor behavior, and negative symptoms (flattened affect, restricted range of emotions), cognitive deficits (impaired reasoning and problem solving), and occupational and social dysfunction.", "url": "https://www.merckmanuals.com/professional/psychiatric-disorders/schizophrenia-and-related-disorders/schizophrenia"}]$s3l_69$::jsonb
WHERE id = 'cmr8p256z01981yginmajc8d6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_70$[{"label": "Merck Manual Professional. chronic lymphocytic leukemia cll. Chronic lymphocytic leukemia (CLL) is characterized by progressive accumulation of phenotypically mature malignant B lymphocytes.", "url": "https://www.merckmanuals.com/professional/oncology/leukemias/chronic-lymphocytic-leukemia-cll"}]$s3l_70$::jsonb
WHERE id = 'cmr8q442y01k31ygib2tfec4v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_71$[{"label": "Merck Manual Professional. acute heart failure. Heart failure (HF) is a clinical syndrome in which the heart is not able to meet the metabolic demands of the body due to a structural and or functional cardiac abnormality, leading to low cardiac output, elevated ventricular filling pressure, or both.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/acute-heart-failure"}]$s3l_71$::jsonb
WHERE id = 'cmr97i0w600431ywydlhjr8wc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_72$[{"label": "Merck Manual Professional. pleural effusion. Normally, 10 to 20 mL of pleural fluid, similar in composition to plasma but lower in protein ( < 1.5 g/dL [ Etiology of Pleural Effusion Pleural effusions are usually categorized as: Transudates Exudates Categorization of the effusions is based on laboratory characteristics of the fluid (see table Criteria for Identifying Exudative Pleural Effusions ).", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/mediastinal-and-pleural-disorders/pleural-effusion"}]$s3l_72$::jsonb
WHERE id = 'cmr97qdhm006s1ywyy97o2kdb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_73$[{"label": "Merck Manual Professional. metabolic syndrome. Metabolic syndrome is characterized by a large waist circumference (due to excess abdominal adipose tissue), hypertension, abnormal fasting plasma glucose or insulin resistance, and dyslipidemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/obesity-and-the-metabolic-syndrome/metabolic-syndrome"}]$s3l_73$::jsonb
WHERE id = 'cmr99ijlu00un1ywyobdrdva4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_74$[{"label": "Merck Manual Professional. prostatitis. Bacterial prostatitis can be acute or chronic and is usually caused by typical urinary pathogens (eg, Klebsiella , Proteus , Escherichia coli ) and possibly by Chlamydia .", "url": "https://www.merckmanuals.com/professional/genitourinary-disorders/benign-prostate-disease/prostatitis"}]$s3l_74$::jsonb
WHERE id = 'cmr99rgtu00xy1ywywdyodrb4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_75$[{"label": "Merck Manual Professional. febrile seizures. Febrile seizures are diagnosed when seizures occur in children 6 months to 5 years of age who have fever (temperature > 38 ° C) that is not caused by a central nervous system infection and who have had no previous afebrile seizures.", "url": "https://www.merckmanuals.com/professional/pediatrics/neurologic-disorders-in-children/febrile-seizures"}]$s3l_75$::jsonb
WHERE id = 'cmr9bnxs801h61ywy9jvep9wx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_76$[{"label": "Merck Manual Professional. infectious mononucleosis. Infectious mononucleosis is caused by Epstein-Barr virus (EBV, human herpesvirus type 4) and is characterized by fatigue, fever, pharyngitis, and lymphadenopathy.", "url": "https://www.merckmanuals.com/professional/infectious-diseases/herpesviruses/infectious-mononucleosis"}]$s3l_76$::jsonb
WHERE id = 'cmr9buzpf01kj1ywyvr1rtk7w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_77$[{"label": "Merck Manual Professional. overview of acute viral hepatitis. Acute viral hepatitis is diffuse liver inflammation caused by specific hepatotropic viruses that have diverse modes of transmission and epidemiologies.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/hepatitis/overview-of-acute-viral-hepatitis"}]$s3l_77$::jsonb
WHERE id = 'cmru8v3qg000m1y0scfpxm8vb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_78$[{"label": "Merck Manual Professional. mastitis. Fever that occurs several weeks after the start of breastfeeding is frequently due to mastitis.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/mastitis"}]$s3l_78$::jsonb
WHERE id = 'cmru96qna004l1y0suu6nxcst' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_79$[{"label": "Merck Manual Professional. pulmonary edema. Cardiogenic pulmonary edema is acute alveolar flooding caused by pulmonary venous hypertension secondary to severe left ventricular failure.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/pulmonary-edema"}]$s3l_79$::jsonb
WHERE id = 'cmruidtre000v1ycetjj9axsx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_80$[{"label": "Merck Manual Professional. medication related osteonecrosis of the jaw mronj. Medication-related osteonecrosis of the jaw has no unanimously accepted definition or etiology but is generally held to be an oral lesion involving bare mandibular or maxillary bone present for ≥ 8 weeks related to medications.", "url": "https://www.merckmanuals.com/professional/dental-disorders/dental-emergencies/medication-related-osteonecrosis-of-the-jaw-mronj"}]$s3l_80$::jsonb
WHERE id = 'cmruiepqy00191ycem647krpn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_81$[{"label": "Merck Manual Professional. hypokalemia. Hypokalemia is serum potassium concentration 3.5 mEq/L ( 3.5 mmol/L) caused by a deficit in total body potassium stores or abnormal movement of potassium into cells.", "url": "https://www.merckmanuals.com/professional/nephrology/electrolyte-disorders/hypokalemia"}]$s3l_81$::jsonb
WHERE id = 'cmruif6fy001d1ycewcdbmle7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_82$[{"label": "Merck Manual Professional. cesarean delivery. The rate has fluctuated, but one contributor is concern about increased risk of uterine rupture in women attempting a trial of labor after cesarean delivery (TOLAC).", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/labor-and-delivery/cesarean-delivery"}]$s3l_82$::jsonb
WHERE id = 'cmrwa0kmm000t1ynhscs5ylka' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_83$[{"label": "Merck Manual Professional. psoriasis. Psoriasis is an inflammatory skin disease that manifests most commonly as well-circumscribed, erythematous papules and plaques covered with silvery scales.", "url": "https://www.merckmanuals.com/professional/dermatologic-disorders/psoriasis-and-other-papulosquamous-disorders/psoriasis"}]$s3l_83$::jsonb
WHERE id = 'cmtpx6e5f000v1ymuj7vipaqy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3l_84$[{"label": "Merck Manual Professional. sepsis and septic shock. Septic shock is defined as sepsis with persistent hypotension requiring vasopressors to maintain mean arterial pressure ≥ 65 mm Hg and having a serum lactate > 2 mmol/L, despite adequate volume resuscitation.", "url": "https://www.merckmanuals.com/professional/critical-care-medicine/sepsis-and-septic-shock/sepsis-and-septic-shock"}]$s3l_84$::jsonb
WHERE id = 'cmtpx8qga002j1ymuix72usyu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3l_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 85 THEN RAISE EXCEPTION 'cited %, expected 85', n; END IF;
END $cited$;
COMMIT;

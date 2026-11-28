-- Third citation batch for served USMLE Step 3 items that still had no URL, 2026-11-14.
-- Backup qbi_usmle_refs_s3c_20261114_backup (40 rows) is created first.
-- Only the references column is updated. The two previously flagged keys are not included.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3c-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3c_20261114_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'cmr4bny8x00b81yky2afz7u2w',
    'cmr8att6o00021yloxtz7w8wm',
    'cmr8atvyl000t1ylomai0a6f3',
    'cmr8bhjsx007r1yloed0ig5xd',
    'cmr8br5cp00ab1yloa1rjyiro',
    'cmr8br6i800ap1ylo7c9r1s16',
    'cmr8db6mh00th1ylotk88secz',
    'cmr8dii0f00xq1yloil6r3je8',
    'cmr8diil700xx1ylofoybotlh',
    'cmr8dyo9n014k1yloondyxxix',
    'cmr8esmb701dd1yloseoiebva',
    'cmr8esol901e41ylo4qv2ya8n',
    'cmr8ji66d02mw1yloa617x7iq',
    'cmr8lc4n5009j1ygiae4xb8rg',
    'cmr8lc5z600a01ygievl1yrcx',
    'cmr8ncm6400t01ygi6fhtf90s',
    'cmr97hzkz003q1ywyqk88eg65',
    'cmr97i0sj00421ywy1ksvckd5',
    'cmr98djlh00gx1ywydd41wiwk',
    'cmr98dkze00hb1ywyoupbovr0',
    'cmr99ik6l00ut1ywykplh7bty',
    'cmr99rhy500yc1ywyz9a79113',
    'cmr9b2fmj01b61ywyzru269iu',
    'cmru2qans00191y7w9cgkltvg',
    'cmru2qax1001c1y7w19zbyr9t',
    'cmru3n3uz00dg1y7warupx21d',
    'cmru8hvmb009x1yd6j7015etr',
    'cmru8hway00a41yd6i7gqzktn',
    'cmru96pop004d1y0szyrxpvff',
    'cmru9cw72006w1y0socki1pba',
    'cmruigb6w00221yceux0sw8du',
    'cmruyihap002q1y2ylqimybcl',
    'cmruyivf0002y1y2ykmn2alfp',
    'cmruykw0g00481y2y9ocy614d',
    'cmruyly47004n1y2ypgfjfsdm',
    'cmrvwtdgp003d1ye87gheua96',
    'cmrwa0kq1000u1ynhymnt1du6',
    'cmrwa0y90000z1ynhlzups4sp',
    'cmrwa358c002l1ynhjhn39zw6',
    'cmrwa35bs002m1ynh2e7q65ov'
)
AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3c_20261114_backup;
  IF n <> 40 THEN
    RAISE EXCEPTION 'backup row count %, expected 40', n;
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $s3c_0$[{"label": "NICE NG125. When surgical site infection is suspected because of cellulitis, or the wound has been opened to drain pus, treat with an antibiotic that covers the likely organisms.", "url": "https://www.nice.org.uk/guidance/ng125/chapter/Recommendations"}]$s3c_0$::jsonb
WHERE id = 'cmr4bny8x00b81yky2afz7u2w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_1$[{"label": "NICE NG125. When surgical site infection is suspected because of cellulitis, or the wound has been opened to drain pus, treat with an antibiotic that covers the likely organisms.", "url": "https://www.nice.org.uk/guidance/ng125/chapter/Recommendations"}]$s3c_1$::jsonb
WHERE id = 'cmr8att6o00021yloxtz7w8wm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_2$[{"label": "NICE NG125. When surgical site infection is suspected because of cellulitis, or the wound has been opened to drain pus, treat with an antibiotic that covers the likely organisms.", "url": "https://www.nice.org.uk/guidance/ng125/chapter/Recommendations"}]$s3c_2$::jsonb
WHERE id = 'cmr8atvyl000t1ylomai0a6f3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_3$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_3$::jsonb
WHERE id = 'cmr8bhjsx007r1yloed0ig5xd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_4$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_4$::jsonb
WHERE id = 'cmr8br5cp00ab1yloa1rjyiro' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_5$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_5$::jsonb
WHERE id = 'cmr8br6i800ap1ylo7c9r1s16' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_6$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_6$::jsonb
WHERE id = 'cmr8db6mh00th1ylotk88secz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_7$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_7$::jsonb
WHERE id = 'cmr8dii0f00xq1yloil6r3je8' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_8$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_8$::jsonb
WHERE id = 'cmr8diil700xx1ylofoybotlh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_9$[{"label": "NICE NG125. When surgical site infection is suspected because of cellulitis, or the wound has been opened to drain pus, treat with an antibiotic that covers the likely organisms.", "url": "https://www.nice.org.uk/guidance/ng125/chapter/Recommendations"}]$s3c_9$::jsonb
WHERE id = 'cmr8dyo9n014k1yloondyxxix' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_10$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_10$::jsonb
WHERE id = 'cmr8esmb701dd1yloseoiebva' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_11$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_11$::jsonb
WHERE id = 'cmr8esol901e41ylo4qv2ya8n' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_12$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_12$::jsonb
WHERE id = 'cmr8ji66d02mw1yloa617x7iq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_13$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_13$::jsonb
WHERE id = 'cmr8lc4n5009j1ygiae4xb8rg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_14$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care. 2024. The mainstays of treatment of DKA and HHS are fluid replacement and insulin therapy.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/"}]$s3c_14$::jsonb
WHERE id = 'cmr8lc5z600a01ygievl1yrcx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_15$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_15$::jsonb
WHERE id = 'cmr8ncm6400t01ygi6fhtf90s' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_16$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_16$::jsonb
WHERE id = 'cmr97hzkz003q1ywyqk88eg65' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_17$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_17$::jsonb
WHERE id = 'cmr97i0sj00421ywy1ksvckd5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_18$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_18$::jsonb
WHERE id = 'cmr98djlh00gx1ywydd41wiwk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_19$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_19$::jsonb
WHERE id = 'cmr98dkze00hb1ywyoupbovr0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_20$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_20$::jsonb
WHERE id = 'cmr99ik6l00ut1ywykplh7bty' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_21$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_21$::jsonb
WHERE id = 'cmr99rhy500yc1ywyz9a79113' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_22$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_22$::jsonb
WHERE id = 'cmr9b2fmj01b61ywyzru269iu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_23$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_23$::jsonb
WHERE id = 'cmru2qans00191y7w9cgkltvg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_24$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_24$::jsonb
WHERE id = 'cmru2qax1001c1y7w19zbyr9t' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_25$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_25$::jsonb
WHERE id = 'cmru3n3uz00dg1y7warupx21d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_26$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_26$::jsonb
WHERE id = 'cmru8hvmb009x1yd6j7015etr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_27$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_27$::jsonb
WHERE id = 'cmru8hway00a41yd6i7gqzktn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_28$[{"label": "NICE NG133. Pre-eclampsia is new hypertension (over 140 mmHg systolic or over 90 mmHg diastolic) after 20 weeks of pregnancy, with proteinuria or other new maternal organ dysfunction.", "url": "https://www.nice.org.uk/guidance/ng133/chapter/Recommendations"}]$s3c_28$::jsonb
WHERE id = 'cmru96pop004d1y0szyrxpvff' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_29$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_29$::jsonb
WHERE id = 'cmru9cw72006w1y0socki1pba' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_30$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT for suspected acute stroke when there are indications for thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3c_30$::jsonb
WHERE id = 'cmruigb6w00221yceux0sw8du' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_31$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT for suspected acute stroke when there are indications for thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3c_31$::jsonb
WHERE id = 'cmruyihap002q1y2ylqimybcl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_32$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT for suspected acute stroke when there are indications for thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3c_32$::jsonb
WHERE id = 'cmruyivf0002y1y2ykmn2alfp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_33$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT for suspected acute stroke when there are indications for thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3c_33$::jsonb
WHERE id = 'cmruykw0g00481y2y9ocy614d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_34$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_34$::jsonb
WHERE id = 'cmruyly47004n1y2ypgfjfsdm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_35$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT for suspected acute stroke when there are indications for thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3c_35$::jsonb
WHERE id = 'cmrvwtdgp003d1ye87gheua96' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_36$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT for suspected acute stroke when there are indications for thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3c_36$::jsonb
WHERE id = 'cmrwa0kq1000u1ynhymnt1du6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_37$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT for suspected acute stroke when there are indications for thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3c_37$::jsonb
WHERE id = 'cmrwa0y90000z1ynhlzups4sp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_38$[{"label": "GOLD 2025 pocket guide. Noninvasive ventilation is the first mode of ventilation in COPD with acute respiratory failure and no absolute contraindication.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3c_38$::jsonb
WHERE id = 'cmrwa358c002l1ynhjhn39zw6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3c_39$[{"label": "NICE NG128. Perform brain imaging immediately with a non-enhanced CT for suspected acute stroke when there are indications for thrombolysis or thrombectomy.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3c_39$::jsonb
WHERE id = 'cmrwa35bs002m1ynh2e7q65ov' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3c_20261114_backup b ON b.id = q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 40 THEN
    RAISE EXCEPTION 'rows with a citation URL %, expected 40', n;
  END IF;
END
$cited$;
COMMIT;

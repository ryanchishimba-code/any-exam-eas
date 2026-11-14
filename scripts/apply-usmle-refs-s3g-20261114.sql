-- Seventh citation batch for served USMLE Step 3 management keys, 2026-11-14.
-- Backup qbi_usmle_refs_s3g_20261114_backup (93 rows). Only references are updated.
-- Sentences were read from NICE, Merck Manual Professional, and the 2018 cholesterol guideline.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3g-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3g_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr8n3szt00qw1ygi7y793m5j',
    'cmqxf0lqs000i1yf1heewn04k',
    'cmr8ei0oj01ar1ylo2j4qcs59',
    'cmr9c35wk01ni1ywy8qk3axmq',
    'cmr8quy4001pr1ygiu5jptn5i',
    'cmr4f6d8p01pr1yky1edx4gvt',
    'cmqxeg8my00go1ymawwnmp5de',
    'cmqxeg9iq00gx1ymasmiqom7x',
    'cmr8hrtl902451ylobwlwptit',
    'cmr8bagkk003m1yloyvddzlf1',
    'cmr8ie5r3029x1ylo1e28n5id',
    'cmr8ie7qj02ah1ylojweeb50q',
    'cmr8om7km01691ygietdseftn',
    'cmr9b2f2701az1ywym8irc15v',
    'cmr4e6kcf01bp1ykyvcvpbdsg',
    'cmr8oma6o01761ygi2ifwiiuk',
    'cmruylnw6004f1y2y55314pyu',
    'cmr4bnyc100b91yky2q1kbwzq',
    'cmr8j9r9t02kd1yloj44dqg23',
    'cmr8ie6tv02a81yloew91mkt4',
    'cmr8pgv7101d41ygip3c9wlou',
    'cmr9a134g01191ywyy1mwhfvw',
    'cmr9a11cb010r1ywyq74i66yz',
    'cmr8q43oo01jy1ygiye0nxvxf',
    'cmr8ncls100sw1ygivtxu4xke',
    'cmr9bnxvs01h71ywydjbjcvr4',
    'cmr8ny3zx00zp1ygi9s2aqedx',
    'cmruiheos002t1yceju7v76sy',
    'cmr9a12pv01151ywy58tdgt2i',
    'cmr9buzdm01kf1ywy82opxsb5',
    'cmr98dnu400i41ywy3m5tkn3v',
    'cmr8c3mwq00h81ylo94cpmwyw',
    'cmr9b2df501af1ywywkvkvh96',
    'cmr9b2goi01bj1ywy4pcxeo9m',
    'cmr9bv07101kp1ywyvvf0jn3u',
    'cmru96oyu00471y0spt3bn78x',
    'cmr4dqt5u01521yky8w13dc32',
    'cmr8fzada01o61ylood40bf9u',
    'cmr8om9v301721ygir2aualx0',
    'cmr9bnxop01h51ywy33adrang',
    'cmr9c394w01om1ywyjdd4962a',
    'cmrvwtu5m003m1ye80dnopc7f',
    'cmr4fte5501yo1yky4wqjzi42',
    'cmru2q8q9000m1y7w0nyeljc0',
    'cmru32mcv00471y7wmkrczjx9',
    'cmru3n7wu00ep1y7w4xqhx5bc',
    'cmr4cvf2u00s71yky61apuz7b',
    'cmr4exstf01le1ykyshotg81l',
    'cmr8br7pc00b41ylof91njnqa',
    'cmru96mj7003n1y0snedcjz5d',
    'cmru96qem004j1y0sax4s82zo',
    'cmr8lc51f009o1ygiabpy9pd2',
    'cmr9a11mw010u1ywy2jtxm2yd',
    'cmr8lqhfh00db1ygitegtuvqm',
    'cmr9a10y1010n1ywye5t1o0wn',
    'cmr4fl4if01we1ykyxdu13ktx',
    'cmr8mlsyw00mp1ygi5x3vnwdv',
    'cmr8quz0c01q21ygir7fogcfo',
    'cmr9b2f8101b11ywyxg2m85a3',
    'cmr8ie9s902b21yloft7y3qbl',
    'cmr8ie61r02a01yloguhrjolc',
    'cmr8atw9y000w1yloqjo20w1e',
    'cmr9b2c31019z1ywyvtlivttd',
    'cmr9b2g1101bb1ywyqwemzfas',
    'cmru32nv9004q1y7w0ascmvxc',
    'cmru3n64t00e51y7wpvo83s7w',
    'cmr8d1vh300qj1ylog0dmd1q9',
    'cmr9b2fdu01b31ywy9xu06h6n',
    'cmtpx8q7z002g1ymu8otdo5vn',
    'cmqxf0k6d00001yf1sxafige1',
    'cmr4cbu4900k31ykyt9bjalum',
    'cmr4eelr001fc1ykyqxoszojb',
    'cmr8bxvji00d11ylo9ieefjyq',
    'cmr8bxzjm00e51yloww2f4grs',
    'cmr8e5wdr016w1yloi18qya32',
    'cmr8ccg9500kl1yloenzuxhkr',
    'cmr8dbb7d00uq1ylottx4ziom',
    'cmr8c3owq00hs1ylov8hpmd6a',
    'cmr8ehzbq01aa1ylo9v9nb3kj',
    'cmr8ie6fp02a41yloybmrfi33',
    'cmr8j0o3102gz1yloxq3dz4cr',
    'cmr8om8fu016k1ygigpnlk649',
    'cmr8quwuf01pc1ygi2a3blk3d',
    'cmr8qv06w01qh1ygif8cigcib',
    'cmr985zrk00da1ywykji3ycop',
    'cmr9a15f3011w1ywyxyd8hkr2',
    'cmr9b2eem01ar1ywypgfew2ff',
    'cmr9bv1tq01l91ywybxku216j',
    'cmru8bdcw006r1yd6kc2esw4f',
    'cmru96ljq003f1y0sz9o0n8br',
    'cmru96rd7004r1y0sfbwt871x',
    'cmruihps100311yce5qiswwbs',
    'cmtpx6byf00031ymu2xw9o5cq'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3g_20261114_backup;
  IF n <> 93 THEN RAISE EXCEPTION 'backup %, expected 93', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3g_0$[{"label": "NICE NG250. For severe community-acquired pneumonia, including symptoms or signs of sepsis, use first-line intravenous antibiotics. Oral antibiotics are first line when the person can take them and the severity does not require intravenous treatment.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3g_0$::jsonb
WHERE id = 'cmr8n3szt00qw1ygi7y793m5j' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_1$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_1$::jsonb
WHERE id = 'cmqxf0lqs000i1yf1heewn04k' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_2$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_2$::jsonb
WHERE id = 'cmr8ei0oj01ar1ylo2j4qcs59' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_3$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_3$::jsonb
WHERE id = 'cmr9c35wk01ni1ywy8qk3axmq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_4$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_4$::jsonb
WHERE id = 'cmr8quy4001pr1ygiu5jptn5i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_5$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_5$::jsonb
WHERE id = 'cmr4f6d8p01pr1yky1edx4gvt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_6$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_6$::jsonb
WHERE id = 'cmqxeg8my00go1ymawwnmp5de' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_7$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_7$::jsonb
WHERE id = 'cmqxeg9iq00gx1ymasmiqom7x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_8$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_8$::jsonb
WHERE id = 'cmr8hrtl902451ylobwlwptit' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_9$[{"label": "NICE NG250. For severe community-acquired pneumonia, including symptoms or signs of sepsis, use first-line intravenous antibiotics. Oral antibiotics are first line when the person can take them and the severity does not require intravenous treatment.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3g_9$::jsonb
WHERE id = 'cmr8bagkk003m1yloyvddzlf1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_10$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_10$::jsonb
WHERE id = 'cmr8ie5r3029x1ylo1e28n5id' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_11$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_11$::jsonb
WHERE id = 'cmr8ie7qj02ah1ylojweeb50q' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_12$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_12$::jsonb
WHERE id = 'cmr8om7km01691ygietdseftn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_13$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_13$::jsonb
WHERE id = 'cmr9b2f2701az1ywym8irc15v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_14$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_14$::jsonb
WHERE id = 'cmr4e6kcf01bp1ykyvcvpbdsg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_15$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_15$::jsonb
WHERE id = 'cmr8oma6o01761ygi2ifwiiuk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_16$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_16$::jsonb
WHERE id = 'cmruylnw6004f1y2y55314pyu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_17$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_17$::jsonb
WHERE id = 'cmr4bnyc100b91yky2q1kbwzq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_18$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_18$::jsonb
WHERE id = 'cmr8j9r9t02kd1yloj44dqg23' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_19$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_19$::jsonb
WHERE id = 'cmr8ie6tv02a81yloew91mkt4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_20$[{"label": "NICE NG250. For severe community-acquired pneumonia, including symptoms or signs of sepsis, use first-line intravenous antibiotics. Oral antibiotics are first line when the person can take them and the severity does not require intravenous treatment.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3g_20$::jsonb
WHERE id = 'cmr8pgv7101d41ygip3c9wlou' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_21$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_21$::jsonb
WHERE id = 'cmr9a134g01191ywyy1mwhfvw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_22$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_22$::jsonb
WHERE id = 'cmr9a11cb010r1ywyq74i66yz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_23$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_23$::jsonb
WHERE id = 'cmr8q43oo01jy1ygiye0nxvxf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_24$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_24$::jsonb
WHERE id = 'cmr8ncls100sw1ygivtxu4xke' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_25$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_25$::jsonb
WHERE id = 'cmr9bnxvs01h71ywydjbjcvr4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_26$[{"label": "NICE NG136. Offer lifestyle advice to people with suspected or diagnosed hypertension. A healthy diet and regular exercise can reduce blood pressure.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3g_26$::jsonb
WHERE id = 'cmr8ny3zx00zp1ygi9s2aqedx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_27$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_27$::jsonb
WHERE id = 'cmruiheos002t1yceju7v76sy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_28$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_28$::jsonb
WHERE id = 'cmr9a12pv01151ywy58tdgt2i' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_29$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_29$::jsonb
WHERE id = 'cmr9buzdm01kf1ywy82opxsb5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_30$[{"label": "NICE NG136. Offer lifestyle advice to people with suspected or diagnosed hypertension. A healthy diet and regular exercise can reduce blood pressure.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3g_30$::jsonb
WHERE id = 'cmr98dnu400i41ywy3m5tkn3v' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_31$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_31$::jsonb
WHERE id = 'cmr8c3mwq00h81ylo94cpmwyw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_32$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_32$::jsonb
WHERE id = 'cmr9b2df501af1ywywkvkvh96' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_33$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_33$::jsonb
WHERE id = 'cmr9b2goi01bj1ywy4pcxeo9m' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_34$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_34$::jsonb
WHERE id = 'cmr9bv07101kp1ywyvvf0jn3u' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_35$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_35$::jsonb
WHERE id = 'cmru96oyu00471y0spt3bn78x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_36$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_36$::jsonb
WHERE id = 'cmr4dqt5u01521yky8w13dc32' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_37$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_37$::jsonb
WHERE id = 'cmr8fzada01o61ylood40bf9u' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_38$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_38$::jsonb
WHERE id = 'cmr8om9v301721ygir2aualx0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_39$[{"label": "NICE NG250. For severe community-acquired pneumonia, including symptoms or signs of sepsis, use first-line intravenous antibiotics. Oral antibiotics are first line when the person can take them and the severity does not require intravenous treatment.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3g_39$::jsonb
WHERE id = 'cmr9bnxop01h51ywy33adrang' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_40$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_40$::jsonb
WHERE id = 'cmr9c394w01om1ywyjdd4962a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_41$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_41$::jsonb
WHERE id = 'cmrvwtu5m003m1ye80dnopc7f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_42$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_42$::jsonb
WHERE id = 'cmr4fte5501yo1yky4wqjzi42' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_43$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_43$::jsonb
WHERE id = 'cmru2q8q9000m1y7w0nyeljc0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_44$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_44$::jsonb
WHERE id = 'cmru32mcv00471y7wmkrczjx9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_45$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_45$::jsonb
WHERE id = 'cmru3n7wu00ep1y7w4xqhx5bc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_46$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_46$::jsonb
WHERE id = 'cmr4cvf2u00s71yky61apuz7b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_47$[{"label": "NICE NG250. Give oral antibiotics first line for community-acquired pneumonia if the person can take oral medicines and the severity does not require intravenous antibiotics.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3g_47$::jsonb
WHERE id = 'cmr4exstf01le1ykyshotg81l' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_48$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_48$::jsonb
WHERE id = 'cmr8br7pc00b41ylof91njnqa' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_49$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_49$::jsonb
WHERE id = 'cmru96mj7003n1y0snedcjz5d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_50$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_50$::jsonb
WHERE id = 'cmru96qem004j1y0sax4s82zo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_51$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_51$::jsonb
WHERE id = 'cmr8lc51f009o1ygiabpy9pd2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_52$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_52$::jsonb
WHERE id = 'cmr9a11mw010u1ywy2jtxm2yd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_53$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_53$::jsonb
WHERE id = 'cmr8lqhfh00db1ygitegtuvqm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_54$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_54$::jsonb
WHERE id = 'cmr9a10y1010n1ywye5t1o0wn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_55$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_55$::jsonb
WHERE id = 'cmr4fl4if01we1ykyxdu13ktx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_56$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_56$::jsonb
WHERE id = 'cmr8mlsyw00mp1ygi5x3vnwdv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_57$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_57$::jsonb
WHERE id = 'cmr8quz0c01q21ygir7fogcfo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_58$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_58$::jsonb
WHERE id = 'cmr9b2f8101b11ywyxg2m85a3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_59$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_59$::jsonb
WHERE id = 'cmr8ie9s902b21yloft7y3qbl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_60$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_60$::jsonb
WHERE id = 'cmr8ie61r02a01yloguhrjolc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_61$[{"label": "NICE NG136. Offer lifestyle advice to people with suspected or diagnosed hypertension. A healthy diet and regular exercise can reduce blood pressure.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3g_61$::jsonb
WHERE id = 'cmr8atw9y000w1yloqjo20w1e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_62$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_62$::jsonb
WHERE id = 'cmr9b2c31019z1ywyvtlivttd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_63$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_63$::jsonb
WHERE id = 'cmr9b2g1101bb1ywyqwemzfas' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_64$[{"label": "NICE NG136. Offer lifestyle advice to people with suspected or diagnosed hypertension. A healthy diet and regular exercise can reduce blood pressure.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3g_64$::jsonb
WHERE id = 'cmru32nv9004q1y7w0ascmvxc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_65$[{"label": "NICE NG136. Offer lifestyle advice to people with suspected or diagnosed hypertension. A healthy diet and regular exercise can reduce blood pressure.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3g_65$::jsonb
WHERE id = 'cmru3n64t00e51y7wpvo83s7w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_66$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_66$::jsonb
WHERE id = 'cmr8d1vh300qj1ylog0dmd1q9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_67$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_67$::jsonb
WHERE id = 'cmr9b2fdu01b31ywy9xu06h6n' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_68$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_68$::jsonb
WHERE id = 'cmtpx8q7z002g1ymu8otdo5vn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_69$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_69$::jsonb
WHERE id = 'cmqxf0k6d00001yf1sxafige1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_70$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_70$::jsonb
WHERE id = 'cmr4cbu4900k31ykyt9bjalum' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_71$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_71$::jsonb
WHERE id = 'cmr4eelr001fc1ykyqxoszojb' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_72$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_72$::jsonb
WHERE id = 'cmr8bxvji00d11ylo9ieefjyq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_73$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_73$::jsonb
WHERE id = 'cmr8bxzjm00e51yloww2f4grs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_74$[{"label": "NICE NG136. Offer lifestyle advice to people with suspected or diagnosed hypertension. A healthy diet and regular exercise can reduce blood pressure.", "url": "https://www.nice.org.uk/guidance/ng136/chapter/Recommendations"}]$s3g_74$::jsonb
WHERE id = 'cmr8e5wdr016w1yloi18qya32' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_75$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_75$::jsonb
WHERE id = 'cmr8ccg9500kl1yloenzuxhkr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_76$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_76$::jsonb
WHERE id = 'cmr8dbb7d00uq1ylottx4ziom' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_77$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_77$::jsonb
WHERE id = 'cmr8c3owq00hs1ylov8hpmd6a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_78$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_78$::jsonb
WHERE id = 'cmr8ehzbq01aa1ylo9v9nb3kj' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_79$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_79$::jsonb
WHERE id = 'cmr8ie6fp02a41yloybmrfi33' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_80$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_80$::jsonb
WHERE id = 'cmr8j0o3102gz1yloxq3dz4cr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_81$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_81$::jsonb
WHERE id = 'cmr8om8fu016k1ygigpnlk649' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_82$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_82$::jsonb
WHERE id = 'cmr8quwuf01pc1ygi2a3blk3d' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_83$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_83$::jsonb
WHERE id = 'cmr8qv06w01qh1ygif8cigcib' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_84$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_84$::jsonb
WHERE id = 'cmr985zrk00da1ywykji3ycop' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_85$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_85$::jsonb
WHERE id = 'cmr9a15f3011w1ywyxyd8hkr2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_86$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Intravenous fluids and blood products may be used, regardless of the cause, to keep vital organs perfused.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3g_86$::jsonb
WHERE id = 'cmr9b2eem01ar1ywypgfew2ff' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_87$[{"label": "NICE NG28. If an adult with type 2 diabetes has symptoms of hyperglycaemia, consider insulin or a sulfonylurea, and review treatment when blood glucose is within the person's targets.", "url": "https://www.nice.org.uk/guidance/ng28/chapter/Blood-glucose-management"}]$s3g_87$::jsonb
WHERE id = 'cmr9bv1tq01l91ywybxku216j' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_88$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$s3g_88$::jsonb
WHERE id = 'cmru8bdcw006r1yd6kc2esw4f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_89$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_89$::jsonb
WHERE id = 'cmru96ljq003f1y0sz9o0n8br' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_90$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_90$::jsonb
WHERE id = 'cmru96rd7004r1y0sfbwt871x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_91$[{"label": "Merck Manual Professional. Postpartum endometritis. Treatment is with broad-spectrum antibiotics, for example clindamycin plus gentamicin.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/postpartum-care-and-associated-disorders/postpartum-endometritis"}]$s3g_91$::jsonb
WHERE id = 'cmruihps100311yce5qiswwbs' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3g_92$[{"label": "Grundy SM et al. 2018 AHA/ACC cholesterol guideline. A healthy lifestyle reduces atherosclerotic risk at all ages. In young adults 20 to 39 years of age, lifetime-risk assessment emphasizes intensive lifestyle efforts.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7403606/"}]$s3g_92$::jsonb
WHERE id = 'cmtpx6byf00031ymu2xw9o5cq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3g_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 93 THEN RAISE EXCEPTION 'cited %, expected 93', n; END IF;
END $cited$;
COMMIT;

-- Step 3 stem repairs, 2026-11-14.
-- 84 served items. Fixed with the key kept: 76. Rekeyed: 8. Hidden: 0.
-- References are not changed.
-- Backup qbi_usmle_s3stem_20261114_backup.
-- Undo: scripts/undo-usmle-s3stem-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_s3stem_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr4dz6kz017p1ykyqhc0rj8j',
    'cmr8qfqmf01ne1ygibf5lzycr',
    'cmr99rhpg00y91ywyoejz22cm',
    'cmru855my003t1yd6wjb6c5pt',
    'cmr8i0akz026x1ylo1hnnkyhc',
    'cmr98vomb00o11ywyfg9c6ipz',
    'cmr8dqd5a01151ylozr8fd7ae',
    'cmr8ie5jt029v1yloaiph46j7',
    'cmr8ie84s02al1ylolxh8hfon',
    'cmr8mltld00mx1ygigxhk7mmt',
    'cmr8i0cr3027o1ylo5b35v4ar',
    'cmr8i0dpv02801ylohvohqpvm',
    'cmr8j9rsq02ki1ylo9y5ptn8i',
    'cmr8qv0qv01qo1ygi5ig67gks',
    'cmr8dyoko014n1ylovq2517lz',
    'cmr9bbs4f01dr1ywykxw6rmvg',
    'cmr8quyg501pv1ygil5gqi87p',
    'cmr8pvgcz01gm1ygi7vg1vavj',
    'cmr9bbu8y01eb1ywy1fey8167',
    'cmru32kkq003l1y7wpz56wd3h',
    'cmr98vmhl00nc1ywyx15uz7zg',
    'cmr8hghty020z1ylo5tdrtbuh',
    'cmr8n3thk00r11ygit0ye1t4y',
    'cmr8pguph01cy1ygi42yvy1gg',
    'cmr8j9ok202jn1ylopg0qikbm',
    'cmruye60z00041y2yyufvqs3n',
    'cmr9a13mq011e1ywyfoftqkwm',
    'cmr8omaw4017f1ygioghxt0t4',
    'cmr9bnz8x01hj1ywyc7bi7y8t',
    'cmr8mlt4p00mr1ygie3vkinga',
    'cmr9bnwus01gx1ywyn5xz2z5z',
    'cmr8br75800ax1ylo44gyywu8',
    'cmr8atuqd000h1ylo325xpopv',
    'cmr8qfqvj01nh1ygi69snvlmn',
    'cmr8cn8rx00nb1yloqt53k1xc',
    'cmr97c3hq000b1ywyyh1gmc3h',
    'cmr8mlsnj00ml1ygij4oaydqh',
    'cmr98vqa900ol1ywypt85j94f',
    'cmr9bbsd601dt1ywyvr1muocz',
    'cmr8mlww600o21ygi4mlz8ji1',
    'cmr8db9vr00ud1yloibd3x3sd',
    'cmr8lqkfu00e41ygiaoqmcsgh',
    'cmr8pvg2501gj1ygirgss4qw7',
    'cmr98613400dr1ywywt098v88',
    'cmr8ie4zu029q1ylo6td87305',
    'cmr8mlw9n00nu1ygi2cz41zwh',
    'cmr8quz3801q31ygie27e66ww',
    'cmr98vmvn00ng1ywye99sy3ue',
    'cmr99ri6t00yf1ywy0lxmbzx8',
    'cmr99rf5p00xd1ywym4b43vye',
    'cmr8dyl7q013q1yloml93frqe',
    'cmr8f2lga01h01ylobrsiiwqo',
    'cmru3ugjr00i71y7wdbun1873',
    'cmr8br69e00am1ylo5e8qb8eg',
    'cmru8v5x4001d1y0synjrs6xx',
    'cmru96kg300361y0sxybovjci',
    'cmru9istm00ae1y0svwlygngd',
    'cmr8ji6f502mz1yloyf6k004l',
    'cmruyg6ts001f1y2yzv5cl6ka',
    'cmruyfher000y1y2yglne8u0f',
    'cmr8cnc5s00of1ylof7nldggx',
    'cmr4gbstt025n1yky9d2hh9dd',
    'cmr8br6cd00an1ylo84notxl5',
    'cmr8cnadk00nu1ylo13fe8v69',
    'cmr8dyp6l014t1ylow4hqrl1d',
    'cmr8f2ofy01i11yloaeqfmfbc',
    'cmr8f2mty01hh1ylolhgl0c56',
    'cmr8ki7xj003l1ygiw1w30f7m',
    'cmr8mlvpj00nn1ygi30nq6cno',
    'cmr8mluej00n71ygiquwcu1t6',
    'cmr8nmhvn00wi1ygi0wfqqzda',
    'cmr8ny6c3010h1ygil7zfg53h',
    'cmr8qfnmx01md1ygiav1dudpc',
    'cmr8q44sv01kc1ygi9f2pphnj',
    'cmr97c4zu000q1ywy5xqjxjm2',
    'cmr98vny400nt1ywy8zvn0s73',
    'cmr98dlzi00hl1ywyady7dsv5',
    'cmr97qdvk006w1ywyu4zgllhb',
    'cmr98vovk00o41ywyei7bf8ek',
    'cmr97z2rn00bh1ywypcol0fqa',
    'cmr9b2gfj01bg1ywyi0pygab7',
    'cmr99rhgh00y61ywye0gjp4qj',
    'cmr9b2cxo01a91ywy6hrnwllf',
    'cmru96k7400351y0sxsskj9zz'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_s3stem_20261114_backup) <> 84 THEN
    RAISE EXCEPTION 'backup row count %, expected 84', (SELECT COUNT(*) FROM qbi_usmle_s3stem_20261114_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s0$A 34-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of type 1 diabetes and has been experiencing polyuria and polydipsia for the past two days. On examination, her blood pressure is 90/60 mm Hg, heart rate is 120 bpm, and she has dry mucous membranes. Laboratory tests reveal a blood glucose level of 450 mg/dL and a serum bicarbonate level of 15 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s0$,
  "question" = $q0$What is the most likely diagnosis?$q0$,
  "correctAnswer" = $k0$Diabetic ketoacidosis$k0$,
  "contentHash" = 'bcb3e643d0d07057340e11adeca897cdf0960a42b51fec314af6b5ea12969583',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr4dz6kz017p1ykyqhc0rj8j'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w0$Diabetic ketoacidosis$w0$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s1$A 65-year-old woman is admitted to the surgical ward following a total hip arthroplasty. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), with a heart rate of 102 beats per minute and a blood pressure of 130/85 mm Hg. Her white blood cell count is 12,000/mm³, and she reports increased pain at the surgical site. She has no history of recent infections and is currently on prophylactic antibiotics. The incision is erythematous and warm and is draining pus.$s1$,
  "question" = $q1$What is the most likely diagnosis?$q1$,
  "correctAnswer" = $k1$Wound infection$k1$,
  "contentHash" = 'f1371e49e53ff95373d1aa55a281e36770d8de2e249ceee5c4e3a66fa17c3184',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8qfqmf01ne1ygibf5lzycr'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w1$Wound infection$w1$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s2$A 60-year-old woman with a history of hypertension and diabetes presents to the clinic with complaints of increased thirst and frequent urination over the past month. Her blood pressure is 130/80 mm Hg, heart rate is 78 bpm, and her laboratory tests reveal a serum glucose level of 450 mg/dL and an anion gap of 18 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s2$,
  "question" = $q2$What is the most likely diagnosis?$q2$,
  "correctAnswer" = $k2$Diabetic ketoacidosis$k2$,
  "contentHash" = '8ff101c91920cecc228988945133ba5ef43a47f55c3e40355e98e670f31f4d03',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr99rhpg00y91ywyoejz22cm'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w2$Diabetic ketoacidosis$w2$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s3$A 34-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain that started suddenly two hours ago. She has a history of gallstones and reports nausea and vomiting. On examination, her vital signs show a blood pressure of 90/60 mm Hg, heart rate of 120 bpm, and she appears diaphoretic. Laboratory tests reveal elevated liver enzymes (AST 150 U/L, ALT 180 U/L) and a bilirubin level of 3.0 mg/dL. The right upper quadrant is tender and Murphy sign is positive. Temperature is 38.6°C and the leukocyte count is 14,000/mm³.$s3$,
  "question" = $q3$What is the most likely diagnosis?$q3$,
  "correctAnswer" = $k3$Acute cholecystitis$k3$,
  "contentHash" = 'e581688e67fa96794d114f0c791e6a48c42e6e8376d8d695ad41087d47ecb20f',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmru855my003t1yd6wjb6c5pt'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w3$Acute cholecystitis$w3$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s4$A 65-year-old woman is admitted to the surgical ward following a laparoscopic cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and reports abdominal pain. Vital signs show BP 110/70 mm Hg, HR 100 bpm, and a respiratory rate of 22 breaths/min. Laboratory tests reveal a white blood cell count of 14,000/mm³. The incision is erythematous and warm and is draining pus.$s4$,
  "question" = $q4$What is the most likely diagnosis?$q4$,
  "correctAnswer" = $k4$Wound infection$k4$,
  "contentHash" = '554c44a415c37dc2569e1372c63aa2ee12ec36bb032c5a1eea0a8358a4293014',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8i0akz026x1ylo1hnnkyhc'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w4$Wound infection$w4$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s5$A 62-year-old woman is admitted to the surgical unit following a laparoscopic cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and reports increasing abdominal pain. Her vital signs are stable with a blood pressure of 120/75 mm Hg and a heart rate of 88 bpm. Laboratory tests show a white blood cell count of 14,000/mm³. She has no history of fever prior to surgery and no known allergies. The incision is erythematous and warm and is draining pus.$s5$,
  "question" = $q5$What is the most likely diagnosis?$q5$,
  "correctAnswer" = $k5$Wound infection$k5$,
  "contentHash" = '911ab750cc2672c0f8642c684f15c6ad7d4299333886d6e33b87e3e394da5570',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr98vomb00o11ywyfg9c6ipz'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w5$Wound infection$w5$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s6$A 60-year-old male presents to the emergency department with severe abdominal pain and vomiting after not eating for two days. He has a history of gallstones and is found to be hypotensive with a blood pressure of 90/60 mm Hg and a heart rate of 115 bpm. A CT scan reveals a distended gallbladder filled with stones and surrounding inflammation, consistent with acute cholecystitis. The right upper quadrant is tender and Murphy sign is positive. Temperature is 38.6°C and the leukocyte count is 14,000/mm³.$s6$,
  "question" = $q6$What is the most likely diagnosis?$q6$,
  "correctAnswer" = $k6$Acute cholecystitis$k6$,
  "contentHash" = '96147295a5597ce1643fcb76446bb77dc18215df5dd88180f285733f42091476',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8dqd5a01151ylozr8fd7ae'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w6$Acute cholecystitis$w6$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s7$A 32-year-old woman presents to the emergency department two weeks after a vaginal delivery. She reports persistent heavy vaginal bleeding and passage of large clots. On examination, her blood pressure is 90/60 mm Hg, heart rate is 115 bpm, and she appears pale. Laboratory tests reveal a hemoglobin level of 8.5 g/dL and a platelet count of 150,000/mm³. She has no history of bleeding disorders and is currently not on any anticoagulants. The uterus is firm and nontender. She is afebrile. Pelvic ultrasound shows echogenic tissue in the uterine cavity.$s7$,
  "question" = $q7$What is the most likely diagnosis?$q7$,
  "correctAnswer" = $k7$Retained placental tissue$k7$,
  "contentHash" = 'b2f975b7b1a231f0c87093294c2e6c22becd61b1b3fabfaf1671f91e171609bd',
  explanation = $e7$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$e7$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8ie5jt029v1yloaiph46j7'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w7$Uterine atony$w7$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s8$A 32-year-old woman presents to the emergency department with heavy vaginal bleeding and severe abdominal pain 5 days after a cesarean delivery. She reports feeling faint and has a heart rate of 110 beats per minute and a blood pressure of 90/60 mm Hg. Laboratory tests reveal a hemoglobin level of 7.2 g/dL. The patient has no known allergies and is currently on ibuprofen for pain management. The uterus is firm and nontender. She is afebrile. Pelvic ultrasound shows echogenic tissue in the uterine cavity.$s8$,
  "question" = $q8$What is the most likely diagnosis?$q8$,
  "correctAnswer" = $k8$Retained placental tissue$k8$,
  "contentHash" = '585c1f299b923bf00f1fd5c2d45c70136964b6c6ac77bfc5e677820c14db8959',
  explanation = $e8$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$e8$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8ie84s02al1ylolxh8hfon'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w8$Uterine atony$w8$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s9$A 28-year-old woman presents to the emergency department with heavy vaginal bleeding and severe abdominal pain three days after a vaginal delivery. She reports passing several large clots and feels lightheaded. On examination, her blood pressure is 90/60 mm Hg, heart rate is 115 bpm, and she appears pale. A CBC shows hemoglobin of 8.5 g/dL and platelet count of 150,000/mm³. The patient has no significant past medical history and denies any known bleeding disorders. The uterus is firm and nontender. She is afebrile. Pelvic ultrasound shows echogenic tissue in the uterine cavity.$s9$,
  "question" = $q9$What is the most likely diagnosis?$q9$,
  "correctAnswer" = $k9$Retained placental tissue$k9$,
  "contentHash" = '1021b2467b6547b5cf64cdb84e96daf042dfac288cd4fa7b9b56ab4d68bcd015',
  explanation = $e9$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$e9$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mltld00mx1ygigxhk7mmt'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w9$Uterine atony$w9$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s10$A 62-year-old woman is admitted to the surgical ward following a laparoscopic cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and reports abdominal pain. Her vital signs are stable with a blood pressure of 120/75 mm Hg, heart rate of 88 bpm, and respiratory rate of 16 breaths per minute. Laboratory tests show a white blood cell count of 12,000/mm³ with a left shift. She has no history of fever prior to surgery. The incision is erythematous and warm and is draining pus.$s10$,
  "question" = $q10$Which of the following is the most likely diagnosis?$q10$,
  "correctAnswer" = $k10$Wound infection$k10$,
  "contentHash" = '558ec1ac63a533ba9883a5eb78690db3ffbb665d65ddf0788e70cd6912881494',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8i0cr3027o1ylo5b35v4ar'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w10$Wound infection$w10$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s11$A 65-year-old woman is admitted to the surgical ward following a hip replacement surgery. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and has a heart rate of 110 beats per minute. Her blood pressure is stable at 120/80 mm Hg, and she reports mild pain at the surgical site. Laboratory tests show a white blood cell count of 12,000/mm³. She has no history of allergies and is currently on pain management with acetaminophen. The incision is erythematous and warm and is draining pus.$s11$,
  "question" = $q11$What is the most likely diagnosis?$q11$,
  "correctAnswer" = $k11$Surgical site infection$k11$,
  "contentHash" = '441917f846a293ea7ab6c43b7fea627f543055f88a4e728f8eefe180751f5401',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8i0dpv02801ylohvohqpvm'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w11$Surgical site infection$w11$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s12$A 62-year-old woman is admitted to the surgical unit following a laparoscopic cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), with a heart rate of 102 beats per minute and a blood pressure of 110/70 mm Hg. Laboratory tests reveal a white blood cell count of 14,000/mm³ and a C-reactive protein level of 15 mg/L. She has no history of previous infections and has been afebrile until now. The incision is erythematous and warm and is draining pus.$s12$,
  "question" = $q12$What is the most likely diagnosis?$q12$,
  "correctAnswer" = $k12$Wound infection$k12$,
  "contentHash" = '5f2abf12f52a9dc26fecdbad923585a49d28c2562bfca3056dfa159fedd63aa4',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8j9rsq02ki1ylo9y5ptn8i'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w12$Wound infection$w12$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s13$A 32-year-old woman presents to the emergency department with heavy vaginal bleeding and severe abdominal pain two weeks after a spontaneous vaginal delivery. She reports passing several large clots and is feeling faint. On examination, her blood pressure is 90/60 mm Hg, heart rate is 115 bpm, and she has a tender, enlarged uterus. Laboratory tests reveal a hemoglobin level of 8.0 g/dL and a platelet count of 150,000/mm³. The patient has no known allergies and is currently taking prenatal vitamins. The uterus is firm and nontender. She is afebrile. Pelvic ultrasound shows echogenic tissue in the uterine cavity.$s13$,
  "question" = $q13$What is the most likely diagnosis?$q13$,
  "correctAnswer" = $k13$Retained placental tissue$k13$,
  "contentHash" = 'e6e1ae2ae7cb065b232fffed1b94e58ac8400c372ccaf26bd9c2c716f266653d',
  explanation = $e13$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$e13$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8qv0qv01qo1ygi5ig67gks'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w13$Uterine atony$w13$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s14$A 65-year-old woman is admitted to the surgical unit following a total knee replacement. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and reports chills. Her vital signs show a heart rate of 95 bpm, blood pressure of 130/85 mm Hg, and respiratory rate of 20 breaths per minute. Laboratory tests reveal a white blood cell count of 12,000/mm³ with a left shift. She has no history of infection prior to surgery. The incision is erythematous and warm and is draining pus.$s14$,
  "question" = $q14$Which of the following is the most likely diagnosis?$q14$,
  "correctAnswer" = $k14$Wound infection$k14$,
  "contentHash" = '8f7d346cbafcfd4fe7a7c0b5f786352121064c1201ef936ff844d5626c52c125',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8dyoko014n1ylovq2517lz'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w14$Wound infection$w14$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s15$A 65-year-old woman is admitted to the surgical ward following a laparoscopic cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), tachycardia with a heart rate of 110 beats per minute, and her blood pressure is stable at 120/80 mm Hg. She has a history of hypertension and diabetes, and her current medications include metformin and lisinopril. Laboratory results show a white blood cell count of 12,000/mm³ with a left shift. The incision is erythematous and warm and is draining pus.$s15$,
  "question" = $q15$What is the most likely diagnosis?$q15$,
  "correctAnswer" = $k15$Wound infection$k15$,
  "contentHash" = 'e9744dabef1afda0eb544d712c45a1c7602cef5b919baffb5b1c8f322eb5886b',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr9bbs4f01dr1ywykxw6rmvg'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w15$Wound infection$w15$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s16$A 30-year-old woman presents to the emergency department with heavy vaginal bleeding and severe abdominal pain 5 days after a spontaneous vaginal delivery. She reports passing several large clots and feels faint. On examination, her blood pressure is 90/60 mm Hg, heart rate is 110 bpm, and she appears pale. A CBC shows hemoglobin of 8.0 g/dL and platelets of 250,000/mm³. The uterus is firm and contracted upon palpation. The uterus is firm and nontender. She is afebrile. Pelvic ultrasound shows echogenic tissue in the uterine cavity.$s16$,
  "question" = $q16$What is the most likely diagnosis?$q16$,
  "correctAnswer" = $k16$Retained placental tissue$k16$,
  "contentHash" = '8670e10c68bc9fdbd4d15fdc9924a3f80d9053df8bce2f402e872329cf185e42',
  explanation = $e16$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$e16$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8quyg501pv1ygil5gqi87p'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w16$Uterine atony$w16$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s17$A 30-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain and vomiting. She has a history of type 1 diabetes mellitus and reports that she has been unable to keep any food down for the past 24 hours. On examination, her vital signs show a blood pressure of 90/60 mm Hg, heart rate of 120 beats per minute, and she appears dehydrated. Laboratory tests reveal a blood glucose level of 450 mg/dL and a serum bicarbonate level of 12 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s17$,
  "question" = $q17$What is the most likely diagnosis?$q17$,
  "correctAnswer" = $k17$Diabetic ketoacidosis$k17$,
  "contentHash" = 'b4d1f9a747fa183c819b4cce6f0026fe6f665cb3fe8ecffece82f72df9289414',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8pvgcz01gm1ygi7vg1vavj'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w17$Diabetic ketoacidosis$w17$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s18$A 62-year-old woman is admitted to the surgical ward following a total hip replacement. On postoperative day 6, she develops a fever of 101.5°F (38.6°C). Her vital signs show a blood pressure of 110/70 mm Hg, heart rate of 98 beats per minute, and respiratory rate of 18 breaths per minute. She is alert and oriented but reports mild discomfort at the surgical site. Laboratory tests reveal a white blood cell count of 12,000 cells/mm³ with a left shift. There are no signs of deep vein thrombosis or pulmonary embolism on examination. The incision is erythematous and warm and is draining pus.$s18$,
  "question" = $q18$What is the most likely diagnosis?$q18$,
  "correctAnswer" = $k18$Surgical site infection$k18$,
  "contentHash" = '8f65b3ea8f39b69697cfbfe0514424db82c5e177e9b6bcabe848aa7465399efd',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr9bbu8y01eb1ywy1fey8167'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w18$Surgical site infection$w18$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s19$A 32-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain and vomiting. She has a history of type 1 diabetes and has been experiencing polyuria and polydipsia over the past few days. On examination, her blood pressure is 100/60 mm Hg, heart rate is 120 bpm, and she appears dehydrated. Laboratory results show a blood glucose level of 450 mg/dL and a serum bicarbonate level of 15 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s19$,
  "question" = $q19$What is the most likely diagnosis?$q19$,
  "correctAnswer" = $k19$Diabetic ketoacidosis$k19$,
  "contentHash" = 'd72600ee970101470b3b58bfc53990d5c25a1ed5ed977b9b56d2823707e54cda',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmru32kkq003l1y7wpz56wd3h'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w19$Diabetic ketoacidosis$w19$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s20$A 65-year-old woman is admitted to the surgical ward after a total hip replacement. On postoperative day 6, she develops a fever of 101.5°F (38.6°C). Her vital signs are stable, with a blood pressure of 120/80 mm Hg and a heart rate of 85 bpm. Laboratory tests show a white blood cell count of 12,000/mm³. She has no history of infection prior to surgery. The incision is erythematous and warm and is draining pus.$s20$,
  "question" = $q20$What is the most likely diagnosis?$q20$,
  "correctAnswer" = $k20$Wound infection$k20$,
  "contentHash" = '51e170a8ef76ac3d45a8aa716c19808e5b9e963ffc503f70fd409bf1281ac246',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr98vmhl00nc1ywyx15uz7zg'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w20$Wound infection$w20$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s21$A 3-year-old girl is brought to the emergency department with a high fever and a rash. Her mother reports that the rash started on the face and spread to the trunk and extremities. The child has not received her MMR vaccine. On examination, she has a temperature of 102°F (38.9°C) and a maculopapular rash. Investigators enroll children who already have this illness and children who do not, then compare their earlier exposures.$s21$,
  "question" = $q21$Which study design is described?$q21$,
  "correctAnswer" = $k21$Case-control study$k21$,
  "contentHash" = '257d6694365cc740896f0accfbfdf8b2d74247a5e3d4a94e7ff511c577c454c5',
  explanation = $e21$Investigators start with people who have the illness and people who do not, then look back at exposures. That design is a case-control study.$e21$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8hghty020z1ylo5tdrtbuh'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w21$Case-control study$w21$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s22$A 9-year-old boy is brought to the emergency department after experiencing a seizure. His mother reports that he has been feeling unwell for the past few days with fever and cough. On examination, he has a temperature of 39.5°C (103°F) and is lethargic. A lumbar puncture is performed, and the cerebrospinal fluid (CSF) analysis shows an elevated white blood cell count with a predominance of lymphocytes. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s22$,
  "question" = $q22$Which study design is described?$q22$,
  "correctAnswer" = $k22$Cohort study$k22$,
  "contentHash" = '1781b2ee15d9df3546652a839bc23cda0f0afe889f89c582bdfde3cf3d1fe6f2',
  explanation = $e22$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e22$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8n3thk00r11ygit0ye1t4y'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w22$Cohort study$w22$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s23$A 7-year-old girl is brought to the emergency department with a 2-day history of fever, sore throat, and difficulty swallowing. On examination, she has a temperature of 38.9°C (102°F), and her throat appears red with enlarged tonsils and white exudates. Her mother reports that she has had a recent exposure to a classmate with strep throat. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s23$,
  "question" = $q23$Which study design is described?$q23$,
  "correctAnswer" = $k23$Cohort study$k23$,
  "contentHash" = '4611c2fc422197b89a7112fd9ee612fa80c71b710f73e131c0a2faa6d320d1df',
  explanation = $e23$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e23$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8pguph01cy1ygi42yvy1gg'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w23$Cohort study$w23$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s24$A 62-year-old woman is admitted to the surgical ward following an elective cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and reports chills. Her vital signs show a blood pressure of 110/70 mm Hg, heart rate of 95 bpm, and respiratory rate of 18 breaths/min. Laboratory results reveal a white blood cell count of 12,000/mm³ with 80% neutrophils. She has no history of infection prior to surgery. The incision is erythematous and warm and is draining pus.$s24$,
  "question" = $q24$What is the most likely diagnosis?$q24$,
  "correctAnswer" = $k24$Wound infection$k24$,
  "contentHash" = '91083a6fe0d66b6143dff19a5647a9ce60f0d0e4455f2b7f6c1b55752fe63c13',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8j9ok202jn1ylopg0qikbm'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w24$Wound infection$w24$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s25$Abstract — Identifying Bias in Observational Studies\nSource: USMLE Step 3\nAn observational study investigates the association between coffee consumption and reduced risk of type 2 diabetes. Participants self-report their coffee intake and are followed for 10 years. The study finds that higher coffee consumption is linked to a lower incidence of diabetes, but the research faces criticism for potential bias. People who drank more coffee also exercised more often, and physical activity was not measured or adjusted for.$s25$,
  "question" = $q25$Which type of bias is most likely affecting the study's validity?$q25$,
  "correctAnswer" = $k25$Confounding bias$k25$,
  "contentHash" = '76bfb1e62494e4bb5ce665bb64ad62bec7202ee498a635015170a5e6fd95d65d',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmruye60z00041y2yyufvqs3n'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w25$Confounding bias$w25$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s26$A 32-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. Her vital signs are stable with a blood pressure of 110/70 mm Hg and a heart rate of 80 bpm. She reports her water broke 6 hours ago, and she has been experiencing moderate pain. A cervical exam reveals she is 4 cm dilated and 80% effaced. The fetal heart rate tracing shows a reassuring pattern. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s26$,
  "question" = $q26$Which study design is described?$q26$,
  "correctAnswer" = $k26$Randomized controlled trial$k26$,
  "contentHash" = 'b4886b8854f99067c56a219632ac07d0cb87d964b1dc96713b1abd51d46de800',
  explanation = $e26$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e26$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr9a13mq011e1ywyfoftqkwm'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w26$Randomized controlled trial$w26$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s27$A 25-year-old woman presents for a routine check-up during her third trimester of pregnancy. She has a history of gestational diabetes and is currently on dietary management. Her blood pressure is 130/85 mm Hg, and her urine dipstick shows 1+ protein. She is concerned about the risk of preeclampsia. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s27$,
  "question" = $q27$Which study design is described?$q27$,
  "correctAnswer" = $k27$Cohort study$k27$,
  "contentHash" = '0c67d5f88f28843cbfddaadf5fb559772c1097cc2421d534b62ad6232b96d00d',
  explanation = $e27$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e27$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8omaw4017f1ygioghxt0t4'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w27$Cohort study$w27$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s28$A 7-year-old boy presents to the clinic for a routine check-up. His mother mentions that he has been experiencing frequent headaches and occasional dizziness. On examination, his blood pressure is 130/85 mm Hg, which is elevated for his age. A urinalysis shows the presence of protein and blood. The physician suspects a renal cause for his symptoms. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s28$,
  "question" = $q28$Which study design is described?$q28$,
  "correctAnswer" = $k28$Cohort study$k28$,
  "contentHash" = 'c38a512ddc38fe468ed73ed9d35967377fa1fa7bd231cbaa679df945dee156be',
  explanation = $e28$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e28$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr9bnz8x01hj1ywyc7bi7y8t'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w28$Cohort study$w28$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s29$A 32-year-old woman presents to the emergency department with heavy vaginal bleeding and severe abdominal pain three days after giving birth. She has a history of preeclampsia and was discharged home on day two postpartum. On examination, her blood pressure is 90/60 mm Hg, heart rate is 110 bpm, and she appears pale and diaphoretic. A CBC shows hemoglobin of 8.5 g/dL and platelets of 150,000/mm³. The uterus is firm and nontender. She is afebrile. Pelvic ultrasound shows echogenic tissue in the uterine cavity.$s29$,
  "question" = $q29$What is the most likely diagnosis?$q29$,
  "correctAnswer" = $k29$Retained placental tissue$k29$,
  "contentHash" = '197a2926d70f46a9a0ce93a153be956cf45b1832ae68de3b54d5057605efcb5d',
  explanation = $e29$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$e29$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mlt4p00mr1ygie3vkinga'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w29$Uterine atony$w29$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s30$A 12-year-old girl presents to the emergency department with severe abdominal pain and vomiting. She has a history of recurrent urinary tract infections and has been treated with antibiotics multiple times. On examination, she has a fever of 39°C (102.2°F) and tenderness in the suprapubic area. A urinalysis shows positive nitrites and leukocyte esterase. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s30$,
  "question" = $q30$Which study design is described?$q30$,
  "correctAnswer" = $k30$Cohort study$k30$,
  "contentHash" = '990ee4d4b7c7feec1c69582c49b82174efd56c344fc1a7db09a34e47e8e0b579',
  explanation = $e30$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e30$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr9bnwus01gx1ywyn5xz2z5z'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w30$Cohort study$w30$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s31$A 34-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain for the past 24 hours. She has a history of gallstones and reports nausea and vomiting. On examination, her vital signs are stable with a blood pressure of 120/80 mm Hg and a heart rate of 88 bpm. Laboratory tests show elevated liver enzymes (AST 150 U/L, ALT 175 U/L) and an ultrasound reveals a gallbladder filled with stones and signs of inflammation. The right upper quadrant is tender and Murphy sign is positive. Temperature is 38.6°C and the leukocyte count is 14,000/mm³.$s31$,
  "question" = $q31$What is the most likely diagnosis?$q31$,
  "correctAnswer" = $k31$Acute cholecystitis$k31$,
  "contentHash" = 'cd7b57a21309eb9c9f9bf9dda06fdce95ce55c2821fffa3618c078b379b3196b',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8br75800ax1ylo44gyywu8'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w31$Acute cholecystitis$w31$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s32$A 65-year-old woman is admitted to the surgical ward following a total hip replacement. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), with a heart rate of 98 beats per minute and a blood pressure of 130/80 mm Hg. She has a history of hypertension and diabetes, and her current medications include metformin and lisinopril. Laboratory tests show a white blood cell count of 12,000/mm³ and a C-reactive protein level of 10 mg/dL. The incision is erythematous and warm and is draining pus.$s32$,
  "question" = $q32$What is the most likely diagnosis?$q32$,
  "correctAnswer" = $k32$Surgical site infection$k32$,
  "contentHash" = 'fc2d70fc78e8d95a833db544efc15e6666501277ada5ead603d38d768e4f64e3',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8atuqd000h1ylo325xpopv'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w32$Surgical site infection$w32$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s33$A 65-year-old woman presents to the emergency department with a fever of 101.5°F, tachycardia with a heart rate of 110 bpm, and a blood pressure of 90/60 mm Hg. She underwent a total knee arthroplasty 3 days ago and has been experiencing increasing pain and swelling in her right knee. Laboratory tests reveal a white blood cell count of 15,000/mm³ with a left shift. The incision is erythematous and warm and is draining pus.$s33$,
  "question" = $q33$What is the most likely diagnosis?$q33$,
  "correctAnswer" = $k33$Wound infection$k33$,
  "contentHash" = '88430e96a38e799d8514af18b1f092241ddf429486b03091cbd9ad1442298e40',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8qfqvj01nh1ygi69snvlmn'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w33$Wound infection$w33$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s34$A 65-year-old woman is admitted to the surgical ward following a total hip replacement. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), with a heart rate of 102 beats per minute and a blood pressure of 120/80 mm Hg. Her white blood cell count is 12,000/mm³, and she reports mild tenderness at the surgical site. She has no history of fever prior to surgery and is currently on prophylactic antibiotics. The incision is erythematous and warm and is draining pus.$s34$,
  "question" = $q34$What is the most likely diagnosis?$q34$,
  "correctAnswer" = $k34$Surgical site infection$k34$,
  "contentHash" = '078e63bbf46c8d2a198958f0adf46fa9a79fa56d3ee3cd8a8adf5519a9761e04',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8cn8rx00nb1yloqt53k1xc'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w34$Surgical site infection$w34$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s35$A 72-year-old man with a history of coronary artery disease undergoes a laparoscopic cholecystectomy. Postoperatively, he develops a fever of 101.5°F, tachycardia at 110 bpm, and leukocytosis with a white blood cell count of 12,000/mm³. He is otherwise stable. The incision is erythematous and warm and is draining pus.$s35$,
  "question" = $q35$What is the most likely diagnosis?$q35$,
  "correctAnswer" = $k35$Wound infection$k35$,
  "contentHash" = '6c263821cb7a175696d6375221d88c9a98964a7c98f86222050af3b64cf78024',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr97c3hq000b1ywyyh1gmc3h'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w35$Wound infection$w35$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s36$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. Her vital signs are stable with a blood pressure of 120/80 mm Hg and a heart rate of 80 bpm. She reports a history of gestational diabetes managed with diet. On examination, the fetal heart rate is 140 bpm with moderate variability. The cervix is 4 cm dilated and 80% effaced. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s36$,
  "question" = $q36$Which study design is described?$q36$,
  "correctAnswer" = $k36$Randomized controlled trial$k36$,
  "contentHash" = '1428a51184f301cf8563b65e63a1e85592dfcdde53d4a56bc810a5e6efb7baeb',
  explanation = $e36$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e36$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mlsnj00ml1ygij4oaydqh'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w36$Randomized controlled trial$w36$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s37$A 34-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of gallstones and reports that the pain started suddenly after eating a fatty meal. On examination, her vital signs are stable with a blood pressure of 120/80 mm Hg and a heart rate of 88 bpm. Laboratory tests reveal an elevated white blood cell count of 15,000/mm³ and an alkaline phosphatase level of 250 U/L. The right upper quadrant is tender and Murphy sign is positive.$s37$,
  "question" = $q37$What is the most likely diagnosis?$q37$,
  "correctAnswer" = $k37$Acute cholecystitis$k37$,
  "contentHash" = '69892de11f804a23cbecae3856de536ffc27374e44b84eecdbf2d1021ad395fc',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr98vqa900ol1ywypt85j94f'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w37$Acute cholecystitis$w37$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s38$A 65-year-old woman is admitted to the surgical ward following a total hip replacement. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and has a heart rate of 110 bpm. She has no history of infection prior to surgery and her white blood cell count is 14,000/mm³. She is currently on prophylactic antibiotics. The incision is erythematous and warm and is draining pus.$s38$,
  "question" = $q38$Which of the following is the most likely diagnosis?$q38$,
  "correctAnswer" = $k38$Wound infection$k38$,
  "contentHash" = 'f4483a965ed957dc26c17cfc341c287285ae85f0ce9eb1324e80420c233df980',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr9bbsd601dt1ywyvr1muocz'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w38$Wound infection$w38$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s39$A 32-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. She reports a history of gestational diabetes, which has been well-controlled with diet. On examination, her blood pressure is 120/80 mm Hg, and the fetal heart rate is 140 beats per minute with moderate variability. The cervix is 4 cm dilated and 80% effaced. She is in active labor. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s39$,
  "question" = $q39$Which study design is described?$q39$,
  "correctAnswer" = $k39$Randomized controlled trial$k39$,
  "contentHash" = '36cfd2cd890f1da006b1ecf263842afa09957c01ea814ee18e7da55a9426d46d',
  explanation = $e39$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e39$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mlww600o21ygi4mlz8ji1'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w39$Randomized controlled trial$w39$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s40$A 35-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain that started suddenly 2 hours ago. She has a history of gallstones and is currently experiencing nausea and vomiting. On examination, her vital signs are stable with a blood pressure of 120/80 mm Hg and a heart rate of 92 bpm. Laboratory tests reveal elevated white blood cell count at 15,000 cells/mm³ and elevated liver enzymes (AST 150 U/L, ALT 180 U/L). The right upper quadrant is tender and Murphy sign is positive.$s40$,
  "question" = $q40$What is the most likely diagnosis?$q40$,
  "correctAnswer" = $k40$Acute cholecystitis$k40$,
  "contentHash" = 'faca5f8c39db2650a5a04548612b00d41403d61cf700d34f304af83ad0cff7b4',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8db9vr00ud1yloibd3x3sd'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w40$Acute cholecystitis$w40$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s41$A 45-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of gallstones and is currently experiencing a fever of 101°F (38.3°C) and a heart rate of 110 bpm. Laboratory tests reveal an elevated white blood cell count of 15,000/mm³ and elevated liver enzymes (AST 200 U/L, ALT 180 U/L). The right upper quadrant is tender and Murphy sign is positive.$s41$,
  "question" = $q41$What is the most likely diagnosis?$q41$,
  "correctAnswer" = $k41$Acute cholecystitis$k41$,
  "contentHash" = 'd2e64342af55a507d4914e6215bef7f8db67ed7def15e58d29915c4dbbf8f40a',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8lqkfu00e41ygiaoqmcsgh'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w41$Acute cholecystitis$w41$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s42$A 32-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain that started suddenly two hours ago. She has a history of gallstones and reports nausea and vomiting. On examination, her vital signs are stable, with a blood pressure of 120/80 mm Hg and a heart rate of 88 bpm. Laboratory tests reveal elevated liver enzymes (AST 150 U/L, ALT 180 U/L) and an ultrasound shows gallbladder inflammation. The right upper quadrant is tender and Murphy sign is positive. Temperature is 38.6°C and the leukocyte count is 14,000/mm³.$s42$,
  "question" = $q42$What is the most likely diagnosis?$q42$,
  "correctAnswer" = $k42$Acute cholecystitis$k42$,
  "contentHash" = 'a1f0e8a9dfa129e02ee2104ba06ec49cfa3c92189a843407aea499a3c724c272',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8pvg2501gj1ygirgss4qw7'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w42$Acute cholecystitis$w42$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s43$A 45-year-old woman presents to the emergency department with severe abdominal pain and vomiting. Her medical history includes hypertension and diabetes. On examination, her abdomen is tender, and she has a fever of 101°F (38.3°C). Laboratory results show an elevated white blood cell count of 15,000/mm³ and a serum amylase level of 250 U/L. An abdominal ultrasound reveals gallstones in the gallbladder. The right upper quadrant is tender and Murphy sign is positive.$s43$,
  "question" = $q43$What is the most likely diagnosis?$q43$,
  "correctAnswer" = $k43$Acute cholecystitis$k43$,
  "contentHash" = '9649fe7455db28b981bc8af2b3208f13a0cf358eebb5f1adcec0620d9fcd3e9a',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr98613400dr1ywywt098v88'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w43$Acute cholecystitis$w43$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s44$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. Her obstetric history is significant for one previous vaginal delivery. On examination, her cervix is 4 cm dilated, 80% effaced, and the fetal heart rate is 140 bpm with moderate variability. The patient is in active labor and requests pain management options. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s44$,
  "question" = $q44$Which study design is described?$q44$,
  "correctAnswer" = $k44$Randomized controlled trial$k44$,
  "contentHash" = 'bbd72615573f79b1b40b6e37d13b45f2cf34e5ca0e1cae7c4f5c198ca6f8585f',
  explanation = $e44$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e44$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8ie4zu029q1ylo6td87305'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w44$Randomized controlled trial$w44$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s45$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. She has no significant past medical history and is currently on prenatal vitamins. Upon examination, her cervix is 4 cm dilated and 80% effaced. Fetal heart rate monitoring shows a reassuring pattern. She expresses concern about the pain associated with labor. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s45$,
  "question" = $q45$Which study design is described?$q45$,
  "correctAnswer" = $k45$Randomized controlled trial$k45$,
  "contentHash" = '3b2a4be41269d56ab9096bf379643159f6e2cb404386208a0730fc51a14b0b73',
  explanation = $e45$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e45$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mlw9n00nu1ygi2cz41zwh'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w45$Randomized controlled trial$w45$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s46$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. She has no significant medical history and is currently on prenatal vitamins. On examination, her cervix is 4 cm dilated, 80% effaced, and the fetal heart rate is 140 bpm with moderate variability. The patient expresses concern about the labor process and asks for information about her options. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s46$,
  "question" = $q46$Which study design is described?$q46$,
  "correctAnswer" = $k46$Randomized controlled trial$k46$,
  "contentHash" = 'ed792097218bc0a301e661208dd2163f121cb85f9b49d072e4e2949f89dbf4d8',
  explanation = $e46$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e46$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8quz3801q31ygie27e66ww'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w46$Randomized controlled trial$w46$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s47$A 45-year-old woman presents to the emergency department with severe abdominal pain that started suddenly and has been worsening over the past hour. She has a history of gallstones and reports nausea and vomiting. On examination, her vital signs are BP 90/60 mm Hg, HR 120 bpm, and she has tenderness in the right upper quadrant with a positive Murphy's sign. Laboratory tests reveal elevated liver enzymes (AST 150 U/L, ALT 180 U/L) and an elevated bilirubin level (total bilirubin 3.2 mg/dL). Temperature is 38.6°C and the leukocyte count is 14,000/mm³.$s47$,
  "question" = $q47$Which of the following is the most likely diagnosis?$q47$,
  "correctAnswer" = $k47$Acute cholecystitis$k47$,
  "contentHash" = 'bc895361ed2457e0433d55a16c812f5dd1895b4c92fcd87698b085bdbb0d9ce5',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr98vmvn00ng1ywye99sy3ue'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w47$Acute cholecystitis$w47$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s48$A 32-year-old woman presents to the emergency department with a complaint of severe abdominal pain that started suddenly two hours ago. She has a history of gallstones and reports nausea and vomiting. On examination, her vital signs are stable with a blood pressure of 120/80 mm Hg, pulse 88 bpm, and she has tenderness in the right upper quadrant. An abdominal ultrasound shows gallstones and a thickened gallbladder wall. Temperature is 38.6°C and the leukocyte count is 14,000/mm³.$s48$,
  "question" = $q48$What is the most likely diagnosis?$q48$,
  "correctAnswer" = $k48$Acute cholecystitis$k48$,
  "contentHash" = '55704b3c28884c38f1371ee6b68f458a97374a57895817879e9d242f5ea2fada',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr99ri6t00yf1ywy0lxmbzx8'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w48$Acute cholecystitis$w48$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s49$A 34-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of type 1 diabetes and reports that her blood glucose levels have been consistently high over the past week. On examination, her vital signs reveal a blood pressure of 100/60 mm Hg, heart rate of 120 bpm, and she appears dehydrated. Laboratory tests show a blood glucose level of 450 mg/dL and an anion gap of 18 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s49$,
  "question" = $q49$What is the most likely diagnosis?$q49$,
  "correctAnswer" = $k49$Diabetic ketoacidosis$k49$,
  "contentHash" = '60b1cef1f4fa6fb44b25b5cdf41c279cc92c41863bbf0335a0d575be07765cec',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr99rf5p00xd1ywym4b43vye'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w49$Diabetic ketoacidosis$w49$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s50$A 72-year-old woman is admitted to the surgical unit following a hip replacement surgery. Postoperatively, she develops a fever of 101.5°F (38.6°C) on the second day. Her vital signs are stable, with a blood pressure of 120/80 mm Hg and a heart rate of 88 bpm. Laboratory tests show a white blood cell count of 12,000/mm³ with a left shift. She has no history of urinary tract infections and has been afebrile prior to surgery. The incision is erythematous and warm and is draining pus.$s50$,
  "question" = $q50$What is the most likely diagnosis?$q50$,
  "correctAnswer" = $k50$Wound infection$k50$,
  "contentHash" = '3c9fb37c685c666cee5a29cc8297fe537db4df1267b1936b70b3de2a583f8442',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8dyl7q013q1yloml93frqe'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w50$Wound infection$w50$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s51$A 65-year-old woman is admitted to the surgical ward following a hip replacement surgery. On postoperative day 6, she develops a fever of 102.5°F (39.2°C) and reports chills. Her vital signs show a blood pressure of 110/70 mm Hg, heart rate of 98 bpm, and respiratory rate of 20 breaths per minute. Laboratory tests reveal a white blood cell count of 12,000 cells/mm³ with a left shift. She has no history of infection prior to surgery. The incision is erythematous and warm and is draining pus.$s51$,
  "question" = $q51$What is the most likely diagnosis?$q51$,
  "correctAnswer" = $k51$Wound infection$k51$,
  "contentHash" = '308768e95b4da2fa6fc4196720d4d4d08283b4590505fd96bbe0d07fe2fae09d',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8f2lga01h01ylobrsiiwqo'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w51$Wound infection$w51$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s52$A 34-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of type 1 diabetes and reports that her blood glucose levels have been consistently high over the past few days. On examination, her blood pressure is 90/60 mm Hg, heart rate is 120 bpm, and she has dry mucous membranes. Laboratory tests reveal a blood glucose level of 450 mg/dL and an anion gap of 18 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s52$,
  "question" = $q52$What is the most likely diagnosis?$q52$,
  "correctAnswer" = $k52$Diabetic ketoacidosis$k52$,
  "contentHash" = '1c3c2281204fe364dd541d63362e5e8575d77d469703f4e7a6e9b78f39a35235',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmru3ugjr00i71y7wdbun1873'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w52$Diabetic ketoacidosis$w52$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s53$A 60-year-old woman with a history of type 2 diabetes presents to the clinic with increased thirst and frequent urination for the past week. She reports a weight loss of 5 pounds and has been feeling fatigued. Her vital signs are BP 130/85 mm Hg, HR 80 bpm. Laboratory tests reveal a blood glucose level of 400 mg/dL and an anion gap of 22 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s53$,
  "question" = $q53$What is the most likely diagnosis?$q53$,
  "correctAnswer" = $k53$Diabetic ketoacidosis$k53$,
  "contentHash" = 'bd43660a9eb403f658f751282f239b0ec827726afe9b7882b27058204711adca',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8br69e00am1ylo5e8qb8eg'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w53$Diabetic ketoacidosis$w53$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s54$A 10-year-old girl presents to the emergency department with a 2-day history of fever, abdominal pain, and vomiting. She has a history of recurrent urinary tract infections. On examination, her temperature is 102°F, heart rate is 110 bpm, and she has tenderness in the suprapubic area. A urinalysis shows nitrites and leukocyte esterase positive. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s54$,
  "question" = $q54$Which study design is described?$q54$,
  "correctAnswer" = $k54$Cohort study$k54$,
  "contentHash" = '76dfcd737271531821274e5cd11fa94b67ab2910404be7577b8f3cec547740ad',
  explanation = $e54$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e54$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmru8v5x4001d1y0synjrs6xx'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w54$Cohort study$w54$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s55$A 32-year-old woman presents to the emergency department two weeks after a vaginal delivery. She reports persistent heavy vaginal bleeding and passing large clots. On examination, her blood pressure is 90/60 mm Hg, heart rate is 110 bpm, and she appears pale. A CBC shows hemoglobin of 8.5 g/dL. She has no significant past medical history and is currently breastfeeding. The uterus is firm and nontender. She is afebrile. Pelvic ultrasound shows echogenic tissue in the uterine cavity.$s55$,
  "question" = $q55$What is the most likely diagnosis?$q55$,
  "correctAnswer" = $k55$Retained placental tissue$k55$,
  "contentHash" = 'de9b8c207f109fce838dfe383edbe3df26b0a67fffb85b9500e81db863e6c1d8',
  explanation = $e55$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$e55$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmru96kg300361y0sxybovjci'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w55$Uterine atony$w55$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s56$A 32-year-old woman presents to the emergency department with confusion and excessive thirst. She has a history of type 1 diabetes mellitus and has been non-compliant with her insulin regimen. Vital signs reveal a blood pressure of 110/70 mm Hg, heart rate of 120 bpm, and respiratory rate of 28 breaths per minute. Laboratory tests show a blood glucose level of 650 mg/dL and an anion gap of 18 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s56$,
  "question" = $q56$What is the most likely diagnosis?$q56$,
  "correctAnswer" = $k56$Diabetic ketoacidosis$k56$,
  "contentHash" = 'a487edaa177da33df26fab5aaeaa1a30a9c6cf4845e76857c0ddb1ff08af6c50',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmru9istm00ae1y0svwlygngd'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w56$Diabetic ketoacidosis$w56$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s57$A 68-year-old woman presents to the emergency department with confusion and agitation. She has a history of hypertension and type 2 diabetes. On examination, her blood pressure is 160/95 mm Hg, heart rate is 110 beats per minute, and she has a blood glucose level of 450 mg/dL. A urinalysis shows glucose and ketones in the urine. She is currently taking metformin and lisinopril. Her family reports that she has not been eating well for the past few days. The arterial pH is 7.15 and the serum bicarbonate is 10 mEq/L.$s57$,
  "question" = $q57$What is the most likely diagnosis?$q57$,
  "correctAnswer" = $k57$Diabetic ketoacidosis$k57$,
  "contentHash" = '808d5a6b82bca4ad11784c1d985c8f37482c905f245e6b4df954037abbee2a04',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8ji6f502mz1yloyf6k004l'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w57$Diabetic ketoacidosis$w57$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s58$Abstract — Evaluating Treatment Bias in Hypertension Trials\nSource: USMLE Step 3 Internal Medicine\nA trial evaluates a new antihypertensive drug with a double-blind, placebo-controlled design. Despite randomization, baseline characteristics show a significant difference in BMI between the treatment and control groups. Body mass index affects blood pressure, and the analysis did not adjust for the BMI imbalance.$s58$,
  "question" = $q58$Which type of bias might this introduce, and how should it be addressed?$q58$,
  "correctAnswer" = $k58$Confounding bias; use multivariable analysis.$k58$,
  "contentHash" = '8f6aada6a30df3dc3538506ed8c9e2506466c5d19a0f66958c1287ba14a25546',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmruyg6ts001f1y2yzv5cl6ka'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w58$Confounding bias; use multivariable analysis.$w58$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s59$Abstract — Bias in Observational Studies\nSource: USMLE Step 3\nA cohort study investigates the association between smoking and lung cancer in 20,000 participants, adjusting for age and gender. The study found a relative risk of 2.5 for smokers developing lung cancer compared to non-smokers. Asbestos exposure was more common among the smokers and was not included in the adjustment.$s59$,
  "question" = $q59$What type of bias is most concerning in this study?$q59$,
  "correctAnswer" = $k59$Confounding bias$k59$,
  "contentHash" = 'bda7bd15a7f3ee0ea8758399c3c2fe476c5d9b0c57d4021318e1b9321f203a7f',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmruyfher000y1y2yglne8u0f'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w59$Confounding bias$w59$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s60$A 65-year-old woman is admitted to the surgical ward following a total knee arthroplasty. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), tachycardia with a heart rate of 110 beats per minute, and her blood pressure is 110/70 mm Hg. Laboratory tests reveal a white blood cell count of 14,000/mm³ with a left shift. She has a history of hypertension and diabetes mellitus but is otherwise healthy. The incision is erythematous and warm and is draining pus.$s60$,
  "question" = $q60$What is the most likely diagnosis?$q60$,
  "correctAnswer" = $k60$Wound infection$k60$,
  "contentHash" = '43cafdd75bf5f8705350c30257c1770133de23d7b89fad2518bbc6f9ab886653',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8cnc5s00of1ylof7nldggx'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w60$Wound infection$w60$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s61$A 55-year-old woman with a history of breast cancer presents for follow-up after completing chemotherapy. She reports fatigue and difficulty sleeping. A physical examination reveals mild edema in her lower extremities and a blood pressure of 130/85 mm Hg. Laboratory tests show normal renal function and electrolytes. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s61$,
  "question" = $q61$Which study design is described?$q61$,
  "correctAnswer" = $k61$Cohort study$k61$,
  "contentHash" = '9232d379e916ad20914753b4a8c9f1eb8beace34d3087e3dbce16c0670b2d62f',
  explanation = $e61$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e61$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr4gbstt025n1yky9d2hh9dd'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w61$Cohort study$w61$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s62$A 32-year-old man presents to the emergency department with sudden onset of severe abdominal pain. He has a history of gallstones and has been experiencing intermittent abdominal discomfort. His vital signs are BP 110/70 mm Hg, HR 100 bpm. Physical examination reveals tenderness in the right upper quadrant and a positive Murphy's sign. An ultrasound shows gallstones and thickening of the gallbladder wall. Temperature is 38.6°C and the leukocyte count is 14,000/mm³.$s62$,
  "question" = $q62$What is the most likely diagnosis?$q62$,
  "correctAnswer" = $k62$Acute cholecystitis$k62$,
  "contentHash" = '31542bf874a65bd27e3571434247e80504c548ebb00668564dad0478ed0663ac',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8br6cd00an1ylo84notxl5'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w62$Acute cholecystitis$w62$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s63$A 65-year-old woman is admitted to the surgical ward following a hip replacement surgery. On postoperative day 6, she develops a fever of 101.5°F (38.6°C). Her vital signs are stable, with a blood pressure of 120/75 mm Hg and heart rate of 90 bpm. Laboratory tests show a white blood cell count of 12,000/mm³. She has no history of infection prior to surgery. The incision is erythematous and warm and is draining pus.$s63$,
  "question" = $q63$What is the most likely diagnosis?$q63$,
  "correctAnswer" = $k63$Surgical site infection$k63$,
  "contentHash" = 'be1c716c144036bcb3c800d241494b12b25193efa5f5b00882bfbaee4f9c79df',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8cnadk00nu1ylo13fe8v69'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w63$Surgical site infection$w63$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s64$A 62-year-old woman is admitted to the surgical ward following a laparoscopic cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), tachycardia with a heart rate of 110 bpm, and her blood pressure is 120/70 mm Hg. Laboratory tests reveal a white blood cell count of 14,000/mm³. She has no history of fever prior to surgery and has been afebrile in the immediate postoperative period. The incision is erythematous and warm and is draining pus.$s64$,
  "question" = $q64$What is the most likely diagnosis?$q64$,
  "correctAnswer" = $k64$Wound infection$k64$,
  "contentHash" = '2a2bd3b49b9f69874a0009ee69c7c8ebb395b52285a12eba6a647b902580f911',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8dyp6l014t1ylow4hqrl1d'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w64$Wound infection$w64$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s65$A 65-year-old woman is admitted to the surgical ward after a laparoscopic cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), tachycardia with a heart rate of 110 beats per minute, and a blood pressure of 100/60 mmHg. Laboratory tests show a white blood cell count of 15,000/mm³. She has no history of significant comorbidities and is currently on IV fluids and pain management. The incision is erythematous and warm and is draining pus.$s65$,
  "question" = $q65$What is the most likely diagnosis?$q65$,
  "correctAnswer" = $k65$Wound infection$k65$,
  "contentHash" = 'a7439b600acfee1cde60c4e1ee482f10b56852149ef7149dc7f59be083336bd6',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8f2ofy01i11yloaeqfmfbc'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w65$Wound infection$w65$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s66$A 40-year-old man presents to the emergency department with severe chest pain that started suddenly while he was at rest. He has a history of hyperlipidemia and smoking. On examination, his blood pressure is 150/100 mm Hg, heart rate is 95 bpm, and he has a palpable thrill over the left sternal border. An EKG shows ST-segment depression in leads V5-V6. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s66$,
  "question" = $q66$Which study design is described?$q66$,
  "correctAnswer" = $k66$Cohort study$k66$,
  "contentHash" = 'f9ccbfa15668eb42c4c5fd54458100940af2943e6e367a289a81595f012e3a2a',
  explanation = $e66$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e66$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8f2mty01hh1ylolhgl0c56'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w66$Cohort study$w66$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s67$A 7-year-old boy presents to the clinic for his annual check-up. His mother reports that he has been experiencing frequent headaches and has difficulty concentrating in school. The child has a family history of migraines. His blood pressure is 110/70 mm Hg, and he has no other significant findings on examination. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s67$,
  "question" = $q67$Which study design is described?$q67$,
  "correctAnswer" = $k67$Cohort study$k67$,
  "contentHash" = '720cc74f41fa36bf226e91787713abc14b6f31480e11c776fce2ffc9033e1ab9',
  explanation = $e67$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e67$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8ki7xj003l1ygiw1w30f7m'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w67$Cohort study$w67$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s68$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. She reports a history of gestational diabetes managed with diet. On examination, her blood pressure is 120/80 mm Hg, and fetal heart rate monitoring shows a reassuring pattern. The patient expresses concern about the pain associated with labor and asks about pain management options. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s68$,
  "question" = $q68$Which study design is described?$q68$,
  "correctAnswer" = $k68$A randomized controlled trial comparing epidural anesthesia to intravenous analgesia$k68$,
  "contentHash" = '4468e6929ed01ae4c7fc654bee34952c0d3775cec99c545a44cb91f3e5a25d4e',
  explanation = $e68$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e68$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mlvpj00nn1ygi30nq6cno'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w68$A randomized controlled trial comparing epidural anesthesia to intravenous analgesia$w68$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s69$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. Her blood pressure is 120/80 mm Hg, and she has no significant past medical history. Upon examination, her cervix is 4 cm dilated and 80% effaced. She expresses a desire for an epidural for pain management during labor. The fetal heart rate is reassuring with a baseline of 140 bpm and no decelerations noted. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s69$,
  "question" = $q69$Which study design is described?$q69$,
  "correctAnswer" = $k69$Randomized controlled trial$k69$,
  "contentHash" = '9d3ad141ca22f8dc68daa291235e4c9517d5a9fa8e6a523786c2495d9e218d2d',
  explanation = $e69$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e69$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8mluej00n71ygiquwcu1t6'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w69$Randomized controlled trial$w69$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s70$A 30-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of type 1 diabetes and states that she has not taken her insulin for the past two days. On examination, her blood glucose level is 450 mg/dL, and her urine is positive for ketones. She appears dehydrated with a heart rate of 120 bpm and a blood pressure of 90/60 mmHg. The arterial pH is 7.15 and the serum bicarbonate is 10 mEq/L.$s70$,
  "question" = $q70$What is the most likely diagnosis?$q70$,
  "correctAnswer" = $k70$Diabetic ketoacidosis$k70$,
  "contentHash" = 'c5f34fd9654ff8df19e66f1ffde671c0a7e73b3fcadfe9503c776c8d491f256d',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8nmhvn00wi1ygi0wfqqzda'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w70$Diabetic ketoacidosis$w70$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s71$A 72-year-old woman is brought to the emergency department after her family noticed she has been increasingly confused and disoriented over the past few days. She has a history of hypertension and type 2 diabetes. On examination, her blood pressure is 160/95 mm Hg, heart rate is 88 bpm, and she has a blood glucose level of 320 mg/dL. A urinalysis shows glucose and ketones. The family reports she has not been eating well and has been more lethargic than usual. The arterial pH is 7.15 and the serum bicarbonate is 10 mEq/L.$s71$,
  "question" = $q71$What is the most likely diagnosis?$q71$,
  "correctAnswer" = $k71$Diabetic ketoacidosis$k71$,
  "contentHash" = '4388810b4c7ea202807e7740288a15262031fa6233321b2a13abb1e93bffa824',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8ny6c3010h1ygil7zfg53h'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w71$Diabetic ketoacidosis$w71$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s72$A 62-year-old woman is admitted to the surgical unit following a laparoscopic cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and reports increasing abdominal pain. Her vital signs are stable, with a blood pressure of 120/75 mm Hg and a heart rate of 88 beats per minute. Laboratory tests show a white blood cell count of 12,000/mm³. She has no history of infection prior to surgery. The incision is erythematous and warm and is draining pus.$s72$,
  "question" = $q72$What is the most likely diagnosis?$q72$,
  "correctAnswer" = $k72$Wound infection$k72$,
  "contentHash" = '2ae054ae0e9672e8817ea12cf43f6763d847c047d27bb245742c2c9bc2f0d8f6',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8qfnmx01md1ygiav1dudpc'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w72$Wound infection$w72$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s73$A 50-year-old woman presents to the emergency department with severe headache, blurred vision, and a blood pressure of 210/120 mm Hg. She has a history of poorly controlled hypertension and is currently on lisinopril. Fundoscopic examination reveals retinal hemorrhages. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s73$,
  "question" = $q73$Which study design is described?$q73$,
  "correctAnswer" = $k73$Cohort study$k73$,
  "contentHash" = '5256d4c59753bc79577457e25c0a19db8dbd64c3ef4ed6dd78bef92414b331e3',
  explanation = $e73$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e73$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr8q44sv01kc1ygi9f2pphnj'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w73$Cohort study$w73$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s74$A 65-year-old woman is admitted to the surgical ward following an elective cholecystectomy. On postoperative day 6, she develops a fever of 101.5°F (38.6°C), heart rate of 110 beats per minute, and blood pressure of 98/60 mm Hg. She has a history of hypertension and diabetes, and her current medications include metformin and lisinopril. Laboratory tests show a white blood cell count of 15,000/mm³ with a left shift. The incision is erythematous and warm and is draining pus.$s74$,
  "question" = $q74$What is the most likely diagnosis?$q74$,
  "correctAnswer" = $k74$Wound infection$k74$,
  "contentHash" = 'f110a5b1db4803bf90e16136327b04332664b454729cf4a36c855ee24094622c',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr97c4zu000q1ywy5xqjxjm2'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w74$Wound infection$w74$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s75$A 65-year-old woman is admitted to the surgical unit following a hip replacement surgery. On postoperative day 6, she develops a fever of 102.5°F (39.2°C), tachycardia with a heart rate of 110 bpm, and her blood pressure is 130/80 mm Hg. Laboratory tests show a WBC count of 15,000/mm³ with a left shift. She has no history of infection prior to surgery and is currently on prophylactic antibiotics. The incision is erythematous and warm and is draining pus.$s75$,
  "question" = $q75$What is the most likely diagnosis?$q75$,
  "correctAnswer" = $k75$Wound infection$k75$,
  "contentHash" = 'b09a54b187ea398a8150b5a587dd0e0c98c970c23e152ca1463a4c4faab18026',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr98vny400nt1ywy8zvn0s73'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w75$Wound infection$w75$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s76$A 60-year-old man with a history of chronic kidney disease presents to the emergency department with worsening fatigue and confusion. His laboratory results show a serum creatinine of 3.5 mg/dL, potassium of 6.2 mEq/L, and a BUN of 45 mg/dL. Investigators enroll people with this presentation and a comparison group without it, then follow both groups forward to compare who develops the later outcome.$s76$,
  "question" = $q76$Which study design is described?$q76$,
  "correctAnswer" = $k76$Cohort study$k76$,
  "contentHash" = '1d3c45de7cd541c390504621dee8175595c7a21fc7a0e140d952174f1b518603',
  explanation = $e76$Investigators enroll an exposed group and an unexposed group and follow both forward to an outcome. That design is a cohort study.$e76$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr98dlzi00hl1ywyady7dsv5'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w76$Cohort study$w76$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s77$A 34-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She has a history of type 1 diabetes and reports feeling increasingly fatigued over the past few days. On examination, her blood pressure is 90/60 mm Hg, heart rate is 120 bpm, and her blood glucose level is 450 mg/dL. An arterial blood gas shows a pH of 7.1 and a bicarbonate level of 12 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s77$,
  "question" = $q77$What is the most likely diagnosis?$q77$,
  "correctAnswer" = $k77$Diabetic ketoacidosis$k77$,
  "contentHash" = '4838f6bcb352ddbebd6b66e4bdc380d770212d7e86add31baf330e2eb2d49db0',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr97qdvk006w1ywyu4zgllhb'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w77$Diabetic ketoacidosis$w77$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s78$A 72-year-old woman is admitted to the surgical ward following a hip replacement surgery. On postoperative day 6, she develops a fever of 101.5°F (38.6°C) and reports chills. Physical examination reveals a heart rate of 110 bpm and mild tenderness over the surgical site. Laboratory tests show a white blood cell count of 12,000/mm³. The incision is erythematous and warm and is draining pus.$s78$,
  "question" = $q78$What is the most likely diagnosis?$q78$,
  "correctAnswer" = $k78$Wound infection$k78$,
  "contentHash" = '4ba2208c212aad63b2c6836df1dc597315098e0eea94d35b3198e7d176cd7a90',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr98vovk00o41ywyei7bf8ek'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w78$Wound infection$w78$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s79$A 30-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain and vomiting. She has a history of type 1 diabetes and reports that her blood glucose levels have been elevated for the past two days. On examination, she is tachycardic with a heart rate of 110 bpm, and her blood pressure is 100/60 mm Hg. Laboratory tests reveal a blood glucose level of 450 mg/dL and an anion gap of 18 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s79$,
  "question" = $q79$What is the most likely diagnosis?$q79$,
  "correctAnswer" = $k79$Diabetic ketoacidosis$k79$,
  "contentHash" = '59433521b15895967c9a289cb06b0ba6847b33edbd4594a617b70a278bf0a957',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr97z2rn00bh1ywypcol0fqa'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w79$Diabetic ketoacidosis$w79$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s80$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes and a ruptured membrane. Her vital signs are stable with a blood pressure of 120/70 mm Hg and a heart rate of 80 bpm. On examination, the fetal heart rate is 140 bpm with moderate variability. The patient has no significant medical history and is not on any medications. She is GBS negative. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s80$,
  "question" = $q80$Which study design is described?$q80$,
  "correctAnswer" = $k80$Randomized controlled trial$k80$,
  "contentHash" = '4471a651c41e5e481b918111692c162144373f5ec416f4d65617b1c7216a7026',
  explanation = $e80$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e80$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr9b2gfj01bg1ywyi0pygab7'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w80$Randomized controlled trial$w80$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s81$A 27-year-old woman presents to the emergency department with a chief complaint of severe abdominal pain and vomiting. She has a history of type 1 diabetes and reports that her blood glucose has been consistently high for the past two days. On examination, her blood pressure is 100/60 mm Hg, heart rate is 120 bpm, and she has dry mucous membranes. Laboratory tests reveal a blood glucose level of 450 mg/dL, serum bicarbonate of 12 mEq/L, and an anion gap of 18 mEq/L. Serum beta-hydroxybutyrate is elevated, and the urine ketones are large.$s81$,
  "question" = $q81$What is the most likely diagnosis?$q81$,
  "correctAnswer" = $k81$Diabetic ketoacidosis$k81$,
  "contentHash" = 'cdc10f404a6faf654841b53e13f25bd424f1d6f590e74b8f9b986200959aa2ec',
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr99rhgh00y61ywye0gjp4qj'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w81$Diabetic ketoacidosis$w81$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s82$A 32-year-old woman presents to the emergency department with heavy vaginal bleeding 10 days after a spontaneous vaginal delivery. She reports feeling lightheaded and has a blood pressure of 90/60 mm Hg and a heart rate of 115 bpm. Laboratory tests reveal a hemoglobin level of 8.5 g/dL. The patient has no significant past medical history and is currently taking prenatal vitamins. She has no known drug allergies. The uterus is firm and nontender. She is afebrile. Pelvic ultrasound shows echogenic tissue in the uterine cavity.$s82$,
  "question" = $q82$What is the most likely diagnosis?$q82$,
  "correctAnswer" = $k82$Retained placental tissue$k82$,
  "contentHash" = 'daa871477db011596e9b203d26e13e9536779e981807868045b2df867d7f9602',
  explanation = $e82$## Why this answer is correct
Heavy bleeding days after delivery, a firm nontender uterus, no fever, and echogenic tissue in the uterine cavity indicate retained placental tissue.
• **Uterine atony** causes bleeding at the time of delivery, and the uterus is boggy.
• **Endometritis** causes fever and uterine tenderness. She is afebrile and the uterus is nontender.
• A normal platelet count and no anticoagulant use make a primary **coagulation disorder** unlikely.
**In practice:** Delayed postpartum bleeding with retained tissue on ultrasound is managed by emptying the uterus, not by treating atony.
## Key takeaway
**Bleeding days to weeks after delivery with a firm uterus and intrauterine tissue is retained placental tissue.**
$e82$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmr9b2cxo01a91ywy6hrnwllf'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w82$Uterine atony$w82$;
UPDATE "QuestionBankItem" SET
  "scenario" = $s83$A 28-year-old woman presents to the labor and delivery unit at 39 weeks of gestation with regular contractions every 5 minutes. She has no significant past medical history and is currently taking prenatal vitamins. On examination, her vital signs are stable, and the fetal heart rate is 140 bpm. The cervix is 4 cm dilated and 80% effaced. The patient expresses concern about the labor process and its implications for her health and the baby's health. Investigators will assign patients in this situation at random to a treatment or to usual care and compare the outcomes.$s83$,
  "question" = $q83$Which study design is described?$q83$,
  "correctAnswer" = $k83$Randomized controlled trial$k83$,
  "contentHash" = '6b6c962d8ade99761cdcbb953bf55e73106b46433fdafe82a0c52a568041b35a',
  explanation = $e83$Patients are assigned at random to a treatment or to usual care and the outcomes are compared. That design is a randomized controlled trial.$e83$,
  manual_correction = true,
  "generationMeta" = CASE WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb WHEN jsonb_typeof("generationMeta")='object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true) ELSE "generationMeta" END,
  "updatedAt" = NOW()
WHERE id = 'cmru96k7400351y0sxsskj9zz'
  AND active = true
  AND "qaPassed" = true
  AND "fieldId" = 'usmle-step-3'
  AND COALESCE(curation_meta #>> '{itemQa,retiredReason}','') = ''
  AND COALESCE(curation_meta #>> '{itemQa,retiredAt}','') = ''
  AND "correctAnswer" = $w83$Randomized controlled trial$w83$;
COMMIT;

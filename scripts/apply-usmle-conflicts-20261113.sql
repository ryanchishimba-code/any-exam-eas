-- Hypertensive-crisis stems aligned to the 2017 ACC/AHA highlights, 2026-11-13.
-- Backup qbi_usmle_conflicts_20261113_backup (20 rows) is created first.
-- The alteplase item is not in this script: its stem already matches the opened ASA summary, and that PDF did not return HTTP 200 from this host.
-- Undo: scripts/undo-usmle-conflicts-20261113.sql
BEGIN;
CREATE TABLE qbi_usmle_conflicts_20261113_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr4djebs012b1ykyknl3xq5t','cmr8br7mg00b31ylorxxs5sqs','cmr8f2m0j01h71ylouisnoii9','cmr8g79cp01q81ylotciqpxd7','cmr8h1gq901xn1ylo7pyfc1iv','cmr8i0b1y02731yloo2gy9h2t','cmr8ji8g002no1yloys6f3q2j','cmr8qfod601mm1ygibae4ubhf','cmr98dmv200hu1ywyj0rd85ht','cmrtffj2m000a1yx2lgots2dp','cmru3n79700ei1y7wi292rg7x','cmr8lyzk100gp1ygi589f3gj9','cmrpvqbbw00131yluukg604cm','cmr4bgfgs006u1ykyvoe9k7dn','cmr4g0vnr022m1ykyhzipr2r7','cmr8dij5k00y41ylorl9njrdw','cmr8nclz000sy1ygibdstf3e1','cmrr4y98h002a1y6puwpsklsz','cmrrvztm300dn1yl8tolzjhb4','cmru9cygg007f1y0sbq674zyj'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_conflicts_20261113_backup) <> 20 THEN
    RAISE EXCEPTION 'backup row count %, expected 20', (SELECT COUNT(*) FROM qbi_usmle_conflicts_20261113_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '4a013eb820d88000d98eeaae148ecd05246062257dabac7fede492918493a24b',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr4djebs012b1ykyknl3xq5t' AND active = true AND "contentHash" = '54460353a548fcbfb490ab474822e76f9a32de678852432d7484aa76e0155db5';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '657a0e9fc5bae7a6ee474937cfaaad062b3432419ce916738d647e9672741c12',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr8br7mg00b31ylorxxs5sqs' AND active = true AND "contentHash" = 'b4e8d9dbc6cc36ff71a1d4453d65e5480eb249254566ba3154c6c4aaef781123';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '40844b6b7035e96800b92145a7063c4383b7c966effac54d698082dad5d9a610',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr8f2m0j01h71ylouisnoii9' AND active = true AND "contentHash" = 'd058490b50e46e01825bff83cbda22e1a39e88a0823911b1e9fb5dcc91f3c2d5';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = 'caffc38fdc044bc2d1535dcf0da2cecfd1a1dff028879b8ab64ed56bcdac4e82',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr8g79cp01q81ylotciqpxd7' AND active = true AND "contentHash" = '33dad194e3d68b202f6c7e19eda04010602bd0ffd9c4844e3c81c840ba00f773';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = 'e03cfc4878bc9c2a5236d00c418abb56e2a32b86296c1170e01707e626d0e039',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr8h1gq901xn1ylo7pyfc1iv' AND active = true AND "contentHash" = '82bb20663f7dc104ba66793497278b45922b184f7aaef63a7096019838552393';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '7cc83db47bc2b94897a9626fca30ae0e9d55c62463f38c89b76af9600d77545f',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr8i0b1y02731yloo2gy9h2t' AND active = true AND "contentHash" = '510b3665f8aa14a5f1c4cd9f850b8048b740fc4b44fcbeb1638de3199e08ba85';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '0a768d77a08403e0183bef8a9bd2498c92250ca23243c9e1db3c5c43a242ff48',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr8ji8g002no1yloys6f3q2j' AND active = true AND "contentHash" = 'be5f74046637004d8847a5904a3a8cedb3660c5987083bd93d47f924145c3d9b';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '0222b49ea5b3e1f346a486514eedfa4e68b370a6c0e600eca9cfe0e745d3e018',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr8qfod601mm1ygibae4ubhf' AND active = true AND "contentHash" = 'ea7444e165af22217c2ce1dade83141133a676243a3890d09fe9b55621e9be40';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '6b7a308fab955b200594bf33b933784440c89e81e3ff5c29a4e1f72d2a993712',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr98dmv200hu1ywyj0rd85ht' AND active = true AND "contentHash" = 'a9ea84ded15ca88a16462cd48d306e1886a20dece4e2c0ed4d8f58442b81a3e0';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '8ea54a164bdc68eab1398edf90cbe201845147670f5082a35dc96d6f4d632b27',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmrtffj2m000a1yx2lgots2dp' AND active = true AND "contentHash" = 'de6eb38edb0a3f504817b6e70ffeac23bf5f7102bcf19e93ae6c447975ecadce';
UPDATE "QuestionBankItem"
SET scenario = replace(scenario, '180/110', '210/128'),
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = 'ae8c9c112070d366fa63ced41d8f9112c44b7c37efdc4a50992e9dbd7f9cf769',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmru3n79700ei1y7wi292rg7x' AND active = true AND "contentHash" = '6bc904820f83b64e3071c901758816eb0ac0a0a42d0966b0df9ded2202b2cca3';
UPDATE "QuestionBankItem"
SET scenario = $s0$A 50-year-old female with a history of hypertension and obesity presents with sudden onset of severe headache, nausea, and visual disturbances. On examination, her blood pressure is 210/128 mm Hg, and she has a fundoscopic examination showing retinal hemorrhages and papilledema.$s0$,
    explanation = replace(replace(explanation, '180/110', '210/128'), 'grade 2 fundoscopic examination', 'fundoscopic examination showing retinal hemorrhages and papilledema'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '6fd3c44e647d3efea53d2992cf08b0fd39996ffce7b6d1857099bf2c017faa5e',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmr8lyzk100gp1ygi589f3gj9' AND active = true AND "contentHash" = '116c043ecaa5119c5af85e9cd62b92f5c98909234751ddc6584d9e226a0f64c3';
UPDATE "QuestionBankItem"
SET scenario = $s1$A 55-year-old woman presents to the emergency department with severe headache, visual changes, and hypertension. She has a history of chronic kidney disease and is currently on antihypertensive medication. On examination, her blood pressure is 210/128 mm Hg. A CT scan of the head shows no acute intracranial hemorrhage. Fundoscopic examination shows bilateral retinal hemorrhages.$s1$,
    explanation = replace(explanation, '180/110', '210/128'),
    "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb,
    "contentHash" = '8884c8df7da4ba4a4b54d2c50bc3ad9b2192cd91be2f9c2442ffc224f5ed3b90',
    manual_correction = true,
    "generationMeta" = CASE
      WHEN "generationMeta" IS NULL THEN '{"manualCorrection": true}'::jsonb
      WHEN jsonb_typeof("generationMeta") = 'object' THEN jsonb_set("generationMeta", '{manualCorrection}', 'true'::jsonb, true)
      ELSE "generationMeta"
    END,
    "updatedAt" = NOW()
WHERE id = 'cmrpvqbbw00131yluukg604cm' AND active = true AND "contentHash" = '75b33f0a29eefd707cad4af16ed061cf54e9ace84231c10202d47e76ebeed84b';
UPDATE "QuestionBankItem"
SET "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb
WHERE id = 'cmr4bgfgs006u1ykyvoe9k7dn' AND active = true;
UPDATE "QuestionBankItem"
SET "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb
WHERE id = 'cmr4g0vnr022m1ykyhzipr2r7' AND active = true;
UPDATE "QuestionBankItem"
SET "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb
WHERE id = 'cmr8dij5k00y41ylorl9njrdw' AND active = true;
UPDATE "QuestionBankItem"
SET "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb
WHERE id = 'cmr8nclz000sy1ygibdstf3e1' AND active = true;
UPDATE "QuestionBankItem"
SET "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb
WHERE id = 'cmrr4y98h002a1y6puwpsklsz' AND active = true;
UPDATE "QuestionBankItem"
SET "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb
WHERE id = 'cmrrvztm300dn1yl8tolzjhb4' AND active = true;
UPDATE "QuestionBankItem"
SET "references" = $refs$[{"label": "AHA highlights of the 2017 ACC/AHA high blood pressure guideline, Table 2 (section 11.2). A hypertensive emergency is a systolic pressure above 180 mm Hg and/or a diastolic pressure above 120 mm Hg with new or worsening target-organ damage. The same pressures without that damage are a hypertensive urgency.", "url": "https://www.fmda.org/assets/docs/journal-club/Highlights-from-the-2017-Guideline.pdf"}]$refs$::jsonb
WHERE id = 'cmru9cygg007f1y0sbq674zyj' AND active = true;
COMMIT;

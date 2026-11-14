-- Citation batch s3k, 2026-11-14. COPD bronchodilators, anaphylaxis, appendectomy,
-- ischaemic stroke treatment, alcoholic hepatitis, and chest radiography for pneumonia.
-- Backup qbi_usmle_refs_s3k_20261114_backup (42 rows). Only references are updated.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3k-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3k_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr4dquft015g1ykytbx1nbzq',
    'cmr9861hg00dw1ywykko3rwf9',
    'cmr97c6zh001a1ywyiy67xtmk',
    'cmr8hrt7102401ylo6tkyadkr',
    'cmr8ei0d501an1ylox4yer4uv',
    'cmru3gcs400as1y7wxqfqshmi',
    'cmr8ny5v2010b1ygiuy1pxn5b',
    'cmr8i0db7027v1ylobbssyvpq',
    'cmr8lz0mx00gz1ygi6oii8z20',
    'cmr8br5oo00af1ylodt8rtv1k',
    'cmr9c9qjp01ro1ywywilv67r7',
    'cmr8c3n3o00ha1ylornci1gzo',
    'cmr4bvd0q00dr1ykyzupw8ukc',
    'cmr4d3uqz00uu1ykynr0j5dgc',
    'cmr4ftdwl01yl1yky5g32rd5w',
    'cmr8pvi9w01h51ygifuxnkn4o',
    'cmr8atvcg000n1ylomnsoeoep',
    'cmr8dqcpp01111ylosqqcw2kl',
    'cmr8esmzv01dl1ylofua4whzg',
    'cmru32k5v003g1y7wkmvesvwe',
    'cmru32nmp004n1y7wsdipfmz9',
    'cmru391w600761y7w9ygagb9e',
    'cmrvwrwru002n1ye85gpnn714',
    'cmrvwvpd2004q1ye8t3n7f0b9',
    'cmru8586q004p1yd6u29vhybi',
    'cmru8bfpk007k1yd6qt12f8of',
    'cmr8ji7pk02nf1ylouszrxitv',
    'cmr8bhkhu007y1ylo2244cpu1',
    'cmr8h1d2a01wn1ylons7y2yqg',
    'cmr8ny6ni010l1ygip398ndgh',
    'cmr8dii3900xr1ylo0y8n0fcm',
    'cmr8ehz8w01a91ylo0ftj0gae',
    'cmr8bhh2q006z1ylojtnnd7li',
    'cmr8pvgr801gq1ygipbsl508f',
    'cmr97yy1900a51ywy53kqr1mk',
    'cmr97qe2f006y1ywyi3wwugp3',
    'cmr9bv0ik01kt1ywy163z1hhp',
    'cmru8hyaw00ao1yd6ig1prjqq',
    'cmru7tmit00191yd6r6w8vbcu',
    'cmruykk5g003y1y2ysdf1qbjn',
    'cmru9cz1w007k1y0sq1o4gmd0',
    'cmrwa0ymr00131ynh2ck7dzte'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3k_20261114_backup;
  IF n <> 42 THEN RAISE EXCEPTION 'backup %, expected 42', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3k_0$[{"label": "Merck Manual Professional. Anaphylaxis. It presents with urticaria, dyspnea, wheezing, and hypotension. Treatment is with epinephrine.", "url": "https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis"}]$s3k_0$::jsonb
WHERE id = 'cmr4dquft015g1ykytbx1nbzq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_1$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_1$::jsonb
WHERE id = 'cmr9861hg00dw1ywykko3rwf9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_2$[{"label": "Merck Manual Professional. Anaphylaxis. It presents with urticaria, dyspnea, wheezing, and hypotension. Treatment is with epinephrine.", "url": "https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis"}]$s3k_2$::jsonb
WHERE id = 'cmr97c6zh001a1ywyiy67xtmk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_3$[{"label": "Merck Manual Professional. Anaphylaxis. It presents with urticaria, dyspnea, wheezing, and hypotension. Treatment is with epinephrine.", "url": "https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis"}]$s3k_3$::jsonb
WHERE id = 'cmr8hrt7102401ylo6tkyadkr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_4$[{"label": "NICE NG128. Thrombolysis is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3k_4$::jsonb
WHERE id = 'cmr8ei0d501an1ylox4yer4uv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_5$[{"label": "Merck Manual Professional. Alcohol-related liver disease. When the disease is suspected, aminotransferases are only moderately raised and the AST to ALT ratio is at least 2.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$s3k_5$::jsonb
WHERE id = 'cmru3gcs400as1y7wxqfqshmi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_6$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_6$::jsonb
WHERE id = 'cmr8ny5v2010b1ygiuy1pxn5b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_7$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_7$::jsonb
WHERE id = 'cmr8i0db7027v1ylobbssyvpq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_8$[{"label": "Merck Manual Professional. Alcohol-related liver disease. When the disease is suspected, aminotransferases are only moderately raised and the AST to ALT ratio is at least 2.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$s3k_8$::jsonb
WHERE id = 'cmr8lz0mx00gz1ygi6oii8z20' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_9$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_9$::jsonb
WHERE id = 'cmr8br5oo00af1ylodt8rtv1k' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_10$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_10$::jsonb
WHERE id = 'cmr9c9qjp01ro1ywywilv67r7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_11$[{"label": "Merck Manual Professional. Alcohol-related liver disease. When the disease is suspected, aminotransferases are only moderately raised and the AST to ALT ratio is at least 2.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$s3k_11$::jsonb
WHERE id = 'cmr8c3n3o00ha1ylornci1gzo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_12$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_12$::jsonb
WHERE id = 'cmr4bvd0q00dr1ykyzupw8ukc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_13$[{"label": "Merck Manual Professional. Alcohol-related liver disease. When the disease is suspected, aminotransferases are only moderately raised and the AST to ALT ratio is at least 2.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$s3k_13$::jsonb
WHERE id = 'cmr4d3uqz00uu1ykynr0j5dgc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_14$[{"label": "Merck Manual Professional. Appendicitis. Treatment is surgical removal of the appendix.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/acute-abdomen-and-surgical-gastroenterology/appendicitis"}]$s3k_14$::jsonb
WHERE id = 'cmr4ftdwl01yl1yky5g32rd5w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_15$[{"label": "Merck Manual Professional. Alcohol-related liver disease. When the disease is suspected, aminotransferases are only moderately raised and the AST to ALT ratio is at least 2.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$s3k_15$::jsonb
WHERE id = 'cmr8pvi9w01h51ygifuxnkn4o' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_16$[{"label": "Merck Manual Professional. Appendicitis. Treatment is surgical removal of the appendix.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/acute-abdomen-and-surgical-gastroenterology/appendicitis"}]$s3k_16$::jsonb
WHERE id = 'cmr8atvcg000n1ylomnsoeoep' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_17$[{"label": "Merck Manual Professional. Anaphylaxis. It presents with urticaria, dyspnea, wheezing, and hypotension. Treatment is with epinephrine.", "url": "https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis"}]$s3k_17$::jsonb
WHERE id = 'cmr8dqcpp01111ylosqqcw2kl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_18$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_18$::jsonb
WHERE id = 'cmr8esmzv01dl1ylofua4whzg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_19$[{"label": "NICE NG128. Thrombolysis is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3k_19$::jsonb
WHERE id = 'cmru32k5v003g1y7wkmvesvwe' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_20$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_20$::jsonb
WHERE id = 'cmru32nmp004n1y7wsdipfmz9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_21$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_21$::jsonb
WHERE id = 'cmru391w600761y7w9ygagb9e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_22$[{"label": "NICE NG250. Hospitals should be able to diagnose community-acquired pneumonia, including with a chest X-ray, within 4 hours of presentation.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3k_22$::jsonb
WHERE id = 'cmrvwrwru002n1ye85gpnn714' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_23$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_23$::jsonb
WHERE id = 'cmrvwvpd2004q1ye8t3n7f0b9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_24$[{"label": "Merck Manual Professional. Alcohol-related liver disease. When the disease is suspected, aminotransferases are only moderately raised and the AST to ALT ratio is at least 2.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$s3k_24$::jsonb
WHERE id = 'cmru8586q004p1yd6u29vhybi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_25$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_25$::jsonb
WHERE id = 'cmru8bfpk007k1yd6qt12f8of' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_26$[{"label": "Merck Manual Professional. Anaphylaxis. It presents with urticaria, dyspnea, wheezing, and hypotension. Treatment is with epinephrine.", "url": "https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis"}]$s3k_26$::jsonb
WHERE id = 'cmr8ji7pk02nf1ylouszrxitv' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_27$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_27$::jsonb
WHERE id = 'cmr8bhkhu007y1ylo2244cpu1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_28$[{"label": "Merck Manual Professional. Anaphylaxis. It presents with urticaria, dyspnea, wheezing, and hypotension. Treatment is with epinephrine.", "url": "https://www.merckmanuals.com/professional/immunology-allergic-disorders/allergic-autoimmune-and-other-hypersensitivity-disorders/anaphylaxis"}]$s3k_28$::jsonb
WHERE id = 'cmr8h1d2a01wn1ylons7y2yqg' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_29$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_29$::jsonb
WHERE id = 'cmr8ny6ni010l1ygip398ndgh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_30$[{"label": "Merck Manual Professional. Appendicitis. Treatment is surgical removal of the appendix.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/acute-abdomen-and-surgical-gastroenterology/appendicitis"}]$s3k_30$::jsonb
WHERE id = 'cmr8dii3900xr1ylo0y8n0fcm' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_31$[{"label": "NICE NG128. Thrombolysis is an option for acute ischaemic stroke within 4.5 hours of symptom onset when intracranial haemorrhage has been excluded.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3k_31$::jsonb
WHERE id = 'cmr8ehz8w01a91ylo0ftj0gae' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_32$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_32$::jsonb
WHERE id = 'cmr8bhh2q006z1ylojtnnd7li' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_33$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_33$::jsonb
WHERE id = 'cmr8pvgr801gq1ygipbsl508f' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_34$[{"label": "Merck Manual Professional. Ischemic stroke. Ischemic stroke is a sudden neurologic deficit from focal cerebral ischemia.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/ischemic-stroke"}]$s3k_34$::jsonb
WHERE id = 'cmr97yy1900a51ywy53kqr1mk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_35$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_35$::jsonb
WHERE id = 'cmr97qe2f006y1ywyi3wwugp3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_36$[{"label": "NICE NG128. As soon as possible, and within 24 hours, offer aspirin 300 mg to everyone with acute stroke once brain imaging has excluded intracerebral haemorrhage.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3k_36$::jsonb
WHERE id = 'cmr9bv0ik01kt1ywy163z1hhp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_37$[{"label": "Merck Manual Professional. Alcohol-related liver disease. When the disease is suspected, aminotransferases are only moderately raised and the AST to ALT ratio is at least 2.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/alcohol-related-liver-disease/alcohol-related-liver-disease"}]$s3k_37$::jsonb
WHERE id = 'cmru8hyaw00ao1yd6ig1prjqq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_38$[{"label": "NICE NG128. As soon as possible, and within 24 hours, offer aspirin 300 mg to everyone with acute stroke once brain imaging has excluded intracerebral haemorrhage.", "url": "https://www.nice.org.uk/guidance/ng128/chapter/Recommendations"}]$s3k_38$::jsonb
WHERE id = 'cmru7tmit00191yd6r6w8vbcu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_39$[{"label": "NICE NG250. Hospitals should be able to diagnose community-acquired pneumonia, including with a chest X-ray, within 4 hours of presentation.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3k_39$::jsonb
WHERE id = 'cmruykk5g003y1y2ysdf1qbjn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_40$[{"label": "GOLD 2025 pocket guide. Short-acting inhaled beta2-agonists, with or without a short-acting anticholinergic, are the initial bronchodilators for a COPD exacerbation.", "url": "https://goldcopd.org/wp-content/uploads/2024/11/Pocket-Guide-2025-v1.1-NewFormat-21Nov24_WMV.pdf"}]$s3k_40$::jsonb
WHERE id = 'cmru9cz1w007k1y0sq1o4gmd0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3k_41$[{"label": "NICE NG250. Hospitals should be able to diagnose community-acquired pneumonia, including with a chest X-ray, within 4 hours of presentation.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3k_41$::jsonb
WHERE id = 'cmrwa0ymr00131ynh2ck7dzte' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3k_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 42 THEN RAISE EXCEPTION 'cited %, expected 42', n; END IF;
END $cited$;
COMMIT;

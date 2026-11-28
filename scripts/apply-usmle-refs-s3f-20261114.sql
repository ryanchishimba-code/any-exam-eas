-- Sixth citation batch for served USMLE Step 3 items with no URL, 2026-11-14.
-- Backup qbi_usmle_refs_s3f_20261114_backup (22 rows). Only references are updated.
-- Study-design sentences were read from PMC5405751 via E-utilities efetch.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3f-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3f_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmrvwm8kv00021ye8gq11kyx2',
    'cmru857b6004e1yd6r4css1yx',
    'cmru3n7r200en1y7wrlfghyty',
    'cmr8om94t016t1ygipw3l7b4b',
    'cmr8quzn701qa1ygiy9f8q1hi',
    'cmr8ie81602ak1ylo8zabpnbo',
    'cmr9aud9l017n1ywyt9tax119',
    'cmr9buxbp01ju1ywyjgrvsruc',
    'cmru96r09004o1y0s6weegh49',
    'cmru8v2ag00041y0s98wyvecl',
    'cmru8v59v00151y0swknz9i4m',
    'cmr8f2nh601hp1ylom53i79lu',
    'cmr8hgjcj02171yloygvwnht6',
    'cmr8n3qh300q61ygi88eucxu5',
    'cmr8om9os01701ygistt5bfnd',
    'cmru96lb2003d1y0sicv3hye1',
    'cmruicf0o000c1yce117y4cbo',
    'cmruidfma000k1ycezykputa9',
    'cmruyej4q000a1y2ykodbpphq',
    'cmr8bak2q004k1ylo8tm0qdi4',
    'cmr98mmtb00ku1ywyen67ve3c',
    'cmru3ud4j00h71y7wz5ld1gji'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3f_20261114_backup;
  IF n <> 22 THEN RAISE EXCEPTION 'backup %, expected 22', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3f_0$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. An association can be produced by another difference between the groups, such as age, and that factor is a potential confounder.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_0$::jsonb
WHERE id = 'cmrvwm8kv00021ye8gq11kyx2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_1$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A cohort study follows people with and without an exposure to see who later develops the outcome, including when assigning that exposure would be unethical or impossible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_1$::jsonb
WHERE id = 'cmru857b6004e1yd6r4css1yx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_2$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A cohort study follows people with and without an exposure to see who later develops the outcome, including when assigning that exposure would be unethical or impossible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_2$::jsonb
WHERE id = 'cmru3n7r200en1y7wrlfghyty' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_3$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_3$::jsonb
WHERE id = 'cmr8om94t016t1ygipw3l7b4b' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_4$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_4$::jsonb
WHERE id = 'cmr8quzn701qa1ygiy9f8q1hi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_5$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_5$::jsonb
WHERE id = 'cmr8ie81602ak1ylo8zabpnbo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_6$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_6$::jsonb
WHERE id = 'cmr9aud9l017n1ywyt9tax119' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_7$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_7$::jsonb
WHERE id = 'cmr9buxbp01ju1ywyjgrvsruc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_8$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_8$::jsonb
WHERE id = 'cmru96r09004o1y0s6weegh49' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_9$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_9$::jsonb
WHERE id = 'cmru8v2ag00041y0s98wyvecl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_10$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_10$::jsonb
WHERE id = 'cmru8v59v00151y0swknz9i4m' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_11$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_11$::jsonb
WHERE id = 'cmr8f2nh601hp1ylom53i79lu' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_12$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_12$::jsonb
WHERE id = 'cmr8hgjcj02171yloygvwnht6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_13$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_13$::jsonb
WHERE id = 'cmr8n3qh300q61ygi88eucxu5' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_14$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_14$::jsonb
WHERE id = 'cmr8om9os01701ygistt5bfnd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_15$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A well-conducted randomised controlled trial is the highest form of evidence for assessing the effect of an intervention: one group is allocated to the intervention and the other to a control.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_15$::jsonb
WHERE id = 'cmru96lb2003d1y0sicv3hye1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_16$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. Performance bias is the way participants or their care team behave when they know whether they are in the intervention or the control group.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_16$::jsonb
WHERE id = 'cmruicf0o000c1yce117y4cbo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_17$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. An association can be produced by another difference between the groups, such as age, and that factor is a potential confounder.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_17$::jsonb
WHERE id = 'cmruidfma000k1ycezykputa9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_18$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. An association can be produced by another difference between the groups, such as age, and that factor is a potential confounder.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_18$::jsonb
WHERE id = 'cmruyej4q000a1y2ykodbpphq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_19$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A cohort study follows people with and without an exposure to see who later develops the outcome, including when assigning that exposure would be unethical or impossible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_19$::jsonb
WHERE id = 'cmr8bak2q004k1ylo8tm0qdi4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_20$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A cohort study follows people with and without an exposure to see who later develops the outcome, including when assigning that exposure would be unethical or impossible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_20$::jsonb
WHERE id = 'cmr98mmtb00ku1ywyen67ve3c' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3f_21$[{"label": "Harrison JK et al. Age Ageing. Using quality assessment tools to critically appraise ageing research. A cohort study follows people with and without an exposure to see who later develops the outcome, including when assigning that exposure would be unethical or impossible.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5405751/"}]$s3f_21$::jsonb
WHERE id = 'cmru3ud4j00h71y7wz5ld1gji' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3f_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 22 THEN RAISE EXCEPTION 'cited %, expected 22', n; END IF;
END $cited$;
COMMIT;

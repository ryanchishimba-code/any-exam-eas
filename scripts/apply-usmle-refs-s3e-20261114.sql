-- Fifth citation batch for served USMLE Step 3 items with no URL, 2026-11-14.
-- Backup qbi_usmle_refs_s3e_20261114_backup (78 rows). Only references are updated.
-- StatPearls accessions were confirmed with NCBI E-utilities. Other URLs were opened.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s3e-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s3e_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr8atv1d000k1ylowcjj9bsh',
    'cmr8ccfwq00kj1ylo8kuf4jqf',
    'cmr8qfp6g01mw1ygi1idotaev',
    'cmr9aemq2013x1ywys8lgv9uc',
    'cmru7tl98000t1yd67zk3zc61',
    'cmr8dii9e00xt1yloo7cs5bgr',
    'cmr8e5yfk017m1yloo0r8fycd',
    'cmrw9zje700001ynhb9il5zu1',
    'cmr8f2ml401he1yloj2ytfjw7',
    'cmr8h1g4t01xh1ylomh7wihiw',
    'cmr8cn9g100nj1yloli7t06l0',
    'cmqxeg8r100gp1yma6029g9k2',
    'cmr8gr7mn01ue1ylob3vb7ft2',
    'cmr98vply00od1ywywzenxq5n',
    'cmr9860az00dh1ywyyvw0ts0a',
    'cmr9c379301nz1ywy73l92x94',
    'cmr8gr8gx01un1yloq5r2ceab',
    'cmtpx6cui000e1ymu69as94ha',
    'cmr8isdgp02dq1yloxunl66m1',
    'cmru2q7f700071y7w9hmxyqio',
    'cmru2q9b4000t1y7wgq17dlcy',
    'cmru2qa2400121y7w23hmz64h',
    'cmr8d1vde00qi1ylo86qu55ab',
    'cmr8om8wd016q1ygiiqnu9eti',
    'cmr9b2e8o01ap1ywywhbmbdxn',
    'cmr8c3p7900hv1yloyzp4hmsz',
    'cmr8jujiw000s1ygi8gv3d4sp',
    'cmru3uems00hn1y7wf1k7628y',
    'cmr9aucpe017g1ywy495ok0zp',
    'cmtpx8qzd002q1ymut2bwpkbl',
    'cmr8ncnq500tg1ygiaybk62e6',
    'cmr97c6sg00181ywyj3213vly',
    'cmr996lwh00rx1ywyy5zg4hgi',
    'cmr8bxwuf00de1yloq0rzi7zw',
    'cmru856r300471yd644gsxr4h',
    'cmr8l1jbb00691ygirnotm6ws',
    'cmr8atyxm001m1ylof6hcwf83',
    'cmrvwxwqy005t1ye86gchuhut',
    'cmru32mwy004e1y7w2cjfea3p',
    'cmr8c3p3o00hu1ylowbz5j65w',
    'cmr98mmmf00ks1ywy9yj28kva',
    'cmr8ccfl400kf1ylotfqj7uo4',
    'cmr4cvfjz00sd1ykyuzxii87x',
    'cmr4bve7n00e51ykyu48h1bsk',
    'cmru855so003v1yd6dq10kit9',
    'cmru8bfzd007n1yd6d2mzpa2q',
    'cmru9cyte007i1y0sqrax38ba',
    'cmr8fz8zi01np1yloy7rsjtl3',
    'cmr8fz6sa01my1ylob1pn2c26',
    'cmr9aenay01441ywydji6jovo',
    'cmr4cbxq600la1ykyhof7obcn',
    'cmr8bhk79007v1yloprgme839',
    'cmr8g79ok01qc1yloa6e58oaq',
    'cmr8ehzyu01ai1yloeim2gqzx',
    'cmqxdzxxf00cv1ymav9x3luae',
    'cmr4cvd3100rj1ykyccvr2fu0',
    'cmr8cnaw600o01ylovh0e56yl',
    'cmr8dqbt4010s1yloajl12brh',
    'cmr8cnbwt00oc1yloa0a85djr',
    'cmr8gr8qz01uq1ylonyfhyxmw',
    'cmr8hrqma02341ylo7zuar89k',
    'cmr8j0mv402gk1ylo49d0vmvk',
    'cmr8m9fmj00kx1ygiykh0kkub',
    'cmr8m9cee00ke1ygi7k1maa80',
    'cmr8om920016s1ygi01bau7es',
    'cmr8p25h2019b1ygin7hm17zf',
    'cmr8qfp0k01mu1ygibap5rf4e',
    'cmr8q41vb01jb1ygi22dulrho',
    'cmr97i3jw004u1ywyil8ik9ec',
    'cmr97hyia003f1ywyrnhggfan',
    'cmr98vn1f00ni1ywypme4r6ek',
    'cmr9c38sc01oi1ywyl3j667mr',
    'cmr9c9n2c01qq1ywycr9cakq1',
    'cmru9cy3l007c1y0s93fh2yot',
    'cmru9itjj00ak1y0si5gzasf3',
    'cmrwa3sn5002v1ynhj8b9qgjt',
    'cmtpxgsim007e1ymu2eq0o727',
    'cmtpxc4gz004j1ymu09umq189'
) AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $check$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM qbi_usmle_refs_s3e_20261114_backup;
  IF n <> 78 THEN RAISE EXCEPTION 'backup %, expected 78', n; END IF;
END $check$;
UPDATE "QuestionBankItem"
SET "references" = $s3e_0$[{"label": "NICE NG125. Cellulitis is a sign of surgical site infection, and a separated wound may be opened to drain pus.", "url": "https://www.nice.org.uk/guidance/ng125/chapter/Recommendations"}]$s3e_0$::jsonb
WHERE id = 'cmr8atv1d000k1ylowcjj9bsh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_1$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_1$::jsonb
WHERE id = 'cmr8ccfwq00kj1ylo8kuf4jqf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_2$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_2$::jsonb
WHERE id = 'cmr8qfp6g01mw1ygi1idotaev' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_3$[{"label": "StatPearls. Serotonin Syndrome. NCBI Bookshelf NBK482377. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482377/"}]$s3e_3$::jsonb
WHERE id = 'cmr9aemq2013x1ywys8lgv9uc' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_4$[{"label": "NICE NG250. Diagnosis of community-acquired pneumonia includes the chest radiograph.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3e_4$::jsonb
WHERE id = 'cmru7tl98000t1yd67zk3zc61' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_5$[{"label": "StatPearls. Type 1 Diabetes. NCBI Bookshelf NBK507713. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK507713/"}]$s3e_5$::jsonb
WHERE id = 'cmr8dii9e00xt1yloo7cs5bgr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_6$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_6$::jsonb
WHERE id = 'cmr8e5yfk017m1yloo0r8fycd' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_7$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3e_7$::jsonb
WHERE id = 'cmrw9zje700001ynhb9il5zu1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_8$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_8$::jsonb
WHERE id = 'cmr8f2ml401he1yloj2ytfjw7' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_9$[{"label": "NICE NG125. Cellulitis is a sign of surgical site infection, and a separated wound may be opened to drain pus.", "url": "https://www.nice.org.uk/guidance/ng125/chapter/Recommendations"}]$s3e_9$::jsonb
WHERE id = 'cmr8h1g4t01xh1ylomh7wihiw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_10$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_10$::jsonb
WHERE id = 'cmr8cn9g100nj1yloli7t06l0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_11$[{"label": "StatPearls. Hyperkalemia. NCBI Bookshelf NBK470284. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470284/"}]$s3e_11$::jsonb
WHERE id = 'cmqxeg8r100gp1yma6029g9k2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_12$[{"label": "StatPearls. Serotonin Syndrome. NCBI Bookshelf NBK482377. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482377/"}]$s3e_12$::jsonb
WHERE id = 'cmr8gr7mn01ue1ylob3vb7ft2' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_13$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_13$::jsonb
WHERE id = 'cmr98vply00od1ywywzenxq5n' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_14$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_14$::jsonb
WHERE id = 'cmr9860az00dh1ywyyvw0ts0a' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_15$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_15$::jsonb
WHERE id = 'cmr9c379301nz1ywy73l92x94' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_16$[{"label": "StatPearls. Bipolar Disorder. NCBI Bookshelf NBK558998. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK558998/"}]$s3e_16$::jsonb
WHERE id = 'cmr8gr8gx01un1yloq5r2ceab' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_17$[{"label": "StatPearls. Gout. NCBI Bookshelf NBK546606. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK546606/"}]$s3e_17$::jsonb
WHERE id = 'cmtpx6cui000e1ymu69as94ha' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_18$[{"label": "StatPearls. Serotonin Syndrome. NCBI Bookshelf NBK482377. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482377/"}]$s3e_18$::jsonb
WHERE id = 'cmr8isdgp02dq1yloxunl66m1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_19$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_19$::jsonb
WHERE id = 'cmru2q7f700071y7w9hmxyqio' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_20$[{"label": "NICE NG250. Diagnosis of community-acquired pneumonia includes the chest radiograph.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3e_20$::jsonb
WHERE id = 'cmru2q9b4000t1y7wgq17dlcy' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_21$[{"label": "NICE NG250. Diagnosis of community-acquired pneumonia includes the chest radiograph.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3e_21$::jsonb
WHERE id = 'cmru2qa2400121y7w23hmz64h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_22$[{"label": "StatPearls. Measles. NCBI Bookshelf NBK448068. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK448068/"}]$s3e_22$::jsonb
WHERE id = 'cmr8d1vde00qi1ylo86qu55ab' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_23$[{"label": "Merck Manual Professional. Postpartum hemorrhage. Uterine atony is a soft, boggy uterus and is the main cause of postpartum hemorrhage.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-and-complications-of-labor-and-delivery/postpartum-hemorrhage"}]$s3e_23$::jsonb
WHERE id = 'cmr8om8wd016q1ygiiqnu9eti' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_24$[{"label": "StatPearls. Iron Deficiency and Microcytic Hypochromic Anemia. NCBI Bookshelf NBK560876. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK560876/"}]$s3e_24$::jsonb
WHERE id = 'cmr9b2e8o01ap1ywywhbmbdxn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_25$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_25$::jsonb
WHERE id = 'cmr8c3p7900hv1yloyzp4hmsz' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_26$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_26$::jsonb
WHERE id = 'cmr8jujiw000s1ygi8gv3d4sp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_27$[{"label": "StatPearls. Acute Pancreatitis. NCBI Bookshelf NBK482468. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482468/"}]$s3e_27$::jsonb
WHERE id = 'cmru3uems00hn1y7wf1k7628y' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_28$[{"label": "StatPearls. Viral Pneumonia. NCBI Bookshelf NBK513286. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK513286/"}]$s3e_28$::jsonb
WHERE id = 'cmr9aucpe017g1ywy495ok0zp' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_29$[{"label": "NICE NG125. Cellulitis is a sign of surgical site infection, and a separated wound may be opened to drain pus.", "url": "https://www.nice.org.uk/guidance/ng125/chapter/Recommendations"}]$s3e_29$::jsonb
WHERE id = 'cmtpx8qzd002q1ymut2bwpkbl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_30$[{"label": "StatPearls. Wernicke-Korsakoff Syndrome. NCBI Bookshelf NBK470344. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470344/"}]$s3e_30$::jsonb
WHERE id = 'cmr8ncnq500tg1ygiaybk62e6' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_31$[{"label": "StatPearls. Acute Pancreatitis. NCBI Bookshelf NBK482468. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482468/"}]$s3e_31$::jsonb
WHERE id = 'cmr97c6sg00181ywyj3213vly' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_32$[{"label": "StatPearls. Bipolar Disorder. NCBI Bookshelf NBK558998. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK558998/"}]$s3e_32$::jsonb
WHERE id = 'cmr996lwh00rx1ywyy5zg4hgi' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_33$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_33$::jsonb
WHERE id = 'cmr8bxwuf00de1yloq0rzi7zw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_34$[{"label": "StatPearls. Wernicke-Korsakoff Syndrome. NCBI Bookshelf NBK470344. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470344/"}]$s3e_34$::jsonb
WHERE id = 'cmru856r300471yd644gsxr4h' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_35$[{"label": "StatPearls. Major Depressive Disorder. NCBI Bookshelf NBK559078. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK559078/"}]$s3e_35$::jsonb
WHERE id = 'cmr8l1jbb00691ygirnotm6ws' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_36$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_36$::jsonb
WHERE id = 'cmr8atyxm001m1ylof6hcwf83' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_37$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3e_37$::jsonb
WHERE id = 'cmrvwxwqy005t1ye86gchuhut' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_38$[{"label": "StatPearls. Serotonin Syndrome. NCBI Bookshelf NBK482377. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482377/"}]$s3e_38$::jsonb
WHERE id = 'cmru32mwy004e1y7w2cjfea3p' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_39$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_39$::jsonb
WHERE id = 'cmr8c3p3o00hu1ylowbz5j65w' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_40$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_40$::jsonb
WHERE id = 'cmr98mmmf00ks1ywy9yj28kva' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_41$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_41$::jsonb
WHERE id = 'cmr8ccfl400kf1ylotfqj7uo4' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_42$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_42$::jsonb
WHERE id = 'cmr4cvfjz00sd1ykyuzxii87x' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_43$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_43$::jsonb
WHERE id = 'cmr4bve7n00e51ykyu48h1bsk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_44$[{"label": "StatPearls. Hypoglycemia. NCBI Bookshelf NBK534841. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK534841/"}]$s3e_44$::jsonb
WHERE id = 'cmru855so003v1yd6dq10kit9' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_45$[{"label": "StatPearls. Hypercortisolism (Cushing Syndrome). NCBI Bookshelf NBK551526. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK551526/"}]$s3e_45$::jsonb
WHERE id = 'cmru8bfzd007n1yd6d2mzpa2q' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_46$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_46$::jsonb
WHERE id = 'cmru9cyte007i1y0sqrax38ba' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_47$[{"label": "StatPearls. Hypoglycemia. NCBI Bookshelf NBK534841. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK534841/"}]$s3e_47$::jsonb
WHERE id = 'cmr8fz8zi01np1yloy7rsjtl3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_48$[{"label": "StatPearls. Ischemic Stroke. NCBI Bookshelf NBK499997. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499997/"}]$s3e_48$::jsonb
WHERE id = 'cmr8fz6sa01my1ylob1pn2c26' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_49$[{"label": "StatPearls. Bipolar Disorder. NCBI Bookshelf NBK558998. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK558998/"}]$s3e_49$::jsonb
WHERE id = 'cmr9aenay01441ywydji6jovo' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_50$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_50$::jsonb
WHERE id = 'cmr4cbxq600la1ykyhof7obcn' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_51$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_51$::jsonb
WHERE id = 'cmr8bhk79007v1yloprgme839' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_52$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_52$::jsonb
WHERE id = 'cmr8g79ok01qc1yloa6e58oaq' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_53$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_53$::jsonb
WHERE id = 'cmr8ehzyu01ai1yloeim2gqzx' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_54$[{"label": "StatPearls. Hyperkalemia. NCBI Bookshelf NBK470284. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470284/"}]$s3e_54$::jsonb
WHERE id = 'cmqxdzxxf00cv1ymav9x3luae' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_55$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_55$::jsonb
WHERE id = 'cmr4cvd3100rj1ykyccvr2fu0' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_56$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_56$::jsonb
WHERE id = 'cmr8cnaw600o01ylovh0e56yl' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_57$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_57$::jsonb
WHERE id = 'cmr8dqbt4010s1yloajl12brh' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_58$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_58$::jsonb
WHERE id = 'cmr8cnbwt00oc1yloa0a85djr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_59$[{"label": "StatPearls. Bipolar Disorder. NCBI Bookshelf NBK558998. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK558998/"}]$s3e_59$::jsonb
WHERE id = 'cmr8gr8qz01uq1ylonyfhyxmw' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_60$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_60$::jsonb
WHERE id = 'cmr8hrqma02341ylo7zuar89k' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_61$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_61$::jsonb
WHERE id = 'cmr8j0mv402gk1ylo49d0vmvk' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_62$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_62$::jsonb
WHERE id = 'cmr8m9fmj00kx1ygiykh0kkub' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_63$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_63$::jsonb
WHERE id = 'cmr8m9cee00ke1ygi7k1maa80' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_64$[{"label": "StatPearls. Iron Deficiency and Microcytic Hypochromic Anemia. NCBI Bookshelf NBK560876. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK560876/"}]$s3e_64$::jsonb
WHERE id = 'cmr8om920016s1ygi01bau7es' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_65$[{"label": "StatPearls. Serotonin Syndrome. NCBI Bookshelf NBK482377. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482377/"}]$s3e_65$::jsonb
WHERE id = 'cmr8p25h2019b1ygin7hm17zf' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_66$[{"label": "StatPearls. Atelectasis. NCBI Bookshelf NBK545316. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK545316/"}]$s3e_66$::jsonb
WHERE id = 'cmr8qfp0k01mu1ygibap5rf4e' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_67$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_67$::jsonb
WHERE id = 'cmr8q41vb01jb1ygi22dulrho' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_68$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_68$::jsonb
WHERE id = 'cmr97i3jw004u1ywyil8ik9ec' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_69$[{"label": "StatPearls. Septic Arthritis. NCBI Bookshelf NBK538176. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK538176/"}]$s3e_69$::jsonb
WHERE id = 'cmr97hyia003f1ywyrnhggfan' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_70$[{"label": "StatPearls. Ischemic Stroke. NCBI Bookshelf NBK499997. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499997/"}]$s3e_70$::jsonb
WHERE id = 'cmr98vn1f00ni1ywypme4r6ek' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_71$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_71$::jsonb
WHERE id = 'cmr9c38sc01oi1ywyl3j667mr' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_72$[{"label": "NICE NG250. Diagnosis of community-acquired pneumonia includes the chest radiograph.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations"}]$s3e_72$::jsonb
WHERE id = 'cmr9c9n2c01qq1ywycr9cakq1' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_73$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_73$::jsonb
WHERE id = 'cmru9cy3l007c1y0s93fh2yot' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_74$[{"label": "Merck Manual Professional. Acute heart failure. Dyspnea and fatigue come from increased pulmonary venous pressure, with or without pulmonary edema.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$s3e_74$::jsonb
WHERE id = 'cmru9itjj00ak1y0si5gzasf3' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_75$[{"label": "O'Driscoll BR et al. BTS guideline for oxygen use in adults. For acutely ill patients not at risk of hypercapnic respiratory failure, the target saturation is 94-98%.", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5531304/"}]$s3e_75$::jsonb
WHERE id = 'cmrwa3sn5002v1ynhj8b9qgjt' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_76$[{"label": "NICE CG100. For acute alcohol withdrawal, consider offering a benzodiazepine.", "url": "https://www.nice.org.uk/guidance/cg100/chapter/Recommendations"}]$s3e_76$::jsonb
WHERE id = 'cmtpxgsim007e1ymu2eq0o727' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
UPDATE "QuestionBankItem"
SET "references" = $s3e_77$[{"label": "StatPearls. Ischemic Stroke. NCBI Bookshelf NBK499997. Chapter identity confirmed with NCBI E-utilities (esearch and esummary, database books).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499997/"}]$s3e_77$::jsonb
WHERE id = 'cmtpxc4gz004j1ymu09umq189' AND "fieldId" = 'usmle-step-3' AND active = true AND "qaPassed" = true AND ("references" IS NULL OR "references"::text !~ 'https?://');
DO $cited$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s3e_20261114_backup b ON b.id=q.id
  WHERE q."references"::text ~ 'https?://';
  IF n <> 78 THEN RAISE EXCEPTION 'cited %, expected 78', n; END IF;
END $cited$;
COMMIT;

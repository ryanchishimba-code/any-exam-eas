-- Checked citations for served USMLE Step 1 and Step 2 items that were null or outline-only, batch 2.
-- Backup qbi_usmle_refs_s12b2_20261114_backup (63 rows) is created first.
-- Only the references column is updated.
-- Undo: scripts/undo-usmle-refs-s12b2-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s12b2_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'b1x156c8d51d35c73b60daea0f9',
    'b1x84318be4322e463cc3ba6680',
    'b1xd8d0d66e9cea3122327eb5ec',
    'cmqd1lqs800051ycht9mp4y6f',
    'cmqd1mytz00b81ychjx1wrhcv',
    'cmqd1n0g800bm1ychr8drjwnk',
    'cmqxcjuud003z1ymayc2tzma4',
    'cmr4kx8wh000u1y1eaa18x543',
    'cmr86y4yq006w1yw2a5e5sbj9',
    'cmr8dn23m003c1yazr39zl2l5',
    'cmr8f0kst00cz1yazqps0oss0',
    'cmra6ltpq0005ic04hv3c8g05',
    'cmra6lz020037ic049e76vs4n',
    'cmra6lz3s003cic04cz7ui4bf',
    'cmra6lzah003lic0484rq9z6s',
    'cmrpvdsb300301ync92udms85',
    'cmrpw17zl002o1yh5hqitmqxc',
    'cmrpw58h5002t1yrt01uznn4h',
    'cmrpw59ro00361yrt8z5vi5er',
    'cmrpwiwoj006u1yrtbqnlv34t',
    'cmrrbwab9000hl1042leoyvav',
    'cmrrbwafr000ll104b5zznwy4',
    'cmrrtqxy6006v1y8wzb52ypxb',
    'cmrrtqyim00711y8waapoxliw',
    'cmrru3qrh00bf1y8wk3v33j1v',
    'cmrruaj0d00dk1y8w409y3ts1',
    'cmrruam4100ds1y8wc7xs2ncm',
    'cmrrv64ne00o31y8wxo8pnjul',
    'cmrrv66j800ol1y8wu410s6it',
    'cmrrv66zo00op1y8wcpj3nt9r',
    'cmrsewaf8000j1y55lkfcgajw',
    'cmrtfrqlp000p1yx2y9memh4k',
    'cmrtfrrs400131yx26du8fdiz',
    'cmrtfrrxy00151yx2kttvtcdg',
    'cmrthhprd006y1yax687yd75r',
    'cmrtqfyq400021yx30lx6l8yc',
    'cmrtqg14h000w1yx3cqkn2tna',
    'cmru6qxqk001jl104ucmymp65',
    'cmru6qy2w001ul104y5drxip0',
    'cmrvm5yd3000sjw04dm68fjdz',
    'cmrvm5ykj000zjw04qmblgzjb',
    'cmqxdesnf00b71ymakh47svrd',
    'cmr4gwicv000v1ydezayth6yz',
    'cmr4hb2rd004e1yde9fnyvxmt',
    'cmr4hzvwr00aq1ydej0741bkr',
    'cmr4kinhj00te1ydejrwd5f4b',
    'cmr4kiodm00tp1ydeowzq1ojt',
    'cmr88s10a00th1yr95ivo8ff0',
    'cmr88s43700ub1yr9n61woi66',
    'cmr8919wr00wv1yr957gg9zkj',
    'cmr89lx1n010t1yr9rtv1rwn7',
    'cmra6lzxp0048ic04jkut074t',
    'cmra6lzza004aic0485zifyec',
    'cmrrbwb120013l1044hk2f7tr',
    'cmrsrb2j8001al404fqr5oows',
    'cmrtexhvk000b1y30op74prcf',
    'cmrtprxn9000h1yqc3gkm34pr',
    'cmrtq0spb000v1yqcocxo694w',
    'cmrtq0tq700171yqcvc0oj6p2',
    'cmru6qyy1002ql104t5vfjh1p',
    'cmrvm5z7s001pjw04h0zvamv9',
    'cmtpw0pva00341ylciqvu7w60',
    'cmtpwzzxu007f1y6hn1ogu7c4'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b2_20261114_backup) <> 63 THEN
    RAISE EXCEPTION 'backup row count %, expected 63', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b2_20261114_backup);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_refs_s12b2_20261114_backup
    WHERE "fieldId" NOT IN ('usmle-step-1','usmle-step-2')
  ) THEN
    RAISE EXCEPTION 'backup includes a row outside Step 1 and Step 2';
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $b2j0$[{"label":"Biomedicines. 2026. Emerging Artificial Intelligence Models for Estimating Breslow Thickness from Dermoscopic Images. Breslow thickness (BT) is the most powerful prognostic indicator in cutaneous melanoma, yet histopathological measurement exhibits some limitations such as interobserver variability and diagnostic delays.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12838057/"}]$b2j0$::jsonb
WHERE id = 'b1x156c8d51d35c73b60daea0f9'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j1$[{"label":"Int J Nephrol. 2026. Treatment-Line-Specific Outcomes of Obinutuzumab in Membranous Nephropathy: A Systematic Review and Meta-Analysis. Background Primary membranous nephropathy (PMN) is an autoimmune glomerulonephritis triggered by B-cell dysfunction, where rituximab achieved clinical remission in about 55%-65% of patients, while 35%-45% of patients are nonresponders.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13746314/"}]$b2j1$::jsonb
WHERE id = 'b1x84318be4322e463cc3ba6680'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j2$[{"label":"Paediatr Drugs. 2026. Fixed Dosing of Leuprolide Acetate, a GnRH Agonist, in Children with Central Precocious Puberty: A Population Pharmacokinetic Justification. Background Central precocious puberty is the early onset of puberty due to premature activation of the hypothalamic-pituitary-gonadal axis, which can reduce adult height.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13121213/"}]$b2j2$::jsonb
WHERE id = 'b1xd8d0d66e9cea3122327eb5ec'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j3$[{"label":"Cureus. 2026. Brown-Séquard Syndrome Secondary to Cervical Spinal Meningioma: A Case Report. Brown-Séquard syndrome (BSS) is an incomplete spinal cord injury classically caused by hemisection of the cord, resulting in ipsilateral upper motor neuron weakness and loss of proprioception, vibration, and fine touch, with contralateral loss of pain and temperature sensation.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13589662/"}]$b2j3$::jsonb
WHERE id = 'cmqd1lqs800051ycht9mp4y6f'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j4$[{"label":"Case Reports Hepatol. 2025. Primary Biliary Cholangitis With Incomplete Response to Conventional Therapies But Had Complete Response to Baricitinib: A Case Report. Primary biliary cholangitis is a progressive disease with complications such as liver cirrhosis and hepatocellular carcinoma, and the treatment goal is to delay its progression.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12747069/"}]$b2j4$::jsonb
WHERE id = 'cmqd1mytz00b81ychjx1wrhcv'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j5$[{"label":"Hematol Transfus Cell Ther. 2026. Trends in mortality due to aplastic anemia in the United States, 1999-2020: a center for disease control wonder analysis. Background Acquired aplastic anemia is a rare, life-threatening hematologic disorder characterized by immune-mediated bone marrow failure.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13745042/"}]$b2j5$::jsonb
WHERE id = 'cmqd1n0g800bm1ychr8drjwnk'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j6$[{"label":"Cureus. 2026. Dropped Head Syndrome As the Initial Presentation of Myasthenia Gravis Leading to Myasthenic Crisis in an Elderly Patient. Myasthenia gravis is an autoimmune disorder of the neuromuscular junction characterized by fatigable, fluctuating skeletal-muscle weakness that classically involves ocular and bulbar muscles, although atypical presentations occur.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13561530/"}]$b2j6$::jsonb
WHERE id = 'cmqxcjuud003z1ymayc2tzma4'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j7$[{"label":"J Educ Teach Emerg Med. 2026. Woman with a Blackened Tongue: A Case Report. Primary adrenal insufficiency is a rare disease characterized by deficient production of glucocorticoids with or without a deficiency of mineralocorticoids and adrenal androgens.1 This disease can present as a range of symptoms provoking a visit to the emergency department (ED).","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13152370/"}]$b2j7$::jsonb
WHERE id = 'cmr4kx8wh000u1y1eaa18x543'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j8$[{"label":"Hum Mutat. 2026. Identification of Novel Pathogenic Variants in Familial Adenomatous Polyposis Through Whole Genome Sequencing. Familial adenomatous polyposis (FAP) is an autosomal dominant colorectal cancer predisposition syndrome most commonly caused by pathogenic variants in the APC gene.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13487699/"}]$b2j8$::jsonb
WHERE id = 'cmr86y4yq006w1yw2a5e5sbj9'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j9$[{"label":"Ann Hematol. 2026. Possible CPX-351-associated drug reaction with eosinophilia and systemic symptoms/drug-induced hypersensitivity syndrome-like reaction during severe lymphopenia. Drug reaction with eosinophilia and systemic symptoms (DRESS), also known as drug-induced hypersensitivity syndrome (DIHS), is a severe delayed drug reaction characterized by skin eruption, systemic inflammation, organ involvement, and human herpesvirus 6 (HHV-6) reactivation.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13672441/"}]$b2j9$::jsonb
WHERE id = 'cmr8dn23m003c1yazr39zl2l5'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j10$[{"label":"Rev Med Virol. 2026. Multiple Sclerosis and Viruses: « Liaisons Dangereuses ». Multiple sclerosis (MS) is a complex, multifactorial neurodegenerative disease with an aetiology that is still partially elusive.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13635778/"}]$b2j10$::jsonb
WHERE id = 'cmr8f0kst00cz1yazqps0oss0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j11$[{"label":"Cureus. 2026. Brown-Séquard Syndrome Secondary to Cervical Spinal Meningioma: A Case Report. Brown-Séquard syndrome (BSS) is an incomplete spinal cord injury classically caused by hemisection of the cord, resulting in ipsilateral upper motor neuron weakness and loss of proprioception, vibration, and fine touch, with contralateral loss of pain and temperature sensation.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13589662/"}]$b2j11$::jsonb
WHERE id = 'cmra6ltpq0005ic04hv3c8g05'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j12$[{"label":"Case Reports Hepatol. 2025. Primary Biliary Cholangitis With Incomplete Response to Conventional Therapies But Had Complete Response to Baricitinib: A Case Report. Primary biliary cholangitis is a progressive disease with complications such as liver cirrhosis and hepatocellular carcinoma, and the treatment goal is to delay its progression.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12747069/"}]$b2j12$::jsonb
WHERE id = 'cmra6lz020037ic049e76vs4n'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j13$[{"label":"JIMD Rep. 2023. Development of hepatocellular adenomas in a patient with glycogen storage disease Ia treated with growth hormone therapy. Glycogen storage disease Ia (GSD Ia), also known as von Gierke disease, is caused by pathogenic variants in the G6PC1 gene (OMIM 232200) which encodes glucose-6-phosphatase.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC10494510/"}]$b2j13$::jsonb
WHERE id = 'cmra6lz3s003cic04cz7ui4bf'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j14$[{"label":"Hematol Transfus Cell Ther. 2026. Trends in mortality due to aplastic anemia in the United States, 1999-2020: a center for disease control wonder analysis. Background Acquired aplastic anemia is a rare, life-threatening hematologic disorder characterized by immune-mediated bone marrow failure.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13745042/"}]$b2j14$::jsonb
WHERE id = 'cmra6lzah003lic0484rq9z6s'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j15$[{"label":"Front Endocrinol (Lausanne). 2026. From hypercortisolism to remission: impact of Cushing's disease on eating patterns. Background Cushing's disease (CD) is characterized by chronic hypercortisolism and is associated with persistent metabolic, psychological, and neurocognitive disturbances.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12907138/"}]$b2j15$::jsonb
WHERE id = 'cmrpvdsb300301ync92udms85'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j16$[{"label":"Case Reports Hepatol. 2025. Primary Biliary Cholangitis With Incomplete Response to Conventional Therapies But Had Complete Response to Baricitinib: A Case Report. Primary biliary cholangitis is a progressive disease with complications such as liver cirrhosis and hepatocellular carcinoma, and the treatment goal is to delay its progression.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12747069/"}]$b2j16$::jsonb
WHERE id = 'cmrpw17zl002o1yh5hqitmqxc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j17$[{"label":"J Transl Med. 2026. Autoimmune hemolytic anemia in the era of immunotherapy: from pathogenesis to therapeutic strategies. Autoimmune hemolytic anemia (AIHA) is a rare hematologic disorder characterized by the accelerated destruction of red blood cells mediated by autoantibodies and is classified into warm antibody type and cold antibody type.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13741570/"}]$b2j17$::jsonb
WHERE id = 'cmrpw58h5002t1yrt01uznn4h'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j18$[{"label":"Bioinformation. 2026. Anemia of chronic disease: Evaluating iron markers and bone marrow findings. Anemia of chronic disease (ACD) is a common condition associated with chronic inflammation, characterized by disordered iron metabolism and impaired erythropoiesis.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13545947/"}]$b2j18$::jsonb
WHERE id = 'cmrpw59ro00361yrt8z5vi5er'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j19$[{"label":"Cureus. 2026. When Vomiting Becomes Neurological: A Case of Wernicke's Encephalopathy Secondary to Severe Hyperemesis Gravidarum in the Second Trimester. Wernicke's encephalopathy is an acute neurological emergency caused by thiamine deficiency and is an underrecognized complication of hyperemesis gravidarum.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13739398/"}]$b2j19$::jsonb
WHERE id = 'cmrpwiwoj006u1yrtbqnlv34t'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j20$[{"label":"JIMD Rep. 2023. Development of hepatocellular adenomas in a patient with glycogen storage disease Ia treated with growth hormone therapy. Glycogen storage disease Ia (GSD Ia), also known as von Gierke disease, is caused by pathogenic variants in the G6PC1 gene (OMIM 232200) which encodes glucose-6-phosphatase.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC10494510/"}]$b2j20$::jsonb
WHERE id = 'cmrrbwab9000hl1042leoyvav'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j21$[{"label":"Hematol Transfus Cell Ther. 2026. Trends in mortality due to aplastic anemia in the United States, 1999-2020: a center for disease control wonder analysis. Background Acquired aplastic anemia is a rare, life-threatening hematologic disorder characterized by immune-mediated bone marrow failure.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13745042/"}]$b2j21$::jsonb
WHERE id = 'cmrrbwafr000ll104b5zznwy4'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j22$[{"label":"Bioinformation. 2026. Anemia of chronic disease: Evaluating iron markers and bone marrow findings. Anemia of chronic disease (ACD) is a common condition associated with chronic inflammation, characterized by disordered iron metabolism and impaired erythropoiesis.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13545947/"}]$b2j22$::jsonb
WHERE id = 'cmrrtqxy6006v1y8wzb52ypxb'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j23$[{"label":"Clin Pract Cases Emerg Med. 2026. Ruptured Abdominal Aortic Aneurysm Identified on Point-of-Care Ultrasound. Discussion Ruptured abdominal aortic aneurysm is a catastrophic diagnosis associated with high mortality, particularly when recognition is delayed.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13517986/"}]$b2j23$::jsonb
WHERE id = 'cmrrtqyim00711y8waapoxliw'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j24$[{"label":"Front Digit Health. 2026. Data-driven subphenotyping of severe ARDS patients requiring VV-ECMO. Background Acute respiratory distress syndrome is a heterogeneous syndrome that complicates risk stratification, therapy monitoring and personalised treatment during veno-venous extracorporeal membrane oxygenation.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13375777/"}]$b2j24$::jsonb
WHERE id = 'cmrru3qrh00bf1y8wk3v33j1v'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j25$[{"label":"EJIFCC. 2025. A Case of Myelodysplastic Syndrome-Induced Acquired Sideroblastic Anemia. Sideroblastic anemia, a rare hematological malady, is characterized by ring sideroblasts in the red blood cells due to accumulation of poorly transported and underutilized iron.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12519671/"}]$b2j25$::jsonb
WHERE id = 'cmrruaj0d00dk1y8w409y3ts1'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j26$[{"label":"Cardiol Res. 2026. Prediction of Risk of Cardiovascular Events in Patients With Stable Angina Using Artificial Intelligence: A Systematic Review. Stable angina pectoris is a prevalent condition with concerning symptoms and an increased risk of myocardial infarction (MI), stroke, heart failure, and mortality.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13568752/"}]$b2j26$::jsonb
WHERE id = 'cmrruam4100ds1y8wc7xs2ncm'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j27$[{"label":"Front Digit Health. 2026. Data-driven subphenotyping of severe ARDS patients requiring VV-ECMO. Background Acute respiratory distress syndrome is a heterogeneous syndrome that complicates risk stratification, therapy monitoring and personalised treatment during veno-venous extracorporeal membrane oxygenation.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13375777/"}]$b2j27$::jsonb
WHERE id = 'cmrrv64ne00o31y8wxo8pnjul'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j28$[{"label":"Caspian J Intern Med. 2026. Late isolated renal fossa recurrence of clear cell renal cell carcinoma 15 Years post-nephrectomy: A case report and literature review. Background Clear cell renal cell carcinoma is the most common type of renal carcinoma and among them ccRCC is most common.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13690141/"}]$b2j28$::jsonb
WHERE id = 'cmrrv66j800ol1y8wu410s6it'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j29$[{"label":"Front Digit Health. 2026. Data-driven subphenotyping of severe ARDS patients requiring VV-ECMO. Background Acute respiratory distress syndrome is a heterogeneous syndrome that complicates risk stratification, therapy monitoring and personalised treatment during veno-venous extracorporeal membrane oxygenation.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13375777/"}]$b2j29$::jsonb
WHERE id = 'cmrrv66zo00op1y8wcpj3nt9r'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j30$[{"label":"Front Digit Health. 2026. Data-driven subphenotyping of severe ARDS patients requiring VV-ECMO. Background Acute respiratory distress syndrome is a heterogeneous syndrome that complicates risk stratification, therapy monitoring and personalised treatment during veno-venous extracorporeal membrane oxygenation.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13375777/"}]$b2j30$::jsonb
WHERE id = 'cmrsewaf8000j1y55lkfcgajw'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j31$[{"label":"Caspian J Intern Med. 2026. Late isolated renal fossa recurrence of clear cell renal cell carcinoma 15 Years post-nephrectomy: A case report and literature review. Background Clear cell renal cell carcinoma is the most common type of renal carcinoma and among them ccRCC is most common.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13690141/"}]$b2j31$::jsonb
WHERE id = 'cmrtfrqlp000p1yx2y9memh4k'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j32$[{"label":"Orphanet J Rare Dis. 2025. Exit interviews with caregivers of pediatric patients with classic galactosemia to explore meaningfulness of changes in the ACTION-galactosemia kids trial. Background Classic Galactosemia is a rare, autosomal recessive disease in which galactose is not metabolized properly due to severe deficiency/absence of the galactose-1-phosphate uridylyltransferase (GALT) enzyme, converting to an aberrant and toxic metabolite, galactitol.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12487238/"}]$b2j32$::jsonb
WHERE id = 'cmrtfrrs400131yx26du8fdiz'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j33$[{"label":"Cureus. 2023. Chlorpheniramine Maleate Throat Spray for the Treatment of COVID-19-Induced Acute Viral Pharyngitis: Case Series. Acute viral pharyngitis (AVP) is a common respiratory illness affecting many individuals.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC9970260/"}]$b2j33$::jsonb
WHERE id = 'cmrtfrrxy00151yx2kttvtcdg'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j34$[{"label":"Clin Pract Cases Emerg Med. 2026. Ruptured Abdominal Aortic Aneurysm Identified on Point-of-Care Ultrasound. Discussion Ruptured abdominal aortic aneurysm is a catastrophic diagnosis associated with high mortality, particularly when recognition is delayed.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13517986/"}]$b2j34$::jsonb
WHERE id = 'cmrthhprd006y1yax687yd75r'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j35$[{"label":"Ann Afr Med. 2026. A Case of Diagnostic Delay: Autoimmune Adrenalitis Mimicking Functional Gastrointestinal Disorder. Abstract Autoimmune adrenalitis is an under-recognized cause of primary adrenal insufficiency in young individuals.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13498332/"}]$b2j35$::jsonb
WHERE id = 'cmrtqfyq400021yx30lx6l8yc'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j36$[{"label":"Front Digit Health. 2026. Data-driven subphenotyping of severe ARDS patients requiring VV-ECMO. Background Acute respiratory distress syndrome is a heterogeneous syndrome that complicates risk stratification, therapy monitoring and personalised treatment during veno-venous extracorporeal membrane oxygenation.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13375777/"}]$b2j36$::jsonb
WHERE id = 'cmrtqg14h000w1yx3cqkn2tna'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j37$[{"label":"Case Reports Hepatol. 2025. Primary Biliary Cholangitis With Incomplete Response to Conventional Therapies But Had Complete Response to Baricitinib: A Case Report. Primary biliary cholangitis is a progressive disease with complications such as liver cirrhosis and hepatocellular carcinoma, and the treatment goal is to delay its progression.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12747069/"}]$b2j37$::jsonb
WHERE id = 'cmru6qxqk001jl104ucmymp65'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j38$[{"label":"Hematol Transfus Cell Ther. 2026. Trends in mortality due to aplastic anemia in the United States, 1999-2020: a center for disease control wonder analysis. Background Acquired aplastic anemia is a rare, life-threatening hematologic disorder characterized by immune-mediated bone marrow failure.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13745042/"}]$b2j38$::jsonb
WHERE id = 'cmru6qy2w001ul104y5drxip0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j39$[{"label":"Case Reports Hepatol. 2025. Primary Biliary Cholangitis With Incomplete Response to Conventional Therapies But Had Complete Response to Baricitinib: A Case Report. Primary biliary cholangitis is a progressive disease with complications such as liver cirrhosis and hepatocellular carcinoma, and the treatment goal is to delay its progression.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12747069/"}]$b2j39$::jsonb
WHERE id = 'cmrvm5yd3000sjw04dm68fjdz'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j40$[{"label":"Hematol Transfus Cell Ther. 2026. Trends in mortality due to aplastic anemia in the United States, 1999-2020: a center for disease control wonder analysis. Background Acquired aplastic anemia is a rare, life-threatening hematologic disorder characterized by immune-mediated bone marrow failure.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13745042/"}]$b2j40$::jsonb
WHERE id = 'cmrvm5ykj000zjw04qmblgzjb'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j41$[{"label":"Front Reprod Health. 2026. Metals and metal mixtures associated with the odds of uterine fibroid prevalence among African Caribbean women in the Tobago Health Study. Uterine fibroids are the most common benign smooth muscle neoplasm of the uterine wall and are a major indication for hysterectomy.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13526914/"}]$b2j41$::jsonb
WHERE id = 'cmqxdesnf00b71ymakh47svrd'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j42$[{"label":"Laryngoscope Investig Otolaryngol. 2026. Topical Ciprofloxacin for Non-Perforated Acute Otitis Media: A Randomized Controlled Trial. Objective Acute otitis media is a common pediatric infection and a leading cause of oral antibiotic prescriptions.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13693402/"}]$b2j42$::jsonb
WHERE id = 'cmr4gwicv000v1ydezayth6yz'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j43$[{"label":"J Infect Dis. 2025. Genetic Susceptibility to Acute Viral Bronchiolitis. Background Acute viral bronchiolitis is a major cause of infant hospitalizations worldwide.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12349955/"}]$b2j43$::jsonb
WHERE id = 'cmr4hb2rd004e1yde9fnyvxmt'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j44$[{"label":"Front Cell Dev Biol. 2026. Modelling Tetralogy of Fallot: insights and limitations of animal models. Tetralogy of Fallot (TOF) is the commonest cyanotic congenital heart disease, arising from antero-cephalad deviation of the outlet septum during outflow tract (OFT) morphogenesis, producing a ventricular septal defect, overriding aorta, pulmonary stenosis, and right ventricular hypertrophy.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13527204/"}]$b2j44$::jsonb
WHERE id = 'cmr4hzvwr00aq1ydej0741bkr'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j45$[{"label":"Muscles. 2026. Congenital Clubfoot as an Early Manifestation of Duchenne Muscular Dystrophy?. Background Duchenne muscular dystrophy (DMD) is the most common X-linked progressive neuromuscular disorder of childhood.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13609998/"}]$b2j45$::jsonb
WHERE id = 'cmr4kinhj00te1ydejrwd5f4b'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j46$[{"label":"Front Psychol. 2026. Eye-tracking studies on developmental language disorder: a systematic review. Developmental language disorder (DLD) is a neurodevelopmental condition characterized by persistent difficulties in language acquisition and processing.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13597889/"}]$b2j46$::jsonb
WHERE id = 'cmr4kiodm00tp1ydeowzq1ojt'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j47$[{"label":"Cardiol Res. 2026. Prediction of Risk of Cardiovascular Events in Patients With Stable Angina Using Artificial Intelligence: A Systematic Review. Stable angina pectoris is a prevalent condition with concerning symptoms and an increased risk of myocardial infarction (MI), stroke, heart failure, and mortality.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13568752/"}]$b2j47$::jsonb
WHERE id = 'cmr88s10a00th1yr95ivo8ff0'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j48$[{"label":"Bioinformation. 2026. Anemia of chronic disease: Evaluating iron markers and bone marrow findings. Anemia of chronic disease (ACD) is a common condition associated with chronic inflammation, characterized by disordered iron metabolism and impaired erythropoiesis.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13545947/"}]$b2j48$::jsonb
WHERE id = 'cmr88s43700ub1yr9n61woi66'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j49$[{"label":"Cureus. 2026. Thyroid Storm Presenting With Refractory Atrial Arrhythmia and Tachycardia-Induced Dilated Cardiomyopathy: A Case Report. Thyroid storm is a life-threatening endocrine emergency characterised by extreme hypermetabolic derangement.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13563265/"}]$b2j49$::jsonb
WHERE id = 'cmr8919wr00wv1yr957gg9zkj'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j50$[{"label":"Einstein (Sao Paulo). 2026. The utility of animal models in hiPSC-based studies of autism spectrum disorder: a systematic review. Introduction Autism spectrum disorder is a highly prevalent and heritable neurodevelopmental condition.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13682788/"}]$b2j50$::jsonb
WHERE id = 'cmr89lx1n010t1yr9rtv1rwn7'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j51$[{"label":"Medicine (Baltimore). 2026. Exploring the relationship between threatened abortion and vaginal microbiota: A retrospective study. Threatened abortion is a common complication in pregnancy.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12956233/"}]$b2j51$::jsonb
WHERE id = 'cmra6lzxp0048ic04jkut074t'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j52$[{"label":"Cardiol Res. 2026. Prediction of Risk of Cardiovascular Events in Patients With Stable Angina Using Artificial Intelligence: A Systematic Review. Stable angina pectoris is a prevalent condition with concerning symptoms and an increased risk of myocardial infarction (MI), stroke, heart failure, and mortality.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13568752/"}]$b2j52$::jsonb
WHERE id = 'cmra6lzza004aic0485zifyec'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j53$[{"label":"Medicine (Baltimore). 2026. Exploring the relationship between threatened abortion and vaginal microbiota: A retrospective study. Threatened abortion is a common complication in pregnancy.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12956233/"}]$b2j53$::jsonb
WHERE id = 'cmrrbwb120013l1044hk2f7tr'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j54$[{"label":"Medicine (Baltimore). 2026. Exploring the relationship between threatened abortion and vaginal microbiota: A retrospective study. Threatened abortion is a common complication in pregnancy.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12956233/"}]$b2j54$::jsonb
WHERE id = 'cmrsrb2j8001al404fqr5oows'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j55$[{"label":"Front Cell Dev Biol. 2026. Modelling Tetralogy of Fallot: insights and limitations of animal models. Tetralogy of Fallot (TOF) is the commonest cyanotic congenital heart disease, arising from antero-cephalad deviation of the outlet septum during outflow tract (OFT) morphogenesis, producing a ventricular septal defect, overriding aorta, pulmonary stenosis, and right ventricular hypertrophy.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13527204/"}]$b2j55$::jsonb
WHERE id = 'cmrtexhvk000b1y30op74prcf'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j56$[{"label":"Cureus. 2026. Thyroid Storm Presenting With Refractory Atrial Arrhythmia and Tachycardia-Induced Dilated Cardiomyopathy: A Case Report. Thyroid storm is a life-threatening endocrine emergency characterised by extreme hypermetabolic derangement.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13563265/"}]$b2j56$::jsonb
WHERE id = 'cmrtprxn9000h1yqc3gkm34pr'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j57$[{"label":"Cureus. 2026. Thyroid Storm Presenting With Refractory Atrial Arrhythmia and Tachycardia-Induced Dilated Cardiomyopathy: A Case Report. Thyroid storm is a life-threatening endocrine emergency characterised by extreme hypermetabolic derangement.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13563265/"}]$b2j57$::jsonb
WHERE id = 'cmrtq0spb000v1yqcocxo694w'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j58$[{"label":"Diseases. 2026. Subcapsular Pancreatic Pseudocyst of the Right Hepatic Lobe: A Rare Case Report and Literature Review. The pancreatic pseudocyst is a collection of pancreatic fluid surrounded by a non-epithelialized wall comprising granulation tissue and fibrosis, occurring in approximately 10% of patients diagnosed with acute pancreatitis and in 20-38% of those with chronic pancreatitis.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13205219/"}]$b2j58$::jsonb
WHERE id = 'cmrtq0tq700171yqcvc0oj6p2'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j59$[{"label":"Medicine (Baltimore). 2026. Exploring the relationship between threatened abortion and vaginal microbiota: A retrospective study. Threatened abortion is a common complication in pregnancy.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12956233/"}]$b2j59$::jsonb
WHERE id = 'cmru6qyy1002ql104t5vfjh1p'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j60$[{"label":"Medicine (Baltimore). 2026. Exploring the relationship between threatened abortion and vaginal microbiota: A retrospective study. Threatened abortion is a common complication in pregnancy.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12956233/"}]$b2j60$::jsonb
WHERE id = 'cmrvm5z7s001pjw04h0zvamv9'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j61$[{"label":"Cardiol Res. 2026. Prediction of Risk of Cardiovascular Events in Patients With Stable Angina Using Artificial Intelligence: A Systematic Review. Stable angina pectoris is a prevalent condition with concerning symptoms and an increased risk of myocardial infarction (MI), stroke, heart failure, and mortality.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13568752/"}]$b2j61$::jsonb
WHERE id = 'cmtpw0pva00341ylciqvu7w60'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b2j62$[{"label":"Neoplasia. 2026. RSPO1-LGR4 axis drives cervical cancer progression via activation of the EGFR/Src/ERK/AKT signaling pathway. Cervical cancer (CCa) is a leading cause of cancer-associated mortality among women globally, posing a substantial health burden, particularly in low- and middle-income countries where HPV vaccination coverage remains limited.","url":"https://pmc.ncbi.nlm.nih.gov/articles/PMC13676085/"}]$b2j62$::jsonb
WHERE id = 'cmtpwzzxu007f1y6hn1ogu7c4'
  AND "fieldId" IN ('usmle-step-1', 'usmle-step-2')
  AND active = true
  AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url', '') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
DO $verify$
DECLARE unchanged integer;
BEGIN
  SELECT COUNT(*) INTO unchanged
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s12b2_20261114_backup b ON b.id = q.id
  WHERE q."references" IS NOT DISTINCT FROM b."references";
  IF unchanged <> 0 THEN
    RAISE EXCEPTION '% rows were not updated', unchanged;
  END IF;
END
$verify$;
COMMIT;

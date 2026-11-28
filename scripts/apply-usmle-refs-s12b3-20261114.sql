-- StatPearls citations verified through NCBI E-utilities (db=books NBK id and db=pubmed abstract).
-- Bookshelf HTML was not requested. Backup qbi_usmle_refs_s12b3_20261114_backup (24 rows).
-- Only the references column is updated.
-- Undo: scripts/undo-usmle-refs-s12b3-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s12b3_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmqxcju82003r1yma0fam5idg',
    'cmr85ugjc000a1yw2vfox5h7v',
    'cmr86oaac007f1yr9ki76kie9',
    'cmr8bg2ao01091yw2m3n8y5lx',
    'cmr8ei2xl00a31yaz65elxyvz',
    'cmra6lubd000wic04exfx82r6',
    'cmra6lup0001fic04093sc6e1',
    'cmra6lz59003eic04cc9h9s44',
    'cmra6lzf5003ric045lsu60kz',
    'cmrpvq88b00071yluxeqsqg1a',
    'cmrpw5xzk006z1yluaklrl3mc',
    'cmrr4t2h1000s1y6pxcrl18rg',
    'cmrrbw5u90002l104628kqnh7',
    'cmrrbwajp000pl104hctum61z',
    'cmrsew91800011y55jloqjvbz',
    'cmrsf3ieg002p1y55iveqom1w',
    'cmrsraxtm0001l404lq5ifx70',
    'cmrsrb22f000vl404hxmqp537',
    'cmrtexhyh000c1y30m0t8lovi',
    'cmrtg0wbc001e1yx29o5t8rif',
    'cmrtqq5vc001a1yx3ljb9jzbn',
    'cmrvm5use000fjw0489tlls25',
    'cmrvm5yom0014jw0488r8i5a4',
    'cmtpvxyn1000a1ylc78dq2819'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b3_20261114_backup) <> 24 THEN
    RAISE EXCEPTION 'backup row count %, expected 24', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b3_20261114_backup);
  END IF;
  IF EXISTS (SELECT 1 FROM qbi_usmle_refs_s12b3_20261114_backup WHERE "fieldId" NOT IN ('usmle-step-1','usmle-step-2')) THEN
    RAISE EXCEPTION 'backup includes a row outside Step 1 and Step 2';
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $b3j0$[{"label":"StatPearls. Gitelman Syndrome. Gitelman syndrome (GS) is an autosomal recessive, salt-losing tubulopathy characterized by renal potassium wasting, hypokalemia, metabolic alkalosis, hypocalciuria, hypomagnesemia, and hyperreninemic hyperaldosteronism.","url":"https://www.ncbi.nlm.nih.gov/books/NBK459304/"}]$b3j0$::jsonb
WHERE id = 'cmqxcju82003r1yma0fam5idg'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j1$[{"label":"StatPearls. Ovarian Torsion. Ovarian torsion is a process that occurs when the ovary twists over the ligaments that support it in the adnexa.","url":"https://www.ncbi.nlm.nih.gov/books/NBK560675/"}]$b3j1$::jsonb
WHERE id = 'cmr85ugjc000a1yw2vfox5h7v'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j2$[{"label":"StatPearls. Panic Disorder. Panic disorder is a separate entity from panic attacks, although it is characterized by recurrent, unexpected panic attacks.","url":"https://www.ncbi.nlm.nih.gov/books/NBK430973/"}]$b3j2$::jsonb
WHERE id = 'cmr86oaac007f1yr9ki76kie9'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j3$[{"label":"StatPearls. Hyperaldosteronism. hyperaldosteronism is characterized by inappropriate autonomous hypersecretion of aldosterone by the adrenal glands, resulting in low plasma renin concentrations (PRCs; typically <1 ng/mL/h) and elevated serum aldosterone levels (usually >20 ng/dL).","url":"https://www.ncbi.nlm.nih.gov/books/NBK499983/"}]$b3j3$::jsonb
WHERE id = 'cmr8bg2ao01091yw2m3n8y5lx'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j4$[{"label":"StatPearls. Pheochromocytoma. pheochromocytoma is a rare tumor originating from chromaffin cells in the adrenal medulla.","url":"https://www.ncbi.nlm.nih.gov/books/NBK589700/"}]$b3j4$::jsonb
WHERE id = 'cmr8ei2xl00a31yaz65elxyvz'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j5$[{"label":"StatPearls. Pralidoxime. Pralidoxime is a medication used in the management and treatment of organophosphate poisoning.","url":"https://www.ncbi.nlm.nih.gov/books/NBK558908/"}]$b3j5$::jsonb
WHERE id = 'cmra6lubd000wic04exfx82r6'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j6$[{"label":"StatPearls. Internuclear Ophthalmoplegia. Internuclear ophthalmoplegia is an ocular movement disorder caused by a lesion of the medial longitudinal fasciculus.","url":"https://www.ncbi.nlm.nih.gov/books/NBK441970/"}]$b3j6$::jsonb
WHERE id = 'cmra6lup0001fic04093sc6e1'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j7$[{"label":"StatPearls. Meralgia Paresthetica. Meralgia paresthetica is a clinical condition that involves pain and dysesthesia in the anterolateral thigh associated with compression of the lateral femoral cutaneous nerve.","url":"https://www.ncbi.nlm.nih.gov/books/NBK557735/"}]$b3j7$::jsonb
WHERE id = 'cmra6lz59003eic04cc9h9s44'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j8$[{"label":"StatPearls. Minimal Change Disease. Minimal change disease (MCD) is one of the most common causes of idiopathic nephrotic syndrome in children.","url":"https://www.ncbi.nlm.nih.gov/books/NBK560639/"}]$b3j8$::jsonb
WHERE id = 'cmra6lzf5003ric045lsu60kz'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j9$[{"label":"StatPearls. Small Bowel Obstruction. Small bowel obstruction (SBO) is a common and potentially life-threatening surgical emergency that accounts for a significant proportion of hospital admissions.","url":"https://www.ncbi.nlm.nih.gov/books/NBK448079/"}]$b3j9$::jsonb
WHERE id = 'cmrpvq88b00071yluxeqsqg1a'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j10$[{"label":"StatPearls. Small Bowel Obstruction. Small bowel obstruction (SBO) is a common and potentially life-threatening surgical emergency that accounts for a significant proportion of hospital admissions.","url":"https://www.ncbi.nlm.nih.gov/books/NBK448079/"}]$b3j10$::jsonb
WHERE id = 'cmrpw5xzk006z1yluaklrl3mc'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j11$[{"label":"StatPearls. Acute Myeloid Leukemia. Acute myeloid leukemia (AML) is a rapidly progressing myeloid neoplasm characterized by the clonal expansion of immature myeloid-derived cells, known as blasts, in the peripheral blood and bone marrow.","url":"https://www.ncbi.nlm.nih.gov/books/NBK507875/"}]$b3j11$::jsonb
WHERE id = 'cmrr4t2h1000s1y6pxcrl18rg'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j12$[{"label":"StatPearls. Pralidoxime. Pralidoxime is a medication used in the management and treatment of organophosphate poisoning.","url":"https://www.ncbi.nlm.nih.gov/books/NBK558908/"}]$b3j12$::jsonb
WHERE id = 'cmrrbw5u90002l104628kqnh7'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j13$[{"label":"StatPearls. Minimal Change Disease. Minimal change disease (MCD) is one of the most common causes of idiopathic nephrotic syndrome in children.","url":"https://www.ncbi.nlm.nih.gov/books/NBK560639/"}]$b3j13$::jsonb
WHERE id = 'cmrrbwajp000pl104hctum61z'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j14$[{"label":"StatPearls. Minimal Change Disease. Minimal change disease (MCD) is one of the most common causes of idiopathic nephrotic syndrome in children.","url":"https://www.ncbi.nlm.nih.gov/books/NBK560639/"}]$b3j14$::jsonb
WHERE id = 'cmrsew91800011y55jloqjvbz'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j15$[{"label":"StatPearls. Respiratory Acidosis. Respiratory acidosis is a state in which there is usually a failure of ventilation and an accumulation of carbon dioxide.","url":"https://www.ncbi.nlm.nih.gov/books/NBK482430/"}]$b3j15$::jsonb
WHERE id = 'cmrsf3ieg002p1y55iveqom1w'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j16$[{"label":"StatPearls. Pralidoxime. Pralidoxime is a medication used in the management and treatment of organophosphate poisoning.","url":"https://www.ncbi.nlm.nih.gov/books/NBK558908/"}]$b3j16$::jsonb
WHERE id = 'cmrsraxtm0001l404lq5ifx70'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j17$[{"label":"StatPearls. Minimal Change Disease. Minimal change disease (MCD) is one of the most common causes of idiopathic nephrotic syndrome in children.","url":"https://www.ncbi.nlm.nih.gov/books/NBK560639/"}]$b3j17$::jsonb
WHERE id = 'cmrsrb22f000vl404hxmqp537'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j18$[{"label":"StatPearls. Scarlet Fever. Scarlet fever is a syndrome characterized by a blanching, erythematous, maculopapular rash often described as sandpaper-like, strawberry tongue, and exudative pharyngitis (see Image.","url":"https://www.ncbi.nlm.nih.gov/books/NBK507889/"}]$b3j18$::jsonb
WHERE id = 'cmrtexhyh000c1y30m0t8lovi'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j19$[{"label":"StatPearls. Supraventricular Tachycardia. Supraventricular tachycardia is a general term for dysrhythmias originating at or above the atrioventricular node, characterized by a narrow QRS complex (<120 ms) with a heart rate exceeding 100 bpm, typically ranging from 150 to 220 bpm.","url":"https://www.ncbi.nlm.nih.gov/books/NBK441972/"}]$b3j19$::jsonb
WHERE id = 'cmrtg0wbc001e1yx29o5t8rif'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j20$[{"label":"StatPearls. Peptic Ulcer Disease. Peptic ulcer disease (PUD) is characterized by discontinuation in the inner lining of the gastrointestinal (GI) tract because of gastric acid secretion or pepsin.","url":"https://www.ncbi.nlm.nih.gov/books/NBK534792/"}]$b3j20$::jsonb
WHERE id = 'cmrtqq5vc001a1yx3ljb9jzbn'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j21$[{"label":"StatPearls. Internuclear Ophthalmoplegia. Internuclear ophthalmoplegia is an ocular movement disorder caused by a lesion of the medial longitudinal fasciculus.","url":"https://www.ncbi.nlm.nih.gov/books/NBK441970/"}]$b3j21$::jsonb
WHERE id = 'cmrvm5use000fjw0489tlls25'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j22$[{"label":"StatPearls. Minimal Change Disease. Minimal change disease (MCD) is one of the most common causes of idiopathic nephrotic syndrome in children.","url":"https://www.ncbi.nlm.nih.gov/books/NBK560639/"}]$b3j22$::jsonb
WHERE id = 'cmrvm5yom0014jw0488r8i5a4'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b3j23$[{"label":"StatPearls. Thoracentesis. Thoracentesis is a commonly performed diagnostic and therapeutic procedure for removing fluid from the pleural space, aiding in evaluating and managing pleural effusions.","url":"https://www.ncbi.nlm.nih.gov/books/NBK441866/"}]$b3j23$::jsonb
WHERE id = 'cmtpvxyn1000a1ylc78dq2819'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR jsonb_typeof("references") IS DISTINCT FROM 'array'
    OR jsonb_array_length("references") = 0
    OR NOT EXISTS (
      SELECT 1 FROM jsonb_array_elements("references") e
      WHERE COALESCE(e->>'url','') <> ''
        AND lower(substring(e->>'url' from 'https?://([^/]+)')) NOT IN ('shop.elsevier.com', 'shop.lww.com', 'accessmedicine.mhmedical.com', 'radiopaedia.org', 'www.fmda.org', 'medconnection.ucsfbenioffchildrens.org', 'kansaspqc.kdhe.ks.gov', 'www.ccjm.org', 'www.aapd.org')
    )
  );
DO $verify$
DECLARE unchanged integer;
BEGIN
  SELECT COUNT(*) INTO unchanged FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s12b3_20261114_backup b ON b.id=q.id
  WHERE q."references" IS NOT DISTINCT FROM b."references";
  IF unchanged <> 0 THEN RAISE EXCEPTION '% rows were not updated', unchanged; END IF;
END
$verify$;
COMMIT;

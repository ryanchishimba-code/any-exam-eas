-- Apply batch s12b8. Updates only the references column, and only while the row is still null or an outline label with no URL.
-- Requires qbi_usmle_refs_s12b8_20261121_stage and qbi_usmle_refs_s12b8_20261121_backup.
-- Does not touch production unless this file is run. Undo: scripts/undo-usmle-refs-s12b8-20261121.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s12b8_20261121_stage') IS NULL THEN
    RAISE EXCEPTION 'staging table missing';
  END IF;
  IF to_regclass('public.qbi_usmle_refs_s12b8_20261121_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b8_20261121_stage) <> 59 THEN
    RAISE EXCEPTION 'stage row count %, expected 59', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b8_20261121_stage);
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b8_20261121_backup) <> 59 THEN
    RAISE EXCEPTION 'backup row count %, expected 59', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b8_20261121_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $b8q0$[{"label": "StatPearls. Hodgkin Lymphoma. They commonly arise in the cervical lymph nodes; the disease is more common in young adults; there are scattered large mononuclear Hodgkin and multinucleated cells (Reed-Sternberg) intermixed in a background of a mixture of non-neoplastic inflammatory cells; finally, T lymphocytes are often observed surrounding the characteristic neoplastic cells.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499969/"}]$b8q0$::jsonb
WHERE id = 'b1x06101e0ce1570acf868bcd5e'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q1$[{"label": "StatPearls. Odds Ratio. Odds ratios commonly are used to report case-control studies.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK431098/"}]$b8q1$::jsonb
WHERE id = 'b1x07c62fcf95f394f71c13039b'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q2$[{"label": "StatPearls. Hemophilia A. Hemophilia A, the most common form, is caused by a deficiency or dysfunction of coagulation factor VIII and is inherited in an X-linked recessive pattern, predominantly affecting males while females are typically carriers.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470265/"}]$b8q2$::jsonb
WHERE id = 'b1x14b713baf2f9ef06f32888fe'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q3$[{"label": "StatPearls. Subdural Hematoma. Rupture of these thin-walled bridging veins under opposing mechanical forces releases blood into the subdural space, resulting in a subdural hematoma.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK532970/"}]$b8q3$::jsonb
WHERE id = 'b1x246f966a1dceeb2018143071'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q4$[{"label": "StatPearls. Rapidly Progressive Glomerulonephritis. Characteristic histopathological findings on renal biopsy-cellular crescent formation in the glomeruli, which is a proliferative cellular response of parietal epithelial cells within the Bowman space.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK557430/"}]$b8q4$::jsonb
WHERE id = 'b1x35aab21c4bc54d56f71e721e'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q5$[{"label": "StatPearls. 17-Hydroxylase Deficiency. The most common cause of CAH is 21-hydroxylase (21-OH) deficiency, resulting from mutations or deletions of the CYP21A2 gene, which accounts for over 90% of CAH cases.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK546644/"}]$b8q5$::jsonb
WHERE id = 'b1x396959c176153b243af9d811'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q6$[{"label": "StatPearls. Von Willebrand Factor. Von Willebrand factor (vWF) mediates platelet adhesion to exposed subendothelial collagen at sites of vascular injury, facilitating the formation of primary hemostatic plugs.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK565885/"}]$b8q6$::jsonb
WHERE id = 'b1x64c7cf3f4aa196a1a92a3a34'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q7$[{"label": "StatPearls. Chronic Lymphocytic Leukemia. Chronic lymphocytic leukemia (CLL) or small lymphocytic lymphoma (SLL) is an indolent malignant neoplasms characterized by increased production of mature but dysfunctional B lymphocytes.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470433/"}]$b8q7$::jsonb
WHERE id = 'b1x72d38f6cb7219d1471b0b09d'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q8$[{"label": "StatPearls. Weber Syndrome. Weber syndrome, classically described as a midbrain stroke syndrome and superior alternating hemiplegia, involves oculomotor fascicles in the interpeduncular cisterns and cerebral peduncle, thereby causing ipsilateral third nerve palsy with contralateral hemiparesis.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK559158/"}]$b8q8$::jsonb
WHERE id = 'b1x8c2cf39f7696f99669f2e655'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q9$[{"label": "StatPearls. Primary Biliary Cholangitis. Primary biliary cholangitis (PBC), previously known as primary biliary cirrhosis, is a chronic autoimmune cholestatic liver disease characterized by progressive destruction of small intrahepatic bile ducts, leading to cholestasis and periportal inflammation.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK459209/"}]$b8q9$::jsonb
WHERE id = 'b1xc427577baf9659c8c06338b4'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q10$[{"label": "StatPearls. Patent Ductus Arteriosus. The ductus is a remnant of the distal sixth aortic arch and connects the proximal descending aorta to the main pulmonary artery.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK430758/"}]$b8q10$::jsonb
WHERE id = 'b1xc4b7b28e8bbdeb067b7d2337'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q11$[{"label": "StatPearls. Zenker Diverticulum. It only involves the mucosa and submucosal layers and does not involve the muscular layer, hence making it a false diverticulum.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499996/"}]$b8q11$::jsonb
WHERE id = 'b1xe07614259ccd673347ee8a2d'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q12$[{"label": "StatPearls. Meckel Diverticulum. Acid secretion from the ectopic gastric mucosa within the diverticulum can result in gastrointestinal bleeding and abdominal pain.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499960/"}]$b8q12$::jsonb
WHERE id = 'b2x9ee8601a8b40de567c151f58'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q13$[{"label": "StatPearls. Papillary Muscle Rupture. Papillary muscle rupture is a rare but potentially fatal complication, typically occurring after myocardial infarction or due to infective endocarditis.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK499976/"}]$b8q13$::jsonb
WHERE id = 'b2xfac7f633eb0a4a9b69340dba'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q14$[{"label": "StatPearls. Odds Ratio. Odds ratios commonly are used to report case-control studies.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK431098/"}]$b8q14$::jsonb
WHERE id = 'b3x4bf15da543292da42c3139fb'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q15$[{"label": "StatPearls. Cervical Dysplasia. Cervical dysplasia, also known as cervical intraepithelial neoplasia (CIN), is the precursor lesion of cervical squamous cell carcinoma and results from persistent infection with high-risk human papillomavirus (hrHPV).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK430859/"}]$b8q15$::jsonb
WHERE id = 'cmqd1ltbs000u1ychpu36r9j5'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q16$[{"label": "StatPearls. Adrenal Insufficiency. Destruction or dysfunction of the adrenal cortex mainly causes glucocorticoid and mineralocorticoid deficiency.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK441832/"}]$b8q16$::jsonb
WHERE id = 'cmr4n514b00ct1y1eyhogfjf8'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q17$[{"label": "StatPearls. Myelodysplastic Syndrome. Myelodysplastic syndromes (MDS) are a heterogeneous group of hematologic neoplasms classically described as clonal disorders of hematopoietic stem cells that lead to dysplasia and ineffective hematopoiesis in the bone marrow", "url": "https://www.ncbi.nlm.nih.gov/books/NBK534126/"}]$b8q17$::jsonb
WHERE id = 'cmr86y7ev007k1yw241c3htoc'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q18$[{"label": "StatPearls. Ketoacidosis. The paucity of insulin causes unopposed lipolysis and oxidation of free fatty acids, resulting in ketone body production and subsequent increased anion gap metabolic acidosis.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK534848/"}]$b8q18$::jsonb
WHERE id = 'cmr8bg1z001051yw2fukca24d'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q19$[{"label": "StatPearls. Renal Artery Stenosis. Eventually, decreased perfusion can lead to structural and functional damage to the kidneys and complications of chronic kidney disease and end-stage renal disease.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK430718/"}]$b8q19$::jsonb
WHERE id = 'cmr8clr9i019n1yw2wepywpxy'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q20$[{"label": "StatPearls. Syndrome of Inappropriate Antidiuretic Hormone Secretion. Syndrome of inappropriate antidiuretic hormone (SIADH) release is a condition defined by the unsuppressed release of antidiuretic hormone (ADH) from the pituitary gland or nonpituitary sources or its continued action on vasopressin receptors.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK507777/"}]$b8q20$::jsonb
WHERE id = 'cmr8ei4iz00aj1yaz91gimrei'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q21$[{"label": "StatPearls. Myelodysplastic Syndrome. Myelodysplastic syndromes (MDS) are a heterogeneous group of hematologic neoplasms classically described as clonal disorders of hematopoietic stem cells that lead to dysplasia and ineffective hematopoiesis in the bone marrow", "url": "https://www.ncbi.nlm.nih.gov/books/NBK534126/"}]$b8q21$::jsonb
WHERE id = 'cmrpvuxqg000p1yh5p4nn10ut'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q22$[{"label": "StatPearls. Gilbert Syndrome. Triggers that can precipitate unconjugated hyperbilirubinemia of Gilbert syndrome include but are not limited to fasting, intercurrent illness, menstruation, and dehydration.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470200/"}]$b8q22$::jsonb
WHERE id = 'cmrpw186a002p1yh5k5zg6k06'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q23$[{"label": "StatPearls. Hypoglycemia. Hypoglycemia is often defined by a plasma glucose concentration below 70 mg/dL; however, signs and symptoms may not occur until plasma glucose concentrations drop below 55 mg/dL.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK534841/"}]$b8q23$::jsonb
WHERE id = 'cmrpw58z2002y1yrttytl0ide'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q24$[{"label": "StatPearls. Nephrotic Syndrome. It is caused by increased permeability through the damaged basement membrane in the renal glomerulus, especially infectious or thrombo-embolic.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470444/"}]$b8q24$::jsonb
WHERE id = 'cmrrtm7p200501y8w8qho33f5'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q25$[{"label": "StatPearls. Chronic Lymphocytic Leukemia. Chronic lymphocytic leukemia (CLL) or small lymphocytic lymphoma (SLL) is an indolent malignant neoplasms characterized by increased production of mature but dysfunctional B lymphocytes.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470433/"}]$b8q25$::jsonb
WHERE id = 'cmrrutd6w00jl1y8wwkt1y4nu'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q26$[{"label": "StatPearls. Hypertensive Retinopathy. Hypertension causes 3 types of ocular injury: choroidopathy, retinopathy, and optic neuropathy.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK525980/"}]$b8q26$::jsonb
WHERE id = 'cmrrutgtt00ju1y8wxa8wrai6'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q27$[{"label": "StatPearls. Thoracentesis. Thoracentesis is a commonly performed diagnostic and therapeutic procedure for removing fluid from the pleural space, aiding in evaluating and managing pleural effusions.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK441866/"}]$b8q27$::jsonb
WHERE id = 'cmrrutkbu00k31y8wpth4k8l0'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q28$[{"label": "StatPearls. Pulmonary Edema. It is not a single disease but a final common pathway for many disorders, classified by mechanism into 3 groups: Cardiogenic (hydrostatic) pulmonary edema: caused by elevated pulmonary capillary pressure, most often from left-sided heart failure.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK557611/"}]$b8q28$::jsonb
WHERE id = 'cmrruxv4100mb1y8wo5mccta3'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q29$[{"label": "StatPearls. Atrial Fibrillation. Loss of effective atrial contraction and irregular ventricular activation can impair cardiac function, while blood stasis, particularly in the left atrial appendage, promotes thrombus formation and increases the risk of systemic thromboembolism and ischemic stroke.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK526072/"}]$b8q29$::jsonb
WHERE id = 'cmrruxvn900mi1y8wzhu90c9r'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q30$[{"label": "StatPearls. Biliary Obstruction. Cholestasis can present as abnormalities in serum hepatic enzymes, such as elevated bilirubin and alkaline phosphatase levels, and can lead to jaundice and pruritis.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK539698/"}]$b8q30$::jsonb
WHERE id = 'cmrsew9yc000d1y55tdgjsrab'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q31$[{"label": "StatPearls. Asthma. This respiratory condition is characterized by inflammation of the airways, causing intermittent airflow obstruction and bronchial hyperresponsiveness.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK430901/"}]$b8q31$::jsonb
WHERE id = 'cmrsewanj000m1y553d9f08ne'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q32$[{"label": "StatPearls. Respiratory Acidosis. Respiratory acidosis is a state in which there is usually a failure of ventilation and an accumulation of carbon dioxide.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482430/"}]$b8q32$::jsonb
WHERE id = 'cmrsf3gpd00281y55r4mp2enj'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q33$[{"label": "StatPearls. Anemia of Chronic Kidney Disease. The primary mechanisms behind anemia of CKD, including end-stage renal disease (ESRD), involve decreased erythropoietin production, decreased gastrointestinal iron absorption due to chronic inflammation, and a decreased lifespan of red blood cells (RBCs).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK539871/"}]$b8q33$::jsonb
WHERE id = 'cmrsf3hzs002l1y55lx4on2dp'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q34$[{"label": "StatPearls. Respiratory Acidosis. In the presence of alveolar hypoventilation, 2 features commonly seen are respiratory acidosis and hypercapnia.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482430/"}]$b8q34$::jsonb
WHERE id = 'cmrtqq4zd00111yx3ybsuo7m5'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q35$[{"label": "StatPearls. Type III Hypersensitivity Reaction. Once deposited in tissues, the immune complexes associated with type III hypersensitivity reactions activate the classical complement pathway, generating C3a and C5a fragments that recruit neutrophils and macrophages to the site of deposition.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK559122/"}]$b8q35$::jsonb
WHERE id = 'cmrvm5uke0006jw04eu76rofb'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q36$[{"label": "StatPearls. Primary Hyperparathyroidism. Primary hyperparathyroidism (PHPT) is an endocrine disorder defined by autonomous overproduction of parathyroid hormone (PTH), resulting in hypercalcemia and disrupted calcium homeostasis.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK441895/"}]$b8q36$::jsonb
WHERE id = 'plt701d6253cf336270527c2a59'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q37$[{"label": "StatPearls. Hydroxocobalamin. Hydroxocobalamin is a medication used in the management and treatment of vitamin B12 deficiency and acute cyanide toxicity.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK557632/"}]$b8q37$::jsonb
WHERE id = 'b3x14a8107c3ff7075ee0aeeebe'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q38$[{"label": "StatPearls. Atropine. Atropine is an anticholinergic agent that functions as a competitive, reversible antagonist of muscarinic receptors.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470551/"}]$b8q38$::jsonb
WHERE id = 'b3x5963e3840ab948ff30013bf1'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q39$[{"label": "StatPearls. Delirium. Delirium is a common clinical syndrome in older adults characterized by an acute disturbance of attention, awareness, and cognitive function that impairs focus and the ability to shift attention appropriately.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470399/"}]$b8q39$::jsonb
WHERE id = 'cmqiy342w000r1yugw5a64deq'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q40$[{"label": "StatPearls. Developmental Delay. Delay in development is generally determined with a child does not attain developmental milestones as compared to peers from the same population.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK562231/"}]$b8q40$::jsonb
WHERE id = 'cmr4gwiyu00111ydexb0m8u2p'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q41$[{"label": "StatPearls. Leukotriene Receptor Antagonists. Montelukast and zafirlukast are cysteinyl leukotriene receptor antagonists indicated to prevent and treat chronic asthma.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK554445/"}]$b8q41$::jsonb
WHERE id = 'cmr4gwklt001h1ydepakom5ou'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q42$[{"label": "StatPearls. Atomoxetine. Atomoxetine is indicated for treating attention deficit hyperactivity disorder (ADHD) in adults and children over six years.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK493234/"}]$b8q42$::jsonb
WHERE id = 'cmr4gwkws001k1ydeusx8ej4h'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q43$[{"label": "StatPearls. Acetaminophen. Acetaminophen, also known as N-acetyl-para-aminophenol (APAP) or paracetamol in many countries, is a non-opioid analgesic and antipyretic agent utilized for treating pain and fever.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482369/"}]$b8q43$::jsonb
WHERE id = 'cmr4hzxg500b31yde12z72gay'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q44$[{"label": "StatPearls. Acetaminophen. Acetaminophen, also known as N-acetyl-para-aminophenol (APAP) or paracetamol in many countries, is a non-opioid analgesic and antipyretic agent utilized for treating pain and fever.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482369/"}]$b8q44$::jsonb
WHERE id = 'cmr4iy8am00h31ydes6awio9r'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q45$[{"label": "StatPearls. Developmental Delay. Delay in development is generally determined with a child does not attain developmental milestones as compared to peers from the same population.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK562231/"}]$b8q45$::jsonb
WHERE id = 'cmr4kiljq00sq1ydemv2qxvzy'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q46$[{"label": "StatPearls. Hypertensive Encephalopathy. Pulmonary edema, cardiac ischemic events, acute renal failure, aortic dissection, eclampsia, retinopathy, encephalopathy, and intracranial hemorrhage may develop as a result of hypertension-related organ injury.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK554499/"}]$b8q46$::jsonb
WHERE id = 'cmr86y949009n1yr9mop9q0pw'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q47$[{"label": "StatPearls. Diabetes. The main subtypes of DM are Type 1 diabetes mellitus (T1DM) and Type 2 diabetes mellitus (T2DM), which classically result from defective insulin secretion (T1DM) and/or action (T2DM).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK551501/"}]$b8q47$::jsonb
WHERE id = 'cmr87iz9600gc1yr9wg40mwln'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q48$[{"label": "StatPearls. Synchronized Electrical Cardioversion. Synchronized cardioversion is a procedure similar to electrical defibrillation in that a transthoracic electrical current is applied to the anterior chest to terminate a life-threatening or unstable tachycardic arrhythmia.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482173/"}]$b8q48$::jsonb
WHERE id = 'cmr87j0uo00gr1yr9rcbvov3n'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q49$[{"label": "StatPearls. Thoracentesis. Thoracentesis is a commonly performed diagnostic and therapeutic procedure for removing fluid from the pleural space, aiding in evaluating and managing pleural effusions.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK441866/"}]$b8q49$::jsonb
WHERE id = 'cmr88ieuh00qr1yr9cjt8a0ms'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q50$[{"label": "StatPearls. Acetaminophen. Acetaminophen, also known as N-acetyl-para-aminophenol (APAP) or paracetamol in many countries, is a non-opioid analgesic and antipyretic agent utilized for treating pain and fever.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK482369/"}]$b8q50$::jsonb
WHERE id = 'cmr89lusm01021yr9dgmlypgf'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q51$[{"label": "StatPearls. Developmental Delay. Delay in development is generally determined with a child does not attain developmental milestones as compared to peers from the same population.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK562231/"}]$b8q51$::jsonb
WHERE id = 'cmr89lw80010j1yr917tv1w5l'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q52$[{"label": "StatPearls. Hypertensive Heart Disease. Hypertensive heart disease (HHD) refers to a constellation of structural and functional changes in the left ventricle, left atrium, and coronary arteries resulting from chronic blood pressure elevation.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK539800/"}]$b8q52$::jsonb
WHERE id = 'cmrpw0ogk004n1yluqg71zlke'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q53$[{"label": "StatPearls. Ovarian Cyst. However, ovarian cysts can lead to complications such as pelvic pain, cyst rupture, blood loss, and ovarian torsion that require prompt management.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK560541/"}]$b8q53$::jsonb
WHERE id = 'cmrpw5xsg006x1ylu0k495vi9'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q54$[{"label": "StatPearls. Endoscopic Retrograde Cholangiopancreatography. Endoscopic retrograde cholangiopancreatography (ERCP) is a specialized endoscopic technique that combines endoscopy and fluoroscopy to diagnose and, more commonly, treat disorders of the biliary and pancreatic ducts.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK493160/"}]$b8q54$::jsonb
WHERE id = 'cmrpwg5tv00bn1ylufciix8h5'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q55$[{"label": "StatPearls. Alcohol-Associated Hepatitis. Excessive alcohol consumption may result in hepatic steatosis (fatty liver disease), alcohol-associated hepatitis, and eventually cirrhosis.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470217/"}]$b8q55$::jsonb
WHERE id = 'cmrrvrqp100961yl8s9wmmglj'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q56$[{"label": "StatPearls. Nimodipine. Today, nimodipine is predominantly used to manage vasospasm subsequent to subarachnoid hemorrhage, in addition to off-label applications.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK534870/"}]$b8q56$::jsonb
WHERE id = 'cmrsfgnam00531ynylrn693fp'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q57$[{"label": "StatPearls. Pleural Effusion. Pleural effusion is diagnosed using a combination of clinical evaluation, imaging studies, and laboratory studies, particularly pleural fluid analysis.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK448189/"}]$b8q57$::jsonb
WHERE id = 'cmrtq0syd000x1yqcxuaxeuwp'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
UPDATE "QuestionBankItem"
SET "references" = $b8q58$[{"label": "StatPearls. Trimethoprim-Sulfamethoxazole. Since its introduction in 1974, TMP-SMX has been approved by the US Food and Drug Administration for conditions including urinary tract infections, acute exacerbations of chronic bronchitis, otitis media in pediatric patients, traveler s diarrhea, shigellosis, and treatment and prophylaxis of Pneumocystis jirovecii pneumonia and toxoplasmosis.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK513232/"}]$b8q58$::jsonb
WHERE id = 'cmtpx024h00871y6huwj3dg1x'
  AND "fieldId" IN ('usmle-step-1','usmle-step-2')
  AND active = true AND "qaPassed" = true
  AND (
    "references" IS NULL
    OR (
      jsonb_typeof("references") = 'array'
      AND jsonb_array_length("references") > 0
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements("references") e
        WHERE COALESCE(e->>'url','') <> ''
           OR COALESCE(e->>'label','') !~* 'usmle|nbme|content outline'
      )
    )
  );
DO $verify$
DECLARE k integer;
BEGIN
  SELECT COUNT(*) INTO k
  FROM "QuestionBankItem" q
  JOIN qbi_usmle_refs_s12b8_20261121_stage s ON s.id = q.id
  WHERE q."references" = s."references";
  IF k <> 59 THEN
    RAISE EXCEPTION 'updated % rows, expected 59', k;
  END IF;
END
$verify$;
COMMIT;

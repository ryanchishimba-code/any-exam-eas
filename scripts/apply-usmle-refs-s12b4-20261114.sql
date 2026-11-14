-- Merck Manual Professional citations for served USMLE Step 1 and Step 2 items, 2026-11-14.
-- Backup qbi_usmle_refs_s12b4_20261114_backup (56 rows). Only the references column is updated.
-- Each sentence was read from the fetched Merck page and matches that item's key.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12b4-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s12b4_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'b1x40631eebc23abf8bf3775102',
    'b1x71f29678bf5d9a06d16356a0',
    'cmr31dl2u00bvjs04kan9fe1v',
    'cmr4lnk1g003c1y1e8jj7vhnw',
    'cmr4mo8wf009i1y1e2booq08j',
    'cmr4nxrw700gh1y1e3qrso7z6',
    'cmr4ousm200n01y1eqohwmiqs',
    'cmr4pz5gj00sq1y1e8rbcnyfi',
    'cmr4qv8bl00zc1y1ebjni6g5x',
    'cmr86y52a006x1yw2s03qfud2',
    'cmr86y6hz007b1yw2v66ke4zr',
    'cmrpv8f7a00001ync6bmg082t',
    'cmrpv8fch00011yncwu37tavx',
    'cmrpw7bw900501yh510ztwx1u',
    'cmrruacdw00d01y8waae1fflb',
    'cmrrum5t900hq1y8w2d8fy6ko',
    'cmrsew9ng00091y55d5mgnxf5',
    'cmrtgrh5j000p1yax9ueyoz99',
    'cmrth11sk002y1yaxz5oov30j',
    'cmrtqfzxe000h1yx3ykmc21ob',
    'b3x8c74326bbb85acd69e81a6a3',
    'cmpnjgx1b001t1ymxdcrs99j7',
    'cmpnjhav700211ymxhu3gprmr',
    'cmpnjhb2900221ymxlz4v3t94',
    'cmqatq11j00031y8f0n02954w',
    'cmqxdeo4j009x1ymabnduvmhk',
    'cmqxderqn00ay1ymajbm35hs0',
    'cmqxdesgf00b51ymaznivd1kt',
    'cmr31dlh100c7js046jaclqa6',
    'cmr85sysb001c1yr9wj15qx3s',
    'cmr89vb6t01311yr9ptdu6l07',
    'cmr89vbxr013a1yr940jrl9jp',
    'cmr8al8ep019h1yr9pekhuxcn',
    'cmra6lzmo0040ic04l2m0sqm1',
    'cmra6lzw90046ic04tdr5ajmf',
    'cmrpw5xar006s1ylulwcdwjes',
    'cmrrbwapn000vl104byt5qw08',
    'cmrrbwazz0012l104pjpu8v78',
    'cmrrvzu6r00dt1yl8gte4vprm',
    'cmrsfd2kw002v1ynyt2asdjcl',
    'cmrsfd2ns002w1yny7ht10z3w',
    'cmrsrb2hq0018l404mjy4c0xn',
    'cmrtprxvu000k1yqcs8mrszoh',
    'cmrtprxyy000l1yqc3pmh6wc0',
    'cmrtpry9m000o1yqc7vq9a29q',
    'cmrtpryuf000t1yqc62s7hwb5',
    'cmrtq0t6x00101yqcy8hkdl0p',
    'cmrtq0u7d001d1yqc1e3fyxh8',
    'cmrtq0v51001p1yqc6txevwah',
    'cmrtq47k000221yqc08kksb3x',
    'cmru6qyif002al104jbpjdl7p',
    'cmru6qywg002ol104jwun8zk6',
    'cmrvm5yvn001djw047pxli6sr',
    'cmtps7vx5000u1y1qdipcaxq7',
    'cmtpsazna002i1y1qlrba65z4',
    'cmtpsb0ks002u1y1q5r50z01i'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b4_20261114_backup) <> 56 THEN
    RAISE EXCEPTION 'backup row count %, expected 56', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b4_20261114_backup);
  END IF;
  IF EXISTS (SELECT 1 FROM qbi_usmle_refs_s12b4_20261114_backup WHERE "fieldId" NOT IN ('usmle-step-1','usmle-step-2')) THEN
    RAISE EXCEPTION 'backup includes a row outside Step 1 and Step 2';
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $b4j0$[{"label": "Merck Manual Professional. Aortic stenosis. Aortic stenosis (AS) is narrowing or restricted opening of the aortic valve, obstructing blood flow from the left ventricle to the aorta during systole.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/valvular-disorders/aortic-stenosis"}]$b4j0$::jsonb
WHERE id = 'b1x40631eebc23abf8bf3775102'
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
SET "references" = $b4j1$[{"label": "Merck Manual Professional. Primary sclerosing cholangitis. Primary sclerosing cholangitis (PSC) is patchy inflammation, fibrosis, and strictures of the bile ducts, which has no known cause.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/primary-sclerosing-cholangitis-psc"}]$b4j1$::jsonb
WHERE id = 'b1x71f29678bf5d9a06d16356a0'
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
SET "references" = $b4j2$[{"label": "Merck Manual Professional. Glucose-6-phosphate dehydrogenase deficiency. Glucose-6-phosphate dehydrogenase (G6PD) deficiency is an X-linked enzymatic defect common in people with African or Mediterranean ancestry that can result in hemolysis after acute illnesses or intake of oxidant medications or substances (including salicylates and sulfonamides).", "url": "https://www.merckmanuals.com/professional/hematology-and-oncology/anemias-caused-by-hemolysis/glucose-6-phosphate-dehydrogenase-g6pd-deficiency"}]$b4j2$::jsonb
WHERE id = 'cmr31dl2u00bvjs04kan9fe1v'
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
SET "references" = $b4j3$[{"label": "Merck Manual Professional. Gout. Decreased renal excretion is by far the most common cause of hyperuricemia", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$b4j3$::jsonb
WHERE id = 'cmr4lnk1g003c1y1e8jj7vhnw'
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
SET "references" = $b4j4$[{"label": "Merck Manual Professional. Gout. Decreased renal excretion is by far the most common cause of hyperuricemia", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$b4j4$::jsonb
WHERE id = 'cmr4mo8wf009i1y1e2booq08j'
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
SET "references" = $b4j5$[{"label": "Merck Manual Professional. Gout. Decreased renal excretion is by far the most common cause of hyperuricemia", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$b4j5$::jsonb
WHERE id = 'cmr4nxrw700gh1y1e3qrso7z6'
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
SET "references" = $b4j6$[{"label": "Merck Manual Professional. Gout. Decreased renal excretion is by far the most common cause of hyperuricemia", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$b4j6$::jsonb
WHERE id = 'cmr4ousm200n01y1eqohwmiqs'
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
SET "references" = $b4j7$[{"label": "Merck Manual Professional. Gout. Decreased renal excretion is by far the most common cause of hyperuricemia", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$b4j7$::jsonb
WHERE id = 'cmr4pz5gj00sq1y1e8rbcnyfi'
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
SET "references" = $b4j8$[{"label": "Merck Manual Professional. Gout. Decreased renal excretion is by far the most common cause of hyperuricemia", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$b4j8$::jsonb
WHERE id = 'cmr4qv8bl00zc1y1ebjni6g5x'
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
SET "references" = $b4j9$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Insulin normally blocks ketogenesis by inhibiting the transport of free fatty acid derivatives into the mitochondrial matrix, but ketogenesis proceeds in the absence of insulin .", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$b4j9$::jsonb
WHERE id = 'cmr86y52a006x1yw2s03qfud2'
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
SET "references" = $b4j10$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Insulin normally blocks ketogenesis by inhibiting the transport of free fatty acid derivatives into the mitochondrial matrix, but ketogenesis proceeds in the absence of insulin .", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$b4j10$::jsonb
WHERE id = 'cmr86y6hz007b1yw2v66ke4zr'
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
SET "references" = $b4j11$[{"label": "Merck Manual Professional. Iron deficiency anemia. Iron deficiency is the most common cause of anemia and usually results from blood loss; malabsorption, such as occurs in celiac disease, is a much less common cause.", "url": "https://www.merckmanuals.com/professional/hematology/anemias-caused-by-deficient-erythropoiesis/iron-deficiency-anemia"}]$b4j11$::jsonb
WHERE id = 'cmrpv8f7a00001ync6bmg082t'
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
SET "references" = $b4j12$[{"label": "Merck Manual Professional. Glucose-6-phosphate dehydrogenase deficiency. Glucose-6-phosphate dehydrogenase (G6PD) deficiency is an X-linked enzymatic defect common in people with African or Mediterranean ancestry that can result in hemolysis after acute illnesses or intake of oxidant medications or substances (including salicylates and sulfonamides).", "url": "https://www.merckmanuals.com/professional/hematology-and-oncology/anemias-caused-by-hemolysis/glucose-6-phosphate-dehydrogenase-g6pd-deficiency"}]$b4j12$::jsonb
WHERE id = 'cmrpv8fch00011yncwu37tavx'
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
SET "references" = $b4j13$[{"label": "Merck Manual Professional. Immune thrombocytopenia. Immune thrombocytopenia (ITP) is a bleeding disorder usually without anemia or leukopenia.", "url": "https://www.merckmanuals.com/professional/hematology/thrombocytopenia-and-platelet-dysfunction/immune-thrombocytopenia-itp"}]$b4j13$::jsonb
WHERE id = 'cmrpw7bw900501yh510ztwx1u'
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
SET "references" = $b4j14$[{"label": "Merck Manual Professional. Pulmonary embolism. Pulmonary embolism treatment is with anticoagulants and, sometimes, clot dissolution with systemic or catheter-directed thrombolysis or by removal of the clot via catheter suction thrombectomy or surgical resection.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe"}]$b4j14$::jsonb
WHERE id = 'cmrruacdw00d01y8waae1fflb'
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
SET "references" = $b4j15$[{"label": "Merck Manual Professional. Gout. Decreased renal excretion is by far the most common cause of hyperuricemia", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/crystal-induced-arthritides/gout"}]$b4j15$::jsonb
WHERE id = 'cmrrum5t900hq1y8w2d8fy6ko'
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
SET "references" = $b4j16$[{"label": "Merck Manual Professional. Pulmonary embolism. Pulmonary embolism treatment is with anticoagulants and, sometimes, clot dissolution with systemic or catheter-directed thrombolysis or by removal of the clot via catheter suction thrombectomy or surgical resection.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe"}]$b4j16$::jsonb
WHERE id = 'cmrsew9ng00091y55d5mgnxf5'
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
SET "references" = $b4j17$[{"label": "Merck Manual Professional. Pulmonary embolism. Pulmonary embolism treatment is with anticoagulants and, sometimes, clot dissolution with systemic or catheter-directed thrombolysis or by removal of the clot via catheter suction thrombectomy or surgical resection.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe"}]$b4j17$::jsonb
WHERE id = 'cmrtgrh5j000p1yax9ueyoz99'
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
SET "references" = $b4j18$[{"label": "Merck Manual Professional. Myasthenia gravis. Myasthenia gravis is characterized by episodic muscle weakness and easy fatigability caused by autoantibody- and cell-mediated destruction of acetylcholine receptors.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/peripheral-nervous-system-and-motor-unit-disorders/myasthenia-gravis"}]$b4j18$::jsonb
WHERE id = 'cmrth11sk002y1yaxz5oov30j'
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
SET "references" = $b4j19$[{"label": "Merck Manual Professional. Acute myocardial infarction. Diagnosis is by electrocardiography (ECG) and a significant elevation in cardiac troponin.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/acute-myocardial-infarction-mi"}]$b4j19$::jsonb
WHERE id = 'cmrtqfzxe000h1yx3ykmc21ob'
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
SET "references" = $b4j20$[{"label": "Merck Manual Professional. Intestinal obstruction. Treatment is fluid resuscitation, nasogastric suction, and, in most cases of complete obstruction, surgery.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/acute-abdomen-and-surgical-gastroenterology/intestinal-obstruction"}]$b4j20$::jsonb
WHERE id = 'b3x8c74326bbb85acd69e81a6a3'
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
SET "references" = $b4j21$[{"label": "Merck Manual Professional. Acute pancreatitis. Treatment is supportive with IV fluids, analgesics, and nutritional support.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$b4j21$::jsonb
WHERE id = 'cmpnjgx1b001t1ymxdcrs99j7'
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
SET "references" = $b4j22$[{"label": "Merck Manual Professional. Acute bacterial meningitis. Dexamethasone is given immediately before or with the initial dose of antibiotics", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/meningitis/acute-bacterial-meningitis"}]$b4j22$::jsonb
WHERE id = 'cmpnjhav700211ymxhu3gprmr'
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
SET "references" = $b4j23$[{"label": "Merck Manual Professional. Acute bacterial meningitis. Dexamethasone is given immediately before or with the initial dose of antibiotics", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/meningitis/acute-bacterial-meningitis"}]$b4j23$::jsonb
WHERE id = 'cmpnjhb2900221ymxlz4v3t94'
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
SET "references" = $b4j24$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$b4j24$::jsonb
WHERE id = 'cmqatq11j00031y8f0n02954w'
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
SET "references" = $b4j25$[{"label": "Merck Manual Professional. Acute coronary syndromes. Acute coronary syndromes usually result from acute obstruction of a coronary artery", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/overview-of-acute-coronary-syndromes-acs"}]$b4j25$::jsonb
WHERE id = 'cmqxdeo4j009x1ymabnduvmhk'
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
SET "references" = $b4j26$[{"label": "Merck Manual Professional. Immune thrombocytopenia. Immune thrombocytopenia (ITP) is a bleeding disorder usually without anemia or leukopenia.", "url": "https://www.merckmanuals.com/professional/hematology/thrombocytopenia-and-platelet-dysfunction/immune-thrombocytopenia-itp"}]$b4j26$::jsonb
WHERE id = 'cmqxderqn00ay1ymajbm35hs0'
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
SET "references" = $b4j27$[{"label": "Merck Manual Professional. Placental abruption. Placental abruption (abruptio placentae) is premature separation of the placenta from the uterus, usually after 20 weeks gestation.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/antenatal-complications/placental-abruption-abruptio-placentae"}]$b4j27$::jsonb
WHERE id = 'cmqxdesgf00b51ymaznivd1kt'
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
SET "references" = $b4j28$[{"label": "Merck Manual Professional. Intestinal obstruction. Overall, the most common causes of mechanical obstruction are adhesions, hernias , and tumors.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/acute-abdomen-and-surgical-gastroenterology/intestinal-obstruction"}]$b4j28$::jsonb
WHERE id = 'cmr31dlh100c7js046jaclqa6'
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
SET "references" = $b4j29$[{"label": "Merck Manual Professional. Acute bacterial meningitis. Diagnosis is by cerebrospinal fluid (CSF) analysis.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/meningitis/acute-bacterial-meningitis"}]$b4j29$::jsonb
WHERE id = 'cmr85sysb001c1yr9wj15qx3s'
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
SET "references" = $b4j30$[{"label": "Merck Manual Professional. Community-acquired pneumonia. Treatment is with empirically chosen antibiotics.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/community-acquired-pneumonia"}]$b4j30$::jsonb
WHERE id = 'cmr89vb6t01311yr9ptdu6l07'
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
SET "references" = $b4j31$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. Treatment involves volume expansion, insulin replacement, and prevention of hypokalemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$b4j31$::jsonb
WHERE id = 'cmr89vbxr013a1yr940jrl9jp'
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
SET "references" = $b4j32$[{"label": "Merck Manual Professional. Community-acquired pneumonia. Treatment is with empirically chosen antibiotics.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pneumonia/community-acquired-pneumonia"}]$b4j32$::jsonb
WHERE id = 'cmr8al8ep019h1yr9pekhuxcn'
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
SET "references" = $b4j33$[{"label": "Merck Manual Professional. Clostridioides difficile infection. Toxins produced by Clostridioides difficile strains in the gastrointestinal tract cause pseudomembranous colitis, typically after antibiotic use.", "url": "https://www.merckmanuals.com/professional/infectious-diseases/anaerobic-bacteria/clostridioides-difficile-infection"}]$b4j33$::jsonb
WHERE id = 'cmra6lzmo0040ic04l2m0sqm1'
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
SET "references" = $b4j34$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. DKA is diagnosed by detection of hyperketonemia and anion gap metabolic acidosis in the presence of hyperglycemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$b4j34$::jsonb
WHERE id = 'cmra6lzw90046ic04tdr5ajmf'
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
SET "references" = $b4j35$[{"label": "Merck Manual Professional. Acute pancreatitis. Treatment is supportive with IV fluids, analgesics, and nutritional support.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$b4j35$::jsonb
WHERE id = 'cmrpw5xar006s1ylulwcdwjes'
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
SET "references" = $b4j36$[{"label": "Merck Manual Professional. Clostridioides difficile infection. Toxins produced by Clostridioides difficile strains in the gastrointestinal tract cause pseudomembranous colitis, typically after antibiotic use.", "url": "https://www.merckmanuals.com/professional/infectious-diseases/anaerobic-bacteria/clostridioides-difficile-infection"}]$b4j36$::jsonb
WHERE id = 'cmrrbwapn000vl104byt5qw08'
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
SET "references" = $b4j37$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. DKA is diagnosed by detection of hyperketonemia and anion gap metabolic acidosis in the presence of hyperglycemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$b4j37$::jsonb
WHERE id = 'cmrrbwazz0012l104pjpu8v78'
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
SET "references" = $b4j38$[{"label": "Merck Manual Professional. Chronic obstructive pulmonary disease. Treatment is with bronchodilators, glucocorticoids, and, when necessary, oxygen and antibiotics.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd"}]$b4j38$::jsonb
WHERE id = 'cmrrvzu6r00dt1yl8gte4vprm'
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
SET "references" = $b4j39$[{"label": "Merck Manual Professional. Preeclampsia and eclampsia. Treatment is usually with IV magnesium sulfate and delivery at term, or earlier for maternal or fetal complications.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-of-pregnancy/preeclampsia-and-eclampsia"}]$b4j39$::jsonb
WHERE id = 'cmrsfd2kw002v1ynyt2asdjcl'
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
SET "references" = $b4j40$[{"label": "Merck Manual Professional. Preeclampsia and eclampsia. Treatment is usually with IV magnesium sulfate and delivery at term, or earlier for maternal or fetal complications.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-of-pregnancy/preeclampsia-and-eclampsia"}]$b4j40$::jsonb
WHERE id = 'cmrsfd2ns002w1yny7ht10z3w'
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
SET "references" = $b4j41$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. DKA is diagnosed by detection of hyperketonemia and anion gap metabolic acidosis in the presence of hyperglycemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$b4j41$::jsonb
WHERE id = 'cmrsrb2hq0018l404mjy4c0xn'
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
SET "references" = $b4j42$[{"label": "Merck Manual Professional. Immune thrombocytopenia. Immune thrombocytopenia (ITP) is a bleeding disorder usually without anemia or leukopenia.", "url": "https://www.merckmanuals.com/professional/hematology/thrombocytopenia-and-platelet-dysfunction/immune-thrombocytopenia-itp"}]$b4j42$::jsonb
WHERE id = 'cmrtprxvu000k1yqcs8mrszoh'
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
SET "references" = $b4j43$[{"label": "Merck Manual Professional. Acute coronary syndromes. Acute coronary syndromes usually result from acute obstruction of a coronary artery", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/overview-of-acute-coronary-syndromes-acs"}]$b4j43$::jsonb
WHERE id = 'cmrtprxyy000l1yqc3pmh6wc0'
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
SET "references" = $b4j44$[{"label": "Merck Manual Professional. Immune thrombocytopenia. Immune thrombocytopenia (ITP) is a bleeding disorder usually without anemia or leukopenia.", "url": "https://www.merckmanuals.com/professional/hematology/thrombocytopenia-and-platelet-dysfunction/immune-thrombocytopenia-itp"}]$b4j44$::jsonb
WHERE id = 'cmrtpry9m000o1yqc7vq9a29q'
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
SET "references" = $b4j45$[{"label": "Merck Manual Professional. Preeclampsia and eclampsia. Treatment is usually with IV magnesium sulfate and delivery at term, or earlier for maternal or fetal complications.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/abnormalities-of-pregnancy/preeclampsia-and-eclampsia"}]$b4j45$::jsonb
WHERE id = 'cmrtpryuf000t1yqc62s7hwb5'
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
SET "references" = $b4j46$[{"label": "Merck Manual Professional. Acute coronary syndromes. Acute coronary syndromes usually result from acute obstruction of a coronary artery", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/overview-of-acute-coronary-syndromes-acs"}]$b4j46$::jsonb
WHERE id = 'cmrtq0t6x00101yqcy8hkdl0p'
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
SET "references" = $b4j47$[{"label": "Merck Manual Professional. Acute coronary syndromes. Acute coronary syndromes usually result from acute obstruction of a coronary artery", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/overview-of-acute-coronary-syndromes-acs"}]$b4j47$::jsonb
WHERE id = 'cmrtq0u7d001d1yqc1e3fyxh8'
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
SET "references" = $b4j48$[{"label": "Merck Manual Professional. Acute bacterial meningitis. Diagnosis is by cerebrospinal fluid (CSF) analysis.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/meningitis/acute-bacterial-meningitis"}]$b4j48$::jsonb
WHERE id = 'cmrtq0v51001p1yqc6txevwah'
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
SET "references" = $b4j49$[{"label": "Merck Manual Professional. Chronic obstructive pulmonary disease. Treatment is with bronchodilators, glucocorticoids, and, when necessary, oxygen and antibiotics.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd"}]$b4j49$::jsonb
WHERE id = 'cmrtq47k000221yqc08kksb3x'
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
SET "references" = $b4j50$[{"label": "Merck Manual Professional. Clostridioides difficile infection. Toxins produced by Clostridioides difficile strains in the gastrointestinal tract cause pseudomembranous colitis, typically after antibiotic use.", "url": "https://www.merckmanuals.com/professional/infectious-diseases/anaerobic-bacteria/clostridioides-difficile-infection"}]$b4j50$::jsonb
WHERE id = 'cmru6qyif002al104jbpjdl7p'
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
SET "references" = $b4j51$[{"label": "Merck Manual Professional. Diabetic ketoacidosis. DKA is diagnosed by detection of hyperketonemia and anion gap metabolic acidosis in the presence of hyperglycemia.", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-hypoglycemia/diabetic-ketoacidosis-dka"}]$b4j51$::jsonb
WHERE id = 'cmru6qywg002ol104jwun8zk6'
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
SET "references" = $b4j52$[{"label": "Merck Manual Professional. Clostridioides difficile infection. Toxins produced by Clostridioides difficile strains in the gastrointestinal tract cause pseudomembranous colitis, typically after antibiotic use.", "url": "https://www.merckmanuals.com/professional/infectious-diseases/anaerobic-bacteria/clostridioides-difficile-infection"}]$b4j52$::jsonb
WHERE id = 'cmrvm5yvn001djw047pxli6sr'
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
SET "references" = $b4j53$[{"label": "Merck Manual Professional. Acute coronary syndromes. Acute coronary syndromes usually result from acute obstruction of a coronary artery", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/coronary-artery-disease/overview-of-acute-coronary-syndromes-acs"}]$b4j53$::jsonb
WHERE id = 'cmtps7vx5000u1y1qdipcaxq7'
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
SET "references" = $b4j54$[{"label": "Merck Manual Professional. Acute pancreatitis. Treatment is supportive with IV fluids, analgesics, and nutritional support.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$b4j54$::jsonb
WHERE id = 'cmtpsazna002i1y1qlrba65z4'
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
SET "references" = $b4j55$[{"label": "Merck Manual Professional. Chronic obstructive pulmonary disease. Treatment is with bronchodilators, glucocorticoids, and, when necessary, oxygen and antibiotics.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/chronic-obstructive-pulmonary-disease-and-related-disorders/chronic-obstructive-pulmonary-disease-copd"}]$b4j55$::jsonb
WHERE id = 'cmtpsb0ks002u1y1q5r50z01i'
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
BEGIN
  IF EXISTS (
    SELECT 1 FROM "QuestionBankItem" q
    JOIN qbi_usmle_refs_s12b4_20261114_backup b ON b.id = q.id
    WHERE q."references" IS NOT DISTINCT FROM b."references"
  ) THEN
    RAISE EXCEPTION 'at least one row was not updated';
  END IF;
END
$verify$;
COMMIT;

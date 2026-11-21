-- Apply batch s12b9. Updates only the references column, and only while the row is still null or an outline label with no URL.
-- Requires qbi_usmle_refs_s12b9_20261121_stage and qbi_usmle_refs_s12b9_20261121_backup.
-- Does not touch production unless this file is run. Undo: scripts/undo-usmle-refs-s12b9-20261121.sql
BEGIN;
DO $check$
BEGIN
  IF to_regclass('public.qbi_usmle_refs_s12b9_20261121_stage') IS NULL THEN
    RAISE EXCEPTION 'staging table missing';
  END IF;
  IF to_regclass('public.qbi_usmle_refs_s12b9_20261121_backup') IS NULL THEN
    RAISE EXCEPTION 'backup table missing';
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b9_20261121_stage) <> 14 THEN
    RAISE EXCEPTION 'stage row count %, expected 14', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b9_20261121_stage);
  END IF;
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b9_20261121_backup) <> 14 THEN
    RAISE EXCEPTION 'backup row count %, expected 14', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b9_20261121_backup);
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $b9q0$[{"label": "StatPearls. Mitral Regurgitation. This regurgitant flow produces a characteristic holosystolic murmur best heard at the cardiac apex with radiation toward the left axilla and, when progressive or severe, results in chronic volume overload of both the left atrium and left ventricle", "url": "https://www.ncbi.nlm.nih.gov/books/NBK553135/"}]$b9q0$::jsonb
WHERE id = 'b1x329fa184ac810b95976a2c11'
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
SET "references" = $b9q1$[{"label": "StatPearls. Crigler-Najjar Syndrome. Crigler-Najjar syndrome is characterized by the absence or decreased activity of UDP-glucuronosyltransferase (UGT), an enzyme required for glucuronidation of unconjugated bilirubin in the liver.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK562171/"}]$b9q1$::jsonb
WHERE id = 'b1xe07ca0323d3bce455a44a7e7'
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
SET "references" = $b9q2$[{"label": "StatPearls. Mitral Regurgitation. The disorder is characterized by the retrograde flow of blood from the left ventricle into the left atrium during systole due to incomplete coaptation of the mitral valve leaflets.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK553135/"}]$b9q2$::jsonb
WHERE id = 'b7x0b161a942f7f785c788f8715'
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
SET "references" = $b9q3$[{"label": "StatPearls. Rheumatoid Arthritis. Rheumatoid arthritis (RA) is a systemic autoimmune disease characterized by inflammatory arthritis and extra-articular involvement. It is a chronic inflammatory disorder caused in many cases by the interaction between genes and environmental factors, including tobacco, that primarily involves synovial joints.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK441999/"}]$b9q3$::jsonb
WHERE id = 'cmqxc0uvr00111yma3j8chtgk'
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
SET "references" = $b9q4$[{"label": "StatPearls. Electrophysiology Study and Ablation of Atrioventricular Nodal Reentrant Tachycardia. AVNRT is characterized by a reentrant circuit involving fast and slow pathways near the compact AV node; the ventricles do not participate in the tachycardia circuit.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK594260/"}]$b9q4$::jsonb
WHERE id = 'cmqxcjv2m00421ymaun0fx2te'
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
SET "references" = $b9q5$[{"label": "StatPearls. Polymyositis. Idiopathic inflammatory myopathies constitute a heterogeneous group of autoimmune disorders characterized by chronic muscle inflammation that leads to weakness and myalgia and by frequent involvement of other organs, including the joints, skin, and lungs. The IIMs comprise 5 major subtypes: polymyositis, dermatomyositis, immune-mediated necrotizing myositis (IMNM), inclusion body myositis (IBM), and antisynthetase syndrome (ASyS).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK563129/"}]$b9q5$::jsonb
WHERE id = 'cmr4moaud00a61y1elu0an3rb'
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
SET "references" = $b9q6$[{"label": "StatPearls. Polymyositis. Idiopathic inflammatory myopathies constitute a heterogeneous group of autoimmune disorders characterized by chronic muscle inflammation that leads to weakness and myalgia and by frequent involvement of other organs, including the joints, skin, and lungs. The IIMs comprise 5 major subtypes: polymyositis, dermatomyositis, immune-mediated necrotizing myositis (IMNM), inclusion body myositis (IBM), and antisynthetase syndrome (ASyS).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK563129/"}]$b9q6$::jsonb
WHERE id = 'cmr4ouqcj00m81y1efneq6bj1'
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
SET "references" = $b9q7$[{"label": "StatPearls. Rheumatoid Arthritis. Rheumatoid arthritis (RA) is a systemic autoimmune disease characterized by inflammatory arthritis and extra-articular involvement. It is a chronic inflammatory disorder caused in many cases by the interaction between genes and environmental factors, including tobacco, that primarily involves synovial joints.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK441999/"}]$b9q7$::jsonb
WHERE id = 'cmr4outo500nd1y1en7y5lb9d'
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
SET "references" = $b9q8$[{"label": "StatPearls. Systemic Lupus Erythematosus. Most patients with lupus have anti-nuclear antibodies (ANA).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK535405/"}]$b9q8$::jsonb
WHERE id = 'cmr4pz7nf00tc1y1eg59h9kzk'
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
SET "references" = $b9q9$[{"label": "StatPearls. Polymyositis. Idiopathic inflammatory myopathies constitute a heterogeneous group of autoimmune disorders characterized by chronic muscle inflammation that leads to weakness and myalgia and by frequent involvement of other organs, including the joints, skin, and lungs. The IIMs comprise 5 major subtypes: polymyositis, dermatomyositis, immune-mediated necrotizing myositis (IMNM), inclusion body myositis (IBM), and antisynthetase syndrome (ASyS).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK563129/"}]$b9q9$::jsonb
WHERE id = 'cmr88g5ne00dh1yw2n6usq6ea'
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
SET "references" = $b9q10$[{"label": "StatPearls. Glucose-6-Phosphate Dehydrogenase Deficiency. Inherited G6PD deficiency can therefore lead to acute hemolytic anemia during periods of increased oxidative stress.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK470315/"}]$b9q10$::jsonb
WHERE id = 'cmr8bfzmh00zd1yw2aihzlmmx'
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
SET "references" = $b9q11$[{"label": "StatPearls. Cholangitis. Acute cholangitis, also known as ascending cholangitis, is a life-threatening condition caused by an ascending bacterial infection of the biliary tree.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK558946/"}]$b9q11$::jsonb
WHERE id = 'cmrtffjjt000g1yx2dj7x4rvc'
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
SET "references" = $b9q12$[{"label": "StatPearls. Polymyositis. Idiopathic inflammatory myopathies constitute a heterogeneous group of autoimmune disorders characterized by chronic muscle inflammation that leads to weakness and myalgia and by frequent involvement of other organs, including the joints, skin, and lungs. The IIMs comprise 5 major subtypes: polymyositis, dermatomyositis, immune-mediated necrotizing myositis (IMNM), inclusion body myositis (IBM), and antisynthetase syndrome (ASyS).", "url": "https://www.ncbi.nlm.nih.gov/books/NBK563129/"}]$b9q12$::jsonb
WHERE id = 'cmrtfrrdd000y1yx2krp6eg52'
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
SET "references" = $b9q13$[{"label": "StatPearls. Rheumatoid Arthritis. Rheumatoid arthritis (RA) is a systemic autoimmune disease characterized by inflammatory arthritis and extra-articular involvement. It is a chronic inflammatory disorder caused in many cases by the interaction between genes and environmental factors, including tobacco, that primarily involves synovial joints.", "url": "https://www.ncbi.nlm.nih.gov/books/NBK441999/"}]$b9q13$::jsonb
WHERE id = 'cmrtqg0eo000n1yx324tyofvc'
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
  JOIN qbi_usmle_refs_s12b9_20261121_stage s ON s.id = q.id
  WHERE q."references" = s."references";
  IF k <> 14 THEN
    RAISE EXCEPTION 'updated % rows, expected 14', k;
  END IF;
END
$verify$;
COMMIT;

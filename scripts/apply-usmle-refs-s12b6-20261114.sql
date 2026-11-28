-- Batch 6. NCI, Merck, and an open-access PMC sentence, each checked against the key. 14 rows.
-- Backup qbi_usmle_refs_s12b6_20261114_backup. Only references are updated.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12b6-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s12b6_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmpnjgv7x001g1ymxv1tadxpu',
    'cmq0g7j1y003r1y4fdkx9d6li',
    'cmqd1mz4e00ba1ychegqmr0n0',
    'cmr4ouq9n00m71y1ex2i4gnjz',
    'cmr8by2ie012i1yw22proiw5q',
    'cmra6lz1k0039ic04hrqik0pt',
    'cmrr4t11u000a1y6prqmtj17p',
    'cmrrbwa9x000gl104xrf7b41x',
    'cmrrt9lf6000p1y8wuqyd85wp',
    'cmrsewbcg000v1y55qfwcsddx',
    'cmrtffjv4000k1yx2rcfxytzr',
    'cmrtfrrab000x1yx2xwdmcmw8',
    'cmru6qxsc001ll104gd06juce',
    'cmrvm5yei000ujw040dexibqi'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b6_20261114_backup) <> 14 THEN
    RAISE EXCEPTION 'backup row count %, expected 14', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b6_20261114_backup);
  END IF;
  IF EXISTS (SELECT 1 FROM qbi_usmle_refs_s12b6_20261114_backup WHERE "fieldId" NOT IN ('usmle-step-1','usmle-step-2')) THEN
    RAISE EXCEPTION 'backup includes a row outside Step 1 and Step 2';
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $b6j0$[{"label": "Merck Manual Professional. Acute pancreatitis. Pancreatitis is acute inflammation caused by inappropriate release of pancreatic enzymes resulting in autodigestive injury to the gland itself.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$b6j0$::jsonb
WHERE id = 'cmpnjgv7x001g1ymxv1tadxpu'
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
SET "references" = $b6j1$[{"label": "Merck Manual Professional. Acute pancreatitis. Pancreatitis is acute inflammation caused by inappropriate release of pancreatic enzymes resulting in autodigestive injury to the gland itself.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$b6j1$::jsonb
WHERE id = 'cmq0g7j1y003r1y4fdkx9d6li'
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
SET "references" = $b6j2$[{"label": "NCI PDQ. Small cell lung cancer treatment. Nearly all SCLC are immunoreactive for keratin, thyroid transcription factor 1, and epithelial membrane antigen. Neuroendocrine and neural differentiation result in the expression of dopa decarboxylase, calcitonin, neuron-specific enolase, chromogranin A, CD56.", "url": "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq"}]$b6j2$::jsonb
WHERE id = 'cmqd1mz4e00ba1ychegqmr0n0'
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
SET "references" = $b6j3$[{"label": "Merck Manual Professional. Osteoporosis. Skeletal fragility leads to fractures with minor or inapparent trauma, particularly in the thoracic and lumbar spine, wrist, and hip (called fragility fractures).", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/osteoporosis/osteoporosis"}]$b6j3$::jsonb
WHERE id = 'cmr4ouq9n00m71y1ex2i4gnjz'
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
SET "references" = $b6j4$[{"label": "Merck Manual Professional. Osteoporosis. Skeletal fragility leads to fractures with minor or inapparent trauma, particularly in the thoracic and lumbar spine, wrist, and hip (called fragility fractures).", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/osteoporosis/osteoporosis"}]$b6j4$::jsonb
WHERE id = 'cmr8by2ie012i1yw22proiw5q'
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
SET "references" = $b6j5$[{"label": "NCI PDQ. Small cell lung cancer treatment. Nearly all SCLC are immunoreactive for keratin, thyroid transcription factor 1, and epithelial membrane antigen. Neuroendocrine and neural differentiation result in the expression of dopa decarboxylase, calcitonin, neuron-specific enolase, chromogranin A, CD56.", "url": "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq"}]$b6j5$::jsonb
WHERE id = 'cmra6lz1k0039ic04hrqik0pt'
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
SET "references" = $b6j6$[{"label": "Merck Manual Professional. Acute pancreatitis. Pancreatitis is acute inflammation caused by inappropriate release of pancreatic enzymes resulting in autodigestive injury to the gland itself.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$b6j6$::jsonb
WHERE id = 'cmrr4t11u000a1y6prqmtj17p'
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
SET "references" = $b6j7$[{"label": "NCI PDQ. Small cell lung cancer treatment. Nearly all SCLC are immunoreactive for keratin, thyroid transcription factor 1, and epithelial membrane antigen. Neuroendocrine and neural differentiation result in the expression of dopa decarboxylase, calcitonin, neuron-specific enolase, chromogranin A, CD56.", "url": "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq"}]$b6j7$::jsonb
WHERE id = 'cmrrbwa9x000gl104xrf7b41x'
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
SET "references" = $b6j8$[{"label": "PMC13594530. Methotrexate inhibits dihydrofolate reductase and prevents DNA synthesis. Methotrexate inhibits dihydrofolate reductase and prevents DNA synthesis, while also disrupting adenosine and guanine metabolism", "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC13594530/"}]$b6j8$::jsonb
WHERE id = 'cmrrt9lf6000p1y8wuqyd85wp'
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
SET "references" = $b6j9$[{"label": "Merck Manual Professional. Acute pancreatitis. Pancreatitis is acute inflammation caused by inappropriate release of pancreatic enzymes resulting in autodigestive injury to the gland itself.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$b6j9$::jsonb
WHERE id = 'cmrsewbcg000v1y55qfwcsddx'
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
SET "references" = $b6j10$[{"label": "Merck Manual Professional. Acute pancreatitis. Pancreatitis is acute inflammation caused by inappropriate release of pancreatic enzymes resulting in autodigestive injury to the gland itself.", "url": "https://www.merckmanuals.com/professional/gastrointestinal-disorders/pancreatitis/acute-pancreatitis"}]$b6j10$::jsonb
WHERE id = 'cmrtffjv4000k1yx2rcfxytzr'
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
SET "references" = $b6j11$[{"label": "Merck Manual Professional. Osteoporosis. Skeletal fragility leads to fractures with minor or inapparent trauma, particularly in the thoracic and lumbar spine, wrist, and hip (called fragility fractures).", "url": "https://www.merckmanuals.com/professional/musculoskeletal-and-connective-tissue-disorders/osteoporosis/osteoporosis"}]$b6j11$::jsonb
WHERE id = 'cmrtfrrab000x1yx2xwdmcmw8'
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
SET "references" = $b6j12$[{"label": "NCI PDQ. Small cell lung cancer treatment. Nearly all SCLC are immunoreactive for keratin, thyroid transcription factor 1, and epithelial membrane antigen. Neuroendocrine and neural differentiation result in the expression of dopa decarboxylase, calcitonin, neuron-specific enolase, chromogranin A, CD56.", "url": "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq"}]$b6j12$::jsonb
WHERE id = 'cmru6qxsc001ll104gd06juce'
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
SET "references" = $b6j13$[{"label": "NCI PDQ. Small cell lung cancer treatment. Nearly all SCLC are immunoreactive for keratin, thyroid transcription factor 1, and epithelial membrane antigen. Neuroendocrine and neural differentiation result in the expression of dopa decarboxylase, calcitonin, neuron-specific enolase, chromogranin A, CD56.", "url": "https://www.cancer.gov/types/lung/hp/small-cell-lung-treatment-pdq"}]$b6j13$::jsonb
WHERE id = 'cmrvm5yei000ujw040dexibqi'
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
    JOIN qbi_usmle_refs_s12b6_20261114_backup b ON b.id = q.id
    WHERE q."references" IS NOT DISTINCT FROM b."references"
  ) THEN
    RAISE EXCEPTION 'at least one row was not updated';
  END IF;
END
$verify$;
COMMIT;

-- Merck Manual Professional citations, batch 5, served USMLE Step 1 and Step 2, 2026-11-14.
-- Backup qbi_usmle_refs_s12b5_20261114_backup (32 rows). Only the references column is updated.
-- Each sentence was read from the fetched page and matches that item's key.
-- Undo: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-refs-s12b5-20261114.sql
BEGIN;
CREATE TABLE qbi_usmle_refs_s12b5_20261114_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    'cmr8by2ua012m1yw2oyoxzzig',
    'cmrpwci97004c1yrtr47t3ju5',
    'cmrr4ybbv002h1y6pnzcxl8c9',
    'cmrrt9sw4000u1y8wbh65n8br',
    'cmrrtm63n004k1y8w931dvall',
    'plt2f1726a89827460d3369b8df',
    'cmqiy33sw000p1yug4nv1ug9p',
    'cmr4gwj5x00131ydetm020iom',
    'cmr4iy68500gg1ydeb8t4gmgy',
    'cmr4j8pks00ke1yder17ksxya',
    'cmr4kil8200sm1yde3o3wxtu7',
    'cmr85sxt100121yr9glel6tn0',
    'cmr85syzh001e1yr9fu4jkui9',
    'cmr86y9mh009t1yr9t3cc2u0t',
    'cmr877j2f00d91yr9tsayt9ik',
    'cmr886g5h00nz1yr9g1roe4lm',
    'cmr89lx4n010u1yr9y0wv9gnb',
    'cmr89vb11012z1yr9vsbg3akw',
    'cmr8abe2r016g1yr913r0gvpq',
    'cmra6lukq0019ic046te6klg5',
    'cmra6lzic003vic045vg3w06m',
    'cmra6lzyj0049ic04psryj293',
    'cmrrbw61g0006l104qgwt529e',
    'cmrrw4yjc00ge1yl8qay5ggxn',
    'cmrsrb2jy001bl404u34judyn',
    'cmrtf2oef000q1y300bpv7zvf',
    'cmrtprxq3000i1yqc6xy0obc2',
    'cmrtq0v28001o1yqcpt7mbpau',
    'cmru6qyyv002rl104ccm52bcu',
    'cmrvm5uo50009jw04ncfhqvp6',
    'cmrvm5z8f001qjw04324mx2jh',
    'cmtpwleg4000o1y6hlijg3bcy'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_refs_s12b5_20261114_backup) <> 32 THEN
    RAISE EXCEPTION 'backup row count %, expected 32', (SELECT COUNT(*) FROM qbi_usmle_refs_s12b5_20261114_backup);
  END IF;
  IF EXISTS (SELECT 1 FROM qbi_usmle_refs_s12b5_20261114_backup WHERE "fieldId" NOT IN ('usmle-step-1','usmle-step-2')) THEN
    RAISE EXCEPTION 'backup includes a row outside Step 1 and Step 2';
  END IF;
END
$check$;
UPDATE "QuestionBankItem"
SET "references" = $b5j0$[{"label": "Merck Manual Professional. Choledocholithiasis and cholangitis. Suspect acute cholangitis (a surgical emergency) in patients with abdominal pain, jaundice, and fever or chills.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/choledocholithiasis-and-cholangitis"}]$b5j0$::jsonb
WHERE id = 'cmr8by2ua012m1yw2oyoxzzig'
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
SET "references" = $b5j1$[{"label": "Merck Manual Professional. Choledocholithiasis and cholangitis. Suspect acute cholangitis (a surgical emergency) in patients with abdominal pain, jaundice, and fever or chills.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/choledocholithiasis-and-cholangitis"}]$b5j1$::jsonb
WHERE id = 'cmrpwci97004c1yrtr47t3ju5'
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
SET "references" = $b5j2$[{"label": "Merck Manual Professional. Choledocholithiasis and cholangitis. Suspect acute cholangitis (a surgical emergency) in patients with abdominal pain, jaundice, and fever or chills.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/choledocholithiasis-and-cholangitis"}]$b5j2$::jsonb
WHERE id = 'cmrr4ybbv002h1y6pnzcxl8c9'
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
SET "references" = $b5j3$[{"label": "Merck Manual Professional. Choledocholithiasis and cholangitis. Suspect acute cholangitis (a surgical emergency) in patients with abdominal pain, jaundice, and fever or chills.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/choledocholithiasis-and-cholangitis"}]$b5j3$::jsonb
WHERE id = 'cmrrt9sw4000u1y8wbh65n8br'
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
SET "references" = $b5j4$[{"label": "Merck Manual Professional. Asthma. It is a heterogenous disease and usually characterized by chronic airway inflammation and hyperresponsiveness", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j4$::jsonb
WHERE id = 'cmrrtm63n004k1y8w931dvall'
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
SET "references" = $b5j5$[{"label": "Merck Manual Professional. Acetaminophen poisoning. Treatment is with N - acetylcysteine to prevent or minimize hepatotoxicity.", "url": "https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/acetaminophen-poisoning"}]$b5j5$::jsonb
WHERE id = 'plt2f1726a89827460d3369b8df'
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
SET "references" = $b5j6$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j6$::jsonb
WHERE id = 'cmqiy33sw000p1yug4nv1ug9p'
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
SET "references" = $b5j7$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j7$::jsonb
WHERE id = 'cmr4gwj5x00131ydetm020iom'
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
SET "references" = $b5j8$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j8$::jsonb
WHERE id = 'cmr4iy68500gg1ydeb8t4gmgy'
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
SET "references" = $b5j9$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j9$::jsonb
WHERE id = 'cmr4j8pks00ke1yder17ksxya'
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
SET "references" = $b5j10$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j10$::jsonb
WHERE id = 'cmr4kil8200sm1yde3o3wxtu7'
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
SET "references" = $b5j11$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j11$::jsonb
WHERE id = 'cmr85sxt100121yr9glel6tn0'
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
SET "references" = $b5j12$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j12$::jsonb
WHERE id = 'cmr85syzh001e1yr9fu4jkui9'
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
SET "references" = $b5j13$[{"label": "Merck Manual Professional. Choledocholithiasis and cholangitis. Suspect acute cholangitis (a surgical emergency) in patients with abdominal pain, jaundice, and fever or chills.", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/choledocholithiasis-and-cholangitis"}]$b5j13$::jsonb
WHERE id = 'cmr86y9mh009t1yr9t3cc2u0t'
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
SET "references" = $b5j14$[{"label": "Merck Manual Professional. Heart failure. The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide , torsemide , bumetanide ) in either oral or intravenous form.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$b5j14$::jsonb
WHERE id = 'cmr877j2f00d91yr9tsayt9ik'
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
SET "references" = $b5j15$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j15$::jsonb
WHERE id = 'cmr886g5h00nz1yr9g1roe4lm'
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
SET "references" = $b5j16$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j16$::jsonb
WHERE id = 'cmr89lx4n010u1yr9y0wv9gnb'
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
SET "references" = $b5j17$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j17$::jsonb
WHERE id = 'cmr89vb11012z1yr9vsbg3akw'
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
SET "references" = $b5j18$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j18$::jsonb
WHERE id = 'cmr8abe2r016g1yr913r0gvpq'
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
SET "references" = $b5j19$[{"label": "Merck Manual Professional. Asthma. It is a heterogenous disease and usually characterized by chronic airway inflammation and hyperresponsiveness", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j19$::jsonb
WHERE id = 'cmra6lukq0019ic046te6klg5'
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
SET "references" = $b5j20$[{"label": "Merck Manual Professional. Subarachnoid hemorrhage. Diagnosis is by CT or MRI; if neuroimaging is normal, diagnosis is by cerebrospinal fluid analysis to look for xanthochromia and red blood cells.", "url": "https://www.merckmanuals.com/professional/neurologic-disorders/stroke/subarachnoid-hemorrhage"}]$b5j20$::jsonb
WHERE id = 'cmra6lzic003vic045vg3w06m'
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
SET "references" = $b5j21$[{"label": "Merck Manual Professional. Spontaneous abortion. Diagnosis is by pelvic examination, measurement of beta subunit of human chorionic gonadotropin , and ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/spontaneous-abortion"}]$b5j21$::jsonb
WHERE id = 'cmra6lzyj0049ic04psryj293'
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
SET "references" = $b5j22$[{"label": "Merck Manual Professional. Asthma. It is a heterogenous disease and usually characterized by chronic airway inflammation and hyperresponsiveness", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j22$::jsonb
WHERE id = 'cmrrbw61g0006l104qgwt529e'
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
SET "references" = $b5j23$[{"label": "Merck Manual Professional. Heart failure. The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide , torsemide , bumetanide ) in either oral or intravenous form.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$b5j23$::jsonb
WHERE id = 'cmrrw4yjc00ge1yl8qay5ggxn'
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
SET "references" = $b5j24$[{"label": "Merck Manual Professional. Spontaneous abortion. Diagnosis is by pelvic examination, measurement of beta subunit of human chorionic gonadotropin , and ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/spontaneous-abortion"}]$b5j24$::jsonb
WHERE id = 'cmrsrb2jy001bl404u34judyn'
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
SET "references" = $b5j25$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j25$::jsonb
WHERE id = 'cmrtf2oef000q1y300bpv7zvf'
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
SET "references" = $b5j26$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j26$::jsonb
WHERE id = 'cmrtprxq3000i1yqc6xy0obc2'
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
SET "references" = $b5j27$[{"label": "Merck Manual Professional. Asthma. Treatment involves controlling triggering factors and pharmacotherapy, most commonly with inhaled beta-2 agonists and inhaled glucocorticoids.", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j27$::jsonb
WHERE id = 'cmrtq0v28001o1yqcpt7mbpau'
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
SET "references" = $b5j28$[{"label": "Merck Manual Professional. Spontaneous abortion. Diagnosis is by pelvic examination, measurement of beta subunit of human chorionic gonadotropin , and ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/spontaneous-abortion"}]$b5j28$::jsonb
WHERE id = 'cmru6qyyv002rl104ccm52bcu'
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
SET "references" = $b5j29$[{"label": "Merck Manual Professional. Asthma. It is a heterogenous disease and usually characterized by chronic airway inflammation and hyperresponsiveness", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/asthma-and-related-disorders/asthma"}]$b5j29$::jsonb
WHERE id = 'cmrvm5uo50009jw04ncfhqvp6'
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
SET "references" = $b5j30$[{"label": "Merck Manual Professional. Spontaneous abortion. Diagnosis is by pelvic examination, measurement of beta subunit of human chorionic gonadotropin , and ultrasonography.", "url": "https://www.merckmanuals.com/professional/gynecology-and-obstetrics/early-pregnancy-disorders/spontaneous-abortion"}]$b5j30$::jsonb
WHERE id = 'cmrvm5z8f001qjw04324mx2jh'
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
SET "references" = $b5j31$[{"label": "Merck Manual Professional. Heart failure. The mainstay of the pharmacologic management of acute heart failure is decongestive therapy with diuretics, namely loop diuretics (eg, furosemide , torsemide , bumetanide ) in either oral or intravenous form.", "url": "https://www.merckmanuals.com/professional/cardiovascular-disorders/heart-failure/heart-failure-hf"}]$b5j31$::jsonb
WHERE id = 'cmtpwleg4000o1y6hlijg3bcy'
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
    JOIN qbi_usmle_refs_s12b5_20261114_backup b ON b.id = q.id
    WHERE q."references" IS NOT DISTINCT FROM b."references"
  ) THEN
    RAISE EXCEPTION 'at least one row was not updated';
  END IF;
END
$verify$;
COMMIT;

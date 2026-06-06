-- USMLE 2025–2026 quality seeds (88 items: v2 + step3 v3)
-- Regenerate: npx tsx scripts/generate-usmle-quality-sql.mjs

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'pathology',
  4,
  'pathology',
  'usmle-clinical-reasoning',
  'vignette',
  'step1',
  'Autopsy | 67 y/o man | Sudden death | History of smoking | Lung mass biopsy: small blue cells, keratin+, chromogranin+',
  'Most likely diagnosis?',
  '{"stepLevel":"step1","blueprintSystem":"pathology","kind":"vignette","options":["Small cell lung carcinoma","Squamous cell carcinoma","Adenocarcinoma","Mesothelioma"]}',
  'Small cell lung carcinoma',
  'Small cell CA shows neuroendocrine markers (chromogranin) and responds to chemo; central location common in smokers.',
  '["usmle","v2","USMLE-2026","step1","clinical-vignette"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '48aa7024fe5a37f8bde0da2d1b7eb64a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'mcq',
  'step1',
  NULL,
  'A researcher blocks HMG-CoA reductase in hepatocytes. Which downstream effect is expected?',
  '{"stepLevel":"step1","blueprintSystem":"pharmacology","kind":"mcq","options":["Decreased de novo cholesterol synthesis","Increased bile acid excretion only","Immediate LDL receptor downregulation","Increased hepatic VLDL secretion"]}',
  'Decreased de novo cholesterol synthesis',
  'Statins inhibit the rate-limiting step of cholesterol synthesis, triggering compensatory LDL receptor upregulation.',
  '["usmle","v2","USMLE-2026","step1"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  'd8c10fda184ae3825b9a93498f4cf063',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'microbiology',
  4,
  'microbiology',
  'usmle-clinical-reasoning',
  'vignette',
  'step1',
  'Micro lab | Gram-negative diplococci from CSF of febrile college student in dorm outbreak',
  'Empiric coverage must include treatment for:',
  '{"stepLevel":"step1","blueprintSystem":"microbiology","kind":"vignette","options":["Neisseria meningitidis","Staphylococcus epidermidis","Candida albicans","Mycobacterium tuberculosis"]}',
  'Neisseria meningitidis',
  'Neisseria meningitidis is a classic cause of meningococcemia/meningitis in young adults; ceftriaxone + dexamethasone per protocol.',
  '["usmle","v2","USMLE-2026","step1","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '80c707ee63d50b240d082c43e6646400',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'biochemistry',
  3,
  'biochemistry',
  'usmle-clinical-reasoning',
  'mcq',
  'step1',
  NULL,
  'A child has fasting hypoglycemia, hepatomegaly, and deficient glucose-6-phosphatase activity.',
  '{"stepLevel":"step1","blueprintSystem":"biochemistry","kind":"mcq","options":["Von Gierke disease (GSD I)","Pompe disease","McArdle disease","Tay-Sachs disease"]}',
  'Von Gierke disease (GSD I)',
  'G6Pase deficiency impairs gluconeogenesis/glycogenolysis → severe fasting hypoglycemia and lactic acidosis.',
  '["usmle","v2","USMLE-2026","step1"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  'cffbc5feee670f073acaa190c07262de',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'physiology',
  4,
  'physiology',
  'usmle-clinical-reasoning',
  'vignette',
  'step1',
  'Experiment | Efferent arteriole of glomerulus constricted in animal model',
  'Glomerular filtration rate will:',
  '{"stepLevel":"step1","blueprintSystem":"physiology","kind":"vignette","options":["Decrease due to reduced glomerular hydrostatic pressure","Increase due to decreased oncotic pressure only","Remain unchanged","Increase due to increased renal blood flow"]}',
  'Decrease due to reduced glomerular hydrostatic pressure',
  'Efferent constriction reduces GFR despite possible filtration fraction changes; afferent vs efferent effects are high-yield.',
  '["usmle","v2","USMLE-2026","step1","clinical-vignette"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '1a3209c9b838a7dcdce03aa86ef9c90a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'anatomy',
  3,
  'anatomy',
  'usmle-clinical-reasoning',
  'mcq',
  'step1',
  NULL,
  'A lesion compressing the lateral femoral cutaneous nerve at the inguinal ligament causes:',
  '{"stepLevel":"step1","blueprintSystem":"anatomy","kind":"mcq","options":["Meralgia paresthetica (anterolateral thigh numbness)","Foot drop","Loss of ankle reflex","Medial thigh adductor weakness"]}',
  'Meralgia paresthetica (anterolateral thigh numbness)',
  'LFCN entrapment → sensory symptoms over lateral thigh without motor deficit.',
  '["usmle","v2","USMLE-2026","step1"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '1a875bb98672fc2dde3053cbc072758e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'pathology',
  4,
  'pathology',
  'usmle-clinical-reasoning',
  'vignette',
  'step1',
  'Renal biopsy | Crescentic glomerulonephritis | Linear IgG on immunofluorescence',
  'Most likely underlying process?',
  '{"stepLevel":"step1","blueprintSystem":"pathology","kind":"vignette","options":["Anti-GBM disease (Goodpasture)","Granular immune complex deposition","Amyloidosis","Minimal change disease"]}',
  'Anti-GBM disease (Goodpasture)',
  'Linear IF pattern suggests anti-GBM antibodies; often presents with rapidly progressive GN ± pulmonary hemorrhage.',
  '["usmle","v2","USMLE-2026","step1","clinical-vignette"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '253731a2b143c8290bec195ec468ca87',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'mcq',
  'step1',
  NULL,
  'Organophosphate poisoning causes accumulation of acetylcholine primarily by inhibiting:',
  '{"stepLevel":"step1","blueprintSystem":"pharmacology","kind":"mcq","options":["Acetylcholinesterase at synapses","Monoamine oxidase","Cyclooxygenase","Xanthine oxidase"]}',
  'Acetylcholinesterase at synapses',
  'SLUDGE symptoms and fasciculations result from AChE inhibition; treat with atropine + pralidoxime.',
  '["usmle","v2","USMLE-2026","step1"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '053765e673c9c61036b7aeab1890dae3',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'microbiology',
  4,
  'microbiology',
  'usmle-clinical-reasoning',
  'vignette',
  'step1',
  'HIV+ patient | CD4 120 | Retinal exam: cotton-wool spots and hemorrhages',
  'Most likely opportunistic infection to evaluate for:',
  '{"stepLevel":"step1","blueprintSystem":"microbiology","kind":"vignette","options":["CMV retinitis","Toxoplasma brain abscess only","Cryptococcus meningitis only","HSV keratitis"]}',
  'CMV retinitis',
  'CMV retinitis occurs at low CD4 counts; presents with floaters and characteristic retinal findings.',
  '["usmle","v2","USMLE-2026","step1","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'fa609fcfb5d1207548fd5d1ee89f55ac',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'physiology',
  3,
  'physiology',
  'usmle-clinical-reasoning',
  'exhibit',
  'step1',
  'PFT review | 45 y/o smoker | Progressive dyspnea',
  'Pattern is most consistent with:',
  '{"stepLevel":"step1","blueprintSystem":"respiratory","kind":"exhibit","table":{"headers":["Parameter","Value","Predicted"],"rows":[["FEV1","1.8 L","3.2 L"],["FVC","4.1 L","4.3 L"],["FEV1/FVC","44%",">70%"]]},"options":["COPD (obstructive pattern)","Restrictive lung disease","Normal spirometry","Neuromuscular weakness pattern only"]}',
  'COPD (obstructive pattern)',
  'Reduced FEV1/FVC with preserved-ish FVC indicates obstructive physiology (COPD/emphysema).',
  '["usmle","v2","USMLE-2026","step1","chart-table"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '39c6a63ff2f36ec403c8e4d5439733d7',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'biostats',
  'step1',
  'Study compares new screening test | Results below',
  'Sensitivity of the test is:',
  '{"stepLevel":"step1","blueprintSystem":"biostatistics","kind":"biostats","table":{"headers":["","Disease+","Disease−"],"rows":[["Test+","40","10"],["Test−","10","140"]]},"options":["80%","75%","60%","50%"]}',
  '80%',
  'Sensitivity = TP/(TP+FN) = 40/(40+10) = 80%.',
  '["usmle","v2","USMLE-2026","step1","biostats","epidemiology"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '90974373753df7c3c2920e764ab521a9',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'biochemistry',
  3,
  'biochemistry',
  'usmle-clinical-reasoning',
  'mcq',
  'step1',
  NULL,
  'Urea cycle defect most commonly presents in neonates with:',
  '{"stepLevel":"step1","blueprintSystem":"biochemistry","kind":"mcq","options":["Hyperammonemia and neurologic deterioration","Hypoglycemia only without encephalopathy","Hypercalcemia","Ketonuria without acidosis"]}',
  'Hyperammonemia and neurologic deterioration',
  'Ammonia accumulation causes cerebral edema; ornithine transcarbamylase deficiency is classic X-linked defect.',
  '["usmle","v2","USMLE-2026","step1"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  'fc6a92a14d551e28aede0b1e5e71f9dd',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'pathology',
  4,
  'pathology',
  'usmle-clinical-reasoning',
  'vignette',
  'step1',
  'Bone marrow | 70 y/o | Pancytopenia | Hypocellular marrow with fat replacement',
  'Diagnosis?',
  '{"stepLevel":"step1","blueprintSystem":"pathology","kind":"vignette","options":["Aplastic anemia","Acute myeloid leukemia","Multiple myeloma","Iron deficiency anemia"]}',
  'Aplastic anemia',
  'Pancytopenia with hypocellular marrow suggests marrow failure; exclude drugs, viruses, and constitutional causes.',
  '["usmle","v2","USMLE-2026","step1","clinical-vignette"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '65db11048e533aba7a5b1cdb3b1563d6',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'physiology',
  3,
  'physiology',
  'usmle-clinical-reasoning',
  'mcq',
  'step1',
  NULL,
  'Primary stimulus for ADH release in hyperosmolar states is:',
  '{"stepLevel":"step1","blueprintSystem":"physiology","kind":"mcq","options":["Increased plasma osmolality sensed by osmoreceptors","Decreased blood volume only","Increased atrial natriuretic peptide","Hypokalemia"]}',
  'Increased plasma osmolality sensed by osmoreceptors',
  'Osmoreceptors in hypothalamus trigger ADH; volume sensors modulate response at lower threshold.',
  '["usmle","v2","USMLE-2026","step1"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '40190e0bddeb782feb846bdc8183d82c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'pharmacology',
  4,
  'pharmacology',
  'usmle-clinical-reasoning',
  'vignette',
  'step1',
  'Patient on isoniazid develops peripheral neuropathy.',
  'Mechanism-based prevention includes:',
  '{"stepLevel":"step1","blueprintSystem":"pharmacology","kind":"vignette","options":["Pyridoxine (vitamin B6) supplementation","Folic acid only","Vitamin K","Calcium carbonate"]}',
  'Pyridoxine (vitamin B6) supplementation',
  'INH depletes B6, causing neuropathy; pyridoxine co-administration prevents deficiency.',
  '["usmle","v2","USMLE-2026","step1","clinical-vignette"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '70faca4c968414b94a83df1a154b827f',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'microbiology',
  3,
  'microbiology',
  'usmle-clinical-reasoning',
  'mcq',
  'step1',
  NULL,
  'Exotoxin that increases cAMP by ADP-ribosylation of Gs protein:',
  '{"stepLevel":"step1","blueprintSystem":"microbiology","kind":"mcq","options":["Cholera toxin","Lipid A endotoxin","Streptolysin O","Coagulase"]}',
  'Cholera toxin',
  'Cholera toxin permanently activates Gs → ↑cAMP → secretory diarrhea.',
  '["usmle","v2","USMLE-2026","step1"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  'b62394cc87016d230214b4fc2d4a3ef7',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'ethics',
  3,
  'ethics',
  'usmle-ethics',
  'ethics',
  'step1',
  'Competent adult Jehovah''s Witness with life-threatening hemorrhage refuses transfusion after informed discussion.',
  'Appropriate physician action?',
  '{"stepLevel":"step1","kind":"ethics","options":["Respect informed refusal; document and optimize non-blood alternatives","Transfuse immediately against wishes","Obtain routine court order in all cases","Sedate patient and transfuse"]}',
  'Respect informed refusal; document and optimize non-blood alternatives',
  'Autonomy prevails for capacitated adults; ensure understanding and offer cell-saver/erythropoietin where appropriate.',
  '["usmle","v2","USMLE-2026","step1","ethics","professionalism"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'aa0f449fd1141820159d1184795ce984',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-1',
  'anatomy',
  4,
  'anatomy',
  'usmle-clinical-reasoning',
  'vignette',
  'step1',
  'Facial trauma | Inability to close right eye | Forehead wrinkling intact on both sides',
  'Lesion localization?',
  '{"stepLevel":"step1","blueprintSystem":"anatomy","kind":"vignette","options":["Right facial nerve (peripheral VII palsy)","Left cortical lesion only","Trigeminal nerve V1","Oculomotor nerve"]}',
  'Right facial nerve (peripheral VII palsy)',
  'Peripheral CN VII affects entire ipsilateral face including forehead; central lesions spare forehead due to bilateral innervation.',
  '["usmle","v2","USMLE-2026","step1","clinical-vignette"]',
  '[{"label":"First Aid for the USMLE — high-yield concept"}]'::jsonb,
  'seed',
  '8781a984a932fc79f4338696393ae59d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'pediatrics',
  4,
  'pediatrics',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'Peds ED | 3 y/o | Barking cough, stridor at rest | Low-grade fever | No drooling',
  'First-line management?',
  '{"stepLevel":"step2","blueprintSystem":"pediatrics","kind":"vignette","options":["Dexamethasone ± nebulized epinephrine if moderate-severe","Immediate intubation without trial of steroids","Antibiotics for epiglottitis routinely","Chest CT before any therapy"]}',
  'Dexamethasone ± nebulized epinephrine if moderate-severe',
  'Croup (laryngotracheitis) treated with steroids; epinephrine for worsening stridor.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '8b92d26b5fb18f0cfd43197187b02364',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'nephrology',
  4,
  'nephrology',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'Clinic | 28 y/o woman | Edema, proteinuria 4.2 g/day | Fatigue | ANA negative',
  'Most likely diagnosis?',
  '{"stepLevel":"step2","blueprintSystem":"nephrology","kind":"vignette","options":["Minimal change disease","IgA nephropathy","Post-streptococcal GN","Renal artery stenosis"]}',
  'Minimal change disease',
  'Nephrotic-range proteinuria in young adult with bland urine sediment suggests minimal change (common in children/young adults).',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'bd519c7b390f196e4ac53dc8e7a5b292',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'psychiatry',
  4,
  'psychiatry',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  '22 y/o college student | 5 days no sleep, pressured speech, grandiosity, risky spending | No prior episodes',
  'Most appropriate initial pharmacotherapy?',
  '{"stepLevel":"step2","blueprintSystem":"psychiatry","kind":"vignette","options":["Second-generation antipsychotic (± mood stabilizer per presentation)","SSRI monotherapy","Benzodiazepine monotherapy long-term","Stimulant augmentation"]}',
  'Second-generation antipsychotic (± mood stabilizer per presentation)',
  'Acute mania requires antipsychotic or mood stabilizer; SSRIs alone may worsen mania.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '185c84654c2c4727c53f516ec222eca6',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'emergency-medicine',
  4,
  'emergency-medicine',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'Trauma bay | Penetrating abdominal wound | BP 80/50 | HR 130 | Abdomen rigid',
  'Next step?',
  '{"stepLevel":"step2","blueprintSystem":"emergency-medicine","kind":"vignette","options":["Emergent operative exploration / damage control surgery","CT abdomen with contrast before any intervention","Discharge if FAST negative only","Oral fluids and observation"]}',
  'Emergent operative exploration / damage control surgery',
  'Unstable penetrating trauma with peritoneal signs warrants laparotomy without delaying for CT.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'd0638b7b5980fcd07b06e8cf4c08c31b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'internal-medicine',
  3,
  'internal-medicine',
  'usmle-clinical-reasoning',
  'exhibit',
  'step2',
  'Ward | Fever day 3 post-op cholecystectomy',
  'Most likely source?',
  '{"stepLevel":"step2","blueprintSystem":"surgery","kind":"exhibit","table":{"headers":["WBC","Temp","UA","CXR","Incision"],"rows":[["14.2k","38.6°C","Negative","Clear","Erythema/tenderness at RUQ site"],["Trend","Rising","—","—","—"]]},"options":["Surgical site infection","Catheter-associated UTI","Hospital-acquired pneumonia","C. difficile colitis"]}',
  'Surgical site infection',
  'Localized incision findings with post-op fever point to wound infection over remote sources.',
  '["usmle","v2","USMLE-2026","step2","chart-table"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '3cd12b0cb6dafcd15aae599baf07641e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'neurology',
  4,
  'neurology',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'Sudden worst headache | Neck stiffness | CT head negative',
  'Next step?',
  '{"stepLevel":"step2","blueprintSystem":"neurology","kind":"vignette","options":["Lumbar puncture to evaluate for subarachnoid hemorrhage","Discharge with reassurance","Carotid Doppler only","EEG"]}',
  'Lumbar puncture to evaluate for subarachnoid hemorrhage',
  'Thunderclap headache with negative CT still requires LP (xanthochromia/RBC) to exclude SAH early after bleed.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '9d78d121f284052931b0db2c0a56b639',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'cardiology',
  4,
  'cardiology',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  '65 y/o | HFrEF | On GDMT | New dry cough on ACE inhibitor | No angioedema',
  'Best adjustment?',
  '{"stepLevel":"step2","blueprintSystem":"cardiovascular","kind":"vignette","options":["Switch ACE inhibitor to ARB if cough limits therapy","Stop all neurohormonal blockade","Add thiazolidinedione","Increase ACE inhibitor dose for cough tolerance"]}',
  'Switch ACE inhibitor to ARB if cough limits therapy',
  'ACEi cough is class effect; ARB maintains RAAS blockade without bradykinin-mediated cough.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '758d8dbf1cc465220ff5816d5e37d76c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'internal-medicine',
  4,
  'internal-medicine',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'Nursing home | 84 y/o | Acute confusion, fever | UA: nitrite+, leukocyte esterase+',
  'Empiric treatment should cover:',
  '{"stepLevel":"step2","blueprintSystem":"infectious-disease","kind":"vignette","options":["E. coli and other common uropathogens (oral or IV based on severity)","MRSA pneumonia routinely","Antifungal for candiduria always","Antiviral for HSV encephalitis only"]}',
  'E. coli and other common uropathogens (oral or IV based on severity)',
  'Catheter-associated or complicated UTI in elderly requires antibiotics guided by severity and local resistance.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'ed67f69e4052f72c5cf9cdf06513a5f6',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'ethics',
  3,
  'ethics',
  'usmle-ethics',
  'ethics',
  'step2',
  'Adolescent requests STI treatment but asks that parents not be informed. State allows mature minor confidentiality.',
  'Best approach?',
  '{"stepLevel":"step2","kind":"ethics","options":["Treat per mature minor laws; encourage voluntary parental involvement","Mandatory parental notification always","Refuse care without parental consent in all cases","Discuss with parents first without patient permission"]}',
  'Treat per mature minor laws; encourage voluntary parental involvement',
  'Many jurisdictions permit confidential adolescent STI care; balance autonomy, public health, and safety.',
  '["usmle","v2","USMLE-2026","step2","ethics","professionalism"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '72ccda86db670f5450993ff4a7f8f2a8',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'obgyn',
  4,
  'obgyn',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  '36 wk GA | BP 158/96 | Proteinuria 2+ | Headache | RUQ tenderness',
  'Diagnosis and immediate concern?',
  '{"stepLevel":"step2","blueprintSystem":"obgyn","kind":"vignette","options":["Preeclampsia with severe features — risk of eclampsia/HELLP","Physiologic pregnancy changes only","Gestational thrombocytopenia alone","Placenta previa"]}',
  'Preeclampsia with severe features — risk of eclampsia/HELLP',
  'Severe-range BP with symptoms meets severe preeclampsia; magnesium and delivery planning indicated.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'a85322559969586ea52761bd74c258ac',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'biostats',
  'step2',
  'RCT reports relative risk of outcome 0.6 (95% CI 0.4–0.9) with intervention vs placebo',
  'Best interpretation?',
  '{"stepLevel":"step2","blueprintSystem":"biostatistics","kind":"biostats","options":["40% relative risk reduction; statistically significant at α=0.05","60% absolute risk reduction guaranteed","No effect because RR < 1","Study proves causation without confounding assessment"]}',
  '40% relative risk reduction; statistically significant at α=0.05',
  'RR 0.6 → 40% relative reduction; CI excludes 1 → significant. Absolute risk reduction requires event rates.',
  '["usmle","v2","USMLE-2026","step2","biostats","epidemiology"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'ae01f4b381c14344bec23c770f8d6163',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'pulmonology',
  4,
  'pulmonology',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'Asthma | Partial response to albuterol | Peak flow 55% personal best | Speaking in sentences',
  'Next step in management?',
  '{"stepLevel":"step2","blueprintSystem":"respiratory","kind":"vignette","options":["Systemic corticosteroids and continued bronchodilator therapy","Discharge without steroids","Immediate intubation without trial of medical therapy","Antibiotic monotherapy"]}',
  'Systemic corticosteroids and continued bronchodilator therapy',
  'Moderate-severe exacerbation requires systemic steroids plus repeated SABA; monitor for deterioration.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '374f0a7f75517cef2e8f906558539d66',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'internal-medicine',
  4,
  'internal-medicine',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'Long-term PPI user | Chronic diarrhea | Recent antibiotics | LLQ cramping',
  'Most likely diagnosis?',
  '{"stepLevel":"step2","blueprintSystem":"gastrointestinal","kind":"vignette","options":["C. difficile colitis","Ulcerative colitis flare only","Irritable bowel syndrome","Celiac disease"]}',
  'C. difficile colitis',
  'Antibiotic-associated diarrhea with PPI use (risk factor) suggests C. diff; test stool toxin/PCR.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '7085ac4b220ac57f81d1f515cdf35e8d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'nephrology',
  3,
  'nephrology',
  'usmle-clinical-reasoning',
  'exhibit',
  'step2',
  'ED electrolytes review',
  'Primary disturbance?',
  '{"stepLevel":"step2","blueprintSystem":"nephrology","kind":"exhibit","table":{"headers":["Na+","K+","Cl−","HCO3−","pH"],"rows":[["138","6.1","102","18","7.28"]]},"options":["High anion gap metabolic acidosis with hyperkalemia","Metabolic alkalosis","Respiratory alkalosis","Normal acid-base status"]}',
  'High anion gap metabolic acidosis with hyperkalemia',
  'Low pH and HCO3 with elevated K+ suggest AG metabolic acidosis (e.g., renal failure, toxins) with hyperkalemia.',
  '["usmle","v2","USMLE-2026","step2","chart-table"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'baf4d4da21aaca41b56ec979fed9370b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'pediatrics',
  4,
  'pediatrics',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  '6 wk infant | Non-bilious projectile vomiting | Palpable olive in epigastrium | Hypochloremic metabolic alkalosis',
  'Diagnosis?',
  '{"stepLevel":"step2","blueprintSystem":"pediatrics","kind":"vignette","options":["Pyloric stenosis","Intussusception","Necrotizing enterocolitis","Hirschsprung disease"]}',
  'Pyloric stenosis',
  'Classic triad: projectile vomiting, olive mass, hypochloremic metabolic alkalosis; ultrasound confirms.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '7a3bf0cc9aae78b0e50258d0ae0abd0b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'emergency-medicine',
  4,
  'emergency-medicine',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'Anaphylaxis after bee sting | Urticaria, wheeze, hypotension',
  'Immediate treatment?',
  '{"stepLevel":"step2","blueprintSystem":"emergency-medicine","kind":"vignette","options":["Intramuscular epinephrine in anterolateral thigh","Oral diphenhydramine alone","IV antibiotics","Observation without epinephrine"]}',
  'Intramuscular epinephrine in anterolateral thigh',
  'Anaphylaxis first-line is IM epinephrine; adjuncts include fluids, albuterol, antihistamines, steroids.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '378522f6b96e2f81ac788794b91e18cc',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'ethics',
  3,
  'ethics',
  'usmle-ethics',
  'ethics',
  'step2',
  'Medical student documents medication error that did not reach patient (near miss).',
  'Appropriate action?',
  '{"stepLevel":"step2","kind":"ethics","options":["Report through institutional safety system; debrief with team","Hide error to avoid disciplinary action","Blame nurse publicly on ward","Document in patient chart as patient harm event"]}',
  'Report through institutional safety system; debrief with team',
  'Near-miss reporting drives systems improvement; non-punitive culture improves safety.',
  '["usmle","v2","USMLE-2026","step2","ethics","professionalism"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'ab890f3a1aeb2c3718e8a79e594d7ac0',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'neurology',
  4,
  'neurology',
  'usmle-clinical-reasoning',
  'vignette',
  'step2',
  'MS patient | Acute unilateral vision loss | Pain with eye movement | Afferent pupillary defect',
  'Diagnosis?',
  '{"stepLevel":"step2","blueprintSystem":"neurology","kind":"vignette","options":["Optic neuritis","Retinal detachment","Glaucoma","Cataract"]}',
  'Optic neuritis',
  'Painful monocular vision loss with RAPD is classic optic neuritis; evaluate for demyelinating disease.',
  '["usmle","v2","USMLE-2026","step2","clinical-vignette"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'c01d58b56bb5cfc789306bb51e46893c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'abstract',
  'step3',
  NULL,
  'Which statement is most accurate?',
  '{"stepLevel":"step3","blueprintSystem":"biostatistics","kind":"abstract","abstract":{"title":"SGLT2 inhibitors and heart failure hospitalizations (randomized trial)","source":"N Engl J Med — multicenter, double-blind, placebo-controlled","body":"Background: SGLT2i reduce HF events in T2DM. Methods: 4,500 patients with HFrEF randomized to empagliflozin vs placebo; primary endpoint time-to-first HF hospitalization or CV death. Results: HR 0.75 (95% CI 0.65–0.86), p<0.001. Withdrawals balanced. Conclusion: Empagliflozin lowered composite HF/CV outcomes vs placebo."},"options":["Randomization helps balance measured and unmeasured confounders at baseline","Double-blind design eliminates selection bias in enrollment","Statistical significance proves the drug is clinically mandatory in all patients","Placebo group prevents lead-time bias in all trial designs"]}',
  'Randomization helps balance measured and unmeasured confounders at baseline',
  'Randomization distributes confounders; blinding reduces performance/detection bias but doesn''t fix volunteer bias.',
  '["usmle","v2","USMLE-2026","step3","abstract"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '5adbbf65812514396665b38e0ac9ce29',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'internal-medicine',
  3,
  'internal-medicine',
  'usmle-biostats',
  'abstract',
  'step3',
  NULL,
  'Greatest threat to validity?',
  '{"stepLevel":"step3","blueprintSystem":"epidemiology","kind":"abstract","abstract":{"title":"Vitamin D supplementation and fall prevention in elderly nursing home residents","source":"JAMA Internal Medicine — prospective cohort","body":"Design: Observational cohort of 2,100 nursing home residents followed 2 years. Exposure: self-reported vitamin D use. Outcome: falls per patient-year. Findings: Higher vitamin D use associated with fewer falls (RR 0.85) after adjusting for age, mobility, and calcium intake. Limitation: residual confounding by functional status."},"options":["Confounding by indication / functional status","Lack of double-blinding in RCT sense","Random measurement error only","Lead-time bias"]}',
  'Confounding by indication / functional status',
  'Observational designs risk confounding — healthier patients may take supplements and fall less.',
  '["usmle","v2","USMLE-2026","step3","abstract"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '89efe9274d295ee62681e6cfc32a77cf',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  'A 70-year-old with NVAF and prior GI bleed on PPI asks to start this medication. Most important counseling?',
  '{"stepLevel":"step3","blueprintSystem":"pharmacology","kind":"drug_ad","ad":{"drug":"Rivaroxaban 20 mg tablets","headline":"Oral factor Xa inhibitor for stroke prevention in nonvalvular atrial fibrillation","indications":"Reduce risk of stroke/systemic embolism in NVAF; treat DVT/PE","warnings":"BLACK BOX: discontinuation increases thrombotic risk. Avoid in active pathological bleeding. Not for prosthetic heart valves."},"options":["Discuss bleeding vs stroke reduction; avoid in active bleed; renal dosing at lower CrCl","Safe with any active ulcer without monitoring","Combine with aspirin routinely for all patients","Stop immediately if once-daily dose missed without clinician input"]}',
  'Discuss bleeding vs stroke reduction; avoid in active bleed; renal dosing at lower CrCl',
  'DOAC counseling weighs thrombotic benefit against rebleeding; dose adjustments apply in renal dysfunction.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'fe70354be8c24b065160b8e3e30b629c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  'Patient with MEN2 mutation history should:',
  '{"stepLevel":"step3","blueprintSystem":"endocrine","kind":"drug_ad","ad":{"drug":"Liraglutide (GLP-1 RA)","headline":"Adjunct to diet and exercise for glycemic control in T2DM","indications":"Improve glycemic control; CV risk reduction in established CVD","warnings":"Contraindicated in personal/family history of medullary thyroid carcinoma or MEN2. Risk of pancreatitis."},"options":["Avoid this medication class","Double the starting dose","Use with metformin only without endocrine referral","Ignore boxed warning if A1c elevated"]}',
  'Avoid this medication class',
  'GLP-1 RAs carry thyroid C-cell tumor warning — contraindicated in MEN2/medullary thyroid cancer history.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '5c486d14e9e2f535a36bc6354a2a5b55',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  'Patient planning pregnancy in 2 months on low-dose weekly methotrexate for RA. Best plan?',
  '{"stepLevel":"step3","blueprintSystem":"rheumatology","kind":"drug_ad","ad":{"drug":"Methotrexate (weekly)","headline":"DMARD for rheumatoid arthritis and psoriasis","indications":"RA, psoriasis, some oncologic uses","warnings":"Hepatotoxicity, myelosuppression, teratogenic — pregnancy contraindicated. Folic acid supplementation recommended."},"options":["Stop methotrexate now; switch to pregnancy-compatible regimen per rheumatology","Continue through conception","Add leflunomide without washout","Stop folic acid to improve efficacy"]}',
  'Stop methotrexate now; switch to pregnancy-compatible regimen per rheumatology',
  'Methotrexate is teratogenic; discontinue before conception with appropriate washout and alternative therapy.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'b7f3f8bfb0d00d787bb90e8c5ee3a341',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'biostats',
  'step3',
  'Screening trial: prevalence 10%, test sensitivity 90%, specificity 90% in 1,000 patients',
  'How many false positives are expected approximately?',
  '{"stepLevel":"step3","blueprintSystem":"biostatistics","kind":"biostats","options":["90","81","10","100"]}',
  '90',
  'Without disease: 900 patients. False positive rate = 1 − specificity = 10% → ~90 false positives.',
  '["usmle","v2","USMLE-2026","step3","biostats","epidemiology"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'd1d4d351d89717e0bb8b6186d857f3fb',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'biostats',
  'step3',
  'Case-control study of esophageal cancer finds OR 4.2 (95% CI 2.1–8.0) for tobacco use',
  'Interpretation?',
  '{"stepLevel":"step3","kind":"biostats","options":["Tobacco associated with ~4× odds of disease in this study population","Tobacco causes 420% absolute risk increase","RR equals OR without question","CI includes 1 — not significant"]}',
  'Tobacco associated with ~4× odds of disease in this study population',
  'OR approximates RR for rare outcomes; CI excludes 1 → significant association.',
  '["usmle","v2","USMLE-2026","step3","biostats","epidemiology"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '083c2e8565551b0b882dc3d1f00cf671',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'ethics',
  3,
  'ethics',
  'usmle-ethics',
  'ethics',
  'step3',
  'Intoxicated trauma patient needs emergent surgery; lacks capacity; no reachable surrogate.',
  'Consent approach?',
  '{"stepLevel":"step3","kind":"ethics","options":["Proceed under implied/emergency exception; re-consent when capacitated","Delay surgery until sober regardless of hemodynamics","Require written spouse consent always","Discharge AMA if no paperwork"]}',
  'Proceed under implied/emergency exception; re-consent when capacitated',
  'Life-threatening emergencies permit treatment without explicit consent when incapacitated and surrogate unavailable.',
  '["usmle","v2","USMLE-2026","step3","ethics","professionalism"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '1abb194d6d6b50f1ec15dbcad3c8ae7a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'internal-medicine',
  5,
  'internal-medicine',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Inpatient medicine — Day 1 simulation
68 y/o man admitted with fever, hypotension, lactate 3.8 after UTI symptoms
Vitals: T 39.1°C, BP 86/52, HR 118, RR 22, SpO2 94%
0 min — evaluate sepsis bundle',
  'Highest priority order set?',
  '{"stepLevel":"step3","blueprintSystem":"critical-care","kind":"ccs_prompt","caseData":{"setting":"Inpatient medicine — Day 1 simulation","presentation":"68 y/o man admitted with fever, hypotension, lactate 3.8 after UTI symptoms","vitals":"T 39.1°C, BP 86/52, HR 118, RR 22, SpO2 94%","timeline":"0 min — evaluate sepsis bundle"},"options":["30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, monitor lactate","Oral fluids and discharge","MRI brain before fluids","Elective cardiac cath"]}',
  '30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, monitor lactate',
  'Septic shock requires early fluids, cultures, antibiotics, and reassessment — CMS/SSC sepsis bundle principles.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '4423b2bd585a77121adb386f7c134ffb',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pulmonology',
  5,
  'pulmonology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Ambulatory CCS — Day 2
45 y/o with asthma, worsening wheeze, using SABA hourly, awakened nightly ×3
Vitals: SpO2 93% RA, RR 20, speaking sentences
Office visit — adjust controller therapy',
  'Best management plan?',
  '{"stepLevel":"step3","blueprintSystem":"respiratory","kind":"ccs_prompt","caseData":{"setting":"Ambulatory CCS — Day 2","presentation":"45 y/o with asthma, worsening wheeze, using SABA hourly, awakened nightly ×3","vitals":"SpO2 93% RA, RR 20, speaking sentences","timeline":"Office visit — adjust controller therapy"},"options":["Add/increase inhaled corticosteroid; provide action plan; oral steroid if severe exacerbation","SABA alone indefinitely","Stop all inhalers","Antibiotic for all asthma flares"]}',
  'Add/increase inhaled corticosteroid; provide action plan; oral steroid if severe exacerbation',
  'Poorly controlled asthma requires controller escalation per NHLBI/NAEPP step therapy.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '93a55a1d2bb552b1aca5942a50051641',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'internal-medicine',
  5,
  'internal-medicine',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Hospital day 2 CCS
Post-op hip repair, fever 38.4, productive cough, SpO2 90% RA
Vitals: HR 104, BP 118/70
Develop hypoxemia — evaluate respiratory source',
  'Next best step?',
  '{"stepLevel":"step3","blueprintSystem":"surgery","kind":"ccs_prompt","caseData":{"setting":"Hospital day 2 CCS","presentation":"Post-op hip repair, fever 38.4, productive cough, SpO2 90% RA","vitals":"HR 104, BP 118/70","timeline":"Develop hypoxemia — evaluate respiratory source"},"options":["Chest imaging, incentive spirometry, culture-guided antibiotics if pneumonia","Immediate discharge","Prophylactic anticoagulation only without pulmonary workup","Ignore fever <48h always"]}',
  'Chest imaging, incentive spirometry, culture-guided antibiotics if pneumonia',
  'Post-op fever with hypoxemia warrants pulmonary evaluation — atelectasis vs pneumonia.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'ecefdee7cb580bce367a8675f839ebbd',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'cardiology',
  5,
  'cardiology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Outpatient CCS — anticoagulation bridge
72 y/o with NVAF on warfarin needs elective cholecystectomy in 5 days
Vitals: INR 2.8 today, stable hemodynamics
Perioperative anticoagulation planning',
  'Appropriate plan?',
  '{"stepLevel":"step3","blueprintSystem":"cardiovascular","kind":"ccs_prompt","caseData":{"setting":"Outpatient CCS — anticoagulation bridge","presentation":"72 y/o with NVAF on warfarin needs elective cholecystectomy in 5 days","vitals":"INR 2.8 today, stable hemodynamics","timeline":"Perioperative anticoagulation planning"},"options":["Hold warfarin ~5 days pre-op; bridge with LMWH only if high thrombotic risk per guidelines","Continue warfarin through surgery without holding","Switch to aspirin only","Stop all anticoagulation permanently"]}',
  'Hold warfarin ~5 days pre-op; bridge with LMWH only if high thrombotic risk per guidelines',
  'Perioperative bridging individualized by stroke risk and bleeding; routine bridging not needed for all.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '4fa738b402d4a546f9981e7f9402f91d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'pulmonology',
  4,
  'pulmonology',
  'usmle-clinical-reasoning',
  'sequential',
  'step2',
  'ER | 58 y/o woman | Sudden dyspnea & pleuritic chest pain | Smoker | HR 112 | RR 24 | SpO2 91% RA | Clear lungs | Unilateral leg swelling',
  'Most likely diagnosis?',
  '{"stepLevel":"step2","blueprintSystem":"respiratory","kind":"sequential","setId":"seq-pe-01","stepIndex":1,"totalSteps":2,"options":["Pulmonary embolism","Community-acquired pneumonia","Spontaneous pneumothorax","Acute asthma exacerbation"]}',
  'Pulmonary embolism',
  'Sudden dyspnea with pleuritic pain, tachycardia, hypoxemia, and leg swelling suggest PE; clear lungs argue against pneumonia.',
  '["usmle","v2","USMLE-2026","step2","sequential-item-set"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'b4ea16b01d5334c3f0a4a2ab6380a1e7',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'pulmonology',
  4,
  'pulmonology',
  'usmle-clinical-reasoning',
  'sequential',
  'step2',
  'ER | 58 y/o woman | Sudden dyspnea & pleuritic chest pain | Smoker | HR 112 | RR 24 | SpO2 91% RA | Clear lungs | Unilateral leg swelling',
  'Best next diagnostic step?',
  '{"stepLevel":"step2","blueprintSystem":"respiratory","kind":"sequential","setId":"seq-pe-01","stepIndex":2,"totalSteps":2,"options":["CT pulmonary angiography (or V/Q if contrast contraindicated)","Immediate broad-spectrum antibiotics","High-dose inhaled bronchodilator trial only","Elective coronary angiography"]}',
  'CT pulmonary angiography (or V/Q if contrast contraindicated)',
  'When PE is likely and bleeding risk acceptable, CTPA confirms diagnosis and guides anticoagulation.',
  '["usmle","v2","USMLE-2026","step2","sequential-item-set"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '840918e63953f9fa6f571136704c6080',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'internal-medicine',
  4,
  'internal-medicine',
  'usmle-clinical-reasoning',
  'sequential',
  'step2',
  'ED | 22 y/o man | T1DM | Nausea, polyuria, Kussmaul breathing | BG 486 mg/dL | pH 7.18 | HCO3 8 mEq/L | Anion gap elevated',
  'Primary acid-base diagnosis?',
  '{"stepLevel":"step2","blueprintSystem":"endocrine","kind":"sequential","setId":"seq-dka-01","stepIndex":1,"totalSteps":2,"options":["High anion gap metabolic acidosis","Metabolic alkalosis","Respiratory acidosis only","Normal anion gap metabolic acidosis"]}',
  'High anion gap metabolic acidosis',
  'DKA presents with hyperglycemia, ketosis, and elevated anion gap metabolic acidosis.',
  '["usmle","v2","USMLE-2026","step2","sequential-item-set"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '479207ab65894e36a24b972bafcc7dc8',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'internal-medicine',
  4,
  'internal-medicine',
  'usmle-clinical-reasoning',
  'sequential',
  'step2',
  'ED | 22 y/o man | T1DM | Nausea, polyuria, Kussmaul breathing | BG 486 mg/dL | pH 7.18 | HCO3 8 mEq/L | Anion gap elevated',
  'After initial IV fluids, critical immediate therapy includes:',
  '{"stepLevel":"step2","blueprintSystem":"endocrine","kind":"sequential","setId":"seq-dka-01","stepIndex":2,"totalSteps":2,"options":["IV insulin infusion with potassium monitoring","Subcutaneous insulin glargine only","Oral metformin load","Sodium bicarbonate for all patients regardless of pH"]}',
  'IV insulin infusion with potassium monitoring',
  'DKA requires insulin drip after volume resuscitation; replete K+ before insulin if hypokalemic.',
  '["usmle","v2","USMLE-2026","step2","sequential-item-set"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'd7fc362a6877e27d5e93a311fec14138',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'obgyn',
  4,
  'obgyn',
  'usmle-clinical-reasoning',
  'sequential',
  'step2',
  'OB triage | 11 wk pregnant | Heavy vaginal bleeding, cramping | Hgb 9.8 g/dL | Closed cervix on exam',
  'Most likely diagnosis?',
  '{"stepLevel":"step2","blueprintSystem":"obgyn","kind":"sequential","setId":"seq-ob-bleed-01","stepIndex":1,"totalSteps":2,"options":["Threatened abortion","Incomplete abortion","Ectopic pregnancy","Placenta previa"]}',
  'Threatened abortion',
  'First-trimester bleeding with closed cervix and ongoing pregnancy symptoms fits threatened abortion.',
  '["usmle","v2","USMLE-2026","step2","sequential-item-set"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '3c67ed5b7ae8f62b4d178cba96f664bf',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'obgyn',
  4,
  'obgyn',
  'usmle-clinical-reasoning',
  'sequential',
  'step2',
  'OB triage | 11 wk pregnant | Heavy vaginal bleeding, cramping | Hgb 9.8 g/dL | Closed cervix on exam',
  'Next best step?',
  '{"stepLevel":"step2","blueprintSystem":"obgyn","kind":"sequential","setId":"seq-ob-bleed-01","stepIndex":2,"totalSteps":2,"options":["Transvaginal ultrasound and serial β-hCG","Immediate dilation and curettage","MRI pelvis before any ultrasound","Expectant management without evaluation"]}',
  'Transvaginal ultrasound and serial β-hCG',
  'Ultrasound confirms intrauterine viability; β-hCG trend helps exclude ectopic.',
  '["usmle","v2","USMLE-2026","step2","sequential-item-set"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  '6e0ad681cf4c2ceef1a0daecd2f7dd36',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'cardiology',
  4,
  'cardiology',
  'usmle-clinical-reasoning',
  'sequential',
  'step2',
  'Clinic | 54 y/o man | Exertional chest pressure radiating to jaw | HTN, hyperlipidemia | ECG: 1 mm ST depression V4–V6',
  'Most appropriate initial classification?',
  '{"stepLevel":"step2","blueprintSystem":"cardiovascular","kind":"sequential","setId":"seq-chest-pain-01","stepIndex":1,"totalSteps":2,"options":["Unstable angina / NSTEMI pathway","Stable angina only — discharge home","Benign early repolarization","Pericarditis"]}',
  'Unstable angina / NSTEMI pathway',
  'New exertional angina with ischemic ECG changes warrants ACS evaluation.',
  '["usmle","v2","USMLE-2026","step2","sequential-item-set"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'dd30df5b1dae5411a9aefd5260000b26',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-2',
  'cardiology',
  4,
  'cardiology',
  'usmle-clinical-reasoning',
  'sequential',
  'step2',
  'Clinic | 54 y/o man | Exertional chest pressure radiating to jaw | HTN, hyperlipidemia | ECG: 1 mm ST depression V4–V6',
  'Along with aspirin and anticoagulation per protocol, add:',
  '{"stepLevel":"step2","blueprintSystem":"cardiovascular","kind":"sequential","setId":"seq-chest-pain-01","stepIndex":2,"totalSteps":2,"options":["Anti-ischemic therapy (e.g., nitroglycerin, beta-blocker if no contraindication) and troponin serial testing","Routine thrombolysis without contraindication assessment","Immediate stress test before any biomarkers","Observation only without troponins"]}',
  'Anti-ischemic therapy (e.g., nitroglycerin, beta-blocker if no contraindication) and troponin serial testing',
  'NSTEMI/unstable angina pathway includes anti-ischemics, anticoagulation, and troponin monitoring.',
  '["usmle","v2","USMLE-2026","step2","sequential-item-set"]',
  '[{"label":"USMLE Content Outline / NBME-style vignette standards"}]'::jsonb,
  'seed',
  'c4610b6e79dba2aa329c91a8aee138f3',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'abstract',
  'step3',
  NULL,
  'Most accurate interpretation?',
  '{"stepLevel":"step3","blueprintSystem":"biostatistics","kind":"abstract","abstract":{"title":"Non-inferiority trial of direct oral anticoagulant vs warfarin in AF","source":"Lancet — randomized, open-label, non-inferiority design","body":"Primary hypothesis: DOAC is non-inferior to warfarin for stroke prevention (margin Δ=1.5% absolute). Result: event rate 1.2% vs 1.4%; upper bound of 95% CI for difference = 0.9% (< margin). Secondary superiority endpoint p=0.42. Conclusion: Non-inferiority met; superiority not demonstrated."},"options":["Non-inferiority demonstrated; superiority claim not supported","Superiority of DOAC proven because primary p<0.05","Trial proves DOAC is always safer than warfarin","Open-label design eliminates performance bias entirely"]}',
  'Non-inferiority demonstrated; superiority claim not supported',
  'Non-inferiority uses a prespecified margin; meeting it does not imply superiority.',
  '["usmle","v2","USMLE-2026","step3","abstract","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '25a20c56d9998f2dd2b30f025ba3dbc3',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'abstract',
  'step3',
  NULL,
  'Greatest concern when applying this meta-analysis?',
  '{"stepLevel":"step3","blueprintSystem":"epidemiology","kind":"abstract","abstract":{"title":"Meta-analysis of statins and all-cause mortality after MI","source":"Cochrane review — 18 RCTs, n=45,000","body":"Pooled RR 0.88 (95% CI 0.82–0.94) for mortality. Heterogeneity I²=42%. Funnel plot asymmetry noted; small-study effects suspected. Sensitivity analysis excluding open-label trials: RR 0.91 (0.84–0.99)."},"options":["Publication bias and small-study effects may inflate benefit","I²=42% proves all studies are invalid","Pooled RR below 1 proves causation in every subgroup","Cochrane reviews never include open-label trials"]}',
  'Publication bias and small-study effects may inflate benefit',
  'Funnel asymmetry raises suspicion of missing negative trials; interpret pooled estimates cautiously.',
  '["usmle","v2","USMLE-2026","step3","abstract","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '781a1df71b7fe5ab597960ebfc408cbd',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'abstract',
  'step3',
  NULL,
  'What can this trial appropriately support?',
  '{"stepLevel":"step3","kind":"abstract","abstract":{"title":"Phase I dose-escalation study of novel oncology agent","source":"JCO — 3+3 design, n=24, advanced solid tumors","body":"Primary endpoint: dose-limiting toxicity in cycle 1. MTD defined at cohort receiving 200 mg with 2/6 DLTs. No tumor response endpoints powered. Pharmacokinetics linear across cohorts."},"options":["Selection of MTD for subsequent phase II efficacy studies","Definitive proof of survival benefit vs standard care","Immediate FDA approval for first-line use","Generalizability to all tumor types without further study"]}',
  'Selection of MTD for subsequent phase II efficacy studies',
  'Phase I establishes safety and dosing; efficacy requires later-phase trials.',
  '["usmle","v2","USMLE-2026","step3","abstract","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '07c3418a40fef4d8b11c94046e1ff010',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'internal-medicine',
  3,
  'internal-medicine',
  'usmle-biostats',
  'abstract',
  'step3',
  NULL,
  'Compared with a case-control study of the same exposure, this design primarily reduces:',
  '{"stepLevel":"step3","blueprintSystem":"epidemiology","kind":"abstract","abstract":{"title":"Prospective cohort: BMI and incident diabetes over 10 years","source":"Ann Intern Med — n=8,200 adults without diabetes at baseline","body":"Adjusted HR for diabetes per 5 kg/m² BMI increase = 1.65 (95% CI 1.48–1.84). Competing risk of death handled with subdistribution hazards. Limitation: single baseline BMI measurement."},"options":["Recall bias regarding exposure","Need for any confounding control","Incidence measurement entirely","Ethics board review"]}',
  'Recall bias regarding exposure',
  'Prospective cohorts ascertain exposure before outcome, reducing recall bias common in retrospective designs.',
  '["usmle","v2","USMLE-2026","step3","abstract","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '28d06f46682eff3a038f27920822e5c3',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'abstract',
  'step3',
  NULL,
  'If carryover had been significant, best analytic approach?',
  '{"stepLevel":"step3","blueprintSystem":"biostatistics","kind":"abstract","abstract":{"title":"Crossover RCT of two antihypertensives with washout period","source":"Hypertension — randomized, double-blind, two-period crossover","body":"Each patient receives drug A then B (randomized order) with 4-week washout. Primary outcome: mean 24h ambulatory BP. Carryover effect tested and not significant. Period effect p=0.03."},"options":["Use first-period data only or parallel design; crossover assumptions violated","Ignore and pool both periods regardless","Report only the second period for all patients","Switch to case-control analysis"]}',
  'Use first-period data only or parallel design; crossover assumptions violated',
  'Significant carryover violates washout assumptions — first-period or parallel designs are preferred.',
  '["usmle","v2","USMLE-2026","step3","abstract","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '27bf1f45ee6bc0f6ad377b0e3960e508',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'biostatistics',
  3,
  'biostatistics',
  'usmle-biostats',
  'abstract',
  'step3',
  NULL,
  'Which analysis best preserves randomization benefits for policy decisions?',
  '{"stepLevel":"step3","kind":"abstract","abstract":{"title":"Intention-to-treat vs per-protocol analysis in smoking cessation trial","source":"NEJM — n=1,100 randomized to counseling + varenicline vs counseling alone","body":"ITT quit rate at 12 months: 28% vs 18% (p<0.01). Per-protocol (medication adherence >80%): 35% vs 19%. High crossover to open-label varenicline in control arm."},"options":["Intention-to-treat","Per-protocol only","As-treated excluding all crossovers","Post-hoc completers analysis"]}',
  'Intention-to-treat',
  'ITT reflects real-world effectiveness including non-adherence and crossover; per-protocol can exaggerate efficacy.',
  '["usmle","v2","USMLE-2026","step3","abstract","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '884f8c644927bac7fcb82556df1e6bc8',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  '28-year-old with mechanical mitral valve, INR 2.0, reports missed doses and wants to switch to a DOAC. Advice?',
  '{"stepLevel":"step3","blueprintSystem":"cardiovascular","kind":"drug_ad","ad":{"drug":"Warfarin sodium tablets","headline":"Vitamin K antagonist for thromboembolism prevention","indications":"AF, VTE treatment/prevention, mechanical heart valves (with aspirin in selected valves)","warnings":"BLACK BOX: bleeding risk. Contraindicated in pregnancy. Narrow therapeutic index — monitor INR."},"options":["Mechanical mitral valve requires warfarin; DOACs contraindicated — reinforce adherence and INR follow-up","Switch to rivaroxaban immediately","Stop anticoagulation until INR normalized","Add aspirin and stop warfarin"]}',
  'Mechanical mitral valve requires warfarin; DOACs contraindicated — reinforce adherence and INR follow-up',
  'Current guidelines mandate warfarin for most mechanical mitral valves; DOACs are not appropriate substitutes.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '227b1a085a63e0f83566e35443a67c4a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  'Patient started 3 months ago now has fatigue, weight gain, and TSH 12. Next step?',
  '{"stepLevel":"step3","blueprintSystem":"endocrine","kind":"drug_ad","ad":{"drug":"Amiodarone 200 mg tablets","headline":"Class III antiarrhythmic for recurrent ventricular arrhythmias and AF","indications":"Life-threatening ventricular arrhythmias; AF rhythm control when alternatives fail","warnings":"Pulmonary toxicity, hepatotoxicity, thyroid dysfunction, corneal deposits, QT prolongation. Baseline PFTs, LFTs, TSH recommended."},"options":["Evaluate amiodarone-induced hypothyroidism; consider dose change or alternative per cardiology","Increase amiodarone for better rhythm control","Ignore TSH if rhythm controlled","Start high-dose levothyroxine without stopping drug"]}',
  'Evaluate amiodarone-induced hypothyroidism; consider dose change or alternative per cardiology',
  'Amiodarone commonly affects thyroid function — monitor TSH and manage per endocrine/cardiology guidance.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'adf09bb462da5afd02058542a0b597f2',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  'Post-PCI patient on DAPT has recurrent stent thrombosis; genotyping shows CYP2C19 *2/*2. Best adjustment?',
  '{"stepLevel":"step3","blueprintSystem":"cardiovascular","kind":"drug_ad","ad":{"drug":"Clopidogrel 75 mg","headline":"P2Y12 inhibitor for ACS and post-stent antiplatelet therapy","indications":"Recent MI, stroke, PAD; dual antiplatelet with aspirin after PCI","warnings":"Reduced efficacy in CYP2C19 poor metabolizers. Increased bleeding with anticoagulants. TTP reported."},"options":["Switch to prasugrel or ticagrelor if no contraindications","Continue clopidogrel at double dose indefinitely without discussion","Stop all antiplatelet agents","Add warfarin and stop aspirin"]}',
  'Switch to prasugrel or ticagrelor if no contraindications',
  'Poor CYP2C19 metabolizers have reduced clopidogrel activation — consider alternative P2Y12 inhibitors.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'f43cc75b25f76b71e6904ed8804f5f74',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  'RA patient with positive QuantiFERON, no symptoms, needs biologic. Plan?',
  '{"stepLevel":"step3","blueprintSystem":"rheumatology","kind":"drug_ad","ad":{"drug":"Adalimumab (TNF-α inhibitor)","headline":"Biologic DMARD for moderate–severe rheumatoid arthritis","indications":"RA after methotrexate failure; psoriasis, IBD per labeling","warnings":"Serious infections including TB reactivation. Screen for latent TB and hepatitis B before starting. Malignancy risk discussed."},"options":["Treat latent TB per guidelines, then start biologic with infection monitoring","Start biologic immediately without TB therapy","Biologics contraindicated with any positive QuantiFERON","Use live vaccine booster same day as first injection"]}',
  'Treat latent TB per guidelines, then start biologic with infection monitoring',
  'TNF inhibitors require latent TB screening and treatment before initiation to reduce reactivation risk.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '77c6e9286fd7e35c280b0f13020754f3',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  '22-year-old woman with severe acne requests isotretinoin; wants pregnancy in 6 months. Counseling?',
  '{"stepLevel":"step3","blueprintSystem":"dermatology","kind":"drug_ad","ad":{"drug":"Isotretinoin capsules","headline":"Oral retinoid for severe recalcitrant nodular acne","indications":"Severe nodular acne unresponsive to systemic antibiotics and topical therapy","warnings":"iPLEDGE REMS: teratogenic — two forms of contraception required. Hypertriglyceridemia, mood symptoms, dry mucosa."},"options":["Delay pregnancy ≥1 month after course; enroll in iPLEDGE; monthly pregnancy tests","Start now; pregnancy safe after 2 weeks","No contraception needed if using barrier method only","Isotretinoin safe in all trimesters"]}',
  'Delay pregnancy ≥1 month after course; enroll in iPLEDGE; monthly pregnancy tests',
  'Isotretinoin is highly teratogenic — REMS program mandates contraception and pregnancy prevention counseling.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'fdebc05ff687bb9a04f4e1fd39091ac4',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pharmacology',
  3,
  'pharmacology',
  'usmle-clinical-reasoning',
  'drug_ad',
  'step3',
  NULL,
  '8 weeks pregnant on lisinopril for chronic HTN. Immediate action?',
  '{"stepLevel":"step3","blueprintSystem":"obstetrics","kind":"drug_ad","ad":{"drug":"Lisinopril 10 mg","headline":"ACE inhibitor for hypertension and HFrEF","indications":"HTN, HFrEF, post-MI LV dysfunction, diabetic nephropathy","warnings":"Contraindicated in pregnancy — fetal renal toxicity. Monitor K+ and creatinine. Angioedema risk."},"options":["Stop ACE inhibitor; switch to pregnancy-safe antihypertensive (e.g., labetalol, nifedipine XL) and OB referral","Continue — BP control paramount","Add ARB for synergy","Double dose until delivery"]}',
  'Stop ACE inhibitor; switch to pregnancy-safe antihypertensive (e.g., labetalol, nifedipine XL) and OB referral',
  'ACE inhibitors/ARBs are contraindicated in pregnancy due to fetal harm — substitute safe agents urgently.',
  '["usmle","v2","USMLE-2026","step3","pharm-ad","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '74ab2c2ff8829b1b5991999d27dbc456',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'cardiology',
  5,
  'cardiology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED CCS — chest pain
58 y/o man, 90 min crushing chest pain, ST elevation II, III, aVF; BP 98/60
Vitals: HR 52, RR 18, SpO2 97%
0 min — STEMI inferior wall; decide reperfusion strategy',
  'Best immediate management?',
  '{"stepLevel":"step3","blueprintSystem":"cardiovascular","kind":"ccs_prompt","caseData":{"setting":"ED CCS — chest pain","presentation":"58 y/o man, 90 min crushing chest pain, ST elevation II, III, aVF; BP 98/60","vitals":"HR 52, RR 18, SpO2 97%","timeline":"0 min — STEMI inferior wall; decide reperfusion strategy"},"options":["Activate PCI if <120 min door-to-balloon; otherwise fibrinolysis if no contraindication; aspirin, P2Y12, anticoagulation","Discharge with stress test in 4 weeks","IV beta-blocker bolus regardless of hemodynamics","Wait for troponin peak before any intervention"]}',
  'Activate PCI if <120 min door-to-balloon; otherwise fibrinolysis if no contraindication; aspirin, P2Y12, anticoagulation',
  'Inferior STEMI with bradycardia needs urgent reperfusion per ACC/AHA timelines and hemodynamic caution with beta-blockers.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'db15c4bcbbf7a6543ea833a484d9ffa1',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'endocrinology',
  5,
  'endocrinology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — hyperglycemia
32 y/o T1DM, vomiting, Kussmaul respirations, glucose 520, pH 7.18, K+ 5.8
Vitals: BP 102/64, HR 118
Suspected DKA — initiate protocol',
  'First hour priorities?',
  '{"stepLevel":"step3","blueprintSystem":"endocrine","kind":"ccs_prompt","caseData":{"setting":"ED — hyperglycemia","presentation":"32 y/o T1DM, vomiting, Kussmaul respirations, glucose 520, pH 7.18, K+ 5.8","vitals":"BP 102/64, HR 118","timeline":"Suspected DKA — initiate protocol"},"options":["IV fluids, insulin infusion after K+ confirmed >3.3, electrolyte monitoring, search trigger","Subcutaneous insulin only and oral rehydration","Immediate bicarbonate for all acidosis","Hold insulin until glucose <250"]}',
  'IV fluids, insulin infusion after K+ confirmed >3.3, electrolyte monitoring, search trigger',
  'DKA requires volume resuscitation and insulin with careful potassium management before insulin if K+ low.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '74dba564329b521c7440ffa8093db37d',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'neurology',
  5,
  'neurology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — acute neuro deficit
67 y/o woman, sudden right hemiparesis and aphasia; last known well 70 min ago; CT head normal
Vitals: BP 178/96, HR 88
Ischemic stroke evaluation — tPA window',
  'Next step if no contraindications?',
  '{"stepLevel":"step3","blueprintSystem":"neurology","kind":"ccs_prompt","caseData":{"setting":"ED — acute neuro deficit","presentation":"67 y/o woman, sudden right hemiparesis and aphasia; last known well 70 min ago; CT head normal","vitals":"BP 178/96, HR 88","timeline":"Ischemic stroke evaluation — tPA window"},"options":["IV alteplase if within 4.5 h and eligibility met; admit stroke unit; BP control per protocol","Aspirin only and discharge","Immediate carotid endarterectomy in ED","MRI before any treatment regardless of delay"]}',
  'IV alteplase if within 4.5 h and eligibility met; admit stroke unit; BP control per protocol',
  'Eligible acute ischemic stroke within window warrants thrombolysis after hemorrhage excluded on CT.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '73d6989c1072fae77fe54da9753f37cf',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'gastroenterology',
  5,
  'gastroenterology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Inpatient — GI bleed
54 y/o with melena, Hgb 7.2, BP 92/58 after 1 L crystalloid; anticoagulated for AF
Vitals: HR 112, RR 20
Unstable upper GI bleed — resuscitation phase',
  'Management sequence?',
  '{"stepLevel":"step3","blueprintSystem":"gastroenterology","kind":"ccs_prompt","caseData":{"setting":"Inpatient — GI bleed","presentation":"54 y/o with melena, Hgb 7.2, BP 92/58 after 1 L crystalloid; anticoagulated for AF","vitals":"HR 112, RR 20","timeline":"Unstable upper GI bleed — resuscitation phase"},"options":["Large-bore IV access, transfuse to Hgb ~7–8 if symptomatic, PPI IV, NPO, urgent GI consult/EGD; reverse anticoag if life-threatening","Oral iron and outpatient colonoscopy","Immediate discharge on PPI","Platelet transfusion for all anticoagulated patients routinely"]}',
  'Large-bore IV access, transfuse to Hgb ~7–8 if symptomatic, PPI IV, NPO, urgent GI consult/EGD; reverse anticoag if life-threatening',
  'Unstable GI bleed requires resuscitation, PPI, early endoscopy, and individualized anticoagulant reversal.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'b3d6132ee612b4b4a31b7e113209c9aa',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pulmonology',
  5,
  'pulmonology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — community-acquired pneumonia
71 y/o with fever, productive cough, RR 28, confusion; CURB-65 score 4
Vitals: BP 88/54, SpO2 89% RA
Severe CAP — disposition and antibiotics',
  'Best plan?',
  '{"stepLevel":"step3","blueprintSystem":"respiratory","kind":"ccs_prompt","caseData":{"setting":"ED — community-acquired pneumonia","presentation":"71 y/o with fever, productive cough, RR 28, confusion; CURB-65 score 4","vitals":"BP 88/54, SpO2 89% RA","timeline":"Severe CAP — disposition and antibiotics"},"options":["Admit/ICU consideration, empiric IV antibiotics per local guidelines, O2, cultures if severe","Oral azithromycin outpatient","Chest CT only without antibiotics","Observation at home with pulse ox"]}',
  'Admit/ICU consideration, empiric IV antibiotics per local guidelines, O2, cultures if severe',
  'High CURB-65 and hypoxemia indicate severe CAP requiring inpatient/ICU care and prompt antibiotics.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'af7ac1921fabe4e9d79250286f4619a3',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'surgery',
  5,
  'surgery',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — abdominal pain
19 y/o with RLQ pain, fever, WBC 15k, CT shows appendiceal dilation with periappendiceal fat stranding
Vitals: HR 102, BP 118/72
Acute appendicitis — surgical planning',
  'Next step?',
  '{"stepLevel":"step3","blueprintSystem":"surgery","kind":"ccs_prompt","caseData":{"setting":"ED — abdominal pain","presentation":"19 y/o with RLQ pain, fever, WBC 15k, CT shows appendiceal dilation with periappendiceal fat stranding","vitals":"HR 102, BP 118/72","timeline":"Acute appendicitis — surgical planning"},"options":["NPO, IV fluids, antibiotics, general surgery consult for appendectomy (laparoscopic preferred if uncomplicated)","Discharge on oral analgesics","Colonoscopy first","Observation for 2 weeks"]}',
  'NPO, IV fluids, antibiotics, general surgery consult for appendectomy (laparoscopic preferred if uncomplicated)',
  'Imaging-confirmed acute appendicitis warrants surgical evaluation and perioperative antibiotics.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '39a8fb6f7bda54149693b565add08289',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'obstetrics',
  5,
  'obstetrics',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — early pregnancy
26 y/o, 6 weeks GA by dates, pelvic pain, β-hCG 3,200, TVUS no IUP, adnexal mass with free fluid
Vitals: BP 110/70, HR 108
Suspected ectopic — stabilize and treat',
  'Management?',
  '{"stepLevel":"step3","blueprintSystem":"obstetrics","kind":"ccs_prompt","caseData":{"setting":"ED — early pregnancy","presentation":"26 y/o, 6 weeks GA by dates, pelvic pain, β-hCG 3,200, TVUS no IUP, adnexal mass with free fluid","vitals":"BP 110/70, HR 108","timeline":"Suspected ectopic — stabilize and treat"},"options":["Ob/Gyn consult; methotrexate if stable/unruptured criteria met, otherwise surgical management","Expectant management without follow-up","Dilation and curettage only","Discharge with repeat β-hCG in 4 weeks only"]}',
  'Ob/Gyn consult; methotrexate if stable/unruptured criteria met, otherwise surgical management',
  'Ectopic pregnancy requires specialist management — medical vs surgical based on stability and criteria.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '5019b7ed92411bc10710ceaee4227667',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'obstetrics',
  5,
  'obstetrics',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Urgent care — pelvic pain
22 y/o sexually active, fever, cervical motion tenderness, mucopurulent discharge
Vitals: T 38.3°C, HR 96
Suspected PID — treat and prevent sequelae',
  'Appropriate management?',
  '{"stepLevel":"step3","blueprintSystem":"obstetrics","kind":"ccs_prompt","caseData":{"setting":"Urgent care — pelvic pain","presentation":"22 y/o sexually active, fever, cervical motion tenderness, mucopurulent discharge","vitals":"T 38.3°C, HR 96","timeline":"Suspected PID — treat and prevent sequelae"},"options":["Empiric broad antibiotics covering gonorrhea/chlamydia; treat partners; consider admission if tubo-ovarian abscess or pregnancy","Antibiotics only if culture positive","IUD must be removed in all cases before antibiotics","Single-dose fluconazole"]}',
  'Empiric broad antibiotics covering gonorrhea/chlamydia; treat partners; consider admission if tubo-ovarian abscess or pregnancy',
  'PID warrants empiric coverage per CDC guidelines; severity guides inpatient vs outpatient therapy.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '5a2f2ddd4cdccaa643455278d526bb38',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pediatrics',
  5,
  'pediatrics',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Newborn nursery day 3
Term infant, breastfeeding, total bilirubin 16 mg/dL at 48 h, no hemolysis signs
Vitals: Stable; feeding well
Hyperbilirubinemia — phototherapy threshold',
  'Next step per nomogram?',
  '{"stepLevel":"step3","blueprintSystem":"pediatrics","kind":"ccs_prompt","caseData":{"setting":"Newborn nursery day 3","presentation":"Term infant, breastfeeding, total bilirubin 16 mg/dL at 48 h, no hemolysis signs","vitals":"Stable; feeding well","timeline":"Hyperbilirubinemia — phototherapy threshold"},"options":["Start phototherapy if above age-specific threshold; encourage feeds; follow bilirubin; check for hemolysis risk factors","Exchange transfusion now for all bilirubin >15","Discharge without follow-up","Stop breastfeeding permanently"]}',
  'Start phototherapy if above age-specific threshold; encourage feeds; follow bilirubin; check for hemolysis risk factors',
  'Phototherapy thresholds depend on age and risk; monitor and treat per AAP hyperbilirubinemia guidelines.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '703b5cc6189d8231fe8f3088cc99f2a4',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pediatrics',
  5,
  'pediatrics',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Pediatric clinic — injury pattern
2 y/o with multiple bruises in different stages, deferential delay, no plausible mechanism from caregiver
Vitals: Stable
Child safety evaluation',
  'Mandatory next step?',
  '{"stepLevel":"step3","blueprintSystem":"pediatrics","kind":"ccs_prompt","caseData":{"setting":"Pediatric clinic — injury pattern","presentation":"2 y/o with multiple bruises in different stages, deferential delay, no plausible mechanism from caregiver","vitals":"Stable","timeline":"Child safety evaluation"},"options":["Report to child protective services per state law; document; full trauma survey; consider skeletal survey","Schedule routine follow-up without reporting","Confront caregiver alone and discharge","Ignore unless fracture present"]}',
  'Report to child protective services per state law; document; full trauma survey; consider skeletal survey',
  'Clinicians must report reasonable suspicion of abuse; parallel medical evaluation for occult injury.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'd39fc6d51b5ce28482a41f6c5aea962b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'nephrology',
  5,
  'nephrology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — electrolyte emergency
64 y/o CKD on ACEi, K+ 6.8, peaked T waves on ECG, creatinine 3.4
Vitals: BP 148/88, HR 58
Hyperkalemia with ECG changes',
  'Immediate treatment?',
  '{"stepLevel":"step3","blueprintSystem":"nephrology","kind":"ccs_prompt","caseData":{"setting":"ED — electrolyte emergency","presentation":"64 y/o CKD on ACEi, K+ 6.8, peaked T waves on ECG, creatinine 3.4","vitals":"BP 148/88, HR 58","timeline":"Hyperkalemia with ECG changes"},"options":["IV calcium gluconate for membrane stabilization, insulin/dextrose and albuterol, kayexalate or dialysis if refractory; hold ACEi","Oral potassium binder only and discharge","IV normal saline bolus alone","Immediate parathyroidectomy"]}',
  'IV calcium gluconate for membrane stabilization, insulin/dextrose and albuterol, kayexalate or dialysis if refractory; hold ACEi',
  'ECG changes from hyperkalemia are an emergency — stabilize myocardium then lower K+ with shift/removal strategies.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '284f40c8a2afd5cd8ab1b23853b41649',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'ophthalmology',
  5,
  'ophthalmology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — eye pain
55 y/o with acute severe eye pain, halos, mid-dilated pupil, hazy cornea; IOP 48 mmHg
Vitals: BP 168/92
Acute angle-closure glaucoma',
  'Initial management?',
  '{"stepLevel":"step3","blueprintSystem":"ophthalmology","kind":"ccs_prompt","caseData":{"setting":"ED — eye pain","presentation":"55 y/o with acute severe eye pain, halos, mid-dilated pupil, hazy cornea; IOP 48 mmHg","vitals":"BP 168/92","timeline":"Acute angle-closure glaucoma"},"options":["Topical timolol, apraclonidine, pilocarpine after IOP lowered, IV acetazolamide, urgent ophthalmology consult","Oral antibiotics","Patch eye and follow up in 1 month","Topical steroid monotherapy"]}',
  'Topical timolol, apraclonidine, pilocarpine after IOP lowered, IV acetazolamide, urgent ophthalmology consult',
  'Acute angle closure needs rapid IOP reduction with multimodal therapy and specialist involvement.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'd4e999ef39fe1a5b0f309dd91c512226',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'endocrinology',
  5,
  'endocrinology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Inpatient — thyroid storm
40 y/o with known Graves, fever 39.5°C, AF with RVR, agitation, bilirubin elevated after URI
Vitals: HR 148, BP 140/70
Thyrotoxic crisis — multi-drug protocol',
  'Treatment bundle?',
  '{"stepLevel":"step3","blueprintSystem":"endocrine","kind":"ccs_prompt","caseData":{"setting":"Inpatient — thyroid storm","presentation":"40 y/o with known Graves, fever 39.5°C, AF with RVR, agitation, bilirubin elevated after URI","vitals":"HR 148, BP 140/70","timeline":"Thyrotoxic crisis — multi-drug protocol"},"options":["Propranolol, thionamide (PTU/MMI), iodine after thionamide, glucocorticoids, cooling, treat precipitant","Levothyroxine loading","Radioactive iodine immediate in acute storm","Observation only"]}',
  'Propranolol, thionamide (PTU/MMI), iodine after thionamide, glucocorticoids, cooling, treat precipitant',
  'Thyroid storm requires beta-blockade, thionamides, iodine (timing matters), steroids, and supportive care.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '3261dd16157b1b84afc1005d7f95612e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'infectious-disease',
  5,
  'infectious-disease',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — meningismus
19 y/o college student, fever, neck stiffness, petechial rash; LP deferred due to instability
Vitals: BP 86/50, HR 130
Suspected bacterial meningitis — time-critical antibiotics',
  'Best approach?',
  '{"stepLevel":"step3","blueprintSystem":"infectious-disease","kind":"ccs_prompt","caseData":{"setting":"ED — meningismus","presentation":"19 y/o college student, fever, neck stiffness, petechial rash; LP deferred due to instability","vitals":"BP 86/50, HR 130","timeline":"Suspected bacterial meningitis — time-critical antibiotics"},"options":["Empiric IV ceftriaxone + vancomycin (add ampicillin if elderly/list risk) immediately after blood cultures; resuscitate; LP when safe","Wait for LP before any antibiotic","Oral amoxicillin outpatient","MRI brain before antibiotics always"]}',
  'Empiric IV ceftriaxone + vancomycin (add ampicillin if elderly/list risk) immediately after blood cultures; resuscitate; LP when safe',
  'Do not delay antibiotics in suspected bacterial meningitis — empiric coverage after cultures if possible.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'bb919c1cf34d87b2ef208effe928dedd',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'hematology',
  5,
  'hematology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Outpatient CCS — leg swelling
48 y/o post long flight, unilateral calf swelling and pain; Wells score moderate; no bleed history
Vitals: Stable
Suspected proximal DVT — anticoagulation',
  'Next step?',
  '{"stepLevel":"step3","blueprintSystem":"hematology","kind":"ccs_prompt","caseData":{"setting":"Outpatient CCS — leg swelling","presentation":"48 y/o post long flight, unilateral calf swelling and pain; Wells score moderate; no bleed history","vitals":"Stable","timeline":"Suspected proximal DVT — anticoagulation"},"options":["Compression ultrasound; if positive start DOAC/warfarin per guidelines; counsel on duration and bleeding precautions","D-dimer only and no imaging if elevated","Aspirin monotherapy for DVT","Thrombolysis for all distal DVT outpatient"]}',
  'Compression ultrasound; if positive start DOAC/warfarin per guidelines; counsel on duration and bleeding precautions',
  'Moderate suspicion warrants imaging; confirmed DVT requires therapeutic anticoagulation.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'ebfa760cc493a80924aad3dd18f1ae08',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'pulmonology',
  5,
  'pulmonology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'ED — COPD flare
68 y/o severe COPD, increased dyspnea, purulent sputum, pH 7.32, pCO2 58 on baseline O2
Vitals: RR 26, SpO2 88% on home O2
Acute hypercapnic exacerbation',
  'Management?',
  '{"stepLevel":"step3","blueprintSystem":"respiratory","kind":"ccs_prompt","caseData":{"setting":"ED — COPD flare","presentation":"68 y/o severe COPD, increased dyspnea, purulent sputum, pH 7.32, pCO2 58 on baseline O2","vitals":"RR 26, SpO2 88% on home O2","timeline":"Acute hypercapnic exacerbation"},"options":["Controlled O2 to target 88–92%, bronchodilators, systemic steroids, antibiotics if infectious trigger, consider NIV; admit","High-flow 100% O2 indefinitely","Sedation to reduce respiratory drive immediately","Discharge without steroids"]}',
  'Controlled O2 to target 88–92%, bronchodilators, systemic steroids, antibiotics if infectious trigger, consider NIV; admit',
  'COPD exacerbation with hypercapnia needs cautious oxygen, bronchodilators, steroids, and NIV when indicated.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '49c47fbf647052cadaacfe1292e62a24',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'endocrinology',
  5,
  'endocrinology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Outpatient CCS — diabetic foot
62 y/o T2DM, plantar ulcer with probing to bone, no fever, pedal pulses diminished
Vitals: Afebrile
Diabetic foot infection — Wagner grade 3',
  'Best plan?',
  '{"stepLevel":"step3","blueprintSystem":"endocrine","kind":"ccs_prompt","caseData":{"setting":"Outpatient CCS — diabetic foot","presentation":"62 y/o T2DM, plantar ulcer with probing to bone, no fever, pedal pulses diminished","vitals":"Afebrile","timeline":"Diabetic foot infection — Wagner grade 3"},"options":["Urgent podiatry/orthopedic/vascular eval; empiric antibiotics covering gram-positives and anaerobes; offload; glycemic control; likely surgical debridement","Topical antibiotic cream only","Immediate below-knee amputation without evaluation","Ignore without fever"]}',
  'Urgent podiatry/orthopedic/vascular eval; empiric antibiotics covering gram-positives and anaerobes; offload; glycemic control; likely surgical debridement',
  'Deep ulcer with bone involvement (osteomyelitis risk) needs multidisciplinary care and antibiotics ± surgery.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '62f9d16c5ce1fc4e3650b595acdab47c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'nephrology',
  5,
  'nephrology',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Pre-procedure CCS
70 y/o CKD stage 3b scheduled for contrast CT for PE rule-out; eGFR 38
Vitals: Stable
Contrast-associated AKI prevention',
  'Risk reduction strategy?',
  '{"stepLevel":"step3","blueprintSystem":"nephrology","kind":"ccs_prompt","caseData":{"setting":"Pre-procedure CCS","presentation":"70 y/o CKD stage 3b scheduled for contrast CT for PE rule-out; eGFR 38","vitals":"Stable","timeline":"Contrast-associated AKI prevention"},"options":["IV isotonic saline before/after contrast; avoid nephrotoxins; monitor creatinine; use lowest contrast volume","NPO and no fluids to avoid volume overload","Prophylactic high-dose NSAIDs","Cancel all imaging forever"]}',
  'IV isotonic saline before/after contrast; avoid nephrotoxins; monitor creatinine; use lowest contrast volume',
  'Peri-procedural IV hydration is standard prophylaxis for contrast nephropathy in at-risk CKD patients.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  'fd9e6c7f945910b33fc3a9dd769572d2',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'psychiatry',
  5,
  'psychiatry',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Inpatient medicine — alcohol withdrawal
51 y/o admitted for pneumonia; heavy alcohol use; tremor, diaphoresis, CIWA 18
Vitals: HR 118, BP 162/94
Moderate–severe withdrawal — benzodiazepine protocol',
  'Treatment?',
  '{"stepLevel":"step3","blueprintSystem":"psychiatry","kind":"ccs_prompt","caseData":{"setting":"Inpatient medicine — alcohol withdrawal","presentation":"51 y/o admitted for pneumonia; heavy alcohol use; tremor, diaphoresis, CIWA 18","vitals":"HR 118, BP 162/94","timeline":"Moderate–severe withdrawal — benzodiazepine protocol"},"options":["Symptom-triggered benzodiazepines per CIWA; thiamine/folate; monitor electrolytes; seizure precautions","Phenobarbital only without monitoring","Beta-blocker monotherapy to mask symptoms","Discharge if CIWA >15"]}',
  'Symptom-triggered benzodiazepines per CIWA; thiamine/folate; monitor electrolytes; seizure precautions',
  'Alcohol withdrawal with high CIWA requires benzodiazepine dosing with monitoring and thiamine supplementation.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '843b128342f15d8f49944b90198e1762',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "stepLevel", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'usmle-step-3',
  'infectious-disease',
  5,
  'infectious-disease',
  'usmle-clinical-reasoning',
  'ccs_prompt',
  'step3',
  'Hospital day 5 CCS
IVDU with fever, new murmur, embolic rash, blood cultures pending; TEE ordered
Vitals: HR 104, BP 102/60
Suspected infective endocarditis',
  'Empiric management while awaiting cultures?',
  '{"stepLevel":"step3","blueprintSystem":"infectious-disease","kind":"ccs_prompt","caseData":{"setting":"Hospital day 5 CCS","presentation":"IVDU with fever, new murmur, embolic rash, blood cultures pending; TEE ordered","vitals":"HR 104, BP 102/60","timeline":"Suspected infective endocarditis"},"options":["Start IV vancomycin + gentamicin (or ceftriaxone per risk) after cultures; consult ID/cardiology; evaluate for complications","Oral amoxicillin only","Antibiotics only after positive culture always","Immediate valve replacement without antibiotics"]}',
  'Start IV vancomycin + gentamicin (or ceftriaxone per risk) after cultures; consult ID/cardiology; evaluate for complications',
  'Suspected endocarditis warrants cultures then empiric IV therapy tailored to risk profile without undue delay.',
  '["usmle","v2","USMLE-2026","step3","ccs","step3","v3"]',
  '[{"label":"USMLE Step 3 CCS / NBME-style management prioritization"}]'::jsonb,
  'seed',
  '1573a736c0c8dcc2d72cf6a04276da9b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "stepLevel" = EXCLUDED."stepLevel",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "blueprintDomain" = EXCLUDED."blueprintDomain",
  "active" = true;

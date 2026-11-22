-- Stage pass 1, batch 3. 17 items.
-- Does not update "QuestionBankItem".
-- Mostly Step 1 management items moved to Step 2 with the key kept.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-03-pass1-stage.sql
BEGIN;
DROP TABLE IF EXISTS qbi_usmle_fullaudit_20261121_b3_stage;
DROP TABLE IF EXISTS qbi_usmle_fullaudit_20261121_b3_backup;
CREATE TABLE qbi_usmle_fullaudit_20261121_b3_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'cmr31dl0d00bujs04f8llovqz',
    'cmr4nxt0r00gv1y1e0eb7wvjn',
    'cmr4pbhhj00q91y1ewssm1xz1',
    'cmr86gu6v003l1yw2bhqg577m',
    'cmr8cckzo016i1yw2f5f7d773',
    'cmrpwfeds006o1yh5xwu9bshs',
    'cmrrt957w000f1y8we0jpyhvw',
    'cmrrt9fe5000l1y8w5fgnhcn0',
    'cmrrufxza00fe1y8w2mywm2ga',
    'cmrrutkbu00k31y8wpth4k8l0',
    'cmrsewbf7000w1y55u7iov3y7',
    'cmrsf3j4f002w1y55x7mv2ogf',
    'cmrtgrhxy000x1yaxwftp5935',
    'cmrth89de004x1yaxziw62gvn',
    'cmrtqfz4o00071yx3r47a4cxi',
    'cmqkgnt8c0g4sl304eki6ebat',
    'cmr87j3q100hj1yr9gffqcjqn'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b3_backup) <> 17 THEN
    RAISE EXCEPTION 'backup row count %, expected 17',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b3_backup);
  END IF;
END
$check$;
CREATE TABLE qbi_usmle_fullaudit_20261121_b3_stage (
  id text PRIMARY KEY,
  fix_types text NOT NULL,
  scenario text,
  question text NOT NULL,
  options text NOT NULL,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  difficulty smallint,
  blueprint_domain text,
  blueprint_topic text,
  field_id text NOT NULL,
  step_level text,
  source_url text,
  content_hash text NOT NULL,
  active boolean NOT NULL,
  "references" jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id0$cmr31dl0d00bujs04f8llovqz$id0$,
  $fx0$wrong_step$fx0$,
  $sc0$A 34-year-old woman with rheumatoid arthritis comes to clinic for a medication check. She was started on methotrexate 15 mg orally once weekly and folic acid 1 mg daily six weeks ago. She reports painful mouth sores and increased fatigue but denies fever, cough, or dysuria. Exam shows several shallow oral ulcers and mild splenomegaly. Labs:
WBC 3.2 × 10³/µL · Hgb 10.8 g/dL · MCV 98 fL · platelets 118 × 10³/µL · AST 62 U/L · ALT 58 U/L · creatinine 0.9 mg/dL
Chest radiograph: clear$sc0$,
  $qu0$Which of the following is the most appropriate next step in management?$qu0$,
  $op0${"options":["Increase folic acid to 5 mg daily","Add trimethoprim-sulfamethoxazole prophylaxis","Hold methotrexate and obtain hepatitis serologies","Switch to leflunomide immediately","Administer folinic acid rescue and continue methotrexate unchanged"],"stepLevel":"step1","kind":"vignette","structureIds":["heart","brain","adrenal-glands"]}$op0$,
  $ky0$Hold methotrexate and obtain hepatitis serologies$ky0$,
  $ex0$Methotrexate commonly causes stomatitis and cytopenias; holding the drug while evaluating for toxicity vs intercurrent infection is appropriate. Folic acid reduces but does not eliminate MTX mucosal toxicity—dose adjustment/hold comes first. TMP-SMX plus MTX increases pancytopenia risk and is not indicated without PCP prophylaxis indication. Folinic acid rescue is for high-dose MTX regimens, not low-dose RA therapy. Hepatitis serologies are part of baseline/monitoring when LFTs rise.$ex0$,
  4,
  $dm0$msk-skin$dm0$,
  $tp0$rheumatoid-arthritis$tp0$,
  $fd0$usmle-step-2$fd0$,
  $sl0$step2$sl0$,
  $su0$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su0$,
  $ch0$f6c542c2e0a28227afb014747c6c3bad68a7643a2ff3e62cc6dbf67bffb47141$ch0$,
  true,
  $rf0$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf0$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id1$cmr4nxt0r00gv1y1e0eb7wvjn$id1$,
  $fx1$wrong_step$fx1$,
  NULL,
  $qu1$A 68-year-old woman comes to the clinic because of new back pain. She has osteoporosis and has taken oral alendronate 70 mg weekly for 3 years with documented adherence and correct administration. She takes calcium and vitamin D supplements. Since her last visit she has lost 4 cm of height. X-ray shows new compression fractures of T12 and L1. DXA shows a lumbar spine T-score of -3.3, worse than 3 years ago. Serum calcium, phosphate, PTH, alkaline phosphatase, creatinine (eGFR 75 mL/min/1.73 m2), 25-hydroxyvitamin D (38 ng/mL), and serum protein electrophoresis are normal. Which of the following is the most appropriate next step in management?$qu1$,
  $op1$["Switch to an anabolic agent (teriparatide, abaloparatide, or romosozumab)", "Continue alendronate unchanged, as a description of that mechanism alone", "Add high-dose vitamin D (50,000 IU daily), at the usual dose and route for that treatment", "Stop all osteoporosis therapy (drug holiday)"]$op1$,
  $ky1$Switch to an anabolic agent (teriparatide, abaloparatide, or romosozumab)$ky1$,
  $ex1$Correct answer: A. Switch to an anabolic agent (teriparatide, abaloparatide, or romosozumab). New vertebral fractures and falling BMD despite adherent bisphosphonate therapy, with secondary causes excluded (normal calcium, PTH, vitamin D, renal function and SPEP), are treatment failure in a very-high-risk patient. BHOF: teriparatide is for patients at high risk 'defined as a history of osteoporotic fracture, multiple risk factors for fracture, or failure/intolerance to other available osteoporosis therapy'. Romosozumab requires no MI or stroke in the past year. Why the other options are wrong: B. Continuing a failed regimen leaves her at high fracture risk. C. Her 25(OH)D is already sufficient; 50,000 IU daily is toxic. D. A drug holiday is for low-risk patients after 3-5 years, not for someone with new fractures.$ex1$,
  5,
  $dm1$msk-skin$dm1$,
  $tp1$osteoporosis-bone$tp1$,
  $fd1$usmle-step-2$fd1$,
  $sl1$step2$sl1$,
  $su1$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su1$,
  $ch1$1a753fe83c6ac5056c8c8750d91a39cc655ac9e8a36764bb5d054ea7341fb42b$ch1$,
  true,
  $rf1$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf1$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id2$cmr4pbhhj00q91y1ewssm1xz1$id2$,
  $fx2$wrong_step$fx2$,
  NULL,
  $qu2$A 45-year-old man with hypertension and obesity comes to the emergency department with severe abdominal pain, nausea and vomiting. He reports months of episodic headaches, sweating and palpitations. Blood pressure is 150/95 mm Hg. CT scan shows a 5-cm right adrenal mass with evidence of hemorrhage. Which of the following is the most appropriate next step in evaluation?$qu2$,
  $op2$["CT-guided biopsy of the adrenal mass", "Measure plasma free metanephrines", "Proceed directly to adrenalectomy", "Measure serum aldosterone and renin only"]$op2$,
  $ky2$Measure plasma free metanephrines$ky2$,
  $ex2$Correct answer: B. Measure plasma free metanephrines. Episodic headaches, sweating and palpitations with hypertension and a hemorrhagic adrenal mass raise strong concern for pheochromocytoma; the recommended first-line biochemical test is plasma free (or urinary fractionated) metanephrines, before any biopsy or surgery. Why the other options are wrong: A. Biopsy of a possible pheochromocytoma can provoke a hypertensive crisis and should not be done before it is excluded biochemically. C. Surgery without first excluding pheochromocytoma risks an intraoperative catecholamine crisis and leaves the patient unprepared with alpha blockade. D. Aldosterone testing is relevant to hypertension but does not address the episodic adrenergic symptoms or the risk of pheochromocytoma.$ex2$,
  2,
  $dm2$reproductive-endocrine$dm2$,
  $tp2$adrenal-disorders$tp2$,
  $fd2$usmle-step-2$fd2$,
  $sl2$step2$sl2$,
  $su2$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su2$,
  $ch2$4c7c38330dc61a7b9408e40a2c9fb1722518be7e0467cdbc16fb7acd7b8720d4$ch2$,
  true,
  $rf2$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf2$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id3$cmr86gu6v003l1yw2bhqg577m$id3$,
  $fx3$wrong_step$fx3$,
  NULL,
  $qu3$A 60-year-old man with an 8-year history of type 2 diabetes comes to the clinic because of 6 weeks of fatigue, polyuria, increased thirst, and an unintentional 5-kg (11-lb) weight loss. He takes metformin 1000 mg twice daily and reports good adherence. BMI is 32 kg/m2, blood pressure is 130/85 mm Hg, and he appears mildly dehydrated but alert. Random plasma glucose is 420 mg/dL and hemoglobin A1c is 11.5%. Urinalysis shows 3+ glucose and small ketones. Serum bicarbonate is 25 mEq/L, the anion gap is 10 mEq/L, and venous pH is 7.37. Which of the following is the most appropriate next step in management?$qu3$,
  $op3$["Add basal insulin therapy", "Increase metformin dosage", "Start a GLP-1 receptor agonist", "Initiate lifestyle modification counseling only"]$op3$,
  $ky3$Add basal insulin therapy$ky3$,
  $ex3$Correct answer: A. Add basal insulin therapy. On near-maximal-dose metformin he has severe, symptomatic, catabolic hyperglycemia: polyuria, polydipsia, 5-kg weight loss, ketonuria, glucose 420 mg/dL and A1c 11.5%. A normal bicarbonate, anion gap and pH exclude DKA. ADA 9.20 says insulin should be considered, whatever the background therapy, when there are symptoms of hyperglycemia or when A1C is above 10% or glucose is at least 300 mg/dL. All of these thresholds are met. Why the other options are wrong: B. Increase metformin: 2000 mg/day is already the usual maximally effective dose, and metformin alone cannot correct A1c 11.5% with catabolic symptoms. C. GLP-1 receptor agonist: ADA 9.21 prefers GLP-1-based therapy to insulin only 'without severe hyperglycemia'. This patient has severe catabolic hyperglycemia with ketonuria. A GLP-1 RA can be added later, and ADA 9.22 favors combining one with insulin. D. Lifestyle counseling only: lifestyle measures are always part of care, but alone they are inadequate for symptomatic severe hyperglycemia.$ex3$,
  3,
  $dm3$behavioral-nervous$dm3$,
  $tp3$psychiatric-pharmacology$tp3$,
  $fd3$usmle-step-2$fd3$,
  $sl3$step2$sl3$,
  $su3$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su3$,
  $ch3$3d7ce343418edfeccd722053a213e1675786d1882df2bc770800d2b480a17094$ch3$,
  true,
  $rf3$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf3$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id4$cmr8cckzo016i1yw2f5f7d773$id4$,
  $fx4$wrong_step$fx4$,
  $sc4$A 45-year-old woman presents to the emergency department with a chief complaint of severe depression and suicidal ideation. She has a history of major depressive disorder and has been on fluoxetine for the past six months. Vital signs are stable, but she appears withdrawn and tearful. Laboratory tests reveal a sodium level of 130 mEq/L. The attending physician is considering adjusting her medication.$sc4$,
  $qu4$What is the most appropriate next step in management?$qu4$,
  $op4${"options":["Increase the dose of fluoxetine","Add a second antidepressant","Obtain a psychiatric consultation","Switch to a different class of antidepressant"],"distractorRationale":{"Increase the dose of fluoxetine":"This option fails because increasing the dose does not address the immediate risk of suicide and may exacerbate her condition.","Add a second antidepressant":"This option is incorrect as it does not consider the need for a thorough psychiatric evaluation before modifying her treatment.","Switch to a different class of antidepressant":"This distractor is wrong because switching medications without a psychiatric assessment may lead to inadequate management of her acute symptoms."},"clinicalReasoning":"Assess the patient's presentation of severe depression and suicidal ideation, analyze the need for immediate psychiatric evaluation, and integrate the understanding that safety is paramount in such scenarios. The sodium level suggests a potential complication of her current medication, indicating the need for careful management.","keyTakeaways":["When faced with severe depression and suicidal ideation, prioritize obtaining a psychiatric consultation for comprehensive safety and care."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"psychiatric-pharmacology","blueprintSystem":"behavioral-nervous","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783288533710","qcScore":8.1,"slotIndex":41,"stepLevel":"step1","examNumber":9114,"generatedAt":"2026-07-05T22:02:51.045Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op4$,
  $ky4$Obtain a psychiatric consultation$ky4$,
  $ex4$## Why this answer is correct
Obtaining a psychiatric consultation is essential for immediate safety and management.
• **Severe depression** and **suicidal ideation** require urgent evaluation.
• A psychiatric consultation ensures a thorough **risk assessment**.
• The patient's **hyponatremia** complicates her condition, necessitating expert input.
**In practice:** On the unit, this means prioritizing patient safety and ensuring that appropriate interventions are implemented swiftly to manage both mental health and potential medical complications.
## Why the other options are wrong



**Increase the dose of fluoxetine**
• Trap: Students may think increasing the dose will enhance the antidepressant effect.
• Why it fails here: This option fails because it does not address the acute risk of suicide and could potentially worsen her condition, especially with her current hyponatremia.
• Remember: The priority in this scenario is immediate safety, which cannot be achieved by merely adjusting medication dosages.

**Add a second antidepressant**
• Trap: There is a belief that combining medications will provide faster relief from severe symptoms.
• Why it fails here: This approach is inappropriate without a psychiatric evaluation, as it may lead to polypharmacy risks and does not address the urgent need for safety assessment.
• Remember: The focus should be on evaluating the patient's mental state before making any medication changes.

**Switch to a different class of antidepressant**
• Trap: Students might assume that changing medications will resolve the patient's current issues.
• Why it fails here: This option does not address the immediate need for a safety assessment and could delay necessary interventions for her suicidal ideation.
• Remember: Immediate psychiatric evaluation is critical for managing acute risks, rather than simply changing medications.
## Key takeaway
**When faced with severe depression and suicidal ideation, prioritize obtaining a psychiatric consultation for comprehensive safety and care.**

**Memory hook:** Remember the acronym 'SAD' for **S**uicidal **A**ssessment and **D**ecision-making.$ex4$,
  5,
  $dm4$behavioral-nervous$dm4$,
  $tp4$psychiatric-pharmacology$tp4$,
  $fd4$usmle-step-2$fd4$,
  $sl4$step2$sl4$,
  $su4$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su4$,
  $ch4$5015c9f5942cf58af927c84e30000d5497cf4ea0a1e37e04da8ac93951749cd3$ch4$,
  true,
  $rf4$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf4$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id5$cmrpwfeds006o1yh5xwu9bshs$id5$,
  $fx5$wrong_step|not_single_best$fx5$,
  $sc5$A 30-year-old woman presents to the emergency department with severe abdominal pain and vomiting. She reports a history of gallstones and has been experiencing intermittent pain for the past few months. On examination, her abdomen is tender in the right upper quadrant, and she has a fever of 38.5°C (101.3°F). Laboratory tests show elevated white blood cell count (WBC 15,000/mm³) and elevated liver enzymes.$sc5$,
  $qu5$Which diagnostic study is the most appropriate next step?$qu5$,
  $op5${"options":["Start intravenous antibiotics","Obtain an abdominal ultrasound","Perform an endoscopic retrograde cholangiopancreatography (ERCP)","Schedule for laparoscopic cholecystectomy"],"distractorRationale":{"Start intravenous antibiotics":"Important but not the immediate next step; imaging is needed first.","Obtain an abdominal ultrasound":"Correct answer; necessary to confirm diagnosis.","Perform an endoscopic retrograde cholangiopancreatography (ERCP)":"Incorrect; ERCP is not first-line for acute cholecystitis.","Schedule for laparoscopic cholecystectomy":"Incorrect; surgery is not the immediate next step without imaging."},"clinicalReasoning":"Assess the patient's symptoms and history to identify the likely diagnosis of acute cholecystitis. Analyze the need for imaging to confirm the diagnosis before initiating treatment. Integrate the clinical context to determine the most appropriate next step in management.","keyTakeaways":["When suspecting acute cholecystitis, always prioritize imaging to confirm the diagnosis before treatment."],"kind":"calculation","taskCategory":"clinical-intervention","blueprintTopic":"pharmacology-interactions","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350479160","qcScore":8.1,"slotIndex":12,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-18T04:55:24.464Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"clinical-intervention"}$op5$,
  $ky5$Obtain an abdominal ultrasound$ky5$,
  $ex5$Fever, right-upper-quadrant tenderness, and a history of gallstones suggest acute cholecystitis. The Merck Manual states that transabdominal ultrasound is the test that detects the stone and the inflammation. Antibiotics and cholecystectomy are treatment, not the study that establishes the diagnosis. ERCP is not the first test.$ex5$,
  2,
  $dm5$multisystem$dm5$,
  $tp5$pharmacology-interactions$tp5$,
  $fd5$usmle-step-2$fd5$,
  $sl5$step2$sl5$,
  $su5$https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/acute-cholecystitis$su5$,
  $ch5$aff62774d66a2da14cd070dc2e25a2b3abf9a660d50fd150a94a424c0906938f$ch5$,
  true,
  $rf5$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}, {"label": "Merck Manual acute cholecystitis", "url": "https://www.merckmanuals.com/professional/hepatic-and-biliary-disorders/gallbladder-and-bile-duct-disorders/acute-cholecystitis", "quote": "Transabdominal ultrasound is the best test to detect gallstones. Diagnose via ultrasound."}]$rf5$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id6$cmrrt957w000f1y8we0jpyhvw$id6$,
  $fx6$wrong_step$fx6$,
  $sc6$A 35-year-old man presents to the clinic with a 3-month history of fatigue, weight loss, and increased thirst. Laboratory tests show a fasting glucose level of 210 mg/dL and HbA1c of 9.0%. He is started on metformin but continues to have elevated blood glucose levels.$sc6$,
  $qu6$What is the most appropriate next step in management?$qu6$,
  $op6${"options":["Add a GLP-1 receptor agonist","Increase the dose of metformin","Add a sulfonylurea","Start insulin therapy"],"distractorRationale":{"Add a GLP-1 receptor agonist":"This is the correct answer, as it provides additional glycemic control and weight loss benefits.","Increase the dose of metformin":"While this could be considered, it may not be sufficient for achieving control.","Add a sulfonylurea":"This increases the risk of hypoglycemia and is not the best next step in this case.","Start insulin therapy":"Insulin therapy may not be necessary at this stage and is generally reserved for more severe cases."},"clinicalReasoning":"Evaluate the patient's current diabetes management and analyze the effectiveness of metformin. Integrate treatment guidelines to determine that adding a GLP-1 receptor agonist is the most appropriate next step.","keyTakeaways":["When metformin alone isn't enough, consider adding a GLP-1 receptor agonist for better control and weight management."],"kind":"vignette","taskCategory":"clinical-intervention","blueprintTopic":"pharmacology-interactions","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784465902524","qcScore":8.1,"slotIndex":15,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-19T12:59:04.431Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"clinical-intervention"}$op6$,
  $ky6$Add a GLP-1 receptor agonist$ky6$,
  $ex6$## Why this answer is correct
Adding a GLP-1 receptor agonist is the best next step for better glycemic control.
• **GLP-1 receptor agonists** enhance insulin secretion and lower blood glucose levels.
• They also promote **weight loss**, which is beneficial for this patient.
• This approach is consistent with **current diabetes management guidelines**.
**In practice:** On the unit, this means we can help patients achieve better control of their diabetes while also addressing weight management, which is crucial for overall health.
## Why the other options are wrong



**Increase the dose of metformin**
• Trap: Students may think increasing metformin is a straightforward solution.
• Why it fails here: However, simply increasing the dose may not provide adequate control, especially if the patient is already experiencing significant hyperglycemia.
• Remember: This highlights the need for a more effective medication strategy rather than just adjusting the current one.

**Add a sulfonylurea**
• Trap: Many believe sulfonylureas are a quick fix for high blood sugar.
• Why it fails here: However, they carry a higher risk of **hypoglycemia** (low blood sugar), which can be dangerous, especially in patients not well-controlled on metformin.
• Remember: This emphasizes the importance of considering the safety profile of medications in diabetes management.

**Start insulin therapy**
• Trap: Some may think insulin is the go-to solution for uncontrolled diabetes.
• Why it fails here: In this case, insulin therapy may be premature and is typically reserved for more severe cases or when other medications fail completely.
• Remember: This reinforces the idea that treatment should be tailored to the patient's current condition and not escalate unnecessarily.
## Key takeaway
**When metformin alone isn't enough, consider adding a GLP-1 receptor agonist for better control and weight management.**

**Memory hook:** Think 'GLP-1 for glucose and gain loss' — it helps with both blood sugar and weight!$ex6$,
  2,
  $dm6$multisystem$dm6$,
  $tp6$pharmacology-interactions$tp6$,
  $fd6$usmle-step-2$fd6$,
  $sl6$step2$sl6$,
  $su6$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su6$,
  $ch6$afbea9c16c3c78d70d2bb86805feaa511c709071ea588a2ec21726a82113a849$ch6$,
  true,
  $rf6$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf6$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id7$cmrrt9fe5000l1y8w5fgnhcn0$id7$,
  $fx7$wrong_step$fx7$,
  $sc7$A 60-year-old man with a history of diabetes presents to the clinic for a routine check-up. He reports increased thirst and urination over the past month. His fasting blood glucose is 180 mg/dL, and HbA1c is 8.5%. He is currently taking metformin.$sc7$,
  $qu7$What is the most appropriate next step in management?$qu7$,
  $op7${"options":["Add insulin therapy","Increase metformin dosage","Start a GLP-1 receptor agonist","Initiate lifestyle modifications"],"distractorRationale":{"Increase metformin dosage":"While this may seem reasonable, the patient's HbA1c indicates that metformin alone is not sufficient.","Start a GLP-1 receptor agonist":"This is an option for weight loss and glycemic control but is not the immediate next step for poor control.","Initiate lifestyle modifications":"Lifestyle changes are important but are not enough given the patient's current glycemic status."},"clinicalReasoning":"Assess the patient's current medications and lab results to determine the most effective next step in management for diabetes control.","keyTakeaways":["When HbA1c is significantly above target, prioritize adding insulin therapy for effective diabetes management."],"kind":"vignette","taskCategory":"health-maintenance","blueprintTopic":"pharmacology-interactions","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784465902524","qcScore":8,"slotIndex":21,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-19T12:59:00.153Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"health-maintenance"}$op7$,
  $ky7$Start a GLP-1 receptor agonist$ky7$,
  $ex7$3 is correct: HbA1c 8.5% on metformin calls for adding a GLP-1 RA (or SGLT2 inhibitor), per ADA. 1 (insulin) is wrong because there are no catabolic features and HbA1c is <10%. 2 (higher metformin) is wrong because it will not close the gap. 4 (lifestyle only) is wrong because lifestyle continues but drug intensification is also needed.$ex7$,
  4,
  $dm7$multisystem$dm7$,
  $tp7$pharmacology-interactions$tp7$,
  $fd7$usmle-step-2$fd7$,
  $sl7$step2$sl7$,
  $su7$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su7$,
  $ch7$432ee33722ac5c425a9397a5bf35962ff8ae2c37bd184c42a6dbbae8f49b1db4$ch7$,
  true,
  $rf7$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf7$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id8$cmrrufxza00fe1y8w2mywm2ga$id8$,
  $fx8$wrong_step$fx8$,
  NULL,
  $qu8$A 45-year-old man with a 10-year history of type 2 diabetes comes to the clinic with 1 month of fatigue, frequent urination and an unintentional 5-kg weight loss. He takes metformin 1,000 mg twice daily. Fasting glucose is 320 mg/dL, HbA1c is 11.4% and urine ketones are negative. Which of the following is the most appropriate next step in management?$qu8$,
  $op8$["Increase the dose of metformin", "Add basal insulin", "Add a GLP-1 receptor agonist alone", "Refer to a dietitian"]$op8$,
  $ky8$Add basal insulin$ky8$,
  $ex8$Correct answer: B. Add basal insulin. Insulin is indicated when HbA1c is above 10%, glucose is 300 mg/dL or higher, or there are catabolic features such as weight loss. He has all three, so basal insulin is added to metformin. Why the other options are wrong: A. He is already on the maximum effective dose. C. GLP-1-based therapy is preferred over insulin only without severe hyperglycemia or catabolic features; he has both. D. Dietary advice is useful but cannot correct this degree of hyperglycemia with weight loss.$ex8$,
  5,
  $dm8$cardiovascular$dm8$,
  $tp8$emergency-acls$tp8$,
  $fd8$usmle-step-2$fd8$,
  $sl8$step2$sl8$,
  $su8$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su8$,
  $ch8$6bfd599df4374c9eedfab9828c46bbd729b8e0425c532f515f9ec9678435b428$ch8$,
  true,
  $rf8$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf8$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id9$cmrrutkbu00k31y8wpth4k8l0$id9$,
  $fx9$wrong_step$fx9$,
  $sc9$A 50-year-old woman presents to the emergency department with chest pain and dyspnea. She has a history of hypertension and hyperlipidemia. On examination, her blood pressure is 130/80 mm Hg, heart rate is 90 bpm, and she has decreased breath sounds on the left side. A chest X-ray shows a large pleural effusion.$sc9$,
  $qu9$What is the most appropriate next step in management?$qu9$,
  $op9${"options":["Administer diuretics","Perform thoracentesis","Start antibiotics","Obtain a CT scan of the chest"],"distractorRationale":{"Administer diuretics":"Diuretics are not effective for managing a large pleural effusion that requires drainage.","Perform thoracentesis":"Correct answer; this is the immediate step to relieve dyspnea and analyze the effusion.","Start antibiotics":"Not warranted without evidence of infection; the focus should be on drainage.","Obtain a CT scan of the chest":"While useful for further evaluation, it is not the immediate priority in this case."},"clinicalReasoning":"Evaluate the patient's symptoms and imaging findings to determine the most appropriate next step in management. Analyze the need for immediate intervention to relieve dyspnea and integrate this information to conclude that thoracentesis is the best course of action.","keyTakeaways":["When faced with a large pleural effusion causing dyspnea, prioritize thoracentesis to relieve symptoms and obtain diagnostic fluid."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"pharmacology-interactions","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784468749874","qcScore":8.2,"slotIndex":24,"stepLevel":"step1","examNumber":9110,"generatedAt":"2026-07-19T13:46:38.128Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op9$,
  $ky9$Perform thoracentesis$ky9$,
  $ex9$## Why this answer is correct
Performing thoracentesis is the best next step to relieve dyspnea caused by a large pleural effusion.
• **Thoracentesis** is a procedure to drain fluid from the pleural space, which can alleviate symptoms like **dyspnea** (shortness of breath).
• In cases of **large pleural effusion**, immediate drainage is often necessary rather than waiting for other interventions.
• Fluid analysis obtained during thoracentesis can help determine the underlying cause of the effusion.
**In practice:** On the unit, performing thoracentesis can provide rapid relief of respiratory distress and is crucial for diagnosing potential infections or malignancies associated with the effusion.
## Why the other options are wrong



**Administer diuretics**
• Trap: Students may think diuretics can help reduce fluid volume in the pleural space.
• Why it fails here: Diuretics are ineffective for large pleural effusions because they do not drain the fluid; thoracentesis is required for that.
• Remember: Understanding that thoracentesis directly addresses the cause of dyspnea is key in managing pleural effusions.

**Start antibiotics**
• Trap: There may be an assumption that antibiotics are necessary due to the patient's respiratory symptoms.
• Why it fails here: Antibiotics are not indicated without evidence of infection; the priority is to relieve the effusion first.
• Remember: Recognizing the need for drainage before considering infection treatment is essential in acute management.

**Obtain a CT scan of the chest**
• Trap: Students might believe that imaging is always the first step in evaluating chest issues.
• Why it fails here: While a CT scan can provide additional information, it is not the immediate priority when a large pleural effusion is present and causing symptoms.
• Remember: Immediate intervention to relieve symptoms takes precedence over further imaging in acute cases.
## Key takeaway
**When faced with a large pleural effusion causing dyspnea, prioritize thoracentesis to relieve symptoms and obtain diagnostic fluid.**

**Memory hook:** Think 'thoracentesis first' for pleural effusions to breathe easier.$ex9$,
  4,
  $dm9$multisystem$dm9$,
  $tp9$pharmacology-interactions$tp9$,
  $fd9$usmle-step-2$fd9$,
  $sl9$step2$sl9$,
  $su9$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su9$,
  $ch9$a8c6b846fab33d5e88e0195a3d6f3092e3879f62ede912c3f7961688d9b0e55c$ch9$,
  true,
  $rf9$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf9$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id10$cmrsewbf7000w1y55u7iov3y7$id10$,
  $fx10$wrong_step|stem_missing_detail$fx10$,
  $sc10$A 65-year-old woman with a history of hypertension and diabetes presents to the emergency department with sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mmHg, and a CT scan of the head shows an ischemic stroke. She was last known well 80 minutes ago, takes no anticoagulant, and the fingerstick glucose is 118 mg/dL. The scan is noncontrast and shows no hemorrhage.$sc10$,
  $qu10$What is the next best step in management?$qu10$,
  $op10${"options":["Start intravenous thrombolysis","Administer aspirin","Obtain a carotid ultrasound","Initiate anticoagulation therapy"],"distractorRationale":{"Administer aspirin":"Aspirin is used for secondary prevention, not for acute treatment of ischemic stroke.","Obtain a carotid ultrasound":"This is part of the workup but not an immediate management step.","Initiate anticoagulation therapy":"Anticoagulation is not indicated in acute ischemic stroke without specific indications."},"clinicalReasoning":"Evaluate the patient's presentation and imaging findings, analyze the management protocols for acute ischemic stroke, and integrate this knowledge to determine that intravenous thrombolysis is the most appropriate next step.","keyTakeaways":["When faced with an acute ischemic stroke, prioritize intravenous thrombolysis within the treatment window."],"kind":"vignette","taskCategory":"diagnosis","blueprintTopic":"pe-pathophysiology","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784502584405","qcScore":8,"slotIndex":34,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-19T23:10:31.401Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"diagnosis"}$op10$,
  $ky10$Start intravenous thrombolysis$ky10$,
  $ex10$She was last known well 80 minutes ago, takes no anticoagulant, and noncontrast CT shows no hemorrhage. Blood pressure is 180/100 mm Hg. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients inside 4.5 hours.$ex10$,
  5,
  $dm10$respiratory-renal$dm10$,
  $tp10$pe-pathophysiology$tp10$,
  $fd10$usmle-step-2$fd10$,
  $sl10$step2$sl10$,
  $su10$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su10$,
  $ch10$a041522de0461b3da6b55aabf88c8d528187fbea38086a1d42083c0dc710e70c$ch10$,
  true,
  $rf10$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}, {"label": "AHA/ASA 2018 stroke guideline", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended within 4.5 hours of last known well when blood pressure can be kept at or below 185/110 mm Hg."}]$rf10$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id11$cmrsf3j4f002w1y55x7mv2ogf$id11$,
  $fx11$wrong_step$fx11$,
  $sc11$A 65-year-old woman presents to the emergency department with sudden onset shortness of breath and chest pain. Her vital signs show a blood pressure of 110/70 mm Hg, heart rate of 110 bpm, and oxygen saturation of 88% on room air. A CT scan of the chest reveals a large pulmonary embolism in the right main pulmonary artery. She has a history of deep vein thrombosis and is currently on warfarin therapy. Her INR is 1.5.$sc11$,
  $qu11$What is the next best step in management?$qu11$,
  $op11${"options":["Administer low molecular weight heparin","Increase the warfarin dose","Start thrombolytic therapy","Perform an inferior vena cava filter placement"],"distractorRationale":{"Increase the warfarin dose":"This option fails because warfarin takes time to achieve therapeutic levels and is not suitable for immediate management of acute pulmonary embolism.","Start thrombolytic therapy":"This option fails as thrombolytics are typically reserved for patients who are hemodynamically unstable or have massive pulmonary embolism, which this patient does not.","Perform an inferior vena cava filter placement":"This option fails because an IVC filter is not indicated as the first-line treatment for acute pulmonary embolism when the patient can be effectively treated with anticoagulation."},"clinicalReasoning":"The patient's presentation of acute shortness of breath and chest pain, along with the CT findings of a pulmonary embolism, necessitates immediate anticoagulation. Given her current warfarin therapy is not therapeutic, LMWH is the most appropriate next step to prevent further clotting and manage the embolism effectively.","keyTakeaways":["When managing acute pulmonary embolism, prioritize immediate anticoagulation with low molecular weight heparin."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"pe-pathophysiology","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784502809847","qcScore":8.2,"slotIndex":29,"stepLevel":"step1","examNumber":9102,"generatedAt":"2026-07-19T23:16:47.316Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$op11$,
  $ky11$Administer low molecular weight heparin$ky11$,
  $ex11$## Why this answer is correct
Administering low molecular weight heparin is the best immediate management for this patient with a pulmonary embolism.
• **Acute pulmonary embolism** requires immediate anticoagulation.
• The patient’s **INR of 1.5** indicates she is not adequately anticoagulated on warfarin.
• **Low molecular weight heparin (LMWH)** provides rapid anticoagulation, crucial in this scenario.
**In practice:** In practice, timely administration of LMWH can significantly reduce the risk of further clot formation and improve patient outcomes in acute situations like this.
## Why the other options are wrong



**Increase the warfarin dose**
• Trap: Students may think increasing warfarin will quickly improve anticoagulation.
• Why it fails here: This option fails because warfarin takes several days to reach therapeutic levels, which is not suitable for acute management.
• Remember: In acute pulmonary embolism, immediate anticoagulation is essential, which warfarin cannot provide.

**Start thrombolytic therapy**
• Trap: Some may believe thrombolytics are the go-to treatment for all pulmonary embolisms.
• Why it fails here: This option is incorrect because thrombolytic therapy is typically reserved for patients who are hemodynamically unstable, and this patient is stable.
• Remember: Understanding the stability of the patient is crucial in determining the appropriate treatment approach.

**Perform an inferior vena cava filter placement**
• Trap: Students might think that IVC filters are a first-line treatment for pulmonary embolism.
• Why it fails here: This option is not indicated at this time since the patient can be effectively managed with anticoagulation.
• Remember: IVC filters are typically used in cases where anticoagulation is contraindicated or ineffective, not as an immediate intervention.
## Key takeaway
**When managing acute pulmonary embolism, prioritize immediate anticoagulation with low molecular weight heparin.**

**Memory hook:** Think 'LMWH for PE' — it’s the quick fix for acute clots!$ex11$,
  5,
  $dm11$respiratory-renal$dm11$,
  $tp11$pe-pathophysiology$tp11$,
  $fd11$usmle-step-2$fd11$,
  $sl11$step2$sl11$,
  $su11$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su11$,
  $ch11$63e1f609229639a49303a8cb6ce9d11812dd2ebc993d823b02c6ff89c4c88e0e$ch11$,
  true,
  $rf11$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf11$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id12$cmrtgrhxy000x1yaxwftp5935$id12$,
  $fx12$wrong_step$fx12$,
  $sc12$A 50-year-old man with a history of diabetes presents to the clinic for a routine check-up. He reports increased thirst and urination. Laboratory tests reveal a fasting blood glucose level of 180 mg/dL and an HbA1c of 8.5%. He is currently taking metformin.$sc12$,
  $qu12$What is the most appropriate next step in management?$qu12$,
  $op12${"options":["Increase metformin (a biguanide) dosage","Add insulin therapy","Start a GLP-1 receptor agonist","Refer to an endocrinologist"],"distractorRationale":{"Increase metformin (a biguanide) dosage":"This option is incorrect as simply increasing metformin may not adequately control blood glucose levels.","Add insulin therapy":"Insulin therapy is not the first-line option in this scenario when other agents can be added.","Refer to an endocrinologist":"Referral is premature as the patient can be managed with current guidelines."},"clinicalReasoning":"Assess the patient's current diabetes management, analyze laboratory results, and integrate guidelines for the next best step in management.","keyTakeaways":["When managing poorly controlled diabetes, consider adding a GLP-1 receptor agonist before escalating to insulin or referral."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"pharmacology-interactions","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784565894728","qcScore":8.1,"slotIndex":33,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-20T16:46:12.045Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op12$,
  $ky12$Start a GLP-1 receptor agonist$ky12$,
  $ex12$## Why this answer is correct
Starting a GLP-1 receptor agonist is the best next step for this patient.
• **GLP-1 receptor agonists** improve glycemic control and promote weight loss.
• The patient's **HbA1c of 8.5%** indicates inadequate diabetes management.
• Adding a GLP-1 receptor agonist can help achieve better **glycemic targets**.
**In practice:** In practice, this means we can enhance the patient's diabetes management without escalating to insulin too soon, which can be more complex and burdensome.
## Why the other options are wrong



**Increase metformin (a biguanide) dosage**
• Trap: Students may think that simply increasing the dose of metformin is sufficient for better control.
• Why it fails here: However, the patient's current HbA1c indicates that metformin alone is not adequately managing his diabetes, and merely increasing the dose may not lead to significant improvement.
• Remember: This highlights the importance of using combination therapy when glycemic targets are not met.

**Add insulin therapy**
• Trap: Many students believe insulin should be the first addition to therapy for uncontrolled diabetes.
• Why it fails here: In this case, insulin is typically reserved for patients who have not responded to oral medications or have more severe hyperglycemia.
• Remember: This reinforces the stepwise approach to diabetes management, where other agents are preferred before insulin.

**Refer to an endocrinologist**
• Trap: Students might think that referral to a specialist is necessary for any patient with poorly controlled diabetes.
• Why it fails here: However, this patient can be effectively managed within primary care using current guidelines, making referral premature.
• Remember: This emphasizes the importance of utilizing available resources and treatments before escalating care.
## Key takeaway
**When managing poorly controlled diabetes, consider adding a GLP-1 receptor agonist before escalating to insulin or referral.**

**Memory hook:** Think 'GLP-1 for better control' when faced with elevated HbA1c in type 2 diabetes.$ex12$,
  4,
  $dm12$multisystem$dm12$,
  $tp12$pharmacology-interactions$tp12$,
  $fd12$usmle-step-2$fd12$,
  $sl12$step2$sl12$,
  $su12$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su12$,
  $ch12$6b6c5eea8c299972fac1d9f7ee61c9f87916e700e688b2cda9bb8189fb5fa5c5$ch12$,
  true,
  $rf12$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf12$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id13$cmrth89de004x1yaxziw62gvn$id13$,
  $fx13$wrong_step$fx13$,
  $sc13$A 30-year-old woman presents to the clinic for a routine check-up. She has no significant past medical history and is currently taking no medications. On examination, her blood pressure is 130/85 mm Hg, and her BMI is 32. Laboratory tests reveal a fasting blood glucose of 100 mg/dL and a total cholesterol of 220 mg/dL. She expresses concern about her risk for developing diabetes.$sc13$,
  $qu13$What is the next best step in management?$qu13$,
  $op13${"options":["Initiate lifestyle modifications","Start metformin","Refer to endocrinology","Obtain an oral glucose tolerance test"],"distractorRationale":{"Start metformin":"This is not indicated until diabetes is confirmed or significant risk factors are present.","Refer to endocrinology":"Referral is not necessary at this stage of management.","Obtain an oral glucose tolerance test":"Not needed when fasting glucose is already elevated."},"clinicalReasoning":"The patient's risk factors indicate that lifestyle modifications are the most appropriate initial step to prevent diabetes.","keyTakeaways":["When assessing diabetes risk, prioritize lifestyle modifications before considering medications or referrals."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"pharmacology-interactions","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784566857884","qcScore":8.4,"slotIndex":17,"stepLevel":"step1","examNumber":9103,"generatedAt":"2026-07-20T17:02:58.297Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op13$,
  $ky13$Initiate lifestyle modifications$ky13$,
  $ex13$## Why this answer is correct
Initiating lifestyle modifications is the best first step to prevent diabetes.
• **Lifestyle modifications** can significantly reduce the risk of developing diabetes.
• The patient's **BMI** of 32 indicates obesity, a major risk factor for diabetes.
• Her **fasting blood glucose** is at the upper limit of normal, signaling the need for preventive action.
**In practice:** On the unit, this means we prioritize non-pharmacological interventions for patients at risk, promoting healthier habits to prevent disease progression.
## Why the other options are wrong



**Start metformin**
• Trap: Students may think metformin is the first-line treatment for any elevated glucose level.
• Why it fails here: Metformin is typically reserved for patients with confirmed diabetes or those with significant risk factors, not just elevated fasting glucose.
• Remember: This option misunderstands the role of lifestyle changes as the first step in diabetes prevention.

**Refer to endocrinology**
• Trap: There may be a belief that any concern about diabetes warrants a specialist referral.
• Why it fails here: Referral to endocrinology is unnecessary at this stage since the patient does not have confirmed diabetes.
• Remember: This option overlooks the importance of managing risk factors through primary care first.

**Obtain an oral glucose tolerance test**
• Trap: Students might think further testing is always needed when glucose levels are concerning.
• Why it fails here: An oral glucose tolerance test is not required when the fasting glucose is already elevated, as it confirms the risk of diabetes.
• Remember: This option fails to recognize that lifestyle changes should be prioritized over additional testing.
## Key takeaway
**When assessing diabetes risk, prioritize lifestyle modifications before considering medications or referrals.**

**Memory hook:** Think 'BMI and blood sugar high? Start with diet and exercise, oh my!'$ex13$,
  2,
  $dm13$multisystem$dm13$,
  $tp13$pharmacology-interactions$tp13$,
  $fd13$usmle-step-2$fd13$,
  $sl13$step2$sl13$,
  $su13$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su13$,
  $ch13$15614f61754f6e9e56c28a9545135552172801eab7de8524db55a9344ea05baa$ch13$,
  true,
  $rf13$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf13$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id14$cmrtqfz4o00071yx3r47a4cxi$id14$,
  $fx14$wrong_step$fx14$,
  NULL,
  $qu14$A 50-year-old man with type 2 diabetes comes to the clinic with a foot ulcer that has not healed for 6 weeks. He takes metformin. There is a 2-cm ulcer on the plantar surface of the forefoot with a rim of callus and yellow slough at its base. There is no surrounding erythema, warmth, swelling, tenderness or purulent drainage, and he is afebrile. Pedal pulses are palpable. His blood glucose is 220 mg/dL. Which of the following is the most appropriate next step in management?$qu14$,
  $op14$["Start insulin therapy", "Sharp debridement of the ulcer", "Increase the metformin (a biguanide) dose", "Prescribe oral antibiotics"]$op14$,
  $ky14$Sharp debridement of the ulcer$ky14$,
  $ex14$Correct answer: B. Sharp debridement of the ulcer. The ulcer is clinically uninfected (no erythema, warmth, swelling, tenderness or purulence) but is covered by callus and slough. Sharp debridement removes this nonviable tissue and is the standard of care to help a diabetic foot ulcer heal. Why the other options are wrong: A. Glycemic control matters for healing, but a glucose of 220 mg/dL in a man on metformin does not make insulin the next step for the ulcer itself. C. Adjusting metformin does not treat the callus and slough that are preventing the ulcer from healing. D. The ulcer has no erythema, warmth, swelling, tenderness or pus, so it is not infected, and antibiotics are not used for uninfected ulcers.$ex14$,
  3,
  $dm14$respiratory-renal$dm14$,
  $tp14$ards-pathology$tp14$,
  $fd14$usmle-step-2$fd14$,
  $sl14$step2$sl14$,
  $su14$https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications$su14$,
  $ch14$475f7ece68c64ccb43f8ba1999439f643a48a845cbcbc4c64e9aca11ede0199d$ch14$,
  true,
  $rf14$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}]$rf14$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id15$cmqkgnt8c0g4sl304eki6ebat$id15$,
  $fx15$wrong_step$fx15$,
  NULL,
  $qu15$A 23-year-old man with type 1 diabetes comes to the emergency department with polyuria, polydipsia, nausea and abdominal pain after running out of insulin 2 days ago. Blood pressure is 102/64 mm Hg, heart rate is 118/min, and respiratory rate is 28/min with deep breathing. His mucous membranes are dry. Glucose is 520 mg/dL, arterial pH is 7.18, bicarbonate is 10 mEq/L, anion gap is 24, potassium is 5.1 mEq/L, and serum beta-hydroxybutyrate is markedly elevated. Which of the following is the most appropriate management?$qu15$,
  $op15$["Subcutaneous insulin, the hormone that moves glucose into cells, and discharge home, at the usual dose and route for that treatment", "Intravenous bicarbonate infusion, as a description of that mechanism alone", "Oral rehydration without insulin", "Isotonic IV fluids, then an IV insulin infusion with hourly glucose and regular electrolyte monitoring"]$op15$,
  $ky15$Isotonic IV fluids, then an IV insulin infusion with hourly glucose and regular electrolyte monitoring$ky15$,
  $ex15$Glucose 520 mg/dL, pH 7.18, and an anion gap of 24 are diabetic ketoacidosis. The Merck Manual corrects that acidosis with intravenous fluid and insulin. Bicarbonate is not routine at pH 7.18. Potassium is 5.1 mEq/L, so insulin does not have to be held.$ex15$,
  3,
  $dm15$biostats-epi$dm15$,
  $tp15$metabolic-pathways$tp15$,
  $fd15$usmle-step-2$fd15$,
  $sl15$step2$sl15$,
  $su15$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka$su15$,
  $ch15$e52406f81e34aaba2f741480c032955c57cfb5d281ac1ab212b84c88820371f1$ch15$,
  true,
  $rf15$[{"label": "USMLE Step 2 CK content outline", "url": "https://www.usmle.org/prepare-your-exam/step-2-ck-materials/step-2-ck-content-outline-specifications", "quote": "Step 2 CK weights patient care pharmacotherapy, mixed management, and clinical interventions. Applying foundational science is weighted at 0 on Step 2 CK."}, {"label": "Merck Manual diabetic ketoacidosis", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka", "quote": "Correct acidosis and hyperglycemia with IV fluid and insulin. Bicarbonate should not be given routinely unless the pH is < 7."}]$rf15$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b3_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id16$cmr87j3q100hj1yr9gffqcjqn$id16$,
  $fx16$stem_missing_detail$fx16$,
  $sc16$A 72-year-old man with a history of hypertension and hyperlipidemia presents to the emergency department with sudden onset shortness of breath and pleuritic chest pain. He is tachycardic with a heart rate of 110 bpm and has a blood pressure of 78/50 mm Hg. A CT angiogram shows a large pulmonary embolism in the right main pulmonary artery. The systolic pressure has stayed at 78 mm Hg for 20 minutes after 1 L of crystalloid. He has no intracranial hemorrhage, no recent surgery, and no active bleeding.$sc16$,
  $qu16$What is the most appropriate next step in management?$qu16$,
  $op16${"options":["Start oral anticoagulation","Administer intravenous fluids","Initiate thrombolytic therapy","Begin heparin infusion"],"distractorRationale":{"Start oral anticoagulation":"Incorrect as it is not effective in acute management of unstable PE.","Administer intravenous fluids":"Fails to address the underlying clot causing instability.","Begin heparin infusion":"While necessary, it is not sufficient for unstable patients with a large PE."},"clinicalReasoning":"Assess the patient's hemodynamic status and imaging results. Analyze the urgency of treatment for a large PE with instability and integrate that thrombolytics are warranted.","keyTakeaways":["In patients with hemodynamic instability due to a large pulmonary embolism, prioritize thrombolytic therapy for rapid resolution."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"pe-workup","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783280577288","qcScore":8.3,"slotIndex":51,"stepLevel":"step2","examNumber":9206,"generatedAt":"2026-07-05T19:43:52.962Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"pharmacotherapy"}$op16$,
  $ky16$Initiate thrombolytic therapy$ky16$,
  $ex16$Systolic pressure has remained 78 mm Hg for 20 minutes after fluid. That is high-risk pulmonary embolism. The 2019 ESC guideline recommends systemic thrombolysis for high-risk PE. Heparin alone does not reperfuse the artery, and no bleeding contraindication is described.$ex16$,
  3,
  $dm16$respiratory-renal$dm16$,
  $tp16$pe-workup$tp16$,
  $fd16$usmle-step-2$fd16$,
  $sl16$step2$sl16$,
  $su16$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su16$,
  $ch16$ee18dcf76a33a891168dd7cdb2a2a6c71b749337cc47bd97d360caa2ca390a4d$ch16$,
  true,
  $rf16$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Systemic thrombolytic therapy is recommended for high-risk PE. Persistent hypotension is systolic BP <90 mmHg lasting longer than 15 min."}, {"label": "Merck Manual pulmonary embolism", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe", "quote": "High risk (massive) means systolic blood pressure < 90 mm Hg."}]$rf16$::jsonb
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b3_stage) <> 17 THEN
    RAISE EXCEPTION 'stage row count %, expected 17',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b3_stage);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_fullaudit_20261121_b3_stage
    WHERE position(correct_answer IN options) = 0
  ) THEN
    RAISE EXCEPTION 'a staged key is not contained in the staged options text';
  END IF;
END
$check$;
COMMIT;

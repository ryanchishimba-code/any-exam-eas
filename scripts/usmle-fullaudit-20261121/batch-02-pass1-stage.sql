-- Stage pass 1, batch 2. 16 served items.
-- Does not update "QuestionBankItem".
-- Keys stay. Missing ECG findings, a cutoff pH, or a prior dose of atropine are added to the stem.
-- Do not run against production until this draft is accepted.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-02-pass1-stage.sql
BEGIN;
DROP TABLE IF EXISTS qbi_usmle_fullaudit_20261121_b2_stage;
DROP TABLE IF EXISTS qbi_usmle_fullaudit_20261121_b2_backup;
CREATE TABLE qbi_usmle_fullaudit_20261121_b2_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'cmr85uk1p001a1yw2c0lo2i36',
    'cmrpwiwvj006w1yrtz3cv3kmr',
    'cmrr4ycyx002o1y6p2yq44ej3',
    'cmrruakye00dp1y8wxboyh90x',
    'cmrrv651n00o71y8wwe9xb6k4',
    'cmrrw4xqv00g41yl8gxdom0w7',
    'cmrtq0u4m001c1yqc9d1uaxpa',
    'cmr8j0no202gu1yloehp1paf0',
    'cmr8ji60r02mu1ylohk4o3og1',
    'cmr8juhmj00051ygiqby5qjxv',
    'cmru8hze300az1yd6a1vcy2cy',
    'cmrrbw5u90002l104628kqnh7',
    'cmrsraxtm0001l404lq5ifx70',
    'cmqkgnrx80evsl3049nfobi3z',
    'cmr8adznj00tq1yw26o5bqez8',
    'cmrpw7a1r004d1yh5yn0ckm45'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b2_backup) <> 16 THEN
    RAISE EXCEPTION 'backup row count %, expected 16',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b2_backup);
  END IF;
END
$check$;
CREATE TABLE qbi_usmle_fullaudit_20261121_b2_stage (
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
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id0$cmr85uk1p001a1yw2c0lo2i36$id0$,
  $fx0$wrong_step|wrong_blueprint$fx0$,
  $sc0$A 40-year-old man presents with fatigue and muscle weakness. He has a history of hypertension and is currently taking lisinopril. Laboratory tests reveal elevated potassium levels of 6.5 mEq/L and a low serum sodium level. An ECG shows peaked T waves.$sc0$,
  $qu0$What is the next best step in management?$qu0$,
  $op0${"options":["Administer calcium gluconate","Initiate hemodialysis","Administer sodium bicarbonate","Increase lisinopril dosage"],"distractorRationale":{"Initiate hemodialysis":"While necessary in severe cases, it is not the immediate next step in this scenario.","Administer sodium bicarbonate":"This can be helpful but is not the first-line treatment in the presence of ECG changes.","Increase lisinopril dosage":"This would exacerbate hyperkalemia and is contraindicated."},"clinicalReasoning":"The patient's symptoms and lab results indicate significant hyperkalemia with cardiac changes. Analyzing the urgency of management leads to the conclusion that calcium gluconate is the appropriate immediate intervention.","keyTakeaways":["When faced with hyperkalemia and ECG changes, prioritize calcium gluconate to stabilize the heart."],"kind":"vignette","taskCategory":"communication","blueprintTopic":"contraception-pharmacology","blueprintSystem":"reproductive-endocrine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1783277558542","qcScore":8.1,"slotIndex":46,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-05T18:53:40.826Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$op0$,
  $ky0$Administer calcium gluconate$ky0$,
  $ex0$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex0$,
  5,
  $dm0$respiratory-renal$dm0$,
  $tp0$hyperkalemia$tp0$,
  $fd0$usmle-step-2$fd0$,
  $sl0$step2$sl0$,
  $su0$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su0$,
  $ch0$de4098b1b9ae4c8a696a7d119a6dfa25fdbcb4a6408b28c1596c27c39fe5159e$ch0$,
  true,
  $rf0$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf0$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id1$cmrpwiwvj006w1yrtz3cv3kmr$id1$,
  $fx1$stem_missing_detail|wrong_step|wrong_blueprint$fx1$,
  $sc1$A 58-year-old man with a history of chronic kidney disease presents to the emergency department with confusion and lethargy. He has missed his last two dialysis sessions and is found to have a blood pressure of 142/88 mm Hg, heart rate of 110 bpm, and a potassium level of 6.8 mEq/L on laboratory tests. Physical examination reveals diminished deep tendon reflexes and an irregular heart rhythm on auscultation. The ECG shows peaked T waves and a widened QRS complex.$sc1$,
  $qu1$What is the most appropriate next step in the management of this patient?$qu1$,
  $op1${"options":["Administer intravenous calcium gluconate","Initiate insulin (a glucose-lowering hormone) and glucose infusion","Perform hemodialysis","Administer sodium bicarbonate"],"distractorRationale":{"Administer intravenous calcium gluconate":"Calcium gluconate only stabilizes cardiac membranes but does not lower potassium levels, which is crucial in this case. (This highlights the importance of addressing the underlying cause of hyperkalemia rather than just its cardiac effects.)","Initiate insulin (a glucose-lowering hormone) and glucose infusion":"While insulin can temporarily shift potassium into cells, it does not remove it from the body, making it inadequate for severe cases like this one. (This emphasizes that temporary measures are not enough when immediate and definitive treatment is required.)","Administer sodium bicarbonate":"Sodium bicarbonate can help shift potassium temporarily but is less effective than hemodialysis in severe cases, especially in patients with renal failure. (This reinforces the need for definitive treatment in critical situations rather than relying on less effective options.)"},"clinicalReasoning":"Performing hemodialysis is the most effective way to manage this patient's severe hyperkalemia. **Severe hyperkalemia** (high potassium) can lead to life-threatening cardiac issues. Hemodialysis **rapidly removes** excess potassium from the bloodstream.","keyTakeaways":["When faced with severe hyperkalemia in a symptomatic patient, prioritize hemodialysis for immediate potassium removal."],"taskCategory":"clinical-intervention","blueprintTopic":"emergency-acls","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350723633","qcScore":7.9,"slotIndex":19,"stepLevel":"step1","examNumber":9104,"generatedAt":"2026-07-18T05:01:52.557Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op1$,
  $ky1$Administer intravenous calcium gluconate$ky1$,
  $ex1$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex1$,
  5,
  $dm1$respiratory-renal$dm1$,
  $tp1$hyperkalemia$tp1$,
  $fd1$usmle-step-2$fd1$,
  $sl1$step2$sl1$,
  $su1$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su1$,
  $ch1$7bac3b6c6aa80756695fb3c1dbd480db90ee77ecfe11ba913073680a211554c3$ch1$,
  true,
  $rf1$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf1$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id2$cmrr4ycyx002o1y6p2yq44ej3$id2$,
  $fx2$wrong_step|wrong_blueprint$fx2$,
  NULL,
  $qu2$A 40-year-old man with hypertension treated with lisinopril presents to the emergency department with nausea and vomiting. His blood pressure is 168/98 mm Hg. His serum creatinine is 3.1 mg/dL (1.0 mg/dL 3 months ago), and potassium is 6.5 mEq/L. A 12-lead ECG shows peaked T waves and a widened QRS complex. What is the most appropriate next step in management?$qu2$,
  $op2$["Administer calcium gluconate", "Give nebulized salbutamol as the only treatment", "Initiate dialysis", "Administer sodium bicarbonate"]$op2$,
  $ky2$Administer calcium gluconate$ky2$,
  $ex2$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex2$,
  5,
  $dm2$respiratory-renal$dm2$,
  $tp2$hyperkalemia$tp2$,
  $fd2$usmle-step-2$fd2$,
  $sl2$step2$sl2$,
  $su2$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su2$,
  $ch2$4f4d947cbc35fc4054e4ef782ada497067e6a2716b86b535113aaa03195748b9$ch2$,
  true,
  $rf2$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf2$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id3$cmrruakye00dp1y8wxboyh90x$id3$,
  $fx3$wrong_step|wrong_blueprint$fx3$,
  NULL,
  $qu3$A 58-year-old man with chronic kidney disease presents to the emergency department with confusion and lethargy. He takes lisinopril and furosemide. His blood pressure is 142/88 mm Hg, heart rate is 110/min, and respiratory rate is 22/min. His serum potassium is 6.8 mEq/L. A 12-lead ECG shows peaked T waves and a widened QRS complex. What is the most appropriate next step in management?$qu3$,
  $op3$["Administer calcium gluconate intravenously", "Initiate insulin (a glucose-lowering hormone) and glucose infusion", "Perform hemodialysis", "Administer sodium bicarbonate"]$op3$,
  $ky3$Administer calcium gluconate intravenously$ky3$,
  $ex3$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex3$,
  5,
  $dm3$respiratory-renal$dm3$,
  $tp3$hyperkalemia$tp3$,
  $fd3$usmle-step-2$fd3$,
  $sl3$step2$sl3$,
  $su3$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su3$,
  $ch3$26d45a90b9a3cdd464773ec27c51972424d24b5f899775d55c41aa1a8c48f42f$ch3$,
  true,
  $rf3$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf3$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id4$cmrrv651n00o71y8wwe9xb6k4$id4$,
  $fx4$wrong_step|wrong_blueprint$fx4$,
  $sc4$A 50-year-old woman with chronic kidney disease presents with fatigue and muscle cramps. Laboratory tests reveal a serum potassium level of 6.5 mEq/L. She is currently taking lisinopril and furosemide. An ECG shows peaked T waves and a widened QRS complex.$sc4$,
  $qu4$What is the most appropriate next step in management?$qu4$,
  $op4${"options":["Administer calcium gluconate","Start hemodialysis","Administer sodium bicarbonate","Increase furosemide dosage"],"distractorRationale":{"Start hemodialysis":"This option is incorrect as hemodialysis is not the immediate step; stabilization of the heart is the priority.","Administer sodium bicarbonate":"This distractor fails because while bicarbonate can help, it is not the first-line treatment to stabilize the myocardium.","Increase furosemide dosage":"This option is incorrect as increasing furosemide may help, but it does not address the immediate risk of cardiac arrhythmias."},"clinicalReasoning":"Assess the ECG changes, analyze the serum potassium level, and integrate the management guidelines for hyperkalemia to determine that calcium gluconate is the priority.","keyTakeaways":["When faced with hyperkalemia and ECG changes, prioritize calcium gluconate to stabilize the heart before other treatments."],"kind":"calculation","taskCategory":"communication","blueprintTopic":"aki-mechanisms","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784469290353","qcScore":8.2,"slotIndex":14,"stepLevel":"step1","examNumber":9112,"generatedAt":"2026-07-19T13:55:34.909Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$op4$,
  $ky4$Administer calcium gluconate$ky4$,
  $ex4$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex4$,
  4,
  $dm4$respiratory-renal$dm4$,
  $tp4$hyperkalemia$tp4$,
  $fd4$usmle-step-2$fd4$,
  $sl4$step2$sl4$,
  $su4$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su4$,
  $ch4$8a956f0af1339463a394a0357454233647813083bc7f3173b5f449b4cf3d01bb$ch4$,
  true,
  $rf4$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf4$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id5$cmrrw4xqv00g41yl8gxdom0w7$id5$,
  $fx5$stem_missing_detail|wrong_blueprint$fx5$,
  $sc5$A 58-year-old man with a history of chronic kidney disease presents to the emergency department with fatigue and weakness. Laboratory tests reveal a serum creatinine of 3.2 mg/dL, potassium of 6.5 mEq/L, and bicarbonate level of 18 mEq/L. He is currently taking lisinopril and metformin and has no known drug allergies. The ECG shows peaked T waves and a widened QRS complex.$sc5$,
  $qu5$What is the next best step in the management of this patient?$qu5$,
  $op5${"options":["Calcium gluconate","Sodium polystyrene sulfonate","Insulin","Furosemide"],"distractorRationale":{"Sodium polystyrene sulfonate":"However, sodium polystyrene sulfonate works slowly and is not effective for immediate cardiac stabilization. (This highlights the importance of prioritizing acute interventions in hyperkalemia.)","Insulin":"While insulin can lower potassium, it does not provide immediate cardiac protection, which is critical in this scenario. (This emphasizes the need to stabilize the heart before addressing potassium levels.)","Furosemide":"Furosemide is not effective for immediate potassium stabilization and does not address the urgent need for cardiac protection. (This reinforces the concept that acute management must focus on immediate risks, such as cardiac arrhythmias.)"},"clinicalReasoning":"Calcium gluconate is the best initial treatment for hyperkalemia to protect the heart. **Hyperkalemia** (high potassium) can lead to serious cardiac issues. Calcium gluconate **stabilizes cardiac membranes**, reducing the risk of arrhythmias.","keyTakeaways":["When faced with hyperkalemia, prioritize calcium gluconate to protect the heart before other treatments."],"taskCategory":"clinical-intervention","blueprintTopic":"diagnostic-test-interpretation","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1784471065807","qcScore":7.9,"slotIndex":13,"stepLevel":"step2","examNumber":9208,"generatedAt":"2026-07-19T14:25:06.910Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"}}$op5$,
  $ky5$Calcium gluconate$ky5$,
  $ex5$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex5$,
  3,
  $dm5$respiratory-renal$dm5$,
  $tp5$hyperkalemia$tp5$,
  $fd5$usmle-step-2$fd5$,
  $sl5$step2$sl5$,
  $su5$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su5$,
  $ch5$1863773cec19770edbeccb1247f752e90d1a90e9ad7e0c8b7bcae8aebb5d195f$ch5$,
  true,
  $rf5$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf5$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id6$cmrtq0u4m001c1yqc9d1uaxpa$id6$,
  $fx6$stem_missing_detail|wrong_blueprint$fx6$,
  $sc6$A 50-year-old man with a history of chronic kidney disease presents with fatigue and muscle weakness. His laboratory results show a potassium level of 6.5 mEq/L, creatinine of 3.2 mg/dL, and a bicarbonate level of 18 mEq/L. He reports taking an ACE inhibitor for hypertension. The ECG shows peaked T waves and a widened QRS complex.$sc6$,
  $qu6$What is the most appropriate next step in management?$qu6$,
  $op6${"options":["Administer calcium gluconate","Initiate dialysis","Start sodium bicarbonate","Discontinue the ACE inhibitor"],"distractorRationale":{"Initiate dialysis":"This option is incorrect as dialysis is not the immediate management for hyperkalemia; stabilization of the cardiac membrane takes precedence.","Start sodium bicarbonate":"This option fails because while sodium bicarbonate can help, it is not the first-line treatment in this acute setting.","Discontinue the ACE inhibitor":"This option is misleading; while stopping the ACE inhibitor is important, it does not provide immediate management for hyperkalemia."},"clinicalReasoning":"Assess the patient's potassium level and symptoms to determine the severity of hyperkalemia. Analyze the need for immediate stabilization of the cardiac membrane and integrate this information to conclude that administering calcium gluconate is the most appropriate next step.","keyTakeaways":["When faced with hyperkalemia, prioritize cardiac stabilization with calcium gluconate first."],"kind":"vignette","stepLevel":"step2","blueprintSystem":"internal-medicine","blueprintTopic":"hiv-opportunistic","physicianTask":"professionalism","generationMeta":{"batchId":"raise-exam-ready-usmle-step-2-1784581095601","examNumber":9501,"slotIndex":25,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-20T21:06:38.134Z"}}$op6$,
  $ky6$Administer calcium gluconate$ky6$,
  $ex6$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex6$,
  4,
  $dm6$respiratory-renal$dm6$,
  $tp6$hyperkalemia$tp6$,
  $fd6$usmle-step-2$fd6$,
  $sl6$step2$sl6$,
  $su6$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su6$,
  $ch6$c26d8f386c117a9294806d1972bdf17a795a0d026f809ed02dc940097c47083e$ch6$,
  true,
  $rf6$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf6$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id7$cmr8j0no202gu1yloehp1paf0$id7$,
  $fx7$stem_missing_detail|wrong_blueprint$fx7$,
  $sc7$A 60-year-old woman with a history of chronic kidney disease presents to the clinic for follow-up. Her lab results show a serum creatinine of 2.5 mg/dL and a potassium level of 6.2 mEq/L. She reports muscle weakness and fatigue. The ECG shows peaked T waves and a widened QRS complex.$sc7$,
  $qu7$What is the most appropriate next step in management?$qu7$,
  $op7${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-discharge-planning","physicianTask":"clinical-intervention","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783300023028","qcScore":8.1,"slotIndex":26,"stepLevel":"step3","examNumber":9328,"generatedAt":"2026-07-06T01:08:30.703Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Administer calcium gluconate","Start hemodialysis","Give sodium bicarbonate","Initiate insulin and glucose infusion"],"taskCategory":"clinical-intervention"}$op7$,
  $ky7$Administer calcium gluconate$ky7$,
  $ex7$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex7$,
  4,
  $dm7$respiratory-renal$dm7$,
  $tp7$hyperkalemia$tp7$,
  $fd7$usmle-step-3$fd7$,
  $sl7$step3$sl7$,
  $su7$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su7$,
  $ch7$5055f97b17afa1b24c46f52e659e220887a3914dd83da437e2e596a94696b74e$ch7$,
  true,
  $rf7$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf7$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id8$cmr8ji60r02mu1ylohk4o3og1$id8$,
  $fx8$stem_missing_detail|wrong_blueprint$fx8$,
  $sc8$A 72-year-old woman presents with confusion, lethargy, and a history of chronic kidney disease. Her serum creatinine is 3.2 mg/dL, and her potassium level is 6.5 mEq/L. She is currently taking lisinopril and furosemide. The ECG shows peaked T waves and a widened QRS complex.$sc8$,
  $qu8$What is the next best step in management?$qu8$,
  $op8${"kind":"ethics","stepLevel":"step3","blueprintSystem":"ethics","blueprintTopic":"confidentiality-reporting","physicianTask":"pharmacotherapy","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783300834887","qcScore":8.2,"slotIndex":4,"stepLevel":"step3","examNumber":9330,"generatedAt":"2026-07-06T01:21:38.684Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Administer calcium gluconate","Start hemodialysis","Increase furosemide dose","Administer sodium bicarbonate"],"taskCategory":"pharmacotherapy"}$op8$,
  $ky8$Administer calcium gluconate$ky8$,
  $ex8$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex8$,
  4,
  $dm8$respiratory-renal$dm8$,
  $tp8$hyperkalemia$tp8$,
  $fd8$usmle-step-3$fd8$,
  $sl8$step3$sl8$,
  $su8$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su8$,
  $ch8$c90a18bcb470c405ac0ca80382f64f5907d702feadb7f30ddffcdc995a43c351$ch8$,
  true,
  $rf8$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf8$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id9$cmr8juhmj00051ygiqby5qjxv$id9$,
  $fx9$stem_missing_detail|wrong_blueprint$fx9$,
  $sc9$A 65-year-old man with chronic kidney disease presents with fatigue and weakness. His laboratory tests reveal a potassium level of 6.2 mEq/L, a creatinine level of 3.5 mg/dL, and a bicarbonate level of 18 mEq/L. He is currently on a low-potassium diet and medications for hypertension. The ECG shows peaked T waves and a widened QRS complex.$sc9$,
  $qu9$What is the most appropriate next step in management?$qu9$,
  $op9${"options":["Administer calcium gluconate","Start sodium bicarbonate","Initiate hemodialysis","Give insulin (a glucose-lowering hormone) and glucose"],"distractorRationale":{"Start sodium bicarbonate":"This can help but is not the immediate priority in acute hyperkalemia.","Initiate hemodialysis":"This is necessary for severe cases but not the first step in acute management.","Give insulin (a glucose-lowering hormone) and glucose":"While effective, this should follow calcium administration in acute settings."},"clinicalReasoning":"The patient's hyperkalemia poses a risk for cardiac complications. Administering calcium gluconate is crucial for membrane stabilization before other treatments to lower potassium levels.","kind":"vignette","stepLevel":"step3","blueprintSystem":"surgery","blueprintTopic":"post-op-fever","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783301311491","examNumber":9301,"slotIndex":5,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-07-06T01:29:35.576Z"}}$op9$,
  $ky9$Administer calcium gluconate$ky9$,
  $ex9$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex9$,
  4,
  $dm9$respiratory-renal$dm9$,
  $tp9$hyperkalemia$tp9$,
  $fd9$usmle-step-3$fd9$,
  $sl9$step3$sl9$,
  $su9$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su9$,
  $ch9$38b85af42a05f629c9eb382f3ce502275d740edefb8c4a5eb15308fa533d8c00$ch9$,
  true,
  $rf9$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf9$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id10$cmru8hze300az1yd6a1vcy2cy$id10$,
  $fx10$stem_missing_detail|wrong_blueprint$fx10$,
  $sc10$A 50-year-old man with a history of chronic kidney disease presents to the emergency department with nausea, vomiting, and confusion. His laboratory results show a serum creatinine of 4.5 mg/dL and a potassium level of 6.2 mEq/L. The ECG shows peaked T waves and a widened QRS complex.$sc10$,
  $qu10$What is the most appropriate next step in management?$qu10$,
  $op10${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-monitoring-escalation","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784612691636","examNumber":9304,"slotIndex":45,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-21T05:45:46.387Z"},"options":["Administer sodium bicarbonate","Initiate dialysis","Give calcium gluconate","Start insulin and glucose"]}$op10$,
  $ky10$Give calcium gluconate$ky10$,
  $ex10$The ECG shows a widened QRS, so intravenous calcium is the immediate step. The Merck Manual states that calcium is indicated when hyperkalemia widens the QRS or the P wave is lost, because calcium antagonizes the effect on cardiac muscle. Insulin with glucose shifts potassium later. Dialysis removes potassium but does not stabilize the membrane first. Bicarbonate is not the first drug when the QRS is wide.$ex10$,
  3,
  $dm10$respiratory-renal$dm10$,
  $tp10$hyperkalemia$tp10$,
  $fd10$usmle-step-3$fd10$,
  $sl10$step3$sl10$,
  $su10$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia$su10$,
  $ch10$f1bc490b3912d9965ee72d599a199523618c919c8fa8546687018c74a68e84fd$ch10$,
  true,
  $rf10$[{"label": "Merck Manual Professional hyperkalemia", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/electrolyte-disorders/hyperkalemia", "quote": "If ECG changes include the loss of P-wave or widening of the QRS complex, treatment with IV calcium as well as insulin and glucose is indicated."}]$rf10$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id11$cmrrbw5u90002l104628kqnh7$id11$,
  $fx11$stem_missing_detail|wrong_step|wrong_blueprint$fx11$,
  $sc11$A 35-year-old male presents to the emergency department after accidentally spraying himself with a pesticide containing organophosphates. He exhibits excessive salivation, miosis, muscle twitching, bradycardia, and hypotension. Given his symptoms and recent exposure, the medical team suspects organophosphate poisoning. Atropine has already been given, and the airway secretions have dried.$sc11$,
  $qu11$What is the next best step in management for this patient?$qu11$,
  $op11${"options":["Pralidoxime","Naloxone","Flumazenil","Physostigmine"],"distractorRationale":{"Naloxone":"Naloxone specifically targets opioid overdose and does not counteract the cholinergic effects caused by organophosphates. (Understanding the specific mechanisms of poisoning is key to selecting the appropriate antidote.)","Flumazenil":"Flumazenil is a benzodiazepine antagonist and is not effective for organophosphate toxicity; it can also induce seizures in this context. (Recognizing the specific drug classes and their antidotes is crucial in toxicology.)","Physostigmine":"Physostigmine would worsen the patient's condition by further increasing acetylcholine levels, exacerbating cholinergic symptoms. (It's important to differentiate between reversible and irreversible inhibitors in managing poisoning.)"},"clinicalReasoning":"Pralidoxime is the best choice for reversing organophosphate poisoning. **Pralidoxime** reactivates acetylcholinesterase, which is inhibited by organophosphates. This action helps to **reduce** the accumulation of **acetylcholine**, alleviating cholinergic symptoms.","keyTakeaways":["When faced with organophosphate poisoning, prioritize pralidoxime to restore acetylcholinesterase function."]}$op11$,
  $ky11$Pralidoxime$ky11$,
  $ex11$Atropine has already dried the secretions. Muscle twitching is a nicotinic effect. The Merck Manual gives pralidoxime after atropine to treat neuromuscular toxicity from organophosphate poisoning. Naloxone, flumazenil, and physostigmine do not regenerate acetylcholinesterase. Physostigmine would add more cholinergic stimulation.$ex11$,
  3,
  $dm11$multisystem$dm11$,
  $tp11$organophosphate-poisoning$tp11$,
  $fd11$usmle-step-2$fd11$,
  $sl11$step2$sl11$,
  $su11$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning$su11$,
  $ch11$5fcd2a1ea90ea1677a7ff7a842c22ade3c6e0a9fe50e9eb82fe50d53e5f9f43d$ch11$,
  true,
  $rf11$[{"label": "Merck Manual Professional organophosphate poisoning", "url": "https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning", "quote": "Pralidoxime (2-PAM) is given after atropine to relieve neuromuscular symptoms."}]$rf11$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id12$cmrsraxtm0001l404lq5ifx70$id12$,
  $fx12$stem_missing_detail|wrong_step|wrong_blueprint$fx12$,
  $sc12$A 35-year-old male presents to the emergency department with excessive salivation, miosis, and muscle twitching after accidentally spraying himself with a pesticide. His vital signs show bradycardia and hypotension. The patient has a history of asthma and is currently taking albuterol. Neurological examination reveals fasciculations and weakness. Atropine has already been given, and the airway secretions have dried.$sc12$,
  $qu12$What is the next best step in management for this patient?$qu12$,
  $op12${"options":["Pralidoxime","Naloxone","Flumazenil","Physostigmine"],"distractorRationale":{"Naloxone":"Naloxone specifically targets opioid overdose and does not reverse the effects of organophosphate poisoning. (Understanding the specific antidote for the type of poisoning is crucial in emergency management.)","Flumazenil":"Flumazenil is a benzodiazepine antagonist and does not address the cholinergic crisis caused by organophosphates. (Recognizing the mechanism of action of antidotes is essential for effective treatment.)","Physostigmine":"Physostigmine is a reversible inhibitor and would exacerbate symptoms by increasing acetylcholine levels further in organophosphate poisoning. (It's important to differentiate between types of acetylcholinesterase inhibitors when managing poisoning.)"},"clinicalReasoning":"Pralidoxime is the best choice to treat organophosphate poisoning by reactivating acetylcholinesterase. **Organophosphate poisoning** leads to excessive acetylcholine due to inhibited acetylcholinesterase. Pralidoxime **reactivates** acetylcholinesterase, reversing the toxic effects.","keyTakeaways":["When dealing with organophosphate poisoning, always prioritize pralidoxime to reverse acetylcholinesterase inhibition."]}$op12$,
  $ky12$Pralidoxime$ky12$,
  $ex12$Atropine has already dried the secretions. Muscle twitching is a nicotinic effect. The Merck Manual gives pralidoxime after atropine to treat neuromuscular toxicity from organophosphate poisoning. Naloxone, flumazenil, and physostigmine do not regenerate acetylcholinesterase. Physostigmine would add more cholinergic stimulation.$ex12$,
  3,
  $dm12$multisystem$dm12$,
  $tp12$organophosphate-poisoning$tp12$,
  $fd12$usmle-step-2$fd12$,
  $sl12$step2$sl12$,
  $su12$https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning$su12$,
  $ch12$ce300ba60e5c85cb507b843086543011bae610598516ffc32617871923ddea4e$ch12$,
  true,
  $rf12$[{"label": "Merck Manual Professional organophosphate poisoning", "url": "https://www.merckmanuals.com/professional/injuries-poisoning/poisoning/organophosphate-poisoning-and-carbamate-poisoning", "quote": "Pralidoxime (2-PAM) is given after atropine to relieve neuromuscular symptoms."}]$rf12$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id13$cmqkgnrx80evsl3049nfobi3z$id13$,
  $fx13$stem_missing_detail|wrong_step|wrong_blueprint$fx13$,
  $sc13$A 21-year-old man presents to the emergency department with polyuria, polydipsia, nausea, and abdominal pain after running out of insulin for the past two days while traveling. His vital signs show a blood pressure of 102/64 mmHg, heart rate of 118 bpm, and respiratory rate of 28 breaths per minute. Physical examination reveals Kussmaul respirations, dry mucous membranes, and a fruity odor on his breath. Laboratory tests indicate a glucose level of 486 mg/dL, arterial blood pH of 7.18 and serum potassium of 4.8 mEq/L.$sc13$,
  $qu13$What is the most appropriate management for this patient?$qu13$,
  $op13${"options": ["Isotonic IV fluids followed by insulin drip with hourly glucose and electrolyte monitoring", "Subcutaneous insulin, the hormone that moves glucose into cells, administration only, at the usual dose and route for that treatment", "Bicarbonate infusion due to severe acidosis", "Oral rehydration therapy alone"], "distractorRationale": {"Subcutaneous insulin, the hormone that moves glucose into cells, administration only, at the usual dose and route for that treatment": "This option fails because it does not address the critical dehydration and electrolyte imbalances that occur in DKA, which require IV fluids for rapid correction. (Effective DKA management must include both fluid resuscitation and insulin therapy.)", "Bicarbonate infusion due to severe acidosis": "This option is incorrect because bicarbonate is not routinely recommended for DKA unless the acidosis is life-threatening; the primary treatment focuses on insulin and fluids. (The mainstay of DKA treatment is insulin and fluid replacement, not bicarbonate therapy.)", "Oral rehydration therapy alone": "This fails here because a patient in DKA is often too ill to tolerate oral intake and requires IV fluids for effective rehydration. (In DKA, IV fluids are essential for rapid rehydration and management of metabolic derangements.)"}, "clinicalReasoning": "Isotonic IV fluids followed by insulin drip is the most appropriate management for this patient in DKA. **Diabetic ketoacidosis (DKA)** requires urgent treatment to correct **dehydration** and **hyperglycemia**. Isotonic IV fluids help restore **circulatory volume** and improve renal perfusion.", "keyTakeaways": ["When managing DKA, prioritize isotonic IV fluids and insulin therapy to address dehydration and hyperglycemia effectively."], "blueprintTopic": "heart-failure-pathophysiology", "blueprintSystem": "cardiovascular"}$op13$,
  $ky13$Isotonic IV fluids followed by insulin drip with hourly glucose and electrolyte monitoring$ky13$,
  $ex13$This is diabetic ketoacidosis: glucose 486 mg/dL, Kussmaul breathing, and arterial pH 7.18. The Merck Manual treats DKA with intravenous saline volume expansion and intravenous insulin, and it says bicarbonate is not routine unless the pH is below 7. Potassium is 4.8 mEq/L, so insulin does not have to be held. Subcutaneous insulin alone and oral fluids do not restore intravascular volume in this patient.$ex13$,
  3,
  $dm13$reproductive-endocrine$dm13$,
  $tp13$diabetic-ketoacidosis$tp13$,
  $fd13$usmle-step-2$fd13$,
  $sl13$step2$sl13$,
  $su13$https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka$su13$,
  $ch13$e23d1adb17c677f378478003fbaf3f0fe4673d415d19a0164c4a7d9fe10981f4$ch13$,
  true,
  $rf13$[{"label": "Merck Manual Professional diabetic ketoacidosis", "url": "https://www.merckmanuals.com/professional/endocrine-and-metabolic-disorders/diabetes-mellitus-and-disorders-of-carbohydrate-metabolism/diabetic-ketoacidosis-dka", "quote": "Correct acidosis and hyperglycemia with IV fluid and insulin. Bicarbonate should not be given routinely. If bicarbonate is used, it should be started only if the pH is < 7."}]$rf13$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id14$cmr8adznj00tq1yw26o5bqez8$id14$,
  $fx14$wrong_step|wrong_blueprint$fx14$,
  NULL,
  $qu14$A 70-year-old man presents with sudden onset of right-sided weakness and difficulty speaking. His blood pressure is 180/100 mm Hg. A noncontrast CT scan of the head shows no hemorrhage and no early ischemic changes. He has a history of hypertension and hyperlipidemia. He was last known well 90 minutes ago. Fingerstick glucose is 110 mg/dL. He takes no anticoagulant medication; INR is 1.0, and platelet count is 230,000/mm³. What is the next best step in management?$qu14$,
  $op14$["Administer tissue plasminogen activator", "Initiate anticoagulation therapy", "Perform a carotid endarterectomy", "Start aspirin (an antiplatelet drug) therapy"]$op14$,
  $ky14$Administer tissue plasminogen activator$ky14$,
  $ex14$Last known well was 90 minutes ago, noncontrast CT shows no hemorrhage, and blood pressure is 180/100 mm Hg, under the 185/110 mm Hg alteplase limit. The 2018 AHA/ASA guideline recommends IV alteplase in that window without waiting for more imaging.$ex14$,
  4,
  $dm14$behavioral-nervous$dm14$,
  $tp14$acute-ischemic-stroke$tp14$,
  $fd14$usmle-step-2$fd14$,
  $sl14$step2$sl14$,
  $su14$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su14$,
  $ch14$b0ed34c7a9229154b190a442736ead7b5b574023070d25120ed327f021829066$ch14$,
  true,
  $rf14$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "If BP is not maintained at or below 185/110 mm Hg, do not administer alteplase. IV alteplase is recommended within 4.5 hours of last known well for eligible patients."}]$rf14$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b2_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id15$cmrpw7a1r004d1yh5yn0ckm45$id15$,
  $fx15$wrong_step|wrong_blueprint$fx15$,
  NULL,
  $qu15$A 70-year-old man with a history of hypertension and diabetes presents to the emergency department with sudden onset of disabling right-sided weakness and slurred speech that began 2 hours ago, when he was last known to be well. A noncontrast CT scan shows no hemorrhage. His blood pressure is 190/110 mm Hg. Fingerstick glucose is 110 mg/dL, INR is 1.0, and he takes no anticoagulant. Thrombolysis is planned. What is the most appropriate next step in management?$qu15$,
  $op15$["Administer thrombolytics now", "Initiate aspirin (an antiplatelet drug) therapy", "Lower blood pressure to below 185/110 mm Hg", "Obtain an MRI of the brain"]$op15$,
  $ky15$Lower blood pressure to below 185/110 mm Hg$ky15$,
  $ex15$Blood pressure is 190/110 mm Hg, which is above the alteplase limit. The 2018 AHA/ASA guideline says to lower blood pressure that is above 185/110 mm Hg before IV alteplase, and not to give alteplase if that pressure cannot be reached. He was last known well 2 hours ago and the CT shows no hemorrhage, so thrombolysis is the plan after the pressure is lowered, not before.$ex15$,
  2,
  $dm15$behavioral-nervous$dm15$,
  $tp15$acute-ischemic-stroke$tp15$,
  $fd15$usmle-step-2$fd15$,
  $sl15$step2$sl15$,
  $su15$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su15$,
  $ch15$774022875f97f61abd0a3ca91cda69e88c7595202ae10fc51070fc273b7b85e5$ch15$,
  true,
  $rf15$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "If BP is not maintained at or below 185/110 mm Hg, do not administer alteplase. IV alteplase is recommended within 4.5 hours of last known well for eligible patients."}]$rf15$::jsonb
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b2_stage) <> 16 THEN
    RAISE EXCEPTION 'stage row count %, expected 16',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b2_stage);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_fullaudit_20261121_b2_stage
    WHERE position(correct_answer IN options) = 0
  ) THEN
    RAISE EXCEPTION 'a staged key is not contained in the staged options text';
  END IF;
END
$check$;
COMMIT;

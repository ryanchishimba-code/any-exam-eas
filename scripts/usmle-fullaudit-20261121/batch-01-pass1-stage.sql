-- Stage pass 1, batch 1 of the 2026-11-21 full USMLE audit.
-- 26 served items. Creates a backup and a staging table.
-- Does not update "QuestionBankItem".
-- Keys are the original teaching points. Stems gain the missing fact
-- (last known well, a negative noncontrast CT, or an unambiguous blood pressure).
-- Do not run against production until this draft is accepted.
-- Command:
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/usmle-fullaudit-20261121/batch-01-pass1-stage.sql
BEGIN;
-- Safe to re-run only before apply. Re-running after apply would replace the
-- undo snapshot with the already-updated rows.
DROP TABLE IF EXISTS qbi_usmle_fullaudit_20261121_b1_stage;
DROP TABLE IF EXISTS qbi_usmle_fullaudit_20261121_b1_backup;
CREATE TABLE qbi_usmle_fullaudit_20261121_b1_backup AS
SELECT * FROM "QuestionBankItem"
WHERE id IN (
    'cmrpwciga004e1yrthi17qqgr',
    'cmrrv655e00o81y8w6bybtbh2',
    'cmr4k47u200pp1ydegftdc2j5',
    'cmr4cbwvp00l01ykycd78lb8u',
    'cmr8bhkea007x1ylox2ncybge',
    'cmr8db7h400tp1ylohag1hytw',
    'cmr8db9dh00u81yloyl3vswl1',
    'cmr8diix000y11yloiuh6fvxe',
    'cmr8ei2hz01bd1ylozg5vo1sh',
    'cmr8hrrck023d1ylofdf5b0z0',
    'cmr8juid5000e1ygij3t6vg1p',
    'cmr8lyx3l00g51ygiy95hucha',
    'cmr8ny51q01011yginhec8d8a',
    'cmr97i2kf004k1ywykxhklcie',
    'cmr98mmff00kq1ywy10umjsxj',
    'cmr9c367u01nm1ywytyuu68vs',
    'cmru855h7003r1yd6lepkaro9',
    'cmru8bgv9007y1yd6w8ckx8ro',
    'cmrruacdw00d01y8waae1fflb',
    'cmr877jmy00dg1yr94tlzmcg9',
    'cmtps7vok000r1y1qcjq7w4p4',
    'cmrsew9ng00091y55d5mgnxf5',
    'cmr8albv601al1yr95vxhgi66',
    'cmr877l9v00e01yr9qrz8qsxm',
    'cmrtprw7t00001yqcnic91y3b',
    'cmr8atteh00041ylofmrz2bg5'
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b1_backup) <> 26 THEN
    RAISE EXCEPTION 'backup row count %, expected 26',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b1_backup);
  END IF;
END
$check$;
CREATE TABLE qbi_usmle_fullaudit_20261121_b1_stage (
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
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id0$cmrpwciga004e1yrthi17qqgr$id0$,
  $fx0$stem_missing_detail|wrong_blueprint|wrong_step$fx0$,
  $sc0$A 60-year-old woman with a history of hypertension and hyperlipidemia presents with sudden onset of right-sided weakness and difficulty speaking. Her blood pressure is 180/100 mm Hg, and a noncontrast CT scan of the head shows an ischemic stroke in the left middle cerebral artery territory. The noncontrast CT shows no hemorrhage. The patient was last known well 90 minutes ago.$sc0$,
  $qu0$What is the next best step in management?$qu0$,
  $op0${"options":["Administer aspirin","Initiate thrombolytic therapy","Start anticoagulation therapy","Perform carotid endarterectomy"],"distractorRationale":{"Administer aspirin":"Aspirin is not the first-line treatment in the acute phase of ischemic stroke; thrombolytics are preferred.","Start anticoagulation therapy":"Anticoagulation is not indicated in the acute phase of ischemic stroke unless there is a specific indication.","Perform carotid endarterectomy":"This is a surgical intervention for chronic carotid stenosis, not for acute stroke management."},"clinicalReasoning":"Assess the patient's clinical presentation and CT findings to confirm an ischemic stroke. Analyze the time since symptom onset and the eligibility for thrombolytic therapy to determine the most appropriate next step in management.","keyTakeaways":["When managing an acute ischemic stroke, prioritize thrombolytic therapy within the treatment window."],"kind":"lab_interpretation","taskCategory":"communication","blueprintTopic":"anemia-workup","blueprintSystem":"hematology-immunology","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784350382703","qcScore":8.1,"slotIndex":2,"stepLevel":"step1","examNumber":9103,"generatedAt":"2026-07-18T04:53:49.883Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"communication"}$op0$,
  $ky0$Initiate thrombolytic therapy$ky0$,
  $ex0$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex0$,
  3,
  $dm0$behavioral-nervous$dm0$,
  $tp0$acute-ischemic-stroke$tp0$,
  $fd0$usmle-step-2$fd0$,
  $sl0$step2$sl0$,
  $su0$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su0$,
  $ch0$e4d547701a6e2a464eac87bfc09ab573e755a5f4f0021ae2f2af48f687844624$ch0$,
  true,
  $rf0$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf0$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id1$cmrrv655e00o81y8w6bybtbh2$id1$,
  $fx1$stem_missing_detail|wrong_blueprint|wrong_step$fx1$,
  $sc1$A 70-year-old man presents with sudden onset of right-sided weakness and difficulty speaking. His blood pressure is 180/100 mm Hg, and a noncontrast CT scan of the head shows an ischemic stroke in the left middle cerebral artery territory. The noncontrast CT shows no hemorrhage. The patient was last known well 90 minutes ago.$sc1$,
  $qu1$What is the next best step in management?$qu1$,
  $op1${"options":["Administer thrombolytics","Initiate aspirin therapy","Obtain a carotid ultrasound","Start anticoagulation therapy"],"distractorRationale":{"Initiate aspirin therapy":"This option is incorrect as aspirin is not the first-line treatment in the acute phase of an ischemic stroke; thrombolytics are prioritized.","Obtain a carotid ultrasound":"This distractor fails because while carotid ultrasound is important for evaluating stroke risk, it is not an immediate step in acute management.","Start anticoagulation therapy":"This option is incorrect as anticoagulation is not indicated in the acute management of ischemic stroke unless atrial fibrillation is present."},"clinicalReasoning":"Assess the clinical presentation and imaging findings, analyze the treatment guidelines for ischemic stroke, and integrate the urgency of thrombolytic therapy.","keyTakeaways":["When managing an ischemic stroke, prioritize thrombolytics within the first few hours to maximize recovery potential."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"pe-pathophysiology","blueprintSystem":"respiratory-renal","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784469290353","qcScore":8.1,"slotIndex":15,"stepLevel":"step1","examNumber":9112,"generatedAt":"2026-07-19T13:55:34.910Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"professionalism"}$op1$,
  $ky1$Administer thrombolytics$ky1$,
  $ex1$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex1$,
  5,
  $dm1$behavioral-nervous$dm1$,
  $tp1$acute-ischemic-stroke$tp1$,
  $fd1$usmle-step-2$fd1$,
  $sl1$step2$sl1$,
  $su1$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su1$,
  $ch1$ec4856c6461456211272b01490ef9bd5ec23e74aa84020f1a3464bac8ba2f182$ch1$,
  true,
  $rf1$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf1$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id2$cmr4k47u200pp1ydegftdc2j5$id2$,
  $fx2$stem_missing_detail|wrong_blueprint$fx2$,
  $sc2$A 72-year-old woman presents to the emergency department with sudden onset of right-sided weakness and difficulty speaking. Her blood pressure is 180/100 mm Hg, heart rate is 88 bpm, and she is afebrile. A noncontrast CT scan of the head shows an area of hypodensity in the left middle cerebral artery territory. She has a history of hypertension and hyperlipidemia but is not on any medications. Her NIH Stroke Scale score is 12. The noncontrast CT shows no hemorrhage. The patient was last known well 90 minutes ago.$sc2$,
  $qu2$What is the most appropriate next step in management?$qu2$,
  $op2${"kind":"sequential","stepLevel":"step2","blueprintSystem":"pediatrics","blueprintTopic":"developmental-milestones","physicianTask":"health-maintenance","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783059787834","qcScore":8.3,"slotIndex":11,"stepLevel":"step2","examNumber":9209,"generatedAt":"2026-07-03T06:26:15.729Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Administer intravenous thrombolysis with alteplase","Start aspirin therapy","Obtain a carotid ultrasound","Initiate anticoagulation with warfarin (a vitamin K antagonist)"],"taskCategory":"health-maintenance"}$op2$,
  $ky2$Administer intravenous thrombolysis with alteplase$ky2$,
  $ex2$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex2$,
  2,
  $dm2$behavioral-nervous$dm2$,
  $tp2$acute-ischemic-stroke$tp2$,
  $fd2$usmle-step-2$fd2$,
  $sl2$step2$sl2$,
  $su2$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su2$,
  $ch2$253b7cb456517a83e4cdb6ea4dbc4dc0e91b39709b400a2f07767e33cddce679$ch2$,
  true,
  $rf2$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf2$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id3$cmr4cbwvp00l01ykycd78lb8u$id3$,
  $fx3$stem_missing_detail|wrong_blueprint$fx3$,
  $sc3$A 60-year-old woman presents to the emergency department with acute onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mm Hg, and her neurological exam shows a right-sided hemiparesis. A noncontrast CT scan of the head shows no acute hemorrhage. The patient was last known well 90 minutes ago.$sc3$,
  $qu3$What is the most appropriate next step in management?$qu3$,
  $op3${"options":["Administer intravenous thrombolytics","Start aspirin therapy (give aspirin)","Obtain an MRI of the brain","Initiate blood pressure management"],"distractorRationale":{"Start aspirin therapy (give aspirin)":"While necessary, it is not the immediate step for a candidate for thrombolysis.","Obtain an MRI of the brain":"This is not necessary at this stage and can delay treatment.","Initiate blood pressure management":"Important, but should not delay thrombolysis if indicated."},"clinicalReasoning":"Assess the patient's neurological symptoms and imaging results to identify the acute condition. Analyze the eligibility for thrombolytics based on time and imaging. Integrate this information to conclude that administering intravenous thrombolytics is the priority.","keyTakeaways":["When faced with acute ischemic stroke and no hemorrhage, prioritize thrombolytics within the treatment window."],"kind":"vignette","taskCategory":"pharmacotherapy","blueprintTopic":"diagnostic-test-interpretation","blueprintSystem":"pharm-advertising","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783046983637","qcScore":8.1,"slotIndex":34,"stepLevel":"step3","examNumber":9307,"generatedAt":"2026-07-03T02:50:37.236Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step3","physicianTask":"pharmacotherapy"}$op3$,
  $ky3$Administer intravenous thrombolytics$ky3$,
  $ex3$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex3$,
  3,
  $dm3$behavioral-nervous$dm3$,
  $tp3$acute-ischemic-stroke$tp3$,
  $fd3$usmle-step-3$fd3$,
  $sl3$step3$sl3$,
  $su3$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su3$,
  $ch3$02dc8489215424dd44c9267675259019142869b9f2adeaf4aacc0f6a4b7f9d48$ch3$,
  true,
  $rf3$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf3$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id4$cmr8bhkea007x1ylox2ncybge$id4$,
  $fx4$stem_missing_detail|wrong_blueprint$fx4$,
  $sc4$A 72-year-old woman with a history of hypertension and hyperlipidemia presents to the emergency department with sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mm Hg, and she has a right-sided facial droop. A noncontrast CT scan of the head shows no acute intracranial hemorrhage. The patient was last known well 90 minutes ago.$sc4$,
  $qu4$What is the next best step in management?$qu4$,
  $op4${"kind":"biostats","stepLevel":"step3","blueprintSystem":"biostatistics","blueprintTopic":"sensitivity-specificity-lr","physicianTask":"professionalism","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783287433114","qcScore":8.1,"slotIndex":55,"stepLevel":"step3","examNumber":9303,"generatedAt":"2026-07-05T21:38:16.563Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Administer intravenous thrombolysis","Start aspirin therapy (give aspirin)","Obtain an MRI of the brain","Initiate blood pressure management"],"taskCategory":"professionalism"}$op4$,
  $ky4$Administer intravenous thrombolysis$ky4$,
  $ex4$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex4$,
  4,
  $dm4$behavioral-nervous$dm4$,
  $tp4$acute-ischemic-stroke$tp4$,
  $fd4$usmle-step-3$fd4$,
  $sl4$step3$sl4$,
  $su4$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su4$,
  $ch4$d03854e43e1b598ad249581528d02017665397bb9ccaef0a96b09aa482cc0b69$ch4$,
  true,
  $rf4$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf4$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id5$cmr8db7h400tp1ylohag1hytw$id5$,
  $fx5$stem_missing_detail|wrong_blueprint$fx5$,
  $sc5$A 72-year-old man presents to the emergency department with sudden onset of right-sided weakness and difficulty speaking. His blood pressure is 180/100 mm Hg, and a noncontrast CT scan of the head shows an ischemic stroke in the left middle cerebral artery territory. He has a history of atrial fibrillation and is not on anticoagulation. The noncontrast CT shows no hemorrhage. The patient was last known well 90 minutes ago.$sc5$,
  $qu5$What is the next best step in management?$qu5$,
  $op5${"kind":"ethics","stepLevel":"step3","blueprintSystem":"ethics","blueprintTopic":"confidentiality-reporting","physicianTask":"diagnosis","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783290392553","qcScore":8.1,"slotIndex":14,"stepLevel":"step3","examNumber":9310,"generatedAt":"2026-07-05T22:27:33.642Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Initiate thrombolytic therapy","Start anticoagulation therapy","Administer aspirin","Perform a carotid endarterectomy"],"taskCategory":"diagnosis"}$op5$,
  $ky5$Initiate thrombolytic therapy$ky5$,
  $ex5$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex5$,
  2,
  $dm5$behavioral-nervous$dm5$,
  $tp5$acute-ischemic-stroke$tp5$,
  $fd5$usmle-step-3$fd5$,
  $sl5$step3$sl5$,
  $su5$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su5$,
  $ch5$5275491a03a0c312c43f4e73763dd3e57cde27bbb600c2163f4589b6fca9f868$ch5$,
  true,
  $rf5$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf5$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id6$cmr8db9dh00u81yloyl3vswl1$id6$,
  $fx6$stem_missing_detail|wrong_blueprint$fx6$,
  $sc6$A 60-year-old man with a history of hypertension and hyperlipidemia presents to the emergency department with sudden onset of right-sided weakness and slurred speech. His blood pressure is 170/95 mm Hg, and a noncontrast CT scan of the head shows an ischemic stroke in the left middle cerebral artery territory. He is currently on aspirin for secondary prevention. The noncontrast CT shows no hemorrhage. The patient was last known well 90 minutes ago.$sc6$,
  $qu6$What is the most appropriate next step in management?$qu6$,
  $op6${"kind":"ethics","stepLevel":"step3","blueprintSystem":"ethics","blueprintTopic":"end-of-life-ethics","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783290392553","examNumber":9310,"slotIndex":33,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-05T22:27:39.730Z"},"options":["Administer intravenous thrombolytics","Start aspirin therapy","Initiate anticoagulation with warfarin","Perform carotid endarterectomy"]}$op6$,
  $ky6$Administer intravenous thrombolytics$ky6$,
  $ex6$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex6$,
  5,
  $dm6$behavioral-nervous$dm6$,
  $tp6$acute-ischemic-stroke$tp6$,
  $fd6$usmle-step-3$fd6$,
  $sl6$step3$sl6$,
  $su6$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su6$,
  $ch6$3db03bb8a9eee0e3d8a900b1a2e98176ebc836c3e2ff3a03f5f9466ce61d59fe$ch6$,
  true,
  $rf6$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf6$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id7$cmr8diix000y11yloiuh6fvxe$id7$,
  $fx7$stem_missing_detail|wrong_blueprint$fx7$,
  $sc7$A 70-year-old man with a history of hypertension and hyperlipidemia is brought to the emergency department after experiencing sudden onset weakness on the right side of his body and difficulty speaking. His blood pressure is 180/100 mm Hg, and a noncontrast CT scan of the head shows an ischemic stroke in the left middle cerebral artery territory. The noncontrast CT shows no hemorrhage. The patient was last known well 90 minutes ago.$sc7$,
  $qu7$What is the next best step in management?$qu7$,
  $op7${"options":["Administer intravenous thrombolytics","Initiate aspirin (an antiplatelet drug) therapy","Perform a carotid endarterectomy","Start anticoagulation therapy"],"distractorRationale":{"Initiate aspirin (an antiplatelet drug) therapy":"While aspirin is important for secondary prevention, it is not the immediate step in acute ischemic stroke management.","Perform a carotid endarterectomy":"This procedure is not indicated in the acute setting and is reserved for patients with significant carotid artery stenosis.","Start anticoagulation therapy":"Anticoagulation is not indicated for acute ischemic stroke unless there is a specific indication, such as atrial fibrillation."},"clinicalReasoning":"Evaluate the patient's neurological symptoms and imaging findings to confirm the diagnosis of ischemic stroke. Analyze the time of symptom onset to determine eligibility for thrombolytics. Integrate this information to prioritize the administration of intravenous thrombolytics.","kind":"vignette","stepLevel":"step3","blueprintSystem":"pharm-advertising","blueprintTopic":"biostatistics-interpretation","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783290827338","examNumber":9311,"slotIndex":53,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-05T22:34:46.383Z"}}$op7$,
  $ky7$Administer intravenous thrombolytics$ky7$,
  $ex7$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex7$,
  2,
  $dm7$behavioral-nervous$dm7$,
  $tp7$acute-ischemic-stroke$tp7$,
  $fd7$usmle-step-3$fd7$,
  $sl7$step3$sl7$,
  $su7$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su7$,
  $ch7$83bcf80f27a4f70ba7d09ef76bc0774a13b7c9e19617c342a8cfc966b1d4a63c$ch7$,
  true,
  $rf7$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf7$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id8$cmr8ei2hz01bd1ylozg5vo1sh$id8$,
  $fx8$stem_missing_detail|wrong_blueprint$fx8$,
  $sc8$A 70-year-old man presents to the emergency department with sudden onset of right-sided weakness and difficulty speaking. His blood pressure is 180/100 mm Hg, and he has a history of atrial fibrillation. A noncontrast CT scan of the head shows no acute hemorrhage. His NIH Stroke Scale score is 8. The patient was last known well 90 minutes ago. The patient takes no anticoagulant.$sc8$,
  $qu8$What is the most appropriate next step in management?$qu8$,
  $op8${"options":["Start intravenous thrombolysis","Administer aspirin","Obtain an MRI of the brain","Initiate anticoagulation therapy"],"distractorRationale":{"Administer aspirin":"This is contraindicated in the acute phase of ischemic stroke.","Obtain an MRI of the brain":"This is not necessary before treatment initiation.","Initiate anticoagulation therapy":"This is not indicated in the acute setting."},"clinicalReasoning":"Assess the patient's symptoms and imaging results indicating an ischemic stroke. Analyze the timing and appropriateness of thrombolytic therapy. Integrate stroke management guidelines to determine the next best step.","kind":"vignette","stepLevel":"step3","blueprintSystem":"pharm-advertising","blueprintTopic":"pharmacology-interactions","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783292258170","examNumber":9315,"slotIndex":55,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.3,"generatedAt":"2026-07-05T22:58:46.722Z"}}$op8$,
  $ky8$Start intravenous thrombolysis$ky8$,
  $ex8$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex8$,
  4,
  $dm8$behavioral-nervous$dm8$,
  $tp8$acute-ischemic-stroke$tp8$,
  $fd8$usmle-step-3$fd8$,
  $sl8$step3$sl8$,
  $su8$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su8$,
  $ch8$a546e0a3ff3462bd95f24f0893dab4b274abd8e36051e073a16af8b3ddbca45a$ch8$,
  true,
  $rf8$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf8$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id9$cmr8hrrck023d1ylofdf5b0z0$id9$,
  $fx9$stem_missing_detail|wrong_blueprint$fx9$,
  $sc9$A 72-year-old woman is brought to the emergency department after experiencing sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mm Hg, heart rate is 88 bpm, and she has a history of hypertension and hyperlipidemia. A noncontrast CT scan of the head shows no acute hemorrhage. Her NIH Stroke Scale score is 12. She is currently on aspirin and atorvastatin. The patient was last known well 90 minutes ago.$sc9$,
  $qu9$What is the most appropriate next step in management?$qu9$,
  $op9${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-monitoring-escalation","physicianTask":"professionalism","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-3-1783297789167","qcScore":8.1,"slotIndex":13,"stepLevel":"step3","examNumber":9324,"generatedAt":"2026-07-06T00:32:25.809Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Initiate intravenous thrombolysis with alteplase","Administer aspirin 325 mg orally","Obtain a carotid Doppler ultrasound","Start intravenous heparin (an anticoagulant) for anticoagulation"],"taskCategory":"professionalism"}$op9$,
  $ky9$Initiate intravenous thrombolysis with alteplase$ky9$,
  $ex9$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex9$,
  3,
  $dm9$behavioral-nervous$dm9$,
  $tp9$acute-ischemic-stroke$tp9$,
  $fd9$usmle-step-3$fd9$,
  $sl9$step3$sl9$,
  $su9$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su9$,
  $ch9$cd4d0d5c8437ab9abf541ecd3f19ae3fef23732fda77f10ba43df2a885c54dc2$ch9$,
  true,
  $rf9$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf9$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id10$cmr8juid5000e1ygij3t6vg1p$id10$,
  $fx10$stem_missing_detail|wrong_blueprint$fx10$,
  $sc10$A 70-year-old woman with a history of hypertension and hyperlipidemia presents to the emergency department with sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mm Hg, and her neurological examination reveals right-sided hemiparesis and expressive aphasia. A non-contrast CT scan of the head shows no acute hemorrhage. The patient was last known well 90 minutes ago.$sc10$,
  $qu10$What is the most appropriate next step in management?$qu10$,
  $op10${"options":["Administer tissue plasminogen activator","Start aspirin (an antiplatelet drug) therapy","Obtain MRI of the brain","Monitor in the emergency department"],"distractorRationale":{"Start aspirin (an antiplatelet drug) therapy":"Fails because aspirin is not the immediate treatment for acute ischemic stroke; tPA is preferred.","Obtain MRI of the brain":"Fails as it is unnecessary after a CT has ruled out hemorrhage.","Monitor in the emergency department":"Fails because monitoring alone does not address the need for acute treatment."},"clinicalReasoning":"Assess the patient's neurological symptoms and CT findings to determine the diagnosis of acute ischemic stroke. Analyze the time-sensitive nature of tPA administration and integrate this with the management plan.","kind":"vignette","stepLevel":"step3","blueprintSystem":"surgery","blueprintTopic":"post-op-fever","physicianTask":"communication","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783301311491","examNumber":9301,"slotIndex":14,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T01:29:38.088Z"}}$op10$,
  $ky10$Administer tissue plasminogen activator$ky10$,
  $ex10$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex10$,
  5,
  $dm10$behavioral-nervous$dm10$,
  $tp10$acute-ischemic-stroke$tp10$,
  $fd10$usmle-step-3$fd10$,
  $sl10$step3$sl10$,
  $su10$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su10$,
  $ch10$e80652e0d9cef57bc795a74ec6c72291ef117e7d6657630fa8e07e25d6e57bc1$ch10$,
  true,
  $rf10$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf10$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id11$cmr8lyx3l00g51ygiy95hucha$id11$,
  $fx11$stem_missing_detail|wrong_blueprint$fx11$,
  $sc11$A 50-year-old woman with a history of hypertension and hyperlipidemia presents with sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mm Hg, and her heart rate is 80 bpm. A noncontrast CT scan of the head shows no acute hemorrhage. The patient was last known well 90 minutes ago.$sc11$,
  $qu11$What is the next best step in management?$qu11$,
  $op11${"options": ["Administer intravenous tissue plasminogen activator (tPA)", "Obtain a carotid ultrasound, as that study or procedure by itself", "Start aspirin therapy, at the usual dose and route for that treatment", "Monitor in the emergency department"], "distractorRationale": {"Obtain a carotid ultrasound, as that study or procedure by itself": "This can help assess for embolic sources but is not the immediate priority in acute stroke management.", "Start aspirin therapy, at the usual dose and route for that treatment": "Aspirin is not given prior to tPA administration in acute ischemic stroke due to increased risk of bleeding.", "Monitor in the emergency department": "Monitoring alone does not address the need for urgent treatment of the stroke."}, "clinicalReasoning": "Assess the patient's symptoms and CT findings to confirm the diagnosis of acute ischemic stroke. Analyze the timing to ensure she is within the therapeutic window for tPA. Integrate this information to conclude that administering intravenous tPA is the next best step in management.", "kind": "vignette", "stepLevel": "step3", "blueprintSystem": "pharm-advertising", "blueprintTopic": "pharmacology-interactions", "physicianTask": "diagnosis", "generationMeta": {"batchId": "usmle-gap-usmle-step-3-1783304975882", "examNumber": 9306, "slotIndex": 4, "stepLevel": "step3", "model": "gpt-4o-mini", "pipelineVersion": "gpt-4o-mini-usmle-full-exam-v1", "qcScore": 8.1, "generatedAt": "2026-07-06T02:30:47.287Z"}}$op11$,
  $ky11$Administer intravenous tissue plasminogen activator (tPA)$ky11$,
  $ex11$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex11$,
  4,
  $dm11$behavioral-nervous$dm11$,
  $tp11$acute-ischemic-stroke$tp11$,
  $fd11$usmle-step-3$fd11$,
  $sl11$step3$sl11$,
  $su11$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su11$,
  $ch11$bbb2193171ac8e674f8be33f0bdd0d94f394ddf983bd8f9ea4cdd98cbecff89e$ch11$,
  true,
  $rf11$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf11$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id12$cmr8ny51q01011yginhec8d8a$id12$,
  $fx12$stem_missing_detail|wrong_blueprint$fx12$,
  $sc12$A 60-year-old male with a history of hypertension and hyperlipidemia presents with sudden onset of right-sided weakness and slurred speech. His blood pressure is 180/100 mm Hg, and he has a right-sided facial droop. A noncontrast CT scan of the head shows no acute hemorrhage. The patient was last known well 90 minutes ago.$sc12$,
  $qu12$What is the most appropriate next step in management?$qu12$,
  $op12${"kind":"ethics","stepLevel":"step3","blueprintSystem":"ethics","blueprintTopic":"end-of-life-ethics","physicianTask":"interpretation","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783308148734","examNumber":9312,"slotIndex":23,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":7.9,"generatedAt":"2026-07-06T03:23:38.278Z"},"options":["Administer intravenous thrombolysis","Initiate aspirin (an antiplatelet drug) therapy","Obtain a carotid ultrasound","Start anticoagulation therapy"]}$op12$,
  $ky12$Administer intravenous thrombolysis$ky12$,
  $ex12$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex12$,
  5,
  $dm12$behavioral-nervous$dm12$,
  $tp12$acute-ischemic-stroke$tp12$,
  $fd12$usmle-step-3$fd12$,
  $sl12$step3$sl12$,
  $su12$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su12$,
  $ch12$0318a42a7cc8ce9fd9fec5edc43117e7b446c10b508a204ef5f8afd63525d4c7$ch12$,
  true,
  $rf12$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf12$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id13$cmr97i2kf004k1ywykxhklcie$id13$,
  $fx13$stem_missing_detail|wrong_blueprint$fx13$,
  $sc13$A 60-year-old woman with a history of hypertension and hyperlipidemia presents to the emergency department with sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mm Hg, and her heart rate is 80 bpm. A non-contrast CT scan of the head shows no acute intracranial hemorrhage. The patient was last known well 90 minutes ago.$sc13$,
  $qu13$What is the next best step in management?$qu13$,
  $op13${"kind":"biostats","stepLevel":"step3","blueprintSystem":"biostatistics","blueprintTopic":"study-design-appraisal","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783341257709","examNumber":9302,"slotIndex":46,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.2,"generatedAt":"2026-07-06T12:35:09.108Z"},"options":["Administer tissue plasminogen activator","Obtain an magnetic resonance imaging of the brain","Start aspirin therapy","Monitor in the ICU"]}$op13$,
  $ky13$Administer tissue plasminogen activator$ky13$,
  $ex13$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex13$,
  2,
  $dm13$behavioral-nervous$dm13$,
  $tp13$acute-ischemic-stroke$tp13$,
  $fd13$usmle-step-3$fd13$,
  $sl13$step3$sl13$,
  $su13$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su13$,
  $ch13$a62b6fadd1ff28597c2341ff4390192ccbdcf559376ce8c1679008f2267eac81$ch13$,
  true,
  $rf13$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf13$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id14$cmr98mmff00kq1ywy10umjsxj$id14$,
  $fx14$stem_missing_detail|wrong_blueprint$fx14$,
  $sc14$A 55-year-old woman with a history of hypertension and hyperlipidemia presents to the emergency department with sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mm Hg, and a noncontrast CT scan of the head shows no acute hemorrhage. The patient was last known well 90 minutes ago.$sc14$,
  $qu14$What is the most appropriate next step in management?$qu14$,
  $op14${"kind":"sequential","stepLevel":"step3","blueprintSystem":"ccs","blueprintTopic":"ccs-discharge-planning","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783343004842","examNumber":9307,"slotIndex":27,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T13:04:32.022Z"},"options":["Administer tissue plasminogen activator","Initiate aspirin (an antiplatelet drug) therapy","Perform a carotid endarterectomy","Start anticoagulation therapy"]}$op14$,
  $ky14$Administer tissue plasminogen activator$ky14$,
  $ex14$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex14$,
  4,
  $dm14$behavioral-nervous$dm14$,
  $tp14$acute-ischemic-stroke$tp14$,
  $fd14$usmle-step-3$fd14$,
  $sl14$step3$sl14$,
  $su14$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su14$,
  $ch14$bfa87bb3a12c6c3c4c6a270130289f5a0fee358689ecc470f46375e090aa62d6$ch14$,
  true,
  $rf14$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf14$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id15$cmr9c367u01nm1ywytyuu68vs$id15$,
  $fx15$stem_missing_detail|wrong_blueprint$fx15$,
  $sc15$A 60-year-old woman with a history of hypertension presents to the emergency department with a sudden onset of right-sided weakness and slurred speech. Her blood pressure is 180/100 mm Hg, and a noncontrast CT scan of the head shows no acute hemorrhage. The patient was last known well 90 minutes ago.$sc15$,
  $qu15$What is the next best step in management?$qu15$,
  $op15${"options":["Administer tissue plasminogen activator","Obtain an magnetic resonance imaging of the brain","Start aspirin therapy","Monitor in the ED for 24 hours"],"distractorRationale":{"Obtain an magnetic resonance imaging of the brain":"This is not needed before administering tPA if CT shows no hemorrhage.","Start aspirin therapy":"This is appropriate after the acute management but not the immediate next step.","Monitor in the ED for 24 hours":"This is not sufficient when tPA can be administered to potentially reverse the stroke."},"clinicalReasoning":"Assess the patient's symptoms and imaging results, analyze the timing for thrombolysis, and integrate the urgency of treatment for ischemic stroke.","kind":"vignette","stepLevel":"step3","blueprintSystem":"pharm-advertising","blueprintTopic":"sdoh-health-equity","physicianTask":"pharmacotherapy","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1783348855745","examNumber":9319,"slotIndex":15,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-06T14:41:51.447Z"}}$op15$,
  $ky15$Administer tissue plasminogen activator$ky15$,
  $ex15$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex15$,
  4,
  $dm15$behavioral-nervous$dm15$,
  $tp15$acute-ischemic-stroke$tp15$,
  $fd15$usmle-step-3$fd15$,
  $sl15$step3$sl15$,
  $su15$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su15$,
  $ch15$94e2e660d8ccfcc60fe40ef20d66e9362cfc06d4691ca3b31b3da0178d00fb9a$ch15$,
  true,
  $rf15$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf15$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id16$cmru855h7003r1yd6lepkaro9$id16$,
  $fx16$stem_missing_detail|wrong_blueprint$fx16$,
  $sc16$A 50-year-old woman presents to the emergency department with sudden onset of right-sided weakness and slurred speech. Her blood pressure is 170/95 mm Hg, and she has a history of atrial fibrillation. A noncontrast CT scan of the head shows no acute hemorrhage. The patient was last known well 90 minutes ago. The patient takes no anticoagulant.$sc16$,
  $qu16$What is the most appropriate next step in management?$qu16$,
  $op16${"kind":"ethics","stepLevel":"step3","blueprintSystem":"ethics","blueprintTopic":"confidentiality-reporting","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784611860346","examNumber":9302,"slotIndex":15,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-21T05:31:59.714Z"},"options":["Administer intravenous thrombolytics","Start aspirin therapy (give aspirin)","Perform a carotid ultrasound","Obtain an MRI of the brain"]}$op16$,
  $ky16$Administer intravenous thrombolytics$ky16$,
  $ex16$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex16$,
  3,
  $dm16$behavioral-nervous$dm16$,
  $tp16$acute-ischemic-stroke$tp16$,
  $fd16$usmle-step-3$fd16$,
  $sl16$step3$sl16$,
  $su16$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su16$,
  $ch16$2dc1d14ecb804c5b85b7af3d5d26b5c6b19638735740f8fb1e184b332bd3199c$ch16$,
  true,
  $rf16$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf16$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id17$cmru8bgv9007y1yd6w8ckx8ro$id17$,
  $fx17$stem_missing_detail|wrong_blueprint$fx17$,
  $sc17$A 60-year-old man with a history of hypertension and hyperlipidemia presents with sudden onset of right-sided weakness and difficulty speaking. His blood pressure is 180/100 mm Hg, and a noncontrast CT scan of the head shows an area of ischemia in the left middle cerebral artery territory. The patient was last known well 90 minutes ago. The noncontrast CT shows no hemorrhage.$sc17$,
  $qu17$What is the next best step in management?$qu17$,
  $op17${"options":["Administer tissue plasminogen activator","Initiate aspirin (an antiplatelet drug) therapy","Perform carotid endarterectomy","Start anticoagulation therapy"],"distractorRationale":{"Initiate aspirin (an antiplatelet drug) therapy":"This option is incorrect as aspirin is not recommended in the acute phase of ischemic stroke; tPA should be prioritized.","Perform carotid endarterectomy":"This distractor fails because carotid endarterectomy is a surgical intervention for secondary prevention, not for acute management.","Start anticoagulation therapy":"Anticoagulation is not indicated for acute ischemic stroke management and could increase the risk of hemorrhage."},"clinicalReasoning":"The patient's sudden onset of neurological deficits and CT findings indicate an acute ischemic stroke. He is within the window for tPA administration, which is crucial for restoring blood flow and preventing further brain injury. Therefore, administering tPA is the next best step in management.","kind":"vignette","stepLevel":"step3","blueprintSystem":"pharm-advertising","blueprintTopic":"pharmaceutical-ads-abstracts","physicianTask":"diagnosis","generationMeta":{"batchId":"usmle-gap-usmle-step-3-1784612400875","examNumber":9303,"slotIndex":56,"stepLevel":"step3","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-21T05:40:54.985Z"}}$op17$,
  $ky17$Administer tissue plasminogen activator$ky17$,
  $ex17$Noncontrast CT shows no hemorrhage, blood pressure is below 185/110 mm Hg, and the patient was last known well 90 minutes ago. The 2018 AHA/ASA guideline recommends IV alteplase for eligible patients treated within 4.5 hours of last known well. Aspirin does not reopen the artery and is not a substitute for thrombolysis in that window. Anticoagulation, carotid surgery, and extra imaging are not the immediate reperfusion step once hemorrhage has been excluded.$ex17$,
  5,
  $dm17$behavioral-nervous$dm17$,
  $tp17$acute-ischemic-stroke$tp17$,
  $fd17$usmle-step-3$fd17$,
  $sl17$step3$sl17$,
  $su17$https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158$su17$,
  $ch17$85422b961ce636373ea9092ce9d1cbef6ec54c0f9e670f2afb949578e7076744$ch17$,
  true,
  $rf17$[{"label": "AHA/ASA 2018 early management of acute ischemic stroke", "url": "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000158", "quote": "IV alteplase is recommended for selected patients who can be treated within 3 and 4.5 hours of last known well, and only if blood pressure can be kept at or below 185/110 mm Hg."}]$rf17$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id18$cmrruacdw00d01y8waae1fflb$id18$,
  $fx18$stem_missing_detail|inaccurate_rationale|wrong_blueprint|wrong_step$fx18$,
  $sc18$A 28-year-old male presents to the emergency department with sudden onset chest pain and shortness of breath. He has a history of deep vein thrombosis and is currently on warfarin. His vital signs show a heart rate of 110 bpm and blood pressure of 118/74 mm Hg. A CT scan of the chest reveals a large pulmonary embolism. The INR today is 1.2.$sc18$,
  $qu18$What is the next best step in management?$qu18$,
  $op18${"options":["Administer intravenous heparin","Continue warfarin (a vitamin K antagonist) therapy","Perform thrombolysis","Obtain an echocardiogram"],"distractorRationale":{"Continue warfarin (a vitamin K antagonist) therapy":"Warfarin is not effective for immediate management of acute pulmonary embolism due to its delayed action.","Perform thrombolysis":"Thrombolysis is reserved for patients with massive PE and hemodynamic instability but is not the first step in all cases.","Obtain an echocardiogram":"While useful for assessing cardiac function, it is not a priority in the acute management of pulmonary embolism."},"clinicalReasoning":"Evaluate the patient's acute presentation and history of DVT. Analyze the urgency of anticoagulation in the setting of pulmonary embolism to determine that intravenous heparin is the next best step.","keyTakeaways":["When managing acute pulmonary embolism, prioritize immediate anticoagulation with heparin."],"kind":"lab_interpretation","taskCategory":"pharmacotherapy","blueprintTopic":"pharmacology-interactions","blueprintSystem":"focused","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784467886493","qcScore":8,"slotIndex":3,"stepLevel":"step1","examNumber":9107,"generatedAt":"2026-07-19T13:32:13.300Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step1","physicianTask":"pharmacotherapy"}$op18$,
  $ky18$Administer intravenous heparin$ky18$,
  $ex18$Systolic pressure is 118 mm Hg, so this is not high-risk pulmonary embolism, and the INR is 1.2. The 2019 ESC guideline reserves systemic thrombolysis for systolic pressure below 90 mm Hg lasting 15 minutes or a drop of 40 mm Hg or more. Heparin provides immediate anticoagulation while warfarin is subtherapeutic. Continuing warfarin alone, switching to a direct oral anticoagulant on top of warfarin, or giving thrombolysis does not match this blood pressure.$ex18$,
  4,
  $dm18$respiratory-renal$dm18$,
  $tp18$pulmonary-embolism$tp18$,
  $fd18$usmle-step-2$fd18$,
  $sl18$step2$sl18$,
  $su18$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su18$,
  $ch18$2285514d04e2e3360a59888aab6de5a8039a55c1b7aa431db4db5fca25dd869a$ch18$,
  true,
  $rf18$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Systemic thrombolytic therapy is recommended for high-risk PE. High-risk PE includes persistent hypotension with systolic BP <90 mmHg lasting longer than 15 min."}, {"label": "Merck Manual Professional pulmonary embolism", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe", "quote": "Anticoagulation is the mainstay of therapy for PE. High risk (massive) means systolic blood pressure < 90 mm Hg."}]$rf18$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id19$cmr877jmy00dg1yr94tlzmcg9$id19$,
  $fx19$stem_missing_detail|inaccurate_rationale|wrong_blueprint$fx19$,
  $sc19$A 65-year-old woman presents to the emergency department with sudden onset chest pain and shortness of breath. Her vital signs show a blood pressure of 118/74 mm Hg, heart rate of 120 bpm, and oxygen saturation of 96% on room air. A CT pulmonary angiogram reveals a large pulmonary embolism. She has a history of deep vein thrombosis and is currently on warfarin. The INR today is 1.2.$sc19$,
  $qu19$What is the most appropriate next step in management?$qu19$,
  $op19${"options":["Administer intravenous heparin","Start oral anticoagulation with rivaroxaban","Perform thrombolysis","Discharge with follow-up anticoagulation"],"distractorRationale":{"Start oral anticoagulation with rivaroxaban":"This option fails because oral anticoagulants are not suitable for acute management in a patient with significant pulmonary embolism and hemodynamic instability.","Perform thrombolysis":"While thrombolysis can be indicated in massive PE, it is not the first-line treatment in patients who are not in severe shock and can be managed with heparin.","Discharge with follow-up anticoagulation":"This option is incorrect as the patient requires immediate intervention due to her unstable condition."},"clinicalReasoning":"The patient presents with classic symptoms of a pulmonary embolism and shows signs of hemodynamic instability. The CT scan confirms the diagnosis. Given her history of DVT and current instability, the immediate administration of intravenous heparin is warranted to manage her condition effectively.","keyTakeaways":["When faced with a hemodynamically unstable patient with a pulmonary embolism, prioritize immediate intravenous anticoagulation."],"kind":"vignette","taskCategory":"professionalism","blueprintTopic":"pe-workup","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783280145452","qcScore":8.1,"slotIndex":20,"stepLevel":"step2","examNumber":9205,"generatedAt":"2026-07-05T19:37:11.561Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"professionalism"}$op19$,
  $ky19$Administer intravenous heparin$ky19$,
  $ex19$Systolic pressure is 118 mm Hg, so this is not high-risk pulmonary embolism, and the INR is 1.2. The 2019 ESC guideline reserves systemic thrombolysis for systolic pressure below 90 mm Hg lasting 15 minutes or a drop of 40 mm Hg or more. Heparin provides immediate anticoagulation while warfarin is subtherapeutic. Continuing warfarin alone, switching to a direct oral anticoagulant on top of warfarin, or giving thrombolysis does not match this blood pressure.$ex19$,
  3,
  $dm19$respiratory-renal$dm19$,
  $tp19$pulmonary-embolism$tp19$,
  $fd19$usmle-step-2$fd19$,
  $sl19$step2$sl19$,
  $su19$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su19$,
  $ch19$b95060849f792654aeece8751a847c9e232549f5fcf36c8ea5e5aab33b038f33$ch19$,
  true,
  $rf19$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Systemic thrombolytic therapy is recommended for high-risk PE. High-risk PE includes persistent hypotension with systolic BP <90 mmHg lasting longer than 15 min."}, {"label": "Merck Manual Professional pulmonary embolism", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe", "quote": "Anticoagulation is the mainstay of therapy for PE. High risk (massive) means systolic blood pressure < 90 mm Hg."}]$rf19$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id20$cmtps7vok000r1y1qcjq7w4p4$id20$,
  $fx20$stem_missing_detail|inaccurate_rationale|wrong_blueprint$fx20$,
  $sc20$A 65-year-old woman presents to the emergency department with sudden onset of shortness of breath and chest pain while at rest. She has a history of hypertension and hyperlipidemia. On examination, her blood pressure is 118/74 mm Hg, heart rate is 110 bpm, and oxygen saturation is 96% on room air. A D-dimer test is ordered, which returns elevated at 3.5 µg/mL. A CT pulmonary angiogram is performed, revealing a large pulmonary embolism in the right main pulmonary artery.$sc20$,
  $qu20$What is the most appropriate next step in management?$qu20$,
  $op20${"options":["Start intravenous heparin","Administer thrombolytics","Initiate oral anticoagulation with warfarin","Obtain a lower extremity ultrasound"],"distractorRationale":{"Administer thrombolytics":"While thrombolytics can be used in massive pulmonary embolism, they are not the first-line treatment for all cases and carry a risk of significant bleeding.","Initiate oral anticoagulation with warfarin":"Warfarin takes several days to reach therapeutic levels and is not suitable for immediate management in acute settings.","Obtain a lower extremity ultrasound":"The diagnosis of pulmonary embolism has already been confirmed; further imaging is not necessary at this point."},"clinicalReasoning":"In this case, the patient's presentation of sudden shortness of breath, chest pain, and hemodynamic instability, coupled with the CT findings of a pulmonary embolism, necessitates immediate anticoagulation. The elevated D-dimer supports the diagnosis but is not definitive. The priority is to stabilize the patient and prevent further clot formation, making intravenous heparin the most appropriate next step.","kind":"vignette","stepLevel":"step2","blueprintSystem":"respiratory-renal","blueprintTopic":"pe-workup","physicianTask":"clinical-intervention","generationMeta":{"batchId":"usmle-gap-usmle-step-2-1788697190493","examNumber":9201,"slotIndex":27,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.4,"generatedAt":"2026-09-06T12:21:55.867Z"}}$op20$,
  $ky20$Start intravenous heparin$ky20$,
  $ex20$Systolic pressure is 118 mm Hg and oxygen saturation is normal, so this is not high-risk pulmonary embolism. The 2019 ESC guideline reserves systemic thrombolysis for high-risk embolism, defined as systolic pressure below 90 mm Hg for 15 minutes or a drop of 40 mm Hg or more. The Merck Manual treats anticoagulation as the mainstay outside that setting. Heparin is the acute anticoagulant. Warfarin or a direct oral anticoagulant is not the immediate substitute, and thrombolysis is not indicated.$ex20$,
  2,
  $dm20$respiratory-renal$dm20$,
  $tp20$pulmonary-embolism$tp20$,
  $fd20$usmle-step-2$fd20$,
  $sl20$step2$sl20$,
  $su20$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su20$,
  $ch20$ba0dcca0e574a8292a486d82148991fae8166226ea253e92e2154f6322d78958$ch20$,
  true,
  $rf20$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Systemic thrombolytic therapy is recommended for high-risk PE. High-risk PE includes persistent hypotension with systolic BP <90 mmHg lasting longer than 15 min."}, {"label": "Merck Manual Professional pulmonary embolism", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe", "quote": "Anticoagulation is the mainstay of therapy for PE. High risk (massive) means systolic blood pressure < 90 mm Hg."}]$rf20$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id21$cmrsew9ng00091y55d5mgnxf5$id21$,
  $fx21$stem_missing_detail|inaccurate_rationale|wrong_blueprint|wrong_step$fx21$,
  $sc21$A 65-year-old woman presents to the emergency department with sudden onset shortness of breath and chest pain. Her vital signs show a heart rate of 110 bpm, blood pressure of 118/74 mm Hg, and oxygen saturation of 96% on room air. A CT scan of the chest reveals a large pulmonary embolism in the right main pulmonary artery.$sc21$,
  $qu21$What is the next best step in management?$qu21$,
  $op21${"kind":"biostats","stepLevel":"step1","blueprintSystem":"respiratory-renal","blueprintTopic":"pe-pathophysiology","physicianTask":"interpretation","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-1-1784502584405","qcScore":8.1,"slotIndex":10,"stepLevel":"step1","examNumber":9101,"generatedAt":"2026-07-19T23:10:32.232Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"options":["Administer intravenous heparin","Start oral anticoagulation with warfarin","Perform thrombolysis with alteplase","Initiate oxygen therapy"],"taskCategory":"interpretation"}$op21$,
  $ky21$Administer intravenous heparin$ky21$,
  $ex21$Systolic pressure is 118 mm Hg and oxygen saturation is normal, so this is not high-risk pulmonary embolism. The 2019 ESC guideline reserves systemic thrombolysis for high-risk embolism, defined as systolic pressure below 90 mm Hg for 15 minutes or a drop of 40 mm Hg or more. The Merck Manual treats anticoagulation as the mainstay outside that setting. Heparin is the acute anticoagulant. Warfarin or a direct oral anticoagulant is not the immediate substitute, and thrombolysis is not indicated.$ex21$,
  5,
  $dm21$respiratory-renal$dm21$,
  $tp21$pulmonary-embolism$tp21$,
  $fd21$usmle-step-2$fd21$,
  $sl21$step2$sl21$,
  $su21$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su21$,
  $ch21$1ff74793ec29a7e783830d45453066ff42c7a65f5f515be91144e067404d4c3d$ch21$,
  true,
  $rf21$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Systemic thrombolytic therapy is recommended for high-risk PE. High-risk PE includes persistent hypotension with systolic BP <90 mmHg lasting longer than 15 min."}, {"label": "Merck Manual Professional pulmonary embolism", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe", "quote": "Anticoagulation is the mainstay of therapy for PE. High risk (massive) means systolic blood pressure < 90 mm Hg."}]$rf21$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id22$cmr8albv601al1yr95vxhgi66$id22$,
  $fx22$stem_missing_detail|inaccurate_rationale|wrong_blueprint$fx22$,
  $sc22$A 65-year-old woman presents to the emergency department with sudden onset shortness of breath and chest pain that started while she was walking her dog. She has a history of hypertension and is currently on lisinopril. On examination, her blood pressure is 124/78 mm Hg, heart rate is 120 bpm, and oxygen saturation is 96% on room air. A CT angiogram shows a filling defect in the right pulmonary artery. She had an ischemic stroke 1 month ago.$sc22$,
  $qu22$Which of the following is contraindicated in this patient?$qu22$,
  $op22${"options":["Thrombolytics","Anticoagulation","Oxygen therapy","IV fluids"],"distractorRationale":{"Thrombolytics":"This is the correct answer as their use can lead to severe bleeding, especially in a hypotensive patient.","Anticoagulation":"This is appropriate for managing pulmonary embolism and is not contraindicated.","Oxygen therapy":"This is critical for treating hypoxia and is not contraindicated.","IV fluids":"This is often used to stabilize blood pressure and is not contraindicated."},"clinicalReasoning":"The patient presents with signs of a pulmonary embolism, including hypoxia and hypotension. The CT angiogram confirms the diagnosis. In such cases, while anticoagulation is the mainstay of treatment, thrombolytics can be considered but are contraindicated in hypotensive patients due to the risk of bleeding. Therefore, the next step is to evaluate the risks associated with thrombolytics, leading to the conclusion that they are contraindicated in this patient.","keyTakeaways":["When managing a patient with hypotension and a suspected pulmonary embolism, avoid thrombolytics due to bleeding risk."],"kind":"vignette","taskCategory":"interpretation","blueprintTopic":"pe-workup","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783285795084","qcScore":8,"slotIndex":50,"stepLevel":"step2","examNumber":9215,"generatedAt":"2026-07-05T21:11:31.529Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"interpretation"}$op22$,
  $ky22$Thrombolytics$ky22$,
  $ex22$An ischemic stroke 1 month ago is an absolute contraindication to systemic thrombolysis for pulmonary embolism. The 2019 ESC guideline lists ischemic stroke in the previous 6 months among the absolute contraindications to fibrinolysis. Blood pressure is normal and oxygenation is adequate, so shock is not the issue. Anticoagulation, oxygen, and fluids are not contraindicated by that recent ischemic stroke.$ex22$,
  3,
  $dm22$respiratory-renal$dm22$,
  $tp22$pulmonary-embolism$tp22$,
  $fd22$usmle-step-2$fd22$,
  $sl22$step2$sl22$,
  $su22$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su22$,
  $ch22$fb297666a0421a09cd934f6735976a70ff912c5638496678e6b12a9fb86d9bc7$ch22$,
  true,
  $rf22$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Absolute contraindications to fibrinolysis include ischaemic stroke in the previous 6 months."}]$rf22$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id23$cmr877l9v00e01yr9qrz8qsxm$id23$,
  $fx23$stem_missing_detail|inaccurate_rationale|wrong_blueprint$fx23$,
  $sc23$A 62-year-old woman presents to the emergency department with sudden onset shortness of breath and pleuritic chest pain. She has a history of hypertension and is currently on lisinopril. On examination, her vital signs are BP 122/74 mm Hg, HR 102 bpm, and oxygen saturation is 96% on room air. A CT pulmonary angiogram reveals a large pulmonary embolism. She had an ischemic stroke 1 month ago.$sc23$,
  $qu23$Which of the following is contraindicated in this patient?$qu23$,
  $op23${"options":["Thrombolytics","Anticoagulation with heparin","Inferior vena cava filter placement","Warfarin initiation"],"distractorRationale":{"Anticoagulation with heparin":"Heparin is the standard initial treatment for pulmonary embolism and is not contraindicated.","Inferior vena cava filter placement":"This is a reasonable option if anticoagulation cannot be used, making it a valid management strategy.","Warfarin initiation":"While not immediate, it is appropriate to initiate warfarin after stabilization, thus it is not contraindicated."},"clinicalReasoning":"Assess the patient's risk factors and clinical presentation to determine management options. Analyze the implications of her history of hypertension on treatment choices. Integrate this knowledge to conclude that thrombolytics pose a significant risk of bleeding in this patient.","keyTakeaways":["When managing pulmonary embolism, always assess bleeding risks before considering thrombolytics, especially in patients with hypertension."],"kind":"vignette","taskCategory":"communication","blueprintTopic":"pe-workup","blueprintSystem":"internal-medicine","generationMeta":{"model":"gpt-4o-mini","batchId":"usmle-gap-usmle-step-2-1783280145452","qcScore":8.1,"slotIndex":40,"stepLevel":"step2","examNumber":9205,"generatedAt":"2026-07-05T19:37:07.416Z","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1"},"stepLevel":"step2","physicianTask":"communication"}$op23$,
  $ky23$Thrombolytics$ky23$,
  $ex23$An ischemic stroke 1 month ago is an absolute contraindication to systemic thrombolysis for pulmonary embolism. The 2019 ESC guideline lists ischemic stroke in the previous 6 months among the absolute contraindications to fibrinolysis. Blood pressure is normal and oxygenation is adequate, so shock is not the issue. Anticoagulation, oxygen, and fluids are not contraindicated by that recent ischemic stroke.$ex23$,
  3,
  $dm23$respiratory-renal$dm23$,
  $tp23$pulmonary-embolism$tp23$,
  $fd23$usmle-step-2$fd23$,
  $sl23$step2$sl23$,
  $su23$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su23$,
  $ch23$48f6dc3eb0f8ca6915701fb96f1cc47309d98e799affa0aef7cd8dca20436dc0$ch23$,
  true,
  $rf23$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Absolute contraindications to fibrinolysis include ischaemic stroke in the previous 6 months."}]$rf23$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id24$cmrtprw7t00001yqcnic91y3b$id24$,
  $fx24$stem_missing_detail|inaccurate_rationale|wrong_blueprint$fx24$,
  $sc24$A 60-year-old woman presents to the emergency department with sudden onset shortness of breath and chest pain. She has a history of deep vein thrombosis. On examination, her blood pressure is 100/60 mm Hg, heart rate is 110 bpm, and oxygen saturation is 96% on room air. A CT pulmonary angiogram shows a filling defect in the right pulmonary artery. She had an ischemic stroke 1 month ago.$sc24$,
  $qu24$Which of the following is contraindicated in this patient?$qu24$,
  $op24${"options":["Anticoagulation therapy","Thrombolytic therapy","Inferior vena cava filter placement","Oxygen supplementation"],"distractorRationale":{"Anticoagulation therapy":"This option is incorrect as anticoagulation is the first-line treatment for pulmonary embolism.","Inferior vena cava filter placement":"This distractor is wrong because IVC filter placement can be considered in cases where anticoagulation is contraindicated.","Oxygen supplementation":"This is incorrect as oxygen supplementation is essential for managing hypoxia."},"clinicalReasoning":"Evaluate the patient's presentation of pulmonary embolism, analyze the risks associated with thrombolytic therapy, and integrate clinical guidelines to determine that thrombolytics are contraindicated.","keyTakeaways":["When managing pulmonary embolism, always assess bleeding risk before considering thrombolytic therapy."],"kind":"lab_interpretation","stepLevel":"step2","blueprintSystem":"internal-medicine","blueprintTopic":"pe-workup","physicianTask":"professionalism","generationMeta":{"batchId":"raise-exam-ready-usmle-step-2-1784581095601","examNumber":9500,"slotIndex":5,"stepLevel":"step2","model":"gpt-4o-mini","pipelineVersion":"gpt-4o-mini-usmle-full-exam-v1","qcScore":8.1,"generatedAt":"2026-07-20T20:59:12.042Z"}}$op24$,
  $ky24$Thrombolytic therapy$ky24$,
  $ex24$An ischemic stroke 1 month ago is an absolute contraindication to systemic thrombolysis for pulmonary embolism. The 2019 ESC guideline lists ischemic stroke in the previous 6 months among the absolute contraindications to fibrinolysis. Blood pressure is normal and oxygenation is adequate, so shock is not the issue. Anticoagulation, oxygen, and fluids are not contraindicated by that recent ischemic stroke.$ex24$,
  3,
  $dm24$respiratory-renal$dm24$,
  $tp24$pulmonary-embolism$tp24$,
  $fd24$usmle-step-2$fd24$,
  $sl24$step2$sl24$,
  $su24$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su24$,
  $ch24$6219c6a2e095d0b5bee22b8e966535a1af5d32ec4df4bfdff8cc9c204c4531fe$ch24$,
  true,
  $rf24$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Absolute contraindications to fibrinolysis include ischaemic stroke in the previous 6 months."}]$rf24$::jsonb
);
INSERT INTO qbi_usmle_fullaudit_20261121_b1_stage (
  id, fix_types, scenario, question, options, correct_answer, explanation,
  difficulty, blueprint_domain, blueprint_topic, field_id, step_level,
  source_url, content_hash, active, "references"
) VALUES (
  $id25$cmr8atteh00041ylofmrz2bg5$id25$,
  $fx25$stem_missing_detail|inaccurate_rationale|wrong_blueprint$fx25$,
  $sc25$A 50-year-old woman with a history of breast cancer presents to the emergency department with sudden onset of severe shortness of breath and pleuritic chest pain. Her vital signs show a respiratory rate of 28 breaths per minute, heart rate of 110 beats per minute, and blood pressure of 78/50 mm Hg. A CT pulmonary angiogram confirms a large pulmonary embolism. She is currently receiving anticoagulation therapy and is due for chemotherapy. The systolic pressure has stayed at 78 mm Hg for 20 minutes after 1 L of crystalloid. She has no intracranial hemorrhage, no recent surgery, and no active bleeding.$sc25$,
  $qu25$What is the next best step in the management of this patient?$qu25$,
  $op25$["Initiate thrombolytic therapy","Administer intravenous fluids","Start anticoagulation therapy","Obtain a chest X-ray","Consult oncology for chemotherapy"]$op25$,
  $ky25$Initiate thrombolytic therapy$ky25$,
  $ex25$Systolic pressure has remained 78 mm Hg for 20 minutes after fluid, which meets the high-risk definition (systolic pressure below 90 mm Hg for 15 minutes). The 2019 ESC guideline recommends systemic thrombolysis for high-risk pulmonary embolism, and the Merck Manual agrees when there is no contraindication. The stem states no intracranial hemorrhage, recent surgery, or active bleeding. Another anticoagulant, fluids alone, a chest radiograph, or an oncology visit does not reperfuse the artery.$ex25$,
  3,
  $dm25$respiratory-renal$dm25$,
  $tp25$pulmonary-embolism$tp25$,
  $fd25$usmle-step-3$fd25$,
  $sl25$step3$sl25$,
  $su25$https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf$su25$,
  $ch25$fa3b9b508fdd7f8f659fa886fa9ab4b04a60a1f45ed8968b91020673e2e5feae$ch25$,
  true,
  $rf25$[{"label": "2019 ESC pulmonary embolism guideline", "url": "https://ern-lung.eu/wp-content/uploads/2019/10/PH-PE-2019.pdf", "quote": "Systemic thrombolytic therapy is recommended for high-risk PE. Persistent hypotension is systolic BP <90 mmHg lasting longer than 15 min."}, {"label": "Merck Manual Professional pulmonary embolism", "url": "https://www.merckmanuals.com/professional/pulmonary-disorders/pulmonary-embolism/pulmonary-embolism-pe", "quote": "Experts agree that systemic thrombolytic therapy should be given to patients with hemodynamic compromise if there are no contraindications."}]$rf25$::jsonb
);
DO $check$
BEGIN
  IF (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b1_stage) <> 26 THEN
    RAISE EXCEPTION 'stage row count %, expected 26',
      (SELECT COUNT(*) FROM qbi_usmle_fullaudit_20261121_b1_stage);
  END IF;
  IF EXISTS (
    SELECT 1 FROM qbi_usmle_fullaudit_20261121_b1_stage
    WHERE position(correct_answer IN options) = 0
  ) THEN
    RAISE EXCEPTION 'a staged key is not contained in the staged options text';
  END IF;
END
$check$;
COMMIT;

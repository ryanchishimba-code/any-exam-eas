-- Hidden Step 2 CK batch 1 of the 2026-11-21 set.
-- active=false and qaPassed=false. stepLevel is step2.
-- Does not change served items. Go-live SQL is a separate file and is not part of this script.
BEGIN;
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210001', 'usmle-step-2', 'obstetrics',
  $sc$A 27-year-old woman who works as a school librarian is seen in the prenatal clinic at 26 weeks of gestation for a scheduled glucose tolerance test. She has no personal history of diabetes. Body mass index is 27 kg/m2. She fasted for 10 hours overnight. The fetal heart rate is 148/min. Temperature is 36.7°C, pulse is 82/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. Plasma glucose on the 75-g test is 97 mg/dL fasting, 164 mg/dL at 1 hour, and 141 mg/dL at 2 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["One fasting result at or above 92 mg/dL makes the diagnosis on this test", "The test is normal because two of the three results must be high", "The fasting result meets nonpregnant criteria for diabetes at 126 mg/dL before the patient leaves", "A 100-g test is required before any diagnosis is made", "The 1-hour result is the only value that can establish the diagnosis"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gdm-onestep-fasting-alone", "taskCategory": "diagnosis"}$op$,
  $ky$One fasting result at or above 92 mg/dL makes the diagnosis on this test$ky$,
  $ex$On the one-step 75-g test at 24 to 28 weeks, the diagnosis is made when any one value meets or exceeds fasting 92 mg/dL, 1-hour 180 mg/dL, or 2-hour 153 mg/dL. Fasting glucose is 97 mg/dL. The other two results are below their cutoffs, and a single abnormal result is enough. "The test is normal because two of the three results must be high" is not the best choice because Requiring two abnormal values is the rule for the 100-g test in the two-step strategy, not for this 75-g test. "The fasting result meets nonpregnant criteria for diabetes at 126 mg/dL before the patient leaves" is not the best choice because Nonpregnant diabetes uses a fasting cutoff of 126 mg/dL. This fasting result is 97 mg/dL. "A 100-g test is required before any diagnosis is made" is not the best choice because The one-step 75-g test is itself diagnostic. A 100-g test belongs to the other strategy. "The 1-hour result is the only value that can establish the diagnosis" is not the best choice because Any one of the three thresholds is sufficient. The abnormal result here is the fasting value, not the 1-hour value.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis", "nutrition"]$tg$,
  's2-new-20261121-hidden', '24b79a892007cfb36ee031fd38f64c6c11fd3832f060484d92a281843c0c255b', false, NOW(), NOW(), 2,
  'gdm-onestep-fasting-alone', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'gdm-onestep-fasting-alone', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-001", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": true, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210002', 'usmle-step-2', 'obstetrics',
  $sc$A 33-year-old woman who works as a graphic designer is seen in the obstetric office at 27 weeks of gestation after an overnight fast. Her first-trimester fasting glucose was 84 mg/dL and she was not treated with a glucose-lowering drug. She feels well. The fetal heart rate is 152/min. Temperature is 36.8°C, pulse is 88/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. On a morning 75-g test, plasma glucose is 88 mg/dL fasting, 186 mg/dL at 1 hour, and 146 mg/dL at 2 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The test is nondiagnostic until the 2-hour result also exceeds 153 mg/dL", "The 1-hour result alone meets the one-step diagnostic threshold", "Fasting glucose below 92 mg/dL cancels an elevated 1-hour result", "The 1-hour cutoff on this test is 140 mg/dL, so 186 mg/dL is expected", "A result in this range should be ignored until after 32 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gdm-onestep-one-hour-alone", "taskCategory": "diagnosis"}$op$,
  $ky$The 1-hour result alone meets the one-step diagnostic threshold$ky$,
  $ex$The one-step criteria are fasting 92 mg/dL, 1-hour 180 mg/dL, and 2-hour 153 mg/dL, and any one value at or above its cutoff makes the diagnosis. The 1-hour value is 186 mg/dL. Fasting and 2-hour values are below their cutoffs. "The test is nondiagnostic until the 2-hour result also exceeds 153 mg/dL" is not the best choice because A second abnormal value is not required on the 75-g one-step test. "Fasting glucose below 92 mg/dL cancels an elevated 1-hour result" is not the best choice because Each threshold stands on its own. A normal fasting result does not erase a 1-hour result at or above 180 mg/dL. "The 1-hour cutoff on this test is 140 mg/dL, so 186 mg/dL is expected" is not the best choice because 140 mg/dL is a 1-hour treatment goal after the diagnosis, and it is also one of the 50-g screen thresholds. It is not the 1-hour diagnostic cutoff on the 75-g test. "A result in this range should be ignored until after 32 weeks" is not the best choice because Screening for this diagnosis is done at 24 to 28 weeks, which is when this test was performed.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '498cc57c0433224e576dac1a86d5c3cf010f836932fb1240c7c5905c38e3ad8a', false, NOW(), NOW(), 3,
  'gdm-onestep-one-hour-alone', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'gdm-onestep-one-hour-alone', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-002", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210003', 'usmle-step-2', 'obstetrics',
  $sc$A 29-year-old woman who works as a pharmacy technician is seen in the community prenatal clinic at 25 weeks of gestation for a 75-g tolerance test. She fasted for 9 hours. She has no polydipsia. Fundal height matches the stated dates, and the fetal heart rate is 146/min. Temperature is 36.6°C, pulse is 76/min, respirations are 16/min, and blood pressure is 110/68 mm Hg. Plasma glucose is 90 mg/dL fasting, 172 mg/dL at 1 hour, and 159 mg/dL at 2 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["All three results must exceed their cutoffs before the test is positive", "The 2-hour cutoff on this test is 140 mg/dL, so 159 mg/dL is borderline normal", "The 2-hour result at or above 153 mg/dL establishes the diagnosis", "A 2-hour result matters only when the fasting result exceeds 126 mg/dL", "The test should be repeated next week before any diagnosis is recorded"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gdm-onestep-two-hour-alone", "taskCategory": "diagnosis"}$op$,
  $ky$The 2-hour result at or above 153 mg/dL establishes the diagnosis$ky$,
  $ex$On the one-step 75-g test, a 2-hour plasma glucose at or above 153 mg/dL is diagnostic even when the fasting and 1-hour values are below 92 and 180 mg/dL. This 2-hour result is 159 mg/dL. "All three results must exceed their cutoffs before the test is positive" is not the best choice because One abnormal value is sufficient on this strategy. "The 2-hour cutoff on this test is 140 mg/dL, so 159 mg/dL is borderline normal" is not the best choice because 140 mg/dL is the lower end of the nonpregnant impaired-glucose range and a pregnancy treatment target, not the 2-hour diagnostic cutoff of 153 mg/dL. "A 2-hour result matters only when the fasting result exceeds 126 mg/dL" is not the best choice because The 2-hour threshold is independent of the fasting result. "The test should be repeated next week before any diagnosis is recorded" is not the best choice because An abnormal one-step test does not need a confirmatory repeat before the diagnosis is made.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '8c8ca6e34437640ffa87612760b76ef5460af700a343eed6d15cffe335414421', false, NOW(), NOW(), 3,
  'gdm-onestep-two-hour-alone', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'gdm-onestep-two-hour-alone', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-003", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210004', 'usmle-step-2', 'obstetrics',
  $sc$A 24-year-old woman who works as a restaurant server is seen in the prenatal clinic at 26 weeks of gestation after a 12-hour overnight fast. Body mass index is 24 kg/m2. She takes a prenatal vitamin and no glucose-lowering medication. The fetal heart rate is 144/min. Temperature is 36.5°C, pulse is 80/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. The 75-g test shows plasma glucose of 84 mg/dL fasting, 154 mg/dL at 1 hour, and 128 mg/dL at 2 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The 1-hour result above 140 mg/dL makes the diagnosis", "The 2-hour result above 120 mg/dL makes the diagnosis", "Fasting glucose above 80 mg/dL is abnormal in pregnancy", "None of the three results meets a one-step diagnostic cutoff", "A 100-g test is the required next step after every 75-g test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gdm-onestep-all-below", "taskCategory": "diagnosis"}$op$,
  $ky$None of the three results meets a one-step diagnostic cutoff$ky$,
  $ex$The one-step cutoffs are fasting 92 mg/dL, 1-hour 180 mg/dL, and 2-hour 153 mg/dL. All three results are below those cutoffs, so the test does not make the diagnosis. "The 1-hour result above 140 mg/dL makes the diagnosis" is not the best choice because 140 mg/dL is a post-diagnosis 1-hour treatment goal, not the diagnostic cutoff of 180 mg/dL. "The 2-hour result above 120 mg/dL makes the diagnosis" is not the best choice because 120 mg/dL is a 2-hour treatment goal after diagnosis, not the diagnostic cutoff of 153 mg/dL. "Fasting glucose above 80 mg/dL is abnormal in pregnancy" is not the best choice because There is no 80 mg/dL fasting diagnostic threshold in this strategy. "A 100-g test is the required next step after every 75-g test" is not the best choice because A normal one-step test does not move the patient into the 100-g pathway.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '4c426462b956ff74107debc74508f4f3ee080960a464dd24767d8fc91d7d38a9', false, NOW(), NOW(), 2,
  'gdm-onestep-all-below', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'gdm-onestep-all-below', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-004", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210005', 'usmle-step-2', 'obstetrics',
  $sc$A 36-year-old woman who works as an accountant is seen in the maternal-fetal clinic at 28 weeks of gestation for a 75-g tolerance test. She fasted for 11 hours. A first-trimester hemoglobin A1C was 5.2%. The fetal heart rate is 140/min. Temperature is 36.7°C, pulse is 78/min, respirations are 15/min, and blood pressure is 122/76 mm Hg. Plasma glucose is 91 mg/dL fasting, 179 mg/dL at 1 hour, and 152 mg/dL at 2 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Fasting glucose of 91 mg/dL exceeds the 90 mg/dL pregnancy cutoff", "The 1-hour result of 179 mg/dL exceeds the 140 mg/dL diagnostic cutoff", "The 2-hour result of 152 mg/dL exceeds the 140 mg/dL diagnostic cutoff", "Values this close to the cutoffs should be treated as a positive test", "Each result is just below its cutoff, so the test is not diagnostic"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gdm-onestep-fasting-just-under", "taskCategory": "diagnosis"}$op$,
  $ky$Each result is just below its cutoff, so the test is not diagnostic$ky$,
  $ex$The diagnosis requires a value at or above fasting 92 mg/dL, 1-hour 180 mg/dL, or 2-hour 153 mg/dL. Results of 91, 179, and 152 mg/dL are each 1 mg/dL below the corresponding cutoff. "Fasting glucose of 91 mg/dL exceeds the 90 mg/dL pregnancy cutoff" is not the best choice because The fasting cutoff is 92 mg/dL, not 90 mg/dL. "The 1-hour result of 179 mg/dL exceeds the 140 mg/dL diagnostic cutoff" is not the best choice because The 1-hour diagnostic cutoff is 180 mg/dL. 140 mg/dL is a treatment goal used after the diagnosis. "The 2-hour result of 152 mg/dL exceeds the 140 mg/dL diagnostic cutoff" is not the best choice because The 2-hour diagnostic cutoff is 153 mg/dL, not 140 mg/dL. "Values this close to the cutoffs should be treated as a positive test" is not the best choice because The criteria use 'met or exceeded.' A result below the cutoff is not a positive test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '8de12c6af06def266322343a0a22ce1f6b4d5e1c37ea19e817c0a3de7e243971', false, NOW(), NOW(), 4,
  'gdm-onestep-fasting-just-under', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'gdm-onestep-fasting-just-under', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-005", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210006', 'usmle-step-2', 'obstetrics',
  $sc$A 31-year-old woman who works as a flight attendant is seen in the prenatal clinic at 26 weeks of gestation. She ate breakfast 3 hours before the visit and then drank the 75-g glucose load. She has no vomiting. The fetal heart rate is 150/min. Temperature is 36.9°C, pulse is 90/min, respirations are 16/min, and blood pressure is 116/72 mm Hg. Plasma glucose is 101 mg/dL before the load, 188 mg/dL at 1 hour, and 160 mg/dL at 2 hours.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Repeat a 75-g test after an overnight fast of at least 8 hours", "Accept the results because any elevated value is diagnostic", "Start insulin today on the basis of the 1-hour result", "Order a hemoglobin A1C and use it as the pregnancy diagnostic test", "Schedule the next glucose test for 36 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gdm-onestep-short-fast", "taskCategory": "interpretation"}$op$,
  $ky$Repeat a 75-g test after an overnight fast of at least 8 hours$ky$,
  $ex$The one-step 75-g test is performed in the morning after an overnight fast of at least 8 hours. A test done 3 hours after breakfast does not meet that condition, so it should be repeated after a proper fast. "Accept the results because any elevated value is diagnostic" is not the best choice because The numeric thresholds apply to a correctly performed fasting test, not to a test done after a recent meal. "Start insulin today on the basis of the 1-hour result" is not the best choice because Treatment follows a valid diagnosis. This test was not performed after an adequate fast. "Order a hemoglobin A1C and use it as the pregnancy diagnostic test" is not the best choice because Because of increased red-cell turnover, A1C is not the diagnostic test for this mid-pregnancy evaluation, and estimated A1C methods are not used in pregnancy. "Schedule the next glucose test for 36 weeks" is not the best choice because Screening is scheduled at 24 to 28 weeks. Waiting until 36 weeks delays a test that can still be performed correctly now.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '0d8484c6573b15f6ce0c7533f7a5fa9e3d0815ff09ff3d1bd09b65607b7492b0', false, NOW(), NOW(), 4,
  'gdm-onestep-short-fast', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'gdm-onestep-short-fast', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-006", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210007', 'usmle-step-2', 'obstetrics',
  $sc$A 30-year-old woman who works as a software engineer is seen in the obstetric clinic at 12 weeks of gestation. Body mass index is 33 kg/m2. She has no symptoms of hyperglycemia. She fasted for 10 hours. The fetal heart rate is 158/min. Temperature is 36.6°C, pulse is 84/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. A 75-g test shows plasma glucose of 94 mg/dL fasting, 170 mg/dL at 1 hour, and 148 mg/dL at 2 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Fasting glucose of 94 mg/dL at 12 weeks meets the one-step diagnosis during today's visit", "The 24-to-28-week one-step cutoffs should not be used to label this early test", "Early testing with these cutoffs replaces the 24-to-28-week test", "A fasting value under 126 mg/dL rules out all later testing", "Insulin should be started because the fasting value exceeds 92 mg/dL"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gdm-early-iadpsg-not-for-first-trimester", "taskCategory": "diagnosis"}$op$,
  $ky$The 24-to-28-week one-step cutoffs should not be used to label this early test$ky$,
  $ex$ADA states that the IADPSG 75-g diagnostic criteria and the two-step criteria were not derived from data in the first half of pregnancy and should not be used for early screening. Before 15 weeks, testing looks for abnormal glucose metabolism and undiagnosed diabetes, not these later cutoffs. "Fasting glucose of 94 mg/dL at 12 weeks meets the one-step diagnosis during today's visit" is not the best choice because The fasting cutoff of 92 mg/dL belongs to the 24-to-28-week one-step strategy, which should not be applied at 12 weeks. "Early testing with these cutoffs replaces the 24-to-28-week test" is not the best choice because If early testing does not show diabetes, screening is still performed at 24 to 28 weeks. "A fasting value under 126 mg/dL rules out all later testing" is not the best choice because A fasting glucose under 126 mg/dL does not meet nonpregnant diabetes criteria, but it does not cancel the later screen. "Insulin should be started because the fasting value exceeds 92 mg/dL" is not the best choice because Insulin is not started from an early test that should not be interpreted with the 24-to-28-week cutoffs.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'e660dccc1e65156b7b752fb8fd1a043ed7d1fa9fcc8d654de2aa320c015b145d', false, NOW(), NOW(), 5,
  'gdm-early-iadpsg-not-for-first-trimester', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'gdm-early-iadpsg-not-for-first-trimester', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-007", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210008', 'usmle-step-2', 'obstetrics',
  $sc$A 26-year-old woman who works as an elementary teacher is seen in the prenatal clinic at 16 weeks of gestation for a routine visit. Early fasting plasma glucose was 86 mg/dL and hemoglobin A1C was 5.1%. She has no personal history of diabetes. The fetal heart rate is 156/min. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. Urinalysis shows no glucose. Fundal height is consistent with dates.$sc$,
  $qu$Which of the following is the most appropriate glucose testing plan?$qu$,
  $op${"options": ["No further glucose testing is needed after a normal early result", "Start the 75-g diagnostic cutoffs at this 16-week visit", "Perform the routine glucose test at 24 to 28 weeks", "Postpone all glucose testing until the postpartum visit", "Repeat hemoglobin A1C monthly and skip a tolerance test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "gdm-screen-window-24-28", "taskCategory": "health-maintenance"}$op$,
  $ky$Perform the routine glucose test at 24 to 28 weeks$ky$,
  $ex$If early testing has not shown diabetes or high-risk abnormal glucose metabolism, ADA recommends screening at 24 to 28 weeks. A normal early fasting glucose and A1C do not replace that screen. "No further glucose testing is needed after a normal early result" is not the best choice because A normal early evaluation is followed by the 24-to-28-week screen. "Start the 75-g diagnostic cutoffs at this 16-week visit" is not the best choice because The one-step diagnostic cutoffs are for 24 to 28 weeks and are not applied as the early-screening method. "Postpone all glucose testing until the postpartum visit" is not the best choice because Waiting until after birth misses the antepartum screen. "Repeat hemoglobin A1C monthly and skip a tolerance test" is not the best choice because A1C is less useful as a pregnancy diagnostic test because red-cell turnover increases, and it does not replace the 24-to-28-week glucose test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'efa2312b24604f300d7a99d219389474f36430908b5ea50e41b46c3900097171', false, NOW(), NOW(), 2,
  'gdm-screen-window-24-28', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'gdm-screen-window-24-28', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-008", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210009', 'usmle-step-2', 'obstetrics',
  $sc$A 28-year-old woman who works as a cartographer is seen in the county prenatal clinic at 27 weeks of gestation the morning after a 100-g glucose load. Map deadlines have kept her on her feet, but she kept the appointment and did not vomit the drink. Fundal height is 27 cm. She uses only a prenatal vitamin. A urine dipstick shows no protein. Temperature is 36.7°C, pulse is 84/min, respirations are 16/min, and blood pressure is 116/72 mm Hg. Plasma glucose is 101 mg/dL fasting, 166 mg/dL at 1 hour, 142 mg/dL at 2 hours, and 128 mg/dL at 3 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A single high value is enough to call this 100-g test positive", "Fasting must reach 126 mg/dL before this test can be read", "The 3-hour result has to be the second high value", "One high fasting value does not meet the two-value rule", "These numbers are read with the 75-g one-step cutoffs"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cc-100g-fasting-only-not-enough", "taskCategory": "diagnosis"}$op$,
  $ky$One high fasting value does not meet the two-value rule$ky$,
  $ex$On the 100-g test, Carpenter-Coustan diagnosis needs at least two of fasting 95 mg/dL, 1-hour 180 mg/dL, 2-hour 155 mg/dL, and 3-hour 140 mg/dL. Fasting glucose is 101 mg/dL. The other three results are below their cutoffs, so only one value qualifies. "A single high value is enough to call this 100-g test positive" is not the best choice because One abnormal value is the rule for the 75-g one-step test, not for this 100-g test. "Fasting must reach 126 mg/dL before this test can be read" is not the best choice because A fasting threshold of 126 mg/dL belongs to nonpregnant testing. This 100-g test uses 95 mg/dL, and the gap here is the missing second abnormal value. "The 3-hour result has to be the second high value" is not the best choice because Any two of the four cutoffs are enough. The 3-hour value does not have a special required role, and this set has only one abnormal result. "These numbers are read with the 75-g one-step cutoffs" is not the best choice because One-step 75-g cutoffs are fasting 92, 1-hour 180, and 2-hour 153 mg/dL. They are not the reading rules for a 100-g load.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'fe2dc685e2a3e30271c5e28b6761cfb89ae636d42e4358fe7122d151b4a86ea1', false, NOW(), NOW(), 3,
  'cc-100g-fasting-only-not-enough', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cc-100g-fasting-only-not-enough', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-009", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210010', 'usmle-step-2', 'obstetrics',
  $sc$A 34-year-old woman who works as a ship navigator is seen in the harbor obstetric office at 26 weeks of gestation to review a completed 100-g test. She slept aboard ship, came straight to the lab, and tolerated the drink without dizziness. The fetus has been moving hourly by her count. Hemoglobin is 11.6 g/dL. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Plasma glucose is 88 mg/dL fasting, 162 mg/dL at 1 hour, 140 mg/dL at 2 hours, and 152 mg/dL at 3 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A 3-hour result of 152 mg/dL by itself makes the test positive", "The 2-hour result of 140 mg/dL meets the 3-hour cutoff", "Fasting glucose under 95 mg/dL erases a high 3-hour value and ends testing", "One abnormal 100-g value is read the same way as a 75-g test", "Only the 3-hour result is high, so two values are not met"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cc-100g-three-hour-only-not-enough", "taskCategory": "diagnosis"}$op$,
  $ky$Only the 3-hour result is high, so two values are not met$ky$,
  $ex$Carpenter-Coustan rules on the 100-g test require at least two values at or above fasting 95, 1-hour 180, 2-hour 155, and 3-hour 140 mg/dL. Only the 3-hour result, 152 mg/dL, clears its cutoff. "A 3-hour result of 152 mg/dL by itself makes the test positive" is not the best choice because A single 3-hour value does not meet the rule that at least two Carpenter-Coustan results must be abnormal. "The 2-hour result of 140 mg/dL meets the 3-hour cutoff" is not the best choice because The 2-hour cutoff is 155 mg/dL, not 140 mg/dL. The 140 mg/dL line is the 3-hour cutoff, and this 140 mg/dL result came from the 2-hour draw. "Fasting glucose under 95 mg/dL erases a high 3-hour value and ends testing" is not the best choice because A fasting result under 95 mg/dL does not cancel a later value. The test is not positive because only one of the four results is abnormal. "One abnormal 100-g value is read the same way as a 75-g test" is not the best choice because A single abnormal value can decide the 75-g one-step test. It does not decide this 100-g test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '6f4d3afe81b25bd43368a6ef2f18ddc0295f689862b5479d03252d36d4c23c8e', false, NOW(), NOW(), 4,
  'cc-100g-three-hour-only-not-enough', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cc-100g-three-hour-only-not-enough', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-010", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210011', 'usmle-step-2', 'obstetrics',
  $sc$A 31-year-old woman who works as a pastry chef is seen in the market-district maternity clinic at 28 weeks of gestation after finishing a 100-g test. She avoided tasting batter after midnight and sat quietly between blood draws. Ankle edema is mild. Platelets are 242,000/mm3. The bedside tracing shows a fetal heart rate of 150/min. Temperature is 36.8°C, pulse is 88/min, respirations are 15/min, and blood pressure is 118/74 mm Hg. Plasma glucose is 99 mg/dL fasting, 174 mg/dL at 1 hour, 160 mg/dL at 2 hours, and 131 mg/dL at 3 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The fasting and 2-hour results together meet the two-value rule", "The 1-hour result must also clear 180 mg/dL before the test counts", "A 3-hour result under 140 mg/dL keeps the whole test negative", "Fasting glucose must reach 126 mg/dL on a 100-g test", "Both the fasting and the 2-hour cutoffs are 140 mg/dL on this test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cc-100g-fasting-plus-two-hour", "taskCategory": "diagnosis"}$op$,
  $ky$The fasting and 2-hour results together meet the two-value rule$ky$,
  $ex$At least two Carpenter-Coustan values are required: fasting 95, 1-hour 180, 2-hour 155, and 3-hour 140 mg/dL. Fasting glucose is 99 mg/dL and the 2-hour glucose is 160 mg/dL, so two cutoffs are met. "The 1-hour result must also clear 180 mg/dL before the test counts" is not the best choice because The 1-hour cutoff is 180 mg/dL. This 1-hour result is 174 mg/dL, and it does not have to be abnormal when two other values already qualify. "A 3-hour result under 140 mg/dL keeps the whole test negative" is not the best choice because The 3-hour value is one of four possible contributors, not a required member of the pair. Two other results already meet their cutoffs. "Fasting glucose must reach 126 mg/dL on a 100-g test" is not the best choice because 126 mg/dL is the nonpregnant fasting threshold. The fasting cutoff on this 100-g test is 95 mg/dL. "Both the fasting and the 2-hour cutoffs are 140 mg/dL on this test" is not the best choice because Fasting and 2-hour cutoffs on the 100-g test are 95 and 155 mg/dL. 140 mg/dL is the 3-hour cutoff, and it is also a pregnancy treatment target rather than these two diagnostic lines.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'a034f5df215e4fc7634eb182f8395c510dce2c1011e6d83fcad58b1c29f3f1b7', false, NOW(), NOW(), 2,
  'cc-100g-fasting-plus-two-hour', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cc-100g-fasting-plus-two-hour', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-011", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210012', 'usmle-step-2', 'obstetrics',
  $sc$A 25-year-old woman who works as a court reporter is seen in the downtown obstetric office at 25 weeks of gestation for results of a 100-g test. She transcribed a long hearing yesterday and drank only water after 10 p.m. She has had no urinary frequency. Hemoglobin is 12.4 g/dL and the fundal height matches the dates. Temperature is 36.5°C, pulse is 76/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. Plasma glucose is 91 mg/dL fasting, 191 mg/dL at 1 hour, 147 mg/dL at 2 hours, and 144 mg/dL at 3 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A normal fasting result means the 100-g test cannot be positive", "The 1-hour and 3-hour results are a sufficient pair", "The 2-hour result must join the 1-hour result before two values exist", "The 3-hour cutoff on this test is 155 mg/dL, so 144 is low", "A 1-hour result matters only on the 50-g screen, not here"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cc-100g-one-hour-plus-three-hour", "taskCategory": "interpretation"}$op$,
  $ky$The 1-hour and 3-hour results are a sufficient pair$ky$,
  $ex$Carpenter-Coustan criteria need at least two of fasting 95, 1-hour 180, 2-hour 155, and 3-hour 140 mg/dL. The 1-hour result is 191 mg/dL and the 3-hour result is 144 mg/dL. "A normal fasting result means the 100-g test cannot be positive" is not the best choice because Fasting glucose is allowed to be normal. Any two of the four Carpenter-Coustan values are enough, and the fasting cutoff is 95 mg/dL. "The 2-hour result must join the 1-hour result before two values exist" is not the best choice because The 2-hour result is 147 mg/dL, under the 155 mg/dL cutoff. It is not required once another pair is already abnormal. "The 3-hour cutoff on this test is 155 mg/dL, so 144 is low" is not the best choice because The 3-hour cutoff is 140 mg/dL, not 155 mg/dL. This 3-hour result is 144 mg/dL, which is not below 140. "A 1-hour result matters only on the 50-g screen, not here" is not the best choice because The 1-hour value on the 100-g test has its own cutoff of 180 mg/dL. It is not limited to the 50-g screen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'f40481ecdb0f326166519bb066c9d615d6817b85b608aa67a563ad8f20b8a4d9', false, NOW(), NOW(), 3,
  'cc-100g-one-hour-plus-three-hour', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cc-100g-one-hour-plus-three-hour', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-012", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210013', 'usmle-step-2', 'obstetrics',
  $sc$A 37-year-old woman who works as a violin restorer is seen in the university obstetric clinic at 27 weeks of gestation to go over a 100-g test drawn this morning. Workshop varnish fumes were the reason she asked for a first appointment slot. She reports steady fetal movement. Body mass index is 26 kg/m2. A catheterized urine sample shows no glucose. Temperature is 36.7°C, pulse is 72/min, respirations are 15/min, and blood pressure is 120/76 mm Hg. Plasma glucose is 94 mg/dL fasting, 179 mg/dL at 1 hour, 154 mg/dL at 2 hours, and 139 mg/dL at 3 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Fasting 94 mg/dL meets the one-step line of 92 mg/dL on this test at this encounter", "A 2-hour result of 154 mg/dL meets the 100-g line of 153 mg/dL", "Each 100-g result is below its cutoff, so the test is not positive", "A result 1 mg/dL under a cutoff still counts as abnormal", "A 1-hour of 179 mg/dL is diagnostic by exceeding a treatment goal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cc-100g-every-value-just-under", "taskCategory": "diagnosis"}$op$,
  $ky$Each 100-g result is below its cutoff, so the test is not positive$ky$,
  $ex$Carpenter-Coustan cutoffs are fasting 95, 1-hour 180, 2-hour 155, and 3-hour 140 mg/dL, and at least two are required. Results of 94, 179, 154, and 139 mg/dL are each below the matching cutoff. "Fasting 94 mg/dL meets the one-step line of 92 mg/dL on this test at this encounter" is not the best choice because One-step fasting diagnosis uses 92 mg/dL on a 75-g test. It is not the fasting cutoff for this 100-g test, which is 95 mg/dL, and 94 mg/dL is below 95. "A 2-hour result of 154 mg/dL meets the 100-g line of 153 mg/dL" is not the best choice because 153 mg/dL is the one-step 2-hour cutoff. The 100-g 2-hour cutoff is 155 mg/dL, and 154 mg/dL is below it. "A result 1 mg/dL under a cutoff still counts as abnormal" is not the best choice because The criteria use values that meet or exceed the cutoffs. A result 1 mg/dL below the line is not abnormal. "A 1-hour of 179 mg/dL is diagnostic by exceeding a treatment goal" is not the best choice because A 1-hour treatment goal of 140 mg/dL is not a diagnostic cutoff. The 100-g 1-hour cutoff is 180 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'f16eaccb87304d2444d638292dce9da5ed2fd4761b1bc73555bf8e7190a35e10', false, NOW(), NOW(), 4,
  'cc-100g-every-value-just-under', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cc-100g-every-value-just-under', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-013", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210014', 'usmle-step-2', 'obstetrics',
  $sc$A 29-year-old woman who works as a park ranger is seen in the trailhead prenatal clinic at 26 weeks of gestation one hour after a 50-g glucose drink. She hiked a short patrol this morning before the visit and ate breakfast at dawn. This practice has posted its screen threshold as 140 mg/dL. Hemoglobin is 13.1 g/dL. Fetal movement is present. Temperature is 36.9°C, pulse is 90/min, respirations are 16/min, and blood pressure is 124/78 mm Hg. The 1-hour plasma glucose after the 50-g load is 133 mg/dL. A prior early fasting plasma glucose was 84 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Order the 100-g test because every practice must use 130 mg/dL", "Treat 133 mg/dL as positive because it exceeds a 1-hour goal of 140", "Apply 75-g diagnostic cutoffs to this 50-g result", "Do not go on to a 100-g test at this practice's 140 mg/dL threshold", "Repeat the same 50-g drink tomorrow and average the two 1-hour values"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "fifty-g-133-under-practice-threshold-140", "taskCategory": "interpretation"}$op$,
  $ky$Do not go on to a 100-g test at this practice's 140 mg/dL threshold$ky$,
  $ex$In the two-step approach, a 50-g screen is followed by a 100-g test when the 1-hour value meets the threshold that practice chose: 130, 135, or 140 mg/dL. This practice chose 140 mg/dL. The result is 133 mg/dL, which is below that threshold. "Order the 100-g test because every practice must use 130 mg/dL" is not the best choice because 130 mg/dL is one allowed threshold, not a mandate for every practice. A result is judged against the threshold the practice selected. "Treat 133 mg/dL as positive because it exceeds a 1-hour goal of 140" is not the best choice because 133 mg/dL does not exceed 140 mg/dL. The 140 mg/dL figure here is the chosen screen threshold, and a 1-hour value of 140 mg/dL is also a treatment goal used after diagnosis, not a reason to call 133 positive. "Apply 75-g diagnostic cutoffs to this 50-g result" is not the best choice because The 75-g one-step cutoffs are not applied to a 50-g screen. The screen only decides whether to proceed to the 100-g test. "Repeat the same 50-g drink tomorrow and average the two 1-hour values" is not the best choice because The two-step strategy does not average a second 50-g result. The single 1-hour value is compared with the chosen threshold.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'c02b47dd4aa204407dea815eadaf5d216f32355d7131d44f7ae9a9249535cedb', false, NOW(), NOW(), 5,
  'fifty-g-133-under-practice-threshold-140', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'fifty-g-133-under-practice-threshold-140', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-014", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210015', 'usmle-step-2', 'obstetrics',
  $sc$A 23-year-old woman who works as a floral designer is seen in the neighborhood maternity office at 24 weeks of gestation after a 50-g glucose drink. She came from the shop with pollen still on her sleeves and felt well during the hour wait. The written protocol in this office sets the screen threshold at 130 mg/dL. The fundal height is 24 cm. Temperature is 36.6°C, pulse is 82/min, respirations are 15/min, and blood pressure is 110/68 mm Hg. Plasma glucose 1 hour after the 50-g load is 130 mg/dL. Hemoglobin is 12.0 g/dL.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Schedule the 100-g test only if a second 50-g result is also 130 mg/dL", "Stop glucose testing because a 50-g result cannot lead anywhere", "Treat 130 mg/dL as negative unless the practice had chosen 140 mg/dL", "Call the screen diagnostic and skip the 100-g test", "Proceed to the 100-g test because 130 mg/dL meets the chosen threshold"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "fifty-g-130-meets-practice-threshold-130", "taskCategory": "health-maintenance"}$op$,
  $ky$Proceed to the 100-g test because 130 mg/dL meets the chosen threshold$ky$,
  $ex$The 50-g screen leads to a 100-g test when the 1-hour glucose meets the threshold that practice chose, which may be 130, 135, or 140 mg/dL. This office uses 130 mg/dL, and the result is 130 mg/dL. "Schedule the 100-g test only if a second 50-g result is also 130 mg/dL" is not the best choice because A second 50-g result is not required. One 1-hour value is compared with the practice threshold. "Stop glucose testing because a 50-g result cannot lead anywhere" is not the best choice because A 50-g result at or above the chosen threshold is the path into the 100-g test, not a reason to stop. "Treat 130 mg/dL as negative unless the practice had chosen 140 mg/dL" is not the best choice because With a chosen threshold of 130 mg/dL, a result of 130 mg/dL qualifies. The 140 mg/dL line would matter only if that were the threshold this practice had selected. "Call the screen diagnostic and skip the 100-g test" is not the best choice because The 50-g screen is not itself the diagnostic test. Diagnosis on this pathway uses the 100-g results.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c94caf90ec5032efa47ba2af70ecf38943511f82dc8bcd92c55f383834fdbc2c', false, NOW(), NOW(), 2,
  'fifty-g-130-meets-practice-threshold-130', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'fifty-g-130-meets-practice-threshold-130', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-015", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210016', 'usmle-step-2', 'obstetrics',
  $sc$A 32-year-old woman who works as a grant writer is seen in the early-pregnancy consult clinic at 12 weeks of gestation after a clinician ordered a 100-g test. She has a body mass index of 34 kg/m2 and no polyuria, polydipsia, or weight loss. The crown-rump length matches 12 weeks. She is not taking a glucose-lowering drug. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Plasma glucose is 96 mg/dL fasting, 183 mg/dL at 1 hour, 144 mg/dL at 2 hours, and 121 mg/dL at 3 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["These 100-g cutoffs should not be used before 15 weeks", "Two high values on this 100-g test make the diagnosis at 12 weeks", "Fasting glucose of 96 mg/dL meets the nonpregnant line of 126 mg/dL", "A normal early test cancels the screen that belongs at 24 to 28 weeks", "One high value would have been enough on this 100-g test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "hundred-g-cutoffs-not-before-15-weeks", "taskCategory": "diagnosis"}$op$,
  $ky$These 100-g cutoffs should not be used before 15 weeks$ky$,
  $ex$The 100-g and 75-g pregnancy criteria were not derived for the first half of pregnancy and should not be used before 15 weeks. This fasting value is under 126 mg/dL, so early testing has not shown diabetes. Screening still belongs at 24 to 28 weeks. "Two high values on this 100-g test make the diagnosis at 12 weeks" is not the best choice because Even though fasting 96 mg/dL and the 1-hour value of 183 mg/dL would be two Carpenter-Coustan abnormalities later in pregnancy, those 100-g criteria should not be applied before 15 weeks. "Fasting glucose of 96 mg/dL meets the nonpregnant line of 126 mg/dL" is not the best choice because The nonpregnant fasting threshold is 126 mg/dL. A fasting result of 96 mg/dL does not meet it, and the 2-hour result of 144 mg/dL is not at or above 200 mg/dL. "A normal early test cancels the screen that belongs at 24 to 28 weeks" is not the best choice because When early testing has not shown diabetes, the 24-to-28-week screen is still performed. "One high value would have been enough on this 100-g test" is not the best choice because A single abnormal value is not how the 100-g test is read, and those cutoffs are not applied at 12 weeks anyway.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '0773e84fb1a99403464bb8f3f96ec194e25de21b1c05cac2fb7c698a10589610', false, NOW(), NOW(), 5,
  'hundred-g-cutoffs-not-before-15-weeks', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'hundred-g-cutoffs-not-before-15-weeks', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-016", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210017', 'usmle-step-2', 'obstetrics',
  $sc$A 39-year-old woman who works as a ceramicist is seen in the first-trimester intake clinic at 10 weeks of gestation for a new obstetric history. She fasted for 9 hours because a parent was in surgery at dawn. She reports no polyuria, no excess thirst, and no unplanned weight change. Ultrasound dating agrees with 10 weeks. Hemoglobin is 12.8 g/dL. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. Fasting plasma glucose is 136 mg/dL. A fingerstick check in the room is 141 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Wait until 24 weeks because no glucose result counts before then", "This fasting result meets the 126 mg/dL line and still needs confirmation", "Use the pregnancy fasting cutoff of 92 mg/dL at this 10-week visit during today's visit", "A fasting result of 136 mg/dL is in the 100 to 125 mg/dL range", "One fasting result of 136 mg/dL can be ignored before 15 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "early-fasting-136-needs-confirmation", "taskCategory": "diagnosis"}$op$,
  $ky$This fasting result meets the 126 mg/dL line and still needs confirmation$ky$,
  $ex$Nonpregnant criteria use fasting plasma glucose of 126 mg/dL or higher after at least 8 hours. This result is 136 mg/dL after 9 hours. Without unequivocal hyperglycemia, a second abnormal result is required before the diagnosis is final. "Wait until 24 weeks because no glucose result counts before then" is not the best choice because A fasting plasma glucose at or above 126 mg/dL is not a normal early result that is simply parked until 24 to 28 weeks. "Use the pregnancy fasting cutoff of 92 mg/dL at this 10-week visit during today's visit" is not the best choice because The fasting cutoff of 92 mg/dL belongs to one-step testing at 24 to 28 weeks and is not applied before 15 weeks. "A fasting result of 136 mg/dL is in the 100 to 125 mg/dL range" is not the best choice because The 100 to 125 mg/dL fasting range is the prediabetes span. 136 mg/dL is above 126 mg/dL. "One fasting result of 136 mg/dL can be ignored before 15 weeks" is not the best choice because The instruction not to use later pregnancy cutoffs before 15 weeks does not erase a fasting value that already meets the 126 mg/dL threshold.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '1bbf21ef47e3e98642a62847e2c67bbc2a6f7992fc38d046f0825abdf22d0817', false, NOW(), NOW(), 4,
  'early-fasting-136-needs-confirmation', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'early-fasting-136-needs-confirmation', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-017", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210018', 'usmle-step-2', 'obstetrics',
  $sc$A 27-year-old woman who works as a botanist is seen in the greenhouse prenatal clinic at 11 weeks of gestation during the intake examination. She fasted 12 hours after a field collection and has no polyuria or unusual thirst. Body mass index is 31 kg/m2. The pelvic ultrasound measures 11 weeks. She takes no glucose-lowering medicine. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. Fasting plasma glucose is 116 mg/dL. A urine dipstick is negative for glucose.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Treat fasting glucose of 116 mg/dL as meeting the 126 mg/dL threshold", "Apply the 92 mg/dL pregnancy cutoff and close the question today", "Diabetes was not shown, so screen at 24 to 28 weeks", "Order a 100-g test today and read it with the usual later cutoffs", "Skip all later glucose testing after this early blood draw"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "early-fasting-116-screen-later", "taskCategory": "health-maintenance"}$op$,
  $ky$Diabetes was not shown, so screen at 24 to 28 weeks$ky$,
  $ex$Fasting plasma glucose of 116 mg/dL is under the diabetes threshold of 126 mg/dL, so this early test did not show diabetes. Pregnancy diagnostic cutoffs are not used before 15 weeks. Screening is performed at 24 to 28 weeks. "Treat fasting glucose of 116 mg/dL as meeting the 126 mg/dL threshold" is not the best choice because The fasting diabetes threshold is 126 mg/dL. A result of 116 mg/dL is below that line. "Apply the 92 mg/dL pregnancy cutoff and close the question today" is not the best choice because The 92 mg/dL fasting cutoff is for one-step testing at 24 to 28 weeks. Those pregnancy criteria should not be used before 15 weeks. "Order a 100-g test today and read it with the usual later cutoffs" is not the best choice because The 100-g Carpenter-Coustan cutoffs are not applied before 15 weeks. "Skip all later glucose testing after this early blood draw" is not the best choice because When early testing has not shown diabetes, screening is still done at 24 to 28 weeks.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c064686747012633fb358837375be6e869a3faa47166c7ca10c46fcc5cbee918', false, NOW(), NOW(), 5,
  'early-fasting-116-screen-later', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'early-fasting-116-screen-later', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-018", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210019', 'usmle-step-2', 'obstetrics',
  $sc$A 35-year-old woman who works as a landscape designer is seen in the preconception consult office to discuss a pregnancy she hopes to start within six months. Bedtime insulin and morning metformin were begun years ago for hyperglycemia. The lowest home glucose in the past month was 94 mg/dL, and she has had no shaking spells. She is using contraception now. A urine pregnancy test today is negative. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. Hemoglobin A1C is 7.4%. Creatinine is 0.7 mg/dL and the eGFR is 98 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate glycemic target before conception?$qu$,
  $op${"options": ["An A1C under 8% because conception uses a looser target", "An A1C under 6% because the pregnancy target already applies", "A fasting glucose under 92 mg/dL as the preconception rule", "An A1C under 6.5% if that can be reached safely", "No A1C target until after a positive pregnancy test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preconception-a1c-above-6-5", "taskCategory": "health-maintenance"}$op$,
  $ky$An A1C under 6.5% if that can be reached safely$ky$,
  $ex$Before conception, the A1C goal is under 6.5% when it can be reached safely. This result is 7.4%, and recent glucose readings have not shown hypoglycemia. "An A1C under 8% because conception uses a looser target" is not the best choice because The preconception goal is not relaxed to 8%. The stated goal is under 6.5% if safely achievable. "An A1C under 6% because the pregnancy target already applies" is not the best choice because An A1C under 6% is the goal during pregnancy when significant hypoglycemia is absent. It is not the preconception goal, which is under 6.5%. "A fasting glucose under 92 mg/dL as the preconception rule" is not the best choice because A fasting cutoff of 92 mg/dL is a one-step diagnostic threshold at 24 to 28 weeks, not the preconception A1C goal. "No A1C target until after a positive pregnancy test" is not the best choice because The under-6.5% goal is specifically a preconception target. Waiting for a positive test misses that window.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '68ecad039e348bf97a8d2cbff0d03808b15d4f05ac527509e7ef5af4be4f1383', false, NOW(), NOW(), 2,
  'preconception-a1c-above-6-5', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'preconception-a1c-above-6-5', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-019", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210020', 'usmle-step-2', 'obstetrics',
  $sc$A 33-year-old woman who works as a ferry captain is seen in the waterfront obstetric clinic at 33 weeks of gestation for a glucose-log review. Insulin was added after a midpregnancy glucose test, and she has been on a meal plan for six weeks. Overnight watches on the boat ended at dawn. She denies sweating or confusion. The fundal height is 33 cm. Temperature is 36.8°C, pulse is 86/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. The fasting plasma glucose this morning is 104 mg/dL. A 2-hour postbreakfast capillary glucose yesterday was 118 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation of the fasting result?$qu$,
  $op${"options": ["Fasting glucose of 104 mg/dL is under the pregnancy goal", "The fasting goal in pregnancy is under 126 mg/dL", "A fasting goal under 80 mg/dL is required in the third trimester", "Fasting goals are abandoned after 32 weeks of gestation", "The pregnancy fasting goal is under 95 mg/dL, so 104 is above it"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preg-fasting-above-95", "taskCategory": "interpretation"}$op$,
  $ky$The pregnancy fasting goal is under 95 mg/dL, so 104 is above it$ky$,
  $ex$During pregnancy the fasting glucose goal is under 95 mg/dL. This fasting result is 104 mg/dL. "Fasting glucose of 104 mg/dL is under the pregnancy goal" is not the best choice because 104 mg/dL is not under 95 mg/dL. The pregnancy fasting goal is under 95 mg/dL. "The fasting goal in pregnancy is under 126 mg/dL" is not the best choice because 126 mg/dL is a nonpregnant diagnostic threshold, not the pregnancy fasting treatment goal of under 95 mg/dL. "A fasting goal under 80 mg/dL is required in the third trimester" is not the best choice because No fasting treatment goal of 80 mg/dL is stated. The fasting goal is under 95 mg/dL. "Fasting goals are abandoned after 32 weeks of gestation" is not the best choice because The fasting goal under 95 mg/dL is the pregnancy goal and is not withdrawn after 32 weeks.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '9f4d0968c1f3e7f20580415f3822f1f0d4060529d3bcbbfc4ff91f50c0346f87', false, NOW(), NOW(), 2,
  'preg-fasting-above-95', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'preg-fasting-above-95', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-020", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210021', 'usmle-step-2', 'obstetrics',
  $sc$A 26-year-old woman who works as a pottery instructor is seen in the lakeside prenatal office at 21 weeks of gestation with a handwritten glucose log. A meal plan and evening insulin were started last month. She felt well on the studio floor this week and reports no tremor. Fetal movement began last week. Hemoglobin is 11.9 g/dL. Temperature is 36.5°C, pulse is 80/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. Fasting plasma glucose today is 88 mg/dL. The log's other fasting entries are 86 and 90 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["This fasting result meets the pregnancy goal of under 95 mg/dL", "Fasting glucose must be under 80 mg/dL to meet the pregnancy goal", "A fasting result of 88 mg/dL exceeds the pregnancy goal of under 95", "The pregnancy fasting goal is the nonpregnant line of under 100 mg/dL", "Fasting glucose is judged with the 126 mg/dL diagnostic line during treatment"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preg-fasting-meets-95", "taskCategory": "interpretation"}$op$,
  $ky$This fasting result meets the pregnancy goal of under 95 mg/dL$ky$,
  $ex$In pregnancy the fasting glucose goal is under 95 mg/dL. This fasting result is 88 mg/dL. "Fasting glucose must be under 80 mg/dL to meet the pregnancy goal" is not the best choice because The pregnancy fasting goal is under 95 mg/dL, not under 80 mg/dL. "A fasting result of 88 mg/dL exceeds the pregnancy goal of under 95" is not the best choice because 88 mg/dL is below 95 mg/dL, so it does not exceed the fasting goal. "The pregnancy fasting goal is the nonpregnant line of under 100 mg/dL" is not the best choice because A fasting span of 100 to 125 mg/dL is the nonpregnant prediabetes range, not the pregnancy treatment goal. "Fasting glucose is judged with the 126 mg/dL diagnostic line during treatment" is not the best choice because 126 mg/dL is a diagnostic threshold outside this treatment question. The treatment goal for fasting glucose in pregnancy is under 95 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'ddd61a381a43ef7640a4099a96e2fa38fe0a69a1f8780f7c121620a65f2fdca3', false, NOW(), NOW(), 1,
  'preg-fasting-meets-95', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'preg-fasting-meets-95', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-021", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210022', 'usmle-step-2', 'obstetrics',
  $sc$A 30-year-old woman who works as a clarinetist is seen in the concert-hall prenatal clinic at 29 weeks of gestation after a rehearsal and a timed meal. She has used meal planning and insulin since a glucose test four weeks ago. She ate a rice bowl when the rehearsal ended and had the sample drawn 1 hour later. She did not feel shaky. Fundal height is 29 cm. Temperature is 36.7°C, pulse is 84/min, respirations are 15/min, and blood pressure is 116/74 mm Hg. The 1-hour postprandial plasma glucose is 156 mg/dL. Fasting plasma glucose today was 90 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A 1-hour value of 156 mg/dL is acceptable because it is under 180 mg/dL", "The 1-hour goal in pregnancy is under 140 mg/dL, so 156 is above it", "The 1-hour pregnancy goal is under 120 mg/dL instead", "Postprandial goals apply only to the 2-hour sample here", "A fasting result of 90 mg/dL cancels the 1-hour reading"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preg-one-hour-above-140", "taskCategory": "interpretation"}$op$,
  $ky$The 1-hour goal in pregnancy is under 140 mg/dL, so 156 is above it$ky$,
  $ex$In pregnancy the 1-hour postprandial goal is under 140 mg/dL. This 1-hour result is 156 mg/dL. "A 1-hour value of 156 mg/dL is acceptable because it is under 180 mg/dL" is not the best choice because 180 mg/dL is a diagnostic cutoff on a glucose-tolerance test, not the 1-hour treatment goal. The treatment goal is under 140 mg/dL. "The 1-hour pregnancy goal is under 120 mg/dL instead" is not the best choice because Under 120 mg/dL is the 2-hour postprandial goal, not the 1-hour goal. "Postprandial goals apply only to the 2-hour sample here" is not the best choice because The pregnancy goals include a 1-hour postprandial glucose under 140 mg/dL or a 2-hour value under 120 mg/dL, along with fasting glucose under 95 mg/dL. "A fasting result of 90 mg/dL cancels the 1-hour reading" is not the best choice because Each timed result is compared with its own goal. A fasting value under 95 mg/dL does not erase a 1-hour value over 140 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '04bad6243b984781bc39856fc61d893d174f170784ef4f26351b9d95bb0a8b57', false, NOW(), NOW(), 2,
  'preg-one-hour-above-140', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'preg-one-hour-above-140', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-022", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210023', 'usmle-step-2', 'obstetrics',
  $sc$A 24-year-old woman who works as a tailor is seen in the garment-district obstetric office at 30 weeks of gestation with a 1-hour postmeal sample. She closed the shop, ate lentils and bread, and walked one block to the lab. Insulin and a meal plan have been in place for a month. She has had no sweating episodes. Hemoglobin is 11.4 g/dL. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. Plasma glucose 1 hour after the meal is 126 mg/dL. A fasting capillary reading at dawn was 86 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The 1-hour goal is under 120 mg/dL, so 126 is too high", "A 1-hour result must be under 92 mg/dL in pregnancy", "This 1-hour result meets the goal of under 140 mg/dL", "180 mg/dL is the 1-hour treatment goal, so 126 is far under it", "Any 1-hour result over 100 mg/dL misses the pregnancy goal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preg-one-hour-meets-140", "taskCategory": "interpretation"}$op$,
  $ky$This 1-hour result meets the goal of under 140 mg/dL$ky$,
  $ex$The 1-hour postprandial goal in pregnancy is under 140 mg/dL. This result is 126 mg/dL. "The 1-hour goal is under 120 mg/dL, so 126 is too high" is not the best choice because Under 120 mg/dL is the 2-hour postprandial goal. The 1-hour goal is under 140 mg/dL. "A 1-hour result must be under 92 mg/dL in pregnancy" is not the best choice because 92 mg/dL is a one-step fasting diagnostic cutoff, not a 1-hour treatment goal. "180 mg/dL is the 1-hour treatment goal, so 126 is far under it" is not the best choice because 180 mg/dL is a diagnostic cutoff on tolerance testing, not the 1-hour treatment goal of under 140 mg/dL. "Any 1-hour result over 100 mg/dL misses the pregnancy goal" is not the best choice because There is no pregnancy 1-hour treatment cutoff of 100 mg/dL. The 1-hour goal is under 140 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '56f27f9531cea16fb6932964fe9be8acad1712dbe70ebeb841d420a88bb11cfd', false, NOW(), NOW(), 1,
  'preg-one-hour-meets-140', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'preg-one-hour-meets-140', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-023", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210024', 'usmle-step-2', 'obstetrics',
  $sc$A 36-year-old woman who works as a surveyor is seen in the hill-county obstetric clinic at 32 weeks of gestation with a timed postlunch sample. She ate a tortilla plate after a site visit and stayed seated in the waiting room until the 2-hour draw. A meal plan and insulin are already in use. She had no tremor after lunch. Fundal height is 32 cm. Temperature is 36.8°C, pulse is 82/min, respirations are 15/min, and blood pressure is 120/76 mm Hg. Plasma glucose 2 hours after lunch is 129 mg/dL. Fasting plasma glucose was 91 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A 2-hour result is fine until it hits the 153 mg/dL line", "The 2-hour treatment goal in pregnancy is under 140 mg/dL", "Fasting glucose of 91 mg/dL makes the 2-hour result irrelevant", "The 2-hour goal is under 120 mg/dL, so 129 mg/dL is above it", "2-hour goals apply only before 28 weeks of gestation"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preg-two-hour-above-120", "taskCategory": "interpretation"}$op$,
  $ky$The 2-hour goal is under 120 mg/dL, so 129 mg/dL is above it$ky$,
  $ex$In pregnancy the 2-hour postprandial goal is under 120 mg/dL. This 2-hour result is 129 mg/dL. "A 2-hour result is fine until it hits the 153 mg/dL line" is not the best choice because 153 mg/dL is the one-step 2-hour diagnostic cutoff, not the treatment goal. Treatment uses a 2-hour goal under 120 mg/dL. "The 2-hour treatment goal in pregnancy is under 140 mg/dL" is not the best choice because Under 140 mg/dL is the 1-hour postprandial goal. The 2-hour goal is under 120 mg/dL. "Fasting glucose of 91 mg/dL makes the 2-hour result irrelevant" is not the best choice because A fasting result under 95 mg/dL does not replace the 2-hour goal. "2-hour goals apply only before 28 weeks of gestation" is not the best choice because The 2-hour goal under 120 mg/dL remains the pregnancy target at 32 weeks.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '9eb457fb852c11ffc2cb03d4f1206f3241c3d9b56a18b400975b07de98eae0f2', false, NOW(), NOW(), 3,
  'preg-two-hour-above-120', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'preg-two-hour-above-120', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-024", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210025', 'usmle-step-2', 'obstetrics',
  $sc$A 29-year-old woman who works as a copy editor is seen in the publishing-district obstetric office at 22 weeks of gestation for a lab review. She has used insulin since her teens, long before this pregnancy. Home readings this month bottomed at 78 mg/dL, and she has not needed help for shakiness. The anatomy scan was completed last week. Hemoglobin is 12.2 g/dL. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Hemoglobin A1C is 6.4%. A same-day fasting plasma glucose is 93 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation of the A1C?$qu$,
  $op${"options": ["An A1C of 6.4% meets the pregnancy goal because it is under 7%", "The preconception goal of under 6.5% is the goal to use at 22 weeks", "A1C is preferred once the fasting glucose is under 95 mg/dL", "An A1C under 8% is the standard goal used in pregnancy", "The pregnancy A1C goal is under 6% if hypoglycemia is absent"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preg-a1c-above-6-no-hypoglycemia", "taskCategory": "interpretation"}$op$,
  $ky$The pregnancy A1C goal is under 6% if hypoglycemia is absent$ky$,
  $ex$During pregnancy the A1C goal is under 6% if it can be reached without significant hypoglycemia. This A1C is 6.4%, and the lowest recent home glucose is 78 mg/dL. "An A1C of 6.4% meets the pregnancy goal because it is under 7%" is not the best choice because Under 7% is the usual nonpregnant goal, and it is also the relaxed pregnancy goal when that relaxation is needed to avoid hypoglycemia. This record does not show significant hypoglycemia, so the pregnancy goal is under 6%. "The preconception goal of under 6.5% is the goal to use at 22 weeks" is not the best choice because Under 6.5% is the preconception goal if safely achievable. At 22 weeks the pregnancy goal applies, and without significant hypoglycemia that goal is under 6%. "A1C is preferred once the fasting glucose is under 95 mg/dL" is not the best choice because Fasting glucose under 95 mg/dL is its own goal. It does not turn the A1C into a result that has already met the under-6% target. "An A1C under 8% is the standard goal used in pregnancy" is not the best choice because No pregnancy A1C goal of 8% is stated. Without significant hypoglycemia the goal is under 6%.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '230584c69595450b735c8c396c2e688b0aedb98b509a01ddca55837bb49a75aa', false, NOW(), NOW(), 4,
  'preg-a1c-above-6-no-hypoglycemia', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'preg-a1c-above-6-no-hypoglycemia', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-025", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210026', 'usmle-step-2', 'obstetrics',
  $sc$A 34-year-old woman who works as a glassblower is seen in the foundry obstetric clinic at 30 weeks of gestation after several sudden sweating episodes. Insulin doses were increased last month to chase a lower A1C. Coworkers helped her sit down three times this week when she became sweaty and confused. Symptoms cleared after glucose tablets. The furnace schedule has not changed. Hemoglobin is 11.7 g/dL. Temperature is 36.7°C, pulse is 92/min, respirations are 16/min, and blood pressure is 110/68 mm Hg. Capillary glucose during the episodes was 48, 51, and 46 mg/dL. Hemoglobin A1C today is 6.7%.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Significant hypoglycemia allows the A1C goal to relax to under 7%", "The A1C must still be pushed under 6% despite these episodes", "An A1C of 6.7% is above the relaxed goal, so insulin should rise", "Any glucose under 70 mg/dL cancels A1C targets for the rest of pregnancy", "The nonpregnant goal of under 7% is forbidden once insulin is used"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preg-a1c-relaxed-to-7-with-hypoglycemia", "taskCategory": "interpretation"}$op$,
  $ky$Significant hypoglycemia allows the A1C goal to relax to under 7%$ky$,
  $ex$If the under-6% goal cannot be reached without significant hypoglycemia, the pregnancy A1C goal is relaxed to under 7%. Glucose values of 48, 51, and 46 mg/dL were accompanied by symptoms that resolved with glucose. The A1C is 6.7%. "The A1C must still be pushed under 6% despite these episodes" is not the best choice because The under-6% goal applies when it can be reached without significant hypoglycemia. These episodes are a reason to relax the goal, not to chase 6%. "An A1C of 6.7% is above the relaxed goal, so insulin should rise" is not the best choice because The relaxed goal is under 7%. An A1C of 6.7% is not above that relaxed line. "Any glucose under 70 mg/dL cancels A1C targets for the rest of pregnancy" is not the best choice because Level 1 hypoglycemia is glucose under 70 and at or above 54 mg/dL, and level 2 is under 54 mg/dL. Those definitions do not abolish an A1C goal. The pregnancy goal is relaxed to under 7%, not removed. "The nonpregnant goal of under 7% is forbidden once insulin is used" is not the best choice because Under 7% remains available in pregnancy when it is needed to avoid hypoglycemia. Insulin use does not forbid that relaxed goal.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '3e7ecf2b90f1d050c35800c40bc843cb8c32541402a2217670e8e0bf8b7ce820', false, NOW(), NOW(), 4,
  'preg-a1c-relaxed-to-7-with-hypoglycemia', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'preg-a1c-relaxed-to-7-with-hypoglycemia', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-026", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210027', 'usmle-step-2', 'obstetrics',
  $sc$A 31-year-old woman who works as a hydrologist is seen in the river-gauge obstetric clinic at 28 weeks of gestation with a meter printout from a field assignment. She has checked capillary glucose four times a day since a glucose test last month and uses insulin with a meal plan. The printout calculates a glucose management indicator. She has had no sweating spells. Fetal movement is regular. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 114/72 mm Hg. The meter lists a glucose management indicator of 6.1%. Fasting capillary glucose this morning was 108 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A glucose management indicator of 6.1% meets the pregnancy A1C goal", "Do not use the glucose management indicator during pregnancy", "Estimated A1C from the meter replaces fasting and postmeal goals", "The indicator is valid only in the third trimester of pregnancy", "A management indicator under 6.5% is the preconception rule at 28 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "preg-ignore-glucose-management-indicator", "taskCategory": "interpretation"}$op$,
  $ky$Do not use the glucose management indicator during pregnancy$ky$,
  $ex$Glucose-management-indicator and estimated A1C calculations are not used in pregnancy. Fasting glucose this morning is 108 mg/dL, which is above the fasting goal of under 95 mg/dL. "A glucose management indicator of 6.1% meets the pregnancy A1C goal" is not the best choice because A glucose management indicator, or estimated A1C, is not used to judge pregnancy goals. The printed 6.1% does not show that the under-6% A1C goal has been met. "Estimated A1C from the meter replaces fasting and postmeal goals" is not the best choice because Pregnancy glucose goals remain fasting under 95 mg/dL and a 1-hour postprandial under 140 mg/dL or a 2-hour under 120 mg/dL. A calculated indicator does not replace them. This fasting reading is 108 mg/dL. "The indicator is valid only in the third trimester of pregnancy" is not the best choice because The instruction is not a third-trimester exception. Estimated A1C calculations are not used in pregnancy. "A management indicator under 6.5% is the preconception rule at 28 weeks" is not the best choice because Under 6.5% is a preconception A1C goal, not a license to use a meter-estimated A1C at 28 weeks.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'c80acc37c83551b233627e7854f6d605ec8a20adef16f090e9f289c438cf3244', false, NOW(), NOW(), 5,
  'preg-ignore-glucose-management-indicator', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'preg-ignore-glucose-management-indicator', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-027", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210028', 'usmle-step-2', 'obstetrics',
  $sc$A 27-year-old woman who works as a milliner is seen in the hat-shop prenatal clinic at 27 weeks of gestation the afternoon a 100-g test was completed. She has never used a glucose-lowering drug and has no meal plan, no walking program, and no weight goal. She felt well during the test. Body mass index is 33 kg/m2. The fundal height is 27 cm. Temperature is 36.7°C, pulse is 82/min, respirations are 15/min, and blood pressure is 116/74 mm Hg. On the 100-g test, plasma glucose was 100 mg/dL fasting, 170 mg/dL at 1 hour, 162 mg/dL at 2 hours, and 130 mg/dL at 3 hours.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Start metformin today as the first glucose-lowering drug", "Start glyburide today because lifestyle measures can wait during today's visit", "Begin medical nutrition therapy, activity, and weight management", "Start insulin today before any meal or activity plan", "Defer all care until the postpartum glucose test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "start-mnt-activity-and-weight-plan", "taskCategory": "clinical-intervention"}$op$,
  $ky$Begin medical nutrition therapy, activity, and weight management$ky$,
  $ex$After this diagnosis, the initial step is medical nutrition therapy together with physical activity and weight management. Insulin is reserved for when those measures are not enough. Fasting glucose was 100 mg/dL and the 2-hour value was 162 mg/dL. "Start metformin today as the first glucose-lowering drug" is not the best choice because Metformin crosses the placenta and is not first-line when glucose-lowering drug therapy is needed. Drug therapy is also not the first move before a lifestyle trial. "Start glyburide today because lifestyle measures can wait during today's visit" is not the best choice because Glyburide crosses the placenta and is not first-line. Lifestyle has not yet been tried. "Start insulin today before any meal or activity plan" is not the best choice because Insulin is first-line when lifestyle measures are not enough. A meal plan, activity, and weight management have not been started, so insulin is not the next step today. "Defer all care until the postpartum glucose test" is not the best choice because Waiting until after birth skips the care that starts once the testing criteria are met. Two 100-g values are already at or above the Carpenter-Coustan lines of fasting 95 and 2-hour 155 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', '77d659130e8fd1d518796984e7525adebb18a055226c7b178846d74190e2b596', false, NOW(), NOW(), 2,
  'start-mnt-activity-and-weight-plan', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'start-mnt-activity-and-weight-plan', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-028", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210029', 'usmle-step-2', 'obstetrics',
  $sc$A 22-year-old woman who works as a beekeeper is seen in the orchard prenatal office at 22 weeks of gestation with a three-day food notebook. Morning sickness faded last week. She has been living on tea, crackers, and a little yogurt between hive checks, and the notebook totals 96 g of carbohydrate a day. A meal plan was started after a glucose test, along with evening insulin. She has had no shaking spells. The fundal height is 22 cm. Temperature is 36.6°C, pulse is 88/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. Fasting plasma glucose today is 90 mg/dL. Hemoglobin is 11.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate nutrition advice?$qu$,
  $op${"options": ["Stay at 96 g per day because the fasting glucose is under 95", "Cut carbohydrate again and replace those calories with butter", "Treat 100 g per day as the pregnancy minimum, so 96 is close", "Raise carbohydrate intake to at least 175 g per day", "Stop counting carbohydrate until the postpartum visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "carb-count-96-under-175", "taskCategory": "clinical-intervention"}$op$,
  $ky$Raise carbohydrate intake to at least 175 g per day$ky$,
  $ex$The minimum carbohydrate intake in pregnancy is 175 g per day. A log of 96 g per day is below that floor and should be raised, even though the fasting glucose of 90 mg/dL is under the 95 mg/dL goal. "Stay at 96 g per day because the fasting glucose is under 95" is not the best choice because A fasting glucose under 95 mg/dL meets the fasting goal. It does not lower the carbohydrate minimum of 175 g per day. "Cut carbohydrate again and replace those calories with butter" is not the best choice because Carbohydrate should not be replaced with fat to chase glucose numbers, and intake is already under 175 g per day. "Treat 100 g per day as the pregnancy minimum, so 96 is close" is not the best choice because The pregnancy minimum is 175 g per day, not 100 g per day. "Stop counting carbohydrate until the postpartum visit" is not the best choice because The 175 g minimum applies during pregnancy. Waiting until after birth leaves the intake below that floor.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', 'bca8cc1b95f9030d36407a6568a806857fa45ea3ca7e2a0ebe9f9c8a31c29174', false, NOW(), NOW(), 3,
  'carb-count-96-under-175', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'carb-count-96-under-175', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-029", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210030', 'usmle-step-2', 'obstetrics',
  $sc$A 30-year-old woman who works as a stonemason is seen in the quarry-town obstetric clinic at 30 weeks of gestation after a dietitian added up her lunch pail. The pail has been rice cakes, an apple, and yogurt, and the tally is 168 g of carbohydrate. She lifts stone in the morning and walks the site road after work. Insulin doses have been stable. She denies sweating. Fundal height is 30 cm. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Fasting plasma glucose is 94 mg/dL. A 1-hour postlunch capillary glucose was 132 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation of the carbohydrate tally?$qu$,
  $op${"options": ["168 g per day exceeds the pregnancy minimum, so no change is needed", "The minimum falls to 150 g per day after 28 weeks", "A 1-hour glucose of 132 mg/dL means carbohydrate must be cut", "Only sugar-sweetened drinks count toward the 175 g figure", "168 g per day is still short of the 175 g daily minimum"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "carb-count-168-still-short", "taskCategory": "interpretation"}$op$,
  $ky$168 g per day is still short of the 175 g daily minimum$ky$,
  $ex$Minimum carbohydrate intake in pregnancy is 175 g per day. A tally of 168 g per day is still short of that minimum. Fasting glucose is 94 mg/dL, under the 95 mg/dL goal, and the 1-hour value of 132 mg/dL is under the 140 mg/dL goal. "168 g per day exceeds the pregnancy minimum, so no change is needed" is not the best choice because 168 g is not above 175 g. The minimum is 175 g per day, so this tally has not cleared it. "The minimum falls to 150 g per day after 28 weeks" is not the best choice because The 175 g minimum is not reduced to 150 g after 28 weeks. No such trimester exception is stated. "A 1-hour glucose of 132 mg/dL means carbohydrate must be cut" is not the best choice because A 1-hour postprandial glucose under 140 mg/dL meets that goal. It is not a reason to cut carbohydrate, and the intake is already under 175 g per day. "Only sugar-sweetened drinks count toward the 175 g figure" is not the best choice because The 175 g figure is carbohydrate intake, not a rule that counts only sugar-sweetened drinks.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation", "nutrition"]$tg$,
  's2-new-20261121-hidden', 'e5cea5571821d989cb868e934f95a74875c6ab27f0c5a2453e8f35e4223d19b5', false, NOW(), NOW(), 4,
  'carb-count-168-still-short', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'carb-count-168-still-short', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-030", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210031', 'usmle-step-2', 'obstetrics',
  $sc$A 28-year-old woman who works as a jeweler is seen in the arcade prenatal clinic at 24 weeks of gestation holding a dietitian printout. The printout, built from bench-side meals of rice, fruit, and beans, totals 175 g of carbohydrate. She sits at a bench lamp most of the day and walks home. Evening insulin was started two weeks ago. She has not felt shaky. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Fasting plasma glucose is 89 mg/dL. Hemoglobin is 12.6 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["175 g per day meets the pregnancy carbohydrate minimum", "175 g per day is below the pregnancy minimum and must be raised", "The minimum is 200 g per day, so this printout falls short", "Trade carbohydrate for cheese to protect the fasting glucose", "Meeting 175 g per day means insulin can never be used later"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "carb-count-175-meets-minimum", "taskCategory": "interpretation"}$op$,
  $ky$175 g per day meets the pregnancy carbohydrate minimum$ky$,
  $ex$The minimum carbohydrate intake in pregnancy is 175 g per day. This printout is 175 g per day, so the minimum is met. Fasting glucose is 89 mg/dL, which is under the 95 mg/dL goal. "175 g per day is below the pregnancy minimum and must be raised" is not the best choice because 175 g per day is the minimum, not a shortfall below it. "The minimum is 200 g per day, so this printout falls short" is not the best choice because No minimum of 200 g per day is stated. The minimum is 175 g per day. "Trade carbohydrate for cheese to protect the fasting glucose" is not the best choice because Carbohydrate should not be replaced with fat to chase glucose. Cheese is not a substitute for the carbohydrate minimum. "Meeting 175 g per day means insulin can never be used later" is not the best choice because Meeting the 175 g minimum does not decide later drug therapy. Insulin is first-line if lifestyle measures are not enough.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation", "nutrition"]$tg$,
  's2-new-20261121-hidden', 'a14f44ac86a6db8a4c1346ab655f7345a23695356821a9336ec9f93703ccd86c', false, NOW(), NOW(), 1,
  'carb-count-175-meets-minimum', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'carb-count-175-meets-minimum', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-031", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210032', 'usmle-step-2', 'obstetrics',
  $sc$A 33-year-old woman who works as a night baker is seen in the bakery-row obstetric office at 28 weeks of gestation worried she is not eating enough starch. Shift meals are bread, fruit, and a bean stew. She weighed the portions and reached 236 g of carbohydrate. A coworker told her pregnant people must keep adding starch every week. Insulin and a meal plan are in place. She denies tremor. Temperature is 36.8°C, pulse is 84/min, respirations are 15/min, and blood pressure is 116/72 mm Hg. Fasting plasma glucose is 92 mg/dL. A 2-hour postsupper capillary glucose was 112 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["She must climb from 236 g to at least 300 g per day", "236 g per day already satisfies the 175 g minimum", "236 g per day is dangerous because the minimum is also the maximum", "The 2-hour glucose of 112 mg/dL requires an immediate cut below 175 g", "Carbohydrate targets apply only in the first trimester"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "carb-count-236-already-meets", "taskCategory": "interpretation"}$op$,
  $ky$236 g per day already satisfies the 175 g minimum$ky$,
  $ex$Minimum carbohydrate intake in pregnancy is 175 g per day. An intake of 236 g per day meets that minimum. Fasting glucose is 92 mg/dL, under the goal of 95 mg/dL. "She must climb from 236 g to at least 300 g per day" is not the best choice because No requirement to reach 300 g per day is stated. The minimum is 175 g per day, and 236 g is already above it. "236 g per day is dangerous because the minimum is also the maximum" is not the best choice because 175 g per day is a minimum. The source does not make that number a maximum, and it says not to replace carbohydrate with fat to chase glucose. "The 2-hour glucose of 112 mg/dL requires an immediate cut below 175 g" is not the best choice because A 2-hour postprandial glucose under 120 mg/dL meets that goal. Cutting below 175 g per day is not the response. "Carbohydrate targets apply only in the first trimester" is not the best choice because The 175 g minimum is a pregnancy rule, not a first-trimester-only rule. She is at 28 weeks and already above 175 g.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation", "nutrition"]$tg$,
  's2-new-20261121-hidden', '7d32b45bc43ca4cd0d3fd0c438dc4fe0c04ce613e1f8bc03d0461ce0c088abd6', false, NOW(), NOW(), 2,
  'carb-count-236-already-meets', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'carb-count-236-already-meets', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-032", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210033', 'usmle-step-2', 'obstetrics',
  $sc$A 26-year-old woman who works as a radio dispatcher is seen in the night-shift prenatal clinic at 26 weeks of gestation asking whether to adopt a 90 g menu. She printed the menu to bring a fasting reading down. Current meals, eaten between calls, total about 180 g of carbohydrate. A meal plan and insulin began three weeks ago. She has not had a sweating episode. The fundus measures 26 cm. Temperature is 36.7°C, pulse is 80/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. Fasting plasma glucose this morning is 102 mg/dL. Hemoglobin is 12.1 g/dL.$sc$,
  $qu$Which of the following is the most appropriate statement?$qu$,
  $op${"options": ["A 90 g menu is preferred because lower carbohydrate always lowers fasting glucose", "The pregnancy minimum is 90 g, so that menu is exactly on target", "Do not drop carbohydrate below 175 g per day to chase the glucose", "Replace the cut carbohydrate with cream so calories stay the same", "Fasting glucose of 102 mg/dL is already under the 95 mg/dL goal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "do-not-cut-carbs-below-175", "taskCategory": "communication"}$op$,
  $ky$Do not drop carbohydrate below 175 g per day to chase the glucose$ky$,
  $ex$Minimum carbohydrate intake in pregnancy is 175 g per day. A drop from about 180 g to 90 g would break that floor. The fasting glucose is 102 mg/dL, above the goal of under 95 mg/dL, and carbohydrate is not replaced with fat to chase it. "A 90 g menu is preferred because lower carbohydrate always lowers fasting glucose" is not the best choice because Chasing glucose by cutting carbohydrate below the minimum is not the advice. The minimum is 175 g per day, and 90 g is far under it. "The pregnancy minimum is 90 g, so that menu is exactly on target" is not the best choice because The minimum is 175 g per day, not 90 g per day. "Replace the cut carbohydrate with cream so calories stay the same" is not the best choice because Carbohydrate should not be replaced with fat to chase a glucose number. "Fasting glucose of 102 mg/dL is already under the 95 mg/dL goal" is not the best choice because 102 mg/dL is above the fasting goal of under 95 mg/dL. That gap is not fixed by pretending the goal has already been met.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "communication", "nutrition"]$tg$,
  's2-new-20261121-hidden', '108fc039b317d954f0b38f700e784d61b6cbfc05d6c35ef17814b0e279c381d6', false, NOW(), NOW(), 3,
  'do-not-cut-carbs-below-175', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'communication', 'do-not-cut-carbs-below-175', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-033", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210034', 'usmle-step-2', 'obstetrics',
  $sc$A 35-year-old woman who works as a cheese buyer is seen in the market obstetric clinic at 29 weeks of gestation after she rebuilt her plate around the cheese case. Pasta and fruit left the lunch bag. Wedges of cheese and olive oil took their place, and the carbohydrate tally fell to 70 g per day. She says the richer plate keeps her full on buying trips. Insulin is in use. She has had no tremor. Fetal movement is daily. Temperature is 36.6°C, pulse is 78/min, respirations are 15/min, and blood pressure is 120/76 mm Hg. Fasting plasma glucose is 101 mg/dL. A 1-hour postlunch capillary glucose was 136 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate nutrition advice?$qu$,
  $op${"options": ["Keep the cheese-and-oil plate because 70 g of carbohydrate is plenty", "The fasting goal is under 110 mg/dL, so 101 mg/dL needs no food change", "Add still more olive oil and drop carbohydrate to 40 g per day", "Do not replace carbohydrate with fat; restore intake to at least 175 g", "Fat substitution is recommended once the 1-hour glucose is under 180"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "do-not-swap-carbohydrate-for-fat", "taskCategory": "clinical-intervention"}$op$,
  $ky$Do not replace carbohydrate with fat; restore intake to at least 175 g$ky$,
  $ex$Carbohydrate should not be replaced with fat to chase glucose. The pregnancy minimum is 175 g of carbohydrate per day, and this tally is 70 g. Fasting glucose is 101 mg/dL, above the goal of under 95 mg/dL. "Keep the cheese-and-oil plate because 70 g of carbohydrate is plenty" is not the best choice because 70 g per day is below the 175 g minimum. Fullness from cheese and oil does not replace that carbohydrate floor. "The fasting goal is under 110 mg/dL, so 101 mg/dL needs no food change" is not the best choice because The fasting goal is under 95 mg/dL, not under 110 mg/dL. A result of 101 mg/dL is above the goal, and the food pattern still breaks the carbohydrate minimum. "Add still more olive oil and drop carbohydrate to 40 g per day" is not the best choice because A further cut to 40 g would move even farther from 175 g per day, and adding fat is the pattern the guidance rejects. "Fat substitution is recommended once the 1-hour glucose is under 180" is not the best choice because 180 mg/dL is a diagnostic cutoff, not permission to swap carbohydrate for fat. The 1-hour treatment goal is under 140 mg/dL, and this 1-hour value is 136 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', 'd2244c457a68a203546f447b2776d7f7665c76f15b6e4062ebe2bcdb1f2f7cb3', false, NOW(), NOW(), 3,
  'do-not-swap-carbohydrate-for-fat', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'do-not-swap-carbohydrate-for-fat', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-034", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210035', 'usmle-step-2', 'obstetrics',
  $sc$A 24-year-old woman who works as a seed merchant is seen in the grain-exchange prenatal office at 25 weeks of gestation proud that her morning numbers look calm. Breakfast is eggs and a few berries. She skips rice at the stall and estimates 80 g of carbohydrate a day. A meal plan was prescribed, but she trimmed it herself. Insulin continues. She has had no sweating. The fundal height matches the dates. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 106/64 mm Hg. Fasting plasma glucose is 86 mg/dL. Hemoglobin is 12.9 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A fasting glucose of 86 mg/dL cancels the carbohydrate minimum", "80 g per day is acceptable because it is half of 175 g", "The fasting goal in pregnancy is under 80 mg/dL, so 86 is high", "Carbohydrate floors are used only when a 1-hour value exceeds 180 mg/dL", "The 175 g minimum still applies while this fasting result is at goal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "fasting-at-goal-carb-floor-remains", "taskCategory": "interpretation"}$op$,
  $ky$The 175 g minimum still applies while this fasting result is at goal$ky$,
  $ex$Minimum carbohydrate intake in pregnancy is 175 g per day. An intake near 80 g is below that floor. The fasting glucose of 86 mg/dL does meet the goal of under 95 mg/dL, and that success does not erase the food minimum. "A fasting glucose of 86 mg/dL cancels the carbohydrate minimum" is not the best choice because Meeting the fasting goal does not waive the carbohydrate minimum. The minimum is 175 g per day regardless of a fasting result under 95 mg/dL. "80 g per day is acceptable because it is half of 175 g" is not the best choice because There is no rule that half of 175 g is enough. The minimum is 175 g per day. "The fasting goal in pregnancy is under 80 mg/dL, so 86 is high" is not the best choice because The fasting goal is under 95 mg/dL, not under 80 mg/dL. A result of 86 mg/dL meets the fasting goal. "Carbohydrate floors are used only when a 1-hour value exceeds 180 mg/dL" is not the best choice because The carbohydrate minimum is not held back until a 1-hour diagnostic cutoff of 180 mg/dL is crossed. It applies in pregnancy, including when glucose goals are being met.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation", "nutrition"]$tg$,
  's2-new-20261121-hidden', '988324ca056b58aefe0fcac63017696efad35c33969948e14a93c5840b99f26b', false, NOW(), NOW(), 3,
  'fasting-at-goal-carb-floor-remains', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'fasting-at-goal-carb-floor-remains', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-035", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210036', 'usmle-step-2', 'obstetrics',
  $sc$A 32-year-old woman who works as a quilt maker is seen in the guild-hall obstetric clinic at 31 weeks of gestation asking to slash starch after a high afternoon reading. Her current meals total about 190 g of carbohydrate. She wants a new target of 110 g so the afternoon peak will fall. Sewing clients come to the hall, and she eats between fittings. Insulin and a meal plan are already underway. She has not felt shaky. Temperature is 36.8°C, pulse is 86/min, respirations are 16/min, and blood pressure is 122/78 mm Hg. Plasma glucose 1 hour after lunch is 158 mg/dL. Fasting plasma glucose was 93 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate nutrition plan?$qu$,
  $op${"options": ["Adjust treatment without taking carbohydrate under 175 g per day", "Drop intake to 110 g per day and leave the insulin unchanged", "Replace the removed starch with cream cheese and nuts", "Ignore 158 mg/dL because the 1-hour diagnostic cutoff is 180 mg/dL", "The 1-hour goal is under 200 mg/dL, so 158 needs no response"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "high-postmeal-keep-carb-floor", "taskCategory": "clinical-intervention"}$op$,
  $ky$Adjust treatment without taking carbohydrate under 175 g per day$ky$,
  $ex$The 1-hour postprandial goal is under 140 mg/dL, and this result is 158 mg/dL, so the plan needs attention. Minimum carbohydrate intake stays 175 g per day. Insulin is first-line when lifestyle measures are not enough, and carbohydrate is not traded for fat. "Drop intake to 110 g per day and leave the insulin unchanged" is not the best choice because 110 g per day is under the 175 g minimum. A high 1-hour reading is not a reason to break that floor. "Replace the removed starch with cream cheese and nuts" is not the best choice because Carbohydrate should not be replaced with fat to chase glucose. "Ignore 158 mg/dL because the 1-hour diagnostic cutoff is 180 mg/dL" is not the best choice because 180 mg/dL is a diagnostic cutoff on a tolerance test, not the 1-hour treatment goal. The treatment goal is under 140 mg/dL. "The 1-hour goal is under 200 mg/dL, so 158 needs no response" is not the best choice because There is no 1-hour treatment goal of 200 mg/dL. The 1-hour goal is under 140 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', '5725eadbdad80a7b5c1f0d79592d18b7f7d4bb0afc3a26ea36cb24bdebf0b5e5', false, NOW(), NOW(), 3,
  'high-postmeal-keep-carb-floor', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'high-postmeal-keep-carb-floor', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-036", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210037', 'usmle-step-2', 'obstetrics',
  $sc$A 29-year-old woman who works as a sign painter is seen in the scaffold prenatal clinic at 23 weeks of gestation a week after a 100-g test. She already walks the scaffold stairs all day and has lost no discussion of her meals. Nobody has given her a food plan, and lunch is whatever the truck sells. She is not using a glucose-lowering drug. Body mass index is 32 kg/m2. Fetal heart rate on the Doppler is 148/min. Temperature is 36.6°C, pulse is 90/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. The 100-g test showed 98 mg/dL fasting, 168 mg/dL at 1 hour, 159 mg/dL at 2 hours, and 126 mg/dL at 3 hours.$sc$,
  $qu$Which of the following is the most appropriate addition?$qu$,
  $op${"options": ["Metformin, because stair climbing replaces a food plan", "Medical nutrition therapy, which walking does not replace", "Glyburide, because activity means drug therapy should come first", "Insulin tonight, before any counseling about meals", "No further steps, because two 100-g values were not abnormal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "walking-already-started-add-meal-therapy", "taskCategory": "clinical-intervention"}$op$,
  $ky$Medical nutrition therapy, which walking does not replace$ky$,
  $ex$Initial care is medical nutrition therapy, activity, and weight management. She is already active on the scaffold. The missing piece is medical nutrition therapy. On the 100-g test, fasting 98 mg/dL and the 2-hour value of 159 mg/dL are two results at or above 95 and 155 mg/dL. "Metformin, because stair climbing replaces a food plan" is not the best choice because Metformin crosses the placenta and is not first-line. Walking is activity, and it does not stand in for medical nutrition therapy. "Glyburide, because activity means drug therapy should come first" is not the best choice because Glyburide crosses the placenta and is not first-line. Activity does not move a drug ahead of the meal plan. "Insulin tonight, before any counseling about meals" is not the best choice because Insulin is first-line when lifestyle measures are not enough. Medical nutrition therapy has not started. "No further steps, because two 100-g values were not abnormal" is not the best choice because Those two results do meet Carpenter-Coustan cutoffs. Fasting 95 and 2-hour 155 mg/dL are the lines, and 98 and 159 mg/dL are at or above them.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', 'e122e2076ae4d0552f15ec7a11a7f3e8ba4b1443aba9559ee5e5ead2939bf51a', false, NOW(), NOW(), 3,
  'walking-already-started-add-meal-therapy', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'walking-already-started-add-meal-therapy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-037", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210038', 'usmle-step-2', 'obstetrics',
  $sc$A 38-year-old woman who works as a long-haul driver is seen in the truck-stop obstetric clinic at 27 weeks of gestation saying weight is nobody's business. A dietitian plan is in use and totals 190 g of carbohydrate. She walks the lot during fuel stops. Scale entries show a gain of 6 kg across the past four weeks. She wants glucose tablets and insulin discussed, and weight left out. Body mass index early in pregnancy was 37 kg/m2. Temperature is 36.7°C, pulse is 82/min, respirations are 15/min, and blood pressure is 124/78 mm Hg. Fasting plasma glucose is 90 mg/dL. A 1-hour postmeal capillary glucose was 128 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Drop the meal plan and focus only on the scale", "Cut carbohydrate to 120 g per day to force weight down", "Keep medical nutrition therapy and include weight management", "Ignore weight because the 1-hour glucose is under 140 mg/dL before the patient leaves", "Replace carbohydrate calories with fried food from the stop"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "meal-plan-in-place-add-weight-management", "taskCategory": "health-maintenance"}$op$,
  $ky$Keep medical nutrition therapy and include weight management$ky$,
  $ex$After the glucose diagnosis, care includes medical nutrition therapy, activity, and weight management. The meal plan of 190 g meets the 175 g carbohydrate minimum, and walking is already happening. Weight management still belongs in the plan. Fasting glucose is 90 mg/dL, under the goal of 95 mg/dL, and the 1-hour value is 128 mg/dL, under 140 mg/dL. "Drop the meal plan and focus only on the scale" is not the best choice because The meal plan is part of medical nutrition therapy and should not be discarded. Weight management is added to it, not substituted for it. "Cut carbohydrate to 120 g per day to force weight down" is not the best choice because 120 g per day is under the 175 g minimum. Weight management does not mean breaking that carbohydrate floor. "Ignore weight because the 1-hour glucose is under 140 mg/dL before the patient leaves" is not the best choice because A 1-hour glucose of 128 mg/dL is under the 140 mg/dL goal. Weight management is still part of the initial approach, together with medical nutrition therapy and activity. "Replace carbohydrate calories with fried food from the stop" is not the best choice because Carbohydrate should not be replaced with fat to chase a number.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance", "nutrition"]$tg$,
  's2-new-20261121-hidden', '2195568437fe8bd38c0f6240b88004b4eb76c57de4a4f6207bb1a56a7e82726b', false, NOW(), NOW(), 3,
  'meal-plan-in-place-add-weight-management', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'meal-plan-in-place-add-weight-management', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-038", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": true, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210039', 'usmle-step-2', 'obstetrics',
  $sc$A 34-year-old woman who works as a roofing estimator is seen in the ridge-line obstetric office at 30 weeks of gestation after three weeks of a meal plan, walks, and weight checks. The dietitian log shows 188 g of carbohydrate per day. She climbs job ladders for the activity piece and has been watching the scale. There have been no sweating spells. She has never filled a glucose-lowering prescription. Fundal height is 30 cm. Temperature is 36.7°C, pulse is 80/min, respirations are 15/min, and blood pressure is 116/74 mm Hg. Fasting plasma glucose on three mornings is 109, 112, and 107 mg/dL. Hemoglobin is 12.0 g/dL.$sc$,
  $qu$Which of the following is the most appropriate medication?$qu$,
  $op${"options": ["Metformin as the first-line glucose drug in pregnancy", "Glyburide as the first-line glucose drug in pregnancy", "Lisinopril, used here to bring the fasting glucose down", "Start insulin; lifestyle has not met the fasting goal", "Atorvastatin as the first-choice drug for the glucose"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "insulin-after-lifestyle-not-enough", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start insulin; lifestyle has not met the fasting goal$ky$,
  $ex$When lifestyle measures are not enough, insulin is first-line. The carbohydrate intake is 188 g per day, above the 175 g minimum, and fasting values of 109, 112, and 107 mg/dL are above the goal of under 95 mg/dL. Metformin and glyburide cross the placenta and are not first-line. "Metformin as the first-line glucose drug in pregnancy" is not the best choice because Metformin crosses the placenta and is not first-line when drug therapy is needed in pregnancy. "Glyburide as the first-line glucose drug in pregnancy" is not the best choice because Glyburide crosses the placenta and is not first-line when drug therapy is needed in pregnancy. "Lisinopril, used here to bring the fasting glucose down" is not the best choice because ACE inhibitors are stopped before conception. Lisinopril is not a glucose-lowering drug for this fasting pattern. "Atorvastatin as the first-choice drug for the glucose" is not the best choice because Statins are stopped before conception in most cases. Atorvastatin is not the glucose treatment when lifestyle has fallen short.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '651bbd3582c58b5802ec821435b9b74e8500dccc1098b504f0c3db3ff98a0d2c', false, NOW(), NOW(), 3,
  'insulin-after-lifestyle-not-enough', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'insulin-after-lifestyle-not-enough', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-039", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210040', 'usmle-step-2', 'obstetrics',
  $sc$A 29-year-old woman who works as a floral courier is seen in the birth-center follow-up desk 16 days after an uncomplicated vaginal birth. A glucose test in the late second trimester changed her meal plan. She is breastfeeding, walking the delivery route again, and feels well. Lochia is light. She asks to 'get the sugar test over with' before she returns to full shifts. Temperature is 36.8°C, pulse is 84/min, respirations are 16/min, and blood pressure is 112/70 mm Hg. Hemoglobin is 11.2 g/dL. A random capillary glucose before lunch is 102 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate timing for the postpartum glucose test?$qu$,
  $op${"options": ["Do the 75-g test today because 16 days is inside the window", "Use today's A1C instead, and skip the tolerance test forever", "Wait until 6 months, because 12 weeks is too soon", "The postpartum test is a 100-g load done on day 16", "Schedule the 75-g test between 4 and 12 weeks after birth"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "postpartum-test-before-4-weeks", "taskCategory": "health-maintenance"}$op$,
  $ky$Schedule the 75-g test between 4 and 12 weeks after birth$ky$,
  $ex$The postpartum test is a 75-g tolerance test at 4 to 12 weeks, read with nonpregnant criteria. Sixteen days is before that window, so today is too early. "Do the 75-g test today because 16 days is inside the window" is not the best choice because Sixteen days is about 2 weeks, which is earlier than the 4-week start of the testing window. "Use today's A1C instead, and skip the tolerance test forever" is not the best choice because A1C is not the postpartum test. Red-cell turnover and delivery blood loss lower A1C, and the specified test is the 75-g tolerance test. "Wait until 6 months, because 12 weeks is too soon" is not the best choice because The window closes at 12 weeks. Waiting until 6 months misses the 4-to-12-week test. "The postpartum test is a 100-g load done on day 16" is not the best choice because The postpartum test uses a 75-g load, not a 100-g load, and day 16 is before 4 weeks.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '1dac2ab53d61ca88c3542fe1fe550a7b0085f624fd54cc347fb6566668009b56', false, NOW(), NOW(), 3,
  'postpartum-test-before-4-weeks', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'postpartum-test-before-4-weeks', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-040", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210041', 'usmle-step-2', 'obstetrics',
  $sc$A 31-year-old woman who works as a museum registrar is seen in the postpartum endocrine clinic 9 weeks after birth, back from parental leave for a planned lab visit. She catalogued a crate of glass plates this morning and had nothing but water afterward. A late-pregnancy glucose test had led to a meal plan and insulin, which she stopped after delivery. She feels well and is not lightheaded. The infant is feeding without trouble. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Hemoglobin is 12.3 g/dL. No tolerance test has been drawn since the birth.$sc$,
  $qu$Which of the following is the most appropriate test today?$qu$,
  $op${"options": ["Perform a 75-g tolerance test and use nonpregnant cutoffs", "Repeat a 50-g screen and stop if the 1-hour value is under 140 mg/dL", "Order hemoglobin A1C and treat it as the postpartum decision test", "Postpone all glucose testing until the next pregnancy", "Use a 100-g, 3-hour test as the required postpartum study"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "postpartum-75g-inside-window", "taskCategory": "health-maintenance"}$op$,
  $ky$Perform a 75-g tolerance test and use nonpregnant cutoffs$ky$,
  $ex$At 4 to 12 weeks postpartum the test is a 75-g oral tolerance test interpreted with nonpregnant criteria. Nine weeks is inside that window. "Repeat a 50-g screen and stop if the 1-hour value is under 140 mg/dL" is not the best choice because The 50-g screen is an antepartum two-step tool. The postpartum test is a 75-g tolerance test. "Order hemoglobin A1C and treat it as the postpartum decision test" is not the best choice because A1C is not used for this postpartum classification. Increased red-cell turnover and blood loss at delivery lower the A1C. "Postpone all glucose testing until the next pregnancy" is not the best choice because Skipping the 4-to-12-week test misses the specified postpartum evaluation. "Use a 100-g, 3-hour test as the required postpartum study" is not the best choice because The postpartum study is a 75-g test, not the 100-g test used in the two-step antepartum strategy.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'b7090bc9c29242468f32d3fce183bb24950960186e82f1f7cd8eedbee5a9212e', false, NOW(), NOW(), 2,
  'postpartum-75g-inside-window', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'postpartum-75g-inside-window', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-041", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210042', 'usmle-step-2', 'obstetrics',
  $sc$A 36-year-old woman who works as a pottery kiln tech is seen in the hospital postpartum clinic 7 weeks after a birth complicated by hemorrhage. The delivery note records an estimated blood loss of 1400 mL, and she received a red-cell transfusion that night. She feels stronger now and is walking the kiln floor for short shifts. A late-pregnancy glucose test had changed her meals. She brings an outside A1C and hopes it means no further testing. Temperature is 36.7°C, pulse is 88/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. Hemoglobin is 8.9 g/dL. The outside hemoglobin A1C is 5.8%.$sc$,
  $qu$Which of the following is the most appropriate explanation?$qu$,
  $op${"options": ["An A1C of 5.8% clears her, so no tolerance test is needed", "The A1C cannot clear her; a 75-g test is the postpartum study", "A1C is preferred postpartum because transfusion raises accuracy", "Repeat the A1C next week and average it with the 5.8%", "Postpartum glucose testing is waived after any transfusion"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "postpartum-a1c-after-delivery-loss", "taskCategory": "communication"}$op$,
  $ky$The A1C cannot clear her; a 75-g test is the postpartum study$ky$,
  $ex$The postpartum test, done at 4 to 12 weeks, is a 75-g tolerance test using nonpregnant criteria. A1C is lowered by increased red-cell turnover and by delivery blood loss, so this 5.8% result is not the deciding test. Seven weeks is inside the 4-to-12-week window, and hemoglobin is 8.9 g/dL after a 1400 mL loss. "An A1C of 5.8% clears her, so no tolerance test is needed" is not the best choice because An A1C of 5.8% does not clear the postpartum evaluation. A1C is lowered by red-cell turnover and by blood loss at delivery. "A1C is preferred postpartum because transfusion raises accuracy" is not the best choice because Transfusion and recent blood loss make A1C less reliable, not more accurate. "Repeat the A1C next week and average it with the 5.8%" is not the best choice because Averaging A1C results does not overcome the problem. A1C is not the postpartum test. "Postpartum glucose testing is waived after any transfusion" is not the best choice because A transfusion does not cancel the 75-g test. It is one reason not to lean on the A1C.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "communication"]$tg$,
  's2-new-20261121-hidden', 'd95acd2887a582c52e30d6ceae671c61132ece3e5f3327e66d9a8c15f0a03f1d', false, NOW(), NOW(), 5,
  'postpartum-a1c-after-delivery-loss', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'communication', 'postpartum-a1c-after-delivery-loss', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-042", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210043', 'usmle-step-2', 'obstetrics',
  $sc$A 27-year-old woman who works as a score librarian is seen in the library postpartum lab 8 weeks after birth for a 75-g tolerance test. She fasted 10 hours after a late shift shelving bound volumes. She has no polyuria, no unusual thirst, and no unplanned weight loss, and she is not acutely ill. Insulin used in late pregnancy was stopped at discharge. The infant is gaining. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 114/72 mm Hg. Fasting plasma glucose is 93 mg/dL, and the 2-hour plasma glucose is 214 mg/dL. Hemoglobin is 12.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A 2-hour result of 214 mg/dL is in the 140 to 199 mg/dL span at this encounter", "The fasting result of 93 mg/dL cancels the 2-hour result", "The 2-hour value meets the 200 mg/dL line and needs confirmation", "This single 2-hour result is enough, even without symptoms", "Switch to an A1C now and discard the tolerance test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "postpartum-two-hour-214-needs-confirmation", "taskCategory": "diagnosis"}$op$,
  $ky$The 2-hour value meets the 200 mg/dL line and needs confirmation$ky$,
  $ex$Nonpregnant criteria, which this 4-to-12-week 75-g test uses, call a 2-hour glucose at or above 200 mg/dL abnormal. This result is 214 mg/dL. She has no classic symptoms and is not in crisis, so a second abnormal result is required before the diagnosis is final. The fasting value of 93 mg/dL is under 100 mg/dL. "A 2-hour result of 214 mg/dL is in the 140 to 199 mg/dL span at this encounter" is not the best choice because The 140 to 199 mg/dL span is the 2-hour prediabetes range. 214 mg/dL is at or above 200 mg/dL. "The fasting result of 93 mg/dL cancels the 2-hour result" is not the best choice because A fasting result under 100 mg/dL does not erase a 2-hour result at or above 200 mg/dL. Each threshold stands on its own. "This single 2-hour result is enough, even without symptoms" is not the best choice because Without unequivocal hyperglycemia, two abnormal results are required, either the same test twice or two different tests. There are no classic symptoms and no crisis here. "Switch to an A1C now and discard the tolerance test" is not the best choice because A1C is not the postpartum classification test. The 75-g tolerance test is.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '4fed3242c35d62cb3752eb344b3635ca29fcb166908a25448b7a26c8fa4e5bec', false, NOW(), NOW(), 3,
  'postpartum-two-hour-214-needs-confirmation', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'postpartum-two-hour-214-needs-confirmation', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-043", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210044', 'usmle-step-2', 'obstetrics',
  $sc$A 40-year-old woman who works as a textile designer is seen in the loom-district follow-up clinic 10 weeks after birth, fasting for a 75-g test. She fasted 11 hours and left the loom off this morning. Thirst is ordinary, urination is not increased, and her weight has been stable since the first postpartum week. She stopped mealtime insulin at discharge and feels well on the studio stairs. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. Fasting plasma glucose is 90 mg/dL and the 2-hour value is 181 mg/dL. Hemoglobin is 12.7 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation of the 2-hour result?$qu$,
  $op${"options": ["181 mg/dL meets the diabetes-range threshold of 200 mg/dL", "A 2-hour result under 153 mg/dL would be required to call this normal", "The fasting value of 90 mg/dL puts the whole test in the normal range", "181 mg/dL sits in the 140 to 199 mg/dL range, not at or above 200", "Postpartum 2-hour results are judged with the pregnancy goal of under 120"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "postpartum-two-hour-181-mid-range", "taskCategory": "diagnosis"}$op$,
  $ky$181 mg/dL sits in the 140 to 199 mg/dL range, not at or above 200$ky$,
  $ex$On a 75-g test read with nonpregnant criteria, a 2-hour glucose of 140 to 199 mg/dL is the prediabetes range, and 200 mg/dL or higher is the diabetes-range line. This 2-hour result is 181 mg/dL. The fasting result of 90 mg/dL is under 100 mg/dL. "181 mg/dL meets the diabetes-range threshold of 200 mg/dL" is not the best choice because 181 mg/dL is below 200 mg/dL, so it does not meet the 2-hour diabetes-range threshold. "A 2-hour result under 153 mg/dL would be required to call this normal" is not the best choice because 153 mg/dL is the one-step 2-hour diagnostic cutoff used at 24 to 28 weeks of pregnancy, not the nonpregnant normal limit. A 2-hour result under 140 mg/dL is below the prediabetes range. "The fasting value of 90 mg/dL puts the whole test in the normal range" is not the best choice because The fasting result is under 100 mg/dL, but the 2-hour result is not under 140 mg/dL. One normal value does not make the other normal. "Postpartum 2-hour results are judged with the pregnancy goal of under 120" is not the best choice because Under 120 mg/dL is a pregnancy treatment goal, not the cutoff used for the postpartum 75-g test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '749693a45ffc28d2d4259b0fcc0950ee1f462f419309a87550f0154beb7b428d', false, NOW(), NOW(), 3,
  'postpartum-two-hour-181-mid-range', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'postpartum-two-hour-181-mid-range', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-044", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210045', 'usmle-step-2', 'obstetrics',
  $sc$A 25-year-old woman who works as a postal carrier is seen in the neighborhood postpartum clinic 11 weeks after birth with a completed 75-g test. She fasted 9 hours before the route and feels well. A meal plan in late pregnancy was stopped after delivery, and she is back to walking a full mail loop. There is no excess thirst. She asks when, if ever, the test should be repeated. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Fasting plasma glucose is 84 mg/dL and the 2-hour plasma glucose is 118 mg/dL. Hemoglobin is 13.0 g/dL.$sc$,
  $qu$Which of the following is the most appropriate follow-up?$qu$,
  $op${"options": ["Repeat the 75-g test next week because one normal study never counts", "No further glucose testing is needed for the rest of her life", "Switch future screening to A1C every 6 months starting now", "The 2-hour result of 118 mg/dL is in the 140 to 199 mg/dL range", "Rescreen every 1 to 3 years after this normal 75-g test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "postpartum-normal-ogtt-rescreen-1-to-3-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Rescreen every 1 to 3 years after this normal 75-g test$ky$,
  $ex$Nonpregnant criteria put a normal fasting glucose under 100 mg/dL and a normal 2-hour glucose under 140 mg/dL. These results are 84 and 118 mg/dL. After a normal postpartum test, rescreen every 1 to 3 years. "Repeat the 75-g test next week because one normal study never counts" is not the best choice because A normal postpartum 75-g test is not repeated the next week. When the test is normal, rescreening is every 1 to 3 years. "No further glucose testing is needed for the rest of her life" is not the best choice because A normal result does not end future testing. The interval is every 1 to 3 years. "Switch future screening to A1C every 6 months starting now" is not the best choice because A1C is not the test used for the postpartum classification, and the stated plan after a normal test is rescreening every 1 to 3 years rather than an A1C every 6 months. "The 2-hour result of 118 mg/dL is in the 140 to 199 mg/dL range" is not the best choice because 118 mg/dL is under 140 mg/dL, so it is not in the 140 to 199 mg/dL range.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'd2197652ac7719e0d463696d93c5244975d89671578ea31d41a1c2e2ff17bcee', false, NOW(), NOW(), 2,
  'postpartum-normal-ogtt-rescreen-1-to-3-years', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'postpartum-normal-ogtt-rescreen-1-to-3-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-045", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210046', 'usmle-step-2', 'obstetrics',
  $sc$A 28-year-old woman who works as a violin maker is seen in the workshop obstetric clinic at 14 weeks of gestation, not yet taking aspirin. She has injected insulin before each meal since age 13, years before conception. Home glucose readings this week are in the 90s mg/dL, and she has had no shaking. A urine dipstick shows no protein. She has no headache and no visual change. The crown-rump length earlier matched the dates. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Hemoglobin is 12.5 g/dL. A first-trimester fasting plasma glucose was 88 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate preventive plan?$qu$,
  $op${"options": ["Start low-dose aspirin now, inside the 12-to-16-week window", "Start aspirin only if a protein dipstick later turns positive", "Wait until 28 weeks of gestation to discuss aspirin", "Avoid aspirin because insulin began before the pregnancy", "Begin the aspirin only when labor has started"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "aspirin-start-inside-12-to-16-weeks", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start low-dose aspirin now, inside the 12-to-16-week window$ky$,
  $ex$People with preexisting type 1 or type 2 diabetes are offered low-dose aspirin, 100 to 150 mg per day, starting at 12 to 16 weeks. Daily insulin since age 13, before this pregnancy, is that preexisting pattern, and 14 weeks is inside the window. A dose of 162 mg per day may be acceptable. "Start aspirin only if a protein dipstick later turns positive" is not the best choice because The aspirin recommendation is not held until protein appears. For preexisting disease treated here with insulin since childhood, low-dose aspirin is started at 12 to 16 weeks to lower preeclampsia risk. "Wait until 28 weeks of gestation to discuss aspirin" is not the best choice because 28 weeks is later than the 12-to-16-week start. She is already at 14 weeks. "Avoid aspirin because insulin began before the pregnancy" is not the best choice because Insulin that began years before pregnancy is a reason to use the aspirin plan, not a reason to avoid it. "Begin the aspirin only when labor has started" is not the best choice because The start is at 12 to 16 weeks, not during labor.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '650b7a45daa08febd4d4c9b6e0959ca098de7b2e0e68d30c401a3dc00b48b3ee', false, NOW(), NOW(), 3,
  'aspirin-start-inside-12-to-16-weeks', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'aspirin-start-inside-12-to-16-weeks', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-046", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210047', 'usmle-step-2', 'obstetrics',
  $sc$A 33-year-old woman who works as a bridge inspector is seen in the river-span prenatal clinic at 9 weeks of gestation asking to start aspirin today. Metformin and bedtime insulin were begun 11 years before conception for hyperglycemia, and both are still in use. She read a pamphlet in the waiting room and wants the first tablet before she leaves. Dating ultrasound agrees with 9 weeks. She has no headache. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. Urine protein is negative. Hemoglobin A1C last month, before pregnancy care, was 6.3%. A urine pregnancy test is positive.$sc$,
  $qu$Which of the following is the most appropriate aspirin plan?$qu$,
  $op${"options": ["Give the first dose before she leaves today", "Plan the start for 12 to 16 weeks, not for this visit", "The start window has already closed at 9 weeks", "Aspirin belongs only at the 6-week postpartum visit", "Start aspirin only if today's blood pressure reaches 140/90"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "aspirin-too-early-at-9-weeks", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Plan the start for 12 to 16 weeks, not for this visit$ky$,
  $ex$Low-dose aspirin, 100 to 150 mg per day, is started at 12 to 16 weeks for people with preexisting type 1 or type 2 diabetes. Metformin plus insulin for 11 years before conception fits that preexisting pattern. At 9 weeks the start is planned, not given today. A dose of 162 mg per day may be acceptable. "Give the first dose before she leaves today" is not the best choice because 9 weeks is earlier than the 12-to-16-week start. Today's visit is not the time for the first dose. "The start window has already closed at 9 weeks" is not the best choice because The window has not closed. It opens at 12 weeks, and she is at 9 weeks. "Aspirin belongs only at the 6-week postpartum visit" is not the best choice because The recommendation is an antepartum start at 12 to 16 weeks, not a postpartum prescription. "Start aspirin only if today's blood pressure reaches 140/90" is not the best choice because The aspirin timing is 12 to 16 weeks. It is not tied to a blood pressure of 140/90 mm Hg, which is the threshold for treating chronic hypertension in pregnancy.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '06a1e4cbd1a3a4c5e14c5355f8b3ff078b0376c226f6c7fa655d9aaed14a546c', false, NOW(), NOW(), 2,
  'aspirin-too-early-at-9-weeks', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'aspirin-too-early-at-9-weeks', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-047", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210048', 'usmle-step-2', 'obstetrics',
  $sc$A 24-year-old woman who works as a puppet builder is seen in the theater-district obstetric office at 13 weeks of gestation, ready to start preventive aspirin. A childhood hospitalization for ketoacidosis was followed by insulin at every meal, and that pattern never stopped. She is inside the agreed start window and asks which daily amount matches the recommendation. A urine dipstick shows no protein. She has had no visual symptoms. Temperature is 36.6°C, pulse is 82/min, respirations are 15/min, and blood pressure is 112/68 mm Hg. Hemoglobin is 12.8 g/dL. Fasting plasma glucose this week was 91 mg/dL.$sc$,
  $qu$Which of the following matches the recommended daily amount?$qu$,
  $op${"options": ["81 mg daily is the only dose the text names as the target", "325 mg daily, started at the first positive pregnancy test", "100 to 150 mg daily, and 162 mg daily may be acceptable", "162 mg daily is described as unacceptable", "Delay every dose until 28 weeks of gestation"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "aspirin-dose-100-to-150", "taskCategory": "pharmacotherapy"}$op$,
  $ky$100 to 150 mg daily, and 162 mg daily may be acceptable$ky$,
  $ex$For preexisting type 1 or type 2 diabetes, low-dose aspirin is 100 to 150 mg per day, started at 12 to 16 weeks. A dose of 162 mg per day may be acceptable, and US tablets are 81 mg. Insulin since a childhood ketoacidosis episode, still in use at 13 weeks, is the preexisting pattern. "81 mg daily is the only dose the text names as the target" is not the best choice because US tablets are 81 mg, which is the tablet strength. The named daily dose is 100 to 150 mg, and 162 mg per day may be acceptable. "325 mg daily, started at the first positive pregnancy test" is not the best choice because 325 mg is not the stated dose, and the start is at 12 to 16 weeks rather than on the day a pregnancy test turns positive. "162 mg daily is described as unacceptable" is not the best choice because 162 mg per day may be acceptable. It is not described as unacceptable. "Delay every dose until 28 weeks of gestation" is not the best choice because 28 weeks is outside the 12-to-16-week start. She is at 13 weeks, which is inside that window.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'fc5701ce58c7e2fa137c9ba211f95240bb955949cd9ec315dcca00ac26288347', false, NOW(), NOW(), 4,
  'aspirin-dose-100-to-150', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'aspirin-dose-100-to-150', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-048", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210049', 'usmle-step-2', 'obstetrics',
  $sc$A 37-year-old woman who works as a locksmith is seen in the hardware-row obstetric clinic at 22 weeks of gestation, not yet on a blood-pressure drug. Insulin has been part of her mornings and evenings for eight years before this pregnancy. Office readings were high for four years before conception, and she stopped an old prescription on her own. She has no headache, no spots in her vision, and no right-upper pain. Fetal movement is present. Temperature is 36.6°C, pulse is 86/min, respirations are 16/min, and blood pressure is 146/94 mm Hg. A urine dipstick shows no protein. Creatinine is 0.6 mg/dL. Fasting plasma glucose is 92 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate blood-pressure plan?$qu$,
  $op${"options": ["Treat only if the reading reaches the nonpregnant goal of 130/80", "Withhold treatment in pregnancy unless the reading is under 90/60 before the patient leaves", "The suggested goal of 110-135/85 means this reading needs no drug", "Start or titrate treatment at the pregnancy threshold of 140/90 mm Hg", "Deintensify therapy because 146/94 is below 140/90"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "bp-146-treat-at-140-90", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start or titrate treatment at the pregnancy threshold of 140/90 mm Hg$ky$,
  $ex$In pregnant people with diabetes and chronic hypertension, treatment is started or titrated at 140/90 mm Hg, not at the nonpregnant goal of 130/80. This reading is 146/94 mm Hg. A suggested goal is 110-135/85 mm Hg, and treatment is deintensified if the reading is under 90/60. "Treat only if the reading reaches the nonpregnant goal of 130/80" is not the best choice because 130/80 mm Hg is the nonpregnant goal and is not the threshold used here. 146/94 already meets the pregnancy threshold of 140/90. "Withhold treatment in pregnancy unless the reading is under 90/60 before the patient leaves" is not the best choice because Under 90/60 mm Hg is the point for deintensifying treatment, not the point for starting it. "The suggested goal of 110-135/85 means this reading needs no drug" is not the best choice because 146/94 mm Hg is outside 110-135/85 mm Hg. The reading also meets the 140/90 threshold for starting or titrating treatment. "Deintensify therapy because 146/94 is below 140/90" is not the best choice because 146/94 is above 140/90, not below it. Deintensifying applies when the reading is under 90/60.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '1dc1b96dbaea69a93d87e025ac27d748086a59219208fb83fd4e5a0ccd7c3ec0', false, NOW(), NOW(), 3,
  'bp-146-treat-at-140-90', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'bp-146-treat-at-140-90', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-049", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210050', 'usmle-step-2', 'obstetrics',
  $sc$A 29-year-old woman who works as a welder is seen in the shipyard obstetric office at 26 weeks of gestation while taking labetalol. Bedtime insulin and a morning injection began six years before conception. Labetalol was started two years before pregnancy for repeatedly high cuffs. She has no headache and no visual change between welding passes. A coworker suggested raising the dose to chase a nonpregnant target. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 134/82 mm Hg. Urine protein is negative. Creatinine is 0.7 mg/dL. A fasting capillary glucose is 90 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Raise the dose because 134/82 misses the nonpregnant goal of 130/80", "134/82 is under 90/60, so the dose should be reduced today", "Stop labetalol because any treated reading in pregnancy is too low", "Switch the goal to under 120/70 for the rest of the pregnancy", "Do not intensify; the pregnancy threshold is 140/90, not 130/80"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "bp-134-do-not-use-130-80", "taskCategory": "interpretation"}$op$,
  $ky$Do not intensify; the pregnancy threshold is 140/90, not 130/80$ky$,
  $ex$Treatment in pregnant people with diabetes and chronic hypertension is started or titrated at 140/90 mm Hg, not at 130/80. This reading is 134/82, which is below 140/90. It also sits in the suggested range of 110-135/85 mm Hg. Deintensifying is for readings under 90/60. "Raise the dose because 134/82 misses the nonpregnant goal of 130/80" is not the best choice because 130/80 mm Hg is the nonpregnant goal and is not the pregnancy threshold. Systolic 134 is above 130, but that is not the rule used here. "134/82 is under 90/60, so the dose should be reduced today" is not the best choice because 134/82 is not under 90/60. The deintensify threshold has not been met. "Stop labetalol because any treated reading in pregnancy is too low" is not the best choice because A reading inside the suggested 110-135/85 range is not a reason to stop treatment entirely. "Switch the goal to under 120/70 for the rest of the pregnancy" is not the best choice because No pregnancy goal of under 120/70 is stated. The suggested range is 110-135/85 mm Hg, and the start-or-titrate threshold is 140/90.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '77c4802bbd7e7c5b20debe847c40c1cd5d45abac4e18c5d776653b37a57afdf5', false, NOW(), NOW(), 4,
  'bp-134-do-not-use-130-80', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bp-134-do-not-use-130-80', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-050", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210051', 'usmle-step-2', 'obstetrics',
  $sc$A 32-year-old woman who works as a sommelier is seen in the cellar obstetric clinic at 24 weeks of gestation after feeling lightheaded on the cellar stairs. She has used insulin since her twenties, before this pregnancy, and labetalol was increased last month. She is speaking clearly, has no vaginal bleeding, and has no headache. A colleague wants the dose pushed higher because an old pocket card lists 130/80. Temperature is 36.6°C, pulse is 96/min, respirations are 16/min, and blood pressure is 86/54 mm Hg. Creatinine is 0.5 mg/dL. Urine protein is negative. Fasting plasma glucose this morning was 88 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate blood-pressure action?$qu$,
  $op${"options": ["Deintensify treatment because the reading is under 90/60 mm Hg", "Increase labetalol toward a 130/80 mm Hg goal", "Make no change because 86/54 matches the 110-135/85 range during today's visit", "Hold changes unless the reading falls under 80/50 mm Hg", "Add lisinopril to reach the nonpregnant goal faster"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "bp-86-deintensify-under-90-60", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Deintensify treatment because the reading is under 90/60 mm Hg$ky$,
  $ex$In pregnant people with diabetes and chronic hypertension, deintensify treatment if blood pressure is under 90/60 mm Hg. This reading is 86/54. The start-or-titrate threshold is 140/90, and a suggested goal is 110-135/85. ACE inhibitors are not added in pregnancy. "Increase labetalol toward a 130/80 mm Hg goal" is not the best choice because 130/80 mm Hg is not the pregnancy target. This reading is already under 90/60, which is the point for easing treatment, not increasing it. "Make no change because 86/54 matches the 110-135/85 range during today's visit" is not the best choice because 86/54 mm Hg is not inside 110-135/85 mm Hg. Systolic 86 is below 110, and diastolic 54 is far below 85. "Hold changes unless the reading falls under 80/50 mm Hg" is not the best choice because The stated point for deintensifying is under 90/60 mm Hg, not under 80/50. "Add lisinopril to reach the nonpregnant goal faster" is not the best choice because ACE inhibitors are stopped before conception and are not a way to chase 130/80 in pregnancy. The needed move is to ease the current treatment.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '83a5aedf1b0b7b3afa20d82f02d0e8a5d86f4f367775fbb7998e8c277811f70c', false, NOW(), NOW(), 5,
  'bp-86-deintensify-under-90-60', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'bp-86-deintensify-under-90-60', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-051", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210052', 'usmle-step-2', 'obstetrics',
  $sc$A 36-year-old woman who works as a geologist is seen in the core-lab preconception clinic planning a pregnancy and still taking lisinopril. The tablet was started for high readings three years ago. She also uses metformin for hyperglycemia and wants to conceive in the next half year. Contraception is in place this month. She has no cough and no ankle swelling. A partner will be in the field with her. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. A urine pregnancy test is negative. Creatinine is 0.8 mg/dL and potassium is 4.2 mEq/L. Hemoglobin A1C is 6.8%.$sc$,
  $qu$Which of the following is the most appropriate medication plan?$qu$,
  $op${"options": ["Continue lisinopril until a pregnancy test turns positive", "Stop the ACE inhibitor before a planned conception", "Replace lisinopril with losartan before conception", "Add spironolactone and continue the current lisinopril", "Start atorvastatin and leave the blood-pressure drug as it is"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "stop-lisinopril-before-conception", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Stop the ACE inhibitor before a planned conception$ky$,
  $ex$ACE inhibitors are stopped before conception. She is 36, the pregnancy test is negative, and conception is being planned. A separate preconception target is an A1C under 6.5% if safely achievable; her A1C is 6.8%, and that figure does not keep lisinopril in place. Angiotensin-receptor blockers and mineralocorticoid antagonists are stopped too, and statins are stopped in most cases. "Continue lisinopril until a pregnancy test turns positive" is not the best choice because The stop is before conception, not after a test turns positive. "Replace lisinopril with losartan before conception" is not the best choice because Losartan is an angiotensin-receptor blocker. Those drugs are stopped before conception as well, so a switch to losartan does not solve the problem. "Add spironolactone and continue the current lisinopril" is not the best choice because Mineralocorticoid antagonists are also stopped before conception. Adding spironolactone is the wrong direction. "Start atorvastatin and leave the blood-pressure drug as it is" is not the best choice because Statins are stopped before conception in most cases. Starting atorvastatin does not address the ACE inhibitor.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'ec31d6f9b62a9cc4ddb346a5d125e4bf880593281703620c0f735c640de9faf4', false, NOW(), NOW(), 2,
  'stop-lisinopril-before-conception', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'stop-lisinopril-before-conception', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-052", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210053', 'usmle-step-2', 'obstetrics',
  $sc$A 30-year-old woman who works as a mural painter is seen in the studio preconception visit hoping to conceive next spring and still taking losartan. A kidney clinic started losartan after protein showed up on two morning samples. She checks glucose at home because metformin was added four years ago, and the lowest recent reading was 96 mg/dL. Paint solvents are ventilated. She is using a contraceptive patch. Temperature is 36.5°C, pulse is 76/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. A urine pregnancy test is negative. Creatinine is 1.1 mg/dL and the urine albumin-to-creatinine ratio is 180 mg/g. Hemoglobin A1C is 6.6%.$sc$,
  $qu$Which of the following is the most appropriate change before conception?$qu$,
  $op${"options": ["Keep losartan until the second trimester, then stop", "Switch losartan to lisinopril, which is preferred before conception", "Stop the angiotensin-receptor blocker before conception", "Add spironolactone for the albumin finding and continue losartan", "Increase losartan until the home readings fall under 120 mm Hg"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "stop-losartan-before-conception", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Stop the angiotensin-receptor blocker before conception$ky$,
  $ex$Angiotensin-receptor blockers are stopped before conception. Losartan is in that class, and she is 30. ACE inhibitors and mineralocorticoid antagonists are stopped as well. Her A1C is 6.6%; the separate preconception A1C goal is under 6.5% if safely achievable, and that goal does not keep losartan going. "Keep losartan until the second trimester, then stop" is not the best choice because The stop happens before conception, not after the second trimester begins. "Switch losartan to lisinopril, which is preferred before conception" is not the best choice because Lisinopril is an ACE inhibitor. ACE inhibitors are stopped before conception, so the switch does not help. "Add spironolactone for the albumin finding and continue losartan" is not the best choice because Mineralocorticoid antagonists are stopped before conception. Spironolactone is not the substitute. "Increase losartan until the home readings fall under 120 mm Hg" is not the best choice because No preconception blood-pressure rule in this guidance says to push readings under 120 mm Hg by raising an angiotensin-receptor blocker. The drug class is stopped before conception.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '09cb8bc7dbeb32d4a5a0c49ea4e9ad22f010ca50b869e6c362a6dbdd34802cf3', false, NOW(), NOW(), 3,
  'stop-losartan-before-conception', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'stop-losartan-before-conception', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-053", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210054', 'usmle-step-2', 'obstetrics',
  $sc$A 34-year-old woman who works as a bassoonist is seen in the orchestra preconception clinic between rehearsals, planning a pregnancy while taking spironolactone. A hypertension clinic added spironolactone after two other drugs left office readings high. She also takes metformin, begun for hyperglycemia five years ago. Tour dates are booked through the summer, and she wants contraception stopped in the fall. She has had no fainting. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 132/80 mm Hg. A urine pregnancy test is negative. Potassium is 4.4 mEq/L and creatinine is 0.8 mg/dL. Hemoglobin A1C is 6.4%.$sc$,
  $qu$Which of the following is the most appropriate plan for the spironolactone?$qu$,
  $op${"options": ["Continue spironolactone through the first trimester as a routine", "Replace it with losartan before trying to conceive", "Replace it with lisinopril, then conceive next month", "Stop the mineralocorticoid antagonist before conception", "Double the dose so potassium stays above 4 mEq/L"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "stop-spironolactone-before-conception", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Stop the mineralocorticoid antagonist before conception$ky$,
  $ex$Mineralocorticoid antagonists are stopped before conception. Spironolactone is in that class. She is 34, and the drug is stopped even though the A1C is 6.4%, which is under the separate preconception goal of 6.5%. ACE inhibitors and angiotensin-receptor blockers are stopped as well. "Continue spironolactone through the first trimester as a routine" is not the best choice because Continuing through the first trimester is later than the instruction, which is to stop before conception. "Replace it with losartan before trying to conceive" is not the best choice because Losartan is an angiotensin-receptor blocker and is also stopped before conception. "Replace it with lisinopril, then conceive next month" is not the best choice because Lisinopril is an ACE inhibitor and is also stopped before conception. "Double the dose so potassium stays above 4 mEq/L" is not the best choice because Raising the dose is not the preconception plan, and no potassium cutoff in this guidance calls for a higher mineralocorticoid-antagonist dose. The drug is stopped before conception.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'd9db40b50a7f97ab6f30c809a9bdf58a78473a4435dd026512b2aa308f3a3223', false, NOW(), NOW(), 3,
  'stop-spironolactone-before-conception', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'stop-spironolactone-before-conception', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-054", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210055', 'usmle-step-2', 'obstetrics',
  $sc$A 41-year-old woman who works as a charter captain is seen in the marina preconception office booking a pregnancy attempt and still taking atorvastatin. A stent was placed in a coronary artery four years ago, and the statin dates from that admission. Metformin was started the same year for hyperglycemia. She uses contraception and wants it removed after the boat's winter haul-out. There is no chest pain on the dock. Temperature is 36.7°C, pulse is 68/min, respirations are 14/min, and blood pressure is 126/78 mm Hg. A urine pregnancy test is negative. LDL cholesterol is 96 mg/dL. Hemoglobin A1C is 6.9%.$sc$,
  $qu$Which of the following is the most appropriate statin plan?$qu$,
  $op${"options": ["Continue atorvastatin through conception as a routine", "Stop the statin only after a positive pregnancy test", "Replace atorvastatin with lisinopril before conception", "Increase the statin until the LDL cholesterol is under 50 mg/dL", "Stop the statin before conception in most cases"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "stop-statin-before-conception", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Stop the statin before conception in most cases$ky$,
  $ex$In most cases, statins are stopped before conception. She is 41 and takes atorvastatin, and the pregnancy test is negative. The separate preconception A1C goal is under 6.5% if safely achievable; her A1C is 6.9%. Neither that gap nor the LDL cholesterol of 96 mg/dL is a reason to continue the statin into conception. "Continue atorvastatin through conception as a routine" is not the best choice because Routine continuation through conception conflicts with the instruction to stop statins before conception in most cases. "Stop the statin only after a positive pregnancy test" is not the best choice because Waiting for a positive test is later than stopping before conception. "Replace atorvastatin with lisinopril before conception" is not the best choice because Lisinopril is an ACE inhibitor, which is stopped before conception. It is not a substitute that should be started in the statin's place. "Increase the statin until the LDL cholesterol is under 50 mg/dL" is not the best choice because No LDL target of 50 mg/dL is part of this preconception instruction. The statin action in most cases is to stop the drug before conception, not to intensify it.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '31748d6d0e335981a95da6ef40c1b6bc34598bc6f4c6a9c36083609215838cec', false, NOW(), NOW(), 4,
  'stop-statin-before-conception', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'stop-statin-before-conception', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-055", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210056', 'usmle-step-2', 'obstetrics',
  $sc$A 27-year-old woman who works as a farrier is seen in the stable obstetric clinic at 17 weeks of gestation and still taking metformin. The metformin was prescribed so that ovulation would occur after eight years of irregular cycles. It was not prescribed for glucose lowering, and she has never used insulin. Cycles resumed, conception followed, and nobody stopped the tablets. She shoes horses three days a week and feels well. Fetal heart rate is 152/min. Temperature is 36.6°C, pulse is 80/min, respirations are 15/min, and blood pressure is 114/70 mm Hg. Fasting plasma glucose is 84 mg/dL. Hemoglobin A1C is 5.3%. Hemoglobin is 12.2 g/dL.$sc$,
  $qu$Which of the following is the most appropriate metformin plan?$qu$,
  $op${"options": ["Stop it now; the first-trimester deadline has passed", "Continue the ovulation metformin until delivery", "Stop it only if the eGFR falls under 30 mL/min/1.73 m2", "Switch it to glyburide for the rest of the pregnancy", "Raise the dose because the fasting glucose is under 95 mg/dL"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "stop-ovulation-metformin-after-first-trimester", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Stop it now; the first-trimester deadline has passed$ky$,
  $ex$Metformin used for polycystic ovary syndrome to induce ovulation should be stopped by the end of the first trimester. She is at 17 weeks, past that point, and the tablets are still in use. The fasting glucose is 84 mg/dL. "Continue the ovulation metformin until delivery" is not the best choice because Metformin used to induce ovulation is not continued until delivery. It should be stopped by the end of the first trimester. "Stop it only if the eGFR falls under 30 mL/min/1.73 m2" is not the best choice because The eGFR limit of 30 mL/min/1.73 m2 is a nonpregnant metformin rule. This stop is timed to the end of the first trimester because the drug was used to induce ovulation. "Switch it to glyburide for the rest of the pregnancy" is not the best choice because Glyburide crosses the placenta and is not first-line glucose therapy. This metformin was for ovulation, not a failed lifestyle trial for glucose. "Raise the dose because the fasting glucose is under 95 mg/dL" is not the best choice because A fasting glucose under 95 mg/dL meets the pregnancy fasting goal. It is not a reason to increase a drug that should already have been stopped.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '9e45446753bdffc10b5662223756920fe729fc7e36845b275ceaa5c9493c9f4d', false, NOW(), NOW(), 4,
  'stop-ovulation-metformin-after-first-trimester', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 15: Management of Diabetes in Pregnancy.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'stop-ovulation-metformin-after-first-trimester', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-056", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S306/157565/15-Management-of-Diabetes-in-Pregnancy", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210057', 'usmle-step-2', 'obstetrics',
  $sc$A 33-year-old woman who works as a hotel concierge is seen in the lobby-district obstetric office at 31 weeks of gestation relieved by a low A1C on the portal. A meal plan and insulin have been in place since a glucose test at 26 weeks. She works the evening desk and has had no sweating or confusion. The portal message says the A1C looks comforting. Fundal height is 31 cm. Temperature is 36.7°C, pulse is 84/min, respirations are 15/min, and blood pressure is 118/74 mm Hg. Hemoglobin A1C is 5.4%. Fasting plasma glucose this morning is 112 mg/dL. Hemoglobin is 11.5 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["An A1C of 5.4% shows that the fasting goal has been met", "Use the plasma glucose; A1C is unreliable in this trimester", "A1C is the best third-trimester test because red-cell turnover slows", "The pregnancy A1C goal is under 5%, so only 5.4% matters", "A fasting result of 112 mg/dL is under the pregnancy goal of 95 mg/dL"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "third-trimester-a1c-do-not-override-glucose", "taskCategory": "interpretation"}$op$,
  $ky$Use the plasma glucose; A1C is unreliable in this trimester$ky$,
  $ex$A1C is unreliable in the second and third trimesters and postpartum, so plasma glucose is used instead. This fasting plasma glucose is 112 mg/dL, above the pregnancy fasting goal of under 95 mg/dL. The A1C of 5.4% does not override that glucose. "An A1C of 5.4% shows that the fasting goal has been met" is not the best choice because A1C does not prove the fasting goal. The fasting plasma glucose is 112 mg/dL, and the pregnancy fasting goal is under 95 mg/dL. "A1C is the best third-trimester test because red-cell turnover slows" is not the best choice because Red-cell turnover is increased in pregnancy, which is one reason A1C is unreliable in the second and third trimesters and postpartum. Turnover does not slow in a way that makes A1C the preferred test. "The pregnancy A1C goal is under 5%, so only 5.4% matters" is not the best choice because No pregnancy A1C goal of under 5% is stated. Without significant hypoglycemia the A1C goal is under 6%, and A1C is still a poor standalone test in the third trimester. "A fasting result of 112 mg/dL is under the pregnancy goal of 95 mg/dL" is not the best choice because 112 mg/dL is above, not under, the fasting goal of 95 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '7242e460b33a71ffe45ceae5b3f528e92a095949d8cc1085b18ae744b5103293', false, NOW(), NOW(), 4,
  'third-trimester-a1c-do-not-override-glucose', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'third-trimester-a1c-do-not-override-glucose', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-057", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210058', 'usmle-step-2', 'obstetrics',
  $sc$A 32-year-old woman who works as a hotel night auditor is seen in the intake prenatal clinic at 9 weeks of gestation for the first obstetric visit. She has had one partner for three years, and that partner has no known sexually transmitted infection. A dating scan matches 9 weeks. She feels well, has no pelvic pain, and has not yet had a genital swab in this pregnancy. She asks whether age over 25 means the swab can wait. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Hemoglobin is 12.6 g/dL. A urine pregnancy test is positive. No nucleic acid test for Chlamydia trachomatis has been collected.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Skip testing because she is older than 25 and has one partner", "Wait for the third trimester, when every pregnant person is tested once", "Obtain a chlamydia NAAT at this first prenatal visit", "Order cervical cytology instead of a chlamydia test", "Test only if a later urine dipstick shows leukocyte esterase"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "chlamydia-test-first-prenatal-visit", "taskCategory": "health-maintenance"}$op$,
  $ky$Obtain a chlamydia NAAT at this first prenatal visit$ky$,
  $ex$Chlamydia screening in pregnancy is done at the first prenatal visit. A repeat in the third trimester is for age under 25 or increased risk, such as a new partner, more than one partner, or a partner with a sexually transmitted infection. She is 32, but this is the first visit, and no test has been done. "Skip testing because she is older than 25 and has one partner" is not the best choice because Age over 25 and a single partner change whether a third-trimester repeat is needed. They do not cancel the test at the first prenatal visit. "Wait for the third trimester, when every pregnant person is tested once" is not the best choice because The first test is at the first prenatal visit. A third-trimester repeat is added for age under 25 or increased risk, not as a substitute for the first test. "Order cervical cytology instead of a chlamydia test" is not the best choice because Cervical cytology does not replace a chlamydia nucleic acid test. "Test only if a later urine dipstick shows leukocyte esterase" is not the best choice because Screening at the first prenatal visit is not held for leukocyte esterase.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '0d43a3a509741bd029718a9a8f94cafd4fb7249d480dd58f4f4a2da0ddd7a871', false, NOW(), NOW(), 2,
  'chlamydia-test-first-prenatal-visit', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'chlamydia-test-first-prenatal-visit', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-058", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210059', 'usmle-step-2', 'obstetrics',
  $sc$A 23-year-old woman who works as a veterinary technician is seen in the campus prenatal clinic at 30 weeks of gestation with a negative early test. At 10 weeks, a nucleic acid test did not detect Chlamydia trachomatis. She has the same partner as in the first trimester, and that partner has not been told of an infection. She has no discharge and no pelvic pain. Classes end at noon, and she came from the kennel lab. Temperature is 36.7°C, pulse is 82/min, respirations are 15/min, and blood pressure is 112/70 mm Hg. Hemoglobin is 11.6 g/dL. A urine dipstick shows no leukocyte esterase. The early chlamydia NAAT result is negative.$sc$,
  $qu$Which of the following is the most appropriate third-trimester plan?$qu$,
  $op${"options": ["No repeat is needed, because the 10-week test was negative", "Repeat only if she names a new partner", "Replace the NAAT with cervical cytology this trimester", "Repeat the chlamydia NAAT because she is younger than 25", "Treat with doxycycline now despite the negative test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "chlamydia-repeat-third-trimester-under-25", "taskCategory": "health-maintenance"}$op$,
  $ky$Repeat the chlamydia NAAT because she is younger than 25$ky$,
  $ex$A chlamydia test is done at the first prenatal visit and again in the third trimester when age is under 25, even without a new partner. She is 23, the early NAAT was negative, and she is at 30 weeks. "No repeat is needed, because the 10-week test was negative" is not the best choice because A negative first-visit test does not end screening when age is under 25. The third trimester is a second testing time. "Repeat only if she names a new partner" is not the best choice because A new partner is one increased-risk reason for a repeat. Age under 25 is its own reason, and she already meets it. "Replace the NAAT with cervical cytology this trimester" is not the best choice because Cytology does not replace a third-trimester chlamydia NAAT. "Treat with doxycycline now despite the negative test" is not the best choice because Doxycycline is contraindicated in the second and third trimesters, and a negative NAAT is not a reason to treat.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c15257fbc4c0768934e7361330009c50483866f892d30d330f9ecd4d33be66da', false, NOW(), NOW(), 2,
  'chlamydia-repeat-third-trimester-under-25', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'chlamydia-repeat-third-trimester-under-25', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-059", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210060', 'usmle-step-2', 'obstetrics',
  $sc$A 38-year-old woman who works as a film projectionist is seen in the cinema prenatal office at 31 weeks of gestation after starting a new relationship. The new partner began six weeks ago. A nucleic acid test at 11 weeks did not detect Chlamydia trachomatis, and she has no discharge. She is older than 25 and wonders if that age cancels another swab. The booth shift ended an hour ago. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Hemoglobin is 12.1 g/dL. The 11-week chlamydia NAAT was negative. A urine dipstick shows no protein.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Skip a repeat because she is older than 25", "Repeat testing is only for people younger than 21", "A negative test at 11 weeks covers the rest of pregnancy", "Treat now with doxycycline because the partner is new", "Repeat the chlamydia NAAT because of the new partner"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "chlamydia-repeat-third-trimester-new-partner", "taskCategory": "health-maintenance"}$op$,
  $ky$Repeat the chlamydia NAAT because of the new partner$ky$,
  $ex$Third-trimester chlamydia testing is repeated when age is under 25 or risk is increased. A new partner is an increased-risk reason. She is 38, with a negative NAAT at 11 weeks and a new partner for six weeks, at 31 weeks of gestation. "Skip a repeat because she is older than 25" is not the best choice because Age of 25 or older removes the age-based reason for a third-trimester repeat. It does not remove the repeat when risk is increased. "Repeat testing is only for people younger than 21" is not the best choice because The age cutoff in this prenatal rule is under 25, not under 21. Increased risk is a separate reason at older ages. "A negative test at 11 weeks covers the rest of pregnancy" is not the best choice because A negative first-visit test does not cover a later increase in risk. The third-trimester repeat is for that situation. "Treat now with doxycycline because the partner is new" is not the best choice because Doxycycline is contraindicated in the third trimester, and a new partner is a reason to test, not a reason to treat before a result.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '6b5e4bdc8e8ab2cf266cf3e008f6c21c4381830eb7a238be15bc5d6266d4668e', false, NOW(), NOW(), 3,
  'chlamydia-repeat-third-trimester-new-partner', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'chlamydia-repeat-third-trimester-new-partner', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-060", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210061', 'usmle-step-2', 'obstetrics',
  $sc$A 35-year-old woman who works as a data analyst is seen in the midtown obstetric clinic at 33 weeks of gestation asking if another swab is automatic. A nucleic acid test at 12 weeks did not detect Chlamydia trachomatis. She has had one partner for eight years, and that partner has no known sexually transmitted infection. She has not had a new partner. There is no discharge and no pelvic pain. The fundal height is 33 cm. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Hemoglobin is 11.9 g/dL. The first-visit chlamydia NAAT was negative. A urine dipstick shows no leukocyte esterase.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["A third-trimester NAAT is not indicated by her age or these risks", "Repeat the NAAT because every pregnancy needs a third-trimester test", "Repeat the NAAT because she is older than 30 years", "Treat with azithromycin now so a repeat swab can be skipped", "Replace the NAAT with doxycycline prophylaxis until delivery"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "chlamydia-no-third-trimester-if-low-risk", "taskCategory": "health-maintenance"}$op$,
  $ky$A third-trimester NAAT is not indicated by her age or these risks$ky$,
  $ex$Repeat testing in the third trimester is for age under 25 or increased risk, including a new partner, more than one partner, or a partner with a sexually transmitted infection. She is 35, the 12-week NAAT was negative, and none of those risk factors are described. "Repeat the NAAT because every pregnancy needs a third-trimester test" is not the best choice because A third-trimester repeat is for age under 25 or increased risk. It is not automatic for every pregnancy after a negative first test. "Repeat the NAAT because she is older than 30 years" is not the best choice because Being older than 30 is not a reason to repeat the test. The age reason is age under 25. "Treat with azithromycin now so a repeat swab can be skipped" is not the best choice because Azithromycin 1 g orally once is treatment when the test shows the organism, not prophylaxis to avoid a swab that is not indicated. "Replace the NAAT with doxycycline prophylaxis until delivery" is not the best choice because Doxycycline is contraindicated in the third trimester and is not prophylaxis in this situation.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'e2271f8985ab85588a9cd982386ef7ef98fc68b6189fd0a03c53c42153f0d328', false, NOW(), NOW(), 3,
  'chlamydia-no-third-trimester-if-low-risk', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'chlamydia-no-third-trimester-if-low-risk', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-061", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210062', 'usmle-step-2', 'obstetrics',
  $sc$A 26-year-old woman who works as a hairdresser is seen in the salon-district obstetric office at 20 weeks of gestation with a new laboratory report. She has had mild vaginal irritation but no fever and no pelvic pain that stops her from standing at the chair. Penicillin as a child caused a rash. She is not in labor. The fundal height matches the dates, and fetal movement is present. Temperature is 36.8°C, pulse is 88/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. An endocervical NAAT is positive for Chlamydia trachomatis. Hemoglobin is 12.0 g/dL.$sc$,
  $qu$Which of the following is the recommended treatment?$qu$,
  $op${"options": ["Amoxicillin as the preferred primary regimen", "Azithromycin 1 g orally as a single dose", "Doxycycline during this second trimester", "No antimicrobial drug until after the birth", "Metronidazole as therapy for this organism"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "chlamydia-azithromycin-not-doxycycline", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Azithromycin 1 g orally as a single dose$ky$,
  $ex$Pregnancy treatment is azithromycin 1 g orally once. The alternative is amoxicillin 500 mg orally three times daily for 7 days. Doxycycline is contraindicated in the second and third trimesters. The NAAT is positive for Chlamydia trachomatis at 20 weeks. "Amoxicillin as the preferred primary regimen" is not the best choice because Amoxicillin 500 mg orally three times daily for 7 days is an alternative in pregnancy, not the regimen named as the treatment. "Doxycycline during this second trimester" is not the best choice because Doxycycline is contraindicated in the second and third trimesters. She is at 20 weeks. "No antimicrobial drug until after the birth" is not the best choice because Treatment is not deferred until after birth. Pregnancy treatment is given now. "Metronidazole as therapy for this organism" is not the best choice because Metronidazole is not the pregnancy treatment named for this organism.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'dd7df9235dd3b3f0cf14f3fe2c2183a73e6085c0e0c029fa4fbcd99606fe802a', false, NOW(), NOW(), 3,
  'chlamydia-azithromycin-not-doxycycline', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'chlamydia-azithromycin-not-doxycycline', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-062", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210063', 'usmle-step-2', 'obstetrics',
  $sc$A 24-year-old woman who works as a high school coach is seen in the school-adjacent prenatal clinic at 24 weeks of gestation, six days after treatment. She took azithromycin 1 g orally once six days ago after an endocervical NAAT detected Chlamydia trachomatis. Irritation has faded. Practice ended an hour ago, and she feels well. She asks whether today's urine sample can serve as the test of cure. Temperature is 36.6°C, pulse is 80/min, respirations are 15/min, and blood pressure is 112/68 mm Hg. Hemoglobin is 11.7 g/dL. No repeat NAAT has been collected since the azithromycin dose. A urine dipstick shows no leukocyte esterase.$sc$,
  $qu$Which of the following is the most appropriate retesting plan?$qu$,
  $op${"options": ["A NAAT tomorrow is the test of cure, with no later test at this encounter", "Culture at 6 months replaces a nucleic acid test", "NAAT about 4 weeks after treatment, and again at 3 months", "Cytology next year replaces both follow-up tests", "No repeat test is used after treatment in pregnancy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "chlamydia-naat-cure-test-and-3-month-retest", "taskCategory": "health-maintenance"}$op$,
  $ky$NAAT about 4 weeks after treatment, and again at 3 months$ky$,
  $ex$In pregnancy, the test of cure is a NAAT about 4 weeks after treatment, and retesting is also done at 3 months. She took azithromycin 1 g six days ago, so a sample today is too soon for the 4-week test. "A NAAT tomorrow is the test of cure, with no later test at this encounter" is not the best choice because A test the day after treatment, or at six days, is earlier than the test of cure. The pregnancy test of cure is a NAAT about 4 weeks after treatment, and another test is done at 3 months. "Culture at 6 months replaces a nucleic acid test" is not the best choice because The specified test of cure is a NAAT, not a culture at 6 months. "Cytology next year replaces both follow-up tests" is not the best choice because Cytology does not replace the NAAT test of cure or the 3-month retest. "No repeat test is used after treatment in pregnancy" is not the best choice because Pregnancy care includes a test of cure. It is not omitted after treatment.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '8a3f8361479a2fd510d82a974318b2d4c7965daca2495755035811aa63e850e4', false, NOW(), NOW(), 3,
  'chlamydia-naat-cure-test-and-3-month-retest', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'chlamydia-naat-cure-test-and-3-month-retest', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-063", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210064', 'usmle-step-2', 'endocrinology',
  $sc$A 52-year-old man who works as a power-line worker is seen in the metabolism clinic after a workplace physical found an unexpected lab value. He climbs towers four days a week, drinks water on the truck, and has not noticed extra trips to urinate or a change in thirst. Weight on the clinic scale matches his license from last year. He takes no glucose-lowering drug. A fingerstick was not done. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. Hemoglobin A1C is 6.8%. Hemoglobin is 14.6 g/dL. No plasma glucose was drawn.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A single A1C of 6.8% finishes the question without symptoms during today's visit", "An A1C of 6.8% sits in the 5.7% to 6.4% range", "A sensor download should replace this A1C before any repeat", "One A1C at or above 6.5% still needs a second abnormal result", "A second test is required only when the A1C exceeds 10%"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "single-a1c-needs-second-result", "taskCategory": "diagnosis"}$op$,
  $ky$One A1C at or above 6.5% still needs a second abnormal result$ky$,
  $ex$An A1C of 6.5% or higher is one abnormal result. Without unequivocal hyperglycemia, two abnormal results are required, either the same test twice or two different tests. He has no classic symptoms and is not in crisis, and this A1C is 6.8%. "A single A1C of 6.8% finishes the question without symptoms during today's visit" is not the best choice because A single A1C in this range is not enough when hyperglycemia is not unequivocal. "An A1C of 6.8% sits in the 5.7% to 6.4% range" is not the best choice because The 5.7% to 6.4% range is below the 6.5% line. 6.8% is not inside that range. "A sensor download should replace this A1C before any repeat" is not the best choice because Continuous glucose monitoring is not used to make the diagnosis, and it does not replace a confirming plasma test. "A second test is required only when the A1C exceeds 10%" is not the best choice because The two-result rule is not reserved for an A1C above 10%. An A1C above 10% is a separate reason to start insulin in treatment guidance. This diagnostic step is about confirming an A1C of 6.8%.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'afd644bba01bfcd4b6e66a028a8a63e17e48b8dbc9cdd3a0f43de9895de1d1da', false, NOW(), NOW(), 3,
  'single-a1c-needs-second-result', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'single-a1c-needs-second-result', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-064", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210065', 'usmle-step-2', 'endocrinology',
  $sc$A 61-year-old woman who works as a grain-elevator operator is seen in the county internal medicine office the morning after an overnight fast for scheduled labs. She had nothing but water for 10 hours. Thirst and urination are unchanged, and her weight has been stable through harvest season. She takes a statin and no glucose-lowering drug. The visit was booked for blood pressure follow-up. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 136/82 mm Hg. Fasting plasma glucose is 134 mg/dL and hemoglobin A1C is 6.6%. Hemoglobin is 13.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The fasting result must reach 200 mg/dL before two tests count", "Only a repeated A1C can confirm an abnormal fasting glucose", "6.6% is under 6.5%, so the pair is not abnormal", "A fasting glucose of 134 mg/dL is in the 100 to 125 mg/dL range at the present visit", "The A1C and the fasting glucose are two different abnormal tests"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "fasting-and-a1c-two-tests-confirm", "taskCategory": "diagnosis"}$op$,
  $ky$The A1C and the fasting glucose are two different abnormal tests$ky$,
  $ex$Fasting plasma glucose of 126 mg/dL or higher and an A1C of 6.5% or higher are each abnormal. These results are 134 mg/dL after a 10-hour fast and an A1C of 6.6%. Two different tests are abnormal, which meets the requirement for confirmation when hyperglycemia is not unequivocal. "The fasting result must reach 200 mg/dL before two tests count" is not the best choice because 200 mg/dL is a 2-hour or symptomatic random threshold, not a requirement for the fasting test. The fasting line is 126 mg/dL. "Only a repeated A1C can confirm an abnormal fasting glucose" is not the best choice because Confirmation can be the same test twice or two different tests. A second method already in hand does not have to be discarded in favor of only repeating the A1C. "6.6% is under 6.5%, so the pair is not abnormal" is not the best choice because 6.6% is not under 6.5%. It is at or above the A1C line. "A fasting glucose of 134 mg/dL is in the 100 to 125 mg/dL range at the present visit" is not the best choice because The 100 to 125 mg/dL span is below 126 mg/dL. A fasting result of 134 mg/dL is above that span.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'e021d18fd786f5dd1096a48d0b83cf2d3d5fa0f0a161c426e6c5e9cc88a5b627', false, NOW(), NOW(), 2,
  'fasting-and-a1c-two-tests-confirm', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'fasting-and-a1c-two-tests-confirm', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-065", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210066', 'usmle-step-2', 'endocrinology',
  $sc$A 47-year-old man who works as a dump-truck driver is seen in the urgent-visit clinic because of thirst that wakes him twice a night. He has been urinating large volumes for three weeks and has lost 6 kg without a new diet. Lunch was a sandwich two hours ago. He is alert, drinking from a gallon jug, and not vomiting. No glucose-lowering drug has ever been prescribed. Temperature is 36.8°C, pulse is 92/min, respirations are 16/min, and blood pressure is 132/80 mm Hg. A plasma glucose drawn with the afternoon panel is 256 mg/dL. Urine ketones are negative. Hemoglobin is 15.1 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Random glucose at or above 200 mg/dL plus these symptoms is enough", "A second test is mandatory because he ate two hours ago", "256 mg/dL counts only if it was a fasting sample", "Classic symptoms matter only when the glucose is under 200 mg/dL in the office today", "Negative urine ketones cancel a symptomatic glucose of 256 mg/dL"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "random-glucose-with-classic-symptoms", "taskCategory": "diagnosis"}$op$,
  $ky$Random glucose at or above 200 mg/dL plus these symptoms is enough$ky$,
  $ex$A random plasma glucose of 200 mg/dL or higher plus classic symptoms, which include polyuria, polydipsia, and unexplained weight loss, is diagnostic. This glucose is 256 mg/dL, with large-volume urination, thirst, and a 6 kg loss. A second test is not required for unequivocal hyperglycemia. "A second test is mandatory because he ate two hours ago" is not the best choice because A recent meal does not erase the random-glucose rule. The sample was not offered as a fasting test. "256 mg/dL counts only if it was a fasting sample" is not the best choice because The fasting rule is a different path, at or above 126 mg/dL after at least 8 hours. This sample is a random glucose with symptoms. "Classic symptoms matter only when the glucose is under 200 mg/dL in the office today" is not the best choice because The symptom rule is used when the random glucose is at or above 200 mg/dL, not when it is under that line. "Negative urine ketones cancel a symptomatic glucose of 256 mg/dL" is not the best choice because Absent ketones do not cancel classic symptoms plus a random glucose at or above 200 mg/dL. Ketosis is a separate treatment clue for starting insulin.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'ccc597b5800a8dd78807bf7ddc6df06151aa1e764f1fdb1329c2b14eb87d59ff', false, NOW(), NOW(), 2,
  'random-glucose-with-classic-symptoms', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'random-glucose-with-classic-symptoms', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-066", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210067', 'usmle-step-2', 'endocrinology',
  $sc$A 58-year-old woman who works as a tax accountant is seen in the annual-visit office for a routine examination with no new complaints. She ate oatmeal three hours before the draw. Thirst, urination, and weight are unchanged, and she is not short of breath or vomiting. She takes levothyroxine and no glucose-lowering drug. The visit was scheduled months ago. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. A plasma glucose in the chemistry panel is 228 mg/dL. Hemoglobin A1C was not ordered. Hemoglobin is 13.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["228 mg/dL with this history finishes the diagnosis today", "A random value at or above 200 mg/dL without symptoms is not enough", "Any glucose over 140 mg/dL after a meal is diagnostic", "The sample should be read as a 2-hour tolerance-test result before the patient leaves", "Negative symptoms plus 228 mg/dL prove the result is normal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "random-glucose-without-symptoms", "taskCategory": "diagnosis"}$op$,
  $ky$A random value at or above 200 mg/dL without symptoms is not enough$ky$,
  $ex$Without classic symptoms or a crisis, a random glucose of 228 mg/dL is not the unequivocal finding that skips confirmation. Diagnosis uses the standard tests, and two abnormal results are required when hyperglycemia is not unequivocal. "228 mg/dL with this history finishes the diagnosis today" is not the best choice because A random glucose at or above 200 mg/dL diagnoses the condition when classic symptoms or a crisis is present. Neither is present here. "Any glucose over 140 mg/dL after a meal is diagnostic" is not the best choice because 140 mg/dL is the low end of the 2-hour prediabetes range on a 75-g test, not a rule for an untimed mealtime sample. "The sample should be read as a 2-hour tolerance-test result before the patient leaves" is not the best choice because A 2-hour result of 200 mg/dL or higher applies to a 75-g tolerance test, not to a glucose drawn 3 hours after oatmeal. "Negative symptoms plus 228 mg/dL prove the result is normal" is not the best choice because 228 mg/dL is not a normal result. It also is not, by itself, a completed diagnosis in the absence of symptoms or crisis.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'c4d0e4763eee926ca95e85326f1def5924e63e5342eb96ea56028544f0c3d362', false, NOW(), NOW(), 4,
  'random-glucose-without-symptoms', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'random-glucose-without-symptoms', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-067", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210068', 'usmle-step-2', 'endocrinology',
  $sc$A 19-year-old man who works as a line cook is seen in the emergency department after coworkers carried him from a hot kitchen. He has been vomiting since dawn and breathing deeply. The triage note calls the picture a hyperglycemic crisis. He can give his name. No one has prescribed him a glucose-lowering drug. A roommate says the water pitcher has been empty for days. Temperature is 37.1°C, pulse is 118/min, respirations are 24/min, and blood pressure is 98/60 mm Hg. Plasma glucose is 436 mg/dL. Urine ketones are positive. Serum bicarbonate is 12 mEq/L.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Wait for a second A1C before accepting the glucose result", "436 mg/dL counts only if he has been fasting for 8 hours", "A glucose at or above 200 mg/dL in a crisis needs no second test", "Positive ketones replace the need for any glucose value", "A glucose under 300 mg/dL would be required to call this a crisis"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "crisis-glucose-does-not-need-second-test", "taskCategory": "diagnosis"}$op$,
  $ky$A glucose at or above 200 mg/dL in a crisis needs no second test$ky$,
  $ex$A random glucose of 200 mg/dL or higher plus a crisis is diagnostic. This plasma glucose is 436 mg/dL in a hyperglycemic crisis, so a second confirming test is not required. "Wait for a second A1C before accepting the glucose result" is not the best choice because Unequivocal hyperglycemia during a crisis does not wait on a second A1C. The two-test rule is for situations that are not unequivocal. "436 mg/dL counts only if he has been fasting for 8 hours" is not the best choice because The fasting rule is a separate path. This glucose was drawn during a crisis, not as a planned fasting test. "Positive ketones replace the need for any glucose value" is not the best choice because Ketones support the crisis picture. They do not replace the glucose value. The diagnostic pairing is a random glucose at or above 200 mg/dL plus crisis. "A glucose under 300 mg/dL would be required to call this a crisis" is not the best choice because No rule here says a crisis requires glucose under 300 mg/dL. 300 mg/dL is a treatment threshold for starting insulin, not a cap on the crisis definition.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '6ed9ec8e9aeabf5d86d5419471852295a0736f617ad08d6a4074f2ab7e9eb057', false, NOW(), NOW(), 3,
  'crisis-glucose-does-not-need-second-test', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'crisis-glucose-does-not-need-second-test', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-068", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210069', 'usmle-step-2', 'endocrinology',
  $sc$A 44-year-old woman who works as a barber is seen in the storefront primary care office to review a lab slip from last Tuesday. She cut hair all morning and feels well. Thirst and weight are stable. She takes no glucose-lowering medicine. The slip was drawn with a cholesterol panel at a health fair. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Hemoglobin A1C is 6.0%. A nonfasting plasma glucose that day was 118 mg/dL. Hemoglobin is 13.2 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation of the A1C?$qu$,
  $op${"options": ["An A1C of 6.0% meets the 6.5% threshold", "An A1C of 6.0% is normal because it is under 6.5%", "A nonfasting glucose of 118 mg/dL confirms a 6.5% threshold", "An A1C of 6.0% is inside the 5.7% to 6.4% range", "This A1C should be read with pregnancy cutoffs"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "a1c-6-0-inside-5-7-to-6-4", "taskCategory": "diagnosis"}$op$,
  $ky$An A1C of 6.0% is inside the 5.7% to 6.4% range$ky$,
  $ex$An A1C of 5.7% to 6.4% is the prediabetes range. This result is 6.0%. It is not at or above the 6.5% diabetes line. "An A1C of 6.0% meets the 6.5% threshold" is not the best choice because The diabetes-range A1C line is 6.5%. 6.0% is below it. "An A1C of 6.0% is normal because it is under 6.5%" is not the best choice because Under 6.5% is not automatically normal. Values from 5.7% through 6.4% are the prediabetes range. "A nonfasting glucose of 118 mg/dL confirms a 6.5% threshold" is not the best choice because A random glucose of 118 mg/dL is under 200 mg/dL and does not confirm a diabetes-range A1C. The A1C itself is 6.0%, which is under 6.5%. "This A1C should be read with pregnancy cutoffs" is not the best choice because She is not pregnant. Pregnancy A1C goals and the limits on A1C in later pregnancy do not reclassify this result.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'c3f7b8adeaa2945a3fc36065773c2b5a4935d066cb4ea90cda131d237cbda068', false, NOW(), NOW(), 1,
  'a1c-6-0-inside-5-7-to-6-4', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'a1c-6-0-inside-5-7-to-6-4', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-069", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210070', 'usmle-step-2', 'endocrinology',
  $sc$A 49-year-old man who works as a freight clerk is seen in the warehouse clinic after clocking out of a night shift and fasting for the lab. He had nothing but water for 12 hours. He is not thirstier than usual and has not lost weight. The shift soda machine is broken, which he mentions only as gossip. He takes no glucose-lowering drug. Temperature is 36.6°C, pulse is 64/min, respirations are 14/min, and blood pressure is 126/80 mm Hg. Fasting plasma glucose is 111 mg/dL. Hemoglobin A1C is 5.5%. Hemoglobin is 15.0 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation of the fasting glucose?$qu$,
  $op${"options": ["111 mg/dL meets the fasting line of 126 mg/dL", "A 12-hour fast is too long, so 111 mg/dL cannot be read", "The A1C of 5.5% pulls this fasting result under 100 mg/dL", "Fasting values are abnormal only when they reach 200 mg/dL", "111 mg/dL is inside the 100 to 125 mg/dL range"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "fasting-111-inside-100-to-125", "taskCategory": "diagnosis"}$op$,
  $ky$111 mg/dL is inside the 100 to 125 mg/dL range$ky$,
  $ex$A fasting plasma glucose of 100 to 125 mg/dL is the prediabetes range, after at least 8 hours without caloric intake. This result is 111 mg/dL after 12 hours. The A1C of 5.5% is under 5.7%. "111 mg/dL meets the fasting line of 126 mg/dL" is not the best choice because The fasting diabetes-range line is 126 mg/dL. 111 mg/dL is below it. "A 12-hour fast is too long, so 111 mg/dL cannot be read" is not the best choice because The fasting definition is at least 8 hours. A 12-hour fast still qualifies. "The A1C of 5.5% pulls this fasting result under 100 mg/dL" is not the best choice because An A1C does not arithmetically change a plasma glucose. 5.5% is under the 5.7% prediabetes A1C range, and the fasting glucose is interpreted on its own scale. "Fasting values are abnormal only when they reach 200 mg/dL" is not the best choice because 200 mg/dL is a 2-hour or symptomatic random threshold. The fasting diabetes-range line is 126 mg/dL, and 100 to 125 mg/dL is the range below that.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'd6d1efed393484fbd786b04c90c6bb53d63e4550974753ebb30ab941ee7b42ef', false, NOW(), NOW(), 1,
  'fasting-111-inside-100-to-125', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'fasting-111-inside-100-to-125', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-070", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210071', 'usmle-step-2', 'endocrinology',
  $sc$A 55-year-old woman who works as a house painter is seen in the morning-draw laboratory at the end of a 75-g tolerance test. She fasted 9 hours, drank the load, and waited without leaving the chair. No one has prescribed a glucose-lowering drug. She has no extra thirst. Drop cloths and a ladder were left at the job for tomorrow. Temperature is 36.5°C, pulse is 76/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. Fasting plasma glucose is 92 mg/dL and the 2-hour plasma glucose is 164 mg/dL. Hemoglobin A1C is 5.6%.$sc$,
  $qu$Which of the following is the most appropriate interpretation of the 2-hour result?$qu$,
  $op${"options": ["164 mg/dL is inside the 140 to 199 mg/dL range", "164 mg/dL meets the 2-hour line of 200 mg/dL", "A fasting result of 92 mg/dL makes the 2-hour result normal", "The 2-hour prediabetes range starts at 126 mg/dL", "An A1C of 5.6% reclassifies 164 mg/dL as normal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "ogtt-two-hour-164-mid-range", "taskCategory": "diagnosis"}$op$,
  $ky$164 mg/dL is inside the 140 to 199 mg/dL range$ky$,
  $ex$On a 75-g test, a 2-hour glucose of 140 to 199 mg/dL is the prediabetes range. This 2-hour result is 164 mg/dL. The fasting glucose of 92 mg/dL is under 100 mg/dL, and the A1C of 5.6% is under 5.7%. "164 mg/dL meets the 2-hour line of 200 mg/dL" is not the best choice because The 2-hour diabetes-range line on a 75-g test is 200 mg/dL. 164 mg/dL is below it. "A fasting result of 92 mg/dL makes the 2-hour result normal" is not the best choice because A normal fasting result does not rewrite the 2-hour result. Fasting 92 mg/dL is under 100 mg/dL, and the 2-hour value is judged separately. "The 2-hour prediabetes range starts at 126 mg/dL" is not the best choice because 126 mg/dL is the fasting diabetes-range line, not the start of the 2-hour range. The 2-hour range begins at 140 mg/dL. "An A1C of 5.6% reclassifies 164 mg/dL as normal" is not the best choice because An A1C under 5.7% does not convert a 2-hour result of 164 mg/dL into a normal 2-hour value.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'eb4e49969147dfaf69cb5aa05319ae962b84c08c6643f400fb67e66345834015', false, NOW(), NOW(), 2,
  'ogtt-two-hour-164-mid-range', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'ogtt-two-hour-164-mid-range', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-071", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210072', 'usmle-step-2', 'endocrinology',
  $sc$A 42-year-old man who works as a security guard is seen in the employee-health office with a sensor report a coworker asked you to sign into the chart as a final label. The 14-day download was borrowed from a sibling's spare sensor. He has been thirstier on night rounds. No plasma glucose and no A1C have been drawn. He is not vomiting and can walk the corridor without help. You are asked to enter the label before the lab opens. Temperature is 36.7°C, pulse is 80/min, respirations are 16/min, and blood pressure is 134/84 mm Hg. The download lists a mean glucose of 168 mg/dL and 38% of readings above 180 mg/dL. A fingerstick in the office is 174 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate professional response?$qu$,
  $op${"options": ["Sign the label because the mean of 168 mg/dL is at or above 126", "Decline to sign from the sensor, and obtain a standard plasma test", "Sign the label because 38% of readings above 180 mg/dL is diagnostic", "Average this download with a second sensor week and then sign", "The office fingerstick of 174 mg/dL is already a completed tolerance test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cgm-download-cannot-diagnose", "taskCategory": "professionalism"}$op$,
  $ky$Decline to sign from the sensor, and obtain a standard plasma test$ky$,
  $ex$Continuous glucose monitoring is not used to diagnose this condition. A standard plasma test, such as fasting glucose, a 75-g tolerance test, or an A1C when A1C is reliable, is required. The fingerstick of 174 mg/dL is under 200 mg/dL and is not a completed diagnostic study. "Sign the label because the mean of 168 mg/dL is at or above 126" is not the best choice because 126 mg/dL is a fasting plasma threshold, not a sensor-mean threshold. Continuous glucose monitoring is not used to make the diagnosis. "Sign the label because 38% of readings above 180 mg/dL is diagnostic" is not the best choice because A percent of sensor readings above 180 mg/dL is not a diagnostic criterion. "Average this download with a second sensor week and then sign" is not the best choice because A second sensor study is still continuous glucose monitoring. Repeating it does not create an allowed diagnostic method. "The office fingerstick of 174 mg/dL is already a completed tolerance test" is not the best choice because A single fingerstick of 174 mg/dL is not a 75-g tolerance test and is not a fasting sample that has met 126 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "professionalism"]$tg$,
  's2-new-20261121-hidden', 'f21daaf3557a4b04b404b29183600891b666082995f0c291eda2b565cb7899d4', false, NOW(), NOW(), 3,
  'cgm-download-cannot-diagnose', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'professionalism', 'cgm-download-cannot-diagnose', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-072", "hidden": true, "physicianTask": "professionalism", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210073', 'usmle-step-2', 'endocrinology',
  $sc$A 28-year-old man who works as a tile setter is seen in the hematology-and-glucose clinic with a chart note that glucose-6-phosphate dehydrogenase deficiency was confirmed in childhood. He fasted 9 hours. A parent had the same enzyme finding. He is not on hemodialysis, has not been transfused, and is not taking erythropoietin. Thirst is increased. He takes no glucose-lowering drug. Temperature is 36.6°C, pulse is 84/min, respirations are 16/min, and blood pressure is 124/76 mm Hg. Hemoglobin A1C is 5.3%. Fasting plasma glucose is 139 mg/dL. Hemoglobin is 12.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The A1C of 5.3% clears him because it is under 5.7%", "Average the A1C with the fasting glucose and use the mean", "The A1C is unreliable; use the plasma glucose", "G6PD deficiency changes A1C only after a transfusion", "Repeat the A1C next week; the enzyme finding does not affect it"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "a1c-unreliable-g6pd-deficiency", "taskCategory": "interpretation"}$op$,
  $ky$The A1C is unreliable; use the plasma glucose$ky$,
  $ex$A1C is unreliable in G6PD deficiency, so plasma glucose is used instead. This fasting plasma glucose is 139 mg/dL after 9 hours, which is at or above the 126 mg/dL line. Without unequivocal hyperglycemia, a second abnormal glucose result is still required. "The A1C of 5.3% clears him because it is under 5.7%" is not the best choice because A1C is unreliable in G6PD deficiency, so 5.3% cannot be used to say the result is normal or in any A1C range. "Average the A1C with the fasting glucose and use the mean" is not the best choice because Averaging an unreliable A1C with a glucose does not repair the A1C. The plasma glucose is the test to use. "G6PD deficiency changes A1C only after a transfusion" is not the best choice because G6PD deficiency itself makes A1C unreliable. A transfusion is a separate reason, and he has not been transfused. "Repeat the A1C next week; the enzyme finding does not affect it" is not the best choice because Repeating the A1C does not overcome G6PD deficiency. The limitation is the condition, not a single bad draw.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '0dadfdc9388e61a13f47399de1173d7ec4bea0209bf0f18502729397a51c4b53', false, NOW(), NOW(), 4,
  'a1c-unreliable-g6pd-deficiency', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'a1c-unreliable-g6pd-deficiency', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-073", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210074', 'usmle-step-2', 'endocrinology',
  $sc$A 67-year-old man who works as a retired millwright is seen in the dialysis-unit exam room on a Wednesday between scheduled hemodialysis sessions. He dialyzes Tuesday, Thursday, and Saturday. Appetite is fair and he has not lost weight this month. No glucose-lowering pill is on the medication list. A daughter asks whether last week's A1C means the glucose question is settled. Temperature is 36.5°C, pulse is 78/min, respirations are 16/min, and blood pressure is 148/82 mm Hg. Hemoglobin A1C is 5.9%. Fasting plasma glucose this morning is 152 mg/dL. Hemoglobin is 10.2 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["An A1C of 5.9% on dialysis is more accurate than a plasma glucose", "Hemodialysis changes A1C only when erythropoietin is also injected", "152 mg/dL fasting is in the 100 to 125 mg/dL range", "Do not use the A1C; judge him with the plasma glucose", "Repeat the A1C after the Thursday run and ignore the glucose"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "a1c-unreliable-on-hemodialysis", "taskCategory": "interpretation"}$op$,
  $ky$Do not use the A1C; judge him with the plasma glucose$ky$,
  $ex$A1C is unreliable in people treated with hemodialysis, so plasma glucose is used. This fasting glucose is 152 mg/dL, at or above 126 mg/dL. Without unequivocal hyperglycemia, a second abnormal result is still required. "An A1C of 5.9% on dialysis is more accurate than a plasma glucose" is not the best choice because Hemodialysis makes A1C less reliable, not more accurate than plasma glucose. "Hemodialysis changes A1C only when erythropoietin is also injected" is not the best choice because Hemodialysis is itself a listed reason A1C is unreliable. Erythropoietin therapy is an additional, separate reason. "152 mg/dL fasting is in the 100 to 125 mg/dL range" is not the best choice because The 100 to 125 mg/dL span is below the fasting line of 126 mg/dL. 152 mg/dL is above 126. "Repeat the A1C after the Thursday run and ignore the glucose" is not the best choice because Repeating the A1C does not fix the hemodialysis limitation. The glucose is the usable test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '5c1043b0483805f79ff43e401a367a03626884cc5c49622255cf96b308c51ad3', false, NOW(), NOW(), 4,
  'a1c-unreliable-on-hemodialysis', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'a1c-unreliable-on-hemodialysis', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-074", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210075', 'usmle-step-2', 'endocrinology',
  $sc$A 73-year-old woman who works as a church organist is seen in the surgical follow-up clinic 12 days after two units of red cells were given during fracture repair. She fasted 10 hours for this visit. Thirst is a new complaint, and she is not on dialysis or erythropoietin. The orthopedic note records the transfusion on the night of surgery. She takes no glucose-lowering drug. Walking is with a cane. Temperature is 36.6°C, pulse is 82/min, respirations are 16/min, and blood pressure is 138/76 mm Hg. Hemoglobin A1C is 5.4%. Fasting plasma glucose is 144 mg/dL. Hemoglobin is 10.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The transfusion makes the A1C more trustworthy than the glucose", "An A1C of 5.4% twelve days later clears the fasting glucose", "Transfusion affects A1C only if hemolysis is also documented", "144 mg/dL fasting is below the 126 mg/dL line", "Recent transfusion makes this A1C unreliable"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "a1c-unreliable-after-transfusion", "taskCategory": "interpretation"}$op$,
  $ky$Recent transfusion makes this A1C unreliable$ky$,
  $ex$A1C is unreliable after recent transfusion, so plasma glucose is used. This fasting glucose is 144 mg/dL after 10 hours, at or above 126 mg/dL. A second abnormal result is still required because hyperglycemia is not unequivocal. "The transfusion makes the A1C more trustworthy than the glucose" is not the best choice because A recent transfusion makes A1C unreliable. It does not make A1C preferable to plasma glucose. "An A1C of 5.4% twelve days later clears the fasting glucose" is not the best choice because 5.4% cannot clear the glucose question when the A1C is unreliable. The fasting glucose is 144 mg/dL. "Transfusion affects A1C only if hemolysis is also documented" is not the best choice because Transfusion is its own listed reason. Hemolysis is a separate reason and is not required before the transfusion limitation applies. "144 mg/dL fasting is below the 126 mg/dL line" is not the best choice because 144 mg/dL is above, not below, the fasting line of 126 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '103cf0a2da6b67ba46c35c76096911bf76c09b3b197415ef6b06708809cc851f', false, NOW(), NOW(), 3,
  'a1c-unreliable-after-transfusion', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'a1c-unreliable-after-transfusion', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-075", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210076', 'usmle-step-2', 'endocrinology',
  $sc$A 64-year-old man who works as a jazz drummer is seen in the valve-clinic afternoon slot with a mechanical mitral valve and a smear the lab flagged. The smear shows schistocytes, and the hematology note documents hemolysis. He is not on hemodialysis and has not been transfused this year. He fasted 8 hours. Sticks have been clicking more slowly because of fatigue, and thirst is new. Temperature is 36.8°C, pulse is 90/min, respirations are 16/min, and blood pressure is 128/74 mm Hg. Haptoglobin is 6 mg/dL. Hemoglobin A1C is 5.2%. Fasting plasma glucose is 148 mg/dL. Hemoglobin is 8.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Hemolysis makes this hemoglobin A1C result unreliable", "An A1C of 5.2% outweighs a fasting glucose of 148 mg/dL", "Hemolysis changes A1C only after erythropoietin is started", "Haptoglobin of 6 mg/dL repairs the A1C so it can be used", "148 mg/dL fasting is in the 100 to 125 mg/dL range"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "a1c-unreliable-during-hemolysis", "taskCategory": "interpretation"}$op$,
  $ky$Hemolysis makes this hemoglobin A1C result unreliable$ky$,
  $ex$A1C is unreliable during hemolysis, so the plasma glucose is the test to use. Fasting glucose is 148 mg/dL after 8 hours, at or above 126 mg/dL. A confirming second result is still required without unequivocal hyperglycemia. "An A1C of 5.2% outweighs a fasting glucose of 148 mg/dL" is not the best choice because The A1C cannot outweigh the glucose when hemolysis makes the A1C unreliable. "Hemolysis changes A1C only after erythropoietin is started" is not the best choice because Erythropoietin therapy is a separate limitation. Hemolysis itself is enough to set the A1C aside. "Haptoglobin of 6 mg/dL repairs the A1C so it can be used" is not the best choice because A low haptoglobin supports hemolysis. It does not make the A1C valid. "148 mg/dL fasting is in the 100 to 125 mg/dL range" is not the best choice because 148 mg/dL is above 126 mg/dL, not inside 100 to 125 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'fb8c6ef1388b9187514457f2058c3f8b47f30f4c3ee48a04621a56bdbd5dd7f2', false, NOW(), NOW(), 4,
  'a1c-unreliable-during-hemolysis', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'a1c-unreliable-during-hemolysis', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-076", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210077', 'usmle-step-2', 'endocrinology',
  $sc$A 71-year-old woman who works as a quilt-shop clerk is seen in the kidney-care office who injects erythropoietin three times a week for anemia. She is not yet on hemodialysis. A 75-g load was given after a 10-hour fast. She has no new thirst and is not acutely ill. The injections were started by the kidney clinic four months ago. She takes no glucose-lowering drug. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 142/78 mm Hg. Hemoglobin A1C is 5.5%. The 2-hour plasma glucose is 214 mg/dL and the fasting plasma glucose is 118 mg/dL. Hemoglobin is 10.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The A1C of 5.5% cancels a 2-hour glucose of 214 mg/dL", "Erythropoietin therapy makes this A1C unreliable", "Erythropoietin makes A1C accurate enough to ignore plasma glucose", "118 mg/dL fasting already meets the 126 mg/dL line", "A 2-hour result of 214 mg/dL is in the 140 to 199 mg/dL range"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "a1c-unreliable-on-erythropoietin", "taskCategory": "interpretation"}$op$,
  $ky$Erythropoietin therapy makes this A1C unreliable$ky$,
  $ex$A1C is unreliable during erythropoietin therapy, so plasma glucose is used. The 2-hour value on this 75-g test is 214 mg/dL, which is at or above 200 mg/dL. She has no classic symptoms and is not in crisis, so a second abnormal result is still required. "The A1C of 5.5% cancels a 2-hour glucose of 214 mg/dL" is not the best choice because A1C cannot cancel the glucose result. Erythropoietin therapy makes the A1C unreliable. "Erythropoietin makes A1C accurate enough to ignore plasma glucose" is not the best choice because Erythropoietin therapy is a reason not to use A1C, not a reason to prefer it over plasma glucose. "118 mg/dL fasting already meets the 126 mg/dL line" is not the best choice because 118 mg/dL is under 126 mg/dL. It sits in the 100 to 125 mg/dL fasting range and is not the diabetes-range fasting line. "A 2-hour result of 214 mg/dL is in the 140 to 199 mg/dL range" is not the best choice because 214 mg/dL is at or above 200 mg/dL, not inside 140 to 199 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'e0179d8f38c51c990a1d7f41291845278ef3fd90a5bc09b6978b8f348cfaecf8', false, NOW(), NOW(), 3,
  'a1c-unreliable-on-erythropoietin', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 2: Diagnosis and Classification of Diabetes.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'a1c-unreliable-on-erythropoietin', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-077", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S27/157566/2-Diagnosis-and-Classification-of-Diabetes", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210078', 'usmle-step-2', 'endocrinology',
  $sc$A 69-year-old man who works as a cabinetmaker is seen in the woodshop primary care office for a refill of metformin he has taken for four years. Home glucose readings are mostly in the 140s mg/dL. He has had no vomiting and no rapid breathing. Sawdust is on his cuffs. The kidney number on today's panel is lower than the one from two years ago, and a partner in the shop told him any result under 45 means the pill must stop today. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 136/78 mm Hg. eGFR is 36 mL/min/1.73 m2. Hemoglobin A1C is 7.6%. Creatinine is 1.9 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate metformin plan?$qu$,
  $op${"options": ["Stop metformin today because the eGFR is under 45", "Stop metformin today because the eGFR is under 60", "Metformin may continue, with higher risk in the 30 to 45 range", "The risk is the same at an eGFR of 36 as it is above 60 before the patient leaves", "Increase the metformin dose because the A1C is 7.6%"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "metformin-egfr-36-higher-risk-still-allowed", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Metformin may continue, with higher risk in the 30 to 45 range$ky$,
  $ex$Metformin may be used when the eGFR is at least 30 mL/min/1.73 m2. Risk rises at 30 to 45, and it should not be used below 30. This eGFR is 36, so the drug may continue with that higher risk. The A1C is 7.6%. "Stop metformin today because the eGFR is under 45" is not the best choice because An eGFR under 45 is not an automatic stop. Use is avoided when the eGFR is under 30. Risk is higher, not an absolute ban, from 30 to 45. "Stop metformin today because the eGFR is under 60" is not the best choice because 60 is not the stop line in this guidance. The do-not-use line is an eGFR under 30. "The risk is the same at an eGFR of 36 as it is above 60 before the patient leaves" is not the best choice because Risk rises at an eGFR of 30 to 45. It is not the same as the risk when the eGFR is above that band. "Increase the metformin dose because the A1C is 7.6%" is not the best choice because Raising the dose ignores the higher risk at an eGFR of 36. The A1C goal for many nonpregnant adults is under 7%, but the metformin question here is whether the drug may be used.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '8664e8657780fc882b67bd784a6462ad1a512964083913cd391b95b8bf121133', false, NOW(), NOW(), 5,
  'metformin-egfr-36-higher-risk-still-allowed', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'metformin-egfr-36-higher-risk-still-allowed', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-078", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210079', 'usmle-step-2', 'endocrinology',
  $sc$A 74-year-old woman who works as a library page is seen in the kidney-and-glucose clinic whose metformin refill request is on the desk. She has taken it for six years. Stairs to the stacks leave her winded, and she has had no vomiting today. A nephrologist is already following the kidney numbers. She lives alone and sorts holds in the afternoon. Temperature is 36.5°C, pulse is 76/min, respirations are 16/min, and blood pressure is 142/80 mm Hg. eGFR is 23 mL/min/1.73 m2. Hemoglobin A1C is 8.1%. Creatinine is 2.3 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate metformin plan?$qu$,
  $op${"options": ["Continue, because risk rises only under an eGFR of 15", "Continue unchanged, because 23 is inside the 30 to 45 band", "Double the dose to offset the A1C of 8.1%", "Do not use metformin at an eGFR under 30", "The eGFR limit for metformin is under 60"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "metformin-egfr-23-do-not-use", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Do not use metformin at an eGFR under 30$ky$,
  $ex$Metformin should not be used when the eGFR is under 30 mL/min/1.73 m2. This eGFR is 23. It may be used at or above 30, and risk rises between 30 and 45. "Continue, because risk rises only under an eGFR of 15" is not the best choice because No stop line of 15 is stated. The do-not-use line is under 30. "Continue unchanged, because 23 is inside the 30 to 45 band" is not the best choice because 23 is under 30, not inside 30 to 45. The 30 to 45 band is where risk rises but use may still be considered. "Double the dose to offset the A1C of 8.1%" is not the best choice because Increasing the dose is not appropriate below an eGFR of 30. The drug should not be used at this level. "The eGFR limit for metformin is under 60" is not the best choice because The stated do-not-use threshold is an eGFR under 30, not under 60.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '178343e665fce282dad2e1c0243da47ccfa40c2184157d9b5227859a321727c9', false, NOW(), NOW(), 2,
  'metformin-egfr-23-do-not-use', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'metformin-egfr-23-do-not-use', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-079", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210080', 'usmle-step-2', 'endocrinology',
  $sc$A 66-year-old man who works as a school bus driver is seen in the route-end primary care clinic for a physical after five years of metformin. No one has ever ordered a vitamin B12 level. He mentions tingling in the soles after long routes, and he is not a vegan. The eGFR has been stable. He takes the metformin with breakfast and has had no recent vomiting. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 132/78 mm Hg. Hemoglobin is 11.4 g/dL and the mean corpuscular volume is 102 fL. eGFR is 72 mL/min/1.73 m2. Hemoglobin A1C is 7.1%.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["B12 testing has no role during metformin use", "Stop metformin because the eGFR is above 60", "Order a 100-g tolerance test to evaluate B12", "Replace metformin with insulin solely to avoid a B12 draw", "Check vitamin B12 while metformin continues"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "metformin-check-b12-periodically", "taskCategory": "health-maintenance"}$op$,
  $ky$Check vitamin B12 while metformin continues$ky$,
  $ex$Metformin is associated with vitamin B12 deficiency, so B12 is checked periodically. He has taken it for five years without a level. The eGFR of 72 mL/min/1.73 m2 is above the range where use is restricted. Hemoglobin is 11.4 g/dL. "B12 testing has no role during metformin use" is not the best choice because Metformin is associated with B12 deficiency, and B12 should be checked periodically. Saying testing has no role conflicts with that. "Stop metformin because the eGFR is above 60" is not the best choice because An eGFR of 72 is not a reason to stop metformin. Use is avoided under 30, and risk rises from 30 to 45. "Order a 100-g tolerance test to evaluate B12" is not the best choice because A 100-g tolerance test is not a B12 evaluation. It belongs to a different glucose strategy. "Replace metformin with insulin solely to avoid a B12 draw" is not the best choice because Insulin is not started merely to avoid a B12 level. The indicated step is to check B12.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'a433dd37c748ab8972e41d8e9636d28697cd61588c8a58cc917f52a92e3da5bc', false, NOW(), NOW(), 3,
  'metformin-check-b12-periodically', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'metformin-check-b12-periodically', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-080", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210081', 'usmle-step-2', 'endocrinology',
  $sc$A 63-year-old man who works as a harbor pilot is seen in the cardiology-glucose clinic three years after a coronary stent. Metformin has been his only glucose-lowering drug for seven years. He has had no chest pain on the ladder of the boat. A colleague suggested leaving the regimen alone because the latest A1C is already under 7%. He is not interested in stopping the statin. Temperature is 36.5°C, pulse is 64/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. Hemoglobin A1C is 6.7%. LDL cholesterol is 68 mg/dL. eGFR is 78 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate glucose-drug plan?$qu$,
  $op${"options": ["Add a GLP-1 receptor agonist or an SGLT2 inhibitor", "Add neither a GLP-1 receptor agonist nor an SGLT2 inhibitor", "Add a DPP-4 inhibitor as the preferred drug after a stent", "Start insulin because the A1C is under 7%", "Stop metformin because the A1C is already under 7%"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "ascvd-add-glp1-or-sglt2", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Add a GLP-1 receptor agonist or an SGLT2 inhibitor$ky$,
  $ex$With atherosclerotic cardiovascular disease, include a GLP-1 receptor agonist and/or an SGLT2 inhibitor regardless of the A1C. The A1C is 6.7%, which is under the common nonpregnant goal of 7%, and the stent is the cardiovascular history. The benefit is not withheld because the A1C is already under 7%. "Add neither a GLP-1 receptor agonist nor an SGLT2 inhibitor" is not the best choice because Atherosclerotic cardiovascular disease is a reason to include a GLP-1 receptor agonist, an SGLT2 inhibitor, or both, regardless of the A1C. Leaving both off is not the plan. "Add a DPP-4 inhibitor as the preferred drug after a stent" is not the best choice because A DPP-4 inhibitor is not the drug class named for atherosclerotic cardiovascular disease in this guidance. It also should not be combined with a GLP-1 receptor agonist. "Start insulin because the A1C is under 7%" is not the best choice because Insulin is not preferred when there is no insulin deficiency and the A1C is not above 10%, the glucose is not at or above 300 mg/dL, and catabolic features are absent. An A1C under 7% is not a reason to start insulin. "Stop metformin because the A1C is already under 7%" is not the best choice because An A1C under 7% does not require stopping metformin. The eGFR of 78 allows metformin to be used.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'a0e57436115ab92fad68faec1e8abdf325e579f0d1d81d48d242862e15b50aa5', false, NOW(), NOW(), 3,
  'ascvd-add-glp1-or-sglt2', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ascvd-add-glp1-or-sglt2', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-081", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210082', 'usmle-step-2', 'endocrinology',
  $sc$A 72-year-old woman who works as a choir director is seen in the heart-failure clinic with ankle swelling that worsens after evening rehearsals. The cardiology note says heart failure with preserved ejection fraction. Metformin is her only glucose-lowering drug, started eight years ago. She sleeps on two pillows. A resident suggests skipping any new glucose drug because the A1C is already under 7% and the ejection fraction is not reduced. Temperature is 36.6°C, pulse is 78/min, respirations are 18/min, and blood pressure is 130/74 mm Hg. Ejection fraction is 58%. Hemoglobin A1C is 6.8%. eGFR is 64 mL/min/1.73 m2. B-type natriuretic peptide is 240 pg/mL.$sc$,
  $qu$Which of the following is the most appropriate addition?$qu$,
  $op${"options": ["No SGLT2 inhibitor, because the ejection fraction is above 50%", "An SGLT2 inhibitor, for reduced or preserved ejection fraction", "A DPP-4 inhibitor, because preserved ejection fraction prefers that class", "Insulin, because heart failure requires insulin regardless of the A1C", "Stop metformin before any heart-failure drug is considered"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "hfpef-sglt2-regardless-of-a1c", "taskCategory": "pharmacotherapy"}$op$,
  $ky$An SGLT2 inhibitor, for reduced or preserved ejection fraction$ky$,
  $ex$An SGLT2 inhibitor is recommended for heart failure, whether the ejection fraction is reduced or preserved, regardless of the A1C. The A1C is 6.8% and the ejection fraction is 58%, with heart failure documented. The eGFR of 64 does not bar the class. "No SGLT2 inhibitor, because the ejection fraction is above 50%" is not the best choice because The recommendation is not limited to reduced ejection fraction. Heart failure with preserved ejection fraction is included. This ejection fraction is 58%. "A DPP-4 inhibitor, because preserved ejection fraction prefers that class" is not the best choice because A DPP-4 inhibitor is not the class named for heart failure. An SGLT2 inhibitor is. "Insulin, because heart failure requires insulin regardless of the A1C" is not the best choice because Heart failure is not, by itself, a reason to choose insulin over other agents. Insulin is started for glucose of at least 300 mg/dL, an A1C above 10%, or catabolic features. None of those is described, and the A1C is 6.8%. "Stop metformin before any heart-failure drug is considered" is not the best choice because The eGFR of 64 allows metformin to continue. Stopping it is not required before adding an SGLT2 inhibitor for heart failure.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '99d405086a54b18fd4c772fd6f87776400ea522ffd6b8df56b83b1e6c7d18f52', false, NOW(), NOW(), 4,
  'hfpef-sglt2-regardless-of-a1c', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'hfpef-sglt2-regardless-of-a1c', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-082", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210083', 'usmle-step-2', 'endocrinology',
  $sc$A 70-year-old man who works as a park groundskeeper is seen in the nephrology-glucose clinic whose fall leaf season just ended. The nephrology note documents albuminuria. Metformin was started nine years ago for hyperglycemia and is still his only glucose drug. He feels well raking on flat paths. A covering clinician said no new drug is needed when the A1C is already at the common goal. Temperature is 36.5°C, pulse is 66/min, respirations are 14/min, and blood pressure is 138/80 mm Hg. eGFR is 46 mL/min/1.73 m2. Hemoglobin A1C is 6.5%. Creatinine is 1.5 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate addition?$qu$,
  $op${"options": ["Nothing, because the A1C is already 6.5%", "A DPP-4 inhibitor as the preferred kidney drug", "An SGLT2 inhibitor or a GLP-1 receptor agonist with benefit", "Insulin, because an eGFR of 46 requires insulin first before the patient leaves", "Stop metformin, because the eGFR is under 60"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "ckd-egfr-46-sglt2-or-glp1", "taskCategory": "pharmacotherapy"}$op$,
  $ky$An SGLT2 inhibitor or a GLP-1 receptor agonist with benefit$ky$,
  $ex$For CKD with an eGFR of 20 to 60 and/or albuminuria, use an SGLT2 inhibitor or a GLP-1 receptor agonist with demonstrated benefit, regardless of the A1C. The eGFR is 46 and albuminuria is documented. The A1C is 6.5%. "Nothing, because the A1C is already 6.5%" is not the best choice because The kidney recommendation is regardless of the A1C. An A1C of 6.5% does not cancel it. "A DPP-4 inhibitor as the preferred kidney drug" is not the best choice because A DPP-4 inhibitor is not the class named for CKD with an eGFR of 20 to 60 or albuminuria. "Insulin, because an eGFR of 46 requires insulin first before the patient leaves" is not the best choice because An eGFR of 46 is not a reason to make insulin the first addition. Insulin is for marked hyperglycemia, an A1C above 10%, or catabolic features, none of which are present. "Stop metformin, because the eGFR is under 60" is not the best choice because Metformin may be used at an eGFR of 46, which is above 30 and above the 30 to 45 band where risk rises. Stopping it is not required by an eGFR under 60.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '3c05484c53335a59a7588de6a9332ab800b238c399ec465c8cd0fe4e8822cfff', false, NOW(), NOW(), 3,
  'ckd-egfr-46-sglt2-or-glp1', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ckd-egfr-46-sglt2-or-glp1', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-083", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210084', 'usmle-step-2', 'endocrinology',
  $sc$A 68-year-old woman who works as a greenhouse manager is seen in the kidney-follow-up office who has taken an SGLT2 inhibitor for a year. Metformin was stopped previously. She still grows seedlings and has had no vomiting or deep breathing. The A1C has drifted up since the kidney number fell. She asks why the pill seems to be doing less for the glucose even though she has not missed doses. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 134/76 mm Hg. eGFR is 40 mL/min/1.73 m2. Hemoglobin A1C is 8.4%. A fasting plasma glucose is 168 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The SGLT2 glucose effect rises once the eGFR falls under 45", "An eGFR of 40 means the drug must be stopped for glucose reasons alone before the patient leaves", "SGLT2 inhibitors lose glucose effect only under an eGFR of 20", "Glucose lowering from the SGLT2 inhibitor is reduced below an eGFR of 45", "An A1C of 8.4% proves that the eGFR reading is wrong"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "sglt2-glucose-effect-falls-below-45", "taskCategory": "interpretation"}$op$,
  $ky$Glucose lowering from the SGLT2 inhibitor is reduced below an eGFR of 45$ky$,
  $ex$The glycemic effect of SGLT2 inhibitors falls when the eGFR is under 45. This eGFR is 40, and the A1C is 8.4%. When the eGFR is under 30, a GLP-1 receptor agonist is preferred for glucose lowering. That second line is not yet the situation at 40. "The SGLT2 glucose effect rises once the eGFR falls under 45" is not the best choice because The glucose effect falls, rather than rises, below an eGFR of 45. "An eGFR of 40 means the drug must be stopped for glucose reasons alone before the patient leaves" is not the best choice because The guidance describes a smaller glucose effect under 45. It does not say the drug must be stopped for glucose reasons at an eGFR of 40. The prefer-a-GLP-1 statement for glucose lowering is for an eGFR under 30. "SGLT2 inhibitors lose glucose effect only under an eGFR of 20" is not the best choice because The fall in glycemic effect is described under 45, not only under 20. An eGFR of 20 to 60 is also the CKD range in which an SGLT2 inhibitor or a GLP-1 receptor agonist with benefit is considered. "An A1C of 8.4% proves that the eGFR reading is wrong" is not the best choice because The A1C does not invalidate the eGFR. Both numbers can be true: the eGFR is 40 and the A1C is 8.4%.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'e3af4e41e1c8318aa8f5bb72bb00adc07d8b2a160fcb01b0fdd7607cd6ae6507', false, NOW(), NOW(), 4,
  'sglt2-glucose-effect-falls-below-45', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'sglt2-glucose-effect-falls-below-45', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-084", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210085', 'usmle-step-2', 'endocrinology',
  $sc$A 76-year-old man who works as a watch repairer is seen in the bench-side internal medicine office with a rising A1C and a low kidney number. He has never used a GLP-1 receptor agonist. Weight is unchanged over six months, and a urine check shows no ketones. He is not nauseated. Metformin is not on the list. Loupe work continues most afternoons. A fasting sample was drawn after 11 hours. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 140/78 mm Hg. eGFR is 27 mL/min/1.73 m2. Hemoglobin A1C is 8.8%. Fasting plasma glucose is 188 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate choice for glucose lowering?$qu$,
  $op${"options": ["Start metformin, because the eGFR is still above 20", "An SGLT2 inhibitor as the stronger glucose drug under an eGFR of 30", "Insulin, because every A1C above 8% requires insulin", "A DPP-4 inhibitor combined with a new GLP-1 receptor agonist", "A GLP-1 receptor agonist, preferred at this eGFR"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "egfr-27-prefer-glp1-for-glucose", "taskCategory": "pharmacotherapy"}$op$,
  $ky$A GLP-1 receptor agonist, preferred at this eGFR$ky$,
  $ex$When the eGFR is under 30, a GLP-1 receptor agonist is preferred for glucose lowering. The eGFR is 27, the A1C is 8.8%, and the fasting glucose is 188 mg/dL. There is no weight loss or ketosis, the glucose is under 300 mg/dL, and the A1C is not above 10%, so insulin is not required by those triggers. The glycemic effect of an SGLT2 inhibitor is already reduced under an eGFR of 45. "Start metformin, because the eGFR is still above 20" is not the best choice because Metformin is not used when the eGFR is under 30. This eGFR is 27, so the fact that it is above 20 does not restore metformin. "An SGLT2 inhibitor as the stronger glucose drug under an eGFR of 30" is not the best choice because SGLT2 inhibitors are not the preferred glucose-lowering choice under an eGFR of 30. Their glycemic effect falls under 45, and a GLP-1 receptor agonist is preferred for glucose lowering under 30. "Insulin, because every A1C above 8% requires insulin" is not the best choice because An A1C above 8% is not the insulin trigger. Insulin is started when glucose is at least 300 mg/dL, the A1C is above 10%, or catabolic features are present. "A DPP-4 inhibitor combined with a new GLP-1 receptor agonist" is not the best choice because A DPP-4 inhibitor should not be combined with a GLP-1 receptor agonist.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'b18c45518fc2c44e97382231f64cff4ad36af54a228a25bfdc53d007c0b55af9', false, NOW(), NOW(), 5,
  'egfr-27-prefer-glp1-for-glucose', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'egfr-27-prefer-glp1-for-glucose', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-085", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210086', 'usmle-step-2', 'endocrinology',
  $sc$A 59-year-old woman who works as a court clerk is seen in the downtown internal medicine office already taking sitagliptin, with a request to add a GLP-1 receptor agonist. Metformin is also on the list, and the eGFR is comfortable. Weight is stable, ketones are negative, and she has had no vomiting. She files briefs in the afternoon and wants a plan before the next docket week. No heart-failure diagnosis is in the chart. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 126/76 mm Hg. Hemoglobin A1C is 8.2%. Fasting plasma glucose is 154 mg/dL. eGFR is 81 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Do not combine the DPP-4 inhibitor with a GLP-1 receptor agonist", "Add the GLP-1 receptor agonist and continue sitagliptin", "Add the GLP-1 receptor agonist only if the A1C exceeds 10%", "Stop metformin before any incretin drug is discussed", "Start insulin tonight because the fasting glucose is 154 mg/dL at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "do-not-combine-dpp4-and-glp1", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Do not combine the DPP-4 inhibitor with a GLP-1 receptor agonist$ky$,
  $ex$A DPP-4 inhibitor should not be combined with a GLP-1 receptor agonist. She is taking sitagliptin, a DPP-4 inhibitor, and the A1C is 8.2%. The fasting glucose is 154 mg/dL, under 300 mg/dL, and there are no catabolic features. "Add the GLP-1 receptor agonist and continue sitagliptin" is not the best choice because Adding a GLP-1 receptor agonist on top of ongoing sitagliptin is the combination this guidance says not to use. "Add the GLP-1 receptor agonist only if the A1C exceeds 10%" is not the best choice because The prohibition on combining the two classes is not limited to an A1C above 10%. An A1C above 10% is an insulin trigger, and this A1C is 8.2%. "Stop metformin before any incretin drug is discussed" is not the best choice because The eGFR of 81 allows metformin to continue. Stopping it is not required before a decision about incretin drugs. "Start insulin tonight because the fasting glucose is 154 mg/dL at the present visit" is not the best choice because A fasting glucose of 154 mg/dL is not the insulin threshold of 300 mg/dL or higher. The A1C is not above 10%.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'a50b67106de0bb71834e9db960de85b40558e7ac9b0ac1cb370450a2f10ff0ec', false, NOW(), NOW(), 3,
  'do-not-combine-dpp4-and-glp1', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'do-not-combine-dpp4-and-glp1', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-086", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210087', 'usmle-step-2', 'endocrinology',
  $sc$A 54-year-old man who works as a sound engineer is seen in the studio primary care office whose A1C has risen on metformin alone. Weight is the same as at the last two visits, and a urine dip shows no ketones. He is not on a DPP-4 inhibitor. Late-night mixes have not come with vomiting or deep breathing. He asks whether to start insulin this week or try another non-insulin option. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 124/78 mm Hg. Hemoglobin A1C is 8.3%. A random plasma glucose after lunch is 176 mg/dL. eGFR is 88 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate medication choice?$qu$,
  $op${"options": ["Insulin now, because every A1C above 8% is an insulin start", "A GLP-1 receptor agonist in preference to insulin", "A GLP-1 receptor agonist plus a DPP-4 inhibitor together", "Add an SGLT2 inhibitor as though this were insulin-only disease", "No change, because 176 mg/dL is already under 200 mg/dL"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "prefer-glp1-over-insulin-no-deficiency", "taskCategory": "pharmacotherapy"}$op$,
  $ky$A GLP-1 receptor agonist in preference to insulin$ky$,
  $ex$If there is no insulin deficiency, a GLP-1 receptor agonist is preferred to insulin. The A1C is 8.3%, the glucose is 176 mg/dL, weight is stable, and ketones are negative. Those findings do not meet the insulin triggers of glucose at or above 300 mg/dL, A1C above 10%, or catabolic features. "Insulin now, because every A1C above 8% is an insulin start" is not the best choice because An A1C above 8% is not the insulin rule. Insulin is started for glucose of at least 300 mg/dL, an A1C above 10%, or catabolic features. "A GLP-1 receptor agonist plus a DPP-4 inhibitor together" is not the best choice because A DPP-4 inhibitor and a GLP-1 receptor agonist should not be combined. "Add an SGLT2 inhibitor as though this were insulin-only disease" is not the best choice because SGLT2 inhibitors increase DKA risk when added for glucose control in type 1 disease. This history is longstanding metformin use, not insulin-dependent disease from childhood, and that warning is not the reason to skip a GLP-1 receptor agonist here. "No change, because 176 mg/dL is already under 200 mg/dL" is not the best choice because A glucose under 200 mg/dL does not mean the A1C of 8.3% needs no change. The common nonpregnant A1C goal is under 7%.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '6eb19cf3ebdb5bec61c4d978b5d9e7ff300526699d8783a7f1489a9e0f3d759a', false, NOW(), NOW(), 3,
  'prefer-glp1-over-insulin-no-deficiency', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'prefer-glp1-over-insulin-no-deficiency', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-087", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210088', 'usmle-step-2', 'endocrinology',
  $sc$A 46-year-old man who works as a roofer is seen in the walk-in clinic drinking water constantly between shingle bundles. He has been on metformin only. Weight is down 2 kg, which he attributes to skipping lunch, and urine ketones are negative. He is not confused. The crew sent him in because he kept leaving the roof to urinate. Temperature is 36.8°C, pulse is 96/min, respirations are 16/min, and blood pressure is 138/84 mm Hg. Plasma glucose is 328 mg/dL. Hemoglobin A1C is 9.4%. eGFR is 90 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate medication plan?$qu$,
  $op${"options": ["Stay on metformin alone because ketones are negative", "Add a DPP-4 inhibitor and defer any insulin start", "Start insulin because the glucose is at or above 300 mg/dL", "Wait for the A1C to exceed 10% before any insulin", "Cut carbohydrate to 50 g per day instead of starting insulin"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "start-insulin-glucose-at-least-300", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start insulin because the glucose is at or above 300 mg/dL$ky$,
  $ex$Start insulin when glucose is at least 300 mg/dL, when the A1C is above 10%, or when catabolic features such as weight loss and ketosis are present. This glucose is 328 mg/dL. "Stay on metformin alone because ketones are negative" is not the best choice because Negative ketones do not cancel the glucose threshold. Insulin is started when glucose is at least 300 mg/dL. "Add a DPP-4 inhibitor and defer any insulin start" is not the best choice because A DPP-4 inhibitor does not replace insulin when the glucose is at or above 300 mg/dL. "Wait for the A1C to exceed 10% before any insulin" is not the best choice because An A1C above 10% is one insulin trigger. Glucose of at least 300 mg/dL is another, and it is already met at 328 mg/dL even though the A1C is 9.4%. "Cut carbohydrate to 50 g per day instead of starting insulin" is not the best choice because A carbohydrate cut to 50 g is not the substitute for insulin at this glucose. The pregnancy carbohydrate minimum is a different setting and is not a reason to withhold insulin here.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '0d8671a92427fb8ccf88c8478fecd73380eba31d0d458ed35a3634fc3c84b632', false, NOW(), NOW(), 2,
  'start-insulin-glucose-at-least-300', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'start-insulin-glucose-at-least-300', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-088", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210089', 'usmle-step-2', 'endocrinology',
  $sc$A 57-year-old woman who works as a florist buyer is seen in the market-morning clinic after a lab draw on her way to the flower auction. She has taken metformin for three years. Weight is stable, and she packed the same breakfast as last month. Urine ketones are negative. She is not short of breath. The auction starts at noon, and she wants to know what the A1C means for medication. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. Hemoglobin A1C is 10.8%. A random plasma glucose is 214 mg/dL. eGFR is 76 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate medication plan?$qu$,
  $op${"options": ["Defer insulin because the glucose is under 300 mg/dL", "Add a DPP-4 inhibitor as a full substitute for insulin", "The A1C goal of under 7% has already been met", "Start insulin because the A1C is above 10%", "No drug change until ketones appear"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "start-insulin-a1c-above-10", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start insulin because the A1C is above 10%$ky$,
  $ex$Insulin is started when the A1C is above 10%, even if other triggers are absent. This A1C is 10.8%. The random glucose is 214 mg/dL, which is under 300 mg/dL, and ketones are negative, but the A1C trigger is already met. "Defer insulin because the glucose is under 300 mg/dL" is not the best choice because Glucose of at least 300 mg/dL is one trigger. It is not required when the A1C is already above 10%. "Add a DPP-4 inhibitor as a full substitute for insulin" is not the best choice because A DPP-4 inhibitor does not replace insulin when the A1C is above 10%. "The A1C goal of under 7% has already been met" is not the best choice because 10.8% is not under 7%. The common nonpregnant goal is under 7%, and an A1C above 10% is a reason to start insulin. "No drug change until ketones appear" is not the best choice because Ketosis is one catabolic feature that can prompt insulin. It is not required when the A1C is above 10%.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '50df07a9ea0fde538e58261023f243430e70c133a414efc97bf8c28edbd1574a', false, NOW(), NOW(), 2,
  'start-insulin-a1c-above-10', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'start-insulin-a1c-above-10', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-089", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210090', 'usmle-step-2', 'endocrinology',
  $sc$A 39-year-old man who works as a trail-crew lead is seen in the base-camp clinic who has been losing belt holes over the past month. He has been on metformin. The scale at the ranger station shows an 8 kg loss, and he has not been dieting. A urine cup before the hike shows ketones. He is tired but alert and is not vomiting. Thirst has increased on the trail. Temperature is 36.9°C, pulse is 100/min, respirations are 18/min, and blood pressure is 118/74 mm Hg. Plasma glucose is 246 mg/dL. Hemoglobin A1C is 9.2%. eGFR is 94 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate medication plan?$qu$,
  $op${"options": ["Continue metformin alone because the glucose is under 300 mg/dL", "Wait for insulin, because the A1C is not above 10%", "Add a DPP-4 inhibitor and do not act on the ketones", "An SGLT2 inhibitor is required before insulin in this setting", "Start insulin now because of the weight loss and ketosis"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "start-insulin-for-catabolic-features", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start insulin now because of the weight loss and ketosis$ky$,
  $ex$Insulin is started when catabolic features are present, including weight loss and ketosis, as well as when glucose is at least 300 mg/dL or the A1C is above 10%. He has lost 8 kg and has urine ketones. The glucose is 246 mg/dL and the A1C is 9.2%, so those two numeric triggers are not the ones firing. "Continue metformin alone because the glucose is under 300 mg/dL" is not the best choice because A glucose under 300 mg/dL does not cancel catabolic features. The glucose is 246 mg/dL, and weight loss with ketosis is already an insulin trigger. "Wait for insulin, because the A1C is not above 10%" is not the best choice because An A1C above 10% is a separate trigger. Catabolic features are enough on their own, and the A1C is 9.2%. "Add a DPP-4 inhibitor and do not act on the ketones" is not the best choice because A DPP-4 inhibitor does not take the place of insulin when ketosis and weight loss are present. "An SGLT2 inhibitor is required before insulin in this setting" is not the best choice because An SGLT2 inhibitor is not a required step before insulin in catabolic illness. In type 1 disease, adding one for glucose control raises DKA risk, which is a further reason not to put it ahead of insulin here.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '6b2baff6ec279b108606e86bf5b7585e304bf463f3c690e128c2a8a87aa9625f', false, NOW(), NOW(), 4,
  'start-insulin-for-catabolic-features', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'start-insulin-for-catabolic-features', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-090", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210091', 'usmle-step-2', 'endocrinology',
  $sc$A 27-year-old man who works as a bike mechanic is seen in the youth-transition clinic who has used insulin since age 8. Childhood records describe ketoacidosis at the start of insulin, and he has never used oral glucose-lowering pills as his sole treatment. A friend suggested an SGLT2 inhibitor to flatten the afternoon readings. He is eating normally, and today's urine ketones are negative. Pump sites are healthy. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Hemoglobin A1C is 7.9%. A fingerstick glucose is 186 mg/dL. eGFR is 112 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Do not add an SGLT2 inhibitor for glucose control", "Add the SGLT2 inhibitor because the eGFR is above 90", "Add the SGLT2 inhibitor because ketones today are negative", "Stop insulin and switch entirely to the SGLT2 inhibitor", "The A1C of 7.9% requires an SGLT2 inhibitor before any other change"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "do-not-add-sglt2-in-insulin-deficient-disease", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Do not add an SGLT2 inhibitor for glucose control$ky$,
  $ex$SGLT2 inhibitors increase DKA risk in type 1 diabetes and should not be added for glucose control. Insulin since age 8, after childhood ketoacidosis, is that setting. The A1C is 7.9% and the glucose is 186 mg/dL. "Add the SGLT2 inhibitor because the eGFR is above 90" is not the best choice because A high eGFR does not make an SGLT2 inhibitor safe for glucose control in this setting. The concern is DKA risk, not the eGFR floor used for other indications. "Add the SGLT2 inhibitor because ketones today are negative" is not the best choice because A negative ketone check today does not remove the increased DKA risk of adding an SGLT2 inhibitor for glucose control. "Stop insulin and switch entirely to the SGLT2 inhibitor" is not the best choice because Stopping insulin in this history is not supported. The warning is specifically against adding an SGLT2 inhibitor for glucose control. "The A1C of 7.9% requires an SGLT2 inhibitor before any other change" is not the best choice because An A1C of 7.9% is above the common goal of under 7%, but that gap is not a reason to add an SGLT2 inhibitor for glucose control in this insulin-deficient history.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '9ebe05115a778568172a69d37b0985f9e8dbf4d32485cbe75b4b6c784a14e5f9', false, NOW(), NOW(), 4,
  'do-not-add-sglt2-in-insulin-deficient-disease', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 9: Pharmacologic Approaches to Glycemic Treatment.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'do-not-add-sglt2-in-insulin-deficient-disease', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-091", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S181/157569/9-Pharmacologic-Approaches-to-Glycemic-Treatment", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210092', 'usmle-step-2', 'endocrinology',
  $sc$A 51-year-old woman who works as a grant accountant is seen in the primary care office with no sweating episodes on her current metformin dose. She walks to the office from the bus and feels well. The lowest home glucose this month was 98 mg/dL. She is not pregnant. A refill was sent last week, and she wants to know whether the A1C needs to be lower. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. Hemoglobin A1C is 7.8%. eGFR is 84 mL/min/1.73 m2. A fasting plasma glucose is 148 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["7.8% meets the usual goal because the goal is under 8%", "The A1C goal for many nonpregnant adults is under 7%", "The goal is under 6.5% for most nonpregnant adults", "A fasting glucose of 148 mg/dL means the A1C goal is waived", "No A1C goal applies once metformin has been started"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "a1c-above-nonpregnant-goal-7", "taskCategory": "interpretation"}$op$,
  $ky$The A1C goal for many nonpregnant adults is under 7%$ky$,
  $ex$The A1C goal is under 7% for many nonpregnant adults without significant hypoglycemia. This A1C is 7.8%, and the lowest recent home glucose is 98 mg/dL. "7.8% meets the usual goal because the goal is under 8%" is not the best choice because The usual goal is not under 8%. For many nonpregnant adults without significant hypoglycemia it is under 7%. "The goal is under 6.5% for most nonpregnant adults" is not the best choice because Under 6.5% is a preconception goal when it can be reached safely, not the usual goal for many nonpregnant adults. "A fasting glucose of 148 mg/dL means the A1C goal is waived" is not the best choice because A fasting glucose does not waive the A1C goal. The goal remains under 7% for many nonpregnant adults without significant hypoglycemia. "No A1C goal applies once metformin has been started" is not the best choice because Metformin use does not erase the A1C goal. The goal is under 7% for many nonpregnant adults.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '140e2cf94d68a4e987cd433acbc75683b567a69cfe148a56e9ed8e3e8091929e', false, NOW(), NOW(), 1,
  'a1c-above-nonpregnant-goal-7', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'a1c-above-nonpregnant-goal-7', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-092", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210093', 'usmle-step-2', 'endocrinology',
  $sc$A 48-year-old man who works as a piano tuner is seen in the home-visit primary care slot between two house calls, with a printed A1C. He has had no shaking or sweating on his current regimen. The lowest meter value this month was 102 mg/dL. He is not pregnant and is not preparing for a pregnancy. Tuning forks are in the bag on the chair. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. Hemoglobin A1C is 6.6%. A fasting plasma glucose is 112 mg/dL. eGFR is 91 mL/min/1.73 m2.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["6.6% is above the usual nonpregnant goal", "The usual goal is under 6%, so 6.6% misses it", "6.6% is already under the 7% goal", "112 mg/dL fasting means the A1C cannot be at goal", "An A1C under 7.5% is the stated usual goal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "a1c-6-6-meets-goal-under-7", "taskCategory": "interpretation"}$op$,
  $ky$6.6% is already under the 7% goal$ky$,
  $ex$The A1C goal is under 7% for many nonpregnant adults without significant hypoglycemia. This result is 6.6%, and he has not had significant hypoglycemia. "6.6% is above the usual nonpregnant goal" is not the best choice because 6.6% is under 7%, so it is not above the usual goal for many nonpregnant adults. "The usual goal is under 6%, so 6.6% misses it" is not the best choice because Under 6% is the pregnancy A1C goal when significant hypoglycemia is absent. It is not the usual nonpregnant goal. "112 mg/dL fasting means the A1C cannot be at goal" is not the best choice because The fasting glucose and the A1C are separate results. An A1C of 6.6% can meet the under-7% goal while a fasting glucose is interpreted on its own scale. "An A1C under 7.5% is the stated usual goal" is not the best choice because The stated goal for many nonpregnant adults is under 7%, not under 7.5%.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '960329f324ea9a7f250b07da7f3307c81aa077cf9945cb292d451e10f2cb1c54', false, NOW(), NOW(), 1,
  'a1c-6-6-meets-goal-under-7', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'a1c-6-6-meets-goal-under-7', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-093", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210094', 'usmle-step-2', 'endocrinology',
  $sc$A 34-year-old woman who works as a flight dispatcher is seen in the airport clinic sweaty at the console but awake and answering questions. She took her usual morning insulin and then skipped breakfast during a weather hold. A coworker brought her to the clinic. She is not confused and can swallow. The shift log shows the episode started 10 minutes ago. Temperature is 36.4°C, pulse is 104/min, respirations are 18/min, and blood pressure is 128/76 mm Hg. Capillary glucose is 63 mg/dL. A repeat on a second meter is 61 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["63 mg/dL is level 2 because it is under 70 mg/dL", "Level 1 hypoglycemia begins only at or above 70 mg/dL", "61 mg/dL on the second meter cancels the first result", "A glucose of 63 mg/dL is level 1 hypoglycemia", "A glucose of 63 mg/dL is too high to call hypoglycemia"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "glucose-63-is-level-1", "taskCategory": "interpretation"}$op$,
  $ky$A glucose of 63 mg/dL is level 1 hypoglycemia$ky$,
  $ex$Level 1 hypoglycemia is a glucose under 70 mg/dL and at or above 54 mg/dL. This reading is 63 mg/dL, and the repeat is 61 mg/dL. Level 2 is under 54 mg/dL. "63 mg/dL is level 2 because it is under 70 mg/dL" is not the best choice because Under 70 mg/dL is not, by itself, level 2. Level 2 is under 54 mg/dL. A value of 63 mg/dL is still at or above 54, so it is level 1. "Level 1 hypoglycemia begins only at or above 70 mg/dL" is not the best choice because Level 1 is under 70 mg/dL, not at or above 70. Values of 70 mg/dL or higher are outside level 1. "61 mg/dL on the second meter cancels the first result" is not the best choice because A second meter reading of 61 mg/dL agrees that the glucose is in the level 1 span. It does not erase the first result. "A glucose of 63 mg/dL is too high to call hypoglycemia" is not the best choice because 63 mg/dL is under the 70 mg/dL line, so it is hypoglycemia, specifically level 1 because it is still at or above 54 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '0dbcb5d6d9c3cc61d96bb856b5e1df66269b3b287bc7e0ec18211bad1cabd5a7', false, NOW(), NOW(), 1,
  'glucose-63-is-level-1', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'glucose-63-is-level-1', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-094", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210095', 'usmle-step-2', 'endocrinology',
  $sc$A 22-year-old man who works as a college rower is seen in the boathouse training room shaky after a long piece on the water. He uses insulin and ate only a small snack before launching. He is sitting up, knows the date, and can hold a cup. The coach has glucose tablets in the launch bag but has not opened them. No seizure activity was seen. Temperature is 36.2°C, pulse is 112/min, respirations are 20/min, and blood pressure is 108/64 mm Hg. Capillary glucose is 49 mg/dL. A serum sample sent to the lab is pending.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["49 mg/dL is level 1 because it is under 70 mg/dL", "Level 2 requires a glucose reading under 40 mg/dL", "A pending serum sample means the meter value cannot be leveled", "49 mg/dL is above the level 2 line of 54 mg/dL", "A glucose of 49 mg/dL is level 2 hypoglycemia"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "glucose-49-is-level-2", "taskCategory": "interpretation"}$op$,
  $ky$A glucose of 49 mg/dL is level 2 hypoglycemia$ky$,
  $ex$Level 2 hypoglycemia is a glucose under 54 mg/dL. This reading is 49 mg/dL. Level 1 is under 70 and at or above 54 mg/dL. "49 mg/dL is level 1 because it is under 70 mg/dL" is not the best choice because Under 70 mg/dL includes both levels. Level 1 also requires the glucose to be at or above 54 mg/dL. 49 mg/dL is under 54. "Level 2 requires a glucose reading under 40 mg/dL" is not the best choice because No level 2 threshold of 40 mg/dL is stated. Level 2 is under 54 mg/dL. "A pending serum sample means the meter value cannot be leveled" is not the best choice because A capillary glucose of 49 mg/dL can be classified while a serum sample is pending. The level is defined by the glucose value. "49 mg/dL is above the level 2 line of 54 mg/dL" is not the best choice because 49 mg/dL is under 54 mg/dL, not above it. That is why it is level 2 rather than level 1.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'ddfccf0aa20e50f277b8bc55288d87231ef3d7373a19649119b29d8c00f99412', false, NOW(), NOW(), 2,
  'glucose-49-is-level-2', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'glucose-49-is-level-2', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-095", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210096', 'usmle-step-2', 'endocrinology',
  $sc$A 41-year-old woman who works as a night pharmacist is seen in the hospital staff health office alert after an overnight shift with a missed meal. She uses insulin and can state her name, the unit, and the date. A colleague wants the episode charted as level 2 because the number looks severe. She has not lost consciousness. The cafeteria is closed until dawn. Temperature is 36.3°C, pulse is 98/min, respirations are 16/min, and blood pressure is 116/70 mm Hg. Capillary glucose is 54 mg/dL. A second drop from another finger is also 54 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A glucose of 54 mg/dL is level 1, not level 2", "54 mg/dL is level 2 because level 2 includes 54", "54 mg/dL is normal because level 1 starts under 54", "Two identical readings of 54 mg/dL cancel the classification", "Level 1 stops at 60 mg/dL, so 54 is unclassified"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "glucose-54-is-level-1-not-level-2", "taskCategory": "interpretation"}$op$,
  $ky$A glucose of 54 mg/dL is level 1, not level 2$ky$,
  $ex$Level 1 hypoglycemia is a glucose under 70 mg/dL and at or above 54 mg/dL. Level 2 is under 54 mg/dL. This glucose is 54 mg/dL, so it is level 1. "54 mg/dL is level 2 because level 2 includes 54" is not the best choice because Level 2 is under 54 mg/dL. A value of exactly 54 mg/dL is not under 54. "54 mg/dL is normal because level 1 starts under 54" is not the best choice because Level 1 is under 70 mg/dL and at or above 54 mg/dL. It does not start under 54. A reading of 54 is inside level 1. "Two identical readings of 54 mg/dL cancel the classification" is not the best choice because Agreement between two drops supports the value. It does not erase the level. "Level 1 stops at 60 mg/dL, so 54 is unclassified" is not the best choice because No rule sets the top of level 1 at 60 mg/dL. The top boundary is under 70 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'ada00b8683c25d2b7b06efe4799b60d9ae0d47a767618c55c111a9f4cbbf348a', false, NOW(), NOW(), 4,
  'glucose-54-is-level-1-not-level-2', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'glucose-54-is-level-1-not-level-2', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-096", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210097', 'usmle-step-2', 'endocrinology',
  $sc$A 36-year-old man who works as a subway operator is seen in the station clinic sweaty but speaking in full sentences after a delayed meal. He uses insulin. A partner offers a cheese stick from a lunch box and a packet of glucose tablets from the first-aid kit. He can swallow and is not confused. The train is held in the yard. Temperature is 36.4°C, pulse is 108/min, respirations are 18/min, and blood pressure is 130/78 mm Hg. Capillary glucose is 58 mg/dL. He last ate seven hours ago.$sc$,
  $qu$Which of the following is the most appropriate treatment?$qu$,
  $op${"options": ["The cheese stick, because fat prolongs the recovery", "Glucose tablets or other carbohydrate that contains glucose", "Black coffee, because he needs to stay awake for the next trip", "A diet soda, because any sweet taste is enough", "Nothing by mouth until the glucose falls under 54 mg/dL"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "conscious-low-give-glucose", "taskCategory": "clinical-intervention"}$op$,
  $ky$Glucose tablets or other carbohydrate that contains glucose$ky$,
  $ex$For conscious hypoglycemia, give glucose or carbohydrate that contains glucose. This glucose is 58 mg/dL, which is level 1 because it is under 70 and at or above 54. Recheck in 15 minutes and repeat if it is still low. A high-fat or high-protein food is not the treatment. "The cheese stick, because fat prolongs the recovery" is not the best choice because Cheese is a high-fat, high-protein food. Conscious hypoglycemia is treated with glucose or carbohydrate that contains glucose, not with a high-fat or high-protein food. "Black coffee, because he needs to stay awake for the next trip" is not the best choice because Black coffee does not provide glucose. The treatment is glucose or carbohydrate that contains glucose. "A diet soda, because any sweet taste is enough" is not the best choice because A diet soda sweetened without glucose does not provide the carbohydrate the treatment calls for. "Nothing by mouth until the glucose falls under 54 mg/dL" is not the best choice because Treatment is not delayed until the glucose is under 54 mg/dL. Level 1, which includes 58 mg/dL, is already hypoglycemia.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', 'c6d9cb9970531586dbe33fb17036ec2707a8e39bfd0392dffb734a2165093512', false, NOW(), NOW(), 2,
  'conscious-low-give-glucose', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'conscious-low-give-glucose', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-097", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": true, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210098', 'usmle-step-2', 'endocrinology',
  $sc$A 29-year-old woman who works as a ski patroller is seen in the first-aid hut awake and following commands after a long uphill tow. She uses insulin and can say her name. A partner wants to feed her a plate of eggs and bacon because the number looks severe, and another offers glucose gel. She is sitting, not seizing, and can swallow. Wind is rattling the hut door. Temperature is 36.1°C, pulse is 114/min, respirations are 18/min, and blood pressure is 104/66 mm Hg. Capillary glucose is 46 mg/dL. Oxygen saturation on the hut pulse oximeter is 97% on room air.$sc$,
  $qu$Which of the following is the most appropriate treatment?$qu$,
  $op${"options": ["Eggs and bacon, because level 2 is too severe for oral glucose", "A protein bar, because protein treats a glucose under 54 mg/dL", "Give oral glucose, because she is awake and can swallow", "Nothing by mouth, because 46 mg/dL always means she cannot swallow", "Cheese and crackers, because fat is the preferred rescue"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "level-2-conscious-still-oral-glucose", "taskCategory": "clinical-intervention"}$op$,
  $ky$Give oral glucose, because she is awake and can swallow$ky$,
  $ex$Conscious hypoglycemia is treated with glucose or carbohydrate that contains glucose, including when the glucose is under 54 mg/dL. This value is 46 mg/dL and she can swallow. Recheck in 15 minutes. A high-fat or high-protein meal is not the substitute. "Eggs and bacon, because level 2 is too severe for oral glucose" is not the best choice because Level 2 does not switch a conscious person away from glucose. The food rule is the same: glucose or carbohydrate that contains glucose, not a high-fat meal. "A protein bar, because protein treats a glucose under 54 mg/dL" is not the best choice because A protein bar is a high-protein food. It is not the treatment for conscious hypoglycemia. "Nothing by mouth, because 46 mg/dL always means she cannot swallow" is not the best choice because She is awake, following commands, and able to swallow. The reading of 46 mg/dL, which is level 2 because it is under 54, does not by itself mean oral glucose is forbidden. "Cheese and crackers, because fat is the preferred rescue" is not the best choice because Cheese and crackers are a high-fat choice. High-fat food is not the treatment.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', '511814f556574b281679063f23c7b83701d1fef39a4ed41f9cb73e8a61042b6f', false, NOW(), NOW(), 3,
  'level-2-conscious-still-oral-glucose', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'level-2-conscious-still-oral-glucose', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-098", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": true, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210099', 'usmle-step-2', 'endocrinology',
  $sc$A 45-year-old man who works as a mail sorter is seen in the processing-plant clinic 15 minutes after he chewed glucose tablets. The first capillary glucose was 58 mg/dL, and he was awake. He swallowed the tablets without trouble and sat in the clinic chair. He can still speak clearly. The belt outside is noisy, and he wants to return to the line. Temperature is 36.5°C, pulse is 96/min, respirations are 16/min, and blood pressure is 122/74 mm Hg. The repeat capillary glucose, timed 15 minutes after the tablets, is 61 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Send him back to the line because 15 minutes have passed during today's visit", "Wait another 2 hours before any further carbohydrate", "Give a cheese sandwich now instead of more glucose", "Repeat the glucose treatment because 61 mg/dL is still under 70", "Stop, because 61 mg/dL is above the level 2 line of 54"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "recheck-15-min-still-low-repeat", "taskCategory": "clinical-intervention"}$op$,
  $ky$Repeat the glucose treatment because 61 mg/dL is still under 70$ky$,
  $ex$After glucose is given for conscious hypoglycemia, recheck in 15 minutes and repeat the treatment if the glucose is still low. 61 mg/dL is under 70 and at or above 54, so it is still level 1. The first value was 58 mg/dL. "Send him back to the line because 15 minutes have passed during today's visit" is not the best choice because The passage of 15 minutes is the moment to recheck, not an automatic return to work while the glucose is still under 70 mg/dL. "Wait another 2 hours before any further carbohydrate" is not the best choice because The recheck interval is 15 minutes, not 2 hours, and a value that is still low is treated again. "Give a cheese sandwich now instead of more glucose" is not the best choice because A cheese sandwich is a high-fat, high-protein food. The repeat treatment is glucose or carbohydrate that contains glucose. "Stop, because 61 mg/dL is above the level 2 line of 54" is not the best choice because Being at or above 54 mg/dL means the value is level 1 rather than level 2. It does not mean treatment stops. Level 1 is still under 70 mg/dL.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', '208c379f24c77e4e83bba769abf588352d542d84af632f87e65fd99c1bd99e89', false, NOW(), NOW(), 3,
  'recheck-15-min-still-low-repeat', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'recheck-15-min-still-low-repeat', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-099", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": true, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210100', 'usmle-step-2', 'endocrinology',
  $sc$A 53-year-old woman who works as a reference librarian is seen in the staff-health room 15 minutes after glucose tablets for sweating at the desk. The initial capillary glucose was 60 mg/dL. She was conscious and chewed the tablets. She feels clear-headed and wants to know whether another dose is required before she returns to the reading room. No further symptoms are present. Temperature is 36.6°C, pulse is 84/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. The 15-minute capillary glucose is 96 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Repeat the glucose tablets because every low is treated twice", "Give a high-protein snack now because 96 mg/dL is level 2", "The recheck should have been at 60 minutes, so ignore this value", "96 mg/dL is under 70 mg/dL, so another dose is required", "Do not repeat the glucose treatment; 96 mg/dL is not low"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "recheck-15-min-recovered-do-not-repeat", "taskCategory": "clinical-intervention"}$op$,
  $ky$Do not repeat the glucose treatment; 96 mg/dL is not low$ky$,
  $ex$Recheck 15 minutes after glucose is given, and repeat only if the glucose is still low. 96 mg/dL is not under 70 mg/dL, so another dose of glucose is not indicated. The initial value was 60 mg/dL, which was level 1. "Repeat the glucose tablets because every low is treated twice" is not the best choice because A second dose is for a glucose that is still low at 15 minutes. It is not automatic after every episode. "Give a high-protein snack now because 96 mg/dL is level 2" is not the best choice because 96 mg/dL is not level 2. Level 2 is under 54 mg/dL. A high-protein snack is not the treatment even when the glucose is low. "The recheck should have been at 60 minutes, so ignore this value" is not the best choice because The recheck interval is 15 minutes. A value obtained then is the one that decides whether to repeat treatment. "96 mg/dL is under 70 mg/dL, so another dose is required" is not the best choice because 96 mg/dL is above 70 mg/dL, not under it.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', '8236b572c8167dfda842d9aa58b4784ed26fd9b9fbe0a4cff471ada303f2478b', false, NOW(), NOW(), 3,
  'recheck-15-min-recovered-do-not-repeat', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'recheck-15-min-recovered-do-not-repeat', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 1, "code": "S2N-100", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": true, "keyLetter": "E"}$gm$::jsonb,
  true
);
CREATE TABLE qbi_usmle_s2_new_20261121_b01_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    's2n202611210001',
    's2n202611210002',
    's2n202611210003',
    's2n202611210004',
    's2n202611210005',
    's2n202611210006',
    's2n202611210007',
    's2n202611210008',
    's2n202611210009',
    's2n202611210010',
    's2n202611210011',
    's2n202611210012',
    's2n202611210013',
    's2n202611210014',
    's2n202611210015',
    's2n202611210016',
    's2n202611210017',
    's2n202611210018',
    's2n202611210019',
    's2n202611210020',
    's2n202611210021',
    's2n202611210022',
    's2n202611210023',
    's2n202611210024',
    's2n202611210025',
    's2n202611210026',
    's2n202611210027',
    's2n202611210028',
    's2n202611210029',
    's2n202611210030',
    's2n202611210031',
    's2n202611210032',
    's2n202611210033',
    's2n202611210034',
    's2n202611210035',
    's2n202611210036',
    's2n202611210037',
    's2n202611210038',
    's2n202611210039',
    's2n202611210040',
    's2n202611210041',
    's2n202611210042',
    's2n202611210043',
    's2n202611210044',
    's2n202611210045',
    's2n202611210046',
    's2n202611210047',
    's2n202611210048',
    's2n202611210049',
    's2n202611210050',
    's2n202611210051',
    's2n202611210052',
    's2n202611210053',
    's2n202611210054',
    's2n202611210055',
    's2n202611210056',
    's2n202611210057',
    's2n202611210058',
    's2n202611210059',
    's2n202611210060',
    's2n202611210061',
    's2n202611210062',
    's2n202611210063',
    's2n202611210064',
    's2n202611210065',
    's2n202611210066',
    's2n202611210067',
    's2n202611210068',
    's2n202611210069',
    's2n202611210070',
    's2n202611210071',
    's2n202611210072',
    's2n202611210073',
    's2n202611210074',
    's2n202611210075',
    's2n202611210076',
    's2n202611210077',
    's2n202611210078',
    's2n202611210079',
    's2n202611210080',
    's2n202611210081',
    's2n202611210082',
    's2n202611210083',
    's2n202611210084',
    's2n202611210085',
    's2n202611210086',
    's2n202611210087',
    's2n202611210088',
    's2n202611210089',
    's2n202611210090',
    's2n202611210091',
    's2n202611210092',
    's2n202611210093',
    's2n202611210094',
    's2n202611210095',
    's2n202611210096',
    's2n202611210097',
    's2n202611210098',
    's2n202611210099',
    's2n202611210100'
);
COMMIT;

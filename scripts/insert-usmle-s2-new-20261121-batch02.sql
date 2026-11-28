-- Hidden Step 2 CK batch 2 of the 2026-11-21 set.
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
  's2n202611210101', 'usmle-step-2', 'endocrinology',
  $sc$A 38-year-old man who works as a survey crew chief is seen in the field trailer worried because a meter beeped after lunch. He uses insulin and feels like himself. He can read the staking notes aloud. A technician wants him to take glucose tablets anyway. He ate a full lunch 90 minutes ago and has not been sweaty or confused. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 126/76 mm Hg. Capillary glucose is 77 mg/dL. A second strip reads 79 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Do not treat this as hypoglycemia; 77 mg/dL is not under 70", "77 mg/dL is level 1, so give glucose tablets now", "77 mg/dL is level 2 because it is close to 70", "Any reading under 100 mg/dL is level 1 hypoglycemia in the office today", "The second strip of 79 mg/dL confirms level 2"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "glucose-77-not-hypoglycemia-treatment", "taskCategory": "interpretation"}$op$,
  $ky$Do not treat this as hypoglycemia; 77 mg/dL is not under 70$ky$,
  $ex$Level 1 hypoglycemia starts under 70 mg/dL. This glucose is 77 mg/dL, with a repeat of 79 mg/dL, so it is not level 1 or level 2 and does not call for hypoglycemia carbohydrate. "77 mg/dL is level 1, so give glucose tablets now" is not the best choice because Level 1 is under 70 mg/dL and at or above 54 mg/dL. 77 mg/dL is not under 70, so glucose tablets are not the hypoglycemia treatment. "77 mg/dL is level 2 because it is close to 70" is not the best choice because Level 2 is under 54 mg/dL. Being near 70 does not make a value level 2. "Any reading under 100 mg/dL is level 1 hypoglycemia in the office today" is not the best choice because No hypoglycemia level begins at 100 mg/dL. The level 1 line is under 70 mg/dL. "The second strip of 79 mg/dL confirms level 2" is not the best choice because 79 mg/dL is also not under 54 mg/dL, so it does not confirm level 2.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation", "nutrition"]$tg$,
  's2-new-20261121-hidden', '347f2dd6b1a17aa402a76574b493c713b08aba750ca289f639621faf490df64a', false, NOW(), NOW(), 3,
  'glucose-77-not-hypoglycemia-treatment', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'glucose-77-not-hypoglycemia-treatment', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-101", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": true, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210102', 'usmle-step-2', 'endocrinology',
  $sc$A 62-year-old woman who works as a box-office manager is seen in the theater clinic chair 15 minutes after she ate cheddar from the concession stand. The first capillary glucose was 60 mg/dL and she was fully awake. A coworker insisted cheese would fix it. She can still swallow and can recite the evening's seating chart. Curtain is in 40 minutes. Temperature is 36.6°C, pulse is 100/min, respirations are 16/min, and blood pressure is 134/80 mm Hg. The repeat capillary glucose is 59 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Give more cheese, because 15 minutes is too soon to judge", "Give glucose now; the cheese was the wrong treatment", "Offer a protein shake as the repeat treatment", "Wait 2 hours, because the cheese has not had time to work", "No further carbohydrate, because 59 mg/dL is above 54"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cheese-failed-now-give-glucose", "taskCategory": "clinical-intervention"}$op$,
  $ky$Give glucose now; the cheese was the wrong treatment$ky$,
  $ex$Conscious hypoglycemia is treated with glucose or carbohydrate that contains glucose, not a high-fat or high-protein food. The cheese failed: the glucose went from 60 mg/dL to 59 mg/dL at 15 minutes. Give glucose now and the value is still level 1 because 59 is under 70 and at or above 54. "Give more cheese, because 15 minutes is too soon to judge" is not the best choice because Cheese is a high-fat, high-protein food and was the wrong first treatment. More of it is not the correction. The 15-minute recheck is the right time to judge, and 59 mg/dL is still low. "Offer a protein shake as the repeat treatment" is not the best choice because A protein shake is a high-protein choice. Conscious hypoglycemia is treated with glucose or carbohydrate that contains glucose. "Wait 2 hours, because the cheese has not had time to work" is not the best choice because The recheck interval is 15 minutes, not 2 hours. The value is still under 70 mg/dL. "No further carbohydrate, because 59 mg/dL is above 54" is not the best choice because A glucose at or above 54 mg/dL can still be level 1. 59 mg/dL is under 70, so treatment is repeated, and it should be glucose rather than more cheese.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention", "nutrition"]$tg$,
  's2-new-20261121-hidden', '4c5579bdbbaa6a2f9d223e54aa1ae66b3cba8721ae93244bb507f9e9d3ee95ff', false, NOW(), NOW(), 3,
  'cheese-failed-now-give-glucose', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'cheese-failed-now-give-glucose', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-102", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": true, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210103', 'usmle-step-2', 'endocrinology',
  $sc$A 33-year-old man who works as a fitness-floor attendant is seen in the gym office asking you to confirm advice he gives clients who use insulin. He tells them a protein bar is the right fix for a shaky episode because protein 'holds.' A client is in the office now, awake, able to swallow, and sweaty after a spin class. The attendant wants a script he can repeat. Temperature is 36.5°C, pulse is 110/min, respirations are 18/min, and blood pressure is 128/76 mm Hg. The client's capillary glucose is 66 mg/dL. A second strip is 65 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate statement?$qu$,
  $op${"options": ["A protein bar is preferred because 66 mg/dL is level 2", "High-fat snacks work faster than glucose tablets", "Use glucose, not a high-protein bar, for this conscious low", "Treatment can wait until the glucose is under 54 mg/dL", "Any food is fine, including a bar that is mostly protein in the office today"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "protein-bar-is-wrong-low-treatment", "taskCategory": "communication"}$op$,
  $ky$Use glucose, not a high-protein bar, for this conscious low$ky$,
  $ex$For conscious hypoglycemia, give glucose or carbohydrate that contains glucose, not a high-protein or high-fat food. This glucose is 66 mg/dL, which is level 1. Recheck in 15 minutes and repeat if it is still low. "A protein bar is preferred because 66 mg/dL is level 2" is not the best choice because 66 mg/dL is level 1, not level 2. Level 1 is under 70 and at or above 54 mg/dL. Level 2 is under 54. A protein bar is the wrong treatment at either level when the person is conscious. "High-fat snacks work faster than glucose tablets" is not the best choice because High-fat food is specifically not the treatment. Glucose or carbohydrate that contains glucose is. "Treatment can wait until the glucose is under 54 mg/dL" is not the best choice because Level 1 is already an indication to treat. Waiting for a value under 54 mg/dL lets level 1 go untreated. "Any food is fine, including a bar that is mostly protein in the office today" is not the best choice because The guidance does not say any food will do. High-protein and high-fat foods are the choices to avoid.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "communication", "nutrition"]$tg$,
  's2-new-20261121-hidden', '96c6a5e243b9eed074d159c53ab17b00a95d0be4ea4a869b51de492d253c3dbb', false, NOW(), NOW(), 3,
  'protein-bar-is-wrong-low-treatment', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "American Diabetes Association. Standards of Care in Diabetes—2025. Section 6: Glycemic Goals and Hypoglycemia.", "url": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia"}]$rf$::jsonb,
  'step2', false,
  'communication', 'protein-bar-is-wrong-low-treatment', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-103", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://diabetesjournals.org/care/article/48/Supplement_1/S128/157561/6-Glycemic-Goals-and-Hypoglycemia", "nutrition": true, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210104', 'usmle-step-2', 'gynecology',
  $sc$A 20-year-old woman who works as a toll collector is seen in the campus health office asking for a first cervical screening test. She has been sexually active for three years and has a new partner this semester. There is no pelvic pain and no bleeding between periods. Nobody has collected cytology before. A friend told her the test starts as soon as sexual activity begins. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. A urine pregnancy test is negative. Hemoglobin is 13.2 g/dL.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Start cytology now because she is sexually active", "Start primary HPV testing now and repeat it every 5 years", "Cotest now, then repeat the pair every 3 years", "Do not start cervical screening before age 21", "Screen once, then stop if this first result is negative"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-no-screen-under-21", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not start cervical screening before age 21$ky$,
  $ex$Cervical screening is not started before age 21. She is 20. From 21 through 29, the strategy is cytology alone every 3 years. "Start cytology now because she is sexually active" is not the best choice because Sexual activity does not move the start age. Screening is not done under 21. "Start primary HPV testing now and repeat it every 5 years" is not the best choice because Primary HPV testing is not used for screening under 21, and it is not the strategy for ages 21 to 29 either. "Cotest now, then repeat the pair every 3 years" is not the best choice because Cotesting is an option from ages 30 to 65, every 5 years, not a test to start at age 20. "Screen once, then stop if this first result is negative" is not the best choice because A single negative test is not a reason to screen once and stop. The relevant point at this age is that screening has not started.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '4b7a671bf7726906567d926b513dfb57accad782644aa24e6460e4b21d3cf66e', false, NOW(), NOW(), 2,
  'cervical-no-screen-under-21', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervical-no-screen-under-21', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-104", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210105', 'usmle-step-2', 'gynecology',
  $sc$A 21-year-old woman who works as a bank teller is seen in the branch-clinic well visit one month after her birthday, asking how screening should begin. She has never had cytology. Menses are regular, and she has no bleeding after intercourse. She has had one partner for a year. The visit was booked for a school-form physical that became a health review. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. A urine pregnancy test is negative. Hemoglobin is 13.0 g/dL.$sc$,
  $qu$Which of the following is an acceptable way to begin?$qu$,
  $op${"options": ["Primary high-risk HPV testing every 5 years", "Cytology alone every 5 years", "Cotesting every 5 years starting today", "No screening until age 30", "Cytology alone every 3 years"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-start-cytology-at-21", "taskCategory": "health-maintenance"}$op$,
  $ky$Cytology alone every 3 years$ky$,
  $ex$From ages 21 to 29, screen with cytology alone every 3 years. She is 21 and has never been screened, so that is the way to begin. "Primary high-risk HPV testing every 5 years" is not the best choice because Primary HPV testing is not the screening strategy at ages 21 to 29. "Cytology alone every 5 years" is not the best choice because Cytology alone every 5 years is not the interval. The interval for cytology alone is 3 years. "Cotesting every 5 years starting today" is not the best choice because Cotesting every 5 years is an option from ages 30 to 65, not at 21. "No screening until age 30" is not the best choice because Screening starts at 21, not at 30. Age 30 is when HPV-based strategies become options.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '52b4ca5bde1fdc93680e9706cb3156177d4184d44c970f7c5e819a7518515edd', false, NOW(), NOW(), 1,
  'cervical-start-cytology-at-21', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervical-start-cytology-at-21', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-105", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210106', 'usmle-step-2', 'gynecology',
  $sc$A 25-year-old woman who works as a zookeeper is seen in the zoo-clinic exam room holding an order for primary HPV testing that a friend requested. Her last cytology was negative two years ago. She has no bleeding between periods and no pelvic pain after lifting feed bags. She wants the longest possible gap before the next test and was told HPV testing alone is how to get it. Temperature is 36.7°C, pulse is 80/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. The cytology report from two years ago shows no intraepithelial lesion. Hemoglobin is 13.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Continue screening with cytology alone every 3 years", "Switch to primary high-risk HPV testing every 5 years", "Cytology alone every 5 years is the correct interval at this age", "Stop screening because the last cytology was negative", "Cotest this year and repeat the pair every 5 years"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-age-25-cytology-not-primary-hpv", "taskCategory": "interpretation"}$op$,
  $ky$Continue screening with cytology alone every 3 years$ky$,
  $ex$Ages 21 to 29 are screened with cytology alone every 3 years. Primary HPV testing is not the strategy in this age group. Her last cytology was negative, and the interval remains 3 years. "Switch to primary high-risk HPV testing every 5 years" is not the best choice because Primary high-risk HPV testing is not used for screening at ages 21 to 29. She is 25. "Cytology alone every 5 years is the correct interval at this age" is not the best choice because Cytology alone is every 3 years in this age group, not every 5 years. "Stop screening because the last cytology was negative" is not the best choice because One negative cytology does not end screening at age 25. "Cotest this year and repeat the pair every 5 years" is not the best choice because Cotesting every 5 years is an option starting at age 30, not at 25.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'f7ed57240396dbceaaa0197f72d7dd5c11a5aac85c1c036ff672bafb991d61db', false, NOW(), NOW(), 3,
  'cervical-age-25-cytology-not-primary-hpv', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cervical-age-25-cytology-not-primary-hpv', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-106", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210107', 'usmle-step-2', 'gynecology',
  $sc$A 29-year-old woman who works as a proofreader is seen in the publisher clinic eleven months before her 30th birthday. She wants to switch today to primary HPV testing because the next birthday is close and the last cytology, 14 months ago, was negative. There is no bleeding after intercourse. Galley pages are stacked on the chair. She has had the same partner for four years. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. The prior cytology showed no intraepithelial lesion. Hemoglobin is 12.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate plan today?$qu$,
  $op${"options": ["Start primary high-risk HPV testing now because age 30 is close", "Keep cytology alone every 3 years until she is 30", "Cytology alone every 5 years may begin at age 29", "Stop until age 30, then choose any strategy", "Cotest today; the 5-year clock can start at 29"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-age-29-still-not-primary-hpv", "taskCategory": "interpretation"}$op$,
  $ky$Keep cytology alone every 3 years until she is 30$ky$,
  $ex$She is still in the 21-to-29 group, which is cytology alone every 3 years. Primary HPV testing and cotesting are options from 30 to 65, not at 29. The last cytology was negative 14 months ago. "Start primary high-risk HPV testing now because age 30 is close" is not the best choice because Primary HPV testing is not recommended for screening before age 30. Being close to 30 does not move the age boundary. "Cytology alone every 5 years may begin at age 29" is not the best choice because Cytology alone stays on a 3-year interval. A 5-year cytology interval is not the recommendation at 29 or later. "Stop until age 30, then choose any strategy" is not the best choice because Screening does not pause in the year before 30. The 21-to-29 strategy continues until she reaches 30. "Cotest today; the 5-year clock can start at 29" is not the best choice because Cotesting every 5 years begins as an option at age 30, not at 29.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '82a3c51d54dd51d12350d291bf4e1282a45023a4af546c3ff4c3ce82ff67b7e7', false, NOW(), NOW(), 4,
  'cervical-age-29-still-not-primary-hpv', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cervical-age-29-still-not-primary-hpv', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-107", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210108', 'usmle-step-2', 'gynecology',
  $sc$A 30-year-old woman who works as a wedding planner is seen in the boutique gynecology office on her 30th birthday month, asking for the longest acceptable interval. Prior cytology tests were negative, most recently 3 years ago. She has no postcoital bleeding. Vendor meetings fill the week, and she wants a plan she will not have to repeat every year. One partner is longstanding. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The cytology from 3 years ago showed no intraepithelial lesion. Hemoglobin is 13.1 g/dL.$sc$,
  $qu$Which of the following is an acceptable strategy at this age?$qu$,
  $op${"options": ["Primary high-risk HPV testing every 3 years", "Cytology alone every 5 years", "Primary high-risk HPV testing every 5 years", "Stop screening now that she has turned 30", "Primary HPV testing reserved for ages 21 to 29"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-age-30-primary-hrhpv-every-5-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Primary high-risk HPV testing every 5 years$ky$,
  $ex$From ages 30 to 65, acceptable strategies are cytology every 3 years, primary high-risk HPV testing every 5 years, or cotesting every 5 years. Primary high-risk HPV testing every 5 years is one of those options. She is 30. "Primary high-risk HPV testing every 3 years" is not the best choice because When primary high-risk HPV testing is used from ages 30 to 65, the interval is 5 years, not 3. "Cytology alone every 5 years" is not the best choice because Cytology alone is every 3 years, not every 5, including after age 30. "Stop screening now that she has turned 30" is not the best choice because Age 30 is the start of additional strategy choices, not a stopping age. Stopping is considered after 65 when prior screening has been adequate. "Primary HPV testing reserved for ages 21 to 29" is not the best choice because Primary HPV testing is not the strategy at 21 to 29. It becomes an option at 30.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '6341ad214f62a5651908418783cee08427f393c135f6d9e00c062140fd2ce8c4', false, NOW(), NOW(), 3,
  'cervical-age-30-primary-hrhpv-every-5-years', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervical-age-30-primary-hrhpv-every-5-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-108", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210109', 'usmle-step-2', 'gynecology',
  $sc$A 43-year-old woman who works as a lens fitter is seen in the lens-shop health visit asking whether a combined test can be spaced out. She has had negative cytology in the past and wants to know if adding an HPV test changes the calendar. There is no bleeding between menses. The last cytology was negative four years ago, and she has had one partner for a decade. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 120/76 mm Hg. A record from four years ago shows negative cytology. Hemoglobin is 13.6 g/dL.$sc$,
  $qu$Which of the following is an acceptable strategy?$qu$,
  $op${"options": ["Cotesting every 3 years as the named interval", "Cytology alone every 5 years is acceptable", "Primary HPV testing is not allowed after age 30", "Cotesting every 5 years is an acceptable strategy", "Stop screening at age 40 if one cytology was negative"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-age-43-cotest-every-5-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Cotesting every 5 years is an acceptable strategy$ky$,
  $ex$From ages 30 to 65, cotesting every 5 years is an acceptable strategy, along with cytology every 3 years or primary high-risk HPV testing every 5 years. She is 43. "Cotesting every 3 years as the named interval" is not the best choice because The cotesting interval in the recommendation is 5 years, not 3. "Cytology alone every 5 years is acceptable" is not the best choice because Cytology alone is every 3 years. Extending cytology alone to 5 years is not the stated option. "Primary HPV testing is not allowed after age 30" is not the best choice because Primary high-risk HPV testing every 5 years is allowed from 30 to 65. It is not barred after 30. "Stop screening at age 40 if one cytology was negative" is not the best choice because Stopping is not offered at age 40, and one negative cytology is not adequate prior screening for a later stop.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'eab3d98764eb10c30f926f0613295f5c83490faeebd84cc1f93285b86e377b6c', false, NOW(), NOW(), 2,
  'cervical-age-43-cotest-every-5-years', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervical-age-43-cotest-every-5-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-109", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210110', 'usmle-step-2', 'gynecology',
  $sc$A 57-year-old woman who works as a history teacher is seen in the faculty health office preferring to stay with cytology if that is still allowed. She has declined HPV testing in the past and wants to know if that choice expired after age 30. The last cytology was negative three years ago. There is no bleeding after intercourse. Grade books are in the tote bag. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. Cytology three years ago showed no intraepithelial lesion. Hemoglobin is 13.3 g/dL.$sc$,
  $qu$Which of the following is an acceptable plan?$qu$,
  $op${"options": ["Cytology alone is no longer allowed after age 30", "Use cytology alone on a 5-year interval instead", "Stop screening now, because she is past age 55", "Primary HPV testing every 3 years is the only remaining choice", "Cytology alone every 3 years remains acceptable"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-age-57-cytology-every-3-years-ok", "taskCategory": "interpretation"}$op$,
  $ky$Cytology alone every 3 years remains acceptable$ky$,
  $ex$From ages 30 to 65, cytology every 3 years is acceptable, as are primary high-risk HPV testing every 5 years and cotesting every 5 years. She is 57, and cytology alone every 3 years is still one of those choices. "Cytology alone is no longer allowed after age 30" is not the best choice because Cytology alone every 3 years remains an option from ages 30 to 65. It does not expire at 30. "Use cytology alone on a 5-year interval instead" is not the best choice because Cytology alone is not extended to every 5 years. The 5-year interval belongs to primary HPV testing or cotesting. "Stop screening now, because she is past age 55" is not the best choice because Stopping is considered after age 65 when prior screening has been adequate, not at 55. "Primary HPV testing every 3 years is the only remaining choice" is not the best choice because Primary HPV testing is every 5 years, not every 3, and it is not the only remaining choice.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '524fd57d9b8af0d2d689911e41b46e9f12feb761b506dd41b57c27b4a22a1927', false, NOW(), NOW(), 3,
  'cervical-age-57-cytology-every-3-years-ok', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cervical-age-57-cytology-every-3-years-ok', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-110", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210111', 'usmle-step-2', 'gynecology',
  $sc$A 66-year-old woman who works as a rancher is seen in the county well-woman clinic asking whether screening can stop. Cytology was negative at ages 58, 61, and 64. She has never had a high-grade precancer, and there is no history of immunosuppression or in-utero drug exposure. She has a longstanding partner and no bleeding. The ranch books show the test dates in her own handwriting. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 134/78 mm Hg. The three cytology reports are negative. Hemoglobin is 13.5 g/dL.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Screening can stop; the prior cytology record is adequate", "Continue cytology every 3 years for the rest of life", "Stop only if she also has two negative HPV tests", "A new test is required because the last one was not this year", "Stopping is not allowed until she reaches age 75"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-stop-after-65-three-negative-cytology", "taskCategory": "health-maintenance"}$op$,
  $ky$Screening can stop; the prior cytology record is adequate$ky$,
  $ex$Screening can stop after 65 when prior screening was adequate and there is no high-risk history. Adequate cytology is three consecutive negative results within 10 years, the most recent within 5 years. These tests were at 58, 61, and 64, and she is 66, so the most recent was 2 years ago. No high-grade history is described. "Continue cytology every 3 years for the rest of life" is not the best choice because Adequate prior cytology is a reason screening can stop after 65. Lifetime cytology is not required in this history. "Stop only if she also has two negative HPV tests" is not the best choice because Stopping can rest on three consecutive negative cytology results. Two negative cotests are a different adequate path, not an extra requirement on top of three negative cytology tests. "A new test is required because the last one was not this year" is not the best choice because The most recent test must be within 5 years, not within the past 12 months. Two years meets that part of the rule. "Stopping is not allowed until she reaches age 75" is not the best choice because The stop is after 65 when the screening record is adequate. It is not delayed until 75. Age 75 is a separate breast-screening boundary.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '99d456c1d7b596d05f16c7cb106ac736269d315764bbc9c0dca7145c7172865d', false, NOW(), NOW(), 3,
  'cervical-stop-after-65-three-negative-cytology', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervical-stop-after-65-three-negative-cytology', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-111", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210112', 'usmle-step-2', 'gynecology',
  $sc$A 71-year-old woman who works as a gate agent is seen in the airport employee clinic certain her old cytology slips are enough to stop. Negative cytology is filed from ages 62, 64, and 65. She has no high-grade history, no immune suppression, and no in-utero exposure history. A new partner is not part of the story. She wants the chart closed before the holiday travel rush. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 136/80 mm Hg. The reports confirm three negative cytology results, the latest at age 65. Hemoglobin is 12.9 g/dL.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Stop, because three negative cytology results are automatically enough", "She cannot stop yet; the most recent test is beyond 5 years", "Stop, because she is past 65 and has no new partner", "The tests are outside the 10-year window, so she cannot stop", "Primary HPV testing every 3 years is required to close the record"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-cannot-stop-last-test-too-old", "taskCategory": "health-maintenance"}$op$,
  $ky$She cannot stop yet; the most recent test is beyond 5 years$ky$,
  $ex$Adequate prior cytology requires three consecutive negative results within 10 years and a most recent result within 5 years. The latest test was at age 65, and she is 71, so it was 6 years ago. She should not be told that screening has ended. "Stop, because three negative cytology results are automatically enough" is not the best choice because Three negative cytology results must also fall within 10 years, with the most recent within 5 years. The count alone is not enough. "Stop, because she is past 65 and has no new partner" is not the best choice because Absence of a new partner does not repair a record that misses the timing rule. A new partner is also not, by itself, a reason to restart after an adequate stop. "The tests are outside the 10-year window, so she cannot stop" is not the best choice because The earliest test was at age 62, and she is 71, which is 9 years and still within 10 years. The timing failure is not the 10-year window. "Primary HPV testing every 3 years is required to close the record" is not the best choice because Primary HPV testing every 3 years is not a requirement to finish a cytology record, and that interval is not the primary-HPV interval anyway. The gap is the 5-year recency rule.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'ea63ec2e2026df0b0cc94280653d04ad3051d12169b746c9102fe9199367dad8', false, NOW(), NOW(), 5,
  'cervical-cannot-stop-last-test-too-old', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervical-cannot-stop-last-test-too-old', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-112", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210113', 'usmle-step-2', 'gynecology',
  $sc$A 66-year-old woman who works as a weaver is seen in the guild clinic with two combined tests in the chart and no third cytology. Cotests were negative at ages 60 and 64, both the cytology and the high-risk HPV portion. She has no high-grade history and no immune-suppressing condition. She wants to know if a third cytology is mandatory before screening can stop. The loom is idle this week. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 130/76 mm Hg. Both cotest reports are negative. Hemoglobin is 13.2 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Two negative cotests are not enough without three cytology tests at this encounter", "The most recent cotest is too old because it was not this year", "Two consecutive negative cotests meet the adequate-screening path", "Cotests can support stopping only before age 65", "She must switch to primary HPV testing for five more years"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-stop-two-negative-cotests", "taskCategory": "interpretation"}$op$,
  $ky$Two consecutive negative cotests meet the adequate-screening path$ky$,
  $ex$Screening can stop after 65 with two consecutive negative cotests within 10 years, the most recent within 5 years, and no high-risk history. These cotests were at 60 and 64, and she is 66. That is within 10 years, and the latest is within 5 years. "Two negative cotests are not enough without three cytology tests at this encounter" is not the best choice because Three negative cytology tests are one adequate path. Two consecutive negative cotests are the other. A third cytology test is not added on top of two qualifying cotests. "The most recent cotest is too old because it was not this year" is not the best choice because The most recent test must be within 5 years. A cotest at age 64, with her now 66, was 2 years ago. "Cotests can support stopping only before age 65" is not the best choice because The stop is considered after 65, not only before 65. She is 66. "She must switch to primary HPV testing for five more years" is not the best choice because Primary HPV testing for five more years is not required once an adequate cotest record is already in hand.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '321c1a124b01f5e4bb0748597b92529500e6c84a319ba58fb3b0702dc7c975d5', false, NOW(), NOW(), 3,
  'cervical-stop-two-negative-cotests', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cervical-stop-two-negative-cotests', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-113", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210114', 'usmle-step-2', 'gynecology',
  $sc$A 68-year-old woman who works as a sailor is seen in the harbor well-woman clinic after a new relationship of four months. Cytology was negative at ages 59, 62, and 65. She has no high-grade history and takes no immune-suppressing medicine. A dock friend told her any new partner reopens screening. She has no bleeding and feels well on the boat. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 132/78 mm Hg. The three cytology reports are negative. Hemoglobin is 13.0 g/dL.$sc$,
  $qu$Which of the following is the most appropriate statement?$qu$,
  $op${"options": ["A new partner means screening must start again", "The old tests do not count because she is over 65", "Primary HPV testing every 3 years is required now", "Do not restart screening only because of a new partner", "One new cytology this year is mandatory, then stop again"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-new-partner-does-not-restart", "taskCategory": "communication"}$op$,
  $ky$Do not restart screening only because of a new partner$ky$,
  $ex$Do not resume screening only because of a new partner. Her cytology was negative at 59, 62, and 65, and she is 68, so three negatives fell within 10 years and the most recent was within 5 years. No high-risk history is described. "A new partner means screening must start again" is not the best choice because A new partner is not, by itself, a reason to resume screening after it has appropriately stopped. "The old tests do not count because she is over 65" is not the best choice because Being over 65 is the setting in which an adequate record allows screening to stop. It does not invalidate the old negative tests. "Primary HPV testing every 3 years is required now" is not the best choice because Primary HPV testing every 3 years is not the restart rule, and 3 years is not the primary-HPV interval. "One new cytology this year is mandatory, then stop again" is not the best choice because An extra cytology year is not required when the stop criteria were already met and the only new fact is a partner.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "communication"]$tg$,
  's2-new-20261121-hidden', '1bedceffc9877734513fb365fa837d32bae2269d13000b504ed227ace2944280', false, NOW(), NOW(), 4,
  'cervical-new-partner-does-not-restart', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'communication', 'cervical-new-partner-does-not-restart', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-114", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210115', 'usmle-step-2', 'gynecology',
  $sc$A 70-year-old woman who works as a goldsmith is seen in the bench-clinic visit who was treated for a high-grade cervical precancer at age 52. She has had negative cytology since that treatment, including a negative test last year. A relative told her every screening program ends at 65 no matter what came before. She has no bleeding. The workshop is closed for inventory. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 138/80 mm Hg. Last year's cytology was negative. Hemoglobin is 12.7 g/dL. The treatment note is dated at age 52.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Stop, because she is past 65 and the latest cytology was negative", "The 20-year clock ended at age 65 even if treatment was at 52", "Switch to a single HPV test and then stop forever", "High-grade history is ignored once three later tests are negative", "Continue screening; 20 years have not yet passed since treatment"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-high-grade-continue-20-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Continue screening; 20 years have not yet passed since treatment$ky$,
  $ex$Continue screening for at least 20 years after a high-grade precancer, even past age 65. Treatment was at age 52, and she is 70, so 18 years have passed. The stop-after-65 rules do not cover this history. "Stop, because she is past 65 and the latest cytology was negative" is not the best choice because A negative recent cytology does not end screening after a high-grade precancer when 20 years have not passed. She is 70, which is past 65, and that age does not close this history. "The 20-year clock ended at age 65 even if treatment was at 52" is not the best choice because The 20-year period is not cut off by the 65th birthday. Screening continues even past 65 until at least 20 years have elapsed. "Switch to a single HPV test and then stop forever" is not the best choice because One HPV test is not described as a way to end the 20-year follow-up. "High-grade history is ignored once three later tests are negative" is not the best choice because Later negative tests do not erase the instruction to continue for at least 20 years after a high-grade precancer.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c0cb79ec198d0070aa290b36c54597aa6f59c3de6e388a48b7384039595dde0b', false, NOW(), NOW(), 4,
  'cervical-high-grade-continue-20-years', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervical-high-grade-continue-20-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-115", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210116', 'usmle-step-2', 'gynecology',
  $sc$A 52-year-old woman who works as a notary is seen in the postoperative gynecology visit three years after surgery for fibroids. The operative report and the pathology note both say the cervix was removed. There is no history of a high-grade precancer and no history of cancer. She has had no bleeding. She asks whether a speculum exam for screening is still on the calendar. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Pathology describes a benign fibroid uterus and a cervix with no high-grade lesion. Hemoglobin is 13.1 g/dL.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Do not screen; the cervix is gone and the history is benign", "Continue cytology every 3 years because she is under 65 at this encounter", "Begin primary high-risk HPV testing every 5 years", "Screen one more time at age 65 and then stop", "Continue cotesting every 5 years until age 65"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "hysterectomy-cervix-removed-stop-screening", "taskCategory": "clinical-intervention"}$op$,
  $ky$Do not screen; the cervix is gone and the history is benign$ky$,
  $ex$Do not screen after hysterectomy with removal of the cervix when there is no history of a high-grade precancer or cancer. The operative and pathology notes confirm the cervix was removed, and no high-grade lesion was found. She is 52. "Continue cytology every 3 years because she is under 65 at this encounter" is not the best choice because Age under 65 does not keep screening going after the cervix has been removed in the absence of a high-grade history. "Begin primary high-risk HPV testing every 5 years" is not the best choice because Primary HPV testing is a screening strategy when a cervix is present and age is 30 to 65. It is not indicated after the cervix is removed without a high-grade history. "Screen one more time at age 65 and then stop" is not the best choice because A final test at 65 is not part of this stop. Screening is not indicated once the cervix is confirmed gone and the history is benign. "Continue cotesting every 5 years until age 65" is not the best choice because Cotesting assumes a cervix that is still being screened. That strategy does not apply here.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '4813ead193628a689368fd8a6a08ba78add841ef56f74ffca648d1c9654d6191', false, NOW(), NOW(), 3,
  'hysterectomy-cervix-removed-stop-screening', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'hysterectomy-cervix-removed-stop-screening', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-116", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210117', 'usmle-step-2', 'gynecology',
  $sc$A 60-year-old woman who works as a records clerk is seen in the records-room gynecology clinic whose chart says screening is finished because of a hysterectomy. Surgery was at age 46 at another hospital. The operative report is not in the file, and she cannot remember whether the cervix was taken out. A colleague already signed a note that no further screening is due. She has no known high-grade history and has no bleeding. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. The outside pathology packet is missing. Hemoglobin is 12.8 g/dL. A bimanual examination does not settle whether a cervix remains.$sc$,
  $qu$Which of the following is the most appropriate professional action?$qu$,
  $op${"options": ["Accept the signed note; every hysterectomy removes the cervix", "Confirm that the cervix was removed before screening is stopped", "Stop screening because she is already close to age 65", "Order primary HPV testing every 3 years and ignore the surgery", "Tell her a new partner would be the only reason to look further"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "confirm-cervix-removed-before-stopping", "taskCategory": "professionalism"}$op$,
  $ky$Confirm that the cervix was removed before screening is stopped$ky$,
  $ex$Before stopping screening for hysterectomy, confirm that the cervix was removed. She is 60, and the surgery was at age 46, but the report is missing. Do not screen if the cervix was removed and there is no high-grade or cancer history. If a cervix is still present, screening continues, including through age 65. "Accept the signed note; every hysterectomy removes the cervix" is not the best choice because Not every hysterectomy removes the cervix. The recommendation is to confirm removal before screening is stopped. "Stop screening because she is already close to age 65" is not the best choice because Being near 65 does not replace confirmation that the cervix is gone. The stop-after-65 path is a different rule and still needs an adequate screening history. "Order primary HPV testing every 3 years and ignore the surgery" is not the best choice because Primary HPV testing every 3 years is not the interval, and choosing a test does not answer whether a cervix is present. "Tell her a new partner would be the only reason to look further" is not the best choice because A new partner is not the deciding fact here, and a new partner alone does not restart screening after an adequate stop.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "professionalism"]$tg$,
  's2-new-20261121-hidden', '7861b896da4f01851dfb73f72ad5d3291ff88fee99e5b8a7f50323758ccc5e20', false, NOW(), NOW(), 5,
  'confirm-cervix-removed-before-stopping', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'professionalism', 'confirm-cervix-removed-before-stopping', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-117", "hidden": true, "physicianTask": "professionalism", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210118', 'usmle-step-2', 'gynecology',
  $sc$A 49-year-old woman who works as a tram driver is seen in the transit clinic after a supracervical hysterectomy five years ago. The operative note says the cervix was left in place. Fibroids were the reason for surgery, and pathology showed no high-grade lesion. She has had no cytology since the operation and has no bleeding. The route schedule brought her in on a day off. Temperature is 36.7°C, pulse is 78/min, respirations are 16/min, and blood pressure is 122/74 mm Hg. The operative note documents a retained cervix. Hemoglobin is 13.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Stop screening because a hysterectomy of any type ends it", "Stop because she is over 40 and the cervix is hard to see", "Continue screening; the cervix is still present", "Start primary HPV testing every 3 years as the only option", "Screen once and stop if that single test is negative"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervix-retained-keep-screening", "taskCategory": "health-maintenance"}$op$,
  $ky$Continue screening; the cervix is still present$ky$,
  $ex$The cervix is still present, so screening continues. She is 49, an age at which cytology every 3 years, primary high-risk HPV testing every 5 years, or cotesting every 5 years is acceptable. The operative note says the cervix was left in place. "Stop screening because a hysterectomy of any type ends it" is not the best choice because Screening stops after hysterectomy only when the cervix was removed and there is no high-grade or cancer history. Her cervix was retained. "Stop because she is over 40 and the cervix is hard to see" is not the best choice because Age over 40 is not a stopping age. Screening strategies run through 65 when a cervix is present. "Start primary HPV testing every 3 years as the only option" is not the best choice because Primary HPV testing, if chosen, is every 5 years from ages 30 to 65, and it is not the only acceptable strategy. Cytology every 3 years and cotesting every 5 years are also options. "Screen once and stop if that single test is negative" is not the best choice because One negative test does not end screening at age 49.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'fb27e007c844c1b83c8764904b45c1aac2626a5b7287e540743bad0b3c52f7de', false, NOW(), NOW(), 3,
  'cervix-retained-keep-screening', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervix-retained-keep-screening', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-118", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210119', 'usmle-step-2', 'gynecology',
  $sc$A 66-year-old woman who works as a cafeteria cook is seen in the infectious-disease clinic living with HIV and asking to end screening. Cytology was negative at ages 57, 60, and 64. She takes antiretroviral therapy and has had the same partner for years. A friend without HIV stopped screening and told her the calendar is identical. She has no bleeding. Temperature is 36.6°C, pulse is 80/min, respirations are 16/min, and blood pressure is 128/76 mm Hg. CD4 count is 540 cells/mm3. The three cytology reports are negative. Hemoglobin is 12.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Three negative cytology tests cancel the HIV exception", "Screening stops at 65 if the CD4 count is above 500", "HIV changes the rule only before age 30", "The stop-after-65 rule does not apply because of HIV", "A new partner is required before screening can continue"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-hiv-stop-rule-does-not-apply", "taskCategory": "interpretation"}$op$,
  $ky$The stop-after-65 rule does not apply because of HIV$ky$,
  $ex$People with HIV are not covered by the rules for stopping at 65. Three negative cytology results would be adequate in someone without a high-risk history, but HIV is outside those stop rules. No different interval is stated here to invent. "Three negative cytology tests cancel the HIV exception" is not the best choice because An otherwise adequate cytology record does not bring HIV back under the stop-after-65 rule. "Screening stops at 65 if the CD4 count is above 500" is not the best choice because No CD4 threshold of 500 restores the stop rule. The exception is HIV itself, and the CD4 count of 540 is not a cutoff in this recommendation. "HIV changes the rule only before age 30" is not the best choice because The HIV exception is not limited to ages under 30. She is 66, and the stop rule still does not apply. "A new partner is required before screening can continue" is not the best choice because A new partner is not required to continue screening, and a new partner alone is not a reason to restart after an adequate stop in people the stop rules do cover.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '7deaa6564df11513ad2616d70ce846d00135821a75c7cc8db62c13df6a4246d0', false, NOW(), NOW(), 4,
  'cervical-hiv-stop-rule-does-not-apply', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cervical-hiv-stop-rule-does-not-apply', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-119", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210120', 'usmle-step-2', 'gynecology',
  $sc$A 67-year-old woman who works as a potter is seen in the clay-studio clinic who was exposed to DES in utero. Her mother took DES during the pregnancy that led to her birth. Cytology was negative at ages 59, 62, and 65. She has no immune-suppressing medicine and has had no high-grade treatment. A kiln schedule is posted by the door, and she feels well. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood pressure is 136/80 mm Hg. The exposure is recorded in the prenatal history of her mother. The three cytology reports are negative. Hemoglobin is 13.3 g/dL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["DES exposure matters only if she is also living with HIV", "Three negative cytology tests override the DES history", "DES exposure ends cervical screening earlier, at age 60", "In-utero exposure is irrelevant after the most recent test is negative", "The stop-after-65 rule does not apply because of DES exposure"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "cervical-des-stop-rule-does-not-apply", "taskCategory": "interpretation"}$op$,
  $ky$The stop-after-65 rule does not apply because of DES exposure$ky$,
  $ex$People with DES exposure are not covered by the rules for stopping after 65. The negative cytology tests at 59, 62, and 65 would otherwise look adequate at age 67, but that stop path does not cover DES exposure. "DES exposure matters only if she is also living with HIV" is not the best choice because DES exposure is its own reason the stop rules do not apply. HIV is a separate exception, not a requirement added to DES. "Three negative cytology tests override the DES history" is not the best choice because An adequate-looking cytology record does not put DES exposure back under the ordinary stop rule. "DES exposure ends cervical screening earlier, at age 60" is not the best choice because No stop at age 60 is stated for DES exposure. The ordinary stop discussion is after 65, and DES exposure is outside it. "In-utero exposure is irrelevant after the most recent test is negative" is not the best choice because A recent negative cytology does not make in-utero DES exposure irrelevant to the stop decision.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'b9cad30c98bdca51862c9f06298d0ac47ffc66c0275b4c177a2e71cb034f9f3d', false, NOW(), NOW(), 4,
  'cervical-des-stop-rule-does-not-apply', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cervical-des-stop-rule-does-not-apply', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-120", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210121', 'usmle-step-2', 'gynecology',
  $sc$A 40-year-old woman who works as a mechanic is seen in the garage occupational clinic on the week of her 40th birthday, asking when mammography starts. She has no breast lump, no nipple discharge, and no prior mammogram. A sister asked her to begin yearly films immediately. Work is under cars most days, and the visit was opened for a shoulder strain that has resolved. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Clinical breast examination shows no mass. Body mass index is 27 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Biennial mammography starting at age 40", "Do not order a mammogram until she is 50", "Start annual mammography on today's visit", "Magnetic resonance imaging as the first screening test", "Use ultrasound alone and repeat it every year"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "mammogram-biennial-starts-at-40", "taskCategory": "health-maintenance"}$op$,
  $ky$Biennial mammography starting at age 40$ky$,
  $ex$Biennial mammography is recommended for women ages 40 to 74. She is 40, so screening starts on that biennial schedule. Digital mammography and digital breast tomosynthesis are both effective. "Do not order a mammogram until she is 50" is not the best choice because The recommendation does not delay the start until 50. Biennial mammography is for women 40 to 74. "Start annual mammography on today's visit" is not the best choice because Annual mammography is not the preferred interval. Biennial screening has a better benefit-harm balance than annual screening. "Magnetic resonance imaging as the first screening test" is not the best choice because Magnetic resonance imaging is not the first screening test in this recommendation. Supplemental MRI after a negative mammogram in dense breasts is an I statement, not a routine start. "Use ultrasound alone and repeat it every year" is not the best choice because Screening ultrasound is not the primary test. Supplemental ultrasound for dense breasts is an I statement, not a routine yearly plan.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '2a2b0448c0529fecf18446ef8348a2a08f434f185ddb222984c485ba66e201dd', false, NOW(), NOW(), 1,
  'mammogram-biennial-starts-at-40', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'mammogram-biennial-starts-at-40', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-121", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210122', 'usmle-step-2', 'gynecology',
  $sc$A 39-year-old woman who works as a cashier is seen in the grocery-clinic well visit asking to start mammography before her next birthday. She has no lump and no nipple discharge. A coworker began screening and suggested she do the same this year. There is no personal description of a prior breast biopsy. Shifts at the register are full time. Temperature is 36.5°C, pulse is 80/min, respirations are 16/min, and blood pressure is 112/70 mm Hg. Clinical breast examination shows no mass. Body mass index is 24 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Start biennial mammography today, at age 39", "Biennial mammography begins at age 40, not at 39", "Start annual mammography because she asked early", "Add screening MRI this year and mammography at 50", "Ultrasound every year until age 40, then stop"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "mammogram-not-at-age-39", "taskCategory": "health-maintenance"}$op$,
  $ky$Biennial mammography begins at age 40, not at 39$ky$,
  $ex$Biennial mammography is recommended from ages 40 to 74. She is 39, so the recommendation has not started. Biennial screening has a better benefit-harm balance than annual screening once it does start. "Start biennial mammography today, at age 39" is not the best choice because The age to begin in this recommendation is 40, not 39. "Start annual mammography because she asked early" is not the best choice because Annual screening is not preferred even after screening starts, and it does not start the clock at 39. "Add screening MRI this year and mammography at 50" is not the best choice because MRI is not the routine first test, and mammography is not delayed from 40 to 50 in this recommendation. "Ultrasound every year until age 40, then stop" is not the best choice because Yearly ultrasound is not the bridge to age 40. Supplemental ultrasound is an I statement for dense breasts after a negative mammogram, not a routine plan.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'f214f7ef4f7d0850f23e00bfc079f5fc773702a36e223f435e0b42e900811c3b', false, NOW(), NOW(), 2,
  'mammogram-not-at-age-39', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'mammogram-not-at-age-39', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-122", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210123', 'usmle-step-2', 'gynecology',
  $sc$A 53-year-old woman who works as a park naturalist is seen in the trail-clinic well visit requesting a mammogram every year. Her last mammogram was 14 months ago and was negative. She has no lump. A pamphlet at the visitor center listed yearly screening, and she wants the chart to match that pamphlet. Hikes are part of the job most weeks. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 126/78 mm Hg. The prior mammogram report shows no suspicious mass. Body mass index is 26 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate explanation?$qu$,
  $op${"options": ["Annual mammography is required from ages 40 to 74", "She should stop, because screening ends at age 50", "Biennial mammography has a better benefit-harm balance than annual", "Only tomosynthesis counts, so the last film is void", "Ultrasound must be added every year after a negative mammogram in the office today"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "mammogram-biennial-rather-than-annual", "taskCategory": "communication"}$op$,
  $ky$Biennial mammography has a better benefit-harm balance than annual$ky$,
  $ex$Biennial mammography is recommended for women 40 to 74, and biennial screening has a better benefit-harm balance than annual screening. She is 53, and the last mammogram was 14 months ago. Both digital mammography and tomosynthesis are effective. "Annual mammography is required from ages 40 to 74" is not the best choice because The recommended interval is biennial, not annual. Annual screening is not required. "She should stop, because screening ends at age 50" is not the best choice because Screening does not end at 50. The age span is 40 to 74. "Only tomosynthesis counts, so the last film is void" is not the best choice because Digital mammography and digital breast tomosynthesis are both effective. A prior negative mammogram is not void for lack of tomosynthesis. "Ultrasound must be added every year after a negative mammogram in the office today" is not the best choice because Supplemental ultrasound after a negative mammogram is an I statement, not a routine yearly addition.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "communication"]$tg$,
  's2-new-20261121-hidden', '476844536850449b1dae15dc6c87897b220b2297301c076b9903116741833941', false, NOW(), NOW(), 3,
  'mammogram-biennial-rather-than-annual', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'communication', 'mammogram-biennial-rather-than-annual', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-123", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210124', 'usmle-step-2', 'gynecology',
  $sc$A 74-year-old woman who works as a map drafter is seen in the drafting-office clinic wondering if this birthday ends mammography. The last mammogram was two years ago and showed no suspicious mass. She has no lump and no nipple discharge. A neighbor stopped at age 70 and suggested she do the same. Drafting lamps are on most afternoons. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 140/78 mm Hg. The prior report describes no suspicious finding. Body mass index is 28 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Stop, because the recommendation ends at age 70", "Switch to annual mammography at age 74", "Replace mammography with routine screening MRI", "Continue biennial mammography; age 74 is still included", "Evidence is insufficient at 74, so stopping is automatic"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "mammogram-still-indicated-at-74", "taskCategory": "health-maintenance"}$op$,
  $ky$Continue biennial mammography; age 74 is still included$ky$,
  $ex$Biennial mammography is recommended for women ages 40 to 74. She is 74, so she is still in that span. The last mammogram was two years ago. "Stop, because the recommendation ends at age 70" is not the best choice because The upper age in the recommendation is 74, not 70. "Switch to annual mammography at age 74" is not the best choice because The interval stays biennial. Annual screening has a less favorable benefit-harm balance. "Replace mammography with routine screening MRI" is not the best choice because Routine screening MRI is not the replacement. Supplemental MRI for dense breasts is an I statement, not a routine switch. "Evidence is insufficient at 74, so stopping is automatic" is not the best choice because The I statement is for age 75 and older, where evidence is insufficient to make an automatic stop or start. Age 74 is still inside the biennial recommendation.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'cb478bfc0d9e96fac49b2f4778e1bd1593985b8e66c9e57eabfd2668805e585a', false, NOW(), NOW(), 2,
  'mammogram-still-indicated-at-74', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'mammogram-still-indicated-at-74', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-124", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210125', 'usmle-step-2', 'gynecology',
  $sc$A 76-year-old woman who works as a speech therapist is seen in the clinic after a school contract asking if she is required to stop mammography. She has been screened biennially, and the last film two years ago showed no suspicious mass. She has no lump. A form letter said screening programs end at 75, and she wants to know if that letter is a rule. She is not asking to begin a brand-new test she has never had. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 138/76 mm Hg. The last mammogram report shows no suspicious mass. Body mass index is 25 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["She must stop screening now that she is 75 or older", "Annual mammography becomes mandatory after age 75", "MRI replaces mammography for every woman 75 and older", "Biennial mammography is still a firm recommendation at 76 at the present visit", "Evidence is insufficient for an automatic stop or start at this age"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "mammogram-age-76-evidence-insufficient", "taskCategory": "interpretation"}$op$,
  $ky$Evidence is insufficient for an automatic stop or start at this age$ky$,
  $ex$For age 75 and older, evidence is insufficient to assess the balance of benefits and harms, and the statement is not an automatic stop or an automatic start. She is 76. The firm biennial recommendation applies through age 74. "She must stop screening now that she is 75 or older" is not the best choice because Age 75 and older is an I statement. Evidence is insufficient, and stopping is not automatic. "Annual mammography becomes mandatory after age 75" is not the best choice because Annual mammography is not made mandatory after 75. Even at 40 to 74, biennial screening has the better benefit-harm balance. "MRI replaces mammography for every woman 75 and older" is not the best choice because MRI is not the routine replacement at 75. Supplemental MRI for dense breasts is a separate I statement. "Biennial mammography is still a firm recommendation at 76 at the present visit" is not the best choice because The biennial recommendation is for ages 40 to 74. At 76 it is not still a firm recommendation; the evidence is insufficient.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '81df834edf7168563c9b36f92b3db84150466b572456c6359b032a240c100fe4', false, NOW(), NOW(), 4,
  'mammogram-age-76-evidence-insufficient', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'mammogram-age-76-evidence-insufficient', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-125", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210126', 'usmle-step-2', 'gynecology',
  $sc$A 46-year-old woman who works as a candlemaker is seen in the studio gynecology office after a negative mammogram that mentions dense tissue. The report says the tissue is heterogeneously dense and describes no suspicious mass. She has no lump and no nipple discharge. A website told her that density alone means she should add ultrasound or MRI every year. Wax orders are piled on the counter. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The mammogram is negative aside from the density description. Body mass index is 29 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Routine supplemental ultrasound or MRI is not recommended", "Add screening ultrasound every year because the tissue is dense", "Add screening MRI every year because the mammogram was negative", "Stop mammography and use ultrasound alone from now on", "Density moves her out of the biennial mammography recommendation"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "dense-breast-no-routine-supplemental-imaging", "taskCategory": "interpretation"}$op$,
  $ky$Routine supplemental ultrasound or MRI is not recommended$ky$,
  $ex$For dense breasts and a negative mammogram, supplemental ultrasound or MRI has an I statement. It is not recommended as routine. Biennial mammography remains the screening approach for women 40 to 74, and she is 46. Digital mammography and tomosynthesis are both effective. "Add screening ultrasound every year because the tissue is dense" is not the best choice because Supplemental ultrasound for dense breasts after a negative mammogram is an I statement. It is not recommended as a routine yearly test. "Add screening MRI every year because the mammogram was negative" is not the best choice because Supplemental MRI in that setting is also an I statement, not a routine yearly addition. "Stop mammography and use ultrasound alone from now on" is not the best choice because Ultrasound does not replace mammography in this recommendation. "Density moves her out of the biennial mammography recommendation" is not the best choice because Breast density does not remove her from the 40-to-74 biennial mammography recommendation.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', '4f3889026736e8145a5caead38a908ce819a2200ed3239a87a14752c676bd08b', false, NOW(), NOW(), 3,
  'dense-breast-no-routine-supplemental-imaging', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dense-breast-no-routine-supplemental-imaging', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-126", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210127', 'usmle-step-2', 'gynecology',
  $sc$A 60-year-old woman who works as a clockmaker is seen in the bench-town clinic told that only a 3-D mammogram counts. The local site can do digital mammography today and digital breast tomosynthesis next month. Her last screening mammogram was two years ago and showed no suspicious mass. She has no lump. A repair deadline is tomorrow, and she does not want a wasted trip if today's machine is unacceptable. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 132/78 mm Hg. The prior report describes no suspicious finding. Body mass index is 27 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Only tomosynthesis is effective, so she should wait a month", "Digital mammography and tomosynthesis are both effective", "Only plain digital mammography is effective", "Neither technology is useful after age 55", "Ultrasound must be paired with whichever machine she chooses"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "digital-mammogram-and-tomosynthesis-both-effective", "taskCategory": "interpretation"}$op$,
  $ky$Digital mammography and tomosynthesis are both effective$ky$,
  $ex$Digital mammography and digital breast tomosynthesis are both effective. She is 60, inside the 40-to-74 biennial recommendation, and the last mammogram was two years ago. Either technology can be used. "Only tomosynthesis is effective, so she should wait a month" is not the best choice because Tomosynthesis is effective, but it is not the only effective technology. Waiting is not required. "Only plain digital mammography is effective" is not the best choice because Digital mammography is effective, and so is tomosynthesis. One does not exclude the other. "Neither technology is useful after age 55" is not the best choice because Screening remains in view through age 74. Age 55 is not a technology cutoff. "Ultrasound must be paired with whichever machine she chooses" is not the best choice because Routine supplemental ultrasound is not required. For dense breasts it is an I statement, and density is not the issue in this visit.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'a235ba08fd459851ba78076230904557535a7992b1bee6eb4ebae08f464f7717', false, NOW(), NOW(), 2,
  'digital-mammogram-and-tomosynthesis-both-effective', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'digital-mammogram-and-tomosynthesis-both-effective', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-127", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210128', 'usmle-step-2', 'gynecology',
  $sc$A 70-year-old woman who works as a cattle buyer is seen in the auction-day clinic whose last mammogram was three years ago. That film showed no suspicious mass. She has no lump and no nipple discharge. A buyer at the rail told her that after 65 the interval becomes five years, like a cervical test. She is in town only for the auction. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 142/80 mm Hg. The three-year-old report describes no suspicious finding. Body mass index is 31 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Wait two more years so the gap becomes five years", "Stop screening, because the recommendation ends at 65 during today's visit", "Biennial mammography is still recommended, and she is due", "Switch to annual mammography for the rest of her life", "Order MRI instead, because three years have passed"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "reproductive-endocrine", "blueprintTopic": "mammogram-biennial-still-due-at-70", "taskCategory": "health-maintenance"}$op$,
  $ky$Biennial mammography is still recommended, and she is due$ky$,
  $ex$Biennial mammography is recommended for women 40 to 74. She is 70, and the last mammogram was 3 years ago, which is longer than the 2-year interval. She is due for biennial mammography. Digital mammography and tomosynthesis are both effective. "Wait two more years so the gap becomes five years" is not the best choice because The mammography interval is 2 years, not 5. A five-year gap is a cervical-screening interval for some strategies, not the breast interval. "Stop screening, because the recommendation ends at 65 during today's visit" is not the best choice because Breast screening in this recommendation does not end at 65. It runs through age 74. "Switch to annual mammography for the rest of her life" is not the best choice because Annual mammography has a less favorable benefit-harm balance than biennial screening. It is not the plan for the rest of her life. "Order MRI instead, because three years have passed" is not the best choice because MRI is not the routine next test because a mammogram is overdue. Supplemental MRI is an I statement in a different situation.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "reproductive-endocrine", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '93bedf7810efbd18a02893651ecaf03c8c087e3981c5c7a9d3336e971ba0987d', false, NOW(), NOW(), 3,
  'mammogram-biennial-still-due-at-70', 'reproductive-endocrine', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'mammogram-biennial-still-due-at-70', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-128", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210129', 'usmle-step-2', 'psychiatry',
  $sc$A 44-year-old man who works as a lighthouse keeper is seen in the dockside clinic for a routine visit and reports that he feels well. He has no diagnosed mental health disorder and has never been asked a set of mood questions. Nobody in his family has been treated for a similar illness, and he describes no major trauma. He still rows a skiff three mornings a week, and his weight is stable at 81 kg. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. Sleep has been about 7 hours a night for the past month, and he has not lost interest in keeping the lamp or the logbook.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Skip screening because he has no family history and no trauma history during today's visit", "Limit screening to adults who already have recognized daily symptoms", "Replace depression screening with routine suicide-risk screening", "Screen for depression even though he feels well and has no risk factors", "Wait for a published best interval before offering any first screen"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-screen-first-visit-feels-well", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression even though he feels well and has no risk factors$ky$,
  $ex$USPSTF recommends screening adults 19 or older for depression, a Grade B recommendation, including people who feel well. Screening is for people without a diagnosed mental health disorder and without recognized symptoms, and it is done regardless of risk factors. A pragmatic approach is to screen adults who have not been screened before. "Skip screening because he has no family history and no trauma history during today's visit" is not the best choice because Family history and trauma are risk factors, but they do not restrict screening to high-risk people. Missing those factors is not a reason to skip the screen. "Limit screening to adults who already have recognized daily symptoms" is not the best choice because Recognized symptoms move a person out of the screening population and into clinical assessment and treatment. This man has no such symptoms, which is the group screening is meant for. "Replace depression screening with routine suicide-risk screening" is not the best choice because Screening for suicide risk is an I statement, so the evidence is insufficient. It is not a routine recommendation equal to depression screening. "Wait for a published best interval before offering any first screen" is not the best choice because No evidence defines the best interval. That gap does not cancel the first screen of someone who has never been screened.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '9d0a12768836672a6a321daa4328c00f8f96d66e0583a149a7412fb96b4afe28', false, NOW(), NOW(), 1,
  'dep-screen-first-visit-feels-well', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-screen-first-visit-feels-well', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-129", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210130', 'usmle-step-2', 'psychiatry',
  $sc$A 19-year-old woman who works as a florist apprentice is seen in the campus health clinic the week after her nineteenth birthday for a checkup. She has no diagnosed mental health disorder. She enjoys arranging wholesale tulips, sleeps about 8 hours, and has not lost interest in classes. There is no family history of a mood disorder and no history of trauma. She has never completed a mood screen. Temperature is 36.5°C, pulse is 76/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Her weight is 58 kg and has not changed in 6 months. She is not pregnant.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Defer screening until age 65, when the recommendation first applies", "Skip screening because she has no risk factors and feels well", "Use routine suicide-risk screening as the Grade B service at this age", "Require a diagnosed mental health disorder before any screen is offered", "Screen for depression because the adult recommendation includes age 19"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-screen-starts-at-age-nineteen", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression because the adult recommendation includes age 19$ky$,
  $ex$The depression-screening recommendation applies to people 19 or older who do not already have a diagnosed mental health disorder and are not showing recognized symptoms. She is 19, feels well, and has never been screened, so screening is appropriate. It is a Grade B recommendation and does not wait for risk factors. "Defer screening until age 65, when the recommendation first applies" is not the best choice because Age 65 is included, but it is not the age at which screening starts. The recommendation applies from age 19 upward, including adults 65 or older. "Skip screening because she has no risk factors and feels well" is not the best choice because Feeling well and lacking risk factors describes the screening population. Risk factors do not have to be present. "Use routine suicide-risk screening as the Grade B service at this age" is not the best choice because Suicide-risk screening is an I statement and is not a Grade B recommendation equal to depression screening. "Require a diagnosed mental health disorder before any screen is offered" is not the best choice because People who already have a diagnosed mental health disorder are outside the screening population. She has no such diagnosis, so screening applies.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'ee5e55f4f857d86a7f3ab18b0e5bde93f6f1a8014bed37ccbc03cfe6388c3a12', false, NOW(), NOW(), 2,
  'dep-screen-starts-at-age-nineteen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-screen-starts-at-age-nineteen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-130", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210131', 'usmle-step-2', 'psychiatry',
  $sc$A 18-year-old man who works as a grocery clerk is seen in the community clinic for a sports physical requested by his summer league. He turned 18 last month. He has no diagnosed mental health disorder, sleeps 8 hours, and still plays pickup basketball 4 evenings a week. He has never been asked mood questions. He reports no trauma and no family history of a mood disorder. He is not taking any medicine. Temperature is 36.7°C, pulse is 68/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. His weight is 70 kg. He says his mood has been ordinary for the past 3 months.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["This adult recommendation applies at age 19 or older and does not include him", "Screen now because this adult recommendation begins at age 18", "Screen now because age 18 is handled the same way as age 65", "Routine suicide-risk screening is the Grade B service at his age", "Absence of risk factors is what moves the start of screening to age 19 at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-eighteen-outside-adult-screen", "taskCategory": "interpretation"}$op$,
  $ky$This adult recommendation applies at age 19 or older and does not include him$ky$,
  $ex$Depression screening in this recommendation applies to people 19 or older who do not already have a diagnosed mental health disorder and are not showing recognized symptoms. He is 18, so this adult recommendation does not direct his screening. The statement does not lower the age to 18. "Screen now because this adult recommendation begins at age 18" is not the best choice because The age threshold in this recommendation is 19 or older, not 18. "Screen now because age 18 is handled the same way as age 65" is not the best choice because Adults 65 or older are included in the same recommendation that starts at age 19. Age 18 is not given that inclusion. "Routine suicide-risk screening is the Grade B service at his age" is not the best choice because Suicide-risk screening is an I statement, not a Grade B recommendation, and that fact does not change the age bound of 19. "Absence of risk factors is what moves the start of screening to age 19 at the present visit" is not the best choice because Risk factors do not set the age threshold. Screening is recommended regardless of risk factors once the person is 19 or older and is otherwise in the screening population.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', '219f85415fd99906081b2c2f2fa8d72dec3c9abb3a3f0fe64fc645bbeed677d5', false, NOW(), NOW(), 4,
  'dep-eighteen-outside-adult-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dep-eighteen-outside-adult-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-131", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210132', 'usmle-step-2', 'psychiatry',
  $sc$A 27-year-old woman who works as a seed-catalog editor is seen in the prenatal clinic at 18 weeks of gestation for a routine prenatal visit. She has no diagnosed mental health disorder and has never had a mood screen. She is excited about a spring bulb supplement she is editing, sleeps 7 hours, and has not lost interest in her work. There is no family history of a mood disorder. The fetal heart rate is 150/min. Temperature is 36.6°C, pulse is 84/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. She has gained 4 kg in the pregnancy and reports no pervasive low mood over the past month.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Postpone all mood screening until 6 weeks after delivery", "Screen for depression; pregnancy is included in the adult recommendation", "Skip screening because she has no risk factors and feels well", "Limit pregnancy screening to routine suicide-risk questionnaires before the patient leaves", "Screen only if a prior mood episode is already on the chart"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-pregnant-well-still-screen", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression; pregnancy is included in the adult recommendation$ky$,
  $ex$The Grade B recommendation says to screen adults for depression, explicitly including pregnant people, when they are 19 or older, have no diagnosed mental health disorder, and have no recognized symptoms. She is 27 and pregnant, so screening applies now. It is not withheld until the postpartum visit. "Postpone all mood screening until 6 weeks after delivery" is not the best choice because Postpartum people are also included, but pregnancy itself is a reason the recommendation applies, not a reason to wait. "Skip screening because she has no risk factors and feels well" is not the best choice because Absence of risk factors and absence of symptoms fit the screening population. Screening does not require risk factors. "Limit pregnancy screening to routine suicide-risk questionnaires before the patient leaves" is not the best choice because Suicide-risk screening is an I statement and is not a substitute Grade B recommendation for depression screening. "Screen only if a prior mood episode is already on the chart" is not the best choice because A prior episode is one risk factor and does not define who may be screened. Screening is recommended regardless of risk factors.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'ec5436aef3a6c5c9cc1b30185e6714bf1fd727d013cb4a058b95ddb3ba9ee436', false, NOW(), NOW(), 2,
  'dep-pregnant-well-still-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-pregnant-well-still-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-132", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210133', 'usmle-step-2', 'psychiatry',
  $sc$A 31-year-old woman who works as a violin restorer is seen in the postpartum clinic 6 weeks after an uncomplicated vaginal birth. She has no diagnosed mental health disorder. She is breastfeeding, sleeping in 3-hour stretches between infant feeds, and still enjoys varnish work on a borrowed instrument for a few minutes a day. She has never completed a mood screen. The infant is 6 weeks old and weighs 4500 g. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 114/72 mm Hg. She describes her mood as steady and has had no pervasive loss of interest since the birth.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Mood screening ended at delivery and does not resume at 6 weeks", "Skip screening because she is coping and has no trauma history", "Screen for depression; postpartum adults are included in the recommendation", "Offer only routine suicide-risk screening at the postpartum visit in the office today", "Wait until she is 65, when adult mood screening starts"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-postpartum-well-still-screen", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression; postpartum adults are included in the recommendation$ky$,
  $ex$USPSTF recommends depression screening for adults 19 or older, explicitly including postpartum people, when there is no diagnosed mental health disorder and no recognized symptoms. She is 31 and 6 weeks postpartum, so a screen is appropriate. The recommendation is Grade B. "Mood screening ended at delivery and does not resume at 6 weeks" is not the best choice because The recommendation includes postpartum people. Delivery does not close the screening window. "Skip screening because she is coping and has no trauma history" is not the best choice because Coping well and lacking a trauma history does not remove screening. Risk factors are not required. "Offer only routine suicide-risk screening at the postpartum visit in the office today" is not the best choice because Suicide-risk screening is an I statement and is not the Grade B recommendation in place of depression screening. "Wait until she is 65, when adult mood screening starts" is not the best choice because Screening applies from age 19, including adults 65 or older. It does not begin at 65.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '5bb5a33af55f6caeabdf730ab51f651c4a196584526d6f0df08436168cdc2431', false, NOW(), NOW(), 1,
  'dep-postpartum-well-still-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-postpartum-well-still-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-133", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210134', 'usmle-step-2', 'psychiatry',
  $sc$A 65-year-old man who works as a museum carpenter is seen in the primary care office on the week of his sixty-fifth birthday for a checkup. He has no diagnosed mental health disorder and has never been given a mood questionnaire. He is building a walnut display case, sleeps 7 hours, and still meets friends for chess on Thursdays. He reports no trauma history. His weight is 79 kg. Temperature is 36.5°C, pulse is 66/min, respirations are 14/min, and blood pressure is 128/74 mm Hg. He says the past 2 months have been ordinary, with no pervasive low mood and no loss of pleasure.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Stop mood screening at age 65 because the adult recommendation ends there during today's visit", "Screen only if a family history or a prior episode is documented", "Substitute routine suicide-risk screening, which has equal evidence", "Screen for depression; adults 65 or older are included in the recommendation", "Defer the first screen until a best interval is defined by trials"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-sixty-five-included", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression; adults 65 or older are included in the recommendation$ky$,
  $ex$The recommendation is to screen adults for depression, and it explicitly includes adults 65 or older, as a Grade B service. He is 65, has no diagnosed mental health disorder, has no recognized symptoms, and has not been screened. Age 65 does not end screening. "Stop mood screening at age 65 because the adult recommendation ends there during today's visit" is not the best choice because Adults 65 or older are named in the population to screen. The recommendation does not stop at that birthday. "Screen only if a family history or a prior episode is documented" is not the best choice because Family history and a prior episode are risk factors, not requirements. Screening is recommended regardless of risk factors. "Substitute routine suicide-risk screening, which has equal evidence" is not the best choice because Suicide-risk screening is an I statement. It is not equal to the Grade B depression-screening recommendation. "Defer the first screen until a best interval is defined by trials" is not the best choice because Lack of a proven interval does not block screening of someone who has never been screened.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'aea1d405e9144a7ee0053724c1e5d96b39928afc28b6231cc04cf9f49db1365c', false, NOW(), NOW(), 2,
  'dep-sixty-five-included', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-sixty-five-included', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-134", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210135', 'usmle-step-2', 'psychiatry',
  $sc$A 72-year-old woman who works as a quilt-pattern archivist is seen in the geriatric clinic for an annual visit and says her days feel ordinary. She has no diagnosed mental health disorder. She catalogs cotton swatches for a regional textile library, walks to the reading room 4 days a week, and has never been offered a mood screen. Her weight is 63 kg and is unchanged from last year. Temperature is 36.4°C, pulse is 72/min, respirations are 16/min, and blood pressure is 134/76 mm Hg. She sleeps about 7 hours and has not stopped enjoying the archive or her Sunday soup club.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Skip screening because she is older than 65 and feels well", "Screen only after a family history of a mood disorder is found", "Make routine suicide-risk screening the recommended service instead", "Withhold screening until she develops recognized daily symptoms", "Screen for depression because adults 65 or older are included"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-seventy-two-included", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression because adults 65 or older are included$ky$,
  $ex$Adults 65 or older are included in the Grade B recommendation to screen for depression. She is 72, has no diagnosed mental health disorder, and has no recognized symptoms, so she is in the screening population. Feeling well does not remove the recommendation. "Skip screening because she is older than 65 and feels well" is not the best choice because Age above 65 does not end the recommendation. Adults 65 or older are specifically included, including people who feel well. "Screen only after a family history of a mood disorder is found" is not the best choice because Screening is recommended regardless of risk factors such as family history. A family history is not required. "Make routine suicide-risk screening the recommended service instead" is not the best choice because Suicide-risk screening is an I statement and is not a replacement for depression screening. "Withhold screening until she develops recognized daily symptoms" is not the best choice because Recognized symptoms take a person out of screening and into assessment and treatment. She has no recognized symptoms, so screening is the right service.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '324db24a4f37fa94763ae9130b492a71f22b5de83b5099392327735586e1ec3b', false, NOW(), NOW(), 1,
  'dep-seventy-two-included', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-seventy-two-included', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-135", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210136', 'usmle-step-2', 'psychiatry',
  $sc$A 36-year-old woman who works as an orchard pruner is seen in the rural clinic for a pre-employment visit before pear season. She has no diagnosed mental health disorder. She has no family history of a mood disorder, no prior similar episode, and no history of trauma. She has never had a mood screen. She sleeps 7 hours and still enjoys dawn shifts among the trellises. Her weight is 66 kg. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Over the past 21 days she reports steady energy and no pervasive low mood.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Screen for depression; the recommendation does not require a risk factor", "Do not screen, because family history, trauma, and a prior episode are absent", "Screen only after recognized symptoms have been present for weeks", "Routine suicide-risk screening is preferred when no risk factor exists", "The missing risk factors mean screening starts only at age 65"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-screen-without-any-risk-factor", "taskCategory": "interpretation"}$op$,
  $ky$Screen for depression; the recommendation does not require a risk factor$ky$,
  $ex$Screening for depression is recommended for adults 19 or older regardless of risk factors. Family history, a prior episode, and trauma do not restrict screening to high-risk people, and their absence does not cancel it. She is 36, has no diagnosis, and has no recognized symptoms. "Do not screen, because family history, trauma, and a prior episode are absent" is not the best choice because Those three items are examples of risk factors, not entry criteria. People without them are still screened. "Screen only after recognized symptoms have been present for weeks" is not the best choice because Recognized symptoms place someone outside the screening population. Screening is for people who are not already showing those symptoms. "Routine suicide-risk screening is preferred when no risk factor exists" is not the best choice because Suicide-risk screening remains an I statement. Low risk does not turn it into the preferred Grade B service. "The missing risk factors mean screening starts only at age 65" is not the best choice because The age inclusion of adults 65 or older does not mean younger adults without risk factors are excluded. The recommendation starts at age 19.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'd496e567ca8cf289272179d58fb88de369ae1daae3300d1b9033462578d8bd2d', false, NOW(), NOW(), 3,
  'dep-screen-without-any-risk-factor', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dep-screen-without-any-risk-factor', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-136", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210137', 'usmle-step-2', 'psychiatry',
  $sc$A 41-year-old man who works as a map archivist is seen in the faculty clinic to review records before a cataloging fellowship. His mother was treated for a mood disorder years ago. He himself has no diagnosed mental health disorder, has never been screened, and describes no current low mood or loss of interest. A colleague says mood screening should be reserved for people who have a family history like his. He sleeps 7 hours. His weight is 84 kg. Temperature is 36.7°C, pulse is 70/min, respirations are 15/min, and blood pressure is 124/78 mm Hg. He still hikes on Saturdays and has had no weight change in 4 months.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Screen him only, because a family history is required before screening", "Screen him, and do not limit depression screening to people with a family history", "Skip him, because a family history means he already has the disorder", "Replace the mood screen with routine suicide-risk screening for this patient before the patient leaves", "Defer screening until a best interval for high-risk families is published"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-family-history-does-not-limit-screen", "taskCategory": "interpretation"}$op$,
  $ky$Screen him, and do not limit depression screening to people with a family history$ky$,
  $ex$Family history is a risk factor, but risk factors do not restrict depression screening to high-risk adults. Adults 19 or older without a diagnosed mental health disorder and without recognized symptoms are screened whether or not a family history is present. He should be screened, and so should adults without that history. "Screen him only, because a family history is required before screening" is not the best choice because A family history is not a prerequisite. Screening is recommended regardless of risk factors. "Skip him, because a family history means he already has the disorder" is not the best choice because A family history does not establish a diagnosed mental health disorder in him. He has no diagnosis and no recognized symptoms, so he remains in the screening population. "Replace the mood screen with routine suicide-risk screening for this patient before the patient leaves" is not the best choice because Suicide-risk screening is an I statement and does not replace Grade B depression screening. "Defer screening until a best interval for high-risk families is published" is not the best choice because No evidence defines the best interval, and that fact does not create a separate high-risk-only pathway.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'c0860b65d13672c41e2c3e6abe2c327b4370ea574075461c80d95b34f9faeb12', false, NOW(), NOW(), 3,
  'dep-family-history-does-not-limit-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dep-family-history-does-not-limit-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-137", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210138', 'usmle-step-2', 'psychiatry',
  $sc$A 53-year-old woman who works as a ferry dispatcher is seen in the waterfront clinic for a required annual exam and says she feels steady. The clinic draft protocol would offer a mood screen only to adults who report trauma. She reports no trauma, has no diagnosed mental health disorder, and has never been screened. She still enjoys dawn shift changes and sleeps 6 to 7 hours. Her weight is 71 kg. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 126/80 mm Hg. She has had no pervasive low mood and no loss of interest during the past 30 days.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Follow the draft and screen only adults who report trauma", "Skip screening until she is 65, because she has no trauma history", "Screen for depression even though she reports no trauma history", "Offer routine suicide-risk screening in place of a mood screen", "Treat a missing trauma history as a diagnosed mental health disorder"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-trauma-history-does-not-limit-screen", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression even though she reports no trauma history$ky$,
  $ex$Trauma is a risk factor, not a gate. Depression screening is recommended for adults 19 or older regardless of risk factors, including people with no trauma history, when they have no diagnosed mental health disorder and no recognized symptoms. She is 53 and has not been screened. "Follow the draft and screen only adults who report trauma" is not the best choice because Limiting screening to people with trauma would restrict it to a high-risk group, which this recommendation does not do. "Skip screening until she is 65, because she has no trauma history" is not the best choice because Adults 65 or older are included, but screening does not begin at 65 and does not depend on trauma. "Offer routine suicide-risk screening in place of a mood screen" is not the best choice because Suicide-risk screening is an I statement and is not an equal substitute for depression screening. "Treat a missing trauma history as a diagnosed mental health disorder" is not the best choice because Absence of trauma is not a diagnosis. She has no diagnosed mental health disorder, so she remains eligible for screening.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'd550b5ed6dbfb34aa0ea0843b7f4fa2d336ffc9f76a39d3dd9eebd4a9bd215f2', false, NOW(), NOW(), 3,
  'dep-trauma-history-does-not-limit-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-trauma-history-does-not-limit-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-138", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210139', 'usmle-step-2', 'psychiatry',
  $sc$A 47-year-old man who works as a cartographer is seen in the outpatient office for a blood-pressure follow-up and feels like his usual self. He has never had a mood episode and has no diagnosed mental health disorder. A partner in the practice screens only patients who recall a prior episode. He has never been screened. He still drafts coastal charts in the evening and sleeps 7 hours. His weight is 88 kg. Temperature is 36.8°C, pulse is 80/min, respirations are 14/min, and blood pressure is 132/82 mm Hg. The past 5 weeks included no pervasive low mood and no loss of interest in drafting.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Skip him until he has had at least one prior mood episode", "A missing prior episode means the recommendation starts at age 65", "Routine suicide-risk screening replaces mood screening in this case", "Do not limit depression screening to adults with a prior episode", "Count him as already diagnosed because the prior-episode box is blank"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-prior-episode-does-not-limit-screen", "taskCategory": "interpretation"}$op$,
  $ky$Do not limit depression screening to adults with a prior episode$ky$,
  $ex$A prior episode is listed as a risk factor, and risk factors do not restrict screening to high-risk people. Adults 19 or older without a current diagnosed mental health disorder and without recognized symptoms are screened even if they have never had an episode. He should be offered depression screening. "Skip him until he has had at least one prior mood episode" is not the best choice because Requiring a prior episode would screen only a higher-risk slice of adults, which is not the recommendation. "A missing prior episode means the recommendation starts at age 65" is not the best choice because The recommendation applies from age 19 and also includes adults 65 or older. A missing prior episode does not move the start age. "Routine suicide-risk screening replaces mood screening in this case" is not the best choice because Suicide-risk screening is an I statement, not a Grade B replacement for depression screening. "Count him as already diagnosed because the prior-episode box is blank" is not the best choice because He has no diagnosed mental health disorder. An empty history is not a diagnosis, and people without a diagnosis are the screening population.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', '8260e7fe1a5b237aa7f63688154816ebe4e5c27f828e3e010e02315c033232ca', false, NOW(), NOW(), 3,
  'dep-prior-episode-does-not-limit-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dep-prior-episode-does-not-limit-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-139", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210140', 'usmle-step-2', 'psychiatry',
  $sc$A 39-year-old woman who works as a glassblower is seen in the art-district clinic for a new-patient visit and says her mood is steady. She has no diagnosed mental health disorder and has never been screened. She sleeps 7 hours, still enjoys the furnace shift, and has had no pervasive low mood. A trainee asks whether routine suicide-risk screening carries the same recommendation as a mood screen. Her weight is 60 kg. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/74 mm Hg. She reports no loss of interest over the past 14 days and no trauma history.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Routine suicide-risk screening is a Grade B service equal to mood screening at this encounter", "Neither screen is recommended unless a risk factor is already present", "Suicide-risk screening replaces mood screening when the patient feels well", "Mood screening is withheld until a best interval is proven in trials", "Depression screening is recommended; routine suicide-risk screening is an I statement"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-suicide-screen-is-i-statement", "taskCategory": "interpretation"}$op$,
  $ky$Depression screening is recommended; routine suicide-risk screening is an I statement$ky$,
  $ex$Screening adults 19 or older for depression is a Grade B recommendation for people without a diagnosed mental health disorder and without recognized symptoms. Screening for suicide risk is an I statement, meaning evidence is insufficient. It should not be presented as a routine recommendation equal to depression screening. "Routine suicide-risk screening is a Grade B service equal to mood screening at this encounter" is not the best choice because The I statement means the evidence is insufficient. It does not give suicide-risk screening the same standing as Grade B depression screening. "Neither screen is recommended unless a risk factor is already present" is not the best choice because Depression screening is recommended regardless of risk factors. Lack of a risk factor does not cancel it. "Suicide-risk screening replaces mood screening when the patient feels well" is not the best choice because Feeling well is the usual state of the screening population. It does not swap the Grade B service for an I-statement service. "Mood screening is withheld until a best interval is proven in trials" is not the best choice because No evidence defines the best interval, but that does not withhold screening from someone who has not been screened.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', '276326ef0e7bec6d1eda61da4528132c13f7f2fa003500685a70744b2309c335', false, NOW(), NOW(), 3,
  'dep-suicide-screen-is-i-statement', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dep-suicide-screen-is-i-statement', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-140", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210141', 'usmle-step-2', 'psychiatry',
  $sc$A 58-year-old man who works as a tugboat engineer is seen in the occupational clinic for a license renewal exam and says he feels well. The clinic proposes dropping mood questionnaires and using only a routine suicide-risk screen for every adult license visit. He has no diagnosed mental health disorder, has never had a mood screen, and describes no current symptoms. He still fishes after shifts. His weight is 91 kg. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. Sleep is about 7 hours, and he has had no loss of interest in the past month.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Keep depression screening; do not swap it for routine suicide-risk screening", "Adopt routine suicide-risk screening as the equal recommended service at this encounter", "Drop both screens because he has no family history and no trauma", "Offer a mood screen only after recognized symptoms are documented", "Delay any screen until research names a single best interval"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-do-not-replace-with-suicide-screen", "taskCategory": "health-maintenance"}$op$,
  $ky$Keep depression screening; do not swap it for routine suicide-risk screening$ky$,
  $ex$Depression screening for adults 19 or older is recommended (Grade B) when there is no diagnosed mental health disorder and no recognized symptoms. Suicide-risk screening is an I statement and is not a routine recommendation of equal strength. Replacing the mood screen with it does not follow the recommendation. "Adopt routine suicide-risk screening as the equal recommended service at this encounter" is not the best choice because An I statement is not equal to the Grade B depression-screening recommendation, so it should not be adopted as the substitute routine screen. "Drop both screens because he has no family history and no trauma" is not the best choice because Screening does not depend on family history or trauma. Those risk factors do not have to be present. "Offer a mood screen only after recognized symptoms are documented" is not the best choice because Recognized symptoms move the visit from screening to assessment and treatment. He has none, so screening still applies. "Delay any screen until research names a single best interval" is not the best choice because The lack of a best interval does not mean the first depression screen should be dropped.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c09cc1a19280798425167a4667092359d612a1daf10205e72bf5190a5be453c0', false, NOW(), NOW(), 4,
  'dep-do-not-replace-with-suicide-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-do-not-replace-with-suicide-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-141", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210142', 'usmle-step-2', 'psychiatry',
  $sc$A 49-year-old woman who works as a conservatory piano tuner is seen in the faculty practice for a visit 14 months after a prior mood screen. That earlier screen did not lead to a diagnosis, and she still has no diagnosed mental health disorder. She feels well, sleeps 7 hours, and continues to tune concert instruments. She asks whether evidence requires another screen at a fixed 12-month mark. Her weight is 64 kg. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. She reports no pervasive low mood and no loss of interest over the past 3 weeks.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Evidence requires a repeat mood screen every 12 months for every adult", "No evidence sets a best interval; repeat screening is a matter of judgment", "One negative screen is the proven lifetime interval, so never repeat it during today's visit", "Repeat screening is indicated only if a new trauma history appears", "A repeat visit should switch to routine suicide-risk screening instead"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-interval-not-established", "taskCategory": "interpretation"}$op$,
  $ky$No evidence sets a best interval; repeat screening is a matter of judgment$ky$,
  $ex$No evidence defines the best screening interval for depression. A pragmatic approach is to screen people who have not been screened and to use judgment about repeat screening. A fixed 12-month rule is not established. She remains an adult 19 or older without a diagnosis and without recognized symptoms. "Evidence requires a repeat mood screen every 12 months for every adult" is not the best choice because A 12-month interval is not an evidence-based requirement. The recommendation states that no evidence defines the best interval. "One negative screen is the proven lifetime interval, so never repeat it during today's visit" is not the best choice because The recommendation does not define one lifetime screen as the proven schedule. Repeat screening is judged clinically. "Repeat screening is indicated only if a new trauma history appears" is not the best choice because New trauma is not required before repeat screening can be considered. Screening is recommended regardless of risk factors. "A repeat visit should switch to routine suicide-risk screening instead" is not the best choice because Suicide-risk screening is an I statement and is not the replacement for depression screening at a return visit.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', '176a86bf24cac8199b4afde73722c2a4dcb6be9acfe522d170119d5af1fc6a88', false, NOW(), NOW(), 3,
  'dep-interval-not-established', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dep-interval-not-established', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-142", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210143', 'usmle-step-2', 'psychiatry',
  $sc$A 51-year-old man who works as a subway signal maintainer is seen in the employee clinic for a first visit after 11 years without primary care. The chart has no mood screen and no diagnosed mental health disorder. He feels well, still coaches a weekend youth track club, and sleeps 7 hours. He had no pervasive low mood in the past month. His weight is 86 kg and is unchanged. Temperature is 36.8°C, pulse is 78/min, respirations are 15/min, and blood pressure is 128/80 mm Hg. He asks whether there is any point to a mood questionnaire on a first visit.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Skip the first screen until a best repeat interval is published", "Screen only if he is pregnant, postpartum, or 65 or older", "Screen for depression now because he has not been screened before", "Use routine suicide-risk screening as the first-visit recommendation", "Wait for recognized symptoms before asking any mood questions"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-unscreened-adult-screen-now", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression now because he has not been screened before$ky$,
  $ex$A pragmatic approach, when no evidence defines the best interval, is to screen adults who have not previously been screened. He is 51, has no diagnosed mental health disorder, and has no recognized symptoms, so he is in the Grade B screening population of adults 19 or older. "Skip the first screen until a best repeat interval is published" is not the best choice because The missing interval applies to how often to repeat a screen. It is not a reason to skip someone who has never been screened. "Screen only if he is pregnant, postpartum, or 65 or older" is not the best choice because Pregnant people, postpartum people, and adults 65 or older are included, but they are not the only adults. The recommendation covers adults 19 or older. "Use routine suicide-risk screening as the first-visit recommendation" is not the best choice because Suicide-risk screening is an I statement and is not the recommended first screen in place of depression screening. "Wait for recognized symptoms before asking any mood questions" is not the best choice because Recognized symptoms are a reason to assess and treat, not a requirement before screening. Screening is for people without those symptoms.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '9d0673c5105e2dcd68329241064124f86d97e3af40e74298fe9bb06001aa5983', false, NOW(), NOW(), 2,
  'dep-unscreened-adult-screen-now', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-unscreened-adult-screen-now', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-143", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210144', 'usmle-step-2', 'psychiatry',
  $sc$A 38-year-old man who works as a clock repairer is seen in the neighborhood clinic because he has felt sad nearly all day on most days for 6 weeks. He no longer enjoys gear work, which he used to do every evening. He wakes at 4 a.m. and cannot return to sleep, and he has lost 6 lb. He has no prior mental health diagnosis. He still comes to the shop but describes the days as empty. His weight today is 74 kg. Temperature is 36.7°C, pulse is 82/min, respirations are 16/min, and blood pressure is 124/78 mm Hg. The low mood and loss of pleasure have been present for about 45 days, and he has not started any treatment.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Decide whether depression screening is indicated before any assessment during today's visit", "Offer no treatment until a best screening interval is published", "Use routine suicide-risk screening as the Grade B treatment", "Begin clinical assessment and treatment rather than a screening decision", "Limit care to adults who also have a family history or trauma"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-symptoms-move-to-assessment", "taskCategory": "clinical-intervention"}$op$,
  $ky$Begin clinical assessment and treatment rather than a screening decision$ky$,
  $ex$Clear symptoms for about 6 weeks place him outside the screening population. The next step is clinical assessment and treatment, not a decision about whether screening is indicated. Treatment of major depression includes psychotherapy or pharmacotherapy. The source does not name a drug or a dose. "Decide whether depression screening is indicated before any assessment during today's visit" is not the best choice because He already has recognized symptoms, so the question is no longer whether to screen. Screening applies to people who are not showing those symptoms. "Offer no treatment until a best screening interval is published" is not the best choice because The unknown best interval is about repeat screening, not about withholding treatment from a symptomatic adult. "Use routine suicide-risk screening as the Grade B treatment" is not the best choice because Suicide-risk screening is an I statement about screening, not the Grade B treatment of a symptomatic episode. "Limit care to adults who also have a family history or trauma" is not the best choice because Risk factors do not restrict who can be cared for, and they are not required before assessment and treatment of clear symptoms.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '18685b4b0fb0fbe7e6f487cafb07d8afc1e642492afaacbeafb4b4da7a1b4ec5', false, NOW(), NOW(), 3,
  'dep-symptoms-move-to-assessment', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'dep-symptoms-move-to-assessment', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-144", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210145', 'usmle-step-2', 'psychiatry',
  $sc$A 29-year-old woman who works as a botanical illustrator is seen in the obstetric clinic at 22 weeks of gestation because she has been tearful most of every day. For 5 weeks she has had little pleasure in drawing, early waking, and a poor appetite, with a 3 kg loss from her prepregnancy weight of 62 kg. She has no prior mental health diagnosis. The fetal heart rate is 146/min. A student asks whether the visit should only decide if screening applies. Temperature is 36.8°C, pulse is 90/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. The low mood has been present on most days for 35 days, and no treatment has been started.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Only determine whether pregnancy mood screening is indicated", "Postpone care until postpartum because screening excludes pregnancy", "Treat only if a family history or a prior episode is also present", "Start routine suicide-risk screening as the pregnancy treatment", "Assess and treat the episode; do not stop at a screening decision"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-pregnant-symptoms-not-a-screen", "taskCategory": "clinical-intervention"}$op$,
  $ky$Assess and treat the episode; do not stop at a screening decision$ky$,
  $ex$Recognized symptoms place her outside the screening population even though the Grade B recommendation includes pregnant people. The next step is clinical assessment and treatment, not a decision about whether screening is indicated. Treatment of major depression includes psychotherapy or pharmacotherapy, and no drug or dose is named. "Only determine whether pregnancy mood screening is indicated" is not the best choice because She already has clear symptoms for 5 weeks. Pregnancy inclusion is about screening asymptomatic people, not about stopping at a screening decision when symptoms are present. "Postpone care until postpartum because screening excludes pregnancy" is not the best choice because Pregnant people are included in screening. Symptoms are a reason to assess and treat now, not a reason to wait until after birth. "Treat only if a family history or a prior episode is also present" is not the best choice because Risk factors do not have to be present before a symptomatic person is assessed and treated. "Start routine suicide-risk screening as the pregnancy treatment" is not the best choice because Suicide-risk screening is an I statement and is not the treatment of a symptomatic episode.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '81a5fdd8a54512c26bce45f9e6c960bd1f41c1ee8eed2656ef79f918bb53606f', false, NOW(), NOW(), 4,
  'dep-pregnant-symptoms-not-a-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'dep-pregnant-symptoms-not-a-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-145", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210146', 'usmle-step-2', 'psychiatry',
  $sc$A 34-year-old woman who works as a ceramic chemist is seen in the outpatient clinic to establish care after moving from another city. Eight weeks ago a clinician recorded a diagnosis after 6 weeks of pervasive low mood, loss of pleasure, and broken sleep. No treatment was started. She is still waking at 3 a.m. and has stopped her evening glaze tests. She is not pregnant. Her weight is 59 kg, down 2 kg. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. The recorded diagnosis is 8 weeks old, and she has had no psychotherapy and no medication.$sc$,
  $qu$Which of the following is the most appropriate treatment?$qu$,
  $op${"options": ["Psychotherapy or pharmacotherapy for major depression, with no named drug or dose", "A screening decision, because treatment waits on a new questionnaire", "Routine suicide-risk screening as the sole Grade B treatment", "Pharmacotherapy only, because psychotherapy is outside the recommendation", "No care until she is 65 or has a documented family history for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-known-diagnosis-start-treatment", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Psychotherapy or pharmacotherapy for major depression, with no named drug or dose$ky$,
  $ex$She already has a diagnosed mental health disorder, so she is outside the screening population of adults 19 or older who have no diagnosis. Treatment of major depression includes psychotherapy or pharmacotherapy. The recommendation does not name a drug or a dose. Either modality fits the stated treatment. "A screening decision, because treatment waits on a new questionnaire" is not the best choice because Screening is for people who do not already have a diagnosed mental health disorder and do not already have recognized symptoms. She needs treatment, not a screening decision. "Routine suicide-risk screening as the sole Grade B treatment" is not the best choice because Suicide-risk screening is an I statement and is not the treatment of major depression. "Pharmacotherapy only, because psychotherapy is outside the recommendation" is not the best choice because The stated treatment is psychotherapy or pharmacotherapy. Psychotherapy is included, not excluded. "No care until she is 65 or has a documented family history for this patient at the present visit" is not the best choice because Age 65 and family history are not gates on treatment. Screening itself is recommended regardless of risk factors and includes adults from age 19, but this visit is about treatment of an existing diagnosis.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '5e5d69da3b1c170604908b5caf29f4751ab1ea0c2a551cdfceb521a13e894f84', false, NOW(), NOW(), 3,
  'dep-known-diagnosis-start-treatment', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'dep-known-diagnosis-start-treatment', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-146", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210147', 'usmle-step-2', 'psychiatry',
  $sc$A 43-year-old man who works as a boat-sail maker is seen in the behavioral health clinic after 7 weeks of low mood on most of the day. He no longer enjoys loft work, wakes early, and has lost 5 lb from a prior weight of 82 kg. A diagnosis was made 2 weeks ago and no treatment has started. He asks whether talking therapy alone can be enough, because he prefers not to take a medicine. He is not sleepy in the daytime. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 120/76 mm Hg. Symptoms have been present for about 50 days, and he can attend a weekly visit.$sc$,
  $qu$Which of the following is the most appropriate treatment?$qu$,
  $op${"options": ["Pharmacotherapy is required; psychotherapy does not count as treatment", "Psychotherapy alone is an acceptable treatment for major depression", "A screening questionnaire is the treatment once a diagnosis exists", "Routine suicide-risk screening is the recommended treatment", "Treatment must wait for a family history or a trauma history"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-psychotherapy-or-pharmacotherapy", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Psychotherapy alone is an acceptable treatment for major depression$ky$,
  $ex$Treatment of major depression includes psychotherapy or pharmacotherapy. Psychotherapy alone matches that statement. The source does not name a drug or a dose. He is an adult older than 19 with a diagnosis, so this is treatment, not a screening decision. "Pharmacotherapy is required; psychotherapy does not count as treatment" is not the best choice because The recommendation says psychotherapy or pharmacotherapy. It does not require medication and does not exclude psychotherapy. "A screening questionnaire is the treatment once a diagnosis exists" is not the best choice because Once a diagnosed mental health disorder is present, the person is outside the screening population. A questionnaire is not the treatment. "Routine suicide-risk screening is the recommended treatment" is not the best choice because Suicide-risk screening is an I statement about screening, not the treatment of major depression. "Treatment must wait for a family history or a trauma history" is not the best choice because Risk factors do not have to be present before psychotherapy or pharmacotherapy is used.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '05678e5dc543d20b046a3bf5947408dc7cc87e47e0238209350977747d9d302f', false, NOW(), NOW(), 2,
  'dep-psychotherapy-or-pharmacotherapy', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'dep-psychotherapy-or-pharmacotherapy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-147", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210148', 'usmle-step-2', 'psychiatry',
  $sc$A 46-year-old woman who works as a textile chemist is seen in the primary care office to start care for a mood diagnosis made 3 weeks ago. She had 6 weeks of pervasive low mood, loss of pleasure, and early waking before that diagnosis. No medicine has been chosen. She asks which drug and which milligram dose the recommendation specifies. Her weight is 67 kg. She is not pregnant. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. She can attend therapy. Symptoms are still present most days, now for about 9 weeks in total.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy statement?$qu$,
  $op${"options": ["The recommendation names one drug and one starting dose to use first", "Pharmacotherapy is excluded; only a screening form is recommended", "Pharmacotherapy is included, but this recommendation names no drug and no dose", "A drug may be used only after routine suicide-risk screening is positive in the office today", "Medication is restricted to adults 65 or older with a prior episode"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-guideline-names-no-drug-dose", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Pharmacotherapy is included, but this recommendation names no drug and no dose$ky$,
  $ex$Treatment of major depression includes psychotherapy or pharmacotherapy. This recommendation does not name a drug or a dose. She is older than 19 and already has a diagnosis, so the visit is for treatment rather than the screening decision used for undiagnosed adults. "The recommendation names one drug and one starting dose to use first" is not the best choice because No drug and no dose are specified. Inventing one would go beyond the recommendation. "Pharmacotherapy is excluded; only a screening form is recommended" is not the best choice because Pharmacotherapy is included, as is psychotherapy. Screening is for people who do not already have a diagnosed disorder. "A drug may be used only after routine suicide-risk screening is positive in the office today" is not the best choice because Suicide-risk screening is an I statement and is not a required positive gate before treatment. "Medication is restricted to adults 65 or older with a prior episode" is not the best choice because The treatment statement is not limited to adults 65 or older and does not require a prior episode. Age 65 is about who is included in screening.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '755f40cf7fce4fb7391495db483369490a4ecf2c65fc606b4ba6433306101f73', false, NOW(), NOW(), 4,
  'dep-guideline-names-no-drug-dose', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'dep-guideline-names-no-drug-dose', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-148", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210149', 'usmle-step-2', 'psychiatry',
  $sc$A 52-year-old man who works as a foundry patternmaker is seen in the primary care clinic after a mood diagnosis was recorded 4 weeks ago. He had 2 months of low mood, loss of pleasure in the pattern shop, and broken sleep before the diagnosis. No treatment has started. The team is describing collaborative care and asks what the care manager is for. His weight is 90 kg. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 136/84 mm Hg. He is willing to be contacted between visits. Symptoms remain present on most days.$sc$,
  $qu$Which of the following is the most appropriate description?$qu$,
  $op${"options": ["A care manager replaces primary care and mental health entirely", "A care manager's role is routine suicide-risk screening only", "A care manager sets the one evidence-based screening interval", "A care manager links primary care, the patient, and mental health", "A care manager picks the drug and dose named in the recommendation"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-care-manager-links-three-parties", "taskCategory": "clinical-intervention"}$op$,
  $ky$A care manager links primary care, the patient, and mental health$ky$,
  $ex$Collaborative care uses a care manager to link primary care, the patient, and mental health. That is the stated role. He is older than 19 and already has a diagnosed mental health disorder, so this is a treatment arrangement, not a screening rule. Treatment remains psychotherapy or pharmacotherapy, and no drug or dose is named. "A care manager replaces primary care and mental health entirely" is not the best choice because The care manager links the three parties. The description does not say the manager replaces the clinicians. "A care manager's role is routine suicide-risk screening only" is not the best choice because Suicide-risk screening is an I statement. It is not defined as the care manager's role. "A care manager sets the one evidence-based screening interval" is not the best choice because No evidence defines the best screening interval, so the care manager is not assigned a proven interval to enforce. "A care manager picks the drug and dose named in the recommendation" is not the best choice because The recommendation names neither a drug nor a dose for the care manager to select.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '18d92127ff205c56944c2eae6c03eead5aae2888f59084c8ac0c3e8bbdc7dada', false, NOW(), NOW(), 3,
  'dep-care-manager-links-three-parties', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'dep-care-manager-links-three-parties', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-149", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210150', 'usmle-step-2', 'psychiatry',
  $sc$A 33-year-old woman who works as a pastry chef is seen in the postpartum clinic 4 weeks after delivery because she feels sad most of every day. Since the second week after birth she has had no pleasure in baking, early waking, and a 4 kg loss from her delivery weight of 70 kg. There is no prior diagnosis. The infant is feeding well. She asks if the correct step is only to decide whether a screen applies. Temperature is 36.8°C, pulse is 88/min, respirations are 16/min, and blood pressure is 116/72 mm Hg. The low mood has been present most of the day for about 21 days, and no treatment has started.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Only decide whether postpartum depression screening is indicated at this encounter", "Withhold care because postpartum status excludes mood treatment", "Provide routine suicide-risk screening as the full treatment", "Treat only if trauma or a family history is also recorded", "Assess and treat; clear symptoms are outside the screening decision"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-postpartum-symptoms-treat", "taskCategory": "clinical-intervention"}$op$,
  $ky$Assess and treat; clear symptoms are outside the screening decision$ky$,
  $ex$Postpartum people are included in Grade B depression screening for adults 19 or older only when they do not already have recognized symptoms or a diagnosed mental health disorder. She has clear symptoms, so the next step is clinical assessment and treatment. Treatment includes psychotherapy or pharmacotherapy, and no drug or dose is named. "Only decide whether postpartum depression screening is indicated at this encounter" is not the best choice because The screening question is for people without recognized symptoms. Her symptoms for about 3 weeks move the visit to assessment and treatment. "Withhold care because postpartum status excludes mood treatment" is not the best choice because Postpartum status is explicitly included in the screening recommendation and is not a reason to withhold treatment when symptoms are present. "Provide routine suicide-risk screening as the full treatment" is not the best choice because Suicide-risk screening is an I statement and is not the treatment of this episode. "Treat only if trauma or a family history is also recorded" is not the best choice because Risk factors are not required before assessment and treatment, and they do not restrict who is screened.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '756804db606a8529f0f4cb2241e9d60ac76d914a21de5badf0b584a115452807', false, NOW(), NOW(), 3,
  'dep-postpartum-symptoms-treat', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'dep-postpartum-symptoms-treat', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-150", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210151', 'usmle-step-2', 'psychiatry',
  $sc$A 68-year-old man who works as a model-ship builder is seen in the geriatric clinic because he has been sad most of the day for 7 weeks. He has stopped evening work on a brigantine model, wakes at 3 a.m., and has lost 7 lb from 77 kg. He has no prior mental health diagnosis. A student says that because he is older than 65 the only task is to offer a screening questionnaire. Temperature is 36.6°C, pulse is 70/min, respirations are 15/min, and blood pressure is 138/78 mm Hg. Loss of pleasure and low mood have been present on most days for about 49 days.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Assess and treat; age 65 or older does not keep this visit a screen", "Offer screening only, because adults 65 or older are a screening group", "Skip both screening and treatment because he is older than 65", "Use routine suicide-risk screening as the Grade B response", "Treat only after a trauma history or family history is confirmed"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-older-adult-symptoms-not-screen", "taskCategory": "clinical-intervention"}$op$,
  $ky$Assess and treat; age 65 or older does not keep this visit a screen$ky$,
  $ex$Adults 65 or older are included in depression screening when they do not already have a diagnosed mental health disorder and are not showing recognized symptoms. He has clear symptoms, so he is outside the screening population. The next step is clinical assessment and treatment, which includes psychotherapy or pharmacotherapy. "Offer screening only, because adults 65 or older are a screening group" is not the best choice because The age inclusion does not convert a symptomatic person into a screening case. Recognized symptoms call for assessment and treatment. "Skip both screening and treatment because he is older than 65" is not the best choice because Being 65 or older is a reason the screening recommendation includes asymptomatic adults. It is not a reason to withhold care from someone with symptoms. "Use routine suicide-risk screening as the Grade B response" is not the best choice because Suicide-risk screening is an I statement and is not the Grade B response to a symptomatic episode. "Treat only after a trauma history or family history is confirmed" is not the best choice because Risk factors are not required before treatment of clear symptoms.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'b7f0200a849336951c3591b754248e87f67f25b99d3c031c8896cd3cfef8f9cd', false, NOW(), NOW(), 4,
  'dep-older-adult-symptoms-not-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'dep-older-adult-symptoms-not-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-151", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210152', 'usmle-step-2', 'psychiatry',
  $sc$A 66-year-old woman who works as a botanical-garden guide is seen in the primary care office for a wellness visit and says she feels well. She has no diagnosed mental health disorder and has never had a mood screen. She still leads two garden tours a week, sleeps 7 hours, and has no trauma history and no family history of a mood disorder. She asks why mood questions would be offered when nothing feels wrong. Her weight is 68 kg. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood pressure is 130/76 mm Hg. She has had no pervasive low mood and no loss of interest in the past month.$sc$,
  $qu$Which of the following is the most appropriate response?$qu$,
  $op${"options": ["Tell her screening is reserved for people who already feel sad most days at this encounter", "Explain that mood screening is recommended even without symptoms or risk factors", "Tell her the questions are a routine suicide-risk test of equal strength", "Tell her screening starts only when a family history is present", "Tell her to return after a research-proven interval is published"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-explain-screen-despite-feeling-well", "taskCategory": "communication"}$op$,
  $ky$Explain that mood screening is recommended even without symptoms or risk factors$ky$,
  $ex$She is 66, so she is in the group of adults 65 or older included in Grade B depression screening, and she is also an adult 19 or older without a diagnosed mental health disorder and without recognized symptoms. Screening is recommended regardless of risk factors. That is the explanation to give. "Tell her screening is reserved for people who already feel sad most days at this encounter" is not the best choice because People with recognized symptoms are assessed and treated rather than approached as a screening decision. Feeling well is who screening is for. "Tell her the questions are a routine suicide-risk test of equal strength" is not the best choice because Suicide-risk screening is an I statement and should not be described as equal to depression screening. "Tell her screening starts only when a family history is present" is not the best choice because Family history does not restrict screening to high-risk people and is not required. "Tell her to return after a research-proven interval is published" is not the best choice because No evidence defines the best interval, but that does not mean a never-screened adult should wait for a new trial.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "communication"]$tg$,
  's2-new-20261121-hidden', '98d4753fff7a2374d4199a240fb6118ea17bb0eb7946ac6344b7d1af8bb5bb57', false, NOW(), NOW(), 2,
  'dep-explain-screen-despite-feeling-well', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'communication', 'dep-explain-screen-despite-feeling-well', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-152", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210153', 'usmle-step-2', 'psychiatry',
  $sc$A 45-year-old man who works as a harpsichord technician is seen in the faculty practice for a physical and jokes with the nurse about a concert. He has no diagnosed mental health disorder, no trauma history, and no family history of a mood disorder. He has never been screened. He sleeps 7 hours and still enjoys voicing quills. A clinician marks the mood screen as not needed because he looks cheerful and has no risk factors. His weight is 80 kg. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. There has been no pervasive low mood and no loss of interest over 14 days.$sc$,
  $qu$Which of the following is the most appropriate professional action?$qu$,
  $op${"options": ["Accept the omission because risk factors are required before screening", "Replace the omitted screen with routine suicide-risk screening", "Offer depression screening; a cheerful visit without risk factors still qualifies", "Omit the screen until he is 65 or develops daily symptoms for this patient", "Record a diagnosed disorder because the screen was skipped for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-offer-screen-to-cheerful-patient", "taskCategory": "professionalism"}$op$,
  $ky$Offer depression screening; a cheerful visit without risk factors still qualifies$ky$,
  $ex$Depression screening is a Grade B recommendation for adults 19 or older without a diagnosed mental health disorder and without recognized symptoms, regardless of risk factors. Looking cheerful and lacking trauma or family history does not justify skipping it. The professional action is to offer the screen. "Accept the omission because risk factors are required before screening" is not the best choice because Risk factors do not restrict screening to high-risk adults, so their absence is not a reason to omit the screen. "Replace the omitted screen with routine suicide-risk screening" is not the best choice because Suicide-risk screening is an I statement and is not the professional substitute for depression screening. "Omit the screen until he is 65 or develops daily symptoms for this patient" is not the best choice because Age 65 is included, not required, and recognized symptoms would move the visit to treatment rather than justify omitting a screen now. "Record a diagnosed disorder because the screen was skipped for this patient at the present visit" is not the best choice because Skipping a questionnaire does not create a diagnosis. He has no diagnosed mental health disorder.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "professionalism"]$tg$,
  's2-new-20261121-hidden', '5c862a729fde7c49d5aad8dfc9f246c55481ff8aa889c278b09833b8f0d92eff', false, NOW(), NOW(), 3,
  'dep-offer-screen-to-cheerful-patient', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'professionalism', 'dep-offer-screen-to-cheerful-patient', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-153", "hidden": true, "physicianTask": "professionalism", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210154', 'usmle-step-2', 'psychiatry',
  $sc$A 40-year-old man who works as a river-barge pilot is seen in the maritime clinic for a license exam and says his mood is ordinary. A pamphlet in the waiting room describes mood screening as a service for pregnant and postpartum patients only. He has no diagnosed mental health disorder, has never been screened, and has no recognized symptoms. He still enjoys night watches. His weight is 92 kg. Temperature is 36.7°C, pulse is 64/min, respirations are 14/min, and blood pressure is 126/78 mm Hg. He sleeps 7 hours and has had no loss of interest during the past 3 weeks.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Do not screen him, because the recommendation is limited to pregnancy", "Screen him only if he is 65 or older or has a trauma history", "Offer routine suicide-risk screening as his Grade B service", "Screen him for depression; the recommendation covers adults, not only pregnancy", "Skip him until a best screening interval is established for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-men-included-in-adult-screen", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen him for depression; the recommendation covers adults, not only pregnancy$ky$,
  $ex$The recommendation is to screen adults 19 or older for depression, and it includes pregnant people, postpartum people, and adults 65 or older. Those groups are included; they are not the only people screened. He is a 40-year-old man without a diagnosis and without recognized symptoms, so screening applies. It is Grade B. "Do not screen him, because the recommendation is limited to pregnancy" is not the best choice because Pregnancy and the postpartum period are included examples, not limits that exclude men. "Screen him only if he is 65 or older or has a trauma history" is not the best choice because Adults 65 or older are included, and trauma is only a risk factor. Neither is required for a 40-year-old. "Offer routine suicide-risk screening as his Grade B service" is not the best choice because Suicide-risk screening is an I statement and is not his Grade B screen. "Skip him until a best screening interval is established for this patient at the present visit" is not the best choice because He has never been screened. The lack of a proven interval is not a reason to skip the first screen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '0827260af8b53d365458ff6a4d8d2e07936496207ba8f2c08d6306e53a459df3', false, NOW(), NOW(), 2,
  'dep-men-included-in-adult-screen', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dep-men-included-in-adult-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-154", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210155', 'usmle-step-2', 'psychiatry',
  $sc$A 57-year-old woman who works as a stained-glass conservator is seen in the clinic because a reminder says a mood screen is due at 12 months. She completed a mood screen 13 months ago, it did not lead to a diagnosis, and she still has no diagnosed mental health disorder. She feels well, is restoring a chapel window, and has had no pervasive low mood. She asks if evidence forces a screen today solely because 13 months have passed. Her weight is 69 kg. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Sleep is about 7 hours, and she has not lost interest in the window project.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Evidence mandates a repeat depression screen at 12 months for every adult", "Any screen more than 12 months old must be replaced by suicide-risk screening", "Repeat screening is forbidden once one negative screen is on record", "She should be screened today only if a new trauma history is obtained", "A 12-month repeat is not an evidence-based requirement; use judgment"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-thirteen-months-not-a-mandate", "taskCategory": "interpretation"}$op$,
  $ky$A 12-month repeat is not an evidence-based requirement; use judgment$ky$,
  $ex$No evidence defines the best interval for depression screening. Repeat screening is a matter of clinical judgment, not a mandated 12-month rule. She is an adult without a diagnosed mental health disorder and without recognized symptoms, so judgment can include screening, but the reminder does not cite an established interval. "Evidence mandates a repeat depression screen at 12 months for every adult" is not the best choice because The recommendation does not establish a 12-month interval. It states that no evidence defines the best interval. "Any screen more than 12 months old must be replaced by suicide-risk screening" is not the best choice because Suicide-risk screening is an I statement and does not become the required test when a prior mood screen is a year old. "Repeat screening is forbidden once one negative screen is on record" is not the best choice because One prior screen is not defined as a lifetime maximum. Judgment is used for repeats. "She should be screened today only if a new trauma history is obtained" is not the best choice because Trauma is a risk factor, not a requirement for considering a repeat screen. Screening is recommended regardless of risk factors.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', '1f338640e8b95ced08884ecc8ba05332e20c77aee6d814467c6bbce2553f1571', false, NOW(), NOW(), 4,
  'dep-thirteen-months-not-a-mandate', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dep-thirteen-months-not-a-mandate', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-155", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210156', 'usmle-step-2', 'psychiatry',
  $sc$A 55-year-old woman who works as a loom mechanic is seen in the primary care clinic for follow-up of a mood diagnosis made 6 weeks ago. A care manager has been calling to link her primary clinician and a mental health clinician. She has had no psychotherapy and no medication. Low mood and loss of pleasure in the mill are still present most days, as they were for 8 weeks before the diagnosis. Someone suggests the calls themselves are the full treatment. Her weight is 73 kg. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. Symptoms have continued for about 14 weeks in total, and she is not pregnant.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Provide psychotherapy or pharmacotherapy; the care manager does not replace treatment", "Stop at care-manager calls, because those calls are the entire treatment at this encounter", "Return to a screening decision now that a care manager is involved", "Use routine suicide-risk screening as the treatment the manager provides", "Name a drug and dose from this recommendation and skip psychotherapy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "dep-care-manager-does-not-replace-treatment", "taskCategory": "clinical-intervention"}$op$,
  $ky$Provide psychotherapy or pharmacotherapy; the care manager does not replace treatment$ky$,
  $ex$Collaborative care uses a care manager to link primary care, the patient, and mental health. That link does not replace treatment. Treatment of major depression includes psychotherapy or pharmacotherapy, and the recommendation names no drug and no dose. She is older than 19 and already has a diagnosis, so this is not a screening decision. "Stop at care-manager calls, because those calls are the entire treatment at this encounter" is not the best choice because The care manager links the parties. The stated treatment remains psychotherapy or pharmacotherapy. "Return to a screening decision now that a care manager is involved" is not the best choice because A diagnosed mental health disorder places her outside the screening population. Adding a care manager does not return the visit to a screening decision. "Use routine suicide-risk screening as the treatment the manager provides" is not the best choice because Suicide-risk screening is an I statement and is not the treatment delivered by collaborative care. "Name a drug and dose from this recommendation and skip psychotherapy" is not the best choice because No drug or dose is named, and psychotherapy is an included treatment, not something to skip in favor of an invented regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '88edeca7e0cc3163f3cc175772748afad74cd7ba4d627e934758e6961432e1fc', false, NOW(), NOW(), 3,
  'dep-care-manager-does-not-replace-treatment', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'dep-care-manager-does-not-replace-treatment', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-156", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210157', 'usmle-step-2', 'neurology',
  $sc$A 54-year-old man who works as a harbor pilot is seen in the neurology clinic because his left eye has turned inward for 5 days. He can no longer look laterally with the left eye, and the deficit fits a left abducens palsy. He had a painless penile ulcer 6 weeks ago that healed without antibiotics. He has no headache and no hearing change. Serum RPR is reactive at 1:32, and a treponemal EIA is reactive. He has never been treated for this infection. Temperature is 36.8°C, pulse is 76/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. The remainder of the cranial-nerve exam is otherwise unremarkable, and mentation is clear.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Benzathine penicillin G 2.4 million units intramuscularly once, with no CSF exam", "Examine the CSF before treatment because of the cranial-nerve deficit", "Three weekly 2.4 million unit benzathine doses, with no CSF exam", "Skip the CSF exam because an isolated eye finding does not need it", "Procaine penicillin plus probenecid before any CSF result is known"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "csf-before-treatment-abducens-palsy", "taskCategory": "clinical-intervention"}$op$,
  $ky$Examine the CSF before treatment because of the cranial-nerve deficit$ky$,
  $ex$A cranial-nerve deficit is a neurologic sign. Neurologic signs call for a CSF exam before treatment. The single 2.4 million unit benzathine dose is for primary, secondary, or early latent infection without this complication, and the 7.2 million unit three-dose schedule is not the step before CSF in the presence of a nerve palsy. "Benzathine penicillin G 2.4 million units intramuscularly once, with no CSF exam" is not the best choice because Benzathine penicillin G 2.4 million units IM once does not replace a CSF exam when a cranial-nerve deficit is present. "Three weekly 2.4 million unit benzathine doses, with no CSF exam" is not the best choice because Three weekly intramuscular doses of 2.4 million units, 7.2 million units total, are for late latent or unknown-duration infection and for tertiary disease with a normal CSF exam, not the first step when a nerve palsy is untreated and unexamined. "Skip the CSF exam because an isolated eye finding does not need it" is not the best choice because The no-CSF pathway is for isolated eye findings confirmed on an eye exam when there is no cranial-nerve deficit. This patient has an abducens palsy. "Procaine penicillin plus probenecid before any CSF result is known" is not the best choice because The procaine-plus-probenecid alternative is a treatment option after the neurologic regimen is chosen and only if compliance is certain. It is not given before the CSF exam.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'b961391ff3231332616426d506a39051e2cd99a32c92615bcc4b544ee47bc364', false, NOW(), NOW(), 2,
  'csf-before-treatment-abducens-palsy', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'csf-before-treatment-abducens-palsy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-157", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210158', 'usmle-step-2', 'neurology',
  $sc$A 29-year-old woman who works as a night-bakery mixer is seen in the emergency department because of a severe headache and neck stiffness for 2 days. She is uncomfortable in light but is oriented. Neck flexion is resisted. She recalls a painless genital ulcer about 7 weeks ago. Serum RPR is reactive at 1:64 and a treponemal test is reactive. She has not received an antibiotic. There is no focal arm weakness. Temperature is 38.4°C, pulse is 104/min, respirations are 18/min, and blood pressure is 118/72 mm Hg. The headache has lasted 48 hours, and no lumbar puncture has been done.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Give benzathine penicillin G 2.4 million units once and skip lumbar puncture", "Treat with three weekly benzathine doses and do no CSF exam", "Examine the CSF before treatment because these are meningitis signs", "Defer CSF sampling because hearing is normal and the eyes were not examined", "Start probenecid 500 mg four times daily as the only drug"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "csf-before-treatment-neck-stiffness", "taskCategory": "clinical-intervention"}$op$,
  $ky$Examine the CSF before treatment because these are meningitis signs$ky$,
  $ex$Fever, headache, and neck stiffness are meningitis, a neurologic indication to examine the CSF before treatment. Serum RPR is reactive at 1:64 with a reactive treponemal test. The early-infection dose of benzathine penicillin G 2.4 million units IM once is not a substitute for that CSF exam. "Give benzathine penicillin G 2.4 million units once and skip lumbar puncture" is not the best choice because A single 2.4 million unit intramuscular benzathine dose is for early infection without neurologic disease. Meningitis signs require CSF examination first. "Treat with three weekly benzathine doses and do no CSF exam" is not the best choice because The three-dose 7.2 million unit benzathine schedule is not the approach when meningitis signs are present and the CSF has not been examined. "Defer CSF sampling because hearing is normal and the eyes were not examined" is not the best choice because Normal hearing does not cancel meningitis signs. The hearing exception is for isolated hearing symptoms with a normal neurologic exam. "Start probenecid 500 mg four times daily as the only drug" is not the best choice because Probenecid 500 mg orally four times daily is used only together with daily procaine penicillin G, as an alternative neurologic regimen when compliance is certain. It is not monotherapy and it is not the step before CSF.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'd4598993aa4542f5cf65552a10cab81764eafc9aff4dcd4eadc67636c77cd290', false, NOW(), NOW(), 2,
  'csf-before-treatment-neck-stiffness', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'csf-before-treatment-neck-stiffness', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-158", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210159', 'usmle-step-2', 'neurology',
  $sc$A 41-year-old man who works as a gantry crane operator is seen in the stroke unit on hospital day 2 after sudden right-arm weakness. Imaging showed an acute left hemispheric infarct. He is outside any reperfusion window and is medically stable. Serum RPR drawn on arrival is reactive at 1:128, and a treponemal EIA is reactive. He has no prior treatment. Speech is mildly slurred and the right arm is still weak. Mentation is otherwise clear. Temperature is 36.9°C, pulse is 82/min, respirations are 16/min, and blood pressure is 148/88 mm Hg. The deficit began 30 hours ago. No CSF exam has been performed.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Give one 2.4 million unit benzathine dose and do not sample CSF", "Start the 7.2 million unit three-dose schedule without CSF", "Skip CSF because the eye exam has not shown inflammation", "Examine the CSF before treatment because stroke is a neurologic sign", "Treat as low-risk reverse-sequence serology and give no antibiotic at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "csf-before-treatment-acute-stroke", "taskCategory": "clinical-intervention"}$op$,
  $ky$Examine the CSF before treatment because stroke is a neurologic sign$ky$,
  $ex$Stroke is listed among neurologic signs that call for a CSF exam before treatment. Reactive serum RPR at 1:128 and a reactive treponemal test do not remove that step. A single 2.4 million unit dose is the early-infection regimen, not the response to an untreated stroke in this setting. "Give one 2.4 million unit benzathine dose and do not sample CSF" is not the best choice because Benzathine penicillin G 2.4 million units IM once does not replace CSF examination when stroke is present. "Start the 7.2 million unit three-dose schedule without CSF" is not the best choice because Three weekly doses totaling 7.2 million units are for late latent or unknown-duration disease and for tertiary disease after a normal CSF exam, not for an unexamined stroke. "Skip CSF because the eye exam has not shown inflammation" is not the best choice because The eye-exam exception applies to isolated confirmed eye findings without a cranial-nerve deficit. Stroke is a separate neurologic sign and still needs CSF. "Treat as low-risk reverse-sequence serology and give no antibiotic at the present visit" is not the best choice because The no-treatment path is for a reactive EIA, a nonreactive RPR, a negative second treponemal test, and low risk. This RPR is reactive at 1:128.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'b0cb0ed78b0214a934c374aea77b3100944ca6c363d757a608c6aab408765e3e', false, NOW(), NOW(), 3,
  'csf-before-treatment-acute-stroke', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'csf-before-treatment-acute-stroke', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-159", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210160', 'usmle-step-2', 'neurology',
  $sc$A 63-year-old woman who works as an archive bookbinder is seen in the emergency department because her daughter says she has been drowsy since yesterday. She is disoriented to the date and cannot name the hospital. There is no neck stiffness. Serum RPR is reactive at 1:32 and a treponemal test is reactive. She has no record of treatment. A coworker says a rash on the palms faded 2 months ago. Glucose is 96 mg/dL. Temperature is 37.2°C, pulse is 90/min, respirations are 16/min, and blood pressure is 142/80 mm Hg. The change in mentation has lasted about 1 day, and no CSF study has been done.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Give benzathine penicillin G 2.4 million units once tonight and skip CSF", "Arrange three weekly benzathine injections and no lumbar puncture", "Treat with the hearing regimen and do not sample CSF", "Withhold antibiotics because a second treponemal test was not low risk", "Examine the CSF before treatment because mentation is altered"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "csf-before-treatment-altered-mentation", "taskCategory": "clinical-intervention"}$op$,
  $ky$Examine the CSF before treatment because mentation is altered$ky$,
  $ex$Altered mentation is a neurologic sign. Neurologic signs require a CSF exam before treatment. A single benzathine dose of 2.4 million units, or three weekly doses totaling 7.2 million units, is not started in place of that exam. The 18-24 million unit daily regimen comes after the neurologic evaluation, not before the CSF. "Give benzathine penicillin G 2.4 million units once tonight and skip CSF" is not the best choice because A single intramuscular dose of benzathine penicillin G 2.4 million units is not the step when mentation is altered and the CSF has not been examined. "Arrange three weekly benzathine injections and no lumbar puncture" is not the best choice because The 7.2 million unit three-dose benzathine course is for infection of unknown duration or late latent disease, and for tertiary disease with a normal CSF exam. This CSF exam has not been done. "Treat with the hearing regimen and do not sample CSF" is not the best choice because Skipping CSF is for isolated hearing symptoms with a normal neurologic exam. Altered mentation means the exam is not normal. "Withhold antibiotics because a second treponemal test was not low risk" is not the best choice because The low-risk, do-not-treat rule requires a reactive EIA, a nonreactive RPR, and a negative second treponemal test. Her RPR is reactive.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '8475ce040f4dac2d8c4ac182b44dcd374d9fcac24d56b473fd1d96b4d9225218', false, NOW(), NOW(), 3,
  'csf-before-treatment-altered-mentation', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'csf-before-treatment-altered-mentation', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-160", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210161', 'usmle-step-2', 'neurology',
  $sc$A 36-year-old woman who works as a planetarium lecturer is seen in the eye hospital because the left eye has been painful and blurred for 9 days. An ophthalmology exam confirms intraocular inflammation. The neurologic exam shows no cranial-nerve deficit, normal mentation, and no neck stiffness. Serum RPR is reactive at 1:64 and a treponemal EIA is reactive. She has not been treated. Hearing is unchanged. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Visual symptoms have lasted 9 days, and no lumbar puncture has been performed.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Skip CSF first, use the neurologic penicillin regimen, and involve ophthalmology", "Require a CSF exam before any antibiotic because the eye is involved", "Give benzathine penicillin G 2.4 million units once and do not call ophthalmology", "Give three weekly benzathine doses and skip both CSF and eye follow-up", "Do not treat, because there is no cranial-nerve deficit and risk is unknown"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "isolated-eye-finding-csf-not-required", "taskCategory": "clinical-intervention"}$op$,
  $ky$Skip CSF first, use the neurologic penicillin regimen, and involve ophthalmology$ky$,
  $ex$Isolated eye findings that an eye exam confirms, with reactive serology and no cranial-nerve deficit, do not require a CSF exam before treatment. Treatment is still the neurologic regimen, aqueous crystalline penicillin G 18-24 million units per day for 10-14 days, and ophthalmology is involved. "Require a CSF exam before any antibiotic because the eye is involved" is not the best choice because A CSF exam is required for neurologic signs such as a cranial-nerve deficit. It is not required before treatment of isolated, confirmed eye findings without that deficit. "Give benzathine penicillin G 2.4 million units once and do not call ophthalmology" is not the best choice because Benzathine penicillin G 2.4 million units IM once is the early-infection dose, not the regimen for eye disease, and ophthalmology should be involved. "Give three weekly benzathine doses and skip both CSF and eye follow-up" is not the best choice because Three weekly 2.4 million unit doses total 7.2 million units and are for late latent, unknown-duration, or tertiary disease with a normal CSF exam. Eye disease uses the neurologic regimen, and ophthalmology stays involved. "Do not treat, because there is no cranial-nerve deficit and risk is unknown" is not the best choice because Reactive serology plus confirmed eye disease is treated. The do-not-treat rule is a different serologic pattern: reactive EIA, nonreactive RPR, negative second treponemal test, and low risk.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '3d23ea25fa6a5b6312cbbb811da5ce03d485da860ccf9354961d8c88dbfde2bf', false, NOW(), NOW(), 4,
  'isolated-eye-finding-csf-not-required', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'isolated-eye-finding-csf-not-required', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-161", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210162', 'usmle-step-2', 'neurology',
  $sc$A 48-year-old man who works as a pipe-organ voicer is seen in the otology clinic because hearing in the right ear dropped over 8 days. An ear exam supports a sensorineural pattern on the right. The neurologic exam is normal, with no cranial-nerve deficit, clear mentation, and a supple neck. Serum RPR is reactive at 1:16 and a treponemal test is reactive. He has received no treatment. Vision is unchanged. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. The hearing change has lasted 8 days, and no CSF sample has been drawn.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Perform a CSF exam before any treatment because hearing changed", "Skip CSF first, use the neurologic penicillin regimen, and involve otolaryngology", "Give benzathine penicillin G 2.4 million units once and no ear referral during today's visit", "Use three weekly benzathine doses and do not involve otolaryngology", "Observe without antibiotics because the neurologic exam is normal"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "isolated-hearing-csf-not-recommended", "taskCategory": "clinical-intervention"}$op$,
  $ky$Skip CSF first, use the neurologic penicillin regimen, and involve otolaryngology$ky$,
  $ex$Isolated hearing symptoms with a normal neurologic exam and reactive serology do not call for a CSF exam before treatment. Treat with the neurologic regimen, aqueous crystalline penicillin G 18-24 million units per day for 10-14 days, and involve otolaryngology. "Perform a CSF exam before any treatment because hearing changed" is not the best choice because CSF examination before treatment is for neurologic signs such as cranial-nerve deficit, meningitis, stroke, or altered mentation. Isolated hearing with a normal neurologic exam is the situation in which CSF is not recommended first. "Give benzathine penicillin G 2.4 million units once and no ear referral during today's visit" is not the best choice because A single 2.4 million unit benzathine dose treats early infection without ear disease. Hearing symptoms need the neurologic penicillin regimen and otolaryngology. "Use three weekly benzathine doses and do not involve otolaryngology" is not the best choice because The 7.2 million unit three-dose benzathine schedule is not the hearing regimen, and otolaryngology should be involved. "Observe without antibiotics because the neurologic exam is normal" is not the best choice because Reactive serum tests plus isolated hearing symptoms are treated. A normal neurologic exam changes the CSF decision, not the decision to treat.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '8108f2029bddade275406e1c0066dd39377c6f360ad2e674cef59a676b955e69', false, NOW(), NOW(), 4,
  'isolated-hearing-csf-not-recommended', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'isolated-hearing-csf-not-recommended', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-162", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210163', 'usmle-step-2', 'neurology',
  $sc$A 44-year-old man who works as a surveyor is seen in the neuro-ophthalmology clinic because the right eye is inflamed and the right face is weak. Ophthalmology confirms intraocular inflammation. Examination also shows a right facial palsy that includes the forehead. Serum RPR is reactive at 1:128 and a treponemal EIA is reactive. Mentation is clear. He has never been treated. Symptoms began 11 days ago. Temperature is 36.9°C, pulse is 80/min, respirations are 16/min, and blood pressure is 130/82 mm Hg. Both the eye finding and the facial palsy are present on today's exam.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Skip CSF because an eye exam already confirmed intraocular inflammation", "Give benzathine penicillin G 2.4 million units once and do no lumbar puncture", "Examine the CSF before treatment because a cranial-nerve deficit is present", "Start three weekly benzathine doses because the duration is unknown", "Use the hearing exception and involve only otolaryngology"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "eye-finding-plus-nerve-palsy-needs-csf", "taskCategory": "clinical-intervention"}$op$,
  $ky$Examine the CSF before treatment because a cranial-nerve deficit is present$ky$,
  $ex$The no-CSF pathway for eye disease requires isolated eye findings and no cranial-nerve deficit. A facial palsy is a cranial-nerve deficit, so the CSF is examined before treatment. Reactive serum RPR at 1:128 does not remove that step. "Skip CSF because an eye exam already confirmed intraocular inflammation" is not the best choice because Confirmed eye inflammation skips CSF only when findings are isolated and there is no cranial-nerve deficit. The facial palsy removes that exception. "Give benzathine penicillin G 2.4 million units once and do no lumbar puncture" is not the best choice because Benzathine penicillin G 2.4 million units IM once is not the next step when a cranial-nerve deficit has not yet been evaluated with CSF. "Start three weekly benzathine doses because the duration is unknown" is not the best choice because Unknown duration is treated with three weekly 2.4 million unit doses only when neurologic disease is not the issue. A nerve palsy requires CSF before treatment. "Use the hearing exception and involve only otolaryngology" is not the best choice because The hearing pathway is for isolated hearing symptoms and a normal neurologic exam. This patient has eye disease plus a facial palsy, not isolated hearing loss.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '13a3b213859f31c4ca450c62d86617a2846b112206041af904b3bf8c1ed63bb5', false, NOW(), NOW(), 5,
  'eye-finding-plus-nerve-palsy-needs-csf', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'eye-finding-plus-nerve-palsy-needs-csf', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-163", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210164', 'usmle-step-2', 'neurology',
  $sc$A 57-year-old woman who works as a radio-tower inspector is seen in the emergency department because her family reports confusion and a new hearing problem. Hearing on the left has worsened for 6 days, and since yesterday she has been disoriented to place. The neck is supple. Serum RPR is reactive at 1:64 and a treponemal test is reactive. There is no record of prior treatment. She cannot give a reliable work history today. Temperature is 37.4°C, pulse is 96/min, respirations are 18/min, and blood pressure is 146/86 mm Hg. Disorientation has lasted about 1 day, and no CSF exam has been done.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Skip CSF and treat as isolated hearing loss with a normal neurologic exam", "Give a single 2.4 million unit benzathine dose and recheck hearing in a week before the patient leaves", "Use three weekly benzathine doses because no eye finding is present", "Examine the CSF before treatment because mentation is altered, not isolated hearing", "Do not treat until a low-risk second treponemal test is negative"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "hearing-loss-plus-confusion-needs-csf", "taskCategory": "clinical-intervention"}$op$,
  $ky$Examine the CSF before treatment because mentation is altered, not isolated hearing$ky$,
  $ex$CSF is not recommended before treatment only for isolated hearing symptoms with a normal neurologic exam. Altered mentation is a neurologic sign and requires a CSF exam before treatment. A single 2.4 million unit benzathine dose does not cover this visit, and the hearing change does not create the isolated-hearing exception. "Skip CSF and treat as isolated hearing loss with a normal neurologic exam" is not the best choice because The isolated-hearing exception needs a normal neurologic exam. Disorientation means the exam is not normal, so CSF comes before treatment. "Give a single 2.4 million unit benzathine dose and recheck hearing in a week before the patient leaves" is not the best choice because Benzathine penicillin G 2.4 million units IM once is the early regimen and does not replace CSF examination when mentation is altered. "Use three weekly benzathine doses because no eye finding is present" is not the best choice because Absence of an eye finding does not select the 7.2 million unit three-dose schedule when altered mentation is present. "Do not treat until a low-risk second treponemal test is negative" is not the best choice because Her RPR is reactive at 1:64. The do-not-treat reverse-sequence rule requires a nonreactive RPR and a negative second treponemal test in a low-risk person.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '4b69f0a969b83d209ac63365b35a27f23e7278c3071cfcfb966533e0394436f0', false, NOW(), NOW(), 5,
  'hearing-loss-plus-confusion-needs-csf', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'hearing-loss-plus-confusion-needs-csf', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-164", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210165', 'usmle-step-2', 'neurology',
  $sc$A 26-year-old man who works as a bicycle courier is seen in the sexual health clinic because of a painless penile ulcer for 8 days. The ulcer is indurated and clean. The neurologic exam shows no cranial-nerve deficit, mentation is clear, hearing is normal, and an eye check shows no inflammation. Serum RPR is reactive at 1:16 and a treponemal EIA is reactive. He has HIV testing pending and no neurologic complaint. He has not been treated. Temperature is 36.8°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. The ulcer has been present for 8 days, and there is no rash on the palms.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days", "Benzathine penicillin G 7.2 million units as three weekly injections", "An extra 2.4 million unit dose next week to improve efficacy", "Procaine penicillin G daily plus probenecid for 10-14 days", "Benzathine penicillin G 2.4 million units intramuscularly once"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "early-genital-ulcer-single-benzathine", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Benzathine penicillin G 2.4 million units intramuscularly once$ky$,
  $ex$A recent painless ulcer with reactive serology and no neurologic, eye, or ear findings is treated as early infection: benzathine penicillin G 2.4 million units IM once. Extra doses do not improve efficacy. The 18-24 million unit daily regimen is for neurologic, ocular, or otic disease. "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days" is not the best choice because Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days is the neurologic, ocular, and otic regimen. He has none of those findings. "Benzathine penicillin G 7.2 million units as three weekly injections" is not the best choice because Three weekly doses of 2.4 million units, 7.2 million units total, are for late latent or unknown-duration infection and for tertiary disease with a normal CSF exam, not for this recent ulcer. "An extra 2.4 million unit dose next week to improve efficacy" is not the best choice because Extra doses of benzathine penicillin G do not improve efficacy of treatment for early infection. "Procaine penicillin G daily plus probenecid for 10-14 days" is not the best choice because Daily procaine penicillin G 2.4 million units plus probenecid 500 mg four times daily for 10-14 days is an alternative neurologic regimen when compliance is certain, not the treatment of uncomplicated early infection.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '98fbea2bc9a1e5cea914670aadafbdec50d5f4ed8f50b3c5024747612a34cb0f', false, NOW(), NOW(), 2,
  'early-genital-ulcer-single-benzathine', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'early-genital-ulcer-single-benzathine', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-165", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210166', 'usmle-step-2', 'neurology',
  $sc$A 50-year-old man who works as a subway escalator mechanic is seen in the hospital ward after a lumbar puncture done for a new facial palsy. Serum RPR is reactive at 1:64 and a treponemal test is reactive. The CSF-VDRL is reactive, and the sample had no blood contamination. He can take intravenous medicine. The facial palsy includes the forehead and began 7 days ago. No antibiotic has been given. Temperature is 37.0°C, pulse is 84/min, respirations are 16/min, and blood pressure is 132/80 mm Hg. The CSF-VDRL result returned today, and he is alert.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Aqueous crystalline penicillin G 3-4 million units IV every 4 hours for 10-14 days", "Benzathine penicillin G 2.4 million units intramuscularly once", "Benzathine penicillin G 2.4 million units weekly for three weeks", "Probenecid 500 mg orally four times daily without penicillin for this patient in the office today", "Give ceftriaxone 500 mg intramuscularly as one dose only for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "neuro-aqueous-penicillin-every-four-hours", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Aqueous crystalline penicillin G 3-4 million units IV every 4 hours for 10-14 days$ky$,
  $ex$A reactive CSF-VDRL without blood contamination, reactive serum tests, and a cranial-nerve deficit support neurologic infection. Treatment is aqueous crystalline penicillin G 18-24 million units per day, given as 3-4 million units IV every 4 hours, for 10-14 days. A continuous infusion of the same daily amount is the other stated schedule. "Benzathine penicillin G 2.4 million units intramuscularly once" is not the best choice because Benzathine penicillin G 2.4 million units IM once treats early infection without neurologic disease. It is not this regimen. "Benzathine penicillin G 2.4 million units weekly for three weeks" is not the best choice because Three weekly 2.4 million unit doses total 7.2 million units and do not treat neurologic infection. "Probenecid 500 mg orally four times daily without penicillin for this patient in the office today" is not the best choice because Probenecid is not used alone. The oral alternative pairs probenecid 500 mg four times daily with daily procaine penicillin G when compliance is certain. "Give ceftriaxone 500 mg intramuscularly as one dose only for this patient" is not the best choice because Ceftriaxone 500 mg IM once is an uncomplicated regimen for a different organism when weight is under 150 kg. It is not the penicillin regimen for this CSF result.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '58a7fa5d8f678072c4607ddcd3052e18d47e54da191067b9fc413ba8544ef961', false, NOW(), NOW(), 3,
  'neuro-aqueous-penicillin-every-four-hours', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'neuro-aqueous-penicillin-every-four-hours', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-166", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210167', 'usmle-step-2', 'neurology',
  $sc$A 46-year-old woman who works as a freight-elevator inspector is seen in the inpatient unit after CSF testing for new confusion that is now improving. Serum tests were reactive, including an RPR of 1:32, and the CSF-VDRL was reactive without blood in the sample. She has reliable intravenous access. The team asks whether the full daily penicillin amount may be given as a continuous infusion instead of repeated pushes. No dose has started. Temperature is 37.1°C, pulse is 88/min, respirations are 16/min, and blood pressure is 126/76 mm Hg. Mentation has been abnormal for 3 days, and the CSF result is in hand.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["A continuous infusion of benzathine penicillin G 2.4 million units once", "Aqueous crystalline penicillin G 18-24 million units daily by infusion for 10-14 days", "Three weekly intramuscular benzathine doses totaling 7.2 million units", "Procaine penicillin G 2.4 million units once, without probenecid", "Stop at day 3 if mentation improves, whatever the schedule for this patient in the office today"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "neuro-aqueous-penicillin-continuous-infusion", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Aqueous crystalline penicillin G 18-24 million units daily by infusion for 10-14 days$ky$,
  $ex$Neurologic infection is treated with aqueous crystalline penicillin G 18-24 million units per day for 10-14 days. That daily amount may be given as 3-4 million units IV every 4 hours or as a continuous infusion. A reactive CSF-VDRL without blood contamination supports this diagnosis when serum tests are reactive and neurologic signs are present. "A continuous infusion of benzathine penicillin G 2.4 million units once" is not the best choice because Benzathine penicillin G 2.4 million units once is the early-infection dose. It is not given as the neurologic infusion. "Three weekly intramuscular benzathine doses totaling 7.2 million units" is not the best choice because The 7.2 million unit three-dose benzathine course is for late latent or unknown-duration disease and for tertiary disease with a normal CSF exam. "Procaine penicillin G 2.4 million units once, without probenecid" is not the best choice because A single procaine dose without probenecid is not the alternative regimen. The alternative is procaine penicillin G 2.4 million units IM daily plus probenecid 500 mg orally four times daily, for 10-14 days, if compliance is certain. "Stop at day 3 if mentation improves, whatever the schedule for this patient in the office today" is not the best choice because The neurologic course is 10-14 days, not a 3-day stop when symptoms start to improve.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '7d66f9b1e3323b3e7be08d600c461640ca017dabf0241c43baca35289e41038c', false, NOW(), NOW(), 2,
  'neuro-aqueous-penicillin-continuous-infusion', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'neuro-aqueous-penicillin-continuous-infusion', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-167", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210168', 'usmle-step-2', 'neurology',
  $sc$A 39-year-old man who works as a tunnel electrician is seen in the hospital ward on day 4 of intravenous penicillin for a cranial-nerve palsy. CSF-VDRL was reactive without blood contamination, and serum RPR was 1:64. The forehead-involving facial palsy is slightly better. A colleague wants to stop the infusion today and finish with one benzathine injection. He has had 4 days of aqueous crystalline penicillin G. Temperature is 36.8°C, pulse is 78/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. Intravenous treatment began 4 days ago, and no adverse reaction has occurred.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Stop today and give benzathine penicillin G 2.4 million units once", "Switch to three weekly benzathine doses to complete 7.2 million units", "Continue aqueous crystalline penicillin G to complete 10-14 days", "Stop all penicillin because the palsy improved on day 4", "Finish with probenecid alone, 500 mg four times daily for 2 days"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "neuro-penicillin-course-ten-to-fourteen-days", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Continue aqueous crystalline penicillin G to complete 10-14 days$ky$,
  $ex$The neurologic regimen is aqueous crystalline penicillin G 18-24 million units per day for 10-14 days. Improvement on day 4 does not shorten that course to a single benzathine dose of 2.4 million units or to the 7.2 million unit three-dose schedule. "Stop today and give benzathine penicillin G 2.4 million units once" is not the best choice because Benzathine penicillin G 2.4 million units IM once does not complete a neurologic course. "Switch to three weekly benzathine doses to complete 7.2 million units" is not the best choice because Three weekly doses totaling 7.2 million units are a different regimen, for late latent or unknown-duration infection and for tertiary disease with a normal CSF exam. "Stop all penicillin because the palsy improved on day 4" is not the best choice because Clinical improvement does not cut the stated duration below 10-14 days. "Finish with probenecid alone, 500 mg four times daily for 2 days" is not the best choice because Probenecid is not effective alone and is not a 2-day finish. When used, it is 500 mg orally four times daily together with daily procaine penicillin G for 10-14 days.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'f0a1fe67f712a75385226e2f1cf94f0c5fccc20c7ce78dfe062729fdab7437f5', false, NOW(), NOW(), 2,
  'neuro-penicillin-course-ten-to-fourteen-days', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'neuro-penicillin-course-ten-to-fourteen-days', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-168", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210169', 'usmle-step-2', 'neurology',
  $sc$A 42-year-old woman who works as a lighthouse supply officer is seen in the infectious diseases clinic to discuss an alternative to an intravenous penicillin course. CSF-VDRL was reactive with no blood in the sample, serum RPR is 1:32, and she had a cranial-nerve palsy. She lives next to the clinic, has completed daily injected courses before, and can take an oral medicine four times a day. She asks for a non-intravenous option she will reliably finish. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. She can attend every day for 14 days, and the CSF result is already known.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Procaine penicillin G 2.4 million units IM daily for 10-14 days, without probenecid", "Probenecid 500 mg orally four times daily for 10-14 days, without penicillin for this patient before the patient leaves", "Benzathine penicillin G 2.4 million units intramuscularly once for this patient", "Procaine penicillin G 2.4 million units IM daily plus probenecid 500 mg four times daily for 10-14 days", "Benzathine penicillin G 2.4 million units weekly for three weeks only for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "procaine-plus-probenecid-if-compliant", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Procaine penicillin G 2.4 million units IM daily plus probenecid 500 mg four times daily for 10-14 days$ky$,
  $ex$If compliance is certain, neurologic infection may be treated with procaine penicillin G 2.4 million units IM daily plus probenecid 500 mg orally four times daily, both for 10-14 days. Both drugs are required. This is an alternative to aqueous crystalline penicillin G 18-24 million units per day. "Procaine penicillin G 2.4 million units IM daily for 10-14 days, without probenecid" is not the best choice because Procaine penicillin G alone, without probenecid 500 mg orally four times daily, is not the stated alternative. "Probenecid 500 mg orally four times daily for 10-14 days, without penicillin for this patient before the patient leaves" is not the best choice because Probenecid does not replace penicillin. It is added to daily procaine penicillin G. "Benzathine penicillin G 2.4 million units intramuscularly once for this patient" is not the best choice because A single 2.4 million unit benzathine dose treats early infection, not neurologic infection with a reactive CSF-VDRL. "Benzathine penicillin G 2.4 million units weekly for three weeks only for this patient" is not the best choice because Three weekly benzathine doses total 7.2 million units and are not the compliant-patient alternative for neurologic disease.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '79de26e19d33c9611b767f2ccf5963ff7ce1d1c8a5417c08aadf3202f52ff362', false, NOW(), NOW(), 4,
  'procaine-plus-probenecid-if-compliant', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'procaine-plus-probenecid-if-compliant', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-169", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210170', 'usmle-step-2', 'neurology',
  $sc$A 35-year-old man who works as a seasonal orchard hauler is seen in the hospital after a reactive CSF-VDRL and a new abducens palsy. The CSF sample had no blood contamination. Serum RPR is 1:64. He has missed several recent visits, has no address for the next month, and says he cannot promise daily returns or four oral doses a day. The team considers the intramuscular-oral alternative. Temperature is 37.0°C, pulse is 86/min, respirations are 16/min, and blood pressure is 124/76 mm Hg. The palsy began 6 days ago, and he has received no penicillin yet.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Procaine penicillin G daily plus probenecid, because any adult may choose it", "Benzathine penicillin G 2.4 million units once, since follow-up is uncertain", "Three weekly benzathine doses, because he may miss daily care for this patient before the patient leaves", "Probenecid 500 mg four times daily alone for 10-14 days for this patient", "Aqueous crystalline penicillin G 18-24 million units per day intravenously for 10-14 days"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "uncertain-compliance-prefer-intravenous", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Aqueous crystalline penicillin G 18-24 million units per day intravenously for 10-14 days$ky$,
  $ex$The procaine penicillin G 2.4 million unit daily plus probenecid 500 mg four-times-daily alternative is only for when compliance is certain, for 10-14 days. His follow-up is uncertain, so use aqueous crystalline penicillin G 18-24 million units per day for 10-14 days, as 3-4 million units IV every 4 hours or a continuous infusion. "Procaine penicillin G daily plus probenecid, because any adult may choose it" is not the best choice because That alternative requires certain compliance. It is not offered simply because an adult prefers to avoid admission. "Benzathine penicillin G 2.4 million units once, since follow-up is uncertain" is not the best choice because Uncertain follow-up does not convert neurologic infection into the single 2.4 million unit early-infection dose. "Three weekly benzathine doses, because he may miss daily care for this patient before the patient leaves" is not the best choice because The 7.2 million unit three-dose schedule is not the neurologic regimen and is not selected because daily visits may be missed. "Probenecid 500 mg four times daily alone for 10-14 days for this patient" is not the best choice because Probenecid is not used without penicillin.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '7a22f627b6697b9331284865dc3fbebda200978f89913830e9965a1ecffc2b4f', false, NOW(), NOW(), 5,
  'uncertain-compliance-prefer-intravenous', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'uncertain-compliance-prefer-intravenous', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-170", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210171', 'usmle-step-2', 'neurology',
  $sc$A 33-year-old woman who works as a museum lighting designer is seen in the eye clinic after ophthalmology confirmed inflammation inside the left eye. There is no cranial-nerve deficit, and mentation and hearing are normal. Serum RPR is reactive at 1:32 and a treponemal test is reactive. No CSF exam has been done. She asks which antibiotic schedule treats the eye finding. Symptoms have lasted 12 days. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. Vision has been blurred for 12 days, and she has no penicillin allergy.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Aqueous crystalline penicillin G 18-24 million units daily for 10-14 days, with eye care", "Benzathine penicillin G 2.4 million units intramuscularly once for this patient", "Three weekly benzathine doses totaling 7.2 million units for this patient", "Withhold antibiotics until a CSF-VDRL result comes back reactive for this patient", "A 3-day course of aqueous penicillin, then stop if vision steadies for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "confirmed-eye-disease-neuro-penicillin", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Aqueous crystalline penicillin G 18-24 million units daily for 10-14 days, with eye care$ky$,
  $ex$Isolated eye findings confirmed on examination, with reactive serology and no cranial-nerve deficit, are treated with the neurologic regimen even though CSF is not required first. That regimen is aqueous crystalline penicillin G 18-24 million units per day for 10-14 days, and ophthalmology is involved. "Benzathine penicillin G 2.4 million units intramuscularly once for this patient" is not the best choice because A single 2.4 million unit benzathine dose treats early infection without eye disease. It is not the ocular regimen. "Three weekly benzathine doses totaling 7.2 million units for this patient" is not the best choice because Three weekly doses totaling 7.2 million units do not treat ocular disease. "Withhold antibiotics until a CSF-VDRL result comes back reactive for this patient" is not the best choice because CSF is not required before treatment in this isolated, confirmed eye finding without a cranial-nerve deficit. Waiting on a CSF-VDRL delays the neurologic regimen. "A 3-day course of aqueous penicillin, then stop if vision steadies for this patient at the present visit" is not the best choice because The duration is 10-14 days, not 3 days.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'b9b6dbbf48e73d4abb1f7614768034ee2ace4f5b754a876a05349277b4e1c28c', false, NOW(), NOW(), 3,
  'confirmed-eye-disease-neuro-penicillin', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'confirmed-eye-disease-neuro-penicillin', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-171", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210172', 'usmle-step-2', 'neurology',
  $sc$A 52-year-old man who works as a sonar technician is seen in the otolaryngology clinic because of isolated right-sided hearing loss for 10 days. The neurologic exam is normal. Serum RPR is reactive at 1:8 and a treponemal EIA is reactive. No CSF exam was recommended. He has no drug allergy and can receive intravenous penicillin. He asks what drug and duration to start, and whether the ear service stays involved. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. Hearing has been reduced for 10 days, and mentation is clear.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Benzathine penicillin G 2.4 million units once, and no ear follow-up", "Aqueous crystalline penicillin G 18-24 million units daily for 10-14 days, with ear care", "Benzathine penicillin G 7.2 million units in three weekly doses for this patient during today's visit", "Delay penicillin until a CSF-VDRL is obtained anyway for this patient", "Procaine penicillin daily without probenecid for 3 days for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "hearing-symptoms-neuro-penicillin", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Aqueous crystalline penicillin G 18-24 million units daily for 10-14 days, with ear care$ky$,
  $ex$Isolated hearing symptoms, a normal neurologic exam, and reactive serology are treated with the neurologic regimen, and otolaryngology is involved. CSF is not recommended before treatment. The regimen is aqueous crystalline penicillin G 18-24 million units per day for 10-14 days. "Benzathine penicillin G 2.4 million units once, and no ear follow-up" is not the best choice because The single 2.4 million unit benzathine dose is for early infection without ear involvement, and otolaryngology should remain involved. "Benzathine penicillin G 7.2 million units in three weekly doses for this patient during today's visit" is not the best choice because The 7.2 million unit three-dose course is not the treatment of hearing disease. "Delay penicillin until a CSF-VDRL is obtained anyway for this patient" is not the best choice because A CSF exam is not recommended before treatment of isolated hearing symptoms when the neurologic exam is normal. "Procaine penicillin daily without probenecid for 3 days for this patient" is not the best choice because The procaine alternative includes probenecid 500 mg orally four times daily and lasts 10-14 days, and only if compliance is certain. It is not a 3-day course without probenecid.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '3a8da0d0746500050b1de68f980e9e5f5c4b56fc83dbd4c06e1912df07b2ce51', false, NOW(), NOW(), 3,
  'hearing-symptoms-neuro-penicillin', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'hearing-symptoms-neuro-penicillin', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-172", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210173', 'usmle-step-2', 'neurology',
  $sc$A 31-year-old man who works as a stage electrician is seen in the HIV clinic because of a painless genital ulcer for 10 days. He has had HIV for 6 years and takes antiretroviral therapy. The neurologic exam has no cranial-nerve deficit, eyes and hearing are unaffected, and mentation is clear. Serum RPR is reactive at 1:32 and a treponemal test is reactive. A colleague plans two extra weekly benzathine doses because of HIV. Temperature is 36.8°C, pulse is 78/min, respirations are 14/min, and blood pressure is 120/76 mm Hg. The ulcer has lasted 10 days, and there is no fever today.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Three weekly 2.4 million unit doses because he has HIV for this patient", "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days", "Benzathine penicillin G 2.4 million units intramuscularly once; extra doses do not help", "No penicillin until the CSF is examined, because he has HIV for this patient", "Procaine penicillin plus probenecid for 10-14 days because of HIV for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "hiv-early-infection-no-extra-doses", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Benzathine penicillin G 2.4 million units intramuscularly once; extra doses do not help$ky$,
  $ex$Early infection without neurologic, eye, or ear disease is treated with benzathine penicillin G 2.4 million units IM once. Extra doses do not improve efficacy, including in people with HIV. HIV alone is not a neurologic sign and does not require the 18-24 million unit regimen or a CSF exam. "Three weekly 2.4 million unit doses because he has HIV for this patient" is not the best choice because Adding weekly doses does not improve efficacy in people with HIV. The early dose remains 2.4 million units IM once. "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days" is not the best choice because The 18-24 million unit daily course for 10-14 days is for neurologic, ocular, or otic disease, which he does not have. "No penicillin until the CSF is examined, because he has HIV for this patient" is not the best choice because CSF is examined before treatment when neurologic signs are present. HIV without those signs is not that indication. "Procaine penicillin plus probenecid for 10-14 days because of HIV for this patient at the present visit" is not the best choice because Daily procaine penicillin G plus probenecid is the alternative neurologic regimen when compliance is certain, not an HIV-specific early regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '739e6d9149a5aab8994bc8f23503278e913f5afd3961c169f28b8017eef36981', false, NOW(), NOW(), 4,
  'hiv-early-infection-no-extra-doses', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'hiv-early-infection-no-extra-doses', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-173", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210174', 'usmle-step-2', 'neurology',
  $sc$A 61-year-old woman who works as a choir librarian is seen in the ward after CSF testing done for a new stroke deficit. The CSF-VDRL is reactive and the tube had no visible blood. Serum RPR is 1:256 and a treponemal EIA is reactive. Arm weakness began 2 days ago. Someone proposes finishing treatment with benzathine penicillin G 2.4 million units weekly for three weeks only. Temperature is 36.9°C, pulse is 80/min, respirations are 16/min, and blood pressure is 150/86 mm Hg. No penicillin has been started, and she can receive an intravenous infusion.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Benzathine penicillin G 2.4 million units weekly for three weeks only", "Benzathine penicillin G 2.4 million units intramuscularly once", "A 4-day infusion, then three weekly benzathine doses for this patient", "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days", "No antibiotic, because a reactive CSF-VDRL is too nonspecific to treat at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "positive-csf-not-weekly-benzathine", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days$ky$,
  $ex$Reactive CSF-VDRL without blood contamination, reactive serum tests, and a stroke support neurologic infection. Treatment is aqueous crystalline penicillin G 18-24 million units per day for 10-14 days. Three weekly benzathine doses totaling 7.2 million units do not treat this form. "Benzathine penicillin G 2.4 million units weekly for three weeks only" is not the best choice because The three-dose 7.2 million unit benzathine schedule is for late latent or unknown-duration infection and for tertiary disease with a normal CSF exam. This CSF-VDRL is reactive. "Benzathine penicillin G 2.4 million units intramuscularly once" is not the best choice because One 2.4 million unit dose is the early-infection regimen, not treatment after a reactive CSF-VDRL and a stroke. "A 4-day infusion, then three weekly benzathine doses for this patient" is not the best choice because The neurologic duration is 10-14 days of the aqueous regimen. A 4-day infusion plus weekly benzathine is not the stated course. "No antibiotic, because a reactive CSF-VDRL is too nonspecific to treat at the present visit" is not the best choice because CSF-VDRL is specific, though insensitive. A reactive result without blood contamination supports the diagnosis and is a reason to treat, not a reason to withhold antibiotics.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'f4cd51cb776f080bedc8f6fa776b03ca132a1f7a58e256502b2862d4620fd6b8', false, NOW(), NOW(), 3,
  'positive-csf-not-weekly-benzathine', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'positive-csf-not-weekly-benzathine', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-174", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210175', 'usmle-step-2', 'neurology',
  $sc$A 59-year-old man who works as a rare-book shelver is seen in the primary care office after a reactive blood test of unknown duration. He has no memory of an ulcer, a rash, or prior treatment. The neurologic exam is normal, hearing is intact, and an eye exam shows no inflammation. Serum RPR is reactive at 1:8 and a treponemal EIA is reactive. The date of acquisition cannot be set. He feels well and weighs 83 kg. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 134/80 mm Hg. No CSF exam has been required, and he has no cranial-nerve deficit.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Benzathine penicillin G 2.4 million units intramuscularly once for this patient at this encounter", "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days", "No treatment, because he has no neurologic symptoms for this patient", "Procaine penicillin plus probenecid for 10-14 days for this patient", "Benzathine penicillin G 7.2 million units as three weekly 2.4 million unit injections"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "unknown-duration-three-weekly-doses", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Benzathine penicillin G 7.2 million units as three weekly 2.4 million unit injections$ky$,
  $ex$Infection of unknown duration, with a normal neurologic exam and no eye or ear findings, is treated as late latent or unknown-duration disease: benzathine penicillin G 7.2 million units total, as three weekly IM doses of 2.4 million units. A single 2.4 million unit dose is for early infection. "Benzathine penicillin G 2.4 million units intramuscularly once for this patient at this encounter" is not the best choice because One 2.4 million unit dose does not complete treatment when the duration is unknown. "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days" is not the best choice because The 18-24 million unit daily regimen is for neurologic, ocular, or otic disease. He has none of those findings. "No treatment, because he has no neurologic symptoms for this patient" is not the best choice because Absence of neurologic symptoms does not mean no treatment. Reactive treponemal and nontreponemal tests of unknown duration are treated. "Procaine penicillin plus probenecid for 10-14 days for this patient" is not the best choice because Daily procaine penicillin G plus probenecid is the alternative neurologic regimen when compliance is certain, not the unknown-duration regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '0ba9e8679d052e66a4572581af37b926c7863a051756da20946b03e6068952bb', false, NOW(), NOW(), 3,
  'unknown-duration-three-weekly-doses', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'unknown-duration-three-weekly-doses', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-175", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210176', 'usmle-step-2', 'neurology',
  $sc$A 64-year-old woman who works as a bell-tower keeper is seen in the neurology clinic because of a new left abducens palsy and old, undated positive blood tests. A treponemal test and an RPR of 1:16 were first filed years ago, but no treatment is recorded, so the original duration was never defined. The palsy began 4 days ago. There is no eye inflammation. She has not had a lumbar puncture. Temperature is 36.8°C, pulse is 74/min, respirations are 15/min, and blood pressure is 140/78 mm Hg. The cranial-nerve deficit is new, and the earlier serology was never treated.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Examine the CSF before treatment; do not start the three weekly benzathine doses", "Give three weekly 2.4 million unit doses because the duration is unknown at this encounter", "Give benzathine penicillin G 2.4 million units once for the old tests", "Skip CSF because the eye exam shows no inflammation for this patient", "Use the isolated-hearing pathway and involve only otolaryngology"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "unknown-duration-plus-palsy-not-weekly", "taskCategory": "clinical-intervention"}$op$,
  $ky$Examine the CSF before treatment; do not start the three weekly benzathine doses$ky$,
  $ex$Unknown duration would ordinarily be treated with benzathine penicillin G 7.2 million units as three weekly 2.4 million unit doses, but a cranial-nerve deficit is a neurologic sign. Neurologic signs require a CSF exam before treatment, so the late-latent schedule is not started in place of that exam. "Give three weekly 2.4 million unit doses because the duration is unknown at this encounter" is not the best choice because The three-dose schedule does not override a new abducens palsy. CSF is examined before treatment when a cranial-nerve deficit is present. "Give benzathine penicillin G 2.4 million units once for the old tests" is not the best choice because A single 2.4 million unit dose treats early infection, not undated untreated serology, and it does not replace CSF evaluation of a nerve palsy. "Skip CSF because the eye exam shows no inflammation for this patient" is not the best choice because A normal eye exam does not cancel a cranial-nerve deficit. The eye exception is for isolated confirmed eye findings without a nerve deficit. "Use the isolated-hearing pathway and involve only otolaryngology" is not the best choice because She has no isolated hearing complaint. Otolaryngology is for isolated hearing symptoms with a normal neurologic exam.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'fd655434719e21d14bfb6a9b5f27f2dde9ff6c087230fa5d28521efcab510c94', false, NOW(), NOW(), 4,
  'unknown-duration-plus-palsy-not-weekly', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'unknown-duration-plus-palsy-not-weekly', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-176", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210177', 'usmle-step-2', 'neurology',
  $sc$A 70-year-old man who works as a retired boiler inspector is seen in the cardiology clinic after imaging showed aortic-root widening from longstanding untreated infection. A CSF exam yesterday was normal, including a nonreactive CSF-VDRL without blood contamination. There is no cranial-nerve deficit, no hearing loss, and no eye inflammation. Mentation is clear. Serum RPR is reactive at 1:4. The team asks which penicillin course fits tertiary disease after a normal CSF exam. Temperature is 36.6°C, pulse is 66/min, respirations are 14/min, and blood pressure is 146/78 mm Hg. The CSF exam was completed 1 day ago and showed no blood.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days", "Benzathine penicillin G 7.2 million units total, as three weekly 2.4 million unit doses", "Benzathine penicillin G 2.4 million units intramuscularly once for this patient during today's visit", "Procaine penicillin G daily plus probenecid for 10-14 days for this patient", "No penicillin, because the CSF-VDRL is nonreactive for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "normal-csf-tertiary-three-weekly-doses", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Benzathine penicillin G 7.2 million units total, as three weekly 2.4 million unit doses$ky$,
  $ex$Tertiary disease with a normal CSF exam is treated with benzathine penicillin G 7.2 million units total, given as three weekly IM doses of 2.4 million units. The 18-24 million unit daily regimen is for neurologic, ocular, or otic disease, which this normal CSF exam and normal neurologic exam do not show. "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days" is not the best choice because Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days is not the regimen once the CSF exam is normal and there are no neurologic, eye, or ear findings. "Benzathine penicillin G 2.4 million units intramuscularly once for this patient during today's visit" is not the best choice because A single 2.4 million unit dose treats early infection, not tertiary disease. "Procaine penicillin G daily plus probenecid for 10-14 days for this patient" is not the best choice because Procaine penicillin plus probenecid is the alternative when a neurologic regimen is required and compliance is certain. It is not the regimen after a normal CSF exam in tertiary disease. "No penicillin, because the CSF-VDRL is nonreactive for this patient" is not the best choice because A negative CSF-VDRL does not by itself decide treatment of tertiary disease. Here the CSF exam is normal, and the stated regimen is the three-dose benzathine course. A negative CSF-VDRL also does not exclude neurologic infection when neurologic signs are present; this patient has none.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '5832480569d90643ffd7e3552d2fbfcea6b3982ea4c8434fe802259f0c637b9c', false, NOW(), NOW(), 4,
  'normal-csf-tertiary-three-weekly-doses', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'normal-csf-tertiary-three-weekly-doses', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-177", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210178', 'usmle-step-2', 'neurology',
  $sc$A 28-year-old man who works as a brewery line worker is seen in the sexual health clinic for a painless genital ulcer present for 9 days. Serum RPR is reactive at 1:32 and a treponemal test is reactive. The neurologic, eye, and ear exams are normal. The pharmacy offers a combined benzathine-plus-procaine product, Bicillin C-R, and asks if that may replace the recommended injection. He has no drug allergy. Temperature is 36.8°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. The ulcer has lasted 9 days, and he has not received an antibiotic.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["The combined benzathine-plus-procaine product, Bicillin C-R, 2.4 million units once", "Bicillin C-R weekly for three weeks because it contains procaine", "Benzathine penicillin G alone, Bicillin L-A, 2.4 million units intramuscularly once", "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days", "Oral probenecid 500 mg four times daily and no penicillin injection"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "benzathine-product-la-not-cr", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Benzathine penicillin G alone, Bicillin L-A, 2.4 million units intramuscularly once$ky$,
  $ex$Early infection without neurologic, eye, or ear disease is treated with benzathine penicillin G 2.4 million units IM once. The recommended product is benzathine penicillin G, Bicillin L-A. Bicillin C-R, which combines benzathine and procaine, is the wrong product. "The combined benzathine-plus-procaine product, Bicillin C-R, 2.4 million units once" is not the best choice because Bicillin C-R is benzathine plus procaine and is the wrong product for this 2.4 million unit dose. "Bicillin C-R weekly for three weeks because it contains procaine" is not the best choice because Adding weeks of the wrong product does not correct the product, and extra benzathine doses do not improve efficacy in early infection. "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days" is not the best choice because The 18-24 million unit daily aqueous regimen is for neurologic, ocular, or otic disease. His exams are normal. "Oral probenecid 500 mg four times daily and no penicillin injection" is not the best choice because Probenecid is not treatment by itself. It is paired with daily procaine penicillin G only in the alternative neurologic regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '701ad943c9075985ec31fb5473114a4de5dc412ff7faef86695e0c0821781f4a', false, NOW(), NOW(), 3,
  'benzathine-product-la-not-cr', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'benzathine-product-la-not-cr', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-178", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210179', 'usmle-step-2', 'neurology',
  $sc$A 47-year-old man who works as a drawbridge operator is seen in the neurology ward after lumbar puncture for a new cranial-nerve palsy. Serum RPR is reactive at 1:64 and a treponemal EIA is reactive. The CSF-VDRL is reactive. The laboratory notes that the CSF sample was not contaminated with blood. The palsy began 5 days ago and involves eye abduction on the left. Temperature is 37.0°C, pulse is 82/min, respirations are 16/min, and blood pressure is 130/80 mm Hg. The CSF result is available today, and the palsy has lasted 5 days.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A reactive CSF-VDRL is meaningless unless the serum RPR is nonreactive", "Blood-free CSF-VDRL reactivity excludes neurologic infection", "The result matters only if it is compared with a serum VDRL from today", "A reactive CSF-VDRL without blood contamination supports neurologic infection", "A reactive CSF-VDRL means a single 2.4 million unit dose already cured him at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "reactive-csf-vdrl-supports-neuro", "taskCategory": "diagnosis"}$op$,
  $ky$A reactive CSF-VDRL without blood contamination supports neurologic infection$ky$,
  $ex$A reactive CSF-VDRL without blood contamination, together with reactive serum tests and neurologic signs, supports neurologic infection. CSF-VDRL is specific but insensitive. His serum RPR is reactive at 1:64 and he has a cranial-nerve palsy. "A reactive CSF-VDRL is meaningless unless the serum RPR is nonreactive" is not the best choice because Support for the diagnosis uses reactive serum tests, not a nonreactive RPR. A nonreactive RPR is part of a different, reverse-sequence pattern. "Blood-free CSF-VDRL reactivity excludes neurologic infection" is not the best choice because Reactivity, not a negative result, is what supports the diagnosis. A negative CSF-VDRL would not exclude it, but this result is reactive. "The result matters only if it is compared with a serum VDRL from today" is not the best choice because CSF-VDRL is interpreted with the serum tests and the neurologic findings. It is not validated by pairing it with a different serum test on the same day. Titer comparisons use the same test over time. "A reactive CSF-VDRL means a single 2.4 million unit dose already cured him at the present visit" is not the best choice because A reactive CSF-VDRL is a reason to treat with aqueous crystalline penicillin G 18-24 million units per day for 10-14 days, not evidence that a 2.4 million unit dose has finished the job.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'f7fb5f798e3b9de2ca706d10ca4bf57420f93d08ac4031a917bef0d5bffdd153', false, NOW(), NOW(), 1,
  'reactive-csf-vdrl-supports-neuro', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'reactive-csf-vdrl-supports-neuro', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-179", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210180', 'usmle-step-2', 'neurology',
  $sc$A 43-year-old woman who works as a ferry captain is seen in the neurology clinic after a lumbar puncture for headache, fever, and neck stiffness. Serum RPR is reactive at 1:128 and a treponemal test is reactive. The CSF-VDRL is nonreactive, and the sample had no blood contamination. She still has meningitis signs. A resident says the negative CSF-VDRL rules out neurologic infection and that the test is too nonspecific to trust. Temperature is 38.2°C, pulse is 100/min, respirations are 18/min, and blood pressure is 126/74 mm Hg. Neck stiffness has lasted 2 days, and the CSF-VDRL report is nonreactive.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A negative CSF-VDRL excludes neurologic infection when the sample is blood-free", "CSF-VDRL is nonspecific, so a negative result is the only useful one", "A negative CSF-VDRL should be subtracted from the serum RPR as a fourfold change", "Nonreactive CSF-VDRL means the serum EIA must have been a false signal only", "A negative CSF-VDRL does not exclude neurologic infection; it is insensitive"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "negative-csf-vdrl-does-not-exclude", "taskCategory": "interpretation"}$op$,
  $ky$A negative CSF-VDRL does not exclude neurologic infection; it is insensitive$ky$,
  $ex$CSF-VDRL is specific but insensitive. A negative result does not exclude neurologic infection, including when the sample has no blood contamination. She has meningitis signs and reactive serum tests, with RPR 1:128, so a nonreactive CSF-VDRL cannot clear that diagnosis. "A negative CSF-VDRL excludes neurologic infection when the sample is blood-free" is not the best choice because Lack of blood contamination makes a reactive result interpretable. It does not turn a negative CSF-VDRL into an exclusion. "CSF-VDRL is nonspecific, so a negative result is the only useful one" is not the best choice because The test is specific and insensitive, which is the opposite of calling it nonspecific and useful only when negative. "A negative CSF-VDRL should be subtracted from the serum RPR as a fourfold change" is not the best choice because A fourfold change is a comparison of the same serum test over time, such as RPR with RPR. CSF-VDRL is not subtracted from a serum RPR. "Nonreactive CSF-VDRL means the serum EIA must have been a false signal only" is not the best choice because A reactive serum treponemal test is not discarded because CSF-VDRL is negative. The CSF test's insensitivity is the point.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'a1fe87375a35b49fd9e4b5543e097635ded6316768ab27f7ed95f9764dfa09d8', false, NOW(), NOW(), 3,
  'negative-csf-vdrl-does-not-exclude', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'negative-csf-vdrl-does-not-exclude', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-180", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210181', 'usmle-step-2', 'neurology',
  $sc$A 37-year-old woman who works as a pottery-kiln technician is seen in the follow-up clinic to review serial blood tests after treatment. Before treatment the serum RPR was 1:32. Today the serum RPR is 1:8. No VDRL was drawn at either visit. She feels well, and the neurologic exam is normal. She asks whether the change in the RPR numbers is a meaningful one. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The two RPR results are 1:32 and 1:8, drawn from the same test type.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The RPR fall from 1:32 to 1:8 is a fourfold change and is the meaningful comparison", "Only a fall from 1:32 to nonreactive would count as meaningful", "A one-dilution change would have been the standard she needed to meet", "The change is meaningless until a paired VDRL is drawn today for this patient", "A fourfold change would have required a fall from 1:32 to 1:2 for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "rpr-drop-fourfold-is-meaningful", "taskCategory": "interpretation"}$op$,
  $ky$The RPR fall from 1:32 to 1:8 is a fourfold change and is the meaningful comparison$ky$,
  $ex$A fourfold titer change, which is two dilutions, is the meaningful change. The example is 1:32 to 1:8. Both results are RPR, so the same test is being compared. Her drop from 1:32 to 1:8 meets that standard. "Only a fall from 1:32 to nonreactive would count as meaningful" is not the best choice because The meaningful change is fourfold, not a requirement that the test become nonreactive. "A one-dilution change would have been the standard she needed to meet" is not the best choice because One dilution, such as 1:32 to 1:16, is a twofold change and is not the fourfold standard. "The change is meaningless until a paired VDRL is drawn today for this patient" is not the best choice because RPR is compared with RPR. A same-day VDRL is not required to interpret two RPR results. "A fourfold change would have required a fall from 1:32 to 1:2 for this patient at the present visit" is not the best choice because A fall from 1:32 to 1:2 would be a sixteenfold change. The fourfold example is 1:32 to 1:8.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'e892e54a46f1b05266a71520d2af5b9581255ef3878037e1dfafc943574f010d', false, NOW(), NOW(), 1,
  'rpr-drop-fourfold-is-meaningful', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'rpr-drop-fourfold-is-meaningful', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-181", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210182', 'usmle-step-2', 'neurology',
  $sc$A 45-year-old man who works as a lock tender is seen in the follow-up clinic with two serum RPR results after treatment. The pretreatment serum RPR was 1:64. The serum RPR today is 1:32. He feels well, and hearing, vision, and the cranial nerves are normal. He believes a single dilution must be the meaningful response because the number fell. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 126/78 mm Hg. Both values are serum RPR results, 1:64 then 1:32.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A fall from 1:64 to 1:32 is a fourfold change and meets the standard at this encounter", "A fall from 1:64 to 1:32 is one dilution, not the meaningful fourfold change", "Any decrease at all is the meaningful titer change for this patient", "The result should be ignored unless a VDRL today is also 1:32", "One dilution is meaningful only when the first titer was 1:8"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "rpr-drop-one-dilution-not-fourfold", "taskCategory": "interpretation"}$op$,
  $ky$A fall from 1:64 to 1:32 is one dilution, not the meaningful fourfold change$ky$,
  $ex$The meaningful change is fourfold, equal to two dilutions, for example 1:32 to 1:8. A fall from 1:64 to 1:32 is one dilution, a twofold change, so it does not meet that standard. The comparison is valid because both tests are RPR. "A fall from 1:64 to 1:32 is a fourfold change and meets the standard at this encounter" is not the best choice because 1:64 to 1:32 is twofold, not fourfold. A fourfold drop from 1:64 would reach 1:16. "Any decrease at all is the meaningful titer change for this patient" is not the best choice because The source does not treat any decrease as meaningful. It specifies a fourfold change. "The result should be ignored unless a VDRL today is also 1:32" is not the best choice because Same-test comparison is already satisfied by two RPR results. A VDRL is not required to match the second RPR. "One dilution is meaningful only when the first titer was 1:8" is not the best choice because The fourfold rule is not limited to a starting titer of 1:8. The worked example is 1:32 to 1:8.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', '088d05aa2ea2caf5e0ef84fb1cef0c44700e7358450119619af8ce72dbd271e8', false, NOW(), NOW(), 4,
  'rpr-drop-one-dilution-not-fourfold', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'rpr-drop-one-dilution-not-fourfold', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-182", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210183', 'usmle-step-2', 'neurology',
  $sc$A 40-year-old woman who works as a taxidermy conservator is seen in the follow-up clinic with mismatched serologic reports from two laboratories. Before treatment, serum RPR was 1:32. The only follow-up test on the chart is a serum VDRL of 1:8 drawn later. No second RPR was done. She asks whether 1:32 to 1:8 proves a fourfold response. The neurologic exam is normal. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. The baseline test was RPR and the later test was VDRL.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["RPR 1:32 to VDRL 1:8 is a valid fourfold change of the same test", "Any two numeric titers may be paired if both are 1:32 and 1:8", "Do not call this a fourfold change; compare RPR with RPR, not RPR with VDRL", "A fourfold change requires the second test to be a different method in the office today", "The VDRL must be higher than the RPR or the change does not count"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "rpr-cannot-be-paired-with-vdrl", "taskCategory": "interpretation"}$op$,
  $ky$Do not call this a fourfold change; compare RPR with RPR, not RPR with VDRL$ky$,
  $ex$A fourfold change, two dilutions, is interpreted only when the same test is compared, RPR with RPR or VDRL with VDRL, not RPR with VDRL. The example 1:32 to 1:8 is meaningful only as a same-test change. These two results cannot be paired. "RPR 1:32 to VDRL 1:8 is a valid fourfold change of the same test" is not the best choice because RPR and VDRL are different tests. A numeric drop between them is not a same-test fourfold change. "Any two numeric titers may be paired if both are 1:32 and 1:8" is not the best choice because The titers 1:32 and 1:8 illustrate a fourfold change only when they come from the same test. "A fourfold change requires the second test to be a different method in the office today" is not the best choice because The rule is the opposite: use the same test both times, not a different method. "The VDRL must be higher than the RPR or the change does not count" is not the best choice because There is no rule that the second test must be higher. The direction is a change of fourfold on one test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'e588fb82e94839cf4158d3d0414a0a5254ed04b47b326afb801627a9e9ed0f05', false, NOW(), NOW(), 4,
  'rpr-cannot-be-paired-with-vdrl', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'rpr-cannot-be-paired-with-vdrl', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-183", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210184', 'usmle-step-2', 'neurology',
  $sc$A 62-year-old man who works as a clock-museum guide is seen in the primary care office after a laboratory used a reverse testing sequence. A treponemal EIA is reactive and the serum RPR is nonreactive. A second treponemal test, TP-PA, is negative. He has had one mutually monogamous partner for 22 years, no prior ulcer, and no prior positive test, and his clinician judges his risk to be low. The neurologic exam is normal. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 132/78 mm Hg. He has no hearing change, no eye symptoms, and no cranial-nerve deficit.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Treat with benzathine penicillin G 2.4 million units once", "Treat with three weekly doses totaling 7.2 million units", "Start aqueous crystalline penicillin G 18-24 million units per day in the office today", "Do not treat; the second treponemal test is negative and risk is low", "Examine the CSF before deciding, because the EIA was reactive"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "reverse-sequence-negative-tppa-observe", "taskCategory": "interpretation"}$op$,
  $ky$Do not treat; the second treponemal test is negative and risk is low$ky$,
  $ex$In the reverse sequence, a reactive EIA and a nonreactive RPR are followed by a second treponemal test, TP-PA. If that test is negative and risk is low, do not treat. A positive TP-PA with no treatment history would instead be treated with 7.2 million units as three weekly doses of 2.4 million units. His TP-PA is negative, and there are no neurologic signs. "Treat with benzathine penicillin G 2.4 million units once" is not the best choice because A single 2.4 million unit dose is treatment for early infection, not the next step when the second treponemal test is negative and risk is low. "Treat with three weekly doses totaling 7.2 million units" is not the best choice because The 7.2 million unit course is for a positive second treponemal test without treatment history, or for unknown-duration infection. His TP-PA is negative. "Start aqueous crystalline penicillin G 18-24 million units per day in the office today" is not the best choice because The 18-24 million unit regimen is for neurologic, ocular, or otic disease. He has none of those findings. "Examine the CSF before deciding, because the EIA was reactive" is not the best choice because A reactive EIA alone, with a nonreactive RPR and no neurologic signs, is not an indication to examine CSF before applying the low-risk, negative TP-PA rule.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', '4dbf4713f4eab39a86e9b8c6de21ff5303d6e56507beeb2a39b993a58f698d02', false, NOW(), NOW(), 4,
  'reverse-sequence-negative-tppa-observe', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'reverse-sequence-negative-tppa-observe', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-184", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210185', 'usmle-step-2', 'neurology',
  $sc$A 48-year-old woman who works as a coral-taxonomy editor is seen in the infectious diseases clinic after reverse-sequence tests and no record of treatment. The treponemal EIA is reactive, the serum RPR is nonreactive, and the TP-PA is positive. She has never been treated. The neurologic exam is normal, hearing is normal, and an eye exam shows no inflammation. She asks which penicillin course fits this pattern. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. No earlier positive test and no treatment are recorded in 15 years of charts.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["No treatment, because the RPR is nonreactive and risk was not called low", "Benzathine penicillin G 2.4 million units intramuscularly once for this patient during today's visit", "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days", "Procaine penicillin G daily plus probenecid, because the TP-PA is positive", "Benzathine penicillin G 7.2 million units total, as three weekly 2.4 million unit doses"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "reverse-sequence-positive-tppa-treat-late", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Benzathine penicillin G 7.2 million units total, as three weekly 2.4 million unit doses$ky$,
  $ex$When the EIA is reactive, the RPR is nonreactive, and the second treponemal test is positive, with no treatment history, treat as unknown-duration or late latent infection. That regimen is benzathine penicillin G 7.2 million units total, three weekly IM doses of 2.4 million units. She has no neurologic, eye, or ear findings. "No treatment, because the RPR is nonreactive and risk was not called low" is not the best choice because Do-not-treat applies when the second treponemal test is negative and risk is low. Her TP-PA is positive, so that rule does not apply. "Benzathine penicillin G 2.4 million units intramuscularly once for this patient during today's visit" is not the best choice because A single 2.4 million unit dose treats early infection, not this unknown-duration pattern. "Aqueous crystalline penicillin G 18-24 million units per day for 10-14 days" is not the best choice because The 18-24 million unit daily course is for neurologic, ocular, or otic disease, which is not present. "Procaine penicillin G daily plus probenecid, because the TP-PA is positive" is not the best choice because Procaine penicillin plus probenecid is the alternative neurologic regimen when compliance is certain, not the treatment of a positive TP-PA with a nonreactive RPR and a normal exam.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '7ec211f213d72ceb66c63b3cc44588b0136828f1957e710b0e08713a55b5b1b3', false, NOW(), NOW(), 5,
  'reverse-sequence-positive-tppa-treat-late', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'reverse-sequence-positive-tppa-treat-late', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-185", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210186', 'usmle-step-2', 'neurology',
  $sc$A 28-year-old woman who works as a conservatory vocal coach is seen in the obstetric infectious diseases clinic at 24 weeks of gestation with a documented penicillin allergy. The prior reaction was hives. Ophthalmology confirms intraocular inflammation, and there is no cranial-nerve deficit. Serum RPR is reactive at 1:64 and a treponemal test is reactive. The fetal heart rate is 148/min. A clinician wants to avoid penicillin because a fever reaction might occur after the first dose. Temperature is 36.7°C, pulse is 88/min, respirations are 16/min, and blood pressure is 110/66 mm Hg. Eye symptoms have lasted 8 days, and she has not been desensitized or treated.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Desensitize now and give aqueous penicillin G 18-24 million units daily for 10-14 days", "Withhold penicillin and choose a non-penicillin regimen because of the allergy at this encounter", "Delay all treatment until after delivery in case fever and myalgia occur", "Desensitize, then give benzathine penicillin G 2.4 million units once", "Require a CSF exam before discussing desensitization for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "pregnant-penicillin-allergy-eye-desensitize", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Desensitize now and give aqueous penicillin G 18-24 million units daily for 10-14 days$ky$,
  $ex$In pregnancy, penicillin is the only regimen with documented efficacy. If she is allergic, desensitize and treat with penicillin. Do not delay because a Jarisch-Herxheimer reaction, fever and myalgia within 24 hours, might occur. Isolated confirmed eye disease without a cranial-nerve deficit uses aqueous crystalline penicillin G 18-24 million units per day for 10-14 days, and CSF is not required first. "Withhold penicillin and choose a non-penicillin regimen because of the allergy at this encounter" is not the best choice because A non-penicillin regimen does not have the documented efficacy penicillin has in pregnancy. Allergy is managed by desensitization, not by switching classes. "Delay all treatment until after delivery in case fever and myalgia occur" is not the best choice because Treatment is not delayed because a Jarisch-Herxheimer reaction might occur. That reaction is not an allergy. "Desensitize, then give benzathine penicillin G 2.4 million units once" is not the best choice because After desensitization she still needs the neurologic regimen for eye disease, not the early-infection dose of 2.4 million units once. "Require a CSF exam before discussing desensitization for this patient" is not the best choice because CSF is not required before treatment of isolated eye findings confirmed on exam when there is no cranial-nerve deficit. Desensitization should not be postponed for that test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'b58c4dff368c888fc86d6e100d86ffdb26ecfa056c2dd365b2495a65da2c1216', false, NOW(), NOW(), 5,
  'pregnant-penicillin-allergy-eye-desensitize', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'pregnant-penicillin-allergy-eye-desensitize', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-186", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210187', 'usmle-step-2', 'neurology',
  $sc$A 24-year-old man who works as a bike-shop mechanic is seen in the sexual health clinic after a partner was diagnosed 12 days ago. The partner's diagnosis was early infection in the primary stage, after a painless genital ulcer and a serum RPR of 1:32. Their last sexual contact was 18 days ago. His own serum RPR today is nonreactive and a treponemal EIA is nonreactive. He feels well and has no ulcer. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. The exposure was 18 days ago, which is inside a 90-day window, and both of his serum tests are nonreactive.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Hold treatment because today's serum RPR is nonreactive", "Treat him presumptively now even though today's serology is negative", "Hold treatment because today's treponemal EIA is nonreactive during today's visit", "Treat only if the exposure was more than 90 days ago", "Wait 90 days and treat only if a repeat RPR becomes reactive"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "partner-exposed-inside-ninety-days", "taskCategory": "clinical-intervention"}$op$,
  $ky$Treat him presumptively now even though today's serology is negative$ky$,
  $ex$Sex partners exposed fewer than 90 days before diagnosis of primary, secondary, or early latent infection are treated presumptively even if their serology is negative. His last exposure was 18 days ago, and the partner's diagnosis was early primary-stage infection. Negative RPR and EIA today do not withhold that treatment. "Hold treatment because today's serum RPR is nonreactive" is not the best choice because A nonreactive RPR does not cancel presumptive treatment inside the 90-day window. "Hold treatment because today's treponemal EIA is nonreactive during today's visit" is not the best choice because A nonreactive treponemal test likewise does not cancel presumptive treatment after an exposure under 90 days. "Treat only if the exposure was more than 90 days ago" is not the best choice because The rule is exposure fewer than 90 days, not exposure longer than 90 days. "Wait 90 days and treat only if a repeat RPR becomes reactive" is not the best choice because Presumptive treatment is given now. It is not deferred for 90 days to see whether the RPR turns reactive.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '08b7d113a7a2db288cc8319ee3f5b54f36b84b8fee08952c56959c12236dd4ff', false, NOW(), NOW(), 2,
  'partner-exposed-inside-ninety-days', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'partner-exposed-inside-ninety-days', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-187", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210188', 'usmle-step-2', 'neurology',
  $sc$A 34-year-old man who works as a foundry crane rigger is seen in the hospital ward 6 hours after his first dose of aqueous crystalline penicillin G. He is receiving 18-24 million units per day for neurologic infection after a reactive CSF-VDRL. He now has muscle aches and chills. There is no hives, no wheeze, and no tongue swelling. He had no prior penicillin allergy. A nurse asks to label the chart as a penicillin allergy and stop treatment. Temperature is 38.6°C, pulse is 108/min, respirations are 18/min, and blood pressure is 124/74 mm Hg. The fever and myalgia began 6 hours after the dose, well within 24 hours.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Record a penicillin allergy and stop the neurologic regimen", "Switch to a non-penicillin class because fever means allergy", "Fever and myalgia within 24 hours are not a penicillin allergy", "This reaction means the dose exceeded 24 million units in one push", "Delay the rest of the 10-14 day course for 2 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "posttreatment-fever-myalgia-not-allergy", "taskCategory": "interpretation"}$op$,
  $ky$Fever and myalgia within 24 hours are not a penicillin allergy$ky$,
  $ex$The Jarisch-Herxheimer reaction is fever and myalgia within 24 hours of treatment and is not an allergy. His symptoms began 6 hours after aqueous crystalline penicillin G was started. It should not be charted as a penicillin allergy and should not stop the 10-14 day neurologic regimen of 18-24 million units per day. "Record a penicillin allergy and stop the neurologic regimen" is not the best choice because Labeling this as an allergy and stopping treatment misclassifies fever and myalgia within 24 hours. "Switch to a non-penicillin class because fever means allergy" is not the best choice because The reaction is not an indication to leave penicillin. In pregnancy, penicillin remains the only regimen with documented efficacy, and this reaction is not an allergy in any patient. "This reaction means the dose exceeded 24 million units in one push" is not the best choice because The neurologic dose is 18-24 million units per day, not a rule that any fever means a single push exceeded 24 million units. "Delay the rest of the 10-14 day course for 2 weeks" is not the best choice because The course remains 10-14 days. A 2-week delay is not the response to this reaction.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "interpretation"]$tg$,
  's2-new-20261121-hidden', '35ffda21fcd068dd9313883784f91a178a74584420fa7072402432c07c398215', false, NOW(), NOW(), 3,
  'posttreatment-fever-myalgia-not-allergy', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'posttreatment-fever-myalgia-not-allergy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-188", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210189', 'usmle-step-2', 'neurology',
  $sc$A 25-year-old woman who works as a violin-bow maker is seen in the prenatal clinic at 20 weeks of gestation with a painless genital ulcer for 7 days. Serum RPR is reactive at 1:16 and a treponemal test is reactive. There is no cranial-nerve deficit, no hearing loss, and no eye inflammation. She has no penicillin allergy. The fetal heart rate is 152/min. The clinician wants to postpone penicillin until after birth because fever and muscle aches might follow the injection. Temperature is 36.7°C, pulse is 86/min, respirations are 14/min, and blood pressure is 108/64 mm Hg. The ulcer has been present for 7 days, and she has not been treated.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Postpone penicillin until after delivery because fever and myalgia might occur", "Wait for a CSF exam before any penicillin, despite a normal neurologic exam", "Give three weekly 2.4 million unit doses because she is pregnant", "Treat now with benzathine penicillin G 2.4 million units intramuscularly once", "Use a non-penicillin regimen to avoid a reaction after the injection"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "behavioral-nervous", "blueprintTopic": "pregnancy-do-not-postpone-penicillin", "taskCategory": "clinical-intervention"}$op$,
  $ky$Treat now with benzathine penicillin G 2.4 million units intramuscularly once$ky$,
  $ex$In pregnancy, penicillin is the only regimen with documented efficacy, and treatment is not delayed because a Jarisch-Herxheimer reaction might occur. That reaction is fever and myalgia within 24 hours and is not an allergy. Without neurologic, eye, or ear disease, this recent ulcer is treated with benzathine penicillin G 2.4 million units IM once. "Postpone penicillin until after delivery because fever and myalgia might occur" is not the best choice because Do not delay treatment because a Jarisch-Herxheimer reaction might occur. Pregnancy is a reason to treat with penicillin, not a reason to wait until after birth. "Wait for a CSF exam before any penicillin, despite a normal neurologic exam" is not the best choice because CSF is examined before treatment when neurologic signs are present. A normal neurologic exam and no eye or ear findings do not require CSF first. "Give three weekly 2.4 million unit doses because she is pregnant" is not the best choice because Pregnancy does not change early infection to the 7.2 million unit three-dose schedule. Extra doses do not improve efficacy of early treatment. "Use a non-penicillin regimen to avoid a reaction after the injection" is not the best choice because Penicillin is the only regimen with documented efficacy in pregnancy. A different class is not substituted to avoid this reaction.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "behavioral-nervous", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'a69214222c9b5e4eab675a89df8b2d570d0d211afe4ad86422fda866e6a47dc6', false, NOW(), NOW(), 4,
  'pregnancy-do-not-postpone-penicillin', 'behavioral-nervous', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'pregnancy-do-not-postpone-penicillin', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-189", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210190', 'usmle-step-2', 'rheumatology',
  $sc$A 76-year-old woman who works as a rosary-bead stringer is seen in the geriatric clinic for a routine visit and has never broken a bone. She walks to a chapel workshop 3 days a week and has no parent with a hip fracture. She does not smoke and does not drink alcohol. Her weight is 62 kg. Nobody has measured her hip or spine density. She asks whether any bone test is recommended at her age. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 138/76 mm Hg. She has had no fracture in the past 10 years, and today's visit is preventive.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Do no density test unless she first reports a risk factor", "Use a clinical risk tool and skip imaging if the tool is reassuring", "Defer testing until a parent hip fracture is documented", "Apply this recommendation only if she were a man of the same age", "Order DXA of the hip or spine because she is a woman 65 or older"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "dxa-order-for-woman-age-seventy-six", "taskCategory": "health-maintenance"}$op$,
  $ky$Order DXA of the hip or spine because she is a woman 65 or older$ky$,
  $ex$USPSTF recommends screening women 65 or older with DXA of the hip or spine, a Grade B recommendation. She is 76. Risk factors are not required at this age. The under-65 pathway, which starts with a risk factor and a clinical risk tool, is for postmenopausal women younger than 65. "Do no density test unless she first reports a risk factor" is not the best choice because Requiring a risk factor first is the pathway for postmenopausal women younger than 65, not for women 65 or older. "Use a clinical risk tool and skip imaging if the tool is reassuring" is not the best choice because A clinical risk tool helps decide on DXA in postmenopausal women younger than 65 after a risk factor is confirmed. It does not replace DXA in women 65 or older. "Defer testing until a parent hip fracture is documented" is not the best choice because Parental hip fracture is one risk factor used before age 65. It is not required for a woman of 76. "Apply this recommendation only if she were a man of the same age" is not the best choice because The recommendation as stated is about women. It does not become a male screening rule, and it does apply to her.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'ddc9c2b5ff7e992f9288dd29d2d26cf40e93c694299b3b8f8f2a91f4c1fefb6d', false, NOW(), NOW(), 1,
  'dxa-order-for-woman-age-seventy-six', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dxa-order-for-woman-age-seventy-six', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-190", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210191', 'usmle-step-2', 'rheumatology',
  $sc$A 84-year-old woman who works as a lace-pattern archivist is seen in the senior clinic to ask which bone test the recommendation actually names. She has never had a density scan. She does not smoke. Her weight is 58 kg. A family member suggests a forearm film instead of a hip or spine measurement. She has had no fracture. The visit is otherwise a routine checkup. Temperature is 36.4°C, pulse is 68/min, respirations are 16/min, and blood pressure is 142/74 mm Hg. She is 84, and no DXA result is in the chart.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["DXA of the hip or lumbar spine is the screening test to order", "A forearm film replaces hip and spine DXA after age 80", "A clinical risk tool is the screening test and imaging is optional", "Screening at this age uses only a parental hip-fracture history", "No imaging test is named for a woman once she is older than 65"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "dxa-hip-or-spine-woman-age-eighty-four", "taskCategory": "health-maintenance"}$op$,
  $ky$DXA of the hip or lumbar spine is the screening test to order$ky$,
  $ex$Women 65 or older are screened with DXA of the hip or spine. She is 84, so that is the named test. The WHO definition later uses the T-score at the hip or lumbar spine, which matches those sites. A forearm film is not the stated screening test. "A forearm film replaces hip and spine DXA after age 80" is not the best choice because The recommendation names DXA of the hip or spine. A forearm film is not that test, and age above 80 does not change the site. "A clinical risk tool is the screening test and imaging is optional" is not the best choice because The clinical risk tool is used for postmenopausal women younger than 65 after a risk factor is confirmed. It is not the screening test for a woman of 84. "Screening at this age uses only a parental hip-fracture history" is not the best choice because Parental hip fracture is a risk factor in the under-65 pathway, not the screening test itself. "No imaging test is named for a woman once she is older than 65" is not the best choice because Women older than 65 remain in the group screened with DXA of the hip or spine. The recommendation does not say imaging stops after 65.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '65e924f31a5bd290eba4f7592134341a6518a7abb30f31a8c1d780ff6537e531', false, NOW(), NOW(), 1,
  'dxa-hip-or-spine-woman-age-eighty-four', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dxa-hip-or-spine-woman-age-eighty-four', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-191", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210192', 'usmle-step-2', 'rheumatology',
  $sc$A 65-year-old woman who works as a seed-library clerk is seen in the primary care office on the week she turns 65, with no prior density test. Her periods stopped 12 years ago. She does not smoke, drinks no alcohol, and has no parent with a hip fracture. Her weight is 70 kg and has been called normal. She asks whether 65 is old enough for the hip or spine scan. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 126/76 mm Hg. She has never had a DXA, and she has had no fragility fracture.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Wait until age 70 because 65 is only the start of the risk-tool pathway", "Order DXA of the hip or spine now that her age is 65", "Confirm a risk factor and run a clinical risk tool before any DXA", "Do no scan because she lacks smoking, alcohol use, and low body weight", "Screen with a forearm T-score rather than the hip or spine"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "dxa-begins-at-woman-age-sixty-five", "taskCategory": "health-maintenance"}$op$,
  $ky$Order DXA of the hip or spine now that her age is 65$ky$,
  $ex$Screening women 65 or older with DXA of the hip or spine is a Grade B recommendation. She has just turned 65, so DXA is indicated. The step of confirming a risk factor and then using a tool such as FRAX applies to postmenopausal women younger than 65, not to her. "Wait until age 70 because 65 is only the start of the risk-tool pathway" is not the best choice because No age of 70 is stated. The recommendation is women 65 or older. "Confirm a risk factor and run a clinical risk tool before any DXA" is not the best choice because Risk-factor confirmation and a clinical risk tool come before DXA for postmenopausal women younger than 65. At 65, DXA is the screen. "Do no scan because she lacks smoking, alcohol use, and low body weight" is not the best choice because Smoking, excess alcohol, and low body weight are risk factors for the under-65 pathway. They are not required at age 65. "Screen with a forearm T-score rather than the hip or spine" is not the best choice because The named screening test is DXA of the hip or spine. The WHO definition also uses the hip or lumbar spine, not the forearm.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c13c0efe0aae3e137970664fda70a95189b17976e46548ed0acd43428486619b', false, NOW(), NOW(), 1,
  'dxa-begins-at-woman-age-sixty-five', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dxa-begins-at-woman-age-sixty-five', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-192", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210193', 'usmle-step-2', 'rheumatology',
  $sc$A 69-year-old woman who works as a choir-robe mender is seen in the clinic for a preventive visit and has none of the listed risk factors. She does not smoke, does not drink alcohol to excess, has a weight of 68 kg that is not low, and has no parent with a hip fracture. Her periods stopped at age 51. She wonders if the missing risk factors cancel a bone-density test. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 132/78 mm Hg. No DXA of the hip or spine is on record, and she has had no fracture.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Skip DXA because none of the four risk factors is present", "Run a clinical risk tool and order DXA only if it shows increased risk", "Order DXA of the hip or spine; risk factors are not required at age 69", "Wait until a parent sustains a hip fracture, then scan", "Treat age 69 as if she were younger than 65 and do not image"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "dxa-at-sixty-nine-without-risk-factors", "taskCategory": "health-maintenance"}$op$,
  $ky$Order DXA of the hip or spine; risk factors are not required at age 69$ky$,
  $ex$She is a woman 65 or older, so DXA of the hip or spine is recommended regardless of risk factors. Parental hip fracture, smoking, excess alcohol, and low body weight are used in postmenopausal women younger than 65. Their absence does not cancel screening at 69. "Skip DXA because none of the four risk factors is present" is not the best choice because Those risk factors do not have to be present for a woman 65 or older. "Run a clinical risk tool and order DXA only if it shows increased risk" is not the best choice because The clinical risk tool decides DXA only in the postmenopausal under-65 pathway, after a risk factor is confirmed. She is 69. "Wait until a parent sustains a hip fracture, then scan" is not the best choice because A parental hip fracture is not a prerequisite for screening women 65 or older. "Treat age 69 as if she were younger than 65 and do not image" is not the best choice because Age 69 is not younger than 65. The automatic DXA recommendation applies.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '99fc9b9f8ffb22b2af2216325f2dfbf2f11e330a9bcf3c5c5242d89a8b2dac47', false, NOW(), NOW(), 2,
  'dxa-at-sixty-nine-without-risk-factors', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'dxa-at-sixty-nine-without-risk-factors', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-193", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210194', 'usmle-step-2', 'rheumatology',
  $sc$A 88-year-old woman who works as a quilt-frame builder is seen in the home-visit clinic because a relative thinks she is past the age for a bone scan. She has never had DXA. She does not smoke. Her weight is 54 kg. She still pieces quilt frames and has had no hip fracture. The relative cites an age of 80 as a stopping point. No such limit is being read from a result; she is simply 88. Temperature is 36.4°C, pulse is 66/min, respirations are 16/min, and blood pressure is 146/72 mm Hg. There is no prior hip or spine DXA in the home record.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Stop screening after age 80 even though she is a woman older than 65", "Switch her to the under-65 risk-tool pathway because of advanced age", "Order DXA only if a forearm T-score is already -2.5 or lower for this patient in the office today", "DXA remains indicated; she is a woman 65 or older, and age 80 is not a stated stop", "The recommendation gives men and women the same upper age of 80"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "dxa-still-indicated-at-age-eighty-eight", "taskCategory": "interpretation"}$op$,
  $ky$DXA remains indicated; she is a woman 65 or older, and age 80 is not a stated stop$ky$,
  $ex$The recommendation screens women 65 or older with DXA of the hip or spine. She is 88, so she is in that group. The facts do not create an age-80 stopping point. The under-65 tool pathway is for postmenopausal women younger than 65. "Stop screening after age 80 even though she is a woman older than 65" is not the best choice because Age 80 is not a threshold in this recommendation. Women 65 or older are the screening group, and she is 88. "Switch her to the under-65 risk-tool pathway because of advanced age" is not the best choice because Advanced age does not move a woman into the pathway used for postmenopausal women younger than 65. "Order DXA only if a forearm T-score is already -2.5 or lower for this patient in the office today" is not the best choice because A forearm T-score is not the screening test and is not the WHO site. DXA of the hip or spine is what is ordered. "The recommendation gives men and women the same upper age of 80" is not the best choice because The recommendation does not state a universal male screening age, and it does not set an upper age of 80 for women.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '5670603d704b5c3fde06bc8dce18468b917879c48e8577268bd4e071294b17e1', false, NOW(), NOW(), 2,
  'dxa-still-indicated-at-age-eighty-eight', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dxa-still-indicated-at-age-eighty-eight', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-194", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210195', 'usmle-step-2', 'rheumatology',
  $sc$A 52-year-old woman who works as an olive-oil taster is seen in the primary care office for a checkup 3 years after her last menstrual period. She does not smoke, does not drink alcohol, weighs 64 kg without low body weight, and has no parent with a hip fracture. A friend her age was sent straight to a hip scan. She asks whether every postmenopausal woman under 65 is scanned the same way. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Her last period was 36 months ago, and she has had no fracture.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Order DXA of the hip or spine for every postmenopausal woman under 65 at this encounter", "Order DXA now because age 52 is treated as age 65 for this patient", "A hip T-score of -2.0 is already enough to skip the risk-factor step", "Screening at 52 uses the same automatic rule as women 65 or older", "Do not send her straight to DXA; she is under 65 and has no listed risk factor"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "postmenopausal-fifty-two-no-risk-no-direct-dxa", "taskCategory": "interpretation"}$op$,
  $ky$Do not send her straight to DXA; she is under 65 and has no listed risk factor$ky$,
  $ex$Postmenopausal women younger than 65 are not all sent straight to DXA. First confirm at least one risk factor, parental hip fracture, smoking, excess alcohol, or low body weight, then use a clinical risk tool, and do DXA if that tool shows increased risk. She has none of those risk factors and is 52. "Order DXA of the hip or spine for every postmenopausal woman under 65 at this encounter" is not the best choice because The recommendation explicitly says not to send every postmenopausal woman under 65 straight to DXA. "Order DXA now because age 52 is treated as age 65 for this patient" is not the best choice because Age 65 is the threshold for screening without that pathway. Age 52 is younger than 65. "A hip T-score of -2.0 is already enough to skip the risk-factor step" is not the best choice because No T-score is available, and the WHO definition is a T-score of -2.5 or lower at the hip or lumbar spine, not -2.0. The first step here is the risk-factor check. "Screening at 52 uses the same automatic rule as women 65 or older" is not the best choice because Women 65 or older go to DXA. Postmenopausal women younger than 65 do not follow that automatic rule.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '71249cc3fe1b9940e678ca65d739d23262b840a69f6eb3e1a29f7e53e5e296b5', false, NOW(), NOW(), 3,
  'postmenopausal-fifty-two-no-risk-no-direct-dxa', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'postmenopausal-fifty-two-no-risk-no-direct-dxa', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-195", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210196', 'usmle-step-2', 'rheumatology',
  $sc$A 58-year-old woman who works as a kiln stoker is seen in the occupational clinic for a respiratory checkup and currently smokes. Her last menstrual period was 4 years ago. She smokes daily. She does not have a parent with a hip fracture, and her weight is 66 kg. No clinical risk tool has been calculated. She asks for a hip scan today because she smokes. Temperature is 36.7°C, pulse is 78/min, respirations are 16/min, and blood pressure is 124/76 mm Hg. She has smoked for 20 years, and no DXA has been done.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Smoking is a risk factor; use a clinical risk tool and do DXA only if risk is increased", "Order DXA today for every postmenopausal smoker under 65 for this patient", "Ignore smoking and use the automatic age-65 DXA rule now for this patient", "Do not count smoking, so no tool and no DXA can be considered for this patient", "A forearm film is the next test once any smoking history exists for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "postmenopausal-smoker-use-risk-tool-first", "taskCategory": "health-maintenance"}$op$,
  $ky$Smoking is a risk factor; use a clinical risk tool and do DXA only if risk is increased$ky$,
  $ex$She is postmenopausal and younger than 65, and smoking is one of the listed risk factors. After at least one risk factor is confirmed, use a clinical risk tool such as FRAX, and order DXA of the hip or spine only if that tool shows increased risk. Smoking alone does not send her straight to DXA. "Order DXA today for every postmenopausal smoker under 65 for this patient" is not the best choice because Even with a confirmed risk factor, DXA waits on a clinical risk tool that shows increased risk. Not every postmenopausal woman under 65 goes straight to DXA. "Ignore smoking and use the automatic age-65 DXA rule now for this patient" is not the best choice because The automatic DXA recommendation starts at age 65. She is 58. "Do not count smoking, so no tool and no DXA can be considered for this patient" is not the best choice because Smoking is a listed risk factor. It is confirmed, so the next step is the clinical risk tool, not a decision that no evaluation applies. "A forearm film is the next test once any smoking history exists for this patient at the present visit" is not the best choice because The imaging test, when it is indicated, is DXA of the hip or spine, not a forearm film.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'f156d4b2adb33f3e4c94ee492e015839870fe281e2430d71125a06dfd543bcd3', false, NOW(), NOW(), 3,
  'postmenopausal-smoker-use-risk-tool-first', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'postmenopausal-smoker-use-risk-tool-first', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-196", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210197', 'usmle-step-2', 'rheumatology',
  $sc$A 60-year-old woman who works as a violin-case maker is seen in the clinic whose mother broke a hip after a fall from standing. She is postmenopausal, with her last period 6 years ago. She does not smoke and does not drink alcohol. Her weight is 71 kg. The parental hip fracture is her one clear risk factor. No clinical risk tool has been run, and she requests DXA this afternoon. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. The parent's hip fracture occurred 2 years ago, and the patient herself has no fracture.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Order hip or spine DXA today solely because a parent broke a hip", "Use a clinical risk tool next; parental hip fracture alone does not order DXA", "Ignore the parent's fracture because she is not yet 65 for this patient", "Count the parent's fracture only if she has already broken a hip herself before the patient leaves", "Scan the forearm and skip both the tool and the hip for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "postmenopausal-parent-hip-fracture-tool-first", "taskCategory": "health-maintenance"}$op$,
  $ky$Use a clinical risk tool next; parental hip fracture alone does not order DXA$ky$,
  $ex$Parental hip fracture is a risk factor for a postmenopausal woman younger than 65. The sequence is to confirm at least one risk factor, then use a clinical risk tool such as FRAX, and do DXA if the tool shows increased risk. The fracture history does not skip the tool. "Order hip or spine DXA today solely because a parent broke a hip" is not the best choice because A confirmed risk factor is the first step, not the order for DXA. DXA follows only when the clinical risk tool shows increased risk. "Ignore the parent's fracture because she is not yet 65 for this patient" is not the best choice because Being younger than 65 does not erase the risk factor. It selects this pathway rather than automatic DXA. "Count the parent's fracture only if she has already broken a hip herself before the patient leaves" is not the best choice because Parental hip fracture is itself a listed risk factor. She does not need her own fracture before the clinical risk tool is used. "Scan the forearm and skip both the tool and the hip for this patient" is not the best choice because When imaging is indicated, it is DXA of the hip or spine. A forearm study is not the named screening test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c069d0ccaaed30f9cee6c478d8f6a815577cf2fcd1cc748c833a152f7d985f92', false, NOW(), NOW(), 3,
  'postmenopausal-parent-hip-fracture-tool-first', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'postmenopausal-parent-hip-fracture-tool-first', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-197", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210198', 'usmle-step-2', 'rheumatology',
  $sc$A 56-year-old woman who works as a wine-cellar steward is seen in the primary care office who reports excess alcohol use on most evenings. Her periods stopped 5 years ago. Excess alcohol is documented. She does not smoke, her weight is 73 kg, and neither parent has broken a hip. She believes the alcohol history should send her straight to a spine scan. No risk tool has been scored. Temperature is 36.8°C, pulse is 82/min, respirations are 15/min, and blood pressure is 134/82 mm Hg. She describes excess drinking for 8 years, and no DXA is on file.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Order spine DXA now for every postmenopausal woman who drinks to excess", "Excess alcohol counts only after age 65, so do nothing now", "Excess alcohol is a risk factor; use a clinical risk tool before DXA", "A T-score of -2.0 on a future scan is the only number that matters today", "Repeat a clinical exam yearly and never use a risk tool or DXA"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "postmenopausal-excess-alcohol-tool-first", "taskCategory": "health-maintenance"}$op$,
  $ky$Excess alcohol is a risk factor; use a clinical risk tool before DXA$ky$,
  $ex$Excess alcohol is one of the four risk factors for postmenopausal women younger than 65. Confirming it is followed by a clinical risk tool, with DXA of the hip or spine only if the tool shows increased risk. She is 56 and should not go straight to DXA. "Order spine DXA now for every postmenopausal woman who drinks to excess" is not the best choice because The recommendation says not to send every postmenopausal woman under 65 straight to DXA, including one whose risk factor is excess alcohol. "Excess alcohol counts only after age 65, so do nothing now" is not the best choice because The risk factor is used before age 65. It does not wait until 65, and age 65 would make DXA the screen without this step. "A T-score of -2.0 on a future scan is the only number that matters today" is not the best choice because No T-score exists yet. The WHO cutoff, when a scan is interpreted, is -2.5 or lower at the hip or lumbar spine, not -2.0, and it is not today's decision. "Repeat a clinical exam yearly and never use a risk tool or DXA" is not the best choice because A yearly exam that never uses a risk tool or DXA skips the under-65 pathway. Excess alcohol should be followed by a clinical risk tool.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '26d350acdf9d52ba891489f7d2ed85e6377583ccfb6e8ec23999408eb9f63330', false, NOW(), NOW(), 3,
  'postmenopausal-excess-alcohol-tool-first', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'postmenopausal-excess-alcohol-tool-first', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-198", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210199', 'usmle-step-2', 'rheumatology',
  $sc$A 59-year-old woman who works as a ballet-shoe fitter is seen in the clinic whose record documents low body weight. She weighs 46 kg and her clinician has already called the weight low. Her last menstrual period was 7 years ago. She does not smoke and does not drink alcohol, and no parent has broken a hip. No FRAX-style tool has been calculated. She asks to be booked for DXA today. Temperature is 36.5°C, pulse is 76/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Low body weight is documented, and she is 59 years old.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Order DXA now because low body weight skips the clinical risk tool during today's visit", "Low body weight is not a listed risk factor, so offer nothing", "Wait until age 65 even though a risk factor is already confirmed", "Low body weight is a risk factor; use a clinical risk tool before any DXA", "Measure only a wrist film because her weight is 46 kg"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "postmenopausal-low-body-weight-tool-first", "taskCategory": "health-maintenance"}$op$,
  $ky$Low body weight is a risk factor; use a clinical risk tool before any DXA$ky$,
  $ex$Low body weight is a listed risk factor for postmenopausal women younger than 65. The next step is a clinical risk tool such as FRAX, and DXA is done if that tool shows increased risk. Her weight of 46 kg supports the documented risk factor; it does not bypass the tool, and no kilogram cutoff is required beyond that clinical finding. "Order DXA now because low body weight skips the clinical risk tool during today's visit" is not the best choice because A confirmed risk factor does not skip the tool. DXA follows increased risk on the tool, not the risk factor alone. "Low body weight is not a listed risk factor, so offer nothing" is not the best choice because Low body weight is one of the four listed risk factors, along with parental hip fracture, smoking, and excess alcohol. "Wait until age 65 even though a risk factor is already confirmed" is not the best choice because She does not need to reach 65 before the under-65 pathway is used. Age 65 would be a different, direct DXA recommendation. "Measure only a wrist film because her weight is 46 kg" is not the best choice because The scan, if the tool shows increased risk, is DXA of the hip or spine, not a wrist film.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '743848c8e2268be579449701dfdb946138c21b76e6ed5d250e5e2f910bb8fb64', false, NOW(), NOW(), 3,
  'postmenopausal-low-body-weight-tool-first', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'postmenopausal-low-body-weight-tool-first', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-199", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210200', 'usmle-step-2', 'rheumatology',
  $sc$A 61-year-old woman who works as a tapestry restorer is seen in the rheumatology clinic after a clinical risk tool showed increased risk. She is postmenopausal and younger than 65. She smokes, which was the confirmed risk factor, and the tool result is increased risk. No DXA has been performed. She had wondered whether the tool itself was the final test. Her weight is 60 kg. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. The tool was completed this week and shows increased risk. She is 61.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Do no imaging; the tool replaces DXA in women younger than 65 at this encounter", "Order DXA of the forearm because the tool was abnormal", "Ignore the abnormal tool result until she turns 65", "Repeat the tool yearly and never image a woman under 65", "Order DXA of the hip or spine because the tool shows increased risk"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "risk-tool-increased-then-order-dxa", "taskCategory": "health-maintenance"}$op$,
  $ky$Order DXA of the hip or spine because the tool shows increased risk$ky$,
  $ex$For a postmenopausal woman younger than 65, DXA of the hip or spine is done when a clinical risk tool shows increased risk after at least one risk factor is confirmed. She smokes, and the tool shows increased risk, so DXA is the next step. The tool does not replace the scan. "Do no imaging; the tool replaces DXA in women younger than 65 at this encounter" is not the best choice because The tool is how increased risk is identified. DXA is still the test when that risk is increased. "Order DXA of the forearm because the tool was abnormal" is not the best choice because The named imaging sites are the hip or spine, which are also the WHO T-score sites. The forearm is not the screening site. "Ignore the abnormal tool result until she turns 65" is not the best choice because An increased-risk tool result is an indication for DXA before age 65. Waiting until 65 is the rule only when that pathway has not shown increased risk. "Repeat the tool yearly and never image a woman under 65" is not the best choice because The recommendation does not say to repeat the tool and withhold DXA after increased risk is found.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '250478b16a75a826907c023c7618ac02a41c961e7df3bda9a0d56006f68a3122', false, NOW(), NOW(), 3,
  'risk-tool-increased-then-order-dxa', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'risk-tool-increased-then-order-dxa', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 2, "code": "S2N-200", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
CREATE TABLE qbi_usmle_s2_new_20261121_b02_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    's2n202611210101',
    's2n202611210102',
    's2n202611210103',
    's2n202611210104',
    's2n202611210105',
    's2n202611210106',
    's2n202611210107',
    's2n202611210108',
    's2n202611210109',
    's2n202611210110',
    's2n202611210111',
    's2n202611210112',
    's2n202611210113',
    's2n202611210114',
    's2n202611210115',
    's2n202611210116',
    's2n202611210117',
    's2n202611210118',
    's2n202611210119',
    's2n202611210120',
    's2n202611210121',
    's2n202611210122',
    's2n202611210123',
    's2n202611210124',
    's2n202611210125',
    's2n202611210126',
    's2n202611210127',
    's2n202611210128',
    's2n202611210129',
    's2n202611210130',
    's2n202611210131',
    's2n202611210132',
    's2n202611210133',
    's2n202611210134',
    's2n202611210135',
    's2n202611210136',
    's2n202611210137',
    's2n202611210138',
    's2n202611210139',
    's2n202611210140',
    's2n202611210141',
    's2n202611210142',
    's2n202611210143',
    's2n202611210144',
    's2n202611210145',
    's2n202611210146',
    's2n202611210147',
    's2n202611210148',
    's2n202611210149',
    's2n202611210150',
    's2n202611210151',
    's2n202611210152',
    's2n202611210153',
    's2n202611210154',
    's2n202611210155',
    's2n202611210156',
    's2n202611210157',
    's2n202611210158',
    's2n202611210159',
    's2n202611210160',
    's2n202611210161',
    's2n202611210162',
    's2n202611210163',
    's2n202611210164',
    's2n202611210165',
    's2n202611210166',
    's2n202611210167',
    's2n202611210168',
    's2n202611210169',
    's2n202611210170',
    's2n202611210171',
    's2n202611210172',
    's2n202611210173',
    's2n202611210174',
    's2n202611210175',
    's2n202611210176',
    's2n202611210177',
    's2n202611210178',
    's2n202611210179',
    's2n202611210180',
    's2n202611210181',
    's2n202611210182',
    's2n202611210183',
    's2n202611210184',
    's2n202611210185',
    's2n202611210186',
    's2n202611210187',
    's2n202611210188',
    's2n202611210189',
    's2n202611210190',
    's2n202611210191',
    's2n202611210192',
    's2n202611210193',
    's2n202611210194',
    's2n202611210195',
    's2n202611210196',
    's2n202611210197',
    's2n202611210198',
    's2n202611210199',
    's2n202611210200'
);
COMMIT;

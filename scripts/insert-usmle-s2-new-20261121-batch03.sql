-- Hidden Step 2 CK batch 3 of the 2026-11-21 set.
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
  's2n202611210201', 'usmle-step-2', 'rheumatology',
  $sc$A 57-year-old woman who works as a marble-inlay artisan is seen in the clinic after a clinical risk tool did not show increased risk. She is postmenopausal, age 57, and she smokes, so a risk factor was confirmed before the tool was used. The tool does not show increased risk. She expected a hip scan anyway because she is a smoker and a friend was scanned at 66. Her weight is 69 kg. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 120/76 mm Hg. The tool result is not increased risk, and no DXA has been done.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Do not order DXA; the tool does not show increased risk", "Order DXA because any postmenopausal smoker under 65 is scanned", "Order DXA because age 57 is close enough to the age-65 rule", "Order DXA because a parent would have to be scanned in her place", "Treat a nonincreased tool result as a T-score of -2.5 or lower"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "risk-tool-not-increased-hold-dxa", "taskCategory": "interpretation"}$op$,
  $ky$Do not order DXA; the tool does not show increased risk$ky$,
  $ex$DXA in a postmenopausal woman younger than 65 is done if the clinical risk tool shows increased risk, after a risk factor such as smoking is confirmed. Her tool does not show increased risk, so this pathway does not order DXA. Age 65 would be a different rule, and she is 57. "Order DXA because any postmenopausal smoker under 65 is scanned" is not the best choice because Smoking qualifies her for the tool. It does not order DXA when the tool does not show increased risk. "Order DXA because age 57 is close enough to the age-65 rule" is not the best choice because The direct DXA recommendation is for women 65 or older. Being younger than 65 does not get rounded up. "Order DXA because a parent would have to be scanned in her place" is not the best choice because Parental hip fracture is a risk factor in the patient, not a reason to scan a parent instead, and it is not her situation. "Treat a nonincreased tool result as a T-score of -2.5 or lower" is not the best choice because A T-score of -2.5 or lower is the WHO definition on a DXA of the hip or lumbar spine. A tool result is not a T-score.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '6d67154d462fa071ff1e781a6711e52abc54af6ecb0fdc6de5d127dae0b1bbda', false, NOW(), NOW(), 5,
  'risk-tool-not-increased-hold-dxa', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'risk-tool-not-increased-hold-dxa', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-201", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210202', 'usmle-step-2', 'rheumatology',
  $sc$A 54-year-old woman who works as a stage-drape seamstress is seen in the clinic who smokes and whose father had a hip fracture. Both smoking and a parental hip fracture are documented. Her last period was 3 years ago, so she is postmenopausal and younger than 65. No clinical risk tool has been used. She argues that two risk factors should skip the tool and go straight to DXA. Her weight is 67 kg. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. She is 54, and both risk factors are already confirmed.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Two risk factors replace the tool and order DXA today", "Two risk factors still lead to a clinical risk tool, not straight to DXA", "Only one risk factor may ever be counted, so ignore the fracture during today's visit", "Age 54 with two risks is treated as the automatic age-65 pathway", "A T-score of -2.4 would be assumed from two risk factors"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "two-risk-factors-still-need-risk-tool", "taskCategory": "interpretation"}$op$,
  $ky$Two risk factors still lead to a clinical risk tool, not straight to DXA$ky$,
  $ex$The under-65 postmenopausal pathway confirms at least one risk factor, then uses a clinical risk tool, and orders DXA if the tool shows increased risk. Having two of the listed factors, smoking and parental hip fracture, still does not skip the tool. She should not go straight to DXA. "Two risk factors replace the tool and order DXA today" is not the best choice because The recommendation does not say that more than one risk factor bypasses the clinical risk tool. "Only one risk factor may ever be counted, so ignore the fracture during today's visit" is not the best choice because Both factors count as risk factors. The instruction is at least one, then the tool. The fracture is not ignored. "Age 54 with two risks is treated as the automatic age-65 pathway" is not the best choice because Automatic DXA begins for women at age 65. Two risk factors do not change 54 into that rule. "A T-score of -2.4 would be assumed from two risk factors" is not the best choice because A T-score is measured on DXA. The WHO threshold is -2.5 or lower at the hip or lumbar spine, and it is not assumed from risk factors. -2.4 would not meet it anyway.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '1762550358eb412fe9b87fc31a80b1a4ba2a7311db3f828fd42d19e465224d1f', false, NOW(), NOW(), 4,
  'two-risk-factors-still-need-risk-tool', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'two-risk-factors-still-need-risk-tool', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-202", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210203', 'usmle-step-2', 'rheumatology',
  $sc$A 64-year-old woman who works as an organ-pipe polisher is seen in the clinic 11 months before her sixty-fifth birthday. She is postmenopausal. She does not smoke, does not drink to excess, has no parental hip fracture, and her weight of 72 kg is not low. A scheduler wants to book DXA because she is close to 65. No risk tool has been needed, because no risk factor is present. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. She is 64 years old today, and no DXA has been performed.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Order DXA now because 64 is within a year of the age-65 rule", "Treat every postmenopausal 64-year-old as already 65", "Age 64 is still younger than 65, so closeness alone does not order DXA", "A forearm DXA at 64 satisfies the hip-or-spine recommendation", "Start screening at 19, using the adult mood-screen age, with DXA at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "age-sixty-four-not-yet-automatic-dxa", "taskCategory": "interpretation"}$op$,
  $ky$Age 64 is still younger than 65, so closeness alone does not order DXA$ky$,
  $ex$DXA screening without the risk-factor pathway is for women 65 or older. She is 64, postmenopausal, and has none of the listed risk factors, so she is not sent straight to DXA. The recommendation does not pull the age-65 rule forward by 11 months. "Order DXA now because 64 is within a year of the age-65 rule" is not the best choice because The threshold is 65, not 64 and not within a year of 65. "Treat every postmenopausal 64-year-old as already 65" is not the best choice because Postmenopausal women younger than 65 are not automatically scanned. Without a risk factor, this pathway does not go straight to DXA. "A forearm DXA at 64 satisfies the hip-or-spine recommendation" is not the best choice because The screening test is DXA of the hip or spine, not the forearm. "Start screening at 19, using the adult mood-screen age, with DXA at the present visit" is not the best choice because Age 19 is the start of adult depression screening, not a bone-density age. This recommendation does not use 19.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '8c933d348be14a942cb1d219c09caf745acfd74c606bf11846cc145441e4d08c', false, NOW(), NOW(), 3,
  'age-sixty-four-not-yet-automatic-dxa', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'age-sixty-four-not-yet-automatic-dxa', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-203", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210204', 'usmle-step-2', 'rheumatology',
  $sc$A 70-year-old woman who works as a greenhouse glazier is seen in the primary care office after a clinical risk tool was called reassuring. She is 70 and has never had DXA of the hip or spine. The reassuring tool result is in the chart. She does not smoke. A clinician says the tool is enough and imaging can be skipped. Her weight is 65 kg. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 136/78 mm Hg. No hip or spine density result exists. The tool was run last month.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Accept the reassuring tool and do no DXA after age 65", "Use the tool result as if it were a T-score of -2.5 or lower", "Move her into the under-65 pathway because a tool was already run in the office today", "Order DXA of the hip or spine; a risk tool does not replace it at age 70", "Scan only if she also smokes or has low body weight"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "dxa-not-replaced-by-risk-tool-after-65", "taskCategory": "interpretation"}$op$,
  $ky$Order DXA of the hip or spine; a risk tool does not replace it at age 70$ky$,
  $ex$Women 65 or older are screened with DXA of the hip or spine. A clinical risk tool is part of the pathway for postmenopausal women younger than 65. At age 70 it does not replace DXA, whether or not the tool looks reassuring. "Accept the reassuring tool and do no DXA after age 65" is not the best choice because The screening test at her age is DXA, not a decision to stop at the tool. "Use the tool result as if it were a T-score of -2.5 or lower" is not the best choice because The tool does not generate the WHO T-score. A T-score of -2.5 or lower is read from DXA of the hip or lumbar spine. "Move her into the under-65 pathway because a tool was already run in the office today" is not the best choice because Running a tool does not reclassify a 70-year-old as younger than 65. "Scan only if she also smokes or has low body weight" is not the best choice because Smoking and low body weight are not required before DXA in women 65 or older.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '747fe98fd62bdfdd5cb16aac8bd0d7a77b5c37eff419fb67b035cc099eed64f0', false, NOW(), NOW(), 3,
  'dxa-not-replaced-by-risk-tool-after-65', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'dxa-not-replaced-by-risk-tool-after-65', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-204", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210205', 'usmle-step-2', 'rheumatology',
  $sc$A 46-year-old woman who works as a river-gauge reader is seen in the clinic for a physical, with regular monthly periods. Her last menstrual period was 2 weeks ago, and cycles have been regular. She does not smoke. A protocol drafted for postmenopausal women under 65 was applied to her by mistake, and DXA was ordered with no risk-tool step. She asks whether this recommendation puts her in that postmenopausal pathway. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. She is 46 and still menstruating. No density test has been resulted.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Order DXA now because every woman younger than 65 is scanned", "Use the age-65 rule early because her cycles are regular for this patient during today's visit", "Confirm a risk factor and run FRAX as if she were postmenopausal", "A T-score of -2.5 is assumed before menopause and needs no scan", "This under-65 pathway is for postmenopausal women, so it does not place her in it"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "premenopausal-not-in-younger-pathway", "taskCategory": "interpretation"}$op$,
  $ky$This under-65 pathway is for postmenopausal women, so it does not place her in it$ky$,
  $ex$The pathway that confirms a risk factor, uses a clinical risk tool, and then considers DXA is for postmenopausal women younger than 65. She is 46 and still menstruating, so that pathway does not apply. Women 65 or older are a separate group. The recommendation does not say to scan every woman under 65. "Order DXA now because every woman younger than 65 is scanned" is not the best choice because Not every woman younger than 65 is sent to DXA. The under-65 statement is about postmenopausal women, and even they are not all scanned. "Use the age-65 rule early because her cycles are regular for this patient during today's visit" is not the best choice because Regular cycles do not trigger the age-65 rule. That rule is for women 65 or older. "Confirm a risk factor and run FRAX as if she were postmenopausal" is not the best choice because FRAX in this recommendation follows a confirmed risk factor in postmenopausal women younger than 65. She is not in that group. "A T-score of -2.5 is assumed before menopause and needs no scan" is not the best choice because A T-score of -2.5 or lower is a DXA result at the hip or lumbar spine, not a value assumed before menopause.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '852f3b1695377027e041fcafb97e0f9f8246efd755f77d874ca66a1dbacb4d9f', false, NOW(), NOW(), 4,
  'premenopausal-not-in-younger-pathway', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'premenopausal-not-in-younger-pathway', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-205", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210206', 'usmle-step-2', 'rheumatology',
  $sc$A 70-year-old man who works as a dry-dock rigger is seen in the primary care office to ask at what age men get the same density scan as women. He has never had DXA. He does not smoke, his weight is 82 kg, and neither parent broke a hip. He read that women are scanned at 65 and wants the male age from this recommendation. No fracture has occurred. Temperature is 36.7°C, pulse is 68/min, respirations are 14/min, and blood pressure is 134/80 mm Hg. He is 70, and the chart has no hip or spine density result.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["This recommendation does not state a universal screening age for men", "Screen him with DXA because the age of 65 applies to men", "Screen him with DXA because the universal male age is 70", "Use the postmenopausal under-65 tool pathway because he is male", "A hip T-score of -2.0 is the male definition in this recommendation at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "man-age-seventy-no-screening-age", "taskCategory": "interpretation"}$op$,
  $ky$This recommendation does not state a universal screening age for men$ky$,
  $ex$The recommendation as stated is about women: DXA for women 65 or older, and a risk-factor plus clinical-risk-tool pathway for postmenopausal women younger than 65. It does not state a universal screening age for men. Applying 65 or inventing 70 would go beyond it. The WHO T-score of -2.5 or lower is a definition at the hip or lumbar spine, not a male screening age. "Screen him with DXA because the age of 65 applies to men" is not the best choice because Age 65 is the screening threshold given for women, not a universal male age. "Screen him with DXA because the universal male age is 70" is not the best choice because No universal male age, including 70, is stated. "Use the postmenopausal under-65 tool pathway because he is male" is not the best choice because The under-65 pathway is for postmenopausal women, not for men. "A hip T-score of -2.0 is the male definition in this recommendation at the present visit" is not the best choice because The WHO definition on the page is a T-score of -2.5 or lower at the hip or lumbar spine. It is not a male cutoff of -2.0 and it is not a screening age.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'c9bae0f0d6871a35292f941df30c5ebfefbd3b1e3b6b579ca8ba3e24d7f7d5fc', false, NOW(), NOW(), 5,
  'man-age-seventy-no-screening-age', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'man-age-seventy-no-screening-age', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-206", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210207', 'usmle-step-2', 'rheumatology',
  $sc$A 66-year-old man who works as a bell foundry carpenter is seen in the clinic after a clinician ordered DXA solely because women are scanned at 65. The order cites this recommendation and his age of 66. He has no fracture history. He asks whether using the women's age rule for him is what the recommendation says. His weight is 79 kg. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. The DXA order has not yet been performed. He is a man.$sc$,
  $qu$Which of the following is the most appropriate professional action?$qu$,
  $op${"options": ["Keep the order because every adult 65 or older is included for this patient at this encounter", "Do not apply the women's age-65 DXA rule to him; no male screening age is stated", "Change the age on the order to 70 and call that the male standard", "Run the postmenopausal FRAX pathway and scan if it is increased", "Replace DXA with a forearm film because he is male for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "do-not-apply-female-age-rule-to-man", "taskCategory": "professionalism"}$op$,
  $ky$Do not apply the women's age-65 DXA rule to him; no male screening age is stated$ky$,
  $ex$Professionally, the women's threshold should not be copied onto a man. This recommendation screens women 65 or older and describes a separate pathway for postmenopausal women younger than 65. It does not state a universal male screening age. "Keep the order because every adult 65 or older is included for this patient at this encounter" is not the best choice because Adults 65 or older are not the population named for this scan. The age-65 rule here is for women. "Change the age on the order to 70 and call that the male standard" is not the best choice because Substituting age 70 invents a male screening age that the recommendation does not give. "Run the postmenopausal FRAX pathway and scan if it is increased" is not the best choice because The clinical risk tool pathway is for postmenopausal women younger than 65, not for a 66-year-old man. "Replace DXA with a forearm film because he is male for this patient" is not the best choice because The named test, when the recommendation applies, is DXA of the hip or spine. Sex does not convert it to a forearm film.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "professionalism"]$tg$,
  's2-new-20261121-hidden', '3fdfcdd773ba68370ba355e4f6d23b97e920db59be7874c462a980b2fdaacb45', false, NOW(), NOW(), 4,
  'do-not-apply-female-age-rule-to-man', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'professionalism', 'do-not-apply-female-age-rule-to-man', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-207", "hidden": true, "physicianTask": "professionalism", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210208', 'usmle-step-2', 'rheumatology',
  $sc$A 71-year-old woman who works as a linen-press operator is seen in the rheumatology clinic to review a DXA done last week. The lumbar-spine T-score is -3.0 and the hip T-score is -1.4. She is 71 and was scanned because she is a woman 65 or older. She has had no fracture. She asks whether the spine number meets the definition on the page. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood pressure is 136/78 mm Hg. The report lists lumbar spine -3.0 and hip -1.4.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Only the hip T-score counts, so -1.4 means the definition is not met at this encounter", "A spine T-score must be -3.5 or lower before the definition is met", "The lumbar-spine T-score of -3.0 meets the definition of -2.5 or lower", "The definition uses -2.0, so both of these sites qualify", "A forearm T-score is required to confirm the spine result"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "spine-t-score-minus-three-meets", "taskCategory": "diagnosis"}$op$,
  $ky$The lumbar-spine T-score of -3.0 meets the definition of -2.5 or lower$ky$,
  $ex$The WHO definition stated on the page is a T-score of -2.5 or lower at the hip or lumbar spine. Her lumbar-spine T-score is -3.0, which meets that definition. Either site is sufficient. "Only the hip T-score counts, so -1.4 means the definition is not met at this encounter" is not the best choice because The definition is hip or lumbar spine. A hip T-score of -1.4 does not erase a spine T-score of -3.0. "A spine T-score must be -3.5 or lower before the definition is met" is not the best choice because No threshold of -3.5 is stated. The cutoff is -2.5 or lower. "The definition uses -2.0, so both of these sites qualify" is not the best choice because The cutoff is -2.5 or lower, not -2.0. The hip value of -1.4 would not meet -2.0 either, but the spine value meets -2.5. "A forearm T-score is required to confirm the spine result" is not the best choice because The definition does not require a forearm T-score. The sites are the hip or lumbar spine.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'a5acc4287ba84def56449613f0c4619b7022d7484f744a82eede8c66125c20c6', false, NOW(), NOW(), 1,
  'spine-t-score-minus-three-meets', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'spine-t-score-minus-three-meets', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-208", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210209', 'usmle-step-2', 'rheumatology',
  $sc$A 73-year-old woman who works as a marble-stair mason is seen in the clinic with a DXA report from this morning. The total-hip T-score is -2.5 and the lumbar-spine T-score is -1.8. She wants to know whether a value sitting exactly on the line counts. She is 73. No forearm score was reported. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 140/76 mm Hg. Hip T-score -2.5 and lumbar spine T-score -1.8 are the only numbers on the report.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The definition requires a T-score lower than -2.5, so -2.5 does not count", "The spine T-score of -1.8 cancels the qualifying hip result", "Only a T-score of -3.0 or lower meets the definition", "A hip T-score of -2.5 meets the definition of -2.5 or lower", "The hip result counts only when the patient is younger than 65"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "hip-t-score-exactly-minus-two-point-five", "taskCategory": "diagnosis"}$op$,
  $ky$A hip T-score of -2.5 meets the definition of -2.5 or lower$ky$,
  $ex$The WHO definition is a T-score of -2.5 or lower at the hip or lumbar spine. A hip T-score of exactly -2.5 meets 'or lower.' The spine T-score of -1.8 does not have to meet it as well. "The definition requires a T-score lower than -2.5, so -2.5 does not count" is not the best choice because The phrase is -2.5 or lower, so the value -2.5 is included. "The spine T-score of -1.8 cancels the qualifying hip result" is not the best choice because One qualifying site is enough. The spine result does not cancel a hip T-score of -2.5. "Only a T-score of -3.0 or lower meets the definition" is not the best choice because The cutoff is not -3.0. A spine T-score of -3.0 would also meet -2.5 or lower, but it is not required. "The hip result counts only when the patient is younger than 65" is not the best choice because The definition is about the T-score at the hip or lumbar spine. It is not restricted to women younger than 65. She is 73, and women 65 or older are the group screened with this test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '3c0bea2135496dd2ed821ff5949dcfcb0c440375ea193bf3623f2a2f061719be', false, NOW(), NOW(), 2,
  'hip-t-score-exactly-minus-two-point-five', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'hip-t-score-exactly-minus-two-point-five', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-209", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210210', 'usmle-step-2', 'rheumatology',
  $sc$A 68-year-old woman who works as a leadlight artist is seen in the clinic reviewing a DXA printed today. The hip T-score is -2.4 and the lumbar-spine T-score is -2.1. She believes she has crossed the line because both numbers are worse than -2.0. She is 68 and had the scan as screening. No other site was measured. Temperature is 36.5°C, pulse is 74/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. The report shows hip -2.4 and lumbar spine -2.1.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A hip T-score of -2.4 meets a stated cutoff of -2.0", "The definition is -2.4 or lower, so the hip result qualifies during today's visit", "Averaging -2.4 and -2.1 produces a qualifying score", "Any T-score below zero at age 68 meets the definition", "Neither site is -2.5 or lower, so the stated definition is not met"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "hip-t-score-minus-two-point-four-short", "taskCategory": "interpretation"}$op$,
  $ky$Neither site is -2.5 or lower, so the stated definition is not met$ky$,
  $ex$The WHO definition is a T-score of -2.5 or lower at the hip or lumbar spine. A hip T-score of -2.4 and a spine T-score of -2.1 are both above that line, so neither site meets it. The cutoff is not -2.0 and not -2.4. "A hip T-score of -2.4 meets a stated cutoff of -2.0" is not the best choice because A cutoff of -2.0 is not the definition. The hip value -2.4 does not meet -2.5 or lower. "The definition is -2.4 or lower, so the hip result qualifies during today's visit" is not the best choice because The threshold is not -2.4. It is -2.5 or lower. "Averaging -2.4 and -2.1 produces a qualifying score" is not the best choice because The definition is not an average of the two sites. Each cited site is compared with -2.5. "Any T-score below zero at age 68 meets the definition" is not the best choice because A T-score below zero is not the definition. Many results below zero do not reach -2.5.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '472509ce11634b997a1d5ca03d4c3ae18056c09cddcdd2bede272dac77502201', false, NOW(), NOW(), 3,
  'hip-t-score-minus-two-point-four-short', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'hip-t-score-minus-two-point-four-short', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-210", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210211', 'usmle-step-2', 'rheumatology',
  $sc$A 72-year-old woman who works as a watch-case engraver is seen in the clinic with DXA numbers from three sites. The forearm T-score is -3.4. The hip T-score is -1.2 and the lumbar-spine T-score is -1.4. She thinks the forearm number alone meets the definition because it is well below -2.5. She is 72. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 134/76 mm Hg. Forearm -3.4, hip -1.2, and lumbar spine -1.4 are listed on one page.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The hip and spine results do not meet -2.5 or lower; the forearm is not the stated site", "The forearm T-score of -3.4 meets the definition by itself for this patient", "A hip T-score of -1.2 meets the definition because she is over 65 for this patient before the patient leaves", "Average all three sites and treat the mean as the WHO value for this patient", "The definition is a T-score of -3.4 or lower at any bone for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "forearm-t-score-not-hip-or-spine", "taskCategory": "interpretation"}$op$,
  $ky$The hip and spine results do not meet -2.5 or lower; the forearm is not the stated site$ky$,
  $ex$The WHO definition on the page is a T-score of -2.5 or lower at the hip or lumbar spine. Her hip T-score is -1.2 and her lumbar-spine T-score is -1.4, so those sites do not meet it. The forearm T-score of -3.4 is not one of the stated sites. "The forearm T-score of -3.4 meets the definition by itself for this patient" is not the best choice because A forearm result, even at -3.4, is not the hip or lumbar spine. The definition does not use the forearm. "A hip T-score of -1.2 meets the definition because she is over 65 for this patient before the patient leaves" is not the best choice because Age 65 or older is why screening DXA is offered. It does not change a hip T-score of -1.2 into a value of -2.5 or lower. "Average all three sites and treat the mean as the WHO value for this patient" is not the best choice because The definition is not an average across forearm, hip, and spine. "The definition is a T-score of -3.4 or lower at any bone for this patient" is not the best choice because The cutoff is -2.5 or lower, not -3.4, and the sites are specified. Any bone is not the wording.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'd871a68863faa0738d79202f098c3ed40ca765bc0025e2f5d220ce73d5e895ac', false, NOW(), NOW(), 5,
  'forearm-t-score-not-hip-or-spine', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'forearm-t-score-not-hip-or-spine', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-211", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210212', 'usmle-step-2', 'rheumatology',
  $sc$A 75-year-old woman who works as a nave-floor tiler is seen in the clinic with discordant hip and spine DXA results. The hip T-score is -2.8 and the lumbar-spine T-score is -1.6. She thinks both sites must be -2.5 or lower. She is 75 and had screening DXA of the hip and spine. No forearm value is on the page. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 140/74 mm Hg. Hip -2.8 and lumbar spine -1.6 are the reported T-scores.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Both the hip and the lumbar spine must be -2.5 or lower", "The hip T-score of -2.8 meets -2.5 or lower even though the spine does not", "The spine value of -1.6 is the only one that counts for this patient during today's visit", "A hip T-score of -2.8 is too low to count and must be exactly -2.5", "Discordant sites are interpreted with a forearm scan instead"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "hip-meets-threshold-spine-does-not", "taskCategory": "interpretation"}$op$,
  $ky$The hip T-score of -2.8 meets -2.5 or lower even though the spine does not$ky$,
  $ex$The definition is a T-score of -2.5 or lower at the hip or lumbar spine. The word is or. A hip T-score of -2.8 meets it. The lumbar-spine T-score of -1.6 does not, and it does not have to. "Both the hip and the lumbar spine must be -2.5 or lower" is not the best choice because Both sites are not required. One site at -2.5 or lower is enough. "The spine value of -1.6 is the only one that counts for this patient during today's visit" is not the best choice because The spine is not the only site. The hip result qualifies on its own. "A hip T-score of -2.8 is too low to count and must be exactly -2.5" is not the best choice because Values lower than -2.5 still meet 'or lower.' The score does not have to be exactly -2.5. "Discordant sites are interpreted with a forearm scan instead" is not the best choice because A forearm scan is not required when the hip and spine are already reported. The definition uses those sites.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '62d72c3383a794ef37f79906acf51255e6eef43ac9455250fece6edf0059eb99', false, NOW(), NOW(), 2,
  'hip-meets-threshold-spine-does-not', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'hip-meets-threshold-spine-does-not', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-212", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210213', 'usmle-step-2', 'rheumatology',
  $sc$A 77-year-old woman who works as an apse-mosaic setter is seen in the clinic with a spine result worse than the hip result. The lumbar-spine T-score is -2.7 and the hip T-score is -1.1. She was told the hip is the only site that can meet the definition. She is 77. The scan was DXA. Temperature is 36.4°C, pulse is 66/min, respirations are 16/min, and blood pressure is 144/72 mm Hg. Lumbar spine -2.7 and hip -1.1 are printed on the report.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A normal hip T-score of -1.1 cancels a spine T-score of -2.7", "Only the hip is in the definition, so the spine is ignored", "The lumbar-spine T-score of -2.7 meets the definition; the hip does not have to", "The lumbar spine must reach -3.0 before it counts for this patient", "Neither number counts unless she is younger than 65 for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "spine-meets-threshold-hip-does-not", "taskCategory": "interpretation"}$op$,
  $ky$The lumbar-spine T-score of -2.7 meets the definition; the hip does not have to$ky$,
  $ex$The WHO definition is a T-score of -2.5 or lower at the hip or lumbar spine. Her lumbar-spine T-score of -2.7 meets it. The hip T-score of -1.1 does not undo that result. "A normal hip T-score of -1.1 cancels a spine T-score of -2.7" is not the best choice because A hip result that does not meet the cutoff does not cancel a spine result that does. "Only the hip is in the definition, so the spine is ignored" is not the best choice because The lumbar spine is named alongside the hip. It is not ignored. "The lumbar spine must reach -3.0 before it counts for this patient" is not the best choice because The cutoff is -2.5 or lower, not -3.0. A spine T-score of -2.7 qualifies. "Neither number counts unless she is younger than 65 for this patient at the present visit" is not the best choice because She is 77, which is within women 65 or older for screening, but the definition itself is the T-score rule and is not limited to women younger than 65.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '353746fa962b65a9342183d47bd04c20c7bec122cea036d2a9ace0657b3418f7', false, NOW(), NOW(), 2,
  'spine-meets-threshold-hip-does-not', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'spine-meets-threshold-hip-does-not', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-213", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210214', 'usmle-step-2', 'rheumatology',
  $sc$A 67-year-old woman who works as a herbarium mounter is seen in the primary care office for a wellness visit and feels well. She has never broken a bone, does not smoke, and has no parent with a hip fracture. Her weight is 66 kg. She asks why a hip or spine density test would be offered when she has no risk factors and no pain. No DXA has been done. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 130/76 mm Hg. She is 67 and has had no fracture.$sc$,
  $qu$Which of the following is the most appropriate response?$qu$,
  $op${"options": ["Tell her the scan is only for women who already have a fracture", "Tell her screening starts at 70, so 67 is too soon for this patient", "Tell her a reassuring talk replaces the scan after age 65 for this patient", "Explain that hip or spine DXA is recommended at 65 or older without risk factors", "Tell her the test is a forearm film because she feels well for this patient at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "explain-dxa-offer-at-age-sixty-seven", "taskCategory": "communication"}$op$,
  $ky$Explain that hip or spine DXA is recommended at 65 or older without risk factors$ky$,
  $ex$Women 65 or older are screened with DXA of the hip or spine, Grade B, and risk factors are not required. She is 67 and feels well. That is the explanation. The risk-factor list is for postmenopausal women younger than 65. "Tell her the scan is only for women who already have a fracture" is not the best choice because A prior fracture is not the entry rule for screening women 65 or older. "Tell her screening starts at 70, so 67 is too soon for this patient" is not the best choice because No start age of 70 is stated. The age is 65 or older. "Tell her a reassuring talk replaces the scan after age 65 for this patient" is not the best choice because Conversation does not replace DXA in this age group. "Tell her the test is a forearm film because she feels well for this patient at the present visit" is not the best choice because The named test is DXA of the hip or spine, not a forearm film, and feeling well does not change the site.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "communication"]$tg$,
  's2-new-20261121-hidden', '079deb43a3f766fb561148240fbc7d82eccd1d8376d2a4bcaffedf26b7c7095b', false, NOW(), NOW(), 2,
  'explain-dxa-offer-at-age-sixty-seven', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'communication', 'explain-dxa-offer-at-age-sixty-seven', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-214", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210215', 'usmle-step-2', 'rheumatology',
  $sc$A 71-year-old woman who works as a psalm-book binder is seen in the clinic after a clinician declined DXA because she looks well. She is 71, has no pain, does not smoke, and has no parental hip fracture. Her weight is 63 kg. The note says imaging is unnecessary in a comfortable patient over 65. She has never had DXA. She asks for the recommendation to be followed. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 136/74 mm Hg. No hip or spine DXA has ever been recorded.$sc$,
  $qu$Which of the following is the most appropriate professional action?$qu$,
  $op${"options": ["Support the refusal because risk factors are absent for this patient", "Offer a clinical risk tool instead and skip imaging for this patient", "Wait until she turns 80 and only then reconsider DXA for this patient before the patient leaves", "Order a forearm study because she has no pain today for this patient", "Offer DXA of the hip or spine; feeling well does not remove screening at age 71"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "do-not-withhold-dxa-from-well-woman", "taskCategory": "professionalism"}$op$,
  $ky$Offer DXA of the hip or spine; feeling well does not remove screening at age 71$ky$,
  $ex$The professional action is to offer the Grade B screen: DXA of the hip or spine for a woman 65 or older. Feeling well and lacking risk factors does not remove it. Those factors matter in the pathway for postmenopausal women younger than 65. "Support the refusal because risk factors are absent for this patient" is not the best choice because Absent risk factors do not justify withholding DXA from a woman of 71. "Offer a clinical risk tool instead and skip imaging for this patient" is not the best choice because The clinical risk tool is not a substitute for DXA after age 65. "Wait until she turns 80 and only then reconsider DXA for this patient before the patient leaves" is not the best choice because Age 80 is not a threshold in the recommendation. She already qualifies at 71. "Order a forearm study because she has no pain today for this patient" is not the best choice because Lack of pain does not change the test to a forearm study. The test is DXA of the hip or spine.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "professionalism"]$tg$,
  's2-new-20261121-hidden', 'b676b52ac471b3d958b005db964173ea1c97022de026fa514817b24ac18fa47c', false, NOW(), NOW(), 3,
  'do-not-withhold-dxa-from-well-woman', 'msk-skin', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Osteoporosis to Prevent Fractures.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening"}]$rf$::jsonb,
  'step2', false,
  'professionalism', 'do-not-withhold-dxa-from-well-woman', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-215", "hidden": true, "physicianTask": "professionalism", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/osteoporosis-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210216', 'usmle-step-2', 'rheumatology',
  $sc$A 29-year-old man who works as a trawler deckhand is seen in the emergency department because the left knee has been hot and swollen for 2 days. The knee is held in slight flexion and arthrocentesis is planned. He also has tenosynovitis at the right wrist. He had a urethral discharge last week. Weight is 78 kg. He is alert, the neck is supple, and there is no heart murmur. No antibiotic has been given. Temperature is 38.3°C, pulse is 102/min, respirations are 18/min, and blood pressure is 124/74 mm Hg. Symptoms have lasted 48 hours, and he can take an intramuscular or intravenous injection.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Hospitalize and give ceftriaxone 1 g IM or IV every 24 hours", "Ceftriaxone 500 mg intramuscularly once, then discharge", "Ceftriaxone 1 g intramuscularly once because the knee is the only joint", "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks", "Benzathine penicillin G 2.4 million units intramuscularly once"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-arthritis-hospital-ceftriaxone-daily", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Hospitalize and give ceftriaxone 1 g IM or IV every 24 hours$ky$,
  $ex$Arthritis from this disseminated infection is treated in the hospital with ceftriaxone 1 g IM or IV every 24 hours. His weight of 78 kg is under 150 kg, but the single 500 mg dose is for uncomplicated infection, not septic arthritis. There is no murmur to suggest endocarditis. "Ceftriaxone 500 mg intramuscularly once, then discharge" is not the best choice because Ceftriaxone 500 mg IM once is for uncomplicated cervical, urethral, or rectal infection when weight is under 150 kg. It is not the arthritis regimen. "Ceftriaxone 1 g intramuscularly once because the knee is the only joint" is not the best choice because A single 1 g dose is the uncomplicated dose when weight is 150 kg or more. Arthritis still uses 1 g every 24 hours, not one injection. "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks" is not the best choice because Ceftriaxone 1-2 g IV every 12-24 hours is the meningitis and endocarditis dose, and endocarditis is treated parenterally for more than 4 weeks. He has no murmur and a supple neck. "Benzathine penicillin G 2.4 million units intramuscularly once" is not the best choice because Benzathine penicillin G 2.4 million units once is not this joint regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '62bce11831a378acf76c701773cb51e2b4be1183578e59158001e757600a164f', false, NOW(), NOW(), 2,
  'gc-arthritis-hospital-ceftriaxone-daily', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-arthritis-hospital-ceftriaxone-daily', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-216", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210217', 'usmle-step-2', 'rheumatology',
  $sc$A 23-year-old man who works as a bike-messenger is seen in the sexual health clinic because of burning urethral discharge for 3 days. He has no joint pain, no rash, and no swollen tendon. Weight is 92 kg. He is otherwise well. A clinician who recently treated a septic knee wants to hospitalize him for daily injections. The neck is supple and there is no murmur. Temperature is 36.8°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Discharge has lasted 3 days, and weight is 92 kg, which is under 150 kg.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Hospitalize for ceftriaxone 1 g every 24 hours for at least 7 days", "Ceftriaxone 500 mg intramuscularly once for this uncomplicated urethral infection", "Ceftriaxone 1 g intramuscularly once because all men need the higher dose during today's visit", "Ceftriaxone 1-2 g IV every 12 hours for 10-14 days for this patient", "Three weekly benzathine penicillin injections totaling 7.2 million units"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-urethritis-under-150-single-500", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 500 mg intramuscularly once for this uncomplicated urethral infection$ky$,
  $ex$Uncomplicated urethral infection is ceftriaxone 500 mg IM once when weight is under 150 kg. He weighs 92 kg and has no arthritis. The daily 1 g hospital regimen is for disseminated infection with arthritis, not for this discharge. "Hospitalize for ceftriaxone 1 g every 24 hours for at least 7 days" is not the best choice because Hospital ceftriaxone 1 g every 24 hours is the arthritis regimen. He has no joint findings, and the total-duration language of at least 7 days belongs to that disseminated course. "Ceftriaxone 1 g intramuscularly once because all men need the higher dose during today's visit" is not the best choice because The 1 g single dose is for uncomplicated infection when weight is 150 kg or more. He weighs 92 kg. "Ceftriaxone 1-2 g IV every 12 hours for 10-14 days for this patient" is not the best choice because Ceftriaxone 1-2 g IV every 12-24 hours for 10-14 days is the meningitis duration and dose, not uncomplicated urethritis. "Three weekly benzathine penicillin injections totaling 7.2 million units" is not the best choice because The 7.2 million unit benzathine schedule is not treatment of urethral discharge.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'fc41264bdf83f89f3585d5d97014b7810ea4b87389e4353cf6e6a0b6735bde34', false, NOW(), NOW(), 2,
  'gc-urethritis-under-150-single-500', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-urethritis-under-150-single-500', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-217", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210218', 'usmle-step-2', 'rheumatology',
  $sc$A 32-year-old woman who works as a net mender is seen in the emergency department with a swollen ankle and wrist tenosynovitis. She will be hospitalized for ceftriaxone. A test for chlamydia has not come back, so chlamydia has not been excluded. She has no murmur and is alert. Weight is 61 kg. The ankle and wrist findings are the reason for admission. Temperature is 38.1°C, pulse is 98/min, respirations are 18/min, and blood pressure is 116/70 mm Hg. The chlamydia result is still pending on hospital day 1.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Do not add doxycycline unless chlamydia has already been confirmed", "Add doxycycline 100 mg once, and do not repeat it", "Add doxycycline 100 mg orally twice daily for 7 days", "Replace ceftriaxone entirely with doxycycline alone", "Add doxycycline only when weight is 150 kg or more"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-add-doxycycline-when-chlamydia-open", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Add doxycycline 100 mg orally twice daily for 7 days$ky$,
  $ex$When arthritis is treated with ceftriaxone 1 g every 24 hours, add doxycycline 100 mg orally twice daily for 7 days if chlamydia has not been excluded. Her test is pending, so the add-on applies. Weight is 61 kg and does not change that rule. "Do not add doxycycline unless chlamydia has already been confirmed" is not the best choice because The instruction is to add doxycycline if chlamydia has not been excluded. Waiting for a positive result is the opposite of that condition. "Add doxycycline 100 mg once, and do not repeat it" is not the best choice because The schedule is 100 mg orally twice daily for 7 days, not a single 100 mg dose. "Replace ceftriaxone entirely with doxycycline alone" is not the best choice because Doxycycline is added to ceftriaxone. It does not replace the 1 g every 24 hours. "Add doxycycline only when weight is 150 kg or more" is not the best choice because The 150 kg threshold changes the single dose for uncomplicated infection. It does not decide the doxycycline add-on.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '1fb82503036ee9df62b6ff96bcacf3bb28daf58f471cab0475eefe360a17a9b0', false, NOW(), NOW(), 2,
  'gc-add-doxycycline-when-chlamydia-open', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-add-doxycycline-when-chlamydia-open', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-218", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210219', 'usmle-step-2', 'rheumatology',
  $sc$A 27-year-old man who works as an oyster shucker is seen in the hospital ward on day 3 of ceftriaxone for a septic knee. The knee is much less swollen and the fever has resolved. Susceptibility results are available to guide an oral agent. He has no murmur and the neck is supple. Weight is 74 kg. A colleague wants either to stop today or to commit him to more than 4 weeks of intravenous therapy. Temperature is 36.8°C, pulse is 80/min, respirations are 16/min, and blood pressure is 122/74 mm Hg. Clear improvement is documented on hospital day 3, and an oral option can be chosen from the susceptibility report.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Stop all antibiotics today because the fever has resolved for this patient during today's visit", "Continue parenteral therapy for more than 4 weeks for this patient", "Give ceftriaxone 500 mg once and discharge without further doses", "Switch to an oral agent guided by susceptibility, for a total of at least 7 days", "Ignore susceptibility and pick any oral agent for 3 days for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-stepdown-oral-after-improvement", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Switch to an oral agent guided by susceptibility, for a total of at least 7 days$ky$,
  $ex$After clear improvement of disseminated arthritis, switch to an oral agent guided by susceptibility, for a total of at least 7 days. Day 3 is too soon to stop. More than 4 weeks of parenteral therapy is the endocarditis duration, and he has no murmur. "Stop all antibiotics today because the fever has resolved for this patient during today's visit" is not the best choice because Resolution of fever on day 3 does not end treatment. The total course is at least 7 days. "Continue parenteral therapy for more than 4 weeks for this patient" is not the best choice because Parenteral therapy for more than 4 weeks is for endocarditis, which he does not have. "Give ceftriaxone 500 mg once and discharge without further doses" is not the best choice because Ceftriaxone 500 mg IM once is the uncomplicated dose when weight is under 150 kg. It does not finish a joint infection. "Ignore susceptibility and pick any oral agent for 3 days for this patient" is not the best choice because The oral agent is guided by susceptibility, and the total duration is at least 7 days, not 3 days chosen without that guidance.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'c9fc92492da844412fd5076002acc96ad7c22448c6d2e0b98a8914dfbe638e6e', false, NOW(), NOW(), 2,
  'gc-stepdown-oral-after-improvement', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-stepdown-oral-after-improvement', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-219", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210220', 'usmle-step-2', 'rheumatology',
  $sc$A 25-year-old man who works as a dock welder is seen in the clinic with a purulent urethral discharge for 2 days. He has pain on urination and no joint symptoms. A Gram stain of the urethral discharge shows intracellular gram-negative diplococci. Weight is 85 kg. He is symptomatic. A trainee says a stain can never make this diagnosis. Temperature is 37.0°C, pulse is 84/min, respirations are 16/min, and blood pressure is 120/74 mm Hg. The stain was read today from urethral discharge, and symptoms have lasted 2 days.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A urethral Gram stain never diagnoses the infection in a symptomatic man", "The same stain of a pharyngeal swab would be the preferred confirmatory test", "A negative urethral stain would be required before the positive result counts", "The finding instead diagnoses infection that needs more than 4 weeks of therapy at the present visit", "Intracellular gram-negative diplococci on this urethral stain can make the diagnosis"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-urethral-gram-stain-diagnoses-man", "taskCategory": "diagnosis"}$op$,
  $ky$Intracellular gram-negative diplococci on this urethral stain can make the diagnosis$ky$,
  $ex$Gram stain of urethral discharge that shows intracellular gram-negative diplococci can diagnose the infection in a symptomatic man. He has discharge and those organisms on the stain. A negative Gram stain would not rule the infection out, but this stain is positive. The uncomplicated dose of ceftriaxone 500 mg once applies only when weight is under 150 kg and there is no disseminated infection; it is not what makes the stain diagnostic. "A urethral Gram stain never diagnoses the infection in a symptomatic man" is not the best choice because In a symptomatic man, that urethral finding can make the diagnosis. It is not forbidden. "The same stain of a pharyngeal swab would be the preferred confirmatory test" is not the best choice because Gram stain of a pharyngeal specimen is not recommended. The useful stain here is the urethral discharge. "A negative urethral stain would be required before the positive result counts" is not the best choice because A negative stain does not rule infection out, but it is not a requirement before a positive urethral stain can be used. "The finding instead diagnoses infection that needs more than 4 weeks of therapy at the present visit" is not the best choice because More than 4 weeks of parenteral therapy is the endocarditis duration. Urethral discharge with this stain is not that diagnosis.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '80cfeb7bb106dab2877410bb6ca243c26eecfe38998bda6fabe817b3f182fa7a', false, NOW(), NOW(), 2,
  'gc-urethral-gram-stain-diagnoses-man', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'gc-urethral-gram-stain-diagnoses-man', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-220", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210221', 'usmle-step-2', 'rheumatology',
  $sc$A 30-year-old woman who works as a kelp harvester is seen in the hospital who declines an intravenous line for a septic wrist and ankle. She has arthritis and tenosynovitis and will stay in the hospital. Weight is 68 kg. There is no murmur and no neck stiffness. She asks whether the daily ceftriaxone dose can be intramuscular. No dose has been given. Temperature is 38.0°C, pulse is 96/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. Two joints have been inflamed for 36 hours, and she accepts intramuscular injections.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 1 g intramuscularly every 24 hours is acceptable", "The arthritis dose must be intravenous; intramuscular is never allowed", "Because she refuses an intravenous line, give 500 mg intramuscularly once", "Give 1 g intramuscularly once and discharge today for this patient", "Switch to cefotaxime 1 g intramuscularly every 24 hours"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-im-daily-ceftriaxone-acceptable", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 1 g intramuscularly every 24 hours is acceptable$ky$,
  $ex$Disseminated arthritis is treated with ceftriaxone 1 g IM or IV every 24 hours in the hospital. Intramuscular dosing is included. Her weight is 68 kg, under 150 kg, but that does not convert the regimen to a single 500 mg injection. "The arthritis dose must be intravenous; intramuscular is never allowed" is not the best choice because The regimen says IM or IV. Intramuscular ceftriaxone is allowed. "Because she refuses an intravenous line, give 500 mg intramuscularly once" is not the best choice because Refusing an intravenous line does not change the dose to 500 mg once. That single dose is for uncomplicated infection under 150 kg. "Give 1 g intramuscularly once and discharge today for this patient" is not the best choice because One 1 g intramuscular dose is the uncomplicated regimen at a weight of 150 kg or more, not hospital treatment of arthritis. "Switch to cefotaxime 1 g intramuscularly every 24 hours" is not the best choice because Cefotaxime, when used as an alternative, is 1 g IV every 8 hours, not 1 g intramuscularly every 24 hours.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'c539fa8aff45eda17d1bcf02ca4784d8e96fe499d1affdc4c772f5a9a36a13e9', false, NOW(), NOW(), 2,
  'gc-im-daily-ceftriaxone-acceptable', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-im-daily-ceftriaxone-acceptable', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-221", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210222', 'usmle-step-2', 'rheumatology',
  $sc$A 38-year-old man who works as an anchor-chain inspector is seen in the emergency department with a purulent knee and tenosynovitis. Weight is 149 kg. A colleague orders ceftriaxone 500 mg intramuscularly once because the weight is under 150 kg, then plans discharge. He has fever and cannot bear weight. The neck is supple and there is no murmur. Chlamydia testing is pending. Temperature is 38.5°C, pulse is 110/min, respirations are 18/min, and blood pressure is 138/84 mm Hg. Weight is 149 kg, which is under 150 kg, and the knee has been hot for 1 day.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once, because weight is under 150 kg", "Hospitalize and give ceftriaxone 1 g every 24 hours, not 500 mg once", "Ceftriaxone 1 g intramuscularly once, the dose used at 150 kg or more", "Cefotaxime 1 g IV every 24 hours as the weight-based alternative", "No antibiotic until a pharyngeal Gram stain is positive"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-arthritis-149kg-not-single-500", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Hospitalize and give ceftriaxone 1 g every 24 hours, not 500 mg once$ky$,
  $ex$The single 500 mg dose applies to uncomplicated infection when weight is under 150 kg. He weighs 149 kg but has septic arthritis, so hospitalize and give ceftriaxone 1 g IM or IV every 24 hours. The uncomplicated weight rule does not treat the joint. "Ceftriaxone 500 mg intramuscularly once, because weight is under 150 kg" is not the best choice because Weight under 150 kg selects 500 mg once only for uncomplicated cervical, urethral, or rectal infection. It is not the arthritis dose. "Ceftriaxone 1 g intramuscularly once, the dose used at 150 kg or more" is not the best choice because A single 1 g dose is for uncomplicated infection at 150 kg or more. He is under that weight, and arthritis is still not a single dose. "Cefotaxime 1 g IV every 24 hours as the weight-based alternative" is not the best choice because Cefotaxime 1 g IV every 8 hours is the alternative, not every 24 hours. "No antibiotic until a pharyngeal Gram stain is positive" is not the best choice because Gram stain of a pharyngeal specimen is not recommended and is not a gate on treating septic arthritis.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '63ff186d03936812ad656686fc86e92606b2c69aed77f2228d543a5fcfd084af', false, NOW(), NOW(), 3,
  'gc-arthritis-149kg-not-single-500', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-arthritis-149kg-not-single-500', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-222", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210223', 'usmle-step-2', 'rheumatology',
  $sc$A 34-year-old woman who works as a cannery weigher is seen in the clinic with uncomplicated cervical infection and no joint symptoms. Weight is 150 kg. She has cervical discharge without abdominal pain, rash, or swollen joints. She is not pregnant. Someone orders daily hospital ceftriaxone because the weight meets 150 kg. The neck is supple. Temperature is 36.9°C, pulse is 88/min, respirations are 16/min, and blood pressure is 128/78 mm Hg. Weight is exactly 150 kg, and symptoms are limited to cervical discharge for 4 days.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once, because joints are not involved", "Hospitalize for ceftriaxone 1 g every 24 hours for at least 7 days", "Ceftriaxone 1 g intramuscularly once, because weight is 150 kg or more", "Ceftriaxone 1-2 g IV every 12 hours for 10-14 days for this patient", "Cefotaxime 1 g IV every 8 hours as the first choice for cervicitis"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-cervicitis-150kg-single-1g", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 1 g intramuscularly once, because weight is 150 kg or more$ky$,
  $ex$Uncomplicated cervical infection is ceftriaxone 500 mg IM once if weight is under 150 kg, and 1 g if weight is 150 kg or more. Her weight is 150 kg and she has no arthritis, so the dose is 1 g intramuscularly once. Daily hospital therapy is for disseminated joint infection. "Ceftriaxone 500 mg intramuscularly once, because joints are not involved" is not the best choice because Absence of joint disease keeps this uncomplicated, but the 500 mg dose is only for weight under 150 kg. At 150 kg the uncomplicated dose is 1 g once. "Hospitalize for ceftriaxone 1 g every 24 hours for at least 7 days" is not the best choice because Ceftriaxone 1 g every 24 hours in the hospital is for arthritis or arthritis-dermatitis, not uncomplicated cervicitis. "Ceftriaxone 1-2 g IV every 12 hours for 10-14 days for this patient" is not the best choice because The 1-2 g every 12-24 hour schedule for 10-14 days is for meningitis, not cervical discharge. "Cefotaxime 1 g IV every 8 hours as the first choice for cervicitis" is not the best choice because Cefotaxime 1 g IV every 8 hours is an alternative for disseminated infection, not the first regimen for uncomplicated cervicitis.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '788afc97d43c7ca424fd0e8d2faa9bf1eaf15b1dd715e9950fb0bfd716f0d403', false, NOW(), NOW(), 3,
  'gc-cervicitis-150kg-single-1g', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-cervicitis-150kg-single-1g', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-223", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210224', 'usmle-step-2', 'rheumatology',
  $sc$A 22-year-old man who works as a skiff painter is seen in the urgent care with urethral discharge and no joint complaint. Weight is 70 kg. There is no rash, no tenosynovitis, and no murmur. A plan is written for 7 days of ceftriaxone 1 g intravenously because that duration was remembered from a joint case. He can receive one injection and leave. Temperature is 36.8°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. Discharge began 2 days ago, and weight is 70 kg.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 1 g IV every 24 hours for at least 7 days", "Ceftriaxone 1 g intramuscularly once because 7 days is too long before the patient leaves", "Parenteral therapy continued for more than 4 weeks", "Ceftriaxone 500 mg intramuscularly once, not a 7-day parenteral course", "Ceftizoxime 1 g every 8 hours for uncomplicated discharge"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-urethritis-not-week-of-parenteral", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 500 mg intramuscularly once, not a 7-day parenteral course$ky$,
  $ex$Uncomplicated urethral infection at 70 kg, which is under 150 kg, is ceftriaxone 500 mg IM once. A course of at least 7 days of ceftriaxone 1 g every 24 hours is the disseminated arthritis plan, including the step-down to a total of at least 7 days. He has no arthritis. "Ceftriaxone 1 g IV every 24 hours for at least 7 days" is not the best choice because Daily 1 g therapy for at least 7 days treats disseminated arthritis, not this discharge. "Ceftriaxone 1 g intramuscularly once because 7 days is too long before the patient leaves" is not the best choice because The single 1 g dose is for uncomplicated infection at 150 kg or more. He weighs 70 kg, so the single dose is 500 mg. "Parenteral therapy continued for more than 4 weeks" is not the best choice because More than 4 weeks of parenteral therapy is the endocarditis duration. He has no murmur and no joint infection. "Ceftizoxime 1 g every 8 hours for uncomplicated discharge" is not the best choice because Ceftizoxime 1 g every 8 hours is an alternative for disseminated infection, not for uncomplicated urethritis.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '667f618d4cea5cda03d97df780a2b1a5a26745a69ba845ca6ff8c87c3e36fceb', false, NOW(), NOW(), 3,
  'gc-urethritis-not-week-of-parenteral', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-urethritis-not-week-of-parenteral', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-224", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210225', 'usmle-step-2', 'rheumatology',
  $sc$A 41-year-old man who works as a boiler-tube sweeper is seen in the hospital with septic arthritis when ceftriaxone is not available. The knee is purulent and the wrist tendons are inflamed. He is alert, with a supple neck and no murmur. Weight is 88 kg. The pharmacy has cefotaxime and asks for the disseminated-infection schedule. Chlamydia has already been addressed separately. Temperature is 38.2°C, pulse is 100/min, respirations are 18/min, and blood pressure is 130/78 mm Hg. Ceftriaxone is unavailable today, and the joint symptoms have lasted 2 days.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Cefotaxime 1 g IV every 24 hours while hospitalized", "Give ceftriaxone 500 mg intramuscularly as one dose only", "Ceftriaxone 1 g intramuscularly once, then stop treatment", "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks", "Cefotaxime 1 g IV every 8 hours while hospitalized"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-cefotaxime-alternative-every-8h", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Cefotaxime 1 g IV every 8 hours while hospitalized$ky$,
  $ex$If ceftriaxone cannot be used for disseminated arthritis, cefotaxime 1 g IV every 8 hours is an alternative. The every-24-hour interval belongs to ceftriaxone 1 g, not to cefotaxime. He has no endocarditis and no meningitis. "Cefotaxime 1 g IV every 24 hours while hospitalized" is not the best choice because Cefotaxime is given every 8 hours, not every 24 hours. Every 24 hours is the ceftriaxone arthritis interval. "Give ceftriaxone 500 mg intramuscularly as one dose only" is not the best choice because 500 mg once is the uncomplicated ceftriaxone dose under 150 kg, not a cefotaxime schedule. "Ceftriaxone 1 g intramuscularly once, then stop treatment" is not the best choice because A single 1 g injection is the uncomplicated ceftriaxone dose at 150 kg or more, not cefotaxime for arthritis. "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks" is not the best choice because More than 4 weeks and the 1-2 g every 12-24 hour ceftriaxone schedule belong to endocarditis or meningitis, not to this cefotaxime alternative.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'abf5d1634d99a13a2b1baa5538ccc7c04c3dff1f456a7983670da2e2df446c35', false, NOW(), NOW(), 3,
  'gc-cefotaxime-alternative-every-8h', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-cefotaxime-alternative-every-8h', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-225", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210226', 'usmle-step-2', 'rheumatology',
  $sc$A 36-year-old woman who works as a rope-walk splicer is seen in the hospital with a septic knee and ceftriaxone on shortage. Tenosynovitis is present at the ankle. She is hospitalized, alert, and without a murmur. Weight is 64 kg. The pharmacist offers ceftizoxime and asks how often to give 1 g. No oral step-down has been chosen yet. Temperature is 38.0°C, pulse is 94/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. The shortage is confirmed today, and she has been febrile for 24 hours.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftizoxime 1 g every 8 hours while hospitalized", "Ceftizoxime 1 g every 24 hours while hospitalized", "Give ceftriaxone 500 mg intramuscularly as one dose only", "Ceftriaxone 1 g once, because weight is under 150 kg", "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-ceftizoxime-alternative-every-8h", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftizoxime 1 g every 8 hours while hospitalized$ky$,
  $ex$Ceftizoxime 1 g every 8 hours is an alternative to ceftriaxone for disseminated arthritis. The 24-hour interval is the ceftriaxone schedule of 1 g, not the ceftizoxime interval. Weight under 150 kg does not turn this into a single uncomplicated dose. "Ceftizoxime 1 g every 24 hours while hospitalized" is not the best choice because Every 24 hours is wrong for ceftizoxime. The stated interval is every 8 hours. "Give ceftriaxone 500 mg intramuscularly as one dose only" is not the best choice because 500 mg once is not a ceftizoxime regimen. It is the uncomplicated ceftriaxone dose below 150 kg. "Ceftriaxone 1 g once, because weight is under 150 kg" is not the best choice because Weight under 150 kg selects 500 mg of ceftriaxone once for uncomplicated infection. It does not make ceftizoxime a single 1 g dose for arthritis. "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks" is not the best choice because A multiweek 12-hour schedule is not the ceftizoxime alternative. Endocarditis, if present, is parenteral therapy for more than 4 weeks with a different ceftriaxone dose. She has no murmur.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '99bfee1700b40d28d7b6c5c9193bb06e5d3ab853d8a451e4e5c70ef752faf52b', false, NOW(), NOW(), 3,
  'gc-ceftizoxime-alternative-every-8h', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-ceftizoxime-alternative-every-8h', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-226", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210227', 'usmle-step-2', 'rheumatology',
  $sc$A 26-year-old man who works as a bait-shop clerk is seen in the clinic with urethral burning and a negative Gram stain. He has had discharge for 1 day. The urethral Gram stain shows no intracellular gram-negative diplococci. Weight is 80 kg. He is symptomatic. A clinician tells him the negative stain rules the infection out and cancels further testing. Temperature is 37.1°C, pulse is 82/min, respirations are 16/min, and blood pressure is 122/76 mm Hg. The stain was read from urethral discharge, and it is negative.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A negative urethral stain excludes the infection in a symptomatic man", "A negative urethral Gram stain does not rule out the infection", "A negative stain is diagnostic in the same way a positive stain is", "Repeat the stain on a pharyngeal swab to overturn the urethral result", "A negative stain means he needs endocarditis therapy for more than 4 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-negative-urethral-stain-not-exclusion", "taskCategory": "interpretation"}$op$,
  $ky$A negative urethral Gram stain does not rule out the infection$ky$,
  $ex$A negative Gram stain does not rule out the infection, even though intracellular gram-negative diplococci on a urethral stain can diagnose it in a symptomatic man. His negative urethral stain is not exclusion. Pharyngeal Gram stain is not recommended. A weight under 150 kg would matter for a 500 mg uncomplicated dose, not for clearing the diagnosis from a negative stain. "A negative urethral stain excludes the infection in a symptomatic man" is not the best choice because Exclusion is the claim the stain cannot support. A negative result leaves the diagnosis open. "A negative stain is diagnostic in the same way a positive stain is" is not the best choice because A positive urethral stain in a symptomatic man can diagnose the infection. A negative stain does not have that same confirming power in reverse. "Repeat the stain on a pharyngeal swab to overturn the urethral result" is not the best choice because Gram stain of a pharyngeal specimen is not recommended, so it is not the way to overturn the urethral result. "A negative stain means he needs endocarditis therapy for more than 4 weeks" is not the best choice because Endocarditis treatment longer than 4 weeks is unrelated to a negative urethral stain. He has no such cardiac finding.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'a7d19fd816d94de62bae39265c35660418a11e754e38650890931926a27da863', false, NOW(), NOW(), 3,
  'gc-negative-urethral-stain-not-exclusion', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'gc-negative-urethral-stain-not-exclusion', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-227", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210228', 'usmle-step-2', 'rheumatology',
  $sc$A 21-year-old man who works as a choir tenor is seen in the student health with a sore throat for 4 days and no urethral symptoms. He has no joint pain and no discharge. Weight is 75 kg. A clinician prepares a Gram stain of a pharyngeal swab and plans to treat or clear him from that slide alone. He has had oral exposure. Temperature is as listed, and the neck is supple. Temperature is 37.2°C, pulse is 86/min, respirations are 16/min, and blood pressure is 118/70 mm Hg. The throat symptoms have lasted 4 days, and no joint is swollen.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Pharyngeal Gram stain is as diagnostic as a urethral stain in a symptomatic man", "Intracellular diplococci on the throat swab establish the diagnosis", "Gram stain of a pharyngeal specimen is not recommended for this patient", "A negative pharyngeal stain rules out infection at that site", "The throat stain decides between a 7-day and a 4-week course"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-pharyngeal-gram-stain-not-used", "taskCategory": "interpretation"}$op$,
  $ky$Gram stain of a pharyngeal specimen is not recommended for this patient$ky$,
  $ex$Gram stain of pharyngeal specimens is not recommended. The urethral exception, intracellular gram-negative diplococci diagnosing infection in a symptomatic man, does not transfer to the pharynx. A negative stain would not rule infection out even at the urethra. Course lengths such as 7 days or more than 4 weeks are chosen from the clinical syndrome, not from a throat stain. "Pharyngeal Gram stain is as diagnostic as a urethral stain in a symptomatic man" is not the best choice because That diagnostic use is for urethral discharge in a symptomatic man, not for a pharyngeal swab. "Intracellular diplococci on the throat swab establish the diagnosis" is not the best choice because Seeing diplococci on a pharyngeal Gram stain is not a recommended way to establish the diagnosis. "A negative pharyngeal stain rules out infection at that site" is not the best choice because A negative Gram stain does not rule out infection, and a pharyngeal stain is not recommended in the first place. "The throat stain decides between a 7-day and a 4-week course" is not the best choice because Duration choices, at least 7 days for arthritis or more than 4 weeks for endocarditis, are clinical, not the output of a throat stain.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'a42a8e2af7e414e0e5f878207d2e8672581b5ca97f520df1daf2dc2c08521ee1', false, NOW(), NOW(), 3,
  'gc-pharyngeal-gram-stain-not-used', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'gc-pharyngeal-gram-stain-not-used', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-228", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210229', 'usmle-step-2', 'rheumatology',
  $sc$A 33-year-old man who works as a night-shift baker is seen in the clinic for rectal discomfort for 3 days. There is no urethral discharge and no swollen joint. Weight is 90 kg. The plan in the note is to Gram stain a rectal swab and treat only if intracellular diplococci are seen. He is symptomatic at the rectum. Temperature is 37.0°C, pulse is 78/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Rectal pain has lasted 3 days, and the proposed test is a rectal Gram stain.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["A rectal Gram stain diagnoses the infection the way a urethral stain can", "A negative rectal stain rules out rectal infection for this patient", "Rectal stain results choose 500 mg versus 1 g using the stain, not the weight", "Gram stain of a rectal specimen is not recommended for this patient", "A positive rectal stain means parenteral therapy for more than 4 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-rectal-gram-stain-not-used", "taskCategory": "interpretation"}$op$,
  $ky$Gram stain of a rectal specimen is not recommended for this patient$ky$,
  $ex$Gram stain is not recommended on rectal specimens. Intracellular gram-negative diplococci can diagnose infection only on urethral discharge in a symptomatic man. A negative stain does not rule infection out. Dose selection for uncomplicated rectal infection uses weight, 500 mg if under 150 kg, not the stain. "A rectal Gram stain diagnoses the infection the way a urethral stain can" is not the best choice because The diagnostic Gram-stain statement is limited to urethral discharge in a symptomatic man. "A negative rectal stain rules out rectal infection for this patient" is not the best choice because A negative Gram stain does not exclude infection, and rectal Gram stain is not recommended. "Rectal stain results choose 500 mg versus 1 g using the stain, not the weight" is not the best choice because Uncomplicated rectal infection uses ceftriaxone 500 mg IM once under 150 kg and 1 g at 150 kg or more. The stain does not replace the weight. "A positive rectal stain means parenteral therapy for more than 4 weeks" is not the best choice because More than 4 weeks of parenteral therapy is for endocarditis, not for a rectal stain.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '99dea343023804886e096e30d46dd3b6c6422c2655a539c90b266379e0a3b702', false, NOW(), NOW(), 3,
  'gc-rectal-gram-stain-not-used', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'gc-rectal-gram-stain-not-used', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-229", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210230', 'usmle-step-2', 'rheumatology',
  $sc$A 28-year-old woman who works as a chart corrector is seen in the clinic with uncomplicated rectal infection and no arthritis. Testing confirms uncomplicated rectal infection. Weight is 101 kg. She has no tenosynovitis, no rash, and no murmur. She asks why the plan is one injection rather than a hospital stay. The neck is supple. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Weight is 101 kg, under 150 kg, and symptoms have lasted 5 days.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 1 g intramuscularly once because the site is rectal", "Ceftriaxone 1 g IV every 24 hours in the hospital for at least 7 days", "Cefotaxime 1 g IV every 8 hours while hospitalized", "Ceftriaxone 1-2 g IV every 12 hours for 10-14 days", "Give ceftriaxone 500 mg intramuscularly as one dose only"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-rectal-infection-under-150-single-500", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Give ceftriaxone 500 mg intramuscularly as one dose only$ky$,
  $ex$Uncomplicated rectal infection is treated like uncomplicated cervical or urethral infection: ceftriaxone 500 mg IM once if weight is under 150 kg. She weighs 101 kg and has no disseminated joint disease. The rectal site does not by itself raise the dose to 1 g. "Ceftriaxone 1 g intramuscularly once because the site is rectal" is not the best choice because The 1 g single dose is for weight of 150 kg or more, not for the rectal site. She weighs 101 kg. "Ceftriaxone 1 g IV every 24 hours in the hospital for at least 7 days" is not the best choice because Hospital ceftriaxone 1 g every 24 hours for a total of at least 7 days is for arthritis or arthritis-dermatitis. "Cefotaxime 1 g IV every 8 hours while hospitalized" is not the best choice because Cefotaxime 1 g IV every 8 hours is an alternative for disseminated infection, not for uncomplicated rectal infection. "Ceftriaxone 1-2 g IV every 12 hours for 10-14 days" is not the best choice because Ten to 14 days of ceftriaxone 1-2 g every 12-24 hours is the meningitis course, not this infection.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '597c2f998657c601d682a7dac035526afbe5249ef92ce583fcc086896f1b9cdd', false, NOW(), NOW(), 3,
  'gc-rectal-infection-under-150-single-500', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-rectal-infection-under-150-single-500', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-230", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210231', 'usmle-step-2', 'rheumatology',
  $sc$A 31-year-old woman who works as a sail loft cutter is seen in the clinic with uncomplicated cervical infection. Weight is 118 kg. She has no joint swelling, no rash, and no feverish joint pain. A protocol copied from the arthritis pathway would admit her for ceftriaxone 1 g every 24 hours. She is not pregnant. The neurologic exam is normal. Temperature is 36.8°C, pulse is 80/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Weight is 118 kg, which is under 150 kg, and discharge has lasted 6 days.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once, not daily hospital doses", "Ceftriaxone 1 g IM or IV every 24 hours because the cervix is infected", "Ceftriaxone 1 g intramuscularly once because weight exceeds 100 kg", "Ceftizoxime 1 g every 8 hours as preferred therapy", "Parenteral therapy continued for more than 4 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-cervicitis-118kg-single-500-not-daily", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 500 mg intramuscularly once, not daily hospital doses$ky$,
  $ex$Uncomplicated cervical infection at 118 kg, under 150 kg, is ceftriaxone 500 mg IM once. Daily 1 g therapy is for disseminated arthritis. The single 1 g dose starts at a weight of 150 kg or more, not at 100 kg. "Ceftriaxone 1 g IM or IV every 24 hours because the cervix is infected" is not the best choice because Cervical infection without arthritis is not treated with ceftriaxone 1 g every 24 hours. "Ceftriaxone 1 g intramuscularly once because weight exceeds 100 kg" is not the best choice because No threshold of 100 kg is used. The uncomplicated 1 g dose is for weight of 150 kg or more. "Ceftizoxime 1 g every 8 hours as preferred therapy" is not the best choice because Ceftizoxime 1 g every 8 hours is an alternative for disseminated disease, not preferred therapy for uncomplicated cervicitis. "Parenteral therapy continued for more than 4 weeks" is not the best choice because More than 4 weeks of parenteral therapy is for endocarditis, which she does not have.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'a48c406b0188bb7f3deb74a9e4ea0fbabdca0cb8e64dbb03482111f3c767d02f', false, NOW(), NOW(), 3,
  'gc-cervicitis-118kg-single-500-not-daily', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-cervicitis-118kg-single-500-not-daily', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-231", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210232', 'usmle-step-2', 'rheumatology',
  $sc$A 35-year-old man who works as an ice-barge hand is seen in the hospital with septic arthritis and a negative chlamydia test. He is receiving ceftriaxone 1 g IV every 24 hours. The chlamydia assay is negative, so chlamydia has been excluded. Weight is 83 kg. There is no murmur. A standard order set still adds doxycycline 100 mg twice daily for 7 days to every joint case. Temperature is 37.6°C, pulse is 90/min, respirations are 16/min, and blood pressure is 126/76 mm Hg. The negative chlamydia result is already filed, and hospital day 1 is underway.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Add doxycycline 100 mg orally twice daily for 7 days anyway", "Do not add doxycycline; chlamydia has been excluded", "Stop ceftriaxone and give only the 7-day doxycycline course", "Add doxycycline because her weight is under 150 kg", "Replace both drugs with one dose of ceftriaxone 500 mg"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-chlamydia-excluded-skip-doxycycline", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Do not add doxycycline; chlamydia has been excluded$ky$,
  $ex$Doxycycline 100 mg orally twice daily for 7 days is added if chlamydia has not been excluded. His test is negative, so that condition is not met and doxycycline is not added. Ceftriaxone 1 g every 24 hours for the arthritis continues. "Add doxycycline 100 mg orally twice daily for 7 days anyway" is not the best choice because Adding doxycycline after chlamydia has been excluded does not follow the 'if not excluded' rule. "Stop ceftriaxone and give only the 7-day doxycycline course" is not the best choice because Doxycycline does not replace ceftriaxone 1 g every 24 hours. "Add doxycycline because her weight is under 150 kg" is not the best choice because Weight under 150 kg changes the uncomplicated single dose to 500 mg. It does not trigger doxycycline. "Replace both drugs with one dose of ceftriaxone 500 mg" is not the best choice because Ceftriaxone 500 mg once is not the arthritis regimen, whether or not doxycycline is used.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '30871b9b4050ae2b0826cd30221c2d36dd703837495d0cd5e48d58646a3eabff', false, NOW(), NOW(), 4,
  'gc-chlamydia-excluded-skip-doxycycline', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-chlamydia-excluded-skip-doxycycline', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-232", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210233', 'usmle-step-2', 'rheumatology',
  $sc$A 24-year-old woman who works as a buoy painter is seen in the hospital whose knee is better on the morning of day 4. She has received ceftriaxone 1 g IV every 24 hours for 3 full days. She can walk, and susceptibility results support an oral agent. She wants to stop without further pills because she feels improved. Weight is 59 kg. There is no murmur. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. Improvement is clear, but only 3 days of antibiotics have been given.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Stop today at 3 days because the knee has improved for this patient", "Give one additional 500 mg injection and stop, for a 4-day total", "Continue with an oral agent guided by susceptibility so the total is at least 7 days", "Continue parenteral antibiotics for more than 4 weeks because the knee was septic in the office today", "Ignore susceptibility and stop the oral step-down for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-arthritis-course-at-least-7-days", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Continue with an oral agent guided by susceptibility so the total is at least 7 days$ky$,
  $ex$After clear improvement, switch to an oral agent guided by susceptibility, and the total course is at least 7 days. Three days is not enough. A 500 mg dose does not complete arthritis treatment. More than 4 weeks is the endocarditis duration, and she has no murmur. "Stop today at 3 days because the knee has improved for this patient" is not the best choice because Stopping at 3 days leaves the course short of at least 7 days. "Give one additional 500 mg injection and stop, for a 4-day total" is not the best choice because Ceftriaxone 500 mg once is the uncomplicated dose under 150 kg, not a way to finish septic arthritis on day 4. "Continue parenteral antibiotics for more than 4 weeks because the knee was septic in the office today" is not the best choice because Parenteral therapy for more than 4 weeks treats endocarditis, not a joint infection that is ready for oral step-down. "Ignore susceptibility and stop the oral step-down for this patient" is not the best choice because The oral agent is chosen with susceptibility results. Skipping that step is not the regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '0f1ef918bd18d5b9fd86965a9e28f875bfa318ffded2b2cfeaa7bc764373064d', false, NOW(), NOW(), 4,
  'gc-arthritis-course-at-least-7-days', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-arthritis-course-at-least-7-days', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-233", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210234', 'usmle-step-2', 'rheumatology',
  $sc$A 29-year-old woman who works as a net-loft clerk is seen in the clinic with cervical discharge for 3 days. Weight is 66 kg. There is no joint swelling. A Gram stain of an endocervical swab is proposed as the diagnostic test, using the same rule as a urethral stain in a man. She is symptomatic. Temperature is 37.0°C, pulse is 84/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. The specimen someone wants to stain is endocervical, not urethral.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Endocervical Gram stain diagnoses infection just as a urethral stain can", "A negative endocervical stain rules out the infection for this patient", "The stain result replaces the weight-based choice of 500 mg or 1 g", "Gram stain of an endocervical specimen is not recommended", "A positive endocervical stain requires more than 4 weeks of parenteral therapy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-endocervical-gram-stain-not-used", "taskCategory": "interpretation"}$op$,
  $ky$Gram stain of an endocervical specimen is not recommended$ky$,
  $ex$Gram stain of endocervical specimens is not recommended. The finding of intracellular gram-negative diplococci is used on urethral discharge in a symptomatic man, not on an endocervical swab. A negative Gram stain would not rule infection out in any case. Uncomplicated cervical treatment is ceftriaxone 500 mg once under 150 kg, or 1 g at 150 kg or more, and a stain does not replace that weight rule. "Endocervical Gram stain diagnoses infection just as a urethral stain can" is not the best choice because That diagnostic statement is limited to urethral discharge in a symptomatic man. It does not extend to the endocervix. "A negative endocervical stain rules out the infection for this patient" is not the best choice because A negative Gram stain does not rule out infection, and an endocervical stain is not the recommended test. "The stain result replaces the weight-based choice of 500 mg or 1 g" is not the best choice because Uncomplicated cervical treatment is ceftriaxone 500 mg IM once under 150 kg and 1 g at 150 kg or more. A stain does not replace weight. "A positive endocervical stain requires more than 4 weeks of parenteral therapy" is not the best choice because More than 4 weeks of parenteral therapy is for endocarditis, not for a cervical stain.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "interpretation"]$tg$,
  's2-new-20261121-hidden', '493f9cfb25da59959e4cbbeb56b450c129bcac16cb7fbbf17bcffa30ae0fc5f3', false, NOW(), NOW(), 4,
  'gc-endocervical-gram-stain-not-used', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'gc-endocervical-gram-stain-not-used', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-234", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210235', 'usmle-step-2', 'rheumatology',
  $sc$A 40-year-old man who works as a pile-driver oiler is seen in the hospital with a septic knee and no cardiac findings. There is no murmur, and the illness is limited to the knee and wrist tendons. Weight is 95 kg. He is on ceftriaxone 1 g IV every 24 hours and is improving. A note recommends parenteral therapy for more than 4 weeks because the word disseminated was used. Temperature is 37.4°C, pulse is 88/min, respirations are 16/min, and blood pressure is 132/80 mm Hg. No valve disease is described, and hospital day 2 shows early improvement.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Parenteral therapy for more than 4 weeks because the infection disseminated", "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks", "Ceftriaxone 500 mg once, since there is no murmur for this patient", "Stop at 48 hours if the knee already feels cooler for this patient", "Plan at least 7 days with oral step-down, not an endocarditis course"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-arthritis-not-endocarditis-duration", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Plan at least 7 days with oral step-down, not an endocarditis course$ky$,
  $ex$Endocarditis is treated with parenteral therapy for more than 4 weeks, and the meningitis or endocarditis ceftriaxone dose is 1-2 g IV every 12-24 hours. He has arthritis without valve disease, so the regimen remains ceftriaxone 1 g every 24 hours, then an oral agent guided by susceptibility, for a total of at least 7 days. "Parenteral therapy for more than 4 weeks because the infection disseminated" is not the best choice because Dissemination to a joint is not endocarditis. More than 4 weeks is the endocarditis duration. "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks" is not the best choice because Both the 1-2 g every 12-24 hour dose and the more-than-4-week duration are the wrong pair for uncomplicated joint infection. "Ceftriaxone 500 mg once, since there is no murmur for this patient" is not the best choice because Absence of a murmur does not reduce arthritis treatment to the 500 mg uncomplicated dose. "Stop at 48 hours if the knee already feels cooler for this patient" is not the best choice because Stopping at 48 hours is shorter than the at-least-7-day total.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '41073917fec2cd2bca5f6d5bb4e39ace6d83232053c9709405fe5a6fde4e9172', false, NOW(), NOW(), 4,
  'gc-arthritis-not-endocarditis-duration', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-arthritis-not-endocarditis-duration', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-235", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210236', 'usmle-step-2', 'rheumatology',
  $sc$A 37-year-old woman who works as a radar-archivist is seen in the hospital with a hot knee, a clear sensorium, and a supple neck. She has tenosynovitis but no headache and no confusion. Weight is 77 kg. An order was written for ceftriaxone 2 g IV every 12 hours for 14 days, copied from a meningitis schedule. There is no murmur. Temperature is 38.1°C, pulse is 92/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. Mentation is normal, and the neck flexes fully. The knee has been swollen for 2 days.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 1 g every 24 hours, not the 10-14 day meningitis dose", "Ceftriaxone 1-2 g IV every 12-24 hours for 10-14 days", "Ceftriaxone 2 g IV every 12 hours for more than 4 weeks", "Give ceftriaxone 500 mg intramuscularly as one dose only in the office today", "Cefotaxime 1 g IV every 24 hours for a 14-day course"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-arthritis-not-meningitis-schedule", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 1 g every 24 hours, not the 10-14 day meningitis dose$ky$,
  $ex$Meningitis is treated parenterally for 10-14 days with ceftriaxone 1-2 g IV every 12-24 hours. She has arthritis without meningitis, so hospitalize with ceftriaxone 1 g IM or IV every 24 hours and, after improvement, an oral agent for a total of at least 7 days. Endocarditis would be more than 4 weeks, and she has no murmur. "Ceftriaxone 1-2 g IV every 12-24 hours for 10-14 days" is not the best choice because That dose and the 10-14 day duration are the meningitis regimen, not the arthritis regimen. "Ceftriaxone 2 g IV every 12 hours for more than 4 weeks" is not the best choice because More than 4 weeks is the endocarditis duration, and 2 g every 12 hours is not the arthritis dose of 1 g every 24 hours. "Give ceftriaxone 500 mg intramuscularly as one dose only in the office today" is not the best choice because A single 500 mg dose treats uncomplicated infection under 150 kg, not a septic knee. "Cefotaxime 1 g IV every 24 hours for a 14-day course" is not the best choice because Cefotaxime 1 g IV every 8 hours is the alternative interval, not every 24 hours for 14 days.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'a4742b3e458f3d7ae8155983089ac930880fa3396cda91b4e84b32a8cb5e8d4a', false, NOW(), NOW(), 4,
  'gc-arthritis-not-meningitis-schedule', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-arthritis-not-meningitis-schedule', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-236", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210237', 'usmle-step-2', 'rheumatology',
  $sc$A 45-year-old man who works as a gantry welder is seen in the emergency department with a septic knee and tenosynovitis. Weight is 150 kg. He cannot walk on the leg, and the knee is hot. There is no murmur, and he is alert with a supple neck. A clinician orders ceftriaxone 1 g intramuscularly once, citing the uncomplicated dose for weight of 150 kg or more, and plans to send him home. Temperature is 38.6°C, pulse is 108/min, respirations are 18/min, and blood pressure is 142/86 mm Hg. Weight is exactly 150 kg, and the knee has been swollen for 36 hours.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 1 g intramuscularly once, because weight is 150 kg", "Hospitalize and give ceftriaxone 1 g every 24 hours, not 1 g once", "Ceftriaxone 500 mg intramuscularly once, because one joint is involved", "Ceftriaxone 1-2 g IV every 12 hours for 10-14 days", "Three weekly benzathine doses totaling 7.2 million units"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "gc-arthritis-150kg-not-single-dose", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Hospitalize and give ceftriaxone 1 g every 24 hours, not 1 g once$ky$,
  $ex$At a weight of 150 kg or more, uncomplicated cervical, urethral, or rectal infection is ceftriaxone 1 g IM once. That single dose is not the regimen for septic arthritis. He needs hospitalization and ceftriaxone 1 g IM or IV every 24 hours. The 500 mg dose is for uncomplicated infection under 150 kg. "Ceftriaxone 1 g intramuscularly once, because weight is 150 kg" is not the best choice because The 1 g once rule is the uncomplicated regimen at his weight. Arthritis does not use that single dose. "Ceftriaxone 500 mg intramuscularly once, because one joint is involved" is not the best choice because 500 mg once is the wrong uncomplicated dose at 150 kg and is also wrong for arthritis. "Ceftriaxone 1-2 g IV every 12 hours for 10-14 days" is not the best choice because Ten to 14 days of 1-2 g every 12-24 hours treats meningitis, not a septic knee without meningitis. "Three weekly benzathine doses totaling 7.2 million units" is not the best choice because The 7.2 million unit benzathine schedule is not treatment of this joint infection.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'e8d7d356b15f1ea9e7fe38ec03fa91bf61dbd029a9166925064ffd4b21ac44bd', false, NOW(), NOW(), 5,
  'gc-arthritis-150kg-not-single-dose', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-arthritis-150kg-not-single-dose', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-237", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210238', 'usmle-step-2', 'dermatology',
  $sc$A 26-year-old man who works as a stencil cutter is seen in the emergency department because of pustules on the fingers and a swollen wrist. About 12 pustules, each a few millimeters wide, are scattered on the palms and fingers, and the wrist tendon sheath is tender. He had urethral discharge 5 days ago. Weight is 83 kg. He is alert, the neck is supple, and there is no murmur. No antibiotic has been started. Temperature is 38.2°C, pulse is 100/min, respirations are 18/min, and blood pressure is 122/74 mm Hg. The pustules appeared over 2 days, and he can barely flex the wrist.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once in the office", "A topical drying agent only, because the lesions are pustules", "Hospitalize and give ceftriaxone 1 g IM or IV every 24 hours", "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks", "Benzathine penicillin G 2.4 million units intramuscularly once"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "rash-arthritis-hospital-daily-ceftriaxone", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Hospitalize and give ceftriaxone 1 g IM or IV every 24 hours$ky$,
  $ex$Pustules on the distal extremities with tenosynovitis are the arthritis-dermatitis pattern and are treated in the hospital with ceftriaxone 1 g IM or IV every 24 hours. Weight is 83 kg, under 150 kg, but 500 mg once is for uncomplicated infection, not this syndrome. "Ceftriaxone 500 mg intramuscularly once in the office" is not the best choice because The single 500 mg dose does not treat disseminated infection with skin and joint findings. "A topical drying agent only, because the lesions are pustules" is not the best choice because Skin care alone does not treat the infection. Hospital parenteral ceftriaxone is required. "Ceftriaxone 1-2 g IV every 12 hours for more than 4 weeks" is not the best choice because More than 4 weeks of the higher, more frequent ceftriaxone dose is for endocarditis, and he has no murmur. Meningitis uses 10-14 days. Neither fits these pustules and a wrist. "Benzathine penicillin G 2.4 million units intramuscularly once" is not the best choice because Benzathine penicillin G 2.4 million units once is not the regimen for this rash and tenosynovitis.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'a4551d2cfd566dabfbafe01cd2a8b1a51532afe24140df1293422b7dc4f82a97', false, NOW(), NOW(), 2,
  'rash-arthritis-hospital-daily-ceftriaxone', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'rash-arthritis-hospital-daily-ceftriaxone', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-238", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210239', 'usmle-step-2', 'dermatology',
  $sc$A 24-year-old woman who works as a dye-vat assistant is seen in the hospital with necrotic pustules on the shins and a swollen ankle. Six pustules with dark centers sit on the distal legs, and the ankle tendon sheath is inflamed. Ceftriaxone 1 g IV every 24 hours has just been ordered. A chlamydia test is still pending. Weight is 57 kg. There is no murmur. Temperature is 38.0°C, pulse is 96/min, respirations are 16/min, and blood pressure is 112/68 mm Hg. The skin lesions have been present for 36 hours, and the second test is not back.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Give ceftriaxone alone until a chlamydia test is positive for this patient during today's visit", "Add a single doxycycline 100 mg dose and then stop for this patient", "Replace the daily ceftriaxone with doxycycline only for this patient", "Add doxycycline 100 mg orally twice daily for 7 days while chlamydia is unexcluded", "Add doxycycline only after a skin Gram stain is positive for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "rash-arthritis-add-doxycycline", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Add doxycycline 100 mg orally twice daily for 7 days while chlamydia is unexcluded$ky$,
  $ex$For arthritis-dermatitis, add doxycycline 100 mg orally twice daily for 7 days if chlamydia has not been excluded. The test is pending, so doxycycline is added to ceftriaxone 1 g every 24 hours. A skin Gram stain is not the criterion. "Give ceftriaxone alone until a chlamydia test is positive for this patient during today's visit" is not the best choice because The add-on is for when chlamydia has not been excluded, not only after a positive test. "Add a single doxycycline 100 mg dose and then stop for this patient" is not the best choice because The doxycycline course is twice daily for 7 days, not one tablet. "Replace the daily ceftriaxone with doxycycline only for this patient" is not the best choice because Doxycycline does not replace ceftriaxone. "Add doxycycline only after a skin Gram stain is positive for this patient" is not the best choice because Gram stain of skin is not the stated test. Pharyngeal, rectal, and endocervical Gram stains are not recommended, and they do not decide this add-on.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'f51cb72fd23201021b4befdcc230d660f2fa362f5aa74b44bf9c0d4d3b72ef45', false, NOW(), NOW(), 3,
  'rash-arthritis-add-doxycycline', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'rash-arthritis-add-doxycycline', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-239", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210240', 'usmle-step-2', 'dermatology',
  $sc$A 28-year-old man who works as a print-shop helper is seen in the ward on day 3, with fading pustules on the soles and a cooler knee. He was admitted for scattered pustules on the feet and a hot knee. Ceftriaxone 1 g IV every 24 hours has been given, and the lesions are drying. Susceptibility results can guide an oral agent. Weight is 81 kg. He feels ready to leave and wants no more medicine. Temperature is 36.9°C, pulse is 78/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Clear improvement is present on day 3 of 1 g daily ceftriaxone.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Stop all antibiotics today because the pustules are drying for this patient", "Continue intravenous therapy for more than 4 weeks for this patient", "Give ceftriaxone 500 mg once at discharge and stop for this patient", "Choose the oral agent without using the susceptibility report for this patient at the present visit", "Change to an oral agent guided by susceptibility and complete at least 7 days total"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "rash-fading-day-three-stepdown", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Change to an oral agent guided by susceptibility and complete at least 7 days total$ky$,
  $ex$After clear improvement, switch to an oral agent guided by susceptibility. The total course for this disseminated skin-and-joint infection is at least 7 days. Drying pustules on day 3 do not end treatment. "Stop all antibiotics today because the pustules are drying for this patient" is not the best choice because Improvement does not shorten the course below a total of at least 7 days. "Continue intravenous therapy for more than 4 weeks for this patient" is not the best choice because More than 4 weeks of parenteral therapy is the endocarditis duration. He has improving skin and joint findings, not endocarditis. "Give ceftriaxone 500 mg once at discharge and stop for this patient" is not the best choice because Ceftriaxone 500 mg once is the uncomplicated dose under 150 kg, not the end of this regimen. "Choose the oral agent without using the susceptibility report for this patient at the present visit" is not the best choice because The oral choice is guided by susceptibility, not selected without it.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'ff3a87295b165c475156a0a9d0bbf45b78cb32fbef7027550f5cba757e74eb68', false, NOW(), NOW(), 3,
  'rash-fading-day-three-stepdown', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'rash-fading-day-three-stepdown', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-240", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210241', 'usmle-step-2', 'dermatology',
  $sc$A 33-year-old woman who works as a glaze mixer is seen in the hospital with hemorrhagic pustules on the forearms and a swollen wrist. Ceftriaxone is not on the formulary today. She has eight small pustules on the distal arms and tenosynovitis. Weight is 62 kg. She is alert and has no murmur. The pharmacy can mix cefotaxime. Temperature is 38.3°C, pulse is 104/min, respirations are 18/min, and blood pressure is 116/72 mm Hg. The rash began yesterday, and she is being admitted.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Cefotaxime 1 g IV every 8 hours while hospitalized", "Cefotaxime 1 g IV every 24 hours while hospitalized", "Give ceftriaxone 500 mg intramuscularly as one dose only", "Ceftriaxone 1 g once because the lesions are only on the skin", "Cefotaxime 1 g IV every 8 hours for more than 4 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "rash-cefotaxime-when-ceftriaxone-absent", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Cefotaxime 1 g IV every 8 hours while hospitalized$ky$,
  $ex$Cefotaxime 1 g IV every 8 hours is an alternative for disseminated infection with arthritis-dermatitis when ceftriaxone is not used. Skin lesions do not change the interval to every 24 hours or to a single dose. More than 4 weeks is the endocarditis duration, and she has no murmur. "Cefotaxime 1 g IV every 24 hours while hospitalized" is not the best choice because The cefotaxime interval is every 8 hours, not every 24 hours. "Give ceftriaxone 500 mg intramuscularly as one dose only" is not the best choice because 500 mg once is not the cefotaxime alternative. It is the uncomplicated ceftriaxone dose under 150 kg. "Ceftriaxone 1 g once because the lesions are only on the skin" is not the best choice because A single 1 g dose does not treat this disseminated rash and wrist findings. "Cefotaxime 1 g IV every 8 hours for more than 4 weeks" is not the best choice because The alternative does not automatically run more than 4 weeks. That duration is for endocarditis.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '3725d05c24e9ff0c9d392c713caa1dcd81cee8e74a67b2f1c22077811d07d731', false, NOW(), NOW(), 3,
  'rash-cefotaxime-when-ceftriaxone-absent', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'rash-cefotaxime-when-ceftriaxone-absent', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-241", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210242', 'usmle-step-2', 'dermatology',
  $sc$A 39-year-old man who works as a tile-kiln loader is seen in the hospital with pustules clustered on one palm and a hot elbow. Ceftriaxone cannot be obtained. About 10 pustules sit on the palm, and the elbow is swollen. Weight is 91 kg. Mentation is clear and there is no murmur. Ceftizoxime is in stock. Temperature is 38.1°C, pulse is 98/min, respirations are 16/min, and blood pressure is 128/80 mm Hg. Skin and joint findings have lasted 2 days, and admission is underway.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftizoxime 1 g every 24 hours while hospitalized", "Ceftizoxime 1 g every 8 hours while hospitalized", "Give ceftriaxone 500 mg once and discharge her today", "Ceftizoxime 1 g every 8 hours for more than 4 weeks by default", "Ceftizoxime only if a rectal Gram stain is positive"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "rash-ceftizoxime-when-ceftriaxone-absent", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftizoxime 1 g every 8 hours while hospitalized$ky$,
  $ex$Ceftizoxime 1 g every 8 hours is an alternative regimen for disseminated arthritis-dermatitis. It is not dosed every 24 hours and not as a single 500 mg discharge dose. A rectal Gram stain is not recommended and is not required before this alternative. "Ceftizoxime 1 g every 24 hours while hospitalized" is not the best choice because Every 24 hours is the ceftriaxone arthritis interval, not the ceftizoxime interval. "Give ceftriaxone 500 mg once and discharge her today" is not the best choice because 500 mg once treats uncomplicated infection under 150 kg. He needs the disseminated alternative. "Ceftizoxime 1 g every 8 hours for more than 4 weeks by default" is not the best choice because More than 4 weeks is not the default. That parenteral duration is for endocarditis. He has no murmur. "Ceftizoxime only if a rectal Gram stain is positive" is not the best choice because Gram stain of a rectal specimen is not recommended and does not gate ceftizoxime.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '405d4de02fac622137ab01fdcec036e948e385ec42bb8cc68e4bbde31d328b72', false, NOW(), NOW(), 3,
  'rash-ceftizoxime-when-ceftriaxone-absent', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'rash-ceftizoxime-when-ceftriaxone-absent', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-242", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210243', 'usmle-step-2', 'dermatology',
  $sc$A 27-year-old woman who works as a pattern-book clerk is seen in the emergency department with sparse pustules on the feet and an inflamed ankle tendon. She is fully oriented, has no headache, and the neck is supple. Weight is 63 kg. There is no murmur. An order copies a meningitis plan: ceftriaxone 2 g IV every 12 hours for 14 days. The skin lesions number about 9. Temperature is 38.0°C, pulse is 94/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. She has no confusion, and the rash has been present for 1 day.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 1-2 g IV every 12-24 hours for 10-14 days", "Give ceftriaxone 500 mg intramuscularly as one dose only", "Ceftriaxone 1 g every 24 hours, not a 10-14 day meningitis schedule", "Parenteral therapy for more than 4 weeks because pustules are present", "Cefotaxime 1 g every 24 hours for a 14-day course"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "rash-not-meningitis-duration", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 1 g every 24 hours, not a 10-14 day meningitis schedule$ky$,
  $ex$Meningitis is parenteral therapy for 10-14 days at ceftriaxone 1-2 g IV every 12-24 hours. She has skin and tendon findings without meningitis, so use ceftriaxone 1 g IM or IV every 24 hours in the hospital. Pustules do not create an endocarditis indication for more than 4 weeks. "Ceftriaxone 1-2 g IV every 12-24 hours for 10-14 days" is not the best choice because That schedule treats meningitis. Her exam does not show meningitis. "Give ceftriaxone 500 mg intramuscularly as one dose only" is not the best choice because 500 mg once is for uncomplicated infection under 150 kg, not for this rash and tendon. "Parenteral therapy for more than 4 weeks because pustules are present" is not the best choice because More than 4 weeks of parenteral therapy treats endocarditis. Skin lesions are part of arthritis-dermatitis, not a reason for that duration. "Cefotaxime 1 g every 24 hours for a 14-day course" is not the best choice because If cefotaxime is used, it is 1 g IV every 8 hours, not every 24 hours for 14 days.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'e3a6dae17b55f944b1494ec9e9be5e49de7a1e1db1faa8396b1ba267cd41e6ec', false, NOW(), NOW(), 3,
  'rash-not-meningitis-duration', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'rash-not-meningitis-duration', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-243", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210244', 'usmle-step-2', 'dermatology',
  $sc$A 42-year-old man who works as a hull painter is seen in the emergency department with pustules on the dorsal hands and a swollen knee. Weight is 110 kg, under 150 kg. About 15 pustules cover the backs of the hands, and the knee is hot. He is admitted. A discharge-oriented colleague still wants ceftriaxone 500 mg intramuscularly once because the weight is under 150 kg. Temperature is 38.4°C, pulse is 106/min, respirations are 18/min, and blood pressure is 136/84 mm Hg. Weight is 110 kg, and the rash and knee began 2 days ago.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once, because weight is 110 kg", "Ceftriaxone 1 g intramuscularly once, the dose for weight of 150 kg or more", "No systemic antibiotic if the pustules are counted and described", "Ceftriaxone 1 g every 24 hours in the hospital, despite weight under 150 kg", "Ceftriaxone 2 g every 12 hours for more than 4 weeks for this patient"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "rash-110kg-still-daily-not-500", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 1 g every 24 hours in the hospital, despite weight under 150 kg$ky$,
  $ex$Weight under 150 kg selects ceftriaxone 500 mg IM once only for uncomplicated infection. Pustules plus a septic knee are disseminated disease: hospitalize and give ceftriaxone 1 g IM or IV every 24 hours. He weighs 110 kg, so the uncomplicated 1 g once dose does not apply either. "Ceftriaxone 500 mg intramuscularly once, because weight is 110 kg" is not the best choice because The 500 mg single dose is not used for this skin-and-joint syndrome, regardless of a weight of 110 kg. "Ceftriaxone 1 g intramuscularly once, the dose for weight of 150 kg or more" is not the best choice because The single 1 g dose is for uncomplicated infection at 150 kg or more. He is under 150 kg and he has disseminated disease. "No systemic antibiotic if the pustules are counted and described" is not the best choice because Describing the rash does not replace antibiotics. "Ceftriaxone 2 g every 12 hours for more than 4 weeks for this patient" is not the best choice because Two grams every 12 hours for more than 4 weeks mixes the higher meningitis dose with the endocarditis duration. He has neither diagnosis stated.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '47817ce0f6ac095616787458aa76db32a20f3344928d753fb48678fa0b6efae3', false, NOW(), NOW(), 4,
  'rash-110kg-still-daily-not-500', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'rash-110kg-still-daily-not-500', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-244", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210245', 'usmle-step-2', 'dermatology',
  $sc$A 30-year-old woman who works as a mosaic grouter is seen in the hospital with distal pustules and wrist tenosynovitis only. Cardiac exam has no murmur. About 11 pustules are on the fingers, and one tendon sheath is inflamed. Weight is 69 kg. She is improving on ceftriaxone 1 g IV every 24 hours. A cross-covering note extends parenteral treatment beyond 4 weeks because the infection is disseminated. Temperature is 37.2°C, pulse is 86/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. There is no valvular finding, and the skin lesions are limited to the hands.$sc$,
  $qu$Which of the following is the most appropriate pharmacotherapy?$qu$,
  $op${"options": ["Continue parenteral therapy for more than 4 weeks for this patient", "Use ceftriaxone 1-2 g IV every 12 hours for those 4 weeks", "Discharge today after ceftriaxone 500 mg as a single dose", "Stop treatment when the pustules crust, even on day 2 for this patient at the present visit", "Plan at least 7 days with oral step-down, not more than 4 weeks of IV therapy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "msk-skin", "blueprintTopic": "rash-not-endocarditis-duration", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Plan at least 7 days with oral step-down, not more than 4 weeks of IV therapy$ky$,
  $ex$Endocarditis requires parenteral therapy for more than 4 weeks. She has arthritis-dermatitis without a murmur, so after clear improvement use an oral agent guided by susceptibility, for a total of at least 7 days, on top of ceftriaxone 1 g every 24 hours. The 1-2 g every 12-24 hour dose is the meningitis and endocarditis dose. "Continue parenteral therapy for more than 4 weeks for this patient" is not the best choice because More than 4 weeks is not the duration of skin-and-joint disease without endocarditis. "Use ceftriaxone 1-2 g IV every 12 hours for those 4 weeks" is not the best choice because That higher and more frequent ceftriaxone dose is not the 1 g every 24 hours arthritis regimen, and 4 weeks is not the stated skin-and-joint course. "Discharge today after ceftriaxone 500 mg as a single dose" is not the best choice because Ceftriaxone 500 mg once is the uncomplicated dose under 150 kg, not a discharge plan from this admission. "Stop treatment when the pustules crust, even on day 2 for this patient at the present visit" is not the best choice because Crusting on day 2 does not complete a course of at least 7 days.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "msk-skin", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '1ebc539ee2eb5e535865ec7ceca44bd24c8440420b69a127742dcc7a50303fe0', false, NOW(), NOW(), 4,
  'rash-not-endocarditis-duration', 'msk-skin', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'rash-not-endocarditis-duration', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-245", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210246', 'usmle-step-2', 'ethics',
  $sc$A 34-year-old woman who works as a grant writer is seen in the family medicine office for a new-patient preventive visit. She feels well, has had one partner for 6 years, and has never injected drugs. She takes levothyroxine 75 mcg each morning and is training for a 10-km community walk. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/74 mm Hg. Body mass index is 24 kg/m2. Hemoglobin last month was 13.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Offer HIV testing now because her age is inside the 15-to-65 range", "Defer HIV testing until age 65 because she reports no injection drug use", "Skip HIV testing because it is reserved for pregnancy and for labor", "Offer HIV testing only after 65, when the universal age range begins", "Defer HIV testing because a risk factor is required at every age under 65"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hiv-screen-adult-age-34", "taskCategory": "health-maintenance"}$op$,
  $ky$Offer HIV testing now because her age is inside the 15-to-65 range$ky$,
  $ex$Adolescents and adults aged 15 to 65 are screened for HIV. She is 34, so testing is offered without an added risk factor. "Defer HIV testing until age 65 because she reports no injection drug use" is not the best choice because Lack of injection drug use does not remove screening between ages 15 and 65. Waiting until 65 reverses the age rule. "Skip HIV testing because it is reserved for pregnancy and for labor" is not the best choice because Pregnancy and labor with unknown status are additional times to test. They are not the only times adults 15 to 65 are tested. "Offer HIV testing only after 65, when the universal age range begins" is not the best choice because Universal screening runs from age 15 through 65. It does not begin after 65. After 65, testing depends on increased risk. "Defer HIV testing because a risk factor is required at every age under 65" is not the best choice because An increased-risk reason is required under 15 and over 65. It is not required for a 34-year-old.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '8c529eb1caf3c6113483a79c6c9a30c4156c7f7784d1eae9d202d2cf0ad944a5', false, NOW(), NOW(), 1,
  'hiv-screen-adult-age-34', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for HIV Infection.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hiv-screen-adult-age-34', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-246", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210247', 'usmle-step-2', 'ethics',
  $sc$A 26-year-old woman who works as a pastry chef is seen in the midwifery clinic for the opening visit of a wanted pregnancy. She is at 18 weeks of gestation, has had no prior births, and recalls no blood-borne virus test. She takes a prenatal tablet with 27 mg of iron and has had nausea but no vomiting for 2 days. Temperature is 36.7°C, pulse is 88/min, respirations are 16/min, and blood pressure is 112/68 mm Hg. The fetal heart rate is 150/min. Fundal height matches the stated dates.$sc$,
  $qu$Which of the following is the most appropriate testing plan?$qu$,
  $op${"options": ["Defer a virus test until she presents in labor with an unknown result", "Offer HIV testing during this pregnancy even though she feels well", "Skip HIV testing because she is younger than 30 and has one partner", "Offer HIV testing only if she reports injection drug use in pregnancy", "Postpone HIV testing until the postpartum visit at 6 weeks"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hiv-screen-pregnant-age-26", "taskCategory": "health-maintenance"}$op$,
  $ky$Offer HIV testing during this pregnancy even though she feels well$ky$,
  $ex$Every pregnant person is screened for HIV. She is 26 and at 18 weeks, so testing is offered in this pregnancy. "Defer a virus test until she presents in labor with an unknown result" is not the best choice because Unknown status in labor is a reason to test at that moment. It is not a reason to withhold testing from someone already receiving prenatal care. "Skip HIV testing because she is younger than 30 and has one partner" is not the best choice because Age 26 is inside 15 to 65, and pregnancy itself is a reason to screen. One partner does not cancel that. "Offer HIV testing only if she reports injection drug use in pregnancy" is not the best choice because Injection drug use is an increased-risk reason under 15 or over 65. It is not required before testing a pregnant adult. "Postpone HIV testing until the postpartum visit at 6 weeks" is not the best choice because Testing is not delayed until 6 weeks after birth. Pregnant people are screened, including before labor.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'a6f2640d38955a0c15cadaebc1fbc35ef1f96c5ab8b176b2fe4c9bcbf0c5c4b5', false, NOW(), NOW(), 2,
  'hiv-screen-pregnant-age-26', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for HIV Infection.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hiv-screen-pregnant-age-26', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-247", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210248', 'usmle-step-2', 'ethics',
  $sc$A 31-year-old woman who works as a florist is seen in the labor and delivery unit after arriving with regular contractions. She had no prenatal visits. Contractions are every 4 minutes and the cervix is 6 cm dilated. She does not know whether a virus panel was ever drawn. The bag of waters is intact. Temperature is 37.0°C, pulse is 96/min, respirations are 18/min, and blood pressure is 128/76 mm Hg. The fetal heart rate is 142/min. Estimated fetal weight on a bedside scan is 3100 g.$sc$,
  $qu$Which of the following is the most appropriate testing plan?$qu$,
  $op${"options": ["Wait until the 6-week postpartum visit before any virus testing", "Test the newborn only, and do not test the mother during labor", "Offer HIV testing now because her status on arrival is unknown", "Defer HIV testing unless the membranes have been ruptured for 18 hours", "Skip HIV testing because she is already past 28 weeks of gestation"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hiv-screen-unknown-in-labor", "taskCategory": "clinical-intervention"}$op$,
  $ky$Offer HIV testing now because her status on arrival is unknown$ky$,
  $ex$HIV testing is offered to every pregnant person, including someone who presents in labor with unknown HIV status. She has had no prenatal testing. "Wait until the 6-week postpartum visit before any virus testing" is not the best choice because A person who presents in labor with unknown HIV status is tested then, not held for a visit 6 weeks later. "Test the newborn only, and do not test the mother during labor" is not the best choice because Maternal testing is indicated when status is unknown in labor. Testing only the newborn leaves that recommendation undone. "Defer HIV testing unless the membranes have been ruptured for 18 hours" is not the best choice because No membrane-rupture interval is the trigger. Unknown HIV status at presentation in labor is enough to test. "Skip HIV testing because she is already past 28 weeks of gestation" is not the best choice because Gestational age past 28 weeks does not cancel testing. Unknown status in labor is a stated reason to screen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'c856c4a9e39fec4b2c8015bc34a76b31c3ce96db8ea9b0f0634d5877f40e11b2', false, NOW(), NOW(), 3,
  'hiv-screen-unknown-in-labor', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for HIV Infection.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'hiv-screen-unknown-in-labor', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-248", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210249', 'usmle-step-2', 'ethics',
  $sc$A 14-year-old girl who works as a babysitter is seen in the school-based health center for a sports physical before swim season. She has one partner, and they use condoms. She has never injected drugs, never traded sex, and has no prior positive genital test. She plays violin and lives with her parents. Temperature is 36.5°C, pulse is 76/min, respirations are 16/min, and blood pressure is 104/64 mm Hg. Body mass index is 20 kg/m2. She started menses at age 12.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Offer HIV testing because every person under 15 is in the universal screen at this encounter", "Offer HIV testing because age 14 sits inside the 15-to-65 universal range", "Offer HIV testing because absence of risk is itself an indication under 15", "Do not include her in universal HIV screening when no increased risk is present", "Defer every HIV test until age 65 and give no advice before then"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hiv-no-universal-screen-age-14", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not include her in universal HIV screening when no increased risk is present$ky$,
  $ex$A 14-year-old with no increased risk is not in the universal HIV screen. Injection drug use, a partner with HIV, condomless sex with more than one partner of unknown status, transactional sex, or another sexually transmitted infection would change that. "Offer HIV testing because every person under 15 is in the universal screen at this encounter" is not the best choice because Universal screening starts at 15. A 14-year-old is not included on age alone. "Offer HIV testing because age 14 sits inside the 15-to-65 universal range" is not the best choice because The universal range is 15 to 65. Age 14 is under 15, so it is outside that range. "Offer HIV testing because absence of risk is itself an indication under 15" is not the best choice because Under 15, testing is offered when risk is increased. Having no risk factor is not an indication. "Defer every HIV test until age 65 and give no advice before then" is not the best choice because After 65, testing is risk-based, but that does not create a rule to discuss nothing until 65. The point today is that universal screening does not include her.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'e10e0ff05c554dc6bfe4cd42aad1f5554c9d33323679eaa5649a8d4ce1c85c2b', false, NOW(), NOW(), 3,
  'hiv-no-universal-screen-age-14', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for HIV Infection.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hiv-no-universal-screen-age-14', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-249", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210250', 'usmle-step-2', 'ethics',
  $sc$A 14-year-old boy who works as a bike courier is seen in the youth harm-reduction clinic brought by his uncle for a first visit. He says he injected opioids with shared equipment 6 times in the past 4 months. He has night sweats only after long courier shifts. He sleeps at his uncle's apartment on weeknights. Temperature is 36.8°C, pulse is 84/min, respirations are 15/min, and blood pressure is 108/66 mm Hg. He weighs 52 kg. There are a few healed puncture marks at the left antecubital fossa.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Refuse HIV testing because no 14-year-old is ever offered a test", "Defer HIV testing until his 15th birthday even though he injects drugs during today's visit", "Offer HIV testing only after he has a partner known to have the virus", "Skip HIV testing because shared equipment matters only after age 65", "Offer HIV testing now because injection drug use is increased risk under 15"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hiv-screen-age-14-injection-drug-use", "taskCategory": "health-maintenance"}$op$,
  $ky$Offer HIV testing now because injection drug use is increased risk under 15$ky$,
  $ex$Under 15, testing is offered when risk is increased. He is 14 and has injected drugs, so HIV testing is offered. "Refuse HIV testing because no 14-year-old is ever offered a test" is not the best choice because Age 14 without increased risk is outside the universal screen. Increased risk is a reason to offer testing under 15. "Defer HIV testing until his 15th birthday even though he injects drugs during today's visit" is not the best choice because The 15th birthday is the start of universal screening. It is not a reason to delay testing when injection drug use is already present at 14. "Offer HIV testing only after he has a partner known to have the virus" is not the best choice because A partner with HIV is one increased-risk reason. Injection drug use is another, and it is already present. "Skip HIV testing because shared equipment matters only after age 65" is not the best choice because Injection drug use is an increased-risk reason both under 15 and over 65. It is not limited to older adults.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '97145d11018e31cb37eb1cc2995086eca780976ef1ff8051e53a778b79e6982d', false, NOW(), NOW(), 4,
  'hiv-screen-age-14-injection-drug-use', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for HIV Infection.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hiv-screen-age-14-injection-drug-use', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-250", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210251', 'usmle-step-2', 'ethics',
  $sc$A 67-year-old woman who works as a manuscript cataloger is seen in the staff health office for an annual visit after cataloging a map donation. She has been married for 40 years to one partner, has never injected drugs, and has no history of a genital infection. She takes hydrochlorothiazide 25 mg daily for long-standing pressure elevation. Temperature is 36.4°C, pulse is 68/min, respirations are 14/min, and blood pressure is 136/78 mm Hg. Body mass index is 27 kg/m2. Creatinine last week was 0.9 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Do not offer routine HIV testing based on age alone when no increased risk is present", "Offer HIV testing because universal screening continues unchanged after age 65 during today's visit", "Offer HIV testing yearly from 65 to 79 even when no risk is reported", "Defer the decision until age 85, when testing becomes automatic", "Offer HIV testing only because she takes a blood-pressure tablet"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hiv-no-routine-screen-age-67", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not offer routine HIV testing based on age alone when no increased risk is present$ky$,
  $ex$After age 65, HIV testing is offered only if risk is increased. She is 67, with one long-term partner, no injection drug use, and no other stated risk. "Offer HIV testing because universal screening continues unchanged after age 65 during today's visit" is not the best choice because Universal screening stops at 65. It does not continue unchanged afterward. "Offer HIV testing yearly from 65 to 79 even when no risk is reported" is not the best choice because No yearly schedule from 65 to 79 is stated. Over 65, the question is whether risk is increased. "Defer the decision until age 85, when testing becomes automatic" is not the best choice because Age 85 is not a start age for automatic HIV testing. Over 65, testing follows increased risk. "Offer HIV testing only because she takes a blood-pressure tablet" is not the best choice because A blood-pressure medicine is not one of the increased-risk reasons. Those reasons include injection drug use, a partner with HIV, condomless sex with more than one partner of unknown status, transactional sex, and another sexually transmitted infection.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '5e37532c1fc34dd6248c90c1d3fc2cd7cd24bb52a525c69740df32b27f1c55fb', false, NOW(), NOW(), 3,
  'hiv-no-routine-screen-age-67', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for HIV Infection.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hiv-no-routine-screen-age-67', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-251", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210252', 'usmle-step-2', 'ethics',
  $sc$A 72-year-old man who works as a piano tuner is seen in the urology clinic for follow-up of a treated genital infection. A urine nucleic acid test 2 weeks ago detected Chlamydia trachomatis, and he finished the prescribed tablets. He has not injected drugs. He has had two partners in the past year. Temperature is 36.6°C, pulse is 70/min, respirations are 15/min, and blood pressure is 132/76 mm Hg. He weighs 81 kg. The genital examination today shows no ulcer and no discharge.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Do not offer HIV testing, because testing stops at 65 no matter what other infections occurred", "Offer HIV testing because another sexually transmitted infection is increased risk after 65", "Offer HIV testing only if a partner is already known to have that virus today", "Defer HIV testing until age 79, when some birth-year rule is said to begin", "Skip HIV testing because he already completed treatment for the detected organism"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hiv-screen-age-72-after-another-sti", "taskCategory": "health-maintenance"}$op$,
  $ky$Offer HIV testing because another sexually transmitted infection is increased risk after 65$ky$,
  $ex$Over 65, testing is offered if risk is increased. Another sexually transmitted infection is one of those reasons. He is 72 and Chlamydia trachomatis was detected 2 weeks ago. "Do not offer HIV testing, because testing stops at 65 no matter what other infections occurred" is not the best choice because Age over 65 removes universal screening. It does not forbid testing when risk is increased. "Offer HIV testing only if a partner is already known to have that virus today" is not the best choice because A partner with HIV is a separate increased-risk reason. Another sexually transmitted infection is already enough. "Defer HIV testing until age 79, when some birth-year rule is said to begin" is not the best choice because Age 79 is not an HIV testing threshold. The relevant ages are 15 to 65 for universal screening and over 65 when risk is increased. "Skip HIV testing because he already completed treatment for the detected organism" is not the best choice because Finishing treatment for the other infection does not erase it as a marker of increased risk for HIV testing.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '39aee5111c47c4b3de0cffbe9754a9b94c1e522ec0df2b664c6b856027420fbd', false, NOW(), NOW(), 4,
  'hiv-screen-age-72-after-another-sti', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for HIV Infection.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hiv-screen-age-72-after-another-sti', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-252", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210253', 'usmle-step-2', 'ethics',
  $sc$A 38-year-old man who works as a map librarian is seen in the specialty clinic to review laboratory results before a new relationship. He has taken his current treatment for 2 years and does not miss doses. He asks whether sex can pass the virus to a partner. He has no fever and no new rash. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. Plasma HIV-1 RNA drawn 2 weeks ago is below the assay limit, matching the earlier results on this treatment.$sc$,
  $qu$Which of the following is the most appropriate counseling?$qu$,
  $op${"options": ["Tell him treatment does not change the chance of passing the virus to a partner at this encounter", "Name one branded pill as the only treatment that affects partner transmission", "Tell him linked sexual transmission has not been observed while the virus is suppressed", "Tell him this reassurance starts only after he turns 65 years of age", "Advise him to stop treatment before sex so the laboratory result can rise"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hiv-suppressed-rna-linked-transmission", "taskCategory": "communication"}$op$,
  $ky$Tell him linked sexual transmission has not been observed while the virus is suppressed$ky$,
  $ex$When treatment suppresses the virus, linked sexual transmission has not been observed. His plasma HIV-1 RNA is below the assay limit on treatment. "Tell him treatment does not change the chance of passing the virus to a partner at this encounter" is not the best choice because Early treatment reduces transmission. Saying treatment does not change partner transmission contradicts that. "Name one branded pill as the only treatment that affects partner transmission" is not the best choice because No antiretroviral drug name is required for this counseling. Do not invent one. "Tell him this reassurance starts only after he turns 65 years of age" is not the best choice because Age 65 is a screening boundary, not a requirement for this transmission statement. "Advise him to stop treatment before sex so the laboratory result can rise" is not the best choice because Stopping treatment would remove suppression. The reassuring observation applies when treatment keeps the virus suppressed.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "communication"]$tg$,
  's2-new-20261121-hidden', '1b170a48ebd1278091f881162f4a7f8ea624ba0ea0faae78a87e756fafbb314d', false, NOW(), NOW(), 2,
  'hiv-suppressed-rna-linked-transmission', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for HIV Infection.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening"}]$rf$::jsonb,
  'step2', false,
  'communication', 'hiv-suppressed-rna-linked-transmission', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-253", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/human-immunodeficiency-virus-hiv-infection-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210254', 'usmle-step-2', 'ethics',
  $sc$A 42-year-old woman who works as a ceramicist is seen in the community health office after a friend said only one birth cohort needs a blood test. She was born in 1984, has never injected drugs, and has no symptoms. She takes no medicines. She glazes pottery 4 days a week and feels well. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Body mass index is 26 kg/m2. Alanine aminotransferase last year was 22 U/L.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Do not test her, because one-time testing is limited to births from 1945 through 1965", "Test her only if alanine aminotransferase stays above 22 U/L", "Defer antibody testing until she is 79, then test every year", "Offer a one-time hepatitis C antibody test even though she was born after 1965", "Start antiviral treatment today without an antibody or an RNA test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hcv-screen-outside-birth-cohort", "taskCategory": "health-maintenance"}$op$,
  $ky$Offer a one-time hepatitis C antibody test even though she was born after 1965$ky$,
  $ex$She is 42, born in 1984, which is after 1965. Asymptomatic adults 18 to 79 are screened once with a hepatitis C antibody test. The old birth-cohort limit does not exclude her. "Do not test her, because one-time testing is limited to births from 1945 through 1965" is not the best choice because Birth-cohort-only testing of people born from 1945 through 1965 has been replaced. Adults 18 to 79 are screened once. "Test her only if alanine aminotransferase stays above 22 U/L" is not the best choice because A normal or abnormal liver enzyme is not the entry rule. Asymptomatic adults 18 to 79 are offered a one-time antibody test. Her result of 22 U/L does not set a cutoff. "Defer antibody testing until she is 79, then test every year" is not the best choice because Age 79 is the upper end of routine one-time screening, not the age when screening starts, and no yearly schedule is stated. "Start antiviral treatment today without an antibody or an RNA test" is not the best choice because Treatment is not started from no test at all, and it is not started from an antibody result alone. The first step in range is an antibody test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '1f06a66cd691590ac5959aba79ee6f14c40e6d632f3560f4a29674675b050b65', false, NOW(), NOW(), 3,
  'hcv-screen-outside-birth-cohort', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Hepatitis C Virus Infection in Adolescents and Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hcv-screen-outside-birth-cohort', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-254", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210255', 'usmle-step-2', 'ethics',
  $sc$A 23-year-old man who works as a resident advisor is seen in the university health service for a welcome visit at the start of graduate school. He has never injected drugs, has no abdominal pain, and takes a daily multivitamin. He rows on a club crew 3 mornings a week. He asks whether he is too young for a one-time blood test. Temperature is 36.6°C, pulse is 64/min, respirations are 13/min, and blood pressure is 110/68 mm Hg. Body mass index is 22 kg/m2. He drinks about 2 alcoholic drinks on weekends.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Defer hepatitis C antibody testing until age 45", "Offer the antibody test only because he drinks 2 alcoholic drinks", "Skip antibody testing because he was not born from 1945 through 1965", "Reserve the antibody test for people who inject drugs at any adult age in the office today", "Offer a one-time hepatitis C antibody test because he is between 18 and 79"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hcv-screen-age-23-once", "taskCategory": "health-maintenance"}$op$,
  $ky$Offer a one-time hepatitis C antibody test because he is between 18 and 79$ky$,
  $ex$Asymptomatic adults 18 to 79 are screened once with a hepatitis C antibody test. He is 23 and has no symptoms. "Defer hepatitis C antibody testing until age 45" is not the best choice because Age 45 is not the start of this screen. Routine one-time antibody testing covers adults 18 to 79. "Offer the antibody test only because he drinks 2 alcoholic drinks" is not the best choice because Alcohol use is not the indication. Age 23 is already inside 18 to 79. "Skip antibody testing because he was not born from 1945 through 1965" is not the best choice because Limiting testing to births from 1945 through 1965 is the old approach that this recommendation replaces. "Reserve the antibody test for people who inject drugs at any adult age in the office today" is not the best choice because Injection drug use is a reason to consider testing under 18 or over 79. Inside 18 to 79, asymptomatic adults are screened once without that requirement.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'ce0eae0d2637eb820bf219df37d6d3972d53691e4b6eece3360fa382eee46fc7', false, NOW(), NOW(), 1,
  'hcv-screen-age-23-once', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Hepatitis C Virus Infection in Adolescents and Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hcv-screen-age-23-once', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-255", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210256', 'usmle-step-2', 'ethics',
  $sc$A 90-year-old woman who works as a quilting instructor is seen in the home-visit practice for a routine visit in her apartment. She has never injected drugs. She has no jaundice and no abdominal pain. She takes calcium with vitamin D and walks the hallway twice a day, about 20 minutes in total. Temperature is 36.4°C, pulse is 66/min, respirations are 16/min, and blood pressure is 138/70 mm Hg. Body mass index is 23 kg/m2. She lives alone and cooks her own meals.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Do not offer routine one-time antibody testing based on age when she has not injected drugs", "Offer one-time antibody testing because routine screening extends through age 90", "Offer hepatitis C antibody testing every year from age 79 onward", "Start antiviral tablets from age alone, without an antibody or RNA test", "Offer the test only if she was born from 1945 through 1965, then treat immediately at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hcv-no-routine-screen-age-90", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not offer routine one-time antibody testing based on age when she has not injected drugs$ky$,
  $ex$Routine one-time antibody screening covers asymptomatic adults 18 to 79. She is 90 and has not injected drugs, so routine screening is not indicated. "Offer one-time antibody testing because routine screening extends through age 90" is not the best choice because Age 90 is over 79. Routine screening does not extend through 90. "Offer hepatitis C antibody testing every year from age 79 onward" is not the best choice because No yearly antibody schedule after 79 is stated. Over 79, injection drug use is the reason to consider testing. "Start antiviral tablets from age alone, without an antibody or RNA test" is not the best choice because Age is not a reason to start treatment, and treatment is not started without testing. Over 79, even testing is considered when the person injects drugs. "Offer the test only if she was born from 1945 through 1965, then treat immediately at the present visit" is not the best choice because Birth years 1945 through 1965 are the old cohort limit, which no longer defines the screen. Treatment is not started from a birth year.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'eb988f67123dc7dcec6bfca6eb0f9fd5fe5e497821ccbdb1558856f253079e53', false, NOW(), NOW(), 3,
  'hcv-no-routine-screen-age-90', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Hepatitis C Virus Infection in Adolescents and Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hcv-no-routine-screen-age-90', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-256", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210257', 'usmle-step-2', 'ethics',
  $sc$A 92-year-old man who works as a woodworker is seen in the opioid treatment program while being seen for a buprenorphine refill. He still injects heroin on most weekends and shared a syringe 3 days ago. He has no jaundice. The buprenorphine dose is 8 mg twice daily. He lives with his daughter. Temperature is 36.7°C, pulse is 78/min, respirations are 16/min, and blood pressure is 142/74 mm Hg. He weighs 68 kg. There are fresh puncture marks on the right forearm.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Do not consider antibody testing, because age over 79 closes the question", "Consider antibody testing because he injects drugs and is over 79", "Start antiviral treatment today because he shared a syringe 3 days ago", "Limit testing to people born from 1945 through 1965 and skip him", "Repeat a birth-cohort test every 8 mg of his current dose"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hcv-consider-screen-age-92-injection", "taskCategory": "health-maintenance"}$op$,
  $ky$Consider antibody testing because he injects drugs and is over 79$ky$,
  $ex$Under 18 or over 79, screening is considered if the person injects drugs. He is 92 and injects heroin, so antibody testing is considered. "Do not consider antibody testing, because age over 79 closes the question" is not the best choice because Over 79, testing is not routine, but it is considered when the person injects drugs. Age alone does not close that question. "Start antiviral treatment today because he shared a syringe 3 days ago" is not the best choice because Sharing equipment is a reason to consider screening. It is not a reason to start treatment with no antibody result and no confirmatory RNA test. "Limit testing to people born from 1945 through 1965 and skip him" is not the best choice because The birth-cohort-only rule from 1945 through 1965 has been replaced and does not decide this case. Injection drug use over age 79 is the relevant reason. "Repeat a birth-cohort test every 8 mg of his current dose" is not the best choice because The 8 mg buprenorphine dose is not a screening interval. No such schedule is part of this recommendation.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '52ef1c6aad6f79df5d1600d250ec68bd87f4d401bbb9bb989607743a51ec3ccd', false, NOW(), NOW(), 3,
  'hcv-consider-screen-age-92-injection', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Hepatitis C Virus Infection in Adolescents and Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hcv-consider-screen-age-92-injection', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-257", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210258', 'usmle-step-2', 'ethics',
  $sc$A 17-year-old girl who works as a soccer referee is seen in the pediatric adolescent clinic for a camp form and a vaccine check. She has never injected drugs. She does not drink alcohol. She plays midfield 5 days a week and has no abdominal pain. Her parents are in the waiting room. Temperature is 36.6°C, pulse is 74/min, respirations are 15/min, and blood pressure is 106/64 mm Hg. Body mass index is 21 kg/m2. She takes no daily medicine.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Offer one-time antibody testing because every teenager is inside the adult range", "Start antiviral treatment because she is under 18 and plays contact sports", "Do not offer routine antibody testing at 17 when she has not injected drugs", "Offer antibody testing only if she was born from 1945 through 1965", "Defer all decisions until age 79 and do not record a reason"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hcv-no-routine-screen-age-17", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not offer routine antibody testing at 17 when she has not injected drugs$ky$,
  $ex$Under 18, screening is considered if the person injects drugs. She is 17 and has not injected drugs, so routine antibody testing is not indicated. "Offer one-time antibody testing because every teenager is inside the adult range" is not the best choice because Routine one-time screening starts at 18. A 17-year-old is not in that universal adult range. "Start antiviral treatment because she is under 18 and plays contact sports" is not the best choice because Sports do not start treatment. Treatment is not begun without an antibody test and confirmatory RNA testing. "Offer antibody testing only if she was born from 1945 through 1965" is not the best choice because She was not born from 1945 through 1965, and that old cohort rule is not the current screen. The current issue is that she is under 18 without injection drug use. "Defer all decisions until age 79 and do not record a reason" is not the best choice because Age 79 is the top of the routine adult range, not a reason to postpone the reasoning. Under 18, the question is injection drug use.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'e379e5ef729e97a059ed1f0d68a5faecdd157c2cc6c778d15641df6dead5e4b2', false, NOW(), NOW(), 2,
  'hcv-no-routine-screen-age-17', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Hepatitis C Virus Infection in Adolescents and Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hcv-no-routine-screen-age-17', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-258", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210259', 'usmle-step-2', 'ethics',
  $sc$A 16-year-old boy who works as a skate-shop clerk is seen in the teen recovery program for an intake examination. He reports injecting methamphetamine daily for 5 months and last shared equipment 9 days ago. He has no jaundice and no right-upper-quadrant pain. A counselor is in the room. Temperature is 36.8°C, pulse is 82/min, respirations are 16/min, and blood pressure is 112/70 mm Hg. He weighs 61 kg. The skin of both antecubital fossae shows recent punctures.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Refuse antibody testing until his 18th birthday despite daily injection", "Start treatment from the injection history without drawing an antibody", "Apply a 1945-to-1965 birth rule and do not test adolescents who inject", "Consider antibody testing because he is under 18 and injects drugs", "Offer testing only after age 79 if he is still injecting then"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hcv-consider-screen-age-16-injection", "taskCategory": "health-maintenance"}$op$,
  $ky$Consider antibody testing because he is under 18 and injects drugs$ky$,
  $ex$Under 18, screening is considered if the person injects drugs. He is 16 and injects methamphetamine, so antibody testing is considered. "Refuse antibody testing until his 18th birthday despite daily injection" is not the best choice because The 18th birthday starts routine screening of asymptomatic adults. Under 18, injection drug use is already a reason to consider testing. "Start treatment from the injection history without drawing an antibody" is not the best choice because Injection history is not treatment. An antibody test comes first, and a positive antibody still needs confirmatory RNA testing before treatment. "Apply a 1945-to-1965 birth rule and do not test adolescents who inject" is not the best choice because Birth years 1945 through 1965 do not decide testing for a 16-year-old who injects drugs. That cohort limit has been replaced. "Offer testing only after age 79 if he is still injecting then" is not the best choice because Over 79, injection drug use is also a reason to consider testing. It does not mean a 16-year-old who injects must wait until 79.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '1a1fcc8725c577024b42a418393b9ff87c5c02110eb0d93eb959cd3cb5d4bb7f', false, NOW(), NOW(), 4,
  'hcv-consider-screen-age-16-injection', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Hepatitis C Virus Infection in Adolescents and Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hcv-consider-screen-age-16-injection', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-259", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210260', 'usmle-step-2', 'ethics',
  $sc$A 29-year-old woman who works as a doula is seen in the obstetric office for a routine prenatal visit. She is at 22 weeks of gestation and says her mood is good. She has no history of a mood disorder and no family history of one. She sleeps 7 hours a night and looks forward to work. Temperature is 36.6°C, pulse is 84/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. The fetal heart rate is 146/min. She takes a prenatal vitamin only.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Skip mood screening because she reports no risk factors and feels well", "Limit depression screening to people who are age 65 or older", "Replace mood screening with a required routine screen for a plan to die before the patient leaves", "Defer mood screening until after delivery because pregnancy is excluded", "Screen for depression in this pregnancy even though no risk factor is present"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "depression-screen-pregnancy-no-risk", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression in this pregnancy even though no risk factor is present$ky$,
  $ex$Depression screening is grade B for adults, including during pregnancy, even when no risk factor is present. She is 29 and at 22 weeks. "Skip mood screening because she reports no risk factors and feels well" is not the best choice because Depression screening is recommended for adults even without risk factors. Feeling well does not remove it. "Limit depression screening to people who are age 65 or older" is not the best choice because Age 65 and older is included. It is not the only group. Pregnant adults are included as well. "Replace mood screening with a required routine screen for a plan to die before the patient leaves" is not the best choice because Routine screening for suicide risk is an I statement. It does not replace depression screening, which is a grade B recommendation. "Defer mood screening until after delivery because pregnancy is excluded" is not the best choice because Pregnancy is specifically included in the grade B depression-screening recommendation. It is not a reason to wait until after delivery.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '2b2c8932bb86a339e61e97db17f3a12416359406d3e8587becfed9d9b8462fdb', false, NOW(), NOW(), 2,
  'depression-screen-pregnancy-no-risk', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'depression-screen-pregnancy-no-risk', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-260", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210261', 'usmle-step-2', 'ethics',
  $sc$A 28-year-old woman who works as a lactation counselor is seen in the postpartum clinic for a visit 5 weeks after an uncomplicated birth. She says she feels like herself, is bonding with the infant, and has no tearfulness. There is no personal or family history of a mood disorder. The infant is feeding every 3 hours. Temperature is 36.7°C, pulse is 80/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. She weighs 70 kg. The uterus is not palpable above the pubic symphysis.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Screen for depression at this postpartum visit even without risk factors", "Skip mood screening because 5 weeks after birth is outside the recommendation", "Skip depression screening because she already feels like herself today", "Order only a routine suicide-risk screen, which carries the grade B recommendation", "Wait until age 65 to begin any depression screening at all"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "depression-screen-postpartum-no-risk", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression at this postpartum visit even without risk factors$ky$,
  $ex$Depression screening is grade B for adults, including the postpartum period, even when no risk factor is present. She is 5 weeks after birth. "Skip mood screening because 5 weeks after birth is outside the recommendation" is not the best choice because The postpartum period is included. Five weeks after birth is not outside the recommendation. "Skip depression screening because she already feels like herself today" is not the best choice because Absence of symptoms and absence of risk factors do not cancel grade B depression screening. "Order only a routine suicide-risk screen, which carries the grade B recommendation" is not the best choice because Routine suicide-risk screening is an I statement, not the grade B recommendation. The grade B recommendation is depression screening. "Wait until age 65 to begin any depression screening at all" is not the best choice because Screening is not delayed until 65. Adults, including postpartum adults, are screened even without risk factors.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'fd271fcca90e0584b27047aecd6226ba6bebbb53bdf5619d841b68cae2efd06e', false, NOW(), NOW(), 2,
  'depression-screen-postpartum-no-risk', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'depression-screen-postpartum-no-risk', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-261", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210262', 'usmle-step-2', 'ethics',
  $sc$A 74-year-old man who works as a crossing guard is seen in the senior center clinic for a welcome-to-Medicare style preventive visit. He enjoys the morning shift at a school crossing, sleeps well, and denies sadness. He has no prior mood diagnosis. He takes lisinopril 10 mg daily and walks his dog 30 minutes a day. Temperature is 36.5°C, pulse is 62/min, respirations are 14/min, and blood pressure is 134/76 mm Hg. Body mass index is 25 kg/m2. He scored 28 of 30 on a brief memory check last year.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Stop mood screening after 65 because only pregnancy remains included at this encounter", "Screen for depression even though he is 74 and reports no risk factors", "Skip mood screening unless he volunteers a plan to end his life", "Substitute routine suicide-risk screening as the grade B service", "Defer mood screening until a family history is documented"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "depression-screen-age-74-no-risk", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen for depression even though he is 74 and reports no risk factors$ky$,
  $ex$Depression screening is grade B for adults age 65 and older even without risk factors. He is 74 and has none reported. "Stop mood screening after 65 because only pregnancy remains included at this encounter" is not the best choice because Age 65 and older is included in depression screening. Pregnancy is included too, but it is not the only remaining group. "Skip mood screening unless he volunteers a plan to end his life" is not the best choice because A volunteered plan needs clinical care. That is separate from routine depression screening, which is still recommended when no such plan is reported. "Substitute routine suicide-risk screening as the grade B service" is not the best choice because Routine suicide-risk screening is an I statement. Depression screening is the grade B recommendation. "Defer mood screening until a family history is documented" is not the best choice because No risk factor, including family history, is required before depression screening in an older adult.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'bb4d59c5e8cf92e1bec6e6feb2e5f2f6c5eb6118ae2047eb7f0047bc2f593bd1', false, NOW(), NOW(), 2,
  'depression-screen-age-74-no-risk', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'depression-screen-age-74-no-risk', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-262", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210263', 'usmle-step-2', 'ethics',
  $sc$A 58-year-old man who works as a payroll clerk is seen in the employee health service for a scheduled preventive examination. He has no mood symptoms, sleeps 7 hours, and has not described a plan or a wish to end his life. He manages payroll for 40 employees and takes atorvastatin 20 mg at bedtime. He came alone. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 124/78 mm Hg. Body mass index is 28 kg/m2. A fasting glucose last month was 94 mg/dL.$sc$,
  $qu$Which of the following best describes routine screening for a plan to end one's life in a person like him?$qu$,
  $op${"options": ["It is a grade B recommendation for every adult at every preventive visit", "An I statement means the clinician must not ask if he later volunteers such a plan during today's visit", "It is an I statement on routine screening of people without signs, not a firm grade", "It replaces depression screening, which is not recommended at his age of 58", "It becomes mandatory only after age 65 and is forbidden at every younger age"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "suicide-risk-screen-i-statement-no-signs", "taskCategory": "interpretation"}$op$,
  $ky$It is an I statement on routine screening of people without signs, not a firm grade$ky$,
  $ex$Suicide-risk screening is an I statement. It concerns routine screening of people without signs. It is not a recommendation for or against that routine screen. He reports no signs. "It is a grade B recommendation for every adult at every preventive visit" is not the best choice because Grade B is the recommendation for depression screening. Routine suicide-risk screening is an I statement, not grade B. "An I statement means the clinician must not ask if he later volunteers such a plan during today's visit" is not the best choice because An I statement is not an instruction to avoid asking if a patient volunteers thoughts of suicide. This man has not volunteered any, and the I statement is about routine screening. "It replaces depression screening, which is not recommended at his age of 58" is not the best choice because Depression screening remains grade B for adults, including at age 58. The I statement does not cancel it or replace it. "It becomes mandatory only after age 65 and is forbidden at every younger age" is not the best choice because The I statement is not an age switch at 65. Depression screening, which is separate, includes adults age 65 and older.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "interpretation"]$tg$,
  's2-new-20261121-hidden', '715087a217f4a897637e7ed5593b3f96d40e234d5b5751dc3e8685010bfb366c', false, NOW(), NOW(), 4,
  'suicide-risk-screen-i-statement-no-signs', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'suicide-risk-screen-i-statement-no-signs', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-263", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210264', 'usmle-step-2', 'ethics',
  $sc$A 46-year-old man who works as a night security officer is seen in the crisis walk-in clinic brought in by his sister after a frightening conversation. He says he will end his life tonight, names hanging as the method, and says the rope is in his apartment closet. He has not eaten since yesterday morning. His sister found a note on the kitchen table. Temperature is 37.1°C, pulse is 108/min, respirations are 18/min, and blood pressure is 148/90 mm Hg. He is awake and oriented to person, place, and the date. A fingerstick glucose is 102 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Send him home because routine screening research is an I statement", "Schedule a routine mood questionnaire at the next wellness visit in 1 year", "Tell him evidence is insufficient, so no clinical response is allowed", "Arrange clinical care now for the stated plan to end his life tonight", "Document that age 46 excludes any response to a volunteered plan"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "volunteered-plan-needs-clinical-care", "taskCategory": "clinical-intervention"}$op$,
  $ky$Arrange clinical care now for the stated plan to end his life tonight$ky$,
  $ex$A person who reports a plan needs clinical care. He has named the method, the means, and tonight as the time. That is not a decision that evidence is insufficient. "Send him home because routine screening research is an I statement" is not the best choice because The I statement is about routine screening of people without signs. It is not a reason to send home a person who has already stated a plan. "Schedule a routine mood questionnaire at the next wellness visit in 1 year" is not the best choice because A plan for tonight cannot wait for a wellness visit in 1 year. He needs clinical care now. "Tell him evidence is insufficient, so no clinical response is allowed" is not the best choice because Insufficient evidence applies to routine screening of people without signs. It does not mean a volunteered plan gets no care. "Document that age 46 excludes any response to a volunteered plan" is not the best choice because Age 46 is inside adult care. No age exclusion cancels care for a volunteered plan.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'ba98704090a03dbb78bda5219fd98dfec86584535f14cb448d7440de85b2013d', false, NOW(), NOW(), 3,
  'volunteered-plan-needs-clinical-care', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'volunteered-plan-needs-clinical-care', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-264", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-adults", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210265', 'usmle-step-2', 'ethics',
  $sc$A 19-year-old woman who works as a choir section leader is seen in the adolescent gynecology clinic asking for the test her older friends have had. She has been sexually active for 3 years, with 2 partners in the past year. She has never had a cytology test. She takes an oral contraceptive with 0.02 mg of estrogen and has regular menses. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. Body mass index is 22 kg/m2. The pelvic examination shows no visible lesion.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Start cytology now because she has been sexually active for 3 years", "Start cytology now because she has had 2 partners in the past year", "Start cotesting now and repeat it every year until age 21", "Start screening at this visit and let her choose any of 3 strategies", "Do not screen the cervix at age 19, even with sexual activity"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "cervix-no-screen-age-19", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not screen the cervix at age 19, even with sexual activity$ky$,
  $ex$Cervical screening is not recommended under age 21. This is a grade D recommendation. She is 19. "Start cytology now because she has been sexually active for 3 years" is not the best choice because Sexual activity for 3 years does not override the recommendation against screening under 21. "Start cytology now because she has had 2 partners in the past year" is not the best choice because Two partners do not move a 19-year-old into screening. Screening is not recommended under 21. "Start cotesting now and repeat it every year until age 21" is not the best choice because Cotesting is not started under 21, and no yearly cotest schedule is the recommendation for this age. "Start screening at this visit and let her choose any of 3 strategies" is not the best choice because Choice among 3 strategies applies at ages 30 to 65, and only once screening is indicated. She is 19, so screening is not started.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '7e9c0439df1a98d8864376bbabba47323e6c8a93d34462ac26906ac2b11d1af4', false, NOW(), NOW(), 1,
  'cervix-no-screen-age-19', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervix-no-screen-age-19', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-265", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210266', 'usmle-step-2', 'ethics',
  $sc$A 66-year-old woman who works as a court reporter is seen in the women's health practice to ask whether another cervix test is due. Cytology was negative 9 years ago, 5 years ago, and 2 years ago. Records show no high-grade cervical lesion and no cancer of the cervix. She has had no new partner. The uterus and cervix are present. Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 128/74 mm Hg. Body mass index is 26 kg/m2. She takes calcium 600 mg twice daily.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Stop screening: 3 negative cytology tests in 10 years, latest within 5 years", "Continue screening because a new partner is required before any stop is allowed", "Continue yearly cytology because stopping is not allowed until age 75", "Stop only if she also has 2 negative cotests, regardless of the cytology record", "Restart a 20-year clock because every person over 65 keeps screening"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "cervix-stop-age-66-three-cytology", "taskCategory": "health-maintenance"}$op$,
  $ky$Stop screening: 3 negative cytology tests in 10 years, latest within 5 years$ky$,
  $ex$Screening can stop after 65 when prior screening was adequate and there is no high-risk history. Three negative cytology tests in 10 years, the latest within 5 years, meet that cytology standard. Hers were 9, 5, and 2 years ago, and she has no high-grade history. "Continue screening because a new partner is required before any stop is allowed" is not the best choice because A new partner does not decide the stop. She does not have a new partner, and the cytology record already meets the stop standard. "Continue yearly cytology because stopping is not allowed until age 75" is not the best choice because Age 75 is not the stop age. After 65, adequate prior screening is what allows stopping. Yearly cytology is not required by this record. "Stop only if she also has 2 negative cotests, regardless of the cytology record" is not the best choice because Two negative cotests are an alternate way to show adequate screening. They are not required when 3 negative cytology tests already qualify. "Restart a 20-year clock because every person over 65 keeps screening" is not the best choice because The 20-year interval applies after a high-grade lesion. She has no such history, so that clock is not started. Adequate negative screening allows stopping after 65.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'edfaf4ee02fe4e2401becb68f88c2ebb18c7bd614c3cf90794af7dcaaabcef03', false, NOW(), NOW(), 3,
  'cervix-stop-age-66-three-cytology', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervix-stop-age-66-three-cytology', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-266", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210267', 'usmle-step-2', 'ethics',
  $sc$A 67-year-old woman who works as a landscape designer is seen in the gynecology clinic with a folder of old laboratory reports. Three cytology tests were negative, performed 9 years ago, 7 years ago, and 6 years ago. She has no high-grade cervical lesion on record and no new partner. She had a normal mammogram last year and takes lisinopril 5 mg daily. Temperature is 36.4°C, pulse is 72/min, respirations are 15/min, and blood pressure is 130/76 mm Hg. Body mass index is 29 kg/m2. The cervix is present on examination.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Stop today because any 3 negative cytology tests are enough after age 65", "Do not stop, because the latest of the 3 negative cytology tests was not within 5 years", "Stop today because absence of a new partner replaces the 5-year requirement", "Stop because the grade D rule used under age 21 also ends screening after 65 in the office today", "Treat this cytology record as 2 negative cotests and stop today"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "cervix-continue-latest-cytology-6-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not stop, because the latest of the 3 negative cytology tests was not within 5 years$ky$,
  $ex$Stopping after 65 requires adequate prior screening. For cytology, that is 3 negatives in 10 years with the latest within 5 years. Her latest test was 6 years ago, so screening should not stop. "Stop today because any 3 negative cytology tests are enough after age 65" is not the best choice because Three negative cytology tests must fall in 10 years, and the latest must be within 5 years. The count alone is not enough. "Stop today because absence of a new partner replaces the 5-year requirement" is not the best choice because A new partner does not restart screening after an adequate stop, and it does not relax the requirement that the latest test be within 5 years. This record is not an adequate stop. "Stop because the grade D rule used under age 21 also ends screening after 65 in the office today" is not the best choice because Grade D is the recommendation against screening under 21. It does not erase the requirement that, after 65, the latest of 3 negative cytology tests be within 5 years. "Treat this cytology record as 2 negative cotests and stop today" is not the best choice because Two negative cotests are a different standard. These 3 results are cytology tests, and the latest is too old for the cytology stop rule.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c7a5135bb9d489b48a400934176185fd5d79dc3440d7bf543334447cd8ad5b35', false, NOW(), NOW(), 4,
  'cervix-continue-latest-cytology-6-years', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervix-continue-latest-cytology-6-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-267", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210268', 'usmle-step-2', 'ethics',
  $sc$A 68-year-old woman who works as a museum docent is seen in the women's preventive clinic after starting a new relationship 4 months ago. Negative cotests were recorded 8 years ago and 3 years ago. She has no high-grade cervical lesion and no cancer of the cervix. The new partner is her first new partner in 12 years. The cervix is present. Temperature is 36.5°C, pulse is 66/min, respirations are 14/min, and blood pressure is 126/72 mm Hg. Body mass index is 24 kg/m2. She takes vitamin D 1000 units daily.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Resume yearly cytology because a new partner cancels a prior stop", "Obtain one more cotest now, then stop again if it is negative", "Do not restart screening; a new partner does not undo an adequate stop after 65", "Restart screening and keep it going for at least 20 more years because of the new partner", "Apply the under-21 grade D rule and stop discussing the record"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "cervix-new-partner-does-not-restart", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not restart screening; a new partner does not undo an adequate stop after 65$ky$,
  $ex$She is 68, with 2 negative cotests in 10 years and the latest within 5 years, and she has no high-risk history. That is an adequate stop. A new partner 4 months ago does not restart screening. "Resume yearly cytology because a new partner cancels a prior stop" is not the best choice because A new partner does not restart cervical screening after an adequate stop. Yearly cytology is not required. "Obtain one more cotest now, then stop again if it is negative" is not the best choice because Another cotest is not required to re-qualify a stop that already meets the standard. The new partner does not reopen it. "Restart screening and keep it going for at least 20 more years because of the new partner" is not the best choice because The 20-year interval follows a high-grade lesion, not a new partner. She has no high-grade history. "Apply the under-21 grade D rule and stop discussing the record" is not the best choice because Grade D is the recommendation against screening under 21. She is 68, and that grade does not change the finding that a new partner does not restart an adequate stop.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '026216cb9e0a530a010be16a5ffdcf855883c717492379d8ef2a351fdc97b42d', false, NOW(), NOW(), 3,
  'cervix-new-partner-does-not-restart', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervix-new-partner-does-not-restart', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-268", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210269', 'usmle-step-2', 'ethics',
  $sc$A 49-year-old woman who works as a hotel housekeeper is seen in the surgical follow-up clinic 4 years after surgery for bleeding fibroids. The operative note says the uterus and cervix were both removed. Pathology showed leiomyomas and no CIN2 or higher lesion. She has had no cytology since the surgery. She lifts laundry carts that weigh about 15 kg. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. Body mass index is 31 kg/m2. The vaginal cuff is healed and no cervix is seen.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Start cotesting now because she is between ages 30 and 65", "Screen yearly for the next 20 years because surgery counts as a high-grade lesion during today's visit", "Offer a choice among the 3 accepted screening strategies at this visit", "Do not screen, because the cervix was removed and there was no CIN2 or higher lesion", "Resume screening at age 65 if she has a new partner before then"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "cervix-hysterectomy-cervix-removed", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not screen, because the cervix was removed and there was no CIN2 or higher lesion$ky$,
  $ex$After hysterectomy with the cervix removed and no history of CIN2 or higher or of cancer, cervical screening is not done. She is 49 and the pathology showed no CIN2 or higher lesion. "Start cotesting now because she is between ages 30 and 65" is not the best choice because Ages 30 to 65 are screened when a cervix is present and stopping rules do not apply. Her cervix was removed. "Screen yearly for the next 20 years because surgery counts as a high-grade lesion during today's visit" is not the best choice because Fibroids are not a high-grade lesion. The 20-year interval applies after a high-grade lesion, which pathology did not show. "Offer a choice among the 3 accepted screening strategies at this visit" is not the best choice because A choice among 3 strategies applies when screening is indicated. Screening is not indicated after the cervix is removed without CIN2 or higher. "Resume screening at age 65 if she has a new partner before then" is not the best choice because A new partner does not restart screening after an adequate reason to stop, and it does not create screening at 65 when the cervix is absent and there was no high-grade lesion.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '4815203f3f43db5775eea357516f712268cf3db0dcbaa5c106156a1254513c4c', false, NOW(), NOW(), 2,
  'cervix-hysterectomy-cervix-removed', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervix-hysterectomy-cervix-removed', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-269", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210270', 'usmle-step-2', 'ethics',
  $sc$A 66-year-old woman who works as a violin restorer is seen in the colposcopy clinic with records from a treatment 16 years ago. A high-grade cervical lesion was treated 16 years ago. Cytology since then was negative 8 years ago, 4 years ago, and 2 years ago. She has had no new partner and no hysterectomy. She works 8 hours a day at a bench. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 124/70 mm Hg. Body mass index is 23 kg/m2. The cervix is present and looks healed.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Stop now because she is over 65 and the last 3 cytology tests were negative", "Stop now because the latest cytology was within 5 years and she has no new partner during today's visit", "Stop now because 16 years is longer than the 10-year cytology window", "Restart only if she gets a new partner, and otherwise file the record as complete", "Continue screening, because a prior high-grade lesion requires at least 20 years of screening"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "cervix-high-grade-continue-20-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Continue screening, because a prior high-grade lesion requires at least 20 years of screening$ky$,
  $ex$Prior high-grade disease means screening continues for at least 20 years. The lesion was treated 16 years ago, which is short of 20 years, so screening continues even though she is 66. "Stop now because she is over 65 and the last 3 cytology tests were negative" is not the best choice because Three negative cytology tests can support stopping after 65 only when there is no high-risk history. A prior high-grade lesion is a reason to keep screening. "Stop now because the latest cytology was within 5 years and she has no new partner during today's visit" is not the best choice because The latest test being within 5 years, and the absence of a new partner, do not erase a high-grade history. A new partner would not restart screening after an adequate stop, but this stop is not adequate. "Stop now because 16 years is longer than the 10-year cytology window" is not the best choice because The 10-year window is part of the negative-cytology stop rule. It does not shorten the 20-year minimum after a high-grade lesion. "Restart only if she gets a new partner, and otherwise file the record as complete" is not the best choice because A new partner does not gate screening. After a high-grade lesion, screening continues for at least 20 years.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '9ae32cbcce7083e58b67d58aadb09a56edb1eac47e2e7e1ab8b7a8ef222fdd7e', false, NOW(), NOW(), 5,
  'cervix-high-grade-continue-20-years', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cervix-high-grade-continue-20-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-270", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210271', 'usmle-step-2', 'ethics',
  $sc$A 42-year-old woman who works as a city planner is seen in the primary gynecology office asking which cervix test she is required to use. She has a cervix, has never had a high-grade lesion, and has not had a hysterectomy. Her last cytology 3 years ago was negative. She has one partner and takes no medicines. She bikes to work 4 days a week. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Body mass index is 25 kg/m2. Blood pressure medicine has never been prescribed.$sc$,
  $qu$Which of the following is the most appropriate counseling?$qu$,
  $op${"options": ["She should be screened, and she may choose among the 3 accepted strategies", "Only 1 strategy is acceptable, and the other 2 are errors at her age", "Screening waits until age 65 because she already had 1 negative cytology test", "A new partner is required before any of the 3 strategies can be offered", "Screening is grade D at age 42 and should not be offered"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "cervix-age-42-choose-among-strategies", "taskCategory": "communication-sbp"}$op$,
  $ky$She should be screened, and she may choose among the 3 accepted strategies$ky$,
  $ex$From age 30 to 65, 3 strategies are acceptable. The important point is that she is screened, and she can choose among them. She is 42, with a cervix and no high-grade history. "Only 1 strategy is acceptable, and the other 2 are errors at her age" is not the best choice because No single strategy is the only acceptable one in this age band. She may choose among the 3. "Screening waits until age 65 because she already had 1 negative cytology test" is not the best choice because One negative cytology test does not move stopping forward to age 42. Stopping after 65 needs a full adequate record. She is in the age band that is screened. "A new partner is required before any of the 3 strategies can be offered" is not the best choice because A new partner does not decide whether screening is offered at age 42, and it does not restart screening after an adequate stop later. "Screening is grade D at age 42 and should not be offered" is not the best choice because The grade D recommendation is against screening under 21. Age 42 is inside 30 to 65, where screening is indicated.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "communication-sbp"]$tg$,
  's2-new-20261121-hidden', '2e5f9658ea4babbb330b6109e26a311d1ae14791d225d769411474ed6aad1f35', false, NOW(), NOW(), 3,
  'cervix-age-42-choose-among-strategies', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Cervical Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'communication-sbp', 'cervix-age-42-choose-among-strategies', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-271", "hidden": true, "physicianTask": "communication-sbp", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/cervical-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210272', 'usmle-step-2', 'ethics',
  $sc$A 40-year-old woman who works as a radiology scheduler is seen in the general medicine clinic for a birthday preventive visit. She has no breast lump, no nipple discharge, and no first-degree relative with a breast malignancy. She takes no hormones. She walks 3 miles on Saturday mornings. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Body mass index is 27 kg/m2. A clinical breast examination shows no mass.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Defer mammography until age 50, because 40 is too young to start", "Start mammography every 2 years at this preventive visit", "Start breast MRI this year and skip mammography entirely", "Wait until age 75, when mammography becomes an I statement and is required", "Order breast ultrasound alone as the first screening test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "breast-biennial-start-age-40", "taskCategory": "health-maintenance"}$op$,
  $ky$Start mammography every 2 years at this preventive visit$ky$,
  $ex$Biennial mammography is recommended from age 40 through 74. She is 40, so mammography every 2 years starts now. "Defer mammography until age 50, because 40 is too young to start" is not the best choice because The start age is 40, not 50. Waiting until 50 misses the recommended window. "Start breast MRI this year and skip mammography entirely" is not the best choice because MRI is not the screening test to start at 40. Extra MRI solely for dense breasts, after a negative mammogram, is an I statement, and she has not even had a mammogram. "Wait until age 75, when mammography becomes an I statement and is required" is not the best choice because Age 75 and older is an I statement, which is not a requirement to start, and it is not a reason to wait. Screening is recommended at 40. "Order breast ultrasound alone as the first screening test" is not the best choice because Ultrasound alone is not the recommended screening test. The recommended test is mammography.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '2bad3f113e9fd6ebc90621d60c746c9a9b7fc108f5efa7ffdd4bd43f754b6de8', false, NOW(), NOW(), 2,
  'breast-biennial-start-age-40', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'breast-biennial-start-age-40', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-272", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210273', 'usmle-step-2', 'ethics',
  $sc$A 74-year-old woman who works as a bus dispatcher is seen in the general medicine clinic for follow-up of a normal mammogram 2 years ago. That mammogram showed no suspicious finding. She has no lump today. She still works night dispatch 3 shifts a week and takes amlodipine 5 mg daily. She has no implant and no prior breast surgery. Temperature is 36.5°C, pulse is 70/min, respirations are 15/min, and blood pressure is 136/78 mm Hg. Body mass index is 30 kg/m2. The breast examination shows no dominant mass.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Stop mammography at 70 and do not repeat it at 74", "Change to breast MRI because she has reached 74", "Continue mammography every 2 years, because 74 is still inside 40 to 74", "Treat age 74 as an I statement and do not offer mammography in the office today", "Repeat mammography in 6 months and then stop permanently"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "breast-biennial-continue-age-74", "taskCategory": "health-maintenance"}$op$,
  $ky$Continue mammography every 2 years, because 74 is still inside 40 to 74$ky$,
  $ex$Biennial mammography is recommended for ages 40 to 74. She is 74, and the prior mammogram was 2 years ago, so another mammogram is due. "Stop mammography at 70 and do not repeat it at 74" is not the best choice because The recommended range continues through age 74. It does not stop at 70. "Change to breast MRI because she has reached 74" is not the best choice because MRI does not replace mammography at 74. The recommended test remains mammography. "Treat age 74 as an I statement and do not offer mammography in the office today" is not the best choice because The I statement begins at age 75 and older. Age 74 is still inside the recommended range. "Repeat mammography in 6 months and then stop permanently" is not the best choice because A 6-month mammogram is not the screening interval, and permanent stopping is not required at 74.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '88a29e66c0dfd9c29c39a78dce75f2e7c3feba5a25e2c4ea1f3da4bfdf8daa6f', false, NOW(), NOW(), 3,
  'breast-biennial-continue-age-74', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'breast-biennial-continue-age-74', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-273", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210274', 'usmle-step-2', 'ethics',
  $sc$A 75-year-old woman who works as a home health aide is seen in the geriatrics clinic asking whether she must continue mammography. Her last mammogram, at age 73, was negative. She has no lump, no nipple discharge, and no prior breast biopsy. She works 4 mornings a week and takes metoprolol 25 mg daily. Temperature is 36.4°C, pulse is 64/min, respirations are 16/min, and blood pressure is 138/72 mm Hg. Body mass index is 28 kg/m2. She walks without assistance.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Mammography every 2 years remains a firm recommendation through age 80 at this encounter", "Screening at age 75 is grade D and must be refused outright", "A negative mammogram at age 73 requires breast MRI now", "Evidence is insufficient to recommend for or against mammography at age 75 or older", "Screening stops automatically at 74 and can never be discussed again"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "breast-age-75-i-statement", "taskCategory": "interpretation"}$op$,
  $ky$Evidence is insufficient to recommend for or against mammography at age 75 or older$ky$,
  $ex$For age 75 and older, mammography screening is an I statement. Evidence is insufficient to recommend for or against it. She is 75. "Mammography every 2 years remains a firm recommendation through age 80 at this encounter" is not the best choice because The firm recommendation for biennial mammography runs from 40 through 74. It does not extend as a firm recommendation through 80. "Screening at age 75 is grade D and must be refused outright" is not the best choice because Grade D in these sources is the recommendation against cervical screening under 21. Age 75 mammography is an I statement, not a grade D refusal. "A negative mammogram at age 73 requires breast MRI now" is not the best choice because Extra MRI after a negative mammogram is not required at 75, and MRI solely for breast density is itself an I statement. Density is not even the issue here. "Screening stops automatically at 74 and can never be discussed again" is not the best choice because Age 74 is the last year of the firm biennial recommendation. At 75 and older the statement is an I, which is not the same as a permanent ban on discussion.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'd65669a5c48a16075f781985443e88f4c8359cd893ecf4b2748f50c1381c628d', false, NOW(), NOW(), 4,
  'breast-age-75-i-statement', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'breast-age-75-i-statement', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-274", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210275', 'usmle-step-2', 'ethics',
  $sc$A 55-year-old woman who works as a tailor is seen in the breast clinic to review a mammogram report from last week. The mammogram was negative. The report says the breasts are extremely dense. She has no lump and no family history of a breast malignancy. She sews 6 hours a day and takes no hormones. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Body mass index is 26 kg/m2. The clinical breast examination shows no mass.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Dense breasts after a negative mammogram require ultrasound now", "Dense breasts after a negative mammogram require MRI now", "Density alone upgrades her to mammography every 6 months", "She should stop mammography because density makes it useless at age 55 in the office today", "Adding ultrasound or MRI solely because the breasts are dense is an I statement"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "breast-density-extra-imaging-i-statement", "taskCategory": "interpretation"}$op$,
  $ky$Adding ultrasound or MRI solely because the breasts are dense is an I statement$ky$,
  $ex$After a negative mammogram, extra ultrasound or MRI done only because the breasts are dense is an I statement. Evidence is insufficient to recommend for or against that add-on. She is 55, so biennial mammography itself remains indicated. "Dense breasts after a negative mammogram require ultrasound now" is not the best choice because Ultrasound solely because the breasts are dense, after a negative mammogram, is not a firm recommendation. It is an I statement. "Dense breasts after a negative mammogram require MRI now" is not the best choice because MRI solely because the breasts are dense, after a negative mammogram, is not a firm recommendation. It is an I statement. "Density alone upgrades her to mammography every 6 months" is not the best choice because The mammography interval in the firm recommendation is biennial, for ages 40 to 74. Density does not create a 6-month schedule. "She should stop mammography because density makes it useless at age 55 in the office today" is not the best choice because Age 55 is inside 40 to 74, so biennial mammography continues. Density does not stop it.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'b969f39163b1da4248af4f740fd019acd80e252bfa8060ba11a25aede849799f', false, NOW(), NOW(), 4,
  'breast-density-extra-imaging-i-statement', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Breast Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'breast-density-extra-imaging-i-statement', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-275", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/breast-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210276', 'usmle-step-2', 'ethics',
  $sc$A 45-year-old man who works as a high-school coach is seen in the gastroenterology office for a preventive visit at his wife's urging. He has no rectal bleeding, no change in stool, and no first-degree relative with a bowel malignancy. He coaches 5 afternoons a week and takes no medicines. He has never had a colonoscopy or a stool test for blood. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. Body mass index is 29 kg/m2. Hemoglobin is 14.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Start colorectal cancer screening now; ages 45 to 49 are a grade B recommendation", "Wait until age 50, because screening before then has no recommendation", "Wait until age 76, when an individual decision replaces routine screening before the patient leaves", "Use a serum test or a urine test as the recommended screening test", "Use capsule endoscopy as the recommended first screening test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "colon-start-screen-age-45", "taskCategory": "health-maintenance"}$op$,
  $ky$Start colorectal cancer screening now; ages 45 to 49 are a grade B recommendation$ky$,
  $ex$Screening starts at age 45. Ages 45 to 49 are grade B, and ages 50 to 75 are grade A. He is 45 and has not been screened. "Wait until age 50, because screening before then has no recommendation" is not the best choice because Age 50 is the start of the grade A range, not the start of screening. Waiting until 50 skips the grade B recommendation for 45 to 49. "Wait until age 76, when an individual decision replaces routine screening before the patient leaves" is not the best choice because Ages 76 to 85 are an individual decision. That is not a reason for a 45-year-old to wait. "Use a serum test or a urine test as the recommended screening test" is not the best choice because Serum tests and urine tests are not recommended screening tests. "Use capsule endoscopy as the recommended first screening test" is not the best choice because Capsule endoscopy is not a recommended screening test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'b4f19be2df8f695f2c17c1a599156cdf4e357b741b6d6a1093f846a5160550f2', false, NOW(), NOW(), 1,
  'colon-start-screen-age-45', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'colon-start-screen-age-45', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-276", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210277', 'usmle-step-2', 'ethics',
  $sc$A 47-year-old woman who works as a commercial electrician is seen in the internal medicine clinic after reading that screening starts at 50. She has no bowel symptoms and no family history of a bowel malignancy. She has never had a stool test or a colonoscopy. She works on commercial sites 4 days a week and takes levothyroxine 50 mcg daily. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Body mass index is 27 kg/m2. Hemoglobin is 13.1 g/dL.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Delay screening until age 50 so that it begins as grade A", "Start screening now; age 47 is inside the grade B range of 45 to 49", "Delay screening until age 76 and then decide individually", "Offer a serum blood test as an equivalent recommended screen in the office today", "Stop the discussion because screening after 45 is grade D"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "colon-do-not-delay-to-age-50", "taskCategory": "health-maintenance"}$op$,
  $ky$Start screening now; age 47 is inside the grade B range of 45 to 49$ky$,
  $ex$Ages 45 to 49 are grade B for screening. She is 47, so screening starts now rather than at 50. "Delay screening until age 50 so that it begins as grade A" is not the best choice because Grade A begins at 50, but screening itself begins at 45 with a grade B recommendation. Delaying until 50 is not the recommendation. "Delay screening until age 76 and then decide individually" is not the best choice because An individual decision applies at ages 76 to 85, not as a delay strategy for a 47-year-old. "Offer a serum blood test as an equivalent recommended screen in the office today" is not the best choice because Serum tests are not recommended screening tests. "Stop the discussion because screening after 45 is grade D" is not the best choice because There is no grade D against screening after 45. Grade B applies from 45 through 49, and grade A from 50 through 75.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'ee59012cd638496ddc0cb874e2c76dacd479d862d0b100cd4d22316be92d296e', false, NOW(), NOW(), 3,
  'colon-do-not-delay-to-age-50', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'colon-do-not-delay-to-age-50', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-277", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210278', 'usmle-step-2', 'ethics',
  $sc$A 79-year-old man who works as a park ranger is seen in the senior primary care clinic asking if another bowel screen is automatic. A colonoscopy at age 68 was negative. He has no rectal bleeding and no weight loss. He still hikes 2 miles on flat trails and takes tamsulosin 0.4 mg at night. No one has told him his life expectancy is short. Temperature is 36.5°C, pulse is 66/min, respirations are 15/min, and blood pressure is 134/72 mm Hg. Body mass index is 26 kg/m2. Hemoglobin is 13.6 g/dL.$sc$,
  $qu$Which of the following is the most appropriate counseling?$qu$,
  $op${"options": ["Continue screening automatically because grade A extends through age 85", "Stop today because all bowel screening is said to end at age 75", "Make an individual decision; ages 76 to 85 are not an automatic continue or stop", "Replace the discussion with capsule endoscopy, which is the preferred test after 75", "Order a serum test, which becomes the recommended test at age 79"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "colon-age-79-individual-decision", "taskCategory": "communication-sbp"}$op$,
  $ky$Make an individual decision; ages 76 to 85 are not an automatic continue or stop$ky$,
  $ex$For ages 76 to 85, screening is an individual decision, not an automatic continuation and not an automatic stop. He is 79. "Continue screening automatically because grade A extends through age 85" is not the best choice because Grade A covers ages 50 to 75. It does not extend through 85. Ages 76 to 85 are not automatic. "Stop today because all bowel screening is said to end at age 75" is not the best choice because Screening does not end for everyone at 75. After 75, ages 76 to 85 are an individual decision, and stopping is specified after 85. "Replace the discussion with capsule endoscopy, which is the preferred test after 75" is not the best choice because Capsule endoscopy is not a recommended screening test at any of these ages. "Order a serum test, which becomes the recommended test at age 79" is not the best choice because Serum tests are not recommended screening tests.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "communication-sbp"]$tg$,
  's2-new-20261121-hidden', '86ce73845735e4fa3c438beb5d4c29bab85fdca62464cefabaa34c15cc86f69a', false, NOW(), NOW(), 4,
  'colon-age-79-individual-decision', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'communication-sbp', 'colon-age-79-individual-decision', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-278", "hidden": true, "physicianTask": "communication-sbp", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210279', 'usmle-step-2', 'ethics',
  $sc$A 91-year-old woman who works as a jeweler is seen in the gerontology practice for a visit arranged by her daughter. She has no rectal bleeding. A colonoscopy at age 70 was negative, and she has had no stool test since. She lives with her daughter, cooks twice a week, and takes acetaminophen 500 mg occasionally for knee pain. Temperature is 36.4°C, pulse is 72/min, respirations are 16/min, and blood pressure is 140/74 mm Hg. Body mass index is 24 kg/m2. She walks with a cane inside the apartment.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Continue grade A screening because she is only 16 years past age 75", "Make the same individual decision used for every age past 50", "Start capsule endoscopy on a 5-year schedule as screening", "Stop screening now, because screening stops after age 85", "Use a urine screening test once and then stop screening"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "colon-stop-screen-age-91", "taskCategory": "health-maintenance"}$op$,
  $ky$Stop screening now, because screening stops after age 85$ky$,
  $ex$Screening stops after age 85. She is 91, so screening is not continued. "Continue grade A screening because she is only 16 years past age 75" is not the best choice because Grade A stops at 75. Being 16 years past 75 is not a reason to extend it. She is 91. "Make the same individual decision used for every age past 50" is not the best choice because An individual decision applies at ages 76 to 85, not at every age past 50, and not after 85. "Start capsule endoscopy on a 5-year schedule as screening" is not the best choice because Capsule endoscopy is not a recommended screening test, and a 5-year capsule schedule is not stated. "Use a urine screening test once and then stop screening" is not the best choice because Urine tests are not recommended screening tests.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'e16f96202d5891a47f05ea60a07ab04dcb06311c1cc33b8c78807301d042ad52', false, NOW(), NOW(), 2,
  'colon-stop-screen-age-91', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'colon-stop-screen-age-91', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-279", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210280', 'usmle-step-2', 'ethics',
  $sc$A 52-year-old man who works as a dental hygienist is seen in the digestive health office to review a stool result that came back this morning. The fecal immunochemical test is positive. He has no visible blood, no black stool, and no weight loss. He cleaned teeth 4 days this week. He takes atorvastatin 10 mg nightly. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. Hemoglobin is 14.2 g/dL. Body mass index is 28 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Repeat the fecal immunochemical test in 1 year and do nothing else", "Order a serum screening test instead of looking in the colon", "Order capsule endoscopy as the recommended follow-up test", "Order a urine screening test and repeat it if the first is negative", "Arrange colonoscopy; the benefit is lost if colonoscopy is not done"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "colon-positive-fit-needs-colonoscopy", "taskCategory": "clinical-intervention"}$op$,
  $ky$Arrange colonoscopy; the benefit is lost if colonoscopy is not done$ky$,
  $ex$A positive stool test requires colonoscopy. The benefit is lost if colonoscopy is not done. His fecal immunochemical test is positive. "Repeat the fecal immunochemical test in 1 year and do nothing else" is not the best choice because A positive stool test is not followed by waiting a year to repeat it. Colonoscopy is required, or the benefit of the stool test is lost. "Order a serum screening test instead of looking in the colon" is not the best choice because Serum tests are not recommended screening tests and do not replace colonoscopy after a positive stool test. "Order capsule endoscopy as the recommended follow-up test" is not the best choice because Capsule endoscopy is not a recommended screening test and is not the follow-up for a positive stool test. "Order a urine screening test and repeat it if the first is negative" is not the best choice because Urine tests are not recommended screening tests and do not evaluate a positive fecal immunochemical test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '56185a04ed2b1a2ed01f3d3f4d7627bc7994e2aa0ac85048e548c952108e8760', false, NOW(), NOW(), 3,
  'colon-positive-fit-needs-colonoscopy', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'colon-positive-fit-needs-colonoscopy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-280", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210281', 'usmle-step-2', 'ethics',
  $sc$A 60-year-old woman who works as a ship pilot is seen in the endoscopy suite in the recovery area after an examination. The colonoscopy just finished was complete to the cecum and showed no polyp and no mass. Bowel preparation was adequate. She has no family history of a bowel malignancy. She returns to harbor duty in 3 days. Temperature is 36.5°C, pulse is 64/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. She received 2 mg of midazolam and 50 mcg of fentanyl during the procedure. She is awake and comfortable.$sc$,
  $qu$Which of the following is the most appropriate follow-up plan?$qu$,
  $op${"options": ["Repeat colonoscopy in 10 years if no symptoms bring her back sooner", "Repeat colonoscopy in 5 years, the interval used after a normal CT colonography", "Repeat flexible sigmoidoscopy in 10 years as the match for this examination", "Switch to a serum test in 1 year because the examination was negative", "Stop all further screening now because one negative examination ends it at age 60"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "colon-negative-colonoscopy-10-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Repeat colonoscopy in 10 years if no symptoms bring her back sooner$ky$,
  $ex$After a negative colonoscopy, the next screening colonoscopy is in 10 years. She is 60, still inside the screening ages, and the examination found nothing. "Repeat colonoscopy in 5 years, the interval used after a normal CT colonography" is not the best choice because Five years is the interval for CT colonography or flexible sigmoidoscopy, not for a negative colonoscopy. An abnormal CT colonography would still need colonoscopy. "Repeat flexible sigmoidoscopy in 10 years as the match for this examination" is not the best choice because Flexible sigmoidoscopy is every 5 years, not every 10. She had a colonoscopy, which is every 10 years when negative. "Switch to a serum test in 1 year because the examination was negative" is not the best choice because Serum tests are not recommended screening tests, and a negative colonoscopy is not followed in 1 year by one. "Stop all further screening now because one negative examination ends it at age 60" is not the best choice because One negative colonoscopy does not end screening at age 60. The next colonoscopy is due in 10 years, while she remains a screening candidate.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '17df2192260044245d8101345d64ae4c638716d45dcce1838f5af3a1c00fca54', false, NOW(), NOW(), 2,
  'colon-negative-colonoscopy-10-years', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'colon-negative-colonoscopy-10-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-281", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210282', 'usmle-step-2', 'ethics',
  $sc$A 48-year-old woman who works as a dietetic technician is seen in the family practice office before a stool card is sent home with her. She chose a yearly fecal immunochemical test. A pamphlet she brought says to avoid red meat and vitamin C for a guaiac card. She eats beef about 3 times a week and takes a vitamin C tablet of 250 mg. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/74 mm Hg. Hemoglobin is 13.5 g/dL. She has no visible rectal bleeding.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["She must stop beef and vitamin C, because those limits apply to every stool test", "Annual fecal immunochemical testing does not need the dietary limits required by guaiac testing", "The fecal immunochemical test is done every 10 years, so diet this week does not matter before the patient leaves", "The fecal immunochemical test is done every 5 years, like flexible sigmoidoscopy", "A positive fecal immunochemical test is followed by another stool card, not colonoscopy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "colon-fit-no-guaiac-diet-limits", "taskCategory": "interpretation"}$op$,
  $ky$Annual fecal immunochemical testing does not need the dietary limits required by guaiac testing$ky$,
  $ex$Annual FIT does not need the dietary limits required by guaiac fecal occult blood testing. She does not have to stop beef or the 250 mg vitamin C tablet for this test. "She must stop beef and vitamin C, because those limits apply to every stool test" is not the best choice because Dietary limits are part of guaiac fecal occult blood testing. They are not required for a fecal immunochemical test. "The fecal immunochemical test is done every 10 years, so diet this week does not matter before the patient leaves" is not the best choice because A negative colonoscopy is every 10 years. FIT is annual, and the dietary point is separate from that interval. "The fecal immunochemical test is done every 5 years, like flexible sigmoidoscopy" is not the best choice because CT colonography and flexible sigmoidoscopy are every 5 years. FIT is annual. "A positive fecal immunochemical test is followed by another stool card, not colonoscopy" is not the best choice because A positive stool test requires colonoscopy. The benefit is lost if colonoscopy is not done. Another card is not the follow-up.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'd2253a2c08935b9e49e9ce347e86ba1f8e1e6d1322e40d935afcefdfb4ba7848', false, NOW(), NOW(), 3,
  'colon-fit-no-guaiac-diet-limits', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'colon-fit-no-guaiac-diet-limits', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-282", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210283', 'usmle-step-2', 'ethics',
  $sc$A 60-year-old man who works as a firefighter is seen in the pulmonary clinic for a visit about morning cough that clears after coffee. He has smoked 1 pack daily for 20 years and smoked on the way to clinic. He can climb 2 flights of stairs. No surgeon has said chest surgery would be impossible. He works 24-hour shifts 8 days a month. Temperature is 36.7°C, pulse is 78/min, respirations are 16/min, and blood pressure is 132/80 mm Hg. Oxygen saturation is 97% on room air. Body mass index is 29 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["No annual imaging, because a 30 pack-year history is still required at this encounter", "No annual imaging, because screening starts only at age 55", "Annual low-dose CT, because he is 50 to 80, has 20 pack-years, and currently smokes", "Order a chest radiograph each year instead of CT imaging", "One CT now, then stop, because annual testing is not the schedule"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "lung-ldct-age-60-20-pack-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Annual low-dose CT, because he is 50 to 80, has 20 pack-years, and currently smokes$ky$,
  $ex$Annual low-dose CT is recommended for adults 50 to 80 with at least 20 pack-years who currently smoke or quit within 15 years. He is 60, has a 20 pack-year history, and currently smokes. "No annual imaging, because a 30 pack-year history is still required at this encounter" is not the best choice because The old 30 pack-year rule is not used. At least 20 pack-years is the threshold. He has 20. "No annual imaging, because screening starts only at age 55" is not the best choice because The old start age of 55 is not used. Screening ages are 50 to 80. He is 60. "Order a chest radiograph each year instead of CT imaging" is not the best choice because A chest radiograph is not the recommended screening test. The test is annual low-dose CT. "One CT now, then stop, because annual testing is not the schedule" is not the best choice because The schedule is annual, not a single scan, while he still meets the smoking and age rules and could undergo curative lung surgery.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '10ab71f6336bdff60a033e4da64b8c9ccff2eb0eee2ca9f2dd1c36d2bae30e55', false, NOW(), NOW(), 2,
  'lung-ldct-age-60-20-pack-years', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Lung Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'lung-ldct-age-60-20-pack-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-283", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210284', 'usmle-step-2', 'ethics',
  $sc$A 52-year-old woman who works as a roofer is seen in the smoking-cessation clinic asking why a clerk told her she is too young and has not smoked enough. She has a 20 pack-year history and smoked a cigarette this morning. She walks roof jobs without stopping and has no limit on curative chest surgery. She started smoking at age 32 and has not quit. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Oxygen saturation is 98% on room air. She can walk 400 meters on level ground.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Defer screening until age 55 and until she reaches 30 pack-years at this encounter", "Defer screening because 20 pack-years matter only after age 80", "Screen once with a chest radiograph and do not repeat it", "Annual low-dose CT now; do not use the old 55-to-80 and 30 pack-year rule", "Stop considering screening because she is still working on roofs"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "lung-ldct-age-52-not-old-rule", "taskCategory": "health-maintenance"}$op$,
  $ky$Annual low-dose CT now; do not use the old 55-to-80 and 30 pack-year rule$ky$,
  $ex$Annual low-dose CT is for adults 50 to 80 with at least 20 pack-years who currently smoke or quit within 15 years. She meets that. The old 55-to-80 and 30 pack-year rule should not be used. "Defer screening until age 55 and until she reaches 30 pack-years at this encounter" is not the best choice because The old rule of ages 55 to 80 and 30 pack-years is not used. She is 52, with 20 pack-years, and she currently smokes. "Defer screening because 20 pack-years matter only after age 80" is not the best choice because Pack-years do not start to count only after 80. Screening ages are 50 to 80, and 20 pack-years is the threshold. "Screen once with a chest radiograph and do not repeat it" is not the best choice because The screening test is annual low-dose CT, not a one-time chest radiograph. "Stop considering screening because she is still working on roofs" is not the best choice because Being able to work is not a reason to withhold screening. Limited ability to have curative lung surgery would be a reason to stop, and she does not have that limit.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '42fda57c87110fb67b2a26c0acbe0f911e6be55badcaf51437a1f2a313b2c558', false, NOW(), NOW(), 5,
  'lung-ldct-age-52-not-old-rule', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Lung Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'lung-ldct-age-52-not-old-rule', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-284", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210285', 'usmle-step-2', 'ethics',
  $sc$A 64-year-old man who works as a welder is seen in the thoracic clinic for a clearance visit before a knee operation. He smoked 28 pack-years and quit 16 years ago. He has not smoked since. He can climb a flight of stairs, and the knee surgeon expects him to tolerate anesthesia. He welds 5 days a week. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. Oxygen saturation is 96% on room air. The chest examination is clear.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Start annual imaging because 28 pack-years exceed 20 and he is under 80", "Start annual imaging because quitting 16 years ago is still within 15 years", "Use the old 30 pack-year rule and screen him because 28 is close to 30", "Order a chest radiograph every year for the next 16 years", "Do not start annual low-dose CT, because he quit more than 15 years ago"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "lung-stop-ldct-quit-16-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not start annual low-dose CT, because he quit more than 15 years ago$ky$,
  $ex$Annual low-dose CT stops after 15 years without smoking. He has a 28 pack-year history and is 64, but he quit 16 years ago. "Start annual imaging because 28 pack-years exceed 20 and he is under 80" is not the best choice because Pack-years and age would otherwise fit, but screening stops after 15 years without smoking. He quit 16 years ago. "Start annual imaging because quitting 16 years ago is still within 15 years" is not the best choice because Sixteen years is not within 15 years. The eligible former smoker quit within 15 years. Stopping is after 15 years without smoking. "Use the old 30 pack-year rule and screen him because 28 is close to 30" is not the best choice because The old 30 pack-year rule is not used, and being close to 30 does not matter. The reason not to screen is the 16 years since he quit. "Order a chest radiograph every year for the next 16 years" is not the best choice because A yearly chest radiograph is not the screening test, and the 16-year span is the reason he is no longer eligible.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '2d4de62bba6b83bf9d9050522319dfe6486166916780a2d8690a6e8adf26f678', false, NOW(), NOW(), 3,
  'lung-stop-ldct-quit-16-years', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Lung Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'lung-stop-ldct-quit-16-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-285", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210286', 'usmle-step-2', 'ethics',
  $sc$A 59-year-old woman who works as a mail carrier is seen in the preventive pulmonary office for a visit she scheduled after a union health fair. She has a 24 pack-year history and quit 9 years ago. She walks a 6-mile route 5 days a week. No clinician has limited her ability to undergo chest surgery. She has had no chest imaging for screening. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 126/74 mm Hg. Oxygen saturation is 98% on room air. Body mass index is 25 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Annual low-dose CT, because she quit within 15 years and still has at least 20 pack-years", "No annual imaging, because quitting for 9 years already passes the 15-year stop during today's visit", "No annual imaging until she reaches 30 pack-years or age 55, whichever is later", "A single chest radiograph, then no further screening plan at all", "Offer annual imaging only if she starts smoking again now"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "lung-continue-ldct-quit-9-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Annual low-dose CT, because she quit within 15 years and still has at least 20 pack-years$ky$,
  $ex$Annual low-dose CT applies from ages 50 to 80 with at least 20 pack-years when the person currently smokes or quit within 15 years. She is 59, has 24 pack-years, and quit 9 years ago. "No annual imaging, because quitting for 9 years already passes the 15-year stop during today's visit" is not the best choice because Nine years is within 15 years. Screening stops after 15 years without smoking, not at 9 years. "No annual imaging until she reaches 30 pack-years or age 55, whichever is later" is not the best choice because The old 55-to-80 and 30 pack-year rule is not used. She already meets the current age and pack-year thresholds. "A single chest radiograph, then no further screening plan at all" is not the best choice because The test is annual low-dose CT, not one chest radiograph. "Offer annual imaging only if she starts smoking again now" is not the best choice because Former smokers who quit within 15 years remain eligible. She does not have to resume smoking.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '60fa6989fb3c9c0d5034d55f923aaf9020a636d5596aa4807d249708fb28c062', false, NOW(), NOW(), 3,
  'lung-continue-ldct-quit-9-years', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Lung Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'lung-continue-ldct-quit-9-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-286", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210287', 'usmle-step-2', 'ethics',
  $sc$A 70-year-old man who works as a crane operator is seen in the preoperative clinic before a discussion of screening that his daughter requested. He has smoked 2 packs daily for 20 years and smoked today. A thoracic surgeon wrote yesterday that curative lung surgery is not possible because of severe heart failure. He becomes short of breath walking 20 meters. Temperature is 36.6°C, pulse is 92/min, respirations are 20/min, and blood pressure is 108/68 mm Hg. Oxygen saturation is 91% on room air. He sleeps with his head elevated on 3 pillows.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Start annual imaging because 40 pack-years and current smoking meet the numbers", "Do not start annual low-dose CT, because he cannot undergo curative lung surgery", "Screen once, because the surgery limit only cancels repeat scans after the first", "Use a chest radiograph each year as a substitute he can tolerate", "Wait until he has quit for 15 years and then start annual imaging"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "lung-stop-ldct-no-curative-surgery", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not start annual low-dose CT, because he cannot undergo curative lung surgery$ky$,
  $ex$Screening stops if the ability to have curative lung surgery is substantially limited. The surgeon documented that curative lung surgery is not possible, so annual low-dose CT is not started. "Start annual imaging because 40 pack-years and current smoking meet the numbers" is not the best choice because Age, pack-years, and current smoking would otherwise qualify a 70-year-old. They do not override a substantial limit on curative lung surgery. "Screen once, because the surgery limit only cancels repeat scans after the first" is not the best choice because The limit is a reason not to screen, not a reason to do one scan and stop later. "Use a chest radiograph each year as a substitute he can tolerate" is not the best choice because A chest radiograph is not the recommended screening test and is not a substitute when surgery cannot cure. "Wait until he has quit for 15 years and then start annual imaging" is not the best choice because Quitting for 15 years is a separate stop rule for people who would otherwise be eligible. It is not a future start time for someone who cannot have curative surgery.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'ae06b24c4317ef29c50e73270cdbb47124253fd8a3c6ebabdb204174b2aafe2c', false, NOW(), NOW(), 4,
  'lung-stop-ldct-no-curative-surgery', 'social-sciences', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Lung Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'lung-stop-ldct-no-curative-surgery', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-287", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210288', 'usmle-step-2', 'ethics',
  $sc$A 27-year-old woman who works as a bartender is seen in the sexual health clinic for pelvic pain that began 3 days ago. A cervical nucleic acid test detects Neisseria gonorrhoeae. She had sex with one partner 20 days ago and a different partner 50 days ago, and with no one else this year. She has no drug allergy. She works closing shifts 5 nights a week. Temperature is 37.2°C, pulse is 88/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. She weighs 63 kg. Cervical motion tenderness is present. A pregnancy test is negative.$sc$,
  $qu$Which of the following is the most appropriate partner plan?$qu$,
  $op${"options": ["Treat neither partner unless each partner develops symptoms", "Treat only the partner from 20 days ago, because 50 days is too remote", "Treat both partners, because both had sex with her within 60 days", "Treat only partners from the past 7 days and observe the others", "Treat every partner from the past 12 months and ignore the 60-day window"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "gc-treat-partners-inside-60-days", "taskCategory": "clinical-intervention"}$op$,
  $ky$Treat both partners, because both had sex with her within 60 days$ky$,
  $ex$Recent partners are people who had sex with the patient within 60 days before symptoms or diagnosis. Both the partner at 20 days and the partner at 50 days are inside that window, so both are treated. "Treat neither partner unless each partner develops symptoms" is not the best choice because Partner treatment is not limited to partners who already have symptoms. Recent partners are treated based on the time window. "Treat only the partner from 20 days ago, because 50 days is too remote" is not the best choice because Fifty days is still inside 60 days. The most-recent-partner-only rule applies when the last contact was longer ago than 60 days. "Treat only partners from the past 7 days and observe the others" is not the best choice because Seven days is the abstinence interval after treatment, not the partner-lookback window. The lookback is 60 days. "Treat every partner from the past 12 months and ignore the 60-day window" is not the best choice because There is no 12-month partner rule here. Contacts older than 60 days are not all treated; if the last contact was longer ago than 60 days, the most recent partner is treated.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '304f0dae9d82281d0853d01a6756a4504085bf9ce27d236f8742d4455270ac7f', false, NOW(), NOW(), 3,
  'gc-treat-partners-inside-60-days', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'gc-treat-partners-inside-60-days', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-288", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210289', 'usmle-step-2', 'ethics',
  $sc$A 41-year-old man who works as a locksmith is seen in the city reproductive health clinic for burning with urination for 2 days. A urine nucleic acid test detects Neisseria gonorrhoeae. His only sexual contact in the past year was 120 days ago. He has had no partner in the past 60 days. He takes no medicines and has no drug allergy. Temperature is 36.8°C, pulse is 80/min, respirations are 14/min, and blood pressure is 126/78 mm Hg. He weighs 84 kg. There is urethral discharge on examination.$sc$,
  $qu$Which of the following is the most appropriate partner plan?$qu$,
  $op${"options": ["Treat no partner, because the contact was more than 60 days ago", "Treat every partner from the past 120 days, including people he did not have sex with", "Ask the partner to wait for symptoms before any treatment", "Treat the most recent partner, because there was no contact inside 60 days", "Use a 90-day lookback and treat that partner only if serology is negative"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "gc-treat-most-recent-partner-after-60", "taskCategory": "clinical-intervention"}$op$,
  $ky$Treat the most recent partner, because there was no contact inside 60 days$ky$,
  $ex$If the last contact was longer ago than 60 days, treat the most recent partner. His only contact was 120 days ago, so that partner is treated. "Treat no partner, because the contact was more than 60 days ago" is not the best choice because When no partner falls inside 60 days, the plan is not to treat nobody. The most recent partner is treated. "Treat every partner from the past 120 days, including people he did not have sex with" is not the best choice because People he did not have sex with are not partners. The rule does not treat an entire 120-day social circle. "Ask the partner to wait for symptoms before any treatment" is not the best choice because Partner treatment does not wait for the partner's symptoms. "Use a 90-day lookback and treat that partner only if serology is negative" is not the best choice because Ninety days and serology are the early-syphilis partner rules, not this nucleic acid result. The gonococcal lookback is 60 days, then the most recent partner.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '7246178c66e9cceb6a3adbe733a78866c8dbe25396ebe2134d6dc6419158a60f', false, NOW(), NOW(), 4,
  'gc-treat-most-recent-partner-after-60', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'gc-treat-most-recent-partner-after-60', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-289", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210290', 'usmle-step-2', 'ethics',
  $sc$A 33-year-old man who works as a barber is seen in the men's health clinic after a rectal swab was collected 2 days ago. The rectal nucleic acid test detects Neisseria gonorrhoeae, and a rectal test for Chlamydia trachomatis is negative. He has sex with men. Expedited partner therapy is legal in this state. A partner from 12 days ago will not come in today. He weighs 79 kg and has no drug allergy. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 120/76 mm Hg. He has no fever. The rectal examination is tender but shows no abscess.$sc$,
  $qu$Which of the following is the most appropriate partner plan?$qu$,
  $op${"options": ["Prescribe expedited therapy routinely with cefixime 800 mg for every recent partner", "Give each partner azithromycin 2 g alone as routine expedited therapy", "Refuse any partner conversation until every partner has a documented virus test", "Treat only partners from the past 7 days and skip the others automatically", "Use shared decision-making rather than routine expedited partner therapy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "gc-msm-ept-shared-decision", "taskCategory": "communication-sbp"}$op$,
  $ky$Use shared decision-making rather than routine expedited partner therapy$ky$,
  $ex$For men who have sex with men, use shared decision-making rather than routine expedited partner therapy, because of undiagnosed HIV and limited data. Chlamydia has been excluded, and expedited therapy is legal, but it is still not automatic. "Prescribe expedited therapy routinely with cefixime 800 mg for every recent partner" is not the best choice because Cefixime 800 mg once is an expedited regimen when chlamydia has been excluded and therapy is otherwise appropriate. For men who have sex with men, expedited partner therapy is not routine. "Give each partner azithromycin 2 g alone as routine expedited therapy" is not the best choice because Azithromycin 2 g alone is not a recommended regimen. It is also not the routine path for this patient's partners. "Refuse any partner conversation until every partner has a documented virus test" is not the best choice because Undiagnosed HIV is one reason for shared decision-making. It is not a rule to refuse every partner conversation until a virus test is documented. "Treat only partners from the past 7 days and skip the others automatically" is not the best choice because Seven days is the patient's abstinence interval, not a partner-lookback cutoff. The lookback remains 60 days, and the expedited-therapy decision is shared rather than routine.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "communication-sbp"]$tg$,
  's2-new-20261121-hidden', '393f2fb98d59bab2fe2313cdab17d717df7d36f4cab3b3da019c59d256f49486', false, NOW(), NOW(), 5,
  'gc-msm-ept-shared-decision', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'communication-sbp', 'gc-msm-ept-shared-decision', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-290", "hidden": true, "physicianTask": "communication-sbp", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210291', 'usmle-step-2', 'ethics',
  $sc$A 29-year-old woman who works as a phlebotomist is seen in the community sexual health center in the room after an injection was just given. She received the recommended one-time injection for a cervical nucleic acid test that detected Neisseria gonorrhoeae. Her partner from 10 days ago has not yet been treated. She has a date planned for tomorrow night. She weighs 58 kg. Temperature is 36.8°C, pulse is 84/min, respirations are 15/min, and blood pressure is 114/70 mm Hg. She has no allergy to the injection. Symptoms of discharge began 4 days ago.$sc$,
  $qu$Which of the following is the most appropriate counseling?$qu$,
  $op${"options": ["Avoid sex for 7 days after treatment and until partners have been treated", "Avoid sex for 24 hours, then resume even if the partner is untreated", "No abstinence is needed once the injection has been given", "Avoid sex for 7 days, and the partner's treatment status does not matter in the office today", "Avoid sex for 3 months, which replaces the 7-day advice"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "gc-abstain-7-days-until-partners-treated", "taskCategory": "communication"}$op$,
  $ky$Avoid sex for 7 days after treatment and until partners have been treated$ky$,
  $ex$Patients should abstain from sex for 7 days after treatment and until partners are treated. Her partner from 10 days ago has not been treated, and the dose was given today. "Avoid sex for 24 hours, then resume even if the partner is untreated" is not the best choice because Twenty-four hours is not the abstinence interval. The interval is 7 days, and partner treatment is also required. "No abstinence is needed once the injection has been given" is not the best choice because The injection does not end the need to abstain. Seven days and partner treatment both apply. "Avoid sex for 7 days, and the partner's treatment status does not matter in the office today" is not the best choice because Seven days alone leaves out the second condition. Abstinence continues until partners are treated, not only until day 7 if a partner is still untreated. "Avoid sex for 3 months, which replaces the 7-day advice" is not the best choice because Three months is the retest time, not a 3-month abstinence rule that replaces the 7-day instruction.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "communication"]$tg$,
  's2-new-20261121-hidden', '1d8e0cf571801ee8205e9bc415b9165885be7566a2f9b9c6e1b817940f2a41a4', false, NOW(), NOW(), 2,
  'gc-abstain-7-days-until-partners-treated', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'communication', 'gc-abstain-7-days-until-partners-treated', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-291", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210292', 'usmle-step-2', 'ethics',
  $sc$A 36-year-old man who works as a 911 dispatcher is seen in the public-health follow-up clinic because discharge is still present after treatment. He received the recommended regimen 4 days ago for a urethral nucleic acid test that detected Neisseria gonorrhoeae. He has had no sexual contact since that dose. Symptoms have not improved. He weighs 77 kg and has no new allergy. Temperature is 36.9°C, pulse is 86/min, respirations are 16/min, and blood pressure is 122/78 mm Hg. Urethral discharge is still present. A repeat examination shows no testicular swelling.$sc$,
  $qu$Which of the following is the most appropriate public-health action?$qu$,
  $op${"options": ["File no report, because persistent symptoms are reinfections even with no reexposure at this encounter", "Notify public health within 24 hours and obtain culture with susceptibility before retreatment", "Wait for a nucleic acid test at 48 hours, then report only if that test is positive", "Retreat today with azithromycin 2 g alone and send a report next week", "Report the case within 72 hours and skip culture because symptoms are enough"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "gc-report-suspected-failure-24-hours", "taskCategory": "professionalism"}$op$,
  $ky$Notify public health within 24 hours and obtain culture with susceptibility before retreatment$ky$,
  $ex$Suspected cephalosporin failure includes symptoms that persist 3 to 5 days without reexposure. It is reported to public health within 24 hours. When failure is more likely than reinfection, obtain culture and susceptibility before retreatment. He is on day 4 with no sexual contact since treatment. "File no report, because persistent symptoms are reinfections even with no reexposure at this encounter" is not the best choice because Most apparent failures are reinfections. This episode has symptoms on day 4 and no reexposure, so it meets suspected cephalosporin failure rather than being dismissed as reinfection. "Wait for a nucleic acid test at 48 hours, then report only if that test is positive" is not the best choice because A positive nucleic acid test after more than 7 days can also suggest failure. It is not a reason to wait when symptoms have already persisted for 4 days without reexposure. Forty-eight hours is not the reporting clock. "Retreat today with azithromycin 2 g alone and send a report next week" is not the best choice because Azithromycin 2 g alone is not recommended, and reporting waits 24 hours, not until next week. "Report the case within 72 hours and skip culture because symptoms are enough" is not the best choice because The report is due within 24 hours, not 72 hours. Seventy-two hours is part of the culture-positivity criterion for suspected failure. Culture and susceptibility come before retreatment when failure is more likely than reinfection.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "professionalism"]$tg$,
  's2-new-20261121-hidden', '68c922cf0c8727738585f8b6972723d5cc6ed9d66f902fe3e2e4d121a866c0ec', false, NOW(), NOW(), 5,
  'gc-report-suspected-failure-24-hours', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'professionalism', 'gc-report-suspected-failure-24-hours', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-292", "hidden": true, "physicianTask": "professionalism", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210293', 'usmle-step-2', 'ethics',
  $sc$A 25-year-old woman who works as a physical therapy aide is seen in the hospital infectious diseases clinic 1 week after recommended treatment. A cervical nucleic acid test had detected Neisseria gonorrhoeae, and a chlamydia nucleic acid test was negative. She received ceftriaxone 500 mg intramuscularly once. She weighs 60 kg. Discharge has resolved. She has had no sex since the dose. The infection was not pharyngeal. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The cervical examination is now nontender. She works 8-hour shifts in a rehab gym.$sc$,
  $qu$Which of the following is the most appropriate follow-up plan?$qu$,
  $op${"options": ["Obtain a test of cure in 7 to 14 days because every treated site needs one", "Obtain a test of cure in about 4 weeks, then stop all testing", "No test of cure is needed; retest the patient in 3 months", "Do no further testing at any time, including at 3 months", "Repeat a nucleic acid test tomorrow as the test of cure"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "gc-no-test-of-cure-urogenital", "taskCategory": "clinical-intervention"}$op$,
  $ky$No test of cure is needed; retest the patient in 3 months$ky$,
  $ex$Uncomplicated urogenital infection treated with a recommended regimen does not need a test of cure. The patient is retested at 3 months. She received ceftriaxone 500 mg, which matches a weight of 60 kg, and the chlamydia test was negative. "Obtain a test of cure in 7 to 14 days because every treated site needs one" is not the best choice because A test of cure at 7 to 14 days is for pharyngeal infection. Uncomplicated urogenital infection treated with a recommended regimen does not need a test of cure. "Obtain a test of cure in about 4 weeks, then stop all testing" is not the best choice because A test of cure at about 4 weeks is the pregnancy timing after chlamydia treatment, not the plan after this urogenital regimen. "Do no further testing at any time, including at 3 months" is not the best choice because Skipping the test of cure is right. Skipping the 3-month retest is not. Retesting at 3 months is still indicated. "Repeat a nucleic acid test tomorrow as the test of cure" is not the best choice because Tomorrow is not a test-of-cure interval, and this urogenital infection does not need a test of cure.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'd7d864b5301200f35177975ea15eddd3fbff505f906cefd0a61b1581641b36a1', false, NOW(), NOW(), 3,
  'gc-no-test-of-cure-urogenital', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'gc-no-test-of-cure-urogenital', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-293", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210294', 'usmle-step-2', 'ethics',
  $sc$A 31-year-old man who works as a line cook is seen in the reproductive health office for urethral discomfort that started yesterday. A urine nucleic acid test detects Chlamydia trachomatis and does not detect Neisseria gonorrhoeae. He had sex with one partner 15 days ago and another partner 45 days ago. He is not pregnant. He works a hot line 6 nights a week and has no drug allergy. Temperature is 36.8°C, pulse is 82/min, respirations are 14/min, and blood pressure is 124/78 mm Hg. He weighs 76 kg. There is clear urethral discharge on examination.$sc$,
  $qu$Which of the following is the most appropriate counseling?$qu$,
  $op${"options": ["Treat only the partner from 15 days ago and do not mention abstinence", "Treat partners from the past 90 days even if their serology is negative", "No partner needs treatment if the patient's own test is already positive", "Treat both partners from the past 60 days and advise no sex for 7 days", "Advise no sex for 1 day and defer partner treatment until symptoms appear"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "ct-partners-60-days-and-abstain-7", "taskCategory": "communication"}$op$,
  $ky$Treat both partners from the past 60 days and advise no sex for 7 days$ky$,
  $ex$Partners from the past 60 days are treated. If the last contact had been longer ago, only the most recent partner would be treated. Both partners, at 15 and 45 days, are inside 60 days. He should abstain from sex for 7 days. "Treat only the partner from 15 days ago and do not mention abstinence" is not the best choice because Both contacts are inside 60 days, so treatment is not limited to the most recent one. Abstinence for 7 days is also part of the advice. "Treat partners from the past 90 days even if their serology is negative" is not the best choice because Ninety days, including treatment despite negative serology, is the early-syphilis partner rule. This organism uses a 60-day partner window. "No partner needs treatment if the patient's own test is already positive" is not the best choice because A positive test is the reason partners are treated, not a reason to skip them. "Advise no sex for 1 day and defer partner treatment until symptoms appear" is not the best choice because One day is not the abstinence interval. The interval is 7 days, and partner treatment does not wait for partner symptoms.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "communication"]$tg$,
  's2-new-20261121-hidden', 'bc6bcf5f0bd2bcff916b08a06c773ab001a8e66eb25b67ae23949fd3780ff100', false, NOW(), NOW(), 3,
  'ct-partners-60-days-and-abstain-7', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'communication', 'ct-partners-60-days-and-abstain-7', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-294", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210295', 'usmle-step-2', 'ethics',
  $sc$A 28-year-old woman who works as a glassblower is seen in the health department clinic for a painless vulvar ulcer that appeared 3 weeks ago. The RPR is reactive at 1:32 and a treponemal antibody test is positive. One partner, last sex 30 days ago, has negative serology drawn today. Another partner, last sex 200 days ago, also has negative serology, and that result is already available. She works at a furnace 4 days a week. Temperature is 36.7°C, pulse is 80/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. She weighs 59 kg. The ulcer is 1 cm and nontender. She is not pregnant.$sc$,
  $qu$Which of the following is the most appropriate partner plan?$qu$,
  $op${"options": ["Treat neither partner, because both serologic results are negative", "Treat both partners, because any past partner is treated despite negative serology during today's visit", "Treat only the partner from 200 days ago and observe the partner from 30 days ago", "Wait for symptoms in the partner from 30 days ago before giving treatment", "Treat the 30-day partner despite negative serology, not the negative partner from 200 days ago"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "syphilis-partners-90-day-rule", "taskCategory": "clinical-intervention"}$op$,
  $ky$Treat the 30-day partner despite negative serology, not the negative partner from 200 days ago$ky$,
  $ex$Partners exposed within 90 days before diagnosis of early infection are treated even if serology is negative. The partner at 30 days qualifies. The partner at 200 days was exposed more than 90 days ago, serology was prompt and negative, so that partner is treated only if evaluation shows infection, which it does not. "Treat neither partner, because both serologic results are negative" is not the best choice because A partner exposed within 90 days before diagnosis of early infection is treated even if serology is negative. Negative serology does not clear the partner from 30 days ago. "Treat both partners, because any past partner is treated despite negative serology during today's visit" is not the best choice because The 90-day rule does not extend to every past partner. When exposure was more than 90 days ago and serology can be done promptly, treat only if the evaluation shows infection. "Treat only the partner from 200 days ago and observe the partner from 30 days ago" is not the best choice because The partner from 30 days ago is inside 90 days and is treated despite negative serology. The partner from 200 days ago is the one who is not treated when serology is already negative. "Wait for symptoms in the partner from 30 days ago before giving treatment" is not the best choice because Treatment of the partner exposed within 90 days does not wait for symptoms. Negative serology also does not delay that treatment.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'eac31ed83b588589c92b13c2034ea8b169ace56377ce8a2ab76855899c07fd06', false, NOW(), NOW(), 4,
  'syphilis-partners-90-day-rule', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'syphilis-partners-90-day-rule', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-295", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210296', 'usmle-step-2', 'ethics',
  $sc$A 44-year-old man who works as a tutoring center manager is seen in the student health clinic asking for a blood test he read about online. He has never had genital blisters and has no lesion today. He wants a blood test that would show whether he has ever caught the virus that causes recurrent genital sores. He has one partner and takes lisinopril 5 mg daily. He manages tutors for 30 students. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 128/82 mm Hg. Body mass index is 27 kg/m2. The genital examination shows no vesicle and no ulcer.$sc$,
  $qu$Which of the following is the most appropriate response to this request?$qu$,
  $op${"options": ["Do not offer routine HSV-2 serologic screening of a person without symptoms", "Offer HSV-2 serology once to every adult from ages 15 through 65", "Offer HSV IgM screening and skip type-specific antibody testing", "Offer HSV-2 serology every year even if no lesion ever appears", "Offer the HerpeSelect immunoblot as a general screening test today at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "social-sciences", "blueprintTopic": "hsv2-no-general-serologic-screen", "taskCategory": "health-maintenance"}$op$,
  $ky$Do not offer routine HSV-2 serologic screening of a person without symptoms$ky$,
  $ex$HSV-2 serologic screening of the general population is not recommended. He has no lesion and no history of blisters, so routine serology is not offered. "Offer HSV-2 serology once to every adult from ages 15 through 65" is not the best choice because Ages 15 to 65 are the universal range for a different virus screen. They are not an indication for HSV-2 serologic screening. "Offer HSV IgM screening and skip type-specific antibody testing" is not the best choice because HSV IgM testing is not recommended, and it is not a screening substitute. "Offer HSV-2 serology every year even if no lesion ever appears" is not the best choice because No yearly HSV-2 serologic schedule is recommended for people without lesions. "Offer the HerpeSelect immunoblot as a general screening test today at the present visit" is not the best choice because The HerpeSelect immunoblot is not the confirmatory method for a low-positive HerpeSelect EIA, and general-population serologic screening is not recommended in the first place.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "social-sciences", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '15612cec4661d2f8b85708e731f497b9e810368f9714cba7bd30c19d3cb2069c', false, NOW(), NOW(), 3,
  'hsv2-no-general-serologic-screen', 'social-sciences', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports.", "url": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'hsv2-no-general-serologic-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-296", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210297', 'usmle-step-2', 'infectious-disease',
  $sc$A 24-year-old woman who works as a surveyor is seen in the urgent care clinic for pelvic discomfort that started yesterday. A cervical nucleic acid test detects Neisseria gonorrhoeae. A cervical nucleic acid test for Chlamydia trachomatis is negative. She has no drug allergy, and intramuscular ceftriaxone is in stock. She mapped a construction site for 6 hours today. Temperature is 37.0°C, pulse is 86/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. She weighs 72 kg. Cervical motion tenderness is mild. A urine pregnancy test is negative.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Ceftriaxone 1 g intramuscularly once and no additional antibiotic", "Ceftriaxone 500 mg intramuscularly once and no additional antibiotic", "Cefixime 800 mg orally once as the preferred first choice", "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once", "Azithromycin 2 g orally once and no cephalosporin"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-ceftriaxone-500-under-150kg", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 500 mg intramuscularly once and no additional antibiotic$ky$,
  $ex$Ceftriaxone 500 mg intramuscularly once is the dose for the cervix when weight is under 150 kg. She weighs 72 kg. The chlamydia nucleic acid test is negative, so azithromycin is not added. "Ceftriaxone 1 g intramuscularly once and no additional antibiotic" is not the best choice because Ceftriaxone 1 g is the dose when weight is at least 150 kg, and it is also the conjunctivitis dose. Her weight is 72 kg and the site is the cervix. "Cefixime 800 mg orally once as the preferred first choice" is not the best choice because Cefixime 800 mg orally once is the alternative when intramuscular ceftriaxone is unavailable. It is in stock here, so cefixime is not the preferred first choice. "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once" is not the best choice because Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once is the regimen for cephalosporin allergy. She has no drug allergy. "Azithromycin 2 g orally once and no cephalosporin" is not the best choice because Azithromycin 2 g alone is not recommended.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '6c084294aa25cefe16d39ae16ce94e7ba9190bb554358dd547bcf8eb40dde53f', false, NOW(), NOW(), 1,
  'gc-ceftriaxone-500-under-150kg', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-ceftriaxone-500-under-150kg', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-297", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210298', 'usmle-step-2', 'infectious-disease',
  $sc$A 45-year-old man who works as a truck dispatcher is seen in the urology office for urethral burning that began this morning. A urine nucleic acid test detects Neisseria gonorrhoeae. A test for Chlamydia trachomatis is negative. He has no drug allergy. Intramuscular ceftriaxone is available. He dispatched 14 trucks on the overnight shift. Temperature is 36.9°C, pulse is 82/min, respirations are 15/min, and blood pressure is 142/86 mm Hg. He weighs 150 kg. Urethral discharge is present. The testicular examination is nontender.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once, because 150 kg is still the lower dose", "Ceftriaxone 1 g intramuscularly once only if the infection is in the eye", "Ceftriaxone 1 g intramuscularly once, because weight is at least 150 kg", "Cefixime 800 mg orally once, even though the injection is on the shelf", "Azithromycin 2 g orally once as the preferred regimen"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-ceftriaxone-1g-weight-150kg", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 1 g intramuscularly once, because weight is at least 150 kg$ky$,
  $ex$For the urethra, ceftriaxone is 500 mg intramuscularly once if weight is under 150 kg and 1 g if weight is at least 150 kg. He weighs 150 kg. The chlamydia test is negative, so no second drug is added. "Ceftriaxone 500 mg intramuscularly once, because 150 kg is still the lower dose" is not the best choice because Ceftriaxone 500 mg is for weight under 150 kg. His weight is 150 kg, which is not under that line. "Ceftriaxone 1 g intramuscularly once only if the infection is in the eye" is not the best choice because Conjunctivitis is treated with ceftriaxone 1 g, but the 1 g dose is also used at other sites when weight is at least 150 kg. The eye is not required for this dose. "Cefixime 800 mg orally once, even though the injection is on the shelf" is not the best choice because Cefixime 800 mg is used when intramuscular ceftriaxone is unavailable. The injection is available. "Azithromycin 2 g orally once as the preferred regimen" is not the best choice because Azithromycin 2 g alone is not recommended.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '2badbbcc86404f475b44c5272d34c7e465dc33d7e8c68d0f1fc348dbaae27e7f', false, NOW(), NOW(), 2,
  'gc-ceftriaxone-1g-weight-150kg', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-ceftriaxone-1g-weight-150kg', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-298", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210299', 'usmle-step-2', 'infectious-disease',
  $sc$A 30-year-old man who works as a plumber is seen in the sexual health clinic for rectal pain that started 2 days ago. A rectal nucleic acid test detects Neisseria gonorrhoeae. No specimen was sent for Chlamydia trachomatis. He has no drug allergy, and the injection is available. He worked a flooded basement for 5 hours yesterday. Temperature is 37.4°C, pulse is 90/min, respirations are 16/min, and blood pressure is 128/78 mm Hg. He weighs 80 kg. The rectal examination is tender. He has sex with women only.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once and no second drug at all", "Ceftriaxone 1 g intramuscularly once because the site is the rectum", "Ceftriaxone 500 mg intramuscularly once plus azithromycin 1 g orally once", "Ceftriaxone 500 mg intramuscularly once plus doxycycline 100 mg orally twice daily for 7 days", "Azithromycin 2 g orally once plus doxycycline 100 mg orally twice daily for 7 days at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-add-doxycycline-chlamydia-unknown", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 500 mg intramuscularly once plus doxycycline 100 mg orally twice daily for 7 days$ky$,
  $ex$Weight under 150 kg gets ceftriaxone 500 mg intramuscularly once. Because chlamydia has not been excluded, add doxycycline 100 mg orally twice daily for 7 days. He weighs 80 kg and no chlamydia test was sent. "Ceftriaxone 500 mg intramuscularly once and no second drug at all" is not the best choice because When chlamydia has not been excluded, doxycycline is added. No chlamydia specimen was sent, so ceftriaxone alone is incomplete. "Ceftriaxone 1 g intramuscularly once because the site is the rectum" is not the best choice because The rectum uses the same ceftriaxone dose as the cervix, urethra, and pharynx. Weight 80 kg is under 150 kg, so the dose is 500 mg, not 1 g. "Ceftriaxone 500 mg intramuscularly once plus azithromycin 1 g orally once" is not the best choice because The drug added when chlamydia is not excluded is doxycycline, not azithromycin. Azithromycin is not added to this regimen on the basis of an unknown chlamydia result. "Azithromycin 2 g orally once plus doxycycline 100 mg orally twice daily for 7 days at the present visit" is not the best choice because Azithromycin 2 g alone is not recommended, and it does not replace ceftriaxone. Doxycycline is the add-on, given with ceftriaxone.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'be1386a7eb1c186d3f24b2c978e0a5b7cd5051d31662137c85da5d6b99c824a3', false, NOW(), NOW(), 2,
  'gc-add-doxycycline-chlamydia-unknown', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-add-doxycycline-chlamydia-unknown', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-299", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210300', 'usmle-step-2', 'infectious-disease',
  $sc$A 22-year-old woman who works as a speech therapist is seen in the women's health clinic for vaginal discharge noted for 4 days. A cervical nucleic acid test detects Neisseria gonorrhoeae, and a cervical nucleic acid test for Chlamydia trachomatis is negative. She has no allergy. Ceftriaxone for injection is in the room. She led 7 therapy sessions today. Temperature is 36.9°C, pulse is 84/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. She weighs 68 kg. A urine pregnancy test is negative. There is no pelvic mass.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once plus azithromycin 1 g orally once", "Ceftriaxone 500 mg intramuscularly once plus azithromycin 2 g orally once", "Ceftriaxone 500 mg intramuscularly once plus doxycycline 100 mg orally twice daily for 7 days", "Ceftriaxone 1 g intramuscularly once because a negative chlamydia test raises the dose", "Ceftriaxone 500 mg intramuscularly once, without azithromycin or doxycycline"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-no-azithromycin-chlamydia-negative", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 500 mg intramuscularly once, without azithromycin or doxycycline$ky$,
  $ex$She weighs 68 kg, which is under 150 kg, so ceftriaxone 500 mg intramuscularly once treats the cervix. The chlamydia nucleic acid test is negative, so neither azithromycin nor doxycycline is added. "Ceftriaxone 500 mg intramuscularly once plus azithromycin 1 g orally once" is not the best choice because Azithromycin is not added when the chlamydia nucleic acid test is negative. One gram is also not the add-on named for gonococcal treatment. "Ceftriaxone 500 mg intramuscularly once plus azithromycin 2 g orally once" is not the best choice because Do not add azithromycin when the chlamydia nucleic acid test is negative. Two grams does not become indicated because the test is negative. "Ceftriaxone 500 mg intramuscularly once plus doxycycline 100 mg orally twice daily for 7 days" is not the best choice because Doxycycline 100 mg orally twice daily for 7 days is added only when chlamydia has not been excluded. This nucleic acid test is negative, so chlamydia has been excluded. "Ceftriaxone 1 g intramuscularly once because a negative chlamydia test raises the dose" is not the best choice because A negative chlamydia test does not change the ceftriaxone dose. One gram is for weight of at least 150 kg or for conjunctivitis. Her weight is 68 kg.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '08399e721c0e898f223b7e7e3b1e4a129589580e1c9a73b286250448e9935bfc', false, NOW(), NOW(), 3,
  'gc-no-azithromycin-chlamydia-negative', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-no-azithromycin-chlamydia-negative', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 3, "code": "S2N-300", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
CREATE TABLE qbi_usmle_s2_new_20261121_b03_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    's2n202611210201',
    's2n202611210202',
    's2n202611210203',
    's2n202611210204',
    's2n202611210205',
    's2n202611210206',
    's2n202611210207',
    's2n202611210208',
    's2n202611210209',
    's2n202611210210',
    's2n202611210211',
    's2n202611210212',
    's2n202611210213',
    's2n202611210214',
    's2n202611210215',
    's2n202611210216',
    's2n202611210217',
    's2n202611210218',
    's2n202611210219',
    's2n202611210220',
    's2n202611210221',
    's2n202611210222',
    's2n202611210223',
    's2n202611210224',
    's2n202611210225',
    's2n202611210226',
    's2n202611210227',
    's2n202611210228',
    's2n202611210229',
    's2n202611210230',
    's2n202611210231',
    's2n202611210232',
    's2n202611210233',
    's2n202611210234',
    's2n202611210235',
    's2n202611210236',
    's2n202611210237',
    's2n202611210238',
    's2n202611210239',
    's2n202611210240',
    's2n202611210241',
    's2n202611210242',
    's2n202611210243',
    's2n202611210244',
    's2n202611210245',
    's2n202611210246',
    's2n202611210247',
    's2n202611210248',
    's2n202611210249',
    's2n202611210250',
    's2n202611210251',
    's2n202611210252',
    's2n202611210253',
    's2n202611210254',
    's2n202611210255',
    's2n202611210256',
    's2n202611210257',
    's2n202611210258',
    's2n202611210259',
    's2n202611210260',
    's2n202611210261',
    's2n202611210262',
    's2n202611210263',
    's2n202611210264',
    's2n202611210265',
    's2n202611210266',
    's2n202611210267',
    's2n202611210268',
    's2n202611210269',
    's2n202611210270',
    's2n202611210271',
    's2n202611210272',
    's2n202611210273',
    's2n202611210274',
    's2n202611210275',
    's2n202611210276',
    's2n202611210277',
    's2n202611210278',
    's2n202611210279',
    's2n202611210280',
    's2n202611210281',
    's2n202611210282',
    's2n202611210283',
    's2n202611210284',
    's2n202611210285',
    's2n202611210286',
    's2n202611210287',
    's2n202611210288',
    's2n202611210289',
    's2n202611210290',
    's2n202611210291',
    's2n202611210292',
    's2n202611210293',
    's2n202611210294',
    's2n202611210295',
    's2n202611210296',
    's2n202611210297',
    's2n202611210298',
    's2n202611210299',
    's2n202611210300'
);
COMMIT;

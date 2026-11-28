-- Hidden Step 2 CK batch 4 of the 2026-11-21 set.
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
  's2n202611210301', 'usmle-step-2', 'infectious-disease',
  $sc$A 35-year-old woman who works as a second-grade teacher is seen in the community clinic for urethral-type burning and a positive cervical test. A cervical nucleic acid test detects Neisseria gonorrhoeae, and chlamydia nucleic acid testing is negative. Three years ago she had anaphylaxis, with wheezing and hypotension, after a cephalosporin. The throat was not tested. She teaches a class of 28 children. Temperature is 36.8°C, pulse is 88/min, respirations are 16/min, and blood pressure is 124/76 mm Hg. She weighs 90 kg. The oropharynx looks normal. A urine pregnancy test is negative.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once", "Ceftriaxone 500 mg intramuscularly once despite the prior anaphylaxis at this encounter", "Cefixime 800 mg orally once as the listed allergy regimen", "Ceftriaxone 1 g intramuscularly once because allergy raises the dose", "Azithromycin 2 g orally once and no aminoglycoside dose"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-allergy-gentamicin-plus-azithromycin", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once$ky$,
  $ex$For cephalosporin allergy, give gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once. The infection is cervical, not pharyngeal. That combination is not reliable enough to call a pharyngeal alternative, which is not this site. She weighs 90 kg. "Ceftriaxone 500 mg intramuscularly once despite the prior anaphylaxis at this encounter" is not the best choice because She has a severe cephalosporin allergy. Ceftriaxone is not given. The 500 mg dose would have fit a weight of 90 kg only if a cephalosporin could be used. "Cefixime 800 mg orally once as the listed allergy regimen" is not the best choice because Cefixime is a cephalosporin. The listed regimen for cephalosporin allergy is not cefixime. Cefixime 800 mg is the oral alternative when intramuscular ceftriaxone is unavailable and a cephalosporin can still be used. "Ceftriaxone 1 g intramuscularly once because allergy raises the dose" is not the best choice because Allergy does not increase the ceftriaxone dose to 1 g. One gram is for weight of at least 150 kg or for conjunctivitis. She should not receive ceftriaxone. "Azithromycin 2 g orally once and no aminoglycoside dose" is not the best choice because Azithromycin 2 g alone is not recommended. The allergy regimen pairs it with gentamicin.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '289443005c8add133f91a3d2f05c3c030151fa48b68d6ea2da4cd405c16beaa9', false, NOW(), NOW(), 3,
  'gc-allergy-gentamicin-plus-azithromycin', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-allergy-gentamicin-plus-azithromycin', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-301", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210302', 'usmle-step-2', 'infectious-disease',
  $sc$A 27-year-old woman who works as a lyric soprano is seen in the otolaryngology clinic for a sore throat that has lasted 6 days. A pharyngeal nucleic acid test detects Neisseria gonorrhoeae. Two years ago, ceftriaxone caused anaphylaxis with throat tightness and a blood pressure of 70/40 mm Hg. A chlamydia nucleic acid test from the throat is negative. She has a recital in 4 days. Temperature is 37.1°C, pulse is 92/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. She weighs 88 kg. The tonsils are injected without an abscess.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once during today's visit", "Consult a specialist, because no reliable pharyngeal alternative is listed", "Cefixime 800 mg orally once, accepting about 92% pharyngeal efficacy", "Azithromycin 2 g orally once and no other drug at all", "Ceftriaxone 500 mg intramuscularly once despite the anaphylaxis"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-pharynx-severe-allergy-consult", "taskCategory": "clinical-intervention"}$op$,
  $ky$Consult a specialist, because no reliable pharyngeal alternative is listed$ky$,
  $ex$For pharyngeal infection with severe ceftriaxone allergy, consult a specialist because no reliable alternative is listed. She had anaphylaxis after ceftriaxone, and the pharyngeal test detected Neisseria gonorrhoeae. "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once during today's visit" is not the best choice because Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once is the cephalosporin-allergy regimen at other sites. It is not reliable enough to call a pharyngeal alternative. "Cefixime 800 mg orally once, accepting about 92% pharyngeal efficacy" is not the best choice because Cefixime 800 mg orally once is the choice when intramuscular ceftriaxone is unavailable, and pharyngeal efficacy is limited, about 92%. It is not a reliable listed alternative for severe ceftriaxone allergy of the pharynx. "Azithromycin 2 g orally once and no other drug at all" is not the best choice because Azithromycin 2 g alone is not recommended. "Ceftriaxone 500 mg intramuscularly once despite the anaphylaxis" is not the best choice because Weight 88 kg would take ceftriaxone 500 mg if she could receive it. Prior anaphylaxis to ceftriaxone means she should not get that dose.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '96d424428176c48df38e97055d4d2215504b4fc37ade350094f22fcd0a42ae0f', false, NOW(), NOW(), 5,
  'gc-pharynx-severe-allergy-consult', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'gc-pharynx-severe-allergy-consult', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-302", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210303', 'usmle-step-2', 'infectious-disease',
  $sc$A 39-year-old man who works as a farm mechanic is seen in the rural health clinic for urethral discharge on a day the injection cupboard is empty. A urine nucleic acid test detects Neisseria gonorrhoeae, and a test for Chlamydia trachomatis is negative. He has no drug allergy. The clinic has no intramuscular ceftriaxone and the next delivery is in 3 days. He repaired a tractor this morning. Temperature is 36.8°C, pulse is 76/min, respirations are 14/min, and blood pressure is 130/82 mm Hg. He weighs 77 kg. There is no testicular pain.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Wait 3 days for ceftriaxone 500 mg intramuscularly and give nothing now", "Azithromycin 2 g orally once and no cephalosporin at all", "Cefixime 800 mg orally once for this urethral infection", "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once", "Doxycycline 100 mg orally twice daily for 7 days and no cephalosporin"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-cefixime-800-if-injection-unavailable", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Cefixime 800 mg orally once for this urethral infection$ky$,
  $ex$If intramuscular ceftriaxone is unavailable, give cefixime 800 mg orally once. About 92% refers to limited pharyngeal efficacy. This infection is urethral, the chlamydia test is negative, and he has no allergy. "Wait 3 days for ceftriaxone 500 mg intramuscularly and give nothing now" is not the best choice because When the injection is unavailable, an oral alternative is listed. Waiting is not required. His weight of 77 kg would have taken ceftriaxone 500 mg if the injection were here. "Azithromycin 2 g orally once and no cephalosporin at all" is not the best choice because Azithromycin 2 g alone is not recommended. "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once" is not the best choice because Gentamicin 240 mg plus azithromycin 2 g is the cephalosporin-allergy regimen. He has no allergy, and the problem is that the injection is unavailable. "Doxycycline 100 mg orally twice daily for 7 days and no cephalosporin" is not the best choice because Doxycycline is added when chlamydia is not excluded. The chlamydia test is negative, and doxycycline alone does not replace the cephalosporin.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '9606d7b4bfe1b19700fd74f9638ccee56dfbd095e90b8b4b5d30e7e0e79384d0', false, NOW(), NOW(), 2,
  'gc-cefixime-800-if-injection-unavailable', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-cefixime-800-if-injection-unavailable', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-303", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210304', 'usmle-step-2', 'infectious-disease',
  $sc$A 26-year-old man who works as a subway operator is seen in the employee health clinic for a sore throat after a new partner 9 days ago. A pharyngeal nucleic acid test detects Neisseria gonorrhoeae. A chlamydia nucleic acid test is negative. He has no drug allergy, and intramuscular ceftriaxone is on hand. A coworker suggested an all-oral macrolide. He operates 6 trains a shift. Temperature is 37.0°C, pulse is 80/min, respirations are 15/min, and blood pressure is 122/76 mm Hg. He weighs 64 kg. The pharynx is erythematous without exudate.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Azithromycin 2 g orally once as the preferred monotherapy", "Cefixime 800 mg orally once as the preferred pharyngeal regimen", "Ceftriaxone 1 g intramuscularly once because the site is the pharynx", "Ceftriaxone 500 mg intramuscularly once for this pharyngeal infection", "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-azithromycin-alone-not-recommended", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 500 mg intramuscularly once for this pharyngeal infection$ky$,
  $ex$The pharynx is treated with ceftriaxone 500 mg intramuscularly once when weight is under 150 kg. He weighs 64 kg, the chlamydia test is negative, and he has no allergy, so no second drug is added. "Azithromycin 2 g orally once as the preferred monotherapy" is not the best choice because Azithromycin 2 g alone is not recommended, including when the infection is pharyngeal. "Cefixime 800 mg orally once as the preferred pharyngeal regimen" is not the best choice because Cefixime 800 mg is used when intramuscular ceftriaxone is unavailable, and pharyngeal efficacy is limited at about 92%. The injection is available, so cefixime is not preferred. "Ceftriaxone 1 g intramuscularly once because the site is the pharynx" is not the best choice because The pharynx does not automatically take 1 g. One gram is for weight of at least 150 kg, or for conjunctivitis. His weight is 64 kg. "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once" is not the best choice because Gentamicin plus azithromycin is the cephalosporin-allergy regimen, and it is not reliable enough to call a pharyngeal alternative. He has no allergy.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '7fdd0d1c491eeb478d98c4a3de9de9634cf936439798ae85716a4415ab7292bc', false, NOW(), NOW(), 3,
  'gc-azithromycin-alone-not-recommended', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-azithromycin-alone-not-recommended', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-304", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210305', 'usmle-step-2', 'infectious-disease',
  $sc$A 21-year-old man who works as a lens fitter is seen in the eye clinic for a red right eye that began 2 days ago. A conjunctival nucleic acid test detects Neisseria gonorrhoeae. He has copious purulent discharge and no genital symptoms. He has no drug allergy. He fitted 9 pairs of glasses yesterday. The throat and urethra were not the tested sites. Temperature is 37.2°C, pulse is 90/min, respirations are 16/min, and blood pressure is 120/74 mm Hg. He weighs 70 kg. Visual acuity is 20/25 in the right eye.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once because weight is under 150 kg", "Cefixime 800 mg orally once for this eye infection", "Azithromycin 2 g orally once for this eye infection", "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once", "Ceftriaxone 1 g intramuscularly once for conjunctivitis"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-conjunctivitis-ceftriaxone-1g", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 1 g intramuscularly once for conjunctivitis$ky$,
  $ex$Conjunctivitis is treated with ceftriaxone 1 g intramuscularly once. That dose stands even though his weight of 70 kg is under 150 kg. "Ceftriaxone 500 mg intramuscularly once because weight is under 150 kg" is not the best choice because Ceftriaxone 500 mg is the dose for cervix, urethra, rectum, or pharynx when weight is under 150 kg. Conjunctivitis is a different dose. He weighs 70 kg, but the site is the eye. "Cefixime 800 mg orally once for this eye infection" is not the best choice because Cefixime 800 mg is the oral alternative when intramuscular ceftriaxone is unavailable for the usual sites. It is not the conjunctivitis regimen. "Azithromycin 2 g orally once for this eye infection" is not the best choice because Azithromycin 2 g alone is not recommended. "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g orally once" is not the best choice because Gentamicin 240 mg plus azithromycin 2 g is the cephalosporin-allergy regimen. He has no allergy, and it is not the listed conjunctivitis treatment.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '60e77232cbe47ecca6186d68dfb8226e65b7a4d69162e8b7a792830fa9afcabb', false, NOW(), NOW(), 3,
  'gc-conjunctivitis-ceftriaxone-1g', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-conjunctivitis-ceftriaxone-1g', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-305", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210306', 'usmle-step-2', 'infectious-disease',
  $sc$A 32-year-old woman who works as a social worker is seen in the hiv clinic for new vaginal discharge. The chart documents HIV-1 infection. Plasma HIV-1 RNA last month was below the assay limit. A cervical nucleic acid test now detects Neisseria gonorrhoeae, and a chlamydia nucleic acid test is negative. She has no drug allergy. She visited 5 clients yesterday. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. She weighs 83 kg. Intramuscular ceftriaxone is available. A urine pregnancy test is negative.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Ceftriaxone 500 mg intramuscularly once, the same regimen used without HIV", "Ceftriaxone 1 g intramuscularly once because HIV raises the dose", "Ceftriaxone 500 mg intramuscularly once plus azithromycin 2 g because of HIV", "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g because of HIV", "Cefixime 800 mg orally once as the preferred regimen in HIV"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-hiv-same-ceftriaxone-regimen", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Ceftriaxone 500 mg intramuscularly once, the same regimen used without HIV$ky$,
  $ex$People with HIV receive the same gonococcal regimen. Weight 83 kg is under 150 kg, so ceftriaxone 500 mg intramuscularly once is given. The chlamydia test is negative, so nothing is added. "Ceftriaxone 1 g intramuscularly once because HIV raises the dose" is not the best choice because People with HIV receive the same regimen. One gram is for weight of at least 150 kg or for conjunctivitis. She weighs 83 kg. "Ceftriaxone 500 mg intramuscularly once plus azithromycin 2 g because of HIV" is not the best choice because Azithromycin is not added when the chlamydia nucleic acid test is negative. HIV does not add a 2 g azithromycin dose. "Gentamicin 240 mg intramuscularly once plus azithromycin 2 g because of HIV" is not the best choice because Gentamicin plus azithromycin is for cephalosporin allergy. HIV does not move her to that regimen. She has no allergy. "Cefixime 800 mg orally once as the preferred regimen in HIV" is not the best choice because Cefixime 800 mg is for when intramuscular ceftriaxone is unavailable. HIV does not make it preferred, and the injection is available.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '4791a02c639de27fbfbc2e7ab54432ed252e0932019102216e7fb52eba591968', false, NOW(), NOW(), 2,
  'gc-hiv-same-ceftriaxone-regimen', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-hiv-same-ceftriaxone-regimen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-306", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210307', 'usmle-step-2', 'infectious-disease',
  $sc$A 29-year-old woman who works as a choir director is seen in the infectious disease clinic in the treatment room after an injection. A pharyngeal nucleic acid test detected Neisseria gonorrhoeae, and a chlamydia nucleic acid test was negative. She just received ceftriaxone 500 mg intramuscularly. She has no allergy. She directs 3 rehearsals a week and has a concert in 11 days. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. She weighs 70 kg. The pharynx is mildly red. She has had no sex since the swab.$sc$,
  $qu$Which of the following is the most appropriate follow-up plan?$qu$,
  $op${"options": ["No test of cure and no retest, because a recommended regimen was used during today's visit", "Test of cure with culture or NAAT at 7 to 14 days, and retest at 3 months", "Test of cure at about 4 weeks only, then stop further testing", "Repeat the nucleic acid test tomorrow and then stop", "Follow a serum titer at 7 days instead of a throat specimen"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-pharynx-test-of-cure-7-14-days", "taskCategory": "clinical-intervention"}$op$,
  $ky$Test of cure with culture or NAAT at 7 to 14 days, and retest at 3 months$ky$,
  $ex$Pharyngeal infection needs a test of cure at 7 to 14 days, by culture or NAAT. The patient is also retested at 3 months. She weighs 70 kg and received ceftriaxone 500 mg, a recommended regimen for that weight. "No test of cure and no retest, because a recommended regimen was used during today's visit" is not the best choice because No test of cure applies to uncomplicated urogenital or rectal infection treated with a recommended regimen. This infection is pharyngeal, so that exception does not apply. A 3-month retest is still part of follow-up. "Test of cure at about 4 weeks only, then stop further testing" is not the best choice because A test of cure at about 4 weeks is the pregnancy timing after chlamydia treatment, not the pharyngeal interval of 7 to 14 days. "Repeat the nucleic acid test tomorrow and then stop" is not the best choice because Tomorrow is earlier than 7 days. The pharyngeal test of cure is at 7 to 14 days. "Follow a serum titer at 7 days instead of a throat specimen" is not the best choice because A serum titer is not the pharyngeal test of cure. Culture or NAAT of the throat is used.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '5f01d9e27c2027b46450c33f0d2aa641b529e94e2f3a3fae8574e3798a618914', false, NOW(), NOW(), 3,
  'gc-pharynx-test-of-cure-7-14-days', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'gc-pharynx-test-of-cure-7-14-days', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-307", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210308', 'usmle-step-2', 'infectious-disease',
  $sc$A 34-year-old woman who works as a hotel concierge is seen in the sexual health clinic asking for a prescription her partner can take at home. A cervical nucleic acid test detects Neisseria gonorrhoeae, and a chlamydia nucleic acid test is negative. Her male partner from 8 days ago cannot come to clinic. Expedited partner therapy is legal in this state. She has no drug allergy and weighs 66 kg. She covered the front desk for 8 hours. Temperature is 36.7°C, pulse is 80/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. She will receive her own ceftriaxone injection today. The partner has no known cephalosporin allergy.$sc$,
  $qu$Which of the following is the most appropriate regimen for the partner?$qu$,
  $op${"options": ["Ceftriaxone 500 mg sent home for the partner to inject alone", "Cefixime 800 mg orally once plus doxycycline 100 mg orally twice daily for 7 days", "Cefixime 800 mg orally once for the partner, with no second drug", "Azithromycin 2 g orally once for the partner and no cephalosporin", "No expedited drug, because shared decision-making replaces a regimen for every partner"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "gc-ept-cefixime-800-chlamydia-excluded", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Cefixime 800 mg orally once for the partner, with no second drug$ky$,
  $ex$Where expedited partner therapy is legal and chlamydia has been excluded, the partner dose is cefixime 800 mg orally once. Her chlamydia nucleic acid test is negative, and the partner is a man who is not described as a man who has sex with men. "Ceftriaxone 500 mg sent home for the partner to inject alone" is not the best choice because The expedited regimen that is listed, where legal, is oral cefixime, not a take-home injection of ceftriaxone. Her own weight of 66 kg would take ceftriaxone 500 mg in clinic. "Cefixime 800 mg orally once plus doxycycline 100 mg orally twice daily for 7 days" is not the best choice because Doxycycline 100 mg orally twice daily for 7 days is added to expedited cefixime only when chlamydia status is unknown. Here chlamydia has been excluded. "Azithromycin 2 g orally once for the partner and no cephalosporin" is not the best choice because Azithromycin 2 g alone is not recommended. "No expedited drug, because shared decision-making replaces a regimen for every partner" is not the best choice because Shared decision-making rather than routine expedited therapy applies to men who have sex with men, because of undiagnosed HIV and limited data. It is not a ban on expedited cefixime for this woman's male partner.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'a8f91fc2f67be9a0081174988ac3b5cf41e4e4a3d3c41c6beaf83c02b611e8b0', false, NOW(), NOW(), 3,
  'gc-ept-cefixime-800-chlamydia-excluded', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Gonococcal Infections Among Adolescents and Adults.", "url": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'gc-ept-cefixime-800-chlamydia-excluded', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-308", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/gonorrhea-adults.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210309', 'usmle-step-2', 'infectious-disease',
  $sc$A 23-year-old woman who works as a veterinary assistant is seen in the primary care clinic for a cervical screening test that was collected last week. A cervical nucleic acid test detects Chlamydia trachomatis and does not detect Neisseria gonorrhoeae. She is not pregnant, has no drug allergy, and can take tablets. A urine pregnancy test today is negative. She held 4 clinic appointments for animals this morning. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. She weighs 61 kg. There is no cervical motion tenderness.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Azithromycin 1 g orally once as the preferred regimen", "Levofloxacin 500 mg orally once daily for 7 days as the preferred regimen", "Doxycycline 100 mg orally once daily for 3 days as a short course", "Doxycycline 100 mg orally twice daily for 7 days as preferred therapy", "Ceftriaxone 500 mg intramuscularly once for this cervical result"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ct-doxycycline-preferred-nonpregnant", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Doxycycline 100 mg orally twice daily for 7 days as preferred therapy$ky$,
  $ex$The preferred nonpregnant regimen is doxycycline 100 mg orally twice daily for 7 days. She is not pregnant, and Neisseria gonorrhoeae was not detected, so ceftriaxone is not required for this result. "Azithromycin 1 g orally once as the preferred regimen" is not the best choice because Azithromycin 1 g orally once is an alternative, not the preferred nonpregnant regimen. "Levofloxacin 500 mg orally once daily for 7 days as the preferred regimen" is not the best choice because Levofloxacin 500 mg orally once daily for 7 days is another alternative, not the preferred regimen. "Doxycycline 100 mg orally once daily for 3 days as a short course" is not the best choice because The doxycycline course is 7 days, twice daily, not 3 days once daily. "Ceftriaxone 500 mg intramuscularly once for this cervical result" is not the best choice because Ceftriaxone is not the treatment for this organism when Neisseria gonorrhoeae was not detected. Her weight of 61 kg does not create a ceftriaxone indication.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '6cc7e78aa9687536659fccf42d51152f35514fd8417f76b20c3e2eddce45d7a0', false, NOW(), NOW(), 1,
  'ct-doxycycline-preferred-nonpregnant', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ct-doxycycline-preferred-nonpregnant', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-309", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210310', 'usmle-step-2', 'infectious-disease',
  $sc$A 37-year-old man who works as a rideshare driver is seen in the men's clinic for rectal discomfort after a swab last week. A rectal nucleic acid test detects Chlamydia trachomatis and does not detect Neisseria gonorrhoeae. He is not pregnant, has no allergy, and drove 11 hours yesterday. He asks whether a single macrolide tablet is the best choice for the rectum. Temperature is 36.8°C, pulse is 70/min, respirations are 14/min, and blood pressure is 126/80 mm Hg. He weighs 88 kg. The rectal examination shows no abscess.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Azithromycin 1 g orally once, because rectal cure is higher with it", "Azithromycin 2 g orally once as preferred rectal therapy", "Levofloxacin 500 mg orally once daily for 7 days as the preferred regimen", "Ceftriaxone 500 mg intramuscularly once because the site is the rectum", "Doxycycline 100 mg orally twice daily for 7 days as preferred therapy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ct-rectal-prefer-doxycycline", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Doxycycline 100 mg orally twice daily for 7 days as preferred therapy$ky$,
  $ex$Doxycycline 100 mg orally twice daily for 7 days is the preferred nonpregnant regimen. Rectal cure with azithromycin was lower, which is why doxycycline is preferred here. Neisseria gonorrhoeae was not detected. "Azithromycin 1 g orally once, because rectal cure is higher with it" is not the best choice because Azithromycin 1 g is an alternative, not preferred. Rectal cure with azithromycin was lower, so it is not the better rectal choice. "Azithromycin 2 g orally once as preferred rectal therapy" is not the best choice because Azithromycin 2 g is not the chlamydia regimen. The alternative azithromycin dose that is stated is 1 g once, and it is still not preferred. "Levofloxacin 500 mg orally once daily for 7 days as the preferred regimen" is not the best choice because Levofloxacin 500 mg orally once daily for 7 days is an alternative, not the preferred regimen. "Ceftriaxone 500 mg intramuscularly once because the site is the rectum" is not the best choice because Ceftriaxone is not added for the rectum when Neisseria gonorrhoeae was not detected. His weight of 88 kg is under 150 kg, but that dose is not the treatment for this result.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '3c12668f85d8c3aa61623995376314e2bfe4df84b71c65ee86dd7fb21823689b', false, NOW(), NOW(), 4,
  'ct-rectal-prefer-doxycycline', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ct-rectal-prefer-doxycycline', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-310", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210311', 'usmle-step-2', 'infectious-disease',
  $sc$A 51-year-old woman who works as a bank teller is seen in the general medicine clinic to review a one-time blood test drawn at a physical. She was born in 1975, has never injected drugs, and has no jaundice. The hepatitis C virus antibody is reactive. She counted deposits for 6 hours today and takes no medicines. She asks whether tablets should start tonight. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. Alanine aminotransferase is 31 U/L. Body mass index is 27 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Confirm with an HCV RNA assay before any treatment is started", "Repeat the antibody next week and treat if it is still reactive", "Start antiviral treatment from the reactive antibody alone", "Confirm only if the birth year falls from 1945 through 1965", "Do no further test, because a reactive antibody is already enough to treat"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "hcv-reactive-antibody-confirm-with-pcr", "taskCategory": "diagnosis"}$op$,
  $ky$Confirm with an HCV RNA assay before any treatment is started$ky$,
  $ex$Adults are screened with a hepatitis C antibody test, then confirmatory PCR if the antibody is positive. Her antibody is reactive, so an HCV RNA assay comes before any treatment decision. "Repeat the antibody next week and treat if it is still reactive" is not the best choice because A second antibody test is not the confirmatory step. Confirmation is an RNA assay, and treatment does not start from antibody results. "Start antiviral treatment from the reactive antibody alone" is not the best choice because Do not start treatment from an antibody result alone. She needs confirmatory testing first. "Confirm only if the birth year falls from 1945 through 1965" is not the best choice because Birth years 1945 through 1965 were the old cohort limit, which has been replaced. Confirmation is not restricted to that cohort. She was born in 1975. "Do no further test, because a reactive antibody is already enough to treat" is not the best choice because A reactive antibody is the screening result. It is not, by itself, enough to start treatment.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'bbcd60c0efae6bd10e498aedbd24d481d79f31b78bbfcca8559726b066101043', false, NOW(), NOW(), 3,
  'hcv-reactive-antibody-confirm-with-pcr', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Hepatitis C Virus Infection in Adolescents and Adults.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'hcv-reactive-antibody-confirm-with-pcr', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-311", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/hepatitis-c-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210312', 'usmle-step-2', 'infectious-disease',
  $sc$A 27-year-old woman who works as a medical records clerk is seen in the obstetric clinic at a routine prenatal visit. She is at 22 weeks of gestation. A cervical nucleic acid test detects Chlamydia trachomatis and does not detect Neisseria gonorrhoeae. She has no drug allergy. She filed 40 charts this morning and takes a prenatal vitamin. Temperature is 36.6°C, pulse is 88/min, respirations are 16/min, and blood pressure is 112/68 mm Hg. The fetal heart rate is 148/min. She weighs 73 kg.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Doxycycline 100 mg orally twice daily for 7 days", "Azithromycin 1 g orally once", "Levofloxacin 500 mg orally once daily for 7 days", "Azithromycin 2 g orally once", "Ceftriaxone 500 mg intramuscularly once"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ct-pregnancy-azithromycin-not-doxycycline", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Azithromycin 1 g orally once$ky$,
  $ex$In pregnancy, the regimen is azithromycin 1 g orally once. She is at 22 weeks, which is the second trimester, and doxycycline is not used then. "Doxycycline 100 mg orally twice daily for 7 days" is not the best choice because Doxycycline 100 mg orally twice daily for 7 days is the preferred nonpregnant regimen. It is not used in the second or third trimester. She is at 22 weeks. "Levofloxacin 500 mg orally once daily for 7 days" is not the best choice because Levofloxacin 500 mg orally once daily for 7 days is a nonpregnant alternative, not the regimen stated for pregnancy. "Azithromycin 2 g orally once" is not the best choice because Azithromycin 2 g is not the pregnancy dose for this organism. The pregnancy dose is 1 g once. "Ceftriaxone 500 mg intramuscularly once" is not the best choice because Ceftriaxone is not indicated by this result. Neisseria gonorrhoeae was not detected, and her weight of 73 kg does not change that.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '96523d10ba83dbec4459afee5a5ddf00768be95636ed59afbf0d1399085c7949', false, NOW(), NOW(), 3,
  'ct-pregnancy-azithromycin-not-doxycycline', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ct-pregnancy-azithromycin-not-doxycycline', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-312", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210313', 'usmle-step-2', 'infectious-disease',
  $sc$A 30-year-old woman who works as a prenatal yoga teacher is seen in the midwifery office just after swallowing a supervised dose. She is at 24 weeks of gestation and just took azithromycin 1 g. A cervical nucleic acid test 5 days ago detected Chlamydia trachomatis and did not detect Neisseria gonorrhoeae. She teaches 3 classes a week. The father of the baby has been told to be treated. Temperature is 36.7°C, pulse is 86/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. The fetal heart rate is 152/min. She weighs 69 kg and kept the tablet down.$sc$,
  $qu$Which of the following is the most appropriate follow-up testing plan?$qu$,
  $op${"options": ["No test of cure, and retest only if discharge returns", "Test of cure by culture or NAAT at 7 to 14 days", "Test of cure in about 4 weeks and another test at 3 months", "A serum titer in 2 weeks instead of a repeat nucleic acid test", "One repeat nucleic acid test tomorrow, then no further test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ct-pregnancy-test-of-cure-and-retest", "taskCategory": "clinical-intervention"}$op$,
  $ky$Test of cure in about 4 weeks and another test at 3 months$ky$,
  $ex$In pregnancy, a test of cure is done at about 4 weeks, and she is retested again at 3 months. She took azithromycin 1 g at 24 weeks. "No test of cure, and retest only if discharge returns" is not the best choice because Pregnancy needs a test of cure. Waiting for discharge to return is not the plan. "Test of cure by culture or NAAT at 7 to 14 days" is not the best choice because A test of cure at 7 to 14 days, by culture or NAAT, is the pharyngeal gonococcal interval, not the pregnancy interval of about 4 weeks. "A serum titer in 2 weeks instead of a repeat nucleic acid test" is not the best choice because Follow-up uses a nucleic acid test, not a serum titer in place of it. "One repeat nucleic acid test tomorrow, then no further test" is not the best choice because Tomorrow is not about 4 weeks, and a single next-day test would also skip the 3-month retest.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '0f701a226c4eff8f1b1083f8080a1da3105484c064411cb2470babcd55f707f1', false, NOW(), NOW(), 4,
  'ct-pregnancy-test-of-cure-and-retest', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Chlamydial Infections.", "url": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'ct-pregnancy-test-of-cure-and-retest', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-313", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/chlamydia.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210314', 'usmle-step-2', 'infectious-disease',
  $sc$A 43-year-old man who works as a cabinetmaker is seen in the health department clinic for a scheduled titer 6 months after treatment. Both specimens were tested by the same RPR method. The RPR was 1:32 six months ago and is 1:8 today. A treponemal antibody test was positive at the start. He built 3 cabinet doors this week and has no new ulcer. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. He weighs 86 kg. The skin examination shows no rash.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["The fall is too small, because an eightfold change is required", "The two results cannot be compared unless one of them is a VDRL", "A one-dilution change would have meant the same thing", "This is a meaningful fourfold, two-dilution change on the same test", "Titer changes are ignored, and only a new treponemal test matters at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "syphilis-fourfold-titer-change", "taskCategory": "interpretation"}$op$,
  $ky$This is a meaningful fourfold, two-dilution change on the same test$ky$,
  $ex$A fourfold change, which is two dilutions, is the meaningful titer change when the same test method is used. From 1:32 to 1:8 on RPR is fourfold and two dilutions. "The fall is too small, because an eightfold change is required" is not the best choice because An eightfold rule is not the standard. The meaningful change is fourfold, which is two dilutions. "The two results cannot be compared unless one of them is a VDRL" is not the best choice because The comparison uses the same test method. Both results are RPR, so a different method is not required. "A one-dilution change would have meant the same thing" is not the best choice because One dilution, such as a twofold change, is not the meaningful change. Two dilutions are required. "Titer changes are ignored, and only a new treponemal test matters at the present visit" is not the best choice because The quantitative nontreponemal titer is how this change is judged. A new treponemal test does not replace that comparison.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "interpretation"]$tg$,
  's2-new-20261121-hidden', '736cce9ba2392b068fc0c9f5d80256c231843ff3f40cafb5faf2a2558cae0f6f', false, NOW(), NOW(), 3,
  'syphilis-fourfold-titer-change', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'syphilis-fourfold-titer-change', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-314", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210315', 'usmle-step-2', 'infectious-disease',
  $sc$A 50-year-old woman who works as a translator is seen in the infectious disease clinic for a titer repeated on the same assay. The earlier RPR was 1:32, and today's RPR is 1:16. Both were run by the RPR method. The original treponemal antibody test was positive. She translated 6 meetings this week and feels well. There is no new rash. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. She weighs 64 kg. The oral examination shows no patch.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["This twofold change is already the meaningful titer change", "The results must be repeated on a VDRL before any comparison during today's visit", "Only a titer that does not change can be called meaningful", "Any fall in titer is meaningless, and only a rise counts", "This is not the meaningful change, because a fourfold change is required"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "syphilis-twofold-titer-not-meaningful", "taskCategory": "interpretation"}$op$,
  $ky$This is not the meaningful change, because a fourfold change is required$ky$,
  $ex$A fourfold change, equal to two dilutions, is the meaningful titer change on the same method. From 1:32 to 1:16 is only twofold, one dilution, so it is not that change. "This twofold change is already the meaningful titer change" is not the best choice because From 1:32 to 1:16 is twofold, one dilution. That is not the meaningful fourfold change. "The results must be repeated on a VDRL before any comparison during today's visit" is not the best choice because The same test method is what the comparison requires. Both results are already RPR, so a VDRL is not needed to make the comparison. The size of the change is the problem. "Only a titer that does not change can be called meaningful" is not the best choice because An unchanged titer is not the definition of a meaningful change. The meaningful change is fourfold. "Any fall in titer is meaningless, and only a rise counts" is not the best choice because The direction is not limited to a rise. The standard is the size of the change, fourfold, using the same test. This fall is simply too small.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "interpretation"]$tg$,
  's2-new-20261121-hidden', '8cd819bc06f03880a1fc9a57a2c659e5f85472ed7900fc869f51fed45d171797', false, NOW(), NOW(), 4,
  'syphilis-twofold-titer-not-meaningful', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'syphilis-twofold-titer-not-meaningful', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-315", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210316', 'usmle-step-2', 'infectious-disease',
  $sc$A 25-year-old woman who works as a bookstore buyer is seen in the labor and delivery triage 8 hours after an intramuscular penicillin dose. She is at 18 weeks of gestation. A painless genital ulcer has been present for 2 weeks. The RPR is 1:64 and a treponemal antibody test is positive. She received benzathine penicillin G this morning. She now has chills and muscle aches, without hives or wheezing. She buys stock for 3 store branches. Temperature is 38.6°C, pulse is 110/min, respirations are 18/min, and blood pressure is 118/72 mm Hg. The fetal heart rate is 156/min. There is no rash of hives. She weighs 62 kg.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["This reaction within 24 hours is not an allergy and must not delay treatment", "Record a penicillin allergy and do not give penicillin again in pregnancy at this encounter", "Switch the rest of pregnancy treatment to a course of oral doxycycline", "Give Bicillin C-R today as treatment for this reaction", "Delay any further penicillin treatment until after delivery"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "syphilis-herxheimer-not-an-allergy", "taskCategory": "diagnosis"}$op$,
  $ky$This reaction within 24 hours is not an allergy and must not delay treatment$ky$,
  $ex$A Jarisch-Herxheimer reaction within 24 hours is not an allergy and must not delay pregnancy treatment. She is at 18 weeks, the dose was 8 hours ago, and there is no sign of anaphylaxis. "Record a penicillin allergy and do not give penicillin again in pregnancy at this encounter" is not the best choice because Fever and chills 8 hours after the dose, without hives, are not labeled as a penicillin allergy. The reaction within 24 hours is not an allergy. "Switch the rest of pregnancy treatment to a course of oral doxycycline" is not the best choice because Switching to doxycycline replaces penicillin and delays pregnancy treatment. This reaction is not an allergy, and pregnancy treatment must not be delayed. "Give Bicillin C-R today as treatment for this reaction" is not the best choice because Bicillin C-R is the wrong penicillin product. It is not a treatment for this reaction. Benzathine penicillin G is Bicillin L-A. "Delay any further penicillin treatment until after delivery" is not the best choice because The reaction must not delay pregnancy treatment. Waiting until after delivery delays treatment.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'b844783929ee98557b8a3f50ea518eed0be660b27270d4c079b4e3f7f677e977', false, NOW(), NOW(), 4,
  'syphilis-herxheimer-not-an-allergy', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'syphilis-herxheimer-not-an-allergy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-316", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210317', 'usmle-step-2', 'infectious-disease',
  $sc$A 33-year-old woman who works as a paralegal is seen in the maternal-fetal clinic for a painless ulcer and a new positive blood test. She is at 16 weeks of gestation. The RPR is 1:64 and a treponemal antibody test is positive. The ulcer has been present for 2 weeks. Five years ago, penicillin caused anaphylaxis with wheezing and a recorded blood pressure of 78/40 mm Hg. She prepared 12 depositions this week. Temperature is 36.6°C, pulse is 90/min, respirations are 16/min, and blood pressure is 116/70 mm Hg. The fetal heart rate is 150/min. She weighs 71 kg. There is no treatment dose in the chart yet.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Substitute oral doxycycline and do not use penicillin", "Desensitize to penicillin and then treat with benzathine penicillin G", "Give Bicillin C-R now and skip desensitization entirely", "Delay all penicillin treatment until after delivery", "Give azithromycin 2 g orally once as the pregnancy substitute at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "syphilis-pregnancy-penicillin-desensitize", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Desensitize to penicillin and then treat with benzathine penicillin G$ky$,
  $ex$Penicillin allergy in pregnancy is managed by desensitization, not by substituting another drug. Treatment is benzathine penicillin G. She is at 16 weeks and had anaphylaxis after penicillin. "Substitute oral doxycycline and do not use penicillin" is not the best choice because Doxycycline would be substituting another drug. In pregnancy, penicillin allergy is handled by desensitization. "Give Bicillin C-R now and skip desensitization entirely" is not the best choice because Bicillin C-R is the wrong penicillin product. The product to use is benzathine penicillin G, which is Bicillin L-A, after desensitization. Skipping desensitization is not safe after anaphylaxis. "Delay all penicillin treatment until after delivery" is not the best choice because Delaying until after delivery delays pregnancy treatment. Allergy is a reason to desensitize, not to wait until birth. "Give azithromycin 2 g orally once as the pregnancy substitute at the present visit" is not the best choice because Azithromycin 2 g is not a substitute for penicillin in this pregnancy. Another drug is not substituted.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '8f833033059983bc096d7ae5df7221dc60d14d114c44f0103c6a8e2901adedb2', false, NOW(), NOW(), 5,
  'syphilis-pregnancy-penicillin-desensitize', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'syphilis-pregnancy-penicillin-desensitize', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-317", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210318', 'usmle-step-2', 'infectious-disease',
  $sc$A 48-year-old man who works as a machinist is seen in the infectious disease clinic with a pharmacy bag in his hand. The RPR is reactive at 1:16 and a treponemal antibody test is positive. A painless ulcer appeared 10 days ago. He has no penicillin allergy. The pharmacy dispensed Bicillin C-R for today's injection. He ran a lathe for 8 hours. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 132/82 mm Hg. He weighs 91 kg. There is no rash on the palms or soles.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Inject the dispensed Bicillin C-R at this visit today", "Substitute doxycycline because the two penicillin labels are confusing", "Give benzathine penicillin G, which is Bicillin L-A, not Bicillin C-R", "Desensitize before giving the dispensed Bicillin C-R", "Give azithromycin 2 g orally once instead of either penicillin"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "syphilis-bicillin-la-not-cr", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Give benzathine penicillin G, which is Bicillin L-A, not Bicillin C-R$ky$,
  $ex$Use benzathine penicillin G, which is Bicillin L-A. Bicillin C-R is the wrong product. He has no penicillin allergy, and the RPR is 1:16 with a positive treponemal test. "Inject the dispensed Bicillin C-R at this visit today" is not the best choice because Bicillin C-R is the wrong penicillin product. It should not be injected for this treatment. "Substitute doxycycline because the two penicillin labels are confusing" is not the best choice because There is no need to substitute another drug. The correct penicillin product is available as a choice: benzathine penicillin G. "Desensitize before giving the dispensed Bicillin C-R" is not the best choice because Desensitization is for penicillin allergy in pregnancy, or when allergy blocks penicillin. He has no allergy, and desensitization does not make Bicillin C-R the right product. "Give azithromycin 2 g orally once instead of either penicillin" is not the best choice because Azithromycin 2 g does not replace benzathine penicillin G.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '53bdf74b8561e4d28521dfbd196f3ae44850582aa87493234d2c7e62febc5083', false, NOW(), NOW(), 2,
  'syphilis-bicillin-la-not-cr', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. Syphilis.", "url": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'syphilis-bicillin-la-not-cr', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-318", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/syphilis.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210319', 'usmle-step-2', 'infectious-disease',
  $sc$A 36-year-old woman who works as a lab courier is seen in the primary care clinic to review a blood test ordered at a health fair. She has never noticed genital blisters. The HerpeSelect EIA index is 2.4. No confirmatory method has been run. She delivered 18 specimen bags yesterday and takes no antivirals. She has one partner. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. The genital examination shows no vesicle. Body mass index is 24 kg/m2.$sc$,
  $qu$Which of the following is the most appropriate interpretation?$qu$,
  $op${"options": ["Repeat the same HerpeSelect EIA next week and accept 2.4 if it persists", "Confirm the result with the HerpeSelect immunoblot alone", "Order an HSV IgM assay as the confirmatory test", "Confirm with a Biokit or a Western blot, not the HerpeSelect immunoblot", "Treat the index of 2.4 as a high positive because it is above 3.0"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "hsv-low-positive-eia-confirm", "taskCategory": "diagnosis"}$op$,
  $ky$Confirm with a Biokit or a Western blot, not the HerpeSelect immunoblot$ky$,
  $ex$A HerpeSelect EIA index from 1.1 to 3.0 is a low positive and needs a different confirmatory method, a Biokit or a Western blot, not the HerpeSelect immunoblot. Her index is 2.4. "Repeat the same HerpeSelect EIA next week and accept 2.4 if it persists" is not the best choice because Repeating the same EIA is not the stated confirmatory method for an index in the low-positive range. "Confirm the result with the HerpeSelect immunoblot alone" is not the best choice because The HerpeSelect immunoblot is not the confirmatory method for a low-positive HerpeSelect EIA. "Order an HSV IgM assay as the confirmatory test" is not the best choice because HSV IgM testing is not recommended, and it is not the confirmatory method for this low-positive EIA. "Treat the index of 2.4 as a high positive because it is above 3.0" is not the best choice because An index of 2.4 is not above 3.0. It sits inside 1.1 to 3.0, which is the low-positive range that needs a different confirmatory test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'e4c959377b59fbff8cf8a3c5d5ae951ac8ce7b74e0b94421bf2484c80b118089', false, NOW(), NOW(), 4,
  'hsv-low-positive-eia-confirm', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports.", "url": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'hsv-low-positive-eia-confirm', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-319", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210320', 'usmle-step-2', 'infectious-disease',
  $sc$A 41-year-old woman who works as a massage therapist is seen in the dermatology clinic during a recurrence of painful genital vesicles. Similar vesicles have occurred 4 times in 2 years. A prior type-specific antibody test was positive for HSV-2. A colleague added an IgM order to today's laboratory slip. She has 6 clients booked this afternoon and has no fever. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 120/76 mm Hg. Three vesicles are present on the labium. She weighs 67 kg.$sc$,
  $qu$Which of the following is the most appropriate plan for the IgM order?$qu$,
  $op${"options": ["Send the HSV IgM test to confirm this recurrence", "Send HSV IgM together with a HerpeSelect immunoblot", "Cancel treatment and rely on topical acyclovir plus the IgM", "Send HSV IgM because each recurrence needs a new serologic test", "Do not order HSV IgM testing for this recurrence"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "hsv-igm-not-recommended", "taskCategory": "interpretation"}$op$,
  $ky$Do not order HSV IgM testing for this recurrence$ky$,
  $ex$HSV IgM testing is not recommended. She already has a positive type-specific HSV-2 antibody and a typical recurrence, 4 times in 2 years. "Send the HSV IgM test to confirm this recurrence" is not the best choice because HSV IgM testing is not recommended. A recurrence with a prior positive type-specific HSV-2 antibody does not create an indication for IgM. "Send HSV IgM together with a HerpeSelect immunoblot" is not the best choice because HSV IgM is not recommended. The HerpeSelect immunoblot is also not the confirmatory method for a low-positive HerpeSelect EIA, and no such index is in front of you. "Cancel treatment and rely on topical acyclovir plus the IgM" is not the best choice because Topical acyclovir has minimal benefit. Canceling systemic care and adding IgM is not the plan. IgM testing is not recommended. "Send HSV IgM because each recurrence needs a new serologic test" is not the best choice because Recurrence does not require a new IgM test. HSV IgM testing is not recommended.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "interpretation"]$tg$,
  's2-new-20261121-hidden', '60d81908412c2e216c23bee59ee2f0c6becf2f4150466d27d75d1c0ab8dbf89d', false, NOW(), NOW(), 3,
  'hsv-igm-not-recommended', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports.", "url": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'hsv-igm-not-recommended', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-320", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210321', 'usmle-step-2', 'infectious-disease',
  $sc$A 19-year-old woman who works as a sommelier is seen in the urgent care clinic for painful genital vesicles that began 2 days ago. She has never had this rash before. There are grouped vesicles on the vulva and it hurts to pass urine. She has no drug allergy. She worked a tasting of 12 wines last night. A friend offered a tube of cream as the only treatment. Temperature is 37.0°C, pulse is 88/min, respirations are 16/min, and blood pressure is 116/72 mm Hg. She weighs 58 kg. A urine pregnancy test is negative. There is no pharyngeal exudate.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["A 7-to-10-day oral regimen, because topical acyclovir has minimal benefit", "Topical acyclovir as the only treatment for this first episode at this encounter", "Topical acyclovir plus an IgM blood test today", "Valacyclovir 500 mg orally once daily for only 3 days", "Famciclovir 250 mg orally once daily for only 2 days"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "hsv-topical-acyclovir-minimal-benefit", "taskCategory": "pharmacotherapy"}$op$,
  $ky$A 7-to-10-day oral regimen, because topical acyclovir has minimal benefit$ky$,
  $ex$Topical acyclovir has minimal benefit. A first episode is treated orally for 7 to 10 days, for example acyclovir 400 mg 3 times daily, valacyclovir 1 g twice daily, or famciclovir 250 mg 3 times daily. She has had symptoms for 2 days and no prior episode. "Topical acyclovir as the only treatment for this first episode at this encounter" is not the best choice because Topical acyclovir has minimal benefit. A first episode is treated with an oral regimen for 7 to 10 days. "Topical acyclovir plus an IgM blood test today" is not the best choice because IgM testing is not recommended, and topical acyclovir still has minimal benefit. "Valacyclovir 500 mg orally once daily for only 3 days" is not the best choice because Valacyclovir 500 mg once daily is a suppression dose, and it is less effective when there are 10 or more recurrences a year. It is not first-episode treatment, and 3 days is not the 7-to-10-day course. First-episode valacyclovir is 1 g orally twice daily. "Famciclovir 250 mg orally once daily for only 2 days" is not the best choice because First-episode famciclovir is 250 mg orally 3 times daily for 7 to 10 days, not 250 mg once daily for 2 days.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '8c742dcbb61132739b9a3227fab4b82e4265f1c90aabe65dd75711b1aa28e7fd', false, NOW(), NOW(), 2,
  'hsv-topical-acyclovir-minimal-benefit', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports.", "url": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'hsv-topical-acyclovir-minimal-benefit', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-321", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210322', 'usmle-step-2', 'infectious-disease',
  $sc$A 22-year-old man who works as a sound engineer is seen in the student health clinic for a first cluster of painful penile vesicles. The vesicles appeared 1 day ago. He has had no similar rash. Urination burns. He has no drug allergy and is not pregnant. He mixed sound for a 3-hour concert last night. Temperature is 37.1°C, pulse is 84/min, respirations are 15/min, and blood pressure is 122/74 mm Hg. He weighs 75 kg. Six vesicles are visible on the shaft. A bacterial swab is pending.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Acyclovir 400 mg orally twice daily for 7 to 10 days", "Acyclovir 400 mg orally 3 times daily for 7 to 10 days", "Valacyclovir 500 mg orally once daily for 7 to 10 days", "Famciclovir 250 mg orally once daily for 7 to 10 days", "Topical acyclovir 5 times daily for 7 to 10 days"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "hsv-first-episode-acyclovir-400", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Acyclovir 400 mg orally 3 times daily for 7 to 10 days$ky$,
  $ex$For a first episode, acyclovir is 400 mg orally 3 times daily for 7 to 10 days. Symptoms began 1 day ago and he has had no prior episode. "Acyclovir 400 mg orally twice daily for 7 to 10 days" is not the best choice because Acyclovir 400 mg orally twice daily is a suppression regimen for recurrent infection, not the first-episode schedule. "Valacyclovir 500 mg orally once daily for 7 to 10 days" is not the best choice because Valacyclovir 500 mg once daily is suppression, and it is less effective if there are 10 or more recurrences a year. First-episode valacyclovir is 1 g orally twice daily for 7 to 10 days. "Famciclovir 250 mg orally once daily for 7 to 10 days" is not the best choice because First-episode famciclovir is 250 mg orally 3 times daily for 7 to 10 days, not once daily. "Topical acyclovir 5 times daily for 7 to 10 days" is not the best choice because Topical acyclovir has minimal benefit and does not replace the oral first-episode regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '347500038c51648aef63d10d21ab6a0d11d4b85fab1f74e780ebf432de71bf97', false, NOW(), NOW(), 1,
  'hsv-first-episode-acyclovir-400', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports.", "url": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'hsv-first-episode-acyclovir-400', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-322", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210323', 'usmle-step-2', 'infectious-disease',
  $sc$A 28-year-old woman who works as a travel agent is seen in the gynecology office asking to be treated with valacyclovir. Grouped vulvar vesicles began yesterday. She has never had them before. She has no drug allergy, and a urine pregnancy test is negative. She booked 15 flights this morning and wants the valacyclovir plan specifically. Temperature is 36.9°C, pulse is 82/min, respirations are 14/min, and blood pressure is 114/72 mm Hg. She weighs 63 kg. There are 8 vesicles and no inguinal fluctuance.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Valacyclovir 500 mg orally once daily for 7 to 10 days", "Valacyclovir 1 g orally once daily for 3 days", "Valacyclovir 1 g orally twice daily for 7 to 10 days", "Valacyclovir 250 mg orally 3 times daily for 7 to 10 days", "Topical acyclovir 5 times daily for 7 to 10 days"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "hsv-first-episode-valacyclovir-1g", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Valacyclovir 1 g orally twice daily for 7 to 10 days$ky$,
  $ex$For a first episode, valacyclovir is 1 g orally twice daily for 7 to 10 days. This is her first episode, and it began yesterday. "Valacyclovir 500 mg orally once daily for 7 to 10 days" is not the best choice because Valacyclovir 500 mg once daily is a suppression dose, not first-episode treatment. It is less effective suppression if recurrences reach 10 or more a year. "Valacyclovir 1 g orally once daily for 3 days" is not the best choice because One gram once daily is the suppression dose used when there are 10 or more recurrences a year, not a 3-day first-episode course. First-episode treatment lasts 7 to 10 days. "Valacyclovir 250 mg orally 3 times daily for 7 to 10 days" is not the best choice because Famciclovir for a first episode is 250 mg orally 3 times daily for 7 to 10 days. That dose is not the valacyclovir regimen. She asked for valacyclovir, which is 1 g twice daily. "Topical acyclovir 5 times daily for 7 to 10 days" is not the best choice because Topical acyclovir has minimal benefit and is not the valacyclovir course she needs.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '38003e4b88c36116f11c2bdb846bd108962548c500c705dcde2b497c377e9681', false, NOW(), NOW(), 2,
  'hsv-first-episode-valacyclovir-1g', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports.", "url": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'hsv-first-episode-valacyclovir-1g', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-323", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210324', 'usmle-step-2', 'infectious-disease',
  $sc$A 46-year-old woman who works as a dance instructor is seen in the primary care clinic asking for valacyclovir to prevent further outbreaks. She has had 12 outbreaks of genital blisters in the past 12 months. A type-specific antibody test is positive for HSV-2. She is not pregnant and has no drug allergy. She teaches 4 classes a day and wants fewer interruptions. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 124/78 mm Hg. She weighs 60 kg. No vesicle is present today.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Valacyclovir 500 mg orally once daily for suppression", "Valacyclovir 1 g orally twice daily for 7 to 10 days, then stop", "Valacyclovir 250 mg orally twice daily for suppression", "Valacyclovir 1 g orally once daily for suppression", "Topical acyclovir twice daily as long-term suppression"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "hsv-suppression-valacyclovir-1g-if-ten", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Valacyclovir 1 g orally once daily for suppression$ky$,
  $ex$For suppression of recurrent HSV-2, valacyclovir 500 mg daily is less effective if there are 10 or more recurrences a year. The dose is then valacyclovir 1 g daily. She had 12 outbreaks in 12 months. "Valacyclovir 500 mg orally once daily for suppression" is not the best choice because Valacyclovir 500 mg once daily is a suppression dose, but it is less effective when there are 10 or more recurrences a year. She had 12 in the past year. "Valacyclovir 1 g orally twice daily for 7 to 10 days, then stop" is not the best choice because Valacyclovir 1 g orally twice daily for 7 to 10 days is first-episode treatment, not ongoing suppression, and it is then stopped. "Valacyclovir 250 mg orally twice daily for suppression" is not the best choice because Famciclovir suppression is 250 mg twice daily. That is not the valacyclovir dose. She asked for valacyclovir, and with 12 recurrences the valacyclovir dose is 1 g daily. "Topical acyclovir twice daily as long-term suppression" is not the best choice because Topical acyclovir has minimal benefit and is not a suppression regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '8a99456ddf697d2ae56cd79a10568a08d42b3114e22a95b6455323fc0b1ac4f2', false, NOW(), NOW(), 4,
  'hsv-suppression-valacyclovir-1g-if-ten', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "CDC. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recommendations and Reports.", "url": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'hsv-suppression-valacyclovir-1g-if-ten', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-324", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/std/treatment-guidelines/STI-Guidelines-2021.pdf", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210325', 'usmle-step-2', 'infectious-disease',
  $sc$A 44-year-old man who works as a tax preparer is seen in the pulmonary clinic after a workplace blood test came back positive. An interferon-gamma release assay is positive. The chest radiograph shows no infiltrate. He has no cough, no fever, no night sweats, and no weight loss. An HIV-1 antigen/antibody test is negative. He takes no medicines and prepared 20 returns this week. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 126/78 mm Hg. He weighs 82 kg. Oxygen saturation is 98% on room air.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Daily rifampin for 2 months as the chosen course", "Rifampin plus pyrazinamide for 2 months as the chosen course", "Once-weekly rifampin plus isoniazid for 3 months", "Daily isoniazid for 9 months as the preferred regimen", "Once-weekly isoniazid plus rifapentine for 3 months"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-weekly-isoniazid-rifapentine", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Once-weekly isoniazid plus rifapentine for 3 months$ky$,
  $ex$Three months of once-weekly isoniazid plus rifapentine is a preferred regimen for adults. He is HIV-negative, the radiograph shows no infiltrate, and he has no cough, fever, night sweats, or weight loss. "Daily rifampin for 2 months as the chosen course" is not the best choice because Four months is the daily rifampin duration that is preferred in an HIV-negative adult. Two months of rifampin alone is not that regimen. "Rifampin plus pyrazinamide for 2 months as the chosen course" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. "Once-weekly rifampin plus isoniazid for 3 months" is not the best choice because Rifampin and rifapentine are not interchangeable. The once-weekly regimen uses rifapentine with isoniazid, not rifampin. "Daily isoniazid for 9 months as the preferred regimen" is not the best choice because Daily isoniazid for 6 or 9 months is an alternative, not a preferred regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '1b5a3da16586f75c64ffca369967e78efc5cdb5e621c4cef566344a623260b99', false, NOW(), NOW(), 2,
  'ltbi-weekly-isoniazid-rifapentine', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-weekly-isoniazid-rifapentine', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-325", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210326', 'usmle-step-2', 'infectious-disease',
  $sc$A 57-year-old woman who works as a claims adjuster is seen in the anticoagulation clinic while a 4-month rifampin plan is being considered. An interferon-gamma release assay is positive, and the chest radiograph shows no infiltrate. She has no cough or fever. An HIV-1 antigen/antibody test is negative. She takes warfarin each evening for a mechanical heart valve. The most recent INR was 2.3. She reviewed 15 claim files today. Temperature is 36.5°C, pulse is 74/min, respirations are 16/min, and blood pressure is 130/76 mm Hg. She weighs 70 kg. She has no night sweats and has not lost weight.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Address the rifampin-warfarin interaction before using 4 months of daily rifampin", "Start 4 months of daily rifampin, because warfarin is unaffected", "Use 2 months of rifampin plus pyrazinamide so warfarin can be ignored", "Put rifampin into a once-weekly isoniazid regimen in place of rifapentine", "Prefer 9 months of daily isoniazid, because rifampin has no drug interactions in the office today"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-rifampin-warfarin-interaction", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Address the rifampin-warfarin interaction before using 4 months of daily rifampin$ky$,
  $ex$Four months of daily rifampin is a strong recommendation for an HIV-negative adult, and rifampin interacts with warfarin. That interaction has to be addressed before the 4-month course is used. She takes warfarin and is HIV-negative. "Start 4 months of daily rifampin, because warfarin is unaffected" is not the best choice because Rifampin interacts with warfarin. Four months of daily rifampin is a preferred regimen in an HIV-negative adult, but the interaction cannot be ignored. Her most recent INR was 2.3. "Use 2 months of rifampin plus pyrazinamide so warfarin can be ignored" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. That pair is not a way around the warfarin interaction. "Put rifampin into a once-weekly isoniazid regimen in place of rifapentine" is not the best choice because Rifampin and rifapentine are not interchangeable. Rifampin is not dropped into the once-weekly isoniazid plus rifapentine regimen. "Prefer 9 months of daily isoniazid, because rifampin has no drug interactions in the office today" is not the best choice because Daily isoniazid for 9 months is an alternative, not preferred. The statement that rifampin has no drug interactions is wrong. Rifampin interacts with warfarin, oral contraceptives, azoles, and some antiretrovirals.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '59e1e0aff407207170f96369206a1628327a563bed6b2e0e61a0395ebb6716d7', false, NOW(), NOW(), 4,
  'ltbi-rifampin-warfarin-interaction', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-rifampin-warfarin-interaction', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-326", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210327', 'usmle-step-2', 'infectious-disease',
  $sc$A 6-year-old girl who works as a first-grade student is seen in the pediatric clinic with her mother after a contact blood test. An interferon-gamma release assay is positive. The chest radiograph shows no infiltrate. Her mother reports no cough, no fever, and a steady appetite, with weight gain of 1 kg in 4 months. An HIV test is negative. She attends school 5 days a week. Temperature is 36.7°C, pulse is 96/min, respirations are 20/min, and blood pressure is 96/60 mm Hg. She weighs 21 kg. There are no swollen joints.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["That weekly pair is allowed only for children under 2 years", "Once-weekly isoniazid plus rifapentine for 3 months", "Rifampin plus pyrazinamide daily for 2 months", "Once-weekly rifampin plus isoniazid for 3 months", "Daily isoniazid for 9 months as the preferred regimen"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-weekly-regimen-child-age-6", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Once-weekly isoniazid plus rifapentine for 3 months$ky$,
  $ex$Three months of once-weekly isoniazid plus rifapentine is a preferred regimen for children older than 2 years. She is 6 and HIV-negative, and the radiograph shows no infiltrate. "That weekly pair is allowed only for children under 2 years" is not the best choice because The weekly isoniazid plus rifapentine regimen is for children older than 2 years, not only for children under 2. She is 6. "Rifampin plus pyrazinamide daily for 2 months" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. "Once-weekly rifampin plus isoniazid for 3 months" is not the best choice because Rifampin and rifapentine are not interchangeable. The once-weekly partner of isoniazid is rifapentine. "Daily isoniazid for 9 months as the preferred regimen" is not the best choice because Daily isoniazid for 6 or 9 months is an alternative, not a preferred regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '48b666ad6a173a601ec77438917585d45c8f4c113feb4b3a6d7e04849cc27c90', false, NOW(), NOW(), 3,
  'ltbi-weekly-regimen-child-age-6', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-weekly-regimen-child-age-6', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-327", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210328', 'usmle-step-2', 'infectious-disease',
  $sc$A 1-year-old boy who works as a daycare enrollee is seen in the pediatric clinic with his father after a household contact evaluation. An interferon-gamma release assay is positive. The chest radiograph shows no infiltrate. His father reports no fever, no cough, and normal feeding of 24 ounces a day. An HIV test is negative. He naps at daycare 5 afternoons a week. Temperature is 36.8°C, pulse is 120/min, respirations are 28/min, and blood pressure is 90/56 mm Hg. He weighs 11 kg. The examination shows no respiratory distress.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Once-weekly isoniazid plus rifapentine for 3 months", "Rifampin plus pyrazinamide for 2 months as the chosen course", "Daily rifampin for 4 months as the chosen course", "Once-weekly rifampin plus isoniazid for 3 months", "Daily isoniazid for 9 months as the preferred regimen"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-no-weekly-regimen-age-1", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Daily rifampin for 4 months as the chosen course$ky$,
  $ex$Four months of daily rifampin is a strong recommendation for HIV-negative children. He is 1 year old and HIV-negative, with no infiltrate on the radiograph. The weekly isoniazid-rifapentine regimen starts only after age 2. "Once-weekly isoniazid plus rifapentine for 3 months" is not the best choice because Once-weekly isoniazid plus rifapentine is for adults and for children older than 2 years. He is 1 year old, so that regimen is not used. "Rifampin plus pyrazinamide for 2 months as the chosen course" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. "Once-weekly rifampin plus isoniazid for 3 months" is not the best choice because Rifampin is not substituted for rifapentine in the once-weekly isoniazid regimen. Those two drugs are not interchangeable, and he is also too young for that weekly pair. "Daily isoniazid for 9 months as the preferred regimen" is not the best choice because Daily isoniazid for 6 or 9 months is an alternative, not a preferred regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '9fd61ee48f9d704ac36411e2d4b01623708c94a6c9e1391e276d3b00a97525c1', false, NOW(), NOW(), 4,
  'ltbi-no-weekly-regimen-age-1', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-no-weekly-regimen-age-1', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-328", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210329', 'usmle-step-2', 'infectious-disease',
  $sc$A 53-year-old man who works as a sculptor is seen in the occupational health clinic after a pre-employment blood test was positive. An interferon-gamma release assay is positive. The chest radiograph shows no infiltrate. He has no cough, fever, or night sweats, and his weight is unchanged over 6 months. An HIV-1 antigen/antibody test is negative. He takes no warfarin, no azole, and no hormone tablet. He carved stone for 7 hours today. Temperature is 36.5°C, pulse is 64/min, respirations are 14/min, and blood pressure is 134/82 mm Hg. He weighs 79 kg. Oxygen saturation is 97% on room air.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Daily rifampin for 2 months as the chosen course", "Rifampin plus pyrazinamide for 2 months as the chosen course", "Once-weekly rifampin plus isoniazid for 3 months", "Daily rifampin for 4 months as the chosen course", "Daily isoniazid for 9 months as the preferred choice"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-daily-rifampin-4-months", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Daily rifampin for 4 months as the chosen course$ky$,
  $ex$Four months of daily rifampin is a strong recommendation for HIV-negative adults. He is 53, HIV-negative, and the radiograph shows no infiltrate. He is not taking warfarin or another listed interacting drug. "Daily rifampin for 2 months as the chosen course" is not the best choice because The preferred daily rifampin course is 4 months, not 2 months. "Rifampin plus pyrazinamide for 2 months as the chosen course" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. "Once-weekly rifampin plus isoniazid for 3 months" is not the best choice because The once-weekly regimen pairs isoniazid with rifapentine. Rifampin and rifapentine are not interchangeable. "Daily isoniazid for 9 months as the preferred choice" is not the best choice because Daily isoniazid for 6 or 9 months is an alternative, not a preferred regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '83236eee0cb2b95c04b24522df55fab7926b089354d628dd297a5b0640dba01b', false, NOW(), NOW(), 3,
  'ltbi-daily-rifampin-4-months', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-daily-rifampin-4-months', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-329", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210330', 'usmle-step-2', 'infectious-disease',
  $sc$A 39-year-old man who works as a disc jockey is seen in the hiv clinic after a positive blood test and a clear chest film. An interferon-gamma release assay is positive. The chest radiograph shows no infiltrate. He has no cough, no fever, and no night sweats. HIV-1 infection is documented, and his HIV clinician confirmed that rifapentine does not interact with his current treatment. He played a 4-hour set last night. No drug names are being changed today. Temperature is 36.7°C, pulse is 78/min, respirations are 15/min, and blood pressure is 120/76 mm Hg. He weighs 74 kg. He has not lost weight this year.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Daily rifampin for 4 months, which has established effectiveness in HIV at this encounter", "Rifampin plus pyrazinamide for 2 months as the chosen course", "Once-weekly rifampin plus isoniazid for 3 months", "Daily isoniazid for 9 months as the only regimen HIV allows", "Once-weekly isoniazid plus rifapentine for 3 months, if interactions allow"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-rifampin-4-months-not-for-hiv", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Once-weekly isoniazid plus rifapentine for 3 months, if interactions allow$ky$,
  $ex$Three months of once-weekly isoniazid plus rifapentine is a preferred regimen for people with HIV when drug interactions allow. His clinician confirmed that rifapentine does not interact with his current treatment. He has no signs of disease in the lung. "Daily rifampin for 4 months, which has established effectiveness in HIV at this encounter" is not the best choice because There is no evidence for effectiveness of 4 months of daily rifampin in HIV. That strong recommendation is for HIV-negative adults and children. "Rifampin plus pyrazinamide for 2 months as the chosen course" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. "Once-weekly rifampin plus isoniazid for 3 months" is not the best choice because Rifampin and rifapentine are not interchangeable. The weekly regimen uses rifapentine. "Daily isoniazid for 9 months as the only regimen HIV allows" is not the best choice because Daily isoniazid for 9 months is an alternative, not the only regimen HIV allows, and it is not preferred over the weekly isoniazid plus rifapentine regimen when interactions allow.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'de32f3db70b44b61b6a6d4174ce13e66d7e0c3a462479ff84079c959f992bbd5', false, NOW(), NOW(), 5,
  'ltbi-rifampin-4-months-not-for-hiv', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-rifampin-4-months-not-for-hiv', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-330", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210331', 'usmle-step-2', 'infectious-disease',
  $sc$A 61-year-old woman who works as a park naturalist is seen in the travel clinic before a seasonal hiring date. An interferon-gamma release assay is positive. The chest radiograph shows no infiltrate. She has no cough and hiked 5 miles yesterday without fever. An HIV-1 antigen/antibody test is negative. She takes no medicines. The park opens in 3 weeks. Temperature is 36.4°C, pulse is 66/min, respirations are 14/min, and blood pressure is 128/74 mm Hg. She weighs 65 kg. Oxygen saturation is 99% on room air.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Daily isoniazid plus rifampin for 3 months as the chosen course", "Once-weekly isoniazid plus rifampin for 3 months as treatment", "Daily rifampin plus pyrazinamide for 2 months as treatment", "Daily isoniazid plus rifampin for 9 months as the required preferred length", "Rifapentine alone once weekly for 3 months as the full regimen"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-daily-isoniazid-plus-rifampin", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Daily isoniazid plus rifampin for 3 months as the chosen course$ky$,
  $ex$Three months of daily isoniazid plus rifampin is a preferred regimen. She is HIV-negative, and the radiograph shows no infiltrate. "Once-weekly isoniazid plus rifampin for 3 months as treatment" is not the best choice because The 3-month isoniazid plus rifampin regimen is daily, not once weekly. The once-weekly pair is isoniazid plus rifapentine. "Daily rifampin plus pyrazinamide for 2 months as treatment" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. "Daily isoniazid plus rifampin for 9 months as the required preferred length" is not the best choice because Nine months is an alternative length for isoniazid alone, not the required length of the isoniazid plus rifampin combination. That combination is 3 months. "Rifapentine alone once weekly for 3 months as the full regimen" is not the best choice because Rifapentine is used with isoniazid once weekly, not alone.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '73124dba4e4cccb3bb81e20930234c3c704ff7caf160dee8bd1f6648a30e955a', false, NOW(), NOW(), 3,
  'ltbi-daily-isoniazid-plus-rifampin', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-daily-isoniazid-plus-rifampin', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-331", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210332', 'usmle-step-2', 'infectious-disease',
  $sc$A 49-year-old man who works as a warehouse supervisor is seen in the pharmacy consultation clinic with a prescription the shelf cannot fill. The prescription says isoniazid plus rifapentine once weekly for 3 months. The pharmacist proposes rifampin in place of rifapentine because rifapentine is not on the shelf. An HIV test was negative, the chest radiograph showed no infiltrate, and he has no cough. He supervises 18 pickers on the night shift. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 136/84 mm Hg. He weighs 90 kg. He takes no warfarin.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Give rifampin on the same once-weekly schedule with isoniazid", "Do not substitute rifampin for rifapentine in the once-weekly regimen", "Change the plan to 2 months of rifampin plus pyrazinamide", "Drop the isoniazid and give rifampin once weekly alone", "Convert the course to 9 months of daily isoniazid as the preferred equivalent"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-rifampin-not-swapped-for-rifapentine", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Do not substitute rifampin for rifapentine in the once-weekly regimen$ky$,
  $ex$Rifampin and rifapentine are not interchangeable. The once-weekly regimen is isoniazid plus rifapentine for 3 months, and rifampin should not replace rifapentine. "Give rifampin on the same once-weekly schedule with isoniazid" is not the best choice because Giving rifampin once weekly with isoniazid is the substitution that is not allowed. The drugs are not interchangeable. "Change the plan to 2 months of rifampin plus pyrazinamide" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. "Drop the isoniazid and give rifampin once weekly alone" is not the best choice because Rifampin once weekly alone is not a preferred regimen, and dropping isoniazid does not fix the missing rifapentine. "Convert the course to 9 months of daily isoniazid as the preferred equivalent" is not the best choice because Daily isoniazid for 9 months is an alternative, not a preferred equivalent that replaces the weekly regimen.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'e9588a2551a9a4b1ababdf7b354845105d7b756302350694565ebceaed69c42a', false, NOW(), NOW(), 4,
  'ltbi-rifampin-not-swapped-for-rifapentine', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-rifampin-not-swapped-for-rifapentine', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-332", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210333', 'usmle-step-2', 'infectious-disease',
  $sc$A 55-year-old man who works as a fisherman is seen in the harbor clinic after a colleague called 9 months of one drug the first choice. An interferon-gamma release assay is positive. The chest radiograph shows no infiltrate. He has no cough and no fever after 10 days at sea. An HIV-1 antigen/antibody test is negative. He takes no medicines. The boat carries a crew of 6. Temperature is 36.5°C, pulse is 62/min, respirations are 14/min, and blood pressure is 138/80 mm Hg. He weighs 85 kg. He has not lost weight.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Daily isoniazid for 9 months, because it is the preferred regimen", "Daily isoniazid for 6 months, because shorter monotherapy is preferred", "Once-weekly isoniazid plus rifapentine for 3 months", "Rifampin plus pyrazinamide for 2 months as the chosen course", "Once-weekly rifampin plus isoniazid for 3 months"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-isoniazid-monotherapy-not-preferred", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Once-weekly isoniazid plus rifapentine for 3 months$ky$,
  $ex$Three months of once-weekly isoniazid plus rifapentine is a preferred regimen. He is an HIV-negative adult, and the radiograph shows no infiltrate. "Daily isoniazid for 9 months, because it is the preferred regimen" is not the best choice because Daily isoniazid for 9 months is an alternative, not a preferred regimen. "Daily isoniazid for 6 months, because shorter monotherapy is preferred" is not the best choice because Daily isoniazid for 6 months is also an alternative, not a preferred shorter monotherapy. "Rifampin plus pyrazinamide for 2 months as the chosen course" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. "Once-weekly rifampin plus isoniazid for 3 months" is not the best choice because Rifampin is not used in place of rifapentine in the once-weekly isoniazid regimen. The two rifamycins are not interchangeable.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '6900322da150b2d5ba7446d1ed93a9330636565b3802a4618d074d7ae3234534', false, NOW(), NOW(), 3,
  'ltbi-isoniazid-monotherapy-not-preferred', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-isoniazid-monotherapy-not-preferred', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-333", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210334', 'usmle-step-2', 'infectious-disease',
  $sc$A 47-year-old woman who works as a baker is seen in the employee health clinic after a coworker suggested a short two-drug course. An interferon-gamma release assay is positive. The chest radiograph shows no infiltrate. She has no cough, and she baked 40 loaves this morning without fever. An HIV-1 antigen/antibody test is negative. She takes no medicines. The suggested course is rifampin plus pyrazinamide. Temperature is 36.6°C, pulse is 76/min, respirations are 15/min, and blood pressure is 122/74 mm Hg. She weighs 68 kg. Night sweats are absent.$sc$,
  $qu$Which of the following is the most appropriate regimen?$qu$,
  $op${"options": ["Use rifampin plus pyrazinamide for 2 months as a preferred short course at this encounter", "Use that pair for 2 months only because the chest radiograph is normal", "Extend rifampin plus pyrazinamide to 4 months and keep both drugs", "Do not use that pair; use once-weekly isoniazid plus rifapentine for 3 months", "Replace isoniazid with pyrazinamide in the weekly rifapentine regimen"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "blood-lymph-immune", "blueprintTopic": "ltbi-no-two-month-pyrazinamide", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Do not use that pair; use once-weekly isoniazid plus rifapentine for 3 months$ky$,
  $ex$Do not use 2 months of rifampin plus pyrazinamide. Three months of once-weekly isoniazid plus rifapentine is a preferred regimen for this HIV-negative adult. "Use rifampin plus pyrazinamide for 2 months as a preferred short course at this encounter" is not the best choice because Do not use 2 months of rifampin plus pyrazinamide. It is not a preferred short course. "Use that pair for 2 months only because the chest radiograph is normal" is not the best choice because A normal chest radiograph supports that she is a candidate for a preferred regimen. It does not make the 2-month rifampin plus pyrazinamide combination acceptable. "Extend rifampin plus pyrazinamide to 4 months and keep both drugs" is not the best choice because Extending rifampin plus pyrazinamide to 4 months is not the 4-month regimen. The 4-month regimen is daily rifampin alone, and the 2-month combination should not be used. "Replace isoniazid with pyrazinamide in the weekly rifapentine regimen" is not the best choice because Pyrazinamide is not substituted for isoniazid in the once-weekly rifapentine regimen. That weekly regimen is isoniazid plus rifapentine.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "blood-lymph-immune", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '89aff321304c8bea365245f69149c24b94e964a930d7654b10f129669417ec84', false, NOW(), NOW(), 3,
  'ltbi-no-two-month-pyrazinamide', 'blood-lymph-immune', 'vignette',
  $rf$[{"label": "Sterling TR, Njie G, Zenner D, et al. Guidelines for the Treatment of Latent Tuberculosis Infection. MMWR Recomm Rep. 2020;69(1):1-11.", "url": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'ltbi-no-two-month-pyrazinamide', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-334", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210335', 'usmle-step-2', 'gastroenterology',
  $sc$A 62-year-old man who works as a museum docent is seen in the primary care clinic for a preventive visit he booked after the winter tours. School groups keep him on his feet, and he has never completed a stool test or a colonoscopy. He reports no rectal bleeding and takes no blood-thinning medicine. He asks whether screening applies at his age. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Body mass index is 26 kg/m2. Hemoglobin measured last month was 14.6 g/dL.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Wait until age 76, when screening becomes an individual decision during today's visit", "Do not screen, because the included ages are only 45 to 49 years", "Use a yearly serum test as the recommended screening strategy", "Use a yearly urine test as the recommended screening strategy", "Start screening now, because adults aged 50 to 75 years should be screened"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-62-start-screening", "taskCategory": "health-maintenance"}$op$,
  $ky$Start screening now, because adults aged 50 to 75 years should be screened$ky$,
  $ex$Adults aged 50 to 75 years should be screened, and that recommendation is grade A. He is 62 and has never been screened, so screening should start. "Wait until age 76, when screening becomes an individual decision during today's visit" is not the best choice because An individual decision applies at ages 76 to 85. It is not a reason to delay screening for a 62-year-old. "Do not screen, because the included ages are only 45 to 49 years" is not the best choice because Adults aged 45 to 49 years are screened as well, at grade B. Ages 50 to 75 years are the grade A band and include this patient. "Use a yearly serum test as the recommended screening strategy" is not the best choice because Serum tests are not recommended screening tests. "Use a yearly urine test as the recommended screening strategy" is not the best choice because Urine tests are not recommended screening tests.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '168c6e6c6dde119b1fda78c8771a28527460e651c939994634584c5372156fdb', false, NOW(), NOW(), 1,
  'crc-age-62-start-screening', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-age-62-start-screening', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-335", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210336', 'usmle-step-2', 'gastroenterology',
  $sc$A 70-year-old woman who works as a city bus driver is seen in the employee health clinic during a required recertification examination. Eleven years ago a colonoscopy was negative, and she has had no stool test since. She still drives a full morning shift, reports no rectal bleeding, and wants to know whether another examination is due. Temperature is 36.7°C, pulse is 76/min, respirations are 16/min, and blood pressure is 122/74 mm Hg. Body mass index is 29 kg/m2. Hemoglobin is 13.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Screen now, because age 70 is included and 10 years have passed", "Defer any screening until she turns 76 years old next cycle", "Repeat colonoscopy on a 5-year schedule after a negative examination", "Treat the negative examination as permanent, with no further testing", "Replace the examination with a yearly serum screening test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-70-due-after-negative-colonoscopy", "taskCategory": "health-maintenance"}$op$,
  $ky$Screen now, because age 70 is included and 10 years have passed$ky$,
  $ex$Adults aged 50 to 75 years should be screened (grade A). Colonoscopy is repeated every 10 years when the examination is negative, and 11 years have passed. "Defer any screening until she turns 76 years old next cycle" is not the best choice because Age 76 begins the selective range. At 70 she is still in the 50-to-75-year group that should be screened. "Repeat colonoscopy on a 5-year schedule after a negative examination" is not the best choice because Every 5 years is the interval for CT colonography and for flexible sigmoidoscopy, not for colonoscopy after a negative examination. "Treat the negative examination as permanent, with no further testing" is not the best choice because A negative colonoscopy does not end screening for the rest of life. The stated interval is 10 years. "Replace the examination with a yearly serum screening test" is not the best choice because Serum tests are not recommended screening tests.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'd5104705cc6ee1bf5f5ba7a03fcf41e0a7c417fc94e7ec9bd309e34a82cb5cf7', false, NOW(), NOW(), 2,
  'crc-age-70-due-after-negative-colonoscopy', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-age-70-due-after-negative-colonoscopy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-336", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210337', 'usmle-step-2', 'gastroenterology',
  $sc$A 46-year-old man who works as a pastry chef is seen in the neighborhood clinic after a coworker mentioned starting screening. Weekend bakery shifts leave him little time, and he has never had a stool test or a colonoscopy. He has no rectal bleeding. He asks if screening can wait until he is 50. Temperature is 36.8°C, pulse is 80/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Body mass index is 31 kg/m2. A recent hemoglobin was 15.1 g/dL.$sc$,
  $qu$Which of the following is the most appropriate recommendation?$qu$,
  $op${"options": ["Wait until age 50, because no screening is advised at age 46", "Start screening now, because ages 45 to 49 years are included", "Start screening only if he reaches the selective range at 76", "Offer a serum test now and a urine test as the preferred pair", "Offer capsule endoscopy every 5 years as the fitting strategy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-46-grade-b-screen", "taskCategory": "health-maintenance"}$op$,
  $ky$Start screening now, because ages 45 to 49 years are included$ky$,
  $ex$Adults aged 45 to 49 years should be screened, and the grade is B. He is 46 and has not been screened. "Wait until age 50, because no screening is advised at age 46" is not the best choice because Screening does not begin at 50 only. Adults aged 45 to 49 years should be screened, at grade B. "Start screening only if he reaches the selective range at 76" is not the best choice because Ages 76 to 85 are for an individual decision. They are not the start of screening. "Offer a serum test now and a urine test as the preferred pair" is not the best choice because Serum tests and urine tests are not recommended screening tests. "Offer capsule endoscopy every 5 years as the fitting strategy" is not the best choice because Capsule endoscopy is not a recommended screening test, and a 5-year capsule interval is not one of the stated strategies.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '0e9314eeb4492804801b0a1e7cb48b0c3a1f58273592df18e578345465bd473f', false, NOW(), NOW(), 2,
  'crc-age-46-grade-b-screen', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-age-46-grade-b-screen', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-337", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210338', 'usmle-step-2', 'gastroenterology',
  $sc$A 45-year-old woman who works as a court reporter is seen in the family medicine office on the week of her 45th birthday. Turning 45 prompted the visit. She has never had a colonoscopy or a stool test, and she has no rectal bleeding. A clerk told her that screening either starts at 50 or is already grade A on her birthday. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Body mass index is 23 kg/m2. Hemoglobin is 13.1 g/dL.$sc$,
  $qu$Which of the following is the correct statement about her age?$qu$,
  $op${"options": ["Screening starts at 50, so this birthday does not qualify", "Age 45 is already in the grade A band used for ages 50 to 75", "Age 45 is included, and the recommendation at 45 to 49 is grade B", "Age 45 is past the screening window and screening should stop", "Age 45 is in the selective band that uses an individual decision at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-45-included-grade-b", "taskCategory": "interpretation"}$op$,
  $ky$Age 45 is included, and the recommendation at 45 to 49 is grade B$ky$,
  $ex$Adults aged 45 to 49 years should be screened, and that recommendation is grade B. Her 45th birthday places her in that band. "Screening starts at 50, so this birthday does not qualify" is not the best choice because The grade A band starts at 50, but screening is also recommended at 45 to 49 years. "Age 45 is already in the grade A band used for ages 50 to 75" is not the best choice because Grade A applies to adults aged 50 to 75 years. Age 45 is in the grade B band. "Age 45 is past the screening window and screening should stop" is not the best choice because Screening is not stopped at 45. Discontinuation is after age 85. "Age 45 is in the selective band that uses an individual decision at the present visit" is not the best choice because An individual decision is for ages 76 to 85, not for age 45.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'b6f142b6b9469de7667cafd27b24fe1e1197f6b6579bc336663c8761bf14cf33', false, NOW(), NOW(), 3,
  'crc-age-45-included-grade-b', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-age-45-included-grade-b', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-338", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210339', 'usmle-step-2', 'gastroenterology',
  $sc$A 49-year-old man who works as a landscape architect is seen in the multispecialty clinic while reviewing a prevention checklist. Payroll records list his birthday as next month, when he will turn 50. He has never been screened and has no rectal bleeding. He asks whether the recommendation at 49 is already the stronger grade used from 50 onward. Temperature is 36.6°C, pulse is 68/min, respirations are 15/min, and blood pressure is 124/76 mm Hg. Body mass index is 25 kg/m2. Hemoglobin is 14.9 g/dL.$sc$,
  $qu$Which of the following best describes screening at his current age?$qu$,
  $op${"options": ["No screening is offered at his current age until the 50th birthday", "Grade A applies now and stays the label through age 49 years", "Screening should stop now because he is nearly 50 years old", "Screening is recommended now, and the grade is still B rather than A", "An individual decision is required now because he is still under 50 in the office today"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-49-still-grade-b", "taskCategory": "interpretation"}$op$,
  $ky$Screening is recommended now, and the grade is still B rather than A$ky$,
  $ex$He is 49, so the recommendation is to screen at grade B. Grade A is for ages 50 to 75 years. "No screening is offered at his current age until the 50th birthday" is not the best choice because Adults aged 45 to 49 years should be screened. Waiting for age 50 is not required. "Grade A applies now and stays the label through age 49 years" is not the best choice because Grade A begins at age 50. At 49 the grade is B. "Screening should stop now because he is nearly 50 years old" is not the best choice because Nothing about turning 50 stops screening. The grade A recommendation then applies through age 75. "An individual decision is required now because he is still under 50 in the office today" is not the best choice because An individual decision is for ages 76 to 85. Age 49 is in the grade B screening band.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'f3f61e8f835a519c37b87060537dad6689810c6802575d0d72c12c35279e68fa', false, NOW(), NOW(), 3,
  'crc-age-49-still-grade-b', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-age-49-still-grade-b', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-339", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210340', 'usmle-step-2', 'gastroenterology',
  $sc$A 50-year-old woman who works as a hotel concierge is seen in the primary care clinic on the morning of her 50th birthday. The hotel schedule let her keep this appointment. She has never had a stool test or a colonoscopy and has no rectal bleeding. She wants the grade that applies on the day she turns 50, not the grade that applied last year. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Body mass index is 24 kg/m2. Hemoglobin is 13.6 g/dL.$sc$,
  $qu$Which of the following is the correct grade for screening today?$qu$,
  $op${"options": ["Grade B, because the B band continues through age 50", "Grade C, because an individual decision starts at age 50 before the patient leaves", "No grade, because screening is discontinued at age 50", "Grade A only after a serum test is completed this year", "Grade A, because ages 50 to 75 years are the grade A band"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-50-enters-grade-a", "taskCategory": "interpretation"}$op$,
  $ky$Grade A, because ages 50 to 75 years are the grade A band$ky$,
  $ex$Adults aged 50 to 75 years should be screened, and the recommendation is grade A. Turning 50 moves her into that band. "Grade B, because the B band continues through age 50" is not the best choice because Grade B is for ages 45 to 49 years. It does not include age 50. "Grade C, because an individual decision starts at age 50 before the patient leaves" is not the best choice because Grade C, an individual decision, is for ages 76 to 85 years. "No grade, because screening is discontinued at age 50" is not the best choice because Screening is not discontinued at 50. Discontinuation is after age 85. "Grade A only after a serum test is completed this year" is not the best choice because The grade follows age. A serum test is not a recommended screening test and does not create the grade.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation"]$tg$,
  's2-new-20261121-hidden', '11430f0e695ccbbfb09bd837133dd12cf94a128dfb11254bce32ada1eb509fa6', false, NOW(), NOW(), 3,
  'crc-age-50-enters-grade-a', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-age-50-enters-grade-a', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-340", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210341', 'usmle-step-2', 'gastroenterology',
  $sc$A 75-year-old man who works as a violin teacher is seen in the internal medicine office for a health-maintenance visit at age 75. Retirement from the orchestra is recent, and he still gives lessons. A colonoscopy 11 years ago was negative. He has no rectal bleeding and asks whether 75 is already too old for routine screening. Temperature is 36.5°C, pulse is 64/min, respirations are 16/min, and blood pressure is 128/74 mm Hg. Body mass index is 27 kg/m2. Hemoglobin is 14.0 g/dL.$sc$,
  $qu$Which of the following is the correct statement about screening at 75?$qu$,
  $op${"options": ["He is still in the grade A band, which includes adults aged 50 to 75", "Screening stops at 75 because the selective range has started", "Only grade B applies, the same label used at ages 45 to 49", "An individual decision is required for every adult once age 75 is reached", "A negative examination 11 years ago removes any further screening"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-75-still-grade-a", "taskCategory": "interpretation"}$op$,
  $ky$He is still in the grade A band, which includes adults aged 50 to 75$ky$,
  $ex$Adults aged 50 to 75 years should be screened at grade A. Age 75 is included. A negative colonoscopy is repeated at 10 years, and 11 years have passed. "Screening stops at 75 because the selective range has started" is not the best choice because The selective range is ages 76 to 85. Age 75 is still inside 50 to 75 years. "Only grade B applies, the same label used at ages 45 to 49" is not the best choice because Grade B is for ages 45 to 49 years, not for age 75. "An individual decision is required for every adult once age 75 is reached" is not the best choice because An individual decision begins at age 76, not at 75. "A negative examination 11 years ago removes any further screening" is not the best choice because The colonoscopy interval after a negative examination is 10 years, so an examination from 11 years ago does not replace current screening.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'ee32aebacb108d3972d9d1fcfcf3331c62a38ad51faea076134799f798240ff1', false, NOW(), NOW(), 3,
  'crc-age-75-still-grade-a', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-age-75-still-grade-a', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-341", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210342', 'usmle-step-2', 'gastroenterology',
  $sc$A 76-year-old woman who works as a postal carrier is seen in the community clinic the week after she turned 76. Her walking route ended last spring, and she now feels well. She has never been screened and has no rectal bleeding. She asks whether screening continues automatically or stops on this birthday. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 130/76 mm Hg. Body mass index is 28 kg/m2. Hemoglobin is 12.9 g/dL.$sc$,
  $qu$Which of the following is the most appropriate approach?$qu$,
  $op${"options": ["Continue screening automatically under the grade A rule", "Make an individual decision; do not continue or stop automatically", "Stop screening, because discontinuation begins at age 76", "Substitute a serum test, which becomes the preferred test at 76 in the office today", "Start colonoscopy every 5 years as the age-specific interval"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-76-individual-decision", "taskCategory": "health-maintenance"}$op$,
  $ky$Make an individual decision; do not continue or stop automatically$ky$,
  $ex$Adults aged 76 to 85 years get an individual decision based on health, prior screening, and preference (grade C). Continuation is not automatic. "Continue screening automatically under the grade A rule" is not the best choice because Grade A automatic screening applies through age 75. At 76 the recommendation changes. "Stop screening, because discontinuation begins at age 76" is not the best choice because Discontinuation is after age 85, not at 76. "Substitute a serum test, which becomes the preferred test at 76 in the office today" is not the best choice because Serum tests are not recommended screening tests at any of these ages. "Start colonoscopy every 5 years as the age-specific interval" is not the best choice because Colonoscopy every 10 years when negative is the stated colonoscopy interval. Five years is not that interval, and age 76 does not create a new automatic schedule.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '78ab3a1b8719af77b21eb74d5cf3306f1363d2beec541b1128b115ff0284483b', false, NOW(), NOW(), 3,
  'crc-age-76-individual-decision', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-age-76-individual-decision', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-342", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210343', 'usmle-step-2', 'gastroenterology',
  $sc$A 85-year-old man who works as a dental hygienist is seen in the geriatrics clinic for a scheduled prevention visit on his 85th birthday. Birthday cupcakes from the staff kitchen are still on the counter. He walks without help, had a negative colonoscopy 12 years ago, and says he wants screening if it is still allowed. A trainee says screening must stop on the 85th birthday. Temperature is 36.4°C, pulse is 66/min, respirations are 16/min, and blood pressure is 126/70 mm Hg. Body mass index is 22 kg/m2. Hemoglobin is 13.2 g/dL.$sc$,
  $qu$Which of the following is the correct recommendation at age 85?$qu$,
  $op${"options": ["Grade A screening continues automatically through age 85", "Screening is discontinued for every adult on the 85th birthday", "Age 85 is still an individual decision, not an automatic stop", "Grade B rules for ages 45 to 49 years are reapplied at 85", "A serum test is the required screen once age 85 is reached"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-85-still-selective", "taskCategory": "interpretation"}$op$,
  $ky$Age 85 is still an individual decision, not an automatic stop$ky$,
  $ex$Adults aged 76 to 85 years receive an individual decision based on health, prior screening, and preference. Stopping is not automatic at 85. "Grade A screening continues automatically through age 85" is not the best choice because Grade A is for ages 50 to 75 years. Age 85 is not in that band. "Screening is discontinued for every adult on the 85th birthday" is not the best choice because Discontinuation is after age 85. The 85th birthday is still inside the 76-to-85-year range. "Grade B rules for ages 45 to 49 years are reapplied at 85" is not the best choice because Grade B is for ages 45 to 49 years and is not reapplied at 85. "A serum test is the required screen once age 85 is reached" is not the best choice because Serum tests are not recommended screening tests.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation"]$tg$,
  's2-new-20261121-hidden', '8c8459edee25d93499003e03c24246eb0a985c879f6d1e90ec1f7da6be90c6c7', false, NOW(), NOW(), 4,
  'crc-age-85-still-selective', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-age-85-still-selective', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-343", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210344', 'usmle-step-2', 'gastroenterology',
  $sc$A 86-year-old woman who works as a quilt instructor is seen in the senior clinic because her daughter asked about another stool kit. Garden club meets on Tuesdays, and she feels well. A FIT last year was negative. She will turn 87 in four months and wants the kits to keep arriving each spring. Temperature is 36.5°C, pulse is 72/min, respirations are 16/min, and blood pressure is 134/72 mm Hg. Body mass index is 24 kg/m2. Hemoglobin is 12.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate screening plan?$qu$,
  $op${"options": ["Continue annual FIT under the grade A recommendation", "Use an individual decision, as for every adult aged 76 to 85", "Switch her to colonoscopy every 5 years from this visit", "Discontinue screening, because it stops after age 85", "Replace FIT with a yearly urine screening test"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-86-discontinue-screening", "taskCategory": "health-maintenance"}$op$,
  $ky$Discontinue screening, because it stops after age 85$ky$,
  $ex$Screening is discontinued after age 85. A negative FIT last year does not extend screening past that age. "Continue annual FIT under the grade A recommendation" is not the best choice because Grade A screening is for ages 50 to 75 years. She is 86. "Use an individual decision, as for every adult aged 76 to 85" is not the best choice because The individual decision is for ages 76 to 85 years. She is past that range. "Switch her to colonoscopy every 5 years from this visit" is not the best choice because A 5-year colonoscopy interval is not the interval after a negative colonoscopy, and screening is discontinued after age 85. "Replace FIT with a yearly urine screening test" is not the best choice because Urine tests are not recommended screening tests.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'dab348fea9e03ddf0acf15f77f7266a65325fc8c014b58c4e02f20bc2e133ad9', false, NOW(), NOW(), 2,
  'crc-age-86-discontinue-screening', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-age-86-discontinue-screening', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-344", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210345', 'usmle-step-2', 'gastroenterology',
  $sc$A 91-year-old man who works as a chapel usher is seen in the geriatrics clinic with his daughter after a stool-test report. Yesterday a FIT ordered by another office came back positive. He has no rectal bleeding and feels the same as last month. His daughter asks that everything stop because he is past 85, and she does not want a colonoscopy. Temperature is 36.6°C, pulse is 70/min, respirations are 16/min, and blood pressure is 138/74 mm Hg. Body mass index is 21 kg/m2. Hemoglobin is 11.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate next step for this positive result?$qu$,
  $op${"options": ["File the result and stop, because routine screening ends after age 85 during today's visit", "Repeat the FIT in 1 year and do not refer the patient for colonoscopy", "Order a serum test to decide whether this positive FIT still matters", "Arrange capsule endoscopy and use that study instead of colonoscopy", "Colonoscopy is still required, or the benefit of this positive test is lost"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-positive-fit-after-age-85", "taskCategory": "clinical-intervention"}$op$,
  $ky$Colonoscopy is still required, or the benefit of this positive test is lost$ky$,
  $ex$A positive stool test requires colonoscopy, or the benefit of that test is not obtained. Stopping routine screening after age 85 does not erase a stool test that is already positive. "File the result and stop, because routine screening ends after age 85 during today's visit" is not the best choice because Discontinuation after age 85 applies to routine screening. It does not replace colonoscopy once a stool test is positive. "Repeat the FIT in 1 year and do not refer the patient for colonoscopy" is not the best choice because Repeating a stool test in a year does not obtain the benefit of a test that has already returned positive. "Order a serum test to decide whether this positive FIT still matters" is not the best choice because Serum tests are not recommended screening tests, and a serum test is not the follow-up that obtains the benefit of a positive stool test. "Arrange capsule endoscopy and use that study instead of colonoscopy" is not the best choice because Capsule endoscopy is not a recommended screening test and is not the stated follow-up for a positive stool test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'aa83d11d6e303bf9f32d16a3616d64f09b3fbf2c4ee3a5e17f541ebf29026279', false, NOW(), NOW(), 5,
  'crc-positive-fit-after-age-85', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'crc-positive-fit-after-age-85', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-345", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210346', 'usmle-step-2', 'gastroenterology',
  $sc$A 44-year-old woman who works as a high school coach is seen in the sports medicine clinic asking to start the same screening her older brother had. Coaching ends at 5 p.m., and she came from the track. She is 44, has no rectal bleeding, and has never had a stool test or a colonoscopy. She turns 45 in 10 months. Temperature is 36.7°C, pulse is 64/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. Body mass index is 22 kg/m2. Hemoglobin is 13.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate plan for this year?$qu$,
  $op${"options": ["Age alone does not place her in a screening group until age 45", "Start grade A screening now because she is close to 45", "Start grade C selective screening because she asked today before the patient leaves", "Order a urine screening test now and repeat it yearly", "Schedule colonoscopy every 5 years starting this season"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-44-before-screening-ages", "taskCategory": "health-maintenance"}$op$,
  $ky$Age alone does not place her in a screening group until age 45$ky$,
  $ex$Screening is recommended beginning with adults aged 45 to 49 years (grade B). At 44, age alone does not place her in a recommended screening group. "Start grade A screening now because she is close to 45" is not the best choice because Grade A is for ages 50 to 75 years. She is 44, and the earliest screening age in this recommendation is 45. "Start grade C selective screening because she asked today before the patient leaves" is not the best choice because Grade C is the individual decision for ages 76 to 85 years, not a label for starting early because someone asks. "Order a urine screening test now and repeat it yearly" is not the best choice because Urine tests are not recommended screening tests. "Schedule colonoscopy every 5 years starting this season" is not the best choice because Colonoscopy every 10 years when negative is the colonoscopy strategy, and it is for people in the recommended age groups. Five years is not that interval.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '54cc06e0c4ac3ed603499a4c1c5d1bb97dfbcb0e6410f8cb9eaca609a04958e2', false, NOW(), NOW(), 2,
  'crc-age-44-before-screening-ages', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-age-44-before-screening-ages', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-346", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210347', 'usmle-step-2', 'gastroenterology',
  $sc$A 80-year-old woman who works as a reference librarian is seen in the geriatrics clinic to talk about whether to continue screening. Distance walking is limited to one block with a cane. A colonoscopy 4 years ago was negative. She has read the reminder letter and prefers not to be tested this year. Her son wants the reminder treated as an automatic order. Temperature is 36.5°C, pulse is 74/min, respirations are 16/min, and blood pressure is 128/70 mm Hg. Body mass index is 23 kg/m2. Hemoglobin is 12.4 g/dL. She takes 6 daily medicines.$sc$,
  $qu$Which of the following is the most appropriate approach?$qu$,
  $op${"options": ["Continue screening automatically because reminders are grade A at 80", "Decide individually from her health, prior screening, and preference", "Stop forever, because screening is discontinued for everyone over 75", "Order a serum test, which is the preferred test when she declines others", "Repeat colonoscopy now because a negative study is due after 3 years"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-age-80-health-history-preference", "taskCategory": "health-maintenance"}$op$,
  $ky$Decide individually from her health, prior screening, and preference$ky$,
  $ex$At ages 76 to 85 the recommendation is an individual decision based on health, prior screening, and preference (grade C). Limited walking, a negative colonoscopy 4 years ago, and her preference not to test all belong in that decision. "Continue screening automatically because reminders are grade A at 80" is not the best choice because Grade A automatic screening ends at 75. Age 80 is in the 76-to-85-year range, where continuation is not automatic. "Stop forever, because screening is discontinued for everyone over 75" is not the best choice because Discontinuation for everyone is after age 85. Age 80 is not past that line. "Order a serum test, which is the preferred test when she declines others" is not the best choice because Serum tests are not recommended screening tests, including when a person declines other tests. "Repeat colonoscopy now because a negative study is due after 3 years" is not the best choice because The colonoscopy interval after a negative examination is 10 years, not 3 years. A 3-year date is not a stated screening interval.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '9dae61c7bb0d90145561d5f100ffad3e426002a71f3252f80da91ae0c2182d49', false, NOW(), NOW(), 4,
  'crc-age-80-health-history-preference', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-age-80-health-history-preference', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-347", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210348', 'usmle-step-2', 'gastroenterology',
  $sc$A 58-year-old man who works as a ceramicist is seen in the primary care clinic comparing stool-test schedules on a clinic card. Choosing a test he can mail from the studio matters to him. He is 58, has never been screened, and has no rectal bleeding. He asks which stool-test schedule is a recommended strategy. Temperature is 36.8°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/76 mm Hg. Body mass index is 27 kg/m2. Hemoglobin is 15.0 g/dL.$sc$,
  $qu$Which of the following stool-test schedules is a recommended strategy?$qu$,
  $op${"options": ["Repeat FIT every 10 years, using the negative-colonoscopy interval", "Repeat FIT every 5 years, using the flexible-sigmoidoscopy interval", "Repeat FIT every year, which is a recommended screening strategy", "Order a serum test every year and call that the screening strategy", "Collect FIT cards from 3 bowel movements and add a guaiac diet"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-annual-fit-strategy", "taskCategory": "health-maintenance"}$op$,
  $ky$Repeat FIT every year, which is a recommended screening strategy$ky$,
  $ex$Annual FIT is one of the recommended screening strategies. "Repeat FIT every 10 years, using the negative-colonoscopy interval" is not the best choice because Every 10 years is the colonoscopy interval when the examination is negative, not the FIT interval. "Repeat FIT every 5 years, using the flexible-sigmoidoscopy interval" is not the best choice because Every 5 years applies to flexible sigmoidoscopy and to CT colonography, not to FIT. "Order a serum test every year and call that the screening strategy" is not the best choice because Serum tests are not recommended screening tests. "Collect FIT cards from 3 bowel movements and add a guaiac diet" is not the best choice because Samples from 3 bowel movements and dietary restrictions belong to high-sensitivity guaiac testing. FIT does not use those rules.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '271be9b177c4da37c72455582f90875ab5a202d6006249ca2fde91b8b6c703d4', false, NOW(), NOW(), 1,
  'crc-annual-fit-strategy', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-annual-fit-strategy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-348", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210349', 'usmle-step-2', 'gastroenterology',
  $sc$A 63-year-old woman who works as a tax preparer is seen in the endoscopy recovery area after being told the examination showed no abnormality. This morning's colonoscopy was negative. She is 63, feels well, and has a stack of client folders waiting at the office. She asks when a negative examination should be repeated. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Body mass index is 26 kg/m2. Hemoglobin checked yesterday was 13.5 g/dL.$sc$,
  $qu$Which of the following intervals is appropriate after this negative examination?$qu$,
  $op${"options": ["Repeat colonoscopy in 1 year, using the same cadence as annual FIT at this encounter", "Repeat colonoscopy in 3 years as ordinary screening follow-up", "Repeat colonoscopy in 5 years, as with flexible sigmoidoscopy", "Repeat colonoscopy in 10 years, the interval after a negative study", "Stop colonoscopy forever after this single negative examination"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-negative-colonoscopy-ten-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Repeat colonoscopy in 10 years, the interval after a negative study$ky$,
  $ex$Colonoscopy is recommended every 10 years when the examination is negative. "Repeat colonoscopy in 1 year, using the same cadence as annual FIT at this encounter" is not the best choice because Annual testing is the FIT strategy. It is not the interval after a negative colonoscopy. "Repeat colonoscopy in 3 years as ordinary screening follow-up" is not the best choice because A 3-year return is not a screening interval given for a negative colonoscopy. "Repeat colonoscopy in 5 years, as with flexible sigmoidoscopy" is not the best choice because Every 5 years is the interval for flexible sigmoidoscopy and for CT colonography. "Stop colonoscopy forever after this single negative examination" is not the best choice because One negative colonoscopy does not end the strategy. The interval is 10 years, and she is still inside ages 50 to 75.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '29b2d682387b76f80d7425d77b59539c767b51d76acec91a439e425a8ae37ae2', false, NOW(), NOW(), 2,
  'crc-negative-colonoscopy-ten-years', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-negative-colonoscopy-ten-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-349", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210350', 'usmle-step-2', 'gastroenterology',
  $sc$A 57-year-old man who works as a locksmith is seen in the imaging-center clinic asking about a scan instead of colonoscopy. Shift work makes a full day for colonoscopy hard to schedule. He is 57, has never been screened, and has no rectal bleeding. He asks whether CT colonography is a recommended strategy and how often it is done. Temperature is 36.7°C, pulse is 76/min, respirations are 15/min, and blood pressure is 122/78 mm Hg. Body mass index is 30 kg/m2. Hemoglobin is 14.7 g/dL.$sc$,
  $qu$Which of the following is a recommended CT colonography plan?$qu$,
  $op${"options": ["CT colonography every 10 years after a scan that looks normal", "CT colonography every year, copied from the annual FIT schedule", "CT colonography is not among the recommended screening strategies", "Capsule endoscopy every 5 years, offered in place of the scan", "CT colonography every 5 years, a recommended screening strategy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-ct-colonography-five-years", "taskCategory": "health-maintenance"}$op$,
  $ky$CT colonography every 5 years, a recommended screening strategy$ky$,
  $ex$CT colonography every 5 years is a recommended screening strategy. "CT colonography every 10 years after a scan that looks normal" is not the best choice because Every 10 years is the interval for colonoscopy when it is negative, not for CT colonography. "CT colonography every year, copied from the annual FIT schedule" is not the best choice because Annual testing is the FIT strategy, not the CT colonography interval. "CT colonography is not among the recommended screening strategies" is not the best choice because CT colonography every 5 years is included among the recommended strategies. "Capsule endoscopy every 5 years, offered in place of the scan" is not the best choice because Capsule endoscopy is not a recommended screening test.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'a4b274d6c1b78deb38d2bc96c6511f5a52f5abdb11f5aec75561aa9eff46dc34', false, NOW(), NOW(), 3,
  'crc-ct-colonography-five-years', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-ct-colonography-five-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-350", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210351', 'usmle-step-2', 'gastroenterology',
  $sc$A 55-year-old woman who works as a choir director is seen in the surgery clinic before choosing among screening examinations. Rehearsals fill her evenings, and she wants an examination that is not a full colonoscopy. She is 55, has never been screened, and has no rectal bleeding. She asks how often flexible sigmoidoscopy is recommended. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. Body mass index is 25 kg/m2. Hemoglobin is 13.0 g/dL.$sc$,
  $qu$Which of the following schedules is a recommended strategy?$qu$,
  $op${"options": ["Flexible sigmoidoscopy every 5 years, a recommended screening strategy", "Flexible sigmoidoscopy every 10 years when the examination is negative", "Flexible sigmoidoscopy every year, together with dietary restrictions", "Flexible sigmoidoscopy is not one of the recommended screening strategies", "A urine test every 5 years, used instead of flexible sigmoidoscopy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-flex-sig-five-years", "taskCategory": "health-maintenance"}$op$,
  $ky$Flexible sigmoidoscopy every 5 years, a recommended screening strategy$ky$,
  $ex$Flexible sigmoidoscopy every 5 years is a recommended screening strategy. "Flexible sigmoidoscopy every 10 years when the examination is negative" is not the best choice because Every 10 years is the colonoscopy interval when the examination is negative, not the flexible-sigmoidoscopy interval. "Flexible sigmoidoscopy every year, together with dietary restrictions" is not the best choice because Annual testing and dietary restrictions are not the flexible-sigmoidoscopy strategy. Dietary restrictions belong to high-sensitivity guaiac testing. "Flexible sigmoidoscopy is not one of the recommended screening strategies" is not the best choice because Flexible sigmoidoscopy every 5 years is one of the recommended strategies. "A urine test every 5 years, used instead of flexible sigmoidoscopy" is not the best choice because Urine tests are not recommended screening tests.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', 'c6b17e44c196324fa26476fe541085990689f52d1e480fae82056077d0fd1327', false, NOW(), NOW(), 3,
  'crc-flex-sig-five-years', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-flex-sig-five-years', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-351", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210352', 'usmle-step-2', 'gastroenterology',
  $sc$A 60-year-old man who works as a land surveyor is seen in the primary care clinic after reading a waiting-room poster. A poster says colonoscopy is repeated every 5 years when negative and flexible sigmoidoscopy every 10 years. He is 60, has no rectal bleeding, and has never been screened. He asks which line on the poster has the intervals backward. Temperature is 36.8°C, pulse is 68/min, respirations are 14/min, and blood pressure is 126/78 mm Hg. Body mass index is 28 kg/m2. Hemoglobin is 15.2 g/dL.$sc$,
  $qu$Which of the following corrects the poster?$qu$,
  $op${"options": ["Both examinations are repeated every year when negative", "Colonoscopy is every 10 years when negative, and sigmoidoscopy is every 5", "Both examinations are repeated every 5 years when negative", "Colonoscopy is every 5 years when negative, and sigmoidoscopy is every 10", "Both examinations are repeated every 10 years when negative"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-colonoscopy-and-sig-intervals", "taskCategory": "interpretation"}$op$,
  $ky$Colonoscopy is every 10 years when negative, and sigmoidoscopy is every 5$ky$,
  $ex$Colonoscopy is every 10 years when negative. Flexible sigmoidoscopy is every 5 years. The poster reverses those intervals. "Both examinations are repeated every year when negative" is not the best choice because Neither examination is an annual strategy. Annual FIT is the annual strategy named here. "Both examinations are repeated every 5 years when negative" is not the best choice because Flexible sigmoidoscopy is every 5 years, but colonoscopy after a negative examination is every 10 years. "Colonoscopy is every 5 years when negative, and sigmoidoscopy is every 10" is not the best choice because That is the poster's wording, and it swaps the two intervals. "Both examinations are repeated every 10 years when negative" is not the best choice because Flexible sigmoidoscopy is every 5 years, not every 10. The 10-year interval is for negative colonoscopy.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation"]$tg$,
  's2-new-20261121-hidden', '8591844c10022274d3070cac64496bb91c738ddc3fabc40446238024e051341b', false, NOW(), NOW(), 3,
  'crc-colonoscopy-and-sig-intervals', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-colonoscopy-and-sig-intervals', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-352", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210353', 'usmle-step-2', 'gastroenterology',
  $sc$A 61-year-old woman who works as a florist is seen in the primary care clinic holding a guaiac card kit she was given at the desk. Cards for a high-sensitivity guaiac test are still in the envelope. She is 61, has no rectal bleeding, and asks what the kit requires before she returns it. She wonders if one sample and her usual meals are enough. Temperature is 36.6°C, pulse is 74/min, respirations are 15/min, and blood pressure is 116/72 mm Hg. Body mass index is 26 kg/m2. Hemoglobin is 13.3 g/dL.$sc$,
  $qu$Which of the following instructions matches this guaiac test?$qu$,
  $op${"options": ["One sample is enough, and no dietary change is required", "Three bowel movements are sampled, but the diet can stay the same during today's visit", "Samples from 3 bowel movements are required, and the diet is restricted", "The diet is restricted, but a single bowel movement is enough", "A urine sample replaces the stool cards if the diet is restricted"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-gfobt-three-samples-diet", "taskCategory": "health-maintenance"}$op$,
  $ky$Samples from 3 bowel movements are required, and the diet is restricted$ky$,
  $ex$High-sensitivity guaiac FOBT needs samples from 3 bowel movements and dietary restrictions. "One sample is enough, and no dietary change is required" is not the best choice because One sample and no dietary change describes FIT, not high-sensitivity guaiac testing. "Three bowel movements are sampled, but the diet can stay the same during today's visit" is not the best choice because High-sensitivity guaiac testing needs both samples from 3 bowel movements and dietary restrictions. "The diet is restricted, but a single bowel movement is enough" is not the best choice because Both parts are required. A diet change does not reduce the test to one bowel movement. "A urine sample replaces the stool cards if the diet is restricted" is not the best choice because Urine tests are not recommended screening tests, and a urine sample is not part of this kit.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance", "nutrition"]$tg$,
  's2-new-20261121-hidden', '74b28480a3a1d6a25c51bfbf39fc920367830441974f4a3edc8f379cb8791d3b', false, NOW(), NOW(), 3,
  'crc-gfobt-three-samples-diet', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-gfobt-three-samples-diet', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-353", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": true, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210354', 'usmle-step-2', 'gastroenterology',
  $sc$A 59-year-old man who works as a machinist is seen in the primary care clinic before he starts an annual FIT. Advice taped to the kit tells him to avoid red meat and to smear cards from 3 bowel movements. He is 59, has no rectal bleeding, and the order is for FIT, not a guaiac test. He asks what he actually has to do. Temperature is 36.9°C, pulse is 72/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Body mass index is 32 kg/m2. Hemoglobin is 14.4 g/dL.$sc$,
  $qu$Which of the following is the most appropriate statement to him?$qu$,
  $op${"options": ["FIT uses the same 3-sample and diet rules as high-sensitivity guaiac testing at this encounter", "FIT needs the dietary restrictions, but it does not need 3 stool samples", "FIT needs samples from 3 bowel movements, but it does not need a diet change", "FIT needs neither 3 samples nor a special diet; those rules are for guaiac tests", "Only sDNA-FIT avoids those rules, while FIT is still expected to follow them"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-fit-without-guaiac-rules", "taskCategory": "communication"}$op$,
  $ky$FIT needs neither 3 samples nor a special diet; those rules are for guaiac tests$ky$,
  $ex$FIT does not require samples from 3 bowel movements or dietary restrictions. Those requirements belong to high-sensitivity guaiac FOBT. "FIT uses the same 3-sample and diet rules as high-sensitivity guaiac testing at this encounter" is not the best choice because FIT does not use the 3-sample requirement or the dietary restrictions. Those belong to high-sensitivity guaiac testing. "FIT needs the dietary restrictions, but it does not need 3 stool samples" is not the best choice because FIT does not require dietary restrictions. "FIT needs samples from 3 bowel movements, but it does not need a diet change" is not the best choice because FIT does not require samples from 3 bowel movements. "Only sDNA-FIT avoids those rules, while FIT is still expected to follow them" is not the best choice because Both FIT and sDNA-FIT avoid the guaiac sample and diet rules. The exemption is not limited to sDNA-FIT.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "communication", "nutrition"]$tg$,
  's2-new-20261121-hidden', '0921df1779a22ea1ba988467eab66404d77451533205c796a7090e06249cc564', false, NOW(), NOW(), 2,
  'crc-fit-without-guaiac-rules', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'communication', 'crc-fit-without-guaiac-rules', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-354", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": true, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210355', 'usmle-step-2', 'gastroenterology',
  $sc$A 66-year-old woman who works as a records archivist is seen in the primary care clinic after a mailed sDNA-FIT kit arrived at her apartment. The kit insert she was given for a different test talks about diet limits and 3 cards. This order is an sDNA-FIT. She is 66, has no rectal bleeding, and asks whether those diet limits apply to this kit. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Body mass index is 24 kg/m2. Hemoglobin is 13.7 g/dL.$sc$,
  $qu$Which of the following is the correct instruction?$qu$,
  $op${"options": ["sDNA-FIT requires dietary restrictions and samples from 3 bowel movements", "Stop screening at 66, so the kit should be discarded without a sample", "sDNA-FIT is done every 10 years, so diet rules apply only in year 10", "A serum test uses the same diet rules and can replace this kit", "sDNA-FIT does not require those dietary restrictions or 3 guaiac samples"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-sdna-fit-without-diet-rules", "taskCategory": "interpretation"}$op$,
  $ky$sDNA-FIT does not require those dietary restrictions or 3 guaiac samples$ky$,
  $ex$sDNA-FIT does not require dietary restrictions or samples from 3 bowel movements. Those rules belong to high-sensitivity guaiac testing. She is 66, which is still inside the grade A ages of 50 to 75. "sDNA-FIT requires dietary restrictions and samples from 3 bowel movements" is not the best choice because That combination is the high-sensitivity guaiac requirement, not the sDNA-FIT requirement. "Stop screening at 66, so the kit should be discarded without a sample" is not the best choice because Age 66 is inside 50 to 75 years, when screening should be done. Stopping is not indicated. "sDNA-FIT is done every 10 years, so diet rules apply only in year 10" is not the best choice because No 10-year interval is stated for sDNA-FIT. The 10-year interval is for colonoscopy when it is negative, and dietary restrictions are not part of sDNA-FIT. "A serum test uses the same diet rules and can replace this kit" is not the best choice because Serum tests are not recommended screening tests, and they are not described as sharing guaiac diet rules.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation", "nutrition"]$tg$,
  's2-new-20261121-hidden', 'b9df465a47c81a9811f10e8300598c8b4258d3135cbd24e5115a98fbc08ecc90', false, NOW(), NOW(), 4,
  'crc-sdna-fit-without-diet-rules', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-sdna-fit-without-diet-rules', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-355", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": true, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210356', 'usmle-step-2', 'gastroenterology',
  $sc$A 64-year-old man who works as a sommelier is seen in the primary care clinic to discuss a FIT that returned positive. The phone message said the FIT was positive. He feels well, has no rectal bleeding, and hopes to repeat a stool test next year rather than take time away from the shop for colonoscopy. He is 64. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Body mass index is 27 kg/m2. Hemoglobin is 14.1 g/dL.$sc$,
  $qu$Which of the following is the most appropriate statement?$qu$,
  $op${"options": ["Refer for colonoscopy, or the benefit of the positive test is lost", "Scheduling another FIT for next year is enough if he still feels well", "Three more guaiac cards and a restricted diet can clear the positive result", "A serum test can take the place of colonoscopy after a positive FIT", "Screening is already complete because the stool kit was returned"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-positive-fit-needs-colonoscopy", "taskCategory": "communication"}$op$,
  $ky$Refer for colonoscopy, or the benefit of the positive test is lost$ky$,
  $ex$A positive stool test requires colonoscopy. Without colonoscopy, the benefit of the test is not obtained. Feeling well does not remove that step. He is also inside the 50-to-75-year screening ages. "Scheduling another FIT for next year is enough if he still feels well" is not the best choice because Repeating FIT next year does not obtain the benefit of a stool test that is already positive. "Three more guaiac cards and a restricted diet can clear the positive result" is not the best choice because Guaiac sample and diet rules are about how that test is collected. They do not clear a positive FIT. "A serum test can take the place of colonoscopy after a positive FIT" is not the best choice because Serum tests are not recommended screening tests and are not the follow-up for a positive stool test. "Screening is already complete because the stool kit was returned" is not the best choice because Returning the kit does not finish the strategy when the result is positive.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "communication"]$tg$,
  's2-new-20261121-hidden', '7a41c2a76c319ddf12de1c859f34278ac20a9940178e9da9c8ab1545a69a74ce', false, NOW(), NOW(), 2,
  'crc-positive-fit-needs-colonoscopy', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'communication', 'crc-positive-fit-needs-colonoscopy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-356", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210357', 'usmle-step-2', 'gastroenterology',
  $sc$A 52-year-old woman who works as a cartographer is seen in the primary care clinic reviewing a handout that equates two intervals. A handout says FIT is repeated every 10 years, the same interval printed for a negative colonoscopy. She is 52, has never been screened, and has no rectal bleeding. She asks which interval belongs to FIT. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. Body mass index is 23 kg/m2. Hemoglobin is 13.9 g/dL.$sc$,
  $qu$Which of the following is the correct comparison?$qu$,
  $op${"options": ["Both FIT and a negative colonoscopy are repeated every 5 years", "FIT is annual, and colonoscopy is every 10 years when negative", "Both FIT and a negative colonoscopy are repeated every 10 years", "FIT is every 10 years, and colonoscopy is annual when negative", "FIT is every 5 years, and colonoscopy is every 5 years when negative"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-fit-annual-not-ten-year", "taskCategory": "interpretation"}$op$,
  $ky$FIT is annual, and colonoscopy is every 10 years when negative$ky$,
  $ex$Annual FIT is a recommended strategy. Colonoscopy is every 10 years when the examination is negative. "Both FIT and a negative colonoscopy are repeated every 5 years" is not the best choice because Five years is the interval for CT colonography and flexible sigmoidoscopy, not for FIT or for negative colonoscopy. "Both FIT and a negative colonoscopy are repeated every 10 years" is not the best choice because The 10-year interval is for colonoscopy when negative. FIT is not assigned that interval. "FIT is every 10 years, and colonoscopy is annual when negative" is not the best choice because Those intervals are reversed. FIT is the annual strategy, and the 10-year interval belongs to negative colonoscopy. "FIT is every 5 years, and colonoscopy is every 5 years when negative" is not the best choice because Neither strategy is a 5-year test. Five years applies to CT colonography and flexible sigmoidoscopy.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'ccb8c9261e00e0548c6e65980d7175088cdcb1304918a2757c24148fd161cc22', false, NOW(), NOW(), 3,
  'crc-fit-annual-not-ten-year', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-fit-annual-not-ten-year', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-357", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210358', 'usmle-step-2', 'gastroenterology',
  $sc$A 60-year-old man who works as a blacksmith is seen in the surgery clinic after flexible sigmoidoscopy was reported as abnormal. The report from last Tuesday says the flexible sigmoidoscopy was abnormal. He is 60, has no rectal bleeding today, and was told the screening examination is finished. He asks whether anything else is required. Temperature is 36.8°C, pulse is 66/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. Body mass index is 29 kg/m2. Hemoglobin is 14.3 g/dL.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Repeat flexible sigmoidoscopy in 5 years and add no other examination", "Switch to annual FIT and do not refer the patient for colonoscopy", "Refer for colonoscopy, or the benefit of the abnormal study is not obtained", "Order capsule endoscopy and treat that study as the completion test", "Order a urine test and use it to decide whether the abnormality matters at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-abnormal-sigmoidoscopy-colonoscopy", "taskCategory": "clinical-intervention"}$op$,
  $ky$Refer for colonoscopy, or the benefit of the abnormal study is not obtained$ky$,
  $ex$An abnormal flexible sigmoidoscopy requires colonoscopy, or the benefit is not obtained. "Repeat flexible sigmoidoscopy in 5 years and add no other examination" is not the best choice because A normal flexible-sigmoidoscopy interval is 5 years. An abnormal examination is not followed by simply waiting 5 years. "Switch to annual FIT and do not refer the patient for colonoscopy" is not the best choice because A positive or abnormal screening finding of this type is not completed by switching to FIT. "Order capsule endoscopy and treat that study as the completion test" is not the best choice because Capsule endoscopy is not a recommended screening test and is not the stated next step. "Order a urine test and use it to decide whether the abnormality matters at the present visit" is not the best choice because Urine tests are not recommended screening tests and do not settle an abnormal sigmoidoscopy.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '84b00dfec46ea9d9c5f0462dacfd53d908b16ad07836e4ea53a53afa54698013', false, NOW(), NOW(), 3,
  'crc-abnormal-sigmoidoscopy-colonoscopy', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'crc-abnormal-sigmoidoscopy-colonoscopy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-358", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210359', 'usmle-step-2', 'gastroenterology',
  $sc$A 67-year-old woman who works as a copy editor is seen in the imaging follow-up clinic after CT colonography was read as abnormal. The scanner report calls the CT colonography abnormal. She is 67, feels well, and hoped the pictures would be the last step. She asks to repeat the scan in 5 years rather than have a colonoscopy. Temperature is 36.5°C, pulse is 78/min, respirations are 16/min, and blood pressure is 122/74 mm Hg. Body mass index is 26 kg/m2. Hemoglobin is 12.7 g/dL.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["The abnormal scan completes screening, so colonoscopy is unnecessary", "Repeat CT colonography in 5 years and do not refer for colonoscopy", "Follow the abnormal scan with annual FIT and skip colonoscopy", "Colonoscopy is required, or the benefit of the abnormal scan is lost", "Use a serum test to cancel the abnormal CT colonography result"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-abnormal-ctc-needs-colonoscopy", "taskCategory": "clinical-intervention"}$op$,
  $ky$Colonoscopy is required, or the benefit of the abnormal scan is lost$ky$,
  $ex$An abnormal CT colonography requires colonoscopy, or the benefit is not obtained. "The abnormal scan completes screening, so colonoscopy is unnecessary" is not the best choice because An abnormal CT colonography does not finish the strategy by itself. "Repeat CT colonography in 5 years and do not refer for colonoscopy" is not the best choice because Every 5 years is the interval for CT colonography used as screening. An abnormal study is not managed by waiting for the next routine scan. "Follow the abnormal scan with annual FIT and skip colonoscopy" is not the best choice because Annual FIT does not replace colonoscopy after an abnormal CT colonography. "Use a serum test to cancel the abnormal CT colonography result" is not the best choice because Serum tests are not recommended screening tests and do not clear an abnormal CT colonography.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '169a3871c5b61587c79da6d746f6bc3d199ef27db7119aa1cb86ce54ed5b9d35', false, NOW(), NOW(), 4,
  'crc-abnormal-ctc-needs-colonoscopy', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'crc-abnormal-ctc-needs-colonoscopy', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-359", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210360', 'usmle-step-2', 'gastroenterology',
  $sc$A 53-year-old man who works as a beekeeper is seen in the primary care clinic asking for a blood test instead of stool or colonoscopy. An advertisement in the beekeeping newsletter offers a serum screening test that claims to replace other testing. He is 53, has never been screened, and has no rectal bleeding. He asks for that blood test today. Temperature is 36.7°C, pulse is 70/min, respirations are 14/min, and blood pressure is 116/74 mm Hg. Body mass index is 27 kg/m2. Hemoglobin is 14.8 g/dL.$sc$,
  $qu$Which of the following is the most appropriate response?$qu$,
  $op${"options": ["Order the serum test yearly, because it is treated as equal to annual FIT", "Order the serum test every 10 years, using the negative-colonoscopy interval", "Order the serum test yearly only when it is paired with a urine test", "Prefer the serum test on the claim that he is outside the screening ages", "Decline a serum test and discuss one of the recommended strategies"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-serum-test-not-recommended", "taskCategory": "health-maintenance"}$op$,
  $ky$Decline a serum test and discuss one of the recommended strategies$ky$,
  $ex$Serum tests are not recommended screening tests. He is 53, so screening itself is appropriate, using a recommended strategy such as annual FIT or colonoscopy every 10 years when negative. "Order the serum test yearly, because it is treated as equal to annual FIT" is not the best choice because Annual FIT is a recommended strategy. A serum test is not equivalent to it and is not recommended. "Order the serum test every 10 years, using the negative-colonoscopy interval" is not the best choice because The 10-year interval belongs to negative colonoscopy, not to a serum test. Serum tests are not recommended. "Order the serum test yearly only when it is paired with a urine test" is not the best choice because Neither serum tests nor urine tests are recommended screening tests. Pairing them does not make a recommended strategy. "Prefer the serum test on the claim that he is outside the screening ages" is not the best choice because Age 53 is inside the grade A range of 50 to 75 years. The reason to decline the serum test is that it is not a recommended test, not that he is too young or too old.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '52aa3da26fd2adec54bcb346678945e1c5c259486f37fbeaf88c44543ff8542c', false, NOW(), NOW(), 4,
  'crc-serum-test-not-recommended', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-serum-test-not-recommended', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-360", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210361', 'usmle-step-2', 'gastroenterology',
  $sc$A 54-year-old woman who works as a tailor is seen in the primary care clinic with a urine kit a representative left at her shop. A sales representative told customers the urine kit is screening and that the clinic should sign the order form. She is 54, has no rectal bleeding, and has never been screened. She asks the physician to endorse the kit. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. Body mass index is 25 kg/m2. Hemoglobin is 13.2 g/dL.$sc$,
  $qu$Which of the following is the most appropriate professional response?$qu$,
  $op${"options": ["Decline the urine kit as screening and offer a recommended strategy instead", "Sign the form, because any sample is better than no screening", "Endorse the kit if she also follows a guaiac diet for 3 days", "Use the urine kit as the follow-up for any future positive FIT", "Accept the kit because urine testing is preferred from ages 50 to 75 at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-urine-test-not-recommended", "taskCategory": "professionalism"}$op$,
  $ky$Decline the urine kit as screening and offer a recommended strategy instead$ky$,
  $ex$Urine tests are not recommended screening tests. She is 54 and should be offered a recommended strategy, such as annual FIT, colonoscopy every 10 years when negative, CT colonography every 5 years, or flexible sigmoidoscopy every 5 years. "Sign the form, because any sample is better than no screening" is not the best choice because Offering some test is not enough. Urine tests are not recommended screening tests, so signing for this kit is not appropriate screening. "Endorse the kit if she also follows a guaiac diet for 3 days" is not the best choice because Dietary rules belong to high-sensitivity guaiac stool testing. They do not turn a urine kit into a recommended test. "Use the urine kit as the follow-up for any future positive FIT" is not the best choice because A positive stool test requires colonoscopy. A urine kit is not that follow-up. "Accept the kit because urine testing is preferred from ages 50 to 75 at the present visit" is not the best choice because Ages 50 to 75 years should be screened, but not with a urine test. Urine tests are not recommended.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "professionalism"]$tg$,
  's2-new-20261121-hidden', '22855408c476bb3128ad8a14142c71bd4d276186f7a5ba43475803cf23871850', false, NOW(), NOW(), 4,
  'crc-urine-test-not-recommended', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'professionalism', 'crc-urine-test-not-recommended', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-361", "hidden": true, "physicianTask": "professionalism", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210362', 'usmle-step-2', 'gastroenterology',
  $sc$A 56-year-old man who works as a park ranger is seen in the primary care clinic requesting the capsule study a friend had for stomach pain. A friend swallowed a capsule camera after months of stomach pain. This ranger has no pain, no rectal bleeding, and has never been screened. He is 56 and asks for the same capsule study as his screening test. Temperature is 36.8°C, pulse is 68/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Body mass index is 26 kg/m2. Hemoglobin is 15.3 g/dL.$sc$,
  $qu$Which of the following is the most appropriate response?$qu$,
  $op${"options": ["Capsule endoscopy every 10 years matches negative colonoscopy", "Capsule endoscopy is not a recommended screening test", "Capsule endoscopy is the proper follow-up after a positive FIT", "Capsule endoscopy every 5 years matches CT colonography", "Annual capsule endoscopy is a recommended stool-free strategy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-capsule-not-recommended", "taskCategory": "health-maintenance"}$op$,
  $ky$Capsule endoscopy is not a recommended screening test$ky$,
  $ex$Capsule endoscopy is not a recommended screening test. He is 56, so a recommended strategy should be discussed instead. "Capsule endoscopy every 10 years matches negative colonoscopy" is not the best choice because Every 10 years is the interval for colonoscopy when negative. Capsule endoscopy is not a recommended screening test and does not inherit that interval. "Capsule endoscopy is the proper follow-up after a positive FIT" is not the best choice because A positive stool test requires colonoscopy, not capsule endoscopy. "Capsule endoscopy every 5 years matches CT colonography" is not the best choice because Every 5 years is the interval for CT colonography and flexible sigmoidoscopy. Capsule endoscopy is not given that role. "Annual capsule endoscopy is a recommended stool-free strategy" is not the best choice because Annual FIT is a recommended strategy. Annual capsule endoscopy is not.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '7b9633c484e66ef03c6d032da3a60a2ec59ad4a8efb81fbf45c1eb339d13eb8d', false, NOW(), NOW(), 4,
  'crc-capsule-not-recommended', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'crc-capsule-not-recommended', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-362", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210363', 'usmle-step-2', 'gastroenterology',
  $sc$A 54-year-old woman who works as a ferry captain is seen in the primary care clinic choosing between two annual stool tests. Comparison of an annual FIT and an annual high-sensitivity guaiac test is the reason for the visit. She is 54, has no rectal bleeding, and has never been screened. She asks which annual stool strategy modeling favored for life-years gained. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. Body mass index is 28 kg/m2. Hemoglobin is 13.6 g/dL.$sc$,
  $qu$Which of the following is the correct statement about that modeling?$qu$,
  $op${"options": ["Annual guaiac testing gained more life-years than annual FIT did", "The two annual stool tests gained the same number of life-years", "Modeling favored annual FIT over annual high-sensitivity guaiac testing", "A yearly serum test gained more life-years than annual FIT did", "Colonoscopy every 5 years was the only strategy named in that comparison"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "gastrointestinal", "blueprintTopic": "crc-fit-more-life-years-than-gfobt", "taskCategory": "interpretation"}$op$,
  $ky$Modeling favored annual FIT over annual high-sensitivity guaiac testing$ky$,
  $ex$Modeling found that annual screening with FIT gains more life-years than annual high-sensitivity guaiac FOBT. "Annual guaiac testing gained more life-years than annual FIT did" is not the best choice because The modeling comparison runs in the other direction. Annual FIT gained more life-years than annual high-sensitivity guaiac FOBT. "The two annual stool tests gained the same number of life-years" is not the best choice because The modeling did not find the two annual stool strategies equal. FIT gained more life-years. "A yearly serum test gained more life-years than annual FIT did" is not the best choice because Serum tests are not recommended screening tests, and they are not the strategy that modeling found gained more life-years. "Colonoscopy every 5 years was the only strategy named in that comparison" is not the best choice because That comparison was between the two annual stool strategies. Colonoscopy every 5 years is not the negative-colonoscopy interval, which is 10 years, and it was not the finding of this modeling comparison.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "gastrointestinal", "interpretation"]$tg$,
  's2-new-20261121-hidden', '5f48ea6d13fd6fa557484000976c33e838097721e320139294baccd6307f920f', false, NOW(), NOW(), 5,
  'crc-fit-more-life-years-than-gfobt', 'gastrointestinal', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'crc-fit-more-life-years-than-gfobt', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-363", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210364', 'usmle-step-2', 'cardiology',
  $sc$A 42-year-old man who works as a flight dispatcher is seen in the primary care clinic for an employment physical before a new tower rotation. Night shifts have not changed how he feels. He takes no daily medicine. The average of repeated standardized readings is 112/72 mm Hg, and he asks what category that average falls in. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 112/72 mm Hg. Body mass index is 24 kg/m2. He is not pregnant. A basic metabolic panel last week was unremarkable.$sc$,
  $qu$Which category applies to this average reading?$qu$,
  $op${"options": ["Elevated: every systolic pressure under 130 belongs in that band during today's visit", "Stage 1: a diastolic pressure under 80 is still called stage 1", "Stage 2: a systolic pressure under 140 is already called stage 2", "Normal: systolic pressure under 120 and diastolic pressure under 80", "Stage 2: a diastolic pressure under 90 is already called stage 2"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-bp-category-normal", "taskCategory": "diagnosis"}$op$,
  $ky$Normal: systolic pressure under 120 and diastolic pressure under 80$ky$,
  $ex$Normal blood pressure is a systolic value under 120 and a diastolic value under 80. Both 112 and 72 meet that definition. "Elevated: every systolic pressure under 130 belongs in that band during today's visit" is not the best choice because Elevated is a systolic value of 120 to 129 with a diastolic value under 80. A systolic value of 112 is below that band. "Stage 1: a diastolic pressure under 80 is still called stage 1" is not the best choice because Stage 1 is a systolic value of 130 to 139 or a diastolic value of 80 to 89. Neither number is in those ranges. "Stage 2: a systolic pressure under 140 is already called stage 2" is not the best choice because Stage 2 requires a systolic value of at least 140 or a diastolic value of at least 90. A systolic value under 140 is not stage 2, and 112/72 is normal. "Stage 2: a diastolic pressure under 90 is already called stage 2" is not the best choice because A diastolic value under 90 does not define stage 2. Stage 2 begins at a diastolic value of 90. This diastolic value is 72, with a systolic value under 120, so the category is normal.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '6335546fb32c87081ba14ea4119551924f0cfe782db39e1f0715b4ccb732c1c0', false, NOW(), NOW(), 1,
  'cv-bp-category-normal', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cv-bp-category-normal', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-364", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210365', 'usmle-step-2', 'cardiology',
  $sc$A 58-year-old man who works as a glassblower is seen in the primary care clinic asking what treatment target applies to him. Furnace work is hot, but he is here for the numbers, not for heat illness. He already takes a thiazide-type diuretic. The average home reading is 138/86 mm Hg. He is not pregnant and wants the goal stated plainly. Temperature is 36.8°C, pulse is 76/min, respirations are 16/min, and blood pressure is 138/86 mm Hg. Body mass index is 29 kg/m2. The 10-year PREVENT risk has not been recalculated today.$sc$,
  $qu$Which treatment goal applies to this adult?$qu$,
  $op${"options": ["Under 120/80 mm Hg, using the cutoffs that define a normal reading", "Under 140/90 mm Hg, the target used in pregnancy for that pattern", "Under 140/80 mm Hg, mixing a pregnancy systolic limit with 80", "Under 160/100 mm Hg, the office level at which treatment is prompt", "Under 130/80 mm Hg, the treatment goal for adults in general"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-general-goal-under-130-80", "taskCategory": "interpretation"}$op$,
  $ky$Under 130/80 mm Hg, the treatment goal for adults in general$ky$,
  $ex$The treatment goal for adults in general is under 130/80 mm Hg. Pregnancy is the exception, and he is not pregnant. "Under 120/80 mm Hg, using the cutoffs that define a normal reading" is not the best choice because Under 120 and under 80 defines the normal category. The treatment goal for adults in general is under 130/80, not the normal-category cutoffs. "Under 140/90 mm Hg, the target used in pregnancy for that pattern" is not the best choice because Under 140/90 is the pregnancy target for the chronic pattern described in the guideline. It is not the general adult goal. "Under 140/80 mm Hg, mixing a pregnancy systolic limit with 80" is not the best choice because The general goal is under 130/80, not a hybrid of 140 and 80. "Under 160/100 mm Hg, the office level at which treatment is prompt" is not the best choice because Office readings at or above 160/100 are treated promptly because white-coat hypertension is uncommon at that level. That threshold is not the treatment goal.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "interpretation"]$tg$,
  's2-new-20261121-hidden', '4d0862b164c20950dcbbb2b86898ae955302d23c5417677b78579d8fef35b0f1', false, NOW(), NOW(), 1,
  'cv-general-goal-under-130-80', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cv-general-goal-under-130-80', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-365", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210366', 'usmle-step-2', 'cardiology',
  $sc$A 47-year-old woman who works as a city planner is seen in the primary care clinic reviewing the average of her home readings. Zoning hearings have filled her month. She takes no blood-pressure medicine. Repeated home readings average 126/74 mm Hg, and today's office reading matches that average. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 126/74 mm Hg. Body mass index is 27 kg/m2. She is not pregnant. Estimated GFR is 88 mL/min.$sc$,
  $qu$Which category applies to this average?$qu$,
  $op${"options": ["Elevated: systolic 120 to 129 with diastolic pressure under 80", "Normal, because both numbers sit under 130 and under 80", "Stage 1, because the systolic value has moved past 120", "Stage 2, because the systolic value is nearer 140 than 120", "Normal, because no blood-pressure medicine has been started at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-bp-category-elevated", "taskCategory": "diagnosis"}$op$,
  $ky$Elevated: systolic 120 to 129 with diastolic pressure under 80$ky$,
  $ex$Elevated blood pressure is a systolic value of 120 to 129 and a diastolic value under 80. Both parts of that definition are met. "Normal, because both numbers sit under 130 and under 80" is not the best choice because Normal requires a systolic value under 120 as well as a diastolic value under 80. The systolic value is 126. "Stage 1, because the systolic value has moved past 120" is not the best choice because Stage 1 starts at a systolic value of 130 or at a diastolic value of 80. A systolic value of 126 with a diastolic value under 80 is not stage 1. "Stage 2, because the systolic value is nearer 140 than 120" is not the best choice because Stage 2 is a systolic value of at least 140 or a diastolic value of at least 90. Neither is present. "Normal, because no blood-pressure medicine has been started at the present visit" is not the best choice because Category comes from the numbers, not from whether a medicine has already been prescribed.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'ee1269df67a9cfb0c95fd313bd80a7457bc29f70fd8bfb1754fe3b78cc680ff7', false, NOW(), NOW(), 2,
  'cv-bp-category-elevated', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cv-bp-category-elevated', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-366", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210367', 'usmle-step-2', 'cardiology',
  $sc$A 51-year-old man who works as a speech therapist is seen in the community clinic with a stack of home readings from 14 days. School sessions keep his schedule regular. He takes no blood-pressure medicine. The 14-day average is 134/82 mm Hg, and the office reading today is the same. Temperature is 36.7°C, pulse is 72/min, respirations are 15/min, and blood pressure is 134/82 mm Hg. Body mass index is 28 kg/m2. Estimated GFR is 76 mL/min. He does not have diabetes.$sc$,
  $qu$Which category applies to this average?$qu$,
  $op${"options": ["Normal, because the systolic value is still under 140", "Stage 1: systolic 130 to 139, or diastolic 80 to 89", "Elevated, because the systolic value is only a little above 120", "Stage 2, because the diastolic value has reached 80", "Stage 2, because the two numbers are added before a stage is assigned"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-bp-category-stage1", "taskCategory": "diagnosis"}$op$,
  $ky$Stage 1: systolic 130 to 139, or diastolic 80 to 89$ky$,
  $ex$Stage 1 is a systolic value of 130 to 139 or a diastolic value of 80 to 89. This average meets both of those descriptions and does not meet stage 2. "Normal, because the systolic value is still under 140" is not the best choice because A systolic value under 140 is not the definition of normal. Normal is under 120 and under 80. "Elevated, because the systolic value is only a little above 120" is not the best choice because Elevated is systolic 120 to 129 with diastolic under 80. The systolic value is 134, which is above that band. "Stage 2, because the diastolic value has reached 80" is not the best choice because A diastolic value of 80 to 89 is stage 1, not stage 2. Stage 2 diastolic values are 90 or higher. "Stage 2, because the two numbers are added before a stage is assigned" is not the best choice because Stage 2 is not defined by adding the two numbers, and a diastolic value under 90 does not create stage 2. Stage 2 requires a systolic value of at least 140 or a diastolic value of at least 90.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '70f966c1c2c65b3f8e0e288b6302ef3f0e64e8612d64e800abc788bbac2f000a', false, NOW(), NOW(), 2,
  'cv-bp-category-stage1', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cv-bp-category-stage1', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-367", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210368', 'usmle-step-2', 'cardiology',
  $sc$A 49-year-old woman who works as a roofer is seen in the occupational clinic after a week of tar and shingle work. Tar buckets and steep pitches filled the week. She has no diabetes, no chronic kidney disease, no prior stroke, and no clinical cardiovascular disease. The 10-year PREVENT risk is 3.8 percent. Cuffs kept on the job trailer average 148/96 mm Hg. She is not pregnant and wants a plan before the next roof. Temperature is 36.8°C, pulse is 80/min, respirations are 16/min, and blood pressure is 148/96 mm Hg. A harness-fit note lists weight 82 kg. Serum creatinine is 0.8 mg/dL.$sc$,
  $qu$Which of the following is the most appropriate initial plan?$qu$,
  $op${"options": ["Lifestyle measures alone for 3 to 6 months, then reconsider a medicine", "No medicine, because the 10-year PREVENT risk is under 7.5 percent", "Start medication together with lifestyle measures at this visit", "No medicine, unless the office reading is at least 160/100 mm Hg", "Use the pregnancy target and do not treat a reading under 150/100"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-stage2-medication-for-every-adult", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start medication together with lifestyle measures at this visit$ky$,
  $ex$For an average of at least 140/90, medication is started, along with lifestyle measures, in all adults. Extra conditions are not required at this level. "Lifestyle measures alone for 3 to 6 months, then reconsider a medicine" is not the best choice because The 3-to-6-month lifestyle period is for adults at or above 130/80 who do not meet the 140/90 rule and who lack the listed conditions, with PREVENT risk under 7.5 percent. Her average is already 148/96. "No medicine, because the 10-year PREVENT risk is under 7.5 percent" is not the best choice because A PREVENT risk under 7.5 percent does not cancel treatment when the average is at least 140/90. Medication is started for all adults at that level. "No medicine, unless the office reading is at least 160/100 mm Hg" is not the best choice because Readings at or above 160/100 are treated promptly because white-coat hypertension is uncommon. They are not the lowest level at which medication starts. Medication starts at an average of at least 140/90 in all adults. "Use the pregnancy target and do not treat a reading under 150/100" is not the best choice because The pregnancy target is not used for this nonpregnant adult. The general approach at this average is medication plus lifestyle measures.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '6a7be8c3e328d6dd986c71061f23d714d61a6d4e1f50b69a2da7283b2cd685f1', false, NOW(), NOW(), 2,
  'cv-stage2-medication-for-every-adult', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-stage2-medication-for-every-adult', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-368", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210369', 'usmle-step-2', 'cardiology',
  $sc$A 62-year-old man who works as a jeweler is seen in the cardiology clinic to choose initial medicines for a confirmed average. Bench work requires fine focus, and he wants the regimen simple. There is no coronary disease and no heart failure. The home average is 152/94 mm Hg. Estimated GFR is 78 mL/min. He is not pregnant. Temperature is 36.7°C, pulse is 70/min, respirations are 14/min, and blood pressure is 152/94 mm Hg. Body mass index is 28 kg/m2. He takes no blood-pressure medicine yet.$sc$,
  $qu$Which initial regimen is preferred?$qu$,
  $op${"options": ["The same two first-line drugs prescribed as two separate pills", "One pill combining an ACE inhibitor with an ARB", "One pill combining an ACE inhibitor with aliskiren", "One pill combining two first-line drugs from different classes", "A beta-blocker plus a thiazide-type diuretic as the default pair"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-stage2-single-pill-combination", "taskCategory": "pharmacotherapy"}$op$,
  $ky$One pill combining two first-line drugs from different classes$ky$,
  $ex$For stage 2, the preferred start is two first-line drugs from different classes in one single-pill combination. First-line classes are a thiazide-type diuretic, a long-acting dihydropyridine calcium-channel blocker, an ACE inhibitor, and an ARB. He has no coronary disease or heart failure. "The same two first-line drugs prescribed as two separate pills" is not the best choice because Two separate pills are not the preferred way to give the two drugs. One single-pill combination is preferred. "One pill combining an ACE inhibitor with an ARB" is not the best choice because An ACE inhibitor should not be combined with an ARB. "One pill combining an ACE inhibitor with aliskiren" is not the best choice because An ACE inhibitor should not be combined with aliskiren. "A beta-blocker plus a thiazide-type diuretic as the default pair" is not the best choice because A beta-blocker is not one of the default first drugs unless coronary disease or heart failure is present. Neither is present here.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'f4b363410000e1782fa34c4eda2d3eb53371f833892c2833247383b8f0b8bf56', false, NOW(), NOW(), 2,
  'cv-stage2-single-pill-combination', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-stage2-single-pill-combination', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-369", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210370', 'usmle-step-2', 'cardiology',
  $sc$A 55-year-old woman who works as a translator is seen in the primary care clinic starting treatment for a home average of 144/90 mm Hg. Deadline weeks have not changed the readings. She has no coronary disease and no heart failure. Estimated GFR is 81 mL/min. She is not pregnant and asks which class is on the default first-line list. Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 144/90 mm Hg. Body mass index is 31 kg/m2. The average has been at this level for 6 weeks.$sc$,
  $qu$Which class is a default first-line choice?$qu$,
  $op${"options": ["A loop diuretic, on the claim that every new start uses one", "A beta-blocker, whether or not coronary disease or heart failure exists", "A direct renin inhibitor, for example aliskiren, as a default drug", "A mineralocorticoid antagonist chosen as a default first-line drug", "A thiazide-type diuretic, one of the default first-line classes"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-default-first-line-classes", "taskCategory": "health-maintenance"}$op$,
  $ky$A thiazide-type diuretic, one of the default first-line classes$ky$,
  $ex$A thiazide-type diuretic is a first-line class, together with a long-acting dihydropyridine calcium-channel blocker, an ACE inhibitor, and an ARB. "A loop diuretic, on the claim that every new start uses one" is not the best choice because A loop diuretic is preferred over a thiazide-type diuretic when the GFR is under 30 mL/min. Her GFR is 81 mL/min, and a loop diuretic is not one of the four default first-line classes. "A beta-blocker, whether or not coronary disease or heart failure exists" is not the best choice because A beta-blocker is not first-line unless the patient has coronary disease or heart failure. She has neither. "A direct renin inhibitor, for example aliskiren, as a default drug" is not the best choice because Aliskiren is not one of the four first-line classes. It also should not be combined with an ACE inhibitor. "A mineralocorticoid antagonist chosen as a default first-line drug" is not the best choice because A mineralocorticoid antagonist is not one of the four first-line classes. It is among the drugs to avoid in pregnancy or when pregnancy is planned, which is a separate limit.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "health-maintenance"]$tg$,
  's2-new-20261121-hidden', '4f41520d75a800028d219e44c84c048567947b0fe10b2fc35ae9025305b4bb7d', false, NOW(), NOW(), 2,
  'cv-default-first-line-classes', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'health-maintenance', 'cv-default-first-line-classes', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-370", "hidden": true, "physicianTask": "health-maintenance", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210371', 'usmle-step-2', 'cardiology',
  $sc$A 44-year-old man who works as a welder is seen in the occupational clinic with repeated readings that average 118/86 mm Hg. Shop noise is the reason for the earplugs in his pocket, not for the visit. He takes no blood-pressure medicine. The average is 118/86 mm Hg, and he asks how a systolic value under 120 is categorized when the diastolic value is 86. Temperature is 36.7°C, pulse is 74/min, respirations are 16/min, and blood pressure is 118/86 mm Hg. Body mass index is 27 kg/m2. Estimated GFR is 92 mL/min.$sc$,
  $qu$Which category applies?$qu$,
  $op${"options": ["Stage 1, because the diastolic value is 80 to 89", "Normal, because the systolic value is under 120", "Elevated, because the diastolic value is under 90", "Stage 2, because the diastolic value is above 80", "Elevated, because every diastolic value under 90 is elevated"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-stage1-from-diastolic-only", "taskCategory": "diagnosis"}$op$,
  $ky$Stage 1, because the diastolic value is 80 to 89$ky$,
  $ex$Stage 1 is a systolic value of 130 to 139 or a diastolic value of 80 to 89. A diastolic value of 86 meets stage 1 even though the systolic value is under 120. "Normal, because the systolic value is under 120" is not the best choice because Normal requires both a systolic value under 120 and a diastolic value under 80. The diastolic value is 86, so the reading is not normal. "Elevated, because the diastolic value is under 90" is not the best choice because Elevated requires a systolic value of 120 to 129 and a diastolic value under 80. The systolic value is 118, and the diastolic value is not under 80. "Stage 2, because the diastolic value is above 80" is not the best choice because Stage 2 uses a diastolic value of at least 90, or a systolic value of at least 140. A diastolic value of 86 is not stage 2. "Elevated, because every diastolic value under 90 is elevated" is not the best choice because Elevated is not defined by a diastolic value under 90. It requires a systolic value of 120 to 129 and a diastolic value under 80.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '334ba8eec3940d3e79acb07e24d3c0c4b762defc7dc8390b4d608516c543d0fd', false, NOW(), NOW(), 3,
  'cv-stage1-from-diastolic-only', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cv-stage1-from-diastolic-only', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-371", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210372', 'usmle-step-2', 'cardiology',
  $sc$A 66-year-old woman who works as a botanist is seen in the primary care clinic reviewing an average of 142/76 mm Hg. Greenhouse mornings start early. She takes no blood-pressure medicine. Home readings average 142/76 mm Hg. She asks whether a diastolic value under 80 keeps the category out of the higher stage. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 142/76 mm Hg. Body mass index is 26 kg/m2. Estimated GFR is 70 mL/min. She is not pregnant.$sc$,
  $qu$Which category applies?$qu$,
  $op${"options": ["Normal, because the diastolic value is under 80", "Stage 2, because the systolic value is at least 140", "Elevated, because the diastolic value is under 80", "Stage 1, because the diastolic value is under 90", "Stage 1, because only readings with both numbers high are stage 2"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-stage2-from-systolic-only", "taskCategory": "diagnosis"}$op$,
  $ky$Stage 2, because the systolic value is at least 140$ky$,
  $ex$Stage 2 is a systolic value of at least 140 or a diastolic value of at least 90. The systolic value of 142 meets stage 2 even though the diastolic value is 76. "Normal, because the diastolic value is under 80" is not the best choice because Normal requires a systolic value under 120 and a diastolic value under 80. The systolic value is 142. "Elevated, because the diastolic value is under 80" is not the best choice because Elevated requires a systolic value of 120 to 129, not 142, along with a diastolic value under 80. "Stage 1, because the diastolic value is under 90" is not the best choice because A diastolic value under 90 does not define stage 1, and it does not cancel a systolic value that is already at least 140. "Stage 1, because only readings with both numbers high are stage 2" is not the best choice because Stage 2 does not require both numbers to be high. Either a systolic value of at least 140 or a diastolic value of at least 90 is enough.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "diagnosis"]$tg$,
  's2-new-20261121-hidden', 'af590d0dbf5ce9dd30804c81f102d170bcaf96e33a05b72540a3e57f6a1d0040', false, NOW(), NOW(), 3,
  'cv-stage2-from-systolic-only', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cv-stage2-from-systolic-only', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-372", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210373', 'usmle-step-2', 'cardiology',
  $sc$A 57-year-old man who works as a piano tuner is seen in the endocrine clinic with diabetes and a home average of 134/86 mm Hg. He has diabetes and takes no blood-pressure medicine. There is no coronary disease and no heart failure. The home average over 3 weeks is 134/86 mm Hg. He asks whether lifestyle measures alone are enough. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 134/86 mm Hg. Body mass index is 32 kg/m2. Estimated GFR is 74 mL/min. Hemoglobin A1C is 7.6 percent.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Use lifestyle measures alone for 3 to 6 months at this systolic level", "Withhold medicine until the average reaches 160/100 mm Hg", "Begin medication and lifestyle measures together during this visit", "Pair an ACE inhibitor with an ARB in one prescription today", "Start a beta-blocker as the only default drug, and no other class"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-diabetes-threshold-start-drug", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Begin medication and lifestyle measures together during this visit$ky$,
  $ex$Medication, plus lifestyle measures, is started at an average of at least 130/80 when diabetes is present. The same threshold applies for clinical cardiovascular disease, prior stroke, chronic kidney disease, or a 10-year PREVENT risk of at least 7.5 percent. "Use lifestyle measures alone for 3 to 6 months at this systolic level" is not the best choice because The lifestyle-only period is for adults without diabetes, clinical cardiovascular disease, chronic kidney disease, or prior stroke, and with PREVENT risk under 7.5 percent. Diabetes is present, and the average is at least 130/80. "Withhold medicine until the average reaches 160/100 mm Hg" is not the best choice because Prompt treatment at or above 160/100 is about not delaying for white-coat hypertension. Medication for diabetes starts at an average of at least 130/80. "Pair an ACE inhibitor with an ARB in one prescription today" is not the best choice because An ACE inhibitor should not be combined with an ARB. "Start a beta-blocker as the only default drug, and no other class" is not the best choice because A beta-blocker is not a default first-line drug unless coronary disease or heart failure is present. Neither is described.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '85e06218b06b0385dabbd68a366a544d32da75df10ae4325c4a87397dda0417e', false, NOW(), NOW(), 3,
  'cv-diabetes-threshold-start-drug', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-diabetes-threshold-start-drug', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-373", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210374', 'usmle-step-2', 'cardiology',
  $sc$A 64-year-old woman who works as a grant writer is seen in the nephrology clinic with chronic kidney disease and a home average of 132/84 mm Hg. Grant deadlines have not changed the readings. Estimated GFR is 44 mL/min. She has no coronary disease and no heart failure. The home average is 132/84 mm Hg, and she takes no blood-pressure medicine. Temperature is 36.6°C, pulse is 78/min, respirations are 16/min, and blood pressure is 132/84 mm Hg. Body mass index is 28 kg/m2. She is not pregnant. Urine studies were already reviewed by nephrology.$sc$,
  $qu$Which of the following is the most appropriate medication plan?$qu$,
  $op${"options": ["Prefer a loop diuretic over a thiazide-type diuretic because the GFR is 44", "Use lifestyle measures alone for 3 to 6 months despite kidney disease", "Wait until the average is at least 140/90 before starting a medicine", "Start a first-line drug now; do not prefer a loop diuretic at this GFR", "Combine an ACE inhibitor with aliskiren as the starting pair"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-ckd-gfr-above-30-start-drug", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start a first-line drug now; do not prefer a loop diuretic at this GFR$ky$,
  $ex$Chronic kidney disease is a reason to start medication, plus lifestyle measures, at an average of at least 130/80. A loop diuretic is preferred over a thiazide-type diuretic only when the GFR is under 30 mL/min. Her GFR is 44 mL/min, so a thiazide-type diuretic remains a first-line choice, along with a long-acting dihydropyridine, an ACE inhibitor, or an ARB. "Prefer a loop diuretic over a thiazide-type diuretic because the GFR is 44" is not the best choice because The loop-diuretic preference applies when the GFR is under 30 mL/min, not at 44 mL/min. "Use lifestyle measures alone for 3 to 6 months despite kidney disease" is not the best choice because Lifestyle measures alone for 3 to 6 months are for adults without chronic kidney disease, diabetes, clinical cardiovascular disease, or prior stroke, when PREVENT risk is under 7.5 percent. Chronic kidney disease is present. "Wait until the average is at least 140/90 before starting a medicine" is not the best choice because The 140/90 threshold is for all adults, including those without kidney disease. With chronic kidney disease, medication starts at an average of at least 130/80. "Combine an ACE inhibitor with aliskiren as the starting pair" is not the best choice because An ACE inhibitor should not be combined with aliskiren.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '07c3ec5dff41c65f124695205a11320f15ce4d7737fe37eae5860ee76458700f', false, NOW(), NOW(), 3,
  'cv-ckd-gfr-above-30-start-drug', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-ckd-gfr-above-30-start-drug', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-374", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210375', 'usmle-step-2', 'cardiology',
  $sc$A 60-year-old man who works as a stonemason is seen in the union hall clinic bringing a printed 10-year PREVENT estimate of 8.8 percent. Chisel dust is still on his sleeves. He has no diabetes, no chronic kidney disease, no prior stroke, and no clinical cardiovascular disease. He takes no blood-pressure medicine. Quarry-town home readings average 131/82 mm Hg. He asks whether that risk printout, by itself, changes the plan. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 131/82 mm Hg. He is not pregnant. A shoulder radiograph last winter showed no fracture. Height is 178 cm.$sc$,
  $qu$Which of the following is the most appropriate plan?$qu$,
  $op${"options": ["Use lifestyle measures alone because diabetes, kidney disease, and stroke are absent at this encounter", "Start no medicine, because the systolic average is still under 140 mm Hg", "Start an ACE inhibitor and an ARB together because the printed risk is high", "Treat toward under 140/90 and treat 131/82 mm Hg as a completed goal", "Start medication and lifestyle measures because the 10-year risk is at least 7.5 percent"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-prevent-at-least-7-5-start-drug", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Start medication and lifestyle measures because the 10-year risk is at least 7.5 percent$ky$,
  $ex$Medication plus lifestyle measures is started at an average of at least 130/80 when the 10-year PREVENT risk is at least 7.5 percent. The same threshold applies with clinical cardiovascular disease, prior stroke, diabetes, or chronic kidney disease. His risk is 8.8 percent. "Use lifestyle measures alone because diabetes, kidney disease, and stroke are absent at this encounter" is not the best choice because Absence of those diseases does not keep the plan at lifestyle alone when the 10-year PREVENT risk is at least 7.5 percent and the average is at least 130/80. "Start no medicine, because the systolic average is still under 140 mm Hg" is not the best choice because A systolic value under 140 does not avoid medication when the average is at least 130/80 and the PREVENT risk is at least 7.5 percent. The 140/90 rule is an additional place where every adult is treated. "Start an ACE inhibitor and an ARB together because the printed risk is high" is not the best choice because An ACE inhibitor should not be combined with an ARB, regardless of the risk number. "Treat toward under 140/90 and treat 131/82 mm Hg as a completed goal" is not the best choice because The general adult goal is under 130/80, not under 140/90. Under 140/90 is the pregnancy target for the chronic pattern, and he is not pregnant.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'b6765ea2d825232b6dd4167be9fec8c21488fe47ef584b76aaee1166cd2f5941', false, NOW(), NOW(), 3,
  'cv-prevent-at-least-7-5-start-drug', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-prevent-at-least-7-5-start-drug', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-375", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210376', 'usmle-step-2', 'cardiology',
  $sc$A 48-year-old woman who works as a hearing specialist is seen in the sound-booth clinic after calibrating booths, with home readings already in hand. Sound-booth calibrations are finished. Morning checks over 3 weeks average 136/84 mm Hg, and that home series is not in doubt. The 10-year PREVENT risk is 4.4 percent. She has no diabetes, no chronic kidney disease, no prior stroke, and no clinical cardiovascular disease. She is not pregnant and takes no blood-pressure medicine. Foam earplugs sit in a coat pocket. Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 136/84 mm Hg. An audiogram last year was normal at 2 kilohertz. She drinks one coffee before booth work.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Use lifestyle measures for 3 to 6 months, adding a drug if the average stays high", "Start two drugs today because every average of at least 130/80 is treated now at this encounter", "Start a beta-blocker today and use it as the default first-line drug", "Take no further action unless the average later reaches 160/100 mm Hg", "Start an ACE inhibitor together with an ARB as the pair for this visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-low-prevent-lifestyle-months", "taskCategory": "clinical-intervention"}$op$,
  $ky$Use lifestyle measures for 3 to 6 months, adding a drug if the average stays high$ky$,
  $ex$When the PREVENT risk is under 7.5 percent and there is no clinical cardiovascular disease, diabetes, or chronic kidney disease, lifestyle modification is used for 3 to 6 months at an average of at least 130/80. A prior stroke is also absent here. Medication is added if the average remains at least 130/80. "Start two drugs today because every average of at least 130/80 is treated now at this encounter" is not the best choice because Immediate medication for every adult begins at an average of at least 140/90. At 136/84, without the listed conditions and with PREVENT risk under 7.5 percent, the first step is lifestyle measures. "Start a beta-blocker today and use it as the default first-line drug" is not the best choice because A beta-blocker is not a default first-line drug unless coronary disease or heart failure is present. Neither is present, and medication is not the first step here. "Take no further action unless the average later reaches 160/100 mm Hg" is not the best choice because Waiting for 160/100 misses both the lifestyle step and the later medication step. Prompt treatment at or above 160/100 is a different rule. "Start an ACE inhibitor together with an ARB as the pair for this visit" is not the best choice because An ACE inhibitor is not combined with an ARB, and drug therapy is not the first step in this low-risk situation.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '71e49e9e94b6fe5ed938fb5087b751792ba702e4e478d3a990d99682d8e9f68f', false, NOW(), NOW(), 3,
  'cv-low-prevent-lifestyle-months', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'cv-low-prevent-lifestyle-months', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-376", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210377', 'usmle-step-2', 'cardiology',
  $sc$A 39-year-old man who works as a millwright is seen in the primary care clinic with an average reading of exactly 120/74 mm Hg. Machine maintenance is steady work, and he takes no blood-pressure medicine. Repeated readings average 120/74 mm Hg. A coworker told him that 120 still counts as normal because the cutoff is often remembered as 120 or less. Temperature is 36.6°C, pulse is 66/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Body mass index is 25 kg/m2. Estimated GFR is 96 mL/min.$sc$,
  $qu$Which category applies to 120/74 mm Hg?$qu$,
  $op${"options": ["Normal, because the systolic cutoff for a normal reading includes 120", "Elevated: systolic pressure 120 to 129 and diastolic pressure under 80", "Stage 1, because the systolic value has reached 120 on this average", "Stage 2, because a systolic value of 120 is described as halfway to 140", "Normal, because a diastolic value under 80 is enough by itself"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-systolic-120-is-elevated", "taskCategory": "diagnosis"}$op$,
  $ky$Elevated: systolic pressure 120 to 129 and diastolic pressure under 80$ky$,
  $ex$Elevated is a systolic value of 120 to 129 and a diastolic value under 80. An average of 120/74 meets that definition. "Normal, because the systolic cutoff for a normal reading includes 120" is not the best choice because Normal is a systolic value under 120, not 120 or under. A systolic value of 120 is outside normal when the rest of the elevated definition is met. "Stage 1, because the systolic value has reached 120 on this average" is not the best choice because Stage 1 begins at a systolic value of 130, or at a diastolic value of 80. Neither threshold is met. "Stage 2, because a systolic value of 120 is described as halfway to 140" is not the best choice because Stage 2 begins at a systolic value of 140 or a diastolic value of 90. A systolic value of 120 does not qualify. "Normal, because a diastolic value under 80 is enough by itself" is not the best choice because A diastolic value under 80 is only half of the normal definition. The systolic value must also be under 120.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '5b1a29c75999f9bac08d139825952aae6a14bfdcb225d97e448e7a4bc0fb015a', false, NOW(), NOW(), 3,
  'cv-systolic-120-is-elevated', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cv-systolic-120-is-elevated', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-377", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210378', 'usmle-step-2', 'cardiology',
  $sc$A 59-year-old woman who works as a paralegal is seen in the primary care clinic with an office reading and no out-of-office readings on file. Briefs are stacked in her bag. She has no home cuff and has never worn an ambulatory monitor. The office reading today is 170/106 mm Hg. She feels well, is not pregnant, and asks whether treatment can wait for several weeks of home checks. Temperature is 36.8°C, pulse is 88/min, respirations are 16/min, and blood pressure is 170/106 mm Hg. Body mass index is 33 kg/m2. Estimated GFR is 72 mL/min. She takes no blood-pressure medicine.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Delay treatment for several weeks of home checks before any medicine", "Start lifestyle measures only, and reassess the reading in 6 months", "Treat promptly rather than delay to chase an office-only elevation", "Label the reading normal because she feels well in the office today", "Apply the pregnancy goal and withhold medicine below 180 mm Hg"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-office-severe-treat-promptly", "taskCategory": "clinical-intervention"}$op$,
  $ky$Treat promptly rather than delay to chase an office-only elevation$ky$,
  $ex$An office reading at or above 160/100 is treated promptly. White-coat hypertension is uncommon at that level. "Delay treatment for several weeks of home checks before any medicine" is not the best choice because Out-of-office measurement is reasonable when the office reading is at least 130/80 but below 160/100. This reading is 170/106, which is not in that band. "Start lifestyle measures only, and reassess the reading in 6 months" is not the best choice because Lifestyle measures alone for months are not the response to an office reading at this level. "Label the reading normal because she feels well in the office today" is not the best choice because Feeling well does not place 170/106 in the normal category. Normal is under 120 and under 80. "Apply the pregnancy goal and withhold medicine below 180 mm Hg" is not the best choice because She is not pregnant, and the pregnancy goal is not a reason to withhold treatment at 170/106.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', 'b4e65f0c469b91b63479dc82ecc3f37413bacd22ffc23570038fbe1fb28c76f1', false, NOW(), NOW(), 3,
  'cv-office-severe-treat-promptly', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'cv-office-severe-treat-promptly', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-378", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210379', 'usmle-step-2', 'cardiology',
  $sc$A 52-year-old man who works as a meteorologist is seen in the forecast office clinic between radar briefings, with only today's office cuff. Radar shifts end at dusk. He owns no home cuff and has never worn an ambulatory monitor. Diabetes, chronic kidney disease, prior stroke, and clinical cardiovascular disease are not on the chart. The office reading is 138/86 mm Hg. He takes no blood-pressure medicine. A barometer sits on the counter beside the cuff. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 138/86 mm Hg. He is not pregnant. He bicycled 4 miles to the briefing. Potassium last month was 4.1 mmol/L.$sc$,
  $qu$Which of the following is the most appropriate next step?$qu$,
  $op${"options": ["Treat promptly with two drugs, as for an office reading of at least 160/100 during today's visit", "Call the reading normal because the systolic value is under 140 mm Hg", "Start a beta-blocker today and use it as default monotherapy", "Obtain out-of-office readings before treating this office value as confirmed", "Start lifestyle measures and explicitly skip any out-of-office measurement"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-office-moderate-measure-outside", "taskCategory": "clinical-intervention"}$op$,
  $ky$Obtain out-of-office readings before treating this office value as confirmed$ky$,
  $ex$When the office reading is at least 130/80 but below 160/100, out-of-office measurement is reasonable to look for white-coat hypertension. This reading is 138/86, and no out-of-office readings exist yet. "Treat promptly with two drugs, as for an office reading of at least 160/100 during today's visit" is not the best choice because Prompt treatment without that step is for office readings at or above 160/100, where white-coat hypertension is uncommon. This reading is below that level. "Call the reading normal because the systolic value is under 140 mm Hg" is not the best choice because A systolic value under 140 does not make the reading normal. Normal is under 120 and under 80. This reading is in the stage 1 range. "Start a beta-blocker today and use it as default monotherapy" is not the best choice because A beta-blocker is not default first-line therapy without coronary disease or heart failure, and a single office reading in this range is a reason to measure out of the office. "Start lifestyle measures and explicitly skip any out-of-office measurement" is not the best choice because Out-of-office measurement is reasonable at this office level. A plan that skips it misses that step. The 3-to-6-month lifestyle trial applies once the average, not only one office visit, is in the low-risk stage 1 range.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "clinical-intervention"]$tg$,
  's2-new-20261121-hidden', '845581fd6eb55408bbd654cf6b4d2ca2e01e8f428bfe3e02783bcd82d5d92ee0', false, NOW(), NOW(), 3,
  'cv-office-moderate-measure-outside', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'clinical-intervention', 'cv-office-moderate-measure-outside', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-379", "hidden": true, "physicianTask": "clinical-intervention", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210380', 'usmle-step-2', 'cardiology',
  $sc$A 68-year-old man who works as a cabinetmaker is seen in the cardiology clinic with known coronary disease and a home average of 150/94 mm Hg. He has coronary disease and no planned pregnancy. Estimated GFR is 68 mL/min. The home average is 150/94 mm Hg. A colleague says a beta-blocker can never be first-line, even with coronary disease. Temperature is 36.7°C, pulse is 64/min, respirations are 16/min, and blood pressure is 150/94 mm Hg. Body mass index is 28 kg/m2. He is already scheduled for lifestyle counseling.$sc$,
  $qu$Which of the following statements is correct?$qu$,
  $op${"options": ["A beta-blocker is first-line for every adult once the average is at least 140/90", "Coronary disease is a reason to combine an ACE inhibitor with an ARB", "This average should be managed with lifestyle measures alone for 6 months", "A loop diuretic is preferred here because the GFR is 68 mL/min", "A beta-blocker may be first-line here because coronary disease is present"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-beta-blocker-if-coronary-disease", "taskCategory": "pharmacotherapy"}$op$,
  $ky$A beta-blocker may be first-line here because coronary disease is present$ky$,
  $ex$Beta-blockers are not first-line unless the patient has coronary disease or heart failure. Coronary disease is present, so a beta-blocker may be first-line. Heart failure is the other condition that allows that exception. "A beta-blocker is first-line for every adult once the average is at least 140/90" is not the best choice because A beta-blocker is not first-line for every adult. Without coronary disease or heart failure it is not a default first drug. "Coronary disease is a reason to combine an ACE inhibitor with an ARB" is not the best choice because An ACE inhibitor should not be combined with an ARB. Coronary disease does not lift that prohibition. "This average should be managed with lifestyle measures alone for 6 months" is not the best choice because An average of at least 140/90 is treated with medication plus lifestyle measures in all adults. A 6-month delay is not the plan, and coronary disease is an additional reason to treat at or above 130/80. "A loop diuretic is preferred here because the GFR is 68 mL/min" is not the best choice because A loop diuretic is preferred over a thiazide-type diuretic when the GFR is under 30 mL/min. The GFR is 68 mL/min.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '5a884171f4abe105dcf0849df8b31596e541363679d544fd7f0311ab8059e0cc', false, NOW(), NOW(), 4,
  'cv-beta-blocker-if-coronary-disease', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-beta-blocker-if-coronary-disease', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-380", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210381', 'usmle-step-2', 'cardiology',
  $sc$A 71-year-old woman who works as a textile designer is seen in the nephrology clinic with an estimated GFR of 22 mL/min. The home average, already confirmed outside the office, is 154/96 mm Hg. She needs a diuretic as part of treatment. Estimated GFR is 22 mL/min. She is not pregnant and has no plan to combine an ACE inhibitor with an ARB. Temperature is 36.6°C, pulse is 80/min, respirations are 16/min, and blood pressure is 154/96 mm Hg. Body mass index is 27 kg/m2. Potassium on last week's panel was 4.4 mmol/L.$sc$,
  $qu$Which diuretic choice fits this GFR?$qu$,
  $op${"options": ["A loop diuretic is preferred over a thiazide-type diuretic", "A thiazide-type diuretic is preferred over a loop diuretic at this GFR", "Neither diuretic is usable until the GFR falls below 15 mL/min", "A loop diuretic is preferred only when the GFR is above 30 mL/min", "Skip diuretics and combine an ACE inhibitor with an ARB instead"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-loop-diuretic-gfr-below-30", "taskCategory": "pharmacotherapy"}$op$,
  $ky$A loop diuretic is preferred over a thiazide-type diuretic$ky$,
  $ex$Loop diuretics are preferred over thiazide-type diuretics when the GFR is under 30 mL/min. Her GFR is 22 mL/min. The home average of 154/96 also meets the rule to start medication plus lifestyle measures in all adults. "A thiazide-type diuretic is preferred over a loop diuretic at this GFR" is not the best choice because The preference runs the other way when the GFR is under 30 mL/min. A thiazide-type diuretic is not the preferred diuretic at a GFR of 22 mL/min. "Neither diuretic is usable until the GFR falls below 15 mL/min" is not the best choice because No cutoff of 15 mL/min is stated. The stated threshold is a GFR under 30 mL/min. "A loop diuretic is preferred only when the GFR is above 30 mL/min" is not the best choice because The loop preference is for a GFR under 30 mL/min, not for a GFR above 30. "Skip diuretics and combine an ACE inhibitor with an ARB instead" is not the best choice because An ACE inhibitor should not be combined with an ARB, and that ban is not a reason to avoid the appropriate diuretic.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'eeb939ed00a09b2401620f55aa6af651ca75b8576792d59e6a587e33a49f9b60', false, NOW(), NOW(), 4,
  'cv-loop-diuretic-gfr-below-30', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-loop-diuretic-gfr-below-30', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-381", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210382', 'usmle-step-2', 'cardiology',
  $sc$A 33-year-old woman who works as a fisheries observer is seen in the preconception clinic because she plans to conceive this year. Boat schedules leave a narrow window for the visit. The home average is 146/92 mm Hg. She has had no aspirin reaction. She asks which of the choices discussed today should be avoided while she is trying to become pregnant. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 146/92 mm Hg. Body mass index is 26 kg/m2. Estimated GFR is 98 mL/min. A pregnancy test today is negative.$sc$,
  $qu$Which of the following should be avoided?$qu$,
  $op${"options": ["Lifestyle measures used together with drug therapy", "An ACE inhibitor, including an agent such as lisinopril", "A long-acting dihydropyridine calcium-channel blocker", "A thiazide-type diuretic used as a first-line choice", "Low-dose aspirin counseling after 12 weeks of pregnancy"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-pregnancy-drugs-to-avoid", "taskCategory": "pharmacotherapy"}$op$,
  $ky$An ACE inhibitor, including an agent such as lisinopril$ky$,
  $ex$When pregnancy is planned, do not use an ACE inhibitor. The same prohibition covers an ARB, atenolol, a direct renin inhibitor, nitroprusside, and a mineralocorticoid antagonist. "Lifestyle measures used together with drug therapy" is not the best choice because Lifestyle measures are used with medication. They are not on the list of drugs to avoid when pregnancy is planned. "A long-acting dihydropyridine calcium-channel blocker" is not the best choice because A long-acting dihydropyridine calcium-channel blocker is a first-line class. It is not on the list of agents to avoid in pregnancy or when pregnancy is planned. "A thiazide-type diuretic used as a first-line choice" is not the best choice because A thiazide-type diuretic is a first-line class. It is not on the list of agents to avoid when pregnancy is planned. "Low-dose aspirin counseling after 12 weeks of pregnancy" is not the best choice because People with this blood-pressure history who are planning pregnancy should be counseled about low-dose aspirin after 12 weeks, unless they have had an aspirin adverse reaction or allergy. She has not. Avoiding that counseling is not the instruction.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', '4aa9b35fd0b6a5539b1af07e831e2e318e90b76fb5c7acc614faaff554582497', false, NOW(), NOW(), 4,
  'cv-pregnancy-drugs-to-avoid', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-pregnancy-drugs-to-avoid', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-382", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210383', 'usmle-step-2', 'cardiology',
  $sc$A 29-year-old woman who works as a horticulturist is seen in the obstetric clinic at 18 weeks of gestation. Before pregnancy, repeated readings were 146/94 mm Hg. She is now at 18 weeks, and the current average is 148/96 mm Hg. She asks whether the goal used for nonpregnant adults applies to her. Temperature is 36.7°C, pulse is 90/min, respirations are 16/min, and blood pressure is 148/96 mm Hg. The fetal heart rate is 150/min. Estimated GFR is 110 mL/min. She has had no aspirin reaction.$sc$,
  $qu$Which blood-pressure goal is appropriate?$qu$,
  $op${"options": ["A goal under 120/80 mm Hg, matching the normal category", "A goal under 130/80 mm Hg, the general goal for other adults", "A goal under 140/90 mm Hg for this pregnancy pattern", "A goal under 160/100 mm Hg, the level for prompt office treatment", "A goal under 150/100 mm Hg, set by splitting today's reading"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-pregnancy-goal-below-140-90", "taskCategory": "interpretation"}$op$,
  $ky$A goal under 140/90 mm Hg for this pregnancy pattern$ky$,
  $ex$She had prepregnancy readings of 146/94, which sit in the stated prepregnancy pattern, and she is before 20 weeks with readings of 148/96. The treatment target is under 140/90, not the nonpregnant goal of under 130/80. "A goal under 120/80 mm Hg, matching the normal category" is not the best choice because Under 120 and under 80 defines the normal category. It is not the pregnancy treatment target for this pattern. "A goal under 130/80 mm Hg, the general goal for other adults" is not the best choice because Under 130/80 is the goal for adults in general. That nonpregnant goal is not the pregnancy target. "A goal under 160/100 mm Hg, the level for prompt office treatment" is not the best choice because Office readings at or above 160/100 are treated promptly in the general guidance about white-coat hypertension. That threshold is not the pregnancy goal. "A goal under 150/100 mm Hg, set by splitting today's reading" is not the best choice because No goal is made by splitting today's reading. The pregnancy target for this pattern is under 140/90.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'a253d8be2cf6dc8f9c9f4d5ac1c7ebd23a2c96272e0c2d487f9736aa0627ad37', false, NOW(), NOW(), 4,
  'cv-pregnancy-goal-below-140-90', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'cv-pregnancy-goal-below-140-90', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-383", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210384', 'usmle-step-2', 'cardiology',
  $sc$A 31-year-old woman who works as a paramedic instructor is seen in the obstetric clinic at 16 weeks of gestation. Before pregnancy her repeated readings were 144/92 mm Hg. She has never had an aspirin rash, breathing trouble, or other aspirin reaction. A cited meta-analysis reported a pooled relative risk of 0.85, with a 95 percent confidence interval of 0.75 to 0.95. She asks what that means for aspirin. Temperature is 36.6°C, pulse is 88/min, respirations are 16/min, and blood pressure is 142/88 mm Hg. The fetal heart rate is 146/min. She takes a prenatal vitamin and no blood-pressure medicine yet.$sc$,
  $qu$Which of the following is the most appropriate counseling?$qu$,
  $op${"options": ["Start aspirin only before 12 weeks, then stop it for the rest of pregnancy", "Do not discuss aspirin, because a milligram dose is not named and counseling must wait", "Avoid aspirin, because a relative risk of 0.85 means a higher risk", "Use low-dose aspirin now, after 12 weeks; the cited ratio is on the side of lower risk", "Skip aspirin, because the interval 0.75 to 0.95 includes 1.0 and shows no difference"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-low-dose-aspirin-after-12-weeks", "taskCategory": "communication"}$op$,
  $ky$Use low-dose aspirin now, after 12 weeks; the cited ratio is on the side of lower risk$ky$,
  $ex$People with this blood-pressure history who are pregnant should be counseled about low-dose aspirin after 12 weeks, unless they have had an aspirin adverse reaction or allergy. She is at 16 weeks and has no such history. The cited pooled relative risk is 0.85, and the 95 percent confidence interval of 0.75 to 0.95 lies below 1, on the side of lower risk. No milligram dose is specified beyond low-dose aspirin. "Start aspirin only before 12 weeks, then stop it for the rest of pregnancy" is not the best choice because The timing is after 12 weeks, not a course that stops once 12 weeks have passed. "Do not discuss aspirin, because a milligram dose is not named and counseling must wait" is not the best choice because The wording to use is low-dose aspirin after 12 weeks. Counseling does not wait for a milligram amount that is not given. "Avoid aspirin, because a relative risk of 0.85 means a higher risk" is not the best choice because A relative risk below 1 means a lower risk in the treated comparison used for that pooled estimate, not a higher risk. The point estimate is 0.85. "Skip aspirin, because the interval 0.75 to 0.95 includes 1.0 and shows no difference" is not the best choice because The interval is 0.75 to 0.95. It does not include 1.0.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "communication"]$tg$,
  's2-new-20261121-hidden', 'd11041fdd7fa38ee46f98450fb784771c09cca9ea3c47dba90a51c7c5ebaf124', false, NOW(), NOW(), 4,
  'cv-low-dose-aspirin-after-12-weeks', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'communication', 'cv-low-dose-aspirin-after-12-weeks', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-384", "hidden": true, "physicianTask": "communication", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210385', 'usmle-step-2', 'cardiology',
  $sc$A 46-year-old man who works as a brewery chemist is seen in the primary care clinic with a confirmed average of 129/80 mm Hg. Fermentation logs are precise, and so is the cuff average: 129/80 mm Hg on repeated home readings. He takes no blood-pressure medicine. He was told the systolic value alone makes the category elevated. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 129/80 mm Hg. Body mass index is 26 kg/m2. Estimated GFR is 89 mL/min. He is not pregnant.$sc$,
  $qu$Which of the following is the correct category?$qu$,
  $op${"options": ["Elevated, because the systolic value is 120 to 129 and that label ignores the diastolic value", "Normal, because the systolic value is under 130 and the diastolic value is not yet 90", "Stage 2, because a diastolic value of 80 meets the stage 2 diastolic rule", "Elevated, because stage 1 requires both the systolic and diastolic values to be at least 130", "Stage 1, because the diastolic value is 80 to 89 even though the systolic value is 129"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-diastolic-80-is-stage1", "taskCategory": "diagnosis"}$op$,
  $ky$Stage 1, because the diastolic value is 80 to 89 even though the systolic value is 129$ky$,
  $ex$Stage 1 is a systolic value of 130 to 139 or a diastolic value of 80 to 89. A diastolic value of 80 meets stage 1. The systolic value of 129 would have fit the elevated systolic band only if the diastolic value were under 80. "Elevated, because the systolic value is 120 to 129 and that label ignores the diastolic value" is not the best choice because Elevated requires a systolic value of 120 to 129 and a diastolic value under 80. The diastolic value is 80, so the elevated category does not apply. "Normal, because the systolic value is under 130 and the diastolic value is not yet 90" is not the best choice because Normal requires a systolic value under 120 and a diastolic value under 80. Neither cutoff is met in the required way: the diastolic value is 80, and the systolic value is not under 120. "Stage 2, because a diastolic value of 80 meets the stage 2 diastolic rule" is not the best choice because Stage 2 uses a diastolic value of at least 90, or a systolic value of at least 140. A diastolic value of 80 is the start of stage 1, not stage 2. "Elevated, because stage 1 requires both the systolic and diastolic values to be at least 130" is not the best choice because Stage 1 uses or, not and. Either a systolic value of 130 to 139 or a diastolic value of 80 to 89 is enough. Both do not have to reach 130.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "diagnosis"]$tg$,
  's2-new-20261121-hidden', '8ebf798e6abe56156c7b63cccad3531b35da96704d15a1b8ff4e3aadce4a6a6d', false, NOW(), NOW(), 5,
  'cv-diastolic-80-is-stage1', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'diagnosis', 'cv-diastolic-80-is-stage1', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-385", "hidden": true, "physicianTask": "diagnosis", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210386', 'usmle-step-2', 'cardiology',
  $sc$A 50-year-old woman who works as a railroad dispatcher is seen in the follow-up clinic returning 5 months after a lifestyle trial began. Five months ago the home average was 135/86 mm Hg. Dispatch logs show evening walks along the rail yard and a change in packed lunches. She has no diabetes, no chronic kidney disease, no prior stroke, and no clinical cardiovascular disease. The 10-year PREVENT risk is 6.0 percent. The new confirmed home average is 132/84 mm Hg. Temperature is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 132/84 mm Hg. She is not pregnant and takes no blood-pressure medicine. Waist circumference fell from 98 cm to 94 cm.$sc$,
  $qu$Which of the following is the most appropriate medication plan?$qu$,
  $op${"options": ["Add medication now, because the average is still at least 130/80", "Continue lifestyle measures alone for a full year before any drug", "Add no drug unless the average climbs to 140/90 mm Hg", "Start an ACE inhibitor and an ARB together at this visit", "Call 132/84 a success because it is under a pregnancy goal of 140/90"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "cardiovascular", "blueprintTopic": "cv-add-drug-if-still-high-after-lifestyle", "taskCategory": "pharmacotherapy"}$op$,
  $ky$Add medication now, because the average is still at least 130/80$ky$,
  $ex$With PREVENT risk under 7.5 percent and no clinical cardiovascular disease, diabetes, or chronic kidney disease, lifestyle measures are used for 3 to 6 months. Medication is added if the average remains at least 130/80. It is 132/84 after 5 months. A prior stroke is also absent, so the lifestyle path was appropriate at the start and the add-on rule applies now. "Continue lifestyle measures alone for a full year before any drug" is not the best choice because The lifestyle period is 3 to 6 months, not a required full year. Five months have passed, and the average is still at least 130/80. "Add no drug unless the average climbs to 140/90 mm Hg" is not the best choice because Waiting for 140/90 would apply a threshold used for all adults at that higher level. After the lifestyle period, medication is added if the average remains at least 130/80, even when it is still under 140/90. "Start an ACE inhibitor and an ARB together at this visit" is not the best choice because An ACE inhibitor should not be combined with an ARB. "Call 132/84 a success because it is under a pregnancy goal of 140/90" is not the best choice because Under 140/90 is the pregnancy target for the chronic pattern, not the goal for this nonpregnant adult. The general goal is under 130/80, and 132/84 is not under that goal.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "cardiovascular", "pharmacotherapy"]$tg$,
  's2-new-20261121-hidden', 'ad2672665160e6cc5d23af682d1cd83c08f72a51d1ddede962ce11433f881fe7', false, NOW(), NOW(), 5,
  'cv-add-drug-if-still-high-after-lifestyle', 'cardiovascular', 'vignette',
  $rf$[{"label": "2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults.", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356"}]$rf$::jsonb,
  'step2', false,
  'pharmacotherapy', 'cv-add-drug-if-still-high-after-lifestyle', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-386", "hidden": true, "physicianTask": "pharmacotherapy", "sourceUrl": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000001356", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210387', 'usmle-step-2', 'biostatistics',
  $sc$A 34-year-old woman who works as a public health nurse is seen in the health department classroom for a required annual examination before a methods workshop. She feels well and takes no daily medicine. The workshop sheet she must score lists 40 ill people out of 200 in the group of interest and 20 ill people out of 200 in the comparison group. The sheet asks for the risk ratio. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Body mass index is 24 kg/m2. She slept 7 hours before the session.$sc$,
  $qu$Which of the following is the risk ratio for the group of interest compared with the comparison group?$qu$,
  $op${"options": ["A risk ratio of 0.5", "A risk ratio of 2.0", "A risk ratio of 20", "A risk ratio of 40", "A risk ratio of 1.0"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-equal-denominator-risk-ratio", "taskCategory": "interpretation"}$op$,
  $ky$A risk ratio of 2.0$ky$,
  $ex$Risk is ill divided by the total in that row. The group of interest has a risk of 40/200, or 20 percent. The comparison group has a risk of 20/200, or 10 percent. The risk ratio is 20 percent divided by 10 percent, which is 2.0. A ratio above 1 means a higher risk in the numerator group. "A risk ratio of 0.5" is not the best choice because A ratio of 0.5 reverses the groups. The requested ratio puts the group of interest in the numerator. "A risk ratio of 20" is not the best choice because Twenty is the count of ill people in the comparison group, or the risk percent in the group of interest. It is not the ratio of the two risks. "A risk ratio of 40" is not the best choice because Forty is the count of ill people in the group of interest, not the risk ratio. "A risk ratio of 1.0" is not the best choice because A risk ratio of 1.0 would mean equal risks. These risks are 20 percent and 10 percent, so they are not equal.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', '4261cbb2a03377b5e639e617d191b202f8b1bd37c4cf5f574fc18dbe77d7622b', false, NOW(), NOW(), 1,
  'bio-equal-denominator-risk-ratio', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-equal-denominator-risk-ratio', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-387", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210388', 'usmle-step-2', 'biostatistics',
  $sc$A 41-year-old man who works as a ward hygiene officer is seen in the hospital conference room between two ward rounds, feeling well. A drill on the whiteboard shows 25 ill people out of 100 in the first group and 10 ill people out of 100 in the comparison group. He is asked what the risk ratio means, not merely to shout a single integer. Temperature is 36.7°C, pulse is 68/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. He drank one cup of coffee. The conference clock shows a 20-minute block for the drill.$sc$,
  $qu$Which description of the risk ratio is correct?$qu$,
  $op${"options": ["It is 0.4, so the first group has a higher risk than the comparison group", "It is 2.5, and any ratio above 1.0 means the two risks are equal", "It is 2.5, so the first group has a higher risk than the comparison group", "It is 1.0, because both groups include people who became ill", "It is 25, because the risk ratio is the percent ill in the first group"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-ratio-above-one-means-higher", "taskCategory": "interpretation"}$op$,
  $ky$It is 2.5, so the first group has a higher risk than the comparison group$ky$,
  $ex$Risk in the first group is 25/100, or 25 percent. Risk in the comparison group is 10/100, or 10 percent. The risk ratio is 2.5. A risk ratio above 1 means a higher risk in the group used as the numerator. "It is 0.4, so the first group has a higher risk than the comparison group" is not the best choice because The inverted ratio is 10/25, or 0.4, and that is not the requested direction. A ratio of 0.4 would mean a lower risk in the numerator group, not a higher risk. "It is 2.5, and any ratio above 1.0 means the two risks are equal" is not the best choice because A risk ratio of 1.0, not a ratio above 1, is the value that means equal risk. A value of 2.5 means the first group has the higher risk. "It is 1.0, because both groups include people who became ill" is not the best choice because Both groups having some ill people does not make the risks equal. The risks are 25 percent and 10 percent, so the ratio is not 1.0. "It is 25, because the risk ratio is the percent ill in the first group" is not the best choice because Twenty-five is the risk percent in the first group. The risk ratio divides that risk by the comparison risk.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'c4c5b47840dc1a5e574e71c46070b56bdb4a4042534b03cfbb269fe060acc038', false, NOW(), NOW(), 2,
  'bio-ratio-above-one-means-higher', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-ratio-above-one-means-higher', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-388", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210389', 'usmle-step-2', 'biostatistics',
  $sc$A 38-year-old woman who works as a medical librarian is seen in the clinic library for a mild tension headache that has already eased. While waiting, she works a training example about cruise-ship infirmary visits: 11.6 visits per 1,000 tourists per week in 1998 and 5.3 visits per 1,000 tourists per week in 1997. The example asks for the rate ratio of 1998 compared with 1997. Temperature is 36.6°C, pulse is 74/min, respirations are 16/min, and blood pressure is 116/72 mm Hg. Pain score now is 1 out of 10. She takes no daily medicine.$sc$,
  $qu$Which of the following is that rate ratio?$qu$,
  $op${"options": ["A rate ratio of 6.3", "A rate ratio of 11.6", "A rate ratio of 5.3", "A rate ratio of 2.2", "A rate ratio of 0.46"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-cruise-ship-rate-ratio", "taskCategory": "interpretation"}$op$,
  $ky$A rate ratio of 2.2$ky$,
  $ex$The rate ratio uses rates the same way a risk ratio uses risks. The 1998 rate divided by the 1997 rate is 11.6 divided by 5.3, which equals 2.2. "A rate ratio of 6.3" is not the best choice because Subtracting 5.3 from 11.6 gives 6.3, which is a difference in rates, not a rate ratio. A rate ratio divides one rate by the other. "A rate ratio of 11.6" is not the best choice because 11.6 is the 1998 rate itself, in visits per 1,000 tourists per week. It is not the ratio of the two rates. "A rate ratio of 5.3" is not the best choice because 5.3 is the 1997 rate, not the ratio. Using it alone drops the comparison. "A rate ratio of 0.46" is not the best choice because Dividing 5.3 by 11.6 gives about 0.46, which reverses the requested direction. The 1998 rate is the numerator.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', '14b1d7672ddc778638987c3c4e8ebe4e441433d3019a0e9f8ac2e03449deea16', false, NOW(), NOW(), 2,
  'bio-cruise-ship-rate-ratio', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-cruise-ship-rate-ratio', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-389", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210390', 'usmle-step-2', 'biostatistics',
  $sc$A 45-year-old man who works as a school nurse is seen in the school health office for a pre-semester clearance visit. He feels well. A training manual on the desk describes a dormitory illness: 28 of 157 residents in the east wing became ill, and 4 of 137 residents in the west wing became ill. He is asked for the risk ratio of the east wing compared with the west wing. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 124/78 mm Hg. Body mass index is 26 kg/m2. He walked 12 minutes from the parking lot.$sc$,
  $qu$Which of the following is the risk ratio for the east wing compared with the west wing?$qu$,
  $op${"options": ["A risk ratio of 17.8", "A risk ratio of 7.0", "A risk ratio of 2.9", "A risk ratio of 0.16", "A risk ratio of 6.1"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-east-west-wing-risk-ratio", "taskCategory": "interpretation"}$op$,
  $ky$A risk ratio of 6.1$ky$,
  $ex$The east-wing risk is 28/157, about 17.8 percent. The west-wing risk is 4/137, about 2.9 percent. The risk ratio is 17.8 divided by 2.9, which equals 6.1. A ratio above 1 means a higher risk in the east wing, the numerator group. "A risk ratio of 17.8" is not the best choice because About 17.8 percent is the east-wing risk, 28 divided by 157. A risk percent is not the risk ratio. "A risk ratio of 7.0" is not the best choice because Dividing 28 by 4 gives 7 and ignores the different denominators, 157 and 137. Risk uses ill divided by the total in that row. "A risk ratio of 2.9" is not the best choice because About 2.9 percent is the west-wing risk, 4 divided by 137. That percent is not the ratio of the two risks. "A risk ratio of 0.16" is not the best choice because About 0.16 is the inverse of 6.1. It would describe the west wing compared with the east wing, which is not the direction requested.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', '110ae7b53bf62eb63b0c6024691db3db03655770e11a8cb7e23c6b15c9c9e892', false, NOW(), NOW(), 2,
  'bio-east-west-wing-risk-ratio', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-east-west-wing-risk-ratio', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-390", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210391', 'usmle-step-2', 'biostatistics',
  $sc$A 36-year-old woman who works as a sanitarian is seen in the county clinic for a routine employment examination. She feels well. The exercise packet uses these counts: 18 of 152 children who received the vaccine developed the illness, and 3 of 7 children who did not receive the vaccine developed the illness. The question asks for the risk ratio of the vaccinated group compared with the unvaccinated group. Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Body mass index is 23 kg/m2. She had a snack 2 hours ago.$sc$,
  $qu$Which of the following is that risk ratio?$qu$,
  $op${"options": ["A risk ratio of 0.28", "A risk ratio of 11.8", "A risk ratio of 42.9", "A risk ratio of 6.0", "A risk ratio of 3.6"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-vaccine-group-risk-ratio", "taskCategory": "interpretation"}$op$,
  $ky$A risk ratio of 0.28$ky$,
  $ex$The vaccinated risk is 18/152, about 11.8 percent. The unvaccinated risk is 3/7, about 42.9 percent. The risk ratio is 0.28. A ratio below 1 means the vaccinated children had a lower risk, about 28 percent of the unvaccinated children's risk. "A risk ratio of 11.8" is not the best choice because About 11.8 percent is the risk among the vaccinated children, 18 divided by 152. That percent is not the ratio of the two risks. "A risk ratio of 42.9" is not the best choice because About 42.9 percent is the risk among the unvaccinated children, 3 divided by 7. That percent is not the risk ratio. "A risk ratio of 6.0" is not the best choice because Dividing 18 by 3 gives 6 and drops the denominators 152 and 7. Risk is ill divided by the group total. "A risk ratio of 3.6" is not the best choice because About 3.6 is the inverse of 0.28, the unvaccinated group compared with the vaccinated group. The question puts the vaccinated group in the numerator.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'fa916e1d22f96bbedbe6a3e84cbdbd0648ad1747ac6d78058581b2771dcb05f1', false, NOW(), NOW(), 3,
  'bio-vaccine-group-risk-ratio', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-vaccine-group-risk-ratio', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-391", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210392', 'usmle-step-2', 'biostatistics',
  $sc$A 29-year-old man who works as a health educator is seen in the training classroom before teaching a session, and he feels well. The worked table he will project has 100 exposed people who became ill, 1900 exposed people who stayed well, 80 unexposed people who became ill, and 7920 unexposed people who stayed well. A learner asks for the odds ratio, not the risk ratio. Temperature is 36.7°C, pulse is 64/min, respirations are 14/min, and blood pressure is 120/76 mm Hg. He reviewed the table for 15 minutes. Pulse and other findings are for his own clearance visit.$sc$,
  $qu$Which of the following is the odds ratio?$qu$,
  $op${"options": ["An odds ratio of 5.0", "An odds ratio of 5.2", "An odds ratio of 1.25", "An odds ratio of 4.2", "An odds ratio of 0.2"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-textbook-table-odds-ratio", "taskCategory": "interpretation"}$op$,
  $ky$An odds ratio of 5.2$ky$,
  $ex$The odds ratio is ad/bc. With a = 100, b = 1900, c = 80, and d = 7920, ad/bc equals 5.2. The outcome is uncommon in this table, which is why 5.2 sits close to the risk ratio, but the question asks for the odds ratio. "An odds ratio of 5.0" is not the best choice because 5.0 is the risk ratio, (100/2000) divided by (80/8000). It is not ad/bc. The odds ratio is 5.2. "An odds ratio of 1.25" is not the best choice because 100 divided by 80 is 1.25, which uses only the two ill counts and is not ad/bc. "An odds ratio of 4.2" is not the best choice because 7920 divided by 1900 is about 4.2, a ratio of two well counts. The odds ratio multiplies across the table, ad/bc, and equals 5.2. "An odds ratio of 0.2" is not the best choice because About 0.2 is near the inverse of 5.2. Reversing the odds ratio is not what was asked.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', '3109e788b7565415e972ed3971c58e2fbea89fcac376572ad37b33d27a4e0239', false, NOW(), NOW(), 3,
  'bio-textbook-table-odds-ratio', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-textbook-table-odds-ratio', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-392", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210393', 'usmle-step-2', 'biostatistics',
  $sc$A 52-year-old woman who works as a clinic manager is seen in the quality-improvement office for a blood-pressure check that was already planned. She feels well. A methods note on her desk describes a cohort of 10,000 people in which 180 became ill. In that worked example the risk ratio was 5.0 and the odds ratio was 5.2. She asks why those two results sit so close together. Temperature is 36.5°C, pulse is 78/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. The cuff average she came in for is already recorded. She takes no daily medicine.$sc$,
  $qu$Which of the following explains the closeness of 5.0 and 5.2?$qu$,
  $op${"options": ["Every odds ratio is required to equal the risk ratio in every study at this encounter", "The outcome must have affected most of the 10,000 people", "The odds ratio approximates the risk ratio when the outcome is uncommon", "A case-control study produced the 5.0 directly as a risk ratio", "A risk ratio of 5.0 means the two groups had equal risk"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-odds-approximate-risk-if-uncommon", "taskCategory": "interpretation"}$op$,
  $ky$The odds ratio approximates the risk ratio when the outcome is uncommon$ky$,
  $ex$The odds ratio approximates the risk ratio when the outcome is uncommon. Here 180 of 10,000 people became ill, and the odds ratio of 5.2 is close to the risk ratio of 5.0. "Every odds ratio is required to equal the risk ratio in every study at this encounter" is not the best choice because The odds ratio is not required to equal the risk ratio in every study. In this example they are close, 5.2 and 5.0, for a stated reason. "The outcome must have affected most of the 10,000 people" is not the best choice because Most of the 10,000 did not become ill. Only 180 did, so the outcome is uncommon, which is the setting in which the odds ratio approximates the risk ratio. "A case-control study produced the 5.0 directly as a risk ratio" is not the best choice because A case-control study can estimate an odds ratio, but it cannot directly estimate a risk ratio, because the investigator chooses the control-group size. The 5.0 in this cohort example is a risk ratio, not a case-control product. "A risk ratio of 5.0 means the two groups had equal risk" is not the best choice because A risk ratio of 1.0 means equal risk. A risk ratio of 5.0 means the numerator group had a higher risk, about 5 times the comparison risk.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'eda727a5be045fbafd8dc0c88b423025401a56c81ac8dfeeed86b3f7f3f37c31', false, NOW(), NOW(), 3,
  'bio-odds-approximate-risk-if-uncommon', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-odds-approximate-risk-if-uncommon', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-393", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210394', 'usmle-step-2', 'biostatistics',
  $sc$A 43-year-old man who works as a respiratory therapist is seen in the skills laboratory for fit testing of a mask, and he feels well. A side problem on the worksheet shows 18 ill people out of 120 in the group of interest and 36 ill people out of 240 in the comparison group. He must say what the risk ratio is and what that value means. Temperature is 36.6°C, pulse is 70/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. The mask drill lasted 8 minutes. Oxygen saturation on room air is 98 percent.$sc$,
  $qu$Which of the following is correct?$qu$,
  $op${"options": ["The risk ratio is 2.0, because 36 divided by 18 is 2", "The risk ratio is 0.5, because 120 divided by 240 is 0.5", "The risk ratio is 15, the shared percent of people who became ill", "The risk ratio is 1.0, which means the two groups have equal risk", "The risk ratio is 3.0, because 36 minus 18 is then divided by 6"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-risk-ratio-of-one-means-equal", "taskCategory": "interpretation"}$op$,
  $ky$The risk ratio is 1.0, which means the two groups have equal risk$ky$,
  $ex$Both risks are 18/120 and 36/240, each 15 percent. The risk ratio is 1.0. A risk ratio of 1.0 means equal risk. "The risk ratio is 2.0, because 36 divided by 18 is 2" is not the best choice because 36 divided by 18 compares ill counts and ignores the totals. Risk is ill divided by the group total. Both risks are 15 percent, so the ratio of the counts of ill people is not the risk ratio. "The risk ratio is 0.5, because 120 divided by 240 is 0.5" is not the best choice because 120 divided by 240 compares the group sizes, not the risks. Each risk is ill divided by its own total. "The risk ratio is 15, the shared percent of people who became ill" is not the best choice because Fifteen percent is each group's risk, 18/120 and 36/240. The risk ratio is the quotient of those risks, not the percent itself. "The risk ratio is 3.0, because 36 minus 18 is then divided by 6" is not the best choice because That arithmetic is not the definition. The risk ratio is one risk divided by the other risk, and here that quotient is 1.0.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'c930b1d8a8426593238e7437019371ad760dea8c44030a3c075e7465619e0c75', false, NOW(), NOW(), 3,
  'bio-risk-ratio-of-one-means-equal', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-risk-ratio-of-one-means-equal', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-394", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210395', 'usmle-step-2', 'biostatistics',
  $sc$A 33-year-old woman who works as a quality officer is seen in the ambulatory clinic for a scheduled physical before a site visit. She feels well. The file she is auditing gives 8 ill people out of 200 in the group of interest and 16 ill people out of 200 in the comparison group. She must interpret the risk ratio, with the group of interest in the numerator. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. Body mass index is 22 kg/m2. The audit packet is 9 pages long.$sc$,
  $qu$Which of the following is the correct interpretation?$qu$,
  $op${"options": ["The risk ratio is 2.0, so the group of interest has the higher risk", "The risk ratio is 0.5, and a ratio below 1 means the risks are equal", "The risk ratio is 8, because 8 people in the numerator became ill", "The risk ratio is 1.0, because both groups have the same denominator", "The risk ratio is 0.5, so the group of interest has a lower risk"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-ratio-below-one-means-lower", "taskCategory": "interpretation"}$op$,
  $ky$The risk ratio is 0.5, so the group of interest has a lower risk$ky$,
  $ex$The risk ratio is 4 percent divided by 8 percent, which is 0.5. A risk ratio below 1 means a lower risk in the numerator group. This group had about half the comparison risk. "The risk ratio is 2.0, so the group of interest has the higher risk" is not the best choice because The risk in the group of interest is 8/200, or 4 percent, and the comparison risk is 16/200, or 8 percent. The ratio is 0.5, not 2.0. A ratio of 2.0 would reverse the groups. "The risk ratio is 0.5, and a ratio below 1 means the risks are equal" is not the best choice because A ratio of 1.0 means equal risk. A ratio of 0.5 is below 1 and means a lower risk in the group of interest, not equal risk. "The risk ratio is 8, because 8 people in the numerator became ill" is not the best choice because Eight is the count of ill people in the numerator group. The risk ratio divides risks, not that raw count alone. "The risk ratio is 1.0, because both groups have the same denominator" is not the best choice because Equal denominators do not force a risk ratio of 1.0. The numerators differ, 8 and 16, so the risks are 4 percent and 8 percent.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', '204b35a4fee6a0488c9b609087a4c10d3003b1c7eb53d4ad925cb34bcc74b691', false, NOW(), NOW(), 3,
  'bio-ratio-below-one-means-lower', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-ratio-below-one-means-lower', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-395", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210396', 'usmle-step-2', 'biostatistics',
  $sc$A 47-year-old man who works as a laboratory supervisor is seen in the outbreak conference for a clearance visit on the morning of the briefing. He feels well. Investigators identified 80 people with the illness, then chose 240 controls. A trainee wants to report a risk ratio from that design. The supervisor must say which measure the design can support directly. Temperature is 36.6°C, pulse is 74/min, respirations are 15/min, and blood pressure is 126/78 mm Hg. Body mass index is 27 kg/m2. The briefing is planned for 30 minutes.$sc$,
  $qu$Which of the following is correct about this design?$qu$,
  $op${"options": ["An odds ratio can be estimated, but a risk ratio cannot be estimated directly", "A risk ratio can be estimated directly because 240 controls were enrolled", "Neither an odds ratio nor a risk ratio can be estimated from cases and controls", "The risk ratio is preferred, and an odds ratio cannot be estimated", "The risk ratio equals 3.0 because 240 controls divided by 80 cases is 3"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-case-control-no-direct-risk-ratio", "taskCategory": "interpretation"}$op$,
  $ky$An odds ratio can be estimated, but a risk ratio cannot be estimated directly$ky$,
  $ex$A case-control study can estimate an odds ratio. It cannot directly estimate a risk ratio, because the control-group size is chosen by the investigator. Here the investigators chose 240 controls. "A risk ratio can be estimated directly because 240 controls were enrolled" is not the best choice because Choosing 240 controls does not create a risk ratio. The investigator chose the control-group size, so a risk ratio cannot be estimated directly. "Neither an odds ratio nor a risk ratio can be estimated from cases and controls" is not the best choice because A case-control study can estimate an odds ratio. The limit is the risk ratio, not both measures. "The risk ratio is preferred, and an odds ratio cannot be estimated" is not the best choice because The direction is reversed. The design can estimate an odds ratio and cannot directly estimate a risk ratio. "The risk ratio equals 3.0 because 240 controls divided by 80 cases is 3" is not the best choice because 240 divided by 80 is the sampling ratio of controls to cases, not a risk ratio. Risk is ill divided by the total in an exposure group, which this sampling scheme does not provide directly.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', '019fb97d3a51f450625b114d2ba9ddcf0ca2ce37534af834191e0e6b1680c8f2', false, NOW(), NOW(), 3,
  'bio-case-control-no-direct-risk-ratio', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-case-control-no-direct-risk-ratio', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-396", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "A"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210397', 'usmle-step-2', 'biostatistics',
  $sc$A 40-year-old woman who works as a community health worker is seen in the screening clinic for her own annual examination before a test-counseling shift. She feels well. The sheet she will use describes the OC-Sensor FIT at the manufacturer threshold of 20 micrograms of hemoglobin per gram of stool. Pooled sensitivity for the target disease was 0.74. No prevalence is printed on the sheet. A learner asks what 0.74 means for people who have the disease. Temperature is 36.5°C, pulse is 70/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Body mass index is 25 kg/m2. She ate breakfast 3 hours before the visit.$sc$,
  $qu$Which of the following is the correct reading of a sensitivity of 0.74?$qu$,
  $op${"options": ["About 26 of 100 people who do not have the disease have a positive test", "About 26 of 100 people who have the disease have a negative test on one use", "About 6 of 100 people who have the disease have a negative result", "About 74 of 100 people who do not have the disease have a negative test", "The positive predictive value is 0.74, the same figure as the sensitivity at the present visit"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-fit-sensitivity-missed-cases", "taskCategory": "interpretation"}$op$,
  $ky$About 26 of 100 people who have the disease have a negative test on one use$ky$,
  $ex$Sensitivity of 0.74 means about 74 of 100 people who have the disease test positive on one application, so about 26 of 100 people who have the disease have a negative test. The threshold is 20 micrograms of hemoglobin per gram of stool. "About 26 of 100 people who do not have the disease have a positive test" is not the best choice because People without the disease who test positive are a specificity problem. Specificity for this test is 0.94, so about 6 of 100 people without the disease have a positive test, not 26. "About 6 of 100 people who have the disease have a negative result" is not the best choice because Six of 100 is the approximate share of people without the disease who have a positive test, from specificity of 0.94. It is not the miss rate among people who have the disease. "About 74 of 100 people who do not have the disease have a negative test" is not the best choice because About 74 of 100 people with the disease would be expected to test positive. Specificity, not sensitivity, describes negative tests among people who do not have the disease, and that specificity is 0.94. "The positive predictive value is 0.74, the same figure as the sensitivity at the present visit" is not the best choice because A positive predictive value is not provided, and prevalence is not provided, so it should not be invented from sensitivity. Sensitivity of 0.74 is not a predictive value.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'f90831937b97fff10d77ec152f46c53624dd9321e2d51df8d0d92c2898ad485f', false, NOW(), NOW(), 4,
  'bio-fit-sensitivity-missed-cases', 'biostats-epi', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-fit-sensitivity-missed-cases', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-397", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "B"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210398', 'usmle-step-2', 'biostatistics',
  $sc$A 44-year-old man who works as a nurse educator is seen in the simulation lab for a pre-employment visit before he teaches a lab. He feels well. The slide for the afternoon lab states that the OC-Sensor FIT, at 20 micrograms of hemoglobin per gram of stool, had a pooled specificity of 0.94. The slide does not give prevalence. He asks what 0.94 says about people who do not have the disease. Temperature is 36.6°C, pulse is 66/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Body mass index is 26 kg/m2. The lab roster lists 18 learners.$sc$,
  $qu$Which of the following is the correct reading of a specificity of 0.94?$qu$,
  $op${"options": ["About 26 of 100 people with the disease have a negative test", "About 94 of 100 people with the disease have a positive test", "About 6 of 100 people without the disease have a positive test", "About 94 of 100 people without the disease have a positive test", "The positive predictive value among people with a positive test is 0.94"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-fit-specificity-false-positives", "taskCategory": "interpretation"}$op$,
  $ky$About 6 of 100 people without the disease have a positive test$ky$,
  $ex$Specificity of 0.94 means about 94 of 100 people without the disease test negative, so about 6 of 100 people without the disease have a positive test. The threshold is 20 micrograms of hemoglobin per gram of stool. "About 26 of 100 people with the disease have a negative test" is not the best choice because About 26 of 100 people with the disease having a negative test is the complement of sensitivity 0.74, not the reading of specificity 0.94. "About 94 of 100 people with the disease have a positive test" is not the best choice because About 74 of 100 people with the disease, not 94, would be expected to test positive, because sensitivity is 0.74. Specificity does not describe people who have the disease. "About 94 of 100 people without the disease have a positive test" is not the best choice because A specificity of 0.94 means most people without the disease test negative. About 6 of 100, not 94 of 100, test positive. "The positive predictive value among people with a positive test is 0.94" is not the best choice because Specificity is not a positive predictive value. Prevalence was not given, so a predictive value should not be invented.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', '5050baba5fd681e2a416641d642573c417a976ed77fe9970bcfc96c9acffd21f', false, NOW(), NOW(), 4,
  'bio-fit-specificity-false-positives', 'biostats-epi', 'vignette',
  $rf$[{"label": "US Preventive Services Task Force. Screening for Colorectal Cancer.", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-fit-specificity-false-positives', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-398", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "nutrition": false, "keyLetter": "C"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210399', 'usmle-step-2', 'biostatistics',
  $sc$A 37-year-old woman who works as a program analyst is seen in the data studio for a wellness visit on a day she is also checking a table. She feels well. Her table shows 40 exposed people who became ill, 60 exposed people who stayed well, 10 unexposed people who became ill, and 90 unexposed people who stayed well. She asks for the odds ratio. Fifty of the 200 people in the table became ill. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Body mass index is 24 kg/m2. The table has 4 filled cells.$sc$,
  $qu$Which of the following is the odds ratio?$qu$,
  $op${"options": ["An odds ratio of 4.0, identical to the risk ratio from the same rows", "An odds ratio of 0.25, obtained by dividing 10 ill people by 40", "An odds ratio of 1.0, because 50 of 200 people became ill", "An odds ratio of 6.0, from the cross-product ad divided by bc", "An odds ratio of 2.0, from regrouping the exposed counts as 40 and 20"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-common-outcome-odds-versus-risk", "taskCategory": "interpretation"}$op$,
  $ky$An odds ratio of 6.0, from the cross-product ad divided by bc$ky$,
  $ex$The odds ratio is ad/bc = (40 times 90) divided by (60 times 10), which equals 6.0. The risk ratio is 4.0. Because 50 of 200 people became ill, the outcome is not uncommon, and 6.0 does not collapse to the risk ratio. "An odds ratio of 4.0, identical to the risk ratio from the same rows" is not the best choice because The risk ratio is (40/100) divided by (10/100), which is 4.0. The question asks for the odds ratio. Those two values approximate each other when the outcome is uncommon; here 50 of 200 people became ill, and 4.0 is not the odds ratio. "An odds ratio of 0.25, obtained by dividing 10 ill people by 40" is not the best choice because 10 divided by 40 uses only the ill counts. The odds ratio is ad/bc, not that quotient. "An odds ratio of 1.0, because 50 of 200 people became ill" is not the best choice because An odds ratio of 1.0 would mean the cross-products match in a way that shows no association of that form. They do not. Fifty of 200 being ill also shows the outcome is not rare, which is why the odds ratio need not sit on top of the risk ratio. "An odds ratio of 2.0, from regrouping the exposed counts as 40 and 20" is not the best choice because Regrouping 40 and 20 is not the table. The cells are 40, 60, 10, and 90.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', 'ccbd3e62c9445b5daad9e939761122c6dc8e670d2fd3848e391e5fdda4210f4a', false, NOW(), NOW(), 4,
  'bio-common-outcome-odds-versus-risk', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-common-outcome-odds-versus-risk', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-399", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "D"}$gm$::jsonb,
  true
);
INSERT INTO "QuestionBankItem" (
  id, "fieldId", "subjectId", scenario, question, options, "correctAnswer", explanation,
  tags, source, "contentHash", active, "createdAt", "updatedAt", difficulty,
  "topicCategory", "blueprintDomain", "itemType", "references", "stepLevel",
  "qaPassed", "taskCategory", "blueprintTopic", "generationVersion", "reviewStatus",
  "generationMeta", manual_correction
) VALUES (
  's2n202611210400', 'usmle-step-2', 'biostatistics',
  $sc$A 39-year-old man who works as a field epidemiologist is seen in the outbreak headquarters for a fitness-for-duty check before an evening briefing. He feels well. The investigation enrolled 100 people with the illness, 50 of whom had the exposure, and the team then chose 100 controls, 25 of whom had the exposure. A colleague wants the briefing to call (50/100) divided by (25/100) a risk ratio. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. Body mass index is 25 kg/m2. The briefing deck has 11 slides.$sc$,
  $qu$Which of the following is the correct statement?$qu$,
  $op${"options": ["The risk ratio is 2.0, and the chosen control count does not limit that estimate", "The odds ratio is 2.0, because 50/100 divided by 25/100 is an odds ratio", "The odds ratio is 1.0, because both the case group and the control group contain 100 people", "The risk ratio is 3.0, because the investigator was free to choose 100 controls", "The odds ratio is 3.0, and a risk ratio cannot be estimated directly from this design"], "kind": "vignette", "stepLevel": "step2", "blueprintSystem": "biostats-epi", "blueprintTopic": "bio-case-control-odds-ratio-three", "taskCategory": "interpretation"}$op$,
  $ky$The odds ratio is 3.0, and a risk ratio cannot be estimated directly from this design$ky$,
  $ex$The odds ratio is ad/bc. With 50 exposed cases, 25 exposed controls, 50 unexposed cases, and 75 unexposed controls, ad/bc equals 3.0. A risk ratio cannot be estimated directly, because the investigators chose how many controls to sample. "The risk ratio is 2.0, and the chosen control count does not limit that estimate" is not the best choice because (50/100) divided by (25/100) equals 2.0, but that is a ratio of exposure proportions in groups whose control size was chosen by the investigators. It is not a risk ratio. A case-control study cannot directly estimate a risk ratio. "The odds ratio is 2.0, because 50/100 divided by 25/100 is an odds ratio" is not the best choice because 2.0 is not ad/bc. Exposed cases are 50, unexposed cases are 50, exposed controls are 25, and unexposed controls are 75. The exposure-proportion ratio is not the odds ratio. "The odds ratio is 1.0, because both the case group and the control group contain 100 people" is not the best choice because Equal group sizes were chosen by the investigator. They do not make the odds ratio 1.0. "The risk ratio is 3.0, because the investigator was free to choose 100 controls" is not the best choice because The design cannot directly estimate a risk ratio. Choosing 100 controls is the reason a risk ratio is not directly available, not a reason to report 3.0 as a risk ratio. The value 3.0 is the odds ratio.$ex$,
  $tg$["usmle-s2-new-20261121", "hidden", "step2", "biostats-epi", "interpretation"]$tg$,
  's2-new-20261121-hidden', '641195a956fa54b11e8af1146c523e258018b202c0d67fdedd749aca0ce795a6', false, NOW(), NOW(), 5,
  'bio-case-control-odds-ratio-three', 'biostats-epi', 'vignette',
  $rf$[{"label": "CDC. Principles of Epidemiology in Public Health Practice. Lesson 3, Section 5: Measures of Association.", "url": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html"}]$rf$::jsonb,
  'step2', false,
  'interpretation', 'bio-case-control-odds-ratio-three', 'usmle-s2-new-20261121', 'pending',
  $gm${"batchId": "usmle-s2-new-20261121", "batchNumber": 4, "code": "S2N-400", "hidden": true, "physicianTask": "interpretation", "sourceUrl": "https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section5.html", "nutrition": false, "keyLetter": "E"}$gm$::jsonb,
  true
);
CREATE TABLE qbi_usmle_s2_new_20261121_b04_backup AS
SELECT * FROM "QuestionBankItem" WHERE id IN (
    's2n202611210301',
    's2n202611210302',
    's2n202611210303',
    's2n202611210304',
    's2n202611210305',
    's2n202611210306',
    's2n202611210307',
    's2n202611210308',
    's2n202611210309',
    's2n202611210310',
    's2n202611210311',
    's2n202611210312',
    's2n202611210313',
    's2n202611210314',
    's2n202611210315',
    's2n202611210316',
    's2n202611210317',
    's2n202611210318',
    's2n202611210319',
    's2n202611210320',
    's2n202611210321',
    's2n202611210322',
    's2n202611210323',
    's2n202611210324',
    's2n202611210325',
    's2n202611210326',
    's2n202611210327',
    's2n202611210328',
    's2n202611210329',
    's2n202611210330',
    's2n202611210331',
    's2n202611210332',
    's2n202611210333',
    's2n202611210334',
    's2n202611210335',
    's2n202611210336',
    's2n202611210337',
    's2n202611210338',
    's2n202611210339',
    's2n202611210340',
    's2n202611210341',
    's2n202611210342',
    's2n202611210343',
    's2n202611210344',
    's2n202611210345',
    's2n202611210346',
    's2n202611210347',
    's2n202611210348',
    's2n202611210349',
    's2n202611210350',
    's2n202611210351',
    's2n202611210352',
    's2n202611210353',
    's2n202611210354',
    's2n202611210355',
    's2n202611210356',
    's2n202611210357',
    's2n202611210358',
    's2n202611210359',
    's2n202611210360',
    's2n202611210361',
    's2n202611210362',
    's2n202611210363',
    's2n202611210364',
    's2n202611210365',
    's2n202611210366',
    's2n202611210367',
    's2n202611210368',
    's2n202611210369',
    's2n202611210370',
    's2n202611210371',
    's2n202611210372',
    's2n202611210373',
    's2n202611210374',
    's2n202611210375',
    's2n202611210376',
    's2n202611210377',
    's2n202611210378',
    's2n202611210379',
    's2n202611210380',
    's2n202611210381',
    's2n202611210382',
    's2n202611210383',
    's2n202611210384',
    's2n202611210385',
    's2n202611210386',
    's2n202611210387',
    's2n202611210388',
    's2n202611210389',
    's2n202611210390',
    's2n202611210391',
    's2n202611210392',
    's2n202611210393',
    's2n202611210394',
    's2n202611210395',
    's2n202611210396',
    's2n202611210397',
    's2n202611210398',
    's2n202611210399',
    's2n202611210400'
);
COMMIT;

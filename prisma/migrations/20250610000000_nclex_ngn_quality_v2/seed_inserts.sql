-- NCLEX-NGN quality v2 seeds (40 items)
-- Regenerate: node scripts/generate-ngn-quality-sql.mjs

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'physiological-adaptation',
  4,
  'physiological-adaptation',
  'nclex-physiological',
  'ngn_bowtie',
  'ED: 71M HFrEF. BP 90/58, HR 110, lungs crackles bilat, 2+ edema, dizzy standing.',
  'Bow-tie: Select ONE action and TWO findings to monitor.',
  '{"kind":"bow_tie","condition":"Decompensated heart failure with hypotension","actions":["Give cautious IV fluid bolus per protocol","Stop all diuretics now","Discharge home","High sodium diet"],"monitors":["Orthostatic vital signs","Urine output hourly","Fingerstick only","Hair loss"],"monitorPickCount":2,"cjmmStep":"Take action","options":["A","B","C","D"]}',
  'Give cautious IV fluid bolus per protocol,Orthostatic vital signs,Urine output hourly',
  '[NCJMM · Take action] Hypotension with volume overload may need cautious bolus while tracking perfusion and output.',
  '["heart-failure"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'e0a613b6d628e8f83b6989d02da866d3',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pharmacology-nursing',
  4,
  'pharmacology-nursing',
  'nclex-physiological',
  'ngn_bowtie',
  'Med-surg: Client on warfarin, INR 5.1, gums bleeding, started TMP-SMX yesterday.',
  'Bow-tie: ONE priority action and TWO monitoring priorities.',
  '{"kind":"bow_tie","condition":"Supratherapeutic INR / bleeding risk","actions":["Hold warfarin and notify provider","Give next warfarin dose","Leafy greens only","No follow-up"],"monitors":["Signs of bleeding","INR recheck","Weekly weights only","Vision changes only"],"monitorPickCount":2,"cjmmStep":"Prioritize hypotheses","options":["A","B","C","D"]}',
  'Hold warfarin and notify provider,Signs of bleeding,INR recheck',
  '[NCJMM · Prioritize hypotheses] Antibiotic interaction raised INR — hold anticoagulant and monitor bleeding.',
  '["anticoagulation"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '25cb895739ccd17480434abc9aa5087f',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'maternal-child',
  4,
  'maternal-child',
  'nclex-physiological',
  'ngn_bowtie',
  'L&D: 1 hr postpartum, fundus boggy above umbilicus, pad soaked q15min, HR 120, BP 90/55.',
  'Bow-tie: ONE action and TWO assessments.',
  '{"kind":"bow_tie","condition":"Postpartum hemorrhage risk","actions":["Fundal massage and uterotonic per protocol","Early ambulation now","Ice chips only","Remove IV"],"monitors":["Lochia amount","Vital signs","Fetal heart tones","Diet orders"],"monitorPickCount":2,"cjmmStep":"Take action","options":["A","B","C","D"]}',
  'Fundal massage and uterotonic per protocol,Lochia amount,Vital signs',
  '[NCJMM · Take action] Boggy fundus + tachycardia = hemorrhage risk — uterotonic and close monitoring.',
  '["OB"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'b4d38818e035d1d56247c04efe6a0e19',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pediatrics-nursing',
  4,
  'pediatrics-nursing',
  'nclex-physiological',
  'ngn_bowtie',
  'PICU: 4yo asthma exacerbation. RR 40, retractions, SpO₂ 89% on 2L NC, speaking short phrases.',
  'Bow-tie: ONE action and TWO monitors.',
  '{"kind":"bow_tie","condition":"Acute asthma exacerbation","actions":["Nebulized bronchodilator per protocol","Discharge home","Oral fluids only","Sedate without assessment"],"monitors":["Respiratory effort","SpO₂ trend","Daily weight","Bowel sounds"],"monitorPickCount":2,"cjmmStep":"Generate solutions","options":["A","B","C","D"]}',
  'Nebulized bronchodilator per protocol,Respiratory effort,SpO₂ trend',
  '[NCJMM · Generate solutions] Moderate-severe exacerbation needs bronchodilator and continuous respiratory monitoring.',
  '["peds","respiratory"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '3bdbbf44cca9de6b6e0039060605d730',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'psychosocial',
  4,
  'psychosocial',
  'nclex-psychosocial',
  'ngn_bowtie',
  'Psych unit: Client states intent to overdose tonight; has pills in room.',
  'Bow-tie: ONE immediate action and TWO safety monitors.',
  '{"kind":"bow_tie","condition":"Acute suicidal risk","actions":["1:1 observation and remove harmful items","Routine room checks q4h only","Unsupervised passes","Discharge planning first"],"monitors":["Suicidal ideation","Risk of self-harm","Appetite only","Sleep pattern only"],"monitorPickCount":2,"cjmmStep":"Take action","options":["A","B","C","D"]}',
  '1:1 observation and remove harmful items,Suicidal ideation,Risk of self-harm',
  '[NCJMM · Take action] Active plan with means requires immediate safety precautions.',
  '["safety"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '30d7fcdd6d2f04c688921c0220dc4015',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'management-of-care',
  3,
  'management-of-care',
  'nclex-safe-care',
  'vignette',
  'Charge nurse — 4 clients. Who do you see first?',
  'A) New STEMI with chest pain
B) Stable appendectomy POD1 teaching
C) Chronic pain requesting PRN acetaminophen
D) Discharge teaching on warfarin',
  '{"kind":"mcq","cjmmStep":"Prioritize hypotheses","options":["Client A — new STEMI with chest pain","Client B — stable appendectomy","Client C — chronic pain PRN","Client D — warfarin teaching"]}',
  'Client A — new STEMI with chest pain',
  '[NCJMM · Prioritize hypotheses] Unstable cardiac client outranks stable teaching and routine requests (ABC / acute vs chronic).',
  '["prioritization","delegation"]',
  NULL,
  'seed',
  'f5e3c2ec786de30914e05fa7d1950375',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'fundamentals',
  3,
  'fundamentals',
  'nclex-safe-care',
  'vignette',
  'RN has UAP, LPN, and float nurse. Which task is appropriate for UAP?',
  'Which assignment follows scope of practice?',
  '{"kind":"mcq","cjmmStep":"Generate solutions","options":["Ambulate stable post-op client with gait belt","New tracheostomy suctioning","IV push opioid","Discharge insulin teaching"]}',
  'Ambulate stable post-op client with gait belt',
  '[NCJMM · Generate solutions] UAP may assist with stable ambulation; airway, IV meds, and teaching stay with licensed staff.',
  '["delegation"]',
  NULL,
  'seed',
  '2ae06c4d8d4b31768e3c1c81aed7e7da',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pharmacology-nursing',
  3,
  'pharmacology-nursing',
  'nclex-physiological',
  'vignette',
  'Post-op PCA morphine: RR 8/min, pinpoint pupils, hard to arouse.',
  'Priority nursing action?',
  '{"kind":"mcq","cjmmStep":"Take action","options":["Stop PCA and assess airway; prepare naloxone per protocol","Increase PCA dose for pain","Ambulate now","Document only"]}',
  'Stop PCA and assess airway; prepare naloxone per protocol',
  '[NCJMM · Take action] Opioid toxicity threatens airway — stop drug and reverse per protocol.',
  '["pharm","safety"]',
  NULL,
  'seed',
  '07c0c5e63313031f6e44e972ebff4a86',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'med-surg',
  3,
  'med-surg',
  'nclex-physiological',
  'vignette',
  'Post-thyroidectomy 6 hr: tingling fingers, positive Chvostek, anxious.',
  'First action?',
  '{"kind":"mcq","cjmmStep":"Analyze cues","options":["Notify provider; anticipate calcium replacement per protocol","Encourage deep breathing only","NPO indefinitely","Discharge"]}',
  'Notify provider; anticipate calcium replacement per protocol',
  '[NCJMM · Analyze cues] Tetany signs after thyroid surgery suggest hypocalcemia — notify and treat.',
  '["endocrine"]',
  NULL,
  'seed',
  'a0b4f40da66a2e8bc710bbfae1127f5a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'health-promotion',
  3,
  'health-promotion',
  'nclex-health-promotion',
  'vignette',
  '52F smoker ready to quit in 1 week. Which response uses motivational interviewing?',
  'Best therapeutic communication?',
  '{"kind":"mcq","cjmmStep":"Generate solutions","options":["What would help you succeed with a quit date next week?","You must quit today","Smoking is your choice — not my problem","Here''s a pamphlet; goodbye"]}',
  'What would help you succeed with a quit date next week?',
  '[NCJMM · Generate solutions] Open-ended questions elicit change talk (MI principle).',
  '["psych"]',
  NULL,
  'seed',
  'baa0721e96ec2d5315800903ee9ee432',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'physiological-adaptation',
  4,
  'physiological-adaptation',
  'nclex-physiological',
  'ngn_highlight',
  'Triage note — MVC: GCS 14, open femur fracture, cool clammy skin, HR 126, BP 86/58.',
  'Highlight findings that indicate highest priority.',
  '{"kind":"highlight","text":"GCS 14, open femur fracture, cool clammy skin, HR 126, BP 86/58","highlights":["cool clammy skin","HR 126","BP 86/58"],"cjmmStep":"Recognize cues","options":["A","B","C","D"]}',
  'cool clammy skin,HR 126,BP 86/58',
  '[NCJMM · Recognize cues] Shock cues (hypotension, tachycardia, cool skin) outrank stable neuro finding.',
  '["triage","shock"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '08a4ae94d105e2b2ca706d0446e76837',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'safety-infection',
  4,
  'safety-infection',
  'nclex-safe-care',
  'ngn_highlight',
  'Isolation room: C. diff, watery stools ×3, abdominal cramping.',
  'Highlight cues requiring immediate infection-control action.',
  '{"kind":"highlight","text":"C. diff diagnosis, watery stools ×3, abdominal cramping, afebrile","highlights":["C. diff diagnosis","watery stools ×3"],"cjmmStep":"Recognize cues","options":["A","B","C","D"]}',
  'watery stools ×3,C. diff diagnosis',
  '[NCJMM · Recognize cues] C. diff with active diarrhea requires contact precautions and soap-and-water hand hygiene.',
  '["infection"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '93de7fc5d3c05178143a8848edbc1746',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pediatrics-nursing',
  5,
  'pediatrics-nursing',
  'nclex-physiological',
  'ngn_highlight',
  '6-week infant: temp 38.9°C, lethargic, poor feeding 24 hr.',
  'Highlight findings requiring urgent escalation.',
  '{"kind":"highlight","text":"6-week infant, temp 38.9°C, lethargic, poor feeding 24 hr, wet diapers decreased","highlights":["temp 38.9°C","lethargic","poor feeding 24 hr"],"cjmmStep":"Prioritize hypotheses","options":["A","B","C","D"]}',
  'temp 38.9°C,lethargic,poor feeding 24 hr',
  '[NCJMM · Prioritize hypotheses] Fever in infant <60 days is an emergency — escalate immediately.',
  '["peds","sepsis"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '71a194d302ead13cde617c3f426f1c2f',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'physiological-adaptation',
  4,
  'physiological-adaptation',
  'nclex-physiological',
  'ordered_response',
  'Sepsis: lactate 4.0, MAP 60, fever 39.2°C, UOP 20 mL/hr.',
  'Order interventions from first to last priority.',
  '{"kind":"ordered_response","options":["A","B","C","D"],"cjmmStep":"Prioritize hypotheses"}',
  'Notify provider / rapid response,Obtain blood cultures,IV fluid bolus,Antibiotics per protocol',
  '[NCJMM · Prioritize hypotheses] Sepsis bundle: recognize, cultures, fluids, antibiotics.',
  '["sepsis"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'ef8f1f217b5993885d79a03434177ada',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'basic-care-comfort',
  3,
  'basic-care-comfort',
  'nclex-physiological',
  'ordered_response',
  'Immobilized client, stage 2 sacral pressure injury, incontinent.',
  'Order prevention steps (first → last).',
  '{"kind":"ordered_response","options":["A","B","C","D"],"cjmmStep":"Generate solutions"}',
  'Reposition and skin checks,Manage moisture,Pressure-redistribution surface,Nutrition consult',
  '[NCJMM · Generate solutions] Reposition and moisture control come before surfaces and nutrition.',
  '["skin"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '763ba062a177ce5dbdf3953995970118',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'med-surg',
  4,
  'med-surg',
  'nclex-safe-care',
  'ngn_matrix',
  'POD2 abdominal surgery.',
  'For each finding, select the best column.',
  '{"kind":"matrix","rows":["SpO₂ 87% on RA","Serosanguineous dressing drainage","New chest pain","Absent bowel sounds"],"columns":["Intervene now","Expected","Needs more data"],"cjmmStep":"Analyze cues","options":["A","B","C","D"]}',
  'SpO₂ 87% on RA|||Intervene now,Serosanguineous dressing drainage|||Expected,New chest pain|||Intervene now,Absent bowel sounds|||Needs more data',
  '[NCJMM · Analyze cues] Hypoxia and chest pain need immediate action; drainage may be expected.',
  '["nclex-ngn","v2","clinical-judgment"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'c376da756c3ed3a6094463b341d7d78c',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'safety-infection',
  4,
  'safety-infection',
  'nclex-safe-care',
  'ngn_matrix',
  'C. diff isolation room.',
  'Match each action to the correct category.',
  '{"kind":"matrix","rows":["Soap and water hand wash","Alcohol gel only","Dedicated commode","Ignore signage"],"columns":["Required","Not sufficient","Incorrect"],"options":["A","B","C","D"]}',
  'Soap and water hand wash|||Required,Alcohol gel only|||Not sufficient,Dedicated commode|||Required,Ignore signage|||Incorrect',
  'C. diff spores need soap/water; dedicated equipment reduces spread.',
  '["C-diff"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '6999249a2415432a0d6f8565c2bf9786',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'med-surg',
  4,
  'med-surg',
  'nclex-physiological',
  'ngn_matrix',
  'New chest tube after pneumothorax.',
  'Expected vs needs intervention?',
  '{"kind":"matrix","rows":["Gentle bubbling in water seal","Sudden stop of bubbling + crepitus","Mild incision pain","Tidaling with breathing"],"columns":["Expected","Intervene now","More data"],"options":["A","B","C","D"]}',
  'Gentle bubbling in water seal|||Expected,Sudden stop of bubbling + crepitus|||Intervene now,Mild incision pain|||More data,Tidaling with breathing|||Expected',
  'Tidaling and gentle bubbling expected; sudden change suggests air leak/obstruction.',
  '["chest-tube"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'a33415348016b085e4ec93d2c5a0b793',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'management-of-care',
  4,
  'management-of-care',
  'nclex-safe-care',
  'ngn_matrix',
  'Charge nurse — shift assignments.',
  'Best assignment match for each client?',
  '{"kind":"matrix","rows":["New trach hour 1","Stable d/c teaching","Unstable chest pain","Paperwork only new admit"],"columns":["Experienced RN","UAP with RN check","Oriented float OK"],"options":["A","B","C","D"]}',
  'New trach hour 1|||Experienced RN,Stable d/c teaching|||UAP with RN check,Unstable chest pain|||Experienced RN,Paperwork only new admit|||Oriented float OK',
  'High-acuity and invasive skills need experienced RNs.',
  '["delegation"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '8c18b804a8982dc1678e3f946707b0d4',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pharmacology-nursing',
  4,
  'pharmacology-nursing',
  'nclex-physiological',
  'ngn_matrix',
  'Client starting gentamicin IV.',
  'Match monitoring to category.',
  '{"kind":"matrix","rows":["Peak/trough levels","Notify ototoxicity symptoms","Skip levels if feeling well","Assess renal function"],"columns":["Required","Incorrect"],"options":["A","B","C","D"]}',
  'Peak/trough levels|||Required,Notify ototoxicity symptoms|||Required,Skip levels if feeling well|||Incorrect,Assess renal function|||Required',
  'Aminoglycosides need levels, renal monitoring, and toxicity education.',
  '["pharm"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '8280980f33abe84e2e1bfa0c6156ab84',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'psychosocial',
  4,
  'psychosocial',
  'nclex-psychosocial',
  'ngn_matrix',
  'Voluntary psych admission — rights education.',
  'Match right to category.',
  '{"kind":"matrix","rows":["Refuse medications (if competent)","Leave AMA with process","Seclusion without order","Privacy during visits"],"columns":["Client right","Violation"],"options":["A","B","C","D"]}',
  'Refuse medications (if competent)|||Client right,Leave AMA with process|||Client right,Seclusion without order|||Violation,Privacy during visits|||Client right',
  'Competent clients retain rights; seclusion requires order and monitoring.',
  '["nclex-ngn","v2","clinical-judgment"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '9fb38757601b2d4e487333a4ad088e4b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'maternal-child',
  4,
  'maternal-child',
  'nclex-physiological',
  'ngn_matrix',
  'Labor: FHR tracing review.',
  'Classify each finding.',
  '{"kind":"matrix","rows":["Late decels with contractions","Moderate variability","Variable decels with cord compression pattern","Accelerations present"],"columns":["Reassuring","Intervene now"],"options":["A","B","C","D"]}',
  'Late decels with contractions|||Intervene now,Moderate variability|||Reassuring,Variable decels with cord compression pattern|||Intervene now,Accelerations present|||Reassuring',
  'Late decels and concerning variables need intervention; accelerations reassuring.',
  '["OB","FHR"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '3d5271decb16fac81f254e2be575ea97',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pediatrics-nursing',
  4,
  'pediatrics-nursing',
  'nclex-physiological',
  'ngn_matrix',
  'School-age child with T1DM — parent asks about sick-day rules.',
  'Match teaching point to category.',
  '{"kind":"matrix","rows":["Check glucose q3-4h","Hold all insulin if not eating","Small sips if alert","Ignore ketones"],"columns":["Required","Incorrect"],"options":["A","B","C","D"]}',
  'Check glucose q3-4h|||Required,Hold all insulin if not eating|||Incorrect,Small sips if alert|||Required,Ignore ketones|||Incorrect',
  'Sick-day rules: continue insulin adjustments per plan, monitor glucose/ketones, hydration.',
  '["peds","diabetes"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'cd2b77632948675d53ade36836cce62b',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'reduction-risk',
  3,
  'reduction-risk',
  'nclex-safe-care',
  'ngn_matrix',
  'Older adult fall risk assessment.',
  'Match intervention to category.',
  '{"kind":"matrix","rows":["Bed alarm","Slippery socks only","Routine toileting schedule","Restraints for convenience"],"columns":["Fall precaution","Increases risk","Violation"],"options":["A","B","C","D"]}',
  'Bed alarm|||Fall precaution,Slippery socks only|||Increases risk,Routine toileting schedule|||Fall precaution,Restraints for convenience|||Violation',
  'Fall bundle: alarms, toileting, safe footwear — not convenience restraints.',
  '["nclex-ngn","v2","clinical-judgment"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '9162e1232ef7898a99c5ae03d1317087',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'physiological-adaptation',
  4,
  'physiological-adaptation',
  'nclex-physiological',
  'ngn_matrix',
  'DKA resolving: glucose 240, K+ 3.2, pH improving.',
  'Match finding to priority.',
  '{"kind":"matrix","rows":["Potassium 3.2","Continue IV fluids","Stop all insulin","Discharge now"],"columns":["Replace per protocol","Continue","Incorrect"],"options":["A","B","C","D"]}',
  'Potassium 3.2|||Replace per protocol,Continue IV fluids|||Continue,Stop all insulin|||Incorrect,Discharge now|||Incorrect',
  'During DKA treatment, hypokalemia as insulin drives K+ intracellularly is a key risk.',
  '["DKA"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'f4261a40be1d922c1de19cd2c024859e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'management-of-care',
  3,
  'management-of-care',
  'nclex-physiological',
  'case_study',
  '0900 — 54F DM2 admitted BG 418, alert, dry mucous membranes.',
  'Priority action?',
  '{"kind":"case_study","caseStep":1,"cjmmStep":"Take action","options":["Administer insulin per protocol and assess fluids","Oral fluids only","Trendelenburg","Hold insulin"]}',
  'Administer insulin per protocol and assess fluids',
  '[NCJMM · Take action] Symptomatic hyperglycemia needs insulin and fluid assessment.',
  '["case","diabetes"]',
  NULL,
  'seed',
  '657d173edcb5446e2bb85d4e3757a488',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'med-surg',
  3,
  'med-surg',
  'nclex-physiological',
  'case_study',
  '1100 — Same client after insulin. BG 210, still dry, BP 100/62.',
  'Next priority?',
  '{"kind":"case_study","caseStep":2,"cjmmStep":"Evaluate outcomes","options":["Continue IV fluids and monitor electrolytes","Discharge","NPO forever","Stop all meds"]}',
  'Continue IV fluids and monitor electrolytes',
  '[NCJMM · Evaluate outcomes] Resolving glucose but dehydration persists — fluids and electrolytes.',
  '["case","unfolding"]',
  NULL,
  'seed',
  'c77cde90a7cf102d9e09b762b6c8cda6',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pediatrics-nursing',
  3,
  'pediatrics-nursing',
  'nclex-physiological',
  'vignette',
  'Peds unit: 18mo dehydration, cap refill 4 sec, tears absent, lethargic.',
  'Priority?',
  '{"kind":"mcq","cjmmStep":"Take action","options":["Establish IV access and notify provider","Oral rehydration only now","Discharge","Wait 24 hr"]}',
  'Establish IV access and notify provider',
  '[NCJMM · Take action] Moderate-dehydration signs in toddler need urgent IV/ provider.',
  '["case","peds"]',
  NULL,
  'seed',
  'a608289d6960870b7e75dedfe2f39132',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'maternal-child',
  3,
  'maternal-child',
  'nclex-physiological',
  'vignette',
  'Labor room: G1P0, cervix 8 cm, FHR 90s between contractions.',
  'Immediate action?',
  '{"kind":"mcq","cjmmStep":"Take action","options":["Reposition mother, stop oxytocin if infusing, notify provider","Prep for discharge","Ambulate","Ignore tracing"]}',
  'Reposition mother, stop oxytocin if infusing, notify provider',
  '[NCJMM · Take action] FHR 90s = bradycardia category — intrauterine resuscitation measures.',
  '["case","OB"]',
  NULL,
  'seed',
  '57180fd3522ef005247310299a4bce2e',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'psychosocial',
  3,
  'psychosocial',
  'nclex-psychosocial',
  'vignette',
  'Outpatient: client reports increased auditory hallucinations, no plan yet.',
  'Best action?',
  '{"kind":"mcq","cjmmStep":"Analyze cues","options":["Safety assessment and provider contact within session","Ignore unless suicidal","Call police immediately","Schedule next month"]}',
  'Safety assessment and provider contact within session',
  '[NCJMM · Analyze cues] Escalating psychosis needs reassessment and safety screening.',
  '["case"]',
  NULL,
  'seed',
  'c4b3ef6e3936e6b77599a545af8f1016',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pharmacology-nursing',
  3,
  'pharmacology-nursing',
  'nclex-physiological',
  'vignette',
  'Home health: client on digoxin, nausea, vision yellow-green, HR 52.',
  'Action?',
  '{"kind":"mcq","cjmmStep":"Recognize cues","options":["Hold digoxin and notify provider","Take digoxin early","Double dose","No action"]}',
  'Hold digoxin and notify provider',
  '[NCJMM · Recognize cues] Digoxin toxicity signs with bradycardia — hold and notify.',
  '["case","pharm"]',
  NULL,
  'seed',
  'f0431aa961891610c7b39cdc35501130',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'fundamentals',
  3,
  'fundamentals',
  'nclex-physiological',
  'vignette',
  'Long-term care: resident found on floor, alert, new hip pain, leg shortened.',
  'First action?',
  '{"kind":"mcq","cjmmStep":"Recognize cues","options":["Assess neurovascular status and notify provider","Ambulate to chair","Heat pack","Ignore"]}',
  'Assess neurovascular status and notify provider',
  '[NCJMM · Recognize cues] Fall with hip injury signs — assess NV and escalate.',
  '["case"]',
  NULL,
  'seed',
  '652b121f4f6aec786bc3be832a362af1',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'med-surg',
  3,
  'med-surg',
  'nclex-physiological',
  'vignette',
  'ICU: ventilated client, peak pressures rising, SpO₂ dropping, absent breath sounds left.',
  'Priority?',
  '{"kind":"mcq","cjmmStep":"Take action","options":["Assess for tension pneumothorax; prepare for decompression per protocol","Increase sedation only","Extubate","Call family"]}',
  'Assess for tension pneumothorax; prepare for decompression per protocol',
  '[NCJMM · Take action] Unilateral absent sounds + pressure spike suggests tension PTX.',
  '["case","respiratory"]',
  NULL,
  'seed',
  'd029294dc80073c94eeaab345cc749c0',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'management-of-care',
  3,
  'management-of-care',
  'nclex-safe-care',
  'vignette',
  'Clinic triage call: caller reports chest pain radiating to jaw, diaphoretic.',
  'Instruction?',
  '{"kind":"mcq","cjmmStep":"Take action","options":["Call 911 now; do not drive self","Take antacid and wait","Schedule appointment next week","Ignore"]}',
  'Call 911 now; do not drive self',
  '[NCJMM · Take action] Classic ACS symptoms need emergency services.',
  '["case"]',
  NULL,
  'seed',
  'd2c913262e4af0315d81f7ca6c395a8a',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'health-promotion',
  3,
  'health-promotion',
  'nclex-health-promotion',
  'vignette',
  'Primary care: 45M BMI 32, BP 142/88, fasting glucose 118.',
  'Priority teaching focus?',
  '{"kind":"mcq","cjmmStep":"Generate solutions","options":["Lifestyle modification for cardiovascular and diabetes prevention","Ignore until symptomatic","Only pills","No follow-up"]}',
  'Lifestyle modification for cardiovascular and diabetes prevention',
  '[NCJMM · Generate solutions] Prediabetes + elevated BP — prevention teaching is priority.',
  '["case"]',
  NULL,
  'seed',
  'afd1bd57882347c579cad26fd434d6c8',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'pharmacology-nursing',
  4,
  'pharmacology-nursing',
  'nclex-physiological',
  'select_all',
  'Client on heparin infusion, nosebleed, dark stools, Hgb drop.',
  'Select all actions the nurse should take. (Select all that apply.)',
  '{"kind":"select_all","options":["A","B","C","D"],"partialCredit":true,"cjmmStep":"Take action"}',
  'Stop infusion and notify provider,Assess vital signs,Prepare protamine availability per protocol,Increase infusion rate',
  '[NCJMM · Take action] Bleeding on anticoagulant: stop drug, monitor, reversal per protocol.',
  '["SATA","anticoagulation"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'e72ebfeb72b65466ecccb0867f351196',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'safety-infection',
  4,
  'safety-infection',
  'nclex-safe-care',
  'select_all',
  'Needlestick from used IV needle during busy shift.',
  'Select all immediate steps. (Select all that apply.)',
  '{"kind":"select_all","options":["A","B","C","D"],"partialCredit":true}',
  'Wash area per protocol,Report to occupational health,Draw source patient labs per policy,Ignore if skin intact',
  'Needlestick protocol: wash, report, source testing per policy.',
  '["nclex-ngn","v2","clinical-judgment"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'a053b1fc59bcc4730f6bcac304cd9324',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'management-of-care',
  4,
  'management-of-care',
  'nclex-physiological',
  'select_all',
  'Discharge teaching for new heart failure client.',
  'Select all essential teaching points. (Select all that apply.)',
  '{"kind":"select_all","options":["A","B","C","D"],"partialCredit":true}',
  'Daily weights,Low sodium diet,When to call provider,Sskip meds if feeling well',
  'HF teaching: weights, diet, symptoms — never skip meds without provider.',
  '["teaching"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  'bd8e39ef3e7135deea5f49cec526a9f4',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'reduction-risk',
  4,
  'reduction-risk',
  'nclex-safe-care',
  'select_all',
  'Fire alarm on unit — smoke smell near med room.',
  'Select all first responses. (Select all that apply.)',
  '{"kind":"select_all","options":["A","B","C","D"],"partialCredit":true}',
  'Pull alarm if not sounding,Close doors,Evacuate per RACE,Use elevator quickly',
  'RACE: rescue, alarm, contain, extinguish/evacuate — no elevators.',
  '["nclex-ngn","v2","clinical-judgment"]',
  '[{"label":"NCSBN Clinical Judgment Model","citation":"Recognize → Analyze → Prioritize → Generate → Act → Evaluate"}]'::jsonb,
  'seed',
  '01e982d6c29bb9cc6e0476d121af5025',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

INSERT INTO "QuestionBankItem" (
  "id", "fieldId", "subjectId", "difficulty", "topicCategory", "blueprintDomain",
  "itemType", "scenario", "question", "options", "correctAnswer", "explanation",
  "tags", "references", "source", "contentHash", "active"
) VALUES (
  gen_random_uuid()::text,
  'nursing',
  'fundamentals',
  3,
  'fundamentals',
  'nclex-physiological',
  'vignette',
  'Chart excerpt: K+ 2.9, digoxin ordered, client on furosemide.',
  'Cloze: The nurse should ___ before giving digoxin.',
  '{"kind":"mcq","cjmmStep":"Analyze cues","realismNote":"Mimics EHR lab + order review workflow.","options":["Verify potassium level and hold digoxin if K+ low per protocol","Give digoxin anyway","Double diuretic","No assessment"]}',
  'Verify potassium level and hold digoxin if K+ low per protocol',
  '[NCJMM · Analyze cues] Hypokalemia increases digoxin toxicity — verify and hold per protocol. 

Why realistic: Mimics EHR lab + order review workflow.',
  '["cloze","drop-down"]',
  NULL,
  'seed',
  '64771b47a9f292af9ee75ee19780f629',
  true
) ON CONFLICT ("contentHash") DO UPDATE SET
  "itemType" = EXCLUDED."itemType",
  "scenario" = EXCLUDED."scenario",
  "question" = EXCLUDED."question",
  "options" = EXCLUDED."options",
  "correctAnswer" = EXCLUDED."correctAnswer",
  "explanation" = EXCLUDED."explanation",
  "active" = true;

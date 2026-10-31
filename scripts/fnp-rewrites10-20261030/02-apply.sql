-- Approved FNP content rewrite, 10 rows (Ryan, 7:48 PM CT, 2026-10-30).
-- Project lively-silence-56893462, database anyexameasy.
-- Column map (how aanp-fnp rows store this content):
--   stem vignette -> scenario; lead-in sentence -> question
--   options (A-D order) -> options JSON array, other envelope keys kept
--   key letter -> correctAnswer = that option's text (not the letter)
--   explanation -> explanation
--   citations -> references jsonb [{label, url, citation}]; label is what students see
--   difficulty medium -> 3, medium-hard -> 4 (smallint; UI: 1-2 Easy, 3 Medium, 4-5 Hard)
-- Stale distractorRationale and clinicalReasoning are removed so the old
-- rationales are not shown beside the new options.
-- Item cmtwfmjs9008y1y1ozasi8gai was select_all; the rewrite is one best answer,
-- so itemType/kind/questionFormat become vignette/mcq or the single key is ineligible.
-- active and qaPassed are not changed. manual_correction is set so a later
-- seed sync that still matches the original contentHash cannot overwrite the text.
-- contentHash is left unchanged so the old hash is not freed for a duplicate insert.
-- Does not DROP anything.

DO $$
DECLARE
  n integer;
  fnp integer;
BEGIN
  SELECT COUNT(*)::int,
         COUNT(*) FILTER (WHERE "fieldId" = 'aanp-fnp')::int
    INTO n, fnp
  FROM "QuestionBankItem"
  WHERE id IN (
    'cmr839bsm008b1ykzrdj3yiih',
    'cmqgumyzl00081y0v4d75sy6p',
    'cmr83geig00281yq5v7fydsc4',
    'cmqgv0tpo000t1ycfxf4k8dya',
    'cmr82v9yq00as1yfvisc0ss9h',
    'cmqgu6htm00241y4rgrcxtunv',
    'cmr83jzri00481yq5cq364vgg',
    'cmr84xt5y008m1y5topmfkoq3',
    'cmtwfmjs9008y1y1ozasi8gai',
    'cmtweyvdh001r1y2nm7xpqfky'
  );
  IF n <> 10 OR fnp <> 10 THEN
    RAISE EXCEPTION 'expected exactly 10 FNP rows, found % (% FNP)', n, fnp;
  END IF;
END $$;

UPDATE "QuestionBankItem"
SET
  scenario = $i1s$A 45-year-old woman presents for a routine visit. Her father was diagnosed with colorectal cancer at age 54. She has no GI symptoms, and her only colonoscopy, 5 years ago at age 40, was normal.$i1s$,
  question = $i1q$Which recommendation for colorectal cancer screening is most appropriate?$i1q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i1o$["Repeat colonoscopy at age 50, then at 5-year intervals", "Repeat colonoscopy now and continue at 5-year intervals", "Repeat colonoscopy now, then at average-risk 10-year intervals", "Annual FIT starting now, reserving colonoscopy for a positive test"]$i1o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i1a$Repeat colonoscopy now and continue at 5-year intervals$i1a$,
  explanation = $i1e$One first-degree relative diagnosed before age 60 places her in the higher-risk group: colonoscopy beginning at age 40 (or 10 years before the relative's diagnosis, whichever is earlier), repeated every 5 years. Her baseline was 5 years ago, so the next examination is due now, not at 50. Average-risk 10-year intervals apply only when the relative was diagnosed at 60 or older. Annual FIT is not the preferred test at this risk level.$i1e$,
  "references" = $i1r$[{"label": "Rex DK et al. Colorectal Cancer Screening: Recommendations for Physicians and Patients From the U.S. Multi-Society Task Force on Colorectal Cancer. Am J Gastroenterol 2017;112:1016", "url": "https://www.gastrojournal.org/article/S0016-5085(17)35599-3/fulltext", "citation": "Rex DK et al. Colorectal Cancer Screening: Recommendations for Physicians and Patients From the U.S. Multi-Society Task Force on Colorectal Cancer. Am J Gastroenterol 2017;112:1016"}, {"label": "Shaukat A et al. ACG Clinical Guidelines: Colorectal Cancer Screening 2021. Am J Gastroenterol 2021;116:458-479", "url": "https://doi.org/10.14309/ajg.0000000000001122", "citation": "Shaukat A et al. ACG Clinical Guidelines: Colorectal Cancer Screening 2021. Am J Gastroenterol 2021;116:458-479"}]$i1r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmr839bsm008b1ykzrdj3yiih'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i2s$A 55-year-old woman presents to the primary care clinic with a persistent cough and shortness of breath that has worsened over the past month. She is a former smoker with a 20-pack-year history and has been treated for left lower lobe pneumonia twice in the past year. Physical examination reveals decreased breath sounds at the left lung base, a respiratory rate of 22 breaths/min, and an oxygen saturation of 92% on room air.$i2s$,
  question = $i2q$Which of the following is the most appropriate next step in management?$i2q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i2o$["Sputum culture and cytology, then reassess in 2 weeks", "Levofloxacin for 7 days, then a chest radiograph in 6 weeks", "Pulmonology referral with evaluation in the next 4 weeks", "Chest radiograph within a few days, then review the result"]$i2o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i2a$Chest radiograph within a few days, then review the result$i2a$,
  explanation = $i2e$Recurrent pneumonia in the same lobe in a former smoker, with focal decreased breath sounds and resting hypoxemia, raises the possibility of an obstructing lesion. A chest radiograph comes first: NICE NG12 recommends an urgent direct-access chest X-ray for people aged 40 or older who have ever smoked and have unexplained cough or shortness of breath (1.1.2), and suggests considering one for persistent or recurrent chest infection (1.1.3); further imaging or bronchoscopy follows from its result. A 6-week follow-up film (BTS 2009; NICE NG250 1.12.2) is a check after a treated, already-imaged pneumonia in a smoker or a person over 50; it does not replace imaging a new, worsening presentation with hypoxemia, so treating a third time and waiting 6 weeks delays the diagnosis. A pulmonology referral with a 4-week wait defers the first-line test that primary care can order. Sputum culture and cytology are low-yield for a focal lesion and delay imaging.$i2e$,
  "references" = $i2r$[{"label": "NICE NG12 Suspected cancer: recognition and referral (updated 15 April 2026), 1.1.2 (offer urgent direct-access chest X-ray, age 40+, ever smoked, 1 or more unexplained symptoms incl. cough or shortness of breath) and 1.1.3 (consider urgent chest X-ray for persistent or recurrent chest infection); full text opened 2026-10-30", "url": "https://www.nice.org.uk/guidance/ng12/chapter/Recommendations-organised-by-site-of-cancer", "citation": "NICE NG12 Suspected cancer: recognition and referral (updated 15 April 2026), 1.1.2 (offer urgent direct-access chest X-ray, age 40+, ever smoked, 1 or more unexplained symptoms incl. cough or shortness of breath) and 1.1.3 (consider urgent chest X-ray for persistent or recurrent chest infection); full text opened 2026-10-30"}, {"label": "Lim WS et al. BTS Guidelines for the management of community-acquired pneumonia in adults: 2009 update. Thorax 2009;64(Suppl III):iii1-55, recommendation 4 (chest radiograph at about 6 weeks for persistent symptoms/signs or higher malignancy risk, especially smokers and over 50); full-text PDF opened 2026-10-30", "url": "https://www.brit-thoracic.org.uk/document-library/guidelines/pneumonia-adults/bts-guidelines-for-the-management-of-community-acquired-pneumonia-in-adults-2009-update/", "citation": "Lim WS et al. BTS Guidelines for the management of community-acquired pneumonia in adults: 2009 update. Thorax 2009;64(Suppl III):iii1-55, recommendation 4 (chest radiograph at about 6 weeks for persistent symptoms/signs or higher malignancy risk, especially smokers and over 50); full-text PDF opened 2026-10-30"}, {"label": "US Preventive Services Task Force. Screening for Lung Cancer: Recommendation Statement. JAMA 2021;325(10):962-970 (Grade B for annual low-dose CT in ASYMPTOMATIC adults 50-80 years with a 20 pack-year history who smoke or quit within 15 years)", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/lung-cancer-screening", "citation": "US Preventive Services Task Force. Screening for Lung Cancer: Recommendation Statement. JAMA 2021;325(10):962-970 (Grade B for annual low-dose CT in ASYMPTOMATIC adults 50-80 years with a 20 pack-year history who smoke or quit within 15 years)"}, {"label": "NICE NG250 Pneumonia: diagnosis and management (2025; replaces CG191), 1.12.1-1.12.2 (do not routinely offer follow-up chest X-ray after inpatient pneumonia; consider one at 6 weeks for smokers, over 50, or persisting/deteriorating symptoms); full text opened 2026-10-30. ATS/IDSA 2019 (Metlay, AJRCCM 2019;200:e45) Q16: not routine if symptoms resolved in 5-7 days; full text opened via PMC6812437.", "url": "https://www.nice.org.uk/guidance/ng250/chapter/Recommendations", "citation": "NICE NG250 Pneumonia: diagnosis and management (2025; replaces CG191), 1.12.1-1.12.2 (do not routinely offer follow-up chest X-ray after inpatient pneumonia; consider one at 6 weeks for smokers, over 50, or persisting/deteriorating symptoms); full text opened 2026-10-30. ATS/IDSA 2019 (Metlay, AJRCCM 2019;200:e45) Q16: not routine if symptoms resolved in 5-7 days; full text opened via PMC6812437."}]$i2r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmqgumyzl00081y0v4d75sy6p'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i3s$A 15-year-old male presents to the clinic for a routine skin check. He has a family history of melanoma, and during the examination, a suspicious mole on his back is noted, measuring 6 mm in diameter with irregular borders and multiple colors. Regional lymph nodes are not palpable. The patient has no significant past medical history and is not taking any medications.$i3s$,
  question = $i3q$What is the most appropriate next step in management?$i3q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i3o$["Wide excision with 1-cm margins and sentinel biopsy", "Superficial shave biopsy removing the entire lesion", "Complete excisional biopsy with 1- to 3-mm margins", "Punch biopsy of the darkest, most irregular area"]$i3o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i3a$Complete excisional biopsy with 1- to 3-mm margins$i3a$,
  explanation = $i3e$For a lesion suspicious for melanoma, the preferred diagnostic biopsy is a complete excisional biopsy with narrow 1- to 3-mm clinically negative margins, deep enough not to transect the base (elliptical or punch excision, or deep saucerization). Definitive wide excision margins and any sentinel node biopsy are planned after histology gives the Breslow thickness. A superficial shave is reserved for lesions when invasive melanoma is not suspected because it can transect the base and understage. Partial sampling is for facial, acral or very large lesions, which this 6-mm back lesion is not.$i3e$,
  "references" = $i3r$[{"label": "Swetter SM et al. Guidelines of care for the management of primary cutaneous melanoma. J Am Acad Dermatol 2019;80:208-250", "url": "https://www.jaad.org/article/S0190-9622(18)32588-X/fulltext", "citation": "Swetter SM et al. Guidelines of care for the management of primary cutaneous melanoma. J Am Acad Dermatol 2019;80:208-250"}]$i3r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmr83geig00281yq5v7fydsc4'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i4s$A 24-year-old man with type 1 diabetes who uses an insulin pump presents to the primary care clinic for a same-day visit. Over the past 12 hours he has had nausea, abdominal pain, and three episodes of vomiting, and he cannot keep fluids down. He changed his pump infusion set 2 days ago. He is fatigued. Temperature is 37.9 °C, blood pressure is 106/68 mm Hg, heart rate is 114/min, and respiratory rate is 26/min. Point-of-care testing shows a capillary glucose of 232 mg/dL and a capillary beta-hydroxybutyrate of 4.1 mmol/L.$i4s$,
  question = $i4q$What is the most appropriate next step in management?$i4q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i4o$["Send him to the emergency department for IV fluid rehydration and insulin therapy", "Give a rapid-acting insulin correction by injection and recheck ketones in 2 hours", "Give ondansetron and 1 L of IV saline in clinic, then reassess in 2 hours", "Obtain a venous blood gas and base ED transfer on a pH below 7.3"]$i4o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i4a$Send him to the emergency department for IV fluid rehydration and insulin therapy$i4a$,
  explanation = $i4e$A beta-hydroxybutyrate of 4.1 mmol/L (3.0 or higher meets the ketone criterion) with persistent vomiting, tachypnea and tachycardia in a patient with type 1 diabetes is diabetic ketoacidosis until proven otherwise; a glucose of 232 mg/dL does not exclude it (glucose of 200 mg/dL or more, or known diabetes, satisfies the hyperglycemia criterion). DKA is treated with isotonic fluids and insulin (intravenous infusion, or subcutaneous rapid-acting insulin in selected mild to moderate cases) with frequent electrolyte monitoring, in an emergency department or step-down unit, which a clinic cannot provide. Injected correction insulin and oral fluids are sick-day measures for lower ketone levels and cannot work in a patient who is vomiting. Starting fluids in clinic and re-evaluating delays insulin and monitoring. Waiting for a blood gas result before deciding delays transfer in a patient who already has vomiting, tachypnea and ketonemia.$i4e$,
  "references" = $i4r$[{"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care 2024;47(8):1257-1275", "url": "https://diabetesjournals.org/care/article/47/8/1257/156808/Hyperglycemic-Crises-in-Adults-With-Diabetes-A", "citation": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care 2024;47(8):1257-1275"}, {"label": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care 2024;47(8):1257-1275 (diagnostic criteria; capillary/venous beta-hydroxybutyrate recommended; read in PMC full text via search extract 2026-10-30)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11272983/", "citation": "Umpierrez GE et al. Hyperglycemic Crises in Adults With Diabetes: A Consensus Report. Diabetes Care 2024;47(8):1257-1275 (diagnostic criteria; capillary/venous beta-hydroxybutyrate recommended; read in PMC full text via search extract 2026-10-30)"}]$i4r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmqgv0tpo000t1ycfxf4k8dya'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i5s$A 24-day-old boy, born at 39 weeks' gestation after an uncomplicated delivery, is brought to the clinic because his parents say his yellow skin color has not gone away. He is exclusively breastfed, nurses 8 to 10 times daily, has several wet diapers a day, and has gained weight steadily since regaining his birth weight. Stools are yellow and seedy and urine is pale. He did not need phototherapy in the nursery. He is alert and well appearing and jaundiced to the chest, with a soft abdomen, no hepatosplenomegaly, and no dysmorphic features.$i5s$,
  question = $i5q$What is the most appropriate next step in management?$i5q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i5o$["Continue exclusive breastfeeding and recheck his color in 1 week", "Check a transcutaneous bilirubin and give phototherapy if elevated", "Order serum total and direct bilirubin levels during this visit", "Order a fasting hepatobiliary ultrasound before blood testing"]$i5o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i5a$Order serum total and direct bilirubin levels during this visit$i5a$,
  explanation = $i5e$Jaundice that persists beyond 2 weeks must be evaluated for cholestasis, and a well-appearing breastfed infant with a normal examination and normal stool and urine color may be watched only until 3 weeks of age; at 24 days he has passed that point. The initial step is a serum total and direct (conjugated) bilirubin, because visual assessment and transcutaneous or total bilirubin measurements cannot identify conjugated hyperbilirubinemia, and infants with biliary atresia usually look well and grow normally. A direct bilirubin above 1.0 mg/dL is abnormal and warrants referral to pediatric gastroenterology. Attributing the jaundice to breast milk is a diagnosis of exclusion, phototherapy does not treat cholestasis, and imaging is part of the evaluation after cholestasis is confirmed.$i5e$,
  "references" = $i5r$[{"label": "Fawaz R et al. Guideline for the Evaluation of Cholestatic Jaundice in Infants: Joint Recommendations of NASPGHAN and ESPGHAN. J Pediatr Gastroenterol Nutr 2017;64(1):154-168 (full text read: jaundice after 2 weeks, breastfed well infants may be followed to 3 weeks then fractionated bilirubin; direct bilirubin above 1.0 mg/dL abnormal)", "url": "https://doi.org/10.1097/MPG.0000000000001334", "citation": "Fawaz R et al. Guideline for the Evaluation of Cholestatic Jaundice in Infants: Joint Recommendations of NASPGHAN and ESPGHAN. J Pediatr Gastroenterol Nutr 2017;64(1):154-168 (full text read: jaundice after 2 weeks, breastfed well infants may be followed to 3 weeks then fractionated bilirubin; direct bilirubin above 1.0 mg/dL abnormal)"}]$i5r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmr82v9yq00as1yfvisc0ss9h'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i6s$A 16-year-old female presents to the primary care clinic for a follow-up visit 3 months after starting a combined estrogen-progestin oral contraceptive. She reports mood swings and increased anxiety that began within the first month of use. She has been sexually active with one male partner for 6 months, and condoms are used inconsistently. A urine pregnancy test today is negative. When asked directly, she denies suicidal thoughts and self-harm and says she feels safe at home. Her past medical history is unremarkable, and she takes no other medications. Blood pressure is 110/70 mm Hg and heart rate is 78/min.$i6s$,
  question = $i6q$What is the most appropriate next step in management?$i6q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i6o$["Screen with the PHQ-A and GAD-7, then offer supportive counseling", "Switch to norethindrone and reassess her mood in 3 months", "Start sertraline 25 mg now and arrange a follow-up visit in 2 weeks", "Order a TSH and a CBC and reassess her mood when the results return"]$i6o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i6a$Screen with the PHQ-A and GAD-7, then offer supportive counseling$i6a$,
  explanation = $i6e$New mood and anxiety symptoms in an adolescent need a structured assessment first: a validated screening tool (PHQ-A, GAD-7) followed by clinical assessment and safety review, with supportive counseling and close follow-up. Depression is US MEC category 1 for both combined and progestin-only methods, so changing the method has no evidence-based basis for treating mood symptoms. Starting an antidepressant before assessment and diagnosis skips the first step. Laboratory screening for medical mimics is not the first step when no physical findings suggest a thyroid or hematologic cause. Pregnancy is excluded and suicidal ideation was asked about directly.$i6e$,
  "references" = $i6r$[{"label": "Nguyen AT et al. U.S. Medical Eligibility Criteria for Contraceptive Use, 2024. MMWR Recomm Rep 2024;73(4)", "url": "https://www.cdc.gov/mmwr/volumes/73/rr/rr7304a1.htm", "citation": "Nguyen AT et al. U.S. Medical Eligibility Criteria for Contraceptive Use, 2024. MMWR Recomm Rep 2024;73(4)"}, {"label": "ACOG Committee Opinion No. 735: Adolescents and Long-Acting Reversible Contraception: Implants and Intrauterine Devices (May 2018)", "url": "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2018/05/adolescents-and-long-acting-reversible-contraception-implants-and-intrauterine-devices", "citation": "ACOG Committee Opinion No. 735: Adolescents and Long-Acting Reversible Contraception: Implants and Intrauterine Devices (May 2018)"}, {"label": "Zuckerbrot RA et al. Guidelines for Adolescent Depression in Primary Care (GLAD-PC): Part I. Practice Preparation, Identification, Assessment, and Initial Management. Pediatrics 2018;141(3):e20174081 (evaluate emotional complaints with standardized tools; safety planning; consider suicide questions; read from a public PDF copy 2026-10-30)", "url": "https://doi.org/10.1542/peds.2017-4081", "citation": "Zuckerbrot RA et al. Guidelines for Adolescent Depression in Primary Care (GLAD-PC): Part I. Practice Preparation, Identification, Assessment, and Initial Management. Pediatrics 2018;141(3):e20174081 (evaluate emotional complaints with standardized tools; safety planning; consider suicide questions; read from a public PDF copy 2026-10-30)"}, {"label": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Children and Adolescents. JAMA 2022;328(15):1534-1542 (Grade B depression screening ages 12-18; I statement for suicide-risk screening; applies to adolescents without recognized symptoms, so it is context only here)", "url": "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/screening-depression-suicide-risk-children-adolescents", "citation": "US Preventive Services Task Force. Screening for Depression and Suicide Risk in Children and Adolescents. JAMA 2022;328(15):1534-1542 (Grade B depression screening ages 12-18; I statement for suicide-risk screening; applies to adolescents without recognized symptoms, so it is context only here)"}, {"label": "CDC. Contraception and Birth Control Methods (typical-use failure rates: male condom 13%, combined oral contraceptive 7%; read this pass)", "url": "https://www.cdc.gov/contraception/about/", "citation": "CDC. Contraception and Birth Control Methods (typical-use failure rates: male condom 13%, combined oral contraceptive 7%; read this pass)"}]$i6r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmqgu6htm00241y4rgrcxtunv'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i7s$A 16-year-old male presents to the clinic with 2 months of crampy abdominal pain, diarrhea with visible blood several times daily, and a 6-kg weight loss. He is afebrile, and his weight has fallen from the 50th to the 10th percentile. He has mild lower abdominal tenderness without peritoneal signs and no perianal lesions. He has had no recent travel, antibiotic use, or sick contacts. Hemoglobin is 10.4 g/dL, albumin is 3.1 g/dL, and ESR is 52 mm/h.$i7s$,
  question = $i7q$What is the most appropriate next step in management?$i7q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i7o$["Order celiac serology and a hydrogen breath test, then reassess in 4 weeks", "Start oral prednisone for presumed ulcerative colitis with GI follow-up in 4 weeks", "Send ASCA and pANCA serology to establish the diagnosis, then refer him", "Send stool infection studies and calprotectin, then refer him to pediatric GI"]$i7o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i7a$Send stool infection studies and calprotectin, then refer him to pediatric GI$i7a$,
  explanation = $i7e$Two months of bloody diarrhea with weight loss, anemia, hypoalbuminemia and a raised ESR suggest inflammatory bowel disease, which is confirmed by ileocolonoscopy and upper endoscopy with biopsies under pediatric gastroenterology. Before endoscopy, enteric infection (stool culture, C. difficile) is excluded, and fecal calprotectin helps show intestinal inflammation. Celiac serology and breath testing address malabsorption and do not explain bloody stools. Corticosteroids should not be started before the diagnosis is established. ASCA and pANCA serology has imperfect performance, cannot establish or exclude IBD, and is considered in atypical cases; it does not replace infection exclusion, calprotectin and endoscopy.$i7e$,
  "references" = $i7r$[{"label": "Levine A et al. ESPGHAN Revised Porto Criteria for the Diagnosis of Inflammatory Bowel Disease in Children and Adolescents. J Pediatr Gastroenterol Nutr 2014;58:795-806", "url": "https://doi.org/10.1097/MPG.0000000000000239", "citation": "Levine A et al. ESPGHAN Revised Porto Criteria for the Diagnosis of Inflammatory Bowel Disease in Children and Adolescents. J Pediatr Gastroenterol Nutr 2014;58:795-806"}, {"label": "Wine E et al. Management of paediatric ulcerative colitis, part 1: ambulatory care (updated ESPGHAN/ECCO guideline). J Pediatr Gastroenterol Nutr 2025;81:765-815", "url": "https://doi.org/10.1002/jpn3.70097", "citation": "Wine E et al. Management of paediatric ulcerative colitis, part 1: ambulatory care (updated ESPGHAN/ECCO guideline). J Pediatr Gastroenterol Nutr 2025;81:765-815"}]$i7r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmr83jzri00481yq5cq364vgg'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i8s$A 58-year-old man returns for follow-up after an exercise stress echocardiogram that was ordered for 2 months of substernal chest pressure with exertion, which resolves within 5 minutes of rest. He also notes mild dyspnea after two flights of stairs. The study showed limited reversible anterior wall ischemia and a left ventricular ejection fraction of 40%. He has hypertension, hyperlipidemia, and benign prostatic hyperplasia, and he takes aspirin 81 mg, atorvastatin 80 mg, lisinopril 20 mg, and tadalafil 5 mg daily. He has no asthma and has taken no medication for the chest pressure. Resting ECG shows sinus rhythm with a PR interval of 160 ms. Blood pressure is 128/78 mm Hg and heart rate is 76/min.$i8s$,
  question = $i8q$What is the most appropriate next step in management?$i8q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i8o$["Start extended-release diltiazem, then reassess symptoms in 4 weeks", "Start metoprolol succinate and titrate toward the target dose", "Start isosorbide mononitrate, then reassess symptoms in 4 weeks", "Add clopidogrel to aspirin, then reassess symptoms in 4 weeks"]$i8o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i8a$Start metoprolol succinate and titrate toward the target dose$i8a$,
  explanation = $i8e$This patient with stable angina has an LVEF of 40%, so a beta blocker (metoprolol succinate, carvedilol or bisoprolol) is recommended for both angina and left ventricular dysfunction. Diltiazem is a nondihydropyridine calcium channel blocker, which is harmful in HFrEF. Isosorbide mononitrate is contraindicated because he takes tadalafil daily (PDE5 inhibitor with nitrate: harm). Adding clopidogrel to aspirin does not treat angina, and in chronic coronary disease without a recent ACS or PCI the addition of clopidogrel is not useful (Class 3: No Benefit).$i8e$,
  "references" = $i8r$[{"label": "Virani SS et al. 2023 AHA/ACC/ACCP/ASPC/NLA/PCNA Guideline for the Management of Patients With Chronic Coronary Disease. Circulation 2023;148:e9-e119", "url": "https://www.ahajournals.org/doi/full/10.1161/CIR.0000000000001168", "citation": "Virani SS et al. 2023 AHA/ACC/ACCP/ASPC/NLA/PCNA Guideline for the Management of Patients With Chronic Coronary Disease. Circulation 2023;148:e9-e119"}, {"label": "Heidenreich PA et al. 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure. Circulation 2022;145:e895-e1032 (Class 3: Harm for nondihydropyridine calcium channel blockers in HFrEF; recommendation text read in the AHA slide set, not the full-text page)", "url": "https://doi.org/10.1161/CIR.0000000000001063", "citation": "Heidenreich PA et al. 2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure. Circulation 2022;145:e895-e1032 (Class 3: Harm for nondihydropyridine calcium channel blockers in HFrEF; recommendation text read in the AHA slide set, not the full-text page)"}, {"label": "ACC/AHA Task Force. 2023 Chronic Coronary Disease Guideline slide set (beta blocker COR 1 for LVEF 40% or less and metoprolol succinate/carvedilol/bisoprolol preference for LVEF under 50%; antianginal first-line COR 1 B-R; ranolazine for persistent symptoms; PDE5 inhibitor-nitrate harm) read via search extracts 2026-10-30", "url": "https://professional.heart.org/en/science-news/-/media/PHD-Files-2/Science-News/2/2023/2023_chronic_coronary_disease_guideline_slide_set.pdf", "citation": "ACC/AHA Task Force. 2023 Chronic Coronary Disease Guideline slide set (beta blocker COR 1 for LVEF 40% or less and metoprolol succinate/carvedilol/bisoprolol preference for LVEF under 50%; antianginal first-line COR 1 B-R; ranolazine for persistent symptoms; PDE5 inhibitor-nitrate harm) read via search extracts 2026-10-30"}]$i8r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmr84xt5y008m1y5topmfkoq3'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i9s$A 70-year-old woman with hypertension and type 2 diabetes mellitus presents for follow-up. She reports lightheadedness on standing several times a week for the past month, without syncope or falls. Her medications are lisinopril 20 mg daily, metformin 1000 mg twice daily, and amitriptyline 25 mg nightly for painful diabetic neuropathy. Her urine albumin-to-creatinine ratio is 85 mg/g, and her seated clinic blood pressure has averaged 148/86 mm Hg over the past three visits. She reports normal oral intake and her mucous membranes are moist. Hemoglobin is normal, serum potassium is 4.4 mEq/L, and eGFR is 72 mL/min/1.73 m2. After 5 minutes supine, BP is 150/88 mm Hg and HR is 74/min. After 3 minutes standing, BP is 118/76 mm Hg and HR is 94/min, and she reports lightheadedness. The findings are reproduced on repeat testing.$i9s$,
  question = $i9q$Which of the following is the most appropriate next step in management?$i9q$,
  "itemType" = 'vignette',
  options = jsonb_set(jsonb_set(jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i9o$["Stop lisinopril and recheck her orthostatic vital signs off therapy in 4 weeks", "Start midodrine with daytime dosing and titrate to resolution of orthostatic symptoms", "Replace amitriptyline with a non-tricyclic pain agent and continue the ACE inhibitor", "Add compression stockings, liberalize salt and fluids, and continue current medications"]$i9o$::jsonb, true), '{generationMeta,difficultyRating}', '4'::jsonb, true), '{kind}', '"vignette"'::jsonb, true), '{questionFormat}', '"mcq"'::jsonb, true),
  "correctAnswer" = $i9a$Replace amitriptyline with a non-tricyclic pain agent and continue the ACE inhibitor$i9a$,
  explanation = $i9e$This is orthostatic hypotension with a compensatory heart rate rise, normal volume status and normal potassium and renal function, which points to a medication contributor rather than neurogenic failure. Initial management is to reduce or withdraw offending drugs. Amitriptyline (a tricyclic with alpha-1 blocking activity) is the most likely culprit and is replaceable. Lisinopril is needed for her hypertension and albuminuria and is a less likely cause, so stopping it removes her renoprotection and worsens her supine hypertension. Midodrine can worsen supine hypertension and is not first-line before medications are addressed. Liberal salt and fluids are poor choices in a patient with supine hypertension and albuminuria, and they leave the likely culprit in place.$i9e$,
  "references" = $i9r$[{"label": "Shen WK et al. 2017 ACC/AHA/HRS Guideline for the Evaluation and Management of Patients With Syncope. Circulation 2017;136:e60-e122 (orthostatic hypotension: reduce or withdraw causative medications; midodrine and fludrocortisone options for neurogenic OH; nonpharmacologic measures)", "url": "https://www.ahajournals.org/doi/10.1161/CIR.0000000000000499", "citation": "Shen WK et al. 2017 ACC/AHA/HRS Guideline for the Evaluation and Management of Patients With Syncope. Circulation 2017;136:e60-e122 (orthostatic hypotension: reduce or withdraw causative medications; midodrine and fludrocortisone options for neurogenic OH; nonpharmacologic measures)"}, {"label": "Juraschek SP et al. Orthostatic Hypotension in Adults With Hypertension: A Scientific Statement From the American Heart Association. Hypertension 2024;81(3):e16-e30, doi 10.1161/HYP.0000000000000236 (full text read via PMC 2026-10-30)", "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11067441/", "citation": "Juraschek SP et al. Orthostatic Hypotension in Adults With Hypertension: A Scientific Statement From the American Heart Association. Hypertension 2024;81(3):e16-e30, doi 10.1161/HYP.0000000000000236 (full text read via PMC 2026-10-30)"}, {"label": "Freeman R et al. Consensus statement on the definition of orthostatic hypotension, neurally mediated syncope and the postural tachycardia syndrome. Clin Auton Res 2011;21:69-72 (definition only: sustained drop of 20 systolic or 10 diastolic; verified in earlier pass, not re-opened)", "url": "https://doi.org/10.1007/s10286-011-0119-5", "citation": "Freeman R et al. Consensus statement on the definition of orthostatic hypotension, neurally mediated syncope and the postural tachycardia syndrome. Clin Auton Res 2011;21:69-72 (definition only: sustained drop of 20 systolic or 10 diastolic; verified in earlier pass, not re-opened)"}, {"label": "American Diabetes Association Professional Practice Committee. 10. Cardiovascular Disease and Risk Management: Standards of Care in Diabetes-2026. Diabetes Care 2026;49(Suppl 1):S216 (recommendations 10.8 and 10.10: ACE inhibitor or ARB first-line for hypertension with albuminuria; recommended at UACR 30-299 mg/g; read via search extract of the ADA page and PMC listing)", "url": "https://diabetesjournals.org/care/article/49/Supplement_1/S216/163933/10-Cardiovascular-Disease-and-Risk-Management", "citation": "American Diabetes Association Professional Practice Committee. 10. Cardiovascular Disease and Risk Management: Standards of Care in Diabetes-2026. Diabetes Care 2026;49(Suppl 1):S216 (recommendations 10.8 and 10.10: ACE inhibitor or ARB first-line for hypertension with albuminuria; recommended at UACR 30-299 mg/g; read via search extract of the ADA page and PMC listing)"}]$i9r$::jsonb,
  difficulty = 4,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '4'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmtwfmjs9008y1y1ozasi8gai'
  AND "fieldId" = 'aanp-fnp';

UPDATE "QuestionBankItem"
SET
  scenario = $i10s$An 18-month-old girl is brought to the clinic with 1 day of ear tugging, irritability, and rhinorrhea. She is otherwise healthy, fully immunized, weighs 11 kg, has no drug allergies, and has not received an antibiotic in the past year. Temperature is 38.4 °C. The parents report mild ear discomfort that improves with acetaminophen. She is drinking well and has no vomiting. Otoscopy shows bulging, erythematous tympanic membranes with decreased mobility in both ears, and there is no otorrhea or purulent conjunctivitis.$i10s$,
  question = $i10q$What is the most appropriate next step in management?$i10q$,
  options = jsonb_set(jsonb_set((options::jsonb - 'distractorRationale' - 'clinicalReasoning'), '{options}', $i10o$["Observe for 48 to 72 hours with analgesics and a back-up antibiotic prescription", "Prescribe amoxicillin 80 to 90 mg/kg/day in 2 divided doses for 10 days", "Prescribe amoxicillin-clavulanate 90 mg/kg/day in 2 divided doses for 10 days", "Prescribe amoxicillin 80 to 90 mg/kg/day in 2 divided doses for 5 days"]$i10o$::jsonb, true), '{generationMeta,difficultyRating}', '3'::jsonb, true),
  "correctAnswer" = $i10a$Prescribe amoxicillin 80 to 90 mg/kg/day in 2 divided doses for 10 days$i10a$,
  explanation = $i10e$Bilateral acute otitis media in a child 6 to 23 months old warrants antibiotic treatment even when the illness is not severe, so observation is not appropriate. First-line therapy is high-dose amoxicillin (80 to 90 mg/kg/day), and children younger than 2 years should receive a 10-day course. Amoxicillin-clavulanate is reserved for children who received amoxicillin in the previous 30 days, have purulent conjunctivitis, or have recurrent AOM unresponsive to amoxicillin, none of which applies. A 5-day course is too short for a child younger than 2 years.$i10e$,
  "references" = $i10r$[{"label": "Lieberthal AS et al. The Diagnosis and Management of Acute Otitis Media. Pediatrics 2013;131(3):e964-e999 (KAS 3B and 3C read on the AAP page; amoxicillin dose, 10-day course under 2 years, amoxicillin-clavulanate and ceftriaxone indications read in guideline text and the AAP EQIPP algorithm, 2026-10-30)", "url": "https://publications.aap.org/pediatrics/article/131/3/e964/30912/The-Diagnosis-and-Management-of-Acute-Otitis-Media", "citation": "Lieberthal AS et al. The Diagnosis and Management of Acute Otitis Media. Pediatrics 2013;131(3):e964-e999 (KAS 3B and 3C read on the AAP page; amoxicillin dose, 10-day course under 2 years, amoxicillin-clavulanate and ceftriaxone indications read in guideline text and the AAP EQIPP algorithm, 2026-10-30)"}, {"label": "AAP EQIPP. Antibiotic Decision Making for Acute Otitis Media (AOM) algorithm, based on the 2013 guideline (amoxicillin 80-90 mg/kg/day divided BID for 10 days if younger than 2 years; alternate therapy indications; ceftriaxone 50 mg/kg IM/IV for 1-3 days if penicillin allergy)", "url": "https://eqipp.aap.org/File%20Library/Courses/Antibiotics/FlowchartAOM.pdf", "citation": "AAP EQIPP. Antibiotic Decision Making for Acute Otitis Media (AOM) algorithm, based on the 2013 guideline (amoxicillin 80-90 mg/kg/day divided BID for 10 days if younger than 2 years; alternate therapy indications; ceftriaxone 50 mg/kg IM/IV for 1-3 days if penicillin allergy)"}]$i10r$::jsonb,
  difficulty = 3,
  "generationMeta" = jsonb_set(COALESCE("generationMeta", '{}'::jsonb), '{difficultyRating}', '3'::jsonb, true),
  manual_correction = true,
  "updatedAt" = NOW()
WHERE id = 'cmtweyvdh001r1y2nm7xpqfky'
  AND "fieldId" = 'aanp-fnp';

DO $$
DECLARE
  matched integer;
  key_miss integer;
  active_changed integer;
BEGIN
  SELECT COUNT(*)::int INTO matched
  FROM "QuestionBankItem" q
  JOIN (
    VALUES
    ('cmr839bsm008b1ykzrdj3yiih', $v1$Repeat colonoscopy now and continue at 5-year intervals$v1$),
    ('cmqgumyzl00081y0v4d75sy6p', $v2$Chest radiograph within a few days, then review the result$v2$),
    ('cmr83geig00281yq5v7fydsc4', $v3$Complete excisional biopsy with 1- to 3-mm margins$v3$),
    ('cmqgv0tpo000t1ycfxf4k8dya', $v4$Send him to the emergency department for IV fluid rehydration and insulin therapy$v4$),
    ('cmr82v9yq00as1yfvisc0ss9h', $v5$Order serum total and direct bilirubin levels during this visit$v5$),
    ('cmqgu6htm00241y4rgrcxtunv', $v6$Screen with the PHQ-A and GAD-7, then offer supportive counseling$v6$),
    ('cmr83jzri00481yq5cq364vgg', $v7$Send stool infection studies and calprotectin, then refer him to pediatric GI$v7$),
    ('cmr84xt5y008m1y5topmfkoq3', $v8$Start metoprolol succinate and titrate toward the target dose$v8$),
    ('cmtwfmjs9008y1y1ozasi8gai', $v9$Replace amitriptyline with a non-tricyclic pain agent and continue the ACE inhibitor$v9$),
    ('cmtweyvdh001r1y2nm7xpqfky', $v10$Prescribe amoxicillin 80 to 90 mg/kg/day in 2 divided doses for 10 days$v10$)
  ) AS v(id, answer)
    ON q.id = v.id
   AND q."correctAnswer" = v.answer
   AND q."fieldId" = 'aanp-fnp';
  IF matched <> 10 THEN
    RAISE EXCEPTION 'expected 10 updated keys, found %', matched;
  END IF;

  SELECT COUNT(*)::int INTO key_miss
  FROM "QuestionBankItem" q
  WHERE q.id IN (
    'cmr839bsm008b1ykzrdj3yiih',
    'cmqgumyzl00081y0v4d75sy6p',
    'cmr83geig00281yq5v7fydsc4',
    'cmqgv0tpo000t1ycfxf4k8dya',
    'cmr82v9yq00as1yfvisc0ss9h',
    'cmqgu6htm00241y4rgrcxtunv',
    'cmr83jzri00481yq5cq364vgg',
    'cmr84xt5y008m1y5topmfkoq3',
    'cmtwfmjs9008y1y1ozasi8gai',
    'cmtweyvdh001r1y2nm7xpqfky'
  )
    AND NOT EXISTS (
      SELECT 1
      FROM jsonb_array_elements_text(
        CASE
          WHEN left(btrim(q.options), 1) = '{' THEN q.options::jsonb->'options'
          ELSE q.options::jsonb
        END
      ) AS opt(value)
      WHERE opt.value = q."correctAnswer"
    );
  IF key_miss <> 0 THEN
    RAISE EXCEPTION 'key does not match an option on % row(s)', key_miss;
  END IF;

  SELECT COUNT(*)::int INTO active_changed
  FROM "QuestionBankItem" q
  JOIN qbi_fnp_rewrites10_20261030_backup b ON b.id = q.id
  WHERE q.active IS DISTINCT FROM b.active
     OR q."qaPassed" IS DISTINCT FROM b."qaPassed";
  IF active_changed <> 0 THEN
    RAISE EXCEPTION 'active or qaPassed changed on % row(s)', active_changed;
  END IF;
END $$;

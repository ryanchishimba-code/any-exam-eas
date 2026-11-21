"""Step 2 items 86-100."""

from lib import s2

ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
CDC = "CDC Sexually Transmitted Infections Treatment Guidelines, 2021."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s2(n, **k))

A(86, system="reproductive-endocrine", weight=10, topic="preeclampsia-eclampsia", domain="reproductive-endocrine", diff=4, subject="obstetrics",
  takeaway="Creatinine above 1.1 mg/dL is a severe feature. Before 34 weeks, a currently stable mother and a reassuring fetus stay in the hospital. They are not sent home.",
  citation=ACOG,
  scenario="A 26-year-old patient is at 33 weeks and 0 days. Blood pressure is 148/94 mm Hg after oral labetalol. Creatinine is 1.4 mg/dL and was 0.6 mg/dL in the first trimester. Platelets are 170,000. She has no headache, and the fetal tracing is reassuring. A colleague offers discharge with a visit in one week because the pressure improved.",
  question="Which setting matches the creatinine and the gestational age?",
  correct=W("Inpatient monitoring where a preterm newborn can be cared for",
            "Creatinine above 1.1 mg/dL is a severe feature. She is under 34 weeks and currently stable, so ACOG allows expectant management in a capable hospital. Discharge misses the severe feature, and gestational age alone does not mandate delivery tonight."),
  wrongs=[
    W("Home, with a visit in one week, because the pressure improved", "Improved pressure does not erase a creatinine of 1.4 mg/dL."),
    W("Delivery tonight solely because she is under 34 weeks", "Under 34 weeks is the window for stable expectant care, not an automatic delivery."),
    W("Magnesium at home until 37 weeks", "Home magnesium is not a regimen. The creatinine requires a hospital."),
    W("No further laboratory tests until 37 weeks", "The creatinine is already abnormal. Stopping surveillance is the opposite of expectant care."),
  ])

A(87, system="multisystem", weight=6, topic="hiv-opportunistic", domain="multisystem", diff=2, subject="infectious-disease",
  takeaway="Uncomplicated pharyngeal gonorrhea under 150 kg is treated with ceftriaxone 500 mg intramuscularly once. Oral azithromycin does not replace the injection.",
  citation=CDC,
  scenario="A 30-year-old patient weighs 68 kg and has a sore throat. A pharyngeal test is positive for gonorrhea. A genital test is negative, and chlamydia testing is negative. A colleague prescribes azithromycin 1 g by mouth and no injection.",
  question="Which drug treats this throat infection?",
  correct=W("Ceftriaxone 500 mg intramuscularly once",
            "The 2021 regimen for pharyngeal gonorrhea under 150 kg is ceftriaxone 500 mg once. A negative chlamydia test means no second drug. The throat does not make an oral macrolide sufficient and does not automatically raise the dose to 1 g."),
  wrongs=[
    W("Azithromycin 1 g by mouth", "Azithromycin does not replace ceftriaxone for pharyngeal gonorrhea."),
    W("Ceftriaxone 1 g, because the throat always requires the higher dose", "One gram is for weight at or above 150 kg or for disseminated infection."),
    W("Ciprofloxacin for 3 days", "A fluoroquinolone is not the recommended pharyngeal regimen."),
    W("No antibiotic, because a negative genital test cancels a positive throat test", "The positive throat test is the infected site. A negative genital test does not clear it."),
  ])

A(88, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=3, subject="gastroenterology",
  takeaway="Melena, a urea of 40 mg/dL, a hemoglobin of 9.5 g/dL, and a pulse of 108 are not a very-low-risk score. Hemoglobin above 7 g/dL is not a discharge rule.",
  citation=ACG,
  scenario="A 64-year-old patient has melena. Blood urea nitrogen is 40 mg/dL, hemoglobin is 9.5 g/dL, and the pulse is 108/min. Systolic pressure is 104 mm Hg. He has not fainted. A colleague discharges him because the hemoglobin is above 7.",
  question="Why is discharge the wrong reading of these numbers?",
  correct=W("Melena, the urea, the hemoglobin, and the pulse are not a Glasgow-Blatchford score of 0 or 1",
            "ACG 2021 uses that score to find patients who may go home. These findings add risk. The transfusion threshold of 7 g/dL is not a disposition rule."),
  wrongs=[
    W("Discharge is correct. Any hemoglobin above 7 g/dL is an outpatient bleed", "A hemoglobin of 9.5 does not make melena and tachycardia low risk."),
    W("Discharge after two units of red cells in the waiting room", "He is not described as meeting a stable transfusion trigger at 9.5 g/dL, and a hallway transfusion does not make the score safe."),
    W("Outpatient barium swallow tomorrow", "Contrast imaging is not the triage. This pattern is admitted."),
    W("The pulse of 108 is anxiety and can be ignored", "The pulse is one of the score's inputs, and the other values are also abnormal."),
  ])

A(89, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=2, subject="internal-medicine",
  takeaway="Low-dose CT screening for lung cancer is not started at age 81. The upper age is 80.",
  citation=USP_LU,
  scenario="An 81-year-old patient has smoked a pack a day for 50 years and still smokes. He has no symptoms and can walk a flight of stairs. A colleague orders annual low-dose CT because the pack-year history is far above 20.",
  question="Why is a new screening CT not indicated?",
  correct=W("He is 81, which is past the upper age of 80",
            "The 2021 recommendation is ages 50 through 80. Pack-years and current smoking would qualify a younger adult. They do not extend the age limit."),
  wrongs=[
    W("It is indicated. Pack-years override the age limit", "The age range is part of the recommendation, not an optional detail."),
    W("Order a chest radiograph every year after 80 instead", "Chest radiography is not the screening test at any age."),
    W("Start CT and continue it for life once the first scan is normal", "A normal scan does not create a program past the age cutoff."),
    W("The upper age is 75, so he has been ineligible since 76", "The upper age is 80. He is ineligible because he is 81."),
  ])

A(90, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=3, subject="internal-medicine",
  takeaway="From ages 76 through 85, colorectal screening is offered selectively. A frail 82-year-old with a negative colonoscopy at 70 is not booked automatically.",
  citation=USP_CR,
  scenario="An 82-year-old patient uses a wheelchair outdoors and has several chronic diseases with a limited life expectancy. A colonoscopy at age 70 was negative. A colleague books a repeat colonoscopy because the same schedule used at age 50 continues through 85.",
  question="How should screening be handled at age 82?",
  correct=W("Do not automatically repeat screening",
            "The 2021 statement offers screening selectively from 76 to 85, based on overall health and prior screening. Frailty, limited life expectancy, and a negative colonoscopy at 70 argue against an automatic repeat."),
  wrongs=[
    W("Automatic colonoscopy through age 85", "That erases the selective recommendation for ages 76 to 85."),
    W("Start screening now because he has never been tested", "He already had a negative colonoscopy at age 70, so he is not unscreened."),
    W("Yearly fecal testing is mandatory after age 80", "No colorectal test is mandatory in the selective age band of 76 to 85."),
    W("Colonoscopy every year until age 90", "Annual colonoscopy is not a USPSTF interval at any age."),
  ])

A(91, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=2, subject="internal-medicine",
  takeaway="For women aged 40 to 74, the USPSTF mammography interval is every two years, not every year.",
  citation=USP_BR,
  scenario="A 55-year-old patient has had a mammogram every year since age 40. She has no symptoms and no high-risk mutation. She asks whether the yearly visit is required. A colleague says the task force requires annual imaging through age 74.",
  question="What interval does the 2024 statement use?",
  correct=W("Every two years. She remains inside the age range, so screening continues, but not yearly",
            "The 2024 recommendation is biennial mammography from 40 through 74. Annual screening is the interval with the less favorable balance. Stopping at 55 would also be wrong."),
  wrongs=[
    W("Every year through age 74", "Yearly imaging is not the 2024 interval."),
    W("Stop now, because screening ends at 50", "Screening in this statement continues through 74."),
    W("Switch to ultrasound every six months", "Ultrasound is not the average-risk screening test."),
    W("One more mammogram at 55 and then stop forever", "Stopping at 55 cuts off the recommended years through 74."),
  ])

A(92, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="cardiology",
  takeaway="Office blood pressure of at least 160/100 mm Hg is treated promptly. A week of home readings is not a reason to withhold all treatment.",
  citation=HTN,
  scenario="A 57-year-old patient has no symptoms. Repeated office readings today are 166/104 mm Hg. He has no home cuff yet. A colleague wants a week of home monitoring before any drug, to exclude an alerting response.",
  question="What happens before that week of home readings?",
  correct=W("Start treatment now rather than withhold every drug for a week",
            "The 2025 guideline says out-of-office readings are reasonable at or above 130/80, but office pressure of at least 160/100 is treated promptly. Home readings can still be collected. They are not a reason to delay all treatment."),
  wrongs=[
    W("No drug for at least a week. Every reading of 160 or higher is confirmed at home first", "The prompt-treatment line is 160/100. He is already over it."),
    W("Treat only if a single home reading exceeds 180/120", "180/120 is not the threshold that permits a week of delay."),
    W("No treatment unless he has a headache", "Symptoms are not required before treating a repeated office pressure of 166/104 mm Hg."),
    W("A one-month trial of a potassium salt substitute and no drug", "A salt substitute does not replace prompt treatment at 166/104."),
  ])

A(93, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=2, subject="cardiology",
  takeaway="In symptomatic HFrEF, one of the three evidence-based beta blockers starts once the patient is euvolemic and off inotropes. It is not delayed until symptoms are present at rest.",
  citation=HF,
  scenario="A 58-year-old patient has an ejection fraction of 33 percent and breathlessness walking one block. He is euvolemic, the heart rate is 84/min, and he is not on an inotrope or a beta blocker. A colleague says to wait until he is short of breath at rest before starting carvedilol, bisoprolol, or metoprolol succinate.",
  question="When does the evidence-based beta blocker start?",
  correct=W("Now, using bisoprolol, carvedilol, or metoprolol succinate",
            "The 2022 guideline says not to delay an evidence-based beta blocker until symptoms worsen. He is already symptomatic, euvolemic, and off inotropes. Atenolol would be the wrong molecule."),
  wrongs=[
    W("Only after symptoms appear at rest", "Waiting for rest symptoms withholds a mortality-reducing drug."),
    W("Now, using atenolol, because any beta blocker is equivalent", "The start is immediate, but atenolol is not one of the three drugs with the mortality evidence."),
    W("After a week of an intravenous inotrope, even though he does not need one", "An inotrope is not a prerequisite. Caution applies only if he has required one."),
    W("Never, because a heart rate of 84 is too slow", "A rate of 84 is not a bradycardia contraindication."),
  ])

A(94, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=3, subject="endocrinology",
  takeaway="In type 2 diabetes with heart failure, an SGLT2 inhibitor is added even when the A1c is already near goal.",
  citation=ADA,
  scenario="A 63-year-old patient has type 2 diabetes with an A1c of 6.6 percent on metformin. He is short of breath climbing stairs. The ejection fraction is 58 percent, the natriuretic peptide is elevated, and the left atrium is enlarged. A colleague says an SGLT2 inhibitor is appropriate only if the A1c is above 8 percent.",
  question="Does an A1c of 6.6 percent remove the SGLT2 inhibitor?",
  correct=W("No. Heart failure is the indication, independent of the A1c",
            "ADA 2026 recommends an SGLT2 inhibitor for type 2 diabetes with heart failure irrespective of A1c. An ejection fraction of 58 percent does not remove that indication."),
  wrongs=[
    W("Yes. The drug is only a glucose drug, and 6.6 percent is already at goal", "The recommendation is irrespective of A1c."),
    W("No, but only if the ejection fraction is under 40 percent", "The heart-failure recommendation is not restricted to reduced ejection fraction."),
    W("Replace metformin with a sulfonylurea instead", "A sulfonylurea does not treat the heart-failure indication and adds hypoglycemia."),
    W("Add a DPP-4 inhibitor, which has the same heart-failure benefit", "A DPP-4 inhibitor is not the heart-failure drug in the standards."),
  ])

A(95, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
  takeaway="When a COPD exacerbation has purulent sputum, the antibiotic course is 5 days, not 14.",
  citation=GOLD,
  scenario="A 72-year-old patient with known COPD has increased dyspnea and newly green sputum for two days. The respiratory rate is 22/min, oxygen saturation is 91 percent on room air, and the radiograph has no infiltrate. He is not in ventilatory failure. A colleague prescribes 14 days of an antibiotic and no corticosteroid.",
  question="Which drug plan matches purulent sputum in this flare?",
  correct=W("An antibiotic for 5 days, plus a systemic corticosteroid for up to 5 days",
            "GOLD 2026 recommends antibiotics for about 5 days when sputum is purulent, and systemic corticosteroids for up to 5 days in a moderate exacerbation. Fourteen days of antibiotic without a corticosteroid misses both durations."),
  wrongs=[
    W("Fourteen days of antibiotic and no corticosteroid", "Both the antibiotic duration and the missing corticosteroid are wrong."),
    W("No antibiotic, because a clear radiograph means green sputum is irrelevant", "Purulent sputum is an antibiotic indication. A clear film argues against pneumonia, not against treating the exacerbation."),
    W("Theophylline for 10 days instead of an antibiotic", "Methylxanthines are not recommended and do not replace the antibiotic when sputum is purulent."),
    W("A corticosteroid for 30 days and no antibiotic", "Purulent sputum is a reason to include the 5-day antibiotic, and the corticosteroid is not extended to 30 days."),
  ])

A(96, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="endocrinology",
  takeaway="Metformin is held at the time of iodinated contrast when eGFR is 30 to 60. It is restarted after kidney function is rechecked, not stopped forever for one scan.",
  citation=ADA,
  scenario="A 67-year-old patient takes metformin. The estimated filtration rate is 48 mL/min/1.73 m2. A contrast-enhanced CT is planned today. A colleague continues metformin through the scan and says only an eGFR below 30 changes anything about contrast.",
  question="What happens to metformin around this scan?",
  correct=W("Hold it for the contrast study and recheck kidney function before restarting",
            "ADA 2026, following the FDA labeling, says metformin is temporarily discontinued at the time of iodinated contrast when eGFR is 30 to 60. An eGFR of 48 is inside that band. The drug is not abandoned permanently for one scan."),
  wrongs=[
    W("Continue it. Contrast changes metformin only below an eGFR of 30", "Below 30 is the contraindication to using metformin at all. The contrast hold starts higher, at an eGFR under 60."),
    W("Stop metformin forever because any contrast exposure ends the indication", "The hold is temporary, with kidney function rechecked before restart."),
    W("Double the metformin dose the morning of the scan", "A higher dose around contrast increases the exposure the hold is meant to avoid."),
    W("Switch to a sulfonylurea for the scan day only", "A sulfonylurea is not the contrast instruction. The instruction is to hold metformin."),
  ])

A(97, system="cardiovascular", weight=9, topic="acs-management", domain="cardiovascular", diff=3, subject="cardiology",
  takeaway="A normal first troponin does not delay primary PCI for an anterior ST-elevation pattern when the device can be activated within 90 minutes.",
  citation=ACS,
  scenario="A 49-year-old patient has had chest pressure for 25 minutes at a hospital with a catheterization laboratory. The electrocardiogram shows 3 mm of ST-segment elevation in V2 through V4. The first troponin is still inside the reference range. The team can activate the device in 35 minutes. A colleague waits three hours for a second troponin.",
  question="What is done with the normal first troponin?",
  correct=W("Activate the laboratory now. Do not wait for a rising troponin",
            "The 2025 guideline recommends primary PCI for this tracing within 12 hours when device activation can occur within 90 minutes. A single normal troponin does not exclude early occlusion."),
  wrongs=[
    W("Wait three hours. A normal troponin excludes an acute occlusion", "Early occlusion often precedes the troponin rise."),
    W("Give a fibrinolytic because the troponin is normal", "A normal troponin is not a fibrinolytic indication, and a 35-minute device time does not need a fibrinolytic."),
    W("Discharge, because 25 minutes of pain is too short to be cardiac", "Twenty-five minutes with this tracing is already an indication."),
    W("Start a nitrate infusion and reassess tomorrow", "A nitrate does not reperfuse an anterior occlusion."),
  ])

A(98, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=3, subject="nephrology",
  takeaway="Heart failure is an SGLT2-inhibitor indication even when albuminuria is absent and there is no diabetes.",
  citation=KDIGO,
  scenario="A 70-year-old patient has dyspnea, an ejection fraction of 30 percent, an estimated filtration rate of 50 mL/min/1.73 m2, and a urine albumin-to-creatinine ratio of 12 mg/g. He does not have diabetes. A colleague withholds an SGLT2 inhibitor because the albumin ratio is under 200.",
  question="Does an albumin ratio of 12 mg/g block the SGLT2 inhibitor?",
  correct=W("No. Heart failure is an indication regardless of the albumin ratio",
            "KDIGO 2024 recommends an SGLT2 inhibitor for heart failure irrespective of albuminuria. The albumin threshold of 200 applies when heart failure is absent. His ejection fraction is 30 percent."),
  wrongs=[
    W("Yes. The kidney guideline requires an albumin ratio of at least 200 in every patient", "That threshold is not required when heart failure is the indication."),
    W("No, but only if the filtration rate is above 90", "An eGFR of 50 is above the floor of 20. A normal filtration rate is not required."),
    W("Yes, unless the A1c is above 8 percent", "He does not need diabetes or a high A1c."),
    W("Replace the drug with a nonsteroidal anti-inflammatory drug for the dyspnea", "A nonsteroidal drug worsens heart failure and kidney perfusion."),
  ])

A(99, system="msk-skin", weight=9, topic="gout-crystals", domain="msk-skin", diff=3, subject="rheumatology",
  takeaway="Allopurinol is titrated until the serum urate is below 6 mg/dL. A tolerated dose of 100 mg is not the ceiling when the urate remains 7.8.",
  citation=ACR,
  scenario="A 60-year-old patient has had no rash or hypersensitivity on allopurinol 100 mg daily for two months. The serum urate is 7.8 mg/dL and attacks have continued. The estimated filtration rate is 58 mL/min/1.73 m2. A colleague keeps 100 mg forever because any higher dose is unsafe once filtration is under 60.",
  question="What happens to the 100 mg dose?",
  correct=W("Increase the dose, aiming for a urate below 6 mg/dL",
            "The 2020 guideline recommends titrating to a serum urate below 6 mg/dL. Allopurinol often needs more than 300 mg, up to 800 mg, including in CKD. A low start reduces hypersensitivity risk. It is not a permanent ceiling."),
  wrongs=[
    W("Leave 100 mg. A filtration rate under 60 prohibits any higher dose", "CKD is a reason he was a candidate for allopurinol, not a reason to freeze an ineffective dose."),
    W("Stop allopurinol and start pegloticase", "Pegloticase is not the next step after 100 mg. The oral dose has not been optimized."),
    W("Add probenecid and keep 100 mg", "Probenecid is not preferred at this filtration rate. The allopurinol dose is what should rise."),
    W("Switch to hourly colchicine as the urate-lowering method", "Colchicine does not lower urate, and hourly colchicine is the flare regimen the guideline rejected."),
  ])

A(100, system="respiratory-renal", weight=8, topic="copd-asthma-exacerbation", domain="respiratory-renal", diff=3, subject="pulmonology",
  takeaway="A mild COPD exacerbation is treated by increasing the short-acting bronchodilator. Systemic corticosteroids are for moderate or severe flares, not for a mild increase in dyspnea alone.",
  citation=GOLD,
  scenario="A 66-year-old patient with known COPD has one day of slightly increased dyspnea. The respiratory rate is 16/min, oxygen saturation is 95 percent on room air, and the sputum is unchanged and white. He is speaking full sentences. A colleague prescribes prednisone 40 mg for 5 days because every increase in dyspnea gets a corticosteroid.",
  question="Which drug change matches this mild increase in dyspnea?",
  correct=W("Increase the short-acting bronchodilator and do not start a systemic corticosteroid",
            "GOLD 2026 classifies a mild exacerbation as one managed by increasing the short-acting bronchodilator. Systemic corticosteroids are recommended for moderate or severe exacerbations. He is not tachypneic or hypoxemic, and the sputum is not purulent."),
  wrongs=[
    W("Prednisone for 5 days, because any increase in dyspnea is at least moderate", "The 5-day corticosteroid course is for moderate or severe flares, not for this mild pattern."),
    W("An antibiotic for 5 days, because white sputum still counts as purulent if dyspnea increased", "The sputum is white and unchanged. That is not the purulent indication."),
    W("Theophylline for the extra dyspnea", "Methylxanthines are not recommended for a mild increase in dyspnea."),
    W("Immediate noninvasive ventilation", "He is not in hypercapnic respiratory failure. A mask ventilator is not the treatment of a mild flare."),
  ])

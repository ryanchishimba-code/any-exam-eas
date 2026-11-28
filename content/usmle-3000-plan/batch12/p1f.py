"""Step 1 items 61-100."""

from lib import s1

HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
USP_CX = "US Preventive Services Task Force cervical cancer screening recommendation, 2018, which remains the current USPSTF statement."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(61, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="After successful endovascular reperfusion for a large-vessel occlusion, lowering systolic pressure below 140 mm Hg in the first 24 to 72 hours can worsen outcome.",
  citation=HTN,
  scenario="A 72-year-old patient had a large-vessel occlusion opened by thrombectomy two hours ago. Systolic pressure is 158 mm Hg and the neurologic examination is stable. A classmate starts a drip to push the systolic pressure under 130 mm Hg within the hour.",
  question="Why is that pressure target the wrong one right now?",
  correct=W("Lowering systolic pressure below 140 mm Hg in the first 24 to 72 hours after successful reperfusion can worsen outcome",
            "The 2025 high blood pressure guideline gives this a class 3 harm rating. A systolic pressure of 158 is not an invitation to drive it under 140 in this window."),
  wrongs=[
    W("Systolic pressure must be under 120 within the first hour after every thrombectomy", "That is the direction the class 3 rating warns against."),
    W("The harm appears only if pressure is lowered after 7 days", "The window in the recommendation is the first 24 to 72 hours."),
    W("Blood pressure is ignored for a week after thrombectomy, even above 220", "The harm rating is about lowering below 140. It is not a license to ignore extreme pressure."),
    W("The target below 140 applies only to patients who did not reperfuse", "The class 3 statement is specifically after successful reperfusion."),
  ])

A(62, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="In spontaneous intracerebral hemorrhage with systolic pressure 150 to 220 mm Hg, lowering toward 130 to under 140 mm Hg can be beneficial. Stopping if pressure falls below 130 matters.",
  citation=HTN,
  scenario="A 69-year-old patient has a spontaneous intracerebral hemorrhage. Systolic pressure is 186 mm Hg. A classmate either leaves it untreated or drives it to 110 mm Hg.",
  question="Which systolic range fits the first week?",
  correct=W("Lower toward 130 to under 140 mm Hg, and stop antihypertensives if it falls below 130",
            "The 2025 guideline says that for systolic pressure between 150 and 220 it can be beneficial to lower immediately to 130 to under 140 for at least 7 days, and to stop medications if systolic pressure falls below 130."),
  wrongs=[
    W("Leave 186 mm Hg untreated for the first week", "186 is inside 150 to 220, where lowering can be beneficial."),
    W("Drive systolic pressure to 110 mm Hg and keep the drip running", "Below 130 the instruction is to stop the antihypertensives."),
    W("Lower only if systolic pressure exceeds 240", "The range that triggers the recommendation starts at 150, not 240."),
    W("Use the same under-140 target that is harmful after thrombectomy", "These are different brain events. The hemorrhage recommendation is not the thrombectomy harm statement."),
  ])

A(63, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=2, subject="physiology",
  takeaway="Systolic pressure under 120 and diastolic pressure under 80 is normal. 118/76 is not elevated and not stage 1.",
  citation=HTN,
  scenario="A 41-year-old patient has an average blood pressure of 118/76 mm Hg and no disease. A classmate labels it elevated because it is close to 120 and discusses medication.",
  question="Which category is 118/76 mm Hg?",
  correct=W("Normal blood pressure",
            "The 2025 definition of normal is systolic under 120 and diastolic under 80. Elevated begins at 120. Medication thresholds are not being discussed for a normal reading."),
  wrongs=[
    W("Elevated, because any reading near 120 is elevated", "Near 120 is not 120. Elevated starts at 120."),
    W("Stage 1, because diastolic 76 rounds up to 80", "Stage 1 diastolic begins at 80, and values are not rounded into a higher stage."),
    W("Stage 2, because two digits are in the 70s and 100s", "Stage 2 begins at 140 or 90."),
    W("Isolated systolic hypertension", "Systolic pressure is under 120. There is no isolated systolic elevation."),
  ])

A(64, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=2, subject="physiology",
  takeaway="Stage 2 hypertension is a systolic pressure of at least 140 or a diastolic pressure of at least 90. Both numbers do not have to qualify.",
  citation=HTN,
  scenario="A 53-year-old patient has an average blood pressure of 152/84 mm Hg. A classmate calls it stage 1 because the diastolic value is under 90.",
  question="Which stage is 152/84 mm Hg?",
  correct=W("Stage 2, because the systolic value is at least 140",
            "The 2025 definition uses or, not and. Systolic pressure of at least 140 is stage 2 even when diastolic pressure is 84, which would by itself be stage 1."),
  wrongs=[
    W("Stage 1, because the diastolic value is under 90", "The diastolic value does not veto a systolic value of 152."),
    W("Elevated, because 152 is only a little above 120", "Elevated blood pressure stops at a systolic value of 129, so 152 is not in that band."),
    W("Normal, because 84 is a comfortable diastolic value", "A systolic value of 152 is not normal."),
    W("Measurement error, because the two numbers are far apart", "Isolated systolic stage 2 hypertension is a real pattern."),
  ])

A(65, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=2, subject="pharmacology",
  takeaway="A potassium-based salt substitute can be useful when kidney function is normal and no potassium-retaining drug is in use.",
  citation=HTN,
  scenario="A 48-year-old patient has hypertension, an estimated filtration rate of 96 mL/min/1.73 m2, and a potassium of 4.1 mEq/L. He takes amlodipine only and salts his food heavily. A classmate forbids every salt substitute, including a potassium-based one, because substitutes are never allowed.",
  question="Is a potassium-based substitute reasonable here?",
  correct=W("Yes. Kidney function is normal and he is not on a potassium-retaining drug",
            "The 2025 guideline says a potassium-based substitute can be useful, particularly when salt intake is from home food preparation, except in CKD or with drugs that reduce potassium excretion. Neither exception is present."),
  wrongs=[
    W("No. Potassium substitutes are prohibited in every adult with hypertension", "The prohibition is the exception for CKD or potassium-retaining drugs, not a universal ban."),
    W("Yes, but only if a nonsteroidal drug is added", "A nonsteroidal drug is not required and is not protective."),
    W("Yes, and the amlodipine should be stopped so the substitute can work", "The substitute does not replace the blood-pressure drug."),
    W("No, unless the filtration rate is below 30", "A low filtration rate is when the substitute is avoided, not when it is required."),
  ])

A(66, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="The four disease-modifying classes in symptomatic HFrEF are an ARNI, an evidence-based beta blocker, a mineralocorticoid antagonist, and an SGLT2 inhibitor.",
  citation=HF,
  scenario="A 57-year-old patient has an ejection fraction of 30 percent and dyspnea on one flight of stairs. He is on no therapy. A classmate lists the four disease-modifying classes as digoxin, a nitrate, hydralazine, and a statin.",
  question="Which four classes are the core therapy?",
  correct=W("An ARNI, an evidence-based beta blocker, a mineralocorticoid antagonist, and an SGLT2 inhibitor",
            "The 2022 guideline expanded guideline-directed therapy for HFrEF to those four classes. Digoxin, a nitrate, and hydralazine are not the core four. An ARNI is preferred when it can be used."),
  wrongs=[
    W("Digoxin, a nitrate, hydralazine, and a statin", "That list misses the four classes that reduce hospitalization and death as core therapy."),
    W("A nondihydropyridine calcium blocker, a nitrate, digoxin, and a fibrate", "Nondihydropyridine calcium blockers are harmful in HFrEF."),
    W("Only a loop diuretic, because the other classes wait for a second hospitalization", "A diuretic treats fluid. It does not replace the four disease-modifying classes, and they are not delayed for a second admission."),
    W("Two ACE inhibitors plus two beta blockers", "One renin-angiotensin drug and one evidence-based beta blocker, not duplicates of each."),
  ])

A(67, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=2, subject="pharmacology",
  takeaway="A short-acting beta agonist relieves constriction and does not treat the airway inflammation that drives severe asthma exacerbations.",
  citation=GINA,
  scenario="A 22-year-old patient uses an albuterol inhaler daily and has never used an inhaled corticosteroid. He asks why the canister relieves wheeze for an hour and still leaves him at risk for a severe attack. Spirometry yesterday varied through the day.",
  question="Which process does albuterol leave untreated?",
  correct=W("Airway inflammation. Bronchodilation alone does not reduce that risk",
            "GINA 2025 says short-acting beta-agonist-only treatment is a risk factor for severe exacerbations. The drug opens the airway and does not treat the inflammation. That is why the preferred reliever contains an inhaled corticosteroid."),
  wrongs=[
    W("Bronchoconstriction. Albuterol has no effect on smooth muscle", "Albuterol does relax smooth muscle. That is the effect it does provide."),
    W("Bacterial infection, which is the cause of every wheeze", "Variable airflow is not automatically infection, and albuterol is not an antibiotic."),
    W("Surfactant deficiency", "Surfactant is not the untreated process in this asthma pattern."),
    W("Pulmonary fibrosis, which albuterol reverses if the dose is high enough", "Fibrosis is not the mechanism, and a higher albuterol dose does not treat inflammation."),
  ])

A(68, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=2, subject="pharmacology",
  takeaway="Allopurinol is started low because a lower starting dose reduces the risk of hypersensitivity. The dose is then titrated.",
  citation=ACR,
  scenario="A 59-year-old patient is starting allopurinol. The estimated filtration rate is 55 mL/min/1.73 m2. A classmate asks why the first tablet is not the 800 mg maximum if the urate is 9 mg/dL.",
  question="Why start low?",
  correct=W("A lower starting dose reduces hypersensitivity risk. The dose is titrated afterward",
            "The 2020 ACR guideline prefers allopurinol and states that a lower starting dose mitigates the safety concern of allopurinol hypersensitivity. The maximum dose is a ceiling reached by titration, not the first tablet."),
  wrongs=[
    W("The first dose is low because allopurinol does not work above 100 mg", "Doses above 300 mg are often required. The low start is about safety, not a ceiling."),
    W("Hypersensitivity is less likely if the first dose is the maximum", "The direction is the opposite."),
    W("A low start is used only when the filtration rate is above 90", "CKD is a setting where allopurinol is still first-line, and the low start still applies."),
    W("The low start replaces the need for HLA-B*5801 testing in a high-prevalence ancestry", "A low start and ancestry-based testing answer different risks. One does not cancel the other."),
  ])

A(69, system="gastrointestinal", weight=8, topic="gi-bleeding-sources", domain="gastrointestinal", diff=3, subject="physiology",
  takeaway="A proton pump inhibitor after ulcer hemostasis is used to keep gastric pH high enough for the clot to stay stable.",
  citation=ACG,
  scenario="A 58-year-old patient had a visible vessel clipped an hour ago and the bleeding stopped. A classmate asks why a proton pump inhibitor is still given if the vessel is already clipped, and offers sucralfate as an equal substitute.",
  question="Why is acid suppression continued after the clip?",
  correct=W("A high gastric pH stabilizes the clot. The clip does not make acid suppression unnecessary",
            "ACG 2021 recommends high-dose proton pump inhibitor therapy for 3 days after hemostasis, then twice-daily oral therapy for 2 weeks. The physiologic reason is clot stability at a higher pH. Sucralfate is not that regimen."),
  wrongs=[
    W("The clip replaces every drug, because a mechanical seal does not need a pH change", "The guideline still recommends the proton pump inhibitor after successful hemostasis."),
    W("Acid suppression is used to dissolve the clip within 24 hours", "The point is to protect the clot, not to remove the clip."),
    W("A low gastric pH is what stabilizes the clot", "The direction is a higher pH, not a lower one."),
    W("Sucralfate raises pH more than a proton pump inhibitor", "Sucralfate is not the drug the guideline recommends for this job."),
  ])

A(70, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=3, subject="biostatistics",
  takeaway="From ages 30 to 65, cotesting with cytology and high-risk HPV every 5 years is one acceptable strategy. It is not a yearly test.",
  citation=USP_CX,
  scenario="A 40-year-old patient wants to know whether doing a Pap smear and an HPV test together every year is required. Her last cotest was normal one year ago. She has no symptoms.",
  question="How often is cotesting done if that option is chosen?",
  correct=W("Every 5 years, not every year",
            "The current USPSTF statement lists cotesting every 5 years as one of three acceptable strategies from ages 30 to 65. A normal cotest one year ago does not make the interval annual."),
  wrongs=[
    W("Every year from age 30 onward", "The cotest interval is 5 years."),
    W("Cotesting is not allowed at any age", "It is one of the three acceptable strategies from 30 to 65."),
    W("Every 5 years, but only after age 65", "The strategy applies from 30 to 65. Sixty-five is not the start."),
    W("Cotesting every 5 years replaces the need for any test before age 30", "Ages 21 to 29 use cytology alone. Cotesting does not rewrite that decade."),
  ])

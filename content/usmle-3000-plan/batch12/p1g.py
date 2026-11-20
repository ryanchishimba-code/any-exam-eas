"""Step 1 items 71-100."""

from lib import s1

HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
CDI = "IDSA/SHEA 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(71, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="physiology",
  takeaway="HFrEF means the current or prior ejection fraction is 40 percent or lower. A value of 33 percent is not 'borderline preserved.'",
  citation=HF,
  scenario="A 60-year-old patient has dyspnea and an ejection fraction of 33 percent. A classmate says the cutoff for reduced ejection fraction is 35 percent, so 33 percent is reduced but 39 percent would be preserved.",
  question="Where does reduced ejection fraction start?",
  correct=W("At 40 percent or lower. Both 33 and 39 percent are reduced",
            "The 2022 definition is 40 percent or lower for reduced, 41 to 49 for mildly reduced, and 50 or higher for preserved. A cutoff of 35 is an older device threshold, not the category boundary."),
  wrongs=[
    W("At 35 percent. A value of 39 percent is preserved", "Preserved starts at 50. Thirty-nine is still reduced."),
    W("At 50 percent. Anything under 50 is one category", "Under 50 contains both reduced and mildly reduced."),
    W("Only below 20 percent", "Twenty percent is not the definition."),
    W("The number does not matter if the patient can walk a block", "Walking distance describes symptoms. It does not redefine the ejection-fraction bands."),
  ])

A(72, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="physiology",
  takeaway="Right-sided ST elevation with an inferior tracing means right-ventricular infarction is suspected, and a nitrate drops preload that ventricle needs.",
  citation=ACS,
  scenario="A 65-year-old patient has ST-segment elevation in II, III, and aVF and in right-sided V4R. Blood pressure is 116/74 mm Hg. The lungs are clear and the neck veins are distended. A classmate gives nitroglycerin and asks why the pressure might fall even though it started above 90.",
  question="Which filling change explains the harm?",
  correct=W("A fall in right-ventricular preload, which this ventricle needs to keep output up",
            "The 2025 guideline says to avoid nitroglycerin when right-ventricular infarction is suspected. The reason is preload dependence: a nitrate reduces venous return, and output falls even if the first systolic pressure was above 90."),
  wrongs=[
    W("A rise in left-ventricular afterload", "A nitrate does not raise afterload. The problem is less preload."),
    W("Pulmonary edema from fluid overload", "The lungs are clear. This is not a fluid-overload picture."),
    W("A nitrate is harmful only after systolic pressure is already under 70", "Suspected right-ventricular infarction is its own reason, separate from a pressure under 90."),
    W("Preload must be lowered further to help the right ventricle", "The direction is to protect preload, not to reduce it more."),
  ])

A(73, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=2, subject="physiology",
  takeaway="The treatment goal for adults is blood pressure below 130/80 mm Hg. Below 140/90 is the older, looser target.",
  citation=HTN,
  scenario="A 55-year-old patient with treated hypertension has an average pressure of 136/84 mm Hg and no limited life expectancy. A classmate says the goal has been met because both numbers are under 140/90.",
  question="Has the goal been met?",
  correct=W("No. The goal is below 130/80 mm Hg",
            "The 2025 guideline sets the overarching goal below 130/80 for adults. Under 140/90 was the looser target. 136/84 has not reached the current goal."),
  wrongs=[
    W("Yes. Under 140/90 meets the current goal", "140/90 is not the 2025 goal."),
    W("The goal is under 120/70 for every adult, so 136/84 is halfway", "The stated goal is below 130/80, not below 120/70."),
    W("Goals apply only under age 50", "Age 55 does not retire the goal."),
    W("Diastolic pressure under 90 is the only number that counts", "Both 130 and 80 are part of the goal."),
  ])

A(74, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=2, subject="physiology",
  takeaway="Albuminuria category and filtration category are read together. A normal creatinine does not assign a filtration category.",
  citation=KDIGO,
  scenario="A 57-year-old patient with diabetes has a creatinine of 0.9 mg/dL. No estimated filtration rate and no urine albumin are recorded. A classmate charts 'CKD stage G1, no albuminuria' from the creatinine alone.",
  question="Why is that chart note not yet supported?",
  correct=W("Neither the filtration category nor the albumin category has been measured",
            "KDIGO 2024 stages CKD with eGFR and urine albumin together. A creatinine of 0.9 does not equal G1, and it says nothing about albuminuria."),
  wrongs=[
    W("A creatinine under 1.0 is always G1 with no albuminuria", "Category G and category A are separate measurements."),
    W("The note is complete because diabetes cancels the need for albumin", "Diabetes is a reason to measure albumin, not a reason to skip it."),
    W("G1 can be assigned only after dialysis starts", "G1 is the highest filtration category, not a dialysis stage."),
    W("Urine albumin replaces the need for any filtration estimate", "Both are required. One does not replace the other."),
  ])

A(75, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="An SGLT2 inhibitor for type 2 diabetes with CKD can be started at an eGFR of at least 20 and continued down to dialysis. The start line and the stop line are not the same.",
  citation=ADA,
  scenario="A 70-year-old patient with type 2 diabetes has an eGFR of 26 mL/min/1.73 m2 and an albumin-to-creatinine ratio of 500 mg/g. He has never taken an SGLT2 inhibitor. A classmate says the drug cannot be started below 45 and cannot be started below 30.",
  question="Can an SGLT2 inhibitor be started at an eGFR of 26?",
  correct=W("Yes. The kidney indication allows a start at or above 20",
            "ADA 2026 recommends an SGLT2 inhibitor for type 2 diabetes with CKD at an eGFR of at least 20, and says it can continue until dialysis. The do-not-start line of 45 belongs to metformin, not to this drug. The glucose effect is smaller below 45. The kidney reason remains."),
  wrongs=[
    W("No. Nothing renoprotective is started below 45", "That line is the metformin initiation limit, misapplied here."),
    W("No. The floor for a new start is 30", "The SGLT2 floor for this indication is 20, not 30."),
    W("Yes, but only if metformin is started the same day", "Metformin is contraindicated at an eGFR of 26."),
    W("Yes, and it must be stopped the first day eGFR is rechecked", "Continuation is expected. A routine recheck is not a stop signal."),
  ])

A(76, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=2, subject="pharmacology",
  takeaway="Systemic corticosteroids for a moderate COPD exacerbation are limited to about 5 days because longer courses add harm without a requirement in the current report.",
  citation=GOLD,
  scenario="A 71-year-old patient with a moderate COPD exacerbation is prescribed prednisone. A classmate writes 14 days because 'steroids need two weeks to work on inflamed airways.' The respiratory rate is 24/min and the radiograph is clear.",
  question="Why is 14 days longer than the recommendation?",
  correct=W("The recommended course is up to 5 days. Longer treatment adds adverse effects the report does not require",
            "GOLD 2026 recommends systemic corticosteroids for up to 5 days in moderate or severe exacerbations. Airway inflammation is the reason for the drug. It is not a reason to double the duration."),
  wrongs=[
    W("Fourteen days is the minimum effective course", "Five days is the recommended upper duration, not a minimum of 14."),
    W("Corticosteroids are not used if the radiograph is clear", "A clear radiograph does not cancel a moderate exacerbation."),
    W("The course is 5 days only when an antibiotic is also given", "The corticosteroid duration does not depend on whether an antibiotic was added."),
    W("Inhaled corticosteroids for 14 days replace the systemic course", "The exacerbation recommendation is a systemic corticosteroid."),
  ])

A(77, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="Blood eosinophils, not neutrophils, are the count GOLD uses when deciding whether an inhaled corticosteroid is likely to help after an exacerbation.",
  citation=GOLD,
  scenario="A 73-year-old patient is ready for discharge after a COPD exacerbation. The white-cell count shows neutrophils at 70 percent and eosinophils at 40 cells per microliter. A classmate adds an inhaled corticosteroid because the neutrophil percent is high.",
  question="Which count is the corticosteroid biomarker?",
  correct=W("The eosinophil count. Forty cells per microliter is not an elevated signal for adding the corticosteroid",
            "GOLD 2026 links inhaled-corticosteroid benefit after an exacerbation to elevated blood eosinophils. A neutrophil percent of 70 is a common differential finding. It is not that biomarker."),
  wrongs=[
    W("The neutrophil percent. Above 60 percent is the indication", "Neutrophils are not the count the report uses for this decision."),
    W("Either cell line, because both are white cells", "The recommendation is specific to eosinophils."),
    W("Eosinophils, and 40 cells per microliter is already high enough to add the drug", "Forty is a low count. The corticosteroid argument needs an elevated count."),
    W("No differential matters. Every exacerbation gets an inhaled corticosteroid", "A low eosinophil count is a reason not to add it automatically."),
  ])

A(78, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=2, subject="pathology",
  takeaway="Severe-range blood pressure is a systolic value of at least 160 or a diastolic value of at least 110, confirmed as persistent.",
  citation=ACOG,
  scenario="A 28-year-old patient at 30 weeks has one blood pressure of 148/96 mm Hg and a second, 15 minutes later, of 144/92 mm Hg. A classmate calls both readings severe-range and prepares intravenous antihypertensives.",
  question="Do these readings meet the severe-range threshold?",
  correct=W("No. Severe-range is at least 160 systolic or at least 110 diastolic",
            "ACOG uses 160 and 110 for severe-range pressure, persistent on repeat measurement. 148/96 and 144/92 are high. They are not severe-range, so the intravenous severe-hypertension pathway is not the one these numbers open."),
  wrongs=[
    W("Yes. Any value above 140/90 is severe-range", "140/90 is the threshold for hypertension in pregnancy, not for severe-range pressure."),
    W("Yes, because two readings were done", "Repeating the reading matters, but both readings still have to cross 160 or 110."),
    W("No reading is severe-range unless it exceeds 200", "200 is not the threshold. 160 and 110 are."),
    W("Diastolic pressure must exceed 110 and systolic pressure must exceed 160 at the same time", "The definition is or, not and."),
  ])

A(79, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=3, subject="pharmacology",
  takeaway="In CKD stage 3 or higher, probenecid is not the preferred urate-lowering drug. Allopurinol or febuxostat is preferred over probenecid.",
  citation=ACR,
  scenario="A 67-year-old patient has an estimated filtration rate of 38 mL/min/1.73 m2, a urate of 8.8 mg/dL, and repeated attacks. A classmate chooses probenecid because it increases urate excretion and says excretion is safer than lowering production when the kidneys are reduced.",
  question="Why is probenecid the wrong first drug?",
  correct=W("At this filtration rate, allopurinol or febuxostat is preferred over probenecid",
            "The 2020 guideline strongly prefers allopurinol first in CKD stage 3 or higher, and specifically prefers allopurinol or febuxostat rather than probenecid. Reduced kidney function is a reason probenecid works less well, not a reason to choose it."),
  wrongs=[
    W("Probenecid is preferred once the filtration rate is under 60", "The preference runs the other way."),
    W("Probenecid and allopurinol are equal first choices in CKD", "They are not equal. Allopurinol is the preferred first drug."),
    W("No urate-lowering drug is allowed under a filtration rate of 60", "CKD stage 3 is a group in which allopurinol is still first-line."),
    W("Pegloticase is preferred over both", "Pegloticase is not first-line."),
  ])

A(80, system="blood-lymph-immune", weight=11, topic="antibiotic-mechanisms", domain="blood-lymph-immune", diff=3, subject="microbiology",
  takeaway="A standard 10-day vancomycin course is what the 2021 update suggests moving away from for a first recurrence. The suggested drug is fidaxomicin.",
  citation=CDI,
  scenario="A 69-year-old patient has a first recurrence of toxin-positive diarrhea, a soft abdomen, and a stable creatinine. Fidaxomicin is on the shelf. A classmate says a recurrence should get the identical 10-day vancomycin course because the first course 'almost worked.'",
  question="What does a first recurrence change?",
  correct=W("Fidaxomicin is suggested rather than repeating a standard 10-day vancomycin course",
            "The 2021 IDSA/SHEA update makes that suggestion for recurrence. A tapered vancomycin course is an acceptable alternative, not the preferred suggestion. Repeating the identical course ignores the update."),
  wrongs=[
    W("Repeat the identical 10-day course. Recurrence does not change the drug", "Recurrence is the situation in which the update prefers fidaxomicin."),
    W("Switch to metronidazole", "Metronidazole is not the suggested drug for recurrence."),
    W("Use intravenous vancomycin", "The vancomycin product, if used, is oral."),
    W("No antibiotic, because a recurrence means antibiotics have failed as a class", "A recurrence is still treated."),
  ])

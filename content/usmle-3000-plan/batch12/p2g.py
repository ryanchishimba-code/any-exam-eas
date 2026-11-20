"""Step 2 items 66-100. Decisions not used in items 1-65."""

from lib import s2

ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
CDC = "CDC Sexually Transmitted Infections Treatment Guidelines, 2021."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s2(n, **k))

A(66, system="msk-skin", weight=9, topic="gout-crystals", domain="msk-skin", diff=3, subject="rheumatology",
  takeaway="Allopurinol is the preferred first urate-lowering drug, including in CKD stage 3 or worse. Probenecid and pegloticase are not the first choice.",
  citation=ACR,
  scenario="A 64-year-old patient has had three attacks of a hot, red first toe in the past year. The toe is cool today. Serum urate is 8.6 mg/dL and the estimated filtration rate is 40 mL/min/1.73 m2. A colleague avoids allopurinol because filtration is reduced and prescribes probenecid, with pegloticase if that fails once.",
  question="Which urate-lowering drug is first?",
  correct=W("Allopurinol, started at a low dose",
            "The 2020 ACR guideline strongly recommends allopurinol first, including in CKD stage 3 or higher, and recommends against pegloticase as first-line therapy. A low starting dose is how hypersensitivity risk is reduced."),
  wrongs=[
    W("Probenecid, because allopurinol is contraindicated below a filtration rate of 60", "In CKD stage 3 or higher the guideline prefers allopurinol or febuxostat over probenecid."),
    W("Pegloticase as the first prescription", "Pegloticase is strongly recommended against as first-line therapy."),
    W("No urate-lowering drug, because the toe is cool today", "The indication is the recurrent attacks, not the temperature of the toe today."),
    W("Allopurinol 800 mg on the first day", "The preferred drug is allopurinol, but the first dose is low, not the labeled maximum."),
  ])

A(67, system="msk-skin", weight=9, topic="gout-crystals", domain="msk-skin", diff=2, subject="rheumatology",
  takeaway="A flare is treated first with low-dose colchicine, an NSAID, or a glucocorticoid. An IL-1 inhibitor is not first-line, and hourly high-dose colchicine is not the regimen.",
  citation=ACR,
  scenario="A 52-year-old patient woke with a hot, swollen first toe and cannot bear weight. The estimated filtration rate is 78 mL/min/1.73 m2, he has no ulcer history, and he takes no interacting drug. A colleague orders an IL-1 inhibitor, or hourly colchicine if the infusion is denied.",
  question="Which flare treatment matches a patient who can take the first-line drugs?",
  correct=W("Low-dose colchicine, 1.2 mg then 0.6 mg one hour later, or an NSAID, or a glucocorticoid",
            "The 2020 guideline strongly recommends those three over an IL-1 inhibitor and does not rank them against each other. The colchicine dose is 1.2 mg once, then 0.6 mg one hour later."),
  wrongs=[
    W("An IL-1 inhibitor as the first drug", "An IL-1 inhibitor is for when the first-line drugs cannot be used, which is not this patient."),
    W("Hourly high-dose colchicine until the pain stops", "Hourly high-dose colchicine is the regimen the guideline rejected in favor of the low-dose schedule."),
    W("Allopurinol alone, with no anti-inflammatory drug", "A urate-lowering drug does not treat the pain of the acute attack by itself."),
    W("Antibiotics for the red toe and no anti-inflammatory drug", "A single hot first toe in this pattern is not treated as bacterial infection first."),
  ])

A(68, system="msk-skin", weight=9, topic="gout-crystals", domain="msk-skin", diff=3, subject="rheumatology",
  takeaway="When urate-lowering therapy is indicated, it may start during a flare, and anti-inflammatory prophylaxis continues for at least 3 months.",
  citation=ACR,
  scenario="A 70-year-old patient is on day 1 of a hot first-toe attack. He has had four attacks this year, last month's urate was 9.4 mg/dL, and the estimated filtration rate is 55 mL/min/1.73 m2. A colleague will treat the pain but will not start allopurinol until the toe is cool, and plans only one week of prophylaxis later.",
  question="When can allopurinol start, and for how long is prophylaxis given?",
  correct=W("During this flare, with anti-inflammatory prophylaxis for at least 3 months",
            "The 2020 guideline conditionally recommends starting indicated urate-lowering therapy during a flare, and strongly recommends prophylaxis for at least 3 months rather than one week."),
  wrongs=[
    W("Only after the toe is cool, with prophylaxis for 7 days", "Waiting for a cool toe and stopping prophylaxis at a week are both contrary to the guideline."),
    W("Never, because more than one attack a year prohibits urate-lowering therapy", "Frequent attacks are a reason to start, not a prohibition."),
    W("During the flare, with no prophylaxis", "Starting during the flare is paired with anti-inflammatory coverage."),
    W("Pegloticase during the flare instead of allopurinol", "Pegloticase is not first-line therapy, including when the flare is the moment treatment starts."),
  ])

A(69, system="msk-skin", weight=9, topic="gout-crystals", domain="msk-skin", diff=3, subject="rheumatology",
  takeaway="Before allopurinol, test HLA-B*5801 in a patient of Korean ancestry. The test is not a general requirement for every ancestry.",
  citation=ACR,
  scenario="A 57-year-old patient whose parents were born in Korea is about to start allopurinol after repeated hot first-toe attacks. The estimated filtration rate is 62 mL/min/1.73 m2. A colleague says genetic testing before allopurinol is never useful.",
  question="Which genetic step comes before the first allopurinol tablet?",
  correct=W("HLA-B*5801 testing",
            "The 2020 guideline conditionally recommends that test before allopurinol for Korean, Han Chinese, Thai, or African American patients. A positive result changes the drug because of hypersensitivity risk."),
  wrongs=[
    W("No test. Ancestry does not change allopurinol safety testing", "Korean ancestry is one of the groups the guideline includes. The 'no routine testing' statement applies to other groups."),
    W("HLA-B27 testing", "HLA-B27 is unrelated to allopurinol hypersensitivity."),
    W("Thiopurine methyltransferase testing", "That enzyme test belongs to thiopurines, not allopurinol."),
    W("Glucose-6-phosphate dehydrogenase testing as the allopurinol pretest", "G6PD testing is not the pretest named in the gout guideline."),
  ])

A(70, system="msk-skin", weight=9, topic="gout-crystals", domain="msk-skin", diff=3, subject="rheumatology",
  takeaway="A first flare with urate under 9 mg/dL, no CKD stage 3, and no stones is not by itself a reason to start urate-lowering therapy.",
  citation=ACR,
  scenario="A 45-year-old patient has his first hot first-toe attack, now resolving. Serum urate is 7.2 mg/dL. The estimated filtration rate is 95 mL/min/1.73 m2. He has never had a kidney stone. A colleague starts allopurinol 300 mg and plans never to change that dose.",
  question="Which urate-lowering decision matches a first attack and these numbers?",
  correct=W("Do not start allopurinol for this first attack",
            "The 2020 guideline conditionally recommends against starting after a first flare when there is no CKD stage 3 or worse, no urate above 9 mg/dL, and no stones. A fixed 300 mg dose would also skip titration if treatment were indicated later."),
  wrongs=[
    W("Start allopurinol 300 mg and do not change the dose", "There is no indication to start, and a frozen 300 mg dose is not how the drug is used when it is indicated."),
    W("Start pegloticase after this first attack", "Pegloticase is not first-line, and a first uncomplicated flare is not an indication for any urate-lowering drug."),
    W("Start probenecid at a fixed dose with no urate target", "Probenecid is not preferred, and there is no indication to start either drug."),
    W("Start allopurinol only because the urate is already below 6 mg/dL", "The urate is 7.2, not below 6, and a low urate is not the trigger he is missing."),
  ])

A(71, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="cardiology",
  takeaway="The blood-pressure goal for an otherwise healthy older adult is still below 130/80 mm Hg. A goal of 150/90 is outdated.",
  citation=HTN,
  scenario="A 78-year-old patient lives independently, has no dementia, and is not in a facility. On two drugs the average pressure is 148/86 mm Hg. He does not get dizzy when he stands. A colleague calls 148/86 acceptable because the goal after age 75 is under 150/90.",
  question="What is the treatment goal?",
  correct=W("Below 130/80 mm Hg",
            "The 2025 guideline sets that goal for adults, with extra caution only for limited life expectancy or institutional care. Neither applies. The 150/90 figure is the retired target."),
  wrongs=[
    W("Under 150/90 mm Hg, because age over 75 relaxes the goal", "Age alone does not move the goal to 150/90."),
    W("Below 120/70 mm Hg, pushing doses until he is lightheaded", "The goal is below 130/80, not a push that causes standing hypotension."),
    W("No goal. Stop both drugs at age 78", "Age alone is not a reason to stop treatment while the pressure is above the goal."),
    W("Below 160/100 mm Hg only", "160/100 is a prompt-treatment range, not the long-term goal."),
  ])

A(72, system="respiratory-renal", weight=8, topic="aki-ckd-electrolytes", domain="respiratory-renal", diff=3, subject="nephrology",
  takeaway="Diabetes plus an albumin-to-creatinine ratio of at least 30 mg/g is treated with an ACE inhibitor or an ARB, not with both and not only after the ratio exceeds 300.",
  citation=HTN,
  scenario="A 59-year-old patient has diabetes and an average blood pressure of 138/86 mm Hg. The urine albumin-to-creatinine ratio is 80 mg/g and the estimated filtration rate is 72 mL/min/1.73 m2. Potassium is 4.3 mEq/L. He takes amlodipine only. A colleague adds a thiazide and says a renin-angiotensin drug waits for a ratio above 300.",
  question="Which drug class does the albumin ratio require?",
  correct=W("An ACE inhibitor or an ARB, not both",
            "The 2025 guideline recommends one of those drugs when diabetes is accompanied by albuminuria of at least 30 mg/g. A ratio of 80 qualifies. The pressure is also above 130/80 in diabetes, so medication is indicated."),
  wrongs=[
    W("A thiazide only, because an ACE inhibitor waits for a ratio above 300", "Thirty, not 300, is the albuminuria threshold for the class."),
    W("An ACE inhibitor and an ARB together", "Dual blockade is not the recommendation."),
    W("A nonsteroidal anti-inflammatory drug", "That class worsens kidney perfusion and blood pressure."),
    W("No change, because the filtration rate is above 60", "A filtration rate of 72 does not cancel an albumin ratio of 80."),
  ])

A(73, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="cardiology",
  takeaway="A potassium-based salt substitute is avoided in chronic kidney disease, where the potassium can rise.",
  citation=HTN,
  scenario="A 73-year-old patient has an estimated filtration rate of 25 mL/min/1.73 m2 and a potassium of 4.8 mEq/L. He wants to replace table salt. A colleague recommends a potassium chloride salt substitute and says no laboratory follow-up is needed.",
  question="Why is that substitute the wrong advice?",
  correct=W("Avoid the potassium substitute because the filtration rate is 25",
            "The 2025 guideline allows a potassium-based substitute except in CKD or with drugs that reduce potassium excretion. An eGFR of 25 is that exception, and 4.8 mEq/L is already near the top of the range. He can still cut sodium."),
  wrongs=[
    W("The substitute is appropriate, and potassium does not need to be checked in CKD", "CKD is the exception, not a setting for unmonitored potassium salt."),
    W("Use the substitute, but only if a nonsteroidal drug is added", "A nonsteroidal drug does not make a potassium salt safe in advanced kidney disease."),
    W("The substitute is required for every adult with hypertension", "It is an option, not a requirement, and CKD is the exception."),
    W("Stop the blood-pressure drugs so the substitute can be used", "Drugs are not stopped to make a salt substitute safe."),
  ])

A(74, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=2, subject="cardiology",
  takeaway="An ejection fraction of 40 percent or lower is reduced. An ejection fraction of 38 percent is not preserved, and disease-modifying therapy is not delayed until the number falls below 30.",
  citation=HF,
  scenario="A 66-year-old patient is short of breath on one flight of stairs. The ejection fraction is 38 percent and he takes no heart-failure drug. A colleague says 38 percent is close enough to 40 to call the ventricle preserved, and that no disease-modifying drug is indicated until the number falls below 30.",
  question="Which category is an ejection fraction of 38 percent?",
  correct=W("Reduced, so disease-modifying therapy is indicated now",
            "The 2022 guideline defines reduced ejection fraction as 40 percent or lower. Mildly reduced is 41 to 49, and preserved is 50 or higher. Waiting for 30 percent withholds therapy."),
  wrongs=[
    W("Preserved, so drugs wait until the ejection fraction is under 30 percent", "Thirty-eight is already reduced. Thirty is not the definition."),
    W("Mildly reduced, because any number under 50 is that category", "Mildly reduced ejection fraction starts above 40 percent, so 38 percent is not in that band."),
    W("Improved, because 38 is higher than 20", "Improved requires a previous value of 40 or lower and a later value above 40."),
    W("Normal, because symptoms rather than the number define the category", "Symptoms show he is limited. The category is defined by the ejection fraction."),
  ])

A(75, system="cardiovascular", weight=9, topic="chf-management", domain="cardiovascular", diff=3, subject="cardiology",
  takeaway="In HFpEF, an SGLT2 inhibitor can be beneficial. Routine nitrates are class 3, no benefit.",
  citation=HF,
  scenario="A 74-year-old patient has dyspnea on exertion. The ejection fraction is 60 percent, the left atrium is enlarged, and the natriuretic peptide is high. Blood pressure is 128/74 mm Hg on an ACE inhibitor. There is no pulmonary hypertension. A colleague starts a daily nitrate and says an SGLT2 inhibitor is only for an ejection fraction under 40.",
  question="Which drug statement matches an ejection fraction of 60 percent?",
  correct=W("An SGLT2 inhibitor can be beneficial, and a nitrate is not routine therapy",
            "The 2022 guideline gives routine nitrates a class 3, no-benefit rating in HFpEF and an SGLT2 inhibitor a class 2a recommendation. Preserved function is 50 percent or higher. The SGLT2 recommendation is not class 1 and is not limited to an ejection fraction under 40."),
  wrongs=[
    W("A nitrate is routine therapy, and an SGLT2 inhibitor is not used above an ejection fraction of 40", "That reverses both the class 3 nitrate rating and the class 2a SGLT2 rating."),
    W("A PDE-5 inhibitor is first-line because the atrium is enlarged", "Atrial enlargement supports the diagnosis. It is not an indication for a PDE-5 inhibitor, which is also class 3 as routine therapy."),
    W("Stop the ACE inhibitor and start a nitrate", "Blood-pressure treatment remains appropriate. Replacing it with a nitrate is the class 3 error."),
    W("Digoxin loading is required before any other drug", "Digoxin loading is not the HFpEF recommendation."),
  ])

"""Step 1 items 41-70."""

from lib import s1

ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
CDI = "IDSA/SHEA 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(41, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=2, subject="pharmacology",
  takeaway="The lipid drug indicated for every acute coronary syndrome inhibits HMG-CoA reductase. A fibrate does not.",
  citation=ACS,
  scenario="A 56-year-old patient had stenting this morning for chest pain with ST-segment elevation. No LDL cholesterol is back. A classmate asks which enzyme the indicated lipid drug blocks, and offers a fibrate as if it shared that enzyme.",
  question="Which enzyme does the indicated lipid drug inhibit?",
  correct=W("HMG-CoA reductase, the target of a high-intensity statin",
            "The 2025 ACS guideline recommends high-intensity statin therapy for every acute coronary syndrome, without waiting for LDL cholesterol. Statins inhibit HMG-CoA reductase. A fibrate is not that drug and does not inhibit that enzyme."),
  wrongs=[
    W("Pancreatic lipase, the target of a fibrate", "Fibrates are not the indicated class, and lipase is not their target either."),
    W("Angiotensin-converting enzyme", "That enzyme is the target of a different drug class, not the lipid drug."),
    W("Cyclooxygenase", "Cyclooxygenase is the aspirin target. It is not the lipid-drug target."),
    W("Xanthine oxidase", "Xanthine oxidase is the allopurinol target, unrelated to this lipid indication."),
  ])

A(42, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=2, subject="pharmacology",
  takeaway="Allopurinol, the preferred first urate-lowering drug, inhibits xanthine oxidase. A low starting dose is how hypersensitivity risk is reduced.",
  citation=ACR,
  scenario="A 63-year-old patient with CKD stage 3 and repeated hot first-toe attacks is starting the preferred urate-lowering drug. Urate is 8.4 mg/dL. A classmate asks which enzyme that drug blocks, and suggests beginning at the maximum labeled dose.",
  question="Which enzyme, and which starting dose, match the preferred drug?",
  correct=W("Xanthine oxidase, with a low starting dose rather than the maximum",
            "The 2020 ACR guideline prefers allopurinol, including in CKD stage 3 or higher. Allopurinol inhibits xanthine oxidase. The same guideline uses a low start to reduce hypersensitivity risk, then titrates."),
  wrongs=[
    W("HMG-CoA reductase, started at the maximum dose", "That is a statin enzyme, and the maximum dose is the wrong start."),
    W("Cyclooxygenase, started at a low dose", "Cyclooxygenase blockade is an NSAID effect, not how urate is lowered long term."),
    W("Xanthine oxidase, but only if the first dose is 800 mg", "The enzyme is right and the first dose is wrong. Eight hundred milligrams is a ceiling, not a start."),
    W("Monoamine oxidase", "Monoamine oxidase is unrelated to urate production."),
  ])

A(43, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=2, subject="pharmacology",
  takeaway="Low-dose colchicine is preferred because efficacy is similar and adverse effects are fewer. The cellular target is the microtubule.",
  citation=ACR,
  scenario="A 51-year-old patient has an acute hot first toe, a normal filtration rate, and no interacting drugs. A classmate asks why the flare dose is 1.2 mg followed by 0.6 mg, not hourly tablets, and what structure in the neutrophil the drug disrupts.",
  question="Which pairing is right?",
  correct=W("Microtubules are disrupted, and the low dose is preferred because adverse effects are fewer at similar efficacy",
            "The 2020 guideline strongly prefers low-dose colchicine over high-dose hourly colchicine for that reason. Colchicine blocks microtubule assembly, which limits neutrophil migration. The cellular target explains the drug. It does not justify the old hourly schedule."),
  wrongs=[
    W("Cell-wall synthesis is blocked, so hourly dosing is safer", "Colchicine does not inhibit a cell wall, and hourly dosing is the rejected schedule."),
    W("Microtubules are disrupted, so the hourly high dose is preferred", "The target is right and the schedule is wrong."),
    W("Cyclooxygenase is blocked, which is why the dose is a single 1.2 mg with no follow-up tablet", "The follow-up 0.6 mg tablet is part of the labeled low-dose regimen. Cyclooxygenase is not the target."),
    W("Ribosomes are frozen, which is why ice can replace the drug", "Ribosomes are not the target, and ice is only an adjunct."),
  ])

A(44, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="The early fall in filtration after an SGLT2 inhibitor is a reversible hemodynamic change, not tubular necrosis.",
  citation=KDIGO,
  scenario="A 68-year-old patient started an SGLT2 inhibitor 10 days ago. Creatinine rose from 1.3 to 1.5 mg/dL. Urine output is normal, there are no muddy-brown casts, and he is drinking. Blood pressure is 124/72 mm Hg. A classmate calls the rise acute tubular necrosis and stops the drug.",
  question="What is the rise?",
  correct=W("A reversible hemodynamic fall in filtration, not tubular necrosis",
            "KDIGO 2024 says the early decrease is generally reversible and is not a reason to stop the drug. Normal urine output and absent muddy-brown casts fit a hemodynamic change. Tubular necrosis is a different injury."),
  wrongs=[
    W("Acute tubular necrosis, because any creatinine rise is tubular cell death", "A small early rise without casts or oliguria is the pattern the practice point calls reversible."),
    W("Allergic interstitial nephritis, which always appears in the first 10 days of this drug", "Nothing in the urine or the timing establishes interstitial nephritis."),
    W("Obstruction, because an SGLT2 inhibitor precipitates in the ureter", "Ureteral precipitation is not the mechanism of the early filtration dip."),
    W("A laboratory error that should be ignored without a repeat creatinine", "The rise should be recognized as the expected hemodynamic effect, not dismissed as an error and not treated as necrosis."),
  ])

A(45, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pathology",
  takeaway="Suspected cardiac amyloid is tested for a monoclonal light chain first. Bone scintigraphy comes after that test is negative.",
  citation=HF,
  scenario="A 76-year-old patient has thick ventricular walls, low-voltage QRS complexes, and heart failure. A classmate orders a bone-avid scan as the first test and says a serum light-chain assay can wait until the scan is done.",
  question="Which test comes first?",
  correct=W("A monoclonal light-chain assay, with scintigraphy only if that assay is negative",
            "The 2022 heart-failure guideline says patients with suspected amyloid undergo screening for monoclonal light chains, and bone scintigraphy if that screen is negative, to look for transthyretin amyloid. Scanning first can misread a plasma-cell disorder."),
  wrongs=[
    W("Scintigraphy first, because light chains do not change the scan", "A monoclonal protein changes how the scan is interpreted. The blood test comes first."),
    W("Endomyocardial biopsy as the first outpatient test in every thick-walled heart", "Biopsy is not the first screen the guideline names."),
    W("A statin, because thick walls are only untreated cholesterol", "Low voltage with thick walls is not a statin diagnosis."),
    W("No testing if the ejection fraction is above 40 percent", "Amyloid can present with preserved ejection fraction. The wall thickness and voltage still need the work-up."),
  ])

A(46, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Tafamidis is recommended for selected patients with wild-type or variant transthyretin amyloid cardiomyopathy to reduce cardiovascular morbidity and mortality.",
  citation=HF,
  scenario="A 79-year-old patient has heart failure, a negative monoclonal light-chain assay, and a bone-avid scan read as transthyretin amyloid. A classmate says no disease-modifying drug exists for that protein and offers only a diuretic.",
  question="Which drug does the heart-failure guideline recommend for selected patients with this protein?",
  correct=W("Tafamidis for selected transthyretin amyloid cardiomyopathy",
            "The 2022 guideline gives tafamidis a class 1 recommendation in selected patients with wild-type or variant transthyretin amyloid cardiomyopathy. A diuretic treats congestion. It does not replace that disease-modifying drug."),
  wrongs=[
    W("No disease-modifying drug exists, so a diuretic is the whole plan", "Tafamidis is the disease-modifying drug the guideline names."),
    W("Digoxin loading as the disease-modifying therapy", "Digoxin is not the transthyretin stabilizer."),
    W("A statin at high intensity, because amyloid is a cholesterol plaque", "Amyloid cardiomyopathy is not a statin indication of that kind."),
    W("Pegloticase, because any infiltrative disease is treated by lowering urate", "Urate-lowering therapy does not stabilize transthyretin."),
  ])

A(47, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Anticoagulation is reasonable in cardiac amyloid with atrial fibrillation, even when the usual score would look low.",
  citation=HF,
  scenario="A 78-year-old patient has transthyretin amyloid cardiomyopathy and atrial fibrillation. The usual stroke score, ignoring the amyloid, would be low. A classmate withholds anticoagulation because the score is low and the ejection fraction is 55 percent.",
  question="What does the amyloid change about anticoagulation?",
  correct=W("Anticoagulation is reasonable to reduce stroke even if the ordinary score looks low",
            "The 2022 guideline says anticoagulation is reasonable, class 2a, in cardiac amyloid with atrial fibrillation. A preserved ejection fraction and a low ordinary score do not capture the atrial thrombus risk of amyloid."),
  wrongs=[
    W("Anticoagulation is prohibited because amyloid patients bleed from the gut", "The guideline's statement is that anticoagulation is reasonable, not prohibited."),
    W("Anticoagulation is useful only when the ejection fraction is under 30", "The recommendation is not limited to reduced ejection fraction."),
    W("Aspirin alone meets the recommendation", "The recommendation is anticoagulation, not aspirin monotherapy."),
    W("Cardioversion without anticoagulation is preferred", "The item is the stroke-prevention recommendation, not a license to cardiovert unprotected."),
  ])

A(48, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Significant closed-head trauma within 3 months is an absolute contraindication to fibrinolysis.",
  citation=ACS,
  scenario="A 60-year-old patient has had chest pain for 40 minutes with 2 mm of ST-segment elevation in V2 through V4. The catheterization laboratory is 3 hours away. Six weeks ago he had a fall with a significant closed-head injury and a normal follow-up examination now. A classmate gives a fibrinolytic because the neurologic examination today is normal.",
  question="Why is the fibrinolytic contraindicated?",
  correct=W("Significant head trauma within 3 months is an absolute contraindication",
            "The 2025 guideline lists significant head trauma or facial trauma within 3 months as an absolute contraindication. A normal examination today does not erase a significant injury six weeks ago. Transfer for PCI is the reperfusion path."),
  wrongs=[
    W("A normal examination today removes every trauma contraindication", "The contraindication is the recent significant injury, not the examination at this moment."),
    W("Head trauma counts only if it was within 48 hours", "The window in the guideline is 3 months."),
    W("Give the fibrinolytic at half dose because the injury was a fall", "There is no half-dose exception for recent significant head trauma."),
    W("Head trauma contraindicates transfer as well as fibrinolysis", "Transfer for PCI is appropriate. The contraindication is the lytic."),
  ])

A(49, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Active bleeding is an absolute contraindication to fibrinolysis.",
  citation=ACS,
  scenario="A 64-year-old patient has ST-segment elevation in II, III, and aVF and chest pain for one hour. He is vomiting bright red blood. Blood pressure is 100/64 mm Hg. The catheterization laboratory is 3 hours away. A classmate gives a fibrinolytic because the delay exceeds 120 minutes and the electrocardiogram meets criteria.",
  question="Which fact blocks the fibrinolytic?",
  correct=W("Active bleeding, which is an absolute contraindication",
            "The 2025 guideline lists active bleeding as an absolute contraindication. A long delay and ST elevation would otherwise favor fibrinolysis. They do not override ongoing hemorrhage. He needs resuscitation and a plan that does not include a lytic."),
  wrongs=[
    W("Nothing. A delay over 120 minutes overrides active bleeding", "No time threshold overrides this absolute contraindication."),
    W("Only bleeding into the brain counts as active bleeding", "Gastrointestinal bleeding that is happening now is active bleeding."),
    W("A hemoglobin that has not yet been drawn means bleeding is not real", "Bright red blood is the finding. A pending hemoglobin does not erase it."),
    W("Give the fibrinolytic after one unit of blood, because transfusion removes the contraindication", "Transfusion does not convert active bleeding into a safe lytic candidate."),
  ])

A(50, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="Increased sputum volume without a change to purulence does not by itself earn an antibiotic for a COPD exacerbation.",
  citation=GOLD,
  scenario="A 70-year-old patient with COPD has more dyspnea and a larger volume of still-white sputum. Temperature is 37.0 C, the respiratory rate is 20/min, and oxygen saturation is 93 percent. He is not being ventilated. A classmate starts an antibiotic because two symptoms changed, and says color does not matter.",
  question="Why is the antibiotic not indicated?",
  correct=W("The sputum is still white. Volume alone is not the purulence the antibiotic recommendation uses",
            "GOLD 2026 recommends antibiotics when sputum is purulent, when there is a qualifying infection history, or when ventilatory support is needed. More white sputum plus dyspnea does not meet that list."),
  wrongs=[
    W("Any two changed symptoms earn an antibiotic, whatever the color", "Color is the finding the current report uses. Two nonspecific changes are not enough."),
    W("White sputum is treated as purulent once the volume rises", "White and purulent are different findings."),
    W("An antibiotic replaces the bronchodilator when volume increases", "Bronchodilators are still the base of treatment. The antibiotic is the extra drug that is not indicated."),
    W("A normal temperature prohibits bronchodilators as well", "Temperature does not remove bronchodilator treatment."),
  ])

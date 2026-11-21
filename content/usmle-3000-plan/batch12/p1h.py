"""Step 1 items 81-100."""

from lib import s1

ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(81, system="cardiovascular", weight=9, topic="acs-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="Radial access is preferred for ACS PCI because it reduces bleeding, vascular complications, and death. The benefit is not cancelled by a closure device on the femoral artery.",
  citation=ACS,
  scenario="A 68-year-old patient is having PCI for an acute coronary syndrome. The right radial artery is patent. A classmate plans a femoral puncture with a closure device and says the device makes the two sites equivalent.",
  question="Which site does the guideline prefer?",
  correct=W("The radial artery. A femoral closure device is not listed as equivalent",
            "The 2025 ACS guideline recommends radial rather than femoral access to reduce bleeding, vascular complications, and death. A closure device is not described as erasing that difference."),
  wrongs=[
    W("The femoral artery, because a closure device removes the bleeding difference", "The guideline does not treat a closure device as equivalent to radial access."),
    W("Either site, because mortality is unaffected by access", "The recommendation cites a reduction in death as well as bleeding."),
    W("A brachial cutdown", "Surgical brachial access is not the default."),
    W("The radial artery only if the patient is in shock", "The preference applies to ACS PCI when the radial artery can be used. Shock is not the requirement."),
  ])

A(82, system="cardiovascular", weight=9, topic="heart-failure-pathophysiology", domain="cardiovascular", diff=3, subject="pharmacology",
  takeaway="An ARNI is preferred to an ACE inhibitor in symptomatic HFrEF because neprilysin inhibition adds natriuretic-peptide effect on top of angiotensin-receptor blockade.",
  citation=HF,
  scenario="A 58-year-old patient has an ejection fraction of 32 percent and is starting therapy. He has never taken an ACE inhibitor. A classmate asks what an angiotensin receptor-neprilysin inhibitor adds that an ACE inhibitor does not.",
  question="What extra mechanism does the preferred drug add?",
  correct=W("Neprilysin inhibition, which raises natriuretic peptides, plus angiotensin-receptor blockade",
            "The 2022 guideline prefers an ARNI when it is feasible. The added piece versus an ACE inhibitor or an ARB alone is neprilysin inhibition. An ACE inhibitor is used when an ARNI cannot be used, not because it has that extra mechanism."),
  wrongs=[
    W("Cyclooxygenase inhibition, as with an NSAID", "That is not the mechanism added by an angiotensin receptor-neprilysin inhibitor."),
    W("Neprilysin inhibition without any angiotensin effect", "The drug also blocks the angiotensin receptor. Both parts matter, and an ACE inhibitor is stopped so they are not overlapped."),
    W("Calcium-channel blockade", "An ARNI is not a calcium-channel blocker."),
    W("No extra mechanism. The preference is only a brand name", "The preference is the neprilysin-plus-receptor mechanism, not a label."),
  ])

A(83, system="cardiovascular", weight=9, topic="hypertension-mechanisms", domain="cardiovascular", diff=3, subject="physiology",
  takeaway="Resistant hypertension is screened for primary aldosteronism even when potassium is normal, because hypokalemia is absent in many cases.",
  citation=HTN,
  scenario="A 60-year-old patient has a blood pressure of 158/96 mm Hg on three drugs, including a diuretic. Potassium is 4.2 mEq/L. A classmate skips the aldosterone work-up and says a normal potassium excludes the diagnosis.",
  question="Why does a potassium of 4.2 not exclude the screen?",
  correct=W("Many patients with primary aldosteronism are not hypokalemic. Resistant hypertension is the indication",
            "The 2025 guideline recommends the screen in resistant hypertension whether or not hypokalemia is present. A potassium of 4.2 is not a negative test."),
  wrongs=[
    W("A normal potassium rules the diagnosis out", "That is the belief the recommendation was written to correct."),
    W("The screen is done only when potassium is above 5", "High potassium is not the entry criterion."),
    W("Resistant hypertension is defined only when potassium is below 3", "Resistance is about the pressure on multiple drugs, not the potassium."),
    W("A normal potassium means the diuretic dose should be stopped before any thought of aldosteronism", "The diuretic is part of the resistant-hypertension regimen. It is not stopped to avoid the screen."),
  ])

A(84, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=2, subject="physiology",
  takeaway="Race is not a variable in the current eGFR equation. Printing two estimates, one of them race-adjusted, is the outdated report.",
  citation=KDIGO,
  scenario="A 55-year-old patient has a creatinine of 1.4 mg/dL. The laboratory report lists a race-adjusted filtration estimate and a race-free one. A drug dose changes between them. A classmate uses the race-adjusted number because it is printed first.",
  question="Which estimate is the current standard?",
  correct=W("The race-free estimate",
            "KDIGO 2024 says race is not used in the eGFR equation. Print order does not make the adjusted number current."),
  wrongs=[
    W("The race-adjusted estimate, because it is printed first", "Order on a page is not the standard."),
    W("The average of the two estimates", "Averaging keeps race in the result."),
    W("Whichever estimate is higher", "Choosing the higher number to avoid a dose change is not the standard."),
    W("Neither. Creatinine alone is dosed as if filtration were 100", "The race-free estimate is used. It is not ignored."),
  ])

A(85, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=2, subject="pharmacology",
  takeaway="Metformin is not started below an eGFR of 45. Being above 30 only avoids the contraindication. It does not permit a new start.",
  citation=ADA,
  scenario="A 65-year-old patient has a new diagnosis of type 2 diabetes and an eGFR of 41 mL/min/1.73 m2. A classmate starts metformin because 41 is above 30.",
  question="Why is that start outside the labeling the standards use?",
  correct=W("New starts are not recommended below 45, even though the contraindication is below 30",
            "ADA 2026 separates the two lines. An eGFR of 41 is under 45, so metformin is not initiated. It is not yet in the contraindicated range below 30."),
  wrongs=[
    W("Any eGFR above 30 is a permitted new start", "That collapses two different thresholds."),
    W("Metformin is contraindicated below 45", "Below 45 is do-not-start. The contraindication is below 30."),
    W("The dose is doubled below 45 to overcome reduced absorption", "Exposure rises as filtration falls. The dose is not increased."),
    W("An eGFR of 41 requires insulin and forbids every oral drug", "Other classes, including an SGLT2 inhibitor when the kidney indication is met, are not forbidden."),
  ])

A(86, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pathology",
  takeaway="Platelets below 100,000 per microliter are a severe feature even when blood pressure is only modestly elevated.",
  citation=ACOG,
  scenario="A 31-year-old patient at 29 weeks has a blood pressure of 146/94 mm Hg and a platelet count of 88,000. Creatinine and liver enzymes are normal, and she has no headache. A classmate says the platelet count is irrelevant unless the pressure is at least 160/110.",
  question="Is the platelet count a severe feature?",
  correct=W("Yes. Below 100,000 is a severe feature on its own",
            "ACOG lists thrombocytopenia below 100,000 as a severe feature. It does not require severe-range pressure at the same time. 146/94 is hypertension. The platelet count is the severe feature."),
  wrongs=[
    W("No. Platelets count only when pressure is at least 160/110", "The features are independent. One is enough."),
    W("No. The platelet cutoff is 50,000", "The cutoff in the bulletin is 100,000 per microliter, so 88,000 already qualifies."),
    W("Yes, but only if the creatinine is also above 1.1", "Each laboratory severe feature stands alone."),
    W("A count of 88,000 is normal in the third trimester", "Normal pregnancy does not drop platelets to 88,000 as a benign finding in this definition."),
  ])

A(87, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=2, subject="pharmacology",
  takeaway="The serum urate target used to titrate therapy is below 6 mg/dL. A value of 7.5 on treatment is not at target.",
  citation=ACR,
  scenario="A 62-year-old patient takes allopurinol and has a serum urate of 7.5 mg/dL. Attacks are continuing. A classmate calls 7.5 a success because it is under 8.",
  question="Is 7.5 mg/dL the target?",
  correct=W("No. The target is below 6 mg/dL, so the dose is titrated",
            "The 2020 guideline recommends treat-to-target titration rather than a fixed dose, using a serum urate below 6 mg/dL. Under 8 is not that target."),
  wrongs=[
    W("Yes. Under 8 mg/dL is the target", "The target used for titration is below 6."),
    W("The target is below 2 mg/dL", "Driving urate that low is not the recommendation."),
    W("No target is used. The dose stays wherever it started", "The guideline recommends titration to a target, not a frozen dose."),
    W("The target applies only if the filtration rate is above 90", "CKD does not retire the urate target."),
  ])

A(88, system="respiratory-renal", weight=13, topic="asthma-copd-pathology", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="Noninvasive ventilation for COPD is used when acute hypercapnia is making the patient acidemic and the airway is still protected.",
  citation=GOLD,
  scenario="A 68-year-old patient with COPD has a respiratory rate of 30/min, a pH of 7.27, and a PaCO2 of 68 mm Hg. He swallows and localizes pain. Oxygen saturation is 90 percent on 2 liters. A classmate says a mask ventilator is only for patients whose pH is below 7.00.",
  question="Does this pH qualify for noninvasive ventilation?",
  correct=W("Yes. A pH of 7.27 with a high PaCO2 is acute hypercapnic failure, and he is still protecting the airway",
            "GOLD 2026 indicates noninvasive ventilation for that failure because it improves gas exchange and reduces intubation. The threshold is not a pH below 7.00. A protected airway means the mask is tried before a tube."),
  wrongs=[
    W("No. The pH must be below 7.00", "7.27 is already acidemic hypercapnic failure."),
    W("No, because he can swallow, and the mask is only for unconscious patients", "Protecting the airway is a reason to use the mask, not a reason to skip it."),
    W("Yes, but only after a non-rebreather mask at 15 liters", "High uncontrolled oxygen is not the step that ventilates him."),
    W("Yes, and theophylline is required at the same time", "Methylxanthines are not recommended."),
  ])

A(89, system="social-sciences", weight=8, topic="sensitivity-specificity", domain="social-sciences", diff=2, subject="biostatistics",
  takeaway="Fifteen smoke-free years end the low-dose CT indication. Sixteen years is past that limit even if the person is 60 and once smoked heavily.",
  citation=USP_LU,
  scenario="A 60-year-old patient quit smoking 16 years ago after 30 pack-years. He feels well. A classmate orders annual low-dose CT because the old pack-year total was 30.",
  question="Why has the screening indication ended?",
  correct=W("Sixteen years without cigarettes is past the 15-year limit",
            "The 2021 statement stops screening after 15 years of abstinence. Age 60 and 30 pack-years would otherwise qualify. They do not override the quit interval."),
  wrongs=[
    W("The indication never ends if the pack-year total reached 30", "The quit interval is an independent stop rule."),
    W("Screening ended at 10 years, so he has been ineligible for 6 years", "The interval is 15 years, not 10. He is ineligible because he is past 15."),
    W("A chest radiograph replaces CT after 15 years", "The action is to stop screening, not to switch tests."),
    W("He is too old at 60", "The upper age is 80. Age is not the reason."),
  ])

A(90, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="A DPP-4 inhibitor and a GLP-1 receptor agonist are not combined, because glucose does not fall further.",
  citation=ADA,
  scenario="A 56-year-old patient with type 2 diabetes and an A1c of 8.0 percent is starting a GLP-1 receptor agonist for cardiovascular disease. He already takes a DPP-4 inhibitor. A classmate keeps both because two incretin drugs should add.",
  question="What happens to the DPP-4 inhibitor?",
  correct=W("Stop it. The combination does not lower glucose more than the GLP-1 receptor agonist alone",
            "ADA 2026 recommends against combining a DPP-4 inhibitor with a GLP-1 receptor agonist or a dual GIP and GLP-1 agonist for that reason."),
  wrongs=[
    W("Keep it. The pathways are different enough to add", "They are not different enough. Glucose does not fall further."),
    W("Stop the GLP-1 receptor agonist instead, because the DPP-4 inhibitor has the cardiovascular outcome", "The cardiovascular reason is why the GLP-1 drug is being added. The DPP-4 inhibitor is the one that stops."),
    W("Double both doses", "Higher doses of the combination are not the recommendation."),
    W("The combination is required if the A1c is above 7", "An A1c above goal is a reason to intensify, not a reason to combine these two classes."),
  ])

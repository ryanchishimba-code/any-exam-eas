"""Step 1 items 11-35."""

from lib import s1

KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, sections 9 and 11."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
CDC = "CDC Sexually Transmitted Infections Treatment Guidelines, 2021."
ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s1(n, **k))

A(11, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=3, subject="pharmacology",
  takeaway="An SGLT2 inhibitor that was started at an eligible filtration rate is continued if the filtration rate later falls below 20, until dialysis, unless it is not tolerated.",
  citation=KDIGO,
  scenario="A 74-year-old patient has been on an SGLT2 inhibitor for a year. The estimated filtration rate has drifted from 24 to 18 mL/min/1.73 m2. He is not on dialysis, the potassium is 4.6 mEq/L, and he has no ketones. A classmate stops the drug the day the number crosses 20.",
  question="What does crossing below 20 mL/min/1.73 m2 change?",
  correct=W("Nothing by itself. Continue the SGLT2 inhibitor until dialysis if he still tolerates it",
            "KDIGO 2024 says that once an SGLT2 inhibitor is started, it is reasonable to continue it even if eGFR falls below 20, unless it is not tolerated or kidney-replacement therapy begins. The floor of 20 is an initiation threshold, not an automatic stop."),
  wrongs=[
    W("Stop it the day eGFR falls below 20", "That treats the initiation floor as a continuation stop, which the practice point does not."),
    W("Stop it and start a nonsteroidal anti-inflammatory drug", "A nonsteroidal drug is not a substitute and adds kidney risk."),
    W("Double the dose to push the filtration rate back above 20", "The dip is not treated by raising the dose."),
    W("Continue it only if he also has diabetes and an A1c above 9", "Continuation does not require a high A1c."),
  ])

A(12, system="respiratory-renal", weight=13, topic="aki-mechanisms", domain="respiratory-renal", diff=3, subject="physiology",
  takeaway="A 2-year kidney-failure risk above 40 percent is used to time preparation for kidney-replacement therapy, which is a later threshold than the 5-year referral range.",
  citation=KDIGO,
  scenario="A 69-year-old patient has an estimated filtration rate of 18 mL/min/1.73 m2. A validated equation gives a 2-year kidney-failure risk of 45 percent. He is not yet dialyzing. A classmate says planning for access or transplant referral waits until the filtration rate is under 10.",
  question="What does a 2-year risk of 45 percent add?",
  correct=W("It supports preparing for kidney-replacement therapy now, not waiting for a filtration rate under 10",
            "KDIGO 2024 says a 2-year risk above 40 percent can time modality education and preparation, including access or transplant referral, along with the filtration rate. Forty-five percent is over that line."),
  wrongs=[
    W("Nothing until the filtration rate is under 10", "The 40 percent 2-year threshold exists so preparation is not delayed until a single filtration cutoff."),
    W("Start dialysis this week", "The threshold is for preparation and education, not for starting dialysis today."),
    W("Stop the ACE inhibitor because planning for dialysis ends medical therapy", "Preparation does not cancel disease-modifying drugs he still tolerates."),
    W("The number is only meaningful if the 5-year risk is under 3 percent", "A 5-year risk of 3 to 5 percent is the earlier referral range. This 2-year figure is a later, higher bar."),
  ])

A(13, system="respiratory-renal", weight=13, topic="glomerular-diseases", domain="respiratory-renal", diff=2, subject="physiology",
  takeaway="A urine albumin-to-creatinine ratio above 300 mg/g is severely increased albuminuria, not the moderate 30 to 300 band.",
  citation=KDIGO,
  scenario="A 58-year-old patient with diabetes has a urine albumin-to-creatinine ratio of 450 mg/g and an estimated filtration rate of 52 mL/min/1.73 m2. A classmate calls 450 moderately increased because he remembers that abnormal albuminuria starts at 30.",
  question="Which albumin category is 450 mg/g?",
  correct=W("Severely increased, because that category begins above 300 mg/g",
            "KDIGO uses under 30 as normal to mildly increased, 30 to 300 as moderately increased, and above 300 as severely increased. Remembering only the lower bound of 30 misfiles this result."),
  wrongs=[
    W("Normal, because only ratios above 1000 are abnormal", "Abnormality begins well below 1000. Above 300 is already the severe category."),
    W("Moderately increased, because every ratio above 30 is moderate", "Moderate stops at 300. 450 is past that."),
    W("Nephrotic only if the ratio exceeds 10000", "Nephrotic-range protein is a different description. This item is the KDIGO severe albuminuria category, which 450 already meets."),
    W("Uninterpretable unless the filtration rate is below 15", "Albumin category and filtration category are read separately."),
  ])

A(14, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="Metformin that is already being taken is stopped when eGFR falls below 30. That is a contraindication, not a dose reduction.",
  citation=ADA,
  scenario="A 71-year-old patient has taken metformin for years. The estimated filtration rate, previously 38, is now 28 mL/min/1.73 m2. The A1c is 7.4 percent. A classmate cuts the dose in half and continues it because the patient has tolerated it for years.",
  question="What happens to metformin at an eGFR of 28?",
  correct=W("Stop it. Below 30 mL/min/1.73 m2 it is contraindicated",
            "ADA 2026 states metformin is contraindicated below an eGFR of 30. Years of prior tolerance do not create an exception, and halving the dose does not remove the contraindication."),
  wrongs=[
    W("Continue half the dose, because prior tolerance is the deciding fact", "Tolerance does not override the contraindication below 30."),
    W("Continue the full dose until the filtration rate is under 15", "The contraindication is 30, not 15."),
    W("Stop it only if the lactate is already elevated", "The drug is stopped because of the filtration rate, not after lactic acidosis has occurred."),
    W("Add a sulfonylurea on top and keep metformin", "Adding a sulfonylurea does not make metformin safe below 30."),
  ])

A(15, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="If eGFR falls below 45 but stays at or above 30 in a patient already on metformin, the drug is reassessed. It is not automatically stopped, and it would not be newly started at this level.",
  citation=ADA,
  scenario="A 66-year-old patient has used metformin for three years. The estimated filtration rate has fallen from 58 to 42 mL/min/1.73 m2. The A1c is 7.1 percent and the lactate is normal. A classmate stops it the same day, using the rule that forbids a new start below 45.",
  question="How is an existing metformin prescription handled at an eGFR of 42?",
  correct=W("Reassess benefit and risk. Do not treat the do-not-start line as an automatic stop",
            "ADA 2026 says not to initiate metformin below 45, and to reassess continuing it when eGFR falls below 45. The contraindication that forces a stop is below 30. An eGFR of 42 is in the reassess band."),
  wrongs=[
    W("Stop it today, because the do-not-start rule and the stop rule are the same line", "They are different lines. Initiation stops at 45. Required discontinuation is below 30."),
    W("Double the dose, because a lower filtration rate means less drug is absorbed", "A lower filtration rate increases exposure. The dose is not increased."),
    W("Continue it with no reassessment until the filtration rate is under 15", "Falling below 45 is exactly when continuation is reassessed."),
    W("Switch to a nonsteroidal anti-inflammatory drug for glucose control", "A nonsteroidal drug does not treat glucose and is a kidney risk."),
  ])

A(16, system="reproductive-endocrine", weight=14, topic="diabetes-pathophysiology", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="Below an eGFR of 45, an SGLT2 inhibitor lowers glucose less, but the kidney benefit remains a reason to use it.",
  citation=ADA,
  scenario="A 69-year-old patient has type 2 diabetes, an estimated filtration rate of 40 mL/min/1.73 m2, and a urine albumin-to-creatinine ratio of 320 mg/g. A classmate stops the SGLT2 inhibitor because he read that its glucose effect shrinks below a filtration rate of 45.",
  question="Does a smaller glucose effect cancel the drug?",
  correct=W("No. The kidney benefit continues even though the glucose effect is smaller",
            "ADA 2026 says the glycemic benefit of SGLT2 inhibitors is reduced below an eGFR of 45, and still recommends them for CKD with an eGFR of at least 20. Stopping the drug because it lowers glucose less ignores the kidney indication."),
  wrongs=[
    W("Yes. A drug that lowers glucose less should be stopped", "The kidney indication is independent of how much the A1c moves."),
    W("Yes, unless the A1c is above 10 percent", "A high A1c is not required for the kidney recommendation."),
    W("No, but only after the filtration rate returns above 60", "An eGFR of 40 is inside the range where the drug is recommended, not a reason to wait."),
    W("Replace it with a DPP-4 inhibitor, which has the same kidney-outcome trials", "A DPP-4 inhibitor does not carry that kidney-outcome recommendation."),
  ])

A(17, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pathology",
  takeaway="Liver enzymes more than twice the upper limit of normal are a severe feature. Before 34 weeks, a stable mother is not sent home.",
  citation=ACOG,
  scenario="A 27-year-old patient is at 29 weeks. Blood pressure is 148/94 mm Hg and comes down to 138/86 after oral labetalol. Aspartate aminotransferase is 140 U/L, with the laboratory upper limit at 40 U/L. Platelets are 180,000 and creatinine is 0.6 mg/dL. She has no headache, and the fetal tracing is reassuring. A classmate discharges her because the pressure improved and the platelet count is normal.",
  question="What does the aminotransferase of 140 U/L change?",
  correct=W("It is a severe feature, more than twice normal, so she stays for inpatient monitoring",
            "ACOG counts liver enzymes more than twice normal as a severe feature. Improved pressure and a normal platelet count do not erase it. Before 34 weeks, with a reassuring fetus and a currently stable mother, expectant care is inpatient, not a discharge."),
  wrongs=[
    W("Nothing. Only the platelet count defines a severe laboratory feature", "Enzymes more than twice normal are their own severe feature."),
    W("It requires delivery tonight because every enzyme elevation before 34 weeks ends the pregnancy", "A stable pair before 34 weeks may be managed expectantly in the hospital. The enzyme does not by itself force immediate delivery."),
    W("It is normal, because 140 is less than ten times the upper limit", "The threshold is twice normal, not ten times."),
    W("Send her home on acetaminophen for the enzyme elevation", "Acetaminophen is not the treatment, and home is the wrong setting."),
  ])

A(18, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pathology",
  takeaway="A headache that does not respond to medication is a severe feature even when the platelet count and creatinine are normal.",
  citation=ACOG,
  scenario="A 30-year-old patient is at 31 weeks. Blood pressure is 152/96 mm Hg. She has a severe headache that did not ease with acetaminophen. Platelets are 200,000, creatinine is 0.7 mg/dL, and liver enzymes are normal. Vision is unchanged. A classmate says severe features are only laboratory numbers, so the headache can be charted and she can go home.",
  question="Which finding is the severe feature?",
  correct=W("The headache that did not respond to medication",
            "ACOG lists a headache without another cause that does not respond to medication as a severe feature. Normal platelets and a normal creatinine do not cancel it. She is not classified as disease without severe features."),
  wrongs=[
    W("None. Severe features are only a low platelet count or a high creatinine", "The bulletin includes unresponsive headache and visual change, not only laboratory numbers."),
    W("The normal vision, because any pregnancy headache is severe only if vision also changes", "Vision and headache are each sufficient. Both are not required."),
    W("The blood pressure of 152/96, because any value above 140/90 is a severe-range pressure", "Severe-range pressure is at least 160 systolic or 110 diastolic. 152/96 is high, but it is not by itself the severe-range cutoff."),
    W("A normal creatinine, because a normal kidney proves the headache is unrelated", "A normal creatinine does not explain away the headache the bulletin lists."),
  ])

A(19, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="More than one moderate-risk factor is an indication for aspirin 81 mg daily, started between 12 and 28 weeks.",
  citation=ACOG,
  scenario="A 36-year-old patient is at 15 weeks in her first pregnancy. Body-mass index is 36. She has no prior hypertensive pregnancy, no diabetes, no kidney disease, and no autoimmune disease. Blood pressure today is 118/72 mm Hg. A classmate says aspirin is only for a prior affected pregnancy, so none is indicated.",
  question="Why is aspirin still indicated?",
  correct=W("She has more than one moderate-risk factor, so aspirin 81 mg daily is recommended",
            "ACOG lists first pregnancy, age 35 or older, and body-mass index over 30 as moderate-risk factors. More than one of them qualifies. The dose is 81 mg from between 12 and 28 weeks until delivery. She does not need a prior affected pregnancy."),
  wrongs=[
    W("No aspirin, because only a prior affected pregnancy qualifies", "A prior affected pregnancy is a high-risk factor. More than one moderate-risk factor is a separate indication."),
    W("Aspirin 325 mg daily until 20 weeks", "The dose is 81 mg, and it continues until delivery."),
    W("Low-molecular-weight heparin instead of aspirin", "Heparin is not the prevention for this risk pattern."),
    W("Aspirin only after the blood pressure exceeds 140/90", "Prevention is started while she is still normotensive, inside the 12- to 28-week window."),
  ])

A(20, system="reproductive-endocrine", weight=14, topic="preeclampsia-mechanism", domain="reproductive-endocrine", diff=3, subject="pharmacology",
  takeaway="Aspirin for a high-risk patient is still started after 16 weeks if she is still under 28 weeks. Sixteen weeks is the preferred time, not the last chance.",
  citation=ACOG,
  scenario="A 33-year-old patient is at 22 weeks. Her last pregnancy was complicated by new hypertension and proteinuria that required a preterm birth. She is normotensive today. Nobody offered aspirin earlier. A classmate says 16 weeks was the deadline, so it is now too late.",
  question="Can aspirin still be started at 22 weeks?",
  correct=W("Yes. The window runs through 28 weeks, even though starting before 16 weeks is better",
            "ACOG recommends starting between 12 and 28 weeks and says optimally before 16 weeks. Twenty-two weeks is later than optimal and still inside the recommended window. The dose remains 81 mg until delivery."),
  wrongs=[
    W("No. Sixteen weeks is a hard stop", "Sixteen weeks is the preferred time, not the end of the window."),
    W("Yes, but the dose becomes 325 mg because she started late", "The dose stays 81 mg daily until delivery. It does not increase because the start was later."),
    W("No, unless the blood pressure is already above 160/110", "Prevention is for risk, not for severe-range pressure that has already appeared."),
    W("Yes, as a substitute for any later blood-pressure drug", "Aspirin does not replace treatment if hypertension develops later."),
  ])

A(21, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=2, subject="pharmacology",
  takeaway="Routine HLA-B*5801 testing before allopurinol is not recommended for patients outside the higher-prevalence ancestry groups.",
  citation=ACR,
  scenario="A 54-year-old patient of European ancestry, with no Korean, Han Chinese, Thai, or African American ancestry, is starting allopurinol after repeated attacks. The estimated filtration rate is 70 mL/min/1.73 m2. A classmate orders HLA-B*5801 for every allopurinol start, regardless of ancestry.",
  question="Is that genetic test indicated here?",
  correct=W("No. The 2020 guideline recommends against routine testing in this ancestry group",
            "Testing is conditionally recommended for Korean, Han Chinese, Thai, and African American patients. For other groups the same guideline recommends against routine testing. A low starting dose still applies."),
  wrongs=[
    W("Yes. Every allopurinol start requires the test", "That erases the ancestry distinction the guideline drew."),
    W("Yes, but only HLA-B27", "The allele, when it is tested, is HLA-B*5801."),
    W("No test is ever useful in any ancestry", "The higher-prevalence groups are specifically included."),
    W("Yes, because a filtration rate of 70 is the indication for the genetic test", "Filtration rate does not choose who is tested. Ancestry does."),
  ])

A(22, system="msk-skin", weight=10, topic="gout-crystals", domain="msk-skin", diff=3, subject="pharmacology",
  takeaway="A first flare plus a serum urate above 9 mg/dL is a reason urate-lowering therapy may be considered, unlike a first flare with a lower urate and normal kidneys.",
  citation=ACR,
  scenario="A 48-year-old patient is recovering from his first hot first-toe attack. Serum urate is 9.8 mg/dL. The estimated filtration rate is 90 mL/min/1.73 m2 and he has no stones. A classmate applies the 'never after a first flare' rule and refuses to discuss allopurinol.",
  question="What does the urate of 9.8 mg/dL change?",
  correct=W("Urate-lowering therapy may be considered even though this is the first flare",
            "The 2020 guideline conditionally recommends against therapy after a first flare only when CKD stage 3 or worse, urate above 9, and stones are all absent. A urate of 9.8 removes that 'all absent' condition. Allopurinol, if chosen, still starts low."),
  wrongs=[
    W("Nothing. A first flare never qualifies, whatever the urate", "Urate above 9 is one of the exceptions the guideline lists."),
    W("Pegloticase is required because the urate is above 9", "Pegloticase is not first-line. An oral drug is discussed first."),
    W("Allopurinol 800 mg tonight", "A high urate is not a reason to start at the maximum dose."),
    W("Probenecid is preferred because the kidneys are normal", "Allopurinol remains the preferred first drug even when kidney function is normal."),
  ])

A(23, system="blood-lymph-immune", weight=11, topic="antibiotic-mechanisms", domain="blood-lymph-immune", diff=3, subject="microbiology",
  takeaway="Gonococcal conjunctivitis is treated with ceftriaxone 1 g intramuscularly once, not the 500 mg mucosal dose.",
  citation=CDC,
  scenario="A 24-year-old patient weighs 65 kg and has a red, purulent eye. A conjunctival test is positive for gonorrhea. A genital test is negative for chlamydia. There is no tenosynovitis and no rash. A classmate gives ceftriaxone 500 mg because the weight is under 150 kg.",
  question="Which dose matches conjunctival infection?",
  correct=W("Ceftriaxone 1 g intramuscularly once",
            "The 2021 CDC regimen for gonococcal conjunctivitis is 1 g once, separate from the 500 mg dose used for uncomplicated cervical, urethral, rectal, or pharyngeal infection. Weight under 150 kg does not lower the eye dose."),
  wrongs=[
    W("Ceftriaxone 500 mg, because weight under 150 kg fixes every dose", "The eye has its own 1 g dose."),
    W("Erythromycin eye ointment alone", "Topical therapy does not replace systemic ceftriaxone for gonococcal conjunctivitis."),
    W("Ciprofloxacin eye drops for 7 days", "A fluoroquinolone drop is not the recommended regimen."),
    W("Ceftriaxone 1 g every 8 hours for meningitis", "He has no meningeal findings. Conjunctivitis is a single 1 g dose."),
  ])

A(24, system="blood-lymph-immune", weight=11, topic="antibiotic-mechanisms", domain="blood-lymph-immune", diff=3, subject="microbiology",
  takeaway="Epididymitis most likely from gonorrhea or chlamydia is ceftriaxone 500 mg once plus doxycycline for 10 days, not the 7-day chlamydia course.",
  citation=CDC,
  scenario="A 22-year-old patient weighs 75 kg and has two days of a swollen, tender epididymis. He is sexually active and has no insertive anal exposure. A classmate gives ceftriaxone 500 mg plus doxycycline for 7 days, using the uncomplicated chlamydia duration.",
  question="How long is the doxycycline course for this epididymis?",
  correct=W("Ten days, together with ceftriaxone 500 mg once",
            "The 2021 CDC regimen for epididymitis most likely caused by gonorrhea or chlamydia is ceftriaxone 500 mg once plus doxycycline 100 mg twice daily for 10 days. Seven days is the uncomplicated chlamydia duration, not this one."),
  wrongs=[
    W("Seven days, because every doxycycline course for a sexually transmitted infection is 7 days", "Epididymitis uses 10 days."),
    W("Ceftriaxone alone for 10 days, with no doxycycline", "Both drugs are in the regimen when chlamydia has not been excluded as a cause."),
    W("Levofloxacin for 10 days, because every epididymis is an enteric infection", "Levofloxacin is for enteric organisms, including after insertive anal sex. That history is absent here."),
    W("Azithromycin 1 g once and no injection", "Azithromycin does not replace this ceftriaxone-plus-doxycycline regimen."),
  ])

A(25, system="gastrointestinal", weight=8, topic="gi-bleeding-sources", domain="gastrointestinal", diff=3, subject="pathology",
  takeaway="Bleeding that returns after endoscopic hemostasis is re-examined with the endoscope. Immediate surgery is not the first response.",
  citation=ACG,
  scenario="A 66-year-old patient had a bleeding duodenal ulcer clipped yesterday. Overnight he passes maroon stool again, the heart rate rises from 80 to 112, and the hemoglobin falls from 9.0 to 7.2 g/dL. Blood pressure is 102/64 mm Hg after fluid. A classmate calls surgery for an immediate operation and says a second endoscopy is never useful.",
  question="What is the next examination?",
  correct=W("Repeat endoscopy for the recurrent bleeding",
            "ACG 2021 suggests repeat endoscopy when bleeding recurs after hemostasis. Surgery is not the automatic first response while another endoscopic attempt is reasonable. He is being resuscitated, which comes with that plan."),
  wrongs=[
    W("Immediate surgery, because a second endoscopy is never useful", "The guideline suggests the opposite order for recurrent bleeding."),
    W("Discharge on a proton pump inhibitor, because the first clip worked", "Recurrent melena, tachycardia, and a falling hemoglobin mean the first treatment did not hold."),
    W("Barium swallow to look for the vessel", "Contrast swallow is not the test for recurrent bleeding."),
    W("Platelet transfusion as the only therapy", "The problem is recurrent ulcer bleeding, not an isolated platelet count."),
  ])

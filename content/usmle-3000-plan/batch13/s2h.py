"""Step 2 items 71-100."""

from lib import item

OSA = "American Academy of Sleep Medicine clinical practice guideline on positive airway pressure for obstructive sleep apnea, 2019."
ADREN = "Endocrine Society clinical practice guideline on primary adrenal insufficiency, 2016."
ASB = "US Preventive Services Task Force asymptomatic bacteriuria recommendation, 2019: screen and treat pregnant persons."
MBD = "KDIGO 2017 CKD-MBD guideline update."
MS = "AAN 2018 practice guideline: an acute multiple-sclerosis relapse that causes disability is treated with high-dose corticosteroid."
GBS = "AAN 2003 evidence review, still the cited AAN statement: intravenous immunoglobulin or plasma exchange treats Guillain-Barre syndrome, and corticosteroids do not."
EC = "CDC U.S. Selected Practice Recommendations for Contraceptive Use, 2024."
MEC = "CDC U.S. Medical Eligibility Criteria for Contraceptive Use, 2024."
SCZ = "APA Practice Guideline for the Treatment of Patients With Schizophrenia, 2020."
HIV = "HHS Guidelines for the Use of Antiretroviral Agents in Adults and Adolescents with HIV, current 2024 guidance: start antiretroviral therapy as soon as possible after diagnosis."
PCP = "HHS Guidelines for the Prevention and Treatment of Opportunistic Infections in Adults and Adolescents with HIV, 2024: prophylaxis against Pneumocystis when CD4 is below 200."
LBP = "American College of Physicians guideline on low back pain, 2017."
SSTI = "IDSA 2014 practice guidelines for skin and soft tissue infections, which remain the IDSA guideline."
STREP = "IDSA 2012 guideline for group A streptococcal pharyngitis, which remains the IDSA guidance: penicillin or amoxicillin, not a fluoroquinolone."
TINEA = "AAD and IDSA-consistent practice: tinea capitis is treated with oral antifungal therapy, not topical therapy alone."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
NF = "IDSA guidance on neutropenic fever: empiric antifungal therapy is not the first hour of a new fever."
OA = "2019 American College of Rheumatology guideline for osteoarthritis."
BEERS = "American Geriatrics Society Beers Criteria, 2023."
ADA = "American Diabetes Association Standards of Care in Diabetes, 2026."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

def add(n, **k):
    ITEMS.append(Q(n, **k))

add(71, sex="m", system="respiratory-renal", weight=13, topic="sleep-apnea", diff=2, subject="pulmonology",
  takeaway="Moderate or severe obstructive sleep apnea is treated with positive airway pressure, not with a sedative as the sleep drug.",
  citation=OSA,
  scenario="A 56-year-old man stops breathing during sleep. A study shows an apnea-hypopnea index of 32 events per hour. He is sleepy while driving. A colleague prescribes a nightly benzodiazepine and says a pressure device is optional cosmetics.",
  question="Which treatment matches an index of 32?",
  correct=W("Positive airway pressure, not a nightly benzodiazepine",
            "Moderate or severe obstructive sleep apnea is treated with positive airway pressure, not with a sedative as the sleep drug. An index of 32 is severe. A benzodiazepine can worsen the pauses."),
  wrongs=[
    W("A benzodiazepine as the primary treatment", "A sedative can deepen the obstruction."),
    W("No treatment until the index exceeds 100", "Severe disease begins well below 100. Thirty-two is already severe."),
    W("Antibiotics for the pauses", "The pauses are not an infection."),
    W("Oxygen by nasal cannula alone as an equal substitute", "Oxygen does not stent the airway the way positive pressure does."),
  ])

add(72, sex="f", system="reproductive-endocrine", weight=10, topic="adrenal-crisis", diff=3, subject="endocrinology",
  takeaway="Suspected adrenal crisis is treated immediately with intravenous hydrocortisone and saline. A lab result is not required before the first dose.",
  citation=ADREN,
  scenario="A 46-year-old woman with known primary adrenal insufficiency has vomiting and a blood pressure of 78/50 mm Hg after a flu-like illness. She missed her tablets. Glucose is 58 mg/dL. A colleague waits for a cortisol result before any steroid.",
  question="What is given while the cortisol is pending?",
  correct=W("Intravenous hydrocortisone and saline now",
            "Suspected adrenal crisis is treated immediately with intravenous hydrocortisone and saline. A lab result is not required before the first dose. She is hypotensive, hypoglycemic, and has missed her replacement. Waiting for a number delays the drug that treats the crisis."),
  wrongs=[
    W("No steroid until the cortisol result returns", "The crisis is treated on suspicion."),
    W("Oral prednisone tablets, which she is currently vomiting", "She is vomiting. The route is intravenous."),
    W("Insulin, because the glucose is 58 mg/dL", "A glucose of 58 is low. Insulin would make it lower."),
    W("Antibiotics only, with no steroid", "Infection may have triggered the crisis. It does not replace the steroid."),
  ])

add(73, sex="f", system="respiratory-renal", weight=13, topic="bacteriuria-pregnancy", diff=2, subject="obstetrics",
  takeaway="Asymptomatic bacteriuria in pregnancy is treated. The same culture in a nonpregnant adult is not.",
  citation=ASB,
  scenario="A 28-year-old woman is at 14 weeks. She has no urinary burning. A screening culture grows more than 100,000 colonies of E. coli. A colleague does not treat it, using the rule written for nonpregnant adults.",
  question="Does pregnancy change that rule?",
  correct=W("Yes. Treat the bacteriuria. The do-not-treat rule is for nonpregnant adults",
            "Asymptomatic bacteriuria in pregnancy is treated. The same culture in a nonpregnant adult is not. She is at 14 weeks, which is why the culture was obtained. Leaving it untreated raises the risk of a kidney infection."),
  wrongs=[
    W("No. Pregnancy uses the same do-not-treat rule", "Pregnancy is the exception that is treated."),
    W("Treat only after a fever starts", "The point of screening is to treat before a kidney infection."),
    W("Nitrofurantoin is banned for the entire pregnancy, so no drug exists", "Safe options exist. The decision is to treat, with a drug appropriate for the trimester."),
    W("A 6-week fluoroquinolone course", "A long fluoroquinolone course is not the pregnancy regimen."),
  ])

add(74, sex="m", system="respiratory-renal", weight=13, topic="ckd-mbd", diff=3, subject="nephrology",
  takeaway="When phosphate is high and calcium is already high, a non-calcium binder such as sevelamer is used. More calcium binder would worsen the calcium.",
  citation=MBD,
  scenario="A 70-year-old man on dialysis has a phosphate of 7.2 mg/dL. He also has a calcium of 10.8 mg/dL. A colleague increases calcium acetate and says every phosphate binder should contain calcium.",
  question="Which binder fits a calcium of 10.8 mg/dL?",
  correct=W("A non-calcium binder such as sevelamer, not more calcium acetate",
            "When phosphate is high and calcium is already high, a non-calcium binder such as sevelamer is used. More calcium binder would worsen the calcium. The phosphate of 7.2 still needs binding. The calcium chooses which binder."),
  wrongs=[
    W("More calcium acetate, because every binder should contain calcium", "High calcium is the reason to avoid a calcium binder."),
    W("No binder until phosphate exceeds 12", "A phosphate of 7.2 is already high enough to treat."),
    W("A thiazide to lower phosphate", "A thiazide is not a phosphate binder."),
    W("Stop dialysis because the phosphate is a lab error", "The number is a reason to change the binder, not to stop dialysis."),
  ])

add(75, sex="f", system="behavioral-nervous", weight=12, topic="multiple-sclerosis", diff=3, subject="neurology",
  takeaway="An acute multiple-sclerosis relapse that limits function is treated with high-dose corticosteroid. A disease-modifying injection is not the acute relapse drug.",
  citation=MS,
  scenario="A 29-year-old woman with multiple sclerosis cannot walk her usual distance because of a new dense leg weakness for two days. She has no fever. A colleague increases her disease-modifying injection and says steroids are only for the first diagnostic relapse.",
  question="What treats this new weakness?",
  correct=W("High-dose corticosteroid now, not a bigger disease-modifying dose as the acute treatment",
            "An acute multiple-sclerosis relapse that limits function is treated with high-dose corticosteroid. A disease-modifying injection is not the acute relapse drug. Two days of dense weakness is a relapse. The disease-modifying drug stays for prevention. It does not replace the steroid."),
  wrongs=[
    W("Only an increase in the disease-modifying injection", "That drug does not treat the acute relapse."),
    W("Antibiotics for presumed spinal infection", "She has no fever, and the history is a relapse pattern."),
    W("No treatment because a relapse must last 30 days", "Two days of disabling weakness is treated."),
    W("Aspirin as the relapse drug", "Aspirin is not the relapse treatment."),
  ])

add(76, sex="m", system="behavioral-nervous", weight=12, topic="guillain-barre", diff=3, subject="neurology",
  takeaway="Guillain-Barre syndrome is treated with intravenous immunoglobulin or plasma exchange. Corticosteroids do not help.",
  citation=GBS,
  scenario="A 40-year-old man has had ascending weakness for 5 days. Reflexes are absent and spinal fluid shows protein 90 mg/dL with 2 white cells. He can still protect his airway. A colleague starts high-dose prednisone and says immunoglobulin is second-line.",
  question="Which treatment has evidence, and which does not?",
  correct=W("Immunoglobulin or plasma exchange. Prednisone does not treat this syndrome",
            "Guillain-Barre syndrome is treated with intravenous immunoglobulin or plasma exchange. Corticosteroids do not help. The spinal fluid pattern and the ascending weakness fit. Prednisone is the drug that lacks benefit."),
  wrongs=[
    W("Prednisone as the proven first treatment", "Corticosteroids do not improve this syndrome."),
    W("Antibiotics for the high spinal-fluid protein", "Protein without cells is not a bacterial meningitis pattern."),
    W("No treatment until he needs a ventilator", "Treatment is given before respiratory failure when the diagnosis is made."),
    W("Aspirin to reverse the weakness", "Aspirin is not a treatment of this neuropathy."),
  ])

add(77, sex="f", system="reproductive-endocrine", weight=10, topic="emergency-contraception", diff=2, subject="gynecology",
  takeaway="A copper intrauterine device is the most effective emergency contraception and can be placed within 5 days. It is not reserved for people who have already given birth.",
  citation=EC,
  scenario="A 22-year-old woman had unprotected intercourse 3 days ago and wants the most effective emergency method. She has never been pregnant. A colleague says a device cannot be used because she is nulliparous and offers only a low-dose combined pill taken once.",
  question="Which method is most effective at 3 days?",
  correct=W("A copper intrauterine device, which she can receive even though she has never given birth",
            "A copper intrauterine device is the most effective emergency contraception and can be placed within 5 days. It is not reserved for people who have already given birth. Three days is inside the window. A single combined birth-control pill is not the emergency regimen."),
  wrongs=[
    W("A single combined birth-control tablet, because a device is banned before the first birth", "Nulliparity is not a ban, and one combined tablet is not emergency contraception."),
    W("No method works after 24 hours", "The device window extends to 5 days."),
    W("Methotrexate as emergency contraception", "Methotrexate is not an emergency contraceptive."),
    W("Start a combined pill tonight and skip a dedicated emergency method", "Starting ordinary pills is not a substitute for emergency contraception after 3 days."),
  ])

add(78, sex="m", system="blood-lymph-immune", weight=8, topic="clozapine", diff=3, subject="psychiatry",
  takeaway="Clozapine requires absolute-neutrophil monitoring. It is not started or continued without that lab plan, and it is not the first antipsychotic.",
  citation=SCZ,
  scenario="A 26-year-old man has failed two antipsychotics. He is medically stable. A colleague starts clozapine and says blood counts are optional because the metabolic effects are the only concern.",
  question="Which lab plan is required with clozapine?",
  correct=W("Scheduled absolute-neutrophil counts, because agranulocytosis is the specific hazard",
            "Clozapine requires absolute-neutrophil monitoring. It is not started or continued without that lab plan, and it is not the first antipsychotic. He has failed two drugs, so clozapine can be appropriate. The missing piece is the neutrophil schedule."),
  wrongs=[
    W("No blood counts. Only weight is monitored", "Neutrophil monitoring is mandatory."),
    W("Clozapine as the first antipsychotic, before any other drug", "He has already failed two. Clozapine is not how treatment begins."),
    W("A weekly liver enzyme and no neutrophil count", "The specific required count is the neutrophil count."),
    W("Stop monitoring after the first normal result", "Monitoring continues on a schedule. One normal result does not end it."),
  ])

add(79, sex="f", system="blood-lymph-immune", weight=8, topic="hiv-start", diff=2, subject="infectious-disease",
  takeaway="Antiretroviral therapy starts as soon as HIV is diagnosed. A CD4 count is not a reason to delay the first doses.",
  citation=HIV,
  scenario="A 31-year-old woman has a new positive HIV antigen-antibody test and a positive confirmatory test. CD4 is 620 and the viral load is 40,000. She feels well. A colleague waits to start therapy until the CD4 count falls below 200.",
  question="When does antiretroviral therapy start?",
  correct=W("Now. A CD4 count of 620 is not a reason to wait",
            "Antiretroviral therapy starts as soon as HIV is diagnosed. A CD4 count is not a reason to delay the first doses. She is confirmed positive and viremic. Waiting for a CD4 count under 200 is an old threshold."),
  wrongs=[
    W("Only after the CD4 count is under 200", "Treatment is no longer delayed for a low CD4 count."),
    W("Only if she has an opportunistic infection today", "She should start before that infection."),
    W("Monotherapy with one nucleoside for the first year", "Therapy is a combination, not one drug."),
    W("No therapy if the viral load is under 100,000", "A load of 40,000 is already a reason to treat. There is no requirement to exceed 100,000."),
  ])

add(80, sex="m", system="blood-lymph-immune", weight=8, topic="pcp-prophylaxis", diff=3, subject="infectious-disease",
  takeaway="Pneumocystis prophylaxis starts when the CD4 count is below 200. Trimethoprim-sulfamethoxazole is the usual drug.",
  citation=PCP,
  scenario="A 38-year-old man with HIV has a CD4 count of 120. He has no cough and a normal chest film. A colleague says prophylaxis is only for people who already have pneumonia, so none is started.",
  question="Does a CD4 count of 120 justify prophylaxis before any pneumonia?",
  correct=W("Yes. Start trimethoprim-sulfamethoxazole. The threshold is a CD4 count under 200",
            "Pneumocystis prophylaxis starts when the CD4 count is below 200. Trimethoprim-sulfamethoxazole is the usual drug. He does not need to have pneumonia first. A normal film means he does not have the infection now. It does not cancel prevention."),
  wrongs=[
    W("No. Prophylaxis starts only after the first episode of pneumonia", "The count itself is the indication."),
    W("Yes, but only with fluconazole", "Fluconazole does not prevent Pneumocystis."),
    W("Yes, but only when the CD4 count is under 10", "The threshold is 200, not 10."),
    W("A 21-day treatment course now, even though the film is normal", "He needs prophylaxis, not a treatment course for a pneumonia he does not have."),
  ])

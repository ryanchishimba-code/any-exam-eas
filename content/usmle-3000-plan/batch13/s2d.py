"""Step 2 items 29-52. Blood, renal, start of neuro."""

from lib import item

ITP = "ASH 2019 guidelines for immune thrombocytopenia."
HIT = "ASH 2018 guidelines for management of heparin-induced thrombocytopenia."
NF = "ASCO/IDSA 2018 guideline on fever and neutropenia: routine vancomycin is not part of the initial regimen for a stable patient."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
GN = "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases."
ASB = "US Preventive Services Task Force asymptomatic bacteriuria screening recommendation, 2019."
UTI = "IDSA 2011 guidelines for uncomplicated cystitis and pyelonephritis in women, which remain the IDSA guidance."
STROKE = "2019 AHA/ASA Guidelines for the Early Management of Acute Ischemic Stroke, which remain the AHA/ASA source for the blood-pressure limit before thrombolysis and for antiplatelet timing."
AES = "American Epilepsy Society guideline for convulsive status epilepticus, 2016."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

ITEMS.append(Q(29, sex="f", system="blood-lymph-immune", weight=8, topic="itp", diff=3, subject="hematology",
  takeaway="Newly diagnosed immune thrombocytopenia with platelets under 30,000 is treated with a corticosteroid. A count of 18,000 is already under that line.",
  citation=ITP,
  scenario="A 32-year-old woman has petechiae and a platelet count of 18,000 per microliter. Hemoglobin is 13 g/dL, the blood film shows no schistocytes, and she is not pregnant. A colleague observes her for a month because she is not bleeding from the mouth.",
  question="Does a count of 18,000 without mouth bleeding still get treatment?",
  correct=W("Yes. A corticosteroid is started because the count is under 30,000",
            "Newly diagnosed immune thrombocytopenia with platelets under 30,000 is treated with a corticosteroid. A count of 18,000 is already under that line. Mouth bleeding is not required. Observation is for higher counts without bleeding."),
  wrongs=[
    W("No. Treatment waits for oral wet purpura or a count under 5,000", "The threshold to treat newly diagnosed disease is 30,000, not 5,000."),
    W("Platelet transfusion as the only therapy", "Transfusion is for serious bleeding, not the routine treatment of this count."),
    W("Heparin, because a low platelet count is always a clotting problem", "Heparin is not the treatment, and this film is not a microangiopathy."),
    W("Aspirin to improve the petechiae", "Aspirin worsens bleeding. It is not used here."),
  ]))

ITEMS.append(Q(30, sex="m", system="blood-lymph-immune", weight=8, topic="itp", diff=3, subject="hematology",
  takeaway="Immune thrombocytopenia with platelets of 50,000 and no bleeding is observed. Steroids are not mandatory at that count.",
  citation=ITP,
  scenario="A 40-year-old man has a platelet count of 50,000 found on a routine panel. He has no petechiae, no wet purpura, and no planned surgery. Hemoglobin and leukocytes are normal. A colleague starts high-dose dexamethasone because any count under 100,000 is treated.",
  question="Is treatment required at 50,000 with no bleeding?",
  correct=W("No. Observation is appropriate above 30,000 when there is no bleeding",
            "Immune thrombocytopenia with platelets of 50,000 and no bleeding is observed. Steroids are not mandatory at that count. A threshold of 100,000 is not the rule. He has no procedure that needs a higher count."),
  wrongs=[
    W("Yes. Every count under 100,000 starts dexamethasone", "The usual treatment line for newly diagnosed disease is under 30,000 or bleeding."),
    W("Yes, with platelet transfusion until the count exceeds 150,000", "Transfusion is not used to chase a normal number."),
    W("Yes, with aspirin so the platelets that remain work harder", "Aspirin is not a treatment for a low platelet count."),
    W("No treatment is ever given, even under 10,000", "Very low counts are treated. His count is simply not in that range."),
  ]))

ITEMS.append(Q(31, sex="f", system="blood-lymph-immune", weight=8, topic="hit", diff=4, subject="hematology",
  takeaway="Suspected heparin-induced thrombocytopenia means all heparin stops and a non-heparin anticoagulant starts. Warfarin is not started alone while the platelet count is low.",
  citation=HIT,
  scenario="A 68-year-old woman was on unfractionated heparin for 8 days. Her platelets fell from 220,000 to 70,000. One leg is newly swollen. The 4T score is high. A colleague stops heparin and starts warfarin alone that evening.",
  question="What replaces the heparin?",
  correct=W("A non-heparin anticoagulant such as argatroban, not warfarin by itself",
            "Suspected heparin-induced thrombocytopenia means all heparin stops and a non-heparin anticoagulant starts. Warfarin is not started alone while the platelet count is low. She already has a high score and a swollen leg. Warfarin alone risks limb gangrene while the count is 70,000."),
  wrongs=[
    W("Warfarin alone on the evening heparin stops", "Warfarin monotherapy during the low count is the error."),
    W("Platelet transfusion to 100,000 and continued heparin", "Platelets are not given for the count alone, and heparin is not continued."),
    W("Observation until an antibody returns, with no anticoagulant", "A high score with thrombosis is not observed off anticoagulation."),
    W("Low-molecular-weight heparin as a safe substitute", "Every heparin product stops. A low-molecular-weight product is still heparin."),
  ]))

ITEMS.append(Q(32, sex="m", system="blood-lymph-immune", weight=8, topic="neutropenic-fever", diff=3, subject="infectious-disease",
  takeaway="Stable neutropenic fever starts with one antipseudomonal beta-lactam. Vancomycin is not automatic.",
  citation=NF,
  scenario="A 60-year-old man on chemotherapy has a temperature of 38.6 C. His neutrophil count is 200 per microliter. Blood pressure is 124/76 mm Hg, he has no line redness, and there is no hemodynamic instability. A colleague adds vancomycin to cefepime because every neutropenic fever includes MRSA coverage.",
  question="Is vancomycin part of the initial regimen?",
  correct=W("No. Cefepime alone is enough while he is stable and the line looks normal",
            "Stable neutropenic fever starts with one antipseudomonal beta-lactam. Vancomycin is not automatic. He is not unstable and the line is not red. Adding vancomycin is the habit the guideline rejects."),
  wrongs=[
    W("Yes. Vancomycin is required in every neutropenic fever", "Routine addition is not the initial regimen."),
    W("No antibiotic until a culture grows", "Fever and neutropenia are treated immediately. The culture does not have to grow first."),
    W("Vancomycin alone, without the beta-lactam", "Vancomycin does not cover Pseudomonas. The beta-lactam is the required drug."),
    W("Hold antibiotics unless the temperature exceeds 40 C", "38.6 C with neutropenia is already the indication."),
  ]))

ITEMS.append(Q(33, sex="f", system="blood-lymph-immune", weight=8, topic="neutropenic-fever", diff=3, subject="infectious-disease",
  takeaway="Vancomycin is added to neutropenic fever when the patient is unstable or a catheter infection is suspected, not because the temperature exists.",
  citation=NF,
  scenario="A 58-year-old woman with neutropenia has a temperature of 38.8 C and a blood pressure of 82/48 mm Hg. Her tunneled line site is red and tender. She is already receiving cefepime. A colleague refuses vancomycin because the first rule said not to use it routinely.",
  question="Why is vancomycin now the right addition?",
  correct=W("She is in shock and the line looks infected, which are the reasons to add it",
            "Vancomycin is added to neutropenic fever when the patient is unstable or a catheter infection is suspected, not because the temperature exists. Both of those reasons are present. The routine-vancomycin ban does not apply to this picture."),
  wrongs=[
    W("Vancomycin is never added, even in shock", "Shock and a red line are exactly when it is added."),
    W("Stop cefepime and use vancomycin alone", "The antipseudomonal drug stays. Vancomycin is added."),
    W("Add it only after 96 hours of fever if the pressure is normal", "Her pressure is 82/48. Waiting 96 hours is the stable-fever pathway, not this one."),
    W("Steroids instead of any change in antibiotics", "Steroids do not cover a line infection in shock."),
  ]))

ITEMS.append(Q(34, sex="m", system="blood-lymph-immune", weight=8, topic="itp", diff=3, subject="hematology",
  takeaway="Platelet transfusion in immune thrombocytopenia is for serious bleeding, not for a low number alone.",
  citation=ITP,
  scenario="A 29-year-old man with immune thrombocytopenia has a platelet count of 12,000 and scattered petechiae. He is hemodynamically stable, with no intracranial symptom and no gastrointestinal bleeding. A colleague transfuses platelets until the count exceeds 50,000 and holds the corticosteroid.",
  question="Is transfusion the treatment of this count?",
  correct=W("No. Start a corticosteroid. Transfusion is reserved for serious bleeding, which he does not have",
            "Platelet transfusion in immune thrombocytopenia is for serious bleeding, not for a low number alone. Petechiae are not that bleeding. The disease treatment is a corticosteroid, and transfused platelets are destroyed quickly."),
  wrongs=[
    W("Yes. Any count under 20,000 is transfused to 50,000 before a drug", "The number alone is not a transfusion indication."),
    W("Transfuse and skip the corticosteroid", "The corticosteroid is the treatment. Transfusion does not replace it."),
    W("Aspirin plus transfusion", "Aspirin is harmful with this count."),
    W("No drug and no transfusion even if intracranial bleeding starts", "Serious bleeding would change the plan. He simply does not have it now."),
  ]))

ITEMS.append(Q(35, sex="f", system="respiratory-renal", weight=13, topic="albuminuria", diff=3, subject="nephrology",
  takeaway="Severe albuminuria without diabetes is still a reason to start an ACE inhibitor or an ARB. Moderate albuminuria without diabetes is not the same automatic start.",
  citation=KDIGO,
  scenario="A 58-year-old woman has no diabetes. Her urine albumin-to-creatinine ratio is 420 mg/g and her estimated filtration rate is 58 mL/min/1.73 m2. Blood pressure is 128/76 mm Hg and potassium is 4.2 mEq/L. A colleague withholds an ACE inhibitor because she does not have diabetes.",
  question="Does the missing diabetes diagnosis remove the ACE inhibitor?",
  correct=W("No. A ratio of 420 is severe albuminuria, and that indication does not require diabetes",
            "Severe albuminuria without diabetes is still a reason to start an ACE inhibitor or an ARB. Moderate albuminuria without diabetes is not the same automatic start. Her ratio is above 300, so it is the severe category. One drug from the class is started, not both."),
  wrongs=[
    W("Yes. The class is only for diabetic kidney disease", "Severe albuminuria is an indication with or without diabetes."),
    W("No, so start an ACE inhibitor and an ARB together", "The indication is one drug, not both."),
    W("Yes, unless the filtration rate is below 15", "A filtration rate of 58 is not a reason to withhold the drug."),
    W("No drug until the ratio exceeds 2,000", "Severe albuminuria begins above 300. Waiting for 2,000 is not the rule."),
  ]))

ITEMS.append(Q(36, sex="m", system="respiratory-renal", weight=13, topic="albuminuria", diff=3, subject="nephrology",
  takeaway="A rise in creatinine of up to 30 percent after an ACE inhibitor can be accepted. A rise well above 30 percent is reassessed and the drug is reduced or stopped.",
  citation=KDIGO,
  scenario="A 64-year-old man started lisinopril two weeks ago for albuminuric kidney disease. Creatinine rose from 1.0 to 1.6 mg/dL. Potassium is 4.6 mEq/L and he is not volume depleted. A colleague calls a 60 percent rise acceptable because any rise under a doubling is ignored.",
  question="Is a rise from 1.0 to 1.6 mg/dL acceptable?",
  correct=W("No. That is about a 60 percent rise, which is past the 30 percent limit",
            "A rise in creatinine of up to 30 percent after an ACE inhibitor can be accepted. A rise well above 30 percent is reassessed and the drug is reduced or stopped. From 1.0 to 1.6 is not a small hemodynamic change. Volume status is already adequate, so the dose is not simply continued."),
  wrongs=[
    W("Yes. Any rise short of a doubling is ignored", "The accepted rise is about 30 percent, not a near-doubling."),
    W("Yes, and the dose should be doubled", "A large rise is a reason to reduce the drug, not to increase it."),
    W("No drug in this class can ever change the creatinine", "A small rise is expected. The error is treating 60 percent as if it were that small rise."),
    W("Stop the drug only if potassium exceeds 6", "The creatinine rise is its own reason. The potassium does not have to be 6."),
  ]))

ITEMS.append(Q(37, sex="f", system="respiratory-renal", weight=13, topic="ace-inhibitor", diff=2, subject="nephrology",
  takeaway="A creatinine rise of about 20 percent after an ACE inhibitor is the expected hemodynamic change and is not a reason to stop the drug.",
  citation=KDIGO,
  scenario="A 57-year-old woman started an ACE inhibitor for diabetic albuminuria. Her creatinine rose from 1.0 to 1.2 mg/dL. Potassium is 4.5 mEq/L and blood pressure is 124/72 mm Hg. A colleague stops the drug because any rise means acute kidney injury.",
  question="What should happen to the ACE inhibitor after this rise?",
  correct=W("Continue it. A rise from 1.0 to 1.2 is within the accepted range",
            "A creatinine rise of about 20 percent after an ACE inhibitor is the expected hemodynamic change and is not a reason to stop the drug. Twenty percent is under 30 percent. Potassium and pressure are acceptable."),
  wrongs=[
    W("Stop it. Any rise is tubular necrosis", "A 20 percent rise without illness is the hemodynamic effect, not necrosis."),
    W("Add a second ACE inhibitor to pull the creatinine back down", "A second drug from the class is not used."),
    W("Replace it with a nonsteroidal anti-inflammatory drug", "That class worsens kidney perfusion."),
    W("Continue it only if the creatinine later doubles", "Doubling would be a reason to stop, not the condition for continuing."),
  ]))

ITEMS.append(Q(38, sex="m", system="respiratory-renal", weight=13, topic="minimal-change", diff=3, subject="nephrology",
  takeaway="Initial treatment of minimal change disease in adults is high-dose glucocorticoid, not cyclosporine as the first drug.",
  citation=GN,
  scenario="A 22-year-old man has sudden edema, urine protein of 6 g per day, and a biopsy that shows minimal change disease. His creatinine is 0.9 mg/dL. A colleague starts cyclosporine and says steroids are only for children.",
  question="Which drug is the initial treatment?",
  correct=W("High-dose glucocorticoid",
            "Initial treatment of minimal change disease in adults is high-dose glucocorticoid, not cyclosporine as the first drug. Adult disease is still treated with steroid first. Cyclosporine is for relapse or steroid failure, which has not happened."),
  wrongs=[
    W("Cyclosporine first, because adults do not respond to steroids", "Adults are treated with glucocorticoid initially."),
    W("An antibiotic for the proteinuria", "Proteinuria of this pattern is not a bacterial infection."),
    W("No drug until the protein exceeds 10 g per day", "Six grams with this biopsy is already the indication."),
    W("Immediate dialysis", "Creatinine is 0.9 mg/dL. Dialysis is not the treatment of minimal change disease."),
  ]))

ITEMS.append(Q(39, sex="f", system="respiratory-renal", weight=13, topic="bacteriuria", diff=2, subject="infectious-disease",
  takeaway="Asymptomatic bacteriuria in a nonpregnant adult is not treated. Pregnancy is the setting where screening and treatment apply.",
  citation=ASB,
  scenario="A 72-year-old woman has no urinary symptoms. A culture collected before an orthopedic visit grows more than 100,000 colonies of E. coli. She is not pregnant. Her temperature is 36.8 C. A colleague prescribes 7 days of an antibiotic because the colony count is high.",
  question="Does the colony count justify antibiotics?",
  correct=W("No. Without symptoms and without pregnancy, the culture is not treated",
            "Asymptomatic bacteriuria in a nonpregnant adult is not treated. Pregnancy is the setting where screening and treatment apply. A high colony count does not create symptoms she does not have."),
  wrongs=[
    W("Yes. Any culture above 100,000 colonies is treated", "The colony count is how bacteriuria is defined. It is not, by itself, a treatment indication outside pregnancy."),
    W("Yes, because age over 70 makes every positive culture a kidney infection", "Age does not convert asymptomatic bacteriuria into pyelonephritis."),
    W("No antibiotic is appropriate for any woman, including in pregnancy", "Pregnancy is treated. She is not pregnant."),
    W("A 14-day intravenous course, because the organism is E. coli", "The organism does not change the absence of symptoms."),
  ]))

ITEMS.append(Q(40, sex="f", system="respiratory-renal", weight=13, topic="cystitis", diff=3, subject="infectious-disease",
  takeaway="Uncomplicated cystitis is treated with nitrofurantoin, trimethoprim-sulfamethoxazole, or fosfomycin. A fluoroquinolone is not the first drug.",
  citation=UTI,
  scenario="A 26-year-old woman has two days of burning and frequency and no fever, no flank pain, and no vomiting. She is not pregnant. A colleague prescribes ciprofloxacin for 7 days and says that drug is first-line for every urinary infection.",
  question="Which drug class is preferred for this bladder infection?",
  correct=W("Nitrofurantoin for 5 days, or another recommended cystitis drug, not ciprofloxacin first",
            "Uncomplicated cystitis is treated with nitrofurantoin, trimethoprim-sulfamethoxazole, or fosfomycin. A fluoroquinolone is not the first drug. She has no fever and no flank pain, so this is cystitis, and ciprofloxacin is reserved."),
  wrongs=[
    W("Ciprofloxacin for 7 days as the preferred first drug", "Fluoroquinolones are not preferred for uncomplicated cystitis."),
    W("No antibiotic, because burning without fever is not infection", "Cystitis is treated. Fever is not required."),
    W("Amphotericin, because burning is usually fungal", "Fungal therapy is not the uncomplicated regimen."),
    W("Nitrofurantoin for one day only", "The nitrofurantoin course is 5 days, not one day."),
  ]))

"""Step 2 items 81-100."""

from lib import item

SSTI = "IDSA 2014 practice guidelines for skin and soft tissue infections, which remain the IDSA guideline."
TINEA = "AAP Red Book, 2024: tinea capitis requires oral antifungal therapy because topical therapy does not eradicate hair-shaft infection."
STREP = "IDSA 2012 clinical practice guideline for group A streptococcal pharyngitis, which remains the IDSA guidance."
LBP = "American College of Physicians guideline on low back pain, 2017."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
NF = "IDSA 2010 and ASCO 2018 guidance on fever and neutropenia: an empiric antifungal is not started in the first hour of a new fever in a stable patient."
PREG = "ACOG Practice Bulletin on thromboembolism in pregnancy, 2018: acute venous thrombosis is treated with low-molecular-weight heparin, not warfarin and not a DOAC."
CH = "American Headache Society evidence assessment, 2016: 100 percent oxygen is a first-line acute treatment of cluster headache."
SS = "FDA drug-safety communication on serotonin syndrome, 2016: treatment is stopping the serotonergic drugs, not adding another one."
NMS = "Standard critical-care description in the 2023 APA schizophrenia guideline discussion of antipsychotic emergencies: neuroleptic malignant syndrome is treated by stopping the antipsychotic."
NAC = "FDA prescribing information for acetylcysteine, 2024 label: it is the antidote for acetaminophen toxicity and is timed from the ingestion and the level."
RA = "2021 American College of Rheumatology Guideline for the Treatment of Rheumatoid Arthritis, including the recommendation to avoid methotrexate when pregnancy is planned."
BEERS = "American Geriatrics Society Beers Criteria, 2023."
CAP = "ATS/IDSA 2019 guideline on community-acquired pneumonia in adults."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

def add(n, **k):
    ITEMS.append(Q(n, **k))

add(81, sex="m", system="msk-skin", weight=9, topic="necrotizing-infection", diff=4, subject="infectious-disease",
  takeaway="Pain out of proportion, rapid spread, and systemic toxicity are necrotizing infection until proved otherwise. Antibiotics do not replace immediate surgery.",
  citation=SSTI,
  scenario="A 48-year-old man has thigh pain that started 8 hours ago and is now far worse than the skin changes. He has a fever of 39 C, a heart rate of 128/min, and a blood pressure of 88/54 mm Hg. Crepitus is present. A colleague starts broad antibiotics and schedules surgery for the next morning.",
  question="What is the timing of surgery?",
  correct=W("Immediate operative exploration, with antibiotics as an adjunct rather than a reason to wait overnight",
            "Pain out of proportion, rapid spread, and systemic toxicity are necrotizing infection until proved otherwise. Antibiotics do not replace immediate surgery. Crepitus and shock at 8 hours are the picture. Morning is too late."),
  wrongs=[
    W("Surgery the next morning so antibiotics can work first", "Antibiotics do not sterilize a necrotizing infection in time to delay the operation."),
    W("Oral antibiotics and discharge", "Shock and crepitus are not an outpatient problem."),
    W("Steroids to reduce the pain and no operation", "Steroids do not debride necrotic fascia."),
    W("Observation for 48 hours if the first lactate is normal", "The clinical picture already mandates exploration. A normal lactate would not cancel it."),
  ])

add(82, sex="f", system="msk-skin", weight=9, topic="tinea-capitis", diff=2, subject="dermatology",
  takeaway="Tinea capitis is treated with an oral antifungal. Topical cream does not reach the hair shaft.",
  citation=TINEA,
  scenario="A 7-year-old girl has a scaly bald patch with broken hairs and a positive potassium-hydroxide preparation. She is otherwise well. A colleague prescribes topical clotrimazole cream for 7 days and says oral drugs are only for adults.",
  question="Why does the cream fail?",
  correct=W("The fungus is inside the hair. She needs an oral antifungal such as griseofulvin or terbinafine",
            "Tinea capitis is treated with an oral antifungal. Topical cream does not reach the hair shaft. Age 7 is a typical age for this infection. A 7-day cream does not eradicate it."),
  wrongs=[
    W("Topical clotrimazole for 7 days is curative", "Topical therapy does not clear hair-shaft infection."),
    W("Oral therapy is banned before age 18", "Children are the usual patients, and oral therapy is indicated."),
    W("Antibacterial antibiotics for the scale", "The preparation shows fungus, not bacteria."),
    W("No treatment, because a bald patch always regrows without a drug", "Untreated infection does not reliably clear, and household spread continues."),
  ])

add(83, sex="m", system="blood-lymph-immune", weight=8, topic="strep-pharyngitis", diff=2, subject="infectious-disease",
  takeaway="Confirmed group A streptococcal pharyngitis is treated with penicillin or amoxicillin. A fluoroquinolone is not the drug.",
  citation=STREP,
  scenario="A 14-year-old boy has fever, tonsillar exudate, and a positive rapid streptococcal antigen test. He has no penicillin allergy. His temperature is 38.6 C. A colleague prescribes levofloxacin for 10 days.",
  question="Which antibiotic matches a positive streptococcal test and no allergy?",
  correct=W("Penicillin or amoxicillin, not levofloxacin",
            "Confirmed group A streptococcal pharyngitis is treated with penicillin or amoxicillin. A fluoroquinolone is not the drug. He has no allergy. Ten days of levofloxacin adds toxicity without a guideline role."),
  wrongs=[
    W("Levofloxacin for 10 days as preferred therapy", "Fluoroquinolones are not the streptococcal pharyngitis regimen."),
    W("No antibiotic, because a rapid test cannot guide therapy", "A positive rapid antigen test in this picture is treated."),
    W("Trimethoprim-sulfamethoxazole as the first drug", "That drug is not reliable for group A streptococcus."),
    W("A single dose of azithromycin only if he is allergic, which he is not", "He is not allergic, so penicillin or amoxicillin is the choice. A macrolide is an allergy alternative, not the default."),
  ])

add(84, sex="f", system="msk-skin", weight=9, topic="low-back-pain", diff=2, subject="rheumatology",
  takeaway="Chronic low back pain is treated first with exercise and other non-drug care. An opioid is not the first prescription.",
  citation=LBP,
  scenario="A 46-year-old woman has had low back pain for 5 months. She has no weakness, no cancer history, and no fever. A colleague starts long-acting oxycodone and says exercise is optional if a strong opioid is used.",
  question="What comes before the opioid?",
  correct=W("Exercise and other non-drug treatment. The opioid is not first-line",
            "Chronic low back pain is treated first with exercise and other non-drug care. An opioid is not the first prescription. Five months without a neurologic deficit is not an opioid indication. Movement is the treatment the guideline puts first."),
  wrongs=[
    W("Long-acting oxycodone as the first treatment", "Opioids are not first-line for chronic low back pain."),
    W("Bed rest for a month", "Rest is not the chronic-pain plan."),
    W("Immediate lumbar fusion because the pain has lasted 5 months", "Five months without a deficit is not a fusion indication."),
    W("Antibiotics for presumed chronic disc infection", "There is no fever or other sign that selects an infection."),
  ])

add(85, sex="m", system="respiratory-renal", weight=13, topic="nsaid-ckd", diff=3, subject="nephrology",
  takeaway="NSAIDs are avoided in advanced chronic kidney disease because the class reduces filtration. Pain is treated with a different class.",
  citation=KDIGO,
  scenario="A 72-year-old man has an estimated filtration rate of 24 mL/min/1.73 m2 and knee pain. He has no ulcer. A colleague starts ibuprofen three times a day and says kidney disease is a reason to prefer an oral NSAID over any other analgesic.",
  question="Why is daily ibuprofen the wrong pain drug?",
  correct=W("At a filtration rate of 24, an NSAID can worsen kidney function. Choose a different analgesic",
            "NSAIDs are avoided in advanced chronic kidney disease because the class reduces filtration. Pain is treated with a different class. A rate of 24 is far into that risk. Topical therapy or a non-NSAID analgesic is the safer direction."),
  wrongs=[
    W("Ibuprofen is preferred once the filtration rate is under 30", "That is when the oral NSAID is most harmful."),
    W("Double the ibuprofen if creatinine rises", "A rise would be a reason to stop, not to increase."),
    W("Add an ACE inhibitor and keep the NSAID, because the ACE inhibitor protects against it", "The combination of an NSAID and an ACE inhibitor is a risk, not protection."),
    W("No analgesic of any kind can ever be used in kidney disease", "Pain can be treated. The NSAID is the class to avoid."),
  ])

add(86, sex="f", system="blood-lymph-immune", weight=8, topic="neutropenic-fever", diff=3, subject="infectious-disease",
  takeaway="The first hour of a new neutropenic fever is an antibacterial emergency, not an automatic antifungal start.",
  citation=NF,
  scenario="A 55-year-old woman with neutropenia has a new temperature of 38.7 C for one hour. She is stable, with a blood pressure of 120/70 mm Hg. A colleague starts amphotericin immediately and holds the antibacterial drug until mold grows.",
  question="Which drug class is required in this first hour?",
  correct=W("An antipseudomonal antibacterial drug. An empiric antifungal is not the opening move",
            "The first hour of a new neutropenic fever is an antibacterial emergency, not an automatic antifungal start. She is stable and the fever is one hour old. Mold has not been shown. Amphotericin does not cover the bacteria that kill in the first day."),
  wrongs=[
    W("Amphotericin first, with no antibacterial drug", "Bacteria are the immediate threat. The antifungal is not the opening drug."),
    W("No anti-infective drug for 72 hours", "Fever and neutropenia are treated immediately."),
    W("Vancomycin alone and an antifungal", "Vancomycin does not cover Pseudomonas, and the antifungal is still premature."),
    W("A steroid as the antipyretic and no antimicrobial drug", "A steroid does not treat the infection risk."),
  ])

add(87, sex="f", system="blood-lymph-immune", weight=8, topic="pregnancy-vte", diff=3, subject="hematology",
  takeaway="Acute venous thrombosis in pregnancy is treated with low-molecular-weight heparin. Warfarin and DOACs are not the pregnancy drugs.",
  citation=PREG,
  scenario="A 32-year-old woman is at 22 weeks and has a new iliofemoral deep-vein thrombosis. She is not bleeding. A colleague starts warfarin because it is easy to take by mouth.",
  question="Which anticoagulant is used at 22 weeks?",
  correct=W("Low-molecular-weight heparin, not warfarin",
            "Acute venous thrombosis in pregnancy is treated with low-molecular-weight heparin. Warfarin and DOACs are not the pregnancy drugs. Twenty-two weeks is not a reason to choose an oral anticoagulant that crosses the placenta in a harmful way."),
  wrongs=[
    W("Warfarin by mouth for the rest of pregnancy", "Warfarin is teratogenic and is not the treatment of pregnancy-associated thrombosis."),
    W("A DOAC, because pregnancy is a DOAC indication", "DOACs are not recommended in pregnancy."),
    W("Aspirin 81 mg as sufficient treatment of an iliofemoral clot", "Aspirin does not treat an acute large-vein thrombus."),
    W("No anticoagulant until after delivery", "The thrombus is treated now. Delivery is not the start date."),
  ])

add(88, sex="m", system="behavioral-nervous", weight=12, topic="cluster-headache", diff=3, subject="neurology",
  takeaway="Cluster headache attacks are treated with 100 percent oxygen or a triptan. An opioid is not the acute treatment.",
  citation=CH,
  scenario="A 35-year-old man has severe unilateral orbital pain. He has had attacks for 45 minutes, with a red watery eye on that side, recurring nightly for a week. A colleague prescribes oxycodone and says oxygen is only for lung disease.",
  question="Which acute treatment fits this nightly orbital pain?",
  correct=W("100 percent oxygen, or a triptan. Not oxycodone",
            "Cluster headache attacks are treated with 100 percent oxygen or a triptan. An opioid is not the acute treatment. The short, nightly, unilateral pain with autonomic signs is cluster, not a reason for an opioid."),
  wrongs=[
    W("Oxycodone as the acute cluster drug", "Opioids are not the acute treatment."),
    W("Antibiotics for the red eye", "A red watery eye with this time course is autonomic, not bacterial conjunctivitis."),
    W("Oxygen only if the saturation is under 88 percent", "The oxygen is a cluster treatment at a high flow, not a hypoxia treatment."),
    W("No treatment until the attacks have lasted 6 months", "A week of nightly attacks is already cluster and is treated."),
  ])

add(89, sex="f", system="behavioral-nervous", weight=12, topic="serotonin-syndrome", diff=3, subject="pharmacology",
  takeaway="Serotonin syndrome is treated by stopping the serotonergic drugs. Adding another serotonergic drug makes it worse.",
  citation=SS,
  scenario="A 44-year-old woman takes sertraline. A second clinician added tramadol yesterday. She now has fever of 38.8 C, clonus, and agitation. A colleague gives a dose of a second SSRI to treat the agitation.",
  question="What is done with serotonergic drugs?",
  correct=W("Stop sertraline and tramadol. Do not add another serotonergic drug",
            "Serotonin syndrome is treated by stopping the serotonergic drugs. Adding another serotonergic drug makes it worse. Fever plus clonus after tramadol was added to an SSRI is the syndrome. Supportive care follows. Another SSRI does not."),
  wrongs=[
    W("Add a second SSRI for the agitation", "More serotonin is the cause, not the treatment."),
    W("Continue both drugs and observe at home", "Clonus and fever are not a home observation."),
    W("Start a monoamine oxidase inhibitor to balance the serotonin", "An MAOI with an SSRI is a classic way to cause this syndrome."),
    W("The combination is safe because tramadol is not serotonergic", "Tramadol is serotonergic, which is why it was the second drug."),
  ])

add(90, sex="f", system="msk-skin", weight=9, topic="rheumatoid-pregnancy", diff=3, subject="rheumatology",
  takeaway="Methotrexate is stopped before a planned pregnancy. It is teratogenic and is not continued in order to keep joints quiet.",
  citation=RA,
  scenario="A 33-year-old woman with rheumatoid arthritis wants to conceive in the next month. She takes methotrexate 15 mg weekly and her joints are quiet. A colleague tells her to continue methotrexate through the first trimester so the disease will not flare.",
  question="What happens to methotrexate before conception?",
  correct=W("Stop it before pregnancy. Control the disease with a regimen that is compatible with conception",
            "Methotrexate is stopped before a planned pregnancy. It is teratogenic and is not continued in order to keep joints quiet. A quiet joint exam does not make the drug safe in the first trimester. The disease plan changes. The methotrexate does not stay."),
  wrongs=[
    W("Continue it through the first trimester", "The first trimester is when the teratogenic risk is the reason to have already stopped."),
    W("Double the dose so a flare cannot occur", "A higher dose increases fetal exposure."),
    W("Switch to leflunomide for the month of conception", "Leflunomide is also avoided in pregnancy."),
    W("No change is needed if a pregnancy test today is negative", "A negative test today is why there is still time to stop before conception, not a reason to continue."),
  ])

add(91, sex="m", system="behavioral-nervous", weight=12, topic="nms", diff=3, subject="pharmacology",
  takeaway="Neuroleptic malignant syndrome is treated by stopping the antipsychotic. Rigidity and a very high temperature after a dose increase are not a reason to give more.",
  citation=NMS,
  scenario="A 39-year-old man had his haloperidol dose doubled 3 days ago. Temperature is 40.1 C, muscles are rigid, and creatine kinase is 18,000 U/L. He is not clonus-predominant. A colleague gives an extra haloperidol dose for the agitation.",
  question="What happens to the haloperidol?",
  correct=W("Stop it. More antipsychotic drug worsens the syndrome",
            "Neuroleptic malignant syndrome is treated by stopping the antipsychotic. Rigidity and a very high temperature after a dose increase are not a reason to give more. The creatine kinase of 18,000 fits muscle rigidity. An extra dose is the opposite of treatment."),
  wrongs=[
    W("Give an extra dose to sedate him", "The antipsychotic is the cause of the syndrome."),
    W("Start an SSRI because fever means serotonin syndrome only", "Lead-pipe rigidity after a neuroleptic increase is this syndrome, not a reason to add an SSRI."),
    W("Continue the drug if the creatine kinase is under 100,000", "18,000 is already severe. There is no requirement to reach 100,000."),
    W("Antibiotics alone and no change in the antipsychotic", "Infection may be considered. It does not replace stopping the drug."),
  ])

add(92, sex="f", system="gastrointestinal", weight=8, topic="acetaminophen-toxicity", diff=3, subject="pharmacology",
  takeaway="A toxic acetaminophen level or a history of a large ingestion is treated with acetylcysteine. Waiting for liver-enzyme failure misses the window.",
  citation=NAC,
  scenario="A 19-year-old woman swallowed a large number of acetaminophen tablets about 6 hours ago. She is awake. The 4-hour level, plotted on the treatment nomogram, is above the treatment line. AST is still 28 U/L. A colleague waits for the AST to exceed 1,000 before any antidote.",
  question="Does a still-normal AST delay the antidote?",
  correct=W("No. Start acetylcysteine because the level is already above the treatment line",
            "A toxic acetaminophen level or a history of a large ingestion is treated with acetylcysteine. Waiting for liver-enzyme failure misses the window. AST of 28 is expected this early. The nomogram, not the AST, decides."),
  wrongs=[
    W("Yes. Antidote starts only after AST exceeds 1,000", "The antidote is given to prevent that rise."),
    W("Activated charcoal at 6 hours replaces the antidote", "Charcoal is for the first hour or so. It does not replace acetylcysteine at 6 hours with a toxic level."),
    W("N-acetylcysteine is harmful if the AST is normal", "A normal AST is when the antidote helps most."),
    W("No treatment if she feels well", "Feeling well at 6 hours is typical and does not clear a toxic level."),
  ])

add(93, sex="m", system="msk-skin", weight=9, topic="falls-sedatives", diff=2, subject="geriatrics",
  takeaway="Benzodiazepines are avoided for insomnia in older adults because of falls and confusion.",
  citation=BEERS,
  scenario="A 79-year-old man asks for a sleeping pill. He has fallen once this month. A colleague starts temazepam nightly and says falls are unrelated to sleep drugs.",
  question="Why is nightly temazepam a poor choice?",
  correct=W("Benzodiazepines increase falls in older adults and are on the avoid list for insomnia",
            "Benzodiazepines are avoided for insomnia in older adults because of falls and confusion. He has already fallen. A non-drug sleep plan is preferred. Temazepam adds the next fall risk."),
  wrongs=[
    W("Temazepam is preferred after a fall because sedation prevents wandering", "Sedation is the fall risk, not the protection."),
    W("The avoid list starts at age 95", "Age 79 is an older adult."),
    W("Double the dose after the next fall", "A higher dose increases the risk."),
    W("Add diphenhydramine, which is safer than a benzodiazepine in this age group", "Diphenhydramine is also on the avoid list."),
  ])

add(94, sex="f", system="respiratory-renal", weight=13, topic="pneumonia-duration", diff=3, subject="pulmonology",
  takeaway="Community-acquired pneumonia that is improving is treated for about 5 days, not a reflexive 14-day course.",
  citation=CAP,
  scenario="A 60-year-old woman with pneumonia has been afebrile for 48 hours on antibiotics. She is eating, and her oxygen saturation is 96 percent on room air. A colleague writes a 14-day course because pneumonia is always treated for two weeks.",
  question="How long should the course be if she keeps improving?",
  correct=W("About 5 days, not 14, once she has been stable and afebrile",
            "Community-acquired pneumonia that is improving is treated for about 5 days, not a reflexive 14-day course. She has been afebrile for 48 hours and is eating. Extending to 14 days is the old habit."),
  wrongs=[
    W("Fourteen days for every pneumonia that has improved", "Improvement is the reason the course can be short, not a reason to extend it."),
    W("Stop today even if she has received only one dose", "A minimum effective course is still required. One dose is not five days."),
    W("Six weeks, because a saturation of 96 percent means necrosis", "A saturation of 96 percent on room air is acceptable, not necrosis."),
    W("Switch to an antifungal for the remaining week", "Nothing here suggests fungus."),
  ])

add(95, sex="m", system="gastrointestinal", weight=8, topic="celiac-biopsy", diff=3, subject="gastroenterology",
  takeaway="If serology suggests celiac disease, the duodenal biopsy is done while gluten is still being eaten.",
  citation="American College of Gastroenterology Guideline: Diagnosis and Management of Celiac Disease, 2023.",
  scenario="A 25-year-old man has a high tissue-transglutaminase IgA and a low ferritin. He is still eating gluten. A colleague tells him to stop gluten for 6 weeks and then undergo duodenal biopsy so the pathologist will see a healed intestine.",
  question="Should gluten stop before the biopsy?",
  correct=W("No. Biopsy him while he is still eating gluten",
            "If serology suggests celiac disease, the duodenal biopsy is done while gluten is still being eaten. Six gluten-free weeks can heal the mucosa and make the biopsy falsely normal. The positive antibody is why the biopsy is done, not why the diet starts first."),
  wrongs=[
    W("Yes. Six gluten-free weeks make the biopsy easier to read", "Healing makes the biopsy miss the disease."),
    W("No biopsy is ever needed if the antibody is high", "Adults generally still need histology before a lifelong diet, and the diet must not start first."),
    W("Start prednisone before the biopsy", "A steroid is not the diagnostic step."),
    W("A stool culture instead of a biopsy", "Culture does not diagnose celiac disease."),
  ])

add(96, sex="f", system="gastrointestinal", weight=8, topic="gerd-alarm", diff=2, subject="gastroenterology",
  takeaway="Unintentional weight loss with reflux is an alarm symptom and is investigated, not treated with a longer empiric acid-drug course.",
  citation="American College of Gastroenterology Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease, 2022.",
  scenario="A 66-year-old woman has heartburn and has lost 7 kg without trying. She has already completed 8 weeks of a proton pump inhibitor. A colleague refills it for 6 more months and cancels endoscopy.",
  question="What does the 7 kg weight loss change?",
  correct=W("Endoscopy, because weight loss is an alarm finding after an already completed acid-drug trial",
            "Unintentional weight loss with reflux is an alarm symptom and is investigated, not treated with a longer empiric acid-drug course. She has already had 8 weeks. Six more months of the same drug does not look for a mass or a stricture."),
  wrongs=[
    W("Six more months of the same drug and no procedure", "Alarm symptoms end the empiric strategy."),
    W("Stop all acid drugs and recheck the weight in a year", "A year of observation misses the lesion."),
    W("Antibiotics for presumed ulcer infection without a test", "There is no test yet. The next study is endoscopy."),
    W("A gluten-free diet as the investigation", "Diet change is not a diagnostic test for this alarm symptom."),
  ])

add(97, sex="m", system="respiratory-renal", weight=13, topic="ckd-bicarbonate", diff=3, subject="nephrology",
  takeaway="Chronic metabolic acidosis in CKD, with bicarbonate well below normal, is treated with oral alkali. It is not ignored until bicarbonate is under 8.",
  citation=KDIGO,
  scenario="A 69-year-old man with CKD has a bicarbonate of 16 mEq/L on two checks. He has no diarrhea, and his estimated filtration rate is 28. A colleague says alkali is useless unless bicarbonate is under 8 mEq/L.",
  question="Does a bicarbonate of 16 mEq/L justify oral alkali?",
  correct=W("Yes. Oral alkali is used to correct this acidosis. Waiting for a bicarbonate under 8 is too late",
            "Chronic metabolic acidosis in CKD, with bicarbonate well below normal, is treated with oral alkali. It is not ignored until bicarbonate is under 8. Sixteen, confirmed twice, with no diarrhea to explain it, is the pattern. The filtration rate shows the CKD setting."),
  wrongs=[
    W("No. Alkali starts only under 8 mEq/L", "That threshold is far too low."),
    W("Intravenous hydrochloric acid to raise the bicarbonate", "Acid infusion would worsen acidosis."),
    W("A loop diuretic as the alkali therapy", "A loop diuretic is not how this acidosis is corrected."),
    W("No treatment if the filtration rate is above 15", "A rate of 28 does not cancel treatment of bicarbonate 16."),
  ])

add(98, sex="f", system="behavioral-nervous", weight=12, topic="delirium", diff=2, subject="geriatrics",
  takeaway="Delirium in an older adult is a reason to find the cause, not to start a benzodiazepine as the calming drug.",
  citation=BEERS,
  scenario="An 84-year-old woman is suddenly confused on hospital day 2. She is inattentive and it waxes. Oxygen saturation is 91 percent and she is not withdrawing from alcohol. A colleague orders lorazepam every 4 hours so she will sleep.",
  question="Why is scheduled lorazepam the wrong calming plan?",
  correct=W("It can worsen delirium. Look for the cause, including the oxygen saturation of 91 percent",
            "Delirium in an older adult is a reason to find the cause, not to start a benzodiazepine as the calming drug. She is not in alcohol withdrawal, which is the setting where a benzodiazepine would be the treatment. Scheduled lorazepam sedates her without fixing hypoxia or the other triggers."),
  wrongs=[
    W("Lorazepam on a schedule is the treatment of delirium", "Benzodiazepines worsen ordinary delirium."),
    W("No work-up if she is sleepy after the drug", "Sleepiness from the drug hides the cause."),
    W("The oxygen saturation is irrelevant above 80 percent", "91 percent may be a contributor and is not ignored."),
    W("Start haloperidol and lorazepam together as the required pair", "Adding two sedating drugs is not the first step. The cause comes first."),
  ])

add(99, sex="m", system="msk-skin", weight=9, topic="cellulitis-mark", diff=2, subject="infectious-disease",
  takeaway="The edge of cellulitis is marked and rechecked. Spreading redness on antibiotics is a reason to reassess, not to wait out a fixed 10-day prescription.",
  citation=SSTI,
  scenario="A 50-year-old man with nonpurulent cellulitis was started on cephalexin yesterday. Today the redness is 8 cm past the ink mark, and his temperature is 38.9 C. A colleague says the prescription cannot be changed before day 10.",
  question="What does spread beyond the mark mean?",
  correct=W("Reassess today. The infection is not responding, so the plan changes before day 10",
            "The edge of cellulitis is marked and rechecked. Spreading redness on antibiotics is a reason to reassess, not to wait out a fixed 10-day prescription. Eight centimeters of spread plus a higher fever means the drug or the diagnosis may be wrong. Waiting until day 10 is how a deeper infection is missed."),
  wrongs=[
    W("Never change antibiotics before day 10", "Failure is reassessed when it is seen."),
    W("Stop all antibiotics because spread means allergy", "Spread with fever is infection, not a reason to stop treatment."),
    W("Add a topical steroid and keep the same plan", "A steroid does not treat spreading cellulitis."),
    W("The ink mark is decorative and is not a clinical tool", "The mark is how spread is recognized."),
  ])

add(100, sex="f", system="reproductive-endocrine", weight=10, topic="preconception-ace", diff=3, subject="pharmacology",
  takeaway="ACE inhibitors are stopped before pregnancy because the class is teratogenic. A beta blocker or another allowed drug replaces the blood-pressure treatment.",
  citation="FDA labeling, 2024: ACE inhibitors are contraindicated in pregnancy.",
  scenario="A 31-year-old woman wants to conceive in the next two months. She takes lisinopril for hypertension, and her blood pressure is 128/78 mm Hg on that drug. A colleague tells her to continue lisinopril until a positive pregnancy test.",
  question="When is the ACE inhibitor stopped?",
  correct=W("Before conception, with a different blood-pressure drug that can be used in early pregnancy",
            "ACE inhibitors are stopped before pregnancy because the class is teratogenic. A beta blocker or another allowed drug replaces the blood-pressure treatment. Waiting for a positive test means the embryo is already exposed. Her pressure still needs a drug. It needs a different one."),
  wrongs=[
    W("Continue lisinopril until a pregnancy test is positive", "The exposure happens before the test turns positive."),
    W("Stop all blood-pressure treatment and accept any pressure", "Hypertension still needs treatment. The class changes."),
    W("Switch to losartan, which is safe in the first trimester", "Angiotensin-receptor blockers share the same pregnancy contraindication."),
    W("Double the lisinopril so the pressure stays low after conception", "A higher dose increases exposure."),
  ])

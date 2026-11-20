"""Step 2 items 61-100."""

from lib import item

ATA = "2017 American Thyroid Association guidelines on thyroid disease in pregnancy."
DKA = "ADA consensus report on hyperglycemic crises in adults with diabetes, 2024."
ADA = "American Diabetes Association Standards of Care in Diabetes, 2026."
MEC = "CDC U.S. Medical Eligibility Criteria for Contraceptive Use, 2024."
BEERS = "American Geriatrics Society Beers Criteria, 2023."
ITP = "ASH 2019 guidelines for immune thrombocytopenia."
HIT = "ASH 2018 guidelines for management of heparin-induced thrombocytopenia."
IDA = "AGA clinical practice guidelines on the gastrointestinal evaluation of iron deficiency anemia, 2020."
VTE = "ASCO guideline update on venous thromboembolism prophylaxis and treatment in patients with cancer, 2023."
OSA = "American Academy of Sleep Medicine clinical practice guideline for the treatment of obstructive sleep apnea with positive airway pressure, 2019."
ADREN = "Endocrine Society clinical practice guideline on primary adrenal insufficiency, 2016, which remains the Endocrine Society guidance for emergency glucocorticoid replacement."
ASB = "US Preventive Services Task Force asymptomatic bacteriuria screening recommendation, 2019, and IDSA guidance that pregnant patients with bacteriuria are treated."
MBD = "KDIGO 2017 Clinical Practice Guideline Update for the Diagnosis, Evaluation, Prevention, and Treatment of Chronic Kidney Disease–Mineral and Bone Disorder."
MS = "AAN practice guideline recommendations on disease-modifying therapy and the standard that an acute multiple-sclerosis relapse with disability is treated with high-dose corticosteroid, 2018."
GBS = "AAN evidence review: corticosteroids do not benefit Guillain-Barre syndrome, whereas intravenous immunoglobulin or plasma exchange does."
EC = "CDC U.S. Selected Practice Recommendations for Contraceptive Use, 2024, on emergency contraception."
SCZ = "APA Practice Guideline for the Treatment of Patients With Schizophrenia, 2020."
PTSD = "VA/DoD Clinical Practice Guideline for Posttraumatic Stress Disorder, 2023."
LBP = "American College of Physicians guideline on noninvasive treatments for low back pain, 2017."
OA = "2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis of the Hand, Hip, and Knee."
SSTI = "IDSA 2014 practice guidelines for skin and soft tissue infections, which remain the IDSA guideline."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
NF = "ASCO/IDSA 2018 and IDSA guidance: antifungal therapy is not started at the first hour of neutropenic fever."
CEL = "American College of Gastroenterology Guideline: Diagnosis and Management of Celiac Disease, 2023."
GERD = "American College of Gastroenterology Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease, 2022."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

ITEMS += [
Q(61, sex="f", system="reproductive-endocrine", weight=10, topic="thyroid-pregnancy", diff=3, subject="endocrinology",
  takeaway="Hypothyroidism in pregnancy is treated by increasing levothyroxine. Methimazole is not a treatment for a high TSH.",
  citation=ATA,
  scenario="A 30-year-old woman is at 8 weeks and takes levothyroxine 75 mcg. TSH is 6.2 mIU/L and free T4 is low-normal. She feels cold. A colleague stops levothyroxine and starts methimazole because a thyroid number in pregnancy is treated with an antithyroid drug.",
  question="Which direction does the levothyroxine dose move?",
  correct=W("Increase it. Methimazole treats an overactive gland, which she does not have",
            "Hypothyroidism in pregnancy is treated by increasing levothyroxine. Methimazole is not a treatment for a high TSH. A TSH of 6.2 in the first trimester is above the pregnancy target. Stopping the hormone would worsen the deficit."),
  wrongs=[
    W("Stop levothyroxine and start methimazole", "Methimazole is for hyperthyroidism. Her TSH is high, not suppressed."),
    W("No change until after delivery", "The dose is adjusted during pregnancy, not deferred until birth."),
    W("Radioiodine this month", "Radioiodine is contraindicated in pregnancy."),
    W("Iodine drops in place of the hormone", "Iodine does not replace levothyroxine when the TSH is already high on treatment."),
  ]),
Q(62, sex="f", system="reproductive-endocrine", weight=10, topic="thyroid-pregnancy", diff=3, subject="endocrinology",
  takeaway="In the first trimester, propylthiouracil is preferred over methimazole for hyperthyroidism because methimazole is more teratogenic then.",
  citation=ATA,
  scenario="A 27-year-old woman is at 9 weeks with a TSH below 0.01 mIU/L, a high free T4, and tremor. She is not in storm. A colleague starts methimazole and says the trimester does not change the drug.",
  question="Which antithyroid drug fits 9 weeks?",
  correct=W("Propylthiouracil during the first trimester, not methimazole",
            "In the first trimester, propylthiouracil is preferred over methimazole for hyperthyroidism because methimazole is more teratogenic then. Nine weeks is the first trimester. After that window the drugs may be reconsidered because propylthiouracil has liver toxicity. Right now the trimester chooses the drug."),
  wrongs=[
    W("Methimazole, because the trimester never changes the choice", "The first trimester is exactly when the choice changes."),
    W("Radioiodine at 9 weeks", "Radioiodine is not used in pregnancy."),
    W("Levothyroxine, because tremor means the gland is underactive", "A suppressed TSH and a high free T4 are overactivity."),
    W("No drug until the second trimester", "Overt hyperthyroidism is treated now. The drug is what changes, not the decision to treat."),
  ]),
Q(63, sex="m", system="reproductive-endocrine", weight=10, topic="dka", diff=3, subject="endocrinology",
  takeaway="If potassium is below 3.3 mEq/L in diabetic ketoacidosis, potassium is replaced before insulin. Insulin would drive the potassium lower.",
  citation=DKA,
  scenario="A 19-year-old man has glucose 480 mg/dL, pH 7.18, bicarbonate 10 mEq/L, and potassium 2.9 mEq/L. He is breathing deeply. A colleague starts intravenous insulin immediately and says the potassium can be replaced later.",
  question="What happens to insulin while potassium is 2.9 mEq/L?",
  correct=W("Hold insulin and replace potassium first",
            "If potassium is below 3.3 mEq/L in diabetic ketoacidosis, potassium is replaced before insulin. Insulin would drive the potassium lower. The pH shows he needs insulin soon, but not while the potassium is 2.9."),
  wrongs=[
    W("Start insulin now and replace potassium only if it falls under 2.0", "The hold threshold is 3.3, not 2.0."),
    W("Bicarbonate first and no potassium", "Bicarbonate is not the priority at this potassium."),
    W("Insulin is contraindicated for the entire admission once potassium has been low", "The hold is until potassium is repleted, not a permanent ban."),
    W("Oral potassium only, with no intravenous plan, because he is awake", "Severe deficit in ketoacidosis is replaced promptly, and insulin waits."),
  ]),
Q(64, sex="f", system="reproductive-endocrine", weight=10, topic="contraception", diff=3, subject="gynecology",
  takeaway="Migraine with aura makes combined hormonal contraception an unacceptable risk. A progestin-only method does not carry that same estrogen risk.",
  citation=MEC,
  scenario="A 26-year-old woman has migraine with visual aura. She wants contraception and has no hypertension. A colleague prescribes a combined estrogen-progestin pill and says aura does not change eligibility.",
  question="Why is the combined pill the wrong method?",
  correct=W("Aura puts combined hormonal contraception in the unacceptable-risk category",
            "Migraine with aura makes combined hormonal contraception an unacceptable risk. A progestin-only method does not carry that same estrogen risk. The concern is stroke. A normal blood pressure does not remove the aura."),
  wrongs=[
    W("Combined pills are preferred when aura is present", "Aura is a reason to avoid estrogen, not to prefer it."),
    W("No contraceptive method is safe once aura exists", "Progestin-only methods and intrauterine devices remain options."),
    W("The risk applies only after age 45", "Age 26 with aura is already unacceptable for combined hormones."),
    W("Add an estrogen patch on top of the pill", "More estrogen deepens the problem."),
  ]),
Q(65, sex="m", system="reproductive-endocrine", weight=10, topic="metformin-b12", diff=2, subject="endocrinology",
  takeaway="Long-term metformin is associated with vitamin B12 deficiency. Numbness or anemia is a reason to check B12, not to ignore it because glucose is controlled.",
  citation=ADA,
  scenario="A 64-year-old man has taken metformin for 8 years. A1c is 6.9 percent. He has numb feet and a hemoglobin of 11.2 g/dL with a high mean cell volume. A colleague says the numbness is expected aging and does not check B12.",
  question="Which level should be checked?",
  correct=W("Vitamin B12, because long-term metformin and this blood count point to deficiency",
            "Long-term metformin is associated with vitamin B12 deficiency. Numbness or anemia is a reason to check B12, not to ignore it because glucose is controlled. A high mean cell volume with numbness is the pattern. A controlled A1c does not answer it."),
  wrongs=[
    W("No level. Numbness on metformin is normal and untested", "The standards specifically tie this drug to B12 deficiency."),
    W("A folate level only, because metformin depletes folate and not B12", "The deficiency linked to metformin is B12."),
    W("Stop checking forever if one glucose is normal", "Glucose control is not a B12 result."),
    W("An immediate switch to a sulfonylurea without a B12 level", "The level explains the numbness. A sulfonylurea does not diagnose it."),
  ]),
Q(66, sex="f", system="behavioral-nervous", weight=12, topic="beers-anticholinergic", diff=2, subject="geriatrics",
  takeaway="Strongly anticholinergic drugs such as oxybutynin are avoided in older adults because of confusion, constipation, and falls.",
  citation=BEERS,
  scenario="An 82-year-old woman has urge incontinence. She already has mild forgetfulness. A colleague starts oxybutynin and says bladder drugs do not affect thinking.",
  question="Why is oxybutynin a poor choice at age 82?",
  correct=W("It is a strong anticholinergic drug, which the Beers Criteria say to avoid in older adults",
            "Strongly anticholinergic drugs such as oxybutynin are avoided in older adults because of confusion, constipation, and falls. She already has forgetfulness. A non-drug bladder strategy or a less anticholinergic option is preferred."),
  wrongs=[
    W("Oxybutynin is preferred after age 80 because confusion protects the bladder", "Confusion is a harm, not a benefit."),
    W("The age cutoff for this warning is 95", "The criteria apply to older adults, and 82 is inside that group."),
    W("Double the dose if she becomes more confused", "More drug would worsen the anticholinergic effect."),
    W("Add diphenhydramine at night so the bladder drug works better", "Diphenhydramine is another strong anticholinergic drug and adds the same harm."),
  ]),
Q(67, sex="m", system="blood-lymph-immune", weight=8, topic="itp", diff=3, subject="hematology",
  takeaway="When immune thrombocytopenia needs a rapid platelet rise for surgery or serious bleeding, IVIG or a similar rescue is used. Steroids alone are too slow for that emergency.",
  citation=ITP,
  scenario="A 45-year-old man with immune thrombocytopenia has a platelet count of 8,000. He needs urgent surgery for a perforated ulcer tonight. A colleague starts prednisone and says the count will be high enough by morning without IVIG.",
  question="What raises the count fast enough for tonight?",
  correct=W("IVIG, because a corticosteroid will not lift the count in time for surgery tonight",
            "When immune thrombocytopenia needs a rapid platelet rise for surgery or serious bleeding, IVIG or a similar rescue is used. Steroids alone are too slow for that emergency. Prednisone can still be part of care. It is not the drug that fixes tonight."),
  wrongs=[
    W("Prednisone alone, because every count responds by the next morning", "Steroids take longer than one night."),
    W("Aspirin so the remaining platelets are stickier", "Aspirin is contraindicated at this count."),
    W("No drug, because surgery can proceed at 8,000", "A perforated ulcer cannot wait on a count of 8,000 without an attempt to raise it."),
    W("Heparin to prevent a clot from the low count", "Heparin does not treat immune thrombocytopenia."),
  ]),
Q(68, sex="f", system="blood-lymph-immune", weight=8, topic="hit", diff=3, subject="hematology",
  takeaway="Platelet transfusion is not given for the low count of heparin-induced thrombocytopenia unless there is serious bleeding.",
  citation=HIT,
  scenario="A 70-year-old woman has a high 4T score and platelets of 55,000. She has no bleeding. A colleague transfuses platelets to 100,000 before starting a non-heparin anticoagulant.",
  question="Is the transfusion needed before the anticoagulant?",
  correct=W("No. Transfusion is for serious bleeding, which she does not have",
            "Platelet transfusion is not given for the low count of heparin-induced thrombocytopenia unless there is serious bleeding. She needs the heparin stopped and a non-heparin anticoagulant. Raising the count with a transfusion is not a prerequisite and can add thrombosis."),
  wrongs=[
    W("Yes. The anticoagulant cannot start until the count is 100,000", "The anticoagulant starts because of the thrombosis risk. The count is not first transfused to 100,000."),
    W("Yes, and heparin is continued during the transfusion", "Heparin stops. Transfusion does not make heparin safe."),
    W("Transfuse only if the count is above 150,000", "That is not a transfusion trigger in either direction."),
    W("No anticoagulant and no transfusion, because a count of 55,000 cannot clot", "The disease causes thrombosis despite the low count."),
  ]),
Q(69, sex="f", system="gastrointestinal", weight=8, topic="iron-deficiency", diff=3, subject="gastroenterology",
  takeaway="Iron deficiency anemia in a postmenopausal woman is evaluated with bidirectional endoscopy, not iron tablets alone.",
  citation=IDA,
  scenario="A 68-year-old woman has hemoglobin 9.6 g/dL, ferritin 8 ng/mL, and no visible blood. She is postmenopausal. A colleague starts oral iron and says endoscopy is only for male patients.",
  question="What evaluation accompanies the iron?",
  correct=W("Bidirectional endoscopy, because postmenopausal iron deficiency is a gastrointestinal source until proved otherwise",
            "Iron deficiency anemia in a postmenopausal woman is evaluated with bidirectional endoscopy, not iron tablets alone. Ferritin of 8 confirms iron deficiency. Sex does not remove the need to look for a colon or gastric source."),
  wrongs=[
    W("Iron tablets and no procedure, because only male patients are endoscoped", "Postmenopausal patients are evaluated the same way."),
    W("A bone-marrow biopsy before any endoscopy", "Marrow is not the first study when ferritin is 8."),
    W("Oral iron for a year, then a scan if the hemoglobin is still low", "A year of uninvestigated deficiency misses a lesion."),
    W("Stool culture as the only test", "Culture does not find the usual bleeding source."),
  ]),
Q(70, sex="m", system="blood-lymph-immune", weight=8, topic="cancer-vte", diff=3, subject="hematology",
  takeaway="Cancer-associated venous thrombosis is treated with a DOAC or low-molecular-weight heparin, not warfarin as the automatic first drug.",
  citation=VTE,
  scenario="A 63-year-old man with metastatic colon cancer has a new femoral-vein thrombus. He is not bleeding and his creatinine clearance is 80 mL/min. A colleague starts warfarin alone and says cancer patients cannot use a DOAC or heparin.",
  question="Which anticoagulant class is appropriate?",
  correct=W("A DOAC or low-molecular-weight heparin, not warfarin as the default",
            "Cancer-associated venous thrombosis is treated with a DOAC or low-molecular-weight heparin, not warfarin as the automatic first drug. He is not bleeding and his kidneys can clear a DOAC. Warfarin is not forbidden forever, but it is not the automatic first choice."),
  wrongs=[
    W("Warfarin alone as the required first drug", "The update moved away from warfarin as the default."),
    W("Aspirin 325 mg as sufficient treatment of a femoral thrombus", "Aspirin does not treat an acute deep-vein thrombus."),
    W("No anticoagulant because cancer is a bleeding disease only", "Cancer is also a clotting disease. The thrombus is treated."),
    W("Inferior vena cava filter as the first treatment in every cancer thrombus", "A filter is not first-line when anticoagulation can be used."),
  ]),
]

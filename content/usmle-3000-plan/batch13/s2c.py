"""Step 2 items 19-45. MSK, blood, renal."""

from lib import item

OA = "2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis of the Hand, Hip, and Knee."
RA = "2021 American College of Rheumatology Guideline for the Treatment of Rheumatoid Arthritis."
LBP = "American College of Physicians guideline on noninvasive treatments for low back pain, 2017."
SSTI = "IDSA 2014 practice guidelines for skin and soft tissue infections, which remain the IDSA guideline."
OST = "US Preventive Services Task Force osteoporosis screening recommendation, 2025."
BONE = "Endocrine Society clinical practice guideline on pharmacological management of osteoporosis in postmenopausal women, 2019."
SPA = "2019 ACR/SAA/SPARTAN recommendations for the treatment of ankylosing spondylitis and nonradiographic axial spondyloarthritis."
ITP = "ASH 2019 guidelines for immune thrombocytopenia."
HIT = "ASH 2018 guidelines for management of heparin-induced thrombocytopenia."
NF = "ASCO/IDSA 2018 guideline for fever and neutropenia, consistent with IDSA guidance that routine vancomycin is not part of the initial regimen."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
GN = "KDIGO 2021 Clinical Practice Guideline for the Management of Glomerular Diseases."
ASB = "US Preventive Services Task Force asymptomatic bacteriuria screening recommendation, 2019."
UTI = "IDSA 2011 guidelines for uncomplicated cystitis and pyelonephritis in women, which remain the IDSA guidance."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

ITEMS.append(Q(19, sex="f", system="msk-skin", weight=9, topic="osteoarthritis", diff=2, subject="rheumatology",
  takeaway="Knee osteoarthritis is treated first with a topical NSAID, not an opioid and not glucosamine as a required drug.",
  citation=OA,
  scenario="A 67-year-old woman has knee pain that is worse with walking and better with rest. Her radiograph shows joint-space narrowing. She has no ulcer history and her creatinine is 0.8 mg/dL. A colleague starts oxycodone and says topical drugs are too weak to try.",
  question="Which drug is the strong first recommendation for her knee?",
  correct=W("A topical NSAID, with an opioid not used as the first drug",
            "Knee osteoarthritis is treated first with a topical NSAID, not an opioid and not glucosamine as a required drug. She can use a topical NSAID. Oxycodone is not the opening recommendation."),
  wrongs=[
    W("Oxycodone as the first analgesic", "Opioids are not the first drug in this guideline."),
    W("Glucosamine as a required disease-modifying pill", "Glucosamine is not a strong recommendation."),
    W("Oral prednisone for three months", "A long systemic steroid course is not the knee regimen."),
    W("Allopurinol, because every painful knee is a crystal disease", "The radiograph and the activity pattern are osteoarthritis, not a reason for a urate drug."),
  ]))

ITEMS.append(Q(20, sex="m", system="msk-skin", weight=9, topic="rheumatoid-arthritis", diff=3, subject="rheumatology",
  takeaway="DMARD-naive rheumatoid arthritis with moderate or high activity starts with methotrexate, not a biologic as the first drug.",
  citation=RA,
  scenario="A 49-year-old man has 10 swollen joints, morning stiffness lasting two hours, and a positive rheumatoid factor. He has never taken a disease-modifying drug. His liver enzymes are normal and he does not drink. A colleague starts a TNF inhibitor alone and says methotrexate is only for people who fail a biologic.",
  question="Which drug is the initial disease-modifying choice?",
  correct=W("Methotrexate, not a biologic as the first drug",
            "DMARD-naive rheumatoid arthritis with moderate or high activity starts with methotrexate, not a biologic as the first drug. His joints and stiffness meet that activity, and nothing here blocks methotrexate."),
  wrongs=[
    W("A TNF inhibitor alone, with methotrexate reserved for biologic failure", "The order is the reverse for a patient who has never had a DMARD."),
    W("Two biologics together on day 1", "Combining biologics is recommended against."),
    W("Prednisone 60 mg indefinitely and no DMARD", "A steroid is not the long-term disease-modifying plan."),
    W("Colchicine, because stiffness means crystals", "The serology and the joint count are not treated as gout."),
  ]))

ITEMS.append(Q(21, sex="f", system="msk-skin", weight=9, topic="rheumatoid-arthritis", diff=3, subject="rheumatology",
  takeaway="Two biologic drugs are not combined in rheumatoid arthritis.",
  citation=RA,
  scenario="A 54-year-old woman takes methotrexate and still has several swollen joints. A colleague adds both a TNF inhibitor and a second biologic on the same day so the response will be faster. Her blood counts are normal.",
  question="Why is the pair of biologics the wrong addition?",
  correct=W("One biologic may be added. Two biologics together are recommended against",
            "Two biologic drugs are not combined in rheumatoid arthritis. She may need a change from methotrexate alone, but the change is one targeted drug, not two at once. Infection risk is the reason the combination is rejected."),
  wrongs=[
    W("Two biologics are required whenever methotrexate is imperfect", "Imperfect control does not justify two biologics."),
    W("Stop methotrexate and use no replacement", "Stopping the only DMARD is not the escalation."),
    W("Add an opioid and keep both biologics", "An opioid does not fix the biologic combination."),
    W("The combination is safe if the neutrophil count is normal today", "A normal count today does not make dual biologics recommended."),
  ]))

ITEMS.append(Q(22, sex="m", system="msk-skin", weight=9, topic="low-back-pain", diff=2, subject="rheumatology",
  takeaway="Acute low back pain without a red flag does not get imaging, and it does not start with an opioid.",
  citation=LBP,
  scenario="A 36-year-old man has had low back pain for 6 days after lifting. He has no fever, no cancer history, no weakness, no numbness, and no bowel or bladder change. His straight-leg raise is negative. A colleague orders an immediate MRI and tramadol.",
  question="What is omitted when no red flag is present?",
  correct=W("Immediate MRI and an opioid. He is treated with activity and non-drug measures first",
            "Acute low back pain without a red flag does not get imaging, and it does not start with an opioid. Six days, a negative leg raise, and no neurologic deficit are not MRI criteria. Heat and staying active come first."),
  wrongs=[
    W("Nothing. Every back pain of 6 days gets an MRI and tramadol", "Six days without a red flag is too early for that pair."),
    W("Bed rest for two weeks and no walking", "Bed rest is not the recommendation. Activity is."),
    W("A systemic steroid burst as the required first drug", "A steroid is not the first treatment of ordinary acute back pain."),
    W("Antibiotics for presumed disc infection", "He has no fever and no risk that selects an infection."),
  ]))

ITEMS.append(Q(23, sex="f", system="msk-skin", weight=9, topic="skin-infection", diff=3, subject="infectious-disease",
  takeaway="Nonpurulent cellulitis is treated for streptococci. Empiric MRSA drugs are for purulent infection, not for plain cellulitis.",
  citation=SSTI,
  scenario="A 40-year-old woman has a warm, red, tender shin with no drainable pus and no abscess. Her temperature is 37.4 C and her pulse is 86/min. A colleague prescribes trimethoprim-sulfamethoxazole alone and says every skin redness is MRSA.",
  question="Which coverage fits skin redness without pus?",
  correct=W("A beta-lactam active against streptococci, not MRSA monotherapy",
            "Nonpurulent cellulitis is treated for streptococci. Empiric MRSA drugs are for purulent infection, not for plain cellulitis. Her leg has no pus. Trimethoprim-sulfamethoxazole alone misses the streptococcus that plain cellulitis is."),
  wrongs=[
    W("Trimethoprim-sulfamethoxazole alone, because all cellulitis is MRSA", "Absence of pus points away from routine MRSA monotherapy."),
    W("No antibiotic, because a temperature under 38 C means the redness is allergy", "Cellulitis is still treated when she is not highly febrile."),
    W("Vancomycin plus piperacillin for every outpatient shin infection", "Broad intravenous therapy is not the uncomplicated outpatient regimen."),
    W("Incision of the red skin even though there is no fluctuance", "There is nothing to drain."),
  ]))

ITEMS.append(Q(24, sex="m", system="msk-skin", weight=9, topic="skin-infection", diff=3, subject="infectious-disease",
  takeaway="A drainable abscess is incised. Antibiotics are added when systemic signs are present, and drainage is not skipped.",
  citation=SSTI,
  scenario="A 28-year-old man has a 4 cm fluctuant thigh abscess. His temperature is 38.5 C and his heart rate is 104/min. A colleague prescribes an oral MRSA antibiotic and says cutting the abscess is unnecessary if the drug is started.",
  question="What has to be done to the abscess itself?",
  correct=W("Incise and drain it, and add an antibiotic because he has fever and tachycardia",
            "A drainable abscess is incised. Antibiotics are added when systemic signs are present, and drainage is not skipped. A 4 cm fluctuant collection will not be cured by a pill alone, and his vital signs are a reason to include the antibiotic."),
  wrongs=[
    W("An oral antibiotic and no drainage", "Drainage is the treatment of the collection."),
    W("Drainage and no antibiotic despite fever and a heart rate of 104", "Systemic signs are a reason to add the antibiotic, not to omit it."),
    W("Steroids to shrink the abscess", "Steroids do not drain pus."),
    W("Observation for two weeks because the collection is under 5 cm", "Four centimeters that is fluctuant, with fever, is not a two-week observation."),
  ]))

ITEMS.append(Q(25, sex="f", system="msk-skin", weight=9, topic="osteoporosis-screen", diff=2, subject="rheumatology",
  takeaway="Women aged 65 and older are screened for osteoporosis with bone-density testing. Age 66 is inside that recommendation.",
  citation=OST,
  scenario="A 66-year-old woman has never had a bone-density test. She has no fracture and no smoking history. Her examination is normal. A colleague says screening starts only after the first fracture.",
  question="Is bone-density testing indicated now?",
  correct=W("Yes. She is 66, which is inside the screen that starts at 65",
            "Women aged 65 and older are screened for osteoporosis with bone-density testing. Age 66 is inside that recommendation. A fracture is not required before the first test."),
  wrongs=[
    W("No. The first fracture has to happen before any scan", "The screen is meant to find low density before that fracture."),
    W("Yes, but only with a spine MRI", "The screening test is bone densitometry, not MRI."),
    W("No test until age 80", "The screening age is 65, not 80, so she is already due."),
    W("A serum calcium instead of densitometry", "A normal calcium does not measure bone density."),
  ]))

ITEMS.append(Q(26, sex="f", system="msk-skin", weight=9, topic="osteoporosis-screen", diff=3, subject="rheumatology",
  takeaway="A postmenopausal woman under 65 without increased fracture risk is not offered routine bone-density screening.",
  citation=OST,
  scenario="A 52-year-old woman is two years past menopause. She has no fracture, no parent with a hip fracture, no smoking, no steroid use, and a normal weight. A colleague orders routine densitometry because menopause itself is the indication.",
  question="Does menopause alone at age 52 justify routine screening?",
  correct=W("No. Under 65, routine screening is for increased risk, which she does not have",
            "A postmenopausal woman under 65 without increased fracture risk is not offered routine bone-density screening. Menopause alone is not that risk list. She has none of the factors that would move the test earlier."),
  wrongs=[
    W("Yes. Every woman is screened from the day of menopause", "The universal age is 65. Earlier testing needs increased risk."),
    W("Yes, and treatment starts before the result returns", "There is no result, and there is no fracture to treat blindly."),
    W("No woman is ever screened, including after 65", "Screening at 65 and older is recommended. She is simply younger and low risk."),
    W("A hip x-ray replaces densitometry at this age", "A plain film is not the screening test."),
  ]))

ITEMS.append(Q(27, sex="f", system="msk-skin", weight=9, topic="osteoporosis-treatment", diff=3, subject="rheumatology",
  takeaway="A hip fracture from a fall is enough to start osteoporosis treatment. Densitometry is not a reason to delay the drug.",
  citation=BONE,
  scenario="A 74-year-old woman broke her hip in a fall from standing. The fracture is fixed. She has never had a bone-density test. A colleague says no osteoporosis drug can start until that scan is done next month.",
  question="Does the missing scan delay treatment?",
  correct=W("No. The hip fracture from standing height is already the indication to treat",
            "A hip fracture from a fall is enough to start osteoporosis treatment. Densitometry is not a reason to delay the drug. She can still be scanned, but the drug does not wait a month for the picture."),
  wrongs=[
    W("Yes. No drug is allowed until a T-score returns", "The fracture is the indication. The scan is not a gate."),
    W("Calcium alone for a year and no antiresorptive drug", "Calcium does not replace treatment after a hip fracture."),
    W("A week of high-dose prednisone to strengthen the bone", "A steroid week weakens bone. It is not the treatment."),
    W("Treatment only if a second hip fractures", "The first fragility hip fracture is enough."),
  ]))

ITEMS.append(Q(28, sex="m", system="msk-skin", weight=9, topic="axial-spondyloarthritis", diff=3, subject="rheumatology",
  takeaway="Axial spondyloarthritis starts with an NSAID trial. A TNF inhibitor is not the first prescription when an NSAID has not been tried.",
  citation=SPA,
  scenario="A 27-year-old man has inflammatory back pain for 8 months, worse at night and better with activity. His HLA-B27 is positive and his CRP is high. He has never taken an NSAID. A colleague starts a TNF inhibitor and says NSAIDs are obsolete.",
  question="What is tried before the TNF inhibitor?",
  correct=W("A full NSAID trial, because he has not had one",
            "Axial spondyloarthritis starts with an NSAID trial. A TNF inhibitor is not the first prescription when an NSAID has not been tried. His diagnosis can be right and the first drug can still be an NSAID."),
  wrongs=[
    W("A TNF inhibitor immediately, with no NSAID", "The biologic is not the first drug in a patient who has never tried an NSAID."),
    W("Long-term opioids for night pain", "Opioids are not the disease treatment."),
    W("Antibiotics for presumed infection of the sacroiliac joint", "Eight months of inflammatory pain with this pattern is not treated as acute septic arthritis."),
    W("Bed rest until the CRP normalizes", "Activity is part of care. Rest until the CRP falls is not the plan."),
  ]))

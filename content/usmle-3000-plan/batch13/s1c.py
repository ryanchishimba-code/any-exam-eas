"""Step 1 items 21-60."""

from lib import item

FDA = "FDA prescribing information, 2024 labels, for the named drug's mechanism."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step1", **k)

ITEMS = []

def add(n, **k):
    ITEMS.append(Q(n, **k))

add(21, sex="m", system="gastrointestinal", weight=8, topic="hemochromatosis", diff=2, subject="pathology",
  takeaway="Hereditary hemochromatosis stores iron. Phlebotomy removes it. Deferoxamine is not the first treatment.",
  citation="AASLD practice guidance on hemochromatosis, 2022.",
  scenario="A 52-year-old man has bronze skin, diabetes, and a ferritin of 1,800 ng/mL. Transferrin saturation is 80 percent. He has no anemia. A classmate starts deferoxamine as the first iron-removal method.",
  question="How is the iron removed first?",
  correct=W("Phlebotomy, because he can make new blood and the iron is in stores",
            "Hereditary hemochromatosis stores iron. Phlebotomy removes it. Deferoxamine is not the first treatment. He is not anemic, so he can tolerate blood removal. A chelator is for patients who cannot be phlebotomized."),
  wrongs=[
    W("Deferoxamine first in every patient with a high ferritin", "Chelation is not the opening treatment when phlebotomy is possible."),
    W("Iron tablets, because the skin change means deficiency", "Ferritin of 1,800 is overload."),
    W("Hydroxyurea to raise fetal hemoglobin", "Fetal hemoglobin does not remove iron."),
    W("No removal until cirrhosis is proved by biopsy", "The diagnosis is treated. Biopsy is not a required delay."),
  ])

add(22, sex="f", system="respiratory-renal", weight=13, topic="alpha1", diff=3, subject="pathology",
  takeaway="Alpha-1 antitrypsin deficiency can injure both lung and liver, because the protein is not secreted and the lungs lose a shield against elastase.",
  citation="ATS/ERS statement on alpha-1 antitrypsin deficiency, 2003, still the cited joint statement, with liver retention as the mechanism.",
  scenario="A 34-year-old woman who has never smoked has basilar emphysema and a high ALT. Serum alpha-1 antitrypsin is low. A classmate says nonsmokers cannot get emphysema, so the liver finding is unrelated.",
  question="Why can one protein defect hit both organs?",
  correct=W("The protein is trapped in the liver and missing in the lung",
            "Alpha-1 antitrypsin deficiency can injure both lung and liver, because the protein is not secreted and the lungs lose a shield against elastase. She does not need a smoking history. The low serum level and the two organs are one disease."),
  wrongs=[
    W("The protein is over-secreted and clogs the bronchi", "The serum level is low, not high."),
    W("Only the lung can be involved, so the ALT is a second disease by definition", "The liver retains the misfolded protein."),
    W("Elastase is low, so alveoli collapse from too little enzyme", "The problem is too much elastase activity, not too little."),
    W("Smoking is required for every case of emphysema", "This deficiency causes emphysema without smoking."),
  ])

add(23, sex="m", system="gastrointestinal", weight=8, topic="mesenteric-ischemia", diff=3, subject="pathology",
  takeaway="Pain out of proportion to the exam plus a high lactate is intestinal ischemia until proved otherwise. The next study is vascular imaging, not a laxative.",
  citation="ACG clinical guideline on intestinal ischemia, 2015, still cited for the pain-out-of-proportion presentation.",
  scenario="A 74-year-old man with atrial fibrillation has sudden severe abdominal pain. His abdomen is soft. Lactate is 6 mmol/L and there is occult blood in the stool. A classmate orders a laxative for constipation.",
  question="What does the soft abdomen with severe pain mean?",
  correct=W("The bowel may be ischemic. Image the vessels rather than treat constipation",
            "Pain out of proportion to the exam plus a high lactate is intestinal ischemia until proved otherwise. The next study is vascular imaging, not a laxative. Atrial fibrillation supplies the embolus. A soft abdomen is the classic mismatch."),
  wrongs=[
    W("Constipation, because a soft abdomen cannot be serious", "The mismatch is the warning, not reassurance."),
    W("Peptic ulcer only, because lactate rises in every ulcer", "Lactate of 6 with this pain is ischemia."),
    W("A laxative will drop the lactate", "A laxative does not restore blood flow."),
    W("The pain is not real if the wall is soft", "Ischemic pain precedes peritoneal findings."),
  ])

add(24, sex="f", system="gastrointestinal", weight=8, topic="ascites-saag", diff=2, subject="physiology",
  takeaway="A serum-ascites albumin gradient of 1.1 g/dL or more means portal hypertension. A low gradient means the fluid is not from portal pressure.",
  citation="AASLD practice guidance on ascites, 2021.",
  scenario="A 59-year-old woman with ascites has a serum albumin of 3.2 g/dL and an ascites albumin of 1.4 g/dL. She has a history of heavy alcohol use. A classmate says the gradient is low, so the fluid must be peritoneal carcinomatosis.",
  question="What is the gradient, and what does it mean?",
  correct=W("1.8 g/dL, which is high and fits portal hypertension",
            "A serum-ascites albumin gradient of 1.1 g/dL or more means portal hypertension. A low gradient means the fluid is not from portal pressure. 3.2 minus 1.4 is 1.8, which is above 1.1. Carcinomatosis is the low-gradient pattern."),
  wrongs=[
    W("0.8 g/dL, which is high", "The subtraction is 1.8, and the classmate inverted the meaning."),
    W("1.8 g/dL, which rules out portal hypertension", "1.8 is above the 1.1 cutoff, so portal hypertension is supported."),
    W("The gradient cannot be calculated without a cell count", "The albumin values are enough for the gradient."),
    W("Any ascites in a person who used alcohol is infection, so the gradient is irrelevant", "The gradient still classifies the fluid. Infection is a separate cell count."),
  ])

add(25, sex="m", system="gastrointestinal", weight=8, topic="lactulose", diff=2, subject="pharmacology",
  takeaway="Lactulose treats hepatic encephalopathy by acidifying the colon and trapping ammonia, and by speeding stool loss of nitrogen.",
  citation=FDA,
  scenario="A 61-year-old man with cirrhosis is confused. Asterixis is present and ammonia is high. He starts lactulose and later has several soft stools. A classmate says the drug works by raising colon pH.",
  question="Which colon change traps ammonia?",
  correct=W("A lower colon pH, which converts ammonia to ammonium that cannot be absorbed",
            "Lactulose treats hepatic encephalopathy by acidifying the colon and trapping ammonia, and by speeding stool loss of nitrogen. The classmate had the pH direction backward. Ammonium ion stays in the lumen."),
  wrongs=[
    W("A higher colon pH, which is what lactulose produces", "The sugar is fermented to acid. pH falls."),
    W("Sterilization of the entire gut with no change in pH", "The drug is not an antibiotic."),
    W("Blockade of hepatic alcohol dehydrogenase", "That is not the mechanism, and he is being treated for encephalopathy."),
    W("Increased ammonia production so the brain adapts", "The goal is less ammonia reaching the blood, not more."),
  ])

add(26, sex="f", system="behavioral-nervous", weight=12, topic="wernicke", diff=3, subject="pharmacology",
  takeaway="Thiamine is given before glucose in a malnourished patient, because glucose without thiamine can precipitate Wernicke encephalopathy.",
  citation="ASAM 2020 alcohol-withdrawal guideline, which includes thiamine before glucose in at-risk patients.",
  scenario="A 47-year-old woman with alcohol use disorder is confused and ataxic. She has not eaten for days. A classmate hangs dextrose immediately and says the vitamin can wait until morning.",
  question="What has to come before the dextrose?",
  correct=W("Thiamine, so the glucose load does not consume the last cofactor",
            "Thiamine is given before glucose in a malnourished patient, because glucose without thiamine can precipitate Wernicke encephalopathy. She is already confused and ataxic. Morning is too late for the vitamin."),
  wrongs=[
    W("Nothing. Glucose is always safe to give first", "In this nutrition state the order matters."),
    W("Insulin, because confusion means a high glucose", "There is no high glucose in the vignette, and insulin is not the missing cofactor."),
    W("Folate only, because ataxia is a folate sign", "The acute cofactor for this presentation is thiamine."),
    W("A benzodiazepine instead of any vitamin", "A benzodiazepine may treat withdrawal. It does not replace thiamine before glucose."),
  ])

add(27, sex="m", system="behavioral-nervous", weight=12, topic="seizure-drugs", diff=3, subject="pharmacology",
  takeaway="Ethosuximide blocks thalamic T-type calcium channels and treats absence seizures. Carbamazepine can worsen absence seizures.",
  citation=FDA,
  scenario="A 9-year-old boy has staring spells and a 3-per-second spike-and-wave pattern. A classmate starts carbamazepine because every seizure drug is interchangeable.",
  question="Which drug matches this seizure type?",
  correct=W("Ethosuximide, not carbamazepine",
            "Ethosuximide blocks thalamic T-type calcium channels and treats absence seizures. Carbamazepine can worsen absence seizures. The EEG pattern is absence. A sodium-channel drug used for focal seizures is the wrong class."),
  wrongs=[
    W("Carbamazepine, because the EEG pattern is a focal seizure", "Three-per-second spike and wave is absence, not a focal seizure."),
    W("Ethosuximide, because it blocks sodium channels in the cortex", "Its relevant block is the T-type calcium channel."),
    W("A benzodiazepine as the only long-term absence drug", "A benzodiazepine is not the specific absence therapy."),
    W("No drug, because staring is voluntary", "The EEG shows it is not voluntary."),
  ])

add(28, sex="f", system="behavioral-nervous", weight=12, topic="parkinson", diff=2, subject="pharmacology",
  takeaway="Carbidopa inhibits peripheral dopa decarboxylase so levodopa can reach the brain, and it does not cross into the brain itself in a meaningful way.",
  citation=FDA,
  scenario="A 68-year-old woman with shuffling gait starts carbidopa-levodopa. Nausea is less than when she took levodopa alone. A classmate says carbidopa works by blocking dopamine receptors in the striatum.",
  question="Where does carbidopa act?",
  correct=W("Outside the brain, blocking conversion of levodopa in the periphery",
            "Carbidopa inhibits peripheral dopa decarboxylase so levodopa can reach the brain, and it does not cross into the brain itself in a meaningful way. Less peripheral dopamine means less nausea. It is not a striatal receptor blocker."),
  wrongs=[
    W("In the striatum, as a dopamine-receptor antagonist", "Antagonizing striatal dopamine would worsen the gait."),
    W("In the substantia nigra, by replacing dead neurons", "The drug does not replace neurons."),
    W("On the acetylcholine receptor at the neuromuscular junction", "That is a different synapse."),
    W("As a monoamine oxidase inhibitor in the gut only", "The enzyme it blocks is dopa decarboxylase."),
  ])

add(29, sex="m", system="behavioral-nervous", weight=12, topic="sah", diff=3, subject="pharmacology",
  takeaway="Nimodipine after subarachnoid hemorrhage is used to reduce poor outcome from vasospasm. It is not given to clip the aneurysm.",
  citation="AHA/ASA guideline for the management of aneurysmal subarachnoid hemorrhage, 2023.",
  scenario="A 51-year-old man has a sudden worst headache and subarachnoid blood on CT. The aneurysm is secured. He starts nimodipine. A classmate says the drug is a clot buster for the blood already seen.",
  question="What is nimodipine for?",
  correct=W("Reducing ischemic injury from later vasospasm, not dissolving the blood",
            "Nimodipine after subarachnoid hemorrhage is used to reduce poor outcome from vasospasm. It is not given to clip the aneurysm. The aneurysm was already secured. The drug is a calcium-channel blocker aimed at the delayed phase."),
  wrongs=[
    W("Dissolving the subarachnoid blood like a fibrinolytic", "It is not a fibrinolytic."),
    W("Lowering blood pressure to 90 mm Hg systolic as its only job", "The indication is vasospasm outcome, not a systolic target of 90."),
    W("Replacing the need to secure the aneurysm", "The aneurysm still has to be secured. The drug is additional."),
    W("Treating absence seizures caused by the blood", "Absence seizures are not the indication."),
  ])

add(30, sex="m", system="behavioral-nervous", weight=12, topic="epidural", diff=2, subject="pathology",
  takeaway="An epidural hematoma is arterial, often from the middle meningeal artery, and classically follows a lucid interval. The CT shape is a lens.",
  citation="Standard neurosurgical correlation in the 2020 AANS review of traumatic intracranial hemorrhage.",
  scenario="A 25-year-old man is hit in the temple, wakes up, talks, and then becomes unconscious. CT shows a lens-shaped collection that does not cross suture lines.",
  question="Which vessel bled?",
  correct=W("The middle meningeal artery",
            "An epidural hematoma is arterial, often from the middle meningeal artery, and classically follows a lucid interval. The CT shape is a lens. Bridging veins make the crescent of a subdural hematoma, which can cross sutures."),
  wrongs=[
    W("Bridging veins, because every post-trauma bleed is subdural", "The lens shape and the lucid interval are epidural."),
    W("The anterior communicating artery", "That vessel is a common aneurysm site, not this trauma pattern."),
    W("The cavernous sinus", "That is not the source of a lens-shaped convexity collection."),
    W("A scalp vein, because the collection is outside the skull", "The collection described is intracranial and lens shaped."),
  ])

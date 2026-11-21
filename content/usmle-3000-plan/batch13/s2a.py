"""Step 2 items 1-25. GI and start of MSK. Not used in batch 12."""

from lib import item

UGIB = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
HP = "American College of Gastroenterology Clinical Guideline: Treatment of Helicobacter pylori Infection, 2024."
CEL = "American College of Gastroenterology Guideline: Diagnosis and Management of Celiac Disease, 2023."
GERD = "American College of Gastroenterology Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease, 2022."
AP = "American Gastroenterological Association Guideline on Initial Management of Acute Pancreatitis, 2018."
DIV = "AGA Clinical Practice Update on Medical Management of Colonic Diverticulitis, 2021."
SBP = "AASLD Practice Guidance on the diagnosis, evaluation, and management of ascites and hepatorenal syndrome, 2021."
HCV = "US Preventive Services Task Force hepatitis C virus infection screening recommendation, 2020."
OA = "2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis of the Hand, Hip, and Knee."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

ITEMS.append(Q(1, sex="m", system="gastrointestinal", weight=8, topic="ulcer-hemostasis", diff=3, subject="gastroenterology",
  takeaway="After an ulcer is controlled, aspirin taken for coronary disease is restarted, not stopped for the long term.",
  citation=UGIB,
  scenario="A 68-year-old man had a bleeding duodenal ulcer clipped yesterday. The bleeding has stopped and his hemoglobin is stable at 9.4 g/dL. He had a myocardial infarction three years ago and has taken aspirin 81 mg daily since then. His blood pressure is 128/74 mm Hg. A colleague cancels the aspirin for the next six months so the ulcer can heal.",
  question="What should happen to the aspirin he takes for his coronary disease?",
  correct=W("Restart it once hemostasis is secure, rather than withholding it for months",
            "After an ulcer is controlled, aspirin taken for coronary disease is restarted, not stopped for the long term. He already has hemostasis, a stable hemoglobin, and a secondary-prevention reason for the drug. Stopping it for six months trades a controlled ulcer for a coronary risk the 2021 guideline tells clinicians not to accept."),
  wrongs=[
    W("Stop it for six months so the mucosa can heal", "A long hold removes the coronary protection after the bleeding is already controlled."),
    W("Replace it with a second antiplatelet drug and never resume it", "The coronary indication is the existing aspirin. A substitute antiplatelet drug is not the instruction."),
    W("Continue it only if a new troponin is elevated", "He does not need a new infarct to justify a drug he already takes for an old one."),
    W("Double the dose for one week, then stop", "The dose stays at the prevention dose. Raising it does not treat the ulcer."),
  ]))

ITEMS.append(Q(2, sex="f", system="gastrointestinal", weight=8, topic="ulcer-hemostasis", diff=2, subject="gastroenterology",
  takeaway="A clean-based ulcer does not need endoscopic therapy. High-risk stigmata do.",
  citation=UGIB,
  scenario="A 59-year-old woman had melena and is now stable after fluids, with a blood pressure of 122/70 mm Hg and a hemoglobin of 9.8 g/dL. Endoscopy shows a duodenal ulcer with a clean white base and no visible vessel, clot, or oozing. She has no ongoing pain. A colleague injects epinephrine into the clean base because every ulcer is treated the same way.",
  question="Does this ulcer base need endoscopic therapy?",
  correct=W("No. A clean base is a low-risk stigma and is not injected or clipped",
            "A clean-based ulcer does not need endoscopic therapy. High-risk stigmata do. Her base has no vessel, clot, or active bleeding, so injection only adds a procedure. She can be fed once she is stable."),
  wrongs=[
    W("Yes. Every ulcer base is injected before the endoscope is removed", "Injection is for high-risk stigmata, not a clean base."),
    W("Yes, but only with a clip and never with observation", "A clip is also endoscopic therapy. This base does not need it."),
    W("No, and she should not eat for 72 hours", "A low-risk ulcer does not require a prolonged fast."),
    W("Yes, because a hemoglobin of 9.8 g/dL is itself a high-risk stigma", "The stigma is what is seen on the ulcer, not the hemoglobin number."),
  ]))

ITEMS.append(Q(3, sex="m", system="gastrointestinal", weight=8, topic="h-pylori", diff=3, subject="gastroenterology",
  takeaway="Eradication is confirmed with a breath or stool-antigen test at least 4 weeks after antibiotics, not with serology, and not while a proton pump inhibitor is still on board.",
  citation=HP,
  scenario="A 47-year-old man finished a 14-day course for Helicobacter pylori 10 days ago and is still taking a proton pump inhibitor. He feels better. A colleague orders an antibody test today and says a positive antibody means the treatment failed.",
  question="How is cure confirmed, and when?",
  correct=W("A urea breath test or stool antigen at least 4 weeks after antibiotics, after the acid drug has been held",
            "Eradication is confirmed with a breath or stool-antigen test at least 4 weeks after antibiotics, not with serology, and not while a proton pump inhibitor is still on board. An antibody stays positive after cure, and testing at 10 days while the acid drug continues can look falsely positive for failure."),
  wrongs=[
    W("A serum antibody today, because antibody tracks active infection", "Antibody does not distinguish cure from past infection."),
    W("A stool antigen tomorrow morning while the acid drug continues", "Ten days is too soon, and the acid drug should be held before the test."),
    W("No test if symptoms have gone", "Symptoms can fade without eradication. Cure is confirmed with a test."),
    W("A repeat endoscopy in every patient at 2 weeks", "Endoscopy is not the routine test of cure."),
  ]))

ITEMS.append(Q(4, sex="f", system="gastrointestinal", weight=8, topic="h-pylori", diff=3, subject="gastroenterology",
  takeaway="In the United States, first-line therapy is optimized bismuth quadruple therapy for 14 days, not a 7-day clarithromycin triple as the default.",
  citation=HP,
  scenario="A 36-year-old woman has a positive stool antigen and dyspepsia. She has no penicillin allergy. She has taken a macrolide before for sinusitis. A colleague prescribes a 7-day clarithromycin triple because that was the old default.",
  question="Which first regimen fits current United States resistance patterns?",
  correct=W("Bismuth quadruple therapy for 14 days",
            "In the United States, first-line therapy is optimized bismuth quadruple therapy for 14 days, not a 7-day clarithromycin triple as the default. Clarithromycin resistance is common, and a prior macrolide makes that triple a poor default."),
  wrongs=[
    W("Seven days of clarithromycin, amoxicillin, and a proton pump inhibitor", "That short clarithromycin course is no longer the default first regimen."),
    W("A proton pump inhibitor alone for 8 weeks and no antibiotic", "An acid drug does not eradicate the organism."),
    W("Metronidazole alone for 3 days", "Single-drug therapy is not a regimen."),
    W("Repeat the stool antigen tomorrow and treat only if a culture grows", "A positive stool antigen is already enough to treat. Culture is not required first."),
  ]))

ITEMS.append(Q(5, sex="m", system="gastrointestinal", weight=8, topic="celiac", diff=3, subject="gastroenterology",
  takeaway="Tissue transglutaminase IgA is drawn while gluten is still being eaten. Starting a gluten-free diet first can make the test falsely negative.",
  citation=CEL,
  scenario="A 29-year-old man has had loose stools and a 6 kg weight loss. He stopped eating gluten three weeks ago on his own, and his stools have improved. A colleague now orders tissue transglutaminase IgA and says a negative result will rule the diagnosis out.",
  question="Why is the test hard to trust after three gluten-free weeks?",
  correct=W("The antibody can fall once gluten is removed, so a negative result would not clear him",
            "Tissue transglutaminase IgA is drawn while gluten is still being eaten. Starting a gluten-free diet first can make the test falsely negative. He should return to a gluten-containing diet before the serology, and total IgA is checked so deficiency does not hide the result."),
  wrongs=[
    W("A negative antibody after a gluten-free month rules the disease out for life", "The diet can silence the antibody. That is why the test is done on gluten."),
    W("The test is accurate only after a year without gluten", "The direction is the opposite. Gluten exposure is required."),
    W("Weight loss of 6 kg replaces the need for any antibody", "Weight loss is a reason to test, not a substitute for the test."),
    W("Stool culture is the confirmatory study", "Culture does not diagnose this enteropathy."),
  ]))

ITEMS.append(Q(6, sex="f", system="gastrointestinal", weight=8, topic="gerd", diff=3, subject="gastroenterology",
  takeaway="Dysphagia is an alarm symptom. It gets endoscopy, not another empiric acid-drug course.",
  citation=GERD,
  scenario="A 62-year-old woman has had heartburn for years and now has trouble swallowing solid food for three weeks. She has lost 4 kg. She has already taken a proton pump inhibitor for 8 weeks. A colleague refills the same drug for another 8 weeks and says endoscopy can wait until the second course fails.",
  question="What does the new swallowing trouble change?",
  correct=W("Endoscopy now, because trouble swallowing and weight loss are alarm findings",
            "Dysphagia is an alarm symptom. It gets endoscopy, not another empiric acid-drug course. An 8-week course has already happened. A second empiric course misses a stricture or a mass."),
  wrongs=[
    W("Another 8 weeks of the same acid drug and no procedure", "Alarm symptoms are the reason not to keep treating empirically."),
    W("A barium swallow as the only test and no endoscopy", "Barium does not replace endoscopy when alarm symptoms are present."),
    W("Stop the acid drug and observe the weight for a month", "Observation does not evaluate dysphagia."),
    W("Add an antibiotic for presumed infection of the esophagus", "There is no finding here that selects an antibiotic."),
  ]))

ITEMS.append(Q(7, sex="m", system="gastrointestinal", weight=8, topic="pancreatitis", diff=3, subject="gastroenterology",
  takeaway="Mild acute pancreatitis without infection does not get prophylactic antibiotics.",
  citation=AP,
  scenario="A 44-year-old man has epigastric pain radiating to the back, a lipase of 1,400 U/L, and no fever. His heart rate is 88/min, blood pressure is 130/78 mm Hg, and a CT scan shows pancreatic edema without necrosis or a collection. A colleague starts intravenous antibiotics so the pancreas will not become infected.",
  question="Why are prophylactic antibiotics the wrong addition?",
  correct=W("There is no necrosis and no infection, so antibiotics are not preventive therapy",
            "Mild acute pancreatitis without infection does not get prophylactic antibiotics. Edema alone is not infected necrosis. Fluids and early feeding are the initial plan, not a preventive antibiotic."),
  wrongs=[
    W("Antibiotics are indicated for every lipase above 1,000 U/L", "The lipase confirms the diagnosis. It does not indicate an antibiotic."),
    W("Antibiotics replace the need for fluids", "Fluids are part of initial care. Antibiotics are not the substitute."),
    W("A normal temperature is a reason to add two antibiotics", "Absence of fever argues against infection."),
    W("Antibiotics are held only when CT already shows gas in the pancreas", "Gas would suggest infection. Its absence is not the only time antibiotics are withheld. Mild disease without infection is not an antibiotic indication."),
  ]))

ITEMS.append(Q(8, sex="f", system="gastrointestinal", weight=8, topic="pancreatitis", diff=2, subject="gastroenterology",
  takeaway="Mild acute pancreatitis is fed early. A several-day fast is not required once pain and nausea allow eating.",
  citation=AP,
  scenario="A 38-year-old woman has mild acute pancreatitis. On hospital day 1 her pain is improving, she is not vomiting, and her blood pressure is 118/72 mm Hg. Lipase was 900 U/L at arrival. A colleague keeps her nil by mouth for five days so the pancreas can rest.",
  question="When can she eat?",
  correct=W("As soon as she can, on this first day, rather than after a planned five-day fast",
            "Mild acute pancreatitis is fed early. A several-day fast is not required once pain and nausea allow eating. She is already improving and not vomiting. A five-day nil-by-mouth order is the old rest-the-pancreas habit."),
  wrongs=[
    W("Only after five days with no calories", "Early feeding is recommended. A prescribed five-day fast is not."),
    W("Only after the lipase is back under 100 U/L", "The lipase does not have to normalize before eating."),
    W("Clear liquids for two weeks and no solid food", "Diet is advanced as tolerated. A two-week liquid rule is not the guideline."),
    W("Total parenteral nutrition starting tonight", "Parenteral nutrition is not the initial feeding method in mild disease."),
  ]))

ITEMS.append(Q(9, sex="m", system="gastrointestinal", weight=8, topic="diverticulitis", diff=3, subject="gastroenterology",
  takeaway="Uncomplicated diverticulitis in an immunocompetent patient who can drink does not automatically need antibiotics.",
  citation=DIV,
  scenario="A 58-year-old man has left-lower-quadrant pain and a temperature of 37.6 C. CT shows colonic diverticulitis with wall thickening and no abscess, no perforation, and no free air. He is not immunocompromised, he can drink, and his heart rate is 84/min. A colleague says every CT diagnosis of diverticulitis requires a 10-day antibiotic course.",
  question="Does the absence of an abscess change the antibiotic decision?",
  correct=W("Yes. He can be observed without antibiotics because he is immunocompetent and the scan shows no abscess or perforation",
            "Uncomplicated diverticulitis in an immunocompetent patient who can drink does not automatically need antibiotics. His scan has no abscess, perforation, or free air, and he is not immunosuppressed. A reflex 10-day course is not required."),
  wrongs=[
    W("No. CT inflammation of any kind requires 10 days of antibiotics", "Uncomplicated disease in a patient who can drink is the group in which antibiotics may be omitted."),
    W("Yes, but only if surgery is scheduled the same day", "Surgery is for complications he does not have."),
    W("No, and he also needs nothing by mouth for a week", "He can drink. A week-long fast is not the plan."),
    W("Yes. Antibiotics are omitted only when the temperature is above 39 C", "A higher fever would push the other way, toward treatment and a search for complications."),
  ]))

ITEMS.append(Q(10, sex="f", system="gastrointestinal", weight=8, topic="hepatitis-c-screen", diff=2, subject="gastroenterology",
  takeaway="Adults aged 18 to 79 are screened once for hepatitis C, including people with no reported risk.",
  citation=HCV,
  scenario="A 42-year-old woman has no history of injection drug use, no transfusion, and normal liver enzymes. She has never been tested for hepatitis C. A colleague says screening is only for people who report a risk factor, so no test is offered.",
  question="Is a one-time hepatitis C test indicated?",
  correct=W("Yes. Age 42 is inside the one-time screen of ages 18 to 79, with or without a reported risk",
            "Adults aged 18 to 79 are screened once for hepatitis C, including people with no reported risk. Normal enzymes do not replace the test. She has never been tested."),
  wrongs=[
    W("No. Normal enzymes and no reported risk exclude the need to test", "The recommendation is universal in this age band, not risk-based."),
    W("Yes, but only with a liver biopsy first", "Biopsy is not the screening test."),
    W("No test until age 65", "The band starts at 18, not 65."),
    W("Annual RNA testing for life if the first antibody is negative", "The screen is one-time in average-risk adults, not a yearly RNA."),
  ]))

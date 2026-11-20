"""Step 2 items 11-35."""

from lib import item

SBP = "AASLD Practice Guidance on ascites, spontaneous bacterial peritonitis, and hepatorenal syndrome, 2021."
CEL = "American College of Gastroenterology Guideline: Diagnosis and Management of Celiac Disease, 2023."
GERD = "American College of Gastroenterology Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease, 2022."
UC = "ACG Clinical Guideline: Ulcerative Colitis in Adults, 2019."
OA = "2019 American College of Rheumatology/Arthritis Foundation Guideline for the Management of Osteoarthritis of the Hand, Hip, and Knee."
RA = "2021 American College of Rheumatology Guideline for the Treatment of Rheumatoid Arthritis."
LBP = "American College of Physicians guideline on noninvasive treatments for low back pain, 2017."
SSTI = "IDSA 2014 practice guidelines for skin and soft tissue infections, which remain the IDSA guideline."
OST = "US Preventive Services Task Force osteoporosis screening recommendation, 2025."
BONE = "Endocrine Society clinical practice guideline on pharmacological management of osteoporosis in postmenopausal women, 2019."
SPA = "2019 ACR/SAA/SPARTAN recommendations for axial spondyloarthritis."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step2", **k)

ITEMS = []

ITEMS.append(Q(11, sex="m", system="gastrointestinal", weight=8, topic="ascites-sbp", diff=3, subject="gastroenterology",
  takeaway="Ascitic fluid with at least 250 neutrophils per microliter is treated as spontaneous bacterial peritonitis without waiting for the culture.",
  citation=SBP,
  scenario="A 55-year-old man with cirrhosis has a fever of 38.2 C and diffuse abdominal pain. His blood pressure is 108/64 mm Hg. Paracentesis shows 400 neutrophils per microliter. The culture is still pending. A colleague waits for the culture before any antibiotic because the fluid might be sterile.",
  question="What does a count of 400 neutrophils change while the culture is pending?",
  correct=W("Start antibiotics now. The count already meets the treatment threshold",
            "Ascitic fluid with at least 250 neutrophils per microliter is treated as spontaneous bacterial peritonitis without waiting for the culture. His count is 400, and he is febrile. A pending culture does not delay the first dose."),
  wrongs=[
    W("Wait for the culture, because a count under 1,000 is never treated", "The threshold is 250, not 1,000."),
    W("Start antibiotics only if the serum creatinine is normal", "Kidney function may change albumin use. It does not cancel antibiotics when the count is 400."),
    W("Give albumin and no antibiotic", "Albumin is an adjunct in selected patients. It does not replace the antibiotic."),
    W("Repeat the tap in a week and decide then", "A week of delay is not the plan for this count and this fever."),
  ]))

ITEMS.append(Q(12, sex="f", system="gastrointestinal", weight=8, topic="ascites-sbp", diff=3, subject="gastroenterology",
  takeaway="Removal of more than 5 liters of ascites is followed by albumin. A small tap does not require that infusion.",
  citation=SBP,
  scenario="A 61-year-old woman with cirrhosis has tense ascites. Six liters are removed and she feels better. Her blood pressure is 112/70 mm Hg. A colleague sends her home with no albumin because the fluid looked clear.",
  question="What does a 6 liter removal add?",
  correct=W("Albumin after the tap, because more than 5 liters were removed",
            "Removal of more than 5 liters of ascites is followed by albumin. A small tap does not require that infusion. Six liters crosses that line. Clear fluid does not cancel it."),
  wrongs=[
    W("Nothing. Albumin is reserved for a diagnostic tap of 50 mL", "The volume that triggers albumin is a large removal, above 5 liters."),
    W("A diuretic holiday for a month and no albumin", "A diuretic hold is not the replacement for albumin after a large tap."),
    W("Antibiotics, because every large tap is peritonitis", "Volume removed is not a neutrophil count."),
    W("Albumin only if less than 2 liters were removed", "The direction is the opposite. Larger removals are the ones that get albumin."),
  ]))

ITEMS.append(Q(13, sex="m", system="gastrointestinal", weight=8, topic="variceal-bleed", diff=3, subject="gastroenterology",
  takeaway="Cirrhosis with gastrointestinal bleeding gets short-term antibiotic prophylaxis, not antibiotics only after a fever starts.",
  citation=SBP,
  scenario="A 57-year-old man with known cirrhosis is vomiting blood. His heart rate is 112/min and his blood pressure is 96/60 mm Hg. He has no fever. A colleague withholds antibiotics until a temperature appears, and orders only a proton pump inhibitor.",
  question="Why is waiting for a fever the wrong antibiotic plan?",
  correct=W("Bleeding in cirrhosis is itself the indication for short-term antibiotic prophylaxis",
            "Cirrhosis with gastrointestinal bleeding gets short-term antibiotic prophylaxis, not antibiotics only after a fever starts. He is already bleeding and hypotensive. Absence of fever does not remove the indication."),
  wrongs=[
    W("Antibiotics start only after a temperature above 38 C", "The bleed is the indication. Fever is not required."),
    W("A proton pump inhibitor replaces the antibiotic in cirrhosis", "Acid suppression does not cover the infection risk of variceal bleeding."),
    W("Antibiotics are contraindicated until endoscopy is finished", "Prophylaxis is not delayed for the procedure."),
    W("No antibiotic is ever used if the hemoglobin is still above 8 g/dL", "The hemoglobin is not the switch for this prophylaxis."),
  ]))

ITEMS.append(Q(14, sex="f", system="gastrointestinal", weight=8, topic="celiac", diff=3, subject="gastroenterology",
  takeaway="A negative tissue-transglutaminase IgA does not clear celiac disease until total IgA is known, because IgA deficiency hides the test.",
  citation=CEL,
  scenario="A 24-year-old woman has chronic diarrhea, iron deficiency, and a negative tissue-transglutaminase IgA. She is still eating gluten. Total IgA was not ordered. A colleague tells her the negative antibody ends the evaluation.",
  question="What is missing before that negative antibody is trusted?",
  correct=W("A total IgA level, because deficiency makes the IgA-based test falsely negative",
            "A negative tissue-transglutaminase IgA does not clear celiac disease until total IgA is known, because IgA deficiency hides the test. She is eating gluten, so diet is not the problem. The missing number is total IgA."),
  wrongs=[
    W("Nothing. A negative IgA antibody on a gluten-containing diet is final", "IgA deficiency is a recognized cause of a false negative."),
    W("A gluten-free diet for a month and then a repeat of the same test", "She is already eating gluten. Removing it would make the test less useful."),
    W("Stool fat only, with no immunoglobulin level", "Stool fat does not replace the IgA check."),
    W("An antibiotic trial for tropical sprue before any blood test", "An antibiotic trial is not the next step for this antibody problem."),
  ]))

ITEMS.append(Q(15, sex="m", system="gastrointestinal", weight=8, topic="gerd", diff=2, subject="gastroenterology",
  takeaway="Typical reflux without alarm symptoms gets an 8-week proton pump inhibitor trial, not immediate endoscopy.",
  citation=GERD,
  scenario="A 34-year-old man has heartburn and regurgitation for two months. He has no trouble swallowing, no bleeding, no vomiting, and no weight loss. His examination is normal. A colleague books endoscopy this week and says an acid-drug trial is obsolete.",
  question="What is the first treatment trial?",
  correct=W("An 8-week proton pump inhibitor, with endoscopy reserved for alarm symptoms or failure",
            "Typical reflux without alarm symptoms gets an 8-week proton pump inhibitor trial, not immediate endoscopy. He has none of the alarm findings. Endoscopy is not the opening move."),
  wrongs=[
    W("Endoscopy this week for every new heartburn history", "Without alarm symptoms, the trial comes first."),
    W("An antibiotic for 14 days and no acid drug", "There is no test showing an infection that an antibiotic would treat."),
    W("Daily opioid for the burning", "An opioid is not reflux therapy."),
    W("A gluten-free diet as the acid-suppression method", "Gluten restriction is not the treatment of typical reflux."),
  ]))

ITEMS.append(Q(16, sex="f", system="gastrointestinal", weight=8, topic="ulcerative-colitis", diff=3, subject="gastroenterology",
  takeaway="A colitis flare with new diarrhea is tested for C. difficile before immunosuppression is escalated.",
  citation=UC,
  scenario="A 41-year-old woman with ulcerative colitis has 8 bloody stools a day, up from 2. She is afebrile, her pulse is 96/min, and she is still drinking. She finished an antibiotic last week. A colleague starts high-dose steroids and infliximab the same day and says a stool study would only delay care.",
  question="Which test comes before that escalation?",
  correct=W("A C. difficile assay, because recent antibiotics and a flare can be that infection",
            "A colitis flare with new diarrhea is tested for C. difficile before immunosuppression is escalated. She just finished an antibiotic. Steroids and infliximab on an untested infection can make it worse."),
  wrongs=[
    W("No stool test. Every increase in bloody stools is treated as inflammation alone", "Recent antibiotics make infection a real alternative."),
    W("A serum antibody for Helicobacter and no stool test", "That organism is not the cause of this colonic flare."),
    W("Colonoscopy with dilation before any stool test", "Dilation is not the first step in an acute flare."),
    W("Loperamide around the clock so the count of stools falls", "Antimotility drugs are a poor idea in a severe flare and do not answer the infection question."),
  ]))

ITEMS.append(Q(17, sex="m", system="gastrointestinal", weight=8, topic="gerd", diff=2, subject="gastroenterology",
  takeaway="A proton pump inhibitor for reflux is taken before a meal, not at bedtime, because the pumps are active with food.",
  citation=GERD,
  scenario="A 45-year-old man was prescribed a once-daily proton pump inhibitor for typical reflux and no alarm symptoms. He takes it at bedtime and says it does nothing. His weight is stable and he has no dysphagia. A colleague switches him to a bedtime histamine blocker and says the timing cannot matter.",
  question="When should the once-daily dose be taken?",
  correct=W("Before a meal, not at bedtime",
            "A proton pump inhibitor for reflux is taken before a meal, not at bedtime, because the pumps are active with food. His failure is the timing. A bedtime histamine blocker is not the correction."),
  wrongs=[
    W("At bedtime, because acid injury happens only while asleep", "The drug needs active pumps, which a meal turns on."),
    W("Only after symptoms have already started that day", "It is not a rescue drug taken after the burn starts."),
    W("With an antacid at the same swallow so both work faster", "An antacid at the same time is not the instruction for timing."),
    W("Once a week, because the effect lasts seven days", "The usual reflux trial is a daily dose before food."),
  ]))

ITEMS.append(Q(18, sex="f", system="gastrointestinal", weight=8, topic="ascites-sbp", diff=3, subject="gastroenterology",
  takeaway="A neutrophil count under 250 in ascites, with no other infection sign, is not spontaneous bacterial peritonitis and does not get the peritonitis antibiotic course.",
  citation=SBP,
  scenario="A 63-year-old woman with cirrhosis has a diagnostic tap for new ascites. She has no fever and no abdominal pain. Her blood pressure is 124/76 mm Hg. The fluid has 40 neutrophils per microliter and the culture is pending. A colleague starts a 5-day peritonitis antibiotic course because any ascites is infected until proved otherwise.",
  question="Does a count of 40 neutrophils justify that course?",
  correct=W("No. The treatment threshold is 250 neutrophils, and she has no clinical infection",
            "A neutrophil count under 250 in ascites, with no other infection sign, is not spontaneous bacterial peritonitis and does not get the peritonitis antibiotic course. Forty is well below 250. Culture can still be followed, but the course is not started on this number."),
  wrongs=[
    W("Yes. Any neutrophil in ascites is treated", "The threshold is 250, not the mere presence of neutrophils."),
    W("Yes, but only if albumin is given first", "Albumin does not create an infection that the count does not show."),
    W("No antibiotic is ever appropriate once cirrhosis is known", "A count of 250 or more would be treated. This count is simply below that line."),
    W("Yes, because a pending culture is the same as a positive one", "A pending culture with 40 neutrophils and no symptoms is not a positive diagnosis."),
  ]))

from lib_items import item

REST = []

def add(subject, task, *a):
    REST.append(item(subject, task, *a))

# Gastrointestinal 12
add("gastrointestinal", "pharmacotherapy", "C. difficile first drug", 4,
  "A 68-year-old woman has 8 watery stools a day, 2 days after finishing ceftriaxone. She is normotensive, creatinine is at baseline, and white count is 12,000/mm3. Stool toxin is positive. She is not pregnant.",
  "Which of the following is the most appropriate initial treatment?",
  ["Oral metronidazole", "Oral vancomycin or fidaxomicin", "Intravenous vancomycin alone", "Loperamide as monotherapy", "A cholestyramine binder as the only drug"],
  "Oral vancomycin or fidaxomicin",
  "The 2021 IDSA/SHEA update prefers fidaxomicin, with oral vancomycin an acceptable alternative, for an initial nonfulminant episode. Metronidazole is no longer first line.",
  "Intravenous vancomycin does not reach the colon lumen. Antimotility or a binder alone leaves the toxin-producing infection untreated.",
  "idsa-cdi-2021")

add("gastrointestinal", "pharmacotherapy", "Fulminant C. difficile", 5,
  "A 74-year-old man with toxin-positive C. difficile has a blood pressure of 80/50 mm Hg, a white count of 32,000/mm3, and an ileus. Creatinine has doubled. Oral intake is unreliable.",
  "Which of the following is the most appropriate antibiotic plan?",
  ["Oral metronidazole alone", "High-dose oral vancomycin, plus intravenous metronidazole, and rectal vancomycin if ileus blocks enteral delivery", "Intravenous vancomycin alone", "Fidaxomicin and loperamide", "No antibiotics until a colonoscopy"],
  "High-dose oral vancomycin, plus intravenous metronidazole, and rectal vancomycin if ileus blocks enteral delivery",
  "Fulminant disease (shock, ileus, or megacolon) needs vancomycin delivered into the gut and intravenous metronidazole because enteral delivery may fail. Intravenous vancomycin does not treat the colon.",
  "Metronidazole alone, antimotility with fidaxomicin, and waiting for colonoscopy are the wrong intensity.",
  "idsa-cdi-2021")

add("gastrointestinal", "labs", "Do not test formed stool for C. difficile", 4,
  "A 60-year-old man on a medicine ward has one formed stool. A nurse sends a C. difficile test because he took a cephalosporin last month. He has no abdominal pain or leukocytosis. The laboratory asks whether to run it.",
  "Which of the following is the most appropriate decision?",
  ["Run the test and treat if positive", "Do not test a formed stool in a patient without diarrhea", "Start oral vancomycin before the result", "Repeat the test daily for a week", "Give bezlotoxumab now"],
  "Do not test a formed stool in a patient without diarrhea",
  "C. difficile testing is for unexplained new diarrhea, generally three or more unformed stools in 24 hours. A formed stool produces false positives from colonization.",
  "Treating colonization, daily repeats, and bezlotoxumab without an episode are not indicated.",
  "idsa-cdi-2021")

add("gastrointestinal", "prevention", "Colorectal screening start age", 3,
  "A 46-year-old woman with no symptoms, no family history of colorectal cancer, and no inflammatory bowel disease asks when screening should have started.",
  "Which of the following is the USPSTF starting age for average-risk screening?",
  ["35", "45", "50", "60", "65"],
  "45",
  "USPSTF recommends starting average-risk colorectal cancer screening at age 45 and continuing through 75.",
  "Ages 35, 50, 60, and 65 are not the current start.",
  "uspstf-crc-2021")

add("gastrointestinal", "prevention", "CT colonography interval", 4,
  "A 52-year-old average-risk man completes a CT colonography that shows no polyps. He asks when to repeat that test if he stays with imaging rather than colonoscopy.",
  "Which of the following is the usual rescreen interval after a normal CT colonography?",
  ["1 year", "3 years", "5 years", "10 years", "Never again"],
  "5 years",
  "A normal CT colonography is repeated in 5 years. Colonoscopy after a normal study is 10 years, and stool FIT is yearly. Those intervals are not interchangeable.",
  "Annual imaging, a 3-year cycle, a 10-year cycle, and stopping forever mis-time this modality.",
  "uspstf-crc-2021")

add("gastrointestinal", "diagnosis", "Food impaction and eosinophilic esophagitis", 4,
  "A 26-year-old man with asthma has had a piece of steak stuck for 4 hours. He can handle secretions. He has had two prior impactions. He is hemodynamically stable.",
  "Which of the following is the most appropriate next step?",
  ["Meat tenderizer by mouth", "Endoscopic removal within 24 hours, and biopsy because recurrent impaction suggests eosinophilic esophagitis", "A barium swallow while the bolus is in place", "Discharge if glucagon fails", "Blind nasogastric advancement"],
  "Endoscopic removal within 24 hours, and biopsy because recurrent impaction suggests eosinophilic esophagitis",
  "An esophageal food bolus is removed endoscopically, urgently if he cannot handle secretions and within 24 hours otherwise. Recurrent impaction in a young atopic man is eosinophilic esophagitis until biopsies say otherwise.",
  "Tenderizer, barium on top of a bolus, discharge after failed glucagon, and blind pushing are unsafe.",
  "nccpa-2025")

add("gastrointestinal", "pharmacotherapy", "Azathioprine pretreatment testing", 5,
  "A 30-year-old woman with steroid-dependent Crohn disease is about to start azathioprine. Blood counts and liver tests are normal. She takes no allopurinol.",
  "Which of the following tests should be done before the first dose?",
  ["Dihydropyrimidine dehydrogenase genotype", "TPMT activity or genotype, and NUDT15 genotype", "HLA-B*5701", "G6PD activity only", "Serum tryptase"],
  "TPMT activity or genotype, and NUDT15 genotype",
  "Low TPMT or a NUDT15 variant can cause life-threatening myelosuppression from thiopurines. Both are checked before starting, especially because NUDT15 risk is not limited to one ancestry.",
  "DPYD is for fluorouracil. HLA-B*5701 is for abacavir. G6PD and tryptase do not dose a thiopurine.",
  "nccpa-2025")

add("gastrointestinal", "diagnosis", "Mesenteric ischemia pain out of proportion", 5,
  "A 78-year-old woman with atrial fibrillation not on anticoagulation has 3 hours of severe diffuse abdominal pain. The abdomen is soft. Lactate is 5 mmol/L. Bowel sounds are present.",
  "Which of the following is the most appropriate next imaging?",
  ["Right-upper-quadrant ultrasound only", "CT angiography of the abdomen", "Plain films as the definitive test", "A HIDA scan", "Observation because the abdomen is soft"],
  "CT angiography of the abdomen",
  "Pain out of proportion to a soft examination, atrial fibrillation, and a rising lactate are acute mesenteric ischemia until angiography excludes an embolus. A soft abdomen does not rule it out early.",
  "Ultrasound, HIDA, and plain films look for other diseases and will miss an occluded SMA. Observation wastes bowel.",
  "nccpa-2025")

add("gastrointestinal", "diagnosis", "Gallstone pancreatitis admission", 4,
  "A 48-year-old woman has epigastric pain to the back, lipase 4 times normal, and ALT 310 U/L. She is not hypoxic, creatinine is normal, and she has no SIRS. Ultrasound shows stones and no ductal dilation.",
  "Which of the following is the most appropriate early plan?",
  ["Nothing by mouth for a week", "Pain control, early oral feeding as tolerated, and a plan for cholecystectomy this admission", "Immediate ERCP in the absence of cholangitis or a persistent stone", "Antibiotics for 14 days", "Pancreatic enzyme supplements"],
  "Pain control, early oral feeding as tolerated, and a plan for cholecystectomy this admission",
  "Mild gallstone pancreatitis is fed early and the gallbladder is removed during the same admission to prevent recurrence. ERCP is for cholangitis or a stone that is still blocking the duct.",
  "A week of fasting, routine ERCP, a long antibiotic course, and enzyme supplements are not the mild-disease plan.",
  "nccpa-2025")

add("gastrointestinal", "pharmacotherapy", "H. pylori test of cure", 4,
  "A 40-year-old man finishes 14 days of bismuth quadruple therapy for Helicobacter pylori. He feels well. He asks if a repeat test is needed.",
  "Which of the following is the most appropriate test-of-cure plan?",
  ["No test, because symptoms resolved", "Urea breath test or stool antigen at least 4 weeks after antibiotics and after holding a PPI", "Serology in 1 week", "A PPI the morning of a breath test", "Repeat endoscopy the next day"],
  "Urea breath test or stool antigen at least 4 weeks after antibiotics and after holding a PPI",
  "Cure should be confirmed. Serology stays positive. Antibiotics and PPIs cause false-negative breath and stool tests, so the test waits about 4 weeks off antibiotics and an appropriate PPI hold.",
  "Symptom resolution, early serology, testing on a PPI, and next-day endoscopy do not document eradication.",
  "nccpa-2025")

add("gastrointestinal", "diagnosis", "Spontaneous bacterial peritonitis", 5,
  "A 59-year-old man with cirrhosis and ascites has fever and new confusion. Paracentesis shows 320 neutrophils/mm3 and a gram stain with no organisms yet. He has no surgical abdomen.",
  "Which of the following is the most appropriate next treatment?",
  ["Wait for the culture before any antibiotic", "Albumin consideration and a third-generation cephalosporin now", "Oral metronidazole", "Vancomycin only", "Large-volume paracentesis without antibiotics"],
  "Albumin consideration and a third-generation cephalosporin now",
  "Ascitic neutrophils at or above 250 define spontaneous bacterial peritonitis and treatment starts immediately. A cephalosporin such as cefotaxime covers the usual organisms. Albumin is considered in patients at risk of kidney injury.",
  "Waiting on culture, metronidazole, vancomycin monotherapy, and drainage without antibiotics miss or delay the infection.",
  "nccpa-2025")

add("gastrointestinal", "diagnosis", "Esophageal candidiasis and HIV", 4,
  "A 34-year-old man has odynophagia and oral thrush. He has never had an HIV test. He can swallow liquids.",
  "Which of the following is the most appropriate paired plan?",
  ["Oral fluconazole and an HIV test", "Intravenous amphotericin as the first drug", "Acid suppression only", "Antibiotics for streptococcal pharyngitis", "No HIV test because thrush is always local"],
  "Oral fluconazole and an HIV test",
  "Odynophagia plus thrush is esophageal candidiasis until proved otherwise, and in an adult it is a reason to test for HIV. Fluconazole is first line when he can swallow.",
  "Amphotericin is for refractory disease. Acid suppression, bacterial antibiotics, and skipping the HIV test leave the diagnosis and the immunodeficiency unexamined.",
  "nccpa-2025")

# Musculoskeletal 12
add("musculoskeletal", "diagnosis", "Septic arthritis versus gout", 5,
  "A 62-year-old man with a prosthetic knee has fever and a hot swollen joint. Synovial fluid shows 70,000 white cells with 90% neutrophils. Crystals are not seen. Gram stain is negative.",
  "Which of the following is the most appropriate next step?",
  ["Colchicine only, because a negative Gram stain excludes infection", "Empiric antibiotics and orthopedic drainage; a negative Gram stain does not exclude septic arthritis", "Allopurinol today", "Intra-articular steroid as the only treatment", "Discharge on naproxen"],
  "Empiric antibiotics and orthopedic drainage; a negative Gram stain does not exclude septic arthritis",
  "A prosthetic joint with fever and a very high synovial count is septic until cultures return. Gram stain misses many infections. Crystals, if later found, do not fully exclude co-infection in this setting.",
  "Colchicine, allopurinol, a steroid injection, and naproxen alone delay source control.",
  "nccpa-2025")

add("musculoskeletal", "pharmacotherapy", "Allopurinol during a flare", 4,
  "A 55-year-old man is on day 2 of a first gout flare of the big toe. Urate is 8.4 mg/dL. He has CKD stage 3. He is not on urate-lowering therapy. The flare is being treated with low-dose colchicine.",
  "Which of the following is the most appropriate urate-lowering decision?",
  ["Start allopurinol at 300 mg today and stop colchicine", "Start allopurinol at a low dose while the colchicine is continued, then titrate", "Probenecid is preferred because the eGFR is reduced", "Pegloticase for a first flare", "No urate-lowering therapy is ever indicated after a flare"],
  "Start allopurinol at a low dose while the colchicine is continued, then titrate",
  "Current gout guidance allows urate-lowering therapy during a flare when anti-inflammatory coverage is already in place. The dose starts low in CKD and is titrated to the urate target. Colchicine is not stopped.",
  "A full 300 mg start, probenecid when the eGFR is reduced, pegloticase for a first flare, and never treating hyperuricemia are the incorrect choices.",
  "nccpa-2025")

add("musculoskeletal", "pharmacotherapy", "Do not stop allopurinol during a flare", 4,
  "A 60-year-old man has been stable on allopurinol 300 mg with a urate of 5.2 mg/dL. He has a new podagra flare after a steak dinner. Kidney function is unchanged.",
  "Which of the following is the most appropriate allopurinol instruction?",
  ["Stop allopurinol until the flare ends", "Continue allopurinol and treat the flare", "Double allopurinol tonight", "Switch to probenecid today", "Add a second xanthine oxidase inhibitor"],
  "Continue allopurinol and treat the flare",
  "Once urate-lowering therapy is established, it is continued through a flare. Stopping it causes the urate to swing and invites more attacks.",
  "Doubling the dose, swapping to probenecid, or stacking two xanthine oxidase inhibitors is not how a single flare on a therapeutic urate is handled.",
  "nccpa-2025")

add("musculoskeletal", "intervention", "Open fracture antibiotics and time", 4,
  "A 24-year-old man has a tibial fracture with bone visible through a 3-cm wound. Distal pulses are present. Tetanus status is unknown. The operating room is being set up.",
  "Which of the following is the most appropriate immediate addition?",
  ["Wait for the operating room to give the first antibiotic", "A first-generation cephalosporin now, tetanus prophylaxis, and operative debridement", "Oral cephalexin at home tonight", "A steroid pack", "Primary closure in the emergency department without debridement"],
  "A first-generation cephalosporin now, tetanus prophylaxis, and operative debridement",
  "Open fractures need early antibiotics, tetanus update, and surgical debridement. The first antibiotic dose should not wait for the incision.",
  "Home oral therapy, steroids, and closure without a washout increase infection.",
  "nccpa-2025")

add("musculoskeletal", "diagnosis", "Compartment syndrome", 5,
  "A 19-year-old man has a tibial fracture in a cast. He has pain out of proportion, pain on passive toe stretch, and a tense compartment. Pulses are still palpable.",
  "Which of the following is the most appropriate next step?",
  ["Reassure him because pulses are present", "Remove the cast and perform fasciotomy; do not wait for an absent pulse", "Elevation above the heart and recheck in 6 hours", "A nerve-conduction study tomorrow", "Anticoagulation"],
  "Remove the cast and perform fasciotomy; do not wait for an absent pulse",
  "Compartment syndrome is a clinical diagnosis. Pulses are often preserved until late. Passive stretch pain and a tense compartment mean the compartment is opened now.",
  "Waiting on the pulse, elevation alone, next-day nerve studies, and anticoagulation lose muscle.",
  "nccpa-2025")

add("musculoskeletal", "diagnosis", "Cauda equina", 5,
  "A 48-year-old man has severe low-back pain, bilateral leg weakness, saddle numbness, and has not voided in 10 hours. Post-void residual is 450 mL.",
  "Which of the following is the most appropriate next step?",
  ["Six weeks of physical therapy before imaging", "Emergency MRI and surgical consultation", "A plain film as the definitive test", "Oral prednisone and clinic follow-up", "Epidural steroid tonight in the clinic"],
  "Emergency MRI and surgical consultation",
  "Saddle anesthesia, bilateral deficits, and urinary retention are cauda equina until imaging and a surgeon say otherwise. Hours matter.",
  "Routine therapy, plain films, steroids, and a clinic injection delay decompression.",
  "nccpa-2025")

add("musculoskeletal", "pharmacotherapy", "Osteoporosis after a hip fracture", 4,
  "A 78-year-old woman has a fragility hip fracture. Vitamin D is replete. eGFR is 62 mL/min/1.73 m2. She has no esophageal stricture. T-score is not back yet.",
  "Which of the following is the most appropriate bone plan?",
  ["Calcium alone", "Start an antiresorptive agent; a fragility hip fracture is an indication even before the T-score returns", "Estrogen as the first drug", "Calcitonin as preferred long-term therapy", "No treatment because she is over 75"],
  "Start an antiresorptive agent; a fragility hip fracture is an indication even before the T-score returns",
  "A hip fracture from standing height is osteoporosis treatment territory. An oral bisphosphonate is reasonable with a safe esophagus and adequate GFR, after calcium and vitamin D are addressed.",
  "Calcium alone, estrogen first, long-term calcitonin, and age as a reason to withhold treatment are not the plan.",
  "nccpa-2025")

add("musculoskeletal", "pharmacotherapy", "Denosumab holiday warning", 5,
  "A 75-year-old woman has taken denosumab every 6 months for 3 years. She feels well and wants to 'take a year off' with no replacement drug. Her last dose was due last week.",
  "Which of the following is the most appropriate advice?",
  ["A drug holiday is as safe as with a bisphosphonate", "Do not stop denosumab without a plan; stopping is followed by rebound vertebral fractures", "Stop forever because 3 years is the maximum", "Switch to estrogen", "Skip the dose and recheck in 2 years"],
  "Do not stop denosumab without a plan; stopping is followed by rebound vertebral fractures",
  "Unlike bisphosphonates, denosumab does not stay in bone. Interrupting it without another antiresorptive can cause rapid bone loss and multiple vertebral fractures.",
  "A casual holiday, a hard stop at 3 years, estrogen, and a 2-year gap are unsafe.",
  "nccpa-2025")

add("musculoskeletal", "diagnosis", "Slipped capital femoral epiphysis", 4,
  "A 12-year-old boy with a BMI of 33 kg/m2 has 3 weeks of limp and knee pain. Hip internal rotation is limited. He is afebrile. Knee films were normal.",
  "Which of the following is the most appropriate next imaging?",
  ["Repeat knee films only", "Pelvis and frog-leg lateral hip films", "Bone scan as the first test", "Lumbar puncture", "No imaging because the knee film was normal"],
  "Pelvis and frog-leg lateral hip films",
  "Knee pain in an adolescent with obesity and limited hip rotation is a slipped capital femoral epiphysis until the hip is filmed, including a lateral view. The slip is pinned, and the other hip is examined.",
  "More knee films, a bone scan first, a lumbar puncture, and no imaging miss the hip.",
  "nccpa-2025")

add("musculoskeletal", "diagnosis", "Septic hip versus transient synovitis", 4,
  "A 5-year-old boy has fever of 39 C, refuses to bear weight, and holds the hip flexed and externally rotated. CRP and white count are high. Ultrasound shows an effusion.",
  "Which of the following is the most appropriate next step?",
  ["Ibuprofen and recheck in 3 days", "Urgent aspiration of the hip", "A week of observation", "Oral cephalexin without aspiration", "Reassurance that fever excludes infection"],
  "Urgent aspiration of the hip",
  "Fever, non-weight-bearing, and an effusion are septic arthritis until the fluid is examined. Aspiration both diagnoses and starts source control. Transient synovitis is the diagnosis of exclusion in a well child.",
  "Delayed ibuprofen, empiric oral antibiotics without fluid, and reassurance leave a hip joint at risk.",
  "nccpa-2025")

add("musculoskeletal", "pharmacotherapy", "Bisphosphonate acute-phase reaction", 3,
  "A 70-year-old woman had her first zoledronic acid infusion yesterday. Today she has fever of 38.1 C, myalgias, and fatigue. Calcium and creatinine are unchanged. She looks well.",
  "Which of the following is the most appropriate management?",
  ["Acetaminophen and reassurance that the reaction is self-limited", "Stop all future osteoporosis treatment", "Blood cultures and vancomycin", "Intravenous calcium", "A prednisone taper as required therapy"],
  "Acetaminophen and reassurance that the reaction is self-limited",
  "A first intravenous bisphosphonate often causes a transient cytokine reaction. It is treated symptomatically and does not recur as strongly with later doses.",
  "Abandoning therapy, empiric vancomycin, calcium, and mandatory steroids overtreat a known reaction.",
  "nccpa-2025")

add("musculoskeletal", "prevention", "Fall prevention is exercise", 3,
  "A 76-year-old woman who lives at home fell once last year without injury. Vitamin D is normal. She asks for a pill to prevent falls.",
  "Which of the following is the intervention with the best support?",
  ["High-dose vitamin D because her level is normal", "Balance and strength exercise", "A bedtime benzodiazepine", "Hip protectors as the only step", "Bed rest"],
  "Balance and strength exercise",
  "Exercise that trains balance and strength reduces falls in community-dwelling older adults. Vitamin D does not prevent falls when the level is already normal, and sedatives increase them.",
  "Extra vitamin D, a benzodiazepine, hip protectors alone, and bed rest are not the effective plan.",
  "nccpa-2025")

# Neurologic 10
add("neurologic", "pharmacotherapy", "tPA exclusions that are outdated", 5,
  "A 68-year-old man has a sudden right hemiparesis that began 90 minutes ago. Glucose is 140 mg/dL. CT shows no hemorrhage. NIHSS is 8. He had a mild concussion 2 years ago and takes aspirin. Blood pressure is 170/95 mm Hg.",
  "Which of the following is the most appropriate thrombolysis decision?",
  ["Withhold alteplase because he takes aspirin", "Give alteplase; aspirin use and a remote concussion are not exclusions, and the pressure can be lowered under 185/110", "Withhold alteplase because the NIHSS is under 10", "Give heparin instead", "Observe for 24 hours before any reperfusion"],
  "Give alteplase; aspirin use and a remote concussion are not exclusions, and the pressure can be lowered under 185/110",
  "Within 4.5 hours, a disabling deficit and a negative CT are treated with alteplase if blood pressure is brought under 185/110. Single antiplatelet therapy and old minor head trauma are not reasons to withhold.",
  "Heparin is not acute ischemic-stroke treatment. Waiting a day and using NIHSS under 10 as a veto miss the window.",
  "nccpa-2025")

add("neurologic", "intervention", "Thrombectomy window is not the same as tPA", 5,
  "A 72-year-old woman was last known well 10 hours ago. She has a severe left MCA syndrome. CT angiography shows an M1 occlusion and CT perfusion shows a small core with a large penumbra. She is not an alteplase candidate because of the time.",
  "Which of the following is the most appropriate next step?",
  ["No reperfusion is possible after 4.5 hours", "Urgent endovascular consultation for thrombectomy", "Aspirin only, because imaging does not change the clock", "Hemicraniectomy as the first step while she is still following commands", "Intravenous heparin"],
  "Urgent endovascular consultation for thrombectomy",
  "Selected patients with large-vessel occlusion and favorable perfusion imaging can benefit from thrombectomy well beyond the 4.5-hour alteplase window, out toward 16 to 24 hours. The clocks are different.",
  "Stopping at 4.5 hours, aspirin alone, early decompression in a patient who is still a thrombectomy candidate, and heparin are the wrong sequence.",
  "nccpa-2025")

add("neurologic", "pharmacotherapy", "Secondary prevention after TIA", 4,
  "A 66-year-old man had a 20-minute episode of aphasia yesterday that has resolved. MRI shows a small cortical diffusion lesion. He is in sinus rhythm, vessels are not critically stenosed, and a swallow screen is fine. LDL is 110 mg/dL.",
  "Which of the following is the most appropriate long-term antithrombotic plan?",
  ["Warfarin for sinus rhythm", "Antiplatelet therapy and a high-intensity statin", "Alteplase now, a day later", "No drug because the symptoms resolved", "Dual antiplatelet therapy for life"],
  "Antiplatelet therapy and a high-intensity statin",
  "A resolved focal deficit with a diffusion lesion is an ischemic stroke, even if the bedside deficit has cleared. Long-term care is an antiplatelet and high-intensity statin, not anticoagulation, unless atrial fibrillation or another indication appears.",
  "Warfarin for sinus rhythm, late thrombolysis, no treatment, and lifelong dual therapy are not the plan.",
  "nccpa-2025")

add("neurologic", "diagnosis", "Subarachnoid hemorrhage with a negative CT", 5,
  "A 45-year-old woman has a sudden worst-ever headache that peaked in seconds, 8 hours ago. Noncontrast CT is negative. She is alert. Neck is stiff.",
  "Which of the following is the most appropriate next test?",
  ["Discharge, because CT is 100% sensitive all day", "Lumbar puncture looking for xanthochromia or red cells that do not clear", "MRI of the neck only", "Sumatriptan and discharge", "Outpatient neurology in 2 weeks"],
  "Lumbar puncture looking for xanthochromia or red cells that do not clear",
  "CT sensitivity for subarachnoid blood falls with time. A thunderclap headache and a negative CT still need a lumbar puncture. Xanthochromia or persistent red cells support the diagnosis.",
  "Discharge, a neck MRI as the only test, a triptan, and a 2-week delay miss an aneurysmal bleed.",
  "nccpa-2025")

add("neurologic", "pharmacotherapy", "Status epilepticus benzodiazepine first", 4,
  "A 30-year-old man has been seizing for 6 minutes in the emergency department. Glucose is 100 mg/dL. He has intravenous access. This is not a first brief seizure that has already stopped.",
  "Which of the following is the most appropriate first drug?",
  ["Phenytoin before any benzodiazepine", "Intravenous lorazepam", "Oral levetiracetam only", "Observation until 20 minutes", "A paralyzing agent without an EEG or sedative"],
  "Intravenous lorazepam",
  "Ongoing status is treated first with a benzodiazepine. A longer-acting antiseizure drug follows, but it does not replace the benzodiazepine.",
  "Starting with phenytoin, an oral-only drug, waiting to 20 minutes, or paralyzing without sedation hides or delays the seizure.",
  "nccpa-2025")

add("neurologic", "diagnosis", "Giant-cell arteritis vision", 5,
  "A 76-year-old woman has a new temporal headache, jaw fatigue with chewing, and this morning a curtain over the right eye that has partly cleared. ESR is 80 mm/h. The right temple is tender.",
  "Which of the following is the most appropriate immediate treatment?",
  ["Schedule a biopsy and start steroids only after the result", "High-dose corticosteroids now, and arrange a temporal-artery biopsy", "Sumatriptan", "Aspirin as the only drug", "Observation because the curtain cleared"],
  "High-dose corticosteroids now, and arrange a temporal-artery biopsy",
  "Transient monocular vision loss with cranial symptoms is giant-cell arteritis until proved otherwise. Steroids start immediately to protect the other eye. Biopsy follows and remains useful for days after steroids begin.",
  "Waiting on histology, a triptan, aspirin alone, and observation risk bilateral blindness.",
  "nccpa-2025")

add("neurologic", "diagnosis", "Bell palsy versus stroke", 4,
  "A 40-year-old man woke with a droop of the entire left face, including the forehead, and cannot close the left eye. Arm strength and speech are normal. There is no rash.",
  "Which of the following is the most appropriate initial plan?",
  ["Alteplase, because every facial droop is a stroke", "Eye lubrication and a short course of steroids; forehead involvement points to a peripheral seventh nerve", "Antibiotics for otitis", "Anticoagulation", "No eye care is needed"],
  "Eye lubrication and a short course of steroids; forehead involvement points to a peripheral seventh nerve",
  "A stroke spares the forehead because of bilateral cortical innervation. Complete hemifacial weakness is peripheral. The cornea is protected, and steroids are started early.",
  "Thrombolysis, antibiotics, anticoagulation, and ignoring the eye are mismatches.",
  "nccpa-2025")

add("neurologic", "pharmacotherapy", "Migraine in vascular disease", 4,
  "A 52-year-old woman with coronary stents has monthly migraines. She asks for a triptan because a friend uses one. She has no chest pain today.",
  "Which of the following is the most appropriate advice?",
  ["A triptan is preferred because of her stents", "Avoid triptans; use a nonvasoconstricting acute treatment", "Ergotamine is safer than a triptan here", "Daily opioids", "Propranolol is contraindicated in anyone with migraine"],
  "Avoid triptans; use a nonvasoconstricting acute treatment",
  "Triptans and ergots constrict vessels and are avoided in coronary disease. Other acute options, and prevention if attacks are frequent, do not rely on that mechanism.",
  "Choosing a triptan or an ergot because of stents, daily opioids, and a blanket ban on beta blockers are incorrect.",
  "nccpa-2025")

add("neurologic", "diagnosis", "Epidural abscess risk", 5,
  "A 60-year-old man who injects drugs has fever, midline back pain, and new leg weakness. White count is 18,000/mm3.",
  "Which of the following is the most appropriate next step?",
  ["Plain films and a week of NSAIDs", "MRI of the spine and antibiotics after cultures, without waiting on the MRI if he is septic", "Oral cephalexin", "Physical therapy", "A steroid epidural"],
  "MRI of the spine and antibiotics after cultures, without waiting on the MRI if he is septic",
  "Fever, focal back pain, and a deficit in a person who injects drugs is a spinal epidural abscess until MRI excludes it. Antibiotics and a surgeon are not delayed for a plain film.",
  "NSAIDs, oral cephalexin, therapy, and an epidural injection spread or miss the abscess.",
  "nccpa-2025")

add("neurologic", "pharmacotherapy", "Myasthenia crisis trigger", 4,
  "A 35-year-old woman with myasthenia gravis is in crisis with a negative inspiratory force that is falling. A colleague suggests gentamicin for a urinary isolate that is also sensitive to other drugs.",
  "Which of the following is the most appropriate antibiotic decision?",
  ["Use gentamicin because aminoglycosides are safe in myasthenia", "Choose an agent that does not block the neuromuscular junction", "Give succinylcholine electively for comfort", "Add a fluoroquinolone and a macrolide together", "Stop pyridostigmine forever"],
  "Choose an agent that does not block the neuromuscular junction",
  "Aminoglycosides, fluoroquinolones, and macrolides can worsen myasthenia. A sensitive alternative that is not on that list is chosen, and the crisis itself may need intravenous immunoglobulin or plasma exchange plus ventilatory support.",
  "Gentamicin, stacking two offending classes, elective succinylcholine, and stopping cholinesterase inhibition are harmful.",
  "nccpa-2025")

# Infectious disease 10
add("infectious-diseases", "pharmacotherapy", "Nonsevere C. difficile is not metronidazole", 4,
  "A 50-year-old woman has a first episode of nonsevere C. difficile. White count is 11,000/mm3 and creatinine is normal. She asks why she is not getting the metronidazole her brother received years ago.",
  "Which of the following is the best explanation?",
  ["Metronidazole is still first line", "Fidaxomicin or oral vancomycin replaced metronidazole for initial treatment", "She needs intravenous vancomycin", "No antibiotic treats this organism", "Bezlotoxumab replaces antibiotics"],
  "Fidaxomicin or oral vancomycin replaced metronidazole for initial treatment",
  "The 2021 focused update moved initial therapy to fidaxomicin or oral vancomycin. Metronidazole is reserved for when those drugs are unavailable.",
  "Intravenous vancomycin, no treatment, and bezlotoxumab as a substitute are incorrect.",
  "idsa-cdi-2021")

add("infectious-diseases", "diagnosis", "Latent tuberculosis before a TNF inhibitor", 5,
  "A 42-year-old woman is about to start adalimumab for rheumatoid arthritis. She was born in a country with high tuberculosis prevalence. She has no cough. A chest radiograph is normal. An interferon-gamma release assay is positive.",
  "Which of the following is the most appropriate sequence?",
  ["Start adalimumab today and treat tuberculosis if fever appears", "Treat latent tuberculosis and delay the TNF inhibitor until latent therapy is underway", "Ignore the assay because the radiograph is normal", "Give a 2-day antibiotic and start the biologic", "BCG vaccine today"],
  "Treat latent tuberculosis and delay the TNF inhibitor until latent therapy is underway",
  "A positive interferon-gamma release assay with a normal radiograph is latent tuberculosis. TNF blockade can reactivate it, so latent treatment starts before, or at least is established before, the biologic.",
  "Starting the biologic first, ignoring the assay, a 2-day antibiotic, and BCG do not treat latent infection.",
  "nccpa-2025")

add("infectious-diseases", "pharmacotherapy", "Pyelonephritis in pregnancy", 4,
  "A 24-year-old woman at 22 weeks has fever, flank pain, and a positive nitrite test. She is vomiting. She has no penicillin allergy. The fetus is moving.",
  "Which of the following is the most appropriate setting and drug direction?",
  ["Ciprofloxacin and discharge", "Admit for a pregnancy-safe intravenous beta-lactam; avoid fluoroquinolones", "Nitrofurantoin for pyelonephritis", "Trimethoprim-sulfamethoxazole in the first trimester as a routine", "No antibiotics until delivery"],
  "Admit for a pregnancy-safe intravenous beta-lactam; avoid fluoroquinolones",
  "Pyelonephritis in pregnancy is admitted and treated with a beta-lactam that is safe in pregnancy. Fluoroquinolones are avoided, and nitrofurantoin does not treat upper-tract disease.",
  "Discharge on ciprofloxacin, nitrofurantoin, and waiting until delivery under-treat a high-risk infection.",
  "nccpa-2025")

add("infectious-diseases", "pharmacotherapy", "Severe penicillin allergy and syphilis", 4,
  "A 28-year-old man has a painless chancre and a positive treponemal test. He had anaphylaxis to penicillin as a child, confirmed in the record. He has no neurologic symptoms.",
  "Which of the following is the most appropriate plan for primary syphilis?",
  ["Give benzathine penicillin without desensitization", "Doxycycline for 14 days; reserve penicillin desensitization for pregnancy or neurosyphilis", "A single dose of azithromycin", "No treatment if the chancre is healing", "Ceftriaxone ear drops"],
  "Doxycycline for 14 days; reserve penicillin desensitization for pregnancy or neurosyphilis",
  "Penicillin is preferred for syphilis, but a nonpregnant adult with primary syphilis and documented anaphylaxis can be treated with doxycycline 100 mg twice daily for 14 days. Desensitization is the path when penicillin is required, such as pregnancy or neurosyphilis.",
  "A dose of penicillin without desensitization risks anaphylaxis. Azithromycin resistance makes one dose unreliable. A healing chancre and ear drops are not treatment.",
  "cdc-sti-2021")

add("infectious-diseases", "diagnosis", "Necrotizing fasciitis antibiotics are not enough", 5,
  "A 48-year-old man with diabetes has rapidly spreading erythema, bullae, and pain out of proportion on the thigh. He is hypotensive. Lactate is 5 mmol/L.",
  "Which of the following is required in addition to broad antibiotics and fluids?",
  ["A 24-hour antibiotic trial before any surgeon is called", "Immediate surgical exploration", "Oral cephalexin", "Hyperbaric oxygen as the only intervention", "A topical steroid"],
  "Immediate surgical exploration",
  "Necrotizing infection is a surgical diagnosis. Antibiotics and resuscitation do not replace the operating room when pain, bullae, and shock are already present.",
  "A day of antibiotics, oral cephalexin, hyperbaric oxygen alone, and a steroid leave dead tissue in place.",
  "nccpa-2025")

add("infectious-diseases", "pharmacotherapy", "Candidemia is not fluconazole first if unstable", 4,
  "A 70-year-old man in the ICU has a yeast in two blood cultures. He is in shock on norepinephrine. He has not had an eye exam. A central line is in place.",
  "Which of the following is the most appropriate initial antifungal?",
  ["Fluconazole, because every candidemia starts there", "An echinocandin, remove the line if feasible, and do an eye exam", "Nystatin swish only", "Stop the line and give no drug", "Amphotericin ear drops"],
  "An echinocandin, remove the line if feasible, and do an eye exam",
  "Unstable candidemia is started on an echinocandin, not fluconazole. The catheter is removed when possible, and the retina is examined because endophthalmitis changes the drug and the duration.",
  "Fluconazole first in shock, nystatin, no drug, and ear drops do not treat bloodstream Candida.",
  "nccpa-2025")

add("infectious-diseases", "prevention", "HIV post-exposure prophylaxis clock", 4,
  "A nurse has a needlestick from an HIV-positive source 3 hours ago. The source has a detectable viral load. The nurse's baseline HIV test is being drawn. She is not pregnant.",
  "Which of the following is the most appropriate timing?",
  ["Start a three-drug regimen now; do not wait for her baseline result to begin", "Wait 72 hours for the baseline test before any drug", "A single dose of zidovudine", "No prophylaxis because 3 hours have passed", "Vaccine only"],
  "Start a three-drug regimen now; do not wait for her baseline result to begin",
  "Occupational HIV post-exposure prophylaxis is most effective started as soon as possible, ideally within hours, and is not delayed for the baseline blood draw. It is a 28-day three-drug course.",
  "Waiting 72 hours, one dose of zidovudine, skipping treatment at 3 hours, and a vaccine miss the window.",
  "cdc-sti-2021")

add("infectious-diseases", "diagnosis", "Malaria smear before a weekend", 4,
  "A 30-year-old man returned from West Africa 8 days ago and did not take prophylaxis. He has fever, headache, and a hematocrit of 28%. Platelets are 70,000/mm3.",
  "Which of the following is the most appropriate immediate test?",
  ["A single thick-and-thin smear now, repeated if negative", "Stool culture", "Monospot only", "No testing until he has cyclic fever for a week", "A chest radiograph as the definitive test"],
  "A single thick-and-thin smear now, repeated if negative",
  "Fever after travel to a malaria region is malaria until smears say otherwise. One negative smear does not exclude it, so smears are repeated. Anemia and thrombocytopenia fit severe risk and he should not wait the weekend.",
  "Stool culture, a monospot, a delay for classic periodicity, and a chest film as the only test miss parasitemia.",
  "nccpa-2025")

add("infectious-diseases", "pharmacotherapy", "Influenza treatment window in a high-risk adult", 4,
  "A 70-year-old woman with heart failure has had fever and cough for 36 hours. Influenza A is positive. She is hypoxic and is being admitted. Symptoms started yesterday.",
  "Which of the following is the most appropriate antiviral decision?",
  ["No antiviral, because 36 hours have passed", "Start oseltamivir", "Amantadine", "Antibiotics only", "A steroid burst instead of an antiviral"],
  "Start oseltamivir",
  "Hospitalized and high-risk patients are treated with a neuraminidase inhibitor even when symptoms are past 48 hours. Amantadine is not used because of resistance.",
  "Withholding treatment at 36 hours, amantadine, antibiotics alone, and steroids as a substitute are incorrect.",
  "ats-cap-2019")

add("infectious-diseases", "prevention", "Asplenia vaccines", 4,
  "A 25-year-old woman had a splenectomy yesterday after trauma. She is stable. She has never received pneumococcal, meningococcal, or Haemophilus influenzae type b vaccines.",
  "Which of the following is the most appropriate prevention plan?",
  ["No vaccines are needed after trauma splenectomy", "Give pneumococcal, meningococcal, and Hib vaccines, and prescribe an emergency antibiotic plan", "Daily penicillin is a substitute for every vaccine", "Live influenza vaccine into the wound", "Only a tetanus booster"],
  "Give pneumococcal, meningococcal, and Hib vaccines, and prescribe an emergency antibiotic plan",
  "Asplenia creates a lifelong risk of overwhelming encapsulated-bacterial sepsis. Those vaccines and an action plan for fever are standard, timed so they actually take.",
  "Skipping vaccines, using penicillin as the only prevention, a wound injection of live vaccine, and tetanus alone leave the encapsulated-organism gap.",
  "nccpa-2025")

# Endocrine 10
add("endocrine", "pharmacotherapy", "SGLT2 perioperative hold", 5,
  "A 64-year-old man with type 2 diabetes takes empagliflozin. He is scheduled for a bowel prep and colonoscopy tomorrow and will be on clear liquids today. eGFR is 55. He feels well.",
  "Which of the following is the most appropriate instruction?",
  ["Take empagliflozin the morning of the procedure", "Hold the SGLT2 inhibitor for the fast and the procedure day because of euglycemic ketoacidosis", "Double the dose to cover the fast", "Switch to glyburide tonight", "No change is ever required around surgery"],
  "Hold the SGLT2 inhibitor for the fast and the procedure day because of euglycemic ketoacidosis",
  "SGLT2 inhibitors are held for prolonged fasting, bowel prep, and surgery. Ketoacidosis can occur with a normal glucose, so symptoms after the procedure still need a ketone check.",
  "Taking or doubling the dose, a sulfonylurea swap the night before, and ignoring the fast are unsafe.",
  "ada-ckd-2026")

add("endocrine", "diagnosis", "Euglycemic ketoacidosis", 5,
  "A 58-year-old woman on canagliflozin has nausea and tachypnea the day after a colonoscopy. Glucose is 140 mg/dL. Venous pH is 7.18 and beta-hydroxybutyrate is 5.2 mmol/L. Lactate is normal.",
  "Which of the following is the most likely diagnosis?",
  ["Hyperosmolar state, because glucose is only 140", "Euglycemic diabetic ketoacidosis", "Lactic acidosis from metformin, despite a normal lactate", "Starvation with no treatment needed", "A lab error because glucose is not 400"],
  "Euglycemic diabetic ketoacidosis",
  "An anion-gap acidosis with high beta-hydroxybutyrate and a glucose that is not high is the SGLT2-associated ketoacidosis pattern, often after a fast. Treatment is the same physiology as DKA: insulin, glucose, and volume, and the drug is stopped.",
  "Hyperosmolar state needs a very high glucose. A normal lactate is not metformin lactic acidosis. Starvation ketosis is milder. The glucose does not have to be 400.",
  "ada-ckd-2026")

add("endocrine", "pharmacotherapy", "Insulin in DKA before potassium is known", 4,
  "A 19-year-old man with type 1 diabetes has glucose 480 mg/dL, pH 7.12, and bicarbonate 8 mEq/L. The chemistry panel has not returned. The ECG is normal.",
  "Which of the following is the most appropriate insulin decision?",
  ["Start intravenous insulin before any potassium result", "Hold insulin until the potassium is known to be at least 3.3 mEq/L", "Give bicarbonate as the only drug", "Subcutaneous basal insulin once and discharge", "No fluids"],
  "Hold insulin until the potassium is known to be at least 3.3 mEq/L",
  "Insulin shifts potassium into cells. A normal ECG does not prove the serum potassium is safe, so insulin waits until the level is known to be at least 3.3 mEq/L. Fluids can start while that lab is pending.",
  "Blind insulin, bicarbonate alone, one basal dose, and no fluids are not how DKA is opened.",
  "ada-ckd-2026")

add("endocrine", "diagnosis", "Primary adrenal insufficiency", 4,
  "A 32-year-old woman has fatigue, salt craving, and orthostasis. Sodium is 128 mEq/L, potassium is 5.6 mEq/L, and morning cortisol is 2 mcg/dL. ACTH is high. She has hyperpigmented palmar creases.",
  "Which of the following is the most appropriate long-term replacement?",
  ["Prednisone only, with no mineralocorticoid", "Hydrocortisone and fludrocortisone", "Levothyroxine before any steroid", "Methimazole", "Observation"],
  "Hydrocortisone and fludrocortisone",
  "High ACTH, low cortisol, hyponatremia, and hyperkalemia are primary adrenal insufficiency. She needs glucocorticoid and mineralocorticoid replacement. Pigmentation fits high ACTH.",
  "Glucocorticoid alone misses aldosterone. Starting levothyroxine first in coexisting autoimmune disease can precipitate crisis. Methimazole and observation do not replace cortisol.",
  "nccpa-2025")

add("endocrine", "pharmacotherapy", "Levothyroxine before steroids in hypopituitarism", 5,
  "A 40-year-old man has a pituitary macroadenoma. Morning cortisol is 3 mcg/dL and free T4 is low. Someone orders levothyroxine to start tonight and steroids 'if he looks sick later.'",
  "Which of the following is the correct sequence?",
  ["Levothyroxine first", "Glucocorticoid replacement before or with thyroid hormone", "Methimazole", "No replacement until after surgery next month", "Liothyronine only"],
  "Glucocorticoid replacement before or with thyroid hormone",
  "Thyroid hormone speeds cortisol clearance. Replacing it while the patient is adrenally insufficient can cause crisis. Steroid cover comes first.",
  "Thyroid hormone first, methimazole, a month of delay, and T3 alone are unsafe.",
  "nccpa-2025")

add("endocrine", "diagnosis", "Hypoglycemia in a sulfonylurea overdose", 4,
  "A 78-year-old man took a handful of glipizide. Glucose is 38 mg/dL. He wakes after intravenous dextrose and the repeat glucose an hour later is 42 mg/dL. He wants to go home.",
  "Which of the following is the most appropriate disposition?",
  ["Discharge, because he woke up", "Admit; sulfonylurea hypoglycemia recurs after dextrose", "Glucagon once and discharge with no observation", "Insulin infusion", "Oral glyburide to stabilize him"],
  "Admit; sulfonylurea hypoglycemia recurs after dextrose",
  "Sulfonylureas force insulin release for many hours. Dextrose treats the moment and then glucose falls again. Octreotide is often added, and he is observed.",
  "Discharge, a single glucagon dose, insulin, and more sulfonylurea are dangerous.",
  "ada-ckd-2026")

add("endocrine", "labs", "Do not use TSH alone early in thyroiditis", 4,
  "A 35-year-old woman has a tender thyroid, fever, and a free T4 that is high. TSH is 0.05. Radioactive iodine uptake is very low. She had a viral illness last week.",
  "Which of the following is the most appropriate treatment?",
  ["Methimazole", "A beta blocker and an anti-inflammatory; this is thyroiditis, not Graves", "Radioiodine ablation this week", "Propylthiouracil", "Levothyroxine now while she is thyrotoxic"],
  "A beta blocker and an anti-inflammatory; this is thyroiditis, not Graves",
  "Tender gland, a viral prodrome, and near-zero uptake are subacute thyroiditis. Hormone is leaking, not being made, so antithyroid drugs and ablation do not help. A beta blocker treats symptoms.",
  "Methimazole, propylthiouracil, radioiodine, and levothyroxine during the toxic phase treat the wrong physiology.",
  "nccpa-2025")

add("endocrine", "diagnosis", "Hypercalcemia of malignancy versus hyperparathyroidism", 4,
  "A 68-year-old smoker has calcium 13.8 mg/dL, suppressed PTH, and a lung mass. He is volume depleted and confused.",
  "Which of the following is the most appropriate first treatment?",
  ["Hydrochlorothiazide", "Isotonic saline", "Observation because PTH is suppressed", "Lithium", "A low-phosphate diet as the only step"],
  "Isotonic saline",
  "Severe hypercalcemia is volume resuscitated first. Suppressed PTH with a lung mass is humoral hypercalcemia of malignancy, not primary hyperparathyroidism, so the cancer pathway is pursued after he is stabilized.",
  "A thiazide raises calcium. Observation, lithium, and diet alone do not treat a calcium of 13.8 with confusion.",
  "nccpa-2025")

add("endocrine", "pharmacotherapy", "Metformin and contrast", 4,
  "A 66-year-old woman takes metformin. eGFR is 48 mL/min/1.73 m2. She needs a contrasted CT today and is euvolemic with no acute kidney injury.",
  "Which of the following is the most appropriate metformin plan?",
  ["Never give contrast to anyone on metformin", "Hold metformin at the time of contrast because the eGFR is under 60, then restart after kidney function is rechecked", "Double metformin the morning of the scan", "Switch to glyburide in the scanner", "Stop metformin forever because the eGFR is under 60"],
  "Hold metformin at the time of contrast because the eGFR is under 60, then restart after kidney function is rechecked",
  "Metformin is otherwise acceptable at an eGFR of 48, and contrast is not forbidden. Product labeling holds it at the time of iodinated contrast when the eGFR is under 60 and restarts it after function is confirmed stable. An eGFR under 60 is not a reason to stop it forever.",
  "A blanket ban on contrast, doubling the dose, a sulfonylurea swap, and permanent cessation overstate or miss the hold.",
  "ada-ckd-2026")

add("endocrine", "diagnosis", "Pheochromocytoma blood pressure drug order", 5,
  "A 38-year-old man has paroxysmal hypertension, headaches, and a positive plasma metanephrine. Imaging shows an adrenal mass. Surgery is planned. A student wants a beta blocker started today, before any alpha blockade.",
  "Which of the following is the correct preoperative sequence?",
  ["Beta blocker first", "Alpha blockade before a beta blocker", "A diuretic as the only drug", "Immediate biopsy of the mass in the clinic", "No blockade is needed"],
  "Alpha blockade before a beta blocker",
  "Blocking beta receptors first leaves alpha constriction unopposed and can cause a crisis. Alpha blockade, volume restoration, then a beta blocker if the heart rate needs it, is the order before resection.",
  "A diuretic alone, a clinic biopsy, and no blockade are unsafe.",
  "nccpa-2025")

# EENT 10
add("eent", "pharmacotherapy", "Acute angle closure", 5,
  "A 64-year-old woman has a red eye, a mid-dilated pupil, severe pain, halos, and vomiting. The eye is rock hard. Vision is 20/200.",
  "Which of the following is the most appropriate immediate plan?",
  ["Dilating drops and a 1-week clinic visit", "Pressure-lowering drops, acetazolamide, and urgent ophthalmology for laser iridotomy", "Topical steroid as the only drug", "Oral antibiotic", "Patch the eye for 48 hours"],
  "Pressure-lowering drops, acetazolamide, and urgent ophthalmology for laser iridotomy",
  "A mid-dilated pupil, a hard globe, and halos are acute angle closure. Pressure is lowered medically and a laser iridotomy is the definitive step. Dilation makes it worse.",
  "A delayed clinic visit, steroid monotherapy, an antibiotic, and a patch do not open the angle.",
  "nccpa-2025")

add("eent", "pharmacotherapy", "Central retinal artery versus vein", 4,
  "A 70-year-old man has sudden painless vision loss in one eye an hour ago. The retina is pale with a cherry-red spot. He has no flashes.",
  "Which of the following is the most appropriate immediate action?",
  ["Routine clinic in a month", "Emergency stroke-style evaluation; this is a central retinal artery occlusion", "Topical antibiotic", "Reassurance that a cherry-red spot is viral", "A multivitamin"],
  "Emergency stroke-style evaluation; this is a central retinal artery occlusion",
  "A pale retina and cherry-red spot are central retinal artery occlusion, an ocular stroke. He needs emergent eye care and a stroke workup. Time is retina.",
  "A month wait, an antibiotic, calling it viral, and a vitamin miss an embolic emergency.",
  "nccpa-2025")

add("eent", "diagnosis", "Retinal detachment flashes and a curtain", 4,
  "A 60-year-old man with myopia sees flashes and a shower of floaters, then a curtain over the top of the visual field. Central vision is still present.",
  "Which of the following is the most appropriate next step?",
  ["Artificial tears", "Same-day ophthalmology for a possible retinal detachment", "A 2-week wait", "Oral steroid", "Antibiotics"],
  "Same-day ophthalmology for a possible retinal detachment",
  "Flashes, a sudden shower of floaters, and a curtain are retinal detachment until the retina is examined. Central vision can still be saved if the macula is attached.",
  "Tears, a 2-week delay, steroids, and antibiotics do not reattach the retina.",
  "nccpa-2025")

add("eent", "pharmacotherapy", "Otitis externa and a perforated drum", 4,
  "A 20-year-old swimmer has tragal tenderness and a swollen canal. You can see a perforation in the tympanic membrane. He is afebrile.",
  "Which of the following drops are appropriate?",
  ["Neomycin-polymyxin if a perforation is present", "A fluoroquinolone otic drop; avoid aminoglycoside drops when the drum is open", "Oral amoxicillin only, with no drops", "Acetic acid and alcohol drops", "Steroid drops with neomycin"],
  "A fluoroquinolone otic drop; avoid aminoglycoside drops when the drum is open",
  "Otitis externa is treated with topical therapy. Aminoglycosides are ototoxic if they reach the middle ear through a perforation, so a fluoroquinolone drop is chosen.",
  "Neomycin combinations, alcohol and acetic acid, and oral therapy alone are the wrong drop or the wrong route.",
  "nccpa-2025")

add("eent", "diagnosis", "Malignant otitis externa", 5,
  "A 74-year-old man with poorly controlled diabetes has severe ear pain, granulation in the canal, and facial-nerve weakness. He is afebrile but looks ill.",
  "Which of the following is the most appropriate direction?",
  ["Acetic acid drops for a week", "Antipseudomonal antibiotics and imaging; this is malignant otitis externa", "Antihistamines", "Cerumen removal only", "Observation"],
  "Antipseudomonal antibiotics and imaging; this is malignant otitis externa",
  "Elderly diabetes, canal granulation, and cranial-nerve involvement are skull-base osteomyelitis, usually Pseudomonas, until proved otherwise. Drops are not enough.",
  "A week of acetic acid, antihistamines, wax removal, and observation miss invasive disease.",
  "nccpa-2025")

add("eent", "diagnosis", "Peritonsillar abscess", 4,
  "A 19-year-old man has fever, trismus, a muffled voice, and deviation of the uvula away from a swollen tonsil.",
  "Which of the following is the most appropriate treatment?",
  ["Amoxicillin and clinic follow-up next week", "Drainage plus antibiotics", "Antihistamines", "A throat culture only", "Steroids as the only drug"],
  "Drainage plus antibiotics",
  "Uvular deviation, trismus, and a muffled voice are a peritonsillar abscess. It is drained and antibiotics cover group A streptococcus and oral anaerobes.",
  "A delayed oral antibiotic, antihistamines, culture without drainage, and steroids alone do not empty the collection.",
  "nccpa-2025")

add("eent", "diagnosis", "Epiglottitis airway", 5,
  "A 45-year-old man is drooling, sitting forward, and has a fever. He becomes stridorous when examined with a tongue blade. Oxygen saturation is 94%.",
  "Which of the following is the most appropriate next step?",
  ["Force a tongue blade to see the epiglottis", "Airway specialists in a controlled setting; do not agitate the airway", "Oral antibiotics and discharge", "A nebulized steroid as definitive care", "CT before any airway plan"],
  "Airway specialists in a controlled setting; do not agitate the airway",
  "Drooling and tripoding in an adult are epiglottitis until the airway is secured. Instrumentation in an uncontrolled room can precipitate obstruction.",
  "A forced exam, discharge, a nebulizer as the cure, and a trip to CT before an airway plan are dangerous.",
  "nccpa-2025")

add("eent", "pharmacotherapy", "Allergic rhinitis controller", 3,
  "A 16-year-old has seasonal sneezing, itchy eyes, and clear rhinorrhea. She has no polyps, asthma, or purulent drainage. She wants something better than as-needed antihistamine tablets.",
  "Which of the following is the most appropriate controller?",
  ["An oral antibiotic for 14 days", "Intranasal corticosteroid", "Oral prednisone for the whole season", "Pseudoephedrine around the clock in a patient you have not screened for blood pressure", "Antifungal tablets"],
  "Intranasal corticosteroid",
  "Intranasal corticosteroids are the most effective single maintenance therapy for allergic rhinitis. Antibiotics and antifungals treat infections she does not have.",
  "A season of prednisone and uncritical decongestant use add harm.",
  "nccpa-2025")

add("eent", "diagnosis", "Sudden sensorineural hearing loss", 4,
  "A 55-year-old man woke yesterday with hearing loss in the left ear. Weber lateralizes to the right. Rinne shows air greater than bone on the left, and he cannot hear a whispered voice. The canal and drum are normal.",
  "Which of the following is the most appropriate next step?",
  ["A year of observation", "Urgent audiology and prompt corticosteroids for idiopathic sudden sensorineural loss", "Antibiotic drops", "Cerumen removal", "Antihistamines for a month before any test"],
  "Urgent audiology and prompt corticosteroids for idiopathic sudden sensorineural loss",
  "Weber to the good ear and a normal exam mean sensorineural loss. Sudden idiopathic loss is treated as an emergency with steroids; delay worsens recovery.",
  "A year of waiting, drops, wax removal, and antihistamines fit conductive problems he does not have.",
  "nccpa-2025")

add("eent", "diagnosis", "Orbital versus periorbital cellulitis", 5,
  "A 7-year-old boy has eyelid swelling, fever, pain with eye movement, and proptosis after a sinus infection. Vision is reduced.",
  "Which of the following is the most appropriate plan?",
  ["Oral cephalexin for periorbital cellulitis", "Intravenous antibiotics and imaging; pain with eye movement and proptosis mean orbital involvement", "Antihistamine drops", "Warm compresses only", "A steroid cream"],
  "Intravenous antibiotics and imaging; pain with eye movement and proptosis mean orbital involvement",
  "Periorbital cellulitis does not cause proptosis, ophthalmoplegia, or vision loss. Those findings are orbital cellulitis and need intravenous antibiotics, imaging, and often ENT or ophthalmology.",
  "Oral cephalexin, allergy drops, compresses, and a steroid cream under-treat an orbit.",
  "nccpa-2025")

# Hematologic 8
add("hematologic", "diagnosis", "Iron deficiency versus thalassemia trait", 4,
  "A 22-year-old woman has a hemoglobin of 10.8 g/dL and an MCV of 68 fL. Red-cell count is high for the hemoglobin. Ferritin is 80 ng/mL. Hemoglobin electrophoresis is pending.",
  "Which of the following is the more likely pattern?",
  ["Iron deficiency, because the MCV is low", "Thalassemia trait, because the red-cell count is high and ferritin is not low", "B12 deficiency", "Acute blood loss from yesterday", "Sideroblastic anemia from a factory exposure she does not have"],
  "Thalassemia trait, because the red-cell count is high and ferritin is not low",
  "Iron deficiency has a low ferritin and a low red-cell count. A very low MCV with a high red-cell count and a normal ferritin is thalassemia trait until electrophoresis confirms it.",
  "B12 deficiency is macrocytic. Acute blood loss is normocytic. Sideroblastic anemia is not the default without a toxin.",
  "nccpa-2025")

add("hematologic", "pharmacotherapy", "Heparin-induced thrombocytopenia", 5,
  "A 66-year-old man on unfractionated heparin for 8 days has a platelet count that fell from 220,000 to 70,000/mm3. He has a new swollen leg. Ultrasound shows a femoral DVT.",
  "Which of the following is the most appropriate next anticoagulant step?",
  ["Increase the heparin", "Stop heparin and start a non-heparin anticoagulant such as argatroban", "Platelet transfusion as the only treatment", "Switch to enoxaparin", "Warfarin alone tonight with no other anticoagulant"],
  "Stop heparin and start a non-heparin anticoagulant such as argatroban",
  "A platelet fall after day 5 plus a new clot is heparin-induced thrombocytopenia until proved otherwise. All heparin stops, including flushes, and a direct thrombin inhibitor or another non-heparin drug is started. Warfarin is not started alone because of venous limb gangrene.",
  "More heparin, a low-molecular-weight heparin, platelets alone, and warfarin monotherapy propagate the clot.",
  "nccpa-2025")

add("hematologic", "diagnosis", "TTP pentad is not required", 5,
  "A 35-year-old woman has confusion, a platelet count of 15,000/mm3, creatinine 2.1 mg/dL, and hemoglobin 8 g/dL with schistocytes. Coagulation tests are normal. She has no fever.",
  "Which of the following is the most appropriate next treatment?",
  ["Platelet transfusion and discharge", "Plasma exchange for thrombotic thrombocytopenic purpura; do not wait for the full pentad", "Heparin", "Vitamin K", "Observation because she has no fever"],
  "Plasma exchange for thrombotic thrombocytopenic purpura; do not wait for the full pentad",
  "Microangiopathic hemolysis, thrombocytopenia, and organ injury with normal coagulation tests are TTP. Fever is often absent. Plasma exchange is started urgently. Platelets are not given unless there is life-threatening bleeding.",
  "Heparin, vitamin K, and observation treat other bleeding disorders.",
  "nccpa-2025")

add("hematologic", "pharmacotherapy", "Warfarin reversal for bleeding", 4,
  "A 78-year-old man on warfarin has an INR of 8 and hematemesis. Blood pressure is 90/60 mm Hg.",
  "Which of the following is the most appropriate reversal?",
  ["Hold warfarin and recheck tomorrow", "Four-factor prothrombin complex concentrate and intravenous vitamin K", "Vitamin K by mouth only", "Protamine", "Idarucizumab"],
  "Four-factor prothrombin complex concentrate and intravenous vitamin K",
  "Major bleeding on warfarin is reversed with four-factor PCC plus intravenous vitamin K. Holding the dose is for an INR elevation without bleeding.",
  "Oral vitamin K is too slow. Protamine reverses heparin. Idarucizumab reverses dabigatran.",
  "chest-vte-2021")

add("hematologic", "diagnosis", "Transfusion reaction during the unit", 4,
  "Ten minutes into a red-cell transfusion a patient has fever, flank pain, and dark urine. Blood pressure falls.",
  "Which of the following is the most appropriate first action?",
  ["Slow the rate and give diphenhydramine", "Stop the transfusion and keep the line open with saline", "Give another unit faster", "Antibiotics and continue the blood", "Furosemide and continue"],
  "Stop the transfusion and keep the line open with saline",
  "Fever, pain, hypotension, and hemoglobinuria during a transfusion are acute hemolysis until proved otherwise. The unit stops immediately. The line is not flushed with the remaining blood.",
  "Slowing the rate, a second unit, continuing through antibiotics, and a diuretic while blood still runs leave incompatible blood infusing.",
  "nccpa-2025")

add("hematologic", "pharmacotherapy", "VTE and active cancer", 4,
  "A 60-year-old woman with metastatic cancer has a new proximal DVT. She is not bleeding. Creatinine is normal. She asks about a pill.",
  "Which of the following is an acceptable anticoagulant class?",
  ["Aspirin", "A direct oral anticoagulant or low-molecular-weight heparin", "Unfractionated heparin for 3 days and then nothing", "Warfarin with no bridge in a patient who needs immediate coverage", "A vena cava filter as the preferred first treatment"],
  "A direct oral anticoagulant or low-molecular-weight heparin",
  "Cancer-associated proximal DVT is treated, and a direct oral anticoagulant is now an acceptable option alongside low-molecular-weight heparin in patients without a contraindication.",
  "Aspirin, a 3-day course, warfarin with a gap, and a filter first are not the treatment.",
  "chest-vte-2021")

add("hematologic", "diagnosis", "Sickle acute chest", 5,
  "A 22-year-old man with hemoglobin SS has chest pain, fever, and a new infiltrate. Oxygen saturation fell from 98% to 88%. He is on incentive spirometry.",
  "Which of the following is the most appropriate additional plan?",
  ["Discharge on oral antibiotics", "Admit, antibiotics, oxygen, and exchange transfusion if respiratory failure worsens", "Hydroxyurea as the only acute drug", "A diuretic as primary therapy", "No transfusion is ever used in sickle cell disease"],
  "Admit, antibiotics, oxygen, and exchange transfusion if respiratory failure worsens",
  "A new infiltrate, chest pain, fever, and hypoxia in sickle cell disease are acute chest syndrome. He is admitted. Simple or exchange transfusion is used for respiratory compromise. Incentive spirometry continues.",
  "Discharge, hydroxyurea as the sole acute drug, diuresis, and a ban on transfusion are incorrect.",
  "nccpa-2025")

add("hematologic", "labs", "Mixing study", 4,
  "A 19-year-old man has a deep bleed into the thigh. aPTT is 68 seconds and does not correct when his plasma is mixed 1:1 with normal plasma. PT is normal. He has no heparin exposure.",
  "Which of the following does a failure to correct suggest?",
  ["Factor deficiency", "An inhibitor", "Thrombocytopenia", "Vitamin K deficiency", "A short sample"],
  "An inhibitor",
  "A mixing study that corrects implies a missing factor. A mixing study that does not correct implies an inhibitor, such as a factor VIII inhibitor or a lupus anticoagulant. His bleed plus a long aPTT fits an acquired or alloimmune inhibitor more than a lupus anticoagulant, which usually clots.",
  "Factor deficiency corrects. Thrombocytopenia does not prolong aPTT this way. Vitamin K deficiency prolongs the PT. A short sample is a collection problem, not this pattern.",
  "nccpa-2025")

# Reproductive 8
add("reproductive", "diagnosis", "Ectopic pregnancy threshold", 5,
  "A 27-year-old woman has pelvic pain and spotting. The urine pregnancy test is positive. Quantitative hCG is 2,800 mIU/mL. Transvaginal ultrasound shows an empty uterus and no adnexal mass. She is hemodynamically stable.",
  "Which of the following is the most appropriate next step?",
  ["Tell her she is not pregnant", "Repeat hCG and ultrasound; do not give methotrexate on a single nondiagnostic scan", "Dilation and curettage tonight as the only option", "Discharge with no follow-up", "Start misoprostol at home with no warning"],
  "Repeat hCG and ultrasound; do not give methotrexate on a single nondiagnostic scan",
  "An empty uterus at an hCG above the discriminatory zone is concerning for ectopic pregnancy but is not by itself a diagnosis. A stable patient gets a repeat quantitative hCG and a repeat scan, with precautions, rather than immediate methotrexate.",
  "Denying the pregnancy, immediate curettage as the only path, and sending her out with no plan miss a rupture.",
  "nccpa-2025")

add("reproductive", "pharmacotherapy", "Methotrexate eligibility", 5,
  "A 31-year-old woman has a confirmed tubal ectopic pregnancy. hCG is 2,200 mIU/mL. She has no fetal cardiac activity, no significant pain, and a normal hemoglobin. She can return for labs.",
  "Which of the following is appropriate?",
  ["Methotrexate is reasonable", "She must have surgery because every ectopic is ruptured", "Misoprostol", "Expectant management with no follow-up", "Mifepristone alone"],
  "Methotrexate is reasonable",
  "A small, unruptured ectopic pregnancy in a reliable patient with a modest hCG can be treated with methotrexate and serial hCG. Surgery is for rupture, instability, or a contraindication to the drug.",
  "Mandatory surgery, misoprostol, unsupervised waiting, and mifepristone alone are not the regimen.",
  "nccpa-2025")

add("reproductive", "diagnosis", "Preeclampsia with severe features", 4,
  "A 32-year-old woman at 34 weeks has blood pressure 168/110 mm Hg, a headache, and proteinuria. Platelets are 90,000/mm3. She has no vaginal bleeding.",
  "Which of the following is the most appropriate immediate drug for seizure prevention?",
  ["Lisinopril", "Magnesium sulfate", "Furosemide", "A thiazide", "Losartan"],
  "Magnesium sulfate",
  "Severe-range pressures with headache and thrombocytopenia are preeclampsia with severe features. Magnesium prevents seizures. Delivery planning is obstetric. ACE inhibitors and ARBs are contraindicated.",
  "Lisinopril, losartan, and diuretics are not the seizure-prevention drug and several are fetotoxic.",
  "aha-htn-2025")

add("reproductive", "pharmacotherapy", "Postpartum hemorrhage uterotonic", 4,
  "A 29-year-old woman just delivered and is bleeding heavily. The uterus is boggy. She has no hypertension. Oxytocin is running.",
  "Which of the following is an appropriate additional uterotonic if oxytocin is not enough?",
  ["Terbutaline", "Methylergonovine, if blood pressure allows, or misoprostol", "Magnesium", "Labetalol", "Nifedipine"],
  "Methylergonovine, if blood pressure allows, or misoprostol",
  "Atony is treated by emptying the bladder, uterine massage, oxytocin, and then another uterotonic. Methylergonovine is avoided in hypertension. Misoprostol is an alternative. Tocolytics such as terbutaline and magnesium relax the uterus.",
  "Terbutaline, magnesium, labetalol, and nifedipine do not contract the uterus.",
  "nccpa-2025")

add("reproductive", "diagnosis", "Endometrial biopsy age", 4,
  "A 62-year-old woman has postmenopausal bleeding. She is not on hormone therapy. The cervix looks normal. Pregnancy is impossible.",
  "Which of the following is the most appropriate next evaluation?",
  ["Reassurance that one episode is always benign", "Endometrial sampling, usually with ultrasound", "Oral contraceptives", "A Pap test as the only study", "Antibiotics"],
  "Endometrial sampling, usually with ultrasound",
  "Any postmenopausal bleeding is endometrial cancer until sampling or a thin stripe and a clear plan say otherwise. A Pap test does not evaluate the endometrium.",
  "Reassurance, contraceptives, a Pap alone, and antibiotics miss cancer.",
  "nccpa-2025")

add("reproductive", "pharmacotherapy", "Combined oral contraceptive contraindications", 4,
  "A 36-year-old woman who smokes a pack a day wants a combined oral contraceptive. Blood pressure is 128/78 mm Hg. She has migraine without aura.",
  "Which of the following is the most appropriate counseling?",
  ["A combined pill is preferred because she is under 40", "Avoid estrogen; age 35 or older plus smoking is a contraindication to combined hormonal contraception", "The pill will help her quit smoking so it should be started", "A combined pill is required before any progestin method", "No method is safe"],
  "Avoid estrogen; age 35 or older plus smoking is a contraindication to combined hormonal contraception",
  "Estrogen plus smoking at age 35 or older raises thrombosis and cardiovascular risk. A progestin-only method or nonhormonal method is discussed instead.",
  "Preferring a combined pill, using it as a quit aid, requiring it, and saying nothing is safe are incorrect.",
  "nccpa-2025")

add("reproductive", "diagnosis", "PID outpatient criteria", 4,
  "A 23-year-old woman has lower abdominal pain, cervical motion tenderness, and a fever of 38.0 C. She is not pregnant. She can tolerate oral medication and has no abscess on exam.",
  "Which of the following is appropriate outpatient therapy?",
  ["Metronidazole only", "Ceftriaxone plus doxycycline, with metronidazole", "Ciprofloxacin alone", "Azithromycin once", "No antibiotics until a culture grows"],
  "Ceftriaxone plus doxycycline, with metronidazole",
  "Pelvic inflammatory disease is a clinical diagnosis. Outpatient treatment covers gonorrhea, chlamydia, and anaerobes when she is well enough to go home. Pregnancy, vomiting, or an abscess would admit her.",
  "Metronidazole alone, ciprofloxacin, one dose of azithromycin, and waiting on culture under-treat.",
  "cdc-sti-2021")

add("reproductive", "prevention", "Rh immunoglobulin timing", 4,
  "A 28-year-old Rh-negative woman at 28 weeks has a negative antibody screen. The father is Rh positive. She has not received Rh immunoglobulin this pregnancy.",
  "Which of the following is the most appropriate plan?",
  ["No Rh immunoglobulin until delivery, and only if the baby is Rh negative", "Give Rh immunoglobulin at 28 weeks and again after delivery if the newborn is Rh positive", "Give it only if she is already alloimmunized", "Methotrexate", "A blood transfusion"],
  "Give Rh immunoglobulin at 28 weeks and again after delivery if the newborn is Rh positive",
  "Antepartum Rh immunoglobulin at about 28 weeks, and postpartum if the infant is Rh positive, prevents sensitization. It is not withheld until she is already immunized, and it is not skipped because the baby might be negative until that is known.",
  "Waiting for a negative infant, treating existing alloimmunization with the same logic, methotrexate, and transfusion are wrong.",
  "nccpa-2025")

# Psychiatry 8
add("psychiatry", "pharmacotherapy", "Serotonin syndrome versus NMS", 5,
  "A 30-year-old man started an SSRI and tramadol a day ago. He is agitated, febrile, shivering, and hyperreflexive with clonus. Creatine kinase is mildly up. He is not rigid.",
  "Which of the following is the most likely diagnosis?",
  ["Neuroleptic malignant syndrome", "Serotonin syndrome", "Malignant hyperthermia from no anesthetic", "Sepsis as the only possibility", "Catatonia"],
  "Serotonin syndrome",
  "Clonus, hyperreflexia, shivering, and a rapid onset after two serotonergic drugs are serotonin syndrome. Neuroleptic malignant syndrome is lead-pipe rigidity, slower onset, and after a dopamine blocker.",
  "Malignant hyperthermia needs a triggering anesthetic. Sepsis is possible but does not produce clonus as the core sign. Catatonia is a different motor picture.",
  "nccpa-2025")

add("psychiatry", "pharmacotherapy", "Lithium toxicity and a thiazide", 5,
  "A 45-year-old woman on lithium starts hydrochlorothiazide for blood pressure. A week later she is ataxic and confused. A lithium level is pending.",
  "Which of the following best explains the interaction?",
  ["Thiazides lower lithium levels", "Thiazides raise lithium levels by increasing reabsorption", "The combination is required", "Lithium toxicity presents only as a rash", "No lab is needed"],
  "Thiazides raise lithium levels by increasing reabsorption",
  "Volume contraction from a thiazide increases proximal lithium reabsorption and can cause toxicity. NSAIDs and ACE inhibitors do the same. The diuretic is stopped and the level is checked; severe toxicity may need dialysis.",
  "Thiazides do not lower the level. Toxicity is neurologic, not a rash, and a level is required.",
  "nccpa-2025")

add("psychiatry", "pharmacotherapy", "Bupropion and seizures and eating disorders", 4,
  "A 22-year-old woman with bulimia and an active seizure disorder wants bupropion for depression. She purges daily.",
  "Which of the following is the most appropriate advice?",
  ["Bupropion is preferred in bulimia and epilepsy", "Choose a different antidepressant; bupropion is contraindicated in bulimia and seizure disorders", "Double the usual dose", "Combine it with tramadol", "No antidepressant is allowed"],
  "Choose a different antidepressant; bupropion is contraindicated in bulimia and seizure disorders",
  "Bupropion lowers the seizure threshold and is contraindicated in current or prior bulimia or anorexia and in seizure disorders.",
  "Preferring it, raising the dose, adding tramadol, and refusing all antidepressants are incorrect.",
  "nccpa-2025")

add("psychiatry", "diagnosis", "Suicide risk means ask, not a contract", 4,
  "A 19-year-old man says he has a plan to shoot himself tonight and access to a firearm. He is not intoxicated. He asks you not to tell anyone.",
  "Which of the following is the most appropriate action?",
  ["A no-harm contract and discharge", "Emergency psychiatric evaluation and do not leave him alone with the firearm plan", "Promise confidentiality and send him home", "An antidepressant started in the parking lot as the only step", "Tell him plans are not clinically meaningful"],
  "Emergency psychiatric evaluation and do not leave him alone with the firearm plan",
  "A specific plan, intent, and access are high risk. Safety overrides confidentiality. He needs emergency evaluation, means restriction, and not a paper contract.",
  "A contract, a secrecy promise, a prescription alone, and dismissing the plan are unsafe.",
  "nccpa-2025")

add("psychiatry", "pharmacotherapy", "Alcohol withdrawal benzodiazepine", 4,
  "A 55-year-old man with daily heavy alcohol use has a tremor, heart rate 120/min, and diaphoresis 18 hours after his last drink. He is oriented. CIWA score is high.",
  "Which of the following is the most appropriate first drug class?",
  ["Haloperidol alone", "A benzodiazepine, tapered to symptoms", "Bupropion", "A beta blocker as monotherapy", "Disulfiram during acute withdrawal"],
  "A benzodiazepine, tapered to symptoms",
  "Alcohol withdrawal is treated with benzodiazepines. Antipsychotics alone lower the seizure threshold. Disulfiram is not used in acute withdrawal.",
  "Haloperidol monotherapy, bupropion, a beta blocker alone, and disulfiram do not prevent seizures and delirium.",
  "nccpa-2025")

add("psychiatry", "pharmacotherapy", "Adolescent depression and an SSRI", 4,
  "A 16-year-old has moderate major depression. Therapy is being arranged. There is no bipolar history. The family asks about medication and about suicidal thinking.",
  "Which of the following is appropriate counseling?",
  ["SSRIs are forbidden under 18", "Fluoxetine has evidence in adolescents, and suicidal thoughts are monitored especially in the first weeks", "A tricyclic is first line", "Benzodiazepine monotherapy", "No follow-up is needed after the first pill"],
  "Fluoxetine has evidence in adolescents, and suicidal thoughts are monitored especially in the first weeks",
  "Fluoxetine is the SSRI with the best adolescent evidence. The boxed warning means close follow-up for emerging suicidal thoughts, not a ban.",
  "A tricyclic, a benzodiazepine alone, and no follow-up are poor choices.",
  "nccpa-2025")

add("psychiatry", "diagnosis", "Delirium is not dementia", 3,
  "An 80-year-old man is suddenly inattentive and hallucinating on postoperative day 2. He was sharp yesterday. The family says his memory has been normal.",
  "Which of the following is the most likely diagnosis?",
  ["Alzheimer disease starting today", "Delirium", "Schizophrenia", "Autism", "A conversion disorder"],
  "Delirium",
  "Acute inattention and a fluctuating course in a hospitalized older adult are delirium. The cause, including drugs, infection, and metabolic change, is sought. Dementia is chronic.",
  "A one-day onset is not Alzheimer disease, schizophrenia, autism, or conversion.",
  "nccpa-2025")

add("psychiatry", "pharmacotherapy", "MAO inhibitor food interaction", 4,
  "A 50-year-old man on phenelzine eats aged cheese and develops a severe headache and blood pressure of 210/120 mm Hg.",
  "Which of the following is the mechanism?",
  ["Cheese deficiency of sodium", "Tyramine provokes a hypertensive reaction when monoamine oxidase is inhibited", "An expected benefit of the diet", "Serotonin syndrome from cheese alone", "Hypotension from tyramine"],
  "Tyramine provokes a hypertensive reaction when monoamine oxidase is inhibited",
  "MAO inhibitors plus tyramine-rich food cause hypertensive crisis. He needs blood-pressure treatment and education, not more cheese.",
  "This is not sodium deficiency, a desired effect, serotonin syndrome, or hypotension.",
  "nccpa-2025")

# Professional practice 8
add("professional-practice", "professional", "Capacity is decision-specific", 4,
  "A 70-year-old man with mild dementia refuses a recommended amputation for a gangrenous foot. He can describe the infection, the risk of death, and his reason for refusing. He is not delirious.",
  "Which of the following is the most appropriate conclusion?",
  ["Dementia always removes capacity", "He has capacity for this decision and the refusal stands", "The family signs consent over his objection", "Operate under implied consent because the disease is serious", "Capacity requires agreement with the clinician"],
  "He has capacity for this decision and the refusal stands",
  "Capacity is specific to the decision. If he understands, appreciates, reasons, and communicates a choice, a dementia label does not erase the refusal.",
  "Automatic incapacity, family override, implied consent, and equating capacity with compliance are incorrect.",
  "nccpa-2025")

add("professional-practice", "professional", "Error disclosure", 4,
  "A physician assistant gave the wrong dose of insulin. The patient became hypoglycemic and recovered. The error is clear.",
  "Which of the following is the most appropriate communication?",
  ["Do not mention it unless the patient asks", "Tell the patient what happened, the consequences, and what will change", "Blame the nurse in the note and say nothing to the patient", "Alter the record", "Wait a year"],
  "Tell the patient what happened, the consequences, and what will change",
  "Patients are told about errors that affect them. Disclosure includes the fact, the effect, and the plan to prevent a repeat. The record is not altered.",
  "Silence, blame without disclosure, altering the chart, and a long delay fail that duty.",
  "nccpa-2025")

add("professional-practice", "professional", "Impaired colleague", 4,
  "You smell alcohol on a colleague who is about to start a procedure list. Two other staff noticed slurred speech. The colleague says it is mouthwash.",
  "Which of the following is the most appropriate action?",
  ["Ignore it to preserve the friendship", "Remove the colleague from patient care and notify the supervisor", "Post it on social media", "Wait until a patient is harmed", "Trade shifts and say nothing"],
  "Remove the colleague from patient care and notify the supervisor",
  "An impaired clinician is removed from care immediately. The report goes through the institution, not through public shaming, and it does not wait for an injury.",
  "Silence, social media, and waiting for harm leave patients exposed.",
  "nccpa-2025")

add("professional-practice", "professional", "Minor and confidential contraception", 3,
  "A 16-year-old requests contraception and asks that her parents not be told. She is not in danger. State law allows minors to consent to contraceptive care.",
  "Which of the following is the most appropriate action?",
  ["Refuse until a parent signs", "Provide the care confidentially, consistent with the law", "Call the parents before the visit ends", "Document the request and do nothing", "Require a court order"],
  "Provide the care confidentially, consistent with the law",
  "Where minors may consent to contraception, the visit is confidential. Safety concerns such as abuse are a separate duty and are not described here.",
  "A parental signature, a phone call home, inaction, and a court order contradict that statute.",
  "nccpa-2025")

add("professional-practice", "professional", "Interpreter, not the child", 4,
  "A 45-year-old woman speaks little English. Her 10-year-old son offers to interpret a new cancer diagnosis.",
  "Which of the following is the most appropriate interpreter?",
  ["The son, because he is present", "A qualified medical interpreter", "No interpreter, using gestures for consent", "A bilingual janitor who happened to walk by, with no training", "Delay the news indefinitely"],
  "A qualified medical interpreter",
  "Children should not interpret serious medical information. A qualified interpreter protects accuracy and the child's role in the family.",
  "The son, gestures, an untrained bystander, and an indefinite delay are inadequate.",
  "nccpa-2025")

add("professional-practice", "professional", "Gift from a device company", 3,
  "A device representative offers you a paid weekend trip unrelated to any educational program, in exchange for using their product.",
  "Which of the following is the most appropriate response?",
  ["Accept if you disclose it to patients later", "Decline; a personal trip is not a legitimate educational support", "Accept and hide it", "Accept only if the trip is first class", "Ask the representative to pay your mortgage instead"],
  "Decline; a personal trip is not a legitimate educational support",
  "Gifts that are really payment for product choice are declined. Modest educational support with transparency is a different category from a vacation.",
  "Accepting, hiding, upgrading, or substituting another personal payment keeps the conflict.",
  "nccpa-2025")

add("professional-practice", "professional", "Just culture near miss", 3,
  "A look-alike vial was stocked next to a neuromuscular blocker. A nurse caught the error before administration. No one was harmed.",
  "Which of the following is the most useful response?",
  ["Punish the nurse who caught it", "Fix the storage and labeling, and thank the person who reported the near miss", "Ignore near misses", "Fire the unit", "Stop reporting so the numbers look better"],
  "Fix the storage and labeling, and thank the person who reported the near miss",
  "A just culture treats a system trap as a system problem. Near misses are reported because they show the hazard before a patient is hurt.",
  "Punishing the reporter, ignoring the miss, collective firing, and suppressing reports hide the next event.",
  "nccpa-2025")

add("professional-practice", "professional", "Against medical advice and capacity", 4,
  "A capacitated adult with pneumonia wants to leave. You have explained the risk of death. He repeats the risk and still wants to go. He is not suicidal.",
  "Which of the following is the most appropriate action?",
  ["Restrain him", "Document the discussion, offer prescriptions and return precautions, and let him leave", "Call security to force antibiotics", "Refuse to document", "Tell him leaving makes him ineligible for any future care"],
  "Document the discussion, offer prescriptions and return precautions, and let him leave",
  "A capacitated refusal is honored. The conversation, the risks, and what you offered are documented. Treatment to go and a door back are part of safe discharge.",
  "Restraints, forced drugs, a missing note, and a ban on future care are wrong.",
  "nccpa-2025")

print("rest", len(REST))


"""Step 2 items 51-100."""

from lib import s2

ACG = "American College of Gastroenterology Clinical Guideline: Upper Gastrointestinal and Ulcer Bleeding, 2021."
USP_BR = "US Preventive Services Task Force breast cancer screening recommendation, 2024."
USP_LU = "US Preventive Services Task Force lung cancer screening recommendation, 2021."
USP_CR = "US Preventive Services Task Force colorectal cancer screening recommendation, 2021."
USP_AA = "US Preventive Services Task Force abdominal aortic aneurysm screening recommendation, 2019."
USP_CX = "US Preventive Services Task Force cervical cancer screening recommendation, 2018, which remains the current USPSTF statement."
CDC = "CDC Sexually Transmitted Infections Treatment Guidelines, 2021."
CDI = "IDSA/SHEA 2021 Focused Update Guidelines on Management of Clostridioides difficile Infection in Adults."
ACR = "2020 American College of Rheumatology Guideline for the Management of Gout."
HTN = "2025 AHA/ACC/Multispecialty Guideline for the Prevention, Detection, Evaluation, and Management of High Blood Pressure in Adults."
HF = "2022 AHA/ACC/HFSA Guideline for the Management of Heart Failure, which remains the current United States heart-failure guideline."
GOLD = "Global Initiative for Chronic Obstructive Lung Disease, GOLD 2026 report."
GINA = "Global Initiative for Asthma, GINA Strategy Report 2025."
ADA = "American Diabetes Association, Standards of Care in Diabetes, 2026, section 9."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."
ACS = "2025 ACC/AHA/ACEP/NAEMSP/SCAI Guideline for the Management of Patients With Acute Coronary Syndromes."
ACOG = "ACOG Practice Bulletin No. 222, Gestational Hypertension and Preeclampsia, 2020, the current ACOG bulletin on this topic."

def W(a, b):
    return (a, b)

ITEMS = []

def A(n, **k):
    ITEMS.append(s2(n, **k))

A(51, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=2, subject="gastroenterology",
  takeaway="After endoscopic hemostasis of an ulcer, give a high-dose proton pump inhibitor for 3 days, then twice-daily oral therapy for 2 weeks.",
  citation=ACG,
  scenario="A 60-year-old patient just had a visible vessel in a duodenal ulcer clipped, and the bleeding stopped. Hemoglobin is stable at 8.1 g/dL after one transfusion. A colleague writes a single oral proton-pump-inhibitor dose plus sucralfate and no further acid suppression.",
  question="Which acid-suppression schedule follows successful hemostasis?",
  correct=W("High-dose proton pump inhibitor for 3 days, then twice daily by mouth for 2 weeks",
            "ACG 2021 recommends that sequence after hemostasis, given continuously or intermittently for the first 3 days. Sucralfate and a single dose do not replace it."),
  wrongs=[
    W("One oral dose, then sucralfate alone", "A single dose is not the 3-day high-dose course the guideline recommends."),
    W("No acid suppression, because a clip makes drug therapy unnecessary", "Endoscopic success is the reason to start the proton pump inhibitor, not a reason to skip it."),
    W("An intravenous histamine blocker for 14 days", "An H2 blocker is not the post-hemostasis recommendation."),
    W("High-dose intravenous therapy for 6 weeks without a step-down", "The high-dose phase is 3 days, then twice-daily oral therapy for 2 weeks."),
  ])

A(52, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=2, subject="internal-medicine",
  takeaway="The 2024 USPSTF recommendation is biennial mammography from ages 40 through 74, not a delay until 50 and not an annual interval.",
  citation=USP_BR,
  scenario="A 42-year-old patient has no breast symptoms, no affected first-degree relative, and a normal examination. She was told a decade ago that screening starts at 50, and she asks whether a yearly visit is required if she starts now.",
  question="Which screening plan matches her age?",
  correct=W("Mammography every two years, starting now",
            "She is inside ages 40 to 74. The 2024 statement starts biennial mammography at 40. Annual imaging is the interval it judged less favorable."),
  wrongs=[
    W("Start at 50 and repeat every year", "Fifty is the retired start, and yearly imaging is not the 2024 interval."),
    W("No imaging at any age if the examination is normal", "A normal examination does not replace mammography in this age range."),
    W("MRI every year starting at 42 for an average-risk patient", "Average-risk screening in this recommendation is mammography, not annual MRI."),
    W("One mammogram at 42 and then never again", "The interval continues every two years through age 74."),
  ])

A(53, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=3, subject="internal-medicine",
  takeaway="Annual low-dose CT is recommended from ages 50 through 80 with at least 20 pack-years if the person still smokes or quit within 15 years.",
  citation=USP_LU,
  scenario="A 52-year-old patient smoked one pack a day from age 30 until last month, about 22 pack-years. He has no symptoms. A chest radiograph from an employment visit was normal. A colleague says screening starts at 55 and only after 30 pack-years.",
  question="Which lung-screening decision matches 22 pack-years and a quit date last month?",
  correct=W("Annual low-dose CT, starting now",
            "The 2021 statement uses ages 50 to 80 and at least 20 pack-years for people who smoke or quit within 15 years. He meets all three. A normal chest radiograph does not replace low-dose CT."),
  wrongs=[
    W("No screening until age 55 and until the history reaches 30 pack-years", "Those age and pack-year cutoffs were retired in the 2021 statement."),
    W("A chest radiograph every year instead of CT", "Chest radiography is not the recommended screening test."),
    W("Low-dose CT once, then stop because he has already quit", "Quitting last month does not end screening. The stop point is 15 years without cigarettes."),
    W("Sputum cytology every six months", "Sputum cytology is not the USPSTF screening strategy."),
  ])

A(54, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=3, subject="internal-medicine",
  takeaway="Lung-cancer screening stops once a person has not smoked for 15 years, even if the pack-year total was heavy.",
  citation=USP_LU,
  scenario="A 62-year-old patient smoked 1.5 packs a day for 20 years and quit 16 years ago. He has no symptoms. A colleague orders annual low-dose CT because the pack-year total was 30 and age 62 is inside 50 to 80.",
  question="Why is annual low-dose CT no longer indicated?",
  correct=W("He has been abstinent for 16 years, which is past the 15-year limit",
            "Age and pack-years would otherwise qualify. The 2021 statement stops screening after 15 years without cigarettes."),
  wrongs=[
    W("It remains indicated. Any history of 30 pack-years is screened for life", "Sixteen years of abstinence removes the indication."),
    W("Stop because age 62 is above an upper limit of 55", "The upper age is 80. Age is not the reason to stop."),
    W("Replace CT with a chest radiograph because he quit", "A chest radiograph is not the alternative. Screening stops."),
    W("Continue CT every five years", "There is no five-year low-dose CT interval. After 15 smoke-free years, screening stops."),
  ])

A(55, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=2, subject="internal-medicine",
  takeaway="Average-risk colorectal screening starts at age 45. Waiting until 50 uses a retired cutoff.",
  citation=USP_CR,
  scenario="A 46-year-old patient has no bowel symptoms, no inflammatory bowel disease, and no first-degree relative with colorectal cancer. He has never been screened. A colleague says the first test is due at 50.",
  question="When does average-risk screening start?",
  correct=W("Now. Age 46 is inside the range that starts at 45",
            "The 2021 USPSTF recommendation screens average-risk adults from 45 through 75. The choice of which recommended test can be shared, but the start is not deferred to 50."),
  wrongs=[
    W("At 50. Age 46 is too young for any average-risk test", "Waiting until 50 applies the previous cutoff."),
    W("Only after a fecal test is already positive", "A fecal test is one way to screen. It is not a result that must exist before screening is offered."),
    W("At 40, because every adult starts five years earlier than 45", "Forty is not the average-risk start. Forty-five is."),
    W("Never, if he has no symptoms", "Absence of symptoms is the usual state of the people who benefit."),
  ])

A(56, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=2, subject="internal-medicine",
  takeaway="Men aged 65 to 75 who have ever smoked are offered one abdominal ultrasound for aneurysm screening.",
  citation=USP_AA,
  scenario="A 68-year-old patient smoked for ten years in his twenties and has not smoked since. He has no abdominal pain. Palpation of the abdomen feels normal. A colleague says palpation replaces imaging and that a remote smoking history does not count.",
  question="Which aneurysm screen matches this history?",
  correct=W("One abdominal ultrasound",
            "The 2019 recommendation is a one-time ultrasound for men aged 65 to 75 who have ever smoked. Ten years of smoking counts. Palpation does not replace the ultrasound."),
  wrongs=[
    W("No imaging, because palpation is sufficient and remote smoking does not qualify", "Former smoking counts, and palpation is not the test."),
    W("Annual ultrasound for the rest of his life", "The recommendation is one-time screening when the first study is the screen."),
    W("CT angiography every two years", "CT angiography is not the screening test."),
    W("Ultrasound only if he is currently smoking", "Former smoking still qualifies. Current use is not required for the one-time ultrasound."),
  ])

A(57, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=3, subject="internal-medicine",
  takeaway="The USPSTF recommends against routine aneurysm ultrasound in women who have never smoked.",
  citation=USP_AA,
  scenario="A 68-year-old patient has never smoked. She has no abdominal symptoms and no family history of aneurysm. A colleague orders the same one-time ultrasound used for men aged 65 to 75 who have smoked, saying age alone is the indication.",
  question="Should she have a routine aneurysm ultrasound?",
  correct=W("No. Routine ultrasound is not recommended for a woman who has never smoked",
            "The 2019 one-time ultrasound recommendation is for men aged 65 to 75 who have ever smoked. The same statement recommends against routine screening in women who have never smoked."),
  wrongs=[
    W("Yes. Age 68 is enough, and sex and smoking do not change the recommendation", "Those two facts are the recommendation. Age overlap does not transfer the test."),
    W("Yes, but only with CT rather than ultrasound", "Changing the modality does not create an indication the statement advises against."),
    W("Yes, every year from now until age 80", "Annual imaging is not the recommendation, and routine screening itself is advised against."),
    W("No imaging is ever appropriate in any woman, including those who smoked heavily", "This item is a woman who never smoked. It is not a claim about women who smoked."),
  ])

A(58, system="social-sciences", weight=12, topic="preventive-screening", domain="social-sciences", diff=3, subject="internal-medicine",
  takeaway="From ages 21 through 29, cervical screening is cytology every 3 years. Primary HPV testing is not the strategy in that decade.",
  citation=USP_CX,
  scenario="A 25-year-old patient has never had cervical screening and has no symptoms. A colleague orders high-risk HPV testing alone and says cytology is only for patients over 30.",
  question="Which cervical test matches age 25?",
  correct=W("Cytology alone every 3 years",
            "The 2018 USPSTF statement, still the current one, uses cytology alone every 3 years from 21 through 29. Primary HPV testing is an option from 30 to 65."),
  wrongs=[
    W("High-risk HPV testing alone, repeated every 5 years", "That option starts at age 30, not at 25."),
    W("No screening until age 30", "Cervical screening starts at 21, so age 25 is already inside the cytology window."),
    W("Cytology plus HPV testing every year", "Annual cotesting is not the recommendation at 25."),
    W("A pelvic ultrasound instead of cytology", "Ultrasound does not screen for cervical cell changes."),
  ])

A(59, system="reproductive-endocrine", weight=10, topic="contraception", domain="reproductive-endocrine", diff=3, subject="internal-medicine",
  takeaway="Uncomplicated gonorrhea below 150 kg is treated with ceftriaxone 500 mg intramuscularly once. A negative chlamydia test means doxycycline is not added.",
  citation=CDC,
  scenario="A 26-year-old patient weighs 80 kg. A cervical nucleic acid test is positive for gonorrhea and negative for chlamydia. She is not pregnant and has no joint pain or pustules. A colleague prescribes ceftriaxone 250 mg plus seven days of doxycycline.",
  question="Which dose matches this weight and this negative chlamydia test?",
  correct=W("Ceftriaxone 500 mg intramuscularly once, without doxycycline",
            "The 2021 CDC dose under 150 kg is 500 mg once. The 250 mg dose is retired. Doxycycline is added only when chlamydia has not been excluded."),
  wrongs=[
    W("Ceftriaxone 250 mg plus doxycycline for 7 days", "250 mg is the old dose, and doxycycline is unnecessary once chlamydia is negative."),
    W("Ceftriaxone 1 g, because every adult dose is now 1 g", "One gram is for weight at or above 150 kg, and for disseminated or conjunctival infection."),
    W("Oral azithromycin alone", "Azithromycin monotherapy is not the recommended gonorrhea treatment."),
    W("Ciprofloxacin for 7 days", "A fluoroquinolone is not the recommended regimen."),
  ])

A(60, system="reproductive-endocrine", weight=10, topic="contraception", domain="reproductive-endocrine", diff=3, subject="internal-medicine",
  takeaway="At a weight of at least 150 kg, uncomplicated gonorrhea is treated with ceftriaxone 1 g intramuscularly once.",
  citation=CDC,
  scenario="A 34-year-old patient weighs 160 kg. A urethral test is positive for gonorrhea and negative for chlamydia. He has no fever, rash, or tenosynovitis. A colleague gives ceftriaxone 500 mg and says weight does not change the dose.",
  question="Which ceftriaxone dose matches 160 kg?",
  correct=W("1 g intramuscularly once",
            "The 2021 CDC note is that patients weighing at least 150 kg receive 1 g. He is 160 kg, the infection is uncomplicated, and chlamydia is negative."),
  wrongs=[
    W("500 mg, because weight does not change the uncomplicated dose", "Weight at or above 150 kg is exactly the exception to 500 mg."),
    W("250 mg, because heavier patients need less drug", "The adjustment goes up, not down, and 250 mg is obsolete."),
    W("1 g daily for 7 days", "A multiday course is for disseminated infection. He has no arthritis-dermatitis findings."),
    W("Oral cefixime 400 mg", "When an injection is unavailable the oral alternative is cefixime 800 mg, and an injection is available here."),
  ])

A(61, system="reproductive-endocrine", weight=10, topic="contraception", domain="reproductive-endocrine", diff=3, subject="internal-medicine",
  takeaway="If chlamydia has not been excluded, uncomplicated gonorrhea treatment adds doxycycline 100 mg twice daily for 7 days rather than azithromycin.",
  citation=CDC,
  scenario="A 23-year-old patient weighs 70 kg. A cervical test is positive for gonorrhea, and the chlamydia assay from that swab is still pending. She is not pregnant. A colleague gives ceftriaxone 500 mg plus azithromycin 1 g, calling azithromycin the preferred partner drug.",
  question="What is added while the chlamydia result is unknown?",
  correct=W("Doxycycline 100 mg twice daily for 7 days, together with ceftriaxone 500 mg",
            "The 2021 guidelines add doxycycline for 7 days when chlamydia has not been excluded. Azithromycin is not the preferred partner drug. The ceftriaxone dose is already right for her weight."),
  wrongs=[
    W("Azithromycin 1 g once, because it is preferred over doxycycline", "Azithromycin is an alternative for chlamydia, not the preferred addition."),
    W("No second drug, because gonorrhea treatment covers chlamydia", "Ceftriaxone does not treat chlamydia, so a pending result still needs doxycycline."),
    W("Levofloxacin for 14 days instead of ceftriaxone", "A fluoroquinolone is not the recommended gonorrhea regimen."),
    W("Doxycycline for 1 day only", "The chlamydia course is 7 days, not one day."),
  ])

A(62, system="reproductive-endocrine", weight=10, topic="contraception", domain="reproductive-endocrine", diff=3, subject="obstetrics",
  takeaway="Chlamydia in pregnancy is treated with azithromycin 1 g once. Doxycycline is not used.",
  citation=CDC,
  scenario="A 28-year-old patient is at 16 weeks. A cervical test is positive for chlamydia and negative for gonorrhea. She has no fever and no pelvic tenderness. A colleague prescribes doxycycline 100 mg twice daily for 7 days because that is the nonpregnant regimen.",
  question="Which chlamydia drug matches pregnancy?",
  correct=W("Azithromycin 1 g by mouth once",
            "The 2021 CDC pregnancy regimen for chlamydia is a single gram of azithromycin. Gonorrhea is negative, so ceftriaxone is not required, and doxycycline is avoided."),
  wrongs=[
    W("Doxycycline for 7 days, because pregnancy does not change the regimen", "Pregnancy is exactly why doxycycline is not used."),
    W("Ceftriaxone 500 mg alone", "Ceftriaxone treats gonorrhea, which was negative."),
    W("Levofloxacin for 7 days", "A fluoroquinolone is not the pregnancy regimen."),
    W("No treatment until after delivery", "The infection is treated now, not deferred until delivery."),
  ])

A(63, system="multisystem", weight=6, topic="hiv-opportunistic", domain="multisystem", diff=3, subject="infectious-disease",
  takeaway="Disseminated gonococcal infection is treated with ceftriaxone 1 g every 24 hours, not the 500 mg uncomplicated dose.",
  citation=CDC,
  scenario="A 28-year-old patient weighs 70 kg and has three days of wrist tenosynovitis, sparse pustules on the arms, and a positive gonococcal nucleic acid test. Temperature is 38.1 C. There is no neck stiffness. A colleague gives ceftriaxone 500 mg once.",
  question="Which ceftriaxone plan matches the skin and tendon findings?",
  correct=W("Ceftriaxone 1 g every 24 hours",
            "Pustules plus tenosynovitis are the arthritis-dermatitis pattern. The 2021 regimen is ceftriaxone 1 g daily, not the 500 mg uncomplicated dose, even though he weighs 70 kg."),
  wrongs=[
    W("500 mg once, because weight under 150 kg fixes every gonococcal dose", "The 500 mg dose is for uncomplicated mucosal infection, not disseminated disease."),
    W("Ceftriaxone 250 mg once", "250 mg is obsolete for both uncomplicated and disseminated infection."),
    W("Oral azithromycin only", "Azithromycin does not treat disseminated gonorrhea."),
    W("Ceftriaxone 1 g every 8 hours, because any fever implies meningitis", "He has no neck stiffness. The arthritis-dermatitis interval is every 24 hours."),
  ])

A(64, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=3, subject="gastroenterology",
  takeaway="For an initial nonfulminant C. difficile episode, fidaxomicin is suggested over a standard vancomycin course when it is available.",
  citation=CDI,
  scenario="A 71-year-old patient finished antibiotics last week and now has watery diarrhea eight times a day. Temperature is 37.6 C, the white-cell count is 12,000 per microliter, and creatinine is 0.9 mg/dL. The abdomen is soft. Stool toxin is positive. There is no shock and no colonic dilation. Vancomycin and a newer narrow-spectrum agent are both stocked. A colleague starts metronidazole.",
  question="Which drug does the 2021 update suggest first?",
  correct=W("Fidaxomicin rather than metronidazole or a default vancomycin course",
            "The 2021 IDSA/SHEA update suggests fidaxomicin for an initial episode when it can be obtained. Vancomycin remains an acceptable alternative. Metronidazole is not the suggested first drug, and he is not fulminant."),
  wrongs=[
    W("Metronidazole, because a white-cell count under 15,000 makes it preferred", "Metronidazole is no longer the suggested first drug."),
    W("Oral vancomycin plus intravenous metronidazole", "That combination is for fulminant disease. He is not in shock and the colon is not dilated."),
    W("No drug, because a soft abdomen means the toxin will clear", "A positive toxin with frequent diarrhea is treated."),
    W("Intravenous vancomycin", "Intravenous vancomycin does not treat luminal infection. If vancomycin is used, it is oral, and it is the alternative."),
  ])

A(65, system="gastrointestinal", weight=8, topic="gi-bleed-management", domain="gastrointestinal", diff=3, subject="gastroenterology",
  takeaway="For a first C. difficile recurrence, fidaxomicin is suggested rather than a standard 10-day vancomycin course. Metronidazole is not the drug.",
  citation=CDI,
  scenario="A 68-year-old patient completed a 10-day vancomycin course for toxin-positive diarrhea three weeks ago. Watery stools have returned, the toxin is positive again, the white-cell count is 11,000, and creatinine is unchanged. The abdomen is soft and the pressure is normal. A colleague restarts metronidazole because the first drug failed.",
  question="Which drug does the update suggest for this first return?",
  correct=W("Fidaxomicin for this first recurrence",
            "The 2021 update suggests fidaxomicin, standard or extended-pulsed, rather than another standard vancomycin course. A tapered vancomycin course is only an acceptable alternative. Metronidazole is not the suggested drug."),
  wrongs=[
    W("Metronidazole, because recurrence means the other drugs are exhausted", "Recurrence is a reason to use fidaxomicin, not to return to metronidazole."),
    W("Intravenous metronidazole alone", "Intravenous metronidazole belongs in fulminant regimens, not a soft abdomen with normal pressure."),
    W("Another identical 10-day vancomycin course as the suggested first choice", "A standard 10-day course is what the update suggests moving away from when fidaxomicin is available."),
    W("No antibiotic, only a high-fiber diet", "A documented toxin-positive recurrence is treated with an antibiotic, not diet alone."),
  ])

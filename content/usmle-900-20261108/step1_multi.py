"""Step 1 multisystem items. Highest-yield traps. No database access."""

ITEMS = []


def add(topic, diff, subject, scenario, question, options, key, expl, ref):
    assert key in options and len(options) == 5 and len(set(options)) == 5
    assert subject in ("pathology", "microbiology", "pharmacology")
    assert ref in ("robbins-10", "katzung-16", "guyton-14")
    assert diff in (4, 5)
    ITEMS.append(
        {
            "blueprintDomain": "multisystem",
            "subjectId": subject,
            "taskCategory": "interpretation",
            "blueprintTopic": topic,
            "difficulty": diff,
            "scenario": scenario,
            "question": question,
            "options": options,
            "correctAnswer": key,
            "explanation": expl,
            "ref": ref,
        }
    )


add(
    "Hypovolemic shock numbers",
    4,
    "pathology",
    "A 34-year-old woman collapses after three days of black stools and one episode of hematemesis. She is pale and diaphoretic. Blood pressure is 78/46 mm Hg, heart rate 132/min, and respiratory rate 28/min. Neck veins are flat and the lungs are clear. There is no fever, rash, or muffled heart sound. Hemoglobin is 6.1 g/dL and lactate is 5.8 mmol/L. A liter of saline does not restore pressure. Pulmonary artery catheter measurements show cardiac output 2.5 L/min, systemic vascular resistance 2150 dynes-sec/cm5, pulmonary capillary wedge pressure 4 mm Hg, central venous pressure 1 mm Hg, and mixed venous oxygen saturation 51 percent. Which shock category do these numbers establish?",
    "Which shock category do these numbers establish?",
    [
        "Hypovolemic shock with low preload and compensatory vasoconstriction",
        "Cardiogenic shock with a high wedge pressure from pump failure",
        "Distributive shock with high cardiac output and low vascular resistance",
        "Obstructive tamponade with equalization of diastolic filling pressures",
        "Neurogenic shock with bradycardia and loss of sympathetic tone",
    ],
    "Hypovolemic shock with low preload and compensatory vasoconstriction",
    "Cardiac output is low, systemic vascular resistance is high, both filling pressures are near zero, and mixed venous oxygen saturation is low. That is an empty circulation with reflex vasoconstriction and increased tissue oxygen extraction, which is hypovolemic shock with low preload and compensatory vasoconstriction. The hemoglobin of 6.1 g/dL and flat neck veins match hemorrhage. Cardiogenic shock with a high wedge pressure from pump failure is incorrect because left ventricular failure raises wedge pressure, usually above 18 mm Hg, and this wedge pressure is 4 mm Hg. Distributive shock with high cardiac output and low vascular resistance is incorrect because early sepsis or anaphylaxis raises cardiac output and mixed venous saturation and drops resistance well below 800 dynes-sec/cm5; here resistance is 2150 and mixed venous saturation is 51 percent. Obstructive tamponade with equalization of diastolic filling pressures is incorrect because tamponade elevates central venous pressure and wedge pressure together and muffles the heart sounds, whereas both filling pressures here are near zero. Neurogenic shock with bradycardia and loss of sympathetic tone is incorrect because sympathetic interruption causes bradycardia and low resistance; this patient is tachycardic at 132/min with extreme vasoconstriction.",
    "guyton-14",
)

add(
    "Cardiogenic shock numbers",
    4,
    "pathology",
    "A 67-year-old man develops crushing chest pain and an anterior ST-elevation myocardial infarction. Two hours after an occluded left anterior descending artery is opened he is cold and clammy, with rales halfway up both lungs and an elevated jugular venous pressure. Blood pressure is 80/58 mm Hg and heart rate is 118/min. There is no new murmur. Echocardiography shows a large akinetic anterior wall. Pulmonary artery catheter measurements show cardiac output 1.8 L/min, systemic vascular resistance 1900 dynes-sec/cm5, pulmonary capillary wedge pressure 29 mm Hg, central venous pressure 14 mm Hg, and mixed venous oxygen saturation 46 percent. Lactate is 4.9 mmol/L. Which shock category do these numbers establish?",
    "Which shock category do these numbers establish?",
    [
        "Cardiogenic shock from left ventricular pump failure",
        "Hypovolemic shock with an empty ventricle and low wedge pressure",
        "Distributive shock with vasodilation and high mixed venous oxygen",
        "Pulmonary embolism with a low wedge and isolated right heart failure",
        "Early septic shock with warm skin and high cardiac output",
    ],
    "Cardiogenic shock from left ventricular pump failure",
    "A large anterior infarct with low cardiac output, high systemic vascular resistance, wedge pressure 29 mm Hg, and mixed venous oxygen saturation 46 percent is cardiogenic shock from left ventricular pump failure. The lung edema and high filling pressure show backup behind a weak left ventricle, and the low mixed venous saturation shows tissues extracting more oxygen because delivery fell. Hypovolemic shock with an empty ventricle and low wedge pressure is incorrect because hemorrhage or dehydration drops wedge pressure and central venous pressure, and this wedge pressure is 29 mm Hg with rales. Distributive shock with vasodilation and high mixed venous oxygen is incorrect because distributive shock lowers systemic vascular resistance and raises mixed venous oxygen saturation, often above 80 percent, whereas resistance here is 1900 and mixed venous saturation is 46 percent. Pulmonary embolism with a low wedge and isolated right heart failure is incorrect because massive embolism raises central venous pressure while wedge pressure stays low or normal and the lungs are clear; this wedge pressure is high and the lungs are wet. Early septic shock with warm skin and high cardiac output is incorrect because the early septic profile is warm, flushed, and high output, not a cold low-output state after an anterior infarct.",
    "guyton-14",
)

add(
    "Early distributive shock numbers",
    4,
    "pathology",
    "A 58-year-old woman with pneumococcal pneumonia has a temperature of 39.6 C, warm flushed skin, and bounding pulses. Blood pressure is 76/38 mm Hg after two liters of crystalloid. Heart rate is 122/min. Lactate is 5.4 mmol/L. There is no jugular venous distention and the heart sounds are crisp. Pulmonary artery catheter measurements show cardiac output 9.4 L/min, systemic vascular resistance 430 dynes-sec/cm5, pulmonary capillary wedge pressure 10 mm Hg, central venous pressure 6 mm Hg, and mixed venous oxygen saturation 86 percent. Which shock category do these numbers establish, and which categories do the output and resistance exclude?",
    "Which shock category do these numbers establish?",
    [
        "Early distributive septic shock with high output and low resistance",
        "Cardiogenic shock with low output and a high wedge pressure",
        "Hypovolemic shock with low output and compensatory vasoconstriction",
        "Obstructive tamponade with equalized high diastolic pressures",
        "Neurogenic shock with bradycardia after spinal cord injury",
    ],
    "Early distributive septic shock with high output and low resistance",
    "Cardiac output 9.4 L/min, systemic vascular resistance 430 dynes-sec/cm5, a normal wedge pressure, and mixed venous oxygen saturation 86 percent are early distributive septic shock with high output and low resistance. Inflammatory vasodilation drops resistance, the heart pumps a large output into a wide vascular bed, and tissues extract less oxygen, so mixed venous saturation rises even while lactate shows maldistributed flow. Cardiogenic shock with low output and a high wedge pressure is incorrect because pump failure lowers cardiac output, raises resistance, raises wedge pressure, and lowers mixed venous saturation; every one of those numbers points the other way here. Hypovolemic shock with low output and compensatory vasoconstriction is incorrect because volume loss lowers output and raises resistance above 1500 dynes-sec/cm5, whereas this resistance is 430 and output is high. Obstructive tamponade with equalized high diastolic pressures is incorrect because tamponade lowers output, raises resistance, and equalizes diastolic pressures near 20 mm Hg, not a wedge pressure of 10 mm Hg with output of 9.4 L/min. Neurogenic shock with bradycardia after spinal cord injury is incorrect because neurogenic shock is bradycardic from lost sympathetic drive; this patient is febrile and tachycardic at 122/min from infection.",
    "guyton-14",
)

add(
    "Wedge pressure excludes cardiogenic shock",
    5,
    "pathology",
    "A 45-year-old man with a ruptured splenic hematoma remains hypotensive after limited fluid. Blood pressure is 84/52 mm Hg and heart rate is 128/min. Skin is cool. Lungs are clear and heart sounds are normal. Pulmonary artery catheter measurements show cardiac output 2.4 L/min, systemic vascular resistance 2050 dynes-sec/cm5, pulmonary capillary wedge pressure 5 mm Hg, central venous pressure 2 mm Hg, and mixed venous oxygen saturation 54 percent. A colleague argues that any low cardiac output is cardiogenic shock and asks for an inotrope before blood. Which interpretation does the wedge pressure of 5 mm Hg specifically exclude?",
    "Which interpretation does the wedge pressure of 5 mm Hg exclude?",
    [
        "Cardiogenic shock, which requires an elevated left ventricular filling pressure",
        "Hypovolemic shock, which would raise the wedge pressure above 18 mm Hg",
        "Distributive shock, which is excluded by wedge pressure rather than by resistance",
        "Tamponade, which drops the wedge pressure far below right atrial pressure",
        "Neurogenic shock, which produces a high wedge pressure from bradycardia",
    ],
    "Cardiogenic shock, which requires an elevated left ventricular filling pressure",
    "The low output and high resistance could be mistaken for a pump problem, but cardiogenic shock, which requires an elevated left ventricular filling pressure, is excluded by a wedge pressure of 5 mm Hg. Left ventricular failure backs blood into the lungs and wedge pressure rises, typically above 18 mm Hg. The low wedge, low central venous pressure, and history of bleeding establish hypovolemia. Hypovolemic shock, which would raise the wedge pressure above 18 mm Hg, is an incorrect claim: hypovolemia lowers filling pressures, so a wedge pressure of 5 mm Hg supports hypovolemia rather than excluding it. Distributive shock, which is excluded by wedge pressure rather than by resistance, is an incorrect claim: distributive and hypovolemic shock can share a low or normal wedge pressure. What excludes distributive shock here is the systemic vascular resistance of 2050 and the low cardiac output, not the wedge pressure. Tamponade, which drops the wedge pressure far below right atrial pressure, is an incorrect mechanism: tamponade equalizes diastolic pressures at a high level, so wedge pressure and right atrial pressure rise together. Neurogenic shock, which produces a high wedge pressure from bradycardia, is an incorrect mechanism: lost sympathetic tone lowers resistance and does not raise wedge pressure, and this patient is tachycardic.",
    "guyton-14",
)

add(
    "Tamponade equalization excludes other shock",
    4,
    "pathology",
    "A 52-year-old man with lung cancer becomes hypotensive ten days after mediastinal radiation and a difficult central-line placement. Blood pressure is 82/68 mm Hg with pulsus paradoxus of 18 mm Hg. Heart sounds are distant, the jugular veins are distended, and an electrocardiogram shows electrical alternans. The lungs are clear. Pulmonary artery catheter measurements show cardiac output 2.1 L/min, systemic vascular resistance 1700 dynes-sec/cm5, central venous pressure 22 mm Hg, right ventricular diastolic pressure 22 mm Hg, pulmonary capillary wedge pressure 22 mm Hg, and mixed venous oxygen saturation 53 percent. Which shock category do these numbers establish?",
    "Which shock category do these numbers establish?",
    [
        "Obstructive shock from tamponade with equalized diastolic pressures",
        "Cardiogenic shock from isolated left ventricular failure",
        "Hypovolemic shock with low central venous and low wedge pressures",
        "Distributive shock with low resistance and high mixed venous oxygen",
        "Pulmonary embolism with wedge pressure much lower than venous pressure",
    ],
    "Obstructive shock from tamponade with equalized diastolic pressures",
    "Low cardiac output, high systemic vascular resistance, and diastolic pressures equal at 22 mm Hg in the right atrium, right ventricle, and wedge position, plus pulsus paradoxus and electrical alternans, are obstructive shock from tamponade with equalized diastolic pressures. External compression limits filling of every chamber to the same pressure. Cardiogenic shock from isolated left ventricular failure is incorrect because isolated left ventricular failure raises wedge pressure out of proportion to central venous pressure and does not equalize every diastolic pressure or cause electrical alternans. Hypovolemic shock with low central venous and low wedge pressures is incorrect because hemorrhage drops both filling pressures toward zero, and both pressures here are 22 mm Hg. Distributive shock with low resistance and high mixed venous oxygen is incorrect because distributive shock lowers systemic vascular resistance below 800 and raises mixed venous saturation, whereas resistance is 1700 and mixed venous saturation is 53 percent. Pulmonary embolism with wedge pressure much lower than venous pressure is incorrect because massive embolism elevates central venous pressure while leaving wedge pressure low or normal, not equal to it at 22 mm Hg, and it does not cause electrical alternans.",
    "guyton-14",
)

add(
    "Embolism numbers exclude left cardiogenic shock",
    5,
    "pathology",
    "A 61-year-old woman becomes abruptly hypotensive two days after a femoral fracture repair. She is tachypneic with clear lungs, a loud P2, and a right ventricular heave. Blood pressure is 84/58 mm Hg and heart rate is 124/min. There is no fever or rash. CT angiography shows a saddle pulmonary embolus. Pulmonary artery catheter measurements show cardiac output 2.3 L/min, systemic vascular resistance 1650 dynes-sec/cm5, central venous pressure 21 mm Hg, pulmonary artery pressure 58/30 mm Hg, pulmonary capillary wedge pressure 7 mm Hg, and mixed venous oxygen saturation 49 percent. Which interpretation do these numbers support, and which left-sided category does the wedge pressure exclude?",
    "Which interpretation fits these numbers?",
    [
        "Obstructive shock from pulmonary embolism with right ventricular failure",
        "Cardiogenic shock from left ventricular failure with a high wedge pressure",
        "Hypovolemic shock with low central venous pressure and low wedge pressure",
        "Distributive shock with low systemic vascular resistance and high output",
        "Tamponade with equal elevation of wedge and central venous pressure",
    ],
    "Obstructive shock from pulmonary embolism with right ventricular failure",
    "Low cardiac output, high resistance, central venous pressure 21 mm Hg, pulmonary artery pressure 58/30 mm Hg, and wedge pressure only 7 mm Hg are obstructive shock from pulmonary embolism with right ventricular failure. The right ventricle is pressure-overloaded while the left ventricle is underfilled, so the lungs stay clear. Cardiogenic shock from left ventricular failure with a high wedge pressure is incorrect because left ventricular pump failure raises wedge pressure above 18 mm Hg and floods the lungs; a wedge pressure of 7 mm Hg excludes that category even though cardiac output is low. Hypovolemic shock with low central venous pressure and low wedge pressure is incorrect because hypovolemia lowers central venous pressure together with wedge pressure, and central venous pressure here is 21 mm Hg. Distributive shock with low systemic vascular resistance and high output is incorrect because distributive shock drops resistance and usually raises cardiac output and mixed venous saturation; resistance is 1650, output is 2.3 L/min, and mixed venous saturation is 49 percent. Tamponade with equal elevation of wedge and central venous pressure is incorrect because tamponade equalizes those diastolic pressures, whereas central venous pressure is 21 mm Hg and wedge pressure is 7 mm Hg.",
    "guyton-14",
)

add(
    "Neurogenic shock numbers",
    5,
    "pathology",
    "A 24-year-old man is thrown from a motorcycle. He cannot move his legs and has a T4 sensory level. Blood pressure is 78/46 mm Hg and heart rate is 44/min. The skin below the lesion is warm and dry. Temperature is 36.8 C. There is no rash, wheeze, or external hemorrhage. Lungs are clear and heart sounds are normal. Pulmonary artery catheter measurements show cardiac output 3.6 L/min, systemic vascular resistance 460 dynes-sec/cm5, pulmonary capillary wedge pressure 6 mm Hg, central venous pressure 3 mm Hg, and mixed venous oxygen saturation 76 percent. Which shock category do the bradycardia and resistance establish?",
    "Which shock category do these numbers establish?",
    [
        "Neurogenic shock from loss of sympathetic vasomotor tone",
        "Hypovolemic shock with reflex tachycardia and compensatory vasoconstriction",
        "Cardiogenic shock with a high wedge pressure and low mixed venous oxygen",
        "Early septic shock with fever and a high cardiac output",
        "Obstructive tamponade with equalization of diastolic pressures",
    ],
    "Neurogenic shock from loss of sympathetic vasomotor tone",
    "A T4 cord injury with heart rate 44/min, systemic vascular resistance 460 dynes-sec/cm5, warm dry skin, and low-normal filling pressures is neurogenic shock from loss of sympathetic vasomotor tone. Sympathetic tracts are interrupted, so vessels dilate and cardiac accelerators are lost, producing bradycardia rather than the usual shock tachycardia. Hypovolemic shock with reflex tachycardia and compensatory vasoconstriction is incorrect because hemorrhage causes tachycardia and systemic vascular resistance well above 1500, not a heart rate of 44/min and resistance of 460. Cardiogenic shock with a high wedge pressure and low mixed venous oxygen is incorrect because pump failure raises wedge pressure and lowers mixed venous saturation while raising resistance; wedge pressure is 6 mm Hg, mixed venous saturation is 76 percent, and resistance is low. Early septic shock with fever and a high cardiac output is incorrect because septic distributive shock is febrile and tachycardic with a high output; temperature is normal, heart rate is 44/min, and output is not high. Obstructive tamponade with equalization of diastolic pressures is incorrect because tamponade elevates and equalizes filling pressures and does not cause a sensory level or warm dry skin with bradycardia.",
    "guyton-14",
)

add(
    "Late sepsis excludes cardiogenic shock",
    5,
    "pathology",
    "A 70-year-old man with perforated diverticulitis has been septic for two days. He is now cold and mottled. Temperature is 39.4 C, blood pressure 80/40 mm Hg, and heart rate 124/min. There is no pulsus paradoxus and no murmur. Echocardiography shows ejection fraction 45 percent without a large wall-motion defect. Pulmonary artery catheter measurements, before any vasopressor, show cardiac output 2.2 L/min, systemic vascular resistance 540 dynes-sec/cm5, pulmonary capillary wedge pressure 11 mm Hg, central venous pressure 8 mm Hg, and mixed venous oxygen saturation 64 percent. Lactate is 6.9 mmol/L. A student calls this cardiogenic shock because the output is low. Which interpretation is correct?",
    "Which interpretation is correct?",
    [
        "Late distributive shock with low output but persistently low vascular resistance",
        "Cardiogenic shock, because any low cardiac output means pump failure",
        "Hypovolemic shock, because lactate elevation proves hemorrhage",
        "Obstructive tamponade, because the filling pressures are equalized",
        "Early warm septic shock, because distributive shock always has high output",
    ],
    "Late distributive shock with low output but persistently low vascular resistance",
    "Output has fallen to 2.2 L/min from cytokine-related myocardial depression, but systemic vascular resistance is still 540 dynes-sec/cm5 and wedge pressure is only 11 mm Hg. That is late distributive shock with low output but persistently low vascular resistance. The low resistance is the number that keeps the category distributive. Cardiogenic shock, because any low cardiac output means pump failure, is incorrect because pure cardiogenic shock raises systemic vascular resistance and wedge pressure; a resistance of 540 and a wedge pressure of 11 mm Hg exclude pump-failure shock even though output is low. Hypovolemic shock, because lactate elevation proves hemorrhage, is incorrect because lactate only shows hypoperfusion, and hypovolemia would raise resistance and drop filling pressures further; resistance here is very low. Obstructive tamponade, because the filling pressures are equalized, is incorrect because tamponade pushes diastolic pressures up to a common high value with pulsus paradoxus, and these filling pressures are ordinary with no pulsus. Early warm septic shock, because distributive shock always has high output, is incorrect because distributive physiology can persist after output falls; the early warm high-output phase is not required once myocardial depression appears, and the low resistance is still the distributive signature.",
    "guyton-14",
)

add(
    "Penicillin anaphylaxis timing",
    4,
    "pathology",
    "A 22-year-old man with a prior penicillin rash receives intravenous penicillin for streptococcal pharyngitis. Within ten minutes he develops diffuse urticaria, wheezing, vomiting, and a blood pressure of 74/40 mm Hg. Heart rate is 130/min. There is no hemoglobinuria, no joint swelling, and complement is not low. He improves after intramuscular epinephrine. A colleague labels this cytotoxic hemolysis because penicillin is famous for attacking red cells. Which hypersensitivity type and timing fit this reaction?",
    "Which hypersensitivity type fits this reaction?",
    [
        "Type I immediate hypersensitivity from IgE on mast cells",
        "Type II hapten hemolysis from IgG on penicillin-coated red cells",
        "Type III serum sickness from immune complexes ten days later",
        "Type IV T-cell necrosis of keratinocytes over several days",
        "Nonimmune red-man flushing from rapid vancomycin infusion",
    ],
    "Type I immediate hypersensitivity from IgE on mast cells",
    "Urticaria, wheeze, and shock within minutes of a drug the patient has seen before are type I immediate hypersensitivity from IgE on mast cells. Preformed IgE cross-links on mast cells and basophils and releases histamine. Epinephrine is the treatment because it reverses bronchoconstriction and vasodilation. Type II hapten hemolysis from IgG on penicillin-coated red cells is incorrect because that reaction takes days, drops hemoglobin, and produces a positive direct antiglobulin test, not wheezing and urticaria in ten minutes. Type III serum sickness from immune complexes ten days later is incorrect because serum sickness appears one to two weeks after exposure with fever, arthralgia, and low complement, not in the first minutes with a normal complement story. Type IV T-cell necrosis of keratinocytes over several days is incorrect because T-cell drug reactions such as Stevens-Johnson syndrome evolve over days and destroy epidermis rather than causing immediate anaphylaxis. Nonimmune red-man flushing from rapid vancomycin infusion is incorrect because this patient received penicillin, not vancomycin, and red-man flushing is rate-related erythema without IgE shock and bronchospasm.",
    "robbins-10",
)

add(
    "Penicillin hemolysis is type II",
    4,
    "pathology",
    "A 46-year-old woman has taken high-dose penicillin for eight days for osteomyelitis. This morning she is jaundiced and dyspneic. Hemoglobin has fallen from 13.2 to 7.4 g/dL, the smear shows spherocytes, indirect bilirubin and LDH are high, and haptoglobin is low. The direct antiglobulin test is positive for IgG. She has no wheeze, no urticaria, and blood pressure is normal. The antibody reacts with penicillin-coated red cells and not with uncoated cells. Which mechanism fits the timing and the serology?",
    "Which mechanism fits this hemolysis?",
    [
        "Type II hapten hemolysis from IgG against penicillin-coated erythrocytes",
        "Type I anaphylaxis from IgE on mast cells within minutes of a dose",
        "Type III serum sickness with joint pain and complement consumption",
        "Type IV Stevens-Johnson necrosis of keratinocytes at two weeks",
        "Methyldopa-style autoantibodies against Rh that ignore the drug",
    ],
    "Type II hapten hemolysis from IgG against penicillin-coated erythrocytes",
    "Hemolysis beginning days into penicillin, a positive IgG direct antiglobulin test, and an antibody that binds only penicillin-coated red cells are type II hapten hemolysis from IgG against penicillin-coated erythrocytes. The drug attaches to the membrane, IgG opsonizes those cells, and extravascular hemolysis follows. Type I anaphylaxis from IgE on mast cells within minutes of a dose is incorrect because anaphylaxis is immediate urticaria, wheeze, and shock without spherocytes or a fall in hemoglobin over days. Type III serum sickness with joint pain and complement consumption is incorrect because serum sickness is fever, arthralgia, rash, and low complement from soluble complexes, not antibody restricted to drug-coated red cells. Type IV Stevens-Johnson necrosis of keratinocytes at two weeks is incorrect because that is a T-cell attack on epidermis and mucosa, not complement-independent IgG hemolysis. Methyldopa-style autoantibodies against Rh that ignore the drug are incorrect because those antibodies bind native Rh antigen even when the drug is absent from the red cell; this eluate binds only penicillin-coated cells.",
    "robbins-10",
)

add(
    "Serum sickness timing despite urticaria",
    5,
    "pathology",
    "A 38-year-old man receives a horse-derived antitoxin. He feels well for nine days. On day 10 he develops fever, migratory polyarthralgia, a urticarial rash, lymphadenopathy, and proteinuria. C3 and C4 are both low. He has no wheeze and blood pressure is normal. He had no reaction during the infusion. A student calls this type I allergy because the rash is urticarial and stops at an antihistamine. Which mechanism fits the delay, the joints, and the complement?",
    "Which mechanism fits this illness?",
    [
        "Type III serum sickness from immune complexes and complement use",
        "Type I anaphylaxis from IgE mast-cell release during the infusion",
        "Type II cytotoxic hemolysis against drug-coated red cells",
        "Type IV contact dermatitis peaking at 48 to 72 hours",
        "Arthus necrosis limited to the injection site within six hours",
    ],
    "Type III serum sickness from immune complexes and complement use",
    "Fever, arthralgia, urticaria, proteinuria, and low C3 and C4 beginning about ten days after foreign protein are type III serum sickness from immune complexes and complement use. Soluble complexes deposit once antibody appears, and the urticaria is a complex-mediated rash, not immediate mast-cell anaphylaxis. Type I anaphylaxis from IgE mast-cell release during the infusion is incorrect because type I reactions occur in minutes, do not wait ten days, and do not consume C3 and C4 or cause migratory arthritis and proteinuria. Type II cytotoxic hemolysis against drug-coated red cells is incorrect because there is no anemia, spherocytosis, or positive antiglobulin test against coated cells; the target is soluble antigen in complexes. Type IV contact dermatitis peaking at 48 to 72 hours is incorrect because delayed T-cell dermatitis is a local epidermal reaction without hypocomplementemia, arthritis, and proteinuria. Arthus necrosis limited to the injection site within six hours is incorrect because an Arthus reaction is a local type III lesion in a presensitized host within hours, not a systemic illness on day 10.",
    "robbins-10",
)

add(
    "Arthus timing versus delayed type",
    5,
    "pathology",
    "A 55-year-old farmer who has completed the tetanus series gets a booster. Six hours later the injection site is swollen, painful, and beginning to necrose, with neutrophils in the dermis and vessel walls. He had no symptoms in the first 20 minutes and no distant urticaria. A student calls this a tuberculin-type reaction and expects the peak at 48 to 72 hours. Another calls it cellulitis and starts antibiotics only. Which hypersensitivity type fits a necrotic local reaction at six hours in an immunized person?",
    "Which hypersensitivity type fits this local reaction?",
    [
        "Type III Arthus reaction from local immune complexes within hours",
        "Type IV delayed hypersensitivity peaking at 48 to 72 hours",
        "Type I anaphylaxis with systemic urticaria in the first minutes",
        "Type II hemolysis from IgG against circulating red cells",
        "Bacterial cellulitis that necroses a vaccine site in six hours",
    ],
    "Type III Arthus reaction from local immune complexes within hours",
    "A painful necrotic injection-site lesion at about six hours in someone who already has IgG against the antigen is a type III Arthus reaction from local immune complexes within hours. Preformed antibody meets antigen in the vessel wall, complement is activated, and neutrophils damage the tissue. Type IV delayed hypersensitivity peaking at 48 to 72 hours is incorrect because T-cell memory reactions such as a PPD are mononuclear and peak on the second or third day, not at six hours with neutrophilic vasculitis. Type I anaphylaxis with systemic urticaria in the first minutes is incorrect because IgE mast-cell disease is immediate and systemic, and this man had no reaction in the first 20 minutes and no distant hives. Type II hemolysis from IgG against circulating red cells is incorrect because there is no anemia or positive antiglobulin test; the immune complexes are local, in the injection-site vessels. Bacterial cellulitis that necroses a vaccine site in six hours is incorrect because bacterial cellulitis does not reach necrosis in six hours after a sterile booster, and the histology is leukocytoclastic immune-complex injury in a presensitized host.",
    "robbins-10",
)

add(
    "Tuberculin reaction is type IV",
    4,
    "pathology",
    "A 30-year-old nurse has a purified-protein-derivative skin test placed on Monday. The site is quiet at six hours. At 48 hours there is 18 mm of induration without systemic fever, arthritis, or a fall in complement. She was vaccinated with BCG years ago and had a positive test previously. A student calls the induration an Arthus reaction because both can redden the skin, and another calls it IgE because it is a skin finding. Which mechanism fits the 48-hour induration?",
    "Which mechanism fits this skin finding?",
    [
        "Type IV delayed hypersensitivity from memory T cells at 48 hours",
        "Type III Arthus necrosis from immune complexes at four to eight hours",
        "Type I immediate hive from IgE within minutes of placement",
        "Type II cytotoxic attack on keratinocytes in the first hour",
        "Serum sickness with hypocomplementemia and migratory arthritis",
    ],
    "Type IV delayed hypersensitivity from memory T cells at 48 hours",
    "Induration that is absent at six hours and present at 48 hours after a tuberculosis skin test is type IV delayed hypersensitivity from memory T cells at 48 hours. Previously sensitized T cells recruit macrophages; the readout is induration, not immediate itch or complement consumption. Type III Arthus necrosis from immune complexes at four to eight hours is incorrect because an Arthus reaction is neutrophilic, peaks within hours, and tends to necrosis in a host with high antibody, which is the opposite time course from this quiet six-hour check. Type I immediate hive from IgE within minutes of placement is incorrect because IgE reactions appear in minutes as a wheal, not as firm induration two days later. Type II cytotoxic attack on keratinocytes in the first hour is incorrect because antibody against a cell-surface antigen is not the mechanism of a tuberculin test and would not wait 48 hours to form induration. Serum sickness with hypocomplementemia and migratory arthritis is incorrect because serum sickness is systemic, lowers complement, and involves joints; complement and joints are unaffected here.",
    "robbins-10",
)

add(
    "Methyldopa antibody is not a hapten",
    5,
    "pathology",
    "A 60-year-old woman has taken methyldopa for four months. Hemoglobin is 8.1 g/dL, the smear shows spherocytes, LDH is high, and the direct antiglobulin test is positive for IgG. The eluted antibody binds Rh antigen on red cells that have never been exposed to methyldopa, and it still binds after the drug is stopped. She has no wheeze, no arthritis, and complement is normal. A student calls this the penicillin hapten pattern and expects the antibody to bind only drug-coated cells. Which mechanism fits an antibody that binds native Rh?",
    "Which mechanism fits this antibody?",
    [
        "Type II autoantibodies against Rh that do not need drug on the cell",
        "Type II hapten antibodies that bind only drug-coated red cells",
        "Type I IgE mast-cell degranulation within minutes of a dose",
        "Type III serum sickness with low complement and arthralgia",
        "Type IV keratinocyte necrosis peaking at 48 to 72 hours",
    ],
    "Type II autoantibodies against Rh that do not need drug on the cell",
    "Warm IgG hemolysis in which the eluate binds Rh on cells that never saw the drug is type II autoantibodies against Rh that do not need drug on the cell. Methyldopa induces a true autoantibody, so hemolysis can continue briefly after the drug is stopped and the serology does not require drug-coated reagent cells. Type II hapten antibodies that bind only drug-coated red cells describe penicillin hemolysis, not this eluate; that pattern is excluded because binding occurs without methyldopa on the membrane. Type I IgE mast-cell degranulation within minutes of a dose is incorrect because there is no immediate urticaria or shock, and IgE does not produce a positive IgG antiglobulin test and spherocytic anemia over months. Type III serum sickness with low complement and arthralgia is incorrect because complement is normal and there is no fever, rash, or joint disease; the injury is antibody bound to red cells. Type IV keratinocyte necrosis peaking at 48 to 72 hours is incorrect because T-cell epidermal necrosis is a skin and mucosal disease, not extravascular hemolysis with an Rh-specific IgG.",
    "robbins-10",
)

add(
    "Procainamide lupus is type III",
    4,
    "pathology",
    "A 68-year-old man has taken procainamide for eight months. He now has fever, arthralgia, and serositis. Antinuclear antibody is positive with anti-histone antibodies. Antibodies to double-stranded DNA are negative, complement is nearly normal, and the urine has no casts or protein. Symptoms began months after the first dose, not in the first hour, and there is no rash of epidermal necrosis. He improves after the drug is stopped. Which mechanism fits drug-induced lupus from procainamide?",
    "Which mechanism fits this drug reaction?",
    [
        "Type III immune-complex lupus from procainamide with anti-histone antibodies",
        "Type I anaphylaxis in the first minutes after a procainamide dose",
        "Type II warm hemolysis as the dominant procainamide injury",
        "Type IV Stevens-Johnson necrosis of skin and mucosa",
        "Idiopathic lupus with anti-dsDNA antibody and immune-complex nephritis",
    ],
    "Type III immune-complex lupus from procainamide with anti-histone antibodies",
    "Months of procainamide followed by fever, arthralgia, serositis, and anti-histone antibodies without anti-dsDNA or nephritis are type III immune-complex lupus from procainamide with anti-histone antibodies. Drug-induced lupus is an immune-complex illness that resolves when the drug is withdrawn. Type I anaphylaxis in the first minutes after a procainamide dose is incorrect because anaphylaxis is immediate wheeze and shock, not a months-long serositis with autoantibodies. Type II warm hemolysis as the dominant procainamide injury is incorrect because the stem has no anemia, spherocytes, or positive antiglobulin test; the clinical target is joints and serosa. Type IV Stevens-Johnson necrosis of skin and mucosa is incorrect because there is no epidermal necrolysis, and Stevens-Johnson syndrome is a cytotoxic T-cell reaction rather than an anti-histone syndrome. Idiopathic lupus with anti-dsDNA antibody and immune-complex nephritis is incorrect because idiopathic disease more often has anti-dsDNA and low complement with renal involvement; anti-histone specificity, spared kidneys, and resolution off procainamide mark the drug-induced illness.",
    "robbins-10",
)

add(
    "Heparin-induced thrombocytopenia timing",
    5,
    "pathology",
    "A 72-year-old woman starts unfractionated heparin for a new femoral-vein thrombus. She has never received heparin. On day 6 the platelet count falls from 250,000 to 55,000 per microliter and the leg becomes more swollen, with a new iliac clot. An assay for IgG against platelet factor 4-heparin complexes is positive. She has no fever, hemoglobinuria, or urticaria. A student calls this the common early nonimmune platelet dip and continues heparin. Which mechanism and timing fit the thrombosis and the antibody?",
    "Which mechanism fits this platelet fall?",
    [
        "Type II hypersensitivity from IgG against platelet factor 4-heparin complexes",
        "Nonimmune heparin platelet clumping limited to the first two days",
        "Type I anaphylaxis with urticaria in the first minutes of the infusion",
        "Type III serum sickness with hypocomplementemia and arthralgia",
        "Type IV contact dermatitis at a heparin injection site",
    ],
    "Type II hypersensitivity from IgG against platelet factor 4-heparin complexes",
    "A platelet fall of more than half beginning on day 5 to 10, new thrombosis, and IgG against platelet factor 4-heparin complexes are type II hypersensitivity from IgG against platelet factor 4-heparin complexes. The antibody activates platelets through Fc receptors, so the count falls and clot forms. Heparin must stop. Nonimmune heparin platelet clumping limited to the first two days is incorrect because that mild direct effect appears in the first 48 hours, does not make a PF4 antibody, and does not cause thrombosis; day 6 with a new clot excludes it. Type I anaphylaxis with urticaria in the first minutes of the infusion is incorrect because there is no immediate rash or shock, and anaphylaxis does not drop the platelet count on day 6 through an anti-PF4 IgG. Type III serum sickness with hypocomplementemia and arthralgia is incorrect because serum sickness is fever, joints, and low complement a week or more into a foreign antigen, not platelet activation and arterial or venous thrombosis. Type IV contact dermatitis at a heparin injection site is incorrect because a T-cell skin rash does not consume circulating platelets or extend a deep-vein thrombus.",
    "robbins-10",
)

add(
    "Chronic granulomatous disease infection mismatch",
    5,
    "microbiology",
    "A 6-year-old boy has had a Staphylococcus aureus liver abscess, Aspergillus fumigatus pneumonia, Serratia marcescens osteomyelitis, and Burkholderia cepacia lung infection. Dihydrorhodamine flow cytometry shows no oxidative burst, and the nitroblue tetrazolium test stays colorless. His T-cell counts and immunoglobulin levels are normal. A relative says every opportunistic pathogen fits an oxidative-burst defect equally. Which infection is inconsistent with this immunodeficiency?",
    "Which infection is inconsistent with this immunodeficiency?",
    [
        "Pneumocystis jirovecii pneumonia from a T-cell defect",
        "Staphylococcus aureus hepatic abscess",
        "Aspergillus fumigatus invasive pneumonia",
        "Serratia marcescens osteomyelitis",
        "Burkholderia cepacia pneumonia",
    ],
    "Pneumocystis jirovecii pneumonia from a T-cell defect",
    "Failure of the oxidative burst lets catalase-positive organisms survive inside phagocytes, because they degrade the hydrogen peroxide the host cannot replace. Pneumocystis jirovecii pneumonia from a T-cell defect is inconsistent: T cells and antibody are intact, and Pneumocystis is the signature of impaired T-cell immunity, not of NADPH oxidase failure. Staphylococcus aureus hepatic abscess is consistent, because Staphylococcus is catalase positive and is a classic cause of liver abscess in chronic granulomatous disease. Aspergillus fumigatus invasive pneumonia is consistent, because Aspergillus is the mold that fills the lungs of these patients when neutrophils cannot make superoxide. Serratia marcescens osteomyelitis is consistent, because Serratia is one of the catalase-positive gram-negative bacteria that specifically points to this diagnosis. Burkholderia cepacia pneumonia is consistent, because Burkholderia is another catalase-positive organism that thrives when the burst is absent and is not a marker of isolated T-cell failure.",
    "robbins-10",
)

add(
    "Agammaglobulinemia infection mismatch",
    4,
    "microbiology",
    "An 8-month-old boy has had recurrent otitis, two episodes of Streptococcus pneumoniae bacteremia, and Giardia lamblia diarrhea since age 6 months. He has no tonsils and no palpable lymph nodes. Circulating B cells are absent, all immunoglobulin isotypes are undetectable, and T-cell numbers and function are normal. He recently had echovirus meningoencephalitis. A note lists Pneumocystis prophylaxis as if he had a pure T-cell defect. Which infection is inconsistent with this immunodeficiency?",
    "Which infection is inconsistent with this immunodeficiency?",
    [
        "Pneumocystis jirovecii pneumonia despite normal T cells",
        "Streptococcus pneumoniae bacteremia",
        "Haemophilus influenzae pneumonia",
        "Giardia lamblia intestinal infection",
        "Echovirus meningoencephalitis",
    ],
    "Pneumocystis jirovecii pneumonia despite normal T cells",
    "Absent B cells, absent tonsils, and infections only after maternal IgG wanes are X-linked agammaglobulinemia. Opsonizing antibody is missing, but T-cell function is preserved. Pneumocystis jirovecii pneumonia despite normal T cells is inconsistent, because Pneumocystis susceptibility tracks T-cell failure, which this infant does not have. Streptococcus pneumoniae bacteremia is consistent, because encapsulated bacteria are the classic pyogenic infections once antibody is gone. Haemophilus influenzae pneumonia is consistent for the same reason: polysaccharide-coated organisms require antibody for efficient opsonization. Giardia lamblia intestinal infection is consistent, because secretory antibody at the mucosa is absent and Giardia is a standard gut pathogen in this disease. Echovirus meningoencephalitis is consistent, because enteroviruses are the viruses these boys handle poorly even though most other viral infections are controlled by intact T cells.",
    "robbins-10",
)

add(
    "Terminal complement infection mismatch",
    4,
    "microbiology",
    "A 19-year-old man has a third episode of Neisseria meningitidis bacteremia and once had disseminated Neisseria gonorrhoeae with tenosynovitis. CH50 is nearly zero. Vaccine antibody titers, B-cell counts, T-cell counts, and the neutrophil oxidative burst are normal. He forms pus at sites of infection and has never had a liver abscess or invasive mold disease. Which infection is inconsistent with this immunodeficiency?",
    "Which infection is inconsistent with this immunodeficiency?",
    [
        "Invasive pulmonary aspergillosis from an oxidative-burst defect",
        "Recurrent Neisseria meningitidis meningitis",
        "Disseminated Neisseria gonorrhoeae infection",
        "Meningococcemia with purpura fulminans",
        "A second episode of meningococcal bacteremia",
    ],
    "Invasive pulmonary aspergillosis from an oxidative-burst defect",
    "Recurrent Neisseria with a dead CH50 and an intact oxidative burst is a terminal-complement or membrane-attack-complex defect. The MAC lyses Neisseria. Invasive pulmonary aspergillosis from an oxidative-burst defect is inconsistent, because Aspergillus invasive disease points to neutrophils that cannot make superoxide, and this burst test is normal. Recurrent Neisseria meningitidis meningitis is the expected infection, not a mismatch, because meningococcus is the organism MAC deficiency fails to kill. Disseminated Neisseria gonorrhoeae infection is the same lesson in a second Neisseria species and fits the defect. Meningococcemia with purpura fulminans is the severe form of that same susceptibility, not evidence of a phagocyte disorder. A second episode of meningococcal bacteremia is exactly the recurrence pattern that should prompt complement testing, so it fits rather than contradicts the diagnosis.",
    "robbins-10",
)

add(
    "DiGeorge infection mismatch",
    4,
    "microbiology",
    "A 2-month-old infant has hypocalcemic seizures, truncus arteriosus, no thymic shadow, and low T cells with normal B-cell counts. He already has oral candidiasis, Pneumocystis jirovecii pneumonia, and cytomegalovirus pneumonitis. The neutrophil oxidative burst is normal, and immunoglobulin production is not the primary defect. A consultant adds Burkholderia cepacia coverage as if the child had chronic granulomatous disease. Which infection is inconsistent with this immunodeficiency?",
    "Which infection is inconsistent with this immunodeficiency?",
    [
        "Burkholderia cepacia pneumonia from an oxidative-burst defect",
        "Chronic mucocutaneous candidiasis",
        "Pneumocystis jirovecii pneumonia",
        "Cytomegalovirus pneumonitis",
        "Severe varicella-zoster infection",
    ],
    "Burkholderia cepacia pneumonia from an oxidative-burst defect",
    "No thymus, hypocalcemia, and a conotruncal heart lesion are DiGeorge syndrome, a T-cell field defect. Burkholderia cepacia pneumonia from an oxidative-burst defect is inconsistent, because Burkholderia is a catalase-positive signature of NADPH oxidase failure, and this infant has a normal oxidative burst. Chronic mucocutaneous candidiasis is expected when T cells cannot control Candida on skin and mucosa. Pneumocystis jirovecii pneumonia is expected, because Pneumocystis is the classic opportunistic pathogen of impaired T-cell immunity. Cytomegalovirus pneumonitis is expected, because herpesviruses and other intracellular pathogens require T cells. Severe varicella-zoster infection is expected for the same reason and would fit this infant, whereas it would not be the defining infection of a pure complement or phagocyte defect.",
    "robbins-10",
)

add(
    "Interleukin-12 infection mismatch",
    5,
    "microbiology",
    "A 4-year-old girl developed disseminated BCG after vaccination, then disseminated Mycobacterium avium and recurrent nontyphoidal Salmonella bacteremia. Stimulated lymphocytes make almost no interferon-gamma, and an interleukin-12 receptor defect is confirmed. The neutrophil oxidative burst is normal, and she has no chronic thrush, no retained primary teeth, and no cold staphylococcal abscesses. Which infection is inconsistent with this immunodeficiency?",
    "Which infection is inconsistent with this immunodeficiency?",
    [
        "Chronic mucocutaneous candidiasis from Th17 failure",
        "Disseminated Mycobacterium avium disease",
        "Disseminated BCG after vaccination",
        "Invasive nontyphoidal Salmonella bacteremia",
        "Disseminated Mycobacterium tuberculosis",
    ],
    "Chronic mucocutaneous candidiasis from Th17 failure",
    "The interleukin-12 receptor is required for T cells and NK cells to release interferon-gamma, which activates macrophages against intracellular bacteria. Chronic mucocutaneous candidiasis from Th17 failure is inconsistent, because Candida at skin and mucosa is controlled by the interleukin-17 axis, not by interleukin-12, and this child has no thrush. Disseminated Mycobacterium avium disease is the expected pathogen when macrophages never receive interferon-gamma. Disseminated BCG after vaccination is the same defect presenting after a live mycobacterial vaccine, so it fits. Invasive nontyphoidal Salmonella bacteremia fits, because Salmonella is the other classic intracellular bacterium of this axis. Disseminated Mycobacterium tuberculosis fits for the same macrophage-activation failure and would not be the infection that argues against the diagnosis.",
    "robbins-10",
)

add(
    "Hyper-IgE infection mismatch",
    5,
    "microbiology",
    "A 9-year-old boy has coarse facies, retained primary teeth, eosinophilia, and serum IgE of 8,000 IU/mL. He has had cold staphylococcal abscesses without much redness, Candida infection of the nails and mouth, and a pneumatocele after staphylococcal pneumonia. STAT3 signaling is impaired. The interferon-gamma pathway and oxidative burst are intact, and he has never had disseminated mycobacteria. Which infection is inconsistent with this immunodeficiency?",
    "Which infection is inconsistent with this immunodeficiency?",
    [
        "Disseminated Mycobacterium avium from interleukin-12 failure",
        "Cold staphylococcal abscesses of the skin",
        "Chronic mucocutaneous candidiasis",
        "Staphylococcal pneumonia with pneumatocele formation",
        "Recurrent staphylococcal lung abscesses",
    ],
    "Disseminated Mycobacterium avium from interleukin-12 failure",
    "STAT3 hyper-IgE syndrome impairs Th17 cells, so Staphylococcus and Candida escape, but the interleukin-12 interferon-gamma axis is intact. Disseminated Mycobacterium avium from interleukin-12 failure is inconsistent, because that infection defines a macrophage-activation defect this child does not have. Cold staphylococcal abscesses of the skin are the classic finding, often with little warmth because inflammation is disordered. Chronic mucocutaneous candidiasis fits, because Th17 failure removes the cytokine that protects mucosa and nails from Candida. Staphylococcal pneumonia with pneumatocele formation fits and is a board clue to hyper-IgE rather than to chronic granulomatous disease. Recurrent staphylococcal lung abscesses fit the same neutrophil-recruitment and Th17 problem and do not suggest a mycobacterial pathway defect.",
    "robbins-10",
)

add(
    "Asplenia infection mismatch",
    4,
    "microbiology",
    "A 40-year-old man had a traumatic splenectomy three years ago. The smear shows Howell-Jolly bodies. He has not kept up with vaccines. T-cell counts, neutrophil oxidative burst, and complement hemolytic assays are normal. He now presents with fever after a dog bite, and the question is which organisms his missing spleen actually fails to clear. Which infection is inconsistent with isolated asplenia?",
    "Which infection is inconsistent with isolated asplenia?",
    [
        "Pneumocystis jirovecii pneumonia from a T-cell defect",
        "Streptococcus pneumoniae bacteremia",
        "Haemophilus influenzae meningitis",
        "Neisseria meningitidis sepsis",
        "Babesia microti hemolysis",
    ],
    "Pneumocystis jirovecii pneumonia from a T-cell defect",
    "The spleen clears encapsulated bacteria and intraerythrocytic parasites. Pneumocystis jirovecii pneumonia from a T-cell defect is inconsistent with isolated asplenia, because Pneumocystis requires a T-cell host defect and his T cells are normal. Streptococcus pneumoniae bacteremia is the most common overwhelming post-splenectomy infection and fits. Haemophilus influenzae meningitis fits, because Haemophilus is an encapsulated organism that the spleen and antibody normally opsonize. Neisseria meningitidis sepsis also fits asplenia, which is a different reason for meningococcal disease than terminal complement deficiency. Babesia microti hemolysis fits, because the spleen removes parasitized red cells and asplenic patients have severe babesiosis.",
    "robbins-10",
)

add(
    "Candidiasis infection mismatch",
    4,
    "microbiology",
    "A 16-year-old girl has chronic Candida infection of the mouth, esophagus, nails, and skin, plus hypoparathyroidism and adrenal insufficiency from an AIRE mutation. Neutrophil count and oxidative burst are normal, T cells respond to other antigens, and she has no disseminated mycobacteria and no invasive mold disease. A note equates every fungus with this diagnosis. Which infection is inconsistent with this immunodeficiency?",
    "Which infection is inconsistent with this immunodeficiency?",
    [
        "Invasive pulmonary aspergillosis from burst failure",
        "Oral candidiasis",
        "Esophageal candidiasis",
        "Candida infection of the nails",
        "Cutaneous candidiasis",
    ],
    "Invasive pulmonary aspergillosis from burst failure",
    "Autoimmune polyendocrine syndrome type 1 causes a selective T-cell failure against Candida, not a global neutrophil defect. Invasive pulmonary aspergillosis from burst failure is inconsistent, because invasive Aspergillus is a disease of neutrophils that cannot make superoxide or of prolonged neutropenia, and this oxidative burst is normal. Oral candidiasis is the surface infection this syndrome produces and therefore fits. Esophageal candidiasis is the same mucosal susceptibility and fits. Candida infection of the nails fits chronic mucocutaneous candidiasis and does not imply dissemination. Cutaneous candidiasis fits the skin and nail pattern and still leaves deep tissue molds unexplained by this gene defect.",
    "robbins-10",
)

add(
    "Acute hemolytic transfusion timing",
    4,
    "pathology",
    "During the first 15 minutes of a packed red-cell transfusion, a 54-year-old man develops fever, flank pain, hypotension of 80/50 mm Hg, and red urine. Hemoglobinuria is present, haptoglobin is undetectable, and oozing begins from the IV site. The direct antiglobulin test is positive. A clerical check shows the unit was issued for another patient. The plasma in the tubing is pink. This is his first unit of the day, not a reaction that waited a week. Which transfusion reaction fits the timing and the hemoglobinuria?",
    "Which transfusion reaction fits this presentation?",
    [
        "Acute hemolytic transfusion reaction from preformed ABO antibodies",
        "Febrile nonhemolytic reaction from cytokines without hemolysis",
        "Transfusion-related acute lung injury with noncardiogenic edema",
        "Circulatory overload with hypertension and an elevated BNP",
        "Delayed hemolytic reaction from anamnestic Kidd antibodies",
    ],
    "Acute hemolytic transfusion reaction from preformed ABO antibodies",
    "Fever, flank pain, hypotension, hemoglobinuria, coagulopathy, and a positive direct antiglobulin test within minutes are an acute hemolytic transfusion reaction from preformed ABO antibodies. IgM isohemagglutinins fix complement and lyse donor cells intravascularly. The unit is stopped at once. Febrile nonhemolytic reaction from cytokines without hemolysis is incorrect because a cytokine fever does not drop haptoglobin, turn urine red, or start DIC, and the antiglobulin test stays negative. Transfusion-related acute lung injury with noncardiogenic edema is incorrect because TRALI is hypoxemia and bilateral infiltrates during or within six hours, not hemoglobinuria and pink plasma. Circulatory overload with hypertension and an elevated BNP is incorrect because overload raises blood pressure and natriuretic peptide and does not lyse red cells. Delayed hemolytic reaction from anamnestic Kidd antibodies is incorrect because that extravascular hemolysis appears days to a week later, not in the first 15 minutes of the infusion.",
    "robbins-10",
)

add(
    "Febrile nonhemolytic timing",
    4,
    "pathology",
    "An hour into a red-cell transfusion, a 49-year-old woman who has been pregnant twice develops a fever of 38.8 C and rigors. Blood pressure stays 128/76 mm Hg. Urine is yellow, hemoglobin and haptoglobin do not fall, the direct antiglobulin test is negative, and the chest radiograph is clear. She has no urticaria or wheeze. The unit is leukoreduced poorly and she has had similar fevers with prior transfusions. Which reaction fits fever without hemolysis during the transfusion?",
    "Which reaction fits this fever?",
    [
        "Febrile nonhemolytic reaction from cytokines or leukocyte antibodies",
        "Acute hemolytic reaction from ABO incompatibility",
        "IgA anaphylaxis with bronchospasm and shock",
        "Transfusion-related acute lung injury within six hours",
        "Bacterial contamination with septic shock from platelets",
    ],
    "Febrile nonhemolytic reaction from cytokines or leukocyte antibodies",
    "Fever and rigors during transfusion with a stable pressure, no hemoglobinuria, a negative direct antiglobulin test, and a clear chest film are a febrile nonhemolytic reaction from cytokines or leukocyte antibodies. Recipient antibodies against donor leukocytes, or cytokines in the bag, cause the fever. Acute hemolytic reaction from ABO incompatibility is incorrect because ABO hemolysis produces flank pain, hypotension, hemoglobinuria, and a positive antiglobulin test, none of which are present. IgA anaphylaxis with bronchospasm and shock is incorrect because anaphylaxis in IgA deficiency is airway edema and hypotension, often without fever as the main event, and this patient has rigors with a normal blood pressure and no wheeze. Transfusion-related acute lung injury within six hours is incorrect because TRALI causes hypoxemia and bilateral infiltrates, and this radiograph is clear. Bacterial contamination with septic shock from platelets is incorrect because contaminated product causes high fever plus hypotension and shock, more often from room-temperature platelets, and her pressure is normal.",
    "robbins-10",
)

add(
    "IgA anaphylactic transfusion timing",
    4,
    "pathology",
    "A 33-year-old woman with known selective IgA deficiency and anti-IgA antibodies receives 20 mL of plasma. Within minutes she has bronchospasm, laryngeal edema, vomiting, and blood pressure 70/40 mm Hg, without fever, flank pain, or red urine. Hemoglobin is unchanged, the direct antiglobulin test is negative, and the chest film shows no edema. She has a long history of sinopulmonary infections and absent serum IgA. Which reaction fits immediate anaphylaxis without hemolysis?",
    "Which reaction fits this collapse?",
    [
        "Anaphylactic transfusion reaction from anti-IgA antibodies",
        "Acute hemolytic reaction from preformed ABO isohemagglutinins",
        "Febrile nonhemolytic reaction from leukocyte cytokines",
        "Transfusion-related acute lung injury with normal wedge pressure",
        "Circulatory overload with hypertension and high filling pressure",
    ],
    "Anaphylactic transfusion reaction from anti-IgA antibodies",
    "Bronchospasm and shock within minutes of a small volume of plasma, in a patient with IgA deficiency and anti-IgA, are an anaphylactic transfusion reaction from anti-IgA antibodies. Donor IgA meets preformed antibody and mast cells degranulate. There is no red-cell lysis. Acute hemolytic reaction from preformed ABO isohemagglutinins is incorrect because ABO mismatch causes hemoglobinuria, a positive antiglobulin test, and flank pain, and her urine and antiglobulin test are normal. Febrile nonhemolytic reaction from leukocyte cytokines is incorrect because that reaction is fever and rigors without airway collapse or hypotension as the dominant picture. Transfusion-related acute lung injury with normal wedge pressure is incorrect because TRALI is noncardiogenic pulmonary edema and hypoxemia, and this film shows no edema while the airway is the problem. Circulatory overload with hypertension and high filling pressure is incorrect because overload raises blood pressure in a volume-sensitive patient and does not cause laryngeal edema after 20 mL.",
    "robbins-10",
)

add(
    "TRALI wedge pressure excludes overload",
    5,
    "pathology",
    "Thirty minutes after a plasma transfusion, a 44-year-old man becomes febrile and hypoxemic, with blood pressure 90/60 mm Hg and bilateral infiltrates. He was euvolemic before the unit. BNP is 40 pg/mL. A pulmonary artery catheter shows wedge pressure 8 mm Hg. Donor plasma later tests positive for anti-HLA antibodies that match the recipient. There is no hemoglobinuria. A student calls this circulatory overload and orders a large diuretic. Which reaction fits the timing and the normal wedge pressure?",
    "Which reaction fits this hypoxemia?",
    [
        "Transfusion-related acute lung injury with noncardiogenic edema",
        "Circulatory overload with hypertension and a high wedge pressure",
        "Acute hemolytic reaction with hemoglobinuria and DIC",
        "Cardiogenic shock from an anterior myocardial infarction",
        "Delayed hemolytic reaction appearing a week later",
    ],
    "Transfusion-related acute lung injury with noncardiogenic edema",
    "Hypoxemia, fever, hypotension, bilateral infiltrates, and wedge pressure 8 mm Hg during or within six hours of transfusion are transfusion-related acute lung injury with noncardiogenic edema. Donor anti-HLA or anti-neutrophil antibodies activate recipient neutrophils in the lung. Diuretics do not fix a capillary leak. Circulatory overload with hypertension and a high wedge pressure is incorrect because overload causes hypertension, an elevated BNP, and wedge pressure typically above 18 mm Hg; a wedge pressure of 8 mm Hg and BNP of 40 pg/mL exclude a hydrostatic mechanism. Acute hemolytic reaction with hemoglobinuria and DIC is incorrect because there is no red urine, flank pain, or falling haptoglobin described, and hemolysis does not produce this noncardiogenic edema pattern as its defining lesion. Cardiogenic shock from an anterior myocardial infarction is incorrect because pump failure would raise wedge pressure and would not be tied to donor HLA antibody in the plasma unit. Delayed hemolytic reaction appearing a week later is incorrect because the respiratory collapse is during the transfusion, not days afterward, and delayed hemolysis is a falling hematocrit rather than acute lung injury.",
    "robbins-10",
)

add(
    "Circulatory overload timing",
    4,
    "pathology",
    "An 82-year-old man with known heart failure receives three units of red cells quickly for a hemoglobin of 6.8 g/dL. During the third unit he becomes dyspneic and hypertensive at 184/102 mm Hg. BNP is 1,600 pg/mL. Wedge pressure is 26 mm Hg. The chest film shows vascular redistribution and edema. He is afebrile, urine is clear, and he improves after a diuretic and slowing of the transfusion. Which reaction fits hypertension and a high wedge pressure during transfusion?",
    "Which reaction fits this pulmonary edema?",
    [
        "Transfusion-associated circulatory overload with high filling pressure",
        "Transfusion-related acute lung injury with a normal wedge pressure",
        "Acute hemolytic reaction from ABO incompatibility",
        "Anaphylaxis from anti-IgA antibodies in IgA deficiency",
        "Saddle pulmonary embolism with a low wedge pressure",
    ],
    "Transfusion-associated circulatory overload with high filling pressure",
    "Dyspnea, hypertension, markedly elevated BNP, and wedge pressure 26 mm Hg during rapid transfusion in a patient with heart failure are transfusion-associated circulatory overload with high filling pressure. The left ventricle cannot accept the volume, hydrostatic pressure rises, and diuretics help. Transfusion-related acute lung injury with a normal wedge pressure is incorrect because TRALI is noncardiogenic, often with fever and hypotension, and wedge pressure stays low or normal rather than 26 mm Hg. Acute hemolytic reaction from ABO incompatibility is incorrect because he is afebrile with clear urine and no coagulopathy, and hemolysis does not raise wedge pressure as the main finding. Anaphylaxis from anti-IgA antibodies in IgA deficiency is incorrect because anaphylaxis is bronchospasm and hypotension after a small volume, not hypertension and a high BNP. Saddle pulmonary embolism with a low wedge pressure is incorrect because massive embolism raises central venous pressure while wedge pressure is low or normal, the opposite of a wedge pressure of 26 mm Hg.",
    "robbins-10",
)

add(
    "Delayed hemolytic transfusion timing",
    5,
    "pathology",
    "A 62-year-old woman was transfused without incident eight days ago after surgery. She had also been transfused years earlier during childbirth. Today hemoglobin has fallen from 10.2 to 7.1 g/dL, indirect bilirubin is up, the smear shows spherocytes, and the direct antiglobulin test is newly positive. An anti-Jka antibody is identified that was undetectable at the time of crossmatch. She has no rash, diarrhea, or thrombocytopenia. Fever and dark urine did not occur during the original transfusion. Which reaction fits hemolysis on day 8?",
    "Which reaction fits hemolysis on day 8?",
    [
        "Delayed hemolytic reaction from anamnestic Kidd antibodies",
        "Acute hemolytic reaction during the original transfusion",
        "Febrile nonhemolytic reaction limited to the infusion",
        "Post-transfusion purpura with anti-HPA-1a antibodies",
        "Transfusion-associated graft-versus-host disease",
    ],
    "Delayed hemolytic reaction from anamnestic Kidd antibodies",
    "A falling hemoglobin, jaundice, spherocytes, and a new positive direct antiglobulin test about a week after transfusion are a delayed hemolytic reaction from anamnestic Kidd antibodies. Prior sensitization left memory B cells below the level the crossmatch could detect. Re-exposure drives IgG, and extravascular hemolysis follows on day 3 to 14. Kidd antibodies are notorious for this anamnestic pattern. Acute hemolytic reaction during the original transfusion is incorrect because ABO intravascular hemolysis occurs in minutes with hemoglobinuria and shock, and that transfusion was uneventful. Febrile nonhemolytic reaction limited to the infusion is incorrect because a cytokine fever happens during the unit and does not lyse cells a week later. Post-transfusion purpura with anti-HPA-1a antibodies is incorrect because that illness crashes the platelet count about a week later while hemoglobin is not the primary falling line, and her problem is anemia with spherocytes. Transfusion-associated graft-versus-host disease is incorrect because graft-versus-host disease produces rash, diarrhea, hepatitis, and pancytopenia from donor lymphocytes, not an isolated antibody-positive hemolysis with anti-Jka.",
    "robbins-10",
)

add(
    "Post-transfusion purpura timing",
    4,
    "pathology",
    "A 58-year-old multiparous woman received red cells nine days ago. Hemoglobin is stable at 11 g/dL, but the platelet count is 7,000 per microliter and she has wet purpura and oral mucosal bleeding. She was not given heparin. An assay finds alloantibody against platelet antigen HPA-1a. The direct antiglobulin test is negative and bilirubin is normal. There is no rash or diarrhea. Which reaction fits profound thrombocytopenia at day 9 with a stable hemoglobin?",
    "Which reaction fits this thrombocytopenia?",
    [
        "Post-transfusion purpura from anti-HPA-1a alloantibody",
        "Delayed hemolytic reaction from anamnestic red-cell antibodies",
        "Heparin-induced thrombocytopenia with new thrombosis",
        "Acute hemolytic reaction in the first minutes of transfusion",
        "Transfusion-associated graft-versus-host pancytopenia",
    ],
    "Post-transfusion purpura from anti-HPA-1a alloantibody",
    "Profound thrombocytopenia and bleeding about 5 to 12 days after transfusion in a previously pregnant or transfused patient, with antibody against HPA-1a and a stable hemoglobin, are post-transfusion purpura from anti-HPA-1a alloantibody. The alloantibody clears transfused platelets and also the patient's own platelets. Delayed hemolytic reaction from anamnestic red-cell antibodies is incorrect because that reaction drops hemoglobin and raises bilirubin with a positive antiglobulin test, and her red-cell mass and bilirubin are stable. Heparin-induced thrombocytopenia with new thrombosis is incorrect because she was not given heparin and the picture is bleeding from a platelet count of 7,000, not thrombosis at a count near 50,000. Acute hemolytic reaction in the first minutes of transfusion is incorrect because the event is on day 9 and red cells are not lysing. Transfusion-associated graft-versus-host pancytopenia is incorrect because graft-versus-host disease lowers several lines and adds rash, diarrhea, and liver injury from donor lymphocytes, not an isolated anti-HPA-1a platelet crash.",
    "robbins-10",
)

add(
    "Carbon monoxide antidote",
    4,
    "pharmacology",
    "A 48-year-old man is found confused in a closed garage with a running engine. Skin is cherry red. He had a brief syncope. Arterial oxygen tension is 98 mm Hg, but co-oximetry shows carboxyhemoglobin 34 percent and standard pulse oximetry reads 96 percent. Lactate is only 2.4 mmol/L, there is no bitter-almond odor, and the blood is not chocolate brown. He is placed on high-flow oxygen. Which antidote matches carbon monoxide binding to hemoglobin?",
    "Which antidote matches this mechanism?",
    [
        "Hyperbaric oxygen to displace carbon monoxide from hemoglobin",
        "Methylene blue to reduce ferric iron in methemoglobin",
        "Hydroxocobalamin to bind cyanide as cyanocobalamin",
        "Fomepizole to inhibit alcohol dehydrogenase",
        "N-acetylcysteine to replenish glutathione for NAPQI",
    ],
    "Hyperbaric oxygen to displace carbon monoxide from hemoglobin",
    "Carbon monoxide binds hemoglobin with affinity far above oxygen, shifts the remaining curve left, and leaves dissolved arterial oxygen tension normal, which is why the PaO2 is 98 mm Hg while carboxyhemoglobin is 34 percent. Syncope and a level this high warrant hyperbaric oxygen to displace carbon monoxide from hemoglobin by raising dissolved oxygen and shortening the half-life. Methylene blue to reduce ferric iron in methemoglobin is incorrect because methemoglobin is chocolate-brown blood that does not correct its saturation gap with oxygen, and this blood is cherry red with a measured carboxyhemoglobin. Hydroxocobalamin to bind cyanide as cyanocobalamin is incorrect because cyanide causes a large lactate from cytochrome oxidase block and was not suggested by the mild lactate or the closed-garage source without fire smoke. Fomepizole to inhibit alcohol dehydrogenase is incorrect because that enzyme makes toxic acids from methanol and ethylene glycol, which do not raise carboxyhemoglobin. N-acetylcysteine to replenish glutathione for NAPQI is incorrect because that is the antidote for acetaminophen, not for a gas bound to heme.",
    "katzung-16",
)

add(
    "Cyanide antidote",
    4,
    "pharmacology",
    "A 66-year-old man has received a high-dose sodium nitroprusside infusion for three days. He becomes confused, with lactate 14 mmol/L, arterial oxygen tension 100 mm Hg, and mixed venous oxygen saturation 92 percent. Carboxyhemoglobin is 1 percent. A bitter-almond odor is noted. Blood is not chocolate brown and methemoglobin is not elevated. Which antidote matches cyanide binding to cytochrome oxidase?",
    "Which antidote matches this mechanism?",
    [
        "Hydroxocobalamin binding cyanide to form cyanocobalamin",
        "Methylene blue as cofactor for methemoglobin reductase",
        "Hyperbaric oxygen as the sole specific cyanide antidote",
        "Fomepizole inhibition of alcohol dehydrogenase",
        "Deferoxamine chelation of ferric iron",
    ],
    "Hydroxocobalamin binding cyanide to form cyanocobalamin",
    "Nitroprusside releases cyanide, which binds cytochrome oxidase. Cells cannot use oxygen, so lactate rises and mixed venous blood stays abnormally oxygenated at 92 percent even though PaO2 is normal. Hydroxocobalamin binding cyanide to form cyanocobalamin removes cyanide from the oxidase and is the preferred antidote. Methylene blue as cofactor for methemoglobin reductase is incorrect because methemoglobin was not elevated and the blood is not chocolate brown; methylene blue treats ferric hemoglobin, not cytochrome poisoning. Hyperbaric oxygen as the sole specific cyanide antidote is incorrect because oxygen does not restore a blocked oxidase or chelate cyanide, although oxygen is supportive. Fomepizole inhibition of alcohol dehydrogenase is incorrect because that blocks formation of acids from toxic alcohols and does not bind cyanide. Deferoxamine chelation of ferric iron is incorrect because iron toxicity is a tablet ingestion with radiopaque pills and gastrointestinal bleeding, not a nitroprusside infusion.",
    "katzung-16",
)

add(
    "Cyanide with carbon monoxide",
    5,
    "pharmacology",
    "A 35-year-old woman is pulled from a house fire. She is comatose, hypotensive, and covered in soot. Carboxyhemoglobin is 25 percent, lactate is 16 mmol/L, and mixed venous oxygen saturation is high. Both carbon monoxide and cyanide are suspected from combustion of plastics. A colleague prepares amyl nitrite to create methemoglobin as a cyanide sink. Which antidote matches the cyanide mechanism without further loss of oxygen-carrying hemoglobin?",
    "Which antidote is appropriate in this combined poisoning?",
    [
        "Hydroxocobalamin to bind cyanide without creating methemoglobin",
        "Amyl nitrite to generate methemoglobin as a cyanide-binding site",
        "Methylene blue to treat presumed methemoglobinemia",
        "Fomepizole to block alcohol dehydrogenase",
        "Deferoxamine to chelate iron released by hemolysis",
    ],
    "Hydroxocobalamin to bind cyanide without creating methemoglobin",
    "Smoke inhalation can deliver carbon monoxide and cyanide together. Cyanide stops cytochrome oxidase and drives the large lactate and high mixed venous saturation, while carbon monoxide already occupies hemoglobin. Hydroxocobalamin to bind cyanide without creating methemoglobin treats the oxidase poison and leaves the remaining hemoglobin available for oxygen. Amyl nitrite to generate methemoglobin as a cyanide-binding site is dangerous here, because nitrite-made methemoglobin plus carboxyhemoglobin further reduces oxygen delivery in a patient who already cannot carry oxygen normally. Methylene blue to treat presumed methemoglobinemia is incorrect because the pigment problem is carboxyhemoglobin, not ferric heme, and methylene blue is not a cyanide chelator. Fomepizole to block alcohol dehydrogenase is incorrect because no toxic alcohol is involved. Deferoxamine to chelate iron released by hemolysis is incorrect because fire gas poisoning is not iron overload and there is no radiopaque tablet burden.",
    "katzung-16",
)

add(
    "Methemoglobin antidote",
    4,
    "pharmacology",
    "A 52-year-old man becomes cyanotic after topical benzocaine for endoscopy. Arterial oxygen tension is 96 mm Hg, pulse oximetry stays near 85 percent despite oxygen, and the drawn blood is chocolate brown. Co-oximetry shows methemoglobin 32 percent. Carboxyhemoglobin is normal. He has no glucose-6-phosphate dehydrogenase deficiency and no bite cells. Which antidote matches reduction of ferric heme back to ferrous heme?",
    "Which antidote matches this pigment?",
    [
        "Methylene blue as a cofactor for NADPH methemoglobin reductase",
        "Hyperbaric oxygen to displace carbon monoxide from hemoglobin",
        "Hydroxocobalamin to bind cyanide as cyanocobalamin",
        "N-acetylcysteine as the specific methemoglobin antidote",
        "Fomepizole to inhibit alcohol dehydrogenase",
    ],
    "Methylene blue as a cofactor for NADPH methemoglobin reductase",
    "Benzocaine oxidizes heme iron to Fe3+. Methemoglobin cannot bind oxygen, blood looks chocolate brown, dissolved PaO2 stays normal, and pulse oximetry stalls near 85 percent. Methylene blue as a cofactor for NADPH methemoglobin reductase is reduced to leukomethylene blue, which returns iron to the ferrous state. Hyperbaric oxygen to displace carbon monoxide from hemoglobin is incorrect because carboxyhemoglobin is normal and the pigment is ferric heme, not carbon monoxide; oxygen alone does not reduce Fe3+. Hydroxocobalamin to bind cyanide as cyanocobalamin is incorrect because cyanide does not make chocolate blood or a methemoglobin fraction of 32 percent. N-acetylcysteine as the specific methemoglobin antidote is incorrect because N-acetylcysteine restores glutathione for acetaminophen and is not the electron shuttle used first for methemoglobin when G6PD is normal. Fomepizole to inhibit alcohol dehydrogenase is incorrect because benzocaine is not a toxic alcohol.",
    "katzung-16",
)

add(
    "Methemoglobin in G6PD deficiency",
    5,
    "pharmacology",
    "A 28-year-old man develops cyanosis and chocolate-brown blood after dapsone. Methemoglobin is 28 percent, PaO2 is normal, and pulse oximetry is 85 percent. He also has bite cells, Heinz bodies, and a low glucose-6-phosphate dehydrogenase level after a prior hemolytic episode with primaquine. A colleague draws up methylene blue as the usual methemoglobin antidote. Which antidote matches the mechanism when NADPH cannot be generated?",
    "Which antidote is appropriate in this patient?",
    [
        "Ascorbic acid because methylene blue requires NADPH he cannot make",
        "Methylene blue as the cofactor for NADPH methemoglobin reductase",
        "Hydroxocobalamin to bind cyanide released by dapsone",
        "Fomepizole to inhibit alcohol dehydrogenase",
        "Pralidoxime to regenerate acetylcholinesterase",
    ],
    "Ascorbic acid because methylene blue requires NADPH he cannot make",
    "Methylene blue works only after NADPH-methemoglobin reductase reduces it to leukomethylene blue. Glucose-6-phosphate dehydrogenase deficiency cannot supply that NADPH, so methylene blue fails and can worsen oxidative hemolysis. Ascorbic acid because methylene blue requires NADPH he cannot make is the slow alternative that can reduce methemoglobin without that pathway. Methylene blue as the cofactor for NADPH methemoglobin reductase is the standard antidote only when the pentose phosphate pathway is intact, and it is the wrong next drug in this patient. Hydroxocobalamin to bind cyanide released by dapsone is incorrect because dapsone oxidizes heme iron; it does not poison cytochrome oxidase. Fomepizole to inhibit alcohol dehydrogenase is incorrect because no parent alcohol is being converted to a toxic acid. Pralidoxime to regenerate acetylcholinesterase is incorrect because the enzyme problem is not organophosphate aging; it is ferric hemoglobin in a red cell that cannot make NADPH.",
    "katzung-16",
)

add(
    "Organophosphate antidotes before aging",
    4,
    "pharmacology",
    "A 40-year-old farmworker is brought in 30 minutes after a malathion spill. He has diarrhea, urination, miosis, bradycardia at 42/min, bronchorrhea, wheezing, and muscle fasciculations. The exposure is still within the window before acetylcholinesterase aging. A colleague suggests physostigmine to raise acetylcholine further. Which antidote pair matches muscarinic blockade plus enzyme regeneration?",
    "Which antidote pair matches this mechanism?",
    [
        "Atropine for muscarinic block plus pralidoxime before aging",
        "Physostigmine to increase acetylcholine at the synapse",
        "Pralidoxime alone as if it immediately dries secretions",
        "Atropine alone as if it regenerates acetylcholinesterase",
        "N-acetylcysteine to replenish glutathione",
    ],
    "Atropine for muscarinic block plus pralidoxime before aging",
    "Organophosphates phosphorylate acetylcholinesterase and acetylcholine floods both muscarinic and nicotinic synapses. Atropine for muscarinic block plus pralidoxime before aging is the pair that fits: atropine dries secretions and raises heart rate now, and pralidoxime regenerates the enzyme if the alkyl group has not yet left. Physostigmine to increase acetylcholine at the synapse is incorrect because physostigmine itself inhibits acetylcholinesterase and would deepen the cholinergic crisis. Pralidoxime alone as if it immediately dries secretions is incorrect because the oxime does not block muscarinic receptors and does not replace immediate atropine for bronchorrhea and bradycardia. Atropine alone as if it regenerates acetylcholinesterase is incorrect because atropine never restores the enzyme and does not reverse nicotinic weakness; before aging, pralidoxime is still indicated. N-acetylcysteine to replenish glutathione is incorrect because the toxin is not NAPQI and glutathione is not the missing cofactor.",
    "katzung-16",
)

add(
    "Aged acetylcholinesterase",
    5,
    "pharmacology",
    "A 30-year-old soldier was exposed to soman four hours ago. He still has bradycardia, wheezing, and copious secretions. Soman-inhibited acetylcholinesterase ages within minutes, losing an alkyl group so the enzyme can no longer be reactivated. Fasciculations were present early. A new clinician orders pralidoxime as the primary antidote because the cholinergic signs continue. Which therapy still matches the mechanism after aging?",
    "Which therapy still matches the mechanism after aging?",
    [
        "Atropine blockade of muscarinic receptors after enzyme aging",
        "Pralidoxime regeneration of acetylcholinesterase as primary therapy",
        "Physostigmine to increase synaptic acetylcholine",
        "N-acetylcysteine repletion of glutathione",
        "Fomepizole inhibition of alcohol dehydrogenase",
    ],
    "Atropine blockade of muscarinic receptors after enzyme aging",
    "Once the aged enzyme has lost its alkyl group, oximes cannot pry the phosphate off. Atropine blockade of muscarinic receptors after enzyme aging still competes with acetylcholine at muscarinic sites and is the antidote that matches the ongoing secretions and bradycardia. Pralidoxime regeneration of acetylcholinesterase as primary therapy is incorrect for soman hours later, because aging has already made reactivation chemically impossible. Physostigmine to increase synaptic acetylcholine is incorrect because adding more acetylcholinesterase inhibition worsens every cholinergic sign. N-acetylcysteine repletion of glutathione is incorrect because soman is not metabolized through NAPQI and glutathione is not the therapeutic target. Fomepizole inhibition of alcohol dehydrogenase is incorrect because soman is not a substrate of alcohol dehydrogenase.",
    "katzung-16",
)

add(
    "Acetaminophen antidote",
    4,
    "pharmacology",
    "A 24-year-old woman swallowed 20 g of acetaminophen 10 hours ago. She is nauseated. AST and ALT are still inside the reference range. The four-hour equivalent plotted from a reliable 10-hour level sits above the treatment line of the Rumack-Matthew nomogram. She asks to wait because the liver tests look normal, and a student says charcoal now replaces the antidote. Which antidote matches glutathione restoration for NAPQI?",
    "Which antidote matches this mechanism?",
    [
        "N-acetylcysteine to replenish glutathione and detoxify NAPQI",
        "Sodium bicarbonate to trap a weak acid in alkaline urine",
        "Fomepizole to inhibit alcohol dehydrogenase",
        "Deferoxamine to chelate ferric iron",
        "Methylene blue to reduce methemoglobin",
    ],
    "N-acetylcysteine to replenish glutathione and detoxify NAPQI",
    "CYP2E1 makes NAPQI, which is safe only while glutathione conjugates it. After glutathione is exhausted, NAPQI binds hepatocyte proteins. Injury peaks later, so normal enzymes at 10 hours do not mean safety. N-acetylcysteine to replenish glutathione and detoxify NAPQI is indicated by the nomogram now. Sodium bicarbonate to trap a weak acid in alkaline urine is the salicylate maneuver and does not restore glutathione. Fomepizole to inhibit alcohol dehydrogenase does not block CYP2E1 and is not the acetaminophen antidote. Deferoxamine to chelate ferric iron treats iron tablets, not a glutathione-depletion overdose. Methylene blue to reduce methemoglobin treats ferric heme and has no role against NAPQI. Charcoal may bind drug very early, but at 10 hours it does not replace glutathione repletion.",
    "katzung-16",
)

add(
    "Salicylate antidote not acetazolamide",
    5,
    "pharmacology",
    "A 17-year-old boy took a large aspirin overdose. He has tinnitus, a temperature of 38.9 C, and a respiratory rate of 32/min. Arterial pH is 7.46, PaCO2 is 18 mm Hg, and the anion gap is 22. He is becoming sleepy. A student likes the idea of alkaline urine and orders acetazolamide because it increases urinary bicarbonate. Which therapy matches ion trapping of salicylate without worsening systemic acidosis?",
    "Which therapy matches this mechanism?",
    [
        "Sodium bicarbonate to alkalinize serum and urine and trap salicylate",
        "Acetazolamide to alkalinize urine by causing metabolic acidosis",
        "N-acetylcysteine to replenish glutathione for NAPQI",
        "Fomepizole to inhibit alcohol dehydrogenase",
        "Atropine to dry secretions from cholinergic excess",
    ],
    "Sodium bicarbonate to alkalinize serum and urine and trap salicylate",
    "Salicylate stimulates ventilation and uncouples oxidative phosphorylation, so a primary respiratory alkalosis coexists with an anion-gap metabolic acidosis. The drug is a weak acid. Sodium bicarbonate to alkalinize serum and urine and trap salicylate keeps it ionized in blood, reduces entry into the brain, and traps it in urine. Sleepiness means CNS toxicity and a risk that he will lose the respiratory compensation. Acetazolamide to alkalinize urine by causing metabolic acidosis is the classic wrong urine alkalinizer: urine pH rises but serum bicarbonate falls, nonionized drug crosses into the brain, and the acidosis deepens. N-acetylcysteine to replenish glutathione for NAPQI treats acetaminophen, not salicylate. Fomepizole to inhibit alcohol dehydrogenase does not block salicylate toxicity. Atropine to dry secretions from cholinergic excess treats organophosphate muscarinic signs, which this mixed acid-base picture is not.",
    "katzung-16",
)

add(
    "Iron antidote",
    4,
    "pharmacology",
    "A 2-year-old boy ate his mother's prenatal tablets two hours ago. He is vomiting blood. An abdominal radiograph shows radiopaque tablets. After a quieter hour he becomes hypotensive with an anion-gap metabolic acidosis. The osmolar gap is normal. There is no tinnitus and no oxalate crystals. A student orders activated charcoal as the specific binder and defers chelation. Which antidote matches chelation of ferric iron?",
    "Which antidote matches this ingestion?",
    [
        "Deferoxamine chelation of ferric iron to ferrioxamine",
        "Activated charcoal as a binder that removes iron",
        "Dimercaprol chelation as the first-line iron antidote",
        "Oral succimer as the iron chelator of choice",
        "Fomepizole inhibition of alcohol dehydrogenase",
    ],
    "Deferoxamine chelation of ferric iron to ferrioxamine",
    "Iron corrodes the gut, then poisons mitochondria, producing shock and anion-gap acidosis. A latent lull does not mean the tablets are gone. Radiopaque pills and a normal osmolar gap separate this from toxic alcohols. Deferoxamine chelation of ferric iron to ferrioxamine is the antidote, and the complex colors the urine. Activated charcoal as a binder that removes iron is incorrect because charcoal adsorbs iron poorly and never replaces chelation. Dimercaprol chelation as the first-line iron antidote is incorrect because dimercaprol is used for lead, arsenic, and mercury, and it is not the iron chelator. Oral succimer as the iron chelator of choice is incorrect because succimer is an oral lead chelator, not treatment for a shocked toddler with iron tablets. Fomepizole inhibition of alcohol dehydrogenase is incorrect because iron is not metabolized by that enzyme and the osmolar gap is normal.",
    "katzung-16",
)

add(
    "Lead encephalopathy chelation order",
    5,
    "pharmacology",
    "A 3-year-old boy from a house with peeling paint has abdominal pain, constipation, seizures, and a lead level of 95 micrograms/dL. The smear shows basophilic stippling. He is vomiting and cannot take oral medicine. Wrist drop is present in a sibling with a lower level. A plan is written to start calcium disodium edetate alone. Which chelation sequence matches the need to avoid pushing lead into the brain?",
    "Which chelation sequence matches this mechanism?",
    [
        "Intramuscular dimercaprol before calcium disodium edetate",
        "Calcium disodium edetate alone as the initial chelator",
        "Oral succimer as the chelator of choice in encephalopathy",
        "Deferoxamine to chelate lead into the urine",
        "N-acetylcysteine to replenish glutathione",
    ],
    "Intramuscular dimercaprol before calcium disodium edetate",
    "Lead inhibits ferrochelatase and ALA dehydratase, which explains the stippled cells, abdominal pain, and motor neuropathy. In encephalopathy the chelation that matches the distribution problem is intramuscular dimercaprol before calcium disodium edetate. Dimercaprol is started first because edetate alone can mobilize lead and increase uptake into the brain; the two drugs are then used together. Calcium disodium edetate alone as the initial chelator is the sequence this stem must avoid. Oral succimer as the chelator of choice in encephalopathy is incorrect because succimer is oral therapy for children who are not encephalopathic and who can absorb a gut drug; seizures and vomiting remove that option. Deferoxamine to chelate lead into the urine is the iron chelator and does not treat lead. N-acetylcysteine to replenish glutathione does not chelate lead or restore ferrochelatase.",
    "katzung-16",
)

add(
    "Ethylene glycol antidote",
    5,
    "pharmacology",
    "A 36-year-old man drank antifreeze. He is intoxicated, the osmolar gap is 32, and an anion-gap acidosis follows. Calcium is low, the flanks ache, and urine shows envelope-shaped calcium oxalate crystals. Vision is normal and the optic discs are not hyperemic. A student reaches for folinic acid because it is used in a toxic-alcohol ingestion, and does not block alcohol dehydrogenase. Which antidote matches the enzyme that forms the toxic acids of ethylene glycol?",
    "Which antidote matches this ingestion?",
    [
        "Fomepizole inhibition of alcohol dehydrogenase",
        "Folinic acid to speed formate elimination",
        "N-acetylcysteine repletion of glutathione",
        "Deferoxamine chelation of ferric iron",
        "Methylene blue reduction of methemoglobin",
    ],
    "Fomepizole inhibition of alcohol dehydrogenase",
    "Ethylene glycol itself causes the early osmolar gap. Alcohol dehydrogenase then makes glycolaldehyde and glycolic acid, and oxalic acid precipitates with calcium as envelope crystals and drops the serum calcium. Fomepizole inhibition of alcohol dehydrogenase stops that conversion and is the mechanism-matched antidote. Folinic acid to speed formate elimination is the methanol adjunct, because formate from methanol needs folate to be cleared and methanol is the alcohol that blinds; this patient has oxalate crystals, hypocalcemia, and normal vision, not formic-acid optic injury. N-acetylcysteine repletion of glutathione treats acetaminophen. Deferoxamine chelation of ferric iron treats iron tablets, which do not leave an osmolar gap or oxalate crystals. Methylene blue reduction of methemoglobin treats ferric heme and does not block alcohol dehydrogenase. Thiamine and pyridoxine can shunt glyoxylate, but they do not replace enzyme blockade.",
    "katzung-16",
)

add(
    "AA amyloid",
    4,
    "pathology",
    "A 55-year-old woman with longstanding rheumatoid arthritis develops 6 g of proteinuria per day and an enlarged kidney. Congo red stains the glomerular deposits and they show apple-green birefringence under polarized light. Serum and urine immunofixation are negative, the serum free light-chain ratio is normal, and there is no plasma-cell clone. She has never been on dialysis and has no macroglossia or periorbital purpura. Which precursor protein fits this amyloid?",
    "Which precursor protein fits this amyloid?",
    [
        "AA amyloid derived from serum amyloid A in chronic inflammation",
        "AL amyloid from immunoglobulin light chains",
        "Wild-type transthyretin amyloid limited to the aging heart",
        "Beta-2 microglobulin amyloid from longstanding dialysis",
        "Amyloid-beta peptide from amyloid precursor protein",
    ],
    "AA amyloid derived from serum amyloid A in chronic inflammation",
    "Chronic inflammatory disease, a negative clone workup, and renal amyloid are AA amyloid derived from serum amyloid A in chronic inflammation. The liver makes serum amyloid A as an acute-phase protein, and years of inflammation deposit it in the kidney. Apple-green birefringence only proves amyloid, not the precursor. AL amyloid from immunoglobulin light chains is incorrect because there is no monoclonal light chain, no plasma-cell clone, and no macroglossia or periorbital purpura. Wild-type transthyretin amyloid limited to the aging heart is incorrect because that disease is a restrictive cardiomyopathy in the elderly, not nephrotic syndrome from rheumatoid arthritis. Beta-2 microglobulin amyloid from longstanding dialysis is incorrect because she has never been dialyzed and the deposits are glomerular rather than osteoarticular. Amyloid-beta peptide from amyloid precursor protein is incorrect because that peptide forms cerebral plaques and vascular amyloid, not renal AA deposits in rheumatoid arthritis.",
    "robbins-10",
)

add(
    "AL amyloid",
    4,
    "pathology",
    "A 63-year-old man with fatigue has macroglossia, pinch purpura around the eyes, a restrictive cardiomyopathy with low-voltage QRS complexes, and 4 g of proteinuria. Bone marrow shows 25 percent clonal plasma cells. Serum free lambda light chains are markedly elevated. Congo red deposits in the tongue are apple green under polarized light. Rheumatoid factor and chronic infection are absent. Which precursor protein fits?",
    "Which precursor protein fits this amyloid?",
    [
        "AL amyloid from immunoglobulin light chains",
        "AA amyloid from serum amyloid A in chronic infection",
        "Wild-type transthyretin without a plasma-cell clone",
        "Beta-2 microglobulin retained during dialysis",
        "Calcitonin deposited in medullary thyroid carcinoma",
    ],
    "AL amyloid from immunoglobulin light chains",
    "A plasma-cell clone, excess lambda light chain, macroglossia, periorbital purpura, restrictive cardiomyopathy, and proteinuria are AL amyloid from immunoglobulin light chains. The light chain is the precursor, and the same deposits explain the factor-X-binding purpura and the tongue. AA amyloid from serum amyloid A in chronic infection is incorrect because there is no chronic inflammatory disease and the clone plus free light chains identify a light-chain precursor. Wild-type transthyretin without a plasma-cell clone is incorrect because senile cardiac amyloid has a negative immunofixation and normal free light-chain ratio and does not enlarge the tongue or cause pinch purpura. Beta-2 microglobulin retained during dialysis is incorrect because he is not a long-term dialysis patient and beta-2 microglobulin targets joints and carpal tunnels. Calcitonin deposited in medullary thyroid carcinoma is incorrect because the amyloid is systemic from a marrow clone, not stromal amyloid inside a thyroid medullary tumor.",
    "robbins-10",
)

add(
    "Dialysis amyloid",
    4,
    "pathology",
    "A 70-year-old man has been on hemodialysis for 12 years. He develops bilateral carpal tunnel syndrome, shoulder pain with periarticular swelling, and bone cysts. Synovial tissue stains with Congo red and shows apple-green birefringence. Serum immunofixation is negative, free light chains are not elevated, and he has no chronic rheumatoid disease and no thick-walled restrictive cardiomyopathy. Which precursor protein fits these joint deposits?",
    "Which precursor protein fits these deposits?",
    [
        "Beta-2 microglobulin amyloid retained by long-term dialysis",
        "AL amyloid from a plasma-cell light chain",
        "AA amyloid from serum amyloid A",
        "Wild-type transthyretin causing senile cardiac amyloid",
        "Amyloid-beta peptide in cerebral vessels",
    ],
    "Beta-2 microglobulin amyloid retained by long-term dialysis",
    "Years of dialysis, carpal tunnel syndrome, shoulder arthropathy, and bone cysts with Congo-red-positive synovium are beta-2 microglobulin amyloid retained by long-term dialysis. The protein is not cleared by conventional membranes and deposits in osteoarticular tissue. AL amyloid from a plasma-cell light chain is incorrect because immunofixation is negative and free light chains are not elevated, and AL would more often add tongue, heart, and kidney disease. AA amyloid from serum amyloid A is incorrect because there is no chronic inflammatory driver and AA prefers the kidney over carpal tunnels. Wild-type transthyretin causing senile cardiac amyloid is incorrect because he has no restrictive cardiomyopathy and transthyretin is not the dialysis-related joint protein. Amyloid-beta peptide in cerebral vessels is incorrect because that peptide causes lobar brain hemorrhage, not bilateral carpal tunnel deposits in a dialysis patient.",
    "robbins-10",
)

add(
    "Wild-type transthyretin",
    5,
    "pathology",
    "An 82-year-old man has progressive heart failure, thick ventricular walls, and low-voltage QRS complexes. A technetium pyrophosphate scan shows strong myocardial uptake. Serum and urine immunofixation are negative and the free light-chain ratio is normal. He has no macroglossia, no periorbital purpura, no chronic infection, and no dialysis history. Carpal tunnel release was done five years ago. Which precursor protein fits isolated cardiac amyloid with a negative clone workup?",
    "Which precursor protein fits this heart?",
    [
        "Wild-type transthyretin amyloid of senile cardiac amyloidosis",
        "AL amyloid from immunoglobulin light chains",
        "AA amyloid from serum amyloid A",
        "Beta-2 microglobulin amyloid from dialysis",
        "Atrial natriuretic peptide as the cause of thick ventricular walls",
    ],
    "Wild-type transthyretin amyloid of senile cardiac amyloidosis",
    "An elderly patient, isolated thick-walled heart, pyrophosphate uptake, prior carpal tunnel, and a completely negative monoclonal-protein workup are wild-type transthyretin amyloid of senile cardiac amyloidosis. The precursor is transthyretin from the liver, not a light chain. AL amyloid from immunoglobulin light chains is incorrect because AL requires a plasma-cell clone or an abnormal free light-chain ratio and often adds macroglossia and periorbital purpura, all absent here. AA amyloid from serum amyloid A is incorrect because AA follows chronic inflammation and deposits in the kidney rather than as isolated senile cardiac disease. Beta-2 microglobulin amyloid from dialysis is incorrect because he has never been dialyzed and beta-2 microglobulin does not produce this pyrophosphate-positive ventricular picture. Atrial natriuretic peptide as the cause of thick ventricular walls is incorrect because atrial natriuretic peptide amyloid is a minor atrial deposit of aging and does not thicken the ventricles or light up a pyrophosphate scan this way.",
    "robbins-10",
)

add(
    "Cerebral amyloid angiopathy",
    5,
    "pathology",
    "A 78-year-old woman with mild memory loss has a second lobar hemorrhage, this time in the parietal cortex, and MRI shows many cortical microbleeds. She has no history of hypertension. The basal ganglia, thalamus, and pons are spared. Vessels in the cortex stain with Congo red. There is no plasma-cell clone, no dialysis, and no systemic nephrotic syndrome. A student calls every intracerebral bleed hypertensive lipohyalinosis. Which protein fits these lobar bleeds?",
    "Which protein fits these lobar bleeds?",
    [
        "Amyloid-beta peptide in cerebral amyloid angiopathy",
        "Hypertensive lipohyalinosis with deep Charcot-Bouchard bleeds",
        "AL amyloid from systemic light chains",
        "AA amyloid from chronic inflammation",
        "Beta-2 microglobulin from long-term dialysis",
    ],
    "Amyloid-beta peptide in cerebral amyloid angiopathy",
    "Recurrent lobar and cortical hemorrhages with microbleeds at the gray-white junction in an older patient without hypertension are amyloid-beta peptide in cerebral amyloid angiopathy. The peptide comes from amyloid precursor protein and weakens superficial vessels. Location is the finding that changes the diagnosis away from deep hypertensive bleed. Hypertensive lipohyalinosis with deep Charcot-Bouchard bleeds is incorrect because those bleeds sit in the putamen, thalamus, pons, or cerebellum, and this patient's deep structures are spared while the cortex is involved. AL amyloid from systemic light chains is incorrect because there is no clone and no systemic tongue, heart, or kidney disease; brain vascular amyloid of this pattern is amyloid-beta, not light chain. AA amyloid from chronic inflammation is incorrect because AA is a renal and systemic protein of inflammation, not the cortical vessel protein of lobar hemorrhage. Beta-2 microglobulin from long-term dialysis is incorrect because she has no dialysis history and beta-2 microglobulin deposits in joints.",
    "robbins-10",
)

add(
    "Calcitonin amyloid",
    4,
    "pathology",
    "A 45-year-old woman has a thyroid mass, watery diarrhea, and a very high serum calcitonin. Pathology of the medulla shows sheets of cells in a stroma that stains with Congo red and is apple green under polarized light. RET mutation testing is pending. She has no plasma-cell clone, no rheumatoid arthritis, no dementia, and no diabetes-related islet sampling. Which precursor forms the amyloid inside this tumor?",
    "Which precursor forms this tumor amyloid?",
    [
        "Calcitonin-derived amyloid within medullary thyroid carcinoma",
        "AA amyloid from serum amyloid A",
        "AL amyloid from immunoglobulin light chains",
        "Islet amyloid polypeptide of type 2 diabetes",
        "Amyloid-beta peptide of Alzheimer disease",
    ],
    "Calcitonin-derived amyloid within medullary thyroid carcinoma",
    "A medullary thyroid carcinoma secretes calcitonin, and the same peptide deposits as amyloid in the tumor stroma. Calcitonin-derived amyloid within medullary thyroid carcinoma is the precursor that fits the high calcitonin, the diarrhea, and the Congo-red-positive medulla. AA amyloid from serum amyloid A is incorrect because AA requires chronic inflammation and deposits in viscera, not as the stromal protein of a calcitonin-producing thyroid tumor. AL amyloid from immunoglobulin light chains is incorrect because there is no plasma-cell clone and the anatomic site is the thyroid medulla. Islet amyloid polypeptide of type 2 diabetes is incorrect because that peptide, also called amylin, deposits in pancreatic islets of type 2 diabetes, not in a thyroid medullary mass. Amyloid-beta peptide of Alzheimer disease is incorrect because amyloid-beta forms cortical plaques and cerebral vascular amyloid, not thyroid stroma.",
    "robbins-10",
)

add(
    "Polyarteritis nodosa vessel size",
    5,
    "pathology",
    "A 42-year-old man with hepatitis B surface antigen has mononeuritis multiplex, postprandial abdominal pain, testicular pain, and new hypertension. Renal arteriography shows microaneurysms. The urine sediment is bland, with no red-cell casts. ANCA is negative, and the chest is clear. A student calls this microscopic polyangiitis because the kidney is involved. Which classification fits a medium-vessel disease that spares capillaries and glomeruli?",
    "Which classification fits this vasculitis?",
    [
        "Medium-vessel polyarteritis nodosa that is ANCA negative and spares glomeruli",
        "Small-vessel microscopic polyangiitis with myeloperoxidase ANCA",
        "Granulomatosis with polyangiitis and proteinase-3 ANCA",
        "IgA vasculitis with mesangial IgA after a respiratory infection",
        "Large-vessel giant-cell arteritis with jaw claudication",
    ],
    "Medium-vessel polyarteritis nodosa that is ANCA negative and spares glomeruli",
    "Hepatitis B, mononeuritis, mesenteric ischemia, testicular pain, renal microaneurysms, a bland sediment, and negative ANCA are medium-vessel polyarteritis nodosa that is ANCA negative and spares glomeruli. The absence of glomerulonephritis is the finding that keeps the vessel size at muscular arteries rather than moving it to small-vessel ANCA disease. Small-vessel microscopic polyangiitis with myeloperoxidase ANCA is incorrect because microscopic polyangiitis causes pauci-immune glomerulonephritis and often pulmonary capillaritis and is ANCA positive; a bland sediment and negative ANCA exclude it. Granulomatosis with polyangiitis and proteinase-3 ANCA is incorrect because that disease destroys the upper airway, cavitates the lung, and produces glomerulonephritis with PR3-ANCA. IgA vasculitis with mesangial IgA after a respiratory infection is incorrect because IgA vasculitis is a small-vessel purpura of children with IgA in the mesangium, not visceral microaneurysms. Large-vessel giant-cell arteritis with jaw claudication is incorrect because giant-cell arteritis is a cranial and aortic disease of older adults, not hepatitis B microaneurysms.",
    "robbins-10",
)

add(
    "Glomerulonephritis changes vessel size to microscopic polyangiitis",
    5,
    "pathology",
    "A 50-year-old woman has fever, mononeuritis, and abdominal pain. Unlike a medium-vessel picture, the urine now shows red-cell casts and a biopsy shows pauci-immune crescentic glomerulonephritis. She also has pulmonary hemorrhage. ANCA is positive in a perinuclear pattern with myeloperoxidase specificity. There are no granulomas, no asthma, no eosinophilia, and no hepatitis B microaneurysms. Which single set of findings moves this from medium-vessel arteritis to a small-vessel ANCA vasculitis?",
    "Which diagnosis fits the glomerulonephritis and ANCA?",
    [
        "Small-vessel microscopic polyangiitis that is myeloperoxidase ANCA positive",
        "Medium-vessel polyarteritis nodosa that spares glomeruli and is ANCA negative",
        "Granulomatosis with polyangiitis and proteinase-3 granulomatous sinus disease",
        "Eosinophilic granulomatosis with polyangiitis and adult-onset asthma",
        "IgA vasculitis with immune-complex mesangial deposits",
    ],
    "Small-vessel microscopic polyangiitis that is myeloperoxidase ANCA positive",
    "Pulmonary capillaritis plus pauci-immune glomerulonephritis means vessels smaller than muscular arteries are involved, and myeloperoxidase ANCA without granulomas is small-vessel microscopic polyangiitis that is myeloperoxidase ANCA positive. The red-cell casts are the finding that changes vessel size and brings ANCA into the classification. Medium-vessel polyarteritis nodosa that spares glomeruli and is ANCA negative is incorrect because polyarteritis nodosa does not cause glomerulonephritis or pulmonary capillaritis and is ANCA negative. Granulomatosis with polyangiitis and proteinase-3 granulomatous sinus disease is incorrect because that disease is PR3/c-ANCA and granulomatous in the airway, and this patient has MPO, no granulomas, and no destructive sinusitis. Eosinophilic granulomatosis with polyangiitis and adult-onset asthma is incorrect because that small-vessel disease requires asthma and eosinophils, which are absent. IgA vasculitis with immune-complex mesangial deposits is incorrect because the glomeruli here are pauci-immune, not IgA immune-complex deposits, and ANCA is positive.",
    "robbins-10",
)

add(
    "Proteinase-3 changes the ANCA vasculitis",
    4,
    "pathology",
    "A 47-year-old man has chronic sinusitis, a saddle-nose deformity, cavitary lung nodules, and red-cell casts. Biopsy shows necrotizing granulomatous vasculitis. ANCA is cytoplasmic with proteinase-3 specificity. He has no asthma and the eosinophil count is normal. There is no hepatitis B and the chest is not merely asthmatic. Which diagnosis does the granulomatous upper-airway disease plus proteinase-3 ANCA establish?",
    "Which diagnosis fits these findings?",
    [
        "Small-vessel granulomatosis with polyangiitis and proteinase-3 ANCA",
        "Microscopic polyangiitis with myeloperoxidase and no granulomas",
        "Eosinophilic granulomatosis with polyangiitis and asthma",
        "Polyarteritis nodosa of medium vessels without glomerulonephritis",
        "Anti-GBM disease with linear immunofluorescence and no sinus destruction",
    ],
    "Small-vessel granulomatosis with polyangiitis and proteinase-3 ANCA",
    "Destructive sinus disease, cavitary lung lesions, pauci-immune glomerulonephritis, granulomas, and PR3/c-ANCA are small-vessel granulomatosis with polyangiitis and proteinase-3 ANCA. The proteinase-3 pattern and the granulomas are the findings that separate it from the other ANCA vasculitis. Microscopic polyangiitis with myeloperoxidase and no granulomas is incorrect because microscopic polyangiitis is MPO, has no granulomas, and does not destroy the nasal cartilage. Eosinophilic granulomatosis with polyangiitis and asthma is incorrect because that disease is built on asthma and eosinophils, which are absent, and it is usually MPO rather than PR3. Polyarteritis nodosa of medium vessels without glomerulonephritis is incorrect because red-cell casts mean glomerulonephritis, which polyarteritis nodosa does not cause, and polyarteritis nodosa is ANCA negative. Anti-GBM disease with linear immunofluorescence and no sinus destruction is incorrect because anti-GBM disease is a linear antibody against basement membrane, not a granulomatous PR3 vasculitis of the sinuses.",
    "robbins-10",
)

add(
    "Eosinophils and asthma change the ANCA vasculitis",
    4,
    "pathology",
    "A 41-year-old woman develops adult-onset asthma, then mononeuritis multiplex, palpable purpura, and migratory pulmonary infiltrates. The eosinophil count is 4,200 per microliter. ANCA is perinuclear with myeloperoxidase specificity. There is no saddle-nose deformity and no cavitary destruction. Biopsy shows eosinophil-rich granulomatous vasculitis of small vessels. Which diagnosis do the asthma and eosinophils establish?",
    "Which diagnosis fits this vasculitis?",
    [
        "Eosinophilic granulomatosis with polyangiitis, a small-vessel MPO disease",
        "Granulomatosis with polyangiitis and proteinase-3 sinus destruction",
        "Microscopic polyangiitis without asthma or eosinophils",
        "Polyarteritis nodosa with visceral microaneurysms and negative ANCA",
        "Allergic bronchopulmonary aspergillosis without vasculitis",
    ],
    "Eosinophilic granulomatosis with polyangiitis, a small-vessel MPO disease",
    "New asthma, high eosinophils, neuropathy, purpura, and MPO-ANCA with eosinophilic granulomas are eosinophilic granulomatosis with polyangiitis, a small-vessel MPO disease. The asthma and eosinophil count are the findings that move the diagnosis away from the other ANCA vasculitides. Granulomatosis with polyangiitis and proteinase-3 sinus destruction is incorrect because that disease is PR3-ANCA with a saddle nose and cavities, not asthma and eosinophilia. Microscopic polyangiitis without asthma or eosinophils is incorrect because microscopic polyangiitis lacks granulomas, asthma, and this eosinophil surge even though it shares MPO-ANCA. Polyarteritis nodosa with visceral microaneurysms and negative ANCA is incorrect because polyarteritis nodosa is a medium-vessel ANCA-negative disease and does not cause this small-vessel purpura with eosinophils. Allergic bronchopulmonary aspergillosis without vasculitis is incorrect because that hypersensitivity causes central bronchiectasis and IgE to Aspergillus without ANCA, mononeuritis, or vasculitis on biopsy.",
    "robbins-10",
)

add(
    "IgA vasculitis is ANCA negative",
    4,
    "pathology",
    "A 6-year-old boy develops palpable purpura on the legs and buttocks two days after a viral upper respiratory infection, plus colicky abdominal pain, arthralgia, and hematuria. Biopsy shows leukocytoclastic vasculitis with IgA deposits, and mesangial IgA is present in the glomerulus. ANCA is negative and complement is normal. A student calls this granulomatosis with polyangiitis because there is vasculitis and renal disease. Which finding keeps this a small-vessel immune-complex disease rather than an ANCA vasculitis?",
    "Which diagnosis fits these findings?",
    [
        "Small-vessel IgA vasculitis that is ANCA negative",
        "Granulomatosis with polyangiitis and proteinase-3 ANCA",
        "Microscopic polyangiitis with pauci-immune crescents and MPO-ANCA",
        "Medium-vessel polyarteritis nodosa with renal microaneurysms",
        "Systemic lupus with low complement and anti-dsDNA antibody",
    ],
    "Small-vessel IgA vasculitis that is ANCA negative",
    "Palpable purpura on the buttocks and legs, abdominal pain, arthralgia, and IgA in vessels and mesangium after a viral illness are small-vessel IgA vasculitis that is ANCA negative. Negative ANCA is the finding that keeps it an immune-complex small-vessel disease; a positive c-ANCA would have moved the diagnosis toward granulomatosis with polyangiitis. Granulomatosis with polyangiitis and proteinase-3 ANCA is incorrect because that disease is ANCA positive, granulomatous, and pauci-immune, not IgA positive with normal complement in a child. Microscopic polyangiitis with pauci-immune crescents and MPO-ANCA is incorrect because the deposits here are IgA and ANCA is negative. Medium-vessel polyarteritis nodosa with renal microaneurysms is incorrect because polyarteritis nodosa does not cause palpable purpura from capillaries or mesangial IgA. Systemic lupus with low complement and anti-dsDNA antibody is incorrect because complement is normal and the immune deposit is IgA, not the full-house immune-complex nephritis of lupus.",
    "robbins-10",
)

add(
    "Giant-cell arteritis is large vessel",
    5,
    "pathology",
    "A 76-year-old woman has a new temporal headache, jaw claudication, scalp tenderness, and one episode of amaurosis fugax. ESR is 120 mm/h. She also has polymyalgia symptoms. ANCA is negative and the urine has no casts. Temporal-artery biopsy shows granulomatous inflammation with giant cells and a fragmented internal elastic lamina. A student calls this medium-vessel vasculitis because the temporal artery is a muscular artery on histology slides. Which classification fits, and why does vision loss not make it a small-vessel capillaritis?",
    "Which classification fits this arteritis?",
    [
        "Large-vessel giant-cell arteritis of the aorta and its major branches",
        "Medium-vessel polyarteritis nodosa with visceral microaneurysms",
        "Small-vessel granulomatosis with polyangiitis and PR3-ANCA",
        "Takayasu arteritis in a patient younger than 40 years",
        "Microscopic polyangiitis with pulmonary capillaritis and glomerulonephritis",
    ],
    "Large-vessel giant-cell arteritis of the aorta and its major branches",
    "Age over 50, jaw claudication, scalp tenderness, a very high ESR, polymyalgia, and granulomatous temporal arteritis are large-vessel giant-cell arteritis of the aorta and its major branches. The temporal artery is biopsied because it is a branch of the external carotid, but the disease is classified with the large vessels. Vision loss is ischemic optic neuropathy from posterior ciliary branches, not pulmonary or glomerular capillaritis, and the bland urine plus negative ANCA keep it out of the small-vessel group. Medium-vessel polyarteritis nodosa with visceral microaneurysms is incorrect because polyarteritis nodosa is ANCA-negative fibrinoid necrosis of visceral muscular arteries with microaneurysms, not granulomatous cranial disease in a 76-year-old. Small-vessel granulomatosis with polyangiitis and PR3-ANCA is incorrect because there is no sinus destruction, no glomerulonephritis, and no PR3-ANCA. Takayasu arteritis in a patient younger than 40 years is the other large-vessel granulomatous arteritis, but it affects young patients and the aortic arch branches, not this age and cranial pattern. Microscopic polyangiitis with pulmonary capillaritis and glomerulonephritis is incorrect because that disease needs small-vessel lung and kidney injury and MPO-ANCA, which are absent.",
    "robbins-10",
)

add(
    "Coronary aneurysm changes vessel size to Kawasaki",
    4,
    "pathology",
    "A 3-year-old boy has had fever for six days, nonexudative conjunctivitis, a strawberry tongue, cracked lips, a polymorphous rash, and swollen hands. Echocardiography shows a coronary artery aneurysm. ANCA is negative. There is no buttock purpura, no abdominal colic as the main feature, and no mesangial IgA. A student calls every febrile vasculitic rash in a child IgA vasculitis. Which finding changes the vessel class to medium vessel?",
    "Which diagnosis fits this child?",
    [
        "Medium-vessel Kawasaki disease with coronary artery aneurysms",
        "Small-vessel IgA vasculitis with buttock purpura and nephritis",
        "Granulomatosis with polyangiitis and proteinase-3 ANCA",
        "Polyarteritis nodosa in the adult hepatitis B pattern",
        "Acute rheumatic fever with migratory arthritis and valvulitis",
    ],
    "Medium-vessel Kawasaki disease with coronary artery aneurysms",
    "Five days or more of fever plus mucocutaneous signs and a coronary artery aneurysm are medium-vessel Kawasaki disease with coronary artery aneurysms. The coronary aneurysm is the finding that places the disease in medium vessels and separates it from small-vessel purpura. Small-vessel IgA vasculitis with buttock purpura and nephritis is incorrect because IgA vasculitis does not form coronary aneurysms and this child has no IgA-dominant buttock purpura. Granulomatosis with polyangiitis and proteinase-3 ANCA is incorrect because ANCA is negative and there is no respiratory granulomatous disease. Polyarteritis nodosa in the adult hepatitis B pattern is incorrect because that disease is visceral microaneurysms in adults, not this mucocutaneous febrile syndrome of early childhood. Acute rheumatic fever with migratory arthritis and valvulitis is incorrect because rheumatic fever inflames valves after streptococcal pharyngitis and does not produce coronary aneurysms or this conjunctival and oral pattern.",
    "robbins-10",
)

add(
    "Cryoglobulinemic vasculitis versus polyarteritis",
    4,
    "pathology",
    "A 52-year-old woman with hepatitis C has palpable purpura, arthralgia, weakness, a positive rheumatoid factor, and a low C4. Cryoglobulins are present. Kidney biopsy shows membranoproliferative glomerulonephritis. ANCA is negative and hepatitis B surface antigen is negative. A student calls this polyarteritis nodosa because a hepatitis virus is involved. Which virus and which complement pattern make this small-vessel immune-complex disease instead?",
    "Which diagnosis fits this purpura?",
    [
        "Small-vessel mixed cryoglobulinemic vasculitis from hepatitis C",
        "Medium-vessel polyarteritis nodosa associated with hepatitis B",
        "Microscopic polyangiitis with myeloperoxidase ANCA",
        "IgA vasculitis with normal complement in a child",
        "Granulomatosis with polyangiitis and cavitary lung disease",
    ],
    "Small-vessel mixed cryoglobulinemic vasculitis from hepatitis C",
    "Hepatitis C, palpable purpura, rheumatoid factor, low C4, circulating cryoglobulins, and membranoproliferative glomerulonephritis are small-vessel mixed cryoglobulinemic vasculitis from hepatitis C. The low complement and the glomerulonephritis are the findings that move the disease off medium-vessel arteritis and onto an immune-complex small-vessel vasculitis. Medium-vessel polyarteritis nodosa associated with hepatitis B is incorrect because polyarteritis nodosa tracks hepatitis B, spares glomeruli, keeps complement normal, and does not produce cryoglobulinemic purpura. Microscopic polyangiitis with myeloperoxidase ANCA is incorrect because ANCA is negative and the renal lesion is immune-complex membranoproliferative disease, not pauci-immune capillaritis. IgA vasculitis with normal complement in a child is incorrect because complement is low, the patient is an adult with hepatitis C, and the deposit is cryoglobulin rather than IgA. Granulomatosis with polyangiitis and cavitary lung disease is incorrect because there are no granulomas, no PR3-ANCA, and no destructive airway disease.",
    "robbins-10",
)

add(
    "Classical pathway in lupus",
    4,
    "pathology",
    "A 29-year-old woman with a malar rash has a flare of arthritis, a rising anti-dsDNA titer, and a new active urine sediment with red-cell casts and rising creatinine. C3 is low and C4 is low. CH50 is low. She has no cola-colored urine ten days after pharyngitis and no subepithelial humps. A student says any low C3 means the alternative pathway alone. Which pathway do the paired low C4 and low C3 indicate?",
    "Which pathway do these complement levels indicate?",
    [
        "Classical pathway consumption because both C4 and C3 are low",
        "Alternative pathway only, which consumes C3 and spares C4",
        "Isolated terminal-complement deficiency with a normal C4",
        "Lectin pathway alone as the cause of an anti-dsDNA flare",
        "C1-inhibitor deficiency with bradykinin angioedema",
    ],
    "Classical pathway consumption because both C4 and C3 are low",
    "Immune complexes in lupus bind C1 and pull the classical pathway through C4 and C2 into C3. Classical pathway consumption because both C4 and C3 are low is the reading of this flare, and it matches the rising anti-dsDNA and active sediment. Alternative pathway only, which consumes C3 and spares C4, is incorrect because a spared C4 is the poststreptococcal and C3-nephritic-factor pattern; C4 is low here, so the classical limb is in use. Isolated terminal-complement deficiency with a normal C4 is incorrect because a genetic MAC defect does not fluctuate with anti-dsDNA, and C4 would not fall in isolation as an acute flare marker. Lectin pathway alone as the cause of an anti-dsDNA flare is incorrect because the trigger is immune complex, which engages C1 of the classical pathway; mannose-binding lectin is not the driver of lupus nephritis. C1-inhibitor deficiency with bradykinin angioedema is incorrect because that disease lowers C4 chronically but keeps C3 normal and causes swelling without urticaria, not an anti-dsDNA nephritic flare.",
    "robbins-10",
)

add(
    "Alternative pathway in poststreptococcal glomerulonephritis",
    5,
    "pathology",
    "A 9-year-old boy has cola-colored urine, hypertension, and periorbital edema ten days after documented group A pharyngitis. ASO titer is high. C3 is low and C4 is normal. Biopsy shows subepithelial humps. Anti-dsDNA is negative and there is no malar rash. A student applies the lupus rule and says both C3 and C4 must be low for any glomerulonephritis. Which pathway do a low C3 and a normal C4 indicate?",
    "Which pathway do these levels indicate?",
    [
        "Alternative pathway activation with C3 consumption and spared C4",
        "Classical pathway consumption with a required fall in C4",
        "Membranous nephropathy with normal complement and no humps",
        "Terminal MAC deficiency presenting as a single cola-colored urine",
        "C1-inhibitor deficiency with low C4 between attacks",
    ],
    "Alternative pathway activation with C3 consumption and spared C4",
    "Poststreptococcal glomerulonephritis activates the alternative pathway. C3 falls and C4, which is used by the classical and lectin paths but not by the alternative path, stays normal. Alternative pathway activation with C3 consumption and spared C4 fits the timing, the ASO titer, and the humps. Classical pathway consumption with a required fall in C4 is the lupus pattern and is incorrect here because C4 is normal and anti-dsDNA is negative. Membranous nephropathy with normal complement and no humps is incorrect because membranous disease usually keeps complement normal and shows subepithelial deposits without this acute low C3 after pharyngitis. Terminal MAC deficiency presenting as a single cola-colored urine is incorrect because MAC deficiency causes recurrent Neisseria, not hypocomplementemic glomerulonephritis with humps. C1-inhibitor deficiency with low C4 between attacks is incorrect because hereditary angioedema lowers C4 and spares C3, the opposite ratio, and does not cause cola urine.",
    "robbins-10",
)

add(
    "Hereditary angioedema pathway",
    5,
    "pathology",
    "A 22-year-old woman has had attacks of bowel pain and facial swelling since adolescence, never with hives or pruritus. Dental work triggers them. Her father had the same illness. C4 is low even between attacks, C3 is normal, C1-inhibitor function is low, and C1q is normal. Antihistamines and epinephrine did not stop the last abdominal attack. An ACE inhibitor was recently added and the attacks became more frequent. Which mediator and which diagnosis fit?",
    "Which diagnosis fits these complement results?",
    [
        "Hereditary angioedema from C1-inhibitor deficiency and bradykinin",
        "Type I anaphylaxis from histamine with urticaria and pruritus",
        "Acquired C1-inhibitor deficiency with a low C1q in lymphoma",
        "Isolated ACE-inhibitor angioedema with normal complement",
        "Allergic transfusion anaphylaxis from anti-IgA antibodies",
    ],
    "Hereditary angioedema from C1-inhibitor deficiency and bradykinin",
    "Low C4, normal C3, low C1-inhibitor function, normal C1q, a positive family history, and swelling without urticaria are hereditary angioedema from C1-inhibitor deficiency and bradykinin. Unchecked kallikrein makes bradykinin. Antihistamines fail because histamine is not the mediator, and an ACE inhibitor worsens attacks because it also raises bradykinin. Type I anaphylaxis from histamine with urticaria and pruritus is incorrect because anaphylaxis itches and forms hives and responds to epinephrine, none of which fits these lifelong attacks. Acquired C1-inhibitor deficiency with a low C1q in lymphoma is incorrect because acquired disease lowers C1q, occurs in older patients with lymphoproliferative disease, and has no childhood family history. Isolated ACE-inhibitor angioedema with normal complement is incorrect because complement would be normal and there would be no lifelong low C4 or low C1 inhibitor; the drug is a trigger on top of the hereditary disease. Allergic transfusion anaphylaxis from anti-IgA antibodies is incorrect because no blood product was given and IgA anaphylaxis is an immediate histamine event, not a bradykinin illness with a low C4.",
    "robbins-10",
)

add(
    "CH50 versus AH50",
    5,
    "pathology",
    "A 12-year-old girl has recurrent sinopulmonary infections with encapsulated bacteria and an SLE-like rash with a low-titer antinuclear antibody. CH50 is unmeasurable. AH50, the alternative-pathway hemolytic assay, is normal. C3 antigen measured separately is present. She has not had recurrent meningococcal sepsis as her only infection. Which missing component does a dead classical assay with a live alternative assay indicate?",
    "Which component group fits these assays?",
    [
        "An early classical component such as C2, because AH50 is preserved",
        "Terminal C6 deficiency, which drops both CH50 and AH50",
        "Properdin deficiency, which drops AH50 and spares CH50",
        "C3 deficiency, which drops both CH50 and AH50",
        "Mannose-binding lectin deficiency, which zeroes AH50",
    ],
    "An early classical component such as C2, because AH50 is preserved",
    "CH50 needs every classical component from C1 through C9. AH50 needs factors B and D, properdin, C3, and C5 through C9, but not C1, C4, or C2. A dead CH50 with a normal AH50 is an early classical component such as C2, because AH50 is preserved. C2 deficiency is the most common hereditary complement deficiency and causes both pyogenic infection and an SLE-like illness. Terminal C6 deficiency, which drops both CH50 and AH50, is incorrect because the MAC is shared by both assays, so AH50 would also be zero, and the signature infection would be Neisseria. Properdin deficiency, which drops AH50 and spares CH50, is the opposite pattern and is an alternative-pathway defect. C3 deficiency, which drops both CH50 and AH50, is incorrect because C3 is required for both hemolytic assays and the stem says C3 antigen is present and AH50 is normal. Mannose-binding lectin deficiency, which zeroes AH50, is incorrect because neither CH50 nor AH50 requires mannose-binding lectin, so lectin deficiency does not zero those assays.",
    "robbins-10",
)

add(
    "Eculizumab and terminal complement",
    4,
    "pathology",
    "A 31-year-old man has morning dark urine, unusual venous thromboses, and a Coombs-negative intravascular hemolysis. Flow cytometry shows CD55 and CD59 absent from his red cells and white cells. He is started on eculizumab, a monoclonal antibody against C5, which stops the hemolysis. A student chooses Pneumocystis prophylaxis as the infection plan because a biologic was started. Which infection risk does C5 blockade create, and why?",
    "Which infection risk does this mechanism create?",
    [
        "Neisseria meningitidis because C5 blockade mimics terminal complement loss",
        "Pneumocystis jirovecii because eculizumab depletes CD4 T cells",
        "Aspergillus fumigatus because eculizumab blocks the oxidative burst",
        "Mycobacterium avium because eculizumab blocks interferon-gamma",
        "Chronic mucocutaneous candidiasis because eculizumab blocks Th17",
    ],
    "Neisseria meningitidis because C5 blockade mimics terminal complement loss",
    "Paroxysmal nocturnal hemoglobinuria loses CD55 and CD59, so the membrane attack complex lyses red cells. Eculizumab stops C5 cleavage and therefore stops MAC formation. Neisseria meningitidis because C5 blockade mimics terminal complement loss is the risk, and meningococcal vaccination is required. Pneumocystis jirovecii because eculizumab depletes CD4 T cells is incorrect because the drug does not remove T cells; Pneumocystis is a T-cell opportunistic infection. Aspergillus fumigatus because eculizumab blocks the oxidative burst is incorrect because NADPH oxidase is intact and Aspergillus is a phagocyte problem. Mycobacterium avium because eculizumab blocks interferon-gamma is incorrect because the interleukin-12 interferon-gamma axis is untouched. Chronic mucocutaneous candidiasis because eculizumab blocks Th17 is incorrect because Th17 and mucosal Candida defense do not depend on C5.",
    "robbins-10",
)

assert len(ITEMS) == 62, len(ITEMS)
assert sum(item["difficulty"] == 5 for item in ITEMS) >= 20

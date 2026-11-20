"""Step 1 multisystem items."""

ITEMS = []


def add(topic, diff, subject, scenario, question, options, key, expl, ref="robbins-10"):
    assert key in options and len(set(options)) == 5
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
    "Distributive versus cardiogenic shock",
    5,
    "pathology",
    "A 64-year-old man with a urinary-source fever has a blood pressure of 78/40 mm Hg after fluids. Cardiac output is high, systemic vascular resistance is low, and the skin is warm. A second patient after a large anterior myocardial infarction is cold, with low cardiac output and high systemic vascular resistance. Both have lactate elevation.",
    "Which profile is the septic patient, and why does warm skin matter?",
    [
        "High output and low resistance is vasodilation from sepsis; cold low-output high-resistance shock is cardiogenic pump failure",
        "Both profiles are hypovolemia, and skin temperature does not matter",
        "Low resistance means tamponade because the heart cannot fill",
        "High cardiac output excludes shock even if the pressure is 78 mm Hg",
        "Cardiogenic shock has low resistance because the heart releases nitric oxide",
    ],
    "High output and low resistance is vasodilation from sepsis; cold low-output high-resistance shock is cardiogenic pump failure",
    "Septic shock is distributive: inflammatory mediators drop systemic vascular resistance, cardiac output is often high, and the skin is warm. Cardiogenic shock is a failed pump, so output is low, the body clamps down, resistance is high, and the skin is cold. Calling both hypovolemia misses the output and resistance split. Tamponade is obstructive, with low output and equalization of diastolic pressures, not low resistance with warm skin. A pressure of 78 mm Hg with lactate is shock even if output is high; the tissues are under-perfused because pressure, not just output, is inadequate. Cardiogenic vasoconstriction raises resistance; it does not lower it.",
    "robbins-10",
)

add(
    "Tamponade physiology",
    5,
    "pathology",
    "A man two weeks after a viral illness has hypotension, jugular venous distention, and muffled sounds. Pulsus paradoxus is present. Cath shows diastolic pressures equal in the right atrium, right ventricle, and left ventricle. A student calls it septic shock because he is febrile.",
    "What limits filling, and which shock numbers are the opposite of sepsis?",
    [
        "Fluid under pressure around the heart equalizes diastolic filling; output falls and resistance rises, unlike warm vasodilated sepsis",
        "A ruptured valve causes a wide pulse pressure and a new diastolic murmur as the main finding",
        "Sepsis and tamponade share high cardiac output, so antibiotics are the only next step",
        "Pulsus paradoxus means the systolic pressure rises on inspiration",
        "Equal diastolic pressures are the definition of hypertrophic cardiomyopathy",
    ],
    "Fluid under pressure around the heart equalizes diastolic filling; output falls and resistance rises, unlike warm vasodilated sepsis",
    "Tamponade, often from pericarditis or bleeding, stops the heart from filling. Diastolic pressures equalize, stroke volume falls, and the body vasoconstricts, so this is obstructive shock with low output and high resistance. Sepsis is the opposite resistance pattern and is warm. A ruptured valve gives a loud murmur and a different pressure tracing, not equalization and muffled sounds. Antibiotics do not drain the pericardium. Pulsus paradoxus is an exaggerated drop in systolic pressure on inspiration. Hypertrophic cardiomyopathy is dynamic outflow obstruction, not equal diastolic pressures.",
    "robbins-10",
)

add(
    "Anaphylaxis versus vaso-vagal",
    5,
    "pharmacology",
    "Minutes after a peanut exposure a teenager has hives, wheezing, vomiting, and a blood pressure of 80/40 mm Hg. A classmate who fainted at the sight of blood is pale, bradycardic, and has no rash or wheeze, and he wakes as soon as he is flat. The nurse reaches for diphenhydramine first for the teenager.",
    "What is the first drug for the teenager, and why is the fainting friend different?",
    [
        "Intramuscular epinephrine for IgE-mediated anaphylaxis; the friend has a vasovagal reflex with bradycardia and no allergic findings, so epinephrine is not his treatment",
        "Diphenhydramine first, because histamine block reverses shock",
        "A glucocorticoid first, because it acts in minutes on the airway",
        "Epinephrine for both, because any loss of consciousness is anaphylaxis",
        "Atropine for the teenager because anaphylaxis causes bradycardia as the first sign",
    ],
    "Intramuscular epinephrine for IgE-mediated anaphylaxis; the friend has a vasovagal reflex with bradycardia and no allergic findings, so epinephrine is not his treatment",
    "Anaphylaxis is IgE-triggered mast-cell release with airway and shock. Intramuscular epinephrine is first because it supports pressure and opens the airway; antihistamines and steroids are adjuncts and do not treat the shock. A vasovagal faint is bradycardia and pallor without urticaria or wheeze and resolves when supine. Diphenhydramine does not restore circulation. Steroids act over hours, not minutes. Epinephrine for a simple faint is the wrong drug and the wrong diagnosis. Anaphylactic shock is typically tachycardic, not a primary atropine problem.",
    "katzung-16",
)

add(
    "Type I versus type III hypersensitivity",
    4,
    "pathology",
    "Patient A wheezes and gets hives within minutes of penicillin. Patient B, ten days into a drug for a long infection, has fever, joint pain, and a falling complement with a rash, and the symptoms began long after the first dose. A student calls both immediate allergy and stops at antihistamines for both.",
    "Which immune mechanisms fit?",
    [
        "A is IgE on mast cells; B is immune-complex disease with complement consumption, days to weeks after antigen",
        "Both are IgE, and complement falls in classic anaphylaxis as the rule",
        "B is delayed T-cell contact dermatitis, which consumes complement",
        "A is cytotoxic IgG against red cells because it happened fast",
        "Serum sickness is a type II disease of a single cell surface",
    ],
    "A is IgE on mast cells; B is immune-complex disease with complement consumption, days to weeks after antigen",
    "Type I is immediate: IgE cross-linking, histamine, minutes. Type III is immune complexes depositing in joints, skin, and vessels, consuming complement, typically a week or more into exposure. Antihistamines do not treat serum sickness. Anaphylaxis does not present as a complement-consuming arthritis ten days later. Contact dermatitis is type IV, T-cell, and does not drop complement this way. Fast hemolysis is type II but is not hives and wheeze. Serum sickness is not a single-cell type II target.",
    "robbins-10",
)

add(
    "Type IV contact versus PPD",
    4,
    "pathology",
    "A nurse develops an itchy rash only where nickel touches the skin, peaking two days later. A different patient has a firm red nodule two days after a tuberculosis skin test. Neither had symptoms in the first hour. A student labels both as IgE because they are skin findings.",
    "What cell mediates both, and why is the timing the clue?",
    [
        "Previously sensitized T cells activate macrophages over one to two days; there is no immediate mast-cell phase",
        "IgE, because all rashes are type I",
        "Immune complexes, because complement is required for a PPD",
        "IgG against keratinocytes, a type II blister in the first minutes",
        "Neutrophils only, with no memory, which is why it recurs at the same site",
    ],
    "Previously sensitized T cells activate macrophages over one to two days; there is no immediate mast-cell phase",
    "Contact dermatitis and the tuberculin reaction are type IV. Memory T cells see antigen and recruit macrophages; the reaction is delayed, not present in the first minutes. IgE reactions are immediate. A PPD is not an immune-complex complement event. Type II keratinocyte attack is pemphigus-family disease, not a nickel rash at 48 hours. The recurrence at a known site is memory, which neutrophils alone do not provide.",
    "robbins-10",
)

add(
    "Acute hemolytic transfusion",
    5,
    "pathology",
    "Minutes into a red-cell transfusion a patient has fever, back pain, dark urine, and oozing from the IV site. The direct antiglobulin test is positive and hemoglobinuria is present. A clerical check shows the unit was labeled for another patient. A nurse suggests slowing the rate and continuing because fever during transfusion is common.",
    "What is lysing the cells, and why is continuing the unit wrong?",
    [
        "Preformed ABO IgM fixes complement and lyses donor cells intravascularly; the unit is stopped because this is hemolysis, not a trivial cytokine fever",
        "The reaction is allergic urticaria, so slowing the rate is enough",
        "TRALI is the cause whenever urine turns dark",
        "IgA deficiency causes this back pain and hemoglobinuria",
        "A febrile nonhemolytic reaction drops haptoglobin and causes oozing",
    ],
    "Preformed ABO IgM fixes complement and lyses donor cells intravascularly; the unit is stopped because this is hemolysis, not a trivial cytokine fever",
    "ABO incompatibility is type II intravascular hemolysis from complement-fixing IgM. Fever, flank pain, hemoglobinuria, and coagulopathy mean the transfusion stops immediately and the identity is rechecked. A simple allergic reaction is hives without dark urine. TRALI is noncardiogenic pulmonary edema, not hemoglobinuria. IgA deficiency causes anaphylaxis when IgA in plasma is given, not this hemolytic picture. A febrile nonhemolytic reaction is cytokine-mediated, the Coombs test stays negative, and it does not lyse cells or start DIC.",
    "robbins-10",
)

add(
    "TRALI versus TACO",
    5,
    "pathology",
    "An hour after plasma, a patient is hypoxic with bilateral infiltrates and a normal heart size. Blood pressure is not high and he was not volume overloaded before the unit. A second patient, known to have heart failure, gets several units and develops hypoxia, hypertension, and an elevated BNP.",
    "Which is antibody-mediated lung injury, and which is overload?",
    [
        "The first is TRALI from donor antibodies activating recipient neutrophils; the second is circulatory overload",
        "Both are ABO hemolysis because hypoxia followed a transfusion",
        "The first is cardiogenic because any post-transfusion infiltrate is the heart",
        "The second is TRALI because heart-failure patients cannot get fluid overload",
        "Diuretics are first-line for TRALI and harmful in overload",
    ],
    "The first is TRALI from donor antibodies activating recipient neutrophils; the second is circulatory overload",
    "TRALI is noncardiogenic edema during or soon after transfusion, often from donor anti-HLA or anti-neutrophil antibodies. The heart is not the problem, pressures are not those of failure, and diuretics are not the treatment. TACO is too much volume for a weak heart: hypertension, high BNP, and a response to diuretics. Hypoxia alone is not hemolysis. Calling every infiltrate cardiogenic misses a normal heart size and normal filling story. Heart-failure patients are exactly who overload. Diuretics help overload and do not fix capillary leak from TRALI.",
    "robbins-10",
)

add(
    "Carbon monoxide versus cyanide",
    5,
    "pharmacology",
    "Patient A was in a house fire, has a headache, a normal pulse oximeter reading, and cherry-red skin; the calculated oxygen saturation from a co-oximeter is low. Patient B, pulled from the same fire, has a profound lactic acidosis, a bitter-almond odor, and a normal arterial oxygen tension. His venous blood looks arterial.",
    "Which toxin binds hemoglobin, and which blocks cytochrome oxidase?",
    [
        "A is carbon monoxide, which binds hemoglobin and shifts the remaining curve left; B is cyanide, which stops aerobic respiration so oxygen is not used",
        "Both are cyanide, and the pulse oximeter reliably shows the oxygen deficit",
        "A is methemoglobin because the skin is red",
        "B should receive methylene blue as the specific antidote",
        "Carbon monoxide lowers dissolved arterial oxygen tension, which is why the ABG PaO2 falls",
    ],
    "A is carbon monoxide, which binds hemoglobin and shifts the remaining curve left; B is cyanide, which stops aerobic respiration so oxygen is not used",
    "Carbon monoxide binds hemoglobin with high affinity and makes standard pulse oximetry look falsely normal; co-oximetry shows the gap, and the remaining hemoglobin holds oxygen too tightly. Cyanide poisons complex IV, cells cannot use oxygen, lactate rises, and venous blood stays oxygenated. A pulse oximeter does not detect carbon monoxide. Cherry skin is not methemoglobin; methemoglobin is chocolate-brown and cyanotic. Methylene blue treats methemoglobin, not cyanide; cyanide is treated with hydroxocobalamin. Dissolved PaO2 stays normal in carbon monoxide poisoning because that number is not hemoglobin-bound oxygen.",
    "katzung-16",
)

add(
    "Methemoglobinemia",
    4,
    "pharmacology",
    "A man who took a topical anesthetic for a procedure is cyanotic and chocolate-brown blood is drawn. Arterial oxygen tension is normal and the pulse oximeter sits near 85 percent and does not rise with oxygen. He is not short of breath from lung disease on exam.",
    "What is the pigment, and what is the antidote?",
    [
        "Iron is oxidized to Fe3+ and cannot bind oxygen; methylene blue reduces it back via NADPH-methemoglobin reductase",
        "This is carbon monoxide, treated with methylene blue",
        "Cyanide turns blood chocolate and is treated with oxygen alone",
        "Methylene blue is contraindicated and the treatment is pralidoxime",
        "A normal PaO2 rules out any hemoglobin problem",
    ],
    "Iron is oxidized to Fe3+ and cannot bind oxygen; methylene blue reduces it back via NADPH-methemoglobin reductase",
    "Methemoglobin is ferric heme. It does not carry oxygen and shifts the curve, so the patient is cyanotic with chocolate blood while dissolved PaO2 is normal. Methylene blue is the electron donor that lets the cell reduce the iron. Carbon monoxide is cherry-red, not chocolate, and is treated with oxygen, not methylene blue. Cyanide does not make chocolate blood and is not fixed by oxygen alone. Pralidoxime is for organophosphates. A normal PaO2 only says dissolved oxygen is fine; it says nothing about hemoglobin that cannot carry it.",
    "katzung-16",
)

add(
    "Acetaminophen toxicity",
    5,
    "pharmacology",
    "A woman took a large amount of acetaminophen 10 hours ago. She feels nauseated but the liver enzymes are only just rising. A level plots above the treatment line. A student wants to wait for fulminant failure before giving an antidote, and suggests N-acetylcysteine works by binding the parent drug in the stomach.",
    "What is the toxic metabolite, and how does the antidote work now?",
    [
        "NAPQI is normally glutathione-conjugated; N-acetylcysteine restores glutathione and can still help after absorption, so you do not wait for failure",
        "The parent drug is directly toxic to the liver and charcoal at 10 hours is the only antidote",
        "N-acetylcysteine is useless once the drug is absorbed",
        "Fomepizole blocks CYP2E1 as the first-line specific antidote",
        "Rising enzymes mean the injury is finished and glutathione no longer matters",
    ],
    "NAPQI is normally glutathione-conjugated; N-acetylcysteine restores glutathione and can still help after absorption, so you do not wait for failure",
    "CYP2E1 makes NAPQI. Glutathione detoxifies it; overdose exhausts glutathione and NAPQI binds hepatocyte proteins. N-acetylcysteine replenishes glutathione and is given based on the nomogram or a dangerous history, not after transplant-level failure. Charcoal only helps very early and does not replace the antidote at 10 hours. The antidote still works after absorption because it restores the cofactor, not because it binds drug in the gut. Fomepizole is for toxic alcohols. Early enzyme rise is the start of injury, which is why the antidote is given now.",
    "katzung-16",
)

add(
    "Salicylate mixed acid-base",
    5,
    "pharmacology",
    "A teenager after a large aspirin ingestion is tachypneic. Arterial pH is 7.48, PaCO2 is 18 mm Hg, and the anion gap is 22. A student sees the high pH and says there is no acidosis, so bicarbonate is unnecessary. He is getting sleepy.",
    "What two acid-base processes are present, and why does sleepiness change the plan?",
    [
        "A respiratory alkalosis from medullary stimulation plus an anion-gap metabolic acidosis; tiring means he may lose the respiratory compensation and needs urgent alkalinization and possibly dialysis",
        "A pure metabolic alkalosis, so ammonium chloride is the treatment",
        "A pure respiratory acidosis, because aspirin depresses ventilation first",
        "The anion gap is from methanol only, and fomepizole replaces bicarbonate",
        "Sleepiness is reassurance that the drug is wearing off",
    ],
    "A respiratory alkalosis from medullary stimulation plus an anion-gap metabolic acidosis; tiring means he may lose the respiratory compensation and needs urgent alkalinization and possibly dialysis",
    "Salicylate directly stimulates breathing, so CO2 falls and pH may look alkalemic, while uncoupling and acids open the anion gap. The alkalemia hides the metabolic acidosis if you only read pH. When he tires, ventilation falls, CO2 rises onto the existing acidosis, and pH crashes. Bicarbonate alkalinizes serum and urine to keep the drug ionized and out of the brain. Ammonium chloride would worsen acidosis. Early aspirin overdose hyperventilates; it does not start as CO2 retention. Fomepizole does not treat salicylate. Sleepiness is CNS toxicity, not recovery.",
    "katzung-16",
)

add(
    "Toxic alcohols",
    5,
    "pharmacology",
    "A man from a party where antifreeze was stored has drunken behavior without much ethanol on the breath, an osmolar gap, and later an anion-gap acidosis. Urine shows envelope crystals and calcium is low. A friend who drank windshield fluid is blind with the same gaps and no oxalate crystals.",
    "Which alcohol is which, and what blocks alcohol dehydrogenase for both?",
    [
        "Ethylene glycol makes oxalate crystals and hypocalcemia; methanol makes formic acid and blindness; fomepizole inhibits alcohol dehydrogenase for both",
        "Methanol causes oxalate crystals; ethylene glycol causes blindness",
        "Ethanol is the treatment because it speeds formation of the toxic acids",
        "Fomepizole induces alcohol dehydrogenase so the acids are cleared faster",
        "An osmolar gap without acidosis means the ingestion is over and no antidote is needed",
    ],
    "Ethylene glycol makes oxalate crystals and hypocalcemia; methanol makes formic acid and blindness; fomepizole inhibits alcohol dehydrogenase for both",
    "Both parent alcohols are osmotically active and not very acidic. Alcohol dehydrogenase makes the toxic acids: oxalic acid from ethylene glycol, which precipitates calcium oxalate and drops calcium, and formic acid from methanol, which injures the optic nerve. Fomepizole blocks that enzyme. Swapping the end-organs is the classic miss. Ethanol can compete for the enzyme but it does not speed safe clearance of the acids; it occupies the enzyme. Fomepizole inhibits, not induces. An early osmolar gap before the gap acidosis is exactly when you block the enzyme, not a reason to watch.",
    "katzung-16",
)

add(
    "Lead poisoning",
    4,
    "pharmacology",
    "A toddler in an old house has abdominal pain, constipation, a foot drop, and a microcytic anemia. The smear shows basophilic stippling. A lead level is high. A student wants deferoxamine because the anemia looks like iron overload, and another suggests dimercaprol in peanut oil without asking about allergy.",
    "Which enzyme step is blocked, and which chelators fit?",
    [
        "Lead inhibits ferrochelatase and ALA dehydratase; succimer is oral chelation for children and EDTA is used for more severe disease, while deferoxamine is the iron chelator",
        "Lead blocks globin synthesis only, so a chelator cannot help",
        "Deferoxamine is first-line for lead because both metals are divalent",
        "Basophilic stippling is specific for folate deficiency",
        "Wrist or foot drop means a central cord syrinx, not a neuropathy",
    ],
    "Lead inhibits ferrochelatase and ALA dehydratase; succimer is oral chelation for children and EDTA is used for more severe disease, while deferoxamine is the iron chelator",
    "Lead blocks heme synthesis at ALA dehydratase and ferrochelatase, so protoporphyrin builds and stippled red cells appear. The neuropathy is motor, classically wrist or foot drop, with abdominal pain and constipation. Succimer is the oral chelator used in children; calcium EDTA is for higher burdens. Deferoxamine chelates iron, not lead. The anemia is a production problem, not iron overload. Stippling is classic for lead, not the smear of folate deficiency. A syrinx is a central-cord sensory cape, not this systemic picture.",
    "katzung-16",
)

add(
    "Iron poisoning",
    4,
    "pharmacology",
    "A toddler ate his mother's prenatal tablets. He is vomiting blood, then seems better, then becomes hypotensive with a metabolic acidosis and a high anion gap. The abdominal film shows tablets. A student reaches for N-acetylcysteine because the mother also mentioned headaches.",
    "What is the chelator, and why is the quiet phase a trap?",
    [
        "Deferoxamine chelates iron; the latent phase can precede shock and liver failure, so improvement does not mean the ingestion is over",
        "Deferoxamine is for lead, and iron is watched unless he seizes",
        "N-acetylcysteine is the specific iron antidote",
        "The quiet hours mean the tablets were not absorbed",
        "Alkalinization of urine is the primary removal strategy for iron",
    ],
    "Deferoxamine chelates iron; the latent phase can precede shock and liver failure, so improvement does not mean the ingestion is over",
    "Iron is directly corrosive and mitochondrial-toxic. After the first vomiting there is often a lull, then shock, acidosis, and liver injury. Deferoxamine binds iron (the urine turns vin rose). The lull is not clearance. Deferoxamine is not the lead chelator. N-acetylcysteine is for acetaminophen. Visible tablets and a lull still mean a dangerous ingestion. Urinary alkalinization is a salicylate and phenobarbital idea, not how iron is removed.",
    "katzung-16",
)

add(
    "Hereditary angioedema",
    5,
    "pathology",
    "A young woman has episodes of painful swelling of the bowel and one episode of airway swelling, without hives. Attacks follow dental work. Complement C4 is low between stories you are given, and C1 inhibitor function is low. Epinephrine and antihistamines did little for the last abdominal attack. Her father had the same illness.",
    "What is missing, and why do antihistamines fail?",
    [
        "C1 inhibitor is low or dysfunctional, so bradykinin accumulates; this is not histamine edema, so antihistamines and steroids miss the mechanism",
        "IgE is elevated and antihistamines are first-line specific therapy",
        "C3 is the deficient protein, and swelling is from infection only",
        "Terminal complement is gone, so she is at risk for Neisseria and the swelling is meningococcemia",
        "ACE inhibitors treat this disease by lowering bradykinin",
    ],
    "C1 inhibitor is low or dysfunctional, so bradykinin accumulates; this is not histamine edema, so antihistamines and steroids miss the mechanism",
    "C1 inhibitor normally brakes the complement and kallikrein-kinin cascades. Without it, bradykinin increases vascular permeability. There are no hives because histamine is not the mediator, which is why epinephrine and antihistamines disappoint. C4 is consumed and is a screening clue. This is not atopic IgE disease. C3 deficiency presents with pyogenic infection, not hereditary angioedema. Terminal-complement deficiency is Neisseria susceptibility. ACE inhibitors raise bradykinin and can provoke angioedema; they are not the treatment.",
    "robbins-10",
)

add(
    "Terminal complement and Neisseria",
    4,
    "pathology",
    "A 19-year-old has a second episode of meningococcal bacteremia. He recovered from the first. CH50 is very low. Antibody levels to vaccines are normal and he makes pus. A student diagnoses chronic granulomatous disease because the infections are bacterial.",
    "Which proteins are missing, and why is CGD unlikely?",
    [
        "C5 through C9 form the membrane attack complex; without it Neisseria recur. CGD is a phagocyte oxidative-burst defect and presents with catalase-positive abscesses and fungal disease, not isolated Neisseria",
        "C1 inhibitor deficiency causes recurrent meningococcus",
        "Selective IgA deficiency is the usual cause of recurrent Neisseria sepsis",
        "A low CH50 with normal vaccine antibodies means he cannot make immunoglobulin",
        "Terminal complement deficiency blocks pus formation",
    ],
    "C5 through C9 form the membrane attack complex; without it Neisseria recur. CGD is a phagocyte oxidative-burst defect and presents with catalase-positive abscesses and fungal disease, not isolated Neisseria",
    "The membrane attack complex lyses Neisseria. Recurrent meningococcus with a dead CH50 and intact antibodies points there. Chronic granulomatous disease fails the oxidative burst, so catalase-positive organisms and fungi cause abscesses and granulomas; a nitroblue tetrazolium or dihydrorhodamine test would be abnormal, and isolated Neisseria is the wrong signature. C1 inhibitor deficiency is angioedema. IgA deficiency is mucosal and transfusion reactions, not this bacteremia. He makes antibody, so the low CH50 is complement consumption or a component deficiency, not agammaglobulinemia. Pus formation is a leukocyte problem, as in leukocyte adhesion deficiency, not MAC loss.",
    "robbins-10",
)

add(
    "Chronic granulomatous disease",
    4,
    "pathology",
    "A boy has recurrent abscesses with Staphylococcus aureus and Aspergillus and a family of maternal uncles with the same history. Dihydrorhodamine testing shows no oxidative burst. Catalase-negative streptococci have been less of a problem. A student prescribes a terminal-complement workup as the only test.",
    "What enzyme is missing, and why do catalase-positive organisms win?",
    [
        "NADPH oxidase cannot make superoxide; catalase-positive organisms destroy the hydrogen peroxide the host might have borrowed, so they survive inside the phagocyte",
        "Myeloperoxidase deficiency is the usual cause of this severe phenotype",
        "He cannot diapedese, so there is no pus and the burst test is normal",
        "Adenosine deaminase is missing, so only viral infections occur",
        "The burst is intact and the test result was described backward",
    ],
    "NADPH oxidase cannot make superoxide; catalase-positive organisms destroy the hydrogen peroxide the host might have borrowed, so they survive inside the phagocyte",
    "Chronic granulomatous disease is NADPH oxidase failure, often X-linked. No superoxide is made. Organisms that bring their own catalase degrade whatever peroxide leaks in, so Staph and Aspergillus thrive. Myeloperoxidase deficiency is usually mild. Leukocyte adhesion deficiency has sky-high neutrophils, no pus, and a normal burst. Adenosine deaminase deficiency is a form of SCID with viral and opportunistic disease. The test showed no burst; that is the diagnosis, not a reversed result.",
    "robbins-10",
)

add(
    "Leukocyte adhesion deficiency",
    4,
    "pathology",
    "An infant had delayed separation of the umbilical cord and now has a high neutrophil count in the blood with no pus at a skin infection. Wound cultures grow bacteria. A Rebuck skin window shows neutrophils do not arrive. Oxidative burst testing is normal.",
    "Which molecule is missing?",
    [
        "CD18, the beta-2 integrin, so leukocytes cannot leave the blood",
        "NADPH oxidase, so the burst test should have failed",
        "C5, so he cannot make the membrane attack complex",
        "IgG, so the cord separation is a B-cell problem",
        "Selectin ligands are increased, which traps cells in the tissue",
    ],
    "CD18, the beta-2 integrin, so leukocytes cannot leave the blood",
    "Leukocyte adhesion deficiency type 1 loses CD18. Neutrophils cannot crawl out of vessels, so the blood count is high, tissues have no pus, the cord separates late, and a skin window stays empty. The burst is normal, which excludes chronic granulomatous disease. C5 deficiency does not trap neutrophils in the blood. Immunoglobulin is not the adhesion molecule, and cord separation is the classic adhesion clue. The problem is too little trafficking, not excess selectin.",
    "robbins-10",
)

add(
    "DiGeorge versus SCID",
    5,
    "pathology",
    "Infant A has no thymic shadow, low calcium, a conotruncal heart defect, and viral and fungal infections, with low T cells. Infant B has almost no T or B cells, low lymphocytes on the newborn count, and infections with bacteria, viruses, and fungi, and the thymus is small from lack of lymphocytes rather than a field defect. Infant A has no hypocalcemia twin in infant B.",
    "Which embryologic field failed in A, and what cell lines failed in B?",
    [
        "A failed development of the third and fourth pharyngeal pouches; B has a combined lymphocyte precursor defect such as a cytokine-receptor or ADA problem",
        "Both lack only B cells, so immunoglobulins are the whole story",
        "A is Bruton agammaglobulinemia, which includes hypocalcemia",
        "B has a pure neutrophil adhesion defect and a normal lymphocyte count",
        "The heart defect in A is an incidental PDA and the thymus is normal",
    ],
    "A failed development of the third and fourth pharyngeal pouches; B has a combined lymphocyte precursor defect such as a cytokine-receptor or ADA problem",
    "DiGeorge syndrome is a third-and-fourth pouch field defect: no thymus, no parathyroids, and conotruncal anomalies such as tetralogy or interrupted arch, so T cells fail and calcium is low. SCID is a combined T and B failure from defects such as the common gamma chain or adenosine deaminase, with low lymphocytes and infections of every class. B-cell-only disease would spare the viral and fungal pattern and the calcium. Bruton disease is boys with absent B cells after maternal IgG wanes, not hypocalcemia. Adhesion deficiency raises the neutrophil count and does not empty the lymphocyte count. The cardiac lesion is part of the field defect, not a coincidence.",
    "langman-embryo",
)

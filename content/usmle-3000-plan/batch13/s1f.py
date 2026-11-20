"""Step 1 items 51-100."""

from lib import item

def W(a, b):
    return (a, b)

ITEMS = []

def R(n, sex, system, weight, topic, diff, subject, take, cite, age, fact, question, correct, wrongs):
    who = "man" if sex == "m" else "woman"
    pro = "He" if sex == "m" else "She"
    scenario = f"A {age}-year-old {who} {fact} {pro} is here so the mechanism can be named."
    ITEMS.append(item(n, "step1", sex=sex, system=system, weight=weight, topic=topic, diff=diff, subject=subject, takeaway=take, citation=cite, scenario=scenario, question=question, correct=correct, wrongs=wrongs))

C = "FDA prescribing information, 2024 labels, for the named drug's mechanism."

def go(rows):
    for row in rows:
        R(*row)

go([
(51,"m","blood-lymph-immune",11,"g6pd-nitro",3,"pharmacology","Nitrofurantoin can hemolyze G6PD-deficient red cells because it is an oxidative drug.",C,29,"develops dark urine and a hemoglobin drop two days after nitrofurantoin. The smear shows bite cells.",
 "Why did this bladder drug hemolyze blood?",
 W("Oxidant stress in G6PD deficiency", "Nitrofurantoin can hemolyze G6PD-deficient red cells because it is an oxidative drug. Bite cells are the smear clue."),
 [W("Immune destruction of platelets", "Platelets are not the cells that hemolyzed."),
  W("Sickle polymerization triggered by every antibiotic", "The smear clue is bite cells, not sickled cells."),
  W("Vitamin K antagonism", "That would change clotting, not make bite cells."),
  W("A direct toxin to the liver only", "The hemoglobin fell and the urine is dark, which is hemolysis.")]),
(52,"f","blood-lymph-immune",11,"penicillin-ain",3,"pathology","A beta-lactam can cause allergic interstitial nephritis, with fever, rash, and white cells in the urine, days after the drug starts.",C,52,"develops fever, rash, and creatinine 2.8 mg/dL ten days after nafcillin. Urine has white cells and white-cell casts.",
 "Which compartment of the kidney is allergic?",
 W("The interstitium", "A beta-lactam can cause allergic interstitial nephritis, with fever, rash, and white cells in the urine, days after the drug starts. The timing is too late for a simple toxic tubular hit on day 1 and too inflammatory for a hemodynamic change."),
 [W("Only the glomerulus, with red-cell casts required", "The casts described are white-cell casts."),
  W("The bladder muscle", "Casts form in the kidney."),
  W("The renal artery, as vasculitis from day 1", "The latency of ten days fits allergy."),
  W("No compartment. The creatinine rise is trimethoprim secretion", "She is on nafcillin, and the urine is inflammatory.")]),
(53,"m","respiratory-renal",13,"loop-alkalosis",2,"pharmacology","Loop diuretics cause metabolic alkalosis by delivering sodium downstream and increasing aldosterone-driven hydrogen and potassium loss.",C,68,"has been on furosemide. Bicarbonate is 34 mEq/L and potassium is 3.0 mEq/L.",
 "Which acid-base change is expected?",
 W("Metabolic alkalosis with potassium loss", "Loop diuretics cause metabolic alkalosis by delivering sodium downstream and increasing aldosterone-driven hydrogen and potassium loss. Bicarbonate 34 and potassium 3.0 are that pair."),
 [W("Normal-gap metabolic acidosis", "Bicarbonate would be low."),
  W("Respiratory acidosis", "The change described is metabolic."),
  W("Hyperkalemic acidosis", "Potassium is low, not high."),
  W("No change in acid-base balance", "The numbers show a clear alkalosis.")]),
(54,"f","respiratory-renal",13,"thiazide-gout",2,"pharmacology","Thiazides raise serum uric acid and can precipitate gout.",C,63,"starts chlorthalidone. Uric acid rises from 6 to 9 mg/dL and the first toe becomes hot.",
 "Which drug class raised the uric acid?",
 W("The thiazide", "Thiazides raise serum uric acid and can precipitate gout. The hot toe after the rise is the clinical result. A uricosuric drug would lower uric acid."),
 [W("A uricosuric drug, because every diuretic lowers uric acid", "This diuretic raises uric acid."),
  W("Acetazolamide, which always causes gout on day 1", "She started a thiazide-like drug."),
  W("A statin", "Statins are not the uric-acid story."),
  W("An antibiotic that oxidizes uric acid", "No such antibiotic was started.")]),
(55,"m","gastrointestinal",8,"ppi-meal",2,"pharmacology","Proton pump inhibitors bind active pumps, so the dose works best before a meal, when pumps are turned on.", "American College of Gastroenterology GERD guideline, 2022, and FDA labeling for omeprazole, 2024.",48,"takes omeprazole at bedtime on an empty stomach and gets little relief. Heartburn is after lunch.",
 "When should the dose be taken?",
 W("Before a meal", "Proton pump inhibitors bind active pumps, so the dose works best before a meal, when pumps are turned on. Bedtime on an empty stomach misses that window."),
 [W("Only at bedtime, because pumps are active during sleep", "Pumps are stimulated by food."),
  W("Once a week", "The reflux dose is daily."),
  W("With an antacid in the same swallow as a requirement", "An antacid is not required for the timing."),
  W("After the heartburn has already peaked", "It is not a rescue drug for that moment.")]),
(56,"f","gastrointestinal",8,"h-pylori-urease",2,"microbiology","The urea breath test detects urease, which Helicobacter uses to split urea into ammonia and carbon dioxide.", "ACG Helicobacter pylori guideline, 2024.",36,"has a positive urea breath test. She asks what the organism does to urea.",
 "Which reaction does the test detect?",
 W("Splitting urea, which releases labeled carbon dioxide", "The urea breath test detects urease, which Helicobacter uses to split urea into ammonia and carbon dioxide. A positive test means that enzyme is present."),
 [W("Binding intrinsic factor", "That is a B12 issue."),
  W("Making uric acid", "Urease is not uricase."),
  W("Inhibiting cyclooxygenase", "That is an NSAID effect."),
  W("Fermenting lactose", "Lactose fermentation is a different test.")]),
(57,"m","gastrointestinal",8,"celiac-hla",3,"pathology","HLA-DQ2 or DQ8 is necessary for celiac disease but not sufficient. Most people with the allele do not have the disease.", "ACG celiac guideline, 2023.",30,"has HLA-DQ2 and no symptoms. A classmate says the allele alone proves celiac disease and starts a lifelong gluten-free diet.",
 "What does the allele actually prove?",
 W("He can develop the disease, but the allele alone does not diagnose it", "HLA-DQ2 or DQ8 is necessary for celiac disease but not sufficient. Most people with the allele do not have the disease. Symptoms, serology, and biopsy still matter."),
 [W("The disease is certain", "The allele is common in people who never get the disease."),
  W("The disease is impossible", "The allele is required, so it does not make the disease impossible."),
  W("He has Crohn disease", "The allele is not a Crohn test."),
  W("Iron is overloaded", "HLA-DQ2 is not an iron test.")]),
(58,"f","behavioral-nervous",12,"benzo-gaba",2,"pharmacology","Benzodiazepines facilitate GABA-A chloride channels. The class does not open glutamate channels.",C,40,"is given lorazepam for a seizure. The seizure stops. She asks which receptor was facilitated.",
 "Which receptor?",
 W("GABA-A", "Benzodiazepines facilitate GABA-A chloride channels. The class does not open glutamate channels. More chloride entry hyperpolarizes the neuron."),
 [W("Glutamate NMDA as an agonist", "Agonizing glutamate would excite the brain."),
  W("The mu opioid receptor", "That is an opioid target."),
  W("The nicotinic receptor at the neuromuscular junction", "The stop-seizure effect is central GABA."),
  W("A dopamine D2 receptor", "Blocking D2 is an antipsychotic effect.")]),
(59,"m","behavioral-nervous",12,"succinylcholine",3,"pharmacology","Succinylcholine can cause fatal hyperkalemia when extrajunctional acetylcholine receptors are upregulated, as after a major burn.",C,34,"has a 30 percent burn from 10 days ago and needs intubation. Potassium is 4.6 mEq/L. A plan uses succinylcholine.",
 "Why is succinylcholine dangerous now?",
 W("Upregulated receptors can release a flood of potassium", "Succinylcholine can cause fatal hyperkalemia when extrajunctional acetylcholine receptors are upregulated, as after a major burn. Day 10 is inside that window. A normal potassium today does not make the drug safe."),
 [W("It causes hypokalemia in burns", "The risk is hyperkalemia."),
  W("It is unsafe only in the first hour after a burn", "The dangerous window is later, when receptors have upregulated."),
  W("It blocks GABA", "It is a depolarizing neuromuscular blocker."),
  W("It is the preferred blocker for every burn after day 2", "It is avoided in this window.")]),
(60,"f","behavioral-nervous",12,"mh-dantrolene",3,"pharmacology","Malignant hyperthermia is a ryanodine-receptor crisis from an anesthetic trigger. Dantrolene closes that calcium release. It is not neuroleptic malignant syndrome.",C,28,"develops rigidity, CO2 of 80 mm Hg, and temperature 40 C minutes after succinylcholine and a volatile anesthetic.",
 "Which drug treats the muscle calcium release?",
 W("Dantrolene", "Malignant hyperthermia is a ryanodine-receptor crisis from an anesthetic trigger. Dantrolene closes that calcium release. It is not neuroleptic malignant syndrome. The trigger was the anesthetic, not an antipsychotic."),
 [W("More succinylcholine", "The trigger should not be repeated."),
  W("A benzodiazepine as the specific ryanodine drug", "A benzodiazepine does not close the ryanodine receptor."),
  W("Bromocriptine, because every rigidity is neuroleptic malignant syndrome", "No antipsychotic was given. The anesthetic was."),
  W("Acetylcysteine", "That restores glutathione. It does not treat this calcium release.")]),
])

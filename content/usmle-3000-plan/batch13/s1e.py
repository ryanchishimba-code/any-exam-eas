"""Step 1 items 39-100."""

from lib import item

def W(a, b):
    return (a, b)

ITEMS = []

def R(n, sex, system, weight, topic, diff, subject, take, cite, age, fact, question, correct, wrongs):
    who = "man" if sex == "m" else "woman"
    pro = "He" if sex == "m" else "She"
    scenario = f"A {age}-year-old {who} {fact} {pro} is here for the mechanism, not for a medication list."
    ITEMS.append(item(n, "step1", sex=sex, system=system, weight=weight, topic=topic, diff=diff, subject=subject, takeaway=take, citation=cite, scenario=scenario, question=question, correct=correct, wrongs=wrongs))

def go(rows):
    for row in rows:
        R(*row)

go([
(39,"m","gastrointestinal",8,"aspirin-acid-base",3,"pharmacology","Salicylate poisoning causes a respiratory alkalosis and an anion-gap metabolic acidosis together.","FDA prescribing information for aspirin, 2024.",20,"took a bottle of aspirin tablets. pH is 7.48, PCO2 is 22 mm Hg, and the anion gap is 22.",
 "Which two acid-base processes are running?",
 W("Respiratory alkalosis plus anion-gap metabolic acidosis", "Salicylate poisoning causes a respiratory alkalosis and an anion-gap metabolic acidosis together. A low PCO2 with a high pH shows the respiratory piece, and the gap shows the metabolic piece."),
 [W("Metabolic alkalosis alone", "The anion gap would not be 22 in a pure metabolic alkalosis."),
  W("Normal-gap acidosis from diarrhea", "The gap is high, and he did not describe diarrhea."),
  W("Respiratory acidosis from hypoventilation", "PCO2 is low, so he is hyperventilating."),
  W("No acid-base change, because aspirin is neutral", "The numbers are not neutral.")]),
(40,"f","gastrointestinal",8,"reye",2,"pharmacology","Aspirin in a child with a viral illness is linked to Reye syndrome, with liver failure and encephalopathy.","FDA aspirin labeling and CDC Reye syndrome guidance, 2024.",17,"is recovering from influenza and was given aspirin. She becomes confused, and ALT is 1,200 U/L.",
 "Which drug exposure fits this liver-and-brain picture?",
 W("Aspirin during the viral illness", "Aspirin in a child with a viral illness is linked to Reye syndrome, with liver failure and encephalopathy. Confusion plus a very high ALT after that exposure is the pattern. Acetaminophen toxicity is a different timing story."),
 [W("Acetaminophen at a normal labeled dose", "A normal dose does not make this syndrome."),
  W("Ibuprofen, which is the classic Reye trigger", "The classic trigger is aspirin, not ibuprofen."),
  W("No drug. Influenza always causes this liver failure", "Influenza alone is not this syndrome."),
  W("A cephalosporin", "A cephalosporin is not the Reye association.")]),
(41,"m","gastrointestinal",8,"nac-glutathione",2,"pharmacology","Acetylcysteine restores glutathione so the toxic acetaminophen metabolite can be detoxified.","FDA prescribing information for acetylcysteine, 2024.",19,"has a toxic acetaminophen level. The antidote is started. He asks which body store the antidote replenishes.",
 "Which store is replenished?",
 W("Glutathione", "Acetylcysteine restores glutathione so the toxic acetaminophen metabolite can be detoxified. The metabolite is NAPQI. Without glutathione it injures the liver."),
 [W("Factor VIII", "Factor VIII is not the acetaminophen cofactor."),
  W("Ceruloplasmin", "That protein carries copper."),
  W("Surfactant", "Surfactant is a lung product."),
  W("Fetal hemoglobin", "Fetal hemoglobin is unrelated to this overdose.")]),
(42,"f","msk-skin",10,"bisphosphonate",2,"pharmacology","Bisphosphonates inhibit osteoclasts, so bone resorption falls.","FDA prescribing information for alendronate, 2024.",72,"starts alendronate after a vertebral fracture. She asks which cell the drug quiets.",
 "Which cell is inhibited?",
 W("Osteoclasts", "Bisphosphonates inhibit osteoclasts, so bone resorption falls. Osteoblasts build bone. The drug does not stimulate those cells as its main action."),
 [W("Osteoblasts, by killing those cells", "Killing osteoblasts would weaken bone further."),
  W("Chondrocytes in the growth plate", "She is an adult. The target is the osteoclast."),
  W("Parathyroid chief cells only", "The drug acts on bone-resorbing cells."),
  W("Neutrophils", "Neutrophils are not the osteoporosis target.")]),
(43,"m","msk-skin",10,"denosumab",2,"pharmacology","Denosumab is an antibody against RANKL, so osteoclasts are not activated.","FDA prescribing information for denosumab, 2024.",75,"starts denosumab for osteoporosis. He has not tolerated a bisphosphonate.",
 "What does the antibody bind?",
 W("RANKL", "Denosumab is an antibody against RANKL, so osteoclasts are not activated. It is not an antibody against the parathyroid receptor."),
 [W("TNF-alpha, as in rheumatoid arthritis", "That is a different antibody class."),
  W("The sodium-chloride cotransporter", "That is a diuretic target."),
  W("BCR-ABL", "That is a leukemia kinase."),
  W("Acetylcholinesterase", "That enzyme is a neuromuscular target.")]),
(44,"f","msk-skin",10,"colchicine-not",3,"pharmacology","Allopurinol blocks formation of new uric acid. It does not dissolve the uric acid already circulating the way rasburicase does.","FDA prescribing information for allopurinol and rasburicase, 2024.",60,"has uric acid 13 mg/dL during tumor lysis. She is offered allopurinol to destroy the uric acid already measured.",
 "What can allopurinol not do?",
 W("It cannot break down uric acid that is already present", "Allopurinol blocks formation of new uric acid. It does not dissolve the uric acid already circulating the way rasburicase does. A level of 13 needs the enzyme that oxidizes existing uric acid if a rapid drop is required."),
 [W("It cannot be used in any adult", "Adults use it for prevention. The limit is what it does to existing uric acid."),
  W("It raises uric acid production", "It lowers production."),
  W("It is a RANKL antibody", "That is denosumab."),
  W("It replaces glutathione", "That is acetylcysteine.")]),
(45,"m","blood-lymph-immune",11,"warfarin-factors",2,"pharmacology","Warfarin blocks vitamin K epoxide reductase, so factors II, VII, IX, and X and proteins C and S fall.","FDA prescribing information for warfarin, 2024.",66,"starts warfarin. Factor VII activity falls before factor II activity. He asks which enzyme is blocked.",
 "Which enzyme is blocked?",
 W("Vitamin K epoxide reductase", "Warfarin blocks vitamin K epoxide reductase, so factors II, VII, IX, and X and proteins C and S fall. Factor VII falls first because its half-life is short."),
 [W("Cyclooxygenase", "That is the aspirin target."),
  W("Thrombin directly", "Direct thrombin inhibitors are a different class."),
  W("Antithrombin", "Heparin works through antithrombin. Warfarin does not."),
  W("HMG-CoA reductase", "That is a statin target.")]),
(46,"f","blood-lymph-immune",11,"warfarin-necrosis",3,"pharmacology","Warfarin skin necrosis happens when protein C falls before the procoagulant factors, so a transient hypercoagulable state appears.","FDA prescribing information for warfarin, 2024.",58,"starts warfarin alone and on day 3 develops painful dark skin on the thigh. Protein C was already low from a hereditary deficiency. She was not bridged.",
 "Why did the skin infarct early?",
 W("Protein C fell first, so clotting briefly increased", "Warfarin skin necrosis happens when protein C falls before the procoagulant factors, so a transient hypercoagulable state appears. Starting without a bridge in a person who already has low protein C is the setup."),
 [W("The drug dissolved skin collagen directly", "The lesion is thrombotic, not a chemical burn."),
  W("Factor VIII rose", "The drug does not raise factor VIII."),
  W("Platelets clumped because of heparin", "No heparin is described."),
  W("The dark skin is a harmless bruise from one venipuncture", "Painful dark skin in this timing is necrosis.")]),
(47,"m","blood-lymph-immune",11,"heparin-at",2,"pharmacology","Heparin binds antithrombin and speeds inactivation of thrombin and factor Xa.","FDA prescribing information for heparin, 2024.",70,"receives unfractionated heparin. The anti-Xa effect rises within minutes. He has no drop in platelets.",
 "Which protein does heparin use?",
 W("Antithrombin", "Heparin binds antithrombin and speeds inactivation of thrombin and factor Xa. It does not block vitamin K recycling."),
 [W("Vitamin K epoxide reductase", "That is warfarin."),
  W("Cyclooxygenase in the platelet", "That is aspirin."),
  W("Plasminogen", "That is a fibrinolytic target."),
  W("RANKL", "That is denosumab.")]),
(48,"f","blood-lymph-immune",11,"aspirin-cox",2,"pharmacology","Aspirin irreversibly acetylates cyclooxygenase, so a platelet cannot make thromboxane for the rest of its life.","FDA prescribing information for aspirin, 2024.",64,"takes aspirin 81 mg daily. Platelet function stays abnormal for days after the last dose. She asks why a single daily dose lasts so long.",
 "Why does the effect outlast the drug in the blood?",
 W("Platelets cannot remake the enzyme, so the block lasts for the life of the platelet", "Aspirin irreversibly acetylates cyclooxygenase, so a platelet cannot make thromboxane for the rest of its life. Nucleated cells can make new enzyme. Platelets cannot."),
 [W("The drug is stored in bone for months and released daily", "The duration in platelets is the cell's lifespan, not bone storage."),
  W("Aspirin reversibly blocks the enzyme for 4 hours only", "The block in the platelet is irreversible."),
  W("It inhibits vitamin K reductase", "That is warfarin."),
  W("It raises antithrombin", "That is not the aspirin mechanism.")]),
(49,"m","respiratory-renal",13,"spironolactone",2,"pharmacology","Spironolactone blocks the aldosterone receptor and the androgen receptor, so potassium rises and breast tissue can enlarge.","FDA prescribing information for spironolactone, 2024.",45,"takes spironolactone. Potassium is 5.3 mEq/L and breast tissue is tender. He is not taking digoxin.",
 "Which two receptors explain the potassium and the breast tenderness?",
 W("Aldosterone and androgen receptors", "Spironolactone blocks the aldosterone receptor and the androgen receptor, so potassium rises and breast tissue can enlarge. The potassium is the mineralocorticoid block. The tenderness is the androgen block."),
 [W("The loop cotransporter only", "A loop diuretic lowers potassium."),
  W("The insulin receptor", "Insulin shifts potassium inward. It does not enlarge breast tissue this way."),
  W("HMG-CoA reductase", "That is a statin."),
  W("The mu opioid receptor", "That is an opioid target.")]),
(50,"f","respiratory-renal",13,"amiloride-like",3,"pharmacology","Trimethoprim blocks the epithelial sodium channel, like a potassium-sparing diuretic, so potassium can rise.","FDA prescribing information for trimethoprim, 2024.",76,"starts trimethoprim and potassium rises from 4.4 to 5.6 mEq/L. Creatinine is unchanged. She is not in acidosis.",
 "Which channel blockade explains the potassium?",
 W("The epithelial sodium channel in the collecting duct", "Trimethoprim blocks the epithelial sodium channel, like a potassium-sparing diuretic, so potassium can rise. Creatinine did not move, so this is not the secretion artifact and not a fall in filtration."),
 [W("The thick-ascending-limb cotransporter", "Blocking that transporter lowers potassium."),
  W("The calcium-sensing receptor", "That is a different drug class."),
  W("Pancreatic beta-cell potassium channels as the cause of hyperkalemia", "Those channels regulate insulin, and the vignette is a renal potassium rise."),
  W("No channel. The potassium rise is always hemolysis", "Hemolysis is not described. The drug has this renal effect.")]),
])

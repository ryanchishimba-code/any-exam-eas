"""Step 1 items 1-40. Mechanisms, not the Step 2 orders."""

from lib import item

FDA = "FDA prescribing information, 2024 labels, for the named drug's mechanism."
KDIGO = "KDIGO 2024 Clinical Practice Guideline for the Evaluation and Management of Chronic Kidney Disease."

def W(a, b):
    return (a, b)

def Q(n, **k):
    return item(n, "step1", **k)

ITEMS = []

def add(n, **k):
    ITEMS.append(Q(n, **k))

add(1, sex="m", system="respiratory-renal", weight=13, topic="diuretics", diff=2, subject="pharmacology",
  takeaway="Loop diuretics inhibit the Na-K-2Cl cotransporter and increase calcium loss in urine.",
  citation=FDA,
  scenario="A 58-year-old man starts furosemide for edema. His urine calcium rises and his serum calcium falls slightly. He is not taking a thiazide.",
  question="Which transporter explains the calcium loss?",
  correct=W("The Na-K-2Cl cotransporter in the thick ascending limb",
            "Loop diuretics inhibit the Na-K-2Cl cotransporter and increase calcium loss in urine. Blocking that transporter abolishes the lumen-positive charge that normally drives calcium reabsorption, so calcium is wasted."),
  wrongs=[
    W("The distal convoluted-tubule sodium-chloride cotransporter", "That is the thiazide target, and thiazides lower urine calcium."),
    W("The collecting-duct sodium channel", "That is the amiloride target and does not explain this calcium wasting."),
    W("The proximal-tubule carbonic anhydrase", "That is the acetazolamide target."),
    W("The glomerular basement membrane", "Filtration of calcium is not the step this drug changes."),
  ])

add(2, sex="f", system="respiratory-renal", weight=13, topic="diuretics", diff=2, subject="pharmacology",
  takeaway="Thiazides inhibit the distal sodium-chloride cotransporter and decrease urine calcium.",
  citation=FDA,
  scenario="A 60-year-old woman takes hydrochlorothiazide. Her urine calcium is low and her serum calcium is 10.6 mg/dL. She is not taking a loop diuretic.",
  question="Which effect on calcium is expected?",
  correct=W("Less calcium in the urine, so serum calcium can rise",
            "Thiazides inhibit the distal sodium-chloride cotransporter and decrease urine calcium. Increased proximal calcium reabsorption follows the volume loss. A loop diuretic would do the opposite."),
  wrongs=[
    W("More calcium in the urine, as with a loop diuretic", "That is the loop effect, not the thiazide effect."),
    W("No change in calcium handling", "Calcium handling is a defining difference between these classes."),
    W("Blocking of the parathyroid receptor", "The drug does not block that receptor."),
    W("Dissolving bone directly", "The calcium shift is renal, not a direct bone toxin."),
  ])

add(3, sex="m", system="respiratory-renal", weight=13, topic="diuretics", diff=2, subject="pharmacology",
  takeaway="Acetazolamide inhibits proximal carbonic anhydrase and causes a normal-anion-gap metabolic acidosis.",
  citation=FDA,
  scenario="A 24-year-old man starts acetazolamide for altitude symptoms. His bicarbonate falls from 24 to 18 mEq/L and the anion gap stays normal. He is not having diarrhea.",
  question="Why did the bicarbonate fall?",
  correct=W("Proximal bicarbonate reabsorption is blocked",
            "Acetazolamide inhibits proximal carbonic anhydrase and causes a normal-anion-gap metabolic acidosis. Bicarbonate is wasted in the urine. Diarrhea can look similar, but he does not have it."),
  wrongs=[
    W("Distal potassium-sparing blockade", "That raises potassium. It is not this acidosis."),
    W("A high anion gap from lactate", "The gap stayed normal."),
    W("Respiratory alkalosis only, with no renal effect", "The bicarbonate fall here is renal loss, not just hyperventilation."),
    W("Inhibition of the thick-ascending-limb cotransporter", "That is a loop diuretic, not acetazolamide."),
  ])

add(4, sex="m", system="respiratory-renal", weight=13, topic="trimethoprim", diff=3, subject="pharmacology",
  takeaway="Trimethoprim can raise the serum creatinine by blocking secretion, while the glomerular filtration rate stays the same.",
  citation=FDA,
  scenario="A 34-year-old man starts trimethoprim-sulfamethoxazole. Two days later creatinine rises from 0.9 to 1.2 mg/dL. Urine output is normal, and there are no casts. He is otherwise well.",
  question="What does the creatinine rise mean?",
  correct=W("Secretion of creatinine is blocked. Filtration itself has not fallen",
            "Trimethoprim can raise the serum creatinine by blocking secretion, while the glomerular filtration rate stays the same. A true fall in filtration would bring casts, oliguria, or a larger clinical change. This early isolated rise is the secretion effect."),
  wrongs=[
    W("Acute tubular necrosis has begun", "Normal urine output and no casts argue against that."),
    W("The glomeruli are inflamed", "Nothing in the urine supports nephritis."),
    W("Filtration has fallen by the same percent as the creatinine", "The lab number moved because secretion was blocked, not because filtration fell."),
    W("The drug dissolved muscle and released creatinine", "Creatine kinase is not the story. Creatinine secretion is."),
  ])

add(5, sex="f", system="respiratory-renal", weight=13, topic="ace-hemodynamics", diff=3, subject="physiology",
  takeaway="An ACE inhibitor dilates the efferent arteriole, so filtration can fall even though kidney perfusion is not worse.",
  citation=KDIGO,
  scenario="A 66-year-old woman starts lisinopril. Creatinine rises from 1.1 to 1.3 mg/dL. Blood pressure is 126/74 mm Hg and urine sediment is bland. She is not volume depleted.",
  question="Which vessel change explains a small creatinine rise?",
  correct=W("Efferent arteriolar dilation, which lowers glomerular pressure",
            "An ACE inhibitor dilates the efferent arteriole, so filtration can fall even though kidney perfusion is not worse. Angiotensin II had been constricting that vessel. A bland sediment means this is hemodynamic, not inflammation."),
  wrongs=[
    W("Afferent arteriolar constriction from the drug", "The drug's glomerular effect is on the efferent side."),
    W("Obstruction of the ureter", "A bland sediment and a small rise do not suggest obstruction."),
    W("Renal-vein thrombosis", "That is a different, usually larger illness."),
    W("Increased protein leak as the cause of the creatinine change", "Protein leak is not what raises creatinine in the first days."),
  ])

add(6, sex="m", system="respiratory-renal", weight=13, topic="casts", diff=3, subject="pathology",
  takeaway="Muddy-brown granular casts mean tubular injury. Hyaline casts alone fit a low-flow prerenal state.",
  citation="KDIGO acute kidney injury framework, still used with the 2024 CKD guideline's emphasis on separating hemodynamic change from tubular injury.",
  scenario="A 72-year-old man is oliguric after hypotension. Urine shows muddy-brown granular casts. The fractional excretion of sodium is 3 percent. He was not on a diuretic.",
  question="Where is the injury?",
  correct=W("The tubules, not a purely prerenal low-flow state",
            "Muddy-brown granular casts mean tubular injury. Hyaline casts alone fit a low-flow prerenal state. A fractional excretion of sodium of 3 percent, off diuretics, supports a tubular source rather than avid sodium retention."),
  wrongs=[
    W("A purely prerenal state, because any cast means low flow", "Muddy-brown casts are tubular debris, not the hyaline casts of low flow."),
    W("The glomeruli, because casts are always glomerular", "These casts are granular, not red-cell casts."),
    W("The bladder only", "Bladder injury does not make muddy-brown casts."),
    W("A laboratory stain error", "The sodium excretion and the oliguria agree with the casts."),
  ])

add(7, sex="f", system="respiratory-renal", weight=13, topic="ain", diff=3, subject="pathology",
  takeaway="White-cell casts and eosinophiluria after a new drug point to interstitial nephritis, not acute tubular necrosis.",
  citation=FDA,
  scenario="A 49-year-old woman started a penicillin 8 days ago. She now has fever, a rash, and creatinine 2.4 mg/dL. Urine shows white-cell casts and eosinophils, and no muddy-brown casts.",
  question="Which kidney compartment is inflamed?",
  correct=W("The interstitium, as an allergic reaction to the drug",
            "White-cell casts and eosinophiluria after a new drug point to interstitial nephritis, not acute tubular necrosis. Fever and rash are the allergic clues. Muddy-brown casts would have suggested tubules. Those casts are absent."),
  wrongs=[
    W("The tubules from ischemia, because every creatinine rise is necrosis", "The urine and the rash point to allergy."),
    W("The glomeruli, because eosinophils are a glomerular cell", "Eosinophils in this setting are interstitial."),
    W("Only the bladder, because fever means cystitis", "White-cell casts come from the kidney, not the bladder."),
    W("No real inflammation, because a rash cannot affect the kidney", "The rash is part of the same allergic illness."),
  ])

add(8, sex="m", system="msk-skin", weight=10, topic="rhabdomyolysis", diff=3, subject="pathology",
  takeaway="A urine dipstick positive for blood with no red cells on microscopy is myoglobin until proved otherwise.",
  citation="Consensus emergency description consistent with KDIGO fluid-resuscitation practice for pigment injury, 2024 context.",
  scenario="A 28-year-old man collapsed after a long run. His urine dipstick is strongly positive for blood, but microscopy shows 0 to 1 red cells. Creatine kinase is 42,000 U/L. He is tender in both thighs.",
  question="What is the pigment?",
  correct=W("Myoglobin from muscle, not red cells",
            "A urine dipstick positive for blood with no red cells on microscopy is myoglobin until proved otherwise. The creatine kinase of 42,000 confirms muscle necrosis. The dipstick detects heme and cannot tell hemoglobin from myoglobin."),
  wrongs=[
    W("Red cells that the microscope missed", "Zero to one red cell does not explain a strong dipstick."),
    W("Bilirubin only", "Bilirubin is a different dipstick pad."),
    W("A drug color with no muscle injury", "The creatine kinase shows the muscle injury."),
    W("White cells, because any positive dipstick is infection", "The blood pad is not the leukocyte pad."),
  ])

add(9, sex="f", system="blood-lymph-immune", weight=11, topic="b12-folate", diff=3, subject="pathology",
  takeaway="Vitamin B12 deficiency can damage the dorsal columns. Folate deficiency causes the same anemia without that cord lesion.",
  citation="NIH Office of Dietary Supplements vitamin B12 fact sheet, 2024, and standard neurologic correlation used on Step 1.",
  scenario="A 67-year-old woman has a hemoglobin of 9 g/dL, a high mean cell volume, and loss of vibration sense in both feet. Methylmalonic acid is high. Folate was normal on the intake labs.",
  question="Which deficiency fits the cord finding?",
  correct=W("Vitamin B12, because the cord lesion and the high methylmalonic acid go together",
            "Vitamin B12 deficiency can damage the dorsal columns. Folate deficiency causes the same anemia without that cord lesion. High methylmalonic acid is the B12 clue. A normal folate does not produce this cord picture."),
  wrongs=[
    W("Folate, because every high mean cell volume is folate", "Folate does not raise methylmalonic acid or hit the dorsal columns."),
    W("Iron, because numbness is an iron symptom", "Iron deficiency is microcytic and does not raise methylmalonic acid."),
    W("Vitamin C, because the mean cell volume is high", "Vitamin C deficiency is not this anemia."),
    W("Vitamin K, because the hemoglobin is low", "Vitamin K deficiency is a clotting problem, not macrocytic anemia."),
  ])

add(10, sex="m", system="blood-lymph-immune", weight=11, topic="iron-acd", diff=2, subject="pathology",
  takeaway="Low ferritin means iron deficiency. A high ferritin with low serum iron fits anemia of inflammation.",
  citation="WHO and AGA-aligned iron studies interpretation used in the 2020 AGA iron-deficiency guideline.",
  scenario="A 55-year-old man has hemoglobin 10 g/dL. Ferritin is 12 ng/mL and transferrin saturation is low. He has no chronic infection. A classmate calls this anemia of inflammation because the hemoglobin is low.",
  question="Which iron study pattern is this?",
  correct=W("Iron deficiency, because ferritin is low",
            "Low ferritin means iron deficiency. A high ferritin with low serum iron fits anemia of inflammation. A ferritin of 12 is not an inflammatory pattern. Inflammation stores iron and raises ferritin."),
  wrongs=[
    W("Anemia of inflammation, because any anemia is inflammatory", "Inflammation raises ferritin. His is low."),
    W("B12 deficiency, because ferritin tracks B12", "Ferritin tracks iron stores."),
    W("Sideroblastic anemia, because ferritin is always low in that disease", "The low ferritin here is iron deficiency."),
    W("A lab error, because ferritin cannot be 12", "A ferritin of 12 is a real iron-deficient value."),
  ])

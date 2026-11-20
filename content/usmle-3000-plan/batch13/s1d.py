"""Step 1 items 31-100, built from a table so pronouns stay consistent."""

from lib import item

FDA = "FDA prescribing information, 2024 labels, for the named drug's mechanism."

def W(a, b):
    return (a, b)

ROWS = []

def R(n, sex, system, weight, topic, diff, subject, take, cite, age, fact, question, correct, wrongs):
    who = "man" if sex == "m" else "woman"
    pro = "He" if sex == "m" else "She"
    scenario = f"A {age}-year-old {who} {fact} {pro} is awake and the rest of the examination is being used only to answer the mechanism."
    ROWS.append(item(
        n, "step1", sex=sex, system=system, weight=weight, topic=topic, diff=diff,
        subject=subject, takeaway=take, citation=cite, scenario=scenario, question=question,
        correct=correct, wrongs=wrongs,
    ))

# pharmacology and pathology, gaps: pharm, blood, renal, GI, neuro, msk
pairs = [
(31,"f","behavioral-nervous",12,"subdural",2,"pathology","A subdural hematoma comes from bridging veins and spreads in a crescent that can cross suture lines.","Standard trauma correlation, AANS review 2020.",70,"has a gradual headache a week after a fall, and CT shows a crescent collection.",
 "Which vessel class bled?",
 W("Bridging veins", "A subdural hematoma comes from bridging veins and spreads in a crescent that can cross suture lines. The slow course fits venous bleeding, not the artery that makes an epidural lens."),
 [W("The middle meningeal artery", "That artery makes the lens-shaped epidural collection."),
  W("The anterior spinal artery", "That vessel is not the source of a cranial crescent."),
  W("A scalp arteriole only", "The collection is inside the skull."),
  W("The choroid plexus", "The plexus makes CSF, not this hematoma.")]),
(32,"m","behavioral-nervous",12,"lithium-di",3,"pharmacology","Lithium causes nephrogenic diabetes insipidus by resisting antidiuretic hormone in the collecting duct.","FDA prescribing information for lithium, 2024.",42,"takes lithium and now makes 5 liters of dilute urine a day. Serum sodium is 150 mEq/L.",
 "Where does the water loss come from?",
 W("Collecting ducts that no longer respond to antidiuretic hormone", "Lithium causes nephrogenic diabetes insipidus by resisting antidiuretic hormone in the collecting duct. The urine is dilute despite a high sodium, so the kidney is the problem."),
 [W("Too much antidiuretic hormone from the pituitary", "Too much hormone would concentrate the urine."),
  W("A loop-diuretic effect on the thick ascending limb", "The volume is from water, not the loop cotransporter."),
  W("Osmotic diuresis from glucose", "No glucose is described."),
  W("Primary polydipsia with a low sodium", "Sodium is high, which is the opposite of water overload.")]),
(33,"f","behavioral-nervous",12,"maoi-tyramine",3,"pharmacology","Monoamine oxidase inhibitors plus tyramine can cause a hypertensive crisis because dietary amines are not broken down.","FDA prescribing information for phenelzine, 2024.",45,"takes phenelzine and eats aged cheese. Blood pressure rises to 210/120 mm Hg with a severe headache.",
 "Why did the pressure rise?",
 W("Tyramine was not degraded and released stored catecholamines", "Monoamine oxidase inhibitors plus tyramine can cause a hypertensive crisis because dietary amines are not broken down. Aged cheese is a classic source."),
 [W("The cheese blocked intestinal salt absorption", "Salt absorption is not the acute crisis."),
  W("Phenelzine is a direct vasodilator", "The crisis is hypertension, not dilation."),
  W("Tyramine lowers serotonin only", "The emergency is blood pressure."),
  W("The drug inhibits acetylcholinesterase", "That is a different enzyme.")]),
(34,"m","behavioral-nervous",12,"ssri-siadh",3,"pharmacology","SSRIs can cause the syndrome of inappropriate antidiuretic hormone, especially in older adults, with low sodium and concentrated urine.","FDA prescribing information for sertraline, 2024.",78,"starts sertraline and a week later has sodium 122 mEq/L with urine osmolality 500 mOsm/kg. He is euvolemic.",
 "Which water problem is this?",
 W("Too much antidiuretic hormone effect, so water is retained", "SSRIs can cause the syndrome of inappropriate antidiuretic hormone, especially in older adults, with low sodium and concentrated urine. Euvolemia and a concentrated urine fit. Dehydration would show a low urine output pattern of a different kind."),
 [W("Diabetes insipidus, because the sodium is low", "Diabetes insipidus makes dilute urine and usually a high sodium."),
  W("Heart failure, because every low sodium is edematous", "He is euvolemic."),
  W("Salt loss from a loop diuretic he is not taking", "No diuretic is described."),
  W("Laboratory error, because SSRIs cannot touch sodium", "Hyponatremia is a labeled risk.")]),
(35,"f","behavioral-nervous",12,"bupropion",2,"pharmacology","Bupropion lowers the seizure threshold and is avoided in bulimia and in seizure disorders.","FDA prescribing information for bupropion, 2024.",27,"has bulimia with purging and asks for bupropion for low mood. She has no other antidepressant on board.",
 "Why is bupropion a poor choice?",
 W("The eating disorder raises seizure risk on this drug", "Bupropion lowers the seizure threshold and is avoided in bulimia and in seizure disorders. Purging is the contraindication, not a reason to prefer the drug."),
 [W("Bupropion is the preferred drug in bulimia", "Bulimia is a contraindication."),
  W("The drug is an MAOI and cannot be used with cheese only", "It is not an MAOI."),
  W("It causes nephrogenic diabetes insipidus", "That is a lithium effect."),
  W("It is unsafe only after age 75", "The contraindication is the eating disorder, at any adult age.")]),
(36,"m","behavioral-nervous",12,"valproate",3,"pharmacology","Valproate is teratogenic, including neural-tube defects, and is avoided when pregnancy is possible.","FDA prescribing information for valproate, 2024.",24,"has epilepsy and a partner, and wants to conceive soon. A plan keeps valproate as the only antiseizure drug.",
 "Which fetal risk is specific to staying on valproate?",
 W("Neural-tube defects", "Valproate is teratogenic, including neural-tube defects, and is avoided when pregnancy is possible. The regimen should change before conception, not after organ formation."),
 [W("No fetal risk, because antiseizure drugs are interchangeable in pregnancy", "Valproate is one of the higher-risk drugs."),
  W("Ebstein anomaly as the valproate lesion", "Ebstein anomaly is the lithium association."),
  W("Fetal goiter", "That is an iodine or antithyroid concern."),
  W("Neonatal opioid withdrawal", "Valproate is not an opioid.")]),
(37,"f","behavioral-nervous",12,"lamotrigine",2,"pharmacology","Lamotrigine is titrated slowly because a fast start raises the risk of Stevens-Johnson syndrome.","FDA prescribing information for lamotrigine, 2024.",22,"is prescribed lamotrigine and told to take the full target dose on night 1. She has no rash yet.",
 "Why is night-1 full dosing unsafe?",
 W("A rapid start increases serious rash", "Lamotrigine is titrated slowly because a fast start raises the risk of Stevens-Johnson syndrome. The target dose is reached over weeks, not on night 1."),
 [W("The drug causes hypertensive crisis if started slowly", "The hazard of a fast start is rash, not pressure."),
  W("Full dosing on night 1 prevents rash", "The direction is the opposite."),
  W("The drug is renally toxic only at low doses", "The labeled early risk is skin."),
  W("Titration is required only after age 65", "The rash risk applies to younger adults too.")]),
(38,"m","behavioral-nervous",12,"phenytoin",2,"pharmacology","Phenytoin has zero-order kinetics near the therapeutic range, so a small dose increase can cause a large level jump.","FDA prescribing information for phenytoin, 2024.",40,"has a phenytoin level of 18 mcg/mL. The dose is doubled. He then develops nystagmus and ataxia.",
 "Why did a dose doubling overshoot?",
 W("Enzymes were already saturated, so the level rose out of proportion", "Phenytoin has zero-order kinetics near the therapeutic range, so a small dose increase can cause a large level jump. Nystagmus and ataxia are toxicity. Linear kinetics would not jump like this."),
 [W("The drug induces its own total clearance without a ceiling", "At this range the elimination is saturable."),
  W("Nystagmus means the level fell to zero", "Toxicity signs mean the level rose."),
  W("Ataxia is an allergic interstitial nephritis", "The timing and the level point to concentration toxicity."),
  W("Doubling is always safe because the half-life is 20 minutes", "The half-life lengthens as enzymes saturate.")]),
]

for row in pairs:
    R(*row)

ITEMS = ROWS

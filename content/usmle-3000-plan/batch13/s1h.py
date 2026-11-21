"""Step 1 items 91-100."""

from lib import item

def W(a, b):
    return (a, b)

ITEMS = []
C = "FDA prescribing information, 2024 labels, for the named drug's mechanism."

def R(n, sex, system, weight, topic, diff, subject, take, cite, age, fact, question, correct, wrongs):
    who = "man" if sex == "m" else "woman"
    pro = "He" if sex == "m" else "She"
    scenario = f"A {age}-year-old {who} {fact} {pro} is here so the mechanism can be named."
    ITEMS.append(item(n, "step1", sex=sex, system=system, weight=weight, topic=topic, diff=diff, subject=subject, takeaway=take, citation=cite, scenario=scenario, question=question, correct=correct, wrongs=wrongs))

for row in [
(91,"m","respiratory-renal",13,"aminoglycoside",2,"pharmacology","Aminoglycosides cause kidney injury and hearing loss, and the class can worsen neuromuscular blockade.",C,70,"receives gentamicin. Creatinine rises and he notices trouble hearing high tones.",
 "Which pair of toxicities fits gentamicin?",
 W("Kidney and hearing", "Aminoglycosides cause kidney injury and hearing loss, and the class can worsen neuromuscular blockade. A rising creatinine plus high-tone hearing loss is that pair."),
 [W("Liver and retina", "Those are not the aminoglycoside pair."),
  W("Tendon and cartilage", "That pattern is a fluoroquinolone."),
  W("Only the lung, because surfactant activates the drug", "Surfactant inactivation is daptomycin."),
  W("No organ toxicity if the creatinine was normal at the start", "Toxicity can appear during the course.")]),
(92,"f","blood-lymph-immune",11,"amox-ebv",2,"pharmacology","A rash after amoxicillin in acute mononucleosis is usually a drug-virus interaction, not a lifelong penicillin allergy.",C,19,"has fever, sore throat, and posterior cervical nodes. Amoxicillin is given and a diffuse rash appears. Heterophile antibody is positive.",
 "How should the rash be interpreted?",
 W("A mononucleosis-associated rash, not an automatic lifelong penicillin allergy", "A rash after amoxicillin in acute mononucleosis is usually a drug-virus interaction, not a lifelong penicillin allergy. The heterophile test supports the virus. Labeling her allergic forever would be the mistake."),
 [W("Anaphylaxis, so penicillin is banned for life even without airway symptoms", "A diffuse rash without anaphylaxis in this virus is the interaction."),
  W("Measles, because every amoxicillin rash is measles", "The heterophile test points to mononucleosis."),
  W("Stevens-Johnson syndrome from day-1 spotted rash alone", "The classic mono rash is not that syndrome."),
  W("Proof that the antibiotic cured a bacterial pharyngitis", "The rash is not a sign of cure.")]),
(93,"m","gastrointestinal",8,"metronidazole-alcohol",2,"pharmacology","Metronidazole can cause a disulfiram-like reaction with alcohol, with flushing and vomiting.",C,44,"takes metronidazole and drinks alcohol. He flushes and vomits.",
 "Which interaction is this?",
 W("A disulfiram-like reaction", "Metronidazole can cause a disulfiram-like reaction with alcohol, with flushing and vomiting. The alcohol was the second exposure."),
 [W("Serotonin syndrome", "There is no serotonergic pair here."),
  W("A hypertensive crisis from tyramine", "The trigger was alcohol, and the symptoms are flushing and vomiting."),
  W("Hemolysis from G6PD", "Flushing and vomiting are not bite-cell hemolysis."),
  W("No interaction. Alcohol always does this on antibiotics", "This antibiotic is the one with the reaction.")]),
(94,"f","behavioral-nervous",12,"sildenafil-pde",2,"pharmacology","Sildenafil inhibits phosphodiesterase-5, so cyclic GMP stays up and vessels dilate. A nitrate plus this drug can drop the blood pressure severely.",C,63,"uses sildenafil and is offered a nitrate for chest pain an hour later.",
 "Which enzyme does sildenafil inhibit?",
 W("Phosphodiesterase-5", "Sildenafil inhibits phosphodiesterase-5, so cyclic GMP stays up and vessels dilate. A nitrate plus this drug can drop the blood pressure severely. The nitrate should not be given in this window."),
 [W("Phosphodiesterase in platelets as COX", "COX is not phosphodiesterase-5."),
  W("Acetylcholinesterase", "That would be a cholinergic crisis pattern."),
  W("Monoamine oxidase", "That is a different interaction, with tyramine or an SSRI."),
  W("Xanthine oxidase", "That is allopurinol.")]),
(95,"m","reproductive-endocrine",14,"finasteride",2,"pharmacology","Finasteride inhibits 5-alpha reductase, so testosterone is not converted to dihydrotestosterone.",C,67,"takes finasteride for prostate symptoms. Dihydrotestosterone falls.",
 "Which enzyme is inhibited?",
 W("5-alpha reductase", "Finasteride inhibits 5-alpha reductase, so testosterone is not converted to dihydrotestosterone. The prostate effect depends on that more potent androgen."),
 [W("Aromatase", "Aromatase makes estrogen."),
  W("Thyroid peroxidase", "That is methimazole."),
  W("21-hydroxylase", "That enzyme is in cortisol synthesis."),
  W("Xanthine oxidase", "That is allopurinol.")]),
(96,"f","reproductive-endocrine",14,"tamoxifen",3,"pharmacology","Tamoxifen blocks estrogen receptors in the breast and stimulates uterine tissue, so endometrial proliferation is a risk.",C,61,"takes tamoxifen after breast cancer. She has new vaginal bleeding.",
 "Why can the uterus bleed on a breast anti-estrogen?",
 W("The drug is an agonist in the uterus", "Tamoxifen blocks estrogen receptors in the breast and stimulates uterine tissue, so endometrial proliferation is a risk. Bleeding needs evaluation. The breast effect and the uterine effect are opposite."),
 [W("The drug blocks estrogen in every tissue", "The uterus is stimulated."),
  W("Bleeding means the breast cancer is cured and can be ignored", "Bleeding is a uterine warning."),
  W("It inhibits 5-alpha reductase", "That is finasteride."),
  W("It is a progestin-only contraceptive", "It is a selective estrogen-receptor modulator.")]),
(97,"m","msk-skin",10,"gentamicin-block",3,"pharmacology","Aminoglycosides can prolong neuromuscular blockade, especially with a blocker or myasthenia.",C,66,"with myasthenia receives gentamicin and becomes much weaker, with poor inspiratory effort.",
 "Which interaction deepened the weakness?",
 W("The antibiotic impaired neuromuscular transmission", "Aminoglycosides can prolong neuromuscular blockade, especially with a blocker or myasthenia. Poor inspiratory effort is the danger. The antibiotic is the added hit at the junction."),
 [W("Gentamicin strengthens the neuromuscular junction", "It can weaken transmission."),
  W("The weakness is optic neuropathy", "Breathing weakness is not an optic-nerve sign."),
  W("Myasthenia protects against this antibiotic", "Myasthenia is a reason for extra caution."),
  W("The drug only affects hearing, never strength", "Hearing loss is one toxicity. The junction is another.")]),
(98,"f","gastrointestinal",8,"cholestyramine",2,"pharmacology","Bile-acid resins bind other drugs in the gut, so those drugs should not be taken at the same time.",C,59,"takes cholestyramine with levothyroxine in one swallow. TSH later rises.",
 "Why did the thyroid hormone fail?",
 W("The resin bound it in the intestine", "Bile-acid resins bind other drugs in the gut, so those drugs should not be taken at the same time. The TSH rise means less hormone was absorbed."),
 [W("The resin induces CYP3A4", "The interaction is binding, not induction."),
  W("Cholestyramine is a thyroid hormone", "It is a resin."),
  W("Taking both together increases hormone absorption", "Binding decreases absorption."),
  W("TSH rises only when the resin is skipped", "The problem was taking both at once.")]),
(99,"m","behavioral-nervous",12,"vm-block-mg",2,"pathology","Myasthenia gravis antibodies attack the postsynaptic acetylcholine receptor, so strength fades with use.",C,28,"has drooping eyelids that worsen through the day. Antibodies to the acetylcholine receptor are positive.",
 "Where is the lesion?",
 W("The postsynaptic receptor at the neuromuscular junction", "Myasthenia gravis antibodies attack the postsynaptic acetylcholine receptor, so strength fades with use. Worsening through the day is fatigable weakness."),
 [W("The presynaptic calcium channel, as in Lambert-Eaton syndrome", "That syndrome often improves with repeated use and is linked to a different antibody."),
  W("The myelin of peripheral nerves", "Myelin loss is a neuropathy, not this fatigable ocular pattern."),
  W("The striatal dopamine neuron", "That is Parkinson disease."),
  W("The muscle ryanodine receptor", "That is malignant hyperthermia.")]),
(100,"f","respiratory-renal",13,"light-ldh",2,"physiology","An LDH ratio of pleural fluid to serum above 0.6 supports an exudate even when the story is otherwise unclear.", "ATS pleural review using Light criteria, 2018.",62,"has pleural fluid LDH 400 U/L and serum LDH 500 U/L. She asks whether the LDH ratio alone can show an exudate.",
 "What does this LDH ratio show?",
 W("An exudate, because 400 divided by 500 is 0.8, which is above 0.6", "An LDH ratio of pleural fluid to serum above 0.6 supports an exudate even when the story is otherwise unclear. 0.8 clears that bar."),
 [W("A transudate, because the ratio is under 1", "The cutoff is 0.6, not 1."),
  W("An exudate only if the ratio is under 0.4", "Under 0.6 would not meet the LDH rule."),
  W("LDH cannot be used without a cell count", "The ratio is one of the criteria by itself."),
  W("A ratio of 0.8 is impossible", "400 over 500 is 0.8.")]),
]:
    R(*row)

def R(*row):
    n, sex, system, weight, topic, diff, subject, take, cite, age, fact, question, correct, wrongs = row
    who = "man" if sex == "m" else "woman"
    pro = "He" if sex == "m" else "She"
    scenario = f"A {age}-year-old {who} {fact} {pro} is here so the mechanism can be named."
    ITEMS.append(item(n, "step1", sex=sex, system=system, weight=weight, topic=topic, diff=diff, subject=subject, takeaway=take, citation=cite, scenario=scenario, question=question, correct=correct, wrongs=wrongs))

"""Additional Step 1 nervous-system items."""

ITEMS = []


def add(topic, diff, scenario, question, options, key, expl, ref, subject="neurology"):
    assert key in options and len(options) == 5
    ITEMS.append(
        {
            "blueprintDomain": "behavioral-nervous",
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
    "Myasthenia versus Lambert-Eaton",
    5,
    "A 58-year-old man who smokes has trouble rising from a chair that gets a little easier as he keeps trying. His mouth is dry, and reflexes are reduced. Strength improves after he exercises the limb for a few seconds. A second patient, a young woman, has ptosis that is worse at the end of the day and gets worse, not better, with repeated use. Chest imaging in the man shows a hilar mass.",
    "Which receptors and which tumor association fit the man rather than the woman?",
    [
        "Presynaptic P/Q voltage-gated calcium channels, associated with small-cell lung cancer",
        "Postsynaptic acetylcholine receptors, associated with a thymoma",
        "Muscle ryanodine receptors, associated with malignant hyperthermia",
        "Sodium channels on peripheral nerve, associated with multiple sclerosis",
        "Nicotinic receptors at autonomic ganglia only, with no skeletal-muscle effect",
    ],
    "Presynaptic P/Q voltage-gated calcium channels, associated with small-cell lung cancer",
    "Lambert-Eaton is a presynaptic attack on voltage-gated calcium channels, so less acetylcholine is released. Repeated use can temporarily improve strength, reflexes are down, and autonomic dryness is common. Small-cell lung cancer is the classic paraneoplastic source. The young woman has myasthenia gravis: postsynaptic acetylcholine-receptor antibodies, fatigable weakness that worsens with use, and a thymoma association, not a smoker’s hilar mass. Ryanodine receptors are the malignant-hyperthermia muscle channel, not this pattern. Multiple sclerosis is central demyelination, not a neuromuscular junction that improves with repetition. Autonomic ganglia alone would not explain the skeletal-muscle facilitation.",
    "katzung-16",
)

add(
    "Botulism versus myasthenia",
    5,
    "A 34-year-old woman has descending weakness, double vision, and dilated pupils that react poorly. Sensation is normal. She canned vegetables last week and a friend who ate the same food is ill. There is no fatiguing ptosis that worsens only late in the day and no thymic mass.",
    "Where does the toxin act, and which finding separates this from myasthenia?",
    [
        "It prevents acetylcholine release from the presynaptic terminal; pupils are involved, unlike myasthenia",
        "It blocks postsynaptic acetylcholine receptors; pupils are spared, as in myasthenia",
        "It destroys anterior horn cells, so sensation is lost in a stocking pattern",
        "It demyelinates peripheral nerves, so a spinal tap shows high protein and no cells",
        "It inhibits acetylcholinesterase, so pupils constrict and secretions pour out",
    ],
    "It prevents acetylcholine release from the presynaptic terminal; pupils are involved, unlike myasthenia",
    "Botulinum toxin cleaves SNARE proteins and blocks acetylcholine release. The illness is descending, and because autonomic synapses are also cholinergic, pupils dilate. That pupillary involvement is the board separator from myasthenia gravis, which spares the pupil. A postsynaptic receptor block is myasthenia, and that option also gets the pupil wrong. Anterior horn-cell loss is polio or ALS and does not start with poorly reactive pupils after home canning. Albuminocytologic dissociation is Guillain-Barré, usually ascending after an infection. Acetylcholinesterase inhibition is organophosphate poisoning, which constricts pupils.",
    "katzung-16",
)

add(
    "Organophosphate poisoning",
    5,
    "A 40-year-old farm worker is wet with insecticide. He has pinpoint pupils, diarrhea, vomiting, bradycardia, wheezing, and fasciculations with weakness. He is given a large dose of atropine. The secretions dry and the heart rate rises, but he remains weak and still fasciculates.",
    "Why did atropine not fix the weakness, and what should be added?",
    [
        "Atropine blocks muscarinic receptors only; pralidoxime regenerates acetylcholinesterase at nicotinic sites if given before aging",
        "Atropine blocks nicotinic receptors, so weakness means the dose was too small",
        "Pralidoxime is a muscarinic agonist and would worsen secretions",
        "The weakness is a benzodiazepine-deficiency state and is treated with flumazenil",
        "Succinylcholine will outcompete the toxin at the neuromuscular junction",
    ],
    "Atropine blocks muscarinic receptors only; pralidoxime regenerates acetylcholinesterase at nicotinic sites if given before aging",
    "Organophosphates phosphorylate acetylcholinesterase. Atropine competes at muscarinic receptors, so it dries secretions and raises heart rate, but skeletal muscle and ganglia use nicotinic receptors, which atropine does not block. Pralidoxime pulls the phosphate off the enzyme if aging has not locked it. Saying atropine is nicotinic reverses the pharmacology and would make you keep giving atropine for paralysis it cannot fix. Pralidoxime is not a muscarinic agonist. Flumazenil reverses benzodiazepines and is irrelevant and unsafe here. Succinylcholine is a depolarizing blocker and would add paralysis, not restore acetylcholine breakdown.",
    "katzung-16",
)

add(
    "Local anesthetic failure in abscess",
    4,
    "A dentist injects lidocaine around an acidic dental abscess. The patient still feels the incision. The same dose works well on healthy tissue nearby. The student proposes a larger dose of a permanently charged anesthetic because 'infected tissue needs a drug that is already ionized.'",
    "Why did the anesthetic fail, and why is a permanently charged drug worse?",
    [
        "In acid the drug is protonated and cannot cross the membrane to reach the inner sodium-channel site; a permanently charged drug cannot enter from outside",
        "Infection induces CYP3A4 in the gum and clears lidocaine in seconds",
        "Sodium channels in infected tissue open only from the outside, so the charged form works better",
        "Lidocaine blocks potassium channels, which are closed by acid",
        "The abscess is ischemic, so a charged drug is required to bind the outside of the channel",
    ],
    "In acid the drug is protonated and cannot cross the membrane to reach the inner sodium-channel site; a permanently charged drug cannot enter from outside",
    "Local anesthetics are weak bases. They must be uncharged to cross the membrane, then become charged inside to block the sodium channel from the axoplasm. Pus is acidic, so the drug stays charged outside and never reaches the site. A permanently charged analog cannot cross either, which is why that suggestion fails. Gingival CYP induction is not the mechanism of a failed block. The binding site is on the inside, not the outside. Lidocaine’s local-anesthetic action is sodium-channel block, not potassium-channel block. Ischemia does not create a requirement for an extracellular charged drug.",
    "katzung-16",
)

add(
    "Parkinson direct and indirect pathways",
    5,
    "A 67-year-old man has a resting tremor, rigidity, and slow steps. Substantia nigra compacta neurons are lost. A teaching slide asks what that loss does to the two striatal pathways and why a D2 blocker would make him worse.",
    "Which statement is right?",
    [
        "Less nigral dopamine removes facilitation of the direct (D1) pathway and removes inhibition of the indirect (D2) pathway, so the thalamus is over-inhibited; a D2 blocker worsens that",
        "Dopamine loss turns the direct pathway up, so movements become large and dancing",
        "The subthalamic nucleus dies first, which is why tremor starts",
        "D2 receptors excite the direct pathway, so a blocker increases movement",
        "The striatum releases more acetylcholine because dopamine loss destroys cholinergic interneurons",
    ],
    "Less nigral dopamine removes facilitation of the direct (D1) pathway and removes inhibition of the indirect (D2) pathway, so the thalamus is over-inhibited; a D2 blocker worsens that",
    "Nigral dopamine normally turns up the direct pathway through D1 and turns down the indirect pathway through D2. Losing it does both, and both changes increase inhibition of the thalamus, so movement shrinks. A D2 blocker imitates that indirect-pathway problem and worsens parkinsonism. The direct pathway is underactive, not overactive; overactivity of movement is the Huntington or hemiballismus direction. The subthalamic nucleus is the lesion of hemiballismus, not the first loss in Parkinson disease. D2 receptors are on the indirect pathway and are inhibitory there. Cholinergic interneurons are relatively overactive, not destroyed; that is why antimuscarinic drugs can help tremor.",
    "katzung-16",
)

add(
    "Huntington versus hemiballismus",
    4,
    "A 38-year-old man has choreiform movements and a father who died with the same illness in his fifties. Caudate atrophy is marked. A different patient has wild flinging of one arm that began the day after a small deep stroke.",
    "Which nuclei fit, and what does anticipation imply for the first patient?",
    [
        "Caudate loss from a CAG repeat that expands in successive generations; contralateral subthalamic nucleus for the flinging arm",
        "Subthalamic nucleus for the hereditary chorea; caudate for the acute one-limb fling",
        "Substantia nigra for both, because both are hypokinetic",
        "Cerebellar hemisphere for the chorea, because CAG diseases are all spinocerebellar",
        "Bilateral subthalamic nuclei for a disease that gets worse in the children",
    ],
    "Caudate loss from a CAG repeat that expands in successive generations; contralateral subthalamic nucleus for the flinging arm",
    "Huntington disease is an autosomal dominant CAG expansion in huntingtin. Anticipation, earlier and worse disease in the next generation, follows further expansion, often in spermatogenesis, which fits a father-to-child story. The caudate is lost and movements are extra, not missing. Hemiballismus is an acute contralateral subthalamic lesion, classically a lacunar stroke, and it is one limb, not a family disease. Swapping the nuclei is the usual miss. Both are hyperkinetic, so substantia nigra loss, which is hypokinetic, does not fit. Not every CAG disease is cerebellar. Bilateral subthalamic damage is not the Huntington mechanism.",
    "robbins-10",
)

add(
    "Wilson disease mechanism",
    4,
    "A 19-year-old man has a new tremor, depressed mood, and mild liver-enzyme elevation. Slit lamp shows a brown-green ring at the corneal rim. Serum ceruloplasmin is low. A sibling was treated with a drug that chelates copper and another relative was kept on oral zinc after the liver recovered.",
    "Which protein failed, and why is zinc not the initial chelator?",
    [
        "ATP7B cannot excrete copper into bile or attach it to ceruloplasmin; zinc blocks gut absorption and is maintenance, not the drug that removes a large copper load",
        "ATP7A failed, the same protein as Menkes disease, so hair is kinky and the liver is spared",
        "Ferroportin failed, so the ring is iron and the treatment is deferoxamine",
        "Ceruloplasmin itself is the mutated enzyme, so chelation cannot help",
        "Alpha-1 antitrypsin failed, which deposits copper in the basal ganglia",
    ],
    "ATP7B cannot excrete copper into bile or attach it to ceruloplasmin; zinc blocks gut absorption and is maintenance, not the drug that removes a large copper load",
    "Wilson disease is hepatic ATP7B failure. Copper is not excreted in bile and is not loaded onto ceruloplasmin, so serum ceruloplasmin is low, a Kayser-Fleischer ring forms, and the basal ganglia and liver fill with copper. A chelator such as trientine or penicillamine removes stored copper. Zinc induces metallothionein in the gut and reduces absorption; it maintains a treated patient and does not empty a large existing load. ATP7A is Menkes disease, an uptake problem with kinky hair and deficiency, not hepatic overload. Ferroportin and deferoxamine are iron. The ceruloplasmin level is low because copper is not incorporated; the gene is ATP7B, not the ceruloplasmin gene. Alpha-1 antitrypsin lung and liver disease does not make a copper ring.",
    "robbins-10",
)

add(
    "B12 versus folate",
    5,
    "A 71-year-old woman has a macrocytic anemia and numbness in both feet. Vibration is gone at the toes and the gait is unsteady with eyes closed. Methylmalonic acid is high and homocysteine is high. She has been taking folic acid, and the anemia improved for a month while the numbness worsened.",
    "Why did folate help the blood count and hurt the neurologic choice?",
    [
        "Folate bypasses the megaloblastic block in marrow but does not repair the B12-dependent methylmalonyl-CoA mutase pathway in myelin",
        "Folate replaces B12 as the cofactor for methylmalonyl-CoA mutase",
        "High methylmalonic acid means folate deficiency, so more folate is the specific fix",
        "The dorsal columns are spared in B12 deficiency, so the numbness is diabetic and unrelated",
        "Folate deficiency raises methylmalonic acid and B12 deficiency raises only homocysteine",
    ],
    "Folate bypasses the megaloblastic block in marrow but does not repair the B12-dependent methylmalonyl-CoA mutase pathway in myelin",
    "B12 is required for methionine synthase and for methylmalonyl-CoA mutase. Folate can feed the marrow methylation cycle enough to improve the anemia, which hides the diagnosis, but it does nothing for the mutase reaction. Myelin injury continues, which is the subacute combined degeneration of dorsal columns and corticospinal tracts. Folate is not a mutase cofactor. High methylmalonic acid points to B12, not folate. Dorsal columns are exactly what B12 deficiency hits. The lab split is the opposite of the last option: both deficiencies raise homocysteine, and only B12 raises methylmalonic acid.",
    "robbins-10",
)

add(
    "Thiamine before glucose",
    4,
    "A 55-year-old man with alcohol use disorder is brought in confused, with nystagmus and a wide gait. A nurse is about to infuse a liter of dextrose because the fingerstick is borderline. He has not received vitamins.",
    "What can glucose administration do before thiamine, and which structures are at risk?",
    [
        "Glucose drives thiamine-dependent pyruvate dehydrogenase and can precipitate Wernicke injury in the mammillary bodies and periaqueductal gray",
        "Glucose binds GABA and causes immediate respiratory arrest unrelated to vitamins",
        "Thiamine is required only for heme synthesis, so the risk is acute porphyria",
        "The mammillary bodies are injured by folate deficiency, not thiamine",
        "Dextrose is safe because Wernicke disease is a glucose-excess state already",
    ],
    "Glucose drives thiamine-dependent pyruvate dehydrogenase and can precipitate Wernicke injury in the mammillary bodies and periaqueductal gray",
    "Thiamine is the cofactor for pyruvate dehydrogenase and transketolase. A glucose load increases flux through those enzymes and can exhaust the last thiamine, worsening Wernicke encephalopathy. The vulnerable zones are the mammillary bodies, medial thalamus, and periaqueductal gray, which matches confusion, eye-movement change, and ataxia. Glucose does not bind GABA. Acute porphyria is an ALA synthase problem, not this triad. Folate deficiency does not target the mammillary bodies. He is thiamine-poor, not glucose-toxic; the danger is giving sugar first.",
    "katzung-16",
)

add(
    "Osmotic demyelination",
    5,
    "A 49-year-old woman with chronic hyponatremia from a thiazide has sodium corrected from 112 to 138 mmol/L over 12 hours because she seized once. Two days later she is quadriparetic and cannot speak clearly, but she seems aware. MRI shows a central pontine lesion. The seizure has stopped.",
    "What happened, and what pace would have avoided it?",
    [
        "Rapid rise in serum osmolality stripped myelin from the basis pontis; chronic hyponatremia should be corrected slowly, often near 8 mmol/L in 24 hours or less in high-risk patients",
        "The pontine lesion is an infarct from the seizure, and any sodium goal is safe",
        "Too-slow correction caused the demyelination",
        "The lesion is central pontine myelinolysis from low sodium itself, independent of the correction rate",
        "This is Wernicke encephalopathy, and the MRI lesion is the mammillary body",
    ],
    "Rapid rise in serum osmolality stripped myelin from the basis pontis; chronic hyponatremia should be corrected slowly, often near 8 mmol/L in 24 hours or less in high-risk patients",
    "Oligodendrocytes in a chronically hyponatremic brain have adjusted. A fast osmotic rise pulls water out and demyelinates the central pons, so the patient is locked in or quadriparetic while awareness remains. The correction here, 26 mmol/L in half a day, is far above a cautious limit. A seizure does not infarct the center of the pons in this pattern. Slow correction does not cause osmotic demyelination; the risk of slow correction is ongoing severe hyponatremia, which is a different problem. The low sodium alone did not make this delayed lesion; the jump did. Mammillary bodies are Wernicke disease, not a central pontine T2 lesion after a sodium spike.",
    "guyton-14",
)

add(
    "SIADH versus diabetes insipidus",
    4,
    "After pituitary surgery, patient A has high urine output, low urine osmolality, rising serum sodium, and thirst. Patient B, with a small-cell lung cancer, has low serum sodium, high urine sodium, concentrated urine, and a normal volume status without edema.",
    "Which ADH states fit?",
    [
        "A lacks ADH effect, so water is lost and sodium rises; B has too much ADH, so water is retained and sodium falls while urine stays concentrated",
        "Both have too much ADH; the only difference is oral intake",
        "A has SIADH because urine output is high; B has diabetes insipidus because sodium is low",
        "B should be given normal saline as the primary treatment because he is volume depleted",
        "Desmopressin would worsen patient A and fix patient B",
    ],
    "A lacks ADH effect, so water is lost and sodium rises; B has too much ADH, so water is retained and sodium falls while urine stays concentrated",
    "Central diabetes insipidus after pituitary surgery is absent ADH. The kidney cannot concentrate, urine is dilute, water leaves, and serum sodium rises. SIADH from small-cell cancer is the opposite: ADH is high, urine is inappropriately concentrated, and water retention drops the serum sodium in a clinically euvolemic patient. Calling both 'too much ADH' misses the sodium direction. High urine output is diabetes insipidus, not SIADH, and a low sodium with concentrated urine is SIADH, not diabetes insipidus. SIADH is treated with fluid restriction, not a saline bolus as if the patient were dry; saline can worsen the sodium if the urine is very concentrated. Desmopressin replaces ADH and helps central diabetes insipidus; it would worsen SIADH.",
    "guyton-14",
)

add(
    "Absence seizure drug",
    4,
    "A 9-year-old girl stops talking for a few seconds many times an hour, then resumes as if nothing happened. There is no fall and no postictal confusion. EEG shows 3 Hz spike-and-wave. A relative with focal seizures was helped by carbamazepine, and the family asks for the same drug.",
    "Which channel is the right target, and why is carbamazepine a poor choice?",
    [
        "Thalamic T-type calcium channels, blocked by ethosuximide; carbamazepine can worsen absence",
        "Voltage-gated sodium channels only, so carbamazepine is first-line for 3 Hz spike-and-wave",
        "GABA-B receptors, blocked by baclofen, which stops absence",
        "NMDA receptors, blocked by ketamine as outpatient therapy",
        "The same sodium channel as phenytoin, because all childhood seizures share one mechanism",
    ],
    "Thalamic T-type calcium channels, blocked by ethosuximide; carbamazepine can worsen absence",
    "Childhood absence is a thalamocortical oscillation that depends on T-type calcium current. Ethosuximide blocks that current and is the narrow drug for pure absence. Carbamazepine and phenytoin, which are sodium-channel drugs useful for focal seizures, can aggravate absence, so the family history is a trap. Baclofen is a GABA-B agonist and can promote spike-and-wave, not treat it. Ketamine is not outpatient absence therapy. Not every childhood seizure uses the phenytoin mechanism; the EEG and the brief, nonconvulsive pauses are the clue to switch mechanisms.",
    "katzung-16",
)

add(
    "Benzodiazepine versus barbiturate",
    4,
    "A man in convulsive status epilepticus receives lorazepam and the seizures stop. A student asks how a benzodiazepine increases GABA effect compared with a barbiturate, and whether the benzodiazepine opens the channel by itself.",
    "Which pairing is correct?",
    [
        "Benzodiazepines increase how often the GABA-A channel opens when GABA is present; barbiturates lengthen each opening and can open the channel at high doses without GABA",
        "Benzodiazepines lengthen channel opening and work without GABA; barbiturates only increase frequency",
        "Both drugs block GABA-A, which is why they stop seizures",
        "Lorazepam acts on GABA-B receptors in the spinal cord, like baclofen",
        "Status epilepticus is treated first with a neuromuscular blocker because the brain activity has already stopped",
    ],
    "Benzodiazepines increase how often the GABA-A channel opens when GABA is present; barbiturates lengthen each opening and can open the channel at high doses without GABA",
    "Both drug classes facilitate GABA-A chloride channels, but the kinetics differ. Benzodiazepines need GABA and increase opening frequency. Barbiturates increase open duration and, at higher concentration, have direct agonist activity, which is one reason overdose is more depressant. Reversing frequency and duration is a standard miss. They do not block GABA; blocking GABA would cause seizures. Lorazepam is not a GABA-B drug; baclofen is. A paralytic stops the visible jerk but not the cortical seizure, so it is not the first treatment of status.",
    "katzung-16",
)

add(
    "Carbamazepine traps",
    5,
    "A 24-year-old man of Han Chinese ancestry is started on carbamazepine for focal seizures. Two weeks later he has a painful rash, fever, and a sodium of 124 mmol/L. He also takes a drug whose level has fallen because of a new enzyme inducer. HLA typing was not done.",
    "Which mechanisms sit in this one drug?",
    [
        "HLA-B*1502 raises Stevens-Johnson risk, the drug stimulates ADH-like water retention, and it induces CYP3A4",
        "HLA-B*5701 is the carbamazepine allele, and the drug inhibits CYP so other levels rise",
        "The rash is a dose-related histamine effect with no HLA link",
        "Hyponatremia means renal salt wasting from aldosterone blockade",
        "Carbamazepine closes T-type calcium channels and is first-line for absence",
    ],
    "HLA-B*1502 raises Stevens-Johnson risk, the drug stimulates ADH-like water retention, and it induces CYP3A4",
    "Carbamazepine is a sodium-channel antiseizure drug with three traps in this vignette. HLA-B*1502, enriched in some Asian ancestries, marks a high risk of Stevens-Johnson syndrome, so the allele is checked before starting. The drug can cause SIADH and hyponatremia. It induces CYP3A4, so other drug levels fall, not rise. HLA-B*5701 is the abacavir allele, and carbamazepine induces rather than inhibits CYP. The severe rash is immune and HLA-linked, not simple histamine. The low sodium is water retention, not aldosterone blockade. T-type calcium block is ethosuximide; carbamazepine can worsen absence.",
    "katzung-16",
)

add(
    "Valproate risks",
    4,
    "A 28-year-old woman of childbearing potential is put on valproate for a mixed seizure disorder and a mood label. She is not using contraception. A month later a toddler in the family, also given valproate, develops vomiting and high ammonia with a sick liver.",
    "Which two toxicities are the point of this drug, and which population is the liver risk?",
    [
        "Neural-tube defects if used in early pregnancy, and idiosyncratic hepatic failure that is most feared in very young children",
        "Gingival hyperplasia and fetal hydantoin face, the phenytoin pair",
        "Agranulocytosis and HLA-related rash, the carbamazepine pair",
        "Cartilage damage and permanent teeth staining in the toddler",
        "Pulmonary fibrosis, which is the reason it is avoided in pregnancy",
    ],
    "Neural-tube defects if used in early pregnancy, and idiosyncratic hepatic failure that is most feared in very young children",
    "Valproate is teratogenic and specifically raises neural-tube defect risk, so it is a poor default in a woman who may conceive. It also causes idiosyncratic hepatotoxicity, historically concentrated in young children on several antiseizure drugs. Gingival hyperplasia and the hydantoin face are phenytoin. Agranulocytosis and HLA rash point to carbamazepine or other drugs, not this pair. Tooth and cartilage toxicity is tetracycline. Pulmonary fibrosis is not the valproate pregnancy problem.",
    "katzung-16",
)

add(
    "Phenytoin kinetics",
    5,
    "A patient on phenytoin has a level of 12 mcg/mL and is still seizing, so the dose is doubled. A week later he is ataxic with nystagmus and a level of 28. He also has tender gums. His warfarin dose, started years ago while he was on phenytoin, had to be increased.",
    "Why did a doubled dose overshoot, and why did warfarin need a higher dose?",
    [
        "Phenytoin is zero-order near the therapeutic range, so small dose increases saturate metabolism; it also induces CYP enzymes that clear warfarin",
        "Phenytoin is purely first-order, so the level must exactly double",
        "Gum overgrowth means the level is subtherapeutic and the dose should rise again",
        "Phenytoin inhibits warfarin metabolism, so the INR would have been too high on a usual warfarin dose",
        "Nystagmus at a level of 28 means the assay is falsely high and the drug is not the cause",
    ],
    "Phenytoin is zero-order near the therapeutic range, so small dose increases saturate metabolism; it also induces CYP enzymes that clear warfarin",
    "Phenytoin hydroxylation saturates, so kinetics become zero-order in the usual range. Doubling the dose does not double the level; it can jump into toxicity, with nystagmus and ataxia. Chronic phenytoin induces CYP enzymes, so warfarin is cleared faster and needs a higher dose to keep the INR in range. First-order doubling is the calculation trap. Gingival hyperplasia is a chronic effect and is not a sign to push the level higher. The warfarin interaction of phenytoin is induction, not inhibition. A level of 28 with ataxia is real toxicity, not a false assay.",
    "katzung-16",
)

add(
    "Naloxone duration",
    4,
    "A man who injected a long-acting opioid is apneic with pinpoint pupils. Naloxone wakes him and his breathing returns. Ninety minutes later, after the team has relaxed, he is apneic again. The pupils had started to pinpoint once more.",
    "Why did he relapse, and what does that imply for monitoring?",
    [
        "Naloxone’s half-life is shorter than many opioids, so the antagonist wears off while agonist remains; he needs repeat dosing and observation",
        "Naloxone is an opioid agonist at high dose, so the second apnea is a new overdose of naloxone",
        "Pinpoint pupils mean a benzodiazepine, and flumazenil is now required",
        "The relapse proves naloxone does not bind the mu receptor",
        "Opioid apnea is treated with succinylcholine so the chest can be ventilated chemically",
    ],
    "Naloxone’s half-life is shorter than many opioids, so the antagonist wears off while agonist remains; he needs repeat dosing and observation",
    "Naloxone competitively blocks mu receptors and reverses apnea and miosis, but it is cleared faster than heroin, methadone, or many sustained-release opioids. Recurrence of apnea is expected if you give one dose and walk away. Naloxone is not an agonist; a second apnea is return of the opioid, not naloxone toxicity. Pinpoint pupils and apnea are opioid, not benzodiazepine; flumazenil is the wrong reversal and can seize. Relapse shows that the block was temporary, not that the drug misses the receptor. A paralytic does not treat the brainstem respiratory depression.",
    "katzung-16",
)

add(
    "Serotonin syndrome versus neuroleptic malignant syndrome",
    5,
    "Patient A started linezolid while still taking an SSRI and now has fever, clonus, hyperreflexia, and diarrhea over hours. Patient B has taken haloperidol for years, was given more after agitation, and over two days became rigid, mute, and hot, with a high creatine kinase and slow reflexes.",
    "Which mechanisms match?",
    [
        "A is excess serotonin-receptor activity with neuromuscular excitation; B is dopamine D2 blockade with lead-pipe rigidity and bradyreflexia",
        "Both are dopamine blockade; clonus is required for neuroleptic malignant syndrome",
        "A is malignant hyperthermia from succinylcholine; B is serotonin syndrome because it evolved over days",
        "B should be treated with cyproheptadine and A with dantrolene as the syndrome-specific first facts",
        "Linezolid has no serotonergic activity, so A cannot be serotonin syndrome",
    ],
    "A is excess serotonin-receptor activity with neuromuscular excitation; B is dopamine D2 blockade with lead-pipe rigidity and bradyreflexia",
    "Serotonin syndrome is fast, with clonus, hyperreflexia, and often gastrointestinal hyperactivity, after combining serotonergic drugs. Linezolid is a weak MAO inhibitor and is a classic partner to an SSRI. Neuroleptic malignant syndrome is slower, after dopamine blockade, with lead-pipe rigidity, bradyreflexia, and high creatine kinase. Clonus points away from NMS, not toward it. Malignant hyperthermia is a ryanodine-receptor crisis during anesthetics, not a linezolid interaction, and the time course of B is days, which fits NMS rather than serotonin syndrome. Cyproheptadine is a serotonin antagonist used in serotonin syndrome; dantrolene or a dopamine agonist is the NMS discussion. Swapping them ignores the reflex exam. Linezolid does have MAO inhibition.",
    "katzung-16",
)

add(
    "Tricyclic antidepressant overdose",
    5,
    "A 30-year-old woman is unconscious after taking her amitriptyline. The QRS is 160 ms, she just had a seizure, and the blood pressure is low. pH is 7.25. Charcoal is being considered, but the immediate cardiac problem is the wide QRS.",
    "What should be given for the QRS, and why?",
    [
        "Sodium bicarbonate; it raises extracellular sodium and pH, which reduces tricyclic binding to the cardiac fast sodium channel",
        "Physostigmine, because anticholinergic toxicity is reversed and the QRS narrows",
        "A class I antiarrhythmic such as procainamide, to stabilize the sodium channel further",
        "Flumazenil, because wide-complex tachycardia after a sedating drug is a benzodiazepine effect",
        "Calcium gluconate, the antidote for sodium-channel blocker QRS widening",
    ],
    "Sodium bicarbonate; it raises extracellular sodium and pH, which reduces tricyclic binding to the cardiac fast sodium channel",
    "Tricyclics block cardiac sodium channels, widen the QRS, and cause seizures and hypotension. Bicarbonate narrows the QRS by increasing the sodium gradient and by alkalinization, which decreases drug binding to the channel. Physostigmine can reverse delirium but can worsen conduction and seizures; it is not the QRS drug. Procainamide is another sodium-channel blocker and would widen the QRS further. Flumazenil does not bind cardiac sodium channels and can precipitate seizures. Calcium is the membrane stabilizer discussed for calcium-channel blocker or hyperkalemia physiology, not the specific fix for tricyclic sodium-channel block.",
    "katzung-16",
)

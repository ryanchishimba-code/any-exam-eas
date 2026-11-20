"""Rest of the Step 1 nervous-system and behavioral set."""

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
    "Lithium toxicity and teratogenicity",
    4,
    "A 33-year-old woman on lithium for bipolar disorder has a new tremor, is thirsty, and passes large amounts of dilute urine. She also takes ibuprofen for a sprain and started a thiazide last week. She asks whether lithium is a problem if she becomes pregnant. Creatinine has risen slightly.",
    "Which effects belong to lithium, and which drug change raised the level?",
    [
        "Nephrogenic diabetes insipidus and Ebstein anomaly; thiazides and NSAIDs reduce clearance and raise the level",
        "Central diabetes insipidus and neural-tube defects; ibuprofen lowers the lithium level",
        "Agranulocytosis and a flat facial philtrum, the valproate pattern",
        "Gingival hyperplasia and fetal hydantoin syndrome",
        "Serotonin syndrome as the chronic tremor, treated by raising the lithium dose",
    ],
    "Nephrogenic diabetes insipidus and Ebstein anomaly; thiazides and NSAIDs reduce clearance and raise the level",
    "Lithium enters principal cells through sodium channels and commonly causes nephrogenic diabetes insipidus, so urine is dilute and the patient is thirsty. In early pregnancy it is linked to Ebstein anomaly of the tricuspid valve. Thiazides cause volume contraction and more proximal lithium reabsorption, and NSAIDs reduce renal lithium clearance, so both raise the level. Central diabetes insipidus is an ADH problem, and the teratogen usually named with neural-tube defects is valproate, not lithium. Agranulocytosis is clozapine. Gum overgrowth is phenytoin. A coarse tremor with rising creatinine is toxicity, not a reason to increase the dose, and it is not serotonin syndrome.",
    "katzung-16",
    subject="psychiatry",
)

add(
    "Antipsychotic receptor split",
    4,
    "A man on haloperidol develops painful sustained twisting of the neck hours after a dose, and his prolactin is high. A second patient on the same drug class has a shuffling gait after months. Neither has fever or lead-pipe rigidity.",
    "Which pathways explain the neck, the prolactin, and the gait?",
    [
        "Nigrostriatal D2 block causes acute dystonia and later parkinsonism; tuberoinfundibular D2 block raises prolactin",
        "Mesolimbic D2 block causes dystonia; nigrostriatal block raises prolactin",
        "Tuberoinfundibular block causes the shuffling gait",
        "Muscarinic agonism causes acute dystonia, so benztropine would worsen it",
        "The neck spasm is neuroleptic malignant syndrome because it happened within hours",
    ],
    "Nigrostriatal D2 block causes acute dystonia and later parkinsonism; tuberoinfundibular D2 block raises prolactin",
    "Dopamine in the nigrostriatal tract suppresses unwanted muscle activity. Blocking D2 there causes acute dystonia and, later, drug-induced parkinsonism. Dopamine in the tuberoinfundibular tract inhibits prolactin, so blocking it raises prolactin. The mesolimbic tract is the one whose blockade is tied to antipsychotic effect, not to dystonia or galactorrhea. The shuffling gait is nigrostriatal, not tuberoinfundibular. Acute dystonia is treated with an antimuscarinic such as benztropine; calling the drug a muscarinic agonist reverses the fix. Hours-long neck twisting without fever and rigidity is dystonia, not neuroleptic malignant syndrome.",
    "katzung-16",
    subject="psychiatry",
)

add(
    "Tardive dyskinesia",
    5,
    "A 60-year-old man has been on a first-generation antipsychotic for eight years. He has constant chewing movements and a tongue that darts. The team increases the antipsychotic because the movements look like agitation. For a day the chewing lessens, then it returns worse.",
    "Why did a higher dose briefly help, and what is the durable mechanism?",
    [
        "The movements are from upregulated nigrostriatal dopamine receptors; more blockade masks them briefly and then deepens the upregulation",
        "The movements are acute dystonia, so more dopamine blockade is the cure",
        "This is Parkinson disease, and the antipsychotic is replacing lost dopamine",
        "Chewing movements mean serotonin syndrome, treated by raising the antipsychotic",
        "The tongue movement is a seizure, and the drug level is subtherapeutic",
    ],
    "The movements are from upregulated nigrostriatal dopamine receptors; more blockade masks them briefly and then deepens the upregulation",
    "Long dopamine blockade causes the postsynaptic receptors in the striatum to increase in number and sensitivity. That excess dopamine signaling produces tardive chewing and tongue movements. Pushing the blocker covers the receptors for a short time, which is why the movements dipped, but it drives still more upregulation, so the problem returns worse. Acute dystonia is early, not an eight-year chewing syndrome, and more drug is not its cure. Antipsychotics block dopamine; they do not replace it, and they worsen true Parkinson disease. Serotonin syndrome has clonus and hyperreflexia, not isolated orofacial dyskinesia. This is not a seizure aura that needs a higher antipsychotic level.",
    "katzung-16",
    subject="psychiatry",
)

add(
    "Alcohol withdrawal",
    4,
    "A 52-year-old man stops drinking two days ago. He is tremulous, sweaty, tachycardic, and then has a seizure. He is oriented enough to refuse 'another sedative' and asks for haloperidol only, because he is seeing shadows. Blood pressure is high.",
    "What is upregulated, and why is an antipsychotic alone the wrong plan?",
    [
        "Chronic alcohol facilitated GABA and suppressed NMDA; stopping it leaves NMDA excess. A benzodiazepine replaces GABA tone; an antipsychotic alone does not and can lower the seizure threshold",
        "Withdrawal is a dopamine-deficiency state treated first with haloperidol",
        "The seizure means he needs phenytoin loading and no GABA drug",
        "Sweating and tremor are serotonin syndrome from alcohol itself",
        "Benzodiazepines worsen withdrawal seizures because they block GABA",
    ],
    "Chronic alcohol facilitated GABA and suppressed NMDA; stopping it leaves NMDA excess. A benzodiazepine replaces GABA tone; an antipsychotic alone does not and can lower the seizure threshold",
    "Long alcohol use downregulates GABA-A signaling and upregulates NMDA glutamate receptors. When alcohol stops, the balance is excitation: tremor, autonomic surge, seizures, and later delirium. A benzodiazepine restores GABA-A activity and is the treatment that prevents the seizure from recurring. Haloperidol may quiet hallucinations but does not replace GABA and can make seizures more likely, so it is not the sole plan. This is not dopamine deficiency. Phenytoin does not fix alcohol-withdrawal seizures. The autonomic picture is withdrawal, not serotonin syndrome. Benzodiazepines facilitate GABA; they do not block it.",
    "katzung-16",
    subject="psychiatry",
)

add(
    "Wernicke versus Korsakoff",
    4,
    "A man with alcohol use disorder is confused, cannot abduct either eye fully, and walks with a wide base. He receives thiamine and the eye movements improve. Weeks later he invents detailed stories for events that never happened and cannot lay down new memories. Old childhood memories are relatively spared.",
    "Which lesion explains the lasting memory problem, and why did thiamine not erase it?",
    [
        "Mammillary bodies and the medial dorsal thalamus are damaged; the confabulatory amnesia of Korsakoff syndrome is largely irreversible even after thiamine repletes the acute Wernicke signs",
        "The hippocampus is filled with amyloid, so this is Alzheimer disease and thiamine was irrelevant",
        "Confabulation means he is malingering, so no structure is injured",
        "The frontal eye fields caused the abduction failure, and memory will return with glucose alone",
        "Both the eye and the memory findings are cerebellar, so they should have recovered together",
    ],
    "Mammillary bodies and the medial dorsal thalamus are damaged; the confabulatory amnesia of Korsakoff syndrome is largely irreversible even after thiamine repletes the acute Wernicke signs",
    "Wernicke encephalopathy is the acute triad of confusion, ophthalmoplegia, and ataxia from thiamine deficiency in the mammillary bodies and periaqueductal gray. Treating it can improve the eye findings. If the medial thalamic and mammillary injury is established, Korsakoff syndrome remains: anterograde amnesia with confabulation that thiamine does not reverse. Amyloid hippocampus disease is a different, slower dementia without this eye-movement story. Confabulation here is a memory failure, not a choice to lie. Abduction failure is a sixth-nerve or gaze-center problem in the brainstem, not the frontal eye field, and glucose without thiamine is the precipitant, not the cure. The cerebellum may add ataxia, but the memory circuit is diencephalic, which is why the two did not recover together.",
    "robbins-10",
)

add(
    "Horner syndrome orders",
    5,
    "Three patients have a small pupil and mild ptosis. Patient A, with a Pancoast tumor, does not sweat on the whole ipsilateral face and neck. Patient B, with a carotid dissection, does not sweat only on a patch of the medial forehead, and the body sweating is intact. Patient C has a lateral medullary stroke and anhidrosis of the body more than a tiny forehead patch.",
    "Which neuron is out in the Pancoast patient, and why is sweating different after the carotid lesion?",
    [
        "A first-order or second-order lesion is proximal to the superior cervical ganglion, so the face loses sweating; a postganglionic carotid lesion spares most facial sweating because those fibers traveled along the external carotid",
        "All three are third-order lesions, so sweating loss is identical",
        "Pancoast tumor hits the third-order neuron at the iris, so the whole body sweats too much",
        "A small pupil means parasympathetic loss, so pilocarpine will dilate it",
        "Ptosis in Horner syndrome is loss of levator palpebrae, the oculomotor muscle",
    ],
    "A first-order or second-order lesion is proximal to the superior cervical ganglion, so the face loses sweating; a postganglionic carotid lesion spares most facial sweating because those fibers traveled along the external carotid",
    "Sympathetic supply to the pupil and lid synapses in the superior cervical ganglion. Sudomotor fibers to most of the face peel off along the external carotid, while the internal carotid carries the ocular sympathetics. A Pancoast tumor hits the second-order preganglionic chain, so the whole half of the face is dry. A carotid dissection is third-order and often spares facial sweating except a small medial forehead area. Lateral medullary lesions are first-order and can include body anhidrosis. Calling all three third-order erases the sweating map. The miotic pupil is lost sympathetic dilation, not lost parasympathetic constriction. Horner ptosis is Müller muscle, a small smooth muscle; the skeletal levator is the third nerve and causes a much larger droop.",
    "guyton-14",
)

add(
    "Weber and Rinne",
    4,
    "A 30-year-old man has a cerumen plug in the right ear. Weber lateralizes to the right. Rinne on the right shows bone conduction louder than air. The left ear has air louder than bone, and Weber does not go left.",
    "Which type of loss is on the right, and what would a left sensorineural loss have done to Weber?",
    [
        "Right conductive loss; a left sensorineural loss would also push Weber to the right, away from the bad cochlea",
        "Right sensorineural loss, because Weber goes toward the symptomatic ear",
        "Left conductive loss, because Rinne was normal on the left",
        "Right sensorineural loss, because bone louder than air is the sensorineural Rinne",
        "A central lesion, because conductive loss makes Weber go to the good ear",
    ],
    "Right conductive loss; a left sensorineural loss would also push Weber to the right, away from the bad cochlea",
    "In conductive loss, bone conduction bypasses the blocked canal or ossicles, so Rinne is bone greater than air, and Weber goes to the bad ear. That is the plugged right ear. Sensorineural loss does the opposite on Weber: sound lateralizes away from the dead cochlea, so a left cochlear lesion also sends Weber to the right. You cannot read Weber without knowing which ear is bad. A normal Rinne on the left does not make the left the conductive ear. Bone greater than air is conductive, not sensorineural. Conductive loss sends Weber to the affected ear, not the good one.",
    "guyton-14",
)

add(
    "Benign positional vertigo",
    4,
    "A 60-year-old woman has spinning that lasts under a minute when she rolls over in bed or looks up. There is no hearing loss. Dix-Hallpike reproduces upbeat torsional nystagmus after a few seconds, and it fatigues. She has been taking meclizine every day for a month.",
    "What is moving, and why is daily meclizine not the treatment?",
    [
        "Otoconia in a semicircular canal bend the cupula with position change; a canalith repositioning maneuver clears them, and a suppressant only sedates",
        "Endolymphatic hydrops, so low-salt diet and diuretics are the repositioning equivalent",
        "The vestibular nerve is inflamed, so steroids and a long suppressant are specific",
        "A cerebellar stroke, because fatigable nystagmus with latency is central",
        "Perilymph fistula, which is fixed by the Epley maneuver",
    ],
    "Otoconia in a semicircular canal bend the cupula with position change; a canalith repositioning maneuver clears them, and a suppressant only sedates",
    "Short, positional, latent, fatigable vertigo with torsional nystagmus is canalithiasis, usually the posterior canal. The particles are displaced otoliths. The Epley or similar maneuver moves them back to the utricle. Meclizine can dull the sensation and cause falls in older adults; it does not remove the stone. Endolymphatic hydrops is Ménière disease, with hearing loss and longer attacks. Vestibular neuritis is continuous, not a few-second roll-in-bed spell. Central nystagmus is often immediate and nonfatigable, the opposite of this latency and fatigue. A fistula is pressure- or strain-triggered and is not cured by repositioning.",
    "robbins-10",
)

add(
    "Acute angle closure",
    5,
    "A 70-year-old woman is given a dilating drop for a fundus exam. An hour later the eye is rock hard, the pupil is mid-dilated, she sees halos, and she is vomiting. A student reaches for another mydriatic because the first dose 'was not enough,' and for atropine.",
    "What happened to the angle, and which drug direction is right?",
    [
        "Dilation bunched the iris into a narrow angle and blocked aqueous outflow; a miotic such as pilocarpine and a pressure-lowering agent are used, not another dilator",
        "Dilation opened the angle, so more mydriatic will vent the aqueous",
        "Atropine constricts the pupil and is the specific antidote",
        "This is open-angle glaucoma, which presents as an acute hard eye after one drop",
        "Timolol is unsafe only in asthma and is the cause of the hard eye here",
    ],
    "Dilation bunched the iris into a narrow angle and blocked aqueous outflow; a miotic such as pilocarpine and a pressure-lowering agent are used, not another dilator",
    "In a susceptible narrow angle, mydriasis thickens the iris at the periphery and blocks the trabecular meshwork. Pressure rises within the hour, the cornea swells, and the patient vomits. The pupil needs to be constricted with pilocarpine once the ischemia allows it, and pressure is lowered with an aqueous suppressant such as acetazolamide or a beta blocker; a second dilator or atropine makes the block worse. Atropine is a mydriatic and anticholinergic; it does not constrict. Open-angle glaucoma is chronic and silent, not a one-hour crisis after a drop. Timolol can treat the pressure; it did not cause this attack, though it is avoided in asthma for a different reason.",
    "katzung-16",
)

add(
    "Timolol and asthma",
    4,
    "A 66-year-old man with asthma is prescribed an eye drop for open-angle glaucoma. After a week he is wheezing and his resting heart rate is 52. He never swallowed the drop; he only put it in both eyes.",
    "How did an eye drop cause wheeze, and which drop is the likely one?",
    [
        "Timolol drains through the nasolacrimal duct and is absorbed, blocking bronchial and cardiac beta receptors",
        "Latanoprost is a systemic beta blocker when it reaches the nose",
        "Pilocarpine dries the airway by muscarinic blockade",
        "The wheeze is an ocular-cardiac reflex from a prostaglandin and is not pharmacologic",
        "Beta blockers in the eye cannot reach the blood, so this is coincidental new asthma",
    ],
    "Timolol drains through the nasolacrimal duct and is absorbed, blocking bronchial and cardiac beta receptors",
    "Topical timolol is a nonselective beta blocker. It bypasses first-pass metabolism through nasal mucosa and can bronchospasm a patient with asthma and slow the heart. Punctal occlusion reduces that. Latanoprost is a prostaglandin analog and darkens the iris or grows lashes; it is not a beta blocker. Pilocarpine is a muscarinic agonist and would increase secretions, not block them. This systemic effect is pharmacology, not a reflex from a prostaglandin. Eye drops are absorbed; 'it stayed in the eye' is the mistake that misses the wheeze.",
    "katzung-16",
)

add(
    "Central retinal artery versus vein",
    4,
    "Patient A has sudden painless monocular blindness. The retina is pale with a red spot at the fovea. Patient B has subacute blurred vision, dilated tortuous veins, and hemorrhages in all four quadrants, and the disk is swollen. Neither has a curtain of flashes and floaters.",
    "Which obstructions fit, and what does the red spot mean?",
    [
        "A is central retinal artery occlusion; the macula looks red because the underlying choroid shows through pale retina. B is central retinal vein occlusion",
        "A is vein occlusion because a cherry-red spot is venous blood; B is artery occlusion",
        "Both are retinal detachment, which whitens the retina and fills it with blood",
        "A is optic neuritis, which is painless and shows a cherry-red spot",
        "B is a vitreous hemorrhage, which leaves the retinal vessels easy to see and tortuous",
    ],
    "A is central retinal artery occlusion; the macula looks red because the underlying choroid shows through pale retina. B is central retinal vein occlusion",
    "Arterial occlusion kills the inner retina, which turns white, while the fovea stays relatively red because it is thin and the choroidal circulation shows through. Venous occlusion backs up blood: dilated veins, disk edema, and hemorrhages all around, the 'blood and thunder' fundus. Swapping artery and vein swaps the cherry-red spot onto the wrong disease. Detachment gives flashes, floaters, and a curtain, not these two fundi. Optic neuritis hurts with eye movement and affects the nerve head or the field, not a pale retina with a red fovea. Vitreous blood obscures the fundus; you would not see tortuous veins clearly.",
    "robbins-10",
)

add(
    "Friedreich ataxia",
    4,
    "A 16-year-old has a progressive clumsy gait, absent ankle reflexes, and upgoing toes. Position sense is poor. He has high arches and a scoliosis. A murmur of hypertrophic cardiomyopathy is new. A sibling is less affected. The repeat is GAA, and the gene product is mitochondrial.",
    "Which tract pair and which protein fit?",
    [
        "Dorsal columns and corticospinal tracts, from loss of frataxin",
        "Spinocerebellar tracts only, from loss of dystrophin",
        "Anterior horn cells only, from a CAG repeat in huntingtin",
        "A demyelinating neuropathy from a PMP22 duplication, with a normal heart",
        "Cerebellar Purkinje cells from a CTG repeat, with cataracts as the required finding",
    ],
    "Dorsal columns and corticospinal tracts, from loss of frataxin",
    "Friedreich ataxia is a GAA expansion that silences frataxin, an iron-sulfur protein in mitochondria. The cord loses dorsal columns and corticospinal tracts, so reflexes drop from the sensory loss while toes go up from the motor tract. Kyphoscoliosis, pes cavus, and hypertrophic cardiomyopathy complete the picture. Dystrophin is Duchenne and Becker muscular dystrophy. Huntingtin is a CAG disease of the caudate, not this areflexic cardiomyopathy. PMP22 duplication is Charcot-Marie-Tooth 1A, a peripheral myelin disease without this heart lesion as its signature. A CTG repeat with cataracts is myotonic dystrophy.",
    "robbins-10",
)

add(
    "Duchenne versus Becker",
    4,
    "A 5-year-old boy cannot get off the floor without walking his hands up his legs. Calves are large but weak. Creatine kinase is very high. A maternal uncle used a wheelchair by age 12. A cousin with a related mutation in the same gene is still walking at 20 and has a milder course.",
    "What is the genetic difference between the boy and the walking cousin?",
    [
        "The boy has a frameshift that abolishes dystrophin; the cousin has a mutation that preserves the reading frame and leaves partial dystrophin",
        "Both have the same frameshift; severity is only how much they exercise",
        "The boy has a CTG repeat and the cousin has a GAA repeat",
        "Dystrophin is autosomal, so an uncle on the mother's side is unrelated",
        "The large calves mean the muscle protein is overproduced, so the gene is duplicated and working",
    ],
    "The boy has a frameshift that abolishes dystrophin; the cousin has a mutation that preserves the reading frame and leaves partial dystrophin",
    "Dystrophin links actin to the extracellular matrix through the dystrophin-glycoprotein complex. A frameshifting deletion removes the protein and causes Duchenne muscular dystrophy, with early loss of walking. An in-frame deletion shortens the protein but leaves some function, which is Becker muscular dystrophy and a later wheelchair. Exercise does not choose the reading frame. CTG is myotonic dystrophy and GAA is Friedreich ataxia. The gene is on X, so a maternal uncle fits. Pseudohypertrophy is fat and fibrosis replacing muscle, not extra working dystrophin.",
    "robbins-10",
)

add(
    "Myotonic dystrophy",
    4,
    "A 42-year-old man cannot release a handshake. He has early cataracts, a long face, and a bald forehead. His mother had the same illness late in life; his child is much more affected in infancy. The repeat is CTG in a noncoding region.",
    "Which phenomenon explains the child, and what is the muscle problem?",
    [
        "Anticipation from expansion of a CTG repeat; chloride-channel related myotonia from DMPK dysfunction, with cataracts and an autosomal dominant parent",
        "A frameshift in dystrophin, which causes myotonia and cataracts",
        "Anticipation only occurs in GAA repeats, so this child was adopted",
        "The handshake delay is Lambert-Eaton facilitation and should improve with repetition of a different kind",
        "This is autosomal recessive, so a mother and child pair is impossible",
    ],
    "Anticipation from expansion of a CTG repeat; chloride-channel related myotonia from DMPK dysfunction, with cataracts and an autosomal dominant parent",
    "Myotonic dystrophy type 1 is a CTG expansion in the DMPK gene. The repeat grows in successive generations, especially through the mother for congenital disease, which is anticipation. The muscle cannot relax, a myotonia, and cataracts, frontal balding, and a distal weakness pattern come with it. Dystrophin frameshifts cause Duchenne weakness, not delayed relaxation and cataracts. Anticipation is not exclusive to Friedreich GAA repeats. Lambert-Eaton gets stronger with use; myotonia is delayed relaxation after a grip. The inheritance is autosomal dominant, so parent and child is expected.",
    "robbins-10",
)

add(
    "NF1 versus NF2",
    4,
    "A teenager has many café-au-lait spots, freckles in the armpit, and a glioma of the optic nerve. His father has the same skin findings. A different family has a young adult with bilateral vestibular schwannomas and fewer skin spots. No one has a renal angiomyolipoma.",
    "Which chromosomes and which tumors did you use to separate them?",
    [
        "NF1 is chromosome 17, neurofibromin, with optic glioma and axillary freckles; NF2 is chromosome 22, merlin, with bilateral vestibular schwannomas",
        "NF1 is chromosome 22 and NF2 is chromosome 17; the tumors are otherwise identical",
        "Both are tuberous sclerosis on chromosome 9 and 16, and the optic glioma is a renal angiomyolipoma",
        "Bilateral vestibular schwannomas define NF1",
        "Axillary freckles are ash-leaf spots and mean tuberous sclerosis",
    ],
    "NF1 is chromosome 17, neurofibromin, with optic glioma and axillary freckles; NF2 is chromosome 22, merlin, with bilateral vestibular schwannomas",
    "Neurofibromatosis type 1 is the common skin disease: many café-au-lait macules, axillary freckling, neurofibromas, and optic pathway glioma, from neurofibromin on chromosome 17. Type 2 is merlin on chromosome 22 and is defined by bilateral vestibular schwannomas, with a quieter skin exam. Swapping the chromosomes is a pure memory trap with a clinical cost if you counsel the wrong tumor risk. Angiomyolipomas and ash-leaf spots are tuberous sclerosis, chromosomes 9 and 16. Vestibular schwannomas are NF2, not NF1. Axillary freckles are NF1, not ash-leaf macules.",
    "robbins-10",
)

add(
    "Tuberous sclerosis",
    4,
    "An infant has pale leaf-shaped patches that show up under a Wood lamp, a seizure, and a cardiac mass that was seen before birth and is now smaller. The mother has facial angiofibromas and a history of a kidney tumor made of fat, vessels, and muscle. Intelligence is variable in the family.",
    "Which two proteins and which tumor fit?",
    [
        "Hamartin and tuberin, tumor suppressors; the heart mass is a rhabdomyoma and the kidney mass is an angiomyolipoma",
        "Neurofibromin only; the heart mass is an atrial myxoma",
        "Merlin; the facial lesions are bilateral acoustic neuromas",
        "A single collagen gene; the leaf-shaped spots are café-au-lait macules",
        "Huntingtin; the seizure is anticipation of a CAG repeat",
    ],
    "Hamartin and tuberin, tumor suppressors; the heart mass is a rhabdomyoma and the kidney mass is an angiomyolipoma",
    "Tuberous sclerosis is TSC1 or TSC2, hamartin or tuberin, which inhibit mTOR. Ash-leaf spots, facial angiofibromas, seizures from cortical tubers, cardiac rhabdomyoma that often regresses, and renal angiomyolipoma are the cluster. Neurofibromin is NF1 and does not make a rhabdomyoma. Merlin is NF2 and the facial story there is vestibular tumors, not angiofibromas. Café-au-lait macules are NF1, not ash-leaf hypopigmentation. Huntingtin does not cause congenital heart tumors or hypopigmented macules.",
    "robbins-10",
)

add(
    "Fragile X",
    4,
    "A boy has a long face, large ears, and large testes after puberty. He has intellectual disability and avoids eye contact. His mother is a carrier with a premutation and premature ovarian failure. The repeat is CGG in the FMR1 promoter.",
    "What does the expansion do to the gene, and why can the mother be less affected?",
    [
        "A full CGG expansion methylates FMR1 and silences it; a premutation is smaller, so she may have a late phenotype without the full childhood syndrome",
        "The repeat is CAG in huntingtin, and methylation is irrelevant",
        "FMR1 is overexpressed, so the testes enlarge from excess fragile-X protein",
        "This is trisomy 21, and the repeat story is a distractor",
        "The gene is mitochondrial, so only mothers transmit a full syndrome to every child",
    ],
    "A full CGG expansion methylates FMR1 and silences it; a premutation is smaller, so she may have a late phenotype without the full childhood syndrome",
    "Fragile X is a CGG expansion in the FMR1 5' region. Past a threshold the repeat is methylated and the gene turns off, so the RNA-binding protein is missing. That causes intellectual disability, long face, large ears, and macroorchidism. A premutation does not fully silence the gene; women can have premature ovarian failure and older carriers can have a tremor-ataxia syndrome, which is why the mother is not a copy of the boy. CAG huntingtin is Huntington disease. The syndrome is loss of FMR1, not overexpression. Trisomy 21 has a different face and no CGG repeat. Inheritance is X-linked, not mitochondrial.",
    "robbins-10",
)

add(
    "Lesch-Nyhan",
    4,
    "A toddler boy bites his own lips and fingers and has orange sand in the diaper. Uric acid is high. An enzyme in the purine salvage pathway is missing. He is developmentally delayed. A drug that inhibits xanthine oxidase is discussed for the gout, not for the behavior.",
    "Which enzyme is gone, and why does allopurinol not stop the self-injury?",
    [
        "HGPRT is absent, so PRPP accumulates and purines are overproduced; allopurinol lowers uric acid but does not restore the salvage pathway in the brain",
        "Adenosine deaminase is absent, so this is SCID with gout",
        "Xanthine oxidase is absent, so uric acid is high",
        "HGPRT is overactive, and allopurinol replaces it",
        "The orange sand is homogentisic acid, so this is alkaptonuria",
    ],
    "HGPRT is absent, so PRPP accumulates and purines are overproduced; allopurinol lowers uric acid but does not restore the salvage pathway in the brain",
    "Lesch-Nyhan syndrome is X-linked loss of hypoxanthine-guanine phosphoribosyltransferase. Salvage fails, PRPP drives new purine synthesis, and uric acid rises, which stones the diaper and causes gout. The neurologic self-injury is part of the enzyme loss in brain and is not fixed by lowering uric acid with allopurinol or febuxostat. Adenosine deaminase deficiency is a form of SCID, not self-mutilation and sand. If xanthine oxidase were absent, uric acid would be low. The enzyme is missing, not overactive. Homogentisic acid darkens urine in alkaptonuria and does not cause this behavior.",
    "katzung-16",
)

add(
    "Narcolepsy",
    4,
    "A 17-year-old falls asleep in class, has episodes of buckling knees when he laughs, and sometimes wakes unable to move while hallucinating a figure in the room. Night sleep is fragmented. Stimulants help the sleep attacks partially. A spinal-fluid peptide from the hypothalamus is low.",
    "Which peptide, and what is the knee-buckling episode?",
    [
        "Hypocretin (orexin) is low; laughter-triggered loss of tone is cataplexy from REM atonia intruding into wakefulness",
        "Melatonin is low; the knee buckling is a seizure from absence epilepsy",
        "Dopamine is low in the substantia nigra; the paralysis on waking is Parkinson rigidity",
        "Hypocretin is high, which forces sleep, and cataplexy is a dystonic reaction",
        "Acetylcholine receptor antibodies cause the sleep attacks",
    ],
    "Hypocretin (orexin) is low; laughter-triggered loss of tone is cataplexy from REM atonia intruding into wakefulness",
    "Narcolepsy with cataplexy is loss of hypothalamic hypocretin neurons. REM physiology intrudes into the day: sleep attacks, cataplexy (tone loss with emotion), sleep paralysis, and hypnagogic hallucinations. Low CSF hypocretin supports it. Melatonin is not the missing peptide, and absence seizures do not drop tone when the patient laughs. Waking paralysis here is REM atonia, not parkinsonian rigidity. The peptide is deficient, not high. Acetylcholine-receptor antibodies are myasthenia gravis.",
    "guyton-14",
)

add(
    "Night terror versus nightmare",
    4,
    "A 6-year-old sits up screaming 90 minutes after falling asleep, is sweaty, does not recognize his parents, and cannot be consoled. He goes back to sleep and remembers nothing in the morning. A teenager wakes from a frightening dream near morning, is immediately oriented, and can recount the plot.",
    "Which sleep stages fit?",
    [
        "The child is in stage N3 non-REM sleep; the teenager woke from REM sleep and can recall the dream",
        "Both are REM, because fear only occurs in REM",
        "The child is in stage N1, the lightest sleep, which is why he is confused",
        "Night terrors are seizures, and dream recall proves epilepsy",
        "The teenager has cataplexy because he remembers the dream",
    ],
    "The child is in stage N3 non-REM sleep; the teenager woke from REM sleep and can recall the dream",
    "Night terrors come out of slow-wave N3 sleep in the first part of the night. The child is autonomic and amnestic and should not be forced awake; he is not in a recallable dream. Nightmares are REM events, cluster toward morning, and the person wakes oriented and remembers the story. Fear is not restricted to REM. N3 is deep sleep, not N1. Amnesia and autonomic surge are not required to diagnose epilepsy, and a remembered dream is not a seizure. Cataplexy is loss of tone while awake and laughing or startled, not a recalled dream.",
    "guyton-14",
    subject="psychiatry",
)

add(
    "Guillain-Barre",
    4,
    "A man had diarrhea from undercooked chicken two weeks ago. His legs are weak and the weakness is moving upward. Reflexes are gone. A spinal tap shows protein of 90 mg/dL and only two white cells. Sensation is mildly reduced. He is watching his own breathing.",
    "What is the immune mechanism, and which bedside threat matters more than the cell count?",
    [
        "Antibodies to peripheral myelin after Campylobacter molecular mimicry; respiratory muscle failure can come before the protein finding and is the emergency",
        "Anterior horn cells are invaded by polio virus, so protein is high and cells are absent",
        "A central demyelinating plaque in the cervical cord, so reflexes should be brisk",
        "The high protein with no cells means bacterial meningitis, and weakness is incidental",
        "Botulinum toxin is causing an ascending sensory neuropathy",
    ],
    "Antibodies to peripheral myelin after Campylobacter molecular mimicry; respiratory muscle failure can come before the protein finding and is the emergency",
    "Campylobacter jejuni lipooligosaccharide resembles peripheral-nerve gangliosides. Antibodies strip myelin, conduction fails, and weakness ascends with lost reflexes. The spinal fluid shows high protein from root inflammation and almost no cells. The dangerous part is diaphragmatic failure, which you follow with vital capacity, not the lab. Polio kills anterior horn cells and the fluid is inflammatory, not albumino-cytologic. A cord plaque would raise reflexes below the lesion. Bacterial meningitis is a high cell count with low glucose. Botulism is descending, pupillary, and has no sensory loss and a normal spinal fluid.",
    "robbins-10",
)

add(
    "Anterior spinal artery",
    4,
    "A patient loses strength in both legs and loses pain and temperature below the chest after aortic surgery. Vibration and position sense are intact. The dorsal columns were outside the infarct territory.",
    "Which vessel was lost, and why is vibration spared?",
    [
        "The anterior spinal artery supplies the anterior two-thirds of the cord, including spinothalamic and corticospinal tracts; dorsal columns are on the posterior spinal arterial supply",
        "The posterior spinal arteries supply the corticospinal tracts, so vibration should have been lost",
        "A single posterior spinal artery infarct causes bilateral pain loss and spares motor function",
        "The artery of Adamkiewicz is a carotid branch, so the cord is not its territory",
        "Intact vibration means the lesion is a peripheral neuropathy",
    ],
    "The anterior spinal artery supplies the anterior two-thirds of the cord, including spinothalamic and corticospinal tracts; dorsal columns are on the posterior spinal arterial supply",
    "The anterior spinal artery feeds the ventral horns, corticospinal tracts, and spinothalamic tracts. Infarction, often in the watershed of the artery of Adamkiewicz during aortic surgery, gives bilateral weakness and pain/temperature loss with preserved dorsal-column sensation. Posterior spinal arteries supply the dorsal columns, which is why vibration survives. A posterior infarct would do the opposite. Adamkiewicz is a radicular reinforcement of the anterior spinal artery from the aorta, not the carotid. A neuropathy would not cut a sharp sensory level for pain while sparing vibration in this cord pattern.",
    "guyton-14",
)

add(
    "Central cord and syrinx",
    5,
    "A man falls forward and hyperextends his neck. His hands are weak and the arms are weaker than the legs. A second patient has a cape of lost pain and temperature across the shoulders, with preserved light touch, and wasting of the small hand muscles. MRI of the second patient shows a fluid cavity in the center of the cervical cord.",
    "Why are the hands hit hardest in both, and why is light touch spared in the cape?",
    [
        "Cervical fibers of the spinothalamic tract cross near the central canal, and the cervical corticospinal fibers lie more medially; dorsal columns, which carry vibration and much discriminative touch, sit outside the cavity",
        "The syrinx destroys the dorsal columns first, so pain is spared and touch is lost",
        "Hyperextension injures the lumbar cord preferentially because those fibers are medial",
        "A cape distribution is a brainstem lesion at the trigeminal nucleus",
        "Light touch and pain share one tract, so they cannot separate",
    ],
    "Cervical fibers of the spinothalamic tract cross near the central canal, and the cervical corticospinal fibers lie more medially; dorsal columns, which carry vibration and much discriminative touch, sit outside the cavity",
    "Crossing spinothalamic fibers decussate in front of the central canal. A syrinx interrupts them at the level of the cavity and spares the already-crossed lateral tracts and the dorsal columns, so pain and temperature drop in a cape while vibration and discriminative touch remain. In the corticospinal tract the arm fibers are more medial than the leg fibers, so a central or hyperextension injury weakens the hands more than the legs. A syrinx does not start in the dorsal columns. Lumbar fibers are lateral, so they are relatively spared, not hit first. The trigeminal nucleus would numb the face, not a shoulder cape. Pain and discriminative touch do not share one tract, which is the whole point of the dissociated sensory loss.",
    "guyton-14",
)

add(
    "Aphasia types",
    5,
    "Patient A speaks in short, effortful phrases, understands questions, and is frustrated. Patient B speaks fluently with invented words and does not follow commands. Patient C speaks fluently, understands, but cannot repeat a sentence. Patient D cannot repeat and also cannot read, yet he writes normally; a stroke is in the left occipital lobe and the splenium.",
    "Which localizations fit A, B, and the reading-writing split?",
    [
        "A is Broca in the dominant frontal lobe; B is Wernicke in the superior temporal gyrus; D is alexia without agraphia from a splenium lesion disconnecting the right visual cortex from the left language areas",
        "A is Wernicke and B is Broca, because effort means poor comprehension",
        "C is global aphasia because repetition failed",
        "D must have a blind eye, because writing can be preserved only if reading is preserved",
        "All four are conduction aphasia in the arcuate fasciculus",
    ],
    "A is Broca in the dominant frontal lobe; B is Wernicke in the superior temporal gyrus; D is alexia without agraphia from a splenium lesion disconnecting the right visual cortex from the left language areas",
    "Broca aphasia is nonfluent with spared comprehension, frontal. Wernicke aphasia is fluent and empty with poor comprehension, temporal. Conduction aphasia, patient C, is the arcuate fasciculus: fluent, understands, cannot repeat. Alexia without agraphia happens when a left PCA stroke takes the left visual cortex and the splenium, so words seen by the right hemisphere cannot reach the left language network, while writing, which does not need that incoming visual path, survives. Swapping Broca and Wernicke ignores fluency. Failed repetition alone is not global aphasia; global aphasia loses fluency and comprehension too. Writing can outlast reading in that disconnection. One fasciculus does not explain all four patterns.",
    "guyton-14",
)

add(
    "MCA versus ACA",
    4,
    "A 72-year-old man has sudden weakness of the right face and right arm, with almost normal leg strength, and he cannot name a pen. A second man has weak right leg more than arm, and a grasp reflex, after a stroke on the left cortical surface near the midline.",
    "Which arteries, and why is the leg relatively spared in the first man?",
    [
        "The first is left MCA, which serves the lateral cortex including face and arm language areas; the leg homunculus is on the medial hemisphere in the ACA territory",
        "The first is left ACA because the face is lateral; the second is MCA because the leg is medial",
        "Both are vertebral arteries, which supply the homunculus directly",
        "The naming problem is a right parietal lobe sign",
        "A grasp reflex localizes to the occipital pole",
    ],
    "The first is left MCA, which serves the lateral cortex including face and arm language areas; the leg homunculus is on the medial hemisphere in the ACA territory",
    "The motor homunculus puts the leg in the medial interhemispheric fissure, ACA, and the face and arm on the lateral surface, MCA. The left MCA also covers language, so anomia with face and arm weakness is MCA. Leg-predominant weakness plus a grasp reflex is ACA and frontal medial cortex. Reversing the arteries is the trap the homunculus was drawn to prevent. The vertebral arteries do not supply the cortical homunculus. Naming is a dominant, usually left, hemisphere function. A grasp reflex is frontal, not occipital.",
    "guyton-14",
)

add(
    "Lacunar pure motor",
    4,
    "A man with long hypertension has sudden right face, arm, and leg weakness equally, with no sensory loss, no aphasia, and no visual field cut. CT is too early to show the lesion. The suspected site is a small penetrating artery.",
    "Which vessel and why is the cortex unlikely?",
    [
        "A lenticulostriate branch to the posterior limb of the internal capsule; the cortex would have added cortical signs such as aphasia or a field cut if a large MCA trunk were out",
        "The left MCA stem, which causes pure motor loss and always spares the face",
        "The anterior cerebral artery, which weakens face, arm, and leg equally",
        "A PICA infarct, because pure motor stroke is a lateral medullary sign",
        "The ophthalmic artery, because equal face and leg weakness is ocular",
    ],
    "A lenticulostriate branch to the posterior limb of the internal capsule; the cortex would have added cortical signs such as aphasia or a field cut if a large MCA trunk were out",
    "Pure motor hemiparesis of face, arm, and leg together, without sensory or cortical signs, is the lacunar syndrome of the contralateral internal capsule or basis pontis. Lipohyalinosis of a small penetrator such as a lenticulostriate artery is the usual cause in chronic hypertension. An MCA stem stroke is a large cortical and deep infarct and brings aphasia, neglect, or a gaze preference. ACA spares the face relative to the leg. PICA is lateral medulla and is not a pure motor hemiparesis. The ophthalmic artery does not supply the capsule.",
    "robbins-10",
)

add(
    "Subarachnoid hemorrhage workup",
    5,
    "A 45-year-old woman has a sudden worst headache while lifting. CT of the head an hour later is read as normal. She still has neck stiffness. A colleague wants to send her home because the CT is negative. You are asked what test still matters today and what congenital association raises her risk if imaging later shows an aneurysm.",
    "What do you do next, and which condition is linked to berry aneurysms?",
    [
        "Lumbar puncture looking for xanthochromia or blood that CT missed; autosomal dominant polycystic kidney disease is associated with saccular aneurysms",
        "Discharge, because CT is perfectly sensitive at one hour for every subarachnoid bleed",
        "Start heparin, because thunderclap headache is ischemic stroke until proven otherwise",
        "Order temporal artery biopsy before any spinal fluid test",
        "Berry aneurysms are associated with tuberous sclerosis, not kidney cysts",
    ],
    "Lumbar puncture looking for xanthochromia or blood that CT missed; autosomal dominant polycystic kidney disease is associated with saccular aneurysms",
    "CT is very sensitive early but not perfect, and a negative scan with a true thunderclap headache and neck stiffness still needs a lumbar puncture to look for blood or xanthochromia. Missing that send-home is how a sentinel bleed is discharged. Heparin for an unexcluded hemorrhage is dangerous. Temporal artery biopsy is for older patients with jaw claudication and a high ESR, not a sudden headache at 45. Saccular aneurysms of the circle of Willis track with ADPKD, not with tuberous sclerosis.",
    "aha-sah-2023",
)

add(
    "Refeeding phosphate",
    5,
    "A young woman with anorexia nervosa and a body mass index of 14 starts a large caloric prescription on the first hospital night. The next day she is weak, has a hemolytic look to the blood film discussion, and cannot get out of bed. Phosphate, which was normal on arrival, is now very low. Potassium and magnesium are drifting down.",
    "Why did phosphate fall after feeding, and what should have been done?",
    [
        "Insulin from the carbohydrate load drives phosphate into cells to make ATP; phosphate should be replaced before and during refeeding, and calories advanced slowly",
        "Phosphate falls because the kidney wastes it in starvation, and feeding stops that waste immediately so the level rises",
        "The weakness is benzodiazepine withdrawal and phosphate is unrelated",
        "Refeeding alkalosis raises total calcium and the phosphate drop is a lab error",
        "A high-calorie start is safe if albumin is normal, because phosphate follows albumin",
    ],
    "Insulin from the carbohydrate load drives phosphate into cells to make ATP; phosphate should be replaced before and during refeeding, and calories advanced slowly",
    "Starved cells are phosphate-poor. When insulin rises with feeding, phosphate, potassium, and magnesium rush intracellularly to rebuild ATP and glycogen. Serum phosphate can crash and cause weakness, hemolysis, and respiratory failure. The arrival phosphate can look normal and then fall, so you replete and advance calories slowly rather than celebrate a big first meal. Feeding does not instantly stop a renal waste in a way that raises phosphate; the level falls. This is not benzodiazepine withdrawal. It is not a calcium lab artifact. Phosphate is not albumin-bound the way a fraction of calcium is, and a normal albumin does not make aggressive refeeding safe.",
    "katzung-16",
    subject="psychiatry",
)

add(
    "SSRI delay",
    4,
    "A 29-year-old man starts sertraline for a major depressive episode. On day 3 he feels no better and has nausea and jitteriness. He wants to stop and switch to alprazolam as the antidepressant. A friend told him the drug should work overnight if it really raises serotonin.",
    "Why is there a delay, and why is a benzodiazepine not the antidepressant?",
    [
        "Autoreceptor and downstream receptor changes take weeks even though reuptake blockade is immediate; a benzodiazepine may sedate anxiety but does not treat the depressive episode",
        "Sertraline blocks dopamine reuptake, so nausea on day 3 means the dose is already therapeutic for mood",
        "Mood must improve within 72 hours or the diagnosis is wrong",
        "Alprazolam increases serotonin reuptake and is first-line for melancholic depression",
        "Jitteriness is serotonin syndrome and the SSRI should be doubled",
    ],
    "Autoreceptor and downstream receptor changes take weeks even though reuptake blockade is immediate; a benzodiazepine may sedate anxiety but does not treat the depressive episode",
    "SSRIs block the serotonin transporter within hours, but mood response tracks slower changes in autoreceptors and postsynaptic signaling, classically several weeks. Early nausea and activation are common and are not proof of failure or of serotonin syndrome. A benzodiazepine can take the edge off anxiety and insomnia and can be habit-forming; it is not an antidepressant and is a poor substitute. Sertraline is not a dopamine-reuptake blocker as its main action. A three-day trial does not falsify the diagnosis. Alprazolam does not treat melancholia by increasing serotonin reuptake. Doubling the dose for mild early jitteriness risks real toxicity and is not the move.",
    "katzung-16",
    subject="psychiatry",
)

add(
    "Capacity",
    5,
    "A 64-year-old man with pneumonia understands that he may die without antibiotics, can repeat the risks of the drug, states that he prefers to leave because he does not want this hospitalization, and gives a reason that follows from his values. He is not suicidal. A resident says he lacks capacity because the choice is unwise and because only a judge can decide capacity.",
    "Which element is being confused?",
    [
        "Capacity is a clinical judgment about this decision: understanding, appreciation, reasoning, and a stable choice. It is not the same as agreeing with the physician, and legal competence is the court finding",
        "Any refusal of a beneficial drug proves incapacity",
        "Capacity can be declared only by a judge at the bedside",
        "Understanding the facts is enough, so appreciation and reasoning are optional and he fails them here",
        "He lacks capacity because pneumonia itself always removes decision-making ability",
    ],
    "Capacity is a clinical judgment about this decision: understanding, appreciation, reasoning, and a stable choice. It is not the same as agreeing with the physician, and legal competence is the court finding",
    "Capacity is decision-specific and clinical. This man understands, appreciates the consequence, reasons from his own values, and chooses consistently, so he has capacity to refuse even a choice the team dislikes. Competence is the legal status a court determines. Disagreeing with the doctor is not incapacity. A judge is not required to decide ordinary bedside capacity. He has shown more than bare fact-recall; the vignette includes appreciation and a reason. Pneumonia does not automatically erase capacity when the conversation shows intact elements.",
    "ama-ethics",
    subject="psychiatry",
)

add(
    "Projection as a trap",
    4,
    "A student who cheated on an exam loudly accuses classmates of cheating and tells the dean the class is dishonest. He does not mention his own paper. He is not having hallucinations, and he can describe his actions when asked directly later in private.",
    "Which defense is this, and which nearby defense is it not?",
    [
        "Projection: he attributes his own unacceptable impulse to others. It is not displacement, which would move the feeling onto a safer target, and not dissociation",
        "Displacement onto the dean, because the dean is a symbol of the exam",
        "Reaction formation, because he is doing the opposite of cheating by reporting others",
        "Sublimation, because accusing others is a socially useful act",
        "Altruism, because he is protecting the class",
    ],
    "Projection: he attributes his own unacceptable impulse to others. It is not displacement, which would move the feeling onto a safer target, and not dissociation",
    "Projection puts one's own unacceptable wish or act onto other people. The student deals with his cheating by experiencing other people as the cheaters. Displacement would shift the anger at himself onto a safer person while still owning the feeling's source more honestly; that is not this accusation. Reaction formation would have him behaving with exaggerated honesty, not accusing the room. Sublimation turns an impulse into a valued activity such as art or work, not a false accusation. Altruism serves someone else's welfare; this serves his own guilt.",
    "robbins-10",
    subject="psychiatry",
)

add(
    "OCD circuit",
    4,
    "A man washes his hands for hours because of a thought that they are contaminated. He knows the thought is excessive and it distresses him. He does not hear voices. A low-dose benzodiazepine was tried and did not touch the rituals. A drug that raises serotonin is being considered at a dose often higher than the depression dose, and a therapy that exposes him to the sink without washing.",
    "Which loop is overactive, and why is a benzodiazepine a weak plan?",
    [
        "Cortico-striato-thalamo-cortical loops; benzodiazepines do not treat the obsession-compulsion cycle the way serotonin reuptake inhibition and exposure do",
        "The mesolimbic dopamine tract only, so an antipsychotic is the sole first-line drug",
        "The cerebellum, because rituals are a coordination problem",
        "A seizure focus, so ethosuximide is first-line",
        "Handwashing proves psychosis, so insight is impossible and serotonin drugs are contraindicated",
    ],
    "Cortico-striato-thalamo-cortical loops; benzodiazepines do not treat the obsession-compulsion cycle the way serotonin reuptake inhibition and exposure do",
    "OCD is tied to overactive cortico-striato-thalamo-cortical circuits. Patients usually have insight, which separates the illness from a delusion. High-dose SSRIs and exposure with response prevention are the treatments with a real effect. A benzodiazepine may relax him and does not stop the ritual loop, which is why it failed. Dopamine blockade is not the first-line monotherapy implied by calling it purely mesolimbic. The cerebellum does not generate obsessions. Ethosuximide is for absence seizures. Insight is present here, so this is not psychosis and an SSRI is not contraindicated.",
    "katzung-16",
    subject="psychiatry",
)

add(
    "ADHD stimulant mechanism",
    4,
    "A 9-year-old boy cannot stay in his seat, blurts answers, and loses homework. The pattern has been present since age 5 at home and at school. Sleep is normal and there is no seizure. Methylphenidate is started and attention improves. A relative worries the drug is a sedative because he is calmer.",
    "What is the drug doing, and why is he calmer rather than sedated?",
    [
        "It blocks reuptake of dopamine and norepinephrine in prefrontal circuits that support attention; better executive control looks calmer and is not GABA sedation",
        "It facilitates GABA-A receptors, like lorazepam, which is why sleepiness is the therapeutic effect",
        "It blocks dopamine, like haloperidol, and the calm is parkinsonism",
        "Improvement proves the diagnosis was absence epilepsy",
        "Stimulants worsen prefrontal signal by depleting norepinephrine, which is the intended effect",
    ],
    "It blocks reuptake of dopamine and norepinephrine in prefrontal circuits that support attention; better executive control looks calmer and is not GABA sedation",
    "Methylphenidate inhibits dopamine and norepinephrine transporters. In the prefrontal cortex that increases the signal used for sustained attention and impulse control, so the child stays with the task and looks calmer. It is not a GABA sedative, and therapeutic calm is not drowsiness. It is not a D2 blocker, and parkinsonism is not the goal or the usual effect. A normal sleep history and a long behavioral pattern are not absence seizures. The drug does not work by depleting norepinephrine.",
    "katzung-16",
    subject="psychiatry",
)

add(
    "Broca versus conduction repeat",
    4,
    "A woman speaks in halting three-word phrases and points correctly to the door when asked. She cannot repeat 'no ifs, ands, or buts' any better than she can produce her own sentences. A second patient speaks in full sentences, names objects, follows commands, and still cannot repeat that same phrase.",
    "What additional deficit separates conduction aphasia from Broca aphasia?",
    [
        "Nothing in repetition: both fail it. Conduction aphasia is separated by fluent speech and intact comprehension, localizing to the arcuate fasciculus rather than Broca area",
        "Only Broca aphasia fails repetition; conduction aphasia repeats normally",
        "Conduction aphasia cannot comprehend, which is why repetition fails",
        "Broca aphasia is a right-hemisphere lesion in a right-handed person",
        "The second patient has Wernicke aphasia because repetition is the comprehension test",
    ],
    "Nothing in repetition: both fail it. Conduction aphasia is separated by fluent speech and intact comprehension, localizing to the arcuate fasciculus rather than Broca area",
    "Repetition fails in Broca, Wernicke, conduction, and global aphasia, so it does not by itself name the syndrome. The second patient is fluent and understands, which is conduction aphasia, a disconnection in the arcuate fasciculus between comprehension and production. The first patient is nonfluent with good comprehension, which is Broca. Saying conduction aphasia repeats normally is false. Conduction aphasia keeps comprehension. Broca area is dominant frontal, usually left. The second patient understands commands, so this is not Wernicke aphasia; repetition is not a comprehension test.",
    "guyton-14",
)
# count check at import time is intentionally omitted

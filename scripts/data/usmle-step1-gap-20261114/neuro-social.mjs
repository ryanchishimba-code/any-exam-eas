/** Behavioral-nervous (5), social sciences (4), human development (1). */
export const NEURO_ITEMS = [
  {
    slug: "bn-01",
    domain: "behavioral-nervous",
    band: "easy",
    difficulty: 2,
    subjectId: "pathology",
    blueprintTopic: "neurodegenerative",
    topicCategory: "neurodegenerative",
    citationTitle: "Parkinson Disease",
    scenario:
      "A 67-year-old man has a resting tremor of one hand, cogwheel rigidity, and a shuffling gait. He has become slower to button his shirt. Facial expression is reduced. A medication that becomes dopamine in the brain improves the tremor. At autopsy in similar patients the pigmented neurons of the midbrain are depleted, and remaining neurons contain eosinophilic cytoplasmic inclusions.",
    question: "Which projection has been lost?",
    options: [
      "Dopaminergic axons from substantia nigra to the striatum",
      "Cholinergic axons from the basal nucleus to the cortex",
      "Serotonergic axons from the raphe nuclei to the cord",
      "Noradrenergic axons from the locus coeruleus to the cerebellum",
      "Glutamatergic axons from the subthalamic nucleus to the pallidum",
    ],
    correctAnswer: "Dopaminergic axons from substantia nigra to the striatum",
    explanation: `## Why this answer is correct
Parkinson disease kills pigmented dopaminergic neurons in the substantia nigra pars compacta whose axons terminate in the striatum. Loss of that nigrostriatal dopamine produces resting tremor, rigidity, and bradykinesia. Lewy bodies are eosinophilic cytoplasmic inclusions of alpha-synuclein. Levodopa replaces the missing dopamine and improves the motor signs.

## Why the other options are wrong
**Cholinergic axons from the basal nucleus to the cortex**
The nucleus basalis of Meynert is the cholinergic projection depleted in Alzheimer disease, which presents with memory failure rather than a levodopa-responsive resting tremor.

**Serotonergic axons from the raphe nuclei to the cord**
Raphe serotonin modulates mood, pain, and sleep. It is not the pathway whose loss produces this asymmetric parkinsonian motor syndrome.

**Noradrenergic axons from the locus coeruleus to the cerebellum**
The locus coeruleus can be involved in Parkinson disease, but the motor syndrome and the levodopa response are explained by nigrostriatal dopamine, not by a cerebellar noradrenergic projection.

**Glutamatergic axons from the subthalamic nucleus to the pallidum**
The subthalamic nucleus is overactive in the parkinsonian circuit because dopamine no longer restrains the indirect pathway. Those glutamatergic neurons are not the cells that have died.`,
  },
  {
    slug: "bn-02",
    domain: "behavioral-nervous",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "neurodegenerative",
    topicCategory: "neurodegenerative",
    citationTitle: "Alzheimer Disease",
    scenario:
      "A 74-year-old woman has worsened over three years from misplacing objects to being unable to manage money or recognize her street. Early memory of recent events was hit first. Motor examination is normal and there is no resting tremor. Imaging shows hippocampal atrophy out of proportion to the rest of the brain. In similar brains, extracellular plaques contain one protein and intracellular tangles in cortical neurons contain a microtubule-associated protein.",
    question: "Which protein forms the intracellular tangles?",
    options: [
      "Hyperphosphorylated tau paired into helical filaments",
      "Amyloid-beta peptides packed into extracellular plaques",
      "Alpha-synuclein packed into Lewy bodies of the nigra",
      "Prion protein in spongiform cortical vacuoles",
      "Huntingtin aggregates in striatal neurons",
    ],
    correctAnswer: "Hyperphosphorylated tau paired into helical filaments",
    explanation: `## Why this answer is correct
Alzheimer disease has two aggregates. Amyloid-beta peptides, cleaved from amyloid precursor protein, form extracellular neuritic plaques. Hyperphosphorylated tau dissociates from microtubules and pairs into helical filaments that fill neurons as neurofibrillary tangles. Memory loss beginning with recent events and hippocampal atrophy match this illness, and the motor examination is spared early, unlike Parkinson disease.

## Why the other options are wrong
**Amyloid-beta peptides packed into extracellular plaques**
Amyloid-beta is the extracellular plaque protein. The question asks for the protein inside the neuronal tangles.

**Alpha-synuclein packed into Lewy bodies of the nigra**
Alpha-synuclein is the Lewy-body protein of Parkinson disease and dementia with Lewy bodies. This patient has no resting tremor or rigidity, and the lead deficit is hippocampal memory.

**Prion protein in spongiform cortical vacuoles**
Prion disease progresses over weeks to months with a spongiform cortex, not over three years of isolated memory failure with plaques and tangles.

**Huntingtin aggregates in striatal neurons**
Huntington disease is a caudate illness with chorea and psychiatric change in a younger adult, inherited by CAG expansion. It is not a late hippocampal amnestic syndrome.`,
  },
  {
    slug: "bn-03",
    domain: "behavioral-nervous",
    band: "medium",
    difficulty: 3,
    subjectId: "anatomy",
    blueprintTopic: "ms-pathology",
    topicCategory: "ms-pathology",
    citationTitle: "Multiple Sclerosis",
    scenario:
      "A 28-year-old woman has two episodes of neurologic deficit separated by months: numbness below the chest, then painful loss of vision in one eye that largely recovered. On examination, when she looks to the right the right eye abducts with nystagmus and the left eye does not adduct, yet convergence is preserved. MRI shows ovoid periventricular white-matter lesions. CSF has oligoclonal bands. The affected white-matter tracts have lost their myelin-forming cells.",
    question: "Which tract's demyelination produced the eye-movement finding?",
    options: [
      "The medial longitudinal fasciculus connecting gaze centers to the oculomotor nucleus",
      "The oculomotor nerve fascicle inside the midbrain, including pupil fibers and ptosis",
      "The abducens nucleus, so the ipsilateral eye cannot abduct",
      "The optic nerve, so the afferent limb of the light reflex is lost",
      "The frontal eye field, so voluntary saccades toward the lesion fail",
    ],
    correctAnswer: "The medial longitudinal fasciculus connecting gaze centers to the oculomotor nucleus",
    explanation: `## Why this answer is correct
A lesion of the medial longitudinal fasciculus disconnects the abducens nucleus from the contralateral oculomotor nucleus. On lateral gaze toward the side opposite the lesion, the abducting eye moves and shows nystagmus, while the adducting eye cannot, yet convergence (which does not use that internuclear pathway) is spared. This internuclear ophthalmoplegia in a young adult with relapsing deficits, periventricular plaques, and oligoclonal bands is multiple sclerosis. Oligodendrocytes are the myelin-forming cells that are lost in the plaques.

## Why the other options are wrong
**The oculomotor nerve fascicle inside the midbrain, including pupil fibers and ptosis**
A fascicular third-nerve lesion would impair adduction and usually the pupil or other third-nerve muscles, and convergence would not be selectively spared in this pattern.

**The abducens nucleus, so the ipsilateral eye cannot abduct**
The abducting eye is the one that moves. The failure is adduction of the opposite eye, which is an internuclear pattern, not abducens-nucleus failure.

**The optic nerve, so the afferent limb of the light reflex is lost**
Optic neuritis explains the earlier painful monocular vision loss. It does not disconnect horizontal gaze.

**The frontal eye field, so voluntary saccades toward the lesion fail**
A frontal eye-field lesion impairs saccades to the opposite side and causes a gaze preference. It does not produce dissociated adduction failure with preserved convergence.`,
  },
  {
    slug: "bn-04",
    domain: "behavioral-nervous",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "stroke-localization",
    topicCategory: "stroke-localization",
    citationTitle: "Lacunar Stroke",
    scenario:
      "A 68-year-old man with decades of poorly controlled hypertension suddenly cannot move the right face, arm, and leg equally. Sensation, vision, and language are intact, and there is no hemineglect. MRI shows a small infarct in the posterior limb of the left internal capsule and no cortical diffusion restriction. The penetrating arteries in this territory show lipohyalinosis. He was in sinus rhythm.",
    question: "Which vessel class infarcted, and why?",
    options: [
      "A small penetrating artery damaged by chronic hypertension",
      "An embolus from the carotid bifurcation into a cortical branch",
      "A cardiogenic embolus into the stem of the middle cerebral artery",
      "Thrombosis of a cortical vein over the motor strip",
      "Rupture of a lenticulostriate artery into the putamen",
    ],
    correctAnswer: "A small penetrating artery damaged by chronic hypertension",
    explanation: `## Why this answer is correct
Lipohyalinosis and microatheroma of small penetrating arteries are the hypertensive lesions that cause lacunes. A lacune in the posterior limb of the internal capsule interrupts corticospinal and corticobulbar fibers after they have gathered, so the face, arm, and leg are weak to a similar degree, while cortex-dependent functions (language, vision, sensation, attention) remain intact. The patient is in sinus rhythm and the cortex is spared, which argues against a large-artery or cardiac embolus.

## Why the other options are wrong
**An embolus from the carotid bifurcation into a cortical branch**
A cortical branch infarct would add cortical signs such as aphasia, neglect, or a sensory deficit that does not match a pure motor pattern, and imaging would restrict diffusion in cortex.

**A cardiogenic embolus into the stem of the middle cerebral artery**
Stem occlusion of the middle cerebral artery produces a large hemispheric syndrome, not a small capsular infarct with spared language and vision. He is in sinus rhythm.

**Thrombosis of a cortical vein over the motor strip**
Cortical venous thrombosis can cause a seizure or a deficit that does not respect arterial territories, often with hemorrhage. The lesion here is a small deep arterial infarct with lipohyalinosis.

**Rupture of a lenticulostriate artery into the putamen**
Rupture of a lenticulostriate artery is a hypertensive putaminal hemorrhage, which presents with headache, depressed consciousness, and a hematoma, not an ischemic lacune.`,
  },
  {
    slug: "bn-05",
    domain: "behavioral-nervous",
    band: "hard",
    difficulty: 5,
    subjectId: "biochemistry",
    blueprintTopic: "neurodegenerative",
    topicCategory: "thiamine",
    citationTitle: "Wernicke-Korsakoff Syndrome",
    scenario:
      "A 52-year-old man with alcohol use disorder is brought in confused, with bilateral abduction weakness and an ataxic gait. He has not eaten in days. Before thiamine is given, an intravenous glucose infusion is started. His confusion deepens and he develops upbeat nystagmus. MRI shows abnormal signal in the mammillary bodies and around the third ventricle and aqueduct. Transketolase activity in similar patients rises after addition of a cofactor.",
    question: "Why did glucose first make him worse?",
    options: [
      "Glucose metabolism consumed the remaining thiamine pyrophosphate",
      "Glucose osmotic shift dehydrated already swollen mammillary neurons",
      "Insulin release drove potassium into cells and stopped the heart",
      "Hyperglycemia precipitated sorbitol accumulation in Schwann cells",
      "The glucose load generated lactate that directly lysed myelin",
    ],
    correctAnswer: "Glucose metabolism consumed the remaining thiamine pyrophosphate",
    explanation: `## Why this answer is correct
Thiamine pyrophosphate is the cofactor for pyruvate dehydrogenase, alpha-ketoglutarate dehydrogenase, and transketolase. In a depleted patient, a glucose load pushes carbohydrate through steps that require that cofactor and can precipitate or worsen Wernicke encephalopathy. The clinical triad is confusion, ophthalmoplegia, and ataxia, and the mammillary bodies and periaqueductal gray are the vulnerable regions. Thiamine is given before glucose.

## Why the other options are wrong
**Glucose osmotic shift dehydrated already swollen mammillary neurons**
The injury is metabolic failure in thiamine-dependent neurons, not an osmotic dehydration from a glucose infusion. The imaging distribution matches Wernicke topography.

**Insulin release drove potassium into cells and stopped the heart**
Refeeding can shift potassium, but this patient's deterioration was worsening confusion and nystagmus, not an arrhythmia, and the cofactor assay points to thiamine.

**Hyperglycemia precipitated sorbitol accumulation in Schwann cells**
Sorbitol accumulation is a chronic mechanism of diabetic neuropathy. It does not acutely worsen mammillary and ocular findings in a malnourished patient.

**The glucose load generated lactate that directly lysed myelin**
Impaired pyruvate dehydrogenase can increase lactate locally, but the reason glucose is dangerous is consumption of the last thiamine cofactor in vulnerable neurons, not direct lysis of myelin by lactate.`,
  },
];

export const SOCIAL_ITEMS = [
  {
    slug: "ss-01",
    domain: "social-sciences",
    band: "easy",
    difficulty: 2,
    subjectId: "psychiatry",
    blueprintTopic: "ethics-consent",
    topicCategory: "ethics",
    citationTitle: "Informed Consent",
    scenario:
      "A 46-year-old man with a bleeding peptic ulcer understands that he may die without transfusion. He states the risks, the alternatives, and his reason: a long-held religious prohibition on receiving blood. He is alert, oriented, and not depressed, and he repeats the decision to two physicians. His adult children ask the team to transfuse him while he is sedated for endoscopy.",
    question: "Which action respects the ethical requirement?",
    options: [
      "Honor his refusal and treat with measures he still accepts",
      "Transfuse once he is sedated because the children consent",
      "Ask a court to override a decision the team considers unwise",
      "Document capacity and then follow the children's request",
      "Stop the rest of his care because he declined transfusion",
    ],
    correctAnswer: "Honor his refusal and treat with measures he still accepts",
    explanation: `## Why this answer is correct
A capacitated adult may refuse a treatment after the relevant risks, benefits, and alternatives have been discussed. This patient can restate the facts and his reasons, so the religious refusal is informed. The team continues every intervention he accepts and does not use sedation as a way to override him.

## Why the other options are wrong
**Transfuse once he is sedated because the children consent**
Family members do not outrank a capacitated patient's own decision, and sedation does not create permission to do what he refused.

**Ask a court to override a decision the team considers unwise**
Courts are not a route to replace a capacitated refusal simply because clinicians disagree with the values behind it.

**Document capacity and then follow the children's request**
Documenting capacity confirms that his decision stands. It is not a prelude to following a contrary family request.

**Stop the rest of his care because he declined transfusion**
Refusal of transfusion is not refusal of endoscopy, acid suppression, or other care he accepts. Treatment continues within the limits he set.`,
  },
  {
    slug: "ss-02",
    domain: "social-sciences",
    band: "medium",
    difficulty: 3,
    subjectId: "psychiatry",
    blueprintTopic: "ethics-consent",
    topicCategory: "ethics",
    citationTitle: "Sexually Transmitted Infections Treatment Guidelines, 2021",
    citationUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8344968/",
    citationMustInclude: ["parental consent", "STI"],
    citationLabel: "Workowski KA, et al. Sexually Transmitted Infections Treatment Guidelines, 2021. MMWR Recomm Rep. Adolescents may consent to their own STI services; no state requires parental consent for STI care.",
    scenario:
      "A 17-year-old boy asks to be tested after a new sexual partner and says his parents would punish him if they learned about it. He can explain what the test shows, how treatment works, and how to avoid another infection. He is not being coerced and is not in immediate danger. The applicable state statute lets a minor consent to care for a sexually transmitted infection. His father calls the clinic that afternoon and asks for the result.",
    question: "Which response matches the confidentiality rule that applies?",
    options: [
      "Test and treat him and keep the result confidential from his parents",
      "Refuse the visit until a parent signs the consent form",
      "Test him and then describe the result to his father",
      "Notify the school nurse so that attendance staff can follow up later",
      "Delay treatment until he turns 18 and can consent",
    ],
    correctAnswer: "Test and treat him and keep the result confidential from his parents",
    explanation: `## Why this answer is correct
Mature minors may consent to diagnosis and treatment of sexually transmitted infections under statutes that exist so adolescents will seek care. When the minor has capacity and is not in danger that requires disclosure, the result and the content of the visit stay confidential. The physician can speak with the father about general health without revealing this diagnosis.

## Why the other options are wrong
**Refuse the visit until a parent signs the consent form**
Parental signature is not required for this category of care when the minor consents and the law authorizes that consent.

**Test him and then describe the result to his father**
Testing and then disclosing defeats the confidentiality that makes minor consent meaningful, and no safety exception is present.

**Notify the school nurse so that attendance staff can follow up later**
The school is not the patient and has no role in this confidential clinical result.

**Delay treatment until he turns 18 and can consent**
He can consent now. Delaying treatment leaves an infection untreated and ignores the statute.`,
  },
  {
    slug: "ss-03",
    domain: "social-sciences",
    band: "hard",
    difficulty: 5,
    subjectId: "psychiatry",
    blueprintTopic: "ethics-consent",
    topicCategory: "ethics",
    citationTitle: "Duty to Warn",
    scenario:
      "A psychiatrist's patient with a psychotic disorder says he has bought a firearm and will shoot a named coworker in the parking garage tomorrow morning. He describes the coworker's car and the time the coworker arrives. He refuses voluntary hospitalization and says he will not come back. The threat is specific, the victim is identifiable, and the plan is imminent. No one else is in the room.",
    question: "Which duty now limits ordinary confidentiality?",
    options: [
      "Warn the identifiable coworker or notify law enforcement of the threat",
      "Keep the threat in the record and tell no one outside the treatment",
      "Call the patient's parents and leave the coworker unwarned",
      "Discharge him and end the duty because he left the session",
      "Warn uninvolved staff at the coworker's company through a mass message",
    ],
    correctAnswer: "Warn the identifiable coworker or notify law enforcement of the threat",
    explanation: `## Why this answer is correct
When a patient communicates a serious threat of physical violence against a reasonably identifiable victim, the clinician's duty to protect that person limits confidentiality. Warning the intended victim, notifying police, or both, and pursuing safe containment, are the protective steps recognized after Tarasoff. The threat here is specific, imminent, and aimed at a named person, so the duty is triggered. Hospitalization should also be pursued, but warning is not replaced by silence if he refuses care and leaves.

## Why the other options are wrong
**Keep the threat in the record and tell no one outside the treatment**
Ordinary confidentiality yields when an identifiable person faces an imminent serious threat. Recording the threat without acting does not discharge the duty to protect.

**Call the patient's parents and leave the coworker unwarned**
Notifying relatives is not a substitute for protecting the person who was named.

**Discharge him and end the duty because he left the session**
The duty arises from the threat, not from continued attendance. Ending the session does not end the obligation to the identifiable victim.

**Warn uninvolved staff at the coworker's company through a mass message**
The protective disclosure is directed to the identifiable victim and to law enforcement. A broadcast to uninvolved employees discloses more than the duty requires.`,
  },
  {
    slug: "ss-04",
    domain: "social-sciences",
    band: "hard",
    difficulty: 5,
    subjectId: "psychiatry",
    blueprintTopic: "ethics-consent",
    topicCategory: "ethics",
    citationTitle: "Dialysis Initiation for an Incapacitated Patient",
    citationUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC13676260/",
    citationMustInclude: ["substituted judgment", "incapacitated"],
    citationLabel: "Kidney International Reports. Substituted judgment uses an incapacitated patient's own wishes and is distinct from the best-interest standard.",
    scenario:
      "A 78-year-old man is permanently unconscious after a massive intracranial hemorrhage, with no chance of meaningful recovery according to two neurologists. He has no advance directive and no designated proxy. Over the past year he told his friends and his physician, on several documented occasions, that he would not want a ventilator if he could not recover awareness. His daughter, the only relative, says she would feel unbearable guilt if the ventilator were stopped and asks that it continue.",
    question: "Which standard should guide the decision?",
    options: [
      "Substituted judgment using his repeated prior statements",
      "The daughter's best-interest feeling about her own guilt",
      "Continuation of life-sustaining measures regardless of known prognosis",
      "A coin flip between the two family preferences",
      "The treatment the clinicians would want for themselves",
    ],
    correctAnswer: "Substituted judgment using his repeated prior statements",
    explanation: `## Why this answer is correct
When a patient lacks capacity and has no appointed surrogate, the decision-maker uses substituted judgment if the patient's own values are known: what he would choose. Repeated, specific statements refusing prolonged ventilation without a chance of awareness are that evidence. The daughter's guilt is a real emotion, but it describes her burden rather than his preference.

## Why the other options are wrong
**The daughter's best-interest feeling about her own guilt**
Best-interest reasoning is used when the patient's preferences are unknown, and even then it asks what benefits the patient, not what relieves the surrogate's guilt.

**Continuation of life-sustaining measures regardless of known prognosis**
There is no ethical rule that ventilation continues regardless of a known refusal and a prognosis of permanent unconsciousness.

**A coin flip between the two family preferences**
Random choice ignores available evidence of the patient's own wishes.

**The treatment the clinicians would want for themselves**
Clinicians' personal preferences are not the standard. The standard is the patient's previously stated choice.`,
  },
];

export const DEV_ITEMS = [
  {
    slug: "hd-01",
    domain: "human-development",
    band: "easy",
    difficulty: 2,
    subjectId: "anatomy",
    blueprintTopic: "embryology-abdominal-wall",
    topicCategory: "embryology",
    citationTitle: "Omphalocele",
    scenario:
      "A newborn has a midline abdominal-wall defect. A sac of amnion and peritoneum covers loops of bowel, and the umbilical cord inserts onto the apex of the sac. The defect is not to the side of an intact cord. Other anomalies are being sought. A second infant in the nursery has bowel protruding to the right of a normally inserted cord, with no covering membrane.",
    question: "Which embryonic event failed in the infant with the covered midline sac?",
    options: [
      "Return of the midgut from the umbilical cord after week 10",
      "Closure of the right lateral body wall beside an intact cord",
      "Obliteration of the vitelline duct on the antimesenteric ileum",
      "Partition of the cloaca into anorectal and urogenital canals",
      "Rotation of the ventral pancreatic bud around the duodenum",
    ],
    correctAnswer: "Return of the midgut from the umbilical cord after week 10",
    explanation: `## Why this answer is correct
The midgut physiologically herniates into the umbilical cord around week 6 and returns to the abdomen by week 10. If it fails to return, bowel remains in a sac of peritoneum and amnion at the cord insertion. That covered midline defect is an omphalocele, and it is associated with other congenital anomalies. The comparison infant, with uncovered bowel to the right of a normal cord, has gastroschisis, a different body-wall defect.

## Why the other options are wrong
**Closure of the right lateral body wall beside an intact cord**
Incomplete closure beside a normally inserted cord, without a membrane, describes gastroschisis. The infant in the question has a membrane and a cord that inserts on the sac.

**Obliteration of the vitelline duct on the antimesenteric ileum**
A vitelline-duct remnant is a Meckel diverticulum or a related umbilical anomaly. It does not leave a membrane-covered mass of bowel at the cord.

**Partition of the cloaca into anorectal and urogenital canals**
Cloacal septation defects produce anorectal and urogenital malformations, not an abdominal-wall sac of midgut.

**Rotation of the ventral pancreatic bud around the duodenum**
Abnormal rotation of the ventral pancreatic bud produces an annular pancreas and duodenal obstruction, not a covered umbilical defect.`,
  },
];

/** Cardiovascular items cv-10 through cv-18 (hard). */
export const CV_REST_ITEMS = [
  {
    slug: "cv-10",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "acs-pathophysiology",
    topicCategory: "acs-pathophysiology",
    citationTitle: "Left Ventricular Rupture",
    scenario:
      "A 70-year-old woman has an anterior ST-elevation infarction. On day 5 she clutches her chest and loses consciousness. The monitor shows organized QRS complexes, but no pulse is felt. Jugular veins are distended. A new murmur is absent. Bedside ultrasound shows a pericardial effusion and a collapsed right ventricle. The septum is intact.",
    question: "Which event produced the pulseless electrical activity?",
    options: [
      "Transmural free-wall rupture into the pericardial sac",
      "Rupture of a papillary muscle with acute mitral regurgitation",
      "Rupture of the interventricular septum with a left-to-right shunt",
      "Fibrinous pericarditis on the day after infarction",
      "Occlusion of the right ventricular marginal branch",
    ],
    correctAnswer: "Transmural free-wall rupture into the pericardial sac",
    explanation: `## Why this answer is correct
Coagulative necrosis of a transmural infarct is softest several days after occlusion, when macrophages are clearing debris and a scar has not formed. The free wall can then rupture into the pericardium, causing hemopericardium, tamponade, and pulseless electrical activity. An intact septum and the absence of a new murmur separate this from septal or papillary rupture.

## Why the other options are wrong
**Rupture of a papillary muscle with acute mitral regurgitation**
Papillary rupture produces a holosystolic murmur and pulmonary edema. There is no murmur here, and the new finding is a pericardial effusion with a collapsed right ventricle.

**Rupture of the interventricular septum with a left-to-right shunt**
Postinfarct septal rupture causes a harsh murmur and a ventricular shunt. The septum is intact.

**Fibrinous pericarditis on the day after infarction**
Early postinfarct pericarditis causes pain and a rub. It does not fill the pericardium with blood or cause sudden pulseless electrical activity on day 5.

**Occlusion of the right ventricular marginal branch**
Right-ventricular infarction presents at the time of the coronary occlusion, with clear lungs and a pressure-sensitive right ventricle, not a new effusion days later.`,
  },
  {
    slug: "cv-11",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "heart-failure-pathophysiology",
    topicCategory: "pericardial-disease",
    citationTitle: "Cardiac Tamponade",
    scenario:
      "A 45-year-old man with lung cancer has progressive dyspnea. Blood pressure is 88/70 mm Hg and falls further on inspiration. Heart sounds are distant, and jugular venous pressure is elevated without a visible y descent. ECG shows low voltage and electrical alternans. Catheterization shows equalization of diastolic pressures in the right atrium, right ventricle, and left ventricle.",
    question: "Why do the diastolic pressures equalize?",
    options: [
      "A tense pericardial effusion caps the total cardiac volume",
      "A rigid scar stops filling after the early diastolic phase",
      "Left ventricular failure raises end-diastolic pressure in isolation",
      "Pulmonary embolism raises right-sided pressures above left-sided pressures",
      "Constrictive calcification lets filling start and then halt",
    ],
    correctAnswer: "A tense pericardial effusion caps the total cardiac volume",
    explanation: `## Why this answer is correct
In tamponade the pericardial sac is filled under pressure, so the heart cannot expand. Diastolic pressures in the chambers equalize at the pericardial pressure. Inspiration exaggerates ventricular interdependence, producing pulsus paradoxus. The y descent is blunted because atrial emptying is impaired throughout diastole. Electrical alternans reflects the heart swinging in fluid.

## Why the other options are wrong
**A rigid scar stops filling after the early diastolic phase**
That is constriction: early filling is rapid (prominent y descent) and then stops. Tamponade impairs filling for the whole of diastole, so the y descent is absent.

**Left ventricular failure raises end-diastolic pressure in isolation**
Isolated left-sided failure elevates left ventricular end-diastolic pressure above the right-sided pressures. Equalization across chambers is the tamponade pattern.

**Pulmonary embolism raises right-sided pressures above left-sided pressures**
Acute cor pulmonale elevates right-sided pressures. It does not equalize left ventricular diastolic pressure or cause electrical alternans.

**Constrictive calcification lets filling start and then halt**
Constriction has a knock and a steep y descent. The tracing here has no y descent and shows a swinging heart in fluid.`,
  },
  {
    slug: "cv-12",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "heart-failure-pathophysiology",
    topicCategory: "pericardial-disease",
    citationTitle: "Constrictive Pericarditis",
    scenario:
      "A 50-year-old man treated for tuberculosis years ago has edema and exertional dyspnea. Jugular venous pressure rises with inspiration. A diastolic knock is heard. The y descent is steep. Simultaneous ventricular tracings show discordance: left-ventricular systolic pressure falls when right-ventricular systolic pressure rises during inspiration. The pericardium is calcified. There is no pericardial effusion.",
    question: "What limits ventricular filling in this illness?",
    options: [
      "A rigid pericardial shell halts filling after a rapid early phase",
      "Fluid under pressure equalizes diastolic chamber pressures throughout diastole",
      "Myocardial stiffness from infiltrative protein restricts both ventricles together",
      "Pulmonary vascular obstruction limits left-heart preload",
      "Tamponade physiology from a slowly accumulating sterile effusion",
    ],
    correctAnswer: "A rigid pericardial shell halts filling after a rapid early phase",
    explanation: `## Why this answer is correct
A scarred, often calcified pericardium sets a hard limit on total cardiac volume. Early diastolic filling is rapid, which produces the steep y descent and the knock, and then filling stops abruptly. Inspiration still increases right-heart filling inside the shell, so the septum shifts left and left-ventricular systolic pressure falls (discordance). Kussmaul sign is the failure of venous pressure to fall with inspiration.

## Why the other options are wrong
**Fluid under pressure equalizes diastolic chamber pressures throughout diastole**
That is tamponade, which blunts the y descent and requires an effusion. There is no effusion here, and the y descent is steep.

**Myocardial stiffness from infiltrative protein restricts both ventricles together**
Restrictive cardiomyopathy can mimic constriction clinically, but ventricular systolic pressures move in parallel with respiration rather than showing discordance, and the pericardium is not calcified.

**Pulmonary vascular obstruction limits left-heart preload**
Pulmonary vascular disease raises right-sided pressure. It does not calcify the pericardium or produce a knock with discordant ventricular pressures.

**Tamponade physiology from a slowly accumulating sterile effusion**
No effusion is present. The constraint is a fibrocalcific shell, not fluid.`,
  },
  {
    slug: "cv-13",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "atherosclerosis-mechanisms",
    topicCategory: "aortic-dissection",
    citationTitle: "Aortic Dissection",
    scenario:
      "A 28-year-old man with long arms, arachnodactyly, and upward lens dislocation has sudden tearing chest pain radiating to the back. Blood pressure differs between the arms. A diastolic murmur is new. CT shows an intimal flap beginning just above the aortic valve and extending into the arch. Histology of the aortic media from similar patients shows cystic medial degeneration.",
    question: "Which protein defect weakened the aortic media?",
    options: [
      "Fibrillin-1, which scaffolds elastic fibers in the media",
      "Type I collagen, which weakens bone more than elastic arteries",
      "Type IV collagen, which is the epidermal basement-membrane protein",
      "Dystrophin, which links myocyte actin to the sarcolemma",
      "Spectrin, which supports the red-cell membrane skeleton",
    ],
    correctAnswer: "Fibrillin-1, which scaffolds elastic fibers in the media",
    explanation: `## Why this answer is correct
Marfan syndrome is caused by dominant mutations in fibrillin-1. Faulty microfibrils weaken elastic lamellae in the aortic media, producing cystic medial degeneration. The ascending aorta dilates and can dissect, often with aortic regurgitation when the flap undermines a commissure. Lens dislocation and the body habitus are the same connective-tissue disorder.

## Why the other options are wrong
**Type I collagen, which weakens bone more than elastic arteries**
Type I collagen defects cause osteogenesis imperfecta. The hallmark is brittle bones and blue sclerae, not ectopia lentis with ascending dissection as the lead presentation.

**Type IV collagen, which is the epidermal basement-membrane protein**
Type IV collagen is defective in Alport syndrome (kidney, ear, eye) and is a basement-membrane protein, not the elastic-fiber scaffold of the aortic media. Epidermolysis bullosa affects type VII collagen more typically for dermal anchoring fibrils.

**Dystrophin, which links myocyte actin to the sarcolemma**
Dystrophin loss causes Duchenne or Becker muscular dystrophy. The aorta is not the failing structure.

**Spectrin, which supports the red-cell membrane skeleton**
Spectrin defects cause hereditary spherocytosis. They do not weaken the aortic media.`,
  },
  {
    slug: "cv-14",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "atherosclerosis-mechanisms",
    topicCategory: "embolism",
    citationTitle: "Paradoxical Embolism",
    scenario:
      "A 29-year-old woman on a combined oral contraceptive develops sudden left-arm weakness and aphasia one week after a long flight. The left leg is swollen. Venous ultrasound shows a femoral-vein thrombus. Brain imaging shows an acute left middle-cerebral-artery infarct. A bubble study shows bubbles crossing into the left atrium within three beats when she performs a Valsalva release. No carotid stenosis is present.",
    question: "How did venous thrombus reach the cerebral artery?",
    options: [
      "A transient right-to-left atrial pressure gradient opened a foramen ovale",
      "The thrombus crossed a ventricular septal defect during systole",
      "Pulmonary capillaries let the intact thrombus pass into the pulmonary veins",
      "A pulmonary arteriovenous malformation was required for the crossing",
      "Retrograde flow up the jugular vein carried the clot to the brain",
    ],
    correctAnswer: "A transient right-to-left atrial pressure gradient opened a foramen ovale",
    explanation: `## Why this answer is correct
A patent foramen ovale is a flap that stays closed when left atrial pressure exceeds right atrial pressure. Valsalva release, or acute right-heart strain, briefly reverses that gradient. Venous thrombus can then cross into the left atrium and travel out the aorta to the brain. The leg thrombus and the immediate atrial-level bubble crossing document that route.

## Why the other options are wrong
**The thrombus crossed a ventricular septal defect during systole**
Bubbles crossed at the atrial level within three beats. A ventricular defect would not produce that atrial shunt.

**Pulmonary capillaries let the intact thrombus pass into the pulmonary veins**
Systemic veins drain to the pulmonary arteries. An intact thrombus is trapped in the pulmonary arterial bed; it does not cross capillary filters. The bubbles crossed at the atrium, before the lungs.

**A pulmonary arteriovenous malformation was required for the crossing**
A pulmonary arteriovenous malformation can cause paradoxical embolism, but delayed left-heart bubbles appear after a pulmonary transit time. Crossing within three beats is atrial.

**Retrograde flow up the jugular vein carried the clot to the brain**
Jugular venous blood flows toward the heart. A leg thrombus does not climb the jugular vein into a cerebral artery.`,
  },
  {
    slug: "cv-15",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "pharmacology",
    blueprintTopic: "arrhythmia-electrophysiology",
    topicCategory: "arrhythmia-electrophysiology",
    citationTitle: "Wolff-Parkinson-White Syndrome",
    scenario:
      "A 24-year-old man with a known short PR interval and a delta wave presents with palpitations. The ECG shows an irregular wide-complex tachycardia at 240 beats per minute. He is hypotensive. A colleague suggests intravenous verapamil to slow conduction through the atrioventricular node. The accessory pathway has a short refractory period.",
    question: "Why is atrioventricular-node blockade hazardous here?",
    options: [
      "More impulses would reach the ventricle over the accessory pathway",
      "Verapamil would lengthen the accessory-pathway refractory period",
      "Slowing the node would convert this rhythm to a stable sinus rhythm",
      "The drug would close the accessory pathway by blocking sodium channels",
      "Nodal blockade would stop atrial impulses from entering the pathway",
    ],
    correctAnswer: "More impulses would reach the ventricle over the accessory pathway",
    explanation: `## Why this answer is correct
In atrial fibrillation with an accessory pathway, some atrial impulses already travel down the pathway and some down the node. Blocking the atrioventricular node removes a route that was absorbing impulses and can send a larger fraction down the pathway. If the pathway recovers quickly, the ventricular rate can accelerate toward ventricular fibrillation. A drug that slows the pathway itself, such as procainamide, is the appropriate pharmacologic direction in a stable patient; an unstable patient needs cardioversion.

## Why the other options are wrong
**Verapamil would lengthen the accessory-pathway refractory period**
Verapamil is a calcium-channel blocker aimed at nodal tissue. It does not usefully prolong refractoriness in a fast accessory pathway, and that is not why it is dangerous.

**Slowing the node would convert this rhythm to a stable sinus rhythm**
Nodal blockers do not restore sinus rhythm in preexcited atrial fibrillation, and they can accelerate the ventricular response.

**The drug would close the accessory pathway by blocking sodium channels**
Sodium-channel block is the action of procainamide on the pathway, not the action of verapamil.

**Nodal blockade would stop atrial impulses from entering the pathway**
The pathway connects atrium to ventricle independently of the node. Blocking the node does not close the atrial insertion of the pathway.`,
  },
  {
    slug: "cv-16",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "arrhythmia-electrophysiology",
    topicCategory: "arrhythmia-electrophysiology",
    citationTitle: "Long QT Syndrome",
    scenario:
      "A 31-year-old woman has a syncopal episode after her physician starts a drug known to block the rapid delayed-rectifier potassium current. Serum potassium is 2.9 mEq/L. The corrected QT interval is 560 ms. Telemetry around the faint shows polymorphic ventricular tachycardia whose QRS axis twists around the baseline, beginning after a pause.",
    question: "Which membrane event triggered the tachycardia?",
    options: [
      "Early afterdepolarizations during a prolonged phase of repolarization",
      "Delayed afterdepolarizations from calcium overload in diastole",
      "Phase-0 sodium current block slowing conduction through ischemic scar",
      "Accelerated phase-4 depolarization in a pulmonary-vein sleeve",
      "A reentry circuit around an accessory atrioventricular pathway",
    ],
    correctAnswer: "Early afterdepolarizations during a prolonged phase of repolarization",
    explanation: `## Why this answer is correct
The rapid delayed-rectifier current (IKr) carries much of phase-3 repolarization. Blocking it, especially when extracellular potassium is low, prolongs the action potential. Membrane potential can then oscillate before repolarization finishes (early afterdepolarizations), triggering torsades de pointes. A preceding pause makes the next action potential even longer, which is why the rhythm is pause-dependent.

## Why the other options are wrong
**Delayed afterdepolarizations from calcium overload in diastole**
Delayed afterdepolarizations occur after repolarization is complete and underlie digoxin-toxic and catecholaminergic tachycardias. They are not the pause-dependent oscillations of a long QT interval.

**Phase-0 sodium current block slowing conduction through ischemic scar**
Sodium-channel block slows phase 0 and can create monomorphic reentry around scar. This patient has drug-induced QT prolongation and polymorphic pause-dependent tachycardia, not an ischemic scar circuit.

**Accelerated phase-4 depolarization in a pulmonary-vein sleeve**
Pulmonary-vein automaticity triggers atrial fibrillation. It does not prolong the QT interval or produce torsades.

**A reentry circuit around an accessory atrioventricular pathway**
An accessory pathway causes preexcitation and atrioventricular reentry. It does not lengthen phase 3 or twist the QRS around the baseline after a pause.`,
  },
  {
    slug: "cv-17",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "atherosclerosis-mechanisms",
    topicCategory: "atherosclerosis-mechanisms",
    citationTitle: "Atherosclerosis",
    scenario:
      "A 59-year-old man collapses with an anterior ST-elevation infarction. He had exertional chest pressure for two weeks. The culprit coronary lesion is a 40 percent stenosis with a large lipid core. Microscopy shows a thin fibrous cap infiltrated by macrophages at a ruptured shoulder, with occlusive thrombus in contact with the core. Smooth-muscle cells in the cap are sparse.",
    question: "Which cap event allowed the thrombus to form?",
    options: [
      "Macrophage metalloproteinases degraded the thin fibrous cap",
      "Endothelial nitric oxide thickened the cap until it calcified",
      "Smooth-muscle proliferation sealed the core with collagen",
      "Platelets aggregated on an intact cap and then embolized",
      "Vasospasm of the vasa vasorum ruptured an adventitial vein",
    ],
    correctAnswer: "Macrophage metalloproteinases degraded the thin fibrous cap",
    explanation: `## Why this answer is correct
A thin-cap fibroatheroma ruptures at the shoulder, where macrophages secrete matrix metalloproteinases that digest collagen. Exposure of the thrombogenic lipid core, including tissue factor, triggers an occlusive platelet-fibrin thrombus. The angiographic stenosis can be modest before rupture, which is why a 40 percent lesion can still cause ST-elevation infarction.

## Why the other options are wrong
**Endothelial nitric oxide thickened the cap until it calcified**
Nitric oxide is antithrombotic and vasodilatory. It does not thicken a cap into a rupture-prone lesion, and calcification is not the event that exposed this core.

**Smooth-muscle proliferation sealed the core with collagen**
Smooth-muscle cells stabilize plaques by laying down collagen. This cap is depleted of smooth muscle, which is why it was fragile.

**Platelets aggregated on an intact cap and then embolized**
The histology shows a ruptured cap with thrombus in contact with the core. Superficial erosion can thrombose an intact cap, but that is not the lesion described.

**Vasospasm of the vasa vasorum ruptured an adventitial vein**
Plaque rupture is an intimal fibrous-cap event driven by inflammation in the wall of the plaque, not rupture of an adventitial vein.`,
  },
  {
    slug: "cv-18",
    domain: "cardiovascular",
    band: "hard",
    difficulty: 5,
    subjectId: "pharmacology",
    blueprintTopic: "atherosclerosis-mechanisms",
    topicCategory: "coronary-physiology",
    citationTitle: "Dipyridamole",
    scenario:
      "A 66-year-old man undergoes a pharmacologic stress test because he cannot walk on a treadmill. Dipyridamole is infused. Nuclear images show a new perfusion defect in the inferior wall, while the anterior wall appears more intensely perfused than at rest. Angiography later shows an 80 percent stenosis of a dominant right coronary artery and mild plaque elsewhere. He had no chest pain at rest.",
    question: "Why did the stenotic territory lose relative perfusion?",
    options: [
      "Arteriolar dilation in healthy beds diverted flow away from the stenosis",
      "Dipyridamole constricted the stenotic artery and spared the healthy arteries",
      "The drug raised heart rate enough to close the right coronary orifice",
      "Healthy-wall collaterals thrombosed during the infusion",
      "Venodilation dropped preload until the inferior wall became ischemic at rest",
    ],
    correctAnswer: "Arteriolar dilation in healthy beds diverted flow away from the stenosis",
    explanation: `## Why this answer is correct
Dipyridamole blocks cellular adenosine reuptake, so adenosine dilates coronary arterioles. Downstream of a tight stenosis the arterioles are already dilated at rest to preserve flow, so they cannot dilate further. Healthy beds do dilate, their resistance falls, and perfusion pressure distal to the stenosis drops. Flow is therefore redistributed toward the healthy wall (coronary steal), and a relative perfusion defect appears in the stenotic territory.

## Why the other options are wrong
**Dipyridamole constricted the stenotic artery and spared the healthy arteries**
The drug dilates resistance vessels. It does not selectively constrict the stenotic epicardial artery.

**The drug raised heart rate enough to close the right coronary orifice**
Adenosine can cause a modest heart-rate change, but the defect is from redistribution of arteriolar flow, not mechanical closure of a coronary orifice.

**Healthy-wall collaterals thrombosed during the infusion**
No thrombosis is required. The images change because resistance falls in nonstenotic beds during the infusion.

**Venodilation dropped preload until the inferior wall became ischemic at rest**
The inferior defect appeared during pharmacologic stress, and the anterior wall became hyperemic. Rest symptoms were absent, and the mechanism is coronary redistribution rather than preload collapse.`,
  },
];

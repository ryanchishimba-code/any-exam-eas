"""Step 1 nervous-system and behavioral items. Highest-yield traps. Correct answer is options[0] only as stored; position is the authored order."""

ITEMS = []


def add(topic, diff, scenario, question, options, key, expl, ref, subject="neurology"):
    assert key in options and len(options) == 5 and len(set(options)) == 5
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
    "Spinal cord hemisection",
    4,
    "A 27-year-old man is stabbed in the back. The blade enters the left side of the cord at about T8. Two days later the left leg is weak, vibration and joint position are gone in the left foot, and pain and temperature are lost on the right from about T10 downward. The right leg is strong and the left trunk still feels pinprick.",
    "Which pattern of tract damage explains these findings?",
    [
        "Left lateral corticospinal and left dorsal columns at T8, plus right spinothalamic fibers that crossed a level or two below entry",
        "Right motor cortex, because weakness is always contralateral to the lesion",
        "A complete cord transection, with spinal shock explaining the asymmetry",
        "Left spinothalamic tract only, because pain loss is the localizing sign",
        "Right dorsal columns, because proprioception loss is contralateral in the cord",
    ],
    "Left lateral corticospinal and left dorsal columns at T8, plus right spinothalamic fibers that crossed a level or two below entry",
    "Hemisection hits the already-crossed lateral corticospinal tract and the uncrossed dorsal columns on the same side, so motor and vibration loss are ipsilateral. Spinothalamic fibers cross in the anterior white commissure within one or two segments of entry, so pain and temperature loss is contralateral and begins slightly below the lesion. Right motor cortex is the trap if you apply the brainstem crossing rule inside the cord; the corticospinal tract has already crossed in the medulla. A complete transection would weaken both legs and wipe sensation on both sides. Left spinothalamic damage alone would not cause ipsilateral paralysis or dorsal-column loss. Dorsal-column fibers do not cross until the medulla, so proprioceptive loss is ipsilateral, not right-sided.",
    "guyton-14",
)

add(
    "Lateral medullary syndrome",
    5,
    "A 62-year-old man with atrial fibrillation has sudden vertigo, hiccups, and a hoarse voice. The right side of his face has lost pain and temperature, the left body has lost pain and temperature, and the right palate does not rise. There is no hemiparesis. A student localizes this to the right middle cerebral artery because the face is involved.",
    "Which vessel and which spared tract best fit?",
    [
        "Right vertebral or PICA territory, with the corticospinal tract spared in the medial medulla",
        "Right MCA superior division, with the face area of the cortex infarcted",
        "Left medial medulla, because the body findings are contralateral",
        "Right AICA with lateral pontine hearing loss as the required feature",
        "Anterior spinal artery, because the medulla is supplied only by that vessel",
    ],
    "Right vertebral or PICA territory, with the corticospinal tract spared in the medial medulla",
    "Ipsilateral face pain loss, contralateral body pain loss, nucleus ambiguus (hoarseness, palate), and vestibular nuclei without hemiparesis are lateral medulla. The pyramid is medial, so vertebral or PICA infarction spares strength; that missing hemiparesis is what excludes a cortical stroke. MCA would cause contralateral face and arm weakness, not crossed pain loss or a hoarse palate. Left medial medulla would cause contralateral arm and leg weakness and ipsilateral tongue weakness, not this sensory cross. AICA is lateral pons and typically adds hearing loss from the labyrinthine artery; hearing is not the finding here. The anterior spinal artery supplies medial medulla, not the lateral tegmentum.",
    "robbins-10",
)

add(
    "Medial medullary syndrome",
    4,
    "A 70-year-old woman develops right arm and leg weakness with preserved face strength, loss of vibration in the right limbs, and a left tongue that deviates to the left. Pinprick on the body is intact.",
    "Where is the lesion?",
    [
        "Left medial medulla, affecting the pyramid, medial lemniscus, and hypoglossal nerve",
        "Right motor cortex, arm and leg area, sparing the face",
        "Left lateral medulla, because the tongue is a cranial nerve",
        "Right medial medulla, because the weak limbs are on the right",
        "Left internal capsule, which explains an ipsilateral tongue",
    ],
    "Left medial medulla, affecting the pyramid, medial lemniscus, and hypoglossal nerve",
    "The hypoglossal nerve exits medially and is ipsilateral, so a left tongue means a left lesion. The pyramid has not yet reached the spinal cord but has already been destined to cross, so left pyramid damage weakens the right arm and leg and spares the face, whose corticobulbar fibers have left higher up. The medial lemniscus has already crossed, so vibration loss is also contralateral. Right cortex would not deviate the tongue to the left or spare pain while killing vibration in this pattern. Lateral medulla spares the pyramid and hits spinothalamic and nucleus ambiguus, not the tongue. Right medial medulla would point the tongue right and weaken the left limbs. An internal-capsule lesion does not hit the peripheral hypoglossal nerve.",
    "guyton-14",
)

add(
    "Pupil-involving third nerve",
    5,
    "A 48-year-old woman has a dilated left pupil that reacts poorly to light, with the eye down and out and ptosis. She has a sudden severe headache. Glucose is normal and there is no painless chronic course. A colleague says diabetic microvascular ischemia and plans observation.",
    "Which mechanism makes observation the wrong plan?",
    [
        "A posterior communicating artery aneurysm compresses the dorsomedial parasympathetic fibers before the motor fibers",
        "Diabetic ischemia hits the superficial parasympathetic fibers first, so the pupil is the earliest sign",
        "The trochlear nerve is the one that dilates the pupil",
        "A cavernous sinus lesion would dilate the pupil and spare every other eye movement",
        "Uncal herniation dilates the contralateral pupil first",
    ],
    "A posterior communicating artery aneurysm compresses the dorsomedial parasympathetic fibers before the motor fibers",
    "Parasympathetic pupillary fibers travel on the outside of the third nerve, so extrinsic compression from a PCOM aneurysm dilates the pupil early and is a surgical emergency, especially with a thunderclap headache. Diabetic microvascular ischemia affects the central motor fibers and typically spares the pupil, so 'pupil involved, therefore diabetes, observe' reverses the rule. The trochlear nerve depresses and intorts; it does not carry pupillary parasympathetics. Cavernous sinus disease hits III, IV, V1, V2, and VI together, not an isolated down-and-out eye. Uncal herniation compresses the ipsilateral third nerve, not the opposite pupil first.",
    "robbins-10",
)

add(
    "Internuclear ophthalmoplegia",
    4,
    "A 31-year-old woman has diplopia on right gaze. The left eye does not adduct, and the right eye abducts with nystagmus. Convergence is preserved. She had a prior episode of unilateral vision loss that recovered.",
    "Which tract is damaged, and why is convergence spared?",
    [
        "Left medial longitudinal fasciculus; convergence uses a midbrain pathway that bypasses the MLF",
        "Left oculomotor nerve; convergence and adduction share that nerve so both must fail",
        "Right abducens nucleus, which would paralyze ipsilateral gaze entirely",
        "Right medial longitudinal fasciculus, on the side of the abducting eye",
        "Optic nerve, because a prior episode of vision loss means the lesion is ocular",
    ],
    "Left medial longitudinal fasciculus; convergence uses a midbrain pathway that bypasses the MLF",
    "The MLF links the abducens nucleus to the contralateral oculomotor nucleus for conjugate gaze. A left MLF lesion blocks left adduction on right gaze while the right eye abducts and beats; multiple sclerosis is the classic cause in a young adult, fitting her prior optic neuritis. Convergence is intact because that signal reaches medial rectus neurons without the MLF, which is how INO is separated from an oculomotor palsy. A left third-nerve palsy would also lose convergence, pupil control, and depression. A right abducens nucleus lesion would prevent both eyes from looking right. The MLF is named for the eye that fails to adduct, not the abducting eye. A prior optic neuritis does not cause a gaze disconjugate pattern.",
    "robbins-10",
)

add(
    "Homonymous hemianopia with macular sparing",
    4,
    "A 66-year-old man has a right homonymous hemianopia. The central few degrees of the right field are spared in both eyes. Motor strength is normal. The occipital pole is intact on the clinical story you are given; the infarct is in the left occipital lobe but not at the pole.",
    "Why is the macula spared?",
    [
        "The occipital pole, which sees the macula, has collateral flow from the middle cerebral artery",
        "The optic chiasm has been cut, which always spares central vision",
        "A left temporal lobe lesion hits Meyer loop and spares the macula by definition",
        "Macular fibers never reach the occipital cortex",
        "The right eye's blindness is monocular, so the left eye compensates at the macula",
    ],
    "The occipital pole, which sees the macula, has collateral flow from the middle cerebral artery",
    "PCA infarction of the visual cortex causes a contralateral homonymous hemianopia. The macula is mapped at the occipital pole, which often stays alive through MCA collateral, so central vision is spared. A chiasm lesion causes a bitemporal field cut, not a homonymous one. Meyer loop in the temporal lobe causes a contralateral superior quadrantanopia without this macular story. Macular fibers do reach the occipital pole. The defect is the same in both eyes, so it is not monocular blindness with the other eye filling in.",
    "guyton-14",
)

add(
    "Cavernous sinus",
    5,
    "A 44-year-old woman with poorly controlled diabetes has fever, a swollen left eye, and double vision. The left eye cannot abduct. Forehead and cheek sensation are reduced. The pupil is involved and the eyelid droops. A nasal furuncle was squeezed two days ago.",
    "Which combination is in the cavernous sinus, and which nerve is typically affected first by stretch?",
    [
        "III, IV, V1, V2, and VI, with VI affected early because it is free in the sinus",
        "II only, because orbital swelling is an optic nerve problem",
        "VII and VIII, because facial pain and eye movement share the facial canal",
        "V3 and XII, because jaw and tongue sensation travel through the sinus",
        "The abducens nerve outside the sinus and a spared trigeminal nerve",
    ],
    "III, IV, V1, V2, and VI, with VI affected early because it is free in the sinus",
    "Septic cavernous sinus thrombosis from a facial danger-zone infection inflames the structures in the sinus: III, IV, V1, V2, and VI, plus the carotid sympathetics. VI lies free in the lumen and is often the first ocular motor nerve to fail, which matches the abducting palsy plus forehead and cheek numbness. The optic nerve is in the orbit, not the sinus, and would cut acuity rather than this combination. VII and VIII are in the temporal bone. V3 exits the foramen ovale and does not traverse the cavernous sinus. A pure abducens palsy without V1 or V2 loss is not this picture.",
    "robbins-10",
)

add(
    "Uncal herniation",
    5,
    "A 19-year-old man is unconscious after a motorcycle crash. The right pupil becomes dilated and fixed while the left pupil is still small. CT shows a right epidural hematoma and early right uncal herniation. Blood pressure later rises as the pulse slows.",
    "What is being compressed, and what does the later vital-sign change mean?",
    [
        "The right oculomotor nerve against the tentorium; Cushing triad means rising intracranial pressure and brainstem compression",
        "The left oculomotor nerve, because herniation always dilates the opposite pupil",
        "The right abducens nerve, which carries the parasympathetic pupil fibers",
        "Isolated cortical blindness, which dilates one pupil and slows the pulse",
        "A Horner syndrome, which dilates the ipsilateral pupil",
    ],
    "The right oculomotor nerve against the tentorium; Cushing triad means rising intracranial pressure and brainstem compression",
    "The uncus of the temporal lobe herniates through the tentorial notch and compresses the ipsilateral third nerve, so the pupil on the side of the mass dilates first. Hypertension and bradycardia are the Cushing response to brainstem ischemia from high intracranial pressure, a late and dangerous sign. The contralateral pupil is the trap; the first dilated pupil is ipsilateral. The abducens nerve does not carry pupillary parasympathetics. Cortical blindness does not fix one pupil or cause Cushing physiology. Horner syndrome constricts the pupil and adds ptosis and anhidrosis; it does not dilate it.",
    "robbins-10",
)

add(
    "Epidural versus subdural",
    4,
    "A 22-year-old man is hit in the temple, loses consciousness, wakes and talks, then deteriorates over two hours. The pupil on the side of the blow dilates. A second patient, an older adult with a fall a week ago, has a fluctuating headache and a crescentic collection that crosses suture lines but not the falx.",
    "Which vessels and which spaces fit these two patients?",
    [
        "Middle meningeal artery in the potential epidural space; bridging veins in the subdural space",
        "Bridging veins for the lucid-interval hematoma; middle meningeal artery for the week-old crescent",
        "Both are subarachnoid hemorrhage from a ruptured berry aneurysm",
        "Both are intraparenchymal hypertensive bleeds in the putamen",
        "The lucid interval is a subdural hygroma from a torn arachnoid granulation",
    ],
    "Middle meningeal artery in the potential epidural space; bridging veins in the subdural space",
    "A temporal blow, lucid interval, and rapid decline are arterial epidural bleeding from the middle meningeal artery under the pterion. A slower, fluctuating bleed in an older patient is venous, from bridging veins torn in the subdural space; the collection is crescentic and can cross sutures. Swapping the vessels is the usual miss. Aneurysmal subarachnoid blood sits in cisterns and presents with thunderclap pain, not these two time courses. Hypertensive putamen bleeds are inside the brain. A hygroma is not the arterial lucid-interval hematoma.",
    "robbins-10",
)

add(
    "CSF resorption versus obstruction",
    4,
    "A 74-year-old man has a magnetic gait, urinary incontinence, and forgetfulness. Lumbar puncture opening pressure is normal and ventricles are large out of proportion to the sulci. A second patient, an infant, has a huge head, a sunset gaze, and imaging that stops the aqueduct.",
    "Which mechanisms match?",
    [
        "Impaired arachnoid granulation resorption with a normal pressure; aqueduct obstruction with trapped lateral and third ventricles",
        "Both are noncommunicating hydrocephalus from choroid plexus overproduction",
        "The adult has Alzheimer disease, which enlarges ventricles by sulcal atrophy in the same pattern",
        "The infant has a Dandy-Walker malformation as the only cause of aqueduct stenosis",
        "Both need a third ventriculostomy because granulation failure is treated by bypassing the aqueduct",
    ],
    "Impaired arachnoid granulation resorption with a normal pressure; aqueduct obstruction with trapped lateral and third ventricles",
    "Normal-pressure hydrocephalus is communicating: CSF gets out of the ventricles but is not resorbed at the arachnoid granulations, so pressure is normal or only briefly high and the clinical triad is gait, incontinence, and dementia. Aqueduct stenosis blocks flow out of the third ventricle, so the lateral and third ventricles enlarge and the fourth does not; that is noncommunicating. Choroid plexus papilloma can overproduce CSF but is not the mechanism of either classic case. Alzheimer atrophy enlarges sulci as well as ventricles, which is the imaging contrast with NPH. Dandy-Walker is a different posterior-fossa malformation, not the definition of aqueduct stenosis. Third ventriculostomy bypasses an aqueduct block; it is not the logic for granulation failure.",
    "guyton-14",
)

# Last items so batch 2 has 56 cardiovascular and 44 respiratory-renal.

add(
    domain="cardiovascular", subject="physiology", topic="atrial-systole-duration",
    task="mechanism", difficulty=2, src="os-19-3", nutrition=False,
    fact="Atrial systole lasts about 100 ms and ends before ventricular systole. It contributes the last 20 to 30 percent of ventricular filling.",
    forbid=["100 ms"],
    vignette=(
        "A 44-year-old woman who edits film has atrial contraction timed at about a tenth of a second. Temperature "
        "is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. It ends before "
        "the ventricles contract and adds the last fraction of ventricular filling. Most of the filling has "
        "already occurred."
    ),
    stem="Which of the following is that brief atrial contraction?",
    options=[
        "The brief topping-up that finishes ventricular volume",
        "The constant-volume phase while all valves are shut",
        "The ejection of 70 to 80 mL into the great arteries",
        "The closure of the aortic and pulmonary valves",
        "The long unresponsive phase of a ventricular cell",
    ],
    key=0,
    whys=[
        "Atrial systole lasts about 100 ms, ends before ventricular systole, and supplies the remaining 20 to 30 percent of filling. Her atrial contraction is that short topping-up, after most filling has already happened.",
        "Constant volume with all valves shut is isovolumic contraction, which is ventricular, not this atrial topping-up.",
        "Ejection of 70 to 80 mL is ventricular stroke volume.",
        "Aortic and pulmonary closure is S2, at the start of ventricular relaxation.",
        "The long unresponsive phase is the ventricular refractory period, not atrial contraction.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="fibrous-pericardium-anchors",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The fibrous pericardium is tough dense connective tissue that protects the heart and holds it in place in the thorax.",
    forbid=["fibrous pericardium"],
    vignette=(
        "A 61-year-old man who repairs docks has the outer sac of the heart opened. Temperature is 36.6°C, pulse "
        "is 74/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. The outer layer of the sac is "
        "tough connective tissue. It holds the heart in position. A more delicate layer inside it faces the "
        "fluid space."
    ),
    stem="Which of the following is that tough outer layer?",
    options=[
        "The layer that protects the heart and holds its position",
        "The muscle layer that ejects the stroke volume",
        "The flat-cell lining continuous with the aorta",
        "The thin pouch on the outside of each atrium",
        "The fluid that reduces rubbing during each beat",
    ],
    key=0,
    whys=[
        "The fibrous pericardium is tough dense connective tissue. It protects the heart and maintains its position. His outer sac layer is that tough tissue, with a more delicate layer facing the fluid space.",
        "The myocardium is the muscle of the wall, not the outer sac.",
        "The endocardium is the endothelial lining of the chambers.",
        "The auricle is the atrial appendage, not the sac.",
        "The serous fluid is what the space contains. It is not the tough outer layer.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="heart-in-mediastinum",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The heart lies in the mediastinum, between the lungs. The pericardium separates it from other mediastinal structures. The base is posterior toward the vertebrae. The anterior surface is deep to the sternum.",
    forbid=["mediastinum"],
    vignette=(
        "A 27-year-old man who teaches drums has the heart sitting in the middle of the chest, between the lungs, "
        "in its own sac. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is "
        "118/72 mm Hg. The back of the heart is near the vertebral bodies. The front is deep to the breastbone."
    ),
    stem="Which of the following is this middle-chest location between the lungs?",
    options=[
        "The central compartment, with the heart in its own sac",
        "The pleural space, with pressure 4 mm Hg below the alveoli",
        "The peritoneal cavity that lies behind the stomach",
        "The cranial cavity, beside the respiratory neurons",
        "The retroperitoneal space, beside the pancreas",
    ],
    key=0,
    whys=[
        "The heart lies in the mediastinum, medial between the lungs, inside the pericardium. The dorsal surface is near the vertebrae and the anterior surface is deep to the sternum. His description matches.",
        "The pleural cavity is around the lungs, not the compartment that contains the heart in its sac.",
        "The pancreas lies in the retroperitoneum behind the stomach. That is not the chest.",
        "Respiratory neurons are in the medulla, not the compartment between the lungs.",
        "The pancreas is retroperitoneal. The heart is in the chest.",
    ],
)

add(
    domain="cardiovascular", subject="pathology", topic="patent-foramen-not-closed",
    task="mechanism", difficulty=3, src="os-19-1", nutrition=False,
    fact="Patent foramen ovale occurs when the septum primum does not close the foramen ovale after birth. It may be silent. It is usually found by a murmur and confirmed by echocardiography.",
    forbid=["patent foramen", "septum primum"],
    vignette=(
        "A 25-year-old woman who runs road races has a soft murmur and an echocardiogram. Temperature is 36.6°C, "
        "pulse is 62/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. The flap that should have "
        "sealed the opening between the atria after birth did not fuse. She has no cyanosis and no exercise limit. "
        "The opening is small."
    ),
    stem="Which of the following is the usual next recognition of this small opening?",
    options=[
        "It was heard as a murmur and confirmed by ultrasound of the heart",
        "It always requires immediate surgery in an asymptomatic adult",
        "It is the vessel that still joins the aorta to the pulmonary trunk",
        "It is a narrow aorta at the site of a fetal arterial cord",
        "It is an extra sound just before the first heart sound",
    ],
    key=0,
    whys=[
        "Patent foramen ovale is failure of the septum primum to close the foramen ovale. It is often silent. It is typically detected as a murmur and confirmed by echocardiography. She is unlimited, not cyanotic, and the opening is small, so monitoring rather than immediate surgery fits the benign form.",
        "The source says that in non-life-threatening cases it is better to monitor than to operate. Immediate surgery is not the usual step for a small silent opening.",
        "A vessel between the aorta and the pulmonary trunk is a patent ductus arteriosus.",
        "A narrow aorta at the ligamentum arteriosum is coarctation.",
        "A sound just before S1 is S4, from atrial contraction into a stiff ventricle.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="holter-twenty-four-hours",
    task="mechanism", difficulty=2, src="os-19-2", nutrition=False,
    fact="A Holter monitor is a portable recorder of the heart's electrical activity, typically worn for 24 hours during ordinary activity.",
    forbid=["holter", "24"],
    vignette=(
        "A 58-year-old man who walks a mail route has occasional palpitations that never appear in the office. "
        "Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 132/80 mm Hg. "
        "He is given a small battery-powered recorder to wear through a full day and night of his usual route."
    ),
    stem="Which of the following is this recorder for?",
    options=[
        "Heart electrical activity through a full day of ordinary activity",
        "A single 10-second office tracing and nothing more",
        "Blood pressure only, with no electrical recording",
        "The lung volumes measured during one forced exhalation",
        "The oxygen saturation of hemoglobin in fetal blood",
    ],
    key=0,
    whys=[
        "A Holter monitor records cardiac electrical activity continuously, typically for 24 hours, during ordinary activity. His palpitations are absent in the office, so a full day on his route is the matching test.",
        "A standard office ECG is a short tracing. It has already missed his symptoms.",
        "The recorder is for electrical activity, not blood pressure alone.",
        "Lung volumes are spirometry, not a wearable heart-rhythm recorder.",
        "Fetal hemoglobin affinity is a laboratory property, not this wearable recording.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="coronary-vessels-in-sulci",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="Major coronary vessels lie in fat-filled grooves, the sulci. The coronary sulcus is between the atria and ventricles. The anterior interventricular sulcus is on the front between the ventricles.",
    forbid=["sulcus", "sulci"],
    vignette=(
        "A 63-year-old woman who teaches piano has fat-filled grooves on the heart surface. Temperature is "
        "36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. One deep groove "
        "circles between the upper and lower chambers. Another runs down the front between the two lower chambers. "
        "The main arteries to the heart muscle travel in these grooves."
    ),
    stem="Which of the following travels in these grooves?",
    options=[
        "The vessels that nourish the myocardium",
        "The four veins that return blood from the lungs",
        "The pacemaker cells with the fastest inherent rate",
        "The fibrous sac that anchors the heart",
        "The flap that seals the opening between the atria",
    ],
    key=0,
    whys=[
        "Major coronary vessels lie in the fat-filled sulci. The deep coronary sulcus is between atria and ventricles, and the anterior interventricular sulcus is on the front between the ventricles. Her grooves match, and the heart-muscle arteries run there.",
        "The four pulmonary veins enter the left atrium. They are not the vessels in the surface grooves between the chambers.",
        "The SA node is in the superior posterior right atrium, not a vessel in a surface groove.",
        "The fibrous pericardium is the outer sac.",
        "The septum primum is the flap of the foramen ovale, inside the atrial septum.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="endothelin-vasoconstrictor",
    task="mechanism", difficulty=3, src="os-19-1", nutrition=False,
    fact="Endothelial cells of the endocardium and coronary capillaries release endothelins, which are potent vasoconstrictors and normally balance other constrictors and dilators.",
    forbid=["endothelin"],
    vignette=(
        "A 41-year-old man who studies vessels has peptides released by the lining of the heart chambers and by "
        "the capillaries inside the heart muscle. Temperature is 36.6°C, pulse is 70/min, respirations are "
        "14/min, and blood pressure is 122/74 mm Hg. The peptides strongly narrow arterioles. In health they are "
        "balanced by peptides that widen arterioles."
    ),
    stem="Which of the following cells release these narrowing peptides?",
    options=[
        "The endothelial cells of the inner surface and the small vessels",
        "The contractile muscle cells that form most of the wall",
        "The scarce cells that start the electrical impulse",
        "The mesothelial cells that secrete the fluid around the heart",
        "The type II cells that lower alveolar surface tension",
    ],
    key=0,
    whys=[
        "Endothelium of the endocardium and of the coronary capillaries releases endothelins, potent vasoconstrictors that normally balance dilators. His peptides come from the chamber lining and the heart-muscle capillaries and narrow arterioles.",
        "Contractile myocardial cells pump blood. They are not the lining source of these peptides.",
        "Conducting cells start the impulse. They are not the endothelial source.",
        "Epicardial mesothelium secretes pericardial fluid, not these vasoconstrictor peptides.",
        "Type II alveolar cells secrete surfactant in the lung.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="twelve-lead-ten-electrodes",
    task="mechanism", difficulty=2, src="os-19-2", nutrition=False,
    fact="A 12-lead electrocardiograph uses 10 electrodes: six on the chest and four on the limbs. A lead is the voltage between two electrodes.",
    forbid=["12-lead", "ten electrodes"],
    vignette=(
        "A 56-year-old woman who catalogs maps has six stickers on the chest and one sticker on each limb. "
        "Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. "
        "The machine records twelve voltage differences. Each recorded difference is between two stickers, not "
        "a picture of one sticker alone."
    ),
    stem="Which of the following is one recorded voltage difference?",
    options=[
        "The potential measured across a pair of skin contacts",
        "The pressure generated inside the left ventricle",
        "The oxygen saturation of arterial hemoglobin",
        "The volume moved by one quiet breath at rest",
        "The sound of the atrioventricular valves closing",
    ],
    key=0,
    whys=[
        "A lead is the voltage difference between two electrodes. A 12-lead recording uses 10 electrodes, six on the chest and four on the limbs, and produces twelve such differences. Her sticker count and twelve recordings match.",
        "Left ventricular pressure is a catheter measurement, not a voltage between skin electrodes.",
        "Oxygen saturation is oximetry, not an electrocardiographic lead.",
        "A quiet breath is tidal volume, about 500 mL.",
        "AV valve closure is the first heart sound.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="ventricular-systole-duration",
    task="mechanism", difficulty=3, src="os-19-3", nutrition=False,
    fact="Ventricular systole lasts about 270 ms and follows the QRS. Ventricular diastole lasts about 430 ms and begins with the T wave.",
    forbid=["270", "430"],
    vignette=(
        "A 35-year-old man who rows has ventricular contraction timed from the large electrical deflection until "
        "relaxation begins. Temperature is 36.5°C, pulse is 58/min, respirations are 12/min, and blood pressure "
        "is 118/70 mm Hg. That contraction interval is shorter than the relaxation that follows it. Relaxation "
        "starts as the recovery wave begins."
    ),
    stem="Which of the following is the longer interval?",
    options=[
        "The T-deflection interval, which outlasts contraction",
        "Ventricular contraction, beginning after the large deflection",
        "Atrial contraction, the brief topping-up of the ventricles",
        "The brief pause inside the lower atrial node",
        "The spread from the apex through the ventricular muscle",
    ],
    key=0,
    whys=[
        "Ventricular diastole lasts about 430 ms and starts with the T wave. Ventricular systole lasts about 270 ms and follows the QRS. Relaxation is the longer interval, and it begins with the recovery wave, as in his tracing.",
        "Ventricular contraction is the shorter of the two, about 270 ms.",
        "Atrial systole is about 100 ms, a brief topping-up, not the long relaxation.",
        "The AV-node pause is about 100 ms.",
        "Spread through ventricular muscle after the bundle branches is about 75 ms.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="expiration-left-murmur",
    task="mechanism", difficulty=3, src="os-19-3", nutrition=False,
    fact="Expiration can amplify left-sided murmurs. Inspiration increases right-heart flow and can amplify right-sided murmurs.",
    forbid=["expiration", "exhale"],
    vignette=(
        "A 20-year-old woman who plays flute has a murmur at the apex that gets louder when she breathes out and "
        "softer when she breathes in. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood "
        "pressure is 110/68 mm Hg. A different murmur at the upper left sternal edge does the opposite."
    ),
    stem="Which of the following side is suggested by the murmur that grows as she breathes out?",
    options=[
        "The left-sided chambers of the heart",
        "The right-sided chambers of the heart",
        "Only the vein that drains the heart muscle",
        "Only the thin pouches on the two atria",
        "The pericardial sac, outside the chambers",
    ],
    key=0,
    whys=[
        "Expiration can make left-sided murmurs louder. Her apical murmur grows when she breathes out, so it is the left-sided one. The upper-sternal murmur that does the opposite fits the right side, which inspiration can amplify.",
        "Right-sided murmurs get louder on inspiration, which is the other murmur, not the apical one.",
        "The coronary sinus is a vein. It is not localized by this breathing maneuver.",
        "Auricles are atrial appendages. The maneuver separates right-sided from left-sided murmurs.",
        "Pericardial rub is not the breathing pattern that separates right-heart from left-heart murmurs.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="quiet-inspiration-muscles",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Quiet inspiration uses the diaphragm, which moves down, and the external intercostals, which lift the ribs up and out.",
    forbid=["external intercostal"],
    vignette=(
        "A 23-year-old man who sits to study takes a normal breath at rest. Temperature is 36.6°C, pulse is "
        "64/min, respirations are 12/min, and blood pressure is 112/68 mm Hg. One muscle descends toward the "
        "abdomen. Muscles between the ribs lift the cage up and out. He is not using his neck muscles."
    ),
    stem="Which of the following muscles are doing this quiet breath in?",
    options=[
        "The diaphragm and the outer muscles between the ribs",
        "The abdominal wall and the inner muscles between the ribs",
        "Only the neck muscles that lift the upper ribs",
        "Smooth muscle lying inside each individual alveolus",
        "The thick muscle layer of the ventricles",
    ],
    key=0,
    whys=[
        "Quiet inspiration uses the diaphragm, which moves inferiorly, and the external intercostals, which raise the ribs. He is at rest, the diaphragm descends, the ribs rise, and the neck muscles are not in use.",
        "Abdominal muscles and internal intercostals are for forced expiration.",
        "Scalenes are accessory muscles for forced inspiration. He is not using the neck.",
        "Alveoli have no muscle that expands them. The chest wall does that.",
        "The heart muscle does not enlarge the thorax for a quiet breath.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="lungs-are-passive",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="The lungs are passive during breathing. Pleural fluid sticks the lung to the chest wall, so the lung is pulled open when the wall moves out and is compressed when the wall recoils.",
    forbid=["passive"],
    vignette=(
        "A 30-year-old woman who teaches violin has the chest wall move outward. Temperature is 36.6°C, pulse is "
        "70/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The lung follows the wall even "
        "though the lung itself has no role in creating that movement. A thin fluid layer sticks the lung surface "
        "to the wall."
    ),
    stem="Which of the following makes the lung follow the wall?",
    options=[
        "The fluid layer sticking the lung surface to the chest wall",
        "Muscle inside the lung contracting with the diaphragm",
        "Surfactant increasing surface tension on purpose",
        "Carbon dioxide pumped into the alveoli by ATP",
        "The aortic valve opening during inspiration",
    ],
    key=0,
    whys=[
        "The lungs are passive. Pleural fluid adheres the lung to the thoracic wall, so outward wall movement pulls the lung open and recoil compresses it. Her lung follows the wall without making the movement itself.",
        "There is no breathing muscle inside the lung. The diaphragm and intercostals move the wall.",
        "Surfactant lowers surface tension so alveoli do not collapse. It does not stick the lung to the chest wall.",
        "Airflow follows pressure. ATP does not pump carbon dioxide in as the wall moves.",
        "The aortic valve is a cardiac valve. It does not couple the lung to the chest wall.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="scalenes-forced-inspiration",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Forced inspiration uses neck muscles, including the scalenes, which lift the chest wall and increase lung volume.",
    forbid=["scalene"],
    vignette=(
        "A 19-year-old man who sprints the last 100 meters lifts his upper chest with the muscles of his neck. "
        "Temperature is 37.2°C, pulse is 160/min, respirations are 32/min, and blood pressure is 148/70 mm Hg. "
        "The extra lift enlarges the thorax beyond a quiet breath. He is breathing in, not pushing air out."
    ),
    stem="Which of the following is the role of those neck muscles?",
    options=[
        "They lift the chest wall for a deeper breath in",
        "They compress the ribs to force air out",
        "They are the only muscles used in quiet breathing",
        "They secrete the film that keeps alveoli open",
        "They set the heart rate at 80 to 100 beats per minute",
    ],
    key=0,
    whys=[
        "During forced inspiration the scalenes and other neck muscles lift the thoracic wall and increase lung volume. He is sprinting and breathing in, with the neck lifting the upper chest.",
        "Compressing the ribs to force air out is the internal intercostals and abdominal muscles during forced expiration.",
        "Quiet inspiration uses the diaphragm and external intercostals, not the neck.",
        "Type II alveolar cells secrete surfactant.",
        "The SA node, not neck muscles, has an intrinsic rate near 80 to 100.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="vital-capacity-excludes-residual",
    task="mechanism", difficulty=3, src="os-22-3", nutrition=False,
    fact="Vital capacity is tidal volume plus inspiratory reserve plus expiratory reserve. It excludes residual volume. It is about 4000 to 5000 mL.",
    forbid=["vital capacity"],
    vignette=(
        "A 28-year-old man who plays trumpet moves as much air as he can, from a full breath in to a full breath "
        "out. Temperature is 36.6°C, pulse is 68/min, respirations are 12/min, and blood pressure is 118/72 mm Hg. "
        "The volume he moves is the quiet breath plus the extra he can inhale plus the extra he can exhale. Air "
        "that can never be exhaled is not included. The moved volume is 4.6 L."
    ),
    stem="Which of the following volumes are included?",
    options=[
        "The quiet breath and both extra volumes he can still move",
        "Only the air that remains after a maximal exhalation",
        "The quiet breath plus the air that can never leave",
        "Every volume the lung can hold, including trapped air",
        "Only the half-liter moved by one quiet breath",
    ],
    key=0,
    whys=[
        "Vital capacity is tidal volume plus inspiratory reserve plus expiratory reserve, and it excludes residual volume. His 4.6 L is inside the stated 4000 to 5000 mL range, and he left out the air that can never be exhaled.",
        "Air remaining after a maximal exhalation is residual volume, which is excluded.",
        "Adding residual volume to the quiet breath is not vital capacity.",
        "The sum of all volumes, including residual volume, is total lung capacity.",
        "About 500 mL is tidal volume alone, far below the 4.6 L he moved.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="peripheral-chemoreceptor-site",
    task="anatomy", difficulty=2, src="os-22-3", nutrition=False,
    fact="Peripheral chemoreceptors are in the carotid arteries and the aortic arch. Central chemoreceptors are in the brain and brainstem.",
    forbid=["carotid", "aortic arch"],
    vignette=(
        "A 46-year-old man who teaches anatomy has sensors that sample blood going to the head and blood just as "
        "it leaves the left ventricle into the great artery. Temperature is 36.6°C, pulse is 72/min, respirations "
        "are 14/min, and blood pressure is 122/74 mm Hg. Those sensors report to the brainstem. A different set "
        "of sensors sits inside the brain itself."
    ),
    stem="Which of the following sensors are outside the brain in this description?",
    options=[
        "Sensors on the arteries to the head and the great artery",
        "Sensors that sit inside the brain and the brainstem",
        "Type II alveolar cells on the lining of the alveoli",
        "The pacemaker cells beside the superior vena cava",
        "The stretch receptors only, with no chemical role",
    ],
    key=0,
    whys=[
        "Peripheral chemoreceptors are in the carotid arteries and the aortic arch, outside the brain. Central chemoreceptors are in the brain and brainstem. His outside sensors sample blood to the head and blood leaving into the great artery.",
        "Sensors inside the brain are the central chemoreceptors, which he distinguished from the outside set.",
        "Type II cells secrete surfactant. They are not the arterial chemical sensors.",
        "The SA node is the cardiac pacemaker, not a chemoreceptor.",
        "Lung stretch receptors inform the dorsal respiratory group, but the sensors he located are on arteries.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="morphine-slows-breathing",
    task="mechanism", difficulty=3, src="os-22-3", nutrition=False,
    fact="Morphine can depress the respiratory centers and decrease the respiratory rate.",
    forbid=["morphine"],
    vignette=(
        "A 40-year-old man who is postoperative is hard to arouse. Temperature is 36.4°C, pulse is 62/min, "
        "respirations are 6/min, and blood pressure is 100/60 mm Hg. He received a drug known to blunt the "
        "brainstem centers that drive the diaphragm. His chest still moves when he does breathe, and the airway "
        "is open."
    ),
    stem="Which of the following is the drug effect on breathing?",
    options=[
        "The brainstem centers fire less often, so the rate falls",
        "The tongue blocks the airway while the centers fire normally",
        "Type II cells stop making the anti-collapse film",
        "Hemoglobin holds carbon monoxide instead of oxygen",
        "The pleural space pressure rises above alveolar pressure",
    ],
    key=0,
    whys=[
        "Morphine can depress the respiratory centers and slow the rate. He is hard to arouse, the rate is 6/min, the chest still moves when he breathes, and the airway is open, so the failure is the drive, not obstruction.",
        "An open airway and absent effort point away from a tongue-blocked airway with a normal drive.",
        "Surfactant loss collapses alveoli. It is not this drug effect on the brainstem.",
        "Carbon monoxide occupies heme. It is not the drug that blunted his respiratory centers.",
        "Intrapleural pressure normally stays below alveolar pressure. That is not the drug effect described.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="warmth-unloads-oxygen",
    task="mechanism", difficulty=3, src="os-22-5", nutrition=False,
    fact="A higher temperature promotes oxygen dissociation from hemoglobin. A lower temperature inhibits it. Active tissues release more heat.",
    forbid=["dissociation"],
    vignette=(
        "A 24-year-old woman who rows has one muscle much warmer than a resting muscle. Temperature of that "
        "muscle is 38.5°C, pulse is 150/min, respirations are 30/min, and blood pressure is 146/68 mm Hg. At the "
        "same oxygen pressure and the same pH, oxygen leaves hemoglobin faster in the warmer muscle."
    ),
    stem="Which of the following does the extra warmth do?",
    options=[
        "It makes oxygen leave hemoglobin more readily",
        "It makes oxygen bind hemoglobin more tightly",
        "It is the Bohr effect, which is a pH change",
        "It raises hemoglobin's affinity the way fetal blood does",
        "It converts carbon dioxide into nitrogen",
    ],
    key=0,
    whys=[
        "A higher temperature promotes dissociation of oxygen from hemoglobin. Her warmer muscle unloads oxygen faster at the same oxygen pressure and the same pH, so the effect is heat, not acidity.",
        "A lower temperature inhibits dissociation, which would hold oxygen on hemoglobin.",
        "The Bohr effect is the pH effect. pH was the same in the comparison.",
        "Fetal hemoglobin has a higher affinity and holds oxygen more tightly. Warmth does the opposite.",
        "Nothing in the transport pathway converts carbon dioxide into nitrogen.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="co2-binds-globin-not-iron",
    task="mechanism", difficulty=3, src="os-22-5", nutrition=False,
    fact="About 20 percent of carbon dioxide binds amino acids on globin, not the iron of heme, forming carbaminohemoglobin.",
    forbid=["globin", "carbamino"],
    vignette=(
        "A 39-year-old man who teaches chemistry tracks carbon dioxide inside a red cell. Temperature is 36.6°C, "
        "pulse is 72/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. About a fifth of the "
        "carbon dioxide is attached to the protein portion of hemoglobin. It is not attached to the iron. Oxygen "
        "is using the iron sites."
    ),
    stem="Which of the following is where this fraction of carbon dioxide attaches?",
    options=[
        "Amino acids of the protein part, not the iron",
        "The iron in heme, the same site oxygen uses",
        "The plasma only, as dissolved gas, for this fifth",
        "The alveolar type II cell, as surfactant",
        "The chloride channel, in exchange for bicarbonate",
    ],
    key=0,
    whys=[
        "About 20 percent of carbon dioxide binds amino acid groups on globin to form carbaminohemoglobin. It does not bind heme iron. Oxygen is on the iron in his red cell, and about a fifth of the carbon dioxide is on the protein part.",
        "The iron site is for oxygen. Carbon dioxide uses globin.",
        "Dissolved carbon dioxide is about 7 to 10 percent, a different fraction from this protein-bound fifth.",
        "Surfactant is secreted by type II cells. It is not a carbon dioxide binding site.",
        "The chloride shift exchanges chloride for bicarbonate. It is not where this protein-bound fraction attaches.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="dissolved-oxygen-small-fraction",
    task="mechanism", difficulty=2, src="os-22-5", nutrition=False,
    fact="Only about 1.5 percent of oxygen is dissolved in blood. The rest is carried on hemoglobin.",
    forbid=["1.5", "dissolved"],
    vignette=(
        "A 22-year-old woman who swims distance has arterial blood drawn. Temperature is 36.5°C, pulse is "
        "56/min, respirations are 12/min, and blood pressure is 106/64 mm Hg. A tiny share of the oxygen is free "
        "in the plasma. Nearly all of the oxygen is attached to the iron-containing protein in red cells. "
        "Saturation of that protein is 98 percent."
    ),
    stem="Which of the following is the tiny share free in plasma?",
    options=[
        "A small minority of the oxygen, the rest being protein-bound",
        "Most of the oxygen, with little left on the protein",
        "Most of the carbon dioxide, carried in ionic form",
        "The nitrogen load that appears during an ordinary breath",
        "The carbon monoxide that occupies heme after exhaust exposure",
    ],
    key=0,
    whys=[
        "Only about 1.5 percent of oxygen is dissolved. The rest is on hemoglobin. Her plasma fraction is the tiny share, saturation is 98 percent, and the protein in red cells holds nearly all of it.",
        "The protein-bound fraction is the large one, not the plasma fraction.",
        "About 70 percent of carbon dioxide travels as bicarbonate. That is a different gas.",
        "Nitrogen dissolves very little at ordinary pressure. It is not this oxygen fraction.",
        "Carbon monoxide is an abnormal occupant of heme, not the normal dissolved share of oxygen.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="dalton-partial-pressures",
    task="mechanism", difficulty=2, src="os-22-4", nutrition=False,
    fact="Dalton's law: each gas in a mixture exerts its own partial pressure, and the total pressure is the sum of the partial pressures. Atmospheric pressure at sea level is 760 mm Hg.",
    forbid=["dalton", "partial pressure"],
    vignette=(
        "A 19-year-old man who studies weather measures room air at sea level. Temperature is 36.6°C, pulse is "
        "70/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. Nitrogen, oxygen, water, and carbon "
        "dioxide each push independently. Added together, those pushes equal 760 mm Hg."
    ),
    stem="Which of the following is the rule he is using?",
    options=[
        "Each gas pushes on its own, and the pushes add to the total",
        "Only oxygen pushes, and the other gases do not",
        "Pressure rises when the volume of a gas rises",
        "A gas dissolves in proportion to how cold the liquid is",
        "Oxygen leaves hemoglobin faster when pH rises",
    ],
    key=0,
    whys=[
        "Dalton's law says each gas exerts its own partial pressure and the total is the sum. Sea-level atmospheric pressure is 760 mm Hg. His gases add to that total.",
        "Nitrogen, water, and carbon dioxide also exert partial pressures. Oxygen is not the only gas.",
        "Boyle's law is the inverse of volume and pressure. Pressure does not rise when volume rises.",
        "Henry's law ties dissolved amount to partial pressure and solubility, not simply to cold.",
        "A higher pH inhibits oxygen dissociation. A lower pH promotes it. That is not the adding of gas pressures.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="alveolar-oxygen-gradient",
    task="mechanism", difficulty=3, src="os-22-4", nutrition=False,
    fact="Alveolar oxygen partial pressure is about 104 mm Hg. Oxygen in the incoming pulmonary capillary blood is about 40 mm Hg. The difference of about 64 mm Hg drives oxygen into the blood.",
    forbid=["104", "64"],
    vignette=(
        "A 31-year-old woman who bikes to class has alveolar air and incoming lung-capillary blood compared. "
        "Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. "
        "Oxygen pressure in the alveoli is much higher than oxygen pressure in the blood just arriving from the "
        "right heart. Oxygen moves into that blood."
    ),
    stem="Which of the following drives oxygen into the arriving blood?",
    options=[
        "Higher oxygen pressure in the alveoli than in that blood",
        "Higher oxygen pressure in that blood than in the alveoli",
        "An ATP-driven pump sitting in the alveolar lining",
        "Binding of oxygen onto amino acids of the globin",
        "Constriction of bronchioles by high alveolar oxygen",
    ],
    key=0,
    whys=[
        "Alveolar oxygen is about 104 mm Hg and incoming capillary oxygen is about 40 mm Hg, a difference of about 64 mm Hg. Oxygen diffuses from the higher alveolar pressure into the blood. Her comparison shows that direction.",
        "If blood oxygen pressure were higher, oxygen would not enter the blood from the alveoli.",
        "Diffusion across the respiratory membrane does not use ATP.",
        "Oxygen binds heme iron, not globin. Globin is the carbon dioxide site. Binding is not what sets the direction across the membrane.",
        "High alveolar oxygen dilates pulmonary arterioles. It is not a signal that constricts bronchioles.",
    ],
)

add(
    domain="respiratory-renal", subject="anatomy", topic="pulmonary-artery-deoxygenated",
    task="anatomy", difficulty=2, src="os-22-4", nutrition=False,
    fact="The pulmonary artery carries deoxygenated blood from the heart to the lungs. Pulmonary veins return oxygenated blood to the heart.",
    forbid=["pulmonary artery"],
    vignette=(
        "A 16-year-old boy who is learning circulation follows blood that has just left the right ventricle. "
        "Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. "
        "The blood is oxygen-poor. It is heading toward the alveolar capillaries. After the exchange, oxygen-rich "
        "blood returns to the left atrium."
    ),
    stem="Which of the following vessel carries the oxygen-poor blood he is following?",
    options=[
        "The artery that runs from the right ventricle toward the lungs",
        "The veins that return blood from the lungs to the left atrium",
        "The aorta after the blood leaves the left ventricle",
        "The coronary sinus, as it enters the right atrium",
        "The vessel that should have closed between the great arteries",
    ],
    key=0,
    whys=[
        "The pulmonary artery carries deoxygenated blood from the right ventricle into the lungs. He is following oxygen-poor blood that just left the right ventricle toward the alveoli.",
        "The pulmonary veins carry oxygenated blood back to the left atrium, which is the return trip, not the oxygen-poor trip.",
        "The aorta carries oxygenated systemic blood from the left ventricle.",
        "The coronary sinus returns myocardial venous blood to the right atrium. It is not the path from the right ventricle to the alveoli.",
        "A patent ductus joins the aorta and the pulmonary trunk. It is not the normal path of oxygen-poor blood out of the right ventricle.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="hemoglobin-saturation-range",
    task="mechanism", difficulty=2, src="os-22-5", nutrition=False,
    fact="In a healthy person with normal hemoglobin, saturation is generally 95 to 99 percent. One hundred percent means every heme is occupied.",
    forbid=["saturation"],
    vignette=(
        "A 25-year-old woman who is healthy has a finger probe reading 98 percent while breathing room air. "
        "Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. "
        "Hemoglobin concentration is normal. The reading is the share of available iron sites that have oxygen."
    ),
    stem="Which of the following is a usual reading in this setting?",
    options=[
        "Between 95 and 99 percent of iron sites occupied",
        "About 70 percent, the share carried as bicarbonate",
        "About 1.5 percent, the share dissolved in plasma",
        "About 20 percent, the share of carbon dioxide on globin",
        "Below 50 percent, because she is at rest",
    ],
    key=0,
    whys=[
        "Healthy saturation with normal hemoglobin is generally 95 to 99 percent. One hundred percent would mean every heme is occupied. Her 98 percent on room air is inside that range.",
        "About 70 percent is the share of carbon dioxide carried as bicarbonate, not oxygen saturation.",
        "About 1.5 percent is the dissolved fraction of oxygen, not the percent of heme sites occupied.",
        "About 20 percent is carbaminohemoglobin's share of carbon dioxide.",
        "Resting arterial blood is highly saturated. A value below 50 percent is not the healthy room-air reading.",
    ],
)

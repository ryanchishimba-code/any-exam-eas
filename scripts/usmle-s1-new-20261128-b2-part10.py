# Final cardiovascular and respiratory-renal items for batch 2.

add(
    domain="respiratory-renal", subject="physiology", topic="partial-versus-full-saturation",
    task="mechanism", difficulty=2, src="os-22-5", nutrition=False,
    fact="Hemoglobin is saturated when all four heme sites hold oxygen. It is partially saturated when one to three sites are occupied.",
    forbid=["saturated", "partially"],
    vignette=(
        "A 27-year-old man who studies blood has two hemoglobin samples from the same draw. Temperature is 36.6°C, pulse is "
        "70/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Sample A has every iron site "
        "occupied. Sample B has only two of the four iron sites occupied. He is healthy and at rest."
    ),
    stem="Which of the following describes sample B?",
    options=[
        "Only some of the iron sites on the protein hold oxygen",
        "Every iron site on the protein holds oxygen",
        "Oxygen is bound to globin instead of iron",
        "It is the dissolved plasma fraction of oxygen",
        "It is carbon dioxide traveling as bicarbonate",
    ],
    key=0,
    whys=[
        "Hemoglobin with one to three of four heme sites occupied is partially saturated. Sample B has two of four iron sites occupied, so only some sites hold oxygen.",
        "Every site occupied is the fully saturated state, which is sample A.",
        "Oxygen binds heme iron, not globin. Globin is where carbon dioxide binds.",
        "Dissolved oxygen is the roughly 1.5 percent plasma fraction, not a count of iron sites.",
        "Bicarbonate is the main carriage form of carbon dioxide, not a description of iron sites.",
    ],
)


add(
    domain="cardiovascular", subject="anatomy", topic="av-valve-cusp-count",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The right atrioventricular valve is the tricuspid valve. The left atrioventricular valve is the mitral, or bicuspid, valve.",
    forbid=["tricuspid", "mitral", "bicuspid"],
    vignette=(
        "A 20-year-old man who studies anatomy compares the two valves between atria and ventricles. Temperature "
        "is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The valve on "
        "the side that receives the venae cavae has three cusps. The valve on the side that receives the "
        "pulmonary veins has two."
    ),
    stem="Which of the following is the two-cusp valve?",
    options=[
        "The valve into the ventricle that ejects to the body",
        "The valve into the ventricle that ejects to the lungs",
        "The valve at the entrance of the pulmonary trunk",
        "The valve guarding the entrance of the aorta",
        "The flap that seals the opening between the atria",
    ],
    key=0,
    whys=[
        "The left AV valve is the mitral, or bicuspid, valve. The left ventricle ejects into the systemic arteries. The side that receives the pulmonary veins is the left side, and that valve has two cusps.",
        "The right AV valve, on the side of the venae cavae, is the tricuspid valve, with three cusps. That ventricle ejects toward the lungs.",
        "The pulmonary valve is a semilunar valve at the pulmonary trunk, not the two-cusp valve between atrium and ventricle.",
        "The aortic valve is the other semilunar valve.",
        "The septum primum is the flap of the foramen ovale, not an atrioventricular valve.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="total-conduction-time",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="From the start of the impulse in the SA node until ventricular depolarization is about 225 ms.",
    forbid=["225"],
    vignette=(
        "A 32-year-old woman who rows has the spread of one impulse timed. Temperature is 36.5°C, pulse is "
        "60/min, respirations are 12/min, and blood pressure is 110/68 mm Hg. The clock starts at the usual "
        "atrial pacemaker and stops when the ventricular muscle depolarizes. The elapsed time is a bit under "
        "a quarter of a second."
    ),
    stem="Which of the following is that elapsed time?",
    options=[
        "About 225 ms from the atrial pacemaker to the ventricles",
        "About 75 ms, only the spread through ventricular muscle",
        "About 100 ms, only the pause in the lower atrial node",
        "About 50 ms, only the trip between the two atrial nodes",
        "About 430 ms, the length of ventricular relaxation",
    ],
    key=0,
    whys=[
        "The total time from the SA-node impulse until ventricular depolarization is about 225 ms. Her clock runs that whole path, a bit under a quarter of a second.",
        "About 75 ms is only the spread from the bundle branches through the ventricular muscle.",
        "About 100 ms is the AV-node delay alone.",
        "About 50 ms is the trip from the SA node to the AV node.",
        "About 430 ms is ventricular diastole, a mechanical interval, not this conduction time.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="left-bundle-larger",
    task="anatomy", difficulty=3, src="os-19-2", nutrition=False,
    fact="The left bundle branch supplies the left ventricle and is larger than the right bundle branch because the left ventricle is larger. The right bundle branch supplies the right ventricle.",
    forbid=["bundle branch"],
    vignette=(
        "A 47-year-old man who teaches drafting compares the two divisions of the conduction path in the wall "
        "between the ventricles. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood "
        "pressure is 122/74 mm Hg. The division to the thicker ventricle is considerably larger than the "
        "division to the thinner ventricle."
    ),
    stem="Which of the following division is the larger one?",
    options=[
        "The division that supplies the thicker systemic ventricle",
        "The division that supplies the thinner lung ventricle",
        "The band that reaches only the right papillary muscle",
        "The band that crosses from the right atrium to the left",
        "The node with the fastest inherent firing rate",
    ],
    key=0,
    whys=[
        "The left bundle branch supplies the left ventricle and is larger because the left ventricle is larger. The thicker ventricle is the systemic one, so the larger division is the one that supplies it.",
        "The right bundle branch supplies the right ventricle and is the smaller division.",
        "The moderator band is a right-sided path to the papillary muscle, not the larger of the two bundle divisions.",
        "Bachmann's bundle connects the atria. It is not a ventricular bundle branch.",
        "The SA node is the fastest pacemaker. It is not a bundle branch in the interventricular wall.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="s2-semilunar-closure",
    task="mechanism", difficulty=2, src="os-19-3", nutrition=False,
    fact="S2 is the second heart sound, produced by closure of the semilunar valves as ventricular diastole begins.",
    forbid=["second heart sound", "dub"],
    vignette=(
        "A 17-year-old woman who runs track has a normal two-sound exam. Temperature is 36.6°C, pulse is "
        "64/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. The second sound occurs as the "
        "ventricles start to relax and the valves guarding the aorta and the pulmonary trunk shut."
    ),
    stem="Which of the following produces the second sound?",
    options=[
        "Shutting of the outflow valves as relaxation starts",
        "Closure of the valves between the atria and the ventricles",
        "Atrial contraction pushing blood into a stiff ventricle",
        "Early filling that can be normal in a young athlete",
        "Turbulent flow across a valve that is narrowed",
    ],
    key=0,
    whys=[
        "S2 is closure of the semilunar valves at the start of ventricular diastole. Her second sound is at the start of relaxation, when the aortic and pulmonary valves shut.",
        "AV valve closure is S1, the first sound, at the start of ventricular contraction.",
        "Atrial contraction pushing blood into a stiff ventricle is S4, before S1.",
        "S3 can be heard in young athletes during early filling. She has only the two normal sounds, and the question is the second of those.",
        "Turbulent flow is a murmur, not S2.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="most-filling-before-atrial-kick",
    task="mechanism", difficulty=2, src="os-19-3", nutrition=False,
    fact="At the start of atrial systole the ventricles are already about 70 to 80 percent full. Atrial contraction adds the rest.",
    forbid=["atrial kick"],
    vignette=(
        "A 49-year-old man who teaches history is studied just as the atria begin to contract. Temperature is "
        "36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. The ventricles "
        "are already about three-quarters full. The atrial contraction will add what is still missing."
    ),
    stem="Which of the following will the atrial contraction add?",
    options=[
        "The remaining fifth to third of ventricular filling",
        "The first three-quarters of ventricular filling",
        "The entire stroke volume of 70 to 80 mL",
        "The volume that remains after ejection",
        "Coronary venous blood directly into the left ventricle",
    ],
    key=0,
    whys=[
        "By the start of atrial systole the ventricles already hold about 70 to 80 percent of their filling. Atrial contraction adds the remaining 20 to 30 percent. His ventricles are about three-quarters full, so the contraction adds the rest.",
        "The first three-quarters entered passively, before the atria contracted.",
        "Stroke volume is what is later ejected, not what atrial contraction adds.",
        "The post-ejection remainder is end-systolic volume.",
        "The coronary sinus enters the right atrium, not the left ventricle.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="eupnea-versus-hyperpnea",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Eupnea is quiet breathing at rest and uses the diaphragm and external intercostals. Hyperpnea is forced breathing, as in exercise or singing, and uses accessory muscles for both inspiration and expiration.",
    forbid=["eupnea", "hyperpnea"],
    vignette=(
        "A 26-year-old woman who sings is compared at rest and while holding a long note. Temperature is 36.6°C, "
        "pulse is 84/min, respirations are 16/min, and blood pressure is 118/70 mm Hg. At rest only the diaphragm "
        "and the outer rib muscles contract, and outflow is recoil. While she sings, neck and abdominal muscles "
        "join in, and both the breath in and the breath out are muscular."
    ),
    stem="Which of the following is the singing pattern?",
    options=[
        "Accessory muscles work while breathing in and breathing out",
        "Only the diaphragm contracts, and outflow is pure recoil",
        "The lungs themselves contract to push the air out",
        "Neck muscles are used, but the abdomen stays relaxed",
        "Breathing stops because carbon dioxide is ignored",
    ],
    key=0,
    whys=[
        "Forced breathing, as in singing, uses accessory muscles so that both inspiration and expiration are active. Her neck and abdominal muscles join, and both phases are muscular. Quiet breathing uses only the diaphragm and external intercostals, with passive outflow.",
        "Diaphragm-only inspiration with passive outflow is the quiet pattern, which she shows at rest, not while singing.",
        "The lungs are passive. They do not contract to push air out.",
        "Forced expiration uses the abdominal muscles. They do not stay relaxed during the sung note.",
        "Ignoring carbon dioxide is central apnea. She is singing, not pausing without effort.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="diaphragmatic-versus-costal",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Diaphragmatic breathing is a deep breath driven by diaphragm contraction. Costal breathing is a shallow breath driven by the intercostal muscles.",
    forbid=["diaphragmatic", "costal"],
    vignette=(
        "A 34-year-old man who teaches yoga takes a deep breath that moves the abdomen outward, then a shallow "
        "breath that moves only the ribs. Temperature is 36.6°C, pulse is 64/min, respirations are 10/min, and "
        "blood pressure is 114/70 mm Hg. The deep breath uses the muscle that descends toward the abdomen. The "
        "shallow breath uses the muscles between the ribs."
    ),
    stem="Which of the following muscle does the deep breath use?",
    options=[
        "The muscle that descends and enlarges the vertical chest",
        "Only the muscles that lie between the ribs",
        "The abdominal muscles that force air out",
        "The scalenes, which are required for every quiet breath",
        "Smooth muscle lying in the alveolar walls",
    ],
    key=0,
    whys=[
        "A deep, diaphragmatic breath is produced by contraction of the diaphragm, which moves inferiorly and enlarges the chest. His deep breath moves the abdomen and uses that descending muscle. The shallow breath is the intercostal one.",
        "Intercostal contraction is the shallow, costal pattern, not the deep breath.",
        "Abdominal muscles are used to force air out, not to take the deep breath in.",
        "Scalenes are for forced inspiration. They are not required for every quiet breath, and the deep breath here is the diaphragm.",
        "Alveoli do not contain the muscle of a deep breath.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="low-po2-less-saturation",
    task="mechanism", difficulty=2, src="os-22-5", nutrition=False,
    fact="As oxygen partial pressure falls, fewer oxygen molecules stay bound to heme. As it rises, more are bound.",
    forbid=["saturation"],
    vignette=(
        "A 29-year-old woman who hikes at altitude has a lower oxygen pressure in arterial blood than she does "
        "at sea level. Temperature is 36.6°C, pulse is 92/min, respirations are 18/min, and blood pressure is "
        "118/74 mm Hg. Fewer of the iron sites on her hemoglobin are occupied than on the same day at sea level. "
        "pH and temperature are unchanged."
    ),
    stem="Which of the following explains the fewer occupied iron sites?",
    options=[
        "A lower oxygen pressure leaves fewer sites occupied",
        "A lower oxygen pressure fills every iron site",
        "A lower pH is required for any change in binding",
        "Fetal hemoglobin has replaced her adult hemoglobin",
        "Carbon dioxide has taken the iron sites from oxygen",
    ],
    key=0,
    whys=[
        "The dissociation curve shows that a lower partial pressure of oxygen leaves fewer oxygen molecules bound to heme. Her arterial oxygen pressure is lower at altitude, pH and temperature are unchanged, and fewer iron sites are occupied.",
        "Lower oxygen pressure does not fill every site. Higher pressure binds more oxygen.",
        "pH also shifts the curve, but her pH is unchanged. The pressure change is sufficient.",
        "Adult hemoglobin does not become fetal hemoglobin at altitude.",
        "Carbon dioxide binds globin, not the iron sites oxygen uses.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="active-muscle-po2",
    task="mechanism", difficulty=3, src="os-22-5", nutrition=False,
    fact="Highly active tissue can lower its oxygen partial pressure to about 20 mm Hg, while capillary oxygen is about 100 mm Hg, so the gradient is about 80 mm Hg and more oxygen unloads.",
    forbid=["20 mm"],
    vignette=(
        "A 21-year-old man who is sprinting has oxygen pressure inside the working muscle far below the oxygen "
        "pressure in the capillaries, which remains near 100 mm Hg. Temperature is 37.6°C, pulse is 170/min, "
        "respirations are 36/min, and blood pressure is 150/68 mm Hg. More oxygen leaves hemoglobin here than "
        "in a resting fat pad, where tissue oxygen pressure stays higher."
    ),
    stem="Which of the following is the result of the large pressure difference?",
    options=[
        "More oxygen leaves hemoglobin and enters the working muscle",
        "Less oxygen leaves hemoglobin than in the resting fat pad",
        "Oxygen is pumped in by ATP because the gradient is uphill",
        "Carbon dioxide binds heme iron in place of oxygen",
        "The bronchioles constrict because muscle oxygen is low",
    ],
    key=0,
    whys=[
        "Active tissue can drop oxygen pressure to about 20 mm Hg while capillary oxygen stays near 100 mm Hg, a gradient near 80 mm Hg. More oxygen then dissociates and enters the tissue. His working muscle unloads more than resting fat, where tissue oxygen pressure stays higher.",
        "The resting fat pad unloads less, because its oxygen pressure stays higher. The working muscle unloads more.",
        "The gradient is downhill into the muscle. Diffusion does not require ATP.",
        "Carbon dioxide binds globin, not heme iron.",
        "Bronchiolar diameter responds to alveolar carbon dioxide, not to oxygen pressure inside a limb muscle.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="alveolar-water-vapor",
    task="mechanism", difficulty=3, src="os-22-4", nutrition=False,
    fact="Alveolar air has more water vapor than dry atmospheric air because the airway humidifies inspired air. Alveolar water partial pressure is about 47 mm Hg, versus about 3 mm Hg in the atmospheric table.",
    forbid=["water vapor", "47"],
    vignette=(
        "A 18-year-old woman who studies gases compares room air with air sampled from an alveolus. Temperature "
        "is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. The alveolar "
        "sample contains much more water. The airway has warmed and moistened the incoming breath."
    ),
    stem="Which of the following explains the extra water in the alveolar sample?",
    options=[
        "The airway humidifies air before it reaches the alveoli",
        "Type II cells secrete water as their only product",
        "Hemoglobin releases water when it binds oxygen",
        "The pleural space leaks water into the alveoli",
        "Nitrogen is converted into water at the membrane",
    ],
    key=0,
    whys=[
        "The airway humidifies inspired air, so alveolar air has more water vapor than atmospheric air. Alveolar water pressure is about 47 mm Hg. Her alveolar sample is wetter because the airway moistened the breath.",
        "Type II cells secrete surfactant, which mixes with the water film. They are not the reason inspired air gains water vapor.",
        "Hemoglobin binds and releases oxygen. It does not release water as the source of alveolar humidity.",
        "Pleural fluid is in the pleural cavity, not the source of alveolar water vapor.",
        "Nitrogen is not converted into water at the respiratory membrane.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="dissolved-co2-fraction",
    task="mechanism", difficulty=2, src="os-22-5", nutrition=False,
    fact="About 7 to 10 percent of carbon dioxide is dissolved in plasma. About 70 percent is bicarbonate and about 20 percent is carbaminohemoglobin.",
    forbid=["7", "10 percent"],
    vignette=(
        "A 45-year-old man who teaches chemistry separates three fractions of carbon dioxide in venous blood. "
        "Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. "
        "One fraction is simply dissolved. It is the smallest of the three. The largest fraction is an ion, and "
        "the middle fraction is bound to the protein part of hemoglobin."
    ),
    stem="Which of the following is the smallest fraction?",
    options=[
        "The share that stays dissolved and was never converted",
        "The share carried as an ion after joining with water",
        "The share bound to the protein part of hemoglobin",
        "The share that is bound onto heme iron",
        "The share that has been converted into nitrogen",
    ],
    key=0,
    whys=[
        "About 7 to 10 percent of carbon dioxide is dissolved, the smallest share. About 70 percent is bicarbonate, the ion, and about 20 percent is bound to globin. His ordering matches dissolved, then protein-bound, then the ion as the largest.",
        "The ionic share, bicarbonate, is the largest, about 70 percent.",
        "The globin-bound share is about 20 percent, the middle fraction.",
        "Carbon dioxide does not bind heme iron. Oxygen does.",
        "Carbon dioxide is not converted into nitrogen in transport.",
    ],
)

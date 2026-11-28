# More batch 2 items from OpenStax 19.2 and 22.4.

add(
    domain="cardiovascular", subject="physiology", topic="bachmann-left-atrium",
    task="anatomy", difficulty=3, src="os-19-2", nutrition=False,
    fact="Bachmann's bundle, the interatrial band, conducts the impulse directly from the right atrium to the left atrium.",
    forbid=["bachmann"],
    vignette=(
        "A 49-year-old man who flies cargo planes has both atria depolarizing together. Temperature is "
        "36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 126/74 mm Hg. A specialized "
        "band carries the impulse from the right atrium straight across to the left atrium. The ventricles "
        "have not yet been activated."
    ),
    stem="Which of the following is the job of that interatrial band?",
    options=[
        "It conducts the signal from one upper chamber to the other",
        "It delays the impulse for about 100 ms at the septum",
        "It spreads the impulse from the apex toward the base",
        "It tenses the right papillary muscle before ejection",
        "It blocks all conduction across the cardiac skeleton",
    ],
    key=0,
    whys=[
        "Bachmann's bundle conducts the impulse directly from the right atrium to the left atrium. Both atria are depolarizing, the ventricles are not yet active, and the band runs between the atria.",
        "The 100 ms delay is at the AV node, not in the band between the atria.",
        "Apex-to-base spread is the ventricular conducting-fiber pattern, after the ventricles are reached.",
        "The moderator band supplies the right papillary muscle. It is not the path between the atria.",
        "The cardiac skeleton blocks direct spread into the ventricles. It does not describe a band that connects the two atria.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="moderator-band-papillary",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="Part of the right bundle branch runs in the moderator band to the right papillary muscle, so that muscle is stimulated with the other papillary muscle just before the rest of the right ventricle. There is no left-sided moderator band.",
    forbid=["moderator"],
    vignette=(
        "A 41-year-old woman who restores furniture has a right ventricular study. Temperature is 36.7°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. A muscle band from "
        "the septum to the right ventricular wall carries the impulse to a papillary muscle, which tenses "
        "just before the rest of that ventricle contracts. The left ventricle has no matching band."
    ),
    stem="Which of the following is the point of stimulating that papillary muscle early?",
    options=[
        "Tension develops in the chordae before the ventricle ejects",
        "The left ventricle gets the impulse before the right",
        "The aortic valve is held open during atrial systole",
        "Atrial repolarization becomes visible after the QRS",
        "The pacemaker rate rises above 100 beats per minute",
    ],
    key=0,
    whys=[
        "The moderator band delivers the impulse to the right papillary muscle at about the same time as the other papillary muscle, just before the rest of the ventricular muscle, so tension is already on the chordae tendineae. She has that right-sided band, and the left ventricle has none.",
        "The left bundle is larger because the left ventricle is larger, but this band is a right-sided structure. It does not make the left ventricle fire first.",
        "The aortic valve opens when ventricular pressure exceeds aortic pressure. The papillary timing is about the AV-valve chordae, not the aortic valve.",
        "Atrial repolarization stays hidden in the QRS. Papillary timing does not unmask it.",
        "The SA node inherent rate is about 80–100. This band does not raise the pacemaker above that.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="st-elevation-acute-mi",
    task="mechanism", difficulty=2, src="os-19-2", nutrition=False,
    fact="OpenStax 19.2 states that ST-segment elevation above baseline is often seen in acute myocardial infarction, and that T waves often flatten when the myocardium receives too little oxygen.",
    forbid=["st segment", "infarct"],
    vignette=(
        "A 66-year-old man who drives a gravel truck has 40 minutes of crushing chest pressure. Temperature "
        "is 36.8°C, pulse is 98/min, respirations are 20/min, and blood pressure is 150/90 mm Hg. The tracing "
        "shows the segment between the ventricular depolarization and the ventricular recovery wave sitting "
        "above the baseline in several chest leads. He is sweaty and nauseated."
    ),
    stem="Which of the following is the tracing pattern just described?",
    options=[
        "That interval sits above the tracing's reference line",
        "The T wave is the only finding and it is taller",
        "The PR interval is the only interval that widened",
        "The P wave is inverted in every limb lead",
        "The QRS has become a flat isoelectric line",
    ],
    key=0,
    whys=[
        "Elevation of the ST segment above baseline is often seen in acute myocardial infarction. His segment between ventricular depolarization and the recovery wave is above baseline during crushing chest pressure.",
        "Flat T waves are described when the myocardium gets too little oxygen. The finding specified is the segment sitting above baseline, not an isolated taller T wave.",
        "A long PR interval points to delay getting from the SA node to the AV node. That interval was not the one described.",
        "An inverted P wave is not the segment between the QRS and the T wave.",
        "A flat line would be absent ventricular depolarization. He has a ventricular complex with the following segment elevated.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="external-vs-internal-respiration",
    task="mechanism", difficulty=2, src="os-22-4", nutrition=False,
    fact="External respiration is gas exchange in the alveoli. Internal respiration is gas exchange in the tissues. Both are simple diffusion and do not require ATP.",
    forbid=["external respiration", "internal respiration"],
    vignette=(
        "A 28-year-old man who bikes to work is at rest. Temperature is 36.6°C, pulse is 62/min, respirations "
        "are 12/min, and blood pressure is 114/70 mm Hg. Oxygen moves from alveolar air into capillary blood, "
        "and carbon dioxide moves the other way. No ATP is consumed at that membrane. A second exchange, at "
        "his exercising muscle, runs in the opposite direction for oxygen."
    ),
    stem="Which of the following names the alveolar exchange?",
    options=[
        "Diffusion between alveolar air and pulmonary capillary blood",
        "Diffusion between systemic capillaries and active muscle",
        "Active transport of oxygen across the alveolar wall",
        "Binding of calcium to troponin inside cardiomyocytes",
        "Filtration of plasma at the glomerular capillaries",
    ],
    key=0,
    whys=[
        "External respiration is exchange at the alveoli: oxygen enters capillary blood and carbon dioxide leaves. It is simple diffusion and uses no ATP. His first exchange matches that direction at the lung.",
        "Exchange at active muscle is internal respiration. Oxygen there leaves the blood, which is the second exchange, not the alveolar one.",
        "Neither oxygen nor carbon dioxide is pumped by ATP at the respiratory membrane.",
        "Calcium binding to troponin starts cardiac cross-bridges. It is not alveolar gas exchange.",
        "Glomerular filtration is a renal capillary process, not the alveolar gas step.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="hemoglobin-carries-most-oxygen",
    task="mechanism", difficulty=2, src="os-22-4", nutrition=False,
    fact="A small amount of oxygen dissolves in plasma. Most oxygen is bound to hemoglobin in red cells. Oxygenated blood returns to the heart in the pulmonary veins.",
    forbid=["hemoglobin"],
    vignette=(
        "A 22-year-old woman who swims distance has bright red blood leaving her lungs. Temperature is 36.5°C, "
        "pulse is 58/min, respirations are 12/min, and blood pressure is 108/66 mm Hg. Only a little of the "
        "oxygen that crossed the alveolar membrane is dissolved in plasma. The rest is bound inside red cells. "
        "That blood returns to the heart in the pulmonary veins."
    ),
    stem="Which of the following carries most of the oxygen she just picked up?",
    options=[
        "A protein inside red cells, not the dissolved plasma fraction",
        "Dissolved plasma gas, with almost none inside red cells",
        "White cells marginated along the pulmonary endothelium",
        "Platelets aggregated in the pulmonary capillaries",
        "Nitrogen dissolved in plasma at ordinary air pressure",
    ],
    key=0,
    whys=[
        "Most oxygen that crosses into pulmonary capillary blood binds hemoglobin inside red cells. Only a small amount dissolves in plasma. Bound hemoglobin is what makes the blood bright red, and that blood returns in the pulmonary veins.",
        "The dissolved fraction is the small one. Most of the oxygen is inside red cells.",
        "White cells are not the oxygen-binding protein that colors arterial blood.",
        "Platelets do not carry the oxygen that crossed the alveolar membrane.",
        "Nitrogen solubility in blood is very low at ordinary pressure, and nitrogen is not the gas that turned the blood bright red.",
    ],
)

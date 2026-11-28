# Batch 2 continued. OpenStax 19.2 and 22.4 only.

add(
    domain="cardiovascular", subject="physiology", topic="ecg-p-qrs-t",
    task="mechanism", difficulty=2, src="os-19-2", nutrition=False,
    fact="The P wave is atrial depolarization. The QRS is ventricular depolarization. The T wave is ventricular repolarization. Atrial repolarization is hidden in the QRS.",
    forbid=["p wave", "qrs", "t wave"],
    vignette=(
        "A 36-year-old woman who coaches swimming has a 12-lead tracing. Temperature is 36.6°C, pulse is "
        "64/min, respirations are 12/min, and blood pressure is 110/68 mm Hg. A small deflection comes first, "
        "then a large sharp deflection, then a broader deflection. Atrial recovery is not seen as its own wave. "
        "The ventricles start contracting as the large deflection reaches its peak."
    ),
    stem="Which of the following is the large sharp deflection?",
    options=[
        "Depolarization of the ventricular muscle mass",
        "Depolarization of the thinner atrial muscle",
        "Repolarization of the ventricular muscle mass",
        "Repolarization of atrial muscle shown by itself",
        "Only the pause spent inside the lower atrial node",
    ],
    key=0,
    whys=[
        "The QRS complex is the large deflection of ventricular depolarization, large because the ventricular muscle mass is large. Contraction begins as it reaches the R-wave peak. Her tracing has that large sharp wave, and atrial recovery is not its own wave.",
        "Atrial depolarization is the small first deflection, not the large one.",
        "Ventricular repolarization is the broader wave after the large deflection.",
        "Atrial repolarization occurs during the large deflection and is masked. It is not drawn as its own wave.",
        "The AV-node delay is measured by the interval from the start of the small wave to the start of the large one. It is not the large deflection itself.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="pr-interval-av-delay",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="The PR interval runs from the start of the P wave to the start of the QRS and shows delay from the SA node to the AV node.",
    forbid=["pr interval"],
    vignette=(
        "A 70-year-old man who keeps a hardware store has a tracing in which the time from the start of atrial "
        "depolarization to the start of the ventricular deflection is prolonged. Temperature is 36.7°C, pulse "
        "is 54/min, respirations are 14/min, and blood pressure is 146/70 mm Hg. The ventricular deflection "
        "itself is narrow. He is not taking a sodium-channel blocker."
    ),
    stem="Which of the following conduction step is prolonged?",
    options=[
        "Passage from the atrial pacemaker to the AV node",
        "Spread through the ventricular muscle after the apex",
        "Repolarization of the ventricles after contraction",
        "Filling of the atria from the venae cavae",
        "Ejection from the apex into the great arteries",
    ],
    key=0,
    whys=[
        "The PR interval starts at the beginning of atrial depolarization and ends at the start of the QRS. A delay from the SA node to the AV node lengthens it. His ventricular deflection is narrow, so the delay is before the ventricles, not inside ventricular muscle.",
        "Ventricular spread after the apex is inside the QRS. That deflection is narrow.",
        "Ventricular repolarization is the T wave, after the QRS, not the interval that starts atrial depolarization.",
        "Atrial filling is a mechanical event. The prolonged measurement is electrical, from atrial depolarization to the ventricular deflection.",
        "Ejection is mechanical and follows the QRS. It is not the interval that ends when the QRS begins.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="escape-av-rate",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="Without the SA node, the AV node fires at about 40–60 per minute. The AV bundle fires at about 30–40, bundle branches at 20–30, and Purkinje fibers at 15–20.",
    forbid=["escape"],
    vignette=(
        "A 76-year-old woman who catalogues stamps has no electrical activity from the usual atrial pacemaker. "
        "Temperature is 36.5°C, pulse is 48/min, respirations are 16/min, and blood pressure is 108/60 mm Hg. "
        "The ventricles still follow a regular atrial signal that starts lower in the right atrium, inside the "
        "septum. There is a pause before each ventricular deflection. She is awake and talking."
    ),
    stem="Which of the following rate range fits this backup site?",
    options=[
        "About 40 to 60 spontaneous impulses each minute",
        "About 80 to 100 spontaneous impulses each minute",
        "About 15 to 20 spontaneous impulses each minute",
        "About 20 to 30 spontaneous impulses each minute",
        "A rate faster than the silenced atrial pacemaker",
    ],
    key=0,
    whys=[
        "If the SA node is silent, the AV node, low in the right atrium within the septum, fires at about 40–60 per minute and still imposes a pause before the ventricles. Her pulse is 48 and the signal starts at that septal site.",
        "80–100 per minute is the inherent SA-node rate, which is silent here.",
        "15–20 per minute is the Purkinje rate, too slow for a pulse of 48 with an atrial signal still present.",
        "20–30 per minute is the bundle-branch rate, below her observed rate and not an atrial septal start.",
        "Backup sites are slower than the SA node, not faster. The fastest site is the one that was silenced.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="hypoxic-pulmonary-vasoconstriction",
    task="mechanism", difficulty=3, src="os-22-4", nutrition=False,
    fact="When an alveolus is poorly ventilated, pulmonary arterioles to that alveolus constrict and blood is redirected to better ventilated alveoli. High alveolar oxygen dilates those arterioles.",
    forbid=["vasoconstrict"],
    vignette=(
        "A 59-year-old man who sands floors has a mucus plug blocking one group of alveoli. Temperature is "
        "37.1°C, pulse is 96/min, respirations are 22/min, and blood pressure is 138/82 mm Hg. Oxygen in those "
        "alveoli falls. Arterioles serving them narrow, and blood flow shifts toward neighboring alveoli that "
        "still receive air. Airway diameter does not change in the plugged region."
    ),
    stem="Which of the following is the purpose of the narrowed arterioles?",
    options=[
        "Blood is sent to alveoli that are still being ventilated",
        "All pulmonary arterioles dilate when alveolar oxygen falls",
        "Bronchioles constrict so carbon dioxide is retained",
        "Oxygen is pumped across the membrane using ATP",
        "Nitrogen dissolves into plasma in large amounts",
    ],
    key=0,
    whys=[
        "Poorly ventilated alveoli have low oxygen, and the arterioles serving them constrict so blood is redirected to alveoli that are ventilated. His plug drops alveolar oxygen, those arterioles narrow, and flow moves to aerated neighbors. The airways themselves are not the vessels that changed.",
        "High alveolar oxygen dilates pulmonary arterioles. A fall in oxygen does the opposite in the plugged region.",
        "High alveolar carbon dioxide widens bronchioles. The change described is arteriolar narrowing, not airway constriction.",
        "Oxygen crosses the respiratory membrane by diffusion down a partial-pressure gradient. The membrane step does not use ATP.",
        "Nitrogen solubility in blood is very low at ordinary pressures. That is not why these arterioles narrowed.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="co2-more-soluble-than-o2",
    task="mechanism", difficulty=4, src="os-22-4", nutrition=False,
    fact="The CO2 partial-pressure difference from capillary to alveolus is only about 5 mm Hg (45 vs 40), versus about 64 mm Hg for oxygen (104 vs 40). CO2 is about 20 times more soluble, so similar amounts of the two gases still cross.",
    forbid=["solubility"],
    vignette=(
        "A 33-year-old woman who teaches chemistry compares two gradients at the alveolar membrane. Temperature "
        "is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. The oxygen "
        "difference between alveolus and incoming capillary blood is about 64 mm Hg. The carbon dioxide "
        "difference is only about 5 mm Hg. Similar amounts of the two gases still cross."
    ),
    stem="Which of the following lets carbon dioxide cross despite the smaller gradient?",
    options=[
        "It is far more soluble in blood and alveolar fluid",
        "It is actively pumped by a membrane ATPase",
        "It binds troponin and is carried that way",
        "It moves only when nitrogen solubility is high",
        "It uses the same gradient direction as tissue oxygen",
    ],
    key=0,
    whys=[
        "Carbon dioxide's partial-pressure difference is only about 5 mm Hg, versus about 64 mm Hg for oxygen, but carbon dioxide is about 20 times more soluble in blood and alveolar fluid. Similar amounts therefore cross. Her two gradients match those figures.",
        "Both gases cross by simple diffusion. No ATP is used at the respiratory membrane.",
        "Troponin binds calcium in muscle. It is not the carrier that explains carbon dioxide diffusion.",
        "Nitrogen solubility in blood is very low. Carbon dioxide movement does not depend on nitrogen being highly soluble.",
        "At the tissues, oxygen leaves the blood. At the alveolus, carbon dioxide leaves the blood. Those are not the same gradient direction for oxygen.",
    ],
)

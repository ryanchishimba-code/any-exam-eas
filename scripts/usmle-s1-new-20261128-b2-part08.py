# Remaining cardiovascular items for batch 2.

add(
    domain="cardiovascular", subject="physiology", topic="end-systolic-volume",
    task="mechanism", difficulty=2, src="os-19-3", nutrition=False,
    fact="After a stroke volume of about 70 to 80 mL from an end-diastolic volume of about 130 mL, about 50 to 60 mL remains. That remainder is the end-systolic volume.",
    forbid=["end-systolic", "end systolic"],
    vignette=(
        "A 54-year-old man who stands at a lectern ejects 75 mL from a ventricle that held 130 mL at the end of "
        "filling. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is "
        "126/76 mm Hg. Blood remains in the chamber after the ejection. He is standing, at rest, and not in failure."
    ),
    stem="Which of the following is the volume still in the ventricle?",
    options=[
        "About 50 to 60 mL remaining after the beat",
        "The entire 130 mL that was present before the beat",
        "The 75 mL that just left the ventricular chamber",
        "Only the 20 to 30 percent added by atrial contraction",
        "The coronary venous return of one minute",
    ],
    key=0,
    whys=[
        "End-systolic volume is what remains after ejection. From about 130 mL, a stroke volume of 70 to 80 mL leaves about 50 to 60 mL. He ejected 75 mL from 130 mL, so about 55 mL remains.",
        "130 mL is the volume before contraction, not what remains.",
        "75 mL is what left. The question asks for what is still inside.",
        "The atrial contribution is a fraction of filling, not the post-ejection remainder.",
        "Coronary sinus flow is venous return to the right atrium, not this ventricular remainder.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="s3-later-life-failure",
    task="mechanism", difficulty=3, src="os-19-3", nutrition=False,
    fact="S3 may be heard in youth, athletes, and pregnancy. Heard later in life, it may indicate congestive heart failure.",
    forbid=["third heart sound", "s3"],
    vignette=(
        "A 72-year-old man who no longer walks a block has a soft extra sound in early filling, after the second "
        "heart sound. Temperature is 36.7°C, pulse is 96/min, respirations are 20/min, and blood pressure is "
        "150/88 mm Hg. He is not an athlete and not pregnant. The sound is not the one that comes just before "
        "the first heart sound."
    ),
    stem="Which of the following is the concern when this sound appears at his age?",
    options=[
        "It may mark congestive heart failure and needs more testing",
        "It is the normal sound of semilunar valve closure",
        "It is the normal sound made by AV valve closure",
        "It is expected in every healthy older adult",
        "It means the usual atrial pacemaker has stopped",
    ],
    key=0,
    whys=[
        "S3 in early filling can be normal in youth, athletes, and pregnancy. Heard later in life, it may indicate congestive heart failure and warrants further tests. He is 72, limited by walking, and the sound is after S2, not before S1.",
        "Semilunar closure is S2, the second sound, not the extra sound after it.",
        "AV closure is S1.",
        "S3 is rarely heard in healthy adults and is not expected in every older person.",
        "A silent SA node changes the pacemaker. It does not create an early-filling sound.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="apex-left-fifth-rib",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The apex is the inferior tip, just to the left of the sternum between the fourth and fifth ribs near their costal cartilages. The base, where the great vessels attach, is at the third costal cartilage.",
    forbid=["apex"],
    vignette=(
        "A 22-year-old man who plays drums has the lower tip of the heart felt just left of the sternum, between "
        "the fourth and fifth ribs. Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood "
        "pressure is 114/70 mm Hg. The great vessels attach higher, at the third costal cartilage."
    ),
    stem="Which of the following is the lower tip that was felt?",
    options=[
        "The inferior end of the heart, left of the sternum",
        "The superior end where the great vessels attach",
        "The right atrial appendage beside the vena cava",
        "The fibrous sac that anchors the heart",
        "The sinus that returns myocardial venous blood",
    ],
    key=0,
    whys=[
        "The apex is the inferior tip, just left of the sternum between the fourth and fifth ribs. That is where the impulse was felt. The great vessels attach at the base, higher up.",
        "The base is the superior surface at the third costal cartilage, where the great vessels attach.",
        "The auricle is an atrial appendage, not the inferior tip between the fourth and fifth ribs.",
        "The fibrous pericardium is the anchoring sac, not the tip of the heart.",
        "The coronary sinus is a vein opening into the right atrium.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="pericardial-fluid-friction",
    task="mechanism", difficulty=2, src="os-19-1", nutrition=False,
    fact="The mesothelium of the epicardium secretes serous fluid into the pericardial cavity, which reduces friction as the heart beats.",
    forbid=["pericardial fluid", "friction"],
    vignette=(
        "A 39-year-old woman who teaches dance has a thin film of fluid in the space around the heart. Temperature "
        "is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. The film is "
        "secreted by the outer layer of the heart wall. With each beat the heart slides in that space."
    ),
    stem="Which of the following is the role of this fluid film?",
    options=[
        "It lets the heart beat with less rubbing on the sac",
        "It is the muscle layer that ejects the stroke volume",
        "It is the pacemaker with the fastest inherent rate",
        "It carries oxygen bound to four heme groups",
        "It closes the foramen between the atria after birth",
    ],
    key=0,
    whys=[
        "Serous fluid in the pericardial cavity, secreted by the epicardial mesothelium, reduces friction as the heart contracts. Her film is in that space and is secreted by the outer wall layer.",
        "The myocardium is the muscle. The fluid is not a muscle layer.",
        "The SA node is the pacemaker. Fluid does not set the heart rate.",
        "Hemoglobin in red cells carries oxygen. Pericardial fluid does not.",
        "The septum primum closes the foramen ovale. Pericardial fluid does not.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="endocardium-endothelium",
    task="histology", difficulty=2, src="os-19-1", nutrition=False,
    fact="The endocardium lines the chambers and covers the valves. It is simple squamous endothelium continuous with the lining of the blood vessels.",
    forbid=["endocardium", "endothelium"],
    vignette=(
        "A 48-year-old man who binds books has the inner lining of a ventricle biopsied. Temperature is 36.6°C, "
        "pulse is 72/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. The lining is a single "
        "layer of flat cells. The same kind of lining continues into the aorta without a break, and it also "
        "covers the valve cusps."
    ),
    stem="Which of the following is this inner lining?",
    options=[
        "A flat-cell layer continuous with the vessel lining",
        "The thick muscle that generates systolic pressure",
        "The outer wall layer that also lines the sac",
        "The tough connective tissue that anchors the heart",
        "The fluid film in the space around the heart",
    ],
    key=0,
    whys=[
        "The endocardium is simple squamous endothelium lining the chambers and covering the valves, continuous with vascular endothelium. His biopsy is one flat-cell layer that continues into the aorta and covers the cusps.",
        "The myocardium is the thick muscle, deep to which lies this lining.",
        "The epicardium is the outer wall layer and the visceral pericardium.",
        "The fibrous pericardium is the anchoring sac, outside the heart wall.",
        "Pericardial fluid occupies the cavity around the heart. It is not the cellular lining of the chamber.",
    ],
)

add(
    domain="cardiovascular", subject="pathology", topic="coarctation-at-ligamentum",
    task="anatomy", difficulty=3, src="os-19-1", nutrition=False,
    fact="Coarctation is a congenital narrowing of the aorta, normally at the ligamentum arteriosum, the remnant of the ductus arteriosus.",
    forbid=["coarctation", "ligamentum"],
    vignette=(
        "A 16-year-old boy who plays soccer faints after sprints. Temperature is 36.7°C, pulse is 88/min, "
        "respirations are 16/min, and blood pressure is 150/90 mm Hg in the arms and 100/70 mm Hg in the legs. "
        "Imaging shows a narrow segment of the aorta where a fetal vessel used to join the pulmonary trunk. "
        "That fetal vessel is now a cord."
    ),
    stem="Which of the following is the cord at the narrow segment?",
    options=[
        "The remnant of the fetal channel from the pulmonary trunk",
        "The remnant of the opening between the two atria",
        "The band from the right atrium across to the left atrium",
        "The band that reaches the right papillary muscle",
        "The sinus that returns myocardial venous blood",
    ],
    key=0,
    whys=[
        "The ligamentum arteriosum is the remnant of the ductus arteriosus, and coarctation is typically at that insertion. His aortic narrowing is where that fetal vessel joined, and the vessel is now a cord. Arm pressure is higher than leg pressure.",
        "The fossa ovalis is the remnant of the foramen ovale in the atrial septum, not a cord on the aorta.",
        "Bachmann's bundle connects the right atrium to the left atrium.",
        "The moderator band reaches the right papillary muscle.",
        "The coronary sinus returns myocardial venous blood to the right atrium.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="t-tubules-at-z-disc",
    task="histology", difficulty=4, src="os-19-2", nutrition=False,
    fact="Cardiac T tubules occur only at the Z discs, so there are half as many as in skeletal muscle, where they occur at the A-I junction. The sarcoplasmic reticulum stores little calcium, so most calcium must enter from outside.",
    forbid=["t tubule", "z disc"],
    vignette=(
        "A 29-year-old woman who studies muscle compares heart muscle with limb muscle. Temperature is 36.6°C, "
        "pulse is 70/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. Invaginations of the "
        "surface membrane in the heart cell occur only at the Z lines. The internal calcium store in those heart "
        "cells holds little calcium."
    ),
    stem="Which of the following follows from where those invaginations sit?",
    options=[
        "Heart cells have half as many of them as limb-muscle cells",
        "Heart cells have twice as many of them as limb-muscle cells",
        "They sit at the A-I junction, as they do in limb muscle",
        "They store most of the calcium used for contraction",
        "They are absent, so calcium cannot enter from outside",
    ],
    key=0,
    whys=[
        "Cardiac T tubules are only at the Z discs, whereas skeletal ones are at the A-I junction, so cardiac muscle has half as many. The sarcoplasmic reticulum stores little calcium, which matches her finding that the internal store holds little.",
        "The count is half, not twice, because they occur at only one site per sarcomere region instead of the A-I sites.",
        "The A-I junction is the skeletal location. Cardiac invaginations are at the Z lines.",
        "The invaginations carry the impulse inward. The internal calcium store is the sarcoplasmic reticulum, and it holds little calcium in heart cells.",
        "The invaginations are present. Outside calcium is required precisely because the internal store is small.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="refractory-period-plateau",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="The long plateau and absolute refractory period let the contractile cell finish its contraction before it can fire again.",
    forbid=["refractory"],
    vignette=(
        "A 46-year-old man who repairs violins has a ventricular cell that has just fired. Temperature is 36.6°C, "
        "pulse is 72/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. A second shock during the "
        "long depolarized phase produces no new spike. The cell finishes shortening before it can respond."
    ),
    stem="Which of the following is the point of that unresponsive interval?",
    options=[
        "The cell finishes contracting before it can fire again",
        "The cell can summate twitches the way limb muscle can",
        "Atrial filling is blocked until the next P wave",
        "The semilunar valves stay open for the whole interval",
        "Calcium is kept out so the twitch is brief",
    ],
    key=0,
    whys=[
        "The long plateau creates a long absolute refractory period so the contractile cell can finish pumping before another action potential. His second shock fails, and shortening completes before the cell can respond.",
        "Summation of twitches is a skeletal-muscle behavior. The cardiac refractory period prevents a second firing during contraction.",
        "Atrial filling continues on its own timetable. The refractory interval is about the ventricular cell that just fired.",
        "Semilunar valves are open only during ejection, not for a reason tied to a failed second shock.",
        "Calcium entry during the plateau is what prolongs the depolarization. Calcium is not kept out.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="pressure-gradient-flow",
    task="mechanism", difficulty=2, src="os-19-3", nutrition=False,
    fact="Blood flows from higher pressure to lower pressure. In diastole it enters the atria from the veins, then moves into the ventricles. In ventricular systole it is ejected into the pulmonary trunk and the aorta.",
    forbid=["pressure gradient"],
    vignette=(
        "A 33-year-old woman who teaches chemistry watches one cycle. Temperature is 36.6°C, pulse is 74/min, "
        "respirations are 14/min, and blood pressure is 116/70 mm Hg. While the chambers are relaxed, venous "
        "pressure exceeds atrial pressure and blood enters the atria. Later, ventricular pressure exceeds aortic "
        "pressure and blood leaves the left ventricle."
    ),
    stem="Which of the following is the rule both movements follow?",
    options=[
        "Blood moves from the higher pressure toward the lower pressure",
        "Blood moves from the lower pressure toward the higher pressure",
        "Blood leaves the ventricle only while ventricular pressure is falling",
        "Blood enters the atrium only while the atrium is contracting",
        "Both movements require the semilunar valves to be closed",
    ],
    key=0,
    whys=[
        "Flow follows a pressure gradient, from higher pressure to lower pressure. Venous pressure above atrial pressure fills the atrium in diastole. Ventricular pressure above aortic pressure ejects blood. Both of her observations follow that rule.",
        "Flow does not go toward the higher pressure.",
        "Ejection happens while ventricular pressure is high enough to open the aortic valve, not while it is falling below aortic pressure. Falling pressure closes that valve.",
        "Most filling of the ventricle, and venous entry into the atrium, occurs while the chambers are relaxed.",
        "Ejection requires the semilunar valves open. They are closed during filling, so both movements do not share closed semilunar valves.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="auricle-atrial-appendage",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="An auricle is a thin-walled, ear-shaped extension of each atrium that can fill and empty into that atrium.",
    forbid=["auricle", "appendage"],
    vignette=(
        "A 58-year-old man who flies cargo planes has a thin-walled pouch on the outside of each upper chamber. "
        "Temperature is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 128/78 mm Hg. "
        "Each pouch can fill with blood and then empty into its upper chamber. The pouches are not the thick "
        "pumping walls."
    ),
    stem="Which of the following is this pouch?",
    options=[
        "A thin-walled extension that empties into the atrium",
        "The thick wall of the systemic ventricle",
        "The fibrous sac that anchors the heart in the chest",
        "The cord left where a fetal artery used to run",
        "The vein that returns blood from the heart muscle",
    ],
    key=0,
    whys=[
        "Auricles are thin-walled, ear-shaped atrial extensions that fill and empty into the atria. He has one on each upper chamber, and they are not the thick pumping walls.",
        "The left ventricular wall is thick myocardium, not a thin pouch on the atrium.",
        "The fibrous pericardium is the anchoring sac around the whole heart.",
        "The ligamentum arteriosum is the remnant of the ductus arteriosus on the great arteries.",
        "The coronary sinus is a vein opening into the right atrium, not a pouch on both atria.",
    ],
)

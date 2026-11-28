# Cardiac cycle and heart anatomy. OpenStax 19.1 and 19.3.

add(
    domain="cardiovascular", subject="physiology", topic="passive-ventricular-filling",
    task="mechanism", difficulty=2, src="os-19-3", nutrition=False,
    fact="About 70 to 80 percent of ventricular filling occurs while both chambers are in diastole, before atrial contraction. The atrial kick adds the remaining 20 to 30 percent.",
    forbid=["atrial kick"],
    vignette=(
        "A 57-year-old man who repairs clocks is studied at rest. Temperature is 36.6°C, pulse is 70/min, "
        "respirations are 14/min, and blood pressure is 124/76 mm Hg. Before the atria contract, the ventricles "
        "are already about three-quarters full. The atrioventricular valves are open and the semilunar valves "
        "are closed."
    ),
    stem="Which of the following accounts for most of that filling?",
    options=[
        "Passive inflow while the atria and ventricles are relaxed",
        "Atrial contraction pushing the final fifth of the volume",
        "Ventricular contraction with the semilunar valves shut",
        "Backflow from the aorta after the semilunar valves close",
        "Coronary sinus drainage directly into the left ventricle",
    ],
    key=0,
    whys=[
        "While both chambers are relaxed, blood flows from the veins into the atria and through open AV valves. About 70 to 80 percent of ventricular filling happens this way, before atrial contraction. The ventricles are already about three-quarters full, and the semilunar valves are closed.",
        "Atrial contraction adds only the remaining 20 to 30 percent. It is not most of the filling.",
        "Ventricular contraction with the semilunar valves still shut is isovolumic contraction. Volume does not rise then.",
        "After the semilunar valves close, backflow is stopped. That does not fill the ventricle.",
        "The coronary sinus empties into the right atrium, not the left ventricle.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="isovolumic-contraction",
    task="mechanism", difficulty=3, src="os-19-3", nutrition=False,
    fact="Early ventricular systole closes the AV valves when ventricular pressure exceeds atrial pressure, but the semilunar valves are still closed, so ventricular volume stays constant. This is isovolumic contraction.",
    forbid=["isovolumic", "isovolumetric"],
    vignette=(
        "A 48-year-old woman who teaches violin is in the first moments of ventricular contraction. Temperature "
        "is 36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. Ventricular "
        "pressure has risen above atrial pressure, so the AV valves have shut. Pressure is still below aortic "
        "and pulmonary pressure. Ventricular volume on the tracing does not change."
    ),
    stem="Which of the following best describes this interval?",
    options=[
        "All valves are shut and ventricular volume is constant",
        "The aortic valve is open and stroke volume is leaving",
        "The mitral valve is open and the atrium is still filling the ventricle",
        "The semilunar valves are open and the AV valves are open too",
        "Ventricular pressure is falling and the T wave is under way",
    ],
    key=0,
    whys=[
        "When ventricular pressure exceeds atrial pressure, the AV valves close. Until ventricular pressure also exceeds aortic and pulmonary pressure, the semilunar valves stay shut, so volume cannot change. That is the early part of ventricular systole. Her tracing shows a flat volume.",
        "Ejection starts only after ventricular pressure exceeds the great-artery pressure. That threshold has not been reached.",
        "The AV valves have already shut because ventricular pressure is above atrial pressure.",
        "The semilunar valves are still closed, and the AV valves have just closed. They are not all open.",
        "Falling ventricular pressure and the T wave mark the start of relaxation, not this early contraction.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="equal-stroke-higher-left-pressure",
    task="mechanism", difficulty=3, src="os-19-3", nutrition=False,
    fact="Both ventricles eject the same stroke volume, normally about 70 to 80 mL. Left ventricular pressure is higher because aortic pressure is higher than pulmonary trunk pressure.",
    forbid=["stroke volume"],
    vignette=(
        "A 62-year-old man who surveys roads has a resting study. Temperature is 36.6°C, pulse is 68/min, "
        "respirations are 14/min, and blood pressure is 132/78 mm Hg. Each ventricle ejects 75 mL. Peak pressure "
        "in the left ventricle is far above peak pressure in the right ventricle. The aortic valve and the "
        "pulmonary valve both open during ejection."
    ),
    stem="Which of the following explains the pressure difference with equal ejected volumes?",
    options=[
        "The aorta resists outflow more than the pulmonary trunk does",
        "The left ventricle ejects more blood than the right ventricle",
        "The right ventricle must overcome systemic arterial pressure",
        "The pulmonary valve stays shut while the aortic valve opens",
        "Only the left ventricle receives the atrial topping-up",
    ],
    key=0,
    whys=[
        "Both ventricles pump the same volume, here 75 mL, within the usual 70 to 80 mL. Left ventricular pressure is higher because pressure in the aorta is much higher than pressure in the pulmonary trunk. Both semilunar valves open.",
        "The ejected volumes are equal, 75 mL from each side.",
        "Systemic pressure is what the left ventricle overcomes. The right ventricle faces the lower-pressure pulmonary trunk.",
        "Both the aortic and pulmonary valves open during ejection in this study.",
        "Atrial contraction contributes to filling of both ventricles, not only the left.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="s1-av-valve-closure",
    task="mechanism", difficulty=2, src="os-19-3", nutrition=False,
    fact="S1 is the first heart sound, produced by closure of the AV valves during ventricular contraction. S2 is closure of the semilunar valves during ventricular diastole.",
    forbid=["first heart sound", "lub"],
    vignette=(
        "A 19-year-old woman who runs cross-country has two heart sounds and no extra sounds. Temperature is "
        "36.5°C, pulse is 60/min, respirations are 12/min, and blood pressure is 108/64 mm Hg. The first sound "
        "occurs as the ventricles begin to contract and the valves between the atria and ventricles shut. The "
        "second sound comes as relaxation begins."
    ),
    stem="Which of the following produces the first sound?",
    options=[
        "Shutting of the cusps that separate the upper and lower chambers",
        "Closure of both the aortic and the pulmonary valves",
        "Atrial contraction pushing blood into a stiff ventricle",
        "Blood oscillating in the ventricle in early filling",
        "Turbulent flow across a narrowed aortic valve",
    ],
    key=0,
    whys=[
        "S1 is the sound of the AV valves closing during ventricular contraction. Her first sound is at the start of ventricular contraction, when those valves shut. She has only the two normal sounds.",
        "Closure of both the aortic and the pulmonary valves is S2, at the start of ventricular relaxation.",
        "Atrial contraction pushing blood into a stiff ventricle is S4, which occurs before S1 and is not part of her two-sound exam.",
        "Blood moving in the ventricle can contribute to S3, which is not one of her two sounds.",
        "A murmur is turbulent flow. She has no extra sound, and the first sound is valve closure, not a narrowed valve.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="s4-stiff-ventricle",
    task="mechanism", difficulty=3, src="os-19-3", nutrition=False,
    fact="S4 is produced when atrial contraction pushes blood into a stiff or hypertrophic ventricle. It occurs before S1.",
    forbid=["fourth heart sound", "tennessee"],
    vignette=(
        "A 71-year-old man who binds books has a low extra sound just before the first heart sound. Temperature "
        "is 36.7°C, pulse is 84/min, respirations are 16/min, and blood pressure is 158/92 mm Hg. The left "
        "ventricular wall is thick. The extra sound is timed to atrial contraction. He does not have the extra "
        "sound that can be normal in young athletes."
    ),
    stem="Which of the following produces this extra sound?",
    options=[
        "Atrial contraction pushing blood into a stiff ventricle",
        "Semilunar valves closing at the start of relaxation",
        "AV valves closing at the start of ventricular contraction",
        "Rapid early filling of a normal young ventricle",
        "Inspiration increasing flow only on the right side",
    ],
    key=0,
    whys=[
        "S4 comes from atrial contraction pushing blood into a stiff or hypertrophic ventricle, and it occurs before S1. His wall is thick, the sound is just before the first sound, and it is timed to atrial contraction.",
        "Semilunar closure is S2, after ventricular contraction, not before S1.",
        "AV closure is S1 itself, not the extra sound just before it.",
        "S3 can be heard in youth and athletes. He is 71, the sound is before S1, and the ventricle is thick.",
        "Inspiration can make a right-sided murmur louder. It does not create a presystolic sound from a thick ventricle.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="fossa-ovalis-fetal-shunt",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The fossa ovalis is the adult remnant of the foramen ovale, which let fetal blood pass from the right atrium to the left atrium and bypass the lungs. The septum primum closes it after birth.",
    forbid=["foramen ovale", "fossa ovalis"],
    vignette=(
        "A 4-day-old boy is examined because a flap in the wall between the atria has just sealed. Temperature "
        "is 36.9°C, pulse is 140/min, respirations are 40/min, and blood pressure is 70/40 mm Hg. Before birth, "
        "blood crossed that opening from the right atrium into the left atrium and skipped the lungs. The lungs "
        "are now the route for that blood."
    ),
    stem="Which of the following was the prenatal direction through that opening?",
    options=[
        "From the right atrium into the left atrium, bypassing the lungs",
        "From the left atrium into the right atrium, toward the lungs",
        "From the aorta across into the pulmonary trunk",
        "From the pulmonary trunk across into the aorta",
        "From the left ventricle into the right ventricle",
    ],
    key=0,
    whys=[
        "The foramen ovale let fetal blood pass from the right atrium to the left atrium, bypassing the pulmonary circuit. The septum primum closes it after birth. This newborn's atrial flap has just sealed, and the prenatal path skipped the lungs.",
        "The prenatal shunt across that opening is right atrium to left atrium, not the reverse.",
        "Aorta-to-pulmonary-trunk flow is the direction through a patent ductus arteriosus, a different fetal vessel.",
        "Pulmonary-trunk-to-aorta flow is the prenatal ductus arteriosus direction in fetal life, not the opening in the atrial wall.",
        "A ventricular septal opening is not the atrial flap that closed after birth.",
    ],
)

add(
    domain="cardiovascular", subject="pathology", topic="patent-ductus-aorta-to-pulmonary",
    task="mechanism", difficulty=3, src="os-19-1", nutrition=False,
    fact="If the ductus arteriosus stays open, blood flows from the higher-pressure aorta into the lower-pressure pulmonary trunk, raising pulmonary pressure.",
    forbid=["ductus", "patent ductus"],
    vignette=(
        "A 3-week-old girl has fast breathing and poor weight gain. Temperature is 37.0°C, pulse is 168/min, "
        "respirations are 62/min, and blood pressure is 90/40 mm Hg. A vessel that should have closed still "
        "connects the aorta to the pulmonary trunk. Flow across it is continuous. Her pulse pressure is wide."
    ),
    stem="Which of the following is the direction of flow through that vessel?",
    options=[
        "From the aorta across into the pulmonary trunk",
        "From the pulmonary trunk across into the aorta",
        "From the right atrium into the left atrium",
        "From the left ventricle into the right ventricle",
        "From the coronary sinus into the left atrium",
    ],
    key=0,
    whys=[
        "When the ductus arteriosus stays open, blood flows from the higher-pressure aorta into the lower-pressure pulmonary trunk. That extra flow toward the lungs raises pulmonary pressure and makes breathing difficult. She is tachypneic, gaining poorly, and has a wide pulse pressure.",
        "Fetal ductus flow is toward the aorta, but after birth aortic pressure is higher, so a vessel that stays open runs from aorta to pulmonary trunk.",
        "Right-to-left atrial flow is the foramen ovale, not a vessel between the aorta and the pulmonary trunk.",
        "A ventricular septal defect is an opening in the ventricular septum, not this vessel.",
        "The coronary sinus drains to the right atrium, not across a vessel joining the great arteries.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="left-ventricle-thicker",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The left ventricular myocardium is much thicker than the right. Both pump the same volume, but the left must generate higher pressure against systemic resistance.",
    forbid=["left ventricle"],
    vignette=(
        "A 34-year-old man who installs windows has a normal heart on imaging. Temperature is 36.6°C, pulse is "
        "72/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. The wall of one ventricle is much "
        "thicker than the other. Each side ejects 72 mL per beat. The thicker chamber faces the higher-resistance circuit."
    ),
    stem="Which of the following is the thicker chamber?",
    options=[
        "The ventricle that pumps into the systemic arteries",
        "The ventricle that ejects into the pulmonary trunk",
        "The atrium that receives the venae cavae",
        "The atrium that receives the pulmonary veins",
        "The atrial appendage on the right side",
    ],
    key=0,
    whys=[
        "The left ventricular wall is thicker because that chamber must generate more pressure against systemic resistance. Both ventricles eject the same volume, here 72 mL. The thicker chamber is the one ejecting into the systemic arteries.",
        "The right ventricle ejects into the pulmonary trunk and has the thinner wall.",
        "The right atrium receives the venae cavae. It is not the thick ventricular wall.",
        "The left atrium receives the pulmonary veins. Atrial walls are not the thick ventricular myocardium described.",
        "The auricle is a thin-walled atrial appendage, not the thick pumping chamber.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="coronary-sinus-right-atrium",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The coronary sinus drains most of the coronary veins into the right atrium, near the inferior vena cava opening.",
    forbid=["coronary sinus"],
    vignette=(
        "A 60-year-old woman who catalogs maps has venous blood from the heart muscle returning to a chamber. "
        "Temperature is 36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 130/76 mm Hg. "
        "The vein opens on the posterior right atrium, just above the inferior vena cava opening. It does not "
        "enter the left atrium."
    ),
    stem="Which of the following chamber receives this cardiac venous blood?",
    options=[
        "The right atrium, near the inferior vena cava",
        "The left atrium, with the four pulmonary veins",
        "The right ventricle, through the tricuspid valve",
        "The left ventricle, through the mitral valve",
        "The pulmonary trunk, before the lungs",
    ],
    key=0,
    whys=[
        "The coronary sinus returns most coronary venous blood to the right atrium, opening just superior to the inferior vena cava. Her vessel opens on the posterior right atrium at that site and does not enter the left atrium.",
        "The four pulmonary veins enter the left atrium with oxygenated lung blood, not myocardial venous blood.",
        "Coronary venous blood reaches the right ventricle only after it has entered the right atrium.",
        "The mitral valve is between the left atrium and left ventricle. Coronary veins do not drain there.",
        "The pulmonary trunk carries right-ventricular output to the lungs, not myocardial venous return.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="epicardium-is-visceral-pericardium",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The heart wall from superficial to deep is epicardium, myocardium, and endocardium. The epicardium is the visceral pericardium. The fibrous pericardium anchors the heart. Serous fluid in the pericardial cavity reduces friction.",
    forbid=["epicardium", "visceral"],
    vignette=(
        "A 45-year-old man who teaches drafting has the heart wall described from the outside inward. Temperature "
        "is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. The outer layer "
        "of the wall is also the inner layer of the sac, and it secretes fluid into the space around the heart. "
        "The thick middle layer is muscle. The inner lining covers the valves."
    ),
    stem="Which of the following is that outer wall layer?",
    options=[
        "The layer of the wall that is also the inner sac layer",
        "The muscle layer that pumps blood into the arteries",
        "The lining that is continuous with vessel endothelium",
        "The tough outer sac that anchors the heart in the chest",
        "The fluid space between the sac and the heart surface",
    ],
    key=0,
    whys=[
        "The epicardium is the outer layer of the heart wall and the visceral layer of the serous pericardium. It secretes the lubricating fluid. The description matches that shared layer, with muscle deep to it and a lining on the valves.",
        "The myocardium is the thick middle muscle layer, not the outer wall layer that secretes the fluid.",
        "The endocardium is the inner lining, continuous with vascular endothelium, and it covers the valves. It is the deepest layer, not the outer one.",
        "The fibrous pericardium is the tough outer sac that anchors the heart. It is not a layer of the heart wall.",
        "The pericardial cavity is the fluid space. It is not a layer of the wall.",
    ],
)

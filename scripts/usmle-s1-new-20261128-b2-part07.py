# More cardiac items from OpenStax 19.1, 19.2, and 19.3.

add(
    domain="cardiovascular", subject="physiology", topic="end-diastolic-volume-preload",
    task="mechanism", difficulty=2, src="os-19-3", nutrition=False,
    fact="End-diastolic volume, about 130 mL in a resting adult standing, is the ventricular volume at the end of filling and is preload.",
    forbid=["preload", "end-diastolic", "end diastolic"],
    vignette=(
        "A 52-year-old man who stands to teach has 130 mL in each ventricle at the end of filling, just before "
        "contraction. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is "
        "124/78 mm Hg. He then ejects 75 mL. The 130 mL figure is the resting standing value."
    ),
    stem="Which of the following is that 130 mL volume?",
    options=[
        "The filled ventricular volume just before contraction",
        "The volume ejected from the ventricle in one beat",
        "The volume remaining in the ventricle after ejection",
        "The atrial contribution alone, about a fifth of filling",
        "Myocardial venous return collected over one minute",
    ],
    key=0,
    whys=[
        "End-diastolic volume, about 130 mL at rest while standing, is the ventricular blood volume at the end of filling, also called preload. He is at 130 mL just before contraction and then ejects 75 mL.",
        "The ejected volume is stroke volume, here 75 mL, normally 70 to 80 mL.",
        "The volume remaining after ejection is the end-systolic volume, about 50 to 60 mL, not 130 mL.",
        "Atrial contraction adds about 20 to 30 percent of filling, not the whole 130 mL.",
        "The coronary sinus returns myocardial venous blood to the right atrium. It is not this ventricular filling volume.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="isovolumic-relaxation-dicrotic",
    task="mechanism", difficulty=3, src="os-19-3", nutrition=False,
    fact="Early ventricular diastole: when ventricular pressure falls below aortic and pulmonary pressure, blood starts back and the semilunar valves close, causing the dicrotic notch. AV valves are still closed, so volume stays constant. This is isovolumic relaxation.",
    forbid=["dicrotic", "isovolumic relaxation"],
    vignette=(
        "A 59-year-old woman who catalogs seeds is at the start of ventricular relaxation. Temperature is 36.7°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 136/78 mm Hg. Ventricular pressure has "
        "fallen below aortic pressure. A small notch appears on the arterial tracing as flow briefly reverses. "
        "The valves between atria and ventricles are still shut, and ventricular volume does not change."
    ),
    stem="Which of the following produces the notch?",
    options=[
        "Brief backflow that shuts the aortic and pulmonary valves",
        "Opening of the mitral valve as atrial pressure wins",
        "Atrial contraction topping up a stiff ventricle",
        "The start of ejection while all valves are open",
        "Coronary flow entering the left ventricle directly",
    ],
    key=0,
    whys=[
        "When ventricular pressure drops below aortic and pulmonary pressure, blood flows back toward the heart and the semilunar valves close. That brief reversal is the dicrotic notch. The AV valves are still closed, so volume stays constant. Her tracing shows the notch as pressure falls and volume is flat.",
        "The mitral valve opens later, when ventricular pressure falls below atrial pressure. It is still shut.",
        "Atrial contraction pushing blood into a stiff ventricle is S4, not this arterial notch at the start of relaxation.",
        "Ejection requires the semilunar valves open and the AV valves closed. This moment is the closing of the semilunar valves.",
        "Coronary venous blood enters the right atrium, not the left ventricle.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="inspiration-right-murmur",
    task="mechanism", difficulty=3, src="os-19-3", nutrition=False,
    fact="Inhalation increases blood flow into the right heart and can make right-sided murmurs louder. Expiration can make left-sided murmurs louder.",
    forbid=["inhalation", "inspiration"],
    vignette=(
        "A 18-year-old man who plays soccer has a murmur that gets louder when he breathes in and softer when he "
        "breathes out. Temperature is 36.6°C, pulse is 64/min, respirations are 14/min, and blood pressure is "
        "110/68 mm Hg. The murmur is heard best at the left upper sternal border. A second murmur, heard at the "
        "apex, does the reverse."
    ),
    stem="Which of the following does breathing in do to right-sided flow?",
    options=[
        "It increases flow into the right side of the heart",
        "It increases flow into the left side of the heart",
        "It closes the aortic valve for the whole breath",
        "It sends blood from the aorta into the pulmonary trunk",
        "It stops venous return until expiration begins",
    ],
    key=0,
    whys=[
        "Inhalation increases blood flow into the right heart and can amplify right-sided murmurs. His murmur grows on inspiration and is loudest at the upper left sternal border. The apical murmur that does the opposite fits a left-sided sound, which expiration can amplify.",
        "Increased left-sided flow is not the effect of inspiration. Expiration is the maneuver that can make left-sided murmurs louder.",
        "The aortic valve still opens and closes with each beat. Inspiration does not keep it shut.",
        "Aorta-to-pulmonary-trunk flow is a patent ductus, not an effect of one breath.",
        "Inspiration increases right-heart filling. It does not stop venous return.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="pulmonary-veins-left-atrium",
    task="anatomy", difficulty=2, src="os-19-3", nutrition=False,
    fact="Four pulmonary veins empty oxygenated blood into the left atrium. The venae cavae and coronary sinus empty into the right atrium.",
    forbid=["pulmonary vein"],
    vignette=(
        "A 43-year-old woman who restores pottery has four vessels entering one atrium. Temperature is 36.6°C, "
        "pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The blood in those vessels "
        "has just left the lungs and is oxygen-rich. The venae cavae enter the other atrium."
    ),
    stem="Which of the following chamber receives these four vessels?",
    options=[
        "The atrium that sends blood into the systemic ventricle",
        "The atrium that sends blood into the pulmonary ventricle",
        "The ventricle that ejects into the pulmonary trunk",
        "The ventricle that ejects its blood into the aorta",
        "The coronary vein opening beside the inferior vena cava",
    ],
    key=0,
    whys=[
        "The four pulmonary veins return oxygenated blood to the left atrium, which empties into the left ventricle, the systemic pump. The venae cavae enter the other atrium, matching her study.",
        "The right atrium receives systemic venous blood and sends it toward the right ventricle and the lungs.",
        "The right ventricle receives blood from the right atrium, not from the four pulmonary veins.",
        "The left ventricle receives blood from the left atrium through the mitral valve. The four vessels enter the atrium first.",
        "The coronary sinus opens into the right atrium near the inferior vena cava. It is one vessel, not four from the lungs.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="right-atrium-three-inflows",
    task="anatomy", difficulty=2, src="os-19-1", nutrition=False,
    fact="The right atrium receives the superior vena cava, the inferior vena cava, and the coronary sinus.",
    forbid=["superior vena", "coronary sinus"],
    vignette=(
        "A 66-year-old man who drives a bus has three venous openings into one chamber. Temperature is 36.7°C, "
        "pulse is 78/min, respirations are 16/min, and blood pressure is 140/82 mm Hg. One opening brings blood "
        "from above the diaphragm, one from below the diaphragm, and one brings blood that has perfused the heart "
        "muscle. The chamber then sends blood across a three-cusp valve."
    ),
    stem="Which of the following chamber has these three openings?",
    options=[
        "The atrium that empties across the three-cusp valve",
        "The atrium that receives the four pulmonary veins",
        "The ventricle that ejects its blood into the aorta",
        "The ventricle that ejects into the pulmonary trunk",
        "The fluid-filled sac that surrounds the heart",
    ],
    key=0,
    whys=[
        "The right atrium receives the superior vena cava from above the diaphragm, the inferior vena cava from below it, and the coronary sinus from the heart muscle. It empties through the tricuspid valve. His three openings and the three-cusp valve match.",
        "The left atrium receives four pulmonary veins, not these three systemic and coronary veins.",
        "The left ventricle ejects into the aorta. It does not receive the venae cavae.",
        "The right ventricle receives blood only after it has passed the tricuspid valve. The three veins open into the atrium.",
        "The pericardial cavity contains serous fluid, not these three venous openings.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="cardiac-skeleton-blocks-spread",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="Connective tissue of the cardiac skeleton prevents the impulse from spreading from atrial muscle directly into ventricular muscle. The impulse must pass through the AV node.",
    forbid=["skeleton"],
    vignette=(
        "A 50-year-old woman who teaches piano has atrial and ventricular muscle separated by a fibrous ring. "
        "Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. "
        "An impulse in the atrial muscle cannot jump straight into the ventricular muscle. The only muscular "
        "bridge is a node low in the right atrium, and passage there takes about 100 ms."
    ),
    stem="Which of the following is the effect of that fibrous ring?",
    options=[
        "It forces the impulse through the delaying nodal bridge",
        "It speeds the impulse from atrial muscle into ventricular muscle",
        "It is the pacemaker with the fastest inherent rate",
        "It carries the impulse from the apex up the ventricular walls",
        "It returns coronary venous blood to the right atrium",
    ],
    key=0,
    whys=[
        "The cardiac skeleton's connective tissue blocks direct spread from atrial muscle into ventricular muscle, so the impulse must use the AV node. Passage through that node takes about 100 ms. Her fibrous ring and the 100 ms bridge match.",
        "The ring prevents direct spread. It does not speed a muscle-to-muscle jump.",
        "The fastest pacemaker is the SA node, not the fibrous ring.",
        "Apex-to-base spread is the job of the Purkinje fibers after the impulse has reached the ventricles.",
        "The coronary sinus, not the fibrous ring, returns myocardial venous blood.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="ectopic-focus",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="An ectopic focus is a site other than the SA node that starts an impulse and a premature contraction. Occasional ectopic beats are usually transient. A chronic ectopic focus can cause arrhythmia or fibrillation.",
    forbid=["ectopic"],
    vignette=(
        "A 37-year-old man who drinks four cups of coffee has a single early beat, then a normal rhythm. "
        "Temperature is 36.6°C, pulse is 82/min, respirations are 14/min, and blood pressure is 122/76 mm Hg. "
        "The early beat starts from ventricular muscle, not from the usual atrial pacemaker. It does not recur "
        "over the next 10 minutes."
    ),
    stem="Which of the following best describes this single early beat?",
    options=[
        "A site other than the usual pacemaker fired once",
        "The usual pacemaker fired at its fastest inherent rate",
        "The AV node took over at 40 to 60 beats per minute",
        "Fibrillation, an uncoordinated quiver, has begun",
        "The fibrous ring blocked every path into the ventricles",
    ],
    key=0,
    whys=[
        "An ectopic focus is any site other than the SA node that starts an impulse and a premature contraction. Caffeine is one stimulus. A single early beat from ventricular muscle that does not continue is the transient pattern, not a chronic rhythm.",
        "The usual pacemaker did not start this beat. Ventricular muscle did.",
        "An AV nodal escape is a sustained slower rhythm when the SA node is silent, not one early ventricular beat.",
        "Fibrillation is uncoordinated beating. One early beat that returns to normal is not fibrillation.",
        "The fibrous skeleton blocks direct atrial-to-ventricular muscle spread. It did not create this early ventricular beat, and the ventricles were activated.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="flat-t-low-oxygen",
    task="mechanism", difficulty=2, src="os-19-2", nutrition=False,
    fact="T waves often flatten when too little oxygen is delivered to the myocardium.",
    forbid=["t wave"],
    vignette=(
        "A 69-year-old woman who has chest pressure on walking has a tracing taken during pain. Temperature is "
        "36.8°C, pulse is 96/min, respirations are 18/min, and blood pressure is 148/86 mm Hg. The recovery wave "
        "of the ventricles is flat. The segment before that wave is not elevated. Pain stops after 5 minutes of rest."
    ),
    stem="Which of the following is the usual meaning of that flat recovery wave?",
    options=[
        "Too little oxygen is reaching the heart muscle",
        "The upper chambers of the heart are enlarged",
        "An acute infarction is elevating the preceding segment",
        "The impulse is delayed inside the lower atrial node",
        "The usual atrial pacemaker has gone silent",
    ],
    key=0,
    whys=[
        "T waves often look flatter when the myocardium is not getting enough oxygen. Her recovery wave is flat during exertional pain, and the preceding segment is not elevated.",
        "An amplified P wave may indicate atrial enlargement. The abnormal wave here is the ventricular recovery wave.",
        "ST elevation above baseline is the pattern often seen in acute infarction. That segment is not elevated.",
        "Delay from the SA node to the AV node lengthens the PR interval. That interval is not the finding.",
        "A silent SA node would hand the rhythm to a slower backup site. The finding is the shape of the recovery wave.",
    ],
)

add(
    domain="cardiovascular", subject="anatomy", topic="conducting-versus-contractile-cells",
    task="histology", difficulty=2, src="os-19-2", nutrition=False,
    fact="Contractile myocardial cells are about 99 percent of atrial and ventricular cells and do the pumping. Conducting cells are about 1 percent, are smaller, have few myofibrils, and initiate and spread the action potential.",
    forbid=["99", "1 percent"],
    vignette=(
        "A 40-year-old man who teaches biology compares two heart-cell types. Temperature is 36.6°C, pulse is "
        "70/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. One type makes up almost all of the "
        "atrial and ventricular muscle and contains the contracting filaments. The other type is scarce, smaller, "
        "and poor in those filaments."
    ),
    stem="Which of the following is the scarce cell type?",
    options=[
        "The cells that start and spread the electrical impulse",
        "The cells that form almost all of the pumping muscle",
        "The cells that secrete pericardial fluid",
        "The endothelial cells lining the chambers",
        "The red cells that bind oxygen in the coronary blood",
    ],
    key=0,
    whys=[
        "Conducting cells are about 1 percent of heart cells. They are smaller and have few myofibrils. Their job is to start and spread the action potential. The scarce, filament-poor cells are that type.",
        "Contractile cells are about 99 percent and contain the filaments that pump. They are the abundant type.",
        "Pericardial fluid is secreted by the mesothelium of the epicardium, not by a scarce myocardial cell.",
        "Endocardium is the endothelial lining. It is not the scarce filament-poor myocardial cell.",
        "Red cells carry oxygen. They are not a myocardial cell type.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="sa-inherent-rate",
    task="mechanism", difficulty=2, src="os-19-2", nutrition=False,
    fact="Without nervous or endocrine input, the SA node would fire about 80 to 100 times per minute. Rates below 50 per minute are bradycardia for most people.",
    forbid=["80", "100"],
    vignette=(
        "A 30-year-old woman who swims distance is denervated in a thought experiment based on her tracing. "
        "Temperature is 36.5°C, pulse is 52/min, respirations are 12/min, and blood pressure is 104/64 mm Hg. "
        "With the nerves and circulating hormones removed, the usual atrial pacemaker would fire faster than her "
        "current pulse. Her current pulse is still above 50."
    ),
    stem="Which of the following is that pacemaker's rate with nerves and hormones removed?",
    options=[
        "Nearly 80 to 100 beats each minute without outside drive",
        "Nearly 40 to 60 beats each minute from the lower node",
        "Nearly 15 to 20 beats each minute from the terminal fibers",
        "A rate below 50, called bradycardia for most adults",
        "The same 52 beats each minute that she has now",
    ],
    key=0,
    whys=[
        "Isolated from nerves and hormones, the SA node fires about 80 to 100 times per minute. Her resting pulse of 52 is slower than that intrinsic rate, and 52 is still above the 50-per-minute line used for bradycardia in most people.",
        "40 to 60 per minute is the AV node if the SA node is absent.",
        "15 to 20 per minute is the Purkinje fiber rate.",
        "Bradycardia for most people is a rate below 50. Her pulse is 52, and the intrinsic SA rate is faster, not slower.",
        "52 is her current pulse with innervation. The intrinsic pacemaker rate is higher.",
    ],
)

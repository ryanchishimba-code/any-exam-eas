# Batch 2 starts here. Loaded only when S1_EXPECT is 200 or 300.
# Facts from OpenStax Anatomy and Physiology 2e sections 19.2 and 22.4, opened 2026-11-28.

add(
    domain="cardiovascular", subject="physiology", topic="sa-node-pacemaker",
    task="mechanism", difficulty=2, src="os-19-2", nutrition=False,
    fact="The SA node, in the superior posterior right atrium near the SVC, has the highest inherent depolarization rate and is the pacemaker.",
    forbid=["sinoatrial", "pacemaker"],
    vignette=(
        "A 58-year-old man who repairs clocks has a pulse of 78/min at rest. Temperature is 36.6°C, "
        "respirations are 14/min, and blood pressure is 128/76 mm Hg. Mapping shows the earliest "
        "electrical signal arising in the superior posterior right atrium, next to the superior vena cava. "
        "No other site fires before it. He takes no heart medicine."
    ),
    stem="Which of the following best describes the site that fires first?",
    options=[
        "The conducting cells with the fastest inherent rate",
        "The node that pauses about 100 ms before the ventricles",
        "The fibers that carry the impulse from the apex upward",
        "The contractile cells that form 99 percent of the myocardium",
        "The band that reaches the right papillary muscle early",
    ],
    key=0,
    whys=[
        "The SA node in the superior posterior right atrium beside the superior vena cava has the highest inherent rate and sets the rhythm. His earliest signal is at that site, and nothing fires before it.",
        "The AV node is the pause of about 100 ms. It is not the first site to fire.",
        "Purkinje fibers spread the impulse from the apex toward the base after the ventricles are reached. They are not the first site.",
        "Contractile cells are 99 percent of the atrial and ventricular muscle and wait for an impulse. They do not set the earliest signal.",
        "The moderator band carries the impulse to the right papillary muscle. It is not the origin next to the superior vena cava.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="av-node-delay",
    task="mechanism", difficulty=2, src="os-19-2", nutrition=False,
    fact="The impulse takes about 100 ms to pass the AV node, so the atria finish pumping blood into the ventricles before the ventricles are stimulated.",
    forbid=["atrioventricular node"],
    vignette=(
        "A 46-year-old woman who teaches flute has a tracing in which atrial contraction finishes before "
        "the ventricles begin to contract. Temperature is 36.7°C, pulse is 72/min, respirations are 14/min, "
        "and blood pressure is 118/70 mm Hg. The pause between those two events is about 100 ms. The "
        "connective tissue of the cardiac skeleton blocks any direct muscle-to-muscle spread into the ventricles."
    ),
    stem="Which of the following is the purpose of that pause?",
    options=[
        "The atria empty into the ventricles before ventricular contraction",
        "The ventricles repolarize before the atria have depolarized",
        "The papillary muscles relax so the valves can prolapse",
        "Calcium entry during the plateau is prevented entirely",
        "The fastest atrial cells are stopped from firing at all",
    ],
    key=0,
    whys=[
        "The roughly 100 ms delay through the AV node lets atrial contraction finish pumping blood into the ventricles before the ventricular impulse. The cardiac skeleton blocks a direct path, so the pause is the only route, and her tracing shows atrial emptying first.",
        "Ventricular repolarization is the T wave, after the QRS. The pause here is before ventricular contraction, not a reversal of that order.",
        "Papillary muscles are timed to tense the chordae just before ventricular ejection. The pause is not for them to relax.",
        "The plateau depends on calcium entry. The AV delay does not abolish that entry.",
        "The fastest cells, in the SA node, are what start the impulse. The pause does not silence them.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="purkinje-apex-to-base",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="Purkinje fibers spread the impulse from the apex toward the base so ventricular contraction squeezes blood out into the aorta and pulmonary trunk, like squeezing a tube from the bottom.",
    forbid=["purkinje"],
    vignette=(
        "A 63-year-old man who lays brick has ventricular contraction that begins at the apex and moves "
        "toward the base. Temperature is 36.6°C, pulse is 70/min, respirations are 14/min, and blood "
        "pressure is 134/78 mm Hg. The electrical signal reaches the ventricular muscle cells in about 75 ms "
        "after it leaves the bundle branches. Stroke volume on the study is 70 mL."
    ),
    stem="Which of the following does this apex-to-base sequence accomplish?",
    options=[
        "Blood is ejected into the aorta and pulmonary trunk",
        "The atria fill from the venae cavae during systole",
        "The AV valves are forced open by ventricular contraction",
        "Atrial repolarization is drawn as its own separate wave",
        "The atrial pacemaker is reset to the ventricular rate",
    ],
    key=0,
    whys=[
        "Because the impulse starts at the apex and travels toward the base, contraction squeezes the ventricles from the bottom and ejects blood into the aorta and pulmonary trunk. His contraction follows that direction, and the 75 ms spread matches the fast ventricular conducting fibers.",
        "Atrial filling from the venae cavae is not produced by the apex-to-base ventricular squeeze.",
        "Ventricular contraction closes the AV valves. It does not force them open.",
        "Atrial repolarization is hidden inside the QRS. The apex-to-base squeeze does not create a separate wave for it.",
        "The SA node remains the fastest pacemaker. Ventricular conduction does not reset it to the ventricular rate.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="contractile-plateau-calcium",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="In contractile cells the plateau lasts about 175 ms because slow calcium channels let calcium in while few potassium channels are open. That long plateau creates a long refractory period.",
    forbid=["plateau"],
    vignette=(
        "A 51-year-old woman who edits film has a ventricular muscle-cell recording. Temperature is 36.5°C, "
        "pulse is 68/min, respirations are 12/min, and blood pressure is 122/74 mm Hg. After a rapid rise "
        "to about +30 mV, the membrane stays depolarized for about 175 ms while calcium enters and little "
        "potassium leaves. A second stimulus during that time produces no new action potential."
    ),
    stem="Which of the following accounts for the long depolarized interval?",
    options=[
        "Slow calcium entry while few potassium channels are open",
        "A stable sodium leak from minus 60 mV with no calcium",
        "Potassium exit alone, with calcium channels kept shut",
        "Chloride entry from the plasma into the myocyte",
        "Opening of fast sodium channels for the entire 175 ms",
    ],
    key=0,
    whys=[
        "The contractile-cell plateau lasts about 175 ms because slow calcium channels are open and few potassium channels are open. A second stimulus fails during that time, which is the long refractory period this plateau creates. The recording matches that interval and that ion pattern.",
        "A slow sodium rise from about −60 mV is the pacemaker prepotential, not this 175 ms plateau after a spike to +30 mV.",
        "Potassium exit repolarizes the cell. If calcium channels stayed shut, there would be no prolonged depolarized interval.",
        "The plateau is not described as chloride entry.",
        "Fast sodium channels open for the 3–5 ms spike and then close. They are not open for the whole 175 ms.",
    ],
)

add(
    domain="cardiovascular", subject="physiology", topic="calcium-troponin-and-sr",
    task="mechanism", difficulty=3, src="os-19-2", nutrition=False,
    fact="About 20 percent of the calcium for contraction enters during the plateau. The rest is released from the sarcoplasmic reticulum. Calcium binds troponin and allows myosin to cross-bridge with actin.",
    forbid=["troponin"],
    vignette=(
        "A 44-year-old man who tunes pianos has a ventricular cell study. Temperature is 36.7°C, pulse is "
        "74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. During the long depolarized "
        "phase, calcium entering from outside supplies about one-fifth of the calcium used for contraction. "
        "The rest comes from an internal store. Cross-bridge cycling then starts."
    ),
    stem="Which of the following is the internal store and the trigger protein?",
    options=[
        "Sarcoplasmic reticulum calcium, then binding to troponin",
        "Mitochondrial calcium, then binding to myosin heads",
        "Extracellular calcium only, with no internal store",
        "Nuclear calcium, then binding to actin monomers",
        "T-tubule sodium, then binding to tropomyosin alone",
    ],
    key=0,
    whys=[
        "About 20 percent of contraction calcium enters during the plateau. The remaining 80 percent is released from the sarcoplasmic reticulum. Calcium binds troponin, moving tropomyosin so myosin can cross-bridge with actin. The study shows the one-fifth outside fraction and an internal store.",
        "The internal store named for this calcium is the sarcoplasmic reticulum, not mitochondria, and the regulatory protein is troponin, not the myosin head itself.",
        "Outside calcium is only about 20 percent. Most comes from the internal store.",
        "The nucleus is not the calcium store for the power stroke, and calcium does not bind actin monomers to start the bridge.",
        "T tubules carry the impulse inward. The ion that binds the regulatory protein is calcium, not sodium.",
    ],
)

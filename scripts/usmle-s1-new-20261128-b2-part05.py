# Respiratory mechanics and control. OpenStax 22.3.

add(
    domain="respiratory-renal", subject="physiology", topic="boyle-inspiration",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Boyle's law: at constant temperature, gas pressure is inversely proportional to volume. Inspiration increases thoracic volume, lowers alveolar pressure below atmospheric pressure, and air flows in.",
    forbid=["boyle"],
    vignette=(
        "A 26-year-old man who climbs indoor walls takes a quiet breath. Temperature is 36.6°C, pulse is "
        "64/min, respirations are 12/min, and blood pressure is 116/70 mm Hg. The diaphragm descends, the rib "
        "cage enlarges, and alveolar pressure falls below the pressure of the room air. Air then enters. Room "
        "temperature does not change during the breath."
    ),
    stem="Which of the following makes air enter after the chest enlarges?",
    options=[
        "Alveolar pressure falls below the pressure of room air",
        "Alveolar pressure rises above the pressure of room air",
        "Intrapleural pressure becomes higher than alveolar pressure",
        "The lungs contract and pull air in by their own muscle",
        "Carbon dioxide is pumped into the alveoli by ATP",
    ],
    key=0,
    whys=[
        "At constant temperature, increasing volume lowers gas pressure. When the chest enlarges, alveolar pressure falls below atmospheric pressure and air flows in. His diaphragm descended, the cage enlarged, and alveolar pressure fell before air entered.",
        "Pressure above room air drives air out, which is expiration, not this inspiratory breath.",
        "Intrapleural pressure stays lower than alveolar pressure. It does not rise above it to cause inflow.",
        "The lungs are passive. They are pulled open by the chest wall and pleural fluid. They do not contain the muscle that enlarges the chest.",
        "Gas movement here follows a pressure gradient. ATP is not used to pump carbon dioxide in during this breath.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="quiet-expiration-passive",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Quiet expiration is passive. Elastic recoil of the lung, after the diaphragm and external intercostals relax, raises intrapulmonary pressure above atmospheric pressure and air leaves. No energy is required to push the air out.",
    forbid=["passive"],
    vignette=(
        "A 31-year-old woman who proofs manuscripts is breathing quietly at rest. Temperature is 36.5°C, pulse "
        "is 68/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. After each breath in, the "
        "diaphragm and the outer rib muscles relax. The lungs recoil, pressure inside them rises above room air, "
        "and air leaves. She is not singing or exercising."
    ),
    stem="Which of the following drives this outflow?",
    options=[
        "Elastic recoil after the inspiratory muscles relax",
        "Contraction of the abdominal wall and internal rib muscles",
        "Active shortening of muscle inside the lung itself",
        "A fall of alveolar pressure to a level below room air",
        "Scalene contraction lifting the rib cage farther",
    ],
    key=0,
    whys=[
        "Quiet expiration does not require energy to push air out. After the diaphragm and external intercostals relax, elastic recoil shrinks the lungs, intrapulmonary pressure rises above atmospheric pressure, and air leaves. She is at rest, not forcing the breath.",
        "Abdominal muscles and internal intercostals are used in forced expiration, as in exercise or singing. She is doing neither.",
        "Lung tissue itself is passive. It recoils. It does not contain the muscle of breathing.",
        "Alveolar pressure below room air causes inflow. Outflow requires pressure inside the lung above room air.",
        "Scalene contraction lifts the chest for a forced inspiration, the opposite of this quiet outflow.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="surfactant-type-ii",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Type II alveolar cells secrete pulmonary surfactant, which mixes with water and lowers alveolar surface tension. Without it, alveoli collapse during expiration.",
    forbid=["surfactant", "type ii", "type 2"],
    vignette=(
        "A 2-hour-old boy born at 27 weeks has stiff lungs and repeated alveolar collapse at the end of each "
        "breath. Temperature is 36.4°C, pulse is 160/min, respirations are 70/min, and blood pressure is "
        "48/28 mm Hg. The cells that should release the substance that mixes with the water film on the alveolar "
        "lining are immature. Inspired oxygen fraction is 0.4."
    ),
    stem="Which of the following is missing from the alveolar lining?",
    options=[
        "The substance that lowers surface tension of the water film",
        "The muscle that actively expands each alveolus",
        "Carbonic anhydrase that makes bicarbonate in red cells",
        "The protein that binds four oxygen molecules on heme",
        "The negative intrapleural pressure of about 4 mm Hg",
    ],
    key=0,
    whys=[
        "Type II alveolar cells secrete surfactant, which mixes with the water lining and lowers surface tension. Without it, alveoli collapse on expiration. This premature infant's collapse at the end of each breath fits missing surfactant from immature cells.",
        "Alveoli are not expanded by muscle inside them. The chest wall and diaphragm enlarge the lung.",
        "Carbonic anhydrase is in red cells and converts carbon dioxide to carbonic acid. It is not the missing alveolar-lining substance.",
        "Hemoglobin binds oxygen. It does not stop alveoli from collapsing.",
        "Intrapleural pressure is about 4 mm Hg below alveolar pressure in the intact chest. The problem named here is the water film on the alveoli.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="intrapleural-negative",
    task="mechanism", difficulty=3, src="os-22-3", nutrition=False,
    fact="Intrapleural pressure stays about 4 mm Hg below intra-alveolar pressure throughout the cycle. Lung elastic recoil and alveolar surface tension pull inward. The chest wall and pleural fluid pull outward slightly more.",
    forbid=["intrapleural"],
    vignette=(
        "A 40-year-old man who installs flooring has pleural and alveolar pressures recorded. Temperature is "
        "36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Throughout the "
        "cycle, pressure in the pleural space stays about 4 mm Hg below pressure inside the alveoli. The lung "
        "tissue itself pulls inward."
    ),
    stem="Which of the following keeps the pleural pressure below alveolar pressure?",
    options=[
        "Inward lung recoil slightly exceeded by the outward chest pull",
        "Alveolar pressure held 4 mm Hg above room air at all times",
        "Active contraction of smooth muscle in the alveolar wall",
        "Surfactant raising surface tension so the lung pulls outward",
        "The diaphragm pushing abdominal contents into the chest",
    ],
    key=0,
    whys=[
        "Elastic recoil and alveolar surface tension pull the lung inward. The chest wall and pleural fluid pull outward, and the outward pull is slightly greater, leaving intrapleural pressure about 4 mm Hg below alveolar pressure. His tracing shows that 4 mm Hg gap, and the lung pulls inward.",
        "Alveolar pressure is not held above room air for the whole cycle. It falls below room air on inspiration.",
        "The lung is passive during breathing. Alveolar walls are not the muscle creating this pressure gap.",
        "Surfactant lowers surface tension. It does not raise it to pull the lung outward.",
        "On inspiration the diaphragm moves down, away from the chest, enlarging the thorax. It does not push abdominal contents into the chest.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="forced-expiration-muscles",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Forced expiration uses abdominal muscles, including the obliques, which push abdominal organs up against the diaphragm, and the internal intercostals, which compress the rib cage.",
    forbid=["forced expiration", "internal intercostal"],
    vignette=(
        "A 24-year-old man who sings in a choir pushes out a long loud phrase. Temperature is 36.7°C, pulse is "
        "88/min, respirations are 18/min, and blood pressure is 122/70 mm Hg. His abdominal wall tightens and "
        "the ribs are pulled downward and inward. Air leaves faster than during quiet speech. He is not inhaling."
    ),
    stem="Which of the following muscles are doing that work?",
    options=[
        "Abdominal muscles and the internal muscles between the ribs",
        "The diaphragm and the external muscles between the ribs",
        "Only the scalene muscles lifting the upper ribs",
        "Smooth muscle lying in the alveolar ducts alone",
        "The thick ventricular muscle, which does not move the ribs",
    ],
    key=0,
    whys=[
        "Forced expiration, as in singing, uses abdominal muscles such as the obliques to push the diaphragm up, and internal intercostals to compress the rib cage. His abdomen tightens and the ribs move down and in while air leaves.",
        "The diaphragm and external intercostals contract for inspiration, including quiet inspiration. He is pushing air out.",
        "Scalenes lift the chest for forced inspiration, not for this expiratory push.",
        "Alveolar ducts are not the muscles emptying the chest in a sung phrase.",
        "The heart does not provide the expiratory muscle effort described.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="tidal-versus-residual",
    task="mechanism", difficulty=2, src="os-22-3", nutrition=False,
    fact="Tidal volume is about 500 mL, the quiet breath. Residual volume is the air left after a maximal exhalation and helps keep alveoli from collapsing. Vital capacity is tidal volume plus inspiratory and expiratory reserve, and excludes residual volume.",
    forbid=["residual", "tidal"],
    vignette=(
        "A 29-year-old woman who teaches swimming exhales as far as she can after a normal quiet breath of about "
        "500 mL. Temperature is 36.6°C, pulse is 66/min, respirations are 12/min, and blood pressure is 112/68 mm Hg. "
        "Some air remains in the lungs. That leftover air is not included when the movable volumes are added together."
    ),
    stem="Which of the following is the air that remains after the maximal exhalation?",
    options=[
        "The volume left behind that keeps alveoli from collapsing",
        "The quiet breath of about 500 mL that she just took",
        "The extra air she could still inhale after a quiet breath",
        "The sum of every movable volume, including that leftover air",
        "Air moved only when the scalene muscles contract",
    ],
    key=0,
    whys=[
        "Residual volume is what remains after a maximal exhalation. It makes breathing easier by keeping alveoli from collapsing, and vital capacity excludes it. She has exhaled as far as she can, and air is still there.",
        "About 500 mL is the quiet tidal breath, which she already exhaled past.",
        "Air that can still be inhaled after a quiet breath is the inspiratory reserve, not the air left after a maximal exhalation.",
        "Total lung capacity includes residual volume. Vital capacity, the sum of the movable volumes, leaves residual volume out. The question asks for the air that remains.",
        "Scalene contraction is a forced inspiratory effort. It does not name the volume left after maximal exhalation.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="vrg-sets-rhythm",
    task="mechanism", difficulty=3, src="os-22-3", nutrition=False,
    fact="The ventral respiratory group in the medulla sets the rhythm by stimulating the diaphragm and external intercostals. When that activity stops, those muscles relax and expiration occurs. The dorsal group receives stretch and chemoreceptor input and modifies the rhythm.",
    forbid=["ventral respiratory", "dorsal respiratory"],
    vignette=(
        "A 55-year-old man who keeps archives has a brainstem map of breathing. Temperature is 36.6°C, pulse is "
        "74/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. One medullary cell group fires, the "
        "diaphragm contracts, and air enters. When that firing stops, the diaphragm relaxes and air leaves. A "
        "second group receives stretch signals and only adjusts the rhythm."
    ),
    stem="Which of the following is the group whose firing starts the breath in?",
    options=[
        "The medullary group that drives the diaphragm and outer rib muscles",
        "The medullary group that only receives stretch and chemical signals",
        "Peripheral sensors in the carotid arteries and aortic arch",
        "Type II alveolar cells secreting the anti-collapse substance",
        "The atrial pacemaker firing 80 to 100 times a minute",
    ],
    key=0,
    whys=[
        "The ventral respiratory group maintains the rhythm by stimulating the diaphragm and external intercostals. When it stops, those muscles relax and expiration follows. His first group matches that on-off pattern.",
        "The dorsal respiratory group receives stretch-receptor and chemoreceptor input and modifies the ventral group. It is the second group, not the one that directly starts inspiration.",
        "Carotid and aortic sensors are peripheral chemoreceptors. They inform the dorsal group. They are not the medullary cells whose firing starts the breath.",
        "Type II cells secrete surfactant. They do not pace the diaphragm.",
        "The SA node paces the heart near 80 to 100 beats per minute without nervous input. It does not pace breathing.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="co2-main-respiratory-drive",
    task="mechanism", difficulty=3, src="os-22-3", nutrition=False,
    fact="The main chemical drive to breathe is carbon dioxide, not oxygen. Rising CO2 diffuses into brain extracellular fluid, and central chemoreceptors respond. Peripheral chemoreceptors sit in the carotid arteries and aortic arch.",
    forbid=["carbon dioxide", "chemoreceptor"],
    vignette=(
        "A 47-year-old woman who designs maps is breathing room air. Temperature is 36.6°C, pulse is 76/min, "
        "respirations are 16/min, and blood pressure is 118/72 mm Hg. Her arterial oxygen pressure is 95 mm Hg. "
        "A small rise in the waste gas from metabolism increases her breathing, while a matched change in oxygen "
        "alone does not. The rise is sensed after that gas crosses into brain extracellular fluid."
    ),
    stem="Which of the following is the gas driving the increase in breathing?",
    options=[
        "The metabolic waste gas that crosses into brain fluid",
        "Oxygen, because arterial oxygen is the main drive at rest",
        "Nitrogen, which makes up most of ordinary room air",
        "Carbon monoxide bound tightly to heme iron",
        "Extra dissolved nitrogen acquired during a deep dive",
    ],
    key=0,
    whys=[
        "The main stimulus to breathe is carbon dioxide, not oxygen. Rising carbon dioxide crosses into brain extracellular fluid and is sensed by central chemoreceptors. Her oxygen is 95 mm Hg, and the breathing increase follows the waste gas, not a matched oxygen change.",
        "Oxygen is not the main drive at rest. The vignette says a matched oxygen change does not increase her breathing.",
        "Nitrogen is most of atmospheric air, about 78.6 percent, but it is not the chemical drive to breathe.",
        "Carbon monoxide binds heme much more tightly than oxygen. It is not the waste gas of metabolism that crosses into brain fluid.",
        "Extra dissolved nitrogen is a high-pressure diving problem. She is breathing room air.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="central-sleep-apnea-co2",
    task="mechanism", difficulty=3, src="os-22-3", nutrition=False,
    fact="In central sleep apnea the respiratory centers do not respond properly to rising carbon dioxide, so they do not regularly stimulate the diaphragm and intercostals. Morphine can also depress those centers.",
    forbid=["central sleep apnea", "morphine"],
    vignette=(
        "A 68-year-old man who had a stroke pauses his breathing for 15 seconds while asleep, with no effort of "
        "the chest. Temperature is 36.8°C, pulse is 80/min, respirations are 10/min when he breathes, and blood "
        "pressure is 146/84 mm Hg. The waste gas in his blood is rising during each pause, but the brainstem "
        "centers do not answer by driving the diaphragm. Airflow is not blocked by the tongue."
    ),
    stem="Which of the following best explains the pauses?",
    options=[
        "The medullary drive ignores the climbing waste-gas level",
        "The tongue blocks the airway while the diaphragm still pulls",
        "Type II cells stop secreting the anti-collapse substance",
        "Pulmonary arterioles all dilate and waste the next breath",
        "The pleural space fills with air and the lung recoils shut",
    ],
    key=0,
    whys=[
        "Central sleep apnea means the respiratory centers do not respond properly to rising carbon dioxide, so they do not stimulate the diaphragm and intercostals. Stroke can damage the pons or medulla. His chest makes no effort, the waste gas rises, and the airway is not blocked.",
        "Effort against a blocked airway is the obstructive pattern. His chest makes no effort, and the tongue is not blocking flow.",
        "Missing surfactant collapses alveoli. It does not make the brainstem ignore a rising waste-gas signal.",
        "Poorly ventilated alveoli constrict their arterioles. That does not stop the brainstem from driving the diaphragm.",
        "Air in the pleural space is not described. The failure is the brainstem response.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="functional-residual-capacity",
    task="mechanism", difficulty=4, src="os-22-3", nutrition=False,
    fact="Functional residual capacity is the air left after a normal tidal expiration. It is expiratory reserve volume plus residual volume.",
    forbid=["functional residual"],
    vignette=(
        "A 38-year-old woman who archives photographs finishes a normal quiet exhalation and stops. Temperature "
        "is 36.6°C, pulse is 70/min, respirations are 13/min, and blood pressure is 114/70 mm Hg. She has not "
        "forced any more air out. The volume still in the lungs is the sum of what she could still force out and "
        "what would remain even after that forced effort."
    ),
    stem="Which of the following two volumes make up the air still in her lungs?",
    options=[
        "What she could still force out, plus air she cannot exhale",
        "The quiet breath, plus the extra she could still inhale",
        "Only the quiet 500 mL breath she just finished",
        "Every lung volume, including the air she can still inhale",
        "The inspiratory reserve alone, after a maximal inhalation",
    ],
    key=0,
    whys=[
        "After a normal tidal expiration, the remaining air is the functional residual capacity, which is expiratory reserve plus residual volume. She stopped after a quiet exhalation, and the description matches those two leftover parts.",
        "Tidal volume plus inspiratory reserve is inspiratory capacity, the air that can be inhaled after a quiet expiration, not the air still inside.",
        "The quiet breath is what she just exhaled. It is not the volume remaining.",
        "The sum of all volumes is total lung capacity, which includes air she could still inhale. She is at the end of a quiet exhalation.",
        "Inspiratory reserve is extra inhaled air, measured from a quiet inspiration, not the air left after a quiet exhalation.",
    ],
)

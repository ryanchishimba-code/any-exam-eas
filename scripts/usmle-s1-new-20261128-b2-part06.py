# Gas transport. OpenStax 22.5 and a few 22.4 items not yet used.

add(
    domain="respiratory-renal", subject="physiology", topic="bohr-effect-acid",
    task="mechanism", difficulty=3, src="os-22-5", nutrition=False,
    fact="The Bohr effect: a lower, more acidic pH promotes oxygen dissociation from hemoglobin. A higher pH inhibits dissociation.",
    forbid=["bohr"],
    vignette=(
        "A 27-year-old man who sprints stairs has acid collecting in working muscle. Temperature is 37.4°C, "
        "pulse is 140/min, respirations are 28/min, and blood pressure is 150/70 mm Hg. Local pH falls. Oxygen "
        "leaves hemoglobin more readily there than it does in a resting muscle at the same oxygen pressure of "
        "40 mm Hg."
    ),
    stem="Which of the following makes oxygen leave hemoglobin more readily here?",
    options=[
        "A more acidic pH at the working muscle",
        "A more alkaline pH at the working muscle",
        "A lower temperature inside the working muscle",
        "Less 2,3-bisphosphoglycerate in the red cells",
        "Fetal hemoglobin replacing adult hemoglobin",
    ],
    key=0,
    whys=[
        "The Bohr effect is that a lower, more acidic pH promotes oxygen dissociation from hemoglobin. His working muscle is acidic, and oxygen leaves more readily than in resting muscle at the same oxygen pressure.",
        "A higher pH inhibits dissociation. That would hold oxygen on hemoglobin, the opposite of this muscle.",
        "A higher temperature promotes dissociation. A lower temperature inhibits it. Working muscle is the warmer case, but the comparison he was given is the fall in pH.",
        "More 2,3-bisphosphoglycerate, not less, promotes oxygen dissociation.",
        "Fetal hemoglobin has a higher affinity for oxygen than adult hemoglobin, so it holds oxygen more tightly. He is an adult sprinter.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="bpg-dissociation",
    task="mechanism", difficulty=4, src="os-22-5", nutrition=False,
    fact="Erythrocytes lack mitochondria and make ATP only by glycolysis. 2,3-bisphosphoglycerate, a glycolytic byproduct, promotes oxygen dissociation from hemoglobin.",
    forbid=["bisphosphoglycerate", "bpg", "2,3"],
    vignette=(
        "A 33-year-old woman who is pregnant has red cells making more of a glycolytic byproduct. Temperature "
        "is 36.7°C, pulse is 88/min, respirations are 16/min, and blood pressure is 112/68 mm Hg. Her red cells "
        "have no mitochondria. The byproduct makes oxygen leave hemoglobin more readily at a given oxygen pressure."
    ),
    stem="Which of the following is true of the cells that make this byproduct?",
    options=[
        "They make ATP only by glycolysis, because they lack mitochondria",
        "They use mitochondria and oxidative phosphorylation",
        "They are type II alveolar cells secreting the anti-collapse film",
        "They are medullary neurons that set the breathing rhythm",
        "They are the pacemaker cells beside the vena cava",
    ],
    key=0,
    whys=[
        "Red cells have no mitochondria, so glycolysis is their only ATP source. 2,3-bisphosphoglycerate is a glycolytic byproduct and promotes oxygen release from hemoglobin. Her red cells are making more of it.",
        "The byproduct comes from glycolysis. These cells do not use mitochondria.",
        "Type II alveolar cells secrete surfactant. They are not the cells whose missing mitochondria define this pathway.",
        "Medullary respiratory neurons pace breathing. They are not the source of this red-cell byproduct.",
        "The SA node paces the heart. It does not make the glycolytic byproduct that shifts oxygen off hemoglobin.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="fetal-hemoglobin-affinity",
    task="mechanism", difficulty=3, src="os-22-5", nutrition=False,
    fact="Fetal hemoglobin has a higher oxygen affinity than adult hemoglobin because two of its four subunits differ. Placental maternal PO2 is about 35 to 50 mm Hg and fetal PO2 is about 20 mm Hg.",
    forbid=["fetal hemoglobin"],
    vignette=(
        "A 32-week fetus is oxygenated across the placenta. Temperature of the pregnant woman is 36.7°C, her "
        "pulse is 90/min, respirations are 16/min, and blood pressure is 114/70 mm Hg. Oxygen pressure on the "
        "maternal side of the placenta is 40 mm Hg, and on the fetal side it is 20 mm Hg. The fetus still loads "
        "oxygen onto its red-cell protein."
    ),
    stem="Which of the following lets the fetus load oxygen at that low pressure?",
    options=[
        "Its hemoglobin holds oxygen more tightly than adult hemoglobin",
        "Its hemoglobin holds oxygen less tightly than adult hemoglobin",
        "Maternal arterial oxygen pressure at the placenta is 104 mm Hg",
        "Fetal red cells bind oxygen to globin amino acids, not to iron",
        "The placenta pumps oxygen with an ATP-driven carrier",
    ],
    key=0,
    whys=[
        "Fetal hemoglobin has a greater affinity for oxygen than adult hemoglobin because two subunits differ. That lets the fetus load oxygen even though placental maternal oxygen pressure is only about 35 to 50 mm Hg and fetal pressure is about 20 mm Hg. The values here are 40 and 20.",
        "Lower affinity would release oxygen, which is the adult response in tissues, not how the fetus loads oxygen at low pressure.",
        "About 104 mm Hg is alveolar oxygen pressure, not the oxygen pressure of maternal blood at the placenta.",
        "Carbon dioxide binds globin amino acids. Oxygen binds the iron in heme, in both fetal and adult hemoglobin.",
        "Gas exchange at the chorion, like the lung, follows partial-pressure gradients. It is not an ATP pump.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="co2-mostly-bicarbonate",
    task="mechanism", difficulty=2, src="os-22-5", nutrition=False,
    fact="About 70 percent of carbon dioxide is transported as bicarbonate, about 20 percent as carbaminohemoglobin, and about 7 to 10 percent dissolved. Carbonic anhydrase in red cells forms carbonic acid.",
    forbid=["bicarbonate", "seventy"],
    vignette=(
        "A 42-year-old man who teaches chemistry follows a labeled carbon dioxide molecule from muscle into blood. "
        "Temperature is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. "
        "Most such molecules are carried in a converted ionic form. A red-cell enzyme joins the gas to water as "
        "the first step of that conversion."
    ),
    stem="Which of the following is the main way this gas is carried?",
    options=[
        "As bicarbonate after a red-cell enzyme joins it to water",
        "Dissolved in plasma, which accounts for most of the load",
        "Bound to the iron of heme, the same site oxygen uses",
        "Bound to globin, which accounts for most of the load",
        "Inside neutrophils as a carbamino compound",
    ],
    key=0,
    whys=[
        "About 70 percent of carbon dioxide travels as bicarbonate. Carbonic anhydrase in red cells joins carbon dioxide to water to make carbonic acid, which splits into bicarbonate and hydrogen. His molecule follows that majority path.",
        "Only about 7 to 10 percent is dissolved in plasma. That is not most of the load.",
        "Oxygen binds heme iron. Carbon dioxide does not use that site.",
        "About 20 percent binds globin as carbaminohemoglobin. That is not the majority.",
        "The carbamino compound is on hemoglobin in red cells, not in neutrophils.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="chloride-shift",
    task="mechanism", difficulty=4, src="os-22-5", nutrition=False,
    fact="Bicarbonate leaves the red cell in exchange for chloride, the chloride shift, so the cell's charge does not change. At the lung the exchange reverses.",
    forbid=["chloride shift"],
    vignette=(
        "A 36-year-old woman who edits film has red cells studied as they pass a working muscle. Temperature is "
        "36.7°C, pulse is 80/min, respirations are 16/min, and blood pressure is 116/72 mm Hg. Bicarbonate builds "
        "up inside the red cells and then leaves. A different negative ion enters one-for-one, and the cell's "
        "charge does not change."
    ),
    stem="Which of the following ion enters as bicarbonate leaves?",
    options=[
        "Chloride, one negative ion exchanged for another",
        "Sodium, so the interior becomes more positive",
        "Potassium, leaving the cell even more negative",
        "Calcium, to bind troponin in the red cell",
        "Bicarbonate itself, in the same direction",
    ],
    key=0,
    whys=[
        "The chloride shift is bicarbonate leaving the red cell in exchange for chloride. One negative ion replaces another, so the charge of the cell and of the plasma does not change. Bicarbonate is leaving her red cells at the muscle.",
        "Sodium entry would change the charge. The exchange is arranged so the charge does not change.",
        "Potassium is not the ion traded for bicarbonate in this exchange.",
        "Calcium binding to troponin is a muscle mechanism. Red cells are not contracting.",
        "Bicarbonate is the ion leaving. The ion that enters is chloride.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="haldane-effect",
    task="mechanism", difficulty=4, src="os-22-5", nutrition=False,
    fact="The Haldane effect: hemoglobin saturated with oxygen does not readily bind carbon dioxide. When oxygen is not bound and oxygen pressure is low, hemoglobin binds carbon dioxide more readily.",
    forbid=["haldane"],
    vignette=(
        "A 50-year-old man who sands floors has two blood samples. Temperature is 36.6°C, pulse is 78/min, "
        "respirations are 14/min, and blood pressure is 128/76 mm Hg. Sample A is leaving the lungs, nearly "
        "full of oxygen, and it binds little carbon dioxide. Sample B is in a working muscle, oxygen-poor, and "
        "it binds carbon dioxide readily."
    ),
    stem="Which of the following explains the difference between the samples?",
    options=[
        "Oxygen-loaded hemoglobin binds carbon dioxide poorly",
        "Oxygen-loaded hemoglobin binds carbon dioxide more tightly",
        "Only dissolved carbon dioxide can bind oxygen-loaded hemoglobin",
        "Carbon dioxide binds heme iron whenever oxygen is bound",
        "The chloride shift runs only in oxygen-rich blood",
    ],
    key=0,
    whys=[
        "The Haldane effect is that hemoglobin saturated with oxygen does not readily bind carbon dioxide, while deoxygenated hemoglobin binds it more readily. Sample A has just left the lungs full of oxygen. Sample B is oxygen-poor in muscle.",
        "The relationship is the opposite. Oxygen saturation lowers the affinity for carbon dioxide.",
        "Dissolved carbon dioxide is a separate fraction, about 7 to 10 percent. It is not the condition for binding to hemoglobin.",
        "Carbon dioxide binds globin amino acids, not heme iron, and it binds better when oxygen is absent.",
        "The chloride shift accompanies bicarbonate exit at the tissues and reverses in the lung. It is not limited to oxygen-rich blood.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="cooperative-oxygen-binding",
    task="mechanism", difficulty=3, src="os-22-5", nutrition=False,
    fact="Each hemoglobin has four iron-containing heme groups and can carry four oxygen molecules. Binding of the first oxygen makes the next easier to bind.",
    forbid=["cooperative", "four"],
    vignette=(
        "A 21-year-old woman who rows has hemoglobin studied as it loads oxygen in the lung. Temperature is "
        "36.5°C, pulse is 58/min, respirations are 12/min, and blood pressure is 108/66 mm Hg. After the first "
        "oxygen attaches, the next oxygen attaches more easily. Each protein can hold several oxygen molecules, "
        "one at each iron-containing site."
    ),
    stem="Which of the following describes that loading pattern?",
    options=[
        "The first oxygen makes the next oxygen easier to bind",
        "The first oxygen makes the next oxygen harder to bind",
        "Oxygen binds amino acids of globin, not the iron",
        "Only one oxygen can bind, and further binding stops",
        "Loading that requires ATP at each heme iron",
    ],
    key=0,
    whys=[
        "Binding the first oxygen changes hemoglobin so the next oxygen binds more readily, until all four heme sites are filled. Her loading shows that facilitation, at iron-containing sites.",
        "Facilitation is the observed pattern, not hindrance, as successive oxygens bind.",
        "Carbon dioxide binds globin. Oxygen binds the iron in heme.",
        "Each hemoglobin can carry up to four oxygen molecules, not one.",
        "Oxygen binding to heme is not described as an ATP-consuming step.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="carbon-monoxide-affinity",
    task="mechanism", difficulty=3, src="os-22-4", nutrition=False,
    fact="Hemoglobin's affinity for carbon monoxide is much stronger than its affinity for oxygen, so carbon monoxide replaces oxygen. Hyperbaric oxygen raises dissolved oxygen and displaces carbon monoxide from hemoglobin.",
    forbid=["carbon monoxide"],
    vignette=(
        "A 45-year-old man who runs a garage is found confused after working with a running engine. Temperature "
        "is 36.8°C, pulse is 110/min, respirations are 22/min, and blood pressure is 130/78 mm Hg. A gas in the "
        "exhaust occupies the oxygen-binding sites because the red-cell protein holds that gas much more tightly "
        "than oxygen. He is placed in a chamber where the surrounding pressure is raised and he breathes added oxygen."
    ),
    stem="Which of the following is the point of the high-pressure oxygen?",
    options=[
        "More oxygen dissolves and displaces the exhaust gas from heme",
        "The exhaust gas is oxidized to carbon dioxide by heme iron",
        "Surfactant production rises and collapsed alveoli reopen",
        "The ventral medullary group is directly stimulated",
        "Bicarbonate is converted back to the exhaust gas",
    ],
    key=0,
    whys=[
        "Hemoglobin binds carbon monoxide much more tightly than oxygen, so carbon monoxide replaces oxygen. Raised atmospheric pressure in a hyperbaric chamber dissolves more oxygen and that oxygen displaces carbon monoxide from hemoglobin. He was exposed to engine exhaust and is treated that way.",
        "The treatment does not oxidize carbon monoxide to carbon dioxide on heme. It displaces it by raising dissolved oxygen.",
        "Surfactant reopens alveoli that lack it. That is not the exhaust-gas problem.",
        "The ventral respiratory group paces breathing. The chamber is used to move the gas off hemoglobin.",
        "Bicarbonate is the carriage form of carbon dioxide, not of the exhaust gas on heme.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="bronchioles-co2-dilate",
    task="mechanism", difficulty=3, src="os-22-4", nutrition=False,
    fact="Bronchiolar diameter responds to alveolar carbon dioxide. Higher alveolar carbon dioxide widens bronchioles. Higher alveolar oxygen widens pulmonary arterioles.",
    forbid=["bronchiole"],
    vignette=(
        "A 53-year-old woman who teaches pottery has one lung region with a high carbon dioxide pressure in the "
        "alveoli. Temperature is 36.7°C, pulse is 82/min, respirations are 18/min, and blood pressure is "
        "126/74 mm Hg. The small airways to that region widen. The arterioles there do not widen, because oxygen "
        "in those alveoli is not high."
    ),
    stem="Which of the following widened the small airways?",
    options=[
        "High carbon dioxide pressure inside those alveoli",
        "A high oxygen pressure inside those same alveoli",
        "Low carbon dioxide pressure inside those alveoli",
        "Constriction of every pulmonary arteriole in that region",
        "A fall in pleural pressure to 4 mm Hg above alveolar pressure",
    ],
    key=0,
    whys=[
        "A higher partial pressure of carbon dioxide in the alveoli widens bronchioles so carbon dioxide can be exhaled faster. Her small airways widened where alveolar carbon dioxide is high, and the arterioles did not widen because oxygen there is not high.",
        "High alveolar oxygen dilates pulmonary arterioles, not the bronchioles. The vignette says the arterioles did not widen.",
        "Low alveolar carbon dioxide would not be the stimulus that increases airway diameter.",
        "Arteriole constriction redirects blood away from poorly ventilated alveoli. It is not what widened the airways.",
        "Intrapleural pressure stays below alveolar pressure, about 4 mm Hg lower, not 4 mm Hg higher.",
    ],
)

add(
    domain="respiratory-renal", subject="physiology", topic="henry-nitrogen-dive",
    task="mechanism", difficulty=3, src="os-22-4", nutrition=False,
    fact="Henry's law: gas dissolved in a liquid is proportional to its partial pressure and solubility. Nitrogen is poorly soluble at ordinary pressure, but high nitrogen pressure in scuba air dissolves more nitrogen in blood.",
    forbid=["henry", "scuba"],
    vignette=(
        "A 34-year-old man who dives for salvage breathes compressed air at depth. Temperature is 36.6°C, pulse "
        "is 78/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. Nitrogen, which barely dissolves "
        "at sea-level pressure, now dissolves in his blood in a much larger amount. He ascends without stopping."
    ),
    stem="Which of the following explains the extra dissolved nitrogen?",
    options=[
        "A higher nitrogen pressure drives more of it into the blood",
        "Nitrogen becomes highly soluble only because he is colder",
        "Hemoglobin binds nitrogen at the same iron site as oxygen",
        "Carbonic anhydrase converts nitrogen into bicarbonate",
        "Type II cells secrete nitrogen into the alveolar water film",
    ],
    key=0,
    whys=[
        "Henry's law says the amount of gas dissolved is proportional to partial pressure and solubility. Nitrogen solubility is low, but the high nitrogen pressure in compressed air at depth dissolves more of it. He breathed that air and ascended without a stop.",
        "The source of the extra dissolved nitrogen is the raised partial pressure, not a change in body temperature.",
        "Hemoglobin's iron site binds oxygen. Nitrogen's problem here is dissolved gas, not heme binding.",
        "Carbonic anhydrase handles carbon dioxide and water, not nitrogen.",
        "Type II cells secrete surfactant. They do not secrete nitrogen into the lining film.",
    ],
)

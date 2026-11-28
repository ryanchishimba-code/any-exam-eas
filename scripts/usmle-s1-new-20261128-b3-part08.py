# Batch 3. Remaining items to reach 100, still from opened sections.

add(
    domain="gastrointestinal", subject="physiology", topic="ingestion-only-mouth",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Ingestion occurs only in the mouth. Defecation occurs only at the anus. Most other digestive processes involve several organs.",
    forbid=["only in the mouth"],
    vignette=(
        "A 18-year-old student maps where each digestive job can occur. Temperature is 36.6°C, pulse is 72/min, "
        "respirations are 14/min, and blood pressure is 110/68 mm Hg. One job happens at a single entrance and "
        "nowhere else. Elimination happens at a single exit. Mixing and chemical breakdown occur in more than one organ."
    ),
    stem="Which of the following job happens only at the entrance?",
    options=[
        "Taking food into the alimentary canal",
        "Eliminating what was never absorbed",
        "Splitting proteins into their amino acids",
        "Absorbing fats into the lymph vessels",
        "Neutralizing gastric acid with pancreatic alkali",
    ],
    key=0,
    whys=[
        "Ingestion, the entry of food, occurs only in the mouth. Defecation occurs only at the anus. Chemical digestion, absorption, and neutralization involve other organs. The single-entrance job is ingestion.",
        "Elimination of residue is defecation, which occurs at the anus, the exit.",
        "Protein breakdown is chemical digestion. It continues beyond the mouth and is completed in the small intestine.",
        "Fat uptake into lacteals is absorption in the small intestine.",
        "Pancreatic bicarbonate neutralizes acid in the duodenum. It is not ingestion.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="chewing-increases-surface",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Chewing increases surface area and produces a bolus of appropriate size. Saliva begins carbohydrate breakdown and lingual lipase begins some lipid breakdown.",
    forbid=["surface area", "bolus"],
    vignette=(
        "A 20-year-old man chews a bite of food before swallowing. Temperature is 36.6°C, pulse is 70/min, "
        "respirations are 14/min, and blood pressure is 118/74 mm Hg. The pieces become smaller, more area is "
        "exposed to saliva, and a lump of the right size is formed. Saliva has already started to split starch."
    ),
    stem="Which of the following is the physical result of the chewing?",
    options=[
        "Finer bits, more area uncovered, and a lump of the right size",
        "Complete absorption of the starch into the blood",
        "Removal of whatever had never been absorbed",
        "Release of stored bile from the gallbladder",
        "A long reflex that requires the medulla and an empty mouth",
    ],
    key=0,
    whys=[
        "Chewing increases surface area and forms an appropriately sized bolus. Saliva also begins carbohydrate breakdown. The physical result is the smaller pieces and the bolus, not absorption or elimination.",
        "Absorption of nutrients is mainly a small-intestinal step, after chemical breakdown.",
        "Defecation is the last step, not chewing.",
        "Bile release is a CCK effect in response to duodenal contents.",
        "A long reflex from taste can start gastric secretion. Chewing itself is the mechanical step in the mouth.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="aspirin-absorbed-in-stomach",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="The stomach absorbs some fat-soluble substances, for example alcohol and aspirin. Most absorption is still in the small intestine.",
    forbid=["aspirin", "alcohol"],
    vignette=(
        "A 46-year-old man takes a fat-soluble pain tablet on an empty stomach. Temperature is 36.6°C, pulse "
        "is 74/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. A portion of that tablet crosses "
        "the stomach lining. Most of a mixed meal's nutrients will still be absorbed farther along."
    ),
    stem="Which of the following is true of this tablet?",
    options=[
        "Some of the tablet can cross the gastric wall",
        "No absorption of any kind can occur before the colon",
        "The stomach completes chemical digestion of the tablet",
        "It must enter a lacteal before any of it reaches blood",
        "Parietal cells secrete it in response to gastrin",
    ],
    key=0,
    whys=[
        "The stomach absorbs some fat-soluble substances, including alcohol and aspirin. Most nutrients are still absorbed in the small intestine. Some of his tablet can cross the stomach lining.",
        "Absorption is not delayed until the colon. Some occurs in the stomach, and most nutrient absorption is in the small intestine.",
        "Chemical digestion is completed in the small intestine. The stomach does not finish it.",
        "Lacteals carry absorbed dietary lipids. A fat-soluble drug absorbed in the stomach is not described as requiring a lacteal.",
        "Parietal cells secrete acid and, in the stomach's other functions, intrinsic factor. They do not secrete the tablet.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="intrinsic-factor-b12",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=True,
    fact="The stomach secretes intrinsic factor, required for vitamin B12 absorption in the small intestine.",
    forbid=["intrinsic", "b12", "b 12"],
    vignette=(
        "A 58-year-old woman has had her acid-secreting stomach cells fail. Temperature is 36.6°C, pulse is "
        "80/min, respirations are 16/min, and blood pressure is 118/72 mm Hg. A factor those cells also secrete "
        "is missing. Without it, a vitamin cannot be absorbed in the small intestine. She is not yet describing "
        "nerve symptoms."
    ),
    stem="Which of the following is missing?",
    options=[
        "The gastric factor required for absorption of that vitamin",
        "Pancreatic alkali, which absorbs the vitamin by itself",
        "Fat-emulsifying salts, treated as the vitamin's only carrier",
        "Colonic bacteria, which are the only source of the factor",
        "Lingual lipase, which splits the vitamin in the mouth",
    ],
    key=0,
    whys=[
        "The stomach secretes intrinsic factor, which is required for vitamin B12 absorption in the small intestine. Loss of the gastric cells that participate in that secretion removes the factor. She cannot absorb the vitamin normally.",
        "Pancreatic bicarbonate neutralizes acid. It is not the factor required for this vitamin.",
        "Bile salts emulsify lipids. They are not described as the carrier for this vitamin.",
        "Enteric bacteria make some vitamins absorbed in the colon. They do not replace intrinsic factor.",
        "Lingual lipase begins lipid digestion in the mouth. It does not absorb this vitamin.",
    ],
)

add(
    domain="reproductive-endocrine", subject="embryology", topic="sustentacular-mullerian",
    task="mechanism", difficulty=3, src="os-27-3", nutrition=False,
    fact="Sustentacular cells in the testis secrete a signal that degrades the Mullerian duct. Without that signal the Mullerian duct develops into uterus, tubes, and part of the vagina.",
    forbid=["sustentacular", "uterus"],
    vignette=(
        "A male embryo has testes, but one supporting-cell secretion is absent. Temperature is not measured. "
        "Testosterone is present, so the male duct keeps growing. The duct that would form female internal organs "
        "is not removed."
    ),
    stem="Which of the following fails to happen?",
    options=[
        "Loss of the duct that would have formed the uterus and tubes",
        "Growth of the male duct, which still has its hormone",
        "Formation of the glans penis, which still has androgen",
        "Start of the gonads at about one month after conception",
        "Breast development as the first sign of female puberty",
    ],
    key=0,
    whys=[
        "Sustentacular-cell secretions degrade the Mullerian duct. Without them that duct persists and can form the uterus, tubes, and part of the vagina. Testosterone is present, so the Wolffian duct still grows. The missing event is removal of the female duct.",
        "The male duct still has testosterone, so its growth is not the failure.",
        "The external glans still has androgen. The vignette's failure is the internal female duct.",
        "Gonads begin about one month after conception in either path. That timing is not what failed.",
        "Breast development is a female puberty change, not this embryonic duct step.",
    ],
)

add(
    domain="reproductive-endocrine", subject="embryology", topic="sry-spermatogonia",
    task="mechanism", difficulty=3, src="os-27-3", nutrition=False,
    fact="With SRY, germ cells in the bipotential gonad become spermatogonia. Without SRY, oogonia form and primordial follicles develop.",
    forbid=["spermatogonia", "oogonia"],
    vignette=(
        "An embryo has a functional gene on the Y chromosome acting in the early gonad. Temperature is not "
        "measured. Germ cells in that gonad take the male path. The follicle-forming path is suppressed."
    ),
    stem="Which of the following do the germ cells become?",
    options=[
        "The stem cells of the male gamete line",
        "The stem cells that form follicles in an ovary",
        "Leydig cells, which are the only germ cells",
        "The lining that releases gastrin",
        "Osteocytes trapped in bone matrix",
    ],
    key=0,
    whys=[
        "SRY causes germ cells in the bipotential gonad to become spermatogonia and suppresses the female path. Without SRY, oogonia and primordial follicles form. These germ cells take the male path.",
        "Oogonia and primordial follicles are the path without SRY.",
        "Leydig cells secrete testosterone. They are not the germ cells.",
        "Gastrin comes from stomach endocrine cells, not embryonic germ cells.",
        "Osteocytes are trapped bone cells. They are not the germ-cell product of SRY.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="menarche-age-nutrition",
    task="mechanism", difficulty=2, src="os-27-3", nutrition=True,
    fact="Average age of menarche in the United States fell from about 17 years in 1860 to about 12.75 years by 1960, where it remains. Better nutrition is a major reason. Genetics, environment, and stress also affect timing.",
    forbid=["1860", "12.75", "seventeen"],
    vignette=(
        "A class compares the average age of first menstruation in the United States. Temperature is 36.6°C, "
        "pulse is 72/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. In 1860 the average was "
        "about 17 years. By 1960 it was about 12.75 years, and it remains near that. The historical change tracks "
        "more reliable nutrition."
    ),
    stem="Which of the following best accounts for the earlier average?",
    options=[
        "A steadier food supply across that century",
        "A change in the gene on the Y chromosome",
        "Earlier fusion of the sutures of the skull",
        "Loss of the fat-cell signal in well-fed girls",
        "Withholding of a known antibiotic in a research study",
    ],
    key=0,
    whys=[
        "Average menarche fell from about 17 years in 1860 to about 12.75 years by 1960 and remains there. The section ties that historical change to better, more consistent nutrition. Genetics, environment, and stress also affect an individual's timing.",
        "SRY is a Y-chromosome gene that directs the testis. It does not set the historical age of menarche.",
        "Skull sutures are open at birth so the head can deform. They do not set menarche.",
        "Leptin from fat supports earlier maturation. Loss of leptin is the lean-athlete pattern of delay, not the historical shift.",
        "Withheld penicillin is the Tuskegee ethics failure, not a cause of earlier menarche.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="male-growth-spurt-late",
    task="mechanism", difficulty=2, src="os-27-3", nutrition=False,
    fact="The male growth spurt is toward the end of puberty, about ages 11 to 13, and height can increase as much as 4 inches a year. Development can continue into the early 20s. Fertile ejaculations are typically around age 15.",
    forbid=["4 inches", "early 20s"],
    vignette=(
        "A 12-year-old boy is gaining as much as 4 inches of height a year, near the end of his pubertal sequence. "
        "Temperature is 36.6°C, pulse is 76/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. "
        "Testicular growth began earlier. Some of his peers will still be developing into the early 20s."
    ),
    stem="Which of the following is the timing of this height gain?",
    options=[
        "Toward the end of male puberty, not at the first sign",
        "At age 8, when a hormone is only detectable at night",
        "At birth, when the skull sutures are still open",
        "In the fetus, when the primary ossification center forms",
        "After every growth plate has already become a line",
    ],
    key=0,
    whys=[
        "The male growth spurt occurs toward the end of puberty, about ages 11 to 13, with gains up to about 4 inches a year. Testicular enlargement is the earlier first sign. Some development continues into the early 20s. His timing matches the late spurt.",
        "Nighttime LH around age 8 precedes physical changes by years. It is not the growth spurt.",
        "Open sutures at birth allow the head to deform. They are not this height spurt.",
        "The primary ossification center is a fetal shaft event.",
        "A sealed plate is an epiphyseal line and means length growth has stopped. He is still gaining height.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="calcified-zone-connects-shaft",
    task="mechanism", difficulty=3, src="os-6-4", nutrition=False,
    fact="Most chondrocytes in the zone of calcified matrix are dead. Capillaries and osteoblasts from the diaphysis enter, and osteoblasts lay bone on the remaining calcified cartilage. This zone connects the plate to the diaphysis. Length increases when bone is added to the diaphysis.",
    forbid=["calcified matrix", "connects"],
    vignette=(
        "A growing femur is sectioned at the plate. Temperature is not measured. In the layer next to the shaft, "
        "most cartilage cells are dead. Vessels and bone-forming cells enter from the shaft and lay bone on what "
        "remains. That layer is what ties the plate to the shaft."
    ),
    stem="Which of the following is the role of that layer?",
    options=[
        "It ties the plate to the shaft where new bone is added",
        "It anchors the plate to the end and does not add length",
        "It is the remnant line after growth has finished",
        "It forms the clavicle directly from mesenchyme",
        "It resorbs the marrow cavity to increase width",
    ],
    key=0,
    whys=[
        "The zone of calcified matrix connects the epiphyseal plate to the diaphysis. Dead chondrocytes, invading capillaries, and osteoblasts leave bone added on the shaft side, which is how the bone lengthens. This layer is that connection.",
        "Anchoring without growth is the reserve zone, nearest the epiphysis.",
        "The epiphyseal line remains after the plate closes. This plate is still active.",
        "The clavicle forms by intramembranous ossification, not by this plate layer.",
        "Widening by marrow resorption and periosteal deposition is appositional growth.",
    ],
)

add(
    domain="msk-skin", subject="histology", topic="bone-same-either-path",
    task="histology", difficulty=2, src="os-6-4", nutrition=False,
    fact="Bone produced by intramembranous ossification and bone produced by endochondral ossification is the same tissue.",
    forbid=["same tissue", "either path"],
    vignette=(
        "A student compares a clavicle with a femur. Temperature is 36.6°C, pulse is 70/min, respirations are "
        "14/min, and blood pressure is 118/72 mm Hg. One bone formed from a membrane and the other replaced a "
        "cartilage model. Under the microscope the mineralized tissue looks like the same kind of bone."
    ),
    stem="Which of the following is true of the finished tissue?",
    options=[
        "The completed hard material is the same kind either way",
        "Bone made from membrane never contains mature bone cells",
        "Cartilage-model bone remains cartilage in the adult shaft",
        "Only the clavicle can be remodeled in adult life",
        "Only the thigh bone has collagen in its matrix",
    ],
    key=0,
    whys=[
        "The two osteogenic pathways produce the same bone. A clavicle from mesenchyme and a femur from a cartilage model are the same tissue once formed.",
        "Osteoblasts trapped in osteoid become osteocytes in intramembranous bone as well.",
        "The cartilage model is replaced. The adult shaft is bone, with cartilage left at the joint and, while growing, at the plate.",
        "Adult remodeling occurs in the skeleton generally, about 5 to 10 percent a year, not only in the clavicle.",
        "Collagen is a critical matrix protein in bone generally. It is not limited to the femur.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="stimulus-strength-graded",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="The size of the graded potential at a sensory receptor depends on stimulus strength. A stronger stimulus makes a larger local voltage change.",
    forbid=["stronger", "larger"],
    vignette=(
        "A 19-year-old woman compares warm water with hotter water on her hand. Pulse is 78/min, respirations "
        "are 16/min, and blood pressure is 112/70 mm Hg. The local voltage change in the skin sensor is bigger "
        "with the hotter water. A traveling signal still starts only if the change is large enough."
    ),
    stem="Which of the following does the hotter water produce?",
    options=[
        "A larger local voltage change in the skin receptor",
        "A smaller local change than the warm water",
        "Acetylcholine release as the first event in the skin",
        "An immediate muscle potential with no sensory step",
        "A steroid crossing into the receptor cell",
    ],
    key=0,
    whys=[
        "Graded-potential size depends on stimulus strength. Hotter water produces a larger local voltage change than warm water. An action potential still requires threshold.",
        "A weaker stimulus makes a smaller graded potential. The hotter water is the stronger stimulus.",
        "Acetylcholine is released at the neuromuscular junction, not as the first event in the skin sensor.",
        "Muscle contraction is the response after a motor command. Sensation starts in the receptor.",
        "Steroid hormones diffuse into target cells. This voltage change is a sensory graded potential.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="response-is-muscle",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="The response in the example is muscle contraction after the lower motor neuron releases acetylcholine.",
    forbid=["response"],
    vignette=(
        "A 25-year-old man pulls his hand from hot water. Temperature is 36.6°C, pulse is 90/min, respirations "
        "are 18/min, and blood pressure is 124/76 mm Hg. Skin sensors have fired, the outer gray matter has "
        "combined that information, and a command has reached the muscle. The muscle then shortens."
    ),
    stem="Which of the following is the final event in this example?",
    options=[
        "The fiber tightens after the nerve chemical arrives",
        "The skin receptor is what detects the water",
        "The deep relay passes the signal toward awareness",
        "Cortical areas combine the sensation with memory",
        "A graded potential stays below the level that fires the axon",
    ],
    key=0,
    whys=[
        "The sequence ends with the response: the lower motor neuron releases acetylcholine, a muscle action potential follows, and the fiber contracts. He pulls his hand back, so the final event is the shortening muscle.",
        "Detection is sensation, the first step.",
        "The thalamic relay is before conscious perception, still on the sensory side.",
        "Combining sensation with memory is integration, before the motor command.",
        "A subthreshold graded potential would not start the path that moved his hand.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="pharynx-propels-to-esophagus",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="The pharynx propels food from the oral cavity to the esophagus and lubricates food and passageways. The esophagus propels food to the stomach.",
    forbid=["pharynx", "esophagus"],
    vignette=(
        "A 32-year-old woman swallows. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and "
        "blood pressure is 116/72 mm Hg. After the mouth, a short shared passage carries the bolus onward and "
        "lubricates it. The next tube then carries it to the stomach. Neither organ is the main site of absorption."
    ),
    stem="Which of the following is the job of the short shared passage?",
    options=[
        "It moves the bolus onward and moistens the path",
        "It finishes chemical digestion of proteins",
        "It absorbs most dietary fat into lymph vessels",
        "It secretes the factor required for vitamin B12",
        "It stores bile and makes it more concentrated",
    ],
    key=0,
    whys=[
        "The pharynx propels food from the mouth to the esophagus and lubricates food and passageways. The esophagus then propels it to the stomach. Neither is the main site of absorption.",
        "Chemical digestion of food is completed in the small intestine.",
        "Most fat absorption into lacteals occurs in the small intestine.",
        "Intrinsic factor is a gastric secretion.",
        "The gallbladder stores and concentrates bile.",
    ],
)

add(
    domain="reproductive-endocrine", subject="physiology", topic="chromosomal-intersex",
    task="mechanism", difficulty=3, src="os-27-3", nutrition=False,
    fact="XX is typically female and XY typically male. Nondisjunction can produce XXY, XYY, and XO, called chromosomal intersex. Female development is the path without a functional SRY gene.",
    forbid=["xxy", "nondisjunction"],
    vignette=(
        "A newborn has a sex-chromosome pattern that is not XX or XY. Temperature is 36.8°C, pulse is 138/min, "
        "respirations are 40/min. The extra or missing chromosome came from a failure of chromosomes to separate "
        "in meiosis. The clinical name for this group of patterns includes XXY, XYY, and XO."
    ),
    stem="Which of the following produced this chromosome pattern?",
    options=[
        "Chromosomes failing to pull apart in gamete formation",
        "A single gene on the Y acting exactly as usual",
        "Closure of the growth plate in fetal week six",
        "An institutional review board decision",
        "Positive feedback of oxytocin during labor",
    ],
    key=0,
    whys=[
        "Nondisjunction during meiosis can produce XXY, XYY, and XO, which the section calls chromosomal intersex. The newborn's pattern came from that failure of chromosomes to separate. Typical XX and XY determination is a separate statement.",
        "Ordinary SRY action on a Y chromosome directs the testis path. It does not create an XXY, XYY, or XO pattern.",
        "Ossification begins around week six or seven. It does not change sex chromosomes.",
        "An IRB reviews human research. It does not cause a chromosome pattern.",
        "Oxytocin feedback drives labor contractions. It does not set sex chromosomes.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="secretions-contain-enzymes-acids",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Digestive secretions typically contain water, enzymes, acids, and salts. They break complex molecules into building blocks. The process is completed in the small intestine.",
    forbid=["salts", "building blocks"],
    vignette=(
        "A 27-year-old man studies the juices in the gut. Temperature is 36.6°C, pulse is 70/min, respirations "
        "are 14/min, and blood pressure is 120/74 mm Hg. The juices are mostly water plus enzymes, acids, and "
        "salts. They split large food molecules into smaller chemical pieces. That chemical work finishes in the "
        "small intestine."
    ),
    stem="Which of the following is in a typical digestive juice besides water?",
    options=[
        "Enzymes, acids, and dissolved minerals",
        "Only the salts that emulsify fat, and no enzymes",
        "Only collagen, chondroitin, and hyaluronic acid",
        "Lung lining fluid, with no digestive enzymes",
        "The transmitter released at the nerve-muscle junction",
    ],
    key=0,
    whys=[
        "Digestive secretions typically contain water, enzymes, acids, and salts. They break complex food molecules into chemical building blocks, and that process is completed in the small intestine.",
        "Bile salts emulsify fat, but a typical digestive secretion is not bile salts alone. Enzymes, acids, and dissolved minerals are the listed contents.",
        "Hyaluronic acid, chondroitin sulfate, and collagen are the cartilage-model matrix, not digestive juice.",
        "Surfactant is secreted by type II alveolar cells.",
        "Acetylcholine is the neuromuscular transmitter, not a digestive juice.",
    ],
)

# Next 20 items: colon anatomy and nutrition.

add(
    domain="gastrointestinal", subject="anatomy", topic="teniae-coli-haustra",
    task="anatomy", difficulty=2, src="os-23-5", nutrition=False,
    fact="Teniae coli are three longitudinal muscle bands. Their tone pulls the colon into haustra. Epiploic appendages are fat-filled peritoneal sacs on the teniae.",
    forbid=["tenia", "teniae", "haustra"],
    vignette=(
        "A 58-year-old man who repairs docks has a 12-cm segment of colon removed for a 2-cm polyp. Temperature "
        "is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 130/78 mm Hg. The outer "
        "longitudinal muscle is gathered into three narrow bands, and tonic shortening of those bands pouches "
        "the wall. Small fat-filled tags of peritoneum hang from the bands. The rectal margin of the specimen "
        "has a complete longitudinal muscle coat and no pouches."
    ),
    stem="Which of the following produces the pouches along this colonic segment?",
    options=[
        "Tone in three longitudinal bands bunching the wall",
        "An inner oblique layer that is present only in the stomach",
        "Permanent circular ridges that spiral chyme in the jejunum",
        "A third muscle layer that churns food with acid",
        "Water absorption that concentrates fluid tenfold",
    ],
    key=0,
    whys=[
        "The three teniae coli are the longitudinal muscle of the colon. Their tone creates haustra. The specimen has three bands, pouches, and fat tags on the bands. The rectum lacks teniae and haustra, matching the rectal margin.",
        "The oblique layer is gastric. This specimen is colon, and the bands are longitudinal.",
        "Circular folds are small-intestinal ridges. They are not three outer muscle bands.",
        "Gastric oblique muscle churns food. It does not pouch the colon.",
        "The gallbladder concentrates bile. Colonic pouches are muscular, not a concentration effect.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="anal-sphincters-control",
    task="anatomy", difficulty=2, src="os-23-5", nutrition=False,
    fact="The internal anal sphincter is smooth muscle and involuntary. The external anal sphincter is skeletal muscle and voluntary. Both stay closed except during defecation.",
    forbid=["sphincter"],
    vignette=(
        "A 70-year-old man who keeps a hardware store cannot delay stool once it reaches the last 4 cm of the "
        "canal, but he can still squeeze and hold if he concentrates. Temperature is 36.7°C, pulse is 76/min, "
        "respirations are 14/min, and blood pressure is 140/82 mm Hg. Examination shows the inner ring of the "
        "canal opening without his effort, while the outer ring remains under his control."
    ),
    stem="Which of the following muscle types form these two rings?",
    options=[
        "Inner smooth muscle he cannot control, outer skeletal muscle he can",
        "Inner skeletal muscle he can control, outer smooth muscle he cannot",
        "Two skeletal rings, and both are under voluntary control",
        "Two smooth rings, and neither is under voluntary control",
        "An inner cardiac-muscle ring plus an outer smooth-muscle ring",
    ],
    key=0,
    whys=[
        "The internal anal sphincter is involuntary smooth muscle, and the external anal sphincter is voluntary skeletal muscle. His inner ring opens without effort and his outer ring still obeys him, over the last few centimeters of the canal.",
        "That pairing reverses the two muscles. The inner ring is the one he cannot control.",
        "Only the outer ring is skeletal. The inner ring opened without his effort.",
        "The outer ring is still under his control, so it is not smooth muscle.",
        "Cardiac muscle is limited to the heart. Neither anal ring is cardiac muscle.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="pectinate-line-sensation",
    task="anatomy", difficulty=4, src="os-23-5", nutrition=False,
    fact="The pectinate line is the hindgut-skin junction. Mucosa above it is supplied by visceral sensory fibers and is relatively insensitive. Mucosa below it is supplied by somatic sensory fibers and is sensitive.",
    forbid=["pectinate", "dentate"],
    vignette=(
        "A 46-year-old woman who grooms horses has a 6-mm lesion in the anal canal. Temperature is 36.6°C, "
        "pulse is 78/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. A jagged line circles "
        "the canal just below the anal sinuses. Touch above that line is poorly felt. The same touch below the "
        "line is sharply painful. The lesion itself sits above the line."
    ),
    stem="Which of the following best explains the difference in pain across the line?",
    options=[
        "Visceral fibers supply the upper side and somatic fibers the lower side",
        "Somatic fibers supply the upper side and visceral fibers the lower side",
        "Both sides use the same visceral fibers, so pain should match",
        "Both sides use skeletal motor fibers, so pain should match",
        "The upper side is peritoneum and the lower side is colonic serosa",
    ],
    key=0,
    whys=[
        "The pectinate line divides hindgut mucosa above, innervated by visceral sensory fibers and relatively insensitive, from skin-side mucosa below, innervated by somatic sensory fibers and very sensitive. Touch above her line is dull and touch below is sharp, and the lesion is above the line.",
        "That assignment reverses the fibers. The poorly felt side is the upper side.",
        "The two sides feel different, so they do not share one sensory supply.",
        "Skeletal motor fibers move the external sphincter. They are not the sensory explanation for this line.",
        "The anal canal is in the perineum, outside the abdominopelvic cavity. The line is not a peritoneal boundary.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="colon-flora-vitamin-k",
    task="mechanism", difficulty=2, src="os-23-5", nutrition=True,
    fact="Colonic bacteria synthesize biotin, pantothenic acid, and vitamin K. Enterocytes of the large intestine absorb vitamins those bacteria produce.",
    forbid=["biotin"],
    vignette=(
        "A 64-year-old woman who binds sheet music received a 10-day antibiotic course and then noted easy "
        "bruising. Temperature is 36.8°C, pulse is 80/min, respirations are 14/min, and blood pressure is "
        "126/72 mm Hg. She eats green vegetables daily. A stool culture shows marked loss of the usual colonic "
        "organisms. Platelet count is 240,000/µL. A vitamin measured in blood, one normally made by those "
        "organisms, is low."
    ),
    stem="Which of the following vitamins depends on those colonic organisms?",
    options=[
        "The vitamin used for clotting-factor formation",
        "The vitamin synthesized in sun-exposed skin",
        "The vitamin stored only in muscle as glycogen",
        "The vitamin that parietal cells secrete into the lumen",
        "The vitamin absorbed only after gastric emulsification",
    ],
    key=0,
    whys=[
        "Colonic flora synthesize vitamin K, biotin, and pantothenic acid, and colonic enterocytes absorb those vitamins. Her flora are depleted after antibiotics, she bruises despite eating greens, and platelets are normal, so the missing bacterial vitamin is the one used in clotting.",
        "Vitamin D is synthesized in skin exposed to sunlight. Colonic bacteria are not its source.",
        "Glycogen is a carbohydrate store, not a vitamin, and it is not made by colonic bacteria.",
        "Parietal cells secrete intrinsic factor, a glycoprotein, not a vitamin. Vitamin B12 comes from animal foods.",
        "Fat-soluble vitamins are absorbed with lipids after bile salts emulsify fat. Emulsification is not gastric, and the low vitamin here tracks loss of colonic organisms.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="gastrocolic-mass-movement",
    task="mechanism", difficulty=3, src="os-23-5", nutrition=False,
    fact="Mass movements are strong colonic waves, usually three or four times a day during or just after meals. The gastrocolic reflex, provoked by gastric distention and by digestion in the small intestine, increases them.",
    forbid=["gastrocolic"],
    vignette=(
        "A 29-year-old man who loads moving vans feels a strong urge to pass stool within 15 minutes after he "
        "starts a large lunch. Temperature is 36.7°C, pulse is 74/min, respirations are 14/min, and blood "
        "pressure is 122/76 mm Hg. Recordings show a powerful wave beginning in the mid-transverse colon and "
        "pushing contents toward the rectum. The same wave is absent on a morning when he skips breakfast."
    ),
    stem="Which of the following initiates this wave?",
    options=[
        "A meal-related reflex that increases strong colonic contractions",
        "Back-and-forth small-bowel mixing that does not propel contents",
        "A pre-meal fundic hormone acting on the hypothalamus",
        "Voluntary skeletal contraction of the internal anal ring",
        "Acid inactivation of salivary starch digestion in the fundus",
    ],
    key=0,
    whys=[
        "Mass movements are strong waves that start about midway in the transverse colon and move contents toward the rectum, usually during or just after meals. The gastrocolic reflex is driven by gastric distention and small-bowel digestion. His wave matches that timing and is absent when he skips the meal.",
        "Segmentation mixes small-bowel contents and does not propel them. This wave is a powerful colonic push.",
        "Ghrelin rises before meals and stimulates hunger. It does not start a transverse-colon wave after lunch begins.",
        "The internal anal sphincter is involuntary smooth muscle. It is not the colonic wave.",
        "Acid turns off salivary amylase in the stomach. That does not move the colon.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="small-bowel-absorbs-most-water",
    task="mechanism", difficulty=3, src="os-23-5", nutrition=False,
    fact="The small intestine absorbs about 90 percent of ingested water. The large intestine absorbs most of the remainder. Of about 500 mL entering the cecum daily, about 150 mL remains as feces.",
    forbid=["percent"],
    vignette=(
        "A 54-year-old woman who restores furniture has had the colon removed and a pouch made from small intestine. "
        "Temperature is 36.8°C, pulse is 82/min, respirations are 16/min, and blood pressure is 116/70 mm Hg. "
        "She stays well hydrated on an ordinary diet. Before the operation, studies showed that nine-tenths of "
        "the water she drank left the lumen before intestinal contents reached the cecum."
    ),
    stem="Which of the following best explains why she remains hydrated without a colon?",
    options=[
        "Most ingested water was already absorbed before the cecum",
        "The stomach absorbs nearly all ingested water with meals",
        "The gallbladder reabsorbs the water secreted in bile",
        "Colonic bacteria must be present or water cannot be absorbed",
        "The esophagus absorbs water across its stratified lining",
    ],
    key=0,
    whys=[
        "The small intestine absorbs about 90 percent of ingested water, and the colon absorbs most of what remains. Her preoperative study showed nine-tenths absorbed before the cecum, so removing the colon leaves the main water-absorbing organ in place.",
        "Little nutrient absorption, and not the bulk of water absorption, occurs in the stomach. The study placed the absorption before the cecum, which is the small bowel.",
        "The gallbladder concentrates bile by absorbing some water from bile. It does not recover ingested drinking water.",
        "She remains hydrated after the colon, and its bacteria, were removed. The small bowel did the bulk of the absorption.",
        "The esophagus conducts food. It is not the site that absorbed nine-tenths of her water.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="vitamin-a-night-blindness",
    task="mechanism", difficulty=2, src="os-24-7", nutrition=True,
    fact="Vitamin A supports eye and bone development and immune function. Deficiency causes night blindness and epithelial changes. It is fat-soluble and absorbed with lipids in chylomicrons. The body can make it from beta-carotene.",
    forbid=["retinol", "carotene"],
    vignette=(
        "A 17-year-old boy who buses tables has trouble seeing when he walks home after dark. Temperature is "
        "36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. He avoids "
        "vegetables, eggs, milk, and liver. Daytime vision is intact, stools are not greasy, and a skin check "
        "shows dry rough patches on both forearms."
    ),
    stem="Which of the following deficient vitamin best fits the night vision and the skin?",
    options=[
        "A fat-soluble vitamin used for eye and epithelial health",
        "A water-soluble vitamin used to make collagen",
        "A water-soluble vitamin used to synthesize NAD",
        "A fat-soluble vitamin used for clotting-factor synthesis",
        "A water-soluble vitamin used as a cofactor in carboxylation",
    ],
    key=0,
    whys=[
        "Vitamin A is fat-soluble, supports eye development and epithelial health, and its deficiency causes night blindness and epithelial changes. He cannot see well in the dark, has rough dry skin, and avoids the foods that supply it, without greasy stools.",
        "Vitamin C is water-soluble and is required for collagen. Deficiency causes bleeding gums and poor wound healing, not night blindness.",
        "Niacin is used to make NAD. Deficiency causes the dermatitis-diarrhea-dementia picture, not isolated night blindness.",
        "Vitamin K is used for clotting. Deficiency causes bleeding, not night blindness.",
        "Biotin is a water-soluble cofactor in carboxylation reactions. Deficiency is rare and is not night blindness. The option names a cofactor role that is not this patient's finding.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="vitamin-d-rickets",
    task="mechanism", difficulty=2, src="os-24-7", nutrition=True,
    fact="Vitamin D aids calcium absorption and bone growth. Deficiency causes rickets, bone pain, and muscle weakness. It is obtained from diet and synthesized in sun-exposed skin. It is fat-soluble.",
    forbid=["cholecalciferol"],
    vignette=(
        "A 3-year-old girl who lives in a basement apartment has bowed legs and wrist swelling. Temperature is "
        "36.7°C, pulse is 100/min, respirations are 22/min, and blood pressure is 90/56 mm Hg. She is rarely "
        "taken outside, drinks little milk, and has bone pain when she walks. Stools are formed and not greasy. "
        "Serum calcium is low."
    ),
    stem="Which of the following missing actions best explains the bone findings?",
    options=[
        "Aid of calcium absorption needed for bone growth",
        "Cross-linking of collagen required for capillary strength",
        "Synthesis of clotting factors in hepatocytes",
        "A cofactor used for DNA and protein synthesis",
        "Oxidation of fatty acids inside nerve membranes",
    ],
    key=0,
    whys=[
        "Vitamin D promotes calcium absorption and bone growth. Deficiency produces rickets, bone pain, and muscle weakness. She has bowed legs, wrist swelling, bone pain, low calcium, little sun, and little milk, with formed stools.",
        "Vitamin C is required for collagen. Deficiency causes bleeding gums and poor healing, not bowed legs with low calcium.",
        "Vitamin K supports clotting factors. Deficiency causes bleeding, not rickets.",
        "Folate is required for DNA and protein synthesis. This child has bowed bones and low calcium, not a failure of DNA synthesis.",
        "Vitamin B12 supports fatty-acid oxidation and nerve function. This child has bone deformity and low calcium, not a nerve finding.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="vitamin-k-bleeding",
    task="mechanism", difficulty=2, src="os-24-7", nutrition=True,
    fact="Vitamin K, a fat-soluble vitamin from leafy vegetables, is used for blood clotting and bone health. Deficiency causes bleeding and is uncommon in adults; newborns can develop hemorrhagic disease.",
    forbid=["phylloquinone"],
    vignette=(
        "A 4-day-old boy born at home has oozing from the umbilical stump and a bruise over the scalp. "
        "Temperature is 36.9°C, pulse is 150/min, respirations are 40/min, and blood pressure is 70/40 mm Hg. "
        "He has not received an injection of any vitamin. His mother eats a mixed diet. Platelet count is "
        "280,000/µL, and the stool is not pale."
    ),
    stem="Which of the following deficient vitamin best accounts for the bleeding?",
    options=[
        "A fat-soluble vitamin required to build clotting factors",
        "A water-soluble vitamin required to build collagen",
        "A fat-soluble vitamin required for vision in dim light",
        "A water-soluble vitamin required to make NAD",
        "A water-soluble vitamin required for thymidine synthesis",
    ],
    key=0,
    whys=[
        "Vitamin K is required for clotting. Deficiency is a cause of hemorrhagic disease in newborns and is uncommon in adults who eat a mixed diet. This 4-day-old boy is bleeding, platelets are normal, and he has not received the vitamin.",
        "Vitamin C is required for collagen. Scurvy is not the bleeding pattern of an untreated newborn with normal platelets.",
        "Vitamin A deficiency causes night blindness and epithelial change, not umbilical oozing.",
        "Niacin deficiency causes pellagra. It does not produce this neonatal bleeding.",
        "Folate is required for DNA synthesis, including thymidine. Deficiency impairs cell division rather than causing this clotting-factor pattern.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="niacin-pellagra",
    task="mechanism", difficulty=2, src="os-24-7", nutrition=True,
    fact="Niacin is used to synthesize NAD and supports nerve function. Deficiency causes cracked scaly skin, dementia, and diarrhea, called pellagra.",
    forbid=["niacin", "pellagra", "nad"],
    vignette=(
        "A 59-year-old man who lives alone eats mostly corn grits. Temperature is 36.8°C, pulse is 84/min, "
        "respirations are 16/min, and blood pressure is 128/74 mm Hg. He has a scaly rash on both forearms where "
        "the sun hits, three loose stools a day, and he no longer recognizes his sister. Hemoglobin is 13 g/dL. "
        "There is no night blindness."
    ),
    stem="Which of the following missing cofactor roles best fits all three problems?",
    options=[
        "Synthesis of NAD, with failure of skin, gut, and cognition",
        "Synthesis of collagen, with failure of wound strength",
        "Synthesis of clotting factors, with failure of hemostasis",
        "Absorption of calcium, with failure of bone mineralization",
        "Oxidation of odd-chain fatty acids inside myelin",
    ],
    key=0,
    whys=[
        "Niacin is required for NAD. Deficiency produces cracked scaly skin, diarrhea, and dementia together. He has the sun-exposed rash, loose stools, and failure to recognize his sister, without anemia or night blindness.",
        "Vitamin C is required for collagen. Deficiency causes bleeding gums and poor healing, not this three-part picture.",
        "Vitamin K is required for clotting factors. He is not described as bleeding.",
        "Vitamin D is required for calcium absorption and bone. He has no bone finding.",
        "Vitamin B12 supports fatty-acid oxidation and nerves, and its deficiency causes large red cells. His hemoglobin is 13 g/dL, and the rash plus diarrhea are not the B12 picture.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="thiamine-beriberi",
    task="mechanism", difficulty=2, src="os-24-7", nutrition=True,
    fact="Thiamine is a cofactor in carbohydrate metabolism. Deficiency causes beriberi and Wernicke-Korsakoff syndrome.",
    forbid=["thiamine", "beriberi", "wernicke"],
    vignette=(
        "A 52-year-old man who unloads freight has eaten polished rice and little else for 4 months. Temperature "
        "is 36.7°C, pulse is 96/min, respirations are 18/min, and blood pressure is 108/70 mm Hg. His legs are "
        "weak, the ankle reflexes are absent, and he is short of breath when he walks across the room. Memory "
        "for the morning's events is poor. Glucose in a random sample is 96 mg/dL."
    ),
    stem="Which of the following pathways loses its cofactor in this deficiency?",
    options=[
        "Carbohydrate metabolism, with the nerve picture of beriberi",
        "Collagen cross-linking, with bleeding from the gums",
        "Clotting-factor gamma-carboxylation in the liver",
        "NAD synthesis, with rash, diarrhea, and confusion together",
        "Calcium absorption from the lumen of the small intestine",
    ],
    key=0,
    whys=[
        "Thiamine is required for carbohydrate metabolism. Deficiency produces beriberi and the Wernicke-Korsakoff picture. He has leg weakness, lost reflexes, breathlessness on walking, and poor memory on a polished-rice diet, with a normal random glucose.",
        "Vitamin C deficiency impairs collagen and causes gum bleeding and poor healing. Those are not his findings.",
        "Vitamin K deficiency impairs clotting. He is not bleeding.",
        "Niacin deficiency causes pellagra, the rash-diarrhea-dementia triad. He has no scaly sun rash or diarrhea.",
        "Vitamin D deficiency impairs calcium absorption and bone. He has nerve and exertional findings, not bone pain or bowed bones.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="folate-dna-synthesis",
    task="mechanism", difficulty=3, src="os-24-7", nutrition=True,
    fact="Folate is required for DNA and protein synthesis. Deficiency causes poor growth and gastrointestinal problems, among other findings. It is water-soluble.",
    forbid=["folate", "folic"],
    vignette=(
        "A 28-year-old woman who is 10 weeks pregnant has eaten almost no greens or beans because of nausea. "
        "Temperature is 36.6°C, pulse is 88/min, respirations are 16/min, and blood pressure is 104/64 mm Hg. "
        "Hemoglobin is 9.1 g/dL with large red cells. A smear shows no hypersegmented-neutrophil count reported, "
        "and she has no numbness. She asked which dietary factor is required for making DNA."
    ),
    stem="Which of the following is the role of the vitamin missing from her diet?",
    options=[
        "A cofactor required for synthesis of DNA and protein",
        "Carboxylation of clotting factors in hepatocytes",
        "Absorption of calcium from the intestinal lumen",
        "Cross-linking of collagen in capillary walls",
        "Emulsification of dietary triglyceride in the duodenum",
    ],
    key=0,
    whys=[
        "Folate is required for DNA and protein synthesis and is found in greens, beans, and enriched grains. She has avoided those foods, is early in pregnancy, and has large red cells without numbness. The question she asked is the DNA-synthesis role.",
        "Vitamin K is used to carboxylate clotting factors. She is not bleeding, and that vitamin is not the one tied to DNA synthesis.",
        "Vitamin D promotes calcium absorption. Her finding is large red cells, not bone disease.",
        "Vitamin C is required for collagen cross-linking. She has no scurvy findings.",
        "Bile salts emulsify triglyceride. They are not a vitamin required for DNA.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="b12-needs-intrinsic-factor",
    task="mechanism", difficulty=3, src="os-24-7", nutrition=True,
    fact="Vitamin B12 supports red-cell production and nerve-cell function. Deficiency causes pernicious anemia and nerve damage. Section 23.4 states that intestinal absorption of B12 requires intrinsic factor.",
    forbid=["cobalamin", "pernicious"],
    vignette=(
        "A 71-year-old woman who keeps archives has numbness in both feet and a hemoglobin of 8.8 g/dL with large "
        "red cells. Temperature is 36.5°C, pulse is 90/min, respirations are 16/min, and blood pressure is "
        "132/74 mm Hg. She eats meat and eggs daily. Antibodies have destroyed the gastric cells that make the "
        "glycoprotein required for absorption of this vitamin. A separate vitamin used for DNA synthesis is normal."
    ),
    stem="Which of the following absorption failure explains the nerves and the red cells?",
    options=[
        "Loss of the stomach product required to absorb this vitamin",
        "Lack of sunlight blocking synthesis of this vitamin in skin",
        "Absence of colonic bacteria that normally synthesize this vitamin",
        "Failure of bile salts to emulsify this water-soluble vitamin",
        "Block of duodenal duct cells that secrete this vitamin",
    ],
    key=0,
    whys=[
        "Vitamin B12 is required for red-cell production and nerve function, and deficiency damages nerves and causes pernicious anemia. Absorption requires intrinsic factor from gastric parietal cells. She eats animal foods, has numb feet and large red cells, and antibodies have removed the cells that make that glycoprotein. The DNA-synthesis vitamin, folate, is normal.",
        "Vitamin D is synthesized in sun-exposed skin. B12 is not.",
        "Colonic bacteria synthesize vitamin K, biotin, and pantothenic acid, not the vitamin whose loss causes this nerve and red-cell picture in the presence of a normal diet.",
        "Bile salts emulsify fats and aid absorption of fat-soluble vitamins. B12 is water-soluble and depends on intrinsic factor.",
        "Pancreatic duct cells secrete bicarbonate. They do not secrete this vitamin.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="vitamin-c-collagen",
    task="mechanism", difficulty=2, src="os-24-7", nutrition=True,
    fact="Vitamin C is required to produce collagen for connective tissue, teeth, and wound healing. Deficiency causes bleeding gums, poor healing, easy bruising, and scurvy. It is water-soluble.",
    forbid=["ascorbate", "scurvy"],
    vignette=(
        "A 44-year-old man who crews a fishing boat has eaten no fruit or vegetables for 5 months. Temperature "
        "is 36.8°C, pulse is 78/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. His gums bleed "
        "when he brushes, a 1-cm cut on his hand from 3 weeks ago is still open, and he bruises after light bumps. "
        "Night vision is normal, and the stool is brown."
    ),
    stem="Which of the following missing synthetic role best fits these findings?",
    options=[
        "Production of collagen for connective tissue and wound repair",
        "Production of NAD for redox reactions in many cells",
        "Production of clotting factors that need gamma-carboxylation",
        "Production of rhodopsin for vision in dim light",
        "Production of the brown pigment of stool by gut bacteria",
    ],
    key=0,
    whys=[
        "Vitamin C is required for collagen in connective tissue and for wound healing. Deficiency causes bleeding gums, slow healing, easy bruising, and scurvy. He has all three tissue findings after months without fruit or vegetables, with normal night vision and brown stool.",
        "Niacin is required for NAD. Deficiency adds diarrhea and dementia to a rash. He does not have that picture.",
        "Vitamin K is required for clotting-factor carboxylation. His stool is brown, so bile pigment is reaching the gut, and the findings are gum bleeding plus a wound that will not heal, the collagen pattern.",
        "Vitamin A is required for dim-light vision. His night vision is normal.",
        "Bacteria convert bilirubin to stercobilin. His stool is already brown, so that step is occurring.",
    ],
)

add(
    domain="gastrointestinal", subject="nutrition", topic="fat-soluble-stored",
    task="mechanism", difficulty=3, src="os-24-7", nutrition=True,
    fact="Vitamins A, D, E, and K are absorbed with lipids in chylomicrons and can accumulate in body fat, so excess can cause hypervitaminosis. B vitamins and vitamin C are excreted in urine and are not stored, so excess is rarely toxic except from supplements.",
    forbid=["chylomicron"],
    vignette=(
        "A 36-year-old woman who coaches diving has taken 20 times the usual dose of a fat-soluble vitamin "
        "capsule every day for 8 months. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, and "
        "blood pressure is 110/68 mm Hg. The vitamin is absorbed only when dietary fat is absorbed. A different "
        "capsule, a water-soluble vitamin she also overuses, is largely recovered in a 24-hour urine collection."
    ),
    stem="Which of the following best explains the different fates of the two vitamins?",
    options=[
        "The fat-soluble vitamin can accumulate in body fat",
        "The water-soluble vitamin is stored in body fat for months",
        "Both leave only in bile and neither can accumulate",
        "Both need a gastric cofactor and neither appears in urine",
        "The fat-soluble vitamin is made only by colonic bacteria",
    ],
    key=0,
    whys=[
        "Fat-soluble vitamins A, D, E, and K are absorbed with lipids and can accumulate in fat stores, so excess can cause hypervitaminosis. Water-soluble B vitamins and vitamin C are excreted in urine and are not stored. Her fat-soluble capsule depends on fat absorption, and the water-soluble one appears in the 24-hour urine.",
        "Water-soluble vitamins are not stored in fat. They move into body water and excess leaves in urine.",
        "The urine collection recovered the water-soluble vitamin, so it is not true that neither can leave in urine or that both leave only in bile.",
        "Intrinsic factor is required for vitamin B12, not for every vitamin. The water-soluble vitamin was recovered in urine.",
        "Colonic bacteria synthesize vitamin K, biotin, and pantothenic acid. A capsule absorbed with dietary fat is not defined as a bacterial product.",
    ],
)

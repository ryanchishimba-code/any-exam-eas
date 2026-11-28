# Batch 1, items 11–30.

add(
    domain="gastrointestinal", subject="physiology", topic="parietal-cell-products",
    task="mechanism", difficulty=2, src="os-23-4", nutrition=False,
    fact="Parietal cells, located mainly in the middle of the gastric glands of the fundus and body, produce both hydrochloric acid and intrinsic factor.",
    forbid=["parietal"],
    vignette=(
        "A 58-year-old man who grinds coffee beans reports burning epigastric pain for 5 weeks. Temperature is "
        "36.8°C, pulse is 82/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. A gastric biopsy "
        "from the body of the stomach shows large cells in the middle region of the glands. Special stains mark "
        "those cells as the source of both the acid in the lumen and a glycoprotein needed for vitamin B12 absorption."
    ),
    stem="Which of the following pairs of products comes from these cells?",
    options=[
        "Hydrochloric acid and intrinsic factor",
        "Pepsinogen and a small amount of gastric lipase",
        "Gastrin and the hormone that stimulates hunger",
        "Alkaline surface mucus and bicarbonate only",
        "Secretin and cholecystokinin together",
    ],
    key=0,
    whys=[
        "The large cells in the middle of the fundic and body glands that make hydrochloric acid and intrinsic factor are parietal cells. The biopsy marks both products in those cells, and intrinsic factor is required for vitamin B12 absorption.",
        "Pepsinogen is secreted by chief cells, which sit mainly in the basal region of the glands, not in the middle region marked here.",
        "Gastrin comes mainly from G cells in the pyloric antrum. The hunger hormone ghrelin comes mainly from the fundus mucosa, not from these acid-producing cells.",
        "Alkaline mucus is the surface epithelial barrier. These cells are mid-gland cells that also make the B12-related glycoprotein.",
        "Secretin and cholecystokinin are released by cells of the small intestine, not by the mid-gland gastric cells in this biopsy.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="chief-cell-pepsinogen",
    task="mechanism", difficulty=2, src="os-23-4", nutrition=False,
    fact="Chief cells, mainly in the basal gastric glands, secrete pepsinogen. Hydrochloric acid converts pepsinogen to pepsin.",
    forbid=["chief", "pepsinogen"],
    vignette=(
        "A 41-year-old woman who tunes pianos has had epigastric discomfort for 8 weeks. Temperature is 36.6°C, "
        "pulse is 70/min, respirations are 14/min, and blood pressure is 114/72 mm Hg. A biopsy of the gastric "
        "body shows cells clustered at the base of the glands. They contain granules of an inactive protein-digesting "
        "proenzyme. The lumen pH of a sample taken the same morning is 2.0."
    ),
    stem="Which of the following converts this stored proenzyme into its active form?",
    options=[
        "Hydrochloric acid already present in the lumen",
        "Bile salts delivered from the gallbladder",
        "Enteropeptidase on the duodenal brush border",
        "The alkaline mucus made by surface cells",
        "Salivary amylase that remains active at this pH",
    ],
    key=0,
    whys=[
        "Chief cells at the base of gastric glands store pepsinogen. Hydrochloric acid converts it to pepsin. The lumen pH is 2.0, which is inside the acid range of gastric contents.",
        "Bile salts emulsify lipids in the small intestine. They do not activate the gastric proenzyme in this biopsy.",
        "Enteropeptidase activates trypsinogen in the duodenum. The proenzyme here is in basal gastric gland cells.",
        "Alkaline surface mucus neutralizes acid at the epithelium. It does not convert the proenzyme to its active form.",
        "Salivary amylase continues only until food mixes with acid, which inactivates it. A lumen pH of 2.0 is that acid environment, so amylase is not the activator.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="g-cell-gastrin-antrum",
    task="mechanism", difficulty=2, src="os-23-4", nutrition=False,
    fact="Gastrin is released mainly by enteroendocrine G cells of the pyloric antrum when peptides and amino acids are present. It increases gastric-gland secretion and promotes gastric emptying.",
    forbid=["gastrin"],
    vignette=(
        "A 49-year-old man who sells farm equipment eats a large steak and develops epigastric fullness 25 minutes "
        "later. Temperature is 36.7°C, pulse is 84/min, respirations are 16/min, and blood pressure is 124/78 mm Hg. "
        "A catheter sample from veins draining the pyloric antrum shows a sharp rise in a peptide hormone. At the "
        "same time, acid secretion and the rate of emptying both increase. Fundic vein samples do not show this rise."
    ),
    stem="Which of the following cells released the hormone that rose in the antral blood?",
    options=[
        "Hormone-releasing cells in the gastric outlet",
        "Acid-producing cells in the middle of fundic glands",
        "Proenzyme cells at the base of fundic glands",
        "Enzyme-secreting cells at the tail of the pancreas",
        "Liver cells arranged around a central vein",
    ],
    key=0,
    whys=[
        "Peptides and amino acids in the stomach release gastrin mainly from G cells of the pyloric antrum. Gastrin increases gastric-gland secretion and promotes emptying. The rise is in antral venous blood, not fundic blood, after a protein meal.",
        "Parietal cells secrete acid and intrinsic factor. They respond to the hormone; they are not the antral source of the rise.",
        "Chief cells secrete pepsinogen. They sit in the fundus and body, and the fundic vein sample did not rise.",
        "Pancreatic acini secrete digestive enzymes when stimulated by a duodenal hormone. They are not in the pyloric antrum.",
        "Hepatocytes make bile and process portal blood. They are not the source of an antral peptide that rises after a steak.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="intrinsic-factor-essential",
    task="mechanism", difficulty=3, src="os-23-4", nutrition=True,
    fact="The only stomach function necessary for life is intrinsic factor, required for intestinal absorption of vitamin B12. After total gastrectomy, B12 injections replace that function.",
    forbid=["intrinsic factor"],
    vignette=(
        "A 67-year-old man who used to weld ship hulls had his entire stomach removed 3 years ago for a 5-cm mass. "
        "He eats regular meals and has not had diarrhea. Temperature is 36.6°C, pulse is 92/min, respirations are "
        "16/min, and blood pressure is 118/70 mm Hg. Hemoglobin is 8.4 g/dL with large red cells, and he has numbness "
        "in both feet. He has not received any injections since the operation."
    ),
    stem="Which of the following lost gastric product best accounts for both findings?",
    options=[
        "The glycoprotein required for vitamin B12 absorption",
        "The acid that converts pepsinogen into pepsin",
        "The mucus barrier that lines the gastric surface",
        "The hormone released from the fundus during a fast",
        "The oblique muscle layer that churns a solid meal",
    ],
    key=0,
    whys=[
        "Intrinsic factor is the one gastric product required for life because vitamin B12 cannot be absorbed without it. B12 is needed for mature red cells and for nerve function. He has large red cells and foot numbness 3 years after the whole stomach was removed, and he has had no replacement injections. He eats regular meals without diarrhea, so loss of acid or churning does not explain this pair of findings.",
        "Loss of acid impairs activation of pepsin. He has no diarrhea and eats normally, and acid loss does not by itself produce large red cells and numb feet.",
        "The mucus barrier prevents self-digestion. There is no remaining stomach to protect, and barrier loss does not cause this blood and nerve picture.",
        "Ghrelin from the fundus acts on hunger. Loss of that signal does not produce large red cells and distal numbness.",
        "The oblique muscle churns food. He tolerates regular meals, so loss of churning is not the cause of the anemia and numbness.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="cephalic-phase-before-food",
    task="mechanism", difficulty=3, src="os-23-4", nutrition=False,
    fact="The cephalic phase occurs before food enters the stomach. Smell, taste, sight, or thought of food triggers vagal signals that increase gastric secretion. Depression and loss of appetite can suppress it.",
    forbid=["cephalic"],
    vignette=(
        "A 26-year-old woman who illustrates children's books is studied before a test meal. Temperature is 36.7°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 108/66 mm Hg. Acid output rises within "
        "2 minutes after she smells and looks at a piece of warm bread, and the bread has not yet been swallowed. "
        "On a second day she is tearful, says she has no appetite, and the same smell produces no rise in acid."
    ),
    stem="Which of the following best explains the rise on the first day and its absence on the second?",
    options=[
        "A conditioned reflex before food arrives, lost with appetite",
        "Stretch of the stomach wall by the swallowed bread",
        "Peptides in the duodenum releasing intestinal gastrin",
        "A fall in antral pH that stops further acid output",
        "Fat in the duodenum slowing emptying for 6 hours",
    ],
    key=0,
    whys=[
        "The cephalic phase is the brief secretion that occurs before food enters the stomach, triggered by smell, taste, sight, or thought of wanted food. The bread was not swallowed. The same stimulus failed when she had lost her appetite, which suppresses this reflex.",
        "Stretch of the stomach is part of the gastric phase, after food arrives. Nothing was swallowed.",
        "Intestinal gastrin is released when partially digested food fills the duodenum. The bread never left the plate.",
        "A low antral pH restrains acid secretion. That does not explain a rise that starts from the smell of food she has not eaten.",
        "Fatty meals leave the stomach slowly. No meal was eaten, so emptying time is not the finding.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="enterogastric-reflex-pylorus",
    task="mechanism", difficulty=3, src="os-23-4", nutrition=False,
    fact="When the duodenum is distended with chyme, the enterogastric reflex inhibits gastric secretion and closes the pyloric sphincter, limiting further emptying.",
    forbid=["enterogastric"],
    vignette=(
        "A 36-year-old man who lays brick is studied 90 minutes after a 900-mL meal. Temperature is 36.8°C, pulse "
        "is 76/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. The duodenum is distended. Acid "
        "secretion falls, and the sphincter at the outlet of the stomach closes so that little further chyme leaves. "
        "The stomach itself is not empty."
    ),
    stem="Which of the following best accounts for the closed outlet and the fall in acid?",
    options=[
        "Duodenal distention inhibits further gastric emptying",
        "The sight of food is still driving the earliest secretory phase",
        "An empty fundus is releasing the hormone that causes hunger",
        "Bile salts are being stored in a relaxed gallbladder",
        "The external anal sphincter has been voluntarily contracted",
    ],
    key=0,
    whys=[
        "Distention of the duodenum with chyme triggers the enterogastric reflex, which inhibits secretion and closes the pyloric sphincter. The duodenum is distended, acid has fallen, and the outlet is closed while the stomach still contains the meal.",
        "The cephalic phase is brief and occurs before food arrives. This recording is 90 minutes after a 900-mL meal.",
        "Ghrelin rises in the fasting state, before meals. He is 90 minutes after a large meal, and the fundus is not described as empty.",
        "Between meals the gallbladder stores bile. That does not close the pylorus or lower acid during duodenal distention.",
        "The external anal sphincter is skeletal muscle at the anus. It does not control the gastric outlet.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="mucosal-barrier-bicarbonate",
    task="mechanism", difficulty=2, src="os-23-4", nutrition=False,
    fact="The stomach is protected by bicarbonate-rich mucus, tight junctions between epithelial cells, and replacement of the surface epithelium every 3 to 6 days.",
    forbid=["barrier"],
    vignette=(
        "A 53-year-old woman who binds library books has taken six aspirin tablets a day for 3 weeks for a sore "
        "knee. Temperature is 36.9°C, pulse is 88/min, respirations are 16/min, and blood pressure is 126/78 mm Hg. "
        "Endoscopy shows a shallow break in the gastric lining. Biopsy of nearby intact lining shows a thick mucus "
        "coat, and the epithelial cells meet at sealing contacts. The surface cells of a labeled control slide are "
        "said to be replaced every 3 to 6 days."
    ),
    stem="Which of the following is the role of the thick mucus coat on the intact lining?",
    options=[
        "Bicarbonate in that coat neutralizes acid at the surface",
        "It activates pepsinogen inside the basal gland cells",
        "It absorbs vitamin B12 farther down, in the ileum",
        "It emulsifies triglyceride droplets in the duodenum",
        "It concentrates bile by removing water from it",
    ],
    key=0,
    whys=[
        "The surface coat is bicarbonate-rich mucus. The bicarbonate neutralizes acid, and the mucus is a physical barrier. The intact lining in the biopsy still has that coat. Aspirin use is one of the two common reasons that coat fails, which fits the shallow break.",
        "Pepsinogen is activated by hydrochloric acid, not by the surface mucus. The mucus protects the surface from that acid.",
        "Vitamin B12 absorption requires intrinsic factor and occurs in the small intestine, not in the gastric mucus coat.",
        "Emulsification is the job of bile salts and phospholipids. Gastric mucus does not do that.",
        "The gallbladder mucosa concentrates bile. Gastric mucus does not.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="histamine-parietal-acid",
    task="mechanism", difficulty=2, src="os-23-4", nutrition=False,
    fact="Histamine from the stomach mucosa, released when food is present, stimulates parietal cells to release hydrochloric acid.",
    forbid=["histamine"],
    vignette=(
        "A 45-year-old man who drives a city bus is studied 1 hour after a mixed meal. Temperature is 36.8°C, "
        "pulse is 80/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. A local chemical messenger "
        "in the gastric mucosa is elevated. Blocking that messenger cuts acid output sharply, while pepsinogen "
        "granules in the basal gland cells remain."
    ),
    stem="Which of the following is the acid-producing target of this messenger?",
    options=[
        "Parietal cells in the gastric glands",
        "Chief cells storing an inactive proenzyme",
        "Goblet cells of the colonic surface",
        "Acinar cells secreting active lipase",
        "Kupffer cells along the hepatic sinusoids",
    ],
    key=0,
    whys=[
        "Histamine released from the stomach mucosa when food is present stimulates parietal cells to secrete hydrochloric acid. Blocking it cuts acid output. The basal pepsinogen granules are unchanged, so the target is the acid cell, not the proenzyme cell.",
        "Chief cells store pepsinogen. Those granules remained, and the block affected acid, which parietal cells secrete.",
        "Colonic goblet cells secrete mucus that eases passage of feces. They are not the gastric target of this meal-related acid signal.",
        "Pancreatic lipase is secreted already active. It is not the gastric cell whose acid fell.",
        "Kupffer cells phagocytose material in liver sinusoids. They do not secrete gastric acid.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="somatostatin-restrains-acid",
    task="mechanism", difficulty=3, src="os-23-4", nutrition=False,
    fact="Somatostatin from the pyloric antrum and duodenum restricts gastric secretions, motility, and emptying, and also restricts pancreatic secretion.",
    forbid=["somatostatin"],
    vignette=(
        "A 62-year-old woman who audits freight invoices is found to have a 1.2-cm antral endocrine tumor. "
        "Temperature is 36.5°C, pulse is 68/min, respirations are 14/min, and blood pressure is 138/82 mm Hg. "
        "Fasting acid output is very low, the stomach empties slowly, and pancreatic enzyme output is also low. "
        "The tumor cells match the antral cells that restrain all of those processes."
    ),
    stem="Which of the following is the expected action of the hormone these cells release?",
    options=[
        "Restriction of acid, motility, emptying, and enzymes",
        "Stimulation of hunger by an action on the hypothalamus",
        "Conversion of pepsinogen to pepsin inside the lumen",
        "Emulsification of fat within the duodenal lumen",
        "Activation of trypsinogen on the intestinal brush border",
    ],
    key=0,
    whys=[
        "Somatostatin from the pyloric antrum restricts gastric secretions, motility, and emptying, and it also restricts pancreatic secretions. Her tumor is antral, acid is low, emptying is slow, and pancreatic enzymes are low.",
        "Ghrelin, mainly from the fundus, stimulates hunger through the hypothalamus. It does not suppress acid, emptying, and pancreatic enzymes together.",
        "Hydrochloric acid converts pepsinogen to pepsin. A hormone that lowers acid would not be that converter.",
        "Bile salts emulsify fat. They are not the antral hormone that restrains acid and pancreatic juice.",
        "Enteropeptidase on the brush border activates trypsinogen. It is not an antral tumor product.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="ghrelin-fasting-hunger",
    task="mechanism", difficulty=2, src="os-23-4", nutrition=True,
    fact="Ghrelin is produced mainly by the fundus in the fasting state, with levels rising just before meals, and it acts on the hypothalamus to stimulate hunger.",
    forbid=["ghrelin"],
    vignette=(
        "A 24-year-old man who stocks warehouses skips breakfast and is studied at 11 a.m., just before he is "
        "allowed to eat. Temperature is 36.6°C, pulse is 64/min, respirations are 12/min, and blood pressure is "
        "110/68 mm Hg. He reports intense hunger. A hormone measured in blood from the gastric fundus is high and "
        "falls 40 minutes after he eats a 700-kcal meal."
    ),
    stem="Which of the following is the main action of the hormone that was high before the meal?",
    options=[
        "Stimulation of hunger through the hypothalamus",
        "Neutralization of acid by surface bicarbonate",
        "Activation of trypsin from trypsinogen",
        "Reabsorption of bile salts in the ileum",
        "Contraction of the external anal sphincter",
    ],
    key=0,
    whys=[
        "Ghrelin comes mainly from the fundus, rises in the fasting state just before meals, and stimulates hunger through the hypothalamus. His fundic hormone is high while he is hungry and falls after the meal.",
        "Surface bicarbonate is part of the gastric mucus barrier. It is not a fundic hormone that falls after eating.",
        "Enteropeptidase activates trypsinogen in the duodenum. It does not rise in fundic blood before a meal.",
        "Bile-salt reabsorption is an ileal transport step, not a pre-meal fundic hormone.",
        "The external anal sphincter is voluntary skeletal muscle. It is not driven by a fundic hormone that tracks hunger.",
    ],
)

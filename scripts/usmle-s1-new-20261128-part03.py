# Batch 1, items 31–50.

add(
    domain="gastrointestinal", subject="physiology", topic="acid-stops-salivary-amylase",
    task="mechanism", difficulty=3, src="os-23-4", nutrition=False,
    fact="Salivary amylase keeps digesting starch in the fundus until acid mixes in and inactivates it. That same acid activates lingual lipase.",
    forbid=["amylase", "lingual"],
    vignette=(
        "A 33-year-old man who bakes bread is studied after swallowing a starchy roll. Temperature is 36.7°C, "
        "pulse is 72/min, respirations are 14/min, and blood pressure is 116/70 mm Hg. For several minutes the "
        "bolus sits in the fundus and starch digestion continues. Once mixing waves fold it into the acid chyme, "
        "starch digestion by the salivary enzyme stops and triglyceride breakdown by a mouth-derived lipase begins."
    ),
    stem="Which of the following best explains both changes after mixing?",
    options=[
        "Acid inactivates the salivary enzyme and activates the lipase",
        "Bile salts emulsify starch and stop all lipase activity",
        "Secretin converts the salivary enzyme into an active lipase",
        "Gastrin from the antrum digests starch inside the fundus",
        "The brush border finishes starch digestion inside the fundus",
    ],
    key=0,
    whys=[
        "While food remains in the fundus, salivary amylase continues. Mixing with acid chyme inactivates that amylase and activates lingual lipase, which then splits triglycerides. Both changes in the study follow that mixing.",
        "Bile salts emulsify lipids in the intestine. They do not turn off salivary starch digestion in the stomach, and they do not stop lipase.",
        "Secretin drives pancreatic bicarbonate. It does not convert salivary amylase into a lipase.",
        "Gastrin increases acid secretion and emptying. It is not itself the enzyme that digests starch.",
        "Brush-border enzymes finish carbohydrate digestion on small-intestinal microvilli. The bolus is still in the fundus.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="fat-empties-slowest",
    task="mechanism", difficulty=2, src="os-23-4", nutrition=True,
    fact="Carbohydrate-heavy foods leave the stomach fastest, then high-protein foods. High-triglyceride meals stay longest, sometimes 6 hours or more, because intestinal fat digestion is slow.",
    forbid=["emptying"],
    vignette=(
        "A 40-year-old woman who teaches swimming eats three test breakfasts on separate days, each 500 kcal. "
        "Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 112/68 mm Hg. "
        "The starch meal is gone from the stomach first, the egg-white meal is next, and the cream meal is still "
        "present at 6 hours. She has no pain and no ulcer on endoscopy."
    ),
    stem="Which of the following best explains why the cream meal remains longest?",
    options=[
        "Intestinal fat digestion is slow, so emptying waits",
        "Starch is held until salivary amylase is used up",
        "Protein meals close the pylorus for the full 6 hours",
        "Cream stimulates hunger hormone release from the antrum",
        "The cream meal is absorbed entirely by the stomach",
    ],
    key=0,
    whys=[
        "Carbohydrate meals empty fastest, protein meals next, and high-triglyceride meals stay longest because enzymes in the small intestine digest fats slowly. The cream meal is the fat meal and is still present at 6 hours, which matches that order. Endoscopy shows no ulcer.",
        "Starch left first in this study. It is not held until amylase is gone.",
        "The protein meal left before the cream meal. Protein does not keep the pylorus closed for 6 hours.",
        "Ghrelin comes mainly from the fundus in the fasting state, not from the antrum in response to cream.",
        "Little nutrient absorption occurs in the stomach, aside from substances such as alcohol and aspirin. A cream meal is not absorbed there.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="stomach-absorbs-aspirin",
    task="mechanism", difficulty=3, src="os-23-4", nutrition=False,
    fact="Almost all absorption occurs in the small intestine. The stomach does absorb some drugs, including alcohol and aspirin.",
    forbid=["aspirin"],
    vignette=(
        "A 28-year-old man who refinishes furniture takes two tablets for a headache and a sip of whiskey on an "
        "empty stomach. Temperature is 36.8°C, pulse is 86/min, respirations are 14/min, and blood pressure is "
        "124/76 mm Hg. Thirty minutes later, before any meal has been eaten, both the drug and the alcohol are "
        "already measurable in his blood. He has no diarrhea."
    ),
    stem="Which of the following best accounts for the early appearance of both substances in blood?",
    options=[
        "The stomach can absorb alcohol and this analgesic",
        "All nutrient absorption normally occurs in the stomach",
        "Lacteals are required before either substance enters blood",
        "Bile salts must emulsify both substances first",
        "The colon reabsorbs both during the next 12 hours",
    ],
    key=0,
    whys=[
        "Nearly all absorption is in the small intestine, but the stomach does absorb some drugs, including alcohol and aspirin. Both are in his blood at 30 minutes on an empty stomach, before a meal.",
        "The stomach is a holding chamber. Little nutrient absorption occurs there. The exception relevant here is drugs such as alcohol and aspirin, not nutrients in general.",
        "Lacteals carry lipid breakdown products. Alcohol and this analgesic are already in blood, and lipids are not the substances measured.",
        "Bile salts emulsify lipids in the duodenum. They are not required for gastric absorption of alcohol and aspirin.",
        "The colon absorbs remaining water over 12 to 24 hours. These levels were measured at 30 minutes.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="rugae-empty-stomach",
    task="anatomy", difficulty=2, src="os-23-4", nutrition=False,
    fact="When the stomach is empty it deflates, and the mucosa and submucosa fall into large folds called rugae.",
    forbid=["rugae", "ruga"],
    vignette=(
        "A 22-year-old woman who runs cross-country has an upper endoscopy at 7 a.m. after a 12-hour fast. "
        "Temperature is 36.4°C, pulse is 58/min, respirations are 12/min, and blood pressure is 104/64 mm Hg. "
        "The gastric lumen is small, and the lining is thrown into large folds. After she drinks 400 mL of water, "
        "the same folds flatten."
    ),
    stem="Which of the following best describes these folds?",
    options=[
        "Mucosa and submucosa thrown up in an empty stomach",
        "Permanent circular ridges that end in the mid-ileum",
        "Three longitudinal muscle bands that pouch the colon",
        "Microscopic projections that form the brush border",
        "Transverse rectal shelves that separate gas from stool",
    ],
    key=0,
    whys=[
        "In the absence of food the stomach deflates and its mucosa and submucosa fall into rugae. She has fasted 12 hours, the lumen is small, and the folds flatten after 400 mL of water.",
        "Circular folds are permanent ridges of the small intestine that begin in the duodenum and end near the mid-ileum. They do not flatten after a drink of water in the stomach.",
        "Teniae coli are three colonic muscle bands that create haustra. This endoscopy is of the fasting stomach.",
        "Microvilli are 1-micrometer apical projections that make the brush border. They are not macroscopic folds that flatten when the stomach fills.",
        "Rectal valves are transverse folds that help keep gas and feces apart. They are not gastric folds after a fast.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="bile-salts-emulsify",
    task="mechanism", difficulty=2, src="os-23-6", nutrition=True,
    fact="Bile salts and phospholipids emulsify large lipid globules into tiny fragments. They do not themselves hydrolyze triglyceride. Lipase then acts on the increased surface.",
    forbid=["emulsif"],
    vignette=(
        "A 48-year-old man who paints houses has pale, greasy stools after his gallbladder was removed and a "
        "stone was found blocking the duct that enters the duodenum. Temperature is 36.9°C, pulse is 84/min, "
        "respirations are 16/min, and blood pressure is 132/80 mm Hg. Duodenal fluid contains almost no bile "
        "salts. Pancreatic lipase in the same fluid is present and active."
    ),
    stem="Which of the following is the missing step that leaves fat undigested?",
    options=[
        "Breaking large fat globules into tiny droplets",
        "Hydrolysis of triglyceride by the pancreatic enzyme",
        "Conversion of pepsinogen to pepsin by acid",
        "Absorption of glucose through villus capillaries",
        "Secretion of intrinsic factor by parietal cells",
    ],
    key=0,
    whys=[
        "Bile salts and phospholipids break large lipid globules into tiny droplets so lipase has surface to work on. Bile salts are absent and the stools are greasy, while lipase is present and active, so the missing step is that breakup, not the enzyme.",
        "Pancreatic lipase is present and active in the duodenal fluid. The hydrolysis enzyme is not the missing piece.",
        "Acid activation of pepsin is a gastric step in protein digestion. It does not explain greasy stools with absent bile salts.",
        "Glucose enters villus blood capillaries. Fat, not glucose, is the nutrient in the greasy stools.",
        "Intrinsic factor is required for vitamin B12 absorption. It does not disperse fat globules.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="bile-salt-ileal-recycle",
    task="mechanism", difficulty=3, src="os-23-6", nutrition=True,
    fact="Bile salts are absorbed in the ileum and returned to the liver in portal blood, then secreted again into bile.",
    forbid=["enterohepatic"],
    vignette=(
        "A 39-year-old woman who coaches rowing had the last 80 cm of small intestine removed after an injury. "
        "Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. "
        "The duodenum and jejunum remain. Six weeks later her stools are greasy, and the bile-salt concentration "
        "in new hepatic bile is low. The liver cells themselves look normal on biopsy."
    ),
    stem="Which of the following recycling route was interrupted?",
    options=[
        "Ileal uptake of bile salts and return in portal blood",
        "Colonic synthesis of vitamin K by luminal bacteria",
        "Gastric absorption of alcohol across the fundus",
        "Storage of concentrated bile inside the gallbladder",
        "Brush-border digestion of lactose in the duodenum",
    ],
    key=0,
    whys=[
        "Once bile salts reach the ileum they are absorbed and returned to the liver in portal blood, then secreted again. The last 80 cm of small intestine is the ileum. It was removed, new bile is poor in bile salts, the liver cells look normal, and the stools are greasy.",
        "Colonic bacteria synthesize vitamin K. That does not restock bile salts, and the removed segment is small intestine.",
        "The stomach absorbs some alcohol. That route does not return bile salts to the liver.",
        "The gallbladder stores and concentrates bile between meals. Her liver cells are normal and the deficit follows ileal resection, not gallbladder loss.",
        "Lactase is a brush-border enzyme for milk sugar. Losing it causes gas and diarrhea after dairy, not a fall in bile-salt concentration in hepatic bile.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="secretin-ductal-bicarbonate",
    task="mechanism", difficulty=2, src="os-23-6", nutrition=False,
    fact="Acidic chyme in the duodenum releases secretin, which causes pancreatic duct cells to secrete bicarbonate-rich juice. Proteins and fats release CCK, which stimulates enzyme-rich juice from acini.",
    forbid=["secretin"],
    vignette=(
        "A 43-year-old man who repairs bicycles is studied as acidic chyme first enters the duodenum. Temperature "
        "is 36.6°C, pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Duodenal pH is "
        "3.5. Juice collected from pancreatic ducts is watery and rich in bicarbonate, while enzyme output from "
        "the acini has not yet risen. No fat has reached the duodenum."
    ),
    stem="Which of the following hormone actions fits this ductal juice?",
    options=[
        "Acid in the duodenum drives bicarbonate from duct cells",
        "Fat in the duodenum drives enzyme release from acini",
        "A fasting fundus hormone stimulates hypothalamic hunger",
        "Antral acid cells release the inactive protein proenzyme",
        "Ileal lymphoid aggregates sample luminal bacteria",
    ],
    key=0,
    whys=[
        "Acidic chyme releases secretin, and secretin causes duct cells to release bicarbonate-rich juice. Duodenal pH is 3.5, the duct juice is watery and bicarbonate-rich, and enzyme output has not risen. No fat has arrived.",
        "CCK is released by proteins and fats and stimulates enzyme-rich juice from acini. Fat has not arrived, and acinar enzyme output has not risen.",
        "Ghrelin from the fasting fundus stimulates hunger. It does not produce bicarbonate-rich duct juice when acid enters the duodenum.",
        "Chief cells release pepsinogen. They are not the source of pancreatic ductal bicarbonate.",
        "Peyer patches sample luminal antigen. They do not secrete pancreatic bicarbonate.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="cck-acinar-enzymes",
    task="mechanism", difficulty=2, src="os-23-6", nutrition=False,
    fact="Proteins and fats in the duodenum release cholecystokinin, which stimulates acini to secrete enzyme-rich pancreatic juice and enhances secretin. Fatty chyme also increases bile production through cholecystokinin.",
    forbid=["cholecystokinin", "cck"],
    vignette=(
        "A 51-year-old woman who edits film is studied after a meal of eggs and butter reaches the duodenum. "
        "Temperature is 36.8°C, pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. "
        "Duodenal pH is already 7.2. Enzyme-rich juice pours from pancreatic acini, and bile flow from the liver "
        "increases. A watery bicarbonate phase had occurred earlier, when the pH was low."
    ),
    stem="Which of the following best accounts for the enzyme-rich juice and the rise in bile flow?",
    options=[
        "Fat and protein in the duodenum signal the acini and the liver",
        "Acid alone is still driving duct-cell bicarbonate secretion",
        "The antrum is releasing the hormone that only increases acid",
        "Colonic bacteria are synthesizing vitamin K and biotin",
        "Surface mucus cells are replacing themselves every few days",
    ],
    key=0,
    whys=[
        "Proteins and fats release cholecystokinin, which stimulates enzyme-rich juice from acini and increases bile production when fatty chyme enters the duodenum. The meal is eggs and butter, pH is already 7.2, enzymes and bile flow have risen, and the bicarbonate phase was earlier.",
        "Secretin and ductal bicarbonate respond to acid. The pH is now 7.2, and that watery phase already occurred.",
        "Gastrin from the antrum increases gastric acid and emptying. It does not explain enzyme-rich pancreatic juice plus increased bile flow after a fatty meal.",
        "Colonic bacteria make vitamin K and biotin. They do not release acinar enzymes.",
        "Gastric surface cells turn over every 3 to 6 days. That renewal is not the signal for this enzyme and bile response.",
    ],
)

add(
    domain="gastrointestinal", subject="biochemistry", topic="enteropeptidase-trypsinogen",
    task="mechanism", difficulty=3, src="os-23-6", nutrition=False,
    fact="Enteropeptidase on the intestinal brush border activates trypsin from trypsinogen. Trypsin then activates chymotrypsinogen and procarboxypeptidase. Amylase, lipase, and nuclease are secreted already active.",
    forbid=["enteropeptidase", "trypsin"],
    vignette=(
        "A 7-year-old boy who lives on a dairy farm has bulky stools and poor weight gain of 1.5 kg over the past "
        "year. Temperature is 36.7°C, pulse is 92/min, respirations are 18/min, and blood pressure is 96/60 mm Hg. "
        "Duodenal juice contains trypsinogen, chymotrypsinogen, and procarboxypeptidase, all still inactive. "
        "Amylase and lipase in the same juice are active. The brush-border enzyme that normally starts this "
        "protein-enzyme cascade is missing."
    ),
    stem="Which of the following is the first activation blocked by that missing enzyme?",
    options=[
        "The first protease precursor, leaving the others inactive",
        "Amylase activation, so starch digestion cannot start",
        "Lipase activation, so triglyceride hydrolysis cannot start",
        "Pepsinogen conversion by acid inside the stomach",
        "Bile-salt synthesis inside each individual liver cell",
    ],
    key=0,
    whys=[
        "Brush-border enteropeptidase activates trypsinogen to trypsin, and trypsin then activates the other pancreatic proteases. Those three proteases are still inactive, while amylase and lipase, which are secreted already active, are active. The missing brush-border enzyme therefore blocks the first protease step.",
        "Amylase is secreted in active form and is active in this juice. Starch digestion by amylase is not the blocked step.",
        "Lipase is secreted active and is active here. Fat hydrolysis by lipase is not waiting on this brush-border enzyme.",
        "Pepsinogen is activated by gastric acid. The inactive enzymes in the duodenal juice are the pancreatic protease precursors.",
        "Hepatocytes make bile. The missing protein is a brush-border enzyme, and bile salts are not the inactive proteins listed in the juice.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="kupffer-sinusoid-phagocytes",
    task="histology", difficulty=2, src="os-23-6", nutrition=False,
    fact="Kupffer cells are star-shaped phagocytes in the hepatic sinusoids. They remove dead red and white cells, bacteria, and other foreign material.",
    forbid=["kupffer"],
    vignette=(
        "A 55-year-old man who cleans fish markets has had fever for 4 days after a deep cut. Temperature is "
        "38.6°C, pulse is 108/min, respirations are 20/min, and blood pressure is 102/64 mm Hg. Blood culture "
        "grows gram-negative rods. A liver biopsy shows star-shaped cells along the porous vascular channels "
        "that have engulfed bacterial debris. Hepatocytes and bile ductules are intact."
    ),
    stem="Which of the following is the normal role of the star-shaped cells?",
    options=[
        "Phagocytosis of bacteria and worn blood cells in sinusoids",
        "Secretion of bile into the canals between hepatocytes",
        "Storage and concentration of bile between meals",
        "Release of enzyme-rich juice from pancreatic acini",
        "Absorption of bile salts by the terminal ileum",
    ],
    key=0,
    whys=[
        "Star-shaped cells in the hepatic sinusoids are the phagocytes that remove dead blood cells, bacteria, and other foreign material. The biopsy shows them along those channels, full of bacterial debris, with hepatocytes and ductules intact.",
        "Hepatocytes secrete bile into canaliculi. Those cells are intact and are not the star-shaped phagocytes.",
        "The gallbladder stores and concentrates bile. It is not a star-shaped cell inside a liver sinusoid.",
        "Pancreatic acini secrete enzymes. They are not in the liver sinusoids.",
        "Ileal enterocytes absorb bile salts. They are not the phagocytes in this liver biopsy.",
    ],
)

# Batch 1, items 31–55 were the plan; this file is items 31 onward in file order after parts 01–03 (30 items). These are the next 20.

add(
    domain="gastrointestinal", subject="anatomy", topic="portal-triad-contents",
    task="histology", difficulty=2, src="os-23-6", nutrition=False,
    fact="A portal triad at the edge of a lobule contains a bile duct, a hepatic artery branch, and a hepatic portal vein branch.",
    forbid=["triad"],
    vignette=(
        "A 60-year-old woman who catalogues maps has a liver biopsy for a 6-month rise in enzymes. Temperature "
        "is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. At the corner "
        "of each lobule the slide shows three structures traveling together: a small duct, a small thick-walled "
        "arterial vessel, and a wider thin-walled venous vessel. The central veins are patent."
    ),
    stem="Which of the following is the normal contents of that three-part corner?",
    options=[
        "A bile duct, a hepatic artery, and a portal vein",
        "A central vein, a lacteal, and a pancreatic duct",
        "An islet, an acinus, and the accessory pancreatic duct",
        "A tenia, a haustral pouch, and a fat-filled tag",
        "A pylorus, a gastric fold, and an oblique muscle",
    ],
    key=0,
    whys=[
        "The portal triad at the lobule edge is a bile duct, a hepatic artery branch, and a hepatic portal vein branch. The biopsy shows a small duct, a thick-walled arterial vessel, and a wider thin-walled vein at that corner.",
        "The central vein is in the middle of the lobule and is described as patent, not as one of the three corner structures. A lacteal is in an intestinal villus.",
        "Islets and acini are pancreas. The accessory duct enters the duodenum. They are not the corner of a liver lobule.",
        "Teniae, haustra, and epiploic appendages are gross features of the colon, not a microscopic liver corner.",
        "Pylorus, rugae, and oblique muscle are gastric. They do not travel together at the edge of a hepatic lobule.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="bile-blood-opposite-flow",
    task="mechanism", difficulty=3, src="os-23-6", nutrition=False,
    fact="Bile flows from canaliculi toward bile ducts at the portal triad. Sinusoidal blood flows toward the central vein. Blood and bile therefore flow in opposite directions.",
    forbid=["opposite"],
    vignette=(
        "A 47-year-old man who surveys roads has a liver biopsy read with the class. Temperature is 36.5°C, "
        "pulse is 70/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. Dye injected into the "
        "canals between hepatocytes moves toward the duct at the lobule edge. Labeled red cells in the porous "
        "vascular channels move toward the vein in the center of the same lobule."
    ),
    stem="Which of the following best describes these two flows?",
    options=[
        "Bile and sinusoidal blood move in opposite directions",
        "Bile and blood both drain first into the central vein",
        "Bile and blood both exit through the cystic duct",
        "Bile enters the sinusoid and blood enters the canaliculus",
        "Both streams cross the brush border of the ileum",
    ],
    key=0,
    whys=[
        "Bile in canaliculi flows toward the bile ducts, while sinusoidal blood flows to the central vein. The dye and the red cells in this lobule move those two ways, so the streams are opposite.",
        "Blood reaches the central vein. Bile does not. The dye moved toward the duct at the edge.",
        "The cystic duct drains the gallbladder. It is not the exit for sinusoidal blood.",
        "Bile is excreted into canaliculi, and blood stays in sinusoids. They do not swap compartments.",
        "The ileal brush border absorbs bile salts after bile has already reached the intestine. This slide is a liver lobule.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="bilirubin-stercobilin-color",
    task="mechanism", difficulty=3, src="os-23-6", nutrition=False,
    fact="Bilirubin from degraded red cells is excreted in bile and converted by intestinal bacteria to stercobilin, the brown pigment of stool. If bile does not enter the intestine, stool is pale and fatty.",
    forbid=["stercobilin", "bilirubin"],
    vignette=(
        "A 66-year-old man who carves decoys has had pale, greasy stools and dark urine for 2 weeks. Temperature "
        "is 36.8°C, pulse is 78/min, respirations are 14/min, and blood pressure is 136/78 mm Hg. A stone blocks "
        "the duct that should deliver bile into the duodenum. Intestinal bacteria are present on stool culture, "
        "but the stool has no brown pigment."
    ),
    stem="Which of the following pigment step failed to occur?",
    options=[
        "Bacterial conversion of bile pigment into brown stool color",
        "Gastric conversion of pepsinogen into pepsin by luminal acid",
        "Skin synthesis of vitamin D during ordinary sun exposure",
        "Hepatic storage of glycogen after a carbohydrate meal",
        "Colonic absorption of most of the water ingested each day",
    ],
    key=0,
    whys=[
        "Bilirubin excreted in bile is converted by intestinal bacteria to stercobilin, which makes stool brown. Bile is not reaching the duodenum, the stool is pale and greasy, and bacteria are present but have no bile pigment to convert.",
        "Pepsin activation is a gastric acid step. It does not color the stool, and the blocked duct is the bile duct.",
        "Vitamin D can be made in sun-exposed skin. That does not supply the brown stool pigment.",
        "Glycogen storage does not pigment stool. The missing material is bile.",
        "The small intestine absorbs about 90 percent of ingested water, and the colon absorbs most of the rest. Water handling does not create the brown pigment.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="gallbladder-concentrates-bile",
    task="mechanism", difficulty=2, src="os-23-6", nutrition=False,
    fact="The gallbladder mucosa absorbs water and ions and can concentrate bile up to tenfold. Its wall has no submucosa.",
    forbid=["gallbladder"],
    vignette=(
        "A 42-year-old woman who designs quilts has a 1.5-cm stone removed from a muscular sac on the underside "
        "of the right hepatic lobe. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood "
        "pressure is 118/74 mm Hg. Between meals the sac's lining absorbs water from the fluid stored inside, "
        "and the fluid becomes about 8 times more concentrated. The wall has epithelium and muscle but no "
        "separate submucosal layer."
    ),
    stem="Which of the following is the normal effect of that water absorption?",
    options=[
        "Fluid in this sac loses water and occupies less volume",
        "Pancreatic lipase is converted to an inactive proenzyme",
        "Salivary amylase is protected from gastric acid",
        "Vitamin B12 is bound and absorbed at this site",
        "The pyloric sphincter is held closed for 6 hours",
    ],
    key=0,
    whys=[
        "The gallbladder mucosa absorbs water and ions and concentrates bile by as much as tenfold. This sac on the underside of the right lobe concentrated its fluid about eightfold and has no submucosa, which matches that wall.",
        "Lipase is secreted already active. Concentrating bile does not inactivate it.",
        "Gastric acid inactivates salivary amylase. Gallbladder water absorption does not protect it.",
        "Vitamin B12 absorption needs intrinsic factor and occurs in the small intestine, not in this sac.",
        "The pylorus controls gastric emptying. It is not the sac that concentrates bile.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="brunner-glands-duodenum",
    task="histology", difficulty=3, src="os-23-5", nutrition=False,
    fact="Brunner glands are found only in the duodenal submucosa and secrete bicarbonate-rich mucus that buffers acidic chyme.",
    forbid=["brunner"],
    vignette=(
        "A 37-year-old man who installs windows has a biopsy of the first part of the small intestine. Temperature "
        "is 36.7°C, pulse is 72/min, respirations are 14/min, and blood pressure is 124/76 mm Hg. Mucus-secreting "
        "glands sit in the submucosa and make an alkaline secretion. A biopsy from the jejunum, taken at the same "
        "procedure, has no glands in that layer. Duodenal pH on entry of chyme is 3.8."
    ),
    stem="Which of the following is the role of the alkaline mucus from these glands?",
    options=[
        "Buffering acidic chyme as it leaves the stomach",
        "Emulsifying fat in place of bile salts",
        "Activating trypsinogen on the brush border",
        "Absorbing lipid into the villus lacteal",
        "Producing the brown pigment of normal stool",
    ],
    key=0,
    whys=[
        "Brunner glands are limited to the duodenal submucosa and secrete bicarbonate-rich mucus that buffers acidic chyme. These glands are in the submucosa of the first small-bowel segment, are absent in the jejunum, and the entering pH is 3.8.",
        "Bile salts emulsify fat. Alkaline mucus does not replace them.",
        "Enteropeptidase activates trypsinogen. It is a brush-border enzyme, not the submucosal mucus gland.",
        "Lacteals absorb lipids. Mucus glands do not.",
        "Intestinal bacteria convert bilirubin to the brown stool pigment. Duodenal mucus does not.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="paneth-cell-lysozyme",
    task="histology", difficulty=3, src="os-23-5", nutrition=False,
    fact="Paneth cells in the intestinal crypts secrete lysozyme, a bactericidal enzyme, and can phagocytose.",
    forbid=["paneth", "lysozyme"],
    vignette=(
        "A 16-year-old boy who works a summer produce stand has 2 days of watery diarrhea. Temperature is 37.6°C, "
        "pulse is 96/min, respirations are 16/min, and blood pressure is 108/66 mm Hg. A jejunal biopsy shows "
        "granule-filled cells at the base of the crypts. The granules contain a bactericidal enzyme, and some of "
        "the same cells contain engulfed bacterial fragments."
    ),
    stem="Which of the following is the function of these crypt-base cells?",
    options=[
        "Release of a bacteria-killing protein and engulfment of debris",
        "Release of the fat-meal hormone from duodenal cells",
        "Secretion of alkaline mucus limited to the duodenum",
        "Production of the cofactor required for vitamin B12 uptake",
        "Removal of water so stored bile occupies less volume",
    ],
    key=0,
    whys=[
        "Paneth cells at the base of intestinal crypts secrete lysozyme and can phagocytose. The biopsy shows crypt-base cells with a bactericidal enzyme and engulfed bacteria.",
        "I cells of the duodenum secrete cholecystokinin. They are not the crypt-base cells full of a bactericidal enzyme.",
        "Brunner glands, in the duodenal submucosa only, secrete bicarbonate mucus. These cells are in jejunal crypts.",
        "Parietal cells in the stomach make intrinsic factor. They are not jejunal crypt cells.",
        "The gallbladder concentrates bile. It is not the source of these crypt granules.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="villus-surface-adaptations",
    task="anatomy", difficulty=2, src="os-23-5", nutrition=False,
    fact="Circular folds, villi, and microvilli increase small-bowel absorptive surface more than 600-fold and are most abundant in the proximal two-thirds, where most absorption occurs.",
    forbid=["microvilli", "villi"],
    vignette=(
        "A 31-year-old woman who teaches violin has a biopsy of the proximal jejunum for a 3-kg weight loss. "
        "Temperature is 36.5°C, pulse is 76/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. "
        "The specimen shows tall vascular projections and a fuzzy apical border on the epithelial cells. A colon "
        "biopsy from the same week has neither the projections nor the fuzzy border, and it has no circular ridges."
    ),
    stem="Which of the following is the purpose of the projections and the fuzzy border?",
    options=[
        "A large increase in the surface available for absorption",
        "Voluntary control of the external anal sphincter",
        "Storage of bile between meals on the liver's underside",
        "Churning of food by a third gastric muscle layer",
        "Phagocytosis of bacteria inside hepatic sinusoids",
    ],
    key=0,
    whys=[
        "Circular folds, villi, and microvilli expand small-bowel absorptive surface more than 600-fold and are richest in the proximal two-thirds. The jejunal biopsy has the projections and the fuzzy border. The colon, which lacks folds and villi, does not.",
        "The external anal sphincter is skeletal muscle. It is not a mucosal projection.",
        "The gallbladder stores bile. It does not form jejunal villi.",
        "The oblique gastric muscle churns food. It is not the fuzzy apical border of jejunal cells.",
        "Kupffer cells phagocytose in liver sinusoids. They are not jejunal surface projections.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="segmentation-mixes-not-propels",
    task="mechanism", difficulty=3, src="os-23-5", nutrition=False,
    fact="Segmentation mixes chyme and presses it against the mucosa. It does not propel chyme along the intestine. Duodenal segmentation is about 12 times per minute and ileal segmentation about 8.",
    forbid=["segmentation"],
    vignette=(
        "A 27-year-old man who installs solar panels is studied 2 hours after lunch. Temperature is 36.8°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. Rings of small-bowel "
        "muscle contract and relax about 12 times per minute in the segment just beyond the stomach, shoving "
        "chyme back and forth against the lining. The meal has not advanced to the colon. A distal segment "
        "contracts only 8 times per minute."
    ),
    stem="Which of the following is the main result of these back-and-forth contractions?",
    options=[
        "Mixing of chyme with juices and contact with the mucosa",
        "A strong wave that empties the colon into the rectum",
        "Voluntary opening of the external anal sphincter",
        "Concentration of bile stored under the liver",
        "Release of intrinsic factor from gastric glands",
    ],
    key=0,
    whys=[
        "Segmentation shoves chyme back and forth, mixing it with digestive juices and pressing it on the mucosa. It does not propel the meal. The rate is about 12 per minute in the duodenum and about 8 in the ileum, which matches this study, and the meal has not reached the colon.",
        "Mass movements are strong colonic waves that move contents toward the rectum. These contractions are in the small bowel and do not advance the meal.",
        "The external anal sphincter is voluntary skeletal muscle. These are involuntary mixing rings.",
        "The gallbladder concentrates bile. It does not contract 12 times per minute in the small bowel.",
        "Intrinsic factor comes from gastric parietal cells, not from intestinal mixing contractions.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="motilin-migrating-complex",
    task="mechanism", difficulty=4, src="os-23-5", nutrition=False,
    fact="After most chyme is absorbed, motilin from the duodenal mucosa starts the migrating motility complex, which sweeps remaining material to the end of the ileum over about 90 to 120 minutes.",
    forbid=["motilin", "migrating"],
    vignette=(
        "A 35-year-old woman who archives photographs is studied late after a meal, when the small-bowel wall "
        "is no longer distended. Temperature is 36.6°C, pulse is 66/min, respirations are 12/min, and blood "
        "pressure is 108/66 mm Hg. A hormone from the duodenal mucosa rises. Sweeping contractions then begin "
        "in the duodenum and restart a little farther along, reaching the end of the ileum in 100 minutes."
    ),
    stem="Which of the following best describes the wave started by this hormone?",
    options=[
        "A housekeeping sweep after most of the meal is absorbed",
        "Back-and-forth mixing that does not move chyme onward",
        "A colonic mass movement triggered by gastric distention",
        "Hunger signaling from the fundus just before a meal",
        "Closure of the pylorus because the duodenum is overfilled",
    ],
    key=0,
    whys=[
        "When the intestine is no longer distended, motilin from the duodenal mucosa starts the migrating motility complex. The complex begins in the duodenum and reaches the end of the ileum in about 90 to 120 minutes. This study shows that pattern at 100 minutes after distention has ended.",
        "Segmentation mixes chyme and does not propel it. These waves advance along the bowel.",
        "The gastrocolic reflex increases colonic mass movements during or just after eating. This recording is late, in the small bowel, after distention has fallen.",
        "Ghrelin from the fasting fundus stimulates hunger. It does not start a duodenal-to-ileal sweep over 100 minutes.",
        "The enterogastric reflex closes the pylorus when the duodenum is distended. Here the wall is no longer distended, and the wave is a sweep, not pyloric closure.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="lactase-hydrogen-breath",
    task="mechanism", difficulty=2, src="os-23-5", nutrition=True,
    fact="If lactase is insufficient, colonic bacteria ferment undigested lactose, producing gas, cramps, bloating, and diarrhea. The hydrogen breath test detects hydrogen made by that fermentation.",
    forbid=["lactase", "lactose"],
    vignette=(
        "A 21-year-old man who clerks in a grocery store has cramps, bloating, and watery diarrhea within 2 hours "
        "after a 400-mL glass of milk. Temperature is 36.7°C, pulse is 82/min, respirations are 16/min, and blood "
        "pressure is 116/72 mm Hg. Cheese-free meals do not cause symptoms. After a dairy challenge, exhaled "
        "hydrogen rises. Stool contains no blood and no leukocytes."
    ),
    stem="Which of the following best explains the hydrogen in his breath?",
    options=[
        "Colonic bacteria ferment sugar his intestine did not split",
        "Gastric acid converts a proenzyme and releases hydrogen",
        "Hepatic bile pigment is changed into the brown stool color",
        "Fundic endocrine cells release the pre-meal hunger signal",
        "Pancreatic duct cells secrete bicarbonate into the duodenum",
    ],
    key=0,
    whys=[
        "Without enough lactase, lactose stays in the lumen and colonic bacteria ferment it, making gas, cramps, bloating, and diarrhea. Hydrogen from that fermentation is exhaled. Symptoms follow milk, spare dairy-free meals, and the stool has no blood or leukocytes.",
        "Acid activates pepsinogen. That reaction is not the source of exhaled hydrogen after milk.",
        "Bacteria make stercobilin from bilirubin. That colors stool. It does not explain hydrogen breath after milk.",
        "Ghrelin signals hunger before meals. It does not rise as exhaled hydrogen after dairy.",
        "Ductal bicarbonate buffers acid. It does not generate breath hydrogen after milk.",
    ],
)

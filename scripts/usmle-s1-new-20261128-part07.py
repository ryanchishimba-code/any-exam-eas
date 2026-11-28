# Remaining gastrointestinal items for batch 1.

add(
    domain="gastrointestinal", subject="anatomy", topic="greater-omentum-apron",
    task="anatomy", difficulty=2, src="os-23-1", nutrition=False,
    fact="The greater omentum is an apron-like fold superficial to the small intestine and transverse colon and a site of fat storage.",
    forbid=["omentum"],
    vignette=(
        "A 63-year-old man who upholsters chairs has laparoscopy for a 2-cm abdominal-wall hernia. Temperature "
        "is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 134/80 mm Hg. A fatty "
        "peritoneal apron lies in front of the small intestine and the transverse colon. It is not the fold that "
        "ties the liver to the anterior abdominal wall."
    ),
    stem="Which of the following is this fatty apron?",
    options=[
        "The fold lying in front of the intestine and transverse colon",
        "The fold that anchors the liver to the anterior wall",
        "The vertical band that tethers jejunum and ileum posteriorly",
        "The fold from the liver to the lesser curvature of the stomach",
        "The mesentery of the transverse and sigmoid colon only",
    ],
    key=0,
    whys=[
        "The greater omentum is the apron superficial to the small intestine and transverse colon and a place where fat is stored. The surgeon sees that apron and has already excluded the liver's anterior fold.",
        "The falciform ligament anchors the liver to the anterior abdominal wall. The vignette says this apron is not that fold.",
        "The mesentery is the vertical band that anchors jejunum and ileum. It is not an apron in front of the transverse colon.",
        "The lesser omentum runs from the liver to the lesser curvature. It is not the fatty apron over the intestine.",
        "The mesocolon attaches the transverse and sigmoid colon. It is not the apron lying superficial to them.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="mesentery-jejunum-ileum",
    task="anatomy", difficulty=3, src="os-23-1", nutrition=False,
    fact="The mesentery anchors all of the small intestine except the duodenum. The duodenum, pancreas, ascending colon, descending colon, and rectum are retroperitoneal.",
    forbid=["mesentery"],
    vignette=(
        "A 41-year-old woman who teaches ceramics has a 3-cm mass at the start of the small intestine, just after "
        "the stomach. Temperature is 36.7°C, pulse is 78/min, respirations are 14/min, and blood pressure is "
        "116/72 mm Hg. At operation that first segment lies behind the peritoneum and is fixed. A loop 40 cm "
        "farther along is free and hung from a vertical peritoneal band attached to the posterior wall."
    ),
    stem="Which of the following accounts for the difference between the two segments?",
    options=[
        "Only the first segment stays fixed outside the peritoneal sac",
        "Both segments hang inside the fatty apron over the bowel",
        "The free loop is fixed by the liver's anterior fold",
        "The first segment is mobile and the downstream loop is not",
        "Both segments lack any peritoneal attachment at all",
    ],
    key=0,
    whys=[
        "The duodenum is retroperitoneal, and the mesentery anchors the rest of the small intestine. The mass is in the first segment, which is fixed behind the peritoneum, while the loop 40 cm downstream hangs from the posterior band.",
        "The greater omentum is an apron over the intestine. It is not the band that frees one segment and fixes the other.",
        "The falciform ligament anchors the liver, not a jejunal loop.",
        "The first segment is the fixed, retroperitoneal one. The downstream loop is the mobile one.",
        "The downstream loop has a peritoneal band. It is not unattached.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="sma-small-bowel",
    task="anatomy", difficulty=3, src="os-23-5", nutrition=False,
    fact="The superior mesenteric artery is the main arterial supply of the small intestine. Its veins drain to the superior mesenteric vein and then the hepatic portal vein.",
    forbid=["mesenteric"],
    vignette=(
        "A 68-year-old man who repairs watches has pain 30 minutes after meals and a 5-kg weight loss. Temperature "
        "is 36.6°C, pulse is 84/min, respirations are 16/min, and blood pressure is 150/86 mm Hg. Angiography "
        "shows a tight narrowing of the artery that is the main supply of the jejunum and ileum. The artery to "
        "the liver and stomach is open. Veins beside the narrowed artery still join a vessel that enters the liver."
    ),
    stem="Which of the following is the main territory of the narrowed artery?",
    options=[
        "Jejunum and ileum, with venous blood still reaching the liver",
        "Liver and stomach, with no direct supply to the jejunum",
        "Descending colon and rectum, and not the small bowel",
        "Both kidneys and both ureters, rather than a gut artery",
        "The spleen alone, by way of the short gastric branches",
    ],
    key=0,
    whys=[
        "The superior mesenteric artery is the main supply of the small intestine, and the superior mesenteric vein drains into the portal vein and the liver. The liver-and-stomach artery is open, and the narrowed vessel is the one to jejunum and ileum.",
        "The celiac trunk supplies liver and stomach and is described as open.",
        "The inferior mesenteric artery supplies the distal colon. The vignette specifies jejunum and ileum.",
        "Renal arteries are paired and do not drain into the portal vein.",
        "Short gastric arteries are not the main supply of the jejunum and ileum.",
    ],
)

add(
    domain="gastrointestinal", subject="pathology", topic="perforated-ulcer-peritonitis",
    task="mechanism", difficulty=2, src="os-23-1", nutrition=False,
    fact="Chemical peritonitis follows a breach of the alimentary canal, for example when a gastric ulcer perforates and spills gastric juice into the peritoneal cavity.",
    forbid=["peritonitis"],
    vignette=(
        "A 52-year-old man who drives a cement mixer has sudden severe abdominal pain. Temperature is 38.1°C, "
        "pulse is 118/min, respirations are 24/min, and blood pressure is 96/60 mm Hg. The abdomen is rigid. "
        "An upright film shows free air under the diaphragm. At operation a hole in the anterior stomach wall "
        "is spilling acidic fluid into the peritoneal cavity. The fluid has no blood."
    ),
    stem="Which of the following is the immediate cause of the rigid abdomen?",
    options=[
        "Gastric juice spilled onto the serosal lining around the organs",
        "Blood filling that same space from a ruptured spleen",
        "Lymphoid aggregates enlarging in the final small-bowel part",
        "Failure of bile salts to be taken up in the final segment",
        "Loss of the extra inner muscle layer of the stomach",
    ],
    key=0,
    whys=[
        "When an ulcer perforates, gastric juice spills into the peritoneal cavity and causes chemical peritonitis. He has free air, a hole in the stomach, acidic fluid in the peritoneum, and a rigid abdomen. The fluid has no blood.",
        "Hemorrhagic peritonitis follows blood in the peritoneum, as from splenic injury. This fluid is acidic and bloodless.",
        "Peyer patches are lymphoid aggregates in the ileum. They do not spill acid or put free air under the diaphragm.",
        "Loss of ileal bile-salt uptake causes greasy stools over time. It does not perforate the stomach.",
        "The oblique layer churns food. Its absence would not put free air and acid in the peritoneum.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="low-ph-stops-acid",
    task="mechanism", difficulty=3, src="os-23-4", nutrition=False,
    fact="When luminal pH falls too low, the stomach suspends hydrochloric acid secretion and increases mucus secretion.",
    forbid=["suspend"],
    vignette=(
        "A 33-year-old woman who designs typefaces is studied after a protein meal. Temperature is 36.6°C, pulse "
        "is 72/min, respirations are 14/min, and blood pressure is 110/68 mm Hg. When luminal pH in the stomach "
        "reaches 1.6, acid secretion stops and mucus secretion rises. Parietal cells are still present on biopsy."
    ),
    stem="Which of the following is this response to the very low pH?",
    options=[
        "Acid secretion pauses and mucus secretion increases",
        "Acid secretion rises further until the pH reaches 0.5",
        "Pepsinogen granules are released from parietal cells",
        "The hunger hormone from the fundus increases further",
        "Bile salts are newly synthesized inside chief cells",
    ],
    key=0,
    whys=[
        "When pH falls too low, the stomach suspends hydrochloric acid secretion and increases mucus. Her pH is 1.6, acid output has stopped, mucus has risen, and parietal cells are still present, so the cells were not lost.",
        "The observed change is a stop in acid secretion, not a further rise.",
        "Chief cells, not parietal cells, store pepsinogen. The response described is about acid and mucus.",
        "Ghrelin rises in the fasting state. A luminal pH of 1.6 after a protein meal is not a fasting signal.",
        "Hepatocytes make bile salts. Chief cells do not.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="islet-hormones",
    task="mechanism", difficulty=2, src="os-23-6", nutrition=False,
    fact="Islets of Langerhans produce insulin, glucagon, somatostatin, and pancreatic polypeptide. Acini produce the digestive enzymes.",
    forbid=["islet", "langerhans"],
    vignette=(
        "A 15-year-old boy who plays clarinet has a 1.1-cm mass in the tail of a gland that lies behind the "
        "stomach. Temperature is 36.7°C, pulse is 84/min, respirations are 16/min, and blood pressure is "
        "108/66 mm Hg. The mass is a cluster of endocrine cells scattered among enzyme-secreting acini. The "
        "endocrine cells are the source of the hormone that lowers blood glucose, plus three other hormones "
        "from the same clusters."
    ),
    stem="Which of the following sets of products comes from these endocrine clusters?",
    options=[
        "Insulin, glucagon, somatostatin, and pancreatic polypeptide",
        "Amylase, lipase, trypsinogen, and ductal bicarbonate",
        "Pepsinogen, hydrochloric acid, and intrinsic factor",
        "Bile salts, bilirubin, and the phospholipid lecithin",
        "Gastrin, ghrelin, and histamine from the gastric mucosa",
    ],
    key=0,
    whys=[
        "The islets make insulin, glucagon, somatostatin, and pancreatic polypeptide. They sit among the enzyme-secreting acini. Insulin is the hormone that lowers blood glucose, and the mass is in the pancreatic tail.",
        "Amylase, lipase, and trypsinogen come from acini, and bicarbonate from duct cells. Those are the exocrine products surrounding the cluster, not the endocrine set.",
        "Pepsinogen, acid, and intrinsic factor are gastric. This mass is in the gland behind the stomach.",
        "Bile salts, bilirubin, and lecithin are components of bile made by the liver.",
        "Gastrin, ghrelin, and histamine are gastric mucosal signals, not the four islet products.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="sphincter-of-oddi",
    task="anatomy", difficulty=3, src="os-23-5", nutrition=False,
    fact="The hepatopancreatic sphincter regulates flow of both bile and pancreatic juice from the ampulla into the duodenum.",
    forbid=["oddi", "ampulla"],
    vignette=(
        "A 49-year-old woman who leads museum tours has pain and a dilated duct system after a fatty meal. "
        "Temperature is 36.8°C, pulse is 88/min, respirations are 16/min, and blood pressure is 126/78 mm Hg. "
        "Imaging shows that the bile duct and the main pancreatic duct meet in the duodenal wall, and a smooth "
        "muscle ring at that meeting point does not open. Neither bile nor pancreatic juice enters the duodenum. "
        "The gallbladder wall itself contracts."
    ),
    stem="Which of the following is the role of the muscle ring that failed to open?",
    options=[
        "It controls release of both bile and pancreatic juice",
        "It controls only gastric emptying into the duodenum",
        "It is the voluntary outer ring of the anal canal",
        "It concentrates bile by absorbing water from it",
        "It secretes bicarbonate from pancreatic duct cells",
    ],
    key=0,
    whys=[
        "The hepatopancreatic sphincter controls flow of bile and pancreatic juice from their shared ampulla into the duodenum. Both fluids are blocked, the ducts meet in the duodenal wall, and the gallbladder is still able to contract.",
        "The pyloric sphincter controls gastric emptying. It does not sit where the bile duct meets the pancreatic duct.",
        "The external anal sphincter is voluntary skeletal muscle at the anus.",
        "The gallbladder mucosa concentrates bile. The vignette says the gallbladder does contract. The blocked ring is at the duodenal meeting point.",
        "Duct cells secrete bicarbonate. They are not the muscle ring that failed to open.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="santorini-accessory-duct",
    task="anatomy", difficulty=4, src="os-23-6", nutrition=False,
    fact="The accessory pancreatic duct, when present, enters the duodenum about an inch above the hepatopancreatic ampulla and is a remnant of pancreatic development.",
    forbid=["santorini", "accessory duct"],
    vignette=(
        "A 28-year-old man who builds bicycles has a scan after a minor abdominal injury. Temperature is 36.5°C, "
        "pulse is 70/min, respirations are 14/min, and blood pressure is 118/74 mm Hg. The main pancreatic duct "
        "joins the bile duct at the major papilla. A second, smaller duct from the same gland enters the duodenum "
        "on its own, about 2.5 cm proximal to that papilla. No stone is seen."
    ),
    stem="Which of the following best describes the smaller duct?",
    options=[
        "A developmental remnant that can enter above the main opening",
        "The cystic duct draining the gallbladder into the bile duct",
        "The common hepatic duct before it meets the cystic duct",
        "The duct that carries bile salts back from the ileum",
        "A colonic crypt that secretes mucus into the lumen",
    ],
    key=0,
    whys=[
        "The accessory pancreatic duct, when present, runs into the duodenum about an inch above the main ampulla and is a remnant of pancreatic development. This smaller duct enters about 2.5 cm proximal to the major papilla, separate from the bile duct.",
        "The cystic duct connects the gallbladder to the bile duct. It does not enter the duodenum on its own above the papilla.",
        "The common hepatic duct is formed by the right and left hepatic ducts and has not yet met the cystic duct. It is not a second opening into the duodenum.",
        "Bile salts return from the ileum in portal blood, not in a duct that opens above the papilla.",
        "Colonic crypts secrete mucus. They are not a pancreatic duct.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="which-colon-is-retroperitoneal",
    task="anatomy", difficulty=3, src="os-23-5", nutrition=False,
    fact="The ascending colon, descending colon, and rectum are retroperitoneal. The transverse and sigmoid colon are suspended by mesocolon.",
    forbid=["retroperitoneal"],
    vignette=(
        "A 57-year-old woman who catalogs fossils has adhesions mapped before a second operation. Temperature "
        "is 36.6°C, pulse is 76/min, respirations are 14/min, and blood pressure is 124/74 mm Hg. The colon that "
        "runs up the right side and the colon that runs down the left side are fixed behind the peritoneum. The "
        "segment that crosses the upper abdomen and the S-shaped pelvic segment both hang from peritoneal folds."
    ),
    stem="Which of the following segments are the fixed ones?",
    options=[
        "The ascending colon together with the descending colon",
        "The transverse colon together with the sigmoid colon",
        "The jejunum together with the ileum on their mesentery",
        "The stomach along its greater and lesser curvatures",
        "The cecum alone, while the ascending colon stays free",
    ],
    key=0,
    whys=[
        "The ascending and descending colon, and the rectum, lie behind the peritoneum. The transverse and sigmoid colon are hung by mesocolon. Her right-sided upward segment and left-sided downward segment are the fixed ones.",
        "Those two segments are the ones described as hanging from folds, so they are not the fixed pair.",
        "Jejunum and ileum are suspended by mesentery. They are not the right and left colonic segments.",
        "The stomach is covered by peritoneum and held by omenta. It is not fixed behind the peritoneum on both sides of the abdomen.",
        "The ascending colon is one of the fixed segments, not a free one.",
    ],
)

add(
    domain="gastrointestinal", subject="histology", topic="colon-no-villi",
    task="histology", difficulty=2, src="os-23-5", nutrition=False,
    fact="The colon has no circular folds or villi. Its glands are rich in goblet cells, which secrete mucus. Few enzyme-secreting cells are present.",
    forbid=["goblet"],
    vignette=(
        "A 62-year-old man who teaches drafting has biopsies labeled A and B. Temperature is 36.5°C, pulse is "
        "70/min, respirations are 14/min, and blood pressure is 128/76 mm Hg. Slide A shows tall vascular "
        "projections and a fuzzy apical border. Slide B shows a flat simple columnar lining, no projections, "
        "and glands packed with mucus cells. Almost no enzyme-secreting cells are on slide B."
    ),
    stem="Which of the following is slide B?",
    options=[
        "Large intestine, which lubricates and makes almost no enzymes",
        "Proximal jejunum, where most nutrient absorption occurs",
        "Gastric body, with acid cells midway in the glands",
        "Gallbladder lining, which concentrates stored bile",
        "Esophagus, lined by several layers of flat cells",
    ],
    key=0,
    whys=[
        "The colon lacks circular folds and villi, has abundant goblet cells that secrete mucus, and has few enzyme-secreting cells. Slide B is flat, full of mucus cells, and poor in enzyme cells. Slide A, with projections and a fuzzy border, is small intestine.",
        "The proximal jejunum has villi and a brush border, which is slide A, not slide B.",
        "The gastric body has parietal cells and pits, not a flat mucosa dominated by mucus glands without villi in this paired comparison.",
        "The gallbladder has rugae and no submucosa and concentrates bile. It is not the enzyme-poor glandular mucosa contrasted with villi.",
        "The esophagus is stratified squamous. Slide B is simple columnar.",
    ],
)

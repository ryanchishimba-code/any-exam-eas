# Batch 1, items 1–25. Facts are limited to sections opened on 2026-11-28.

add(
    domain="gastrointestinal", subject="physiology", topic="myenteric-plexus-motility",
    task="mechanism", difficulty=2, src="os-23-1", nutrition=False,
    fact="The myenteric plexus lies in the muscularis and is responsible for motility, especially the rhythm and force of muscularis contractions.",
    forbid=["myenteric", "auerbach"],
    vignette=(
        "A 46-year-old woman who packs produce at a grocery warehouse comes to the clinic because of cramping "
        "pain that starts about 30 minutes after large meals. She has not vomited. Temperature is 36.7°C, pulse "
        "is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. The abdomen is soft. A biopsy "
        "from the jejunal wall shows an intact network of neurons lying between the inner circular smooth-muscle "
        "layer and the outer longitudinal layer."
    ),
    stem="Which of the following is the principal function of this nerve network?",
    options=[
        "Setting the rhythm and force of muscularis contractions",
        "Regulating digestive secretions inside the submucosa",
        "Carrying sharp pain from the parietal peritoneum",
        "Absorbing digested lipid into lymphatic capillaries",
        "Secreting alkaline mucus onto the surface epithelium",
    ],
    key=0,
    whys=[
        "These neurons sit in the muscularis between the circular and longitudinal layers, which is the plexus that sets the rhythm and force of muscularis contraction. The biopsy shows that network intact.",
        "Secretion is regulated by the plexus in the submucosa, not by neurons lying between the two muscle layers.",
        "The biopsy is an intramural nerve network. It is not a somatic pain fiber from the parietal peritoneum.",
        "Lipid absorption is a function of lymphatic capillaries in villi, not of neurons between muscle layers.",
        "Surface mucus is secreted by epithelial cells. The structure in the biopsy is a nerve network in the muscle wall.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="submucosal-plexus-secretion",
    task="mechanism", difficulty=2, src="os-23-1", nutrition=False,
    fact="The submucosal plexus lies in the submucosa and regulates digestive secretions and the response to food.",
    forbid=["meissner", "submucosal plexus"],
    vignette=(
        "A 38-year-old man who repairs elevators is evaluated for watery diarrhea that began 6 weeks ago. He has "
        "lost 2 kg. Temperature is 36.9°C, pulse is 88/min, respirations are 16/min, and blood pressure is "
        "122/70 mm Hg. Stool studies show no leukocytes. A duodenal biopsy shows preserved epithelium and a dense "
        "nerve network located in the connective-tissue layer directly beneath the mucosa, above the muscle coat."
    ),
    stem="Which of the following functions is controlled by the nerve network in this layer?",
    options=[
        "Control of glandular secretion when food is in the lumen",
        "Rhythm and force of contraction in the outer muscle coat",
        "Voluntary closure of the skeletal ring at the anus",
        "Carriage of absorbed sugars into the lymph capillary",
        "Engulfment of bacteria along the channels of the liver",
    ],
    key=0,
    whys=[
        "The nerve network immediately beneath the mucosa is the submucosal plexus, which regulates digestive secretions and reacts to food. The biopsy places it in that layer.",
        "Rhythm and force of muscularis contraction are controlled by the plexus inside the muscle coat, not by the network above that coat.",
        "The external anal sphincter is skeletal muscle under voluntary control. This biopsy is from the duodenal wall.",
        "Sugars enter blood capillaries in villi. Lacteals carry lipids. Neither is a nerve network under the mucosa.",
        "Phagocytic cells in liver sinusoids are not a duodenal submucosal nerve network.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="sympathetic-slows-gut",
    task="mechanism", difficulty=2, src="os-23-1", nutrition=False,
    fact="Sympathetic activation restricts enteric neurons and decreases GI secretion and motility. Parasympathetic activation increases both.",
    forbid=["sympathetic", "parasympathetic"],
    vignette=(
        "A 29-year-old woman who drives an ambulance is brought in 20 minutes after a highway crash in which she "
        "was the uninjured driver of a second vehicle. She is pale, anxious, and has not eaten for 9 hours. "
        "Temperature is 36.8°C, pulse is 118/min, respirations are 22/min, and blood pressure is 148/90 mm Hg. "
        "Bowel sounds are scarce. Her hands are cold. No abdominal tenderness is present."
    ),
    stem="Which of the following best accounts for the quiet bowel sounds?",
    options=[
        "Fight-or-flight signals restrict enteric neuron activity",
        "Rest-and-digest signals increase enteric secretion and motility",
        "A mucosal ulcer has spilled acid into the peritoneum",
        "The pyloric sphincter is being relaxed by gastrin",
        "Bile salts are being reabsorbed from the terminal ileum",
    ],
    key=0,
    whys=[
        "She is tachycardic, pale, and cold-handed after a frightening crash, the fight-or-flight state. That state restricts enteric neurons and decreases secretion and motility, which fits scarce bowel sounds. The abdomen is not tender.",
        "Rest-and-digest signals increase secretion and motility. That would make bowel sounds more active, not scarce, and it does not fit this pulse and blood pressure.",
        "Chemical peritonitis follows a breach of the gut wall. She has no abdominal tenderness and was not injured.",
        "Gastrin promotes gastric emptying and intestinal contraction. It does not silence bowel sounds in an uneaten, frightened patient.",
        "Ileal reabsorption of bile salts is a normal digestive step. She has not eaten for 9 hours, and that step does not quiet the bowel.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="lacteal-lipid-absorption",
    task="mechanism", difficulty=3, src="os-23-5", nutrition=True,
    fact="Carbohydrate and protein breakdown products enter villus blood capillaries. Lipid breakdown products are absorbed by lacteals and travel through lymph.",
    forbid=["lacteal"],
    vignette=(
        "A 52-year-old man who cooks in a hotel kitchen is seen for greasy, pale stools and a 4-kg weight loss "
        "over 2 months. Temperature is 36.6°C, pulse is 80/min, respirations are 14/min, and blood pressure is "
        "130/78 mm Hg. A small-bowel biopsy shows normal enterocytes. The lymphatic capillary in the core of "
        "each villus is distorted, and the blood capillaries in the same villi look open."
    ),
    stem="Which of the following is the most likely consequence of this villus finding?",
    options=[
        "Digested fats fail to leave the mucosa through lymph",
        "Amino acids cannot enter the villus blood capillary",
        "Glucose absorption stops because the brush border is gone",
        "Pepsin remains active throughout the duodenal lumen",
        "Bicarbonate secretion from the stomach surface increases",
    ],
    key=0,
    whys=[
        "Lipid breakdown products leave the intestine through the lymphatic capillary in the villus. That channel is distorted, and the greasy pale stools fit failed fat absorption. The blood capillaries are described as open, and the enterocytes are normal.",
        "Amino acids enter the villus blood capillary. Those capillaries are open, so this finding does not block them.",
        "The enterocytes are normal, so the brush border is not described as absent. Glucose uses the blood capillary, which is open.",
        "Pepsin is a gastric enzyme inactivated when duodenal pH rises. The biopsy is about villus lymphatics, not luminal pH.",
        "Surface bicarbonate mucus is a gastric barrier function. It is not the lymphatic capillary inside a villus.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="peyer-patches-ileum",
    task="histology", difficulty=2, src="os-23-1", nutrition=False,
    fact="Lymphocyte clusters in the lamina propria are especially large in the distal ileum, where they are Peyer patches.",
    forbid=["peyer"],
    vignette=(
        "A 19-year-old man who lifeguards at a lake is evaluated after 3 days of cramping and nonbloody diarrhea. "
        "Temperature is 37.4°C, pulse is 90/min, respirations are 16/min, and blood pressure is 110/68 mm Hg. "
        "The abdomen is soft. A biopsy labeled as distal ileum shows large lymphoid aggregates in the loose "
        "connective tissue directly under the epithelium, inside the mucosa."
    ),
    stem="Which of the following is the layer and site that normally contain these large lymphoid aggregates?",
    options=[
        "Supporting coat of the lining in the final small-bowel part",
        "Slippery outer coat on the front wall of the stomach",
        "Extra inner muscle layer found only in the stomach",
        "Dense collagen sheath around the thoracic esophagus",
        "A layer the sac under the liver does not possess",
    ],
    key=0,
    whys=[
        "The large lymphoid aggregates under the epithelium are the clusters housed in the lamina propria, and they are particularly substantial in the distal ileum. The specimen is labeled distal ileum and shows them in that mucosal connective tissue.",
        "The serosa is the outer peritoneal coat. These aggregates are inside the mucosa, under the epithelium.",
        "The oblique muscle is an extra gastric muscle layer. It is not a lymphoid aggregate in the ileal mucosa.",
        "The esophagus is wrapped in adventitia rather than serosa. That sheath is not ileal mucosal lymphoid tissue.",
        "The gallbladder wall has no submucosa. The biopsy is ileal mucosa, not gallbladder.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="esophagus-adventitia",
    task="anatomy", difficulty=3, src="os-23-1", nutrition=False,
    fact="The mouth, pharynx, and esophagus have adventitia, a dense collagen sheath, instead of serosa. Serosa is the visceral peritoneum on the abdominal alimentary canal.",
    forbid=["adventitia"],
    vignette=(
        "A 61-year-old man who teaches high-school woodshop has a 2-cm mass removed from the esophageal wall "
        "during an operation. Temperature is 36.5°C, pulse is 72/min, respirations are 14/min, and blood "
        "pressure is 134/80 mm Hg. The pathologist notes that the outermost layer of this specimen is a dense "
        "collagen sheath, and that a slippery peritoneal coat is absent. The mass itself is separate from that layer."
    ),
    stem="Which of the following best explains the outer layer of this specimen?",
    options=[
        "The esophagus is anchored by adventitia rather than serosa",
        "The stomach's outer coat is adventitia along both curvatures",
        "The jejunum lacks a peritoneal coat because it is retroperitoneal",
        "The transverse colon is fixed by adventitia to the diaphragm",
        "The gallbladder wall uses adventitia in place of a mucosa",
    ],
    key=0,
    whys=[
        "The mouth, pharynx, and esophagus have a dense collagen sheath called adventitia instead of serosa. This esophageal specimen shows that sheath and no peritoneal coat.",
        "The abdominal stomach is covered by serosa. Adventitia replaces serosa in the esophagus, not along the gastric curvatures.",
        "The jejunum and ileum are tethered by mesentery and have a peritoneal coat. The duodenum, not the jejunum, is the retroperitoneal part of the small intestine.",
        "The transverse colon is tethered by mesocolon and is intraperitoneal. Adventitia is the esophageal outer layer.",
        "The gallbladder has a mucosa and a smooth-muscle coat, with visceral peritoneum as its outer coat. It does not replace mucosa with adventitia.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="gastric-oblique-muscle",
    task="anatomy", difficulty=2, src="os-23-4", nutrition=False,
    fact="Besides circular and longitudinal layers, the gastric muscularis has an inner oblique smooth-muscle layer that lets the stomach churn food.",
    forbid=["oblique"],
    vignette=(
        "A 44-year-old woman who manages a florist shop undergoes resection of a 3-cm gastric mass. Temperature "
        "is 36.6°C, pulse is 74/min, respirations are 14/min, and blood pressure is 116/74 mm Hg. The muscular "
        "wall of the specimen has the usual circular and longitudinal layers plus a third smooth-muscle layer "
        "lying closest to the lumen. The small-bowel margin of the same specimen has only two muscle layers."
    ),
    stem="Which of the following is the function added by that third muscle layer?",
    options=[
        "Vigorous churning that mixes food with gastric juice",
        "Voluntary control of swallowing in the upper esophagus",
        "Formation of haustra by three longitudinal bands",
        "Concentration of bile by absorbing water from it",
        "Secretion of intrinsic factor into the gland lumen",
    ],
    key=0,
    whys=[
        "The stomach adds an inner oblique smooth-muscle layer so it can churn and mechanically break food down. The specimen shows that third layer only in the gastric wall.",
        "Skeletal muscle in the mouth, pharynx, and upper esophagus gives voluntary control of swallowing. The extra layer here is smooth muscle in the stomach.",
        "Haustra are pouches made by the three teniae coli of the colon. The small-bowel margin has two layers, and the third layer is gastric.",
        "The gallbladder mucosa concentrates bile by absorbing water. That is not a gastric muscle layer.",
        "Intrinsic factor is secreted by parietal cells, not by a muscle layer.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="retroperitoneal-pancreas",
    task="anatomy", difficulty=3, src="os-23-6", nutrition=False,
    fact="The pancreas lies transversely in the retroperitoneum behind the stomach. Its tail ends at the hilum of the spleen. The duodenum, ascending and descending colon, and rectum are also retroperitoneal.",
    forbid=["retroperitoneal"],
    vignette=(
        "A 57-year-old man who installs kitchen cabinets develops sudden upper abdominal pain after a 4-meter "
        "fall from a ladder, striking his left side. Temperature is 36.8°C, pulse is 104/min, respirations are "
        "20/min, and blood pressure is 98/64 mm Hg. Imaging shows fluid around a gland that lies behind the "
        "stomach, with its head in the C-shaped curve of the duodenum and its tapered end at the splenic hilum."
    ),
    stem="Which of the following describes the position of this gland?",
    options=[
        "It lies outside the peritoneal cavity, posterior to that organ",
        "It hangs in the greater omentum in front of the colon",
        "It is suspended from the liver by the falciform ligament",
        "It sits inside the peritoneal cavity wrapped in mesentery",
        "It is an intraperitoneal pouch attached to the cecum",
    ],
    key=0,
    whys=[
        "The gland behind the stomach, with its head in the duodenal curve and its tail at the splenic hilum, is the pancreas. It lies in the retroperitoneum.",
        "The greater omentum is an apron over the small intestine and transverse colon. The pancreas is behind the stomach, not inside that apron.",
        "The falciform ligament anchors the liver to the anterior abdominal wall. It does not suspend the pancreas.",
        "Jejunum and ileum are wrapped by mesentery inside the peritoneal cavity. The pancreas is retroperitoneal.",
        "The appendix is the winding tube attached to the cecum. The described gland spans from the duodenum to the spleen.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="celiac-trunk-foregut",
    task="anatomy", difficulty=3, src="os-23-1", nutrition=False,
    fact="The celiac trunk supplies the liver, stomach, and duodenum. The superior and inferior mesenteric arteries supply the remaining small and large intestines.",
    forbid=["celiac trunk", "mesenteric"],
    vignette=(
        "A 63-year-old man who keeps bees has severe epigastric pain 40 minutes after a large meal. Temperature "
        "is 36.7°C, pulse is 96/min, respirations are 18/min, and blood pressure is 158/88 mm Hg. Angiography "
        "shows a tight narrowing of the unpaired artery that leaves the abdominal aorta just below the diaphragm "
        "and sends branches toward the liver, the stomach, and the first part of the small intestine. The arteries "
        "to the jejunum are patent."
    ),
    stem="Which of the following organs is supplied by the narrowed artery?",
    options=[
        "The liver, the stomach, and the duodenum",
        "The jejunum, the ileum, and the ascending colon",
        "The descending colon, sigmoid colon, and rectum",
        "The spleen alone, with no branches to the stomach",
        "The kidneys and both suprarenal glands alone",
    ],
    key=0,
    whys=[
        "The unpaired artery just below the diaphragm that serves the liver, stomach, and duodenum is the celiac trunk. The jejunal arteries are described as patent, so the pain pattern follows the narrowed trunk.",
        "The remaining small intestine and much of the colon are supplied by the mesenteric arteries. Those jejunal arteries are patent.",
        "The distal colon is supplied by the inferior mesenteric artery, not by the trunk to the liver, stomach, and duodenum.",
        "The same trunk that reaches the liver and stomach also participates in splenic supply, but the stem's artery is defined by branches to liver, stomach, and duodenum, not by spleen alone.",
        "The kidneys are supplied by paired renal arteries, not by the unpaired artery to the liver, stomach, and duodenum.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="falciform-umbilical-vein",
    task="anatomy", difficulty=3, src="os-23-6", nutrition=False,
    fact="The falciform ligament and the ligamentum teres hepatis are remnants of the umbilical vein and separate the right and left lobes anteriorly.",
    forbid=["falciform", "umbilical"],
    vignette=(
        "A 34-year-old woman who designs costumes is undergoing laparoscopy for a 2-cm liver-surface nodule. "
        "Temperature is 36.5°C, pulse is 78/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. "
        "The surgeon identifies a peritoneal fold that anchors the liver to the anterior abdominal wall and the "
        "diaphragm and separates the right and left lobes on the front of the liver. A cord in its free edge "
        "runs toward the umbilicus."
    ),
    stem="Which of the following is the developmental origin of that cord?",
    options=[
        "A remnant of the umbilical vein",
        "A remnant of the vitelline duct",
        "A remnant of the allantoic urachus",
        "A remnant of the ductus arteriosus",
        "A remnant of the septum transversum only",
    ],
    key=0,
    whys=[
        "The fold that anchors the liver to the anterior wall and diaphragm and separates the lobes anteriorly is the falciform ligament. It and the round ligament in its free edge are remnants of the umbilical vein.",
        "A vitelline-duct remnant is the explanation for a Meckel diverticulum on the ileum, not for the cord on the anterior liver.",
        "A urachal remnant runs from the bladder dome toward the umbilicus. This cord is in the liver's anterior peritoneal fold.",
        "The ductus arteriosus connects the pulmonary trunk to the aorta in fetal life. It is not a cord on the liver.",
        "The liver's peritoneal attachments are not described as a remnant of the septum transversum alone. The opened source identifies this cord as an umbilical-vein remnant.",
    ],
)

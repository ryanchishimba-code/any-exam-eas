# Batch 3. Digestion processes from OpenStax 23.2, and early sex development from 27.3.

add(
    domain="gastrointestinal", subject="physiology", topic="six-digestive-activities",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="The six digestive activities are ingestion, propulsion, mechanical digestion, chemical digestion, absorption, and defecation.",
    forbid=["defecation"],
    vignette=(
        "A 19-year-old student lists what the gut does with a meal. Temperature is 36.6°C, pulse is 72/min, "
        "respirations are 14/min, and blood pressure is 112/70 mm Hg. Food enters at the mouth, is moved along, "
        "is broken up physically and chemically, nutrients cross into the body, and the residue leaves."
    ),
    stem="Which of the following is the last of those activities?",
    options=[
        "Removal of the undigested residue from the body",
        "Entry of food into the canal through the mouth",
        "Waves that move the meal even if the person is inverted",
        "Uptake of nutrients across the small-bowel lining",
        "Chewing that increases surface area without a chemical change",
    ],
    key=0,
    whys=[
        "The six activities end with defecation, removal of undigested material as feces. Entry is ingestion, movement is propulsion, chewing is mechanical digestion, and nutrient uptake is absorption.",
        "Entry at the mouth is ingestion, the first activity.",
        "Movement by peristalsis is propulsion. It continues even if a person is inverted, but it is not the last step.",
        "Absorption, mainly in the small intestine, comes before the residue is eliminated.",
        "Chewing is mechanical digestion. It does not change the chemical nature of the food.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="swallowing-last-voluntary",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Swallowing is the last voluntary act of digestion until defecation. Propulsion includes voluntary swallowing and involuntary peristalsis.",
    forbid=["voluntary"],
    vignette=(
        "A 22-year-old man swallows a bite of bread. Temperature is 36.6°C, pulse is 70/min, respirations are "
        "14/min, and blood pressure is 118/74 mm Hg. He chose to start the swallow. After the bite enters the "
        "esophagus he cannot choose each later wave. The next act he can choose is elimination."
    ),
    stem="Which of the following is the next act he can choose?",
    options=[
        "Removal of what was not absorbed, after the involuntary waves",
        "Each peristaltic wave along the small intestine",
        "Secretion of acid once the stomach is already full",
        "Segmentation, which he can start and stop at will",
        "Bile release, which he times with each contraction",
    ],
    key=0,
    whys=[
        "Swallowing is the last voluntary act until defecation. Peristalsis after that is involuntary. He can next choose elimination, not each wave.",
        "Peristalsis is involuntary sequential contraction and relaxation.",
        "Acid secretion is a reflex and hormonal response, not the next voluntary act.",
        "Segmentation is local circular-muscle mixing. It is not under voluntary start and stop.",
        "Bile release is hormonal and neural. He does not time it himself.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="peristalsis-works-inverted",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Peristalsis is sequential waves of contraction and relaxation that propel food. It is powerful enough that swallowed material enters the stomach even if the person is standing on their head.",
    forbid=["inverted", "head"],
    vignette=(
        "A 24-year-old gymnast swallows water while upside down. Temperature is 36.6°C, pulse is 84/min, "
        "respirations are 16/min, and blood pressure is 110/68 mm Hg. Alternating waves of contraction and "
        "relaxation still carry the water to the stomach. Gravity is not required."
    ),
    stem="Which of the following moves the water in that position?",
    options=[
        "Sequential muscle waves that do not need gravity",
        "Gravity alone, which is reversed in that position",
        "Chewing, which changes the chemical bonds in water",
        "Absorption across the stomach lining before any wave",
        "A long reflex that starts only after the water is tasted",
    ],
    key=0,
    whys=[
        "Peristalsis is alternating contraction and relaxation and can move a swallow into the stomach even if the person is inverted. Gravity is not required.",
        "Gravity is reversed when she is upside down, so it cannot be what delivers the water to the stomach.",
        "Mechanical digestion does not change chemical bonds. Water is not broken down by chewing.",
        "Some absorption can occur in the stomach, but the water still has to be propelled there.",
        "Taste can start a long reflex for secretion. It is not the propulsive wave.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="mechanical-no-chemical-change",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Mechanical digestion is physical. It does not change the chemical nature of food. It increases surface area and mobility. Chewing and stomach churning are examples. Chyme is the acidic soup.",
    forbid=["mechanical", "chemical nature"],
    vignette=(
        "A 28-year-old woman chews a piece of bread, then the stomach churns it. Temperature is 36.6°C, pulse "
        "is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. The pieces get smaller and more "
        "surface is exposed. The bonds of the starch are not yet split by that churning alone."
    ),
    stem="Which of the following did the churning accomplish?",
    options=[
        "Finer bits and more area, without breaking chemical bonds",
        "Complete breakdown of starch into separate sugars",
        "Uptake of those sugars into the lymph vessels",
        "Removal of whatever had never been absorbed",
        "Secretion of bicarbonate out of the pancreas",
    ],
    key=0,
    whys=[
        "Mechanical digestion, including chewing and gastric churning, makes pieces smaller and increases surface area. It does not change the chemical nature of the food. Splitting starch is chemical digestion.",
        "Chemical digestion breaks complex molecules into building blocks. Churning alone does not do that.",
        "Lipids enter lacteals. That is absorption, and it is not what churning itself does.",
        "Defecation is removal of residue, later and elsewhere.",
        "Pancreatic bicarbonate neutralizes acidic chyme. It is not the effect of the churning.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="chemical-digestion-finished-small-bowel",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Chemical digestion starts in the mouth and is completed in the small intestine. Proteins are broken into amino acids as an example.",
    forbid=["completed", "small intestine"],
    vignette=(
        "A 31-year-old man has starch breakdown that started in the mouth. Temperature is 36.6°C, pulse is "
        "70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Protein splitting continues after "
        "the stomach. The building blocks are finished in the next long segment, not in the colon."
    ),
    stem="Which of the following is where chemical breakdown is finished?",
    options=[
        "The long segment that also absorbs most nutrients",
        "The mouth, where the process only begins",
        "The colon, which mainly dries the residue",
        "The esophagus, which only propels the bolus",
        "The gallbladder, which stores bile",
    ],
    key=0,
    whys=[
        "Chemical digestion begins in the mouth and is completed in the small intestine, which is also where most absorption occurs. The colon is not where chemical breakdown is finished.",
        "The mouth starts carbohydrate and some lipid breakdown. It does not finish it.",
        "The large intestine absorbs residual water, electrolytes, and bacterial vitamins and propels feces. It is not the site that completes chemical digestion.",
        "The esophagus propels food to the stomach. It does not finish chemical digestion.",
        "The gallbladder stores and concentrates bile. Chemical digestion of the meal is completed in the small intestine.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="lipids-enter-lacteals",
    task="mechanism", difficulty=3, src="os-23-2", nutrition=False,
    fact="Most nutrients cross the mucosa into the blood. Lipids are absorbed into lacteals and travel in lymph to the blood at the subclavian veins near the heart.",
    forbid=["lacteal", "subclavian"],
    vignette=(
        "A 36-year-old woman absorbs a fatty meal. Temperature is 36.6°C, pulse is 76/min, respirations are "
        "14/min, and blood pressure is 118/72 mm Hg. Sugars and amino acids enter blood capillaries in the "
        "lining. The fats instead enter blind-ended vessels and reach the blood only later, near the heart."
    ),
    stem="Which of the following path do the fats take?",
    options=[
        "Lymph vessels that join the blood near the heart",
        "The same capillaries that take up the sugars immediately",
        "The colon, which absorbs most dietary fat",
        "The stomach, which finishes fat breakdown",
        "Bile canaliculi, which return fat to the liver at once",
    ],
    key=0,
    whys=[
        "Lipids are absorbed into lacteals and travel in lymph to the bloodstream at the subclavian veins near the heart. Sugars and amino acids enter blood capillaries. She has that split.",
        "Most non-fat nutrients enter blood in the mucosa. Fats do not take that immediate capillary path.",
        "The large intestine is not the main site of fat absorption.",
        "The stomach begins protein breakdown and absorbs some fat-soluble substances such as alcohol and aspirin. It does not deliver meal fat into lymph.",
        "Bile salts from the liver emulsify lipids. Absorbed fats do not return at once through bile canaliculi.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="long-reflex-sight-of-food",
    task="mechanism", difficulty=3, src="os-23-2", nutrition=False,
    fact="Long reflexes use the central and autonomic nervous systems. Sight, smell, and taste send a signal to the medulla, which stimulates the stomach to secrete before food arrives. Short reflexes are local, as when distension increases secretion.",
    forbid=["medulla", "long reflex"],
    vignette=(
        "A 27-year-old man smells food and his stomach begins to secrete before he swallows. Temperature is "
        "36.6°C, pulse is 78/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. A sensory signal "
        "reaches the lower brainstem, which then drives the stomach. Food is not yet in the stomach."
    ),
    stem="Which of the following started the secretion?",
    options=[
        "A message through the lower brain, before food arrives",
        "Local stretch of the stomach wall by a meal already there",
        "Gastrin released only after protein is in the stomach",
        "Segmentation mixing chyme in the small bowel",
        "Elimination, the last act a person can choose",
    ],
    key=0,
    whys=[
        "Sight, smell, and taste start long reflexes. A sensory neuron signals the medulla oblongata, which stimulates gastric secretion before food arrives. His stomach is secreting from the smell alone.",
        "Distension of a stomach that already contains food starts a short, local reflex. Food has not arrived.",
        "Gastrin is secreted in response to food in the stomach. The meal is not there yet.",
        "Segmentation mixes contents in the small intestine. It is not this preparatory secretion.",
        "Defecation eliminates residue. It does not start gastric secretion from a smell.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="short-reflex-distension",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Short reflexes are run by nerve plexuses in the gut wall. Distension of the stomach increases local secretion. They do not require the brain.",
    forbid=["distension", "short reflex"],
    vignette=(
        "A 44-year-old woman has a full stomach. Temperature is 36.6°C, pulse is 72/min, respirations are "
        "14/min, and blood pressure is 126/78 mm Hg. Stretch of the wall makes nearby cells secrete more juice. "
        "The reflex stays in the wall of the stomach and does not travel to the brainstem."
    ),
    stem="Which of the following runs this reflex?",
    options=[
        "Nerve plexuses in the wall, without a trip to the brainstem",
        "A sensory neuron that must reach the medulla first",
        "Only the sight of food, with an empty stomach",
        "The hormone that the duodenum uses to release bicarbonate",
        "Chewing, which is still happening in the mouth",
    ],
    key=0,
    whys=[
        "Short reflexes are intrinsic plexuses in the alimentary wall. Stomach distension increases local secretion without a long trip through the central nervous system. Her full stomach is that stimulus.",
        "A path through the medulla is a long reflex, such as secretion started by sight or smell.",
        "Sight of food with an empty stomach is the long reflex, the opposite of wall stretch.",
        "Secretin from the duodenum causes pancreatic bicarbonate. It is not this local stretch reflex.",
        "Chewing is mechanical digestion in the mouth. The stomach is already full.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="gut-sensors-three-kinds",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="The gut wall has mechanoreceptors, chemoreceptors, and osmoreceptors for mechanical, chemical, and osmotic stimuli. They sense stretch, particle size, liquid, and nutrient type.",
    forbid=["osmoreceptor", "chemoreceptor"],
    vignette=(
        "A 39-year-old man has sensors in the stomach wall. Temperature is 36.6°C, pulse is 68/min, respirations "
        "are 14/min, and blood pressure is 124/76 mm Hg. One set responds to stretch, one to the chemical makeup "
        "of the meal, and one to how concentrated the liquid is. Those signals drive secretion and mixing."
    ),
    stem="Which of the following is sensed by the third set?",
    options=[
        "How strong the dissolved load in the lumen is",
        "Only the sight of food, outside the body",
        "How long a bone is at the growth plate",
        "The temperature of shower water on the skin",
        "Whether a research subject signed a consent form",
    ],
    key=0,
    whys=[
        "Osmoreceptors detect osmotic stimuli, including how much liquid is present and its concentration. Mechanoreceptors detect stretch and chemoreceptors detect chemical makeup and nutrient type. His third set is the osmotic one.",
        "Sight of food is an external stimulus for a long reflex, not a wall sensor.",
        "Growth-plate sensing is not a gastric receptor.",
        "Skin thermoreceptors start a sensory neural path. They are not in the stomach wall.",
        "Consent is a research-ethics step, not a gut sensor.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="gastrin-parietal-acid",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Gastrin is the main stomach hormone, secreted when food is present. It stimulates parietal cells to secrete gastric acid.",
    forbid=["gastrin", "parietal"],
    vignette=(
        "A 33-year-old man has food in his stomach. Temperature is 36.6°C, pulse is 74/min, respirations are "
        "14/min, and blood pressure is 122/74 mm Hg. A hormone from the stomach lining rises and the cells that "
        "make acid increase their secretion. The meal is already present."
    ),
    stem="Which of the following cells increase acid secretion?",
    options=[
        "The cells in the gastric wall that secrete acid",
        "The pancreatic cells that release bicarbonate",
        "The liver cells that make bile salts",
        "The colon cells that absorb residual water",
        "The duodenal cells that slow gastric emptying",
    ],
    key=0,
    whys=[
        "Gastrin, released when food is present, stimulates parietal cells of the stomach mucosa to secrete gastric acid. His meal is already in the stomach and acid secretion rises.",
        "Pancreatic bicarbonate secretion is stimulated by secretin, a duodenal hormone.",
        "Bile salts are a liver product. Gastrin does not make the liver the acid source.",
        "The large intestine absorbs residual water. It is not the acid-secreting target of gastrin.",
        "Gastric inhibitory peptide, from the duodenum, inhibits gastric secretion and slows emptying. It is not the hormone that increased acid.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="secretin-pancreatic-bicarbonate",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Secretin from the duodenum stimulates a watery bicarbonate secretion by the pancreas, which neutralizes acidic chyme.",
    forbid=["secretin", "bicarbonate"],
    vignette=(
        "A 37-year-old woman has acidic chyme entering the duodenum. Temperature is 36.6°C, pulse is 72/min, "
        "respirations are 14/min, and blood pressure is 116/70 mm Hg. A duodenal hormone makes the pancreas "
        "release a watery alkaline juice. The acid is neutralized so enzymes can work."
    ),
    stem="Which of the following does the pancreatic juice supply?",
    options=[
        "Alkali that neutralizes the acid coming from the stomach",
        "The acid itself, secreted by parietal cells",
        "Bile salts, which emulsify dietary fats",
        "The gastric factor required for vitamin B12",
        "The hormone that only slows gastric emptying down",
    ],
    key=0,
    whys=[
        "Secretin stimulates watery bicarbonate from the pancreas. That bicarbonate neutralizes acidic chyme and gives enzymes a better pH. Her duodenal hormone produced that alkaline juice.",
        "Parietal cells secrete gastric acid under gastrin. They are not the pancreatic response.",
        "Bile salts from the liver emulsify lipids. They are not the watery alkaline pancreatic juice.",
        "The gastric factor required for vitamin B12 is a stomach product, not pancreatic bicarbonate.",
        "Gastric inhibitory peptide slows gastric emptying and inhibits gastric secretion. It is not the alkali.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="cck-enzymes-and-bile",
    task="mechanism", difficulty=3, src="os-23-2", nutrition=False,
    fact="CCK from the duodenum stimulates pancreatic enzyme secretion and bile from the liver, and release of bile from the gallbladder.",
    forbid=["cholecystokinin", "cck"],
    vignette=(
        "A 41-year-old man has a fatty meal in the duodenum. Temperature is 36.6°C, pulse is 70/min, "
        "respirations are 14/min, and blood pressure is 128/80 mm Hg. A duodenal hormone makes the pancreas "
        "release enzymes and makes the gallbladder release stored bile. Acid neutralization is a different hormone."
    ),
    stem="Which of the following does this hormone release from the gallbladder?",
    options=[
        "Stored bile, along with pancreatic enzymes",
        "Only watery alkali, with neither enzymes nor bile",
        "Gastric acid secreted by the parietal cells",
        "The gastric factor required for vitamin B12",
        "Mucus whose only job is to ease passage through the colon",
    ],
    key=0,
    whys=[
        "CCK stimulates pancreatic enzymes and bile from the liver, and it releases bile stored in the gallbladder. Secretin is the separate hormone for watery bicarbonate. His fatty meal triggered the bile-and-enzyme hormone.",
        "Watery alkali without enzymes is the secretin response.",
        "Gastric acid is the gastrin effect on parietal cells.",
        "Intrinsic factor is secreted by the stomach for vitamin B12 absorption.",
        "Colonic mucus eases passage of feces. It is not the gallbladder release.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="gip-slows-emptying",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="Gastric inhibitory peptide inhibits gastric secretion and slows gastric emptying and motility.",
    forbid=["inhibitory peptide", "slows"],
    vignette=(
        "A 29-year-old woman has chyme in the duodenum. Temperature is 36.6°C, pulse is 74/min, respirations "
        "are 14/min, and blood pressure is 110/68 mm Hg. A duodenal hormone reduces acid secretion and slows "
        "the stomach's emptying. The stomach does not rush the rest of the meal forward."
    ),
    stem="Which of the following is the effect on the stomach?",
    options=[
        "Less acid secretion and slower emptying",
        "More acid secretion from parietal cells",
        "Faster emptying so the duodenum fills at once",
        "Release of stored bile from the gallbladder",
        "Completion of chemical digestion inside the stomach",
    ],
    key=0,
    whys=[
        "Gastric inhibitory peptide inhibits gastric secretion and slows gastric emptying and motility. Her duodenal hormone held the rest of the meal back and reduced acid.",
        "More acid is the gastrin effect, the opposite of this hormone.",
        "This hormone slows emptying. It does not speed it.",
        "Gallbladder bile release is a CCK effect.",
        "Chemical digestion is completed in the small intestine, not by this braking hormone inside the stomach.",
    ],
)

add(
    domain="gastrointestinal", subject="histology", topic="endocrinocytes-into-blood",
    task="histology", difficulty=2, src="os-23-2", nutrition=False,
    fact="GI hormones are secreted by endocrinocytes in the mucosal epithelium of the stomach and small intestine, then enter the bloodstream to reach their targets.",
    forbid=["endocrinocyte", "bloodstream"],
    vignette=(
        "A 26-year-old student looks at duodenal lining. Temperature is 36.6°C, pulse is 72/min, respirations "
        "are 14/min, and blood pressure is 108/66 mm Hg. Scattered epithelial cells release a hormone. The "
        "hormone enters the blood and reaches the pancreas, rather than acting only on the neighboring cell "
        "through the lumen."
    ),
    stem="Which of the following path does the hormone take?",
    options=[
        "Into the blood, then to the target organ",
        "Only across a synapse onto the next neuron",
        "Into a lacteal, as if it were absorbed fat",
        "Back into the lumen as an enzyme",
        "Into cartilage, to lengthen a long bone",
    ],
    key=0,
    whys=[
        "Endocrinocytes in the stomach and small-intestinal mucosa secrete GI hormones into the bloodstream, which carries them to target organs. The duodenal hormone reached the pancreas that way.",
        "A neurotransmitter crosses a synapse. These hormones use the blood.",
        "Lacteals carry absorbed lipids, not these hormones.",
        "Digestive enzymes are released into the lumen. These hormone-producing cells send their product into the blood.",
        "Bone growth is unrelated to duodenal hormone delivery.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="large-bowel-residual-water",
    task="mechanism", difficulty=2, src="os-23-2", nutrition=False,
    fact="The large intestine absorbs most residual water, electrolytes, and vitamins made by enteric bacteria, propels feces, and eliminates them. Mucus eases passage.",
    forbid=["residual", "enteric"],
    vignette=(
        "A 50-year-old man has residue reaching the colon. Temperature is 36.6°C, pulse is 70/min, respirations "
        "are 14/min, and blood pressure is 130/82 mm Hg. Most of the remaining water is absorbed there, along "
        "with vitamins made by the local bacteria. Mucus helps the residue move toward the rectum."
    ),
    stem="Which of the following does this segment absorb besides water?",
    options=[
        "Cofactors made by the microbes that live there",
        "Most dietary glucose on the first pass through",
        "The fats that already entered lymph vessels upstream",
        "Fat-emulsifying salts, as if that were its only job",
        "The gastric factor, which it also secretes",
    ],
    key=0,
    whys=[
        "The large intestine absorbs most residual water, electrolytes, and vitamins produced by enteric bacteria, and mucus eases passage. His colon is doing that.",
        "Most nutrient absorption, including carbohydrate breakdown products, is in the small intestine.",
        "Fats are absorbed into lacteals in the small intestine, not as the colon's main uptake.",
        "Bile-salt handling is a small-intestinal and liver process. The colon's listed jobs are residual water, electrolytes, bacterial vitamins, and feces.",
        "Intrinsic factor is a gastric secretion required for vitamin B12 absorption in the small intestine.",
    ],
)

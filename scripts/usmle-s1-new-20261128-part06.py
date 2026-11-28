# Microbiology items from OpenStax Microbiology section 24.3. Treatment regimens in that section are not used as keys.

add(
    domain="gastrointestinal", subject="microbiology", topic="intoxication-versus-infection",
    task="mechanism", difficulty=3, src="os-micro-24-3", nutrition=False,
    fact="In an intoxication, toxin is made in the food before it is eaten. In an infection, the organism colonizes the gut and then makes toxin.",
    forbid=["intoxication"],
    vignette=(
        "A 23-year-old woman who waits tables and four coworkers develop vomiting 3 hours after a picnic. "
        "Temperature is 36.8°C, pulse is 90/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. "
        "The potato salad sat in the sun for 5 hours. No one is still febrile the next morning, and symptoms "
        "fade within 24 hours. Culture of the salad grows a gram-positive coccus, but reheating the salad to "
        "boiling does not destroy the activity that caused the vomiting."
    ),
    stem="Which of the following best classifies this illness?",
    options=[
        "Toxin was already formed in the food before anyone ate it",
        "The organism had to colonize the colon before making toxin",
        "A virus invaded the epithelium and then made an exotoxin",
        "A preformed toxin required 3 days of bacterial growth in the ileum",
        "The illness required invasion of the bloodstream before vomiting",
    ],
    key=0,
    whys=[
        "Intoxication means the toxin was produced in the food before ingestion. Vomiting began at 3 hours, the salad sat warm for 5 hours, several people were affected, symptoms faded within a day, and boiling did not destroy the activity. That is preformed toxin, not a requirement for colonization.",
        "Infection means the organism is ingested, colonizes, and then makes toxin. A 3-hour onset in several people, with toxin that survives boiling, is the foodborne pattern instead.",
        "The culture grew a gram-positive coccus. A virus does not grow as that colony, and the activity survived boiling in the food.",
        "The vomiting started at 3 hours, so the toxin did not need 3 days of growth after ingestion.",
        "Vomiting at 3 hours with a negative bloodstream story is not bacteremia. The source of illness is the food.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="staph-enterotoxin-heat-stable",
    task="mechanism", difficulty=3, src="os-micro-24-3", nutrition=False,
    fact="Staphylococcal enterotoxins are acid-resistant and heat-stable at 100°C. The organism may be killed while the toxin still causes vomiting. At least some symptoms come from superantigen activity.",
    forbid=["superantigen", "staphylococcal"],
    vignette=(
        "A 19-year-old man who works a deli eats ham that was sliced, left at room temperature for 6 hours, and "
        "then boiled. Temperature is 36.9°C, pulse is 88/min, respirations are 14/min, and blood pressure is "
        "112/70 mm Hg. Vomiting starts 2 hours later. No gram-positive cocci grow from the boiled ham, but a "
        "protein extracted from it still provokes vomiting and drives widespread T-cell proliferation in a lab assay."
    ),
    stem="Which of the following best explains the vomiting after the bacteria were killed?",
    options=[
        "A heat-stable protein toxin remains and can activate many T cells",
        "Live organisms must still be invading the colonic mucosa",
        "A heat-labile toxin increased cyclic AMP and was destroyed by boiling",
        "Shiga toxin blocked the large ribosomal subunit in the endothelium",
        "A spore germinated in the intestine and then made a new toxin",
    ],
    key=0,
    whys=[
        "Staphylococcal enterotoxins resist acid and boiling at 100°C. The bacteria can be dead while the toxin still causes vomiting, and at least part of the effect is superantigen-driven T-cell proliferation. No cocci grew after boiling, the protein remained active, and the assay showed T-cell proliferation.",
        "No organisms grew from the boiled ham, so live mucosal invasion is not required for this vomiting.",
        "A heat-labile cyclic AMP toxin would not survive boiling. This protein did.",
        "Shiga toxin inhibits protein synthesis in endothelial cells. It is not the protein that drove T-cell proliferation in this ham extract.",
        "Spore-forming rods such as Bacillus or Clostridium are a different mechanism. This extract is a protein that survived boiling and activated T cells, with no growth of cocci.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="shigella-escapes-phagosome",
    task="mechanism", difficulty=4, src="os-micro-24-3", nutrition=False,
    fact="Shigella invades epithelium, escapes the phagosome, and lives in the cytoplasm or moves into adjacent cells. Shiga toxin binds a glycosphingolipid and inhibits protein synthesis on the large ribosomal subunit.",
    forbid=["shigella", "shiga"],
    vignette=(
        "A 6-year-old boy who attends day camp has fever, cramps, and stool that contains blood and mucus. "
        "Temperature is 38.9°C, pulse is 120/min, respirations are 24/min, and blood pressure is 96/60 mm Hg. "
        "A gram-negative rod invades epithelial cells, leaves the phagosome, and multiplies in the cytoplasm, "
        "then spreads to the next cell. Its toxin binds a surface glycolipid and stops protein synthesis by "
        "acting on the large ribosomal subunit."
    ),
    stem="Which of the following is the intracellular behavior of this organism?",
    options=[
        "It exits the vesicle and moves into the neighboring cell",
        "It remains inside the macrophage phagosome and does not escape",
        "It never enters cells and only makes toxin in food",
        "It is limited to the stomach, where urease makes ammonia",
        "It forms a pedestal and does not make a ribosomal toxin",
    ],
    key=0,
    whys=[
        "Shigella invades epithelium, escapes the phagosome, multiplies in the cytoplasm, and moves into adjacent cells. Its Shiga toxin binds a glycosphingolipid and inhibits protein synthesis on the large ribosomal subunit. The boy's bloody mucus stool and this cell behavior match that description.",
        "Salmonella can persist inside phagosomes. This organism leaves the phagosome.",
        "A preformed food toxin does not invade cells or escape a phagosome. This rod does both.",
        "Helicobacter lives in the stomach and makes urease. This illness is invasive colitis with a ribosomal toxin.",
        "Enteropathogenic E. coli forms pedestals and lacks Shiga toxin. This organism makes a toxin that hits the large ribosomal subunit.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="salmonella-m-cell-phagosome",
    task="mechanism", difficulty=3, src="os-micro-24-3", nutrition=False,
    fact="Nontyphoidal Salmonella penetrates the mucosa through M cells and can persist inside macrophage phagosomes.",
    forbid=["salmonella"],
    vignette=(
        "A 14-year-old girl who feeds the family chickens has fever and nonbloody diarrhea 18 hours after a raw "
        "egg. Temperature is 38.4°C, pulse is 104/min, respirations are 18/min, and blood pressure is 104/66 mm Hg. "
        "A gram-negative rod crosses the epithelium through cells overlying lymphoid aggregates, then survives "
        "inside the phagosomes of macrophages. It does not escape into the cytoplasm."
    ),
    stem="Which of the following is the entry and survival pattern shown here?",
    options=[
        "Entry across the lymphoid dome and persistence in the vesicle",
        "Escape from the phagosome out into the cytoplasm",
        "Toxin made in the kitchen before the egg was eaten",
        "Urease activity that neutralizes acid inside the stomach",
        "A chloride-channel toxin that does not invade cells",
    ],
    key=0,
    whys=[
        "Salmonella crosses the mucosa via M cells over lymphoid tissue and can persist inside macrophage phagosomes. She ate a raw egg, and the rod uses that entry and stays in the phagosome.",
        "Escape into the cytoplasm is the Shigella pattern. This organism does not leave the phagosome.",
        "Preformed toxin causes rapid vomiting without this intracellular survival. Onset here is 18 hours with fever and cellular invasion.",
        "Urease is how Helicobacter tolerates gastric acid. This rod is invading intestinal epithelium.",
        "Cholera toxin opens a chloride channel and does not use this invasive phagosome pattern.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="cholera-camp-chloride",
    task="mechanism", difficulty=3, src="os-micro-24-3", nutrition=False,
    fact="Cholera toxin is an A-B toxin that acts through adenylate cyclase, raises cAMP, opens a chloride channel, and pulls water into the lumen.",
    forbid=["cholera", "camp"],
    vignette=(
        "A 32-year-old man who is visiting relatives has sudden watery diarrhea so large that the stool looks "
        "like cloudy water, beginning 1 day after he drank untreated river water. Temperature is 36.4°C, pulse "
        "is 124/min, respirations are 22/min, and blood pressure is 88/54 mm Hg. A curved gram-negative rod "
        "makes an A-B toxin. Inside enterocytes cyclic AMP rises, a chloride channel opens, and water follows "
        "the ions into the lumen. There is no blood in the stool."
    ),
    stem="Which of the following is the direct result of the rise in cyclic AMP?",
    options=[
        "Salt ions exit and water is drawn into the bowel lumen",
        "The large ribosomal subunit stops making protein",
        "Many T cells proliferate as if a superantigen were present",
        "The organism escapes the phagosome and spreads laterally",
        "Ammonia is released and gastric acid is neutralized",
    ],
    key=0,
    whys=[
        "Cholera toxin acts through adenylate cyclase, raises cyclic AMP, opens a chloride channel, and water follows into the lumen. He has massive watery stool without blood, a curved gram-negative rod, and that sequence.",
        "Shiga toxin inhibits protein synthesis on the large ribosomal subunit. It does not raise cyclic AMP.",
        "Staphylococcal enterotoxin can act as a superantigen. It does not open an enterocyte chloride channel.",
        "Shigella escapes the phagosome. Cholera toxin acts from organisms that attach and secrete toxin, and this stool is watery rather than invasive.",
        "Helicobacter urease generates ammonia in the stomach. It does not produce this cyclic AMP diarrhea.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="ehec-toxin-release-hus",
    task="mechanism", difficulty=4, src="os-micro-24-3", nutrition=False,
    fact="EHEC makes Shiga-like toxin acquired from Shigella. Antibiotics are not recommended because killing the bacteria releases toxin and may worsen hemolytic uremic syndrome.",
    forbid=["enterohemorrhagic", "o157"],
    vignette=(
        "A 5-year-old girl who visited a petting zoo has bloody diarrhea without fever. Temperature is 37.2°C, "
        "pulse is 110/min, respirations are 22/min, and blood pressure is 100/64 mm Hg. The stool isolate is a "
        "gram-negative rod that does not ferment sorbitol and carries a toxin gene obtained from a dysentery "
        "organism. The toxin gene sits in a prophage. A resident asks why an antibiotic might make kidney failure "
        "more likely."
    ),
    stem="Which of the following is the reason an antibiotic can worsen this illness?",
    options=[
        "Killing the bacteria releases more of the phage-encoded toxin",
        "The drug increases cyclic AMP and opens a chloride channel",
        "The drug is itself a superantigen that activates T cells",
        "The drug destroys colonic bacteria that make vitamin K",
        "The drug blocks intrinsic factor and causes nerve injury",
    ],
    key=0,
    whys=[
        "EHEC carries Shiga-like toxin genes that came from Shigella by transduction, and the toxin is phage-encoded. Antibiotics are not recommended because killing the bacteria releases toxin and can worsen hemolytic uremic syndrome. She has bloody diarrhea, a non-sorbitol-fermenting rod, and that toxin gene.",
        "Cyclic AMP and a chloride channel describe cholera toxin, which causes watery diarrhea, not this bloody illness.",
        "Superantigen activity is a feature of staphylococcal enterotoxin. It is not why an antibiotic worsens this infection.",
        "Loss of vitamin K-producing flora can affect clotting after a long antibiotic course. It is not the reason this toxin-mediated kidney injury worsens.",
        "Intrinsic factor is a gastric glycoprotein. Antibiotics do not block it, and the risk named here is toxin release.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="h-pylori-urease",
    task="mechanism", difficulty=2, src="os-micro-24-3", nutrition=False,
    fact="H. pylori makes urease, which generates ammonia and neutralizes local acid, and it damages mucus-producing cells. A urea breath test detects labeled carbon dioxide from that reaction.",
    forbid=["urease", "helicobacter"],
    vignette=(
        "A 47-year-old man who drives a snowplow has burning epigastric pain for 2 months. Temperature is "
        "36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 128/80 mm Hg. Endoscopy shows "
        "a 1-cm duodenal ulcer. He swallows urea labeled with a carbon isotope. Labeled carbon dioxide appears "
        "in his breath 20 minutes later. Gastric mucus over the ulcer is thin."
    ),
    stem="Which of the following bacterial activity produced the labeled carbon dioxide?",
    options=[
        "Splitting urea to ammonia, which also buffers local acid",
        "Raising cyclic AMP and opening a chloride channel",
        "Blocking protein synthesis on the large ribosomal subunit",
        "Acting as a superantigen after surviving boiling",
        "Invading through M cells and staying in the phagosome",
    ],
    key=0,
    whys=[
        "Helicobacter urease splits urea, releases ammonia that neutralizes acid, and the carbon from urea leaves as carbon dioxide that a breath test detects. He has a duodenal ulcer, thin mucus, and labeled carbon dioxide after labeled urea.",
        "Cholera toxin raises cyclic AMP. It does not liberate labeled carbon dioxide from swallowed urea.",
        "Shiga toxin blocks the ribosome. It does not split urea.",
        "Staphylococcal enterotoxin can resist boiling and activate T cells. It is not a gastric urease.",
        "Salmonella uses M cells and phagosomes. It does not explain a urea breath test.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="c-diff-gtpase-toxin",
    task="mechanism", difficulty=4, src="os-micro-24-3", nutrition=False,
    fact="After antibiotics disrupt the flora, C. difficile overgrows. Toxins TcdA and TcdB inactivate small GTP-binding proteins, condense actin, kill cells, and can form a pseudomembrane.",
    forbid=["difficile", "pseudomembrane"],
    vignette=(
        "A 78-year-old woman who lives in a nursing home finished a 14-day antibiotic course 5 days ago and now "
        "has watery diarrhea and cramps. Temperature is 38.3°C, pulse is 102/min, respirations are 18/min, and "
        "blood pressure is 108/64 mm Hg. Colonoscopy shows yellow-white plaques of fibrin, dead epithelial cells, "
        "and leukocytes. The organism's toxins inactivate small GTP-binding proteins, actin condenses, and the "
        "cells round up and die."
    ),
    stem="Which of the following allowed this organism to overgrow?",
    options=[
        "Antibiotics disrupted the flora that normally hold it in check",
        "A preformed toxin was boiled into leftover ham salad earlier",
        "Urease created an alkaline niche inside the stomach",
        "A chloride-channel toxin was swallowed in river water",
        "M cells carried it into macrophages, where it stayed",
    ],
    key=0,
    whys=[
        "C. difficile can live quietly until antibiotics disrupt the normal flora, after which it overgrows. TcdA and TcdB inactivate small GTP-binding proteins, condense actin, and kill epithelium, producing a pseudomembrane of fibrin, dead cells, and leukocytes. She just finished 14 days of antibiotics and has those plaques.",
        "Preformed staphylococcal toxin causes rapid vomiting. It does not form colonic plaques days after antibiotics.",
        "Urease is the Helicobacter mechanism in the stomach, not this colonic toxin.",
        "Cholera toxin opens a chloride channel. It does not inactivate small GTP-binding proteins or form plaques.",
        "Salmonella survival in phagosomes is a different invasive pattern. This illness follows antibiotics and shows a toxin that collapses actin.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="bacillus-cereus-rice-spores",
    task="mechanism", difficulty=2, src="os-micro-24-3", nutrition=False,
    fact="B. cereus spores survive cooking. In rice and other foods left warm, the organism makes enterotoxins. One toxin causes vomiting and another causes diarrhea.",
    forbid=["cereus", "bacillus"],
    vignette=(
        "A 20-year-old man who cooks in a dorm kitchen eats fried rice that was boiled, left on the counter for "
        "8 hours, and then quickly reheated. Temperature is 36.6°C, pulse is 84/min, respirations are 14/min, "
        "and blood pressure is 116/72 mm Hg. Vomiting starts 2 hours later. The rice grows a gram-positive rod "
        "that forms spores. Two different toxins are identified, one linked to vomiting and one linked to diarrhea."
    ),
    stem="Which of the following best explains the illness after reheating?",
    options=[
        "Spores survived cooking and toxin formed while the rice sat out",
        "A heat-stable coccal toxin was the only protein in the rice",
        "The rod had to escape a phagosome before any toxin was made",
        "Urease from a gastric organism alkalinized the rice",
        "A phage-encoded ribosomal toxin was released by an antibiotic",
    ],
    key=0,
    whys=[
        "Bacillus cereus spores survive cooking. When rice is left warm, the organism makes toxins, one causing vomiting and one causing diarrhea. The rice was boiled, left out 8 hours, reheated, and grew a spore-forming gram-positive rod with both toxins.",
        "Staphylococcal toxin is from a gram-positive coccus, not a spore-forming rod, and this rice grew a rod.",
        "Phagosome escape is the Shigella invasion pattern. This illness is toxin formed in food.",
        "Urease is a gastric Helicobacter enzyme. It does not explain toxins in reheated rice.",
        "Phage-encoded Shiga-like toxin is an EHEC mechanism, and no antibiotic was given.",
    ],
)

add(
    domain="gastrointestinal", subject="microbiology", topic="campylobacter-cdt-dnase",
    task="mechanism", difficulty=4, src="os-micro-24-3", nutrition=False,
    fact="Campylobacter jejuni is linked to Guillain-Barré syndrome. Many strains make cytolethal distending toxin, a DNase that irreversibly damages host DNA.",
    forbid=["campylobacter", "guillain"],
    vignette=(
        "A 25-year-old man who grills chicken has fever and diarrhea for 3 days. Temperature is 38.2°C, pulse "
        "is 96/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. A curved gram-negative rod "
        "grows at 42°C in low oxygen. Ten days after the diarrhea ends, both legs become weak and the reflexes "
        "disappear. The organism's toxin is a DNase that permanently damages host-cell DNA."
    ),
    stem="Which of the following is the action of the toxin described here?",
    options=[
        "Irreversible damage to host-cell DNA by a nuclease",
        "A rise in enterocyte cyclic AMP after ADP-ribosylation",
        "Inactivation of small GTP-binding proteins with actin collapse",
        "Superantigen-driven proliferation of many T cells",
        "Cleavage of ribosomal RNA that stops protein synthesis",
    ],
    key=0,
    whys=[
        "Campylobacter cytolethal distending toxin is a DNase that irreversibly damages host DNA. The organism is a curved gram-negative rod that grows at 42°C in low oxygen, and the illness is associated with later Guillain-Barré syndrome. His diarrhea, culture conditions, toxin, and later paralysis fit that organism.",
        "Raising cyclic AMP is cholera toxin. It does not nick host DNA.",
        "Inactivating small GTP-binding proteins is the C. difficile toxin mechanism.",
        "Superantigen activity describes staphylococcal enterotoxin, not this DNase.",
        "Halting protein synthesis on the ribosome is Shiga toxin, not a DNase.",
    ],
)

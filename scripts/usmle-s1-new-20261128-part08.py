# Final 10 gastrointestinal items and 15 immune items for batch 1.

add(
    domain="gastrointestinal", subject="physiology", topic="defecation-reflex-internal-sphincter",
    task="mechanism", difficulty=3, src="os-23-5", nutrition=False,
    fact="The defecation reflex is a parasympathetic spinal reflex. It contracts the sigmoid and rectum, relaxes the internal anal sphincter, and initially contracts the external sphincter, which can then be opened voluntarily.",
    forbid=["defecation"],
    vignette=(
        "A 73-year-old man who keeps score at a bowling alley feels stool enter the rectum. Temperature is "
        "36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 138/78 mm Hg. The rectal wall "
        "stretches. The sigmoid and rectum contract, the inner anal ring relaxes, and the outer ring tightens "
        "for a few seconds until he decides to let it open."
    ),
    stem="Which of the following conducts this reflex from the stretch?",
    options=[
        "Parasympathetic signals through the spinal cord",
        "Sympathetic signals that quiet the entire colon",
        "A fundic hormone that stimulates hypothalamic hunger",
        "Somatic motor fibers that relax the inner smooth-muscle ring",
        "Vagal signals that increase gastric acid before a meal",
    ],
    key=0,
    whys=[
        "Stretch of the rectum triggers a parasympathetic spinal reflex that contracts the sigmoid and rectum, relaxes the internal sphincter, and initially contracts the external sphincter. He can then choose to open the outer ring. That sequence is what he feels.",
        "Sympathetic activity decreases GI motility. It does not produce this coordinated rectal contraction and inner-ring relaxation.",
        "Ghrelin stimulates hunger. It does not run the rectal reflex.",
        "The inner ring is smooth muscle. Somatic fibers supply the outer skeletal ring, which tightened and then could be opened by choice.",
        "The cephalic phase raises gastric acid before food arrives. It is not a rectal stretch reflex.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="gip-stimulates-insulin",
    task="mechanism", difficulty=3, src="os-23-5", nutrition=False,
    fact="K cells secrete glucose-dependent insulinotropic peptide, which stimulates insulin release.",
    forbid=["insulinotropic", "gip"],
    vignette=(
        "A 48-year-old woman who proofs legal briefs drinks 300 mL of a glucose solution. Temperature is 36.5°C, "
        "pulse is 74/min, respirations are 14/min, and blood pressure is 116/72 mm Hg. As glucose contacts the "
        "small-bowel lining, a hormone from mucosal K cells rises, and insulin in portal blood rises with it. "
        "The same glucose given by vein, bypassing the gut, produces a smaller insulin rise."
    ),
    stem="Which of the following is the gut hormone's action in this study?",
    options=[
        "It prompts release of the hormone that lowers blood sugar",
        "It inhibits all gastric secretion, motility, and emptying",
        "It emulsifies triglyceride in the duodenal lumen",
        "It activates trypsinogen on the brush border",
        "It concentrates bile by absorbing water from it",
    ],
    key=0,
    whys=[
        "K cells secrete glucose-dependent insulinotropic peptide, which stimulates insulin release. Oral glucose raised this mucosal hormone and insulin, and intravenous glucose, which skipped the gut, raised insulin less.",
        "Somatostatin restricts gastric secretion, motility, and emptying. It is not the K-cell signal that rose with oral glucose.",
        "Bile salts emulsify fat. They are not a hormone that augments insulin after oral glucose.",
        "Enteropeptidase activates trypsinogen. It does not explain the insulin difference between oral and intravenous glucose.",
        "The gallbladder concentrates bile. It does not release a hormone from small-bowel K cells.",
    ],
)

add(
    domain="gastrointestinal", subject="histology", topic="gastric-epithelium-renewal",
    task="histology", difficulty=2, src="os-23-4", nutrition=False,
    fact="Stem cells where gastric glands join the pits replace the surface epithelium, which is completely renewed every 3 to 6 days.",
    forbid=["renew"],
    vignette=(
        "A 39-year-old man who cuts glass has a gastric biopsy after a week of aspirin use. Temperature is "
        "36.7°C, pulse is 76/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. A shallow erosion "
        "is already covered by new surface cells. The pathologist notes that stem cells at the junction of pits "
        "and glands replace the entire surface lining on a cycle of 3 to 6 days."
    ),
    stem="Which of the following is the source of the new surface cells?",
    options=[
        "Stem cells where the glands open into the gastric pits",
        "Basal gland cells that store the protein-digesting precursor",
        "Pancreatic acini that secrete already-active lipase",
        "Liver cells arranged in plates around the central vein",
        "Mucus cells that pack the glands of the large intestine",
    ],
    key=0,
    whys=[
        "Stem cells at the junction of gastric glands and pits replace damaged surface cells, and the surface is fully replaced every 3 to 6 days. The erosion is already covered, and the note gives that cycle and that location.",
        "Chief cells secrete pepsinogen. They are not the stem cells that resurface the pits.",
        "Pancreatic acini secrete enzymes. They do not replace gastric surface cells.",
        "Hepatocytes process portal blood and make bile. They are not in the gastric pits.",
        "Colonic goblet cells secrete mucus. They are not the stem cells of the gastric surface.",
    ],
)

add(
    domain="gastrointestinal", subject="histology", topic="squamous-versus-columnar-lining",
    task="histology", difficulty=2, src="os-23-1", nutrition=False,
    fact="The epithelium is nonkeratinized stratified squamous in the mouth, pharynx, esophagus, and anal canal. It is simple columnar in the stomach and intestines.",
    forbid=["squamous", "columnar"],
    vignette=(
        "A 50-year-old woman who archives newspapers has two biopsies. Temperature is 36.6°C, pulse is 72/min, "
        "respirations are 14/min, and blood pressure is 118/70 mm Hg. The esophageal biopsy shows many layers of "
        "flat surface cells that are not keratinized. The gastric biopsy, taken 3 cm beyond the junction, shows "
        "a single layer of tall cells with mucus on the surface."
    ),
    stem="Which of the following pairings matches these two linings?",
    options=[
        "Layered flat cells in the esophagus, a single tall-cell layer in the stomach",
        "A single tall-cell layer in the esophagus, layered flat cells in the stomach",
        "Layered flat cells throughout both the esophagus and the stomach",
        "A single tall-cell layer in both the esophagus and the stomach",
        "Keratinized skin in the esophagus and transitional cells in the stomach",
    ],
    key=0,
    whys=[
        "The esophagus is lined by nonkeratinized stratified squamous epithelium, and the stomach by simple columnar epithelium. Her esophageal biopsy is many layers of flat cells without keratin, and the gastric biopsy is one layer of tall mucus-covered cells.",
        "That pairing reverses the two organs.",
        "The stomach biopsy is a single tall-cell layer, not layered flat cells.",
        "The esophageal biopsy is layered, not a single tall-cell layer.",
        "The esophageal cells are not keratinized, and the stomach is not transitional epithelium.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="pancreatic-juice-inactivates-pepsin",
    task="mechanism", difficulty=3, src="os-23-6", nutrition=False,
    fact="Pancreatic juice is alkaline, about pH 7.1 to 8.2, because of bicarbonate. That alkalinity buffers gastric acid, inactivates pepsin, and suits the intestinal enzymes.",
    forbid=["pepsin"],
    vignette=(
        "A 44-year-old man who tunes organs is studied as chyme enters the duodenum. Temperature is 36.7°C, "
        "pulse is 70/min, respirations are 14/min, and blood pressure is 120/74 mm Hg. Gastric pH is 2.0 and "
        "a protein-digesting enzyme from the stomach is active. After bicarbonate-rich pancreatic juice mixes "
        "in, duodenal pH is 7.6 and that gastric enzyme stops working. Intestinal enzymes in the same fluid "
        "become active."
    ),
    stem="Which of the following does the alkaline pancreatic juice do to the gastric enzyme?",
    options=[
        "It raises the pH and shuts off that stomach enzyme",
        "It converts the enzyme from pepsinogen into its active form",
        "It emulsifies fat so the gastric enzyme can digest triglyceride",
        "It is the brush-border enzyme that activates trypsinogen",
        "It stimulates hunger by an action on the hypothalamus",
    ],
    key=0,
    whys=[
        "Bicarbonate makes pancreatic juice alkaline, about pH 7.1 to 8.2, which buffers acid and inactivates pepsin. Gastric pH was 2.0 with the enzyme active, and at duodenal pH 7.6 that enzyme stopped while intestinal enzymes worked.",
        "Acid, not alkaline juice, converts pepsinogen to pepsin. Alkali does the opposite to the active enzyme.",
        "Bile salts emulsify fat. Pancreatic alkalinity does not assign the gastric protein enzyme to triglycerides.",
        "Enteropeptidase activates trypsinogen. The change here is loss of activity of the gastric enzyme as pH rises.",
        "Ghrelin stimulates hunger. It is not pancreatic juice.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="alkaline-tide-balanced",
    task="mechanism", difficulty=4, src="os-23-6", nutrition=False,
    fact="When the pancreas secretes bicarbonate, hydrogen ions enter the blood. That acidic pancreatic venous blood balances the alkaline blood leaving the stomach.",
    forbid=["alkaline tide"],
    vignette=(
        "A 36-year-old woman who designs maps is studied after a large meal. Temperature is 36.6°C, pulse is "
        "74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. Venous blood leaving the stomach "
        "is alkaline while acid is being secreted into the lumen. At the same time, venous blood leaving the "
        "pancreas is acidic as bicarbonate is secreted into the ducts. Blood reaching the liver has a normal pH."
    ),
    stem="Which of the following best explains the normal pH of blood reaching the liver?",
    options=[
        "Acidic pancreatic venous blood offsets alkaline gastric venous blood",
        "The liver adds bicarbonate until both venous streams are alkaline",
        "Colonic bacteria generate the acid that cancels the gastric stream",
        "Bile salts buffer the gastric venous blood inside the portal vein",
        "Intrinsic factor binds the excess alkali before it leaves the stomach",
    ],
    key=0,
    whys=[
        "Hydrogen ions enter the blood when pancreatic duct cells secrete bicarbonate, so pancreatic venous blood is acidic and balances the alkaline venous blood leaving the stomach during acid secretion. Her two streams match that pair, and hepatic inflow pH is normal.",
        "The pancreas is already supplying the acidic stream. The liver is not described as adding more bicarbonate to both.",
        "Colonic bacteria make gas and some vitamins. They are not the source of the acidic pancreatic venous blood.",
        "Bile salts emulsify fat in the intestine. They do not buffer gastric venous blood.",
        "Intrinsic factor binds vitamin B12. It does not neutralize an alkaline tide.",
    ],
)

add(
    domain="gastrointestinal", subject="physiology", topic="gastroileal-reflex",
    task="mechanism", difficulty=3, src="os-23-5", nutrition=False,
    fact="Digestive activity in the stomach provokes the gastroileal reflex, which increases ileal segmentation. Gastrin also increases ileal motility and relaxes the ileocecal sphincter.",
    forbid=["gastroileal", "ileocecal"],
    vignette=(
        "A 30-year-old man who installs flooring is studied as a meal enters the stomach. Temperature is 36.8°C, "
        "pulse is 76/min, respirations are 14/min, and blood pressure is 118/72 mm Hg. Segmentation in the last "
        "part of the small intestine becomes stronger, and the sphincter into the cecum relaxes. A hormone from "
        "the antrum is elevated. The colon is still empty."
    ),
    stem="Which of the following links the meal in the stomach to the ileal change?",
    options=[
        "A stomach reflex plus an antral peptide speeds the last segment",
        "Strong colonic waves are pushing stool toward the rectum",
        "The duodenum is overfilled and has shut the gastric outlet",
        "Fat in the last segment is being dispersed by new bile",
        "The outer anal ring has been opened by a voluntary act",
    ],
    key=0,
    whys=[
        "Gastric digestive activity triggers the gastroileal reflex, increasing ileal segmentation, and gastrin from the antrum also increases ileal motility and relaxes the ileocecal sphincter. The meal is in the stomach, the antral hormone is up, the distal small bowel is more active, and the cecal sphincter is relaxed. The colon is empty.",
        "Mass movements are colonic and move contents toward the rectum. The colon is empty, and the change is in the distal small intestine.",
        "The enterogastric reflex closes the pylorus when the duodenum is distended. Here the meal has just entered the stomach.",
        "Bile salts emulsify fat. That chemistry does not relax the sphincter into the cecum when a meal hits the stomach.",
        "The external anal sphincter is at the anus. It is not the sphincter between ileum and cecum.",
    ],
)

add(
    domain="gastrointestinal", subject="pathology", topic="portal-vein-metastasis",
    task="mechanism", difficulty=2, src="os-23-6", nutrition=False,
    fact="All blood from the alimentary canal passes through the liver in the portal vein, which is why the liver is the most common site for metastasis of cancers that start in the alimentary canal.",
    forbid=["metastas"],
    vignette=(
        "A 69-year-old man who repairs violins has a 4-cm mass in the cecum and three new masses in the liver. "
        "Temperature is 36.9°C, pulse is 82/min, respirations are 16/min, and blood pressure is 130/78 mm Hg. "
        "The lung fields are clear. Veins from the cecum join the stream that enters the liver before any of "
        "that blood reaches the heart."
    ),
    stem="Which of the following best explains why the new masses appeared in the liver first?",
    options=[
        "Venous blood from the gut reaches the liver before the heart",
        "The hepatic artery is the only route out of the cecum",
        "Bile flows from the liver back into the cecal veins",
        "Lymph from the gut drains only into the thoracic duct and lungs",
        "The masses crossed the peritoneum as free air under the diaphragm",
    ],
    key=0,
    whys=[
        "Portal blood from the alimentary canal all passes through the liver before returning to the heart, so cancers that start in the gut most often seed the liver. His cecal veins join that stream, the liver has the new masses, and the lungs are clear.",
        "The hepatic artery brings arterial blood to the liver. It is not the venous exit from the cecum.",
        "Bile flows through ducts into the duodenum, not backward into cecal veins.",
        "The lungs are clear, and the route described is venous blood to the liver, not a lymph path that skips the liver.",
        "Free air under the diaphragm is a sign of perforation. It is not how solid masses reach the liver.",
    ],
)

add(
    domain="gastrointestinal", subject="histology", topic="four-gut-layers",
    task="histology", difficulty=2, src="os-23-1", nutrition=False,
    fact="From the lumen outward the gut wall is mucosa, submucosa, muscularis, and serosa. The mucosa includes epithelium, lamina propria, and muscularis mucosae.",
    forbid=["lamina"],
    vignette=(
        "A 45-year-old woman who teaches pottery has a full-thickness jejunal biopsy. Temperature is 36.6°C, "
        "pulse is 70/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. From the lumen outward "
        "the slide shows epithelium with its supporting connective tissue and a thin muscle strip, then a "
        "broader connective-tissue layer with a nerve network, then two smooth-muscle layers, then a slippery "
        "outer coat."
    ),
    stem="Which of the following is the order of these layers from the lumen?",
    options=[
        "Mucosa, submucosa, muscularis, then serosa",
        "Serosa, muscularis, submucosa, then mucosa",
        "Mucosa, muscularis, serosa, then submucosa",
        "Submucosa, mucosa, serosa, then muscularis",
        "Adventitia, mucosa, serosa, then muscularis",
    ],
    key=0,
    whys=[
        "From the lumen the layers are mucosa, submucosa, muscularis, and serosa. The mucosa on this slide is epithelium plus its connective tissue and thin muscle, then the nerve-bearing connective tissue, then the two muscle layers, then the slippery coat.",
        "That list is the reverse of the lumen-outward order.",
        "Serosa is the outer coat, not the third layer, and submucosa is not last.",
        "The epithelium-bearing layer is first, so submucosa is not the luminal layer.",
        "Jejunum has serosa, not adventitia. Adventitia replaces serosa in the esophagus.",
    ],
)

add(
    domain="gastrointestinal", subject="anatomy", topic="rectal-valves-separate-gas",
    task="anatomy", difficulty=3, src="os-23-5", nutrition=False,
    fact="Three transverse rectal folds, the rectal valves, help separate feces from gas so they are not passed together.",
    forbid=["rectal valve"],
    vignette=(
        "A 61-year-old man who coaches chess has a scope of the last 20 cm of the bowel. Temperature is 36.5°C, "
        "pulse is 68/min, respirations are 14/min, and blood pressure is 126/76 mm Hg. Three transverse shelves "
        "project into the lumen. He can pass gas without stool. The shelves are proximal to the anal canal, and "
        "the lining above them is simple columnar."
    ),
    stem="Which of the following is the role of these three shelves?",
    options=[
        "They help keep flatus and stool from passing together",
        "They churn a meal using an extra inner gastric muscle",
        "They remove water so bile occupies a smaller volume",
        "They mark where visceral sensation changes to somatic pain",
        "They house the stem cells that replace the gastric surface",
    ],
    key=0,
    whys=[
        "The rectal valves are three transverse folds that help separate feces from gas. He can pass gas without stool, and the shelves are in the last 20 cm, proximal to the anal canal.",
        "The oblique muscle is gastric. These shelves are rectal.",
        "The gallbladder concentrates bile. It is not a set of rectal shelves.",
        "The pectinate line, lower in the anal canal, separates visceral and somatic sensation. These shelves are proximal to the anal canal.",
        "Gastric stem cells sit where pits meet glands. They are not rectal shelves.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="iga-secretions-milk",
    task="mechanism", difficulty=2, src="os-21-4", nutrition=False,
    fact="Dimeric IgA is the antibody in mucous secretions, saliva, tears, and breast milk. It is the antibody that protects body surfaces. IgG, not IgA, is the one that crosses the placenta.",
    forbid=["iga", "igg", "igm", "ige"],
    vignette=(
        "A 2-week-old girl is exclusively fed her mother's milk. Temperature is 36.8°C, pulse is 140/min, "
        "respirations are 36/min, and blood pressure is 70/40 mm Hg. Milk contains a dimeric antibody that also "
        "appears in saliva and tears. A different antibody, transferred before birth across the placenta, is "
        "already in her serum and is not the one found in the milk."
    ),
    stem="Which of the following is the antibody in the milk?",
    options=[
        "The dimeric class that guards mucosal surfaces",
        "The pentamer that dominates the first serum response",
        "The class bound to mast cells in allergic responses",
        "The monomer that crosses the placenta before birth",
        "The class coexpressed on naive B cells but not secreted",
    ],
    key=0,
    whys=[
        "Dimeric IgA is the antibody of mucous secretions, saliva, tears, and breast milk, and it protects body surfaces. The milk antibody is dimeric and is also in saliva and tears. The antibody already in serum from the placenta is a different class.",
        "IgM is the pentamer of the early serum response. It is not the dimeric milk antibody.",
        "IgE binds mast cells and is linked to allergy. It is not the dimeric mucosal antibody.",
        "IgG is the monomer that crosses the placenta. The vignette says that class is already in serum and is not the milk antibody.",
        "IgD is on naive B cells with IgM and is not the secreted milk antibody.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="ige-mast-cell",
    task="mechanism", difficulty=2, src="os-21-4", nutrition=False,
    fact="IgE is present at the lowest concentration in blood because its Fc region binds Fc receptors on mast cells. Allergen then triggers degranulation and can cause anaphylaxis.",
    forbid=["ige", "mast"],
    vignette=(
        "A 9-year-old boy who visits a bakery wheezes and develops hives 10 minutes after a peanut candy. "
        "Temperature is 36.9°C, pulse is 130/min, respirations are 32/min, and blood pressure is 78/46 mm Hg. "
        "The antibody class involved is the one found at the lowest level in his serum, because its tail is "
        "already stuck to receptors on cells that release histamine."
    ),
    stem="Which of the following is the reason this antibody is scarce in serum?",
    options=[
        "Its tail sits on the cells that release the itch mediator",
        "It is a five-unit antibody too large to stay in the blood",
        "It is secreted only into milk, saliva, tears, and mucus",
        "It crosses the placenta and leaves the child's circulation",
        "It is displayed on naive B cells and is never secreted",
    ],
    key=0,
    whys=[
        "IgE is the lowest-concentration antibody in blood because its Fc region binds strongly to receptors on mast cells. Allergen cross-linking then causes degranulation. He has rapid wheeze, hives, and low blood pressure after peanut, and the antibody is the one parked on histamine-releasing cells.",
        "IgM is the pentamer. Size is not why this allergy antibody is scarce in serum.",
        "Dimeric IgA is the antibody of milk, saliva, and tears. It is not the one fixed on histamine-releasing cells.",
        "IgG crosses the placenta. That transfer is not why an allergy antibody is scarce in a 9-year-old's serum.",
        "IgD stays on naive B cells. The antibody here is bound to histamine-releasing cells and triggered by peanut.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="igm-first-pentamer",
    task="mechanism", difficulty=2, src="os-21-4", nutrition=False,
    fact="IgM is the first antibody of a primary response. It is a pentamer with 10 antigen-binding sites and activates complement well.",
    forbid=["igm", "pentamer"],
    vignette=(
        "A 21-year-old woman who lifeguards has fever 6 days after a first-time bacterial skin infection. "
        "Temperature is 38.4°C, pulse is 100/min, respirations are 18/min, and blood pressure is 110/68 mm Hg. "
        "The only antibody to the organism so far is a very large molecule with 10 identical binding sites. "
        "It fixes complement strongly. She has never been infected with this organism before."
    ),
    stem="Which of the following best describes this first antibody?",
    options=[
        "A five-unit antibody made early and strong at starting the cascade",
        "A single-unit antibody that appears only on a later exposure",
        "A dimer secreted onto mucosal surfaces and into milk",
        "A class fixed on mast cells before the antigen arrives",
        "A cell-surface class that is not secreted in this response",
    ],
    key=0,
    whys=[
        "IgM is usually the first antibody of a primary response. It is a pentamer with 10 binding sites and activates complement well. This is her first infection, at day 6, and the only antibody is that large complement-fixing molecule.",
        "IgG is the main antibody of secondary responses and of late primary responses. She has not had this organism before, and the molecule has 10 binding sites, so it is not a monomer.",
        "Dimeric IgA guards mucosa and is in milk. It does not have 10 binding sites.",
        "IgE is fixed on mast cells. It is not the early pentamer of a first infection.",
        "IgD is a surface receptor and is not the secreted early antibody.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="igg-crosses-placenta",
    task="mechanism", difficulty=2, src="os-21-4", nutrition=False,
    fact="IgG is the main antibody of secondary responses in blood, and it is the class that crosses the placenta to protect the fetus.",
    forbid=["igg", "placenta"],
    vignette=(
        "A newborn boy, 2 hours old, has antibody to an organism his mother recovered from last year. Temperature "
        "is 36.8°C, pulse is 140/min, respirations are 40/min, and blood pressure is 68/40 mm Hg. He has not "
        "nursed yet. The antibody in his cord blood is a monomer, and it is the class his mother made in large "
        "amount when she met the organism the second time. No pentamer to that organism is in the cord blood."
    ),
    stem="Which of the following allowed this antibody to reach him before birth?",
    options=[
        "This single-unit antibody crossed from her circulation before birth",
        "This pentamer crosses the placenta in the first week of infection",
        "A mucosal dimer crossed the placenta in place of milk",
        "Mast-cell antibody crossed the placenta and coated his mast cells",
        "A surface-only class was secreted into the cord for the first time",
    ],
    key=0,
    whys=[
        "IgG crosses the placenta and is the main blood antibody of secondary responses. He has not nursed, the cord antibody is a monomer, and it is the class his mother made on second exposure. No pentamer is present.",
        "IgM is the pentamer and is not the class described in the cord blood.",
        "Dimeric IgA reaches the infant in milk, not across the placenta, and he has not nursed.",
        "IgE is the mast-cell antibody. It is not the monomer of a secondary serum response in cord blood.",
        "IgD is a surface receptor on naive B cells and is not the secreted cord-blood antibody.",
    ],
)

add(
    domain="blood-lymph-immune", subject="immunology", topic="naive-b-igm-igd",
    task="mechanism", difficulty=3, src="os-21-4", nutrition=False,
    fact="Naive B cells that leave the marrow express both IgM and IgD with the same specificity. Only IgM is secreted. No other secreted function of IgD is known.",
    forbid=["igd"],
    vignette=(
        "A 19-year-old man who stocks shelves has a blood study of lymphocytes that have never met antigen. "
        "Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. "
        "Each of these cells displays two antibody classes on its surface, both specific for the same shape. "
        "When the cells finally respond, only one of those two classes is released into the blood."
    ),
    stem="Which of the following pair is on these inexperienced cells?",
    options=[
        "Two surface classes of one specificity, only one later secreted",
        "Five secreted classes, with none remaining on the cell surface",
        "Only the allergy class, already fixed on granule-filled cells",
        "A mucosal dimer and a prenatal monomer, both secreted",
        "One secreted five-unit antibody and no surface antibody",
    ],
    key=0,
    whys=[
        "Mature naive B cells express IgM and IgD with the same antigen specificity. Only IgM is secreted. These cells have not met antigen and display two classes of one specificity, of which only one is later released.",
        "Plasma cells secrete antibody and are not the inexperienced cells that still display two surface classes.",
        "IgE on mast cells is the allergy pattern, not the pair on a naive B cell.",
        "IgA and IgG are secreted classes with different jobs. They are not the dual surface display of an inexperienced B cell.",
        "A secreted pentamer without surface antibody describes a plasma-cell product, not a naive cell.",
    ],
)

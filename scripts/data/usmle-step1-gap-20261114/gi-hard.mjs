/** Step 1 gap batch — gastrointestinal hard items (17). */
export const GI_HARD_ITEMS = [
  {
    slug: "gi-18",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "pharmacology",
    blueprintTopic: "liver-pathology",
    topicCategory: "hepatic-encephalopathy",
    citationTitle: "Hepatic Encephalopathy",
    scenario:
      "A 58-year-old man with cirrhosis is confused, with asterixis. Venous ammonia is elevated. He is started on a nonabsorbable disaccharide that colonic bacteria metabolize to lactic and acetic acid, and his mental status improves as stool frequency rises. There is no gastrointestinal bleeding.",
    question: "How does this drug lower the ammonia that reaches the brain?",
    options: [
      "Colonic acid traps ammonium ion so it stays in the stool",
      "Hepatic glutaminase is blocked, stopping hepatic urea synthesis",
      "Plasma ammonia is chelated and filtered by the kidney",
      "Skeletal muscle glutamine release is directly inhibited",
      "Portal blood is shunted away from the systemic veins",
    ],
    correctAnswer: "Colonic acid traps ammonium ion so it stays in the stool",
    explanation: `## Why this answer is correct
Lactulose is fermented to organic acids. The lower luminal pH converts absorbable ammonia (NH3) to ammonium (NH4+), which cannot cross back into blood, and the catharsis expels nitrogenous material. Both effects reduce the ammonia load that a failing liver and portosystemic shunts would otherwise deliver to astrocytes.

## Why the other options are wrong
**Hepatic glutaminase is blocked, stopping hepatic urea synthesis**
Glutaminase generates ammonia; blocking it is not how lactulose works. Urea-cycle failure would raise, not lower, ammonia.

**Plasma ammonia is chelated and filtered by the kidney**
Lactulose is not absorbed and does not bind ammonia in plasma. Its action is inside the gut lumen.

**Skeletal muscle glutamine release is directly inhibited**
Muscle takes up ammonia and releases glutamine. Lactulose does not act on muscle; rifaximin and lactulose act on the gut flora and lumen.

**Portal blood is shunted away from the systemic veins**
Portosystemic shunting is part of why encephalopathy occurs. The drug does not change vascular anatomy.`,
  },
  {
    slug: "gi-19",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "anatomy",
    blueprintTopic: "gi-bleeding-sources",
    topicCategory: "portal-hypertension",
    citationTitle: "Esophageal Varices",
    scenario:
      "A 61-year-old man with cirrhosis vomits bright red blood. Endoscopy shows columns of dilated veins in the distal esophagus. Portal pressure is high and the portal vein is patent. There is no splenectomy history and no isolated cluster of fundal varices.",
    question: "Which portosystemic connection is bleeding?",
    options: [
      "Left gastric vein with distal esophageal veins of the azygos",
      "Superior rectal vein with middle and inferior rectal veins",
      "Paraumbilical veins with superficial abdominal wall veins",
      "Short gastric veins decompressing an occluded splenic vein",
      "Retroperitoneal veins of the bare area with the caval system",
    ],
    correctAnswer: "Left gastric vein with distal esophageal veins of the azygos",
    explanation: `## Why this answer is correct
Portal blood in the left gastric (coronary) vein meets the esophageal tributaries of the azygos, which drain to the superior vena cava. When portal pressure rises, that anastomosis dilates as distal esophageal varices and can rupture into the lumen.

## Why the other options are wrong
**Superior rectal vein with middle and inferior rectal veins**
That anastomosis produces internal hemorrhoids, not esophageal columns.

**Paraumbilical veins with superficial abdominal wall veins**
Recanalized paraumbilical flow produces caput medusae on the abdominal wall.

**Short gastric veins decompressing an occluded splenic vein**
Splenic-vein thrombosis causes isolated gastric fundal varices with a patent portal vein and a normal portal pressure from the rest of the splanchnic bed. This patient has cirrhosis, portal hypertension, and esophageal varices.

**Retroperitoneal veins of the bare area with the caval system**
Veins of Retzius are a silent retroperitoneal shunt. They do not form the submucosal columns seen in the distal esophagus.`,
  },
  {
    slug: "gi-20",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "pancreatitis-enzymes",
    topicCategory: "portal-hypertension",
    citationTitle: "Gastric Varices",
    scenario:
      "A 55-year-old man with chronic pancreatitis from alcohol has hematemesis. Endoscopy shows gastric fundal varices and a normal esophagus. The portal vein and hepatic veins are patent, and there is no cirrhosis on imaging. The splenic vein is occluded where it runs along the pancreas. The spleen is enlarged.",
    question: "How did these fundal varices form?",
    options: [
      "Short gastric veins decompress the blocked splenic vein",
      "Left gastric vein feeds esophageal veins of the azygos",
      "Hepatic venous outflow is blocked at the caval junction",
      "Paraumbilical flow reopens veins around the umbilicus",
      "Portal vein thrombus forces blood through rectal veins",
    ],
    correctAnswer: "Short gastric veins decompress the blocked splenic vein",
    explanation: `## Why this answer is correct
The splenic vein lies on the posterior pancreas and can thrombose in chronic pancreatitis. Splenic blood then leaves through the short gastric veins into the gastric fundus and reaches the portal vein by another route. The result is isolated gastric varices, splenomegaly, a patent portal vein, and a spared esophagus.

## Why the other options are wrong
**Left gastric vein feeds esophageal veins of the azygos**
That is the pathway of esophageal varices in generalized portal hypertension. The esophagus here is normal and the liver is not cirrhotic.

**Hepatic venous outflow is blocked at the caval junction**
Hepatic-vein occlusion is Budd-Chiari syndrome, with a congested liver and ascites, not isolated fundal varices from a pancreatic splenic-vein injury.

**Paraumbilical flow reopens veins around the umbilicus**
That pathway produces caput medusae. It does not selectively dilate short gastric veins.

**Portal vein thrombus forces blood through rectal veins**
The portal vein is patent. Rectal anastomoses would present as hemorrhoids, not fundal varices.`,
  },
  {
    slug: "gi-21",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Budd-Chiari Syndrome",
    scenario:
      "A 34-year-old woman on an estrogen-containing contraceptive develops right-upper-quadrant pain, tender hepatomegaly, and ascites over one week. Hepatic veins show thrombosis. The caudate lobe is enlarged and enhances normally, while the rest of the liver shows centrilobular congestion. JAK2 testing is pending. The portal vein is patent.",
    question: "Why is the caudate lobe spared the congestion?",
    options: [
      "Its veins drain straight into the inferior vena cava",
      "Its artery is a separate branch of the left gastric artery",
      "It receives portal blood that bypasses the sinusoids",
      "It is supplied by the hepatic artery and has no sinusoids",
      "Its bile drains through the cystic duct rather than hepatic ducts",
    ],
    correctAnswer: "Its veins drain straight into the inferior vena cava",
    explanation: `## Why this answer is correct
Budd-Chiari syndrome is hepatic venous outflow obstruction. Most hepatic venous blood must pass through the major hepatic veins. The caudate lobe drains by separate small veins directly into the inferior vena cava, so it stays perfused, hypertrophies, and is not congested when the main hepatic veins thrombose. Centrilobular necrosis elsewhere produces the nutmeg pattern.

## Why the other options are wrong
**Its artery is a separate branch of the left gastric artery**
The caudate is not supplied by the left gastric artery. The sparing is venous, not arterial.

**It receives portal blood that bypasses the sinusoids**
Portal inflow is not the reason the caudate escapes outflow block. The patent route is its direct caval venous drainage.

**It is supplied by the hepatic artery and has no sinusoids**
The caudate has ordinary sinusoids. Arterial supply does not replace hepatic venous drainage.

**Its bile drains through the cystic duct rather than hepatic ducts**
Biliary anatomy does not protect a lobe from venous outflow thrombosis.`,
  },
  {
    slug: "gi-22",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "gi-bleeding-sources",
    topicCategory: "ischemic-colitis",
    citationTitle: "Bowel Ischemia",
    scenario:
      "A 78-year-old man has left-sided abdominal pain and maroon stools the day after an episode of hypotension during hip surgery. He is not in atrial fibrillation. CT shows thumbprinting at the splenic flexure. The superior mesenteric artery and inferior mesenteric artery origins are patent. Mucosal biopsy shows hemorrhage and sloughing limited to the mucosa.",
    question: "Why was this segment selectively injured?",
    options: [
      "It sits at the watershed between two mesenteric arteries",
      "An embolus occluded the superior mesenteric artery trunk",
      "Mesenteric venous thrombosis caused hemorrhagic infarction",
      "Nonocclusive transmural necrosis began at the cecum",
      "A closed-loop volvulus cut arterial and venous flow together",
    ],
    correctAnswer: "It sits at the watershed between two mesenteric arteries",
    explanation: `## Why this answer is correct
The splenic flexure (Griffith point) is the watershed between the superior and inferior mesenteric arterial arcades. During a systemic pressure drop, mucosa there becomes ischemic while the arterial origins stay open. Injury is often mucosal and segmental, producing thumbprinting and bloody stool, and it can recover if perfusion returns.

## Why the other options are wrong
**An embolus occluded the superior mesenteric artery trunk**
SMA embolism causes severe diffuse pain out of proportion to the exam and threatens the entire midgut, usually in atrial fibrillation. Both arterial origins are patent here, and the lesion is mucosal at the flexure.

**Mesenteric venous thrombosis caused hemorrhagic infarction**
Venous thrombosis typically affects the small bowel of a hypercoagulable patient and produces bowel-wall edema with venous occlusion, not a post-hypotensive watershed colitis.

**Nonocclusive transmural necrosis began at the cecum**
The cecum is not the segment described, and the biopsy is mucosal rather than transmural gangrene.

**A closed-loop volvulus cut arterial and venous flow together**
Volvulus would show a twisted loop on CT, not thumbprinting confined to a watershed after a pressure drop.`,
  },
  {
    slug: "gi-23",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "gi-bleeding-sources",
    topicCategory: "mesenteric-ischemia",
    citationTitle: "Acute Mesenteric Ischemia",
    scenario:
      "A 72-year-old woman with atrial fibrillation has sudden severe periumbilical pain. The abdomen is soft and only mildly tender. Lactate is 6.8 mmol/L, and there is an anion-gap metabolic acidosis. CT angiography shows an occlusion at the origin of the superior mesenteric artery and no flow into the jejunal and ileal arcades. The colon and duodenum enhance normally.",
    question: "Which vascular event produced this pain?",
    options: [
      "Embolic occlusion of the superior mesenteric artery",
      "Watershed ischemia limited to the splenic flexure mucosa",
      "Thrombosis of the hepatic veins at the caval ostia",
      "Isolated occlusion of the inferior mesenteric artery",
      "Embolus to a branch of the celiac trunk supplying stomach",
    ],
    correctAnswer: "Embolic occlusion of the superior mesenteric artery",
    explanation: `## Why this answer is correct
Atrial fibrillation seeds arterial emboli. The superior mesenteric artery is a favored target because of its takeoff angle. Sudden loss of midgut arterial flow causes pain out of proportion to tenderness, lactic acidosis, and threatened transmural infarction of jejunum and ileum. The duodenum (dual supply) and colon can be spared early.

## Why the other options are wrong
**Watershed ischemia limited to the splenic flexure mucosa**
Watershed colitis follows hypotension, is left-sided and bloody, and leaves the SMA origin open. Pain here is severe and diffuse with an occluded SMA.

**Thrombosis of the hepatic veins at the caval ostia**
Hepatic-vein thrombosis congests the liver. It does not infarct the midgut or occlude the SMA.

**Isolated occlusion of the inferior mesenteric artery**
The IMA supplies the left colon. Jejunal and ileal arcades are SMA branches, and those are the arcades without flow.

**Embolus to a branch of the celiac trunk supplying stomach**
A celiac branch embolus would affect foregut derivatives. The occluded vessel on this angiogram is the SMA.`,
  },
  {
    slug: "gi-24",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "gi-bleeding-sources",
    topicCategory: "gallstone-ileus",
    citationTitle: "Gallstone Ileus",
    scenario:
      "An 81-year-old woman has colicky pain, vomiting, and obstipation. She is afebrile. Abdominal radiographs show dilated small-bowel loops, air in the biliary tree, and a calcified intraluminal density in the right lower quadrant. Years ago she had episodic right-upper-quadrant pain that resolved without surgery. The colon is not dilated.",
    question: "How did the obstructing object reach the ileum?",
    options: [
      "A cholecystoenteric fistula let a gallstone pass into bowel",
      "A stone formed inside a Meckel diverticulum and detached",
      "Appendicolith migration occluded the terminal ileum",
      "A bezoar grew in the stomach and traveled downstream past the pylorus",
      "Recanalization failure left an intraluminal duodenal web",
    ],
    correctAnswer: "A cholecystoenteric fistula let a gallstone pass into bowel",
    explanation: `## Why this answer is correct
Chronic cholecystitis can erode a large gallstone into the duodenum or colon. The stone tumbles downstream and lodges where the ileum narrows, causing small-bowel obstruction. Air refluxes into the biliary tree through the fistula. The triad of obstruction, pneumobilia, and an ectopic stone is gallstone ileus.

## Why the other options are wrong
**A stone formed inside a Meckel diverticulum and detached**
A Meckel diverticulum can contain ectopic gastric mucosa and bleed. It does not put air in the biliary tree or start from prior biliary colic.

**Appendicolith migration occluded the terminal ileum**
An appendicolith stays in the appendix and is associated with appendicitis and fever, not pneumobilia.

**A bezoar grew in the stomach and traveled downstream past the pylorus**
A bezoar can obstruct the bowel but does not opacify the biliary tree with air or follow a history of biliary colic.

**Recanalization failure left an intraluminal duodenal web**
Duodenal atresia or a web presents in newborns and would obstruct the duodenum, not produce pneumobilia in an older adult.`,
  },
  {
    slug: "gi-25",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "biochemistry",
    blueprintTopic: "malabsorption",
    topicCategory: "carcinoid",
    citationTitle: "Carcinoid Syndrome",
    scenario:
      "A 57-year-old man has episodic flushing and watery diarrhea. Echocardiography shows thickened, regurgitant tricuspid and pulmonary valves with a normal mitral valve. CT shows a small-bowel mass and multiple liver lesions. Urinary 5-hydroxyindoleacetic acid is markedly elevated. He also has a photosensitive scaly rash on the neck and a red, smooth tongue.",
    question: "Why did the rash and glossitis develop?",
    options: [
      "Tryptophan diverted into serotonin, depleting niacin synthesis",
      "Secretin excess washing bicarbonate out of the pancreas",
      "Glucagon-driven amino-acid catabolism causing migratory erythema",
      "Histamine release from systemic mast-cell degranulation",
      "Vitamin C deficiency from a diet lacking fresh fruit",
    ],
    correctAnswer: "Tryptophan diverted into serotonin, depleting niacin synthesis",
    explanation: `## Why this answer is correct
Carcinoid tumors that drain through liver metastases release serotonin into the systemic circulation. Serotonin is made from tryptophan, so a large tumor mass can consume enough tryptophan to starve nicotinamide synthesis and produce pellagra (dermatitis, diarrhea, glossitis). Monoamine oxidase in the lung clears serotonin, which is why the right-sided valves are injured and the left-sided valves are spared. 5-HIAA is the urinary metabolite.

## Why the other options are wrong
**Secretin excess washing bicarbonate out of the pancreas**
Secretin stimulates pancreatic bicarbonate. It is not the mediator of carcinoid flushing, right-heart valve lesions, or pellagra.

**Glucagon-driven amino-acid catabolism causing migratory erythema**
Glucagonoma causes necrolytic migratory erythema, diabetes, and a low amino-acid pool. It does not raise 5-HIAA or scar right-sided valves.

**Histamine release from systemic mast-cell degranulation**
Mastocytosis can flush, but it does not produce 5-HIAA, isolated right-sided valvular lesions, and a hepatic metastatic pattern from a bowel neuroendocrine tumor.

**Vitamin C deficiency from a diet lacking fresh fruit**
Scurvy causes perifollicular hemorrhage and poor wound healing, not this flushing-valve-5-HIAA constellation. The missing vitamin here is niacin.`,
  },
  {
    slug: "gi-26",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "pancreatitis-enzymes",
    topicCategory: "neuroendocrine-tumor",
    citationTitle: "VIPoma",
    scenario:
      "A 46-year-old woman has large-volume tea-colored diarrhea, muscle weakness, and flushing. Serum potassium is 2.4 mEq/L and bicarbonate is 14 mEq/L. Gastric pH is 6.8. Stool osmotic gap is low. CT shows a 3 cm mass in the pancreatic tail. Fasting gastrin is not elevated. A plasma peptide that stimulates intestinal secretion and relaxes vascular smooth muscle is high.",
    question: "Which peptide effect best unifies these findings?",
    options: [
      "Intestinal chloride secretion with suppression of gastric acid",
      "Parietal-cell hyperplasia from unchecked gastrin release",
      "Alpha-cell glucagon release with necrolytic skin breakdown",
      "Insulin release causing fasting hypoglycemia together with weight gain",
      "Somatostatin release shutting down multiple gut hormones",
    ],
    correctAnswer: "Intestinal chloride secretion with suppression of gastric acid",
    explanation: `## Why this answer is correct
Vasoactive intestinal peptide from a pancreatic neuroendocrine tumor forces the gut to secrete chloride and water (secretory diarrhea, low osmotic gap), wastes potassium and bicarbonate, inhibits gastric acid (achlorhydria, high gastric pH), and dilates vessels (flushing). This is the WDHA pattern.

## Why the other options are wrong
**Parietal-cell hyperplasia from unchecked gastrin release**
Gastrin raises acid and lowers gastric pH, and it causes ulcers. Gastric pH here is high and gastrin is not elevated.

**Alpha-cell glucagon release with necrolytic skin breakdown**
Glucagonoma causes hyperglycemia and a migratory rash, not a huge potassium- and bicarbonate-losing secretory diarrhea with achlorhydria.

**Insulin release causing fasting hypoglycemia together with weight gain**
Insulinoma presents with Whipple triad. It does not cause secretory diarrhea or hypokalemic acidosis.

**Somatostatin release shutting down multiple gut hormones**
Somatostatinoma causes diabetes, steatorrhea, and gallstones from broad inhibitory tone, not this high-volume acid-suppressed diarrhea driven by a secretagogue peptide.`,
  },
  {
    slug: "gi-27",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "pancreatitis-enzymes",
    topicCategory: "neuroendocrine-tumor",
    citationTitle: "Glucagonoma",
    scenario:
      "A 52-year-old woman has a painful blistering rash that migrates across the groin and perineum, a smooth red tongue, and new diabetes. Plasma amino acids are low. Glucose is 286 mg/dL. CT shows a pancreatic body mass that stains for a peptide made by islet alpha cells. Urinary 5-HIAA is normal, and there is no diarrhea of large volume.",
    question: "Which hormone excess produced the rash and hyperglycemia?",
    options: [
      "Glucagon, driving glycogenolysis and amino-acid catabolism",
      "Vasoactive intestinal peptide, opening intestinal chloride channels",
      "Gastrin, stimulating parietal-cell hydrogen-potassium pumps",
      "Insulin, pushing glucose into fat and skeletal muscle",
      "Serotonin, shunting tryptophan away from niacin synthesis",
    ],
    correctAnswer: "Glucagon, driving glycogenolysis and amino-acid catabolism",
    explanation: `## Why this answer is correct
Islet alpha cells make glucagon. Excess glucagon raises hepatic glucose output (diabetes) and consumes amino acids for gluconeogenesis. The hypoaminoacidemia is linked to necrolytic migratory erythema in intertriginous skin and to glossitis. A pancreatic mass staining for that peptide ties the syndrome together.

## Why the other options are wrong
**Vasoactive intestinal peptide, opening intestinal chloride channels**
VIPoma causes high-volume secretory diarrhea, hypokalemia, and achlorhydria. Large-volume diarrhea is absent here.

**Gastrin, stimulating parietal-cell hydrogen-potassium pumps**
Gastrin excess causes acid hypersecretion and ulcers, not a migratory necrolytic rash with hyperglycemia.

**Insulin, pushing glucose into fat and skeletal muscle**
Insulin excess lowers glucose. This patient is hyperglycemic.

**Serotonin, shunting tryptophan away from niacin synthesis**
Carcinoid serotonin excess raises 5-HIAA and can cause pellagra. 5-HIAA is normal, and the mass is an alpha-cell tumor.`,
  },
  {
    slug: "gi-28",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "pancreatitis-enzymes",
    topicCategory: "neuroendocrine-tumor",
    citationTitle: "Insulinoma",
    scenario:
      "A 39-year-old woman has episodes of confusion and sweating that occur before breakfast and resolve after juice. During an episode, plasma glucose is 38 mg/dL, insulin is high, C-peptide is high, proinsulin is high, and a sulfonylurea screen is negative. She has gained weight. There is no access to insulin at her workplace. CT shows a small enhancing pancreatic head mass.",
    question: "Which source is releasing the insulin?",
    options: [
      "Endogenous beta cells cleaving proinsulin to insulin plus C-peptide",
      "Injected insulin that bypasses proinsulin and C-peptide",
      "A sulfonylurea holding beta-cell potassium channels in the closed state",
      "An alpha-cell tumor secreting glucagon in pulsatile bursts",
      "Tumor consumption of glucose without accompanying hormone release",
    ],
    correctAnswer: "Endogenous beta cells cleaving proinsulin to insulin plus C-peptide",
    explanation: `## Why this answer is correct
Beta cells cleave proinsulin into insulin and C-peptide, which are secreted together. An insulinoma therefore raises insulin, C-peptide, and proinsulin during hypoglycemia, satisfying Whipple triad. A negative sulfonylurea screen removes the other common cause of endogenous hyperinsulinism. Weight gain reflects repeated carbohydrate intake and anabolic insulin effect.

## Why the other options are wrong
**Injected insulin that bypasses proinsulin and C-peptide**
Exogenous insulin raises insulin but suppresses C-peptide and proinsulin. Both are high here.

**A sulfonylurea holding beta-cell potassium channels in the closed state**
Sulfonylureas also raise insulin and C-peptide, but the drug screen is negative, so that mechanism is excluded.

**An alpha-cell tumor secreting glucagon in pulsatile bursts**
Glucagon raises glucose. It cannot explain fasting hypoglycemia with high C-peptide.

**Tumor consumption of glucose without accompanying hormone release**
Non-islet tumors can cause hypoglycemia via IGF-2, with suppressed insulin and C-peptide. Insulin and C-peptide are high in this episode.`,
  },
  {
    slug: "gi-29",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "biochemistry",
    blueprintTopic: "malabsorption",
    topicCategory: "malabsorption",
    citationTitle: "Abetalipoproteinemia",
    scenario:
      "A 9-month-old girl has steatorrhea, failure to thrive, and a blood smear crowded with acanthocytes. Plasma triglycerides and total cholesterol are extremely low, and chylomicrons do not appear after a fat meal. ApoB is nearly undetectable. Enterocytes on biopsy are packed with clear lipid vacuoles. By later childhood she is at risk for ataxia and retinitis pigmentosa if fat-soluble vitamins are not replaced.",
    question: "Which assembly step failed inside the enterocyte?",
    options: [
      "Microsomal transfer protein cannot lipidate apoB-48",
      "Pancreatic lipase is absent from the duodenal lumen",
      "Brush-border lactase cannot split dietary lactose",
      "Ileal cubam receptor cannot internalize cobalamin",
      "Bile acids are deconjugated by overgrown colonic flora",
    ],
    correctAnswer: "Microsomal transfer protein cannot lipidate apoB-48",
    explanation: `## Why this answer is correct
Microsomal triglyceride transfer protein loads lipid onto apoB-48 in the enterocyte and onto apoB-100 in the liver. Without it, chylomicrons, VLDL, and LDL cannot be assembled. Lipid trapped in enterocytes produces clear vacuoles and steatorrhea, serum lipids collapse, and red-cell membranes become acanthocytic because they lack exchangeable lipid. Vitamin E deficiency later injures spinocerebellar tracts and the retina.

## Why the other options are wrong
**Pancreatic lipase is absent from the duodenal lumen**
Lipase deficiency causes steatorrhea, but triglyceride would not pack the enterocyte, because fat would never be absorbed across the brush border, and serum apoB would not vanish.

**Brush-border lactase cannot split dietary lactose**
Lactase deficiency causes osmotic diarrhea with a normal lipid profile and normal red-cell shape.

**Ileal cubam receptor cannot internalize cobalamin**
Cobalamin malabsorption causes megaloblastic anemia and neurologic disease, not absent chylomicrons or acanthocytes in infancy.

**Bile acids are deconjugated by overgrown colonic flora**
Bacterial overgrowth can impair micelles. It does not eliminate apoB or stop chylomicron assembly inside the enterocyte.`,
  },
  {
    slug: "gi-30",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "microbiology",
    blueprintTopic: "malabsorption",
    topicCategory: "malabsorption",
    citationTitle: "Whipple Disease",
    scenario:
      "A 54-year-old man has chronic diarrhea, weight loss, migratory arthritis, and a new memory problem. Small-bowel biopsy shows widened villi whose lamina propria is filled with macrophages that stain intensely with periodic acid–Schiff and resist diastase. Electron microscopy shows rod-shaped bacteria inside those macrophages. PCR identifies Tropheryma whipplei. Serum lipids are normal.",
    question: "Why is fat absorption failing despite intact lipase?",
    options: [
      "Lamina propria macrophages block lymphatic fat transport",
      "Enterocytes cannot lipidate apoB-48 in the endoplasmic reticulum",
      "Gastric parietal cells no longer secrete intrinsic factor",
      "Colonic bile acids stimulate chloride secretion without fat loss",
      "Brush-border disaccharidases are selectively missing",
    ],
    correctAnswer: "Lamina propria macrophages block lymphatic fat transport",
    explanation: `## Why this answer is correct
Tropheryma whipplei fills lamina propria macrophages, which distend the villus and obstruct the lacteals that carry chylomicrons. Fat that has already been absorbed cannot leave, so steatorrhea and weight loss follow. The same systemic infection explains migratory seronegative arthritis and central nervous system disease. PAS-positive, diastase-resistant macrophages containing bacilli are the histologic signature.

## Why the other options are wrong
**Enterocytes cannot lipidate apoB-48 in the endoplasmic reticulum**
That is abetalipoproteinemia, which shows lipid-laden enterocytes, absent apoB, and very low serum lipids. Serum lipids here are normal, and the infiltrate is macrophages, not a lipidation defect.

**Gastric parietal cells no longer secrete intrinsic factor**
Intrinsic-factor loss causes cobalamin deficiency, not PAS-positive lamina propria macrophages or this multisystem picture.

**Colonic bile acids stimulate chloride secretion without fat loss**
Bile-acid diarrhea is watery and does not pack the lamina propria with bacteria-filled macrophages.

**Brush-border disaccharidases are selectively missing**
Disaccharidase deficiency causes osmotic carbohydrate diarrhea with a normal biopsy, not PAS-positive macrophages.`,
  },
  {
    slug: "gi-31",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "malabsorption",
    topicCategory: "celiac",
    citationTitle: "Celiac Disease",
    scenario:
      "A 28-year-old woman has bloating, iron deficiency, and an intensely itchy vesicular rash on her elbows. IgA tissue transglutaminase antibody is high, and total IgA is normal. Duodenal biopsy shows villous blunting, crypt hyperplasia, and many intraepithelial lymphocytes. HLA-DQ2 is present. Symptoms and the rash improve after wheat, barley, and rye are removed.",
    question: "Which immune step initiates the mucosal injury?",
    options: [
      "Deamidated gliadin peptides bind HLA-DQ2 and activate CD4 cells",
      "IgE on mast cells binds gluten and releases histamine",
      "Cross-reactive antibody binds parietal-cell proton pumps",
      "Immune complexes deposit along the glomerular basement membrane",
      "Cytotoxic T cells attack ganglion cells in the myenteric plexus",
    ],
    correctAnswer: "Deamidated gliadin peptides bind HLA-DQ2 and activate CD4 cells",
    explanation: `## Why this answer is correct
Tissue transglutaminase deamidates gliadin, creating negatively charged peptides that bind the HLA-DQ2 (or DQ8) groove with high affinity. CD4 T cells that recognize those peptides drive intraepithelial lymphocytosis, crypt hyperplasia, and villous atrophy. IgA against transglutaminase is the serologic marker, and the same IgA deposited in dermal papillae produces dermatitis herpetiformis.

## Why the other options are wrong
**IgE on mast cells binds gluten and releases histamine**
IgE-mediated food allergy is immediate and is not HLA-DQ2–restricted villous atrophy with a transglutaminase antibody.

**Cross-reactive antibody binds parietal-cell proton pumps**
Antiparietal-cell antibodies occur in autoimmune gastritis and pernicious anemia. They do not flatten duodenal villi.

**Immune complexes deposit along the glomerular basement membrane**
That is a type III or anti-GBM renal injury pattern. The target tissue here is small-bowel mucosa and skin.

**Cytotoxic T cells attack ganglion cells in the myenteric plexus**
Loss of myenteric ganglia is Hirschsprung disease or Chagas disease, not a gluten-driven enteropathy that reverses with diet.`,
  },
  {
    slug: "gi-32",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "anatomy",
    blueprintTopic: "ibd-mechanisms",
    topicCategory: "hirschsprung",
    citationTitle: "Hirschsprung Disease",
    scenario:
      "A full-term boy has not passed meconium by 48 hours. The abdomen is distended. A contrast enema shows a narrow rectum and a dilated sigmoid. Rectal suction biopsy contains no ganglion cells in the submucosal or myenteric plexus, and acetylcholinesterase-positive nerve fibers are increased. A RET variant is found. The dilated segment proximal to the narrow zone does contain ganglia.",
    question: "Why does the narrow distal segment stay contracted?",
    options: [
      "Neural-crest ganglia that relax the bowel did not arrive",
      "Smooth muscle failed to form from lateral plate mesoderm",
      "The enteric lumen did not recanalize after a solid stage",
      "A vascular accident infarcted the left colonic wall",
      "Extrinsic parasympathetic axons from the vagus are absent",
    ],
    correctAnswer: "Neural-crest ganglia that relax the bowel did not arrive",
    explanation: `## Why this answer is correct
Hindgut ganglion cells migrate from the neural crest and travel craniocaudally. In Hirschsprung disease they stop short, most often in the rectum. The aganglionic segment lacks inhibitory neurons that release nitric oxide and vasoactive intestinal peptide, so it cannot relax. Proximal ganglionated bowel dilates against that obstruction. RET mutations disturb this migration. Thickened cholinergic nerve trunks raise acetylcholinesterase staining.

## Why the other options are wrong
**Smooth muscle failed to form from lateral plate mesoderm**
The muscle is present. The missing element is the intrinsic ganglia, which is why the proximal, ganglionated bowel can dilate.

**The enteric lumen did not recanalize after a solid stage**
Failed recanalization causes atresia or stenosis, a structural gap or web, not an innervated proximal bowel meeting an aganglionic distal bowel.

**A vascular accident infarcted the left colonic wall**
Ischemic injury would scar or perforate the wall. Biopsy would not show a selective absence of ganglia with hypertrophic nerve fibers.

**Extrinsic parasympathetic axons from the vagus are absent**
The vagus does not supply the distal hindgut ganglia. Those cells are neural-crest derivatives; extrinsic nerves are actually hypertrophic in the aganglionic segment.`,
  },
  {
    slug: "gi-33",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "anatomy",
    blueprintTopic: "pancreatitis-enzymes",
    topicCategory: "annular-pancreas",
    citationTitle: "Annular Pancreas",
    scenario:
      "A 2-day-old boy vomits bilious material. A radiograph shows a double bubble with distal gas. At laparotomy a ring of pancreatic tissue encircles the second portion of the duodenum and narrows it. The duodenal lumen is patent through that ring. There is no malrotation of the midgut and the gallbladder is in the normal fossa.",
    question: "Which embryonic error formed the ring?",
    options: [
      "The ventral pancreatic bud rotated the wrong way around the duodenum",
      "The dorsal pancreatic bud failed to appear anywhere in the dorsal mesentery",
      "The duodenum stayed solid and did not form a lumen",
      "The midgut failed to return from the umbilical cord",
      "The ventral and dorsal buds did not fuse along the main duct",
    ],
    correctAnswer: "The ventral pancreatic bud rotated the wrong way around the duodenum",
    explanation: `## Why this answer is correct
The ventral pancreatic bud normally rotates with the duodenum to lie behind it and fuse with the dorsal bud. If part of the ventral bud rotates in the opposite direction, pancreatic tissue encircles the second duodenum and can obstruct it. Bilious emesis and a double bubble follow. A patent lumen distinguishes this from duodenal atresia, and distal gas can pass if the narrowing is incomplete.

## Why the other options are wrong
**The dorsal pancreatic bud failed to appear anywhere in the dorsal mesentery**
Absence of the dorsal bud would delete the body and tail, not wrap a ring around the duodenum.

**The duodenum stayed solid and did not form a lumen**
Failed recanalization causes duodenal atresia, in which the lumen is interrupted. The lumen here is patent and the obstructing tissue is pancreas.

**The midgut failed to return from the umbilical cord**
Failure of midgut return produces an omphalocele, a membrane-covered abdominal-wall defect, not a pancreatic ring.

**The ventral and dorsal buds did not fuse along the main duct**
Failed fusion is pancreas divisum, in which the dorsal duct drains through the minor papilla. It does not encircle the duodenum.`,
  },
  {
    slug: "gi-34",
    domain: "gastrointestinal",
    band: "hard",
    difficulty: 5,
    subjectId: "anatomy",
    blueprintTopic: "gi-bleeding-sources",
    topicCategory: "meckel",
    citationTitle: "Meckel Diverticulum",
    scenario:
      "A 3-year-old boy has several painless maroon stools. He is afebrile and the abdomen is soft. A technetium-99m pertechnetate scan shows a focus of uptake in the right lower quadrant that appears at the same time as the stomach. At surgery a 5 cm outpouching on the antimesenteric ileum, about 60 cm from the ileocecal valve, contains gastric mucosa next to a small ulcer in the adjacent ileum. The umbilical cord scar is dry.",
    question: "Which remnant is bleeding, and why?",
    options: [
      "A vitelline-duct remnant whose gastric mucosa secretes acid",
      "A urachal remnant that communicates with the bladder dome",
      "A persistent processus vaginalis filling with peritoneal fluid",
      "An omphalomesenteric ligament that has volvulized the midgut",
      "Failed recanalization leaving a duodenal intraluminal web",
    ],
    correctAnswer: "A vitelline-duct remnant whose gastric mucosa secretes acid",
    explanation: `## Why this answer is correct
The vitelline (omphalomesenteric) duct can leave a true diverticulum of the ileum on the antimesenteric border. Ectopic gastric mucosa in that diverticulum takes up pertechnetate, just as the stomach does, and secretes acid that ulcerates the neighboring ileal mucosa. The result is painless hematochezia in a toddler.

## Why the other options are wrong
**A urachal remnant that communicates with the bladder dome**
A patent urachus leaks urine at the umbilicus. It is a hindgut-allantois remnant, not an ileal outpouching that concentrates pertechnetate.

**A persistent processus vaginalis filling with peritoneal fluid**
A patent processus vaginalis causes an indirect inguinal hernia or hydrocele. It does not contain gastric mucosa or bleed into the ileum.

**An omphalomesenteric ligament that has volvulized the midgut**
A fibrous vitelline band can cause obstruction or volvulus, but this child has painless bleeding from an open diverticulum with gastric mucosa, and the abdomen is soft.

**Failed recanalization leaving a duodenal intraluminal web**
A duodenal web obstructs the duodenum in neonates. It does not sit on the antimesenteric ileum or take up pertechnetate.`,
  },
];

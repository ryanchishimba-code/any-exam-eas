/**
 * Step 1 gap batch — gastrointestinal (34). Hidden until a later activation.
 * Bands: 6 easy (difficulty 2), 11 medium (3), 17 hard (5).
 */
export const GI_ITEMS = [
  {
    slug: "gi-01",
    domain: "gastrointestinal",
    band: "easy",
    difficulty: 2,
    subjectId: "physiology",
    blueprintTopic: "malabsorption",
    topicCategory: "malabsorption",
    citationTitle: "Lactose Intolerance",
    scenario:
      "A 26-year-old woman has cramping and watery stools within two hours after milk or ice cream. Symptoms are absent when she avoids dairy. Stool pH is 5.1 and stool osmotic gap is 140 mOsm/kg. A hydrogen breath test rises after a lactose load. Duodenal biopsy shows normal villi.",
    question: "Which process best accounts for the diarrhea?",
    options: [
      "Osmotic retention of an unabsorbed dietary disaccharide load",
      "Toxin-mediated opening of crypt epithelial chloride channels",
      "Loss of villous surface from immune-mediated enterocyte injury",
      "Colonic secretion driven by unabsorbed dihydroxy bile acids",
      "Failure to hydrolyze triglyceride inside the intestinal lumen",
    ],
    correctAnswer: "Osmotic retention of an unabsorbed dietary disaccharide load",
    explanation: `## Why this answer is correct
Brush-border lactase normally splits lactose into glucose and galactose. When lactase activity is low, lactose remains in the lumen, holds water (osmotic gap well above 50 mOsm/kg), and is fermented by colonic bacteria to hydrogen and short-chain acids, which lowers stool pH. A normal duodenal biopsy separates this from diseases that destroy villi.

## Why the other options are wrong
**Toxin-mediated opening of crypt epithelial chloride channels**
That mechanism produces secretory diarrhea, as with cholera toxin, and the stool osmotic gap is low. This patient's gap is high and the trigger is a specific sugar.

**Loss of villous surface from immune-mediated enterocyte injury**
Villous atrophy, as in celiac disease, would be visible on duodenal biopsy. The mucosa here is intact.

**Colonic secretion driven by unabsorbed dihydroxy bile acids**
Bile acids reaching the colon cause a secretory diarrhea, typically after ileal resection, and do not produce a high osmotic gap after milk ingestion.

**Failure to hydrolyze triglyceride inside the intestinal lumen**
Pancreatic lipase deficiency causes steatorrhea, not watery stools timed to dairy with an acidic, high-gap stool.`,
  },
  {
    slug: "gi-02",
    domain: "gastrointestinal",
    band: "easy",
    difficulty: 2,
    subjectId: "biochemistry",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Gilbert Syndrome",
    scenario:
      "A 19-year-old man is noticed to have yellow sclerae during a viral illness and again after skipping meals before examinations. He feels well between episodes. Total bilirubin is 2.8 mg/dL, direct bilirubin 0.3 mg/dL, and hemoglobin, reticulocyte count, haptoglobin, AST, and ALT are normal. Ultrasound of the liver is normal.",
    question: "Which hepatic step is functioning below capacity?",
    options: [
      "Conjugation of bilirubin by UDP-glucuronosyltransferase",
      "Canalicular export of already conjugated bilirubin",
      "Hepatocyte uptake of unconjugated bilirubin from plasma",
      "Synthesis of albumin and clotting factors by hepatocytes",
      "Extrahepatic clearance of bilirubin by renal glomeruli",
    ],
    correctAnswer: "Conjugation of bilirubin by UDP-glucuronosyltransferase",
    explanation: `## Why this answer is correct
Gilbert syndrome is a partial reduction in UGT1A1 activity. Unconjugated bilirubin rises when hepatic conjugating capacity is stressed by fasting or illness, while transaminases, hemolysis markers, and liver imaging stay normal. The hyperbilirubinemia is indirect and benign.

## Why the other options are wrong
**Canalicular export of already conjugated bilirubin**
Impaired canalicular export, as in Dubin-Johnson syndrome, raises conjugated (direct) bilirubin. Direct bilirubin here is normal.

**Hepatocyte uptake of unconjugated bilirubin from plasma**
Uptake defects are not the lesion in Gilbert syndrome, and they are not the enzyme step that phenobarbital can induce in related conjugating disorders.

**Synthesis of albumin and clotting factors by hepatocytes**
Synthetic function is intact: there is no hypoalbuminemia, coagulopathy, or aminotransferase elevation.

**Extrahepatic clearance of bilirubin by renal glomeruli**
Unconjugated bilirubin is albumin-bound and is not filtered in meaningful amounts. The kidney is not the rate-limiting step being described.`,
  },
  {
    slug: "gi-03",
    domain: "gastrointestinal",
    band: "easy",
    difficulty: 2,
    subjectId: "microbiology",
    blueprintTopic: "gi-bleeding-sources",
    topicCategory: "peptic-ulcer",
    citationTitle: "Helicobacter Pylori",
    scenario:
      "A 44-year-old man has recurrent epigastric burning. Upper endoscopy shows a nonbleeding duodenal bulb ulcer. A gastric biopsy is placed in a medium containing urea and a pH indicator; the medium turns alkaline within minutes. He has not taken antibiotics or a proton-pump inhibitor in the past month.",
    question: "Which bacterial activity produced the alkaline shift?",
    options: [
      "Rapid hydrolysis of urea to ammonia and carbon dioxide",
      "Fermentation of glucose to lactic acid in the medium",
      "Decarboxylation of histidine with histamine release",
      "Reduction of nitrate to nitrite at the mucosal surface",
      "Cleavage of mucus glycoproteins by secreted protease",
    ],
    correctAnswer: "Rapid hydrolysis of urea to ammonia and carbon dioxide",
    explanation: `## Why this answer is correct
Helicobacter pylori produces urease, which splits urea into ammonia and carbon dioxide. Ammonia raises the pH of the biopsy medium, which is the basis of the rapid urease test, and also buffers gastric acid around the organism.

## Why the other options are wrong
**Fermentation of glucose to lactic acid in the medium**
Lactic acid would lower pH. The observed change is alkaline, so acid production cannot explain it.

**Decarboxylation of histidine with histamine release**
Histamine from enterochromaffin-like cells stimulates acid secretion. It is not the enzyme activity detected by a urea medium.

**Reduction of nitrate to nitrite at the mucosal surface**
Nitrate reduction is a biochemical property of other enteric organisms and does not alkalinize a urea indicator medium.

**Cleavage of mucus glycoproteins by secreted protease**
Mucin degradation helps colonization but does not generate ammonia from urea or change the color of this assay.`,
  },
  {
    slug: "gi-04",
    domain: "gastrointestinal",
    band: "easy",
    difficulty: 2,
    subjectId: "physiology",
    blueprintTopic: "malabsorption",
    topicCategory: "malabsorption",
    citationTitle: "Short Bowel Syndrome",
    scenario:
      "A 63-year-old woman develops watery diarrhea three weeks after resection of 70 cm of terminal ileum for ischemia. There is no blood or fever. Fecal elastase is normal, fecal fat is not increased, and the stool osmotic gap is 28 mOsm/kg. The colon and remaining small bowel look uninflamed.",
    question: "Which driver best explains the ongoing diarrhea?",
    options: [
      "Colonic chloride secretion stimulated by bile acids",
      "Osmotic load from carbohydrate left in the lumen",
      "Loss of pancreatic bicarbonate delivery to the gut",
      "Active toxin increasing crypt cyclic AMP synthesis",
      "Inflammatory exudate leaking across damaged mucosal surface",
    ],
    correctAnswer: "Colonic chloride secretion stimulated by bile acids",
    explanation: `## Why this answer is correct
The terminal ileum reclaims bile acids. After a limited ileal resection, unabsorbed dihydroxy bile acids reach the colon and stimulate chloride and water secretion. The low osmotic gap fits a secretory diarrhea, and normal fecal elastase and fecal fat argue against maldigestion of fat.

## Why the other options are wrong
**Osmotic load from carbohydrate left in the lumen**
An osmotic diarrhea has a high stool osmotic gap. The gap here is low, and the history is tied to ileal loss rather than a dietary sugar.

**Loss of pancreatic bicarbonate delivery to the gut**
Pancreatic exocrine failure causes steatorrhea and a low fecal elastase. Both are normal in this patient.

**Active toxin increasing crypt cyclic AMP synthesis**
Enterotoxins can cause secretory diarrhea, but nothing in the history suggests infection, and the onset follows loss of the ileal bile-acid pump.

**Inflammatory exudate leaking across damaged mucosal surface**
The remaining bowel is uninflamed and the stool is not bloody, so an exudative diarrhea is not supported.`,
  },
  {
    slug: "gi-05",
    domain: "gastrointestinal",
    band: "easy",
    difficulty: 2,
    subjectId: "physiology",
    blueprintTopic: "pancreatitis-enzymes",
    topicCategory: "pancreatic-insufficiency",
    citationTitle: "Cystic Fibrosis",
    scenario:
      "A 4-month-old boy has bulky, greasy stools and poor weight gain. Sweat chloride is 92 mmol/L. Fecal elastase is very low. A duodenal aspirate shows low lipase activity and a low pH. He has had two pneumonias. Genotyping finds two disease-causing CFTR variants.",
    question: "Which ductal defect initiated the pancreatic injury?",
    options: [
      "Impaired chloride and bicarbonate secretion into the duct",
      "Premature activation of trypsin inside the acinar cell itself",
      "Autoimmune destruction of islet beta cells by T cells",
      "Obstruction of the ampulla by a retained gallstone",
      "Deficient enteropeptidase activation of trypsinogen",
    ],
    correctAnswer: "Impaired chloride and bicarbonate secretion into the duct",
    explanation: `## Why this answer is correct
CFTR secretes chloride and, with linked exchangers, bicarbonate into the pancreatic duct. Without it, ductal fluid is viscous and acidic, plugs obstruct the ducts, and acini are destroyed. Lipase never reaches the lumen, so triglyceride is not hydrolyzed and steatorrhea follows. Low fecal elastase confirms loss of exocrine delivery.

## Why the other options are wrong
**Premature activation of trypsin inside the acinar cell itself**
That sequence is the start of acute pancreatitis. This infant has chronic exocrine failure from inspissated secretions, not an acute autodigestive attack.

**Autoimmune destruction of islet beta cells by T cells**
Beta-cell loss causes insulin deficiency. The sweat chloride, infections, and absent fecal elastase point to exocrine ductal disease.

**Obstruction of the ampulla by a retained gallstone**
Gallstone obstruction is a cause of acute pancreatitis in adults. It does not produce an abnormal sweat chloride or biallelic CFTR variants.

**Deficient enteropeptidase activation of trypsinogen**
Enteropeptidase deficiency is a rare isolated brush-border disorder. It does not explain the sweat test or the low volume of enzyme actually delivered into the duodenum.`,
  },
  {
    slug: "gi-06",
    domain: "gastrointestinal",
    band: "easy",
    difficulty: 2,
    subjectId: "biochemistry",
    blueprintTopic: "malabsorption",
    topicCategory: "malabsorption",
    citationTitle: "Vitamin B12 Deficiency",
    scenario:
      "A 36-year-old man with Crohn disease had the terminal ileum removed four years ago. He now has numbness in his feet and an unsteady gait in the dark. Hemoglobin is 9.6 g/dL, MCV 118 fL, methylmalonic acid is elevated, and homocysteine is elevated. Anti-intrinsic-factor antibodies are absent. Folate was repleted without neurologic improvement.",
    question: "Which absorptive step is missing?",
    options: [
      "Ileal uptake of intrinsic-factor-bound cobalamin",
      "Duodenal uptake of folate monoglutamate by proton coupling",
      "Gastric hydrolysis of dietary protein by pepsin",
      "Jejunal absorption of iron on the ferrous transporter",
      "Colonic salvage of vitamin K made by gut bacteria",
    ],
    correctAnswer: "Ileal uptake of intrinsic-factor-bound cobalamin",
    explanation: `## Why this answer is correct
The cubam receptor in the terminal ileum internalizes the intrinsic-factor–cobalamin complex. After ileal resection that step is gone. Cobalamin deficiency produces megaloblastic anemia plus demyelination of the dorsal and lateral columns. Methylmalonyl-CoA mutase needs adenosylcobalamin, so methylmalonic acid rises; folate repletion does not repair the cord.

## Why the other options are wrong
**Duodenal uptake of folate monoglutamate by proton coupling**
Folate deficiency can cause megaloblastic anemia but not elevated methylmalonic acid or this pattern of posterior-column loss, and the ileum is not the folate site.

**Gastric hydrolysis of dietary protein by pepsin**
Pepsin is not required for cobalamin absorption. Intrinsic factor is made by parietal cells, and antibodies against it are absent here; the missing anatomy is ileum.

**Jejunal absorption of iron on the ferrous transporter**
Iron deficiency causes a low MCV, not a macrocytic anemia with an elevated methylmalonic acid.

**Colonic salvage of vitamin K made by gut bacteria**
Vitamin K deficiency prolongs the prothrombin time. It does not enlarge red cells or raise methylmalonic acid.`,
  },
  {
    slug: "gi-07",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Wilson Disease",
    scenario:
      "A 17-year-old boy has a new tremor, slurred speech, and declining school performance. Slit-lamp examination shows golden-brown corneal rings. Serum ceruloplasmin is low, and a liver biopsy contains excess copper. AST is 96 U/L. There is no history of transfusion or alcohol use. His parents are healthy.",
    question: "Which hepatocyte transport step has failed?",
    options: [
      "ATP-dependent export of copper into bile and ceruloplasmin",
      "Hepcidin-regulated export of iron through ferroportin",
      "Canalicular flippase export of phosphatidylcholine",
      "Sinusoidal uptake of conjugated bile acids from portal blood",
      "Microsomal conjugation of bilirubin before canalicular exit",
    ],
    correctAnswer: "ATP-dependent export of copper into bile and ceruloplasmin",
    explanation: `## Why this answer is correct
ATP7B loads copper onto apoceruloplasmin and moves excess copper into bile. When the pump fails, copper accumulates in hepatocytes and basal ganglia, ceruloplasmin (which is unstable without copper) falls, and copper deposits in Descemet membrane as Kayser-Fleischer rings.

## Why the other options are wrong
**Hepcidin-regulated export of iron through ferroportin**
That axis is disordered in hereditary hemochromatosis. Iron overload does not lower ceruloplasmin or form corneal copper rings.

**Canalicular flippase export of phosphatidylcholine**
MDR3 (ABCB4) deficiency causes cholestasis and small-duct injury, not copper storage or a movement disorder.

**Sinusoidal uptake of conjugated bile acids from portal blood**
NTCP and related uptake carriers move bile acids into the hepatocyte. Their failure is not the lesion that deposits copper in the cornea and brain.

**Microsomal conjugation of bilirubin before canalicular exit**
UGT1A1 deficiency raises unconjugated bilirubin. It does not drop ceruloplasmin or raise hepatic copper.`,
  },
  {
    slug: "gi-08",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Hemochromatosis",
    scenario:
      "A 52-year-old man has bronze skin, new insulin-requiring diabetes, and arthropathy of the second and third metacarpophalangeal joints. Ferritin is 1,480 ng/mL and transferrin saturation is 86%. A brother has a similar illness. Echocardiography shows a restrictive cardiomyopathy. He does not drink alcohol.",
    question: "Which regulatory failure increased intestinal iron uptake?",
    options: [
      "Insufficient hepcidin, leaving ferroportin active on enterocytes",
      "Excess hepcidin, locking iron inside duodenal enterocytes",
      "Loss of transferrin, so absorbed iron cannot reach marrow",
      "Failure of ceruloplasmin to oxidize iron for transferrin loading",
      "Block of heme oxygenase, trapping iron inside erythrocytes",
    ],
    correctAnswer: "Insufficient hepcidin, leaving ferroportin active on enterocytes",
    explanation: `## Why this answer is correct
HFE disease lowers hepatic hepcidin. Without hepcidin to internalize and degrade ferroportin, enterocytes and macrophages keep exporting iron. Transferrin saturation and ferritin rise, and iron deposits in liver, pancreas, skin, pituitary, joints, and heart.

## Why the other options are wrong
**Excess hepcidin, locking iron inside duodenal enterocytes**
High hepcidin causes iron restriction, as in anemia of inflammation, with a low transferrin saturation. This patient is iron-overloaded.

**Loss of transferrin, so absorbed iron cannot reach marrow**
Atransferrinemia is a rare cause of tissue iron overload with a low transferrin, not the common familial pattern of high saturation plus diabetes and arthropathy.

**Failure of ceruloplasmin to oxidize iron for transferrin loading**
Aceruloplasminemia impairs iron efflux and causes neurodegeneration with low ceruloplasmin. It is not the HFE–hepcidin mechanism, and ceruloplasmin is not the missing signal here.

**Block of heme oxygenase, trapping iron inside erythrocytes**
Heme oxygenase releases iron from heme. Blocking it would not produce parenchymal iron overload with a high transferrin saturation.`,
  },
  {
    slug: "gi-09",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Alpha-1 Antitrypsin Deficiency",
    scenario:
      "A 48-year-old man who has never smoked has basal-predominant panacinar emphysema and cirrhosis. Serum alpha-1 antitrypsin is low. A liver biopsy shows round eosinophilic globules in periportal hepatocytes that remain positive after diastase digestion on a periodic acid–Schiff stain. Genotyping is consistent with a severe deficient allele.",
    question: "Why do the hepatocytes contain those globules?",
    options: [
      "Misfolded protein is retained inside the endoplasmic reticulum",
      "Copper-binding protein polymerizes inside lysosomes",
      "Iron accumulates as hemosiderin after hepcidin loss",
      "Glycogen cannot be broken down by lysosomal acid maltase",
      "Bilirubin pigments precipitate after canalicular blockade of flow",
    ],
    correctAnswer: "Misfolded protein is retained inside the endoplasmic reticulum",
    explanation: `## Why this answer is correct
The Z variant of alpha-1 antitrypsin misfolds and polymerizes in the hepatocyte endoplasmic reticulum. Those polymers are the diastase-resistant PAS-positive globules. Retention injures the liver, while the low circulating antiprotease allows neutrophil elastase to destroy alveolar walls, especially at the bases.

## Why the other options are wrong
**Copper-binding protein polymerizes inside lysosomes**
Copper accumulation is Wilson disease. It does not form diastase-resistant PAS globules or basal panacinar emphysema.

**Iron accumulates as hemosiderin after hepcidin loss**
Hemosiderin is an iron pigment, highlighted by Prussian blue, not by PAS after diastase.

**Glycogen cannot be broken down by lysosomal acid maltase**
Acid maltase deficiency stores glycogen in lysosomes, prominently in muscle. It is not a cause of cirrhosis plus early emphysema.

**Bilirubin pigments precipitate after canalicular blockade of flow**
Cholestatic pigment is not diastase-resistant PAS material, and it does not explain the emphysema.`,
  },
  {
    slug: "gi-10",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "biochemistry",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Crigler-Najjar Syndrome",
    scenario:
      "A 3-day-old boy develops deep jaundice. Total bilirubin is 28 mg/dL and direct bilirubin is 0.4 mg/dL. Hemoglobin, reticulocytes, and liver enzymes are normal. Phototherapy is started. Phenobarbital does not lower the bilirubin. An older sibling died with kernicterus in the first month of life. The parents are cousins.",
    question: "Which enzymatic capacity is absent?",
    options: [
      "Bilirubin conjugation by UDP-glucuronosyltransferase",
      "Canalicular export of conjugated bilirubin by MRP2",
      "Heme cleavage to biliverdin by heme oxygenase",
      "Reduction of biliverdin to unconjugated bilirubin",
      "Albumin binding of bilirubin within the vascular space",
    ],
    correctAnswer: "Bilirubin conjugation by UDP-glucuronosyltransferase",
    explanation: `## Why this answer is correct
Crigler-Najjar type I is complete loss of UGT1A1. Bilirubin cannot be conjugated, so unconjugated bilirubin rises to levels that enter the neonatal brain. Phenobarbital cannot induce an enzyme that is absent, which separates type I from the partial type II deficiency.

## Why the other options are wrong
**Canalicular export of conjugated bilirubin by MRP2**
MRP2 loss (Dubin-Johnson) raises conjugated bilirubin and does not cause neonatal kernicterus from an indirect fraction this high.

**Heme cleavage to biliverdin by heme oxygenase**
Blocking heme oxygenase would decrease bilirubin production. This infant has overproduction of the unconjugated pigment relative to conjugating capacity, not a block in heme cleavage.

**Reduction of biliverdin to unconjugated bilirubin**
Loss of biliverdin reductase would lower, not raise, unconjugated bilirubin.

**Albumin binding of bilirubin within the vascular space**
Albumin binding is intact. The danger is that the unbound unconjugated fraction rises once conjugating capacity is zero.`,
  },
  {
    slug: "gi-11",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Dubin-Johnson Syndrome",
    scenario:
      "A 22-year-old woman has mild jaundice that deepens during pregnancy. She feels well. Total bilirubin is 4.1 mg/dL with a direct fraction of 2.9 mg/dL. Transaminases, alkaline phosphatase, hemoglobin, and ultrasound are normal. A prior laparoscopic view described a grossly black liver. Urinary coproporphyrin I is the predominant isomer.",
    question: "Which transport step is impaired?",
    options: [
      "Canalicular secretion of conjugated bilirubin",
      "Microsomal conjugation of unconjugated bilirubin",
      "Ileal reabsorption of conjugated bile acids",
      "Sinusoidal uptake of unconjugated bilirubin",
      "Splenic macrophage conversion of heme to bilirubin",
    ],
    correctAnswer: "Canalicular secretion of conjugated bilirubin",
    explanation: `## Why this answer is correct
Dubin-Johnson syndrome is loss of MRP2 (ABCC2), the canalicular transporter for conjugated bilirubin and other organic anions. Conjugated bilirubin refluxes into plasma, the liver turns black from retained epinephrine metabolites, and coproporphyrin I predominates in urine. Synthetic function and alkaline phosphatase stay normal.

## Why the other options are wrong
**Microsomal conjugation of unconjugated bilirubin**
Conjugation defects (Gilbert, Crigler-Najjar) raise the indirect fraction. Most of this patient's bilirubin is direct.

**Ileal reabsorption of conjugated bile acids**
The ileal bile-acid transporter is unrelated to a black liver or isolated conjugated hyperbilirubinemia with normal enzymes.

**Sinusoidal uptake of unconjugated bilirubin**
An uptake defect would accumulate unconjugated bilirubin, not a predominantly direct fraction with a black liver.

**Splenic macrophage conversion of heme to bilirubin**
That step generates unconjugated bilirubin. Slowing it would not raise the direct fraction or pigment the liver black.`,
  },
  {
    slug: "gi-12",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Primary Biliary Cholangitis",
    scenario:
      "A 49-year-old woman has months of itching and fatigue. She has xanthelasmas. Alkaline phosphatase is 612 U/L, AST 64 U/L, and ALT 71 U/L. Antimitochondrial antibody is positive. Liver biopsy shows destruction of interlobular bile ducts and portal granulomas. Extrahepatic ducts are not dilated.",
    question: "Which structure is the main target of the immune attack?",
    options: [
      "Interlobular bile duct epithelium inside portal tracts",
      "Hepatocytes dying at the interface with portal inflammation",
      "Extrahepatic ducts along their full length",
      "Sinusoidal endothelial cells lining the liver plates",
      "Gallbladder epithelium and the cystic duct wall",
    ],
    correctAnswer: "Interlobular bile duct epithelium inside portal tracts",
    explanation: `## Why this answer is correct
Primary biliary cholangitis is a T-cell attack on biliary epithelial cells of the interlobular and septal ducts, often with granulomas (the florid duct lesion). Antimitochondrial antibodies recognize PDC-E2 on those cells. The result is chronic cholestasis with a high alkaline phosphatase and normal-caliber extrahepatic ducts.

## Why the other options are wrong
**Hepatocytes dying at the interface with portal inflammation**
Interface hepatitis is the pattern of autoimmune hepatitis, which raises aminotransferases more than alkaline phosphatase and is associated with smooth-muscle antibodies.

**Extrahepatic ducts along their full length**
Beading and strictures of intrahepatic and extrahepatic ducts define primary sclerosing cholangitis. Imaging here shows no extrahepatic dilation or stricture.

**Sinusoidal endothelial cells lining the liver plates**
Sinusoidal injury is the pattern of sinusoidal obstruction syndrome, not a granulomatous duct-centered cholangitis.

**Gallbladder epithelium and the cystic duct wall**
Cholecystitis centers on the gallbladder. It does not produce antimitochondrial antibodies or vanishing interlobular ducts.`,
  },
  {
    slug: "gi-13",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Primary Sclerosing Cholangitis",
    scenario:
      "A 38-year-old man with a 12-year history of ulcerative colitis has pruritus and a rising alkaline phosphatase. MR cholangiography shows multifocal strictures and dilatations of intrahepatic and extrahepatic ducts. Perinuclear ANCA is positive and antimitochondrial antibody is negative. Biopsy of a medium duct shows concentric fibrosis around the duct.",
    question: "Which duct lesion matches this cholangiogram?",
    options: [
      "Concentric periductal fibrosis producing a beaded duct",
      "Granulomatous destruction limited to interlobular ducts",
      "Portal plasma-cell infiltrate attacking hepatocytes",
      "Suppurative infection ascending from an obstructed ampulla",
      "Ischemic necrosis of ducts after hepatic artery thrombosis",
    ],
    correctAnswer: "Concentric periductal fibrosis producing a beaded duct",
    explanation: `## Why this answer is correct
Primary sclerosing cholangitis scars medium and large bile ducts with onion-skin fibrosis. Alternating strictures and dilatations look beaded on cholangiography. It is strongly associated with ulcerative colitis, and cholangiocarcinoma is a later risk. Antimitochondrial antibody is negative.

## Why the other options are wrong
**Granulomatous destruction limited to interlobular ducts**
That is the florid duct lesion of primary biliary cholangitis, which is antimitochondrial-antibody positive and does not bead the extrahepatic ducts.

**Portal plasma-cell infiltrate attacking hepatocytes**
Interface hepatitis is autoimmune hepatitis. Aminotransferases dominate, and the cholangiogram is normal.

**Suppurative infection ascending from an obstructed ampulla**
Acute ascending cholangitis causes fever, jaundice, and purulent ducts. It is an acute infection, not a chronic fibrosing disease linked to colitis.

**Ischemic necrosis of ducts after hepatic artery thrombosis**
Hepatic-artery ischemic cholangiopathy can stricture ducts, usually after transplant or thrombosis. It is not linked to ulcerative colitis or a perinuclear ANCA.`,
  },
  {
    slug: "gi-14",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Autoimmune Hepatitis",
    scenario:
      "A 24-year-old woman has jaundice, amenorrhea, and malaise. AST is 980 U/L, ALT 1,100 U/L, alkaline phosphatase 118 U/L, and IgG is twice the upper limit. Antinuclear and anti-smooth-muscle antibodies are positive. Viral hepatitis serologies are negative. Biopsy shows interface hepatitis with plasma cells and no bile-duct loss.",
    question: "Which histologic process is underway at the limiting plate?",
    options: [
      "Immune-mediated hepatocyte death at the portal interface",
      "Granulomatous destruction of interlobular bile ducts",
      "Onion-skin fibrosis around medium-sized bile ducts",
      "Macrovesicular steatosis progressing to ballooned hepatocytes",
      "Centrilobular hemorrhagic necrosis from outflow block",
    ],
    correctAnswer: "Immune-mediated hepatocyte death at the portal interface",
    explanation: `## Why this answer is correct
Autoimmune hepatitis is a hepatocyte-directed attack. Portal lymphocytes and plasma cells spill through the limiting plate and kill periportal hepatocytes (interface hepatitis). Aminotransferases and IgG are high, smooth-muscle or antinuclear antibodies are typical, and the bile ducts are spared.

## Why the other options are wrong
**Granulomatous destruction of interlobular bile ducts**
That lesion defines primary biliary cholangitis and raises alkaline phosphatase out of proportion to the aminotransferases.

**Onion-skin fibrosis around medium-sized bile ducts**
Concentric duct fibrosis is primary sclerosing cholangitis, which has an abnormal cholangiogram rather than this enzyme pattern.

**Macrovesicular steatosis progressing to ballooned hepatocytes**
Steatohepatitis shows fat, ballooning, and Mallory-Denk bodies. It is not a plasma-cell interface hepatitis with smooth-muscle antibodies.

**Centrilobular hemorrhagic necrosis from outflow block**
Hepatic-vein thrombosis causes centrilobular congestion. The biopsy described here is portal and interface-based.`,
  },
  {
    slug: "gi-15",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Hepatocellular Adenoma",
    scenario:
      "A 32-year-old woman on a combined oral contraceptive for 11 years has sudden right-upper-quadrant pain and hypotension. CT shows a subcapsular hepatic mass with hemorrhage and no central scar. Resection shows sheets of hepatocytes without portal tracts or bile ductules. Serum alpha-fetoprotein is normal.",
    question: "Which lesion accounts for the hemorrhage?",
    options: [
      "Benign hepatocytes lacking portal tracts, prone to bleed",
      "Hyperplastic liver around an anomalous central artery",
      "Malignant hepatocytes producing alpha-fetoprotein",
      "Vascular channels lined by malignant endothelial tumor cells",
      "A regenerative nodule inside a cirrhotic liver",
    ],
    correctAnswer: "Benign hepatocytes lacking portal tracts, prone to bleed",
    explanation: `## Why this answer is correct
Hepatocellular adenoma is a benign proliferation of hepatocytes that lacks portal tracts and bile ducts. Estrogen exposure is a classic driver. Subcapsular adenomas are supplied by arteries and can rupture into the peritoneum, causing hemorrhagic shock. Alpha-fetoprotein stays normal, unlike most hepatocellular carcinomas.

## Why the other options are wrong
**Hyperplastic liver around an anomalous central artery**
That description is focal nodular hyperplasia, which has a central scar and contains bile ductules. It rarely bleeds.

**Malignant hepatocytes producing alpha-fetoprotein**
Hepatocellular carcinoma usually arises in a diseased liver and often raises alpha-fetoprotein. The mass here lacks that marker and is histologically benign.

**Vascular channels lined by malignant endothelial tumor cells**
Hepatic angiosarcoma is a vascular malignancy linked to vinyl chloride, arsenic, or thorotrast, not to oral contraceptives and not composed of hepatocytes.

**A regenerative nodule inside a cirrhotic liver**
Regenerative nodules occur in cirrhosis. This patient has no described chronic liver disease, and the histology is an adenoma.`,
  },
  {
    slug: "gi-16",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "liver-pathology",
    topicCategory: "liver-pathology",
    citationTitle: "Focal Nodular Hyperplasia",
    scenario:
      "A 29-year-old woman has a 4 cm liver mass found on imaging done for unrelated abdominal pain. She takes no hormones. The mass enhances in the arterial phase and has a central stellate scar. Biopsy shows bland hepatocytes, bile ductules, and thick-walled arteries in a fibrous scar. Alpha-fetoprotein is normal, and the remaining liver is not cirrhotic.",
    question: "What process produced this mass?",
    options: [
      "Hyperplasia downstream of an abnormal feeding artery",
      "Estrogen-driven hepatocytes that lack bile ductules",
      "Malignant transformation of a cirrhotic regenerative nodule",
      "Metastatic gland-forming carcinoma from the colon",
      "Congenital cyst lined by biliary epithelium",
    ],
    correctAnswer: "Hyperplasia downstream of an abnormal feeding artery",
    explanation: `## Why this answer is correct
Focal nodular hyperplasia is a polyclonal hyperplastic response to localized hyperperfusion from an anomalous artery. The artery sits in a central stellate scar, and the surrounding liver contains normal hepatocytes plus bile ductules. It is benign and is not driven by the absence of portal structures.

## Why the other options are wrong
**Estrogen-driven hepatocytes that lack bile ductules**
Hepatocellular adenoma lacks bile ducts and portal tracts and is the lesion associated with long estrogen exposure and rupture. Ductules are present in this biopsy.

**Malignant transformation of a cirrhotic regenerative nodule**
Hepatocellular carcinoma arises in chronic liver disease. The background liver is not cirrhotic and alpha-fetoprotein is normal.

**Metastatic gland-forming carcinoma from the colon**
Metastasis would show malignant glands, not bland hepatocytes organized around a vascular scar.

**Congenital cyst lined by biliary epithelium**
A biliary cyst is a fluid-filled space, not a solid arterialized mass with a central scar.`,
  },
  {
    slug: "gi-17",
    domain: "gastrointestinal",
    band: "medium",
    difficulty: 3,
    subjectId: "physiology",
    blueprintTopic: "gi-bleeding-sources",
    topicCategory: "peptic-ulcer",
    citationTitle: "Gastrinoma",
    scenario:
      "A 41-year-old man has recurrent ulcers in the distal duodenum and jejunum despite acid suppression, plus watery diarrhea. Fasting gastrin is 1,200 pg/mL while gastric pH is 1.4. Secretin infusion raises gastrin further. A brother had hyperparathyroidism and a pituitary mass. Stool fat is increased.",
    question: "Why is fat absorption failing?",
    options: [
      "Excess acid denatures lipase and precipitates bile acids",
      "Loss of the terminal ileum interrupts the bile-acid cycle",
      "Villous atrophy prevents micelle contact with enterocytes",
      "Pancreatic duct plugs stop enzyme delivery to the gut",
      "Bacterial overgrowth deconjugates bile acids in a blind loop",
    ],
    correctAnswer: "Excess acid denatures lipase and precipitates bile acids",
    explanation: `## Why this answer is correct
A gastrinoma drives unchecked parietal-cell acid secretion. The acid load inactivates pancreatic lipase and precipitates bile acids, so micelles do not form and fat is malabsorbed. Ulcers distal to the duodenal bulb, gastrin that rises after secretin, and a family pattern of parathyroid and pituitary tumors fit gastrinoma within MEN1. In achlorhydria, gastrin is also high, but gastric pH is high rather than very low.

## Why the other options are wrong
**Loss of the terminal ileum interrupts the bile-acid cycle**
Ileal resection causes bile-acid diarrhea or steatorrhea, but it does not raise gastrin or place ulcers in the jejunum.

**Villous atrophy prevents micelle contact with enterocytes**
Celiac disease flattens villi. It is not associated with acid hypersecretion or a paradoxical gastrin rise after secretin.

**Pancreatic duct plugs stop enzyme delivery to the gut**
Ductal obstruction, as in cystic fibrosis, lowers enzyme delivery. Lipase here is delivered and then destroyed by acid.

**Bacterial overgrowth deconjugates bile acids in a blind loop**
Blind-loop overgrowth can cause steatorrhea, but it does not produce a low gastric pH with gastrin that rises after secretin.`,
  },
];

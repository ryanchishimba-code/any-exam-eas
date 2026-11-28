/** Musculoskeletal-skin (9) and blood-lymph-immune (7). */
export const MSK_ITEMS = [
  {
    slug: "ms-01",
    domain: "msk-skin",
    band: "easy",
    difficulty: 2,
    subjectId: "pharmacology",
    blueprintTopic: "gout-crystals",
    topicCategory: "gout-crystals",
    citationTitle: "Gout",
    scenario:
      "A 56-year-old man has a hot, swollen first metatarsophalangeal joint. Synovial fluid shows needle-shaped crystals that are yellow when parallel to the compensator axis of a polarizing microscope. Serum urate is 9.4 mg/dL. After the attack resolves he is prescribed a drug that lowers urate production. He is not overproducing urate from a known malignancy.",
    question: "Which enzyme does that preventive drug inhibit?",
    options: [
      "Xanthine oxidase, blocking formation of uric acid",
      "HGPRT, blocking salvage of hypoxanthine",
      "PRPP synthetase, blocking the first step of purine synthesis",
      "Adenosine deaminase, blocking breakdown of adenosine",
      "Urease, blocking hydrolysis of urea to ammonia",
    ],
    correctAnswer: "Xanthine oxidase, blocking formation of uric acid",
    explanation: `## Why this answer is correct
Allopurinol and febuxostat inhibit xanthine oxidase, the enzyme that oxidizes hypoxanthine to xanthine and xanthine to uric acid. Less uric acid is produced, the serum urate falls, and new attacks become less likely once the acute inflammation has settled. Negatively birefringent needles in a first metatarsophalangeal joint are monosodium urate.

## Why the other options are wrong
**HGPRT, blocking salvage of hypoxanthine**
Loss of HGPRT, as in Lesch-Nyhan syndrome, increases de novo purine synthesis and raises urate. Inhibiting HGPRT would worsen gout, and it is not the action of the urate-lowering xanthine oxidase inhibitors.

**PRPP synthetase, blocking the first step of purine synthesis**
Overactivity of PRPP synthetase causes urate overproduction. The drug started after this typical attack does not inhibit that enzyme.

**Adenosine deaminase, blocking breakdown of adenosine**
Adenosine deaminase deficiency causes severe combined immunodeficiency, not a change in urate excretion used to prevent gout.

**Urease, blocking hydrolysis of urea to ammonia**
Urease is a bacterial enzyme, relevant to Helicobacter and struvite stones. It does not produce uric acid.`,
  },
  {
    slug: "ms-02",
    domain: "msk-skin",
    band: "easy",
    difficulty: 2,
    subjectId: "physiology",
    blueprintTopic: "osteoporosis-bone",
    topicCategory: "osteoporosis-bone",
    citationTitle: "Osteoporosis in Females",
    scenario:
      "A 68-year-old woman has a vertebral compression fracture after lifting a grocery bag. Menopause was at age 49 and she took no estrogen. Calcium, phosphate, PTH, and alkaline phosphatase are normal. A dual-energy x-ray study shows low bone mineral density, worst in trabecular bone. There is no pseudofracture and no mosaic bone pattern.",
    question: "Which change in bone remodeling caused the fracture?",
    options: [
      "Estrogen loss increased RANKL-driven osteoclast activity",
      "Vitamin D deficiency left wide seams of unmineralized osteoid",
      "Continuous PTH excess mined calcium from cortical bone",
      "Disordered osteoclasts created a mosaic of lamellar bone",
      "A vitamin C deficit weakened collagen cross-links in osteoid",
    ],
    correctAnswer: "Estrogen loss increased RANKL-driven osteoclast activity",
    explanation: `## Why this answer is correct
After menopause, estrogen no longer restrains RANKL or supports osteoprotegerin to the same degree. Osteoclasts resorb trabecular bone faster than osteoblasts replace it. Mineralization of the bone that remains is normal, so calcium, phosphate, PTH, and alkaline phosphatase stay normal. Vertebral bodies, which are rich in trabecular bone, fracture under modest load.

## Why the other options are wrong
**Vitamin D deficiency left wide seams of unmineralized osteoid**
Osteomalacia raises alkaline phosphatase and lowers phosphate or calcium, and it produces pseudofractures. Those labs and findings are absent.

**Continuous PTH excess mined calcium from cortical bone**
Hyperparathyroidism raises PTH and calcium and preferentially thins cortical bone. PTH and calcium are normal.

**Disordered osteoclasts created a mosaic of lamellar bone**
That mosaic is Paget disease, which markedly raises alkaline phosphatase. The enzyme is normal here.

**A vitamin C deficit weakened collagen cross-links in osteoid**
Scurvy impairs collagen cross-linking and causes bleeding and poor wound healing. It is not the postmenopausal trabecular pattern with normal chemistries.`,
  },
  {
    slug: "ms-03",
    domain: "msk-skin",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "rheumatoid-arthritis",
    topicCategory: "rheumatoid-arthritis",
    citationTitle: "Rheumatoid Arthritis",
    scenario:
      "A 42-year-old woman has an hour of morning stiffness and swelling of the wrists and metacarpophalangeal joints. Anti-cyclic citrullinated peptide antibody is positive. Radiographs show marginal erosions. Synovial biopsy shows a proliferating synovium with lymphocytes and macrophages invading cartilage and bone. Serum uric acid is normal, and the distal interphalangeal joints are spared.",
    question: "What tissue is doing the damage?",
    options: [
      "Inflammatory pannus secreting proteases into cartilage and bone",
      "Monosodium urate crystals activating the inflammasome",
      "Mechanical wear of articular cartilage with subchondral sclerosis",
      "Calcium pyrophosphate crystals in the knee cartilage",
      "A septic synovium filled with neutrophils and bacteria",
    ],
    correctAnswer: "Inflammatory pannus secreting proteases into cartilage and bone",
    explanation: `## Why this answer is correct
Rheumatoid arthritis is a T-cell and macrophage disease of synovium. The synovium proliferates into pannus, releases cytokines such as TNF and IL-1, and uses proteases to erode cartilage and the marginal bone where synovium meets cartilage. Anti-CCP antibodies and morning stiffness with MCP and wrist involvement are characteristic.

## Why the other options are wrong
**Monosodium urate crystals activating the inflammasome**
Gout is an episodic crystal arthritis, often of the first toe, with negatively birefringent needles. Urate is normal and the pattern is additive and symmetric.

**Mechanical wear of articular cartilage with subchondral sclerosis**
Osteoarthritis is a degenerative cartilage failure, typically of DIP joints and the knee, without anti-CCP antibodies or a lymphocyte-rich pannus.

**Calcium pyrophosphate crystals in the knee cartilage**
CPPD causes chondrocalcinosis and positively birefringent rhomboid crystals, often in the knee of an older adult. It does not produce anti-CCP erosions of the MCP joints.

**A septic synovium filled with neutrophils and bacteria**
Septic arthritis is an acute monoarthritis with organisms in the fluid. This is a chronic symmetric small-joint disease with autoantibodies.`,
  },
  {
    slug: "ms-04",
    domain: "msk-skin",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "osteoporosis-bone",
    topicCategory: "osteoarthritis",
    citationTitle: "Osteoarthritis",
    scenario:
      "A 70-year-old man has activity-related pain in both knees and bony enlargement of the distal interphalangeal joints. Stiffness lasts less than 15 minutes. Synovial fluid is clear, with a white-cell count of 200/µL and no crystals. Radiographs show joint-space narrowing, subchondral sclerosis, and osteophytes. Rheumatoid factor and anti-CCP antibody are negative.",
    question: "Which process is wearing out the joint?",
    options: [
      "Cartilage matrix breakdown exceeding chondrocyte repair",
      "Pannus invasion along the synovial margin of the joint space",
      "Urate crystal deposition in the synovial lining",
      "Immune-complex deposition in synovial venules",
      "Bacterial colonization of a prosthetic joint space",
    ],
    correctAnswer: "Cartilage matrix breakdown exceeding chondrocyte repair",
    explanation: `## Why this answer is correct
Osteoarthritis is failure of articular cartilage under mechanical load. Chondrocytes cannot replace matrix as fast as it is lost, the joint space narrows, subchondral bone sclerose, and osteophytes form at the margins. The fluid is noninflammatory, stiffness is brief, and the DIP joints (Heberden nodes) are typical.

## Why the other options are wrong
**Pannus invasion along the synovial margin of the joint space**
Pannus is rheumatoid arthritis, which causes prolonged morning stiffness, inflammatory fluid, and autoantibodies. Those are absent.

**Urate crystal deposition in the synovial lining**
Gout produces an inflammatory fluid with negatively birefringent crystals. The fluid here is bland and crystal-free.

**Immune-complex deposition in synovial venules**
Immune-complex synovitis is an inflammatory arthritis. The white-cell count of 200/µL is noninflammatory.

**Bacterial colonization of a prosthetic joint space**
No prosthesis or organism is described, and the fluid is not septic.`,
  },
  {
    slug: "ms-05",
    domain: "msk-skin",
    band: "medium",
    difficulty: 3,
    subjectId: "physiology",
    blueprintTopic: "osteoporosis-bone",
    topicCategory: "osteomalacia",
    citationTitle: "Osteomalacia",
    scenario:
      "A 62-year-old woman who avoids the sun and dairy has bone pain and a waddling gait. Calcium is 7.9 mg/dL, phosphate is 1.9 mg/dL, PTH is high, and alkaline phosphatase is high. 25-hydroxyvitamin D is very low. Radiographs show Looser zones. A biopsy shows wide seams of unmineralized osteoid. Bone mineral density is also low.",
    question: "Why is the osteoid failing to mineralize?",
    options: [
      "Vitamin D deficiency lowered calcium and phosphate at the front",
      "Estrogen deficiency accelerated osteoclast resorption of normal bone",
      "Continuous high PTH turned over cortical bone with normal mineralization",
      "A mosaic of woven bone was laid down too quickly to organize",
      "Type I collagen mutations made an unstable osteoid matrix",
    ],
    correctAnswer: "Vitamin D deficiency lowered calcium and phosphate at the front",
    explanation: `## Why this answer is correct
Vitamin D is required for intestinal absorption of calcium and phosphate. When 25-hydroxyvitamin D is very low, the calcium-phosphate product at the mineralization front falls, osteoid accumulates, and alkaline phosphatase from active osteoblasts rises. Secondary hyperparathyroidism lowers the serum phosphate further. Looser zones are the insufficiency fractures of osteomalacia.

## Why the other options are wrong
**Estrogen deficiency accelerated osteoclast resorption of normal bone**
Osteoporosis mineralizes the remaining bone normally, so calcium, phosphate, PTH, and alkaline phosphatase stay normal. Those labs are abnormal here, and unmineralized osteoid is the defining seam.

**Continuous high PTH turned over cortical bone with normal mineralization**
Primary hyperparathyroidism raises calcium. Calcium is low, and the primary problem is vitamin D deficiency with secondary PTH elevation.

**A mosaic of woven bone was laid down too quickly to organize**
Paget disease raises alkaline phosphatase with normal calcium and phosphate and does not show wide osteoid seams from a low vitamin D.

**Type I collagen mutations made an unstable osteoid matrix**
Osteogenesis imperfecta is a collagen defect with fractures from childhood and often blue sclerae. It is not an acquired mineralization failure with a low 25-hydroxyvitamin D.`,
  },
  {
    slug: "ms-06",
    domain: "msk-skin",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "osteoporosis-bone",
    topicCategory: "paget",
    citationTitle: "Paget Bone Disease",
    scenario:
      "A 72-year-old man has an enlarging skull, hearing loss, and warmth over the tibia. Alkaline phosphatase is 980 U/L. Calcium and phosphate are normal. A bone scan shows intense uptake in the skull, pelvis, and one tibia. Biopsy shows cement lines forming a mosaic of lamellar bone. Cardiac output is high, and plain films of the tibia show coarsened trabeculae.",
    question: "Why is cardiac output high?",
    options: [
      "Arteriovenous shunting through highly vascular pagetic bone",
      "Thyrotoxicosis raising basal metabolic demand in skeletal muscle",
      "Beriberi dilating peripheral arterioles from thiamine deficiency",
      "Anemia forcing a compensatory rise in stroke volume",
      "A large arteriovenous fistula inside a fractured vertebra",
    ],
    correctAnswer: "Arteriovenous shunting through highly vascular pagetic bone",
    explanation: `## Why this answer is correct
Paget disease begins with waves of osteoclast resorption followed by disorganized osteoblastic bone formation. The involved bone is extremely vascular. Blood runs through those vascular spaces as functional arteriovenous shunts, so cardiac output rises and the overlying skin is warm. Alkaline phosphatase is high because of the osteoblastic phase, while calcium and phosphate stay normal. The mosaic of cement lines is the histologic signature.

## Why the other options are wrong
**Thyrotoxicosis raising basal metabolic demand in skeletal muscle**
Thyrotoxicosis can raise output, but it does not create a mosaic bone pattern or an isolated extreme alkaline phosphatase with normal calcium.

**Beriberi dilating peripheral arterioles from thiamine deficiency**
Wet beriberi is a high-output state from thiamine deficiency. It does not heat a single tibia or produce mosaic lamellar bone.

**Anemia forcing a compensatory rise in stroke volume**
Severe anemia can raise output. Nothing in the stem describes anemia, and it would not explain the bone histology.

**A large arteriovenous fistula inside a fractured vertebra**
No fracture fistula is described. The shunting is diffuse within the vascular pagetic bone itself.`,
  },
  {
    slug: "ms-07",
    domain: "msk-skin",
    band: "hard",
    difficulty: 5,
    subjectId: "biochemistry",
    blueprintTopic: "collagen-disorders",
    topicCategory: "collagen-disorders",
    citationTitle: "Osteogenesis Imperfecta",
    scenario:
      "A 6-year-old boy has had multiple fractures after minor falls. His sclerae are blue, and he is developing hearing loss. Teeth are opalescent. A parent has the same findings. A glycine residue in the triple-helical domain of the main bone collagen has been replaced by a bulky amino acid. Alkaline phosphatase and vitamin D are normal.",
    question: "Which collagen is defective?",
    options: [
      "Type I collagen throughout bone, sclerae, and dentin",
      "Type II collagen in articular and hyaline cartilage",
      "Type III collagen in hollow viscera and arterial media",
      "Type IV collagen in basement membranes of kidney and lung",
      "Type V collagen associated with classical skin hyperextensibility",
    ],
    correctAnswer: "Type I collagen throughout bone, sclerae, and dentin",
    explanation: `## Why this answer is correct
Osteogenesis imperfecta is most often a dominant mutation in type I collagen. Glycine must occupy every third residue of the triple helix; a bulky substitute disrupts helix folding. Bone, sclerae, teeth, and the ossicles depend on type I collagen, so fractures, blue sclerae, dentinogenesis imperfecta, and hearing loss occur together.

## Why the other options are wrong
**Type II collagen in articular and hyaline cartilage**
Type II collagen defects cause chondrodysplasias, with abnormal cartilage growth rather than this brittle-bone and blue-sclera picture.

**Type III collagen in hollow viscera and arterial media**
Type III collagen is the vascular form of Ehlers-Danlos syndrome, which ruptures arteries, uterus, and bowel. The skeleton is not the primary failing tissue.

**Type IV collagen in basement membranes of kidney and lung**
Type IV collagen is the Goodpasture and Alport antigen. It does not form the triple helix of osteoid.

**Type V collagen associated with classical skin hyperextensibility**
Type V collagen mutations cause classical Ehlers-Danlos syndrome, with skin and joint laxity, not recurrent fractures and blue sclerae as the lead features.`,
  },
  {
    slug: "ms-08",
    domain: "msk-skin",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "collagen-disorders",
    topicCategory: "collagen-disorders",
    citationTitle: "Ehlers-Danlos Syndromes",
    scenario:
      "A 27-year-old woman has thin translucent skin, easy bruising, and a spontaneous carotid-artery dissection. Last year her colon perforated without diverticular disease. Joints are not dramatically hyperextensible, and the sclerae are white. A parent died of a ruptured splenic artery. Genetic testing shows a mutation that disrupts the collagen abundant in arterial media and hollow viscera.",
    question: "Which collagen failed?",
    options: [
      "Type III collagen in arteries, bowel, and uterus",
      "Type I collagen in osteoid, sclera, and dentin",
      "Type V collagen in skin and joint capsules",
      "Type II collagen in the nucleus pulposus and cartilage",
      "Type IV collagen in the glomerular basement membrane",
    ],
    correctAnswer: "Type III collagen in arteries, bowel, and uterus",
    explanation: `## Why this answer is correct
Vascular Ehlers-Danlos syndrome is caused by mutations in type III collagen, the collagen of blood vessels and hollow organs. Arteries dissect or rupture, the bowel perforates, and the uterus can rupture in pregnancy. Skin is thin and bruises, but large-joint hyperextensibility is not the dominant feature, which separates it from the classical form.

## Why the other options are wrong
**Type I collagen in osteoid, sclera, and dentin**
Type I defects cause osteogenesis imperfecta. Sclerae here are white and the life-threatening events are arterial and intestinal rupture.

**Type V collagen in skin and joint capsules**
Type V collagen is linked to classical Ehlers-Danlos syndrome, where skin hyperextensibility and joint laxity lead and arterial rupture is not the hallmark.

**Type II collagen in the nucleus pulposus and cartilage**
Type II collagen disorders are skeletal dysplasias and cartilage diseases, not spontaneous arterial dissection.

**Type IV collagen in the glomerular basement membrane**
Type IV collagen disease presents as hereditary nephritis or anti-GBM pulmonary-renal disease, not hollow-organ and arterial rupture.`,
  },
  {
    slug: "ms-09",
    domain: "msk-skin",
    band: "hard",
    difficulty: 5,
    subjectId: "biochemistry",
    blueprintTopic: "myopathies",
    topicCategory: "myopathies",
    citationTitle: "Duchenne Muscular Dystrophy",
    scenario:
      "A 5-year-old boy uses his hands to push off his thighs when rising from the floor. His calves are enlarged but weak. Serum CK is 18,000 U/L. Muscle biopsy shows absent staining for a membrane protein that links actin to the extracellular matrix, plus fibrofatty replacement. A maternal uncle used a wheelchair by age 12. A cousin with a similar but milder weakness still has some of that protein, and his deletion leaves the reading frame intact.",
    question: "Why is this boy's protein absent while his cousin still makes a shortened one?",
    options: [
      "An out-of-frame deletion abolishes the dystrophin transcript",
      "An in-frame deletion removes a hinge but leaves a partial protein",
      "A point mutation increases dystrophin transcription in both boys",
      "An autosomal collagen mutation replaces dystrophin in the cousin",
      "A mitochondrial DNA deletion spares the cousin's sarcolemma",
    ],
    correctAnswer: "An out-of-frame deletion abolishes the dystrophin transcript",
    explanation: `## Why this answer is correct
Dystrophin connects sarcomeric actin to the dystrophin-associated complex in the sarcolemma. Duchenne muscular dystrophy is usually an out-of-frame deletion of the X-linked DMD gene, so no stable protein is made, muscle membranes tear, CK leaks, and fibrofatty replacement follows. Becker muscular dystrophy is often an in-frame deletion that preserves a shorter, partly functional protein and a milder course. The cousin's intact reading frame is that milder pattern. Calf enlargement is pseudohypertrophy from fat and fibrosis.

## Why the other options are wrong
**An in-frame deletion removes a hinge but leaves a partial protein**
That description fits the cousin, who still makes protein. This boy has no staining, which is the out-of-frame Duchenne pattern.

**A point mutation increases dystrophin transcription in both boys**
Increased transcription would not abolish membrane staining or produce this X-linked severe phenotype.

**An autosomal collagen mutation replaces dystrophin in the cousin**
The comparison is two lesions of the same X-linked dystrophin gene, distinguished by reading frame, not a collagen disease.

**A mitochondrial DNA deletion spares the cousin's sarcolemma**
Mitochondrial myopathies are maternal and do not abolish dystrophin staining or follow this frameshift logic.`,
  },
];

export const BLOOD_ITEMS = [
  {
    slug: "bl-01",
    domain: "blood-lymph-immune",
    band: "easy",
    difficulty: 2,
    subjectId: "pathology",
    blueprintTopic: "anemia-workup",
    topicCategory: "anemia-workup",
    citationTitle: "Iron-Deficiency Anemia",
    scenario:
      "A 34-year-old woman with heavy menses has fatigue. Hemoglobin is 9.1 g/dL and MCV is 72 fL. Ferritin is 8 ng/mL, serum iron is low, transferrin saturation is 8 percent, and total iron-binding capacity is high. The smear shows hypochromic cells. A trial of folate did not change the indices.",
    question: "Which iron-study pattern fits depleted stores?",
    options: [
      "Low ferritin, low saturation, and high binding capacity",
      "High ferritin, low saturation, and low binding capacity",
      "High ferritin, high saturation, and low hepcidin tone",
      "Normal ferritin, high iron, and low binding capacity",
      "Low ferritin, high saturation, and low binding capacity",
    ],
    correctAnswer: "Low ferritin, low saturation, and high binding capacity",
    explanation: `## Why this answer is correct
When iron stores are empty, ferritin falls, circulating iron falls, and the liver makes more transferrin, so total iron-binding capacity rises and saturation is very low. Microcytic hypochromic anemia from menstrual blood loss is the usual setting. Folate does not repair an iron deficit.

## Why the other options are wrong
**High ferritin, low saturation, and low binding capacity**
That pattern is anemia of inflammation: hepcidin sequesters iron and ferritin rises as an acute-phase reactant.

**High ferritin, high saturation, and low hepcidin tone**
High saturation with high ferritin is iron overload, as in hemochromatosis, where hepcidin is inappropriately low.

**Normal ferritin, high iron, and low binding capacity**
Sideroblastic anemia can show high iron and high ferritin with a low binding capacity. Ferritin here is low, not normal or high.

**Low ferritin, high saturation, and low binding capacity**
Depleted stores do not raise saturation. Saturation is low when iron delivery fails and binding capacity is high.`,
  },
  {
    slug: "bl-02",
    domain: "blood-lymph-immune",
    band: "easy",
    difficulty: 2,
    subjectId: "biochemistry",
    blueprintTopic: "anemia-workup",
    topicCategory: "anemia-workup",
    citationTitle: "Vitamin B12 Deficiency",
    scenario:
      "A 24-year-old man who eats meat develops numb hands and an unsteady gait two weeks after a long dental procedure that used nitrous oxide. Hemoglobin is 14.1 g/dL and MCV is 91 fL. Methylmalonic acid is elevated and homocysteine is mildly elevated. Serum folate is normal. Spinal MRI shows signal change in the dorsal columns. He has no anti-intrinsic-factor antibody.",
    question: "Which reaction's failure explains the elevated methylmalonic acid?",
    options: [
      "Isomerization of methylmalonyl-CoA to succinyl-CoA",
      "Transfer of a one-carbon unit in thymidylate synthesis by folate",
      "Hydroxylation of proline during collagen assembly",
      "Carboxylation of pyruvate to oxaloacetate by biotin",
      "Decarboxylation of histidine to histamine",
    ],
    correctAnswer: "Isomerization of methylmalonyl-CoA to succinyl-CoA",
    explanation: `## Why this answer is correct
Adenosylcobalamin is the cofactor for methylmalonyl-CoA mutase, which isomerizes methylmalonyl-CoA to succinyl-CoA. Nitrous oxide oxidizes the cobalt in cobalamin and inactivates the cofactor, so methylmalonic acid rises and the dorsal columns demyelinate even before the blood count becomes megaloblastic. Folate is normal, so the elevated methylmalonic acid is not a folate effect.

## Why the other options are wrong
**Transfer of a one-carbon unit in thymidylate synthesis by folate**
Folate deficiency impairs thymidylate synthesis and raises homocysteine, but it does not raise methylmalonic acid. Folate is normal and methylmalonic acid is high.

**Hydroxylation of proline during collagen assembly**
That reaction needs vitamin C. Scurvy does not cause megaloblastic anemia or dorsal-column loss.

**Carboxylation of pyruvate to oxaloacetate by biotin**
Biotin is the cofactor for pyruvate carboxylase. Biotin deficiency does not elevate methylmalonic acid or enlarge red cells in this pattern.

**Decarboxylation of histidine to histamine**
Histidine decarboxylase uses pyridoxal phosphate. It is unrelated to methylmalonic acid and intrinsic-factor antibody.`,
  },
  {
    slug: "bl-03",
    domain: "blood-lymph-immune",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "anemia-workup",
    topicCategory: "hemoglobinopathy",
    citationTitle: "Sickle Cell Anemia",
    scenario:
      "A 14-year-old boy has recurrent severe pain in the limbs and chest, and he is functionally asplenic. Hemoglobin electrophoresis shows a predominant hemoglobin that migrates differently from hemoglobin A. A glutamate residue at position 6 of the beta globin chain is replaced by valine. The smear shows sickle cells and Howell-Jolly bodies. Pain crises follow dehydration and low oxygen tension.",
    question: "Why do the cells sickle when oxygen tension falls?",
    options: [
      "Deoxygenated hemoglobin polymerizes through the new hydrophobic valine",
      "Oxidized iron leaves the heme and precipitates as Heinz bodies",
      "Spectrin detaches and the red-cell surface is lost in the spleen",
      "A point mutation stabilizes hemoglobin in the relaxed high-affinity state",
      "Unstable hemoglobin precipitates because a heme pocket histidine is lost",
    ],
    correctAnswer: "Deoxygenated hemoglobin polymerizes through the new hydrophobic valine",
    explanation: `## Why this answer is correct
Hemoglobin S replaces glutamate with valine at beta-6. In the deoxygenated conformation that valine fits a hydrophobic pocket on another tetramer, so fibers form, the cell sickles, and microvasculature occludes. Repeated infarction of the spleen leaves Howell-Jolly bodies. Oxygenated hemoglobin S does not polymerize well, which is why crises track hypoxia and dehydration.

## Why the other options are wrong
**Oxidized iron leaves the heme and precipitates as Heinz bodies**
Heinz bodies are precipitated hemoglobin in oxidative injury, such as G6PD deficiency. Sickling is polymer formation of deoxygenated hemoglobin S, not loss of heme iron.

**Spectrin detaches and the red-cell surface is lost in the spleen**
Spectrin or ankyrin defects cause hereditary spherocytosis. The mutation here is in beta globin.

**A point mutation stabilizes hemoglobin in the relaxed high-affinity state**
High-affinity hemoglobins cause erythrocytosis. Hemoglobin S polymerizes in the tense, deoxygenated state.

**Unstable hemoglobin precipitates because a heme pocket histidine is lost**
Some unstable hemoglobins precipitate from heme-pocket mutations. The beta-6 valine does not remove a heme-pocket histidine; it creates a sticky interaction in deoxyhemoglobin.`,
  },
  {
    slug: "bl-04",
    domain: "blood-lymph-immune",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "anemia-workup",
    topicCategory: "hemolysis",
    citationTitle: "Hereditary Spherocytosis",
    scenario:
      "A 32-year-old woman has pigmented gallstones and intermittent jaundice. Her father had a splenectomy for anemia. Hemoglobin is 10.6 g/dL, MCHC is high, and the smear shows spherocytes without central pallor. Osmotic fragility is increased and the direct antiglobulin test is negative. During a recent febrile illness the reticulocyte count fell from 9 percent to 0.3 percent and the hemoglobin dropped further.",
    question: "Why are the red cells spherical?",
    options: [
      "Membrane loss from an unstable spectrin-ankyrin cytoskeleton",
      "Polymerization of deoxygenated hemoglobin into rigid polymer fibers",
      "Autoantibody coating that macrophages partially phagocytose",
      "Complement pores punched by an IgM antibody in cold blood",
      "Oxidant injury denaturing hemoglobin into bite cells",
    ],
    correctAnswer: "Membrane loss from an unstable spectrin-ankyrin cytoskeleton",
    explanation: `## Why this answer is correct
Hereditary spherocytosis is usually a dominant defect of ankyrin, spectrin, or band 3. Unsupported membrane is shed as the spleen conditions the cell, surface area falls relative to volume, and the cell becomes a sphere with a high MCHC. Spheres are osmotically fragile. Parvovirus stops erythropoiesis and, because red-cell survival is already short, causes an aplastic crisis. The antiglobulin test is negative, so the spherocytes are not immune.

## Why the other options are wrong
**Polymerization of deoxygenated hemoglobin into rigid polymer fibers**
That is sickle cell disease. Sickle cells are not the spherocytes of a negative antiglobulin test with high MCHC and family splenectomy.

**Autoantibody coating that macrophages partially phagocytose**
Warm autoimmune hemolysis can produce spherocytes, but the direct antiglobulin test is positive. It is negative here, and the family history is lifelong.

**Complement pores punched by an IgM antibody in cold blood**
Cold agglutinin disease is complement-mediated and antiglobulin-positive for complement. It is not an inherited cytoskeletal defect.

**Oxidant injury denaturing hemoglobin into bite cells**
G6PD deficiency produces bite and blister cells after an oxidant stress, not a dominant family of spherocytes with high MCHC.`,
  },
  {
    slug: "bl-05",
    domain: "blood-lymph-immune",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "coagulation-cascade",
    topicCategory: "microangiopathy",
    citationTitle: "Thrombotic Thrombocytopenic Purpura",
    scenario:
      "A 35-year-old woman has fever, confusion, and thrombocytopenia. Hemoglobin is 8.2 g/dL, LDH is very high, and haptoglobin is undetectable. The smear shows many schistocytes. Creatinine is 1.3 mg/dL. Coagulation times and fibrinogen are normal, and D-dimer is not elevated. ADAMTS13 activity is below 5 percent, and an inhibitor is present. Platelet transfusion is being considered before a central line.",
    question: "Why are platelets being consumed?",
    options: [
      "Uncleaved ultra-large von Willebrand multimers glue platelets in microvessels",
      "Widespread thrombin generation is consuming fibrinogen and factors",
      "An autoantibody coats platelets and macrophages clear them in the splenic pulp",
      "Shiga toxin damages renal endothelium and spares the brain",
      "Factor VIII is missing, so fibrin cannot stabilize a platelet plug",
    ],
    correctAnswer: "Uncleaved ultra-large von Willebrand multimers glue platelets in microvessels",
    explanation: `## Why this answer is correct
ADAMTS13 cleaves ultra-large von Willebrand factor as it is released from endothelium. Without the protease, those multimers spontaneously aggregate platelets, forming microvascular thrombi. Red cells are sheared into schistocytes, LDH rises, and the brain and other organs are ischemic. Coagulation times and fibrinogen stay normal because this is platelet thrombosis, not consumption of clotting factors. Platelet transfusion can add substrate to the thrombi and is avoided unless there is life-threatening bleeding.

## Why the other options are wrong
**Widespread thrombin generation is consuming fibrinogen and factors**
That is disseminated intravascular coagulation, which prolongs clotting times, lowers fibrinogen, and raises D-dimer. Those tests are normal here.

**An autoantibody coats platelets and macrophages clear them in the splenic pulp**
Immune thrombocytopenia lowers the platelet count without schistocytes, fever, or neurologic disease, and it does not drop ADAMTS13.

**Shiga toxin damages renal endothelium and spares the brain**
Shiga-toxin hemolytic uremic syndrome is a renal-predominant microangiopathy, usually after diarrheal illness in a child, with a large creatinine rise. ADAMTS13 is not severely deficient, and this patient is encephalopathic with near-normal creatinine.

**Factor VIII is missing, so fibrin cannot stabilize a platelet plug**
Hemophilia causes deep bleeding with a prolonged PTT and a normal platelet count. It does not produce schistocytes or fever.`,
  },
  {
    slug: "bl-06",
    domain: "blood-lymph-immune",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "coagulation-cascade",
    topicCategory: "coagulation-cascade",
    citationTitle: "Disseminated Intravascular Coagulation",
    scenario:
      "A 64-year-old man with acute promyelocytic leukemia develops oozing from venipuncture sites and a new hematoma. Platelets are 28,000/µL, PT and PTT are prolonged, fibrinogen is 70 mg/dL, and D-dimer is markedly elevated. Schistocytes are present. Blood pressure is stable and there is no fever. ADAMTS13 activity is 60 percent.",
    question: "Which process is consuming the fibrinogen?",
    options: [
      "Uncontrolled thrombin generation with secondary fibrinolysis",
      "ADAMTS13 deficiency leaving ultra-large von Willebrand multimers",
      "Isolated immune clearance of platelets without factor consumption",
      "A factor VIII inhibitor that prolongs the PTT and spares fibrinogen",
      "Vitamin K deficiency slowing gamma-carboxylation of factors",
    ],
    correctAnswer: "Uncontrolled thrombin generation with secondary fibrinolysis",
    explanation: `## Why this answer is correct
Acute promyelocytic leukemia releases procoagulant material from granules and can trigger disseminated intravascular coagulation. Thrombin converts fibrinogen to fibrin throughout the microcirculation, platelets are consumed, and plasmin degrades the fibrin, raising D-dimer and further lowering fibrinogen. Both PT and PTT prolong because multiple factors are consumed. ADAMTS13 is not severely reduced, so this is not thrombotic thrombocytopenic purpura.

## Why the other options are wrong
**ADAMTS13 deficiency leaving ultra-large von Willebrand multimers**
Thrombotic thrombocytopenic purpura keeps fibrinogen and clotting times normal and drops ADAMTS13 activity below about 10 percent. Fibrinogen is very low and ADAMTS13 is 60 percent here.

**Isolated immune clearance of platelets without factor consumption**
Immune thrombocytopenia does not prolong PT and PTT, drop fibrinogen, or raise D-dimer.

**A factor VIII inhibitor that prolongs the PTT and spares fibrinogen**
A factor VIII inhibitor prolongs the PTT, which does not correct on mixing, and leaves PT and fibrinogen normal. Both clotting times are prolonged and fibrinogen is consumed.

**Vitamin K deficiency slowing gamma-carboxylation of factors**
Vitamin K deficiency prolongs PT first and does not consume fibrinogen or produce schistocytes and a high D-dimer. Factor levels fall from under-carboxylation, not from thrombin-driven consumption.`,
  },
  {
    slug: "bl-07",
    domain: "blood-lymph-immune",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "coagulation-cascade",
    topicCategory: "coagulation-cascade",
    citationTitle: "Hemophilia",
    scenario:
      "A 12-year-old boy has recurrent hemarthroses of the knees and a large hematoma after a minor muscle strain. Platelet count and bleeding time are normal. PT is normal and PTT is prolonged. The PTT corrects when his plasma is mixed 1:1 with normal plasma. Factor VIII activity is 1 percent, von Willebrand factor antigen and activity are normal, and factor IX activity is normal. A maternal uncle had similar bleeding.",
    question: "Which step of fibrin formation is missing?",
    options: [
      "Factor VIII cofactor activity in the intrinsic tenase complex",
      "Factor IX enzyme activity in that same tenase complex",
      "von Willebrand factor carrying and protecting factor VIII",
      "Factor VII tissue-factor activation of the extrinsic pathway cascade",
      "Platelet glycoprotein Ib binding von Willebrand factor",
    ],
    correctAnswer: "Factor VIII cofactor activity in the intrinsic tenase complex",
    explanation: `## Why this answer is correct
Factor VIII is the cofactor for factor IX in the intrinsic tenase complex that activates factor X. Severe deficiency prolongs the PTT, leaves the PT normal, and causes deep bleeding into joints and muscle. The PTT corrects on mixing because a missing factor is supplied by normal plasma, whereas an inhibitor would persist. Normal von Willebrand studies and normal factor IX localize the defect to factor VIII itself. Inheritance through the maternal family fits X-linked hemophilia A.

## Why the other options are wrong
**Factor IX enzyme activity in that same tenase complex**
Factor IX deficiency is hemophilia B and looks clinically similar, but factor IX activity is normal and factor VIII activity is 1 percent.

**von Willebrand factor carrying and protecting factor VIII**
von Willebrand disease can lower factor VIII somewhat, but antigen and activity of von Willebrand factor are normal, the bleeding time is normal, and the bleeding pattern is deep hemarthrosis rather than mucosal oozing.

**Factor VII tissue-factor activation of the extrinsic pathway cascade**
Factor VII deficiency prolongs the PT. The PT is normal.

**Platelet glycoprotein Ib binding von Willebrand factor**
Glycoprotein Ib defects (Bernard-Soulier) cause a platelet adhesion disorder with giant platelets and a long bleeding time. Platelet count and bleeding time are normal.`,
  },
];

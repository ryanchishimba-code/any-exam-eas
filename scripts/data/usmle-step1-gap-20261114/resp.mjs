/** Respiratory-renal (11): 2 easy, 3 medium, 6 hard. */
export const RESP_ITEMS = [
  {
    slug: "rr-01",
    domain: "respiratory-renal",
    band: "easy",
    difficulty: 2,
    subjectId: "pathology",
    blueprintTopic: "glomerular-diseases",
    topicCategory: "glomerular-diseases",
    citationTitle: "Minimal Change Disease",
    scenario:
      "A 46-year-old woman who began daily ibuprofen for knee pain now has leg swelling. Urine protein is 6.4 g/day and the sediment has no red cells. Albumin is 2.1 g/dL and cholesterol is high. Light microscopy and immunofluorescence are normal. Electron microscopy shows diffuse effacement of podocyte foot processes. Creatinine is 0.8 mg/dL, and the protein leak falls after the drug is stopped.",
    question: "Which filtration barrier has been lost?",
    options: [
      "The anionic charge barrier on the glomerular capillary wall",
      "The size barrier, with breaks large enough for red cells",
      "Mesangial cells, with nodular sclerosis on light microscopy",
      "The glomerular basement membrane, with linear immunoglobulin",
      "Endothelial fenestrae, with subendothelial immune deposits",
    ],
    correctAnswer: "The anionic charge barrier on the glomerular capillary wall",
    explanation: `## Why this answer is correct
Minimal change disease selectively loses the negative charge of the glomerular filtration barrier, so albumin leaks while larger or less charged elements, including red cells, are retained. Light microscopy and immunofluorescence stay normal. Foot-process effacement is the electron-microscopic correlate. The result is nephrotic-range proteinuria, hypoalbuminemia, edema, and hyperlipidemia.

## Why the other options are wrong
**The size barrier, with breaks large enough for red cells**
A size-selective break that passes red cells produces hematuria and an active sediment. The dipstick shows protein without blood.

**Mesangial cells, with nodular sclerosis on light microscopy**
Nodular mesangial sclerosis is a light-microscopic lesion, as in diabetic nephropathy. Light microscopy here is normal.

**The glomerular basement membrane, with linear immunoglobulin**
Linear IgG is anti-GBM disease, a rapidly progressive nephritic picture with hematuria, not isolated nephrotic syndrome with negative immunofluorescence.

**Endothelial fenestrae, with subendothelial immune deposits**
Subendothelial deposits are seen in membranoproliferative and lupus patterns and are visible by electron microscopy beyond simple foot-process effacement.`,
  },
  {
    slug: "rr-02",
    domain: "respiratory-renal",
    band: "easy",
    difficulty: 2,
    subjectId: "physiology",
    blueprintTopic: "acid-base-physiology",
    topicCategory: "acid-base-physiology",
    citationTitle: "Respiratory Alkalosis",
    scenario:
      "A 22-year-old woman is brought from an examination room after 20 minutes of rapid deep breathing, tingling in her fingers, and a feeling of panic. Arterial pH is 7.55, PaCO2 is 22 mm Hg, and bicarbonate is 22 mEq/L. Sodium, chloride, and the anion gap are normal. The episode began during the examination and she was well that morning.",
    question: "Which primary disturbance is present?",
    options: [
      "Acute carbon dioxide loss from sustained alveolar hyperventilation",
      "Metabolic alkalosis with respiratory compensation already complete",
      "Anion-gap metabolic acidosis with respiratory compensation",
      "Chronic respiratory acidosis with renal bicarbonate retention",
      "Normal-gap metabolic acidosis from renal bicarbonate loss",
    ],
    correctAnswer: "Acute carbon dioxide loss from sustained alveolar hyperventilation",
    explanation: `## Why this answer is correct
Primary respiratory alkalosis is a low PaCO2 that raises pH. In the first minutes the bicarbonate has not yet fallen much, because renal compensation (less acid excretion and lower bicarbonate reabsorption) takes days. Panic hyperventilation is a classic acute cause, and the normal anion gap excludes a hidden metabolic acidosis.

## Why the other options are wrong
**Metabolic alkalosis with respiratory compensation already complete**
Metabolic alkalosis has a high bicarbonate as the primary change. Bicarbonate here is not elevated; the large change is the low PaCO2.

**Anion-gap metabolic acidosis with respiratory compensation**
An anion-gap acidosis lowers pH and bicarbonate and raises the gap. pH here is high and the gap is normal.

**Chronic respiratory acidosis with renal bicarbonate retention**
Respiratory acidosis has a high PaCO2 and a low or low-normal pH. PaCO2 and the clinical picture are the opposite.

**Normal-gap metabolic acidosis from renal bicarbonate loss**
Hyperchloremic metabolic acidosis lowers pH and bicarbonate. pH is high and bicarbonate has barely moved.`,
  },
  {
    slug: "rr-03",
    domain: "respiratory-renal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "glomerular-diseases",
    topicCategory: "glomerular-diseases",
    citationTitle: "Membranous Nephropathy",
    scenario:
      "A 58-year-old man has edema and 7 g of proteinuria per day. Serum albumin is 2.2 g/dL. There is no hematuria. Light microscopy shows thickened capillary walls, and a silver stain shows spikes on the epithelial side of the basement membrane. Immunofluorescence shows granular IgG and C3 along the capillaries. An antibody against the phospholipase A2 receptor is positive. A chest radiograph shows a new hilar mass.",
    question: "Where did the immune complexes form?",
    options: [
      "In situ, on the epithelial side of the basement membrane",
      "In the circulation, then trapped beneath the capillary endothelium",
      "Along the mesangium, with a linear IgG pattern",
      "Inside Bowman space, as cellular crescents",
      "On the tubular basement membrane, sparing glomeruli",
    ],
    correctAnswer: "In situ, on the epithelial side of the basement membrane",
    explanation: `## Why this answer is correct
Membranous nephropathy is formed by IgG binding an antigen on the podocyte, most often the phospholipase A2 receptor. Complement is activated and complexes sit in the subepithelial space. The basement membrane grows between them as the spikes on silver stain. The clinical picture is nephrotic syndrome. Solid tumors are a classic associated finding in older adults.

## Why the other options are wrong
**In the circulation, then trapped beneath the capillary endothelium**
Circulating complexes that lodge in the subendothelium produce a membranoproliferative pattern, often with a low complement and a more nephritic or mixed picture, not isolated subepithelial spikes.

**Along the mesangium, with a linear IgG pattern**
Linear IgG is anti-GBM disease and is not granular. Mesangial deposits are the pattern of IgA nephropathy.

**Inside Bowman space, as cellular crescents**
Crescents are parietal-epithelial proliferations in rapidly progressive glomerulonephritis. They are not the spike-and-dome lesion.

**On the tubular basement membrane, sparing glomeruli**
The deposits described are capillary-wall and glomerular. Tubular-basement-membrane staining is a different injury.`,
  },
  {
    slug: "rr-04",
    domain: "respiratory-renal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "glomerular-diseases",
    topicCategory: "glomerular-diseases",
    citationTitle: "Infection-Related Glomerulonephritis",
    scenario:
      "A 9-year-old boy has cola-colored urine, mild hypertension, and periorbital edema starting two weeks after a documented streptococcal pharyngitis. Creatinine is 1.4 mg/dL. ASO titer is high and C3 is low. The urine sediment shows red-cell casts. Electron microscopy shows large subepithelial humps. He is otherwise improving by the time of biopsy.",
    question: "Which immune mechanism injured the glomerulus?",
    options: [
      "Deposition of circulating immune complexes after the infection",
      "Antibody bound directly to a collagen epitope in a linear pattern",
      "T-cell cytokines effacing foot processes without deposits",
      "IgA complexes deposited in the mesangium during an acute illness",
      "Antibody against neutrophil cytoplasm without immune deposits",
    ],
    correctAnswer: "Deposition of circulating immune complexes after the infection",
    explanation: `## Why this answer is correct
Nephritogenic streptococci trigger circulating immune complexes that deposit in glomeruli, activate complement, and produce an acute nephritic syndrome one to three weeks after pharyngitis. C3 falls, and the electron-microscopic humps are large subepithelial deposits. Children usually recover as the complexes clear.

## Why the other options are wrong
**Antibody bound directly to a collagen epitope in a linear pattern**
Anti-GBM antibody binds collagen in a linear pattern and causes rapidly progressive glomerulonephritis, often with lung hemorrhage, not postpharyngitic humps with a low C3.

**T-cell cytokines effacing foot processes without deposits**
That is minimal change disease, a nephrotic lesion with normal light microscopy and no red-cell casts.

**IgA complexes deposited in the mesangium during an acute illness**
IgA nephropathy flares during or immediately after a mucosal infection, not two weeks later, and the deposits are mesangial rather than subepithelial humps.

**Antibody against neutrophil cytoplasm without immune deposits**
ANCA vasculitis is pauci-immune. Immunofluorescence would not show the immune deposits that form humps, and complement is usually normal.`,
  },
  {
    slug: "rr-05",
    domain: "respiratory-renal",
    band: "medium",
    difficulty: 3,
    subjectId: "pathology",
    blueprintTopic: "glomerular-diseases",
    topicCategory: "glomerular-diseases",
    citationTitle: "Goodpasture Syndrome",
    scenario:
      "A 19-year-old man has hemoptysis and tea-colored urine over five days. Creatinine has risen from 0.9 to 3.6 mg/dL. The sediment shows red-cell casts. There is no preceding pharyngitis, and complement levels are normal. Kidney immunofluorescence shows smooth linear IgG along the glomerular basement membrane. The antibody target is the noncollagenous domain of a type IV collagen chain.",
    question: "Which hypersensitivity pattern is this?",
    options: [
      "Antibody bound directly to a fixed basement-membrane antigen",
      "Circulating complexes deposited as granular subepithelial humps",
      "IgE bound to mast cells in alveolar and glomerular capillaries",
      "Delayed T-cell attack without antibody on the membrane",
      "Pauci-immune necrosis driven by an antineutrophil antibody",
    ],
    correctAnswer: "Antibody bound directly to a fixed basement-membrane antigen",
    explanation: `## Why this answer is correct
Anti-GBM disease is type II hypersensitivity: IgG binds a fixed antigen, the noncollagenous domain of type IV collagen, in glomerular and alveolar basement membranes. The immunofluorescence is linear. Complement levels stay normal because the antibody is not being consumed as circulating complexes. Lung and kidney involvement together is Goodpasture syndrome when the same antibody attacks both membranes.

## Why the other options are wrong
**Circulating complexes deposited as granular subepithelial humps**
Immune-complex disease is type III and looks granular, as in poststreptococcal glomerulonephritis. The pattern here is linear and complement is normal.

**IgE bound to mast cells in alveolar and glomerular capillaries**
IgE mast-cell disease is type I hypersensitivity, the mechanism of anaphylaxis and many allergic reactions, not linear IgG on the basement membrane.

**Delayed T-cell attack without antibody on the membrane**
Type IV hypersensitivity is T-cell mediated and would not light up the membrane with linear IgG.

**Pauci-immune necrosis driven by an antineutrophil antibody**
ANCA vasculitis has little or no immunoglobulin on the biopsy. Linear IgG excludes that pattern.`,
  },
  {
    slug: "rr-06",
    domain: "respiratory-renal",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "acid-base-physiology",
    topicCategory: "acid-base-physiology",
    citationTitle: "Renal Tubular Acidosis",
    scenario:
      "A 36-year-old woman with Sjögren syndrome has a serum bicarbonate of 14 mEq/L, potassium of 2.9 mEq/L, and a normal anion gap. Urine pH is 6.8 despite the acidosis. The urine anion gap is positive. She has passed several calcium-phosphate stones. Ammonium chloride loading does not lower the urine pH. Proximal tubular reabsorption of glucose and phosphate is intact.",
    question: "Which tubular failure is present?",
    options: [
      "Alpha-intercalated cells cannot secrete hydrogen ion",
      "Proximal cells waste bicarbonate above a lowered threshold",
      "Principal cells fail to respond to aldosterone and retain potassium",
      "The thick ascending limb cannot reabsorb magnesium",
      "Collecting-duct aquaporins cannot insert in response to vasopressin",
    ],
    correctAnswer: "Alpha-intercalated cells cannot secrete hydrogen ion",
    explanation: `## Why this answer is correct
Distal (type 1) renal tubular acidosis is failure of alpha-intercalated cells to secrete H+ through H-ATPase. Urine cannot be acidified below about 5.5 even when blood is acidemic, so the urine anion gap stays positive (low ammonium). Potassium is wasted, and the alkaline urine plus bone buffering promotes calcium-phosphate stones. Sjögren syndrome is a classic association. Proximal function is intact, which separates this from Fanconi syndrome.

## Why the other options are wrong
**Proximal cells waste bicarbonate above a lowered threshold**
Proximal renal tubular acidosis can acidify the urine once plasma bicarbonate falls below the new threshold, and it often wastes glucose and phosphate. Urine pH here stays high and those solutes are conserved.

**Principal cells fail to respond to aldosterone and retain potassium**
Aldosterone resistance is type 4 renal tubular acidosis, which causes hyperkalemia and a mild acidosis. Potassium here is low.

**The thick ascending limb cannot reabsorb magnesium**
Bartter syndrome wastes salt and magnesium and causes metabolic alkalosis, not a normal-gap acidosis with an unacidified urine.

**Collecting-duct aquaporins cannot insert in response to vasopressin**
That is nephrogenic diabetes insipidus, a water problem, not a failure to secrete acid.`,
  },
  {
    slug: "rr-07",
    domain: "respiratory-renal",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "acid-base-physiology",
    topicCategory: "acid-base-physiology",
    citationTitle: "Renal Tubular Acidosis",
    scenario:
      "A 7-year-old boy has short stature, a serum bicarbonate of 15 mEq/L, potassium of 3.1 mEq/L, and a normal anion gap. Urine contains glucose and phosphate despite normal plasma glucose, and serum phosphate is low. When bicarbonate is 14 mEq/L, urine pH falls to 4.9. After bicarbonate is infused and serum bicarbonate rises to 22 mEq/L, urine pH rises above 7 and fractional excretion of bicarbonate exceeds 15 percent.",
    question: "Which nephron segment is leaking bicarbonate?",
    options: [
      "The proximal tubule, once the filtered load exceeds its threshold",
      "Alpha-intercalated cells that cannot acidify the urine at any load",
      "Principal cells that are resistant to aldosterone",
      "The medullary collecting duct failing to insert aquaporin-2",
      "The macula densa, with unregulated renin release",
    ],
    correctAnswer: "The proximal tubule, once the filtered load exceeds its threshold",
    explanation: `## Why this answer is correct
Proximal (type 2) renal tubular acidosis lowers the bicarbonate reabsorptive threshold. Below that threshold the distal nephron can still acidify the urine, which is why urine pH fell to 4.9 at a bicarbonate of 14. When bicarbonate is raised toward normal, filtered bicarbonate exceeds proximal capacity, bicarbonate floods the urine, and urine pH rises. Glycosuria and phosphaturia show a broader proximal defect (Fanconi syndrome).

## Why the other options are wrong
**Alpha-intercalated cells that cannot acidify the urine at any load**
Distal renal tubular acidosis cannot lower urine pH during acidosis. This child acidified to 4.9 when plasma bicarbonate was very low.

**Principal cells that are resistant to aldosterone**
Type 4 acidosis features hyperkalemia. Potassium is low, and the bicarbonate titration curve is proximal.

**The medullary collecting duct failing to insert aquaporin-2**
Aquaporin-2 failure impairs water reabsorption, not bicarbonate reclamation or phosphate and glucose transport.

**The macula densa, with unregulated renin release**
Macula densa signaling affects renin and glomerular filtration. It does not create a bicarbonate threshold with Fanconi features.`,
  },
  {
    slug: "rr-08",
    domain: "respiratory-renal",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "acid-base-physiology",
    topicCategory: "acid-base-physiology",
    citationTitle: "Renal Tubular Acidosis",
    scenario:
      "A 62-year-old man with longstanding diabetes has a serum bicarbonate of 18 mEq/L, potassium of 5.8 mEq/L, and a normal anion gap. Urine pH is 5.0. Plasma renin and aldosterone are both low. Creatinine is 1.6 mg/dL. He is not taking a potassium-sparing diuretic. Ammonium excretion is reduced.",
    question: "Why is ammonium excretion low?",
    options: [
      "Hyperkalemia suppresses ammoniagenesis in the proximal tubule",
      "Alpha-intercalated cells cannot secrete hydrogen ions",
      "The proximal bicarbonate threshold is far below normal",
      "Respiratory acidosis is retaining carbon dioxide",
      "Loop diuretic therapy has washed out the medullary interstitium",
    ],
    correctAnswer: "Hyperkalemia suppresses ammoniagenesis in the proximal tubule",
    explanation: `## Why this answer is correct
Type 4 renal tubular acidosis is hypoaldosteronism or aldosterone resistance. Principal cells then retain potassium and waste sodium. The hyperkalemia itself reduces proximal ammoniagenesis, so less ammonium is available to carry acid even though the collecting duct can still lower urine pH. The acidosis is mild and the anion gap is normal. Low renin and low aldosterone fit hyporeninemic hypoaldosteronism of diabetic kidney disease.

## Why the other options are wrong
**Alpha-intercalated cells cannot secrete hydrogen ions**
That is distal renal tubular acidosis, which keeps urine pH high and lowers potassium. Urine pH here is appropriately acidic and potassium is high.

**The proximal bicarbonate threshold is far below normal**
Proximal renal tubular acidosis wastes bicarbonate and often other proximal solutes, and potassium is low. The dominant findings here are hyperkalemia and low aldosterone.

**Respiratory acidosis is retaining carbon dioxide**
The stem is a metabolic normal-gap acidosis with hyperkalemia. No carbon dioxide retention is described.

**Loop diuretic therapy has washed out the medullary interstitium**
Loop diuretics cause metabolic alkalosis and potassium loss. He is not taking one, and the acid-base direction is the opposite.`,
  },
  {
    slug: "rr-09",
    domain: "respiratory-renal",
    band: "hard",
    difficulty: 5,
    subjectId: "pharmacology",
    blueprintTopic: "aki-mechanisms",
    topicCategory: "diuretics",
    citationTitle: "Loop Diuretics",
    scenario:
      "A 68-year-old woman is treated with intravenous furosemide for pulmonary edema. Urine output rises sharply. Urine sodium, potassium, and chloride are all high. Over two days she cannot concentrate her urine above 320 mOsm/kg despite a rising plasma osmolality, and she develops hypokalemic metabolic alkalosis. Creatinine is unchanged.",
    question: "Which transporter blockade dissipated the medullary gradient?",
    options: [
      "The Na-K-2Cl cotransporter on the thick ascending limb",
      "The Na-Cl cotransporter on the distal convoluted tubule",
      "Epithelial sodium channels on principal cells",
      "The sodium-glucose cotransporter in the proximal tubule",
      "Aquaporin-2 water channels on the collecting duct",
    ],
    correctAnswer: "The Na-K-2Cl cotransporter on the thick ascending limb",
    explanation: `## Why this answer is correct
Furosemide inhibits NKCC2 on the luminal membrane of the thick ascending limb. That segment is impermeable to water and normally separates salt from water, which builds the medullary osmotic gradient. Blocking the cotransporter dumps sodium, potassium, and chloride into the urine and erases the gradient, so the collecting duct cannot concentrate even when vasopressin is present. Increased distal sodium delivery also increases potassium and hydrogen secretion, causing hypokalemic metabolic alkalosis.

## Why the other options are wrong
**The Na-Cl cotransporter on the distal convoluted tubule**
Thiazides block NCC. They increase urine output modestly but do not abolish the medullary gradient created by the thick ascending limb, and they do not produce this degree of concentrating failure.

**Epithelial sodium channels on principal cells**
Amiloride blocks those channels and spares potassium. It does not dump chloride from the thick limb or wash out the medulla the way a loop diuretic does.

**The sodium-glucose cotransporter in the proximal tubule**
SGLT2 inhibitors cause glucosuria. They are not the cause of a chloride-rich diuresis with loss of concentrating ability after furosemide.

**Aquaporin-2 water channels on the collecting duct**
Blocking aquaporin-2 would impair water reabsorption directly. Furosemide acts upstream, on salt reabsorption that creates the gradient those channels depend on.`,
  },
  {
    slug: "rr-10",
    domain: "respiratory-renal",
    band: "hard",
    difficulty: 5,
    subjectId: "pathology",
    blueprintTopic: "ards-pathology",
    topicCategory: "ards-pathology",
    citationTitle: "Acute Respiratory Distress Syndrome",
    scenario:
      "A 48-year-old woman with gram-negative sepsis is intubated for hypoxemia. PaO2 is 70 mm Hg on an FiO2 of 0.8. Chest imaging shows bilateral alveolar infiltrates. Pulmonary-artery occlusion pressure is 10 mm Hg. Compliance of the respiratory system is low. A biopsy from a similar patient shows hyaline membranes lining alveoli whose type I cells are necrotic, with protein-rich edema and intact left-ventricular function.",
    question: "What allowed plasma protein to flood the alveoli?",
    options: [
      "Neutrophil injury of capillary endothelium and alveolar epithelium",
      "Elevated left-atrial pressure forcing fluid across an intact barrier",
      "Absence of surfactant in a premature lung with normal capillaries",
      "Pulmonary arterial obstruction raising dead space without edema",
      "Lymphatic obstruction in the hila from metastatic carcinoma",
    ],
    correctAnswer: "Neutrophil injury of capillary endothelium and alveolar epithelium",
    explanation: `## Why this answer is correct
In the acute respiratory distress syndrome, activated neutrophils damage capillary endothelium and alveolar epithelium. The barrier leaks protein-rich fluid, type I cells die, surfactant is inactivated, and hyaline membranes form. Compliance falls and shunt hypoxemia is severe. A normal pulmonary-artery occlusion pressure shows the edema is not from left-atrial hypertension.

## Why the other options are wrong
**Elevated left-atrial pressure forcing fluid across an intact barrier**
Cardiogenic edema raises the occlusion pressure, usually above 18 mm Hg, and the fluid is a low-protein transudate. Occlusion pressure here is low.

**Absence of surfactant in a premature lung with normal capillaries**
Neonatal respiratory distress is surfactant deficiency in immature type II cells. This is an adult with sepsis and a leaky barrier, not a developmental surfactant deficit.

**Pulmonary arterial obstruction raising dead space without edema**
Pulmonary embolism increases dead space and can cause hypoxemia, but it does not produce bilateral protein-rich alveolar flooding with hyaline membranes and a low occlusion pressure as the core lesion.

**Lymphatic obstruction in the hila from metastatic carcinoma**
Lymphangitic carcinoma can cause interstitial markings. It is not the acute neutrophil-mediated epithelial and endothelial necrosis of sepsis.`,
  },
  {
    slug: "rr-11",
    domain: "respiratory-renal",
    band: "hard",
    difficulty: 5,
    subjectId: "physiology",
    blueprintTopic: "ards-pathology",
    topicCategory: "neonatal-rds",
    citationTitle: "Neonatal Respiratory Distress Syndrome",
    scenario:
      "A boy born at 28 weeks develops grunting, nasal flaring, and retractions at 30 minutes of life. Amniotic fluid obtained before delivery had a lecithin-to-sphingomyelin ratio of 1.1. Chest imaging shows low lung volumes and a diffuse ground-glass pattern. He improves after intratracheal instillation of a phospholipid extract. There is no fever and no maternal infection.",
    question: "Which missing substance raised alveolar surface tension?",
    options: [
      "Dipalmitoyl phosphatidylcholine from type II pneumocytes",
      "Neutrophil-derived proteases attacking mature alveolar walls",
      "Surfactant protein made by type I cells lining adult alveoli",
      "Immunoglobulin A secreted across the bronchial epithelium",
      "Elastin laid down by fibroblasts in the visceral pleura",
    ],
    correctAnswer: "Dipalmitoyl phosphatidylcholine from type II pneumocytes",
    explanation: `## Why this answer is correct
Type II pneumocytes make surfactant, whose main tension-lowering lipid is dipalmitoyl phosphatidylcholine (lecithin). Before about 35 weeks the lecithin-to-sphingomyelin ratio is low, surface tension stays high, and alveoli collapse at end expiration. Ground-glass lungs with low volumes are the radiographic result. Exogenous surfactant replaces the missing phospholipid.

## Why the other options are wrong
**Neutrophil-derived proteases attacking mature alveolar walls**
Protease injury is the story of adult inflammatory lung injury and of emphysema, not of a premature infant with a low lecithin ratio who responds to surfactant replacement.

**Surfactant protein made by type I cells lining adult alveoli**
Type I cells are the thin gas-exchange surface. Surfactant is synthesized by type II cells.

**Immunoglobulin A secreted across the bronchial epithelium**
Secretory IgA is mucosal antibody. It does not set alveolar surface tension, and replacing it would not reverse this radiograph.

**Elastin laid down by fibroblasts in the visceral pleura**
Elastin provides recoil of the lung interstitium. The immediate lesion in this neonate is high surface tension from missing surfactant, corrected by a phospholipid extract.`,
  },
];

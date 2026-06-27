import { defineExamTopics } from "./topic-factory";

/** USMLE Step 1 — basic sciences aligned to content outline weights. */
export const USMLE_STEP1_HIGH_YIELD_TOPICS = defineExamTopics("usmle", [
  {
    slug: "pathology-neoplasia",
    category: "Step 1 — Basic Sciences",
    title: "Pathology: Inflammation, Neoplasia & Hemodynamics",
    overview:
      "Cell injury patterns, inflammation, neoplasia hallmarks, and hemodynamic disorders — the highest-yield Step 1 pathology framework.",
    summary:
      "Step 1 pathology items test mechanism recognition in short vignettes. Inflammation: cardinal signs reflect vasodilation, permeability, and leukocyte recruitment. Acute inflammation is neutrophil-predominant with fibrin and exudate; chronic inflammation shows lymphocytes, macrophages, granulomas, and fibrosis. Granulomatous disease (TB, sarcoid, foreign body) requires activated macrophages and Th1 immunity.\n\nNeoplasia: benign vs malignant hinges on differentiation, growth pattern, invasion, and metastasis. Hallmarks include self-sufficiency in growth signals, evading growth suppressors, resisting apoptosis, limitless replicative potential, angiogenesis, invasion, and immune escape. Carcinoma in situ lacks basement membrane breach; invasive carcinoma crosses BM. TNM staging integrates tumor size, nodes, and metastasis.\n\nHemodynamics: edema from increased hydrostatic pressure (HF, venous obstruction), decreased oncotic pressure (nephrotic syndrome, cirrhosis), lymphatic obstruction (filariasis), or sodium retention. Infarction patterns: red (loose tissue, dual blood supply e.g. lung) vs pale (solid organs e.g. heart, kidney). Shock types: hypovolemic, cardiogenic, distributive (septic, anaphylactic, neurogenic), obstructive.",
    keyConcepts: [
      "Acute vs chronic inflammation: neutrophils vs mononuclear cells; exudate vs proliferative repair",
      "Granuloma: epithelioid macrophages + Langhans giant cells; caseating (TB) vs non-caseating (sarcoid)",
      "Neoplasia hallmarks: invasion and metastasis distinguish malignant from benign",
      "Carcinoma vs sarcoma: epithelial vs mesenchymal origin; spread patterns differ",
      "Paraneoplastic syndromes link tumor products to remote effects (SIADH, hypercalcemia, Trousseau)",
      "Infarct color: red in lungs/congested tissue; pale in heart/spleen/kidney",
      "Edema mechanisms: hydrostatic, oncotic, lymphatic, inflammatory permeability",
    ],
    mustKnowFacts: [
      "DIC: widespread microthrombi with consumptive coagulopathy — treat underlying cause; blood products for bleeding",
      "Trousseau sign migratory thrombophlebitis suggests occult visceral malignancy (classically pancreatic adenocarcinoma)",
    ],
    pearls: [
      "A biopsy shows disorganized squamous cells invading through basement membrane with keratin pearls — invasive squamous cell carcinoma, not dysplasia alone.",
      "A patient with TB shows caseating granulomas with central necrosis — Th1-mediated macrophage activation; PPD tests cell-mediated immunity, not antibody.",
    ],
    pitfalls: [
      "Calling all granulomas TB — sarcoid, foreign body, and fungal infections also granulomatous; caseation favors TB",
      "Confusing metaplasia (reversible adaptive change) with dysplasia (premalignant atypia)",
    ],
    practiceTopicSlug: "pathology",
    usmleSteps: ["step1"],
    sortOrder: 101,
  },
  {
    slug: "pharmacology-moa",
    category: "Step 1 — Basic Sciences",
    title: "Pharmacology: MOA, Kinetics & Autonomic Drugs",
    overview:
      "Receptor pharmacology, PK/PD, autonomic agonists/antagonists, and classic tox syndromes tested on Step 1.",
    summary:
      "Pharmacology vignettes pair a drug class with a physiologic outcome. Know receptor type (GPCR, ion channel, nuclear receptor, enzyme inhibitor) and whether the drug is full agonist, partial agonist, antagonist, or inverse agonist. Efficacy vs potency: efficacy is maximal effect; potency is dose required (EC50). Competitive antagonism shifts curve right (same Emax); noncompetitive lowers Emax.\n\nPK essentials: first-order elimination, half-life, steady state (~4–5 half-lives), loading vs maintenance doses. Zero-order drugs (phenytoin, ethanol, aspirin at high doses) have fixed amount eliminated per time. Phase I (CYP oxidation) vs Phase II (conjugation). Inducers (rifampin, phenytoin, carbamazepine) vs inhibitors (azole antifungals, macrolides, grapefruit).\n\nAutonomic table is board gold: muscarinic (M3) → SLUD + bronchoconstriction; nicotinic NMJ → fasciculations; alpha-1 → vasoconstriction; beta-1 → ↑HR/contractility; beta-2 → bronchodilation. Organophosphate poisoning: irreversible AChE inhibition → DUMBBELSS → atropine + pralidoxime.",
    keyConcepts: [
      "Partial agonist: lower efficacy than full agonist; can antagonize full agonist at same receptor",
      "Competitive vs noncompetitive antagonism on dose-response curves",
      "Therapeutic index: LD50/ED50 — narrow index drugs (lithium, warfarin, phenytoin, theophylline)",
      "Autonomic receptors: organ-specific responses drive side-effect profiles",
      "Beta-blocker without alpha block in pheochromocytoma → unopposed alpha vasoconstriction",
      "Organophosphate/cholinergic crisis: atropine for muscarinic; pralidoxime for nicotinic if early",
      "H2 blockers vs PPI: parietal cell acid secretion pathway location",
    ],
    mustKnowFacts: [
      "Methotrexate toxicity reversed by leucovorin (folinic acid) — rescues normal cells via alternate folate pathway",
      "Warfarin protein C/S short half-life — early hypercoagulable state when starting warfarin; bridge with heparin",
    ],
    pearls: [
      "A patient on both erythromycin and simvastatin develops rhabdomyolysis — CYP3A4 inhibition raises statin levels.",
      "Beta-blocker given for cocaine chest pain worsens hypertension — use benzodiazepines first; avoid beta-only blockade.",
    ],
    pitfalls: [
      "Confusing partial agonists (buprenorphine) with antagonists (naloxone)",
      "Forgetting active metabolites — codeine → morphine via CYP2D6; clopidogrel requires activation",
    ],
    practiceTopicSlug: "pharmacology",
    usmleSteps: ["step1"],
    sortOrder: 102,
  },
  {
    slug: "physiology-systems",
    category: "Step 1 — Basic Sciences",
    title: "Physiology: Cardiac, Renal, Respiratory & Acid-Base",
    overview:
      "Integrated organ physiology — pressure-volume loops, nephron segments, V/Q matching, and acid-base interpretation.",
    summary:
      "Cardiac physiology: Frank-Starling increases stroke volume with preload; afterload reduction increases SV in failing heart. PV loop shifts: increased contractility shifts loop left/up; increased afterload shifts right/up; increased preload shifts right/end-diastolic volume up. Murmurs change with maneuvers — HOCM louder with Valsalva/standing; MVP later with squatting.\n\nRenal: TF/P ratios along nephron — freely filtered (inulin), secreted (PAH), reabsorbed (glucose, amino acids). RAAS activation in hypovolemia: renin → Ang I → ACE → Ang II (vasoconstrict, aldosterone) + ADH. K+-sparing diuretics act late distal/collecting duct.\n\nRespiratory: V/Q mismatch — apex high V/Q (dead space), base low V/Q (shunt physiology). Hypoxemia mechanisms: low FiO2, hypoventilation, diffusion limitation, V/Q mismatch, shunt. CO2 transport as bicarbonate.\n\nAcid-base: Henderson-Hasselbalch; respiratory vs metabolic; anion gap = Na - (Cl + HCO3); MUDPILES for gap acidosis.",
    keyConcepts: [
      "Frank-Starling: increased preload → increased stroke volume up to a limit",
      "RAAS and ADH responses to hypovolemia/hyperosmolarity",
      "V/Q mismatch and shunt physiology explain hypoxemia patterns",
      "Anion gap metabolic acidosis differential (MUDPILES)",
      "Renal tubular defects: RTA types I (distal), II (proximal), IV (hyperkalemic)",
      "Oxygen-hemoglobin dissociation curve shifts: right (↓ affinity) with ↑CO2, ↑H+, ↑2,3-BPG, ↑temp",
    ],
    mustKnowFacts: [
      "Metabolic alkalosis + hypertensive crisis in young patient — suspect hyperaldosteronism or Liddle syndrome",
      "Paradoxical aciduria in volume-depleted metabolic alkalosis — kidneys retain H+ while excreting Na with bicarbonate",
    ],
    pearls: [
      "Standing makes HOCM murmur louder by decreasing preload — opposite of most murmurs.",
      "High-altitude hypoxemia is primarily V/Q mismatch and low PiO2, not diffusion limitation in healthy lungs.",
    ],
    pitfalls: [
      "Using SpO2 alone to exclude hypoventilation — pulse ox can appear normal until severe",
      "Forgetting that shunt hypoxemia does not fully correct with 100% O2",
    ],
    practiceTopicSlug: "physiology",
    usmleSteps: ["step1"],
    sortOrder: 103,
  },
  {
    slug: "biochemistry-metabolism",
    category: "Step 1 — Basic Sciences",
    title: "Biochemistry: Metabolic Pathways & Nutrition",
    overview:
      "Glycolysis, gluconeogenesis, urea cycle, lipid metabolism, and inborn errors of metabolism.",
    summary:
      "Metabolic pathway questions link enzyme defect → substrate accumulation → clinical phenotype. Glycolysis vs gluconeogenesis: irreversible steps bypassed in gluconeogenesis (pyruvate carboxylase, PEPCK, fructose-1,6-bisphosphatase, G6Pase). Insulin favors anabolic pathways; glucagon/cortisol/epinephrine favor catabolism.\n\nUrea cycle defects: hyperammonemia without acidosis; orotic aciduria in OTC deficiency ( carbamoyl phosphate spills into pyrimidine synthesis). Maple syrup urine disease: branched-chain amino acids — sweet urine, neurologic decline; restrict leucine/isoleucine/valine.\n\nLipid: HMG-CoA reductase is statin target; LDL receptor defects cause familial hypercholesterolemia. Ketogenesis in fasting/hepatic β-oxidation. Fatty acid oxidation defects: hypoketotic hypoglycemia with fasting stress.\n\nVitamins: B1 (Wernicke), B3 (pellagra), B12/folate (macrocytic anemia + neuro), C (scurvy), D (rickets), E (hemolytic anemia in infants), K (coagulopathy).",
    keyConcepts: [
      "Irreversible glycolysis steps vs gluconeogenesis bypass enzymes",
      "Urea cycle defects → hyperammonemia; OTC deficiency → orotic aciduria",
      "GSD types: I (glucose-6-phosphatase), II (Pompe lysosomal), V (McArdle exercise intolerance)",
      "MSUD: branched-chain ketoacid dehydrogenase deficiency",
      "Statins inhibit HMG-CoA reductase; FH from LDL receptor mutation",
      "Vitamin cofactors: B1 (TPP), B2 (FAD), B3 (NAD), B6 (PLP), folate/B12 (methionine synthase)",
    ],
    mustKnowFacts: [
      "Give thiamine before glucose in malnourished patient — prevents Wernicke encephalopathy",
      "Classic galactosemia: galactose-1-phosphate uridyltransferase deficiency — jaundice, cataracts, E. coli sepsis in neonate",
    ],
    pearls: [
      "Infant with vomiting after milk feeds, reducing substances in urine — galactosemia until proven otherwise.",
      "Marathon runner with cramping and dark urine — McArdle (GSD V); lacks muscle glycogen phosphorylase.",
    ],
    pitfalls: [
      "Confusing ketosis (diabetes, starvation) with hypoketotic hypoglycemia (fatty acid oxidation defects)",
      "Missing B12 vs folate: only B12 causes neurologic symptoms + methylmalonic acid elevation",
    ],
    practiceTopicSlug: "biochemistry",
    usmleSteps: ["step1"],
    sortOrder: 104,
  },
  {
    slug: "microbiology-immunology",
    category: "Step 1 — Basic Sciences",
    title: "Microbiology & Immunology: Bugs, Drugs & Host Defense",
    overview:
      "Gram stain algorithm, viral structures, hypersensitivity types, and vaccine principles.",
    summary:
      "Bacteriology framework: Gram-positive cocci in clusters (Staph), chains (Strep), bacilli (Bacillus, Clostridium, Listeria); Gram-negative diplococci (Neisseria), rods (Enterobacteriaceae, Pseudomonas), curved (Campylobacter, H. pylori). Atypical bacteria lack classic cell wall (Mycoplasma — treat with macrolide/tetracycline). Obligate intracellular (Rickettsia, Chlamydia) vs facultative.\n\nVirology: DNA vs RNA, enveloped vs naked, replication site. HBV serology matrix (HBsAg, anti-HBs, anti-HBc, HBeAg). HIV life cycle targets: entry, reverse transcriptase, integrase, protease.\n\nImmunology: hypersensitivity I–IV (anaphylaxis, cytotoxic, immune complex, delayed). Primary immunodeficiencies: B cell (XLA, CVID), T cell (DiGeorge), phagocyte (CGD, Chediak-Higashi), complement (C5–C9 → Neisseria). Autoantibodies: ANA (SLE), anti-dsDNA (SLE nephritis), RF/anti-CCP (RA), c-ANCA (PR3 GPA), p-ANCA (MPA, Churg-Strauss).",
    keyConcepts: [
      "Gram algorithm and catalase/coagulase for Staph vs Strep",
      "HBV serology interpretation for acute, chronic, and immune status",
      "Hypersensitivity types I–IV with examples (anaphylaxis, AIHA, SLE, TB skin test)",
      "Primary immunodeficiency patterns: recurrent encapsulated bacteria, Neisseria, opportunistic infections",
      "Exotoxin vs endotoxin: exotoxin secreted proteins with specific MOA; endotoxin LPS from Gram-negative",
      "Live vs killed vaccines — contraindications in pregnancy/immunocompromised",
    ],
    mustKnowFacts: [
      "Terminal complement C5–C9 deficiency → recurrent Neisseria meningitidis/gonorrhoeae",
      "Group B Strep prophylaxis in labor: penicillin if colonized — prevents neonatal sepsis/meningitis",
    ],
    pearls: [
      "Teen with petechial rash and meningismus after pizza party — N. meningitidis; complement deficiency increases risk.",
      "Farmer with pulmonary symptoms and moldy hay — Micromonospora/thermophilic actinomycetes (hypersensitivity pneumonitis).",
    ],
    pitfalls: [
      "Treating Mycoplasma pneumonia with beta-lactam — lacks peptidoglycan cell wall",
      "Confusing anti-HBs (immunity) with HBsAg (active infection)",
    ],
    practiceTopicSlug: "microbiology",
    usmleSteps: ["step1"],
    sortOrder: 105,
  },
  {
    slug: "anatomy-embryology",
    category: "Step 1 — Basic Sciences",
    title: "Anatomy & Embryology: Landmarks & Malformations",
    overview:
      "High-yield anatomic relations, cranial nerves, and embryologic derivatives linked to congenital defects.",
    summary:
      "Anatomy vignettes test spatial relationships and clinical correlations. Cranial nerves: CN III palsy (down-and-out eye, ptosis, pupil often involved), CN VI (lateral rectus — horizontal diplopia worse at distance), CN VII (facial weakness — UMN spares forehead). Carotid sheath contents: common carotid, IJV, vagus. Inguinal canal: indirect hernia through internal ring (lateral to inferior epigastrics); direct through Hesselbach triangle.\n\nEmbryology: pharyngeal arch derivatives (1st Meckel → mandible/malleus; 2nd Reichert → stapes; 3rd → stylopharyngeus; 4th–6th → laryngeal cartilages). Neural tube defects: folate prevention; elevated AFP in open NTD. DiGeorge 22q11 — 3rd/4th pouch failure → absent thymus/parathyroids, cardiac outflow defects. TGA, TOF, ASD/VSD link to septation errors.",
    keyConcepts: [
      "Cranial nerve deficits localize lesions (UMN vs LMN facial palsy)",
      "Indirect vs direct inguinal hernia anatomic distinction",
      "Pharyngeal arch derivatives and associated cranial nerves",
      "Neural tube defects: anencephaly, spina bifida, AFP changes",
      "DiGeorge syndrome: cardiac + thymic + parathyroid defects",
      "Portal triad: hepatic artery, portal vein, bile duct — Cantlie line for resections",
    ],
    mustKnowFacts: [
      "Ectopic pregnancy most often ampulla of fallopian tube — rupture causes hemoperitoneum",
      "Meckel diverticulum: rule of 2s — 2% population, 2 feet from ileocecal valve, 2 types ectopic tissue, presents by age 2",
    ],
    pearls: [
      "Child with chin laceration and lower lip numbness — mental nerve (V3) injury from anterior mandible fracture.",
      "Neonate with single umbilical artery — associated with renal and cardiac anomalies; evaluate further.",
    ],
    pitfalls: [
      "Confusing indirect hernia (congenital patent processus vaginalis) with direct (acquired floor weakness)",
      "Missing CN VI as false localizing sign in raised ICP — still test all CN in exam vignettes",
    ],
    practiceTopicSlug: "anatomy",
    usmleSteps: ["step1"],
    sortOrder: 106,
  },
]);

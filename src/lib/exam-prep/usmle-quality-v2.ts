/**
 * USMLE 2025–2026 quality v2 — 55 diverse items across Step 1, 2 CK, and 3.
 */
import type { EnrichedBankItem } from "./seed-helpers";
import {
  usmleAbstract,
  usmleBiostats,
  usmleCcs,
  usmleDrugAd,
  usmleEthics,
  usmleExhibit,
  usmleMcq,
  usmleSequentialSet,
  usmleVignette,
  type UsmleStepLevel,
} from "./usmle-seed-factory";

const S1 = "step1" as UsmleStepLevel;
const S2 = "step2" as UsmleStepLevel;
const S3 = "step3" as UsmleStepLevel;
const CR = "usmle-clinical-reasoning" as const;
const ETH = "usmle-ethics" as const;
const BIO = "usmle-biostats" as const;

const NBME = { label: "USMLE Content Outline / NBME-style vignette standards" };
const FA = { label: "First Aid for the USMLE — high-yield concept" };

const sequentialSets: EnrichedBankItem[] = [
  ...usmleSequentialSet(
    "pulmonology",
    "seq-pe-01",
    `ER | 58 y/o woman | Sudden dyspnea & pleuritic chest pain | Smoker | HR 112 | RR 24 | SpO2 91% RA | Clear lungs | Unilateral leg swelling`,
    [
      {
        stem: "Most likely diagnosis?",
        options: [
          "Pulmonary embolism",
          "Community-acquired pneumonia",
          "Spontaneous pneumothorax",
          "Acute asthma exacerbation",
        ],
        correct: "Pulmonary embolism",
        explanation:
          "Sudden dyspnea with pleuritic pain, tachycardia, hypoxemia, and leg swelling suggest PE; clear lungs argue against pneumonia.",
      },
      {
        stem: "Best next diagnostic step?",
        options: [
          "CT pulmonary angiography (or V/Q if contrast contraindicated)",
          "Immediate broad-spectrum antibiotics",
          "High-dose inhaled bronchodilator trial only",
          "Elective coronary angiography",
        ],
        correct: "CT pulmonary angiography (or V/Q if contrast contraindicated)",
        explanation:
          "When PE is likely and bleeding risk acceptable, CTPA confirms diagnosis and guides anticoagulation.",
      },
    ],
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "respiratory", references: [NBME] }
  ),
  ...usmleSequentialSet(
    "internal-medicine",
    "seq-dka-01",
    `ED | 22 y/o man | T1DM | Nausea, polyuria, Kussmaul breathing | BG 486 mg/dL | pH 7.18 | HCO3 8 mEq/L | Anion gap elevated`,
    [
      {
        stem: "Primary acid-base diagnosis?",
        options: [
          "High anion gap metabolic acidosis",
          "Metabolic alkalosis",
          "Respiratory acidosis only",
          "Normal anion gap metabolic acidosis",
        ],
        correct: "High anion gap metabolic acidosis",
        explanation: "DKA presents with hyperglycemia, ketosis, and elevated anion gap metabolic acidosis.",
      },
      {
        stem: "After initial IV fluids, critical immediate therapy includes:",
        options: [
          "IV insulin infusion with potassium monitoring",
          "Subcutaneous insulin glargine only",
          "Oral metformin load",
          "Sodium bicarbonate for all patients regardless of pH",
        ],
        correct: "IV insulin infusion with potassium monitoring",
        explanation:
          "DKA requires insulin drip after volume resuscitation; replete K+ before insulin if hypokalemic.",
      },
    ],
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "endocrine", references: [NBME] }
  ),
  ...usmleSequentialSet(
    "obgyn",
    "seq-ob-bleed-01",
    `OB triage | 11 wk pregnant | Heavy vaginal bleeding, cramping | Hgb 9.8 g/dL | Closed cervix on exam`,
    [
      {
        stem: "Most likely diagnosis?",
        options: [
          "Threatened abortion",
          "Incomplete abortion",
          "Ectopic pregnancy",
          "Placenta previa",
        ],
        correct: "Threatened abortion",
        explanation:
          "First-trimester bleeding with closed cervix and ongoing pregnancy symptoms fits threatened abortion.",
      },
      {
        stem: "Next best step?",
        options: [
          "Transvaginal ultrasound and serial β-hCG",
          "Immediate dilation and curettage",
          "MRI pelvis before any ultrasound",
          "Expectant management without evaluation",
        ],
        correct: "Transvaginal ultrasound and serial β-hCG",
        explanation: "Ultrasound confirms intrauterine viability; β-hCG trend helps exclude ectopic.",
      },
    ],
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "obgyn", references: [NBME] }
  ),
  ...usmleSequentialSet(
    "cardiology",
    "seq-chest-pain-01",
    `Clinic | 54 y/o man | Exertional chest pressure radiating to jaw | HTN, hyperlipidemia | ECG: 1 mm ST depression V4–V6`,
    [
      {
        stem: "Most appropriate initial classification?",
        options: [
          "Unstable angina / NSTEMI pathway",
          "Stable angina only — discharge home",
          "Benign early repolarization",
          "Pericarditis",
        ],
        correct: "Unstable angina / NSTEMI pathway",
        explanation: "New exertional angina with ischemic ECG changes warrants ACS evaluation.",
      },
      {
        stem: "Along with aspirin and anticoagulation per protocol, add:",
        options: [
          "Anti-ischemic therapy (e.g., nitroglycerin, beta-blocker if no contraindication) and troponin serial testing",
          "Routine thrombolysis without contraindication assessment",
          "Immediate stress test before any biomarkers",
          "Observation only without troponins",
        ],
        correct:
          "Anti-ischemic therapy (e.g., nitroglycerin, beta-blocker if no contraindication) and troponin serial testing",
        explanation: "NSTEMI/unstable angina pathway includes anti-ischemics, anticoagulation, and troponin monitoring.",
      },
    ],
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "cardiovascular", references: [NBME] }
  ),
];

const coreItems: EnrichedBankItem[] = [
  // ── Step 1 (18) ──────────────────────────────────────────────────────────
  usmleVignette(
    "pathology",
    `Autopsy | 67 y/o man | Sudden death | History of smoking | Lung mass biopsy: small blue cells, keratin+, chromogranin+`,
    "Most likely diagnosis?",
    ["Small cell lung carcinoma", "Squamous cell carcinoma", "Adenocarcinoma", "Mesothelioma"],
    "Small cell lung carcinoma",
    "Small cell CA shows neuroendocrine markers (chromogranin) and responds to chemo; central location common in smokers.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "pathology", references: [FA] }
  ),
  usmleMcq(
    "pharmacology",
    "A researcher blocks HMG-CoA reductase in hepatocytes. Which downstream effect is expected?",
    [
      "Decreased de novo cholesterol synthesis",
      "Increased bile acid excretion only",
      "Immediate LDL receptor downregulation",
      "Increased hepatic VLDL secretion",
    ],
    "Decreased de novo cholesterol synthesis",
    "Statins inhibit the rate-limiting step of cholesterol synthesis, triggering compensatory LDL receptor upregulation.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "pharmacology", references: [FA] }
  ),
  usmleVignette(
    "microbiology",
    `Micro lab | Gram-negative diplococci from CSF of febrile college student in dorm outbreak`,
    "Empiric coverage must include treatment for:",
    ["Neisseria meningitidis", "Staphylococcus epidermidis", "Candida albicans", "Mycobacterium tuberculosis"],
    "Neisseria meningitidis",
    "Neisseria meningitidis is a classic cause of meningococcemia/meningitis in young adults; ceftriaxone + dexamethasone per protocol.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "microbiology", references: [NBME] }
  ),
  usmleMcq(
    "biochemistry",
    "A child has fasting hypoglycemia, hepatomegaly, and deficient glucose-6-phosphatase activity.",
    [
      "Von Gierke disease (GSD I)",
      "Pompe disease",
      "McArdle disease",
      "Tay-Sachs disease",
    ],
    "Von Gierke disease (GSD I)",
    "G6Pase deficiency impairs gluconeogenesis/glycogenolysis → severe fasting hypoglycemia and lactic acidosis.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "biochemistry", references: [FA] }
  ),
  usmleVignette(
    "physiology",
    `Experiment | Efferent arteriole of glomerulus constricted in animal model`,
    "Glomerular filtration rate will:",
    [
      "Decrease due to reduced glomerular hydrostatic pressure",
      "Increase due to decreased oncotic pressure only",
      "Remain unchanged",
      "Increase due to increased renal blood flow",
    ],
    "Decrease due to reduced glomerular hydrostatic pressure",
    "Efferent constriction reduces GFR despite possible filtration fraction changes; afferent vs efferent effects are high-yield.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "physiology", references: [FA] }
  ),
  usmleMcq(
    "anatomy",
    "A lesion compressing the lateral femoral cutaneous nerve at the inguinal ligament causes:",
    [
      "Meralgia paresthetica (anterolateral thigh numbness)",
      "Foot drop",
      "Loss of ankle reflex",
      "Medial thigh adductor weakness",
    ],
    "Meralgia paresthetica (anterolateral thigh numbness)",
    "LFCN entrapment → sensory symptoms over lateral thigh without motor deficit.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "anatomy", references: [FA] }
  ),
  usmleVignette(
    "pathology",
    `Renal biopsy | Crescentic glomerulonephritis | Linear IgG on immunofluorescence`,
    "Most likely underlying process?",
    [
      "Anti-GBM disease (Goodpasture)",
      "Granular immune complex deposition",
      "Amyloidosis",
      "Minimal change disease",
    ],
    "Anti-GBM disease (Goodpasture)",
    "Linear IF pattern suggests anti-GBM antibodies; often presents with rapidly progressive GN ± pulmonary hemorrhage.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "pathology", references: [FA] }
  ),
  usmleMcq(
    "pharmacology",
    "Organophosphate poisoning causes accumulation of acetylcholine primarily by inhibiting:",
    [
      "Acetylcholinesterase at synapses",
      "Monoamine oxidase",
      "Cyclooxygenase",
      "Xanthine oxidase",
    ],
    "Acetylcholinesterase at synapses",
    "SLUDGE symptoms and fasciculations result from AChE inhibition; treat with atropine + pralidoxime.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "pharmacology", references: [FA] }
  ),
  usmleVignette(
    "microbiology",
    `HIV+ patient | CD4 120 | Retinal exam: cotton-wool spots and hemorrhages`,
    "Most likely opportunistic infection to evaluate for:",
    ["CMV retinitis", "Toxoplasma brain abscess only", "Cryptococcus meningitis only", "HSV keratitis"],
    "CMV retinitis",
    "CMV retinitis occurs at low CD4 counts; presents with floaters and characteristic retinal findings.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "microbiology", references: [NBME] }
  ),
  usmleExhibit(
    "physiology",
    `PFT review | 45 y/o smoker | Progressive dyspnea`,
    "Pattern is most consistent with:",
    {
      headers: ["Parameter", "Value", "Predicted"],
      rows: [
        ["FEV1", "1.8 L", "3.2 L"],
        ["FVC", "4.1 L", "4.3 L"],
        ["FEV1/FVC", "44%", ">70%"],
      ],
    },
    [
      "COPD (obstructive pattern)",
      "Restrictive lung disease",
      "Normal spirometry",
      "Neuromuscular weakness pattern only",
    ],
    "COPD (obstructive pattern)",
    "Reduced FEV1/FVC with preserved-ish FVC indicates obstructive physiology (COPD/emphysema).",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "respiratory", references: [NBME] }
  ),
  usmleBiostats(
    "biostatistics",
    `Study compares new screening test | Results below`,
    "Sensitivity of the test is:",
    [
      "80%",
      "75%",
      "60%",
      "50%",
    ],
    "80%",
    "Sensitivity = TP/(TP+FN) = 40/(40+10) = 80%.",
    {
      stepLevel: S1,
      blueprintDomain: BIO,
      blueprintSystem: "biostatistics",
      references: [NBME],
    },
    {
      headers: ["", "Disease+", "Disease−"],
      rows: [
        ["Test+", "40", "10"],
        ["Test−", "10", "140"],
      ],
    }
  ),
  usmleMcq(
    "biochemistry",
    "Urea cycle defect most commonly presents in neonates with:",
    [
      "Hyperammonemia and neurologic deterioration",
      "Hypoglycemia only without encephalopathy",
      "Hypercalcemia",
      "Ketonuria without acidosis",
    ],
    "Hyperammonemia and neurologic deterioration",
    "Ammonia accumulation causes cerebral edema; ornithine transcarbamylase deficiency is classic X-linked defect.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "biochemistry", references: [FA] }
  ),
  usmleVignette(
    "pathology",
    `Bone marrow | 70 y/o | Pancytopenia | Hypocellular marrow with fat replacement`,
    "Diagnosis?",
    ["Aplastic anemia", "Acute myeloid leukemia", "Multiple myeloma", "Iron deficiency anemia"],
    "Aplastic anemia",
    "Pancytopenia with hypocellular marrow suggests marrow failure; exclude drugs, viruses, and constitutional causes.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "pathology", references: [FA] }
  ),
  usmleMcq(
    "physiology",
    "Primary stimulus for ADH release in hyperosmolar states is:",
    [
      "Increased plasma osmolality sensed by osmoreceptors",
      "Decreased blood volume only",
      "Increased atrial natriuretic peptide",
      "Hypokalemia",
    ],
    "Increased plasma osmolality sensed by osmoreceptors",
    "Osmoreceptors in hypothalamus trigger ADH; volume sensors modulate response at lower threshold.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "physiology", references: [FA] }
  ),
  usmleVignette(
    "pharmacology",
    `Patient on isoniazid develops peripheral neuropathy.`,
    "Mechanism-based prevention includes:",
    [
      "Pyridoxine (vitamin B6) supplementation",
      "Folic acid only",
      "Vitamin K",
      "Calcium carbonate",
    ],
    "Pyridoxine (vitamin B6) supplementation",
    "INH depletes B6, causing neuropathy; pyridoxine co-administration prevents deficiency.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "pharmacology", references: [FA] }
  ),
  usmleMcq(
    "microbiology",
    "Exotoxin that increases cAMP by ADP-ribosylation of Gs protein:",
    [
      "Cholera toxin",
      "Lipid A endotoxin",
      "Streptolysin O",
      "Coagulase",
    ],
    "Cholera toxin",
    "Cholera toxin permanently activates Gs → ↑cAMP → secretory diarrhea.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "microbiology", references: [FA] }
  ),
  usmleEthics(
    "ethics",
    `Competent adult Jehovah's Witness with life-threatening hemorrhage refuses transfusion after informed discussion.`,
    "Appropriate physician action?",
    [
      "Respect informed refusal; document and optimize non-blood alternatives",
      "Transfuse immediately against wishes",
      "Obtain routine court order in all cases",
      "Sedate patient and transfuse",
    ],
    "Respect informed refusal; document and optimize non-blood alternatives",
    "Autonomy prevails for capacitated adults; ensure understanding and offer cell-saver/erythropoietin where appropriate.",
    { stepLevel: S1, blueprintDomain: ETH, references: [NBME] }
  ),
  usmleVignette(
    "anatomy",
    `Facial trauma | Inability to close right eye | Forehead wrinkling intact on both sides`,
    "Lesion localization?",
    [
      "Right facial nerve (peripheral VII palsy)",
      "Left cortical lesion only",
      "Trigeminal nerve V1",
      "Oculomotor nerve",
    ],
    "Right facial nerve (peripheral VII palsy)",
    "Peripheral CN VII affects entire ipsilateral face including forehead; central lesions spare forehead due to bilateral innervation.",
    { stepLevel: S1, blueprintDomain: CR, blueprintSystem: "anatomy", references: [FA] }
  ),

  // ── Step 2 CK (17 standalone + 8 sequential = 25) ────────────────────────
  usmleVignette(
    "pediatrics",
    `Peds ED | 3 y/o | Barking cough, stridor at rest | Low-grade fever | No drooling`,
    "First-line management?",
    [
      "Dexamethasone ± nebulized epinephrine if moderate-severe",
      "Immediate intubation without trial of steroids",
      "Antibiotics for epiglottitis routinely",
      "Chest CT before any therapy",
    ],
    "Dexamethasone ± nebulized epinephrine if moderate-severe",
    "Croup (laryngotracheitis) treated with steroids; epinephrine for worsening stridor.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "pediatrics", references: [NBME] }
  ),
  usmleVignette(
    "nephrology",
    `Clinic | 28 y/o woman | Edema, proteinuria 4.2 g/day | Fatigue | ANA negative`,
    "Most likely diagnosis?",
    ["Minimal change disease", "IgA nephropathy", "Post-streptococcal GN", "Renal artery stenosis"],
    "Minimal change disease",
    "Nephrotic-range proteinuria in young adult with bland urine sediment suggests minimal change (common in children/young adults).",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "nephrology", references: [NBME] }
  ),
  usmleVignette(
    "psychiatry",
    `22 y/o college student | 5 days no sleep, pressured speech, grandiosity, risky spending | No prior episodes`,
    "Most appropriate initial pharmacotherapy?",
    [
      "Second-generation antipsychotic (± mood stabilizer per presentation)",
      "SSRI monotherapy",
      "Benzodiazepine monotherapy long-term",
      "Stimulant augmentation",
    ],
    "Second-generation antipsychotic (± mood stabilizer per presentation)",
    "Acute mania requires antipsychotic or mood stabilizer; SSRIs alone may worsen mania.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "psychiatry", references: [NBME] }
  ),
  usmleVignette(
    "emergency-medicine",
    `Trauma bay | Penetrating abdominal wound | BP 80/50 | HR 130 | Abdomen rigid`,
    "Next step?",
    [
      "Emergent operative exploration / damage control surgery",
      "CT abdomen with contrast before any intervention",
      "Discharge if FAST negative only",
      "Oral fluids and observation",
    ],
    "Emergent operative exploration / damage control surgery",
    "Unstable penetrating trauma with peritoneal signs warrants laparotomy without delaying for CT.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "emergency-medicine", references: [NBME] }
  ),
  usmleExhibit(
    "internal-medicine",
    `Ward | Fever day 3 post-op cholecystectomy`,
    "Most likely source?",
    {
      headers: ["WBC", "Temp", "UA", "CXR", "Incision"],
      rows: [
        ["14.2k", "38.6°C", "Negative", "Clear", "Erythema/tenderness at RUQ site"],
        ["Trend", "Rising", "—", "—", "—"],
      ],
    },
    [
      "Surgical site infection",
      "Catheter-associated UTI",
      "Hospital-acquired pneumonia",
      "C. difficile colitis",
    ],
    "Surgical site infection",
    "Localized incision findings with post-op fever point to wound infection over remote sources.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "surgery", references: [NBME] }
  ),
  usmleVignette(
    "neurology",
    `Sudden worst headache | Neck stiffness | CT head negative`,
    "Next step?",
    [
      "Lumbar puncture to evaluate for subarachnoid hemorrhage",
      "Discharge with reassurance",
      "Carotid Doppler only",
      "EEG",
    ],
    "Lumbar puncture to evaluate for subarachnoid hemorrhage",
    "Thunderclap headache with negative CT still requires LP (xanthochromia/RBC) to exclude SAH early after bleed.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "neurology", references: [NBME] }
  ),
  usmleVignette(
    "cardiology",
    `65 y/o | HFrEF | On GDMT | New dry cough on ACE inhibitor | No angioedema`,
    "Best adjustment?",
    [
      "Switch ACE inhibitor to ARB if cough limits therapy",
      "Stop all neurohormonal blockade",
      "Add thiazolidinedione",
      "Increase ACE inhibitor dose for cough tolerance",
    ],
    "Switch ACE inhibitor to ARB if cough limits therapy",
    "ACEi cough is class effect; ARB maintains RAAS blockade without bradykinin-mediated cough.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "cardiovascular", references: [NBME] }
  ),
  usmleVignette(
    "internal-medicine",
    `Nursing home | 84 y/o | Acute confusion, fever | UA: nitrite+, leukocyte esterase+`,
    "Empiric treatment should cover:",
    [
      "E. coli and other common uropathogens (oral or IV based on severity)",
      "MRSA pneumonia routinely",
      "Antifungal for candiduria always",
      "Antiviral for HSV encephalitis only",
    ],
    "E. coli and other common uropathogens (oral or IV based on severity)",
    "Catheter-associated or complicated UTI in elderly requires antibiotics guided by severity and local resistance.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "infectious-disease", references: [NBME] }
  ),
  usmleEthics(
    "ethics",
    `Adolescent requests STI treatment but asks that parents not be informed. State allows mature minor confidentiality.`,
    "Best approach?",
    [
      "Treat per mature minor laws; encourage voluntary parental involvement",
      "Mandatory parental notification always",
      "Refuse care without parental consent in all cases",
      "Discuss with parents first without patient permission",
    ],
    "Treat per mature minor laws; encourage voluntary parental involvement",
    "Many jurisdictions permit confidential adolescent STI care; balance autonomy, public health, and safety.",
    { stepLevel: S2, blueprintDomain: ETH, references: [NBME] }
  ),
  usmleVignette(
    "obgyn",
    `36 wk GA | BP 158/96 | Proteinuria 2+ | Headache | RUQ tenderness`,
    "Diagnosis and immediate concern?",
    [
      "Preeclampsia with severe features — risk of eclampsia/HELLP",
      "Physiologic pregnancy changes only",
      "Gestational thrombocytopenia alone",
      "Placenta previa",
    ],
    "Preeclampsia with severe features — risk of eclampsia/HELLP",
    "Severe-range BP with symptoms meets severe preeclampsia; magnesium and delivery planning indicated.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "obgyn", references: [NBME] }
  ),
  usmleBiostats(
    "biostatistics",
    `RCT reports relative risk of outcome 0.6 (95% CI 0.4–0.9) with intervention vs placebo`,
    "Best interpretation?",
    [
      "40% relative risk reduction; statistically significant at α=0.05",
      "60% absolute risk reduction guaranteed",
      "No effect because RR < 1",
      "Study proves causation without confounding assessment",
    ],
    "40% relative risk reduction; statistically significant at α=0.05",
    "RR 0.6 → 40% relative reduction; CI excludes 1 → significant. Absolute risk reduction requires event rates.",
    { stepLevel: S2, blueprintDomain: BIO, blueprintSystem: "biostatistics", references: [NBME] }
  ),
  usmleVignette(
    "pulmonology",
    `Asthma | Partial response to albuterol | Peak flow 55% personal best | Speaking in sentences`,
    "Next step in management?",
    [
      "Systemic corticosteroids and continued bronchodilator therapy",
      "Discharge without steroids",
      "Immediate intubation without trial of medical therapy",
      "Antibiotic monotherapy",
    ],
    "Systemic corticosteroids and continued bronchodilator therapy",
    "Moderate-severe exacerbation requires systemic steroids plus repeated SABA; monitor for deterioration.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "respiratory", references: [NBME] }
  ),
  usmleVignette(
    "internal-medicine",
    `Long-term PPI user | Chronic diarrhea | Recent antibiotics | LLQ cramping`,
    "Most likely diagnosis?",
    [
      "C. difficile colitis",
      "Ulcerative colitis flare only",
      "Irritable bowel syndrome",
      "Celiac disease",
    ],
    "C. difficile colitis",
    "Antibiotic-associated diarrhea with PPI use (risk factor) suggests C. diff; test stool toxin/PCR.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "gastrointestinal", references: [NBME] }
  ),
  usmleExhibit(
    "nephrology",
    `ED electrolytes review`,
    "Primary disturbance?",
    {
      headers: ["Na+", "K+", "Cl−", "HCO3−", "pH"],
      rows: [
        ["138", "6.1", "102", "18", "7.28"],
      ],
    },
    [
      "High anion gap metabolic acidosis with hyperkalemia",
      "Metabolic alkalosis",
      "Respiratory alkalosis",
      "Normal acid-base status",
    ],
    "High anion gap metabolic acidosis with hyperkalemia",
    "Low pH and HCO3 with elevated K+ suggest AG metabolic acidosis (e.g., renal failure, toxins) with hyperkalemia.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "nephrology", references: [NBME] }
  ),
  usmleVignette(
    "pediatrics",
    `6 wk infant | Non-bilious projectile vomiting | Palpable olive in epigastrium | Hypochloremic metabolic alkalosis`,
    "Diagnosis?",
    ["Pyloric stenosis", "Intussusception", "Necrotizing enterocolitis", "Hirschsprung disease"],
    "Pyloric stenosis",
    "Classic triad: projectile vomiting, olive mass, hypochloremic metabolic alkalosis; ultrasound confirms.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "pediatrics", references: [NBME] }
  ),
  usmleVignette(
    "emergency-medicine",
    `Anaphylaxis after bee sting | Urticaria, wheeze, hypotension`,
    "Immediate treatment?",
    [
      "Intramuscular epinephrine in anterolateral thigh",
      "Oral diphenhydramine alone",
      "IV antibiotics",
      "Observation without epinephrine",
    ],
    "Intramuscular epinephrine in anterolateral thigh",
    "Anaphylaxis first-line is IM epinephrine; adjuncts include fluids, albuterol, antihistamines, steroids.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "emergency-medicine", references: [NBME] }
  ),
  usmleEthics(
    "ethics",
    `Medical student documents medication error that did not reach patient (near miss).`,
    "Appropriate action?",
    [
      "Report through institutional safety system; debrief with team",
      "Hide error to avoid disciplinary action",
      "Blame nurse publicly on ward",
      "Document in patient chart as patient harm event",
    ],
    "Report through institutional safety system; debrief with team",
    "Near-miss reporting drives systems improvement; non-punitive culture improves safety.",
    { stepLevel: S2, blueprintDomain: ETH, references: [NBME] }
  ),
  usmleVignette(
    "neurology",
    `MS patient | Acute unilateral vision loss | Pain with eye movement | Afferent pupillary defect`,
    "Diagnosis?",
    ["Optic neuritis", "Retinal detachment", "Glaucoma", "Cataract"],
    "Optic neuritis",
    "Painful monocular vision loss with RAPD is classic optic neuritis; evaluate for demyelinating disease.",
    { stepLevel: S2, blueprintDomain: CR, blueprintSystem: "neurology", references: [NBME] }
  ),

  // ── Step 3 (12) ──────────────────────────────────────────────────────────
  usmleAbstract(
    "biostatistics",
    {
      title: "SGLT2 inhibitors and heart failure hospitalizations (randomized trial)",
      source: "N Engl J Med — multicenter, double-blind, placebo-controlled",
      body: `Background: SGLT2i reduce HF events in T2DM. Methods: 4,500 patients with HFrEF randomized to empagliflozin vs placebo; primary endpoint time-to-first HF hospitalization or CV death. Results: HR 0.75 (95% CI 0.65–0.86), p<0.001. Withdrawals balanced. Conclusion: Empagliflozin lowered composite HF/CV outcomes vs placebo.`,
    },
    "Which statement is most accurate?",
    [
      "Randomization helps balance measured and unmeasured confounders at baseline",
      "Double-blind design eliminates selection bias in enrollment",
      "Statistical significance proves the drug is clinically mandatory in all patients",
      "Placebo group prevents lead-time bias in all trial designs",
    ],
    "Randomization helps balance measured and unmeasured confounders at baseline",
    "Randomization distributes confounders; blinding reduces performance/detection bias but doesn't fix volunteer bias.",
    { stepLevel: S3, blueprintDomain: BIO, blueprintSystem: "biostatistics", references: [NBME] }
  ),
  usmleAbstract(
    "internal-medicine",
    {
      title: "Vitamin D supplementation and fall prevention in elderly nursing home residents",
      source: "JAMA Internal Medicine — prospective cohort",
      body: `Design: Observational cohort of 2,100 nursing home residents followed 2 years. Exposure: self-reported vitamin D use. Outcome: falls per patient-year. Findings: Higher vitamin D use associated with fewer falls (RR 0.85) after adjusting for age, mobility, and calcium intake. Limitation: residual confounding by functional status.`,
    },
    "Greatest threat to validity?",
    [
      "Confounding by indication / functional status",
      "Lack of double-blinding in RCT sense",
      "Random measurement error only",
      "Lead-time bias",
    ],
    "Confounding by indication / functional status",
    "Observational designs risk confounding — healthier patients may take supplements and fall less.",
    { stepLevel: S3, blueprintDomain: BIO, blueprintSystem: "epidemiology", references: [NBME] }
  ),
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Rivaroxaban 20 mg tablets",
      headline: "Oral factor Xa inhibitor for stroke prevention in nonvalvular atrial fibrillation",
      indications: "Reduce risk of stroke/systemic embolism in NVAF; treat DVT/PE",
      warnings: "BLACK BOX: discontinuation increases thrombotic risk. Avoid in active pathological bleeding. Not for prosthetic heart valves.",
    },
    "A 70-year-old with NVAF and prior GI bleed on PPI asks to start this medication. Most important counseling?",
    [
      "Discuss bleeding vs stroke reduction; avoid in active bleed; renal dosing at lower CrCl",
      "Safe with any active ulcer without monitoring",
      "Combine with aspirin routinely for all patients",
      "Stop immediately if once-daily dose missed without clinician input",
    ],
    "Discuss bleeding vs stroke reduction; avoid in active bleed; renal dosing at lower CrCl",
    "DOAC counseling weighs thrombotic benefit against rebleeding; dose adjustments apply in renal dysfunction.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "pharmacology", references: [NBME] }
  ),
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Liraglutide (GLP-1 RA)",
      headline: "Adjunct to diet and exercise for glycemic control in T2DM",
      indications: "Improve glycemic control; CV risk reduction in established CVD",
      warnings: "Contraindicated in personal/family history of medullary thyroid carcinoma or MEN2. Risk of pancreatitis.",
    },
    "Patient with MEN2 mutation history should:",
    [
      "Avoid this medication class",
      "Double the starting dose",
      "Use with metformin only without endocrine referral",
      "Ignore boxed warning if A1c elevated",
    ],
    "Avoid this medication class",
    "GLP-1 RAs carry thyroid C-cell tumor warning — contraindicated in MEN2/medullary thyroid cancer history.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "endocrine", references: [NBME] }
  ),
  usmleDrugAd(
    "pharmacology",
    {
      drug: "Methotrexate (weekly)",
      headline: "DMARD for rheumatoid arthritis and psoriasis",
      indications: "RA, psoriasis, some oncologic uses",
      warnings: "Hepatotoxicity, myelosuppression, teratogenic — pregnancy contraindicated. Folic acid supplementation recommended.",
    },
    "Patient planning pregnancy in 2 months on low-dose weekly methotrexate for RA. Best plan?",
    [
      "Stop methotrexate now; switch to pregnancy-compatible regimen per rheumatology",
      "Continue through conception",
      "Add leflunomide without washout",
      "Stop folic acid to improve efficacy",
    ],
    "Stop methotrexate now; switch to pregnancy-compatible regimen per rheumatology",
    "Methotrexate is teratogenic; discontinue before conception with appropriate washout and alternative therapy.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "rheumatology", references: [NBME] }
  ),
  usmleBiostats(
    "biostatistics",
    `Screening trial: prevalence 10%, test sensitivity 90%, specificity 90% in 1,000 patients`,
    "How many false positives are expected approximately?",
    [
      "90",
      "81",
      "10",
      "100",
    ],
    "90",
    "Without disease: 900 patients. False positive rate = 1 − specificity = 10% → ~90 false positives.",
    { stepLevel: S3, blueprintDomain: BIO, blueprintSystem: "biostatistics", references: [NBME] }
  ),
  usmleBiostats(
    "biostatistics",
    `Case-control study of esophageal cancer finds OR 4.2 (95% CI 2.1–8.0) for tobacco use`,
    "Interpretation?",
    [
      "Tobacco associated with ~4× odds of disease in this study population",
      "Tobacco causes 420% absolute risk increase",
      "RR equals OR without question",
      "CI includes 1 — not significant",
    ],
    "Tobacco associated with ~4× odds of disease in this study population",
    "OR approximates RR for rare outcomes; CI excludes 1 → significant association.",
    { stepLevel: S3, blueprintDomain: BIO, references: [NBME] }
  ),
  usmleEthics(
    "ethics",
    `Intoxicated trauma patient needs emergent surgery; lacks capacity; no reachable surrogate.`,
    "Consent approach?",
    [
      "Proceed under implied/emergency exception; re-consent when capacitated",
      "Delay surgery until sober regardless of hemodynamics",
      "Require written spouse consent always",
      "Discharge AMA if no paperwork",
    ],
    "Proceed under implied/emergency exception; re-consent when capacitated",
    "Life-threatening emergencies permit treatment without explicit consent when incapacitated and surrogate unavailable.",
    { stepLevel: S3, blueprintDomain: ETH, references: [NBME] }
  ),
  usmleCcs(
    "internal-medicine",
    {
      setting: "Inpatient medicine — Day 1 simulation",
      presentation: "68 y/o man admitted with fever, hypotension, lactate 3.8 after UTI symptoms",
      vitals: "T 39.1°C, BP 86/52, HR 118, RR 22, SpO2 94%",
      timeline: "0 min — evaluate sepsis bundle",
    },
    "Highest priority order set?",
    [
      "30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, monitor lactate",
      "Oral fluids and discharge",
      "MRI brain before fluids",
      "Elective cardiac cath",
    ],
    "30 mL/kg IV crystalloid, blood cultures, broad-spectrum antibiotics within 1 hour, monitor lactate",
    "Septic shock requires early fluids, cultures, antibiotics, and reassessment — CMS/SSC sepsis bundle principles.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "critical-care", references: [NBME] }
  ),
  usmleCcs(
    "pulmonology",
    {
      setting: "Ambulatory CCS — Day 2",
      presentation: "45 y/o with asthma, worsening wheeze, using SABA hourly, awakened nightly ×3",
      vitals: "SpO2 93% RA, RR 20, speaking sentences",
      timeline: "Office visit — adjust controller therapy",
    },
    "Best management plan?",
    [
      "Add/increase inhaled corticosteroid; provide action plan; oral steroid if severe exacerbation",
      "SABA alone indefinitely",
      "Stop all inhalers",
      "Antibiotic for all asthma flares",
    ],
    "Add/increase inhaled corticosteroid; provide action plan; oral steroid if severe exacerbation",
    "Poorly controlled asthma requires controller escalation per NHLBI/NAEPP step therapy.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "respiratory", references: [NBME] }
  ),
  usmleCcs(
    "internal-medicine",
    {
      setting: "Hospital day 2 CCS",
      presentation: "Post-op hip repair, fever 38.4, productive cough, SpO2 90% RA",
      vitals: "HR 104, BP 118/70",
      timeline: "Develop hypoxemia — evaluate respiratory source",
    },
    "Next best step?",
    [
      "Chest imaging, incentive spirometry, culture-guided antibiotics if pneumonia",
      "Immediate discharge",
      "Prophylactic anticoagulation only without pulmonary workup",
      "Ignore fever <48h always",
    ],
    "Chest imaging, incentive spirometry, culture-guided antibiotics if pneumonia",
    "Post-op fever with hypoxemia warrants pulmonary evaluation — atelectasis vs pneumonia.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "surgery", references: [NBME] }
  ),
  usmleCcs(
    "cardiology",
    {
      setting: "Outpatient CCS — anticoagulation bridge",
      presentation: "72 y/o with NVAF on warfarin needs elective cholecystectomy in 5 days",
      vitals: "INR 2.8 today, stable hemodynamics",
      timeline: "Perioperative anticoagulation planning",
    },
    "Appropriate plan?",
    [
      "Hold warfarin ~5 days pre-op; bridge with LMWH only if high thrombotic risk per guidelines",
      "Continue warfarin through surgery without holding",
      "Switch to aspirin only",
      "Stop all anticoagulation permanently",
    ],
    "Hold warfarin ~5 days pre-op; bridge with LMWH only if high thrombotic risk per guidelines",
    "Perioperative bridging individualized by stroke risk and bleeding; routine bridging not needed for all.",
    { stepLevel: S3, blueprintDomain: CR, blueprintSystem: "cardiovascular", references: [NBME] }
  ),
];

export const USMLE_QUALITY_V2: EnrichedBankItem[] = [...coreItems, ...sequentialSets];

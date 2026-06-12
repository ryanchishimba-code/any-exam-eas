import type { BankItem } from "@/lib/question-bank";
import {
  hasEtiologyOrPathophysiology,
  hasSignsAndSymptoms,
} from "@/lib/engine/prompts/clinical-reasoning";
import { isUsmleStep1Subject } from "@/lib/subjects/medicine/subject-splits";

const CASE_PREFIX = /^Case\s+\d+:\s*/i;

const WEAK_CORRECT_PATTERNS = [
  /^Focused .* evaluation with targeted history and exam/i,
  /^Pathophysiology of .* explains the dominant finding/i,
  /^Order the test that directly clarifies/i,
  /^First-line therapy targeting/i,
  /^Recognize complication linked to/i,
  /^Patient safety measure specific to/i,
  /^High-yield fact about/i,
  /consistent with the leading diagnosis$/i,
  /empiric therapy required/i,
  /pending culture/i,
];

/** Diagnosis answer choices must not embed management instructions. */
const DIAGNOSIS_OPTION_WEAK = /empiric therapy|pending culture|start antibiotics|dexamethasone|deliver immediately/i;

const WEAK_OPTION_PATTERNS = [
  /^Defer all assessment until imaging/i,
  /^Treat unrelated symptoms without evaluation/i,
  /^Discharge without vital signs/i,
  /^Normal variant requiring no follow-up in every patient/i,
  /^Artifact that invalidates all clinical findings/i,
  /^Random symptom association without mechanism/i,
  /^Only psychological causes in all patients/i,
  /^Broad unguided testing unrelated/i,
  /^Delay evaluation for 6 months/i,
  /^Withhold all treatment until subspecialty referral/i,
  /^Use contraindicated therapy for unrelated conditions/i,
  /^Benign finding never associated with morbidity/i,
  /^Skip infection prevention in all cases/i,
  /^Outdated practice no longer taught/i,
  /^Opposite of established .* principles/i,
];

type UsmleCase = {
  age: number;
  sex: "man" | "woman";
  setting: string;
  chiefComplaint: string;
  history: string;
  vitals: string;
  exam: string;
  labs: string;
  condition: string;
  mechanism: string;
  diagnosis: string;
  initialTest: string;
  nextStep: string;
  firstLineTx: string;
  complication: string;
  relatedDiagnoses: [string, string, string];
  wrongNextSteps: [string, string, string];
  wrongMechanisms: [string, string, string];
  subjectTags: string[];
};

const CLINICAL_CASES: UsmleCase[] = [
  {
    age: 58,
    sex: "man",
    setting: "emergency department",
    chiefComplaint: "crushing substernal chest pain radiating to the left arm for 45 minutes",
    history: "Hypertension, hyperlipidemia, 30-pack-year smoking; no prior cardiac history",
    vitals: "BP 156/92 mmHg, HR 98, RR 18, SpO₂ 96% on room air",
    exam: "Diaphoresis, S4 gallop, no murmur; lungs clear",
    labs: "Troponin I 2.8 ng/mL (elevated), ECG: ST elevation in leads II, III, aVF",
    condition: "ST-elevation myocardial infarction (inferior STEMI)",
    mechanism:
      "Acute coronary thrombosis → transmural ischemia and myocyte necrosis in the inferior wall (RCA territory)",
    diagnosis: "Acute inferior STEMI due to coronary artery occlusion",
    initialTest: "12-lead ECG and serial troponins (already diagnostic); emergent cardiology activation",
    nextStep: "Activate PCI-capable cath lab and administer aspirin, P2Y12 inhibitor, anticoagulation, and nitroglycerin if BP allows per ACS protocol",
    firstLineTx: "Primary percutaneous coronary intervention (PCI) when available within guideline time window",
    complication: "Complete heart block or right ventricular infarction from RCA involvement",
    relatedDiagnoses: ["Unstable angina without ST elevation", "Acute pericarditis", "Aortic dissection"],
    wrongNextSteps: [
      "Discharge with outpatient stress test in 2 weeks",
      "Obtain CT pulmonary angiography as the first test",
      "Start high-dose NSAIDs alone and observe without reperfusion planning",
    ],
    wrongMechanisms: [
      "Coronary vasospasm without plaque rupture as the sole mechanism in all STEMI",
      "Pericardial inflammation causing diffuse ST elevation pattern",
      "Pulmonary embolism causing right heart strain only",
    ],
    subjectTags: ["cardiology", "pathology", "physiology"],
  },
  {
    age: 67,
    sex: "woman",
    setting: "inpatient ward",
    chiefComplaint: "progressive dyspnea and orthopnea over 3 days",
    history: "Ischemic cardiomyopathy, EF 30%, on furosemide and lisinopril",
    vitals: "BP 102/68 mmHg, HR 110, RR 24, SpO₂ 90% on room air",
    exam: "JVD, crackles to mid-lung fields, 2+ pitting edema, S3 gallop",
    labs: "BNP 1,850 pg/mL, creatinine 1.4 mg/dL, chest X-ray: pulmonary vascular congestion",
    condition: "Acute decompensated heart failure",
    mechanism:
      "Reduced forward cardiac output and elevated filling pressures → pulmonary capillary hydrostatic pressure exceeds oncotic pressure → alveolar edema and dyspnea",
    diagnosis: "Acute decompensated systolic heart failure with pulmonary edema",
    initialTest: "BNP/NT-proBNP and chest X-ray to confirm volume overload",
    nextStep: "Administer IV loop diuretic, supplemental oxygen, and assess perfusion; consider afterload reduction and treat precipitants",
    firstLineTx: "IV furosemide with strict I/O monitoring and daily weights",
    complication: "Cardiogenic shock or acute kidney injury from over-diuresis",
    relatedDiagnoses: ["COPD exacerbation", "Pulmonary embolism", "Community-acquired pneumonia"],
    wrongNextSteps: [
      "Large-volume IV normal saline bolus without further assessment",
      "Immediate intubation without trial of BiPAP and diuresis in a cooperative patient",
      "Discharge on increased oral diuretic without reassessment of volume status",
    ],
    wrongMechanisms: [
      "Primary alveolar surfactant deficiency as the cause of crackles in this adult",
      "Isolated bronchospasm without elevated filling pressures",
      "Pneumothorax causing bilateral crackles and JVD",
    ],
    subjectTags: ["cardiology", "physiology", "nephrology"],
  },
  {
    age: 42,
    sex: "woman",
    setting: "urgent care",
    chiefComplaint: "sudden pleuritic chest pain and shortness of breath",
    history: "Oral contraceptive use; recent 8-hour flight; no prior DVT",
    vitals: "BP 118/76 mmHg, HR 112, RR 22, SpO₂ 91% on room air",
    exam: "Tachycardic, clear lungs, no leg swelling; calf nontender",
    labs: "D-dimer 1,420 ng/mL, ABG: pH 7.48, PaCO₂ 32 mmHg, PaO₂ 68 mmHg",
    condition: "Pulmonary embolism",
    mechanism:
      "Venous thrombus embolizes to pulmonary arteries → increased dead space ventilation and V/Q mismatch → hypoxemia and tachycardia",
    diagnosis: "Acute pulmonary embolism with hypoxemia",
    initialTest: "CT pulmonary angiography (or V/Q scan if contrast contraindicated) after pretest probability assessment",
    nextStep: "Start anticoagulation if no contraindication while confirming diagnosis; assess hemodynamic stability",
    firstLineTx: "Direct oral anticoagulant or heparin bridge per guideline-based PE treatment",
    complication: "Massive PE with right ventricular strain and hemodynamic collapse",
    relatedDiagnoses: ["Acute coronary syndrome", "Spontaneous pneumothorax", "Anxiety/panic attack"],
    wrongNextSteps: [
      "Reassurance and discharge without imaging given clear lungs",
      "Obtain echocardiogram only and defer anticoagulation for 1 week",
      "Start antibiotics for pneumonia without supporting infiltrate",
    ],
    wrongMechanisms: [
      "Left ventricular failure as the primary cause of isolated pleuritic pain and hypoxemia",
      "Primary pulmonary hypertension acute onset in a young patient without risk factors",
      "Asthma bronchospasm causing PaCO₂ of 32 with clear lungs",
    ],
    subjectTags: ["pulmonology", "pathology", "emergency-medicine"],
  },
  {
    age: 24,
    sex: "man",
    setting: "emergency department",
    chiefComplaint: "polyuria, polydipsia, nausea, and abdominal pain",
    history: "Type 1 diabetes; ran out of insulin 2 days ago during travel",
    vitals: "BP 102/64 mmHg, HR 118, RR 28, temp 98.8°F (37.1°C)",
    exam: "Kussmaul respirations, dry mucous membranes, fruity breath odor",
    labs: "Glucose 486 mg/dL, pH 7.18, HCO₃⁻ 10 mEq/L, anion gap 22, ketones 4+",
    condition: "Diabetic ketoacidosis (DKA)",
    mechanism:
      "Absolute insulin deficiency → unrestrained lipolysis and hepatic ketogenesis → anion-gap metabolic acidosis and osmotic diuresis",
    diagnosis: "Diabetic ketoacidosis due to insulin nonadherence",
    initialTest: "Serum glucose, BMP, venous blood gas, and ketones (confirm anion-gap acidosis)",
    nextStep: "IV fluids, IV insulin infusion, potassium repletion per protocol, and search for precipitant",
    firstLineTx: "Isotonic IV fluids followed by insulin drip with hourly glucose and electrolyte monitoring",
    complication: "Cerebral edema (especially with overly rapid correction) or hypokalemia during insulin therapy",
    relatedDiagnoses: ["Hyperosmolar hyperglycemic state", "Starvation ketosis", "Alcoholic ketoacidosis"],
    wrongNextSteps: [
      "Subcutaneous insulin only and discharge without IV fluids",
      "Bicarbonate infusion for all DKA regardless of pH",
      "Oral rehydration alone without insulin",
    ],
    wrongMechanisms: [
      "Hyperchloremic non-anion-gap acidosis from RTA as the primary process",
      "Respiratory alkalosis from primary lung disease",
      "Excess ADH causing euvolemic hyponatremia without hyperglycemia",
    ],
    subjectTags: ["internal-medicine", "biochemistry", "nephrology"],
  },
  {
    age: 71,
    sex: "man",
    setting: "inpatient ward",
    chiefComplaint: "decreased urine output and confusion",
    history: "NSAID use for osteoarthritis; hypertension; baseline creatinine 1.0 mg/dL",
    vitals: "BP 88/54 mmHg, HR 104, RR 18, temp 99.4°F (37.4°C)",
    exam: "Dry mucous membranes, delayed capillary refill; no rash",
    labs: "Creatinine 3.8 mg/dL (from 1.0), BUN 62 mg/dL, urinalysis: muddy brown casts, FENa 2.1%",
    condition: "Acute tubular necrosis (ATN)",
    mechanism:
      "Ischemic or nephrotoxic injury to renal tubules → impaired reabsorption and concentration → rising creatinine with muddy brown casts",
    diagnosis: "Acute kidney injury from ATN (likely NSAID + hypoperfusion)",
    initialTest: "Urinalysis with sediment, FENa/FeUrea, and renal ultrasound to assess obstruction",
    nextStep: "Hold nephrotoxins, restore intravascular volume if hypovolemic, avoid unnecessary diuretics, and monitor electrolytes",
    firstLineTx: "Volume repletion if hypovolemic; otherwise supportive care and treat underlying cause",
    complication: "Hyperkalemia, uremic encephalopathy, or need for renal replacement therapy",
    relatedDiagnoses: ["Prerenal azotemia", "Acute interstitial nephritis", "Postrenal obstruction"],
    wrongNextSteps: [
      "Continue NSAIDs and add aminoglycoside",
      "Immediate dialysis without addressing reversible causes",
      "High-dose loop diuretic challenge to convert oliguria in established ATN",
    ],
    wrongMechanisms: [
      "Glomerular immune complex deposition as the cause of muddy brown casts",
      "ADH excess causing dilutional hyponatremia without azotemia",
      "Chronic glomerulosclerosis pattern on acute presentation only",
    ],
    subjectTags: ["nephrology", "pharmacology", "pathology"],
  },
  {
    age: 63,
    sex: "woman",
    setting: "emergency department",
    chiefComplaint: "sudden right-sided weakness and slurred speech",
    history: "Atrial fibrillation, not anticoagulated; hypertension",
    vitals: "BP 178/96 mmHg, HR 88 irregular, RR 16, SpO₂ 98%",
    exam: "Right hemiparesis, right facial droop, dysarthria; NIHSS 12",
    labs: "Glucose 142 mg/dL, INR 1.1; noncontrast head CT: no hemorrhage",
    condition: "Acute ischemic stroke",
    mechanism:
      "Embolic or thrombotic occlusion of cerebral artery (often cardioembolic from AF) → focal ischemia in MCA territory",
    diagnosis: "Acute ischemic stroke in the setting of atrial fibrillation",
    initialTest: "Noncontrast head CT to exclude hemorrhage before reperfusion therapy",
    nextStep: "Evaluate for IV thrombolysis and/or mechanical thrombectomy within time windows; admit to stroke unit",
    firstLineTx: "IV alteplase if eligible after CT excludes bleed; consider thrombectomy for large vessel occlusion",
    complication: "Hemorrhagic transformation or cerebral edema with herniation",
    relatedDiagnoses: ["Hemorrhagic stroke", "Todd paralysis post-seizure", "Hypoglycemic hemiparesis"],
    wrongNextSteps: [
      "Start aspirin alone and defer imaging for 24 hours",
      "Lower BP aggressively to SBP <120 before imaging in hyperacute phase",
      "Obtain lumbar puncture before neuroimaging",
    ],
    wrongMechanisms: [
      "Lower motor neuron lesion at C5 causing isolated facial and arm weakness only",
      "Demyelinating plaque without vascular risk factors as most likely in hyperacute setting",
      "Metabolic encephalopathy without focal findings",
    ],
    subjectTags: ["neurology", "cardiology", "pathology"],
  },
  {
    age: 19,
    sex: "man",
    setting: "emergency department",
    chiefComplaint: "fever, headache, neck stiffness, and photophobia",
    history: "College dormitory resident; no recent travel; no immunocompromising conditions",
    vitals: "BP 110/68 mmHg, HR 118, RR 20, temp 102.8°F (39.3°C)",
    exam: "Nuchal rigidity, Kernig and Brudzinski signs positive; no focal deficits",
    labs: "WBC 18,000/mm³; lumbar puncture: CSF WBC 1,200/mm³ (90% neutrophils), glucose 28 mg/dL, protein 220 mg/dL",
    condition: "Bacterial meningitis",
    mechanism:
      "Pathogenic bacteria cross blood-brain barrier → neutrophilic pleocytosis, low CSF glucose, and elevated protein",
    diagnosis: "Acute bacterial meningitis",
    initialTest: "Blood cultures and lumbar puncture (or empiric antibiotics if LP delayed)",
    nextStep: "Empiric IV antibiotics and dexamethasone immediately; do not delay treatment for imaging if unstable",
    firstLineTx: "Ceftriaxone plus vancomycin (add ampicillin if Listeria risk); dexamethasone before or with first antibiotic dose",
    complication: "Seizures, hearing loss, or septic shock",
    relatedDiagnoses: ["Viral meningitis", "Subarachnoid hemorrhage", "Encephalitis"],
    wrongNextSteps: [
      "Wait for CSF culture results before starting antibiotics",
      "Oral amoxicillin outpatient therapy",
      "MRI brain only without LP or blood cultures",
    ],
    wrongMechanisms: [
      "Viral lymphocytic pleocytosis with normal CSF glucose",
      "Ruptured berry aneurysm causing xanthochromia without infection",
      "Autoimmune demyelination as acute febrile meningismus",
    ],
    subjectTags: ["neurology", "microbiology", "emergency-medicine"],
  },
  {
    age: 55,
    sex: "woman",
    setting: "primary care clinic",
    chiefComplaint: "fatigue, weight gain, and cold intolerance",
    history: "No prior thyroid disease; mother with hypothyroidism",
    vitals: "BP 128/82 mmHg, HR 58, temp 97.2°F (36.2°C)",
    exam: "Dry skin, delayed relaxation of deep tendon reflexes, nonpitting periorbital puffiness",
    labs: "TSH 18 mU/L (elevated), free T4 0.6 ng/dL (low), anti-TPO antibodies positive",
    condition: "Primary hypothyroidism (Hashimoto thyroiditis)",
    mechanism:
      "Autoimmune destruction of thyroid → decreased T4/T3 synthesis → loss of negative feedback → elevated TSH",
    diagnosis: "Primary hypothyroidism due to Hashimoto thyroiditis",
    initialTest: "TSH with reflex free T4; anti-TPO if autoimmune etiology suspected",
    nextStep: "Start levothyroxine at appropriate dose; recheck TSH in 6–8 weeks and adjust",
    firstLineTx: "Levothyroxine replacement with TSH-guided titration",
    complication: "Myxedema coma if untreated in severe disease; iatrogenic hyperthyroidism if overtreated",
    relatedDiagnoses: ["Secondary hypothyroidism (pituitary)", "Euthyroid sick syndrome", "Depression"],
    wrongNextSteps: [
      "Start liothyronine (T3) monotherapy as first-line for all hypothyroidism",
      "Observe without treatment until TSH >100",
      "Order radioactive iodine uptake before checking TSH",
    ],
    wrongMechanisms: [
      "Pituitary TSH deficiency causing low TSH and low T4",
      "Thyroid hormone resistance with elevated TSH and elevated T4",
      "Iodine excess causing Jod-Basedow hyperthyroidism",
    ],
    subjectTags: ["internal-medicine", "biochemistry", "physiology"],
  },
  {
    age: 32,
    sex: "woman",
    setting: "outpatient specialty clinic",
    chiefComplaint: "joint pain and malar rash worsening over weeks",
    history: "Photosensitivity, oral ulcers; no prior rheumatologic diagnosis",
    vitals: "BP 132/84 mmHg, HR 88, temp 99.0°F (37.2°C)",
    exam: "Erythematous malar rash sparing nasolabial folds, synovitis in wrists and MCPs",
    labs: "ANA positive (1:640), anti-dsDNA positive, low C3/C4, urinalysis: protein 2+, RBC casts",
    condition: "Systemic lupus erythematosus with lupus nephritis",
    mechanism:
      "Autoantibody and immune complex deposition → complement consumption and glomerular inflammation",
    diagnosis: "SLE with proliferative lupus nephritis (RBC casts indicate glomerular injury)",
    initialTest: "ANA, anti-dsDNA, complement levels, urinalysis with microscopy; renal biopsy if nephritis confirmed",
    nextStep: "Rheumatology/nephrology referral; immunosuppression per nephritis class after biopsy when indicated",
    firstLineTx: "Hydroxychloroquine for all SLE plus glucocorticoids/immunosuppressants for active nephritis per class",
    complication: "ESRD, thrombotic events, or CNS lupus",
    relatedDiagnoses: ["Rheumatoid arthritis", "Acute poststreptococcal glomerulonephritis", "IgA nephropathy"],
    wrongNextSteps: [
      "NSAIDs alone without evaluating for nephritis",
      "Defer all immunosuppression until ANA becomes negative",
      "Antibiotics for presumed UTI without addressing RBC casts",
    ],
    wrongMechanisms: [
      "Streptococcal M protein mimicry causing isolated postinfectious GN without ANA",
      "RA synovitis without immune complex glomerular disease",
      "Minimal change disease causing nephrotic syndrome without RBC casts",
    ],
    subjectTags: ["internal-medicine", "pathology", "nephrology"],
  },
  {
    age: 8,
    sex: "man",
    setting: "pediatric clinic",
    chiefComplaint: "sore throat, fever, and sandpaper-like rash",
    history: "No drug allergies; attends elementary school",
    vitals: "BP 102/64 mmHg, HR 110, temp 101.6°F (38.7°C)",
    exam: "Tonsillar exudates, tender anterior cervical lymphadenopathy, circumoral pallor, desquamating rash in flexural areas",
    labs: "Rapid strep test positive; ASO titer pending",
    condition: "Group A Streptococcus (Strep pyogenes) pharyngitis with scarlet fever",
    mechanism:
      "Streptococcal pyrogenic exotoxins → superantigen T-cell activation → diffuse erythematous rash (scarlet fever)",
    diagnosis: "Strep pharyngitis with scarlet fever rash",
    initialTest: "Rapid antigen detection test or throat culture",
    nextStep: "Treat with penicillin or amoxicillin for 10 days to prevent rheumatic fever and suppurative complications",
    firstLineTx: "Penicillin V or amoxicillin for 10 days",
    complication: "Rheumatic fever, poststreptococcal glomerulonephritis, or peritonsillar abscess",
    relatedDiagnoses: ["Viral pharyngitis (EBV)", "Kawasaki disease", "Drug eruption"],
    wrongNextSteps: [
      "Azithromycin as first-line without penicillin trial in uncomplicated GAS pharyngitis where penicillin tolerated",
      "No treatment because rash implies viral etiology only",
      "Corticosteroids alone without antibiotics",
    ],
    wrongMechanisms: [
      "EBV infection causing exudative pharyngitis with morbilliform rash from amoxicillin in all cases",
      "Staphylococcal toxic shock toxin without pharyngeal findings",
      "Measles virus with Koplik spots absent here",
    ],
    subjectTags: ["pediatrics", "microbiology", "pathology"],
  },
  {
    age: 45,
    sex: "man",
    setting: "emergency department",
    chiefComplaint: "severe epigastric pain radiating to the back after heavy alcohol use",
    history: "Heavy alcohol use; no gallstones on prior ultrasound",
    vitals: "BP 108/70 mmHg, HR 118, temp 100.4°F (38.0°C)",
    exam: "Epigastric tenderness, mild guarding, bowel sounds decreased",
    labs: "Lipase 1,420 U/L (elevated), AST 180 U/L, ALT 92 U/L, calcium 7.8 mg/dL, WBC 16,000/mm³",
    condition: "Acute pancreatitis",
    mechanism:
      "Premature activation of pancreatic enzymes within acinar cells → autodigestion, inflammation, and third-spacing",
    diagnosis: "Acute alcoholic pancreatitis",
    initialTest: "Serum lipase (or amylase) plus abdominal imaging if diagnosis uncertain",
    nextStep: "Aggressive IV fluids, pain control, monitor for organ failure; NPO initially with early enteral nutrition when tolerated",
    firstLineTx: "IV fluid resuscitation (Ringer lactate preferred) and supportive care",
    complication: "Necrotizing pancreatitis, pseudocyst, or ARDS",
    relatedDiagnoses: ["Peptic ulcer perforation", "Acute cholecystitis", "Mesenteric ischemia"],
    wrongNextSteps: [
      "Immediate ERCP for all pancreatitis regardless of bile duct obstruction signs",
      "Prophylactic broad-spectrum antibiotics for all mild pancreatitis",
      "Oral feeding and discharge with lipase recheck in 1 month only",
    ],
    wrongMechanisms: [
      "Gallstone impaction at ampulla as mechanism in patient without biliary history and with alcohol trigger",
      "Ischemic bowel causing isolated lipase elevation without abdominal exam findings",
      "Hepatic congestion alone raising lipase without pancreatic inflammation",
    ],
    subjectTags: ["internal-medicine", "pathology", "biochemistry"],
  },
  {
    age: 28,
    sex: "woman",
    setting: "labor and delivery",
    chiefComplaint: "headache and visual changes at 37 weeks gestation",
    history: "G1P0, previously normotensive pregnancy",
    vitals: "BP 168/104 mmHg, HR 92, RR 18, temp 98.6°F (37°C)",
    exam: "Hyperreflexia with clonus, epigastric tenderness, no vaginal bleeding",
    labs: "Proteinuria 3+ on dipstick, platelets 98,000/mm³, AST 88 U/L, creatinine 1.1 mg/dL",
    condition: "Preeclampsia with severe features",
    mechanism:
      "Placental malperfusion → systemic endothelial dysfunction → hypertension, proteinuria, and end-organ ischemia",
    diagnosis: "Preeclampsia with severe features at 37 weeks",
    initialTest: "Blood pressure series, urinalysis, CBC, LFTs, creatinine, and fetal monitoring",
    nextStep: "Magnesium sulfate for seizure prophylaxis, BP control, and delivery planning (definitive treatment is delivery)",
    firstLineTx: "Magnesium sulfate plus antihypertensives (e.g., labetalol/hydralazine) with expedited delivery",
    complication: "Eclampsia, HELLP syndrome, placental abruption, or fetal growth restriction",
    relatedDiagnoses: ["Gestational hypertension without proteinuria", "Chronic hypertension", "Migraine with aura"],
    wrongNextSteps: [
      "Discharge with outpatient BP checks only",
      "Diuretics as first-line for preeclampsia-related edema",
      "Expectant management at home without magnesium or delivery planning",
    ],
    wrongMechanisms: [
      "Primary CNS vasospasm without placental or endothelial pathology",
      "Gestational diabetes causing visual changes without hypertension",
      "Cortical venous thrombosis as most likely without focal deficits",
    ],
    subjectTags: ["obgyn", "pathology", "physiology"],
  },
];

export type UsmlePolishResult = {
  item: BankItem;
  changed: boolean;
  qualityBefore: number;
  qualityAfter: number;
};

function isStep1Field(fieldId: string, subjectId: string): boolean {
  return fieldId === "usmle-step-1" || isUsmleStep1Subject(subjectId);
}

function pickCase(seed: number, subjectId: string): UsmleCase {
  const tagged = CLINICAL_CASES.filter(
    (c) => c.subjectTags.includes(subjectId) || subjectId === "internal-medicine"
  );
  const pool = tagged.length >= 3 ? tagged : CLINICAL_CASES;
  const base = pool[Math.abs(seed) % pool.length]!;
  return jitterCaseAge(base, seed);
}

function jitterCaseAge(clinical: UsmleCase, seed: number): UsmleCase {
  return {
    ...clinical,
    age: Math.max(2, clinical.age + ((Math.abs(seed) % 5) - 2)),
  };
}

/** Prefer a curated case when legacy stem/answer already signal a specific condition. */
function pickCaseFromLegacy(stem: string, correctAnswer: string, subjectId: string): UsmleCase | null {
  const haystack = `${stem} ${correctAnswer}`.toLowerCase();
  let best: { clinical: UsmleCase; score: number } | null = null;

  for (const clinical of CLINICAL_CASES) {
    let score = 0;
    if (clinical.subjectTags.includes(subjectId) || subjectId === "internal-medicine") score += 1;

    const diagnosisKey = clinical.diagnosis.toLowerCase();
    if (haystack.includes(diagnosisKey)) score += 8;

    const conditionKey = clinical.condition.toLowerCase().replace(/\s*\([^)]*\)/g, "").trim();
    if (conditionKey.length >= 4 && haystack.includes(conditionKey)) score += 6;

    for (const token of clinical.chiefComplaint.split(/,|;|\band\b/i)) {
      const t = token.trim().toLowerCase();
      if (t.length >= 5 && haystack.includes(t)) score += 3;
    }

    for (const related of clinical.relatedDiagnoses) {
      if (haystack.includes(related.toLowerCase())) score += 2;
    }

    if (!best || score > best.score) best = { clinical, score };
  }

  return best && best.score >= 6 ? best.clinical : null;
}

function stripPrefix(question: string): string {
  return question.replace(CASE_PREFIX, "").trim();
}

function hasRichVignette(text: string): boolean {
  if (!text.includes("\n\n") && text.length < 140) return false;
  const vignette = text.includes("\n\n") ? text.split("\n\n")[0]! : text;
  const hasVitals = /BP|HR|RR|SpO₂|SpO2|temp|mg\/dL|mmHg|ECG|CT|WBC|pH|troponin/i.test(vignette);
  const hasDemo = /\d{1,3}[-‑]?\s*(?:year|yo|y\.o\.)/i.test(vignette);
  return vignette.length >= 100 && hasDemo && hasVitals;
}

/** True when the vignette paragraph is duplicated back-to-back in the stem. */
export function hasDuplicateVignette(question: string): boolean {
  if (!question.includes("\n\n")) return false;
  const parts = question.split("\n\n").map((p) => p.trim()).filter(Boolean);
  return parts.length >= 2 && parts[0] === parts[1];
}

export function dedupeVignetteStem(question: string): string {
  if (!hasDuplicateVignette(question)) return question;
  const parts = question.split("\n\n").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 3 && parts[0] === parts[1]) {
    return `${parts[0]}\n\n${parts.slice(2).join("\n\n")}`;
  }
  return question;
}

function cleanDiagnosisLabel(text: string): string {
  return text
    .replace(/\s*\(empiric therapy required\)\s*/gi, " ")
    .replace(/\s*pending culture\s*/gi, " ")
    .replace(/\s*empiric therapy required\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Fast surgical fixes — dedupe stem, strip management language from diagnosis labels. */
export function applyUsmleStemRepairs(item: BankItem): BankItem {
  const question = dedupeVignetteStem(item.question);
  let correctAnswer = item.correctAnswer;
  let options = [...item.options] as [string, string, string, string];

  if (DIAGNOSIS_OPTION_WEAK.test(correctAnswer)) {
    correctAnswer = cleanDiagnosisLabel(correctAnswer);
  }
  options = options.map((o) =>
    DIAGNOSIS_OPTION_WEAK.test(o) ? cleanDiagnosisLabel(o) : o
  ) as [string, string, string, string];

  if (
    question === item.question &&
    correctAnswer === item.correctAnswer &&
    JSON.stringify(options) === JSON.stringify(item.options)
  ) {
    return item;
  }

  return { ...item, question, correctAnswer, options };
}

function stemNeedsRepair(item: BankItem): boolean {
  return (
    hasDuplicateVignette(item.question) ||
    DIAGNOSIS_OPTION_WEAK.test(item.correctAnswer) ||
    item.options.some((o) => DIAGNOSIS_OPTION_WEAK.test(o))
  );
}

function needsUsmleFullPolish(item: BankItem, fieldId = "usmle-step-2"): boolean {
  return (
    scoreUsmleBankItem(item, fieldId) < 0.62 ||
    CASE_PREFIX.test(item.question) ||
    !hasRichVignette(item.question) ||
    WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer)) ||
    item.options.some((o) => WEAK_OPTION_PATTERNS.some((re) => re.test(o)))
  );
}

export function scoreUsmleBankItem(item: BankItem, fieldId = "usmle-step-2"): number {
  let score = 0.3;
  const text = item.question;
  const vignette = text.includes("\n\n") ? text.split("\n\n")[0]! : text;

  if (hasRichVignette(text)) score += 0.18;
  else if (text.length > 120) score += 0.06;

  if (hasSignsAndSymptoms(vignette)) score += 0.08;
  if (hasEtiologyOrPathophysiology(item.explanation)) score += 0.1;

  if (item.explanation.length > 300) score += 0.14;
  else if (item.explanation.length > 150) score += 0.08;

  if (/mechanism|pathophys|etiology|differential|next best|incorrect because|why other options|diagnosis/i.test(item.explanation)) {
    score += 0.12;
  }

  if (!CASE_PREFIX.test(item.question)) score += 0.04;
  if (item.options.length === 4 && item.options.includes(item.correctAnswer)) score += 0.06;

  if (WEAK_CORRECT_PATTERNS.some((re) => re.test(item.correctAnswer))) score -= 0.24;
  if (item.options.some((o) => WEAK_OPTION_PATTERNS.some((re) => re.test(o)))) score -= 0.2;
  if (hasDuplicateVignette(text)) score -= 0.22;
  if (DIAGNOSIS_OPTION_WEAK.test(item.correctAnswer)) score -= 0.18;
  if (item.options.some((o) => DIAGNOSIS_OPTION_WEAK.test(o))) score -= 0.12;

  if (isStep1Field(fieldId, item.subjectId ?? "") && /mechanism|MOA|pathophys|enzyme|receptor/i.test(item.explanation)) {
    score += 0.04;
  }
  if (!isStep1Field(fieldId, item.subjectId ?? "") && /next best|first-line|initial|management/i.test(item.explanation)) {
    score += 0.04;
  }

  return Math.max(0, Math.min(1, score));
}

type TemplateKind =
  | "mechanism"
  | "pathophysiology"
  | "lab"
  | "diagnosis"
  | "next_step"
  | "initial_test"
  | "management"
  | "complication"
  | "moa";

function inferTemplateFromStem(stem: string): TemplateKind | null {
  const s = stem.toLowerCase();
  if (/which diagnosis|most likely diagnosis|what is the diagnosis|diagnosis best explains/i.test(s)) {
    return "diagnosis";
  }
  if (/next best step|next step in management|action should be taken next/i.test(s)) return "next_step";
  if (/initial (diagnostic )?test|diagnostic test is most appropriate/i.test(s)) return "initial_test";
  if (/management approach|initial treatment|most appropriate treatment/i.test(s)) return "management";
  if (/complication|adverse outcome/i.test(s)) return "complication";
  if (/mechanism of action|\bmoa\b/i.test(s)) return "moa";
  if (/mechanism best explains|underlying mechanism/i.test(s)) return "mechanism";
  if (/pathophysiologic|pathophysiology/i.test(s)) return "pathophysiology";
  if (/laboratory finding|lab data|interpretation of the lab/i.test(s)) return "lab";
  return null;
}

function detectTemplate(
  stem: string,
  fieldId: string,
  subjectId: string,
  seed: number
): TemplateKind {
  const fromStem = inferTemplateFromStem(stem);
  if (fromStem) return fromStem;

  const step1 = isStep1Field(fieldId, subjectId);

  const step1Pools: Record<string, TemplateKind[]> = {
    pharmacology: ["moa", "mechanism", "pathophysiology"],
    biochemistry: ["mechanism", "pathophysiology", "lab"],
    microbiology: ["mechanism", "diagnosis", "pathophysiology"],
    pathology: ["pathophysiology", "mechanism", "complication"],
    anatomy: ["mechanism", "diagnosis", "pathophysiology"],
    physiology: ["mechanism", "pathophysiology", "lab"],
  };

  const step2Pools: Record<string, TemplateKind[]> = {
    cardiology: ["next_step", "diagnosis", "management", "complication"],
    pulmonology: ["next_step", "diagnosis", "initial_test"],
    nephrology: ["next_step", "diagnosis", "lab"],
    neurology: ["next_step", "diagnosis", "initial_test"],
    pediatrics: ["diagnosis", "next_step", "management"],
    obgyn: ["next_step", "diagnosis", "management"],
    psychiatry: ["diagnosis", "next_step", "management"],
    "emergency-medicine": ["next_step", "initial_test", "diagnosis"],
    "internal-medicine": ["diagnosis", "next_step", "management", "lab"],
  };

  if (step1) {
    const pool = step1Pools[subjectId] ?? ["mechanism", "pathophysiology", "moa", "lab"];
    return pool[Math.abs(seed) % pool.length]!;
  }

  const pool = step2Pools[subjectId] ?? ["diagnosis", "next_step", "initial_test", "management"];
  return pool[Math.abs(seed) % pool.length]!;
}

function summarizeLabsForDiagnosis(labs: string): string {
  return labs
    .replace(
      /CSF WBC [\d,]+[^;]*/gi,
      "CSF studies show neutrophilic pleocytosis with low glucose and elevated protein"
    )
    .replace(/lumbar puncture:\s*/gi, "");
}

function buildVignette(clinical: UsmleCase, seed: number, template?: TemplateKind): string {
  const sexLabel = clinical.sex === "man" ? "man" : "woman";
  const ageLabel =
    clinical.age < 18 ? `${clinical.age}-year-old boy` : `${clinical.age}-year-old ${sexLabel}`;
  const labs =
    template === "diagnosis" ? summarizeLabsForDiagnosis(clinical.labs) : clinical.labs;
  return [
    `A ${ageLabel} presents to the ${clinical.setting} with ${clinical.chiefComplaint}.`,
    `${clinical.history}. Vital signs: ${clinical.vitals}.`,
    `Physical examination: ${clinical.exam}.`,
    `Laboratory/imaging: ${labs}.`,
    `Encounter ${1000 + (Math.abs(seed) % 9000)}.`,
  ].join(" ");
}

function leadIn(template: TemplateKind, seed: number): string {
  const pools: Record<TemplateKind, string[]> = {
    mechanism: [
      "Which mechanism best explains this patient's presentation?",
      "What is the underlying mechanism of this patient's condition?",
    ],
    pathophysiology: [
      "Which pathophysiologic process is most likely responsible for this patient's presentation?",
      "Which explanation best describes the underlying pathophysiology of this patient's condition?",
    ],
    lab: [
      "Which laboratory finding is most consistent with the underlying diagnosis?",
      "Which interpretation of the lab data is most accurate?",
    ],
    moa: [
      "Which mechanism of action best explains the therapeutic or adverse effect described?",
      "Which pharmacologic mechanism is most relevant to this patient's condition?",
    ],
    diagnosis: [
      "What is the most likely diagnosis?",
      "Which diagnosis best explains this clinical presentation?",
    ],
    next_step: [
      "What is the next best step in management?",
      "Which action should be taken next in this patient's care?",
    ],
    initial_test: [
      "Which diagnostic test is most appropriate at this time?",
      "What is the most appropriate initial diagnostic step?",
    ],
    management: [
      "Which management approach is most appropriate?",
      "What is the most appropriate initial treatment?",
    ],
    complication: [
      "Which complication is most likely to develop?",
      "Which adverse outcome is this patient at highest risk for?",
    ],
  };
  const list = pools[template];
  return list[Math.abs(seed) % list.length]!;
}

function fourOptions(
  correct: string,
  wrongs: [string, string, string],
  correctSlot: number
): [string, string, string, string] {
  const options: string[] = ["", "", "", ""];
  options[correctSlot % 4] = correct;
  let w = 0;
  for (let i = 0; i < 4; i++) {
    if (i !== correctSlot % 4) options[i] = wrongs[w++]!;
  }
  return options as [string, string, string, string];
}

function rebuildCase(
  template: TemplateKind,
  clinical: UsmleCase,
  subjectLabel: string,
  seed: number
) {
  const slot = Math.abs(seed) % 4;
  const vignette = buildVignette(clinical, seed, template);
  const question = leadIn(template, seed);

  switch (template) {
    case "mechanism":
    case "pathophysiology":
    case "moa":
      return {
        vignette,
        question,
        options: fourOptions(clinical.mechanism, clinical.wrongMechanisms, slot),
        correctAnswer: clinical.mechanism,
        template,
        clinical,
        subjectLabel,
      };
    case "lab":
      return {
        vignette,
        question,
        options: fourOptions(
          `${clinical.labs.split(";")[0]?.trim()} — supports ${clinical.diagnosis}`,
          [
            clinical.relatedDiagnoses[0] + " — expected normal labs in all patients",
            "Artifact invalidating all values; repeat testing in 6 months only",
            clinical.wrongMechanisms[0],
          ],
          slot
        ),
        correctAnswer: `${clinical.labs.split(";")[0]?.trim()} — supports ${clinical.diagnosis}`,
        template,
        clinical,
        subjectLabel,
      };
    case "diagnosis":
      return {
        vignette,
        question,
        options: fourOptions(clinical.diagnosis, clinical.relatedDiagnoses, slot),
        correctAnswer: clinical.diagnosis,
        template,
        clinical,
        subjectLabel,
      };
    case "next_step":
      return {
        vignette,
        question,
        options: fourOptions(clinical.nextStep, clinical.wrongNextSteps, slot),
        correctAnswer: clinical.nextStep,
        template,
        clinical,
        subjectLabel,
      };
    case "initial_test":
      return {
        vignette,
        question,
        options: fourOptions(
          clinical.initialTest,
          [
            clinical.wrongNextSteps[0],
            "No testing; reassure and follow up in 6 months",
            clinical.relatedDiagnoses[2] + " workup as the only priority",
          ],
          slot
        ),
        correctAnswer: clinical.initialTest,
        template,
        clinical,
        subjectLabel,
      };
    case "management":
      return {
        vignette,
        question,
        options: fourOptions(
          clinical.firstLineTx,
          [clinical.wrongNextSteps[0], clinical.wrongNextSteps[1], clinical.wrongNextSteps[2]],
          slot
        ),
        correctAnswer: clinical.firstLineTx,
        template,
        clinical,
        subjectLabel,
      };
    case "complication":
      return {
        vignette,
        question,
        options: fourOptions(
          clinical.complication,
          [
            clinical.relatedDiagnoses[0] + " as an immediate complication only",
            "Benign self-limited course without morbidity in all cases",
            clinical.wrongMechanisms[1],
          ],
          slot
        ),
        correctAnswer: clinical.complication,
        template,
        clinical,
        subjectLabel,
      };
  }
}

function buildUsmleExplanation(
  rebuilt: ReturnType<typeof rebuildCase>,
  fieldId: string,
  subjectId: string
): string {
  const { clinical, correctAnswer, options, template } = rebuilt;
  const step1 = isStep1Field(fieldId, subjectId);
  const incorrect = options.filter((o) => o !== correctAnswer);

  const framework = step1
    ? [
        "USMLE Step 1 reasoning:",
        "1. Identify discriminating signs, symptoms, and lab/imaging findings.",
        "2. Link presentation to underlying mechanism, pathophysiology, or basic science principle.",
        "3. Select the answer that best integrates science with clinical data.",
      ]
    : [
        "USMLE Step 2 CK reasoning:",
        "1. Recognize cues: extract key history, exam, and diagnostic data.",
        "2. Analyze: form a focused differential using pathophysiology and epidemiology.",
        "3. Prioritize: determine the most likely diagnosis or next best step.",
        "4. Act: select evidence-based management supported by guidelines.",
      ];

  const templateNotes: Record<TemplateKind, string> = {
    mechanism: `The correct mechanism connects etiology (${clinical.condition}) to the observed findings via basic science.`,
    pathophysiology: `Pathophysiology explains why ${clinical.exam.split(";")[0]?.trim().toLowerCase() ?? "the exam finding"} occurs in ${clinical.condition}.`,
    lab: `Lab interpretation must match the clinical context — isolated values without integration are insufficient.`,
    moa: `Pharmacology items require linking drug target/receptor to therapeutic effect or toxicity in this presentation.`,
    diagnosis: `The diagnosis is supported by the combination of ${clinical.vitals.split(",")[0]?.trim()} and ${clinical.labs.split(";")[0]?.trim()}. Empiric antibiotics are the next step when bacterial meningitis is suspected — they are not part of the diagnosis label.`,
    next_step: `Next best step follows stabilization, diagnosis confirmation, and guideline-directed therapy for ${clinical.condition}.`,
    initial_test: `Initial testing should confirm or exclude life-threatening diagnoses before low-yield broad workups.`,
    management: `First-line management for ${clinical.condition} follows current evidence-based guidelines.`,
    complication: `Recognize complications from the underlying disease process and its pathophysiology.`,
  };

  const distractorLines = incorrect
    .slice(0, 3)
    .map((opt) => {
      if (clinical.relatedDiagnoses.some((d) => opt.includes(d) || d.includes(opt.slice(0, 20)))) {
        return `• ${opt}: Incorrect — related diagnosis in the differential but fails key discriminating findings (timing, labs, or exam).`;
      }
      if (clinical.wrongNextSteps.some((w) => opt === w || opt.includes(w.slice(0, 25)))) {
        return `• ${opt}: Incorrect — wrong next step; premature, contraindicated, or delays necessary treatment.`;
      }
      if (clinical.wrongMechanisms.some((w) => opt === w)) {
        return `• ${opt}: Incorrect — plausible mechanism trap; does not best explain the full presentation.`;
      }
      if (/defer|discharge|without|no testing|6 months|reassure only/i.test(opt)) {
        return `• ${opt}: Incorrect — unsafe delay or inadequate evaluation for a potentially serious condition.`;
      }
      return `• ${opt}: Incorrect — does not best fit the clinical data or standard-of-care sequence for ${clinical.condition}.`;
    })
    .join("\n");

  return [
    framework.join("\n"),
    "",
    templateNotes[template],
    "",
    `Correct: ${correctAnswer}. ${clinical.mechanism}`,
    "",
    `Key findings: ${clinical.vitals}; ${clinical.exam}; ${clinical.labs}.`,
    "",
    distractorLines ? `Why other options are incorrect:\n${distractorLines}` : "",
    "",
    "References: USMLE Content Outline; NBME-style clinical vignette standards; OpenStax/LibreTexts OER.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function needsUsmlePolish(item: BankItem, fieldId = "usmle-step-2"): boolean {
  return stemNeedsRepair(item) || needsUsmleFullPolish(item, fieldId);
}

/** Polish a single USMLE bank item — mechanisms, diagnosis, next best step, competitive distractors. */
export function polishUsmleBankItem(
  item: BankItem,
  fieldId: string,
  subjectId: string,
  subjectLabel = "USMLE",
  seed = 0
): UsmlePolishResult {
  const qualityBefore = scoreUsmleBankItem(item, fieldId);

  if (!needsUsmleFullPolish(item, fieldId)) {
    const repaired = applyUsmleStemRepairs(item);
    const qualityAfter = scoreUsmleBankItem(repaired, fieldId);
    const changed =
      repaired.question !== item.question ||
      repaired.correctAnswer !== item.correctAnswer ||
      JSON.stringify(repaired.options) !== JSON.stringify(item.options);
    return { item: repaired, changed, qualityBefore, qualityAfter };
  }

  const stem = stripPrefix(item.question);
  const legacyCase = pickCaseFromLegacy(stem, item.correctAnswer ?? "", subjectId);
  const clinical = jitterCaseAge(
    legacyCase ??
      pickCase(
        seed + (subjectId?.length ?? 0) + stem.length + (item.correctAnswer?.length ?? 0),
        subjectId
      ),
    seed
  );
  const template = detectTemplate(stem, fieldId, subjectId, seed);
  const rebuilt = rebuildCase(template, clinical, subjectLabel, seed);

  const polished = applyUsmleStemRepairs({
    ...item,
    question: `${rebuilt.vignette}\n\n${rebuilt.question}`,
    options: rebuilt.options,
    correctAnswer: rebuilt.correctAnswer,
    explanation: buildUsmleExplanation(rebuilt, fieldId, subjectId),
    tags: [
      ...(item.tags ?? []).filter((t) => t !== "generated" && t !== "bulk-bank"),
      "usmle-polished",
      template,
      subjectId,
    ],
  });
  const qualityAfter = scoreUsmleBankItem(polished, fieldId);

  const changed =
    polished.question !== item.question ||
    polished.correctAnswer !== item.correctAnswer ||
    polished.explanation !== item.explanation ||
    JSON.stringify(polished.options) !== JSON.stringify(item.options);

  return { item: polished, changed, qualityBefore, qualityAfter };
}

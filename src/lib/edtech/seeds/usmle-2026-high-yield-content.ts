/**
 * Curated study content keyed by USMLE 2026 blueprintTopic slug.
 * Organized by step in ./usmle-2026-content/ — merged here for the builder.
 */
import type { Usmle2026StudyContent } from "./usmle-2026-content/types";
import { USMLE_2026_CONTENT_STEP1 } from "./usmle-2026-content/step1";
import { USMLE_2026_CONTENT_STEP2_EXTRA } from "./usmle-2026-content/step2-extra";
import { USMLE_2026_CONTENT_STEP3 } from "./usmle-2026-content/step3";
import { USMLE_2026_CONTENT_CROSS } from "./usmle-2026-content/cross";

export type { Usmle2026StudyContent };

/** Step 2 CK — Internal Medicine (fully expanded). */
const STEP2_INTERNAL_MEDICINE: Record<string, Usmle2026StudyContent> = {
  "acs-management": {
    overview: "STEMI vs NSTEMI recognition, reperfusion windows, and antithrombotic strategy.",
    summary:
      "ACS vignettes test ECG pattern recognition and time-sensitive reperfusion. STEMI: ST elevation in ≥2 contiguous leads or new LBBB → activate PCI (door-to-balloon ≤90 min) or fibrinolysis if PCI unavailable within 120 min. Give aspirin + P2Y12 inhibitor; heparin per protocol.\n\nNSTEMI/UA: troponin rise with ischemic symptoms without ST elevation. Risk-stratify (TIMI/GRACE); high-risk → early invasive strategy within 24 h. Unstable vitals, ongoing pain, or dynamic ECG changes need ICU-level care.",
    keyConcepts: [
      "STEMI → emergent reperfusion; do not delay for troponin when ECG diagnostic",
      "Right ventricular MI: hypotension + ST elevation V1–V4 — avoid nitrates; fluid-sensitive",
      "NSTEMI high-risk features: recurrent ischemia, ST depression, heart failure, arrhythmia",
      "Dual antiplatelet + anticoagulation balance bleeding risk",
      "Post-PCI: DAPT duration depends on stent type and bleeding risk",
    ],
    mustKnowFacts: [
      "Inferior STEMI with bradycardia/hypotension — give fluids before atropine; RV involvement common",
      "aVR ST elevation + diffuse ST depression suggests left main or proximal LAD occlusion",
    ],
    pearls: [
      "Crushing chest pain + diaphoresis + ST elevation → cath lab activation beats additional testing.",
      "NSTEMI with ongoing pain despite heparin → early invasive strategy, not discharge with outpatient stress test.",
    ],
    pitfalls: [
      "Waiting for troponin peak before reperfusion in obvious STEMI",
      "Giving nitrates in RV infarction with hypotension",
    ],
  },
  "chf-management": {
    overview: "Acute decompensation vs chronic GDMT for HFrEF and HFpEF.",
    summary:
      "Acute decompensated HF: assess volume and perfusion (warm/cold, wet/dry). IV loop diuretic first for congestion; optimize oxygenation (BiPAP if hypoxic/hypercapnic). Avoid starting beta-blockers during acute decompensation.\n\nChronic HFrEF GDMT four pillars: ARNI/ACEi/ARB + beta-blocker + MRA + SGLT2 inhibitor — each reduces mortality. HFpEF: treat comorbid HTN, AF, obesity; SGLT2i now recommended.",
    keyConcepts: [
      "HFrEF mortality benefit: ARNI/ACEi + BB + MRA + SGLT2i",
      "Acute decompensation: diuresis + afterload reduction if hypertensive",
      "Cardiogenic shock: inotropes/pressors + early revascularization if ischemic",
      "BNP/NT-proBNP supports diagnosis and tracks response",
      "Daily weights and sodium restriction for chronic management",
    ],
    mustKnowFacts: [
      "New York Heart Association class guides symptoms; ACC/AHA stage guides structure and prognosis",
    ],
    pearls: [
      "10 lb weight gain + orthopnea → increase diuretic before echo in known HF patient.",
      "Discharge after HF admission requires GDMT optimization and close follow-up within 7 days.",
    ],
    pitfalls: [
      "Starting beta-blocker during acute pulmonary edema",
      "Over-transfusing in HF — worsens congestion",
    ],
  },
  "arrhythmias-management": {
    overview: "AF rate/rhythm control, VT storm, and symptomatic bradyarrhythmias.",
    summary:
      "Atrial fibrillation: rate control vs rhythm control based on symptoms and cardiomyopathy risk. Anticoagulate by CHA₂DS₂-VASc (men ≥2, women ≥3 typically). Acute AF with instability → synchronized cardioversion.\n\nVT with pulse: amiodarone or procainamide; pulseless VT/VF → ACLS defibrillation. Torsades: magnesium; stop QT-prolonging drugs. Symptomatic bradycardia: atropine → transcutaneous pacing.",
    keyConcepts: [
      "AF anticoagulation: CHA₂DS₂-VASc vs HAS-BLED balance",
      "Wide-complex tachycardia is VT until proven otherwise — amiodarone",
      "Torsades: IV magnesium; correct K⁺ and Mg²⁺",
      "Complete heart block with syncope → pacemaker",
      "Digoxin toxicity → arrhythmias; check level in elderly/renal disease",
    ],
    mustKnowFacts: [
      "Adenosine for SVT — warn patient of transient asystole flush",
    ],
    pearls: [
      "Irregularly irregular pulse without P waves → AF; check ventricular rate before cardioversion decision.",
    ],
    pitfalls: [
      "Cardioverting AF >48 h without anticoagulation or TEE exclusion of thrombus",
      "Treating polymorphic VT with calcium channel blockers",
    ],
  },
  "valvular-disease-clinical": {
    overview: "Murmur maneuvers, echo indications, and timing of valve intervention.",
    summary:
      "Aortic stenosis: crescendo-decrescendo systolic murmur radiating to carotids; syncope, angina, HF = severe symptomatic AS → valve replacement (TAVR/SAVR). Mitral regurgitation acute (papillary muscle rupture post-MI) vs chronic.\n\nInfective endocarditis: new murmur + fever + embolic phenomena; blood cultures before antibiotics; Duke criteria; IV antibiotics ± surgery for heart failure, abscess, or persistent infection.",
    keyConcepts: [
      "Symptomatic severe AS → intervene — median survival drops after symptom onset",
      "Acute MR post-MI → surgical emergency",
      "Endocarditis: 3 sets blood cultures; echo (TTE then TEE)",
      "Prophylaxis limited to highest-risk structural lesions for dental procedures",
      "MVP: mid-systolic click; usually benign unless severe MR",
    ],
    mustKnowFacts: [
      "Rheumatic heart disease still common globally — mitral stenosis diastolic murmur at apex",
    ],
    pearls: [
      "New holosystolic murmur + pulmonary edema post-MI → papillary muscle rupture until proven otherwise.",
    ],
    pitfalls: [
      "Missing endocarditis in IV drug user with fever and murmur",
    ],
  },
  "pneumonia-workup": {
    overview: "CAP vs HAP/VAP, CURB-65, and empiric antibiotic selection.",
    summary:
      "Community-acquired pneumonia: typical (Strep pneumo) vs atypical (Mycoplasma, Legionella). Outpatient healthy: amoxicillin or doxy/macrolide. Inpatient non-ICU: beta-lactam + macrolide or fluoroquinolone. ICU: beta-lactam + macrolide or FQ + consider MRSA/Pseudomonas coverage.\n\nAspiration: anaerobes if periodontal disease; hospital-acquired adds MRSA and Pseudomonas risk.",
    keyConcepts: [
      "CURB-65 and PSI guide disposition",
      "Legionella: hyponatremia, GI symptoms; urinary antigen",
      "Pneumococcal vaccine PCV20/PPSV23 per age and risk",
      "Follow-up imaging if no improvement 48–72 h or smoker >50",
      "Empiric therapy before cultures in moderate-severe CAP — do not delay",
    ],
    mustKnowFacts: [
      "Influenza pneumonia: start oseltamivir when suspected — even after 48 h in severe disease",
    ],
    pearls: [
      "Rust-colored sputum + lobar consolidation → classic pneumococcus; treat empirically.",
    ],
    pitfalls: [
      "Using macrolide monotherapy in hospitalized CAP where resistance is high",
    ],
  },
  "pe-workup": {
    overview: "Wells score, D-dimer, CT-PA, and anticoagulation for PE.",
    summary:
      "Suspected PE: Wells or Geneva score. Low probability + negative D-dimer rules out PE. Intermediate/high → CT pulmonary angiography. Hemodynamic instability → thrombolysis if no contraindication.\n\nAnticoagulate with DOAC (apixaban, rivaroxaban) or LMWH bridged to warfarin. Malignancy-associated PE often LMWH preferred. Submassive PE: RV strain on echo/CT — consider escalation beyond anticoagulation.",
    keyConcepts: [
      "Wells ≥2 → imaging; PERC rule in very low pretest probability",
      "Massive PE: hypotension → thrombolytics",
      "Submassive: RV dysfunction, troponin elevation — close monitoring",
      "DOACs first-line for uncomplicated PE",
      "Provoked vs unprovoked guides duration of anticoagulation",
    ],
    mustKnowFacts: [
      "Pregnancy: V/Q scan may be preferred over CT-PA depending on trimester and local protocol",
    ],
    pearls: [
      "Sudden dyspnea + pleuritic pain + OCP use → PE workup even with clear lungs.",
    ],
    pitfalls: [
      "Withholding anticoagulation pending CT in high-probability unstable patient",
    ],
  },
  "copd-asthma-exacerbation": {
    overview: "Bronchodilators, steroids, oxygen targets, and BiPAP in COPD.",
    summary:
      "Asthma exacerbation: SABA + systemic steroids; add ipratropium in severe cases; magnesium in refractory bronchospasm. Discharge with controller (ICS) if prior hospitalization.\n\nCOPD exacerbation: SABA/SAMA + oral steroids 5 days; antibiotics if increased purulence. Target SpO₂ 88–92% to avoid CO₂ retention. NIV for pH 7.25–7.35 with hypercapnia.",
    keyConcepts: [
      "COPD O₂ target 88–92% — avoid hyperoxia-driven hypercapnia",
      "BiPAP reduces intubation in COPD exacerbation",
      "Asthma status: silent chest = impending respiratory failure",
      "Peak flow zones guide asthma action plans",
      "Smoking cessation is highest-yield long-term intervention for COPD",
    ],
    mustKnowFacts: [
      "Intubated asthmatic: watch for breath stacking and auto-PEEP",
    ],
    pearls: [
      "COPD patient somnolent with pH 7.28 and PaCO₂ 70 → BiPAP before intubation.",
    ],
    pitfalls: [
      "Supplemental O₂ to 100% in chronic CO₂ retainers without monitoring",
    ],
  },
  "gi-bleed-management": {
    overview: "Upper vs lower GI bleed, resuscitation, and endoscopy timing.",
    summary:
      "Upper GIB: hematemesis, melena. Resuscitate, PPI infusion, octreotide if variceal suspected, urgent EGD. Lower GIB: hematochezia — colonoscopy after stabilization.\n\nVariceal bleed: octreotide + ceftriaxone + band ligation. Non-variceal upper bleed: high-dose PPI; endoscopic therapy for active bleeding or high-risk stigmata.",
    keyConcepts: [
      "Two large-bore IVs; type & cross; restrictive transfusion Hb ~7 (8 if CAD)",
      "Variceal: octreotide + prophylactic antibiotics + band ligation",
      "NSAID + H. pylori increase PUD bleed risk",
      "Angiodysplasia in aortic stenosis (Heyde syndrome)",
      "After stabilization: colonoscopy for lower bleed; tagged RBC scan if ongoing obscure bleed",
    ],
    mustKnowFacts: [
      "Hemodynamic instability with minimal visible blood can indicate massive upper GIB",
    ],
    pearls: [
      "Cirrhosis + hematemesis → variceal bleed protocol before endoscopy confirms.",
    ],
    pitfalls: [
      "Liberal transfusion in variceal bleed — increases portal pressure",
    ],
  },
  "pancreatitis-hepatitis": {
    overview: "Acute pancreatitis severity, hepatitis serologies, and cirrhosis complications.",
    summary:
      "Acute pancreatitis: gallstones and alcohol common. Diagnose with ≥2 of: epigastric pain, lipase >3× ULN, imaging findings. Aggressive IV fluids early; pain control; treat gallstone pancreatitis with cholecystectomy after recovery.\n\nHepatitis: acute viral serologies (A IgM, B surface Ag/core IgM, C Ab/RNA). Cirrhosis: ascites (SAAG), SBP prophylaxis/treatment, encephalopathy (lactulose), varices (beta-blocker ± banding).",
    keyConcepts: [
      "Ranson and BISAP predict severe pancreatitis",
      "Gallstone pancreatitis → cholecystectomy same admission if mild",
      "Hepatitis B chronic: HBsAg + anti-HBc IgG; check HBV DNA before immunosuppression",
      "SBP: PMN ≥250 on paracentesis → cefotaxime + albumin",
      "Acetaminophen overdose → N-acetylcysteine",
    ],
    mustKnowFacts: [
      "Chronic HBV reactivation risk with anti-TNF or rituximab — screen HBsAg first",
    ],
    pearls: [
      "Epigastric pain radiating to back + lipase 800 → pancreatitis; RUQ US for gallstones.",
    ],
    pitfalls: [
      "Missing alcohol withdrawal as contributor in alcoholic hepatitis",
    ],
  },
  "aki-ckd-electrolytes": {
    overview: "AKI categories, dialysis indications, and electrolyte emergencies.",
    summary:
      "AKI: prerenal (BUN:Cr >20, FeNa <1%), intrinsic (ATN muddy casts), postrenal (hydronephrosis). Stop nephrotoxins; adjust meds to GFR. Dialysis for AEIOU indications.\n\nHyperkalemia with ECG changes: calcium gluconate first, then insulin/dextrose, albuterol, kayexalate/dialysis. Hyponatremia: correct chronic hyponatremia ≤8–10 mEq/L per 24 h.",
    keyConcepts: [
      "FeNa unreliable on diuretics — use FEUrea",
      "Hyperkalemia ECG: peaked T → wide QRS → sine wave",
      "Contrast nephropathy prevention: IV isotonic saline",
      "CKD anemia: EPO when Hgb low; iron studies first",
      "Metabolic acidosis in CKD: oral bicarbonate when indicated",
    ],
    mustKnowFacts: [
      "Never give IV push potassium",
    ],
    pearls: [
      "Post-op oliguria + BUN:Cr 35 + FeNa 0.3% → prerenal — fluid challenge first.",
    ],
    pitfalls: [
      "Rapid correction of chronic hyponatremia → osmotic demyelination",
    ],
  },
  "nephrotic-nephritic": {
    overview: "Proteinuria patterns, complement levels, and biopsy triggers.",
    summary:
      "Nephrotic syndrome: proteinuria >3.5 g/day, hypoalbuminemia, edema, hyperlipidemia. Causes: minimal change (children), FSGS, membranous, diabetic nephropathy. Nephritic: hematuria, RBC casts, HTN, ↓GFR — post-strep GN, IgA, lupus nephritis, RPGN.\n\nComplement low in post-strep GN and lupus; normal in IgA nephropathy. RPGN: crescentic GN — urgent steroids ± cyclophosphamide/plasma exchange.",
    keyConcepts: [
      "RBC casts = glomerular bleeding",
      "Nephrotic hypercoagulable state — DVT/PE risk",
      "Post-strep GN: low C3, supports with ASO",
      "IgA nephropathy: synpharyngitic hematuria",
      "Membranous: PLA2R antibodies; cancer screen in older adults",
    ],
    mustKnowFacts: [
      "Minimal change disease responds dramatically to steroids in children",
    ],
    pearls: [
      "Cola-colored urine 1–2 weeks post-pharyngitis + low C3 → post-strep GN.",
    ],
    pitfalls: [
      "Missing lupus nephritis in young woman with nephritic sediment",
    ],
  },
  "diabetes-dka-management": {
    overview: "DKA/HHS protocols, insulin drip rules, and outpatient glycemic targets.",
    summary:
      "DKA: gap acidosis, ketones, glucose usually >250. Fluids first; insulin drip only if K⁺ ≥3.3; add dextrose when glucose ~200 while closing gap. HHS: extreme hyperglycemia, minimal ketosis, profound dehydration.\n\nType 2 outpatient: metformin first-line unless contraindicated; GLP-1 RA and SGLT2i for ASCVD/HF/CKD benefits.",
    keyConcepts: [
      "DKA resolution = anion gap closed, not glucose alone",
      "Hold insulin if K⁺ <3.3 — replete potassium first",
      "SGLT2i associated euglycemic DKA risk peri-surgery",
      "Hypoglycemia: 15 g fast carb, recheck 15 min",
      "HbA1c target individualize; avoid tight control in frail elderly",
    ],
    mustKnowFacts: [
      "Check glucose before every insulin dose in hospital",
    ],
    pearls: [
      "DKA patient glucose 180 but gap still open → continue insulin + dextrose IV.",
    ],
    pitfalls: [
      "Stopping insulin drip when glucose normalizes before gap closes",
    ],
  },
  "thyroid-storm": {
    overview: "Thyrotoxic crisis vs myxedema coma — emergent treatment sequences.",
    summary:
      "Thyroid storm: fever, tachycardia, agitation, GI symptoms in thyrotoxic patient. PTU (blocks T4→T3) or methimazole; iodine solution 1 h after thionamide; beta-blocker; steroids; supportive care.\n\nMyxedema coma: hypothermia, bradycardia, altered mental status — IV levothyroxine ± liothyronine; hydrocortisone for possible adrenal insufficiency; warm blankets, avoid oversedation.",
    keyConcepts: [
      "Thyroid storm Burch-Wartofsky score",
      "Give iodine after thionamide to block organification",
      "Beta-blocker controls adrenergic symptoms",
      "Myxedema: treat adrenal insufficiency concurrently",
      "Subclinical hyperthyroidism: treat if elderly, AF, or TSH persistently low",
    ],
    mustKnowFacts: [
      "Amiodarone-induced thyrotoxicosis has two types — management differs",
    ],
    pearls: [
      "Postpartum woman febrile and tachycardic after stopping methimazole → thyroid storm.",
    ],
    pitfalls: [
      "Giving iodine before thionamide — fuels new hormone synthesis",
    ],
  },
  "sepsis-bundles": {
    overview: "Hour-1 bundle, source control, and vasopressor selection.",
    summary:
      "Sepsis: infection + organ dysfunction (SOFA/qSOFA). Septic shock: vasopressors needed despite fluids + lactate >2. Draw lactate and cultures, give broad antibiotics within 1 h, 30 mL/kg crystalloid for hypotension or lactate ≥4.\n\nNorepinephrine first-line vasopressor; add vasopressin second. Source control: drain abscess, remove infected line, debride necrotizing infection.",
    keyConcepts: [
      "Antibiotics within 1 hour of recognition",
      "30 mL/kg crystalloid for sepsis-induced hypotension",
      "Norepinephrine first for septic shock",
      "Lactate clearance guides resuscitation",
      "Necrotizing fasciitis: surgical emergency — not antibiotics alone",
    ],
    mustKnowFacts: [
      "Do not delay antibiotics for lumbar puncture in suspected meningitis with sepsis",
    ],
    pearls: [
      "Fever + hypotension after cholecystitis → sepsis bundle before OR if unstable.",
    ],
    pitfalls: [
      "Normal WBC does not exclude sepsis — especially in elderly or immunosuppressed",
    ],
  },
  "hiv-opportunistic": {
    overview: "CD4 thresholds, prophylaxis, and AIDS-defining infections.",
    summary:
      "Start ART for all HIV regardless of CD4. PCP prophylaxis TMP-SMX when CD4 <200. MAC prophylaxis azithromycin when CD4 <50. Cryptococcal meningitis: amphotericin + flucytosine induction.\n\nAcute HIV: flu-like illness, high viral load; test with Ag/Ab combo assay. PEP after high-risk exposure within 72 h.",
    keyConcepts: [
      "CD4 <200 → PCP prophylaxis",
      "CD4 <50 → MAC prophylaxis",
      "Cryptococcus: LP opening pressure management critical",
      "TB-HIV coinfection: start ART within 2–8 weeks of TB therapy per guidelines",
      "HIV dementia: rule out other causes; optimize ART",
    ],
    mustKnowFacts: [
      "Single-dose nevirapine historically caused resistance — know institutional PEP protocols",
    ],
    pearls: [
      "CD4 80 + headache + India ink positive → cryptococcal meningitis; treat before considering IRIS alone.",
    ],
    pitfalls: [
      "Missing PCP when diffuse interstitial infiltrates + LDH elevated in AIDS",
    ],
  },
  "rheumatology-autoimmune": {
    overview: "RA, SLE, vasculitis, and crystal arthropathies in clinical vignettes.",
    summary:
      "RA: symmetric polyarthritis, anti-CCP; methotrexate first-line DMARD. SLE: multisystem, ANA sensitive, anti-dsDNA specific; hydroxychloroquine for all. GCA: headache, jaw claudication — steroids before biopsy.\n\nVasculitis: ANCA-associated (GPA MPA), GPA c-ANCA PR3. Crystal disease: gout (needle negative birefringent) vs pseudogout (rhomboid positive).",
    keyConcepts: [
      "Anti-CCP more specific than RF for RA",
      "Lupus nephritis: biopsy guides class-specific therapy",
      "GCA: start prednisone immediately if vision symptoms",
      "Hydroxychloroquine requires eye screening",
      "Septic arthritis: joint aspiration before antibiotics — one joint emergency",
    ],
    mustKnowFacts: [
      "Screen TB before biologics in RA",
    ],
    pearls: [
      "Hot swollen monoarticular knee → aspirate to exclude septic arthritis before steroids.",
    ],
    pitfalls: [
      "Delaying steroids in temporal arteritis with visual symptoms",
    ],
  },
  "stroke-management": {
    overview: "tPA/thrombectomy windows, BP targets, and hemorrhage exclusion.",
    summary:
      "Acute ischemic stroke: CT excludes hemorrhage; tPA within 4.5 h if eligible; thrombectomy for LVO up to 24 h in selected patients. BP permissive pre-tPA (<185/110); avoid lowering too fast chronically.\n\nICH: reverse anticoagulation, BP control, neurosurgery for cerebellar or herniation. SAH: nimodipine for vasospasm prevention.",
    keyConcepts: [
      "Time last known well anchors tPA eligibility",
      "NIHSS quantifies severity",
      "AF-related cardioembolic stroke → anticoagulation timing after bleed excluded",
      "TIA: ABCD2 score; early carotid imaging if symptomatic stenosis",
      "Lacunar strokes: small vessel disease — hypertension control",
    ],
    mustKnowFacts: [
      "Glucose check before tPA — hypoglycemia mimics stroke",
    ],
    pearls: [
      "Aphasia + right weakness 90 min from onset + CT clear → tPA checklist next.",
    ],
    pitfalls: [
      "Giving antiplatelets before hemorrhage excluded on CT",
    ],
  },
  "seizures-headaches": {
    overview: "Status epilepticus, migraine red flags, and SAH presentation.",
    summary:
      "First unprovoked seizure: neuroimaging, EEG; treat recurrence risk case-by-case. Status epilepticus: lorazepam → fosphenytoin/levetiracetam → ICU sedatives if refractory.\n\nThunderclap headache → SAH until excluded (CT then LP). Migraine with aura vs TIA — aura spreads slowly over minutes; TIA maximal at onset.",
    keyConcepts: [
      "Status epilepticus: benzodiazepine first line",
      "SAH: worst headache of life — CT then LP",
      "Meningitis triad: fever, neck stiffness, altered mental status",
      "Cluster headache: unilateral periorbital, autonomic features",
      "Idiopathic intracranial hypertension: obese woman, papilledema",
    ],
    mustKnowFacts: [
      "Check glucose in all seizure patients",
    ],
    pearls: [
      "Sudden severe headache peaking in seconds → SAH workup even if neuro exam normal initially.",
    ],
    pitfalls: [
      "Discharging thunderclap headache after negative CT without LP if high suspicion",
    ],
  },
  "dementia-workup": {
    overview: "Reversible causes, Alzheimer vs Lewy body vs vascular patterns.",
    summary:
      "Cognitive decline workup: TSH, B12, syphilis, neuroimaging. Delirium vs dementia: acute vs chronic, attention fluctuation in delirium. Alzheimer: insidious memory loss. Lewy body: visual hallucinations, parkinsonism, fluctuating cognition.\n\nNormal pressure hydrocephalus: wet, wacky, wobbly — gait, dementia, incontinence; responds to LP tap test/shunting.",
    keyConcepts: [
      "Delirium = acute, fluctuating, inattention — treat underlying cause",
      "Alzheimer: episodic memory loss first",
      "Lewy body: antipsychotics worsen symptoms — cautious use",
      "Vascular dementia: stepwise decline with focal neuro signs",
      "NPH: magnetic gait, urinary urgency, cognitive slowing",
    ],
    mustKnowFacts: [
      "UTI and medications common reversible delirium triggers in elderly",
    ],
    pearls: [
      "Acute confusion post-op in elderly → delirium workup before labeling dementia progression.",
    ],
    pitfalls: [
      "Attributing acute confusion to dementia without metabolic workup",
    ],
  },
  "preventive-screening": {
    overview: "USPSTF-aligned cancer screening, AAA, and immunizations for adults.",
    summary:
      "Screening is age and risk-based: colonoscopy 45–75, mammography 40–74 (individualize), cervical Pap/HPV, LDCT for lung cancer in high-risk smokers. AAA one-time ultrasound men 65–75 ever smoked.\n\nVaccines: influenza annually, pneumococcal by age/risk, shingles (Shingrix) ≥50, HPV through age 26 (extend per shared decision).",
    keyConcepts: [
      "Shared decision-making for prostate PSA in men 55–69",
      "Colonoscopy q10y or FIT annually depending on modality",
      "Statin primary prevention by ASCVD risk calculator",
      "Aspirin primary prevention now limited — bleeding risk",
      "Hepatitis C screen all adults once",
    ],
    mustKnowFacts: [
      "USPSTF grades — A/B recommend; D recommends against",
    ],
    pearls: [
      "Former smoker 30 pack-years quit 10 years ago still qualifies for lung cancer screening.",
    ],
    pitfalls: [
      "Screening low-risk populations with low PPV — false positives harm",
    ],
  },
};

export const USMLE_2026_STUDY_CONTENT: Record<string, Usmle2026StudyContent> = {
  ...STEP2_INTERNAL_MEDICINE,
  ...USMLE_2026_CONTENT_STEP2_EXTRA,
  ...USMLE_2026_CONTENT_STEP1,
  ...USMLE_2026_CONTENT_STEP3,
  ...USMLE_2026_CONTENT_CROSS,
};

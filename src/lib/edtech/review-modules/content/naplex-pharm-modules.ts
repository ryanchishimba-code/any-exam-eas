import { buildNaplexReviewModule } from "./naplex-module-builder";

export const NAPLEX_CALCULATIONS_MODULE = buildNaplexReviewModule({
  why: [
    "Pharmaceutical calculations appear on nearly every NAPLEX form — drip rates, weight-based dosing, alligation, reconstitution, and renal adjustments are pass/fail competencies. Errors in concentration or unit conversion cause real patient harm; the board tests whether you can set up problems systematically and verify answers.",
    "High-alert medications (heparin, insulin, chemotherapy, neonatal/ICU drips) require independent double-checks. NAPLEX items often embed a calculation inside a patient scenario — extract the ordered dose, confirm units, convert weight, then calculate.",
  ],
  concepts: [
    "Dimensional analysis (factor-label): write units so they cancel — most error-resistant method",
    "Rate (mL/hr) = [Dose (mcg/kg/min) × Weight (kg) × 60] ÷ Concentration (mcg/mL)",
    "D/H × Q: Desired dose ÷ Dose on hand × Quantity = volume to administer",
    "Alligation medial: (higher% − desired%) : (desired% − lower%) = parts of lower : parts of higher",
    "CrCl (Cockcroft-Gault): [(140 − Age) × Weight] ÷ [72 × SCr] × 0.85 if female; use IBW unless actual < IBW; AdjBW if obese",
    "Reconstitution changes concentration — always label final mg/mL and verify with D/H×Q",
    "lb ÷ 2.2 = kg; 1 mg = 1,000 mcg; never mix mg/mL with mcg/kg/min without conversion",
    "Loading dose = Vd × Cp; maintenance infusion is separate calculation",
    "TPN: calculate macronutrients, electrolytes, and osmolarity; verify final volume",
    "Oncology BSA (Mosteller): √[(height cm × weight kg) ÷ 3600]; mg/m² dosing",
  ],
  clinical: [
    "Norepinephrine 0.1 mcg/kg/min in 80 kg patient, bag 16 mcg/mL — calculate mL/hr and verify pump setting",
    "Pediatric amoxicillin 45 mg/kg/day divided BID — convert lb to kg, calculate per-dose mL from suspension concentration",
    "Mix 70% and 20% alcohol to make 500 mL of 45% — use alligation for volume of each stock",
    "Vancomycin 1 g in 250 mL D5W — what is mg/mL? If order is 15 mg/kg and patient is 70 kg, how many mL over 90 min?",
    "Insulin U-500: never use U-100 syringe — 5× overdose risk; dedicated U-500 syringe or pen only",
    "Obese patient aminoglycoside — use adjusted body weight (AdjBW = IBW + 0.4 × (TBW − IBW))",
    "Heparin bolus + infusion per weight-based nomogram — calculate bolus units then infusion units/kg/hr",
  ],
  tables: [
    {
      caption: "High-alert calculation checkpoints",
      headers: ["Medication", "Common trap", "Safety step"],
      rows: [
        ["Insulin", "U-100 vs U-500 concentration", "Dedicated device; independent double-check"],
        ["Heparin", "Bolus + drip unit confusion", "Nomogram; aPTT monitoring"],
        ["Chemotherapy", "mg vs mg/m² vs mg/kg", "BSA calculation; two-person verify"],
        ["Pediatric liquids", "mg/kg/day vs per dose", "Divide by frequency before D/H×Q"],
        ["Electrolytes (KCl)", "mEq vs mg vs mL", "Max IV rate per central vs peripheral"],
      ],
    },
    {
      caption: "Weight selection for renal and aminoglycoside dosing",
      headers: ["Scenario", "Weight to use"],
      rows: [
        ["Normal BMI adult, CrCl", "Ideal body weight (or actual if lower)"],
        ["Obese adult (TBW > 120% IBW)", "Adjusted body weight"],
        ["Pediatric weight-based", "Actual body weight (kg)"],
        ["Elderly, low muscle mass", "Caution — SCr may underestimate impairment"],
      ],
    },
  ],
  visual: [
    "Unit-cancellation ladder: ordered dose → convert to same units as concentration → divide for volume or rate",
    "Alligation number line: mark high%, desired%, low% — cross-subtract for part ratios",
    "CrCl decision tree: get SCr + age + sex → pick IBW vs AdjBW → apply CG → compare to drug threshold",
    "Insulin concentration warning banner: U-100 (100 units/mL) vs U-500 (500 units/mL)",
  ],
  misconceptions: [
    "Using total body weight in Cockcroft-Gault for morbid obesity — overestimates CrCl and leads to toxic doses",
    "Calculating mg/kg/day as a single dose without dividing by frequency",
    "Assuming eGFR and CrCl are interchangeable for all drug package inserts — they are not",
    "Rounding insulin or heparin drips without verifying against institutional policy",
  ],
  pearls: [
    "When two answers are close, re-check unit conversions first — that is where NAPLEX traps hide",
    "Always ask: is this dose per day or per dose? Is concentration mg/mL or mcg/mL?",
    "Document calculation on prescription verification — pharmacist liability standard",
  ],
  summary: [
    "Set up every problem with dimensional analysis; cancel units systematically",
    "CrCl uses Cockcroft-Gault with correct weight; eGFR is for staging, not always dosing",
    "Alligation for mixing concentrations; D/H×Q for individual doses",
    "Insulin and heparin are high-alert — concentration and double-check every time",
  ],
});

export const NAPLEX_ASTHMA_COPD_MODULE = buildNaplexReviewModule({
  why: [
    "Respiratory pharmacotherapy is among the highest-yield NAPLEX domains — inhaler device selection, stepwise asthma therapy (GINA), COPD maintenance and exacerbation treatment (GOLD), and antibiotic choices for CAP/HAP appear repeatedly. Pharmacists must counsel on technique, spacer use, and when to escalate or refer.",
  ],
  concepts: [
    "Asthma step therapy (GINA): SABA PRN → low-dose ICS → ICS-LABA → add LAMA or biologic based on phenotype",
    "SABA overuse (>2 days/week) signals uncontrolled asthma — step up controller, do not rely on rescue alone",
    "ICS are cornerstone controllers; rinse mouth after use to reduce oral candidiasis",
    "LABA monotherapy without ICS is contraindicated in asthma (increased mortality) — always ICS-LABA combo",
    "COPD GOLD: bronchodilator first (LAMA or LABA); dual bronchodilation (LAMA+LABA) for persistent symptoms; add ICS if eosinophilic phenotype or frequent exacerbations",
    "Inhaler technique: slow deep inhalation for DPI; slow steady for MDI with spacer; hold breath 10 sec",
    "Acute asthma exacerbation: SABA + ipratropium nebs, systemic corticosteroids, oxygen; magnesium sulfate if severe",
    "COPD exacerbation: SABA ± SAMA, systemic steroids, antibiotics if purulent sputum (amoxicillin-clav, doxy, azithro)",
    "Theophylline: narrow therapeutic index; drug interactions (CYP1A2); monitor levels 5–15 mcg/mL",
    "Biologics (omalizumab, dupilumab, mepolizumab): for severe eosinophilic or allergic asthma — know IgE/eos criteria",
  ],
  clinical: [
    "Patient using albuterol daily with no controller — recommend ICS; counsel on spacer and technique",
    "COPD patient on LAMA monotherapy with 3 exacerbations/year — consider LAMA+LABA or add ICS if eosinophils ≥300",
    "Asthma patient on fluticasone-salmeterol — oral thrush; recommend rinse/spacer, consider dose reduction if controlled",
    "CAP outpatient: healthy adult → amoxicillin or doxycycline; comorbidities → amox-clav + macrolide or respiratory FQ",
    "Severe COPD exacerbation: prednisone 40 mg × 5 days; azithromycin if purulent sputum; assess need for hospitalization",
    "Patient cannot coordinate MDI — switch to DPI or add spacer; demonstrate technique at dispensing",
  ],
  tables: [
    {
      caption: "Inhaler device counseling pearls",
      headers: ["Device", "Key technique", "Common error"],
      rows: [
        ["MDI", "Shake, exhale, slow press + inhale; spacer preferred", "Actuating too fast without inhaling"],
        ["DPI", "Forceful deep inhalation; device-specific loading", "Insufficient inspiratory flow"],
        ["Soft mist (Respimat)", "Slow steady inhalation", "Breathing too fast"],
        ["Diskus/Turbuhaler", "Load dose, exhale away, inhale forcefully", "Not exhaling before dose"],
      ],
    },
    {
      caption: "Asthma vs COPD controller selection",
      headers: ["Scenario", "Preferred approach"],
      rows: [
        ["Mild intermittent asthma", "SABA PRN only"],
        ["Persistent asthma", "Daily ICS ± LABA"],
        ["COPD without frequent exacerbations", "LAMA or LABA monotherapy"],
        ["COPD with ≥2 exacerbations/yr", "LAMA+LABA; consider ICS if eos ≥300"],
        ["Acute bronchospasm", "SABA neb/MDI; add ipratropium if severe"],
      ],
    },
  ],
  visual: [
    "GINA asthma step ladder: SABA → ICS → ICS-LABA → +LAMA/biologic",
    "COPD inhaler pyramid: bronchodilator base → dual → ± ICS for exacerbators",
    "Inhaler technique checklist: shake/load → exhale → inhale → hold breath → rinse (ICS)",
  ],
  misconceptions: [
    "Using LABA alone as asthma maintenance without ICS",
    "Adding ICS to every COPD patient regardless of exacerbation history — pneumonia risk without benefit",
    "Treating viral URI bronchospasm with antibiotics routinely",
    "Assuming all patients can use MDI without spacer or training",
  ],
  pearls: [
    "Trelegy and Breztri are triple therapy (ICS+LAMA+LABA) — know COPD indication vs asthma labeling",
    "Smoking cessation is the single most impactful COPD intervention — counsel at every visit",
    "Peak flow or symptom diary helps assess control — pharmacist can triage uncontrolled patients to prescriber",
  ],
  summary: [
    "Asthma: step up controllers; never LABA alone; ICS is foundation",
    "COPD: bronchodilators first; add ICS only for frequent exacerbators with eosinophilia",
    "Counsel inhaler technique every dispensing — device errors cause 'treatment failure'",
    "CAP empiric regimens depend on comorbidities and local resistance",
  ],
});

export const NAPLEX_PSYCHOTROPICS_MODULE = buildNaplexReviewModule({
  why: [
    "CNS and psychiatric pharmacotherapy is heavily tested — antidepressant selection, antipsychotic monitoring (metabolic, EPS, agranulocytosis), mood stabilizer levels, benzodiazepine tapering, and seizure medication interactions. Pharmacists must recognize serotonin syndrome, neuroleptic malignant syndrome, and REMS requirements.",
  ],
  concepts: [
    "SSRIs first-line for depression/anxiety: sertraline, escitalopram — fewer drug interactions than fluoxetine/paroxetine",
    "Serotonin syndrome: SSRI/SNRI + tramadol, linezolid, MAOI, triptans → hyperthermia, clonus, agitation — stop serotonergic agents",
    "MAOIs: tyramine diet restriction; washout 2 weeks before SSRI (5 weeks for fluoxetine)",
    "Bupropion: no sexual dysfunction or weight gain; lowers seizure threshold — avoid in eating disorders, alcohol withdrawal",
    "First-gen antipsychotics (haloperidol, chlorpromazine): high EPS risk; QT prolongation",
    "Second-gen antipsychotics (risperidone, olanzapine, quetiapine): metabolic syndrome — monitor weight, glucose, lipids",
    "Clozapine: REMS; ANC monitoring weekly→biweekly→monthly; only antipsychotic for treatment-resistant schizophrenia; agranulocytosis risk",
    "Lithium: narrow index 0.6–1.2 mEq/L; toxicity >1.5; tremor, polyuria, hypothyroidism; NSAIDs and ACEi increase levels",
    "Valproate: neural tube defects — folic acid; hepatotoxicity; weight gain; platelet dysfunction; monitor LFTs and level",
    "Carbamazepine: CYP3A4 inducer; HLA-B*1502 screen in at-risk ancestry; SIADH, agranulocytosis",
    "Benzodiazepines: taper slowly to avoid withdrawal seizures; avoid with opioids (FDA boxed warning)",
  ],
  clinical: [
    "Patient on SSRI + tramadol for pain — assess serotonin syndrome risk; consider alternative analgesic",
    "New clozapine start — verify ANC baseline, REMS enrollment, counsel on fever/sore throat",
    "Lithium level 1.8, tremor, confusion — hold lithium, hydrate, consider hemodialysis if severe; check interacting drugs",
    "Olanzapine patient gained 15 lb in 3 months — monitor metabolic panel; discuss switch to aripiprazole or lurasidone",
    "Epilepsy patient starting oral contraceptive — enzyme-inducing AEDs (carbamazepine, phenytoin) reduce OCP efficacy",
    "Elderly with insomnia requesting diphenhydramine — Beers Criteria avoid; recommend sleep hygiene, low-dose melatonin, or trazodone per provider",
  ],
  tables: [
    {
      caption: "Antidepressant selection pearls",
      headers: ["Agent", "Pearl", "Avoid when"],
      rows: [
        ["Sertraline", "Preferred in cardiac disease, pregnancy data", "CYP2D6 interactions moderate"],
        ["Escitalopram", "Clean profile; QT at high doses", "Concurrent QT-prolonging drugs"],
        ["Fluoxetine", "Long half-life; CYP2D6 inhibitor", "Tamoxifen (reduces efficacy)"],
        ["Bupropion", "Weight neutral; helps smoking cessation", "Seizure disorder, bulimia"],
        ["Mirtazapine", "Appetite/weight gain; sedating", "Obesity, metabolic syndrome"],
        ["Venlafaxine", "SNRI; BP elevation at high dose", "Uncontrolled hypertension"],
      ],
    },
    {
      caption: "Antipsychotic monitoring requirements",
      headers: ["Drug", "Critical monitoring"],
      rows: [
        ["Clozapine", "ANC (REMS), myocarditis, constipation/ileus"],
        ["Olanzapine", "Weight, glucose, lipids, metabolic syndrome"],
        ["Risperidone", "Prolactin elevation, EPS, QT"],
        ["Haloperidol", "EPS, QT, NMS risk with rapid dose escalation"],
        ["Quetiapine", "Sedation, orthostasis, metabolic effects"],
      ],
    },
  ],
  visual: [
    "Serotonin syndrome triad: mental status change + autonomic instability + neuromuscular hyperactivity (clonus)",
    "Lithium toxicity ladder: therapeutic 0.6–1.2 → mild >1.5 → severe >2.0 with neuro symptoms",
    "AED enzyme induction spectrum: carbamazepine/phenytoin/phenobarbital induce CYP → ↓ OCP, warfarin, DOACs",
  ],
  misconceptions: [
    "Stopping antidepressants abruptly — taper to avoid discontinuation syndrome",
    "Using antipsychotics as first-line for dementia-related agitation without behavioral trial — Black Box mortality risk",
    "Assuming all atypical antipsychotics are metabolically neutral — olanzapine and clozapine cause significant weight gain",
    "Rechallenging clozapine after agranulocytosis without specialist guidance",
  ],
  pearls: [
    "Sertraline is the most studied SSRI in pregnancy/lactation — often preferred when benefits outweigh risks",
    "Aripiprazole and brexpiprazole are partial agonists — lower metabolic burden than olanzapine",
    "Lamotrigine must be titrated slowly — rash/SJS risk with rapid titration or valproate co-administration",
  ],
  summary: [
    "SSRIs first-line; watch serotonin syndrome with tramadol, linezolid, MAOIs",
    "Clozapine = REMS + ANC; lithium = levels + drug interactions",
    "Antipsychotics need metabolic monitoring; avoid in dementia-related psychosis when possible",
    "AED drug interactions (CYP induction) affect contraceptives and many substrates",
  ],
});

export const NAPLEX_RENAL_CKD_MODULE = buildNaplexReviewModule({
  why: [
    "Renal impairment changes drug clearance, protein binding, and dialysis removal — NAPLEX tests Cockcroft-Gault calculations, dose adjustments for renally cleared drugs, dialysis supplemental dosing, and CKD complications (anemia, bone-mineral disorder, hyperkalemia). Pharmacists prevent toxicity from gabapentin, DOACs, metformin, and antimicrobials daily.",
  ],
  concepts: [
    "CKD staging by eGFR: G1 ≥90, G2 60–89, G3a 45–59, G3b 30–44, G4 15–29, G5 <15 or dialysis",
    "CrCl (CG) for dosing; eGFR (CKD-EPI) for staging — know when package insert specifies each",
    "ACEi/ARB: indicated for proteinuric CKD; accept ≤30% Cr rise from baseline; hold if hyperkalemia or AKI",
    "Metformin: reduce at eGFR 30–45; hold at <30; hold before iodinated contrast per protocol",
    "Gabapentin/pregabalin: reduce dose proportionally with CrCl; dialyzable — give supplemental dose post-HD",
    "DOACs: dabigatran avoid CrCl <30; rivaroxaban dose reduce at ≤50; apixaban 2-of-3 rule (age ≥80, weight ≤60, SCr ≥1.5)",
    "Aminoglycosides/vancomycin: extend interval or reduce dose; AUC-guided vancomycin preferred",
    "ESRD anemia: epoetin alfa/darbepoetin — target Hgb 10–11; avoid >13 (CV risk); iron stores first",
    "CKD-MBD: phosphate binders (sevelamer, calcium acetate), vitamin D analogs, calcimimetics (cinacalcet)",
    "Dialysis drug removal: high-flux HD removes small water-soluble drugs; give supplemental dose after session if <50% removed",
  ],
  clinical: [
    "CrCl 25 mL/min patient prescribed gabapentin 300 mg TID — reduce to 300 mg daily or BID per chart",
    "CKD G4 starting apixaban for AF — check 2-of-3 criteria; may need 2.5 mg BID",
    "Vancomycin in HD patient — give supplemental dose after dialysis session per protocol; monitor AUC if available",
    "Hyperkalemia on ACEi + spironolactone in CKD — hold K-sparing agents, dietary K+ restriction, patiromer or SPS",
    "Patient with eGFR 38 starting metformin — acceptable with monitoring; counsel hold before contrast and surgery",
    "ESRD patient with Hgb 8.5 and ferritin 150 — iron replete; consider epoetin with target Hgb 10–11",
  ],
  tables: [
    {
      caption: "Renally cleared high-yield drugs",
      headers: ["Drug", "CrCl threshold / adjustment"],
      rows: [
        ["Metformin", "Reduce 30–45; hold <30"],
        ["Gabapentin", "Proportional reduction; supplemental post-HD"],
        ["Dabigatran", "Avoid if CrCl <30"],
        ["Rivaroxaban", "15 mg daily if CrCl 15–50 (AF); avoid <15"],
        ["Apixaban", "2.5 mg BID if 2 of 3 criteria met"],
        ["Enoxaparin", "Reduce dose or use UFH if CrCl <30"],
        ["Nitrofurantoin", "Avoid if CrCl <30 (inadequate urine concentration)"],
      ],
    },
    {
      caption: "CKD complication pharmacotherapy",
      headers: ["Complication", "First-line pharmacotherapy"],
      rows: [
        ["Hyperkalemia", "Hold RAAS/K-sparing; patiromer/SPS; treat cause"],
        ["Anemia", "Iron repletion; then epoetin if Hgb <10"],
        ["Hyperphosphatemia", "Phosphate binders with meals; dietary restriction"],
        ["Secondary hyperparathyroidism", "Vitamin D analogs; cinacalcet if refractory"],
        ["Metabolic acidosis", "Oral sodium bicarbonate if HCO3 <22"],
      ],
    },
  ],
  visual: [
    "CrCl dosing flowchart: calculate CG → compare to insert threshold → reduce/hold/extend interval",
    "Dialysis supplemental dosing timeline: dose → HD session → measure removal → redose if needed",
    "CKD-MBD triangle: phosphate ↑, calcium ↓, PTH ↑ — treat with binders, vitamin D, calcimimetics",
  ],
  misconceptions: [
    "Using eGFR directly when package insert specifies CrCl — can overestimate function and cause toxicity",
    "Continuing nitrofurantoin for UTI prophysis in CrCl <30 — ineffective and accumulates",
    "Targeting Hgb >13 with ESAs — increases stroke and mortality risk",
    "Assuming all drugs are dialyzable — protein-bound and large molecules are not",
  ],
  pearls: [
    "Normal SCr in elderly does not mean normal renal function — always calculate CrCl",
    "SGLT2 inhibitors slow CKD progression even in non-diabetic CKD (dapagliflozin data)",
    "NSAIDs are nephrotoxic — avoid in CKD; can precipitate AKI on ACEi/diuretic",
  ],
  summary: [
    "Calculate CrCl for dosing; stage CKD with eGFR",
    "Adjust gabapentin, DOACs, metformin, antimicrobials by renal function",
    "ACEi/ARB protect proteinuric CKD but watch K+ and Cr",
    "Dialysis patients need supplemental dosing for dialyzable drugs",
  ],
});

export const NAPLEX_TOXICOLOGY_MODULE = buildNaplexReviewModule({
  why: [
    "Toxicology and antidote management is a board favorite — acetaminophen overdose (NAC protocol), opioid reversal (naloxone), benzodiazepine reversal (flumazenil cautions), digoxin toxicity (Fab), methanol/ethylene glycol (fomepizole), and iron/calcium channel blocker overdoses. Pharmacists in poison control and emergency settings must know Rumack-Matthew nomogram and when NOT to give flumazenil.",
  ],
  concepts: [
    "Acetaminophen toxicity: N-acetylcysteine (NAC) if above treatment line on Rumack-Matthew nomogram; treat even if late presentation if hepatotoxicity",
    "NAC dosing: loading 140 mg/kg PO/IV, then 70 mg/kg q4h × 17 doses (PO) or IV protocol per institution",
    "Opioid overdose: naloxone 0.4–2 mg IM/IN/IV; repeat q2–3 min; longer-acting opioids need infusion or repeat dosing",
    "Benzodiazepine overdose: supportive care first; flumazenil 0.2 mg IV — avoid in chronic BZD use (seizures), TCA co-ingestion, or dependency",
    "Digoxin toxicity: hold digoxin; treat hyperkalemia; digoxin immune Fab (DigiFab) for life-threatening arrhythmias or K+ >5.5",
    "Beta-blocker overdose: glucagon 5–10 mg IV bolus then infusion; high-dose insulin euglycemic therapy for refractory cases",
    "Calcium channel blocker overdose: calcium chloride/gluconate, high-dose insulin, lipid emulsion per protocol",
    "Methanol/ethylene glycol: fomepizole or ethanol to inhibit alcohol dehydrogenase; hemodialysis for severe acidosis or high levels",
    "Iron overdose: deferoxamine chelation for systemic toxicity; whole bowel irrigation for pills visible on X-ray",
    "Salicylate toxicity: alkalinize urine; hemodialysis for level >100 mg/dL, pulmonary edema, or refractory acidosis",
  ],
  clinical: [
    "Teen ingested 20 g acetaminophen 6 hours ago — level plots above nomogram line → start NAC immediately",
    "Found unresponsive with pinpoint pupils — naloxone 2 mg IN; support airway; observe for re-sedation with long-acting opioid",
    "Digoxin level 3.2 with VT and K+ 6.1 — emergent Fab; do not treat hyperkalemia with insulin/glucose alone before Fab",
    "Metformin-associated lactic acidosis — hold metformin, supportive care, hemodialysis if severe",
    "TCA overdose with wide QRS — sodium bicarbonate bolus to target pH 7.50–7.55; avoid flumazenil and class Ia antiarrhythmics",
    "Snake bite with coagulopathy — antivenom per poison center; avoid NSAIDs",
  ],
  tables: [
    {
      caption: "High-yield antidote matching",
      headers: ["Toxin / overdose", "Antidote / treatment"],
      rows: [
        ["Acetaminophen", "N-acetylcysteine (NAC)"],
        ["Opioids", "Naloxone"],
        ["Benzodiazepines", "Flumazenil (select cases only)"],
        ["Digoxin", "Digoxin immune Fab"],
        ["Methanol / ethylene glycol", "Fomepizole ± hemodialysis"],
        ["Iron", "Deferoxamine"],
        ["Cyanide", "Hydroxocobalamin or nitrite/thiosulfate kit"],
        ["Heparin", "Protamine sulfate"],
        ["Warfarin", "Vitamin K ± 4-factor PCC"],
        ["Isoniazid seizures", "Pyridoxine (vitamin B6)"],
      ],
    },
    {
      caption: "When to avoid flumazenil",
      headers: ["Situation", "Risk"],
      rows: [
        ["Chronic benzodiazepine use", "Withdrawal seizures"],
        ["TCA co-ingestion", "Proconvulsant — seizures"],
        ["Dependence history", "Seizures, arrhythmias"],
        ["Mild sedation only", "Supportive care sufficient"],
      ],
    },
  ],
  visual: [
    "Rumack-Matthew nomogram: plot APAP level vs hours post-ingestion — treat above line",
    "Opioid reversal timeline: naloxone peak ~30 min — re-narcotize with long-acting agents",
    "Digoxin toxicity fork: mild (hold, monitor) vs severe (Fab for arrhythmia/K+)",
  ],
  misconceptions: [
    "Waiting for acetaminophen level at 4 hours before treating a known massive ingestion — start NAC empirically if staggered ingestion or unreliable history",
    "Using flumazenil routinely in all BZD overdoses — seizures in dependent patients",
    "Treating digoxin hyperkalemia with insulin before Fab in severe toxicity — Fab is priority",
    "Activated charcoal beyond 1–2 hours for most ingestions — limited benefit except sustained-release",
  ],
  pearls: [
    "Acetaminophen is in >600 products — always check cumulative dose in overdose workup",
    "Naloxone nasal spray (Narcan) is OTC — counsel lay rescuers on rescue breathing and 911",
    "Poison Control (1-800-222-1222) should be consulted for complex ingestions",
  ],
  summary: [
    "APAP overdose → Rumack nomogram → NAC if indicated",
    "Opioids → naloxone; observe for re-sedation",
    "Flumazenil only in select acute BZD overdose — never in chronic use or TCA co-ingestion",
    "Match antidote to toxin: Fab (digoxin), fomepizole (toxic alcohols), deferoxamine (iron)",
  ],
});

export const NAPLEX_GERIATRICS_MODULE = buildNaplexReviewModule({
  why: [
    "Geriatric pharmacotherapy is tested through Beers Criteria inappropriate medications, fall risk, polypharmacy deprescribing, renal dosing in the elderly, and anticholinergic burden. The average older adult takes 5+ medications — pharmacists are the frontline for medication review and harm reduction.",
  ],
  concepts: [
    "Beers Criteria 2023: avoid anticholinergics (diphenhydramine, oxybutynin), benzodiazepines, NSAIDs (GI/renal/CV risk), sliding-scale insulin alone, PPI >8 weeks without indication",
    "START/STOPP criteria: European counterpart — identify prescribing omissions and inappropriate drugs in elderly",
    "Anticholinergic burden scale: cumulative score from multiple low-burden drugs causes delirium, falls, constipation, urinary retention",
    "Fall risk drugs: benzodiazepines, opioids, antipsychotics, hypoglycemics, antihypertensives causing orthostasis",
    "Renal dosing: elderly have ↓ muscle mass → 'normal' SCr masks low CrCl — always calculate",
    "Polypharmacy: ≥5 medications increases ADR risk — conduct structured medication review (CMR/MTM)",
    "Deprescribing: taper benzodiazepines, PPIs, sedating antihistamines gradually; monitor withdrawal",
    "Delirium vs dementia: acute onset, fluctuating course, inattention — medications are leading reversible cause",
    "Orthostatic hypotension: check BP supine and standing; adjust antihypertensives, fludrocortisone/midodrine if symptomatic",
    "Vaccines in elderly: high-dose flu, Shingrix, PCV20, COVID boosters per CDC — immunosenescence reduces response",
  ],
  clinical: [
    "85-year-old on diphenhydramine for sleep + oxybutynin for bladder — high anticholinergic burden; recommend alternatives",
    "Elderly on warfarin + aspirin + ibuprofen PRN — triple bleeding risk; counsel on acetaminophen, stop ibuprofen",
    "Patient with SCr 1.0, age 82, weight 55 kg — CrCl ~35; adjust gabapentin and review all renally cleared drugs",
    "Long-term PPI for GI prophylaxis with NSAID discontinued — deprescribe PPI with step-down plan",
    "Benzodiazepine for 10 years — slow taper (10% every 2–4 weeks); switch to shorter-acting for taper if on diazepam",
    "Nursing home patient on 9 medications including duplicate analgesics — medication reconciliation and deprescribing review",
  ],
  tables: [
    {
      caption: "Beers Criteria — commonly tested avoids",
      headers: ["Drug/class", "Risk in elderly"],
      rows: [
        ["Diphenhydramine", "Delirium, anticholinergic toxicity, falls"],
        ["Benzodiazepines", "Falls, cognitive impairment, dependence"],
        ["NSAIDs", "GI bleed, AKI, HF exacerbation"],
        ["Sliding-scale insulin alone", "Hypoglycemia without benefit"],
        ["Long-term PPI without indication", "C. diff, fracture, hypomagnesemia"],
        ["Tricyclic antidepressants", "Anticholinergic, orthostasis, sedation"],
        ["Meperidine", "Neurotoxic metabolite normeperidine"],
      ],
    },
    {
      caption: "Safer alternatives in elderly",
      headers: ["Avoid", "Consider instead"],
      rows: [
        ["Diphenhydramine (sleep)", "Sleep hygiene, melatonin, trazodone (low dose)"],
        ["Oxybutynin", "Mirabegron, topical oxybutynin, behavioral therapy"],
        ["Ibuprofen", "Acetaminophen, topical NSAID, PT"],
        ["Diazepam", "Gradual taper; buspirone for anxiety if needed"],
        ["Glyburide", "Metformin, DPP-4i, basal insulin (less hypoglycemia)"],
      ],
    },
  ],
  visual: [
    "Anticholinergic burden thermometer: score 0–3+ from cumulative drugs → delirium/fall risk rises",
    "Beers Criteria quick screen: benzo? anticholinergic? NSAID? PPI >8 wk? → flag for review",
    "Orthostatic BP check: supine 3 min → stand 1 and 3 min → drop ≥20 systolic or ≥10 diastolic = positive",
  ],
  misconceptions: [
    "Assuming normal creatinine means normal renal function in frail elderly",
    "Stopping all medications at once during deprescribing — taper to avoid withdrawal",
    "Using diphenhydramine as a 'safe' sleep aid in any age group — worst in elderly",
    "Ignoring duplicate therapy (two PPIs, two benzodiazepines) during med rec",
  ],
  pearls: [
    "The anticholinergic burden of a drug may be low alone but dangerous combined with 2–3 others",
    "Glyburide causes more hypoglycemia than other sulfonylureas in elderly — prefer glipizide or non-sulfonylurea agents",
    "Pharmacist-led MTM/CMR is billable under Medicare Part D for eligible patients — high-impact service",
  ],
  summary: [
    "Apply Beers Criteria — avoid anticholinergics, benzos, NSAIDs, inappropriate PPIs in elderly",
    "Calculate CrCl even when SCr looks 'normal'",
    "Deprescribe thoughtfully with tapers; address anticholinergic burden and fall risk",
    "MTM/CMR is the pharmacist's structured tool for polypharmacy review",
  ],
});

export const NAPLEX_TDM_MODULE = buildNaplexReviewModule({
  why: [
    "Therapeutic drug monitoring (TDM) questions test when to draw levels, target ranges, and how to adjust doses for vancomycin AUC, aminoglycosides, digoxin, lithium, phenytoin, and antiepileptics. Modern vancomycin guidelines emphasize AUC/MIC over trough-only monitoring — NAPLEX reflects this shift.",
  ],
  concepts: [
    "Vancomycin AUC/MIC target: 400–600 mg·h/L for serious MRSA infections (IDSA 2020); Bayesian or first-order PK estimation",
    "Vancomycin trough (legacy): 15–20 mcg/mL for serious infections; trough-only monitoring is being replaced by AUC-guided dosing",
    "Aminoglycosides: concentration-dependent killing; once-daily dosing preferred; monitor peak (efficacy) and trough (nephrotoxicity) or use extended-interval nomogram",
    "Extended-interval aminoglycoside ( Hartford/Hershey nomogram): single daily dose based on CrCl; redraw level at specified time",
    "Digoxin: narrow index 0.5–2 ng/mL; draw trough (before next dose) at steady state (~5 days); hypokalemia/hypomagnesemia increase toxicity at 'therapeutic' levels",
    "Phenytoin: highly protein-bound; monitor free phenytoin in hypoalbuminemia or uremia; zero-order kinetics near saturation — small dose changes cause large level jumps",
    "Lithium: 0.6–1.2 mEq/L for maintenance; draw 12 hours post-dose at steady state; toxicity >1.5",
    "Valproate: 50–100 mcg/mL for epilepsy; 50–125 for mania; monitor LFTs and platelets",
    "Carbamazepine: 4–12 mcg/mL; auto-induction of own metabolism — levels fall after 2–4 weeks",
    "Methotrexate: low-dose weekly for RA — never daily dosing error; leucovorin rescue for toxicity",
  ],
  clinical: [
    "MRSA bacteremia on vancomycin — order AUC/MIC monitoring; adjust dose to target 400–600 mg·h/L",
    "Gentamicin 7 mg/kg once daily — draw random level per nomogram at 6–14 hours post-dose to determine interval",
    "Digoxin level 2.4 with nausea and yellow vision — hold digoxin, check K+/Mg2+, treat toxicity; Fab if severe",
    "Phenytoin total level 12 but patient uremic and toxic — check free phenytoin — likely elevated free fraction",
    "Lithium level 1.9 with coarse tremor — hold lithium, increase fluids, recheck; hemodialysis if neuro toxicity",
    "Weekly methotrexate 15 mg dispensed as daily 2.5 mg tablets — critical counseling: take all 6 tablets once weekly, not daily",
  ],
  tables: [
    {
      caption: "TDM target ranges (steady state unless noted)",
      headers: ["Drug", "Target range", "Sample timing"],
      rows: [
        ["Vancomycin (AUC/MIC)", "400–600 mg·h/L", "Bayesian or 2-level PK"],
        ["Vancomycin (trough)", "15–20 mcg/mL (serious MRSA)", "Trough before 4th dose"],
        ["Gentamicin (extended interval)", "Per nomogram", "Random 6–14 h post-dose"],
        ["Digoxin", "0.5–2 ng/mL", "Trough ≥5 days on therapy"],
        ["Phenytoin (total)", "10–20 mcg/mL", "Trough; check free if altered protein"],
        ["Lithium", "0.6–1.2 mEq/L", "12 h post-dose"],
        ["Valproate", "50–100 mcg/mL", "Trough"],
        ["Carbamazepine", "4–12 mcg/mL", "Trough"],
      ],
    },
    {
      caption: "Factors falsely elevating or lowering levels",
      headers: ["Drug", "Falsely elevated level when…", "Falsely low when…"],
      rows: [
        ["Digoxin", "Hypokalemia, hypomagnesemia, renal failure", "Recent Fab administration"],
        ["Phenytoin", "Hypoalbuminemia (total level)", "Auto-induction after weeks of therapy"],
        ["Vancomycin", "Drawing before steady state", "Missed doses before draw"],
        ["Lithium", "Dehydration, NSAIDs, ACEi", "Polyuria, low sodium intake"],
      ],
    },
  ],
  visual: [
    "Vancomycin AUC/MIC shift: trough-only monitoring → AUC-guided Bayesian dosing",
    "Aminoglycoside once-daily nomogram: plot level at 6–14 h → read next dose time from curve",
    "Phenytoin saturation curve: linear kinetics at low dose → zero-order near therapeutic range",
  ],
  misconceptions: [
    "Using vancomycin trough <10 mcg/mL as adequate for MRSA bacteremia — underdosing risk",
    "Drawing digoxin level before 5 days of consistent dosing — not steady state",
    "Interpreting total phenytoin in hypoalbuminemia without free level — misses toxicity",
    "Daily methotrexate dosing for rheumatoid arthritis — fatal medication error",
  ],
  pearls: [
    "Vancomycin nephrotoxicity correlates better with AUC than trough — AUC <600 reduces nephrotoxicity",
    "Draw aminoglycoside levels for extended-interval dosing per nomogram — not routine trough/peak on q8h unless traditional dosing",
    "Carbamazepine induces its own metabolism — expect dose increases after initiation period",
  ],
  summary: [
    "Vancomycin: AUC/MIC 400–600 for MRSA; move away from trough-only",
    "Aminoglycosides: once-daily + nomogram; monitor renal function",
    "Digoxin/lithium/phenytoin: narrow index — correct sample timing and electrolytes",
    "Methotrexate RA = weekly — verify patient understanding every fill",
  ],
});

export const NAPLEX_GI_PHARMACOTHERAPY_MODULE = buildNaplexReviewModule({
  why: [
    "GI pharmacotherapy spans GERD/PUD (PPIs, H2 blockers, H. pylori triple/quadruple therapy), IBD biologics, constipation/laxatives, antiemetics, and liver disease (hepatic encephalopathy, ascites). NAPLEX tests drug interactions with PPIs (clopidogrel debate, Mg2+ depletion), PUD regimens, and cirrhosis complications.",
  ],
  concepts: [
    "GERD step-up: lifestyle → antacids/H2RA → PPI; PPI most effective for erosive esophagitis and Barrett's",
    "PPI counseling: take 30–60 min before first meal; OTC omeprazole 14-day course max 3×/year; long-term risks (C. diff, fracture, hypomagnesemia, B12)",
    "H. pylori eradication: bismuth quadruple (PPI + bismuth + metronidazole + tetracycline) or triple (PPI + amoxicillin + clarithromycin if local resistance low)",
    "PUD: PPI + treat H. pylori if positive; avoid NSAIDs; misoprostol or PPI gastroprotection with required NSAID",
    "IBD: aminosalicylates (mesalamine) for mild UC; corticosteroids for flares; biologics (infliximab, adalimumab, vedolizumab) for moderate-severe",
    "Anti-TNF (infliximab, adalimumab): screen for TB and hepatitis B before start; infusion reactions; do not live vaccinate",
    "Constipation: osmotic laxatives (PEG, lactulose) first-line; stimulants (senna) short-term; avoid chronic stimulant use",
    "Opioid-induced constipation: use PAMORAs (naloxegol, naldemedine, methylnaltrexone) — peripheral opioid antagonists",
    "Hepatic encephalopathy: lactulose (titrate to 2–3 soft stools/day) ± rifaximin",
    "Ascites: spironolactone + furosemide (100:40 ratio); avoid NSAIDs; SBP prophylaxis with fluoroquinolone or TMP-SMX in high-risk cirrhosis",
  ],
  clinical: [
    "GERD unresponsive to daily PPI — assess adherence (before breakfast?), consider BID PPI or switch agent; evaluate for H. pylori",
    "H. pylori positive PUD — prescribe quadruple therapy if macrolide resistance concern; complete 14 days; confirm eradication",
    "UC patient starting infliximab — order TB quantiferon, HBV panel, ensure vaccinations updated; counsel infusion reaction signs",
    "Cirrhosis with ascites on furosemide alone — add spironolactone 100 mg; target weight loss 0.5 kg/day without edema",
    "Opioid patient with constipation unresponsive to laxatives — add naloxegol 25 mg daily (reduce dose if CrCl <60)",
    "Long-term PPI without indication for 2 years — deprescribe with step-down to H2RA or on-demand PPI",
  ],
  tables: [
    {
      caption: "H. pylori eradication regimens",
      headers: ["Regimen", "Components", "Duration"],
      rows: [
        ["Bismuth quadruple", "PPI + bismuth + metronidazole + tetracycline", "14 days"],
        ["Standard triple", "PPI + amoxicillin + clarithromycin", "14 days (if low clarithro resistance)"],
        ["Concomitant", "PPI + amoxicillin + metronidazole + clarithromycin", "14 days"],
        ["Salvage", "Bismuth quadruple or levofloxacin-based", "14 days after failure"],
      ],
    },
    {
      caption: "Laxative selection",
      headers: ["Type", "Example", "Best for"],
      rows: [
        ["Osmotic", "PEG 3350, lactulose", "Chronic constipation, safe long-term"],
        ["Stimulant", "Senna, bisacodyl", "Short-term, acute constipation"],
        ["Bulk-forming", "Psyllium", "Mild constipation; requires fluids"],
        ["Stool softener", "Docusate", "Limited efficacy alone; post-op"],
        ["PAMORA", "Naloxegol, naldemedine", "Opioid-induced constipation"],
      ],
    },
  ],
  visual: [
    "GERD treatment ladder: lifestyle → antacid/H2RA → daily PPI → BID PPI → surgical referral",
    "IBD therapy pyramid: mesalamine (mild) → steroids (flare) → immunomodulator → biologic",
    "Cirrhosis complication map: portal HTN → ascites (diuretics) + varices (beta-blocker) + HE (lactulose/rifaximin)",
  ],
  misconceptions: [
    "PPI + clopidogrel always contraindicated — omeprazole/esomeprazole preferred if PPI needed; avoid pantoprazole debate largely resolved in favor of PPI when indicated",
    "Using metronidazole alone for H. pylori — inadequate eradication without PPI + additional agents",
    "Chronic senna without addressing underlying cause — melanosis coli, dependency",
    "NSAIDs in cirrhosis — precipitate GI bleed and renal failure",
  ],
  pearls: [
    "Confirm H. pylori eradication with urea breath test or stool antigen ≥4 weeks after completing therapy (off PPI 2 weeks)",
    "Rifaximin for HE also reduces hospitalization — expensive but effective add-on to lactulose",
    "Mesalamine formulations differ by release site (colon vs ileum) — match formulation to disease location",
  ],
  summary: [
    "GERD/PUD: PPI before meals; treat H. pylori with 14-day regimen",
    "IBD biologics: screen TB/HBV; no live vaccines during anti-TNF",
    "Cirrhosis: lactulose/rifaximin for HE; spironolactone + furosemide for ascites",
    "Opioid constipation: PAMORAs when laxatives fail",
  ],
});

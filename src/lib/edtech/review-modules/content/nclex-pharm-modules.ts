import { buildNclexReviewModule } from "./nclex-module-builder";

export const ANTICOAGULATION_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Anticoagulation is a top NCLEX pharmacology domain — warfarin INR monitoring, heparin/DOAC bleeding, and reversal agents appear in Safety, Pharm, and Med-Surg vignettes. The board tests nursing surveillance, patient teaching, and when to hold and notify.",
  ],
  concepts: [
    "Warfarin: monitor INR; therapeutic typically 2–3 for most indications; hold and notify for supratherapeutic INR or bleeding",
    "Warfarin teaching: consistent vitamin K intake, report bleeding, avoid NSAIDs without MD approval, medic alert bracelet",
    "Heparin/LMWH: aPTT or anti-Xa per protocol; monitor platelets for HIT (type II) — stop heparin if suspected",
    "DOACs (apixaban, rivaroxaban, dabigatran): no routine INR; renal dosing; bleeding risk; reversal agents per protocol (idarucizumab, andexanet)",
    "Protamine sulfate reverses heparin — not for warfarin or DOACs",
    "Vitamin K (phytonadione) for warfarin reversal — slow effect; FFP/PCC for acute major bleeding per order",
    "Fall precautions and soft toothbrush for all anticoagulated patients",
    "Neuraxial anesthesia precautions with anticoagulants — know hold times per institutional policy",
  ],
  clinical: [
    "Patient on warfarin with INR 5.2 and nosebleed — hold warfarin, assess bleeding, notify provider, vitamin K per order",
    "Enoxaparin patient with platelets dropped from 180 to 95 after 5 days — suspect HIT, stop heparin/LMWH, notify provider",
    "Post-op patient on apixaban with large bruise and hemoglobin drop — assess, notify provider, prepare reversal per protocol",
    "Patient asks if they can take ibuprofen for arthritis on warfarin — counsel against without provider approval; bleeding risk",
    "Heparin drip patient with aPTT 120 — hold drip, notify provider, recheck per protocol",
  ],
  tables: [
    {
      caption: "Anticoagulant nursing monitoring",
      headers: ["Agent", "Monitor", "Hold/notify triggers"],
      rows: [
        ["Warfarin", "INR, bleeding signs", "INR supratherapeutic, active bleeding"],
        ["Heparin", "aPTT, platelets", "aPTT out of range, HIT suspicion"],
        ["LMWH", "Anti-Xa if ordered, platelets", "Renal failure dose adjust, bleeding"],
        ["DOACs", "Renal function, bleeding", "Active hemorrhage, need for reversal"],
      ],
    },
    {
      caption: "Reversal pearls (per order)",
      headers: ["Anticoagulant", "Reversal"],
      rows: [
        ["Heparin", "Protamine sulfate"],
        ["Warfarin", "Vitamin K ± FFP/PCC"],
        ["Dabigatran", "Idarucizumab"],
        ["Apixaban/Rivaroxaban", "Andexanet alfa (when available/per protocol)"],
      ],
    },
  ],
  visual: [
    "Bleeding assessment checklist: gums, urine, stool, bruises, neuro changes",
    "HIT timeline: heparin day 5–10 platelet drop fork",
    "INR action ladder: therapeutic → elevated → bleeding",
  ],
  misconceptions: [
    "Using protamine for warfarin overdose",
    "Continuing heparin when platelets fall >50% from baseline with HIT suspicion",
    "Assuming DOACs need no bleeding precautions because INR is not monitored",
    "Administering IM injections in anticoagulated patients when avoidable",
  ],
  pearls: [
    "Any anticoagulant + antiplatelet = additive bleeding — teach fall prevention",
    "Green leafy vegetables affect warfarin — consistency matters more than avoidance",
    "Hold heparin before lumbar puncture per protocol — neuraxial hematoma risk",
  ],
  summary: [
    "Match monitoring to agent: INR for warfarin, aPTT/anti-Xa for heparin, renal/bleeding for DOACs",
    "HIT = stop heparin, never rechallenge",
    "Reversal agents are drug-specific — protamine is for heparin only",
    "Teach bleeding signs and fall precautions on every anticoagulant",
  ],
});

export const CARDIOVASCULAR_MEDS_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Cardiovascular pharmacology NCLEX items focus on nursing actions before and after meds — BP checks before nitro, potassium with diuretics, hold beta-blockers when HR too low, and digoxin toxicity signs.",
  ],
  concepts: [
    "ACE inhibitors/ARBs: monitor BP, potassium, creatinine; cough with ACE → may switch to ARB; teratogenic — pregnancy test/contraception counseling",
    "Beta-blockers: hold if HR <60 or SBP <100 per order; never stop abruptly post-MI; mask hypoglycemia tremor",
    "Calcium channel blockers: peripheral edema (dihydropyridines); constipation; avoid grapefruit with some agents",
    "Loop/thiazide diuretics: hypokalemia, orthostatic hypotension; give in AM to reduce nocturia; daily weights with HF",
    "Nitrates: check BP before each dose; headache common; tolerance with continuous use — nitrate-free interval",
    "Digoxin: hold and notify for HR <60, new arrhythmias, vision changes (yellow halos); hypokalemia increases toxicity",
    "Statins: muscle pain → rhabdo risk; liver enzymes baseline; take evening for some agents",
    "Antiplatelets (aspirin, clopidogrel): bleeding precautions; hold before surgery per surgeon/order",
  ],
  clinical: [
    "HF patient on furosemide and digoxin with K⁺ 3.0 — replace K⁺, hold digoxin until K⁺ corrected, monitor ECG",
    "Chest pain patient BP 88/50 before nitroglycerin — hold nitro, elevate legs, notify provider",
    "Post-MI patient wants to stop metoprolol because tired — teach not to stop abruptly; notify provider for evaluation",
    "Patient on lisinopril with dry cough — notify provider; may need ARB switch",
    "Patient on atorvastatin with severe muscle pain and dark urine — hold statin, notify provider, assess for rhabdomyolysis",
  ],
  tables: [
    {
      caption: "High-alert CV med checks",
      headers: ["Medication", "Before giving", "Monitor"],
      rows: [
        ["Nitroglycerin", "BP", "BP, headache, pain relief"],
        ["Metoprolol", "HR, BP", "HR, BP, fatigue"],
        ["Furosemide", "K⁺ if available", "I&O, weight, K⁺, BP"],
        ["Digoxin", "HR/apical pulse 1 min", "HR, K⁺, vision, toxicity signs"],
        ["Insulin (if on board)", "Blood glucose", "Glucose, hypoglycemia signs"],
      ],
    },
  ],
  visual: [
    "Nitro safety: BP check → give → reassess pain in 5 min",
    "Digoxin toxicity triad: GI + vision + arrhythmia",
    "Beta-blocker hold parameters: HR and BP thresholds",
  ],
  misconceptions: [
    "Giving nitroglycerin with SBP <90",
    "Stopping beta-blocker abruptly after MI",
    "Ignoring hypokalemia in patient on digoxin and diuretic",
    "Crushing extended-release antihypertensives",
  ],
  pearls: [
    "Apical pulse full minute before digoxin — irregular rhythm may mean hold",
    "ACE inhibitor + K-sparing diuretic = hyperkalemia risk",
    "Right-sided HF: cautious with aggressive diuresis",
  ],
  summary: [
    "Always check BP before nitro; HR before beta-blockers and digoxin",
    "Diuretics deplete K⁺ — monitor especially with digoxin",
    "Never abrupt beta-blocker stop post-MI",
    "Teach bleeding precautions with antiplatelets",
  ],
});

export const ANTIBIOTICS_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Anti-infective NCLEX items test culture timing, allergy cross-reactivity, C. diff precautions, IV abx monitoring, and when to hold nephrotoxic agents — not pharmacy spectrum memorization alone.",
  ],
  concepts: [
    "Obtain blood cultures before antibiotics when sepsis suspected — do not delay antibiotics in severe sepsis per protocol",
    "Penicillin allergy: clarify reaction type; true anaphylaxis vs rash; cephalosporin cross-reactivity lower with newer generations",
    "Vancomycin: red man syndrome with rapid infusion — slow rate; trough levels per protocol; nephrotoxicity monitoring",
    "Aminoglycosides: peak/trough; nephrotoxicity and ototoxicity — avoid with other nephrotoxins when possible",
    "Fluoroquinolones: tendon rupture risk; QT prolongation; avoid in pregnancy; C. diff risk",
    "Metronidazole: no alcohol (disulfiram reaction); metallic taste; C. diff treatment",
    "C. diff: contact precautions; soap-and-water hand hygiene; oral vancomycin or fidaxomicin per order — not IV vancomycin for CDI",
    "Finish prescribed course teaching; do not save antibiotics; probiotic timing per provider guidance",
  ],
  clinical: [
    "Sepsis patient — blood cultures then broad-spectrum antibiotics within 1 hour per sepsis bundle",
    "Patient on IV vancomycin with flushing and hypotension during infusion — stop/slow infusion, notify provider",
    "Patient on clindamycin with watery diarrhea and fever — C. diff precautions, stool toxin, notify provider",
    "Patient with penicillin allergy rash only — clarify history before automatically avoiding all beta-lactams",
    "Patient on gentamicin and furosemide — monitor renal function and hearing; notify provider of synergistic nephrotoxicity",
  ],
  tables: [
    {
      caption: "Antibiotic nursing priorities",
      headers: ["Scenario", "First nursing action"],
      rows: [
        ["Suspected sepsis", "Cultures then antibiotics per bundle"],
        ["C. diff diarrhea", "Contact precautions + notify provider"],
        ["Vancomycin rapid infusion reaction", "Stop/slow infusion, support BP"],
        ["New rash on antibiotic", "Hold med, notify provider, assess airway"],
      ],
    },
  ],
  visual: [
    "Sepsis bundle: lactate, cultures, antibiotics, fluids timeline",
    "C. diff precaution stack: contact + bleach cleaning + hand washing",
    "Culture before abx fork — unless immediate life threat delay",
  ],
  misconceptions: [
    "Using alcohol hand gel alone after C. diff care",
    "IV vancomycin for C. diff colitis (does not reach colon lumen)",
    "Delaying antibiotics indefinitely waiting for perfect culture data in septic shock",
    "Assuming all penicillin allergies mean cephalosporin contraindication",
  ],
  pearls: [
    "Red man syndrome is infusion rate — not true allergy necessarily",
    "Monitor WBC and fever curve during abx therapy",
    "Teach patients not to share or hoard antibiotics",
  ],
  summary: [
    "Cultures before abx when feasible; never delay in severe sepsis",
    "C. diff = contact precautions + soap-and-water hands",
    "Monitor vancomycin and aminoglycoside levels and renal function",
    "Assess allergy history precisely before charting",
  ],
});

export const PSYCHOTROPICS_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Psychotropic NCLEX items combine therapeutic communication with adverse effect monitoring — EPS with antipsychotics, serotonin syndrome, lithium toxicity, MAOI diet restrictions, and suicide precautions.",
  ],
  concepts: [
    "SSRIs/SNRIs: serotonin syndrome risk with other serotonergic drugs (tramadol, linezolid, MAOIs); GI upset, sexual dysfunction; do not stop abruptly",
    "Antipsychotics: EPS (dystonia, akathisia, parkinsonism, tardive dyskinesia); monitor for NMS (fever, rigidity, autonomic instability)",
    "Lithium: narrow therapeutic index; tremor, polyuria, thirst; toxicity: coarse tremor, ataxia, confusion; maintain hydration and sodium intake",
    "Benzodiazepines: respiratory depression with opioids; fall risk in elderly; taper to avoid withdrawal seizures",
    "MAOIs: tyramine diet (aged cheese, cured meats, tap beer) — hypertensive crisis; washout period when switching antidepressants",
    "Clozapine: agranulocytosis monitoring (ANC); sialorrhea; seizure risk — registered pharmacy program",
    "Suicide risk with new antidepressants — assess and document; do not withhold due to black box alone without monitoring plan",
    "Therapeutic communication trumps medication teaching when patient is acutely suicidal",
  ],
  clinical: [
    "Patient on fluoxetine + tramadol with agitation, hyperthermia, clonus — serotonin syndrome; stop serotonergic agents, notify provider, cooling and monitoring",
    "Patient on haloperidol with acute neck spasm and oculogyric crisis — EPS dystonia; benztropine/diphenhydramine per order",
    "Lithium level 1.8 with vomiting and ataxia — hold lithium, notify provider, IV fluids per order, seizure precautions",
    "Patient on phenelzine ate aged cheese — hypertensive crisis symptoms; notify provider immediately",
    "New antidepressant patient states worsening suicidal ideation — direct assessment, safety precautions, notify provider same day",
  ],
  tables: [
    {
      caption: "Psych med adverse effects to monitor",
      headers: ["Class", "Watch for"],
      rows: [
        ["SSRI/SNRI", "Serotonin syndrome, bleeding with anticoagulants"],
        ["Antipsychotic", "EPS, NMS, metabolic syndrome, QT prolongation"],
        ["Lithium", "Tremor, toxicity, renal/thyroid changes"],
        ["Benzodiazepine", "Sedation, falls, respiratory depression with opioids"],
        ["MAOI", "Hypertensive crisis with tyramine"],
      ],
    },
  ],
  visual: [
    "Serotonin syndrome triad: mental status + autonomic + neuromuscular",
    "EPS types: dystonia (acute) vs tardive dyskinesia (late)",
    "Lithium toxicity ladder: fine tremor → coarse → neuro toxicity",
  ],
  misconceptions: [
    "Stopping lithium abruptly when patient feels better",
    "Missing serotonin syndrome because only one SSRI is involved",
    "Allowing tyramine foods on MAOI without teaching",
    "Removing suicide precautions when patient 'promises' to feel better",
  ],
  pearls: [
    "Lithium interacts with NSAIDs and dehydration — teach sick-day hydration",
    "Antipsychotic EPS often responds to anticholinergic per order — report early",
    "Black box on antidepressants means monitor, not withhold without plan",
  ],
  summary: [
    "Monitor EPS, serotonin syndrome, lithium toxicity, MAOI diet",
    "Suicide assessment is direct and documented",
    "Benzodiazepines + opioids = respiratory depression risk",
    "Therapeutic communication before teaching when acutely distressed",
  ],
});

export const DRUG_INTERACTIONS_ANTIDOTES_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Interaction and antidote items appear in high-acuity scenarios — opioid overdose, warfarin bleeding, digoxin toxicity, acetaminophen overdose, and serotonin syndrome. NCLEX tests the FIRST nursing action and correct antidote matching.",
  ],
  concepts: [
    "Naloxone: opioid reversal — titrate to respiratory effort, not full wakefulness; shorter half-life than many opioids — reassess and repeat",
    "Vitamin K / FFP / PCC: warfarin reversal per bleeding severity",
    "Digoxin immune Fab (Digibind): digoxin toxicity with life-threatening arrhythmia or K⁺ >5.5 with digoxin toxicity",
    "Acetylcysteine (NAC): acetaminophen overdose within 8–24 h window — notify poison control/provider immediately",
    "Flumazenil: benzodiazepine reversal — seizure risk in chronic BZD users; rarely first-line vs supportive care",
    "Serotonin syndrome: stop serotonergic drugs, supportive care, cyproheptadine per order in severe cases",
    "Heparin overdose: protamine sulfate — 1 mg per 100 units heparin approx (max dose limits per protocol)",
    "Insulin + oral hypoglycemic + missed meal = hypoglycemia — 15-15 rule",
  ],
  clinical: [
    "RR 4, pinpoint pupils, unresponsive on morphine — naloxone per protocol, airway support, repeat naloxone as needed",
    "Digoxin toxicity with K⁺ 6.0 and junctional rhythm — hold digoxin, notify provider, Digibind per order",
    "Single large acetaminophen ingestion 4 hours ago — NAC protocol, poison control, liver enzymes",
    "Patient on warfarin with intracranial bleed — emergent reversal per protocol, neuro checks, hold warfarin",
    "Linezolid + SSRI with hyperreflexia and fever — stop both, notify provider, cooling and monitoring",
  ],
  tables: [
    {
      caption: "High-yield antidotes",
      headers: ["Toxin/overdose", "Antidote/support"],
      rows: [
        ["Opioid", "Naloxone + airway"],
        ["Warfarin major bleed", "Vitamin K ± PCC/FFP"],
        ["Digoxin life-threatening", "Digoxin immune Fab"],
        ["Acetaminophen", "N-acetylcysteine"],
        ["Heparin", "Protamine sulfate"],
        ["Beta-blocker overdose", "Glucagon (per protocol)"],
        ["Methotrexate toxicity", "Leucovorin"],
      ],
    },
  ],
  visual: [
    "Opioid overdose response: airway → naloxone titrate → monitor re-sedation",
    "Acetaminophen timeline: ingestion time → NAC window",
    "Interaction triage: stop offending agents → support ABC → specific antidote",
  ],
  misconceptions: [
    "Large bolus naloxone causing acute withdrawal seizure in dependent patient",
    "Giving flumazenil routinely in unknown overdose",
    "Delaying NAC waiting for symptomatic liver failure",
    "Digibind for all digoxin patients regardless of severity",
  ],
  pearls: [
    "Naloxone duration shorter than many opioids — monitor for re-sedation",
    "Know institution poison control number — acetaminophen is time-sensitive",
    "Serotonin syndrome is clinical diagnosis — stop drugs first",
  ],
  summary: [
    "Match antidote to toxin — naloxone, vitamin K/PCC, Digibind, NAC, protamine",
    "Airway and circulation before antidote when respiration compromised",
    "Titrate naloxone to breathing",
    "Stop interacting serotonergic drugs in serotonin syndrome",
  ],
});

export const IV_FLUIDS_BLOOD_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "IV fluid and blood product items test type selection nursing judgment, transfusion reaction response, and electrolyte replacement safety — especially potassium chloride never IV push.",
  ],
  concepts: [
    "Isotonic crystalloids (NS, LR): expansion for hypovolemia; monitor for fluid overload in HF/renal patients",
    "Hypotonic fluids (D5W, 0.45% NaCl): free water; risk hyponatremia if given too fast — monitor mental status",
    "Hypertonic saline: severe symptomatic hyponatremia in ICU settings — slow correction",
    "Blood transfusion: two nurses verify patient/blood product; baseline vitals; stay with patient first 15 minutes",
    "Transfusion reaction: stop transfusion first, keep IV line open with NS, notify provider, return blood to bank",
    "Febrile non-hemolytic vs allergic vs acute hemolytic — all stop transfusion; hemolytic is emergency",
    "KCl IV: never IV push; max peripheral concentration and rate per policy; cardiac monitor",
    "Packed RBCs: treat symptomatic anemia; T&S/T&C before elective surgery",
  ],
  clinical: [
    "During PRBC transfusion patient develops chills, hypotension, back pain — stop transfusion, NS line, notify provider, send blood to lab",
    "KCl 40 mEq/L running peripheral with burning — check rate/concentration per policy; may need central line for higher concentrations",
    "HF patient receiving NS bolus for hypotension — reassess need; monitor lungs and JVD for overload",
    "Post-op oliguric patient getting aggressive fluid — assess volume status before continuing boluses",
    "Patient with Hgb 6.8 symptomatic — transfuse per order; monitor vitals during and after",
  ],
  tables: [
    {
      caption: "Transfusion reaction — first actions",
      headers: ["Sign", "Action"],
      rows: [
        ["Fever/chills during transfusion", "Stop transfusion, notify, VS, return unit"],
        ["Urticaria mild", "Stop/slow per protocol, antihistamine per order"],
        ["Hypotension + back pain + dark urine", "Stop immediately — hemolytic emergency"],
        ["Shortness of breath + crackles", "Stop — possible TACO; diurese per order"],
      ],
    },
  ],
  visual: [
    "Transfusion safety: verify ×2 → baseline VS → stay 15 min → ongoing VS",
    "Fluid type fork: hypovolemic vs HF vs hyponatremia",
    "KCl never push banner",
  ],
  misconceptions: [
    "Continuing transfusion when patient has acute hemolytic symptoms",
    "IV push potassium in code situation without protocol",
    "Using D5W alone for hypovolemic shock resuscitation",
    "Skipping two-nurse verification on blood products",
  ],
  pearls: [
    "First action in transfusion reaction is always stop the blood",
    "TACO vs TRALI both present with respiratory distress during/after transfusion — notify immediately",
    "Daily weights guide fluid therapy in HF and renal patients",
  ],
  summary: [
    "Stop transfusion first for any reaction sign",
    "Two-nurse verify blood products",
    "Never IV push KCl",
    "Match fluid type to clinical need and comorbidities",
  ],
});

export const DOSAGE_CALC_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Dosage calculation items are scored pass/fail on NCLEX — weight-based mg/kg, mL/hr drip rates, reconstitution, and unit conversions (lb to kg) appear under Pharmacological Therapies and Reduction of Risk Potential.",
  ],
  concepts: [
    "Always convert weight to kg for weight-based dosing: lb ÷ 2.2 = kg",
    "Desired/over available × quantity = mL to give (oral/IM/IV bolus)",
    "Drip rate mL/hr = (total mL × drop factor) / minutes — or use formula total volume / hours",
    "mcg/min to mL/hr: convert patient weight and concentration carefully — double-check units",
    "Reconstitution: add diluent volume to vial concentration — label final concentration",
    "Rounding: oral liquids often to tenths; IV pumps often whole mL/hr per policy",
    "Maximum safe dose checks — pediatric acetaminophen mg/kg limits",
    "Right drug concentration: U-100 vs U-500 insulin; heparin units vs mg",
  ],
  clinical: [
    "Order: 0.05 mg/kg morphine IV for 88 lb child — convert 88 lb = 40 kg → 2 mg dose; verify concentration vial",
    "1000 mL NS over 8 hours — 125 mL/hr pump rate",
    "Heparin drip 25,000 units in 250 mL — units per mL = 100 units/mL for programming checks",
    "Reconstitute 500 mg vial with 10 mL diluent — concentration 50 mg/mL; calculate volume for ordered dose",
    "Insulin 10 units from U-100 (100 units/mL) — 0.1 mL in syringe — verify with independent double-check",
  ],
  tables: [
    {
      caption: "Unit conversion pearls",
      headers: ["Convert", "Formula"],
      rows: [
        ["lb → kg", "÷ 2.2"],
        ["kg → lb", "× 2.2"],
        ["g → mg", "× 1000"],
        ["mg → mcg", "× 1000"],
      ],
    },
  ],
  visual: [
    "D/H × Q formula box",
    "Insulin syringe unit tick marks for U-100",
    "Pump programming checklist: patient, drug, concentration, rate, route",
  ],
  misconceptions: [
    "Using patient weight in pounds directly in mg/kg formula",
    "Confusing mg with mL on syringe",
    "Wrong insulin concentration (U-500 vs U-100)",
    "Rounding up pediatric doses beyond safe maximum",
  ],
  pearls: [
    "NCLEX gives metric — if lb given, convert first",
    "When two answers close, recheck unit cancellation",
    "Independent double-check high-alert drips and insulin",
  ],
  summary: [
    "Convert to kg before weight-based dosing",
    "D/H × Q for volume; volume/hours for mL/hr",
    "Verify concentration especially insulin and heparin",
    "Double-check pump programming before start",
  ],
});

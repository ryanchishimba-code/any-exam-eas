import { buildNclexReviewModule } from "./nclex-module-builder";

export const CARDIOVASCULAR_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Cardiovascular items are among the highest-acuity NCLEX vignettes — chest pain, heart failure, dysrhythmias, and anticoagulant safety appear across Management of Care, Pharmacological Therapies, and Physiological Adaptation. First-attempt passers recognize subtle ACS presentations and know which nursing action comes before teaching or documentation.",
    "NCLEX traps you with two correct actions: nitroglycerin is right, but checking blood pressure is FIRST. ECG is right, but calling the provider before aspirin is wrong when protocol allows nurse-initiated aspirin.",
  ],
  concepts: [
    "ACS presentation: substernal pressure, radiation to jaw/arm/back, diaphoresis, nausea, dyspnea — women and diabetics may have atypical symptoms",
    "ACS nursing sequence: continuous monitoring, 12-lead ECG within 10 minutes, IV access, troponin, oxygen only if SpO₂ below goal, aspirin unless contraindicated",
    "Nitroglycerin: check BP before each dose; hold if SBP <90; contraindicated with recent PDE5 inhibitor (sildenafil 24 h, tadalafil 48 h)",
    "Heart failure exacerbation: daily weights, strict I&O, lung sounds, JVD, peripheral edema, orthopnea — weight gain 2–3 lb/day signals fluid retention",
    "HF meds nursing surveillance: loop diuretics → hypokalemia, orthostatic hypotension; ACE inhibitors → cough, hyperkalemia, angioedema; beta-blockers → bradycardia, fatigue — never stop abruptly",
    "Anticoagulants: fall precautions, bleeding assessment (hematuria, melena, large bruises), no NSAID duplication without order; warfarin INR monitoring; DOACs — no routine INR but bleeding risk remains",
    "Hypertensive emergency: end-organ damage (neuro, renal, cardiac, retinal) — IV antihypertensive per protocol, continuous monitoring",
    "Dysrhythmias: symptomatic bradycardia → atropine per ACLS; pulseless VT/VF → CPR and defibrillation; monitor potassium and magnesium in tachyarrhythmias",
  ],
  clinical: [
    "58-year-old with crushing chest pain and diaphoresis — ECG and troponin immediately; do not delay for routine vitals sheet or meal tray",
    "Post-MI patient on nitroglycerin with SBP 82 — hold nitro, elevate legs if hypotensive, notify provider",
    "HF patient gained 4 lb in 2 days with crackles — assess lungs, restrict sodium/fluids per order, notify provider for diuretic adjustment",
    "Patient on warfarin with INR 4.8 and gum bleeding — hold warfarin per order, assess for fall or new meds, notify provider",
    "New-onset atrial fibrillation with HR 142 and hypotension — continuous monitoring, notify provider; anticoagulation decision is provider-driven but bleeding teaching starts now",
    "Right-sided HF: JVD, hepatomegaly, peripheral edema — cautious diuresis; fluid restriction may be needed",
    "Post-cardiac catheterization: monitor insertion site, distal pulses, neurovascular checks, hydration per protocol",
  ],
  tables: [
    {
      caption: "ACS vs stable angina — nursing priorities",
      headers: ["Finding", "ACS action", "Stable angina action"],
      rows: [
        ["Crushing pain + diaphoresis", "ECG, troponin, monitor, aspirin per protocol", "Assess, nitro, notify if unrelieved"],
        ["ST elevation on ECG", "Prepare for reperfusion; time is muscle", "Not expected — treat as ACS"],
        ["Pain after nitro x3", "Notify provider; morphine per order if indicated", "Rest, repeat nitro per protocol"],
      ],
    },
    {
      caption: "Heart failure daily monitoring",
      headers: ["Assessment", "Why it matters"],
      rows: [
        ["Daily weight same scale/time", "Earliest sign of fluid retention"],
        ["Lung sounds / crackles", "Pulmonary edema developing"],
        ["JVD + peripheral edema", "Right-sided failure / volume overload"],
        ["Orthopnea / PND", "Left-sided failure symptoms"],
      ],
    },
  ],
  visual: [
    "ACS timeline: symptom onset → ECG → troponin → reperfusion window",
    "HF exacerbation ladder: weight gain → crackles → O₂ need → ICU transfer",
    "Nitroglycerin safety fork: check BP → give → reassess pain in 5 min",
    "Anticoagulant bleeding checklist: gums, urine, stool, bruises, neuro changes",
  ],
  misconceptions: [
    "Giving nitroglycerin without checking blood pressure first",
    "Delaying ECG to complete admission paperwork",
    "Stopping beta-blockers abruptly when patient feels tired",
    "Assuming all chest pain is anxiety without ECG in acute presentation",
    "Giving aspirin before hemorrhagic stroke is ruled out in acute neuro presentation",
  ],
  pearls: [
    "Silent MI common in diabetics — maintain high suspicion with nausea, fatigue, dyspnea",
    "Morphine for ACS pain only after nitro and only per protocol — not first-line over ABC",
    "Daily weight is the single most sensitive HF trend indicator at home and in hospital",
    "Troponin may be normal early — serial troponins and ECG changes matter",
  ],
  summary: [
    "ACS: ECG fast, monitor continuously, aspirin per protocol, nitro after BP check",
    "HF: daily weights, I&O, lung sounds, potassium with diuretics",
    "Anticoagulants: bleeding surveillance and fall prevention every shift",
    "Trap answers are correct nursing actions at the wrong time — rank by ABC and acuity",
  ],
});

export const RESPIRATORY_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Respiratory NCLEX items test whether you can match oxygen delivery to patient need without causing harm — especially in COPD, asthma, and post-op patients. Impending respiratory failure is a see-first scenario: silent chest and fatigue beat stable chronic findings.",
    "Pharmacological Therapies overlaps heavily here — bronchodilators, steroids, and oxygen titration appear together with Physiological Adaptation vignettes.",
  ],
  concepts: [
    "COPD with chronic hypercapnia: target SpO₂ 88–92% per order — not 100%; monitor mental status for CO₂ retention",
    "Asthma exacerbation: albuterol first-line; systemic steroids for moderate-severe; peak flow when able",
    "Silent chest + fatigue in asthma = impending respiratory failure — prepare for assisted ventilation, notify provider immediately",
    "Pulmonary embolism suspicion: sudden dyspnea, pleuritic chest pain, tachycardia, hypoxia — notify provider, prepare diagnostics, anticoagulation per order",
    "Pneumonia: fever, productive cough, crackles, infiltrate — antibiotics per order, O₂, incentive spirometry, fluid support",
    "Chest tube nursing: water seal, tidaling, absence of tidaling may mean obstruction; sudden cessation of bubbling may mean re-expansion — know agency protocol",
    "Post-op atelectasis prevention: incentive spirometry q1h awake, early ambulation, splinting, pain control for deep breathing",
    "Endotracheal tube care: cuff pressure checks, oral care, securement, suction only when indicated — hyperoxygenate before suctioning per protocol",
  ],
  clinical: [
    "COPD patient SpO₂ 99% on 6 L NC with somnolence — reduce O₂ per order, assess mental status, prepare ABG if ordered",
    "Asthma patient speaking in word phrases with silent chest — call for help, prepare epinephrine/bronchodilator protocol, do not leave unattended",
    "Post-op day 1 with temp 101.8°F, crackles, SpO₂ 89% — O₂, incentive spirometry, notify provider for pneumonia workup",
    "Sudden dyspnea after orthopedic surgery with unilateral leg swelling — PE workup priority over routine pain med",
    "Chest tube to suction with continuous bubbling at drain — assess for air leak vs expected drainage per protocol",
    "Sleep apnea patient post-op on opioids — continuous pulse oximetry and sedation scoring per policy",
  ],
  tables: [
    {
      caption: "Oxygen delivery selection",
      headers: ["Device", "FiO₂ range", "NCLEX pearl"],
      rows: [
        ["Nasal cannula", "24–44%", "Comfort; not for severe distress alone"],
        ["Simple mask", "~35–55%", "Moderate hypoxemia"],
        ["Non-rebreather", "~60–90%", "Acute severe hypoxemia; COPD caution"],
        ["High-flow NC", "Precise FiO₂", "Heated humidified; ICU settings"],
      ],
    },
    {
      caption: "Asthma severity cues",
      headers: ["Mild", "Moderate-severe", "Impending failure"],
      rows: [
        ["Speaks sentences", "Speaks phrases", "Words only or silent"],
        ["Peak flow >70%", "Peak flow 40–70%", "Peak flow <40% or unable"],
        ["Albuterol PRN", "Albuterol + systemic steroid", "Prepare assisted ventilation"],
      ],
    },
  ],
  visual: [
    "COPD O₂ target: 88–92% zone vs hypoxic vs over-oxygenated branches",
    "Asthma escalation ladder: SABA → repeat → steroid → assist ventilation",
    "PE suspicion triad: dyspnea + tachycardia + hypoxia → act",
    "Post-op lung expansion bundle: IS + ambulation + pain control",
  ],
  misconceptions: [
    "Targeting 100% SpO₂ in all patients regardless of COPD history",
    "Sedating anxious COPD patient without monitoring ventilation",
    "Assuming wheezing must be present in severe asthma — silent chest is ominous",
    "Removing chest tube clamp without provider order",
    "Delaying PE workup until 'classic' findings all present",
  ],
  pearls: [
    "Accessory muscle use and inability to speak full sentences = severe respiratory distress",
    "Tripod position signals increased work of breathing — prioritize over routine tasks",
    "Pulse ox can be falsely normal with carbon monoxide exposure",
    "Pursed-lip breathing helps COPD patients — teach and reinforce",
  ],
  summary: [
    "COPD: controlled O₂, watch mental status, not 100% saturation",
    "Asthma: silent chest + fatigue = emergency",
    "PE: sudden dyspnea + tachycardia — do not wait for classic triad completeness",
    "Post-op: incentive spirometry and ambulation prevent atelectasis",
  ],
});

export const DIABETES_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Diabetes spans Pharmacological Therapies (insulin, oral agents), Physiological Adaptation (DKA, HHS), and Safety (hypoglycemia, high-alert meds). NCLEX heavily tests insulin safety, sick-day rules, and the nursing sequence in DKA — fluids before insulin when potassium is low.",
    "Medication errors with insulin concentration (U-100 vs U-500) and holding basal insulin incorrectly when NPO are classic board traps.",
  ],
  concepts: [
    "Hypoglycemia <70 mg/dL: 15 g fast-acting carbohydrate, recheck in 15 min, repeat if needed, complex snack if next meal not soon — never leave patient unattended",
    "Severe hypoglycemia: glucagon IM/SC or intranasal glucagon if unable to swallow — notify provider",
    "DKA: polyuria, polydipsia, Kussmaul respirations, fruity breath, ketones — IV fluids first, insulin drip after K⁺ verified >3.3 mEq/L",
    "HHS: extreme hyperglycemia, profound dehydration, altered mental status in type 2 — aggressive fluids; insulin adjustments slower than DKA",
    "Insulin types: rapid (lispro, aspart) with meals; basal (glargine, detemir, degludec) no peak mixing rules — check glucose before every dose",
    "Sick-day rules: never stop insulin entirely; monitor glucose and ketones; hydrate; call provider for persistent vomiting or glucose >250 mg/dL with ketones",
    "NPO guidelines: basal insulin often reduced not stopped — follow provider/institutional protocol; check glucose frequently",
    "Foot care: daily inspection, monofilament testing, proper footwear, never barefoot — prevent ulcer and amputation",
  ],
  clinical: [
    "Patient diaphoretic, glucose 54 mg/dL, alert — 15 g glucose, recheck 15 min, notify provider if not improving",
    "DKA patient K⁺ 2.9 — hold insulin, replace potassium per order before starting insulin drip",
    "Type 1 patient NPO for procedure — follow basal-bolus adjustment protocol; do not hold all insulin without order",
    "Patient on beta-blocker reports shakiness absent but glucose 58 — treat hypoglycemia; beta-blockers mask tremor",
    "Post-op patient on sliding scale only with glucose 280 mg/dL fasting — notify provider; basal insulin may be needed",
    "Patient mixing glargine and rapid insulin in same syringe — stop; teach separate injections",
  ],
  tables: [
    {
      caption: "DKA vs HHS — nursing priorities",
      headers: ["Feature", "DKA", "HHS"],
      rows: [
        ["Typical patient", "Type 1, younger", "Type 2, older"],
        ["Glucose", "High", "Very high (>600 common)"],
        ["Ketones", "Present", "Minimal/absent"],
        ["Dehydration", "Significant", "Severe"],
        ["Mental status", "Alert to confused", "Often altered/stuporous"],
        ["Insulin", "After K⁺ OK", "Slower adjustment"],
      ],
    },
    {
      caption: "Insulin nursing checks",
      headers: ["Check", "Why"],
      rows: [
        ["Blood glucose before dose", "Prevent hypoglycemic administration"],
        ["Concentration U-100 vs U-500", "Fatal dosing error prevention"],
        ["Injection site rotation", "Lipodystrophy affects absorption"],
        ["Meal timing with rapid insulin", "Hypoglycemia if meal delayed"],
      ],
    },
  ],
  visual: [
    "15-15 hypoglycemia loop: treat → wait 15 min → recheck → snack",
    "DKA treatment sequence: fluids → K⁺ check → insulin → hourly glucose/K⁺ early",
    "Basal-bolus clock: basal steady + rapid with meals",
    "Sick-day flowchart: test glucose/ketones → hydrate → call if vomiting/persistent hyperglycemia",
  ],
  misconceptions: [
    "Giving insulin to patient who has not eaten with normal-low glucose",
    "Stopping all insulin when patient is NPO without provider order",
    "Starting insulin in DKA before potassium is safe",
    "Assuming sliding scale alone is adequate inpatient glycemic control",
    "Mixing glargine with other insulins in one syringe",
  ],
  pearls: [
    "Morning hyperglycemia: dawn phenomenon (needs basal adjustment) vs Somogyi (nocturnal hypo then rebound)",
    "Beta-blockers mask hypoglycemia tremor — teach increased glucose monitoring",
    "DKA insulin drives K⁺ into cells — watch for precipitous K⁺ drop after fluids and insulin start",
    "Always use two identifiers and independent double-check for insulin when policy requires",
  ],
  summary: [
    "Hypoglycemia: 15-15 rule; glucagon if unable to swallow",
    "DKA: fluids first; insulin only after K⁺ safe",
    "Check glucose before every insulin dose — high-alert med",
    "Sick-day rules: never stop insulin entirely; monitor ketones",
  ],
});

export const RENAL_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Renal and fluid balance questions integrate Reduction of Risk Potential (labs, I&O), Physiological Adaptation (AKI, dialysis), and Pharmacological Therapies (electrolyte replacements, nephrotoxic drugs). NCLEX rewards nurses who trend weights and urine output rather than reacting to a single lab value.",
    "Dialysis access complications and hyperkalemia in renal failure are see-first scenarios when ECG changes appear.",
  ],
  concepts: [
    "Daily weights: same scale, time, clothing — 1 kg gain ≈ 1 L fluid retention",
    "AKI phases: prerenal (hypovolemia), intrinsic (ATN), postrenal (obstruction) — nursing focuses on perfusion, nephrotoxin hold, electrolytes",
    "Oliguria: urine output <0.5 mL/kg/hr for 6 hours suggests AKI — notify provider, assess hemodynamics",
    "Hemodialysis nursing: monitor hypotension, cramping, access site bleeding; know dry weight goal; post-dialysis weight",
    "AV fistula care: thrill and bruit assessment; no BP or venipuncture in access arm; report loss of thrill",
    "Peritoneal dialysis: sterile technique; cloudy effluent suggests peritonitis — culture per order",
    "Hyperkalemia in renal failure: peaked T waves — cardiac monitor, hold potassium-sparing meds, emergency meds per order",
    "Contrast precautions: hydration per protocol, minimize volume, monitor creatinine after — hold metformin per institutional policy",
  ],
  clinical: [
    "HF patient with 3 kg weight gain in 3 days and crackles — diurese per order, strict I&O, daily weights",
    "Post-contrast patient oliguric with creatinine rising — notify provider, IV fluids per order, hold nephrotoxins",
    "Dialysis patient cramping mid-run with BP 90/60 — slow ultrafiltration per protocol, notify provider",
    "AV fistula arm cool with absent thrill — notify provider immediately — access failure",
    "CKD patient K⁺ 6.4 with widened QRS — continuous monitoring, calcium gluconate per order, prepare kayexalate/insulin-dextrose per protocol",
    "Patient with indwelling catheter and fever — assess for CAUTI; consider removal per protocol",
  ],
  tables: [
    {
      caption: "AKI nursing actions by type",
      headers: ["Type", "Common cause", "First nursing actions"],
      rows: [
        ["Prerenal", "Hypovolemia, hemorrhage", "Restore perfusion; cautious fluids if indicated"],
        ["Intrinsic (ATN)", "Ischemia, nephrotoxins", "Hold NSAIDs, aminoglycosides; monitor I&O"],
        ["Postrenal", "BPH, stones, catheter obstruction", "Assess voiding, catheter patency; notify provider"],
      ],
    },
    {
      caption: "Dialysis access do's and don'ts",
      headers: ["Do", "Don't"],
      rows: [
        ["Assess thrill/bruit daily", "BP or blood draw in fistula arm"],
        ["Keep site clean and dry", "Sleep on access arm"],
        ["Report bleeding or infection", "Remove scab over needle sites prematurely"],
      ],
    },
  ],
  visual: [
    "Fluid volume status triangle: weight + JVD + edema + lung sounds",
    "AKI oliguria decision tree: prerenal vs obstructive vs intrinsic cues",
    "Hyperkalemia ECG progression: peaked T → widened QRS → sine wave",
    "Dialysis hypotension response: slow UF → reposition → saline per order",
  ],
  misconceptions: [
    "Aggressive fluid bolus in oliguric patient without hemodynamic indication",
    "Using edema alone without daily weights and I&O trends",
    "Rapid sodium correction in chronic hyponatremia with renal disease",
    "Assuming anuria is normal post-op without assessment",
    "Blood pressure measurement on AV fistula arm",
  ],
  pearls: [
    "Urine output trend beats single I&O value — graph it mentally",
    "BUN/creatinine ratio context: prerenal often BUN:Cr >20:1 (approximate pearl)",
    "Cardiorenal syndrome: diurese carefully when kidneys and heart both failing",
    "Metformin held around contrast — know institutional policy for restart timing",
  ],
  summary: [
    "Daily weights are the best fluid trend indicator",
    "AKI: protect kidneys — hold nephrotoxins, monitor K⁺, trend UOP",
    "Dialysis: access surveillance every shift; hypotension is common",
    "Hyperkalemia with ECG changes = emergency response per protocol",
  ],
});

export const NEUROLOGIC_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Neurologic NCLEX items are time-critical — ischemic stroke, hemorrhagic stroke, seizures, and increased ICP all have narrow intervention windows. The board tests whether you obtain CT before thrombolytics, never give aspirin before hemorrhage is ruled out, and trend GCS rather than documenting a single score.",
    "Stroke and seizure questions frequently appear as prioritization traps: two actions are correct, but CT or airway comes first.",
  ],
  concepts: [
    "Ischemic stroke: last known well time; FAST screen; glucose check; CT to exclude hemorrhage before tPA/thrombectomy per protocol (typically within 4.5 h for eligible patients)",
    "Hemorrhagic stroke: sudden worst headache, vomiting, decreased LOC — BP control per order; no antiplatelets until ruled out",
    "Post-tPA monitoring: frequent neuro checks, BP strict parameters, watch for bleeding — follow institutional protocol",
    "Seizure nursing: protect head, time event, suction available, do not restrain or put objects in mouth, post-ictal monitoring",
    "Status epilepticus: continuous or repeated seizures — emergency meds per protocol, airway priority",
    "Increased ICP: worsening headache, vomiting, decreasing LOC, pupil changes — HOB 30°, avoid neck flexion, minimize stimulation, notify provider",
    "Spinal cord injury: maintain spinal precautions until cleared; autonomic dysreflexia in T6+ — sit up, loosen clothes, check bladder/bowel triggers",
    "NIHSS documentation for stroke patients per protocol — nurse role is timing and trending",
  ],
  clinical: [
    "Sudden aphasia and right-sided weakness — last known well, glucose, CT stat, notify stroke team",
    "Seizing patient — turn to side if safe, protect head, time seizure, O₂ if hypoxic, benzodiazepine per order after ABC",
    "Post-head injury GCS drops from 14 to 11 — urgent provider notification, repeat neuro checks q15 min early",
    "Stroke patient BP 210/110 before tPA — notify provider; strict BP parameters for thrombolytics",
    "T6 SCI patient with pounding headache and BP 180/110 — sit up, loosen clothing, check catheter, notify provider — autonomic dysreflexia",
    "Patient post-seizure sleepy but arousable — post-ictal monitoring, safety, not immediate restraint",
  ],
  tables: [
    {
      caption: "Stroke nursing timeline",
      headers: ["Timeframe", "Priority action"],
      rows: [
        ["First minutes", "Last known well, ABC, glucose, FAST"],
        ["Before tPA", "CT excludes hemorrhage; BP within protocol"],
        ["Post-tPA", "Neuro checks, BP control, bleeding watch"],
        ["Hemorrhage ruled out", "Aspirin/antiplatelet per order for ischemic stroke"],
      ],
    },
    {
      caption: "GCS trending — when to escalate",
      headers: ["Change", "Action"],
      rows: [
        ["2-point drop", "Urgent reassessment; notify provider"],
        ["Motor deficit new", "Stroke workup if acute"],
        ["Pupil asymmetry new", "ICP concern; notify immediately"],
      ],
    },
  ],
  visual: [
    "FAST stroke screen: Face droop, Arm weakness, Speech slurred, Time to call",
    "Seizure safety: protect → time → post-ictal → document",
    "ICP positioning: HOB 30°, neutral neck, quiet environment",
    "Autonomic dysreflexia trigger scan: bladder → bowel → skin → pain",
  ],
  misconceptions: [
    "Giving aspirin before CT in acute stroke presentation",
    "Restraining active seizure patient or placing objects in mouth",
    "Flat bed for all neuro patients — ICP often needs HOB elevation",
    "Assuming post-ictal sleep means seizure resolved without monitoring",
    "Missing autonomic dysreflexia by treating headache alone without BP and bladder check",
  ],
  pearls: [
    "Sudden worst headache of life = subarachnoid hemorrhage workup until proven otherwise",
    "New confusion in older adult may be stroke, infection, or hypoglycemia — assess all",
    "Neuro checks q15 min early after decline, then space per protocol",
    "Time last known well — thrombolytics are time-dependent",
  ],
  summary: [
    "Stroke: time last known well; CT before tPA; no aspirin until hemorrhage excluded",
    "Seizure: safety and timing; do not restrain",
    "ICP: HOB 30°, trend pupils and GCS",
    "SCI T6+: autonomic dysreflexia is hypertensive emergency — sit up, find trigger",
  ],
});

export const PAIN_OPIOIDS_NCLEX_MODULE = buildNclexReviewModule({
  why: [
    "Pain and opioid safety items span Basic Care and Comfort, Pharmacological Therapies, and Safety. NCLEX tests multimodal analgesia, PCA rules, and respiratory depression recognition — especially when opioids combine with benzodiazepines or when family wants to press the PCA button.",
    "Respiratory rate <8 with sedation after opioid dose is a see-first scenario that beats reassessing pain score alone.",
  ],
  concepts: [
    "Multimodal analgesia: scheduled acetaminophen, NSAIDs when not contraindicated, regional techniques, non-pharmacologic measures — opioids for moderate-severe pain when benefits outweigh risks",
    "Pain scales: 0–10 numeric; FLACC for infants; PAINAD for dementia — reassess after intervention per policy",
    "Opioid monitoring: respiratory rate, sedation level, SpO₂ — especially first dose, dose increases, elderly, sleep apnea, concomitant sedatives",
    "PCA rules: only the patient presses button — no family proxy; lockout interval prevents overdose; monitor for oversedation",
    "Naloxone: titrate small doses for respiratory depression — avoid acute withdrawal storm in dependent patients",
    "Bowel regimen with opioids: stool softener + stimulant laxative ordered proactively — constipation is expected",
    "Non-pharmacologic: positioning, ice/heat, distraction, relaxation, splinting for incisional pain",
    "ER/CR opioid formulations: never crush — dose dumping and fatal respiratory depression risk",
  ],
  clinical: [
    "Post-op RR 7, difficult to arouse, on PCA morphine — stop PCA, stimulate, naloxone per protocol, notify provider, continuous monitoring",
    "Family asks to press PCA because patient is sleeping — explain only patient may self-administer; assess pain and sedation",
    "Patient on oxycodone with no bowel movement 3 days — implement bowel regimen per order, encourage fluids and ambulation",
    "Chronic pain patient afraid of addiction — validate pain, explain multimodal plan, document functional goals",
    "Elderly patient on opioid + benzodiazepine — heightened sedation risk; lower doses, frequent monitoring",
    "Patient requests pain med q2h PRN but always rates 10/10 — assess location/quality, notify provider for regimen adjustment",
  ],
  tables: [
    {
      caption: "Opioid respiratory depression response",
      headers: ["Finding", "Action"],
      rows: [
        ["RR <8 or unarousable", "Stop opioid, notify provider, naloxone per protocol"],
        ["RR 8–10 with sedation", "Hold next dose, increase monitoring, notify provider"],
        ["Snoring + desaturation on PCA", "Assess arousability; may need naloxone titration"],
      ],
    },
    {
      caption: "Multimodal pain options",
      headers: ["Modality", "NCLEX note"],
      rows: [
        ["Acetaminophen scheduled", "Foundation; watch total daily limit"],
        ["NSAIDs", "Avoid in renal failure, GI bleed, anticoagulation"],
        ["Ice/heat/positioning", "Always appropriate adjunct"],
        ["Opioids", "Monitor RR and sedation every dose early"],
      ],
    },
  ],
  visual: [
    "PCA safety triangle: patient-only button + lockout + sedation monitoring",
    "Opioid monitoring loop: dose → RR/sedation/SpO₂ → hold if thresholds met",
    "Bowel regimen paired with every opioid order",
    "Naloxone titration concept: reverse resp depression without full withdrawal",
  ],
  misconceptions: [
    "Family pressing PCA for sleeping patient",
    "Crushing ER oxycodone for dysphagia without specific order for alternate formulation",
    "Undertreating pain because of addiction fear when multimodal plan is appropriate",
    "Relying on SpO₂ alone while patient is obtunded — RR and sedation score matter",
    "No bowel prophylaxis with new opioid order",
  ],
  pearls: [
    "Pain is what the patient says it is — consistent reassessment required",
    "Tolerance and physical dependence differ from opioid use disorder — avoid undertreating acute surgical pain",
    "Sedation score often detects trouble before SpO₂ drops",
    "Document pain reassessment after every intervention — NCLEX loves continuity",
  ],
  summary: [
    "Multimodal first; opioids with RR and sedation monitoring",
    "PCA: patient only presses; no family proxy dosing",
    "RR <8 with sedation = hold opioid, naloxone per protocol",
    "Bowel regimen with every opioid; never crush ER formulations",
  ],
});

import { defineExamTopics } from "./topic-factory";

export const USMLE_HIGH_YIELD_TOPICS = defineExamTopics("usmle", [
  {
    slug: "cardiovascular",
    category: "Systems",
    title: "Cardiovascular: ACS, HF & Valvular Disease",
    overview:
      "STEMI vs NSTEMI differentiation, heart failure management, and valvular lesion physiology tested in clinical vignette format.",
    summary:
      "Acute coronary syndrome demands rapid risk stratification. STEMI (ST elevation in ≥2 contiguous leads or new LBBB) triggers emergent PCI if door-to-balloon time ≤90 min; fibrinolytics within 12 h if PCI is unavailable within 120 min. NSTEMI/UA: anticoagulate, dual antiplatelet therapy, and risk-stratify with TIMI/GRACE for early invasive vs. conservative strategy. The next best step after recognizing STEMI is activating the cath lab while simultaneously obtaining IV access, oxygen if hypoxic, aspirin, and P2Y12 inhibitor.\n\nHeart failure management hinges on distinguishing reduced ejection fraction (HFrEF) from preserved (HFpEF). HFrEF guideline-directed therapy: ACE inhibitor/ARB or ARNI + beta-blocker + MRA + SGLT2 inhibitor reduce mortality. Acute decompensation: IV diuresis, vasodilators for hypertensive presentations, non-invasive positive pressure ventilation for respiratory distress before intubation. BNP/NT-proBNP confirms the diagnosis and tracks response.\n\nValvular disease: aortic stenosis presents with the classic triad of angina, syncope, and heart failure — median survival after each symptom is 5, 3, and 2 years respectively, signaling urgent valve replacement. Mitral regurgitation with new-onset dyspnea after inferior MI suggests papillary muscle rupture: holosystolic murmur at apex, pulmonary edema, and shock — surgical emergency. Distinguish the innocent murmur from pathologic lesions using radiation, quality, and maneuvers.",
    keyConcepts: [
      "STEMI: door-to-balloon ≤90 min; activate cath lab before full history in obvious cases",
      "NSTEMI: anticoagulation + dual antiplatelet; early invasive if high TIMI score",
      "HFrEF four pillars: ACEI/ARB-ARNI + BB + MRA + SGLT2i for mortality benefit",
      "Acute decompensated HF: IV loop diuretic; avoid hypotension; BiPAP for hypoxia",
      "Aortic stenosis: symptom onset marks inflection in mortality — refer for AVR/TAVR",
      "Papillary muscle rupture post-MI: acute MR, shock, new holosystolic murmur — surgical emergency",
      "Cardiac tamponade: Beck's triad (hypotension, JVD, muffled heart sounds) + pulsus paradoxus >10 mmHg",
      "Long QT drug culprits: fluoroquinolones, macrolides, antipsychotics, antifungals — check baseline QTc",
    ],
    mustKnowFacts: [
      "Cardiogenic shock post-MI: early PCI is the only intervention proven to reduce mortality; vasopressors as bridge",
      "Digoxin toxicity: yellow-green visual halos, bradycardia, and bidirectional VT — withhold and check level; hypokalemia worsens toxicity",
      "Pericarditis: pleuritic chest pain worse supine, improved leaning forward, friction rub — treat with NSAIDs + colchicine; avoid anticoagulants unless pericardial effusion excluded",
    ],
    pearls: [
      "A 55-year-old male with 2 hours of crushing chest pain, diaphoresis, and ST elevation in V1–V4 needs emergent PCI — do not delay for troponin results. The clinical and ECG picture alone meets the threshold for cath lab activation.",
      "A patient with known HFrEF returns with 10 lb weight gain and orthopnea. The next best step is IV furosemide — not increasing oral dose, not echo, not BMP first. Establish IV access and diurese while monitoring electrolytes.",
      "An elderly woman with a systolic murmur radiating to the carotids, exertional syncope, and peak gradient of 55 mmHg on echo has severe AS. Even if 'asymptomatic' by history, syncope is an indication — refer for AVR.",
    ],
    pitfalls: [
      "Withholding beta-blockers in stable HFrEF because of 'heart failure' — they are mortality-reducing; only avoid in acute decompensation",
      "Treating ST elevation in aVR + diffuse ST depression as benign — this pattern suggests left main or proximal LAD occlusion and warrants emergent cath",
    ],
    practiceTopicSlug: "cardiovascular",
  },
  {
    slug: "pulmonary",
    category: "Systems",
    title: "Pulmonary: COPD, Asthma & Pleural Disease",
    overview:
      "Obstructive vs. restrictive patterns, acute exacerbation management, PE workup, and pleural effusion interpretation.",
    summary:
      "COPD exacerbations are managed with bronchodilators, systemic steroids (5-day course equivalent to longer), and antibiotics if increased sputum purulence. NIV (BiPAP) reduces intubation rates and ICU mortality when pH 7.25–7.35 with hypercapnia. Roflumilast for frequent exacerbators with FEV1 <50% and chronic bronchitis phenotype. The step-up approach: LAMA → LAMA+LABA → add ICS only if eosinophils ≥300 or frequent exacerbations. Pursue early palliative integration — dyspnea burden is high.\n\nPulmonary embolism: apply Wells criteria + D-dimer (low probability) or go directly to CT-PA (intermediate-high). Massive PE with hemodynamic compromise: systemic thrombolytics if no absolute contraindications; if contraindicated, surgical embolectomy or catheter-directed therapy. Anticoagulate with LMWH bridging to warfarin or direct oral anticoagulant — rivaroxaban or apixaban are first-line in unprovoked PE.\n\nPleural effusions: Light's criteria distinguish exudate (protein ratio >0.5, LDH ratio >0.6, or absolute LDH >2/3 upper limit) from transudate. Transudates: treat underlying cause (HF, cirrhosis, nephrotic syndrome). Exudates: send pH, glucose, LDH, cytology, culture. pH <7.2 in parapneumonic effusion mandates drainage. Malignant effusion: tunneled pleural catheter or pleurodesis.",
    keyConcepts: [
      "COPD: GOLD staging by FEV1/FVC ratio and symptom burden guides LAMA/LABA/ICS escalation",
      "BiPAP indication: hypercapnic respiratory failure pH 7.25–7.35; contraindicated if unable to protect airway",
      "Wells criteria: score ≥2 → imaging; low probability + negative D-dimer rules out PE",
      "Massive PE: hemodynamic collapse + RV strain → thrombolytics or mechanical therapy",
      "Asthma step-up: PRN SABA → low-dose ICS → ICS+LABA → add LAMA/biologic for severe persistent",
      "Light's criteria: exudate if any one of protein ratio, LDH ratio, or absolute LDH met",
      "Spontaneous pneumothorax: primary (young, tall, thin, smoker) vs secondary (underlying lung disease); tension PTX is a clinical diagnosis — decompress immediately",
    ],
    mustKnowFacts: [
      "Pneumothorax with tracheal deviation, absent breath sounds, and hypotension = tension pneumothorax — needle decompression second intercostal space MCL without waiting for CXR",
      "Interstitial lung disease UIP pattern on CT: honeycombing + basal predominant fibrosis = IPF; nintedanib or pirfenidone slows progression; avoid steroids as primary therapy in IPF",
    ],
    pearls: [
      "A 68-year-old COPD patient presents obtunded with RR 28 and PaCO₂ 72 (pH 7.28). The next best step is BiPAP — not intubation. Intubation is reserved for BiPAP failure or inability to protect airway. BiPAP reduces intubation rates and mortality.",
      "A 35-year-old woman on OCPs develops sudden pleuritic chest pain and tachycardia. Wells score ≥2 → CT-PA. Do not wait for D-dimer when clinical probability is intermediate or high — sensitivity is diminished and delays matter.",
    ],
    pitfalls: [
      "Giving high-flow O₂ to a COPD patient and stopping at SpO₂ 100% — target 88–92% to avoid hypoxic drive suppression and worsen hypercapnia",
      "Draining a transudative pleural effusion without addressing the underlying cause — recurrence is certain without treating HF, cirrhosis, or hypoalbuminemia",
    ],
    practiceTopicSlug: "pulmonary",
  },
  {
    slug: "neurology-stroke",
    category: "Systems",
    title: "Neurology: Stroke, Seizures & Headache",
    overview:
      "Time-sensitive ischemic stroke pathway, hemorrhagic stroke management, seizure classification, and dangerous headache red flags.",
    summary:
      "Ischemic stroke is a medical emergency driven by 'time is brain.' Last known well time anchors decisions: IV tPA within 4.5 hours (with exclusion checklist), mechanical thrombectomy up to 24 hours for large vessel occlusion with salvageable penumbra. Obtain non-contrast CT first to exclude hemorrhage — never give tPA without it. BP management: permissive hypertension (allow up to 220/120) prior to thrombolytics; lower to <185/110 before administration.\n\nHemorrhagic stroke (ICH): reverse anticoagulation immediately, control BP aggressively (target SBP <140 per AHA guidelines), and consider neurosurgical consult for cerebellar hemorrhage >3 cm or herniation. Subarachnoid hemorrhage: thunderclap headache (worst of life, peaks within seconds) → CT head (sensitive within 6 hours) → LP if CT negative (xanthochromia, elevated RBCs). Nimodipine for vasospasm prevention, not acute hemostasis.\n\nEpilepsy management: first unprovoked seizure with normal EEG and MRI — shared decision-making about starting AED. Status epilepticus: lorazepam IV first-line; if no IV access, IM midazolam; move to second-line (fosphenytoin, levetiracetam, valproate) if benzodiazepines fail within 5 minutes. Check glucose in every seizing patient. Post-ictal confusion is expected; new focal deficits post-ictally suggest Todd's paralysis.",
    keyConcepts: [
      "Ischemic stroke: CT head → tPA exclusions → IV tPA ≤4.5 h; LVO → thrombectomy ≤24 h",
      "tPA exclusions: hemorrhage, surgery <14 days, prior stroke <3 months, INR >1.7, platelets <100K",
      "ICH management: reverse coagulopathy (4-factor PCC for warfarin), SBP target <140",
      "SAH: thunderclap headache → CT → LP if negative; nimodipine; aneurysm coiling/clipping",
      "Status epilepticus: lorazepam → fosphenytoin/levetiracetam → propofol/pentobarbital",
      "MG crisis vs cholinergic crisis: both cause weakness; MG worsens with pyridostigmine overdose — edrophonium (Tensilon) test differentiates",
      "Headache red flags: thunderclap, positional, papilledema, fever + stiff neck, new >50 years",
    ],
    mustKnowFacts: [
      "Glucose check in any acute neurologic change — hypoglycemia mimics stroke and seizes; give D50 before MRI if glucose unknown",
      "Wernicke's encephalopathy triad: ophthalmoplegia, ataxia, confusion in malnourished or alcoholic patient — give IV thiamine before glucose to avoid precipitating or worsening encephalopathy",
    ],
    pearls: [
      "A 72-year-old man with atrial fibrillation presents 2 hours after onset of aphasia and right arm weakness. NIHSS = 12. CT is negative for hemorrhage. He is on no anticoagulants. Next best step: check tPA eligibility checklist and administer IV alteplase — not CT-PA, not CTA first, not antiplatelet only.",
      "A 45-year-old woman reports the 'worst headache of my life' that started suddenly while exercising. CT head is negative. The next best step is LP — not discharge or MRI alone. CT sensitivity for SAH decreases from ~98% at 6 hours to ~85% at 24 hours; LP for xanthochromia is mandatory when clinical suspicion is high.",
    ],
    pitfalls: [
      "Giving aspirin or anticoagulants before excluding hemorrhagic stroke on CT — fatal in ICH",
      "Missing Wernicke's by giving dextrose before thiamine in an alcoholic patient with confusion",
    ],
    practiceTopicSlug: "neurology-stroke",
  },
  {
    slug: "gastroenterology",
    category: "Systems",
    title: "GI: Bleeding, IBD & Liver Disease",
    overview:
      "Upper vs. lower GI bleed localization, IBD flare management, and cirrhosis complications including SBP, HRS, and varices.",
    summary:
      "GI bleeding risk stratification precedes endoscopy. Glasgow-Blatchford score identifies upper GI bleeds safe for outpatient management. Hematemesis or coffee-ground emesis → upper GI source; hematochezia usually lower (but can be massive upper GI bleed). Upper GI bleed: resuscitate, PPI drip, octreotide if variceal bleed suspected, urgent EGD within 24 hours (within 12 hours for hemodynamic instability). Blood transfusion threshold Hb <7 g/dL (or <8 in CAD/ACS); restrictive strategy reduces re-bleeding.\n\nCirrhosis complications define management priorities. Spontaneous bacterial peritonitis (SBP): paracentesis with PMN ≥250/mm³ confirms diagnosis — treat with cefotaxime for 5 days; albumin infusion reduces hepatorenal syndrome. Hepatorenal syndrome type 1: rapidly progressive AKI in cirrhosis without another cause; midodrine + octreotide + albumin as bridge to TIPS or transplant. Hepatic encephalopathy: lactulose to 2–3 soft stools/day, rifaximin for recurrence prevention; identify and treat precipitants (infection, GIB, constipation, medications).\n\nInflammatory bowel disease: Crohn's disease is transmural and can affect any segment from mouth to anus; skip lesions, fistulas, and strictures. UC is limited to colon with continuous mucosal inflammation. Mild-moderate flare: 5-ASA (UC) or budesonide (Crohn's ileocolonic). Moderate-severe: steroids; steroid-dependent → azathioprine, methotrexate, or biologics. Toxic megacolon: distended colon >6 cm, fever, tachycardia — bowel rest, IV steroids, surgery if no improvement in 48–72 hours.",
    keyConcepts: [
      "Upper GIB: proton pump inhibitor + octreotide (variceal); endoscopy within 12–24 h",
      "Variceal bleed: TIPS for refractory variceal hemorrhage; nadolol/propranolol for prophylaxis",
      "SBP diagnosis: PMN ≥250 cells/mm³ on paracentesis; treat empirically even before cultures return",
      "MELD score guides transplant listing; Child-Pugh predicts surgical mortality",
      "Crohn's vs UC: Crohn's — transmural, skip lesions, perianal disease, fistulas; UC — continuous, mucosal only",
      "Acute liver failure: N-acetylcysteine for acetaminophen toxicity within 24 h of ingestion; transplant evaluation for all",
      "Cholangitis (Charcot's triad: fever, RUQ pain, jaundice) → ERCP and antibiotics urgently",
    ],
    mustKnowFacts: [
      "Acetaminophen overdose: N-acetylcysteine is most effective within 8 hours but still given up to 24 hours; do not wait for ALT elevation",
      "Ascites in new cirrhotics: SAAG ≥1.1 g/dL confirms portal hypertension; diurese with spironolactone + furosemide (100:40 ratio)",
    ],
    pearls: [
      "A 50-year-old alcoholic with hematemesis, tense ascites, and HR 110 has variceal bleeding until proven otherwise. Next best step: IV octreotide + IV PPI + blood transfusion + antibiotics (ceftriaxone reduces bacterial infection post-bleed) → urgent EGD. Do not delay endoscopy waiting for a full 'stabilization.'",
      "A cirrhotic with altered mental status, asterixis, and rising creatinine: rule out SBP first with diagnostic paracentesis before attributing encephalopathy to dietary indiscretion — PMN ≥250 mandates antibiotics and albumin.",
    ],
    pitfalls: [
      "Using liberal transfusion strategy (Hb threshold >9 g/dL) in variceal bleed — increases portal pressure and re-bleeding risk",
      "Prescribing NSAIDs to a cirrhotic patient — precipitates hepatorenal syndrome and GI bleeding",
    ],
    practiceTopicSlug: "gastroenterology",
  },
  {
    slug: "renal-electrolytes",
    category: "Systems",
    title: "Renal: AKI, CKD & Electrolyte Emergencies",
    overview:
      "AKI classification, dialysis indications, and clinical approach to dangerous electrolyte derangements.",
    summary:
      "Acute kidney injury is defined by ≥0.3 mg/dL rise in creatinine within 48 h or ≥1.5× baseline within 7 days. Categorize as prerenal (BUN:Cr >20, FeNa <1%, responds to fluids), intrinsic renal (ATN most common — FeNa >2%, muddy brown casts), or postrenal (relieved by Foley or nephrostomy). Contrast-induced nephropathy prevention: IV isotonic saline pre- and post-procedure, minimize contrast volume, hold nephrotoxins. NSAID avoidance is critical in CKD.\n\nDialysis indications (AEIOU): Acidosis (pH <7.1 refractory), Electrolyte abnormality (hyperkalemia with ECG changes refractory to medical management), Ingestion (methanol, ethylene glycol, lithium, salicylates), Overload (pulmonary edema refractory to diuresis), Uremia (encephalopathy, pericarditis, coagulopathy). Hyperkalemia management is layered: calcium gluconate stabilizes myocardium (minutes), insulin + dextrose shifts K⁺ intracellularly (30 min), sodium bicarbonate in acidemia, kayexalate/patiromer for excretion; dialysis for refractory cases.\n\nHyponatremia correction: first determine volume status. SIADH (euvolemic, urine Na >40, urine osm >100): fluid restrict ± vaptans. Hypervolemic hyponatremia (HF, cirrhosis): fluid restrict + treat underlying cause. Hypovolemic: isotonic saline. Correction rate: ≤8–10 mEq/L in 24 h to avoid osmotic demyelination (central pontine myelinolysis). If symptomatic seizures: 3% hypertonic saline 1–2 mL/kg over 20 min × 1–2 doses.",
    keyConcepts: [
      "FeNa <1% = prerenal; FeNa >2% = ATN; unreliable with diuretics — use FEUrea instead",
      "Hyperkalemia with peaked T waves or widened QRS: calcium gluconate first (cardiac membrane stabilization)",
      "SIADH criteria: euvolemic, hypo-osmolar, urine osm >urine, urine Na >40, no adrenal/thyroid disease",
      "Rapid correction of chronic hyponatremia causes osmotic demyelination — max 8–10 mEq/L/24 h",
      "CKD complications: anemia (EPO deficiency), secondary hyperparathyroidism (calcitriol + phosphate binders), metabolic acidosis (sodium bicarbonate)",
      "Rhabdomyolysis: aggressive IVF to maintain UO >200 mL/h; avoid NSAIDs; watch for AKI and hyperkalemia",
    ],
    mustKnowFacts: [
      "Hyperkalemia ECG progression: peaked T waves → PR prolongation → widened QRS → sine wave → VF — each step demands escalating urgency",
      "Hypomagnesemia causes refractory hypokalemia — replace Mg²⁺ first or concurrent potassium replacement will fail",
    ],
    pearls: [
      "A post-op patient has urine output 15 mL/h for 4 hours, BUN 40, Cr 1.2 (baseline 0.8), BUN:Cr ratio 33. FeNa is 0.4%. This is prerenal AKI — give a 500 mL NS bolus and reassess. Do not start dialysis, do not order renal biopsy, do not give furosemide (which worsens prerenal states).",
      "A patient with SIADH serum Na of 118 mEq/L is confused but not seizing. Next best step is fluid restriction to 800 mL/day — not hypertonic saline (reserved for symptomatic/seizing patients). If 3% saline is used, stop once Na rises 4–6 mEq/L or symptoms resolve.",
    ],
    pitfalls: [
      "Giving IV fluids for hyponatremia in SIADH — isotonic saline can paradoxically worsen hyponatremia if urine Na > serum Na",
      "Starting dialysis for hyperkalemia without first attempting medical management — avoidable in most cases with calcium, insulin/dextrose, and sodium bicarbonate",
    ],
    practiceTopicSlug: "renal-electrolytes",
  },
  {
    slug: "endocrine-dm",
    category: "Systems",
    title: "Endocrine: Diabetes, Thyroid & Adrenal",
    overview:
      "DKA vs HHS differentiation, thyroid storm recognition, adrenal insufficiency, and outpatient diabetes management targets.",
    summary:
      "DKA (type 1 predominantly, but increasingly type 2): glucose >250, pH <7.3, bicarbonate <18, ketones positive. Management: IV isotonic saline bolus → change to half-normal saline; insulin drip only after K⁺ ≥3.3 mEq/L (give KCl first if lower); add dextrose to IV fluids when glucose reaches 200–250 to continue insulin until gap closes. The gap closes when bicarb normalizes, not just when glucose normalizes. HHS: glucose often >600, minimal ketones, profound dehydration, and higher mortality — replace fluids aggressively, insulin usually lower doses.\n\nHypothyroidism vs myxedema coma: myxedema is hypothyroid crisis with hypothermia, bradycardia, hyponatremia, and altered mental status. Give IV T4 (levothyroxine) ± T3, hydrocortisone (to cover possible concurrent adrenal insufficiency), and supportive care. Thyroid storm: thyrotoxic crisis with fever, tachyarrhythmia, and multiorgan dysfunction — propylthiouracil (blocks synthesis and peripheral conversion) or methimazole, then iodine (SSKI) 1 hour later to block release, propranolol for rate control, and hydrocortisone.\n\nAdrenal insufficiency: primary (Addison's) — hyperpigmentation, hyponatremia, hyperkalemia, ACTH elevated; secondary — no pigmentation, Na low, K normal, ACTH low. Adrenal crisis: hypotension, shock in stressed patient on chronic steroids or with Addison's — IV hydrocortisone 100 mg immediately, then 50 mg q8h; normal saline resuscitation. Do not delay for ACTH stimulation test in acute crisis.",
    keyConcepts: [
      "DKA: anion gap metabolic acidosis + ketones; insulin only after K⁺ ≥3.3 mEq/L",
      "Resolution of DKA: anion gap normalization (not just glucose control) — transition to SQ insulin overlap",
      "HHS: extreme hyperglycemia, hyperosmolarity, minimal ketones — aggressive fluid replacement priority",
      "Thyroid storm Burch-Wartofsky score: assess fever, heart rate, CNS effects, HF, GI symptoms",
      "PTU vs methimazole: PTU preferred in first trimester and thyroid storm; methimazole for maintenance",
      "Pheochromocytoma: alpha-blocker (phenoxybenzamine) before beta-blocker to avoid hypertensive crisis",
      "Cushing's: 24-h urine cortisol, late-night salivary cortisol, or low-dose dexamethasone suppression for screening",
    ],
    mustKnowFacts: [
      "Adrenal crisis with shock: give IV hydrocortisone 100 mg stat — do not withhold while waiting for cortisol level or stimulation test results",
      "Subclinical hypothyroidism with TSH 4.5–10 mU/L: treat if symptomatic, pregnant, or TSH >10 mU/L; watchful waiting otherwise per guideline",
    ],
    pearls: [
      "A type 1 diabetic presents with nausea, vomiting, glucose 320, pH 7.25, K⁺ 3.0 mEq/L. Do NOT start insulin yet — give KCl replacement first. Starting insulin with K⁺ <3.3 shifts potassium intracellularly and risks fatal arrhythmia.",
      "A patient on chronic prednisone for RA undergoes emergency appendectomy and develops refractory hypotension post-op. Diagnosis: adrenal crisis from HPA suppression. The next best step is IV hydrocortisone — not further fluid boluses or vasopressors alone.",
    ],
    pitfalls: [
      "Stopping insulin infusion when glucose reaches 200 mg/dL in DKA — continue insulin with dextrose added to IV fluids until anion gap closes",
      "Starting a beta-blocker first in pheochromocytoma — blocks vasodilatory beta-2 receptors leaving alpha-mediated vasoconstriction unopposed, causing hypertensive crisis",
    ],
    practiceTopicSlug: "endocrine-dm",
  },
  {
    slug: "infectious-disease",
    category: "Systems",
    title: "Infectious Disease: Sepsis, HIV & Antimicrobials",
    overview:
      "Sepsis bundle execution, opportunistic infection prophylaxis by CD4 count, and targeted antimicrobial selection.",
    summary:
      "Sepsis (life-threatening organ dysfunction due to dysregulated host response to infection) and septic shock (sepsis + vasopressors needed + lactate >2 mmol/L despite fluids) drive the Surviving Sepsis Campaign hour-1 bundle: measure lactate, obtain blood cultures before antibiotics, give broad-spectrum antibiotics, and provide 30 mL/kg IV crystalloid for hypotension or lactate ≥4 mmol/L. Norepinephrine is the first-line vasopressor. Source control (drain abscess, remove infected hardware, remove line) is essential.\n\nHIV management hinges on CD4 count thresholds for opportunistic infection prophylaxis. PCP prophylaxis with TMP-SMX at CD4 <200 (also covers Toxoplasma if IgG positive). MAC prophylaxis (azithromycin) at CD4 <50. CMV retinitis presents with decreased vision and floaters — funduscopy shows 'pizza pie' retinopathy — treat with ganciclovir/valganciclovir. Cryptococcal meningitis: India ink capsule, cryptococcal antigen; treat with amphotericin B + flucytosine then fluconazole consolidation.\n\nAntimicrobial pearls: culture before antibiotics whenever possible without delaying treatment. Empiric coverage is then de-escalated based on sensitivities. MRSA: vancomycin or daptomycin; linezolid for pulmonary MRSA (daptomycin is inactivated by surfactant). C. difficile: first episode — oral vancomycin or fidaxomicin (superior to metronidazole); recurrent — fidaxomicin, bezlotoxumab, or fecal microbiota transplant.",
    keyConcepts: [
      "Sepsis hour-1 bundle: lactate, cultures, broad antibiotics, 30 mL/kg IVF, norepinephrine for shock",
      "Source control: drain empyema, abscess, remove infected catheter — antibiotics alone are insufficient",
      "CD4 <200: TMP-SMX for PCP/Toxoplasma prophylaxis; CD4 <50: azithromycin for MAC",
      "PCP pneumonia: bilateral interstitial infiltrates, LDH elevated; TMP-SMX ± prednisone if PaO₂ <70",
      "C. diff: oral vancomycin or fidaxomicin; avoid antiperistaltics; contact precautions",
      "Endocarditis empiric therapy: vancomycin + ceftriaxone until cultures finalize; 4–6 weeks minimum",
      "Meningitis empiric therapy: ceftriaxone + vancomycin + dexamethasone (pneumococcal); add ampicillin if >50 or immunocompromised (Listeria)",
    ],
    mustKnowFacts: [
      "Blood cultures must be drawn before antibiotics in sepsis — even a 45-minute delay reduces pathogen yield by ~20%; do not delay antibiotics beyond 1 hour",
      "Daptomycin is inactivated by lung surfactant — do not use for pneumonia caused by MRSA; use vancomycin or linezolid instead",
    ],
    pearls: [
      "A 65-year-old with T2DM presents with fever, RLQ pain, and WBC 18K. CT shows pericolonic fat stranding. Blood cultures are pending. Next best step: draw 2 blood culture sets from different sites, then start IV ceftriaxone + metronidazole. Do not wait for culture results before antibiotics in sepsis.",
      "An HIV patient with CD4 50 presents with headache and photophobia. LP shows: elevated opening pressure, low glucose, lymphocytosis, India ink positive. Next best step: amphotericin B + flucytosine for 2 weeks (induction), then fluconazole consolidation. Serial LPs or lumbar drain for elevated ICP management.",
    ],
    pitfalls: [
      "Using TMP-SMX for empiric UTI treatment without checking local resistance patterns — E. coli resistance exceeds 20% in many areas; fluoroquinolone alternatives may be needed",
      "Treating C. difficile with metronidazole as first-line — guidelines favor oral vancomycin or fidaxomicin for initial non-severe episodes",
    ],
    practiceTopicSlug: "infectious-disease",
  },
  {
    slug: "hematology-oncology",
    category: "Systems",
    title: "Hematology/Oncology: Anemia, Coagulopathy & Malignancy",
    overview:
      "Anemia classification, coagulation cascade disorders, oncologic emergencies, and transfusion thresholds.",
    summary:
      "Anemia workup begins with MCV. Microcytic (MCV <80): iron deficiency (low ferritin, high TIBC) vs thalassemia (normal/low RDW, high RBC count) vs anemia of chronic disease (high ferritin, low TIBC) vs sideroblastic. Normocytic: hemolysis (elevated LDH, indirect bilirubin, low haptoglobin, reticulocytosis) vs bone marrow failure vs acute blood loss. Macrocytic: B12/folate deficiency (hypersegmented neutrophils) vs hypothyroidism vs alcoholism vs medications (hydroxyurea, methotrexate).\n\nCoagulopathy: PT (extrinsic — factor VII), PTT (intrinsic — factors VIII, IX, XI, XII), and bleeding time (platelets/vWF). Factor VIII deficiency (hemophilia A): elevated PTT, normal PT — treat with factor VIII concentrate or desmopressin for mild disease. DIC: consumptive coagulopathy with elevated PT/PTT, low fibrinogen, elevated D-dimer, thrombocytopenia — treat the underlying cause; transfuse FFP, cryoprecipitate, and platelets for active bleeding.\n\nOncologic emergencies: superior vena cava syndrome (facial plethora, arm edema, dyspnea) — steroids if lymphoma, urgent XRT or stenting for rapid progression. Tumor lysis syndrome (hyperuricemia, hyperkalemia, hyperphosphatemia, hypocalcemia within 72 h of chemotherapy) — aggressive hydration + allopurinol or rasburicase. Febrile neutropenia (ANC <500, temp ≥38.3°C) — blood cultures × 2, then anti-pseudomonal antibiotics (cefepime, piperacillin-tazobactam) within 1 hour.",
    keyConcepts: [
      "Iron deficiency anemia: low ferritin (<30 ng/mL is diagnostic); treat cause, then iron supplementation",
      "TTP: microangiopathic hemolytic anemia + thrombocytopenia + fever + renal/neuro changes — ADAMTS13 deficiency; plasma exchange is life-saving",
      "HIT type II: heparin exposure + >50% platelet drop + thrombosis — stop all heparin, start argatroban or bivalirudin; never give platelets",
      "DIC: treat precipitant; transfuse to control active hemorrhage, not to normalize labs",
      "Febrile neutropenia: blood cultures → anti-pseudomonal antibiotics within 60 minutes",
      "Spinal cord compression in cancer: urgent MRI, dexamethasone, radiation or surgery — 'cannot walk' is the threshold for intervention",
    ],
    mustKnowFacts: [
      "Plasma exchange (plasmapheresis) is the treatment for TTP — not platelet transfusion, which can worsen thrombosis",
      "Chronic transfusions risk iron overload — ferritin monitoring and chelation therapy (deferoxamine) for patients receiving >20 packed RBCs",
    ],
    pearls: [
      "A 35-year-old woman with hemolytic anemia, thrombocytopenia to 20K, creatinine 2.8, and confusion post-GI illness. TTP pentad. Next best step: urgent plasma exchange — not platelet transfusion, not steroids alone. ADAMTS13 confirms but do not wait for results.",
      "A cancer patient on chemotherapy develops ANC of 300 with temperature 38.6°C. After drawing 2 sets of blood cultures, the next best step is IV cefepime — not oral antibiotics, not wait-and-see, not vancomycin empirically (unless skin/line source).",
    ],
    pitfalls: [
      "Transfusing platelets in TTP — accelerates thrombotic microangiopathy and worsens outcome",
      "Using platelet transfusion threshold of <100K for all patients — guideline threshold is <10K for prophylaxis (or <50K for procedures/active bleeding)",
    ],
    practiceTopicSlug: "hematology-oncology",
  },
  {
    slug: "rheumatology",
    category: "Systems",
    title: "Rheumatology: Inflammatory Arthritis & Autoimmune Disease",
    overview:
      "Distinguishing inflammatory from degenerative arthritis, lupus workup, and vasculitis recognition.",
    summary:
      "Inflammatory arthritis presents with morning stiffness >1 hour, warmth, synovitis, and elevated inflammatory markers — distinguishing features from osteoarthritis (bony enlargement, crepitus, worse with use, no systemic features). Rheumatoid arthritis: symmetric small joint involvement, RF and anti-CCP antibodies (anti-CCP more specific); treat-to-target strategy using csDMARDs (methotrexate first-line) then biologics (TNF inhibitors, abatacept, rituximab). Screen for TB (PPD or IGRA) before initiating biologics.\n\nSLE diagnostic criteria (SLICC): malar rash, discoid rash, photosensitivity, oral ulcers, alopecia, serositis, nephritis, hematologic abnormalities, neuropsychiatric features, ANA positive. Most specific antibodies: anti-dsDNA (correlates with disease activity, especially nephritis) and anti-Smith. Most sensitive: ANA. Lupus nephritis class III/IV (proliferative): treat with mycophenolate + hydroxychloroquine + short-course steroids; screen for APS (antiphospholipid antibodies) especially in recurrent thrombosis or pregnancy loss.\n\nVasculitis by vessel size: large vessel (GCA, Takayasu's), medium vessel (PAN, Kawasaki's), small vessel (GPA/Wegener's, EGPA/Churg-Strauss, MPA). Giant cell arteritis: age >50, temporal headache, jaw claudication, visual loss risk — start high-dose prednisone immediately before temporal artery biopsy to prevent blindness. GPA: saddle nose deformity, pulmonary nodules/cavities, renal disease, ANCA c-ANCA (PR3) positive — treat with rituximab + steroids.",
    keyConcepts: [
      "RA: symmetric MCP/PIP/wrist synovitis, morning stiffness >1 h; anti-CCP most specific; methotrexate first",
      "SLE: ANA most sensitive; anti-dsDNA and anti-Smith most specific; anti-dsDNA correlates with nephritis",
      "APS: arterial/venous thrombosis or recurrent pregnancy loss + antiphospholipid antibodies; anticoagulate with warfarin",
      "GCA: jaw claudication + temporal headache in >50-year-old — start prednisone 1 mg/kg before biopsy; do not delay",
      "Gout vs pseudogout: gout = MSU crystals (needle-shaped, negatively birefringent); pseudogout = CPPD (rhomboid, weakly positively birefringent)",
      "Reactive arthritis (Reiter's): urethritis + arthritis + uveitis post-GI or STI — HLA-B27 associated",
    ],
    mustKnowFacts: [
      "Hydroxychloroquine requires annual ophthalmologic exam — risk of irreversible retinal toxicity at cumulative doses",
      "Methotrexate requires folic acid supplementation, CBC and LFT monitoring, and is teratogenic — contraception mandatory",
    ],
    pearls: [
      "A 70-year-old woman presents with new temporal headache, scalp tenderness, and transient visual blurring. ESR is 88 mm/h. Next best step: start high-dose prednisone (1 mg/kg/day) immediately — do not wait for temporal artery biopsy. Biopsy can be done within 1–2 weeks while on steroids without significantly affecting yield.",
      "A patient with SLE has proteinuria 3 g/day and hematuria. Renal biopsy shows diffuse proliferative nephritis (Class IV). Next best step: mycophenolate mofetil + pulse-dose methylprednisolone then oral prednisone. Hydroxychloroquine should continue throughout.",
    ],
    pitfalls: [
      "Delaying steroids for GCA pending temporal artery biopsy — irreversible blindness can occur within hours to days of visual symptoms",
      "Using NSAIDs as maintenance therapy in RA — provides symptomatic relief only, does not prevent joint destruction; DMARDs are required",
    ],
    practiceTopicSlug: "rheumatology",
  },
  {
    slug: "obstetrics",
    category: "Systems",
    title: "OB: Preeclampsia, Hemorrhage & Fetal Assessment",
    overview:
      "Hypertensive disorders of pregnancy, obstetric hemorrhage management, and antepartum surveillance decisions.",
    summary:
      "Hypertensive disorders of pregnancy span gestational hypertension (BP ≥140/90 after 20 weeks, no proteinuria) to preeclampsia (HTN + proteinuria ≥300 mg/24 h or other severe features) to eclampsia (seizures). Severe features: BP ≥160/110, thrombocytopenia <100K, creatinine >1.1, elevated LFTs, pulmonary edema, or cerebral/visual symptoms. Management: magnesium sulfate for seizure prophylaxis and treatment (only drug for eclampsia), labetalol or hydralazine acutely for BP control, and delivery — the definitive treatment.\n\nObstetric hemorrhage: primary PPH (>500 mL vaginal, >1000 mL C-section, or any hemodynamic instability). Causes: 4 T's — Tone (atony, 80%), Trauma, Tissue (retained products), Thrombin (coagulopathy). Atony management: uterine massage, oxytocin, methylergonovine (avoid in hypertension), carboprost (avoid in asthma), misoprostol, intrauterine balloon tamponade. Massive hemorrhage protocol activates with ≥1 unit uncrossmatched blood for hemodynamic instability.\n\nPrenatal screening and fetal assessment: First-trimester combined screen (nuchal translucency + PAPP-A + beta-hCG) screens for trisomy 21, 18, 13. Cell-free fetal DNA (NIPT) has high sensitivity/specificity but is a screening test — diagnostic confirmation with CVS or amniocentesis. Fetal heart rate monitoring: Category I (normal), II (indeterminate — requires intervention), III (abnormal — immediate delivery).",
    keyConcepts: [
      "Preeclampsia with severe features: admit, magnesium sulfate, antihypertensives for BP ≥160/110, deliver ≥34 weeks",
      "Eclampsia: IV magnesium sulfate (4–6 g loading then 1–2 g/h infusion); benzodiazepines if refractory",
      "HELLP syndrome: Hemolysis, Elevated Liver enzymes, Low Platelets — delivery is the treatment",
      "PPH 4 T's: Tone (atony first), Trauma (laceration), Tissue (retained placenta), Thrombin (coagulopathy)",
      "Category III FHR: sinusoidal pattern or absent variability + late decelerations/bradycardia → delivery",
      "Placenta previa: painless bright red vaginal bleeding after 20 weeks; no digital exam; C-section",
      "Placental abruption: painful bleeding + uterine rigidity, fetal distress; often hypertensive emergency",
    ],
    mustKnowFacts: [
      "Magnesium toxicity: loss of deep tendon reflexes (first sign) → respiratory depression → cardiac arrest; calcium gluconate is the antidote",
      "GBS prophylaxis: penicillin G for GBS-positive patients in labor; clindamycin or vancomycin for PCN allergy with susceptibility testing",
    ],
    pearls: [
      "A 32-year-old at 34 weeks presents with severe headache, BP 168/112, RUQ pain, and platelets of 80K. She has HELLP syndrome. The next best step is magnesium sulfate + antihypertensives + delivery planning — HELLP does not respond to conservative management after 34 weeks.",
      "A patient with known placenta previa at 30 weeks has painless vaginal bleeding now controlled. Management: hospitalize, steroids for fetal lung maturity, type and screen, avoid digital exam, plan C-section at 36–37 weeks if stable — not immediate delivery if stable maternal and fetal status.",
    ],
    pitfalls: [
      "Giving methylergonovine (Methergine) for atony in a patient with severe preeclampsia — causes severe vasoconstriction and dangerous hypertensive crisis",
      "Performing digital cervical exam in suspected placenta previa before ultrasound — can precipitate catastrophic hemorrhage",
    ],
    practiceTopicSlug: "obstetrics",
  },
  {
    slug: "pediatrics",
    category: "Systems",
    title: "Pediatrics: Fever, Development & Congenital Disease",
    overview:
      "Age-stratified fever workup, developmental milestone red flags, and high-yield congenital heart disease recognition.",
    summary:
      "Fever evaluation in children is age-dependent. Neonates <28 days with temperature ≥38°C require full sepsis evaluation: CBC, blood culture, urinalysis, urine culture, LP, and empiric ampicillin + gentamicin (or ampicillin + cefotaxime for <7 days) regardless of appearance — occult bacteremia risk is high. Infants 29–90 days: risk stratify using Rochester or Step-by-Step criteria; well-appearing, low-risk infants may have LP deferred but should be observed. Older children: evaluate source, check for meningismus, petechiae (meningococcemia), and immunocompromise.\n\nDevelopmental milestones: red flags for autism include no babbling by 12 months, no words by 16 months, no 2-word phrases by 24 months, or any regression. Language delay without social withdrawal suggests hearing loss — audiogram first. Gross motor delay with hypotonia: evaluate for muscular dystrophy (CK, muscle biopsy) or spinal muscular atrophy. Intellectual disability workup: chromosomal microarray is first-line (higher yield than karyotype for most cases).\n\nCongenital heart disease: cyanotic lesions (Tetralogy of Fallot, Transposition of Great Arteries, Tricuspid Atresia) vs left-to-right shunts (VSD, ASD, PDA). Hyperoxia test: if PaO₂ fails to rise above 150 mmHg on 100% O₂, suspect cyanotic CHD. TGA: newborn with cyanosis unresponsive to O₂, but CXR shows 'egg on a string' heart — start prostaglandin E1 immediately to maintain PDA, then balloon atrial septostomy + arterial switch surgery.",
    keyConcepts: [
      "Fever in neonate <28 days: full sepsis workup + empiric antibiotics regardless of clinical appearance",
      "Kawasaki disease: fever ≥5 days + ≥4 of 5 features (rash, conjunctivitis, mucositis, lymphadenopathy, extremity changes); IVIG + high-dose aspirin to prevent coronary aneurysms",
      "Bronchiolitis (RSV): supportive care only — no albuterol, no steroids, no antibiotics in uncomplicated cases",
      "Croup: inspiratory stridor, barking cough; racemic epinephrine for moderate/severe; dexamethasone for all",
      "Epiglottitis: drooling, high fever, tripod positioning, muffled voice — do not examine oropharynx; secure airway in OR",
      "Weight-based dosing in all pediatric medications — verify weight in kg",
    ],
    mustKnowFacts: [
      "Cystic fibrosis: elevated sweat chloride ≥60 mEq/L diagnostic; treat pulmonary exacerbations with IV antibiotics covering Pseudomonas",
      "Intussusception: intermittent colicky pain, currant jelly stools, sausage-shaped abdominal mass — air enema reduction is diagnostic and therapeutic; surgery if failed or peritonitis",
    ],
    pearls: [
      "A 6-week-old presents with 3 days of progressive non-bilious projectile vomiting after feeds. Physical exam reveals an olive-shaped epigastric mass. Diagnosis: pyloric stenosis. Next best step: abdominal ultrasound (confirms pyloric thickness >4 mm and length >16 mm), then correct electrolytes (hypochloremic metabolic alkalosis) before pyloromyotomy — do not rush to surgery with uncorrected metabolic derangement.",
      "A 2-year-old with sickle cell disease presents with fever 39°C and WBC 18K. Next best step: blood culture, then ceftriaxone empirically — encapsulated organisms (Streptococcus pneumoniae) cause overwhelming sepsis. Do not wait for results. Functional asplenia makes these children high-risk.",
    ],
    pitfalls: [
      "Using aspirin for fever in children with viral illness — Reye syndrome; use acetaminophen or ibuprofen except in Kawasaki disease where aspirin is indicated",
      "Giving albuterol or corticosteroids for viral bronchiolitis — evidence does not support their use; suction and supportive care are the standard",
    ],
    practiceTopicSlug: "pediatrics",
  },
  {
    slug: "psychiatry",
    category: "Foundations",
    title: "Psychiatry: Mood Disorders, Psychosis & Emergencies",
    overview:
      "Diagnosis and pharmacologic management of major psychiatric conditions, suicidal risk assessment, and medication adverse effects.",
    summary:
      "Major depressive disorder requires ≥5 symptoms for ≥2 weeks including depressed mood or anhedonia — screen with PHQ-9. First-line: SSRIs (sertraline, escitalopram); full response takes 4–8 weeks. Augment with atypical antipsychotic, lithium, or bupropion for partial response. Bipolar disorder: manic episode requires ≥7 days of elevated mood + 3 criteria; antidepressant monotherapy risks precipitating mania — always use mood stabilizer (lithium, valproate, lamotrigine for bipolar II) as foundation.\n\nSchizophrenia: positive symptoms (hallucinations, delusions, disorganized thought) and negative symptoms (alogia, avolition, flat affect) persisting ≥6 months. Antipsychotics target dopamine D2 receptors; second-generation (olanzapine, risperidone, quetiapine) preferred for lower EPS risk but higher metabolic risk. Clozapine for treatment-resistant schizophrenia — requires ANC monitoring (agranulocytosis risk). EPS management: acute dystonia → benztropine or diphenhydramine; akathisia → propranolol or benzodiazepine; tardive dyskinesia → valbenazine or deutetrabenazine.\n\nSerotonin syndrome vs neuroleptic malignant syndrome: both cause hyperthermia and altered mental status, but serotonin syndrome features clonus, hyperreflexia, and diarrhea (onset hours); NMS features lead-pipe rigidity, elevated CK, bradykinesia, and autonomic instability (onset days to weeks after antipsychotic initiation or dose change). Serotonin syndrome: cyproheptadine + supportive care. NMS: discontinue antipsychotic, dantrolene, bromocriptine, ICU support.",
    keyConcepts: [
      "MDD: ≥5 symptoms ≥2 weeks; first-line SSRI; augment at 4–8 weeks for partial response",
      "Bipolar I: manic episode 7+ days; treat with mood stabilizer; antidepressant monotherapy is contraindicated",
      "Schizophrenia: ≥6 months; positive + negative symptoms; second-generation antipsychotic preferred",
      "Clozapine: only antipsychotic with superior efficacy in treatment-resistant schizophrenia; monitor ANC weekly initially",
      "Serotonin syndrome vs NMS: clonus/hyperreflexia (serotonin) vs rigidity/elevated CK (NMS); onset timing differs",
      "Suicide risk: direct questioning is standard of care; hospitalize if imminent plan, intent, or no safety net",
      "Lithium monitoring: narrow therapeutic index (0.6–1.2 mEq/L); toxicity signs — coarse tremor, ataxia, confusion",
    ],
    mustKnowFacts: [
      "SSRI + MAOI combination causes fatal serotonin syndrome — 14-day washout required when switching (5 weeks for fluoxetine due to long half-life)",
      "Electroconvulsive therapy (ECT) is the fastest-acting intervention for severe, refractory depression or catatonia and is safe in pregnancy",
    ],
    pearls: [
      "A patient on haloperidol for 3 weeks develops hyperthermia, lead-pipe rigidity, CK of 8,000, and altered consciousness. NMS diagnosis. Next best step: stop haloperidol immediately, IV fluids, dantrolene for hyperthermia/rigidity, bromocriptine; ICU admission. Do not restart antipsychotic until fully recovered.",
      "A 40-year-old started on sertraline 2 weeks ago returns with agitation, diaphoresis, clonus, and diarrhea after a friend gave him tramadol. Serotonin syndrome. Next best step: discontinue both serotonergic agents, cyproheptadine 12 mg orally, benzodiazepines for agitation, and supportive care in monitored setting.",
    ],
    pitfalls: [
      "Prescribing an SSRI alone for bipolar depression without a mood stabilizer — high risk of precipitating manic episode",
      "Attributing NMS rigidity to worsening psychosis and increasing the antipsychotic dose — accelerates the syndrome and increases mortality",
    ],
    practiceTopicSlug: "psychiatry",
  },
  {
    slug: "emergency-toxicology",
    category: "Systems",
    title: "Emergency Medicine: Toxicology & Trauma",
    overview:
      "Toxidrome recognition, antidote selection, and primary survey priorities in trauma and the undifferentiated unstable patient.",
    summary:
      "Toxidrome recognition guides antidote selection before confirmatory levels return. Opioid toxidrome: miosis, bradypnea, obtundation — naloxone IV/IM/intranasal; titrate to respiratory drive, not consciousness (avoid acute withdrawal in dependent patients). Cholinergic (organophosphate): DUMBELS (Diarrhea, Urination, Miosis, Bradycardia/Bronchospasm, Emesis, Lacrimation, Salivation) — atropine for secretions + pralidoxime (2-PAM) within 24 h to reactivate acetylcholinesterase. Sympathomimetic (cocaine, amphetamines): hypertension, tachycardia, hyperthermia, mydriasis — benzodiazepines are first-line for agitation and hypertension; beta-blockers alone are contraindicated (unopposed alpha effects).\n\nSpecific antidotes: acetaminophen overdose → N-acetylcysteine (most effective within 8 h, still given beyond 24 h); digoxin toxicity → digoxin-specific antibody Fab fragments; TCA overdose → sodium bicarbonate (widens QRS, reverses Na channel blockade); methanol/ethylene glycol → fomepizole (blocks alcohol dehydrogenase) + hemodialysis for severe cases; cyanide → hydroxocobalamin.\n\nTrauma primary survey (ATLS): Airway with C-spine protection → Breathing and ventilation → Circulation and hemorrhage control → Disability (GCS, pupils) → Exposure and environment. Tension pneumothorax and cardiac tamponade are immediately reversible causes of obstructive shock — decompress clinically, do not delay for CXR. Damage control resuscitation: 1:1:1 ratio of pRBC:FFP:platelets; permissive hypotension (MAP 50–60) until hemorrhage control in penetrating trauma.",
    keyConcepts: [
      "Opioid: miosis + bradypnea → naloxone; avoid precipitating full withdrawal — titrate to ventilation",
      "Cholinergic: DUMBELS → atropine for secretions; pralidoxime for nicotinic effects within 24 h",
      "TCA overdose: wide QRS + QT prolongation + AMS → sodium bicarbonate IV bolus",
      "Acetaminophen: Rumack-Matthew nomogram; NAC most effective early; do not delay for toxicity symptoms",
      "Carbon monoxide: cherry-red skin (rare, late); headache/confusion; normal SpO₂ (pulse ox unreliable) — 100% O₂ via NRB; consider HBO for severe",
      "Tension pneumothorax: tracheal deviation, absent breath sounds, JVD, hemodynamic collapse → immediate needle decompression",
      "Trauma: ABC primary survey; control external hemorrhage with direct pressure; massive transfusion protocol activation",
    ],
    mustKnowFacts: [
      "Flumazenil reverses benzodiazepine sedation but can precipitate seizures in benzo-dependent patients — use only in pure benzo overdose, not empirically in mixed overdose",
      "Methanol toxicity: high anion gap metabolic acidosis + osmol gap elevation + visual changes (optic nerve injury) — fomepizole + hemodialysis; formate (not methanol itself) causes toxicity",
    ],
    pearls: [
      "A patient is brought in unresponsive with miotic pupils and a respiratory rate of 6. Before obtaining a full history, the next best step is naloxone 0.4–2 mg IV/IM. If opioid reversal occurs, titrate dose to maintain respiratory drive. If no response, consider other CNS depressants or structural causes.",
      "A 28-year-old ingested 15 g of acetaminophen 5 hours ago. Transaminases are currently normal. The next best step is N-acetylcysteine — do not wait for liver injury to develop. The Rumack-Matthew nomogram at 5 hours with level >150 mcg/mL mandates treatment. Liver failure takes 72–96 hours to manifest.",
    ],
    pitfalls: [
      "Giving a beta-blocker for cocaine-induced hypertension and tachycardia — leaves alpha-mediated vasoconstriction unopposed, worsening hypertension and coronary vasospasm",
      "Discharging an acetaminophen overdose patient with normal early labs without checking a 4-hour level on the Rumack-Matthew nomogram",
    ],
    practiceTopicSlug: "emergency-toxicology",
  },
  {
    slug: "ethics-biostats",
    category: "Foundations",
    title: "Ethics & Biostatistics: Study Design & Physician-Patient Principles",
    overview:
      "Medical ethics frameworks, capacity assessment, research study interpretation, and high-yield statistical concepts.",
    summary:
      "The four principles of biomedical ethics — autonomy, beneficence, non-maleficence, and justice — frame clinical and research dilemmas. Decision-making capacity (not competence, which is a legal determination) requires four elements: the patient can understand relevant information, appreciate consequences, reason about options, and communicate a stable choice. Capacity is decision-specific — a patient may lack capacity for one decision but retain it for another. When capacity is absent, use substituted judgment (what would this patient have wanted?) over best interests when prior values are known.\n\nInformed consent requires disclosure of diagnosis, proposed treatment, risks, benefits, alternatives (including no treatment), and opportunity for questions. Exceptions: emergency when life-threatening and patient cannot consent (implied consent), waiver by the patient, therapeutic privilege (rarely justified), and incompetent patients with surrogates. Confidentiality may be broken to prevent serious imminent harm to identifiable third parties (Tarasoff duty-to-warn), for mandatory reporting, or by court order.\n\nBiostatistics essentials: sensitivity (rule out disease when negative — SnNout) vs specificity (rule in disease when positive — SpPin). Positive predictive value depends on prevalence — same test has lower PPV in low-prevalence populations. Number needed to treat (NNT) = 1/ARR. Bias types: selection bias (non-random assignment), recall bias (case-control studies), observer bias (unblinded assessment). Randomized controlled trials provide highest evidence for causation; systematic reviews and meta-analyses of RCTs are at the top of the evidence hierarchy.",
    keyConcepts: [
      "Capacity assessment: understand, appreciate, reason, communicate — test at time of decision",
      "Advanced directives: living will (instructions) and durable power of attorney for healthcare (surrogate); honor valid documents",
      "Sensitivity + specificity are intrinsic to the test; PPV and NPV depend on disease prevalence",
      "Type I error (alpha): false positive; Type II error (beta): false negative; power = 1 − beta",
      "Relative risk reduction vs absolute risk reduction: ARR drives NNT; RRR can exaggerate small effects",
      "Confidentiality exceptions: Tarasoff (imminent identifiable threat), mandatory reporting, court order",
      "Conflicts of interest: physician must disclose financial relationships; patient interest takes priority",
    ],
    mustKnowFacts: [
      "A competent patient can refuse any treatment, including life-sustaining treatment — respect autonomy even when you disagree",
      "Jehovah's Witness adult refusing blood transfusion: respect the refusal even in life-threatening situations; pediatric patients are different — courts typically authorize transfusion for minors",
    ],
    pearls: [
      "A study reports a new drug reduces MI by 50% (RRR). The baseline rate was 2% (ARR 1%, NNT 100). This means you need to treat 100 patients to prevent 1 MI — the relative risk sounds impressive, but the absolute benefit is modest. Step 2 CK vignettes test this distinction.",
      "A patient with dementia refuses a feeding tube. His family insists he would have wanted it. The physician should seek documentation of prior wishes (advance directive, prior conversations) and apply substituted judgment — what would the patient have wanted, not what the family wants for him.",
    ],
    pitfalls: [
      "Confusing sensitivity with PPV — high sensitivity does not mean most positives are true positives in a low-prevalence population (e.g., HIV screening in low-risk populations)",
      "Overriding a competent patient's refusal because family members or physicians believe the decision is unwise — autonomy of a capacitated adult is paramount",
    ],
    practiceTopicSlug: "ethics-biostats",
  },
  {
    slug: "dermatology-allergic",
    category: "Systems",
    title: "Dermatology & Allergy: Skin Diagnosis & Anaphylaxis",
    overview:
      "Morphologic approach to skin lesions, life-threatening dermatologic emergencies, and anaphylaxis management.",
    summary:
      "Skin lesion description uses standardized morphology: macule/patch (flat color change), papule/plaque (elevated solid), vesicle/bulla (fluid-filled blister), pustule (purulent), and wheals (transient edematous). Configuration and distribution narrow the differential: dermatome distribution → zoster; flexor surface → atopic dermatitis; photodistribution → lupus or drug reaction; palms and soles → secondary syphilis, Rocky Mountain spotted fever, or erythema multiforme. Confirm dangerous diagnoses (meningococcemia, necrotizing fasciitis, SJS/TEN) before dismissing rash as benign.\n\nStevens-Johnson syndrome (SJS) and toxic epidermal necrolysis (TEN): drug-induced (sulfonamides, anticonvulsants, allopurinol, NSAIDs) necrosis of epidermis. SJS: <10% BSA detachment; TEN: >30% BSA detachment; SJS-TEN overlap 10–30%. Management: discontinue offending drug immediately, ICU burn-unit level care, ophthalmology for eye involvement, IVIg or cyclosporine in select cases — systemic corticosteroids are controversial and potentially harmful in TEN.\n\nAnaphylaxis: IgE-mediated hypersensitivity with multi-system involvement (skin, respiratory, cardiovascular, or GI) following exposure to allergen. Diagnosis is clinical — do not wait for tryptase. Management: epinephrine 0.3 mg IM lateral thigh (not subcutaneous, not IV bolus first) is the only essential drug; antihistamines and corticosteroids are adjuncts and do not prevent biphasic reactions. Observe at minimum 4–6 hours for biphasic anaphylaxis recurrence. Discharge with epinephrine auto-injector prescription.",
    keyConcepts: [
      "SJS/TEN: discontinue culprit drug immediately; burns-unit supportive care; ophthalmology consult",
      "Anaphylaxis: epinephrine IM (vastus lateralis) first — antihistamines and steroids are adjuncts, not primary therapy",
      "Meningococcemia: petechiae/purpura fulminans + sepsis → immediate ceftriaxone; do not delay for LP",
      "Necrotizing fasciitis: pain out of proportion to appearance + crepitus + skin necrosis → emergent surgical debridement; antibiotics alone are insufficient",
      "Melanoma ABCDE: Asymmetry, Border irregularity, Color variation, Diameter >6 mm, Evolution — biopsy suspicious lesions",
      "Psoriasis vs eczema: psoriasis (silvery plaques, extensor surfaces, nail pitting, arthropathy); eczema (pruritic, flexor surfaces, family history of atopy)",
      "Secondary syphilis: maculopapular rash including palms and soles, condylomata lata, lymphadenopathy — RPR/VDRL screening; confirm with FTA-ABS",
    ],
    mustKnowFacts: [
      "Erythema migrans (Lyme disease): expanding annular rash >5 cm with central clearing after tick bite in endemic area — diagnose clinically and treat with doxycycline; do not await serology for classic presentation",
      "Toxic shock syndrome: diffuse erythroderma + desquamation on palms/soles + multiorgan dysfunction + tampon use or surgical wound — remove source, IV antibiotics, fluid resuscitation",
    ],
    pearls: [
      "A patient develops urticaria, throat tightening, and hypotension minutes after a penicillin injection. This is anaphylaxis. The next best step is epinephrine 0.3 mg IM in the lateral thigh — not diphenhydramine, not steroids, not observation. Antihistamines treat hives; only epinephrine reverses the life-threatening airway and cardiovascular components.",
      "A 65-year-old started on allopurinol 3 weeks ago develops fever, widespread erythema, and painful blistering involving 25% BSA with mucosal erosions. TEN (SJS-TEN overlap). Next best step: stop allopurinol immediately, transfer to a burn unit, ophthalmology consult for eye involvement, nutritional support. IVIg or cyclosporine can be considered, but source removal is the single most important intervention.",
    ],
    pitfalls: [
      "Giving subcutaneous rather than IM epinephrine for anaphylaxis — IM injection into the vastus lateralis achieves faster, more reliable peak levels",
      "Prescribing systemic corticosteroids as primary therapy for TEN — evidence for benefit is lacking and they may increase infection risk in the setting of epidermal barrier loss",
    ],
    practiceTopicSlug: "dermatology-allergic",
  },
]);

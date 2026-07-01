import { defineExamTopics } from "./topic-factory";
import { sigCodeAbbreviationTopic } from "./sig-code-abbreviations";

export const NAPLEX_HIGH_YIELD_TOPICS = defineExamTopics("naplex", [
  {
    slug: "biostatistics-study-design",
    category: "Foundations",
    title: "Biostatistics & Study Design",
    overview:
      "Interpret clinical trial results, understand bias, and apply NNT/NNH to real patient decisions.",
    summary:
      "Biostatistics underpins every evidence-based recommendation pharmacists make. Randomized controlled trials (RCTs) are the gold standard for establishing causality; observational studies (cohort, case-control) identify associations but are prone to confounding. Sensitivity and specificity describe a test's performance: high sensitivity rules out disease (SnNout), high specificity rules in disease (SpPin).\n\nAbsolute risk reduction (ARR) and number needed to treat (NNT = 1/ARR) translate statistical significance into clinical meaning. Relative risk reduction (RRR) can look impressive even when absolute benefit is tiny — always contextualize with baseline risk. Confidence intervals that cross 1.0 (for ratios) or 0 (for differences) indicate non-significance regardless of p-value.\n\nPhase I–IV trial phases have distinct purposes: Phase I assesses safety and pharmacokinetics in healthy volunteers; Phase II evaluates efficacy and dose-finding; Phase III confirms efficacy vs. standard of care in large populations; Phase IV monitors post-marketing safety. Recognizing Type I error (false positive, α) and Type II error (false negative, β) helps pharmacists critically appraise whether a study was adequately powered.",
    keyConcepts: [
      "NNT = 1 / ARR; smaller NNT = greater clinical benefit",
      "NNH = 1 / absolute risk increase; compare to NNT to assess risk-benefit",
      "Sensitivity: true positives / all positives; high sensitivity → good screening test",
      "Specificity: true negatives / all negatives; high specificity → good confirmatory test",
      "p < 0.05 indicates statistical significance but not clinical significance",
      "Confidence interval crossing null (1 or 0) = non-significant result",
      "Intention-to-treat analysis preserves randomization and is preferred over per-protocol",
      "Blinding minimizes performance bias; allocation concealment minimizes selection bias",
    ],
    mustKnowFacts: [
      "RRR can be misleadingly large when baseline risk is very low — always calculate ARR",
      "Phase III trials compare investigational drug to active comparator or placebo in thousands of patients",
    ],
    pearls: [
      "A meta-analysis pools data across multiple studies and increases statistical power, but inherits bias from included studies.",
      "Crossover trials use each patient as their own control, reducing sample size needs but risking carryover effects.",
    ],
    pitfalls: [
      "Confusing relative risk reduction with absolute risk reduction when counseling patients on benefit",
      "Accepting a statistically significant result as clinically meaningful without evaluating effect size",
    ],
    practiceTopicSlug: "pharmacology",
  },
  {
    slug: "antihypertensive-drug-classes",
    category: "Drug Classes",
    title: "Antihypertensive Drug Classes",
    overview:
      "Match antihypertensive mechanism, compelling indications, and key adverse effects for each major class.",
    summary:
      "Hypertension pharmacotherapy is organized around compelling indications and patient-specific factors. ACE inhibitors and ARBs are first-line in diabetes with CKD or proteinuria; ACE inhibitors cause bradykinin-mediated cough (~10–15% incidence) — switch to ARB if intolerable. Both classes are teratogenic and contraindicated in pregnancy (category D/X effects). Calcium channel blockers (dihydropyridines: amlodipine, nifedipine) are first-line in isolated systolic hypertension and in combination therapy; non-dihydropyridines (diltiazem, verapamil) add rate control for afib but are avoided in heart failure with reduced ejection fraction.\n\nThiazide diuretics (hydrochlorothiazide, chlorthalidone) are first-line for uncomplicated hypertension; they worsen gout, hypokalemia, and hyperglycemia. Beta-blockers reduce mortality post-MI and in systolic heart failure (carvedilol, metoprolol succinate, bisoprolol — the 'three that matter'); non-selective agents mask hypoglycemia tremor in diabetics and can worsen reactive airway disease. Aldosterone antagonists (spironolactone, eplerenone) add benefit in resistant HTN and HFrEF but risk hyperkalemia, especially with ACE inhibitors or ARBs.\n\nCombination therapy is commonly needed. JNC-8 and AHA/ACC 2017 guidelines set targets that vary by age, diabetes status, and CKD stage. Lifestyle modifications (DASH diet, sodium restriction, exercise, weight loss) complement drug therapy and should always be reinforced.",
    keyConcepts: [
      "ACE inhibitor cough → switch to ARB; do not add ARB to ACE inhibitor (dual RAAS blockade increases harm)",
      "Thiazides: hypokalemia, hyperuricemia, hyperglycemia, hyponatremia; avoid in gout",
      "Beta-blockers proven in HFrEF: carvedilol, metoprolol succinate, bisoprolol only",
      "CCB dihydropyridines: reflex tachycardia, peripheral edema (not HF fluid overload)",
      "Non-dihydropyridine CCBs: avoid in HFrEF and with beta-blockers (additive AV block risk)",
      "Spironolactone: gynecomastia; eplerenone is selective but more expensive",
      "Hydralazine + isosorbide dinitrate: indicated in HFrEF for self-identified Black patients",
      "Both ACE inhibitors and ARBs are contraindicated in pregnancy — use labetalol or nifedipine",
    ],
    mustKnowFacts: [
      "Hyperkalemia risk increases significantly when ACE inhibitor or ARB is combined with spironolactone — monitor potassium",
      "Abrupt beta-blocker withdrawal can precipitate rebound angina and hypertensive crisis — always taper",
    ],
    pearls: [
      "Chlorthalidone has a longer half-life and stronger cardiovascular outcomes data than hydrochlorothiazide at equivalent doses.",
      "Amlodipine edema is dose-dependent and due to precapillary vasodilation, not sodium retention — adding an ACE inhibitor can attenuate it.",
    ],
    pitfalls: [
      "Prescribing ACE inhibitor + ARB combination for additional BP reduction — doubles adverse effects without benefit",
      "Using a non-selective beta-blocker (propranolol) in a patient with asthma or COPD",
    ],
    practiceTopicSlug: "cardiovascular-rx",
  },
  {
    slug: "insulin-diabetes-management",
    category: "Drug Classes",
    title: "Insulin & Diabetes Management",
    overview:
      "Master insulin pharmacokinetics, non-insulin agents, monitoring targets, and sick-day rules for the NAPLEX.",
    summary:
      "Diabetes pharmacotherapy testing on NAPLEX spans insulin types, non-insulin agents, monitoring, and counseling. Rapid-acting insulins (lispro, aspart, glulisine) onset within 15 minutes and must be given with or just before meals. Regular insulin peaks at 2–4 hours and is used for scheduled dosing and IV drips. NPH is intermediate-acting with variable peak; glargine/detemir/degludec are basal analogs with no pronounced peak — do not mix glargine in the same syringe with other insulins.\n\nNon-insulin agents each have distinct mechanisms and safety profiles. Metformin remains first-line for type 2 diabetes unless eGFR <30 mL/min (hold; reassess at <45). SGLT2 inhibitors (empagliflozin, dapagliflozin) reduce cardiovascular mortality and HF hospitalization and slow CKD progression; counsel on genital mycotic infections, euglycemic DKA risk, and the need to hold before surgery. GLP-1 receptor agonists (semaglutide, liraglutide) reduce A1C and promote weight loss; counsel on nausea and the need for dose titration.\n\nMonitoring targets: A1C <7% for most adults (less stringent in frail elderly or with hypoglycemia unawareness). Fasting glucose 80–130 mg/dL; postprandial <180 mg/dL. Treat hypoglycemia with the 15-15 rule: 15 g fast-acting carbohydrates, recheck in 15 minutes. Glucagon IM/SC or intranasal glucagon for severe hypoglycemia. Sick-day rules: never abruptly discontinue insulin; monitor glucose and ketones; stay hydrated; contact provider for persistent hyperglycemia or vomiting.",
    keyConcepts: [
      "Rapid-acting: lispro, aspart, glulisine — onset ~15 min; give with meals",
      "Long-acting (basal): glargine once daily; degludec once daily; no pronounced peak",
      "Do not mix glargine with other insulins in same syringe",
      "Metformin: hold if eGFR <30; hold 48 h before contrast; risk of lactic acidosis",
      "SGLT2 inhibitors: CV and renal benefits; euglycemic DKA; mycotic infections; hold peri-op",
      "GLP-1 agonists: weight loss, nausea, inject SQ; pancreatitis warning; MTC risk (contraindicated in MEN2)",
      "DPP-4 inhibitors: weight neutral, low hypoglycemia risk; saxagliptin/alogliptin caution in HF",
      "Thiazolidinediones: weight gain, edema, HF exacerbation, fracture risk; avoid in HF class III/IV",
    ],
    mustKnowFacts: [
      "Insulin storage: unopened vials in refrigerator; opened vials room temperature up to 28–30 days depending on product",
      "U-500 insulin is 5× more concentrated than U-100 — use dedicated U-500 syringe or pen to avoid fatal dosing errors",
    ],
    pearls: [
      "Empagliflozin and dapagliflozin have HF indication regardless of diabetes status — know the dual indication.",
      "Beta-blockers blunt tachycardia during hypoglycemia; sweating is preserved — teach patients to monitor glucose more frequently.",
    ],
    pitfalls: [
      "Mixing glargine insulin with rapid-acting insulin in the same syringe — glargine precipitates and changes pharmacokinetics",
      "Continuing metformin in a patient whose eGFR has fallen below 30 mL/min without reassessment",
    ],
    practiceTopicSlug: "endocrine-rx",
  },
  {
    slug: "drug-interactions-qt-prolongation",
    category: "Safety",
    title: "Drug Interactions & QT Prolongation",
    overview:
      "Identify clinically significant pharmacokinetic and pharmacodynamic interactions that cause patient harm.",
    summary:
      "Drug interactions on NAPLEX span pharmacokinetic (PK) and pharmacodynamic (PD) mechanisms. PK interactions most commonly involve CYP450 enzymes: inhibitors (e.g., fluconazole, clarithromycin, amiodarone) increase substrate drug levels and toxicity; inducers (e.g., rifampin, carbamazepine, St. John's wort) reduce efficacy. CYP3A4 metabolizes over half of marketed drugs — fluconazole + simvastatin risks myopathy; clarithromycin + warfarin risks bleeding; rifampin + warfarin or tacrolimus requires dramatic dose increases.\n\nQT prolongation leads to torsades de pointes (TdP), a potentially fatal ventricular arrhythmia. High-risk drugs include antiarrhythmics (amiodarone, sotalol, dofetilide), antipsychotics (haloperidol, thioridazine, ziprasidone), antibiotics (azithromycin, fluoroquinolones, clarithromycin), antiemetics (ondansetron IV >32 mg), and antifungals. Additive QT risk with polypharmacy is a key clinical scenario. Risk is amplified by hypokalemia, hypomagnesemia, bradycardia, female sex, and baseline QTc >500 ms.\n\nPharmacodynamic interactions include additive CNS depression (opioids + benzodiazepines), additive bleeding risk (NSAIDs + anticoagulants), serotonin syndrome (SSRIs + tramadol or linezolid), and additive nephrotoxicity (aminoglycosides + vancomycin). Always assess the interaction by mechanism, severity, and whether monitoring or dose adjustment can mitigate the risk.",
    keyConcepts: [
      "CYP3A4 inhibitors (fluconazole, clarithromycin) increase statin levels → myopathy risk",
      "Rifampin: potent inducer; significantly reduces warfarin, tacrolimus, hormonal contraceptives",
      "Azole antifungals + warfarin: CYP2C9 inhibition → elevated INR → bleeding risk",
      "QT-prolonging combinations: additive risk especially with electrolyte abnormalities",
      "Serotonin syndrome: SSRIs/SNRIs + tramadol, linezolid, or MAOIs → hyperthermia, clonus, agitation",
      "Tyramine-MAOI interaction: hypertensive crisis with aged cheese, cured meats, tap beer",
      "NSAIDs + anticoagulants: additive GI bleeding risk; also reduce renal prostaglandins",
      "Grapefruit juice inhibits CYP3A4 in gut wall — avoid with many statins, CCBs, immunosuppressants",
    ],
    mustKnowFacts: [
      "Azithromycin + QT-prolonging drug (e.g., haloperidol): additive TdP risk — review patient's QTc and electrolytes before dispensing",
      "St. John's wort is a CYP3A4/P-gp inducer — reduces effectiveness of oral contraceptives, HIV antiretrovirals, and cyclosporine",
    ],
    pearls: [
      "QTc >500 ms or increase of >60 ms from baseline is the threshold to strongly consider alternative therapy.",
      "When an inhibitor is added to a CYP substrate, think about reducing the substrate dose proactively rather than waiting for toxicity.",
    ],
    pitfalls: [
      "Overlooking P-glycoprotein interactions with digoxin — amiodarone, clarithromycin, and dronedarone can double digoxin levels",
      "Assuming a non-prescription drug or supplement is interaction-free without verification",
    ],
    practiceTopicSlug: "pharmacology",
  },
  {
    slug: "calculations-drip-rates",
    category: "Calculations",
    title: "IV Drip Rate Calculations",
    overview:
      "Calculate infusion rates, weight-based doses, and flow rates for high-alert IV medications with confidence.",
    summary:
      "IV drip rate calculations are a core NAPLEX competency and directly affect patient safety. The universal flow-rate formula is: Rate (mL/hr) = Dose (mcg/kg/min) × Weight (kg) × 60 min/hr ÷ Concentration (mcg/mL). Always identify the ordered dose unit (mcg/kg/min, mg/hr, units/hr), the drug concentration in the bag, and patient weight in kg before calculating.\n\nHigh-alert infusions require special attention: heparin infusions are weight-based (units/kg/hr); vasopressors like norepinephrine are titrated in mcg/kg/min; insulin drips are units/hr requiring frequent glucose checks. Loading doses are calculated separately from maintenance infusions. Verify final units match ordered units — convert mg to mcg (×1000) or mcg to mg (÷1000) as needed.\n\nDrops per minute calculations apply when an electronic pump is unavailable: Drops/min = Volume (mL) × Drop set factor (gtts/mL) ÷ Time (min). Common drop factors are 10, 15, or 60 gtts/mL (microdrip). For continuous infusions, recalculate when concentration changes or patient weight changes significantly. Document all calculations clearly and have a colleague independently verify high-alert drips when policy requires.",
    keyConcepts: [
      "Rate (mL/hr) = [Dose (mcg/kg/min) × Weight (kg) × 60] ÷ Concentration (mcg/mL)",
      "Always confirm weight in kg; verify concentration of IV admixture",
      "Heparin infusions: dosing based on weight and aPTT — follow institutional nomogram",
      "Vasopressor titration: small rate changes cause significant hemodynamic effects",
      "Drops/min = Volume × Drop factor ÷ Time in minutes",
      "Loading dose = Vd × Cp (desired) — separate calculation from maintenance rate",
      "Insulin drip: start glucose check every 1–2 hours until stable",
      "Unit conversions: 1 g = 1,000 mg = 1,000,000 mcg; 1 mg/mL = 1,000 mcg/mL",
    ],
    mustKnowFacts: [
      "Dopamine at 1–5 mcg/kg/min: primarily renal/splanchnic vasodilation; at >10 mcg/kg/min: predominantly alpha vasoconstriction",
      "Heparin and insulin are high-alert medications requiring independent double-checks per most institutional policies",
    ],
    pearls: [
      "Dimensional analysis (factor-label method) is the most error-resistant calculation approach — set up all units to cancel systematically.",
      "When a patient's weight changes significantly during a hospitalization, recalculate all weight-based infusion rates.",
    ],
    pitfalls: [
      "Forgetting to convert mcg to mg (or vice versa) when the concentration is expressed in different units than the ordered dose",
      "Calculating dose based on total body weight when lean body weight or ideal body weight is indicated (e.g., aminoglycosides in obesity)",
    ],
    practiceTopicSlug: "compounding-calculations",
  },
  {
    slug: "calculations-creatinine-clearance",
    category: "Calculations",
    title: "Renal Dosing & Creatinine Clearance",
    overview:
      "Apply Cockcroft-Gault and other equations to adjust drug doses in renal impairment accurately.",
    summary:
      "Renal dosing adjustment is among the most frequently tested NAPLEX calculation topics because incorrect dosing causes toxicity or treatment failure. The Cockcroft-Gault (CG) equation estimates creatinine clearance (CrCl): CrCl (mL/min) = [(140 − Age) × IBW (kg)] ÷ [72 × SCr (mg/dL)], multiplied by 0.85 for females. Use ideal body weight (IBW) unless actual body weight is lower; use adjusted body weight when the patient is obese (>30% above IBW).\n\nFor drug dosing, eGFR from CKD-EPI or MDRD is used for staging CKD, but CrCl from CG is typically the basis for package insert dosing thresholds. Critical drugs requiring renal adjustment include renally cleared antibiotics (vancomycin, aminoglycosides, beta-lactams at extremes), direct oral anticoagulants (apixaban, rivaroxaban, dabigatran), gabapentin, metformin, and digoxin. Vancomycin monitoring has shifted to AUC-guided dosing (AUC:MIC 400–600 mg·h/L) over trough-only monitoring in current guidelines.\n\nIn severe renal impairment or end-stage renal disease (ESRD) on dialysis, assess whether the drug or its active metabolites are dialyzable. Supplemental dosing after hemodialysis is required for dialyzable drugs (e.g., acyclovir, certain cephalosporins, vancomycin to some extent). Always check the package insert or a renal dosing resource when managing a renally impaired patient — never assume standard doses apply.",
    keyConcepts: [
      "CrCl = [(140 − Age) × Weight] ÷ [72 × SCr] × 0.85 (female)",
      "Use IBW in CG unless actual weight < IBW; use AdjBW if obese",
      "Serum creatinine may be misleadingly low in elderly, cachectic, or low muscle mass patients",
      "Dabigatran is primarily renally cleared (~80%) — avoid if CrCl <30 mL/min",
      "Apixaban renal criteria (2-of-3 rule): SCr ≥1.5 mg/dL, age ≥80, weight ≤60 kg → reduce dose",
      "Aminoglycosides: once-daily dosing preferred; AUC/MIC-guided monitoring limits nephrotoxicity",
      "Metformin: reduce dose at eGFR 30–45; contraindicated below 30 mL/min",
      "Gabapentin: dose reduce proportionally with CrCl below 60 mL/min; dialyzable",
    ],
    mustKnowFacts: [
      "A stable serum creatinine does not mean stable renal function in elderly or malnourished patients — consider 24-hour urine or use Cockcroft-Gault carefully",
      "Vancomycin AUC-guided dosing target: AUC:MIC 400–600 mg·h/L for MRSA infections per current guidelines",
    ],
    pearls: [
      "In a 90-year-old with a SCr of 0.8 mg/dL, CrCl may be only 20–30 mL/min — never assume normal renal function from a 'normal' creatinine.",
      "Ibuprofen and NSAIDs reduce renal perfusion — can acutely worsen renal function and raise SCr, requiring drug dose reassessment.",
    ],
    pitfalls: [
      "Using total body weight instead of ideal or adjusted body weight in an obese patient for Cockcroft-Gault — overestimates CrCl",
      "Failing to adjust renal doses when a patient's CrCl drops during hospitalization (e.g., due to sepsis, contrast, or NSAID use)",
    ],
    practiceTopicSlug: "compounding-calculations",
  },
  {
    slug: "antibiotics-stewardship",
    category: "Drug Classes",
    title: "Antibiotics & Antimicrobial Stewardship",
    overview:
      "Select empiric antibiotics by infection site, de-escalate based on culture results, and apply stewardship principles.",
    summary:
      "Antimicrobial stewardship integrates pharmacokinetics, spectrum, safety, and local resistance patterns to optimize outcomes and prevent resistance. Empiric selection is based on likely pathogens for a given infection source: community-acquired pneumonia (CAP) typically requires a respiratory fluoroquinolone or beta-lactam plus macrolide; healthcare-associated pneumonia may require broader gram-negative coverage and MRSA coverage. Culture results should trigger de-escalation to the narrowest effective agent as soon as possible.\n\nBeta-lactams (penicillins, cephalosporins, carbapenems) are beta-lactamase-susceptible — beta-lactamase inhibitor combinations (amoxicillin-clavulanate, piperacillin-tazobactam) extend spectrum. Cephalosporins progress in generation from primarily gram-positive (1st: cefazolin) to balanced (2nd) to expanded gram-negative (3rd: ceftriaxone) to anti-pseudomonal (4th: cefepime). Carbapenems are reserved for multidrug-resistant organisms; unnecessary use selects for carbapenem-resistant Enterobacterales (CRE).\n\nMRSA coverage requires vancomycin, daptomycin, or linezolid — no beta-lactam covers MRSA except ceftaroline. C. difficile infection treatment depends on severity: non-severe CDI uses oral vancomycin or fidaxomicin (preferred over metronidazole); severe or fulminant CDI requires oral vancomycin ± IV metronidazole. Stewardship principles include dose optimization, IV-to-oral switch criteria, defined treatment durations, and pharmacist-led prospective audit and feedback.",
    keyConcepts: [
      "Empiric selection: consider site of infection, likely pathogens, severity, local antibiogram",
      "De-escalate to narrowest spectrum once culture and sensitivities return",
      "MRSA: vancomycin, daptomycin (not pulmonary), linezolid, ceftaroline",
      "Pseudomonas coverage: pip-tazo, cefepime, ceftazidime, aztreonam, meropenem, ciprofloxacin (check resistance)",
      "C. diff: oral vancomycin or fidaxomicin (preferred); avoid unnecessary broad-spectrum antibiotics",
      "Aminoglycosides: concentration-dependent; once-daily dosing maximizes peak:MIC and reduces nephrotoxicity",
      "Fluoroquinolones: reserve for appropriate indications; associated with Achilles tendon rupture, QT prolongation, CDI",
      "IV-to-oral switch: when patient is afebrile, hemodynamically stable, and able to take oral medications",
    ],
    mustKnowFacts: [
      "Penicillin allergy cross-reactivity with cephalosporins: true cross-reactivity is ~1–2% for anaphylaxis; detailed allergy history guides decision",
      "Daptomycin is inactivated by pulmonary surfactant — do not use for pneumonia; use for bacteremia and skin infections",
    ],
    pearls: [
      "The postantibiotic effect (PAE) of aminoglycosides and fluoroquinolones supports once-daily dosing — bacterial suppression continues after drug concentration falls below MIC.",
      "Tigecycline achieves poor serum/urine concentrations — avoid for bacteremia or urinary tract infections despite its broad spectrum.",
    ],
    pitfalls: [
      "Continuing empiric broad-spectrum antibiotics after culture results guide narrowing — missed stewardship opportunity",
      "Using oral metronidazole as first-line therapy for non-severe C. difficile infection — current IDSA guidelines favor oral vancomycin or fidaxomicin",
    ],
    practiceTopicSlug: "infectious-disease-rx",
  },
  {
    slug: "adverse-drug-reactions",
    category: "Safety",
    title: "Adverse Drug Reactions & Monitoring",
    overview:
      "Recognize high-yield ADR patterns, classify by type, and identify drugs with critical monitoring parameters.",
    summary:
      "Adverse drug reactions (ADRs) account for a significant proportion of hospital admissions and are a core NAPLEX safety domain. Type A reactions are predictable, dose-related extensions of pharmacologic effect (e.g., bradycardia from beta-blockers, hypoglycemia from insulin). Type B reactions are unpredictable, immune-mediated, or idiosyncratic and can occur at any dose (e.g., penicillin anaphylaxis, abacavir hypersensitivity, HLA-B*5701 pharmacogenomics).\n\nHigh-yield ADR associations must be memorized: statins cause myopathy (CK elevation) and rarely rhabdomyolysis — risk increased by CYP3A4 inhibitors; ACE inhibitors cause dry cough (~10–15%) and life-threatening angioedema; NSAIDs cause GI bleeding, renal impairment, and cardiovascular risk; fluoroquinolones cause tendon rupture (especially Achilles in older adults on steroids), QT prolongation, and peripheral neuropathy; clozapine requires weekly then biweekly ANC monitoring for agranulocytosis; methotrexate requires CBC and liver function monitoring; amiodarone requires thyroid, liver, pulmonary, and ophthalmologic monitoring.\n\nPharmacists play a central role in ADR detection, documentation, and reporting to MedWatch. Causality assessment tools (Naranjo scale) help attribute likelihood. Preventable ADRs are often due to drug interactions, incorrect dosing, or failure to adjust for renal/hepatic impairment — areas where pharmacist review is most impactful.",
    keyConcepts: [
      "Type A (predictable): dose-related, common; e.g., hypoglycemia, bradycardia, QT prolongation",
      "Type B (idiosyncratic): unpredictable, immune-mediated; e.g., anaphylaxis, SJS/TEN, agranulocytosis",
      "Statin myopathy: CK >10× ULN with symptoms = rhabdomyolysis; risk elevated with CYP3A4 inhibitors",
      "ACE inhibitor angioedema: can occur months-years into therapy; switch to ARB (ARBs have very low cross-reactivity)",
      "Clozapine: absolute neutrophil count (ANC) monitoring required; dispensed through REMS program",
      "Amiodarone: thyroid (hypo and hyper), pulmonary fibrosis, hepatotoxicity, corneal microdeposits, photosensitivity",
      "Fluoroquinolones: Black Box for tendon rupture, peripheral neuropathy, CNS effects — limit use",
      "Stevens-Johnson Syndrome: early drug discontinuation is the most critical intervention",
    ],
    mustKnowFacts: [
      "Abacavir hypersensitivity is associated with HLA-B*5701 allele — screen all patients before starting; rechallenge is contraindicated",
      "Carbamazepine-induced SJS/TEN risk is significantly higher in patients with HLA-B*1502 (predominantly in Southeast Asian ancestry) — screen before prescribing",
    ],
    pearls: [
      "Serum sickness typically presents 1–3 weeks after drug exposure with fever, rash, and arthralgias — most commonly associated with cefaclor and infliximab.",
      "Drug-induced lupus (DIL) is most commonly caused by hydralazine, procainamide, isoniazid, and minocycline — anti-histone antibodies are a marker.",
    ],
    pitfalls: [
      "Attributing ACE inhibitor cough to allergic rhinitis or a new infection without trialing drug discontinuation",
      "Rechallenging a patient with abacavir after a hypersensitivity reaction — potentially fatal",
    ],
    practiceTopicSlug: "pharmacology",
  },
  {
    slug: "patient-counseling",
    category: "Practice",
    title: "Patient Counseling & Medication Adherence",
    overview:
      "Deliver actionable, patient-centered counseling that improves adherence, safety, and health literacy.",
    summary:
      "Effective patient counseling is a direct NAPLEX competency that integrates pharmacist communication skills with drug knowledge. The Indian Health Service (IHS) Counseling Model — ask-tell-ask — confirms what the patient already knows before adding information, then verifies understanding. The 'teach-back' method confirms comprehension: ask the patient to explain the regimen in their own words, not just 'Do you understand?'\n\nHigh-priority counseling points are drug-specific but certain themes recur on NAPLEX: timing relative to food (levothyroxine: 30–60 minutes before breakfast; bisphosphonates: 30 minutes before first food with full glass of water and remain upright); storage requirements (nitroglycerin: dark container, room temperature, discard after 6 months of opening; insulin: room temperature when opened); specific adverse effect monitoring (warfarin: bleeding, diet consistency); and drug interactions with common OTC products or supplements.\n\nAdherence barriers include cost, side effects, complexity of regimen, health literacy, and cultural factors. Pharmacists can recommend pill organizers, synchronize refills, simplify regimens through therapeutic substitution, and connect patients with patient assistance programs. Motivational interviewing techniques — open-ended questions, affirmations, reflective listening, and summarizing — improve adherence conversations without confrontation.",
    keyConcepts: [
      "Ask-tell-ask: assess baseline knowledge before counseling; verify understanding after",
      "Teach-back: 'Show me how you would take this medication' — not yes/no questions",
      "Levothyroxine: take on empty stomach, 30–60 min before food; separate from calcium, iron, PPI",
      "Bisphosphonates (alendronate): full glass of water; remain upright 30 min; take before first food or drink of day",
      "Nitroglycerin SL: up to 3 tablets 5 min apart for acute chest pain; call 911 if no relief after first tablet",
      "Warfarin counseling: consistent vitamin K intake; no NSAID without MD; bleeding signs; clinic adherence",
      "Metronidazole: avoid alcohol during and 48–72 h after last dose (disulfiram-like reaction)",
      "Hormonal contraceptives: what to do with missed doses depends on pill type and day missed",
    ],
    mustKnowFacts: [
      "MTM (Medication Therapy Management) comprehensive medication review (CMR) is provided by pharmacists to high-risk Medicare Part D patients to optimize drug therapy",
      "Health literacy affects up to 36% of U.S. adults — use plain language, pictures, and large print when indicated",
    ],
    pearls: [
      "Rifampin and certain antiseizure drugs reduce hormonal contraceptive effectiveness — counsel on backup contraception and consider a non-hormonal method.",
      "Sildenafil and other PDE5 inhibitors must not be used within 24–48 hours of nitrate administration — absolute contraindication due to severe hypotension risk.",
    ],
    pitfalls: [
      "Providing counseling in medical jargon without confirming comprehension — patient may nod without understanding",
      "Failing to counsel on the Medguide or medication guide for REMS-required drugs (e.g., isotretinoin, thalidomide, clozapine)",
    ],
    practiceTopicSlug: "patient-counseling",
  },
  {
    slug: "immunizations",
    category: "Public Health",
    title: "Immunizations & Vaccine Counseling",
    overview:
      "Apply CDC immunization schedules, identify contraindications, and counsel patients on common vaccines.",
    summary:
      "Pharmacists are frontline immunizers and must master CDC schedules, contraindications, and patient communication for all common vaccines. Routine adult vaccines include influenza (annually), Tdap (once in adulthood, then Td every 10 years), Shingrix (2-dose series: ≥50 years), pneumococcal vaccines (PCV20 or PCV15 followed by PPSV23 per current schedule), HPV (through age 26 routinely; shared decision-making through age 45), COVID-19 per current CDC guidance, and hepatitis A/B for those at risk.\n\nContraindications are divided into true contraindications and precautions. True contraindications to live vaccines (MMR, varicella, LAIV, yellow fever) include severe immunocompromise (HIV with CD4 <200, chemotherapy, high-dose corticosteroids ≥20 mg/day prednisone equivalent for >14 days, primary immunodeficiency) and pregnancy. Anaphylaxis to a vaccine component (e.g., egg for yellow fever, gelatin for varicella) is a true contraindication to that specific vaccine. ACIP distinguishes a true contraindication from a precaution — minor illness without fever is NOT a contraindication.\n\nStorage is critical: live vaccines (varicella, MMRV) must be stored frozen at −50° to −15°C; others refrigerated at 2–8°C. Never freeze inactivated vaccines — freezing destroys potency. Document lot number, manufacturer, date, site, route, and VIS date given per federal law. Observe patients for 15 minutes after vaccination (30 minutes if prior allergic reaction) for anaphylaxis management.",
    keyConcepts: [
      "Live vaccines contraindicated in pregnancy and immunocompromise: MMR, varicella, LAIV, yellow fever",
      "Shingrix (RZV): recombinant, adjuvanted; preferred over Zostavax; 2 doses 2–6 months apart; ≥50 years",
      "PCV20 (Prevnar 20): single dose covers most pneumococcal serotypes in adults ≥65",
      "Influenza: inactivated vaccines safe in pregnancy; LAIV avoided in pregnancy and immunocompromise",
      "Tdap in pregnancy: 27–36 weeks gestation per dose (each pregnancy)",
      "Anaphylaxis kit: epinephrine 1:1000 IM, antihistamine, call 911 — must be on-site when vaccinating",
      "VIS (Vaccine Information Statement): legally required to provide before each vaccine dose",
      "Hepatitis B vaccine: 3-dose series for unvaccinated adults; anti-HBs titer to confirm immunity in healthcare workers",
    ],
    mustKnowFacts: [
      "Egg allergy is NOT a contraindication to influenza vaccination in most cases — patients with hives-only reaction can receive any licensed influenza vaccine in any setting; severe reactions require medical supervision",
      "Varicella and MMRV must be stored frozen — inadvertent refrigerator storage requires the doses to be repeated",
    ],
    pearls: [
      "Immunocompromised patients should receive killed/inactivated vaccines rather than live vaccines and may have reduced immunogenicity — consider checking titers.",
      "Simultaneous administration of most vaccines is acceptable and does not impair immune response — given at different sites.",
    ],
    pitfalls: [
      "Withholding vaccine from a patient with a minor illness, low-grade fever, or current antibiotic use — these are precautions at most, not true contraindications",
      "Storing live attenuated vaccines in the refrigerator instead of the freezer — destroys potency and requires dose replacement",
    ],
    practiceTopicSlug: "patient-counseling",
  },
  {
    slug: "compounding-basics",
    category: "Practice",
    title: "Compounding Fundamentals",
    overview:
      "Apply USP <795> and <797> standards for non-sterile and sterile compounding in practice and on NAPLEX.",
    summary:
      "Pharmaceutical compounding enables individualized drug therapy when commercially available products are unavailable, impractical, or not tolerated. USP <795> governs non-sterile compounding: BUD (beyond-use dates) are assigned based on dosage form and storage conditions. Aqueous oral liquids: ≤14 days refrigerated; non-aqueous preparations: up to 180 days; topicals: up to 30 days room temperature or 180 days refrigerated unless water-containing.\n\nUSP <797> governs sterile compounding and is high-stakes due to infection risk. Cleanroom air quality classifications (ISO 5, 7, 8) define acceptable particle counts and microorganism limits. Assigned BUD for compounded sterile preparations (CSPs) depends on sterility testing, compounding conditions, and category (Category 1 vs. Category 2 per the 2023 revision). Personal protective equipment (PPE) in an ISO 5 environment includes gloves, gown, mask, hair cover, and shoe covers — gloving and gowning order matters.\n\nCritical aseptic technique elements: proper vial entry (swab with 70% IPA, allow to dry), use of needles and syringes correctly sized, maintaining the direct compounding area (DCA) free of turbulence, and passing all materials through the ISO 5 airflow. Calculations in compounding include dilutions, powder volumes, specific gravity conversions, and alligation for mixtures of different concentrations. Pharmacists must verify formulas, check for incompatibilities, label with all required elements, and maintain compounding records.",
    keyConcepts: [
      "USP <795>: non-sterile BUDs based on water activity and storage — aqueous oral: 14 days refrigerated",
      "USP <797>: sterile compounding; ISO 5 environment (LAFW or BSC) required for CSP preparation",
      "ISO 5: ≤3,520 particles ≥0.5 µm/m³; used for actual compounding; ISO 7 for buffer area",
      "PPE in sterile compounding: gloves (sterile), gown, mask, hair cover, shoe covers — glove sterility matters",
      "Alligation: calculate volumes needed to mix two concentrations to reach a target concentration",
      "BUD ≠ expiration date — BUD is assigned after compounding based on USP guidelines and conditions",
      "Incompatibilities: chemical (precipitation, color change), physical (emulsion break), therapeutic (drug interaction)",
      "Compounding records: formula, lot numbers, BUD, preparer, verifier — required for each batch",
    ],
    mustKnowFacts: [
      "Hazardous drug compounding (USP <800>) requires a containment primary engineering control (C-PEC, such as a BSC Class II) and additional PPE including chemotherapy gloves and closed-system transfer devices",
      "503A compounding pharmacies compound for individual patients with a valid prescription; 503B outsourcing facilities can compound in bulk without individual patient prescriptions but are FDA-regulated",
    ],
    pearls: [
      "When calculating powder volume displacement, the volume of reconstituted solution minus the added diluent volume equals the powder volume — critical for accurate final concentration.",
      "Alligation medial (weighted average) determines the ratio of two stock solutions needed to prepare an intermediate concentration: (higher% − desired%) : (desired% − lower%) = volume of lower : volume of higher.",
    ],
    pitfalls: [
      "Confusing BUD with manufacturer expiration date — a compounded preparation's BUD starts on the compounding date, not manufacture date",
      "Entering a laminar airflow workbench (LAFW) without proper gowning or breaking aseptic technique at the DCA — risk of contamination",
    ],
    practiceTopicSlug: "pharmaceutics",
  },
  {
    slug: "otc-triage",
    category: "Practice",
    title: "OTC Triage & Self-Care Counseling",
    overview:
      "Determine when OTC therapy is appropriate versus when to refer, and recommend evidence-based self-care.",
    summary:
      "OTC triage requires pharmacists to distinguish self-limiting conditions amenable to self-care from conditions requiring medical referral. The QuEST/SCHOLAR framework structures the encounter: Quickly and accurately assess, Establish that the patient is an appropriate candidate for self-treatment, Suggest appropriate self-care, and Talk with the patient. SCHOLAR (Symptoms, Characteristics, History, Onset, Location, Aggravating factors, Remitting factors) collects a focused medication history.\n\nRed flags that mandate referral regardless of OTC availability include: chest pain, dyspnea, neurologic symptoms, fever >103°F in adults or any fever in infants <3 months, signs of systemic infection, symptoms lasting longer than expected (cold symptoms >10 days, sore throat >1 week without improvement), pregnancy with first-trimester OTC use, immunocompromised patients, and pediatric patients outside OTC labeling. Product selection must account for comorbidities: pseudoephedrine is contraindicated in uncontrolled hypertension; aspirin is avoided in children with viral illness; bismuth products are avoided in Reye's syndrome risk patients.\n\nHigh-yield OTC categories include: analgesics/antipyretics (acetaminophen, ibuprofen, naproxen), antihistamines (first-generation: diphenhydramine — sedating, anticholinergic; second-generation: loratadine, cetirizine — preferred in elderly and drivers), antacids (aluminum hydroxide: constipation; magnesium hydroxide: diarrhea; calcium carbonate: constipation, alkalosis risk with excess), H2 blockers, PPIs (omeprazole OTC approved for 14 days/course, max 3 courses/year), and loperamide for diarrhea.",
    keyConcepts: [
      "QuEST/SCHOLAR: structured triage for OTC counseling — always assess before recommending",
      "Pseudoephedrine (decongestant): behind-the-counter; limits per Combat Methamphetamine Epidemic Act; avoid in uncontrolled HTN",
      "Phenylephrine (oral): current evidence questions efficacy as a nasal decongestant at OTC doses",
      "Diphenhydramine: avoid in elderly (Beers Criteria) — anticholinergic ADRs; sedation; urinary retention",
      "Acetaminophen: max 3–4 g/day (lower in hepatic impairment or heavy alcohol use); toxicity threshold lower with starvation",
      "Ibuprofen OTC: max 1,200 mg/day; avoid in renal impairment, GI ulcer history, third trimester pregnancy",
      "Loperamide: max OTC dose 8 mg/day (16 mg/day Rx); cardiac risk at supratherapeutic doses",
      "OTC PPIs: omeprazole 20 mg daily × 14 days for frequent heartburn; not for acute heartburn relief",
    ],
    mustKnowFacts: [
      "First-generation antihistamines (diphenhydramine, chlorpheniramine) are on the Beers Criteria for potentially inappropriate use in older adults — recommend second-generation alternatives",
      "Aspirin is contraindicated in children and teenagers with viral illnesses due to Reye's syndrome risk — recommend acetaminophen or ibuprofen instead",
    ],
    pearls: [
      "Intranasal corticosteroids (fluticasone OTC) are more effective than oral antihistamines for allergic rhinitis — recommend for persistent symptoms.",
      "Saline nasal irrigation (neti pot) is a non-pharmacologic option for congestion and post-nasal drip with a strong safety profile.",
    ],
    pitfalls: [
      "Recommending OTC sleep aids (diphenhydramine) as a long-term solution for insomnia — tolerance develops rapidly and cognitive effects are significant in older adults",
      "Overlooking acetaminophen in combination OTC products (cold/flu, PM formulations) when patient is already taking acetaminophen separately — cumulative toxicity risk",
    ],
    practiceTopicSlug: "otc-self-care",
  },
  {
    slug: "anticoagulants",
    category: "Drug Classes",
    title: "Anticoagulants: Heparin, Warfarin & DOACs",
    overview:
      "Master anticoagulant mechanisms, monitoring parameters, reversal agents, and patient counseling for NAPLEX.",
    summary:
      "Anticoagulation is a high-stakes pharmacotherapy area with multiple NAPLEX-tested drugs and distinct monitoring requirements for each. Unfractionated heparin (UFH) works by activating antithrombin III to inhibit thrombin and factor Xa; monitor aPTT (goal 60–100 sec, or per protocol); reverse with protamine sulfate. Low molecular weight heparins (enoxaparin, dalteparin) primarily inhibit factor Xa with more predictable pharmacokinetics — anti-Xa monitoring in renal impairment, obesity, or pregnancy; partial reversal with protamine; dose-reduce in CrCl <30 mL/min.\n\nWarfarin inhibits vitamin K-dependent clotting factor synthesis (II, VII, IX, X, protein C and S). Monitor INR; therapeutic range is typically 2–3 (2.5–3.5 for mechanical mitral valve). Warfarin has a long list of drug and dietary interactions — consistent vitamin K intake is essential. Reversal: hold warfarin; vitamin K (slow reversal); 4-factor PCC (Kcentra) for urgent reversal; FFP as alternative. Initiation of warfarin causes a transient hypercoagulable state due to short half-lives of protein C and S — bridge with heparin for VTE or afib when indicated.\n\nDirect oral anticoagulants (DOACs) offer predictable pharmacokinetics without routine monitoring. Direct thrombin inhibitor: dabigatran (Pradaxa) — reversed by idarucizumab (Praxbind). Factor Xa inhibitors: rivaroxaban, apixaban, edoxaban — reversed by andexanet alfa (Andexxa) for major bleeding. DOACs are renally cleared to varying degrees; assess renal function before prescribing and periodically. Apixaban is least renally cleared (~27%) and preferred in CKD; dabigatran is most renally cleared (~80%) and generally avoided in severe renal impairment.",
    keyConcepts: [
      "UFH: monitor aPTT; reverse with protamine sulfate 1 mg per 100 units UFH given in prior 4 hours",
      "Enoxaparin: anti-Xa monitoring in obesity, pregnancy, CrCl <30 — dose adjust or use UFH",
      "Warfarin: INR goal 2–3 for most VTE/afib; 2.5–3.5 for mechanical mitral valve",
      "Warfarin reversal: hold + vitamin K (PO/IV) for non-urgent; 4-factor PCC for urgent/life-threatening",
      "Dabigatran reversal: idarucizumab (Praxbind) — monoclonal antibody; rapid reversal",
      "Factor Xa inhibitor reversal: andexanet alfa (Andexxa); activated charcoal if <2 hours post-dose",
      "DOAC drug interactions: P-gp and CYP3A4 inhibitors/inducers significantly affect levels",
      "Heparin-induced thrombocytopenia (HIT): platelet count drop 5–14 days after heparin start; stop heparin, start non-heparin anticoagulant (argatroban, fondaparinux, or DOAC)",
    ],
    mustKnowFacts: [
      "Warfarin is initiated with heparin bridge for VTE because protein C and S (natural anticoagulants) decline first, creating a transient hypercoagulable state before full anticoagulation is achieved",
      "HIT is immune-mediated; fondaparinux does not cause HIT and can be used as an alternative anticoagulant",
    ],
    pearls: [
      "Apixaban twice-daily dosing after acute VTE (10 mg BID × 7 days, then 5 mg BID) does not require bridging with heparin — oral-only regimen simplifies treatment.",
      "Rivaroxaban must be taken with the evening meal (15 mg and 20 mg doses) for adequate absorption — food increases bioavailability from ~66% to ~100%.",
    ],
    pitfalls: [
      "Stopping heparin without starting an alternative anticoagulant in a patient with suspected HIT — thrombosis risk remains high",
      "Not dose-adjusting DOACs for renal function or using the wrong reduction criteria — especially critical for dabigatran and rivaroxaban",
    ],
    practiceTopicSlug: "pharmacology",
  },
  {
    slug: "hiv-opportunistic-infections",
    category: "Drug Classes",
    title: "HIV & Opportunistic Infection Prophylaxis",
    overview:
      "Know first-line ART regimens, CD4-based prophylaxis thresholds, and key ARV drug interactions.",
    summary:
      "HIV pharmacotherapy on NAPLEX focuses on antiretroviral (ARV) regimen selection, prophylaxis of opportunistic infections (OIs), and managing drug interactions. Current preferred regimens for treatment-naive adults include an integrase strand transfer inhibitor (INSTI) backbone: bictegravir/tenofovir alafenamide/emtricitabine (Biktarvy) or dolutegravir + tenofovir alafenamide/emtricitabine (Descovy + dolutegravir). INSTIs are preferred due to high efficacy, tolerability, and high barrier to resistance. Tenofovir disoproxil fumarate (TDF) is more nephrotoxic and causes greater bone loss than tenofovir alafenamide (TAF) — use TAF when available.\n\nOI prophylaxis thresholds by CD4 count are NAPLEX-essential: Pneumocystis jirovecii pneumonia (PCP): CD4 <200 cells/mm³ → TMP-SMX daily or dapsone/atovaquone for sulfa allergy. Toxoplasma gondii: CD4 <100 + IgG positive → TMP-SMX. Mycobacterium avium complex (MAC): CD4 <50 → azithromycin weekly or clarithromycin daily. Cryptococcus: not routinely given in resource-rich settings unless history of disease. Prophylaxis is discontinued when CD4 recovers above threshold on ART for at least 3–6 months.\n\nARV drug interactions are extensive: rifampin (potent inducer) is generally contraindicated with most ARVs; rifabutin is preferred for TB treatment in HIV. Dolutegravir must be separated from polyvalent cation-containing antacids, calcium, or iron by 2 hours (take before or 2 hours after). PrEP (pre-exposure prophylaxis) with TAF/emtricitabine (Descovy) or TDF/emtricitabine (Truvada) — confirm HIV-negative status before initiating; do not use in active HIV (resistance development risk).",
    keyConcepts: [
      "Preferred first-line: bictegravir/TAF/FTC (Biktarvy) or dolutegravir + TAF/FTC — INSTI-based",
      "PCP prophylaxis: CD4 <200 — TMP-SMX DS daily (or SS daily); dapsone if sulfa allergy",
      "Toxoplasma prophylaxis: CD4 <100 + positive IgG — TMP-SMX DS daily (same as PCP prophylaxis)",
      "MAC prophylaxis: CD4 <50 — azithromycin 1,200 mg weekly or clarithromycin 500 mg BID",
      "Rifampin contraindicated with most PIs and INSTIs — use rifabutin (weaker inducer) for TB co-infection",
      "Dolutegravir: separate from divalent/trivalent cations by 2 hours; increases metformin levels",
      "TDF: nephrotoxic, reduces bone density; TAF preferred in renal or bone disease",
      "PrEP: confirm HIV-negative status; screen for STIs; renal function before TAF/FTC; quarterly follow-up",
    ],
    mustKnowFacts: [
      "Abacavir (ABC) hypersensitivity is HLA-B*5701-associated — screen before prescribing; do not rechallenge after reaction",
      "Efavirenz (NNRTI): CNS side effects (vivid dreams, dizziness) are common and often decrease after 2–4 weeks — take at bedtime; teratogenic (avoid in first trimester)",
    ],
    pearls: [
      "Immune reconstitution inflammatory syndrome (IRIS) can occur within weeks of starting ART — a paradoxical worsening as immune function recovers and reveals previously subclinical infections.",
      "Unboosted INSTIs (bictegravir, dolutegravir) have fewer drug interactions than pharmacokinetically boosted regimens (cobicistat or ritonavir-boosted PIs/INSTIs) — prefer when managing polypharmacy.",
    ],
    pitfalls: [
      "Starting PrEP without first confirming HIV-negative status — HIV infection with only PrEP is treated as monotherapy and selects for resistance",
      "Administering dolutegravir simultaneously with calcium carbonate or iron supplements without appropriate time separation — significantly reduces dolutegravir absorption",
    ],
    practiceTopicSlug: "infectious-disease-rx",
  },
  {
    slug: "special-populations-pregnancy-lactation",
    category: "Safety",
    title: "Special Populations: Pregnancy & Lactation",
    overview:
      "Identify safe and contraindicated drugs in pregnancy and lactation using current evidence and resources.",
    summary:
      "Prescribing in pregnancy and lactation requires balancing fetal/infant risk against the risk of undertreating maternal disease. The FDA's Pregnancy and Lactation Labeling Rule (PLLR), effective 2015, replaced the letter categories (A, B, C, D, X) with narrative risk summaries for the Pregnancy, Lactation, and Females and Males of Reproductive Potential subsections. However, NAPLEX may still reference the old categories in context — X means fetal risk clearly outweighs benefit; D means evidence of human fetal risk but benefit may justify use.\n\nKey teratogens to know: warfarin (fetal warfarin syndrome, 6–12 weeks); ACE inhibitors/ARBs (fetal renal agenesis, 2nd/3rd trimester); valproic acid (neural tube defects, folic acid supplementation required but does not fully prevent); isotretinoin (iPLEDGE REMS, multiple organ defects — absolute contraindication); methotrexate (embryotoxic — stop ≥3 months before conception); thalidomide (phocomelia — REMS program, two forms of contraception required); tetracyclines (teeth staining, 2nd/3rd trimester); fluoroquinolones (avoided due to arthropathy concern, though evidence in humans is limited); misoprostol (potent uterotonic — avoid in pregnancy except for specific indications).\n\nFor lactation, the LactMed database (NIH) is the gold standard resource. Most drugs transfer into breast milk to some degree; infant dose <10% of maternal weight-adjusted dose is generally considered compatible. Drugs generally safe in lactation: most antibiotics (except tetracyclines, chloramphenicol, high-dose metronidazole), most antihypertensives (avoid atenolol — high milk transfer), SSRIs (sertraline preferred — low milk levels). Drugs to avoid: codeine (risk of fatal neonatal opioid toxicity via ultra-rapid CYP2D6 metabolism); ergotamine (ergot alkaloid suppresses lactation and is neurotoxic); radioactive iodine (pump and discard per radiation safety guidelines).",
    keyConcepts: [
      "Absolute teratogens: warfarin, ACE inhibitors/ARBs, valproic acid, isotretinoin, methotrexate, thalidomide",
      "PLLR replaced letter categories — read narrative risk summary; NAPLEX may still reference old categories contextually",
      "Folic acid 400–800 mcg/day pre-conception and 1st trimester reduces neural tube defect risk; 4 mg/day for high-risk (prior NTD, valproate use)",
      "Safe antihypertensives in pregnancy: labetalol, nifedipine (extended-release), methyldopa — avoid ACE/ARB, avoid atenolol",
      "Gestational diabetes: insulin is preferred (does not cross placenta); glyburide and metformin used but cross placenta",
      "GDM insulin: NPH + regular or basal-bolus with rapid-acting analogs; dose requirements increase with gestational age",
      "Sertraline: preferred SSRI in pregnancy and lactation — best-studied, low milk levels",
      "LactMed (NIH): free database for drug safety in breastfeeding — use as primary reference",
    ],
    mustKnowFacts: [
      "Isotretinoin (iPLEDGE): requires two forms of contraception, monthly pregnancy tests, and electronic confirmation — dispensing without iPLEDGE enrollment is illegal",
      "Codeine is contraindicated in breastfeeding — ultra-rapid CYP2D6 metabolizers convert codeine to morphine at dangerous rates; neonatal deaths have been reported",
    ],
    pearls: [
      "Magnesium sulfate IV is used for eclampsia seizure prophylaxis and fetal neuroprotection before 32 weeks gestation — monitor for toxicity (loss of DTRs, respiratory depression); reverse with calcium gluconate IV.",
      "Low-dose aspirin (81 mg/day) starting at 12–28 weeks is recommended by ACOG for women at high risk of preeclampsia — this is a deliberate exception to the general aspirin-avoidance-in-pregnancy guideline.",
    ],
    pitfalls: [
      "Assuming that because a drug is FDA category B it is entirely safe — category B indicates no adequate human studies but animal studies are reassuring; risk is not zero",
      "Stopping a necessary medication (e.g., antiepileptic or antidepressant) abruptly in pregnancy due to teratogen fear without weighing risk of uncontrolled disease to both mother and fetus",
    ],
    practiceTopicSlug: "patient-counseling",
  },
  sigCodeAbbreviationTopic("naplex"),
]);

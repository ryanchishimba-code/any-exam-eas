import { buildUsmleReviewModule } from "./usmle-module-builder";

export const PHARMACEUTICAL_ADS_ABSTRACTS_STEP3_MODULE = buildUsmleReviewModule({
  why: [
    "Pharmaceutical advertisements and medical abstracts are a distinct Step 3 item type — roughly 10–15% of the exam. These items test whether you can critically appraise industry claims, identify study design limitations, and distinguish statistical from clinical significance.",
    "The classic traps: relative risk reduction without absolute event rates, surrogate endpoints presented as patient outcomes, post-hoc subgroup analyses, and wide confidence intervals crossing the null hypothesis.",
  ],
  concepts: [
    "Drug ad appraisal: study type, population, primary endpoint, absolute vs relative benefit, NNT, conflicts of interest",
    "Relative risk reduction without ARR exaggerates small benefits — always calculate NNT = 1/ARR",
    "Surrogate endpoints (LDL lowering, tumor response) may not translate to hard outcomes (MI, mortality)",
    "Primary vs secondary endpoints — secondary findings are hypothesis-generating, not confirmatory",
    "Abstract structure: population, intervention, comparator, outcomes, follow-up, dropout, ITT vs per-protocol",
    "Intention-to-treat analysis preserves randomization benefits — per-protocol can inflate efficacy",
    "Confidence interval excluding null (1.0 for RR/OR) = statistically significant; wide CI = imprecise estimate",
    "p-value measures probability of data if null true — NOT probability treatment works or effect size",
    "Non-inferiority trials require pre-specified margin — active control must be known effective",
    "Case-control measures OR; cohort measures RR; cross-sectional cannot establish temporality",
    "Lead-time bias: screening detects disease earlier without improving survival time from biologic onset",
    "Length bias: screening preferentially detects slow-growing disease with better prognosis",
    "Meta-analysis: assess heterogeneity (I²), funnel plot for publication bias, quality of included trials",
    "Post-marketing surveillance detects rare ADRs not seen in trials — black box warnings override marketing",
    "Number needed to harm (NNH) = 1/ARI — balance against NNT for net clinical benefit",
  ],
  clinical: [
    "Ad claims 50% RRR for stroke prevention; event rate 2% → 1% (ARR 1%, NNT 100) — small absolute benefit; shared decision-making",
    "Trial primary endpoint LDL reduction 30 mg/dL but no MI/mortality data — surrogate only; cannot assume hard outcome benefit",
    "Abstract: RR 0.85 for mortality, CI 0.65–1.12 — not statistically significant despite point estimate favoring drug",
    "Industry-sponsored RCT with high dropout in treatment arm analyzed per-protocol — biased toward efficacy; ITT preferred",
    "Screening trial shows improved 5-year survival for cancer — lead-time bias possible; look for mortality reduction",
    "Meta-analysis I² = 75% — substantial heterogeneity; pooling may be inappropriate; examine subgroups and study quality",
    "Non-inferiority trial of new anticoagulant vs warfarin with margin not pre-specified — invalid design conclusion",
    "Post-hoc subgroup 'benefit in women over 65' — hypothesis-generating only; not basis for labeling claim",
    "Drug ad fine print: NNH 50 for serious bleeding vs NNT 100 for stroke prevention — net benefit depends on patient values",
    "Case-control study of drug and cancer reports OR 2.5 — cannot calculate incidence; confounding by indication possible",
  ],
  tables: [
    {
      caption: "Appraising a drug advertisement",
      headers: ["Question", "What to look for", "Red flag"],
      rows: [
        ["Study design?", "RCT preferred", "Observational only"],
        ["Primary endpoint?", "Hard clinical outcome", "Surrogate only (LDL, A1c)"],
        ["Absolute benefit?", "Event rates in both arms", "RRR alone without ARR/NNT"],
        ["Population?", "Matches your patient?", "Exclusion of elderly, CKD, comorbidities"],
        ["Funding?", "Disclose conflicts", "Industry-only sponsorship undisclosed"],
        ["Safety?", "NNH for serious harms", "Minimized adverse events"],
      ],
    },
    {
      caption: "Statistical vs clinical significance",
      headers: ["Finding", "Statistical", "Clinical", "Conclusion"],
      rows: [
        ["RR 0.90, p=0.04, ARR 0.5%", "Significant", "NNT 200 — small", "May not be worth cost/harm"],
        ["RR 0.70, CI 0.45–1.08", "Not significant", "Large point estimate", "Underpowered; inconclusive"],
        ["LDL ↓40 mg/dL", "Significant", "Surrogate", "Need hard outcome trial"],
        ["NNH 20, NNT 100", "—", "Harm > benefit?", "Individualize decision"],
      ],
    },
    {
      caption: "Study design and appropriate measures",
      headers: ["Design", "Measure", "Can establish causation?", "Common bias"],
      rows: [
        ["RCT", "RR, ARR, NNT", "Yes (gold standard)", "Attrition, unblinding"],
        ["Prospective cohort", "RR, incidence", "Strong", "Confounding"],
        ["Case-control", "OR", "Moderate", "Recall, selection"],
        ["Cross-sectional", "Prevalence", "No (temporality)", "Survival, selection"],
        ["Meta-analysis", "Pooled RR/OR", "Depends on inputs", "Heterogeneity, publication bias"],
      ],
    },
    {
      caption: "Screening trial biases",
      headers: ["Bias", "Mechanism", "Effect on apparent benefit"],
      rows: [
        ["Lead-time", "Earlier diagnosis, same death date", "Inflates survival from diagnosis"],
        ["Length", "Detects indolent disease preferentially", "Overestimates screening benefit"],
        ["Selection", "Volunteers healthier", "Overestimates benefit in real population"],
      ],
    },
  ],
  visual: [
    "Drug ad deconstruction: headline RRR → find absolute rates → calculate NNT → assess harms (NNH)",
    "Forest plot reading: point estimate, CI crossing 1.0, heterogeneity I²",
    "Surrogate vs hard endpoint chain: LDL → plaque → MI → death (need trials at each link)",
    "ITT vs per-protocol: all randomized patients analyzed in assigned groups regardless of adherence",
    "Funnel plot asymmetry suggests publication bias in meta-analyses",
  ],
  misconceptions: [
    "Accepting surrogate endpoint improvement as patient outcome without hard endpoint data",
    "Ignoring confidence interval because p <0.05 — CI can still cross null",
    "Treating post-hoc subgroups as confirmatory findings — hypothesis-generating only",
    "Using OR as RR when outcome is common — OR exaggerates association vs RR",
    "Assuming screening survival benefit equals mortality benefit — lead-time and length bias",
  ],
  pearls: [
    "Always convert RRR to ARR and NNT before recommending a drug from an ad",
    "CI crossing 1.0 for RR/OR = not statistically significant — regardless of p-value nuances",
    "Primary endpoint wins; secondary endpoints are exploratory unless multiplicity adjusted",
    "Non-inferiority margin must be pre-specified — otherwise trial cannot claim non-inferiority",
    "Black box warnings and post-marketing data override marketing language",
  ],
  summary: [
    "Drug ads: find absolute event rates, calculate NNT, assess NNH and conflicts of interest",
    "Surrogate endpoints ≠ patient outcomes unless trial powered for hard endpoints",
    "ITT preferred; post-hoc subgroups hypothesis-generating only",
    "CI excluding null = significant; wide CI = imprecise — more informative than p alone",
    "Screening biases: lead-time, length, selection — look for mortality reduction not just survival",
  ],
});

/** Step 3 "next best step" decision framework — highest-yield MCQ pattern. */
export const NEXT_BEST_STEP_STEP3_MODULE = buildUsmleReviewModule({
  why: [
    "'Next best step' is the most common Step 3 vignette format. The correct answer is the single action that should happen first among several eventually necessary steps — not the most complete workup or the definitive long-term therapy.",
    "Board writers include options that are true but delayed, incomplete for acuity, or contraindicated for this patient. Unstable patients always get ABCs and life-threatening treatment before elective testing.",
  ],
  concepts: [
    "Unstable → resuscitation before diagnosis (except simultaneous stat tests that change immediate management)",
    "Stable → most sensitive/specific test or first-line therapy for most likely diagnosis",
    "Treat before LP delay when bacterial meningitis with sepsis — antibiotics after cultures if possible, not before when delay harmful",
    "STEMI: reperfusion beats arranging outpatient stress test",
    "Symptomatic hypoglycemia: glucose before adjusting basal insulin",
    "Tension pneumothorax: needle decompression before CT",
    "Ectopic pregnancy unstable: OR; stable and criteria met: methotrexate",
    "Patient-specific contraindications: pregnancy, allergy, renal function, anticoagulation",
    "Definitive vs temporizing: chest tube before OR for tension PTX; OR for perforated viscus",
  ],
  clinical: [
    "Crushing chest pain + ST elevation → activate reperfusion; not troponin trend alone",
    "Altered mental status → fingerstick glucose before CT",
    "Anaphylaxis → IM epinephrine lateral thigh; not oral antihistamine alone",
    "Active GI bleed unstable → resuscitate + PPI ± endoscopy pathway; not colonoscopy first for melena when hemodynamically unstable (upper source until proven)",
    "Febrile neonate → full sepsis workup + empiric antibiotics + admit",
    "Status epilepticus → benzodiazepine → second-line AED → ICU if refractory",
  ],
  tables: [
    {
      caption: "Priority ladder for next-best-step items",
      headers: ["Priority", "Examples", "Wrong-but-tempting option"],
      rows: [
        ["Life threat", "Airway, breathing, circulation", "Comprehensive metabolic panel only"],
        ["Time-critical diagnosis treatment", "tPA window, antibiotics in meningitis", "Outpatient follow-up"],
        ["Rule-out emergency", "ECG, glucose, pregnancy test", "MRI brain first"],
        ["Definitive therapy", "Insulin in DKA after K⁺ check", "Oral metformin in DKA"],
        ["Disposition/plan", "Admit, follow-up, education", "Discharge without treating cause"],
      ],
    },
  ],
  visual: [
    "ABCs triangle before diagnostic tree in every unstable vignette",
    "Two correct answers → pick the one that happens first AND matches acuity",
  ],
  misconceptions: [
    "Choosing comprehensive workup when single emergent intervention needed",
    "Selecting long-term management before acute stabilization",
    "Ignoring 'first' or 'most appropriate initial' wording in stem",
  ],
  pearls: [
    "When two answers seem correct, ask: which happens in the next 5 minutes?",
    "Stable outpatient vignettes favor guideline first-line therapy over subspecialty referral first",
  ],
  summary: [
    "Unstable → ABCs and treat life threats immediately",
    "Stable → best test or first-line therapy for leading diagnosis",
    "Read 'initial,' 'first,' and 'next' literally — sequence matters",
  ],
});

/** CCS monitoring, escalation, and disposition — second half of case simulations. */
export const CCS_MONITORING_ESCALATION_STEP3_MODULE = buildUsmleReviewModule({
  why: [
    "After initial stabilization, Step 3 CCS cases test whether you monitor appropriately, recognize deterioration, escalate level of care, and discharge safely. Many failures come from advancing time without new orders when the patient worsens.",
    "Monitoring frequency, repeat labs, and consult timing must match acuity. Improvement allows de-escalation; deterioration demands ICU, procedure, or broader antibiotics.",
  ],
  concepts: [
    "Set vital sign frequency: q15min when unstable, q4h when stable on floor",
    "Repeat lactate in sepsis — clearance guides resuscitation",
    "Transfer to ICU: vasopressor requirement, invasive ventilation, active arrhythmia with instability",
    "Failure of medical management → procedural/surgical intervention (drain empyema, OR for peritonitis)",
    "Improvement → wean oxygen, transition IV to PO, plan discharge with follow-up",
    "Discharge criteria: hemodynamically stable, PO intake, pain controlled, safe support at home",
    "High-risk discharges: CHF (weight monitoring), DKA (insulin teaching), PE (anticoagulation adherence)",
    "Document rationale when escalating or refusing discharge",
  ],
  clinical: [
    "Pneumonia day 2: fever, rising WBC — broaden coverage or drain loculated effusion; do not discharge",
    "CHF patient +10 lb weight gain — increase diuretic before discharge",
    "Post-op tachycardia POD 3 anastomosis — CT for leak before treating as pneumonia alone",
    "Asthma: peak flow improved after nebulizer — observe, then discharge with steroid taper Rx",
    "PE on anticoagulation — ensure LMWH/DOAC prescription and follow-up INR if warfarin",
  ],
  tables: [
    {
      caption: "Escalation triggers",
      headers: ["Finding", "Escalation", "Avoid"],
      rows: [
        ["Hypotension on fluids", "ICU, vasopressors", "Discharge"],
        ["Rising lactate", "Broaden sepsis workup/therapy", "Same abx only"],
        ["New O₂ requirement", "Increase monitoring, ABG", "Routine floor care"],
        ["Altered mental status", "Stat glucose, head CT, ICU if GCS ↓", "Observation only"],
      ],
    },
  ],
  visual: [
    "Vital sign trend arrow at each CCS time block — act on direction not single value",
    "Disposition checklist: stable? PO? controlled? educated? follow-up?",
  ],
  misconceptions: [
    "Advancing clock without orders when patient deteriorated",
    "Discharging patient still on IV vasopressors",
    "Same monitoring frequency after clinical improvement or decompensation",
  ],
  pearls: [
    "CCS punishes failure to repeat assessment after intervention",
    "When in doubt, consult early for time-sensitive conditions (cardiology, surgery, IR)",
  ],
  summary: [
    "Monitor → reassess → escalate OR de-escalate each time block",
    "ICU for vasopressors, ventilation, or close titration needs",
    "Safe discharge = stable + PO regimen + follow-up + return precautions",
  ],
});

/** Ambulatory chronic disease management — Step 3 outpatient vignettes. */
export const AMBULATORY_CHRONIC_CARE_STEP3_MODULE = buildUsmleReviewModule({
  why: [
    "Step 3 heavily tests longitudinal outpatient management: diabetes, hypertension, hyperlipidemia, preventive screening, and medication adherence — not just inpatient emergencies.",
    "Vignettes reward guideline-concordant care, cost-effective testing, and addressing social barriers to adherence.",
  ],
  concepts: [
    "Diabetes: metformin first unless contraindicated; GLP-1/SGLT2i for ASCVD/HF/CKD regardless of A1c when indicated",
    "Hypertension: thiazide/ACEi/ARB/CCB — combine classes for control; goal often <130/80 in diabetics",
    "Statin intensity by 10-year ASCVD risk calculator",
    "Annual diabetes complications screening: retinal exam, urine albumin, foot exam",
    "USPSTF screening: colonoscopy 45–75, mammography individualized, LDCT for high-risk smokers",
    "Avoid low-yield imaging: uncomplicated low back pain <6 weeks without red flags",
    "Medication reconciliation and generic alternatives for cost",
  ],
  clinical: [
    "Type 2 DM + ASCVD → add SGLT2i or GLP-1 with CV benefit",
    "BP 148/92 on lisinopril 10 mg → add thiazide or increase ACEi, not skip to clonidine",
    "Former smoker 30 pack-years → lung cancer screening LDCT",
    "Healthy pre-op cholecystectomy → no routine ECG/CXR without indication",
  ],
  tables: [
    {
      caption: "High-value vs low-value care traps",
      headers: ["Scenario", "High-value", "Low-value trap"],
      rows: [
        ["Low back pain 2 weeks", "NSAIDs, activity", "MRI lumbar spine"],
        ["Stable CAD", "Statin, BP control", "Annual stress test"],
        ["Healthy young pre-op", "Focused history", "Routine labs panel"],
      ],
    },
  ],
  visual: [
    "ASCVD risk calculator inputs → statin intensity decision",
    "Diabetes complications screening calendar at annual visit",
  ],
  misconceptions: [
    "Adding third antihypertensive without assessing adherence and cost",
    "Tight A1c in frail elderly without benefit",
    "Screening low-risk populations with poor PPV",
  ],
  pearls: [
    "Individualize A1c targets — avoid hypoglycemia in elderly",
    "Hepatitis C screen all adults once per USPSTF",
  ],
  summary: [
    "Guideline-concordant chronic care + prevention at every outpatient visit",
    "Address adherence, cost, and SDOH when control is poor",
    "Choose Wisely — avoid unnecessary tests",
  ],
});

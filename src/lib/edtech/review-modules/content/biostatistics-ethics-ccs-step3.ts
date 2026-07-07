import { buildUsmleReviewModule } from "./usmle-module-builder";

/** Full 8-section Step 3 biostatistics module — lecture-replacement depth. */
export const BIOSTATISTICS_USMLE_STEP3_MODULE = buildUsmleReviewModule({
  why: [
    "Biostatistics and epidemiology (~10–15% of Step 3) appear in standalone questions, drug-advertisement items, and journal abstract vignettes. You must interpret sensitivity, NNT, bias, and trial design faster than a semester course would allow.",
    "Step 3 rarely asks you to compute formulas from scratch — it tests whether you can spot misleading relative risk reductions, confidence intervals crossing null, and surrogate endpoints dressed up as patient benefit.",
  ],
  concepts: [
    "Sensitivity = TP/(TP+FN) — high sensitivity rules OUT disease when test is negative (SnNout)",
    "Specificity = TN/(TN+FP) — high specificity rules IN disease when test is positive (SpPin)",
    "PPV/NPV depend on prevalence — same test characteristics, different populations → different predictive values",
    "LR+ = sensitivity/(1−specificity); LR− = (1−sensitivity)/specificity — multiply pre-test odds",
    "NNT = 1/ARR; NNH = 1/ARI — always derive from absolute event rates, not RRR alone",
    "RRR can exaggerate: 50% RRR from 2% → 1% is ARR 1%, NNT 100",
    "Type I error (α): false positive; Type II (β): false negative; power = 1 − β",
    "RCT > cohort > case-control for causation; case-control yields OR, cohort yields RR",
    "Intention-to-treat preserves randomization; per-protocol can bias toward efficacy",
    "Lead-time bias: screening detects disease earlier without changing mortality from biologic onset",
    "Length bias: screening preferentially detects slow-growing, indolent disease",
    "Meta-analysis: assess heterogeneity (I²), funnel plot asymmetry for publication bias",
  ],
  clinical: [
    "Screening mammography in low-risk 30-year-old — high false positive rate despite good sensitivity/specificity",
    "Drug ad claims 50% RRR; event rates 2% vs 1% → NNT 100 — contextualize before recommending",
    "Abstract: RR 0.85 for mortality, CI 0.65–1.12 — not statistically significant despite p=0.04 in some contexts",
    "Case-control study of drug and cancer reports OR 2.5 — cannot calculate incidence; confounding by indication",
    "Screening trial shows improved 5-year survival without mortality benefit — suspect lead-time bias",
    "Non-inferiority trial without pre-specified margin — cannot conclude non-inferiority",
    "Post-hoc subgroup 'benefit in women over 65' — hypothesis-generating only, not confirmatory",
  ],
  tables: [
    {
      caption: "Screening test mnemonics",
      headers: ["Goal", "Test property", "Mnemonic"],
      rows: [
        ["Rule out disease", "High sensitivity", "SnNout"],
        ["Rule in disease", "High specificity", "SpPin"],
        ["Low prevalence", "Low PPV even with good test", "Many false positives"],
      ],
    },
    {
      caption: "Study design hierarchy",
      headers: ["Design", "Measure", "Causation strength"],
      rows: [
        ["RCT", "RR, ARR, NNT", "Strongest"],
        ["Prospective cohort", "RR, incidence", "Strong"],
        ["Case-control", "OR", "Moderate — recall/selection bias"],
        ["Cross-sectional", "Prevalence", "Weak — no temporality"],
      ],
    },
  ],
  visual: [
    "Forest plot: point estimate, CI crossing 1.0 = not significant for RR/OR",
    "Funnel plot asymmetry suggests missing negative trials in meta-analyses",
    "RRR headline → always find absolute control and treatment event rates → NNT",
  ],
  misconceptions: [
    "p-value is not effect size — small clinically meaningless differences can be 'significant' with huge N",
    "High sensitivity does not mean high PPV in low-prevalence populations",
    "Statistical significance ≠ clinical importance — NNT 500 may not justify cost and harm",
    "Using OR as RR when outcome is common — OR exaggerates association",
  ],
  pearls: [
    "Abstract trick: wide CI crossing 1.0 → not significant even if p<0.05 reported without CI",
    "Drug ads: convert RRR to ARR before counseling — always",
    "Meta-analysis I² >50% — question whether pooling is valid",
  ],
  summary: [
    "SnNout / SpPin for test interpretation; PPV/NPV are prevalence-dependent",
    "NNT from ARR; RRR alone is misleading in low baseline risk",
    "ITT preferred over per-protocol; post-hoc subgroups are exploratory",
    "Screening biases: lead-time, length, selection — look for mortality benefit",
  ],
});

export const CCS_CASE_MANAGEMENT_USMLE_MODULE = buildUsmleReviewModule({
  why: [
    "Step 3 CCS-style items reward logical order of operations: stabilize, diagnose, treat, monitor, adjust, discharge. Even standalone MCQs often test 'next best step' in a time sequence.",
    "CCS scoring penalizes shotgun ordering, failure to reassess after treatment, and discharge while the patient is still unstable. Think in loops: order → advance time → read vitals/labs → next decision.",
  ],
  concepts: [
    "Initial block: vitals, IV access, condition-specific stat diagnostics (ECG in chest pain, glucose in AMS)",
    "Sepsis: lactate, cultures, antibiotics ≤1 h, 30 mL/kg crystalloid if hypotensive or lactate ≥4",
    "Chest pain: ECG within 10 min → troponin → ACS pathway before elective testing",
    "DKA: volume resuscitation, K⁺ ≥3.3 before insulin, add dextrose when glucose ~200 while closing gap",
    "Monitoring frequency matches acuity — q15min vitals when unstable",
    "Escalation: floor → ICU for vasopressors, invasive ventilation, or failing response to ward care",
    "Disposition requires stability, PO tolerance, controlled symptoms, and follow-up plan",
    "Avoid duplicate harmful orders — repeat contrast CT in AKI, sedating without airway plan",
  ],
  clinical: [
    "Post-op day 1 fever — incentive spirometry and ambulation before CT for abscess",
    "Asthma exacerbation — repeat bronchodilator, systemic steroid, admit if poor response after reassessment",
    "Unstable angina — aspirin, anticoagulation, cardiology; not outpatient stress test first",
    "Altered mental status — glucose, naloxone, thiamine before CT when indicated",
    "Pneumonia day 2 persistent fever — broaden antibiotics or drain empyema; do not discharge",
    "DKA resolved anion gap — overlap SQ basal-bolus before stopping insulin drip",
  ],
  tables: [
    {
      caption: "CCS time-loop checklist",
      headers: ["Phase", "Actions", "Common miss"],
      rows: [
        ["Initial", "ABCs, targeted labs/imaging", "Skipping ECG in chest pain"],
        ["Treat", "First-line therapy for likely diagnosis", "Elective tests before stabilization"],
        ["Monitor", "Reassess vitals, symptoms, labs", "Advancing time with no new orders when worse"],
        ["Escalate", "ICU, consult, procedure", "Keeping unstable patient on floor"],
        ["Discharge", "Meds, education, follow-up", "Discharge on vasopressors"],
      ],
    },
  ],
  visual: [
    "CCS loop diagram: order set → advance clock → read panel → branch improve vs worsen",
    "Chest pain sequence: ECG → troponin → aspirin → heparin → cardiology",
    "Sepsis bundle timeline: cultures → antibiotics ≤60 min → fluids → repeat lactate",
  ],
  misconceptions: [
    "More tests ≠ better care — unnecessary CT/MRI penalized in CCS",
    "Discharge without reassessment after treatment is always wrong",
    "Consult placed too late when time-sensitive (cath lab, surgery) fails cases",
  ],
  pearls: [
    "One thoughtful order set per time block beats shotgun ordering",
    "Transfer when needed resources exceed current setting (ICU, OR, interventional radiology)",
    "Female of childbearing age — pregnancy test before abdominal CT",
  ],
  summary: [
    "Stabilize → diagnose → treat → monitor → escalate or discharge",
    "Reassess at every time advance — act on worsening vitals",
    "Time-critical pathways first: ACS, sepsis, stroke, ectopic, epiglottitis",
  ],
});

export const MEDICAL_ETHICS_USMLE_STEP3_MODULE = buildUsmleReviewModule({
  why: [
    "Ethics and legal medicine (~8–10% of Step 3) test capacity, consent, confidentiality, and surrogate decision-making in concrete vignettes — not abstract philosophy.",
    "Wrong answers often sound compassionate but violate autonomy, confidentiality, or mandatory reporting statutes. Know the exceptions cold.",
  ],
  concepts: [
    "Capacity: understand, appreciate, reason, communicate — decision-specific, not global",
    "Informed consent: diagnosis, plan, risks/benefits, alternatives, opportunity for questions",
    "Substituted judgment (what patient would want) vs best interest when patient never expressed wishes",
    "Advance directive > healthcare proxy > spouse > adult children (state laws vary — vignette usually clarifies)",
    "Tarasoff: warn identifiable victim of imminent violence; balance with confidentiality",
    "Mandatory reporting: child abuse, elder abuse, certain communicable diseases, impaired colleague",
    "Implied consent for emergent life-saving treatment when patient cannot consent",
    "Mature minor / emancipated minor exceptions for reproductive and STI care in vignettes",
    "Double effect: opioid for pain acceptable when intent is comfort, not hastening death",
  ],
  clinical: [
    "Capacitated adult Jehovah's Witness refuses blood — honor refusal; explore cell-saver/alternatives",
    "Unconscious trauma — implied consent for life-saving surgery; document discussion later",
    "Patient threatens named ex-partner with gun — breach confidentiality to warn and notify authorities",
    "Suspected child abuse with inconsistent history — examine in private, report to CPS",
    "Intoxicated patient refusing surgery for open fracture — capacity impaired; treat as emergency",
    "Colleague physician appears impaired at work — report to institution/chief/medical board, not gossip",
    "Terminal cancer intractable pain — titrate opioids; not physician-assisted suicide when intent is comfort",
  ],
  tables: [
    {
      caption: "Confidentiality exceptions",
      headers: ["Situation", "Action", "Wrong answer"],
      rows: [
        ["Imminent harm to identifiable third party", "Warn/protect (Tarasoff)", "Strict confidentiality"],
        ["Suspected child/elder abuse", "Mandatory report", "Confront family only"],
        ["HIV to partner (public health)", "Notify per law / partner services", "Tell family without consent"],
        ["Gunshot wound", "Report per jurisdiction", "Withhold from law enforcement"],
      ],
    },
  ],
  visual: [
    "Capacity assessment four abilities — fail any one → surrogate decision path",
    "Consent emergency ladder: capacitated → surrogate → implied → court order (rare)",
  ],
  misconceptions: [
    "Family cannot override capacitated patient's refusal — even if they disagree",
    "Beneficence does not trump autonomy in capacitated adults",
    "Contract for safety alone is inadequate for high-risk active suicide with plan and means",
  ],
  pearls: [
    "When in doubt about capacity — assess formally for the specific decision at hand",
    "Document who you spoke with, what was disclosed, and patient understanding for consent",
    "POLST/DNR must be honored — resolve code status discrepancies before procedures",
  ],
  summary: [
    "Autonomy + capacity first — competent refusal is binding",
    "Know Tarasoff, abuse reporting, and public health exceptions",
    "Emergencies: implied consent; surrogates when incapacitated per hierarchy",
  ],
});

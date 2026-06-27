import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

export const BIOSTATISTICS_USMLE_STEP3_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Biostatistics and epidemiology (~10% of Step 3) appear in standalone questions and embedded abstract/drug-ad items. You must interpret sensitivity, NNT, bias, and trial design faster than a biostatistics course would teach.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Sensitivity = TP/(TP+FN) — rules out when negative (SnNout)",
        "Specificity = TN/(TN+FP) — rules in when positive (SpPin)",
        "PPV/NPV depend on prevalence — same test, different populations → different PPV",
        "NNT = 1/ARR; NNH = 1/ARI",
        "RRR can exaggerate: 50% RRR from 2% → 1% is ARR 1%, NNT 100",
        "Type I error (alpha): false positive; Type II (beta): false negative; power = 1 − beta",
        "RCT > cohort > case-control for causation; case-control yields OR, cohort yields RR",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Screening mammography in low-risk 30-year-old — high false positive rate despite good test characteristics",
        "Drug ad: always convert RRR to ARR before counseling patient",
        "CI for RR excluding 1.0 → statistically significant at that confidence level",
        "Lead-time bias: screening detects disease earlier without changing mortality",
        "Intention-to-treat preserves randomization; per-protocol can bias toward efficacy",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "p-value is not effect size",
        "High sensitivity does not mean high PPV",
        "Statistical significance ≠ clinical importance",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "Abstract trick: wide CI crossing 1.0 → not significant even if p<0.05 in some contexts",
        "Meta-analysis: check I² for heterogeneity before trusting pooled estimate",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: ["SnNout SpPin", "NNT from ARR", "Bias types in observational studies"],
    },
  ],
};

export const CCS_CASE_MANAGEMENT_USMLE_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Step 3 CCS-style items reward logical order of operations: stabilize, diagnose, treat, monitor, adjust, discharge. Even MCQs often test 'next best step' in a time sequence.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Initial orders: vitals, IV access, labs, ECG, condition-specific diagnostics",
        "Sepsis: lactate, cultures, antibiotics ≤1 h, fluids 30 mL/kg if indicated",
        "Chest pain: ECG in 10 min → troponin → ACS pathway",
        "DKA: volume, potassium check before insulin, glucose monitoring",
        "Monitoring frequency matches acuity — q15min vitals when unstable",
        "Disposition requires stability, oral regimen, follow-up, patient education",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Post-op day 1 fever — incentive spirometry and ambulation before CT for abscess",
        "Asthma exacerbation — repeat bronchodilator, steroid, then admit if poor response",
        "Unstable angina — aspirin, anticoagulation, cardiology, not stress test first",
        "Altered mental status — glucose, naloxone, thiamine before CT if indicated",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "More tests ≠ better care in CCS — unnecessary orders penalized",
        "Discharge without reassessment after treatment is always wrong",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "CCS loop: order → wait → reassess → next decision",
        "Transfer when needed resources exceed current setting (ICU, surgery)",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: ["Stabilize → diagnose → treat → monitor", "Time-critical pathways first"],
    },
  ],
};

export const MEDICAL_ETHICS_USMLE_STEP3_MODULE: ReviewModuleContent = {
  sections: [
    {
      id: "why-it-matters",
      title: T["why-it-matters"],
      paragraphs: [
        "Ethics and legal medicine (~8% of Step 3) test capacity, consent, confidentiality, and surrogate decision-making in concrete vignettes — not abstract philosophy.",
      ],
    },
    {
      id: "core-concepts",
      title: T["core-concepts"],
      bullets: [
        "Capacity: understand, appreciate, reason, communicate — decision-specific",
        "Informed consent elements: diagnosis, plan, risks/benefits, alternatives, questions",
        "Substituted judgment vs best interest when patient lacks capacity",
        "Advance directive > healthcare proxy > spouse > adult children (state-dependent)",
        "Tarasoff: warn identifiable victim of imminent harm",
        "Mandatory reporting: child abuse, elder abuse, certain diseases",
      ],
    },
    {
      id: "clinical-applications",
      title: T["clinical-applications"],
      bullets: [
        "Capacitated adult refuses blood — respect refusal; document discussion",
        "Unconscious trauma — implied consent for life-saving surgery",
        "Teen mature minor statutes for reproductive/STI care in vignette",
        "Impaired colleague — report to institution/medical board, not public gossip",
      ],
    },
    {
      id: "misconceptions",
      title: T.misconceptions,
      bullets: [
        "Family cannot override capacitated patient's refusal",
        "Beneficence does not trump autonomy in capacitated adults",
      ],
    },
    {
      id: "pearls",
      title: T.pearls,
      bullets: [
        "When in doubt about capacity — assess formally for the specific decision at hand",
        "Jehovah's Witness adult — explore alternatives; no emergent transfusion if competent refusal",
      ],
    },
    {
      id: "quick-summary",
      title: T["quick-summary"],
      bullets: ["Autonomy + capacity first", "Know reporting exceptions"],
    },
  ],
};

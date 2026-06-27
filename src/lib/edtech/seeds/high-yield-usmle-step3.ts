import { defineExamTopics } from "./topic-factory";

/** USMLE Step 3 — biostatistics, ethics, CCS, and pharm ads (Day 1 + Day 2 formats). */
export const USMLE_STEP3_HIGH_YIELD_TOPICS = defineExamTopics("usmle", [
  {
    slug: "biostatistics-epidemiology",
    category: "Step 3 — Foundations",
    title: "Biostatistics & Epidemiology for Step 3",
    overview:
      "Study design, sensitivity/specificity, NNT/ARR, bias, and trial interpretation — heavily tested on Step 3.",
    summary:
      "Step 3 biostatistics items require rapid interpretation of abstracts and drug ads. Sensitivity rules out disease when negative (SnNout); specificity rules in when positive (SpPin). PPV and NPV depend on prevalence — screening tests have low PPV in low-prevalence populations even with high sensitivity/specificity.\n\nNumber needed to treat (NNT) = 1/ARR. Relative risk reduction can exaggerate small absolute benefits. Number needed to harm (NNH) = 1/ARI. Confidence intervals that exclude the null (1.0 for RR/OR) are statistically significant at that level.\n\nStudy designs: RCT > cohort > case-control > cross-sectional for causation. Case-control measures odds ratio; cohort measures relative risk. Lead-time and length biases inflate screening survival without true benefit. Confounding controlled by randomization, matching, stratification, or multivariate analysis.",
    keyConcepts: [
      "Sensitivity vs specificity vs predictive values — prevalence dependence",
      "NNT = 1/ARR; always interpret absolute vs relative effects",
      "Type I (alpha) and Type II (beta) errors; power = 1 − beta",
      "Selection, recall, and lead-time bias in observational studies",
      "Intention-to-treat vs per-protocol analysis in RCTs",
      "Hazard ratio vs odds ratio vs relative risk — when each applies",
    ],
    mustKnowFacts: [
      "A p-value <0.05 does not measure effect size or clinical importance",
      "Meta-analysis heterogeneity (I²) high → pooling may be misleading",
    ],
    pearls: [
      "Drug ad claims 50% RRR but event rate drops 2% → 1% (ARR 1%, NNT 100) — small absolute benefit.",
      "Screening test with 99% sensitivity/specificity in low-prevalence disease still yields many false positives.",
    ],
    pitfalls: [
      "Using RR alone without ARR when comparing interventions",
      "Assuming statistical significance equals clinical significance",
    ],
    practiceTopicSlug: "internal-medicine",
    usmleSteps: ["step3"],
    sortOrder: 201,
  },
  {
    slug: "medical-ethics-legal",
    category: "Step 3 — Foundations",
    title: "Medical Ethics, Capacity & Legal Medicine",
    overview:
      "Informed consent, capacity, confidentiality, mandatory reporting, and end-of-life decisions on Step 3.",
    summary:
      "Step 3 ethics vignettes test application, not philosophy. Capacity is decision-specific: understand, appreciate, reason, communicate. Competence is a legal determination. Adults with capacity may refuse life-sustaining treatment including blood products (Jehovah's Witness). For minors, courts may authorize emergency treatment over parental refusal when life-threatening.\n\nInformed consent requires disclosure of diagnosis, proposed intervention, risks/benefits, alternatives (including none), and opportunity for questions. Emergencies permit implied consent when life-threatening and patient cannot participate. Surrogate hierarchy: advance directive → durable power of attorney for healthcare → spouse → adult children → parents → siblings.\n\nConfidentiality exceptions: Tarasoff duty to warn identifiable imminent harm, mandatory reporting (child/elder abuse, certain communicable diseases, impaired physician), court order. HIPAA minimum necessary standard. Impaired colleague: report to appropriate authority, not gossip.",
    keyConcepts: [
      "Four elements of decision-making capacity",
      "Substituted judgment vs best interest standard",
      "Minor consent exceptions: emancipated minor, reproductive care, STI treatment (varies by state)",
      "Advance directives: living will vs healthcare proxy",
      "Mandatory reporting and Tarasoff duty-to-warn",
      "Physician impairment and duty to report",
    ],
    mustKnowFacts: [
      "Never perform non-emergent treatment on refusing capacitated adult — even if family disagrees",
      "Suspected intimate partner violence with imminent danger — safety first; document objectively",
    ],
    pearls: [
      "Intoxicated trauma patient needs emergent surgery — implied consent; full consent discussion when stable.",
      "Teen requests STI treatment without parental notification — treat per mature minor/emancipation statutes in vignette.",
    ],
    pitfalls: [
      "Equating lack of agreement with lack of capacity",
      "Breaking confidentiality for non-imminent, non-identifiable threats",
    ],
    practiceTopicSlug: "internal-medicine",
    usmleSteps: ["step3"],
    sortOrder: 202,
  },
  {
    slug: "ccs-case-management",
    category: "Step 3 — CCS",
    title: "CCS-Style Case Management & Monitoring",
    overview:
      "Initial workup sequencing, monitoring intervals, escalation, and disposition — the Step 3 CCS framework.",
    summary:
      "Computer-based case simulations (CCS) reward systematic care: stabilize, diagnose, treat, monitor, adjust. Day 1 items mirror this logic even in MCQ form. Initial orders should address ABCs, vital signs, IV access, labs, ECG, and condition-specific studies before subspecialty tests.\n\nMonitoring cadence matters: ICU vs floor vs outpatient. Escalate when vitals worsen, mental status changes, or key labs trend badly. De-escalate and discharge only when stable, treated, and follow-up arranged. Never order harmful or redundant tests repeatedly — CCS penalizes unnecessary cost and risk.\n\nCommon CCS scenarios: chest pain (ACS pathway), sepsis (cultures then antibiotics + fluids), asthma/COPD exacerbation (bronchodilators + steroids + O2 target), DKA (fluids before insulin if K+ low), post-op fever (wind/water/wound/walk/wonder drugs). Document reassessment after each intervention.",
    keyConcepts: [
      "Stabilize → diagnose → treat → monitor → adjust loop",
      "Time-sensitive orders: sepsis antibiotics, stroke imaging, ACS ECG",
      "Monitoring frequency matches acuity (q15min vitals in unstable patient)",
      "Disposition requires clinical stability + oral regimen + follow-up",
      "Avoid repeating normal tests; avoid invasive tests without indication",
      "Transfer to higher level when resources exceeded (ICU, surgery, interventional)",
    ],
    mustKnowFacts: [
      "DKA: fluids and potassium before insulin when K+ <3.3",
      "Post-op day 1 fever — atelectasis (#1) before assuming wound infection",
    ],
    pearls: [
      "Unstable patient with sepsis — blood cultures then antibiotics within 1 hour beats CT abdomen first.",
      "Asthma exacerbation with falling peak flow — repeat bronchodilator, add systemic steroid, admit if incomplete response.",
    ],
    pitfalls: [
      "Ordering discharge before reassessment after treatment",
      "Repeating CT scan when clinical picture unchanged — CCS cost penalty",
    ],
    practiceTopicSlug: "internal-medicine",
    usmleSteps: ["step3"],
    sortOrder: 203,
  },
  {
    slug: "pharmaceutical-ads-abstracts",
    category: "Step 3 — Foundations",
    title: "Pharmaceutical Ads & Medical Abstracts",
    overview:
      "Critically appraise drug advertisements and journal abstracts — a distinct Step 3 item type.",
    summary:
      "Drug ad items test whether claims match evidence. Identify study type (often industry-sponsored RCT), primary endpoint, absolute vs relative benefit, exclusion criteria, and conflicts of interest. Relative risk reduction without absolute event rates is a classic trap. Surrogate endpoints (LDL lowering) may not translate to hard outcomes unless trial powered for them.\n\nAbstract appraisal: population, intervention, comparator, outcomes, follow-up duration, dropout rate, intention-to-treat analysis, confidence intervals, and clinical vs statistical significance. Case-control studies cannot establish incidence; cross-sectional studies cannot establish temporality. Meta-analyses depend on included trial quality and heterogeneity.\n\nSafety signals: number needed to harm, confidence intervals including 1.0, post-marketing surveillance. Black box warnings and contraindications override marketing language.",
    keyConcepts: [
      "Primary vs secondary endpoints in industry trials",
      "Absolute vs relative risk in drug marketing",
      "Surrogate vs hard clinical endpoints",
      "ITT analysis preserves randomization benefits",
      "Confidence intervals vs p-values",
      "Conflict of interest and funding source appraisal",
    ],
    mustKnowFacts: [
      "Post-hoc subgroup analyses are hypothesis-generating, not confirmatory",
      "Non-inferiority trials require pre-specified margin",
    ],
    pearls: [
      "Ad states '50% reduction in events' — find absolute rates in fine print before recommending drug.",
      "Abstract with wide CI crossing 1.0 for primary outcome — result not statistically significant despite point estimate favoring drug.",
    ],
    pitfalls: [
      "Accepting surrogate endpoint improvement as patient outcome without hard endpoint data",
      "Ignoring loss to follow-up and per-protocol-only results",
    ],
    practiceTopicSlug: "pharmacology",
    usmleSteps: ["step3"],
    sortOrder: 204,
  },
]);

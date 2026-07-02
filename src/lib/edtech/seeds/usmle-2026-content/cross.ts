import type { Usmle2026StudyContent } from "./types";

/** Cross-cutting themes — all USMLE steps. */
export const USMLE_2026_CONTENT_CROSS: Record<string, Usmle2026StudyContent> = {
  "biostatistics-interpretation": {
    overview: "Trial interpretation, screening math, and evidence appraisal across steps.",
    summary:
      "Step 1 emphasizes test characteristics and study design mechanics. Step 2 applies trial results to clinical decisions. Step 3 requires calculating NNT/ARR and appraising bias in abstracts.\n\nAlways distinguish absolute from relative risk reduction. Prevalence affects PPV/NPV — a sensitive test can have low PPV in low-prevalence screening populations.",
    keyConcepts: [
      "RCT > cohort > case-control for causation",
      "Intention-to-treat preserves randomization benefits",
      "Lead-time and length bias inflate screening survival without mortality benefit",
      "Number needed to harm complements NNT for shared decision-making",
      "Meta-analysis requires assessing heterogeneity and publication bias",
    ],
    mustKnowFacts: [
      "p < 0.05 does not prove clinical significance — examine event rates",
    ],
    pearls: [
      "Screening test with 99% sensitivity still misses 1% — counsel false negatives in high-risk patients.",
    ],
    pitfalls: [
      "Applying inpatient test PPV to asymptomatic screening population without prevalence adjustment",
    ],
  },
  "ethics-professionalism": {
    overview: "Autonomy, beneficence, justice, and professional boundaries.",
    summary:
      "Four principles guide ethics vignettes: respect autonomy (informed consent, truth-telling), beneficence/non-maleficence (risk/benefit), justice (fair resource allocation). Professionalism: avoid dual relationships, report impaired colleagues, disclose errors to patients.\n\nGift from industry, social media boundaries, and clinical trial integrity appear on Step 3.",
    keyConcepts: [
      "Autonomy trumps paternalism for capacitated adults",
      "Beneficence does not justify overriding informed refusal",
      "Justice in organ allocation, scarce ICU beds — protocol-based",
      "Boundary violations: romantic relationships with patients prohibited",
      "Apologize and disclose medical errors — ethical and often legal standard",
    ],
    mustKnowFacts: [
      "Never participate in torture or coercion even if ordered — physician duty to patient",
    ],
    pearls: [
      "Drug rep offers incentive for prescribing — decline; conflicts of interest must be managed transparently.",
    ],
    pitfalls: [
      "Withholding cancer diagnosis from patient because family requests — patient autonomy primary",
    ],
  },
  "sdoh-health-equity": {
    overview: "Social determinants affecting health outcomes and access.",
    summary:
      "SDOH: housing, food security, education, transportation, racism, insurance access. Health disparities in maternal mortality, diabetes control, and cancer stage at diagnosis reflect structural inequities.\n\nClinical role: screen for social needs, connect to resources (WIC, social work), culturally competent care, interpreter services for limited English proficiency.",
    keyConcepts: [
      "Food insecurity affects medication adherence and glycemic control",
      "Medicaid expansion improves access — know vignette insurance barriers",
      "Implicit bias can affect pain treatment and diagnostic workup",
      "Community health workers bridge gaps",
      "Trauma-informed care in marginalized populations",
    ],
    mustKnowFacts: [
      "Use professional interpreter — not child or untrained staff for medical consent",
    ],
    pearls: [
      "Patient misses dialysis appointments due to transportation — social work referral before labeling non-adherent.",
    ],
    pitfalls: [
      "Blaming patient for structural barriers without offering resources",
    ],
  },
  "diagnostic-test-interpretation": {
    overview: "EKG, imaging, and lab patterns across exam steps.",
    summary:
      "Step 1: mechanism behind EKG changes (hyperK peaked T). Step 2: STEMI localization, PE S1Q3T3 (nonspecific), atrial fibrillation rate control vs cardioversion. Step 3: apply results to next management step.\n\nCXR: lobar consolidation pneumococcus, bat wing pulmonary edema, pneumothorax visceral line. CT head: subdural crescent, epidural lens-shaped.",
    keyConcepts: [
      "STEMI: ST elevation territory maps to culprit artery",
      "PE: Hampton hump, Westermark sign rare; CT-PA diagnostic",
      "Metabolic alkalosis with hypertensive urgency — consider primary aldosteronism",
      "Urine sediment: RBC casts glomerular, WBC casts pyelonephritis/interstitial nephritis",
      "CSF: bacterial PMN high, viral lymphocytic, TB lymphocytic with low glucose",
    ],
    mustKnowFacts: [
      "ECG always in chest pain — before troponin returns",
    ],
    pearls: [
      "New LBBB + ischemic symptoms treated as STEMI equivalent.",
    ],
    pitfalls: [
      "Missing STEMI in presence of LBBB without Sgarbossa criteria evaluation",
    ],
  },
  "pharmacology-interactions": {
    overview: "CYP450, protein binding, and contraindicated combinations.",
    summary:
      "Major interactions: warfarin + many drugs (antibiotics, amiodarone); simvastatin + CYP3A4 inhibitors (azole, macrolide) → rhabdo; SSRIs + MAOI → serotonin syndrome; methotrexate + TMP-SMX → pancytopenia.\n\nPregnancy category considerations: ACEi/ARB teratogenic; valproate neural tube defects; tetracycline teeth/bone.",
    keyConcepts: [
      "CYP3A4 inducers (rifampin, phenytoin) ↓ levels of substrates",
      "CYP3A4 inhibitors (ketoconazole, grapefruit) ↑ levels",
      "Warfarin protein binding displacement by NSAIDs increases effect and GI bleed",
      "Digoxin toxicity increased by amiodarone, verapamil, hypokalemia",
      "QT-prolonging drug combinations — torsades risk",
    ],
    mustKnowFacts: [
      "MAOI + meperidine contraindicated — serotonin syndrome",
    ],
    pearls: [
      "Start erythromycin in patient on simvastatin 80 mg → hold statin or switch antibiotic class.",
    ],
    pitfalls: [
      "Adding NSAID to triple therapy (anticoagulant, antiplatelet, NSAID) without GI protection plan",
    ],
  },
  "emergency-acls": {
    overview: "ACLS algorithms, post-arrest care, and common emergency presentations.",
    summary:
      "Pulseless arrest: CPR quality, defibrillation for shockable rhythms (VF/pVT), epinephrine every 3–5 min, amiodarone for refractory VF. Asystole/PEA: treat reversible causes (H's and T's).\n\nPost-ROSC: targeted temperature management when indicated, identify cause (ACS, PE, tox), avoid hyperoxia. Anaphylaxis: IM epinephrine first. Status asthmaticus: continuous albuterol, magnesium, consider intubation.",
    keyConcepts: [
      "High-quality CPR: rate 100–120, depth ≥2 inches, minimize interruptions",
      "Torsades: magnesium; pulseless → defibrillate",
      "Anaphylaxis: epinephrine 0.3 mg IM lateral thigh — repeat q5–15 min",
      "Tension pneumothorax: needle decompression before ACLS drugs if suspected",
      "Post-ROSC STEMI → emergent cath even if comatose",
    ],
    mustKnowFacts: [
      "Epinephrine is first-line in anaphylaxis — not antihistamine alone",
    ],
    pearls: [
      "PEA with distended neck veins after central line → tension pneumo from line — decompress first.",
    ],
    pitfalls: [
      "Delayed epinephrine in anaphylaxis while administering diphenhydramine only",
    ],
  },
};

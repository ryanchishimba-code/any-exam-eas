import { defineReviewModuleTopic } from "@/lib/edtech/review-modules/build-topic";
import {
  ACS_MODULE,
  ANTIBIOTICS_STEWARDSHIP_MODULE,
  ANTICOAGULATION_MODULE,
  DELEGATION_MODULE,
  DIABETES_PHARMACOTHERAPY_MODULE,
  HEART_FAILURE_MODULE,
  INFECTION_CONTROL_NCLEX_MODULE,
  INFECTIOUS_DISEASE_USMLE_MODULE,
  SEPSIS_MODULE,
  CONTROLLED_SUBSTANCES_MODULE,
  CONTROLLED_SUBSTANCES_PANCE_MODULE,
  COPD_EXACERBATION_MODULE,
  AANP_ASSESS_MODULE,
  AANP_DIAGNOSE_MODULE,
  AANP_PLAN_MODULE,
  AANP_EVALUATE_MODULE,
  AANP_GERIATRICS_MODULE,
  AANP_PEDIATRICS_MODULE,
  MSK_REHABILITATION_MODULE,
  STROKE_REHABILITATION_MODULE,
  CARDIOPULMONARY_REHAB_MODULE,
  THERAPEUTIC_MODALITIES_NPTE_MODULE,
  NPTE_VESTIBULAR_BALANCE_MODULE,
  NPTE_PEDS_GERIATRICS_MODULE,
  NPTE_SAFETY_RED_FLAGS_MODULE,
  ENDOCRINE_EMERGENCIES_MODULE,
  RENAL_ELECTROLYTES_MODULE,
  STROKE_NEURO_MODULE,
  PATHOLOGY_NEOPLASIA_STEP1_MODULE,
  PHARMACOLOGY_MOA_STEP1_MODULE,
  BIOSTATISTICS_USMLE_STEP3_MODULE,
  CCS_CASE_MANAGEMENT_USMLE_MODULE,
  MEDICAL_ETHICS_USMLE_STEP3_MODULE,
} from "@/lib/edtech/review-modules/content";
import type { HighYieldTopic } from "@/types/edtech";

/** Flagship textbook-style review modules — one or two per exam, sorted first. */
export const REVIEW_MODULE_TOPICS: HighYieldTopic[] = [
  defineReviewModuleTopic({
    examSlug: "naplex",
    slug: "heart-failure-gdmt",
    title: "Heart Failure: Guideline-Directed Medical Therapy",
    overview:
      "Master the four pillars of HFrEF therapy, diuretic strategy, and when to start each agent — a core NAPLEX pharmacotherapy module.",
    practiceTopicSlug: "cardiovascular-rx",
    reviewModule: HEART_FAILURE_MODULE,
    sortOrder: 0,
  }),
  defineReviewModuleTopic({
    examSlug: "naplex",
    slug: "anticoagulation-reversal",
    title: "Anticoagulation & Reversal",
    overview:
      "Select warfarin vs DOACs, prevent HIT catastrophes, and match the correct reversal agent to the anticoagulant on board.",
    practiceTopicSlug: "pharmacology",
    reviewModule: ANTICOAGULATION_MODULE,
    sortOrder: 1,
  }),
  defineReviewModuleTopic({
    examSlug: "naplex",
    slug: "insulin-diabetes-management",
    title: "Diabetes Pharmacotherapy",
    overview:
      "Insulin kinetics, metformin renal rules, SGLT2i/GLP-1 agents, hypoglycemia treatment, sick-day management, and U-500 safety for NAPLEX.",
    practiceTopicSlug: "endocrine-rx",
    reviewModule: DIABETES_PHARMACOTHERAPY_MODULE,
    sortOrder: 2,
  }),
  defineReviewModuleTopic({
    examSlug: "naplex",
    slug: "antibiotics-stewardship",
    title: "Antibiotics & Antimicrobial Stewardship",
    overview:
      "Spectrum ladders, MRSA/Pseudomonas coverage, CAP and UTI regimens, C. diff therapy, HIV prophylaxis, and stewardship pearls for NAPLEX.",
    practiceTopicSlug: "infectious-disease-rx",
    reviewModule: ANTIBIOTICS_STEWARDSHIP_MODULE,
    sortOrder: 3,
  }),
  defineReviewModuleTopic({
    examSlug: "naplex",
    slug: "controlled-substances",
    title: "Controlled Substances & DEA Regulations",
    overview:
      "CSA schedules, CII refill rules, recordkeeping, transfers, and partial fills — core pharmacy law for NAPLEX and jurisprudence review.",
    practiceTopicSlug: "pharmacy-law",
    reviewModule: CONTROLLED_SUBSTANCES_MODULE,
    sortOrder: 4,
  }),
  defineReviewModuleTopic({
    examSlug: "nclex",
    slug: "infection-control",
    title: "Infection Control & PPE",
    overview:
      "Standard and transmission-based precautions — the foundation of safe nursing practice on every unit.",
    practiceTopicSlug: "safety-infection",
    reviewModule: INFECTION_CONTROL_NCLEX_MODULE,
    sortOrder: 0,
  }),
  defineReviewModuleTopic({
    examSlug: "nclex",
    slug: "sepsis-shock",
    title: "Sepsis & Shock Prioritization",
    overview:
      "Recognize sepsis early, prioritize the sepsis bundle, and distinguish shock types for safe NCLEX clinical judgment.",
    practiceTopicSlug: "physiological-adaptation",
    reviewModule: SEPSIS_MODULE,
    sortOrder: 1,
  }),
  defineReviewModuleTopic({
    examSlug: "nclex",
    slug: "delegation",
    title: "Delegation & Scope of Practice",
    overview:
      "Assign tasks safely using the five rights while the RN retains accountability — a core NCLEX management module.",
    practiceTopicSlug: "management-of-care",
    reviewModule: DELEGATION_MODULE,
    sortOrder: 2,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "acute-coronary-syndrome",
    title: "Acute Coronary Syndrome Management",
    overview:
      "From ECG to reperfusion: STEMI vs NSTEMI pathways, antithrombotics, and complication recognition for Step 2 CK.",
    practiceTopicSlug: "cardiology",
    reviewModule: ACS_MODULE,
    sortOrder: 0,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "infectious-disease",
    title: "Infectious Disease: Sepsis, HIV & Antimicrobials",
    overview:
      "CAP and meningitis empiric regimens, MRSA selection, the daptomycin pneumonia trap, C. diff therapy, HIV OI prophylaxis, vancomycin AUC monitoring, and febrile neutropenia for Step 2 CK.",
    practiceTopicSlug: "internal-medicine",
    reviewModule: INFECTIOUS_DISEASE_USMLE_MODULE,
    sortOrder: 1,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "endocrine-dm",
    title: "Endocrine Emergencies: DKA, HHS, Thyroid & Adrenal",
    overview:
      "DKA/HHS sequencing, thyroid storm and myxedema coma, and adrenal crisis — the time-critical 'next best step' endocrine module for Step 2 CK.",
    practiceTopicSlug: "internal-medicine",
    reviewModule: ENDOCRINE_EMERGENCIES_MODULE,
    sortOrder: 2,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "renal-electrolytes",
    title: "Renal: AKI, Dialysis & Electrolyte Emergencies",
    overview:
      "AKI categorization (FeNa, BUN:Cr), dialysis indications (AEIOU), and the hyperkalemia and hyponatremia algorithms for Step 2 CK.",
    practiceTopicSlug: "nephrology",
    reviewModule: RENAL_ELECTROLYTES_MODULE,
    sortOrder: 3,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "neurology-stroke",
    title: "Neurology: Stroke, SAH & Status Epilepticus",
    overview:
      "Ischemic vs hemorrhagic stroke pathways, subarachnoid hemorrhage workup, and status epilepticus escalation for Step 2 CK.",
    practiceTopicSlug: "neurology",
    reviewModule: STROKE_NEURO_MODULE,
    sortOrder: 4,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "pathology-neoplasia",
    title: "Pathology: Inflammation, Neoplasia & Hemodynamics",
    overview:
      "Granulomatous inflammation, malignant transformation hallmarks, and shock/edema mechanisms for Step 1.",
    practiceTopicSlug: "pathology",
    reviewModule: PATHOLOGY_NEOPLASIA_STEP1_MODULE,
    sortOrder: 10,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "pharmacology-moa",
    title: "Pharmacology: MOA, PK & Autonomic Drugs",
    overview:
      "Receptor pharmacology, CYP interactions, autonomic toxidromes, and classic antidote pairings for Step 1.",
    practiceTopicSlug: "pharmacology",
    reviewModule: PHARMACOLOGY_MOA_STEP1_MODULE,
    sortOrder: 11,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "biostatistics-epidemiology",
    title: "Biostatistics & Epidemiology",
    overview:
      "Sensitivity, NNT, bias, and trial appraisal for Step 3 abstract and drug-ad items.",
    practiceTopicSlug: "internal-medicine",
    reviewModule: BIOSTATISTICS_USMLE_STEP3_MODULE,
    sortOrder: 20,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "medical-ethics-legal",
    title: "Medical Ethics & Legal Medicine",
    overview:
      "Capacity, consent, confidentiality, and surrogate decision-making for Step 3.",
    practiceTopicSlug: "internal-medicine",
    reviewModule: MEDICAL_ETHICS_USMLE_STEP3_MODULE,
    sortOrder: 21,
  }),
  defineReviewModuleTopic({
    examSlug: "usmle",
    slug: "ccs-case-management",
    title: "CCS Case Management & Monitoring",
    overview:
      "Stabilize → diagnose → treat → monitor loops for Step 3 CCS-style items.",
    practiceTopicSlug: "internal-medicine",
    reviewModule: CCS_CASE_MANAGEMENT_USMLE_MODULE,
    sortOrder: 22,
  }),
  defineReviewModuleTopic({
    examSlug: "pance",
    slug: "acute-coronary-syndrome",
    title: "Acute Coronary Syndrome Management",
    overview:
      "From ECG to reperfusion: STEMI vs NSTEMI pathways, antithrombotics, and complication recognition for PANCE.",
    practiceTopicSlug: "cardiovascular",
    reviewModule: ACS_MODULE,
    sortOrder: 0,
  }),
  defineReviewModuleTopic({
    examSlug: "pance",
    slug: "infectious-disease",
    title: "Infectious Disease: CAP, MRSA & Antimicrobials",
    overview:
      "CAP empiric regimens, MRSA selection, C. diff therapy, and HIV prophylaxis pearls for PANCE pharmacotherapy and clinical intervention tasks.",
    practiceTopicSlug: "infectious-diseases",
    reviewModule: INFECTIOUS_DISEASE_USMLE_MODULE,
    sortOrder: 1,
  }),
  defineReviewModuleTopic({
    examSlug: "pance",
    slug: "controlled-substances-pance",
    title: "Controlled Substances & Prescribing Law",
    overview:
      "CSA schedules, CII validity, PDMP/EPCS, opioid risk mitigation, and HIPAA — prescriber-focused jurisprudence for PANCE professional practice items.",
    practiceTopicSlug: "professional-practice",
    reviewModule: CONTROLLED_SUBSTANCES_PANCE_MODULE,
    sortOrder: 3,
  }),
  defineReviewModuleTopic({
    examSlug: "pance",
    slug: "insulin-diabetes-management",
    title: "Diabetes Management",
    overview:
      "A1c targets, metformin, insulin, SGLT2i/GLP-1 benefits, DKA, and hypoglycemia — high-yield endocrine pharmacotherapy for PANCE.",
    practiceTopicSlug: "endocrine",
    reviewModule: DIABETES_PHARMACOTHERAPY_MODULE,
    sortOrder: 4,
  }),
  defineReviewModuleTopic({
    examSlug: "pance",
    slug: "copd-exacerbation",
    title: "COPD Exacerbation Management",
    overview:
      "Bronchodilators, steroids, antibiotics, oxygen targets, and NIPPV — GOLD-aligned pulmonary care for PANCE.",
    practiceTopicSlug: "pulmonary",
    reviewModule: COPD_EXACERBATION_MODULE,
    sortOrder: 5,
  }),
  defineReviewModuleTopic({
    examSlug: "pance",
    slug: "sepsis-shock",
    title: "Sepsis & Shock Management",
    overview:
      "Recognize sepsis early, execute the hour-1 bundle, and distinguish shock types — high-yield for PANCE infectious disease and critical care vignettes.",
    practiceTopicSlug: "infectious-diseases",
    reviewModule: SEPSIS_MODULE,
    sortOrder: 2,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "acute-coronary-syndrome",
    title: "Acute Coronary Syndrome Management",
    overview:
      "From ECG to reperfusion: STEMI vs NSTEMI pathways for AANP FNP cardiovascular Plan and Evaluate items.",
    practiceTopicSlug: "cardiovascular",
    reviewModule: ACS_MODULE,
    sortOrder: 0,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "infectious-disease",
    title: "Infectious Disease: CAP, MRSA & Antimicrobials",
    overview:
      "CAP empiric regimens, MRSA selection, and antibiotic stewardship for AANP FNP primary care.",
    practiceTopicSlug: "infectious-disease",
    reviewModule: INFECTIOUS_DISEASE_USMLE_MODULE,
    sortOrder: 1,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "sepsis-shock",
    title: "Sepsis & Shock Management",
    overview:
      "Recognize sepsis early and execute the hour-1 bundle — high-yield for AANP FNP geriatric and infectious disease vignettes.",
    practiceTopicSlug: "infectious-disease",
    reviewModule: SEPSIS_MODULE,
    sortOrder: 2,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "insulin-diabetes-management",
    title: "Diabetes Pharmacotherapy",
    overview:
      "Insulin, metformin, GLP-1/SGLT2 agents, and monitoring for AANP FNP Plan and Evaluate domains.",
    practiceTopicSlug: "endocrine",
    reviewModule: DIABETES_PHARMACOTHERAPY_MODULE,
    sortOrder: 3,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "aanp-assess-domain",
    title: "Health Assessment & Diagnostics",
    overview:
      "Domain I deep dive — screening, next-best test selection, and lifespan assessment for the AANP FNP exam.",
    practiceTopicSlug: "assess",
    reviewModule: AANP_ASSESS_MODULE,
    sortOrder: 4,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "aanp-diagnose-domain",
    title: "Diagnosis & Clinical Reasoning",
    overview:
      "Domain II deep dive — differential diagnosis, discriminating findings, and primary diagnosis selection.",
    practiceTopicSlug: "diagnose",
    reviewModule: AANP_DIAGNOSE_MODULE,
    sortOrder: 5,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "aanp-plan-domain",
    title: "Therapeutics & Care Planning",
    overview:
      "Domain III deep dive — first-line therapy, counseling, prevention, and referrals within NP scope.",
    practiceTopicSlug: "plan",
    reviewModule: AANP_PLAN_MODULE,
    sortOrder: 6,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "aanp-evaluate-domain",
    title: "Outcomes & Follow-Up",
    overview:
      "Domain IV deep dive — monitoring response, adverse effects, adherence, and care plan modification.",
    practiceTopicSlug: "evaluate",
    reviewModule: AANP_EVALUATE_MODULE,
    sortOrder: 7,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "aanp-geriatrics-high-yield",
    title: "Older Adult Care",
    overview:
      "Beers Criteria, delirium, falls, polypharmacy, and atypical presentations — highest lifespan weight on the exam.",
    practiceTopicSlug: "geriatrics",
    reviewModule: AANP_GERIATRICS_MODULE,
    sortOrder: 8,
  }),
  defineReviewModuleTopic({
    examSlug: "aanp-fnp",
    slug: "aanp-pediatrics-high-yield",
    title: "Pediatric Primary Care",
    overview:
      "Immunizations, febrile infant algorithms, milestones, and adolescent confidentiality.",
    practiceTopicSlug: "pediatrics",
    reviewModule: AANP_PEDIATRICS_MODULE,
    sortOrder: 9,
  }),
  defineReviewModuleTopic({
    examSlug: "npte-pt",
    slug: "msk-rehabilitation",
    title: "Musculoskeletal Rehabilitation",
    overview:
      "Rotator cuff, spine, post-op ortho, manual therapy, and outcome measures — highest-yield MSK domain on NPTE-PT.",
    practiceTopicSlug: "musculoskeletal",
    reviewModule: MSK_REHABILITATION_MODULE,
    sortOrder: 0,
  }),
  defineReviewModuleTopic({
    examSlug: "npte-pt",
    slug: "stroke-rehabilitation",
    title: "Neuromuscular Rehabilitation",
    overview:
      "Stroke, SCI, TBI, Parkinson, gait, and balance — core neuromuscular content for NPTE-PT.",
    practiceTopicSlug: "neuromuscular-nervous",
    reviewModule: STROKE_REHABILITATION_MODULE,
    sortOrder: 1,
  }),
  defineReviewModuleTopic({
    examSlug: "npte-pt",
    slug: "cardiopulmonary-rehab",
    title: "Cardiopulmonary Rehabilitation",
    overview:
      "COPD, CHF, post-MI rehab, oxygen titration, and airway clearance for NPTE-PT.",
    practiceTopicSlug: "cardiovascular-pulmonary",
    reviewModule: CARDIOPULMONARY_REHAB_MODULE,
    sortOrder: 2,
  }),
  defineReviewModuleTopic({
    examSlug: "npte-pt",
    slug: "therapeutic-modalities",
    title: "Therapeutic Modalities",
    overview:
      "Ultrasound, TENS, NMES, cryotherapy, and heat — parameters and contraindications.",
    practiceTopicSlug: "therapeutic-modalities",
    reviewModule: THERAPEUTIC_MODALITIES_NPTE_MODULE,
    sortOrder: 3,
  }),
  defineReviewModuleTopic({
    examSlug: "npte-pt",
    slug: "npte-vestibular-balance",
    title: "Vestibular & Balance Disorders",
    overview:
      "BPPV repositioning, gaze stabilization, and peripheral vs central vertigo — high-yield neuromuscular extension.",
    practiceTopicSlug: "neuromuscular-nervous",
    reviewModule: NPTE_VESTIBULAR_BALANCE_MODULE,
    sortOrder: 4,
  }),
  defineReviewModuleTopic({
    examSlug: "npte-pt",
    slug: "npte-peds-geriatrics",
    title: "Pediatrics & Geriatrics",
    overview:
      "CP, torticollis, falls prevention, frailty, and lifespan modifiers across NPTE-PT systems.",
    practiceTopicSlug: "system-interactions",
    reviewModule: NPTE_PEDS_GERIATRICS_MODULE,
    sortOrder: 5,
  }),
  defineReviewModuleTopic({
    examSlug: "npte-pt",
    slug: "npte-safety-red-flags",
    title: "Safety & Red Flags",
    overview:
      "When to refer, exercise contraindications, infection control, and fall risk — heavily tested cross-cutting content.",
    practiceTopicSlug: "safety-protection",
    reviewModule: NPTE_SAFETY_RED_FLAGS_MODULE,
    sortOrder: 6,
  }),
];

export function mergeReviewModules(topics: HighYieldTopic[], examSlug: HighYieldTopic["examSlug"]): HighYieldTopic[] {
  const modules = REVIEW_MODULE_TOPICS.filter((t) => t.examSlug === examSlug);
  if (modules.length === 0) return topics;

  const bySlug = new Map(topics.map((t) => [t.slug, t]));

  for (const mod of modules) {
    const existing = bySlug.get(mod.slug);
    bySlug.set(
      mod.slug,
      existing
        ? {
            ...existing,
            category: mod.category,
            title: mod.title,
            overview: mod.overview,
            reviewModule: existing.reviewModule ?? mod.reviewModule,
            relatedStructureIds:
              existing.relatedStructureIds?.length
                ? existing.relatedStructureIds
                : mod.relatedStructureIds,
            summary: existing.summary || mod.summary,
            keyConcepts: existing.keyConcepts.length ? existing.keyConcepts : mod.keyConcepts,
            mustKnowFacts: existing.mustKnowFacts.length ? existing.mustKnowFacts : mod.mustKnowFacts,
            pearls: existing.pearls.length ? existing.pearls : mod.pearls,
            pitfalls: existing.pitfalls.length ? existing.pitfalls : mod.pitfalls,
          }
        : mod
    );
  }

  const moduleSlugs = new Set(modules.map((m) => m.slug));
  const ordered = [
    ...modules.map((m) => bySlug.get(m.slug)!),
    ...topics.filter((t) => !moduleSlugs.has(t.slug)),
  ];

  return ordered.map((t, i) => ({ ...t, sortOrder: i + 1 }));
}

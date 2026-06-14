import { defineReviewModuleTopic } from "@/lib/edtech/review-modules/build-topic";
import {
  ACS_MODULE,
  ANTIBIOTICS_STEWARDSHIP_MODULE,
  ANTICOAGULATION_MODULE,
  CONTROLLED_SUBSTANCES_MODULE,
  DELEGATION_MODULE,
  DIABETES_PHARMACOTHERAPY_MODULE,
  HEART_FAILURE_MODULE,
  INFECTION_CONTROL_NCLEX_MODULE,
  INFECTIOUS_DISEASE_USMLE_MODULE,
  SEPSIS_MODULE,
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
    examSlug: "mpje",
    slug: "controlled-substances",
    title: "Controlled Substance Prescribing & Recordkeeping",
    overview:
      "CSA schedules, valid Rx elements, CII rules, inventory accountability, and corresponding responsibility for MPJE.",
    practiceTopicSlug: "controlled-substances",
    reviewModule: CONTROLLED_SUBSTANCES_MODULE,
    sortOrder: 0,
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

/** Legacy AANP FNP seed data (retired exam track). */
import type { ExamSlug } from "@/types/edtech";
import { defineExamTopics } from "./topic-factory";

export const AANP_FNP_HIGH_YIELD_TOPICS = defineExamTopics("aanp-fnp" as ExamSlug, [
  {
    slug: "aanp-assess-domain",
    category: "Assess (32%)",
    title: "Health Assessment & Diagnostics",
    overview: "Focused and comprehensive assessment, screening, and diagnostic test selection per AANP Domain I.",
    summary:
      "The Assess domain (32% of the AANP FNP exam) tests your ability to gather history, perform physical exams, order and interpret screening and diagnostic tests, and recognize red flags across the lifespan. Items integrate newborn through older-adult presentations with prenatal and women's health woven into adult categories.\n\nHigh-yield areas include cardiovascular and pulmonary exam findings, age-appropriate screening (USPSTF), prenatal labs, developmental milestones, geriatric functional assessment, and choosing the best NEXT diagnostic step rather than the most comprehensive panel.",
    keyConcepts: [
      "Age-appropriate history and ROS",
      "Focused vs comprehensive physical exam",
      "Screening per USPSTF and Bright Futures",
      "Pre-test probability and next-best test",
      "Red-flag recognition requiring escalation",
    ],
    mustKnowFacts: [
      "Assess domain = 43 scored items on the 135-question exam",
      "Older adults represent ~30% of lifespan-weighted items",
    ],
    pearls: [
      "When two tests seem reasonable, choose the one that changes management first.",
      "Pediatric fever workup varies sharply by age — know 0–28 days, 29–90 days, and 3–36 months algorithms.",
    ],
    pitfalls: [
      "Ordering every lab in the book instead of the single best next step",
      "Missing geriatric atypical presentations (e.g., silent MI, delirium as UTI)",
    ],
    practiceTopicSlug: "assess",
  },
  {
    slug: "aanp-diagnose-domain",
    category: "Diagnose (26.5%)",
    title: "Diagnosis & Clinical Reasoning",
    overview: "Synthesize data into a prioritized differential and most likely diagnosis — AANP Domain II.",
    summary:
      "Domain II (26.5%, ~36 items) requires analyzing subjective and objective data to build a differential, prioritize the most likely diagnosis, and recognize when presentation does not fit a single organ system.\n\nExpect primary-care bread-and-butter: HTN, diabetes, COPD/asthma, UTI, depression, common rashes, musculoskeletal complaints, and pediatric URI vs serious bacterial infection.",
    keyConcepts: [
      "Problem representation and differential generation",
      "Discriminating findings that rule in/out diagnoses",
      "Comorbidity impact on presentation",
      "When to broaden vs narrow the differential",
    ],
    mustKnowFacts: ["Diagnose domain = 36 scored items"],
    pearls: ["Anchor on epidemiology + key finding + timeline — not rare zebras first."],
    pitfalls: ["Choosing a diagnosis not supported by vignette data"],
    practiceTopicSlug: "diagnose",
  },
  {
    slug: "aanp-plan-domain",
    category: "Plan (26.5%)",
    title: "Therapeutics & Care Planning",
    overview: "Evidence-based pharmacologic and non-pharmacologic plans, referrals, and patient education — Domain III.",
    summary:
      "Domain III (26.5%, ~36 items) covers first-line therapies, contraindications, counseling, preventive interventions, and referrals. NP scope is central — know what you can prescribe, monitor, and when to escalate.\n\nHigh-yield: antihypertensives, diabetes agents, asthma/COPD inhalers, antibiotics by syndrome, contraception, vaccines, SSRI selection, and geriatric dose adjustments.",
    keyConcepts: [
      "First-line vs second-line therapy by guideline",
      "Contraindications and drug interactions",
      "Patient-centered counseling and shared decision-making",
      "Referral and co-management triggers",
    ],
    mustKnowFacts: ["Plan domain = 36 scored items"],
    pearls: ["Always check pregnancy/lactation, renal/hepatic function, and age before picking a drug."],
    pitfalls: ["Selecting correct drug class but wrong agent for comorbidity (e.g., BB in asthma)"],
    practiceTopicSlug: "plan",
  },
  {
    slug: "aanp-evaluate-domain",
    category: "Evaluate (15%)",
    title: "Outcomes & Follow-Up",
    overview: "Monitor treatment response, adverse effects, adherence, and modify plans — Domain IV.",
    summary:
      "Domain IV (15%, ~20 items) is the smallest but critical — tests whether you follow patients after the initial plan. Items ask about lab monitoring intervals, when therapy failed, adverse drug reactions, transition-of-care gaps, and preventive follow-up.\n\nExamples: IN R monitoring on warfarin, A1c recheck after metformin start, PPI adverse effects, SSRI activation/suicide reassessment, and readmission prevention in CHF.",
    keyConcepts: [
      "Treatment response criteria",
      "Adverse effect recognition",
      "Therapeutic drug monitoring",
      "Care plan modification and discharge follow-up",
    ],
    mustKnowFacts: ["Evaluate domain = 20 scored items"],
    pearls: ["If the patient returns with partial improvement, evaluate adherence before switching class."],
    pitfalls: ["Repeating initial workup instead of assessing response to prior plan"],
    practiceTopicSlug: "evaluate",
  },
  {
    slug: "aanp-geriatrics-high-yield",
    category: "Geriatrics (30%)",
    title: "Older Adult Care",
    overview: "Largest lifespan share — polypharmacy, falls, dementia, and atypical presentations.",
    summary:
      "Older adults account for roughly 30% of AANP FNP exam items. Master Beers Criteria, fall prevention, delirium vs dementia, polypharmacy reconciliation, advance care planning, and atypical disease presentations in the elderly.",
    keyConcepts: ["Beers Criteria", "Fall risk assessment", "Delirium workup", "Capacity and guardianship basics"],
    mustKnowFacts: ["Geriatrics is the highest-weight lifespan band on the exam"],
    pearls: ["New confusion in an older adult is delirium until proven otherwise — search for infection, meds, metabolic causes."],
    pitfalls: ["Attributing functional decline solely to normal aging"],
    practiceTopicSlug: "geriatrics",
  },
  {
    slug: "aanp-pediatrics-high-yield",
    category: "Pediatrics (22%)",
    title: "Pediatric Primary Care",
    overview: "Newborn through adolescent — well-child, immunizations, fever, and development.",
    summary:
      "Pediatric content spans newborn (2%) through adolescent (9%) — combined ~22% of items. Focus on immunization schedules, growth/development milestones, febrile infant algorithms, asthma, ADHD, and adolescent confidentiality topics.",
    keyConcepts: ["Bright Futures schedule", "Febrile infant by age", "Developmental milestones", "Adolescent screening"],
    mustKnowFacts: ["Febrile neonate (<28 days) with fever requires full sepsis workup and admission"],
    pearls: ["Always document caregiver reliability and return precautions in pediatric plan items."],
    pitfalls: ["Applying adult dosing or workup algorithms to pediatric patients"],
    practiceTopicSlug: "pediatrics",
  },
]);

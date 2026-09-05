/**
 * AANP FNP system-based Deep Dive modules — generated from 2026 topic registry.
 */
import {
  AANP_FNP_2026_TOPIC_GROUPS,
  aanpFnpSystemModuleSlug,
} from "@/lib/exam-prep/aanp-fnp/blueprint-topics-2026";
import type { ReviewModuleContent } from "../types";
import { REVIEW_MODULE_DEFAULT_TITLES as T } from "../types";

const YIELD_INTRO: Record<string, string> = {
  "very-high":
    "Very high yield on the AANP FNP exam — expect multiple primary-care vignettes per full-length practice block.",
  high: "High yield — frequently tested with outpatient management and next-best-step stems.",
  standard: "Standard yield — know guideline-directed therapy, red flags, and when to refer.",
};

function buildSystemModule(
  group: (typeof AANP_FNP_2026_TOPIC_GROUPS)[number]
): ReviewModuleContent {
  const topicLabels = group.topics.map((t) => t.label);
  const slug = aanpFnpSystemModuleSlug(group.categoryId);
  return {
    sections: [
      {
        id: "why-it-matters",
        title: T["why-it-matters"],
        paragraphs: [
          `${group.label} is a core AANP FNP system module (${slug}). ${YIELD_INTRO[group.yield] ?? YIELD_INTRO.high}`,
          "Items emphasize primary care outpatient management, guideline-directed therapy (ADA, JNC/ACC, GOLD, GINA, IDSA, USPSTF), and patient education — not inpatient subspecialty procedures.",
        ],
      },
      {
        id: "core-concepts",
        title: T["core-concepts"],
        bullets: topicLabels,
      },
      {
        id: "clinical-applications",
        title: T["clinical-applications"],
        bullets: [
          "Use case vignettes: demographics, chief complaint, pertinent history, exam, and labs/imaging when indicated",
          "Preferred stems: most likely diagnosis, most appropriate next step, initial diagnostic study, first-line pharmacotherapy",
          "Integrate lifespan context — pediatrics, adults, geriatrics, and women's health presentations differ by age",
          "Cross-reference pharmacology: mechanism, monitoring, contraindications, pregnancy/lactation when prescribing",
        ],
      },
      {
        id: "comparisons",
        title: T.comparisons,
        bullets: [
          "Most likely diagnosis vs most appropriate next step — pick the stem that matches the question verb",
          "Screening vs diagnostic testing — USPSTF asymptomatic care vs evaluating a symptomatic patient",
          "First-line vs alternative therapy when comorbidities, pregnancy, or allergies constrain options",
        ],
      },
      {
        id: "visual-aids",
        title: T["visual-aids"],
        bullets: [
          "Primary-care algorithm: assess → diagnose → plan → evaluate with clear recheck intervals",
          "Red-flag box: chest pain, neuro deficit, respiratory distress, suicidal ideation — escalate first",
          "Drug monitoring card: labs, timing, and stop criteria for high-risk meds in this system",
        ],
      },
      {
        id: "misconceptions",
        title: T.misconceptions,
        bullets: [
          "Ordering every possible test is safer — choose the single result that changes the plan",
          "Specialty guidelines always override primary-care context — start with outpatient standards of care",
          "Patient education is optional — counseling is often the scored next step",
        ],
      },
      {
        id: "pearls",
        title: T.pearls,
        bullets: [
          "Choose the single best next step that changes management — avoid ordering every available test",
          "When two therapies are guideline-appropriate, pick the one safest for this patient's comorbidities",
          "Pair clinical review with Top 500 drug cards for mechanism and monitoring quick hits",
        ],
      },
      {
        id: "quick-summary",
        title: T["quick-summary"],
        bullets: topicLabels.slice(0, 5),
      },
    ],
  };
}

export const AANP_FNP_SYSTEM_REVIEW_MODULES: Record<string, ReviewModuleContent> =
  Object.fromEntries(
    AANP_FNP_2026_TOPIC_GROUPS.map((group) => [
      aanpFnpSystemModuleSlug(group.categoryId),
      buildSystemModule(group),
    ])
  );

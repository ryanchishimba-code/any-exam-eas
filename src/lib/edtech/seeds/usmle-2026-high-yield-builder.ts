/**
 * Build high-yield study modules from the USMLE 2026 blueprint topic catalog.
 */
import type { UsmleStepLevel } from "@/lib/exam-prep/usmle/types";
import {
  USMLE_CROSS_CUTTING_TOPICS,
  USMLE_STEP1_TOPIC_GROUPS,
  USMLE_STEP2_TOPIC_GROUPS,
  USMLE_STEP3_TOPIC_GROUPS,
  type Usmle2026TopicGroup,
} from "@/lib/exam-prep/usmle/blueprint-topics-2026";
import { defineExamTopics } from "./topic-factory";
import {
  USMLE_2026_STUDY_CONTENT,
  type Usmle2026StudyContent,
} from "./usmle-2026-high-yield-content";

const CATEGORY_TO_SUBJECT: Record<string, string> = {
  cardiovascular: "cardiology",
  "respiratory-renal": "pulmonology",
  gastrointestinal: "internal-medicine",
  "reproductive-endocrine": "internal-medicine",
  "hematology-immunology": "hematology",
  musculoskeletal: "internal-medicine",
  "behavioral-nervous": "neurology",
  "pharmacology-microbiology": "pharmacology",
  "biochemistry-genetics": "biochemistry",
  "internal-medicine": "internal-medicine",
  "surgery-acute-care": "emergency-medicine",
  pediatrics: "pediatrics",
  obgyn: "obgyn",
  psychiatry: "psychiatry",
  surgery: "emergency-medicine",
  ccs: "internal-medicine",
  biostatistics: "internal-medicine",
  ethics: "internal-medicine",
};

function stepCategoryLabel(step: UsmleStepLevel, groupLabel: string): string {
  if (step === "step1") return `Step 1 — ${groupLabel}`;
  if (step === "step3") return `Step 3 — ${groupLabel}`;
  return `Step 2 CK — ${groupLabel}`;
}

function sortBaseForStep(step: UsmleStepLevel): number {
  if (step === "step1") return 110;
  if (step === "step3") return 210;
  return 300;
}

function defaultContent(
  slug: string,
  label: string,
  step: UsmleStepLevel,
  group: Usmle2026TopicGroup
): Usmle2026StudyContent {
  const discipline = group.discipline ?? group.label;
  if (step === "step1") {
    return {
      overview: `${label} — high-yield Step 1 mechanism and pathophysiology.`,
      summary: `Step 1 items on ${label.toLowerCase()} link clinical findings to underlying ${discipline.toLowerCase()}. Focus on why the patient presents this way — enzyme defects, receptor changes, histologic patterns, or drug mechanisms — rather than isolated fact recall.\n\nIntegrate anatomy, physiology, and pathology: a vignette may ask for the most likely mechanism, histologic finding, or expected lab abnormality. Use the diagnosis to anchor your reasoning, then select the answer that best explains the pathophysiology.`,
      keyConcepts: [
        `Core mechanism: ${label}`,
        "Link presentation → pathophysiology → expected finding",
        `Discipline lens: ${discipline}`,
        "Distinguish similar entities by key distinguishing feature",
        "Know classic associations tested on Step 1",
      ],
      mustKnowFacts: [
        `When vignette mentions ${label.split("(")[0]?.trim() ?? label}, prioritize mechanism over management`,
      ],
      pearls: [
        `Mechanism-first reasoning beats memorizing lists for ${slug.replace(/-/g, " ")}.`,
      ],
      pitfalls: [
        "Choosing a management answer on a Step 1 mechanism question",
        "Ignoring numeric labs/vitals that point to the underlying process",
      ],
    };
  }

  if (step === "step3") {
    return {
      overview: `${label} — Step 3 management, monitoring, and CCS-style sequencing.`,
      summary: `Step 3 tests whether you can manage a patient over time: initial stabilization, diagnostic workup, treatment, monitoring, escalation, and disposition. For ${label.toLowerCase()}, prioritize the next best step that is safe, timely, and cost-effective.\n\nIn CCS-style logic, reassess after each intervention. Avoid redundant testing and harmful delays. Document why you escalate care or discharge — follow-up and patient safety matter.`,
      keyConcepts: [
        "Stabilize → diagnose → treat → monitor → adjust",
        "Next best step over 'eventually correct' option",
        "Cost-effective care without compromising safety",
        "Monitoring frequency matches acuity",
        "Disposition only when stable with follow-up arranged",
      ],
      mustKnowFacts: [
        "Step 3 rewards timely orders and reassessment — not exhaustive testing",
      ],
      pearls: [
        `For ${slug.replace(/-/g, " ")}, ask: what must happen in the next 15 minutes?`,
      ],
      pitfalls: [
        "Ordering invasive tests before addressing ABCs",
        "Repeating the same unhelpful test instead of changing management",
      ],
    };
  }

  return {
    overview: `${label} — Step 2 CK diagnosis, workup, and initial management.`,
    summary: `Clinical vignettes on ${label.toLowerCase()} require you to select the most likely diagnosis, best initial test, or most appropriate next step in management. Gather age, risk factors, vitals, and key labs/imaging from the stem before answering.\n\nStep 2 CK favors evidence-based first-line therapy and guideline-concordant workup. Eliminate options that are correct eventually but not first, or that are contraindicated for this patient.`,
    keyConcepts: [
      `Presentation pattern for ${label}`,
      "Best initial test vs gold standard",
      "First-line management vs definitive therapy",
      "Contraindications and comorbidity adjustments",
      "When to admit vs discharge with follow-up",
    ],
    mustKnowFacts: [
      "Unstable patient → resuscitation and emergent intervention before extensive workup",
    ],
    pearls: [
      `Match the stem details to ${slug.replace(/-/g, " ")} — avoid template answers.`,
    ],
    pitfalls: [
      "Selecting a correct treatment that is not the FIRST step",
      "Missing pregnancy, renal failure, or allergy contraindications in the vignette",
    ],
  };
}

function crossCuttingContent(label: string): Usmle2026StudyContent {
  return {
    overview: `${label} — tested across USMLE Steps 1, 2 CK, and 3.`,
    summary: `${label} appears embedded in clinical vignettes and standalone items. Interpret study abstracts, apply ethical principles to patient scenarios, and integrate pharmacology and diagnostic reasoning with the primary clinical problem.\n\nOn Step 1, emphasis is mechanism and test properties; on Step 2 CK, diagnosis and initial management; on Step 3, monitoring, disposition, and cost-effective next steps.`,
    keyConcepts: [
      label,
      "Integrate cross-cutting theme with primary clinical scenario",
      "Apply principles consistently across exam steps",
      "Use numeric data when provided (labs, trial results)",
    ],
    mustKnowFacts: [
      "Cross-cutting topics often determine the difference between two strong clinical answers",
    ],
    pearls: [
      "Read the question stem twice — biostatistics and ethics details are often subtle.",
    ],
    pitfalls: [
      "Ignoring provided trial data or consent context in the vignette",
    ],
  };
}

function buildFromGroup(group: Usmle2026TopicGroup, sortStart: number) {
  return group.topics.map((t, i) => {
    const content = USMLE_2026_STUDY_CONTENT[t.slug] ?? defaultContent(t.slug, t.label, group.stepLevel, group);
    const practiceTopicSlug =
      CATEGORY_TO_SUBJECT[group.categoryId] ?? "internal-medicine";
    return {
      slug: t.slug,
      category: stepCategoryLabel(group.stepLevel, group.label),
      title: t.label,
      overview: content.overview ?? t.label,
      summary: content.summary ?? t.label,
      keyConcepts: content.keyConcepts ?? [t.label],
      mustKnowFacts: content.mustKnowFacts ?? [],
      pearls: content.pearls ?? [],
      pitfalls: content.pitfalls ?? [],
      practiceTopicSlug,
      usmleSteps: [group.stepLevel] as ("step1" | "step2" | "step3")[],
      sortOrder: sortStart + i,
    };
  });
}

/** Granular 2026 blueprint-aligned high-yield modules (Steps 1, 2 CK, 3). */
export function buildUsmle2026HighYieldTopics() {
  const inputs = [
    ...USMLE_STEP1_TOPIC_GROUPS.flatMap((g) =>
      buildFromGroup(g, sortBaseForStep("step1") + USMLE_STEP1_TOPIC_GROUPS.indexOf(g) * 10)
    ),
    ...USMLE_STEP2_TOPIC_GROUPS.flatMap((g) =>
      buildFromGroup(g, sortBaseForStep("step2") + USMLE_STEP2_TOPIC_GROUPS.indexOf(g) * 25)
    ),
    ...USMLE_STEP3_TOPIC_GROUPS.flatMap((g) =>
      buildFromGroup(g, sortBaseForStep("step3") + USMLE_STEP3_TOPIC_GROUPS.indexOf(g) * 10)
    ),
    ...USMLE_CROSS_CUTTING_TOPICS.map((t, i) => {
      const content =
        USMLE_2026_STUDY_CONTENT[t.slug] ?? crossCuttingContent(t.label);
      return {
        slug: t.slug,
        category: "Cross-Cutting — All Steps",
        title: t.label,
        overview: content.overview ?? t.label,
        summary: content.summary ?? t.label,
        keyConcepts: content.keyConcepts ?? [t.label],
        mustKnowFacts: content.mustKnowFacts ?? [],
        pearls: content.pearls ?? [],
        pitfalls: content.pitfalls ?? [],
        practiceTopicSlug: "internal-medicine",
        usmleSteps: ["step1", "step2", "step3"] as ("step1" | "step2" | "step3")[],
        sortOrder: 400 + i,
      };
    }),
  ];

  return defineExamTopics("usmle", inputs);
}

export const USMLE_2026_HIGH_YIELD_TOPICS = buildUsmle2026HighYieldTopics();

import type { ExamSlug } from "@/types/edtech";
import type { AnatomyQuizQuestion, AnatomyTour } from "./types";

export const ANATOMY_TOURS: AnatomyTour[] = [
  {
    id: "usmle-heart-anatomy",
    title: "High-Yield Heart Anatomy",
    subtitle: "USMLE Step 1 cardiovascular localization",
    examFocus: "USMLE Step 1",
    steps: [
      {
        structureId: "heart",
        narration:
          "Start with the heart — know chamber flow, valve locations, and coronary dominance for STEMI localization.",
      },
      {
        structureId: "aorta",
        narration:
          "Trace the aorta from the left ventricle through the arch. Coarctation and dissection are classic board presentations.",
      },
      {
        structureId: "lungs",
        narration:
          "The lungs sit flanking the heart. Remember right main bronchus anatomy for aspiration and V/Q physiology.",
      },
      {
        structureId: "diaphragm",
        narration:
          "The diaphragm separates thorax from abdomen. Phrenic nerve (C3–C5) and hiatal hernia sites are high-yield.",
      },
    ],
  },
  {
    id: "nclex-respiratory-basics",
    title: "Respiratory Essentials for NCLEX",
    subtitle: "Airway anatomy and clinical red flags",
    examFocus: "NCLEX-RN",
    steps: [
      {
        structureId: "lungs",
        narration:
          "Right lung has three lobes and a more vertical main bronchus — key for aspiration pneumonia patterns.",
      },
      {
        structureId: "diaphragm",
        narration:
          "Diaphragmatic irritation causes referred shoulder pain — think splenic rupture or ectopic pregnancy.",
      },
      {
        structureId: "heart",
        narration:
          "Heart borders and auscultation sites help correlate murmurs with valve pathology on clinical items.",
      },
    ],
  },
  {
    id: "neuro-stroke-localization",
    title: "Neuroanatomy for Stroke Workup",
    subtitle: "Brain, cord, and vascular territories",
    examFocus: "USMLE / NCLEX",
    steps: [
      {
        structureId: "brain",
        narration:
          "MCA territory strokes cause contralateral face/arm weakness; dominant hemisphere → aphasia.",
      },
      {
        structureId: "skull",
        narration:
          "Skull fracture patterns predict complications — epidural (middle meningeal) vs subdural (bridging veins).",
      },
      {
        structureId: "spinal-cord",
        narration:
          "Brown-Séquard and complete cord syndromes test your knowledge of tract anatomy and level localization.",
      },
    ],
  },
];

export const ANATOMY_QUIZ_QUESTIONS: AnatomyQuizQuestion[] = [
  {
    id: "q-heart",
    prompt: "Click the structure that contains the SA node and four chambers.",
    structureId: "heart",
    distractorIds: ["lungs", "aorta", "liver"],
  },
  {
    id: "q-lungs",
    prompt: "Which structure has three lobes on the right and is the primary site of gas exchange?",
    structureId: "lungs",
    distractorIds: ["heart", "diaphragm", "stomach"],
  },
  {
    id: "q-brain",
    prompt: "Click the central organ where MCA territory strokes cause contralateral weakness.",
    structureId: "brain",
    distractorIds: ["spinal-cord", "skull", "thyroid"],
  },
  {
    id: "q-kidneys",
    prompt: "Select the retroperitoneal organs that filter blood via nephrons.",
    structureId: "kidneys",
    distractorIds: ["liver", "spleen", "stomach"],
  },
  {
    id: "q-diaphragm",
    prompt: "Click the muscle innervated by the phrenic nerve (C3–C5).",
    structureId: "diaphragm",
    distractorIds: ["biceps-brachii", "heart", "femur"],
  },
  {
    id: "q-spleen",
    prompt: "Which organ in the LUQ can rupture with Kehr sign (referred shoulder pain)?",
    structureId: "spleen",
    distractorIds: ["liver", "kidneys", "stomach"],
  },
];

export function getTourById(id: string): AnatomyTour | undefined {
  return ANATOMY_TOURS.find((t) => t.id === id);
}

function tourExamRelevance(tour: AnatomyTour, examSlug: ExamSlug): number {
  const focus = tour.examFocus.toLowerCase();
  if (examSlug === "usmle") {
    if (focus.includes("usmle") && !focus.includes("nclex")) return 0;
    if (focus.includes("usmle / nclex") || focus.includes("usmle/nclex")) return 1;
    if (focus.includes("nclex")) return 2;
  }
  if (examSlug === "nclex") {
    if (focus.includes("nclex") && !focus.includes("usmle")) return 0;
    if (focus.includes("usmle / nclex") || focus.includes("usmle/nclex")) return 1;
    if (focus.includes("usmle")) return 2;
  }
  return 0;
}

/** Tours sorted by relevance to the active exam (naplex/mpje show all, default order). */
export function getToursForExam(examSlug: ExamSlug): AnatomyTour[] {
  if (examSlug !== "usmle" && examSlug !== "nclex") {
    return ANATOMY_TOURS;
  }
  return [...ANATOMY_TOURS].sort(
    (a, b) => tourExamRelevance(a, examSlug) - tourExamRelevance(b, examSlug)
  );
}

import {
  getRegisteredSubjectIds,
  resolveSubjectModule,
} from "./registry";

/** Display metadata for landing & study discovery — not hardcoded subject lists in UI. */
export type SubjectCatalogEntry = {
  fieldId: string;
  label: string;
  description: string;
  boardExam: string;
  category: "professional" | "stem";
  accent: string;
  accentMuted: string;
  topicCount: number;
  difficultyLevels: string[];
  features: string[];
  trending?: boolean;
  recommended?: boolean;
};

const DISPLAY_OVERRIDES: Partial<
  Record<
    string,
    Pick<
      SubjectCatalogEntry,
      "description" | "accent" | "accentMuted" | "trending" | "recommended" | "features"
    >
  >
> = {
  medicine: {
    description:
      "Board-style clinical items across organ systems — adaptive vignettes without repetitive stems.",
    accent: "#0071e3",
    accentMuted: "rgba(0, 113, 227, 0.12)",
    trending: true,
    recommended: true,
    features: ["Clinical reasoning", "Timed mocks", "Weak-area review"],
  },
  nursing: {
    description:
      "NCLEX NGN unfolding cases, bow-tie, matrix items — plus classic prioritization and SATA.",
    accent: "#5856d6",
    accentMuted: "rgba(88, 86, 214, 0.12)",
    trending: true,
    features: ["Prioritization", "Select-all-that-apply", "Rapid review"],
  },
  pharmacy: {
    description:
      "NAPLEX-focused calculations, interactions, and therapeutic decision-making.",
    accent: "#34c759",
    accentMuted: "rgba(52, 199, 89, 0.12)",
    features: ["Dosing calculations", "Drug interactions", "Mock exams"],
  },
  dentistry: {
    description:
      "INBDE-style coverage: oral pathology, radiology, restorative, pharmacology, and treatment planning.",
    accent: "#00c7be",
    accentMuted: "rgba(0, 199, 190, 0.12)",
    trending: true,
    recommended: true,
    features: ["Radiograph interpretation", "Treatment planning", "Oral pathology"],
  },
  math: {
    description:
      "Equations, graphs, and timed calculations with LaTeX-friendly notation.",
    accent: "#ff9500",
    accentMuted: "rgba(255, 149, 0, 0.12)",
    features: ["Calculations", "Graph interpretation", "Adaptive difficulty"],
  },
  biology: {
    description:
      "Genetics, physiology, and molecular biology with diagram-based application items.",
    accent: "#30b0c7",
    accentMuted: "rgba(48, 176, 199, 0.12)",
    features: ["Pedigree analysis", "Pathway questions", "Data interpretation"],
  },
  chemistry: {
    description:
      "Organic mechanisms, biochemistry pathways, stoichiometry, and reaction logic.",
    accent: "#af52de",
    accentMuted: "rgba(175, 82, 222, 0.12)",
    features: ["Mechanisms", "Scientific notation", "Calculation drills"],
  },
  sat: {
    description:
      "Digital SAT Reading & Writing and Math — adaptive module strategy and College Board tone.",
    accent: "#ff2d55",
    accentMuted: "rgba(255, 45, 85, 0.12)",
    trending: true,
    recommended: true,
    features: ["Reading & Writing", "Math", "Adaptive modules"],
  },
};

const DEFAULT_DIFFICULTIES = ["Easy", "Medium", "Hard"];

export function getSubjectCatalog(): SubjectCatalogEntry[] {
  return getRegisteredSubjectIds().map((fieldId) => {
    const mod = resolveSubjectModule(fieldId);
    const meta = mod.metadata;
    const override = DISPLAY_OVERRIDES[fieldId];
    const category =
      meta.category === "stem" || meta.category === "professional"
        ? meta.category
        : "professional";

    return {
      fieldId,
      label: meta.label,
      description:
        override?.description ??
        meta.examFocus.slice(0, 120) + (meta.examFocus.length > 120 ? "…" : ""),
      boardExam: meta.boardExam ?? "Board-style exams",
      category,
      accent: override?.accent ?? "#0071e3",
      accentMuted: override?.accentMuted ?? "rgba(0, 113, 227, 0.12)",
      topicCount: mod.subjectAreas.length,
      difficultyLevels: DEFAULT_DIFFICULTIES,
      features: override?.features ?? ["Adaptive exams", "Question bank", "Analytics"],
      trending: override?.trending,
      recommended: override?.recommended,
    };
  });
}

export function getTrendingSubjects(): SubjectCatalogEntry[] {
  return getSubjectCatalog().filter((s) => s.trending);
}

export function getRecommendedSubjects(): SubjectCatalogEntry[] {
  return getSubjectCatalog().filter((s) => s.recommended);
}

export function getCatalogEntry(fieldId: string): SubjectCatalogEntry | undefined {
  return getSubjectCatalog().find((s) => s.fieldId === fieldId);
}

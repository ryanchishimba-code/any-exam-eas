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
  nursing: {
    description:
      "NCLEX NGN unfolding cases, bow-tie, matrix items — plus classic prioritization and SATA.",
    accent: "#5856d6",
    accentMuted: "rgba(88, 86, 214, 0.12)",
    trending: true,
    recommended: true,
    features: ["Prioritization", "Select-all-that-apply", "Rapid review"],
  },
  "usmle-step-1": {
    description:
      "Basic-science vignettes across anatomy, pathology, pharmacology, biochemistry, and microbiology.",
    accent: "#0071e3",
    accentMuted: "rgba(0, 113, 227, 0.12)",
    trending: true,
    recommended: true,
    features: ["Mechanisms & pathology", "Timed mocks", "Weak-area review"],
  },
  "usmle-step-2": {
    description:
      "Clinical vignettes across organ systems — diagnosis, management, and complications.",
    accent: "#0a84ff",
    accentMuted: "rgba(10, 132, 255, 0.12)",
    trending: true,
    recommended: true,
    features: ["Clinical reasoning", "Organ systems", "Mock exams"],
  },
  pharmacy: {
    description:
      "NAPLEX-focused calculations, interactions, and therapeutic decision-making.",
    accent: "#34c759",
    accentMuted: "rgba(52, 199, 89, 0.12)",
    features: ["Dosing calculations", "Drug interactions", "Mock exams"],
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
      features: override?.features ?? ["Personalized practice", "Question bank", "Analytics"],
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

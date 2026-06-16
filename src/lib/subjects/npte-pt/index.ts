import type { SubjectModule } from "../types";
import { linkTaxonomyToSubjects } from "../taxonomy";
import { medicineModule } from "../medicine";
import { NPTE_PT_SUBJECTS } from "./subjects";
import { NPTE_PT_SYSTEM_AUGMENTATION, getNptePtUserAugmentation } from "./prompts";

const NPTE_PT_TAXONOMY = linkTaxonomyToSubjects(
  {
    id: "npte-pt",
    label: "NPTE-PT",
    children: NPTE_PT_SUBJECTS.map((s) => ({
      id: `${s.id}-node`,
      label: s.label,
      subjectId: s.id,
    })),
  },
  NPTE_PT_SUBJECTS
);

export const nptePtModule: SubjectModule = {
  ...medicineModule,
  metadata: {
    ...medicineModule.metadata,
    id: "npte-pt",
    label: "NPTE-PT",
    boardExam: "NPTE-PT",
    examFocus:
      "FSBPT blueprint — musculoskeletal, neuromuscular, cardiopulmonary, other body systems, modalities, equipment, safety, ethics, EBP",
    topicPlaceholder: "Select a content area (e.g. Musculoskeletal, Neuromuscular)",
  },
  subjectAreas: NPTE_PT_SUBJECTS,
  taxonomy: NPTE_PT_TAXONOMY,
  buildSearchQueryHints: (topic, subjectId) =>
    [`NPTE-PT ${topic}`, subjectId ? `${subjectId.replace(/-/g, " ")} physical therapy` : ""].filter(
      Boolean
    ),
  getExamSystemAugmentation: () => NPTE_PT_SYSTEM_AUGMENTATION,
  getExamUserAugmentation: (ctx) => getNptePtUserAugmentation(ctx),
};

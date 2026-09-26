import type { BoardComposeConfig } from "@/lib/exam-prep/compose/board-exam-composer";
import { areasFromPointWeights } from "@/lib/exam-prep/compose/point-weight-bands";
import { PANCE_TASK_AREAS } from "@/lib/exam-prep/pance/content-outline";

/**
 * PANCE practice blocks.
 *
 * Source: NCCPA PANCE Content Blueprint, effective beginning January 2025
 * for all PANCE administrations (current for 2026).
 * https://www.nccpa.net/wp-content/uploads/PANCE-Blueprint.pdf
 * https://www.nccpa.net/become-certified/pance-blueprint/
 *
 * Medical content (sums to 100%):
 * cardiovascular 11, pulmonary 9, gastrointestinal 8, musculoskeletal 8,
 * neurologic 7, psychiatry 7, infectious diseases 7, reproductive 7,
 * endocrine 6, EENT 6, hematologic 5, renal 5, dermatologic 4,
 * genitourinary 4, professional practice 6.
 *
 * Task areas (sums to 100%): history/physical 16, diagnostic studies 10,
 * diagnosis 18, health maintenance 11, clinical intervention 16,
 * pharmaceutical therapeutics 15, basic science 8, professional practice 6.
 * NCCPA notes that professional-practice items are not also coded to the
 * other task areas. Stored tags are used as written. Renal is its own
 * content category in this blueprint. It is not folded into genitourinary,
 * and professional-practice is not folded into a catch-all "other" bucket.
 *
 * Length is one 60-item PANCE block. The 300-item full exam simulation
 * stays unchanged. Weights are points; each quota is the rounded count ±1.
 */
export const PANCE_BLOCK_LENGTH = 60;

export const PANCE_2025_CONTENT: readonly { id: string; label: string; weight: number }[] = [
  { id: "cardiovascular", label: "Cardiovascular System", weight: 0.11 },
  { id: "dermatologic", label: "Dermatologic System", weight: 0.04 },
  { id: "endocrine", label: "Endocrine System", weight: 0.06 },
  { id: "eent", label: "Eyes, Ears, Nose, and Throat", weight: 0.06 },
  { id: "gastrointestinal", label: "Gastrointestinal System/Nutrition", weight: 0.08 },
  { id: "genitourinary", label: "Genitourinary System", weight: 0.04 },
  { id: "hematologic", label: "Hematologic System", weight: 0.05 },
  { id: "infectious-diseases", label: "Infectious Diseases", weight: 0.07 },
  { id: "musculoskeletal", label: "Musculoskeletal System", weight: 0.08 },
  { id: "neurologic", label: "Neurologic System", weight: 0.07 },
  { id: "psychiatry", label: "Psychiatry/Behavioral Science", weight: 0.07 },
  { id: "pulmonary", label: "Pulmonary System", weight: 0.09 },
  { id: "renal", label: "Renal System", weight: 0.05 },
  { id: "reproductive", label: "Reproductive System", weight: 0.07 },
  { id: "professional-practice", label: "Professional Practice", weight: 0.06 },
];

const CONTENT_IDS = new Set<string>(PANCE_2025_CONTENT.map((row) => row.id));
const TASK_IDS = new Set<string>(PANCE_TASK_AREAS.map((task) => task.id));

export function panceContentId(tag: string | null | undefined): string | null {
  const id = tag?.trim() ?? "";
  return CONTENT_IDS.has(id) ? id : null;
}

export function panceTaskId(tag: string | null | undefined): string | null {
  const id = tag?.trim() ?? "";
  return TASK_IDS.has(id) ? id : null;
}

export function panceComposeConfig(maxFullExams = 200): BoardComposeConfig {
  return {
    boardId: "pance",
    fullExamLength: PANCE_BLOCK_LENGTH,
    maxFullExams,
    maxItemReuse: 1,
    selectionSeed: "aee-pance-compose-2026-09-26",
    blockContradictoryKeys: true,
    dropBoilerplateTokens: true,
    areas: areasFromPointWeights(PANCE_BLOCK_LENGTH, PANCE_2025_CONTENT),
    secondaryAreas: areasFromPointWeights(
      PANCE_BLOCK_LENGTH,
      PANCE_TASK_AREAS.map((task) => ({ id: task.id, label: task.label, weight: task.weight }))
    ),
    fullExamTitle: (index) => `PANCE Practice Exam ${index}`,
  };
}

export const PANCE_COMPOSE_SOURCE =
  "NCCPA PANCE Content Blueprint, effective January 2025 (https://www.nccpa.net/wp-content/uploads/PANCE-Blueprint.pdf)";

import type { BoardComposeConfig } from "@/lib/exam-prep/compose/board-exam-composer";
import { areasFromPointWeights } from "@/lib/exam-prep/compose/point-weight-bands";
import { NPTE_PT_BODY_SYSTEMS, NPTE_PT_OUTLINE_SOURCE, NPTE_PT_TASK_AREAS } from "@/lib/exam-prep/npte-pt/content-outline";
import { NPTE_PT_BLUEPRINT_SOURCE } from "@/lib/exam-prep/npte-pt/types";

/**
 * NPTE-PT practice sections.
 *
 * Source: FSBPT NPTE-PT Test Content Outline, current for 2026.
 * https://www.fsbpt.org/FreeResources/NPTEDevelopment.aspx
 *
 * Body-system weights below are the in-repo normalized FSBPT outline
 * (`NPTE_PT_BODY_SYSTEMS`). They sum to about 100% and are the fill axis.
 * Bands are the rounded count ±1 item.
 *
 * Process tasks (examination 18%, evaluation/diagnosis/prognosis 24%,
 * interventions 21%) sum to 63%. They are not a 100% partition, so they
 * are reported after the form is built and are not exclusive quotas.
 *
 * Length is one 50-item section. The full exam is 250 items (five
 * sections). A 250-item on-blueprint form would burn the pool. A section
 * is the useful practice unit. An item may appear in up to 3 sections,
 * and never twice inside one section. The 250-item full exam simulation
 * stays unchanged.
 */
export const NPTE_PT_SECTION_LENGTH = 50;

const SYSTEM_IDS = new Set<string>(NPTE_PT_BODY_SYSTEMS.map((system) => system.id));
const TASK_IDS = new Set<string>(NPTE_PT_TASK_AREAS.map((task) => task.id));

export function npteBodySystemId(tag: string | null | undefined): string | null {
  const id = tag?.trim() ?? "";
  return SYSTEM_IDS.has(id) ? id : null;
}

export function npteTaskId(tag: string | null | undefined): string | null {
  const id = tag?.trim() ?? "";
  return TASK_IDS.has(id) ? id : null;
}

export function nptePtComposeConfig(maxFullExams = 100): BoardComposeConfig {
  return {
    boardId: "npte-pt",
    fullExamLength: NPTE_PT_SECTION_LENGTH,
    maxFullExams,
    // Same reuse cap as NAPLEX. Count stays at or below the 100 active rows.
    maxItemReuse: 3,
    selectionSeed: "aee-npte-pt-compose-2026-09-26",
    blockContradictoryKeys: true,
    dropBoilerplateTokens: true,
    areas: areasFromPointWeights(
      NPTE_PT_SECTION_LENGTH,
      NPTE_PT_BODY_SYSTEMS.map((system) => ({
        id: system.id,
        label: system.label,
        weight: system.weight,
      }))
    ),
    fullExamTitle: (index) => `NPTE-PT Practice Exam ${index}`,
  };
}

export const NPTE_PT_COMPOSE_SOURCE = `${NPTE_PT_BLUEPRINT_SOURCE}. ${NPTE_PT_OUTLINE_SOURCE}. Body-system weights are the normalized outline in content-outline.ts.`;

export const NPTE_PT_TASK_WEIGHT_SUM = NPTE_PT_TASK_AREAS.reduce((sum, task) => sum + task.weight, 0);

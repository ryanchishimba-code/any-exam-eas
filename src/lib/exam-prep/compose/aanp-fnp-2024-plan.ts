import type { BoardComposeConfig } from "@/lib/exam-prep/compose/board-exam-composer";
import { areasFromPointWeights } from "@/lib/exam-prep/compose/point-weight-bands";
import {
  AANP_FNP_AGE_GROUP_LABELS,
  AANP_FNP_AGE_GROUP_WEIGHTS,
  AANP_FNP_BLUEPRINT_SOURCE,
  AANP_FNP_DOMAIN_LABELS,
  AANP_FNP_DOMAIN_WEIGHTS,
  type AanpFnpDomainId,
  type AanpFnpPatientAgeGroupId,
} from "@/lib/exam-prep/aanp-fnp/types";

/**
 * AANP FNP practice forms.
 *
 * Source: AANPCB FNP Content Outline (2024+ blueprint),
 * https://www.aanpcert.org/certs/fnp — domain and age-group weights in
 * `AANP_FNP_BLUEPRINT_SOURCE`. Both axes sum to 100% and are fill quotas.
 * The weights are points, not published ranges. Each quota is the rounded
 * count ±1 item.
 *
 * Length is 135, the scored portion of the 150-item exam (15 unscored
 * pretest items). The bank has no pretest flag, so a 150-item form of
 * scored questions would overstate the exam. 135 also matches the full
 * exam simulation, which stays 135. Older-adult is 30% of the outline, so
 * it limits how many on-plan forms the pool can fill.
 */
export const AANP_FNP_COMPOSE_LENGTH = 135;

const DOMAIN_IDS = new Set<string>(Object.keys(AANP_FNP_DOMAIN_WEIGHTS));
const AGE_IDS = new Set<string>(Object.keys(AANP_FNP_AGE_GROUP_WEIGHTS));

function weightRows<T extends string>(
  weights: Record<T, number>,
  labels: Record<T, string>
): { id: string; label: string; weight: number }[] {
  return (Object.keys(weights) as T[]).map((id) => ({
    id,
    label: labels[id],
    weight: weights[id],
  }));
}

export function aanpDomainId(tag: string | null | undefined): AanpFnpDomainId | null {
  const id = tag?.trim() ?? "";
  return DOMAIN_IDS.has(id) ? (id as AanpFnpDomainId) : null;
}

export function aanpAgeGroupId(tag: string | null | undefined): AanpFnpPatientAgeGroupId | null {
  const id = tag?.trim() ?? "";
  return AGE_IDS.has(id) ? (id as AanpFnpPatientAgeGroupId) : null;
}

export function aanpFnpComposeConfig(maxFullExams = 100): BoardComposeConfig {
  return {
    boardId: "aanp-fnp",
    fullExamLength: AANP_FNP_COMPOSE_LENGTH,
    maxFullExams,
    // Same reuse cap as NAPLEX. Count stays at or below the 100 active rows.
    maxItemReuse: 3,
    selectionSeed: "aee-aanp-fnp-compose-2026-09-26",
    blockContradictoryKeys: true,
    dropBoilerplateTokens: true,
    areas: areasFromPointWeights(
      AANP_FNP_COMPOSE_LENGTH,
      weightRows(AANP_FNP_DOMAIN_WEIGHTS, AANP_FNP_DOMAIN_LABELS)
    ),
    secondaryAreas: areasFromPointWeights(
      AANP_FNP_COMPOSE_LENGTH,
      weightRows(AANP_FNP_AGE_GROUP_WEIGHTS, AANP_FNP_AGE_GROUP_LABELS)
    ),
    fullExamTitle: (index) => `AANP FNP-C Practice Exam ${index}`,
  };
}

export const AANP_FNP_COMPOSE_SOURCE = AANP_FNP_BLUEPRINT_SOURCE;

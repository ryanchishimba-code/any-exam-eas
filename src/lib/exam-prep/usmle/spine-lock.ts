/**
 * Generation / curation lock — every emit must use spine organ systems + valid tasks.
 */
import {
  isUsmleOrganSystemId,
  type UsmleOrganSystemId,
  type UsmleOfficialPhysicianTaskId,
  USMLE_PHYSICIAN_TASKS,
} from "./official-content-model";
import { resolveOrganSystemId, legacyPhysicianTaskFromOfficial } from "./content-spine";
import { normalizeUsmleBlueprintTopic } from "./blueprint-topic-aliases";
import type { UsmlePhysicianTaskId, UsmleGenerationSlot } from "./types";

const LEGACY_PHYSICIAN_TASKS = new Set<string>([
  "diagnosis",
  "health-maintenance",
  "clinical-intervention",
  "pharmacotherapy",
  "interpretation",
  "communication",
  "professionalism",
]);

const OFFICIAL_PHYSICIAN_TASKS = new Set(
  USMLE_PHYSICIAN_TASKS.map((t) => t.id)
);

export function isValidUsmlePhysicianTaskId(id: string): boolean {
  return OFFICIAL_PHYSICIAN_TASKS.has(id as UsmleOfficialPhysicianTaskId) || LEGACY_PHYSICIAN_TASKS.has(id);
}

/** Coerce a generation slot onto the official spine before AI emit / bank write. */
export function lockGenerationSlotToSpine(slot: UsmleGenerationSlot): UsmleGenerationSlot {
  const system =
    resolveOrganSystemId(slot.blueprintSystem, slot.blueprintTopic, slot.subjectId) ??
    (isUsmleOrganSystemId(slot.blueprintSystem) ? slot.blueprintSystem : null) ??
    "multisystem";

  const topic =
    normalizeUsmleBlueprintTopic(slot.blueprintTopic) ??
    (slot.blueprintTopic.trim() || "next-best-step");

  let physicianTask = slot.physicianTask;
  if (OFFICIAL_PHYSICIAN_TASKS.has(physicianTask as UsmleOfficialPhysicianTaskId)) {
    physicianTask = legacyPhysicianTaskFromOfficial(
      physicianTask as UsmleOfficialPhysicianTaskId
    ) as UsmlePhysicianTaskId;
  }
  if (!LEGACY_PHYSICIAN_TASKS.has(physicianTask)) {
    physicianTask = "diagnosis";
  }

  return {
    ...slot,
    categoryId: system,
    blueprintSystem: system,
    blueprintTopic: topic,
    physicianTask,
  };
}

export function assertSpineOrganSystem(id: string): asserts id is UsmleOrganSystemId {
  if (!isUsmleOrganSystemId(id)) {
    throw new Error(`Invalid USMLE spine organ system: ${id}`);
  }
}

/** Bank-item tag check used by curation / QA scripts. */
export function bankItemHasValidSpineTags(item: {
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  subjectId?: string | null;
  physicianTask?: string | null;
  ngnPayload?: Record<string, unknown> | null;
}): boolean {
  const domain =
    resolveOrganSystemId(item.blueprintDomain, item.blueprintTopic, item.subjectId) ??
    (item.blueprintDomain && isUsmleOrganSystemId(item.blueprintDomain)
      ? item.blueprintDomain
      : null);
  if (!domain) return false;

  const task =
    item.physicianTask ??
    (typeof item.ngnPayload?.physicianTask === "string"
      ? item.ngnPayload.physicianTask
      : null);
  if (task && !isValidUsmlePhysicianTaskId(task)) return false;
  return true;
}

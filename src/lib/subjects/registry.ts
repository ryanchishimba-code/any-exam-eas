import type {
  SubjectArea,
  SubjectCapabilities,
  SubjectModule,
} from "./types";
import { nursingModule } from "./nursing";
import { pharmacyModule } from "./pharmacy";
import { usmleStep1Module } from "./usmle-step-1";
import { usmleStep2Module } from "./usmle-step-2";
import {
  EXAM_FIELD_IDS,
  FIELD_ID_ALIASES,
  normalizeFieldId,
} from "./field-ids";

const MODULES: Record<string, SubjectModule> = {
  nursing: nursingModule,
  "usmle-step-1": usmleStep1Module,
  "usmle-step-2": usmleStep2Module,
  pharmacy: pharmacyModule,
};

/** Capability registry — controls generation behavior per discipline. */
export const SUBJECT_CAPABILITY_REGISTRY: Record<string, SubjectCapabilities> =
  Object.fromEntries(
    Object.entries(MODULES).map(([id, m]) => [id, m.capabilities])
  );

export function registerSubjectModule(module: SubjectModule): void {
  MODULES[module.metadata.id] = module;
  SUBJECT_CAPABILITY_REGISTRY[module.metadata.id] = module.capabilities;
}

export function getRegisteredSubjectIds(): string[] {
  return [...EXAM_FIELD_IDS];
}

export function resolveSubjectModule(fieldId: string): SubjectModule {
  const id = normalizeFieldId(fieldId);
  return MODULES[id] ?? usmleStep2Module;
}

export function getSubjectModuleByLabel(fieldLabel: string): SubjectModule {
  const normalized = fieldLabel.toLowerCase();
  const found = Object.values(MODULES).find(
    (m) =>
      m.metadata.label.toLowerCase() === normalized ||
      m.metadata.boardExam?.toLowerCase() === normalized
  );
  if (found) return found;

  for (const [alias, canonical] of Object.entries(FIELD_ID_ALIASES)) {
    if (alias === normalized && MODULES[canonical]) {
      return MODULES[canonical];
    }
  }

  return usmleStep2Module;
}

export function getAllFieldSubjects(): Record<string, SubjectArea[]> {
  return Object.fromEntries(
    EXAM_FIELD_IDS.map((id) => [id, MODULES[id].subjectAreas])
  );
}

export function getSubjectArea(
  fieldId: string,
  subjectId: string
): SubjectArea | undefined {
  const subjectModule = resolveSubjectModule(fieldId);
  return subjectModule.subjectAreas.find(
    (s) => s.id === subjectId || s.label.toLowerCase() === subjectId.toLowerCase()
  );
}

export function getSubjectsForFieldId(fieldId: string): SubjectArea[] {
  return resolveSubjectModule(fieldId).subjectAreas;
}

export function getCapabilities(fieldId: string): SubjectCapabilities {
  return resolveSubjectModule(fieldId).capabilities;
}

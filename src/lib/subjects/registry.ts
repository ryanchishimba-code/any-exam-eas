import type {
  SubjectArea,
  SubjectCapabilities,
  SubjectModule,
} from "./types";
import { medicineModule } from "./medicine";
import { nursingModule } from "./nursing";
import { pharmacyModule } from "./pharmacy";

const MODULES: Record<string, SubjectModule> = {
  medicine: medicineModule,
  nursing: nursingModule,
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
  return Object.keys(MODULES);
}

export function resolveSubjectModule(fieldId: string): SubjectModule {
  const id = fieldId.toLowerCase().replace(/\s+/g, "-");
  return (
    MODULES[id] ??
    MODULES.medicine // fallback for unknown fields until a module is added
  );
}

export function getSubjectModuleByLabel(fieldLabel: string): SubjectModule {
  const found = Object.values(MODULES).find(
    (m) => m.metadata.label.toLowerCase() === fieldLabel.toLowerCase()
  );
  return found ?? medicineModule;
}

export function getAllFieldSubjects(): Record<string, SubjectArea[]> {
  return Object.fromEntries(
    Object.entries(MODULES).map(([id, m]) => [id, m.subjectAreas])
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

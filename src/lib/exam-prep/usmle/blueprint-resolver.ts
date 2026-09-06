/**
 * Map question-bank rows to USMLE blueprint category ids for gap audits.
 */
import { getExamBlueprint, type ExamBlueprint } from "@/lib/engine/blueprints";
import {
  USMLE_STEP1_2026_BLUEPRINT,
  USMLE_STEP2_2026_BLUEPRINT,
} from "./blueprint-quota";
import { isUsmleCalculationItem } from "../usmle-calc-mcq-helpers";
import { resolveOrganSystemId } from "./content-spine";

export type UsmleBlueprintBankRow = {
  subjectId: string;
  itemType?: string | null;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  tags?: string | null;
  question?: string | null;
  scenario?: string | null;
};

/** Explicit Step 1 basic-science → organ-system mapping (pathology spans many categories). */
const STEP1_SUBJECT_CATEGORY: Record<string, string> = {
  anatomy: "musculoskeletal",
  physiology: "respiratory-renal",
  pathology: "hematology-immunology",
  pharmacology: "pharmacology-microbiology",
  biochemistry: "biochemistry-genetics",
  microbiology: "pharmacology-microbiology",
  cardiology: "cardiovascular",
  pulmonology: "respiratory-renal",
  nephrology: "respiratory-renal",
  neurology: "behavioral-nervous",
  psychiatry: "behavioral-nervous",
  hematology: "hematology-immunology",
  hepatology: "gastrointestinal",
  "internal-medicine": "gastrointestinal",
  obgyn: "reproductive-endocrine",
  pediatrics: "behavioral-nervous",
  "emergency-medicine": "cardiovascular",
};

/** Step 2 CK discipline mapping — emergency medicine → surgery before IM overlap. */
const STEP2_SUBJECT_CATEGORY: Record<string, string> = {
  pediatrics: "pediatrics",
  obgyn: "obgyn",
  psychiatry: "psychiatry",
  surgery: "surgery-acute-care",
  "emergency-medicine": "surgery-acute-care",
  cardiology: "internal-medicine",
  pulmonology: "internal-medicine",
  nephrology: "internal-medicine",
  neurology: "internal-medicine",
  hematology: "internal-medicine",
  hepatology: "internal-medicine",
  "internal-medicine": "internal-medicine",
  anatomy: "internal-medicine",
  physiology: "internal-medicine",
  pathology: "internal-medicine",
  pharmacology: "internal-medicine",
  biochemistry: "internal-medicine",
  microbiology: "internal-medicine",
};

const STEP3_ITEM_TYPE_CATEGORY: Record<string, string> = {
  biostats: "biostatistics",
  ethics: "ethics",
  abstract: "pharm-advertising",
  drug_ad: "pharm-advertising",
  ccs_prompt: "ccs",
};

const STEP3_SUBJECT_CATEGORY: Record<string, string> = {
  pediatrics: "pediatrics",
  obgyn: "obgyn",
  psychiatry: "psychiatry",
  "emergency-medicine": "surgery",
  cardiology: "internal-medicine",
  pulmonology: "internal-medicine",
  nephrology: "internal-medicine",
  neurology: "internal-medicine",
  hematology: "internal-medicine",
  "internal-medicine": "internal-medicine",
  pharmacology: "pharm-advertising",
};

function resolveFromBlueprintDomain(
  blueprintDomain: string | null | undefined,
  blueprint: ExamBlueprint
): string | null {
  if (!blueprintDomain?.trim()) return null;
  const key = blueprintDomain.trim().toLowerCase();
  const match = blueprint.categories.find(
    (c) => c.id === key || c.label.toLowerCase() === key
  );
  return match?.id ?? null;
}

function resolveStep1Category(row: UsmleBlueprintBankRow): string | null {
  if (isUsmleCalculationItem(row)) {
    return row.subjectId === "pathology" ? "pathology" : "biochemistry";
  }

  const disciplineBlueprint = getExamBlueprint("usmle-step-1");
  const fromDomain = resolveFromBlueprintDomain(
    row.blueprintDomain,
    disciplineBlueprint ?? USMLE_STEP1_2026_BLUEPRINT
  );
  if (fromDomain) return fromDomain;

  // Step 1 bank rows are tagged by basic-science discipline (anatomy, pathology, …).
  if (disciplineBlueprint?.categories.some((c) => c.id === row.subjectId)) {
    return row.subjectId;
  }

  return STEP1_SUBJECT_CATEGORY[row.subjectId] ?? null;
}

function resolveStep2Category(row: UsmleBlueprintBankRow): string | null {
  if (isUsmleCalculationItem(row)) {
    return row.subjectId === "pediatrics" ? "pediatrics" : "internal-medicine";
  }

  const fromDomain = resolveFromBlueprintDomain(row.blueprintDomain, USMLE_STEP2_2026_BLUEPRINT);
  if (fromDomain) return fromDomain;
  return STEP2_SUBJECT_CATEGORY[row.subjectId] ?? null;
}

function resolveStep3Category(row: UsmleBlueprintBankRow): string | null {
  const step3 = getExamBlueprint("usmle-step-3");
  if (!step3) return null;

  if (isUsmleCalculationItem(row)) return "biostatistics";

  const itemType = row.itemType?.trim().toLowerCase() ?? "mcq";
  if (STEP3_ITEM_TYPE_CATEGORY[itemType]) {
    return STEP3_ITEM_TYPE_CATEGORY[itemType]!;
  }

  const fromDomain = resolveFromBlueprintDomain(row.blueprintDomain, step3);
  if (fromDomain) return fromDomain;

  return STEP3_SUBJECT_CATEGORY[row.subjectId] ?? "internal-medicine";
}

export function resolveUsmleBlueprintCategory(
  fieldId: string,
  row: UsmleBlueprintBankRow
): string | null {
  // Prefer official organ-system spine whenever domain/topic/subject can resolve.
  const spine = resolveOrganSystemId(row.blueprintDomain, row.blueprintTopic, row.subjectId);
  if (spine) return spine;

  switch (fieldId) {
    case "usmle-step-1":
      return resolveStep1Category(row);
    case "usmle-step-2":
      return resolveStep2Category(row);
    case "usmle-step-3":
      return resolveStep3Category(row);
    default:
      return null;
  }
}

export function blueprintForUsmleField(fieldId: string): ExamBlueprint | undefined {
  switch (fieldId) {
    case "usmle-step-1":
      // Served bank is discipline-tagged; use roadmap blueprint for gap audits.
      return getExamBlueprint("usmle-step-1") ?? USMLE_STEP1_2026_BLUEPRINT;
    case "usmle-step-2":
      return USMLE_STEP2_2026_BLUEPRINT;
    case "usmle-step-3":
      return getExamBlueprint("usmle-step-3");
    default:
      return undefined;
  }
}

import type { ExamSlug } from "@/types/edtech";
import { getHighYieldProcedures, getProcedureById } from "./procedures";

const EXAM_FEATURED_PROCEDURE_IDS: Record<ExamSlug, string[]> = {
  nclex: ["chest-tube", "appendectomy", "lap-chole", "thoracentesis", "tracheostomy", "colonoscopy"],
  usmle: ["cabg", "pci", "lap-chole", "whipple", "nephrectomy", "mechanical-thrombectomy"],
  naplex: ["lap-chole", "ercp-sphincterotomy", "tips", "thyroidectomy", "turp", "colonoscopy"],
  pance: ["cabg", "appendectomy", "lap-chole", "thoracentesis", "turp", "colonoscopy"],
  "aanp-fnp": ["appendectomy", "lap-chole", "thyroidectomy", "colonoscopy", "turp", "thoracentesis"],
  "npte-pt": ["appendectomy", "cabg", "thoracentesis", "tracheostomy", "turp", "colonoscopy"],
};

export function getFeaturedProceduresForExam(examSlug: ExamSlug) {
  return EXAM_FEATURED_PROCEDURE_IDS[examSlug]
    .map((id) => getProcedureById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}

export function getDefaultProcedureTourIdForExam(examSlug: ExamSlug): string {
  switch (examSlug) {
    case "nclex":
      return "proc-thoracic";
    case "usmle":
      return "proc-cardiac-interventions";
    case "naplex":
      return "proc-hepatobiliary";
    case "pance":
      return "proc-cardiac-interventions";
    case "aanp-fnp":
      return "proc-thoracic";
    default:
      return "proc-cardiac-interventions";
  }
}

export function getPrimaryStructureIdForProcedure(procedureId: string): string | null {
  const proc = getProcedureById(procedureId);
  if (!proc) return null;
  return proc.subregionIds?.[0] ?? proc.structureIds[0] ?? null;
}

export function getHighYieldProcedureCount(): number {
  return getHighYieldProcedures().length;
}

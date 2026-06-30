import type { ExamSlug } from "@/types/edtech";
import { loadPresetExamItems } from "./load-preset-exam";

/** Map bank fieldId to public exam slug for preset loading. */
export function fieldIdToExamSlug(fieldId: string): ExamSlug | null {
  if (fieldId === "nursing") return "nclex";
  if (fieldId === "pharmacy") return "naplex";
  if (fieldId === "pance") return "pance";
  if (fieldId === "aanp-fnp") return "aanp-fnp";
  if (fieldId === "npte-pt") return "npte-pt";
  if (fieldId.startsWith("usmle")) return "usmle";
  return null;
}

export { loadPresetExamItems };

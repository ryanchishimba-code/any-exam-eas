import type { BankItem } from "@/lib/question-bank";
import { publishedCatalogToExamItems } from "@/lib/full-exam/published-clinical-exam";

/** Server-only. The clinical catalog is ngn_item, not the MCQ question bank. */
export async function loadPublishedClinicalExamItems(fieldId: string): Promise<BankItem[]> {
  if (fieldId !== "nursing") return [];
  const { loadPublishedClinicalBank } = await import("@/lib/assessment/serve-db");
  const bank = await loadPublishedClinicalBank(fieldId);
  return publishedCatalogToExamItems(bank.catalog);
}

import type { BankItem } from "@/lib/question-bank";
import { resolveNaplexStem, resolveNaplexVignette } from "./naplex-stem";

const COUNSELING_TEMPLATE_GRAFT =
  /^Counsel on ([A-Z][a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)?) adherence, expected benefits, recognizing /;

/** Full naplex-polish "counseling" template graft — drug name must appear in vignette/stem. */
const COUNSELING_TEMPLATE_GRAFT_GLOBAL =
  /^Counsel on ([A-Z][a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)?) adherence, expected benefits, recognizing /gm;

/** Extract drug names from grafted counseling-template options. */
export function extractCounselTemplateDrugs(text: string): string[] {
  const drugs: string[] = [];
  for (const match of text.matchAll(COUNSELING_TEMPLATE_GRAFT_GLOBAL)) {
    const drug = match[1]?.toLowerCase();
    if (drug) drugs.push(drug);
  }
  return drugs;
}

/**
 * True when naplex-polish counseling-template options cite a drug absent from the vignette/stem
 * (e.g. Allopurinol options grafted onto a warfarin SATA item).
 */
export function naplexStemOptionDrugMismatch(item: BankItem): string | null {
  const vignette = resolveNaplexVignette(item);
  const stem = resolveNaplexStem(item);
  const context = `${vignette}\n${stem}`.toLowerCase();
  if (context.trim().length < 20) return null;

  for (const text of [item.correctAnswer, ...item.options]) {
    const match = text.match(COUNSELING_TEMPLATE_GRAFT);
    if (!match) continue;
    const drug = match[1]!.toLowerCase();
    if (!context.includes(drug)) return drug;
  }
  return null;
}

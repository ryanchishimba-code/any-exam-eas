/**
 * Normalize AI exhibit / lab payloads into renderable stem tables + media refs.
 * USMLE wrapper — promotes vignette → exhibit when a table is present.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  normalizeExhibitTablePayload,
  resolveExhibitTable,
  type ExhibitTablePayload,
} from "../exhibit-normalize";

export type { ExhibitTablePayload };
export { resolveExhibitTable };

export function normalizeUsmleExhibitPayload(item: BankItem): BankItem {
  return normalizeExhibitTablePayload(item, { promoteExhibitKind: true });
}

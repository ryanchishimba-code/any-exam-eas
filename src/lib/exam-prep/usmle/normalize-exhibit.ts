/**
 * Normalize AI exhibit / lab payloads into renderable stem tables + media refs.
 * USMLE wrapper — promotes vignette → exhibit when a table is present;
 * prunes purpose-misfit catalog media and attaches a fitting figure when available.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  normalizeExhibitTablePayload,
  resolveExhibitTable,
  type ExhibitTablePayload,
} from "../exhibit-normalize";
import {
  attachFigureRefToNgn,
  pruneMisfitUsmleMedia,
  selectUsmleFigureForItem,
} from "./figure-assets";

export type { ExhibitTablePayload };
export { resolveExhibitTable };

export function normalizeUsmleExhibitPayload(item: BankItem): BankItem {
  let next = normalizeExhibitTablePayload(item, { promoteExhibitKind: true });
  let ngn = pruneMisfitUsmleMedia({ ...(next.ngnPayload ?? {}) }, next);
  next = { ...next, ngnPayload: ngn };

  const selected = selectUsmleFigureForItem(next);
  if (!selected) return next;

  ngn = attachFigureRefToNgn(ngn, selected);
  return {
    ...next,
    ngnPayload: ngn,
  };
}

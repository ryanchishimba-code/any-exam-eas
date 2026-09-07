/**
 * NAPLEX exhibit normalize + purpose-gated figure attach.
 * Preserves item kinds (constructed, SATA, drag_drop, exhibit, …).
 */
import type { BankItem } from "@/lib/question-bank";
import { normalizeExhibitTablePayload } from "../exhibit-normalize";
import {
  attachNaplexFigureRefToNgn,
  pruneMisfitNaplexMedia,
  selectNaplexFigureForItem,
} from "./figure-assets";

export { resolveExhibitTable } from "../exhibit-normalize";

/** Normalize lab/exhibit tables and attach a purpose-fitting approved SVG when available. */
export function normalizeNaplexExhibitPayload(item: BankItem): BankItem {
  let next = normalizeExhibitTablePayload(item, { promoteExhibitKind: false });
  let ngn = pruneMisfitNaplexMedia({ ...(next.ngnPayload ?? {}) }, next);
  next = { ...next, ngnPayload: ngn };

  const selected = selectNaplexFigureForItem(next);
  if (!selected) return next;

  ngn = attachNaplexFigureRefToNgn(ngn, selected);
  return {
    ...next,
    ngnPayload: ngn,
  };
}

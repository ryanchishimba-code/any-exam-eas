/**
 * NCLEX exhibit normalize + figure attach for stem media/tables.
 * Preserves NGN item kinds (bow_tie, matrix, SATA, …).
 * Attaches figures only when vignette/stem content fits the asset.
 */
import type { BankItem } from "@/lib/question-bank";
import { normalizeExhibitTablePayload } from "../exhibit-normalize";
import {
  attachNclexFigureRefToNgn,
  pruneMisfitNclexMedia,
  selectNclexFigureForItem,
} from "./figure-assets";

export { resolveExhibitTable } from "../exhibit-normalize";

/** Normalize lab/exhibit tables and attach a content-fitting approved SVG when available. */
export function normalizeNclexExhibitPayload(item: BankItem): BankItem {
  let next = normalizeExhibitTablePayload(item, { promoteExhibitKind: false });
  let ngn = pruneMisfitNclexMedia({ ...(next.ngnPayload ?? {}) }, next);
  next = { ...next, ngnPayload: ngn };

  const selected = selectNclexFigureForItem(next);
  if (!selected) return next;

  ngn = attachNclexFigureRefToNgn(ngn, selected);
  return {
    ...next,
    ngnPayload: ngn,
  };
}

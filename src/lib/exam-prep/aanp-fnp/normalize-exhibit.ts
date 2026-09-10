/**
 * AANP FNP exhibit normalize + purpose-gated figure attach.
 */
import type { BankItem } from "@/lib/question-bank";
import { normalizeExhibitTablePayload } from "../exhibit-normalize";
import {
  attachAanpFnpFigureRefToNgn,
  pruneMisfitAanpFnpMedia,
  selectAanpFnpFigureForItem,
} from "./figure-assets";

export { resolveExhibitTable } from "../exhibit-normalize";

/** Normalize lab/exhibit tables and attach a purpose-fitting approved SVG when available. */
export function normalizeAanpFnpExhibitPayload(item: BankItem): BankItem {
  let next = normalizeExhibitTablePayload(item, { promoteExhibitKind: false });
  let ngn = pruneMisfitAanpFnpMedia({ ...(next.ngnPayload ?? {}) }, next);
  next = { ...next, ngnPayload: ngn };

  const selected = selectAanpFnpFigureForItem(next);
  if (!selected) return next;

  ngn = attachAanpFnpFigureRefToNgn(ngn, selected);
  return {
    ...next,
    ngnPayload: ngn,
  };
}

/** Prepare item the way students receive it (tables + purpose-fit media). */
export function prepareAanpFnpBankItem(item: BankItem): BankItem {
  return normalizeAanpFnpExhibitPayload(item);
}

import type { BankItem } from "@/lib/question-bank";
import { auditNclexBankItem, normalizeNclexBankItemFields, resolveNclexVignette } from "@/lib/exam-prep/nclex-bank-audit";
import { assessNclexItemQuality } from "@/lib/exam-prep/nclex-quality-gate";
import { applyNclexStemRepairs } from "@/lib/engine/polish/nclex-generic-checks";
import { enrichBankItemGuidelines } from "@/lib/exam-prep/enrich-guidelines";
import { polishNclexBankItem, scoreNclexBankItem, type NclexPolishResult } from "./nclex-polish";

function changed(b: BankItem, a: BankItem) {
  return b.question!==a.question||b.correctAnswer!==a.correctAnswer||b.explanation!==a.explanation||b.vignette!==a.vignette||b.scenario!==a.scenario||b.source!==a.source||JSON.stringify(b.options)!==JSON.stringify(a.options)||JSON.stringify(b.tags)!==JSON.stringify(a.tags);
}

function meta(item: BankItem): BankItem {
  const tags=[...(item.tags??[]).filter(t=>t!=="generated")];
  if(!tags.includes("cjmm-polished")) tags.push("cjmm-polished");
  return {...item,tags,source:item.source==="curated"||item.source==="ai-curated"?item.source:"polished"};
}

function explain(item: BankItem): BankItem {
  const exp=item.explanation?.trim()??"";
  if(exp.length>=120&&/Why other options are incorrect/i.test(exp)&&/Incorrect —/i.test(exp)) return item;
  const lines=item.options.filter(o=>o!==item.correctAnswer).map(o=>`• ${o}: Incorrect — does not reflect the highest-priority, safest nursing action for this clinical presentation.`).join("\n");
  return {...item,explanation:`Clinical Judgment (CJMM): apply ABCs and evidence-based nursing scope.\n${exp||"Priority nursing action for this scenario."}\n\nWhy other options are incorrect:\n${lines}`};
}

function light(item: BankItem): BankItem {
  const polished = meta(explain(normalizeNclexBankItemFields(applyNclexStemRepairs(item))));
  return enrichBankItemGuidelines(polished, "nursing").item;
}

export const ensureNclexCuratedMetadata = meta;
export const ensureNclexExplanation = explain;

export function elevateNclexBankItem(item: BankItem, subjectId: string, subjectLabel="NCLEX nursing", seed=0, opts?: {forcePolish?: boolean}): NclexPolishResult {
  const qualityBefore=scoreNclexBankItem(item);
  let working=light(item);
  let verdict=assessNclexItemQuality(working,{source:working.source??"polished"});
  if(opts?.forcePolish||verdict.tier!=="best"||!auditNclexBankItem(working).ok) {
    for(let i=0;i<5;i++) {
      working=light(polishNclexBankItem(working,subjectId,subjectLabel,seed+13371*i).item);
      verdict=assessNclexItemQuality(working,{source:"polished"});
      if(verdict.tier==="best"&&auditNclexBankItem(working).ok) break;
    }
  }
  return {item:working,changed:changed(item,working),qualityBefore,qualityAfter:scoreNclexBankItem(working)};
}

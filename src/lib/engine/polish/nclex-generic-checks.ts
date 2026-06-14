import type { BankItem } from "@/lib/question-bank";
import { resolveNclexStem } from "@/lib/exam-prep/nclex-bank-audit";
import { stripShiftNotes } from "@/lib/questions/shift-notes";
import { dedupeVignetteStem, hasDuplicateVignette, stripEncounterBoilerplate } from "@/lib/engine/polish/usmle-polish";

const GENERIC_RISK_OPTION = /^(?:Pain rated|Urine output|Temperature \d|Respiratory rate \d|Blood pressure \d)/i;

export function isGenericRiskBankItem(item: BankItem): boolean {
  const stem = resolveNclexStem(item);
  if (!/which finding|requires(?: immediate)? follow-up|abnormal finding|nursing follow-up/i.test(stem)) return false;
  return item.options.filter((o) => GENERIC_RISK_OPTION.test(o.trim())).length >= 2;
}

const GENERIC_TEACHING_DISTRACTORS = [/^Discourage questions to keep the discharge process efficient$/i, /^Assume understanding because the client nodded/i];

export function isGenericTeachingBankItem(item: BankItem): boolean {
  const stem = resolveNclexStem(item);
  if (!/teach|discharge|education|learning|understand/i.test(stem)) return false;
  return item.options.filter((o) => GENERIC_TEACHING_DISTRACTORS.some((re) => re.test(o.trim()))).length >= 1;
}

const GENERIC_PHARM_PATTERNS = [/Use another client's medication if the MAR is unavailable/i, /without verifying the client's identity or allergy history/i, /Document administration before giving the medication/i];

export function isGenericPharmacologyBankItem(item: BankItem): boolean {
  const stem = resolveNclexStem(item);
  if (!/medication|administer|before administering|six rights/i.test(stem)) return false;
  return item.options.filter((o) => GENERIC_PHARM_PATTERNS.some((re) => re.test(o))).length >= 2;
}

const GENERIC_COMM_PATTERNS = [/^You shouldn't feel that way/i, /overreacting so they can adjust/i];

export function isGenericCommunicationBankItem(item: BankItem): boolean {
  const stem = resolveNclexStem(item);
  if (!/therapeutic|communication|response/i.test(stem)) return false;
  return item.options.filter((o) => GENERIC_COMM_PATTERNS.some((re) => re.test(o.trim()))).length >= 1;
}

const GENERIC_INTERVENTION_PATTERNS = [/^Complete routine comfort measures for all other assigned clients before addressing abnormal findings$/i, /^Wait until the next scheduled assessment round to recheck vital signs despite acute changes$/i, /^Restrict all oral intake for 24 hours without provider order or further assessment$/i];

export function isGenericInterventionBankItem(item: BankItem): boolean {
  const stem = resolveNclexStem(item);
  if (!/priority action|take first|assess first|see first|before administering|action should the nurse/i.test(stem)) return false;
  return item.options.filter((o) => GENERIC_INTERVENTION_PATTERNS.some((re) => re.test(o.trim()))).length >= 2;
}

export function applyNclexStemRepairs(item: BankItem): BankItem {
  const question = stripEncounterBoilerplate(dedupeVignetteStem(item.question));
  const vignette = item.vignette ? stripEncounterBoilerplate(stripShiftNotes(item.vignette)) : item.vignette;
  const scenario = item.scenario ? stripEncounterBoilerplate(stripShiftNotes(item.scenario)) : item.scenario;
  let next: BankItem = { ...item, question, vignette, scenario };
  const parts = question.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  if (!next.vignette?.trim() && parts.length >= 2 && parts[0]!.length >= 60) {
    next = { ...next, vignette: parts[0], scenario: parts[0], question: parts.slice(1).join("\n\n") };
  }
  if (next.question === item.question && next.vignette === item.vignette && next.scenario === item.scenario) return item;
  return next;
}

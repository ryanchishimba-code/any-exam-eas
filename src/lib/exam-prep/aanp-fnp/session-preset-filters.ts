/**
 * Filter bank items for AANP FNP study presets (domain, lifespan, SATA, topics).
 */
import type { BankItem } from "@/lib/question-bank";
import type { AanpFnpStudyPreset } from "./study-presets";

const PEDS_AGES = new Set(["newborn", "infant", "toddler", "child", "adolescent"]);
const GERI_AGES = new Set(["older-adult"]);
const WOMENS_AGES = new Set(["adolescent", "young-adult", "middle-adult"]);

function itemTags(item: BankItem): string[] {
  const raw = item.tags;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  return String(raw)
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function itemText(item: BankItem): string {
  return [item.vignette, item.scenario, item.question, item.explanation, item.blueprintTopic]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function itemDomain(item: BankItem): string {
  return (
    item.blueprintDomain ??
    (typeof item.ngnPayload?.blueprintDomain === "string"
      ? item.ngnPayload.blueprintDomain
      : "") ??
    ""
  ).toLowerCase();
}

function itemAgeGroup(item: BankItem): string {
  return (
    item.patientAgeGroup ??
    (typeof item.ngnPayload?.patientAgeGroup === "string"
      ? item.ngnPayload.patientAgeGroup
      : "") ??
    ""
  ).toLowerCase();
}

function itemSystem(item: BankItem): string {
  return (
    item.subjectId ??
    item.topicCategory ??
    (typeof item.ngnPayload?.clinicalSystem === "string"
      ? item.ngnPayload.clinicalSystem
      : "") ??
    ""
  ).toLowerCase();
}

function matchesLifespan(item: BankItem, band: string): boolean {
  const age = itemAgeGroup(item);
  const system = itemSystem(item);
  const text = itemText(item);

  if (band === "pediatrics") {
    if (PEDS_AGES.has(age) || system === "pediatrics") return true;
    return /\b(infant|newborn|toddler|pediatric|well-child|immuniz)/i.test(text);
  }
  if (band === "geriatrics") {
    if (GERI_AGES.has(age) || system === "geriatrics") return true;
    return /\b(older adult|geriatric|beers|frailty|polypharmacy|delirium)/i.test(text);
  }
  if (band === "womens-health") {
    if (system === "womens-health") return true;
    if (WOMENS_AGES.has(age) && /contracept|prenatal|menopaus|cervical|breast cancer|pregnancy/i.test(text)) {
      return true;
    }
    return /contracept|prenatal|menopaus|pap smear|mammogram|pregnancy/i.test(text);
  }
  return true;
}

export function itemMatchesAanpFnpPreset(
  item: BankItem,
  preset: AanpFnpStudyPreset
): boolean {
  if (preset.blueprintDomain) {
    if (itemDomain(item) !== preset.blueprintDomain) return false;
  }

  if (preset.lifespanBand && !matchesLifespan(item, preset.lifespanBand)) {
    return false;
  }

  if (preset.clinicalSystem) {
    const system = itemSystem(item);
    if (system !== preset.clinicalSystem && !itemText(item).includes(preset.clinicalSystem)) {
      // Still allow if lifespan/topic filters already matched strongly via topic includes
      if (!preset.blueprintTopicIncludes?.length && !preset.lifespanBand) return false;
    }
  }

  if (preset.itemTypes?.length) {
    const type = (item.itemType ?? "").toLowerCase();
    const kind =
      typeof item.ngnPayload?.kind === "string" ? item.ngnPayload.kind.toLowerCase() : "";
    if (!preset.itemTypes.some((t) => t === type || t === kind)) return false;
  }

  if (preset.tags?.length) {
    const tags = itemTags(item).map((t) => t.toLowerCase());
    const text = itemText(item);
    const hit = preset.tags.some(
      (t) => tags.includes(t.toLowerCase()) || text.includes(t.toLowerCase())
    );
    if (!hit && !preset.blueprintTopicIncludes?.length) return false;
  }

  if (preset.blueprintTopicIncludes?.length) {
    const topic = (item.blueprintTopic ?? "").toLowerCase();
    const text = itemText(item);
    const hit = preset.blueprintTopicIncludes.some(
      (frag) => topic.includes(frag.toLowerCase()) || text.includes(frag.toLowerCase())
    );
    if (!hit) return false;
  }

  return true;
}

export function filterItemsForAanpFnpPreset(
  items: BankItem[],
  preset: AanpFnpStudyPreset,
  opts?: { strict?: boolean }
): BankItem[] {
  const matched = items.filter((item) => itemMatchesAanpFnpPreset(item, preset));
  if (matched.length > 0 || opts?.strict) return matched;
  // Soft fallback: return original pool if nothing matched (avoid empty sessions in thin banks)
  return items;
}

export function shuffleBankItems<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

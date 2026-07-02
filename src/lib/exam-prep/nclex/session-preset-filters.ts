import type { BankItem } from "@/lib/question-bank";
import type { NclexDifficultyTier, NclexStudyPreset } from "./study-presets";

const TRAP_PATTERN =
  /first|initial|priority|immediate|see first|highest priority|most appropriate.*first|before/i;
const CALC_PATTERN =
  /\b(dose|mg\/kg|mL|mcg|units|infusion|rate|gtt|tablet|calculate|how many)\b/i;

function itemTags(item: BankItem): string[] {
  const raw = item.tags;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String);
  return String(raw)
    .split(/[,;]/)
    .map((s: string) => s.trim())
    .filter(Boolean);
}

function itemText(item: BankItem): string {
  return [
    item.vignette,
    item.scenario,
    item.question,
    item.explanation,
    ...(item.options ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

export function matchesNclexDifficultyTier(item: BankItem, tier: NclexDifficultyTier): boolean {
  const tags = itemTags(item);
  const text = itemText(item);
  const stemLen = text.length;

  if (tier === "foundation") {
    return tags.includes("foundation") || tags.includes("nclex-foundation") || stemLen < 320;
  }
  if (tier === "trap") {
    return (
      tags.includes("trap-tier") ||
      tags.includes("nclex-trap") ||
      (TRAP_PATTERN.test(item.question ?? "") && stemLen >= 280)
    );
  }
  return tags.includes("exam-level") || tags.includes("curated") || stemLen >= 280;
}

export function matchesNclexStudyPreset(item: BankItem, preset: NclexStudyPreset): boolean {
  const tags = itemTags(item);
  const text = itemText(item);
  const topic = item.blueprintTopic ?? "";

  if (preset.difficultyTier && !matchesNclexDifficultyTier(item, preset.difficultyTier)) {
    return false;
  }

  if (preset.itemTypes?.length) {
    const type = (item.itemType ?? "mcq").toLowerCase();
    if (
      !preset.itemTypes.some(
        (t) => type === t || type.includes(t) || (t === "select_all" && type.includes("select"))
      )
    ) {
      return false;
    }
  }

  if (preset.tags?.length) {
    const hay = `${tags.join(" ")} ${topic} ${text}`.toLowerCase();
    if (!preset.tags.some((t) => hay.includes(t.toLowerCase()))) return false;
  }

  if (preset.blueprintTopic && topic !== preset.blueprintTopic) return false;

  switch (preset.nclexPreset) {
    case "prioritization-workshop":
      return /priorit|see first|highest priority|which client|assignment|room \d/i.test(text);
    case "sata-mastery":
      return (
        item.itemType === "select_all" ||
        tags.some((t) => /select_all|sata|select-all|sata-style/i.test(t)) ||
        (item.options?.length ?? 0) >= 5
      );
    case "dosage-calc-sprint":
      return CALC_PATTERN.test(text) || tags.some((t) => /calc|dosage/i.test(t));
    case "trap-tier-drill":
      return matchesNclexDifficultyTier(item, "trap");
    case "foundation-review":
      return matchesNclexDifficultyTier(item, "foundation");
    case "maternal-newborn-block":
      return /postpartum|preeclampsia|fhr|labor|newborn|fundus|magnesium|obstet/i.test(text);
    case "pharm-high-alert-block":
      return /insulin|heparin|warfarin|opioid|pca|naloxone|high.alert|digoxin/i.test(text);
    case "psych-communication-block":
      return /therapeutic|suicide|psych|depression|mania|anxiety|restraint|ciwa/i.test(text);
    case "electrolytes-block":
      return /potassium|sodium|calcium|magnesium|electrolyte|acid.base|hyponatremia|hyperkalemia/i.test(
        text
      );
    case "peds-block":
      return /pediatric|infant|child|immuniz|fontanel|dehydration|adolescent/i.test(text);
    case "legal-ethical-block":
      return /consent|hipaa|mandatory report|abuse|advance directive|assign.*objection|ethical/i.test(
        text
      );
    case "silent-weak-area":
      return true;
    default:
      return true;
  }
}

export function filterItemsForNclexPreset(items: BankItem[], preset: NclexStudyPreset): BankItem[] {
  const matched = items.filter((item) => matchesNclexStudyPreset(item, preset));
  if (matched.length >= Math.min(preset.count, 5)) return matched;
  return items;
}

export function shuffleBankItems<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

/**
 * Blueprint matching for AANP FNP Study Hub topics — slug tags plus content fallback.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  labelForAanpFnp2026TopicSlug,
  allAanpFnp2026TopicSlugs,
  AANP_FNP_CROSS_CUTTING_TOPICS,
} from "./blueprint-topics-2026";

function itemText(item: BankItem): string {
  return [
    item.vignette,
    item.scenario,
    item.question,
    item.explanation,
    ...(item.options ?? []),
    ...(item.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function normalizeSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^\w-]/g, "-").replace(/-+/g, "-");
}

function slugToPattern(slug: string): RegExp {
  const label = labelForAanpFnp2026TopicSlug(slug);
  const words = [...new Set([...slug.split("-"), ...label.toLowerCase().split(/[\s/(),]+/)])].filter(
    (w) => w.length > 3
  );
  if (words.length === 0) return new RegExp(slug.replace(/-/g, "[\\s-]?"), "i");
  return new RegExp(words.slice(0, 6).map((w) => `\\b${w.replace(/[^\w]/g, "")}`).join("|"), "i");
}

const KEYWORD_BY_SLUG = new Map<string, RegExp>();
for (const slug of [...allAanpFnp2026TopicSlugs(), ...AANP_FNP_CROSS_CUTTING_TOPICS.map((t) => t.slug)]) {
  KEYWORD_BY_SLUG.set(slug, slugToPattern(slug));
}

const MANUAL_PATTERNS: { slug: string; pattern: RegExp }[] = [
  { slug: "prescription-sig-codes", pattern: /\b(?:sig|abbreviation|BID|TID|PRN|prescription)\b/i },
  { slug: "pharmacology-mechanisms-monitoring", pattern: /\b(?:pharmacology|drug interaction|monitoring|side effect)\b/i },
];
for (const entry of MANUAL_PATTERNS) KEYWORD_BY_SLUG.set(entry.slug, entry.pattern);

function blueprintTagsMatch(stored: string, allowedSlug: string): boolean {
  const a = normalizeSlug(stored);
  const b = normalizeSlug(allowedSlug);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  return false;
}

export function matchesAanpFnpBlueprintTopic(item: BankItem, blueprintSlug: string): boolean {
  const pattern = KEYWORD_BY_SLUG.get(blueprintSlug) ?? slugToPattern(blueprintSlug);
  return pattern.test(itemText(item));
}

export function filterItemsForAanpFnpBlueprintTopics(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean }
): BankItem[] {
  if (blueprintTopics.length === 0) return items;

  return items.filter((item) => {
    const stored = item.blueprintTopic?.trim();
    if (stored && blueprintTopics.some((slug) => blueprintTagsMatch(stored, slug))) return true;
    if (!opts?.contentMatch) return false;
    return blueprintTopics.some((slug) => matchesAanpFnpBlueprintTopic(item, slug));
  });
}

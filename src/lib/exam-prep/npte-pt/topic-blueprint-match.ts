/**
 * Blueprint matching for NPTE-PT Study Hub topics — kebab slugs plus content fallback.
 */
import type { BankItem } from "@/lib/question-bank";
import {
  allNptePt2026TopicSlugs,
  labelForNptePt2026TopicSlug,
  NPTE_PT_CROSS_CUTTING_TOPICS,
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
  const label = labelForNptePt2026TopicSlug(slug);
  const words = [...new Set([...slug.split("-"), ...label.toLowerCase().split(/[\s/(),]+/)])].filter(
    (w) => w.length > 3
  );
  if (words.length === 0) return new RegExp(slug.replace(/-/g, "[\\s-]?"), "i");
  return new RegExp(words.slice(0, 6).map((w) => `\\b${w.replace(/[^\w]/g, "")}`).join("|"), "i");
}

const KEYWORD_BY_SLUG = new Map<string, RegExp>();
for (const slug of [...allNptePt2026TopicSlugs(), ...NPTE_PT_CROSS_CUTTING_TOPICS.map((t) => t.slug)]) {
  KEYWORD_BY_SLUG.set(slug, slugToPattern(slug));
}

const MANUAL_PATTERNS: { slug: string; pattern: RegExp }[] = [
  {
    slug: "rotator-cuff-impingement",
    pattern: /\b(?:rotator cuff|impingement|shoulder pain|Jobe|empty can)\b/i,
  },
  {
    slug: "lumbar-low-back-pain",
    pattern: /\b(?:low back pain|radiculopathy|McKenzie|lumbar)\b/i,
  },
  {
    slug: "stroke-cva-hemiplegia",
    pattern: /\b(?:stroke|CVA|hemiplegia|neuroplasticity|gait training)\b/i,
  },
  {
    slug: "informed-consent-documentation",
    pattern: /\b(?:informed consent|documentation|SOAP|legal standard)\b/i,
  },
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

export function matchesNptePtBlueprintTopic(item: BankItem, blueprintSlug: string): boolean {
  const pattern = KEYWORD_BY_SLUG.get(blueprintSlug) ?? slugToPattern(blueprintSlug);
  return pattern.test(itemText(item));
}

export function filterItemsForNptePtBlueprintTopics(
  items: BankItem[],
  blueprintTopics: string[],
  opts?: { contentMatch?: boolean }
): BankItem[] {
  if (blueprintTopics.length === 0) return items;

  return items.filter((item) => {
    const stored = item.blueprintTopic?.trim();
    if (stored && blueprintTopics.some((slug) => blueprintTagsMatch(stored, slug))) return true;
    if (!opts?.contentMatch) return false;
    return blueprintTopics.some((slug) => matchesNptePtBlueprintTopic(item, slug));
  });
}

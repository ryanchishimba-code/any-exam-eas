import { REVIEW_MODULE_CONTENT_BY_SLUG } from "@/lib/edtech/review-modules/content";
import { REVIEW_MODULE_TOPICS } from "@/lib/edtech/seeds/review-module-topics";
import type { ExamSlug } from "@/types/edtech";
import type { MemoryCard, MemoryCardKind } from "../types";

const SECTION_PRIORITY = [
  "pearls",
  "misconceptions",
  "clinical-applications",
  "core-concepts",
  "visual-aids",
  "quick-summary",
] as const;

const KIND_CYCLE: MemoryCardKind[] = ["pearl", "mistake", "fact", "pearl", "fact", "pearl"];

const SOURCE_BY_EXAM: Record<string, string> = {
  nclex: "NCLEX-RN Client Needs / clinical judgment review module",
  usmle: "USMLE Content Outline — review module synthesis",
  naplex: "NAPLEX Competency Statements — review module synthesis",
  pance: "PANCE Blueprint — review module synthesis",
  "aanp-fnp": "AANP FNP Domains — review module synthesis",
  "npte-pt": "NPTE-PT Content Outline — review module synthesis",
};

function extractBullets(slug: string): string[] {
  const content = REVIEW_MODULE_CONTENT_BY_SLUG[slug];
  if (!content) return [];
  const byId = new Map(content.sections.map((s) => [s.id, s]));
  const out: string[] = [];
  const seen = new Set<string>();
  for (const id of SECTION_PRIORITY) {
    const section = byId.get(id);
    if (!section?.bullets?.length) continue;
    for (const bullet of section.bullets) {
      const trimmed = bullet.trim();
      if (trimmed.length < 20) continue;
      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(trimmed);
    }
  }
  if (out.length < 6) {
    for (const section of content.sections) {
      for (const p of section.paragraphs ?? []) {
        for (const sentence of p.split(/(?<=[.!?])\s+/)) {
          const trimmed = sentence.trim();
          if (trimmed.length < 28) continue;
          const key = trimmed.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          out.push(trimmed);
        }
      }
    }
  }
  return out;
}

function titleFromBullet(bullet: string, index: number): string {
  const cleaned = bullet.replace(/^[-•\s]+/, "").replace(/\s+/g, " ").trim();
  const beforeDash = cleaned.split(/[—–:]/)[0]?.trim() ?? cleaned;
  if (beforeDash.length >= 8 && beforeDash.length <= 56) return beforeDash;
  const words = cleaned.split(" ").slice(0, 7).join(" ");
  return words.length >= 8 ? words : `Key point ${index + 1}`;
}

function teaserFromBullet(bullet: string): string {
  const cleaned = bullet.replace(/\s+/g, " ").trim();
  const words = cleaned.split(" ");
  const short =
    words.length > 5
      ? `${words.slice(0, 5).join(" ")}…`
      : cleaned.length >= 12
        ? `${cleaned.slice(0, Math.min(40, cleaned.length - 1))}…`
        : `${cleaned} — high yield`;
  // Quality gate rejects identical teaser/body strings.
  return short === cleaned ? `Recall: ${short}` : short;
}

function supportingBullets(all: string[], primaryIndex: number): string[] {
  const extras: string[] = [];
  for (let offset = 1; extras.length < 3 && offset < all.length; offset++) {
    const candidate = all[(primaryIndex + offset) % all.length]!;
    if (candidate === all[primaryIndex]) continue;
    extras.push(candidate.length > 140 ? `${candidate.slice(0, 137)}…` : candidate);
  }
  while (extras.length < 3) {
    extras.push("Tie the finding back to the single best next action on the vignette.");
  }
  return extras;
}

/**
 * Synthesize deep-dive memory cards from review-module bullets when a module
 * has fewer than 6 curated cards. Keeps Library ↔ Review Module linkage intact.
 */
export function buildReviewModulePadCards(existing: MemoryCard[]): MemoryCard[] {
  const countByKey = new Map<string, number>();
  for (const card of existing) {
    if (!card.reviewModuleSlug) continue;
    const key = `${card.examSlug}:${card.reviewModuleSlug}`;
    countByKey.set(key, (countByKey.get(key) ?? 0) + 1);
  }

  const pads: MemoryCard[] = [];
  const usedIds = new Set(existing.map((c) => c.id));

  for (const topic of REVIEW_MODULE_TOPICS) {
    if (!topic.reviewModule || !topic.practiceTopicSlug) continue;
    const examSlug = topic.examSlug as ExamSlug;
    const key = `${examSlug}:${topic.slug}`;
    const have = countByKey.get(key) ?? 0;
    if (have >= 6) continue;

    const bullets = extractBullets(topic.slug);
    if (bullets.length === 0) continue;

    const need = 6 - have;
    const subject = topic.title.split(":")[0]?.trim() || topic.title;
    for (let i = 0; i < need; i++) {
      const bullet = bullets[i % bullets.length]!;
      let id = `auto-${examSlug}-${topic.slug}-${i + 1}`;
      let suffix = 1;
      while (usedIds.has(id)) {
        suffix += 1;
        id = `auto-${examSlug}-${topic.slug}-${i + 1}-${suffix}`;
      }
      usedIds.add(id);

      pads.push({
        id,
        examSlug,
        subject,
        topic: subject,
        title: titleFromBullet(bullet, i),
        teaser: teaserFromBullet(bullet),
        kind: KIND_CYCLE[i % KIND_CYCLE.length]!,
        tags: ["review-module", topic.slug, examSlug],
        body: bullet.length >= 45 ? bullet : `${bullet} Keep this linked to the vignette action.`,
        bullets: supportingBullets(bullets, i % bullets.length),
        practiceTopicSlug: topic.practiceTopicSlug,
        reviewModuleSlug: topic.slug,
        sourceLabel: SOURCE_BY_EXAM[examSlug] ?? "Board review module synthesis",
        lastReviewedAt: "2026-09-05",
        sortOrder: 9000 + pads.length + 1,
      });
    }
    countByKey.set(key, 6);
  }
  return pads;
}

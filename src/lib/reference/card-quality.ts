import type { MemoryCard } from "./types";

/** Minimum content standards for published memory cards. */
export function auditMemoryCard(card: MemoryCard): string[] {
  const issues: string[] = [];
  const body = card.body.trim();
  const bullets = card.bullets?.length ?? 0;
  const rows = card.table?.rows?.length ?? 0;

  if (body.length < 45) issues.push("short-body");
  if (card.teaser.trim().length < 12) issues.push("short-teaser");
  if (card.title.trim().length < 8) issues.push("short-title");
  if (card.tags.length < 2) issues.push("few-tags");
  if (body === card.teaser.trim()) issues.push("dup-teaser-body");
  if (!card.practiceTopicSlug.trim()) issues.push("missing-practice-topic");
  if (!card.sourceLabel?.trim()) issues.push("missing-source");

  const hasRichTable = rows >= 3;
  const hasRichBullets = bullets >= 3;
  const isEquation = card.kind === "equation" && body.length >= 20;

  if (!hasRichTable && !hasRichBullets && !isEquation) {
    issues.push("insufficient-detail");
  }

  return issues;
}

export function assertMemoryCardLibraryQuality(cards: MemoryCard[]): void {
  const failures: string[] = [];
  for (const card of cards) {
    const issues = auditMemoryCard(card);
    if (issues.length) failures.push(`${card.id}: ${issues.join(", ")}`);
  }
  if (failures.length) {
    throw new Error(`Memory card quality gate failed:\n${failures.join("\n")}`);
  }
}

import type { ReferenceFocusArea, ReferenceStudyBrief } from "./study-brief-types";

const MIN_PEARL_LEN = 12;
const MAX_PEARL_LEN = 280;
const MAX_BOARD_UPDATE_LEN = 400;

function cleanString(value: unknown, maxLen: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed || trimmed.length < 4) return null;
  return trimmed.slice(0, maxLen);
}

function cleanPearls(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const pearls: string[] = [];
  for (const item of value) {
    const pearl = cleanString(item, MAX_PEARL_LEN);
    if (!pearl || pearl.length < MIN_PEARL_LEN) continue;
    if (pearls.includes(pearl)) continue;
    pearls.push(pearl);
    if (pearls.length >= 3) break;
  }
  return pearls;
}

export function sanitizeFocusAreas(
  raw: unknown,
  weakTopics: Array<{ id: string; name: string; masteryScore: number }>
): ReferenceFocusArea[] {
  if (!Array.isArray(raw)) return [];

  const weakByKey = new Map(
    weakTopics.map((t) => [
      t.id.trim().toLowerCase().replace(/^(tag|subject):/, ""),
      t,
    ])
  );

  const areas: ReferenceFocusArea[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const topicKey = cleanString(row.topicKey, 80)?.toLowerCase();
    const topicName = cleanString(row.topicName, 120);
    if (!topicKey || !topicName) continue;

    const weak = weakByKey.get(topicKey);
    const pearls = cleanPearls(row.pearls);
    const studyAction = cleanString(row.studyAction, 200);
    if (pearls.length === 0 && !studyAction) continue;

    areas.push({
      topicKey,
      topicName,
      masteryScore:
        typeof row.masteryScore === "number"
          ? Math.round(row.masteryScore)
          : weak?.masteryScore,
      pearls:
        pearls.length > 0
          ? pearls
          : [`Review high-yield ${topicName} facts before your next practice block.`],
      studyAction:
        studyAction ??
        `Open memory cards and run 10 practice questions on ${topicName}.`,
    });
    if (areas.length >= 4) break;
  }

  return areas;
}

export function sanitizeBoardUpdates(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const updates: string[] = [];
  for (const item of raw) {
    const line = cleanString(item, MAX_BOARD_UPDATE_LEN);
    if (!line) continue;
    if (updates.includes(line)) continue;
    updates.push(line);
    if (updates.length >= 6) break;
  }
  return updates;
}

export function validateReferenceBrief(brief: ReferenceStudyBrief): ReferenceStudyBrief {
  return {
    ...brief,
    headline: cleanString(brief.headline, 120) ?? "Your study brief",
    summary: cleanString(brief.summary, 600) ?? brief.summary,
    focusAreas: brief.focusAreas.filter(
      (a) => a.topicKey && a.topicName && a.pearls.length > 0
    ),
    boardUpdates: sanitizeBoardUpdates(brief.boardUpdates),
    sources: brief.sources.filter((s) => s.title && s.url),
  };
}

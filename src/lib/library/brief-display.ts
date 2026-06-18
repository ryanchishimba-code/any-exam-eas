import type { LibraryFocusArea, LibraryStudyBrief } from "./study-brief-types";

/** UI display caps — tighter than storage/validation where helpful. */
export const BRIEF_DISPLAY = {
  maxHeadlineChars: 100,
  maxSummaryChars: 320,
  maxFocusAreas: 3,
  maxPearlsPerArea: 2,
  maxBoardUpdates: 3,
  maxBoardUpdateChars: 220,
} as const;

export type BriefFocusAreaDisplay = LibraryFocusArea & {
  /** Hide boilerplate studyAction when action buttons cover it. */
  showStudyAction: boolean;
};

export type BriefDisplayModel = {
  headline: string;
  summary: string;
  focusAreas: BriefFocusAreaDisplay[];
  boardUpdates: string[];
  /** Single meta line — sources + date only. */
  metaLine: string | null;
};

function truncate(text: string, max: number): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trim()}…`;
}

function normalizeKey(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function isGenericStudyAction(action: string): boolean {
  const a = action.trim().toLowerCase();
  return (
    a.includes("open memory cards") ||
    /run \d+ practice questions/.test(a) ||
    a.startsWith("review high-yield")
  );
}

function isDuplicateOfKnown(text: string, known: Set<string>): boolean {
  const key = normalizeKey(text);
  if (key.length < 16) return false;
  for (const existing of known) {
    if (existing.includes(key) || key.includes(existing)) return true;
  }
  return false;
}

/** Trim and dedupe brief content for the Library UI. */
export function prepareBriefForDisplay(brief: LibraryStudyBrief): BriefDisplayModel {
  const headline = truncate(brief.headline, BRIEF_DISPLAY.maxHeadlineChars);
  const summary = truncate(brief.summary, BRIEF_DISPLAY.maxSummaryChars);

  const knownText = new Set<string>([normalizeKey(summary), normalizeKey(headline)]);

  const focusAreas: BriefFocusAreaDisplay[] = brief.focusAreas
    .slice(0, BRIEF_DISPLAY.maxFocusAreas)
    .map((area) => {
      const pearls = area.pearls
        .slice(0, BRIEF_DISPLAY.maxPearlsPerArea)
        .map((p) => truncate(p, 280))
        .filter((p) => {
          const key = normalizeKey(p);
          if (isDuplicateOfKnown(p, knownText)) return false;
          knownText.add(key);
          return true;
        });

      return {
        ...area,
        topicName: truncate(area.topicName, 80),
        pearls,
        showStudyAction: Boolean(
          area.studyAction?.trim() && !isGenericStudyAction(area.studyAction)
        ),
      };
    })
    .filter((area) => area.pearls.length > 0);

  const boardUpdates = brief.boardUpdates
    .slice(0, BRIEF_DISPLAY.maxBoardUpdates)
    .map((item) => truncate(item, BRIEF_DISPLAY.maxBoardUpdateChars))
    .filter((item) => {
      if (isDuplicateOfKnown(item, knownText)) return false;
      knownText.add(normalizeKey(item));
      return true;
    });

  const metaParts: string[] = [];
  if (brief.sourceCount > 0) metaParts.push(`${brief.sourceCount} cited sources`);
  metaParts.push(
    `Updated ${new Date(brief.generatedAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}`
  );

  return {
    headline,
    summary,
    focusAreas,
    boardUpdates,
    metaLine: metaParts.join(" · "),
  };
}

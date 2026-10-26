/** One H1 on /daily. The share-card alt uses the same sentence. */
export const DAILY_HERO_HEADLINE =
  "Free daily NCLEX, NAPLEX, PANCE, USMLE, FNP, NPTE-PT practice question";

export const DAILY_HERO_LEAD = "Free daily NCLEX, NAPLEX, PANCE,";

export const DAILY_HERO_ACCENT = "USMLE, FNP, NPTE-PT practice question";

/** Rendered document title. Absolute, so the site-name template cannot push it past 60. */
export const DAILY_PAGE_TITLE = "Free Daily Practice Question for Six Boards";

export const DAILY_PAGE_DESCRIPTION =
  "Free daily NCLEX, NAPLEX, PANCE, USMLE, FNP, and NPTE-PT practice question with the rationale. No signup. A new item for every board each day.";

export function dailyExamTitle(name: string): string {
  return `Free Daily ${name} Practice Question`;
}

/** Description stays at or under 155 characters and names the board. */
export function dailyExamDescription(name: string, stem: string): string {
  const lead = `Free daily ${name} practice question. `;
  const note = " The rationale is on this page.";
  const full = `${lead}${stem.trim()}${note}`;
  if (full.length <= 155) return full;
  const room = 155 - lead.length - 1;
  return `${lead}${stem.trim().slice(0, Math.max(0, room)).trimEnd()}…`;
}

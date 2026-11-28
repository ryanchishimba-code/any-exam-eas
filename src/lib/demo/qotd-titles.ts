import { SITE_NAME } from "@/lib/site";

/** Rendered hub title. Absolute so the root template does not add the brand twice. */
export const QOTD_HUB_TITLE = `Question of the Day — Free Board Exam Practice | ${SITE_NAME}`;

export function qotdExamTitle(boardName: string): string {
  return `${boardName} Question of the Day | ${SITE_NAME}`;
}

export function qotdDatedTitle(boardName: string, isoDate: string): string {
  return `${boardName} Question of the Day — ${isoDate} | ${SITE_NAME}`;
}

import { TRIAL_DAYS } from "@/lib/billing-config";
import { SEO_DESC_MAX, SEO_DESC_MIN } from "@/lib/seo/meta-budget";
import { SITE_NAME } from "@/lib/site";

/** Rendered hub title. Absolute so the root template does not add the brand twice. */
export const QOTD_HUB_TITLE = `Question of the Day — Free Board Exam Practice | ${SITE_NAME}`;

export function qotdExamTitle(boardName: string): string {
  return `${boardName} Question of the Day | ${SITE_NAME}`;
}

export function qotdDatedTitle(boardName: string, isoDate: string): string {
  return `${boardName} Question of the Day — ${isoDate} | ${SITE_NAME}`;
}

/** Dated and per-exam descriptions stay inside 140–160. Stems are cut on a word boundary. */
export function qotdMetaDescription(boardName: string, stem: string): string {
  const tail = ` ${boardName} question of the day. Try it, then a ${TRIAL_DAYS}-day free trial.`;
  const room = SEO_DESC_MAX - tail.length;
  let head = stem.replace(/\s+/g, " ").trim();
  if (head.length > room) {
    const cut = head.slice(0, room);
    const space = cut.lastIndexOf(" ");
    head = (space > 24 ? cut.slice(0, space) : cut).trimEnd().replace(/[.,;:]+$/, "");
  }
  let out = `${head}${tail}`.replace(/\s+/g, " ").trim();
  const filler = " No account is required to answer.";
  if (out.length < SEO_DESC_MIN && out.length + filler.length <= SEO_DESC_MAX) {
    out = `${out}${filler}`;
  }
  if (out.length > SEO_DESC_MAX) {
    out = out.slice(0, SEO_DESC_MAX).replace(/\s+\S*$/, "").trimEnd();
  }
  return out;
}
